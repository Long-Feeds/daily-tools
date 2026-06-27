// Integration test for 热量与宏量计算器.
// Drives the real BMR/TDEE/macro engine in the browser and asserts concrete,
// hand-computed numbers (not just element presence). Captures thumb.png.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#age');

  const settle = () => page.waitForTimeout(80);
  const txt = async (sel) => ((await page.locator(sel).textContent()) || '').trim();
  // set a slider value and fire the input event the page listens for
  const setRange = async (sel, val) => {
    await page.$eval(sel, (el, v) => {
      el.value = String(v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, val);
    await settle();
  };

  // ---- baseline: male, 30y, 180cm, 80kg, sedentary(1.2), maintain ----
  await page.click('#sex-male');
  await page.fill('#age', '30');
  await page.fill('#height', '180');
  await page.fill('#weight', '80');
  await page.fill('#bodyfat', '');
  await page.selectOption('#activity', '1.2');
  await page.click('#goal-maintain');
  await settle();

  // BMR (Mifflin male) = 10*80 + 6.25*180 - 5*30 + 5 = 1780
  assert((await txt('#bmr-val')).includes('1,780'), `BMR should be 1,780 (got "${await txt('#bmr-val')}")`);
  // TDEE = 1780 * 1.2 = 2136
  assert((await txt('#tdee-val')).includes('2,136'), `TDEE should be 2,136 (got "${await txt('#tdee-val')}")`);
  // maintain target == TDEE
  assert((await txt('#target-val')).includes('2,136'), `maintain target == TDEE 2,136 (got "${await txt('#target-val')}")`);
  // BMI = 80 / 1.8^2 = 24.69 -> 24.7, 正常
  assert((await txt('#bmi-val')) === '24.7', `BMI should be 24.7 (got "${await txt('#bmi-val')}")`);
  assert((await txt('#bmi-cat')).includes('正常'), `BMI category 正常 (got "${await txt('#bmi-cat')}")`);

  // ---- activity change recomputes TDEE: 1.55 -> 1780*1.55 = 2759 ----
  await page.selectOption('#activity', '1.55');
  await settle();
  assert((await txt('#tdee-val')).includes('2,759'), `TDEE@1.55 should be 2,759 (got "${await txt('#tdee-val')}")`);

  // ---- pick 减脂 goal: deficit 20% of 2759 = 2207 ----
  await page.click('#goal-cut');
  await settle();
  assert(await page.locator('#goal-cut').getAttribute('aria-pressed') === 'true', 'cut card becomes active');
  assert((await txt('#target-val')).includes('2,207'), `cut target should be 2,207 (got "${await txt('#target-val')}")`);
  assert((await txt('#target-sub')).includes('缺口'), `cut shows a deficit (got "${await txt('#target-sub')}")`);
  // macros @ target 2207.2, protein 1.8 g/kg * 80 = 144 g
  assert((await txt('#protein-g')) === '144', `protein should be 144 g (got "${await txt('#protein-g')}")`);
  // fat 25% of 2207.2 = 551.8 kcal -> 61 g
  assert((await txt('#fat-g')) === '61', `fat should be 61 g (got "${await txt('#fat-g')}")`);
  // carbs = (2207.2 - 576 - 551.8)/4 = 269.85 -> 270 g
  assert((await txt('#carb-g')) === '270', `carbs should be 270 g (got "${await txt('#carb-g')}")`);
  // macro percentages should sum to ~100
  const pcts = await Promise.all(['#protein-pct', '#carb-pct', '#fat-pct-out'].map(txt));
  const pctSum = pcts.reduce((a, t) => a + parseInt(t, 10), 0);
  assert(Math.abs(pctSum - 100) <= 1, `macro %s sum ~100 (got ${pcts.join('+')}=${pctSum})`);

  // ---- protein slider drives grams live: 2.2 g/kg * 80 = 176 g ----
  await setRange('#protein-rate', 2.2);
  assert((await txt('#protein-g')) === '176', `protein@2.2 should be 176 g (got "${await txt('#protein-g')}")`);
  await setRange('#protein-rate', 1.8);

  // ---- intensity slider changes the cut depth: 30% -> 2759*0.7 = 1931 ----
  await setRange('#intensity', 30);
  assert((await txt('#intensity-val')).includes('30'), 'intensity label shows 30%');
  assert((await txt('#target-val')).includes('1,931'), `cut@30% target should be 1,931 (got "${await txt('#target-val')}")`);
  await setRange('#intensity', 20);

  // ---- body fat % switches to Katch-McArdle ----
  // LBM = 80*0.8 = 64; BMR = 370 + 21.6*64 = 1752.4 -> 1,752 (differs from Mifflin 1,780)
  await page.fill('#bodyfat', '20');
  await settle();
  assert((await txt('#bmr-val')).includes('1,752'), `Katch-McArdle BMR should be 1,752 (got "${await txt('#bmr-val')}")`);
  assert((await txt('#formula-note')).includes('Katch'), `formula note mentions Katch (got "${await txt('#formula-note')}")`);
  await page.fill('#bodyfat', '');
  await settle();
  assert((await txt('#bmr-val')).includes('1,780'), `clearing body fat returns to Mifflin 1,780 (got "${await txt('#bmr-val')}")`);

  // ---- invalid input surfaces a hint and clears outputs ----
  await page.fill('#age', '');
  await settle();
  assert((await page.locator('#hint').isVisible()), 'empty age shows a hint');
  assert((await txt('#bmr-val')).includes('—'), `invalid input clears BMR to placeholder (got "${await txt('#bmr-val')}")`);
  await page.fill('#age', '30');
  await settle();
  assert((await txt('#bmr-val')).includes('1,780'), 'restoring age recomputes BMR');

  // ---- imperial unit conversion preserves the person ----
  await page.click('#goal-maintain'); // simplify
  await page.click('#unit-imperial');
  await settle();
  // 80 kg -> 176.4 lb ; 180 cm -> 70.9 in
  const wImp = await page.inputValue('#weight');
  const hImp = await page.inputValue('#height');
  assert(Math.abs(parseFloat(wImp) - 176.4) < 0.2, `weight converts to ~176.4 lb (got "${wImp}")`);
  assert(Math.abs(parseFloat(hImp) - 70.9) < 0.2, `height converts to ~70.9 in (got "${hImp}")`);
  assert((await txt('#weight-unit')) === 'lb', `weight unit label is lb (got "${await txt('#weight-unit')}")`);
  // BMR should stay ~1780 after the round trip (within rounding)
  const bmrImp = parseInt((await txt('#bmr-val')).replace(/[^\d]/g, ''), 10);
  assert(Math.abs(bmrImp - 1780) <= 3, `BMR stable across unit switch (got ${bmrImp})`);
  await page.click('#unit-metric');
  await settle();

  // ---- weight-loss projection when a goal weight is set ----
  await page.click('#goal-cut');
  await page.fill('#goal-weight', '74'); // lose 6 kg from 80
  await settle();
  assert((await txt('#weekly-change')).includes('kg/周'), `weekly change shows kg/周 (got "${await txt('#weekly-change')}")`);
  assert((await txt('#weekly-change')).includes('−'), `cutting projects weight loss (got "${await txt('#weekly-change')}")`);
  assert(/\d+\s*周/.test(await txt('#weeks-to-goal')), `weeks-to-goal is a number of weeks (got "${await txt('#weeks-to-goal')}")`);

  // ---- nice state for the thumbnail: a clear cut plan ----
  await page.fill('#weight', '82');
  await page.fill('#height', '178');
  await page.fill('#goal-weight', '75');
  await setRange('#protein-rate', 2.0);
  await settle();
  await page.evaluate(() => {
    const el = document.querySelector('#goals');
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 86);
  });
  await settle();
  await screenshot('thumb.png');
}
