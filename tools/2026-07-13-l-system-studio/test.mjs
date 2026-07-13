// Integration test for 分形工作室 · L-System Studio.
// Drives the real rewriting engine + turtle interpreter through the browser
// and asserts CONCRETE, deterministic outputs (exact expanded strings and
// exact segment counts), not mere element presence. Waits on DOM convergence
// with waitForFunction (never a fixed timeout then read — avoids debounce flake).
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#stage-canvas');

  const seg = () => page.locator('#stat-segments').textContent();
  const waitSeg = (v, timeout = 9000) =>
    page.waitForFunction((val) => document.querySelector('#stat-segments')?.textContent === val, v, { timeout });
  const bbox = () => page.getAttribute('#stage-canvas', 'data-bbox');

  // ── 1. Default preset boots to Koch Snowflake with the exact segment count ──
  // axiom "F++F++F" (3 F) · rule F→F-F++F-F (×4 per iter) · 4 iters → 3·4^4 = 768.
  await waitSeg('768');
  assert((await page.inputValue('#axiom')) === 'F++F++F', 'default axiom is the Koch snowflake axiom');
  assert((await page.inputValue('#angle')) === '60', 'default angle is 60°');

  // ── 2. Engine exactness: a tiny custom grammar rewrites deterministically ──
  // F, rule F→F+F, 2 iters → "F+F+F+F" (7 symbols, 4 draw moves).
  await page.click('.preset[data-preset="custom"]');
  assert((await page.inputValue('#axiom')) === 'F', 'custom preset axiom is F');
  await page.fill('#iterations', '2');
  await waitSeg('4');
  await page.waitForFunction(() => document.querySelector('#expanded')?.textContent === 'F+F+F+F', null, { timeout: 9000 });
  assert((await page.locator('#expanded').textContent()) === 'F+F+F+F', 'expanded string is exactly F+F+F+F');
  assert((await page.locator('#stat-chars').textContent()) === '7', 'expanded length is 7 symbols');

  // ── 3. Angle actually changes the geometry (real bbox output changes) ──
  await page.click('.preset[data-preset="koch-snowflake"]');
  await waitSeg('768');
  const bb60 = await bbox();
  assert(bb60 && bb60.split(',').length === 4, 'bbox is exposed as 4 numbers');
  await page.fill('#angle', '90');
  await page.waitForFunction((prev) => document.querySelector('#stage-canvas')?.getAttribute('data-bbox') !== prev, bb60, { timeout: 9000 });
  assert((await bbox()) !== bb60, 'changing the angle changes the rendered geometry');
  assert((await seg()) === '768', 'angle change does not alter the segment count');

  // ── 4. Loading another preset recomputes to its exact count ──
  // Dragon: F, F→F+G, G→F-G, 12 iters → 2^12 = 4096 draw moves.
  await page.click('.preset[data-preset="dragon"]');
  await waitSeg('4096');
  assert((await page.inputValue('#angle')) === '90', 'dragon preset sets angle to 90°');
  assert((await page.locator('.rule-row').count()) === 2, 'dragon has two production rules');

  // ── 5. Save to the local library, mutate, then load restores exactly ──
  await page.click('.preset[data-preset="custom"]');
  await page.fill('#iterations', '3');
  await waitSeg('8'); // custom F→F+F at 3 iters → 2^3 = 8
  await page.fill('#save-name', 'my-fractal');
  await page.click('#save-btn');
  const saved = page.locator('#saved-list .saved-item');
  await page.waitForFunction(() => document.querySelectorAll('#saved-list .saved-item').length >= 1, null, { timeout: 5000 });
  assert((await saved.count()) >= 1, 'a saved item appears in the library');
  assert(/my-fractal/.test((await saved.first().textContent()) || ''), 'the saved item shows its name');
  // mutate current state, then load the saved one back
  await page.fill('#axiom', 'FF');
  await waitSeg('16'); // FF at 3 iters → 2·2^3 = 16
  await saved.first().locator('button.load').click();
  await page.waitForFunction(() => document.querySelector('#axiom')?.value === 'F', null, { timeout: 5000 });
  assert((await page.inputValue('#axiom')) === 'F', 'loading a saved design restores its axiom');
  assert((await page.inputValue('#iterations')) === '3', 'loading a saved design restores its iterations');

  // ── 6. Robustness: empty axiom yields zero segments, no crash ──
  await page.fill('#axiom', '');
  await waitSeg('0');
  assert((await seg()) === '0', 'empty axiom → 0 segments (no crash)');

  // ── 7. Robustness: an explosive config is capped (warning shown), not hung ──
  await page.click('.preset[data-preset="plant"]');
  await page.fill('#iterations', '12');
  await page.waitForFunction(() => document.querySelector('#warn')?.classList.contains('show'), null, { timeout: 15000 });
  assert(await page.locator('#warn').evaluate((el) => el.classList.contains('show')), 'explosive iteration count surfaces a cap warning');

  // ── 8. Export SVG builds a real vector document from the current geometry ──
  await page.click('.preset[data-preset="koch-snowflake"]');
  await waitSeg('768');
  await page.click('#export-svg');
  await page.waitForFunction(() => Number(document.querySelector('#export-svg')?.dataset.bytes || 0) > 200, null, { timeout: 5000 });
  const bytes = Number(await page.getAttribute('#export-svg', 'data-bytes'));
  assert(bytes > 200, `SVG export produced a non-trivial document (${bytes} bytes)`);

  // ── settle on a cinematic Fractal Plant for the card thumbnail ──
  await page.click('.preset[data-preset="plant"]');
  await waitSeg('1488'); // plant defaults to 5 iterations → 1488 draw moves
  await page.waitForFunction(() => !document.querySelector('#warn')?.classList.contains('show'), null, { timeout: 5000 });
  await page.waitForFunction(() => Number(document.querySelector('#stat-ms')?.textContent || -1) >= 0, null, { timeout: 5000 });
  await screenshot('thumb.png');
}
