# Hugging Face 界面汉化（UserScript）

作者：陈鑫宇 · 版本 1.0.0 · 许可证 MIT

把 huggingface.co 的**界面文字**翻译成简体中文：导航、按钮、筛选面板、排序下拉、标签、表格表头、时间与计数等。
**不翻译**模型卡 / README 正文、仓库名、组织名、库名、论文标题——这些属于内容而非界面，翻了反而看不懂。

## 安装

1. 浏览器安装 Tampermonkey（Chrome / Edge / Firefox / Safari 均可）。
2. 打开 Tampermonkey 面板 → **添加新脚本**。
3. 全选默认内容删除，粘贴 `hf-zh.user.js` 的全部内容 → **Ctrl/Cmd + S** 保存。
4. 打开 https://huggingface.co/ ，左下角出现圆形「中」按钮即生效。

## 使用

| 操作 | 说明 |
| --- | --- |
| 左下角圆形按钮（中 / EN） | 一键切换中文 / 原文 |
| `Alt + Z` | 同上，键盘快捷键 |
| 刷新后状态 | 记住上次选择（localStorage） |

脚本只改文本节点，不改 DOM 结构、不拦截网络请求，页面上任何交互（下载、推理、登录）保持原样。
对 SPA 路由跳转与懒加载列表做了监听，翻页 / 切 tab / 展开下拉都会自动补翻。

## 开发

```bash
node build.mjs      # src/engine.js + dict.mjs → hf-zh.user.js（重复 key 会直接报错）
node verify.mjs     # Playwright 走 127.0.0.1:7897 代理，17 个页面注入实测，出截图与漏译清单
node dump.mjs       # 把漏译条目去重后列出来，方便补词
```

- `src/engine.js`：运行时引擎（精确匹配 + 正则规则 + MutationObserver + 路由监听 + 开关）
- `dict.mjs`：词典，`[英文, 中文]`，按功能分组
- `out/shots/`：实测截图；`out/verify.json`：每页漏译明细

翻译策略是**整段文本全等匹配**，而不是正则子串替换——后者会把 "Most liked" 变成「Most 喜欢」，这是旧脚本的主要问题。
