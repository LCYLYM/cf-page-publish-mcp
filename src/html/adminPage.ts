// 管理员页面HTML模板
export const adminPageHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>后台管理 - HTML页面管理器</title>
    <style>
        :root {
            --bg-color: #ffffff;
            --text-color: #171717;
            --border-color: #e5e5e5;
            --hover-bg: #f5f5f5;
            --accent-color: #171717;
            --danger-color: #dc2626;
            --success-color: #22c55e;
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
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            padding: 40px 0;
            border-bottom: 1px solid var(--border-color);
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .header p {
            opacity: 0.7;
            font-size: 1rem;
        }
        
        .back-link {
            display: inline-block;
            margin-bottom: 20px;
            color: var(--text-color);
            text-decoration: none;
            padding: 8px 16px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            transition: all 0.2s;
        }
        
        .back-link:hover {
            background-color: var(--hover-bg);
        }
        
        #loginSection {
            max-width: 400px;
            margin: 80px auto;
            text-align: center;
        }
        
        #adminSection {
            display: none;
        }
        
        .card {
            background-color: var(--bg-color);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
        }
        
        .form-input {
            width: 100%;
            padding: 12px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            font-size: 16px;
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: border-color 0.2s;
        }
        
        .form-input:focus {
            outline: none;
            border-color: var(--accent-color);
        }
        
        .btn {
            padding: 12px 24px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s;
            background-color: var(--bg-color);
            color: var(--text-color);
        }
        
        .btn:hover {
            background-color: var(--hover-bg);
        }
        
        .btn-primary {
            background-color: var(--accent-color);
            color: var(--bg-color);
            border: none;
        }
        
        .btn-primary:hover {
            opacity: 0.8;
        }
        
        .btn-danger {
            background-color: var(--danger-color);
            color: white;
            border: none;
        }
        
        .btn-danger:hover {
            opacity: 0.8;
        }
        
        .status-message {
            margin-top: 16px;
            padding: 12px;
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
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        
        .data-table th,
        .data-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }
        
        .data-table th {
            font-weight: 600;
            background-color: var(--hover-bg);
        }
        
        .data-table tr:hover {
            background-color: var(--hover-bg);
        }
        
        .checkbox-cell {
            width: 40px;
            text-align: center;
        }
        
        .checkbox-cell input {
            cursor: pointer;
        }
        
        .action-btn {
            padding: 6px 12px;
            font-size: 14px;
            margin-right: 8px;
        }
        
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
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: linear-gradient(135deg, var(--hover-bg), var(--bg-color));
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 24px;
            text-align: center;
        }
        
        .stat-value {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 8px;
        }
        
        .stat-label {
            font-size: 1rem;
            opacity: 0.7;
        }
        
        .empty-state {
            text-align: center;
            padding: 40px;
            opacity: 0.6;
        }
        
        .btn-group {
            display: flex;
            gap: 12px;
            margin-top: 20px;
        }
        
        .link-button {
            background: none;
            border: none;
            color: #3b82f6;
            text-decoration: underline;
            cursor: pointer;
            padding: 0;
            font-size: 14px;
        }
        
        .link-button:hover {
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- 登录部分 -->
        <div id="loginSection">
            <div class="header">
                <h1>🔐 后台管理</h1>
                <p>请输入管理员密码访问</p>
            </div>
            <div class="card">
                <div class="form-group">
                    <label class="form-label" for="password">管理员密码</label>
                    <input type="password" class="form-input" id="password" placeholder="请输入密码..." />
                </div>
                <button class="btn btn-primary" onclick="login()" style="width: 100%;">登录</button>
                <div id="loginStatus" class="status-message"></div>
            </div>
            <a href="/" class="back-link">← 返回首页</a>
        </div>

        <!-- 管理界面 -->
        <div id="adminSection">
            <a href="/" class="back-link">← 返回首页</a>
            
            <div class="header">
                <h1>📊 后台管理</h1>
                <p>管理所有页面、截图和统计信息</p>
            </div>

            <!-- 统计信息 -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value" id="pageCount">-</div>
                    <div class="stat-label">页面总数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="screenshotCount">-</div>
                    <div class="stat-label">截图总数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="visitorCount">-</div>
                    <div class="stat-label">访客总数</div>
                </div>
            </div>

            <!-- 页面管理 -->
            <div class="card">
                <h2 style="margin-bottom: 20px;">📄 页面管理</h2>
                <div class="btn-group">
                    <button class="btn" onclick="loadData()">🔄 刷新列表</button>
                    <button class="btn btn-danger" onclick="batchDeletePages()" id="batchDeleteBtn" disabled>🗑️ 批量删除选中</button>
                </div>
                <div id="pagesTableContainer">
                    <div class="empty-state">
                        <p>点击"刷新列表"加载数据</p>
                    </div>
                </div>
            </div>

            <!-- 截图管理 -->
            <div class="card">
                <h2 style="margin-bottom: 20px;">🖼️ 截图管理</h2>
                <div class="btn-group">
                    <button class="btn btn-danger" onclick="batchDeleteScreenshots()" id="batchDeleteScreenshotsBtn" disabled>🗑️ 批量删除选中</button>
                </div>
                <div id="screenshotsTableContainer">
                    <div class="empty-state">
                        <p>点击"刷新列表"加载数据</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentPassword = '';
        let pagesData = [];
        let screenshotsData = [];

        // 登录功能
        function login() {
            const password = document.getElementById('password').value;
            const statusDiv = document.getElementById('loginStatus');
            
            if (!password) {
                showStatus('请输入密码', 'error', statusDiv);
                return;
            }
            
            // 简单验证密码
            if (password === 'lcy') {
                currentPassword = password;
                document.getElementById('loginSection').style.display = 'none';
                document.getElementById('adminSection').style.display = 'block';
                loadData();
            } else {
                showStatus('密码错误', 'error', statusDiv);
            }
        }

        // 加载数据
        async function loadData() {
            try {
                // 加载统计信息
                const statsResponse = await fetch('/api/stats');
                const statsResult = await statsResponse.json();
                
                if (statsResult.state && statsResult.data) {
                    document.getElementById('pageCount').textContent = statsResult.data.pageCount;
                    document.getElementById('screenshotCount').textContent = statsResult.data.screenshotCount;
                    document.getElementById('visitorCount').textContent = statsResult.data.visitorCount;
                }
                
                // 加载页面列表
                const listResponse = await fetch('/api/admin/list', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: currentPassword })
                });
                
                const listResult = await listResponse.json();
                
                if (listResult.state && listResult.data) {
                    pagesData = listResult.data.pages;
                    screenshotsData = listResult.data.screenshots;
                    renderPagesTable();
                    renderScreenshotsTable();
                }
            } catch (error) {
                console.error('加载数据失败:', error);
            }
        }

        // 渲染页面表格
        function renderPagesTable() {
            const container = document.getElementById('pagesTableContainer');
            
            if (pagesData.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>暂无页面数据</p></div>';
                return;
            }
            
            let html = '<table class="data-table">';
            html += '<thead><tr>';
            html += '<th class="checkbox-cell"><input type="checkbox" onchange="toggleAllPages(this)" /></th>';
            html += '<th>页面ID</th>';
            html += '<th>访问链接</th>';
            html += '<th>操作</th>';
            html += '</tr></thead>';
            html += '<tbody>';
            
            pagesData.forEach((page, index) => {
                const pageUrl = window.location.origin + '/pages/' + page.id;
                html += '<tr>';
                html += \`<td class="checkbox-cell"><input type="checkbox" class="page-checkbox" data-id="\${page.id}" onchange="updateBatchDeleteButton()" /></td>\`;
                html += \`<td>\${page.id}</td>\`;
                html += \`<td><a href="\${pageUrl}" target="_blank" style="color: #3b82f6; text-decoration: underline;">\${pageUrl}</a></td>\`;
                html += \`<td>
                    <button class="btn action-btn" onclick="viewPage('\${page.id}')">查看</button>
                    <button class="btn btn-danger action-btn" onclick="deleteSinglePage('\${page.id}')">删除</button>
                </td>\`;
                html += '</tr>';
            });
            
            html += '</tbody></table>';
            container.innerHTML = html;
        }

        // 渲染截图表格
        function renderScreenshotsTable() {
            const container = document.getElementById('screenshotsTableContainer');
            
            if (screenshotsData.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>暂无截图数据</p></div>';
                return;
            }
            
            let html = '<table class="data-table">';
            html += '<thead><tr>';
            html += '<th class="checkbox-cell"><input type="checkbox" onchange="toggleAllScreenshots(this)" /></th>';
            html += '<th>截图ID</th>';
            html += '<th>关联页面ID</th>';
            html += '<th>操作</th>';
            html += '</tr></thead>';
            html += '<tbody>';
            
            screenshotsData.forEach((screenshot, index) => {
                html += '<tr>';
                html += \`<td class="checkbox-cell"><input type="checkbox" class="screenshot-checkbox" data-id="\${screenshot.id}" onchange="updateBatchDeleteScreenshotsButton()" /></td>\`;
                html += \`<td>\${screenshot.id}</td>\`;
                html += \`<td>\${screenshot.pageId}</td>\`;
                html += \`<td>
                    <button class="btn btn-danger action-btn" onclick="deleteSingleScreenshot('\${screenshot.id}')">删除</button>
                </td>\`;
                html += '</tr>';
            });
            
            html += '</tbody></table>';
            container.innerHTML = html;
        }

        // 切换所有页面选择
        function toggleAllPages(checkbox) {
            const checkboxes = document.querySelectorAll('.page-checkbox');
            checkboxes.forEach(cb => cb.checked = checkbox.checked);
            updateBatchDeleteButton();
        }

        // 切换所有截图选择
        function toggleAllScreenshots(checkbox) {
            const checkboxes = document.querySelectorAll('.screenshot-checkbox');
            checkboxes.forEach(cb => cb.checked = checkbox.checked);
            updateBatchDeleteScreenshotsButton();
        }

        // 更新批量删除按钮状态
        function updateBatchDeleteButton() {
            const checkboxes = document.querySelectorAll('.page-checkbox:checked');
            document.getElementById('batchDeleteBtn').disabled = checkboxes.length === 0;
        }

        // 更新截图批量删除按钮状态
        function updateBatchDeleteScreenshotsButton() {
            const checkboxes = document.querySelectorAll('.screenshot-checkbox:checked');
            document.getElementById('batchDeleteScreenshotsBtn').disabled = checkboxes.length === 0;
        }

        // 查看页面
        function viewPage(pageId) {
            window.open('/pages/' + pageId, '_blank');
        }

        // 删除单个页面
        async function deleteSinglePage(pageId) {
            if (!confirm('确定要删除这个页面吗？此操作不可恢复！')) {
                return;
            }
            
            try {
                const response = await fetch('/api/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: pageId })
                });
                
                const result = await response.json();
                
                if (result.state) {
                    alert('删除成功');
                    loadData();
                } else {
                    alert('删除失败：' + result.message);
                }
            } catch (error) {
                alert('删除失败：网络错误');
            }
        }

        // 删除单个截图
        async function deleteSingleScreenshot(screenshotId) {
            if (!confirm('确定要删除这个截图吗？此操作不可恢复！')) {
                return;
            }
            
            try {
                const response = await fetch('/api/admin/batch-delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        password: currentPassword,
                        keys: [screenshotId]
                    })
                });
                
                const result = await response.json();
                
                if (result.state) {
                    alert('删除成功');
                    loadData();
                } else {
                    alert('删除失败：' + result.message);
                }
            } catch (error) {
                alert('删除失败：网络错误');
            }
        }

        // 批量删除页面
        async function batchDeletePages() {
            const checkboxes = document.querySelectorAll('.page-checkbox:checked');
            const keys = Array.from(checkboxes).map(cb => cb.getAttribute('data-id'));
            
            if (keys.length === 0) {
                alert('请选择要删除的页面');
                return;
            }
            
            if (!confirm(\`确定要删除选中的 \${keys.length} 个页面吗？此操作不可恢复！\`)) {
                return;
            }
            
            try {
                const response = await fetch('/api/admin/batch-delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        password: currentPassword,
                        keys: keys
                    })
                });
                
                const result = await response.json();
                
                if (result.state) {
                    alert(result.message);
                    loadData();
                } else {
                    alert('删除失败：' + result.message);
                }
            } catch (error) {
                alert('删除失败：网络错误');
            }
        }

        // 批量删除截图
        async function batchDeleteScreenshots() {
            const checkboxes = document.querySelectorAll('.screenshot-checkbox:checked');
            const keys = Array.from(checkboxes).map(cb => cb.getAttribute('data-id'));
            
            if (keys.length === 0) {
                alert('请选择要删除的截图');
                return;
            }
            
            if (!confirm(\`确定要删除选中的 \${keys.length} 个截图吗？此操作不可恢复！\`)) {
                return;
            }
            
            try {
                const response = await fetch('/api/admin/batch-delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        password: currentPassword,
                        keys: keys
                    })
                });
                
                const result = await response.json();
                
                if (result.state) {
                    alert(result.message);
                    loadData();
                } else {
                    alert('删除失败：' + result.message);
                }
            } catch (error) {
                alert('删除失败：网络错误');
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
                }, 3000);
            }
        }

        // 监听回车键登录
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('password').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    login();
                }
            });
        });
    </script>
</body>
</html>
`;
