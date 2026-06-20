// Integration test for Cron 透镜.
// Exercises the real parser + next-run engine through the browser and asserts
// concrete outputs. Captures thumb.png used as the homepage card thumbnail.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#expr');
  // pin timezone so next-run assertions are deterministic
  await page.selectOption('#tz', 'Asia/Singapore');

  const setExpr = async (v) => {
    await page.fill('#expr', v);
    await page.waitForTimeout(120);
  };
  const runs = () => page.locator('#next-runs li');

  // --- daily at 09:00 ---
  await setExpr('0 9 * * *');
  const summary = (await page.locator('#summary').textContent()) || '';
  assert(/9|09/.test(summary), `summary mentions 9 o'clock (got: "${summary.trim()}")`);
  assert((await runs().count()) >= 1, 'next-run list is non-empty for "0 9 * * *"');
  const first = (await runs().first().textContent()) || '';
  assert(/09:00/.test(first), `first next-run is at 09:00 (got: "${first.trim()}")`);

  // --- every 15 minutes ---
  await setExpr('*/15 * * * *');
  const fifteens = await runs().allTextContents();
  assert(fifteens.length >= 2, `at least 2 next-runs for "*/15" (got ${fifteens.length})`);
  const mins = fifteens.map((t) => { const m = t.match(/\d{2}:(\d{2})/); return m ? Number(m[1]) : -1; });
  assert(mins.every((m) => m >= 0 && m % 15 === 0), `*/15 minutes are multiples of 15 (got ${mins.join(',')})`);

  // --- weekdays 8:30 (range + DOW) ---
  await setExpr('30 8 * * 1-5');
  const wd = (await runs().first().textContent()) || '';
  assert(/08:30/.test(wd), `weekday rule first run at 08:30 (got "${wd.trim()}")`);
  assert(!/周六|周日/.test(wd), `weekday rule does not fire on weekend (got "${wd.trim()}")`);

  // --- monthly on the 1st ---
  await setExpr('0 0 1 * *');
  const monthly = (await runs().first().textContent()) || '';
  assert(/-01 /.test(monthly), `monthly first run is on day 01 (got "${monthly.trim()}")`);

  // --- @daily macro expands ---
  await setExpr('@daily');
  assert((await runs().count()) >= 1, '@daily macro produces runs');
  assert(/00:00/.test((await runs().first().textContent()) || ''), '@daily fires at 00:00');

  // --- invalid expressions surface an error and clear results ---
  await setExpr('99 * * * *');
  let err = (await page.locator('#error').textContent()) || '';
  assert(err.trim().length > 0, 'out-of-range minute shows an error');
  assert((await runs().count()) === 0, 'invalid expression clears the run list');

  await setExpr('* * * *'); // only 4 fields
  err = (await page.locator('#error').textContent()) || '';
  assert(/5|五/.test(err), `wrong field count is reported (got "${err.trim()}")`);

  // --- preset buttons work ---
  await setExpr('0 9 * * *');
  const preset = page.locator('.preset').first();
  assert((await preset.count()) >= 1, 'preset buttons exist');
  await preset.click();
  await page.waitForTimeout(100);
  assert((await runs().count()) >= 1, 'clicking a preset still yields runs');

  // settle on a nice state for the thumbnail
  await setExpr('30 8 * * 1-5');
  await screenshot('thumb.png');
}
