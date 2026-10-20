// 魔方工作台 · Cube Lab 集成测试
// 真值全部来自 run 目录 oracle/ui_truth.py：状态由 magiccube / pycuber（与本页引擎不共享代码）模拟，
// 解法在 Kociemba 的 twophase 块模型上核对过，合法性由 kociemba + magiccube 贴纸级执行判定，统计展示串由 Python Fraction 独立实现算出；
// 经 tools/inject-oracle.mjs 机械注入 ORACLE，本文件不手打任何魔方状态或成绩。
import { renderGuards } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs';

const ORACLE = {
 "initAlg": "D2 F2 U' B2 R2 B2 R2 L B' D' F D2 F B2 U F' L R U2 F' L'",
 "initState": "LBBLURBFFUUUFRBDDDLURBFRRDFBLLLDFLRRUFDULDUBDRUFRBLFDB",
 "initSolution": "U' B L U R U F L B2 U L2 B' R2 D F2 D' R2 L2 U2",
 "initSolutionLen": 19,
 "play5": "UURLURBFFDFFDRRLRRLULBFFLDUULBBDDRUBRFDBLUDDFDRFBBLULB",
 "ruru": "UULUUFUUFRRUBRRURRFFDFFUFFFDDRDDDDDDBLLLLLLLLBRRBBBBBB",
 "U": "UUUUUUUUUBBBRRRRRRRRRFFFFFFDDDDDDDDDFFFLLLLLLLLLBBBBBB",
 "R": "UUFUUFUUFRRRRRRRRRFFDFFDFFDDDBDDBDDBLLLLLLLLLUBBUBBUBB",
 "Rp": "UUBUUBUUBRRRRRRRRRFFUFFUFFUDDFDDFDDFLLLLLLLLLDBBDBBDBB",
 "RU": "UUUUUUFFFUBBRRRRRRRRRFFDFFDDDBDDBDDBFFDLLLLLLLLLUBBUBB",
 "M": "UBUUBUUBURRRRRRRRRFUFFUFFUFDFDDFDDFDLLLLLLLLLBDBBDBBDB",
 "solved": "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB",
 "comm3": "BUBUUUUUDFRLRRRFRRFFRFFFFFRDDUDDDDDDRLLLLLLLLUBUBBBBBB",
 "conj": "UUUUUUFFLBRRBRRURRRRUFFUFFFDDRDDDDDDFFDLLLLLLBLLBBBBBB",
 "wide": "FUUFUUFDFLRRLRRLRRUFUFFUFFUDUBDDDDDDRRRLLLLLLBBDBBBBBB",
 "z2": "DDDDDDDDDLLLLLLLLLFFFFFFFFFUUUUUUUUURRRRRRRRRBBBBBBBBB",
 "seed2026": "RLDFULDUUBBLURBUFDFRRDFFFFBUDLBDRLLFBLRDLRFURBUDRBBLDU",
 "mirror": {
  "fs": "UUUUUUDUURRRRRRRRRFFFFFFFFFUDDDDDDDDLLLLLLLLLBBBBBBBBB",
  "kociembaAccepts": true,
  "kociembaSolutionSolves": false
 },
 "twist": {
  "fs": "UUUUUUUUFURRRRRRRRFFRFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB",
  "kociembaRejects": true
 },
 "cases": {
  "OLL 1": {
   "kind": "oll",
   "U": "BLFBUFRRR",
   "B": "LUL",
   "R": "UUU",
   "F": "FUB",
   "L": "UUU",
   "n": 12,
   "auf": ""
  },
  "OLL 21": {
   "kind": "oll",
   "U": "BUBUUUFUF",
   "B": "LRR",
   "R": "ULU",
   "F": "LFR",
   "L": "UBU",
   "n": 11,
   "auf": ""
  },
  "OLL 27": {
   "kind": "oll",
   "U": "RUFUUUUUL",
   "B": "ULL",
   "R": "UBB",
   "F": "BFU",
   "L": "FRR",
   "n": 7,
   "auf": ""
  },
  "OLL 45": {
   "kind": "oll",
   "U": "RFUUUURRU",
   "B": "BUL",
   "R": "BBF",
   "F": "FUL",
   "L": "ULU",
   "n": 6,
   "auf": ""
  },
  "Ua": {
   "kind": "pll",
   "U": "UUUUUUUUU",
   "B": "BBB",
   "R": "RLR",
   "F": "FRF",
   "L": "LFL",
   "n": 7,
   "auf": ""
  },
  "H": {
   "kind": "pll",
   "U": "UUUUUUUUU",
   "B": "BFB",
   "R": "RLR",
   "F": "FBF",
   "L": "LRL",
   "n": 7,
   "auf": ""
  },
  "Z": {
   "kind": "pll",
   "U": "UUUUUUUUU",
   "B": "BLB",
   "R": "RFR",
   "F": "FRF",
   "L": "LBL",
   "n": 10,
   "auf": "U2"
  },
  "Aa": {
   "kind": "pll",
   "U": "UUUUUUUUU",
   "B": "RBR",
   "R": "FRL",
   "F": "FFB",
   "L": "BLL",
   "n": 11,
   "auf": ""
  },
  "E": {
   "kind": "pll",
   "U": "UUUUUUUUU",
   "B": "LBR",
   "R": "FRB",
   "F": "LFR",
   "L": "FLB",
   "n": 18,
   "auf": ""
  },
  "T": {
   "kind": "pll",
   "U": "UUUUUUUUU",
   "B": "BBR",
   "R": "FLB",
   "F": "FFR",
   "L": "LRL",
   "n": 14,
   "auf": ""
  },
  "Na": {
   "kind": "pll",
   "U": "UUUUUUUUU",
   "B": "BBF",
   "R": "LLR",
   "F": "BFF",
   "L": "LRR",
   "n": 21,
   "auf": ""
  }
 },
 "counts": {
  "oll": 57,
  "pll": 21
 },
 "timer": {
  "solves": [
   {
    "t": 12345,
    "p": 0,
    "s": "R U",
    "d": 1760000000000
   },
   {
    "t": 10870,
    "p": 0,
    "s": "R U",
    "d": 1760000060000
   },
   {
    "t": 15999,
    "p": 2000,
    "s": "R U",
    "d": 1760000120000
   },
   {
    "t": 11002,
    "p": 0,
    "s": "R U",
    "d": 1760000180000
   },
   {
    "t": 9876,
    "p": 0,
    "s": "R U",
    "d": 1760000240000
   },
   {
    "t": 13050,
    "p": -1,
    "s": "R U",
    "d": 1760000300000
   },
   {
    "t": 10001,
    "p": 0,
    "s": "R U",
    "d": 1760000360000
   },
   {
    "t": 14321,
    "p": 0,
    "s": "R U",
    "d": 1760000420000
   },
   {
    "t": 9999,
    "p": 0,
    "s": "R U",
    "d": 1760000480000
   },
   {
    "t": 12500,
    "p": 0,
    "s": "R U",
    "d": 1760000540000
   },
   {
    "t": 11111,
    "p": 0,
    "s": "R U",
    "d": 1760000600000
   },
   {
    "t": 10700,
    "p": 0,
    "s": "R U",
    "d": 1760000660000
   },
   {
    "t": 13579,
    "p": 0,
    "s": "R U",
    "d": 1760000720000
   },
   {
    "t": 8888,
    "p": 0,
    "s": "R U",
    "d": 1760000780000
   }
  ],
  "expect": {
   "single-cur": "8.88",
   "single-best": "8.88",
   "mo3-cur": "11.05",
   "mo3-best": "11.05",
   "ao5-cur": "11.44",
   "ao5-best": "11.20",
   "ao12-cur": "12.11",
   "ao12-best": "12.08",
   "ao50-cur": "—",
   "ao50-best": "—",
   "ao100-cur": "—",
   "ao100-best": "—",
   "n": "14",
   "mean": "11.78",
   "dnf": "1"
  },
  "listFirst": "8.88",
  "pen3": "17.99+",
  "dnf6": "DNF(13.05)"
 },
 "count": "43,252,003,274,489,856,000"
};

