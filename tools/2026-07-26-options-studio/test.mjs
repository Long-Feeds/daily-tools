// Integration test for 期权工作台 · Options Studio (Binance design language).
// Drives the real Black–Scholes–Merton engine through the browser: asserts textbook
// option prices, analytic Greeks (Δ/Γ/Θ/Vega/Rho), implied-vol via Newton–Raphson,
// and multi-leg strategy payoff (net debit/credit, max profit/loss, breakevens) — all
// against concrete computed values, plus DOM↔engine agreement, layout containment /
// control-width guards (lessons 2026-07-17 / 07-24), the [hidden] computed-display
// guard (2026-07-20) and localStorage round-trip. Captures thumb.png.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#os-price-num');
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#os-legbody tr'); // default straddle preset renders legs

  const near = (a, b, t) => Math.abs(a - b) <= t;
  const dsv = (id) => page.evaluate((i) => Number(document.getElementById(i).dataset.value), id);
  const txt = (id) => page.evaluate((i) => document.getElementById(i).textContent.trim(), id);
  const disp = (sel) => page.evaluate((s) => { const el = document.querySelector(s); return el ? getComputedStyle(el).display : 'MISSING'; }, sel);
  const widthOf = (sel) => page.evaluate((s) => { const el = document.querySelector(s); return el ? Math.round(el.getBoundingClientRect().width) : -1; }, sel);
  const rectIn = (c, p) => page.evaluate(([cs, ps]) => {
    const a = document.querySelector(cs).getBoundingClientRect(), b = document.querySelector(ps).getBoundingClientRect();
    return a.left >= b.left - 1 && a.right <= b.right + 1 && a.top >= b.top - 1 && a.bottom <= b.bottom + 1;
  }, [c, p]);

  async function setPricer(vals) {
    for (const [id, v] of Object.entries(vals)) await page.fill('#os-' + id, String(v));
  }

  // ---------------- 1) shipped engine == verified engine (window.__opt ground truth) ----------------
  const eng = await page.evaluate(() => {
    const O = window.__opt;
    const c = O.price('call', 100, 100, 1, 0.05, 0.2, 0);
    const p = O.price('put', 100, 100, 1, 0.05, 0.2, 0);
    const g = O.greeks('call', 100, 100, 1, 0.05, 0.2, 0);
    // central-difference delta check inside the page
    const h = 1e-4;
    const dNum = (O.price('call', 100 + h, 100, 1, 0.05, 0.2, 0) - O.price('call', 100 - h, 100, 1, 0.05, 0.2, 0)) / (2 * h);
    // IV reprice
    const iv = O.impliedVol('call', c, 100, 100, 1, 0.05, 0);
    const rep = O.price('call', 100, 100, 1, 0.05, iv.sigma, 0);
    // straddle breakevens (call@6/put@5 at K100)
    const be = O.breakevens([
      { kind: 'call', side: 'long', qty: 1, strike: 100, premium: 6 },
      { kind: 'put', side: 'long', qty: 1, strike: 100, premium: 5 }
    ]);
    return { c, p, parity: c - p, delta: g.delta, d1: g.d1, dNum, ivSig: iv.sigma, rep, be };
  });
  assert(near(eng.c, 10.4506, 3e-3), 'engine ATM call ≈ 10.4506 (got ' + eng.c + ')');
  assert(near(eng.p, 5.5735, 3e-3), 'engine ATM put ≈ 5.5735 (got ' + eng.p + ')');
  assert(near(eng.parity, 100 - 100 * Math.exp(-0.05), 1e-6), 'put-call parity holds in page');
  assert(near(eng.delta, 0.6368, 1e-3), 'engine call delta ≈ 0.6368');
  assert(near(eng.delta, eng.dNum, 1e-5), 'delta = ∂P/∂S central-diff (in page)');
  assert(near(eng.d1, 0.35, 1e-9), 'd1 = 0.35 exactly');
  assert(near(eng.rep, eng.c, 1e-6), 'IV reprices to the input price');
  assert(eng.be.length === 2 && near(eng.be[0], 89, 1e-6) && near(eng.be[1], 111, 1e-6), 'straddle breakevens 89 & 111');

  // ---------------- 2) pricer DOM: call at S=K=100,T=1,r=5%,σ=20% ----------------
  await page.click('#os-type button[data-type="call"]');
  await setPricer({ S: 100, K: 100, days: 365, vol: 20, rate: 5, div: 0 });
  await page.waitForFunction(() => { const v = document.getElementById('os-price-num').dataset.value; return v && Math.abs(Number(v) - 10.4506) < 0.01; });
  assert(near(await dsv('os-price-num'), 10.4506, 0.01), 'DOM call price ≈ 10.4506');
  assert(near(await dsv('os-delta'), 0.6368, 2e-3), 'DOM delta ≈ 0.6368');
  assert(near(await dsv('os-gamma'), 0.018762, 5e-4), 'DOM gamma ≈ 0.01876');
  assert((await dsv('os-theta')) < 0, 'long ATM call daily theta < 0');
  assert((await dsv('os-vega')) > 0, 'vega positive');
  assert(near(await dsv('os-prob'), 0.5596, 3e-3), 'DOM ITM prob N(d2) ≈ 0.5596');
  assert((await txt('os-d1')) === '0.3500', 'd1 chip shows 0.3500 (got ' + await txt('os-d1') + ')');
  assert((await txt('os-nd1')) === '0.6368', 'N(d1) chip shows 0.6368');
  assert((await txt('os-intrinsic')) === '$0.00', 'ATM call intrinsic = $0.00 (got ' + await txt('os-intrinsic') + ')');
  const tv = await txt('os-timeval');
  assert(tv.includes('10.45'), 'ATM call time value ≈ $10.45 (got ' + tv + ')');

  // put toggle → 5.5735, delta -0.3632
  await page.click('#os-type button[data-type="put"]');
  await page.waitForFunction(() => { const v = document.getElementById('os-price-num').dataset.value; return v && Math.abs(Number(v) - 5.5735) < 0.01; });
  assert(near(await dsv('os-price-num'), 5.5735, 0.01), 'DOM put price ≈ 5.5735');
  assert(near(await dsv('os-delta'), -0.3632, 2e-3), 'DOM put delta ≈ -0.3632');

  // vol sensitivity: 20% → 40% raises the put price
  const putLo = await dsv('os-price-num');
  await page.fill('#os-vol', '40');
  await page.waitForFunction((lo) => Number(document.getElementById('os-price-num').dataset.value) > lo + 1, putLo);
  assert((await dsv('os-price-num')) > putLo + 1, 'higher σ raises option price (vega > 0)');

  // deep ITM put intrinsic: S=80,K=100 → intrinsic 20
  await page.fill('#os-vol', '20');
  await page.fill('#os-S', '80');
  await page.waitForFunction(() => document.getElementById('os-intrinsic').textContent.includes('20.00'));
  assert((await txt('os-intrinsic')).includes('20.00'), 'deep-ITM put intrinsic = $20.00');

  // ---------------- 3) implied volatility solver (Newton–Raphson) ----------------
  await page.click('#os-type button[data-type="call"]');
  await setPricer({ S: 100, K: 100, days: 365, vol: 20, rate: 5, div: 0 });
  await page.fill('#os-mktprice', '10.4506');
  await page.click('#os-solve');
  await page.waitForFunction(() => { const v = document.getElementById('os-iv').dataset.value; return v && Math.abs(Number(v) - 0.20) < 5e-3; });
  assert(near(await dsv('os-iv'), 0.20, 5e-3), 'IV(10.4506) ≈ 20% (got ' + await dsv('os-iv') + ')');
  assert((await txt('os-iv')).includes('20.'), 'IV readout shows ~20% (got ' + await txt('os-iv') + ')');

  // a richer price → higher IV
  await page.fill('#os-mktprice', '15.00');
  await page.click('#os-solve');
  await page.waitForFunction(() => { const v = document.getElementById('os-iv').dataset.value; return v && Number(v) > 0.28; });
  assert((await dsv('os-iv')) > 0.28, 'a pricier option implies higher IV');

  // out-of-bounds price → no solution (below no-arb lower bound ≈ 4.88)
  await page.fill('#os-mktprice', '2');
  await page.click('#os-solve');
  await page.waitForFunction(() => document.getElementById('os-ivout').classList.contains('bad'));
  assert((await txt('os-iv')) === '无解', 'price below no-arb bound → 无解');

  // ---------------- 4) strategy builder DOM ↔ engine agreement ----------------
  await page.fill('#os-S', '100');
  // default preset is straddle; make sure it is active & re-load to sync strikes to S=100
  await page.click('.os-preset[data-preset="straddle"]');
  await page.waitForFunction(() => document.querySelectorAll('#os-legbody tr').length === 2);

  async function domLegs() {
    return page.$$eval('#os-legbody tr', (rows) => rows.map((tr) => ({
      side: tr.querySelector('.side').value,
      kind: tr.querySelector('.kind').value,
      qty: parseFloat(tr.querySelector('.qty').value),
      strike: parseFloat(tr.querySelector('.strike').value),
      premium: parseFloat(tr.querySelector('.premium').value)
    })));
  }
  async function agree(label) {
    const legs = await domLegs();
    const r = await page.evaluate((L) => {
      const O = window.__opt, ex = O.extremes(L), be = O.breakevens(L);
      return {
        net: O.netDebit(L), maxP: ex.maxProfit, maxL: ex.maxLoss, be: be,
        dNet: Number(document.getElementById('os-net').dataset.value),
        dMaxP: Number(document.getElementById('os-maxp').dataset.value),
        dMaxL: Number(document.getElementById('os-maxl').dataset.value),
        dBE: document.getElementById('os-be').dataset.value
      };
    }, legs);
    assert(near(r.dNet, r.net, 1e-4), label + ': DOM net matches engine (' + r.dNet + ' vs ' + r.net + ')');
    assert(r.dMaxP === r.maxP || near(r.dMaxP, r.maxP, 1e-3), label + ': DOM maxProfit matches engine');
    assert(r.dMaxL === r.maxL || near(r.dMaxL, r.maxL, 1e-3), label + ': DOM maxLoss matches engine');
    const engBE = r.be.map((b) => b.toFixed(4)).join(',');
    assert(r.dBE === engBE, label + ': DOM breakevens match engine (' + r.dBE + ' vs ' + engBE + ')');
    return r;
  }

  const sr = await agree('straddle');
  assert(sr.maxP === Infinity, 'straddle max profit unlimited');
  assert(sr.be.length === 2 && sr.be[0] < 100 && sr.be[1] > 100, 'straddle has two breakevens straddling spot');
  assert((await txt('os-maxp')) === '无限', 'straddle maxProfit shows 无限');
  assert((await txt('os-net')).includes('借'), 'straddle net shows a debit (借)');

  // bull call spread → bounded, one breakeven, maxLoss = -debit
  await page.click('.os-preset[data-preset="bull-call"]');
  await page.waitForFunction(() => document.querySelectorAll('#os-legbody tr').length === 2 && document.getElementById('os-maxp').dataset.value !== 'Infinity');
  const br = await agree('bull-call');
  assert(isFinite(br.maxP) && br.maxP > 0, 'bull spread max profit finite & positive');
  assert(near(br.maxL, br.net > 0 ? -br.net : br.maxL, 1e-6), 'bull spread max loss = -net debit');
  assert(br.be.length === 1, 'bull spread has exactly one breakeven');

  // iron condor → net credit (贷)
  await page.click('.os-preset[data-preset="iron-condor"]');
  await page.waitForFunction(() => document.querySelectorAll('#os-legbody tr').length === 4);
  const ir = await agree('iron-condor');
  assert(ir.net < 0, 'iron condor is a net credit (netDebit < 0)');
  assert((await txt('os-net')).includes('贷'), 'iron condor net shows a credit (贷)');
  assert(ir.be.length === 2 && isFinite(ir.maxP) && isFinite(ir.maxL), 'iron condor bounded with 2 breakevens');
  // 4 payoff path segments drawn (green+red area + green+red stroke)
  const paths = await page.locator('#os-chart path').count();
  assert(paths >= 3, 'payoff chart renders multiple path segments (got ' + paths + ')');
  // breakeven markers on the chart
  const dots = await page.locator('#os-chart circle').count();
  assert(dots === 2, 'two breakeven dots on the iron-condor chart (got ' + dots + ')');

  // ---------------- 5) hand-set exact leg: long call K100 @ premium 10 ----------------
  await page.click('#os-clearlegs');
  await page.waitForFunction(() => document.querySelectorAll('#os-legbody tr').length === 0);
  assert((await page.locator('#os-chart text').first().textContent()).includes('加一腿'), 'empty strategy shows placeholder text');
  await page.click('#os-addleg'); // adds long call K=round(spot=100) premium spot*0.05
  await page.waitForFunction(() => document.querySelectorAll('#os-legbody tr').length === 1);
  // force strike 100, premium 10
  await page.fill('#os-legbody tr .strike', '100');
  await page.fill('#os-legbody tr .premium', '10');
  await page.waitForFunction(() => { const v = document.getElementById('os-be').dataset.value; return v && Math.abs(Number(v) - 110) < 1e-3; });
  assert(near(await dsv('os-maxl'), -10, 1e-6), 'hand-set long call max loss = -10');
  assert((await txt('os-maxp')) === '无限', 'hand-set long call max profit 无限');
  assert(near(Number(await page.evaluate(() => document.getElementById('os-be').dataset.value)), 110, 1e-3), 'hand-set long call breakeven = 110');

  // ---------------- 6) layout guards (lessons 07-17 / 07-24) + [hidden] guard ----------------
  assert(await disp('#os-chart') !== 'none', 'chart visible (computed display ≠ none)');
  assert((await widthOf('#os-S')) >= 90, 'S input renders wide enough (got ' + await widthOf('#os-S') + ')');
  assert((await widthOf('#os-solve')) >= 60, 'solve button not collapsed');
  await page.click('.os-preset[data-preset="straddle"]');
  await page.waitForFunction(() => document.querySelectorAll('#os-legbody tr').length === 2);
  assert((await widthOf('#os-legbody tr .premium')) >= 50, 'leg premium input not collapsed to 0 width');
  assert((await widthOf('#os-legbody tr .kind')) >= 60, 'leg kind select not collapsed');
  assert(await rectIn('#os-back', '.os-gnav'), 'return link stays inside the global nav');
  assert(await rectIn('#os-chart', '.os-chartwrap'), 'chart stays inside its card wrapper');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 2, 'no horizontal page overflow at desktop (got ' + overflow + 'px)');
  await page.setViewportSize({ width: 390, height: 820 });
  const overflowN = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflowN <= 2, 'no horizontal overflow at 390px (got ' + overflowN + 'px)');
  await page.setViewportSize({ width: 1280, height: 850 });

  // ---------------- 7) localStorage persistence ----------------
  // set a distinctive pricer state + straddle, reload, confirm restored
  await page.click('#os-type button[data-type="put"]');
  await setPricer({ S: 123, K: 117, days: 45, vol: 33, rate: 3.5, div: 1 });
  await page.waitForFunction(() => document.getElementById('os-S').value === '123');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#os-legbody tr');
  assert((await page.inputValue('#os-S')) === '123', 'pricer S restored from localStorage');
  assert((await page.inputValue('#os-K')) === '117', 'pricer K restored');
  assert((await page.inputValue('#os-vol')) === '33', 'pricer vol restored');
  assert((await page.getAttribute('#os-type button[data-type="put"]', 'aria-pressed')) === 'true', 'put type restored');
  const legsAfter = await page.locator('#os-legbody tr').count();
  assert(legsAfter === 2, 'straddle legs restored after reload (got ' + legsAfter + ')');

  // ---------------- 8) canonical state + thumbnail ----------------
  // rich, recognizable frame: pricer greeks + iron-condor payoff chart
  await page.click('#os-type button[data-type="call"]');
  await setPricer({ S: 100, K: 105, days: 60, vol: 30, rate: 4, div: 0 });
  await page.click('.os-preset[data-preset="iron-condor"]');
  await page.waitForFunction(() => document.querySelectorAll('#os-legbody tr').length === 4 && document.getElementById('os-price-num').dataset.value);
  await page.evaluate(() => { document.activeElement && document.activeElement.blur && document.activeElement.blur(); });
  // frame the full payoff chart + legend just above the fold, with the pricer Greeks &
  // strategy stats in view above it (the chart is the wow — don't let it sit below the fold)
  await page.evaluate(() => {
    const legend = document.querySelector('.os-legend').getBoundingClientRect();
    const y = Math.max(0, legend.bottom + window.scrollY - 850 + 28);
    window.scrollTo(0, y);
  });
  await page.mouse.move(5, 5);
  await page.waitForTimeout(220); // settle any hover/focus transition before the shot (lesson 07-18 / 07-22)
  await screenshot('thumb.png');
}
