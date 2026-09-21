/* 光伏系统设计工作台 · 集成测试
 * 真值全部由 ../../../../.agents/cron/daily-website/runs/<run>/oracle/inject_oracle.mjs 机械注入
 * 下面的 ORACLE 块（源头是 pvlib 的独立实现），块外一个手打的数都没有。 */

const ORACLE = {
 "bj_ghi_annual": 1443.0844,
 "bj_scale": [
  0.7761894202285712,
  0.7547292396472025,
  0.8345353447650552,
  0.8050210359141896,
  0.7739264824551495,
  0.664374809060206,
  0.6195658740849087,
  0.6575818486489492,
  0.6939328941535938,
  0.7109186027766133,
  0.7343784716028097,
  0.8102724159946761
 ],
 "bj_best_tilt": 34,
 "bj_best_tilt_poa": 1654.744681695515,
 "bj_best_az": 180,
 "bj_best_az_poa": 1654.7547660253333,
 "bj_poa_eff_35_180": 1654.7547660253333,
 "jkm410_stc": {
  "i_sc": 10.813060306756253,
  "v_oc": 50.400010911427444,
  "i_mp": 9.689999408749282,
  "v_mp": 42.30001112889638,
  "p_mp": 409.88708282909397
 },
 "hit345_stc": {
  "i_sc": 6.179999462883855,
  "v_oc": 71.59999710457669,
  "i_mp": 5.759999893739662,
  "v_mp": 60.09999875610285,
  "p_mp": 346.17598644890626
 },
 "fs6435_stc": {
  "i_sc": 2.5499999808222067,
  "v_oc": 219.60002100506063,
  "i_mp": 2.3699999100724556,
  "v_mp": 183.6000191777079,
  "p_mp": 435.13202894046884
 },
 "bj_tcell_design": 75.65250409250096,
 "jkm410_cold": {
  "i_sc": 10.520786181572387,
  "v_oc": 58.55111299595069,
  "i_mp": 9.417254269711918,
  "v_mp": 50.86313661925144,
  "p_mp": 478.9910904985863
 },
 "jkm410_hot": {
  "i_sc": 11.128517262700665,
  "v_oc": 41.45754016014405,
  "i_mp": 9.888704059485942,
  "v_mp": 33.21637058711318,
  "p_mp": 328.4668586661756
 },
 "jkm410_hot400": {
  "i_sc": 4.458995023570809,
  "v_oc": 39.25859587490697,
  "i_mp": 3.967814696986336,
  "v_mp": 32.090431899418874,
  "p_mp": 127.32888732315335
 },
 "jkm410_cold200": {
  "i_sc": 2.1089424141655018,
  "v_oc": 55.76714149234772,
  "i_mp": 1.8918336688786808,
  "v_mp": 49.440104254863016,
  "p_mp": 93.53245382222198
 },
 "bj_pitch_over_width": 2.3577221414343943,
 "bj_noshade_gcr": 0.42413818932523517,
 "bj_noshade_at": {
  "hour": 9,
  "solar_time": 9.294444622696387,
  "zen": 73.72151605293897,
  "azi": 141.5636971562675,
  "psz": 69.55462645127896
 },
 "bj_pipeline": {
  "city": "beijing",
  "tilt": 35,
  "azimuth": 180,
  "mod": "jkm410",
  "inv": "primo15",
  "mps": 13,
  "strings": 3,
  "ninv": 1,
  "gcr": 0.4,
  "row_shading": true,
  "diffuse": "perez",
  "iam": "physical",
  "mount": "open_rack_glass_glass",
  "albedo": 0.2,
  "ghi_annual": 1443.0844,
  "poa_bare_annual": 1669.1535006921756,
  "poa_annual": 1662.8673841686086,
  "poa_eff_annual": 1654.7547660253333,
  "dc_raw": 25328.099306360124,
  "dc_annual": 24449.214260429428,
  "ac_raw": 23619.795848867878,
  "ac_annual": 23266.679900927305,
  "kwp": 15.985593000000001,
  "specific": 1455.478060834359,
  "pr": 0.8752821028852287,
  "tcell_max": 43.48489269884339,
  "tcell_avg": 23.923546902040545,
  "masking": 8.347518704329723,
  "scale": [
   0.7761894202285712,
   0.7547292396472025,
   0.8345353447650552,
   0.8050210359141896,
   0.7739264824551495,
   0.664374809060206,
   0.6195658740849087,
   0.6575818486489492,
   0.6939328941535938,
   0.7109186027766133,
   0.7343784716028097,
   0.8102724159946761
  ],
  "monthly_ac": [
   1726.5651783741782,
   1713.8408991578115,
   2447.8506158380583,
   2389.854556128908,
   2415.2356709444803,
   1948.259906660541,
   1828.1236730144308,
   1913.6284221809358,
   1876.7876595052662,
   1789.754756235246,
   1556.892763784747,
   1659.8857991027016
  ],
  "monthly_poa": [
   114.64475762754572,
   115.44340740298436,
   170.59932509950852,
   171.8922138547628,
   179.14041431891005,
   146.35868654045115,
   138.18886525242252,
   143.96999991056313,
   138.1254063504748,
   127.07246920376699,
   106.58705593719301,
   110.84478267002561
  ],
  "sun_hours": 4356
 },
 "bj_econ": {
  "capex": 51153.897600000004,
  "payback": 4.691262172624405,
  "payback_disc": 6,
  "npv": 106929.14174824486,
  "irr": 0.21354331045869157,
  "lcoe": 0.1907549481804662,
  "total_gen": 544847.8975986145,
  "total_net": 231780.9136134448,
  "year1_rev": 11307.60643185067
 },
 "sg_pipeline": {
  "city": "singapore",
  "tilt": 10,
  "azimuth": 180,
  "mod": "cs430",
  "inv": "se7600",
  "mps": 10,
  "strings": 2,
  "ninv": 1,
  "gcr": 0.5,
  "row_shading": true,
  "diffuse": "perez",
  "iam": "physical",
  "mount": "close_mount_glass_glass",
  "albedo": 0.2,
  "ghi_annual": 1675.9307,
  "poa_bare_annual": 1662.8380063026884,
  "poa_annual": 1661.5379706856838,
  "poa_eff_annual": 1656.3523606532594,
  "dc_raw": 12492.61007976227,
  "dc_annual": 12059.116509994514,
  "ac_raw": 11918.388636009098,
  "ac_annual": 11681.212702152518,
  "kwp": 8.61606,
  "specific": 1355.7487647663222,
  "pr": 0.815960145771951,
  "tcell_max": 60.03628339234429,
  "tcell_avg": 43.794627497569515,
  "masking": 3.7941642622848346,
  "scale": [
   0.6886453896258959,
   0.7757115534024362,
   0.746920748870225,
   0.7313624708559914,
   0.7279686910712421,
   0.7142699166046598,
   0.7053768754323505,
   0.7129874454708898,
   0.6688258901074177,
   0.6601207037504385,
   0.6620199649876406,
   0.6411616370478327
  ],
  "monthly_ac": [
   1023.8716319223131,
   1037.1786627484307,
   1111.4116275185636,
   1009.0464555836531,
   953.4931689918722,
   879.1859674252316,
   916.1059822618083,
   953.1596247519565,
   931.6232520193955,
   988.7008161265375,
   933.3053279151434,
   944.1301848876113
  ],
  "monthly_poa": [
   144.47399863182335,
   147.90965763384074,
   159.36020964199912,
   145.0295947623695,
   136.36835539446918,
   124.96435348279817,
   129.77963291806986,
   135.0828063144736,
   132.1695031471747,
   140.83641350052062,
   132.56459415101062,
   132.99885110713439
  ],
  "sun_hours": 4380
 },
 "scalars": 157394,
 "assertions": 495,
 "failures": 0
};

