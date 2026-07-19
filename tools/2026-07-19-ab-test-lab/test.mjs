// Integration test for A/B 实验室 · A/B Test Lab.
// Drives the real two-proportion z-test + sample-size engine through the browser and
// asserts concrete numeric outputs (z, p, CI, verdict, required N), localStorage
// persistence across reload, and layout-containment guards. Captures thumb.png.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#abt-na');
  // clean slate for saved-experiments persistence test
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#abt-na');

  const outData = () => page.evaluate(() => ({ ...document.getElementById('abt-out').dataset }));
  const ssData = () => page.evaluate(() => ({ ...document.getElementById('abt-ss-out').dataset }));

  async function setAnalyze(na, xa, nb, xb) {
    await page.fill('#abt-na', String(na));
    await page.fill('#abt-xa', String(xa));
    await page.fill('#abt-nb', String(nb));
    await page.fill('#abt-xb', String(xb));
    await page.waitForFunction(
      (v) => {
        const d = document.getElementById('abt-out').dataset;
        return d.na === String(v[0]) && d.xa === String(v[1]) && d.nb === String(v[2]) && d.xb === String(v[3]);
      },
      [na, xa, nb, xb]
    );
  }
  async function setPill(groupSel, val) {
    await page.click(`${groupSel} .abt-pill[data-val="${val}"]`);
    await page.waitForFunction(
      (v) => document.querySelector(`${v[0]} .abt-pill[data-val="${v[1]}"]`).getAttribute('aria-pressed') === 'true',
      [groupSel, val]
    );
  }

  // ---------------- 1) significant win (default 1000/100 vs 1000/130, 95%, two-sided) ----------------
  await setAnalyze(1000, 100, 1000, 130);
  let d = await outData();
  assert(d.valid === '1', 'default inputs are valid');
  assert(Math.abs(parseFloat(d.z) - 2.1027) < 0.01, `z ≈ 2.10 (got ${d.z})`);
  assert(Math.abs(parseFloat(d.p) - 0.0355) < 0.002, `p ≈ 0.0355 (got ${d.p})`);
  assert(Math.abs(parseFloat(d.uplift) - 0.30) < 1e-6, `relative uplift = 30% (got ${d.uplift})`);
  assert(d.verdict === 'win', `verdict = win (got ${d.verdict})`);
  assert(parseFloat(d.cilow) > 0, `CI lower bound > 0 → excludes 0 (got ${d.cilow})`);
  assert((await page.textContent('#abt-rate-a')).trim() === '10.00%', 'A rate renders 10.00%');
  assert((await page.textContent('#abt-rate-b')).trim() === '13.00%', 'B rate renders 13.00%');
  let vh = (await page.textContent('#abt-vh')) || '';
  assert(/显著胜出/.test(vh), `verdict headline says B wins (got "${vh.trim()}")`);
  // p-value tile shows a value, not a dash
  assert(/0\.03/.test((await page.textContent('#abt-stat-p')) || ''), 'p-value tile shows ~0.03');

  // ---------------- 2) one-sided halves the p-value ----------------
  await setPill('#abt-dir', 'one');
  await page.waitForFunction(() => document.getElementById('abt-out').dataset.dir === 'one');
  let dOne = await outData();
  assert(Math.abs(parseFloat(dOne.p) - parseFloat(d.p) / 2) < 1e-4, `one-sided p = two-sided/2 (got ${dOne.p} vs ${d.p})`);
  assert(dOne.verdict === 'win', 'one-sided still a win');
  await setPill('#abt-dir', 'two');

  // ---------------- 3) confidence threshold flips the verdict ----------------
  // p≈0.0355 is significant at 95% but NOT at 99%.
  await setPill('#abt-conf', '99');
  await page.waitForFunction(() => document.getElementById('abt-out').dataset.conf === '99');
  let d99 = await outData();
  assert(d99.significant === '0' && d99.verdict === 'ns', `p=0.0355 not significant at 99% (verdict ${d99.verdict})`);
  // CI should be wider at 99% than at 95%
  const width = (x) => parseFloat(x.cihigh) - parseFloat(x.cilow);
  assert(width(d99) > width(d), 'CI is wider at 99% than 95%');
  await setPill('#abt-conf', '95');
  await page.waitForFunction(() => document.getElementById('abt-out').dataset.conf === '95');

  // ---------------- 4) not-significant case ----------------
  await setAnalyze(1000, 100, 1000, 108);
  let dns = await outData();
  assert(parseFloat(dns.p) > 0.05, `small diff → p>0.05 (got ${dns.p})`);
  assert(dns.verdict === 'ns', `verdict = ns (got ${dns.verdict})`);
  assert(/尚不显著|证据不足/.test((await page.textContent('#abt-vh')) || ''), 'headline signals inconclusive');

  // ---------------- 5) significant loss (B worse) ----------------
  await setAnalyze(1000, 130, 1000, 100);
  let dl = await outData();
  assert(parseFloat(dl.z) < 0, `loss case z<0 (got ${dl.z})`);
  assert(dl.verdict === 'loss', `verdict = loss (got ${dl.verdict})`);
  assert(/更差/.test((await page.textContent('#abt-vh')) || ''), 'headline signals B worse');

  // ---------------- 6) invalid input handling (conversions > visitors) ----------------
  await page.fill('#abt-na', '100');
  await page.fill('#abt-xa', '200');
  await page.waitForFunction(() => document.getElementById('abt-out').dataset.valid === '0');
  assert(await page.locator('#abt-xa.abt-bad').count() === 1, 'conversions>visitors flags the field invalid');
  assert(/请完善输入/.test((await page.textContent('#abt-vh')) || ''), 'invalid input shows prompt, not a bogus verdict');
  assert((await page.textContent('#abt-stat-p')).trim() === '—', 'stats blanked while invalid');

  // ---------------- 7) saved experiments: save → persist across reload → load → delete ----------------
  await setAnalyze(1000, 100, 1000, 108); // a distinctive (ns) experiment
  await page.fill('#abt-exp-name', '结账页改版');
  await page.click('#abt-save');
  await page.waitForSelector('.abt-si');
  assert(await page.locator('.abt-si').count() === 1, 'one saved experiment appears');
  assert(/结账页改版/.test((await page.textContent('.abt-si-name')) || ''), 'saved item keeps its name');

  // persists across a full reload
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.abt-si');
  assert(await page.locator('.abt-si').count() === 1, 'saved experiment survives reload (localStorage)');

  // change inputs, then load restores them
  await setAnalyze(2000, 500, 2000, 400);
  await page.click('.abt-load');
  await page.waitForFunction(() => document.getElementById('abt-xb').value === '108');
  assert((await page.inputValue('#abt-na')) === '1000', 'load restores A visitors');
  assert((await page.inputValue('#abt-nb')) === '1000', 'load restores B visitors');
  assert((await page.inputValue('#abt-xb')) === '108', 'load restores B conversions');
  let dLoaded = await outData();
  assert(dLoaded.verdict === 'ns', 'loaded experiment recomputes to its ns verdict');

  // delete empties the list
  await page.click('.abt-del');
  await page.waitForSelector('.abt-saved-empty');
  assert(await page.locator('.abt-si').count() === 0, 'delete removes the saved experiment');

  // ---------------- 8) sample-size panel ----------------
  await page.click('#abt-tab-size');
  await page.waitForFunction(() => document.getElementById('abt-panel-size').classList.contains('abt-on'));
  await page.waitForFunction(() => document.getElementById('abt-ss-out').dataset.valid === '1');
  let s = await ssData();
  let n0 = parseInt(s.n, 10);
  assert(n0 >= 3800 && n0 <= 3900, `N per group ≈ 3842 for 10%→12%/95%/80% (got ${n0})`);
  assert(parseInt(s.total, 10) === n0 * 2, 'total = 2 × per-group');
  assert(Math.abs(parseFloat(s.p2) - 0.12) < 1e-6, `target rate = 12% for +20% relative (got ${s.p2})`);
  // days = ceil(total / dailyTraffic); default traffic 1000 → ceil(7684/1000)=8
  assert(s.days === '8', `≈8 days at 1000/day (got ${s.days})`);
  assert(/8 天/.test((await page.textContent('#abt-ss-days')) || ''), 'days rendered');

  // smaller MDE → many more samples
  await page.fill('#abt-mde', '10');
  await page.waitForFunction(() => document.getElementById('abt-ss-out').dataset.mde === '10');
  let sSmall = await ssData();
  assert(parseInt(sSmall.n, 10) > n0 * 2, `halving MDE roughly quadruples N (${sSmall.n} vs ${n0})`);

  // higher power → more samples
  await page.fill('#abt-mde', '20');
  await page.waitForFunction(() => document.getElementById('abt-ss-out').dataset.mde === '20');
  await setPill('#abt-sspow', '95');
  await page.waitForFunction(() => document.getElementById('abt-ss-out').dataset.power === '95');
  let sPow = await ssData();
  assert(parseInt(sPow.n, 10) > n0, `95% power needs more than 80% power (${sPow.n} > ${n0})`);
  await setPill('#abt-sspow', '80');

  // absolute-MDE cross-check: +2pp on 10% baseline == +20% relative → same N
  await setPill('#abt-mdetype', 'abs');
  await page.fill('#abt-mde', '2');
  await page.waitForFunction(() => document.getElementById('abt-ss-out').dataset.mde === '2');
  let sAbs = await ssData();
  assert(Math.abs(parseInt(sAbs.n, 10) - n0) <= 2, `abs +2pp matches rel +20% N (${sAbs.n} vs ${n0})`);

  // traffic → days recompute
  await page.fill('#abt-traffic', '500');
  await page.waitForFunction(() => document.getElementById('abt-ss-out').dataset.days === '16');
  assert((await ssData()).days === '16', 'days doubles when daily traffic halves');

  // ---------------- 9) layout containment guards (no control escapes its box) ----------------
  const contained = async (childSel, parentSel, tol = 2) =>
    page.evaluate((a) => {
      const c = document.querySelector(a[0]), p = document.querySelector(a[1]), t = a[2];
      if (!c || !p) return { ok: false, why: 'missing ' + (c ? a[1] : a[0]) };
      const r = c.getBoundingClientRect(), b = p.getBoundingClientRect();
      const ok = r.left >= b.left - t && r.right <= b.right + t && r.top >= b.top - t && r.bottom <= b.bottom + t && r.width > 0 && r.height > 0;
      return { ok, why: `child[${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.right)},${Math.round(r.bottom)}] parent[${Math.round(b.left)},${Math.round(b.top)},${Math.round(b.right)},${Math.round(b.bottom)}]` };
    }, [childSel, parentSel, tol]);

  // back to analyze view for the DOM checks + thumbnail
  await page.click('#abt-tab-analyze');
  await page.waitForFunction(() => document.getElementById('abt-panel-analyze').classList.contains('abt-on'));
  await setAnalyze(1000, 100, 1000, 130); // pretty significant-win state

  let g = await contained('.abt-back', '.abt-nav');
  assert(g.ok, `return link stays inside nav (${g.why})`);
  g = await contained('#abt-verdict', '#abt-out');
  assert(g.ok, `verdict banner stays inside its card (${g.why})`);
  g = await contained('.abt-stats', '#abt-out');
  assert(g.ok, `stat grid stays inside its card (${g.why})`);
  g = await page.evaluate(() => {
    const c = document.getElementById('abt-chart'), card = c.closest('.abt-card');
    const r = c.getBoundingClientRect(), b = card.getBoundingClientRect();
    return { ok: r.left >= b.left - 2 && r.right <= b.right + 2 && r.top >= b.top - 2 && r.bottom <= b.bottom + 2, w: r.width, h: r.height };
  });
  assert(g.ok && g.w > 100 && g.h > 100, `chart canvas fills and stays inside its card (${JSON.stringify(g)})`);
  // no horizontal overflow (catches any element escaping to the right)
  const noHOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 2);
  assert(noHOverflow, 'page has no horizontal overflow');
  // return link points at the hub
  assert((await page.getAttribute('.abt-back', 'href')) === '../../', 'return link href = ../../');

  // ---------------- thumbnail ----------------
  await page.waitForFunction(() => {
    const out = document.getElementById('abt-out'), cv = document.getElementById('abt-chart');
    return out.dataset.verdict === 'win' && cv.dataset.drawn === out.dataset.nonce;
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.move(5, 5); // avoid hover artifacts on any control
  await screenshot('thumb.png');
}
