/* 药代动力学工作台 · 集成测试
 *
 * 真值全部来自 oracle/truth.json（scipy expm 推进增广 ODE、周期仿射映射求稳态、numpy 另写的 NCA），
 * 由 oracle/inject_oracle.mjs **机械注入**下面的 ORACLE 块 —— 本文件不许出现手打的药动学数值。
 * 页面读数按显示精度给容差（display-tolerance.mjs），渲染守卫一律 import（render-guards.mjs）。
 */
import { makeDisplayCompare } from '/Users/lon/.agents/cron/daily-website/tools/display-tolerance.mjs';
import { renderGuards } from '/Users/lon/.agents/cron/daily-website/tools/render-guards.mjs';

const ORACLE = {
 "meta": {
  "tabs": [
   "sim",
   "nca",
   "dose",
   "notes"
  ],
  "source": "oracle/oracle.py（scipy expm 增广 ODE + numpy NCA）"
 },
 "p": {
  "ncmt": 2,
  "CL": 4.5,
  "V1": 25,
  "Q2": 8,
  "V2": 40
 },
 "reg": {
  "route": "inf",
  "dose": 1000,
  "tau": 12,
  "n": 8,
  "Tinf": 1
 },
 "cmaxSS": 41.77961906735495,
 "tmaxSS": 1,
 "cminSS": 10.565730384015444,
 "cavg": 18.51851851851852,
 "auc24": 444.44444444444446,
 "c_at": [
  9.31463132776493,
  13.666688881538072,
  14.920374583436548
 ],
 "ncaEv": {
  "cmax": 7.362,
  "tmax": 2,
  "tlast": 24,
  "clast": 0.864,
  "aucLast": 80.9072311531777,
  "aumcLast": 671.8268540942031,
  "mrtLast": 8.303668837983915,
  "lz": 0.10179974878582242,
  "thalf": 6.808928202939529,
  "nLz": 4,
  "adjR2": 0.9981135067873644,
  "r2": 0.998742337858243,
  "lzStart": 8,
  "aucInf": 89.39448195983519,
  "aucInfPred": 89.49207823651156,
  "extrap": 9.494155143122578,
  "aumcInf": 958.8928945825799,
  "mrt": 10.726533378351128,
  "cl": 5.593186391802676,
  "vz": 54.94302744862603
 },
 "ncaEvLin": {
  "cmax": 7.362,
  "tmax": 2,
  "tlast": 24,
  "clast": 0.864,
  "aucLast": 81.99349999999998,
  "aumcLast": 668.551125,
  "mrtLast": 8.153708830578035,
  "lz": 0.10179974878582242,
  "thalf": 6.808928202939529,
  "nLz": 4,
  "adjR2": 0.9981135067873644,
  "r2": 0.998742337858243,
  "lzStart": 8,
  "aucInf": 90.48075080665745,
  "aucInfPred": 90.57834708333384,
  "extrap": 9.380172833438731,
  "aumcInf": 955.6171654883767,
  "mrt": 10.561552119857781,
  "cl": 5.526037257011915,
  "vz": 54.283407600918586
 },
 "ncaEvN5": {
  "cmax": 7.362,
  "tmax": 2,
  "tlast": 24,
  "clast": 0.864,
  "aucLast": 80.9072311531777,
  "aumcLast": 671.8268540942031,
  "mrtLast": 8.303668837983915,
  "lz": 0.09984689563364865,
  "thalf": 6.942100464527141,
  "nLz": 5,
  "adjR2": 0.9977089081485276,
  "r2": 0.9982816811113957,
  "lzStart": 6,
  "aucInf": 89.5604796544644,
  "aucInfPred": 89.74778563500467,
  "extrap": 9.661905044135564,
  "aumcInf": 966.1699913021911,
  "mrt": 10.787905502848984,
  "cl": 5.58281958659738,
  "vz": 55.91380233874749
 },
 "ncaIv": {
  "cmax": 9.655,
  "tmax": 0.083,
  "tlast": 48,
  "clast": 0.08855,
  "aucLast": 32.04815333157291,
  "aumcLast": 341.35886276121806,
  "c0": 10.751495215403416,
  "mrtLast": 10.651436269337903,
  "lz": 0.05737581216072069,
  "thalf": 12.080825603275239,
  "nLz": 5,
  "adjR2": 0.9988055854592388,
  "r2": 0.9991041890944291,
  "lzStart": 8,
  "aucInf": 33.591486605042824,
  "aucInfPred": 33.62991628583445,
  "extrap": 4.594417900034904,
  "aumcInf": 442.3375340040852,
  "mrt": 13.168144036164229,
  "cl": 2.9769447591220266,
  "vz": 51.88501298740716,
  "vss": 39.20083737582307
 },
 "theoSkip": {
  "nrows": 9,
  "troughs": [
   3.328163383805431,
   1.7622620762910204,
   4.002920996040994,
   4.8608534069977996,
   5.189349623800639,
   5.3151284882841825,
   5.363288320700959,
   5.381728377923096,
   5.388788944650426
  ]
 },
 "theoSS": {
  "cmax": 11.615988718890502,
  "cmin": 5.393169773266967
 },
 "crcl": 58.9873836793128,
 "ibw": 70.46456692913384,
 "Q": 0.6308864531138152,
 "pt": {
  "tau": 24,
  "dose": 340,
  "tauIdeal": 21.294415416798355,
  "cmax": 8.10504934072579,
  "cmin": 0.7729717653407172,
  "auc24": 75.55555555555556
 },
 "av": {
  "md": 1125,
  "ld": 1041.6666666666665,
  "daily": 2250
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  const { closeS, closeV } = makeDisplayCompare(page, assert);
  const txt = (sel) => page.$eval(sel, (n) => n.textContent.trim());
  const rev = (k) => page.evaluate((k) => +document.body.dataset[k] || 0, k);
  const waitRev = (k, b) => page.waitForFunction(([k, b]) => (+document.body.dataset[k] || 0) > b, [k, b], { timeout: 10000 });
  const onTab = async (t) => {
    await page.click('#tab-' + t);
    await page.waitForFunction((t) => !document.getElementById('pane-' + t).hidden, t, { timeout: 5000 });
  };
  const setVal = async (sel, v, k) => {
    const b = await rev(k);
    await page.fill(sel, String(v));
    await waitRev(k, b);
  };
  const choose = async (sel, v, k) => {
    const b = await rev(k);
    await page.selectOption(sel, String(v));
    await waitRev(k, b);
  };
  // 可见 = 自身与所有祖先的计算样式都不是 display:none（断计算样式，不断 hidden 属性）
  const shown = (sel) => page.$eval(sel, (n) => { for (let e = n; e; e = e.parentElement) if (getComputedStyle(e).display === 'none') return false; return true; });

  await page.goto(toolURL, { waitUntil: 'load' });
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { } });
  await page.goto(toolURL, { waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 15000 });
  assert(await page.$eval('a[href="../../"]', (a) => a.textContent.includes('返回工具集')), '顶部要有返回工具集链接');

  /* ── 1. 默认方案（万古霉素 二室 静滴）：稳态读数对 oracle ── */
  await closeS('#kpi-cmaxss', ORACLE.cmaxSS, '稳态峰');
  await closeS('#kpi-cminss', ORACLE.cminSS, '稳态谷');
  await closeS('#kpi-cavg', ORACLE.cavg, '稳态平均浓度');
  await closeS('#kpi-auc24', ORACLE.auc24, '稳态 AUC24');
  // 曲线导出 CSV 的逐点值 = oracle 在 5 h / 30 h / 90.5 h 的浓度
  const csv = await page.evaluate(() => window.PKApp.simCsv());
  const rowAt = (t) => csv.split('\n').find((l) => Math.abs(parseFloat(l) - t) < 1e-9);
  [5, 30, 90.5].forEach((t, i) => {
    const line = rowAt(t);
    assert(line, `CSV 里应有 t=${t} 的行`);
    const v = parseFloat(line.split(',')[1]);
    assert(Math.abs(v - ORACLE.c_at[i]) <= 1e-6 * ORACLE.c_at[i], `CSV t=${t}：${v} vs oracle ${ORACLE.c_at[i]}`);
  });
  // 表格与图的异源核对：图上「末次峰」标注 = 表格最后一行的峰
  const lastRowPk = await page.$eval('#pk-dose-table tbody tr:last-child td:nth-child(4)', (n) => n.textContent);
  const figPk = await page.$$eval('#fig-sim text', (ns) => (ns.map((n) => n.textContent).find((s) => s.startsWith('末次峰')) || ''));
  assert(figPk, '图上应标出末次峰');
  closeV(figPk.replace('末次峰', ''), parseFloat(lastRowPk), '图上末次峰 vs 表格末行峰');
  // 几何：8 个给药标记等间距排在底边上
  const marks = await page.$$eval('#fig-sim .pk-dosemark', (ns) => ns.map((n) => { const r = n.getBoundingClientRect(); return { x: r.left + r.width / 2, b: r.bottom }; }));
  assert(marks.length === ORACLE.reg.n, `应有 ${ORACLE.reg.n} 个给药标记，实得 ${marks.length}`);
  const gaps = marks.slice(1).map((m, i) => m.x - marks[i].x);
  assert(gaps.every((g) => Math.abs(g - gaps[0]) < 0.8 && g > 20), `给药标记应等间距：${gaps.map((g) => g.toFixed(1)).join(',')}`);
  // 标记的横坐标要落在「时刻 / 总时长 × 图宽」上：间距 = 图宽 × τ /（n·τ），首个在左边框
  const frame = await page.$eval('#fig-sim rect[fill="none"]', (n) => { const r = n.getBoundingClientRect(); return { l: r.left, w: r.width }; });
  const expGap = frame.w / ORACLE.reg.n;
  assert(Math.abs(marks[0].x - frame.l) < 1, `首个给药标记应在左边框：${marks[0].x} vs ${frame.l}`);
  const lastX = marks[marks.length - 1].x - frame.l;
  assert(Math.abs(lastX - expGap * (ORACLE.reg.n - 1)) < 1, `末个给药标记应在 ${(expGap * (ORACLE.reg.n - 1)).toFixed(1)}px，实得 ${lastX.toFixed(1)}`);
  assert(Math.abs(gaps[0] - expGap) < 1, `给药标记间距应为图宽/${ORACLE.reg.n} = ${expGap.toFixed(1)}，实得 ${gaps[0].toFixed(1)}`);
  const band = await page.$eval('#fig-sim .pk-band', (n) => n.getBoundingClientRect().height);
  assert(band > 30, `治疗窗色带应有可见高度，实得 ${band}`);

  /* ── 2. 口服预设 + 漏服跳过：表格行数与每一行的谷 ── */
  await choose('#pk-preset', 'theo', 'simRev');
  await closeS('#kpi-cmaxss', ORACLE.theoSS.cmax, '茶碱稳态峰');
  await closeS('#kpi-cminss', ORACLE.theoSS.cmin, '茶碱稳态谷');
  assert(!(await shown('#pk-tinf')), '口服时输注时长应隐藏（计算样式）');
  assert(await shown('#pk-ka'), '口服时 ka 应显示');
  assert(!(await shown('#pk-missk')), '不漏服时漏服次序应隐藏');
  await choose('#pk-miss', 'skip', 'simRev');
  assert(await shown('#pk-missk'), '选了漏服后次序输入框应显示');
  await setVal('#pk-missk', 3, 'simRev');
  const rows = await page.$$eval('#pk-dose-table tbody tr', (ns) => ns.map((r) => r.lastElementChild.textContent));
  assert(rows.length === ORACLE.theoSkip.nrows, `跳过一次后应剩 ${ORACLE.theoSkip.nrows} 行，实得 ${rows.length}`);
  rows.forEach((t, i) => closeV(t, ORACLE.theoSkip.troughs[i], `漏服后第 ${i + 1} 行的谷`));
  // 非法输入：漏服次序超出给药次数 → 中文报错条可见
  await setVal('#pk-missk', 99, 'simRev');
  assert(await shown('#pk-sim-err'), '漏服次序越界时报错条应可见');
  assert((await txt('#pk-sim-err')).includes('漏服'), '报错要说清是漏服次序的问题');
  await setVal('#pk-missk', 3, 'simRev');
  assert(!(await shown('#pk-sim-err')), '改回合法值后报错条应消失');
  // 对数纵轴：刻度是 1-2-5 档
  const b0 = await rev('simRev');
  await page.check('#pk-log');
  await waitRev('simRev', b0);
  const yt = await page.$$eval('#fig-sim text[text-anchor="end"]', (ns) => ns.map((n) => n.textContent).filter((s) => !s.startsWith('末次峰')));
  assert(yt.length >= 3 && yt.every((s) => /^0?\.?0*[125]0*$/.test(s)), `对数轴刻度应是 1/2/5 档：${yt.join(' ')}`);
  const b0b = await rev('simRev');
  await page.uncheck('#pk-log');
  await waitRev('simRev', b0b);

  /* ── 3. NCA ── */
  await onTab('nca');
  const E = ORACLE.ncaEv;
  await closeS('#kpi-nca-aucinf', E.aucInf, 'AUC0–∞');
  await closeS('#kpi-nca-thalf', E.thalf, 't½');
  await closeS('#kpi-nca-cl', E.cl, 'CL/F');
  await closeS('#kpi-nca-extrap', E.extrap, '外推占比');
  for (const [id, k] of [['nca-auclast', 'aucLast'], ['nca-aumcinf', 'aumcInf'], ['nca-mrt', 'mrt'], ['nca-vz', 'vz'], ['nca-lz', 'lz']]) {
    await closeS('#' + id, E[k], 'NCA ' + k);
  }
  assert(+(await txt('#nca-nlz')) === E.nLz, `末端相点数应为 ${E.nLz}`);
  const selRow = await page.$eval('#pk-nca-fits tr.pk-row-sel td', (n) => +n.textContent);
  assert(selRow === E.nLz, `候选表高亮行应是 ${E.nLz} 点那组，实得 ${selRow}`);
  const redPts = await page.$$eval('#fig-nca circle', (ns) => ns.filter((n) => n.getAttribute('fill') === '#ff9999').length);
  assert(redPts === E.nLz, `图上末端相选点应有 ${E.nLz} 个，实得 ${redPts}`);
  await choose('#pk-nca-method', 'linear', 'ncaRev');
  await closeS('#nca-auclast', ORACLE.ncaEvLin.aucLast, '线性梯形 AUClast');
  await choose('#pk-nca-method', 'linlog', 'ncaRev');
  await choose('#pk-nca-lzmode', 'n', 'ncaRev');
  await setVal('#pk-nca-n', 5, 'ncaRev');
  await closeS('#nca-lz', ORACLE.ncaEvN5.lz, '手动 5 点 λz');
  await choose('#pk-nca-lzmode', 'auto', 'ncaRev');
  let b1 = await rev('ncaRev');
  await page.click('#pk-nca-ex-iv');
  await waitRev('ncaRev', b1);
  const I = ORACLE.ncaIv;
  await closeS('#nca-c0', I.c0, '静注 C0 回推');
  await closeS('#nca-vss', I.vss, '静注 Vss');
  await closeS('#kpi-nca-cl', I.cl, '静注 CL');
  assert((await txt('#kpi-nca-cl-lbl')) === '清除率 CL', '静注时标签应是 CL 而不是 CL/F');
  // 非法数据
  b1 = await rev('ncaRev');
  await page.fill('#pk-nca-data', '0 0\n1 abc\n2 3');
  await waitRev('ncaRev', b1);
  assert(await shown('#pk-nca-err') && (await txt('#pk-nca-err')).includes('不是数字'), '非数字行应报中文错误');
  b1 = await rev('ncaRev');
  await page.click('#pk-nca-ex-ev');
  await waitRev('ncaRev', b1);
  assert(!(await shown('#pk-nca-err')), '载入示例后报错条应消失');

  /* ── 4. 剂量设计 ── */
  await onTab('dose');
  await closeS('#kpi-crcl', ORACLE.crcl, 'CrCl');
  await closeS('#rf-ibw', ORACLE.ibw, '理想体重');
  await closeS('#kpi-q', ORACLE.Q, 'Dettli Q');
  const reg = await txt('#kpi-pt-reg');
  assert(reg.replace(/\s/g, '') === `${ORACLE.pt.dose}mgq${ORACLE.pt.tau}h`, `峰谷靶向方案应为 ${ORACLE.pt.dose} mg q${ORACLE.pt.tau}h，实得 ${reg}`);
  await closeS('#pt-tauideal', ORACLE.pt.tauIdeal, '理想间隔');
  await closeS('#pt-auc24', ORACLE.pt.auc24, 'AUC24');
  const ptTxt = (await txt('#kpi-pt-pt')).split('/');
  closeV(ptTxt[0], ORACLE.pt.cmax, '预测峰'); closeV(ptTxt[1], ORACLE.pt.cmin, '预测谷');
  await closeS('#kpi-av-md', ORACLE.av.md, 'AUC 靶向维持剂量');
  await closeS('#kpi-av-ld', ORACLE.av.ld, '负荷剂量');
  await closeS('#av-daily', ORACLE.av.daily, '日剂量');
  await setVal('#pk-pt-tr', 20, 'doseRev');
  assert(await shown('#pk-pt-err'), '目标谷高于峰时应报错');
  await setVal('#pk-pt-tr', 1, 'doseRev');
  // 送到方案页：模拟器的稳态峰谷 = 设计预测值（跨模块闭环）
  const b2 = await rev('simRev');
  await page.click('#pk-pt-send');
  await waitRev('simRev', b2);
  assert(await page.$eval('#tab-sim', (n) => n.getAttribute('aria-selected')) === 'true', '送到方案页后应切到方案页签');
  await closeS('#kpi-cmaxss', ORACLE.pt.cmax, '模拟器稳态峰 = 设计峰');
  await closeS('#kpi-cminss', ORACLE.pt.cmin, '模拟器稳态谷 = 设计谷');

  /* ── 5. 键盘、方案库、分享链接 ── */
  await page.focus('#tab-sim');
  await page.keyboard.press('ArrowRight');
  assert(await page.$eval('#tab-nca', (n) => n.getAttribute('aria-selected') === 'true' && document.activeElement === n), '方向键应切到下一个页签并聚焦');
  await onTab('sim');
  await page.fill('#pk-libname', '测试方案 A');
  await page.click('#pk-libsave');
  await page.waitForFunction(() => document.querySelector('#pk-liblist').textContent.includes('测试方案 A'), null, { timeout: 5000 });
  const doseBefore = await page.$eval('#pk-dose', (n) => n.value);
  await setVal('#pk-dose', 999, 'simRev');
  const b3 = await rev('simRev');
  await page.click('#pk-liblist [data-act=load]');
  await waitRev('simRev', b3);
  assert(await page.$eval('#pk-dose', (n) => n.value) === doseBefore, '从方案库载入应还原剂量');
  await page.click('#btn-share');
  const url = page.url();
  assert(/#s=/.test(url), '分享链接应把状态写进 hash');
  // 真的重新加载一次（只差 hash 的 goto 是同文档导航、不会重载 —— 2026-09-26 教训）
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { } });
  await page.goto('about:blank');
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 15000 });
  assert(await page.$eval('#pk-dose', (n) => n.value) === doseBefore, '分享链接应还原剂量');
  await closeS('#kpi-cmaxss', ORACLE.pt.cmax, '分享链接还原后的稳态峰');

  /* ── 6. 说明页 ── */
  await onTab('notes');
  const notes = await txt('#notes-body');
  for (const kw of ['Cockcroft-Gault', 'Dettli', 'Sawchuk-Zaske', 'expm', '不能']) assert(notes.includes(kw), `说明页应写明：${kw}`);

  /* ── 7. 渲染守卫（import，不手抄）── */
  await page.goto('about:blank');
  await page.goto(toolURL, { waitUntil: 'load' });
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { } });
  await page.goto('about:blank');
  await page.goto(toolURL, { waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 15000 });
  const nCtl = await renderGuards(page, {
    assert, tabs: ORACLE.meta.tabs, onTab,
    paneSel: (t) => `#pane-${t}`, panesRoot: '#pk-panes',
    figSel: (t) => `#pane-${t} svg.pk-fig`, cardSel: '.pk-card',
    minControls: 40, minTextsInFig: 8, minIds: 80
  });
  assert(nCtl >= 40, `逐页签累计应扫到 ≥40 个控件，实得 ${nCtl}`);
  assert(errs.length === 0, `页面有报错：${errs.slice(0, 3).join(' | ')}`);

  await onTab('sim');
  await page.waitForFunction(() => document.querySelectorAll('#fig-sim path').length > 3, null, { timeout: 5000 });
  await screenshot('thumb.png');
};
