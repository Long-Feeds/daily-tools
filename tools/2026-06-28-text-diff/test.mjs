// Integration test for 文本对比 (text-diff).
// Drives the real LCS line-diff + word-level diff through the browser and asserts
// concrete outputs (add/del counts, similarity, which words are highlighted, view
// structure, ignore-case + swap behavior). Captures thumb.png for the homepage card.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#inputA');

  const A = page.locator('#inputA');
  const B = page.locator('#inputB');
  const stat = async (sel) => ((await page.locator(sel).textContent()) || '').trim();
  const setAB = async (a, b) => {
    await A.fill(a);
    await B.fill(b);
    await page.waitForTimeout(230); // debounced recompute is 130ms
  };

  // ---- 1. core line diff: counts + similarity ----
  // A has 3 lines, B has 4; only "shared line" is common.
  await setAB(
    'the quick brown fox\nshared line\nold line two',
    'the slow brown fox\nshared line\nnew line two\nextra tail'
  );
  assert((await stat('#stat-add')) === '3', `additions = 3 (got "${await stat('#stat-add')}")`);
  assert((await stat('#stat-del')) === '2', `deletions = 2 (got "${await stat('#stat-del')}")`);
  // line-level LCS = 1 of max(3,4)=4 -> 25%
  assert((await stat('#stat-sim')) === '25%', `similarity = 25% (got "${await stat('#stat-sim')}")`);

  // ---- 2. word-level intra-line highlighting ----
  const wdel = await page.locator('mark.w-del').allTextContents();
  const wins = await page.locator('mark.w-ins').allTextContents();
  assert(wdel.includes('quick') && wdel.includes('old'),
    `removed words highlighted: quick & old (got ${JSON.stringify(wdel)})`);
  assert(wins.includes('slow') && wins.includes('new'),
    `added words highlighted: slow & new (got ${JSON.stringify(wins)})`);
  // unchanged words inside a modified line must NOT be marked
  assert(!wdel.includes('brown') && !wdel.includes('the') && !wdel.includes('line'),
    `unchanged words are not highlighted (got ${JSON.stringify(wdel)})`);

  // ---- 3. split view structure: 4 aligned rows ----
  assert((await page.locator('.drow').count()) === 4, 'split view has 4 aligned rows');
  assert((await page.locator('.half.ins').count()) === 3, 'split view has 3 inserted half-cells');
  assert((await page.locator('.half.del').count()) === 2, 'split view has 2 deleted half-cells');

  // ---- 4. unified view ----
  await page.click('#view-unified');
  await page.waitForTimeout(120);
  assert((await page.locator('.uline.del').count()) === 2, 'unified view has 2 "-" lines');
  assert((await page.locator('.uline.ins').count()) === 3, 'unified view has 3 "+" lines');
  const unifiedText = (await page.locator('#diff-out').textContent()) || '';
  assert(unifiedText.includes('extra tail'), 'unified view shows the appended line "extra tail"');
  await page.click('#view-split');
  await page.waitForTimeout(120);

  // ---- 5. identical inputs -> "完全相同" + 100% ----
  await setAB('alpha\nbeta\ngamma', 'alpha\nbeta\ngamma');
  assert((await stat('#stat-add')) === '0' && (await stat('#stat-del')) === '0',
    'identical inputs report 0 add / 0 del');
  assert((await stat('#stat-sim')) === '100%', 'identical inputs are 100% similar');
  assert(/相同/.test((await page.locator('#diff-out').textContent()) || ''),
    'identical inputs show the "完全相同" message');

  // ---- 6. ignore-case option flips a diff into equal ----
  await setAB('Hello World', 'hello world');
  assert((await stat('#stat-add')) === '1' && (await stat('#stat-del')) === '1',
    'case-sensitive: 1 add / 1 del before ignoring case');
  await page.check('#opt-case');
  await page.waitForTimeout(150);
  assert((await stat('#stat-add')) === '0' && (await stat('#stat-del')) === '0',
    'ignore-case collapses the diff to 0 changes');
  assert(/相同/.test((await page.locator('#diff-out').textContent()) || ''),
    'ignore-case yields the identical state');
  await page.uncheck('#opt-case');
  await page.waitForTimeout(150);

  // ---- 7. swap A <-> B inverts add/del ----
  await setAB('one\ntwo', 'one\ntwo\nthree');
  assert((await stat('#stat-add')) === '1' && (await stat('#stat-del')) === '0',
    'before swap: 1 add / 0 del');
  await page.click('#btn-swap');
  await page.waitForTimeout(150);
  assert((await stat('#stat-add')) === '0' && (await stat('#stat-del')) === '1',
    'after swap: 0 add / 1 del');

  // ---- 8. sample button populates a real diff; settle for the thumbnail ----
  await page.click('#btn-sample');
  await page.waitForTimeout(180);
  const sAdd = Number(await stat('#stat-add'));
  const sDel = Number(await stat('#stat-del'));
  assert(sAdd > 0 && sDel > 0, `sample produces both additions and deletions (got +${sAdd}/-${sDel})`);
  assert((await page.locator('mark.w-ins').count()) >= 1, 'sample shows word-level highlights');

  await screenshot('thumb.png');
}