// 贴纸颜色（页面 CSS 变量的值）：断言 3D 贴纸的**计算样式**而不是 data 属性
const RGB = { U: 'rgb(255, 255, 255)', R: 'rgb(212, 32, 44)', F: 'rgb(4, 160, 90)', D: 'rgb(255, 212, 0)', L: 'rgb(255, 106, 19)', B: 'rgb(19, 86, 201)' };
const TABS = ['solve', 'timer', 'algs', 'about'];

export default async ({ page, toolURL, screenshot, assert }) => {
  await page.goto(toolURL);
  await page.waitForFunction(() => document.body.getAttribute('data-cb-ready') === '1', null, { timeout: 30000 });

  const st = () => page.evaluate(() => CBAPP.state());
  // 3D 渲染键：渲染函数把本帧用到的状态写进 data-key，等它与 CBAPP.stateKey() 相同才算「画好了」
  const settled = () => page.waitForFunction(() => !CBAPP.busy() &&
    document.getElementById('cb-cube').getAttribute('data-key') === CBAPP.stateKey(), null, { timeout: 15000 });
  const waitState = async (want, msg) => {
    await page.waitForFunction((w) => CBAPP.state() === w, want, { timeout: 15000 }).catch(() => {});
    await settled();
    const got = await st();
    assert(got === want, `${msg}：状态应为 ${want}，实得 ${got}`);
  };
  const onTab = async (t) => {
    await page.click('#cb-tab-' + t);
    await page.waitForFunction((t) => !document.getElementById('pane-' + t).hidden && CBAPP.tab() === t, t);
  };
  const disp = (sel) => page.$eval(sel, (n) => getComputedStyle(n).display);

  // ── 1. 加载 ──
  const back = await page.$eval('#cb-back', (a) => [a.textContent.trim(), a.getAttribute('href')]);
  assert(back[0] === '← 返回工具集' && back[1] === '../../', `返回链接 ${back}`);
  assert(await page.evaluate(() => CBAPP.engineMode()) === 'worker', '求解表在 Web Worker 里建');
  assert((await page.textContent('#cb-status-t')).includes('就绪'), '状态条显示就绪');

  // ── 2. 初始打乱：引擎状态 = 展开图 = 3D 贴纸 = magiccube/pycuber ──
  await settled();
  assert(await st() === ORACLE.initState, '初始状态 = 示例打乱（magiccube / pycuber 一致）');
  const netStr = await page.$$eval('#cb-net rect.cb-ns', (rs) => rs.map((r) => r.getAttribute('data-c')).join(''));
  assert(netStr === ORACLE.initState, '展开图逐格 = 状态');
  // 3D：可见三面（U/F/R）的 27 张贴纸，断言计算出来的背景色
  const vis = await page.evaluate(() => {
    const out = {};
    document.querySelectorAll('.cb-stk').forEach((s) => {
      const f = +s.getAttribute('data-f');
      if (f < 27) out[f] = getComputedStyle(s).backgroundColor;
    });
    return out;
  });
  let colOK = 0;
  for (let i = 0; i < 27; i++) if (vis[i] === RGB[ORACLE.initState[i]]) colOK++;
  assert(colOK === 27, `3D 上 U/R/F 三面贴纸颜色（计算样式）27/27，实得 ${colOK}`);
  // 3D 几何：U 中心在 F 中心之上，R 中心在 F 中心之右（默认视角：前右上方俯视）
  const ctr = await page.evaluate(() => {
    const c = (f) => { const r = document.querySelector(`.cb-stk[data-f="${f}"]`).getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, r.width]; };
    return { U: c(4), R: c(13), F: c(22), stage: document.getElementById('cb-stage').getBoundingClientRect().toJSON() };
  });
  assert(ctr.U[1] < ctr.F[1] - 20, `U 中心应在 F 中心上方：${ctr.U} vs ${ctr.F}`);
  assert(ctr.R[0] > ctr.F[0] + 20, `R 中心应在 F 中心右方：${ctr.R} vs ${ctr.F}`);
  assert(ctr.F[2] > 25, `贴纸有实际尺寸 ${ctr.F[2]}`);
  for (const k of ['U', 'R', 'F']) {
    const p = ctr[k];
    assert(p[0] > ctr.stage.left && p[0] < ctr.stage.right && p[1] > ctr.stage.top && p[1] < ctr.stage.bottom, `${k} 中心落在 3D 舞台内`);
  }

  // ── 3. 记号输入 ──
  const applyAlg = async (alg) => { await page.fill('#cb-alg', alg); await page.click('#cb-alg-apply'); };
  await applyAlg("R U R' U'");
  await waitState(ORACLE.ruru, "R U R' U'");
  assert((await page.textContent('#cb-alg-err')).includes('共 4 步'), '步数提示');
  await applyAlg('[R, U]3');
  await waitState(ORACLE.comm3, '交换子 [R, U]3');
  await applyAlg('[R: U]');
  await waitState(ORACLE.conj, '共轭 [R: U]');
  await applyAlg("r U2 Rw'");
  await waitState(ORACLE.wide, "宽层 r U2 Rw'");
  await page.fill('#cb-alg', 'R U Q');
  await page.waitForFunction(() => document.getElementById('cb-alg-err').getAttribute('data-kind') === 'err');
  assert((await page.textContent('#cb-alg-err')).includes('第 5 个字符'), `非法字符定位：${await page.textContent('#cb-alg-err')}`);

  // ── 4. 转动按钮 / 键盘 / 撤销 ──
  await page.click('#cb-reset');
  await waitState(ORACLE.solved, '复原');
  await page.click('#cb-movepad button[data-mv="R"]');
  await waitState(ORACLE.R, '按钮 R');
  await page.click('#cb-movepad button[data-mv="U"]');
  await waitState(ORACLE.RU, '按钮 R 再 U');
  await page.click('#cb-undo'); await page.click('#cb-undo');
  await waitState(ORACLE.solved, '撤销两步');
  await page.focus('#cb-stage');
  await page.keyboard.press('r');
  await waitState(ORACLE.R, '键盘 r = R');
  await page.keyboard.press('Shift+R');
  await waitState(ORACLE.solved, 'Shift+R = R\'');
  await page.keyboard.press('m');
  await waitState(ORACLE.M, '键盘 m = M');
  await page.click('#cb-reset');
  await waitState(ORACLE.solved, '复原');

  // ── 4b. 转动动画中途的几何连续：假时钟把动画停在一半，转动层的贴纸必须落在起点与终点之间 ──
  // （静止画面对「动画帧里的坐标写错」完全失明：改坏验证里「转动层的 y 轴不翻」只在动画中间帧露馅）
  // F3（data-f=20，URF 角块的前面）在 R 下转到 U3（data-f=2）的位置
  const pos = (f) => page.$eval(`.cb-stk[data-f="${f}"]`, (n) => { const r = n.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const p0 = await pos(20), pEnd = await pos(2);
  await page.clock.install();
  await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 1000);
  await page.click('#cb-movepad button[data-mv="R"]');
  await page.clock.runFor(85);                     // 单步动画 160 ms，停在约一半
  const pMid = await pos(20);
  const chord = dist(p0, pEnd);
  assert(chord > 40, `起终点有间距 ${chord.toFixed(1)}`);
  assert(dist(pMid, p0) > 8 && dist(pMid, p0) < chord && dist(pMid, pEnd) < chord,
    `动画中途贴纸 ${pMid.map(Math.round)} 应在起点 ${p0.map(Math.round)} 与终点 ${pEnd.map(Math.round)} 之间（弦长 ${chord.toFixed(0)}）`);
  await page.clock.runFor(500);
  await page.clock.resume();
  await waitState(ORACLE.R, '动画走完 = R');
  await page.click('#cb-reset');
  await waitState(ORACLE.solved, '复原');

  // ── 5. 在贴纸上滑动转层：前面右列中间那张（F6）往上拖 = R ──
  const f6 = await page.$eval('.cb-stk[data-f="23"]', (n) => { const r = n.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
  await page.mouse.move(f6[0], f6[1]);
  await page.mouse.down();
  await page.mouse.move(f6[0], f6[1] - 45, { steps: 6 });
  await page.mouse.up();
  await waitState(ORACLE.R, '在 F6 上往上滑 = R');
  // 拖空白处转视角：向右拖 60px，yaw 增加 60×0.45 = 27°
  const v0 = await page.evaluate(() => CBAPP.view());
  const sb = ctr.stage;
  await page.mouse.move(sb.left + 30, sb.top + 30);
  await page.mouse.down();
  await page.mouse.move(sb.left + 90, sb.top + 30, { steps: 6 });
  await page.mouse.up();
  const v1 = await page.evaluate(() => CBAPP.view());
  assert(Math.abs(v1.yaw - v0.yaw - 27) < 0.01 && v1.pitch === v0.pitch, `拖动转视角 ${JSON.stringify(v0)} → ${JSON.stringify(v1)}`);
  await settled();
  // 视角变了，渲染键要跟着变；状态不变
  assert(await st() === ORACLE.R, '转视角不改状态');
  await page.click('#cb-view-reset');
  assert((await page.evaluate(() => CBAPP.view())).yaw === -34, '正视角复位');

  // ── 6. 求解与演示 ──
  await applyAlg(ORACLE.initAlg);
  await waitState(ORACLE.initState, '重新打乱');
  await page.click('#cb-solve-btn');
  await page.waitForFunction(() => !!CBAPP.solution(), null, { timeout: 30000 });
  const sol = await page.evaluate(() => CBAPP.solution());
  assert(sol.moves === ORACLE.initSolution, `解法（决定性，twophase 已核对能复原）：${sol.moves}`);
  assert(sol.len === ORACLE.initSolutionLen && sol.len <= 20, `解法步数 ${sol.len}`);
  assert((await page.textContent('#cb-sol-len')) === ORACLE.initSolutionLen + ' 步', '步数大字');
  assert(await page.$$eval('#cb-sol button', (b) => b.length) === ORACLE.initSolutionLen, '步骤按钮个数');
  await page.click('#cb-pb-last');
  await waitState(ORACLE.solved, '跳到结尾 = 复原');
  await page.click('#cb-pb-first');
  await waitState(ORACLE.initState, '回到开头 = 打乱态');
  await page.click('#cb-sol button[data-i="5"]');
  await waitState(ORACLE.play5, '跳到第 5 步（magiccube 模拟前 5 步）');
  assert(await page.$eval('#cb-sol button[data-i="5"]', (b) => b.getAttribute('data-cur')) === '1', '第 5 步高亮');
  await page.click('#cb-pb-next');
  await page.waitForFunction(() => CBAPP.solution().idx === 6);
  await settled();
  await page.$eval('#cb-pb-speed', (r) => { r.value = '8'; r.dispatchEvent(new Event('input')); });
  await page.click('#cb-pb-play');
  await page.waitForFunction((n) => CBAPP.solution().idx === n, ORACLE.initSolutionLen, { timeout: 30000 });
  await waitState(ORACLE.solved, '自动播放到结尾 = 复原');

  // ── 7. 涂色与诊断 ──
  await page.click('#cb-mode-paint');
  assert(await disp('#cb-in-paint') !== 'none' && await disp('#cb-in-alg') === 'none', '切到涂色面板（计算样式）');
  await page.click('#cb-paint-clear');
  await page.waitForFunction(() => document.querySelector('#cb-diag li[data-kind="blank"]'));
  assert((await page.textContent('#cb-diag')).includes('还有 48 块贴纸没涂色'), '只留中心：48 块待涂');
  assert(await page.$eval('#cb-solve-btn', (b) => b.disabled), '没涂完不能求解');
  await page.click('#cb-paint-solved');
  await waitState(ORACLE.solved, '涂成复原态');
  assert((await page.textContent('#cb-diag')).includes('已经是复原状态'), '复原态提示');
  const paint = async (color, f) => { await page.click(`#cb-palette button[data-color="${color}"]`); await page.click(`#cb-net rect[data-f="${f}"]`); };
  // 拧角：URF 三张贴纸轮换（kociemba 判错误码 5）
  await paint('F', 8); await paint('U', 9); await paint('R', 20);
  await waitState(ORACLE.twist.fs, '涂出拧角');
  assert(ORACLE.twist.kociembaRejects, 'kociemba 拒绝拧角状态');
  assert(await page.$('#cb-diag li[data-kind="twist"]'), '诊断：角块被拧');
  assert(await page.$eval('#cb-solve-btn', (b) => b.disabled), '拧角不能求解');
  // 镜像角块：kociemba 会放行（它的解在 magiccube 上复原不了），本页必须拦下
  await page.click('#cb-paint-solved');
  await paint('D', 6); await paint('U', 27);
  await waitState(ORACLE.mirror.fs, '涂出镜像角块');
  assert(ORACLE.mirror.kociembaAccepts && !ORACLE.mirror.kociembaSolutionSolves, '真值：kociemba 放行但拧不回去');
  const bad = await page.$$eval('#cb-diag li[data-kind="corner-bad"]', (l) => l.map((x) => x.textContent));
  assert(bad.length === 2 && bad[0].includes('UFL') && bad[1].includes('DLF'), `诊断出两个不存在的角块：${bad.join(' | ')}`);
  assert(await page.$eval('#cb-solve-btn', (b) => b.disabled), '镜像角块不能求解');
  const hl = await page.$$eval('#cb-net rect[data-bad="1"]', (r) => r.map((x) => x.getAttribute('data-f')).sort((a, b) => a - b).join(','));
  assert(hl === '6,18,24,27,38,44', `展开图标出问题角块的 6 张贴纸：${hl}`);
  // 颜色计数：再多涂一块红
  await page.click('#cb-paint-solved');
  await paint('R', 0);
  await page.waitForFunction(() => document.querySelectorAll('#cb-diag li[data-kind="count"]').length === 2);
  const badge = await page.$eval('#cb-palette button[data-color="U"] .cb-sw-n', (n) => [n.textContent, n.getAttribute('data-ok')]);
  assert(badge[0] === '8' && badge[1] === '0', `白色计数徽标 ${badge}`);
  // 在 3D 上点贴纸也能涂
  await page.click('#cb-paint-solved');
  await page.click('#cb-palette button[data-color="L"]');
  await page.click('.cb-stk[data-f="19"]');
  await page.waitForFunction(() => CBAPP.state()[19] === 'L');
  assert((await st())[19] === 'L', '在 3D 贴纸上点击涂色');
  await page.click('#cb-paint-solved');

  // ── 8. 随机状态（种子 2026；twophase 块往返 + kociemba 解在 magiccube 上复原过） ──
  await page.click('#cb-mode-rand');
  await page.fill('#cb-rand-seed', '2026');
  await page.click('#cb-rand-go');
  await waitState(ORACLE.seed2026, '种子 2026 的随机状态');
  await page.click('#cb-mode-alg');

  // ── 9. 计时（假时钟：手动推进时间，判罚边界可精确到毫秒） ──
  await onTab('timer');
  await page.waitForFunction(() => document.getElementById('cb-scr').getAttribute('data-ready') === '1', null, { timeout: 20000 });
  const scrText = await page.textContent('#cb-scr');
  assert(/^([URFDLB]['2]? ){14,23}[URFDLB]['2]?$/.test(scrText.trim()), `打乱是面转记号且无 2'：${scrText}`);
  assert(!/2'/.test(scrText), '打乱里不出现 2\'');
  await page.uncheck('#cb-opt-insp');
  await page.selectOption('#cb-opt-hold', '300');
  await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 1000);   // 假时钟在 4b 已装好
  const tst = () => page.evaluate(() => CBAPP.timer().st);
  await page.focus('#cb-timer');
  await page.keyboard.down('Space');
  assert(await tst() === 'hold', '按下空格 → hold');
  await page.clock.runFor(200);
  assert(await tst() === 'hold', '按住 0.2 秒仍未准备好');
  await page.clock.runFor(150);
  assert(await tst() === 'ready', '按住 0.35 秒 → ready');
  assert(await page.$eval('#cb-timer', (n) => n.getAttribute('data-st')) === 'ready', '计时块变绿');
  await page.keyboard.up('Space');
  assert(await tst() === 'run', '松开 → 开始计时');
  await page.clock.runFor(12345);
  // 计时中的数字由 rAF 刷新：最后一帧落在 12345 ms 之前至多一帧（≈16.7 ms）+ 截断 0.01 s ⇒ [12.31, 12.34]
  const running = parseFloat(await page.textContent('#cb-time'));
  assert(running >= 12.31 && running <= 12.34, `计时中显示 ${running}`);
  await page.keyboard.down('Space');
  assert(await tst() === 'done', '再按 → 停表');
  await page.keyboard.up('Space');
  let ses = await page.evaluate(() => CBAPP.timer().session.solves.slice());
  assert(ses.length === 1 && ses[0].t === 12345 && ses[0].p === 0, `记录 12345 ms：${JSON.stringify(ses[0])}`);
  assert(await page.textContent('#cb-time') === '12.34', '截断到 0.01 秒');
  // 观察 15.5 秒才开始 ⇒ +2
  await page.check('#cb-opt-insp');
  await page.focus('#cb-timer');
  await page.keyboard.down('Space'); await page.keyboard.up('Space');
  assert(await tst() === 'insp', '开始观察');
  await page.clock.runFor(15500);
  assert(await page.textContent('#cb-time') === '+2', `观察超 15 秒显示 +2：${await page.textContent('#cb-time')}`);
  await page.keyboard.down('Space'); await page.clock.runFor(350);
  await page.keyboard.up('Space');
  assert(await tst() === 'run', '观察后起表');
  await page.clock.runFor(10000);
  await page.keyboard.down('Space'); await page.keyboard.up('Space');
  ses = await page.evaluate(() => CBAPP.timer().session.solves.slice());
  assert(ses[1].p === 2000 && ses[1].t === 10000, `+2 判罚：${JSON.stringify(ses[1])}`);
  assert(await page.textContent('#cb-time') === '12.00+', `+2 显示 ${await page.textContent('#cb-time')}`);
  // 观察 17.6 秒 ⇒ DNF
  await page.keyboard.down('Space'); await page.keyboard.up('Space');
  await page.clock.runFor(17600);
  assert(await page.textContent('#cb-time') === 'DNF', '观察超 17 秒显示 DNF');
  await page.keyboard.down('Space'); await page.clock.runFor(350); await page.keyboard.up('Space');
  await page.clock.runFor(5000);
  await page.keyboard.down('Space'); await page.keyboard.up('Space');
  ses = await page.evaluate(() => CBAPP.timer().session.solves.slice());
  assert(ses[2].p === -1 && await page.textContent('#cb-time') === 'DNF(5.00)', `DNF 判罚 ${JSON.stringify(ses[2])}`);
  // Esc 取消观察，不记成绩
  await page.keyboard.down('Space'); await page.keyboard.up('Space');
  await page.clock.runFor(2000);
  await page.keyboard.press('Escape');
  assert(await tst() === 'idle' && (await page.evaluate(() => CBAPP.timer().session.solves.length)) === 3, 'Esc 取消观察');
  // 改判：最后一次 DNF → 无判罚 → 删除
  await page.click('#cb-pen-ok');
  assert(await page.textContent('#cb-time') === '5.00', '改判为无判罚');
  await page.click('#cb-pen-del');
  assert(await page.evaluate(() => CBAPP.timer().session.solves.length) === 2, '删除最后一次');
  await page.clock.resume();

  // 导入一组固定成绩，统计表逐格 = Python 独立实现
  await page.setInputFiles('#cb-import', { name: 'cube.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ app: 'cube-lab', version: 1, list: [{ name: '导入测试', solves: ORACLE.timer.solves }] })) });
  await page.waitForFunction(() => (document.getElementById('cb-io-msg').textContent || '').includes('导入'));
  assert((await page.textContent('#cb-io-msg')).includes('导入 14 次成绩'), await page.textContent('#cb-io-msg'));
  for (const [k, v] of Object.entries(ORACLE.timer.expect)) {
    const id = ['n', 'mean', 'dnf'].includes(k) ? '#cb-st-' + k : '#cb-st-' + k;
    const got = (await page.textContent(id)).trim();
    assert(got === v, `统计 ${k} 应为 ${v}，实得 ${got}`);
  }
  const rows = await page.$$eval('#cb-solves tr', (r) => r.map((x) => x.children[1].textContent));
  assert(rows.length === 14 && rows[0] === ORACLE.timer.listFirst && rows[11] === ORACLE.timer.pen3 && rows[8] === ORACLE.timer.dnf6,
    `成绩列表 第1/12/9 行：${rows[0]} ${rows[11]} ${rows[8]}`);
  // 走势图：13 个单次点（DNF 不画）+ ao5、ao12 两条线
  const chart = await page.$eval('#cb-chart', (s) => ({ dots: s.querySelectorAll('circle').length, paths: s.querySelectorAll('path').length,
    w: s.getBoundingClientRect().width, texts: s.querySelectorAll('text').length }));
  assert(chart.dots === 13 && chart.paths >= 2 && chart.w > 200 && chart.texts >= 8, `走势图 ${JSON.stringify(chart)}`);
  // 列表里改判一行 → 统计跟着变
  await page.click('#cb-solves tr:nth-child(1) button[data-act="DNF"]');
  assert((await page.textContent('#cb-st-dnf')).trim() === '2', '列表改判 DNF 后 DNF 计数 = 2');
  assert(await page.$eval('#cb-solves tr:nth-child(1) button[data-act="DNF"]', (b) => b.getAttribute('aria-pressed')) === 'true', 'DNF 开关按下');
  await page.click('#cb-solves tr:nth-child(1) button[data-act="DNF"]');
  assert((await page.textContent('#cb-st-dnf')).trim() === '1', '再点一次 DNF 撤销判罚');
  // 成绩表在卡片里放得下：最右一列按钮不越出卡片（宽视口）
  const fit = await page.$eval('#cb-solves tr:nth-child(1) button[data-act="del"]', (b) => {
    const card = b.closest('.cb-card').getBoundingClientRect(), r = b.getBoundingClientRect();
    return Math.round(card.right - r.right);
  });
  assert(fit >= 0, `删除按钮在卡片内（距右边 ${fit}px）`);
  // 导出 CSV
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#cb-export-csv')]);
  const csv = await (await import('node:fs')).promises.readFile(await dl.path(), 'utf8');
  const lines = csv.trim().split('\n');
  assert(lines.length === 15 && lines[0] === 'No.,Time,Penalty,Result,Scramble,Date' && lines[3].startsWith('3,15.999,+2,'), `CSV ${lines.length} 行：${lines[3]}`);
  // 新建 / 删除分组（删除要点两次确认，不弹对话框）
  const nOpt = await page.$$eval('#cb-session option', (o) => o.length);
  await page.click('#cb-sess-new');
  assert(await page.$$eval('#cb-session option', (o) => o.length) === nOpt + 1, '新建分组');
  await page.click('#cb-sess-del'); await page.click('#cb-sess-del');
  assert(await page.$$eval('#cb-session option', (o) => o.length) === nOpt, '删除分组（两次点击确认）');

  // ── 10. 公式库 ──
  await onTab('algs');
  await page.waitForFunction(() => document.querySelectorAll('#cb-lib .cb-case').length === 78);
  assert(ORACLE.counts.oll === 57 && ORACLE.counts.pll === 21, '57 + 21');
  for (const [id, c] of Object.entries(ORACLE.cases)) {
    const got = await page.$eval(`#cb-lib .cb-case[data-id="${id}"] svg`, (s) => {
      const u = [...s.querySelectorAll('rect[data-u]')].map((r) => r.getAttribute('data-c')).join('');
      const side = (k) => [0, 1, 2].map((i) => s.querySelector(`rect[data-s="${k}${i}"]`).getAttribute('data-c')).join('');
      return { U: u, B: side('B'), R: side('R'), F: side('F'), L: side('L'), arrows: s.querySelectorAll('line[data-arrow]').length };
    });
    for (const k of ['U', 'B', 'R', 'F', 'L']) assert(got[k] === c[k], `${id} 案例图 ${k}：${got[k]} vs pycuber ${c[k]}`);
    // PLL 箭头数是情形本身的结构：两组对换各一根双头箭头，三循环三根
    const ARROWS = { T: 2, Ua: 3, H: 2, Aa: 3, Z: 2, E: 2, Na: 2 };
    if (c.kind === 'pll') assert(got.arrows === ARROWS[id], `${id} 箭头 ${got.arrows}`);
    // 规范案例图需要的收尾 AUF（Python 侧按「侧面错色贴纸最少」独立选出）要标在公式后面
    const auf = await page.$eval(`#cb-lib .cb-case[data-id="${id}"] .cb-case-alg`, (p) => (p.querySelector('.cb-case-auf') || { textContent: '' }).textContent.trim());
    assert(auf === (c.auf ? '(' + c.auf + ')' : ''), `${id} 收尾 AUF「${auf}」应为「${c.auf}」`);
  }
  // OLL 图只有黄 / 灰两色：颜色断计算后的 fill
  const ollFill = await page.$eval('#cb-lib .cb-case[data-id="OLL 27"] svg rect[data-u="4"]', (r) => getComputedStyle(r).fill);
  assert(ollFill === 'rgb(255, 212, 0)', `OLL 顶面中心是黄色 ${ollFill}`);
  const visible = () => page.$$eval('#cb-lib .cb-case', (cs) => cs.filter((c) => getComputedStyle(c).display !== 'none').length);
  await page.click('#cb-lib-oll'); assert(await visible() === 57, 'OLL 筛选 57');
  await page.click('#cb-lib-pll'); assert(await visible() === 21, 'PLL 筛选 21');
  await page.click('#cb-lib-all'); assert(await visible() === 78, '全部 78');
  await page.fill('#cb-lib-q', 'sune');
  assert(await visible() === 2, '搜 sune → Sune + Antisune');
  await page.fill('#cb-lib-q', 'zzzz');
  assert(await visible() === 0 && await disp('#cb-lib-empty') !== 'none', '无结果提示');
  await page.fill('#cb-lib-q', '');
  await page.click('#cb-lib .cb-case[data-id="T"] .cb-star');
  await page.click('#cb-lib-star');
  assert(await visible() === 1, '标星筛选');
  assert(await page.evaluate(() => JSON.parse(localStorage.getItem('cb-algs-star-v1')).T === 1), '标星存进 localStorage');
  await page.click('#cb-lib-all');
  // 训练：揭晓 → 认对了
  await page.selectOption('#cb-tr-set', 'pll');
  await page.click('#cb-tr-next');
  const tr = await page.evaluate(() => CBAPP.trainer());
  assert(['Ua', 'Ub', 'H', 'Z', 'Aa', 'Ab', 'E', 'T', 'F', 'Ja', 'Jb', 'Ra', 'Rb', 'Ga', 'Gb', 'Gc', 'Gd', 'V', 'Y', 'Na', 'Nb'].includes(tr.id), `PLL 题库抽到 ${tr.id}`);
  assert((await page.textContent('#cb-tr-name')) === '认一认这是哪个？', '揭晓前不显示答案');
  await page.click('#cb-tr-reveal');
  assert((await page.textContent('#cb-tr-name')).includes(tr.id), '揭晓');
  await page.click('#cb-tr-good');
  assert((await page.textContent('#cb-tr-stats')).includes('本轮 1 / 1'), '计分');
  // 送到 3D 演示：黄顶绿前摆出 T 情形，播完 = 黄顶复原态
  await page.click('#cb-lib .cb-case[data-id="T"] .cb-case-demo');
  await page.waitForFunction(() => CBAPP.tab() === 'solve' && CBAPP.solution() && CBAPP.solution().meta.kind === 'demo');
  assert((await page.evaluate(() => CBAPP.solution().len)) === ORACLE.cases.T.n, 'T 公式步数');
  await page.click('#cb-pb-last');
  await waitState(ORACLE.z2, '演示播完 = 黄顶绿前的复原态');

  // ── 11. 原理页 ──
  await onTab('about');
  assert((await page.textContent('#cb-count')).trim() === ORACLE.count, `状态数 ${await page.textContent('#cb-count')}`);

  // ── 12. 渲染守卫（逐页签控件尺寸 / [hidden] 计算样式 / text-transform / 390·768 横向溢出 / 卡片逃逸 / 图上文字不重叠 / id 唯一） ──
  await onTab('timer');
  const n = await renderGuards(page, {
    assert, tabs: TABS, onTab,
    paneSel: (t) => `#pane-${t}`, panesRoot: '#cb-panes',
    figSel: (t) => (t === 'timer' ? '#cb-chart' : `#pane-${t} svg.cb-chart`),
    cardSel: '.cb-card', minControls: 90, minTextsInFig: 8, minIds: 120,
  });
  assert(n >= 90, `各页签累计扫到 ${n} 个可见控件`);

  // ── 13. 缩略图：打乱态 + 解法演示到一半 ──
  await onTab('solve');
  await applyAlg(ORACLE.initAlg);
  await waitState(ORACLE.initState, '缩略图前重新打乱');
  await page.click('#cb-solve-btn');
  await page.waitForFunction(() => !!CBAPP.solution(), null, { timeout: 30000 });
  await page.click('#cb-sol button[data-i="7"]');
  await page.evaluate(() => window.scrollTo(0, 0));
  await settled();
  await screenshot('thumb.png');
};
