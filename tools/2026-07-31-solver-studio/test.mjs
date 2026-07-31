// Integration test for 规划求解 · Solver Studio.
// Asserts real optimisation output through the UI — textbook optima, shadow prices,
// sensitivity ranges verified against a hand-derived textbook answer, branch & bound
// results checked against brute force — plus the layout/visibility guards that DOM
// existence assertions are structurally blind to.
export default async ({ page, toolURL, screenshot, assert }) => {
  const text = (sel) => page.$eval(sel, (el) => el.textContent.trim());
  const num = (s) => { const m = String(s).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/); return m ? parseFloat(m[0]) : NaN; };
  const display = (sel) => page.$eval(sel, (el) => getComputedStyle(el).display);
  const rect = (sel) => page.$eval(sel, (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height, right: r.right, bottom: r.bottom, top: r.top, left: r.left };
  });
  // never a fixed timeout — wait until the solve counter advances
  const settle = async (fn) => {
    const before = await page.evaluate(() => document.body.dataset.runs || '0');
    await fn();
    await page.waitForFunction((b) => (document.body.dataset.runs || '0') !== b, before, { timeout: 10000 });
  };
  const solveSrc = (src) => settle(async () => {
    await page.fill('#src', src);
    await page.click('#btn-solve');
  });
  const row = (table, name) => page.$$eval(table + ' tbody tr', (trs, n) => {
    const tr = trs.find((t) => t.cells[0] && t.cells[0].textContent.trim().startsWith(n));
    return tr ? Array.from(tr.cells).map((c) => c.textContent.trim()) : null;
  }, name);
  const rowCount = (table) => page.$$eval(table + ' tbody tr', (trs) => trs.length);

  await page.goto(toolURL, { waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.solved === 'optimal', null, { timeout: 10000 });

  // ── shell ───────────────────────────────────────────────────────────
  assert((await page.title()).includes('规划求解'), 'title names the tool');
  assert(await page.$('a.back[href="../../"]'), 'back link to the hub exists');

  // ── 1 · Wyndor Glass (Hillier & Lieberman): z*=36 at (2, 6) ─────────
  // Loaded as the default model. Every number below is the textbook answer.
  assert(num(await text('#obj-value')) === 36, `default model solves to z*=36, got ${await text('#obj-value')}`);
  const chips = await page.$$eval('#solution-chips .chip', (els) => els.map((e) => e.textContent.replace(/\s+/g, '')));
  assert(chips.includes('门=2'), `门 = 2 in the solution chips (got ${chips.join(', ')})`);
  assert(chips.includes('窗=6'), `窗 = 6 in the solution chips (got ${chips.join(', ')})`);
  assert(num(await text('#s-vars')) === 2 && num(await text('#s-cons')) === 3, 'hero stats report 2 variables / 3 constraints');

  // shadow prices: y = (0, 1.5, 1) — the textbook dual solution
  const c1 = await row('#con-table', '车间1');
  const c2 = await row('#con-table', '车间2');
  const c3 = await row('#con-table', '车间3');
  assert(num(c1[5]) === 0, `车间1 shadow price is 0 (slack constraint), got ${c1[5]}`);
  assert(num(c2[5]) === 1.5, `车间2 shadow price is 1.5, got ${c2[5]}`);
  assert(num(c3[5]) === 1, `车间3 shadow price is 1, got ${c3[5]}`);
  assert(num(c1[4]) === 2, `车间1 has slack 2 (uses 2 of 4), got ${c1[4]}`);
  assert(num(c2[4]) === 0 && num(c3[4]) === 0, 'the two binding constraints have zero slack');
  // 强对偶恒等式，直接从渲染出来的表里核: Σ y_i·b_i = z*
  const dualObj = (num(c1[5]) * num(c1[3])) + (num(c2[5]) * num(c2[3])) + (num(c3[5]) * num(c3[3]));
  assert(Math.abs(dualObj - 36) < 1e-9, `strong duality holds on screen: Σy·b = ${dualObj} = z*`);

  // reduced costs are zero for both basic variables
  const vMen = await row('#var-table', '门');
  const vChuang = await row('#var-table', '窗');
  assert(num(vMen[1]) === 2 && num(vChuang[1]) === 6, 'variable table repeats the optimum (2, 6)');
  assert(num(vMen[3]) === 0 && num(vChuang[3]) === 0, 'both variables are basic, so reduced costs are 0');
  assert(vMen[4].includes('基变量'), '门 is flagged as a basic variable');

  // ── 2 · panels are truly hidden, not just hidden-attributed ─────────
  // (an author rule like .panel{display:block} would beat the UA [hidden] rule)
  for (const p of ['#p-tableau', '#p-sens', '#p-geo', '#p-bnb']) {
    assert((await display(p)) === 'none', `${p} is visually hidden, computed display = none`);
  }
  assert((await display('#p-solution')) !== 'none', 'the solution panel is visible');
  assert((await display('#parse-err')) === 'none', 'no parse error banner on a valid model');

  // ── 3 · simplex tableau stepper drives real pivots ──────────────────
  await page.click('#t-tableau');
  assert((await display('#p-tableau')) !== 'none', 'the tableau panel shows after clicking its tab');
  assert((await display('#p-solution')) === 'none', 'the previous panel is hidden after switching tabs');
  const stepFirst = await text('#step-label');
  assert(/第 1 \/ \d+ 步/.test(stepFirst), `stepper starts at step 1 (got "${stepFirst}")`);
  const totalSteps = num(stepFirst.split('/')[1]);
  assert(totalSteps >= 3, `the tableau records the pivots plus the final table (got ${totalSteps})`);
  // the pivot cell is marked, and its column header is the entering variable
  const pivot0 = await page.$eval('#tableau td.piv', (el) => ({
    v: el.textContent.trim(),
    col: el.closest('table').tHead.rows[0].cells[el.cellIndex].textContent.trim()
  }));
  assert(pivot0.v !== '0', `the pivot element is non-zero (got ${pivot0.v})`);
  // the pivot cell must actually PAINT — the leaving-row tint (#tableau tr.leaverow td,
  // specificity 1,1,2) outranks a bare td.piv (1,1,1) and silently swallows the highlight
  const pivPaint = await page.$eval('#tableau td.piv', (el) => {
    const s = getComputedStyle(el);
    return { bg: s.backgroundColor, fg: s.color };
  });
  assert(pivPaint.bg === 'rgb(250, 255, 105)', `the pivot cell is painted brand yellow, not swallowed by the row tint (got ${pivPaint.bg})`);
  assert(pivPaint.fg === 'rgb(10, 10, 10)', `the pivot cell flips to black ink on yellow (got ${pivPaint.fg})`);
  // the column header must read exactly like the basis cell it refers to (s2, not S2)
  const headerCase = await page.$$eval('#tableau thead th', (ths) => ths.map((t) => t.textContent.trim()));
  assert(headerCase.some((h) => h === 's1'), `slack columns keep their lower-case names (got ${headerCase.join(', ')})`);
  assert((await text('#step-pivot')).startsWith(pivot0.col), `the pivot column matches the announced entering variable ${pivot0.col}`);
  // the z row of the FINAL tableau must be free of negatives — that is optimality
  assert(await page.$eval('#step-prev', (e) => e.disabled), 'the ◀ button is disabled on the first step');
  for (let i = 1; i < totalSteps; i++) await page.click('#step-next');
  assert((await text('#step-label')).startsWith(`第 ${totalSteps} / ${totalSteps} 步`), `stepper walked to step ${totalSteps} (got "${await text('#step-label')}")`);
  assert(await page.$eval('#step-next', (e) => e.disabled), 'the ▶ button is disabled on the last step');
  assert((await text('#step-pivot')).includes('最优'), 'the last step announces optimality rather than a pivot');
  const zRow = await page.$$eval('#tableau tr.zrow td', (tds) => tds.slice(1).map((t) => parseFloat(t.textContent)));
  assert(zRow.slice(0, -1).every((v) => v >= -1e-6), `final tableau is optimal: no negative reduced costs (${zRow.join(', ')})`);
  assert(Math.abs(zRow[zRow.length - 1] - 36) < 1e-6, `the final tableau's RHS corner carries z* = 36, got ${zRow[zRow.length - 1]}`);

  // ── 4 · sensitivity ranges match the textbook ───────────────────────
  await page.click('#t-sens');
  const sMen = await row('#sens-c', '门');
  const sChuang = await row('#sens-c', '窗');
  assert(num(sMen[2]) === 0 && num(sMen[3]) === 7.5, `c(门) ranges over [0, 7.5], got [${sMen[2]}, ${sMen[3]}]`);
  assert(num(sChuang[2]) === 2 && sChuang[3].includes('∞'), `c(窗) ranges over [2, +∞), got [${sChuang[2]}, ${sChuang[3]}]`);
  const sb2 = await row('#sens-b', '车间2');
  assert(num(sb2[3]) === 6 && num(sb2[4]) === 18, `b(车间2) ranges over [6, 18], got [${sb2[3]}, ${sb2[4]}]`);
  // and the range claim is true: at b2 = 18 the objective must be 36 + 1.5·(18−12) = 45
  await solveSrc('max 利润: 3门 + 5窗\n车间1: 门 <= 4\n车间2: 2窗 <= 18\n车间3: 3门 + 2窗 <= 18');
  assert(num(await text('#obj-value')) === 45,
    `the shadow price predicts the re-solve: b2 12→18 lifts z* 36→45, got ${await text('#obj-value')}`);
  await solveSrc('max 利润: 3门 + 5窗\n车间1: 门 <= 4\n车间2: 2窗 <= 13\n车间3: 3门 + 2窗 <= 18');
  assert(Math.abs(num(await text('#obj-value')) - 37.5) < 1e-9,
    `one extra unit of b2 buys exactly 1.5: z* = 37.5, got ${await text('#obj-value')}`);

  // ── 5 · feasible region: geometry AND the numeric vertex table ──────
  await solveSrc('max 利润: 3门 + 5窗\n车间1: 门 <= 4\n车间2: 2窗 <= 12\n车间3: 3门 + 2窗 <= 18');
  await page.click('#t-geo');
  assert((await display('#geo-na')) === 'none', 'the "not 2-D" note is hidden for a two-variable model');
  assert(await page.$('#geo-svg polygon'), 'the feasible polygon is drawn');
  const polyPts = await page.$eval('#geo-svg polygon', (el) => el.getAttribute('points').trim().split(/\s+/).length);
  assert(polyPts === 5, `the Wyndor feasible region is a pentagon, got ${polyPts} corners`);
  assert((await rowCount('#vertex-table')) === 5, 'the vertex table lists all 5 vertices');
  const vTop = await page.$$eval('#vertex-table tbody tr', (trs) => Array.from(trs[0].cells).map((c) => c.textContent.trim()));
  assert(num(vTop[1]) === 2 && num(vTop[2]) === 6 && num(vTop[3]) === 36,
    `the best vertex is (2, 6) with z = 36, got (${vTop[1]}, ${vTop[2]}) z=${vTop[3]}`);
  assert(vTop[0].includes('最优'), 'the optimal vertex is tagged in the table');
  // every listed vertex must actually satisfy the constraints (the table is not decoration)
  const verts = await page.$$eval('#vertex-table tbody tr', (trs) => trs.map((t) => [parseFloat(t.cells[1].textContent), parseFloat(t.cells[2].textContent)]));
  for (const [x, y] of verts) {
    assert(x <= 4 + 1e-9 && 2 * y <= 12 + 1e-9 && 3 * x + 2 * y <= 18 + 1e-9 && x >= -1e-9 && y >= -1e-9,
      `listed vertex (${x}, ${y}) is feasible`);
  }
  assert(Math.max(...verts.map(([x, y]) => 3 * x + 5 * y)) === 36, 'no listed vertex beats the reported optimum');

  // no two SVG labels may overlap — looped fillText/text is where this tool would fail
  const labelOverlap = await page.$$eval('#geo-svg text', (els) => {
    const rs = els.map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0);
    let worst = null;
    for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) {
      const a = rs[i], b = rs[j];
      if (!(a.right < b.left || b.right < a.left || a.bottom < b.top || b.bottom < a.top)) {
        worst = [els[i].textContent, els[j].textContent];
      }
    }
    return worst;
  });
  assert(labelOverlap === null, `no two plot labels overlap (offenders: ${JSON.stringify(labelOverlap)})`);
  // toggles really remove their layers
  const linesBefore = await page.$$eval('#geo-svg line', (e) => e.length);
  await page.click('#tg-lines');
  await page.waitForFunction((n) => document.querySelectorAll('#geo-svg line').length < n, linesBefore, { timeout: 4000 });
  assert((await page.$eval('#tg-lines', (e) => e.getAttribute('aria-pressed'))) === 'false', 'the constraint-lines toggle turns off');
  await page.click('#tg-lines');
  await page.waitForFunction((n) => document.querySelectorAll('#geo-svg line').length === n, linesBefore, { timeout: 4000 });

  // ── 6 · integer programming: B&B vs brute force ─────────────────────
  await settle(() => page.selectOption('#preset', '5'));       // 背包选品 · 0-1 knapsack
  assert(num(await text('#obj-value')) === 235,
    `0/1 knapsack (10/20/30/15 kg, cap 50) optimum is 60+100+75 = 235, got ${await text('#obj-value')}`);
  const kChips = await page.$$eval('#solution-chips .chip', (els) => els.map((e) => e.textContent.replace(/\s+/g, '')));
  assert(kChips.includes('甲=1') && kChips.includes('乙=1') && kChips.includes('丁=1') && kChips.includes('丙=0'),
    `the knapsack picks 甲/乙/丁 and drops 丙 (got ${kChips.join(', ')})`);
  await page.click('#t-bnb');
  assert((await display('#bnb-na')) === 'none', 'the branch-and-bound panel is live for an integer model');
  const bnbStats = await page.$$eval('#bnb-stats .stat-num', (els) => els.map((e) => e.textContent.trim()));
  assert(parseFloat(bnbStats[1]) === 255, `the LP relaxation bound is 255 (fractional 丙), got ${bnbStats[1]}`);
  assert(parseFloat(bnbStats[2]) === 235 && parseFloat(bnbStats[3]) === 20, `integer optimum 235 with a gap of 20, got ${bnbStats[2]}/${bnbStats[3]}`);
  assert(parseFloat(bnbStats[1]) >= parseFloat(bnbStats[2]) - 1e-9, 'the relaxation bound dominates the integer optimum');
  assert((await rowCount('#bnb-table')) >= 2, 'the search tree lists its explored nodes');
  const nodeStatuses = await page.$$eval('#bnb-table tbody tr', (trs) => trs.map((t) => t.cells[4] && t.cells[4].textContent.trim()));
  assert(nodeStatuses.includes('整数解'), `at least one node closes with an integer solution (${nodeStatuses.join(', ')})`);

  // sensitivity is withheld for MIPs — and the tables must really be gone, not just [hidden]
  await page.click('#t-sens');
  assert((await display('#sens-tables')) === 'none', 'sensitivity tables are hidden for an integer model');
  assert((await display('#sens-mip-note')) !== 'none', 'and the explanation note is shown instead');

  // ── 7 · degenerate / pathological models are handled, not crashed ───
  await solveSrc('max x + y\nx + y >= 10\nx + y <= 4');
  assert((await page.$eval('#verdict', (e) => e.dataset.status)) === 'infeasible', 'contradictory constraints report infeasible');
  assert((await text('#v-badge')) === '无可行解', 'the verdict badge says 无可行解');
  await solveSrc('max x + y\nx - y <= 3');
  assert((await page.$eval('#verdict', (e) => e.dataset.status)) === 'unbounded', 'a model with no upper bound reports unbounded');
  await solveSrc('max 3x + 5y\nx <= 4\n2y <= ');
  assert((await display('#parse-err')) !== 'none', 'a malformed line surfaces a parse error banner');
  assert((await text('#parse-err')).includes('第 3 行'), `the parse error names the offending line, got "${await text('#parse-err')}"`);
  assert((await page.$eval('#verdict', (e) => e.dataset.status)) === 'error', 'the verdict band switches to the error state');
  // ...and recovers
  await solveSrc('min 0.6燕麦 + 1.0牛奶\n蛋白: 10燕麦 + 4牛奶 >= 20\n钙质: 5燕麦 + 5牛奶 >= 20\n纤维: 2燕麦 + 6牛奶 >= 12');
  assert((await display('#parse-err')) === 'none', 'the error banner clears once the model parses again');
  assert(Math.abs(num(await text('#obj-value')) - 2.8) < 1e-9,
    `the two-phase (all ≥) diet model costs 2.8 at 燕麦=3, 牛奶=1, got ${await text('#obj-value')}`);
  const dOat = await row('#var-table', '燕麦');
  assert(num(dOat[1]) === 3, `燕麦 = 3 in the diet optimum, got ${dOat[1]}`);
  const dCal = await row('#con-table', '钙质');
  assert(num(dCal[5]) > 0, `a binding ≥ constraint in a min problem has a positive shadow price, got ${dCal[5]}`);

  // ── 8 · state survives a reload (localStorage round trip) ───────────
  await solveSrc('max 7a + 9b\ncap: 2a + 3b <= 30\nlim: a <= 8');
  // a is the better use of the resource (7/2 = 3.5 vs 9/3 = 3), so a saturates its own cap
  // at 8, leaving 14 units → b = 14/3, and z* = 56 + 42 = 98.
  assert(num(await text('#obj-value')) === 98, `7a+9b under 2a+3b≤30, a≤8 gives z*=98 at a=8, b=14/3, got ${await text('#obj-value')}`);
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.solved === 'optimal', null, { timeout: 10000 });
  assert((await page.$eval('#src', (e) => e.value)).includes('7a + 9b'), 'the model is restored from localStorage after a reload');
  assert(num(await text('#obj-value')) === 98, 'and it re-solves to the same optimum on load');
  const gutterLines = await page.$eval('#gutter', (e) => e.textContent.trim().split('\n').length);
  const srcLines = await page.$eval('#src', (e) => e.value.split('\n').length);
  assert(gutterLines === srcLines, `the gutter numbers every source line (${gutterLines} vs ${srcLines})`);
  // …and each number must occupy its own visual row: without white-space:pre the newlines
  // collapse and the numbers reflow into columns, silently mis-labelling every line.
  const gutterRows = await page.$eval('#gutter', (el) => {
    const r = document.createRange();
    r.selectNodeContents(el);
    const tops = new Set(Array.from(r.getClientRects()).filter((x) => x.width > 0).map((x) => Math.round(x.top)));
    return tops.size;
  });
  assert(gutterRows === srcLines, `each line number renders on its own row (${gutterRows} rows for ${srcLines} lines)`);

  // keyboard: ⌘/Ctrl+Enter solves from inside the editor
  await settle(async () => {
    await page.focus('#src');
    await page.fill('#src', 'max 2x + 3y\nx + y <= 10\ny <= 4');
    await page.keyboard.press('Control+Enter');
  });
  assert(num(await text('#obj-value')) === 24, `Ctrl+Enter solves: max 2x+3y with x+y≤10, y≤4 → 24, got ${await text('#obj-value')}`);

  // ── 9 · layout guards (DOM existence assertions are blind to these) ─
  await solveSrc('max 利润: 3门 + 5窗\n车间1: 门 <= 4\n车间2: 2窗 <= 12\n车间3: 3门 + 2窗 <= 18');
  const overflow1280 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow1280 <= 1, `no horizontal overflow at 1280px (got ${overflow1280}px)`);
  // controls must render at a usable size — a generic selector can squash them to ~0
  for (const [sel, minW, minH] of [['#btn-solve', 60, 32], ['#btn-solve2', 90, 32], ['#preset', 120, 32], ['#src', 200, 200], ['#gutter', 30, 100]]) {
    const r = await rect(sel);
    assert(r.w >= minW && r.h >= minH, `${sel} renders at a usable size (${Math.round(r.w)}×${Math.round(r.h)}, need ≥${minW}×${minH})`);
  }
  // every button/select must stay inside its own card — a stray absolute rule flings them to 0,0
  const escapees = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.card, .verdict, .code-window').forEach((card) => {
      const c = card.getBoundingClientRect();
      card.querySelectorAll('button, select, input, table, svg').forEach((el) => {
        if (el.offsetParent === null && getComputedStyle(el).display === 'none') return;
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        if (r.left < c.left - 1 || r.right > c.right + 1 || r.top < c.top - 1 || r.bottom > c.bottom + 1) {
          out.push((el.id || el.tagName) + ' escapes ' + (card.className));
        }
      });
    });
    return out;
  });
  assert(escapees.length === 0, `no control escapes its card: ${escapees.join(' | ')}`);
  // the plot must sit inside its card
  await page.click('#t-geo');
  const svgR = await rect('#geo-svg'), geoCardR = await rect('#geo-card');
  assert(svgR.left >= geoCardR.left - 1 && svgR.right <= geoCardR.right + 1, 'the plot stays inside its card horizontally');
  assert(svgR.w > 300 && svgR.h > 200, `the plot renders at a real size (${Math.round(svgR.w)}×${Math.round(svgR.h)})`);

  // phone width: tables scroll inside their own wrapper, the page itself does not
  await page.setViewportSize({ width: 390, height: 900 });
  await page.click('#t-solution');
  const overflow390 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow390 <= 1, `no horizontal overflow at 390px (got ${overflow390}px)`);
  await page.click('#t-tableau');
  const overflowTableau = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflowTableau <= 1, `the wide simplex tableau does not burst the page at 390px (got ${overflowTableau}px)`);
  await page.click('#t-geo');
  const overflowGeo = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflowGeo <= 1, `the plot panel has no horizontal overflow at 390px (got ${overflowGeo}px)`);

  // ── 10 · views for manual review + the card thumbnail ───────────────
  await page.setViewportSize({ width: 1280, height: 850 });
  // scroll each panel into frame before shooting — a shot of the page top proves nothing
  // about what the panel itself renders (this is where label collisions actually show up)
  const shotPanel = async (tab, name) => {
    await page.click(tab);
    await page.evaluate(() => {
      const y = document.getElementById('tabs').getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, Math.max(0, Math.round(y - 8)));
    });
    await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running'), null, { timeout: 4000 });
    await screenshot(name);
  };
  await shotPanel('#t-geo', 'view-geo.png');
  await shotPanel('#t-tableau', 'view-tableau.png');
  await shotPanel('#t-sens', 'view-sens.png');
  await shotPanel('#t-solution', 'view-solution.png');
  // the branch-and-bound / MIP views only render with an integer model loaded
  await settle(() => page.selectOption('#preset', '5'));
  await shotPanel('#t-bnb', 'view-bnb.png');
  await shotPanel('#t-sens', 'view-sens-mip.png');

  await page.click('#t-solution');
  await settle(() => page.selectOption('#preset', '0'));
  // frame the shot so the yellow verdict band and the editor are both fully in view
  await page.evaluate(() => {
    const band = document.getElementById('verdict').getBoundingClientRect();
    window.scrollTo(0, Math.max(0, Math.round(band.bottom + window.scrollY - window.innerHeight + 24)));
  });
  const framing = await page.evaluate(() => {
    const nav = document.querySelector('.nav').getBoundingClientRect();
    const band = document.getElementById('verdict').getBoundingClientRect();
    const cw = document.querySelector('.code-window').getBoundingClientRect();
    return { navB: nav.bottom, bandTop: band.top, bandBottom: band.bottom, cwTop: cw.top, cwBottom: cw.bottom, vh: window.innerHeight };
  });
  assert(framing.bandTop > framing.navB && framing.bandBottom < framing.vh,
    `the yellow result band is fully in frame for the thumbnail (${Math.round(framing.bandTop)}–${Math.round(framing.bandBottom)} within ${framing.navB}–${framing.vh})`);
  assert(framing.cwBottom > framing.navB + 120, 'a substantial slice of the model editor is in frame');
  await page.waitForFunction(() => document.getElementById('obj-value').textContent.trim() === '36', null, { timeout: 4000 });
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running'), null, { timeout: 4000 });
  await screenshot('thumb.png');
};
