/* 图解工坊 · 集成测试
 *
 * 真值全部来自 oracle/ui-truth.json（run 目录 oracle/ui-oracle.mjs 生成：节点/连线/消息数取 Mermaid 11 的 db，
 * 交叉数为暴力两两比较现数），由 inject-oracle.mjs 机械注入下面的 ORACLE 块 —— 本文件不手打任何数值。
 * 渲染守卫一律 import（render-guards.mjs）。
 */
import { renderGuards } from '/Users/lon/.agents/cron/daily-website/tools/render-guards.mjs';

const ORACLE = {
 "meta": {
  "tabs": [
   "edit",
   "templates",
   "docs",
   "syntax"
  ],
  "source": "oracle/ui-oracle.mjs：计数取 Mermaid 11.17.2 db；交叉数为暴力两两比较；格式化文本为引擎打印器输出（另有 3000 组 round-trip 离线对拍）"
 },
 "T1": {
  "text": "flowchart TD\n  A[开始] --> B{库存足够？}\n  B -->|是| C[扣减库存]\n  B -->|否| D[通知补货]\n  C --> E[(订单库)]\n  D --> F([结束])\n  E --> F\n  A --> D\n  C -.-> D\n",
  "mermaid": {
   "nodes": [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F"
   ],
   "edges": 8
  },
  "layout": {
   "cross": 0,
   "crossInit": 0,
   "realRanks": 5,
   "dummies": 14
  },
  "formatted": "flowchart TD\n    A[\"开始\"]\n    B{\"库存足够？\"}\n    C[\"扣减库存\"]\n    D[\"通知补货\"]\n    E[(\"订单库\")]\n    F([\"结束\"])\n    A --> B\n    B -->|\"是\"| C\n    B -->|\"否\"| D\n    C --> E\n    D --> F\n    E --> F\n    A --> D\n    C -.-> D\n",
  "firstLineLR": "flowchart LR"
 },
 "T2": {
  "text": "flowchart LR\n  a1 --> b2 & b3 & b4\n  a2 --> b1 & b3\n  a3 --> b1 & b2 & b4\n  a4 --> b2 & b1\n",
  "mermaid": {
   "nodes": [
    "a1",
    "b2",
    "b3",
    "b4",
    "a2",
    "b1",
    "a3",
    "a4"
   ],
   "edges": 10
  },
  "layout": {
   "cross": 7,
   "crossInit": 15,
   "realRanks": 2,
   "dummies": 10
  }
 },
 "BAD": {
  "text": "flowchart TD\n  A[开始] --> B\n  B -->> C\n",
  "mermaidRejects": true,
  "mermaidMsg": "Parse error on line 3:",
  "errLine": 3
 },
 "oauth": {
  "actors": [
   "U",
   "App",
   "Auth",
   "API"
  ],
  "messages": 10,
  "notes": 1
 },
 "retry": {
  "actors": [
   "P",
   "S",
   "DB"
  ],
  "messages": 8,
  "notes": 1
 },
 "deploy": {
  "nodes": [
   "dev",
   "repo",
   "ci",
   "bundle",
   "img",
   "fix",
   "cdn",
   "pop1",
   "pop2",
   "pop3"
  ],
  "edges": 10,
  "layout": {
   "cross": 0,
   "crossInit": 0,
   "realRanks": 7,
   "dummies": 12
  }
 },
 "templates": [
  "deploy",
  "login",
  "oauth",
  "retry",
  "state",
  "arch",
  "dinner",
  "git"
 ],
 "offline": {
  "mermaid": 2000,
  "ns": 600,
  "nsBetterThanDot": 4,
  "dags": 600,
  "layouts": 698,
  "crossChecked": 698,
  "edgesChecked": 5205,
  "crossReduce": [
   1845,
   341
  ],
  "roundtrip": 3000,
  "seq": 600,
  "b64": 500
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const O = ORACLE;
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(toolURL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => document.querySelectorAll('#dg-stage-in svg .ds-node').length > 0, null, { timeout: 10000 });

  const onTab = async (t) => {
    await page.click(`#dg-tab-${t}`);
    await page.waitForFunction((t) => !document.getElementById('dg-pane-' + t).hidden, t, { timeout: 5000 });
  };
  const setSrc = async (text) => {
    await page.evaluate((t) => { const s = document.getElementById('dg-src'); s.value = t; s.dispatchEvent(new Event('input', { bubbles: true })); }, text);
  };
  const stat = (i) => page.textContent(`#dg-s${i}`);

  // ── 1. 首次打开：默认文档 = 第一个模板，节点数 / 连线数与 Mermaid 一致 ──
  const n0 = await page.$$eval('#dg-stage-in .ds-node', (ns) => ns.map((n) => n.getAttribute('data-id')));
  assert(JSON.stringify(n0) === JSON.stringify(O.deploy.nodes), `默认图节点 ${n0} ≠ Mermaid ${O.deploy.nodes}`);
  assert(await page.$$eval('#dg-stage-in path.ds-e', (p) => p.length) === O.deploy.edges, '默认图连线数');
  assert(+(await stat(5)) === O.deploy.layout.cross, '默认图交叉数');
  assert(await page.$$eval('#dg-stage-in .ds-cluster', (c) => c.length) === 2, '默认图两个子图框');
  assert((await page.inputValue('#dg-docname')) === '一次部署的旅程', '默认文档名');
  // 自动适应宽度：图不应比舞台宽
  const fit = await page.evaluate(() => { const s = document.getElementById('dg-stage'), g = s.querySelector('svg'); return [g.getBoundingClientRect().width, s.clientWidth]; });
  assert(fit[0] <= fit[1], `首次打开应自动适应宽度：图 ${fit[0]} > 舞台 ${fit[1]}`);
  // 子图框几何上包住成员节点
  const inside = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('#dg-stage-in .ds-cluster').forEach((c) => {
      const cb = c.querySelector('rect').getBoundingClientRect();
      ({ build: ['bundle', 'img'], edge: ['cdn', 'pop1', 'pop2', 'pop3'] })[c.getAttribute('data-id')].forEach((id) => {
        const r = document.querySelector(`#dg-stage-in .ds-node[data-id="${id}"]`).getBoundingClientRect();
        if (r.left < cb.left - 0.5 || r.right > cb.right + 0.5 || r.top < cb.top - 0.5 || r.bottom > cb.bottom + 0.5) out.push(id);
      });
    });
    return out;
  });
  assert(inside.length === 0, '子图框没包住: ' + inside);

  // ── 2. 输入新图：计数、层数、交叉数、节点两两不重叠 ──
  await setSrc(O.T1.text);
  await page.waitForFunction((n) => document.querySelectorAll('#dg-stage-in .ds-node').length === n && document.getElementById('dg-s1').textContent === String(n), O.T1.mermaid.nodes.length, { timeout: 10000 });
  assert(+(await stat(2)) === O.T1.mermaid.edges, '连线数 = Mermaid');
  assert(+(await stat(3)) === O.T1.layout.realRanks, '层数');
  assert((await stat(5)).trim().endsWith(String(O.T1.layout.cross)), '交叉数 = 暴力现数');
  const ov = await page.evaluate(() => {
    const b = [...document.querySelectorAll('#dg-stage-in .ds-node')].map((g) => [g.getAttribute('data-id'), g.firstElementChild.getBoundingClientRect()]);
    const out = [];
    for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) { const p = b[i][1], q = b[j][1]; if (p.left < q.right && q.left < p.right && p.top < q.bottom && q.top < p.bottom) out.push(b[i][0] + '×' + b[j][0]); }
    return out;
  });
  assert(ov.length === 0, '节点重叠: ' + ov);
  // TD：每条非回边都朝下
  const down = await page.evaluate(() => {
    const y = {}; document.querySelectorAll('#dg-stage-in .ds-node').forEach((g) => { const r = g.getBoundingClientRect(); y[g.getAttribute('data-id')] = r.top + r.height / 2; });
    return [...document.querySelectorAll('#dg-stage-in path.ds-e')].every((p) => y[p.getAttribute('data-to')] > y[p.getAttribute('data-from')]);
  });
  assert(down, 'TD 方向下所有连线都应指向下方');
  // 边标签两个，且白底盒不压节点
  assert(await page.$$eval('#dg-stage-in .ds-elabel', (l) => l.length) === 2, '两个边标签');

  // 边标签盒（白底）两两不重叠、也不压节点：扇出 4 条带长标签的边，标签全挤在同一层
  await setSrc('flowchart TD\n  A[网关] -->|鉴权失败返回 401| B[登录页]\n  A -->|限流触发返回 429| C[排队页]\n  A -->|命中缓存直接返回| D[缓存]\n  A -->|回源到业务服务| E[业务服务]\n');
  await page.waitForFunction(() => document.querySelectorAll('#dg-stage-in .ds-elabel').length === 4, null, { timeout: 5000 });
  const lab = await page.evaluate(() => {
    const L = [...document.querySelectorAll('#dg-stage-in .ds-elabel rect')].map((r) => r.getBoundingClientRect());
    const N = [...document.querySelectorAll('#dg-stage-in .ds-node')].map((g) => g.firstElementChild.getBoundingClientRect());
    const hit = (p, q) => p.left < q.right - 0.5 && q.left < p.right - 0.5 && p.top < q.bottom - 0.5 && q.top < p.bottom - 0.5;
    let bad = 0;
    for (let i = 0; i < L.length; i++) { for (let j = i + 1; j < L.length; j++) if (hit(L[i], L[j])) bad++; N.forEach((n) => { if (hit(L[i], n)) bad++; }); }
    return bad;
  });
  assert(lab === 0, `边标签与标签/节点重叠 ${lab} 处`);

  // 交叉最小化：K 型二部图交叉从初始值降下来，且 = 暴力数
  await setSrc(O.T2.text);
  await page.waitForFunction((n) => document.querySelectorAll('#dg-stage-in .ds-node').length === n, O.T2.mermaid.nodes.length, { timeout: 10000 });
  await page.waitForFunction((s) => document.getElementById('dg-s5').textContent === s, `${O.T2.layout.crossInit} → ${O.T2.layout.cross}`, { timeout: 5000 });

  // ── 3. 错误：行号、行号槽标红、旧图保留并提示（断计算样式）──
  await setSrc(O.BAD.text);
  await page.waitForFunction(() => document.getElementById('dg-status').classList.contains('dg-st-err'), null, { timeout: 5000 });
  const stTxt = await page.textContent('#dg-status');
  assert(O.BAD.mermaidRejects && stTxt.includes(`第 ${O.BAD.errLine} 行`), '错误行号: ' + stTxt);
  assert(await page.$eval('#dg-gutter .dg-ln-err', (d) => d.textContent) === String(O.BAD.errLine), '行号槽标红错误行');
  assert(await page.$eval('#dg-stale', (e) => getComputedStyle(e).display) !== 'none', '出错时应提示旧图');
  assert(await page.$$eval('#dg-stage-in .ds-node', (n) => n.length) === O.T2.mermaid.nodes.length, '出错时保留上一张成功的图');
  await setSrc(O.T1.text);
  await page.waitForFunction(() => getComputedStyle(document.getElementById('dg-stale')).display === 'none' && document.getElementById('dg-status').classList.contains('dg-st-ok'), null, { timeout: 5000 });

  // ── 4. 点节点 → 选中源码对应行 ──
  await page.click('#dg-stage-in .ds-node[data-id="C"]');
  const sel = await page.evaluate(() => { const s = document.getElementById('dg-src'); return s.value.slice(s.selectionStart, s.selectionEnd); });
  assert(sel.trim() === 'B -->|是| C[扣减库存]', '点节点 C 应选中定义它的那一行，实得「' + sel + '」');
  assert(await page.$eval('#dg-gutter .dg-ln-hit', (d) => d.textContent) === '3', '行号槽高亮第 3 行');
  // 键盘：节点可 Tab 聚焦，回车同样跳转
  await page.focus('#dg-stage-in .ds-node[data-id="E"]');
  await page.keyboard.press('Enter');
  const sel2 = await page.evaluate(() => { const s = document.getElementById('dg-src'); return s.value.slice(s.selectionStart, s.selectionEnd).trim(); });
  assert(sel2 === 'C --> E[(订单库)]', '回车跳到 E 的定义行，实得 ' + sel2);

  // ── 5. 方向切换：首行被改写，LR 下游在右边 ──
  await page.selectOption('#dg-dir', 'LR');
  await page.waitForFunction((l) => document.getElementById('dg-src').value.split('\n')[0] === l, O.T1.firstLineLR, { timeout: 5000 });
  await page.waitForFunction(() => document.getElementById('dg-kind').textContent === 'flowchart LR', null, { timeout: 5000 });
  const right = await page.evaluate(() => {
    const x = {}; document.querySelectorAll('#dg-stage-in .ds-node').forEach((g) => { const r = g.getBoundingClientRect(); x[g.getAttribute('data-id')] = r.left + r.width / 2; });
    return [...document.querySelectorAll('#dg-stage-in path.ds-e')].every((p) => x[p.getAttribute('data-to')] > x[p.getAttribute('data-from')]);
  });
  assert(right, 'LR 方向下所有连线都应指向右方');

  // ── 6. 格式化 = 打印器输出（首行方向随之）──
  await page.selectOption('#dg-dir', 'TB');
  await page.waitForFunction(() => document.getElementById('dg-src').value.startsWith('flowchart TD'), null, { timeout: 5000 });
  await page.click('#dg-format');
  await page.waitForFunction((f) => document.getElementById('dg-src').value === f, O.T1.formatted, { timeout: 5000 });
  assert(await page.$$eval('#dg-stage-in .ds-node', (n) => n.length) === O.T1.mermaid.nodes.length, '格式化后图不变');

  // ── 7. 时序图模板：参与者 / 消息 / 注释数 = Mermaid ──
  await onTab('templates');
  assert(await page.$$eval('.dg-tcard', (c) => c.length) === O.templates.length, '模板卡片数');
  assert(await page.$$eval('.dg-tthumb svg', (s) => s.filter((x) => x.querySelector('text')).length) === O.templates.length, '每张模板卡都有缩略图');
  await page.click('[data-use="oauth"]');
  await page.waitForFunction(() => !document.getElementById('dg-pane-edit').hidden && document.getElementById('dg-kind').textContent === 'sequenceDiagram', null, { timeout: 5000 });
  const seq = await page.evaluate(() => ({
    actors: [...new Set([...document.querySelectorAll('#dg-stage-in .ds-actor')].map((g) => g.getAttribute('data-name')))],
    msgs: document.querySelectorAll('#dg-stage-in .ds-msg').length, notes: document.querySelectorAll('#dg-stage-in .ds-note').length,
    nums: [...document.querySelectorAll('#dg-stage-in .ds-numt')].map((t) => +t.textContent),
    acts: document.querySelectorAll('#dg-stage-in .ds-act').length,
    dirDisabled: document.getElementById('dg-dir').disabled,
  }));
  assert(JSON.stringify(seq.actors) === JSON.stringify(O.oauth.actors), '参与者 ' + seq.actors);
  assert(seq.msgs === O.oauth.messages && seq.notes === O.oauth.notes, `消息 ${seq.msgs}/注释 ${seq.notes}`);
  assert(JSON.stringify(seq.nums) === JSON.stringify(Array.from({ length: O.oauth.messages }, (_, i) => i + 1)), 'autonumber 1..N');
  assert(seq.acts === 3 && seq.dirDisabled, '三段激活条；时序图下方向下拉禁用');
  // 消息自上而下排列，且箭头端点落在参与者生命线上
  const geo = await page.evaluate(() => {
    const life = {}; document.querySelectorAll('#dg-stage-in .ds-actor rect').forEach((r) => { const b = r.getBoundingClientRect(); life[r.parentNode.getAttribute('data-name')] = b.left + b.width / 2; });
    const ys = [...document.querySelectorAll('#dg-stage-in .ds-msg path')].map((p) => p.getBoundingClientRect().top);
    return { mono: ys.every((y, i) => !i || y > ys[i - 1]), life: Object.keys(life).length };
  });
  assert(geo.mono, '消息应自上而下排列');
  assert(await page.inputValue('#dg-docname') === 'OAuth 2.0 授权码', '模板新建的文档名');

  // ── 8. 文档库：新建 / 持久化 / 删除需确认 ──
  await onTab('docs');
  assert((await page.textContent('#dg-doc-count')) === '2 份文档', '用模板后应有 2 份文档');
  await page.reload();
  await page.waitForFunction(() => document.getElementById('dg-kind').textContent === 'sequenceDiagram', null, { timeout: 10000 });
  assert(await page.inputValue('#dg-docname') === 'OAuth 2.0 授权码', '刷新后仍打开上次的文档');
  await onTab('docs');
  const rows = await page.$$eval('#dg-doc-rows tr', (r) => r.length);
  assert(rows === 2, '刷新后文档仍在');
  const del = page.locator('#dg-doc-rows tr:not(.dg-cur) [data-act="del"]');
  await del.click();
  assert((await del.textContent()) === '确认删除', '删除需二次确认');
  assert(await page.$$eval('#dg-doc-rows tr', (r) => r.length) === 2, '第一次点击不删');
  await del.click();
  await page.waitForFunction(() => document.querySelectorAll('#dg-doc-rows tr').length === 1, null, { timeout: 5000 });
  assert(await page.$eval('#dg-doc-rows [data-act="del"]', (b) => b.disabled), '只剩一份时不能删');
  await page.click('#dg-new');
  await page.waitForFunction(() => document.getElementById('dg-docname').value === '未命名 2' && !document.getElementById('dg-pane-edit').hidden, null, { timeout: 5000 });

  // ── 9. 分享链接：在新页面打开 = 同一份源码 ──
  await setSrc(O.T1.text);
  await page.waitForFunction(() => document.querySelectorAll('#dg-stage-in .ds-node').length === 6, null, { timeout: 5000 });
  await page.click('#dg-share');
  await page.waitForFunction(() => !!document.getElementById('dg-share').dataset.url, null, { timeout: 5000 });
  const url = await page.$eval('#dg-share', (b) => b.dataset.url);
  assert(/#ds=[A-Za-z0-9_-]+$/.test(url), '分享链接格式');
  const p2 = await page.context().newPage();
  await p2.goto(url.replace(/^[^#]*/, toolURL));
  await p2.waitForFunction(() => document.querySelectorAll('#dg-stage-in .ds-node').length > 0, null, { timeout: 10000 });
  assert((await p2.inputValue('#dg-src')) === O.T1.text, '分享链接还原出同一份源码');
  assert(!(await p2.evaluate(() => location.hash)), '导入后清掉网址 hash');
  await p2.close();

  // ── 10. 导出 SVG：真的下载、内容是完整 SVG 且含所有节点 ──
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#dg-export-svg')]);
  assert(dl.suggestedFilename() === '未命名-2.svg', '导出文件名 ' + dl.suggestedFilename());
  const body = await (await import('node:fs')).promises.readFile(await dl.path(), 'utf8');
  assert(body.startsWith('<?xml') && (body.match(/class="ds-node"/g) || []).length === 6 && body.includes('扣减库存'), '导出的 SVG 内容');
  const [dl2] = await Promise.all([page.waitForEvent('download'), page.click('#dg-export-png')]);
  assert(dl2.suggestedFilename().endsWith('.png'), 'PNG 导出');

  // ── 11. 能力清单：语法页列出的每一条都真的能解析（且无「不支持」提示）──
  await onTab('syntax');
  const dead = await page.evaluate(() => {
    const S = window.DG_SYNTAX, bad = [];
    S.shapes.forEach(([type, code]) => { const r = DSE.tryParse('flowchart LR\n' + code); if (r.error || r.ast.vertices[0].type !== type) bad.push(code); });
    S.edge.forEach(([code]) => { const r = DSE.tryParse('flowchart LR\n' + code); if (r.error || !r.ast.edges.length || r.ast.warnings.length) bad.push(code); });
    S.flow.forEach(([code]) => { const t = /^flowchart/.test(code) ? code + '\n  A --> B' : 'flowchart LR\n  A --> B\n' + code; const r = DSE.tryParse(t); if (r.error || r.ast.warnings.length) bad.push(code); });
    S.seq.forEach(([code]) => { const r = DSE.tryParse('sequenceDiagram\n' + (/^B-->>-A/.test(code) ? 'A->>+B: x\n' : '') + code); if (r.error || r.ast.warnings.length) bad.push(code); });
    return { bad, n: S.shapes.length + S.edge.length + S.flow.length + S.seq.length };
  });
  assert(dead.bad.length === 0 && dead.n >= 60, `速查表里这些写法解析不了：${dead.bad.join(' | ')}（共 ${dead.n} 条）`);
  assert(await page.$$eval('#dg-shapes svg .ds-node', (n) => n.length) === 14, '14 种形状都有预览');
  // 形状预览里文字不越出图形盒
  const esc = await page.$$eval('#dg-shapes .ds-node', (gs) => gs.filter((g) => { const s = g.firstElementChild.getBoundingClientRect(), t = g.querySelector('text').getBoundingClientRect(); return t.left < s.left - 1 || t.right > s.right + 1; }).map((g) => g.parentNode.closest('[data-shape]').dataset.shape));
  assert(esc.length === 0, '形状里的文字越界: ' + esc);
  // XSS：标签里的 HTML 只当文字
  await onTab('edit');
  await setSrc('flowchart TD\n  A["<img src=x onerror=window.__x=1>"] --> B\n');
  await page.waitForFunction(() => document.querySelectorAll('#dg-stage-in .ds-node').length === 2, null, { timeout: 5000 });
  assert(!(await page.evaluate(() => window.__x)) && (await page.$$eval('#dg-stage-in img', (i) => i.length)) === 0, '标签里的 HTML 不应被执行');

  // ── 12. 回到一张有内容的图，跑渲染守卫 ──
  await setSrc(O.T1.text);
  await page.waitForFunction(() => document.querySelectorAll('#dg-stage-in .ds-node').length === 6, null, { timeout: 5000 });
  const nCtl = await renderGuards(page, {
    assert, tabs: O.meta.tabs, onTab,
    paneSel: (t) => `#dg-pane-${t}`, panesRoot: '#dg-panes',
    figSel: (t) => (t === 'edit' ? '#dg-stage-in svg' : t === 'templates' ? '.dg-tthumb svg' : t === 'syntax' ? '#dg-shapes svg' : 'svg.none'),
    cardSel: '.dg-panel, .dg-tcard, .dg-scard', childSel: 'table, dl, h3, .dg-tthumb, .dg-actions',
    minControls: 24, minTextsInFig: 1, viewports: [390, 768],
  });
  assert(nCtl >= 24, '扫到的控件数 ' + nCtl);

  // 标签页键盘导航
  await onTab('edit');
  await page.focus('#dg-tab-edit');
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => !document.getElementById('dg-pane-templates').hidden && document.activeElement.id === 'dg-tab-templates', null, { timeout: 3000 });
  await onTab('edit');

  assert(errors.length === 0, '页面报错: ' + errors.join(' | '));

  // 缩略图：默认的部署旅程模板
  // （页面在 pagehide 时会把当前状态落盘，所以这里不用 clear+reload，直接用模板新建默认那张图）
  await onTab('templates');
  await page.click('[data-use="deploy"]');
  await page.waitForFunction(() => document.querySelectorAll('#dg-stage-in .ds-node').length === 10, null, { timeout: 10000 });
  const fit2 = await page.evaluate(() => { const s = document.getElementById('dg-stage'), g = s.querySelector('svg'); return [g.getBoundingClientRect().width, s.clientWidth]; });
  assert(fit2[0] <= fit2[1], `从模板页打开也应自动适应宽度：图 ${fit2[0]} > 舞台 ${fit2[1]}`);
  await page.waitForFunction(() => getComputedStyle(document.getElementById('dg-toast')).display === 'none', null, { timeout: 6000 });
  await page.evaluate(() => document.getElementById('dg-tab-edit').scrollIntoView({ block: 'start' }));
  await page.evaluate(() => window.scrollBy(0, -16));
  await screenshot('thumb.png');
};
