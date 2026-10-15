/* 骰子概率工作台 · 集成测试
 *
 * 数值真值全部来自 run 目录 oracle/ui_truth.py（icepool 2.2.2，与页面引擎独立），
 * 由 inject-oracle.mjs 机械注入 ORACLE 块，本文件不手写任何计算真值。
 * 少数与任何实现无关的文献字面量（15869/1296、27/216、0.75）单独注明来源。
 * 渲染守卫 import（render-guards.mjs）。
 */
import { renderGuards } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs';

const ORACLE = {
 "meta": {
  "tabs": [
   "dist",
   "cmp",
   "roll",
   "lib"
  ]
 },
 "abil": {
  "mean": 12.244598765432098,
  "sd": 2.8468444453115005,
  "min": 3,
  "max": 18,
  "median": 12,
  "mode": 13,
  "n": 16,
  "ge13": 0.4876543209876543,
  "ge": {
   "3": 1,
   "4": 0.9992283950617283,
   "5": 0.996141975308642,
   "6": 0.9884259259259259,
   "7": 0.9722222222222222,
   "8": 0.9429012345679012,
   "9": 0.8950617283950617,
   "10": 0.8248456790123456,
   "11": 0.7307098765432098,
   "12": 0.6165123456790124,
   "13": 0.4876543209876543,
   "14": 0.3549382716049383,
   "15": 0.23148148148148148,
   "16": 0.13040123456790123,
   "17": 0.057870370370370364,
   "18": 0.016203703703703703
  },
  "p": {
   "3": 0.0007716049382716049,
   "4": 0.0030864197530864196,
   "5": 0.007716049382716049,
   "6": 0.016203703703703703,
   "7": 0.029320987654320986,
   "8": 0.047839506172839504,
   "9": 0.07021604938271606,
   "10": 0.0941358024691358,
   "11": 0.11419753086419752,
   "12": 0.12885802469135801,
   "13": 0.13271604938271606,
   "14": 0.12345679012345678,
   "15": 0.10108024691358025,
   "16": 0.07253086419753087,
   "17": 0.041666666666666664,
   "18": 0.016203703703703703
  },
  "q": {
   "0.1": 8,
   "0.25": 10,
   "0.5": 12,
   "0.75": 14,
   "0.9": 16,
   "0.99": 18
  },
  "lt10": 0.17515432098765432
 },
 "advdis": {
  "gt": 0.8158125,
  "eq": 0.033375,
  "lt": 0.15081249999999996
 },
 "twod6_vs_d12": {
  "gt": 0.5,
  "eq": 0.08333333333333333,
  "lt": 0.4166666666666667
 },
 "abil_vs_3d6": {
  "gt": 0.6221922153635117,
  "eq": 0.08560528120713305,
  "lt": 0.2922025034293553
 },
 "adv": {
  "mean": 13.825000000000001,
  "sd": 4.7110906380582405,
  "min": 1,
  "max": 20,
  "median": 15,
  "mode": 20,
  "n": 20
 },
 "adv_ge15": 0.51,
 "wod": {
  "mean": 3.3333333333,
  "sd": 1.7213259314293476,
  "min": 0,
  "max": 110,
  "median": 3,
  "mode": 3,
  "n": 111
 },
 "wod_ge3": 0.662787965505,
 "gwf": {
  "mean": 8.333333333333332,
  "sd": 2.0138409955990952,
  "min": 2,
  "max": 12,
  "median": 8,
  "mode": 9,
  "n": 11
 },
 "fate": {
  "mean": 0,
  "sd": 1.632993161855452,
  "min": -4,
  "max": 4,
  "median": 0,
  "mode": 0,
  "n": 9
 },
 "fate_eq0": 0.2345679012345679
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const near = (a, b, tol, msg) => assert(Math.abs(a - b) <= tol, `${msg}：${a} vs ${b}（容差 ${tol}）`);
  const txt = async (sel) => ((await page.textContent(sel)) || '').trim();
  const num = async (sel, attr = 'data-p') => Number(await page.getAttribute(sel, attr));
  const onTab = async (t) => {
    await page.click(`#tab-${t}`);
    await page.waitForFunction((t) => !document.querySelector(`#pane-${t}`).hidden, t);
  };
  const setExpr = async (e) => {
    await page.fill('#expr', e);
    await page.press('#expr', 'Enter');
    await page.waitForFunction((e) => document.querySelector('#exprErr').textContent === '' &&
      document.querySelector('#distLede').textContent.includes('「' + e + '」'), e, { timeout: 10000 });
  };

  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#kMean').textContent !== '—');

  assert(await page.locator('a[href="../../"]').first().isVisible(), '顶部有返回工具集链接');

  // ── 1. 默认 4d6dl1：KPI 与 icepool 一致 ──
  const A = ORACLE.abil;
  assert(await txt('#kMean') === A.mean.toFixed(3), `均值 ${await txt('#kMean')} = ${A.mean.toFixed(3)}`);
  assert(await txt('#kSd') === A.sd.toFixed(3), `标准差 ${await txt('#kSd')} = ${A.sd.toFixed(3)}`);
  assert(await txt('#kRange') === `${A.min} ~ ${A.max}`, '最小 ~ 最大');
  assert(await txt('#kMode') === String(A.mode), `众数 = ${A.mode}`);
  assert(await txt('#kMedian') === String(A.median), `中位数 = ${A.median}`);
  assert(await txt('#kSupport') === `${A.n} 种`, `可能取值 ${A.n} 种`);
  // 文献字面量：4d6 去最低的期望 = 15869/1296（与任何实现无关的经典结果）
  near(A.mean, 15869 / 1296, 1e-12, 'oracle 自身与经典结果 15869/1296 一致');

  // 命中条件 ≥13
  near(await num('#qProb'), A.ge13, 1e-12, 'P(≥13)');
  assert((await txt('#qProb')).startsWith((A.ge13 * 100).toFixed(1) + '%'), 'P(≥13) 显示为 1 位小数百分比');
  // 逐值表
  const rows = await page.$$eval('#distTable tbody tr', (rs) => rs.map((r) => [...r.cells].slice(0, 3).map((c) => c.textContent)));
  assert(rows.length === A.n, `表格 ${rows.length} 行 = ${A.n}`);
  let badRow = 0;
  for (const [v, pe, pg] of rows) {
    if (pe !== (A.p[v] * 100).toFixed(3) + '%' || pg !== (A.ge[v] * 100).toFixed(3) + '%') badRow++;
  }
  assert(badRow === 0, `逐值表 P(=)/P(≥) 与 icepool 全部一致（失配 ${badRow}）`);
  const hits = await page.$$eval('#distTable tbody tr.dl-hit', (rs) => rs.map((r) => +r.dataset.v));
  assert(hits.length === 6 && hits[0] === 13 && hits[5] === 18, `命中行高亮 13..18：${hits}`);
  // 分位数
  const qs = await page.$$eval('#quantiles dd', (ds) => ds.map((d) => [d.dataset.q, d.textContent]));
  assert(qs.length === 6 && qs.every(([p, v]) => String(A.q[String(+p)]) === v), `分位数：${JSON.stringify(qs)}`);

  // ── 2. 图：几何断言（众数柱最高、命中柱计数、柱高与概率成比例）──
  const bars = await page.$$eval('#distBars rect', (rs) => rs.map((r) => ({ v: +r.dataset.v, h: r.getBoundingClientRect().height, hit: r.classList.contains('dl-bhit') })));
  assert(bars.length === A.n, `柱子 ${bars.length} 根`);
  const tallest = bars.reduce((a, b) => (b.h > a.h ? b : a));
  assert(tallest.v === A.mode, `最高的柱子是众数 ${A.mode}（实得 ${tallest.v}）`);
  assert(bars.filter((b) => b.hit).length === 6, '满足 ≥13 的柱子 6 根标蓝');
  const b12 = bars.find((b) => b.v === 12), b8 = bars.find((b) => b.v === 8);
  near(b8.h / b12.h, A.p['8'] / A.p['12'], 0.02, '柱高比 h(8)/h(12) = P(8)/P(12)');
  const ticksY = await page.$$eval('#figDist text', (ts) => ts.map((t) => t.textContent).filter((s) => /%$/.test(s)));
  assert(ticksY.length >= 4, `y 轴刻度 ≥4 根：${ticksY}`);
  assert(!ticksY.includes('3%') || !ticksY.includes('8%'), `y 轴 2.5% 步长不能被四舍五入成 3%/8%：${ticksY}`);
  const ticksX = await page.$$eval('#figDist text', (ts) => ts.map((t) => t.textContent).filter((s) => /^\d+$/.test(s)));
  assert(ticksX.length >= 5 && ticksX.every((s) => !s.includes('.')), `x 轴刻度为整数：${ticksX}`);

  // 「至少」口径：柱高单调不增
  await page.click('#modeSeg [data-mode="ge"]');
  await page.waitForFunction(() => document.querySelector('#figDist').textContent.includes('至少掷出'));
  const geH = await page.$$eval('#distBars rect', (rs) => rs.map((r) => r.getBoundingClientRect().height));
  assert(geH.every((h, i) => i === 0 || h <= geH[i - 1] + 0.5), '至少口径下柱高单调不增');
  await page.click('#modeSeg [data-mode="eq"]');
  await page.waitForFunction(() => !document.querySelector('#figDist').textContent.includes('至少掷出'));

  // 点击柱子设定目标值
  await page.click('#distBars rect[data-v="10"]');
  await page.waitForFunction(() => document.querySelector('#qVal').value === '10');
  await page.selectOption('#qCmp', '<');
  await page.waitForFunction(() => document.querySelector('#qProb').textContent.includes('< 10'));
  near(await num('#qProb'), A.lt10, 1e-12, '点柱子 10 + 选「<」⇒ P(<10)');
  await page.selectOption('#qCmp', '>=');
  await page.fill('#qVal', '13');
  await page.waitForFunction(() => document.querySelector('#qProb').textContent.includes('≥ 13'));

  // ── 3. 其他规则书掷法 ──
  await setExpr('10d10!>=8');
  assert(await txt('#kMean') === ORACLE.wod.mean.toFixed(3), `10d10!>=8 均值 ${await txt('#kMean')}`);
  assert(await txt('#kRange') === `${ORACLE.wod.min} ~ ${ORACLE.wod.max}`, `10d10!>=8 范围 ${await txt('#kRange')}`);
  await page.fill('#qVal', '3');
  await page.waitForFunction(() => document.querySelector('#qProb').textContent.includes('≥ 3'));
  near(await num('#qProb'), ORACLE.wod_ge3, 1e-12, '黑暗世界骰池 ≥3 成功');
  // 长尾裁剪：表格列全部取值，图只画主体，并显示裁剪说明
  const wodRows = await page.$$eval('#distTable tbody tr', (r) => r.length);
  assert(wodRows === ORACLE.wod.n, `骰池逐值表列全 ${wodRows} = ${ORACLE.wod.n} 行`);
  const wodBars = await page.$$eval('#distBars rect', (r) => r.length);
  assert(wodBars >= 10 && wodBars <= 25, `骰池图只画主体 ${wodBars} 根柱`);
  assert(await page.$eval('#distClip', (e) => getComputedStyle(e).display !== 'none'), '显示长尾裁剪说明');
  const barW = await page.$eval('#distBars rect', (r) => r.getBoundingClientRect().width);
  assert(barW >= 15, `裁剪后柱宽 ${barW.toFixed(1)}px 可读`);
  await setExpr('2d6ro<=2');
  assert(await txt('#kMean') === ORACLE.gwf.mean.toFixed(3), `巨武器 2d6ro<=2 均值 ${await txt('#kMean')}`);
  await setExpr('4dF');
  await page.fill('#qVal', '0'); await page.selectOption('#qCmp', '=');
  await page.waitForFunction(() => document.querySelector('#qProb').textContent.includes('= 0'));
  near(await num('#qProb'), ORACLE.fate_eq0, 1e-12, '4dF 恰好 0');
  await setExpr('2d20kh1');
  await page.selectOption('#qCmp', '>='); await page.fill('#qVal', '11');
  await page.waitForFunction(() => document.querySelector('#qProb').textContent.includes('≥ 11'));
  near(await num('#qProb'), 0.75, 1e-12, '优势 ≥11 = 1−(1/2)² = 0.75（闭式，与实现无关）');
  await page.fill('#qVal', '15');
  await page.waitForFunction(() => document.querySelector('#qProb').textContent.includes('≥ 15'));
  near(await num('#qProb'), ORACLE.adv_ge15, 1e-12, '优势 ≥15');

  // 能力清单：每个快捷按钮 / 预设 / 语法示例都必须能算出分布
  const caps = await page.evaluate(() => [...DiceLab.quick, ...DiceLab.presets.map((p) => p.e), ...DiceLab.syntax.map((s) => s[2])]);
  const dead = await page.evaluate((list) => list.filter((e) => { try { const r = DiceEngine.analyze(e); return !(r.dist.p.length > 0); } catch (x) { return true; } }), caps);
  assert(caps.length >= 35 && dead.length === 0, `清单 ${caps.length} 项全部可算，失效：${dead.join(' | ')}`);

  // ── 4. 非法输入 ──
  for (const [bad, frag] of [['4d6kh5', '超过了骰子数'], ['2d', '面数'], ['1d6r<=6', '无限重掷'], ['abc', '无法识别']]) {
    await page.fill('#expr', bad);
    await page.waitForFunction((f) => document.querySelector('#exprErr').textContent.includes(f), frag, { timeout: 10000 });
    assert(await page.getAttribute('#expr', 'aria-invalid') === 'true', `「${bad}」标记 aria-invalid`);
    assert(await txt('#kMean') === '—', `「${bad}」时 KPI 清空`);
  }
  await setExpr('4d6dl1');

  // ── 5. 模拟验证（真随机 20000 次，卡方）──
  await page.selectOption('#simN', '20000');
  await page.click('#simBtn');
  await page.waitForFunction(() => !document.querySelector('#simOut').hidden, null, { timeout: 20000 });
  const simP = await num('#simP');
  assert(simP > 1e-4, `模拟卡方 p = ${simP}（>1e-4）`);
  near(Number(await txt('#simMean')), A.mean, 0.08, '模拟均值接近精确均值');
  const dots = await page.$$eval('#simDots circle', (c) => c.length);
  assert(dots === A.n, `模拟频率点 ${dots} 个`);
  assert(await page.$eval('#simLegend', (e) => getComputedStyle(e).display !== 'none'), '模拟图例显示');
  // 卡方实现自检：完美吻合的频数 ⇒ p≈1；严重偏离 ⇒ p≈0
  const cs = await page.evaluate(() => [DiceLab.chiSquare([10, 20, 30, 40], [0.1, 0.2, 0.3, 0.4], 100).p, DiceLab.chiSquare([40, 30, 20, 10], [0.1, 0.2, 0.3, 0.4], 100).p, DiceLab.gammaQ(1, 2)]);
  assert(cs[0] > 0.999 && cs[1] < 1e-6, `卡方 p 值：吻合 ${cs[0]}，偏离 ${cs[1]}`);
  near(cs[2], Math.exp(-2), 1e-12, 'Q(1,2) = e^-2（闭式）');

  // ── 6. 对比 ──
  await onTab('cmp');
  await page.click('#cmpPresets [data-a="2d20kh1"]');
  await page.waitForFunction(() => document.querySelector('#lgB').textContent === '2d20kl1' && document.querySelector('#lgA').textContent === '2d20kh1');
  near(await num('#vsGt'), ORACLE.advdis.gt, 1e-12, '优势 胜 劣势');
  near(await num('#vsEq'), ORACLE.advdis.eq, 1e-12, '优势 平 劣势');
  near(await num('#vsLt'), ORACLE.advdis.lt, 1e-12, '优势 负 劣势');
  const segW = await page.$$eval('#vsBar i', (is) => is.map((i) => i.getBoundingClientRect().width));
  const tw = segW.reduce((a, b) => a + b, 0);
  near(segW[0] / tw, ORACLE.advdis.gt, 0.01, '胜负条蓝段占比 = P(A>B)');
  const nA = await page.$$eval('#cmpBarsA rect', (r) => r.length), nB = await page.$$eval('#cmpBarsB rect', (r) => r.length);
  assert(nA === 20 && nB === 20, `对比图 A ${nA} 根、B ${nB} 根`);
  await page.click('#cmpPresets [data-a="2d6"]');
  await page.waitForFunction(() => document.querySelector('#lgB').textContent === '1d12');
  near(await num('#vsGt'), ORACLE.twod6_vs_d12.gt, 1e-12, '2d6 胜 1d12');
  await page.fill('#cmpB', '3d6');
  await page.click('#cmpPresets [data-a="4d6dl1"]');
  await page.waitForFunction(() => document.querySelector('#lgA').textContent === '4d6dl1' && document.querySelector('#lgB').textContent === '3d6');
  near(await num('#vsGt'), ORACLE.abil_vs_3d6.gt, 1e-12, '4d6 去低 胜 3d6');
  await page.click('#cmpSwap');
  await page.waitForFunction(() => document.querySelector('#lgA').textContent === '3d6');
  near(await num('#vsLt'), ORACLE.abil_vs_3d6.gt, 1e-12, '交换 A/B 后胜负互换');
  await page.click('#cmpSwap');
  await page.waitForFunction(() => document.querySelector('#lgA').textContent === '4d6dl1');
  await page.fill('#cmpB', '2d');
  await page.waitForFunction(() => document.querySelector('#cmpErr').textContent.includes('B：'));
  assert(await txt('#vsGt') === '—', 'B 非法时结果清空');
  await page.fill('#cmpB', '3d6');
  await page.waitForFunction(() => document.querySelector('#vsGt').textContent !== '—');

  // ── 7. 掷骰 ──
  await onTab('roll');
  await page.click('#rollBtn');
  await page.waitForFunction(() => document.querySelector('#rollTotal').textContent !== '—');
  const total = Number(await txt('#rollTotal'));
  assert(total >= 3 && total <= 18, `4d6dl1 结果 ${total} 在 3..18`);
  const dice = await page.$$eval('#rollGroups .dl-die', (ds) => ds.map((d) => ({ v: +d.firstChild.textContent, drop: d.classList.contains('dl-drop'), deco: getComputedStyle(d).textDecorationLine })));
  assert(dice.length === 4, `4 颗骰子（实得 ${dice.length}）`);
  const dropped = dice.filter((d) => d.drop);
  assert(dropped.length === 1 && dropped[0].deco.includes('line-through'), '去掉的那颗划线显示（断计算样式）');
  assert(dropped[0].v <= Math.min(...dice.filter((d) => !d.drop).map((d) => d.v)), '去掉的是最低那颗');
  assert(dice.filter((d) => !d.drop).reduce((a, d) => a + d.v, 0) === total, '保留的三颗之和 = 总点数');
  assert(await txt('#histCount') === '1', '历史 1 条');
  await page.selectOption('#rollTimes', '10');
  await page.click('#rollBtn');
  await page.waitForFunction(() => document.querySelector('#histCount').textContent === '11');
  await page.click('#stage');  // 焦点离开按钮再按空格
  await page.keyboard.press(' ');
  await page.waitForFunction(() => document.querySelector('#histCount').textContent === '12');
  const hv = await page.$$eval('#histList b', (bs) => bs.map((b) => +b.textContent));
  assert(hv.length === 12 && hv.every((v) => v >= 3 && v <= 18), '历史 12 条且都在 3..18');
  assert(await txt('#histN') === '12 次', '本表达式已掷 12 次');
  // 爆骰 + 成功计数的展示
  await setExpr('10d10!>=8');
  await onTab('roll');
  await page.selectOption('#rollTimes', '1');
  await page.click('#rollBtn');
  await page.waitForFunction(() => document.querySelector('#rollExpr').textContent === '10d10!>=8');
  const wodRoll = await page.evaluate(() => {
    const ds = [...document.querySelectorAll('#rollGroups .dl-die')];
    const succ = ds.reduce((a, d) => a + d.firstChild.textContent.split('+').filter((x) => +x >= 8).length, 0);
    return { n: ds.length, succ, total: +document.querySelector('#rollTotal').textContent };
  });
  assert(wodRoll.n === 10 && wodRoll.succ === wodRoll.total, `骰池：10 颗、链上 ≥8 的个数 ${wodRoll.succ} = 总成功 ${wodRoll.total}`);
  // 持久化
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#kMean').textContent !== '—');
  assert(await page.inputValue('#expr') === '10d10!>=8', '刷新后表达式保留');
  assert(await txt('#histCount') === '13', `刷新后历史保留（${await txt('#histCount')}）`);
  await onTab('roll');
  await page.click('#histClear');
  await page.waitForFunction(() => document.querySelector('#histCount').textContent === '0');
  assert(await page.$eval('#histEmpty', (e) => getComputedStyle(e).display !== 'none'), '清空后显示空状态');

  // ── 8. 预设与收藏 ──
  await onTab('lib');
  const presetN = await page.$$eval('#presetList .dl-preset', (p) => p.length);
  assert(presetN >= 15, `预设卡 ${presetN} 张`);
  await page.click('#presetList .dl-load[data-e="2d20kh1"]');
  await page.waitForFunction(() => !document.querySelector('#pane-dist').hidden && document.querySelector('#expr').value === '2d20kh1');
  assert(await txt('#kMean') === ORACLE.adv.mean.toFixed(3), '载入预设「优势」后均值正确');
  await onTab('lib');
  assert(await page.$eval('#favEmpty', (e) => getComputedStyle(e).display !== 'none'), '无收藏时显示空状态');
  await page.fill('#favName', '优势攻击');
  await page.click('#favSave');
  await page.waitForFunction(() => document.querySelectorAll('#favList .dl-preset').length === 1);
  assert(await page.$eval('#favEmpty', (e) => getComputedStyle(e).display === 'none'), '有收藏后空状态隐藏（断计算样式）');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await onTab('lib');
  assert((await txt('#favList h4')) === '优势攻击', '收藏刷新后仍在');
  await page.click('#favList .dl-fdel');
  await page.waitForFunction(() => document.querySelectorAll('#favList .dl-preset').length === 0);
  const synRows = await page.$$eval('#syntaxTable tbody tr', (r) => r.length);
  assert(synRows >= 10, `语法速查 ${synRows} 行`);

  // ── 9. 分享链接 ──
  await page.goto(toolURL + '#e=' + encodeURIComponent('3d6'), { waitUntil: 'domcontentloaded' });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#expr').value === '3d6');
  near(Number(await page.$eval('#distTable tbody tr[data-v="10"] td:nth-child(2)', (td) => parseFloat(td.textContent))) / 100, 27 / 216, 5e-6,
    '3d6 掷出 10 = 27/216（经典结果）');

  // ── 10. 键盘：页签左右方向键 ──
  await page.focus('#tab-dist');
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => !document.querySelector('#pane-cmp').hidden);
  assert(await page.evaluate(() => document.activeElement.id) === 'tab-cmp', '方向键切页签并移动焦点');

  // ── 11. 渲染守卫 ──
  await setExpr('4d6dl1');
  const n = await renderGuards(page, {
    assert, tabs: ORACLE.meta.tabs, onTab,
    paneSel: (t) => `#pane-${t}`, panesRoot: '#dl-panes',
    figSel: (t) => `#pane-${t} svg.dl-fig`, cardSel: '.dl-card',
    minControls: 30, minTextsInFig: 8,
  });
  assert(n >= 30, `守卫累计扫到 ${n} 个控件`);

  // ── 缩略图 ──
  await onTab('dist');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForFunction(() => document.querySelectorAll('#distBars rect').length > 0);
  await screenshot('thumb.png');
};
