// Integration test for 元胞自动机实验室 · Cellular Lab.
// Drives the REAL life-like CA engine through the browser and asserts concrete
// outputs: oscillator/still-life/spaceship dynamics under Conway's B3/S23,
// rulestring parse + validation, RLE round-trip, canvas drawing (pointer→cell),
// and localStorage save/load. All assertions read synchronous engine state or
// wait for DOM/engine convergence (never a timed read of an async value).
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#board');
  await page.waitForFunction(() => window.CellularLab && typeof window.CellularLab.getPopulation === 'function');

  const api = (fn, ...args) => page.evaluate(({ fn, args }) => window.CellularLab[fn](...args), { fn, args });
  const pop = () => api('getPopulation');
  const gen = () => api('getGeneration');
  const rule = () => api('getRuleString');
  const live = () => api('getLiveCells');
  const nkey = () => api('getNormalizedKey');
  const allSame = (arr) => new Set(arr).size === 1;

  // ---- back link (site discipline) ----
  const back = await page.getAttribute('#back-link', 'href');
  assert(back === '../../', `back link points to tool hub (got "${back}")`);

  // ---- boot seeds a live glider (5 cells) ----
  assert((await pop()) === 5, `boots with a live glider, population 5 (got ${await pop()})`);
  assert((await rule()) === 'B3/S23', `default rule is Conway B3/S23 (got ${await rule()})`);

  // ============ Blinker: period-2 oscillator ============
  await page.click('#pat-blinker');
  let cells = await live();
  assert(cells.length === 3, `blinker has 3 cells (got ${cells.length})`);
  assert(allSame(cells.map((c) => c[1])), `stamped blinker is horizontal (rows equal): ${JSON.stringify(cells)}`);
  await page.click('#btn-step');
  cells = await live();
  assert(cells.length === 3, `blinker stays 3 cells after a step (got ${cells.length})`);
  assert(allSame(cells.map((c) => c[0])), `blinker flips to vertical after 1 gen (cols equal): ${JSON.stringify(cells)}`);
  await page.click('#btn-step');
  cells = await live();
  assert(allSame(cells.map((c) => c[1])), `blinker flips back to horizontal after 2 gens (period 2)`);
  assert((await gen()) === 2, `generation counter reads 2 after two steps (got ${await gen()})`);

  // ============ Block: still life (stable under B3/S23) ============
  await page.click('#pat-block');
  const blockKey = await nkey();
  assert((await pop()) === 4, `block has 4 cells (got ${await pop()})`);
  assert(blockKey === '0,0 0,1 1,0 1,1', `block normalized shape is a 2x2 square (got "${blockKey}")`);
  await page.click('#btn-step');
  assert((await pop()) === 4, `block is stable: still 4 cells after a step (got ${await pop()})`);
  assert((await nkey()) === blockKey, `block shape unchanged after a step (still life)`);

  // ============ Glider: spaceship that translates (1,1) every 4 gens ============
  await page.click('#pat-glider');
  const beforeKey = await nkey();
  const beforeMin = (await live()).reduce((m, c) => [Math.min(m[0], c[0]), Math.min(m[1], c[1])], [1e9, 1e9]);
  await api('step', 4);
  const afterKey = await nkey();
  const afterMin = (await live()).reduce((m, c) => [Math.min(m[0], c[0]), Math.min(m[1], c[1])], [1e9, 1e9]);
  assert((await pop()) === 5, `glider preserves 5 cells across 4 gens (got ${await pop()})`);
  assert(afterKey === beforeKey, `glider keeps its shape after one period (4 gens)`);
  assert(afterMin[0] - beforeMin[0] === 1 && afterMin[1] - beforeMin[1] === 1,
    `glider translates by exactly (1,1) per period (got d=${afterMin[0] - beforeMin[0]},${afterMin[1] - beforeMin[1]})`);

  // ============ RLE round-trip (export → clear → import) ============
  await page.click('#pat-glider');
  const gliderKey = await nkey();
  await page.click('#rle-export');
  const rleText = await page.inputValue('#rle-text');
  assert(/rule\s*=\s*B3\/S23/.test(rleText), `exported RLE carries the rule header (got: ${rleText.split('\n')[0]})`);
  assert(/o/.test(rleText), 'exported RLE contains live-cell tokens');
  await page.click('#btn-clear');
  assert((await pop()) === 0, `clear empties the grid (got ${await pop()})`);
  await page.click('#rle-import');
  assert((await pop()) === 5, `re-importing the exported RLE restores 5 cells (got ${await pop()})`);
  assert((await nkey()) === gliderKey, `RLE round-trip preserves the exact glider shape`);
  const okMsg = await page.textContent('#rle-msg');
  assert(/导入/.test(okMsg || ''), `import reports success (got "${(okMsg || '').trim()}")`);

  // ---- RLE parser handles a hand-written pattern + rejects garbage ----
  const n = await api('importRLE', 'x = 3, y = 1, rule = B3/S23\n3o!');
  assert(n === 3, `parseRLE decodes "3o!" into 3 cells (got ${n})`);
  assert(allSame((await live()).map((c) => c[1])), 'imported "3o!" is a horizontal row');
  const badImport = await page.evaluate(() => {
    try { window.CellularLab.importRLE('x=2,y=1\nzz!'); return 'no-throw'; }
    catch (e) { return e.message; }
  });
  assert(badImport !== 'no-throw', `illegal RLE symbol throws (got "${badImport}")`);

  // ============ Draw on the canvas (pointer → cell mapping) ============
  await page.click('#btn-clear');
  const targets = [[20, 12], [22, 12], [24, 12]];
  for (let i = 0; i < targets.length; i++) {
    const [gx, gy] = targets[i];
    const pt = await page.evaluate(([x, y]) => window.CellularLab.cellCenterClient(x, y), [gx, gy]);
    await page.mouse.click(pt.x, pt.y);
    assert((await pop()) === i + 1, `clicking empty cell (${gx},${gy}) adds one live cell (pop ${await pop()}, want ${i + 1})`);
  }
  const drawn = await live();
  const hasAll = targets.every(([gx, gy]) => drawn.some((c) => c[0] === gx && c[1] === gy));
  assert(hasAll, `all three clicked cells are alive at their exact coords: ${JSON.stringify(drawn)}`);

  // ============ Rule presets + custom rulestring + validation ============
  await page.locator('#rule-presets .chip', { hasText: 'HighLife' }).click();
  assert((await rule()) === 'B36/S23', `HighLife preset sets rule to B36/S23 (got ${await rule()})`);
  assert((await page.getAttribute('#rule-presets .chip >> nth=1', 'aria-pressed')) === 'true' ||
         (await page.locator('#rule-presets .chip', { hasText: 'HighLife' }).getAttribute('aria-pressed')) === 'true',
    'active preset chip is marked pressed');
  await page.fill('#rule-input', 'B9/S23'); // 9 neighbours is impossible → invalid
  assert((await rule()) === 'B36/S23', `invalid rulestring is rejected, engine keeps last valid rule (got ${await rule()})`);
  const rmsg = await page.getAttribute('#rule-msg', 'class');
  assert(/err/.test(rmsg || ''), `invalid rulestring surfaces an error (class "${rmsg}")`);
  await page.fill('#rule-input', 'B3/S23');
  assert((await rule()) === 'B3/S23', `valid custom rulestring applies (got ${await rule()})`);

  // ============ Save / load / delete via localStorage ============
  const before = await api('savedCount');
  await page.click('#pat-blinker');
  await page.fill('#save-name', 'my-blinker');
  await page.click('#save-btn');
  assert((await api('savedCount')) === before + 1, `saving adds one library entry (got ${await api('savedCount')})`);
  assert(await page.locator('.saved-item .nm', { hasText: 'my-blinker' }).count() >= 1, 'saved item shows in the list');
  await page.click('#btn-clear');
  assert((await pop()) === 0, 'grid cleared before load');
  await page.locator('.saved-item', { hasText: 'my-blinker' }).getByText('载入').click();
  assert((await pop()) === 3, `loading the saved blinker restores 3 cells (got ${await pop()})`);
  await page.locator('.saved-item', { hasText: 'my-blinker' }).getByText('删除').click();
  assert((await api('savedCount')) === before, `deleting removes the entry (got ${await api('savedCount')})`);

  // ============ Play / pause loop advances generations (convergence, not timing) ============
  await page.click('#pat-glider');
  const g0 = await gen();
  await page.click('#btn-play');
  await page.waitForFunction((g) => window.CellularLab.getGeneration() >= g + 2, g0, { timeout: 8000 });
  await page.click('#btn-play'); // pause
  assert((await api('isRunning')) === false, 'play toggles back to paused');
  assert((await gen()) >= g0 + 2, `play advanced at least 2 generations (got ${await gen()})`);
  assert((await pop()) === 5, `glider still intact after running (got ${await pop()})`);

  // ============ Settle a photogenic state for the card thumbnail ============
  await page.fill('#rule-input', 'B3/S23');
  await page.check('#wrap');
  await page.click('#btn-random');        // dense soup fills the compute surface edge-to-edge
  await api('step', 3);                   // let Conway's Life organize it into classic structures
  await page.evaluate(() => window.scrollTo(0, 0)); // restore hero + toolbar to frame
  await page.waitForTimeout(80);
  await screenshot('thumb.png');
}
