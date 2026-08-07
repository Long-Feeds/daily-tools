// 集成测试:薪税工作台 · Payroll Studio
//
// 两段闸门:
//   A) 离线引擎断言 —— 直接从 index.html 抽 <<<ENGINE 块 import 求值,与**独立 oracle**
//      对照(分段积分法重算年度税、1 元步长穷举最优拆分、盲区闭式解、累计预扣 ≡ 年度法恒等式)。
//   B) 浏览器断言 —— 真的改输入、切标签,断言页面上出现的**税额数字**,而不是「元素存在」。
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));

export default async function ({ page, toolURL, screenshot, assert }) {
  /* ══════════════ A. 离线引擎断言 ══════════════ */
  const html = await readFile(join(HERE, 'index.html'), 'utf8');
  const blk = html.match(/\/\*<<<ENGINE\*\/([\s\S]*?)\/\*ENGINE>>>\*\//);
  assert(blk, '能从 index.html 抽出 <<<ENGINE 引擎块');
  const E = (await import('data:text/javascript;charset=utf-8,' +
    encodeURIComponent(blk[1] + '\nexport default PS_ENGINE;\n'))).default;

  const near = (a, b, tol, msg) => assert(Math.abs(a - b) <= tol, `${msg}(得 ${a},期望 ${b})`);

  // 1) 年度税率表 vs 分段积分法(独立 oracle)
  const integrate = (t) => {
    const edges = [0, 36000, 144000, 300000, 420000, 660000, 960000, Infinity];
    const rates = [0.03, 0.10, 0.20, 0.25, 0.30, 0.35, 0.45];
    let tax = 0;
    for (let i = 0; i < rates.length; i++) {
      if (t <= edges[i]) break;
      tax += (Math.min(t, edges[i + 1]) - edges[i]) * rates[i];
    }
    return Math.round(tax * 100) / 100;
  };
  let worst = 0;
  for (let i = 0; i < 3000; i++) { const t = i * 800 + (i % 7) * 13.5; worst = Math.max(worst, Math.abs(E.annualTax(t) - integrate(t))); }
  assert(worst < 0.02, `3000 组:速算扣除数法 ≡ 分段积分法(最大偏差 ${worst})`);
  near(E.annualTax(36000), 1080, 0, '年度 36000 → 1080');
  near(E.annualTax(300000), 43080, 0, '年度 300000 → 43080');
  near(E.annualTax(1000000), 268080, 0, '年度 1000000 → 268080');

  // 2) 年终奖单独计税 + 盲区闭式解(经典六段)
  near(E.bonusSeparateTax(36000).tax, 1080, 0, '年终奖 36000 → 1080');
  near(E.bonusSeparateTax(36001).tax, 3390.1, 0.01, '年终奖 36001 → 3390.1(跨档)');
  near(E.bonusSeparateTax(60000).tax, 5790, 0, '年终奖 60000 → 5790');
  const zones = E.blindZones();
  assert(zones.length === 6, `盲区 6 段(得 ${zones.length})`);
  [38566.67, 160500, 318333.33, 447500, 706538.46, 1120000].forEach((v, i) => near(zones[i].to, v, 0.01, `盲区 ${i + 1} 上界`));
  for (const z of zones) {
    const netFrom = z.from - E.bonusSeparateTax(z.from).tax;
    for (let k = 1; k <= 12; k++) {
      const b = z.from + (z.to - z.from) * k / 12;
      assert(b - E.bonusSeparateTax(b).tax <= netFrom + 0.01, `盲区内 ${b.toFixed(2)} 的税后不超过临界点`);
    }
    assert((z.to + 100) - E.bonusSeparateTax(z.to + 100).tax > netFrom, `越过 ${z.to.toFixed(2)} 后税后反超`);
    assert(E.inBlindZone(z.from) === null && E.inBlindZone(z.to + 1) === null && E.inBlindZone(z.from + 1) !== null,
      '盲区判定的开闭区间正确');
  }

  const P0 = {
    monthlySalary: 25000, monthlyAllowance: 0, bonus: 60000, bonusMonth: 1, bonusMode: 'separate', bonusSplit: 0,
    startMonth: 1, siBaseMode: 'actual', siBaseCustom: 0,
    siFloor: 6821, siCeil: 35283, fundCeil: 35283, fundRate: 0.12,
    rp: { pension: 0.08, medical: 0.02, unemp: 0.005 },
    rc: { pension: 0.16, medical: 0.098, unemp: 0.005, injury: 0.004 },
    otherDeduction: 0, majorMedical: 0,
    sd: { children: 1, infants: 0, rent: 1500, loan: false, elder: 0, edu: 0, privatePension: 0 }
  };

  // 3) 五险一金基数上下限
  near(E.socialInsurance(P0).personalTotal, 5625, 0, '25000 基数个人合计 5625');
  near(E.socialInsurance({ ...P0, monthlySalary: 3000 }).siBase, 6821, 0, '低于下限按下限计缴');
  near(E.socialInsurance({ ...P0, monthlySalary: 90000 }).siBase, 35283, 0, '高于上限按上限封顶');

  // 4) 专项附加:租金与房贷利息互斥、个人养老金封顶
  const bare = { children: 0, infants: 0, rent: 0, loan: false, elder: 0, edu: 0, privatePension: 0 };
  near(E.specialDeduction({ ...bare, rent: 1500, loan: true }).total, 1500, 0, '租金 1500 与房贷 1000 互斥,取高者 1500');
  near(E.specialDeduction({ ...bare, rent: 800, loan: true }).total, 1000, 0, '租金 800 与房贷 1000 互斥,取高者 1000');
  assert(E.specialDeduction({ ...bare, rent: 1500, loan: true }).warn.length === 1, '互斥给出一条提示');
  near(E.specialDeduction(P0.sd).total, 3500, 0, '默认专项附加 = 子女 2000 + 租金 1500');
  near(E.specialDeduction({ ...P0.sd, privatePension: 5000 }).total, 3500 + 1000, 0, '个人养老金封顶 1000');
  assert(E.specialDeduction({ ...P0.sd, privatePension: 5000 }).warn.length === 1, '个人养老金超限给出提示');
  near(E.majorMedicalDeduction(50000), 35000, 0, '大病自付 5 万 → 扣 3.5 万');
  near(E.majorMedicalDeduction(200000), 80000, 0, '大病扣除封顶 8 万');

  // 5) 累计预扣 ≡ 年度法(设计恒等式)
  const s0 = E.withholdingSchedule({ ...P0, bonus: 0 });
  near(s0.totalTax, E.annualTax(10875 * 12), 0.01, '全年在职收入均匀 ⇒ 累计预扣总额 ≡ 年度法');
  near(s0.totalTax, 10530, 0.01, '全年个税 10530');
  assert(s0.rows[2].rate === 0.03 && s0.rows[3].rate === 0.10 && s0.rows[3].stepUp, '第 4 月跨到 10% 且被标为跳档');
  assert(s0.rows[3].net < s0.rows[2].net, '跳档月到手下降');
  assert(s0.rows.every((r) => r.tax >= -1e-9), '任何一月预扣税额都不为负');

  // 6) 年中入职 ⇒ 汇算退税(独立 oracle)
  const rMid = E.reconcile({ ...P0, bonus: 0, startMonth: 7 });
  near(rMid.paid, E.annualTax(6 * 25000 - 6 * 5000 - 6 * 5625 - 6 * 3500), 0.01, '已预缴按 6 个月口径');
  near(rMid.due, E.annualTax(6 * 25000 - 60000 - 6 * 5625 - 12 * 3500), 0.01, '汇算按全年 60000 + 12 个月专项附加');
  assert(rMid.diff < -0.01, `年中入职应退税(得 ${rMid.diff}）`);
  near(E.reconcile({ ...P0, bonus: 0 }).diff, 0, 0.01, '全年在职收入均匀 ⇒ 不退不补');
  // 回归:发放月早于入职月时,年终奖必须顺延而不是凭空蒸发(否则汇算会凭空多出补税)
  const rShift = E.reconcile({ ...P0, startMonth: 7, bonusMonth: 1 });
  assert(rShift.schedule.bonusMonthShifted && rShift.schedule.bonusMonth === 7, '年终奖发放月顺延到首个在职月');
  near(rShift.schedule.rows[6].bonusSeparate, 60000, 0.01, '顺延后年终奖落在 7 月');
  near(rShift.paid, E.annualTax(65250) + E.bonusSeparateTax(60000).tax, 0.01, '顺延后已预缴含奖金税');
  near(rShift.diff, -3577.5, 0.01, '顺延后 7 月入职退税 3577.5');
  near(-E.reconcile({ ...P0, bonus: 0, majorMedical: 45000 }).diff, 3000, 0.01, '大病扣除 30000 × 10% ⇒ 退 3000');

  // 7) 最优拆分 ≡ 1 元步长穷举
  const brute = (base, B) => {
    let best = Infinity, at = 0;
    for (let x = 0; x <= B; x += 1) {
      const t = E.annualTax(Math.max(0, base + (B - x))) + E.bonusSeparateTax(x).tax;
      if (t < best - 1e-9) { best = t; at = x; }
    }
    return { best: Math.round(best * 100) / 100, at };
  };
  for (const B of [60000, 150000, 40000]) {
    const st = E.bonusStrategies({ ...P0, bonus: B });
    const bb = brute(130500, B);
    near(st.best.total, bb.best, 0.01, `年终奖 ${B} 最优拆分 ≡ 穷举(@${bb.at})`);
    assert(st.best.total <= Math.min(st.separate.total, st.merged.total) + 1e-9, `年终奖 ${B} 最优拆分不劣于端点`);
  }
  for (const B of [40000, 165000, 330000, 460000, 720000, 1150000]) {
    assert(E.inBlindZone(E.optimizeBonusSplit({ ...P0, bonus: B }).separate) === null,
      `年终奖 ${B} 的最优单独部分不落在盲区内`);
  }

  // 8) 税负曲线:单调 + 社保封顶后边际留存率回升
  const curve = E.taxCurve(P0, 1200000, 40);
  assert(curve.every((p, i) => i === 0 || p.net >= curve[i - 1].net - 0.01), '到手随总包单调不减');
  assert(curve.every((p) => p.marginalKeep >= 0 && p.marginalKeep <= 1.0001), '边际留存率落在 [0,1]');
  const cap = 35283 * 12;
  const mk = (g) => (E.packageOutcome(P0, g + 1000).net - E.packageOutcome(P0, g).net) / 1000;
  assert(mk(cap + 60000) > mk(cap - 20000), `社保封顶后边际留存率回升(${mk(cap - 20000).toFixed(4)} → ${mk(cap + 60000).toFixed(4)}）`);
  near(E.packageOutcome(P0, 360000).net, E.withholdingSchedule({ ...P0, monthlySalary: 30000, bonus: 0 }).totalNet, 0.01,
    '曲线口径 ≡ 逐月口径');

  // 9) 边界
  near(E.withholdingSchedule({ ...P0, monthlySalary: 4000, bonus: 0 }).totalTax, 0, 0, '月薪 4000 全年免税');
  near(E.bonusSeparateTax(-5).tax, 0, 0, '负年终奖按 0 处理');
  assert(E.withholdingSchedule({ ...P0, startMonth: 12, bonus: 0 }).monthsWorked === 1, '12 月入职 = 1 个月');

  /* ══════════════ B. 浏览器断言 ══════════════ */
  // 注意:别用 addInitScript 清 localStorage —— 它在**每次**导航时都会跑,后面的 reload
  // 会把刚存的方案一起清掉,使「刷新后恢复」永远测不出来。测试上下文本来就是干净的。
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#ps-conv');
  // 每次完整重算 body[data-runs]++;全程等它收敛,绝不用定时器(2026-07-06 教训)
  const runs = () => page.evaluate(() => Number(document.body.dataset.runs || 0));
  const settle = async (fn) => { const b = await runs(); await fn(); await page.waitForFunction((n) => Number(document.body.dataset.runs || 0) > n, b, { timeout: 15000 }); };
  const drawn = () => page.evaluate(() => Number(document.body.dataset.drawn || 0));
  const settleDraw = async (fn) => { const b = await drawn(); await fn(); await page.waitForFunction((n) => Number(document.body.dataset.drawn || 0) > n, b, { timeout: 15000 }); };
  // 切到无画布的面板(汇算清缴)时 data-drawn / data-runs 都不会动,只能等面板真的可见
  const showTab = async (k) => {
    await page.click('#ps-tab-' + k);
    await page.waitForFunction((key) => document.querySelector('#ps-tab-' + key).getAttribute('aria-selected') === 'true'
      && getComputedStyle(document.querySelector('#ps-panel-' + key)).display !== 'none', k, { timeout: 15000 });
  };
  await page.waitForFunction(() => Number(document.body.dataset.runs || 0) >= 1, null, { timeout: 15000 });

  const txt = async (sel) => ((await page.locator(sel).textContent()) || '').trim();
  const money = (s) => { const m = /-?[\d,]+(?:\.\d+)?/.exec(String(s).replace(/[¥\s]/g, '')); return m ? parseFloat(m[0].replace(/,/g, '')) : NaN; };
  const num = async (sel) => money(await txt(sel));
  const rows = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll(s + ' tbody tr'))
    .map((tr) => Array.from(tr.querySelectorAll('td')).map((td) => td.textContent.trim())), sel);
  const disp = (sel) => page.evaluate((s) => getComputedStyle(document.querySelector(s)).display, sel);

  assert((await page.locator('a[href="../../"]').count()) >= 1, '顶部有「返回工具集」链接');

  /* ── 默认参数(北京 · 月薪 25000 · 年终奖 60000 单独计税)的精确读数 ── */
  near(await num('#ps-gross'), 360000, 0.5, '税前总包 = 12×25000 + 60000');
  near(await num('#ps-fee-si'), -67500, 0.5, '五险一金个人 = 12×5625');
  near(await num('#ps-fee-tax'), -16320, 0.5, '全年个税 = 10530(工资) + 5790(年终奖)');
  near(await num('#ps-net'), 276180, 0.5, '全年到手 360000 - 67500 - 16320');
  near(money(await txt('#ps-eff')), 23.28, 0.02, '综合税负率 83820/360000 = 23.28%');
  near(await num('#ps-permonth'), 23015, 1, '月均到手 276180/12');
  near(await num('#ps-cost'), 476100, 1, '企业总成本 = 360000 + 12×9675');

  /* ── 逐月表:累计预扣的阶梯 ── */
  const mrows = await rows('#ps-tbl-monthly');
  assert(mrows.length === 12, `逐月表 12 行(得 ${mrows.length}）`);
  near(money(mrows[0][5]), 6116.25, 0.02, '1 月个税 = 326.25 + 年终奖 5790');
  near(money(mrows[0][6]), 73258.75, 0.02, '1 月到手(含年终奖)');
  near(money(mrows[1][5]), 326.25, 0.02, '2 月个税 326.25(3% 档)');
  near(money(mrows[1][6]), 19048.75, 0.02, '2 月到手 19048.75');
  near(money(mrows[3][5]), 851.25, 0.02, '4 月个税 851.25(跨 10% 档)');
  near(money(mrows[3][6]), 18523.75, 0.02, '4 月到手降到 18523.75');
  assert(money(mrows[3][6]) < money(mrows[2][6]), '跨档当月到手确实变少');
  near(money(mrows[11][3]), 130500, 0.5, '12 月累计应纳税所得额 130500');
  assert(/10%/.test(mrows[11][4]), `12 月税率档 10%(得 ${mrows[11][4]}）`);
  // 跳档行必须真的被高亮成绿底(靠背景色表达语义 ⇒ 断计算样式,不只断 class)
  const markBg = await page.evaluate(() => {
    const tr = document.querySelector('#ps-tbl-monthly tbody tr.ps-rowmark');
    return tr ? getComputedStyle(tr.querySelector('td')).backgroundColor : null;
  });
  assert(markBg === 'rgb(226, 246, 213)', `跳档行底色 = primary-pale(得 ${markBg}）`);
  const sumTax = mrows.reduce((a, r) => a + money(r[5]), 0);
  near(sumTax, 16320, 0.05, '逐月个税求和 = 全年个税');
  const sumNet = mrows.reduce((a, r) => a + money(r[6]), 0);
  near(sumNet, 276180, 0.05, '逐月到手求和 = 全年到手');

  /* ── 年终奖策略三卡 ── */
  await settleDraw(() => page.click('#ps-tab-bonus'));
  assert((await disp('#ps-panel-monthly')) === 'none', '切走后逐月面板计算样式为 none');
  assert((await disp('#ps-panel-bonus')) !== 'none', '年终奖面板已显示');
  const opts = await page.evaluate(() => Array.from(document.querySelectorAll('#ps-bonus-opts .ps-opt')).map((el) => ({
    name: el.querySelector('.ps-opt-name').textContent.trim(),
    val: parseFloat(el.querySelector('.ps-opt-val').textContent.replace(/[¥,\s]/g, '')),
    best: el.classList.contains('ps-opt--best')
  })));
  assert(opts.length === 3, `三种口径三张卡(得 ${opts.length}）`);
  near(opts[0].val, 16320, 0.02, '全部单独计税 16320');
  near(opts[1].val, 21180, 0.02, '全部并入综合 21180');
  near(opts[2].val, 15060, 0.02, '最优拆分 15060');
  assert(opts[2].best && !opts[0].best && !opts[1].best, '「最省」王冠落在最优拆分上');
  assert(/当前采用/.test(opts[0].name), '默认口径「全部单独计税」被标为当前采用');

  const blind = await rows('#ps-tbl-blind');
  assert(blind.length === 6, `盲区表 6 行(得 ${blind.length}）`);
  assert(/36,000/.test(blind[0][0]) && /38,566\.67/.test(blind[0][0]), `第 1 段盲区 36000~38566.67(得 ${blind[0][0]}）`);
  assert(/1,120,000/.test(blind[5][0]), `第 6 段盲区上界 1120000(得 ${blind[5][0]}）`);

  // 把年终奖调进盲区 → 必须弹红色告警并给出「少发反而多拿」的具体金额
  await settle(() => page.fill('#ps-bonus', '38000'));
  const bad = await page.locator('#ps-alerts .ps-alert--bad');
  assert((await bad.count()) === 1, '年终奖 38000 落入盲区,弹出一条红色告警');
  const badText = await bad.textContent();
  // 38000 税后 = 38000 - (3800-210) = 34410;36000 税后 = 34920 ⇒ 多拿 510
  assert(/510/.test(badText), `告警给出精确的「多拿 510」(得 ${badText}）`);
  const blindHit = await page.evaluate(() => !!document.querySelector('#ps-tbl-blind tbody tr.ps-rowmark'));
  assert(blindHit, '盲区表里命中的那一行被高亮');
  await settle(() => page.fill('#ps-bonus', '60000'));
  assert((await page.locator('#ps-alerts .ps-alert--bad').count()) === 0, '调回 60000 后红色告警消失');

  /* ── 汇算清缴 ── */
  await showTab('settle');
  assert((await txt('#ps-settle-diff')) === '不退不补', `全年在职收入均匀 ⇒ 不退不补(得 ${await txt('#ps-settle-diff')}）`);
  near(await num('#ps-settle-due'), 16320, 0.02, '全年应纳税额 16320');
  near(await num('#ps-settle-paid'), 16320, 0.02, '全年已预缴 16320');
  near(await num('#ps-settle-taxable'), 130500, 0.5, '应纳税所得额 130500');

  // 7 月入职 ⇒ 退税 3577.5(= 9795 已预缴 - 6217.5 应纳)
  await settle(() => page.selectOption('#ps-start-month', '7'));
  const diffTxt = await txt('#ps-settle-diff');
  assert(/退税/.test(diffTxt), `7 月入职应显示退税(得 ${diffTxt}）`);
  near(money(diffTxt), 3577.5, 0.02, '退税金额 3577.5');
  near(await num('#ps-settle-paid'), 9795, 0.02, '已预缴 9795');
  near(await num('#ps-settle-due'), 6217.5, 0.02, '全年应纳 6217.5');
  await settle(() => page.selectOption('#ps-start-month', '1'));

  // 大病医疗 45000 ⇒ 退税 3000
  await settle(() => page.fill('#ps-medical', '45000'));
  near(money(await txt('#ps-settle-diff')), 3000, 0.02, '大病扣除 30000 × 10% ⇒ 退税 3000');
  await settle(() => page.fill('#ps-medical', '0'));

  /* ── 税负曲线 ── */
  await settleDraw(() => page.click('#ps-tab-curve'));
  const crows = await rows('#ps-tbl-curve');
  assert(crows.length === 6, `曲线表 6 行(得 ${crows.length}）`);
  const nets = crows.map((r) => money(r[3]));
  assert(nets.every((v, i) => i === 0 || v > nets[i - 1]), '到手随总包严格递增');
  const keeps = crows.map((r) => money(r[5]));
  assert(keeps.every((v) => v >= 0 && v <= 100), '边际留存率都在 0~100%');
  // 社保封顶后边际留存率回升:最后一行应高于中间某一行
  assert(keeps[keeps.length - 1] > keeps[2], `高薪段边际留存率回升(${keeps[2]}% → ${keeps[keeps.length - 1]}%)`);

  /* ── Offer 对比 ── */
  await settleDraw(() => page.click('#ps-tab-compare'));
  const cmp = await rows('#ps-tbl-compare');
  assert(cmp.length === 6, `对比表 6 行(得 ${cmp.length}）`);
  near(money(cmp[0][1]), 276180, 0.5, '方案 A 全年到手 276180');
  // 方案 B:上海 30000/月 + 年终奖 30000,公积金 7%,专项附加 3500/月
  // 五险一金 = 30000×(8%+2%+0.5%+7%) = 5250;应发 = 390000
  // 综合应税 = 360000 - 60000 - 63000 - 42000 = 195000 → 20% → 22080
  // 年终奖 30000 单独 → 900;合计税 22980;到手 = 390000 - 63000 - 22980 = 304020
  near(money(cmp[0][2]), 304020, 0.5, '方案 B 全年到手 304020(独立手算)');
  near(money(cmp[2][2]), 22980, 0.5, '方案 B 全年个税 22980');
  near(money(cmp[1][2]), 12 * 2100 * 2, 0.5, '方案 B 公积金账户 = 12×(个人 2100 + 单位 2100)');
  const gap = await txt('#ps-cmp-gap');
  assert(/方案 B 多/.test(gap), `结论应判方案 B 更优(得 ${gap}）`);
  // 差额列 = B - A,逐行自洽
  cmp.slice(0, 5).forEach((r, i) => near(money(r[3]), money(r[2]) - money(r[1]), 1, `对比表第 ${i + 1} 行差额自洽`));
  // 差额徽标按「对你是好是坏」着色:多交个税必须是红的,不能因为数值为正就标绿
  const badges = await page.evaluate(() => Array.from(document.querySelectorAll('#ps-tbl-compare tbody tr')).map((tr) => ({
    label: tr.querySelector('td').textContent.trim(),
    cls: tr.querySelector('td:last-child span').className
  })));
  const badgeOf = (label) => (badges.find((b) => b.label === label) || {}).cls;
  assert(/ps-badge--bad/.test(badgeOf('全年个税')), `方案 B 个税更高 ⇒ 红色徽标(得 ${badgeOf('全年个税')}）`);
  assert(!/--bad|--flat/.test(badgeOf('全年到手现金')), `方案 B 到手更高 ⇒ 绿色徽标(得 ${badgeOf('全年到手现金')}）`);
  assert(/ps-badge--bad/.test(badgeOf('公积金账户')), `方案 B 公积金更低 ⇒ 红色徽标(得 ${badgeOf('公积金账户')}）`);
  assert(/--flat/.test(badgeOf('企业总成本')), `企业总成本对你中性 ⇒ 灰色徽标(得 ${badgeOf('企业总成本')}）`);

  /* ── 画布:真的画了东西 + 文字标签零重叠 ── */
  const inkOf = async (sel) => page.evaluate((s) => {
    const c = document.querySelector(s), g = c.getContext('2d');
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i] + d[i + 1] + d[i + 2] < 720) n++;
    return n / (c.width * c.height);
  }, sel);
  for (const [tab, sel] of [['monthly', '#ps-cv-monthly'], ['bonus', '#ps-cv-bonus'], ['curve', '#ps-cv-curve'], ['compare', '#ps-cv-compare']]) {
    await settleDraw(() => page.click('#ps-tab-' + tab));
    const ink = await inkOf(sel);
    assert(ink > 0.02, `${sel} 上有实际笔迹(非白像素占比 ${(ink * 100).toFixed(1)}%)`);
  }
  const placer = await page.evaluate(() => window.__psPlacer);
  for (const key of ['monthly', 'bonus', 'curve', 'compare']) {
    const p = placer[key];
    assert(p && p.drawn.length > 0, `${key} 画布通过 placer 落笔了文字(${p ? p.drawn.length : 0} 段)`);
    for (let i = 0; i < p.drawn.length; i++) {
      for (let j = i + 1; j < p.drawn.length; j++) {
        const a = p.drawn[i], b = p.drawn[j];
        const hit = !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
        assert(!hit, `${key} 画布上「${a.text}」与「${b.text}」文字盒重叠`);
      }
    }
    assert(p.dropped <= 3, `${key} 画布被避让掉的标签不超过 3 个(得 ${p.dropped}）`);
  }

  /* ── 结构守卫 ── */
  // 非当前标签页必须真的不可见(属性为真但视觉未藏 = 2026-07-20 那个 bug 的形态)
  await settleDraw(() => page.click('#ps-tab-monthly'));
  for (const k of ['bonus', 'settle', 'curve', 'compare']) {
    assert((await disp('#ps-panel-' + k)) === 'none', `#ps-panel-${k} 计算样式为 none`);
  }
  assert((await disp('#ps-si-base-wrap')) === 'none', '「自定义基数」输入在按实际工资时隐藏');
  await settle(() => page.selectOption('#ps-si-mode', 'custom'));
  assert((await disp('#ps-si-base-wrap')) !== 'none', '切到自定义基数后该输入显现');
  await settle(() => page.selectOption('#ps-si-mode', 'actual'));

  // 关键控件既不越界也没被压塌
  const boxOK = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.ps-fs input, .ps-fs select, .ps-btn, .ps-tab').forEach((el) => {
      if (el.offsetParent === null) return;
      const r = el.getBoundingClientRect();
      // 数字输入框被浮动 legend 挤成 34px 过,故输入/下拉的下限从严定在 100px
      const min = el.type === 'checkbox' ? 18 : (el.tagName === 'BUTTON' ? 52 : 100);
      if (r.width < min || r.height < 18) out.push([el.id || el.className, r.width, r.height]);
    });
    return out;
  });
  assert(boxOK.length === 0, `所有可见控件宽 ≥40px 高 ≥20px(异常:${JSON.stringify(boxOK)}）`);
  const escaped = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.ps-card, .ps-fs').forEach((box) => {
      const br = box.getBoundingClientRect();
      box.querySelectorAll('input, select, table, canvas').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0) return;
        if (r.left < br.left - 2 || r.right > br.right + 2) out.push(el.id || el.tagName);
      });
    });
    return out;
  });
  assert(escaped.length === 0, `子元素未逃出所在卡片(异常:${escaped.join(',')}）`);

  // 双尺寸零横向溢出
  for (const w of [1280, 390]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForFunction(() => true);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert(over <= 1, `视口宽度下无横向溢出(超出 ${over}px)`);
  }
  await page.setViewportSize({ width: 1280, height: 850 });

  /* ── 方案库 localStorage 往返 ── */
  await settle(() => page.fill('#ps-salary', '48000'));
  await page.fill('#ps-save-name', '测试方案');
  await page.click('#ps-save');
  assert(/已保存/.test(await txt('#ps-save-msg')), '保存方案给出反馈');
  await settle(() => page.fill('#ps-salary', '12000'));
  await page.selectOption('#ps-saved', { label: '测试方案' });
  await settle(() => page.click('#ps-load'));
  assert((await page.inputValue('#ps-salary')) === '48000', '载入方案恢复月薪 48000');
  // 刷新后 current 快照也应恢复
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Number(document.body.dataset.runs || 0) >= 1, null, { timeout: 15000 });
  assert((await page.inputValue('#ps-salary')) === '48000', '刷新后自动恢复上次输入');
  await settle(() => page.fill('#ps-salary', '25000'));

  /* ── CSV 导出:拦下 Blob 读真实内容 ── */
  await page.evaluate(() => {
    window.__csv = null;
    const orig = URL.createObjectURL.bind(URL);
    URL.createObjectURL = (b) => { b.text().then((t) => { window.__csv = t; }); return orig(b); };
    HTMLAnchorElement.prototype.click = function () { /* 阻止真实下载 */ };
  });
  await page.click('#ps-export');
  await page.waitForFunction(() => window.__csv !== null, null, { timeout: 8000 });
  const csv = await page.evaluate(() => window.__csv);
  const lines = csv.trim().split('\n');
  assert(lines.length === 14, `CSV = 表头 + 12 月 + 合计 = 14 行(得 ${lines.length}）`);
  assert(/月份/.test(lines[0]) && /当月到手/.test(lines[0]), 'CSV 表头正确');
  const last = lines[13].split(',');
  near(parseFloat(last[6]), 16320, 0.02, 'CSV 合计行个税 16320');
  near(parseFloat(last[7]), 276180, 0.02, 'CSV 合计行到手 276180');

  /* ── 设计语言守卫:Wise 招牌 lime 药丸 + 24px 圆角 + sage 画布 ── */
  // 断静止态之前必须先离开 hover 并掐掉 transition,否则读到的是 hover 回落途中的中间色
  // (2026-07-22 教训;这里实测读到过 rgb(175,240,133) —— #9fe870 与 #cdffad 之间的插值)
  await page.mouse.move(4, 4);
  await page.addStyleTag({ content: '*{transition:none!important}' });
  const brand = await page.evaluate(() => {
    const btn = document.querySelector('.ps-btn--primary');
    const card = document.querySelector('.ps-card');
    return {
      cta: getComputedStyle(btn).backgroundColor,
      ctaRadius: getComputedStyle(btn).borderRadius,
      cardRadius: getComputedStyle(card).borderRadius,
      page: getComputedStyle(document.body).backgroundColor,
      conv: getComputedStyle(document.querySelector('#ps-conv')).borderColor
    };
  });
  assert(brand.cta === 'rgb(159, 232, 112)', `主 CTA = Wise 绿 #9fe870(得 ${brand.cta}）`);
  assert(brand.ctaRadius === '24px', `CTA 圆角 24px(得 ${brand.ctaRadius}）`);
  assert(brand.cardRadius === '24px', `卡片圆角 24px(得 ${brand.cardRadius}）`);
  assert(brand.page === 'rgb(232, 235, 230)', `页面画布 = sage #e8ebe6(得 ${brand.page}）`);
  assert(brand.conv === 'rgb(14, 15, 12)', `换算卡 1px ink 描边(得 ${brand.conv}）`);

  /* ── 人工过目用的多视图截图(不进 git,.gitignore 已覆盖 view-*.png) ── */
  await settleDraw(() => page.click('#ps-tab-bonus'));
  await page.locator('#ps-panel-bonus').evaluate((el) => el.scrollIntoView({ block: 'start' }));   // 走 scroll-margin-top,躲开 sticky nav
  await screenshot('view-bonus.png');
  await settleDraw(() => page.click('#ps-tab-curve'));
  await page.locator('#ps-panel-curve').evaluate((el) => el.scrollIntoView({ block: 'start' }));   // 走 scroll-margin-top,躲开 sticky nav
  await screenshot('view-curve.png');
  await settleDraw(() => page.click('#ps-tab-compare'));
  await page.locator('#ps-panel-compare').evaluate((el) => el.scrollIntoView({ block: 'start' }));   // 走 scroll-margin-top,躲开 sticky nav
  await screenshot('view-compare.png');
  await showTab('settle');
  await page.locator('#ps-panel-settle').evaluate((el) => el.scrollIntoView({ block: 'start' }));   // 走 scroll-margin-top,躲开 sticky nav
  await screenshot('view-settle.png');
  await settleDraw(() => page.click('#ps-tab-monthly'));
  await page.locator('#ps-panel-monthly').evaluate((el) => el.scrollIntoView({ block: 'start' }));   // 走 scroll-margin-top,躲开 sticky nav
  await screenshot('view-monthly.png');
  await page.setViewportSize({ width: 414, height: 900 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await screenshot('view-narrow.png');
  await page.setViewportSize({ width: 1280, height: 850 });

  /* ── 首页卡片缩略图 ── */
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(() => Number(document.body.dataset.runs || 0) >= 1);
  await screenshot('thumb.png');
}
