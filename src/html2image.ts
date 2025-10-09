import puppeteer from '@cloudflare/puppeteer';
import { env } from 'cloudflare:workers';
import { KV } from './kv';

// Generate random screenshot ID
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
  
  // Set viewport to 1920x1080 (16:9 aspect ratio) for proper screenshot width
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1
  });
  
  // Set default navigation timeout
  page.setDefaultTimeout(30000);
  
  await page.setContent(html, { 
    waitUntil: 'networkidle0',
    timeout: 30000 // 30 second timeout
  });
  
  // Take full page screenshot with quality optimization
  const buffer = await page.screenshot({ 
    fullPage: true,
    type: 'jpeg', // Use JPEG for better compression and smaller file size
    quality: 80 // Balance between quality and file size
  });
  
  await browser.close();
  
  // Convert buffer to base64
  const base64String = Buffer.from(buffer).toString('base64');
  return base64String;
}

export async function htmlToImageByKvKey(key: string): Promise<{state: boolean, message: string, data?: string}> {
  const html = await KV.get(key)
  if(!html.data){
    return {
        state:false,
        message:'Page does not exist'
    }
  }
  return {
    state:true,
    message:'Successfully generated page screenshot',
    data:await html2image(html.data)
  }
}

// Generate screenshot and return access URL
export async function generateScreenshotUrl(pageId: string): Promise<{state: boolean, message: string, imageUrl?: string}> {
  const html = await KV.get(pageId);
  if (!html.data) {
    return {
      state: false,
      message: 'Page does not exist'
    };
  }

  try {
    // Generate screenshot
    const base64Image = await html2image(html.data);
    
    // Generate unique screenshot ID
    const screenshotId = generateScreenshotId();
    
    // Store screenshot in KV with special prefix to distinguish screenshot data
    const screenshotKey = `screenshot_${screenshotId}`;
    await env.KV.put(screenshotKey, base64Image);
    
    return {
      state: true,
      message: 'Screenshot URL generated successfully',
      imageUrl: `/image/${screenshotId}`
    };
  } catch (error) {
    return {
      state: false,
      message: `Screenshot generation failed: ${error}`
    };
  }
}
