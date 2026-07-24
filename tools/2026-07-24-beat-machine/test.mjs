// Integration test for 节拍工坊 · Beat Machine.
// Drives the real drum machine: grid model, preset engine, transport (visual
// playhead is performance.now-driven so it advances even with a suspended
// AudioContext in headless), swing/tempo math, mute/solo, and localStorage
// round-trip. Asserts concrete outputs — not mere presence. Enforces the two
// site-wide traps: [hidden] must compute to display:none, and key controls must
// stay inside the app container (no layout escape). Ends by capturing thumb.png.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#grid');
  await page.waitForFunction(() => !!window.__beat && document.querySelectorAll('.step').length === 128);

  const disp = (sel) => page.evaluate((s) => getComputedStyle(document.querySelector(s)).display, sel);
  const setRange = (sel, v) => page.evaluate(({ s, v }) => {
    const el = document.querySelector(s); el.value = String(v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, { s: sel, v });
  const kickOnDom = () => page.$$eval('.step[data-track="0"].on', els => els.map(e => +e.dataset.step).sort((a, b) => a - b));

  // ---------- structure ----------
  assert((await page.locator('.track').count()) === 8, '8 track rows');
  assert((await page.locator('.step').count()) === 128, '8×16 = 128 step cells');
  assert((await page.locator('#ruler span').count()) === 16, 'ruler shows 16 steps');
  const back = await page.getAttribute('a.back', 'href');
  assert(back === '../../', 'back link points to ../../ (got ' + back + ')');

  // ---------- clear → empty model ----------
  await page.click('#clear');
  await page.waitForFunction(() => window.__beat.onCount() === 0);
  assert((await page.locator('.step.on').count()) === 0, 'clear removes every active cell');

  // ---------- preset engine emits the exact pattern ----------
  await page.click('.pill[data-preset="house"]');
  await page.waitForFunction(() => window.__beat.trackOn(0).join(',') === '0,4,8,12');
  assert(JSON.stringify(await kickOnDom()) === JSON.stringify([0, 4, 8, 12]),
    'House: kick fires on steps 0,4,8,12 (DOM) — got ' + JSON.stringify(await kickOnDom()));
  const clapOn = await page.evaluate(() => window.__beat.trackOn(window.__beat.idx('clap')));
  assert(JSON.stringify(clapOn) === JSON.stringify([4, 12]), 'House: clap on 4,12 (got ' + JSON.stringify(clapOn) + ')');
  const chhOn = await page.evaluate(() => window.__beat.trackOn(window.__beat.idx('chh')));
  assert(JSON.stringify(chhOn) === JSON.stringify([2, 6, 10, 14]), 'House: closed hat on offbeats (got ' + JSON.stringify(chhOn) + ')');

  // ---------- toggle a cell: model + aria + visual ----------
  const c00 = page.locator('.step[data-track="0"][data-step="0"]');
  assert((await c00.getAttribute('aria-pressed')) === 'true', 'kick step 0 starts active (House)');
  await c00.click();
  await page.waitForFunction(() => window.__beat.S.grid[0][0] === false);
  assert((await c00.getAttribute('aria-pressed')) === 'false', 'toggling clears aria-pressed');
  assert(await c00.evaluate(el => !el.classList.contains('on')), 'toggling removes .on');
  await c00.click();
  await page.waitForFunction(() => window.__beat.S.grid[0][0] === true);
  assert(await c00.evaluate(el => getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)'), 'active cell has a real fill');

  // ---------- tempo: UI + timing engine ----------
  await setRange('#bpm', 140);
  await page.waitForFunction(() => window.__beat.S.bpm === 140);
  assert((await page.locator('#bpm-val').textContent()) === '140', 'BPM readout updates to 140');
  const dur140 = await page.evaluate(() => window.__beat.stepDurSec(0));
  assert(Math.abs(dur140 - (60 / 140) / 4) < 1e-6, '16th-note duration tracks 140 BPM (got ' + dur140.toFixed(5) + ')');

  // ---------- swing lengthens the downbeat vs the offbeat ----------
  await setRange('#swing', 40);
  await page.waitForFunction(() => window.__beat.S.swing === 40);
  assert(/40/.test((await page.locator('#swing-val').textContent()) || ''), 'swing readout shows 40');
  const swung = await page.evaluate(() => ({ even: window.__beat.stepDurSec(0), odd: window.__beat.stepDurSec(1) }));
  assert(swung.even > swung.odd + 1e-6, 'swing makes even steps longer than odd (' + swung.even.toFixed(4) + ' > ' + swung.odd.toFixed(4) + ')');
  await setRange('#swing', 0); // straight again for a clean groove afterwards

  // ---------- master volume ----------
  await setRange('#master', 55);
  await page.waitForFunction(() => window.__beat.S.master === 55);
  assert(/55/.test((await page.locator('#master-val').textContent()) || ''), 'master readout shows 55');

  // ---------- mute / solo ----------
  await page.click('.ms .mute[data-track="0"]');
  await page.waitForFunction(() => window.__beat.S.mute[0] === true);
  assert(await page.locator('.ms .mute[data-track="0"]').evaluate(el => el.classList.contains('active')), 'mute button shows active state');
  await page.click('.ms .solo[data-track="3"]');
  await page.waitForFunction(() => window.__beat.S.solo[3] === true);
  // reset so the thumbnail + later state is neutral
  await page.click('.ms .mute[data-track="0"]');
  await page.click('.ms .solo[data-track="3"]');
  await page.waitForFunction(() => window.__beat.S.mute[0] === false && window.__beat.S.solo[3] === false);

  // ---------- [hidden] guard #1: patterns empty-state ----------
  assert((await disp('#patterns-empty')) !== 'none', 'empty-state visible when no saved patterns');
  // load a deterministic pattern, then save it
  await page.click('.pill[data-preset="techno"]');
  await page.waitForFunction(() => window.__beat.trackOn(0).join(',') === '0,4,8,12'
    && window.__beat.trackOn(window.__beat.idx('cow')).join(',') === '7');
  await page.fill('#save-name', 'Test Beat');
  await page.click('#save-btn');
  await page.waitForSelector('.pat .pname');
  assert(/Test Beat/.test((await page.locator('.pat .pname').first().textContent()) || ''), 'saved pattern appears in list');
  assert((await disp('#patterns-empty')) === 'none', '[hidden] empty-state computes to display:none once a pattern exists');

  // ---------- localStorage round-trip ----------
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('beat.machine.patterns.v1') || '[]'));
  assert(Array.isArray(stored) && stored.length >= 1, 'pattern persisted to localStorage');
  assert(stored[0].name === 'Test Beat' && Array.isArray(stored[0].grid) && stored[0].grid.length === 8,
    'stored pattern has name + 8-track grid');

  // ---------- [hidden] guard #2: import/export panel ----------
  assert((await disp('#io-panel')) === 'none', 'IO panel hidden initially (computed display:none)');
  await page.click('#io-toggle');
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#io-panel')).display !== 'none');
  await page.click('#io-export');
  await page.waitForFunction(() => (document.querySelector('#io-text').value || '').indexOf('"patterns"') >= 0);
  const io = await page.locator('#io-text').inputValue();
  assert(/"patterns"/.test(io) && /"current"/.test(io), 'export produces JSON with patterns + current');

  // ---------- persistence across reload + load restores saved grid ----------
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#grid');
  await page.waitForFunction(() => !!window.__beat);
  await page.waitForSelector('.pat .pname');
  assert(/Test Beat/.test((await page.locator('.pat .pname').first().textContent()) || ''), 'saved pattern survives reload');
  // clear the (auto-restored) current grid, then load the saved one → proves distinct restore
  await page.click('#clear');
  await page.waitForFunction(() => window.__beat.onCount() === 0);
  await page.click('.pat .pat-load');
  await page.waitForFunction(() => window.__beat.trackOn(0).join(',') === '0,4,8,12' && window.__beat.onCount() > 4);
  assert((await page.locator('.step.on').count()) > 4, 'loading a saved pattern repopulates the grid');

  // ---------- transport: play flips state, visual playhead advances, stop clears ----------
  await page.click('#play');
  await page.waitForFunction(() => window.__beat.isPlaying() === true);
  assert((await page.getAttribute('#play', 'data-playing')) === 'true', 'play button marks playing');
  assert((await page.getAttribute('#grid', 'data-playing')) === 'true', 'grid marks playing');
  await page.waitForFunction(() => window.__beat.getStep() > 0, null, { timeout: 5000 });
  assert((await page.locator('.step.cur').count()) > 0, 'a step column is highlighted while playing');
  await page.click('#play');
  await page.waitForFunction(() => window.__beat.isPlaying() === false);
  assert((await page.getAttribute('#grid', 'data-playing')) === 'false', 'stop clears playing state');
  await page.waitForFunction(() => document.querySelectorAll('.step.cur').length === 0);
  assert((await page.locator('.step.cur').count()) === 0, 'stop clears the playhead highlight');

  // ---------- layout-escape guard: key controls stay inside #app ----------
  const app = await page.locator('#app').boundingBox();
  for (const sel of ['#play', '#grid', '#save-btn']) {
    const b = await page.locator(sel).boundingBox();
    assert(b && b.x >= app.x - 1 && b.y >= app.y - 1 && b.x + b.width <= app.x + app.width + 1,
      sel + ' stays within the app container (no layout escape)');
  }
  // regression guard: a CSS-specificity clash once collapsed the track-name column to ~0
  // (input[type=range]{width:100%} beat .tvol) — assert the label keeps a real width + is legible.
  const nameBox = await page.locator('.tname').first().boundingBox();
  assert(nameBox && nameBox.width >= 48, 'track-name column keeps a legible width (got ' + (nameBox && Math.round(nameBox.width)) + 'px)');
  const volBox = await page.locator('.tvol').first().boundingBox();
  assert(volBox && volBox.width <= 60, 'per-track fader stays compact, not full-width (got ' + (volBox && Math.round(volBox.width)) + 'px)');

  // ---------- settle a musical, stable state for the thumbnail ----------
  await page.click('.pill[data-preset="house"]');
  await page.waitForFunction(() => window.__beat.trackOn(0).join(',') === '0,4,8,12' && window.__beat.isPlaying() === false);
  await page.evaluate(() => { const t = document.getElementById('toast'); if (t) { t.classList.remove('show'); t.style.display = 'none'; } });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(() => window.scrollY === 0);
  await page.waitForFunction(() => document.querySelectorAll('.step.cur').length === 0); // no transient highlight
  await screenshot('thumb.png');
}
