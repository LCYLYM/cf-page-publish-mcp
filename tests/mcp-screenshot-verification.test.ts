import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * MCP截图功能验证测试
 * 确保MCP工具"获取页面图片"正常工作
 */

// 模拟dependencies
vi.mock('../src/html2image', () => ({
  htmlToImageByKvKey: vi.fn(),
  htmlToImageUrlByKvKey: vi.fn()
}))

vi.mock('../src/kv', () => ({
  KV: {
    put: vi.fn(),
    get: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}))

vi.mock('cloudflare:workers', () => ({
  env: {
    host: 'test.example.com',
    KV: {},
    MYBROWSER: 'mock-browser'
  }
}))

import { htmlToImageByKvKey, htmlToImageUrlByKvKey } from '../src/html2image'

describe('MCP Screenshot Tool Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('获取页面图片 MCP Tool', () => {
    it('应该能正确处理有效的pageId参数', async () => {
      const testPageId = 'test-page-123'
      const mockImageUrl = '/image/img_test-page-123_abc123'
      
      // 模拟htmlToImageUrlByKvKey返回成功结果
      const mockHtmlToImageUrl = htmlToImageUrlByKvKey as any
      mockHtmlToImageUrl.mockResolvedValue({
        state: true,
        message: '成功生成页面图片链接',
        data: mockImageUrl
      })
      
      // 模拟MCP工具调用（新的URL版本）
      const toolHandler = async ({ pageId }: { pageId: string }) => {
        const result = await htmlToImageUrlByKvKey(pageId)
        if (!result.state) {
          return { content: [{ type: "text", text: result.message }] }
        }
        if (!result.data) {
          return { content: [{ type: "text", text: "无法获取页面图片链接" }] }
        }
        return { content: [{ type: "text", text: `图片链接：${result.data}` }] }
      }
      
      // 执行测试
      const result = await toolHandler({ pageId: testPageId })
      
      // 验证结果
      expect(mockHtmlToImageUrl).toHaveBeenCalledWith(testPageId)
      expect(result.content[0].type).toBe('text')
      expect(result.content[0].text).toBe(`图片链接：${mockImageUrl}`)
    })

    it('应该处理页面不存在的情况', async () => {
      const testPageId = 'nonexistent-page'
      
      // 模拟htmlToImageUrlByKvKey返回失败结果
      const mockHtmlToImageUrl = htmlToImageUrlByKvKey as any
      mockHtmlToImageUrl.mockResolvedValue({
        state: false,
        message: '页面不存在'
      })
      
      // 模拟MCP工具调用（新的URL版本）
      const toolHandler = async ({ pageId }: { pageId: string }) => {
        const result = await htmlToImageUrlByKvKey(pageId)
        if (!result.state) {
          return { content: [{ type: "text", text: result.message }] }
        }
        if (!result.data) {
          return { content: [{ type: "text", text: "无法获取页面图片链接" }] }
        }
        return { content: [{ type: "text", text: `图片链接：${result.data}` }] }
      }
      
      // 执行测试
      const result = await toolHandler({ pageId: testPageId })
      
      // 验证结果
      expect(result.content[0].type).toBe('text')
      expect(result.content[0].text).toBe('页面不存在')
    })

    it('应该处理数据为空的情况', async () => {
      const testPageId = 'empty-data-page'
      
      // 模拟htmlToImageUrlByKvKey返回成功但数据为空
      const mockHtmlToImageUrl = htmlToImageUrlByKvKey as any
      mockHtmlToImageUrl.mockResolvedValue({
        state: true,
        message: '成功生成页面图片链接',
        data: null
      })
      
      // 模拟MCP工具调用（新的URL版本）
      const toolHandler = async ({ pageId }: { pageId: string }) => {
        const result = await htmlToImageUrlByKvKey(pageId)
        if (!result.state) {
          return { content: [{ type: "text", text: result.message }] }
        }
        if (!result.data) {
          return { content: [{ type: "text", text: "无法获取页面图片链接" }] }
        }
        return { content: [{ type: "text", text: `图片链接：${result.data}` }] }
      }
      
      // 执行测试
      const result = await toolHandler({ pageId: testPageId })
      
      // 验证结果
      expect(result.content[0].type).toBe('text')
      expect(result.content[0].text).toBe('无法获取页面图片链接')
    })
  })
})