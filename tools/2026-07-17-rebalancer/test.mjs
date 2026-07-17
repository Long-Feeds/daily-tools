// Integration test for 再平衡 · Portfolio Rebalancer.
// Drives the real form and asserts the actual trade plan the optimizer emits
// (share counts, amounts, resulting weights, leftover cash) — not element
// presence. Every read waits for the DOM to converge; no timed sleeps.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#holdings-body .h-row');

  const txt = async (sel) => ((await page.locator(sel).textContent()) || '').trim();

  // Wait for a selector's text to settle on `expected`, then assert it.
  const expectText = async (sel, expected, label) => {
    try {
      await page.waitForFunction(
        (a) => {
          const el = document.querySelector(a.sel);
          return el && el.textContent.trim() === a.expected;
        },
        { sel, expected },
        { timeout: 4000 }
      );
    } catch (e) {
      throw new Error(`${label}: expected "${expected}" at ${sel}, got "${await txt(sel)}"`);
    }
    assert(true, label);
  };
  const expectCount = async (sel, n, label) => {
    try {
      await page.waitForFunction((a) => document.querySelectorAll(a.sel).length === a.n, { sel, n }, { timeout: 4000 });
    } catch (e) {
      throw new Error(`${label}: expected ${n} of ${sel}, got ${await page.locator(sel).count()}`);
    }
    assert(true, label);
  };

  // Replace the whole portfolio through the real paste-import path.
  await page.locator('details summary').click();
  const setPortfolio = async (text, { cash = '0', contribution = '0', reserve = '0' } = {}) => {
    await page.fill('#import-text', text);
    await page.click('#import-btn');
    await page.fill('#cash', cash);
    await page.fill('#contribution', contribution);
    await page.fill('#reserve', reserve);
  };

  // ---------- 1. the shipped sample portfolio ----------
  await page.click('#load-sample');
  await expectText('#stat-total', '$65,749.00', 'sample total value = 120*285.40 + 180*68.20 + 210*72.50 + 4000 cash');
  await expectText('#stat-maxdrift', '11.3%', 'sample max drift is VXUS at 18.67% vs 30% target');
  await expectText('#stat-trades', '3 笔', 'sample needs 3 trades');
  // the plan itself
  await expectText('.trade[data-ticker=VXUS] .trade-action', '买入', 'VXUS is underweight -> buy');
  await expectText('.trade[data-ticker=VXUS] .trade-shares', '109 股', 'buy 109 VXUS');
  await expectText('.trade[data-ticker=VXUS] .trade-amount', '+$7,433.80', '109 * 68.20 = 7433.80');
  await expectText('.trade[data-ticker=VTI] .trade-action', '卖出', 'VTI is overweight -> sell');
  await expectText('.trade[data-ticker=VTI] .trade-shares', '5 股', 'sell 5 VTI');
  await expectText('.trade[data-ticker=BND] .trade-shares', '29 股', 'sell 29 BND');
  await expectText('#sum-buy', '$7,433.80', 'buy total');
  await expectText('#sum-sell', '$3,529.50', 'sell total = 5*285.40 + 29*72.50');
  await expectText('#sum-cash-after', '$95.70', 'leftover cash = 4000 - (7433.80 - 3529.50)');
  await expectText('#sum-turnover', '16.7%', 'turnover = 10963.30 / 65749');
  // drift really collapses: every holding lands a hair under target, and the three
  // shortfalls sum to exactly the $95.70 that stays in cash (0.1456% of the base)
  await expectText('.after-row[data-ticker=VTI] .after-drift', '-0.08%', 'VTI lands within 0.08pp of its 50% target');
  await expectText('.after-row[data-ticker=VXUS] .after-drift', '-0.02%', 'VXUS lands within 0.02pp of its 30% target');
  await expectText('.after-row[data-ticker=BND] .after-drift', '-0.04%', 'BND lands within 0.04pp of its 20% target');
  await expectText('.alloc-row[data-ticker=VXUS] .alloc-drift', '-11.3%', 'allocation chart shows the -11.3pp gap');
  await expectText('.alloc-row[data-ticker=CASH] .alloc-drift', '+6.1%', 'idle cash shows as its own 6.1% slice');

  // layout guard: controls stay inside their card. A shared class name once leaked
  // position:absolute onto the copy button and parked it in the page corner.
  const escaped = await page.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll('.card button, .card select')) {
      const r = el.getBoundingClientRect();
      const c = el.closest('.card').getBoundingClientRect();
      if (r.top < c.top - 1 || r.bottom > c.bottom + 1 || r.left < c.left - 1 || r.right > c.right + 1) {
        bad.push((el.id || el.className) + ' @ ' + Math.round(r.top) + ',' + Math.round(r.left));
      }
    }
    return bad;
  });
  assert(escaped.length === 0, `every control renders inside its card (escaped: ${escaped.join('; ')})`);

  // ---------- 2. full rebalance on clean numbers ----------
  await setPortfolio('X, 15, 100, 50\nY, 5, 100, 50');
  await expectText('#import-msg', '已导入 2 行', 'import reports 2 rows');
  await expectText('#stat-maxdrift', '25.0%', '75/25 split is 25pp from a 50/50 target');
  await expectText('.trade[data-ticker=X] .trade-action', '卖出', 'X sells');
  await expectText('.trade[data-ticker=X] .trade-shares', '5 股', 'sell exactly 5 X');
  await expectText('.trade[data-ticker=X] .trade-amount', '-$500.00', 'X sale proceeds');
  await expectText('.trade[data-ticker=Y] .trade-shares', '5 股', 'buy exactly 5 Y');
  await expectText('#sum-cash-after', '$0.00', 'a self-funding rebalance leaves no cash');
  await expectText('.after-row[data-ticker=X] .after-drift', '0.00%', 'X lands exactly on target');
  await expectText('.after-row[data-ticker=Y] .after-weight', '25.0%→50.0%', 'Y weight moves 25% -> 50%');

  // ---------- 3. buy-only cannot fix an overweight ----------
  await page.fill('#cash', '200');
  await page.click('#mode-buy');
  await expectCount('.trade[data-ticker=X]', 0, 'buy-only never sells the overweight X');
  await expectText('.trade[data-ticker=Y] .trade-shares', '2 股', 'the 200 cash buys 2 Y');
  await expectText('#sum-cash-after', '$0.00', 'buy-only deploys all the cash');
  await expectText('#sum-sell', '$0.00', 'buy-only sells nothing');

  // ---------- 4. withdrawal raises exactly what is asked ----------
  await page.fill('#cash', '0');
  await page.fill('#contribution', '-400');
  await page.click('#mode-sell');
  await expectText('.trade[data-ticker=X] .trade-shares', '4 股', 'sell-only raises the 400 from the overweight X');
  await expectCount('.trade[data-ticker=Y]', 0, 'sell-only never buys');
  await expectText('#sum-cash-after', '$0.00', 'proceeds exactly fund the withdrawal');

  // ---------- 5. whole shares vs fractional ----------
  await page.click('#mode-full');
  await setPortfolio('X, 10, 33, 50\nY, 10, 7, 50');
  await expectText('.trade[data-ticker=X] .trade-shares', '4 股', 'whole-share plan sells 4 X (ideal is 3.94)');
  await expectText('.trade[data-ticker=Y] .trade-shares', '18 股', 'whole-share plan buys 18 Y');
  await expectText('#sum-cash-after', '$6.00', 'the un-investable remainder stays in cash');
  await page.uncheck('#whole-shares');
  await expectText('.after-row[data-ticker=X] .after-weight', '82.5%→50.0%', 'fractional shares hit the target exactly');
  await expectText('#sum-cash-after', '$0.00', 'fractional shares leave no remainder');
  await page.check('#whole-shares');

  // ---------- 6. tolerance bands gate a pure drift rebalance ----------
  await setPortfolio('X, 51, 100, 50\nY, 49, 100, 50');
  await expectText('#stat-trades', '2 笔', '1pp drift trades when bands are off');
  await page.check('#use-bands');
  await expectText('#stat-trades', '0 笔', '1pp drift is inside the 5/25 band -> no trades');
  await expectText('#plan-empty b', '全部在容忍带内', 'band gate is explained');
  // ...but new cash still gets deployed
  await page.fill('#cash', '500');
  await page.waitForFunction(() => document.querySelectorAll('.trade').length > 0, null, { timeout: 4000 });
  assert(true, 'idle cash is still deployed despite the bands');
  await page.fill('#cash', '0');
  await page.uncheck('#use-bands');

  // ---------- 7. minimum trade size ----------
  await setPortfolio('X, 100, 10, 50\nY, 98, 10, 50');
  await expectText('#stat-trades', '2 笔', 'two $10 trades before the floor');
  await page.fill('#min-trade', '100');
  await expectText('#stat-trades', '0 笔', '$10 trades are dropped under a $100 floor');
  await page.fill('#min-trade', '0');

  // ---------- 8. invalid input surfaces an error ----------
  await page.fill('.h-row:nth-child(1) .h-price', '0');
  await page.waitForFunction(() => {
    const e = document.querySelector('#plan-error');
    return e && e.style.display !== 'none' && /现价必须大于 0/.test(e.textContent);
  }, null, { timeout: 4000 });
  assert(true, 'a zero price is rejected with a readable error');
  await expectCount('.trade', 0, 'an invalid portfolio produces no trades');
  await page.fill('.h-row:nth-child(1) .h-price', '10');
  await expectText('#stat-trades', '2 笔', 'fixing the price restores the plan');

  // ---------- 9. editing rows by hand ----------
  await page.click('#add-row');
  await expectCount('.h-row', 3, 'add row');
  await page.fill('.h-row:nth-child(3) .h-ticker', 'Z');
  await page.fill('.h-row:nth-child(3) .h-shares', '0');
  await page.fill('.h-row:nth-child(3) .h-price', '20');
  await page.fill('.h-row:nth-child(3) .h-target', '50');
  await expectText('#target-sum', '目标合计 150.0%', 'target sum tracks the edits');
  await page.click('#normalize');
  // 50/50/50 -> 33.4/33.3/33.3: rounding the odd tenth away rather than losing it
  await expectText('#target-sum', '目标合计 100.0%', 'normalize rescales the targets to exactly 100%');
  assert((await page.inputValue('.h-row:nth-child(1) .h-target')) === '33.4', 'the odd tenth lands on the first holding');
  assert((await page.inputValue('.h-row:nth-child(3) .h-target')) === '33.3', 'the remaining holdings split the rest');
  // 1000/980/0 across a $1980 base -> the integer optimizer finds the exact equal
  // thirds ($660 each) and spends every dollar, despite Z costing $20 a share
  await expectText('.trade[data-ticker=Z] .trade-shares', '33 股', 'the new holding is bought from zero to a full third');
  await expectText('.after-row[data-ticker=Z] .after-drift', '+0.03%', 'Z lands on its normalized 33.3% target');
  for (const t of ['X', 'Y', 'Z']) {
    await expectText(`.after-row[data-ticker=${t}] .after-value`, '$660.00', `${t} lands on an exact equal third of the base`);
  }
  await expectText('#sum-cash-after', '$0.00', 'the equal-thirds split uses every dollar');
  await page.click('.h-row:nth-child(3) .del');
  await expectCount('.h-row', 2, 'delete row');

  // ---------- 10. state survives a reload ----------
  await setPortfolio('AAA, 7, 11, 60\nBBB, 3, 13, 40', { cash: '123' });
  await expectText('#stat-total', '$239.00', '7*11 + 3*13 + 123 cash');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#holdings-body .h-row');
  await expectText('#stat-total', '$239.00', 'portfolio is restored from localStorage after a reload');
  assert((await page.inputValue('.h-row:nth-child(1) .h-ticker')) === 'AAA', 'holdings survive the reload');
  assert((await page.inputValue('#cash')) === '123', 'cash survives the reload');

  // ---------- 11. the page ships the engine the offline suite verified ----------
  const engine = await page.evaluate(() => {
    const r = window.__rb.plan({
      holdings: [{ ticker: 'X', shares: 15, price: 100, target: 50 }, { ticker: 'Y', shares: 5, price: 100, target: 50 }],
      cash: 0, mode: 'full', wholeShares: true
    });
    return {
      lambda: window.__rb.solveLambda([100, 50], 30),
      x: r.rows[0].deltaShares,
      driftAfter: r.stats.maxDriftAfter,
      parsed: window.__rb.parseImport('VTI,"1,200",285.40,50%').rows[0].shares
    };
  });
  assert(engine.lambda === 70, `water-fill solver reachable in page (got ${engine.lambda})`);
  assert(engine.x === -5, `page engine plans the -5 X trade (got ${engine.x})`);
  assert(Math.abs(engine.driftAfter) < 1e-9, `page engine drives drift to zero (got ${engine.driftAfter})`);
  assert(engine.parsed === 1200, `page parser handles quoted thousands separators (got ${engine.parsed})`);

  // ---------- thumbnail ----------
  await page.click('#load-sample');
  await expectText('#stat-trades', '3 笔', 'sample restored for the thumbnail');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(() => window.scrollY === 0, null, { timeout: 2000 });
  await screenshot('thumb.png');
}
