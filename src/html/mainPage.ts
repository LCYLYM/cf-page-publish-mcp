// 主页面HTML模板
export const mainPageHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML页面编辑器</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; font-weight: 300; }
        .header p { font-size: 1.1em; opacity: 0.9; }
        
        /* 标签页样式 */
        .tabs {
            display: flex;
            background: #f8f9fa;
            border-bottom: 1px solid #e1e5e9;
        }
        .tab {
            flex: 1;
            padding: 15px 20px;
            text-align: center;
            cursor: pointer;
            border: none;
            background: transparent;
            font-size: 16px;
            font-weight: 600;
            color: #666;
            transition: all 0.3s ease;
        }
        .tab.active {
            background: white;
            color: #4facfe;
            border-bottom: 3px solid #4facfe;
        }
        .tab:hover:not(.active) {
            background: #e9ecef;
            color: #333;
        }
        
        .tab-content {
            display: none;
            padding: 40px;
        }
        .tab-content.active {
            display: block;
        }
        
        .form-group { margin-bottom: 25px; }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
            font-size: 1.1em;
        }
        input[type="text"] {
            width: 100%;
            padding: 15px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s ease;
        }
        input[type="text"]:focus {
            outline: none;
            border-color: #4facfe;
            box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
        }
        .editor-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            height: 500px;
        }
        .editor-panel {
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            overflow: hidden;
        }
        .panel-header {
            background: #f8f9fa;
            padding: 12px 20px;
            border-bottom: 1px solid #e1e5e9;
            font-weight: 600;
            color: #495057;
        }
        #htmlEditor, #editHtmlEditor {
            width: 100%;
            height: calc(100% - 45px);
            border: none;
            padding: 20px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            resize: none;
            outline: none;
            background: #f8f9fa;
        }
        #preview, #editPreview {
            width: 100%;
            height: calc(100% - 45px);
            border: none;
            background: white;
        }
        .button-group {
            display: flex;
            gap: 15px;
            margin-top: 30px;
            justify-content: center;
        }
        .btn {
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-preview {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .btn-publish {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
        }
        .btn-load {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .btn-update {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
        }
        .btn-delete {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            color: white;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
        
        .status-message {
            margin-top: 20px;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            display: none;
        }
        .status-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .status-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #4facfe;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 10px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .page-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #4facfe;
        }
        .page-info h3 {
            color: #333;
            margin-bottom: 10px;
        }
        .page-info p {
            color: #666;
            margin-bottom: 5px;
        }
        
        @media (max-width: 768px) {
            .editor-container { grid-template-columns: 1fr; height: auto; }
            .editor-panel { height: 300px; }
            .button-group { flex-direction: column; align-items: center; }
            .btn { width: 100%; max-width: 300px; }
            .tabs { flex-direction: column; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 HTML页面管理器</h1>
            <p>创建、编辑、删除您的HTML页面</p>
        </div>
        
        <!-- 标签页导航 -->
        <div class="tabs">
            <button class="tab active" onclick="switchTab('create')">📝 创建页面</button>
            <button class="tab" onclick="switchTab('edit')">✏️ 编辑页面</button>
            <button class="tab" onclick="switchTab('delete')">🗑️ 删除页面</button>
        </div>
        
        <!-- 创建页面标签 -->
        <div id="create-tab" class="tab-content active">
            <div class="form-group">
                <label for="pageTitle">📝 页面标题</label>
                <input type="text" id="pageTitle" placeholder="请输入页面标题..." required>
            </div>
            <div class="form-group">
                <label>💻 HTML编辑器</label>
                <div class="editor-container">
                    <div class="editor-panel">
                        <div class="panel-header">HTML代码</div>
                        <textarea id="htmlEditor" placeholder="请输入您的HTML代码..."></textarea>
                    </div>
                    <div class="editor-panel">
                        <div class="panel-header">实时预览</div>
                        <iframe id="preview" sandbox="allow-scripts allow-same-origin"></iframe>
                    </div>
                </div>
            </div>
            <div class="button-group">
                <button class="btn btn-preview" onclick="updatePreview()">👁️ 预览</button>
                <button class="btn btn-publish" onclick="publishPage()">🚀 发布页面</button>
            </div>
            <div id="status" class="status-message"></div>
        </div>
        
        <!-- 编辑页面标签 -->
        <div id="edit-tab" class="tab-content">
            <div class="form-group">
                <label for="editPageId">🔍 页面ID</label>
                <input type="text" id="editPageId" placeholder="请输入要编辑的页面ID..." required>
            </div>
            <div class="button-group">
                <button class="btn btn-load" onclick="loadPageForEdit()">📥 加载页面</button>
            </div>
            
            <div id="editPageInfo" class="page-info" style="display: none;">
                <h3>页面信息</h3>
                <p><strong>页面ID:</strong> <span id="currentPageId"></span></p>
                <p><strong>访问链接:</strong> <a id="currentPageLink" href="#" target="_blank"></a></p>
            </div>
            
            <div class="form-group" id="editTitleGroup" style="display: none;">
                <label for="editPageTitle">📝 页面标题</label>
                <input type="text" id="editPageTitle" placeholder="页面标题...">
            </div>
            <div class="form-group" id="editEditorGroup" style="display: none;">
                <label>💻 HTML编辑器</label>
                <div class="editor-container">
                    <div class="editor-panel">
                        <div class="panel-header">HTML代码</div>
                        <textarea id="editHtmlEditor" placeholder="HTML代码..."></textarea>
                    </div>
                    <div class="editor-panel">
                        <div class="panel-header">实时预览</div>
                        <iframe id="editPreview" sandbox="allow-scripts allow-same-origin"></iframe>
                    </div>
                </div>
            </div>
            <div class="button-group" id="editButtonGroup" style="display: none;">
                <button class="btn btn-preview" onclick="updateEditPreview()">👁️ 预览</button>
                <button class="btn btn-update" onclick="updatePage()">💾 更新页面</button>
            </div>
            <div id="editStatus" class="status-message"></div>
        </div>
        
        <!-- 删除页面标签 -->
        <div id="delete-tab" class="tab-content">
            <div class="form-group">
                <label for="deletePageId">🔍 页面ID</label>
                <input type="text" id="deletePageId" placeholder="请输入要删除的页面ID..." required>
            </div>
            <div class="button-group">
                <button class="btn btn-load" onclick="loadPageForDelete()">📥 加载页面信息</button>
            </div>
            
            <div id="deletePageInfo" class="page-info" style="display: none;">
                <h3>⚠️ 确认删除以下页面？</h3>
                <p><strong>页面ID:</strong> <span id="deleteCurrentPageId"></span></p>
                <p><strong>访问链接:</strong> <a id="deleteCurrentPageLink" href="#" target="_blank"></a></p>
                <p style="color: #dc3545; font-weight: bold; margin-top: 15px;">注意：删除操作不可恢复！</p>
            </div>
            
            <div class="button-group" id="deleteButtonGroup" style="display: none;">
                <button class="btn btn-delete" onclick="deletePage()">🗑️ 确认删除</button>
            </div>
            <div id="deleteStatus" class="status-message"></div>
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
            document.querySelectorAll('.tab').forEach(tab => {
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
        
        // 页面加载时的初始化
        document.addEventListener('DOMContentLoaded', function() {
            // 为HTML编辑器添加实时预览
            document.getElementById('htmlEditor').addEventListener('input', updatePreview);
            document.getElementById('editHtmlEditor').addEventListener('input', updateEditPreview);
        });
    </script>
</body>
</html>`;