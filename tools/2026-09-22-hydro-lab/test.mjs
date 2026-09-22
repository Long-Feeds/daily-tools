/* 供水管网工作台 · 集成测试
 *
 * 真值全部来自 EPANET 2.3 官方引擎（oracle/page_values.py），由 inject_oracle.mjs
 * 机械写入下面的 ORACLE 块；块外一个手打的数都没有。
 */

/* ORACLE-BEGIN */
// 由 oracle/inject_oracle.mjs 从 oracle/page_values.json 机械生成，勿手改。
const ORACLE = {
  "county": {
    "nNodes": 16,
    "nLinks": 20,
    "nJunc": 14,
    "t0": 0,
    "tMid": 32400,
    "nSteps": 61,
    "durationH": 48,
    "p1_hl0": 0.9213459491729736,
    "p1_len": 620,
    "pmin0": 17.734710693359375,
    "pmin0Node": "N10",
    "vmax0": 0.7691728472709656,
    "vmax0Link": "P1",
    "dem0": 69.74387717247009,
    "n1_p0": 26.001941680908203,
    "n10_p0": 17.734710693359375,
    "n13_p0": 28,
    "n10_h0": 56.234710693359375,
    "p1_q0": 96.65763092041016,
    "p1_v0": 0.7691728472709656,
    "ps1_q0": 96.65766906738281,
    "ps1_hl0": -40.0019416809082,
    "prv1_q0": 11.899999618530273,
    "prv1_st0": 2,
    "n13_h0": 40,
    "n14_p0": 30.426725387573242,
    "ps2_st0": 0,
    "n10_pMid": 16.375226974487305,
    "p1_qMid": 177.20220947265625,
    "globMin": 15.350983619689941,
    "globMinNode": "N10",
    "globMinT": 154461,
    "pmin15": 17.689739227294922,
    "pmin15Node": "N10",
    "globMin15": 14.923251152038574,
    "globMin15Node": "N10",
    "dem15": 103.58707523345947,
    "p1dn200_v0": 1.9448055028915405,
    "p1dn200_pmin0": 17.68831443786621,
    "p15closed_q0": 0,
    "p15closed_pmin0": 18.013654708862305,
    "dw_pmin0": 17.699661254882812,
    "dw_n10_p0": 17.699661254882812,
    "ffTarget": 12,
    "ff_n10": 259.4521141052246,
    "ff_n2": 371.48000717163086
  },
  "net1": {
    "nNodes": 11,
    "nLinks": 13,
    "n11_p0": 119.25732421875,
    "p10_q0": 1866.17578125,
    "pump9_q0": 1866.17578125,
    "nSteps": 27
  }
};
/* ORACLE-END */

