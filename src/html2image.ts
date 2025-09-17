import puppeteer from '@cloudflare/puppeteer';
import { env } from 'cloudflare:workers';
import { KV } from './kv';

export async function html2image(html: string, fullPage = true): Promise<string> {
  const browser = await puppeteer.launch(env.MYBROWSER);
  const page = await browser.newPage();
  await page.setContent(html);
  await page.waitForNetworkIdle();
  const buffer = await page.screenshot({ fullPage });
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
    data:await html2image(html.data, true)
  }
}

export async function htmlToImageUrlByKvKey(key: string): Promise<{state: boolean, message: string, data?: string}> {
  const html = await KV.get(key)
  if(!html.data){
    return {
        state:false,
        message:'页面不存在'
    }
  }
  
  // 生成全页面截图
  const imageData = await html2image(html.data, true);
  
  // 存储图片并获取图片ID
  const storeResult = await KV.putImage(key, imageData);
  if (!storeResult.state) {
    return {
      state: false,
      message: storeResult.message
    }
  }
  
  // 返回图片URL
  return {
    state: true,
    message: '成功生成页面图片链接',
    data: `/image/${storeResult.data?.imageId}`
  }
}
