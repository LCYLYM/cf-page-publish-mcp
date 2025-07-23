import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Hono } from "hono"
import { KV } from "./kv";
import { env } from "cloudflare:workers";
import { html } from "hono/html";
import { htmlToImageByKvKey } from "./html2image";

export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "cloudflare-page-publish-mcp",
		version: "1.0.0",
	});

	

	async init() {

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
			return { content: [{ type: "text", text: "页面创建成功，访问URL："+`https://${env.host}/pages/${result.data?.key}` }] };
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
		

	
	}
}

const app = new Hono<{ Bindings: Env }>()

app.mount('/sse', MyMCP.serveSSE('/sse').fetch, { replaceRequest: false })
app.mount('/mcp', MyMCP.serve('/mcp').fetch, { replaceRequest: false} )
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