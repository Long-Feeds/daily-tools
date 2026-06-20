# Daily Tools · 每日工具集

每天自动构思并交付**一个真正可用的小工具**,沉淀成一个不断生长的工具集合站。
每个工具上线前都经过**真实浏览器集成测试**,部署在 GitHub Pages。

🔗 **在线访问**:https://long-feeds.github.io/daily-tools/

## 它是什么

- 一个固定域名下的工具集合站 —— 首页聚合所有历史工具,可按分类切换、搜索。
- 每天新增一个纯前端、自包含、零后端依赖的小工具。
- 由 [claude-feishu-plugin](https://github.com/Long-Feeds/claude-feishu-plugin) 的定时任务自动构建 → 测试 → 部署。

## 本地开发 / 测试

```bash
bun install                 # 装依赖(含 Playwright)
bunx playwright install chromium
npm run serve               # 本地预览:http://localhost:8080
npm test                    # 跑全部集成测试(真实 Chromium)
```

## 新增一个工具

1. 在 `tools/YYYY-MM-DD-<slug>/index.html` 写自包含工具
2. 在同目录写 `test.mjs`(核心交互断言)
3. 往 `manifest.json` 的 `tools` 追加一条
4. `npm test` 通过后 `git push`,GitHub Pages 自动发布

详见 [docs/DESIGN.md](docs/DESIGN.md)。
