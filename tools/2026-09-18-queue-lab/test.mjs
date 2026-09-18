/* 排队与产能工作台 · 浏览器集成测试
 * 断言分三类：①真实交互后的数值结果对拍 oracle（独立方法算出来的）；
 * ②渲染守卫（计算样式 / 渲染尺寸 / 文字避让 / 窄屏溢出）；③能力清单逐项现场跑。
 * ORACLE 块由 oracle/inject_oracle.mjs 机械注入，测试里没有手打的期望值。 */
// ORACLE-BEGIN（由 oracle/inject_oracle.mjs 机械注入，勿手改）
const ORACLE = {
 "cap_default": {
  "c": 19,
  "a": 14.999999999999998,
  "rho": 0.7894736842105263,
  "Pw": 0.24421825065625816,
  "Wq": 10.989821279531615,
  "sl20": 0.8434120471825364,
  "Lq": 0.9158184399609678,
  "L": 15.915818439960963,
  "thrPerAgent": 15.789473684210526,
  "c_minus1_sl": 0.7410926002798456
 },
 "cap_triage": {
  "c": 5,
  "a": 3.6,
  "rho": 0.683930127124945,
  "Pw": 0.3344401631801699,
  "Pab": 0.050097045659798486,
  "Wq": 90.17468218763729,
  "sl600": 0.9200915415611975,
  "Lq": 0.45087341093818645
 },
 "cap_trunk": {
  "c": 50,
  "a": 37.5,
  "block": 0.00873967360107352,
  "block_minus1": 0.01175563857891668,
  "rho": 0.7434452447991948
 },
 "model_mmc": {
  "a": 9,
  "rho": 0.9,
  "Pw": 0.6687315241076971,
  "L": 15.018583716969273,
  "Lq": 6.018583716969274,
  "W": 1.668731524107697,
  "Wq": 0.6687315241076971,
  "lamServed": 9
 },
 "net_open": {
  "lam": [
   30,
   100,
   70
  ],
  "nodes": [
   {
    "lam": 30,
    "rho": 0.25,
    "L": 0.3333333333333333,
    "W": 0.01111111111111111,
    "Pw": 0.25
   },
   {
    "lam": 100,
    "rho": 0.8333333333333334,
    "L": 6.01123595505618,
    "W": 0.0601123595505618,
    "Pw": 0.7022471910112358
   },
   {
    "lam": 70,
    "rho": 0.7777777777777778,
    "L": 3.5000000000000004,
    "W": 0.05000000000000001,
    "Pw": 0.7777777777777779
   }
  ],
  "L": 9.844569288389513,
  "W": 0.32815230961298375,
  "bottleneck": 1
 },
 "net_closed": {
  "X": 14.119146788877309,
  "R": 0.4165161889070833,
  "Q": [
   0.20256160436046777,
   3.4042203493845387,
   2.2740712573778814
  ],
  "U": [
   0.1694297614665281,
   0.8471488073326298,
   0.7412552064160496
  ],
  "D": [
   0.012,
   0.06,
   0.052500000000000005
  ],
  "Dsum": 0.1245,
  "Dmax": 0.06,
  "Nstar": 18.741666666666667,
  "Xheavy": 16.666666666666668,
  "bottleneck": 1
 },
 "net_closed_c2": {
  "X": 14.132800349029335,
  "R": 0.41514770647514987,
  "Q": [
   0.17071398754141612,
   3.4159735517049885,
   2.2805121117242693
  ],
  "U": [
   0.0847968020941761,
   0.8479680209417596,
   0.7419720183240399
  ],
  "c": [
   2,
   1,
   1
  ],
  "D": [
   0.012,
   0.06,
   0.052500000000000005
  ],
  "Dmax": 0.06,
  "Nstar": 18.741666666666667
 },
 "shift": {
  "req": [
   3,
   3,
   5,
   6,
   8,
   8,
   8,
   6,
   5,
   4,
   5,
   6,
   8,
   9,
   10,
   9,
   8,
   6,
   5,
   3,
   3,
   3,
   2,
   2
  ],
  "staffed": [
   5,
   5,
   8,
   9,
   12,
   12,
   12,
   9,
   8,
   6,
   8,
   9,
   12,
   13,
   15,
   13,
   12,
   9,
   8,
   5,
   5,
   5,
   3,
   3
  ],
  "sl": [
   0.9370287629584584,
   0.8262414392121507,
   0.9200738969817435,
   0.840722190457162,
   0.8861150686027144,
   0.8235565625782101,
   0.8861150686027144,
   0.8196057564469229,
   0.8676841960594068,
   0.8046261360908054,
   0.8870547285593429,
   0.840722190457162,
   0.8722532980889,
   0.8109227665891842,
   0.8618579908725029,
   0.8109227665891842,
   0.8722532980889,
   0.840722190457162,
   0.9200738969817435,
   0.8262414392121507,
   0.914937392380742,
   0.9554629284878295,
   0.8396523782701996,
   0.8396523782701996
  ],
  "occ": [
   0.31111111111111106,
   0.4666666666666667,
   0.4666666666666666,
   0.6027777777777777,
   0.6124999999999999,
   0.6708333333333333,
   0.6124999999999999,
   0.6222222222222221,
   0.5366666666666666,
   0.5541666666666666,
   0.5133333333333333,
   0.6027777777777777,
   0.6270833333333333,
   0.7,
   0.6766666666666666,
   0.7,
   0.6270833333333333,
   0.6027777777777777,
   0.4666666666666666,
   0.4666666666666667,
   0.35,
   0.2722222222222222,
   0.35,
   0.35
  ],
  "totalCalls": 671,
  "agentHours": 67.5,
  "staffedHours": 103,
  "shiftsOpt": 30,
  "coverSlots": 240,
  "reqSlots": 206,
  "peak": 15,
  "peakIdx": 14
 }
};
// ORACLE-END

const TABS = ['cap', 'model', 'net', 'sim', 'shift', 'notes'];

