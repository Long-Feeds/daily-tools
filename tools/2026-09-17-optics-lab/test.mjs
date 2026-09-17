/* 光学设计工作台 · 集成测试
 * ORACLE 块由 run 目录里的 oracle/inject_oracle.mjs 机械注入（禁止手打数字）。 */

// <<ORACLE>>
const ORACLE = {
 "points": 123831,
 "lens": {
  "singlet": {
   "efl": 99.99999332418997,
   "bfl": 96.04429721163316,
   "ffl": -99.99999332418997,
   "fno": 3.9999997329675985,
   "pp1": 0,
   "ppk": -3.955696112556808,
   "enp": 0,
   "exp": -3.9556961125568013,
   "epd": 25,
   "total": 102.0443,
   "imgH": 3.4920768134222655,
   "nsurf": 2,
   "fields": [
    0,
    1,
    2
   ],
   "wvl": [
    486.1327,
    587.5618,
    656.2725
   ],
   "wref": 1,
   "rms": [
    {
     "f": 0,
     "rmsAll": null
    },
    {
     "f": 1,
     "rmsAll": null
    },
    {
     "f": 2,
     "rmsAll": null
    }
   ]
  },
  "achromat": {
   "efl": 100.0000200936303,
   "bfl": 96.47772679699605,
   "ffl": -99.35545032499176,
   "fno": 4.000000803745212,
   "pp1": 0.644569768638533,
   "ppk": -3.5222932966342455,
   "enp": 0,
   "exp": -4.17104471998102,
   "epd": 25,
   "total": 102.8879,
   "imgH": 2.4417666803352316,
   "nsurf": 3,
   "fields": [
    0,
    0.7,
    1.4
   ],
   "wvl": [
    486.1327,
    587.5618,
    656.2725
   ],
   "wref": 1,
   "rms": [
    {
     "f": 0,
     "rmsAll": null
    },
    {
     "f": 0.7,
     "rmsAll": null
    },
    {
     "f": 1.4,
     "rmsAll": null
    }
   ]
  },
  "cooke": {
   "efl": 57.930060302401685,
   "bfl": 53.96757250605265,
   "ffl": -41.15867616152459,
   "fno": 4.634404824192134,
   "pp1": 16.771384140877096,
   "ppk": -3.9624877963490377,
   "enp": 12.195730883661927,
   "exp": -8.93054730245256,
   "epd": 12.5,
   "total": 73.5826,
   "imgH": 14.44359255334516,
   "nsurf": 6,
   "fields": [
    0,
    7,
    14
   ],
   "wvl": [
    486.1327,
    587.5618,
    656.2725
   ],
   "wref": 1,
   "rms": [
    {
     "f": 0,
     "rmsAll": null
    },
    {
     "f": 7,
     "rmsAll": null
    },
    {
     "f": 14,
     "rmsAll": null
    }
   ]
  },
  "aspheric": {
   "efl": 99.99999332418997,
   "bfl": 99.99999332418997,
   "ffl": -93.40716646992863,
   "fno": 2.499999833104749,
   "pp1": 6.592826854261347,
   "ppk": 0,
   "enp": 0,
   "exp": -7.058159093455879,
   "epd": 40,
   "total": 110,
   "imgH": 1.047235827620576,
   "nsurf": 2,
   "fields": [
    0,
    0.3,
    0.6
   ],
   "wvl": [
    587.5618
   ],
   "wref": 0,
   "rms": [
    {
     "f": 0,
     "rmsAll": null
    },
    {
     "f": 0.3,
     "rmsAll": null
    },
    {
     "f": 0.6,
     "rmsAll": null
    }
   ]
  },
  "relay": {
   "efl": 102.28893438209201,
   "bfl": 83.54488953278836,
   "ffl": -83.54488953278836,
   "fno": 10.646399023776436,
   "pp1": 18.74404484930365,
   "ppk": -18.74404484930365,
   "enp": 5.798018440687173,
   "exp": -33.56598512253657,
   "epd": 18,
   "total": 227.8376,
   "imgH": -6.000222997228132,
   "nsurf": 6,
   "fields": [
    0,
    3,
    6
   ],
   "wvl": [
    486.1327,
    587.5618,
    656.2725
   ],
   "wref": 1,
   "rms": [
    {
     "f": 0,
     "rmsAll": null
    },
    {
     "f": 3,
     "rmsAll": null
    },
    {
     "f": 6,
     "rmsAll": null
    }
   ]
  }
 },
 "spot": {
  "singlet": [
   {
    "f": 0,
    "rms": 160.35686624917616,
    "airy": 2.867301392584393
   },
   {
    "f": 1,
    "rms": 163.82240873688892,
    "airy": 2.867301392584393
   },
   {
    "f": 2,
    "rms": 174.39250821529993,
    "airy": 2.867301392584393
   }
  ],
  "achromat": [
   {
    "f": 0,
    "rms": 6.329045223741486,
    "airy": 2.8673021601449795
   },
   {
    "f": 0.7,
    "rms": 6.6077443241718425,
    "airy": 2.8673021601449795
   },
   {
    "f": 1.4,
    "rms": 10.077538800637837,
    "airy": 2.8673021601449795
   }
  ],
  "cooke": [
   {
    "f": 0,
    "rms": 13.990004941557542,
    "airy": 3.322059073325837
   },
   {
    "f": 7,
    "rms": 43.164125087352886,
    "airy": 3.322059073325837
   },
   {
    "f": 14,
    "rms": 88.36719871927082,
    "airy": 3.322059073325837
   }
  ]
 },
 "editedR1": {
  "r": 60,
  "efl": 111.33697055436537,
  "bfl": 107.88822587043069
 },
 "autofocus": {
  "dz": -1.3295390774703308,
  "t": 94.71476092252968,
  "before": 136.43085450435638,
  "after": 43.92629133962452
 },
 "wave": {
  "rmsW": 0.05891739040119915,
  "strehl": 0.8748482774527028,
  "nPupil": 797,
  "raysampled": 441,
  "cutoff": 425.4870717700408,
  "fno": 4.000000803745212,
  "marechal": 0.8719355153111477
 },
 "waveZern": {
  "rmsW": 0.5017742205468191,
  "strehl": 0.047906092673766096,
  "nPupil": 797
 },
 "glass": {
  "n": 26,
  "bk7": {
   "nd": 1.5168000345005885,
   "nF": 1.5223762897312285,
   "nC": 1.5143223472613747,
   "vd": 64.1673362,
   "pgF": 0.534930222
  },
  "sf5": {
   "nd": 1.6727070351743674,
   "vd": 32.2512035
  },
  "lasf9": {
   "nd": 1.8502493,
   "vd": 32.1700629
  }
 },
 "coat": {
  "bare": {
   "R": 0.04238804559477586,
   "T": 0.9576119544052241,
   "A": 1.1102230246251565e-16,
   "R45": 0.052837307132390876,
   "layers": 0,
   "totalD": 0,
   "avgVis": 0.04253315424287368,
   "minVis": 0.04168079404126007,
   "minW": 700
  },
  "ar1": {
   "R": 0.012468925814154902,
   "T": 0.9875310741858451,
   "A": 0,
   "R45": 0.020570704563469558,
   "layers": 1,
   "totalD": 99.6,
   "avgVis": 0.014647131954881994,
   "minVis": 0.012468925814154902,
   "minW": 550
  },
  "ar2": {
   "R": 0.18433644240858701,
   "T": 0.8156635575914122,
   "A": 7.771561172376096e-16,
   "R45": 0.18909731530859733,
   "layers": 2,
   "totalD": 177.6,
   "avgVis": 0.16550571450332494,
   "minVis": 0.10513228195995297,
   "minW": 400
  },
  "hr": {
   "R": 0.9995887200114696,
   "T": 0.0004112799885305259,
   "A": 0,
   "R45": 0.9955646592190068,
   "layers": 17,
   "totalD": 1272.0940435429836,
   "avgVis": 0.7114626655155812,
   "minVis": 0.020748017531761427,
   "minW": 416.6666666666667
  },
  "agmir": {
   "R": 0.9727691649835974,
   "T": 0.00015935013996227885,
   "A": 0.027071484876440274,
   "R45": 0.9703412984290104,
   "layers": 2,
   "totalD": 210,
   "avgVis": 0.9744815212508366,
   "minVis": 0.9667483691089084,
   "minW": 400
  }
 },
 "brewster": 56.633701055698964,
 "beam": {
  "zR": 794.3344256864208,
  "wEnd": 0.5657664017287155,
  "waistW": 0.024741048781751485,
  "waistZ": 250.5738620263947,
  "REnd": 69.55915775190195,
  "div": 0.5035662399427567
 },
 "cav": {
  "g1": 0.4,
  "g2": 0.4,
  "g": 0.16000000000000003,
  "w0": 214.83158110305746,
  "w1": 256.77285192291635,
  "fsr": 499.6540966666667,
  "stable": true
 },
 "achro": {
  "R1": 102.82028,
  "R2": -102.82028,
  "R3": -451.4631,
  "efl": 200.16320904479684,
  "fno": 8.006528361791874,
  "dBFL": -0.03171096125851136
 },
 "caps": 33
};
// <</ORACLE>>

