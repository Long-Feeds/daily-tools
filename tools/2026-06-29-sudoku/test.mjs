// Integration test for 数独 · Sudoku Studio.
// Drives the real solver / generator / interactive board through the browser and
// asserts concrete computed outputs (not mere element presence). Captures thumb.png.

// Canonical Wikipedia puzzle with its single known solution — used for all the
// deterministic UI assertions (we know exactly which cells are empty and correct).
const PUZZLE   = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
const SOLUTION = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';

export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#board .cell');
  await page.waitForFunction(() => !!window.__sudoku);
  // wait for the auto-started game to finish generating so its pending rAF can't
  // clobber a later loadTest()
  await page.waitForFunction(() => window.__sudoku.getState().solution.indexOf(0) === -1, { timeout: 8000 });

  const cell = (r, c) => page.locator(`.cell[data-r="${r}"][data-c="${c}"]`);
  const hasClass = (r, c, k) => cell(r, c).evaluate((el, kk) => el.classList.contains(kk), k);
  const loadKnown = () => page.evaluate(([p, s]) => window.__sudoku.loadTest(p, s), [PUZZLE, SOLUTION]);
  const puzzleStr = () => page.evaluate(() => window.__sudoku.getState().puzzle.join(''));
  const place = async (r, c, n) => {
    await cell(r, c).click();
    await page.locator(`.num-btn[data-n="${n}"]`).click();
    await page.waitForTimeout(25);
  };

  // ---- 1. pure engine: solver + uniqueness counter ----
  const engine = await page.evaluate(([p, s]) => {
    const arr = p.split('').map(Number);
    const sol = window.__sudoku.solve(arr);
    const cnt = window.__sudoku.countSolutions(arr, 2);
    const cntEmpty = window.__sudoku.countSolutions(new Array(81).fill(0), 2);
    return { solStr: sol ? sol.join('') : null, cnt, cntEmpty, want: s };
  }, [PUZZLE, SOLUTION]);
  assert(engine.solStr === SOLUTION, `solver returns the known unique solution (got ${engine.solStr})`);
  assert(engine.cnt === 1, `known puzzle has exactly one solution (got ${engine.cnt})`);
  assert(engine.cntEmpty >= 2, `empty grid has many solutions, cap>=2 (got ${engine.cntEmpty})`);

  // ---- 2. number-pad remaining counts reflect the real board ----
  await loadKnown();
  await page.waitForTimeout(30);
  const left5 = (await page.locator('.num-btn[data-n="5"] .left').textContent()) || '';
  assert(left5.trim() === '6', `digit 5 has 6 remaining (3 givens) initially (got "${left5.trim()}")`);

  // ---- 3. duplicate detection + mistake counter ----
  await place(0, 2, 5); // (0,2) empty; 5 duplicates the given 5 at (0,0); solution there is 4
  assert(await hasClass(0, 2, 'conflict'), 'placing duplicate 5 flags (0,2) as a conflict');
  assert(await hasClass(0, 0, 'conflict'), 'the original given 5 at (0,0) is also flagged');
  let mistakes = (await page.locator('#mistakes').textContent()) || '';
  assert(mistakes.trim() === '1', `a wrong placement increments mistakes to 1 (got "${mistakes.trim()}")`);

  // erase clears it, correct value 4 is conflict-free
  await page.click('#btn-erase');
  await page.waitForTimeout(20);
  assert(!(await hasClass(0, 2, 'conflict')), 'erasing clears the conflict');
  await place(0, 2, 4);
  let v02 = ((await cell(0, 2).locator('.value').textContent()) || '').trim();
  assert(v02 === '4', `correct value 4 is placed at (0,2) (got "${v02}")`);
  assert(!(await hasClass(0, 2, 'conflict')), 'the correct value is not a conflict');

  // ---- 4. solution-aware "check" catches a wrong-but-non-duplicate entry ----
  await loadKnown();
  await place(0, 2, 1); // 1 is wrong (sol=4) but not a row/col/box duplicate here
  assert(!(await hasClass(0, 2, 'conflict')), 'value 1 at (0,2) is not a duplicate, so no live conflict');
  await page.click('#btn-check');
  await page.waitForTimeout(30);
  assert(await hasClass(0, 2, 'error'), 'check marks the wrong (non-duplicate) entry as an error');
  const checkMsg = (await page.locator('#msg').textContent()) || '';
  assert(/不符/.test(checkMsg), `check reports a mismatch message (got "${checkMsg.trim()}")`);

  // ---- 5. pencil notes toggle on/off ----
  await loadKnown();
  await page.click('#btn-notes');
  assert((await page.locator('#btn-notes').getAttribute('aria-pressed')) === 'true', 'notes mode turns on');
  await cell(0, 3).click();
  await page.locator('.num-btn[data-n="1"]').click();
  await page.locator('.num-btn[data-n="2"]').click();
  await page.waitForTimeout(30);
  let notes = ((await cell(0, 3).locator('.notes').textContent()) || '');
  assert(notes.includes('1') && notes.includes('2'), `pencil notes show 1 and 2 (got "${notes}")`);
  await page.locator('.num-btn[data-n="1"]').click(); // toggle 1 off
  await page.waitForTimeout(20);
  notes = ((await cell(0, 3).locator('.notes').textContent()) || '');
  assert(!notes.includes('1') && notes.includes('2'), `toggling removes note 1 and keeps 2 (got "${notes}")`);
  await page.click('#btn-notes'); // back off

  // ---- 6. given cells are locked ----
  await loadKnown();
  await cell(0, 0).click();
  await page.locator('.num-btn[data-n="9"]').click();
  await page.waitForTimeout(20);
  let v00 = ((await cell(0, 0).locator('.value').textContent()) || '').trim();
  assert(v00 === '5', `given cell can't be overwritten, stays 5 (got "${v00}")`);

  // ---- 7. hint fills exactly one correct cell ----
  await loadKnown();
  const filledBefore = await page.locator('.cell.filled').count();
  await cell(0, 2).click(); // empty -> hint targets this cell deterministically
  await page.click('#btn-hint');
  await page.waitForTimeout(30);
  const filledAfter = await page.locator('.cell.filled').count();
  assert(filledAfter === filledBefore + 1, `hint fills exactly one more cell (${filledBefore}->${filledAfter})`);
  let hintV = ((await cell(0, 2).locator('.value').textContent()) || '').trim();
  assert(hintV === '4', `hint fills the correct solution value 4 at (0,2) (got "${hintV}")`);
  assert(await hasClass(0, 2, 'hint'), 'hinted cell is marked as a hint');

  // ---- 8. keyboard navigation + entry ----
  await loadKnown();
  await cell(0, 2).click();
  await page.keyboard.press('ArrowDown'); // (0,2) -> (1,2), index 11
  let sel = await page.evaluate(() => window.__sudoku.getState().selected);
  assert(sel === 11, `ArrowDown moves selection to (1,2)=index 11 (got ${sel})`);
  await page.keyboard.press('2'); // solution[11] = 2
  let v12 = ((await cell(1, 2).locator('.value').textContent()) || '').trim();
  assert(v12 === '2', `keyboard typing fills (1,2) with 2 (got "${v12}")`);
  let mk = ((await page.locator('#mistakes').textContent()) || '').trim();
  assert(mk === '0', `correct keyboard entry adds no mistake (got "${mk}")`);

  // ---- 9. solve fills the whole board and announces a win ----
  await loadKnown();
  await page.click('#btn-solve');
  await page.waitForTimeout(60);
  const filled = await page.locator('.cell.filled').count();
  assert(filled === 81, `solve fills all 81 cells (got ${filled})`);
  const conflicts = await page.locator('.cell.conflict').count();
  assert(conflicts === 0, `solved board has zero conflicts (got ${conflicts})`);
  const boardStr = await page.evaluate(() => window.__sudoku.getState().board.join(''));
  assert(boardStr === SOLUTION, 'solved board equals the known solution');
  assert(await page.locator('#win').evaluate((el) => el.classList.contains('show')), 'win banner shows after solve');

  // ---- 10. generator: difficulty changes clue count, every puzzle is unique & correct ----
  let before = await puzzleStr();
  await page.selectOption('#difficulty', 'expert');
  await page.waitForFunction((b) => window.__sudoku.getState().puzzle.join('') !== b, before, { timeout: 8000 });
  await page.waitForTimeout(30);
  const expertGivens = await page.locator('.cell.given').count();
  const gen = await page.evaluate(() => {
    const s = window.__sudoku.getState();
    const sol = window.__sudoku.solve(s.puzzle);
    return {
      uniq: window.__sudoku.countSolutions(s.puzzle, 2),
      matches: !!sol && sol.join('') === s.solution.join(''),
      solHasZero: s.solution.indexOf(0) !== -1,
    };
  });
  assert(gen.uniq === 1, `generated expert puzzle has a unique solution (got ${gen.uniq})`);
  assert(gen.matches, 'solver of generated puzzle equals its stored solution');
  assert(!gen.solHasZero, 'generated solution grid is fully filled');

  before = await puzzleStr();
  await page.selectOption('#difficulty', 'easy');
  await page.waitForFunction((b) => window.__sudoku.getState().puzzle.join('') !== b, before, { timeout: 8000 });
  await page.waitForTimeout(30);
  const easyGivens = await page.locator('.cell.given').count();
  assert(easyGivens > expertGivens, `easy has more clues than expert (easy=${easyGivens}, expert=${expertGivens})`);

  // "新游戏" button regenerates
  before = await puzzleStr();
  await page.click('#btn-new');
  await page.waitForFunction((b) => window.__sudoku.getState().puzzle.join('') !== b, before, { timeout: 8000 });

  // ---- thumbnail: a pretty in-progress board (completed top row + a pencil-marked cell) ----
  await loadKnown();
  await page.waitForTimeout(30);
  for (const [r, c, n] of [[0, 2, 4], [0, 3, 6], [0, 5, 8], [0, 6, 9], [0, 7, 1], [0, 8, 2], [1, 2, 2]]) {
    await place(r, c, n);
  }
  await page.click('#btn-notes');
  await cell(3, 1).click();
  for (const n of [1, 2, 5]) await page.locator(`.num-btn[data-n="${n}"]`).click();
  await page.click('#btn-notes');
  await cell(0, 0).click(); // select a 5 to light up same-number cells
  await page.waitForTimeout(60);
  await screenshot('thumb.png');
}