export default async ({ page, toolURL, screenshot, assert }) => {
  const near = (a, b, tol, msg) =>
    assert(Math.abs(a - b) <= tol, `${msg}：${a} vs ${b}（容差 ${tol}）`);
  const relNear = (a, b, r, msg) =>
    assert(Math.abs(a - b) <= Math.abs(b) * r + 1e-12, `${msg}：${a} vs ${b}（相对 ${r}）`);
  /* 百分数读数的容差不能拍脑袋，只能由**页面实际显示的位数**定：半个最小显示单位。
   * （2026-09-09 教训的配套：容差下界 = 显示位数的半个最小单位。） */
  const pctNear = async (sel, truth, msg) => {
    const raw = (await page.textContent(sel)).trim();
    const dec = ((raw.replace('%', '').split('.')[1]) || '').length;
    const tol = 0.5 * Math.pow(10, -dec) / 100;
    near(parseFloat(raw) / 100, truth, tol + 1e-12, `${msg}（页面显示 ${raw}，容差 ${tol}）`);
  };
  /* 普通数字读数：容差同样由显示位数定（Lq 显示「0.92」时，半个最小单位是 0.005）。 */
  const numNear = async (sel, truth, msg) => {
    const raw = (await page.textContent(sel)).trim().replace(/,/g, '');
    const dec = ((raw.split(' ')[0].split('.')[1]) || '').replace(/[^\d]/g, '').length;
    const tol = 0.5 * Math.pow(10, -dec);
    near(parseFloat(raw), truth, tol + 1e-12, `${msg}（页面显示 ${raw}，容差 ${tol}）`);
  };
  /* 时长读数同理：「11.0 秒」的半个最小单位是 0.05 秒，「350 毫秒」是 0.5 毫秒。 */
  const tsNear = async (sel, truth, msg) => {
    const raw = (await page.textContent(sel)).trim();
    const unit = raw.includes('毫秒') ? 1e-3 : (raw.includes('分钟') ? 60 : (raw.includes('小时') ? 3600 : 1));
    const dec = ((raw.split(' ')[0].split('.')[1]) || '').length;
    const tol = 0.5 * Math.pow(10, -dec) * unit;
    near(parseFloat(raw) * unit, truth, tol + 1e-12, `${msg}（页面显示 ${raw}，容差 ${tol} 秒）`);
  };
  const numOf = async (sel) => {
    const t = await page.textContent(sel);
    const m = String(t).replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : NaN;
  };
  const showTab = async (t) => {
    await page.click(`#ql-tabbar .ql-chip[data-tab="${t}"]`);
    await page.waitForFunction((tt) => !document.getElementById('ql-pane-' + tt).hidden, t);
    await page.waitForTimeout(60);
  };

  await page.goto(toolURL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.QL && window.QLA && document.getElementById('ql-c-answer').textContent !== '—');

  // ───────── ① 骨架 ─────────
  assert((await page.title()).includes('Queue Lab'), '标题应含 Queue Lab');
  assert(await page.getAttribute('.ql-back', 'href') === '../../', '返回工具集链接指向 ../../');
  assert((await page.textContent('.ql-back')).includes('返回工具集'), '返回工具集文案');
  assert((await page.$$('#ql-tabbar .ql-chip')).length === TABS.length, `应有 ${TABS.length} 个页签`);

  // ───────── ② 容量页：默认工况 ─────────
  const c0 = await numOf('#ql-c-answer');
  assert(c0 === ORACLE.cap_default.c, `默认工况所需坐席 ${c0} 应为 ${ORACLE.cap_default.c}（独立 Erlang C 扫描）`);
  relNear(await numOf('#ql-c-a'), ORACLE.cap_default.a, 1e-3, '话务量 a');
  await pctNear('#ql-c-occ', ORACLE.cap_default.rho, '坐席占用率');
  await pctNear('#ql-c-pw', ORACLE.cap_default.Pw, '等待概率');
  await pctNear('#ql-c-sl', ORACLE.cap_default.sl20, '服务水平 SL(20s)');
  await numNear('#ql-c-lq', ORACLE.cap_default.Lq, '平均排队人数');
  await tsNear('#ql-c-asa', ORACLE.cap_default.Wq, '平均应答 ASA');
  { const sub = await page.textContent('#ql-c-answer-sub');
    const staff = Math.ceil(ORACLE.cap_default.c / 0.7);
    assert(sub.includes(String(staff) + ' 人上岗'), `收缩率折算后应是 ${staff} 人上岗，实际文案：${sub}`); }
  // 边际效益表：选中行必须是答案那一行，且少一个坐席必须未达标
  { const picked = await page.textContent('#ql-c-tbody tr.ql-pick td');
    assert(parseInt(picked, 10) === ORACLE.cap_default.c, `高亮行应是 ${ORACLE.cap_default.c} 席，实为 ${picked}`);
    const rows = await page.$$eval('#ql-c-tbody tr', (trs) => trs.map((tr) =>
      Array.from(tr.children).map((td) => td.textContent.trim())));
    const prev = rows.find((r) => parseInt(r[0], 10) === ORACLE.cap_default.c - 1);
    assert(prev && prev[6] === '未达标', `少一席（${ORACLE.cap_default.c - 1}）必须标未达标`);
    { const dec = ((prev[1].replace('%', '').split('.')[1]) || '').length;
      near(parseFloat(prev[1]) / 100, ORACLE.cap_default.c_minus1_sl, 0.5 * Math.pow(10, -dec) / 100 + 1e-12,
        `少一席时的服务水平（显示 ${prev[1]}）`); }
    const nxt = rows.find((r) => parseInt(r[0], 10) === ORACLE.cap_default.c);
    assert(nxt[6] === '达标', '答案那一行必须标达标'); }
  // hero 里的三个读数要跟着算例走
  assert(parseInt(await page.textContent('#ql-hero-c'), 10) === ORACLE.cap_default.c, 'hero 的坐席数');
  assert((await page.$$('#ql-heroFig rect')).length > 10, 'hero 示意图应画出服务台方块');

  // ───────── ③ 容量页：换模型（Erlang B / Erlang A） ─────────
  await page.selectOption('#ql-c-preset', 'trunk');
  await page.waitForFunction((c) => document.getElementById('ql-c-answer').textContent.indexOf(String(c)) === 0,
    ORACLE.cap_trunk.c);
  assert(await numOf('#ql-c-answer') === ORACLE.cap_trunk.c, `中继线（Erlang B）应为 ${ORACLE.cap_trunk.c} 条`);
  await pctNear('#ql-c-ab', ORACLE.cap_trunk.block, 'Erlang B 阻塞率');
  assert((await page.textContent('#ql-c-asa')) === '—', 'Erlang B 无队列，平均应答应显示为「—」');
  assert(await page.$eval('#ql-c-patience', (e) => e.disabled), '非 Erlang A 时耐心输入应禁用');

  await page.selectOption('#ql-c-preset', 'triage');
  await page.waitForFunction((c) => document.getElementById('ql-c-answer').textContent.indexOf(String(c)) === 0,
    ORACLE.cap_triage.c);
  assert(await numOf('#ql-c-answer') === ORACLE.cap_triage.c, `急诊分诊（Erlang A）应为 ${ORACLE.cap_triage.c} 个诊位`);
  await pctNear('#ql-c-ab', ORACLE.cap_triage.Pab, 'Erlang A 放弃率');
  await pctNear('#ql-c-sl', ORACLE.cap_triage.sl600, 'Erlang A 服务水平');
  assert(!(await page.$eval('#ql-c-patience', (e) => e.disabled)), 'Erlang A 时耐心输入应可用');
  // 非法输入必须给出提示而不是崩掉
  await page.selectOption('#ql-c-preset', 'hotline');
  await page.fill('#ql-c-calls', '0');
  await page.waitForFunction(() => document.getElementById('ql-c-answer').textContent === '—');
  assert((await page.getAttribute('#ql-c-note', 'class')).includes('ql-warn'), '零到达量应给出警告样式');
  await page.fill('#ql-c-calls', '300');
  await page.waitForFunction((c) => document.getElementById('ql-c-answer').textContent.indexOf(String(c)) === 0,
    ORACLE.cap_default.c);
  await screenshot('thumb.png');

  // ───────── ④ 模型页 ─────────
  await showTab('model');
  await page.waitForFunction(() => document.getElementById('ql-m-wq').textContent !== '—');
  await pctNear('#ql-m-rho', ORACLE.model_mmc.rho, 'M/M/10 利用率');
  await pctNear('#ql-m-pw', ORACLE.model_mmc.Pw, 'M/M/10 等待概率');
  await numNear('#ql-m-lq', ORACLE.model_mmc.Lq, 'M/M/10 平均队长');
  await numNear('#ql-m-l', ORACLE.model_mmc.L, 'M/M/10 系统内人数');
  await tsNear('#ql-m-wq', ORACLE.model_mmc.Wq, 'M/M/10 平均等待');
  assert((await page.textContent('#ql-m-little')).includes('Little 定律自检'), '模型页要现场核对 Little 定律');
  assert((await page.$$('#ql-fig-dist rect')).length >= 6, '生灭模型应画出队长分布柱');
  { const bars = await page.$$eval('#ql-fig-dist rect', (rs) => rs.map((r) => +r.getAttribute('height')));
    assert(bars.filter((h) => h > 2).length >= 5, '分布柱应有实际高度，不能全是 0 高'); }
  // 切到 M/M/∞：无等待
  await page.selectOption('#ql-m-model', 'mminf');
  await page.waitForFunction(() => parseFloat(document.getElementById('ql-m-pw').textContent) === 0
    && document.getElementById('ql-m-rho').textContent === '不适用');
  assert(parseFloat(await page.textContent('#ql-m-wq')) === 0, 'M/M/∞ 不应有等待');
  { // M/M/∞ 的 L 必须精确等于 a = λ/μ；λ、μ 从页面输入框现场读，不写死
    const lamv = parseFloat(await page.$eval('#ql-mf-lam', (e) => e.value));
    const muv = parseFloat(await page.$eval('#ql-mf-mu', (e) => e.value));
    relNear(await numOf('#ql-m-l'), lamv / muv, 1e-6, `M/M/∞ 的 L 应等于 a = ${lamv}/${muv}`); }
  // 切到优先级：守恒律与排序无关
  await page.selectOption('#ql-m-model', 'mg1p');
  await page.waitForFunction(() => !document.getElementById('ql-m-prio').hidden);
  await page.waitForFunction(() => document.querySelectorAll('#ql-m-priotbody tr').length >= 2);
  const consOf = async () => {
    const t = await page.textContent('#ql-m-conserve');
    return t.match(/=\s*(-?[\d.]+)/g).map((x) => parseFloat(x.replace(/[^\d.-]/g, '')));
  };
  const [c1a, c1b] = await consOf();
  relNear(c1a, c1b, 1e-6, '守恒律：实测和 vs 理论值 ρ·W₀/(1−ρ)');
  // 把两类的参数对调（等价于换优先级顺序），守恒的那个和不许变
  const rows0 = await page.$$eval('#ql-m-classes tr', (trs) => trs.map((tr) =>
    Array.from(tr.querySelectorAll('input')).map((i) => i.value)));
  for (const [k, cls] of [[0, 'lam'], [1, 'ES'], [2, 'cs2']]) {
    await page.fill(`#ql-m-classes tr:nth-child(1) input.ql-cls-${cls}`, rows0[1][k]);
    await page.fill(`#ql-m-classes tr:nth-child(2) input.ql-cls-${cls}`, rows0[0][k]);
  }
  await page.waitForTimeout(120);
  const [c2a] = await consOf();
  relNear(c2a, c1a, 1e-6, '交换两类优先级后，Σρ_k·Wq_k 必须不变（守恒律）');
  /* 抢占式分支在浏览器侧原本一步都没跑到（改坏它也不红）。这里点开开关，
   * 断两条不依赖任何实现的性质：抢占让高优先级更快、低优先级更慢。 */
  const prioWq = async () => page.$$eval('#ql-m-priotbody tr', (trs) => trs.map((tr) => tr.children[4].textContent.trim()));
  const toSec = (x) => parseFloat(x) * (x.includes('毫秒') ? 1e-3 : (x.includes('分钟') ? 60 : 1));
  const nonPre = (await prioWq()).map(toSec);
  await page.click('#ql-m-preempt');
  await page.waitForFunction(() => document.getElementById('ql-m-preempt').getAttribute('aria-pressed') === 'true');
  await page.waitForTimeout(150);
  const pre = (await prioWq()).map(toSec);
  assert(pre[0] < nonPre[0] * (1 - 1e-9),
    `抢占式下最高优先级的等待 ${pre[0]} 必须严格短于非抢占 ${nonPre[0]}`);
  assert(pre[1] > nonPre[1] * (1 + 1e-9),
    `抢占式下低优先级的等待 ${pre[1]} 必须严格长于非抢占 ${nonPre[1]}`);
  await page.click('#ql-m-preempt');
  await page.waitForFunction(() => document.getElementById('ql-m-preempt').getAttribute('aria-pressed') === 'false');

  // ───────── ⑤ 网络页 ─────────
  await showTab('net');
  await page.waitForFunction(() => document.querySelectorAll('#ql-n-tbody tr').length === 3);
  { const rows = await page.$$eval('#ql-n-tbody tr', (trs) => trs.map((tr) =>
      Array.from(tr.children).map((td) => td.textContent.trim())));
    for (let i = 0; i < 3; i++) {
      const dtol = (raw) => 0.5 * Math.pow(10, -(((String(raw).split('.')[1]) || '').replace(/[^\d]/g, '').length));
      near(parseFloat(rows[i][1]), ORACLE.net_open.lam[i], dtol(rows[i][1]) + 1e-12, `节点 ${i + 1} 到达率（流量方程，显示 ${rows[i][1]}）`);
      near(parseFloat(rows[i][2]) / 100, ORACLE.net_open.nodes[i].rho, dtol(rows[i][2]) / 100 + 1e-12, `节点 ${i + 1} 利用率（显示 ${rows[i][2]}）`);
      near(parseFloat(rows[i][3]), ORACLE.net_open.nodes[i].L, dtol(rows[i][3]) + 1e-12, `节点 ${i + 1} 平均队长（显示 ${rows[i][3]}）`);
    }
    const picked = await page.$$eval('#ql-n-tbody tr.ql-pick td:first-child', (t) => t.map((x) => x.textContent));
    assert(picked.length === 1, '应恰好高亮一个瓶颈节点');
    assert((await page.textContent('#ql-n-note')).includes('瓶颈'), '结论文案应指出瓶颈'); }
  assert((await page.$$('#ql-fig-net rect')).length >= 6, '网络图应画出节点方块');
  // 把瓶颈节点的台数改小 → 必须判为不稳定并给出警告，而不是算出负数
  await page.fill('#ql-n-nodes tr:nth-child(2) td:nth-child(3) input', '2');
  await page.waitForFunction(() => document.getElementById('ql-n-note').className.includes('ql-warn'));
  assert((await page.textContent('#ql-n-note')).includes('不稳定'), '过载节点应报不稳定');
  await page.fill('#ql-n-nodes tr:nth-child(2) td:nth-child(3) input', '3');
  await page.waitForFunction(() => !document.getElementById('ql-n-note').className.includes('ql-warn'));
  // 闭合网络
  await page.click('#ql-n-seg .ql-chip[data-nettab="closed"]');
  await page.waitForFunction(() => !document.getElementById('ql-n-closed').hidden);
  await page.waitForFunction(() => document.getElementById('ql-k-X').textContent !== '—');
  await numNear('#ql-k-X', ORACLE.net_closed.X, '闭网络吞吐量（对拍多维精确 CTMC）');
  await tsNear('#ql-k-R', ORACLE.net_closed.R, '闭网络响应时间');
  await numNear('#ql-k-Nstar', ORACLE.net_closed.Nstar, '拐点并发 N*');
  { const rows = await page.$$eval('#ql-k-tbody tr', (trs) => trs.map((tr) =>
      Array.from(tr.children).map((td) => td.textContent.trim())));
    assert(rows.length === 3, '闭网络应有 3 个站');
    for (let i = 0; i < 3; i++) {
      const dec = ((rows[i][2].replace('%', '').split('.')[1]) || '').length;
      near(parseFloat(rows[i][2]) / 100, ORACLE.net_closed.U[i], 0.5 * Math.pow(10, -dec) / 100 + 1e-12,
        `站 ${i + 1} 利用率（显示 ${rows[i][2]}）`);
    }
    assert((await page.textContent('#ql-k-bn')) === '磁盘 A', '瓶颈站应是需求最大的磁盘 A'); }
  assert((await page.$$('#ql-fig-mvax path')).length >= 3, 'MVA 图应画出曲线与两条渐近界');
  /* 多服务台站：精确 MVA 的边际概率修正项只在 c>1 时进入计算，默认示例全是 c=1，
   * 把那一段整个抹掉页面也不会变（实测改坏不红）。这里把第一个站改成 2 台补上覆盖。 */
  await page.fill('#ql-k-stations tr:nth-child(1) td:nth-child(4) input', '2');
  await page.waitForFunction((x) => Math.abs(parseFloat(document.getElementById('ql-k-X').textContent) - x) < 0.01,
    Math.round(ORACLE.net_closed_c2.X * 1000) / 1000);
  await numNear('#ql-k-X', ORACLE.net_closed_c2.X, '多服务台闭网络吞吐量（对拍多维精确 CTMC）');
  { const rows = await page.$$eval('#ql-k-tbody tr', (trs) => trs.map((tr) =>
      Array.from(tr.children).map((td) => td.textContent.trim())));
    for (let i = 0; i < 3; i++) {
      const dec = ((rows[i][2].replace('%', '').split('.')[1]) || '').length;
      near(parseFloat(rows[i][2]) / 100, ORACLE.net_closed_c2.U[i], 0.5 * Math.pow(10, -dec) / 100 + 1e-12,
        `CPU 改成 2 台后，站 ${i + 1} 利用率（显示 ${rows[i][2]}）`);
    } }
  await page.fill('#ql-k-stations tr:nth-child(1) td:nth-child(4) input', '1');
  await page.waitForFunction((x) => Math.abs(parseFloat(document.getElementById('ql-k-X').textContent) - x) < 0.01,
    Math.round(ORACLE.net_closed.X * 1000) / 1000);

  // ───────── ⑥ 仿真页 ─────────
  await showTab('sim');
  await page.click('#ql-s-run');
  await page.waitForFunction(() => document.querySelectorAll('#ql-s-tbody tr').length > 3, null, { timeout: 60000 });
  const simRows = async () => page.$$eval('#ql-s-tbody tr', (trs) => trs.map((tr) =>
    Array.from(tr.children).map((td) => td.textContent.trim())));
  const S1 = await simRows();
  assert((await page.textContent('#ql-s-status')).includes('M/M/c'), '默认参数应自动配上 M/M/c 解析解');
  { // 解析列必须等于独立算出来的真值
    const wqTh = parseFloat(S1[0][3]) * (S1[0][3].includes('毫秒') ? 1e-3 : 1);
    relNear(wqTh, ORACLE.model_mmc.Wq, 2e-2, '仿真页展示的解析 Wq');
    const lqTh = parseFloat(S1[1][3]);
    relNear(lqTh, ORACLE.model_mmc.Lq, 1e-2, '仿真页展示的解析 Lq');
    // 仿真实测：批均值 95% 区间放宽一倍后必须罩住理论值（这是统计检验，不是魔数）
    const ci = S1[0][2].match(/-?[\d.]+/g).map(Number);
    const mid = (ci[0] + ci[1]) / 2, half = (ci[1] - ci[0]) / 2;
    assert(Math.abs(mid - ORACLE.model_mmc.Wq) <= 2 * half + 1e-9,
      `仿真 Wq 的批均值区间 [${ci}] 放宽一倍后应罩住解析值 ${ORACLE.model_mmc.Wq}`);
    // 利用率与 Little 自检
    relNear(parseFloat(S1[3][1]) / 100, ORACLE.model_mmc.rho, 2e-2, '仿真实测利用率');
    const little = S1[S1.length - 1];
    assert(parseFloat(little[4]) < 0.5, `仿真内部 Little 定律相对差应 < 0.5%，实为 ${little[4]}`); }
  /* 直方图上的解析曲线必须逐格对得上实测柱（初稿第一格把「无需等待」那块原子质量减掉了，
   * 解析线 0.065 vs 实测柱 0.40，全部 DOM 断言照样绿，只有人工看图才发现）。 */
  { const cmp = await page.evaluate(() => {
      const st = QLA.simState(); const s = st.s, th = st.an.r;
      const bw = s.histMax / 40, tot = s.hist.reduce((a, b) => a + b, 0);
      const out = [];
      for (let i = 0; i < 12; i++) {
        const exp = th.slAt((i + 1) * bw) - (i === 0 ? 0 : th.slAt(i * bw));
        out.push([s.hist[i] / tot, exp]);
      }
      return out;
    });
    let worst = 0;
    for (const [obs, exp] of cmp) worst = Math.max(worst, Math.abs(obs - exp));
    assert(worst < 0.01, `直方图前 12 格里，实测与解析最大差 ${worst.toFixed(4)}（应 < 0.01）：${JSON.stringify(cmp.slice(0, 3))}`); }
  /* 上面那条只验了「理论 vs 仿真」，验不到**画出来的那条红线**是不是同一件事
   * （改坏绘制代码它照样绿 —— 实测）。这里直接比几何：红线的顶点必须落在对应柱子的顶上。 */
  { const geo = await page.evaluate(() => {
      const svg = document.getElementById('ql-fig-hist');
      const path = svg.querySelector('path[stroke="#d30005"]');
      if (!path) return { err: '没找到解析解的红线' };
      const pts = path.getAttribute('d').trim().split(/[ML]/).filter(Boolean)
        .map((p) => p.trim().split(/\s+/).map(Number));
      const rects = Array.from(svg.querySelectorAll('rect'))
        .map((r) => ({ cx: +r.getAttribute('x') + +r.getAttribute('width') / 2, y: +r.getAttribute('y') }));
      const out = [];
      for (const [px, py] of pts.slice(0, 8)) {
        const m = rects.filter((r) => Math.abs(r.cx - px) < 1.5)[0];
        if (m) out.push([Math.round(px), Math.round(py), Math.round(m.y)]);
      }
      return { out };
    });
    assert(!geo.err, geo.err || '');
    assert(geo.out.length >= 5, `只对上了 ${geo.out.length} 个柱子与红线顶点`);
    let dmax = 0;
    for (const [, py, ry] of geo.out) dmax = Math.max(dmax, Math.abs(py - ry));
    assert(dmax <= 8, `红线顶点与柱顶最大偏 ${dmax}px（应 ≤ 8）：${JSON.stringify(geo.out)}`); }
  assert((await page.$$('#ql-fig-trace path')).length >= 1, '应画出系统内人数轨迹');
  assert((await page.$$('#ql-fig-hist rect')).length >= 8, '等待时长直方图应有柱子');
  // 固定种子 ⇒ 可复现
  await page.click('#ql-s-run');
  await page.waitForTimeout(400);
  const S2 = await simRows();
  assert(JSON.stringify(S1) === JSON.stringify(S2), '同一种子重跑必须逐位一致（结果可复现）');
  // 换种子 ⇒ 结果应当变化（否则说明种子根本没接上）
  await page.fill('#ql-s-seed', '424242');
  await page.click('#ql-s-run');
  await page.waitForTimeout(600);
  const S3 = await simRows();
  assert(S3[0][1] !== S1[0][1], '换种子后仿真结果应当不同');
  await page.fill('#ql-s-seed', '20260918');

  // ───────── ⑦ 排班页 ─────────
  await showTab('shift');
  await page.waitForFunction(() => document.querySelectorAll('#ql-w-tbody tr').length === 24);
  { const rows = await page.$$eval('#ql-w-tbody tr', (trs) => trs.map((tr) =>
      Array.from(tr.children).map((td) => td.textContent.trim())));
    const req = rows.map((r) => parseInt(r[3], 10));
    const staffed = rows.map((r) => parseInt(r[4], 10));
    assert(JSON.stringify(req) === JSON.stringify(ORACLE.shift.req),
      `逐时段需求席应与独立 Erlang C 扫描逐格一致：${req} vs ${ORACLE.shift.req}`);
    assert(JSON.stringify(staffed) === JSON.stringify(ORACLE.shift.staffed), '逐时段上岗人数');
    for (let i = 0; i < 24; i++) if (ORACLE.shift.sl[i] < 1) {
      const dec = ((rows[i][5].replace('%', '').split('.')[1]) || '').length;
      near(parseFloat(rows[i][5]) / 100, ORACLE.shift.sl[i], 0.5 * Math.pow(10, -dec) / 100 + 1e-12,
        `第 ${i + 1} 段服务水平（显示 ${rows[i][5]}）`);
    } }
  { const sh = await page.$$eval('#ql-w-shifts tr', (trs) => trs.map((tr) =>
      Array.from(tr.children).map((td) => td.textContent.trim())));
    const total = sh.reduce((a, r) => a + (parseInt(r[3], 10) || 0), 0);
    assert(total === ORACLE.shift.shiftsOpt,
      `班次总人数 ${total} 应等于 MILP 最优解 ${ORACLE.shift.shiftsOpt}`);
    assert((await page.textContent('#ql-w-summary')).includes(String(ORACLE.shift.shiftsOpt) + ' 个班次'),
      '结论文案要写出最优班次数'); }
  // 覆盖必须处处不低于需求（可行性）
  { const cov = await page.evaluate(() => {
      const s = QLA.shiftState();
      return { cover: s.cov.cover, req: s.plan.rows.map((r) => r.staff || 0) };
    });
    for (let i = 0; i < cov.req.length; i++)
      assert(cov.cover[i] >= cov.req[i], `第 ${i + 1} 段覆盖 ${cov.cover[i]} 不得低于需求 ${cov.req[i]}`); }
  // 班次变长 ⇒ 班次数不增（同一需求下，更长的班更容易盖住）
  { const before = await page.evaluate(() => QLA.shiftState().cov.total);
    await page.fill('#ql-w-shiftlen', '8');
    await page.waitForTimeout(200);
    const after = await page.evaluate(() => QLA.shiftState().cov.total);
    assert(after <= before, `班次拉长后班次数 ${after} 不应多于 ${before}`);
    await page.fill('#ql-w-shiftlen', '4');
    await page.waitForTimeout(200); }
  assert((await page.$$('#ql-fig-cover path')).length >= 2, '覆盖图应画出需求与覆盖两条阶梯');

  // ───────── ⑧ 说明页：能力清单逐项现场跑 ─────────
  await showTab('notes');
  { const listed = await page.$$eval('#ql-model-tbody tr', (trs) => trs.map((tr) =>
      Array.from(tr.children).map((td) => td.textContent.trim())));
    const reg = await page.evaluate(() => QL.MODELS.map((m) => [m.name, m.id, m.src]));
    assert(listed.length === reg.length, `清单行数 ${listed.length} 应等于引擎注册的 ${reg.length} 个模型`);
    for (let i = 0; i < reg.length; i++) {
      assert(listed[i][0] === reg[i][0], `第 ${i + 1} 行模型名应为 ${reg[i][0]}`);
      assert(listed[i][1] === reg[i][1], `第 ${i + 1} 行模型 id 应为 ${reg[i][1]}`);
      assert(listed[i][3] === reg[i][2], `第 ${i + 1} 行公式出处应为 ${reg[i][2]}`);
    }
    // 清单上的每一个都必须真的算得出有限结果（「广告了但不存在」的能力靠这条兜）
    const dead = await page.evaluate(() => {
      const sample = {
        mm1: { lam: 0.7, mu: 1 }, mmc: { lam: 9, mu: 1, c: 10 }, mmck: { lam: 12, mu: 1, c: 10, K: 20 },
        mmcc: { lam: 12, mu: 1, c: 10 }, mminf: { lam: 7, mu: 2 }, mmcN: { lam1: 0.2, mu: 1, c: 2, N: 10 },
        erlangA: { lam: 10, mu: 1, c: 8, theta: 0.5 }, mg1: { lam: 0.7, ES: 1, cs2: 3 },
        md1: { lam: 0.7, ES: 1 }, ggc: { lam: 7, ES: 1, c: 8, ca2: 0.5, cs2: 2 },
        mg1p: { classes: [{ lam: 0.2, ES: 1, cs2: 1 }, { lam: 0.4, ES: 0.8, cs2: 2 }], preempt: false }
      };
      return QL.MODELS.filter((m) => {
        const r = QL.solveModel(m.id, sample[m.id]);
        return !(r && r.ok && isFinite(r.L) && isFinite(r.W) && r.L >= 0);
      }).map((m) => m.id);
    });
    assert(dead.length === 0, `清单上算不出来的模型：${dead.join(',')}`); }
  // 页面公布的离线验证规模：钉死成离线套件实测出来的那个字面量（异源）
  assert(parseInt(await page.textContent('#ql-nassert'), 10) === 1234,
    '说明页公布的离线断言数应为 1234（离线套件实测值）');

  // ───────── ⑧ᵇ 页面上每个按钮都得真的干活（「广告了但不存在」靠这条兜） ─────────
  await showTab('shift');
  { const readSlots = () => page.$$eval('#ql-w-grid input', (es) => es.map((e) => +e.value));
    const twin = await readSlots();
    await page.click('#ql-w-flat');
    await page.waitForTimeout(150);
    const flat = await readSlots();
    assert(new Set(flat).size === 1, `「载入平峰曲线」应把每个时段填成同一个数，实为 ${new Set(flat).size} 种`);
    await page.click('#ql-w-preset');
    await page.waitForTimeout(200);
    const twin2 = await readSlots();
    assert(JSON.stringify(twin2) === JSON.stringify(twin), '「载入双峰话务曲线」应还原成默认曲线');
    // 时段长度切到 60 分钟：格子数应减半
    await page.selectOption('#ql-w-slot', '60');
    await page.waitForFunction(() => document.querySelectorAll('#ql-w-grid input').length === 12);
    assert((await readSlots()).length === 12, '切到 60 分钟时段后应只剩 12 格');
    await page.selectOption('#ql-w-slot', '30');
    await page.waitForFunction(() => document.querySelectorAll('#ql-w-grid input').length === 24); }

  await showTab('net');
  // 前面那一节把子页签留在了「闭合网络」上，开放网络的按钮此刻是藏着的
  // （Playwright 对 display:none 子树里的控件会一路卡到 30s 超时）
  await page.click('#ql-n-seg .ql-chip[data-nettab="open"]');
  await page.waitForFunction(() => !document.getElementById('ql-n-open').hidden);
  { const nRows = () => page.$$eval('#ql-n-nodes tr', (t2) => t2.length);
    const before = await nRows();
    await page.click('#ql-n-add');
    await page.waitForFunction((n) => document.querySelectorAll('#ql-n-nodes tr').length === n + 1, before);
    assert((await page.$$eval('#ql-n-route tr', (t2) => t2.length)) === before + 2,
      '加节点后，路由矩阵也要跟着长一行（表头 + 每个节点一行）');
    await page.click('#ql-n-demo');
    await page.waitForFunction((n) => document.querySelectorAll('#ql-n-nodes tr').length === n, before);
    assert(await nRows() === before, '「载入示例」应把节点表还原'); }
  { await page.click('#ql-n-seg .ql-chip[data-nettab="closed"]');
    await page.waitForFunction(() => !document.getElementById('ql-n-closed').hidden);
    const before = await page.$$eval('#ql-k-stations tr', (t2) => t2.length);
    await page.click('#ql-k-add');
    await page.waitForFunction((n) => document.querySelectorAll('#ql-k-stations tr').length === n + 1, before);
    await page.click('#ql-k-demo');
    await page.waitForFunction((n) => document.querySelectorAll('#ql-k-stations tr').length === n, before);
    await page.click('#ql-n-seg .ql-chip[data-nettab="open"]');
    await page.waitForFunction(() => !document.getElementById('ql-n-open').hidden); }

  await showTab('model');
  await page.selectOption('#ql-m-model', 'mg1p');
  await page.waitForFunction(() => !document.getElementById('ql-m-prio').hidden);
  { const before = await page.$$eval('#ql-m-classes tr', (t2) => t2.length);
    await page.click('#ql-m-addclass');
    await page.waitForFunction((n) => document.querySelectorAll('#ql-m-classes tr').length === n + 1, before);
    await page.waitForFunction((n) => document.querySelectorAll('#ql-m-priotbody tr').length === n + 1, before);
    await page.click('#ql-m-classes tr:last-child button');
    await page.waitForFunction((n) => document.querySelectorAll('#ql-m-classes tr').length === n, before); }
  await page.selectOption('#ql-m-model', 'mmc');

  // 「同步容量页参数」必须真的把容量页的答案搬过来
  await showTab('sim');
  await page.click('#ql-s-sync');
  await page.waitForFunction((c) => +document.getElementById('ql-s-c').value === c, ORACLE.cap_default.c);
  assert(+(await page.$eval('#ql-s-c', (e) => e.value)) === ORACLE.cap_default.c,
    `同步后仿真的服务台数应等于容量页答案 ${ORACLE.cap_default.c}`);
  relNear(+(await page.$eval('#ql-s-lam', (e) => e.value)), 300 / 3600, 1e-4, '同步后的到达率');
  relNear(+(await page.$eval('#ql-s-es', (e) => e.value)), 180, 1e-6, '同步后的平均服务时长');
  await page.fill('#ql-s-lam', '9'); await page.fill('#ql-s-c', '10'); await page.fill('#ql-s-es', '1');

  // ───────── ⑨ 渲染守卫 ─────────
  // [hidden] 必须真的藏住（断计算样式，不是断属性）
  for (const t of TABS) {
    await showTab(t);
    for (const o of TABS) {
      const disp = await page.$eval('#ql-pane-' + o, (e) => getComputedStyle(e).display);
      assert(o === t ? disp !== 'none' : disp === 'none',
        `页签 ${t} 打开时，${o} 面板的 display 应为 ${o === t ? '可见' : 'none'}，实为 ${disp}`);
    }
  }
  // 控件最小尺寸：逐页签扫一遍（藏起来的面板对尺寸守卫是盲的，所以要逐页切过去）
  let scanned = 0;
  for (const t of TABS) {
    await showTab(t);
    const bad = await page.$$eval('input, select, button', (els) => {
      const out = [];
      for (const e of els) {
        const r = e.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;       // 不可见的跳过
        const minW = e.tagName === 'BUTTON' ? 52 : (e.type === 'checkbox' ? 18 : 100);
        if (r.width < minW || r.height < 18)
          out.push(`${e.tagName}#${e.id || e.className} ${r.width.toFixed(1)}×${r.height.toFixed(1)}`);
      }
      return out;
    });
    const n = await page.$$eval('input, select, button', (els) =>
      els.filter((e) => e.getBoundingClientRect().width > 0).length);
    scanned += n;
    assert(bad.length === 0, `页签 ${t} 有塌缩的控件：${bad.join(' / ')}`);
  }
  assert(scanned >= 120, `控件尺寸守卫累计只扫到 ${scanned} 个控件，太少了，说明多数面板没被扫到`);
  // text-transform 必须是 none（CSS 改的是渲染字形，扫文本是扫不出来的）
  for (const t of TABS) {
    await showTab(t);
    const up = await page.$$eval('th, dt, label, legend, .ql-badge', (els) =>
      els.filter((e) => e.getBoundingClientRect().width > 0
        && getComputedStyle(e).textTransform === 'uppercase').map((e) => e.textContent.trim().slice(0, 20)));
    assert(up.length === 0, `页签 ${t} 有被 uppercase 改写的标签：${up.join(' / ')}`);
  }
  // 读数不许溢出它所在的小格
  for (const t of ['cap', 'model', 'net']) {
    await showTab(t);
    const over = await page.$$eval('.ql-kpi', (els) => {
      const out = [];
      for (const e of els) {
        if (!e.getBoundingClientRect().width) continue;
        const p = e.getBoundingClientRect();
        for (const ch of e.querySelectorAll('dd, dt')) {
          const r = ch.getBoundingClientRect();
          if (r.right > p.right + 1 || r.bottom > p.bottom + 1 || r.left < p.left - 1)
            out.push(ch.textContent.trim().slice(0, 18));
        }
      }
      return out;
    });
    assert(over.length === 0, `页签 ${t} 的读数溢出了格子：${over.join(' / ')}`);
  }
  // 图上文字两两不许重叠
  for (const t of TABS) {
    await showTab(t);
    const clash = await page.$$eval('svg', (svgs) => {
      const out = [];
      for (const s of svgs) {
        if (!s.getBoundingClientRect().width) continue;
        const ts = Array.from(s.querySelectorAll('text')).filter((x) => x.textContent.trim());
        for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) {
          const a = ts[i].getBoundingClientRect(), b = ts[j].getBoundingClientRect();
          const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (ox > 1.5 && oy > 1.5)
            out.push(`${s.id}: "${ts[i].textContent}" × "${ts[j].textContent}"`);
        }
      }
      return out;
    });
    assert(clash.length === 0, `页签 ${t} 的图上有文字重叠：${clash.slice(0, 4).join(' / ')}`);
  }
  // 坐标轴刻度不许塌成两三根
  await showTab('cap');
  for (const id of ['ql-fig-sl', 'ql-fig-asa']) {
    const n = await page.$eval('#' + id, (s) => s.querySelectorAll('line').length);
    assert(n >= 8, `${id} 的网格线只有 ${n} 条，坐标轴刻度塌了`);
  }
  /* 对数轴的量程不许被一个病态点撑爆：实撞过一次 —— a = 14.999999999999998 让 c=15 的
   * ρ = 1−1.1e−16 被判成「稳定」，Wq 解出 1e17 秒，纵轴量程变成 22 个数量级、刻度
   * 几乎全被避让器丢光，而当时 235 条断言全绿，只有人工看图才发现。 */
  { const toSec = (s) => {
      const v = parseFloat(s);
      if (s.includes('毫秒')) return v / 1000;
      if (s.includes('分钟')) return v * 60;
      if (s.includes('小时')) return v * 3600;
      return v;
    };
    const labels = (await page.$$eval('#ql-fig-asa text', (ts) => ts.map((t) => t.textContent)))
      .filter((t) => /(毫秒|分钟|小时|^\d+(\.\d+)? 秒$)/.test(t) && !t.includes('占用'));
    assert(labels.length >= 5, `对数轴上只剩 ${labels.length} 个时长刻度：${labels.join(',')}`);
    const secs = labels.map(toSec).filter((x) => x > 0);
    const span = Math.max(...secs) / Math.min(...secs);
    assert(span <= 1e5, `对数轴量程跨了 ${span.toExponential(1)} 倍（> 1e5），刻度会被丢光：${labels.join(',')}`);
    // 当前答案的读数必须落在画出来的量程内，否则曲线关键点被裁掉了
    const asa = parseFloat(await page.textContent('#ql-c-asa'))
      * ((await page.textContent('#ql-c-asa')).includes('毫秒') ? 1e-3 : 1);
    assert(asa >= Math.min(...secs) && asa <= Math.max(...secs),
      `当前 ASA ${asa}s 落在对数轴量程 [${Math.min(...secs)}, ${Math.max(...secs)}] 之外`); }
  // 窄屏不许横向溢出（宽视口下网格有富余，测不出 min-width:auto 的坑）
  for (const vw of [390, 768]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of TABS) {
      await showTab(t);
      await page.waitForTimeout(80);
      const info = await page.evaluate(() => {
        const d = document.documentElement;
        const over = d.scrollWidth - d.clientWidth;
        if (over <= 1) return { over };
        const bad = [];
        for (const e of document.querySelectorAll('*')) {
          const r = e.getBoundingClientRect();
          if (r.width > 0 && r.right > d.clientWidth + 1)
            bad.push(`${e.tagName}.${(e.className || '').toString().slice(0, 24)}@${r.right.toFixed(0)}`);
        }
        return { over, bad: bad.slice(0, 6) };
      });
      assert(info.over <= 1, `${vw}px 下页签 ${t} 横向溢出 ${info.over}px：${(info.bad || []).join(' / ')}`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 850 });

  // ───────── ⑩ 状态持久化 ─────────
  await showTab('cap');
  await page.fill('#ql-c-aht', '240');
  await page.waitForTimeout(150);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.QLA && document.getElementById('ql-c-answer').textContent !== '—');
  assert(await page.$eval('#ql-c-aht', (e) => e.value) === '240', '参数应写进 localStorage 并在刷新后复原');
  await page.fill('#ql-c-aht', '180');
  await page.waitForTimeout(150);

  // 本工具全程用 SVG，不该出现 canvas（canvas 上的文字重叠 DOM 断言测不到）
  assert((await page.$$('canvas')).length === 0, '本工具不应使用 canvas');
  await showTab('cap');
  await page.waitForTimeout(150);
  await screenshot('thumb.png');
};
