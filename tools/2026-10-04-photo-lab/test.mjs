/* 摄影工作台 · 集成测试
 *
 * 数值真值全部来自 oracle/truth.json（run 目录 oracle/scenarios.py 调 oracle.py：Python 独立实现，
 * 景深用像距构造弥散直径再 brentq 求根、拖尾用 scipy Rotation 旋转 + 针孔投影），由 inject-oracle.mjs
 * 机械注入下面的 ORACLE 块 —— 本文件不手打任何计算结果。渲染守卫一律 import（render-guards.mjs）。
 */
import { renderGuards } from '/Users/lon/.agents/cron/daily-website/tools/render-guards.mjs';
import { makeDisplayCompare, parseNum, tolFromText } from '/Users/lon/.agents/cron/daily-website/tools/display-tolerance.mjs';

const ORACLE = {
 "meta": {
  "tabs": [
   "exp",
   "dof",
   "fov",
   "astro",
   "kit",
   "about"
  ],
  "source": "oracle/scenarios.py（Python 独立实现）"
 },
 "ex1": {
  "t_exact": "1/512",
  "label": "1/500",
  "ev_combo": 14.965784284662087,
  "lux": 81920,
  "bright": 0.0342157153379133,
  "eq": [
   [
    1.4,
    "1/16718",
    "—"
   ],
   [
    2,
    "1/8192",
    "1/8000"
   ],
   [
    2.8,
    "1/4180",
    "1/4000"
   ],
   [
    4,
    "1/2048",
    "1/2000"
   ],
   [
    5.6,
    "1/1045",
    "1/1000"
   ],
   [
    8,
    "1/512",
    "1/500"
   ],
   [
    11,
    "1/271",
    "1/250"
   ],
   [
    16,
    "1/128",
    "1/125"
   ],
   [
    22,
    "1/68",
    "1/60"
   ]
  ]
 },
 "ex2": {
  "ev": 10.965784284662087,
  "evE": 9.965784284662087,
  "n_exact": 5.656854249492381,
  "label": "f/5.6",
  "ev_combo": 9.936637939002571
 },
 "ex3": {
  "s_exact": 183.75,
  "label": "ISO 200"
 },
 "ex4": {
  "t": 62.71999999999999,
  "fmt": "1 分 03 秒"
 },
 "nd": {
  "a_st": 9.965784284662087,
  "a_t": "8″",
  "b_st": 5.979470570797252,
  "b_t": "0.5″",
  "c_t": "2.1″"
 },
 "fl": {
  "eff": 86,
  "dist": 10.75,
  "label": "f/22"
 },
 "dof1": {
  "near": 2738.9707935633296,
  "far": 3316.0234379124345,
  "H": 31004.252021497574,
  "c": 0.028844410203711916,
  "m": 0.01694915254237288,
  "bb": 0.3026634382566584,
  "bbx": 10.492966786948184,
  "airy": 0.00382128813559322,
  "total": 577.0526443491049,
  "pitch": 0.006
 },
 "dof1bg": {
  "near": 2738.9707935633296,
  "far": 3316.0234379124345,
  "H": 31004.252021497574,
  "c": 0.028844410203711916,
  "m": 0.01694915254237288,
  "bb": 0.2118644067796599,
  "bbx": 7.345076750863694,
  "airy": 0.00382128813559322,
  "total": 577.0526443491049,
  "pitch": 0.006
 },
 "dof2": {
  "near": 1116.3088850577901,
  "far": 9597.79542640339,
  "H": 2520.1508830135203,
  "c": 0.028844410203711916,
  "m": 0.012145748987854251,
  "bb": 0.036437246963562764,
  "bbx": 1.2632342525372124,
  "airy": 0.010866396761133604,
  "total": 8481.486541345601,
  "pitch": 0.006
 },
 "dof3": {
  "near": 1136.6546975037106,
  "far": null,
  "H": 1839.3824603734681,
  "c": 0.028844410203711916,
  "m": 0.008064516129032258,
  "bb": 0.017595307917888707,
  "bbx": 0.610007547168512,
  "airy": 0.014881048387096776,
  "total": null,
  "pitch": 0.006
 },
 "dof4": {
  "near": 1489.7840966137526,
  "far": 1510.356977900386,
  "H": 206434.29844250728,
  "c": 0.025009604222871604,
  "m": 0.060070671378091876,
  "bb": 3.6471479050984357,
  "bbx": 145.82989289223025,
  "airy": 0.001991660777385159,
  "total": 20.572881286633447,
  "pitch": 0.006
 },
 "dof5": {
  "near": 1495.0808219654305,
  "far": 1504.9516554676486,
  "H": 430144.5238095297,
  "c": 0.012,
  "m": 0.060070671378091876,
  "bb": 3.6471479050984357,
  "bbx": 303.9289920915363,
  "airy": 0.001991660777385159,
  "total": 9.870833502218147,
  "pitch": 0.006
 },
 "dof6": {
  "near": 1491.8192555150854,
  "far": 1508.2709613131094,
  "H": 258120.71428569278,
  "c": 0.02,
  "m": 0.060070671378091876,
  "bb": 3.6471479050984357,
  "bbx": 182.35739525492178,
  "airy": 0.001991660777385159,
  "total": 16.451705798024022,
  "pitch": 0.006
 },
 "dof7": {
  "near": 2824.5139417889895,
  "far": 3198.7363658558297,
  "H": 47531.356714150264,
  "c": 0.018804373013861547,
  "m": 0.01694915254237288,
  "bb": 0.3026634382566584,
  "bbx": 16.09537515733982,
  "airy": 0.00382128813559322,
  "total": 374.2224240668402,
  "pitch": 0.0037549966711037173
 },
 "hyp1": [
  [
   1.4,
   61958.50404299637
  ],
  [
   2,
   43385.952830095295
  ],
  [
   2.8,
   31004.252021497574
  ],
  [
   4,
   21717.976415048186
  ],
  [
   5.6,
   15527.126010748927
  ],
  [
   8,
   10883.988207523964
  ],
  [
   11,
   7929.264150926442
  ],
  [
   16,
   5466.9941037619965
  ],
  [
   22,
   3989.6320754632766
  ]
 ],
 "fov1": {
  "h": 54.432223114614956,
  "v": 37.84928883210247,
  "d": 63.43996659541458,
  "fw": 5106.857142857143,
  "fh": 3404.5714285714284
 },
 "fov2": {
  "eq": 53.68721181959799,
  "eqn": 4.294976945567838,
  "h": 37.11527534152218,
  "cr": 1.5339203377027997
 },
 "fov_list": [
  [
   14,
   104.2500326978036
  ],
  [
   24,
   73.73979529168804
  ],
  [
   35,
   54.432223114614956
  ],
  [
   50,
   39.597752709049864
  ],
  [
   85,
   23.913168486298265
  ],
  [
   135,
   15.18928673718289
  ],
  [
   200,
   10.285529115768483
  ]
 ],
 "as1": {
  "p": 6,
  "npf": 13.9,
  "r5": 25,
  "phys": 8.22806356468792,
  "tr": 4.86141401868402,
  "tr5": 6.076769946847327
 },
 "as2": {
  "npf": 15.89262154343915,
  "phys": 4.703795402464361,
  "tr": 4.25188770818595
 },
 "tr": {
  "arc": 15.041068645644208,
  "n": 172
 },
 "kit": {
  "p61": 3.76350028912308,
  "c_m43": 0.014426672828094804
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const O = ORACLE;
  const T = O.meta.tabs;
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(toolURL);
  await page.evaluate(() => localStorage.clear());
  await page.goto(toolURL + '#exp');
  const { closeS, closeV } = makeDisplayCompare(page, assert);
  const txt = (sel) => page.$eval(sel, (n) => n.textContent.trim());
  const onTab = async (t) => {
    await page.click(`#pl-tab-${t}`);
    await page.waitForFunction((t) => !document.getElementById(`pl-pane-${t}`).hidden, t);
  };
  const waitTxt = (sel, pred) => page.waitForFunction(([s, src]) => {
    const n = document.querySelector(s); return n && new Function('t', 'return ' + src)(n.textContent.trim());
  }, [sel, pred], { timeout: 10000 }).catch(() => null);
  const eqTxt = async (sel, want, msg) => {
    await waitTxt(sel, `t === ${JSON.stringify(want)}`);
    const got = await txt(sel); assert(got === want, `${msg}：期望「${want}」，实得「${got}」`);
  };
  /* 距离读数：页面写「2.74 m」或「57.7 cm」，换成毫米再按显示精度比 */
  const distMm = async (sel, wantMm, what) => {
    const s = await txt(sel);
    const isCm = / cm/.test(s), scale = isCm ? 10 : 1000;
    const got = parseNum(s) * scale, tol = tolFromText(s) * scale * 1.01 + 1e-9;
    assert(Math.abs(got - wantMm) <= tol, `${what}：页面「${s}」，真值 ${wantMm} mm`);
  };
  const disp = (sel) => page.$eval(sel, (n) => getComputedStyle(n).display);

  // ═════════ 曝光 ═════════
  // 1. 默认：晴天 EV15，f/8 ISO100 求快门
  await eqTxt('#pl-ex-res', O.ex1.label, '晴天 f/8 ISO100 的建议快门');
  assert((await txt('#pl-ex-exact')).includes(O.ex1.t_exact), '精确快门应显示 ' + O.ex1.t_exact);
  assert((await txt('#pl-ex-exact')).includes((O.ex1.bright > 0 ? '亮 ' : '暗 ') + Math.abs(O.ex1.bright).toFixed(2)), '名义档偏差描述：' + await txt('#pl-ex-exact'));
  await closeS('#pl-ex-ev100', O.ex1.ev_combo, '组合的 EV100');
  await closeS('#pl-ex-luxo', O.ex1.lux, '对应照度');
  assert(await disp('#pl-ex-t-w') === 'none', '求快门时快门输入应隐藏（计算样式）');
  const eqRows = await page.$$eval('#pl-ex-eq tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent.trim())));
  assert(eqRows.length === O.ex1.eq.length, `等效曝光表应有 ${O.ex1.eq.length} 行，实得 ${eqRows.length}`);
  O.ex1.eq.forEach(([n, ex, nom], i) => {
    assert(eqRows[i][0] === 'f/' + n && eqRows[i][1] === ex && eqRows[i][2] === nom, `等效曝光 f/${n}：期望 ${ex}/${nom}，实得 ${eqRows[i].join('|')}`);
  });
  assert(await page.$eval('#pl-ex-eq tr.pl-cur td', (n) => n.textContent) === 'f/8', '当前光圈行应高亮 f/8');

  // 2. 照度 5000 lx、补偿 +1，1/125 ISO400 求光圈
  await page.click('#pl-ex-src button[data-v="lux"]');
  assert(await disp('#pl-ex-scene-w') === 'none' && await disp('#pl-ex-lux-w') !== 'none', '切到照度后场景下拉应隐藏、照度输入应显示');
  await page.fill('#pl-ex-lux', '5000');
  await page.$eval('#pl-ex-comp', (n) => { n.value = '1'; n.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.click('#pl-ex-solve button[data-v="n"]');
  await page.selectOption('#pl-ex-t', '1/125'); await page.selectOption('#pl-ex-s', '400');
  await eqTxt('#pl-ex-res', O.ex2.label, '5000lx +1 档 1/125 ISO400 的光圈');
  const tgt = await txt('#pl-ex-target');
  closeV(tgt.split('=')[1], O.ex2.ev, '照度换算的 EV100');
  closeV(tgt.split('按')[1], O.ex2.evE, '补偿后的 EV');
  closeV((await txt('#pl-ex-exact')).replace('精确值 f/', ''), O.ex2.n_exact, '精确光圈');
  await closeS('#pl-ex-ev100', O.ex2.ev_combo, '求光圈组合的 EV100');
  assert(await disp('#pl-ex-n-w') === 'none' && await disp('#pl-ex-t-w') !== 'none', '求光圈时光圈输入隐藏、快门输入显示');

  // 3. 手动 EV 8，f/2.8 1/60 求 ISO
  await page.$eval('#pl-ex-comp', (n) => { n.value = '0'; n.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.click('#pl-ex-src button[data-v="ev"]'); await page.fill('#pl-ex-ev', '8');
  await page.click('#pl-ex-solve button[data-v="s"]');
  await page.selectOption('#pl-ex-n', '2.8'); await page.selectOption('#pl-ex-t', '1/60');
  await eqTxt('#pl-ex-res', O.ex3.label, 'EV8 f/2.8 1/60 的 ISO');
  closeV((await txt('#pl-ex-exact')).replace('精确值 ISO ', ''), O.ex3.s_exact, '精确 ISO');
  // 非法 EV
  await page.fill('#pl-ex-ev', 'abc');
  await eqTxt('#pl-ex-res', '—', '非法 EV 时结果清空');
  assert((await txt('#pl-ex-msg')).length > 0 && await page.$eval('#pl-ex-ev', (n) => n.getAttribute('aria-invalid')) === 'true', '非法 EV 应报错并标红');

  // 4. 满月 EV −3 求快门 → 超 30″ 走 B 门
  await page.fill('#pl-ex-ev', '−3');
  await page.click('#pl-ex-solve button[data-v="t"]'); await page.selectOption('#pl-ex-n', '2.8'); await page.selectOption('#pl-ex-s', '100');
  await eqTxt('#pl-ex-res', O.ex4.fmt, 'EV−3 f/2.8 ISO100 的 B 门时间（全角负号输入）');
  assert(await disp('#pl-ex-warn') !== 'none' && (await txt('#pl-ex-warn')).includes('B 门'), '超 30″ 应提示 B 门');

  // ND
  await page.fill('#pl-nd-base', '1/125'); await page.selectOption('#pl-nd-type', 'f:1000');
  await eqTxt('#pl-nd-t', O.nd.a_t, 'ND1000 后快门');
  await closeS('#pl-nd-stops', O.nd.a_st, 'ND1000 档数');
  assert(await disp('#pl-nd-cu-w') === 'none', '预设 ND 时自定义框隐藏');
  await page.selectOption('#pl-nd-type', 'od'); await page.fill('#pl-nd-cu', '1.8');
  await eqTxt('#pl-nd-t', O.nd.b_t, 'OD1.8 后快门'); await closeS('#pl-nd-stops', O.nd.b_st, 'OD1.8 档数');
  await page.selectOption('#pl-nd-type', 'st'); await page.fill('#pl-nd-cu', '6'); await page.fill('#pl-nd-base', '1/30');
  await eqTxt('#pl-nd-t', O.nd.c_t, '1/30 加 6 档');
  await page.fill('#pl-nd-base', '1//30');
  await eqTxt('#pl-nd-t', '—', '非法原快门');
  assert((await txt('#pl-nd-msg')).includes('格式'), '非法原快门应报错');
  await page.click('#pl-nd-follow');
  assert(await page.$eval('#pl-nd-base', (n) => n.value) === O.ex4.fmt, '「用上方建议快门」应填入 ' + O.ex4.fmt);

  // 闪光
  await page.fill('#pl-fl-gn', '43'); await page.selectOption('#pl-fl-pw', '0.5'); await page.selectOption('#pl-fl-iso', '800');
  await page.selectOption('#pl-fl-n', '8'); await page.fill('#pl-fl-d', '4');
  await waitTxt('#pl-fl-eff', `t !== '—' && Math.abs(parseFloat(t) - ${O.fl.eff}) < 0.06`);
  await closeS('#pl-fl-eff', O.fl.eff, '有效 GN'); await closeS('#pl-fl-dist', O.fl.dist, '闪光最远距离');
  await eqTxt('#pl-fl-nd', O.fl.label, '4 m 用光圈');
  await page.fill('#pl-fl-gn', '0');
  await eqTxt('#pl-fl-eff', '—', 'GN=0 非法');

  // ═════════ 景深 ═════════
  await onTab('dof');
  await page.fill('#pl-df-f', '50'); await page.selectOption('#pl-df-n', '2.8'); await page.fill('#pl-df-s', '3'); await page.fill('#pl-df-bg', '');
  await waitTxt('#pl-df-near', `t !== '—'`);
  const D1 = O.dof1;
  await distMm('#pl-df-near', D1.near, '50mm f/2.8 3m 近点'); await distMm('#pl-df-far', D1.far, '远点');
  await distMm('#pl-df-total', D1.total, '总景深'); await distMm('#pl-df-h', D1.H, '超焦距');
  await closeS('#pl-df-c', D1.c * 1000, '弥散圆 µm');
  closeV((await txt('#pl-df-m')).split(':')[1], 1 / D1.m, '放大倍率 1:x');
  await closeS('#pl-df-bb', D1.bb * 1000, '无穷远背景虚化圆 µm');
  closeV((await txt('#pl-df-bb small')), D1.bbx, '虚化圆是弥散圆的几倍');
  await closeS('#pl-df-airy', D1.airy * 1000, '艾里斑 µm');
  // 前后比
  const fb = await txt('#pl-df-fb');
  const fr = Math.round((3000 - D1.near) / D1.total * 100);
  assert(fb.startsWith(fr + '%'), `前景深占比应为 ${fr}%，实得 ${fb}`);
  // 超焦距表
  const hyp = await page.$$eval('#pl-df-hyp tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent.trim())));
  assert(hyp.length === O.hyp1.length, '超焦距表 9 行');
  for (let i = 0; i < O.hyp1.length; i++) {
    const s = hyp[i][1], sc = / cm/.test(s) ? 10 : 1000;
    assert(Math.abs(parseNum(s) * sc - O.hyp1[i][1]) <= tolFromText(s) * sc * 1.01, `f/${O.hyp1[i][0]} 超焦距 ${s} vs ${O.hyp1[i][1]}`);
  }
  // 几何：景深色带的像素宽度 = 图上 near→far 的对数距离
  const geo = await page.evaluate(() => {
    const b = document.querySelector('#pl-df-fig .pl-df-band').getBoundingClientRect();
    const svg = document.getElementById('pl-df-fig'); const sc = svg.getBoundingClientRect().width / 860;
    const ticks = [...svg.querySelectorAll('text')].map((t) => ({ s: t.textContent, x: t.getBoundingClientRect().left + t.getBoundingClientRect().width / 2 }));
    return { w: b.width / sc, ticks, n: ticks.filter((t) => /^[\d.]+ c?m$/.test(t.s)).length };
  });
  assert(geo.w > 20, `景深色带应可见（宽 ${geo.w}）`);
  assert(geo.n >= 4, `x 轴距离刻度应 ≥4 根，实得 ${geo.n}`);
  const curveOk = await page.evaluate(() => { const p = document.querySelector('#pl-df-fig .pl-df-curve'); return p && p.getTotalLength() > 200; });
  assert(curveOk, '弥散曲线应画出来');
  // 背景 10 m
  await page.fill('#pl-df-bg', '10');
  await waitTxt('#pl-df-bb', `t.includes('10 m')`);
  await closeS('#pl-df-bb', O.dof1bg.bb * 1000, '10 m 背景虚化圆');
  // 24mm f/8 2m：远点有限
  await page.fill('#pl-df-bg', ''); await page.fill('#pl-df-f', '24'); await page.selectOption('#pl-df-n', '8'); await page.fill('#pl-df-s', '2');
  await waitTxt('#pl-df-sum', `t.startsWith('24mm f/8')`);
  await distMm('#pl-df-far', O.dof2.far, '24mm f/8 2m 远点'); await distMm('#pl-df-near', O.dof2.near, '24mm f/8 2m 近点');
  // 24mm f/11 3m：超过超焦距 → ∞
  await page.selectOption('#pl-df-n', '11'); await page.fill('#pl-df-s', '3');
  await eqTxt('#pl-df-far', '∞', '超过超焦距时远点 ∞'); await eqTxt('#pl-df-total', '∞', '总景深 ∞');
  await distMm('#pl-df-near', O.dof3.near, '24mm f/11 3m 近点');
  // 弥散圆口径
  await page.fill('#pl-df-f', '85'); await page.selectOption('#pl-df-n', '1.4'); await page.fill('#pl-df-s', '1.5');
  await page.selectOption('#pl-df-coc', 'zeiss');
  await waitTxt('#pl-df-sum', `t.startsWith('85mm f/1.4')`);
  await closeS('#pl-df-c', O.dof4.c * 1000, '蔡司口径弥散圆'); await distMm('#pl-df-total', O.dof4.total, '蔡司口径总景深');
  await page.selectOption('#pl-df-coc', 'pixel');
  await waitTxt('#pl-df-c', `t.startsWith('12')`);
  await closeS('#pl-df-c', O.dof5.c * 1000, '像素口径弥散圆'); await distMm('#pl-df-total', O.dof5.total, '像素口径总景深');
  await page.selectOption('#pl-df-coc', 'custom');
  assert(await disp('#pl-df-cu-w') !== 'none', '自定义口径时显示输入框');
  await page.fill('#pl-df-cu', '20');
  await waitTxt('#pl-df-c', `t === '20.0 µm'`);
  await distMm('#pl-df-near', O.dof6.near, '自定义 20µm 近点');
  // 非法：对焦距离 ≤ 焦距
  await page.fill('#pl-df-s', '0.05');
  await eqTxt('#pl-df-near', '—', '对焦距离小于焦距应无结果');
  assert((await txt('#pl-df-msg')).includes('大于焦距'), '应提示对焦距离必须大于焦距');
  await page.fill('#pl-df-s', '1.5'); await page.selectOption('#pl-df-coc', 'std');

  // 切换机身（APS-C）：弥散圆与景深跟着变
  await page.selectOption('#pl-body', 'b2');
  await page.fill('#pl-df-f', '50'); await page.selectOption('#pl-df-n', '2.8'); await page.fill('#pl-df-s', '3');
  await waitTxt('#pl-df-sum', `t.includes('APS-C')`);
  await closeS('#pl-df-c', O.dof7.c * 1000, 'APS-C 弥散圆'); await distMm('#pl-df-total', O.dof7.total, 'APS-C 总景深');
  // 镜头快捷按钮
  await page.click('#pl-df-lens button[data-f="85"]');
  assert(await page.$eval('#pl-df-f', (n) => n.value) === '85' && await page.$eval('#pl-df-n', (n) => n.value) === '1.4', '点 85mm f/1.4 应填入焦距与光圈');
  const chips = await page.$$eval('#pl-df-lens button', (bs) => bs.map((b) => b.textContent));
  assert(new Set(chips).size === chips.length, '镜头按钮不应重复：' + chips.join(','));
  await page.selectOption('#pl-body', 'b1');

  // ═════════ 视角 ═════════
  await onTab('fov');
  await page.fill('#pl-fv-f', '35'); await page.fill('#pl-fv-s', '5'); await page.fill('#pl-fv-list', '14, 24, 35, 50, 85, 135, 200');
  await waitTxt('#pl-fv-sum', `t.startsWith('35mm 装在全画幅')`);
  await closeS('#pl-fv-h', O.fov1.h, '水平视角'); await closeS('#pl-fv-v', O.fov1.v, '垂直视角'); await closeS('#pl-fv-d', O.fov1.d, '对角视角');
  const fld = (await txt('#pl-fv-field')).split('×');
  closeV(fld[0], O.fov1.fw / 1000, '5 m 处画面宽'); closeV(fld[1], O.fov1.fh / 1000, '5 m 处画面高');
  const frames = await page.$$eval('#pl-fv-fig .pl-fv-frame', (rs) => rs.map((r) => ({ f: +r.dataset.f, w: r.getBoundingClientRect().width })));
  assert(frames.length === 7, '应画 7 个取景框');
  frames.forEach((fr) => assert(Math.abs(fr.w / frames[0].w - 14 / fr.f) < 0.01, `取景框 ${fr.f}mm 宽度比例应为 14/${fr.f}，实得 ${fr.w / frames[0].w}`));
  const lbls = await page.$$eval('#pl-fv-fig .pl-fv-lbl', (ts) => ts.map((t) => t.textContent));
  assert(lbls.length === 7, `取景框标签应画出 7 个，实得 ${lbls.length}：${lbls.join(' / ')}`);
  O.fov_list.forEach(([g, a], i) => closeV(lbls[i].split('·')[1], a, `${g}mm 标签视角`));
  await page.fill('#pl-fv-list', '24, 50, x9');
  await waitTxt('#pl-fv-msg', `t.includes('x9')`);
  assert(await page.$$eval('#pl-fv-tbl tbody tr', (r) => r.length) === 2, '非法项被剔除后表格 2 行');
  await page.fill('#pl-fv-list', '14, 24, 35, 50, 85, 135, 200');
  await page.selectOption('#pl-body', 'b2');
  await waitTxt('#pl-fv-sum', `t.includes('APS-C')`);
  await closeS('#pl-fv-eq', O.fov2.eq, 'APS-C 等效焦距'); await closeS('#pl-fv-eqn', O.fov2.eqn, 'APS-C 等效光圈');
  await closeS('#pl-fv-h', O.fov2.h, 'APS-C 水平视角');
  await page.selectOption('#pl-body', 'b1');

  // ═════════ 星空 ═════════
  await onTab('astro');
  await page.fill('#pl-as-f', '20'); await page.selectOption('#pl-as-n', '2.8'); await page.fill('#pl-as-dec', '0'); await page.fill('#pl-as-k', '2'); await page.fill('#pl-as-t', '20');
  await waitTxt('#pl-as-sum', `t.startsWith('20mm f/2.8')`);
  await closeS('#pl-as-npf', O.as1.npf, 'NPF'); await closeS('#pl-as-500', O.as1.r5, '500 法则');
  await closeS('#pl-as-phys', O.as1.phys, '按像素拖尾最长曝光'); await closeS('#pl-as-trail', O.as1.tr, '20 秒拖尾像素');
  closeV((await txt('#pl-as-note')).split('拖出约')[1], O.as1.tr5, '500 法则下的拖尾');
  const mk = await page.$$eval('#pl-as-fig .pl-as-mk', (ts) => ts.map((t) => t.textContent));
  assert(mk.length === 3, `三条法则标注都应画出，实得 ${mk.join(' / ')}`);
  await page.fill('#pl-as-dec', '-29'); await page.fill('#pl-as-k', '1');
  await waitTxt('#pl-as-sum', `t.endsWith('-29°')`);
  await closeS('#pl-as-npf', O.as2.npf, '赤纬 −29° NPF'); await closeS('#pl-as-phys', O.as2.phys, '赤纬 −29° 1 像素');
  await closeS('#pl-as-trail', O.as2.tr, '赤纬 −29° 20 秒拖尾');
  await closeS('#pl-tr-arc', O.tr.arc, '60 分钟星轨弧长');
  await eqTxt('#pl-tr-n', O.tr.n + ' 张', '星轨张数');
  await page.fill('#pl-as-dec', '90');
  await eqTxt('#pl-as-npf', '—', '赤纬 90° 非法');
  await page.fill('#pl-as-dec', '0'); await page.fill('#pl-as-k', '2');

  // ═════════ 器材库 ═════════
  await onTab('kit');
  await page.click('#pl-kb-add');
  assert((await txt('#pl-kb-msg')).includes('名称'), '空名称添加机身应报错');
  await page.fill('#pl-kb-name', '高像素 61MP'); await page.selectOption('#pl-kb-sensor', 'ff'); await page.fill('#pl-kb-mp', '61');
  await page.click('#pl-kb-add');
  await waitTxt('#pl-body-line', `t.includes('高像素 61MP')`);
  closeV((await txt('#pl-body-line')).split('像素间距')[1], O.kit.p61, '61MP 像素间距');
  assert(await page.$eval('#pl-body', (n) => n.selectedOptions[0].textContent) === '高像素 61MP', '新机身应设为当前');
  await page.selectOption('#pl-kb-sensor', 'custom');
  assert(await disp('#pl-kb-w-w') !== 'none', '自定义画幅显示宽高输入');
  await page.fill('#pl-kl-name', '反向'); await page.fill('#pl-kl-fmin', '70'); await page.fill('#pl-kl-fmax', '24'); await page.fill('#pl-kl-n', '4');
  await page.click('#pl-kl-add');
  assert((await txt('#pl-kl-msg')).includes('不能小于'), '最长焦距小于最短应报错');
  await page.fill('#pl-kl-name', '16-35 f/4'); await page.fill('#pl-kl-fmin', '16'); await page.fill('#pl-kl-fmax', '35');
  await page.click('#pl-kl-add');
  await waitTxt('#pl-kl-list', `t.includes('16-35 f/4')`);
  // 持久化：刷新后器材与当前机身都在
  await page.reload();
  await page.waitForFunction(() => document.getElementById('pl-body-line').textContent.includes('高像素 61MP'));
  await onTab('dof');
  assert(await page.$$eval('#pl-df-lens button[data-f="16"]', (b) => b.length) === 1, '新镜头应出现在景深页快捷按钮里（刷新后）');
  await onTab('kit');
  await page.click('#pl-kb-list li.pl-cur button[data-act="del"]');
  await waitTxt('#pl-body-line', `!t.includes('高像素')`);
  await page.click('#pl-kit-reset');
  await waitTxt('#pl-kl-list', `!t.includes('16-35')`);

  // ═════════ 渲染守卫（逐页签 × 逐视口） ═════════
  const n = await renderGuards(page, {
    assert, tabs: T, onTab,
    paneSel: (t) => `#pl-pane-${t}`, panesRoot: '#pl-panes',
    figSel: (t) => `#pl-pane-${t} svg.pl-fig`, cardSel: '.pl-card, .pl-tile',
    minControls: 50, minTextsInFig: 8,
  });
  assert(n >= 50, `应扫到 ≥50 个控件，实得 ${n}`);
  assert(errs.length === 0, '页面不应有未捕获错误：' + errs.join(' | '));

  // ── 截图 ──
  await onTab('dof');
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await screenshot('thumb.png');
};
