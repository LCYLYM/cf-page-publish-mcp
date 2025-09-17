import puppeteer from '@cloudflare/puppeteer';
import { env } from 'cloudflare:workers';
import { KV } from './kv';

// 生成随机截图ID
function generateScreenshotId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function html2image(html: string): Promise<string> {
  const browser = await puppeteer.launch(env.MYBROWSER);
  const page = await browser.newPage();
  await page.setContent(html);
  await page.waitForNetworkIdle();
  // 使用fullPage选项来获取完整页面截图
  const buffer = await page.screenshot({ fullPage: true });
  await browser.close();
  // 确保buffer是Uint8Array类型
  const base64String = Buffer.from(buffer).toString('base64');
  return base64String;
}

export async function htmlToImageByKvKey(key: string): Promise<{state: boolean, message: string, data?: string}> {
  const html = await KV.get(key)
  if(!html.data){
    return {
        state:false,
        message:'页面不存在'
    }
  }
  return {
    state:true,
    message:'成功获取页面图像',
    data:await html2image(html.data)
  }
}

// 新函数：生成截图并返回访问URL
export async function generateScreenshotUrl(pageId: string): Promise<{state: boolean, message: string, imageUrl?: string}> {
  const html = await KV.get(pageId);
  if (!html.data) {
    return {
      state: false,
      message: '页面不存在'
    };
  }

  try {
    // 生成截图
    const base64Image = await html2image(html.data);
    
    // 生成唯一的截图ID
    const screenshotId = generateScreenshotId();
    
    // 将截图存储到KV中，使用特殊前缀来区分截图数据
    const screenshotKey = `screenshot_${screenshotId}`;
    await env.KV.put(screenshotKey, base64Image);
    
    return {
      state: true,
      message: '成功生成截图链接',
      imageUrl: `/image/${screenshotId}`
    };
  } catch (error) {
    return {
      state: false,
      message: `截图生成失败：${error}`
    };
  }
}
