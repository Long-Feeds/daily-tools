/* 飞行领航工作台 · 集成测试
 *
 * 真值来源：run 目录 oracle_test.py —— 大气/空速取 aerocalc3，风三角取「航向二分」独立算法，
 * 求风取复数向量差，大地线取 geographiclib，包线内外取 shapely。由 inject-oracle.mjs 机械注入
 * 下面的 ORACLE 块，本文件不手打任何计算结果（容差 = 页面显示位数的半个最小单位 + oracle 口径差）。
 */
import { renderGuards } from '/Users/lon/.agents/cron/daily-website/tools/render-guards.mjs';

const ORACLE = {
 "meta": {
  "tabs": [
   "wind",
   "atmo",
   "rwy",
   "wb",
   "nav"
  ]
 },
 "wind1": {
  "wca": 10.257743199614048,
  "th": 85.25774319961405,
  "gs": 98.8225027601378,
  "thS": "085°",
  "mhS": "088°",
  "gsS": "98.8",
  "wcaS": "R 10.3"
 },
 "wind2": {
  "thS": "282°",
  "gsS": "98.0",
  "wcaS": "R 11.5"
 },
 "find": {
  "dirS": "137°",
  "spdS": "27.0"
 },
 "atmo": {
  "pa": 5573.650349562717,
  "da": 8706.196960872534,
  "tas": 125.3424767668346,
  "mach": 0.18413440835847175,
  "pa_inhg": 5570.213426262211,
  "da_dew": 9051.614816070522,
  "isaT": 3.957483927446333,
  "tas_m05": 340.35593315839867
 },
 "rwy": {
  "14": {
   "head": -11.817693036146496,
   "cross": 2.083778132003163,
   "headMin": -20,
   "crossMax": 12.85575219373079
  },
  "32": {
   "head": 11.817693036146496,
   "cross": -2.083778132003164,
   "headMin": 9.192533317427737,
   "crossMax": 12.855752193730785
  },
  "02L": {
   "head": 4.104241719908028,
   "cross": -11.2763114494309,
   "headMin": -3.4729635533386065,
   "crossMax": 20
  },
  "20R": {
   "head": -4.104241719908025,
   "cross": 11.276311449430901,
   "headMin": -15.320888862379558,
   "crossMax": 20
  },
  "02C": {
   "head": 4.104241719908028,
   "cross": -11.2763114494309,
   "headMin": -3.4729635533386065,
   "crossMax": 20
  },
  "20C": {
   "head": -4.104241719908025,
   "cross": 11.276311449430901,
   "headMin": -15.320888862379558,
   "crossMax": 20
  }
 },
 "rwy_mag": {
  "head": 20,
  "cross": 0
 },
 "wb1": {
  "ramp": {
   "w": 2470,
   "cg": 43.93441295546559,
   "in": true,
   "util": false
  },
  "to": {
   "w": 2461.6,
   "cg": 43.92053948651284,
   "in": true,
   "util": false
  },
  "ldg": {
   "w": 2353.6,
   "cg": 43.73334466349422,
   "in": true,
   "util": false
  },
  "shift43": 39.06896551724137
 },
 "wb2": {
  "ramp": {
   "w": 2918,
   "cg": 47.59150102810144,
   "in": false,
   "util": false
  },
  "to": {
   "w": 2909.6,
   "cg": 47.5903216937036,
   "in": false,
   "util": false
  },
  "ldg": {
   "w": 2801.6,
   "cg": 47.574528840662474,
   "in": false,
   "util": false
  }
 },
 "wb3": {
  "ramp": {
   "w": 2600,
   "cg": 49.38,
   "in": false,
   "util": false
  },
  "to": {
   "w": 2591.6,
   "cg": 49.3844729124865,
   "in": false,
   "util": false
  },
  "ldg": {
   "w": 2483.6,
   "cg": 49.44467708165566,
   "in": false,
   "util": false
  }
 },
 "nav": {
  "rows": [
   {
    "thS": "305°",
    "mhS": "306°",
    "chS": "306°",
    "gsS": "102.2",
    "ete": 10.571890190489684
   },
   {
    "thS": "279°",
    "mhS": "280°",
    "chS": "281°",
    "gsS": "98.0",
    "ete": 25.702910268646278
   },
   {
    "thS": "244°",
    "mhS": "244°",
    "chS": "243°",
    "gsS": "94.1",
    "ete": 17.219326187237538
   }
  ],
  "time": 53.4941266463735,
  "trip": 8.024118996956025,
  "landing": 40.575881003043975,
  "margin": 33.825881003043975
 },
 "geo": {
  "az1": 301.1909823238944,
  "nm": 160.0045248860019,
  "az2": 301.1093277412072
 },
 "nav_fill": {
  "tc": 301,
  "dist": 160,
  "time": 134.74941386929572
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(toolURL);
  await page.evaluate(() => { localStorage.clear(); });
  await page.reload();
  await page.waitForSelector('#fl-w-out [data-k=th]');

  const onTab = async (t) => {
    await page.click(`#fl-tab-${t}`);
    await page.waitForFunction((t) => !document.getElementById(`fl-pane-${t}`).hidden, t);
  };
  const txt = (sel) => page.$eval(sel, (n) => n.textContent.trim());
  const ro = (box, k) => txt(`#${box} [data-k=${k}] dd`);
  const num = (s) => parseFloat(String(s).replace(/,/g, '').replace(/^[RL]\s*/, ''));
  const set = async (sel, v) => { await page.fill(sel, String(v)); };
  const waitRo = (box, k, pred) => page.waitForFunction(([box, k, src]) => {
    const n = document.querySelector(`#${box} [data-k=${k}] dd`);
    return n && new Function('t', 'return ' + src)(n.textContent.trim());
  }, [box, k, pred], { timeout: 10000 });

  assert(await page.$eval('a[href="../../"]', (a) => a.textContent.includes('返回工具集')), '顶部有返回链接');

  /* ── 1. 风三角 ── */
  const W1 = ORACLE.wind1;
  assert((await ro('fl-w-out', 'th')) === W1.thS, `TH ${await ro('fl-w-out', 'th')} = ${W1.thS}`);
  assert((await ro('fl-w-out', 'mh')).startsWith(W1.mhS), `MH（3W）= ${W1.mhS}`);
  assert((await ro('fl-w-out', 'gs')).startsWith(W1.gsS), `GS ${await ro('fl-w-out', 'gs')} = ${W1.gsS}`);
  assert((await ro('fl-w-out', 'wca')).startsWith(W1.wcaS), `WCA = ${W1.wcaS}`);
  await set('#fl-w-tc', 270); await set('#fl-w-tas', 100); await set('#fl-w-wdir', 360); await set('#fl-w-wspd', 20);
  await waitRo('fl-w-out', 'th', `t === ${JSON.stringify(ORACLE.wind2.thS)}`);
  assert((await ro('fl-w-out', 'gs')).startsWith(ORACLE.wind2.gsS), `第二组 GS = ${ORACLE.wind2.gsS}`);
  assert((await ro('fl-w-out', 'wca')).startsWith(ORACLE.wind2.wcaS), `第二组 WCA = ${ORACLE.wind2.wcaS}`);
  // 非法：侧风 ≥ TAS
  await set('#fl-w-wspd', 150);
  await page.waitForFunction(() => !document.getElementById('fl-w-err').hidden);
  assert(/侧风分量/.test(await txt('#fl-w-err')), '侧风超过 TAS 报错');
  assert(await page.$eval('#fl-w-out', (n) => n.children.length === 0), '报错时清空结果');
  await set('#fl-w-wspd', 20); await set('#fl-w-var', '7Q');
  await page.waitForFunction(() => /磁差/.test(document.getElementById('fl-w-err').textContent));
  assert(await page.$eval('#fl-w-var', (n) => n.classList.contains('fl-bad')), '非法磁差标红');
  await set('#fl-w-var', '3W');
  await page.waitForFunction(() => document.getElementById('fl-w-err').hidden);
  assert(await page.$eval('#fl-w-err', (n) => getComputedStyle(n).display === 'none'), '错误条计算样式为 none');
  // 求风模式
  await page.click('#fl-wmode-find');
  await waitRo('fl-w-out', 'wdir', `t.startsWith(${JSON.stringify(ORACLE.find.dirS)})`);
  assert((await ro('fl-w-out', 'wspd')).startsWith(ORACLE.find.spdS), `求风风速 = ${ORACLE.find.spdS}`);
  assert(await page.$eval('#fl-w-hdg', (n) => getComputedStyle(n).display === 'none'), '求风模式下求航向表单被藏住');
  const windTexts = await page.$$eval('#fl-fig-wind text', (ns) => ns.map((n) => n.textContent));
  assert(windTexts.some((t) => t.startsWith('TAS')) && windTexts.some((t) => t.startsWith('GS')) && windTexts.some((t) => t.startsWith('风 ')), `风三角图三个标注都画出来：${windTexts}`);
  await page.click('#fl-wmode-hdg');

  /* ── 2. 大气与空速 ── */
  await onTab('atmo');
  const A = ORACLE.atmo;
  assert(Math.abs(num(await ro('fl-a-out', 'pa')) - A.pa) <= 0.6, `PA ${await ro('fl-a-out', 'pa')} vs aerocalc3 ${A.pa}`);
  assert(Math.abs(num(await ro('fl-a-out', 'da')) - A.da) <= 0.6, `DA ${await ro('fl-a-out', 'da')} vs aerocalc3 ${A.da}`);
  assert(Math.abs(num(await ro('fl-a-out', 'isat')) - A.isaT) <= 0.051, 'ISA 温度');
  assert(Math.abs(num(await ro('fl-a-spd', 'tas')) - A.tas) <= 0.051, `TAS ${await ro('fl-a-spd', 'tas')} vs ${A.tas}`);
  assert(Math.abs(num(await ro('fl-a-spd', 'mach')) - A.mach) <= 0.00051, 'Mach');
  await page.selectOption('#fl-a-qunit', 'inhg');
  await page.waitForFunction(() => document.getElementById('fl-a-qnh').value === '29.77');
  assert(Math.abs(num(await ro('fl-a-out', 'pa')) - A.pa_inhg) <= 0.6, `inHg 下 PA vs ${A.pa_inhg}`);
  await page.selectOption('#fl-a-qunit', 'hpa');
  await set('#fl-a-qnh', 1008); await set('#fl-a-dew', 20);
  await waitRo('fl-a-out', 'rh', `t !== '—'`);
  assert(Math.abs(num(await ro('fl-a-out', 'da')) - A.da_dew) <= 15, `湿空气 DA ${await ro('fl-a-out', 'da')} vs aerocalc3 ${A.da_dew}（Buck vs Wobus）`);
  await page.selectOption('#fl-a-mode', 'mach'); await set('#fl-a-v', 0.5);
  await page.waitForFunction((v) => { const n = document.querySelector('#fl-a-spd [data-k=tas] dd'); return n && Math.abs(parseFloat(n.textContent) - v) <= 0.051; }, A.tas_m05, { timeout: 10000 });
  await set('#fl-a-v', 1.3);
  await page.waitForFunction(() => /马赫数 ≥ 1/.test(document.getElementById('fl-a-err').textContent));
  await set('#fl-a-v', 0.5); await set('#fl-a-dew', 40);
  await page.waitForFunction(() => /露点/.test(document.getElementById('fl-a-err').textContent));
  await set('#fl-a-dew', '');
  await page.selectOption('#fl-a-mode', 'cas'); await set('#fl-a-v', 110);
  await page.waitForFunction(() => document.getElementById('fl-a-err').hidden);
  assert((await page.$$eval('#fl-isa-tbl tbody tr', (r) => r.length)) === 15, 'ISA 速查表 15 行（0–20000 每 2000 + 25000–40000 每 5000）');
  assert((await txt('#fl-isa-tbl tbody tr:first-child')).includes('1013.2'), 'ISA 海平面 1013.2 hPa');
  const daTexts = await page.$$eval('#fl-fig-da text', (ns) => ns.map((n) => n.textContent));
  assert(daTexts.some((t) => t.startsWith('DA ')) && daTexts.some((t) => t.startsWith('ISA ')), `密度高度图标注齐全 ${daTexts}`);
  assert(daTexts.filter((t) => /^\d{1,2},\d{3}$/.test(t)).length >= 4, 'y 轴刻度 ≥ 4');

  /* ── 3. 跑道侧风 ── */
  await onTab('rwy');
  const RW = ORACLE.rwy;
  const rows = await page.$$eval('#fl-r-tbl tbody tr', (rs) => rs.map((r) => ({ id: r.dataset.id, td: [...r.cells].map((c) => c.textContent.trim()) })));
  assert(rows.length === 6, '六个跑道端');
  for (const r of rows) {
    const o = RW[r.id];
    assert(Math.abs(num(r.td[3]) - o.headMin) <= 0.051 && Math.abs(num(r.td[4]) - o.crossMax) <= 0.051, `${r.id} 最坏分量 ${r.td[3]}/${r.td[4]} vs ${o.headMin.toFixed(2)}/${o.crossMax.toFixed(2)}`);
    const side = o.cross > 0.05 ? 'R ' : o.cross < -0.05 ? 'L ' : '';
    assert(r.td[2].startsWith(side) && Math.abs(num(r.td[2]) - Math.abs(o.cross)) <= 0.051, `${r.id} 平均侧风 ${r.td[2]}`);
  }
  assert(rows.find((r) => r.id === '32').td[0].includes('推荐'), '推荐 32');
  assert(/推荐跑道 32/.test(await txt('#fl-r-best')), '推荐框写 32');
  await page.click('#fl-r-tbl tr[data-id="14"]');
  await page.waitForFunction(() => [...document.querySelectorAll('#fl-fig-rwy text')].some((n) => n.textContent === '14'));
  assert(await page.$eval('#fl-r-tbl tr[data-id="14"]', (r) => r.classList.contains('fl-pick')), '点击行切换示意跑道');
  await set('#fl-r-wind', '27015G10KT');
  await page.waitForFunction(() => /阵风/.test(document.getElementById('fl-r-err').textContent));
  assert((await page.$$eval('#fl-r-tbl tbody tr', (r) => r.length)) === 0, '非法风组清空表格');
  await set('#fl-r-wind', '27020KT'); await set('#fl-r-rwys', '10/28'); await set('#fl-r-var', '10W');
  await page.waitForFunction(() => document.querySelector('#fl-r-tbl tr[data-id="28"]'));
  const r28 = await page.$$eval('#fl-r-tbl tr[data-id="28"] td', (c) => c.map((x) => x.textContent.trim()));
  assert(Math.abs(num(r28[1]) - ORACLE.rwy_mag.head) <= 0.051 && r28[2] === '0', `真风 270 + 磁差 10W ⇒ 28 跑道正顶风 ${r28}`);
  await page.selectOption('#fl-r-ref', 'mag');
  await page.waitForFunction(() => document.querySelector('#fl-r-tbl tr[data-id="28"] td:nth-child(3)').textContent.trim() === 'L 3.5');
  await page.selectOption('#fl-r-ref', 'true');
  await set('#fl-r-wind', '31012G20KT 280V340'); await set('#fl-r-rwys', '02L/20R 02C/20C 14/32'); await set('#fl-r-var', '0');
  await page.waitForFunction(() => document.querySelectorAll('#fl-r-tbl tbody tr').length === 6);

  /* ── 4. 载重平衡 ── */
  await onTab('wb');
  const foot = () => page.$$eval('#fl-wb-tbl tfoot tr', (rs) => rs.map((r) => ({ s: r.dataset.state, td: [...r.cells].map((c) => c.textContent.trim()) })));
  const chk = async (O, tag) => {
    const f = await foot();
    for (const [k, i] of [['ramp', 0], ['to', 1], ['ldg', 2]]) {
      assert(Math.abs(num(f[i].td[1]) - O[k].w) <= 0.051, `${tag} ${f[i].s} 重量 ${f[i].td[1]} vs ${O[k].w}`);
      assert(Math.abs(num(f[i].td[2]) - O[k].cg) <= 0.0051, `${tag} ${f[i].s} 重心 ${f[i].td[2]} vs ${O[k].cg}`);
      assert(f[i].td[0].includes(O[k].in ? '正常类 内' : '正常类 外') && f[i].td[0].includes(O[k].util ? '实用类 内' : '实用类 外'), `${tag} ${f[i].s} 包线判定 vs shapely`);
    }
  };
  await chk(ORACLE.wb1, '默认');
  assert(/都在包线内/.test(await txt('#fl-wb-status')), '默认装载在包线内');
  const sh = ORACLE.wb1.shift43;
  assert((await txt('#fl-ws-out')).startsWith(sh > 0 ? `从「行李区 1」搬 ${sh.toFixed(1)} lb 到「前排座椅」` : `反向：从「前排座椅」搬 ${(-sh).toFixed(1)} lb`), `移载 ${await txt('#fl-ws-out')} vs ${sh}`);
  await set('#fl-wb-s0', 400); await set('#fl-wb-s1', 400); await set('#fl-wb-s2', 120); await set('#fl-wb-fuel', 53);
  await page.waitForFunction(() => /最大起飞重量/.test(document.getElementById('fl-wb-status').textContent));
  await chk(ORACLE.wb2, '超重');
  await set('#fl-wb-s0', 170); await set('#fl-wb-s1', 340); await set('#fl-wb-s2', 120); await set('#fl-wb-s3', 50); await set('#fl-wb-fuel', 40);
  await page.waitForFunction(() => /包线外/.test(document.getElementById('fl-wb-status').textContent));
  await chk(ORACLE.wb3, '后重心');
  assert(await page.$$eval('#fl-fig-wb circle', (cs) => cs.some((c) => c.getAttribute('fill') === '#da1e28')), '包线外的点画成红色');
  await set('#fl-wb-s3', 70);
  await page.waitForFunction(() => /超出该站上限 50/.test(document.getElementById('fl-wb-status').textContent));
  await set('#fl-wb-fuel', 60);
  await page.waitForFunction(() => /超过油箱容量/.test(document.getElementById('fl-wb-status').textContent));
  await set('#fl-wb-s0', 340); await set('#fl-wb-s1', 170); await set('#fl-wb-s2', 40); await set('#fl-wb-s3', 0); await set('#fl-wb-fuel', 40);
  await page.waitForFunction(() => /都在包线内/.test(document.getElementById('fl-wb-status').textContent));
  // 机型资料：坏 JSON 报错；改名另存后出现在下拉里
  await page.click('#fl-wb-det summary');
  await page.fill('#fl-wb-json', '{"name":"x"');
  await page.click('#fl-wb-save');
  await page.waitForFunction(() => /JSON 语法错误/.test(document.getElementById('fl-wb-jerr').textContent));
  await page.fill('#fl-wb-json', '{"name":"x","emptyW":1}');
  await page.click('#fl-wb-save');
  await page.waitForFunction(() => /stations/.test(document.getElementById('fl-wb-jerr').textContent));
  await page.evaluate(() => {
    const p = { name: '我的 172', emptyW: 1700, emptyArm: 41, mtow: 2450, fuelArm: 48, fuelCap: 40, fuelLbPerGal: 6,
      stations: [{ name: '前排', arm: 37 }, { name: '后排', arm: 73 }], envelopes: [{ name: '正常类', pts: [[35, 1500], [35, 1950], [41, 2450], [47, 2450], [47, 1500]] }] };
    document.getElementById('fl-wb-json').value = JSON.stringify(p);
  });
  await page.click('#fl-wb-save');
  await page.waitForFunction(() => document.querySelectorAll('#fl-wb-prof option').length === 2 && document.getElementById('fl-wb-stations').querySelectorAll('input').length === 2);
  assert(/我的 172/.test(await page.$eval('#fl-wb-prof', (s) => s.selectedOptions[0].textContent)), '另存机型已选中');

  /* ── 5. 航行计划 ── */
  await onTab('nav');
  const N = ORACLE.nav;
  const nrows = await page.$$eval('#fl-n-tbl tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent.trim())));
  assert(nrows.length === 3, '三段');
  N.rows.forEach((o, i) => {
    assert(nrows[i][2] === o.thS && nrows[i][3] === o.mhS && nrows[i][4] === o.chS, `第 ${i + 1} 段 TH/MH/CH ${nrows[i].slice(2, 5)} vs ${o.thS}/${o.mhS}/${o.chS}`);
    assert(nrows[i][5] === o.gsS, `第 ${i + 1} 段 GS ${nrows[i][5]} vs ${o.gsS}`);
  });
  const hm = (m) => { const t = Math.round(m); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); };
  assert((await txt('#fl-s-time b')) === hm(N.time), `总航时 ${await txt('#fl-s-time b')} vs ${hm(N.time)}`);
  assert(Math.abs(num(await txt('#fl-s-land b')) - N.landing) <= 0.051, `落地余油 vs ${N.landing}`);
  assert((await txt('#fl-k-time')) === hm(N.time), '头部 KPI 同步');
  assert((await txt('#fl-n-fuelmsg')).includes(`仍余 ${N.margin.toFixed(1)} gal`), `余量 ${N.margin}`);
  assert((await txt('#fl-n-tbl tbody tr:first-child td:last-child')) === hm(570 + N.rows[0].ete), '第一段预达时刻');
  // 坐标 → 航线
  const G = ORACLE.geo;
  assert(Math.abs(num(await ro('fl-g-out', 'dist')) - G.nm) <= 0.051, `大地线距离 ${await ro('fl-g-out', 'dist')} vs geographiclib ${G.nm}`);
  assert((await ro('fl-g-out', 'tc')) === String(Math.round(G.az1) % 360).padStart(3, '0') + '°', '起点真航线');
  await page.click('#fl-g-fill');
  await page.waitForFunction((t) => document.querySelector('#fl-s-time b').textContent === t, hm(ORACLE.nav_fill.time), { timeout: 10000 });
  assert(await page.$eval('#fl-n-edit tbody tr:last-child input[data-f=dist]', (i) => +i.value) === ORACLE.nav_fill.dist, '距离已填入最后一段');
  // 加一段、改成非法、删掉
  await page.click('#fl-n-add');
  await page.waitForFunction(() => document.querySelectorAll('#fl-n-tbl tbody tr').length === 4);
  await page.fill('#fl-n-edit tbody tr:last-child input[data-f=varText]', '5Q');
  await page.waitForFunction(() => /第 4 段.*磁差/.test(document.getElementById('fl-n-err').textContent));
  await page.click('#fl-n-edit tbody tr:last-child [data-del]');
  await page.waitForFunction(() => document.getElementById('fl-n-err').hidden && document.querySelectorAll('#fl-n-tbl tbody tr').length === 3);
  await set('#fl-n-fuel', 15);
  await page.waitForFunction(() => /油量不足/.test(document.getElementById('fl-n-fuelmsg').textContent));
  await set('#fl-n-fuel', 50);
  await page.click('#fl-n-csv');
  await page.waitForFunction(() => typeof window.__flLastCsv === 'string');
  const csv = await page.evaluate(() => window.__flLastCsv);
  assert(csv.split('\n').length === 4 && csv.startsWith('航段,真航线'), 'CSV 表头 + 3 行');
  await set('#fl-g-lat2', '95');
  await page.waitForFunction(() => /纬度超出/.test(document.getElementById('fl-g-err').textContent));
  await set('#fl-g-lat2', '2.7456');

  /* ── 6. 持久化：刷新后页签、航段、机型都在 ── */
  await page.waitForTimeout(400); // 等 150ms 防抖写盘
  await page.reload();
  await page.waitForFunction(() => !document.getElementById('fl-pane-nav').hidden);
  assert(await page.$eval('#fl-n-edit tbody tr:last-child input[data-f=dist]', (i) => +i.value) === ORACLE.nav_fill.dist, '刷新后航段保留');
  assert(/我的 172/.test(await page.$eval('#fl-wb-prof', (s) => s.selectedOptions[0].textContent)), '刷新后机型保留');
  // 键盘切页签
  await page.focus('#fl-tab-nav'); await page.keyboard.press('Home');
  await page.waitForFunction(() => !document.getElementById('fl-pane-wind').hidden && document.activeElement.id === 'fl-tab-wind');
  await page.keyboard.press('ArrowLeft');
  await page.waitForFunction(() => !document.getElementById('fl-pane-nav').hidden);
  // 删除自建机型回到示例
  await onTab('wb');
  await page.click('#fl-wb-det summary');
  await page.click('#fl-wb-del');
  await page.waitForFunction(() => document.querySelectorAll('#fl-wb-prof option').length === 1);
  await onTab('nav'); await page.click('#fl-n-reset');

  /* ── 7. 渲染守卫 ── */
  const nCtl = await renderGuards(page, {
    assert, tabs: ORACLE.meta.tabs, onTab,
    paneSel: (t) => `#fl-pane-${t}`, panesRoot: '#fl-panes',
    figSel: (t) => `#fl-pane-${t} svg.fl-fig`, cardSel: '.fl-tile',
    minControls: 50, minTextsInFig: 3,
  });
  void nCtl;
  // 窄屏：图的 viewBox 跟随渲染宽（字号不被缩成蚂蚁字）
  await page.setViewportSize({ width: 390, height: 900 });
  await onTab('wb');
  await page.waitForFunction(() => { const s = document.getElementById('fl-fig-wb'); return Math.abs(+s.getAttribute('viewBox').split(' ')[2] - s.getBoundingClientRect().width) <= 2; });
  for (const vw of [390, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    await onTab('rwy');
    for (const id of ['32', '14', '02L']) {
      await page.click(`#fl-r-tbl tr[data-id="${id}"]`);
      await page.waitForFunction((id) => [...document.querySelectorAll('#fl-fig-rwy text')].some((n) => n.textContent === id), id);
      const tt = await page.$$eval('#fl-fig-rwy text', (ns) => ns.map((n) => n.textContent));
      assert(['顶风|顺风', '[左右]侧风 ', '最坏侧风'].every((p) => tt.some((t) => new RegExp('^(' + p + ')').test(t))), `视口 ${vw} 跑道 ${id} 三个分量标注都画出来：${tt}`);
    }
  }
  await page.click('#fl-r-tbl tr[data-id="32"]');
  await page.setViewportSize({ width: 1280, height: 850 });

  assert(errors.length === 0, `页面无 JS 错误：${errors.join(' | ')}`);
  await onTab('wind');
  await page.waitForTimeout(200);
  await screenshot('thumb.png');
};
