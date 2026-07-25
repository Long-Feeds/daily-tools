// Integration test for 化学配平 · Reaction Balancer (Apple design language).
// Drives the real exact-arithmetic engine through the browser: asserts concrete balanced
// coefficients (incl. redox with charge), the linear-algebra readouts, molar mass, the
// stoichiometry table with mass conservation, error handling, the [hidden] computed-display
// guard (lesson 2026-07-20), control-width + containment layout guards (2026-07-17 / 2026-07-24),
// and localStorage history round-trip. Captures thumb.png.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#rb-eq');
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#rb-result[data-status="ok-unique"]');

  const status = () => page.evaluate(() => document.getElementById('rb-result').dataset.status);
  const coeffs = () => page.evaluate(() => document.getElementById('rb-result').dataset.coeffs);
  const stat = (id) => page.evaluate((i) => document.getElementById(i).textContent, id);
  const disp = (sel) => page.evaluate((s) => {
    const el = document.querySelector(s); return el ? getComputedStyle(el).display : 'MISSING';
  }, sel);
  const rectIn = (childSel, parentSel) => page.evaluate(([c, p]) => {
    const a = document.querySelector(c).getBoundingClientRect();
    const b = document.querySelector(p).getBoundingClientRect();
    return { inside: a.left >= b.left - 1 && a.right <= b.right + 1 && a.top >= b.top - 1, aw: a.width, aleft: a.left, bright: b.right };
  }, [childSel, parentSel]);
  const widthOf = (sel) => page.evaluate((s) => {
    const el = document.querySelector(s); return el ? Math.round(el.getBoundingClientRect().width) : -1;
  }, sel);

  async function balance(eq) {
    await page.fill('#rb-eq', eq);
    await page.click('#rb-balance'); // doBalance runs synchronously in the click handler
  }
  async function balanceExpect(eq, expected) {
    await page.fill('#rb-eq', eq);
    await page.click('#rb-balance');
    await page.waitForFunction(
      (exp) => document.getElementById('rb-result').dataset.coeffs === exp,
      expected, { timeout: 8000 });
  }

  // ---------------- 1) default load balances ethane combustion 2,7,4,6 ----------------
  assert(await status() === 'ok-unique', 'default equation balances uniquely');
  assert(await coeffs() === '2,7,4,6', 'C2H6 + O2 → CO2 + H2O = 2,7,4,6 (got ' + await coeffs() + ')');
  // pretty output uses subscripts + coefficient
  const prettyTxt = await page.textContent('#rb-eq-pretty');
  assert(prettyTxt.includes('C₂H₆') && prettyTxt.includes('→') && prettyTxt.includes('CO₂'),
    'balanced equation shows unicode subscripts + arrow (got: ' + prettyTxt.replace(/\s+/g, ' ').trim() + ')');
  assert((await stat('rb-stat-species')) === '4', 'species count = 4');
  assert((await stat('rb-stat-dof')) === '1', 'unique balance → dof 1');
  assert((await stat('rb-stat-rank')) === '3', 'rank = species(4) - dof(1) = 3');

  // matrix rendered and contains signed entries
  assert(await disp('#rb-matrix-shell') !== 'none', 'matrix shell visible after balance');
  const matrixText = await page.textContent('#rb-matrix');
  assert(/[+]\d/.test(matrixText) && /-\d/.test(matrixText), 'matrix has +reactant and -product entries');

  // ---------------- 2) several known reactions ----------------
  await balanceExpect('H2 + O2 -> H2O', '2,1,2');
  await balanceExpect('Fe + O2 -> Fe2O3', '4,3,2');
  await balanceExpect('KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2', '2,16,2,2,8,5');
  await balanceExpect('C8H18 + O2 -> CO2 + H2O', '2,25,16,18');
  await balanceExpect('Ca(OH)2 + H3PO4 -> Ca3(PO4)2 + H2O', '3,2,1,6');
  await balanceExpect('N2 + H2 = NH3', '1,3,2'); // '=' as arrow

  // ---------------- 3) charge-balanced redox ----------------
  await balanceExpect('MnO4^- + Fe^2+ + H^+ -> Mn^2+ + Fe^3+ + H2O', '1,5,8,1,5,4');
  assert(await status() === 'ok-unique', 'redox balances uniquely');
  // charge row present in matrix + a charge-balance chip
  const elText = await page.textContent('#rb-elements');
  assert(elText.includes('电荷'), 'charge balance chip shown for ionic redox');
  const mtx2 = await page.textContent('#rb-matrix');
  assert(mtx2.includes('电荷 q'), 'matrix has a charge row for ionic equation');

  // ---------------- 4) underdetermined ----------------
  await balance('C + O2 + H2 -> CO2 + H2O');
  await page.waitForFunction(() => document.getElementById('rb-result').dataset.status === 'ok-underdetermined');
  assert((await stat('rb-stat-dof')) === '2', 'C+O2+H2→CO2+H2O has 2 degrees of freedom');
  // stoich must be hidden when balance is not unique
  assert(await disp('#rb-stoich') === 'none', 'stoich section hidden (display:none) when not unique — [hidden] guard');

  // ---------------- 5) error handling + [hidden] guard ----------------
  await balance('H2 + O2'); // no arrow
  await page.waitForFunction(() => document.getElementById('rb-result').dataset.status === 'error');
  assert((await page.textContent('#rb-msg')).includes('箭头'), 'missing-arrow error surfaced');
  assert(await disp('#rb-copy') === 'none', 'copy button hidden (computed display none) in error state');
  assert(await disp('#rb-stoich') === 'none', 'stoich stays hidden on error');

  // impossible (element only on one side)
  await balance('H2 + O2 -> H2O + Na');
  await page.waitForFunction(() => document.getElementById('rb-result').dataset.status === 'error');
  assert((await page.textContent('#rb-msg')).length > 3, 'unbalanceable equation reports an error message');

  // ---------------- 6) molar mass ----------------
  const mmMass = async () => page.evaluate(() => Number(document.getElementById('rb-mm-total').dataset.mass));
  await page.fill('#rb-mm', 'C6H12O6');
  await page.click('#rb-mm-go');
  await page.waitForFunction(() => Math.abs(Number(document.getElementById('rb-mm-total').dataset.mass) - 180.156) < 0.02);
  assert(Math.abs(await mmMass() - 180.156) < 0.02, 'glucose molar mass ≈ 180.156 (got ' + await mmMass() + ')');

  await page.fill('#rb-mm', 'CuSO4·5H2O');
  await page.click('#rb-mm-go');
  await page.waitForFunction(() => Math.abs(Number(document.getElementById('rb-mm-total').dataset.mass) - 249.68) < 0.05);
  assert(Math.abs(await mmMass() - 249.68) < 0.05, 'blue vitriol ≈ 249.68 (hydrate parsed) got ' + await mmMass());

  // water: O should be the widest bar (~88.8%)
  await page.fill('#rb-mm', 'H2O');
  await page.click('#rb-mm-go');
  await page.waitForFunction(() => Math.abs(Number(document.getElementById('rb-mm-total').dataset.mass) - 18.015) < 0.02);
  const bars = await page.$$eval('#rb-mm-bars .bar-row', (rows) => rows.map((r) => ({
    el: r.querySelector('.el').textContent.trim(),
    pct: r.querySelector('.pct').textContent,
    fillW: Math.round(r.querySelector('.bar-fill').getBoundingClientRect().width),
    trackW: Math.round(r.querySelector('.bar-track').getBoundingClientRect().width)
  })));
  assert(bars.length === 2, 'water has 2 element bars');
  assert(bars[0].el.startsWith('O') && bars[0].pct.startsWith('88'), 'O bar is first and ~88% (got ' + bars[0].el + ' ' + bars[0].pct + ')');
  assert(bars[0].fillW > bars[1].fillW && bars[0].fillW <= bars[0].trackW + 1, 'O fill wider than H fill and within track');

  // molar mass invalid input error (computed-display guard on error box)
  await page.fill('#rb-mm', 'Xz2');
  await page.click('#rb-mm-go');
  await page.waitForFunction(() => getComputedStyle(document.getElementById('rb-mm-err')).display !== 'none');
  assert(await disp('#rb-mm-err') !== 'none', 'molar-mass error visible for unknown element');
  // valid again hides error
  await page.fill('#rb-mm', 'H2SO4');
  await page.click('#rb-mm-go');
  await page.waitForFunction(() => getComputedStyle(document.getElementById('rb-mm-err')).display === 'none');
  assert(await disp('#rb-mm-err') === 'none', 'error box hidden again for valid formula (computed display none)');

  // ---------------- 7) stoichiometry: 2 mol N2 → 6 mol H2, 4 mol NH3, mass conserved ----------------
  await balanceExpect('N2 + H2 -> NH3', '1,3,2');
  assert(await disp('#rb-stoich') !== 'none', 'stoich visible for unique balance');
  await page.selectOption('#rb-stoich-species', '0'); // N2
  await page.fill('#rb-stoich-amt', '2');
  await page.selectOption('#rb-stoich-unit', 'mol');
  await page.waitForFunction(() => {
    const rows = document.querySelectorAll('#rb-stoich-table tbody tr');
    if (rows.length !== 3) return false;
    const n2mol = parseFloat(rows[0].querySelectorAll('td')[3].textContent.replace(/,/g, ''));
    return Math.abs(n2mol - 2) < 1e-6;
  });
  const stoichRows = await page.$$eval('#rb-stoich-table tbody tr', (trs) => trs.map((tr) => {
    const t = Array.from(tr.querySelectorAll('td')).map((td) => td.textContent.trim());
    return { formula: t[0], coeff: t[1], mol: t[3], grams: t[4] };
  }));
  assert(stoichRows.length === 3, 'stoich table has 3 species');
  // N2 row mol=2, H2 mol=6, NH3 mol=4
  const molOf = (frag) => { const r = stoichRows.find((x) => x.formula.startsWith(frag)); return r ? parseFloat(r.mol.replace(/,/g, '')) : NaN; };
  assert(Math.abs(molOf('N₂') - 2) < 1e-6, 'N2 basis = 2 mol (got ' + molOf('N₂') + ')');
  assert(Math.abs(molOf('H₂') - 6) < 1e-6, 'H2 = 6 mol (got ' + molOf('H₂') + ')');
  assert(Math.abs(molOf('NH₃') - 4) < 1e-6, 'NH3 = 4 mol (got ' + molOf('NH₃') + ')');
  const massTxt = await page.textContent('#rb-stoich-mass');
  assert(massTxt.includes('守恒'), 'mass conservation check passes (got: ' + massTxt.replace(/\s+/g, ' ').trim() + ')');

  // switch to grams basis: 180.156 g glucose combustion → ~1 mol glucose, 6 mol CO2
  await balanceExpect('C6H12O6 + O2 -> CO2 + H2O', '1,6,6,6');
  await page.selectOption('#rb-stoich-species', '0');
  await page.fill('#rb-stoich-amt', '180.156');
  await page.selectOption('#rb-stoich-unit', 'g');
  await page.waitForFunction(() => {
    const rows = document.querySelectorAll('#rb-stoich-table tbody tr');
    if (rows.length < 3) return false;
    const mol0 = parseFloat(rows[0].querySelectorAll('td')[3].textContent.replace(/,/g, ''));
    return Math.abs(mol0 - 1) < 0.01;
  });
  const gRows = await page.$$eval('#rb-stoich-table tbody tr', (trs) => trs.map((tr) => parseFloat(tr.querySelectorAll('td')[3].textContent.replace(/,/g, ''))));
  assert(Math.abs(gRows[0] - 1) < 0.01, '180.156 g glucose ≈ 1 mol (got ' + gRows[0] + ')');
  assert(Math.abs(gRows[2] - 6) < 0.02, '→ 6 mol CO2 (got ' + gRows[2] + ')');

  // ---------------- 8) layout guards: control widths + containment (lessons 07-17 / 07-24) ----------------
  const eqW = await widthOf('#rb-eq');
  assert(eqW >= 220, 'equation input renders wide enough (got ' + eqW + 'px)');
  const btnW = await widthOf('#rb-balance');
  assert(btnW >= 60, 'balance button not collapsed (got ' + btnW + 'px)');
  const selW = await widthOf('#rb-stoich-species');
  assert(selW >= 120, 'stoich species select not collapsed (got ' + selW + 'px)');
  const amtW = await widthOf('#rb-stoich-amt');
  assert(amtW >= 90, 'amount input not collapsed (got ' + amtW + 'px)');

  const backIn = await rectIn('#rb-back', '.gnav');
  assert(backIn.inside, 'return link stays inside the global nav');
  const prettyIn = await rectIn('#rb-eq-pretty', '#rb-result .wrap');
  assert(prettyIn.inside, 'balanced equation stays inside the result tile');
  // no horizontal page overflow
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 2, 'no horizontal page overflow (got ' + overflow + 'px)');
  // narrow viewport containment (querying scrollWidth forces a synchronous reflow)
  await page.setViewportSize({ width: 390, height: 780 });
  const overflowN = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflowN <= 2, 'no horizontal overflow at 390px (got ' + overflowN + 'px)');
  await page.setViewportSize({ width: 1280, height: 850 });

  // ---------------- 9) history persists across reload ----------------
  const histCount = await page.$$eval('#rb-history .chip', (els) => els.length);
  assert(histCount >= 3, 'history accumulated multiple balanced equations (got ' + histCount + ')');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#rb-history .chip');
  const histAfter = await page.$$eval('#rb-history .chip', (els) => els.map((e) => e.textContent));
  assert(histAfter.length >= 3, 'history restored from localStorage after reload (got ' + histAfter.length + ')');
  assert(histAfter.some((h) => h.includes('C6H12O6')), 'recent glucose equation is in restored history');
  // last equation restored into the input
  const restoredEq = await page.inputValue('#rb-eq');
  assert(restoredEq.includes('C6H12O6'), 'last balanced equation restored into input on reload');

  // ---------------- 10) canonical state for the thumbnail ----------------
  await balanceExpect('C2H6 + O2 -> CO2 + H2O', '2,7,4,6');
  await page.evaluate(() => { document.activeElement && document.activeElement.blur && document.activeElement.blur(); });
  // frame the dark artifact tile so the frosted sticky navs sit over the tile's empty
  // top area (the hero's 64px bottom padding), not over the hero's preset chips
  await page.evaluate(() => {
    const r = document.getElementById('rb-result');
    const y = r.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo(0, y);
  });
  await page.waitForFunction(() => document.getElementById('rb-result').dataset.status === 'ok-unique');
  // settle any hover/focus transitions before the shot (lesson 07-18 / 07-22)
  await page.mouse.move(10, 10);
  await page.waitForTimeout(240);
  await screenshot('thumb.png');
}
