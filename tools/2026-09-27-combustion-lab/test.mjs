/* 燃烧工作台 · 集成测试
 *
 * 真值全部来自 oracle/truth.json（Cantera 3.2.0 + CoolProp 8.0），由 oracle/inject_oracle.mjs
 * **机械注入**下面这个 ORACLE 块 —— 本文件里不许出现手打的物理量（2026-09-15 教训）。
 * 页面读数一律按**显示精度**给容差（display-tolerance.mjs），渲染守卫一律 import（render-guards.mjs）。
 */
import { makeDisplayCompare } from '/Users/lon/.agents/cron/daily-website/tools/display-tolerance.mjs';
import { renderGuards } from '/Users/lon/.agents/cron/daily-website/tools/render-guards.mjs';

const ORACLE = {
 "meta": {
  "tabs": [
   "mix",
   "equil",
   "thermo",
   "kinet",
   "nozzle",
   "notes"
  ],
  "source": "Cantera 3.2.0 + CoolProp 8.0"
 },
 "inputs": {
  "fuel": "CH4",
  "oxid": "air",
  "phi": 1,
  "Tin": 298.15,
  "Pin": 1.01325,
  "o2meas": 3,
  "Tstack": 420,
  "eqMode": "HP",
  "eqT": 2000,
  "eqP": 1.01325,
  "thT": 1500,
  "thSpecies": "CH4,CO2,H2O,OH,NO",
  "kFuel": "H2",
  "kPhi": 1,
  "kT0": 1200,
  "kP0": 1.01325,
  "nzFuel": "CH4",
  "nzOF": 3.6,
  "nzPc": 100,
  "nzEps": 40,
  "thrustKN": 2000,
  "phi2": 0.8,
  "phi3": 1.8,
  "Tin2": 600,
  "thT2": 1000,
  "kT02": 1000,
  "nzOF2": 2.8,
  "nzPc2": 60,
  "nzEps2": 25
 },
 "mix": {
  "W": 27.633486692015207,
  "rho": 1.1294923653910776,
  "TadEq": 2224.6173595315754,
  "TadComplete": 2325.598129753964,
  "diss": 100.9807702223884,
  "dewC": 59.24895749589837,
  "lhv": 50025395.9034379,
  "hhv": 55511152.931425184,
  "phiFromO2": 0.8702538071065989,
  "prodWet": {
   "CO2": 0.09505703422053233,
   "H2O": 0.19011406844106465,
   "N2": 0.714828897338403
  },
  "excess": 14.909006066262265
 },
 "eqDefault": {
  "T": 2224.6173595315754,
  "X": {
   "N2": 0.7086086060902742,
   "H2O": 0.18349279134684007,
   "CO2": 0.08540151079722326,
   "CO": 0.008953463309658441,
   "OH": 0.0028627242288648954,
   "NO": 0.00188101691479015,
   "O2": 0.0046054596080032165,
   "H2": 0.0035916308806116367,
   "H": 0.0003876977428229191,
   "O": 0.00021405736696967215
  }
 },
 "tp2000": {
  "W": 27.566209630757488,
  "rho": 0.1679691351752634,
  "X": {
   "CO2": 0.09182842603580939,
   "CO": 0.0029971802046522733,
   "H2O": 0.18786549920849913,
   "OH": 0.0008331614174188111,
   "NO": 0.0006459101098946937,
   "H2": 0.0013392837433948432
  }
 },
 "uv": {
  "T": 2585.8782667050837,
  "Pbar": 8.91449517884447,
  "W": 27.241361311736835
 },
 "phi08": {
  "TadEq": 1995.6509747550472,
  "TadComplete": 2014.9757706928801,
  "dryO2": 4.587155963302748,
  "dryCO2": 9.174311926605508
 },
 "phi18": {
  "TadEq": 1693.1512052185599,
  "TadComplete": 1669.3059347986105,
  "prod": {
   "CO": 0.13931888544891635,
   "H2O": 0.1702786377708978,
   "H2": 0.10835913312693492,
   "N2": 0.5820433436532508
  }
 },
 "h2": {
  "TadEq": 2379.8625615659953
 },
 "ch4o2": {
  "TadEq": 3052.0608269378176
 },
 "preheat600": {
  "TadEq": 2366.795055299467
 },
 "thermo1500": {
  "CH4": {
   "cp": 90413.74714091182,
   "h": 5424483.07468068,
   "s": 281599.2859226696,
   "g": -416974445.8093237,
   "W": 16.043
  },
  "CO2": {
   "cp": 58396.38596899474,
   "h": -331810500.56384987,
   "s": 292179.88778243616,
   "g": -770080332.2375041,
   "W": 44.009
  },
  "H2O": {
   "cp": 47291.34495249908,
   "h": -193611660.66478547,
   "s": 250663.89530131005,
   "g": -569607503.6167505,
   "W": 18.015
  },
  "OH": {
   "cp": 32948.47553115794,
   "h": 76192201.1518637,
   "s": 232609.96916185122,
   "g": -272722752.5909131,
   "W": 17.007
  },
  "NO": {
   "cp": 35715.83803468598,
   "h": 130959769.26033507,
   "s": 262668.0465103834,
   "g": -263042300.5052401,
   "W": 30.006
  }
 },
 "thermo1000": {
  "CH4": {
   "cp": 73616.66965658606,
   "h": -35948444.6651441,
   "s": 248278.82879517044,
   "g": -284227273.4603146
  },
  "CO2": {
   "cp": 54320.864255789165,
   "h": -360110692.3605226,
   "s": 269286.21746845415,
   "g": -629396909.8289768
  },
  "H2O": {
   "cp": 41294.74406845728,
   "h": -215822105.01971778,
   "s": 232735.00574961444,
   "g": -448557110.7693323
  },
  "OH": {
   "cp": 30693.81728401822,
   "h": 60265633.26425613,
   "s": 219725.5507549731,
   "g": -159459917.490717
  },
  "NO": {
   "cp": 33989.223030909925,
   "h": 113497682.0884347,
   "s": 248531.19768573542,
   "g": -135033515.5973007
  }
 },
 "kp1500": {
  "H2O": 0.00000189188248218738,
  "CO2": 0.00000489326002762424,
  "NO": 0.003022693761448562,
  "WGS": 0.38663027746471934,
  "H": 3.10030925150596e-10,
  "SMR": 225854.10260971528
 },
 "mix1500": {
  "cp": 1463.000323966511,
  "cv": 1162.1167362086283,
  "gamma": 1.2589099514559152,
  "a": 753.7758382219719,
  "h": 1291480.5227055822,
  "s": 9233.455658865281,
  "rho": 0.2245054324942332,
  "W": 27.63348669201521
 },
 "ign": {
  "tau1200": 0.00004533350729330761,
  "Tend1200": 2751.8682020643564,
  "tau1000": 0.0003119803837233455
 },
 "noz": {
  "Tc": 3616.1360942233505,
  "IspVac": 368.8524785610889,
  "cstar": 1830.6761822290564,
  "Tt": 3442.8551676567863,
  "PtBar": 57.91886350770218,
  "Te": 2007.7921751171316,
  "PeKPa": 27.134403881621548,
  "Me": 3.8212972352644377,
  "Gt": 5462.462502693329,
  "CFvac": 1.975885846986189,
  "vt": 1194.757036058921,
  "ve": 3418.5099312608295
 },
 "nozFrozen": {
  "Tc": 3616.1360942233505,
  "IspVac": 342.3543706942967,
  "Te": 1185.4631505277564
 },
 "noz60": {
  "Tc": 3370.8906975883774,
  "IspVac": 353.56189815045695,
  "cstar": 1867.1348453211986
 },
 "hvAll": {
  "CH4": {
   "lhv": 50025395.9034379,
   "hhv": 55511152.931425184
  },
  "H2": {
   "lhv": 119952689.3089377,
   "hhv": 141780070.26131865
  },
  "C3H8": {
   "lhv": 46351643.506847575,
   "hhv": 50343207.5588239
  },
  "C2H4": {
   "lhv": 47164912.65074763,
   "hhv": 50302005.40044464
  },
  "CO": {
   "lhv": 10102762.867399795,
   "hhv": 10102762.867399795
  },
  "NH3": {
   "lhv": 18603605.095153715,
   "hhv": 22479243.636636894
  },
  "CH3OH": {
   "lhv": 21104117.910007063,
   "hhv": 23850762.938407287
  },
  "C2H6": {
   "lhv": 47510419.49096088,
   "hhv": 51900575.79292297
  },
  "C2H2": {
   "lhv": 48277088.75273233,
   "hhv": 49967080.30354268
  },
  "CH2O": {
   "lhv": 17543229.125846677,
   "hhv": 19008758.99995578
  }
 },
 "liq": {
  "O2": {
   "Tb": 90.18780788045206,
   "dh": 404377.68962363014
  },
  "CH4": {
   "Tb": 111.66720547357963,
   "dh": 909952.5329890539
  },
  "H2": {
   "Tb": 20.271250660906944,
   "dh": 4428298.974040209
  }
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const { closeS, closeV: closeRaw, parseNum: parseRaw, txt } = makeDisplayCompare(page, assert);
  /** 页面把小数写成「1.234×10⁻⁵」（上标数字），先还原成 1.234e-5 再比，
   *  否则 parseNum 只取到尾数、指数被整个丢掉（排序断言会假红）。 */
  const SUP = '⁻⁰¹²³⁴⁵⁶⁷⁸⁹', PLAIN = '-0123456789';
  const norm = (t) => String(t).replace(/×10/g, 'e').replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => PLAIN[SUP.indexOf(c)]);
  const parseNum = (t) => parseRaw(norm(t));
  const closeV = (t, want, what, scale) => closeRaw(norm(t), want, what, scale);
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message)));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });

  await page.goto(toolURL, { waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 45000 });

  const rev = async () => page.evaluate(() => +(document.body.dataset.rev || 0));
  const counter = async (k) => page.evaluate((kk) => +(document.body.dataset[kk] || 0), k);
  /** 等某个长任务（点火积分 / 喷管求解 / 温度扫描）真的算完 */
  const waitJob = async (k, before, ms) =>
    page.waitForFunction(([kk, b]) => +(document.body.dataset[kk] || 0) > b, [k, before], { timeout: ms || 180000 });
  /** 改一个控件，然后等页面的渲染计数器自增（比「等某段文字变化」可靠：读数可能恰好没变） */
  const setVal = async (sel, val) => {
    const before = await rev();
    const el = await page.$(sel);
    const tag = await el.evaluate((n) => n.tagName);
    if (tag === 'SELECT') await page.selectOption(sel, String(val));
    else { await page.fill(sel, String(val)); }
    await page.waitForFunction((r) => +(document.body.dataset.rev || 0) > r, before, { timeout: 30000 });
  };
  const onTab = async (t) => {
    await page.click('#tab-' + t);
    await page.waitForFunction((tt) => !document.getElementById('pane-' + tt).hidden, t, { timeout: 15000 });
    await page.waitForTimeout(60);
  };

  const closeT = async (sel, want, what, scale) => closeV(await txt(sel), want, what, scale);
  /** 积分类读数（点火延迟、终态温度）不能按显示精度比：两边是不同的积分器，
   *  Cantera 用 CVODE/BDF、这里是隐式欧拉 + Richardson 外推，只能给相对容差。 */
  const relClose = (t, want, tol, what, scale) => {
    const got = parseNum(t) * (scale == null ? 1 : scale);
    const d = Math.abs(got - want) / Math.abs(want);
    assert(d <= tol, `${what}：页面「${t}」→ ${got}，真值 ${want}，相对偏差 ${d.toExponential(2)} > ${tol}`);
  };

  /* ── 0. 页面骨架 ─────────────────────────────────────────────────── */
  assert(await page.$('a[href="../../"]'), '缺少「返回工具集」链接');
  assert((await page.$$('.cb-tab')).length === ORACLE.meta.tabs.length,
    `页签数应为 ${ORACLE.meta.tabs.length}`);
  assert((await page.title()).includes('燃烧'), '标题应包含「燃烧」');
  // 输入框真的带着默认值（后面所有断言都建立在这套输入上）
  for (const [sel, want] of [['#in-fuel', ORACLE.inputs.fuel], ['#in-oxid', ORACLE.inputs.oxid],
                             ['#in-phi', ORACLE.inputs.phi], ['#in-tin', ORACLE.inputs.Tin],
                             ['#in-pin', ORACLE.inputs.Pin]]) {
    const v = await page.$eval(sel, (n) => n.value);
    assert(String(parseFloat(v) || v) === String(want), `${sel} 默认值应为 ${want}，实得 ${v}`);
  }

  /* ── 1. 配气页：热化学读数对拍 Cantera ───────────────────────────── */
  await closeT('#kpi-mw', ORACLE.mix.W, '混合气分子量');
  await closeT('#kpi-rho', ORACLE.mix.rho, '混合气密度');
  await closeT('#kpi-tad-eq', ORACLE.mix.TadEq, '绝热火焰温度（平衡）');
  await closeT('#kpi-tad-cc', ORACLE.mix.TadComplete, '绝热火焰温度（完全燃烧）');
  await closeT('#kpi-diss', ORACLE.mix.diss, '离解吃掉的温升');
  await closeT('#kpi-dew', ORACLE.mix.dewC, '烟气露点');
  await closeT('#kpi-lhv', ORACLE.mix.lhv / 1e6, 'CH₄ 低位热值');
  await closeT('#kpi-hhv', ORACLE.mix.hhv / 1e6, 'CH₄ 高位热值');
  await closeT('#kpi-phiback', ORACLE.mix.phiFromO2, '干基 O₂ 反解当量比');
  await closeT('#kpi-excess', ORACLE.mix.excess, '过量空气');
  // 高位热值必须大于低位（含氢燃料），且离解一定是吃热的
  assert(ORACLE.mix.hhv > ORACLE.mix.lhv, 'HHV 应大于 LHV');
  assert(parseNum(await txt('#kpi-diss')) > 0, '完全燃烧假设应高于平衡温度');

  // 完全燃烧产物表：CH₄/空气 φ=1 的干基应当只有 CO2/N2（O2 恰好用完）
  const prodRows = await page.$$eval('#tbl-prod tbody tr', (rs) => rs.map((r) => [...r.children].map((c) => c.textContent.trim())));
  assert(prodRows.length >= 3, `产物表应至少 3 行，实得 ${prodRows.length}`);
  const co2Row = prodRows.find((r) => r[0] === 'CO2');
  assert(co2Row, '产物表里没有 CO2');
  closeV(co2Row[1], ORACLE.mix.prodWet.CO2 * 100, '产物 CO2 湿基');
  closeV(prodRows.find((r) => r[0] === 'H2O')[1], ORACLE.mix.prodWet.H2O * 100, '产物 H2O 湿基');

  /* ── 2. 交互：改当量比 / 燃料 / 氧化剂 / 预热 ─────────────────────── */
  await setVal('#in-phi', ORACLE.inputs.phi2);
  await closeT('#kpi-tad-eq', ORACLE.phi08.TadEq, 'φ=0.8 绝热火焰温度');
  await closeT('#kpi-tad-cc', ORACLE.phi08.TadComplete, 'φ=0.8 完全燃烧温度');
  const dryO2Row = (await page.$$eval('#tbl-prod tbody tr', (rs) => rs.map((r) => [...r.children].map((c) => c.textContent.trim()))))
    .find((r) => r[0] === 'O2');
  assert(dryO2Row, 'φ=0.8 时产物表应出现剩余 O2');
  closeV(dryO2Row[2], ORACLE.phi08.dryO2, 'φ=0.8 干基 O₂');

  // 富燃侧：氧不够时产物要降级成 CO/H2，且完全燃烧温度必须随 φ 单调下降
  //（2026-09-27 实撞：旧版在这一档把 CO 耗的氧算漏了，温度曲线掉头往上涨，只有看图才发现）
  await setVal('#in-phi', ORACLE.inputs.phi3);
  await closeT('#kpi-tad-eq', ORACLE.phi18.TadEq, 'φ=1.8 绝热火焰温度（平衡）');
  await closeT('#kpi-tad-cc', ORACLE.phi18.TadComplete, 'φ=1.8 完全燃烧温度');
  const richRows = await page.$$eval('#tbl-prod tbody tr', (rs) => rs.map((r) => [...r.children].map((c) => c.textContent.trim())));
  for (const sp of ['CO', 'H2']) {
    const row = richRows.find((r) => r[0] === sp);
    assert(row, `φ=1.8 的产物表里应出现 ${sp}`);
    closeV(row[1], ORACLE.phi18.prod[sp] * 100, `φ=1.8 产物 ${sp} 湿基`);
  }
  assert(!richRows.find((r) => r[0] === 'O2'), 'φ=1.8 不该再有剩余 O2');
  assert(ORACLE.phi18.TadComplete < ORACLE.phi08.TadComplete + 1e-9,
    '完全燃烧温度在富燃侧应低于同样偏离当量的贫燃侧附近值（单调性）');

  await setVal('#in-phi', ORACLE.inputs.phi);
  await setVal('#in-tin', ORACLE.inputs.Tin2);
  await closeT('#kpi-tad-eq', ORACLE.preheat600.TadEq, '预热到 600 K 的绝热火焰温度');
  await setVal('#in-tin', ORACLE.inputs.Tin);

  await setVal('#in-oxid', 'o2');
  await closeT('#kpi-tad-eq', ORACLE.ch4o2.TadEq, '纯氧燃烧的绝热火焰温度');
  await setVal('#in-oxid', ORACLE.inputs.oxid);

  await setVal('#in-fuel', 'H2');
  await closeT('#kpi-tad-eq', ORACLE.h2.TadEq, '氢/空气的绝热火焰温度');
  await closeT('#kpi-lhv', ORACLE.hvAll.H2.lhv / 1e6, '氢的低位热值');
  await setVal('#in-fuel', ORACLE.inputs.fuel);
  await closeT('#kpi-tad-eq', ORACLE.mix.TadEq, '切回甲烷后应回到原值');

  /* ── 3. 平衡页 ───────────────────────────────────────────────────── */
  await onTab('equil');
  await closeT('#kpi-eq-t', ORACLE.eqDefault.T, '平衡页默认（定焓定压）温度');
  const eqRows = await page.$$eval('#tbl-eq tbody tr', (rs) => rs.map((r) => [...r.children].map((c) => c.textContent.trim())));
  assert(eqRows.length >= 10, `平衡组成表应至少 10 行，实得 ${eqRows.length}`);
  for (const sp of ['N2', 'H2O', 'CO2', 'CO', 'OH', 'NO']) {
    const row = eqRows.find((r) => r[0] === sp);
    assert(row, `平衡组成表里缺 ${sp}`);
    closeV(row[1], ORACLE.eqDefault.X[sp], `平衡摩尔分数 ${sp}`);
  }
  // 表格里的摩尔分数应当单调递减（按摩尔分数排序）
  const xs = eqRows.map((r) => parseNum(r[1]));
  for (let i = 1; i < xs.length; i++) assert(xs[i] <= xs[i - 1] * 1.0000001, `平衡组成表第 ${i + 1} 行没有按摩尔分数排序`);

  await setVal('#in-eqmode', 'TP');
  await closeT('#kpi-eq-w', ORACLE.tp2000.W, '定温定压 2000 K 的平均分子量');
  await closeT('#kpi-eq-rho', ORACLE.tp2000.rho, '定温定压 2000 K 的密度');
  const tpRows = await page.$$eval('#tbl-eq tbody tr', (rs) => rs.map((r) => [...r.children].map((c) => c.textContent.trim())));
  for (const sp of ['CO', 'OH', 'NO']) {
    const row = tpRows.find((r) => r[0] === sp);
    assert(row, `2000 K 平衡表里缺 ${sp}`);
    closeV(row[1], ORACLE.tp2000.X[sp], `2000 K 平衡摩尔分数 ${sp}`);
  }
  await setVal('#in-eqmode', 'UV');
  await closeT('#kpi-eq-t', ORACLE.uv.T, '定容爆炸温度');
  await closeT('#kpi-eq-p', ORACLE.uv.Pbar, '定容爆炸压力');
  assert(ORACLE.uv.T > ORACLE.eqDefault.T, '定容温度应高于定压温度');
  await setVal('#in-eqmode', ORACLE.inputs.eqMode);

  /* ── 4. 物性页 ───────────────────────────────────────────────────── */
  await onTab('thermo');
  const thRows = async () => page.$$eval('#tbl-th tbody tr', (rs) => rs.map((r) => [...r.children].map((c) => c.textContent.trim())));
  let tr = await thRows();
  assert(tr.length === ORACLE.inputs.thSpecies.split(',').length, `物性表应有 ${ORACLE.inputs.thSpecies.split(',').length} 行`);
  for (const sp of Object.keys(ORACLE.thermo1500)) {
    const row = tr.find((r) => r[0] === sp);
    assert(row, `物性表缺 ${sp}`);
    closeV(row[2], ORACLE.thermo1500[sp].cp / 1000, `cp° ${sp} @1500K`);
    closeV(row[3], ORACLE.thermo1500[sp].h / 1e6, `h° ${sp} @1500K`);
    closeV(row[4], ORACLE.thermo1500[sp].s / 1000, `s° ${sp} @1500K`);
    closeV(row[5], ORACLE.thermo1500[sp].g / 1e6, `g° ${sp} @1500K`);
  }
  await closeT('#kpi-th-cp', ORACLE.mix1500.cp / 1000, '混合气 cp @1500K');
  await closeT('#kpi-th-gam', ORACLE.mix1500.gamma, '混合气 γ @1500K');
  await closeT('#kpi-th-a', ORACLE.mix1500.a, '混合气声速 @1500K');
  await closeT('#kpi-th-rho', ORACLE.mix1500.rho, '混合气密度 @1500K');

  const kpRows = await page.$$eval('#tbl-kp tbody tr', (rs) => rs.map((r) => [...r.children].map((c) => c.textContent.trim())));
  assert(kpRows.length === 6, `平衡常数表应有 6 行，实得 ${kpRows.length}`);
  const kpWant = [ORACLE.kp1500.H2O, ORACLE.kp1500.CO2, ORACLE.kp1500.NO, ORACLE.kp1500.WGS, ORACLE.kp1500.H, ORACLE.kp1500.SMR];
  kpRows.forEach((row, i) => {
    closeV(row[4], Math.log(kpWant[i]) / Math.LN10, `log₁₀Kp 第 ${i + 1} 行`);
    closeV(row[5], kpWant[i], `Kp 第 ${i + 1} 行`);
  });

  await setVal('#in-tht', ORACLE.inputs.thT2);
  tr = await thRows();
  for (const sp of Object.keys(ORACLE.thermo1000)) {
    const row = tr.find((r) => r[0] === sp);
    closeV(row[2], ORACLE.thermo1000[sp].cp / 1000, `cp° ${sp} @1000K`);
    closeV(row[5], ORACLE.thermo1000[sp].g / 1e6, `g° ${sp} @1000K`);
  }
  // 非法组分名要有提示而不是静默吞掉
  await setVal('#in-thsp', 'CH4,XYZ,CO2');
  const stTh = await txt('#st-th');
  assert(/XYZ/.test(stTh), `未知组分名应被指出来，实得「${stTh}」`);
  assert((await thRows()).length === 2, '未知组分应被跳过、其余照常列出');
  await setVal('#in-thsp', ORACLE.inputs.thSpecies);
  await setVal('#in-tht', ORACLE.inputs.thT);

  /* ── 5. 点火页 ───────────────────────────────────────────────────── */
  await onTab('kinet');
  // 第一次点开会自动跑一遍（单点 + 温度扫描），等它跑完再开始自己的操作
  await waitJob('swprev', 0, 300000);
  const before = await counter('kinrev');
  await page.click('#btn-run-kin');
  await waitJob('kinrev', before);
  const tauTxt = await txt('#kpi-kin-tau');
  const tauUnit = /ms/.test(tauTxt) ? 1e-3 : 1e-6;
  relClose(tauTxt, ORACLE.ign.tau1200, 2e-3, '氢 1200 K 点火延迟（对拍 Cantera 反应器）', tauUnit);
  // 终态温度：页面只积到有限窗口、Cantera 跑到 0.5 s，两者都在逼近平衡，给 3% 的相对容差
  relClose(await txt('#kpi-kin-tend'), ORACLE.ign.Tend1200, 3e-2, '点火后的终态温度');
  const kinRows = await page.$$eval('#tbl-kin tbody tr', (rs) => rs.map((r) => [...r.children].map((c) => c.textContent.trim())));
  assert(kinRows.length === 10, `点火时刻反应排行应有 10 行，实得 ${kinRows.length}`);
  assert(kinRows.some((r) => /H \+ O2/.test(r[0])), '氢的链分支步 H+O2 应出现在排行里');
  // 排行必须真的按 |q| 降序
  const qs = kinRows.map((r) => Math.abs(parseNum(r[1])));
  for (let i = 1; i < qs.length; i++) assert(qs[i] <= qs[i - 1] * 1.000001, `反应排行第 ${i + 1} 行没按 |q| 排序`);

  await setVal('#in-kt0', ORACLE.inputs.kT02);
  const b2 = await counter('kinrev');
  await page.click('#btn-run-kin');
  await waitJob('kinrev', b2);
  const tau2 = await txt('#kpi-kin-tau');
  relClose(tau2, ORACLE.ign.tau1000, 2e-3, '氢 1000 K 点火延迟', /ms/.test(tau2) ? 1e-3 : 1e-6);
  assert(parseNum(tau2) * (/ms/.test(tau2) ? 1e-3 : 1e-6) > ORACLE.ign.tau1200,
    '初温越低点火越慢，1000 K 的 τ 应大于 1200 K 的');
  await setVal('#in-kt0', ORACLE.inputs.kT0);

  // 温度扫描：9 个工况，画出来的点数要对上
  const b3 = await counter('swprev');
  await page.click('#btn-run-sweep');
  await waitJob('swprev', b3, 300000);
  const dots = await page.$$eval('#fig-kin-arr circle', (ns) => ns.length);
  assert(dots >= 8, `阿伦尼乌斯图应至少 8 个数据点，实得 ${dots}`);

  /* ── 6. 喷管页 ───────────────────────────────────────────────────── */
  await onTab('nozzle');
  await page.waitForFunction(() => (document.getElementById('kpi-nz-tc') || {}).textContent,
    null, { timeout: 180000 });
  await closeT('#kpi-nz-tc', ORACLE.noz.Tc, '燃烧室温度');
  await closeT('#kpi-nz-ispvac', ORACLE.noz.IspVac, '真空比冲');
  await closeT('#kpi-nz-cstar', ORACLE.noz.cstar, '特征速度 c*');
  await closeT('#kpi-nz-cf', ORACLE.noz.CFvac, '推力系数');
  await closeT('#kpi-nz-me', ORACLE.noz.Me, '出口马赫数');
  await closeT('#kpi-nz-pe', ORACLE.noz.PeKPa, '出口压力');
  await closeT('#kpi-nz-gt', ORACLE.noz.Gt, '喉部质量流密度');
  const nozRows = await page.$$eval('#tbl-noz tbody tr', (rs) => rs.map((r) => [...r.children].map((c) => c.textContent.trim())));
  assert(nozRows.length === 3, '站位表应有 3 行');
  closeV(nozRows[1][1], ORACLE.noz.Tt, '喉部温度');
  closeV(nozRows[1][2], ORACLE.noz.PtBar, '喉部压力');
  closeV(nozRows[1][4], ORACLE.noz.vt, '喉部速度');
  closeV(nozRows[2][1], ORACLE.noz.Te, '出口温度');
  closeV(nozRows[2][4], ORACLE.noz.ve, '出口速度');
  assert(Math.abs(parseNum(nozRows[1][5]) - 1) < 1e-3, `喉部马赫数应为 1，实得 ${nozRows[1][5]}`);
  // 推力选喉径：ṁ = G_t·A_t 与 A_t = F/(CF·Pc) 必须自洽
  const At = parseNum(await txt('#kpi-nz-at')) / 1e4;
  const mdot = parseNum(await txt('#kpi-nz-mdot'));
  closeV(String(mdot), ORACLE.noz.Gt * At, '推进剂流量与喉部面积自洽');

  const b4 = await counter('nozrev');
  await setVal('#in-nzflow', 'frozen');
  await waitJob('nozrev', b4);
  await closeT('#kpi-nz-ispvac', ORACLE.nozFrozen.IspVac, '冻结流真空比冲');
  await closeT('#kpi-nz-tc', ORACLE.nozFrozen.Tc, '冻结流燃烧室温度（与平衡流相同）');
  assert(ORACLE.nozFrozen.IspVac < ORACLE.noz.IspVac, '冻结流比冲应低于平衡流');
  const b5 = await counter('nozrev');
  await setVal('#in-nzflow', 'shifting');
  await waitJob('nozrev', b5);
  await closeT('#kpi-nz-ispvac', ORACLE.noz.IspVac, '切回平衡流应回到原值');

  await setVal('#in-nzof', ORACLE.inputs.nzOF2);
  await setVal('#in-nzpc', ORACLE.inputs.nzPc2);
  const b6 = await counter('nozrev');
  await setVal('#in-nzeps', ORACLE.inputs.nzEps2);
  await waitJob('nozrev', b6);
  await closeT('#kpi-nz-ispvac', ORACLE.noz60.IspVac, '60 bar / O/F 2.8 / ε25 的真空比冲');
  await closeT('#kpi-nz-cstar', ORACLE.noz60.cstar, '60 bar 工况的 c*');

  /* ── 7. 说明页与分享链接 ─────────────────────────────────────────── */
  await onTab('notes');
  const notes = await txt('#notes-body');
  assert(notes.length > 800, '说明页内容太短');
  for (const kw of ['GRI-Mech 3.0', 'IAPWS-IF97', 'CoolProp', 'Cantera']) {
    assert(notes.includes(kw), `说明页应写明数据来源：${kw}`);
  }
  await page.click('#btn-share');
  const url = page.url();
  assert(/#s=/.test(url), '分享链接应把状态写进 hash');
  // 真的重新加载一次（只差 hash 的 goto 是同文档导航、根本不会重载 —— 2026-09-26 教训）
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { } });
  await page.goto('about:blank');
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 45000 });
  const restored = await page.$eval('#in-nzof', (n) => n.value);
  assert(parseFloat(restored) === ORACLE.inputs.nzOF2, `分享链接应还原 O/F=2.8，实得 ${restored}`);
  const restoredTab = await page.$eval('#tab-notes', (n) => n.getAttribute('aria-selected'));
  assert(restoredTab === 'true', '分享链接应还原到「说明」页签');

  /* ── 8. 渲染守卫（全部 import，不手抄）─────────────────────────────── */
  await page.goto(toolURL, { waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 45000 });
  await onTab('nozzle');
  await page.waitForFunction(() => (document.getElementById('kpi-nz-tc') || {}).textContent, null, { timeout: 180000 });
  await onTab('kinet');
  await waitJob('swprev', 0, 300000);       // 让点火页的三张图都有内容，守卫才扫得到东西
  await onTab('mix');
  const nCtl = await renderGuards(page, {
    assert, tabs: ORACLE.meta.tabs, onTab,
    paneSel: (t) => `#pane-${t}`, panesRoot: '#cb-panes',
    figSel: (t) => `#pane-${t} svg`, cardSel: '.cb-card',
    minControls: 20, minTextsInFig: 8, minIds: 60
  });
  assert(nCtl >= 20, `逐页签累计应扫到 ≥20 个控件，实得 ${nCtl}`);

  assert(errs.length === 0, `页面有报错：${errs.slice(0, 3).join(' | ')}`);

  await onTab('mix');
  await page.waitForTimeout(150);
  await screenshot('thumb.png');
};
