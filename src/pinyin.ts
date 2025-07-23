//此文件用于测试拼音库的功能
import pinyin from "js-pinyin";

export function usePinyin(title:string): string {
    const info = pinyin.getFullChars(title)
    return info
}