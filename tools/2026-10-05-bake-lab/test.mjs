/* 烘焙工作台 · 集成测试
 *
 * 数值真值全部来自 oracle/truth.json（run 目录 oracle/scenarios.py 调 oracle.py：Python 独立实现，
 * fractions.Fraction 精确有理数算配方 / scipy quad 积分截面算模具容积 / brentq 解热平衡求水温与冰量），
 * 由 inject-oracle.mjs 机械注入下面的 ORACLE 块 —— 本文件不手打任何计算结果。
 * 页面读数一律按显示精度比较（display-tolerance.mjs）；渲染守卫 import（render-guards.mjs）。
 */
import { renderGuards } from '/Users/lon/.agents/cron/daily-website/tools/render-guards.mjs';
import { makeDisplayCompare } from '/Users/lon/.agents/cron/daily-website/tools/display-tolerance.mjs';

const ORACLE = {
 "meta": {
  "tabs": [
   "recipe",
   "pan",
   "leaven",
   "temp",
   "convert",
   "about"
  ],
  "source": "oracle/scenarios.py → oracle.py（Fraction / quad / brentq 独立实现）"
 },
 "s1": {
  "flourDirect": 500,
  "flourTotal": 550,
  "waterTotal": 400,
  "total": 960,
  "hydration": 72.72727272727273,
  "prefPct": 9.090909090909092,
  "saltPct": 1.8181818181818181,
  "pct": [
   90,
   10,
   70,
   20,
   2
  ],
  "pctTotal": [
   81.81818181818181,
   9.090909090909092,
   63.63636363636363,
   18.181818181818183,
   1.8181818181818181
  ]
 },
 "s2": {
  "k": 1.4875,
  "g": [
   669.375,
   74.375,
   520.625,
   148.75,
   14.875
  ]
 },
 "s3": {
  "flourDirect": 500,
  "flourTotal": 550,
  "waterTotal": 430,
  "total": 990,
  "hydration": 78.18181818181819,
  "prefPct": 9.090909090909092,
  "saltPct": 1.8181818181818181,
  "pct": [
   90,
   10,
   76,
   20,
   2
  ],
  "pctTotal": [
   81.81818181818181,
   9.090909090909092,
   69.0909090909091,
   18.181818181818183,
   1.8181818181818181
  ]
 },
 "s4": {
  "g": [
   681.8181818181819,
   75.75757575757575,
   575.7575757575758,
   151.5151515151515,
   15.151515151515152
  ],
  "pct": [
   90,
   10,
   76,
   20,
   2
  ]
 },
 "s5": {
  "flourDirect": 250,
  "flourTotal": 250,
  "waterTotal": 167.3,
  "total": 605,
  "hydration": 66.92,
  "prefPct": 0,
  "saltPct": 2,
  "pct": [
   100,
   60,
   16,
   12,
   50,
   2,
   2
  ],
  "pctTotal": [
   100,
   60,
   16,
   12,
   50,
   2,
   2
  ]
 },
 "s6": {
  "areaA": 324.2927866223988,
  "areaB": 400,
  "volA": 1621.463933111994,
  "volB": 2000,
  "ratio": 1.2334532758687398
 },
 "s6b": {
  "vol": 2172.5,
  "dough38": 571.7105263157895,
  "dough42": 517.2619047619047,
  "k_brioche": 0.9449760765550239
 },
 "s7": {
  "active": 10.5,
  "fresh": 21,
  "from_fresh_12_instant": 4
 },
 "s8": {
  "flour": 250,
  "water": 167.3,
  "levain": 100,
  "mainF": 200,
  "mainW": 117.3
 },
 "s9": {
  "seed": 13.636363636363637,
  "flour": 68.18181818181819,
  "water": 68.18181818181819,
  "hyd": 100
 },
 "s10": {
  "w1": 19.999999999999996,
  "ice1": 25,
  "w2": 21,
  "w3": 3,
  "ice3": 151.88679245283018,
  "w3F": 37.4,
  "cal": 17
 },
 "s11": {
  "ap_1half_cup": 180,
  "honey_3tbsp": 63,
  "ap100_cup": 0.8333333333333334,
  "ap100_tbsp": 13.333333333333334,
  "butter_1_3_cup": 75.66666666666667
 },
 "s12": {
  "f180": 356,
  "gas180": "4",
  "f220": 428,
  "gas220": "7",
  "c450f": 232.22222222222223,
  "gas450f": "8"
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const O = ORACLE;
  const T = O.meta.tabs;
  const { closeS, closeV, txt } = makeDisplayCompare(page, assert);
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(toolURL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => document.getElementById('bk-k-hyd').textContent.includes('%'), null, { timeout: 10000 });

  const onTab = async (t) => {
    await page.click(`#bk-tab-${t}`);
    await page.waitForFunction((t) => !document.getElementById(`bk-pane-${t}`).hidden, t, { timeout: 10000 });
  };
  const waitTxt = (sel, pred) => page.waitForFunction(([s, p]) => {
    const n = document.querySelector(s); return n && new Function('t', 'return ' + p)(n.textContent);
  }, [sel, pred], { timeout: 10000 });
  const row = (i) => `#bk-rows .bk-ing:nth-child(${i + 1})`;

  // ── 返回链接 ──
  assert(await page.$eval('#bk-back', (a) => a.getAttribute('href')) === '../../', '返回链接指向 ../../');

  // ── 1. 默认配方（天然酵种乡村面包）分析 ──
  const s1 = O.s1;
  await closeS('#bk-k-hyd', s1.hydration, '总含水率');
  await closeS('#bk-k-total', s1.total, '总重');
  await closeS('#bk-k-flour', s1.flourTotal, '总面粉（含酵种）');
  await closeS('#bk-k-water', s1.waterTotal, '总水量（含酵种）');
  await closeS('#bk-k-salt', s1.saltPct, '盐占总粉');
  await closeS('#bk-k-pref', s1.prefPct, '预发酵面粉');
  await closeS('#bk-hs-hyd', s1.hydration, '页首速览含水率');
  const cells = await page.$$eval('#bk-tbl tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent.trim())));
  assert(cells.length === 5, `表格 5 行，实得 ${cells.length}`);
  cells.forEach((c, i) => { closeV(c[2], s1.pct[i], `第 ${i + 1} 行烘焙%`); closeV(c[3], s1.pctTotal[i], `第 ${i + 1} 行占总粉%`); });
  // 条形图：条宽与百分比成正比（几何断言），最长那条是面粉 90%
  const bars = await page.$$eval('#bk-fig .bk-fig-bar', (ns) => ns.map((n) => ({ w: n.getBoundingClientRect().width, v: +n.dataset.v })));
  assert(bars.length === 5, '5 根条');
  const ratio = bars[0].w / bars[0].v;
  bars.forEach((b, i) => assert(Math.abs(b.w - b.v * ratio) < 1.0, `第 ${i + 1} 根条宽 ${b.w.toFixed(1)} 应 ∝ ${b.v}`));
  assert(bars[0].w > 150, `最长条应有可见宽度，实得 ${bars[0].w}`);

  // ── 2. 缩放：4 份 × 350 g、损耗 2% ──
  await closeS('#bk-sc-kout', O.s2.k, '缩放倍数');
  const scg = await page.$$eval('#bk-sc-tbl .bk-sc-g', (ns) => ns.map((n) => n.textContent));
  assert(scg.length === 5, '缩放表 5 行');
  scg.forEach((t, i) => closeV(t, O.s2.g[i], `缩放后第 ${i + 1} 行`));
  // 切到「目标总重」，隐藏的输入组计算样式必须是 none
  await page.selectOption('#bk-sc-mode', 'total');
  await page.fill('#bk-sc-total', '1920');
  await waitTxt('#bk-sc-kout', 't.includes("× 2")');
  assert(await page.$eval('#bk-sc-n', (n) => getComputedStyle(n.closest('.bk-fld')).display) === 'none', '份数输入组应被藏住（计算样式）');
  await page.fill('#bk-sc-total', '-5');
  await page.waitForFunction(() => !document.getElementById('bk-sc-err').hidden, null, { timeout: 10000 });
  assert(await page.$eval('#bk-sc-apply', (b) => b.disabled), '非法目标时禁用「替换」');
  await page.selectOption('#bk-sc-mode', 'pieces');

  // ── 3. 改水量 → 含水率实时更新 ──
  await page.fill(`${row(2)} .bk-r-amt`, '380');
  await waitTxt('#bk-k-hyd', `t.startsWith("${O.s3.hydration.toFixed(1)}")`);
  await closeS('#bk-k-hyd', O.s3.hydration, '改水后含水率');
  await closeS('#bk-k-total', O.s3.total, '改水后总重');
  // 非法输入：负数 → 报错、KPI 归 —、输入框标红
  await page.fill(`${row(4)} .bk-r-amt`, '-3');
  await page.waitForFunction(() => !document.getElementById('bk-err').hidden, null, { timeout: 10000 });
  assert((await txt('#bk-err')).includes('第 5 行'), '错误信息指出第 5 行');
  assert(await txt('#bk-k-hyd') === '—', '出错时 KPI 显示 —');
  assert(await page.$eval(`${row(4)} .bk-r-amt`, (n) => n.classList.contains('bk-bad')), '负数输入框标红');
  await page.fill(`${row(4)} .bk-r-amt`, '10');
  await page.waitForFunction(() => document.getElementById('bk-err').hidden, null, { timeout: 10000 });

  // ── 4. 按百分比模式：目标 1500 g ──
  await page.click('#bk-mode-p');
  await page.waitForFunction(() => !document.getElementById('bk-pbox').hidden, null, { timeout: 10000 });
  const pcts = await page.$$eval('#bk-rows .bk-r-amt', (ns) => ns.map((n) => n.value));
  pcts.forEach((p, i) => closeV(p, O.s4.pct[i], `百分比模式第 ${i + 1} 行`));
  await page.fill('#bk-ptarget', '1500');
  await waitTxt('#bk-k-total', 't.startsWith("1500")');
  const g4 = await page.$$eval('#bk-tbl tbody tr', (rs) => rs.map((r) => r.cells[1].textContent));
  g4.forEach((t, i) => closeV(t, O.s4.g[i], `百分比→克 第 ${i + 1} 行`));
  await closeS('#bk-k-hyd', O.s3.hydration, '换总重后含水率不变');
  await page.click('#bk-mode-g');
  await page.waitForFunction(() => document.getElementById('bk-pbox').hidden, null, { timeout: 10000 });
  const g4b = await page.$$eval('#bk-rows .bk-r-amt', (ns) => ns.map((n) => n.value));
  g4b.forEach((t, i) => closeV(t, O.s4.g[i], `切回按克第 ${i + 1} 行`));

  // ── 5. 载入布里欧修（奶/蛋/黄油含水） + 添加/删除行 ──
  await page.selectOption('#bk-lib', 'p:brioche');
  await page.click('#bk-load');
  await waitTxt('#bk-k-total', 't.startsWith("605")');
  await closeS('#bk-k-hyd', O.s5.hydration, '布里欧修总含水率（蛋 75% 奶 87% 黄油 16%）');
  await closeS('#bk-k-water', O.s5.waterTotal, '布里欧修总水量');
  await page.click('#bk-add');
  await page.waitForFunction(() => document.querySelectorAll('#bk-rows .bk-ing').length === 8, null, { timeout: 10000 });
  await page.selectOption(`${row(7)} .bk-r-type`, 'levain');
  assert(await page.$eval(`${row(7)} .bk-r-hyd`, (n) => getComputedStyle(n).display !== 'none'), '选酵种后出现含水率输入');
  assert(await page.$eval(`${row(6)} .bk-r-hyd`, (n) => getComputedStyle(n).display) === 'none', '非酵种行含水率输入被藏住（计算样式）');
  await page.click(`${row(7)} .bk-r-del`);
  await page.waitForFunction(() => document.querySelectorAll('#bk-rows .bk-ing').length === 7, null, { timeout: 10000 });
  await closeS('#bk-k-hyd', O.s5.hydration, '删行后恢复');

  // ── 6. 保存到本机 → 刷新仍在 → 删除 ──
  await page.fill('#bk-name', '周末布里欧修');
  await page.click('#bk-frap');
  await waitTxt('#bk-hs-lib', 't === "1"');
  await page.reload();
  await page.waitForFunction(() => document.getElementById('bk-hs-lib').textContent === '1', null, { timeout: 10000 });
  assert(await page.$eval('#bk-name', (n) => n.value) === '周末布里欧修', '刷新后配方名保留');
  await closeS('#bk-k-hyd', O.s5.hydration, '刷新后配方保留');
  const opts = await page.$$eval('#bk-lib option', (ns) => ns.map((n) => n.textContent));
  assert(opts.includes('周末布里欧修'), '配方库里有刚保存的配方');
  await page.selectOption('#bk-lib', 'u:0');
  assert(!(await page.$eval('#bk-del', (b) => b.disabled)), '选中自建配方时可删除');
  await page.click('#bk-del');
  await waitTxt('#bk-hs-lib', 't === "0"');
  await page.click('#bk-save');
  await waitTxt('#bk-hs-lib', 't === "1"');

  // ── 7. 模具换算：8 寸圆 → 20 cm 方 ──
  await onTab('pan');
  assert(await page.$eval('#bk-frap', (n) => getComputedStyle(n).display) === 'none', '非配方页隐藏保存浮钮');
  await page.click('.bk-size[data-k="B"][data-in="8"]');
  await page.click('.bk-size[data-k="A"][data-in="8"]');
  await page.selectOption('#bk-pan-B-shape', 'square');
  await page.fill('#bk-pan-B-a', '20');
  await page.fill('#bk-pan-B-h', '5');
  await closeS('#bk-pan-area-a', O.s6.areaA, 'A 面积');
  await closeS('#bk-pan-area-b', O.s6.areaB, 'B 面积');
  await closeS('#bk-pan-vol-a', O.s6.volA, 'A 容积');
  await closeS('#bk-pan-ratio-area', O.s6.ratio, '面积比');
  await closeS('#bk-pan-ratio-vol', O.s6.ratio, '容积比（同高）');
  const panTexts = await page.$$eval('#bk-pan-fig text', (ns) => ns.map((n) => n.textContent));
  assert(panTexts.some((t) => t.includes('20.3 cm 圆模')) && panTexts.some((t) => t.includes('20 cm 方模')), `俯视图标签：${panTexts.join('|')}`);
  // 同一比例尺：8 寸圆（20.32）比 20 cm 方略宽
  const shp = await page.$$eval('#bk-pan-fig circle, #bk-pan-fig rect', (ns) => ns.map((n) => n.getBoundingClientRect().width));
  assert(Math.abs(shp[0] / shp[1] - 20.32 / 20) < 0.01, `俯视图比例尺一致：${shp.join(',')}`);
  // 英寸单位
  await page.selectOption('#bk-pan-unit', 'in');
  await waitTxt('#bk-pan-area-a', 't.includes("in²")');
  await closeS('#bk-pan-area-a', O.s6.areaA / 2.54 / 2.54, 'A 面积（in²）');
  assert(await page.$eval('#bk-pan-A-d', (n) => n.value) === '8', '英寸下直径显示 8');
  await page.selectOption('#bk-pan-unit', 'cm');
  // 非法：中空模内径 ≥ 外径
  await page.selectOption('#bk-pan-A-shape', 'tube');
  await page.fill('#bk-pan-A-d', '10'); await page.fill('#bk-pan-A-di', '12');
  await page.waitForFunction(() => document.getElementById('bk-pan-err').textContent.includes('内径'), null, { timeout: 10000 });
  assert(await page.$eval('#bk-pan-apply-area', (b) => b.disabled), '模具非法时禁用缩放');
  await page.selectOption('#bk-pan-A-shape', 'round');
  await page.click('.bk-size[data-k="A"][data-in="8"]');
  // 吐司模装填量
  await page.selectOption('#bk-pan-B-shape', 'loaf');
  for (const [k, v] of [['a', 21], ['b', 10], ['c', 19.5], ['e', 9.5], ['h', 11]]) await page.fill(`#bk-pan-B-${k}`, String(v));
  await closeS('#bk-pan-vol-b', O.s6b.vol, '吐司模容积（拟柱体 vs quad 积分）');
  await closeS('#bk-fill-out', O.s6b.dough38, '比容 3.8 时面团重');
  await page.click('[data-fill="4.2"]');
  await closeS('#bk-fill-out', O.s6b.dough42, '比容 4.2 时面团重');
  await page.click('[data-fill="3.8"]');
  await page.click('#bk-fill-apply');
  await page.waitForFunction(() => !document.getElementById('bk-pane-recipe').hidden, null, { timeout: 10000 });
  await closeS('#bk-sc-kout', O.s6b.k_brioche, '装填量带回配方页的缩放倍数');

  // ── 8. 酵母与酵种 ──
  await onTab('leaven');
  await closeS('#bk-y-active', O.s7.active, '7 g 即发 → 干酵母');
  await closeS('#bk-y-fresh', O.s7.fresh, '7 g 即发 → 鲜酵母');
  await page.fill('#bk-y-g', '12'); await page.selectOption('#bk-y-from', 'fresh');
  await closeS('#bk-y-instant', O.s7.from_fresh_12_instant, '12 g 鲜 → 即发');
  await page.click('#bk-sd-pull');
  await page.waitForFunction((f) => Math.abs(+document.getElementById('bk-sd-flour').value - f) < 0.06, O.s8.flour, { timeout: 10000 });
  closeV(await page.$eval('#bk-sd-water', (n) => n.value), O.s8.water, '带入的总水（含蛋奶黄油）');
  await closeS('#bk-sd-lev', O.s8.levain, '需要酵种');
  await closeS('#bk-sd-f', O.s8.mainF, '主面团面粉');
  await closeS('#bk-sd-w', O.s8.mainW, '主面团水');
  await page.fill('#bk-sd-water', '10');
  await page.waitForFunction(() => document.getElementById('bk-sd-err').textContent.includes('超过'), null, { timeout: 10000 });
  await page.fill('#bk-lv-L', '150'); await page.click('[data-ratio="1,5,5"]');
  await closeS('#bk-lv-seed', O.s9.seed, '扩培老种');
  await closeS('#bk-lv-f', O.s9.flour, '扩培面粉');
  await closeS('#bk-lv-hyd', O.s9.hyd, '扩培后含水率');

  // ── 9. 面温 ──
  await onTab('temp');
  await closeS('#bk-t-water', O.s10.w1, '无酵种水温');
  await closeS('#bk-t-ice', O.s10.ice1, '冰量');
  await closeS('#bk-t-icew', 650 - O.s10.ice1, '自来水量');
  await closeS('#bk-t-cal', O.s10.cal, '反推摩擦升温');
  await page.check('#bk-t-uselev');
  await waitTxt('#bk-t-n', 't === "4"');
  await closeS('#bk-t-water', O.s10.w2, '有酵种水温（n=4）');
  await page.uncheck('#bk-t-uselev');
  for (const [k, v] of [['target', 24], ['room', 28], ['flour', 27], ['fric', 14], ['W', 700], ['tap', 26]]) await page.fill(`#bk-t-${k}`, String(v));
  await closeS('#bk-t-water', O.s10.w3, '夏天水温');
  await closeS('#bk-t-ice', O.s10.ice3, '夏天冰量');
  await page.selectOption('#bk-t-unit', 'F');
  await waitTxt('#bk-t-water', 't.includes("°F")');
  await closeS('#bk-t-water', O.s10.w3F, '华氏下的水温（摩擦按温差换算）');
  await page.selectOption('#bk-t-unit', 'C');
  await waitTxt('#bk-t-water', 't.includes("°C")');
  await closeS('#bk-t-water', O.s10.w3, '换回摄氏一致');

  // ── 10. 量杯与烤温 ──
  await onTab('convert');
  await closeS('#bk-c-g', O.s11.ap_1half_cup, '1 1/2 杯中筋粉');
  await closeS('#bk-c-rev-cup', O.s11.ap100_cup, '100 g 中筋粉 → 杯');
  await closeS('#bk-c-rev-tbsp', O.s11.ap100_tbsp, '100 g 中筋粉 → 汤匙');
  await page.selectOption('#bk-c-ing', 'honey'); await page.selectOption('#bk-c-unit', 'tbsp'); await page.fill('#bk-c-q', '3');
  await closeS('#bk-c-g', O.s11.honey_3tbsp, '3 汤匙蜂蜜');
  await page.selectOption('#bk-c-ing', 'butter'); await page.selectOption('#bk-c-unit', 'cup'); await page.fill('#bk-c-q', '⅓');
  await closeS('#bk-c-g', O.s11.butter_1_3_cup, '⅓ 杯黄油');
  await page.fill('#bk-c-q', '1 /');
  await page.waitForFunction(() => !document.getElementById('bk-c-err').hidden, null, { timeout: 10000 });
  assert(await txt('#bk-c-g') === '—', '数量写错时不出结果');
  // 能力清单：重量表里的每一种原料都能在下拉里选到并换算出非零结果
  const ref = await page.$$eval('#bk-c-ref tbody tr', (rs) => rs.map((r) => r.dataset.key));
  assert(ref.length === 18, `重量表 18 种原料，实得 ${ref.length}`);
  await page.fill('#bk-c-q', '1');
  const dead = [];
  for (const k of ref) {
    await page.selectOption('#bk-c-ing', k);
    const v = await txt('#bk-c-g');
    if (!/^\d/.test(v) || parseFloat(v) <= 0) dead.push(k);
  }
  assert(dead.length === 0, `重量表列出却换算不出：${dead.join(',')}`);
  closeV(await page.$eval('#bk-o-f', (n) => n.value), O.s12.f180, '180°C → °F');
  assert(await page.$eval('#bk-o-f', (n) => n.value) === '356', '180°C 输入框联动');
  assert((await txt('#bk-o-gas')).startsWith(O.s12.gas180), '180°C 燃气档');
  await page.fill('#bk-o-c', '220');
  await waitTxt('#bk-o-gas', `t.startsWith("${O.s12.gas220}")`);
  closeV(await page.$eval('#bk-o-f', (n) => n.value), O.s12.f220, '220°C → °F');
  await page.fill('#bk-o-f', '450');
  await waitTxt('#bk-o-gas', `t.startsWith("${O.s12.gas450f}")`);
  closeV(await page.$eval('#bk-o-c', (n) => n.value), O.s12.c450f, '450°F → °C');

  // ── 11. 键盘：方向键切页签 ──
  await page.focus('#bk-tab-convert');
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => !document.getElementById('bk-pane-about').hidden, null, { timeout: 10000 });
  assert(await page.evaluate(() => document.activeElement.id === 'bk-tab-about'), '方向键移动焦点');

  // ── 12. 渲染守卫（逐页签 × 逐视口） ──
  await onTab('recipe');
  const n = await renderGuards(page, {
    assert, tabs: T, onTab,
    paneSel: (t) => `#bk-pane-${t}`, panesRoot: '#bk-panes',
    figSel: (t) => `#bk-pane-${t} svg.bk-fig`, cardSel: '.bk-card', childSel: 'svg,dl,h2,h3,table,.bk-row-btns',
    minControls: 60, minTextsInFig: 0,
  });
  assert(n >= 60, `应扫到 ≥60 个可见控件，实得 ${n}`);
  // 图里真的有文字：条形图 = 每行 名称+数值 + 底部 2 段；俯视图 = 5 段
  await onTab('recipe');
  const figN = await page.$$eval('#bk-fig text', (ns) => ns.length);
  const rowsN = await page.$$eval('#bk-rows .bk-ing', (ns) => ns.length);
  assert(figN === rowsN * 2 + 2, `条形图文字段数 ${figN}，应为 ${rowsN * 2 + 2}`);
  await onTab('pan');
  assert(await page.$$eval('#bk-pan-fig text', (ns) => ns.length) === 5, '俯视图 5 段文字');
  // 表格不在卡片里横向溢出
  for (const t of ['recipe', 'convert']) {
    await onTab(t);
    const over = await page.$$eval(`#bk-pane-${t} .bk-tblw`, (ns) => ns.map((n) => n.scrollWidth - n.clientWidth).filter((d) => d > 2));
    assert(over.length === 0, `页签 ${t} 表格横向溢出 ${over.join(',')}px`);
  }
  assert(errs.length === 0, `页面脚本错误：${errs.join(' | ')}`);

  // ── 缩略图：配方页（乡村面包） ──
  await onTab('recipe');
  await page.selectOption('#bk-lib', 'p:country');
  await page.click('#bk-load');
  await waitTxt('#bk-k-total', 't.startsWith("960")');
  await page.waitForFunction(() => document.getElementById('bk-toast').hidden, null, { timeout: 10000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await screenshot('thumb.png');
};
