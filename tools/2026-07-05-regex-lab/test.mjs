// Integration test for 正则实验室 · Regex Lab.
// Drives the real UI + exercises the pure engine (parser / explanation /
// native-RegExp executor / replace) through window.__regex, asserting concrete
// outputs — not mere presence of elements. Ends by capturing thumb.png.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#pattern');
  await page.waitForFunction(() => !!window.__regex);

  const R = (fn, ...args) => page.evaluate(fn, args);

  // ---------- ENGINE: executor (native RegExp, exact outputs) ----------
  const dates = await page.evaluate(() =>
    window.__regex.run('(\\d{4})-(\\d{2})-(\\d{2})', 'g', '2026-07-05 and 1999-12-31'));
  assert(!dates.error, 'date pattern is valid');
  assert(dates.count === 2, `two dates matched (got ${dates.count})`);
  assert(dates.matches[0].index === 0 && dates.matches[0].length === 10, 'first date span is [0,10)');
  assert(JSON.stringify(dates.matches[0].groups) === JSON.stringify(['2026', '07', '05']),
    `first date groups = 2026/07/05 (got ${JSON.stringify(dates.matches[0].groups)})`);
  assert(dates.matches[1].groups[0] === '1999', 'second date year captured = 1999');

  const nums = await page.evaluate(() => window.__regex.run('\\d+', 'g', 'a1b22c333'));
  assert(nums.count === 3, `\\d+ matched 3 runs (got ${nums.count})`);
  assert(JSON.stringify(nums.matches.map(m => m.match)) === JSON.stringify(['1', '22', '333']),
    `\\d+ matches = 1,22,333 (got ${JSON.stringify(nums.matches.map(m => m.match))})`);

  // named groups
  const named = await page.evaluate(() => window.__regex.run('(?<year>\\d{4})', '', 'y2026'));
  assert(named.count === 1 && named.matches[0].named && named.matches[0].named.year === '2026',
    'named group <year> captured 2026');

  // case-insensitive flag changes the result
  const ci0 = await page.evaluate(() => window.__regex.run('abc', '', 'xxABCyy'));
  const ci1 = await page.evaluate(() => window.__regex.run('abc', 'i', 'xxABCyy'));
  assert(ci0.count === 0, 'abc without i does NOT match ABC');
  assert(ci1.count === 1 && ci1.matches[0].index === 2, 'abc with i matches ABC at index 2');

  // anchors + alternation precedence
  const anchNo = await page.evaluate(() => window.__regex.run('^(cat|dog)$', '', 'cats'));
  const anchYes = await page.evaluate(() => window.__regex.run('^(cat|dog)$', '', 'dog'));
  assert(anchNo.count === 0, '^(cat|dog)$ rejects "cats"');
  assert(anchYes.count === 1 && anchYes.matches[0].groups[0] === 'dog', '^(cat|dog)$ accepts "dog"');

  // char class ranges
  const hex = await page.evaluate(() => window.__regex.run('[a-f0-9]', 'g', 'z3xb9k'));
  assert(JSON.stringify(hex.matches.map(m => m.match)) === JSON.stringify(['3', 'b', '9']),
    `[a-f0-9] matches 3,b,9 (got ${JSON.stringify(hex.matches.map(m => m.match))})`);

  // zero-width match must not infinite-loop (a*) and stays finite
  const zw = await page.evaluate(() => window.__regex.run('a*', 'g', 'baac'));
  assert(zw.count >= 2 && zw.count < 50, `a* on "baac" is finite (got ${zw.count})`);

  // invalid pattern -> error surfaced by engine
  const bad = await page.evaluate(() => window.__regex.run('(', 'g', 'x'));
  assert(!!bad.error, 'unbalanced ( reports an error');

  // ---------- ENGINE: replace ----------
  const rep1 = await page.evaluate(() => window.__regex.replace('\\d+', 'g', 'a1b22c333', '#'));
  assert(rep1.result === 'a#b#c#', `replace \\d+ -> # gives a#b#c# (got ${JSON.stringify(rep1.result)})`);
  const rep2 = await page.evaluate(() => window.__regex.replace('(\\w+)@(\\w+)', '', 'user@host', '$2.$1'));
  assert(rep2.result === 'host.user', `swap via $2.$1 (got ${JSON.stringify(rep2.result)})`);

  // ---------- ENGINE: explanation ----------
  const ex1 = await page.evaluate(() => window.__regex.explainText('\\d{3}'));
  assert(ex1.some(s => /任意数字/.test(s)), 'explains \\d as 数字');
  assert(ex1.some(s => /正好重复\s*3\s*次/.test(s)), 'explains {3} as 正好重复 3 次');
  const ex2 = await page.evaluate(() => window.__regex.explainText('(?=foo)'));
  assert(ex2.some(s => /先行/.test(s)), 'explains lookahead as 先行');
  const ex3 = await page.evaluate(() => window.__regex.explainText('a|b'));
  assert(ex3.some(s => /任一分支/.test(s)), 'explains alternation');

  // ---------- ENGINE: diagram is structural SVG with the right labels ----------
  const svg = await page.evaluate(() => window.__regex.diagramSvg('(\\d{4})-(\\d{2})-(\\d{2})'));
  assert(/^<svg[\s>]/.test(svg), 'diagram is an <svg>');
  assert(svg.indexOf('捕获组 #1') >= 0 && svg.indexOf('捕获组 #3') >= 0, 'diagram labels capture groups #1..#3');
  assert(svg.indexOf('\\d') >= 0, 'diagram shows \\d tokens');
  const svgAlt = await page.evaluate(() => window.__regex.diagramSvg('cat|dog'));
  assert(svgAlt.indexOf('>c<') >= 0 && svgAlt.indexOf('>d<') >= 0, 'alternation diagram renders both branches');

  // ---------- DOM: live matching + highlight + diagram ----------
  await page.fill('#pattern', '(\\d{4})-(\\d{2})-(\\d{2})');
  await page.fill('#test-text', '2026-07-05, 1999-12-31, x-y-z');
  // wait for the debounced render to settle to the final match set instead of a fixed
  // timeout (a short fixed wait can read the stale initial-default count → flaky)
  await page.waitForFunction(() => document.querySelectorAll('#highlight mark').length === 2, null, { timeout: 4000 });
  const countTxt = (await page.locator('#match-count').textContent()) || '';
  assert(/2/.test(countTxt), `UI shows 2 matches (got "${countTxt.trim()}")`);
  assert((await page.locator('#diagram svg').count()) === 1, 'UI renders one diagram svg');
  assert((await page.locator('#highlight mark').count()) === 2, 'UI highlights 2 matches');
  assert((await page.locator('#matches .match-item').count()) === 2, 'UI lists 2 match items');
  const firstGroup = (await page.locator('#matches .match-item').first().textContent()) || '';
  assert(/2026/.test(firstGroup) && /07/.test(firstGroup), 'first match item shows captured groups');
  assert((await page.locator('#explain li').count()) >= 3, 'explanation has multiple rows');

  // ---------- DOM: flag toggle changes match count ----------
  await page.fill('#pattern', 'abc');
  await page.fill('#test-text', 'ABC abc');
  await page.waitForFunction(() => document.querySelectorAll('#highlight mark').length === 1, null, { timeout: 4000 });
  let cTxt = (await page.locator('#match-count').textContent()) || '';
  assert(/1/.test(cTxt) && (await page.locator('#highlight mark').count()) === 1, 'without i: 1 match (abc)');
  await page.check('#f-i');
  // 等防抖后的渲染收敛再断言，别用定时读（07-06 教训：定时读会偶得 stale 值卡红发布闸）
  await page.waitForFunction(() => document.querySelectorAll('#highlight mark').length === 2, null, { timeout: 4000 });
  assert((await page.locator('#highlight mark').count()) === 2, 'with i: 2 matches (ABC + abc)');
  await page.uncheck('#f-i');

  // ---------- DOM: replace preview ----------
  await page.fill('#pattern', '\\d+');
  await page.fill('#test-text', 'a1b22');
  await page.fill('#replacement', '#');
  await page.waitForFunction(() => (document.getElementById('replace-result').textContent || '') === 'a#b#',
    null, { timeout: 4000 });
  const rr = (await page.locator('#replace-result').textContent()) || '';
  assert(rr === 'a#b#', `replace preview = a#b# (got ${JSON.stringify(rr)})`);

  // ---------- DOM: invalid pattern shows error + clears matches ----------
  await page.fill('#pattern', '(');
  await page.waitForFunction(() => {
    const e = document.getElementById('error');
    return e && getComputedStyle(e).display !== 'none' && /无效/.test(e.textContent || '');
  }, null, { timeout: 4000 });
  assert(await page.locator('#error').isVisible(), 'error banner is visible for invalid pattern');
  const errTxt = (await page.locator('#error').textContent()) || '';
  assert(/无效/.test(errTxt), `error banner explains invalidity (got "${errTxt.trim()}")`);
  await page.waitForFunction(() => document.querySelectorAll('#highlight mark').length === 0, null, { timeout: 4000 });
  assert((await page.locator('#highlight mark').count()) === 0, 'invalid pattern clears highlights');

  // ---------- DOM: library chip loads a working pattern ----------
  const emailChip = page.locator('.lib-item', { hasText: '电子邮箱' });
  assert((await emailChip.count()) >= 1, 'email library chip exists');
  await emailChip.first().click();
  await page.waitForFunction(() => {
    const e = document.getElementById('error');
    return getComputedStyle(e).display === 'none' && document.querySelectorAll('#highlight mark').length >= 1;
  }, null, { timeout: 4000 });
  assert((await page.locator('#error').isVisible()) === false, 'email chip yields a valid pattern');
  assert((await page.locator('#highlight mark').count()) >= 1, 'email chip produces matches on its demo text');

  // ---------- DOM: saved patterns persist across reload ----------
  await page.evaluate(() => localStorage.setItem('regexlab.saved', JSON.stringify(
    [{ name: '测试邮箱', pattern: '[\\w.+-]+@[\\w-]+', flags: 'g', text: 'a@b c@d' }])));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#saved-list .saved-item');
  const savedTxt = (await page.locator('#saved-list .saved-item').first().textContent()) || '';
  assert(/测试邮箱/.test(savedTxt), 'saved pattern survives reload');
  await page.locator('#saved-list .saved-item .sload').first().click();
  await page.waitForFunction(() => document.getElementById('pattern').value.indexOf('@') >= 0, null, { timeout: 4000 });
  assert((await page.locator('#pattern').inputValue()).indexOf('@') >= 0, 'clicking a saved item loads its pattern');

  // ---------- settle a rich state for the thumbnail ----------
  await page.evaluate(() => localStorage.removeItem('regexlab.saved'));
  await page.fill('#pattern', '(\\d{4})-(\\d{2})-(\\d{2})');
  await page.check('#f-g');
  await page.fill('#test-text', '发布 2026-07-05 · 上线 2026-07-04 · 归档 1999-12-31');
  await page.fill('#replacement', '$3/$2/$1');
  // 等替换预览真的渲染出三个日期再截图，别用定时等
  await page.waitForFunction(() => /05\/07\/2026/.test(document.getElementById('replace-result').textContent || ''),
    null, { timeout: 4000 });
  // fully hide any transient toast so the thumbnail is clean
  await page.evaluate(() => { const t = document.getElementById('toast'); if (t) { t.classList.remove('show'); t.style.display = 'none'; } });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(() => window.scrollY === 0);
  await screenshot('thumb.png');
}
