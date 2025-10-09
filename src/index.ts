import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Hono } from "hono"
import { KV } from "./kv";
import { env } from "cloudflare:workers";
import { html } from "hono/html";
import { htmlToImageByKvKey, generateScreenshotUrl } from "./html2image";
import { mainPageHtml } from './html/mainPage';

export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "cloudflare-page-publish-mcp",
		version: "1.0.0",
	});

	

	async init(): Promise<void> {

	this.server.tool(
		"publish_page",
		"Create an HTML page and return its public URL. This tool requires two parameters: 'pagetitle' (the page title) and 'pagehtml' (the complete HTML content of the page). The tool will store the page in Cloudflare KV storage and return a publicly accessible URL where the page can be viewed.",
		{
			pagetitle: z.string(),
			pagehtml: z.string()
		},
		async ({ pagetitle, pagehtml }) => {
			const result = await KV.put({ title:pagetitle, content:pagehtml });
			if (!result.state) {
				return { content: [{ type: "text", text: result.message }] };
			}
			return { content: [{ type: "text", text: `Page created successfully. Access URL: https://${env.host}/pages/${result.data?.key}` }] };
		}
	);

	this.server.tool(
		"get_page_screenshot",
		"Generate a full-page screenshot of a published page and return a publicly accessible image URL. This tool requires the 'pageId' parameter, which is the identifier returned after the page path '/pages/' when using the publish_page tool. The screenshot captures the entire page content including scrollable areas, with a viewport resolution of 1920x1080 (16:9 aspect ratio) for optimal viewing. The returned URL can be directly accessed to view or download the screenshot image.",
		{
			pageId: z.string()
		},
		async ({ pageId }) => {
			const result = await generateScreenshotUrl(pageId);
			if (!result.state) {
				return { content: [{ type: "text", text: result.message }] };
			}
			if (!result.imageUrl) {
				return { content: [{ type: "text", text: "Failed to generate screenshot URL" }] };
			}
			return { 
				content: [{ 
					type: "text", 
					text: `Screenshot generated successfully! Access URL: https://${env.host}${result.imageUrl}` 
				}],
				_meta: {},
				structuredContent: {}
			};
		}
	);

	this.server.tool(
		"update_page",
		"Update the HTML content of an existing published page. This tool requires three parameters: 'pageId' (the unique identifier of the page to update), 'pagetitle' (the new page title), and 'pagehtml' (the new complete HTML content). After successful update, the page will be immediately accessible at its original URL with the updated content.",
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
			return { content: [{ type: "text", text: `Page updated successfully. Access URL: https://${env.host}/pages/${pageId}` }] };
		}
	);

	this.server.tool(
		"delete_page",
		"Delete an existing published page permanently from storage. This tool requires the 'pageId' parameter (the unique identifier of the page to delete). Once deleted, the page and its content will be permanently removed and the page URL will no longer be accessible. This action cannot be undone.",
		{
			pageId: z.string()
		},
		async ({ pageId }) => {
			const result = await KV.delete(pageId);
			if (!result.state) {
				return { content: [{ type: "text", text: result.message }] };
			}
			return { content: [{ type: "text", text: "Page deleted successfully" }] };
		}
	);

	this.server.tool(
		"get_page_code",
		"Retrieve the complete HTML source code of a published page. This tool requires the 'pageId' parameter (the unique identifier of the page). It returns the full HTML content that was originally published or last updated for the specified page. This is useful for inspecting, backing up, or analyzing the page content.",
		{
			pageId: z.string()
		},
		async ({ pageId }) => {
			const result = await KV.get(pageId);
			if (!result.state) {
				return { content: [{ type: "text", text: result.message }] };
			}
			if (!result.data) {
				return { content: [{ type: "text", text: "Page does not exist" }] };
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

// API路由 - 获取页面截图
app.get('/api/screenshot/:pageId', async (c) => {
    try {
        const pageId = c.req.param('pageId');
        
        // 验证输入参数
        if (!pageId) {
            return c.json({
                state: false,
                message: '页面ID不能为空',
                data: null
            });
        }
        
        // 使用现有的截图功能
        const result = await htmlToImageByKvKey(pageId);
        
        return c.json(result);
    } catch (error) {
        return c.json({
            state: false,
            message: `服务器错误：${error}`,
            data: null
        });
    }
});

// 新增路由 - 提供截图服务
app.get('/image/:screenshotId', async (c) => {
    try {
        const screenshotId = c.req.param('screenshotId');
        
        // 验证输入参数
        if (!screenshotId) {
            return c.text('截图ID不能为空', 400);
        }
        
        // 从KV获取截图数据
        const screenshotKey = `screenshot_${screenshotId}`;
        const imageData = await env.KV.get(screenshotKey);
        
        if (!imageData) {
            return c.text('截图不存在', 404);
        }
        
        // 将base64转换为二进制数据
        const buffer = Buffer.from(imageData, 'base64');
        
        // 设置正确的响应头并返回图片
        c.header('Content-Type', 'image/jpeg');
        c.header('Cache-Control', 'public, max-age=86400'); // 缓存1天
        return c.body(buffer);
    } catch (error) {
        return c.text(`服务器错误：${error}`, 500);
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