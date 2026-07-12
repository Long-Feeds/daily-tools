// Integration test for 关键路径 · Critical Path.
// Drives the real CPM engine through the browser: loads a known project, asserts
// the computed forward/backward-pass schedule (ES/EF/LS/LF/float), the critical
// path, reactive recompute on edit, and cycle detection. Captures thumb.png.
//
// Canonical sample (durations / deps):
//   A:3 []   B:4 []   C:2 [A]   D:5 [A]   E:1 [B,C]   F:2 [D,E]
// => project duration 10, critical path A→D→F, floats B=3 C=2 E=2.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#load-sample');

  // Force the known project regardless of any seeded state.
  await page.click('#load-sample');
  await page.waitForFunction(() => document.querySelectorAll('#task-body tr[data-tid]').length === 6);

  const cellText = (tid, cls) =>
    page.locator(`tr[data-tid="${tid}"] .${cls}`).textContent().then((t) => (t || '').trim());

  // wait until a computed cell converges to an expected value, then assert.
  async function expectCell(tid, cls, val) {
    await page.waitForFunction(
      ({ tid, cls, val }) => {
        const el = document.querySelector(`tr[data-tid="${tid}"] .${cls}`);
        return el && el.textContent.trim() === String(val);
      },
      { tid, cls, val },
      { timeout: 5000 }
    ).catch(() => {});
    assert((await cellText(tid, cls)) === String(val), `${tid}.${cls} should be ${val} (got "${await cellText(tid, cls)}")`);
  }
  const isCritical = (tid) =>
    page.locator(`tr[data-tid="${tid}"]`).evaluate((el) => el.classList.contains('is-critical'));
  async function expectCritical(tid, want) {
    await page.waitForFunction(
      ({ tid, want }) => {
        const el = document.querySelector(`tr[data-tid="${tid}"]`);
        return el && el.classList.contains('is-critical') === want;
      },
      { tid, want },
      { timeout: 5000 }
    ).catch(() => {});
    assert((await isCritical(tid)) === want, `${tid} critical should be ${want}`);
  }
  const total = () => page.locator('#total-duration').textContent().then((t) => parseInt(t || '', 10));

  // ---- forward pass (earliest start / finish) ----
  await expectCell('A', 'cell-es', 0);
  await expectCell('A', 'cell-ef', 3);
  await expectCell('C', 'cell-es', 3);
  await expectCell('D', 'cell-ef', 8);
  await expectCell('E', 'cell-es', 5); // max(EF B=4, EF C=5)
  await expectCell('E', 'cell-ef', 6);
  await expectCell('F', 'cell-ef', 10);

  // ---- backward pass + float (total slack) ----
  await expectCell('B', 'cell-float', 3);
  await expectCell('C', 'cell-float', 2);
  await expectCell('E', 'cell-float', 2);
  await expectCell('A', 'cell-float', 0);
  await expectCell('F', 'cell-float', 0);

  // ---- project duration + critical set ----
  assert((await total()) === 10, `project duration should be 10 (got ${await total()})`);
  assert((await page.locator('#crit-count').textContent()).trim() === '3', 'exactly 3 critical tasks');
  for (const t of ['A', 'D', 'F']) await expectCritical(t, true);
  for (const t of ['B', 'C', 'E']) await expectCritical(t, false);

  // ---- critical path trace ----
  const cp = ((await page.locator('#crit-path').textContent()) || '').replace(/\s/g, '');
  assert(cp.includes('A→D→F'), `critical path should be A→D→F (got "${cp}")`);

  // ---- gantt reflects the schedule ----
  assert((await page.locator('#gantt .grow').count()) === 6, 'gantt has 6 task rows');
  assert((await page.locator('#gantt .gbar.crit').count()) === 3, 'gantt has 3 critical bars');

  // ---- add + delete a task (structural, revisitable state) ----
  await page.click('#add-task');
  await page.waitForFunction(() => document.querySelectorAll('#task-body tr[data-tid]').length === 7);
  await page.click('tr[data-tid="G"] .f-del');
  await page.waitForFunction(() => document.querySelectorAll('#task-body tr[data-tid]').length === 6);

  // ---- reactive recompute: lengthen E from 1 to 5 → critical path shifts A→C→E→F ----
  await page.fill('tr[data-tid="E"] .f-dur', '5');
  await page.waitForFunction(() => parseInt(document.querySelector('#total-duration').textContent, 10) === 12, null, { timeout: 5000 });
  assert((await total()) === 12, `after E=5 the duration should be 12 (got ${await total()})`);
  await expectCritical('E', true);  // E now on the critical path
  await expectCritical('C', true);
  await expectCritical('D', false); // D drops off (gains float)
  await expectCell('D', 'cell-float', 2);

  // ---- cycle detection: make A depend on F (A→…→F→A) ----
  await page.fill('tr[data-tid="A"] .f-deps', 'F');
  await page.waitForFunction(() => {
    const e = document.querySelector('#error');
    return e && e.classList.contains('show') && /循环/.test(e.textContent);
  }, null, { timeout: 5000 });
  assert(await page.locator('#error').evaluate((e) => e.classList.contains('show')), 'cycle raises an error');

  // ---- reset to the clean canonical sample for the thumbnail ----
  await page.click('#load-sample');
  await page.waitForFunction(() => parseInt(document.querySelector('#total-duration').textContent, 10) === 10, null, { timeout: 5000 });
  await page.waitForFunction(() => document.querySelectorAll('#gantt .gbar.crit').length === 3);

  await screenshot('thumb.png');
}
