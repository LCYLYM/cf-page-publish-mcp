## 简介

English | [English](README_en.md)

cloudflare 页面发布 mcp 工具，可以将 html 页面发布到 cloudflare，worker 上。

sse 体验地址：[cf-page-publish-sse](https://page.sereniblue.com/sse)

streamableHttp 体验地址：[cf-page-publish-stream](https://page.sereniblue.com/mcp)

体验地址使用worker绑定github的方式部署，确保体验地址与源码保持同步。

## 核心功能

### HTML页面编辑器

提供可视化的HTML页面编辑器界面，用户可以通过Web界面直接编辑和发布HTML页面：

- **实时预览**：左侧编辑HTML代码，右侧实时显示预览效果
- **HTML验证**：前端自动检查HTML格式完整性，确保内容有效
- **页面发布**：输入页面标题后一键发布，自动生成访问链接
- **响应式设计**：支持桌面和移动设备，现代化UI界面

访问网站首页即可使用HTML编辑器功能。

### 页面发布（MCP协议）

接受两个参数，页面标题和页面内容，可以将 html 内容上传到 cloudflare kv，

返回一个参数，页面的访问链接

### 获取页面图片

根据页面ID获取渲染后的PNG图片，页面ID就是页面发布工具返回的pages/后面的那一段

## 自部署教程

### 环境要求

- cloudflare 账户
- node
- pnpm

### 部署教程

#### 复制源码

```bash
git clone https://github.com/Actrue/cf-page-publish-mcp.git #复制源代码
cd cf-page-publish-mcp #导航到源码
```

#### 创建并绑定 kv

```bash
wrangler kv namespace create cf-page-publish-mcp #创建kv
```

执行上述命令后获得以下内容

```bash
🌀 Creating namespace with title "cf-page-publish"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{
  "kv_namespaces": [
    {
      "binding": "cf_page_publish",
      "id": "7d776eaeacd0412380f6eb39ca4aea9a"
    }
  ]
}
```

复制 kv_namespaces 的 id

打开 wrangler.jsonc 文件

```bash
	"routes": [{"pattern": "page.sereniblue.com","custom_domain": true}],//替换成你的域名
	"vars": {
		"host":"page.sereniblue.com",//替换成你的域名
	},
	"kv_namespaces": [
		{
		  "binding": "KV",
		  "id": "7d776eaeacd0412380f6eb39ca4aea9a"//替换成刚创建的kv的id
		}
	  ],
```

把 page.sereniblue.com 这个域名替换为自己的域名，把 kv 的 id 切换成刚创建的 id

#### 部署项目

```bash
npm i pnpm -g #安装pnpm
pnpm i #安装项目依赖
npx wrangler deploy #发布项目至cloudflare
```

## 核心技术

- [hono](https://hono.dev/)
- [mcp](https://modelcontextprotocol.io/introduction)
- [cloudflare worker](https://workers.cloudflare.com/)