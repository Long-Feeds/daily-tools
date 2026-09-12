// 热工工作台 · Thermo Lab —— 浏览器集成测试。
//
// 断言里的每个数值期望都来自权威实现的一次具体调用（注释标明是谁算的），不是手估：
//   · 水蒸气：CoolProp 8.0.0 的 IF97 后端 / iapws 1.5.5
//   · 湿空气：psychrolib 2.5.0（ASHRAE Handbook 2017 口径）
//   · 朗肯循环：CoolProp 与 iapws 两条独立物性路径各算一遍（两者 8 位小数一致）
//   · 换热器：ht 1.2.0 的 effectiveness_from_NTU
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('body[data-tl-ready="1"]');

  const txt = async (sel) => ((await page.locator(sel).textContent()) || '').trim();
  const val = async (sel) => {
    const t = await txt(sel);
    return Number(t.replace(/[^\d.eE+-]/g, ''));
  };
  const near = (got, want, tol, what) =>
    assert(Math.abs(got - want) <= tol, `${what}: 期望 ${want} ± ${tol}，实际 ${got}`);
  // 页面按 N 位有效数字显示 ⇒ 浏览器侧能验到的最细粒度就是「显示位的半个最小单位」，
  // 比这更紧的容差只测出格式化误差（引擎本身 1e-9~1e-12 级的精度由离线套件负责）。
  // extra 用来叠加 oracle 自身的迭代容差（如 psychrolib 的湿球/露点是 1e-3 K）。
  const quantum = (want, sig) => Math.pow(10, Math.floor(Math.log10(Math.abs(want))) - (sig - 1)) / 2;
  const nearD = (got, want, sig, what, extra) =>
    near(got, want, quantum(want, sig) + (extra || 0), `${what}（页面 ${sig} 位有效数字）`);
  const show = async (tab) => {
    await page.click(`#tl-tab-${tab}`);
    await page.waitForFunction((t) => !document.getElementById('tl-panel-' + t).hidden, tab);
  };
  const setv = async (sel, v) => { await page.fill(sel, String(v)); };

  /* ─────────── 1. 蒸汽性质：四个区域各一个点 ─────────── */
  // p=3 MPa, T=500°C（区域 2）—— CoolProp IF97: h=3457.040534856465, s=7.235592163176319,
  // v=0.11619302913323457, w=667.1396507621575, cp=2.2472284116827015
  await setv('#tl-a', 3); await setv('#tl-b', 500);
  await page.click('#tl-calc');
  assert((await txt('#tl-out-region')).includes('区域 2'), `3 MPa/500°C 应判为区域 2，实际「${await txt('#tl-out-region')}」`);
  nearD(await val('#tl-out-h'), 3457.040534856465, 7, '过热蒸汽 h');
  nearD(await val('#tl-out-s'), 7.235592163176319, 7, '过热蒸汽 s');
  nearD(await val('#tl-out-v'), 0.11619302913323457, 7, '过热蒸汽 v');
  nearD(await val('#tl-out-w'), 667.1396507621575, 7, '过热蒸汽声速 w');
  nearD(await val('#tl-out-cp'), 2.2472284116827015, 7, '过热蒸汽 c_p');
  nearD(await val('#tl-out-tsat'), 233.85844500625223, 7, '3 MPa 饱和温度');   // iapws _TSat_P(3.0)−273.15
  // 区域 1：p=3 MPa, T=26.85°C(300 K) —— 官方验证值 v=0.00100215168, h=115.331273, s=0.392294792
  await setv('#tl-b', 26.85);
  await page.click('#tl-calc');
  assert((await txt('#tl-out-region')).includes('区域 1'), '3 MPa/300 K 应判为区域 1（压缩水）');
  nearD(await val('#tl-out-h'), 115.331273, 7, '压缩水 h（IF97 官方验证值）');
  nearD(await val('#tl-out-v'), 0.00100215168, 7, '压缩水 v（IF97 官方验证值）');
  // 区域 3：p=25 MPa, T=650 K = 376.85°C —— iapws: h=1876.3591225169687, rho=488.87505207909487
  await setv('#tl-a', 25); await setv('#tl-b', 376.85);
  await page.click('#tl-calc');
  assert((await txt('#tl-out-region')).includes('区域 3'), '25 MPa/650 K 应判为区域 3');
  nearD(await val('#tl-out-h'), 1876.3591225169687, 7, '区域 3 h');
  nearD(await val('#tl-out-rho'), 488.87505207909487, 7, '区域 3 密度（由 p(ρ,T) 反解）');
  // 区域 5：p=0.5 MPa, T=1500 K = 1226.85°C —— 官方验证值 v=1.38455090, h=5219.76855, s=9.65408875
  await setv('#tl-a', 0.5); await setv('#tl-b', 1226.85);
  await page.click('#tl-calc');
  assert((await txt('#tl-out-region')).includes('区域 5'), '0.5 MPa/1500 K 应判为区域 5');
  nearD(await val('#tl-out-h'), 5219.768551208338, 7, '区域 5 h（IF97 官方验证值）');
  nearD(await val('#tl-out-v'), 1.38455089878153, 7, '区域 5 v（IF97 官方验证值）');
  // 两相：p=0.1 MPa, x=0.9 —— iapws: T=99.60591861133764°C, h=2449.1983253305552, v=1.524724585396332
  await page.selectOption('#tl-pair', 'px');
  await setv('#tl-a', 0.1); await setv('#tl-b', 0.9);
  await page.click('#tl-calc');
  assert((await txt('#tl-out-region')).includes('区域 4'), '(p,x) 应判为区域 4（两相）');
  nearD(await val('#tl-out-t'), 99.60591861133764, 7, '0.1 MPa 饱和温度');
  nearD(await val('#tl-out-h'), 2449.1983253305552, 7, '湿蒸汽 h（x=0.9）');
  nearD(await val('#tl-out-x'), 0.9, 6, '干度回读');
  // iapws @p=0.1 MPa 整数压力（Tsat=99.6059°C，不是 100°C）：hL=417.4364858162317, hV=2674.9496408321465
  nearD(await val('#tl-out-hfg'), 2257.513155015915, 7, '0.1 MPa 汽化潜热');
  // 越界要明确报错、不瞎算
  await page.selectOption('#tl-pair', 'pT');
  await setv('#tl-a', 3); await setv('#tl-b', 2500);
  await page.click('#tl-calc');
  assert((await txt('#tl-prop-alert')).includes('超出'), '2500°C 超出 IF97 范围时应给出提示');
  assert((await page.locator('#tl-prop-out .tl-ro').count()) === 0, '越界时读数区应被清空，而不是留着上一次的值');
  await setv('#tl-b', 500);
  await page.click('#tl-calc');
  assert((await page.locator('#tl-prop-out .tl-ro').count()) > 5, '改回合法输入后读数应恢复');

  /* ─────────── 2. 蒸汽表 ─────────── */
  await show('table');
  await setv('#tl-sat-from', 0); await setv('#tl-sat-to', 200); await setv('#tl-sat-step', 10);
  await page.click('#tl-sat-go');
  const satRows = page.locator('#tl-sat-table tbody tr');
  assert((await satRows.count()) === 21, `0–200°C 步长 10 应有 21 行，实际 ${await satRows.count()}`);
  const cellNum = async (row, col) => Number((await page.locator(`#tl-sat-table tbody tr:nth-child(${row}) td:nth-child(${col})`).textContent()).replace(/[^\d.eE+-]/g, ''));
  // 第 1 行 = 0°C：iapws psat=0.000611212677444345 MPa（611.657 Pa 是三相点 273.16 K 的值，不是 0°C 的）
  near(await cellNum(1, 1), 0, 1e-9, '饱和表第一行温度 = 0°C');
  nearD(await cellNum(1, 2), 0.000611212677444345, 6, '0°C 饱和压力');
  // 第 11 行 = 100°C：p=0.10141797792131013, hL=419.0991549977032, hV=2675.572029220833, hfg=2256.47287422313
  nearD(await cellNum(11, 2), 0.10141797792131013, 6, '100°C 饱和压力');
  nearD(await cellNum(11, 5), 419.0991549977032, 6, "100°C h′");
  nearD(await cellNum(11, 6), 2675.572029220833, 6, '100°C h″');
  nearD(await cellNum(11, 7), 2256.47287422313, 6, '100°C 汽化潜热');
  // 第 21 行 = 200°C：p=1.5546718682698253, hL=852.3930680834193, vV=0.12722232139614725
  nearD(await cellNum(21, 2), 1.5546718682698253, 6, '200°C 饱和压力');
  nearD(await cellNum(21, 5), 852.3930680834193, 6, "200°C h′");
  nearD(await cellNum(21, 4), 0.12722232139614725, 6, '200°C v″');
  // 非法步长
  await setv('#tl-sat-step', 0);
  await page.click('#tl-sat-go');
  assert((await txt('#tl-sat-alert')).length > 0, '步长为 0 时应报错');
  await setv('#tl-sat-step', 10);
  await page.click('#tl-sat-go');
  // 过热网格：10 MPa / 500°C —— CoolProp IF97 h=3375.0584418464086
  await setv('#tl-grid-p', '0.1, 1, 10');
  await setv('#tl-grid-t', '100, 500');
  await page.click('#tl-grid-go');
  const g = async (r, c) => Number((await page.locator(`#tl-grid-table tbody tr:nth-child(${r}) td:nth-child(${c})`).textContent()).replace(/[^\d.eE+-]/g, ''));
  nearD(await g(2, 4), 3375.0584418464086, 6, '10 MPa/500°C 的 h');
  // 100°C / 10 MPa 是压缩水（该点应有灰底）——「相态判定」在表格里是靠底色传达的
  const bg = await page.locator('#tl-grid-table tbody tr:nth-child(1) td:nth-child(4)').evaluate((el) => el.style.background);
  assert(bg !== '', '10 MPa/100°C 应被标成压缩水（有底色）');

  /* ─────────── 3. 焓湿图 ─────────── */
  await show('psy');
  await page.click('#tl-psy-clear');
  await setv('#tl-psy-t', 30);
  await page.selectOption('#tl-psy-which', 'rh');
  await setv('#tl-psy-val', 60);
  await page.click('#tl-psy-add');
  // psychrolib @30°C/60%/101325: W=0.016040902665907755, h=71.19337993619295,
  // twb=23.81248331727279, tdp=21.387990202624767, v=0.8809383181902062
  const pr = async (c) => Number((await page.locator(`#tl-psy-table tbody tr:nth-child(1) td:nth-child(${c})`).textContent()).replace(/[^\d.eE+-]/g, ''));
  nearD(await pr(4), 16.040902665907755, 5, '含湿量 d [g/kg]');
  nearD(await pr(5), 71.19337993619295, 5, '湿空气比焓 h');
  nearD(await pr(6), 23.81248331727279, 5, '湿球温度', 1.1e-3);
  nearD(await pr(7), 21.387990202624767, 5, '露点温度', 1.1e-3);
  nearD(await pr(8), 0.8809383181902062, 5, '比容 v');
  // 反推一致性：改用「湿球」作为第二参数，应得到同一个含湿量
  await page.click('#tl-psy-clear');
  await page.selectOption('#tl-psy-which', 'twb');
  await setv('#tl-psy-val', 23.81248331727279);
  await page.click('#tl-psy-add');
  nearD(await pr(4), 16.040902665907755, 5, '由湿球反推的含湿量应与由相对湿度算的一致', 2e-3);
  // 冷却除湿：35°C/60% → 13°C，风量 5000 m³/h
  // psychrolib 口径：v_in=0.9018..., mda=1.5380017681762828 kg/s，Wi=0.021441069633250022，
  // Wo=Ws(13°C)=0.009331685814251048 ⇒ Q=−82.41804256600899 kW、显热 −35.38844954434561、
  // SHR=0.4293774571994092、凝水 67.04731341052448 kg/h
  await page.click('#tl-psy-clear');
  await page.selectOption('#tl-psy-which', 'rh');
  await setv('#tl-psy-t', 35); await setv('#tl-psy-val', 60);
  await page.click('#tl-psy-add');
  await page.selectOption('#tl-psy-proc', 'coil');
  await setv('#tl-psy-arg', 13); await setv('#tl-psy-flow', 5000);
  await page.click('#tl-psy-run');
  nearD(await val('#tl-psy-out-q'), 82.41804256600899, 5, '冷却盘管冷量 [kW]');
  nearD(await val('#tl-psy-out-cond'), 67.04731341052448, 5, '凝水量 [kg/h]');
  nearD(await val('#tl-psy-out-shr'), 0.4293774571994092, 4, '热湿比 SHR');
  near(await val('#tl-psy-out-t'), 13, 1e-9, '出风干球');
  near(await val('#tl-psy-out-rh'), 100, 1e-6, '出风已饱和（φ=100%）');
  // 目标温度高于进风时，冷却过程应报错而不是算出负冷量
  await setv('#tl-psy-arg', 40);
  await page.click('#tl-psy-run');
  assert((await txt('#tl-psy-proc-alert')).length > 0, '冷却目标高于进风温度时应报错');
  await setv('#tl-psy-arg', 13);
  await page.click('#tl-psy-run');
  // 海拔改压力：psychrolib GetStandardAtmPressure(1500) = 84556.5... Pa
  await setv('#tl-psy-alt', 1500);
  await page.waitForFunction(() => Number(document.getElementById('tl-psy-p').value) < 100000);
  near(Number(await page.locator('#tl-psy-p').inputValue()), 84556, 1, '1500 m 海拔的标准大气压');
  await setv('#tl-psy-alt', 0);
  await page.waitForFunction(() => Number(document.getElementById('tl-psy-p').value) > 100000);

  /* ─────────── 4. 朗肯循环 ─────────── */
  await show('cycle');
  await setv('#tl-cy-pb', 12.7); await setv('#tl-cy-tb', 538); await setv('#tl-cy-pc', 5);
  await setv('#tl-cy-etat', 0.88); await setv('#tl-cy-etap', 0.82); await setv('#tl-cy-mdot', 400);
  await page.locator('#tl-cy-reheat').setChecked(true);
  await page.locator('#tl-cy-fw').setChecked(false);
  await setv('#tl-cy-prh', 2.4); await setv('#tl-cy-trh', 538);
  await page.click('#tl-cy-go');
  // CoolProp 与 iapws 两条独立物性路径都给出：
  // wT=1543.59431859, wP=15.52150156, wNet=1528.07281703, qIn=3815.90597417,
  // eta=0.40044824, ssc=2.35590867, x_exhaust=0.94421509, power=169785.86855869 kW
  nearD(await val('#tl-cy-eta'), 40.0448244, 5, '循环热效率 [%]');
  nearD(await val('#tl-cy-wt'), 1543.59431859, 6, '汽轮机比功');
  nearD(await val('#tl-cy-wp'), 15.52150156, 5, '泵耗比功');
  nearD(await val('#tl-cy-wnet'), 1528.07281703, 6, '净比功');
  nearD(await val('#tl-cy-qin'), 3815.90597417, 6, '吸热量');
  nearD(await val('#tl-cy-ssc'), 2.35590867, 5, '汽耗率 SSC');
  nearD(await val('#tl-cy-x'), 0.94421509, 5, '排汽干度');
  nearD(await val('#tl-cy-power'), 169.78586855869, 5, '输出功率 [MW]');
  const cyRows = page.locator('#tl-cy-table tbody tr');
  assert((await cyRows.count()) === 6, `带再热无回热应有 6 个状态点，实际 ${await cyRows.count()}`);
  // 开式回热打开后效率必须上升（同参数下回热一定提高热效率）
  const etaNoFW = await val('#tl-cy-eta');
  await page.locator('#tl-cy-fw').setChecked(true);
  await setv('#tl-cy-pfw', 0.6);
  await page.click('#tl-cy-go');
  const etaFW = await val('#tl-cy-eta');
  assert(etaFW > etaNoFW, `加开式回热后热效率应上升：无回热 ${etaNoFW}% → 有回热 ${etaFW}%`);
  assert((await val('#tl-cy-y')) > 0 && (await val('#tl-cy-y')) < 1, '抽汽率应落在 0–1');
  assert((await cyRows.count()) === 7, '带回热应多出一个抽汽状态点');
  await page.locator('#tl-cy-fw').setChecked(false);
  await page.click('#tl-cy-go');
  // 冷凝压力高于锅炉压力：必须报错
  await setv('#tl-cy-pc', 20000);
  await page.click('#tl-cy-go');
  assert((await txt('#tl-cy-alert')).length > 0, '冷凝压力高于锅炉压力时应报错');
  assert((await page.locator('#tl-cy-table tbody tr').count()) === 0, '报错时状态点表应清空');
  await setv('#tl-cy-pc', 5);
  await page.click('#tl-cy-go');
  assert((await page.locator('#tl-cy-table tbody tr').count()) === 6, '改回合法参数后状态点表应恢复');

  /* ─────────── 5. 蒸汽实务 ─────────── */
  await show('steam');
  // 闪蒸 1.0 → 0.1 MPa、2000 kg/h：iapws x=0.15293215800407808 ⇒ 闪蒸汽 305.86431600815615 kg/h
  await setv('#tl-fl-p1', 1.0); await setv('#tl-fl-p2', 0.1); await setv('#tl-fl-m', 2000);
  await page.click('#tl-fl-go');
  nearD(await val('#tl-fl-x'), 15.293215800407808, 4, '闪蒸率 [%]');
  nearD(await val('#tl-fl-steam'), 305.86431600815615, 5, '闪蒸汽量 [kg/h]');
  nearD(await val('#tl-fl-t1'), 179.88563239146663, 5, '1.0 MPa 饱和温度');
  nearD(await val('#tl-fl-t2'), 99.60591861133764, 5, '0.1 MPa 饱和温度');
  await setv('#tl-fl-p2', 2.0);
  await page.click('#tl-fl-go');
  assert((await txt('#tl-fl-alert')).length > 0, '出口压力高于入口时应报错');
  await setv('#tl-fl-p2', 0.1);
  await page.click('#tl-fl-go');
  // 减温减压 3.8 MPa/420°C → 1.0 MPa/250°C，喷水 4.2 MPa/104°C，20 t/h
  // iapws: h1=3264.5156535158776, h2=2943.2221652336634, hw=439.0192636208745
  // ⇒ ratio=0.12830169954490933、喷水 2.5660339908981866 t/h、出口 22.566033990898188 t/h
  await setv('#tl-ds-p1', 3.8); await setv('#tl-ds-t1', 420);
  await setv('#tl-ds-p2', 1.0); await setv('#tl-ds-t2', 250);
  await setv('#tl-ds-pw', 4.2); await setv('#tl-ds-tw', 104); await setv('#tl-ds-m', 20);
  await page.click('#tl-ds-go');
  nearD(await val('#tl-ds-ratio'), 0.12830169954490933, 5, '喷水比 m_w/m₁');
  nearD(await val('#tl-ds-mw'), 2.5660339908981866, 5, '喷水量 [t/h]');
  nearD(await val('#tl-ds-m2'), 22.566033990898188, 5, '出口总流量 [t/h]');
  // 1.0 MPa 的饱和温度 179.88563239146663°C ⇒ 出口过热度 250−179.8856=70.1144 K
  nearD(await val('#tl-ds-sh2'), 70.11436760853337, 4, '出口过热度');
  await setv('#tl-ds-t2', 150);   // 低于 1.0 MPa 的饱和温度 → 会带水，应报错
  await page.click('#tl-ds-go');
  assert((await txt('#tl-ds-alert')).includes('饱和温度'), '目标温度低于饱和温度时应报错并说明原因');
  await setv('#tl-ds-t2', 250);
  await page.click('#tl-ds-go');
  // 换热器 逆流 Ch=12 Cc=20 150/30 UA=18：ht ε=0.6726995772651676 ⇒ Q=968.6873912618412 kW
  await page.selectOption('#tl-hx-sub', 'counterflow');
  await setv('#tl-hx-ch', 12); await setv('#tl-hx-cc', 20);
  await setv('#tl-hx-th', 150); await setv('#tl-hx-tc', 30); await setv('#tl-hx-ua', 18);
  await page.click('#tl-hx-go');
  nearD(await val('#tl-hx-eps'), 0.6726995772651676, 5, '逆流效能 ε（ht 1.2.0）');
  nearD(await val('#tl-hx-ntu'), 1.5, 5, 'NTU = UA/Cmin');
  nearD(await val('#tl-hx-q'), 968.6873912618412, 5, '换热量 Q [kW]');
  nearD(await val('#tl-hx-tho'), 69.2760507281799, 5, '热侧出口温度');
  nearD(await val('#tl-hx-tco'), 78.43436956309206, 5, '冷侧出口温度');
  // 顺流的效能必须低于逆流（同 NTU、同 Cr）
  await page.selectOption('#tl-hx-sub', 'parallel');
  await page.click('#tl-hx-go');
  const epsPar = await val('#tl-hx-eps');
  assert(epsPar < 0.6726995772651676, `顺流效能应低于逆流：实际 ${epsPar}`);
  // ht: parallel, NTU=1.5, Cr=0.6 → 0.5683012791941172
  nearD(epsPar, 0.5683012791941172, 5, '顺流效能 ε（ht 1.2.0）');
  await page.selectOption('#tl-hx-sub', 'S&T');
  await page.waitForFunction(() => !document.getElementById('tl-hx-shell-wrap').hidden);
  await setv('#tl-hx-shells', 2);
  await page.click('#tl-hx-go');
  // ht: S&T, NTU=1.5, Cr=0.6, 2 壳程 → 0.6567082879276593
  nearD(await val('#tl-hx-eps'), 0.6567082879276593, 5, '管壳式 2 壳程效能 ε（ht 1.2.0）');
  await page.selectOption('#tl-hx-sub', 'counterflow');
  await page.click('#tl-hx-go');
  // 冷侧进口比热侧还热 → 报错
  await setv('#tl-hx-th', 20);
  await page.click('#tl-hx-go');
  assert((await txt('#tl-hx-alert')).length > 0, '热侧进口温度低于冷侧时应报错');
  await setv('#tl-hx-th', 150);
  await page.click('#tl-hx-go');

  /* ─────────── 6. 能力清单：页面承诺的每一项都要真能跑 ─────────── */
  await show('about');
  const capTotal = Number(await page.locator('#tl-cap-summary').getAttribute('data-total'));
  const capBad = Number(await page.locator('#tl-cap-summary').getAttribute('data-bad'));
  assert(capTotal >= 44, `能力清单至少 44 项，实际 ${capTotal}`);
  assert(capBad === 0, `能力清单有 ${capBad} 项跑不通`);
  assert((await page.locator('#tl-cap-list div').count()) === capTotal, '能力清单渲染条数应与自检条数一致');
  const capFail = await page.locator('#tl-cap-list .tl-cap-ok').evaluateAll((els) => els.filter((e) => /未通过/.test(e.textContent)).length);
  assert(capFail === 0, `能力清单里有 ${capFail} 项显示「未通过」`);
  // 对拍总条数：钉死成离线套件实测出来的那个字面量（异源核对——改表里任何一行都会红）
  const shownTotal = Number(await page.locator('#tl-verify-count').getAttribute('data-total'));
  assert(shownTotal === 98752, `页面公布的对拍总条数应为离线实测的 98752，实际 ${shownTotal}`);
  assert((await page.locator('#tl-spec-list dt').count()) >= 9, '数值口径至少列 9 条');

  /* ─────────── 7. 守卫：[hidden] 真的藏住了（断计算样式，不是断属性）─────────── */
  for (const t of ['prop', 'table', 'psy', 'cycle', 'steam']) {
    const disp = await page.locator(`#tl-panel-${t}`).evaluate((el) => getComputedStyle(el).display);
    assert(disp === 'none', `切到「口径」页后 #tl-panel-${t} 的计算样式应为 display:none，实际 ${disp}`);
  }
  await show('prop');
  assert((await page.locator('#tl-panel-about').evaluate((el) => getComputedStyle(el).display)) === 'none',
    '切回第一页后「口径」面板应被藏住');

  /* ─────────── 8. 守卫：图上的文字两两不重叠 + 该画的标签都画了 ─────────── */
  const overlaps = async (sel) => page.locator(sel).evaluate((svg) => {
    const boxes = [...svg.querySelectorAll('text')].map((t) => {
      const b = t.getBBox();
      return { t: t.textContent, x: b.x, y: b.y, w: b.width, h: b.height };
    });
    const bad = [];
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], c = boxes[j];
        const ix = Math.min(a.x + a.w, c.x + c.w) - Math.max(a.x, c.x);
        const iy = Math.min(a.y + a.h, c.y + c.h) - Math.max(a.y, c.y);
        if (ix > 0.6 && iy > 0.6) bad.push(`「${a.t}」×「${c.t}」`);
      }
    }
    return { count: boxes.length, bad };
  });
  const phase = await overlaps('#tl-fig-phase');
  assert(phase.count >= 10, `相图至少应画出 10 个标签，实际 ${phase.count}`);
  assert(phase.bad.length === 0, `相图上有文字重叠：${phase.bad.join('、')}`);
  // 断「画出来了几个」而不只是「没重叠」：被避让器静默丢弃的标签在「不重叠」这条上永远是绿的
  const phaseLabels = await page.locator('#tl-fig-phase text').evaluateAll((els) => els.map((e) => e.textContent));
  for (const want of ['临界点', '压缩水', '过热蒸汽']) {
    assert(phaseLabels.includes(want), `相图缺少区域标注「${want}」（实际：${phaseLabels.join(',')}）`);
  }
  await show('psy');
  const psyFig = await overlaps('#tl-fig-psy');
  assert(psyFig.count >= 25, `焓湿图至少应画出 25 个标签，实际 ${psyFig.count}`);
  assert(psyFig.bad.length === 0, `焓湿图上有文字重叠：${psyFig.bad.join('、')}`);
  // 断「画出来了几个」而不只是「掉了几个」：五条等相对湿度曲线的标注必须都在
  const rhLabels = await page.locator('#tl-fig-psy text').evaluateAll((els) => els.map((e) => e.textContent));
  for (const want of ['100%', '80%', '60%', '40%', '20%']) {
    assert(rhLabels.includes(want), `焓湿图缺少 φ=${want} 的曲线标注（实际标签：${rhLabels.join(',')}）`);
  }
  // 等焓线标注：7 条（h=0…120）至少要画出 5 条，且不能和右侧含湿量刻度混在一起
  const hLabels = await page.locator('#tl-fig-psy text[data-k="h"]').evaluateAll((els) => els.map((e) => e.textContent));
  assert(hLabels.length >= 5, `等焓线标注至少应画出 5 条，实际 ${hLabels.length} 条（${hLabels.join(',')}）`);
  const rhTagged = await page.locator('#tl-fig-psy text[data-k="rh"]').evaluateAll((els) => els.map((e) => e.textContent));
  assert(rhTagged.length === 5, `等相对湿度标注应恰好 5 条，实际 ${rhTagged.length} 条`);
  const axisZone = await page.locator('#tl-fig-psy').evaluate((svg) => {
    // 右侧 76px 是含湿量刻度带；等焓线标注不该落在这条带子里（首版就是落在这里，
    // 与右轴的 30/25/10/5 交错成一片）。只筛 data-k="h" —— 按文本内容筛会把刻度自己的
    // 「0」「20」也算进来（第一版守卫就这么误报过）。
    const vb = svg.viewBox.baseVal;
    const bad = [];
    for (const t of svg.querySelectorAll('text[data-k="h"]')) {
      const b = t.getBBox();
      if (b.x > vb.width - 76) bad.push(`${t.textContent}@x=${b.x.toFixed(0)}`);
    }
    return bad;
  });
  assert(axisZone.length === 0, `有等焓线标注落进了右侧含湿量刻度带：${axisZone.join('、')}`);
  await show('cycle');
  const tsFig = await overlaps('#tl-fig-ts');
  assert(tsFig.count >= 20, `T–s 图至少应画出 20 个标签，实际 ${tsFig.count}`);
  assert(tsFig.bad.length === 0, `T–s 图上有文字重叠：${tsFig.bad.join('、')}`);
  // 状态点标号必须真的画出来（避让器把它们全丢掉时这里会红）
  const tsLabels = await page.locator('#tl-fig-ts text').evaluateAll((els) => els.map((e) => e.textContent));
  for (const want of ['①', '②', '③', '④', '⑤']) {
    assert(tsLabels.includes(want), `T–s 图缺少状态点标号 ${want}`);
  }
  assert((await page.locator('#tl-fig-ts path.tl-path').count()) === 1, 'T–s 图应画出一条闭合的循环路径');
  assert((await page.locator('#tl-fig-ts path.tl-dome').count()) === 1, 'T–s 图应画出饱和穹顶');

  /* ─────────── 9. 守卫：控件不塌缩（逐页扫，藏着的面板也要切过去扫）─────────── */
  let scanned = 0;
  for (const t of ['prop', 'table', 'psy', 'cycle', 'steam', 'about']) {
    await show(t);
    const bad = await page.locator(`#tl-panel-${t}`).evaluate((panel) => {
      const out = [];
      let n = 0;
      for (const el of panel.querySelectorAll('input, select, button')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;      // 真正隐藏的控件不计
        n++;
        const isCheck = el.type === 'checkbox';
        const minW = isCheck ? 18 : (el.tagName === 'BUTTON' ? 52 : 100);
        if (r.width < minW || r.height < 18) out.push(`${el.tagName}#${el.id || '(无 id)'} ${r.width.toFixed(1)}×${r.height.toFixed(1)}`);
      }
      return { n, out };
    });
    scanned += bad.n;
    assert(bad.out.length === 0, `「${t}」页有控件被压小：${bad.out.join('、')}`);
  }
  assert(scanned >= 45, `六个页面累计应扫到 45 个以上可见控件，实际 ${scanned}（扫到 0 个也会「全绿」，所以要有下界）`);

  /* ─────────── 10. 守卫：窄屏不横向溢出（逐视口 × 逐页）─────────── */
  for (const vw of [390, 768]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of ['prop', 'table', 'psy', 'cycle', 'steam', 'about']) {
      await show(t);
      const info = await page.evaluate(() => {
        const over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        if (over <= 1) return { over, who: '' };
        const vwid = document.documentElement.clientWidth;
        let who = '';
        for (const el of document.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (r.right > vwid + 1 && r.width > 0) {
            const own = !el.closest('.tl-scroll') || el.classList.contains('tl-scroll');
            if (own) { who = `${el.tagName}${el.id ? '#' + el.id : '.' + (el.className || '')} 右边界 ${r.right.toFixed(0)}`; break; }
          }
        }
        return { over, who };
      });
      assert(info.over <= 1, `${vw}px 下「${t}」页横向溢出 ${info.over}px，元凶：${info.who}`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 850 });

  /* ─────────── 11. 守卫：单位符号没被 uppercase 改写 ───────────
   * ⚠️ 只扫 textContent 是测不出来的：CSS 的 text-transform 只改渲染字形、**不改 DOM 文本**
   * （2026-09-12 实证：给 .tl-f>span 加上 uppercase 后，扫文本的守卫照样全绿）。
   * 所以要断的是「带拉丁字母/单位的标签上没有 uppercase 类计算样式」，
   * 再配一条扫文本的网兜住「源码里直接写错成 MPA」这种。 */
  const badUnits = await page.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll('th, dt, label, label span, .tl-f>span, .tl-ro dt, .tl-kv dt')) {
      const s = (el.textContent || '').trim();
      const tt = getComputedStyle(el).textTransform;
      if ((tt === 'uppercase' || tt === 'capitalize') && /[A-Za-z]/.test(s)) {
        bad.push(`${el.tagName}.${el.className || ''} 的 text-transform=${tt} → 「${s.slice(0, 24)}」`);
      }
      if (/\b(MPA|KPA|KJ|KG|KW|HZ|DBFS)\b/.test(s)) bad.push(`文本里直接写成了大写：「${s.slice(0, 24)}」`);
    }
    return bad;
  });
  assert(badUnits.length === 0, `单位符号有被大写改写的风险：${badUnits.join('；')}`);

  /* ─────────── 12. 状态持久化：刷新后状态点还在 ─────────── */
  await show('psy');
  await page.click('#tl-psy-clear');
  await setv('#tl-psy-t', 28);
  await page.selectOption('#tl-psy-which', 'rh');
  await setv('#tl-psy-val', 45);
  await page.click('#tl-psy-add');
  assert((await page.locator('#tl-psy-points li').count()) === 1, '加入后应有 1 个状态点');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('body[data-tl-ready="1"]');
  await show('psy');
  assert((await page.locator('#tl-psy-points li').count()) === 1, '刷新后状态点应从 localStorage 恢复');
  const restored = await txt('#tl-psy-points li:nth-child(1) .tl-item-name');
  assert(/28/.test(restored) && /45/.test(restored), `恢复的状态点应是 28°C/45%，实际「${restored}」`);

  /* ─────────── 13. 缩略图 ─────────── */
  await show('psy');
  await page.waitForTimeout(150);          // 等 SVG 重绘 settle 再截图
  await screenshot('thumb.png');
}
