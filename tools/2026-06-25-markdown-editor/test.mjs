// Integration test for Markdown 工作台.
// Drives the real editor + custom Markdown parser through the browser and asserts
// concrete rendered output, stats, toolbar actions, escaping, export and
// localStorage persistence. Captures thumb.png used as the homepage card thumbnail.
export default async function ({ page, toolURL, screenshot, assert }) {
  try { await page.context().grantPermissions(['clipboard-read', 'clipboard-write']); } catch {}

  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#md-input');

  const setMd = async (v) => { await page.fill('#md-input', v); await page.waitForTimeout(110); };
  const P = (sel) => page.locator('#preview ' + sel);

  // ---- a rich document renders to the right HTML ----
  const doc = [
    '# Title One', '',
    'Some **bold** and *italic* and ~~struck~~ and `code` text.', '',
    '## Sub Heading', '',
    '- apple', '- banana', '- cherry', '',
    '1. first', '2. second', '',
    '> a quoted line', '',
    '[Anthropic](https://www.anthropic.com)', '',
    '```js', 'const x = 1;', '```', '',
    '| A | B |', '| --- | --- |', '| 1 | 2 |', '',
    '- [ ] todo one', '- [x] done two', '',
  ].join('\n');
  await setMd(doc);

  assert((await P('h1').count()) === 1, 'exactly one h1');
  assert(/Title One/.test((await P('h1').first().textContent()) || ''), 'h1 text is "Title One"');
  assert((await P('h2').count()) >= 1, 'h2 rendered');
  assert(/Sub Heading/.test((await P('h2').first().textContent()) || ''), 'h2 text is "Sub Heading"');
  assert(/^bold$/.test(((await P('strong').first().textContent()) || '').trim()), '** ** -> <strong>bold</strong>');
  assert(/^italic$/.test(((await P('em').first().textContent()) || '').trim()), '* * -> <em>italic</em>');
  assert(/^struck$/.test(((await P('del').first().textContent()) || '').trim()), '~~ ~~ -> <del>struck</del>');
  const codeTexts = await P('code').allTextContents();
  assert(codeTexts.some((t) => t.trim() === 'code'), 'inline `code` -> <code>code</code>');

  assert((await P('ul li').count()) >= 3, 'bullet list has >=3 items');
  const ulText = (await P('ul').first().textContent()) || '';
  assert(/apple/.test(ulText) && /cherry/.test(ulText), 'bullet list contains apple..cherry');
  assert((await P('ol li').count()) >= 2, 'ordered list has 2 items');
  assert(/first/.test((await P('ol').first().textContent()) || ''), 'ordered list first item');

  assert(/a quoted line/.test((await P('blockquote').first().textContent()) || ''), 'blockquote rendered');

  const link = P('a[href="https://www.anthropic.com"]');
  assert((await link.count()) === 1, 'link href resolved');
  assert(/Anthropic/.test((await link.first().textContent()) || ''), 'link text');
  assert((await link.first().getAttribute('target')) === '_blank', 'link opens in new tab');
  assert(/noopener/.test((await link.first().getAttribute('rel')) || ''), 'link is rel=noopener');

  assert((await P('pre code').count()) >= 1, 'fenced code block rendered');
  assert(/const x = 1;/.test((await P('pre code').first().textContent()) || ''), 'code block keeps content verbatim');

  assert((await P('table').count()) === 1, 'pipe table rendered');
  assert((await P('table th').count()) === 2, 'table has two header cells');
  const tds = await P('table td').allTextContents();
  assert(tds.includes('1') && tds.includes('2'), 'table body cells present');

  const boxes = P('input[type=checkbox]');
  assert((await boxes.count()) === 2, 'two task-list checkboxes');
  assert((await boxes.nth(0).isChecked()) === false, 'first task unchecked');
  assert((await boxes.nth(1).isChecked()) === true, 'second task checked');

  // ---- security: raw HTML is escaped, never executed ----
  await setMd('Hello <' + 'script>window.__pwned=1<' + '/script> <b>raw</b> & ok');
  assert((await P('script').count()) === 0, 'no <script> element injected into preview');
  const innerHtml = await page.innerHTML('#preview');
  assert(/&lt;script&gt;/.test(innerHtml), 'raw <script> is HTML-escaped');
  assert((await page.evaluate(() => window.__pwned)) === undefined, 'injected script did not execute');

  // ---- stats are exact ----
  await setMd('alpha beta gamma delta');
  assert((await page.locator('#stat-words').textContent()) === '4', 'word count = 4 (latin words)');
  await setMd('你好 world');
  assert((await page.locator('#stat-words').textContent()) === '3', 'word count = 3 (2 CJK chars + 1 word)');
  assert((await page.locator('#stat-chars').textContent()) === '8', 'char count = 8');

  // ---- toolbar: bold wraps the selection ----
  await setMd('word');
  await page.$eval('#md-input', (el) => { el.focus(); el.setSelectionRange(0, 4); });
  await page.click('.tbtn[data-md="bold"]');
  assert((await page.inputValue('#md-input')) === '**word**', 'bold button wraps the selection');
  assert((await P('strong').count()) >= 1, 'preview reflects the bold edit');

  // ---- toolbar: H2 prefixes the current line ----
  await setMd('heading line');
  await page.$eval('#md-input', (el) => { el.focus(); el.setSelectionRange(0, 0); });
  await page.click('.tbtn[data-md="h2"]');
  assert((await page.inputValue('#md-input')) === '## heading line', 'H2 button prefixes the line');
  assert((await P('h2').count()) >= 1, 'preview shows the new h2');

  // ---- toolbar: bullet list prefixes each selected line ----
  await setMd('a\nb');
  await page.$eval('#md-input', (el) => { el.focus(); el.setSelectionRange(0, el.value.length); });
  await page.click('.tbtn[data-md="ul"]');
  assert((await page.inputValue('#md-input')) === '- a\n- b', 'list button prefixes every selected line');

  // ---- outline / TOC ----
  await setMd('# One\n\n## Two\n\n### Three\n\nbody text');
  const tocItems = page.locator('#toc .toc-item');
  assert((await tocItems.count()) === 3, 'TOC lists all three headings');
  assert(/One/.test((await tocItems.first().textContent()) || ''), 'first TOC entry is "One"');
  await page.click('#toc-toggle');
  assert(await page.locator('#toc').evaluate((el) => el.classList.contains('open')), 'TOC opens on toggle');
  await tocItems.nth(2).click(); // navigates without throwing

  // ---- sample loads real content ----
  await page.click('#act-sample');
  await page.waitForTimeout(120);
  assert((await page.inputValue('#md-input')).length > 80, 'sample content loaded into editor');
  assert((await P('h1').count()) >= 1, 'sample preview has an h1');

  // ---- copy shows feedback, no crash ----
  await page.click('#act-copy-md');
  await page.waitForTimeout(80);
  assert(/复制/.test((await page.locator('#toast').textContent()) || ''), 'copy surfaces a toast');

  // ---- download .md actually fires a download ----
  const [dl] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#act-dl-md'),
  ]);
  assert(/\.md$/.test(dl.suggestedFilename()), 'download produces a .md file');

  // ---- clear needs a confirm (two clicks) ----
  assert((await page.inputValue('#md-input')).length > 0, 'editor has content before clearing');
  await page.click('#act-clear');
  await page.waitForTimeout(60);
  assert((await page.inputValue('#md-input')).length > 0, 'a single clear click does not wipe');
  await page.click('#act-clear');
  await page.waitForTimeout(60);
  assert((await page.inputValue('#md-input')) === '', 'second clear click wipes the editor');
  assert((await P('h1').count()) === 0, 'preview cleared too');

  // ---- persistence across reload ----
  const unique = '# Persisted XYZ-marker-2026';
  await setMd(unique);
  await page.waitForTimeout(560); // let the debounced autosave flush
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#md-input');
  await page.waitForTimeout(120);
  assert((await page.inputValue('#md-input')) === unique, 'content restored from localStorage after reload');

  // ---- settle a pretty state for the card thumbnail ----
  await page.click('#act-sample');
  await page.waitForTimeout(150);
  await page.click('.view-btn[data-view="split"]');
  await page.waitForTimeout(150);
  await screenshot('thumb.png');
}
