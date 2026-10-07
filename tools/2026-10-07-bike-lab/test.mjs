/* 骑行工作台 · 集成测试
 *
 * 数值真值全部来自 oracle/truth.json（run 目录 oracle/oracle.py：速度用 numpy 多项式求根 + brentq 精修、
 * 刹车皮用 fractions.Fraction、重复档/独立档/交叉链自写组合扫描），由 inject-oracle.mjs 机械注入 ORACLE 块 ——
 * 本文件不手打任何计算结果。页面读数按显示精度比较（display-tolerance.mjs）；渲染守卫 import（render-guards.mjs）。
 */
import { renderGuards } from '/Users/lon/.agents/cron/daily-website/tools/render-guards.mjs';
import { makeDisplayCompare } from '/Users/lon/.agents/cron/daily-website/tools/display-tolerance.mjs';

const ORACLE = {
 "meta": {
  "tabs": [
   "gear",
   "power",
   "climb",
   "fixed",
   "saved",
   "about"
  ]
 },
 "gear": {
  "range": 401.06951871657753,
  "minRatio": 1.1333333333333333,
  "maxRatio": 4.545454545454546,
  "distinct": 19,
  "dupPairs": 5,
  "maxStep": 14.28571428571428,
  "nCells": 24,
  "nCross": 4,
  "seq": [
   "34x30",
   "34x27",
   "34x24",
   "34x21",
   "34x19",
   "34x17",
   "50x24",
   "34x16",
   "34x15",
   "50x21",
   "34x14",
   "34x13",
   "50x19",
   "50x17",
   "50x16",
   "50x15",
   "50x14",
   "50x13",
   "50x12",
   "50x11"
  ],
  "kmhMin": 13.035598893099344,
  "kmhMax": 52.281813742377054,
  "circ": 2129.9998191338796,
  "cell50x11": {
   "kmh": 52.281813742377054,
   "inches": 121.3314244810308,
   "gain": 8.932806324110672
  },
  "crossCells": [
   "34x11",
   "34x12",
   "50x27",
   "50x30"
  ]
 },
 "gearMtb": {
  "range": 797.3333333333334,
  "distinct": 17,
  "dupPairs": 7,
  "maxStep": 23.809523809523814,
  "nCross": 4
 },
 "power0": {
  "kmh": 32.535559485193076,
  "rho": 1.2040847588826422,
  "wkg": 2.857142857142857,
  "mass": 79,
  "pa": 159.99149623665,
  "pr": 35.008503763350035
 },
 "power1": {
  "kmh": 13.988833968176127,
  "rho": 1.0330024482008222
 },
 "power2": {
  "kmh": 50.43160427010201
 },
 "powerSpeed": {
  "P": 349.07197534223286
 },
 "climb": {
  "t": 2242.46832975323,
  "vam": 963.2243057085648,
  "wkg": 3.5714285714285716,
  "kmh": 16.05373842847608,
  "grade": 6.010829247756458,
  "ladder": [
   2.6324853823498726,
   3.24207772382212,
   3.825528442855018,
   4.382061138403729,
   4.9119013829275096,
   5.415945620878016,
   5.895492907352901,
   6.35204795562496,
   6.7871868975709395
  ]
 },
 "climbT": {
  "P": 202.5573322796514,
  "wkg": 2.8936761754235913
 },
 "fixed": {
  "s4817": {
   "single": 17,
   "ambi": 17,
   "r": 48,
   "c": 17
  },
  "s4416": {
   "single": 4,
   "ambi": 8,
   "r": 11,
   "c": 4
  },
  "s4515": {
   "single": 1,
   "ambi": 2,
   "r": 3,
   "c": 1
  },
  "inches4817": 75.36822603056972,
  "chain": {
   "raw": 53.28346456692913,
   "inch": 54,
   "links": 108
  },
  "chainMtb": {
   "raw": 56.25196850393701,
   "inch": 57,
   "links": 114
  }
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const O = ORACLE;
  const T = O.meta.tabs;
  const { closeS, closeV, txt } = makeDisplayCompare(page, assert);
  const disp = (sel) => page.$eval(sel, (n) => getComputedStyle(n).display);
  const onTab = async (t) => {
    await page.click(`#bk-tab-${t}`);
    await page.waitForFunction((t) => !document.getElementById(`bk-pane-${t}`).hidden, t, { timeout: 10000 });
  };
  const setVal = async (sel, v) => { await page.fill(sel, String(v)); };

  await page.goto(toolURL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => window.__bk && window.__bk.ready, null, { timeout: 10000 });

  // ── 0. 结构：返回链接 + [hidden] 守卫 ──
  assert(await page.$eval('a.bk-back', (a) => a.getAttribute('href')) === '../../', '顶部返回链接');
  assert(await page.$$eval('style', (ss) => ss.some((s) => s.textContent.includes('[hidden]{display:none!important}'))), '[hidden] 守卫');

  // ── 1. 齿比：默认 50/34 × 12 速 11-30，700×28C，172.5 mm，90 rpm ──
  const G = O.gear;
  await closeS('#bk-g-k-range', G.range, '齿比范围');
  const mm = (await txt('#bk-g-k-minmax')).split('/');
  closeV(mm[0], G.minRatio, '最轻齿比'); closeV(mm[1], G.maxRatio, '最重齿比');
  await closeS('#bk-g-k-distinct', G.distinct, '独立档数');
  await closeS('#bk-g-k-dup', G.dupPairs, '重复档对数');
  await closeS('#bk-g-k-maxstep', G.maxStep, '最大跳档');
  const sp = (await txt('#bk-g-k-speeds')).split('–');
  closeV(sp[0], G.kmhMin, '最低速度'); closeV(sp[1], G.kmhMax, '最高速度');
  await closeS('#bk-g-circ', G.circ, '轮周长');
  await closeS('#bk-g-table td[data-ring="50"][data-cog="11"]', G.cell50x11.kmh, '50×11 速度');
  const cx = await page.$$eval('#bk-g-table td.bk-cx', (ns) => ns.map((n) => n.dataset.ring + 'x' + n.dataset.cog).sort());
  assert(JSON.stringify(cx) === JSON.stringify([...G.crossCells].sort()), `交叉链格子 ${cx} vs ${G.crossCells}`);
  assert(await page.$$eval('#bk-g-table td.bk-gc', (ns) => ns.length) === G.nCells, '齿比表格子数');
  const seq = await page.$$eval('#bk-g-seq li', (ns) => ns.map((n) => n.textContent.split(' ')[0].replace('×', 'x')));
  assert(JSON.stringify(seq) === JSON.stringify(G.seq), `换挡序列 ${seq.join(',')} vs ${G.seq.join(',')}`);
  // 表格显示切换：齿英寸 / 增益比
  await page.selectOption('#bk-g-metric', 'inches');
  await page.waitForFunction(() => document.getElementById('bk-g-metric').value === 'inches', null, { timeout: 10000 });
  await closeS('#bk-g-table td[data-ring="50"][data-cog="11"]', G.cell50x11.inches, '50×11 齿英寸');
  await page.selectOption('#bk-g-metric', 'gain');
  await closeS('#bk-g-table td[data-ring="50"][data-cog="11"]', G.cell50x11.gain, '50×11 增益比');
  await page.selectOption('#bk-g-metric', 'kmh');
  // 齿比图：每个档一个点、交叉链是空心、标签一个都没丢、每个点都有它的齿数标签
  const fig = await page.$eval('#bk-fig-gear', (s) => ({
    dots: s.querySelectorAll('circle.bk-gdot').length, hollow: [...s.querySelectorAll('circle.bk-gdot')].filter((c) => c.getAttribute('fill') === '#fff').length,
    dropped: +s.dataset.dropped, texts: [...s.querySelectorAll('text')].map((t) => t.textContent) }));
  assert(fig.dots === G.nCells, `齿比图点数 ${fig.dots}`);
  assert(fig.hollow === G.nCross, `空心点 ${fig.hollow} vs ${G.nCross}`);
  assert(fig.dropped === 0, `齿比图丢了 ${fig.dropped} 个标签`);
  assert(fig.texts.includes('50T') && fig.texts.includes('34T'), '牙盘行标签');

  // ── 2. 预设：砾石 46/30 × 10-52、650B×47、170 mm、85 rpm ──
  await page.selectOption('#bk-g-crankset', { label: '砾石 · 46/30' });
  await page.selectOption('#bk-g-cassette', { label: '12 速山地 · 10-52' });
  await page.selectOption('#bk-g-wheel', { label: '650B×47 砾石' });
  await setVal('#bk-g-crank', 170); await setVal('#bk-g-rpm', 85);
  await page.waitForFunction(() => document.getElementById('bk-g-rings').value === '46,30' && document.getElementById('bk-g-tire').value === '47', null, { timeout: 10000 });
  const M = O.gearMtb;
  await closeS('#bk-g-k-range', M.range, 'MTB 齿比范围');
  await closeS('#bk-g-k-distinct', M.distinct, 'MTB 独立档数');
  await closeS('#bk-g-k-dup', M.dupPairs, 'MTB 重复档');
  await closeS('#bk-g-k-maxstep', M.maxStep, 'MTB 最大跳档');
  assert(await page.$$eval('#bk-g-table td.bk-cx', (ns) => ns.length) === M.nCross, 'MTB 交叉链数');
  assert(+(await page.$eval('#bk-fig-gear', (s) => s.dataset.dropped)) === 0, 'MTB 齿比图不丢标签');

  // ── 3. 非法输入 ──
  assert(await disp('#bk-g-err') === 'none', '合法时错误条隐藏');
  for (const [bad, frag] of [['50,50', '重复'], ['50,abc', '不是整数'], ['80', '超出'], ['', '请输入']]) {
    await setVal('#bk-g-rings', bad);
    await page.waitForFunction((f) => document.getElementById('bk-g-err').textContent.includes(f), frag, { timeout: 10000 });
    assert(await disp('#bk-g-err') !== 'none', `「${bad}」错误条应可见`);
    assert(await txt('#bk-g-k-range') === '—', `「${bad}」时 KPI 清空`);
    assert(await page.$eval('#bk-g-rings', (n) => n.classList.contains('bk-bad')), '输入框标红');
  }
  await setVal('#bk-g-rpm', 500);
  await setVal('#bk-g-rings', '46,30');
  await page.waitForFunction(() => document.getElementById('bk-g-err').textContent.includes('踏频'), null, { timeout: 10000 });
  await setVal('#bk-g-rpm', 85);
  await page.waitForFunction(() => document.getElementById('bk-g-err').hidden, null, { timeout: 10000 });
  // 回到默认
  await page.selectOption('#bk-g-crankset', { label: '公路 · 50/34 紧凑盘' });
  await page.selectOption('#bk-g-cassette', { label: '12 速 · 11-30' });
  await page.selectOption('#bk-g-wheel', { label: '700×28C' });
  await setVal('#bk-g-crank', 172.5); await setVal('#bk-g-rpm', 90);
  await closeS('#bk-g-k-range', G.range, '恢复后齿比范围');

  // ── 4. 功率 ↔ 速度 ──
  await onTab('power');
  const P0 = O.power0;
  await closeS('#bk-p-k-speed', P0.kmh, '200 W 平路速度');
  await closeS('#bk-p-rho', P0.rho, '空气密度');
  await closeS('#bk-p-k-wkg', P0.wkg, '功体比');
  await closeS('#bk-p-k-mass', P0.mass, '总质量');
  await closeS('#bk-p-b-aero', P0.pa, '风阻功率');
  await closeS('#bk-p-b-roll', P0.pr, '滚阻功率');
  // 条形几何：宽度比 = 功率比（风阻最大 → 满格）
  const bars = await page.$$eval('#bk-p-bars .bk-bar', (bs) => Object.fromEntries(bs.map((b) => {
    const tr = b.querySelector('.bk-bar-track').getBoundingClientRect(), fi = b.querySelector('.bk-bar-fill').getBoundingClientRect();
    return [b.dataset.k, fi.width / tr.width];
  })));
  assert(Math.abs(bars.aero - 1) < 0.01, `风阻条应满格 ${bars.aero}`);
  assert(Math.abs(bars.roll - P0.pr / P0.pa) < 0.01, `滚阻条宽比 ${bars.roll} vs ${P0.pr / P0.pa}`);
  // 爬坡 + 顶风 + 高海拔
  await page.selectOption('#bk-p-pos', { label: '公路车 · 直立握横把' });
  await setVal('#bk-p-grade', 8); await setVal('#bk-p-wind', 10); await setVal('#bk-p-alt', 1500); await setVal('#bk-p-temp', 12);
  await setVal('#bk-p-watts', 300);
  await closeS('#bk-p-rho', O.power1.rho, '1500 m 空气密度');
  await closeS('#bk-p-k-speed', O.power1.kmh, '8% 顶风 300 W 速度');
  assert((await txt('#bk-p-bars-note')).includes('重力'), '爬坡时提示重力是大头');
  // 下坡滑行
  await page.selectOption('#bk-p-pos', { label: '公路车 · 握变速把' });
  await setVal('#bk-p-grade', -6); await setVal('#bk-p-wind', 0); await setVal('#bk-p-alt', 0); await setVal('#bk-p-temp', 20);
  await setVal('#bk-p-watts', 0);
  await closeS('#bk-p-k-speed', O.power2.kmh, '−6% 滑行终速');
  assert((await page.$eval('#bk-p-bars [data-k="grav"] .bk-bar-name', (n) => n.textContent)).includes('下坡'), '下坡时重力条改名');
  // 给速度算功率
  await setVal('#bk-p-grade', 0); await setVal('#bk-p-watts', 200);
  await page.check('#bk-p-mode-speed');
  assert(await disp('#bk-p-watts-fld') === 'none' && await disp('#bk-p-kmh-fld') !== 'none', '模式切换后输入框显隐');
  await setVal('#bk-p-kmh', 40);
  await closeS('#bk-p-k-power', O.powerSpeed.P, '40 km/h 所需功率');
  // 非法
  await setVal('#bk-p-cda', 5);
  await page.waitForFunction(() => document.getElementById('bk-p-err').textContent.includes('CdA'), null, { timeout: 10000 });
  assert(await disp('#bk-p-err') !== 'none', '功率页错误条可见');
  await page.selectOption('#bk-p-pos', { label: '公路车 · 握变速把' });
  await page.waitForFunction(() => document.getElementById('bk-p-err').hidden, null, { timeout: 10000 });
  await page.check('#bk-p-mode-power');
  await closeS('#bk-p-k-speed', P0.kmh, '恢复后速度');

  // ── 5. 爬坡 10 km / 600 m ──
  await onTab('climb');
  const CL = O.climb;
  await closeS('#bk-c-grade', CL.grade, '平均坡度');
  const tShow = await txt('#bk-c-k-time');
  const [mi, se] = tShow.split(':').map(Number);
  assert(Math.abs(mi * 60 + se - CL.t) <= 0.5 + 1e-9, `用时 ${tShow} vs ${CL.t}`);
  await closeS('#bk-c-k-vam', CL.vam, 'VAM');
  await closeS('#bk-c-k-wkg', CL.wkg, '功体比');
  await closeS('#bk-c-k-speed', CL.kmh, '平均速度');
  const lad = await page.$$eval('#bk-c-ladder tbody tr', (rs) => rs.map((r) => r.children[3].textContent));
  assert(lad.length === CL.ladder.length, '阶梯表行数');
  lad.forEach((s, i) => closeV(s, CL.ladder[i] * 3.6, `阶梯第 ${i} 行速度`));
  assert(await page.$$eval('#bk-c-ladder tr.bk-cur', (n) => n.length) === 1, '阶梯表高亮当前一行');
  assert(+(await page.$eval('#bk-fig-climb', (s) => s.querySelectorAll('text').length)) >= 8, '爬坡图有刻度和标注');
  // 给用时反解功率
  await page.check('#bk-c-mode-time');
  await setVal('#bk-c-time', '45:00');
  await closeS('#bk-c-k-power', O.climbT.P, '45 分钟所需功率');
  await closeS('#bk-c-k-wkg', O.climbT.wkg, '45 分钟功体比');
  await setVal('#bk-c-time', '1:75');
  await page.waitForFunction(() => document.getElementById('bk-c-err').textContent.includes('用时格式'), null, { timeout: 10000 });
  assert(await disp('#bk-c-err') !== 'none', '非法用时错误条可见');
  await setVal('#bk-c-time', '45:00');
  await page.check('#bk-c-mode-power');
  await setVal('#bk-c-gain', 9000);
  await page.waitForFunction(() => !document.getElementById('bk-c-err').hidden, null, { timeout: 10000 });
  await setVal('#bk-c-gain', 600);
  await page.waitForFunction(() => document.getElementById('bk-c-err').hidden, null, { timeout: 10000 });

  // ── 6. 固齿与链条 ──
  await onTab('fixed');
  const F = O.fixed;
  await closeS('#bk-f-k-skid', F.s4817.single, '48/17 刹车皮');
  await closeS('#bk-f-k-ambi', F.s4817.ambi, '48/17 双脚');
  await closeS('#bk-f-k-inches', F.inches4817, '48/17 齿英寸');
  await closeS('#bk-f-k-links', F.chain.links, '链条节数');
  for (const [r, c, key] of [[44, 16, 's4416'], [45, 15, 's4515']]) {
    await setVal('#bk-f-ring', r); await setVal('#bk-f-cog', c);
    await page.waitForFunction(([r, c]) => document.querySelector('#bk-f-table td.bk-cur')?.dataset.ring === String(r) && document.querySelector('#bk-f-table td.bk-cur')?.dataset.cog === String(c), [r, c], { timeout: 10000 });
    await closeS('#bk-f-k-skid', F[key].single, `${r}/${c} 单脚`);
    await closeS('#bk-f-k-ambi', F[key].ambi, `${r}/${c} 双脚`);
  }
  assert((await txt('#bk-f-explain')).includes('约分为 3/1'), '45/15 约分说明');
  await setVal('#bk-f-ring', 48); await setVal('#bk-f-cog', 17);
  await setVal('#bk-f-stay', 435); await setVal('#bk-f-bigring', 32); await setVal('#bk-f-bigcog', 52);
  await closeS('#bk-f-k-links', F.chainMtb.links, 'MTB 链条节数');
  await page.click('#bk-f-fromgear');
  await page.waitForFunction(() => document.getElementById('bk-f-bigring').value === '50' && document.getElementById('bk-f-bigcog').value === '30', null, { timeout: 10000 });
  await setVal('#bk-f-stay', 410);
  await closeS('#bk-f-k-links', F.chain.links, '取齿比页后链条节数');
  await setVal('#bk-f-cog', 7);
  await page.waitForFunction(() => !document.getElementById('bk-f-err').hidden, null, { timeout: 10000 });
  assert(await txt('#bk-f-k-skid') === '—', '非法后齿时清空');
  await setVal('#bk-f-cog', 17);
  await page.waitForFunction(() => document.getElementById('bk-f-err').hidden, null, { timeout: 10000 });

  // ── 7. 方案：保存 / 刷新 / 载入 / 删除 ──
  await onTab('saved');
  assert(await disp('#bk-s-empty') !== 'none' && await disp('#bk-s-wrap') === 'none', '无方案时只显示空提示');
  await page.click('#bk-s-save');
  assert((await txt('#bk-s-msg')).includes('方案名'), '空名不保存');
  await onTab('gear');
  await page.selectOption('#bk-g-crankset', { label: '砾石 · 46/30' });
  await page.selectOption('#bk-g-cassette', { label: '12 速山地 · 10-52' });
  await page.selectOption('#bk-g-wheel', { label: '650B×47 砾石' });
  await setVal('#bk-g-crank', 170); await setVal('#bk-g-rpm', 85);
  await onTab('saved');
  await setVal('#bk-s-name', '砾石车 <b>');
  await page.click('#bk-s-save');
  await page.waitForFunction(() => document.querySelectorAll('#bk-s-list tbody tr').length === 1, null, { timeout: 10000 });
  assert(await page.$eval('#bk-s-list tbody td', (n) => n.textContent) === '砾石车 <b>', '方案名按文本转义显示');
  await page.click('#bk-s-reset');
  await page.reload();
  await page.waitForFunction(() => window.__bk && window.__bk.ready, null, { timeout: 10000 });
  await onTab('gear');
  await closeS('#bk-g-k-range', G.range, '刷新后保留恢复默认的状态');
  await onTab('saved');
  await page.click('#bk-s-list .bk-sload');
  await onTab('gear');
  await closeS('#bk-g-k-range', M.range, '载入方案后齿比范围');
  await onTab('saved');
  await page.click('#bk-s-list .bk-sdel');
  await page.waitForFunction(() => document.querySelectorAll('#bk-s-list tbody tr').length === 0, null, { timeout: 10000 });
  assert(await disp('#bk-s-empty') !== 'none', '删光后空提示回来');
  await page.click('#bk-s-reset');

  // ── 8. 键盘：页签方向键 ──
  await page.focus('#bk-tab-saved');
  await page.keyboard.press('ArrowRight');
  assert(await page.$eval('#bk-tab-about', (e) => e.getAttribute('aria-selected') === 'true' && document.activeElement === e), '→ 切到说明页');
  await page.keyboard.press('ArrowRight');
  assert(await page.$eval('#bk-tab-gear', (e) => e.getAttribute('aria-selected') === 'true'), '→ 循环回齿比页');
  await page.keyboard.press('End');
  assert(await page.$eval('#bk-tab-about', (e) => e.getAttribute('aria-selected') === 'true'), 'End 到最后一页');

  // ── 9. 渲染守卫（逐页签 × 逐视口） ──
  const n = await renderGuards(page, {
    assert, tabs: T, onTab,
    paneSel: (t) => `#bk-pane-${t}`, panesRoot: '#bk-panes',
    figSel: (t) => `#bk-pane-${t} svg.bk-fig`, cardSel: '.bk-card', childSel: 'svg,table,dl,h2,h3,.bk-row-btns,.bk-bars',
    minControls: 36, minTextsInFig: 8,
  });
  assert(n >= 36, `应扫到 ≥36 个可见控件，实得 ${n}`);
  for (const vw of [390, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of ['gear', 'power', 'climb', 'fixed']) {
      await onTab(t);
      const esc = await page.$$eval(`#bk-pane-${t} .bk-kpi`, (ks) => ks.filter((k) => {
        const b = k.getBoundingClientRect(), d = k.querySelector('dd').getBoundingClientRect();
        return d.right > b.right + 1 || d.left < b.left - 1;
      }).length);
      assert(esc === 0, `视口 ${vw} 页签 ${t} 有 ${esc} 个 KPI 数值越出卡片`);
    }
  }
  await page.setViewportSize({ width: 390, height: 900 });
  await onTab('gear');
  const minH = await page.$$eval('#bk-fig-gear text', (ts) => Math.min(...ts.map((t) => t.getBoundingClientRect().height)));
  assert(minH >= 6, `390px 下齿比图最小字高 ${minH}`);
  await page.setViewportSize({ width: 1280, height: 850 });

  // 人工看图用
  await onTab('power');
  await page.locator('#bk-pane-power .bk-figwrap').screenshot({ path: '/tmp/bike-lab-power.png' });
  await onTab('gear');
  await page.locator('#bk-pane-gear .bk-figwrap').screenshot({ path: '/tmp/bike-lab-gear.png' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await screenshot('thumb.png');
};
