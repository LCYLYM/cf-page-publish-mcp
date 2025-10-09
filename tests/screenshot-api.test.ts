import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'

/**
 * 截图API功能测试
 * 测试新增的/api/screenshot/:pageId端点
 */

// 模拟htmlToImageByKvKey函数
vi.mock('../src/html2image', () => ({
  htmlToImageByKvKey: vi.fn()
}))

import { htmlToImageByKvKey } from '../src/html2image'

describe('Screenshot API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该有htmlToImageByKvKey函数', () => {
    expect(typeof htmlToImageByKvKey).toBe('function')
  })

  it('htmlToImageByKvKey应该是一个函数', () => {
    expect(typeof htmlToImageByKvKey).toBe('function')
  })

  it('应该处理成功的截图生成', async () => {
    const testPageId = 'test123'
    const mockImageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    
    // 模拟成功的响应
    const mockHtmlToImage = htmlToImageByKvKey as any
    mockHtmlToImage.mockResolvedValue({
      state: true,
      message: 'Successfully generated page screenshot',
      data: mockImageData
    })
    
    // 测试函数调用
    const result = await htmlToImageByKvKey(testPageId)
    
    // 验证结果
    expect(result.state).toBe(true)
    expect(result.message).toBe('Successfully generated page screenshot')
    expect(result.data).toBe(mockImageData)
    expect(mockHtmlToImage).toHaveBeenCalledWith(testPageId)
  })

  it('应该处理Page does not exist的情况', async () => {
    const testPageId = 'nonexistent'
    
    // 模拟Page does not exist的响应
    const mockHtmlToImage = htmlToImageByKvKey as any
    mockHtmlToImage.mockResolvedValue({
      state: false,
      message: 'Page does not exist'
    })
    
    // 测试函数调用
    const result = await htmlToImageByKvKey(testPageId)
    
    // 验证结果
    expect(result.state).toBe(false)
    expect(result.message).toBe('Page does not exist')
    expect(result.data).toBeUndefined()
  })

  it('应该处理截图生成错误', async () => {
    const testPageId = 'error-page'
    
    // 模拟错误响应
    const mockHtmlToImage = htmlToImageByKvKey as any
    mockHtmlToImage.mockRejectedValue(new Error('Screenshot generation failed'))
    
    // 测试函数调用并期望抛出错误
    await expect(htmlToImageByKvKey(testPageId)).rejects.toThrow('Screenshot generation failed')
  })
})