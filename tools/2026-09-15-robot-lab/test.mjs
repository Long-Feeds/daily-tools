// 机械臂工作台 · 真实浏览器集成测试
// 数值期望全部来自 roboticstoolbox-python 1.4.3 / numpy 的实算（见 run 目录 oracle/gen_browser.py），
// 不是手算或记忆里的数字（2026-09-09 教训）。
const ORACLE = {
 "pumaA": {
  "q_deg": [
   10,
   20,
   30,
   40,
   50,
   60
  ],
  "xyz": [
   0.11274840910059242,
   -0.13248417655706574,
   1.1126206899459867
  ],
  "rpy_zyx_deg": [
   -92.0836590033485,
   -0.47953110618185324,
   129.53759809132367
  ],
  "quat": [
   0.29861179478571803,
   -0.30422019641872616,
   -0.6524023165787357,
   0.6266197295238182
  ],
  "sv_trans": [
   0.563405568264395,
   0.30765675166840084,
   0.08423045903957614
  ],
  "cond_trans": 6.688857863159405,
  "mnp_trans": 0.014600131007423292,
  "ik": {
   "lun": [
    70.79776123802777,
    42.58780047844837,
    29.999999999999993,
    119.22555358660715,
    -36.47855855045844,
    -34.04423333076729
   ],
   "ldn": [
    70.79776123802777,
    160.00000000000003,
    155.3832726741276,
    138.30452437460528,
    -128.7382938015023,
    -118.35195174404764
   ],
   "run": [
    9.99999999999999,
    137.41219952155166,
    155.3832726741276,
    -121.64019618298109,
    -144.6637489328815,
    -38.72383291541804
   ],
   "rdn": [
    9.99999999999999,
    20.000000000000004,
    29.999999999999993,
    -140,
    -50,
    -120.00000000000001
   ],
   "luf": [
    70.79776123802777,
    42.58780047844837,
    29.999999999999993,
    -60.77444641339286,
    36.47855855045844,
    145.95576666923273
   ],
   "ldf": [
    70.79776123802777,
    160.00000000000003,
    155.3832726741276,
    -41.69547562539472,
    128.7382938015023,
    61.648048255952375
   ],
   "ruf": [
    9.99999999999999,
    137.41219952155166,
    155.3832726741276,
    58.359803817018935,
    144.6637489328815,
    141.27616708458197
   ],
   "rdf": [
    9.99999999999999,
    20.000000000000004,
    29.999999999999993,
    40.000000000000014,
    50,
    59.99999999999999
   ]
  }
 },
 "pumaB": {
  "q_deg": [
   0,
   45,
   120,
   0,
   45,
   0
  ],
  "gravmax": 23.11532195620299,
  "M11": 3.003220482043437
 },
 "pumaC": {
  "q_deg": [
   30,
   -20,
   45,
   10,
   -30,
   15
  ]
 },
 "trajBC": {
  "T": 2,
  "steps": 60,
  "peak_qd_rad": 1.2264796556682775,
  "peak_qdd_rad": 1.8872133647385638,
  "peak_qd_analytic": 1.2271846303085128,
  "peak_qdd_analytic": 1.889374337743977
 },
 "ur5A": {
  "q_deg": [
   10,
   20,
   30,
   40,
   50,
   60
  ],
  "xyz": [
   -0.5202530245839176,
   -0.2562859696726813,
   -0.41942595139552025
  ]
 },
 "pumaMod": {
  "a2": 0.5,
  "xyz": [
   0.1758618197473581,
   -0.12135557941550805,
   1.1359464637207974
  ]
 },
 "OFFLINE_POINTS": 1084073
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await page.goto(toolURL, { waitUntil: 'load' });
  await page.waitForSelector('#rl-tablist .rl-tab');
  await page.waitForFunction(() => !!document.querySelector('#rl-pose-read .rl-rv'));

  const TABS = ['pose', 'ik', 'jac', 'traj', 'dyn', 'ws'];
  const openTab = async (id) => {
    await page.click('#rl-tabbtn-' + id);
    await page.waitForFunction((t) => {
      const p = document.querySelector('#rl-pane-' + t);
      return p && getComputedStyle(p).display !== 'none';
    }, id);
    await page.waitForTimeout(40);
  };
  // 每一段结束就查一次页面异常，红了能直接指到是哪一步（而不是全跑完才报一大坨）
  const ck = async (tag) => {
    if (errs.length) {
      const who = await page.evaluate(() => {
        const out = [];
        for (const e of document.querySelectorAll('svg *')) {
          for (const a of e.attributes) if (String(a.value).indexOf('NaN') >= 0) {
            let p = e, id = '';
            while (p && !id) { id = p.id || ''; p = p.parentElement; }
            out.push(`${id || '?'} ${e.tagName}[${a.name}]`);
            break;
          }
          if (out.length > 4) break;
        }
        return out;
      });
      assert(false, `${tag} 之后页面报错：` + errs.slice(0, 3).join(' | ') + ' 元凶：' + who.join(', '));
    }
  };
  const near = (a, b, tol, msg) => assert(Math.abs(a - b) <= tol, `${msg}：得到 ${a}，期望 ${b}（容差 ${tol}）`);
  const num = async (sel) => parseFloat((await page.textContent(sel)).replace(/[^0-9eE.+-]/g, ''));
  const readVal = async (bandSel, i) =>
    page.$eval(bandSel, (b, k) => b.querySelectorAll('.rl-rv')[k].textContent, i);

  // ---------- 0. 外壳 ----------
  assert((await page.$$('#rl-tablist .rl-tab')).length === 6, '应有 6 个标签页');
  assert((await page.textContent('.rl-back')).includes('返回工具集'), '缺少返回工具集链接');
  // 隐藏面板要断**计算样式**，不是 hidden 属性（2026-07-20 / 09-13 教训）
  for (const t of TABS.slice(1)) {
    const d = await page.$eval('#rl-pane-' + t, (e) => getComputedStyle(e).display);
    assert(d === 'none', `未激活面板 ${t} 的 display 应为 none，实际 ${d}`);
  }
  const d0 = await page.$eval('#rl-pane-pose', (e) => getComputedStyle(e).display);
  assert(d0 !== 'none', '当前面板不该被隐藏');

  // ---------- 1. 正运动学：改关节值，读末端位姿 ----------
  const setJoints = async (deg) => {
    for (let j = 0; j < deg.length; j++) {
      await page.fill('#rl-jn-' + j, String(deg[j]));
      await page.dispatchEvent('#rl-jn-' + j, 'change');
    }
    await page.waitForTimeout(60);
  };
  await setJoints(ORACLE.pumaA.q_deg);
  const px = parseFloat(await readVal('#rl-pose-read', 0));
  const py = parseFloat(await readVal('#rl-pose-read', 1));
  const pz = parseFloat(await readVal('#rl-pose-read', 2));
  near(px, ORACLE.pumaA.xyz[0], 2e-5, 'Puma560 末端 X（对 rtb fkine）');
  near(py, ORACLE.pumaA.xyz[1], 2e-5, 'Puma560 末端 Y（对 rtb fkine）');
  near(pz, ORACLE.pumaA.xyz[2], 2e-5, 'Puma560 末端 Z（对 rtb fkine）');
  near(parseFloat(await readVal('#rl-pose-read', 3)), ORACLE.pumaA.rpy_zyx_deg[0], 5e-3, 'roll（对 spatialmath rpy zyx）');
  near(parseFloat(await readVal('#rl-pose-read', 4)), ORACLE.pumaA.rpy_zyx_deg[1], 5e-3, 'pitch');
  near(parseFloat(await readVal('#rl-pose-read', 5)), ORACLE.pumaA.rpy_zyx_deg[2], 5e-3, 'yaw');
  for (let i = 0; i < 4; i++) {
    near(parseFloat(await readVal('#rl-pose-read', 6 + i)), ORACLE.pumaA.quat[i], 2e-5, '四元数分量 ' + i);
  }

  // 几何：改一个关节，末端标记必须真的动（只断数字测不出图没画对 —— 2026-09-02 教训）
  const eeXY = () => page.$eval('#rl-robotfig svg', (svg) => {
    const c = [...svg.querySelectorAll('circle')].filter((e) => e.getAttribute('fill') === '#ea2804');
    const b = c[c.length - 1].getBoundingClientRect();
    return [b.x + b.width / 2, b.y + b.height / 2];
  });
  const ee0 = await eeXY();
  await page.fill('#rl-jn-0', '80');
  await page.dispatchEvent('#rl-jn-0', 'change');
  await page.waitForTimeout(80);
  const ee1 = await eeXY();
  assert(Math.hypot(ee1[0] - ee0[0], ee1[1] - ee0[1]) > 8,
    `转动第 1 轴 70° 后末端标记应明显移动，实际只移了 ${Math.hypot(ee1[0] - ee0[0], ee1[1] - ee0[1]).toFixed(1)}px`);
  const dots = (sel) => page.$eval(sel + ' svg', (svg) =>
    [...svg.querySelectorAll('circle')].filter((e) => e.getAttribute('stroke') === '#202020').length);
  assert((await dots('#rl-robotfig')) === 6, `Puma560（6 轴）应画出 6 个关节圆点，实际 ${await dots('#rl-robotfig')}`);
  await setJoints(ORACLE.pumaA.q_deg);

  await ck('正运动学');

  // ---------- 2. 逆解 ----------
  await openTab('ik');
  await page.click('#rl-take-pose');
  await page.waitForTimeout(80);
  await page.click('#rl-solve');
  await page.waitForSelector('#rl-ik-table');
  const ikRows = await page.$$eval('#rl-ik-table tbody tr', (rs) =>
    rs.map((r) => [...r.querySelectorAll('td')].map((c) => c.textContent)));
  assert(ikRows.length === 8, `Puma560 闭式逆解应给 8 个解，实际 ${ikRows.length}`);
  // 逐个构型对 rtb ikine_a；容差取页面显示位数（2 位小数）的半个最小单位
  let cfgChecked = 0;
  for (const cfg of Object.keys(ORACLE.pumaA.ik)) {
    const want = ORACLE.pumaA.ik[cfg];
    const row = ikRows.find((r) => r[1] === cfg);
    assert(!!row === !!want, `构型 ${cfg}：rtb ${want ? '有解' : '无解'}，页面 ${row ? '有' : '无'}`);
    if (!want || !row) continue;
    for (let j = 0; j < 6; j++) near(parseFloat(row[2 + j]), want[j], 6e-3, `${cfg} 构型第 ${j + 1} 轴（对 rtb ikine_a）`);
    cfgChecked++;
  }
  assert(cfgChecked === 8, `应逐个核对 8 个构型，实际 ${cfgChecked}`);
  for (const r of ikRows) assert(parseFloat(r[8]) < 1e-8, `解的回代残差应 < 1e-8，实际 ${r[8]}`);
  assert((await readVal('#rl-ik-read', 0)).includes('闭式'), 'Puma560 应走闭式解');
  assert(ikRows.some((r) => r[9] === '越限'), 'Puma560 在此位姿下应有越限解（ldn 的 q2 超 ±110°）');
  // 点一行要真的把解装进关节变量
  await page.click('#rl-ik-table tbody tr:nth-child(1)');
  await page.waitForTimeout(80);
  const picked = await page.$$eval('#rl-ik-table tbody tr:nth-child(1) td', (t) => t.map((x) => x.textContent));
  await openTab('pose');
  for (let j = 0; j < 6; j++) {
    const v = parseFloat(await page.inputValue('#rl-jn-' + j));
    near(v, parseFloat(picked[2 + j]), 0.02, `点选解后第 ${j + 1} 轴应被装载`);
  }
  await setJoints(ORACLE.pumaA.q_deg);

  await ck('逆解');

  // ---------- 3. 雅可比 ----------
  await openTab('jac');
  near(await num('#rl-jac-read .rl-rcell:nth-child(1) .rl-rv'), ORACLE.pumaA.sv_trans[2], 1e-5, '最小奇异值（对 numpy SVD）');
  near(await num('#rl-jac-read .rl-rcell:nth-child(2) .rl-rv'), ORACLE.pumaA.cond_trans, 1e-2, '条件数（对 numpy SVD）');
  near(await num('#rl-jac-read .rl-rcell:nth-child(3) .rl-rv'), ORACLE.pumaA.mnp_trans, 1e-6, '可操作度（对 rtb manipulability）');
  const svRows = await page.$$eval('#rl-sv-table tbody tr td.rl-num', (t) => t.map((x) => parseFloat(x.textContent)));
  assert(svRows.length === 3, `平移口径应给 3 个奇异值，实际 ${svRows.length}`);
  for (let i = 0; i < 3; i++) near(svRows[i], ORACLE.pumaA.sv_trans[i], 1e-5, `σ${i + 1}`);
  const jw = await page.textContent('#rl-jac-well');
  assert(jw.trim().split('\n').length === 6, '雅可比矩阵井应有 6 行');
  // 切到「全部 6 轴」口径后奇异值个数应变成 6
  await page.selectOption('#rl-jac-axes', 'all');
  await page.waitForTimeout(80);
  const sv6 = await page.$$eval('#rl-sv-table tbody tr', (r) => r.length);
  assert(sv6 === 6, `全 6 轴口径应给 6 个奇异值，实际 ${sv6}`);
  await page.selectOption('#rl-jac-axes', 'trans');
  await page.waitForTimeout(80);

  await ck('雅可比');

  // ---------- 4. 轨迹 ----------
  await openTab('traj');
  await page.selectOption('#rl-traj-kind', 'quintic');
  await page.fill('#rl-traj-T', '2');
  await page.dispatchEvent('#rl-traj-T', 'change');
  await page.fill('#rl-traj-steps', '60');
  await page.dispatchEvent('#rl-traj-steps', 'change');
  await page.waitForTimeout(150);
  // 显式把起点设成 pumaB、终点设成 pumaC，才能和 oracle 的 jtraj 对上
  await openTab('pose');
  await setJoints(ORACLE.pumaB.q_deg);
  await openTab('traj');
  await page.click('#rl-set-from');
  await page.waitForTimeout(100);
  await openTab('pose');
  await setJoints(ORACLE.pumaC.q_deg);
  await openTab('traj');
  await page.click('#rl-set-to');
  await page.waitForTimeout(150);
  const ends = await page.$$eval('#rl-traj-ends tbody tr', (rs) => rs.map((r) => [...r.querySelectorAll('td')].map((c) => c.textContent)));
  assert(ends.length === 6, '起点终点表应有 6 行');
  for (let j = 0; j < 6; j++) {
    near(parseFloat(ends[j][1]), ORACLE.pumaB.q_deg[j], 6e-3, `起点第 ${j + 1} 轴`);
    near(parseFloat(ends[j][2]), ORACLE.pumaC.q_deg[j], 6e-3, `终点第 ${j + 1} 轴`);
  }
  const peakV = parseFloat(await readVal('#rl-traj-read', 3));
  near(peakV, ORACLE.trajBC.peak_qd_rad, 5e-5, '五次多项式峰值关节速度 rad/s（对 rtb jtraj，按 2 s 换算）');
  assert(Math.abs(peakV - ORACLE.trajBC.peak_qd_analytic) / peakV < 0.01,
    `峰值速度还应与解析式 1.875·Δq/T = ${ORACLE.trajBC.peak_qd_analytic} 相符，实际 ${peakV}`);
  near(parseFloat(await readVal('#rl-traj-read', 4)), ORACLE.trajBC.peak_qdd_rad, 5e-4, '峰值关节加速度 rad/s²（对 rtb jtraj）');
  near(parseFloat(await readVal('#rl-traj-read', 1)), 2, 1e-6, '总时长应为 2 s');
  // 拖动时刻滑块：时刻读数要跟着变
  const t0 = await readVal('#rl-traj-read', 0);
  await page.$eval('#rl-traj-scrub', (e) => { e.value = String(Math.floor(e.max / 2)); e.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForTimeout(120);
  const t1 = await readVal('#rl-traj-read', 0);
  assert(t0 !== t1, '拖动时刻滑块后「时刻」读数应改变');
  near(parseFloat(t1), 1.0, 0.05, '滑到中点时刻应约为 1 s');
  // S 曲线：端点速度加速度必须为零、总时长由限幅决定
  await page.selectOption('#rl-traj-kind', 'scurve');
  await page.waitForTimeout(200);
  const Ts = parseFloat(await readVal('#rl-traj-read', 1));
  assert(Ts > 0.2 && Ts < 60, `S 曲线总时长应落在合理区间，实际 ${Ts}`);
  const pkA = parseFloat(await readVal('#rl-traj-read', 4));
  const amax = parseFloat(await page.inputValue('#rl-amax'));
  assert(pkA <= amax * 180 / Math.PI * 1.02 + 1e-6, `S 曲线峰值加速度 ${pkA}°/s² 不应超过限幅 ${amax} rad/s²`);
  // 笛卡尔直线
  await page.selectOption('#rl-traj-kind', 'cartesian');
  await page.waitForTimeout(400);
  const fails = parseFloat(await readVal('#rl-traj-read', 5));
  assert(fails === 0, `笛卡尔直线在这段路径上不该有逆解失败点，实际 ${fails}`);
  // 越限判定必须和表里的数字一致（这条查的是判定逻辑本身）
  const checkVerdicts = async (tag) => {
    const rows = await page.$$eval('#rl-viol-table tbody tr', (rs) =>
      rs.map((r) => [...r.querySelectorAll('td')].map((c) => parseFloat(c.textContent) || c.textContent)));
    assert(rows.length === 6, `${tag}：越限表应有 6 行`);
    for (const r of rows) {
      const over = r[1] < r[3] - 1e-6 || r[2] > r[4] + 1e-6;
      assert((r[7] === '越限') === over, `${tag} ${r[0]}：区间 [${r[1]}, ${r[2]}] 对限位 [${r[3]}, ${r[4]}] 的判定应为 ${over ? '越限' : '合规'}，实际 ${r[7]}`);
    }
    return rows;
  };
  await checkVerdicts('笛卡尔');
  // 关节空间的三种时间律在两端都合规时必然全程合规（五次/梯形/S 曲线各轴都是单调的）
  for (const kind of ['quintic', 'trapezoid', 'scurve']) {
    await page.selectOption('#rl-traj-kind', kind);
    await page.waitForTimeout(250);
    const rows = await checkVerdicts(kind);
    assert(rows.every((r) => r[7] === '合规'), `${kind}：两端都在限位内时应全程合规，实际 ` + rows.map((r) => r[7]).join(','));
  }
  await page.selectOption('#rl-traj-kind', 'quintic');
  await page.waitForTimeout(200);

  await ck('轨迹');

  // ---------- 5. 动力学 ----------
  await openTab('pose');
  await setJoints(ORACLE.pumaB.q_deg);
  await openTab('dyn');
  const mwell = await page.textContent('#rl-Mwell');
  const m11 = parseFloat(mwell.trim().split('\n')[0].trim().split(/\s+/)[0]);
  near(m11, ORACLE.pumaB.M11, 1e-4, 'M11（对 rtb inertia）');
  near(await num('#rl-energy-read .rl-rcell:nth-child(4) .rl-rv'), ORACLE.pumaB.gravmax, 1e-3, '静态保持力矩（对 rtb gravload）');
  const tauRows = await page.$$eval('#rl-tau-table tbody tr', (rs) =>
    rs.map((r) => [...r.querySelectorAll('td')].map((c) => c.textContent)));
  assert(tauRows.length === 6, '力矩分解表应有 6 行');
  // 分解自洽：惯性 + 科氏 + 重力 + 摩擦电机 = 合计（异源：四列独立算出，合计来自 rne）
  for (const r of tauRows) {
    const s = parseFloat(r[1]) + parseFloat(r[2]) + parseFloat(r[3]) + parseFloat(r[4]);
    near(s, parseFloat(r[5]), 5e-3, `${r[0]} 的力矩分解之和应等于合计`);
  }
  // 挂负载后重力保持力矩必须变大
  const g0 = await num('#rl-energy-read .rl-rcell:nth-child(4) .rl-rv');
  await page.fill('#rl-pay-m', '10');
  await page.dispatchEvent('#rl-pay-m', 'change');
  await page.waitForTimeout(250);
  const g1 = await num('#rl-energy-read .rl-rcell:nth-child(4) .rl-rv');
  assert(g1 > g0 * 1.02, `挂 10 kg 负载后静态保持力矩应显著变大：${g0} → ${g1}`);
  await page.fill('#rl-pay-m', '0');
  await page.dispatchEvent('#rl-pay-m', 'change');
  await page.waitForTimeout(250);
  // 峰值柱状图的柱高必须与表里的数字成比例（几何断言）
  const bars = await page.$eval('#rl-peak-chart svg', (svg) => {
    const rs = [...svg.querySelectorAll('rect')].filter((r) => r.getAttribute('fill') === '#ea2804');
    return rs.map((r) => parseFloat(r.getAttribute('height')));
  });
  const peakNums = await page.$$eval('#rl-peak-table tbody tr', (rs) => rs.map((r) => parseFloat(r.querySelectorAll('td')[1].textContent)));
  assert(bars.length === 6, `峰值柱应有 6 根，实际 ${bars.length}`);
  const bi = peakNums.indexOf(Math.max(...peakNums));
  const si = peakNums.indexOf(Math.min(...peakNums));
  assert(bars[bi] >= bars[si], '峰值最大的那一轴柱子应不低于最小的那一轴');
  if (peakNums[si] > 0) {
    const rNum = peakNums[bi] / peakNums[si], rBar = bars[bi] / Math.max(bars[si], 1e-9);
    assert(Math.abs(rNum - rBar) / rNum < 0.12, `柱高比例 ${rBar.toFixed(2)} 应与数值比例 ${rNum.toFixed(2)} 一致`);
  }

  await ck('动力学');

  // ---------- 6. 工作空间与能力清单 ----------
  await openTab('ws');
  const rmax = await num('#rl-ws-read .rl-rcell:nth-child(1) .rl-rv');
  const sumL = await num('#rl-ws-read .rl-rcell:nth-child(4) .rl-rv');
  assert(rmax > 0.5 && rmax <= sumL + 1e-9, `最大水平半径 ${rmax} 应为正且不超过连杆长度之和 ${sumL}`);
  const caps = await page.$$eval('#rl-caps-table tbody tr', (rs) =>
    rs.map((r) => [...r.querySelectorAll('td')].map((c) => c.textContent)));
  assert(caps.length >= 30, `能力清单至少应有 30 项，实际 ${caps.length}`);
  const dead = caps.filter((c) => c[1].indexOf('未命中') >= 0);
  assert(dead.length === 0, '能力清单里有算不出来的项：' + dead.map((d) => d[0]).join('、'));
  // 公布的规模数字必须是钉死的离线套件实测值（异源核对，2026-09-06 教训）
  const bodyTxt = await page.textContent('#rl-pane-ws');
  assert(bodyTxt.indexOf(ORACLE.OFFLINE_POINTS.toLocaleString('en-US')) >= 0,
    `说明里应写明离线对拍点数 ${ORACLE.OFFLINE_POINTS.toLocaleString('en-US')}`);
  const mt = await page.$$eval('#rl-model-table tbody tr', (rs) => rs.map((r) => [...r.querySelectorAll('td')].map((c) => c.textContent)));
  assert(mt.length === 9, `机型对照表应有 9 行，实际 ${mt.length}`);
  assert(mt.filter((r) => r[5] === '可用').length === 1, '只应有 Puma 560 一台标「闭式逆解可用」');
  assert(mt.some((r) => r[3] === '改进'), '机型表里应有一台走改进 DH（Panda）');
  assert(mt.some((r) => r[2].indexOf('P') >= 0), '机型表里应有含移动关节的机型');

  await ck('工作空间');

  // ---------- 7. 换机型 + DSL ----------
  await openTab('pose');
  const finitePose = async (tag) => {
    for (let i = 0; i < 3; i++) {
      const v = parseFloat(await readVal('#rl-pose-read', i));
      assert(isFinite(v), `${tag}：末端读数第 ${i + 1} 项不是有限数（${v}）—— 换机型时关节维度没跟上会让正运动学全 NaN`);
    }
  };
  await page.selectOption('#rl-model-sel', 'ur5');
  await page.waitForTimeout(150);
  await finitePose('切到 ur5');
  await ck('切到 ur5');
  assert((await page.$$('#rl-joints .rl-jrow')).length === 6, 'UR5 应有 6 个关节行');
  await setJoints([10, 20, 30, 40, 50, 60]);
  near(parseFloat(await readVal('#rl-pose-read', 0)), ORACLE.ur5A.xyz[0], 2e-5, 'UR5 末端 X（对 rtb fkine）');
  near(parseFloat(await readVal('#rl-pose-read', 2)), ORACLE.ur5A.xyz[2], 2e-5, 'UR5 末端 Z（对 rtb fkine）');
  await ck('ur5 设关节');
  await page.selectOption('#rl-model-sel', 'panda');
  await page.waitForTimeout(150);
  await finitePose('切到 panda');
  assert((await page.$$('#rl-joints .rl-jrow')).length === 7, 'Panda 应有 7 个关节行（冗余臂）');
  assert((await dots('#rl-robotfig')) === 7, `Panda（7 轴）应画出 7 个关节圆点，实际 ${await dots('#rl-robotfig')}`);
  assert((await page.$$eval('#rl-joints .rl-jname', (e) => e.length)) === 7, 'Panda 的关节标签应有 7 个');
  await ck('切到 panda');
  await page.selectOption('#rl-model-sel', 'stanford');
  await page.waitForTimeout(150);
  await finitePose('切到 stanford');
  const sq = await page.$$eval('#rl-joints .rl-jname', (e) => e.map((x) => x.textContent));
  assert(sq[2] === 'd3', `Stanford 第 3 轴是移动关节，标签应为 d3，实际 ${sq[2]}`);
  await ck('切到 stanford');
  await page.selectOption('#rl-model-sel', 'puma560');
  await page.waitForTimeout(150);

  // DSL：错的定义要报错；改 a2 后 FK 要真的变
  await ck('切回 puma560');
  const errDisp = await page.$eval('#rl-dh-err', (e) => getComputedStyle(e).display);
  assert(errDisp === 'none', '初始不该显示 DSL 报错框');
  await page.fill('#rl-dh', 'J X 0 1 0 0 -10 10');
  await page.click('#rl-apply');
  await page.waitForTimeout(120);
  const errDisp2 = await page.$eval('#rl-dh-err', (e) => getComputedStyle(e).display);
  assert(errDisp2 !== 'none', '非法机型定义应弹出报错框（断计算样式）');
  assert((await page.textContent('#rl-dh-err')).indexOf('关节类型') >= 0, '报错信息应指出关节类型不对');
  await ck('非法 DSL');
  await page.click('#rl-reset-dh');
  await page.waitForTimeout(80);
  const dhText = await page.inputValue('#rl-dh');
  assert(dhText.indexOf('J R 0.67183') >= 0, '重置后应回到 Puma560 的 DH 表');
  await ck('重置 DSL');
  const modText = dhText.replace('J R 0 0.4318 0', 'J R 0 0.5 0');
  assert(modText !== dhText, 'DSL 文本里应能找到 a2 = 0.4318 那一行');
  await page.fill('#rl-dh', modText);
  await page.click('#rl-apply');
  await page.waitForTimeout(200);
  await setJoints(ORACLE.pumaA.q_deg);
  near(parseFloat(await readVal('#rl-pose-read', 0)), ORACLE.pumaMod.xyz[0], 2e-5, '改 a2 后末端 X（对 rtb 同参数模型）');
  near(parseFloat(await readVal('#rl-pose-read', 2)), ORACLE.pumaMod.xyz[2], 2e-5, '改 a2 后末端 Z');
  await ck('应用自定义 DSL');
  await page.selectOption('#rl-model-sel', 'puma560');
  await page.waitForTimeout(150);

  await ck('换机型与 DSL');

  // ---------- 8. localStorage 持久化 ----------
  await page.selectOption('#rl-model-sel', 'ur10');
  await page.waitForTimeout(150);
  await page.reload({ waitUntil: 'load' });
  await page.waitForSelector('#rl-model-sel');
  assert((await page.inputValue('#rl-model-sel')) === 'ur10', '刷新后应记住选中的机型');
  await page.selectOption('#rl-model-sel', 'puma560');
  await page.waitForTimeout(150);

  await ck('持久化');

  // ---------- 9. 结构守卫 ----------
  // 9a 控件最小尺寸：逐个标签页扫（隐藏面板里的控件对守卫双重失明 —— 2026-08-09 教训）
  let ctlSeen = 0;
  for (const t of TABS) {
    await openTab(t);
    const bad = await page.$$eval('#rl-pane-' + t + ' input, #rl-pane-' + t + ' select, #rl-pane-' + t + ' button', (els) => {
      const out = [];
      let seen = 0;
      for (const e of els) {
        const cs = getComputedStyle(e);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const r = e.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        seen++;
        const isCheck = e.type === 'checkbox';
        const minW = isCheck ? 18 : (e.tagName === 'BUTTON' ? 52 : 100);
        if (r.width < minW - 0.5 || r.height < 18 - 0.5) {
          out.push(`${e.tagName}${e.id ? '#' + e.id : ''} ${r.width.toFixed(0)}x${r.height.toFixed(0)} (需 ≥${minW}x18)`);
        }
      }
      return { bad: out, seen };
    });
    ctlSeen += bad.seen;
    assert(bad.bad.length === 0, `${t} 页有塌缩的控件：` + bad.bad.join('; '));
  }
  assert(ctlSeen >= 50, `逐页累计扫到的控件数偏少（${ctlSeen}），守卫可能什么都没扫到`);

  // 9b text-transform 必须断计算样式（扫文本测不出 CSS 改写 —— 2026-09-13 教训）
  for (const t of TABS) {
    await openTab(t);
    const upper = await page.$$eval('#rl-pane-' + t + ' th, #rl-pane-' + t + ' label, #rl-pane-' + t + ' dt, #rl-pane-' + t + ' .rl-rk', (els) =>
      els.filter((e) => {
        const cs = getComputedStyle(e);
        return cs.display !== 'none' && cs.textTransform === 'uppercase';
      }).map((e) => e.textContent.slice(0, 20)));
    assert(upper.length === 0, `${t} 页有被 text-transform:uppercase 改写的标签：` + upper.join('|'));
  }

  // 9c 窄屏横向不溢出：逐视口 × 逐标签页（2026-08-27 教训）
  for (const vw of [390, 768]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of TABS) {
      await openTab(t);
      await page.waitForTimeout(60);
      const info = await page.evaluate(() => {
        const de = document.documentElement;
        const over = de.scrollWidth - de.clientWidth;
        if (over <= 1) return { over };
        const culprits = [];
        for (const e of document.querySelectorAll('#rl-main *')) {
          const r = e.getBoundingClientRect();
          if (r.right > de.clientWidth + 1) culprits.push(`${e.tagName}.${(e.className || '').toString().split(' ')[0]}@${r.right.toFixed(0)}`);
          if (culprits.length > 6) break;
        }
        return { over, culprits };
      });
      assert(info.over <= 1, `${vw}px 下 ${t} 页横向溢出 ${info.over}px，元凶：` + (info.culprits || []).join(', '));
    }
  }
  await page.setViewportSize({ width: 1280, height: 850 });

  // 9d 卡片内的代码井不该被横向切掉
  for (const t of TABS) {
    await openTab(t);
    const cut = await page.$$eval('#rl-pane-' + t + ' .rl-well, #rl-pane-' + t + ' .rl-ta', (els) =>
      els.filter((e) => getComputedStyle(e).display !== 'none' && e.scrollWidth - e.clientWidth > 2)
        .map((e) => (e.id || e.className) + ' 溢出 ' + (e.scrollWidth - e.clientWidth)));
    assert(cut.length === 0, `${t} 页的代码井被切掉：` + cut.join('; '));
  }

  // 9e 读数格里的文字不能越出格子（2026-08-11 教训）
  for (const t of TABS) {
    await openTab(t);
    const esc2 = await page.$$eval('#rl-pane-' + t + ' .rl-rcell', (cells) => {
      const out = [];
      for (const c of cells) {
        const cb = c.getBoundingClientRect();
        for (const k of c.children) {
          const b = k.getBoundingClientRect();
          if (b.right > cb.right + 1.5 || b.left < cb.left - 1.5 || b.bottom > cb.bottom + 1.5) {
            out.push(k.textContent.slice(0, 18) + ` 越出读数格 ${(b.right - cb.right).toFixed(1)}px`);
          }
        }
      }
      return out;
    });
    assert(esc2.length === 0, `${t} 页读数格里的文字越界：` + esc2.join('; '));
  }

  // 9f 每张图上的文字两两不相交，且确实画出了足够多的标签
  let textTotal = 0;
  for (const t of TABS) {
    await openTab(t);
    const r = await page.$$eval('#rl-pane-' + t + ' svg', (svgs) => {
      let n = 0;
      const bad = [];
      for (const s of svgs) {
        const ts = [...s.querySelectorAll('text')];
        n += ts.length;
        const bs = ts.map((e) => ({ t: e.textContent, r: e.getBoundingClientRect() }));
        for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
          const a = bs[i].r, b = bs[j].r;
          const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (ox > 0.5 && oy > 0.5) bad.push(`「${bs[i].t}」×「${bs[j].t}」`);
        }
      }
      return { n, bad: bad.slice(0, 6) };
    });
    textTotal += r.n;
    assert(r.bad.length === 0, `${t} 页图上文字重叠：` + r.bad.join(', '));
  }
  assert(textTotal >= 120, `全站 SVG 文字标签总数偏少（${textTotal}），避让器可能把标签全丢了`);

  // 9g 轨迹曲线必须真的画出折线（不是空图）
  await openTab('traj');
  const polyPts = await page.$eval('#rl-tchart-0 svg', (svg) => {
    const ps = [...svg.querySelectorAll('polyline')].filter((p) => p.getAttribute('fill') === 'none');
    return ps.map((p) => p.getAttribute('points').trim().split(/\s+/).length);
  });
  assert(polyPts.length === 6 && polyPts.every((n) => n >= 40), `位置曲线应有 6 条各 ≥40 点，实际 ${JSON.stringify(polyPts)}`);

  assert(errs.length === 0, '页面抛了异常：' + errs.join(' | '));

  // 缩略图
  await openTab('pose');
  await page.selectOption('#rl-model-sel', 'puma560');
  await page.waitForTimeout(120);
  await setJoints([30, -55, 40, 0, 50, 0]);
  await page.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 362); });
  await page.waitForTimeout(250);
  await screenshot('thumb.png');
};
