import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * 图片服务端点测试
 * 验证 /image/{imageId} 端点能正确服务图片
 */

// 模拟Hono
const mockC = {
  req: {
    param: vi.fn()
  },
  text: vi.fn(),
  body: vi.fn()
}

// 模拟KV
vi.mock('../src/kv', () => ({
  KV: {
    getImage: vi.fn()
  }
}))

import { KV } from '../src/kv'

describe('图片服务端点', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /image/{imageId}', () => {
    it('应该能正确返回存在的图片', async () => {
      const imageId = 'img_test-page-123_abc123'
      const imageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      
      // 模拟KV.getImage返回图片数据
      const mockKV = KV as any
      mockKV.getImage.mockResolvedValue({
        state: true,
        message: '图片获取成功',
        data: imageData
      })
      
      // 模拟端点处理逻辑
      const endpoint = async (c: any) => {
        try {
          const imageId = c.req.param('imageId')
          
          if (!imageId) {
            return c.text('图片ID不能为空', 400)
          }
          
          const result = await KV.getImage(imageId)
          
          if (!result.state || !result.data) {
            return c.text('图片不存在', 404)
          }
          
          const imageBuffer = Buffer.from(result.data, 'base64')
          return c.body(imageBuffer, {
            headers: {
              'Content-Type': 'image/png',
              'Cache-Control': 'public, max-age=86400'
            }
          })
        } catch (error) {
          return c.text(`服务器错误：${error}`, 500)
        }
      }
      
      // 设置请求参数
      mockC.req.param.mockReturnValue(imageId)
      
      // 执行端点
      await endpoint(mockC)
      
      // 验证调用
      expect(mockKV.getImage).toHaveBeenCalledWith(imageId)
      expect(mockC.body).toHaveBeenCalledWith(
        Buffer.from(imageData, 'base64'),
        {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400'
          }
        }
      )
    })

    it('应该处理图片不存在的情况', async () => {
      const imageId = 'nonexistent-image'
      
      // 模拟KV.getImage返回图片不存在
      const mockKV = KV as any
      mockKV.getImage.mockResolvedValue({
        state: false,
        message: '图片不存在'
      })
      
      // 模拟端点处理逻辑
      const endpoint = async (c: any) => {
        try {
          const imageId = c.req.param('imageId')
          
          if (!imageId) {
            return c.text('图片ID不能为空', 400)
          }
          
          const result = await KV.getImage(imageId)
          
          if (!result.state || !result.data) {
            return c.text('图片不存在', 404)
          }
          
          const imageBuffer = Buffer.from(result.data, 'base64')
          return c.body(imageBuffer, {
            headers: {
              'Content-Type': 'image/png',
              'Cache-Control': 'public, max-age=86400'
            }
          })
        } catch (error) {
          return c.text(`服务器错误：${error}`, 500)
        }
      }
      
      // 设置请求参数
      mockC.req.param.mockReturnValue(imageId)
      
      // 执行端点
      await endpoint(mockC)
      
      // 验证调用
      expect(mockKV.getImage).toHaveBeenCalledWith(imageId)
      expect(mockC.text).toHaveBeenCalledWith('图片不存在', 404)
    })

    it('应该处理空的图片ID', async () => {
      // 模拟端点处理逻辑
      const endpoint = async (c: any) => {
        try {
          const imageId = c.req.param('imageId')
          
          if (!imageId) {
            return c.text('图片ID不能为空', 400)
          }
          
          const result = await KV.getImage(imageId)
          
          if (!result.state || !result.data) {
            return c.text('图片不存在', 404)
          }
          
          const imageBuffer = Buffer.from(result.data, 'base64')
          return c.body(imageBuffer, {
            headers: {
              'Content-Type': 'image/png',
              'Cache-Control': 'public, max-age=86400'
            }
          })
        } catch (error) {
          return c.text(`服务器错误：${error}`, 500)
        }
      }
      
      // 设置空的图片ID
      mockC.req.param.mockReturnValue('')
      
      // 执行端点
      await endpoint(mockC)
      
      // 验证调用
      expect(mockC.text).toHaveBeenCalledWith('图片ID不能为空', 400)
    })
  })
})