import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * HTML转图片功能测试
 * 测试HTML页面转换为图片的功能
 */

// 模拟Puppeteer
vi.mock('@cloudflare/puppeteer', () => ({
  default: {
    launch: vi.fn(() => Promise.resolve({
      newPage: vi.fn(() => Promise.resolve({
        setContent: vi.fn(),
        waitForNetworkIdle: vi.fn(),
        screenshot: vi.fn()
      })),
      close: vi.fn()
    }))
  }
}))

// 模拟Cloudflare环境
vi.mock('cloudflare:workers', () => ({
  env: {
    MYBROWSER: 'mock-browser'
  }
}))

// 模拟KV模块
vi.mock('../src/kv', () => ({
  KV: {
    get: vi.fn()
  }
}))

import { html2image, htmlToImageByKvKey } from '../src/html2image'
import { KV } from '../src/kv'

const mockKV = KV as any

describe('HTML转图片功能测试', () => {
  beforeEach(() => {
    // 重置所有mock
    vi.clearAllMocks()
  })

  describe('html2image函数', () => {
    it('应该是一个函数', () => {
      expect(typeof html2image).toBe('function')
    })

    it('应该接受HTML字符串参数', () => {
      expect(html2image.length).toBe(1)
    })
  })

  describe('htmlToImageByKvKey方法测试', () => {
    it('应该是一个函数', () => {
      expect(typeof htmlToImageByKvKey).toBe('function')
    })

    it('应该接受pageId参数', () => {
      expect(htmlToImageByKvKey.length).toBe(1)
    })

    it('应该处理页面不存在的情况', async () => {
      const pageId = 'nonexistent'
      
      // 模拟KV返回没有data的结果
      mockKV.get.mockResolvedValue({ state: false, message: '页面不存在', data: null })
      
      const result = await htmlToImageByKvKey(pageId)
      
      expect(result.state).toBe(false)
      expect(result.message).toBe('页面不存在')
      expect(mockKV.get).toHaveBeenCalledWith(pageId)
    })

    it('应该处理KV返回数据为空的情况', async () => {
      const pageId = 'empty'
      
      // 模拟KV返回没有data的结果
      mockKV.get.mockResolvedValue({ state: false, message: '页面不存在', data: undefined })
      
      const result = await htmlToImageByKvKey(pageId)
      
      expect(result.state).toBe(false)
      expect(result.message).toBe('页面不存在')
    })
  })
})