// Integration test for 函数绘图 · Grapher.
// Drives the real tokenizer→parser→evaluator through the browser and asserts
// concrete computed outputs via the Trace readout, exercises parameter sliders,
// implicit multiplication, domain errors, add/delete, zoom, and examples.
// Uses waitForFunction polling (never waitForTimeout-then-assert on live values).
// Captures thumb.png used as the homepage card thumbnail.

export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#fn-list .fn-row');

  const fnInput = (i) => page.locator('.fn-input').nth(i);
  const setFn = async (i, v) => { await fnInput(i).fill(v); };
  const setTrace = async (v) => { await page.fill('#trace-x', String(v)); };

  // Poll the Trace readout until fn `i` reports exactly `expected` (data-val).
  const expectTrace = async (i, expected, label) => {
    await page.waitForFunction(
      (args) => {
        const el = document.querySelector('.trace-row[data-fn="' + args.i + '"] .trace-val');
        return el && el.getAttribute('data-val') === args.e;
      },
      { i, e: expected },
      { timeout: 4000 }
    ).catch(async () => {
      const el = page.locator('.trace-row[data-fn="' + i + '"] .trace-val');
      const got = (await el.count()) ? await el.getAttribute('data-val') : '(no row)';
      throw new Error(`Assertion failed: ${label} — expected y${i}=${expected}, got ${got}`);
    });
  };

  // --- 1. basic power: x^2 at x=3 => 9 ---
  await setFn(0, 'x^2');
  await setTrace(3);
  await expectTrace(0, '9', 'x^2 at 3');

  // --- 2. implicit multiplication: 2x at x=5 => 10 ---
  await setFn(0, '2x');
  await setTrace(5);
  await expectTrace(0, '10', 'implicit-mult 2x at 5');

  // --- 3. named function + domain error: sqrt(x) ---
  await setFn(0, 'sqrt(x)');
  await setTrace(16);
  await expectTrace(0, '4', 'sqrt(16)');
  await setTrace(-1);
  await expectTrace(0, 'NaN', 'sqrt(-1) is undefined');

  // --- 4. trig with pi constant: cos(pi) => -1 ---
  await setFn(0, 'cos(pi x)');
  await setTrace(1);
  await expectTrace(0, '-1', 'cos(pi*1)');

  // --- 5. parameter slider: a*x. slider appears; set a=3; a*x at x=4 => 12 ---
  await setFn(0, 'a x');
  await page.waitForSelector('.param-num[data-name="a"]', { timeout: 3000 });
  assert((await page.locator('#param-section').isVisible()), 'parameter section becomes visible for free variable a');
  await page.fill('.param-num[data-name="a"]', '3');
  await setTrace(4);
  await expectTrace(0, '12', 'a*x with a=3 at x=4');

  // moving the range slider updates the value live (a=-2 => a*x at 4 => -8)
  await page.locator('.param-range[data-name="a"]').fill('-2');
  await expectTrace(0, '-8', 'slider a=-2 -> a*x at 4');

  // --- 6. invalid expression surfaces an error without crashing ---
  await setFn(0, 'sin(');
  await page.waitForFunction(() => {
    const row = document.querySelector('#fn-list .fn-row');
    const err = document.querySelector('#fn-list .fn-err');
    return row && row.classList.contains('invalid') && err && err.textContent.trim().length > 0;
  }, undefined, { timeout: 3000 });
  // recovers cleanly
  await setFn(0, 'x^3');
  await setTrace(2);
  await expectTrace(0, '8', 'recovers after invalid input (x^3 at 2)');

  // --- 7. add / delete functions ---
  const rowCount = () => page.locator('#fn-list .fn-row').count();
  const before = await rowCount();
  await page.click('#add-fn');
  await page.waitForFunction((n) => document.querySelectorAll('#fn-list .fn-row').length === n + 1, before, { timeout: 3000 });
  assert((await rowCount()) === before + 1, 'adding a function adds a row');
  await page.locator('#fn-list .fn-row').last().locator('.del').click();
  await page.waitForFunction((n) => document.querySelectorAll('#fn-list .fn-row').length === n, before, { timeout: 3000 });
  assert((await rowCount()) === before, 'deleting a function removes the row');

  // --- 8. zoom shrinks the visible x-span ---
  await page.click('#view-reset');
  await page.waitForFunction(() => {
    const e = document.getElementById('view-info');
    return e && Math.abs(parseFloat(e.getAttribute('data-xspan')) - 20) < 6;
  }, undefined, { timeout: 3000 });
  const span1 = parseFloat(await page.getAttribute('#view-info', 'data-xspan'));
  await page.click('#zoom-in');
  await page.waitForFunction((prev) => {
    const e = document.getElementById('view-info');
    return e && parseFloat(e.getAttribute('data-xspan')) < prev - 0.001;
  }, span1, { timeout: 3000 });
  const span2 = parseFloat(await page.getAttribute('#view-info', 'data-xspan'));
  assert(span2 < span1, `zoom-in shrinks x-span (${span2.toFixed(3)} < ${span1.toFixed(3)})`);

  // --- 9. example chips load a preset function set ---
  await page.locator('.example-chip', { hasText: '三角' }).click();
  await page.waitForFunction(() => {
    const inp = document.querySelector('.fn-input');
    return inp && inp.value.replace(/\s/g, '') === 'sin(x)';
  }, undefined, { timeout: 3000 });
  assert((await fnInput(0).inputValue()).replace(/\s/g, '') === 'sin(x)', 'example loads sin(x) as first function');
  assert((await rowCount()) === 2, '三角 example yields two functions (sin, cos)');

  // --- 10. canvas actually paints (grid + axes + curves) ---
  await page.waitForFunction(() => document.getElementById('plot').width > 0, undefined, { timeout: 3000 });
  const painted = await page.evaluate(() => {
    const c = document.getElementById('plot');
    const g = c.getContext('2d');
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) { if (d[i] > 20 || d[i + 1] > 20 || d[i + 2] > 20) n++; }
    return n;
  });
  assert(painted > 500, `canvas has painted pixels (got ${painted})`);

  // --- settle on a beautiful state for the thumbnail ---
  await setFn(0, 'e^(-abs(x)/4) sin(5x)');
  await page.click('#add-fn');
  await setFn(1, 'x^2/12 - 4');
  await setTrace(2);
  await page.click('#view-reset');
  await page.waitForFunction(() => {
    const rows = document.querySelectorAll('.trace-row[data-fn]');
    return rows.length >= 2;
  }, undefined, { timeout: 3000 });
  await screenshot('thumb.png');
}
