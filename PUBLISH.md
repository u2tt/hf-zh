# 发布 / 更新流程（GreasyFork ↔ GitHub 同步）

账号：GreasyFork **4choor3**（user id 1131567）· GitHub **u2tt**
本仓库：https://github.com/u2tt/hf-zh （main 分支，成品 `hf-zh.user.js`）

## 仓库结构
```
hf-zh.user.js   # 构建产物，GreasyFork 同步源
README.md
PUBLISH.md
```
同步源（raw）：
```
https://raw.githubusercontent.com/u2tt/hf-zh/main/hf-zh.user.js
```

## 首次发布（只做一次，需要人点两下）
1. 推送仓库（本机已配好，见下）：
   ```bash
   cd /Users/mac/dsh/profit/hf-zh-gh
   git add -A && git commit -m "update" && git push
   ```
2. 打开 https://greasyfork.org/zh-CN/script_versions/new ——「将新脚本导入到 Greasy Fork」，
   在 **从 URL 导入** 里填上面那条 raw 链接，点「导入」。
3. 会解析出 Userscript 头，补：脚本分类（如「无障碍 / 界面汉化」）、标签（huggingface、中文汉化、translation），保存 → 脚本上线。

> 页面需要登录 GreasyFork 才能打开（账号 4choor3，用 GitHub 第三方登录即可）。

## 后续更新（不用再登录 GreasyFork）
1. 改源：`/Users/mac/dsh/profit/hf-zh/dict.mjs` / `src/engine.js`
2. 提升版本号：`build.mjs` 里的 `@version`（例如 1.0.0 → 1.0.1）
3. 构建 + 自测：
   ```bash
   export PATH="/Users/mac/.local/state/fnm_multishells/1427_1793929749092/bin:$PATH"
   node build.mjs && node --check hf-zh.user.js && node verify.mjs
   ```
4. 复制到仓库并推送：
   ```bash
   cp hf-zh.user.js README.md /Users/mac/dsh/profit/hf-zh-gh/
   cd /Users/mac/dsh/profit/hf-zh-gh && git add -A && git commit -m "v1.0.1" && git push
   ```
5. GreasyFork 收到 push webhook（Payload URL `https://api.greasyfork.org/zh-CN/users/1131567-4choor3/webhook`）后自动把线上脚本更新到最新版。

## 环境注意
- 推 GitHub / 访问 GreasyFork 都要走代理 `http://127.0.0.1:7897`：
  `git config http.proxy http://127.0.0.1:7897`（已在本仓库设好）。
- `gh` CLI 已登录 4choor3（凭据在 keychain），建仓/推送用 `gh repo create` 即可。
- Webhook 的 secret 只在 GreasyFork「设置 → webhook」页可见，**不要写进仓库或笔记**。
- Playwright 的 **headed 窗口在本机会被立即关闭**，别用它做人工登录；需要登录的操作交给用户点。
- 同步 URL 必须是 raw 形式且文件名以 `.user.js` 结尾，否则导入会失败。
- raw.githubusercontent.com 有 CDN 缓存，push 后可能几分钟内仍返回旧内容。确认线上到底是不是新版，用 api 接口（不走 CDN）：
  ```bash
  curl -s -x http://127.0.0.1:7897 "https://api.github.com/repos/u2tt/hf-zh/contents/hf-zh.user.js?ref=main" -H "Accept: application/vnd.github.raw" | grep -n "@match"
  ```
  两边不一致就是缓存没刷，等一会再触发 GreasyFork 同步即可，不用重新提交。
- push 报 `OpenSSL SSL_read: unexpected eof while reading` 是代理抖动，重试即可；重试后用 `git ls-remote origin main` 确认远端 commit 是否真的更新了（本地 commit 成功不等于 push 成功）。

## 页面介绍（附加信息）同步
GreasyFork 脚本页的正文（「附加信息」）不跟脚本版本同步，需要单独配一条：
- 文案文件：`docs/greasyfork-description.md`
- 管理页 /zh-CN/scripts/604194/admin 「您可以选择同步脚本的其他信息」里填 raw 直链
  `https://raw.githubusercontent.com/u2tt/hf-zh/main/docs/greasyfork-description.md`，格式选 Markdown
- 改介绍页 = 改这个文件并 push（GF 的 webhook 只匹配 commit 里 **modified** 的文件，新增文件那一次不触发）

## 已挂同步的其它脚本
- DeepSeek 内容宽度调节 → https://raw.githubusercontent.com/u2tt/deepseek-width/main/deepseek-width.user.js
