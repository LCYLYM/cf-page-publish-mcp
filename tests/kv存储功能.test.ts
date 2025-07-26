import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * KV存储功能测试
 * 测试页面内容的增删改查操作
 */

// 模拟Cloudflare环境
vi.mock('cloudflare:workers', () => ({
  env: {
    KV: {
      put: vi.fn(),
      get: vi.fn(),
      delete: vi.fn()
    }
  }
}))

// 模拟拼音转换函数
vi.mock('../src/pinyin', () => ({
  usePinyin: vi.fn((title: string) => 'CeShiYeMian')
}))

import { KV } from '../src/kv'
import { env } from 'cloudflare:workers'

const mockKV = env.KV as any

describe('KV存储功能测试', () => {
  beforeEach(() => {
    // 每个测试前重置mock
    vi.clearAllMocks()
  })

  describe('put方法测试', () => {
    it('应该成功存储有效的HTML内容', async () => {
      // 准备测试数据
      const pageContent = {
        title: '测试页面',
        content: '<html><body>测试内容</body></html>'
      }
      
      // 模拟KV.put成功
      mockKV.put.mockResolvedValue(undefined)
      
      // 执行测试
      const result = await KV.put(pageContent)
      
      // 验证结果
      expect(result.state).toBe(true)
      expect(result.message).toBe('存放成功')
      expect(result.data?.key).toMatch(/^CeShiYeMian[A-Za-z]{8}$/)
      expect(mockKV.put).toHaveBeenCalledWith(
        expect.stringMatching(/^CeShiYeMian[A-Za-z]{8}$/),
        pageContent.content
      )
    })

    it('应该拒绝无效的HTML格式', async () => {
      // 准备无效HTML数据
      const pageContent = {
        title: '测试页面',
        content: '这不是HTML格式'
      }
      
      // 执行测试
      const result = await KV.put(pageContent)
      
      // 验证结果
      expect(result.state).toBe(false)
      expect(result.message).toBe('存放失败，content不是标准HTML格式')
      expect(result.data).toBeUndefined()
      expect(mockKV.put).not.toHaveBeenCalled()
    })

    it('应该处理KV存储错误', async () => {
      // 准备测试数据
      const pageContent = {
        title: '测试页面',
        content: '<html><body>测试内容</body></html>'
      }
      
      // 模拟KV.put失败
      const error = new Error('KV存储失败')
      mockKV.put.mockRejectedValue(error)
      
      // 执行测试
      const result = await KV.put(pageContent)
      
      // 验证结果
      expect(result.state).toBe(false)
      expect(result.message).toContain('存放失败,info:')
    })
  })

  describe('get方法测试', () => {
    it('应该成功获取存在的页面内容', async () => {
      // 准备测试数据
      const key = 'CeShiYeMianABCDEFGH'
      const content = '<html><body>测试内容</body></html>'
      
      // 模拟KV.get成功
      mockKV.get.mockResolvedValue(content)
      
      // 执行测试
      const result = await KV.get(key)
      
      // 验证结果
      expect(result.state).toBe(true)
      expect(result.message).toBe('获取成功')
      expect(result.data).toBe(content)
      expect(mockKV.get).toHaveBeenCalledWith(key)
    })

    it('应该处理不存在的页面', async () => {
      // 准备测试数据
      const key = 'nonexistent'
      
      // 模拟KV.get返回null
      mockKV.get.mockResolvedValue(null)
      
      // 执行测试
      const result = await KV.get(key)
      
      // 验证结果
      expect(result.state).toBe(false)
      expect(result.message).toBe('获取失败，key不存在')
      expect(result.data).toBeUndefined()
    })

    it('应该处理KV获取错误', async () => {
      // 准备测试数据
      const key = 'testkey'
      
      // 模拟KV.get失败
      const error = new Error('KV获取失败')
      mockKV.get.mockRejectedValue(error)
      
      // 执行测试
      const result = await KV.get(key)
      
      // 验证结果
      expect(result.state).toBe(false)
      expect(result.message).toContain('获取失败，info：')
    })
  })

  describe('update方法测试', () => {
    it('应该成功更新存在的页面', async () => {
      // 准备测试数据
      const key = 'CeShiYeMianABCDEFGH'
      const pageContent = {
        title: '更新的页面',
        content: '<html><body>更新的内容</body></html>'
      }
      
      // 模拟页面存在
      mockKV.get.mockResolvedValue('<html><body>原内容</body></html>')
      mockKV.put.mockResolvedValue(undefined)
      
      // 执行测试
      const result = await KV.update(key, pageContent)
      
      // 验证结果
      expect(result.state).toBe(true)
      expect(result.message).toBe('更新成功')
      expect(result.data?.key).toBe(key)
      expect(mockKV.get).toHaveBeenCalledWith(key)
      expect(mockKV.put).toHaveBeenCalledWith(key, pageContent.content)
    })

    it('应该拒绝更新不存在的页面', async () => {
      // 准备测试数据
      const key = 'nonexistent'
      const pageContent = {
        title: '测试页面',
        content: '<html><body>测试内容</body></html>'
      }
      
      // 模拟页面不存在
      mockKV.get.mockResolvedValue(null)
      
      // 执行测试
      const result = await KV.update(key, pageContent)
      
      // 验证结果
      expect(result.state).toBe(false)
      expect(result.message).toBe('更新失败，页面不存在')
      expect(mockKV.put).not.toHaveBeenCalled()
    })
  })

  describe('delete方法测试', () => {
    it('应该成功删除存在的页面', async () => {
      // 准备测试数据
      const key = 'CeShiYeMianABCDEFGH'
      
      // 模拟页面存在
      mockKV.get.mockResolvedValue('<html><body>测试内容</body></html>')
      mockKV.delete.mockResolvedValue(undefined)
      
      // 执行测试
      const result = await KV.delete(key)
      
      // 验证结果
      expect(result.state).toBe(true)
      expect(result.message).toBe('删除成功')
      expect(mockKV.get).toHaveBeenCalledWith(key)
      expect(mockKV.delete).toHaveBeenCalledWith(key)
    })

    it('应该拒绝删除不存在的页面', async () => {
      // 准备测试数据
      const key = 'nonexistent'
      
      // 模拟页面不存在
      mockKV.get.mockResolvedValue(null)
      
      // 执行测试
      const result = await KV.delete(key)
      
      // 验证结果
      expect(result.state).toBe(false)
      expect(result.message).toBe('删除失败，页面不存在')
      expect(mockKV.delete).not.toHaveBeenCalled()
    })
  })
})