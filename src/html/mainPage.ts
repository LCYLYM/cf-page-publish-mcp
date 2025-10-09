// 主页面HTML模板
export const mainPageHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML页面管理器</title>
    <style>
        :root {
            --bg-color: #ffffff;
            --text-color: #171717;
            --border-color: #e5e5e5;
            --hover-bg: #f5f5f5;
            --accent-color: #171717;
        }
        
        @media (prefers-color-scheme: dark) {
            :root {
                --bg-color: #0a0a0a;
                --text-color: #ededed;
                --border-color: #262626;
                --hover-bg: #171717;
                --accent-color: #ededed;
            }
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, Helvetica, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            min-height: 100vh;
            line-height: 1.6;
        }
        
        /* 自定义滚动条 */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: var(--bg-color);
        }
        
        ::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: var(--text-color);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Hero区域 */
        .hero {
            text-align: center;
            padding: 80px 0 60px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .hero h1 {
            font-size: 4rem;
            font-weight: bold;
            margin-bottom: 16px;
            letter-spacing: -0.02em;
        }
        
        .hero .subtitle {
            font-size: 1.25rem;
            margin-bottom: 12px;
            opacity: 0.8;
        }
        
        .hero .description {
            font-size: 1.125rem;
            opacity: 0.6;
            max-width: 600px;
            margin: 0 auto;
        }
        
        /* 导航标签 */
        .nav-tabs {
            display: flex;
            justify-content: center;
            gap: 0;
            margin: 40px 0;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            overflow: hidden;
            width: fit-content;
            margin-left: auto;
            margin-right: auto;
        }
        
        .nav-tab {
            padding: 12px 24px;
            border: none;
            background: transparent;
            color: var(--text-color);
            font-family: inherit;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            border-right: 1px solid var(--border-color);
        }
        
        .nav-tab:last-child {
            border-right: none;
        }
        
        .nav-tab:hover {
            background-color: var(--hover-bg);
        }
        
        .nav-tab.active {
            background-color: var(--text-color);
            color: var(--bg-color);
        }
        
        /* 内容区域 */
        .tab-content {
            display: none;
            padding: 40px 0;
        }
        
        .tab-content.active {
            display: block;
        }
        
        /* 卡片样式 */
        .card {
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            transition: all 0.2s ease;
        }
        
        .card:hover {
            border-color: var(--text-color);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        /* 表单样式 */
        .form-group {
            margin-bottom: 24px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            font-size: 14px;
        }
        
        .form-input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            background-color: var(--bg-color);
            color: var(--text-color);
            font-family: inherit;
            font-size: 14px;
            transition: border-color 0.2s ease;
        }
        
        .form-input:focus {
            outline: none;
            border-color: var(--text-color);
        }
        
        /* 编辑器网格 */
        .editor-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin-bottom: 24px;
        }
        
        .editor-panel {
            border: 1px solid var(--border-color);
            border-radius: 8px;
            overflow: hidden;
            height: 400px;
        }
        
        .editor-header {
            padding: 12px 16px;
            background-color: var(--hover-bg);
            border-bottom: 1px solid var(--border-color);
            font-size: 14px;
            font-weight: 600;
        }
        
        .editor-textarea {
            width: 100%;
            height: calc(100% - 45px);
            border: none;
            padding: 16px;
            background-color: var(--bg-color);
            color: var(--text-color);
            font-family: 'Courier New', monospace;
            font-size: 14px;
            resize: none;
            outline: none;
        }
        
        .editor-preview {
            width: 100%;
            height: calc(100% - 45px);
            border: none;
            background-color: var(--bg-color);
        }
        
        /* 按钮样式 */
        .btn-group {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn {
            padding: 12px 24px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            background-color: var(--bg-color);
            color: var(--text-color);
            font-family: inherit;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .btn:hover {
            background-color: var(--text-color);
            color: var(--bg-color);
            transform: translateY(-1px);
        }
        
        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .btn-secondary {
            background-color: transparent;
            border-color: #999;
            color: #666;
        }
        
        .btn-secondary:hover {
            background-color: #f5f5f5;
            color: #333;
        }
        
        .btn-primary {
            background-color: var(--text-color);
            color: var(--bg-color);
        }
        
        .btn-primary:hover {
            opacity: 0.8;
        }
        
        /* 状态消息 */
        .status-message {
            margin-top: 24px;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
            font-size: 14px;
            display: none;
        }
        
        .status-success {
            background-color: #f0f9ff;
            color: #0369a1;
            border: 1px solid #bae6fd;
        }
        
        .status-error {
            background-color: #fef2f2;
            color: #dc2626;
            border: 1px solid #fecaca;
        }
        
        /* 页面信息 */
        .page-info {
            background-color: var(--hover-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
            display: none;
        }
        
        .page-info h3 {
            margin-bottom: 12px;
            font-size: 16px;
        }
        
        .page-info p {
            margin-bottom: 8px;
            font-size: 14px;
            opacity: 0.8;
        }
        
        .page-info a {
            color: var(--text-color);
            text-decoration: underline;
        }
        
        /* 加载动画 */
        .loading {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid var(--border-color);
            border-top: 2px solid var(--text-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 8px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* 统计信息样式 */
        .stats-section {
            margin: 40px 0;
            padding: 30px;
            background: linear-gradient(135deg, var(--hover-bg), var(--bg-color));
            border: 1px solid var(--border-color);
            border-radius: 12px;
        }
        
        .stats-title {
            text-align: center;
            font-size: 1.5rem;
            margin-bottom: 30px;
            font-weight: 600;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        
        .stat-card {
            background-color: var(--bg-color);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .stat-icon {
            font-size: 2.5rem;
            margin-bottom: 12px;
        }
        
        .stat-value {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 8px;
            background: linear-gradient(135deg, var(--accent-color), var(--text-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .stat-label {
            font-size: 1rem;
            opacity: 0.7;
            font-weight: 500;
        }
        
        .admin-link {
            text-align: center;
            margin-top: 20px;
        }
        
        .admin-link a {
            color: var(--text-color);
            text-decoration: none;
            padding: 8px 16px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            display: inline-block;
            transition: all 0.2s;
        }
        
        .admin-link a:hover {
            background-color: var(--hover-bg);
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .editor-grid {
                grid-template-columns: 1fr;
            }
            
            .nav-tabs {
                flex-direction: column;
                width: 100%;
            }
            
            .nav-tab {
                border-right: none;
                border-bottom: 1px solid var(--border-color);
            }
            
            .nav-tab:last-child {
                border-bottom: none;
            }
            
            .btn-group {
                flex-direction: column;
                align-items: center;
            }
            
            .btn {
                width: 100%;
                max-width: 300px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Hero区域 -->
        <div class="hero">
            <h1>HTML页面管理器</h1>
            <p class="subtitle">简洁高效的页面发布工具</p>
            <p class="description">创建、编辑和管理您的HTML页面，支持实时预览和一键发布</p>
        </div>
        
        <!-- 统计信息区域 -->
        <div class="stats-section">
            <h2 class="stats-title">📊 网站统计</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-value" id="visitorCount">-</div>
                    <div class="stat-label">访客总数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📄</div>
                    <div class="stat-value" id="pageCount">-</div>
                    <div class="stat-label">页面总数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📸</div>
                    <div class="stat-value" id="screenshotCount">-</div>
                    <div class="stat-label">截图总数</div>
                </div>
            </div>
            <div class="admin-link">
                <a href="/admin">🔐 进入后台管理</a>
            </div>
        </div>
        
        <!-- 导航标签 -->
        <div class="nav-tabs">
            <button class="nav-tab active" onclick="switchTab('create')">创建页面</button>
            <button class="nav-tab" onclick="switchTab('edit')">编辑页面</button>
            <button class="nav-tab" onclick="switchTab('delete')">删除页面</button>
            <button class="nav-tab" onclick="switchTab('screenshot')">预览截图</button>
            <button class="nav-tab" onclick="switchTab('docs')">文档</button>
        </div>
        
        <!-- 创建页面标签 -->
        <div id="create-tab" class="tab-content active">
            <div class="card">
                <div class="form-group">
                    <label class="form-label" for="pageTitle">页面标题</label>
                    <input type="text" class="form-input" id="pageTitle" placeholder="请输入页面标题..." required>
                </div>
                <div class="form-group">
                    <label class="form-label">HTML编辑器</label>
                    <div class="editor-grid">
                        <div class="editor-panel">
                            <div class="editor-header">HTML代码</div>
                            <textarea class="editor-textarea" id="htmlEditor" placeholder="请输入您的HTML代码..."></textarea>
                        </div>
                        <div class="editor-panel">
                            <div class="editor-header">实时预览</div>
                            <iframe class="editor-preview" id="preview" sandbox="allow-scripts allow-same-origin"></iframe>
                        </div>
                    </div>
                </div>
                <div class="btn-group">
                    <button class="btn" onclick="updatePreview()">预览</button>
                    <button class="btn btn-primary" onclick="publishPage()">发布页面</button>
                </div>
                <div id="status" class="status-message"></div>
            </div>
        </div>
        
        <!-- 编辑页面标签 -->
        <div id="edit-tab" class="tab-content">
            <div class="card">
                <div class="form-group">
                    <label class="form-label" for="editPageId">页面ID</label>
                    <input type="text" class="form-input" id="editPageId" placeholder="请输入要编辑的页面ID..." required>
                </div>
                <div class="btn-group">
                    <button class="btn" onclick="loadPageForEdit()">加载页面</button>
                </div>
                
                <div id="editPageInfo" class="page-info">
                    <h3>页面信息</h3>
                    <p><strong>页面ID:</strong> <span id="currentPageId"></span></p>
                    <p><strong>访问链接:</strong> <a id="currentPageLink" href="#" target="_blank"></a></p>
                </div>
                
                <div class="form-group" id="editTitleGroup" style="display: none;">
                    <label class="form-label" for="editPageTitle">页面标题</label>
                    <input type="text" class="form-input" id="editPageTitle" placeholder="页面标题...">
                </div>
                <div class="form-group" id="editEditorGroup" style="display: none;">
                    <label class="form-label">HTML编辑器</label>
                    <div class="editor-grid">
                        <div class="editor-panel">
                            <div class="editor-header">HTML代码</div>
                            <textarea class="editor-textarea" id="editHtmlEditor" placeholder="HTML代码..."></textarea>
                        </div>
                        <div class="editor-panel">
                            <div class="editor-header">实时预览</div>
                            <iframe class="editor-preview" id="editPreview" sandbox="allow-scripts allow-same-origin"></iframe>
                        </div>
                    </div>
                </div>
                <div class="btn-group" id="editButtonGroup" style="display: none;">
                    <button class="btn" onclick="updateEditPreview()">预览</button>
                    <button class="btn btn-primary" onclick="updatePage()">更新页面</button>
                </div>
                <div id="editStatus" class="status-message"></div>
            </div>
        </div>
        
        <!-- 删除页面标签 -->
        <div id="delete-tab" class="tab-content">
            <div class="card">
                <div class="form-group">
                    <label class="form-label" for="deletePageId">页面ID</label>
                    <input type="text" class="form-input" id="deletePageId" placeholder="请输入要删除的页面ID..." required>
                </div>
                <div class="btn-group">
                    <button class="btn" onclick="loadPageForDelete()">加载页面信息</button>
                </div>
                
                <div id="deletePageInfo" class="page-info">
                    <h3>⚠️ 确认删除以下页面？</h3>
                    <p><strong>页面ID:</strong> <span id="deleteCurrentPageId"></span></p>
                    <p><strong>访问链接:</strong> <a id="deleteCurrentPageLink" href="#" target="_blank"></a></p>
                    <p style="color: #dc2626; font-weight: bold; margin-top: 15px;">注意：删除操作不可恢复！</p>
                </div>
                
                <div class="btn-group" id="deleteButtonGroup" style="display: none;">
                    <button class="btn" style="background-color: #dc2626; color: white;" onclick="deletePage()">确认删除</button>
                </div>
                <div id="deleteStatus" class="status-message"></div>
            </div>
        </div>
        
        <!-- 预览截图标签 -->
        <div id="screenshot-tab" class="tab-content">
            <div class="card">
                <h2 style="margin-bottom: 24px; font-size: 1.5rem;">页面截图预览</h2>
                <div style="background: #e8f4fd; padding: 12px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
                    <small style="color: #1e40af; font-size: 13px;">
                        📸 支持完整页面截图（包括滚动内容），MCP接口返回可直接访问的图片链接
                    </small>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="screenshotPageId">页面ID</label>
                    <input type="text" class="form-input" id="screenshotPageId" placeholder="请输入要截图的页面ID..." required>
                    <small style="color: #666; font-size: 12px; margin-top: 4px; display: block;">
                        输入页面发布后返回的URL中 "/pages/" 后面的部分
                    </small>
                </div>
                
                <div class="btn-group">
                    <button class="btn" onclick="generateScreenshot()">生成截图</button>
                    <button class="btn btn-secondary" onclick="clearScreenshot()">清空</button>
                </div>
                
                <div id="screenshotResult" style="margin-top: 24px; display: none;">
                    <h3 style="margin-bottom: 16px; font-size: 1.1rem;">截图预览</h3>
                    <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; background: #f9f9f9;">
                        <img id="screenshotImage" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" alt="页面截图">
                        <div style="margin-top: 12px; font-size: 14px; color: #666;">
                            <p><strong>提示：</strong>右键点击图片可以保存到本地</p>
                        </div>
                    </div>
                </div>
                
                <div id="screenshotStatus" class="status-message"></div>
            </div>
        </div>
        
        <!-- 文档页面标签 -->
        <div id="docs-tab" class="tab-content">
            <div class="card">
                <h2 style="margin-bottom: 24px; font-size: 1.5rem;">MCP工具接口文档</h2>
                
                <div style="margin-bottom: 32px;">
                    <h3 style="margin-bottom: 16px; font-size: 1.25rem;">连接方式</h3>
                    <p style="margin-bottom: 16px; line-height: 1.6;">本工具提供两种MCP连接方式，可以通过AI客户端（如Claude Desktop、Cline等）连接使用：</p>
                    <div style="background-color: var(--hover-bg); border-radius: 8px; padding: 20px; margin-bottom: 16px;">
                        <h4 style="margin-bottom: 12px;">🔗 MCP连接端点</h4>
                        <code style="background-color: var(--bg-color); padding: 4px 8px; border-radius: 4px; font-family: monospace;">{域名}/mcp</code>
                    </div>
                    <div style="background-color: var(--hover-bg); border-radius: 8px; padding: 20px;">
                        <h4 style="margin-bottom: 12px;">📡 SSE连接端点</h4>
                        <code style="background-color: var(--bg-color); padding: 4px 8px; border-radius: 4px; font-family: monospace;">{域名}/sse</code>
                    </div>
                </div>
                
                <div style="margin-bottom: 32px;">
                    <h3 style="margin-bottom: 16px; font-size: 1.25rem;">可用工具</h3>
                    <p style="margin-bottom: 16px; line-height: 1.6;">本工具提供以下4个MCP工具，可通过AI助手调用：</p>
                    
                    <div style="display: grid; gap: 16px;">
                        <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 16px;">
                            <h4 style="margin-bottom: 8px; color: #22c55e;">📝 页面发布工具</h4>
                            <p style="font-size: 14px; margin-bottom: 8px; line-height: 1.5;">创建HTML页面并返回网页URL</p>
                            <div style="font-size: 12px; color: #666;">
                                <strong>参数：</strong><br>
                                • pagetitle (string): 页面标题<br>
                                • pagehtml (string): 页面HTML内容
                            </div>
                        </div>
                        
                        <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 16px;">
                            <h4 style="margin-bottom: 8px; color: #3b82f6;">🖼️ 获取页面图片</h4>
                            <p style="font-size: 14px; margin-bottom: 8px; line-height: 1.5;">生成完整页面截图并返回访问链接</p>
                            <div style="font-size: 12px; color: #666;">
                                <strong>参数：</strong><br>
                                • pageId (string): 页面ID（发布工具返回的pages/后面的部分）<br>
                                <strong>返回：</strong> 可直接访问的图片链接（/image/id 格式）<br>
                                <strong>特性：</strong> 支持完整页面截图，包括滚动内容
                            </div>
                        </div>
                        
                        <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 16px;">
                            <h4 style="margin-bottom: 8px; color: #f59e0b;">✏️ 页面更新工具</h4>
                            <p style="font-size: 14px; margin-bottom: 8px; line-height: 1.5;">通过页面ID更新已有页面的HTML内容</p>
                            <div style="font-size: 12px; color: #666;">
                                <strong>参数：</strong><br>
                                • pageId (string): 页面ID<br>
                                • pagetitle (string): 新的页面标题<br>
                                • pagehtml (string): 新的HTML内容
                            </div>
                        </div>
                        
                        <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 16px;">
                            <h4 style="margin-bottom: 8px; color: #ef4444;">🗑️ 页面删除工具</h4>
                            <p style="font-size: 14px; margin-bottom: 8px; line-height: 1.5;">通过页面ID删除已有页面</p>
                            <div style="font-size: 12px; color: #666;">
                                <strong>参数：</strong><br>
                                • pageId (string): 要删除的页面ID
                            </div>
                        </div>
                        
                        <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 16px;">
                            <h4 style="margin-bottom: 8px; color: #8b5cf6;">📄 获取页面代码</h4>
                            <p style="font-size: 14px; margin-bottom: 8px; line-height: 1.5;">通过页面ID获取页面的HTML源代码</p>
                            <div style="font-size: 12px; color: #666;">
                                <strong>参数：</strong><br>
                                • pageId (string): 要获取的页面ID
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 32px;">
                    <h3 style="margin-bottom: 16px; font-size: 1.25rem;">使用示例</h3>
                    <div style="background-color: var(--hover-bg); border-radius: 8px; padding: 20px;">
                        <h4 style="margin-bottom: 12px;">在AI助手中的使用方式：</h4>
                        <ol style="margin-left: 20px; line-height: 1.8;">
                            <li>配置MCP连接到本工具的端点</li>
                            <li>使用自然语言请求AI助手调用工具</li>
                            <li>例如："帮我创建一个包含Hello World的HTML页面"</li>
                            <li>AI助手会自动调用相应的MCP工具完成任务</li>
                        </ol>
                    </div>
                </div>
                
                <div>
                    <h3 style="margin-bottom: 16px; font-size: 1.25rem;">技术信息</h3>
                    <div style="background-color: var(--hover-bg); border-radius: 8px; padding: 20px;">
                        <ul style="margin-left: 20px; line-height: 1.8;">
                            <li><strong>协议版本：</strong>MCP 1.0.0</li>
                            <li><strong>服务名称：</strong>cloudflare-page-publish-mcp</li>
                            <li><strong>运行环境：</strong>Cloudflare Workers</li>
                            <li><strong>数据存储：</strong>Cloudflare KV</li>
                            <li><strong>支持格式：</strong>HTML页面、PNG图片</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // 标签页切换功能
        function switchTab(tabName) {
            // 隐藏所有标签内容
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // 移除所有标签的active状态
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // 显示选中的标签内容
            document.getElementById(tabName + '-tab').classList.add('active');
            
            // 激活选中的标签
            event.target.classList.add('active');
        }
        
        // 创建页面功能
        function updatePreview() {
            const htmlContent = document.getElementById('htmlEditor').value;
            const preview = document.getElementById('preview');
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            preview.src = url;
        }
        
        async function publishPage() {
            const title = document.getElementById('pageTitle').value.trim();
            const content = document.getElementById('htmlEditor').value.trim();
            const statusDiv = document.getElementById('status');
            
            if (!title || !content) {
                showStatus('请填写页面标题和HTML内容', 'error', statusDiv);
                return;
            }
            
            if (!content.includes('<') || !content.includes('>')) {
                showStatus('请输入有效的HTML内容', 'error', statusDiv);
                return;
            }
            
            showStatus('<span class="loading"></span>正在发布页面...', 'success', statusDiv);
            
            try {
                const response = await fetch('/api/publish', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, content })
                });
                
                const result = await response.json();
                
                if (result.state) {
                    const pageUrl = window.location.origin + '/pages/' + result.data.key;
                    showStatus(\`页面发布成功！<br>访问链接：<a href="\${pageUrl}" target="_blank">\${pageUrl}</a>\`, 'success', statusDiv);
                    document.getElementById('pageTitle').value = '';
                    document.getElementById('htmlEditor').value = '';
                    document.getElementById('preview').src = '';
                } else {
                    showStatus('发布失败：' + result.message, 'error', statusDiv);
                }
            } catch (error) {
                showStatus('发布失败：网络错误', 'error', statusDiv);
            }
        }
        
        // 编辑页面功能
        async function loadPageForEdit() {
            const pageId = document.getElementById('editPageId').value.trim();
            const statusDiv = document.getElementById('editStatus');
            
            if (!pageId) {
                showStatus('请输入页面ID', 'error', statusDiv);
                return;
            }
            
            showStatus('<span class="loading"></span>正在加载页面...', 'success', statusDiv);
            
            try {
                const response = await fetch('/api/get-page', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pageId })
                });
                
                const result = await response.json();
                
                if (result.state) {
                    // 显示页面信息
                    document.getElementById('currentPageId').textContent = pageId;
                    const pageUrl = window.location.origin + '/pages/' + pageId;
                    const linkElement = document.getElementById('currentPageLink');
                    linkElement.href = pageUrl;
                    linkElement.textContent = pageUrl;
                    
                    // 填充编辑器
                    document.getElementById('editHtmlEditor').value = result.data;
                    
                    // 显示编辑界面
                    document.getElementById('editPageInfo').style.display = 'block';
                    document.getElementById('editTitleGroup').style.display = 'block';
                    document.getElementById('editEditorGroup').style.display = 'block';
                    document.getElementById('editButtonGroup').style.display = 'flex';
                    
                    showStatus('页面加载成功', 'success', statusDiv);
                } else {
                    showStatus('加载失败：' + result.message, 'error', statusDiv);
                }
            } catch (error) {
                showStatus('加载失败：网络错误', 'error', statusDiv);
            }
        }
        
        function updateEditPreview() {
            const htmlContent = document.getElementById('editHtmlEditor').value;
            const preview = document.getElementById('editPreview');
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            preview.src = url;
        }
        
        async function updatePage() {
            const pageId = document.getElementById('editPageId').value.trim();
            const title = document.getElementById('editPageTitle').value.trim();
            const content = document.getElementById('editHtmlEditor').value.trim();
            const statusDiv = document.getElementById('editStatus');
            
            if (!content) {
                showStatus('请填写HTML内容', 'error', statusDiv);
                return;
            }
            
            if (!content.includes('<') || !content.includes('>')) {
                showStatus('请输入有效的HTML内容', 'error', statusDiv);
                return;
            }
            
            showStatus('<span class="loading"></span>正在更新页面...', 'success', statusDiv);
            
            try {
                const response = await fetch('/api/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: pageId, title, content })
                });
                
                const result = await response.json();
                
                if (result.state) {
                    showStatus('页面更新成功！', 'success', statusDiv);
                } else {
                    showStatus('更新失败：' + result.message, 'error', statusDiv);
                }
            } catch (error) {
                showStatus('更新失败：网络错误', 'error', statusDiv);
            }
        }
        
        // 删除页面功能
        async function loadPageForDelete() {
            const pageId = document.getElementById('deletePageId').value.trim();
            const statusDiv = document.getElementById('deleteStatus');
            
            if (!pageId) {
                showStatus('请输入页面ID', 'error', statusDiv);
                return;
            }
            
            showStatus('<span class="loading"></span>正在加载页面信息...', 'success', statusDiv);
            
            try {
                const response = await fetch('/api/get-page', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pageId })
                });
                
                const result = await response.json();
                
                if (result.state) {
                    // 显示页面信息
                    document.getElementById('deleteCurrentPageId').textContent = pageId;
                    const pageUrl = window.location.origin + '/pages/' + pageId;
                    const linkElement = document.getElementById('deleteCurrentPageLink');
                    linkElement.href = pageUrl;
                    linkElement.textContent = pageUrl;
                    
                    // 显示删除确认界面
                    document.getElementById('deletePageInfo').style.display = 'block';
                    document.getElementById('deleteButtonGroup').style.display = 'flex';
                    
                    showStatus('页面信息加载成功', 'success', statusDiv);
                } else {
                    showStatus('加载失败：' + result.message, 'error', statusDiv);
                }
            } catch (error) {
                showStatus('加载失败：网络错误', 'error', statusDiv);
            }
        }
        
        async function deletePage() {
            const pageId = document.getElementById('deletePageId').value.trim();
            const statusDiv = document.getElementById('deleteStatus');
            
            if (!confirm('确定要删除这个页面吗？此操作不可恢复！')) {
                return;
            }
            
            showStatus('<span class="loading"></span>正在删除页面...', 'success', statusDiv);
            
            try {
                const response = await fetch('/api/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: pageId })
                });
                
                const result = await response.json();
                
                if (result.state) {
                    showStatus('页面删除成功！', 'success', statusDiv);
                    // 清空表单和隐藏信息
                    document.getElementById('deletePageId').value = '';
                    document.getElementById('deletePageInfo').style.display = 'none';
                    document.getElementById('deleteButtonGroup').style.display = 'none';
                } else {
                    showStatus('删除失败：' + result.message, 'error', statusDiv);
                }
            } catch (error) {
                showStatus('删除失败：网络错误', 'error', statusDiv);
            }
        }
        
        // 生成截图功能
        async function generateScreenshot() {
            const pageId = document.getElementById('screenshotPageId').value.trim();
            const statusDiv = document.getElementById('screenshotStatus');
            const resultDiv = document.getElementById('screenshotResult');
            const imageElement = document.getElementById('screenshotImage');
            
            if (!pageId) {
                showStatus('请输入页面ID', 'error', statusDiv);
                return;
            }
            
            showStatus('<span class="loading"></span>正在生成截图...', 'success', statusDiv);
            resultDiv.style.display = 'none';
            
            try {
                const response = await fetch('/api/screenshot/' + encodeURIComponent(pageId));
                const result = await response.json();
                
                if (result.state && result.data) {
                    // 显示截图
                    imageElement.src = 'data:image/png;base64,' + result.data;
                    resultDiv.style.display = 'block';
                    showStatus('截图生成成功！', 'success', statusDiv);
                } else {
                    showStatus('生成失败：' + result.message, 'error', statusDiv);
                }
            } catch (error) {
                showStatus('生成失败：网络错误', 'error', statusDiv);
            }
        }
        
        // 清空截图
        function clearScreenshot() {
            document.getElementById('screenshotPageId').value = '';
            document.getElementById('screenshotResult').style.display = 'none';
            document.getElementById('screenshotStatus').style.display = 'none';
        }
        
        // 通用状态显示函数
        function showStatus(message, type, element) {
            element.innerHTML = message;
            element.className = 'status-message status-' + type;
            element.style.display = 'block';
            
            if (type === 'success' && !message.includes('loading')) {
                setTimeout(() => {
                    element.style.display = 'none';
                }, 5000);
            }
        }
        
        // 加载统计信息
        async function loadStatistics() {
            try {
                const response = await fetch('/api/stats');
                const result = await response.json();
                
                if (result.state && result.data) {
                    document.getElementById('visitorCount').textContent = result.data.visitorCount;
                    document.getElementById('pageCount').textContent = result.data.pageCount;
                    document.getElementById('screenshotCount').textContent = result.data.screenshotCount;
                }
            } catch (error) {
                console.error('加载统计信息失败:', error);
            }
        }
        
        // 增加访客计数
        async function incrementVisitor() {
            try {
                await fetch('/api/visitor', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                console.error('更新访客计数失败:', error);
            }
        }
        
        // 页面加载时的初始化
        document.addEventListener('DOMContentLoaded', function() {
            // 为HTML编辑器添加实时预览
            document.getElementById('htmlEditor').addEventListener('input', updatePreview);
            document.getElementById('editHtmlEditor').addEventListener('input', updateEditPreview);
            
            // 加载统计信息
            loadStatistics();
            
            // 增加访客计数（仅首次访问时）
            if (!sessionStorage.getItem('visited')) {
                incrementVisitor();
                sessionStorage.setItem('visited', 'true');
            }
        });
    </script>
</body>
</html>`;