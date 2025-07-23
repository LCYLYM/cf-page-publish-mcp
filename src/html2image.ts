import puppeteer from '@cloudflare/puppeteer';
import { env } from 'cloudflare:workers';
import { KV } from './kv';

export async function html2image(html: string): Promise<string> {
  const browser = await puppeteer.launch(env.MYBROWSER);
  const page = await browser.newPage();
  await page.setContent(html);
  await page.waitForNetworkIdle();
  const buffer = await page.screenshot();
  await browser.close();
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

export async function htmlToImageByKvKey(key: string) {
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