export default async ({ page, toolURL, screenshot, assert }) => {
  const TABS = ['map', 'nodes', 'links', 'eps', 'check', 'inp', 'doc'];

  const num = (s) => Number(String(s).replace(/[^\d.+\-eE]/g, ''));
  const near = (a, b, tol, msg) =>
    assert(Math.abs(a - b) <= tol, `${msg}：得到 ${a}，期望 ${b}（容差 ${tol}）`);
  const show = async (k) => {
    await page.click(`#hl-t-${k}`);
    await page.waitForFunction((kk) => !document.getElementById('hl-pane-' + kk).hidden, k);
  };
  const cell = async (tblId, rowId, col) => page.evaluate(([t, r, c]) => {
    const rows = [...document.querySelectorAll('#' + t + ' tbody tr')];
    const row = rows.find((x) => x.cells[0] && x.cells[0].textContent.trim() === r);
    return row ? row.cells[c].textContent.trim() : null;
  }, [tblId, rowId, col]);

  await page.goto(toolURL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#hl-map circle, #hl-map rect');

  /* ── 0. 页面骨架 ─────────────────────────────────────── */
  assert(await page.locator('a[href="../../"]').count() > 0, '缺少「返回工具集」链接');
  assert((await page.title()).includes('供水管网'), '标题不对');
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });

  /* ── 1. 首屏就是示范管网，规模与 EPANET 一致（异源核对）──── */
  const sub = await page.textContent('#hl-netsub');
  assert(sub.includes(`${ORACLE.county.nNodes} 个节点`), `节点数不对：${sub}`);
  assert(sub.includes(`${ORACLE.county.nJunc} 个连接节点`), `连接节点数不对：${sub}`);
  assert(sub.includes(`${ORACLE.county.nLinks} 条管段`), `管段数不对：${sub}`);

  /* ── 2. t=0 的读数逐条对 EPANET ───────────────────────── */
  /* 读数瓦片的 dd 里还挂着一行小字说明（「在 N10」这种），数字要单独取第一个文本节点，
   * 否则 num() 会把说明里的「N10」也吃进去（首轮实撞：17.8 被读成 17.81）。*/
  const kpiNum = async (i) => Number(await page.evaluate((n) =>
    document.querySelectorAll('#hl-kpis .hl-kpi')[n].querySelector('dd')
      .childNodes[0].textContent.replace(/[^\d.+\-eE]/g, ''), i));
  const kpi = async (i) => page.evaluate((n) =>
    document.querySelectorAll('#hl-kpis .hl-kpi')[n].querySelector('dd').textContent, i);
  near(await kpiNum(0), ORACLE.county.pmin0, 0.051, '首屏最低服务压力');
  assert((await kpi(0)).includes(ORACLE.county.pmin0Node), '最低压力所在节点不对');
  near(await kpiNum(2), ORACLE.county.vmax0, 0.0051, '首屏最大流速');
  assert((await kpi(2)).includes(ORACLE.county.vmax0Link), '最大流速所在管段不对');
  near(await kpiNum(3), ORACLE.county.dem0, 0.051, '首屏总用水量');

  await show('nodes');
  near(num(await cell('hl-nodetbl', 'N1', 4)), ORACLE.county.n1_p0, 0.0051, 'N1 压力');
  near(num(await cell('hl-nodetbl', 'N10', 4)), ORACLE.county.n10_p0, 0.0051, 'N10 压力');
  near(num(await cell('hl-nodetbl', 'N10', 3)), ORACLE.county.n10_h0, 0.0051, 'N10 总水头');
  /* PRV 把下游节点水头**钉死**在「下游高程 + 设定值」上 —— 这是减压阀的定义式 */
  near(num(await cell('hl-nodetbl', 'N13', 3)), ORACLE.county.n13_h0, 0.005, 'PRV 下游 N13 的总水头');
  near(num(await cell('hl-nodetbl', 'N14', 4)), ORACLE.county.n14_p0, 0.0051, 'N14 压力');

  await show('links');
  near(num(await cell('hl-linktbl', 'P1', 5)), ORACLE.county.p1_q0, 0.0051, 'P1 流量');
  near(num(await cell('hl-linktbl', 'P1', 6)), ORACLE.county.p1_v0, 0.0051, 'P1 流速');
  near(num(await cell('hl-linktbl', 'PS1', 5)), ORACLE.county.ps1_q0, 0.0051, 'PS1 流量');
  near(num(await cell('hl-linktbl', 'PRV1', 5)), ORACLE.county.prv1_q0, 0.0051, 'PRV1 流量');
  assert((await cell('hl-linktbl', 'PRV1', 8)) === '调节中', 'PRV1 应处于调节状态');
  assert((await cell('hl-linktbl', 'PS2', 8)) === '关闭', 'PS2 是备用泵，初始应关闭');
  /* 千米水损：用表里的「管长」列反算回水头损失，与 EPANET 报的水损对拍（异源） */
  const p1len = num(await cell('hl-linktbl', 'P1', 4));
  const p1per = num(await cell('hl-linktbl', 'P1', 7));
  near(p1len, ORACLE.county.p1_len, 0.5, 'P1 的管长');
  // 千米水损只显示 2 位小数 ⇒ 折算回水损后的量化误差是 0.005 × 管长 / 1000
  near(p1per * p1len / 1000, ORACLE.county.p1_hl0, 0.005 * p1len / 1000 + 1e-9,
    'P1 的千米水损 × 管长 应等于 EPANET 报的水头损失');

  /* ── 3. 时刻滑块真的换工况 ───────────────────────────── */
  await show('map');
  await page.locator('#hl-time').fill('12');
  await page.locator('#hl-time').dispatchEvent('input');
  await page.waitForFunction(() => document.getElementById('hl-timelab').textContent.includes('第 13 /'));
  await show('nodes');
  near(num(await cell('hl-nodetbl', 'N10', 4)), ORACLE.county.n10_pMid, 0.0051, 't=10h 时 N10 的压力');
  await show('links');
  near(num(await cell('hl-linktbl', 'P1', 5)), ORACLE.county.p1_qMid, 0.0051, 't=10h 时 P1 的流量');
  await show('map');
  await page.locator('#hl-time').fill('0');
  await page.locator('#hl-time').dispatchEvent('input');
  await page.waitForFunction(() => document.getElementById('hl-timelab').textContent.includes('第 1 /'));

  /* ── 4. 用水量倍率滑块 ─────────────────────────────── */
  await page.locator('#hl-dmult').fill('1.5');
  await page.locator('#hl-dmult').dispatchEvent('input');
  await page.waitForFunction(() => document.getElementById('hl-dmultlab').textContent === '1.50');
  near(await kpiNum(0), ORACLE.county.pmin15, 0.051, '倍率 1.5 时的最低压力');
  // 压力只差 0.03（1 位小数根本分不出来），真正能判「倍率有没有生效」的是总用水量
  near(await kpiNum(3), ORACLE.county.dem15, 0.051, '倍率 1.5 时的系统总用水量');
  assert(Math.abs(ORACLE.county.dem15 - ORACLE.county.dem0) > 20,
    '倍率 1.5 与 1.0 的总用水量差得太小，这条断言分辨不出来');
  await show('check');
  const v15 = await page.textContent('#hl-verdict-sub');
  assert(v15.includes(ORACLE.county.globMin15Node), `倍率 1.5 的最不利节点不对：${v15}`);
  await show('map');
  await page.locator('#hl-dmult').fill('1');
  await page.locator('#hl-dmult').dispatchEvent('input');
  await page.waitForFunction(() => document.getElementById('hl-dmultlab').textContent === '1.00');

  /* ── 5. 改管径：点中 P1 → 改成 DN200 → 全网重算 ─────── */
  await show('links');
  await page.evaluate(() => {
    const rows = [...document.querySelectorAll('#hl-linktbl tbody tr')];
    rows.find((r) => r.cells[0].textContent.trim() === 'P1').click();
  });
  await show('map');
  await page.waitForSelector('#hl-ed-link_P1_diam');
  await page.locator('#hl-ed-link_P1_diam').fill('200');
  await page.locator('#hl-ed-link_P1_diam').dispatchEvent('change');
  await page.waitForFunction(() => document.getElementById('hl-solveinfo').textContent.includes('已改动'));
  await show('links');
  near(num(await cell('hl-linktbl', 'P1', 6)), ORACLE.county.p1dn200_v0, 0.0051, 'P1 换成 DN200 后的流速');
  await show('map');
  near(await kpiNum(0), ORACLE.county.p1dn200_pmin0, 0.051, 'P1 换管后的最低压力');
  await page.click('#hl-reset');
  await page.waitForFunction(() => !document.getElementById('hl-solveinfo').textContent.includes('已改动'));
  near(await kpiNum(0), ORACLE.county.pmin0, 0.051, '还原后最低压力回到原值');

  /* ── 6. 关掉一条管（模拟检修）──────────────────────── */
  await show('links');
  await page.evaluate(() => {
    const rows = [...document.querySelectorAll('#hl-linktbl tbody tr')];
    rows.find((r) => r.cells[0].textContent.trim() === 'P15').click();
  });
  await show('map');
  await page.click('#hl-edit-box button');
  await page.waitForFunction(() => document.getElementById('hl-solveinfo').textContent.includes('已改动'));
  near(await kpiNum(0), ORACLE.county.p15closed_pmin0, 0.051, '关掉 P15 后的最低压力');
  await show('links');
  near(num(await cell('hl-linktbl', 'P15', 5)), ORACLE.county.p15closed_q0, 1e-6, '关掉的管段流量必须报 0');
  /* 页面上 0.00 与 0.000001 印出来一样，所以这条口径要到引擎层断：
   * 关闭管段的 flow/velocity/headloss 必须**恒等于 0**（EPANET 工具箱同口径）。*/
  const closedRaw = await page.evaluate(() => {
    const S = window.HLS, s = S.res.steps[S.tIdx];
    const k = S.net.links.findIndex((l) => l.id === 'P15');
    return { code: s.statusCode[k], flow: s.flow[k], vel: s.velocity[k], hl: s.headloss[k],
             inner: Math.abs(S.res.h.flow[k + 1]) };
  });
  assert(closedRaw.code === 0, `P15 应被判为关闭，实得状态码 ${closedRaw.code}`);
  assert(closedRaw.flow === 0 && closedRaw.vel === 0 && closedRaw.hl === 0,
    `关闭管段的流量/流速/水损必须恒等于 0，实得 ${closedRaw.flow}/${closedRaw.vel}/${closedRaw.hl}`);
  assert(closedRaw.inner > 0, '引擎内部的残余流量应当非零，否则这条口径断言测不出东西');
  await show('map');
  await page.click('#hl-reset');
  await page.waitForFunction(() => !document.getElementById('hl-solveinfo').textContent.includes('已改动'));

  /* ── 7. 换水头损失公式 ─────────────────────────────── */
  await page.selectOption('#hl-formula', '1');
  await page.waitForFunction(() => document.getElementById('hl-netsub').textContent.includes('Darcy-Weisbach'));
  near(await kpiNum(0), ORACLE.county.dw_pmin0, 0.051, '切到 Darcy-Weisbach 后的最低压力');
  await show('nodes');
  near(num(await cell('hl-nodetbl', 'N10', 4)), ORACLE.county.dw_n10_p0, 0.02, 'D-W 下 N10 的压力');
  await show('map');
  await page.selectOption('#hl-formula', '0');
  await page.waitForFunction(() => document.getElementById('hl-netsub').textContent.includes('Hazen-Williams'));

  /* ── 8. 全时段校核（异源：最不利点与时刻都来自 EPANET）── */
  await show('check');
  const verdict = await page.textContent('#hl-verdict-sub');
  assert(verdict.includes(ORACLE.county.globMinNode), `全时段最不利节点不对：${verdict}`);
  const ck2 = await page.evaluate(() =>
    document.querySelectorAll('#hl-checkkpis .hl-kpi')[2].querySelector('dd')
      .childNodes[0].textContent.replace(/[^\d.+\-eE]/g, ''));
  near(Number(ck2), ORACLE.county.globMin, 0.051, '全时段最低压力');

  /* ── 9. 消防流量（EPANET 自己二分出来的真值）────────── */
  await page.selectOption('#hl-ff-node', { label: 'N10' });
  await page.locator('#hl-ff-p').fill(String(ORACLE.county.ffTarget));
  await page.click('#hl-ff-run');
  await page.waitForSelector('#hl-ff-out .hl-plate');
  const ffTxt = await page.textContent('#hl-ff-out .hl-plate div');
  near(num(ffTxt), ORACLE.county.ff_n10, Math.max(0.05, ORACLE.county.ff_n10 * 2e-4), 'N10 的消防流量');
  await page.selectOption('#hl-ff-node', { label: 'N2' });
  await page.click('#hl-ff-run');
  await page.waitForFunction((v) => {
    const el = document.querySelector('#hl-ff-out .hl-plate div');
    return el && Math.abs(Number(el.textContent.replace(/[^\d.+\-]/g, '')) - v) < Math.max(0.05, v * 2e-4);
  }, ORACLE.county.ff_n2);

  /* ── 10. 能耗表在位且自洽 ───────────────────────────── */
  const ekwh = num(await cell('hl-energytbl', 'PS1', 5));
  const epct = num(await cell('hl-energytbl', 'PS1', 1));
  const eavg = num(await cell('hl-energytbl', 'PS1', 3));
  assert(ekwh > 0 && epct > 0 && epct <= 100, `PS1 能耗读数不合理：kWh=${ekwh} 占比=${epct}`);
  /* kWh ≈ 平均功率 × 开机小时数（开机小时 = 占比 × 模拟时长） */
  near(eavg * (epct / 100) * ORACLE.county.durationH, ekwh, Math.max(1, ekwh * 0.02),
    'PS1 的 kWh 应等于平均功率 × 开机占比 × 模拟时长');

  /* ── 11. 延时页三张图都画出来了 ─────────────────────── */
  await show('eps');
  for (const id of ['hl-fig-tank', 'hl-fig-sys', 'hl-fig-pick']) {
    const n = await page.locator(`#${id} path, #${id} line, #${id} text`).count();
    assert(n > 12, `${id} 只画出了 ${n} 个图元`);
  }
  const tankLabel = await page.locator('#hl-fig-tank text').allTextContents();
  assert(tankLabel.join(' ').includes('TK'), '水池水位图没标出 TK');

  /* ── 12. 切到 Net1 示例，规模与读数同样对得上 ────────── */
  await show('inp');
  await page.selectOption('#hl-example', 'net1');
  await page.click('#hl-loadex');
  await page.waitForFunction((n) => document.getElementById('hl-netsub')
    && document.getElementById('hl-netsub').textContent.includes(n + ' 个节点'), ORACLE.net1.nNodes);
  await show('nodes');
  near(num(await cell('hl-nodetbl', '11', 4)), ORACLE.net1.n11_p0, 0.0051, 'Net1 节点 11 的压力');
  await show('links');
  near(num(await cell('hl-linktbl', '10', 5)), ORACLE.net1.p10_q0, 0.0051, 'Net1 管段 10 的流量');
  near(num(await cell('hl-linktbl', '9', 5)), ORACLE.net1.pump9_q0, 0.0051, 'Net1 水泵 9 的流量');

  /* ── 13. 粘一份自己的 INP（走完整解析链路）──────────── */
  await show('inp');
  const tiny = [
    '[JUNCTIONS]', ' J1\t10\t5', ' J2\t8\t7',
    '[RESERVOIRS]', ' R1\t60',
    '[PIPES]', ' L1\tR1\tJ1\t500\t300\t130\t0\tOpen', ' L2\tJ1\tJ2\t400\t250\t130\t0\tOpen',
    '[OPTIONS]', ' Units\tLPS', ' Headloss\tH-W',
    '[TIMES]', ' Duration\t0',
    '[COORDINATES]', ' R1\t0\t0', ' J1\t100\t0', ' J2\t200\t0', '[END]'
  ].join('\n');
  await page.locator('#hl-inp').fill(tiny);
  await page.click('#hl-load');
  await page.waitForFunction(() => document.getElementById('hl-inpstat').textContent.includes('已载入：3 节点'));
  await show('nodes');
  const j2h = num(await cell('hl-nodetbl', 'J2', 3));
  const j1h = num(await cell('hl-nodetbl', 'J1', 3));
  assert(j1h < 60 && j2h < j1h, `自定义管网的水头应沿程递减：R1=60 J1=${j1h} J2=${j2h}`);
  /* Hazen-Williams 定义式回代：h = 10.667·L·Q^1.852 / (C^1.852·D^4.871)，SI 单位。
   * 拿页面上「千米水损」那一列比（它只显示 2 位小数，所以容差取半个最小单位）—— 
   * 不能拿两个 2 位小数的水头相减去比，那样量化误差就有 0.01（首轮实撞）。*/
  await show('links');
  const q2 = num(await cell('hl-linktbl', 'L2', 5)) / 1000;      // L/s → m³/s
  assert(Math.abs(q2 * 1000 - 7) < 1e-3, `L2 应正好输送 J2 的 7 L/s，实得 ${q2 * 1000}`);
  const hlExpect = 10.667 * 400 * Math.pow(q2, 1.852) / (Math.pow(130, 1.852) * Math.pow(0.25, 4.871));
  const per1kShown = num(await cell('hl-linktbl', 'L2', 7));
  near(per1kShown, hlExpect / 400 * 1000, 0.006, 'L2 的千米水损回代 Hazen-Williams 公式');
  assert(j1h - j2h > 0, 'J1 到 J2 的水头必须下降');

  /* ── 14. 导出 INP 再读回来，结果一致（打印器 round-trip）── */
  await show('inp');
  await page.selectOption('#hl-example', 'county');
  await page.click('#hl-loadex');
  await page.waitForFunction((n) => document.getElementById('hl-netsub').textContent.includes(n + ' 条管段'), ORACLE.county.nLinks);
  const before = await page.evaluate(() => {
    const r = window.HLS.res, s = r.steps[0], e = r.steps[r.steps.length - 1];
    return { h: Array.from(s.head), q: Array.from(s.flow), nT: r.t.length,
             tEnd: r.t[r.t.length - 1], hEnd: Array.from(e.head) };
  });
  await page.click('#hl-export');
  await page.waitForFunction(() => document.getElementById('hl-inp').value.indexOf('[JUNCTIONS]') >= 0
    && document.getElementById('hl-inpstat').textContent.includes('已把当前'));
  await page.click('#hl-load');
  await page.waitForFunction((n) => document.getElementById('hl-inpstat').textContent.includes('已载入：' + n + ' 节点'), ORACLE.county.nNodes);
  const after = await page.evaluate(() => {
    const r = window.HLS.res, s = r.steps[0], e = r.steps[r.steps.length - 1];
    return { h: Array.from(s.head), q: Array.from(s.flow), nT: r.t.length,
             tEnd: r.t[r.t.length - 1], hEnd: Array.from(e.head) };
  });
  assert(before.h.length === after.h.length, '导出再载入后节点数变了');
  /* 只比第一个时刻是不够的：模拟时长/时间步写错了，t=0 的解一模一样
   * （2026-09-22 改坏验证实撞：把导出的 Duration 打九折，首刻断言全绿）。*/
  assert(before.nT === after.nT && before.tEnd === after.tEnd,
    `导出再载入后时段数/时长变了：${before.nT}@${before.tEnd} → ${after.nT}@${after.tEnd}`);
  let worstRT = 0;
  for (let i = 0; i < before.h.length; i++) {
    worstRT = Math.max(worstRT, Math.abs(before.h[i] - after.h[i]));
    worstRT = Math.max(worstRT, Math.abs(before.hEnd[i] - after.hEnd[i]));
  }
  assert(worstRT < 1e-3, `导出 INP 再读回来水头变了 ${worstRT}`);

  /* ── 15. 能力清单守卫：说明里列出的每个「支持」段落都必须真被解析过 ── */
  await show('inp');
  const claimed = await page.evaluate(() => [...document.querySelectorAll('#hl-sectbl tbody tr')]
    .filter((r) => r.cells[1].textContent.trim() === '支持')
    .map((r) => r.cells[0].textContent.trim()));
  assert(claimed.length >= 15, `清单里标「支持」的段落只有 ${claimed.length} 条`);
  const dead = await page.evaluate((list) => {
    const nets = window.HL_NETS.map((n) => window.HL.build(n.inp));
    const seen = {};
    const probe = {
      '[TITLE]': (n) => n.title.length > 0,
      '[JUNCTIONS]': (n) => n.njuncs > 0,
      '[RESERVOIRS]': (n) => n.tanks.some((t) => t.a === 0),
      '[TANKS]': (n) => n.tanks.some((t) => t.a > 0),
      '[PIPES]': (n) => n.links.some((l) => l.type <= 1),
      '[PUMPS]': (n) => n.pumps.length > 0,
      '[VALVES]': (n) => n.valves.length > 0,
      '[DEMANDS]': (n) => n.nodes.some((x) => x.demands.length > 1),   // 真的解析出第二类用水才算数
      '[EMITTERS]': (n) => n.nodes.some((x) => x.ke > 0),
      '[STATUS]': (n) => n.links.some((l) => l.initStatus === 2),
      '[PATTERNS]': (n) => n.patterns.length > 0,
      '[CURVES]': (n) => n.curves.length > 0,
      '[CONTROLS]': (n) => n.controls.length > 0,
      '[ENERGY]': (n) => n.opt.ecost > 0 || n.pumps.some((p) => p.ecurve > 0),
      '[TIMES]': (n) => n.times.dur > 0,
      '[OPTIONS]': (n) => !!n.opt.flowUnits,
      '[COORDINATES] [VERTICES] [LABELS]': (n) => Object.keys(n.coords).length > 0
    };
    return list.filter((k) => !probe[k] || !nets.some((n) => probe[k](n)));
  }, claimed);
  assert(dead.length === 0, `清单里广告了、但内置算例里一次都没出现过的段落：${dead.join('、')}`);

  /* ── 16. 结构守卫（这一族历次事故的闸门）───────────── */
  /* 16a. [hidden] 真的把面板藏住（断计算样式，不是断属性） */
  await show('map');
  const hiddenDisplay = await page.evaluate(() => {
    const out = [];
    for (const id of ['hl-pane-nodes', 'hl-pane-links', 'hl-pane-eps', 'hl-pane-check', 'hl-pane-inp', 'hl-pane-doc'])
      out.push([id, getComputedStyle(document.getElementById(id)).display]);
    return out;
  });
  for (const [id, d] of hiddenDisplay) assert(d === 'none', `${id} 的 hidden 没生效，计算样式是 ${d}`);

  /* 16b. 控件最小尺寸：逐页签扫一遍（藏在别的页签里的控件同样会塌缩） */
  let scanned = 0;
  for (const k of TABS) {
    await show(k);
    const bad = await page.evaluate(() => {
      const out = [];
      let n = 0;
      for (const el of document.querySelectorAll('input, select, button, textarea')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;     // 在别的页签里
        n++;
        const tag = el.tagName.toLowerCase();
        const minW = tag === 'button' ? 52 : (el.type === 'range' ? 120 : 100);
        if (r.width < minW || r.height < 18) out.push(`${tag}#${el.id || el.className} ${Math.round(r.width)}×${Math.round(r.height)}`);
      }
      return { out, n };
    });
    scanned += bad.n;
    assert(bad.out.length === 0, `${k} 页有控件被压扁：${bad.out.join(' / ')}`);
  }
  assert(scanned >= 40, `一共只扫到 ${scanned} 个控件，守卫没真的跑起来`);

  /* 16c. 不许用 text-transform:uppercase 改写单位（断计算样式） */
  await show('links');
  const upper = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('th, dt, label, .hl-lab, .hl-badge')) {
      if (!el.getClientRects().length) continue;
      const tt = getComputedStyle(el).textTransform;
      if (tt === 'uppercase' || tt === 'capitalize') out.push(el.textContent.trim().slice(0, 20) + ' → ' + tt);
    }
    return out;
  });
  assert(upper.length === 0, `有标签被 text-transform 改写：${upper.join(' / ')}`);

  /* 16d. 逐视口 × 逐页签：整页不许横向溢出 */
  for (const vw of [390, 768, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const k of TABS) {
      await show(k);
      const info = await page.evaluate(() => {
        const de = document.documentElement;
        const over = de.scrollWidth - de.clientWidth;
        let who = '';
        if (over > 1) {
          let worst = 0;
          for (const el of document.querySelectorAll('body *')) {
            const r = el.getBoundingClientRect();
            if (r.width === 0) continue;
            if (r.right > worst) { worst = r.right; who = el.tagName.toLowerCase() + '.' + (el.className || '') + '@' + Math.round(r.right); }
          }
        }
        return { over, who };
      });
      assert(info.over <= 1, `${vw}px 的「${k}」页横向溢出 ${info.over}px，最右的元素是 ${info.who}`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 1000 });

  /* 16e. 桌面宽度下表格不许被容器裁掉表头 */
  await show('links');
  const clipped = await page.evaluate(() => {
    const out = [];
    for (const w of document.querySelectorAll('.hl-tblwrap')) {
      if (!w.getClientRects().length) continue;
      if (w.scrollWidth - w.clientWidth > 2) out.push(w.scrollWidth + ' vs ' + w.clientWidth);
    }
    return out;
  });
  assert(clipped.length === 0, `1280px 下这些表格仍然横向滚动：${clipped.join(' / ')}`);

  /* 16f. 小格子里的文字不许溢出父格（读数瓦片） */
  await show('map');
  const spill = await page.evaluate(() => {
    const out = [];
    for (const box of document.querySelectorAll('.hl-kpi')) {
      const pb = box.getBoundingClientRect();
      for (const ch of box.querySelectorAll('dt, dd, span')) {
        const r = ch.getBoundingClientRect();
        if (r.width === 0) continue;
        if (r.left < pb.left - 1 || r.right > pb.right + 1 || r.bottom > pb.bottom + 1)
          out.push(ch.textContent.trim().slice(0, 18));
      }
    }
    return out;
  });
  assert(spill.length === 0, `读数瓦片里的文字出格了：${spill.join(' / ')}`);

  /* 16g. SVG 图里的文字两两不相交（避让器真的在干活）——**管网图也算一张图**，
   *      它上面有十几个节点 ID 加注记，是最容易糊成一片的地方 */
  for (const [tab, id] of [['map', 'hl-map'], ['nodes', 'hl-fig-phist'], ['links', 'hl-fig-vh'],
    ['eps', 'hl-fig-tank'], ['eps', 'hl-fig-sys']]) {
    await show(tab);
    const hit = await page.evaluate((figId) => {
      const fig = document.getElementById(figId);
      const boxes = [...fig.querySelectorAll('text')].filter((t) => t.textContent.trim())
        .map((t) => { const b = t.getBBox(); return { b, s: t.textContent.trim(), rot: t.getAttribute('transform') }; })
        .filter((x) => !x.rot);
      const out = [];
      for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i].b, c = boxes[j].b;
        if (a.x < c.x + c.width - 0.5 && c.x < a.x + a.width - 0.5
          && a.y < c.y + c.height - 0.5 && c.y < a.y + a.height - 0.5)
          out.push(boxes[i].s + ' ∩ ' + boxes[j].s);
      }
      return { out, n: boxes.length };
    }, id);
    assert(hit.n > 6, `${id} 只画出 ${hit.n} 段文字`);
    if (id === 'hl-map') {
      // 管网图要真的把大多数节点标出来（避让器不能一言不合就全丢）
      const lab = await page.evaluate(() => ({
        drawn: Number(document.getElementById('hl-map').dataset.labelsDrawn),
        dropped: Number(document.getElementById('hl-map').dataset.labelsDropped)
      }));
      assert(lab.drawn >= ORACLE.county.nNodes - 2,
        `管网图只标出了 ${lab.drawn}/${ORACLE.county.nNodes} 个节点 ID（丢了 ${lab.dropped} 个）`);
    }
    assert(hit.out.length === 0, `${id} 里文字重叠：${hit.out.slice(0, 3).join(' / ')}`);
  }

  /* ── 17. localStorage 与分享码（必须开新 context，否则存储共用会假绿）── */
  await show('map');
  await page.locator('#hl-dmult').fill('1.3');
  await page.locator('#hl-dmult').dispatchEvent('input');
  await page.waitForFunction(() => document.getElementById('hl-dmultlab').textContent === '1.30');
  const code = await page.evaluate(() => window.HLshareCode());
  assert(code.length > 10, '分享码太短');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#hl-map circle');
  assert(await page.textContent('#hl-dmultlab') === '1.30', '刷新后 localStorage 没把倍率带回来');

  const ctx2 = await page.context().browser().newContext();
  const p2 = await ctx2.newPage();
  await p2.goto(toolURL + '#s=' + code, { waitUntil: 'networkidle' });
  await p2.waitForSelector('#hl-map circle');
  assert(await p2.textContent('#hl-dmultlab') === '1.30', '全新浏览器里分享码没还原倍率');
  const p2min = await p2.evaluate(() =>
    document.querySelectorAll('#hl-kpis .hl-kpi')[0].querySelector('dd').textContent);
  assert(p2min.includes(ORACLE.county.pmin0Node), `分享码页面的读数不对：${p2min}`);
  await ctx2.close();

  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { } });
  await page.goto(toolURL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#hl-map circle');
  assert(await page.textContent('#hl-dmultlab') === '1.00', '清掉存储后没回到默认倍率');

  /* ── 18. 零页面错误 + 缩略图 ───────────────────────── */
  assert(errs.length === 0, `页面报错：${errs.slice(0, 3).join(' | ')}`);
  await show('map');
  await page.waitForTimeout(250);
  await screenshot('thumb.png');
};
