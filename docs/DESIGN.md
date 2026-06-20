# Daily Tools — 设计文档

> 每天自动构思、构建、**真实浏览器集成测试**并交付一个可用的小工具,沉淀成一个固定域名下不断生长的工具集合站(同时是作品集)。

## 目标

- 每天产出**一个**真正可用的小工具(解决小痛点 / 实用类),纯前端、自包含、零后端依赖,可静态托管。
- 所有工具沉淀在**同一个站点 / 同一域名**下,首页聚合全部历史,可按分类(tab)浏览、搜索。
- 每个工具上线前必须通过**真实浏览器(Playwright/Chromium)集成测试** —— 真的打开页面、操作核心交互、断言结果,不过不发布。
- 部署到 **GitHub Pages**(免费、稳定域名、git 版本史);将来用户接入自有域名时绑 CNAME 即可平滑切换。

## 站点结构

```
daily-tools/
  index.html            # 总首页:分类 tab + 工具卡片网格 + 搜索(客户端渲染)
  assets/
    hub.css  hub.js     # 首页外壳(读取 manifest.json 动态渲染)
  manifest.json         # 工具目录 = 唯一事实源 = 归档台账
  tools/
    YYYY-MM-DD-<slug>/
      index.html        # 自包含单文件工具(内联 CSS/JS)
      test.mjs          # 该工具的 Playwright 集成测试
      thumb.png         # 测试时自动截图,用作首页卡片缩略图
  test/
    server.mjs          # 本地静态服务器(首页 fetch manifest 需 http)
    run.mjs             # 测试编排:起服务器 → 跑 hub + 每个 tool 测试 → 截图 → 红/绿
    hub.test.mjs        # 首页冒烟测试
  docs/DESIGN.md
```

## manifest.json schema

```jsonc
{
  "site": { "title": "...", "subtitle": "...", "owner": "..." },
  "tools": [
    {
      "slug": "2026-06-21-cronlens",   // = 目录名,YYYY-MM-DD-<kebab>
      "title": "Cron 透镜",
      "subtitle": "一句话副标题",
      "category": "开发者工具",          // 决定首页分类 tab
      "date": "2026-06-21",
      "tags": ["cron", "schedule"],     // 参与搜索
      "path": "tools/2026-06-21-cronlens/",
      "thumb": "tools/2026-06-21-cronlens/thumb.png"
    }
  ]
}
```

首页 `hub.js` 客户端 `fetch('manifest.json')` → 渲染分类 tab + 卡片(按日期倒序)。新增工具 = 加一个 `tools/<slug>/` 目录 + 往 `manifest.tools` 追加一条 + 提交,无需改首页代码。

## 每日流水线(cron 触发的全新 session 跑完整条)

1. **去重 + 选题** — 读 `manifest.json` 已有 slug/标题,选一个**没做过**、高价值、可一次性交付的工具点子。
2. **构建** — 在 `tools/YYYY-MM-DD-<slug>/index.html` 写自包含工具;尽量做到设计精良、响应式、可访问。
3. **写测试** — 在同目录写 `test.mjs`,覆盖该工具的核心交互断言。
4. **集成测试** — `node test/run.mjs`:真实 Chromium 打开页面操作 + 断言 + 截图(`thumb.png`)。**不绿不发布**,失败回到第 2 步修。
5. **登记** — 往 `manifest.json` 追加该工具条目(= 归档)。
6. **部署** — `git commit && git push`,GitHub Pages 自动发布;拉取线上 URL 校验可访问。
7. **汇报** — 飞书回:一句话说明 + 截图 + 工具链接 + 首页链接。

## 不变量 / 纪律

- **纯静态自包含**:任何工具不得依赖后端;数据存浏览器(localStorage)即可。含后端的点子直接跳过。
- **测试是发布闸门**:`node test/run.mjs` 非绿不许 push。
- **manifest 是唯一事实源**:首页、台账、去重全部以它为准;每次 push 前 `JSON.parse` 校验,坏了就修,别带病发布。
- **slug 唯一且含日期**:`YYYY-MM-DD-<kebab>`,天然去重 + 可排序。
- **同一仓库 / 同一域名**:永远往这个仓库追加,不另开新仓库 / 新链接。
