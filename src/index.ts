import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Hono } from "hono"
import { KV } from "./kv";
import { env } from "cloudflare:workers";
import { html } from "hono/html";
import { htmlToImageByKvKey } from "./html2image";
import { mainPageHtml } from './html/mainPage';

export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "cloudflare-page-publish-mcp",
		version: "1.0.0",
	});

	

	async init(): Promise<void> {

	this.server.tool(
		"页面发布工具",
		"创建html页面并且返回网页url，需要提供两个参数，pagetitle是页面的题目，然后pagecontent是页面的html内容",
		{
			pagetitle: z.string(),
			pagehtml: z.string()
		},
		async ({ pagetitle, pagehtml }) => {
			const result = await KV.put({ title:pagetitle, content:pagehtml });
			if (!result.state) {
				return { content: [{ type: "text", text: result.message }] };
			}
			return { content: [{ type: "text", text: `页面创建成功，访问URL：https://${env.host}/pages/${result.data?.key}` }] };
		}
	);

	this.server.tool(
		"获取页面图片",
		"根据页面ID获取渲染后的图片,页面id就是页面发布工具返回的pages/后面的那一段",
		{
			pageId: z.string()
		},
		async ({ pageId }) => {
			const result = await htmlToImageByKvKey(pageId);
			if (!result.state) {
				return { content: [{ type: "text", text: result.message }] };
			}
			if (!result.data) {
				return { content: [{ type: "text", text: "无法获取页面图片" }] };
			}
			return { 
				content: [{ 
					type: "image", 
					data: result.data, 
					mimeType: "image/png" 
				}],
				_meta: {},
				structuredContent: {}
			};
		}
	);

	this.server.tool(
		"页面更新工具",
		"通过页面ID更新已有页面的HTML内容，需要提供页面ID、新的页面标题和新的HTML内容",
		{
			pageId: z.string(),
			pagetitle: z.string(),
			pagehtml: z.string()
		},
		async ({ pageId, pagetitle, pagehtml }) => {
			const result = await KV.update(pageId, { title: pagetitle, content: pagehtml });
			if (!result.state) {
				return { content: [{ type: "text", text: result.message }] };
			}
			return { content: [{ type: "text", text: `页面更新成功，访问URL：https://${env.host}/pages/${pageId}` }] };
		}
	);

	this.server.tool(
		"页面删除工具",
		"通过页面ID删除已有页面，需要提供页面ID",
		{
			pageId: z.string()
		},
		async ({ pageId }) => {
			const result = await KV.delete(pageId);
			if (!result.state) {
				return { content: [{ type: "text", text: result.message }] };
			}
			return { content: [{ type: "text", text: "页面删除成功" }] };
		}
	);

	this.server.tool(
		"获取页面代码",
		"通过页面ID获取页面的HTML代码",
		{
			pageId: z.string()
		},
		async ({ pageId }) => {
			const result = await KV.get(pageId);
			if (!result.state) {
				return { content: [{ type: "text", text: result.message }] };
			}
			if (!result.data) {
				return { content: [{ type: "text", text: "页面不存在" }] };
			}
			return { content: [{ type: "text", text: result.data }] };
		}
	);
		

	
	}
}

const app = new Hono<{ Bindings: Env }>()

app.mount('/sse', MyMCP.serveSSE('/sse').fetch, { replaceRequest: false })
app.mount('/mcp', MyMCP.serve('/mcp').fetch, { replaceRequest: false} )

// 首页路由 - 显示HTML编辑器
app.get('/', async (c) => {
    return c.html(mainPageHtml);
});

// API路由 - 处理页面发布请求
app.post('/api/publish', async (c) => {
    try {
        const { title, content } = await c.req.json();
        
        // 验证输入参数
        if (!title || !content) {
            return c.json({
                state: false,
                message: '标题和内容不能为空',
                data: null
            });
        }
        
        // 使用现有的KV存储功能
        const result = await KV.put({ title, content });
        
        return c.json(result);
    } catch (error) {
        return c.json({
            state: false,
            message: `服务器错误：${error}`,
            data: null
        });
    }
});





// API路由 - 获取页面内容
app.get('/api/get/:key', async (c) => {
    try {
        const key = c.req.param('key');
        const result = await KV.get(key);
        return c.json(result);
    } catch (error) {
        return c.json({
            state: false,
            message: `服务器错误：${error}`,
            data: null
        });
    }
});

// API路由 - 通过页面ID获取页面内容和标题
app.post('/api/get-page', async (c) => {
    try {
        const { pageId } = await c.req.json();
        
        if (!pageId) {
            return c.json({
                state: false,
                message: '页面ID不能为空',
                data: null
            });
        }
        
        const result = await KV.get(pageId);
        return c.json(result);
    } catch (error) {
        return c.json({
            state: false,
            message: `服务器错误：${error}`,
            data: null
        });
    }
});

// API路由 - 处理页面更新请求
app.post('/api/update', async (c) => {
    try {
        const { key, title, content } = await c.req.json();
        
        // 验证输入参数
        if (!key || !content) {
            return c.json({
                state: false,
                message: '页面ID和内容不能为空',
                data: null
            });
        }
        
        // 使用KV更新功能
        const result = await KV.update(key, { title: title || '', content });
        
        return c.json(result);
    } catch (error) {
        return c.json({
            state: false,
            message: `服务器错误：${error}`,
            data: null
        });
    }
});

// API路由 - 处理页面删除请求
app.post('/api/delete', async (c) => {
    try {
        const { key } = await c.req.json();
        
        // 验证输入参数
        if (!key) {
            return c.json({
                state: false,
                message: '页面ID不能为空',
                data: null
            });
        }
        
        // 使用KV删除功能
        const result = await KV.delete(key);
        
        return c.json(result);
    } catch (error) {
        return c.json({
            state: false,
            message: `服务器错误：${error}`,
            data: null
        });
    }
});

// 现有的页面访问路由
app.get('/pages/:key',async (c)=>{
    const key=c.req.param('key')
    const res=await KV.get(key)
    if(!res.data){
        return c.html('页面不存在')
    }
	//@ts-ignore
	const dom=html(res.data)
	
    return c.html(dom)
})

export default app