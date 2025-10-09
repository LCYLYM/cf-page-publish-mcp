import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * 统计功能测试
 * 测试页面统计、访客计数等功能
 */

// 模拟Cloudflare环境
vi.mock('cloudflare:workers', () => ({
  env: {
    KV: {
      get: vi.fn(),
      put: vi.fn(),
      list: vi.fn()
    }
  }
}))

// 模拟拼音转换函数
vi.mock('../src/pinyin', () => ({
  usePinyin: vi.fn((title: string) => 'Test')
}))

import { KV } from '../src/kv'
import { env } from 'cloudflare:workers'

const mockKV = env.KV as any

describe('统计功能测试', () => {
  beforeEach(() => {
    // 每个测试前重置mock
    vi.clearAllMocks()
  })

  describe('getStats方法测试', () => {
    it('应该成功获取统计信息', async () => {
      // 模拟KV.list返回数据
      mockKV.list.mockResolvedValue({
        keys: [
          { name: 'page1' },
          { name: 'page2' },
          { name: 'screenshot_page1' },
          { name: 'screenshot_page2' },
          { name: 'stats_visitor_count' }
        ],
        list_complete: true,
        cacheStatus: null
      })

      // 模拟访客计数
      mockKV.get.mockResolvedValue('100')

      // 执行测试
      const result = await KV.getStats()

      // 验证结果
      expect(result.state).toBe(true)
      expect(result.message).toBe('获取统计信息成功')
      expect(result.data?.pageCount).toBe(2) // page1, page2
      expect(result.data?.screenshotCount).toBe(2) // screenshot_page1, screenshot_page2
      expect(result.data?.visitorCount).toBe(100)
    })

    it('应该正确过滤统计键', async () => {
      // 模拟KV.list返回数据
      mockKV.list.mockResolvedValue({
        keys: [
          { name: 'page1' },
          { name: 'stats_visitor_count' },
          { name: 'stats_other' }
        ],
        list_complete: true,
        cacheStatus: null
      })

      // 模拟访客计数
      mockKV.get.mockResolvedValue('50')

      // 执行测试
      const result = await KV.getStats()

      // 验证结果
      expect(result.state).toBe(true)
      expect(result.data?.pageCount).toBe(1) // 只有page1
      expect(result.data?.screenshotCount).toBe(0)
    })

    it('应该处理没有访客数据的情况', async () => {
      // 模拟KV.list返回数据
      mockKV.list.mockResolvedValue({
        keys: [
          { name: 'page1' }
        ],
        list_complete: true,
        cacheStatus: null
      })

      // 模拟没有访客计数
      mockKV.get.mockResolvedValue(null)

      // 执行测试
      const result = await KV.getStats()

      // 验证结果
      expect(result.state).toBe(true)
      expect(result.data?.visitorCount).toBe(0)
    })

    it('应该处理KV错误', async () => {
      // 模拟KV.list失败
      const error = new Error('KV list失败')
      mockKV.list.mockRejectedValue(error)

      // 执行测试
      const result = await KV.getStats()

      // 验证结果
      expect(result.state).toBe(false)
      expect(result.message).toContain('获取统计信息失败')
    })
  })

  describe('list方法测试', () => {
    it('应该成功列出所有键', async () => {
      // 模拟KV.list返回数据
      mockKV.list.mockResolvedValue({
        keys: [
          { name: 'page1' },
          { name: 'page2' },
          { name: 'page3' }
        ],
        list_complete: true,
        cacheStatus: null
      })

      // 执行测试
      const result = await KV.list()

      // 验证结果
      expect(result.state).toBe(true)
      expect(result.message).toBe('获取列表成功')
      expect(result.data?.keys).toEqual(['page1', 'page2', 'page3'])
    })

    it('应该支持前缀过滤', async () => {
      // 模拟KV.list返回数据
      mockKV.list.mockResolvedValue({
        keys: [
          { name: 'screenshot_page1' },
          { name: 'screenshot_page2' }
        ],
        list_complete: true,
        cacheStatus: null
      })

      // 执行测试
      const result = await KV.list('screenshot_')

      // 验证结果
      expect(result.state).toBe(true)
      expect(result.data?.keys).toEqual(['screenshot_page1', 'screenshot_page2'])
      expect(mockKV.list).toHaveBeenCalledWith({ prefix: 'screenshot_' })
    })

    it('应该支持限制数量', async () => {
      // 模拟KV.list返回数据
      mockKV.list.mockResolvedValue({
        keys: [
          { name: 'page1' }
        ],
        list_complete: false,
        cacheStatus: null
      })

      // 执行测试
      const result = await KV.list(undefined, 1)

      // 验证结果
      expect(result.state).toBe(true)
      expect(result.data?.keys.length).toBe(1)
      expect(mockKV.list).toHaveBeenCalledWith({ limit: 1 })
    })

    it('应该处理KV错误', async () => {
      // 模拟KV.list失败
      const error = new Error('KV list失败')
      mockKV.list.mockRejectedValue(error)

      // 执行测试
      const result = await KV.list()

      // 验证结果
      expect(result.state).toBe(false)
      expect(result.message).toContain('获取列表失败')
    })
  })
})
