// Integration test for 时区会议规划器.
// Drives the real Intl-based timezone engine through the browser and asserts
// concrete converted times. Uses fixed-offset zones (Asia/Shanghai +8,
// Asia/Kolkata +5:30, UTC) + a pinned reference date so every assertion is
// deterministic regardless of when/where the test runs. Ends with thumb.png.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#home-tz');

  const add = async (tz, query) => {
    await page.fill('#city-search', query);
    await page.waitForSelector(`.city-opt[data-tz="${tz}"]:not([disabled])`, { timeout: 3000 });
    await page.click(`.city-opt[data-tz="${tz}"]`);
    await page.waitForTimeout(60);
  };
  const selectHour = async (h) => {
    await page.click(`.r-cell[data-hour="${h}"]`);
    await page.waitForTimeout(60);
  };
  const sTime = (tz) => page.locator(`.sum-row[data-tz="${tz}"] .s-time`).textContent();

  // Pin work window + reference day, then build a deterministic zone set.
  await page.selectOption('#work-start', '9');
  await page.selectOption('#work-end', '18');
  await page.fill('#ref-date', '2026-06-25');
  await page.dispatchEvent('#ref-date', 'change');
  await page.click('#clear-zones');
  await page.waitForTimeout(50);

  await add('Asia/Shanghai', 'Shanghai');
  await add('UTC', 'UTC');
  await add('Asia/Kolkata', 'Kolkata');
  await page.selectOption('#home-tz', 'Asia/Shanghai');
  await page.waitForTimeout(80);

  assert((await page.locator('.tz-row').count()) === 3, 'exactly the 3 added zones are shown');
  assert((await page.locator('.tz-row.is-home[data-tz="Asia/Shanghai"]').count()) === 1, 'Shanghai is marked as home/base row');

  // --- 14:00 base (Shanghai) → UTC 06:00, Kolkata 11:30 (fixed offsets) ---
  await selectHour(14);
  assert((await sTime('Asia/Shanghai')) === '14:00', `Shanghai base shows 14:00 (got ${await sTime('Asia/Shanghai')})`);
  assert((await sTime('UTC')) === '06:00', `UTC = base 14:00 − 8h = 06:00 (got ${await sTime('UTC')})`);
  assert((await sTime('Asia/Kolkata')) === '11:30', `Kolkata = UTC 06:00 + 5:30 = 11:30 (got ${await sTime('Asia/Kolkata')})`);

  const when = (await page.locator('#sel-when').textContent()) || '';
  assert(/2026-06-25/.test(when) && /14:00/.test(when), `selected-when header reflects date + time (got "${when.trim()}")`);

  // --- 09:00 base → UTC 01:00, Kolkata 06:30 ---
  await selectHour(9);
  assert((await sTime('Asia/Shanghai')) === '09:00', 'Shanghai base shows 09:00');
  assert((await sTime('UTC')) === '01:00', `UTC = 09:00 − 8h = 01:00 (got ${await sTime('UTC')})`);
  assert((await sTime('Asia/Kolkata')) === '06:30', `Kolkata = 01:00 + 5:30 = 06:30 (got ${await sTime('Asia/Kolkata')})`);

  // --- working-hours overlap marker ---
  // With these 3 zones + 09–18 window, the ONLY all-working base hour is 17:00
  // (Shanghai 17, UTC 09, Kolkata 14:30 — all inside the window).
  const cls17 = (await page.locator('.r-cell[data-hour="17"]').getAttribute('class')) || '';
  assert(/\bgood\b/.test(cls17), `17:00 base is flagged as all-working overlap (class="${cls17}")`);
  const cls9 = (await page.locator('.r-cell[data-hour="9"]').getAttribute('class')) || '';
  assert(!/\bgood\b/.test(cls9), `09:00 base is NOT an all-working overlap (UTC would be 01:00) (class="${cls9}")`);
  assert((await page.locator('.r-cell.good').count()) === 1, 'exactly one overlap column for this trio');

  // --- day-cross indicator ---
  // Base Shanghai 06:00 → UTC 22:00 of the PREVIOUS day.
  await selectHour(6);
  const utcCross = (await page.locator('.sum-row[data-tz="UTC"] .daycross').textContent().catch(() => '')) || '';
  assert(/前一天/.test(utcCross), `UTC shows previous-day badge at base 06:00 (got "${utcCross}")`);
  assert((await page.locator('.sum-row[data-tz="Asia/Shanghai"] .daycross').count()) === 0, 'home row never shows a day-cross badge');

  // --- 12h / 24h formatting ---
  await selectHour(14);
  await page.click('#fmt-toggle button[data-fmt="12"]');
  await page.waitForTimeout(60);
  assert(/PM/.test(await sTime('Asia/Shanghai')), `12h mode renders 14:00 as 2:00 PM (got ${await sTime('Asia/Shanghai')})`);
  await page.click('#fmt-toggle button[data-fmt="24"]');
  await page.waitForTimeout(60);
  assert((await sTime('Asia/Shanghai')) === '14:00', '24h mode restores 14:00');

  // --- remove a zone ---
  await page.click('.tz-row[data-tz="UTC"] .remove-zone');
  await page.waitForTimeout(60);
  assert((await page.locator('.tz-row').count()) === 2, 'removing a zone drops the row');
  assert((await page.locator('.sum-row[data-tz="UTC"]').count()) === 0, 'removed zone leaves the summary');

  // --- dedupe: adding an existing zone does not duplicate ---
  await add('Asia/Kolkata', 'Kolkata').catch(() => {}); // option is disabled when present
  assert((await page.locator('.tz-row[data-tz="Asia/Kolkata"]').count()) === 1, 'no duplicate rows for an already-added zone');

  // --- compose an attractive multi-zone state for the card thumbnail ---
  await page.click('#clear-zones');
  await page.waitForTimeout(40);
  for (const [tz, q] of [
    ['America/Los_Angeles', 'Los_Angeles'], ['America/New_York', 'New_York'],
    ['Europe/London', 'London'], ['Europe/Berlin', 'Berlin'],
    ['Asia/Shanghai', 'Shanghai'], ['Asia/Tokyo', 'Tokyo'], ['Australia/Sydney', 'Sydney'],
  ]) await add(tz, q);
  await page.selectOption('#home-tz', 'Europe/London');
  await page.waitForTimeout(60);
  await selectHour(15); // 15:00 London — a nice cross-continent band
  await page.waitForTimeout(1900); // let the "added" toast fade for a clean card
  await screenshot('thumb.png');
}
