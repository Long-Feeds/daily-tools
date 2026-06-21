// Integration test for 复利计算器 (Compound Interest Calculator).
// Drives the real UI and asserts concrete, independently-verified outputs:
//   - lump-sum compounding: 1000 @ 10%/yr for 2y  => 1210
//   - zero-rate: contributions only, no interest
//   - monthly annuity 6%/10y (end-of-period)      => 182,073.31
//   - annuity-due (begin) yields strictly more than ordinary (end)
// Reads numeric results from data-raw attributes; checks chart + table render.
// Captures thumb.png used as the homepage card thumbnail.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#final-amount');

  const raw = async (sel) => parseFloat(await page.locator(sel).getAttribute('data-raw'));
  const near = (a, b, tol = 1) => Math.abs(a - b) <= tol;

  async function setInputs({ principal, contribution, rate, years, frequency, currency }) {
    if (currency !== undefined) await page.selectOption('#currency', currency);
    if (frequency !== undefined) await page.selectOption('#frequency', String(frequency));
    if (principal !== undefined) await page.fill('#principal', String(principal));
    if (contribution !== undefined) await page.fill('#contribution', String(contribution));
    if (rate !== undefined) await page.fill('#rate', String(rate));
    if (years !== undefined) await page.fill('#years', String(years));
    await page.waitForTimeout(90);
  }

  // --- 1) lump-sum compounding: 1000 at 10%/yr, yearly, 2 years => 1210 ---
  await setInputs({ principal: 1000, contribution: 0, rate: 10, years: 2, frequency: 1 });
  assert(near(await raw('#final-amount'), 1210, 1), `lump 1000@10%/2y final == 1210 (got ${await raw('#final-amount')})`);
  assert(near(await raw('#total-interest'), 210, 1), `lump interest == 210 (got ${await raw('#total-interest')})`);
  assert(near(await raw('#total-contributed'), 1000, 0.5), `lump contributed == 1000 (got ${await raw('#total-contributed')})`);

  // --- 2) zero rate: final equals contributions, interest is zero ---
  await setInputs({ principal: 10000, contribution: 1000, rate: 0, years: 10, frequency: 12 });
  assert(near(await raw('#total-contributed'), 130000, 0.5), `0% contributed == 130000 (got ${await raw('#total-contributed')})`);
  assert(near(await raw('#final-amount'), 130000, 0.5), `0% final == 130000 (got ${await raw('#final-amount')})`);
  assert(near(await raw('#total-interest'), 0, 0.5), `0% interest == 0 (got ${await raw('#total-interest')})`);

  // --- 3) monthly annuity, end-of-period, 6%/10y => 182,073.31 ---
  await setInputs({ principal: 10000, contribution: 1000, rate: 6, years: 10, frequency: 12 });
  const endVal = await raw('#final-amount');
  assert(near(endVal, 182073.31, 1.5), `6% end final ~= 182073.31 (got ${endVal})`);
  assert(near(await raw('#total-interest'), 52073.31, 1.5), `6% end interest ~= 52073.31 (got ${await raw('#total-interest')})`);
  assert(near(await raw('#total-contributed'), 130000, 0.5), `6% contributed == 130000`);

  // total return % should be interest/contributed = 52073.31/130000 ~= 40.06%
  assert(near(await raw('#total-return'), 40.06, 0.3), `total return ~= 40.06% (got ${await raw('#total-return')})`);

  // --- 4) annuity-due (begin) must exceed ordinary (end) for the same params ---
  await page.click('#timing-begin');
  await page.waitForTimeout(80);
  const beginVal = await raw('#final-amount');
  assert(beginVal > endVal, `begin-of-period > end-of-period (${beginVal} > ${endVal})`);
  assert(near(beginVal, 182892.71, 1.5), `6% begin final ~= 182892.71 (got ${beginVal})`);
  await page.click('#timing-end');
  await page.waitForTimeout(60);

  // --- 5) chart + table cardinality matches the year count ---
  await setInputs({ principal: 10000, contribution: 1000, rate: 6, years: 10, frequency: 12 });
  assert((await page.locator('#chart .bar').count()) === 10, `10 chart bars for 10 years (got ${await page.locator('#chart .bar').count()})`);
  assert((await page.locator('#chart .b-int').count()) >= 1, 'interest segments rendered in chart');
  assert((await page.locator('#breakdown tr').count()) === 10, `10 table rows for 10 years (got ${await page.locator('#breakdown tr').count()})`);

  // final table row must contain the final total
  const finInt = String(Math.round(await raw('#final-amount')));
  const lastRow = ((await page.locator('#breakdown tr').last().textContent()) || '').replace(/[,\s]/g, '');
  assert(lastRow.includes(finInt), `last table row shows final total ${finInt} (row: ${lastRow})`);

  // --- 6) currency symbol propagates to the displayed amount ---
  await page.selectOption('#currency', '$');
  await page.waitForTimeout(60);
  assert(((await page.locator('#final-amount').textContent()) || '').trim().startsWith('$'), 'final amount shows selected currency symbol');
  await page.selectOption('#currency', '¥');
  await page.waitForTimeout(40);

  // --- 7) years number <-> slider stay in sync ---
  await page.fill('#years', '25');
  await page.waitForTimeout(70);
  assert((await page.locator('#years-slider').inputValue()) === '25', `slider syncs to typed years (got ${await page.locator('#years-slider').inputValue()})`);

  // --- 8) invalid: no money in at all surfaces a hint ---
  await setInputs({ principal: 0, contribution: 0 });
  assert(await page.locator('#hint').isVisible(), 'hint shown when both principal and contribution are 0');

  // --- 9) preset buttons populate inputs and recompute ---
  await page.locator('.preset').first().click();
  await page.waitForTimeout(80);
  assert((await raw('#final-amount')) > 0, 'clicking a preset yields a positive final amount');

  // settle on the default showcase state for the thumbnail
  await setInputs({ principal: 100000, contribution: 3000, rate: 8, years: 20, frequency: 12 });
  await page.waitForTimeout(150);
  // scroll results + growth chart into view so the card thumbnail shows the payoff
  await page.evaluate(() => {
    const r = document.querySelector('.results');
    if (r) r.closest('.card').scrollIntoView({ block: 'start' });
    window.scrollBy(0, -16);
  });
  await page.waitForTimeout(180);
  await screenshot('thumb.png');
}
