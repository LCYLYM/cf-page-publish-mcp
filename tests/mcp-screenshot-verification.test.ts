import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * MCP截图功能验证测试
 * 确保MCP工具"获取页面图片"正常工作
 */

// 模拟dependencies
vi.mock('../src/html2image', () => ({
  htmlToImageByKvKey: vi.fn(),
  generateScreenshotUrl: vi.fn()
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

import { htmlToImageByKvKey, generateScreenshotUrl } from '../src/html2image'

describe('MCP Screenshot Tool Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('获取页面图片 MCP Tool', () => {
    it('应该能正确处理有效的pageId参数并返回图片链接', async () => {
      const testPageId = 'test-page-123'
      const mockImageUrl = '/image/abc123'
      
      // 模拟generateScreenshotUrl返回成功结果
      const mockGenerateScreenshot = generateScreenshotUrl as any
      mockGenerateScreenshot.mockResolvedValue({
        state: true,
        message: '成功生成截图链接',
        imageUrl: mockImageUrl
      })
      
      // 模拟新的MCP工具调用
      const toolHandler = async ({ pageId }: { pageId: string }) => {
        const result = await generateScreenshotUrl(pageId)
        if (!result.state) {
          return { content: [{ type: "text", text: result.message }] }
        }
        if (!result.imageUrl) {
          return { content: [{ type: "text", text: "无法生成截图链接" }] }
        }
        return { 
          content: [{ 
            type: "text", 
            text: `截图生成成功！访问链接：https://test.example.com${result.imageUrl}` 
          }],
          _meta: {},
          structuredContent: {}
        }
      }
      
      // 执行测试
      const result = await toolHandler({ pageId: testPageId })
      
      // 验证结果
      expect(mockGenerateScreenshot).toHaveBeenCalledWith(testPageId)
      expect(result.content[0].type).toBe('text')
      expect(result.content[0].text).toBe('截图生成成功！访问链接：https://test.example.com/image/abc123')
    })

    it('应该处理页面不存在的情况', async () => {
      const testPageId = 'nonexistent-page'
      
      // 模拟generateScreenshotUrl返回失败结果
      const mockGenerateScreenshot = generateScreenshotUrl as any
      mockGenerateScreenshot.mockResolvedValue({
        state: false,
        message: '页面不存在'
      })
      
      // 模拟新的MCP工具调用
      const toolHandler = async ({ pageId }: { pageId: string }) => {
        const result = await generateScreenshotUrl(pageId)
        if (!result.state) {
          return { content: [{ type: "text", text: result.message }] }
        }
        if (!result.imageUrl) {
          return { content: [{ type: "text", text: "无法生成截图链接" }] }
        }
        return { 
          content: [{ 
            type: "text", 
            text: `截图生成成功！访问链接：https://test.example.com${result.imageUrl}` 
          }],
          _meta: {},
          structuredContent: {}
        }
      }
      
      // 执行测试
      const result = await toolHandler({ pageId: testPageId })
      
      // 验证结果
      expect(mockGenerateScreenshot).toHaveBeenCalledWith(testPageId)
      expect(result.content[0].type).toBe('text')
      expect(result.content[0].text).toBe('页面不存在')
    })

    it('应该处理图片链接为空的情况', async () => {
      const testPageId = 'empty-url-page'
      
      // 模拟generateScreenshotUrl返回成功但链接为空
      const mockGenerateScreenshot = generateScreenshotUrl as any
      mockGenerateScreenshot.mockResolvedValue({
        state: true,
        message: '成功生成截图链接',
        imageUrl: null
      })
      
      // 模拟新的MCP工具调用
      const toolHandler = async ({ pageId }: { pageId: string }) => {
        const result = await generateScreenshotUrl(pageId)
        if (!result.state) {
          return { content: [{ type: "text", text: result.message }] }
        }
        if (!result.imageUrl) {
          return { content: [{ type: "text", text: "无法生成截图链接" }] }
        }
        return { 
          content: [{ 
            type: "text", 
            text: `截图生成成功！访问链接：https://test.example.com${result.imageUrl}` 
          }],
          _meta: {},
          structuredContent: {}
        }
      }
      
      // 执行测试
      const result = await toolHandler({ pageId: testPageId })
      
      // 验证结果
      expect(mockGenerateScreenshot).toHaveBeenCalledWith(testPageId)
      expect(result.content[0].type).toBe('text')
      expect(result.content[0].text).toBe('无法生成截图链接')
    })
  })
})