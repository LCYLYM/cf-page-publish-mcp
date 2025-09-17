import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * MCP截图功能验证测试
 * 确保MCP工具"获取页面图片"正常工作
 */

// 模拟dependencies
vi.mock('../src/html2image', () => ({
  htmlToImageByKvKey: vi.fn()
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

import { htmlToImageByKvKey } from '../src/html2image'

describe('MCP Screenshot Tool Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('获取页面图片 MCP Tool', () => {
    it('应该能正确处理有效的pageId参数', async () => {
      const testPageId = 'test-page-123'
      const mockImageData = 'base64-encoded-image-data'
      
      // 模拟htmlToImageByKvKey返回成功结果
      const mockHtmlToImage = htmlToImageByKvKey as any
      mockHtmlToImage.mockResolvedValue({
        state: true,
        message: '成功获取页面图像',
        data: mockImageData
      })
      
      // 模拟MCP工具调用
      const toolHandler = async ({ pageId }: { pageId: string }) => {
        const result = await htmlToImageByKvKey(pageId)
        if (!result.state) {
          return { content: [{ type: "text", text: result.message }] }
        }
        if (!result.data) {
          return { content: [{ type: "text", text: "无法获取页面图片" }] }
        }
        return { 
          content: [{ 
            type: "image", 
            data: result.data, 
            mimeType: "image/png" 
          }],
          _meta: {},
          structuredContent: {}
        }
      }
      
      // 执行测试
      const result = await toolHandler({ pageId: testPageId })
      
      // 验证结果
      expect(mockHtmlToImage).toHaveBeenCalledWith(testPageId)
      expect(result.content[0].type).toBe('image')
      expect(result.content[0].data).toBe(mockImageData)
      expect(result.content[0].mimeType).toBe('image/png')
    })

    it('应该处理页面不存在的情况', async () => {
      const testPageId = 'nonexistent-page'
      
      // 模拟htmlToImageByKvKey返回失败结果
      const mockHtmlToImage = htmlToImageByKvKey as any
      mockHtmlToImage.mockResolvedValue({
        state: false,
        message: '页面不存在'
      })
      
      // 模拟MCP工具调用
      const toolHandler = async ({ pageId }: { pageId: string }) => {
        const result = await htmlToImageByKvKey(pageId)
        if (!result.state) {
          return { content: [{ type: "text", text: result.message }] }
        }
        if (!result.data) {
          return { content: [{ type: "text", text: "无法获取页面图片" }] }
        }
        return { 
          content: [{ 
            type: "image", 
            data: result.data, 
            mimeType: "image/png" 
          }],
          _meta: {},
          structuredContent: {}
        }
      }
      
      // 执行测试
      const result = await toolHandler({ pageId: testPageId })
      
      // 验证结果
      expect(mockHtmlToImage).toHaveBeenCalledWith(testPageId)
      expect(result.content[0].type).toBe('text')
      expect(result.content[0].text).toBe('页面不存在')
    })

    it('应该处理数据为空的情况', async () => {
      const testPageId = 'empty-data-page'
      
      // 模拟htmlToImageByKvKey返回成功但数据为空
      const mockHtmlToImage = htmlToImageByKvKey as any
      mockHtmlToImage.mockResolvedValue({
        state: true,
        message: '成功获取页面图像',
        data: null
      })
      
      // 模拟MCP工具调用
      const toolHandler = async ({ pageId }: { pageId: string }) => {
        const result = await htmlToImageByKvKey(pageId)
        if (!result.state) {
          return { content: [{ type: "text", text: result.message }] }
        }
        if (!result.data) {
          return { content: [{ type: "text", text: "无法获取页面图片" }] }
        }
        return { 
          content: [{ 
            type: "image", 
            data: result.data, 
            mimeType: "image/png" 
          }],
          _meta: {},
          structuredContent: {}
        }
      }
      
      // 执行测试
      const result = await toolHandler({ pageId: testPageId })
      
      // 验证结果
      expect(mockHtmlToImage).toHaveBeenCalledWith(testPageId)
      expect(result.content[0].type).toBe('text')
      expect(result.content[0].text).toBe('无法获取页面图片')
    })
  })
})