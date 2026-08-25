/* 关系网络工作台 · Graph Lab —— 真实浏览器集成测试
 *
 * 断言分三层：
 *  ① 真实数值：所有固定期望值都来自 networkx 3.6（离线对拍脚本已用 238 张图 / 52463 个断言点核过）
 *  ② 交互：切样例、改格式、点节点、拖节点、排序、搜索、算最短路与最大流
 *  ③ 历次事故守卫：[hidden] 计算样式、逐 tab 扫控件尺寸、子元素不越格、代码块不横向溢出、
 *     画布真的画了东西（数非背景像素而不是截元素）、标签「画出来几个」而不只是「掉了几个」
 */
export default async function run({ page, toolURL, screenshot, assert: rawAssert }) {
  let checks = 0;
  const assert = (cond, msg) => { checks++; rawAssert(cond, msg); };
  const near = (got, want, tol, what) =>
    assert(Math.abs(got - want) <= tol, `${what}: got ${got}, want ${want}±${tol}`);

  await page.goto(toolURL, { waitUntil: 'load' });
  await page.waitForFunction(() => typeof state !== 'undefined' && state.G && state.G.n > 0);

  /* ---------- 0 · 基本结构 ---------- */
  assert(await page.locator('a[href="../../"]').first().isVisible(), '缺少返回工具集链接');
  assert((await page.title()).includes('Graph Lab'), '标题不对');

  const tab = async (name) => {
    await page.click(`#gl-tab-${name}`);
    await page.waitForSelector(`#gl-panel-${name}:not([hidden])`);
  };
  const sample = async (id) => {
    await page.click(`[data-sample="${id}"]`);
    await page.waitForFunction((i) => typeof state !== 'undefined' && state.sampleId === i && state.G, id);
  };
  const stat = async (label) => page.evaluate((lb) => {
    const el = [...document.querySelectorAll('#gl-stats .gl-stat, #gl-struct-stats .gl-stat')]
      .find((e) => e.querySelector('i').textContent.trim() === lb);
    return el ? el.querySelector('b').textContent.trim() : null;
  }, label);
  /* 读指标表里某个节点某一列（列按表头文字定位，不写死下标） */
  const cell = async (node, col) => page.evaluate(([nm, cl]) => {
    const heads = [...document.querySelectorAll('#gl-metric-head th')].map((t) => t.textContent.replace(/[↓↑]/g, '').trim());
    const ci = heads.indexOf(cl);
    const row = [...document.querySelectorAll('#gl-metric-body tr')]
      .find((r) => r.cells[0].textContent.trim() === nm);
    return row && ci >= 0 ? row.cells[ci].textContent.trim() : null;
  }, [node, col]);

  /* ---------- 1 · 默认样例：前端依赖图 ---------- */
  assert((await stat('节点')) === '26', `deps 节点数不对：${await stat('节点')}`);
  assert((await stat('边')) === '43', `deps 边数不对：${await stat('边')}`);
  const status0 = await page.textContent('#gl-parse-status');
  assert(/边表/.test(status0) && /有向/.test(status0), `解析状态不对：${status0}`);

  /* 结构：deps 恰好 2 个有向环，内容与 networkx simple_cycles 一致 */
  await tab('structure');
  assert((await stat('有向环')) === '2', `环数不对：${await stat('有向环')}`);
  const cyclesText = await page.textContent('#gl-cycles');
  assert(cyclesText.includes('store/session → api/client → store/session'), '缺少 store/session ↔ api/client 这个二元环');
  assert(cyclesText.includes('pages/checkout → components/cart → hooks/useCart → pages/checkout'), '缺少三元环');
  assert(/api\/client → store\/session/.test(cyclesText), '没给出打破环的回边建议');
  assert((await stat('割点')) === '0', 'deps 不该有割点');
  const sccText = await page.textContent('#gl-layers');
  assert(sccText.includes('强连通团'), '有环时应显示强连通团');

  /* 指标：utils/format 是被依赖最多的模块（入度 7），介数第一是 pages/checkout = 29.90 */
  await tab('metrics');
  assert((await cell('utils/format', '入度')) === '7', `utils/format 入度不对：${await cell('utils/format', '入度')}`);
  await page.click('#gl-metric-head th[data-key="betweenness"]');
  const topRow = await page.evaluate(() => {
    const r = document.querySelector('#gl-metric-body tr');
    return { name: r.cells[0].textContent.trim(), bt: r.cells[[...document.querySelectorAll('#gl-metric-head th')].findIndex((t) => t.dataset.key === 'betweenness')].textContent.trim() };
  });
  assert(topRow.name === 'pages/checkout', `介数第一应是 pages/checkout，实际 ${topRow.name}`);
  near(Number(topRow.bt), 29.9, 0.01, 'pages/checkout 介数');

  /* ---------- 2 · 空手道俱乐部：中心性与社区 ---------- */
  await sample('karate');
  await tab('metrics');
  assert((await stat('节点')) === '34', `karate 节点数不对：${await stat('节点')}`);
  assert((await stat('边')) === '78', `karate 边数不对：${await stat('边')}`);
  assert((await cell('0', '度')) === '16', `karate 节点 0 的度不对：${await cell('0', '度')}`);
  assert((await cell('33', '度')) === '17', `karate 节点 33 的度不对：${await cell('33', '度')}`);
  near(Number(await cell('0', '介数')), 231.07, 0.02, 'karate 节点 0 介数');
  near(Number(await cell('33', '介数')), 160.55, 0.02, 'karate 节点 33 介数');
  near(Number(await cell('0', 'PageRank')), 0.097, 0.0005, 'karate 节点 0 PageRank');
  assert((await cell('0', 'k-core')) === '4', 'karate 节点 0 的 k-core 应为 4');
  const q = Number(await stat('模块度 Q'));
  assert(q >= 0.40 && q <= 0.45, `karate 模块度 Q 应在 0.40~0.45，实际 ${q}`);
  const commCount = Number(await stat('社区数'));
  assert(commCount >= 2 && commCount <= 6, `karate 社区数异常：${commCount}`);
  await tab('flow');
  const reach = await page.textContent('#gl-reach-out');
  assert(/直径<\/b>：5 跳|直径.*5 跳/.test(reach), `karate 直径应为 5：${reach.slice(0, 120)}`);
  assert(reach.includes('2.408'), `karate 平均最短路应为 2.408：${reach.slice(0, 200)}`);

  /* ---------- 3 · 《悲惨世界》：加权网络 ---------- */
  await sample('lesmis');
  await tab('metrics');
  assert((await stat('节点')) === '77', `lesmis 节点数不对：${await stat('节点')}`);
  assert((await stat('边')) === '254', `lesmis 边数不对：${await stat('边')}`);
  assert((await cell('Valjean', '度')) === '36', `Valjean 度不对：${await cell('Valjean', '度')}`);
  assert((await cell('Valjean', '加权度')) === '158', `Valjean 加权度不对：${await cell('Valjean', '加权度')}`);
  near(Number(await cell('Valjean', '介数')), 1624.47, 0.02, 'Valjean 介数');
  const tops = await page.textContent('#gl-tops');
  assert(tops.includes('Valjean'), '排行榜里没有 Valjean');

  /* 搜索过滤 */
  await page.fill('#gl-metric-search', 'Val');
  await page.waitForFunction(() => document.querySelectorAll('#gl-metric-body tr').length === 1);
  assert((await page.textContent('#gl-metric-body tr td')).includes('Valjean'), '搜索过滤结果不对');
  await page.fill('#gl-metric-search', '');
  await page.waitForFunction(() => document.querySelectorAll('#gl-metric-body tr').length > 50);

  /* CSV 导出内容（真的生成一遍，不只是点按钮） */
  const csv = await page.evaluate(() => metricsCSV());
  const csvLines = csv.trim().split('\n');
  assert(csvLines.length === 78, `CSV 行数应为 1 表头 + 77 节点，实际 ${csvLines.length}`);
  assert(csvLines[0].startsWith('节点,度'), `CSV 表头不对：${csvLines[0]}`);
  assert(csvLines.some((l) => l.startsWith('"Valjean",36,158')), 'CSV 里 Valjean 那行不对');

  /* ---------- 4 · 佛罗伦萨家族：介数 ≠ 度 ---------- */
  await sample('florentine');
  await tab('metrics');
  assert((await cell('Medici', '度')) === '6', `Medici 度不对：${await cell('Medici', '度')}`);
  near(Number(await cell('Medici', '介数')), 47.5, 0.01, 'Medici 介数');
  near(Number(await cell('Guadagni', '介数')), 23.17, 0.01, 'Guadagni 介数');
  assert((await cell('Strozzi', '度')) === '4', 'Strozzi 度应为 4');
  near(Number(await cell('Strozzi', '介数')), 9.33, 0.02, 'Strozzi 介数（度相同但介数远低于 Guadagni）');

  /* ---------- 5 · 微服务链路：最大流与最小割 ---------- */
  await sample('micro');
  await tab('flow');
  await page.selectOption('#gl-src', { label: '入口网关' });
  await page.selectOption('#gl-dst', { label: '主数据库' });
  await page.click('#gl-btn-flow');
  await page.waitForFunction(() => document.getElementById('gl-flow-out').textContent.includes('最大流'));
  const flowText = await page.textContent('#gl-flow-out');
  assert(/最多 650\b/.test(flowText), `最大流应为 650：${flowText.slice(0, 200)}`);
  assert(flowText.includes('最小割（3 条边，容量合计 650）'), `最小割不对：${flowText.slice(0, 300)}`);
  for (const e of ['库存服务', '对账服务', '只读副本']) {
    assert(flowText.includes(e), `最小割里应包含 ${e}`);
  }
  const hlCount = await page.evaluate(() => state.hl.edges.size);
  assert(hlCount === 3, `图上应高亮 3 条割边，实际 ${hlCount}`);

  /* 最短路：按跳数 4 跳 */
  await page.click('#gl-btn-path');
  await page.waitForFunction(() => document.getElementById('gl-path-out').textContent.includes('跳'));
  const pathText = await page.textContent('#gl-path-out');
  assert(pathText.includes('4 跳'), `跳数最短路应为 4 跳：${pathText.slice(0, 160)}`);
  assert(pathText.includes('入口网关 → 鉴权服务 → 订单服务 → 库存服务 → 主数据库'), `最短路径不对：${pathText.slice(0, 200)}`);

  /* ---------- 6 · 地铁网：割点与桥 + 加权最短路 ---------- */
  await sample('metro');
  await tab('structure');
  assert((await stat('割点')) === '12', `metro 割点数应为 12：${await stat('割点')}`);
  assert((await stat('桥')) === '11', `metro 桥数应为 11：${await stat('桥')}`);
  const cutsText = await page.textContent('#gl-cuts');
  assert(cutsText.includes('市民中心'), '割点里应有市民中心');
  assert(/碎成 \d+ 块/.test(cutsText), '割点应给出删掉后碎成几块');
  assert((await stat('最小生成森林权重')) === '69', `metro 最小生成森林权重应为 69：${await stat('最小生成森林权重')}`);
  await tab('flow');
  await page.selectOption('#gl-src', { label: '机场' });
  await page.selectOption('#gl-dst', { label: '保税区' });
  await page.selectOption('#gl-path-mode', 'weight');
  await page.click('#gl-btn-path');
  await page.waitForFunction(() => document.getElementById('gl-path-out').textContent.includes('权重之和'));
  const metroPath = await page.textContent('#gl-path-out');
  assert(metroPath.includes('权重之和 29'), `加权最短距离应为 29：${metroPath.slice(0, 200)}`);
  assert(metroPath.includes('5 跳'), `该路径应是 5 跳：${metroPath.slice(0, 200)}`);
  assert(metroPath.includes('机场 — 机场路 — 东湖 — 滨江 — 南港 — 保税区'), `加权最短路径不对：${metroPath.slice(0, 220)}`);

  /* ---------- 7 · 四种输入格式（真的敲进去） ---------- */
  const typeGraph = async (text, expectN, expectM) => {
    await page.fill('#gl-input', text);
    await page.waitForFunction(([n, m]) => typeof state !== 'undefined' && state.G && state.G.n === n && state.G.edges.length === m, [expectN, expectM], { timeout: 5000 });
  };
  await typeGraph('{"nodes":["a","b","c"],"links":[{"source":"a","target":"b","weight":3},{"source":"b","target":"c"}]}', 3, 2);
  assert((await page.textContent('#gl-parse-status')).includes('JSON'), 'JSON 格式没被识别');
  await typeGraph('digraph G { a -> b [weight=2]; b -> c; c -> a; d; }', 4, 3);
  assert((await page.textContent('#gl-parse-status')).includes('DOT'), 'DOT 格式没被识别');
  await typeGraph(',甲,乙,丙\n甲,0,1,0\n乙,1,0,2\n丙,0,2,0', 3, 2);
  const mstatus = await page.textContent('#gl-parse-status');
  assert(mstatus.includes('邻接矩阵') && mstatus.includes('无向'), `矩阵识别不对：${mstatus}`);
  const mw = await page.evaluate(() => state.G.edges.map((e) => e.w));
  assert(JSON.stringify(mw) === '[1,2]', `对称矩阵的权重不该翻倍：${JSON.stringify(mw)}`);

  /* 错误提示带行号 */
  await page.fill('#gl-input', 'a -> b\nc ->\nd -- e');
  await page.waitForFunction(() => document.getElementById('gl-parse-status').className.includes('gl-status-bad'));
  const errText = await page.textContent('#gl-parse-status');
  assert(errText.includes('第 2 行'), `错误应指到第 2 行：${errText}`);

  /* 方向切换：deps 里有一对互指的边，按无向图看会合并成一条 */
  await sample('deps');
  await page.selectOption('#gl-directed', 'no');
  await page.waitForFunction(() => typeof state !== 'undefined' && state.G && !state.G.directed);
  assert((await stat('边')) === '42', `按无向看应剩 42 条边：${await stat('边')}`);
  await page.selectOption('#gl-directed', 'auto');
  await page.waitForFunction(() => typeof state !== 'undefined' && state.G && state.G.directed);

  /* ---------- 8 · 画布交互 ---------- */
  await tab('graph');
  await page.selectOption('#gl-layout', 'force');
  await page.waitForTimeout(120);
  const canvasInfo = await page.evaluate(() => {
    const c = document.getElementById('gl-canvas');
    const ctx = c.getContext('2d');
    const img = ctx.getImageData(0, 0, c.width, c.height).data;
    let painted = 0;
    for (let i = 0; i < img.length; i += 4) {
      /* 背景是 #faf5e8 */
      if (Math.abs(img[i] - 250) > 6 || Math.abs(img[i + 1] - 245) > 6 || Math.abs(img[i + 2] - 232) > 6) painted++;
    }
    return { painted, w: c.width, h: c.height, draw: state.lastDraw };
  });
  assert(canvasInfo.painted > 20000, `画布几乎是空的（非背景像素 ${canvasInfo.painted}）`);
  assert(canvasInfo.draw.edges === 43, `画布应画出 43 条边，实际 ${canvasInfo.draw.edges}`);
  assert(canvasInfo.draw.labels >= 18, `节点标签画出来太少：${canvasInfo.draw.labels}/26`);

  /* 点节点 → 详情面板（先把画布滚进视口，否则点击坐标落在窗口外） */
  await page.locator('#gl-canvas').scrollIntoViewIfNeeded();
  await page.waitForTimeout(120);
  const target = await page.evaluate(() => {
    const i = state.G.ids.indexOf('utils/format');
    return { x: state.layout[i].x * state.view.scale + state.view.dx, y: state.layout[i].y * state.view.scale + state.view.dy };
  });
  const box = await page.locator('#gl-canvas').boundingBox();
  await page.mouse.click(box.x + target.x, box.y + target.y);
  await page.waitForFunction(() => document.querySelector('#gl-detail h4') !== null);
  assert((await page.textContent('#gl-detail h4')).trim() === 'utils/format', '点节点后详情标题不对');
  const detail = await page.textContent('#gl-detail');
  assert(detail.includes('指向它的（7）'), `详情里的入边数应为 7：${detail.slice(0, 200)}`);

  /* 拖节点：位置变了、选中态不变 */
  const before = await page.evaluate(() => ({ ...state.layout[state.selected] }));
  await page.mouse.move(box.x + target.x, box.y + target.y);
  await page.mouse.down();
  await page.mouse.move(box.x + target.x + 70, box.y + target.y + 40, { steps: 6 });
  await page.mouse.up();
  const after = await page.evaluate(() => ({ ...state.layout[state.G.ids.indexOf('utils/format')] }));
  assert(Math.abs(after.x - before.x) > 10 || Math.abs(after.y - before.y) > 10, '拖动没有移动节点');

  /* 缩放按钮 */
  const s0 = await page.evaluate(() => state.view.scale);
  await page.click('#gl-zoom-in');
  const s1 = await page.evaluate(() => state.view.scale);
  assert(s1 > s0, '放大按钮没生效');
  await page.click('#gl-zoom-fit');
  const s2 = await page.evaluate(() => state.view.scale);
  assert(Math.abs(s2 - s1) > 1e-9 || Math.abs(s2 - s0) < 1e-6, '复位按钮没生效');

  /* 点空白处取消选中（选中态下只标邻居，会影响下面的标签计数） */
  const box2 = await page.locator('#gl-canvas').boundingBox();
  await page.mouse.click(box2.x + 12, box2.y + 12);
  await page.waitForFunction(() => state.selected === -1);
  assert((await page.textContent('#gl-detail')).includes('点一个节点'), '取消选中后详情面板没回到提示态');

  /* 着色 / 大小 / 标签开关都不该报错，且标签数按预期变化 */
  await page.selectOption('#gl-labels', 'top');
  await page.waitForTimeout(80);
  const topLabels = await page.evaluate(() => state.lastDraw.labels);
  assert(topLabels <= 12 && topLabels >= 6, `只标前 12 名时画出的标签数异常：${topLabels}`);
  await page.selectOption('#gl-labels', 'none');
  await page.waitForTimeout(80);
  assert((await page.evaluate(() => state.lastDraw.labels)) === 0, '关掉标签后不该还有标签');
  await page.selectOption('#gl-labels', 'auto');
  await page.selectOption('#gl-color', 'betweenness');
  await page.selectOption('#gl-size', 'pagerank');
  await page.waitForTimeout(120);
  assert((await page.evaluate(() => state.lastDraw.nodes)) === 26, '换着色/大小后节点数不该变');
  await page.selectOption('#gl-color', 'community');
  await page.selectOption('#gl-size', 'degree');

  /* 社区算法切换 */
  await page.selectOption('#gl-community', 'labelprop');
  await page.waitForFunction(() => typeof state !== 'undefined' && state.commInfo);
  assert(Number(await stat('社区数')) >= 1, '标签传播没算出社区');
  await page.selectOption('#gl-community', 'louvain');
  await page.waitForTimeout(120);

  /* ---------- 9 · 存档到 localStorage ---------- */
  await page.fill('#gl-project-name', '测试项目');
  await page.click('#gl-btn-save');
  await page.waitForFunction(() => document.querySelectorAll('#gl-projects li b').length >= 1);
  assert((await page.textContent('#gl-projects')).includes('测试项目'), '项目没存进列表');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('graph-lab-projects-v1') || '[]').length);
  assert(stored >= 1, 'localStorage 里没有项目');

  /* ---------- 10 · 事故守卫 ---------- */
  const PANELS = ['graph', 'metrics', 'structure', 'flow', 'data'];

  /* (a) [hidden] 真的隐藏了（断计算样式，不是断属性） */
  for (const name of PANELS) {
    await tab(name);
    const vis = await page.evaluate((cur) => {
      return [...document.querySelectorAll('.gl-panel')].map((p) => ({
        id: p.id, hidden: p.hidden, display: getComputedStyle(p).display, isCur: p.id === 'gl-panel-' + cur,
      }));
    }, name);
    for (const v of vis) {
      if (v.isCur) assert(v.display !== 'none', `当前面板 ${v.id} 不该被隐藏`);
      else assert(v.display === 'none', `非当前面板 ${v.id} 的计算样式 display=${v.display}（[hidden] 被作者 CSS 压掉了）`);
    }
  }

  /* (b) 逐 tab 扫控件尺寸（藏起来的面板里塌缩的控件测不出来 —— 所以要逐页切） */
  let scanned = 0;
  for (const name of PANELS) {
    await tab(name);
    const bad = await page.evaluate(() => {
      const out = [];
      let n = 0;
      for (const el of document.querySelectorAll('input,select,button,textarea')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;      /* 不在当前面板里 */
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        n++;
        const isCheck = el.type === 'checkbox' || el.type === 'radio' || el.type === 'range';
        const minW = isCheck ? 18 : (el.tagName === 'BUTTON' ? 52 : 100);
        if (r.width < minW || r.height < 18) out.push(`${el.tagName}#${el.id || el.className} ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
      return { out, n };
    });
    scanned += bad.n;
    assert(bad.out.length === 0, `${name} 页有控件塌缩：${bad.out.join(' | ')}`);
  }
  assert(scanned >= 40, `逐 tab 扫到的控件太少（${scanned}），守卫可能扫了个寂寞`);

  /* (c) 子元素不越出父盒（统计卡片 / 图例 / 排行榜格子） */
  await tab('graph');
  const overflow = await page.evaluate(() => {
    const bad = [];
    const check = (sel) => {
      for (const p of document.querySelectorAll(sel)) {
        const pr = p.getBoundingClientRect();
        for (const c of p.children) {
          const cr = c.getBoundingClientRect();
          if (cr.width === 0 && cr.height === 0) continue;
          if (cr.left < pr.left - 1 || cr.right > pr.right + 1 || cr.top < pr.top - 1 || cr.bottom > pr.bottom + 1) {
            bad.push(`${sel} 里的 ${c.tagName}.${c.className} 越出了`);
          }
        }
      }
    };
    check('.gl-stat'); check('.gl-legitem'); check('.gl-kv div');
    return bad;
  });
  assert(overflow.length === 0, `有子元素越出父盒：${overflow.join(' | ')}`);

  /* (d) 代码块不横向撑破卡片 */
  await tab('data');
  const codeOverflow = await page.evaluate(() =>
    [...document.querySelectorAll('.gl-code')].map((e) => e.scrollWidth - e.clientWidth).filter((d) => d > 2));
  assert(codeOverflow.length === 0, `代码块横向溢出：${JSON.stringify(codeOverflow)}`);

  /* (e) 表头 / 标签里没有被 uppercase 改写的单位或缩写 */
  await tab('metrics');
  const uppercased = await page.evaluate(() =>
    [...document.querySelectorAll('th,dt,label,.gl-stat i')]
      .map((e) => e.textContent.trim())
      .filter((t) => /\b(HZ|KHZ|DBFS|DB|PAGERANK|K-CORE)\b/.test(t)));
  assert(uppercased.length === 0, `疑似被 uppercase 改写：${uppercased.join(' | ')}`);

  /* (f) 页面没有横向滚动条 */
  const bodyOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(bodyOverflow <= 2, `页面横向溢出 ${bodyOverflow}px`);

  /* (g) 空输入不炸 */
  await page.fill('#gl-input', '');
  await page.waitForFunction(() => typeof state !== 'undefined' && state.G && state.G.n === 0);
  await tab('structure');
  await tab('metrics');
  await tab('graph');
  assert((await page.textContent('#gl-canvas-hint')).length >= 0, '空图时画布提示挂了');

  /* ---------- 11 · 缩略图 ---------- */
  await sample('lesmis');
  await page.selectOption('#gl-layout', 'force');
  await page.waitForFunction(() => typeof state !== 'undefined' && state.lastDraw.nodes === 77);
  await tab('graph');
  /* 缩略图取「统计卡 + 关系图」这一段，比纯标题更能说明这工具是干嘛的 */
  await page.evaluate(() => window.scrollTo(0, 455));
  await page.waitForTimeout(320);
  await screenshot('thumb.png');
  console.log(`      (graph-lab: ${checks} 条浏览器断言)`);
}
