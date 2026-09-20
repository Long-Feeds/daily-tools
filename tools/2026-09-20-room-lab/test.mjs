/* 房间声学工作台 · Room Lab —— 真实浏览器集成测试。
 * ORACLE 块由 oracle/inject_oracle.mjs 机械注入（来源：pyroomacoustics / acoustics 的 ISO 9613-1 /
 * scipy eigsh / scipy solve_ivp+quad），块外一个手打的魔数都没有。 */
const ORACLE = /*ORACLE_BEGIN*/{"default":{"W":4.2,"Dp":5.8,"H":2.7,"tempC":22,"rh":55,"pres":101.3,"usage":"meeting","mat":{"zLo":"wood_slab","zHi":"gypsum","yLo":"plaster","yHi":"plaster","xLo":"plaster","xHi":"glass_thick"},"extras":{"person":2,"sofa":2,"shelf":0,"bed":0},"fmax":300,"src":[1.3,0.7,1.2],"mic":[2.1,2.9,1.15],"band":4,"order":10,"fs":16000,"airabs":true,"scanmax":2,"sbirmax":400,"fiber":"gw_med","sigma":18000,"thick":50,"gap":50,"cmp":"gw50"},"c":344.3687416765674,"V":65.772,"S":102.72,"bands":[63,125,250,500,1000,2000,4000,8000],"sabine":[0.8712713770348882,0.8700315874632795,1.70305181447772,1.7441928065807444,1.724123817470063,1.4124939956280536,1.1073903791644095,0.79072797996424],"eyring":[0.8251100597567073,0.8239980781783581,1.6701994672260163,1.7177231439460796,1.7012816090273029,1.388998329937709,1.0857175044540197,0.7796156131429562],"millington":[0.7701941322214424,0.7692251558302056,1.6538939552552319,1.7117495619979264,1.6990222071220782,1.3859888893671322,1.0823795081711962,0.777892991758225],"A":[11.35602,11.35602,4.9251000000000005,4.3164,4.056000000000001,5.013600000000001,6.127800000000001,6.127800000000001],"extraA":[0.76,0.76,1.2,1.56,1.76,1.88,1.8399999999999999,1.8399999999999999],"airA":[0.006391127705150608,0.023665487757644214,0.07665484176784637,0.17907150313268497,0.3099578512853002,0.5838900770622047,1.5698572118933265,5.3893975493979225],"abar":[0.11055315420560746,0.11055315420560746,0.047946845794392526,0.042021028037383175,0.039485981308411224,0.04880841121495328,0.05965537383177571,0.05965537383177571],"Tmid":1.7095023764866912,"BR":0.7295098210188982,"schroeder":322.43659483593535,"roomConstant":4.222738992945756,"criticalDistance":0.4098993120615748,"nModes":250,"nAxial":21,"modes20":[[29.68696048935926,0,1,0,"axial"],[40.99627877101993,1,0,0,"axial"],[50.616306623142286,1,1,0,"tangential"],[59.37392097871852,0,2,0,"axial"],[63.771989199364334,0,0,1,"axial"],[70.34331687900861,0,1,1,"tangential"],[72.15232058262777,1,2,0,"tangential"],[75.81267360748478,1,0,1,"tangential"],[81.41791634899408,1,1,1,"oblique"],[81.99255754203986,2,0,0,"axial"],[87.13282446260393,0,2,1,"tangential"],[87.20146280528495,2,1,0,"tangential"],[89.06088146807778,0,3,0,"axial"],[96.29550338360629,1,2,1,"oblique"],[98.04353870063126,1,3,0,"tangential"],[101.23261324628457,2,2,0,"tangential"],[103.87322127828982,2,0,1,"tangential"],[108.0322253858789,2,1,1,"oblique"],[109.53861060975186,0,3,1,"tangential"],[116.95897608728465,1,3,1,"oblique"]],"rir":{"n_images":1561,"t30":0.18802098934255637,"t20":0.19200214286885448,"C50":1.6464450482398243,"C80":12.348360989183217,"D50":0.5936579411451735,"Ts":0.04282887342855499,"direct_dist":2.3414739233043806,"rir_len":2880},"sbir":{"n_freq":208,"ripple":35.100640873103025,"deepest_db":-18.037533191196307,"deepest_f":339.02819019498156,"n_images":25},"absorber":{"rho0":1.1956305493906914,"c0":344.3687416765674,"random":[0.07322622156822176,0.22821192839007218,0.5407732512590804,0.8419185388841233,0.9363437013606961,0.9465261212709637,0.9694810654881262,0.9767045182848202],"normal":[0.07738264890953428,0.243562437206847,0.593039190110352,0.9015036385132611,0.9040528734210811,0.9364875258924156,0.9880363398730282,0.9860815388489111],"nrc":0.8},"airAlpha1k":0.005116652391435359,"offline":{"assertions":1332,"ism":15010,"rir":8215,"air":400,"abs":480}}/*ORACLE_END*/;

