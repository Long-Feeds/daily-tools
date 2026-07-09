// Integration test for 算式本 · Calc Notepad.
// Drives the real tokenizer→parser→evaluator through the browser and asserts
// concrete computed outputs (not mere element presence). Captures thumb.png.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#editor');

  const results = page.locator('#results .rline');

  // Type a whole document, then wait until the given result row settles to the
  // expected substring before asserting — avoids reading a mid-render stale value.
  async function fill(doc) {
    await page.fill('#editor', doc);
  }
  async function lineText(i) { return (await results.nth(i).textContent()) || ''; }
  async function expectLine(doc, i, needle, label) {
    await fill(doc);
    await page.waitForFunction(
      ({ i, needle }) => {
        const r = document.querySelectorAll('#results .rline');
        return r[i] && r[i].textContent.includes(needle);
      },
      { i, needle },
      { timeout: 4000 }
    ).catch(() => {});
    const txt = await lineText(i);
    assert(txt.includes(needle), `${label || doc} — line ${i} should contain "${needle}" (got "${txt.trim()}")`);
  }

  // ---- arithmetic & precedence ----
  await expectLine('2 + 3 * 4', 0, '14', 'precedence');
  await expectLine('(2 + 3) * 4', 0, '20', 'parentheses');
  await expectLine('2 ^ 10', 0, '1,024', 'power + thousands separator');
  await expectLine('17 mod 5', 0, '2', 'modulo');
  await expectLine('10 / 4', 0, '2.5', 'division');

  // ---- percentages ----
  await expectLine('20% of 300', 0, '60', 'percent-of');
  await expectLine('300 + 20%', 0, '360', 'add percent');
  await expectLine('300 - 15%', 0, '255', 'subtract percent');
  await expectLine('25% off 80', 0, '60', 'percent off');
  await expectLine('50 as % of 200', 0, '25%', 'as percent of');

  // ---- unit conversion (real dimensional engine) ----
  await expectLine('5 km in miles', 0, 'mi', 'km→mi unit');
  await expectLine('5 km in miles', 0, '3.1', 'km→mi value');
  await expectLine('100 kg in lb', 0, '220', 'kg→lb value');       // 220.46
  await expectLine('100 F in C', 0, '37', 'F→C value');            // 37.78
  await expectLine('100 F in C', 0, '°C', 'F→C symbol');
  await expectLine('3 ft + 2 m', 0, 'ft', 'mixed-unit add keeps left unit');
  await expectLine('1 GB in MB', 0, '1,024', 'data 1024-base');

  // ---- variables, including a Chinese (unicode) variable name ----
  await expectLine('price = 20\nprice * 3', 1, '60', 'ascii variable');
  await expectLine('时薪 = 45\n时薪 * 8', 1, '360', 'unicode variable');

  // ---- functions & constants ----
  await expectLine('sqrt(16)', 0, '4', 'sqrt');
  await expectLine('min(3, 9, 5)', 0, '3', 'min');
  await expectLine('round(3.14159, 2)', 0, '3.14', 'round to 2 dp');

  // ---- prev + running sum with section reset ----
  await expectLine('8\nprev * 5', 1, '40', 'prev reference');
  await expectLine('10\n20\n30\nsum', 3, '60', 'section sum');
  // sum stays per-section: second section restarts after the blank line
  await expectLine('10\n20\nsum\n\n5\n7\nsum', 6, '12', 'sum resets at blank line');

  // ---- grand-total footer excludes explicit sum lines (no double count) ----
  await fill('10\n20\n30\nsum');
  await page.waitForFunction(() => {
    const g = document.getElementById('grand-total');
    return g && g.textContent.trim() === '60';
  }, null, { timeout: 4000 }).catch(() => {});
  assert(((await page.locator('#grand-total').textContent()) || '').trim() === '60',
    `grand total is 60, not double-counted (got "${(await page.locator('#grand-total').textContent() || '').trim()}")`);

  // ---- variable chip surfaces in the footer ----
  await fill('预算 = 500');
  await page.waitForFunction(() => {
    const v = document.querySelector('#vars .vchip');
    return v && /500/.test(v.textContent);
  }, null, { timeout: 4000 }).catch(() => {});
  assert((await page.locator('#vars .vchip').count()) >= 1, 'a variable chip is shown');

  // ---- graceful errors, never a crash ----
  await expectLine('5 / 0', 0, '#DIV/0!', 'division by zero shows spreadsheet error');
  await expectLine('5 +', 0, '#', 'incomplete expression shows an error code');
  // a prose note (no math signal) stays silent — no error code
  await fill('这是一句普通的笔记');
  await page.waitForFunction(() => {
    const r = document.querySelectorAll('#results .rline');
    return r.length === 1;
  }, null, { timeout: 4000 }).catch(() => {});
  const noteTxt = (await lineText(0)).trim();
  assert(!noteTxt.includes('#') && noteTxt.length === 0, `prose note produces no result/error (got "${noteTxt}")`);

  // ---- example button populates and computes ----
  await page.click('#btn-example');
  await page.waitForFunction(() => {
    const r = [...document.querySelectorAll('#results .rline')].map(e => e.textContent);
    return r.some(t => t.includes('2,987'));
  }, null, { timeout: 4000 });
  assert(((await page.locator('#editor').inputValue())).includes('差旅预算'), 'example doc loaded into editor');

  // ---- theme toggle flips the document theme ----
  await page.click('#theme-toggle');
  const themed = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  assert(themed === 'light' || themed === 'dark', `theme toggle sets data-theme (got "${themed}")`);

  // ---- persistence across reload (localStorage) ----
  await fill('# persist-check\n6 * 7');
  await page.waitForFunction(() => {
    const s = localStorage.getItem('calc-notepad:doc:v1');
    return s && s.includes('persist-check');
  }, null, { timeout: 4000 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#editor');
  assert((await page.locator('#editor').inputValue()).includes('persist-check'), 'document persisted across reload');
  await page.waitForFunction(() => {
    const r = document.querySelectorAll('#results .rline');
    return r[1] && r[1].textContent.includes('42');
  }, null, { timeout: 4000 });
  assert((await lineText(1)).includes('42'), 'persisted document recomputes correctly after reload');

  // ---- settle on a nice populated state for the card thumbnail ----
  await page.click('#btn-example');
  await page.waitForFunction(() => {
    const r = [...document.querySelectorAll('#results .rline')].map(e => e.textContent);
    return r.some(t => t.includes('2,987'));
  }, null, { timeout: 4000 });
  // light theme reads better as a thumbnail
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await screenshot('thumb.png');
}
