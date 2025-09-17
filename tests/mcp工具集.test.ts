import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * MCP工具集功能测试
 * 测试MCP服务器工具的各项功能
 */

// 模拟依赖模块
vi.mock('@modelcontextprotocol/sdk/server/mcp.js', () => ({
  McpServer: vi.fn().mockImplementation(() => ({
    tool: vi.fn()
  }))
}))

vi.mock('agents/mcp', () => ({
  McpAgent: class {
    server = {
      tool: vi.fn()
    }
    static serveSSE = vi.fn(() => ({ fetch: vi.fn() }))
    static serve = vi.fn(() => ({ fetch: vi.fn() }))
  }
}))

// 模拟KV模块
vi.mock('../src/kv', () => ({
  KV: {
    put: vi.fn(),
    get: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}))

// 模拟HTML转图片模块
vi.mock('../src/html2image', () => ({
  htmlToImageByKvKey: vi.fn(),
  generateScreenshotUrl: vi.fn()
}))

// 模拟Cloudflare环境
vi.mock('cloudflare:workers', () => ({
  env: {
    host: 'test.example.com',
    KV: {}
  }
}))

// 模拟Hono
vi.mock('hono', () => ({
  Hono: vi.fn().mockImplementation(() => ({
    mount: vi.fn(),
    get: vi.fn(),
    post: vi.fn()
  }))
}))

// 模拟主页HTML
vi.mock('../src/html/mainPage', () => ({
  mainPageHtml: '<html><body>主页</body></html>'
}))

import { MyMCP } from '../src/index'
import { KV } from '../src/kv'
import { htmlToImageByKvKey, generateScreenshotUrl } from '../src/html2image'

const mockKV = KV as any
const mockHtmlToImage = { 
  htmlToImageByKvKey: htmlToImageByKvKey as any, 
  generateScreenshotUrl: generateScreenshotUrl as any 
}

describe('MCP工具集功能测试', () => {
  let mcpInstance: MyMCP

  beforeEach(() => {
    // 每个测试前重置mock和创建新实例
    vi.clearAllMocks()
    mcpInstance = new (MyMCP as any)()
  })

  describe('MCP服务器初始化', () => {
    it('应该正确创建MCP服务器实例', () => {
      // 验证MCP服务器实例创建
      expect(mcpInstance).toBeInstanceOf(MyMCP)
      expect(mcpInstance.server).toBeDefined()
    })

    it('应该正确初始化所有工具', async () => {
      // 执行初始化
      await mcpInstance.init()
      
      // 验证所有工具都被注册
      expect(mcpInstance.server.tool).toHaveBeenCalledTimes(5)
      
      // 验证工具名称
      const toolCalls = (mcpInstance.server.tool as any).mock.calls
      const toolNames = toolCalls.map((call: any) => call[0])
      
      expect(toolNames).toContain('页面发布工具')
      expect(toolNames).toContain('获取页面图片')
      expect(toolNames).toContain('页面更新工具')
      expect(toolNames).toContain('页面删除工具')
      expect(toolNames).toContain('获取页面代码')
    })
  })

  describe('页面发布工具测试', () => {
    it('应该成功发布页面', async () => {
      // 准备测试数据
      const testData = {
        pagetitle: '测试页面',
        pagehtml: '<html><body>测试内容</body></html>'
      }
      
      // 模拟KV.put成功
      mockKV.put.mockResolvedValue({
        state: true,
        message: '存放成功',
        data: { key: 'CeShiYeMianABCDEFGH' }
      })
      
      // 获取页面发布工具的处理函数
      await mcpInstance.init()
      const toolCalls = (mcpInstance.server.tool as any).mock.calls
      const publishToolCall = toolCalls.find((call: any) => call[0] === '页面发布工具')
      const publishHandler = publishToolCall[3]
      
      // 执行测试
      const result = await publishHandler(testData)
      
      // 验证结果
      expect(result.content[0].type).toBe('text')
      expect(result.content[0].text).toContain('页面创建成功')
      expect(result.content[0].text).toContain('https://test.example.com/pages/CeShiYeMianABCDEFGH')
      expect(mockKV.put).toHaveBeenCalledWith({
        title: testData.pagetitle,
        content: testData.pagehtml
      })
    })

    it('应该处理页面发布失败', async () => {
      // 准备测试数据
      const testData = {
        pagetitle: '测试页面',
        pagehtml: '无效HTML'
      }
      
      // 模拟KV.put失败
      mockKV.put.mockResolvedValue({
        state: false,
        message: '存放失败，content不是标准HTML格式'
      })
      
      // 获取页面发布工具的处理函数
      await mcpInstance.init()
      const toolCalls = (mcpInstance.server.tool as any).mock.calls
      const publishToolCall = toolCalls.find((call: any) => call[0] === '页面发布工具')
      const publishHandler = publishToolCall[3]
      
      // 执行测试
      const result = await publishHandler(testData)
      
      // 验证结果
      expect(result.content[0].type).toBe('text')
      expect(result.content[0].text).toBe('存放失败，content不是标准HTML格式')
    })
  })

  describe('获取页面图片工具测试', () => {
    it('应该成功获取页面图片', async () => {
      // 准备测试数据
      const testData = { pageId: 'CeShiYeMianABCDEFGH' }
      const mockImageUrl = '/image/abc123'
      
      // 模拟generateScreenshotUrl成功
      mockHtmlToImage.generateScreenshotUrl.mockResolvedValue({
        state: true,
        message: '成功生成截图链接',
        imageUrl: mockImageUrl
      })
      
      // 获取获取页面图片工具的处理函数
      await mcpInstance.init()
      const toolCalls = (mcpInstance.server.tool as any).mock.calls
      const imageToolCall = toolCalls.find((call: any) => call[0] === '获取页面图片')
      const imageHandler = imageToolCall[3]
      
      // 执行测试
      const result = await imageHandler(testData)
      
      // 验证结果
      expect(result.content[0].type).toBe('text')
      expect(result.content[0].text).toContain('截图生成成功！访问链接：https://test.example.com/image/abc123')
      expect(mockHtmlToImage.generateScreenshotUrl).toHaveBeenCalledWith(testData.pageId)
    })

    it('应该处理页面不存在的情况', async () => {
      // 准备测试数据
      const testData = { pageId: 'nonexistent' }
      
      // 模拟generateScreenshotUrl失败
      mockHtmlToImage.generateScreenshotUrl.mockResolvedValue({
        state: false,
        message: '页面不存在'
      })
      
      // 获取获取页面图片工具的处理函数
      await mcpInstance.init()
      const toolCalls = (mcpInstance.server.tool as any).mock.calls
      const imageToolCall = toolCalls.find((call: any) => call[0] === '获取页面图片')
      const imageHandler = imageToolCall[3]
      
      // 执行测试
      const result = await imageHandler(testData)
      
      // 验证结果
      expect(result.content[0].type).toBe('text')
      expect(result.content[0].text).toBe('页面不存在')
    })
  })

  describe('页面更新工具测试', () => {
    it('应该成功更新页面', async () => {
      // 准备测试数据
      const testData = {
        pageId: 'CeShiYeMianABCDEFGH',
        pagetitle: '更新的页面',
        pagehtml: '<html><body>更新的内容</body></html>'
      }
      
      // 模拟KV.update成功
      mockKV.update.mockResolvedValue({
        state: true,
        message: '更新成功',
        data: { key: testData.pageId }
      })
      
      // 获取页面更新工具的处理函数
      await mcpInstance.init()
      const toolCalls = (mcpInstance.server.tool as any).mock.calls
      const updateToolCall = toolCalls.find((call: any) => call[0] === '页面更新工具')
      const updateHandler = updateToolCall[3]
      
      // 执行测试
      const result = await updateHandler(testData)
      
      // 验证结果
      expect(result.content[0].type).toBe('text')
      expect(result.content[0].text).toContain('页面更新成功')
      expect(result.content[0].text).toContain(`https://test.example.com/pages/${testData.pageId}`)
      expect(mockKV.update).toHaveBeenCalledWith(testData.pageId, {
        title: testData.pagetitle,
        content: testData.pagehtml
      })
    })
  })

  describe('页面删除工具测试', () => {
    it('应该成功删除页面', async () => {
      // 准备测试数据
      const testData = { pageId: 'CeShiYeMianABCDEFGH' }
      
      // 模拟KV.delete成功
      mockKV.delete.mockResolvedValue({
        state: true,
        message: '删除成功'
      })
      
      // 获取页面删除工具的处理函数
      await mcpInstance.init()
      const toolCalls = (mcpInstance.server.tool as any).mock.calls
      const deleteToolCall = toolCalls.find((call: any) => call[0] === '页面删除工具')
      const deleteHandler = deleteToolCall[3]
      
      // 执行测试
      const result = await deleteHandler(testData)
      
      // 验证结果
      expect(result.content[0].type).toBe('text')
      expect(result.content[0].text).toBe('页面删除成功')
      expect(mockKV.delete).toHaveBeenCalledWith(testData.pageId)
    })
  })

  describe('获取页面代码工具测试', () => {
    it('应该成功获取页面代码', async () => {
      // 准备测试数据
      const testData = { pageId: 'CeShiYeMianABCDEFGH' }
      const htmlContent = '<html><body>测试内容</body></html>'
      
      // 模拟KV.get成功
      mockKV.get.mockResolvedValue({
        state: true,
        message: '获取成功',
        data: htmlContent
      })
      
      // 获取获取页面代码工具的处理函数
      await mcpInstance.init()
      const toolCalls = (mcpInstance.server.tool as any).mock.calls
      const getCodeToolCall = toolCalls.find((call: any) => call[0] === '获取页面代码')
      const getCodeHandler = getCodeToolCall[3]
      
      // 执行测试
      const result = await getCodeHandler(testData)
      
      // 验证结果
      expect(result.content[0].type).toBe('text')
      expect(result.content[0].text).toBe(htmlContent)
      expect(mockKV.get).toHaveBeenCalledWith(testData.pageId)
    })

    it('应该处理页面不存在的情况', async () => {
      // 准备测试数据
      const testData = { pageId: 'nonexistent' }
      
      // 模拟KV.get成功但数据为空
      mockKV.get.mockResolvedValue({
        state: true,
        message: '获取成功',
        data: null
      })
      
      // 获取获取页面代码工具的处理函数
      await mcpInstance.init()
      const toolCalls = (mcpInstance.server.tool as any).mock.calls
      const getCodeToolCall = toolCalls.find((call: any) => call[0] === '获取页面代码')
      const getCodeHandler = getCodeToolCall[3]
      
      // 执行测试
      const result = await getCodeHandler(testData)
      
      // 验证结果
      expect(result.content[0].type).toBe('text')
      expect(result.content[0].text).toBe('页面不存在')
    })
  })
})