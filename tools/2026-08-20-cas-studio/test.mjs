// Integration test for 符号计算工作台 · CAS Studio.
// Drives the real symbolic engine through the page and asserts concrete mathematical
// output (exact LaTeX / roots / numbers), not just element presence.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#expr');
  await page.waitForFunction(() => window.__cas && document.getElementById('latexOut').textContent.length > 0);

  const text = async (sel) => ((await page.locator(sel).textContent()) || '').trim();
  const latex = () => text('#latexOut');
  const waitLatex = (want) => page.waitForFunction((w) => (document.getElementById('latexOut').textContent || '').trim() === w, want, { timeout: 8000 });
  const waitLatexHas = (want) => page.waitForFunction((w) => (document.getElementById('latexOut').textContent || '').includes(w), want, { timeout: 8000 });
  const act = async (name) => { await page.click(`.cs-act[data-act="${name}"]`); };
  const setExpr = async (v) => { await page.fill('#expr', v); };
  const display = (sel) => page.$eval(sel, (el) => getComputedStyle(el).display);
  const badges = async (sel) => (await page.locator(sel + ' .cs-badge').allTextContents()).join(' | ');

  /* ---------- 0. shell ---------- */
  assert((await page.locator('a.cs-back').getAttribute('href')) === '../../', 'the back link points at the hub');
  assert((await text('h1')).includes('符号计算'), 'the page title is on screen');
  assert(await display('#panel-solve') === 'none', 'non-active panels are really hidden (computed display)');
  assert(await display('#panel-derive') !== 'none', 'the derive panel is visible');

  /* ---------- 1. differentiation ---------- */
  await setExpr('x^2*sin(x)');
  await act('diff');
  await waitLatex('x^{2} \\cos\\left(x\\right) + 2 x \\sin\\left(x\\right)');
  assert((await latex()) === 'x^{2} \\cos\\left(x\\right) + 2 x \\sin\\left(x\\right)', `d/dx x^2 sin x is right (got ${await latex()})`);
  const rendered = await text('#result');
  assert(/cos/.test(rendered) && /sin/.test(rendered), `the typeset result shows both trig factors (got "${rendered}")`);
  const steps = await page.locator('#steps li').count();
  assert(steps >= 3, `the derivation lists its steps (got ${steps})`);
  const ruleNames = (await page.locator('.cs-steprule').allTextContents()).join(',');
  assert(ruleNames.includes('乘法法则'), `the product rule is named in the steps (got ${ruleNames})`);
  assert(await display('#stepsEmpty') === 'none', 'the steps empty-state is hidden when there are steps');
  assert(await display('#extraRow') === 'none', 'the limit/series inputs stay hidden for differentiation');

  /* ---------- 2. integration, with the answer differentiated back ---------- */
  await setExpr('x*exp(x)');
  await act('integrate');
  await waitLatex('x \\exp\\left(x\\right) - \\exp\\left(x\\right)');
  assert((await badges('#badges')).includes('回验'), `the antiderivative reports its verification (got ${await badges('#badges')})`);
  assert((await text('#resultNote')).includes('C'), 'the note mentions the omitted integration constant');
  assert((await page.locator('.cs-steprule').allTextContents()).join(',').includes('分部积分'), 'integration by parts is named');

  await setExpr('(3x+5)/(x^2+x-2)');
  await act('integrate');
  await waitLatexHas('\\ln\\left(\\left|x - 1\\right|\\right)');
  assert((await latex()) === '\\frac{8 \\ln\\left(\\left|x - 1\\right|\\right)}{3} + \\frac{\\ln\\left(\\left|x + 2\\right|\\right)}{3}', `partial fractions integral is right (got ${await latex()})`);
  assert((await page.locator('.cs-steprule').allTextContents()).join(',').includes('部分分式'), 'partial fraction decomposition is named');

  await setExpr('exp(x^2)');
  await act('integrate');
  await page.waitForFunction(() => (document.getElementById('resultNote').textContent || '').includes('初等原函数'));
  assert((await text('#result')).includes('没有结果'), 'a non-elementary integral is refused rather than faked');
  assert((await latex()) === '', 'no LaTeX is offered for a refused integral');

  /* ---------- 3. algebra ---------- */
  await setExpr('6x^2+5x-6');
  await act('factor');
  await waitLatex('\\left(2 x + 3\\right) \\left(3 x - 2\\right)');
  assert((await latex()) === '\\left(2 x + 3\\right) \\left(3 x - 2\\right)', 'factoring over the integers');

  await setExpr('(x+1)^5');
  await act('expand');
  await waitLatex('x^{5} + 5 x^{4} + 10 x^{3} + 10 x^{2} + 5 x + 1');
  assert((await latex()).startsWith('x^{5} + 5 x^{4}'), 'binomial expansion is ordered by descending degree');

  await setExpr('sin(x)^2+cos(x)^2');
  await act('simplify');
  await waitLatex('1');
  assert((await latex()) === '1', 'the Pythagorean identity collapses to 1');

  /* ---------- 4. limits and series ---------- */
  await setExpr('sin(x)/x');
  await act('limit');
  assert(await display('#extraRow') !== 'none', 'the limit inputs appear for a limit');
  assert(await display('#fieldOrder') === 'none', 'the series order input stays hidden for a limit');
  await page.fill('#point', '0');
  await page.click('.cs-act[data-act="limit"]');
  await waitLatex('1');
  assert((await badges('#badges')).includes('洛必达'), `the limit says how it was obtained (got ${await badges('#badges')})`);

  await setExpr('1/x');
  await page.fill('#point', '0');
  await page.selectOption('#dir', '+');
  await page.click('.cs-act[data-act="limit"]');
  await page.waitForFunction(() => (document.getElementById('resultNote').textContent || '').includes('发散'));
  assert((await badges('#badges')).includes('INF'), 'a divergent one-sided limit is reported as divergent');
  await page.selectOption('#dir', '');

  await setExpr('exp(x)');
  await act('taylor');
  assert(await display('#fieldOrder') !== 'none', 'the order input appears for a series');
  await page.fill('#order', '5');
  await page.click('.cs-act[data-act="taylor"]');
  await waitLatex('\\frac{x^{5}}{120} + \\frac{x^{4}}{24} + \\frac{x^{3}}{6} + \\frac{x^{2}}{2} + x + 1');
  assert((await latex()).includes('\\frac{x^{5}}{120}'), 'the fifth-order Taylor term is 1/120');

  /* ---------- 5. bad input ---------- */
  await setExpr('2x+');
  await page.click('.cs-act[data-act="simplify"]');
  await page.waitForFunction(() => !document.getElementById('errorMsg').hidden);
  assert((await text('#errorMsg')).includes('解析失败'), 'an incomplete expression is reported');
  assert(await display('#errorMsg') !== 'none', 'the error really renders');
  await setExpr('x@1');
  await page.click('.cs-act[data-act="simplify"]');
  await page.waitForFunction(() => (document.getElementById('errorMsg').textContent || '').includes('无法识别'));
  assert(true, 'an unknown character is reported');

  /* ---------- 6. plot ---------- */
  await setExpr('x^2*sin(x)');
  await act('diff');
  await waitLatex('x^{2} \\cos\\left(x\\right) + 2 x \\sin\\left(x\\right)');
  const plot = await page.evaluate(() => window.__plot);
  assert(plot.curves === 2, `both the input and the result are drawn (got ${plot.curves})`);
  assert(plot.dropped === 0, `no axis or legend label was dropped by the collision guard (dropped ${plot.dropped})`);
  assert(plot.drawn.length >= 10, `axis ticks and legend labels are actually drawn (got ${plot.drawn.length})`);
  const rows = await page.locator('#plotTable tbody tr').count();
  assert(rows === 7, `the readable sample table backs up the picture (got ${rows} rows)`);
  const firstRow = await page.locator('#plotTable tbody tr').first().textContent();
  assert(/-6/.test(firstRow || ''), `the table starts at the left edge of the range (got "${firstRow}")`);
  await page.fill('#xmin', '-3');
  await page.fill('#xmax', '3');
  await page.click('#replot');
  await page.waitForFunction(() => (document.querySelector('#plotTable tbody tr td').textContent || '').indexOf('-3') === 0);
  assert(await page.evaluate(() => window.__plot.dropped) === 0, 'no labels are dropped after re-ranging either');

  /* ---------- 7. copy + reuse ---------- */
  await page.click('#copyLatex');
  await page.waitForFunction(() => document.getElementById('copyLatex').dataset.copied === '1');
  assert(true, 'copying the LaTeX reports success');
  await page.click('#useResult');
  await page.waitForFunction(() => document.getElementById('expr').value.includes('cos'));
  assert((await page.inputValue('#expr')).includes('cos(x)'), 'the result can be pushed back into the input');

  /* ---------- 8. solving ---------- */
  await page.click('#tab-solve');
  assert(await display('#panel-solve') !== 'none', 'the solve panel opens');
  assert(await display('#panel-derive') === 'none', 'the derive panel is hidden by the tab switch');
  const solveWith = async (eq) => {
    await page.fill('#eq', eq);
    await page.click('#solveBtn');
    await page.waitForFunction(() => document.querySelectorAll('#rootsTable tbody tr').length > 0);
  };
  await solveWith('x^2 - 5x + 6 = 0');
  let cells = await page.locator('#rootsTable tbody tr').allTextContents();
  assert(cells.length === 2, `a quadratic has two roots (got ${cells.length})`);
  assert(cells.join(' ').includes('2') && cells.join(' ').includes('3'), `roots are 2 and 3 (got ${cells.join(' / ')})`);
  assert(cells.every((c) => c.includes('代回为 0')), 'each root is verified by substitution');

  await solveWith('x^2 - 2 = 0');
  cells = await page.locator('#rootsTable tbody tr').allTextContents();
  assert(cells.join(' ').includes('1.41421356'), `the irrational root shows its decimal (got ${cells.join(' / ')})`);
  assert((await page.locator('#rootsTable tbody .cs-math').first().textContent()).includes('√'), 'the exact root keeps its radical');

  await solveWith('x^2 + x + 1 = 0');
  cells = await page.locator('#rootsTable tbody tr').allTextContents();
  assert(cells.length === 2 && cells.join(' ').includes('0.866025'), `complex roots report their imaginary part (got ${cells.join(' / ')})`);

  await solveWith('1/(x-1) = 2');
  assert((await badges('#solveBadges')).includes('排除极点'), `the pole is excluded (got ${await badges('#solveBadges')})`);
  cells = await page.locator('#rootsTable tbody tr').allTextContents();
  assert(cells.join(' ').includes('1.5'), `1/(x-1)=2 gives x = 3/2 (got ${cells.join(' / ')})`);

  await solveWith('cos(x) = x');
  cells = await page.locator('#rootsTable tbody tr').allTextContents();
  assert(cells.join(' ').includes('0.73908513'), `the transcendental root is found numerically (got ${cells.join(' / ')})`);
  assert((await badges('#solveBadges')).includes('数值解'), 'a numeric solution is labelled as such');

  await solveWith('x^3 - 6x^2 + 11x - 6 = 0');
  cells = await page.locator('#rootsTable tbody tr').allTextContents();
  assert(cells.length === 3, `the cubic returns three roots (got ${cells.length})`);

  /* ---------- 9. linear systems ---------- */
  const sysWith = async (lines, vars) => {
    await page.fill('#sysInput', lines);
    await page.fill('#sysVars', vars);
    await page.click('#sysBtn');
    await page.waitForFunction(() => document.querySelectorAll('#sysBadges .cs-badge').length > 0);
  };
  await sysWith('2x + 3y = 8\nx - y = 1', 'x, y');
  const sysRows = await page.locator('#sysTable tbody tr').allTextContents();
  assert(sysRows.length === 2, 'two unknowns, two rows');
  assert(sysRows.join(' ').includes('2.2') && sysRows.join(' ').includes('1.2'), `exact solution 11/5, 6/5 (got ${sysRows.join(' / ')})`);
  assert((await page.locator('#sysTable tbody .cs-math').first().textContent()).includes('11'), 'the exact fraction is typeset');

  await sysWith('x + y = 1\n2x + 2y = 2', 'x, y');
  assert((await badges('#sysBadges')).includes('无穷多解'), `dependent equations are classified (got ${await badges('#sysBadges')})`);
  await sysWith('x + y = 1\nx + y = 2', 'x, y');
  assert((await badges('#sysBadges')).includes('无解'), 'inconsistent equations are classified');
  await sysWith('x + y + z = 6\n2y + z = 7\nx - z = -2', 'x, y, z');
  const sys3 = (await page.locator('#sysTable tbody tr td:last-child').allTextContents()).map((s) => s.trim());
  assert(sys3.join(',') === '1,2,3', `3x3 system solves to x=1, y=2, z=3 (got ${sys3.join(',')})`);

  /* ---------- 10. numeric panel ---------- */
  await page.click('#tab-numeric');
  await page.fill('#evalExpr', 'x^2 + 3x - 1');
  await page.fill('#evalBind', 'x = 2');
  await page.click('#evalBtn');
  await page.waitForFunction(() => (document.getElementById('evalBadges').textContent || '').includes('数值'));
  assert((await badges('#evalBadges')).includes('9'), `substituting x = 2 gives 9 (got ${await badges('#evalBadges')})`);
  assert((await badges('#evalBadges')).includes('精确有理数'), 'the exact rational value is reported too');

  await page.fill('#evalExpr', 'x/3 + 1/6');
  await page.fill('#evalBind', 'x = 1/2');
  await page.click('#evalBtn');
  await page.waitForFunction(() => (document.getElementById('evalBadges').textContent || '').includes('1/3'));
  assert((await badges('#evalBadges')).includes('1/3'), `fractions stay exact: 1/2 / 3 + 1/6 = 1/3 (got ${await badges('#evalBadges')})`);

  await page.fill('#intExpr', 'sin(x)*exp(-x)');
  await page.fill('#intA', '0');
  await page.fill('#intB', 'pi');
  await page.click('#intBtn');
  await page.waitForFunction(() => (document.getElementById('intBadges').textContent || '').includes('数值'));
  const intB = await badges('#intBadges');
  assert(intB.includes('0.5216069'), `the definite integral is 0.52160696 (got ${intB})`);
  assert(intB.includes('一致'), `symbolic and numeric agree (got ${intB})`);
  assert((await text('#intAnti')).length > 0, 'the antiderivative is shown');

  await page.fill('#intExpr', 'exp(-x^2)');
  await page.fill('#intA', '0');
  await page.fill('#intB', '1');
  await page.click('#intBtn');
  await page.waitForFunction(() => (document.getElementById('intBadges').textContent || '').includes('0.746824'));
  assert((await text('#intAnti')).includes('没有初等原函数'), 'a non-elementary integrand falls back to numbers only');
  assert((await badges('#intBadges')).includes('0.7468241'), 'the numeric value of the Gaussian tail is right');

  /* ---------- 11. notebook: definitions + persistence ---------- */
  await page.click('#tab-book');
  await page.fill('#defInput', 'f(x) := x^2 + 1');
  await page.click('#defAdd');
  await page.waitForFunction(() => document.querySelectorAll('#defList li').length === 1);
  assert((await text('#defList')).includes('函数 f(x)'), 'the definition is parsed and described');
  assert(await display('#defEmpty') === 'none', 'the empty state disappears once a definition exists');

  await page.click('#tab-derive');
  await setExpr('f(x)');
  await act('diff');
  await waitLatex('2 x');
  assert((await latex()) === '2 x', 'a user-defined function can be differentiated');

  const historyCount = await page.locator('#history li').count();
  assert(historyCount >= 3, `the notebook remembers what was computed (got ${historyCount})`);

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__cas && document.querySelectorAll('#defList li').length === 1);
  assert((await text('#defList')).includes('f(x)'), 'definitions survive a reload (localStorage)');
  assert((await page.locator('#history li').count()) >= 3, 'history survives a reload too');

  /* ---------- 12. the published engine itself, exercised in the browser ---------- */
  const engineChecks = await page.evaluate(() => {
    const C = window.__cas;
    const out = { roundTrip: 0, roundTripBad: 0, derivBad: 0, derivChecked: 0, intBad: 0, intChecked: 0 };
    let seed = 123456789;
    const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    const int = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
    const srcs = [];
    const atoms = ['x', '2', '3/4', 'x^2', 'sin(x)', 'cos(x)', 'exp(x)', 'ln(x^2+1)', 'atan(x)', 'sqrt(x^2+1)', '1/(x^2+2)'];
    for (let i = 0; i < 300; i++) {
      const op = ['+', '-', '*', '/'][int(0, 3)];
      const a = atoms[int(0, atoms.length - 1)], b = atoms[int(0, atoms.length - 1)];
      srcs.push(op === '/' ? `(${a})/(x^2+3)` : `(${a}) ${op} (${b})`);
    }
    for (const s of srcs) {
      let e;
      try { e = C.parse(s); } catch (err) { continue; }
      out.roundTrip++;
      try { if (C.key(C.parse(C.toText(e))) !== C.key(e)) out.roundTripBad++; } catch (err) { out.roundTripBad++; }
      // derivative against a central finite difference
      try {
        const d = C.diff(e, 'x');
        const x0 = 0.7 + (out.roundTrip % 5) * 0.31;
        const h = 1e-5;
        const fd = (C.evalNum(e, { x: x0 + h }) - C.evalNum(e, { x: x0 - h })) / (2 * h);
        const sym = C.evalNum(d, { x: x0 });
        if (isFinite(fd) && isFinite(sym)) {
          out.derivChecked++;
          if (Math.abs(fd - sym) > 1e-4 * Math.max(1, Math.abs(sym))) out.derivBad++;
        }
      } catch (err) { /* undefined at the probe point */ }
      // any antiderivative we hand out must differentiate back
      try {
        const F = C.integrate(e, 'x');
        if (F) {
          out.intChecked++;
          if (C.verifyAntiderivative(F, e, 'x') === 'no') out.intBad++;
        }
      } catch (err) { /* integration failure is allowed, a wrong answer is not */ }
    }
    return out;
  });
  assert(engineChecks.roundTrip >= 250, `the in-page engine ran the round-trip fuzz (${engineChecks.roundTrip} expressions)`);
  assert(engineChecks.roundTripBad === 0, `every printed expression re-parses to itself in the browser (${engineChecks.roundTripBad} bad)`);
  assert(engineChecks.derivChecked >= 150, `derivatives were compared against finite differences (${engineChecks.derivChecked})`);
  assert(engineChecks.derivBad === 0, `no derivative disagrees with a finite difference (${engineChecks.derivBad} bad)`);
  assert(engineChecks.intChecked >= 50, `antiderivatives were re-differentiated (${engineChecks.intChecked})`);
  assert(engineChecks.intBad === 0, `every antiderivative handed to the user verifies (${engineChecks.intBad} bad)`);

  /* ---------- 13. structural guards ---------- */
  // every control on every tab must be big enough to use (hidden panels included)
  let scanned = 0;
  for (const tab of ['derive', 'solve', 'numeric', 'book']) {
    await page.click('#tab-' + tab);
    await page.waitForFunction((t) => !document.getElementById('panel-' + t).hidden, tab);
    const bad = await page.evaluate(() => {
      const out = [];
      let n = 0;
      for (const el of document.querySelectorAll('input, select, button, textarea')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue; // lives in another panel
        n++;
        const isBtn = el.tagName === 'BUTTON';
        const minW = isBtn ? 52 : 100;
        if (r.width < minW || r.height < 18) out.push(`${el.tagName}#${el.id || el.className} ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
      return { out, n };
    });
    scanned += bad.n;
    assert(bad.out.length === 0, `[${tab}] no control collapses: ${bad.out.join(', ')}`);
  }
  assert(scanned >= 40, `the size guard actually saw the controls (${scanned} scanned across 4 tabs)`);

  // no child escapes its card, and no cell content escapes its cell
  await page.click('#tab-derive');
  const escapes = await page.evaluate(() => {
    const bad = [];
    for (const card of document.querySelectorAll('.cs-card, td, th')) {
      const p = card.getBoundingClientRect();
      if (p.width === 0) continue;
      for (const kid of card.children) {
        const k = kid.getBoundingClientRect();
        if (k.width === 0 && k.height === 0) continue;
        if (k.left < p.left - 1 || k.right > p.right + 1 || k.top < p.top - 1 || k.bottom > p.bottom + 1) {
          bad.push(`${kid.tagName}.${kid.className} out of ${card.tagName}.${card.className}`);
        }
      }
    }
    return bad;
  });
  assert(escapes.length === 0, `nothing escapes its container: ${escapes.slice(0, 4).join(' | ')}`);

  // headers and labels must not have been case-mangled
  const shouty = await page.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll('th, dt, label')) {
      const t = (el.textContent || '').trim();
      if (/\b(HZ|KHZ|DBFS|DB|LN|SIN|COS)\b/.test(t)) bad.push(t);
      if (getComputedStyle(el).textTransform !== 'none') bad.push('text-transform on: ' + t);
    }
    return bad;
  });
  assert(shouty.length === 0, `no label was uppercased into a wrong symbol: ${shouty.join(' | ')}`);

  // math is allowed to scroll inside its own box, but the page must not scroll sideways
  for (const w of [390, 768]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForFunction(() => true);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert(over <= 1, `no horizontal overflow at ${w}px (overflow ${over}px)`);
  }
  await page.setViewportSize({ width: 1280, height: 850 });

  /* ---------- 14. settle on a good-looking state for the card thumbnail ---------- */
  await page.click('#tab-derive');
  await setExpr('x^2*sin(x)');
  await act('integrate');
  await page.waitForFunction(() => (document.getElementById('latexOut').textContent || '').includes('\\sin'));
  await page.evaluate(() => window.scrollTo(0, 470)); // frame the input + result + plot
  await page.waitForTimeout(220); // let the pill transitions settle before the shot
  await screenshot('thumb.png');
}