export default async function ({ page, toolURL, screenshot, assert }) {
  const errs = [];
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#rl-kpis-room .rl-kpi');
  await page.waitForTimeout(150);

  const O = ORACLE;
  const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-12);
  const near = (a, b, tol, msg) =>
    assert(Math.abs(a - b) <= tol, `${msg}: 实测 ${a} vs 真值 ${b}（容差 ${tol}，Δ=${Math.abs(a - b).toExponential(2)}）`);
  const nearRel = (a, b, r, msg) =>
    assert(rel(a, b) <= r, `${msg}: 实测 ${a} vs 真值 ${b}（相对容差 ${r}，实测 ${rel(a, b).toExponential(2)}）`);
  const numOf = (s) => { const m = String(s).replace(/[−–]/g, '-').match(/-?\d+(\.\d+)?([eE][-+]?\d+)?/); return m ? Number(m[0]) : NaN; };
  /* 页面上的读数是**四舍五入过**的：容差下界必须是显示位数的半个最小单位，
     否则 0.76 显示成 "0.8" 就会把一条对的断言卡红（2026-09-09 教训的配套）。
     dp = 该读数显示的小数位数；额外再给 0.2% 的相对余量。 */
  const nearDisp = (a, b, dp, msg) => {
    const tol = 0.5 * Math.pow(10, -dp) + Math.abs(b) * 2e-3;
    assert(Math.abs(a - b) <= tol, `${msg}: 实测 ${a} vs 真值 ${b}（显示 ${dp} 位小数 ⇒ 容差 ${tol.toPrecision(3)}，Δ=${Math.abs(a - b).toExponential(2)}）`);
  };

  const TABS = ['room', 'modes', 'rir', 'place', 'abs', 'doc'];
  /* 隐藏面板里的控件对「尺寸守卫」和 fill/check 双重失明（2026-08-09 教训）：
     碰任何非当前面板的控件之前，先切到那个面板。 */
  const onTab = async (t, fn) => {
    await page.click('#rl-tab-' + t);
    await page.waitForTimeout(120);
    if (fn) return await fn();
  };
  const kpiMap = async (sel) => Object.fromEntries(await page.$$eval(sel + ' .rl-kpi', (ns) =>
    ns.map((n) => [n.querySelector('dt').textContent.trim(), n.querySelector('dd').textContent.trim()])));
  const rowsOf = async (sel) => page.$$eval(sel + ' tbody tr', (rs) =>
    rs.map((r) => [...r.querySelectorAll('td')].map((c) => c.textContent.trim())));

  // ───────── 0. 页面骨架 ─────────
  const head = await page.evaluate(() => ({
    doctype: !!document.doctype, vp: !!document.querySelector('meta[name=viewport]'),
    title: document.title, back: !!document.querySelector('a[href="../../"]'),
    lang: document.documentElement.lang,
  }));
  assert(head.doctype, '有 <!doctype html>');
  assert(head.vp, '有 viewport meta');
  assert(head.lang === 'zh-CN', 'html lang=zh-CN');
  assert(/Room Lab/.test(head.title), `标题含 Room Lab（实测 "${head.title}"）`);
  assert(head.back, '顶部有「← 返回工具集」链接');

  // ───────── 1. 默认状态与 Python 侧一致 ─────────
  const def = await page.evaluate(() => window.RoomLabUI.DEFAULT);
  for (const k of ['W', 'Dp', 'H', 'tempC', 'rh', 'pres', 'fmax', 'band', 'order', 'fs', 'sigma', 'thick', 'gap']) {
    near(def[k], O.default[k], 1e-9, `DEFAULT.${k}`);
  }
  assert(def.usage === O.default.usage, `DEFAULT.usage = ${O.default.usage}`);
  for (const w of ['zLo', 'zHi', 'yLo', 'yHi', 'xLo', 'xHi']) {
    assert(def.mat[w] === O.default.mat[w], `DEFAULT.mat.${w} = ${O.default.mat[w]}`);
  }
  for (let i = 0; i < 3; i++) {
    near(def.src[i], O.default.src[i], 1e-9, `DEFAULT.src[${i}]`);
    near(def.mic[i], O.default.mic[i], 1e-9, `DEFAULT.mic[${i}]`);
  }

  // ───────── 2. 房间与混响 ─────────
  const kRoom = await kpiMap('#rl-kpis-room');
  nearDisp(numOf(kRoom['容积 V']), O.V, 1, '容积 V');
  nearDisp(numOf(kRoom['内表面积 S']), O.S, 1, '内表面积 S');
  nearDisp(numOf(kRoom['Tmid（Eyring）']), O.Tmid, 2, '中频混响 Tmid');
  nearDisp(numOf(kRoom['低频比 BR']), O.BR, 2, '低频比 BR');
  nearDisp(numOf(kRoom['Schroeder 频率']), O.schroeder, 0, 'Schroeder 频率');
  nearDisp(numOf(kRoom['临界距离']), O.criticalDistance, 2, '临界距离');

  const rtRows = await rowsOf('#rl-tbl-rt');
  assert(rtRows.length === 8, `混响表 8 个倍频程（实测 ${rtRows.length}）`);
  for (let b = 0; b < 8; b++) {
    const r = rtRows[b];
    assert(numOf(r[0]) === O.bands[b], `第 ${b + 1} 行是 ${O.bands[b]} Hz`);
    nearDisp(numOf(r[1]), O.A[b], 1, `${O.bands[b]}Hz 面材吸声量 A`);
    nearDisp(numOf(r[2]), O.extraA[b], 1, `${O.bands[b]}Hz 家具吸声量`);
    nearDisp(numOf(r[3]), O.airA[b], 2, `${O.bands[b]}Hz 空气吸收 4mV`);
    nearDisp(numOf(r[4]), O.abar[b], 3, `${O.bands[b]}Hz 平均吸声系数 ᾱ`);
    nearDisp(numOf(r[5]), O.sabine[b], 2, `${O.bands[b]}Hz Sabine`);
    nearDisp(numOf(r[6]), O.eyring[b], 2, `${O.bands[b]}Hz Eyring`);
    nearDisp(numOf(r[7]), O.millington[b], 2, `${O.bands[b]}Hz Millington`);
    assert(numOf(r[5]) >= numOf(r[6]) - 1e-9, `${O.bands[b]}Hz 页面上 Sabine ≥ Eyring`);
  }
  const verdict = await page.textContent('#rl-verdict-title');
  assert(/偏长/.test(verdict), `默认这间未处理的房间判定为混响偏长（实测 "${verdict}"）`);
  const t3 = await page.textContent('#rl-term-3');
  nearDisp(numOf(t3.split('500 Hz')[1]), O.eyring[3], 2, '终端行里的 500 Hz 混响');

  // ───────── 3. 驻波与模态 ─────────
  await onTab('modes');
  const kMod = await kpiMap('#rl-kpis-modes');
  assert(numOf(kMod['≤300 Hz 模态数']) === O.nModes, `≤300 Hz 模态数 = ${O.nModes}`);
  assert(numOf(kMod['其中轴向']) === O.nAxial, `其中轴向 = ${O.nAxial}`);
  nearDisp(numOf(kMod['最低模态']), O.modes20[0][0], 1, '最低模态频率');
  const modeRows = await rowsOf('#rl-tbl-modes');
  assert(modeRows.length === 20, `模态表 20 行（实测 ${modeRows.length}）`);
  const TYPE = { axial: '轴向', tangential: '切向', oblique: '斜向' };
  for (let i = 0; i < 20; i++) {
    nearDisp(numOf(modeRows[i][2]), O.modes20[i][0], 1, `第 ${i + 1} 个模态频率`);
    assert(modeRows[i][1] === `${O.modes20[i][1]},${O.modes20[i][2]},${O.modes20[i][3]}`,
      `第 ${i + 1} 个模态下标 = ${O.modes20[i][1]},${O.modes20[i][2]},${O.modes20[i][3]}（实测 ${modeRows[i][1]}）`);
    assert(modeRows[i][3] === TYPE[O.modes20[i][4]], `第 ${i + 1} 个模态类型 = ${TYPE[O.modes20[i][4]]}`);
  }
  const axRows = await rowsOf('#rl-tbl-axial');
  assert(axRows.length >= 5, `轴向间距表至少 5 行（实测 ${axRows.length}）`);
  const modeLines = await page.$$eval('#rl-fig-modes line', (ns) => ns.length);
  assert(modeLines >= O.nModes, `模态图画出至少 ${O.nModes} 根竖线（实测 ${modeLines}）`);

  // ───────── 4. 脉冲响应（先关掉空气吸收，与 pra 的口径对齐）─────────
  await onTab('rir');
  await page.uncheck('#rl-in-airabs');
  await page.waitForTimeout(250);
  const kRir = await kpiMap('#rl-kpis-rir');
  assert(numOf(kRir['镜像声源']) === O.rir.n_images, `镜像声源个数 = ${O.rir.n_images}（pra 同口径）`);
  assert(rel(numOf(kRir['T30']), O.rir.t30) <= 0.06, `T30 对 pra.measure_rt60: 实测 ${numOf(kRir['T30'])} vs ${O.rir.t30}`);
  assert(rel(numOf(kRir['T20']), O.rir.t20) <= 0.06, `T20 对 pra.measure_rt60: 实测 ${numOf(kRir['T20'])} vs ${O.rir.t20}`);
  nearDisp(numOf(kRir['C50']), O.rir.C50, 1, 'C50 对 pra 的 RIR 上跑 ISO 3382 定义式');
  nearDisp(numOf(kRir['C80']), O.rir.C80, 1, 'C80 对 pra 的 RIR 上跑 ISO 3382 定义式');
  const t2 = await page.textContent('#rl-term-r2');
  nearDisp(numOf(t2.split('D50')[1]), O.rir.D50 * 100, 1, 'D50 (%)');
  nearDisp(numOf(t2.split('Ts')[1]), O.rir.Ts * 1000, 1, '重心时间 Ts (ms)');
  const arr = await rowsOf('#rl-tbl-arr');
  assert(arr.length === 12, `最早到达表 12 行（实测 ${arr.length}）`);
  assert(arr[0][0] === '直达' && numOf(arr[0][1]) === 0, '第一行是直达声、延迟 0 ms');
  nearDisp(numOf(arr[0][2]), O.rir.direct_dist, 2, '直达路程');
  for (let i = 1; i < 12; i++) {
    assert(numOf(arr[i][1]) >= numOf(arr[i - 1][1]) - 1e-9, `第 ${i + 1} 行延迟不小于上一行`);
    assert(numOf(arr[i][4]) <= 0.001, `第 ${i + 1} 行反射的相对直达电平 ≤ 0 dB`);
  }
  // 截断有效性：默认这间活房间 10 阶一定不够，必须给出警示并把 T30 标灰
  const warnTxt = await page.textContent('#rl-rir-warn');
  assert(/读数被截断/.test(warnTxt), `10 阶在 T60≈1.7 s 的房间里必然不够，应给出截断警示（实测 "${warnTxt.slice(0, 40)}…"）`);
  const t30Grey = await page.$eval('#rl-kpis-rir', (n) => {
    const kp = [...n.querySelectorAll('.rl-kpi')].find((k) => k.querySelector('dt').textContent.trim() === 'T30');
    const sp = kp.querySelector('dd span');
    return sp ? getComputedStyle(sp).color : null;
  });
  assert(t30Grey === 'rgb(163, 163, 163)', `截断时 T30 读数应被标灰（实测 ${t30Grey}）`);
  const tValid = numOf((await kpiMap('#rl-kpis-rir'))['有效到']);
  assert(tValid > 0 && tValid < 1000, `有效时间是个有限正数（实测 ${tValid} ms）`);
  // 提高阶数，有效时间必须变长
  await page.fill('#rl-in-order', '14');
  await page.waitForTimeout(500);
  const tValid2 = numOf((await kpiMap('#rl-kpis-rir'))['有效到']);
  assert(tValid2 > tValid, `阶数 10 → 14 后有效时间变长（${tValid} → ${tValid2} ms）`);
  await page.fill('#rl-in-order', String(O.default.order));
  await page.check('#rl-in-airabs');
  await page.waitForTimeout(400);

  // ───────── 5. 摆位与反射点 ─────────
  await onTab('place');
  const kPl = await kpiMap('#rl-kpis-place');
  nearDisp(numOf(kPl['音箱离前墙']), O.default.src[1], 2, '音箱离前墙');
  nearDisp(numOf(kPl['干涉起伏']), O.sbir.ripple, 1, '20–400 Hz 干涉起伏（对 pra 镜像做的复数求和）');
  nearDisp(numOf(kPl['最深陷落']), O.sbir.deepest_db, 1, '最深陷落电平');
  nearDisp(numOf(kPl['陷落频率']), O.sbir.deepest_f, 0, '最深陷落频率');
  const frp = await rowsOf('#rl-tbl-frp');
  assert(frp.length === 6, `首次反射点表 6 行（实测 ${frp.length}）`);
  for (const r of frp) {
    const xyz = r[1].split(',').map(numOf);
    if (isNaN(xyz[0])) continue;
    const onWall = [Math.abs(xyz[0]), Math.abs(xyz[0] - O.default.W), Math.abs(xyz[1]),
      Math.abs(xyz[1] - O.default.Dp), Math.abs(xyz[2]), Math.abs(xyz[2] - O.default.H)].some((d) => d < 0.006);
    assert(onWall, `${r[0]} 的反射点落在某个墙面上（实测 ${r[1]}）`);
    assert(numOf(r[2]) >= -1e-9, `${r[0]} 的反射延迟 ≥ 0（实测 ${r[2]} ms）`);
    assert(numOf(r[3]) <= 1e-9, `${r[0]} 的反射相对直达 ≤ 0 dB（实测 ${r[3]}）`);
  }
  /* 「落在墙面上」这一条太松：把镜像点直接写成墙上的点也能过（2026-09-20 改坏验证实撞）。
     真正的判据是反射定律 —— 折线 src→P→mic 的长度必须等于镜像路程，且 P 是该墙面上
     使折线最短的那一点（费马原理，对任何实现都成立）。 */
  const law = await page.evaluate(() => {
    const S = window.RoomLabUI.state(), R = window.RoomLab;
    const d = [S.W, S.Dp, S.H], out = [];
    const pts = R.firstReflectionPoints(d, S.src, S.mic);
    const len = (p) => Math.hypot(S.src[0] - p[0], S.src[1] - p[1], S.src[2] - p[2]) +
                       Math.hypot(S.mic[0] - p[0], S.mic[1] - p[1], S.mic[2] - p[2]);
    for (const p of pts) {
      if (!p.valid) continue;
      const L = len(p.point);
      if (Math.abs(L - p.pathLen) > 1e-6) { out.push(`${p.wall} 折线长 ${L.toFixed(6)} ≠ 镜像路程 ${p.pathLen.toFixed(6)}`); continue; }
      // 在墙面内沿两个切向各扰动一点，折线只能更长
      const axis = { xLo: 0, xHi: 0, yLo: 1, yHi: 1, zLo: 2, zHi: 2 }[p.key];
      for (const t of [0, 1, 2]) {
        if (t === axis) continue;
        for (const dd of [0.02, -0.02]) {
          const q = p.point.slice(); q[t] += dd;
          if (q[t] < 0 || q[t] > d[t]) continue;
          if (len(q) < L - 1e-9) out.push(`${p.wall} 沿轴${t} 偏 ${dd} 后折线更短（${len(q).toFixed(6)} < ${L.toFixed(6)}）`);
        }
      }
    }
    return { n: pts.filter((p) => p.valid).length, bad: out };
  });
  assert(law.n >= 4, `至少 4 个有效反射点参与反射定律检验（实测 ${law.n}）`);
  assert(law.bad.length === 0, `每个反射点都满足反射定律且是墙面上的最短路径点（违反：${law.bad.join(' | ')}）`);
  const planX = await page.$$eval('#rl-fig-plan path', (ns) => ns.length);
  assert(planX >= 4, `俯视图画出反射路径与反射点标记（实测 ${planX} 条 path）`);
  // 「套用推荐距离」必须真的把音箱挪到扫描出来的那个位置，且起伏确实变小
  const before = numOf((await kpiMap('#rl-kpis-place'))['干涉起伏']);
  const rec = numOf((await kpiMap('#rl-kpis-place'))['推荐离前墙']);
  await page.click('#rl-btn-applybest');
  await page.waitForTimeout(400);
  const kPl2 = await kpiMap('#rl-kpis-place');
  near(numOf(kPl2['音箱离前墙']), rec, 0.011, '套用推荐距离后音箱真的挪过去了');
  assert(numOf(kPl2['干涉起伏']) <= before + 1e-6, `套用推荐距离后起伏不变差（${before} → ${numOf(kPl2['干涉起伏'])} dB）`);

  // ───────── 6. 吸声构造 ─────────
  await onTab('abs');
  const absRows = await rowsOf('#rl-tbl-abs');
  assert(absRows.length === 8, `吸声系数表 8 行（实测 ${absRows.length}）`);
  for (let b = 0; b < 8; b++) {
    nearDisp(numOf(absRows[b][1]), O.absorber.random[b], 3, `${O.bands[b]}Hz 无规入射 α（对 ODE + scipy.quad）`);
    nearDisp(numOf(absRows[b][2]), O.absorber.normal[b], 3, `${O.bands[b]}Hz 法向入射 α（对 ODE）`);
    assert(numOf(absRows[b][1]) >= 0 && numOf(absRows[b][1]) <= 1, `${O.bands[b]}Hz 无规 α 落在 [0,1]`);
  }
  const kAbs = await kpiMap('#rl-kpis-abs');
  nearDisp(numOf(kAbs['NRC']), O.absorber.nrc, 2, 'NRC（ASTM C423 四频带平均取 0.05 整数倍）');
  // 求解面积必须真的能把混响压到目标：拿页面自己算出来的「处理后」去比目标
  const solveRows = await rowsOf('#rl-tbl-solve');
  assert(solveRows.length === 8, `处理方案表 8 行（实测 ${solveRows.length}）`);
  const kSol = await kpiMap('#rl-kpis-solve');
  const area = numOf(kSol['需要面积']);
  assert(area > 1, `解出的处理面积 > 1 m²（实测 ${area}）`);
  const afterMid = numOf(kSol['处理后 Tmid']);
  assert(afterMid < numOf(kSol['处理前 Tmid']), `处理后中频混响比处理前短（${numOf(kSol['处理前 Tmid'])} → ${afterMid} s）`);
  // 目标值从「房间与混响」页现场读，不写死 —— 两页的口径必须是同一个
  const tgtMid = numOf((await onTab('room', () => kpiMap('#rl-kpis-room')))['目标 Tmid']);
  await onTab('abs');
  assert(afterMid <= tgtMid * 1.05, `处理后中频混响落到目标 ${tgtMid} s 附近（实测 ${afterMid} s）`);
  // 面积锚在中频：500/1000 Hz 处理后必须落在目标上，且低频缺口要如实报出来
  const solveHead = await page.$$eval('#rl-tbl-solve thead th', (ns) => ns.map((n) => n.textContent.trim()));
  assert(solveHead.length === 6, `处理方案表 6 列（实测 ${solveHead.length}）`);
  const anchorMarked = (await rowsOf('#rl-tbl-solve')).filter((r) => /锚/.test(r[0])).map((r) => numOf(r[0]));
  assert(anchorMarked.length === 2 && anchorMarked[0] === 500 && anchorMarked[1] === 1000,
    `锚点标在 500 / 1000 Hz（实测 ${anchorMarked.join(',')}）`);
  const tgtRows = await onTab('room', () => rowsOf('#rl-tbl-rt'));
  await onTab('abs');
  const solveRows2 = await rowsOf('#rl-tbl-solve');
  // 面积取两个锚点带里需求较大的那个 ⇒ 该带正好压到目标，另一带只会更短
  const hits = [3, 4].map((b) => numOf(solveRows2[b][4]) / numOf(tgtRows[b][8]));
  assert(Math.abs(Math.max(...hits) - 1) <= 0.06,
    `需求较大的锚点带正好压到目标（比值 ${Math.max(...hits).toFixed(3)}）`);
  assert(Math.min(...hits) <= 1.02, `另一个锚点带不超过目标（比值 ${Math.min(...hits).toFixed(3)}）`);
  for (const b of [3, 4]) {
    assert(/达标/.test(solveRows2[b][5]), `锚点带 ${O.bands[b]}Hz 判定为达标（实测 ${solveRows2[b][5]}）`);
  }
  for (let b = 0; b < 8; b++) {
    assert(numOf(solveRows2[b][4]) <= numOf(tgtRows[b][6]) + 1e-9,
      `${O.bands[b]}Hz 处理后不比处理前长（${numOf(tgtRows[b][6])} → ${numOf(solveRows2[b][4])} s）`);
  }
  assert(numOf(kSol['占内表面']) < 60, `推荐面积不该是「内表面铺满」（实测 ${numOf(kSol['占内表面'])} %）`);
  const lowGap = numOf(kSol['125 Hz 还差']);
  assert(lowGap >= 0, `125 Hz 缺口是非负的（实测 ${lowGap} m² Sabine）`);
  assert(/锚在 500/.test(await page.textContent('#rl-solve-note')), '说明里讲清了面积锚在中频');
  // 改厚度 → 低频吸声必须变好（物理单调性，页面现场跑）
  const a125Before = numOf((await rowsOf('#rl-tbl-abs'))[1][1]);
  await page.fill('#rl-in-thick', '150');
  await page.waitForTimeout(400);
  const a125After = numOf((await rowsOf('#rl-tbl-abs'))[1][1]);
  assert(a125After > a125Before, `50mm → 150mm 后 125 Hz 吸声变好（${a125Before} → ${a125After}）`);
  await page.fill('#rl-in-thick', String(O.default.thick));
  await page.waitForTimeout(350);

  // ───────── 7. 说明页：能力清单逐项现场跑 ─────────
  await onTab('doc');
  const caps = await page.$$eval('#rl-doc-caps li', (ns) => ns.map((n) => n.getAttribute('data-cap')));
  assert(caps.length >= 14, `能力清单至少 14 条（实测 ${caps.length}）`);
  /* 「广告了但不存在」的能力任何功能测试都测不到（2026-08-28 教训）：
     把清单当数据源遍历，每一条都在引擎上现场调用一次，拿不到有限结果就红。 */
  const dead = await page.evaluate((capIds) => {
    const R = window.RoomLab, out = [];
    const fin = (v) => typeof v === 'number' && isFinite(v);
    const dims = [4.2, 5.8, 2.7], sp = [1.3, 0.7, 1.2], mp = [2.1, 2.9, 1.15], c = 344.37;
    const surf = ['xLo', 'xHi', 'yLo', 'yHi', 'zLo', 'zHi'].map(() => ({ area: 10, alpha: R.BANDS.map(() => 0.2) }));
    const rev = R.reverberation({ volume: 65, surfaces: surf, extras: [], c: c, tempC: 22, rh: 55, pressure: 101.3 });
    const refl = {}; ['xLo', 'xHi', 'yLo', 'yHi', 'zLo', 'zHi'].forEach((k) => { refl[k] = R.BANDS.map(() => 0.9); });
    const imgs = R.imageSources(dims, sp, mp, 4, refl);
    const ml = R.modes(4.2, 5.8, 2.7, c, 200);
    const layers = [{ kind: 'porous', d: 0.05, sigma: 18000 }, { kind: 'air', d: 0.05 }];
    const built = R.buildRIR(imgs, c, 16000, { band: 4, mAir: 0 });
    const dec = R.decayAnalysis(built.rir, 16000, built.t0);
    const check = {
      sabine: () => fin(rev.rows[4].sabine) && fin(rev.rows[4].eyring) && fin(rev.rows[4].millington),
      air: () => fin(R.airAttenuation(1000, 22, 55, 101.3)) && fin(R.soundSpeed(22)),
      modes: () => ml.length > 10 && ml.every((m) => ['axial', 'tangential', 'oblique'].indexOf(m.type) >= 0),
      bonello: () => R.bonello(ml, 20, 200).bands.length > 5 && typeof R.pointInPoly(1.5, 2.1, R.BOLT_POLY) === 'boolean',
      schroeder: () => fin(R.schroederFreq(0.5, 65)) && fin(R.roomConstant(100, 0.2)) &&
        fin(R.criticalDistance(25, 2)) && fin(R.splVsDistance(2, 25, 2)),
      ism: () => imgs.length === 129 && Array.isArray(imgs[0].damping) && imgs[0].damping.length === 8,
      rir: () => built.rir.length > 100 && fin(R.fracDelayKernel(0.3, new Float64Array(R.FDL))[40]),
      iso3382: () => fin(dec.EDT) && fin(dec.T20) && fin(dec.T30) && fin(dec.C50) && fin(dec.C80) &&
        fin(dec.D50) && fin(dec.Ts),
      valid: () => fin(R.ismValidity(dims, sp, mp, 4, c).tValid) && fin(R.orderNeeded(65, 100, c, 1.5, 35)),
      sbir: () => fin(R.sbir(dims, sp, mp, refl, [40, 80], c, 2)[0].db),
      modal: () => fin(R.modalResponse(dims, sp, mp, ml, [50, 60], c, 0.5)[0].db),
      frp: () => R.firstReflectionPoints(dims, sp, mp).length === 6,
      miki: () => fin(R.mikiProps(500, 18000, 1.2, 343).Zc[0]) &&
        fin(R.absorptionAt(500, layers, 0, 1.2, 343)) && fin(R.randomIncidenceAbsorption(500, layers, 1.2, 343)),
      nrc: () => Math.abs(R.nrc(0.22, 0.54, 0.84, 0.94) - 0.65) < 1e-9,
      solve: () => fin(R.solveTreatment(rev, R.targetCurve(R.USAGES[2]), R.BANDS.map(() => 0.8), null).area),
    };
    for (const id of capIds) {
      let okc = false;
      try { okc = !!(check[id] && check[id]()); } catch (e) { okc = false; }
      if (!okc) out.push(id);
    }
    return out;
  }, caps);
  assert(dead.length === 0, `能力清单每一条都在引擎上真的跑得通（跑不通的：${dead.join(', ') || '无'}）`);
  // 页面公布的对拍规模钉死成离线套件实测出来的那几个字面量（异源）
  const verify = await page.textContent('#rl-doc-verify');
  assert(numOf(verify.split('引擎、用 node:vm 复跑，')[1]) === O.offline.assertions,
    `说明页公布的离线断言条数 = ${O.offline.assertions}`);
  assert(numOf(verify.split('镜像声源 ')[1]) === O.offline.ism, `公布的镜像标量数 = ${O.offline.ism}`);
  assert(numOf(verify.split('脉冲响应 ')[1]) === O.offline.rir, `公布的 RIR 样本数 = ${O.offline.rir}`);
  assert(numOf(verify.split('大气吸收 ')[1]) === O.offline.air, `公布的大气吸收点数 = ${O.offline.air}`);
  assert(numOf(verify.split('吸声构造 ')[1]) === O.offline.abs, `公布的吸声标量数 = ${O.offline.abs}`);

  // ───────── 8. 交互：改尺寸 / 比例预设 / 分享 / localStorage ─────────
  await onTab('room');
  await page.fill('#rl-in-W', '3.60');
  await page.waitForTimeout(350);
  const V2 = numOf((await kpiMap('#rl-kpis-room'))['容积 V']);
  nearDisp(V2, 3.6 * O.default.Dp * O.default.H, 1, '改宽度后容积跟着变');
  await onTab('modes');
  await page.click('#rl-ratio-0');
  await page.waitForTimeout(400);
  await onTab('room');
  const kR3 = await kpiMap('#rl-kpis-room');
  near(numOf(kR3['容积 V']), O.default.H * (O.default.H * 1.4) * (O.default.H * 1.9), 0.06,
    '套用 Louden 比例后容积 = H × 1.4H × 1.9H');
  await page.click('#rl-btn-reset');
  await page.waitForTimeout(400);
  nearDisp(numOf((await kpiMap('#rl-kpis-room'))['容积 V']), O.V, 1, '「恢复示例」把房间还原');

  // 分享码 round-trip fuzz：编码后解码必须逐字段一致
  const fuzz = await page.evaluate(() => {
    const U = window.RoomLabUI, mats = ['plaster', 'gypsum', 'carpet_pad', 'gw100', 'tile', 'glass_win'];
    let seed = 987654321;
    const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    let bad = 0, n = 0;
    for (let i = 0; i < 800; i++) {
      const st = JSON.parse(JSON.stringify(U.DEFAULT));
      st.W = +(2 + rnd() * 10).toFixed(2); st.Dp = +(2 + rnd() * 12).toFixed(2); st.H = +(2 + rnd() * 3).toFixed(2);
      st.tempC = Math.round(rnd() * 40 - 5); st.rh = Math.round(5 + rnd() * 90); st.pres = +(80 + rnd() * 25).toFixed(1);
      st.order = 1 + Math.floor(rnd() * 16); st.fs = [8000, 16000, 32000][Math.floor(rnd() * 3)];
      st.band = Math.floor(rnd() * 8); st.airabs = rnd() > 0.5; st.fmax = 60 + Math.floor(rnd() * 500);
      st.sigma = 1000 + Math.floor(rnd() * 70000); st.thick = 10 + Math.floor(rnd() * 300); st.gap = Math.floor(rnd() * 400);
      ['zLo', 'zHi', 'yLo', 'yHi', 'xLo', 'xHi'].forEach((k) => { st.mat[k] = mats[Math.floor(rnd() * mats.length)]; });
      ['person', 'sofa', 'shelf', 'bed'].forEach((k) => { st.extras[k] = Math.floor(rnd() * 30); });
      for (let j = 0; j < 3; j++) { st.src[j] = +(rnd() * 3).toFixed(2); st.mic[j] = +(rnd() * 3).toFixed(2); }
      const back = U.decodeState(U.encodeState(st));
      n++;
      if (!back || JSON.stringify(back) !== JSON.stringify(st)) bad++;
    }
    return { n, bad };
  });
  assert(fuzz.bad === 0, `分享码 round-trip ${fuzz.n} 组 0 失配（实测失配 ${fuzz.bad}）`);
  // 坏码不许把页面弄崩
  const badCode = await page.evaluate(() => {
    const U = window.RoomLabUI;
    return ['', 'zzz', '!!!!', btoa('[1,2]'), btoa('not json')].map((c) => U.decodeState(c) === null);
  });
  assert(badCode.every(Boolean), '非法分享码一律返回 null，不抛异常');
  // localStorage 真的存住了
  const persisted = await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('rl-state-v1')); } catch (e) { return null; }
  });
  assert(persisted && Math.abs(persisted.W - O.default.W) < 1e-9, 'localStorage 里存着当前房间尺寸');

  // ───────── 9. 渲染守卫 ─────────
  // 9a. [hidden] 必须真的藏住（断计算样式，不是断属性）
  await onTab('room');
  const hid = await page.evaluate(() => {
    const out = {};
    for (const t of ['room', 'modes', 'rir', 'place', 'abs', 'doc']) {
      const p = document.getElementById('rl-pane-' + t);
      out[t] = { hidden: p.hidden, display: getComputedStyle(p).display };
    }
    return out;
  });
  assert(hid.room.display !== 'none', '当前面板可见');
  for (const t of ['modes', 'rir', 'place', 'abs', 'doc']) {
    assert(hid[t].display === 'none', `未选中的 ${t} 面板计算样式 display=none（实测 ${hid[t].display}）`);
  }
  // 9b. 控件最小尺寸 —— 逐页签扫一遍（藏在别的面板里的控件对守卫失明）
  let scanned = 0;
  for (const t of TABS) {
    await onTab(t);
    const bad = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('input, select, button')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        const isCheck = el.type === 'checkbox';
        const minW = isCheck ? 18 : el.tagName === 'BUTTON' ? 52 : 100;
        if (r.width < minW || r.height < 18) out.push(`${el.tagName}#${el.id || '(无id)'} ${r.width.toFixed(1)}×${r.height.toFixed(1)}`);
      }
      return { bad: out, n: document.querySelectorAll('input, select, button').length };
    });
    scanned += bad.n;
    assert(bad.bad.length === 0, `${t} 页可见控件都没被压塌（塌缩的：${bad.bad.join(' | ')}）`);
  }
  assert(scanned >= 60, `六个页签累计扫到 ≥60 个控件（实测 ${scanned}，太少说明守卫根本没扫到东西）`);
  // 9c. text-transform 必须是 none（断计算样式；扫文本是恒绿的，2026-09-13 实证）
  for (const t of TABS) {
    await onTab(t);
    const upper = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('th, dt, label, .rl-figcap, .rl-legend span')) {
        if (!el.getClientRects().length) continue;
        const tt = getComputedStyle(el).textTransform;
        if (tt !== 'none') out.push(`${el.tagName}.${el.className} → ${tt}`);
      }
      return out;
    });
    assert(upper.length === 0, `${t} 页没有 text-transform 改写单位符号（命中：${upper.join(' | ')}）`);
  }
  // 9d. 图上的文字两两不相交（Placer 的实际效果，断渲染盒不是断属性）
  for (const [tab, figs] of [['room', ['rl-fig-rt']], ['modes', ['rl-fig-modes', 'rl-fig-bonello', 'rl-fig-bolt']],
    ['rir', ['rl-fig-rir', 'rl-fig-edc']], ['place', ['rl-fig-plan', 'rl-fig-sbir', 'rl-fig-scan']],
    ['abs', ['rl-fig-abs', 'rl-fig-after']]]) {
    await onTab(tab);
    for (const fig of figs) {
      const res = await page.evaluate((id) => {
        const svg = document.getElementById(id);
        const ts = [...svg.querySelectorAll('text')].filter((t) => t.textContent.trim());
        const bs = ts.map((t) => ({ s: t.textContent, r: t.getBoundingClientRect() }));
        const hits = [];
        for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
          const a = bs[i].r, b = bs[j].r;
          if (a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5)
            hits.push(`"${bs[i].s}" ∩ "${bs[j].s}"`);
        }
        const box = svg.getBoundingClientRect();
        const outside = bs.filter((b) => b.r.left < box.left - 1 || b.r.right > box.right + 1 ||
          b.r.top < box.top - 1 || b.r.bottom > box.bottom + 1).map((b) => b.s);
        return { n: bs.length, hits, outside };
      }, fig);
      assert(res.n >= 3, `${fig} 至少画出 3 段文字（实测 ${res.n}）`);
      assert(res.hits.length === 0, `${fig} 上的文字两两不重叠（重叠：${res.hits.join(' | ')}）`);
      assert(res.outside.length === 0, `${fig} 上的文字都在画布内（越界：${res.outside.join(' | ')}）`);
    }
  }
  // 9e. 表格不许横向撑破卡片；KPI 读数不许溢出小格
  for (const t of TABS) {
    await onTab(t);
    const over = await page.evaluate(() => {
      const out = [];
      for (const w of document.querySelectorAll('.rl-tablewrap')) {
        if (!w.getClientRects().length) continue;
        const card = w.closest('.rl-card');
        if (w.getBoundingClientRect().right > card.getBoundingClientRect().right + 1) out.push('表格撑破卡片');
      }
      for (const kp of document.querySelectorAll('.rl-kpi')) {
        if (!kp.getClientRects().length) continue;
        const dd = kp.querySelector('dd');
        if (dd.scrollWidth > dd.clientWidth + 1) out.push(`KPI「${kp.querySelector('dt').textContent.trim()}」读数被挤出格子`);
      }
      return out;
    });
    assert(over.length === 0, `${t} 页表格与 KPI 都没溢出（${over.join(' | ')}）`);
  }
  // 9e2. 桌面宽度下卡片里的表格不许横向滚动 —— overflow-x:auto 会把「表头被裁掉半个字」
  //      藏得严严实实（首轮实撞两处：窄侧栏里的反射点表与处理方案表）。窄屏才允许滚。
  for (const t of TABS) {
    await onTab(t);
    const clipped = await page.evaluate(() => {
      const out = [];
      for (const w of document.querySelectorAll('.rl-tablewrap')) {
        if (!w.getClientRects().length) continue;
        if (w.scrollWidth > w.clientWidth + 1) {
          const th = [...w.querySelectorAll('th')].map((x) => x.textContent.trim()).join('/');
          out.push(`${w.scrollWidth}>${w.clientWidth} [${th}]`);
        }
      }
      return out;
    });
    assert(clipped.length === 0, `1280px 下「${t}」页的表格都放得下、不用横向滚（放不下的：${clipped.join(' | ')}）`);
  }
  // 9f. 窄屏逐视口 × 逐页签不许整页横向溢出（1280 下网格有富余，测不出来）
  for (const vw of [390, 768]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of TABS) {
      await onTab(t);
      const res = await page.evaluate(() => {
        const de = document.documentElement, over = de.scrollWidth - de.clientWidth;
        const who = [];
        if (over > 1) {
          for (const el of document.querySelectorAll('body *')) {
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.right > de.clientWidth + 1) who.push(`${el.tagName}.${(el.className || '').toString().slice(0, 26)}@${r.right.toFixed(0)}`);
            if (who.length > 5) break;
          }
        }
        return { over, who };
      });
      assert(res.over <= 1, `${vw}px 下「${t}」页不横向溢出（溢出 ${res.over}px；越界元素：${res.who.join(', ')}）`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 1000 });
  await onTab('room');
  await page.waitForTimeout(200);

  assert(errs.length === 0, `全程零页面错误（实测：${errs.join(' | ')}）`);
  await screenshot('thumb.png');
}
