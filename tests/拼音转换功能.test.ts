import { describe, it, expect } from 'vitest'
import { usePinyin } from '../src/pinyin'

/**
 * 拼音转换功能测试
 * 测试中文标题转换为拼音的功能
 */
describe('拼音转换功能测试', () => {
  it('应该正确转换中文标题为拼音', () => {
    // 测试基本中文转换
    const result = usePinyin('测试页面')
    expect(result).toBe('CeShiYeMian')
  })

  it('应该正确处理包含数字和英文的标题', () => {
    // 测试混合内容转换
    const result = usePinyin('测试页面123ABC')
    expect(result).toBe('CeShiYeMian123ABC')
  })

  it('应该正确处理空字符串', () => {
    // 测试空字符串
    const result = usePinyin('')
    expect(result).toBe('')
  })

  it('应该正确处理纯英文标题', () => {
    // 测试纯英文
    const result = usePinyin('Hello World')
    expect(result).toBe('Hello World')
  })

  it('应该正确处理特殊字符', () => {
    // 测试包含特殊字符的标题
    const result = usePinyin('测试-页面_2024')
    expect(result).toBe('CeShi-YeMian_2024')
  })

  it('应该正确处理长标题', () => {
    // 测试长标题
    const longTitle = '这是一个非常长的中文标题用来测试拼音转换功能是否正常工作'
    const result = usePinyin(longTitle)
    expect(result).toContain('ZheShiYiGeFeiChangChang')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})