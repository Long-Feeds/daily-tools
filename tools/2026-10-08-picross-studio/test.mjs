/* 数织工坊 · 集成测试
 *
 * 真值全部来自 run 目录 oracle/oracle.py（与 JS 引擎独立的 Python 实现：单行穷举全部摆法、
 * 整题「逐行枚举 + 列前缀剪枝」回溯计数、极小题全格枚举交叉核对），由 inject-oracle.mjs
 * 机械注入下面的 ORACLE 块 —— 本文件不手打任何解或计数。渲染守卫 import（render-guards.mjs）。
 */
import {
  guardHidden, guardUniqueIds, guardControlSize, guardTextTransform, guardOverflow, guardEscape,
} from '/Users/lon/.agents/cron/daily-website/tools/render-guards.mjs';

const ORACLE = {
 "meta": {
  "tabs": [
   "play",
   "lib",
   "edit",
   "solve",
   "about"
  ]
 },
 "heart": {
  "rows": [
   [
    2,
    2
   ],
   [
    7
   ],
   [
    7
   ],
   [
    5
   ],
   [
    3
   ],
   [
    1
   ]
  ],
  "cols": [
   [
    2
   ],
   [
    4
   ],
   [
    5
   ],
   [
    5
   ],
   [
    5
   ],
   [
    4
   ],
   [
    2
   ]
  ],
  "sol": [
   [
    0,
    1,
    1,
    0,
    1,
    1,
    0
   ],
   [
    1,
    1,
    1,
    1,
    1,
    1,
    1
   ],
   [
    1,
    1,
    1,
    1,
    1,
    1,
    1
   ],
   [
    0,
    1,
    1,
    1,
    1,
    1,
    0
   ],
   [
    0,
    0,
    1,
    1,
    1,
    0,
    0
   ],
   [
    0,
    0,
    0,
    1,
    0,
    0,
    0
   ]
  ],
  "count": 1,
  "black": 27
 },
 "cat": {
  "rows": [
   [
    1,
    1
   ],
   [
    2,
    2
   ],
   [
    9
   ],
   [
    1,
    2,
    2,
    1
   ],
   [
    9
   ],
   [
    3,
    1,
    3
   ],
   [
    7
   ],
   [
    5,
    1
   ],
   [
    6,
    1
   ],
   [
    7
   ]
  ],
  "cols": [
   [
    6
   ],
   [
    2,
    3
   ],
   [
    8
   ],
   [
    3,
    4
   ],
   [
    1,
    6
   ],
   [
    3,
    4
   ],
   [
    8
   ],
   [
    2,
    3,
    2
   ],
   [
    6,
    1
   ],
   [
    2
   ]
  ],
  "sol": [
   [
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0
   ],
   [
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    0
   ],
   [
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0
   ],
   [
    1,
    0,
    1,
    1,
    0,
    1,
    1,
    0,
    1,
    0
   ],
   [
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0
   ],
   [
    1,
    1,
    1,
    0,
    1,
    0,
    1,
    1,
    1,
    0
   ],
   [
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0
   ],
   [
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    1
   ],
   [
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    1
   ],
   [
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0
   ]
  ],
  "count": 1,
  "black": 64
 },
 "umbrella": {
  "rows": [
   [
    1
   ],
   [
    7
   ],
   [
    11
   ],
   [
    13
   ],
   [
    15
   ],
   [
    1,
    1,
    3,
    1,
    1
   ],
   [
    1
   ],
   [
    1
   ],
   [
    1
   ],
   [
    1
   ],
   [
    1
   ],
   [
    1
   ],
   [
    1,
    1
   ],
   [
    1,
    1
   ],
   [
    2
   ]
  ],
  "cols": [
   [
    2
   ],
   [
    2
   ],
   [
    3
   ],
   [
    4
   ],
   [
    4
   ],
   [
    4
   ],
   [
    5
   ],
   [
    14
   ],
   [
    5,
    1
   ],
   [
    4,
    1
   ],
   [
    4,
    2
   ],
   [
    4
   ],
   [
    3
   ],
   [
    2
   ],
   [
    2
   ]
  ],
  "sol": [
   [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0
   ],
   [
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0
   ],
   [
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0
   ],
   [
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0
   ],
   [
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1
   ],
   [
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    1,
    1,
    0,
    0,
    1,
    0,
    0,
    1
   ],
   [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0
   ],
   [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0
   ],
   [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0
   ],
   [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0
   ],
   [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0
   ],
   [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0
   ],
   [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    0,
    0
   ],
   [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    0,
    0
   ],
   [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    0,
    0
   ]
  ],
  "count": 1,
  "black": 66
 },
 "key": {
  "rows": [
   [
    2
   ],
   [
    4
   ],
   [
    2,
    7
   ],
   [
    4,
    1,
    1
   ],
   [
    2,
    1,
    1
   ],
   []
  ],
  "cols": [
   [
    3
   ],
   [
    5
   ],
   [
    2,
    2
   ],
   [
    3
   ],
   [
    1
   ],
   [
    1
   ],
   [
    1
   ],
   [
    3
   ],
   [
    1
   ],
   [
    3
   ]
  ],
  "sol": [
   [
    0,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0
   ],
   [
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0
   ],
   [
    1,
    1,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1
   ],
   [
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    1,
    0,
    1
   ],
   [
    0,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    1
   ],
   [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
   ]
  ],
  "count": 1,
  "black": 25
 },
 "edAmb": {
  "count": 2,
  "amb": 4
 },
 "gen2026": {
  "count": 1,
  "sol": [
   [
    1,
    1,
    0,
    0,
    1,
    1,
    0,
    0,
    1,
    1
   ],
   [
    1,
    0,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    1
   ],
   [
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1
   ],
   [
    0,
    0,
    1,
    0,
    1,
    1,
    1,
    0,
    0,
    1
   ],
   [
    0,
    0,
    0,
    1,
    1,
    0,
    1,
    0,
    0,
    1
   ],
   [
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    0
   ],
   [
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    0,
    0
   ],
   [
    1,
    1,
    1,
    0,
    1,
    0,
    0,
    1,
    0,
    0
   ],
   [
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1
   ],
   [
    0,
    0,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    1
   ]
  ]
 },
 "noneCase": {
  "rows": [
   [
    1,
    1
   ],
   [],
   []
  ],
  "cols": [
   [],
   [
    2
   ],
   []
  ],
  "count": 0
 },
 "nLib": 12
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const T = ORACLE.meta.tabs;
  const W = (fn, arg) => page.waitForFunction(fn, arg, { timeout: 10000 });
  const onTab = async (t) => {
    await page.click(`#pc-tab-${t}`);
    await W((t) => !document.getElementById(`pc-pane-${t}`).hidden, t);
  };
  const cell = (b, r, c) => `#${b} .pc-cell[data-r="${r}"][data-c="${c}"]`;
  const filledSet = (b) => page.$$eval(`#${b} .pc-cell`, (ns) => ns.filter((n) => n.classList.contains('pc-f')).map((n) => n.dataset.r + ',' + n.dataset.c).sort().join(' '));
  const solSet = (sol) => sol.flatMap((row, r) => row.map((v, c) => (v ? r + ',' + c : null))).filter(Boolean).sort().join(' ');
  const clueText = (b, kind, n) => page.$$eval(`#${b} .pc-${kind}`, (ns) => ns.map((x) => Array.from(x.querySelectorAll('span')).map((s) => s.textContent).join(' ')));
  const fmtClues = (cl) => cl.map((x) => (x.length ? x.join(' ') : '0'));

  await page.goto(toolURL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await W(() => document.querySelectorAll('#pc-board .pc-cell').length > 0);

  // ── 1. 首屏默认题 = 爱心，线索与 oracle 一致 ──
  const H = ORACLE.heart;
  assert(await page.textContent('#pc-play-title') === '爱心', '默认载入第一道内置题「爱心」');
  const rowsShown = await clueText('pc-board', 'rc');
  const colsShown = await clueText('pc-board', 'cc');
  assert(JSON.stringify(rowsShown) === JSON.stringify(fmtClues(H.rows)), `行线索 ${rowsShown} ≠ ${fmtClues(H.rows)}`);
  assert(JSON.stringify(colsShown) === JSON.stringify(fmtClues(H.cols)), `列线索 ${colsShown} ≠ ${fmtClues(H.cols)}`);
  assert((await page.textContent('#pc-kv-filled')) === `0 / ${H.black}`, '已涂计数初值');

  // 盘面几何：格子是正方形、等距；行线索列在第一格左侧；线索数字不越出线索格
  const geo = await page.evaluate(() => {
    const a = document.querySelector('#pc-board .pc-cell[data-r="0"][data-c="0"]').getBoundingClientRect();
    const b = document.querySelector('#pc-board .pc-cell[data-r="0"][data-c="1"]').getBoundingClientRect();
    const d = document.querySelector('#pc-board .pc-cell[data-r="1"][data-c="0"]').getBoundingClientRect();
    const rc = document.querySelector('#pc-board .pc-rc').getBoundingClientRect();
    return { w: a.width, h: a.height, dx: b.left - a.left, dy: d.top - a.top, rcRight: rc.right, left: a.left };
  });
  assert(Math.abs(geo.w - geo.h) < 0.5 && geo.w >= 14, `格子应为 ≥14px 正方形，实得 ${geo.w}×${geo.h}`);
  assert(Math.abs(geo.dx - geo.w) < 0.5 && Math.abs(geo.dy - geo.h) < 0.5, `格距应等于格宽：dx=${geo.dx} dy=${geo.dy}`);
  assert(geo.rcRight <= geo.left + 0.5, '行线索在第一格左侧');

  // ── 2. 拖动整行涂黑 → 撤销 → 重做 ──
  const full = H.sol.findIndex((row) => row.every((v) => v === 1));
  const bx = async (r, c) => page.locator(cell('pc-board', r, c)).boundingBox();
  const nRow = (n) => W(([r, n]) => document.querySelectorAll(`#pc-board .pc-cell.pc-f[data-r="${r}"]`).length === n, [full, n]);
  // 先在中间打一个叉：拖动涂黑只改「与起点原状态相同」的格，叉要保留
  await page.click(cell('pc-board', full, 3), { button: 'right' });
  const undoBase = await page.evaluate(() => window.PC_DEBUG.play.undo.length);
  const p0 = await bx(full, 0), p1 = await bx(full, H.cols.length - 1);
  await page.mouse.move(p0.x + p0.width / 2, p0.y + p0.height / 2);
  await page.mouse.down();
  await page.mouse.move(p0.x + p0.width * 2, p0.y + p0.height / 2, { steps: 3 });
  await page.mouse.move(p1.x + p1.width / 2, p1.y + p1.height / 2, { steps: 6 });
  await page.mouse.up();
  await nRow(6);
  assert(await page.$eval(cell('pc-board', full, 3), (e) => e.classList.contains('pc-x') && !e.classList.contains('pc-f')), '拖动越过的叉格保持原状');
  assert(await page.evaluate((b) => window.PC_DEBUG.play.undo.length === b + 1, undoBase), '一次拖动 = 一步撤销');
  await page.click('#pc-undo');
  await nRow(0);
  assert(await page.$eval(cell('pc-board', full, 3), (e) => e.classList.contains('pc-x')), '撤销拖动后叉仍在（独立一步）');
  await page.click('#pc-redo');
  await nRow(6);
  await page.click(cell('pc-board', full, 3), { button: 'right' }); // 去叉
  await page.click(cell('pc-board', full, 3));                       // 涂黑
  await nRow(7);
  assert(await page.$eval(`#pc-p-rc-${full}`, (e) => e.classList.contains('pc-done')), '满足的行线索变灰');
  assert(await page.$eval(`#pc-p-rc-${full}`, (e) => getComputedStyle(e).color === 'rgb(154, 154, 174)'), '变灰线索的计算颜色');
  assert((await page.textContent('#pc-kv-filled')) === `7 / ${H.black}`, '拖动后已涂 7');

  // ── 3. 右键打叉、检查错误 ──
  const emptyCell = (() => { for (let r = 0; r < H.sol.length; r++) for (let c = 0; c < H.sol[0].length; c++) if (!H.sol[r][c]) return [r, c]; })();
  await page.click(cell('pc-board', ...emptyCell), { button: 'right' });
  assert(await page.$eval(cell('pc-board', ...emptyCell), (e) => e.classList.contains('pc-x')), '右键打叉');
  const wrongFill = (() => { for (let r = H.sol.length - 1; r >= 0; r--) for (let c = 0; c < H.sol[0].length; c++) if (!H.sol[r][c] && !(r === emptyCell[0] && c === emptyCell[1])) return [r, c]; })();
  await page.click(cell('pc-board', ...wrongFill));
  await page.click('#pc-check');
  await W(() => /有 1 格和答案不符/.test(document.getElementById('pc-status').textContent));
  assert(await page.$eval(cell('pc-board', ...wrongFill), (e) => e.classList.contains('pc-wrong') && getComputedStyle(e).boxShadow.includes('230, 0, 18')), '错格红框（计算样式）');
  // 提示在有错时拒绝推理
  await page.click('#pc-hint');
  await W(() => /先改掉 1 处错误/.test(document.getElementById('pc-status').textContent));
  assert(await page.$eval('#pc-hint-apply', (e) => e.disabled), '有错时「应用提示」不可用');
  await page.click('#pc-undo');
  await W((s) => !document.querySelector(s).classList.contains('pc-f'), cell('pc-board', ...wrongFill));

  // ── 4. 推理提示 → 应用 ──
  await page.click('#pc-hint');
  await W(() => !document.getElementById('pc-hint-apply').disabled);
  const hc = await page.$$eval('#pc-board .pc-cell.pc-hc', (ns) => ns.map((n) => [+n.dataset.r, +n.dataset.c]));
  assert(hc.length >= 1, '提示高亮至少 1 格');
  assert(/仅凭这一条就能确定/.test(await page.textContent('#pc-status')), '提示文案');
  await page.click('#pc-hint-apply');
  for (const [r, c] of hc) {
    const cls = await page.$eval(cell('pc-board', r, c), (e) => e.className);
    const want = H.sol[r][c] ? 'pc-f' : 'pc-x';
    assert(cls.includes(want), `提示格 (${r},${c}) 应为 ${want}，实得 ${cls}`);
  }

  // ── 5. 键盘：方向键 + 空格 补完全部黑格 → 通关 ──
  await page.focus('#pc-board');
  await page.evaluate(() => { const b = document.getElementById('pc-board'); b.blur(); b.focus(); });
  // 光标停在上一次指针操作处 ⇒ 先用方向键归位到左上角（越界按键应被夹住）
  for (let i = 0; i < H.sol.length + 2; i++) await page.keyboard.press('ArrowUp');
  for (let i = 0; i < H.sol[0].length + 2; i++) await page.keyboard.press('ArrowLeft');
  assert(await page.$eval(cell('pc-board', 0, 0), (e) => e.classList.contains('pc-cur')), '方向键归位到 (0,0) 且越界被夹住');
  let at = [0, 0];
  for (let r = 0; r < H.sol.length; r++) for (let c = 0; c < H.sol[0].length; c++) {
    if (!H.sol[r][c]) continue;
    const isF = await page.$eval(cell('pc-board', r, c), (e) => e.classList.contains('pc-f'));
    if (isF) continue;
    while (at[0] < r) { await page.keyboard.press('ArrowDown'); at[0]++; }
    while (at[0] > r) { await page.keyboard.press('ArrowUp'); at[0]--; }
    while (at[1] < c) { await page.keyboard.press('ArrowRight'); at[1]++; }
    while (at[1] > c) { await page.keyboard.press('ArrowLeft'); at[1]--; }
    await page.keyboard.press('Space');
  }
  await W(() => !document.getElementById('pc-win').hidden);
  assert(await page.$eval('#pc-win', (e) => getComputedStyle(e).display !== 'none'), '通关条可见（计算样式）');
  assert(await filledSet('pc-board') === solSet(H.sol), '通关盘面 = oracle 解');
  assert((await page.textContent('#pc-chip-done')) === '已通关 1 题', '通关计数');
  const st = await page.evaluate(() => JSON.parse(localStorage.getItem('pc-studio-v1')));
  assert(st.best['lib-heart'] > 0 && st.progress['lib-heart'].won === true, 'localStorage 记录最佳成绩与通关');
  assert(await page.$eval('#pc-undo', (e) => e.disabled), '通关后锁定撤销');
  const t1 = await page.textContent('#pc-timer');
  await page.waitForTimeout(1200);
  assert((await page.textContent('#pc-timer')) === t1, '通关后计时停止');

  // ── 6. 题库：12 道内置题，已通关显示名字与成绩；点开小猫 ──
  await onTab('lib');
  const tiles = await page.$$eval('#pc-lib-builtin .pc-tile', (ns) => ns.map((n) => n.querySelector('.pc-tn').textContent));
  assert(tiles.length === ORACLE.nLib, `内置题 ${tiles.length} ≠ ${ORACLE.nLib}`);
  assert(tiles[0] === '爱心' && /未解锁/.test(tiles[1]), `通关题显示名字、未通关隐藏：${tiles.slice(0, 2)}`);
  assert(await page.$eval('#pc-lib-builtin .pc-tile[data-id="lib-heart"] .pc-b-done', (e) => /^\d\d:\d\d$/.test(e.textContent)), '通关成绩徽标');
  const px = await page.$eval('#pc-lib-builtin .pc-tile[data-id="lib-heart"] canvas', (cv) => {
    const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; let n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i] < 60 && d[i + 1] < 60) n++;
    return { n, s: cv.width / 7 };
  });
  assert(px.n === ORACLE.heart.black * px.s * px.s, `缩略图深色像素 ${px.n} 应 = 黑格 ${ORACLE.heart.black} × ${px.s}²`);
  assert((await page.textContent('#pc-lib-count')) === `通关 1 / ${ORACLE.nLib}`, '题库通关计数');
  await page.click('#pc-lib-builtin .pc-tile[data-id="lib-cat"]');
  await W(() => !document.getElementById('pc-pane-play').hidden && document.getElementById('pc-play-title').textContent === '小猫');
  assert(JSON.stringify(await clueText('pc-board', 'rc')) === JSON.stringify(fmtClues(ORACLE.cat.rows)), '小猫行线索');
  assert(JSON.stringify(await clueText('pc-board', 'cc')) === JSON.stringify(fmtClues(ORACLE.cat.cols)), '小猫列线索');

  // ── 7. 随机出题（种子 2026）→ 题目 = oracle 判唯一的那一幅 ──
  await onTab('lib');
  await page.selectOption('#pc-gen-w', '10');
  await page.selectOption('#pc-gen-h', '10');
  await page.fill('#pc-gen-seed', 'abc');
  await page.click('#pc-gen-go');
  await W(() => /整数/.test(document.getElementById('pc-gen-status').textContent));
  await page.fill('#pc-gen-seed', '2026');
  await page.$eval('#pc-gen-d', (e) => { e.value = '55'; e.dispatchEvent(new Event('input')); });
  await page.click('#pc-gen-go');
  await W(() => document.getElementById('pc-play-title').textContent === '随机 10×10 #2026');
  assert(ORACLE.gen2026.count === 1, 'oracle 判种子 2026 的题唯一');
  const genSol = await page.evaluate(() => window.PC_DEBUG.play.p.grid.map((r) => r.map((v) => (v === 1 ? 1 : 0))));
  assert(JSON.stringify(genSol) === JSON.stringify(ORACLE.gen2026.sol), '生成题的图案 = oracle 唯一解');
  assert((await page.textContent('#pc-kv-diff')) !== '困难', '生成题可逐行推理（不会标为困难）');

  // ── 8. 编辑器：对角两点 ⇒ 多解，歧义 4 格；自动修正 ⇒ 唯一；保存开玩 ──
  await onTab('edit');
  await page.click('#pc-ed-clear');
  await page.click(cell('pc-ed-board', 0, 0));
  await page.click(cell('pc-ed-board', 1, 1));
  assert((await clueText('pc-ed-board', 'rc')).slice(0, 3).join('|') === '1|1|0', '编辑器实时行线索');
  await page.click('#pc-ed-check');
  await W(() => document.getElementById('pc-ed-verdict').textContent === '多解 ✕');
  assert(ORACLE.edAmb.count === 2, 'oracle：对角两点恰 2 解');
  assert((await page.textContent('#pc-ed-amb')) === String(ORACLE.edAmb.amb), `歧义格数 = ${ORACLE.edAmb.amb}`);
  const ambN = await page.$$eval('#pc-ed-board .pc-cell.pc-amb', (ns) => ns.filter((n) => getComputedStyle(n).backgroundImage.includes('gradient')).length);
  assert(ambN === ORACLE.edAmb.amb, `斜纹格（计算样式）${ambN}`);
  await page.click('#pc-ed-fix');
  await W(() => document.getElementById('pc-ed-verdict').textContent === '唯一解 ✔');
  assert(await page.$$eval('#pc-ed-board .pc-cell.pc-amb', (ns) => ns.length) === 0, '修正后无歧义格');
  const code = await page.textContent('#pc-ed-code');
  assert(/^PX1\.10x10\.[0-9a-z]{20}$/.test(code), `分享码格式 ${code}`);
  await page.fill('#pc-ed-import', 'PX1.10x10.zz');
  await page.click('#pc-ed-import-go');
  await W(() => /长度不对/.test(document.getElementById('pc-ed-status').textContent));
  await page.fill('#pc-ed-name', '测试作品');
  await page.click('#pc-ed-save');
  await W(() => document.getElementById('pc-play-title').textContent === '测试作品');
  await onTab('lib');
  assert((await page.textContent('#pc-mine-count')) === '1 题', '我的题目 1 题');
  assert(await page.$eval('#pc-mine-empty', (e) => getComputedStyle(e).display === 'none'), '空提示已隐藏（计算样式）');
  // 导入分享码 round-trip：用小鱼的图案
  await onTab('edit');
  await page.click('#pc-ed-from'); // 当前题 = 测试作品
  assert((await page.textContent('#pc-ed-code')) === code, '载入当前题后分享码一致');

  // ── 9. 求解器 ──
  await onTab('solve');
  const txt = (cl) => cl.rows.map((x) => (x.length ? x.join(' ') : '0')).join('\n') + '\n--\n' + cl.cols.map((x) => (x.length ? x.join(' ') : '0')).join('\n');
  await page.fill('#pc-sv-text', txt(ORACLE.cat));
  await page.click('#pc-sv-go');
  await W(() => document.getElementById('pc-sv-count').textContent === '1（唯一）');
  assert(await filledSet('pc-sv-board') === solSet(ORACLE.cat.sol), '求解结果 = oracle 解（小猫）');
  const stepsN = +(await page.textContent('#pc-sv-steps-n'));
  assert(stepsN >= 10 && (await page.$$eval('#pc-sv-steps li', (l) => l.length)) === stepsN, '推理步骤列表条数 = 步数');
  await page.$eval('#pc-sv-step', (e) => { e.value = '0'; e.dispatchEvent(new Event('input')); });
  await W(() => document.querySelectorAll('#pc-sv-board .pc-cell.pc-f').length === 0);
  await page.$eval('#pc-sv-step', (e) => { e.value = '1'; e.dispatchEvent(new Event('input')); });
  await W(() => document.querySelectorAll('#pc-sv-board .pc-hint').length === 1 && document.querySelector('#pc-sv-steps li.pc-on'));
  // 困难题（雨伞）：唯一但需要试探
  assert(ORACLE.umbrella.count === 1, 'oracle：雨伞唯一');
  await page.fill('#pc-sv-text', txt(ORACLE.umbrella));
  await page.click('#pc-sv-go');
  await W(() => document.getElementById('pc-sv-count').textContent === '1（唯一）');
  assert(+(await page.textContent('#pc-sv-guess')) > 0 && (await page.textContent('#pc-sv-diff')) === '困难', '雨伞需要试探、标为困难');
  assert(await filledSet('pc-sv-board') === solSet(ORACLE.umbrella.sol), '雨伞解 = oracle');
  // 多解示例
  await page.click('#pc-sv-sample');
  await W(() => document.getElementById('pc-sv-count').textContent === '≥2（多解）');
  assert(await page.$eval('#pc-sv-alt', (e) => getComputedStyle(e).display !== 'none'), '多解时显示「看另一个解」');
  assert(await page.$eval('#pc-sv-play', (e) => e.disabled), '多解时不能拿去玩');
  // 无解（oracle 计数 0）
  assert(ORACLE.noneCase.count === 0, 'oracle：无解样例');
  await page.fill('#pc-sv-text', txt(ORACLE.noneCase));
  await page.click('#pc-sv-go');
  await W(() => document.getElementById('pc-sv-count').textContent === '0（无解）');
  assert(await page.$eval('#pc-sv-out', (e) => getComputedStyle(e).display === 'none'), '无解时隐藏结果区（计算样式）');
  // 非法输入
  await page.fill('#pc-sv-text', '3\n--\n1\n1');
  await page.click('#pc-sv-go');
  await W(() => /超过宽度/.test(document.getElementById('pc-sv-status').textContent));
  await page.fill('#pc-sv-text', '1 x\n--\n1');
  await page.click('#pc-sv-go');
  await W(() => /非数字/.test(document.getElementById('pc-sv-status').textContent));
  // 唯一解拿去玩
  await page.fill('#pc-sv-text', txt(ORACLE.key));
  await page.click('#pc-sv-go');
  await W(() => !document.getElementById('pc-sv-play').disabled);
  await page.click('#pc-sv-play');
  await W(() => /^求解器导入/.test(document.getElementById('pc-play-title').textContent));

  // ── 10. 页签键盘导航 ──
  await page.focus('#pc-tab-play');
  await page.keyboard.press('ArrowRight');
  assert(await page.$eval('#pc-tab-lib', (e) => e.getAttribute('aria-selected') === 'true'), '→ 到题库');
  await page.keyboard.press('End');
  assert(await page.$eval('#pc-tab-about', (e) => e.getAttribute('aria-selected') === 'true'), 'End 到说明');
  await page.keyboard.press('ArrowRight');
  assert(await page.$eval('#pc-tab-play', (e) => e.getAttribute('aria-selected') === 'true'), '→ 循环回游戏');

  // ── 11. 刷新后恢复：当前题与进度 ──
  await page.click('#pc-lib-builtin .pc-tile[data-id="lib-cat"]').catch(() => {});
  await onTab('lib');
  await page.click('#pc-lib-builtin .pc-tile[data-id="lib-cat"]');
  await W(() => document.getElementById('pc-play-title').textContent === '小猫');
  const catFirst = ORACLE.cat.sol[0].indexOf(1);
  await page.click(cell('pc-board', 0, catFirst));
  await page.reload();
  await W(() => document.getElementById('pc-play-title').textContent === '小猫');
  assert(await page.$eval(cell('pc-board', 0, catFirst), (e) => e.classList.contains('pc-f')), '刷新后进度恢复');
  assert((await page.textContent('#pc-chip-done')) === '已通关 1 题', '刷新后通关数恢复');

  // ── 12. 渲染守卫（逐页签 × 逐视口），大盘（松树 21×20）在窄屏 ──
  await onTab('lib');
  await page.click('#pc-lib-builtin .pc-tile[data-id="lib-tree"]');
  await W(() => document.getElementById('pc-play-title').textContent === '松树');
  await onTab('solve');
  await page.fill('#pc-sv-text', txt(ORACLE.cat));
  await page.click('#pc-sv-go');
  await W(() => document.getElementById('pc-sv-count').textContent === '1（唯一）');
  const G = { assert, tabs: T, onTab, paneSel: (t) => `#pc-pane-${t}`, panesRoot: '#pc-panes' };
  await guardHidden(page, G);
  await guardUniqueIds(page, { assert, minIds: 60 });
  const nCtl = await guardControlSize(page, { ...G, minControls: 30 });
  assert(nCtl >= 30, `应扫到 ≥30 个可见控件，实得 ${nCtl}`);
  await guardTextTransform(page, G);
  await guardOverflow(page, G);
  await guardEscape(page, { assert, cardSel: '.pc-plate, .pc-info', childSel: 'table,dl,h2,h3,.pc-stage,.pc-row,.pc-tools,textarea,.pc-code' });
  for (const vw of [390, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    await onTab('play');
    await page.waitForTimeout(150);
    // 线索数字不越出自己的线索格（窄格 + 变长文本）；格子 ≥14px
    const esc = await page.evaluate(() => {
      const bad = [];
      document.querySelectorAll('#pc-board .pc-cc, #pc-board .pc-rc').forEach((box) => {
        const b = box.getBoundingClientRect();
        box.querySelectorAll('span').forEach((s) => {
          const r = s.getBoundingClientRect();
          if (r.left < b.left - 1 || r.right > b.right + 1 || r.top < b.top - 1 || r.bottom > b.bottom + 1) bad.push(box.id);
        });
      });
      const c = document.querySelector('#pc-board .pc-cell').getBoundingClientRect();
      return { bad: bad.slice(0, 5), n: bad.length, cw: c.width };
    });
    assert(esc.n === 0, `视口 ${vw}：${esc.n} 个线索数字越出线索格 ${esc.bad}`);
    assert(esc.cw >= 14, `视口 ${vw}：格宽 ${esc.cw} < 14`);
    const sOver = await page.$eval('#pc-stage', (s) => ({ sw: s.scrollWidth, cw: s.clientWidth, right: s.getBoundingClientRect().right, vw: innerWidth }));
    assert(sOver.right <= sOver.vw + 1, `视口 ${vw}：盘面容器越出视口`);
    // 盘面比容器宽时必须能在容器里滚到最右一列，且最右一列不被外层面板裁掉
    const reach = await page.$eval('#pc-stage', (s) => {
      s.scrollLeft = s.scrollWidth;
      const cells = s.querySelectorAll('.pc-cell[data-r="0"]');
      const last = cells[cells.length - 1].getBoundingClientRect();
      const plate = s.closest('.pc-plate').getBoundingClientRect();
      const out = { lastR: last.right, sR: s.getBoundingClientRect().right, pR: plate.right };
      s.scrollLeft = 0;
      return out;
    });
    assert(reach.lastR <= reach.sR + 1 && reach.lastR <= reach.pR + 1, `视口 ${vw}：滚到底后最右一列 right=${reach.lastR} 仍越出容器 ${reach.sR}/面板 ${reach.pR}`);
  }
  await page.setViewportSize({ width: 1280, height: 850 });

  // ── 缩略图：小猫做到一半 ──
  await onTab('lib');
  await page.click('#pc-lib-builtin .pc-tile[data-id="lib-cat"]');
  await W(() => document.getElementById('pc-play-title').textContent === '小猫');
  for (let r = 0; r < 6; r++) for (let c = 0; c < ORACLE.cat.sol[0].length; c++) {
    const v = ORACLE.cat.sol[r][c];
    const isF = await page.$eval(cell('pc-board', r, c), (e) => e.classList.contains('pc-f'));
    if (v && !isF) await page.click(cell('pc-board', r, c));
    if (!v && r < 3) await page.click(cell('pc-board', r, c), { button: 'right' });
  }
  await page.click(cell('pc-board', 6, 2));
  await page.mouse.move(0, 0);
  await screenshot('thumb.png');
};