const R2 = (a, b, tol) => Math.abs(a - b) / Math.max(1e-12, Math.abs(b)) <= tol;
const num = (t) => parseFloat(String(t).replace(/[^0-9.\-]/g, ''));

export default async ({ page, toolURL, screenshot, assert }) => {
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(toolURL, { waitUntil: 'load' });
  await page.waitForSelector('#sl-tiles dd', { timeout: 30000 });
  await page.waitForFunction(() => document.querySelectorAll('.sl-tab').length === 6);

  const txt = async (sel) => (await page.textContent(sel)).trim();
  const tile = async (i) => {
    const t = await page.$$eval('#sl-tiles > div', (ns) => ns.map((n) => ({
      dt: n.querySelector('dt').textContent, dd: n.querySelector('dd').textContent,
      sub: n.querySelector('.sl-sub').textContent })));
    return t[i];
  };
  const kvOf = async (panel, label) => page.$$eval(`#sl-panel-${panel} .sl-kv > div`, (ns, l) => {
    for (const n of ns) if (n.querySelector('dt').textContent.trim() === l) {
      const dd = n.querySelector('dd');
      const small = dd.querySelector('small');
      return { v: dd.childNodes[0].textContent.trim(), sub: small ? small.textContent.trim() : '' };
    }
    return null;
  }, label);
  const showTab = async (t) => { await page.click(`#sl-tab-${t}`); await page.waitForTimeout(250);
    await page.waitForFunction((id) => !document.getElementById(id).hidden, `sl-panel-${t}`); };

  /* ── 1. 顶部读数 = pvlib 独立实现的年发电量 ── */
  const t0 = await tile(0);
  assert(t0.dt.trim() === 'ANNUAL AC ENERGY', '第一块瓦片是年交流电量');
  assert(R2(num(t0.dd), ORACLE.bj_pipeline.ac_annual, 5e-5),
    `默认配置年交流电量 ${t0.dd} ≈ pvlib 的 ${ORACLE.bj_pipeline.ac_annual.toFixed(1)} kWh`);
  assert(R2(num(t0.sub.split('装机')[1]), ORACLE.bj_pipeline.kwp, 1e-3),
    `装机容量 ${t0.sub} ≈ ${ORACLE.bj_pipeline.kwp} kWp`);
  const t1 = await tile(1);
  assert(R2(num(t1.dd), ORACLE.bj_pipeline.specific, 5e-4), `比发电量 ${t1.dd} ≈ ${ORACLE.bj_pipeline.specific.toFixed(1)}`);
  assert(R2(num(t1.sub.split('PR')[1]), ORACLE.bj_pipeline.pr * 100, 2e-3), `系统效率 PR ${t1.sub}`);
  const t2 = await tile(2);
  assert(R2(num(t2.dd), ORACLE.bj_econ.payback, 2e-3), `静态回收期 ${t2.dd} ≈ ${ORACLE.bj_econ.payback.toFixed(3)} 年`);
  assert(R2(num(t2.sub.split('LCOE')[1]), ORACLE.bj_econ.lcoe, 5e-3), `LCOE ${t2.sub}`);
  const t3 = await tile(3);
  assert(t3.dd.includes('全部通过'), `默认配置的组串校核应全部通过（实际「${t3.dd}」）`);

  /* ── 2. 太阳资源页：辐照总量与月度表 ── */
  await showTab('resource');
  const ghi = await kvOf('resource', '水平面年总辐照');
  assert(R2(num(ghi.v), ORACLE.bj_ghi_annual, 1e-3),
    `年水平面辐照 ${ghi.v} ≈ pvlib 逐时积分的 ${ORACLE.bj_ghi_annual.toFixed(1)} kWh/m²`);
  const monRows = await page.$$eval('#sl-tbl-climate tbody tr',
    (ns) => ns.map((n) => [...n.querySelectorAll('td')].map((td) => td.textContent.trim())));
  assert(monRows.length === 12, `月度表 12 行（实际 ${monRows.length}）`);
  for (let m = 0; m < 12; m++) {
    assert(R2(parseFloat(monRows[m][4]), ORACLE.bj_scale[m], 2e-3),
      `${m + 1} 月缩放因子 ${monRows[m][4]} ≈ ${ORACLE.bj_scale[m].toFixed(4)}`);
  }
  // 异源核对：表里 12 个月的模型月总量之和必须等于 KV 里的年总量（两边各自独立渲染）
  const monSum = monRows.reduce((a, r) => a + parseFloat(r[8]), 0);
  assert(R2(monSum, ORACLE.bj_ghi_annual, 2e-3), `月度表末列之和 ${monSum.toFixed(1)} ≈ 年总量`);

  /* ── 3. 阵列页：最优倾角 / 方位 / 无遮挡行距 ── */
  await showTab('array');
  const bt = await kvOf('array', '最优倾角（当前方位）');
  assert(num(bt.v) === ORACLE.bj_best_tilt, `最优倾角 ${bt.v} = pvlib 扫描的 ${ORACLE.bj_best_tilt}°`);
  assert(R2(num(bt.sub), ORACLE.bj_best_tilt_poa, 1e-3), `最优倾角处阵面辐照 ${bt.sub}`);
  const poaCur = await kvOf('array', '当前阵面年辐照');
  assert(R2(num(poaCur.v), ORACLE.bj_pipeline.poa_annual, 2e-3), `当前阵面年辐照 ${poaCur.v}`);
  const sp = await kvOf('array', '冬至无遮挡最小行距');
  assert(R2(num(sp.v), ORACLE.bj_pitch_over_width, 1e-3),
    `无遮挡最小行距 ${sp.v} ≈ 解析式的 ${ORACLE.bj_pitch_over_width.toFixed(4)} 倍板宽`);
  assert(R2(num(sp.sub.split('≤')[1]), ORACLE.bj_noshade_gcr, 1e-3), `对应 GCR ${sp.sub}`);
  // 三种安装形式对照：双轴 ≥ 单轴 ≥ 固定（物理性质，不依赖任何实现）
  const forms = await page.$$eval('#sl-tbl-forms tbody tr',
    (ns) => ns.slice(0, 3).map((n) => [...n.querySelectorAll('td')].map((td) => td.textContent.trim())));
  const fPoa = forms.map((r) => parseFloat(r[1].replace(/,/g, '')));
  assert(fPoa[2] >= fPoa[1] && fPoa[1] >= fPoa[0],
    `双轴 ${fPoa[2]} ≥ 单轴 ${fPoa[1]} ≥ 固定 ${fPoa[0]} kWh/m²`);
  assert(R2(fPoa[0], ORACLE.bj_pipeline.poa_annual, 2e-3), '固定倾角那一行 = 当前配置');

  /* ── 4. 组件页：STC 读数必须等于 pvlib 的单二极管解 ── */
  await showTab('module');
  const stc = await kvOf('module', 'STC 最大功率');
  assert(R2(num(stc.v), ORACLE.jkm410_stc.p_mp, 1e-4),
    `晶科 JKM410 的 STC Pmp ${stc.v} ≈ pvlib 的 ${ORACLE.jkm410_stc.p_mp.toFixed(3)} W`);
  const vi = await kvOf('module', 'STC 电压 / 电流');
  assert(R2(parseFloat(vi.v.split('V')[0]), ORACLE.jkm410_stc.v_mp, 2e-3), `Vmp ${vi.v}`);
  assert(R2(num(vi.sub.split('·')[0].replace('Voc', '')), ORACLE.jkm410_stc.v_oc, 1e-3), `Voc ${vi.sub}`);
  // 14 款组件表：逐行对 pvlib（抽三款钉死，其余断范围）
  const modRows = await page.$$eval('#sl-tbl-modules tbody tr',
    (ns) => ns.map((n) => [...n.querySelectorAll('td')].map((td) => td.textContent.trim())));
  assert(modRows.length >= 14, `组件对照表至少 14 行（实际 ${modRows.length}）`);
  const byName = (kw) => modRows.find((r) => r[0].includes(kw));
  assert(R2(parseFloat(byName('JKM410')[2]), ORACLE.jkm410_stc.p_mp, 1e-3), 'JKM410 行的 Pmp');
  assert(R2(parseFloat(byName('HIT')[2]), ORACLE.hit345_stc.p_mp, 1e-3), '松下 HIT 行的 Pmp');
  assert(R2(parseFloat(byName('First Solar')[4]), ORACLE.fs6435_stc.v_oc, 1e-3), 'First Solar 行的 Voc');
  // 所有组件的功率温度系数必须为负（物理性质）
  assert(modRows.every((r) => parseFloat(r[7]) < 0), '14 款组件的功率温度系数都是负的');

  /* ── 5. 组串页：电压窗口的四个极端工况 ── */
  await showTab('system');
  const vocK = await kvOf('system', '最冷开路电压');
  const MPS = 13;
  assert(R2(num(vocK.v), ORACLE.jkm410_cold.v_oc * MPS, 1e-3),
    `最冷开路电压 ${vocK.v} ≈ pvlib 在 ${ORACLE.bj_pipeline.city} 最低温下的 ${(ORACLE.jkm410_cold.v_oc * MPS).toFixed(1)} V`);
  const vmpK = await kvOf('system', '最热工作电压');
  assert(R2(num(vmpK.v), ORACLE.jkm410_hot.v_mp * MPS, 1e-3), `最热工作电压 ${vmpK.v}`);
  const checks = await page.$$eval('#sl-panel-system .sl-checks li', (ns) => ns.map((n) => ({
    ok: n.querySelector('.sl-badge').textContent.trim(),
    label: n.querySelector('.sl-ck-label').childNodes[0].textContent.trim(),
    val: n.querySelector('.sl-ck-val').textContent.trim() })));
  assert(checks.length === 7, `校核清单 7 条（实际 ${checks.length}）`);
  assert(checks.every((c) => c.ok === '通过'), '默认配置 7 条校核全通过：'
    + checks.filter((c) => c.ok !== '通过').map((c) => c.label).join('、'));
  assert(R2(num(checks[0].val.split('/')[0]), ORACLE.jkm410_cold.v_oc * MPS, 1e-3), '第 1 条校核的数值');
  assert(R2(num(checks[1].val.split('/')[0]), ORACLE.jkm410_cold200.v_oc * MPS, 1e-3),
    '第 2 条（弱光）校核用的是 200 W/m² 的 Voc，比 1000 W/m² 更低');
  assert(ORACLE.jkm410_cold200.v_oc < ORACLE.jkm410_cold.v_oc, '物理性质：弱光下 Voc 更低');
  assert(R2(num(checks[3].val.split('/')[0]), ORACLE.jkm410_hot400.v_mp * MPS, 1e-3),
    '第 4 条（最热 + 400 W/m²）校核的数值');
  // 串长扫描表：判定列必须与三条硬限自洽
  const strRows = await page.$$eval('#sl-tbl-strings tbody tr',
    (ns) => ns.map((n) => [...n.querySelectorAll('td')].map((td) => td.textContent.trim())));
  const bad = strRows.filter((r) => {
    const n = parseInt(r[0], 10), voc = parseFloat(r[1]), vmpH = parseFloat(r[3]);
    const pass = r[6] === '可行';
    return pass !== (voc <= 800 && vmpH >= 320 && parseFloat(r[2]) <= 800);
  });
  assert(bad.length === 0, `串长扫描表的判定列与三条硬限自洽（越界 ${bad.length} 行）`);
  assert(strRows.some((r) => r[6] === '可行') && strRows.some((r) => r[6] !== '可行'),
    '串长扫描表里既有可行也有不可行的行（否则判定列恒真也会全绿）');

  /* ── 6. 产出页：损失瀑布首尾闭合 + 经济性 ── */
  await showTab('yield');
  const ac = await kvOf('yield', '年交流电量');
  assert(R2(num(ac.v), ORACLE.bj_pipeline.ac_annual, 5e-5), `年交流电量 ${ac.v}`);
  const prK = await kvOf('yield', '系统效率 PR');
  assert(R2(num(prK.v), ORACLE.bj_pipeline.pr * 100, 2e-3), `PR ${prK.v}`);
  const tmax = await kvOf('yield', '最高电池温度');
  assert(R2(num(tmax.v), ORACLE.bj_pipeline.tcell_max, 1e-3), `最高电池温度 ${tmax.v}`);
  const lossRows = await page.$$eval('#sl-tbl-loss tbody tr',
    (ns) => ns.map((n) => [...n.querySelectorAll('td')].map((td) => td.textContent.trim())));
  const ref = parseFloat(lossRows[0][1].replace(/,/g, ''));
  let acc = ref;
  for (let i = 1; i < lossRows.length - 1; i++) acc += parseFloat(lossRows[i][1].replace(/[,+]/g, ''));
  const netRow = lossRows[lossRows.length - 1];
  assert(R2(acc, parseFloat(netRow[3].replace(/,/g, '')), 2e-4),
    `损失瀑布首尾闭合：${ref.toFixed(0)} + 各级 = ${acc.toFixed(0)} ≈ 并网 ${netRow[3]}`);
  // 「累计剩余」列必须是「电量变化」列的逐行滚动累加（两列在渲染里各自算一遍，互为校验）
  let running = ref, drift = 0;
  for (let i = 1; i < lossRows.length - 1; i++) {
    running += parseFloat(lossRows[i][1].replace(/[,+]/g, ''));
    drift = Math.max(drift, Math.abs(running - parseFloat(lossRows[i][3].replace(/,/g, ''))));
  }
  assert(drift <= 1, `损失明细表的累计列逐行自洽（最大偏差 ${drift.toFixed(2)} kWh）`);
  assert(R2(parseFloat(netRow[3].replace(/,/g, '')), ORACLE.bj_pipeline.ac_annual, 1e-3),
    '瀑布末行 = pvlib 的年交流电量');
  // 倾角增益必须是正的，其余每一级都必须是损失
  const gains = lossRows.slice(1, -1).map((r) => parseFloat(r[1].replace(/[,+]/g, '')));
  assert(gains[0] > 0, `倾角增益是正的（${gains[0]}）`);
  assert(gains.slice(1).every((v) => v <= 0), '除倾角增益外每一级都是损失');
  const econKv = await kvOf('yield', '初始投资');
  assert(R2(num(econKv.v), ORACLE.bj_econ.capex, 1e-4), `初始投资 ${econKv.v}`);
  const irr = await kvOf('yield', '内部收益率 IRR');
  assert(R2(num(irr.v), ORACLE.bj_econ.irr * 100, 2e-3), `IRR ${irr.v} ≈ ${(ORACLE.bj_econ.irr * 100).toFixed(2)}%`);
  const lcoe = await kvOf('yield', '平准化度电成本 LCOE');
  assert(R2(num(lcoe.v), ORACLE.bj_econ.lcoe, 2e-3), `LCOE ${lcoe.v}`);
  const npvK = await kvOf('yield', '净现值 NPV');
  assert(R2(num(npvK.v), ORACLE.bj_econ.npv, 1e-3), `NPV ${npvK.v}`);

  /* ── 7. 真的操作：改城市 → 所有读数必须换一套 ── */
  await page.selectOption('#sl-in-city', 'singapore');
  await page.waitForTimeout(700);
  await page.waitForFunction((v) => {
    const d = document.querySelector('#sl-tiles dd');
    return d && Math.abs(parseFloat(d.textContent.replace(/,/g, '')) - v) > 1;
  }, ORACLE.bj_pipeline.ac_annual);
  const sgAc = await kvOf('yield', '年交流电量');
  assert(num(sgAc.v) > 0 && num(sgAc.v) !== ORACLE.bj_pipeline.ac_annual, '换城市后年电量确实变了');
  const sgTmax = await kvOf('yield', '最高电池温度');
  assert(num(sgTmax.v) > ORACLE.bj_pipeline.tcell_max, `新加坡电池温度 ${sgTmax.v} 高于北京`);
  await showTab('array');
  const sgBt = await kvOf('array', '最优倾角（当前方位）');
  assert(num(sgBt.v) < ORACLE.bj_best_tilt, `新加坡（北纬 1.35°）最优倾角 ${sgBt.v} 远小于北京的 ${ORACLE.bj_best_tilt}°`);
  await page.selectOption('#sl-in-city', 'sydney');
  await page.waitForTimeout(800);
  const sydAz = await page.$$eval('#sl-panel-array .sl-kv > div', (ns) => {
    for (const n of ns) if (n.querySelector('dt').textContent.includes('热力图网格最优'))
      return n.querySelector('dd').childNodes[0].textContent.trim();
    return '';
  });
  assert(/\/\s*0°/.test(sydAz) || /\/\s*(345|15)°/.test(sydAz),
    `悉尼（南半球）的最优方位应在正北附近（实际「${sydAz}」）`);
  await page.selectOption('#sl-in-city', 'beijing');
  await page.waitForTimeout(700);

  /* ── 8. 真的操作：拖倾角 → 曲线上的"当前"点跟着走，且最优点不动 ── */
  await page.$eval('#sl-in-tilt', (el) => { el.value = '70'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForTimeout(600);
  const poa70 = await kvOf('array', '当前阵面年辐照');
  assert(num(poa70.v) < ORACLE.bj_pipeline.poa_annual, `倾角 70° 的阵面辐照 ${poa70.v} 低于 35° 的`);
  const gap70 = await kvOf('array', '当前离最优差');
  assert(num(gap70.v) < -5, `倾角 70° 离最优差 ${gap70.v}（应明显为负）`);
  await page.$eval('#sl-in-tilt', (el) => { el.value = '35'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForTimeout(600);
  const backPoa = await kvOf('array', '当前阵面年辐照');
  assert(R2(num(backPoa.v), ORACLE.bj_pipeline.poa_annual, 2e-3), '拖回 35° 后读数复原');

  /* ── 9. 真的操作：换逆变器成窄窗口机型 → 校核必须报不合格 ── */
  await showTab('system');
  await page.selectOption('#sl-in-inv', 'se10000');
  await page.waitForTimeout(600);
  const narrow = await page.$$eval('#sl-panel-system .sl-checks li', (ns) => ns.map((n) => ({
    ok: n.querySelector('.sl-badge').textContent.trim(),
    label: n.querySelector('.sl-ck-label').childNodes[0].textContent.trim(),
    val: n.querySelector('.sl-ck-val').textContent.trim() })));
  assert(narrow.filter((c) => c.ok === '不合格').length > 0,
    'SolarEdge SE10000（360–480 V 窄窗口）配 13 片组串必须报不合格');
  // 只断"有几条红"是不够的：把某一条硬判成通过，总数照样 > 0。逐条断哪一条红 + 数值真的越限。
  const vocChk = narrow.find((c) => c.label.indexOf('最冷时开路电压') === 0);
  assert(vocChk && vocChk.ok === '不合格',
    `窄窗口下「最冷时开路电压 ≤ 耐压」这一条必须是不合格（实际「${vocChk && vocChk.ok}」）`);
  assert(num(vocChk.val.split('/')[0]) > num(vocChk.val.split('/')[1]),
    `不合格的那条数值确实越限：${vocChk.val}`);
  const mpptChk = narrow.find((c) => c.label.indexOf('最冷时工作电压') === 0);
  assert(mpptChk && mpptChk.ok === '不合格', '「最冷时工作电压 ≤ MPPT 上限」在窄窗口下也必须不合格');
  assert(narrow.filter((c) => c.ok === '不合格').length === 5,
    `窄窗口下恰好 5 条不合格（实际 ${narrow.filter((c) => c.ok === '不合格').length}）`);
  const t3b = await tile(3);
  assert(t3b.dd.includes('不合格'), `顶部瓦片同步显示不合格（实际「${t3b.dd}」）`);
  await page.selectOption('#sl-in-inv', 'primo15');
  await page.waitForTimeout(600);

  /* ── 10. 真的操作：换组件 → STC 读数换一套 ── */
  await showTab('module');
  await page.selectOption('#sl-in-mod', 'fs6435');
  await page.waitForTimeout(600);
  const fsStc = await kvOf('module', 'STC 最大功率');
  assert(R2(num(fsStc.v), ORACLE.fs6435_stc.p_mp, 1e-4),
    `换成 First Solar 后 STC Pmp ${fsStc.v} ≈ ${ORACLE.fs6435_stc.p_mp.toFixed(2)} W`);
  const fsVi = await kvOf('module', 'STC 电压 / 电流');
  assert(R2(parseFloat(fsVi.v.split('V')[0]), ORACLE.fs6435_stc.v_mp, 2e-3), `CdTe 的 Vmp ${fsVi.v}（薄膜串联电池多，电压高得多）`);
  await page.selectOption('#sl-in-mod', 'jkm410');
  await page.waitForTimeout(600);

  /* ── 11. 分享码往返 + localStorage ── */
  await page.$eval('#sl-in-tilt', (el) => { el.value = '22'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForTimeout(400);
  await page.click('#sl-share-btn');
  await page.waitForTimeout(300);
  const hash = await page.evaluate(() => location.hash);
  assert(/^#s=[A-Za-z0-9+/]+$/.test(hash), `分享码写进了地址栏（${hash.slice(0, 24)}…）`);
  const stored = await page.evaluate(() => localStorage.getItem('solar-lab-v1'));
  assert(stored && JSON.parse(stored).tilt === 22, `localStorage 记下了倾角 22（${stored}）`);
  // 必须开在**全新 context** 里：同 context 共用 localStorage，会让这条断言被 localStorage 兜住，
  // 即使分享码里根本没编进 tilt 也照样绿（本轮改坏验证实测）。
  const ctx2 = await page.context().browser().newContext();
  const page2 = await ctx2.newPage();
  await page2.goto(toolURL + hash, { waitUntil: 'load' });
  await page2.waitForSelector('#sl-tiles dd', { timeout: 30000 });
  await page2.waitForTimeout(900);
  assert(await page2.evaluate(() => localStorage.getItem('solar-lab-v1')) === null
    || !JSON.parse(await page2.evaluate(() => localStorage.getItem('solar-lab-v1'))).tilt === false,
    '新 context 的 localStorage 与原页面无关');
  assert(await page2.inputValue('#sl-in-tilt') === '22', '用分享链接在全新 context 里打开也恢复出倾角 22');
  await ctx2.close();
  await page.click('#sl-reset-btn');
  await page.waitForTimeout(700);
  assert(await page.inputValue('#sl-in-tilt') === '35', '「恢复默认」把倾角还原成 35');

  /* ── 12. 能力清单：逐项断言引擎里真有这个函数 ── */
  await showTab('method');
  const caps = await page.$$eval('#sl-tbl-caps tbody tr',
    (ns) => ns.map((n) => [...n.querySelectorAll('td')].map((td) => td.textContent.trim())));
  const capRows = caps.filter((r) => r[2] && r[2].endsWith('()'));
  assert(capRows.length >= 30, `能力清单至少 30 项（实际 ${capRows.length}）`);
  const dead = await page.evaluate((names) => names.filter((n) => typeof window.SL[n] !== 'function'),
    capRows.map((r) => r[2].replace('()', '')));
  assert(dead.length === 0, `能力清单里没有"广告了但不存在"的模型（缺失：${dead.join(' ')}）`);
  assert(capRows.every((r) => r[3] === '已实现'), '能力清单的状态列全部是已实现');

  /* ── 13. 结构性守卫 ── */
  // 13a. [hidden] 必须真的隐藏（断计算样式，不是断属性）
  const hiddenOk = await page.evaluate(() => {
    const p = document.getElementById('sl-panel-method');
    const other = document.getElementById('sl-panel-resource');
    return { shown: getComputedStyle(p).display, hidden: getComputedStyle(other).display,
             attr: other.hidden };
  });
  assert(hiddenOk.attr === true && hiddenOk.hidden === 'none' && hiddenOk.shown !== 'none',
    `隐藏面板的计算样式是 display:none（实际 ${hiddenOk.hidden}）`);
  // 13b. 逐页签扫控件最小尺寸（隐藏面板里的控件对尺寸守卫失明，必须逐页切过去扫）
  let scanned = 0;
  for (const t of ['resource', 'array', 'module', 'system', 'yield', 'method']) {
    await showTab(t);
    const r = await page.evaluate(() => {
      const bad = []; let n = 0;
      for (const el of document.querySelectorAll('input,select,button,a.sl-back')) {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const b = el.getBoundingClientRect();
        if (b.width === 0 && b.height === 0) continue;
        n++;
        const isCheck = el.type === 'checkbox';
        const minW = isCheck ? 18 : (el.tagName === 'BUTTON' || el.tagName === 'A' ? 52 : 100);
        if (b.width < minW - 0.5 || b.height < 18 - 0.5)
          bad.push(`${el.tagName}#${el.id || el.className} ${b.width.toFixed(1)}x${b.height.toFixed(1)}`);
      }
      return { bad, n };
    });
    scanned += r.n;
    assert(r.bad.length === 0, `${t} 页签：控件没有塌缩（越界 ${r.bad.join(' | ')}）`);
  }
  assert(scanned >= 250, `六个页签累计扫到 ${scanned} 个控件（下界 250，防止"一个都没扫到也算绿"）`);
  // 13c. 表头/标签不许被 CSS 改写大小写（断计算样式，不是断 DOM 文本）
  const upper = await page.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll('th,dt,label,caption,legend')) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none') continue;
      if (cs.textTransform !== 'none') bad.push(el.tagName + ':' + el.textContent.slice(0, 18) + '→' + cs.textTransform);
    }
    return bad;
  });
  assert(upper.length === 0, `没有任何 th/dt/label 被 text-transform 改写（越界 ${upper.join(' | ')}）`);
  // 13d. 逐视口 × 逐页签断横向不溢出
  for (const vw of [390, 768, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of ['resource', 'array', 'module', 'system', 'yield', 'method']) {
      await showTab(t);
      await page.waitForTimeout(160);
      const r = await page.evaluate(() => {
        const over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        const who = [];
        if (over > 1) for (const el of document.querySelectorAll('*')) {
          const b = el.getBoundingClientRect();
          if (b.right > document.documentElement.clientWidth + 1 && b.width > 0)
            who.push(el.tagName + '.' + (el.className || '').toString().slice(0, 20) + '@' + b.right.toFixed(0));
        }
        return { over, who: who.slice(0, 5) };
      });
      assert(r.over <= 1, `${vw}px × ${t} 页签横向不溢出（溢出 ${r.over}px，越界元素 ${r.who.join(' | ')}）`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  // 13e. 桌面宽度下表格不许横向滚动
  await showTab('resource');
  const tblOver = await page.evaluate(() => {
    const bad = [];
    for (const w of document.querySelectorAll('.sl-panel:not([hidden]) .sl-tw'))
      if (w.scrollWidth - w.clientWidth > 2) bad.push(w.scrollWidth - w.clientWidth);
    return bad;
  });
  assert(tblOver.length === 0, `桌面宽度下资源页的表格不横向滚（溢出 ${tblOver.join(',')}px）`);

  /* ── 14. 图形守卫：文字两两不相交 + 图元落在画布内 ── */
  for (const t of ['resource', 'array', 'module', 'system', 'yield']) {
    await showTab(t);
    await page.waitForTimeout(220);
    const g = await page.evaluate(() => {
      const out = [];
      for (const svg of document.querySelectorAll('.sl-panel:not([hidden]) svg.sl-fig')) {
        const box = svg.getBoundingClientRect();
        const texts = [...svg.querySelectorAll('text')].map((t) => ({
          r: t.getBoundingClientRect(), s: t.textContent }))
          .filter((o) => o.r.width > 0 && o.s.trim());
        const hits = [];
        for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
          const a = texts[i].r, b = texts[j].r;
          const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (ox > 1.5 && oy > 1.5) hits.push(`「${texts[i].s}」×「${texts[j].s}」`);
        }
        const outside = texts.filter((o) => o.r.left < box.left - 1 || o.r.right > box.right + 1
          || o.r.top < box.top - 1 || o.r.bottom > box.bottom + 1).map((o) => o.s);
        out.push({ id: svg.id, n: texts.length, hits, outside });
      }
      return out;
    });
    for (const f of g) {
      assert(f.n >= 5, `${f.id} 至少画出 5 段文字（实际 ${f.n}）`);
      assert(f.hits.length === 0, `${f.id} 的文字两两不重叠（重叠 ${f.hits.slice(0, 3).join(' ')}）`);
      assert(f.outside.length === 0, `${f.id} 的文字都在画布内（越界 ${f.outside.slice(0, 3).join(' ')}）`);
    }
  }
  // 14b. 小格子/徽标里的文字不许溢出父盒
  await showTab('system');
  const esc = await page.evaluate(() => {
    const bad = [];
    for (const li of document.querySelectorAll('#sl-panel-system .sl-checks li')) {
      const p = li.getBoundingClientRect();
      for (const ch of li.children) {
        const b = ch.getBoundingClientRect();
        if (b.right > p.right + 1 || b.left < p.left - 1 || b.bottom > p.bottom + 1)
          bad.push(ch.className + ':' + ch.textContent.slice(0, 14));
      }
    }
    return bad;
  });
  assert(esc.length === 0, `校核清单的子元素都落在行盒内（越界 ${esc.join(' | ')}）`);

  /* ── 15. 页面公布的统计数字必须异源核对 ── */
  const rcards = await page.$$eval('#sl-rcards .sl-rcard h3', (ns) => ns.map((n) => n.textContent.trim()));
  // 异源：页面上的字面量 vs 离线套件跑出来后写进 oracle/scalars.json 的实测值
  assert(parseInt(rcards[1].replace(/,/g, ''), 10) === ORACLE.scalars,
    `验证 band 公布的标量对拍点数 ${rcards[1]} = 离线套件实测的 ${ORACLE.scalars}`);
  const vrTotal = await page.$$eval('#sl-tbl-verify caption',
    (ns) => { for (const n of ns) { const m = n.textContent.match(/合计 ([\d,]+) 个标量对拍点、([\d,]+) 条断言/);
      if (m) return [parseInt(m[1].replace(/,/g, ''), 10), parseInt(m[2].replace(/,/g, ''), 10)]; } return null; });
  assert(vrTotal && vrTotal[0] === ORACLE.scalars && vrTotal[1] === ORACLE.assertions,
    `说明页「验证规模」表注的两个数 ${JSON.stringify(vrTotal)} = 离线套件实测的 [${ORACLE.scalars}, ${ORACLE.assertions}]`);
  // 性质断言：验证 band 上的条数必须等于说明页性质表的行数（页内异源）
  const propN = parseInt(rcards[3].replace(/[^0-9]/g, ''), 10);
  const propRows = await page.$$eval('#sl-tbl-props tbody tr', (ns) => ns.length);
  assert(propN === propRows, `验证 band 自称 ${propN} 条物理性质 = 说明页性质表的 ${propRows} 行`);
  const capsTable = await page.$$eval('#sl-tbl-caps tbody tr', (ns) => ns.length);
  const capsClaim = await page.$$eval('#sl-panel-method p.sl-note',
    (ns) => { for (const n of ns) { const m = n.textContent.match(/共 (\d+) 项/); if (m) return parseInt(m[1], 10); } return -1; });
  assert(capsClaim === capsTable,
    `说明页自称的能力条目数 ${capsClaim} = 表里实际行数 ${capsTable}（异源核对）`);

  assert(errs.length === 0, `页面没有抛异常（${errs.slice(0, 2).join(' | ')}）`);

  /* ── 缩略图 ── */
  await showTab('array');
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  await screenshot('thumb.png');
};
