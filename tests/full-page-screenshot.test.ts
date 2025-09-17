import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * 全页面截图和图片链接功能测试
 * 验证新的截图URL功能和全页面截图能力
 */

// 模拟依赖
vi.mock('../src/kv', () => ({
  KV: {
    get: vi.fn(),
    putImage: vi.fn(),
    getImage: vi.fn()
  }
}))

vi.mock('@cloudflare/puppeteer', () => ({
  default: {
    launch: vi.fn()
  }
}))

vi.mock('cloudflare:workers', () => ({
  env: {
    MYBROWSER: 'mock-browser',
    KV: {}
  }
}))

import { html2image, htmlToImageUrlByKvKey } from '../src/html2image'
import { KV } from '../src/kv'

describe('全页面截图功能', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('html2image function', () => {
    it('应该支持全页面截图参数', async () => {
      // 模拟puppeteer
      const mockPage = {
        setContent: vi.fn(),
        waitForNetworkIdle: vi.fn(),
        screenshot: vi.fn().mockResolvedValue(Buffer.from('fake-image-data', 'utf8'))
      }
      const mockBrowser = {
        newPage: vi.fn().mockResolvedValue(mockPage),
        close: vi.fn()
      }
      
      const puppeteer = await import('@cloudflare/puppeteer')
      ;(puppeteer.default.launch as any).mockResolvedValue(mockBrowser)

      // 测试全页面截图
      const html = '<html><body>Test content</body></html>'
      await html2image(html, true)

      // 验证screenshot被调用时传入了fullPage参数
      expect(mockPage.screenshot).toHaveBeenCalledWith({ fullPage: true })
    })

    it('应该支持普通截图参数', async () => {
      // 模拟puppeteer
      const mockPage = {
        setContent: vi.fn(),
        waitForNetworkIdle: vi.fn(),
        screenshot: vi.fn().mockResolvedValue(Buffer.from('fake-image-data', 'utf8'))
      }
      const mockBrowser = {
        newPage: vi.fn().mockResolvedValue(mockPage),
        close: vi.fn()
      }
      
      const puppeteer = await import('@cloudflare/puppeteer')
      ;(puppeteer.default.launch as any).mockResolvedValue(mockBrowser)

      // 测试普通截图
      const html = '<html><body>Test content</body></html>'
      await html2image(html, false)

      // 验证screenshot被调用时传入了fullPage: false参数
      expect(mockPage.screenshot).toHaveBeenCalledWith({ fullPage: false })
    })
  })

  describe('htmlToImageUrlByKvKey function', () => {
    it('应该返回图片URL而不是base64数据', async () => {
      const pageId = 'test-page-123'
      const htmlContent = '<html><body><div style="height: 2000px;">Long content</div></body></html>'
      const imageId = 'img_test-page-123_abc123'
      
      // 模拟KV.get返回页面内容
      const mockKV = KV as any
      mockKV.get.mockResolvedValue({
        state: true,
        data: htmlContent
      })
      
      // 模拟KV.putImage存储图片
      mockKV.putImage.mockResolvedValue({
        state: true,
        message: '图片存储成功',
        data: { imageId }
      })
      
      // 模拟puppeteer
      const mockPage = {
        setContent: vi.fn(),
        waitForNetworkIdle: vi.fn(),
        screenshot: vi.fn().mockResolvedValue(Buffer.from('fake-screenshot-data', 'utf8'))
      }
      const mockBrowser = {
        newPage: vi.fn().mockResolvedValue(mockPage),
        close: vi.fn()
      }
      
      const puppeteer = await import('@cloudflare/puppeteer')
      ;(puppeteer.default.launch as any).mockResolvedValue(mockBrowser)
      
      // 执行函数
      const result = await htmlToImageUrlByKvKey(pageId)
      
      // 验证结果
      expect(result.state).toBe(true)
      expect(result.message).toBe('成功生成页面图片链接')
      expect(result.data).toBe(`/image/${imageId}`)
      
      // 验证调用了正确的函数
      expect(mockKV.get).toHaveBeenCalledWith(pageId)
      expect(mockPage.screenshot).toHaveBeenCalledWith({ fullPage: true })
      expect(mockKV.putImage).toHaveBeenCalledWith(pageId, expect.any(String))
    })

    it('应该处理页面不存在的情况', async () => {
      const pageId = 'nonexistent-page'
      
      // 模拟KV.get返回页面不存在
      const mockKV = KV as any
      mockKV.get.mockResolvedValue({
        state: true,
        data: null
      })
      
      // 执行函数
      const result = await htmlToImageUrlByKvKey(pageId)
      
      // 验证结果
      expect(result.state).toBe(false)
      expect(result.message).toBe('页面不存在')
    })

    it('应该处理图片存储失败的情况', async () => {
      const pageId = 'test-page-123'
      const htmlContent = '<html><body>Test content</body></html>'
      
      // 模拟KV.get返回页面内容
      const mockKV = KV as any
      mockKV.get.mockResolvedValue({
        state: true,
        data: htmlContent
      })
      
      // 模拟KV.putImage存储失败
      mockKV.putImage.mockResolvedValue({
        state: false,
        message: '存储失败'
      })
      
      // 模拟puppeteer
      const mockPage = {
        setContent: vi.fn(),
        waitForNetworkIdle: vi.fn(),
        screenshot: vi.fn().mockResolvedValue(Buffer.from('fake-screenshot-data', 'utf8'))
      }
      const mockBrowser = {
        newPage: vi.fn().mockResolvedValue(mockPage),
        close: vi.fn()
      }
      
      const puppeteer = await import('@cloudflare/puppeteer')
      ;(puppeteer.default.launch as any).mockResolvedValue(mockBrowser)
      
      // 执行函数
      const result = await htmlToImageUrlByKvKey(pageId)
      
      // 验证结果
      expect(result.state).toBe(false)
      expect(result.message).toBe('存储失败')
    })
  })
})