const near = (a, b, tol, msg, assert) =>
  assert(Number.isFinite(a) && Math.abs(a - b) <= tol,
    `${msg}: 页面 ${a} vs 引擎 ${b}（|Δ|=${Math.abs(a - b).toExponential(3)} > ${tol}）`);
const num = (s) => {
  const m = String(s).replace(/[,\s]/g, '').match(/-?\d+(\.\d+)?([eE][-+]?\d+)?/);
  return m ? parseFloat(m[0]) : NaN;
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(String(e.message)));
  page.on('console', (m) => { if (m.type() === 'error') pageErrors.push('console: ' + m.text()); });
  const noErr = (where) => assert(pageErrors.length === 0,
    `${where} 出现页面异常：${pageErrors.slice(0, 3).join(' | ')}`);

  await page.goto(toolURL, { waitUntil: 'networkidle' });
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelectorAll('#foReads .ol-read').length >= 12);
  noErr('首屏');

  const TABS = ['lens', 'aberr', 'wave', 'glass', 'coat', 'beam', 'about'];
  const go = async (t) => {
    await page.click('#tab-' + t);
    await page.waitForFunction((id) => !document.getElementById('pane-' + id).hidden, t);
    await page.waitForTimeout(140);
  };
  const readOf = async (root, label) => page.evaluate(([r, l]) => {
    const els = [...document.querySelectorAll(r + ' .ol-read')];
    const hit = els.find((e) => e.querySelector('.ol-dt').textContent.trim() === l);
    if (!hit) return null;
    const dd = hit.querySelector('.ol-dd').cloneNode(true);
    const u = dd.querySelector('.ol-unit'); if (u) u.remove();
    return dd.textContent.trim();
  }, [root, label]);
  /* 连单位一起读：有些判定（稳定/不稳定、衍射受限）写在 .ol-unit 里 */
  const readFull = async (root, label) => page.evaluate(([r, l]) => {
    const els = [...document.querySelectorAll(r + ' .ol-read')];
    const hit = els.find((e) => e.querySelector('.ol-dt').textContent.trim() === l);
    return hit ? hit.querySelector('.ol-dd').textContent.trim() : null;
  }, [root, label]);

  /* ───────── 1. 返回链接与基本结构 ───────── */
  assert(await page.locator('a.ol-back[href="../../"]').count() === 1, '缺少「← 返回工具集」链接');
  assert((await page.title()).includes('光学'), '标题应含「光学」');
  assert(await page.locator('.ol-tab').count() === 7, '应有 7 个页签');

  /* ───────── 2. 镜头页：一阶量必须等于引擎值 ───────── */
  const L = ORACLE.lens.achromat;
  near(num(await readOf('#foReads', '有效焦距 EFL')), L.efl, 5e-4, '默认预置 EFL', assert);
  near(num(await readOf('#foReads', '后焦距 BFL')), L.bfl, 5e-4, '默认预置 BFL', assert);
  near(num(await readOf('#foReads', '前焦距 FFL')), L.ffl, 5e-4, '默认预置 FFL', assert);
  near(num(await readOf('#foReads', '工作 F 数')), L.fno, 5e-4, '默认预置 F 数', assert);
  near(num(await readOf('#foReads', '前主面 PP')), L.pp1, 5e-4, '前主面', assert);
  near(num(await readOf('#foReads', '后主面 PP′')), L.ppk, 5e-4, '后主面', assert);
  near(num(await readOf('#foReads', '出瞳位置')), L.exp, 5e-4, '出瞳位置', assert);
  near(num(await readOf('#foReads', '总长')), L.total, 5e-3, '总长', assert);
  near(num(await readOf('#foReads', '近轴像高')), L.imgH, 5e-4, '近轴像高', assert);
  assert(await page.locator('#surfBody tr').count() === L.nsurf, `面数应为 ${L.nsurf}`);

  /* 点列图标题里的 RMS 与艾里半径 */
  for (let i = 0; i < ORACLE.spot.achromat.length; i++) {
    const cap = await page.locator('#spotCap' + i).textContent();
    const mm = cap.match(/RMS 半径 ([\d.]+) µm · 艾里半径 ([\d.]+) µm/);
    assert(!!mm, `点列图 ${i} 的标题格式不对：${cap}`);
    near(parseFloat(mm[1]), ORACLE.spot.achromat[i].rms, 0.02, `点列图 ${i} RMS`, assert);
    near(parseFloat(mm[2]), ORACLE.spot.achromat[i].airy, 0.02, `点列图 ${i} 艾里半径`, assert);
  }

  /* 改一个半径 → 读数必须跟着变成新的引擎值（证明真的在重算） */
  await page.fill('#surfBody tr:nth-child(1) input[data-k="r"]', String(ORACLE.editedR1.r));
  await page.locator('#surfBody tr:nth-child(1) input[data-k="r"]').press('Enter');
  await page.waitForFunction((v) => {
    const e = [...document.querySelectorAll('#foReads .ol-read')]
      .find((x) => x.querySelector('.ol-dt').textContent.trim() === '有效焦距 EFL');
    return e && Math.abs(parseFloat(e.querySelector('.ol-dd').textContent) - v) < 5e-3;
  }, ORACLE.editedR1.efl, { timeout: 5000 });
  near(num(await readOf('#foReads', '有效焦距 EFL')), ORACLE.editedR1.efl, 5e-3, '改 R1 后的 EFL', assert);

  /* 切到单透镜预置 → 一阶量换成单透镜的值 */
  await page.selectOption('#lensPreset', 'singlet');
  await page.waitForTimeout(260);
  near(num(await readOf('#foReads', '有效焦距 EFL')), ORACLE.lens.singlet.efl, 5e-4, '单透镜 EFL', assert);
  near(num(await readOf('#foReads', '工作 F 数')), ORACLE.lens.singlet.fno, 5e-4, '单透镜 F 数', assert);
  const capBefore = await page.locator('#spotCap0').textContent();
  near(parseFloat(capBefore.match(/RMS 半径 ([\d.]+)/)[1]), ORACLE.spot.singlet[0].rms, 0.05, '单透镜轴上 RMS', assert);
  assert(/像差受限/.test(capBefore), '单透镜轴上应判为「像差受限」');

  /* 自动对焦：像距移动到引擎算出的位置，且 RMS 变小 */
  await page.click('#btnFocus');
  await page.waitForTimeout(400);
  const tAfter = parseFloat(await page.inputValue('#surfBody tr:nth-child(2) input[data-k="t"]'));
  near(tAfter, ORACLE.autofocus.t, 2e-3, '自动对焦后的像距', assert);
  const capAfter = await page.locator('#spotCap0').textContent();
  assert(parseFloat(capAfter.match(/RMS 半径 ([\d.]+)/)[1]) < parseFloat(capBefore.match(/RMS 半径 ([\d.]+)/)[1]),
    '自动对焦后轴上 RMS 应变小');
  assert(/已按视场 0 的最小 RMS 对焦/.test(await page.locator('#lensMsg').textContent()), '缺少对焦提示');

  /* 非球面预置：k=−n² 的双曲面应给出严格零球差（RMS < 艾里半径） */
  await page.selectOption('#lensPreset', 'aspheric');
  await page.waitForTimeout(300);
  const aspCap = await page.locator('#spotCap0').textContent();
  assert(/衍射受限/.test(aspCap), `非球面轴上应为「衍射受限」，实际：${aspCap}`);
  assert(parseFloat(aspCap.match(/RMS 半径 ([\d.]+)/)[1]) < 0.01, `非球面轴上 RMS 应≈0，实际 ${aspCap}`);
  /* 同一透镜改成球面（k=0）必须立刻变成像差受限 —— 对照组，证明上一条不是恒真 */
  await page.fill('#surfBody tr:nth-child(2) input[data-k="k"]', '0');
  await page.locator('#surfBody tr:nth-child(2) input[data-k="k"]').press('Enter');
  await page.waitForTimeout(350);
  const sphCap = await page.locator('#spotCap0').textContent();
  assert(/像差受限/.test(sphCap) && parseFloat(sphCap.match(/RMS 半径 ([\d.]+)/)[1]) > 100,
    `改成球面后应像差受限且 RMS>100 µm，实际：${sphCap}`);
  /* Cooke 三片：光阑在系统**内部**，这时才测得到「实光线主光线瞄准」。
     只用 stop=0 的预置时，瞄准点恒为 0，把瞄准整段删掉测试也照样绿（改坏验证实撞）。*/
  await page.selectOption('#lensPreset', 'cooke');
  await page.waitForTimeout(340);
  near(num(await readOf('#foReads', '有效焦距 EFL')), ORACLE.lens.cooke.efl, 5e-4, 'Cooke EFL', assert);
  near(num(await readOf('#foReads', '入瞳位置')), ORACLE.lens.cooke.enp, 5e-4, 'Cooke 入瞳位置', assert);
  for (let i = 0; i < ORACLE.spot.cooke.length; i++) {
    const cap = await page.locator('#spotCap' + i).textContent();
    near(parseFloat(cap.match(/RMS 半径 ([\d.]+)/)[1]), ORACLE.spot.cooke[i].rms, 0.05, `Cooke 点列图 ${i} RMS`, assert);
  }
  /* 定义级断言：主光线必须**正好**过光阑中心（不依赖任何一方的实现） */
  const chiefAtStop = await page.evaluate(() => {
    const S = window.OLUI.S, sys = window.OLUI.sysOf(), lam = window.OLUI.lam0();
    return S.lens.fields.map((f) => {
      const t = OL.traceFP(sys, lam, f, 0, 0);
      return [f, t.ok ? t.pts[sys.stop][1] : null];
    });
  });
  assert(chiefAtStop.length >= 3, '主光线检查应覆盖全部视场');
  for (const [f, y] of chiefAtStop)
    assert(y !== null && Math.abs(y) < 1e-9,
      `视场 ${f}° 的主光线在光阑面上的高度 ${y}，应为 0（实光线瞄准失效）`);
  /* 圆锥面：矢高闭式与光线求交解出来的交点必须是同一张面（两条独立代码路径） */
  await page.selectOption('#lensPreset', 'aspheric');
  await page.waitForTimeout(320);
  const sagCheck = await page.evaluate(() => {
    const sys = window.OLUI.sysOf(), lam = window.OLUI.lam0();
    const zv = OL.vertices(sys), out = [];
    for (const py of [0.2, 0.45, 0.7, 0.9, 1.0]) {
      const t = OL.traceFP(sys, lam, 0, 0, py);
      if (!t.ok) { out.push([py, null, null]); continue; }
      for (let i = 0; i < sys.surfs.length; i++) {
        const S2 = sys.surfs[i], c = S2.r === 0 ? 0 : 1 / S2.r;
        const x = t.pts[i][0], y = t.pts[i][1];
        const zHit = t.pts[i][2] - zv[i];
        out.push([py + i / 10, zHit, OL.conicSag(x * x + y * y, c, S2.k || 0)]);
      }
    }
    return out;
  });
  assert(sagCheck.length >= 8, `圆锥面自洽检查样本数 ${sagCheck.length} 太少`);
  let sagWorst = 0;
  for (const [tag, zHit, sag] of sagCheck) {
    assert(zHit !== null && sag !== null && Number.isFinite(sag), `圆锥面自洽：${tag} 处求交失败`);
    sagWorst = Math.max(sagWorst, Math.abs(zHit - sag));
  }
  assert(sagWorst < 1e-9,
    `矢高闭式与求交结果不是同一张面，最大偏差 ${sagWorst.toExponential(3)} mm`);

  await page.selectOption('#lensPreset', 'achromat');
  await page.waitForTimeout(300);
  noErr('镜头页');

  /* ───────── 3. 像差页 ───────── */
  await go('aberr');
  assert(await page.locator('#figFanT path').count() >= 3, '子午光扇缺曲线');
  assert(await page.locator('#figFanS path').count() >= 3, '弧矢光扇缺曲线');
  assert(await page.locator('#figFC path').count() >= 2, '场曲图缺 T/S 两条曲线');
  assert(await page.locator('#figDist path').count() >= 1, '畸变图缺曲线');
  assert(await page.locator('#figChrom path').count() >= 1, '轴向色差图缺曲线');
  assert(await page.locator('#figTF path').count() >= 3, '通过焦图应有 3 条视场曲线');
  assert(await page.locator('#fanLegend span').count() === ORACLE.lens.achromat.wvl.length, '光扇图例条数不对');
  /* 换视场 → 光扇曲线的路径数据必须变化 */
  const fanBefore = await page.locator('#figFanT path').first().getAttribute('d');
  await page.selectOption('#fanField', '2');
  await page.waitForTimeout(300);
  const fanAfter = await page.locator('#figFanT path').first().getAttribute('d');
  assert(fanBefore !== fanAfter, '换视场后光扇曲线没有重画');
  noErr('像差页');

  /* ───────── 4. 波前页 ───────── */
  await go('wave');
  near(num(await readOf('#waveReads', 'RMS 波前误差')), ORACLE.wave.rmsW, 5e-4, 'RMS 波前误差', assert);
  near(num(await readOf('#waveReads', 'Strehl 比（FFT）')), ORACLE.wave.strehl, 5e-4, 'Strehl 比', assert);
  near(num(await readOf('#waveReads', 'Strehl（马雷夏尔近似）')), ORACLE.wave.marechal, 5e-4, '马雷夏尔 Strehl', assert);
  near(num(await readOf('#waveReads', '截止频率 νc')), ORACLE.wave.cutoff, 0.06, '截止频率', assert);
  near(num(await readOf('#waveReads', '光瞳采样点')), ORACLE.wave.nPupil, 0, '光瞳采样点数', assert);
  assert(/衍射受限/.test(await readFull('#waveReads', '判据')), '本预置的波前应判为衍射受限');
  assert((await page.locator('#opdLegend span').first().textContent())
    .includes(String(ORACLE.wave.raysampled)), 'OPD 图例里的采样光线数不对');
  assert(await page.locator('#figOPD rect').count() > 500, 'OPD 彩色图缺格子');
  assert(await page.locator('#figPSF rect').count() > 500, 'PSF 图缺像素');
  assert(await page.locator('#figMTF path').count() >= 3, 'MTF 图应有子午/弧矢/衍射极限三条');
  assert(await page.locator('#figEE path').count() >= 2, '环围能量图应有两条曲线');
  /* 切到泽尼克合成并填 Z4=0.5 → Strehl 换成引擎算出的那个数 */
  await page.selectOption('#waveSrc', 'zern');
  await page.waitForTimeout(200);
  assert(await page.locator('#zernBox').isVisible(), '选泽尼克后系数表应显示');
  const z4 = page.locator('#zernBody tr').filter({ hasText: '离焦' }).locator('input');
  await z4.fill('0.5'); await z4.press('Enter');
  await page.waitForTimeout(500);
  near(num(await readOf('#waveReads', 'Strehl 比（FFT）')), ORACLE.waveZern.strehl, 2e-3, '泽尼克 Z4=0.5 的 Strehl', assert);
  near(num(await readOf('#waveReads', 'RMS 波前误差')), ORACLE.waveZern.rmsW, 2e-3, '泽尼克 Z4=0.5 的 RMS', assert);
  await page.selectOption('#waveSrc', 'lens');
  await page.waitForTimeout(400);
  noErr('波前页');

  /* ───────── 5. 玻璃页 ───────── */
  await go('glass');
  assert(await page.locator('#figAbbe circle').count() === ORACLE.glass.n,
    `阿贝图应有 ${ORACLE.glass.n} 个玻璃点`);
  assert(await page.locator('#g1 option').count() === ORACLE.glass.n, '玻璃下拉条数不对');
  const grow = async (label, col) => num(await page.locator('#glassBody tr')
    .filter({ hasText: label }).locator('td').nth(col).textContent());
  near(await grow('n_d (587.56 nm)', 1), ORACLE.glass.bk7.nd, 5e-7, 'N-BK7 n_d', assert);
  near(await grow('n_F (486.13 nm)', 1), ORACLE.glass.bk7.nF, 5e-7, 'N-BK7 n_F', assert);
  near(await grow('n_C (656.27 nm)', 1), ORACLE.glass.bk7.nC, 5e-7, 'N-BK7 n_C', assert);
  near(await grow('阿贝数 V_d', 1), ORACLE.glass.bk7.vd, 5e-5, 'N-BK7 阿贝数', assert);
  near(await grow('相对部分色散 P_gF', 1), ORACLE.glass.bk7.pgF, 5e-6, 'N-BK7 P_gF', assert);
  near(await grow('n_d (587.56 nm)', 2), ORACLE.glass.sf5.nd, 5e-7, 'N-SF5 n_d', assert);
  /* 换玻璃 → 表格换成新玻璃的值 */
  await page.selectOption('#g1', 'N-LASF9');
  await page.waitForTimeout(280);
  near(await grow('n_d (587.56 nm)', 1), ORACLE.glass.lasf9.nd, 5e-7, '换成 N-LASF9 后的 n_d', assert);
  await page.selectOption('#g1', 'N-BK7');
  await page.waitForTimeout(220);
  /* 消色差求解器：解出的处方与引擎逐位一致，并真的载入镜头页 */
  await page.fill('#acF', '200'); await page.fill('#acD', '25');
  await page.click('#btnAchro');
  await page.waitForFunction(() => !document.getElementById('pane-lens').hidden);
  await page.waitForTimeout(400);
  near(parseFloat(await page.inputValue('#surfBody tr:nth-child(1) input[data-k="r"]')), ORACLE.achro.R1, 1e-4, '求解出的 R1', assert);
  near(parseFloat(await page.inputValue('#surfBody tr:nth-child(2) input[data-k="r"]')), ORACLE.achro.R2, 1e-4, '求解出的 R2', assert);
  near(parseFloat(await page.inputValue('#surfBody tr:nth-child(3) input[data-k="r"]')), ORACLE.achro.R3, 1e-4, '求解出的 R3', assert);
  near(num(await readOf('#foReads', '有效焦距 EFL')), ORACLE.achro.efl, 5e-3, '求解结果的实际 EFL', assert);
  assert(Math.abs(ORACLE.achro.efl - 200) < 1, `消色差解的 EFL ${ORACLE.achro.efl} 应接近目标 200`);
  assert(Math.abs(ORACLE.achro.dBFL) < 0.2, `F/C 焦点差 ${ORACLE.achro.dBFL} mm 应 < 0.2（消色差成立）`);
  noErr('玻璃页');
  await go('lens'); await page.selectOption('#lensPreset', 'achromat'); await page.waitForTimeout(260);

  /* ───────── 6. 镀膜页 ───────── */
  await go('coat');
  for (const [id, key] of [['bare', 'bare'], ['ar1', 'ar1'], ['ar2', 'ar2'], ['hr', 'hr'], ['agmir', 'agmir']]) {
    await page.selectOption('#coatPreset', id);
    await page.waitForTimeout(260);
    const o = ORACLE.coat[key];
    near(num(await readOf('#coatReads', '反射率 R')), o.R * 100, 5e-3, `${id} 反射率`, assert);
    near(num(await readOf('#coatReads', '透射率 T')), o.T * 100, 5e-3, `${id} 透射率`, assert);
    near(num(await readOf('#coatReads', '可见光平均 R')), o.avgVis * 100, 5e-3, `${id} 可见光平均 R`, assert);
    assert(await page.locator('#coatBody tr').count() === Math.max(1, o.layers),
      `${id} 的层数行数应为 ${Math.max(1, o.layers)}`);
  }
  /* 高反堆的 R 必须显著高于单层增透 —— 跨预置的物理性质 */
  assert(ORACLE.coat.hr.R > 0.99 && ORACLE.coat.ar1.R < 0.02,
    `HR 堆 R=${ORACLE.coat.hr.R} 应 >0.99，单层 AR R=${ORACLE.coat.ar1.R} 应 <0.02`);
  /* 裸玻璃 + 布儒斯特角 + p 偏振 ⇒ R 应为 0 */
  await page.selectOption('#coatPreset', 'bare');
  await page.waitForTimeout(220);
  await page.fill('#coatAOI', String(ORACLE.brewster.toFixed(4)));
  await page.locator('#coatAOI').press('Enter');
  await page.selectOption('#coatPol', 'p');
  await page.waitForTimeout(300);
  assert(num(await readOf('#coatReads', '反射率 R')) < 1e-3,
    `布儒斯特角 ${ORACLE.brewster.toFixed(3)}° 上 p 偏振反射率应为 0，实际 ${await readOf('#coatReads', '反射率 R')}`);
  await page.selectOption('#coatPol', 'u');
  await page.fill('#coatAOI', '0'); await page.locator('#coatAOI').press('Enter');
  await page.waitForTimeout(240);
  /* 改入射角 → 读数换成 45° 的值 */
  await page.selectOption('#coatPreset', 'ar1'); await page.waitForTimeout(240);
  await page.fill('#coatAOI', '45'); await page.locator('#coatAOI').press('Enter');
  await page.waitForTimeout(300);
  near(num(await readOf('#coatReads', '反射率 R')), ORACLE.coat.ar1.R45 * 100, 5e-3, '45° 入射的反射率', assert);
  await page.fill('#coatAOI', '0'); await page.locator('#coatAOI').press('Enter');
  await page.waitForTimeout(240);
  assert(await page.locator('#figSpec path').count() >= 3, '光谱曲线应有 R/T/A 三条');
  assert(await page.locator('#figAngle path').count() >= 2, '角度扫描应有 s/p 两条');
  noErr('镀膜页');

  /* ───────── 7. 高斯光束页 ───────── */
  await go('beam');
  near(num(await readOf('#beamReads', '入射瑞利长度 z_R')), ORACLE.beam.zR, 5e-3, '瑞利长度', assert);
  near(num(await readOf('#beamReads', '出射光束半径 w')), ORACLE.beam.wEnd * 1000, 5e-3, '出射光束半径', assert);
  near(num(await readOf('#beamReads', '出射束腰半径 w₀′')), ORACLE.beam.waistW * 1000, 5e-3, '出射束腰', assert);
  near(num(await readOf('#beamReads', '束腰位置')), ORACLE.beam.waistZ, 5e-3, '束腰位置', assert);
  near(num(await readOf('#beamReads', '入射远场发散半角')), ORACLE.beam.div, 5e-4, '发散半角', assert);
  near(num(await readOf('#cavReads', 'g₁ = 1 − L/R₁')), ORACLE.cav.g1, 1e-4, '腔 g₁', assert);
  near(num(await readOf('#cavReads', 'g₁g₂')), ORACLE.cav.g, 1e-4, '腔 g₁g₂', assert);
  near(num(await readOf('#cavReads', '腔内束腰 w₀')), ORACLE.cav.w0, 5e-3, '腔内束腰', assert);
  near(num(await readOf('#cavReads', '纵模间隔 FSR')), ORACLE.cav.fsr, 5e-3, '纵模间隔', assert);
  assert(/稳定/.test(await readFull('#cavReads', 'g₁g₂')), '当前腔应判为稳定');
  /* 把腔长改到不稳定区 → 判定翻转 */
  await page.fill('#cavL', '1200'); await page.locator('#cavL').press('Enter');
  await page.waitForTimeout(300);
  assert(/不稳定/.test(await readFull('#cavReads', 'g₁g₂')), 'L=1200 (>2R) 时应判为不稳定');
  await page.fill('#cavL', '300'); await page.locator('#cavL').press('Enter');
  await page.waitForTimeout(260);
  assert(await page.locator('#beamBody tr').count() === 3, '元件表应有 3 行');
  assert(await page.locator('#figBeam path').count() >= 3, '光束图缺曲线');
  noErr('光束页');

  /* ───────── 8. 说明页：能力清单逐条现场核验 ───────── */
  await go('about');
  const caps = await page.evaluate(() => (window.OL_CAPS || []).map((c) => {
    let ok = false, err = null;
    try { ok = !!c[1](); } catch (e) { err = String(e.message); }
    return [c[0], ok, err];
  }));
  assert(caps.length === ORACLE.caps, `能力清单应有 ${ORACLE.caps} 条，实际 ${caps.length}`);
  const dead = caps.filter((c) => !c[1]);
  assert(dead.length === 0, `能力清单有 ${dead.length} 条在页面上跑不出来：`
    + dead.map((d) => d[0] + (d[2] ? '(' + d[2] + ')' : '')).join('、'));
  assert(await page.locator('#capList li').count() === ORACLE.caps, '清单渲染条数不对');
  /* 页面公布的对拍点数必须等于离线套件实际跑出来的那个字面量（异源核对） */
  const aboutText = await page.locator('#pane-about').textContent();
  const shown = num((aboutText.match(/离线对拍\s*([\d,]+)\s*个标量点/) || [])[1] || 'x');
  assert(shown === ORACLE.points,
    `页面公布的对拍点数 ${shown} 应等于离线套件实测的 ${ORACLE.points}`);
  noErr('说明页');

  /* ───────── 9. 结构守卫 ───────── */
  /* 9a. [hidden] 必须真的隐藏（断计算样式，不是断属性） */
  const hid = await page.evaluate((tabs) => tabs.map((t) => {
    const p = document.getElementById('pane-' + t);
    return [t, p.hidden, getComputedStyle(p).display];
  }), TABS);
  for (const [t, h, disp] of hid) {
    if (h) assert(disp === 'none', `隐藏面板 ${t} 的 display=${disp}，[hidden] 被作者 CSS 覆盖了`);
  }
  assert(hid.filter((x) => x[1]).length === TABS.length - 1, '同一时刻应只有一个面板可见');

  /* 9b. 控件最小尺寸：逐页扫一遍（藏着的面板对尺寸守卫系统性失明） */
  let scanned = 0, bad = [];
  for (const t of TABS) {
    await go(t);
    const r = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('input, select, button')) {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const b = el.getBoundingClientRect();
        if (b.width === 0 && b.height === 0) continue;
        const tag = el.tagName.toLowerCase();
        const type = tag + (el.type ? ':' + el.type : '');
        out.push([type, b.width, b.height, el.id || el.className || '', tag]);
      }
      return out;
    });
    scanned += r.length;
    for (const [type, w, h, id, tag] of r) {
      // 按 tagName 判，别按 type —— <button> 的 el.type 默认是 "submit"，
      // 用 type==='button' 判会把所有按钮都按 100px 的输入框下限来量（第一轮实撞）
      const minW = /radio|checkbox/.test(type) ? 14 : (tag === 'button' ? 52 : 100);
      if (w < minW - 0.5 || h < 17.5) bad.push(`${t}/${type}#${id} ${w.toFixed(1)}×${h.toFixed(1)}`);
    }
  }
  assert(scanned >= 60, `控件尺寸守卫只扫到 ${scanned} 个控件，应 ≥ 60`);
  assert(bad.length === 0, `控件塌缩：${bad.slice(0, 6).join('、')}`);

  /* 9c. 窄屏不横向溢出（1280 下富余、390 下才会露馅） */
  for (const vw of [390, 768, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of TABS) {
      await go(t);
      const over = await page.evaluate(() => {
        const de = document.documentElement;
        const d = de.scrollWidth - de.clientWidth;
        if (d <= 1) return { d: d, who: '' };
        let who = '', mx = 0;
        for (const el of document.querySelectorAll('body *')) {
          const b = el.getBoundingClientRect();
          if (b.width === 0) continue;
          if (b.right > mx) { mx = b.right; who = el.tagName.toLowerCase() + '.' + (el.className || '') + '#' + (el.id || ''); }
        }
        return { d: d, who: who + ' right=' + mx.toFixed(1) };
      });
      assert(over.d <= 1, `${vw}px 下「${t}」页横向溢出 ${over.d}px，越界元素：${over.who}`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });

  /* 9d. text-transform：断计算样式（扫文本测不出 CSS 改写） */
  for (const t of TABS) {
    await go(t);
    const tt = await page.evaluate(() => {
      const bad = [];
      for (const el of document.querySelectorAll('th, dt, label, .ol-dt, .ol-figtitle')) {
        const cs = getComputedStyle(el);
        if (cs.display === 'none') continue;
        if (cs.textTransform === 'uppercase') bad.push((el.id || el.className || el.tagName) + ':' + el.textContent.trim().slice(0, 14));
      }
      return bad;
    });
    assert(tt.length === 0, `${t} 页有 ${tt.length} 处 text-transform:uppercase（会把 Hz→HZ）：${tt.slice(0, 3).join('、')}`);
  }

  /* 9e. 图上的文字两两不相交，且该画的标注真的画出来了 */
  await go('lens');
  const figs = ['figLayout', 'figSpot0', 'figSpot1'];
  for (const f of figs) {
    const r = await page.evaluate((id) => {
      const svg = document.getElementById(id);
      if (!svg) return null;
      const ts = [...svg.querySelectorAll('text')];
      const boxes = ts.map((t) => { const b = t.getBBox(); return { b, s: t.textContent }; });
      let hit = 0;
      for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i].b, c = boxes[j].b;
        if (a.x < c.x + c.width - 1 && c.x < a.x + a.width - 1 &&
            a.y < c.y + c.height - 1 && c.y < a.y + a.height - 1) hit++;
      }
      return { n: ts.length, hit };
    }, f);
    assert(r && r.n >= 4, `${f} 里的文字太少（${r && r.n}），避让器可能把标注全丢了`);
    assert(r.hit === 0, `${f} 里有 ${r.hit} 对文字互相重叠`);
  }
  /* 坐标轴刻度不能塌成 2 根 */
  await go('glass');
  for (const f of ['figAbbe', 'figDisp']) {
    const n = await page.evaluate((id) => {
      const svg = document.getElementById(id);
      const lines = [...svg.querySelectorAll('line')];
      const vb = svg.getAttribute('viewBox').split(/\s+/).map(Number);
      // 横向网格线 = y 刻度
      return lines.filter((l) => Math.abs(+l.getAttribute('y1') - +l.getAttribute('y2')) < 0.5
        && +l.getAttribute('x2') - +l.getAttribute('x1') > vb[2] * 0.4).length;
    }, f);
    assert(n >= 4, `${f} 的 y 轴刻度只有 ${n} 根，应 ≥ 4`);
  }

  /* 9f. 窄格文字不越出父容器（读数格） */
  await go('lens');
  const esc = await page.evaluate(() => {
    const bad = [];
    for (const card of document.querySelectorAll('#foReads .ol-read')) {
      const pb = card.getBoundingClientRect();
      for (const ch of card.querySelectorAll('.ol-dd, .ol-dt')) {
        const b = ch.getBoundingClientRect();
        if (b.right > pb.right + 1 || b.left < pb.left - 1 || b.bottom > pb.bottom + 1)
          bad.push(ch.textContent.trim().slice(0, 16));
      }
    }
    return bad;
  });
  assert(esc.length === 0, `读数格里有 ${esc.length} 处文字溢出：${esc.slice(0, 4).join('、')}`);

  /* 9g. 源码卫生：不许有裸控制字符 */
  const clean = await page.evaluate(() => {
    const t = document.documentElement.outerHTML;
    let n = 0;
    for (let i = 0; i < t.length; i++) {
      const c = t.charCodeAt(i);
      if ((c < 9) || (c > 10 && c < 13) || (c > 13 && c < 32) || c === 127) n++;
    }
    return n;
  });
  assert(clean === 0, `页面里有 ${clean} 个裸控制字符`);

  /* 9h. localStorage 跨刷新保持 */
  await go('coat');
  await page.selectOption('#coatPreset', 'hr');
  await page.waitForTimeout(300);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  assert(await page.locator('#pane-coat').isVisible(), '刷新后应回到镀膜页');
  assert(await page.inputValue('#coatLam0') === '550', '刷新后设计波长应保持');
  assert(await page.locator('#coatBody tr').count() === ORACLE.coat.hr.layers,
    '刷新后高反堆的层数应保持');

  noErr('收尾');

  /* ───────── 缩略图 ───────── */
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelectorAll('#foReads .ol-read').length >= 12);
  await page.waitForTimeout(700);
  await screenshot('thumb.png');
};
