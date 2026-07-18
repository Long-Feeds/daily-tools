// Integration test for 傅里叶画圆机 · Epicycle Machine.
// Drives the real DFT/IDFT engine through the browser and asserts concrete
// numeric outputs (exact reconstruction, single-harmonic circle, energy growth,
// live tip == engine), real UI interactions, save/load, freehand drawing, and
// layout-bound guards (controls must stay inside their containers). Captures
// thumb.png for the homepage card.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__fourier && window.__fourier.state().hasComps);

  // ============ ENGINE: DFT → IDFT reconstructs the samples exactly ============
  const roundtrip = await page.evaluate(() => {
    const F = window.__fourier;
    const N = 24, pts = [];
    for (let n = 0; n < N; n++) {
      const a = 2 * Math.PI * n / N;
      pts.push({ x: 3 * Math.cos(a) + Math.cos(3 * a), y: 2 * Math.sin(a) - 0.5 * Math.sin(2 * a) });
    }
    const comps = F.dft(pts);
    let maxErr = 0;
    for (let n = 0; n < N; n++) {
      const r = F.reconstruct(comps, n / N, N);
      maxErr = Math.max(maxErr, Math.hypot(r.x - pts[n].x, r.y - pts[n].y));
    }
    return { maxErr };
  });
  assert(roundtrip.maxErr < 1e-6, `IDFT with all harmonics reconstructs samples exactly (max err ${roundtrip.maxErr.toExponential(2)})`);

  // ============ ENGINE: pure CCW circle → one harmonic at freq +1, amp = radius ============
  const circle = await page.evaluate(() => {
    const F = window.__fourier;
    const N = 64, R = 5, pts = [];
    for (let n = 0; n < N; n++) { const a = 2 * Math.PI * n / N; pts.push({ x: R * Math.cos(a), y: R * Math.sin(a) }); }
    const s = F.dft(pts).slice().sort((a, b) => b.amp - a.amp);
    return { topFreq: s[0].freq, topAmp: s[0].amp, secondAmp: s[1].amp, R };
  });
  assert(circle.topFreq === 1, `CCW circle → dominant harmonic at freq +1 (got ${circle.topFreq})`);
  assert(Math.abs(circle.topAmp - circle.R) < 1e-6, `dominant amplitude equals radius ${circle.R} (got ${circle.topAmp.toFixed(5)})`);
  assert(circle.secondAmp < 1e-6, `every other harmonic ≈ 0 for a pure circle (2nd amp ${circle.secondAmp.toExponential(2)})`);

  // ============ ENGINE: energy coverage grows with harmonics, full = 100% ============
  const energy = await page.evaluate(() => {
    const F = window.__fourier;
    const comps = F.dft(F.resample(F.presetPoints('star'), 128));
    return { one: F.energyCoverage(comps, 1), few: F.energyCoverage(comps, 8), all: F.energyCoverage(comps, 128) };
  });
  assert(energy.all > 99.999, `all harmonics capture ~100% of the energy (got ${energy.all.toFixed(4)}%)`);
  assert(energy.one < energy.few && energy.few < energy.all,
    `coverage is monotonic in harmonic count (${energy.one.toFixed(1)} < ${energy.few.toFixed(1)} < ${energy.all.toFixed(1)})`);

  // ============ UI: preset load updates telemetry ============
  await page.click('.ep-preset[data-preset="star"]');
  await page.waitForFunction(() => window.__fourier.state().hasComps && window.__fourier.state().N === 200);
  const points = (await page.locator('#ep-points').textContent()).trim();
  assert(points === '200', `POINTS readout shows the resampled count 200 (got "${points}")`);
  const starOn = await page.locator('.ep-preset[data-preset="star"]').evaluate((el) => el.classList.contains('on'));
  assert(starOn, 'the active preset button is highlighted');

  // ============ UI: harmonics slider changes TERMS + ENERGY; live tip == engine ============
  await page.evaluate(() => window.__fourier.setT(0.3)); // pause + seek for determinism
  await page.waitForFunction(() => window.__fourier.state().playing === false);

  // M=1 leaves a visible energy gap (star's fundamental ≈ 93%); higher M fills it.
  await page.evaluate(() => window.__fourier.setM(1));
  let terms = (await page.locator('#ep-terms').textContent()).trim();
  assert(terms === '1', `TERMS readout follows the slider (got "${terms}")`);
  const e1 = parseFloat(await page.locator('#ep-energy').textContent());
  assert(e1 > 0 && e1 < 99, `at 1 harmonic the ENERGY readout is well under 100% (got ${e1}%)`);

  await page.evaluate(() => window.__fourier.setM(60));
  terms = (await page.locator('#ep-terms').textContent()).trim();
  assert(terms === '60', `TERMS updates to 60 (got "${terms}")`);
  const e60 = parseFloat(await page.locator('#ep-energy').textContent());
  assert(e60 > e1, `energy coverage rises with more harmonics (${e1}% → ${e60}%)`);
  // and strictly monotonic at full engine precision (DOM rounds to 0.1%)
  const ePrec = await page.evaluate(() => {
    const F = window.__fourier, c = F.comps();
    return { lo: F.energyCoverage(c, 3), hi: F.energyCoverage(c, 60) };
  });
  assert(ePrec.hi > ePrec.lo, `coverage strictly increases at engine precision (${ePrec.lo.toFixed(4)}% → ${ePrec.hi.toFixed(4)}%)`);

  const tipErr = await page.evaluate(() => {
    const F = window.__fourier, t = 0.42;
    const live = F.tipAt(t), ref = F.reconstruct(F.comps(), t, F.state().M);
    return Math.hypot(live.x - ref.x, live.y - ref.y);
  });
  assert(tipErr < 1e-9, `the live epicycle tip matches the pure engine reconstruction (err ${tipErr.toExponential(2)})`);

  // ============ UI: seek scrubber drives t deterministically ============
  await page.evaluate(() => window.__fourier.setT(0.75));
  const seekVal = await page.locator('#ep-seek').evaluate((el) => el.value);
  assert(seekVal === '750', `seek slider reflects t=0.75 (got "${seekVal}")`);
  const tState = await page.evaluate(() => window.__fourier.state().t);
  assert(Math.abs(tState - 0.75) < 1e-9, `engine time set to 0.75 (got ${tState})`);

  // ============ freehand: draw a rough circle with the mouse → real DFT ============
  await page.click('#ep-draw');
  assert(await page.locator('#ep-draw').evaluate((el) => el.classList.contains('on')), 'Draw mode toggles on');

  const box = await page.locator('#ep-canvas').boundingBox();
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  const R = Math.min(box.width, box.height) * 0.22;
  await page.mouse.move(cx + R, cy);
  await page.mouse.down();
  const STEPS = 48;
  for (let i = 1; i <= STEPS; i++) { const a = 2 * Math.PI * i / STEPS; await page.mouse.move(cx + R * Math.cos(a), cy + R * Math.sin(a)); }
  await page.mouse.up();
  await page.waitForFunction(() => window.__fourier.state().hasComps && window.__fourier.state().N === 200);
  assert((await page.evaluate(() => window.__fourier.state().N)) === 200, 'freehand stroke is resampled to 200 points');
  assert(await page.locator('#ep-draw').evaluate((el) => !el.classList.contains('on')), 'Draw mode auto-exits after a completed stroke');

  const drawn = await page.evaluate((r) => {
    const c1 = window.__fourier.comps().find((c) => c.freq === 1);
    return { amp1: c1 ? c1.amp : null, R: r };
  }, R);
  assert(drawn.amp1 !== null, 'freehand DFT has a +1 harmonic');
  assert(Math.abs(drawn.amp1 - drawn.R) < drawn.R * 0.25,
    `the +1 harmonic of a hand-drawn circle ≈ its radius (amp ${drawn.amp1.toFixed(1)} vs R ${drawn.R.toFixed(1)})`);

  // ============ library: save / mutate / load restores the exact shape ============
  const lib = await page.evaluate(() => {
    const F = window.__fourier;
    const sig = () => { const s = F.samples(); let a = 0; for (const p of s) a += p.x * p.x + p.y * p.y; return a; };
    F.clearSaved();
    F.loadPreset('rose');
    const before = sig();
    F.saveDrawing('TEST ROSE');
    F.loadPreset('square');
    const mutated = sig();
    const ok = F.loadDrawing('TEST ROSE');
    const after = sig();
    return { before, mutated, after, ok, list: F.listSaved() };
  });
  assert(lib.list.indexOf('TEST ROSE') !== -1, 'a saved drawing appears in the library');
  assert(lib.ok === true, 'loadDrawing returns true for a saved name');
  assert(Math.abs(lib.after - lib.before) < lib.before * 0.05 + 1,
    `loading restores the saved rose (Σr² ${lib.before.toFixed(1)} → ${lib.after.toFixed(1)})`);
  assert(Math.abs(lib.mutated - lib.before) > 20,
    `the square really differs from the rose, proving load changed shape (Σr² ${lib.mutated.toFixed(1)} vs ${lib.before.toFixed(1)})`);
  await page.waitForSelector('.ep-chip .ep-load');
  assert(((await page.locator('.ep-chip .ep-load').first().textContent()) || '').trim().length > 0, 'the saved chip is rendered with its name');

  // ============ clear resets to the empty state ============
  await page.click('#ep-clear');
  assert((await page.evaluate(() => window.__fourier.state().hasComps)) === false, 'Clear removes the current drawing');
  assert(await page.locator('#ep-empty').evaluate((el) => el.classList.contains('show')), 'the empty-state hint appears after Clear');

  // ============ layout guards (07-17 lesson): nothing escapes its container ============
  await page.evaluate(() => window.__fourier.loadPreset('heart'));
  await page.waitForFunction(() => window.__fourier.state().hasComps);
  const layout = await page.evaluate(() => {
    const grab = (sel) => { const el = document.querySelector(sel); return el ? el.getBoundingClientRect() : null; };
    const nav = grab('nav.ep-nav'), back = grab('.ep-back'), dock = grab('#ep-dock'),
      canv = grab('#ep-canvas'), stg = grab('#ep-stage'), tele = grab('.ep-tele');
    const backInNav = !!(back && nav && back.left >= nav.left - 0.5 && back.top >= nav.top - 0.5 &&
      back.right <= nav.right + 0.5 && back.bottom <= nav.bottom + 0.5);
    let ctlEscape = null;
    document.querySelectorAll('#ep-dock button, #ep-dock input, #ep-dock .ep-chip').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if (r.left < dock.left - 0.5 || r.right > dock.right + 0.5 || r.top < dock.top - 0.5 || r.bottom > dock.bottom + 0.5) {
        if (!ctlEscape) ctlEscape = (el.className || el.tagName) + ' @ ' + JSON.stringify({ l: Math.round(r.left), t: Math.round(r.top) });
      }
    });
    let offscreen = null;
    document.querySelectorAll('.ep-nav *, #ep-dock button, #ep-dock input, .ep-tele *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if (r.left < -1 || r.top < -1) { if (!offscreen) offscreen = el.className || el.tagName; }
    });
    const canvasFills = !!(canv && stg && Math.abs(canv.width - stg.width) < 2 && Math.abs(canv.height - stg.height) < 2);
    const teleInStage = !tele || (tele.right <= stg.right + 0.5 && tele.top >= stg.top - 0.5 && tele.bottom <= stg.bottom + 0.5);
    return { backInNav, ctlEscape, offscreen, canvasFills, teleInStage };
  });
  assert(layout.backInNav, 'the ← 返回工具集 link stays within the nav bar');
  assert(layout.ctlEscape === null, `no dock control escapes the dock (${layout.ctlEscape})`);
  assert(layout.offscreen === null, `no chrome element is pushed off the top/left viewport edge (${layout.offscreen})`);
  assert(layout.canvasFills, 'the canvas fills the stage area');
  assert(layout.teleInStage, 'the telemetry panel stays within the stage');

  // ============ thumbnail: heart mid-draw with visible epicycles ============
  await page.evaluate(() => { window.__fourier.loadPreset('heart'); window.__fourier.setM(64); window.__fourier.setT(0.70); });
  await page.waitForFunction(() =>
    window.__fourier.state().hasComps && window.__fourier.state().M === 64 &&
    Math.abs(window.__fourier.state().t - 0.70) < 1e-6 && window.__fourier.state().playing === false);
  await page.mouse.move(640, 470); // park cursor over the canvas so no button shows a :hover fill
  // let the active-preset fill transition settle so the highlight reads crisply (deterministic, not a fixed sleep)
  await page.waitForFunction(() => {
    const m = getComputedStyle(document.querySelector('.ep-preset[data-preset="heart"]')).backgroundColor.match(/[\d.]+/g);
    return !m || m.length < 4 || parseFloat(m[3]) > 0.98;
  }, { timeout: 2000 });
  await screenshot('thumb.png');
}
