// Integration test for 缓动实验室 · Easing Lab.
// Drives the real easing engines through the browser and asserts concrete
// numeric outputs (not just element presence): the cubic-bézier solver, the
// spring integrator's overshoot, CSS steps() sampling, localStorage persistence
// and A/B compare. Ends by capturing thumb.png for the homepage card.
//
// Determinism note (lessons 2026-07-06): the scrubber path is synchronous and
// pauses the rAF animation, so readouts settle immediately; we still poll with
// waitForFunction before every numeric assertion instead of sleeping.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#plot');
  await page.waitForSelector('.tab.active[data-mode="bezier"]');

  const cssText = async () => (await page.locator('#css-output').textContent() || '').trim();
  const scrubTo = async (v) => {
    await page.$eval('#scrub', (el, val) => { el.value = String(val); el.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  };
  // poll the output readout to within tolerance, then assert with a clear message
  const assertOutputNear = async (expected, tol, msg) => {
    await page.waitForFunction(([exp, t]) => {
      const el = document.querySelector('#scrub-output');
      if (!el) return false;
      const v = parseInt(el.textContent, 10);
      return !isNaN(v) && Math.abs(v - exp) <= t;
    }, [expected, tol], { timeout: 2500 }).catch(() => {});
    const v = parseInt((await page.locator('#scrub-output').textContent()) || 'NaN', 10);
    assert(Math.abs(v - expected) <= tol, `${msg} (got ${v}%, want ${expected}±${tol})`);
  };
  const setBezier = async (x1, y1, x2, y2) => {
    await page.fill('#x1', String(x1));
    await page.fill('#y1', String(y1));
    await page.fill('#x2', String(x2));
    await page.fill('#y2', String(y2));
  };

  // --- default state is a valid cubic-bezier ---
  assert(/^cubic-bezier\(/.test(await cssText()), `default export is a cubic-bezier (got "${await cssText()}")`);

  // --- bezier solver: symmetric ease-in-out => output(50%)==50% AND exact CSS ---
  await setBezier(0.42, 0, 0.58, 1);
  assert((await cssText()) === 'cubic-bezier(0.42, 0, 0.58, 1)', `symmetric ease-in-out CSS string (got "${await cssText()}")`);
  await scrubTo(500);
  await assertOutputNear(50, 1, 'symmetric ease-in-out is 50% at the midpoint (Newton–Raphson solver)');

  // --- bezier solver: linear (0,0,1,1) is the identity curve ---
  await setBezier(0, 0, 1, 1);
  await scrubTo(250);
  await assertOutputNear(25, 1, 'linear curve maps 25% progress to 25% output');
  await scrubTo(750);
  await assertOutputNear(75, 1, 'linear curve maps 75% progress to 75% output');

  // --- preset chip loads a known curve ---
  await page.click('.preset[data-name="ease-in-out"]');
  assert((await cssText()) === 'cubic-bezier(0.42, 0, 0.58, 1)', `ease-in-out preset loads its cubic-bezier (got "${await cssText()}")`);
  assert(await page.locator('.preset[data-name="ease-in-out"].on').count() >= 1, 'active preset gets highlighted');

  // --- out-back overshoots above 1 (its curve peaks past the target) ---
  await page.click('.preset[data-name="out-back"]');
  await scrubTo(700);
  const backPeak = parseInt((await page.locator('#scrub-output').textContent()), 10);
  assert(backPeak > 100, `out-back overshoots past 100% before settling (got ${backPeak}%)`);

  // --- STEPS mode: exact CSS + staircase sampling ---
  await page.click('.tab[data-mode="steps"]');
  await page.waitForSelector('.ctl-steps:not(.hidden)');
  await page.fill('#steps-count', '4');
  await page.selectOption('#steps-jump', 'end');
  assert((await cssText()) === 'steps(4, jump-end)', `steps CSS string (got "${await cssText()}")`);
  await scrubTo(600);           // jump-end steps(4): floor(0.6*4)/4 = 2/4 = 0.5
  await assertOutputNear(50, 1, 'steps(4, jump-end) yields 50% at 60% progress');
  await scrubTo(300);           // floor(0.3*4)/4 = 1/4 = 0.25
  await assertOutputNear(25, 1, 'steps(4, jump-end) yields 25% at 30% progress');

  // --- SPRING mode: exports linear(), settles to 100%, and overshoots ---
  await page.click('.preset[data-name="bouncy spring"]');
  await page.waitForSelector('.tab.active[data-mode="spring"]');
  const springCss = await cssText();
  assert(/^linear\(/.test(springCss), `spring exports a CSS linear() curve (got "${springCss.slice(0, 40)}…")`);
  assert((springCss.match(/,/g) || []).length >= 3, `spring linear() has multiple stops (got "${springCss.slice(0, 60)}…")`);
  const peakTxt = (await page.locator('#spring-peak').textContent()) || '';
  const peak = parseInt(peakTxt, 10);
  assert(peak > 100, `bouncy spring reports overshoot above 100% (got "${peakTxt.trim()}")`);
  assert(/\bms$/.test((await page.locator('#spring-duration').textContent() || '').trim()), 'spring shows a suggested duration in ms');
  await scrubTo(1000);
  await assertOutputNear(100, 1, 'spring settles to exactly 100% at full progress');

  // --- A/B compare: pin B reveals a second curve + ghost dot ---
  await page.click('#pin-b');
  assert(await page.locator('#curve-b').evaluate(el => el.style.display !== 'none'), 'pinning B draws the comparison curve');
  assert(await page.locator('#dot-b:not(.hidden)').count() === 1, 'pinning B reveals the ghost dot on the track');

  // --- saved presets persist across a reload (localStorage) ---
  await page.click('.tab[data-mode="bezier"]');
  await page.click('.preset[data-name="out-back"]');
  await page.fill('#preset-name', 'my springy back');
  await page.click('#save-btn');
  assert(await page.locator('.saved-item .si-name', { hasText: 'my springy back' }).count() === 1, 'saved curve appears in the list');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#plot');
  assert(await page.locator('.saved-item .si-name', { hasText: 'my springy back' }).count() === 1, 'saved curve survives a page reload (localStorage)');

  // --- settle on an attractive state for the thumbnail ---
  await page.click('.preset[data-name="out-back"]');      // striking overshoot curve
  await scrubTo(470);                                      // dot mid-travel, boxes scaled
  // frame the product (curve editor + gradient motion stage), not the hero text
  await page.evaluate(() => {
    const g = document.querySelector('.grid');
    const y = g.getBoundingClientRect().top + window.scrollY - 66;
    window.scrollTo(0, Math.max(0, y));
  });
  await page.waitForFunction(() => document.querySelector('#scrub-output') !== null);
  await screenshot('thumb.png');
}
