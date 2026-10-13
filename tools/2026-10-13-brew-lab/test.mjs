/* 咖啡冲煮工作台 · 集成测试
 *
 * 数值真值全部来自 run 目录 oracle/ui_truth.py（独立 Python 实现；摩尔质量取自第三方库 periodictable），
 * 由 inject-oracle.mjs 机械注入 ORACLE 块，本文件不手写任何真值。
 * 跨源核对：Barista Hustle 公布的浓缩液约 1000 ppm（2.45 g/L 泻盐、1.68 g/L 小苏打）、
 * 粕谷哲 4:6 原始示例 20 g / 300 g 五段各 60 g —— 这两条与任何实现无关。
 * 页面读数按显示精度比较（display-tolerance.mjs）；渲染守卫 import（render-guards.mjs）。
 */
import { renderGuards } from '/Users/lon/.agents/cron/daily-website/tools/render-guards.mjs';
import { makeDisplayCompare } from '/Users/lon/.agents/cron/daily-website/tools/display-tolerance.mjs';

const ORACLE = {
 "k46": {
  "cum": [
   60,
   120,
   180,
   240,
   300
  ],
  "t": [
   0,
   45,
   90,
   135,
   180
  ],
  "end": 210
 },
 "k46b": {
  "cum": [
   45,
   108,
   148.5,
   189,
   229.5,
   270
  ],
  "pour": [
   45,
   62.99999999999999,
   40.5,
   40.5,
   40.5,
   40.5
  ],
  "end": 255
 },
 "pulse": {
  "cum": [
   30,
   100,
   170,
   240
  ],
  "t": [
   0,
   45,
   75,
   105
  ],
  "end": 180
 },
 "ratioFromWater": 13.88888888888889,
 "perc": {
  "ey": 20.24,
  "bev": 220,
  "sol": 3.036,
  "R": 18.192,
  "newWater": 272.88,
  "newDose": 13.74230430958663
 },
 "perc_bev": {
  "ey": 19.5408
 },
 "imm": {
  "ey": 21.238220691052796,
  "sol": 6.371466207315838
 },
 "esp": {
  "ey": 19.2
 },
 "w_rao": {
  "epsom": 0.16745287053134306,
  "nahco3": 0.06714686911655976,
  "tds": 148.92202248466322,
  "na": 18.37601205363388
 },
 "w_heavy": {
  "cacl2": 0.12117738744679576,
  "mgcl2": 0.39100660931598835,
  "khco3": 0.27507775812800994
 },
 "conc": {
  "ppm1": 994.9068025610025,
  "ppm2": 1000.7912637497367,
  "ml1": 68.34811042095635,
  "ml2": 39.96837447414271,
  "dw": 891.683515104901
 },
 "salts": {
  "gh": 118.91062888634144,
  "kh": 39.71393903768796,
  "tds": 213.46448341056856,
  "Ca": 25.934630126810646,
  "Mg": 13.148534348213007,
  "Cl": 32.152445218400814,
  "SO4": 70.56220705047744
 },
 "gypsumWarn": true,
 "log": {
  "eys": [
   15.86,
   16.900000000000002,
   19.88,
   18.773333333333337,
   21.238220691052796,
   19.2
  ],
  "avg": 18.641925670731023,
  "avgR": 3.8333333333333335,
  "nPts": 5,
  "guji": 17.546666666666667
 },
 "meta": {
  "tabs": [
   "recipe",
   "extract",
   "water",
   "log",
   "about"
  ]
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const { closeS, closeV, txt } = makeDisplayCompare(page, assert);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(toolURL);
  await page.evaluate(() => localStorage.clear());
  await page.goto(toolURL + '#recipe');
  await page.waitForSelector('#bl-r-steps tbody tr');

  const onTab = async (t) => {
    await page.click('#tab-' + t);
    await page.waitForFunction((t) => !document.getElementById('pane-' + t).hidden, t);
  };
  const cums = () => page.$$eval('#bl-r-steps tbody tr', (rs) => rs.slice(0, -1).map((r) => parseFloat(r.cells[3].textContent)));
  const fill = async (sel, v) => { await page.fill(sel, String(v)); };

  // ── 1. 配方：默认 4:6，20 g / 300 g ──
  assert(await page.$eval('a[href="../../"]', (a) => a.textContent.includes('返回工具集')), '顶部有返回链接');
  assert(JSON.stringify(await cums()) === JSON.stringify(ORACLE.k46.cum), '4:6 累计 ' + (await cums()));
  // 跨源：粕谷哲原始示例五段各 60 g、3:30 结束
  assert(JSON.stringify(await cums()) === '[60,120,180,240,300]', '4:6 公布示例');
  assert((await page.$eval('#bl-r-steps tbody tr:last-child td', (n) => n.textContent)) === '3:30', '4:6 3:30 结束');
  // 改粉量 ⇒ 水量跟着粉水比走
  await fill('#bl-r-dose', 18);
  await page.waitForFunction(() => document.getElementById('bl-r-water').value === '270');
  await page.selectOption('#bl-r-taste', 'sweet');
  await page.selectOption('#bl-r-pours', '4');
  await page.waitForFunction(() => document.querySelectorAll('#bl-r-steps tbody tr').length === 7);
  const c2 = await cums();
  c2.forEach((v, i) => closeV(String(v), ORACLE.k46b.cum[i], `4:6 偏甜 4 段 累计[${i}]`));
  const firstPour = await page.$eval('#bl-r-steps tbody tr:first-child td:nth-child(3)', (n) => n.textContent);
  closeV(firstPour, ORACLE.k46b.pour[0], '偏甜：第一段较少');
  // 改水量 ⇒ 反推粉水比
  await fill('#bl-r-water', 250);
  await page.waitForFunction(() => document.getElementById('bl-r-ratio').value !== '15');
  closeV(await page.inputValue('#bl-r-ratio'), ORACLE.ratioFromWater, '水 250 / 粉 18 的粉水比');
  // 非法输入
  await fill('#bl-r-dose', '0');
  await page.waitForFunction(() => !document.getElementById('bl-r-err').hidden);
  assert((await page.$eval('#bl-r-err', (n) => getComputedStyle(n).display)) !== 'none', '粉量 0 报错可见');
  assert((await page.getAttribute('#bl-r-dose', 'aria-invalid')) === 'true', '粉量 0 标红');

  // 换成「闷蒸 + 分段注水」：方法默认 15 g · 1:16
  await page.selectOption('#bl-r-method', 'pulse');
  await page.waitForFunction(() => document.getElementById('bl-r-water').value === '240');
  assert((await page.$eval('#bl-r-err', (n) => getComputedStyle(n).display)) === 'none', '换方法后错误清掉');
  assert(JSON.stringify(await cums()) === JSON.stringify(ORACLE.pulse.cum), '分段注水累计 ' + (await cums()));
  assert((await page.$eval('#bl-r-opt-k46', (n) => getComputedStyle(n).display)) === 'none', '4:6 选项已隐藏（计算样式）');
  assert((await page.$eval('#bl-r-opt-pulse', (n) => getComputedStyle(n).display)) !== 'none', '分段选项可见');

  // ── 2. 计时器：键盘 N 跳步、空格开始/暂停 ──
  await page.click('#bl-t-reset');
  await page.click('h2.bl-h2');            // 把焦点放到非输入元素上，快捷键才生效
  await page.keyboard.press('n');
  await page.keyboard.press('n');
  await page.waitForFunction(() => document.getElementById('bl-t-clock').textContent === '1:15');
  assert((await txt('#bl-t-target')) === ORACLE.pulse.cum[2] + ' g', '跳到第 3 步时秤上读数 ' + (await txt('#bl-t-target')));
  const curIdx = await page.$$eval('#bl-r-steps tbody tr', (rs) => rs.findIndex((r) => r.classList.contains('bl-cur')));
  assert(curIdx === 2, '当前步高亮在第 3 行，实得 ' + curIdx);
  // 几何：进度条宽度比例 = 75 / 180
  const ratioBar = await page.evaluate(() => document.getElementById('bl-t-bar').getBoundingClientRect().width / document.getElementById('bl-t-prog').getBoundingClientRect().width);
  assert(Math.abs(ratioBar - ORACLE.pulse.t[2] / ORACLE.pulse.end) < 0.01, '进度条比例 ' + ratioBar.toFixed(3));
  await page.keyboard.press(' ');
  await page.waitForFunction(() => document.getElementById('bl-t-clock').textContent === '1:16', null, { timeout: 5000 });
  await page.keyboard.press(' ');
  assert((await txt('#bl-t-start')) === '继续', '暂停后按钮显示「继续」');
  const frozen = await txt('#bl-t-clock');
  await page.waitForTimeout(1200);
  const stillFrozen = await txt('#bl-t-clock');
  assert(stillFrozen === frozen, '暂停后时钟不再走');
  await page.click('#bl-t-skip'); await page.click('#bl-t-skip');
  await page.waitForFunction(() => /完成/.test(document.getElementById('bl-t-step').textContent));
  assert((await txt('#bl-t-target')) === '240 g', '结束时秤上 240 g');
  // 注水曲线：4 个注水标注都画出来
  const plusLabels = await page.$$eval('#bl-r-fig text', (ts) => ts.filter((t) => /^\+\d/.test(t.textContent)).length);
  assert(plusLabels === ORACLE.pulse.cum.length, '注水曲线标注个数 ' + plusLabels);

  // 收藏配方并重新载入
  await fill('#bl-r-favname', '早晨 V60');
  await page.click('#bl-r-save');
  await page.waitForSelector('#bl-r-favs [data-load]');
  await page.selectOption('#bl-r-method', 'k46');
  await page.waitForFunction(() => document.getElementById('bl-r-water').value === '300');
  await page.click('#bl-r-favs [data-load="0"]');
  await page.waitForFunction(() => document.getElementById('bl-r-method').value === 'pulse' && document.getElementById('bl-r-water').value === '240');

  // ── 3. 萃取率 ──
  await onTab('extract');
  await page.waitForFunction(() => document.getElementById('bl-x-ey').textContent !== '—');
  await closeS('#bl-x-ey', ORACLE.perc.ey, 'EY 滴滤估算');
  await closeS('#bl-x-bevv', ORACLE.perc.bev, '咖啡液估算');
  await closeS('#bl-x-sol', ORACLE.perc.sol, '已溶解');
  assert((await txt('#bl-x-zone')) === '偏浓 · 萃取理想', '判读 ' + (await txt('#bl-x-zone')));
  const tips = await txt('#bl-x-tips');
  const mR = /1:([\d.]+)/.exec(tips), mW = /水量改成约 ([\d.]+) g/.exec(tips), mD = /粉量改成约 ([\d.]+) g/.exec(tips);
  assert(mR && mW && mD, '建议里有粉水比 / 水量 / 粉量：' + tips);
  closeV(mR[1], ORACLE.perc.R, '建议粉水比'); closeV(mW[1], ORACLE.perc.newWater, '建议水量'); closeV(mD[1], ORACLE.perc.newDose, '建议粉量');
  // 控制图：当前点落在目标区上方（几何断言）
  const geo = await page.evaluate(() => {
    const svg = document.getElementById('bl-x-fig');
    const pt = svg.querySelector('circle.bl-pt').getBoundingClientRect();
    const box = Array.from(svg.querySelectorAll('rect')).find((r) => (r.getAttribute('fill') || '').includes('204,120,92')).getBoundingClientRect();
    return { cy: pt.top + pt.height / 2, cx: pt.left + pt.width / 2, top: box.top, l: box.left, r: box.right };
  });
  assert(geo.cy < geo.top && geo.cx > geo.l && geo.cx < geo.r, '当前点应在理想区正上方 ' + JSON.stringify(geo));
  const ratioLabs = await page.$$eval('#bl-x-fig text', (ts) => ts.filter((t) => /^1:\d/.test(t.textContent)).map((t) => t.textContent));
  assert(ratioLabs.length >= 5, '粉水比斜线标注至少 5 条：' + ratioLabs.join(','));
  // 实称咖啡液
  await fill('#bl-x-bev', 212.4);
  await page.waitForFunction(() => document.getElementById('bl-x-bevlab').textContent === '咖啡液');
  await closeS('#bl-x-ey', ORACLE.perc_bev.ey, 'EY 实称咖啡液');
  // 浸泡式
  await page.click('#bl-x-mode [data-v="imm"]');
  await fill('#bl-x-dose', 30); await fill('#bl-x-water', 480); await fill('#bl-x-tds', 1.31); await fill('#bl-x-bev', '');
  await page.waitForFunction(() => document.getElementById('bl-x-sol').textContent.startsWith('6.3'));
  await closeS('#bl-x-ey', ORACLE.imm.ey, 'EY 浸泡式');
  await closeS('#bl-x-sol', ORACLE.imm.sol, '浸泡式已溶解');
  assert((await page.$eval('#bl-x-lrr-f', (n) => getComputedStyle(n).display)) === 'none', '浸泡式不用吸水比（计算样式）');
  // 意式
  await page.click('#bl-x-mode [data-v="esp"]');
  await fill('#bl-x-dose', 18); await fill('#bl-x-bev', 36); await fill('#bl-x-tds', 9.6);
  await page.waitForFunction(() => document.getElementById('bl-x-ey').textContent === '19.20');
  closeV(await txt('#bl-x-ey'), ORACLE.esp.ey, 'EY 意式');
  assert((await txt('#bl-x-zone')) === '理想区', '意式 9.6% / 19.2% 在意式区间内');
  assert((await page.$eval('#bl-x-water-f', (n) => getComputedStyle(n).display)) === 'none', '意式隐藏注水量');
  // 非法：TDS 40
  await fill('#bl-x-tds', 40);
  await page.waitForFunction(() => !document.getElementById('bl-x-err').hidden);
  assert((await txt('#bl-x-ey')) === '—', 'TDS 非法时不出结果');
  await fill('#bl-x-tds', 9.6);
  await page.waitForFunction(() => document.getElementById('bl-x-err').hidden);
  // 从配方带入：当前配方是分段注水 15 / 240
  await page.click('#bl-x-from');
  await page.waitForFunction(() => document.getElementById('bl-x-water').value === '240' && document.querySelector('#bl-x-mode [aria-pressed="true"]').dataset.v === 'perc');

  // ── 4. 冲煮用水 ──
  await onTab('water');
  await page.waitForFunction(() => document.getElementById('bl-w-ghv').textContent !== '—');
  await closeS('#bl-w-ghv', 68, 'Rao/Perger GH');
  await closeS('#bl-w-khv', 40, 'Rao/Perger KH');
  const recipeG = async (k) => page.$eval(`#bl-w-recipe tr[data-k="${k}"] td:nth-child(2)`, (n) => n.textContent);
  closeV(await recipeG('epsom'), ORACLE.w_rao.epsom, '泻盐克数');
  closeV(await recipeG('nahco3'), ORACLE.w_rao.nahco3, '小苏打克数');
  await closeS('#bl-w-tds', ORACLE.w_rao.tds, '离子总量');
  assert((await txt('#bl-w-camg')) === '全是镁', '钙占比 0 ⇒ 全是镁');
  // 厚重：2.5 L、钙 30%、换氯化镁与碳酸氢钾
  await fill('#bl-w-vol', 2.5); await fill('#bl-w-gh', 110); await fill('#bl-w-kh', 55); await fill('#bl-w-ca', 30);
  await page.selectOption('#bl-w-mgsalt', 'mgcl2'); await page.selectOption('#bl-w-khsalt', 'khco3');
  await page.waitForSelector('#bl-w-recipe tr[data-k="khco3"]');
  for (const k of ['cacl2', 'mgcl2', 'khco3']) closeV(await recipeG(k), ORACLE.w_heavy[k], '厚重 ' + k);
  await closeS('#bl-w-ghv', 110, '厚重 GH 回代');
  // 浓缩液（跨源：BH 浓缩液 ≈ 1000 ppm）
  await page.click('#bl-w-mode [data-v="conc"]');
  await fill('#bl-w-vol', 1);
  await page.waitForSelector('#bl-w-recipe tr[data-k="c1"]');
  const c1 = await page.$eval('#bl-w-recipe tr[data-k="c1"]', (n) => n.textContent);
  const ppm1 = +/自身 GH (\d+)/.exec(c1)[1];
  assert(Math.abs(ppm1 - 1000) <= 10 && Math.abs(ppm1 - ORACLE.conc.ppm1) <= 0.5, 'BH 泻盐浓缩液 ≈1000：' + ppm1);
  closeV(await recipeG('c1'), ORACLE.conc.ml1, '硬度瓶 mL');
  closeV(await recipeG('c2'), ORACLE.conc.ml2, '碱度瓶 mL');
  closeV(await recipeG('dw'), ORACLE.conc.dw, '纯水 mL');
  await closeS('#bl-w-ghv', 68, '浓缩液 GH 回代');
  // 直接称盐（含底水 Na 5 mg/L）
  await page.click('#bl-w-mode [data-v="salts"]');
  await fill('#bl-w-vol', 1.5);
  for (const [k, v] of [['epsom', 0.2], ['mgcl2', 0], ['cacl2', 0.1], ['gypsum', 0.05], ['nahco3', 0.1], ['khco3', 0]]) await fill('#bl-w-s-' + k, v);
  await page.click('#bl-w-basedet summary');
  await fill('#bl-w-b-Na', 5);
  await page.waitForFunction(() => document.querySelector('#bl-w-ions tr[data-ion="Cl"]'));
  await closeS('#bl-w-ghv', ORACLE.salts.gh, '称盐 GH');
  await closeS('#bl-w-khv', ORACLE.salts.kh, '称盐 KH');
  await closeS('#bl-w-tds', ORACLE.salts.tds, '称盐 离子总量');
  for (const k of ['Ca', 'Mg', 'Cl', 'SO4']) await closeS(`#bl-w-ions tr[data-ion="${k}"] td:nth-child(2)`, ORACLE.salts[k], '离子 ' + k);
  // 石膏超溶解度警告
  await fill('#bl-w-s-gypsum', 7.5);
  await page.waitForFunction(() => /溶不完/.test(document.getElementById('bl-w-notes').textContent));
  await fill('#bl-w-s-gypsum', 0.05);
  await fill('#bl-w-s-epsom', -1);
  await page.waitForFunction(() => !document.getElementById('bl-w-err').hidden);
  assert((await txt('#bl-w-ghv')) === '—', '负克数时不出结果');
  await fill('#bl-w-s-epsom', 0.2);
  await page.waitForFunction(() => document.getElementById('bl-w-err').hidden);
  assert((await page.$$('#bl-w-fig circle.bl-wcur')).length === 1, '硬度—碱度图上有当前点');

  // ── 5. 日志 ──
  await onTab('log');
  assert((await page.$eval('#bl-l-empty', (n) => getComputedStyle(n).display)) !== 'none', '空日志提示');
  await page.click('#bl-l-sample');
  await page.waitForFunction(() => document.querySelectorAll('#bl-l-table tbody tr').length === 6);
  assert((await page.$eval('#bl-l-empty', (n) => getComputedStyle(n).display)) === 'none', '有数据后空提示藏掉');
  const eyCells = await page.$$eval('#bl-l-table tbody td.bl-ey', (ns) => ns.map((n) => n.textContent));
  eyCells.forEach((t, i) => closeV(t, ORACLE.log.eys[i], `日志 EY[${i}]`));
  await closeS('#bl-l-avgey', ORACLE.log.avg, '平均萃取率');
  await closeS('#bl-l-avgr', ORACLE.log.avgR, '平均评分');
  const pts = await page.$eval('#bl-l-fig', (s) => +s.getAttribute('data-points'));
  assert(pts === ORACLE.log.nPts, '控制图上画了 ' + pts + ' 个点（意式不画）');
  const numLabs = await page.$$eval('#bl-l-fig text', (ts) => ts.filter((t) => /^\d$/.test(t.textContent)).length);
  assert(numLabs === ORACLE.log.nPts, '每个点的序号都画出来了：' + numLabs);
  await page.selectOption('#bl-l-filter', '埃塞 古吉 水洗');
  await page.waitForFunction(() => document.querySelectorAll('#bl-l-table tbody tr').length === 3);
  await closeS('#bl-l-avgey', ORACLE.log.guji, '筛选后的平均萃取率');
  await page.selectOption('#bl-l-filter', '');
  // 新增一条：从萃取页带过来（意式 18 / 36 / 9.6 ⇒ 当前萃取页已被「从配方带入」改成分段注水 15/240、TDS 9.6 → 非法，先改 TDS）
  await onTab('extract');
  await fill('#bl-x-tds', 1.38); await fill('#bl-x-dose', 15); await fill('#bl-x-water', 250);
  await page.waitForFunction(() => document.getElementById('bl-x-ey').textContent === '20.24');
  await page.click('#bl-x-log');
  await page.waitForFunction(() => !document.getElementById('pane-log').hidden);
  assert((await page.inputValue('#bl-l-tds')) === '1.38', '记入日志带过来 TDS');
  await fill('#bl-l-bean', '肯尼亚 AA');
  await page.selectOption('#bl-l-rating', '5');
  await page.click('#bl-l-add');
  await page.waitForFunction(() => document.querySelectorAll('#bl-l-table tbody tr').length === 7);
  const last = await page.$eval('#bl-l-table tbody tr:last-child', (r) => Array.from(r.cells).map((c) => c.textContent));
  assert(last[1] === '肯尼亚 AA', '新记录豆名 ' + last[1]);
  closeV(last[5], ORACLE.perc.ey, '新记录 EY');
  // 非法记录
  await fill('#bl-l-dose', ''); await page.click('#bl-l-add');
  await page.waitForFunction(() => !document.getElementById('bl-l-err').hidden);
  // CSV / 导入
  const csv = await page.evaluate(() => window.BLAPP.toCSV());
  assert(csv.split('\n').length === 8 && /肯尼亚 AA/.test(csv), 'CSV 7 行数据 + 表头');
  const imp = await page.evaluate(() => window.BLAPP.importLog(JSON.stringify({ log: [
    { id: 'x1', date: '2026-10-12', method: 'aero', bean: '测试', dose: 15, water: 210, tds: 1.4 },
    { id: 'sample-0', date: '2026-10-01', method: 'k46', bean: 'dup', dose: 20, water: 300 },
    { id: 'x2', date: 'bad', method: 'k46', dose: 20, water: 300 }] })));
  assert(imp === '导入 1 条，跳过重复 1 条，忽略无效 1 条', '导入合并结果：' + imp);
  // 删除
  await page.click('#bl-l-table tr[data-id="x1"] [data-del]');
  await page.waitForFunction(() => document.querySelectorAll('#bl-l-table tbody tr').length === 7);
  // 持久化：刷新后日志还在
  await page.reload();
  await onTab('log');
  await page.waitForFunction(() => document.querySelectorAll('#bl-l-table tbody tr').length === 7);

  // ── 6. 渲染守卫（逐页签 × 逐视口）──
  const n = await renderGuards(page, {
    assert, tabs: ORACLE.meta.tabs, onTab,
    paneSel: (t) => `#pane-${t}`, panesRoot: '#bl-panes',
    figSel: (t) => `#pane-${t} svg.bl-fig`, cardSel: '.bl-card, .bl-dark',
    minControls: 60, minTextsInFig: 12,
  });
  assert(n >= 60, '累计控件数 ' + n);
  // 窄格：日志表判读徽标不越出单元格
  await onTab('log');
  const esc = await page.$$eval('#bl-l-table td .bl-zone', (zs) => zs.filter((z) => { const a = z.getBoundingClientRect(), b = z.parentElement.getBoundingClientRect(); return a.right > b.right + 1 || a.left < b.left - 1; }).length);
  assert(esc === 0, '判读徽标越出单元格 ' + esc);
  // 1280 下日志表不需要横向滚动（7 列都看得见）
  const tw = await page.$eval('#bl-l-table', (t) => t.parentElement.scrollWidth - t.parentElement.clientWidth);
  assert(tw <= 2, '日志表在 1280 下横向溢出 ' + tw + 'px');

  assert(errors.length === 0, '页面错误：' + errors.join(' | '));
  await onTab('extract');
  await page.click('#bl-x-mode [data-v="perc"]');
  await fill('#bl-x-dose', 15); await fill('#bl-x-water', 250); await fill('#bl-x-bev', ''); await fill('#bl-x-tds', 1.38);
  await page.waitForFunction(() => document.getElementById('bl-x-ey').textContent === '20.24');
  await onTab('recipe');
  await page.selectOption('#bl-r-method', 'k46');
  await page.click('h2.bl-h2'); await page.keyboard.press('n'); await page.keyboard.press('n');
  await page.waitForFunction(() => document.getElementById('bl-t-clock').textContent === '1:30');
  await page.evaluate(() => window.scrollTo(0, 0));
  await screenshot('thumb.png');
};
