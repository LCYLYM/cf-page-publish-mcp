import { usePinyin } from "./pinyin"
import { env } from "cloudflare:workers";
export const KV={
    put,
    get,
    update,
    delete: deleteKey

}

type PageContent={
    content:string,
    title:string,
}

async function put(pageContent:PageContent): Promise<{state: boolean, message: string, data?: {key: string}}> {
    try{
    // 检查content是否为标准HTML格式
    if(!pageContent.content.startsWith('<') || !pageContent.content.includes('>')) {
        return {
            state:false,
            message:'存放失败，content不是标准HTML格式'
        }
    }
    const titleChar=usePinyin(pageContent.title)
    const randomString=generateRandomString(8)
    const key=titleChar+randomString
    await env.KV.put(key,pageContent.content)
    return {
        state:true,
        message:'存放成功',
        data:{
            key
        }
    }

}catch(error){
    return {
        state:false,
        message:`存放失败,info:${error}`
    }

}
}

async function get(key:string): Promise<{state: boolean, message: string, data?: string}> {
    try{
    const res=await env.KV.get(key)
    if(!res){
        return {
            state:false,
            message:'获取失败，key不存在'
        }
    }
    return {
        state:true,
        message:'获取成功',
        data:res
    }
    }catch(error){
        return {
            state:false,
            message:`获取失败，info：${error}`
        }
    }
}


// 更新已有页面内容
async function update(key: string, pageContent: PageContent): Promise<{state: boolean, message: string, data?: {key: string}}> {
    try {
        // 检查key是否存在
        const existingPage = await env.KV.get(key);
        if (!existingPage) {
            return {
                state: false,
                message: '更新失败，页面不存在'
            };
        }
        
        // 检查content是否为标准HTML格式
        if (!pageContent.content.startsWith('<') || !pageContent.content.includes('>')) {
            return {
                state: false,
                message: '更新失败，content不是标准HTML格式'
            };
        }
        
        await env.KV.put(key, pageContent.content);
        return {
            state: true,
            message: '更新成功',
            data: {
                key
            }
        };
    } catch (error) {
        return {
            state: false,
            message: `更新失败，info：${error}`
        };
    }
}

// 删除页面
async function deleteKey(key: string): Promise<{state: boolean, message: string}> {
    try {
        // 检查key是否存在
        const existingPage = await env.KV.get(key);
        if (!existingPage) {
            return {
                state: false,
                message: '删除失败，页面不存在'
            };
        }
        
        await env.KV.delete(key);
        return {
            state: true,
            message: '删除成功',
           
        };
    } catch (error) {
        return {
            state: false,
            message: `删除失败，info：${error}`
        };
    }
}

function generateRandomString(long:number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < long; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}