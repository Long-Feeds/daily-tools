// Integration test for 公式表格 · Formula Sheet.
// Drives the real formula engine + interactive grid through the browser and
// asserts concrete computed outputs (not mere element presence). Captures thumb.png.

export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#sheet-body td[data-ref]');
  await page.waitForFunction(() => !!window.__sheet);

  const getVal = (ref) => page.evaluate((r) => window.__sheet.getValue(r), ref);
  const getRaw = (ref) => page.evaluate((r) => window.__sheet.getRaw(r), ref);
  const getSel = () => page.evaluate(() => window.__sheet.getSelected());
  const isErr = (ref) => page.evaluate((r) => window.__sheet.isError(r), ref);
  const setC = (ref, raw) => page.evaluate(([r, v]) => window.__sheet.setCell(r, v), [ref, String(raw)]);
  const setMany = (o) => page.evaluate((obj) => { for (const k in obj) window.__sheet.setCell(k, String(obj[k])); }, o);
  const clearAll = () => page.evaluate(() => window.__sheet.clearAll());
  const tdClass = (ref, cls) => page.locator(`td[data-ref="${ref}"]`).evaluate((el, c) => el.classList.contains(c), cls);

  // ---- 1. literals + arithmetic + operator precedence + parentheses ----
  await clearAll();
  await setMany({ A1: '2', B1: '3' });
  assert((await getVal('A1')) === '2', `literal number A1=2 (got ${await getVal('A1')})`);
  assert(await tdClass('A1', 'num'), 'numeric literal is right-aligned (class num)');
  await setMany({ C1: '=A1+B1', D1: '=A1+B1*2', E1: '=(A1+B1)*2', F1: '=A1^B1', G1: '=B1-A1*2' });
  assert((await getVal('C1')) === '5', `=A1+B1 → 5 (got ${await getVal('C1')})`);
  assert((await getVal('D1')) === '8', `precedence =A1+B1*2 → 8 (got ${await getVal('D1')})`);
  assert((await getVal('E1')) === '10', `parens =(A1+B1)*2 → 10 (got ${await getVal('E1')})`);
  assert((await getVal('F1')) === '8', `power =A1^B1 → 8 (got ${await getVal('F1')})`);
  assert((await getVal('G1')) === '-1', `=B1-A1*2 → -1 (got ${await getVal('G1')})`);

  // ---- 2. dependency graph recalculation: change one input, dependents update ----
  await setC('A1', '10');
  assert((await getVal('C1')) === '13', `changing A1→10 recalculates C1 to 13 (got ${await getVal('C1')})`);
  assert((await getVal('D1')) === '16', `D1 recalculates to 16 (got ${await getVal('D1')})`);
  assert((await getVal('E1')) === '26', `E1 recalculates to 26 (got ${await getVal('E1')})`);

  // ---- 3. range aggregate functions ----
  await clearAll();
  await setMany({ A1: '2', A2: '4', A3: '6' });
  await setMany({ B1: '=SUM(A1:A3)', B2: '=AVERAGE(A1:A3)', B3: '=MAX(A1:A3)', B4: '=MIN(A1:A3)', B5: '=COUNT(A1:A3)', B6: '=PRODUCT(A1:A3)' });
  assert((await getVal('B1')) === '12', `SUM(A1:A3) → 12 (got ${await getVal('B1')})`);
  assert((await getVal('B2')) === '4', `AVERAGE(A1:A3) → 4 (got ${await getVal('B2')})`);
  assert((await getVal('B3')) === '6', `MAX(A1:A3) → 6 (got ${await getVal('B3')})`);
  assert((await getVal('B4')) === '2', `MIN(A1:A3) → 2 (got ${await getVal('B4')})`);
  assert((await getVal('B5')) === '3', `COUNT(A1:A3) → 3 (got ${await getVal('B5')})`);
  assert((await getVal('B6')) === '48', `PRODUCT(A1:A3) → 48 (got ${await getVal('B6')})`);

  // ---- 4. IF + comparison operators ----
  await setMany({ C1: '=IF(A1>1,"yes","no")', C2: '=IF(A1>5,"yes","no")', C3: '=A3>=A2' });
  assert((await getVal('C1')) === 'yes', `IF true branch (A1=2>1) → yes (got ${await getVal('C1')})`);
  assert((await getVal('C2')) === 'no', `IF false branch (A1=2>5) → no (got ${await getVal('C2')})`);
  assert((await getVal('C3')) === '1', `comparison A3>=A2 (6>=4) → 1 (got ${await getVal('C3')})`);

  // ---- 5. text values + string concat / functions ----
  await clearAll();
  await setC('A1', 'Hello');
  assert((await getVal('A1')) === 'Hello', 'text literal kept verbatim');
  assert(await tdClass('A1', 'text'), 'text value is left-aligned (class text)');
  await setMany({ A2: '=A1&" world"', A3: '=CONCAT(A1,"!",3)', A4: '=LEN(A1)' });
  assert((await getVal('A2')) === 'Hello world', `& concat → "Hello world" (got "${await getVal('A2')}")`);
  assert((await getVal('A3')) === 'Hello!3', `CONCAT mixes text+number → "Hello!3" (got "${await getVal('A3')}")`);
  assert((await getVal('A4')) === '5', `LEN("Hello") → 5 (got ${await getVal('A4')})`);

  // ---- 6. error values + propagation along the dependency chain ----
  await clearAll();
  await setMany({ A1: '=1/0', A2: '=FOO(1)', A3: '=A1+1', A4: '=1+' });
  assert((await getVal('A1')) === '#DIV/0!' && (await isErr('A1')), `division by zero → #DIV/0! (got ${await getVal('A1')})`);
  assert((await getVal('A2')) === '#NAME?', `unknown function → #NAME? (got ${await getVal('A2')})`);
  assert((await getVal('A3')) === '#DIV/0!' && (await isErr('A3')), `error propagates: =A1+1 → #DIV/0! (got ${await getVal('A3')})`);
  assert((await getVal('A4')) === '#ERROR!', `syntax error =1+ → #ERROR! (got ${await getVal('A4')})`);

  // ---- 7. circular reference detection ----
  await clearAll();
  await setMany({ A1: '=B1', B1: '=A1' });
  assert((await getVal('A1')) === '#CYCLE!' && (await isErr('A1')), `cycle A1↔B1 flags A1 #CYCLE! (got ${await getVal('A1')})`);
  assert((await getVal('B1')) === '#CYCLE!', `the other side B1 is also #CYCLE! (got ${await getVal('B1')})`);

  // ---- 8. number formatting (decimals + integers) ----
  await clearAll();
  await setMany({ A1: '=1/4', A2: '=1/3', A3: '=10/2' });
  assert((await getVal('A1')) === '0.25', `1/4 → 0.25 (got ${await getVal('A1')})`);
  assert((await getVal('A2')) === '0.3333333333', `1/3 → trimmed 0.3333333333 (got ${await getVal('A2')})`);
  assert((await getVal('A3')) === '5', `10/2 → integer 5, no trailing dot (got ${await getVal('A3')})`);

  // ---- 9. formula bar entry through the real UI ----
  await clearAll();
  await setMany({ A1: '2', B1: '3' });
  await page.locator('td[data-ref="C1"]').click();
  await page.waitForTimeout(20);
  assert(((await page.locator('#cell-name').textContent()) || '').trim() === 'C1', 'clicking C1 puts it in the cell-name box');
  await page.fill('#formula-input', '=A1+B1');
  await page.locator('#formula-input').press('Enter');
  await page.waitForTimeout(20);
  assert((await getVal('C1')) === '5', `formula typed in the formula bar computes (got ${await getVal('C1')})`);
  assert(await tdClass('C1', 'hasf'), 'a formula cell shows the corner marker (class hasf)');
  assert((await getSel()) === 'C2', `Enter in the formula bar moves the selection down to C2 (got ${await getSel()})`);

  // ---- 10. keyboard: edit + navigation + delete ----
  await clearAll();
  await page.locator('td[data-ref="A1"]').click();
  await page.waitForTimeout(30);
  await page.keyboard.press('F2');
  await page.keyboard.type('7');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(20);
  assert((await getVal('A1')) === '7', `F2→type 7→Enter writes A1=7 (got ${await getVal('A1')})`);
  assert((await getSel()) === 'A2', `Enter commits and moves down to A2 (got ${await getSel()})`);
  await page.keyboard.press('ArrowRight'); // B2
  await page.keyboard.press('ArrowUp');    // B1
  assert((await getSel()) === 'B1', `arrow keys navigate to B1 (got ${await getSel()})`);
  await page.keyboard.press('ArrowLeft');  // A1
  await page.keyboard.press('Delete');
  await page.waitForTimeout(20);
  assert((await getVal('A1')) === '', `Delete clears the cell (got "${await getVal('A1')}")`);

  // ---- 11. built-in sample datasets compute real totals ----
  await page.evaluate(() => window.__sheet.loadSample('budget'));
  assert((await getVal('B7')) === '4500', `budget 结余 =SUM(B3:B6) → 4500 (got ${await getVal('B7')})`);
  assert((await getVal('F3')) === '75' && (await getVal('F4')) === '60', 'budget line subtotals 3*25=75, 5*12=60');
  assert((await getVal('F5')) === '135', `budget 合计 =SUM(F3:F4) → 135 (got ${await getVal('F5')})`);

  await page.evaluate(() => window.__sheet.loadSample('grades'));
  assert((await getVal('D2')) === '90', `grades avg(88,92) → 90 (got ${await getVal('D2')})`);
  assert((await getVal('E2')) === '及格', `grades IF pass → 及格 (got ${await getVal('E2')})`);
  assert((await getVal('E4')) === '补考', `grades IF fail (avg 47.5) → 补考 (got ${await getVal('E4')})`);
  assert((await getVal('B6')) === '69.7', `grades class average rounds to 69.7 (got ${await getVal('B6')})`);

  // ---- 12. persistence across reload ----
  await clearAll();
  await setC('A1', '=6*7');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#sheet-body td[data-ref]');
  await page.waitForFunction(() => !!window.__sheet);
  assert((await getVal('A1')) === '42', `after reload the value persists (=6*7 → 42, got ${await getVal('A1')})`);
  assert((await getRaw('A1')) === '=6*7', `the raw formula persists across reload (got "${await getRaw('A1')}")`);

  // ---- thumbnail: a populated budget sheet with the 结余 formula selected ----
  await page.evaluate(() => window.__sheet.loadSample('budget'));
  await page.evaluate(() => window.__sheet.select('B7'));
  await page.waitForTimeout(60);
  await screenshot('thumb.png');
}
