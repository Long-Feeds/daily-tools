// Integration test for 中文校阅台 · Copy Desk.
// Drives the real proofreading engine through the browser and asserts concrete
// text transformations (not element existence). Captures thumb.png for the hub card.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#cd-input');
  await page.waitForFunction(() => document.body.dataset.runs);

  const runs = () => page.evaluate(() => Number(document.body.dataset.runs || 0));
  const settle = async (fn) => {
    const before = await runs();
    await fn();
    await page.waitForFunction((b) => Number(document.body.dataset.runs || 0) > b, before, { timeout: 10000 });
  };
  const val = () => page.inputValue('#cd-input');
  // 统计卡的数值后面跟着 <small> 单位,取数时先剥掉非数字字符
  const num = async (sel) => Number((await page.locator(sel).textContent()).replace(/[^\d.]/g, ''));
  const type = (t) => settle(() => page.fill('#cd-input', t));
  // 规则/选项控件住在「规则」面板里,面板隐藏时不可交互 —— 用完切回「校对」
  const onRules = async (fn) => {
    await page.click('#cd-tab-rules');
    await fn();
    await page.click('#cd-tab-check');
  };

  /* ── 0. shell ── */
  const back = page.locator('a[href="../../"]').first();
  assert(await back.count() === 1, 'back link to the hub exists');
  assert((await back.textContent()).includes('返回工具集'), 'back link says 返回工具集');

  /* ── 1. 排版规范化:真实文本变换 ── */
  await type('这是一个Chrome浏览器,今天上线第51个工具 。');
  assert(await num('#cd-count-issues') > 0, 'dirty text produces issues');
  await settle(() => page.click('#cd-fix-all'));
  assert(await val() === '这是一个 Chrome 浏览器，今天上线第 51 个工具。',
    `one-click normalize produces the exact expected text (got "${await val()}")`);
  assert(await num('#cd-count-auto') === 0, 'no auto-fixable issues remain after normalize');

  /* ── 2. 撤销回到脏稿 ── */
  await settle(() => page.click('#cd-undo'));
  assert(await val() === '这是一个Chrome浏览器,今天上线第51个工具 。', 'undo restores the dirty text');

  /* ── 3. 保护区:URL / 行内代码 / 小数不被误改 ── */
  await type('见 https://a.com/x?a=1,b=2 与 `a,b` 和 3.14 的说明,以及"中文引号"。');
  await settle(() => page.click('#cd-fix-all'));
  const prot = await val();
  assert(prot.includes('https://a.com/x?a=1,b=2'), 'URL is left untouched by normalization');
  assert(prot.includes('`a,b`'), 'inline code is left untouched');
  assert(prot.includes('3.14'), 'decimal number is left untouched');
  assert(prot.includes('“中文引号”'), 'straight quotes around CJK become curly quotes');
  assert(prot.includes('说明，以及'), 'the half-width comma in CJK context became full-width');

  /* ── 4. 单条应用 / 忽略 / 定位 ── */
  await type('请登陆你的帐号');
  const before = await page.locator('.cd-card').count();
  assert(before >= 2, `two confusable issues are listed (got ${before})`);
  const firstCard = page.locator('.cd-card').first();
  await settle(() => firstCard.locator('.cd-apply').click());
  assert(await val() === '请登录你的帐号', `applying only the first card fixes only 登陆 (got "${await val()}")`);
  await settle(() => page.locator('.cd-card').first().locator('.cd-apply').click());
  assert(await val() === '请登录你的账号', 'applying the second card fixes 帐号');

  await type('他跑的很快');
  const deCard = page.locator('.cd-card[data-rule="dedide"]');
  assert(await deCard.count() === 1, '的地得 issue is surfaced');
  await deCard.locator('.cd-locate').click();
  const sel = await page.evaluate(() => {
    const el = document.querySelector('#cd-input');
    return [el.selectionStart, el.selectionEnd];
  });
  assert(sel[0] === 2 && sel[1] === 3, `locate selects the offending 的 at [2,3] (got ${sel})`);
  await settle(() => deCard.locator('.cd-apply').click());
  assert(await val() === '他跑得很快', '的地得 suggestion applies to 得');

  await type('赋能用户,打通链路,形成闭环');
  const clicheCount = await page.locator('.cd-card[data-rule="cliche"]').count();
  assert(clicheCount === 3, `nested cliché hits collapse to 3 cards (got ${clicheCount})`);
  const beforeIgnore = await page.locator('.cd-card').count();
  await settle(() => page.locator('.cd-card[data-rule="cliche"]').first().locator('.cd-ignore').click());
  assert(await page.locator('.cd-card').count() === beforeIgnore - 1, 'ignoring removes exactly one card');

  /* ── 5. 合规词 + 自定义词表 ── */
  await type('本产品是行业第一,效果最佳,100%满意,行业领先。');
  const danger = page.locator('.cd-card[data-rule="forbidden"]');
  assert(await danger.count() === 3, `three built-in 极限词 hits (got ${await danger.count()})`);
  assert((await danger.first().textContent()).includes('行业第一'), 'the first compliance card names 行业第一');
  await onRules(() => settle(() => page.fill('#cd-custom-words', '行业领先')));
  assert(await page.locator('.cd-card[data-rule="forbidden"]').count() === 4,
    'a custom forbidden word adds a fourth compliance hit');
  await onRules(() => settle(() => page.fill('#cd-custom-words', '')));

  /* ── 6. 分组筛选 chips ── */
  await settle(() => page.click('.cd-chip[data-group="合规"]'));
  const groups = await page.locator('.cd-card').evaluateAll((els) => [...new Set(els.map((e) => e.dataset.rule))]);
  assert(groups.length === 1 && groups[0] === 'forbidden', `合规 chip filters to compliance only (got ${groups})`);
  await settle(() => page.click('.cd-chip[data-group="全部"]'));
  assert(await page.locator('.cd-card[data-rule="forbidden"]').count() === 3, '全部 chip restores every card');

  /* ── 7. 规则开关 ── */
  await onRules(() => settle(() => page.uncheck('#cd-rule-forbidden')));
  assert(await page.locator('.cd-card[data-rule="forbidden"]').count() === 0, 'disabling a rule removes its cards');
  await onRules(() => settle(() => page.check('#cd-rule-forbidden')));
  assert(await page.locator('.cd-card[data-rule="forbidden"]').count() === 3, 're-enabling brings them back');
  const ruleCount = await page.locator('#cd-rules .cd-rulerow').count();
  assert(ruleCount === 21, `the rules panel lists all 21 rules (got ${ruleCount})`);

  /* ── 8. 选项:引号风格 / 盘古数字 ── */
  await type('这是"中文引号"啊');
  await onRules(() => settle(() => page.selectOption('#cd-quote-style', 'corner')));
  await settle(() => page.click('#cd-fix-all'));
  assert(await val() === '这是「中文引号」啊', `corner quote style (got "${await val()}")`);
  await onRules(() => settle(() => page.selectOption('#cd-quote-style', 'curly')));

  await type('第51个');
  await onRules(() => settle(() => page.uncheck('#cd-pangu-digit')));
  assert(await num('#cd-count-auto') === 0, 'digit spacing off ⇒ nothing to fix');
  await onRules(() => settle(() => page.check('#cd-pangu-digit')));
  await settle(() => page.click('#cd-fix-all'));
  assert(await val() === '第 51 个', 'digit spacing on ⇒ spaces inserted');

  /* ── 9. 标签页切换 + [hidden] 真的把面板藏起来了 ── */
  const disp = (sel) => page.locator(sel).evaluate((el) => getComputedStyle(el).display);
  assert(await disp('#cd-panel-check') !== 'none', 'check panel visible initially');
  assert(await disp('#cd-panel-stats') === 'none', 'stats panel computed display is none initially');
  assert(await disp('#cd-panel-diff') === 'none', 'diff panel computed display is none initially');
  assert(await disp('#cd-panel-rules') === 'none', 'rules panel computed display is none initially');
  await page.click('#cd-tab-stats');
  assert(await disp('#cd-panel-stats') !== 'none', 'stats panel shows after clicking its tab');
  assert(await disp('#cd-panel-check') === 'none', 'check panel is hidden (computed) after switching');

  /* ── 10. 统计口径:断真实数字 ── */
  await type('短句一。短句二。短句三。\n\n' + '长'.repeat(60) + '。');
  await page.click('#cd-tab-stats');
  // 「短句一。」= 3 个汉字(句号不计入字数口径),长句 = 60 个「长」
  assert(await num('#cd-stat-sents') === 4, `4 sentences (got ${await num('#cd-stat-sents')})`);
  assert(await num('#cd-stat-paras') === 2, `2 paragraphs (got ${await num('#cd-stat-paras')})`);
  assert(await num('#cd-stat-cjk') === 9 + 60, `CJK count = 3×3 + 60 (got ${await num('#cd-stat-cjk')})`);
  const avg = Number((await page.locator('#cd-stat-avgsent').textContent()).replace(/[^\d.]/g, ''));
  // 真值 (3+3+3+60)/4 = 17.25,面板保留一位小数显示 17.3
  assert(Math.abs(avg - (3 + 3 + 3 + 60) / 4) < 0.06, `average sentence length 17.25 (got ${avg})`);
  assert(await num('#cd-stat-maxsent') === 60, `longest sentence is 60 units (got ${await num('#cd-stat-maxsent')})`);
  const score = await num('#cd-read-score');
  assert(score > 0 && score < 100, `readability penalised by the 61-char sentence (got ${score})`);

  const histRows = await page.locator('#cd-hist-table tbody tr').evaluateAll((rows) =>
    rows.map((r) => [...r.children].map((c) => c.textContent.trim())));
  const bucket = (label) => Number(histRows.find((r) => r[0] === label)[1]);
  assert(bucket('1-10') === 3, `three short sentences in the 1-10 bucket (got ${bucket('1-10')})`);
  assert(bucket('51-60') === 1, `the 60-char sentence lands in 51-60 (got ${bucket('51-60')})`);
  assert(histRows.reduce((a, r) => a + Number(r[1]), 0) === 4, 'histogram buckets sum to the sentence count');

  /* ── 11. canvas:所有标签都真的画出来了(不是「掉了几个」) ── */
  const labels = JSON.parse(await page.locator('#cd-hist').getAttribute('data-labels'));
  const nonEmpty = histRows.filter((r) => Number(r[1]) > 0).length;
  assert(labels.kinds.xtick === 8, `all 8 x-axis tick labels drawn (got ${labels.kinds.xtick})`);
  assert(labels.kinds.value === nonEmpty, `every non-empty bar has its count label (${labels.kinds.value}/${nonEmpty})`);
  assert(labels.kinds.thr === 1, 'the long-sentence threshold label is drawn');
  assert(labels.kinds.ytick >= 2, 'y-axis ticks drawn');
  assert(labels.dropped === 0, `no label was dropped by collision avoidance (dropped=${labels.dropped})`);

  const paraRows = await page.locator('.cd-para-row').count();
  assert(paraRows === 2, `paragraph rhythm shows 2 rows (got ${paraRows})`);
  const topChar = await page.locator('#cd-freq tbody tr').first().evaluate((r) => [...r.children].map((c) => c.textContent));
  assert(topChar[0] === '长' && Number(topChar[1]) === 60, `top character is 长 ×60 (got ${topChar})`);

  /* ── 12. 规范化预览 diff ── */
  await type('这是一个Chrome浏览器,很好.');
  await page.click('#cd-tab-diff');
  const ins = await page.locator('#cd-diff ins').allTextContents();
  const del = await page.locator('#cd-diff del').allTextContents();
  assert(ins.join('').includes('。'), `diff inserts the full-width period (ins=${JSON.stringify(ins)})`);
  assert(del.join('').includes(','), `diff deletes the half-width comma (del=${JSON.stringify(del)})`);
  // 改动块里的空格显示成 ␣,比对前换回普通空格
  const rebuilt = await page.locator('#cd-diff').evaluate((box) =>
    [...box.childNodes].filter((n) => n.nodeName !== 'DEL')
      .map((n) => n.textContent).join('').replace(/␣/g, ' '));
  assert(rebuilt === '这是一个 Chrome 浏览器，很好。', `diff (keep+ins) rebuilds the fixed text (got "${rebuilt}")`);
  const insMarks = await page.locator('#cd-diff ins').allTextContents();
  assert(insMarks.some((t) => t.includes('␣')), `inserted spaces are shown explicitly (${JSON.stringify(insMarks)})`);
  await settle(() => page.click('#cd-fix-all'));
  assert(await val() === rebuilt, 'applying the fix yields exactly what the diff previewed');
  await page.click('#cd-tab-diff');
  assert(await page.locator('#cd-diff-clean').count() === 1, 'clean text shows the no-change message');

  /* ── 13. 文稿库 + 草稿持久化(localStorage) ── */
  await type('这是要存进文稿库的一篇稿子。');
  await page.click('#cd-save');
  await page.waitForFunction(() => document.querySelectorAll('#cd-docs option').length > 1);
  await settle(() => page.click('#cd-clear'));
  assert(await val() === '', 'clear empties the editor');
  await settle(() => page.selectOption('#cd-docs', '0'));
  assert(await val() === '这是要存进文稿库的一篇稿子。', 'selecting a saved doc restores it');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.body.dataset.runs);
  assert(await val() === '这是要存进文稿库的一篇稿子。', 'draft survives a reload');
  assert(await page.locator('#cd-docs option').count() === 2, 'the doc library survives a reload');

  /* ── 14. 示例脏稿:端到端 ── */
  await settle(() => page.click('#cd-sample'));
  const dirtyIssues = await num('#cd-count-issues');
  assert(dirtyIssues >= 25, `the sample surfaces ≥25 issues (got ${dirtyIssues})`);
  const shownGroups = await page.locator('.cd-chip').evaluateAll((els) =>
    els.map((e) => [e.dataset.group, Number(e.textContent.trim().split(/\s+/).pop())]));
  for (const [g, n] of shownGroups) assert(n > 0, `group chip 「${g}」 has a non-zero count`);
  await settle(() => page.click('#cd-fix-all'));
  const fixed = await val();
  for (const [needle, why] of [
    ['第 51 个工具', 'pangu spacing applied'],
    ['登录你的账号', '登陆/帐号 corrected'],
    ['截至目前', '截止目前 corrected'],
    ['……', 'ellipsis normalised'],
    ['“被直引号包起来的中文”', 'quotes converted'],
    ['（中文括号）', 'parens converted'],
    ['ABC', 'full-width letters converted'],
    ['https://long-feeds.github.io/daily-tools/', 'URL preserved'],
    ['`a,b`', 'inline code preserved'],
    ['3.14', 'decimal preserved']
  ]) assert(fixed.includes(needle), `sample after normalize: ${why}`);
  assert(!fixed.includes('!!!') && !fixed.includes('！！！'), 'sample: repeated exclamation marks collapsed');
  assert(!fixed.includes('​'), 'sample: zero-width character removed');
  assert(!/ＡＢＣ/.test(fixed), 'sample: no full-width letters left');
  assert(await num('#cd-count-auto') === 0, 'sample: nothing auto-fixable remains');
  assert(await num('#cd-count-issues') > 0, 'sample: judgement-call issues (合规/语感) still stand');

  /* ── 15. 控件最小尺寸守卫(每个标签页都要扫,隐藏面板里的控件同样会塌缩) ── */
  const scanControls = () => page.evaluate(() => {
    const bad = [], seen = [];
    for (const el of document.querySelectorAll('input, select, button, textarea')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      seen.push(el.id || el.className);
      const minW = el.type === 'checkbox' ? 18 : (el.tagName === 'BUTTON' ? 52 : 100);
      if (r.width < minW || r.height < 18) {
        bad.push(`${el.tagName}#${el.id || el.className} ${r.width.toFixed(0)}x${r.height.toFixed(0)}`);
      }
    }
    return { bad, n: seen.length };
  });
  let controlsChecked = 0;
  for (const tab of ['check', 'stats', 'diff', 'rules']) {
    await page.click('#cd-tab-' + tab);
    const { bad, n } = await scanControls();
    assert(bad.length === 0, `no collapsed controls on the ${tab} tab: ${bad.join(', ')}`);
    controlsChecked += n;
  }
  assert(controlsChecked >= 40, `the size guard actually saw controls on every tab (got ${controlsChecked})`);
  const numInput = await page.locator('#cd-long').boundingBox();
  assert(numInput.width >= 110, `the 长句阈值 number input is not collapsed (${numInput.width.toFixed(0)}px)`);

  /* ── 16. 没有 CSS 大写改写(会把 dBFS 写成 DBFS 那一类) ── */
  const upper = await page.evaluate(() =>
    [...document.querySelectorAll('*')]
      .filter((el) => getComputedStyle(el).textTransform === 'uppercase')
      .map((el) => el.tagName + '.' + el.className).slice(0, 5));
  assert(upper.length === 0, `no element uses text-transform:uppercase (${upper.join(', ')})`);

  /* ── 17. 键盘可用 ── */
  await page.locator('#cd-tab-check').focus();
  await page.keyboard.press('ArrowRight');
  assert(await page.locator('#cd-tab-stats').getAttribute('aria-selected') === 'true',
    'ArrowRight moves to the next tab');
  await page.locator('#cd-tab-check').click();

  /* ── 18. 窄屏无横向溢出 ── */
  await page.setViewportSize({ width: 390, height: 900 });
  await page.waitForFunction(() => document.body.dataset.runs);
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 1, `no horizontal overflow at 390px (overflow=${overflow}px)`);
  await page.setViewportSize({ width: 1280, height: 850 });

  /* ── thumbnail ── */
  await settle(() => page.click('#cd-sample'));
  await page.locator('#cd-tab-check').click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('#cd-input').evaluate((el) => el.blur());
  await page.waitForFunction(() => document.querySelectorAll('.cd-card').length > 3);
  await screenshot('thumb.png');
}
