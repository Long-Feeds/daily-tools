// Integration test for 字体工作台 · Font Studio.
// Loads real system fonts through the page and asserts concrete numbers that were
// cross-checked against fontTools offline (glyph counts, metrics, kern values,
// subset sizes), plus the layout guards this site keeps re-learning.
import { existsSync } from 'node:fs';

const FONTS = {
  times: '/System/Library/Fonts/Supplemental/Times New Roman.ttf',
  newyork: '/System/Library/Fonts/NewYork.ttf',
  geneva: '/System/Library/Fonts/Geneva.ttf',
  menlo: '/System/Library/Fonts/Menlo.ttc',
  avenir: '/System/Library/Fonts/Avenir Next.ttc',
  songti: '/System/Library/Fonts/Supplemental/Songti.ttc',
};

export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#btnDemo');

  const text = async (sel) => ((await page.locator(sel).textContent()) || '').trim();
  const display = (sel) => page.$eval(sel, (el) => getComputedStyle(el).display);
  const loaded = () => page.waitForFunction(() => window.__fs && window.__fs.view.font, null, { timeout: 20000 });
  const openFont = async (path) => {
    await page.evaluate(() => { window.__fs.view.font = null; });
    await page.setInputFiles('#fileInput', path);
    await loaded();
  };
  const info = () => page.evaluate(() => {
    const f = window.__fs.view.font;
    return { family: f.familyName, glyphs: f.numGlyphs, chars: f.unicodeCount, upem: f.unitsPerEm,
      kind: f.outlineKind, axes: f.axes ? f.axes.map((a) => a.tag) : null, tables: f.tables.length };
  });

  /* ---------- 0. shell ---------- */
  assert((await page.locator('a.fs-back').getAttribute('href')) === '../../', 'the back link points at the hub');
  assert((await text('h1')).includes('FONT'), 'the masthead is on screen');
  assert(await display('#panel-preview') === 'none', 'non-active panels are really hidden (computed display)');
  assert(await display('#panel-overview') !== 'none', 'the overview panel is visible');

  /* ---------- 1. the built-in demo font is written by the page itself ---------- */
  await page.click('#btnDemo');
  await loaded();
  const demo = await info();
  assert(demo.glyphs === 10, `the generated demo font has its 10 glyphs (got ${demo.glyphs})`);
  assert(demo.upem === 1000, `demo upem is 1000 (got ${demo.upem})`);
  assert(demo.family.includes('Studio Grotesk'), `the demo name table survives the round trip (got ${demo.family})`);
  const demoAdv = await page.evaluate(() => {
    const f = window.__fs.view.font;
    return { A: f.advance(f.gidFor(65)), O: f.advance(f.gidFor(79)), space: f.advance(f.gidFor(32)) };
  });
  assert(demoAdv.A === 660 && demoAdv.O === 720 && demoAdv.space === 260,
    `the demo advances survive being written and re-parsed (got ${JSON.stringify(demoAdv)})`);

  /* ---------- 2. a real font: numbers checked against fontTools ---------- */
  if (!existsSync(FONTS.times)) throw new Error('missing test font: ' + FONTS.times);
  await openFont(FONTS.times);
  const tnr = await info();
  assert(tnr.family === 'Times New Roman', `family name read from the name table (got ${tnr.family})`);
  assert(tnr.glyphs === 3380, `glyph count matches fontTools (got ${tnr.glyphs})`);
  assert(tnr.chars === 2790, `mapped characters match fontTools (got ${tnr.chars})`);
  assert(tnr.upem === 2048, `unitsPerEm is 2048 (got ${tnr.upem})`);
  assert(tnr.kind === 'TrueType', `outline kind is TrueType (got ${tnr.kind})`);

  const gids = await page.evaluate(() => {
    const f = window.__fs.view.font;
    return { A: f.gidFor(65), V: f.gidFor(86), space: f.gidFor(32), han: f.gidFor(0x6c38) };
  });
  assert(gids.A === 36 && gids.V === 57 && gids.space === 3,
    `cmap lookups match fontTools (A=${gids.A} V=${gids.V} space=${gids.space})`);
  assert(gids.han === 0, 'a CJK code point this font does not have maps to .notdef');

  // real kerning values, straight out of the kern table
  const kern = await page.evaluate(() => {
    const f = window.__fs.view.font;
    const g = (c) => f.gidFor(c.codePointAt(0));
    return { AV: f.pairKern(g('A'), g('V')), To: f.pairKern(g('T'), g('o')), AA: f.pairKern(g('A'), g('A')) };
  });
  assert(kern.AV === -264, `A/V kerning is -264 units (got ${kern.AV})`);
  assert(kern.To === -143, `T/o kerning is -143 units (got ${kern.To})`);
  assert(kern.AA === 0, `A/A is not kerned (got ${kern.AA})`);

  // outline of "A": same command list the reference implementation produces
  const glyphA = await page.evaluate(() => {
    const f = window.__fs.view.font;
    const p = f.glyphPath(f.gidFor(65), null);
    return { cmds: p.length, first: p[0], contours: p.filter((c) => c[0] === 'Z').length, adv: f.advance(f.gidFor(65)) };
  });
  assert(glyphA.adv === 1479, `advance of "A" is 1479 units (got ${glyphA.adv})`);
  assert(glyphA.contours === 2, `"A" has two contours (got ${glyphA.contours})`);
  assert(glyphA.first[0] === 'M' && Math.abs(glyphA.first[1] - 937) < 1 && Math.abs(glyphA.first[2] - 454) < 1,
    `"A" starts where fontTools starts it, at (937, 454) (got ${JSON.stringify(glyphA.first)})`);

  /* ---------- 3. the health report ---------- */
  const issues = (await page.locator('#issueList .fs-issue b').allTextContents()).join(' | ');
  assert(issues.includes('三套垂直度量不一致'), `the metric mismatch in Times New Roman is reported (got ${issues})`);
  assert(issues.includes('嵌入权限'), 'the embedding permission is reported');
  const metricRows = await page.locator('#metricsTable tbody tr').count();
  assert(metricRows === 4, `the metrics table lists all three metric sets (got ${metricRows - 1})`);
  const hheaRow = await page.evaluate(() => Array.from(document.querySelectorAll('#metricsTable tr'))
    .map((tr) => Array.from(tr.cells).map((c) => c.textContent.trim())).find((r) => r[0] === 'hhea'));
  assert(hheaRow && hheaRow[1] === '1825' && hheaRow[2] === '-443',
    `hhea ascent/descent are read correctly (got ${JSON.stringify(hheaRow)})`);
  const nameRows = await page.locator('#nameTable tbody tr').count();
  assert(nameRows > 6, `the name table is listed (got ${nameRows} rows)`);
  assert((await text('#nameTable')).includes('Monotype'), 'the copyright string is shown');

  // the metrics diagram must not silently drop its labels
  const metrics = await page.evaluate(() => ({ dropped: window.__fs.view.metricsDropped, drawn: window.__fs.view.metricsDrawn }));
  assert(metrics.drawn >= 8, `the metrics diagram drew its labels (got ${metrics.drawn})`);
  assert(metrics.dropped === 0, `no metrics label was dropped for lack of room (dropped ${metrics.dropped})`);

  /* ---------- 4. our own typesetting, with kerning that actually moves glyphs ---------- */
  await page.click('#tab-preview');
  await page.fill('#previewText', 'AVATAR To Wa');
  await page.waitForFunction(() => document.getElementById('previewStats').textContent.includes('字距命中'));
  const withKern = await page.evaluate(() => {
    const f = window.__fs.view.font;
    const s = f.shape('AVATAR To Wa', { features: [], kerning: true });
    return { kerned: s.kerned, glyphs: s.glyphs.length, pairs: s.glyphs.filter((g) => g.kern).map((g) => g.kern) };
  });
  assert(withKern.glyphs === 12, `every character got a glyph (got ${withKern.glyphs})`);
  assert(withKern.kerned >= 4, `several pairs kern in this string (got ${withKern.kerned})`);
  assert(withKern.pairs.every((v) => v < 0), `the kern adjustments pull letters together (got ${withKern.pairs})`);
  const noKern = await page.evaluate(() => window.__fs.view.font.shape('AVATAR To Wa', { features: [], kerning: false }).kerned);
  assert(noKern === 0, 'turning kerning off really removes the adjustments');

  const statsText = await text('#previewStats');
  assert(/\d+ 个字形上屏/.test(statsText), `the preview reports what it drew (got ${statsText})`);
  const kernRows = await page.locator('#kernTable tbody tr').count();
  assert(kernRows >= 3, `the kern sample table lists the pairs it hit (got ${kernRows - 1})`);
  const painted = await page.evaluate(() => {
    const c = document.getElementById('previewCanvas');
    const ctx = c.getContext('2d');
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    let ink = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i] > 60 || d[i + 1] > 60 || d[i + 2] > 60) ink++;
    return ink;
  });
  assert(painted > 5000, `the preview canvas really has glyphs painted on it (${painted} ink pixels)`);

  /* ---------- 5. glyph browser ---------- */
  await page.click('#tab-glyphs');
  await page.waitForSelector('.fs-cell');
  const cells = await page.locator('.fs-cell').count();
  assert(cells === 84, `a page of glyphs is 84 cells (got ${cells})`);
  await page.fill('#glyphSearch', 'W');
  await page.waitForFunction(() => (document.getElementById('detailTitle').textContent || '').includes('#'));
  const detail = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('#detailTable tr')).map((tr) => Array.from(tr.cells).map((c) => c.textContent.trim()));
    return { title: document.getElementById('detailTitle').textContent, rows };
  });
  assert(detail.title.includes('#58') && detail.title.includes('W'), `searching for W selects glyph 58 (got ${detail.title})`);
  const advRow = detail.rows.find((r) => r[0] === '前进宽度');
  assert(advRow && advRow[1].startsWith('1933'), `W advances 1933 units (got ${advRow && advRow[1]})`);
  const bboxRow = detail.rows.find((r) => r[0] === '外框');
  assert(bboxRow && bboxRow[1] === '27, -31 → 1917, 1356', `W bounding box matches fontTools (got ${bboxRow && bboxRow[1]})`);
  const detailInk = await page.evaluate(() => {
    const c = document.getElementById('detailCanvas');
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let ink = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i] > 80 || d[i + 1] > 80 || d[i + 2] > 80) ink++;
    return ink;
  });
  assert(detailInk > 8000, `the glyph detail canvas is drawn (${detailInk} ink pixels)`);
  const detailLabels = await page.evaluate(() => ({ dropped: window.__fs.view.detailDropped, drawn: window.__fs.view.detailDrawn }));
  assert(detailLabels.dropped === 0, `no metric label was dropped on the glyph detail (dropped ${detailLabels.dropped})`);
  assert(detailLabels.drawn >= 5, `the glyph detail really drew its labels (drawn ${detailLabels.drawn})`);

  /* ---------- 6. missing characters ---------- */
  await page.click('#tab-coverage');
  await page.fill('#coverText', '中文字符 ABC 123');
  await page.waitForFunction(() => document.getElementById('coverStats').textContent.includes('缺字'));
  const cover = await text('#coverStats');
  assert(cover.includes('4 个缺字'), `Times New Roman is missing the four Chinese characters (got ${cover})`);
  const chips = await page.locator('.fs-chip').count();
  assert(chips === 4, `each missing character gets a chip (got ${chips})`);
  const chipText = (await page.locator('.fs-chip').allTextContents()).join(' ');
  assert(chipText.includes('U+4E2D') && chipText.includes('U+5B57'), `each chip shows its code point (got ${chipText})`);
  const setRows = await page.evaluate(() => Array.from(document.querySelectorAll('#setTable tr'))
    .map((tr) => Array.from(tr.cells).map((c) => c.textContent.trim())));
  const ascii = setRows.find((r) => r[0] && r[0].includes('ASCII'));
  const gb1 = setRows.find((r) => r[0] && r[0].includes('GB2312 一级'));
  assert(ascii && ascii[1] === '95 / 95', `full ASCII coverage is reported (got ${ascii && ascii[1]})`);
  assert(gb1 && gb1[1] === '0 / 3755', `no GB2312 coverage in a Latin font (got ${gb1 && gb1[1]})`);
  const blockRows = await page.locator('#blockTable tbody tr').count();
  assert(blockRows > 5, `Unicode blocks are listed (got ${blockRows - 1})`);

  /* ---------- 7. subsetting: the exported file is real ---------- */
  await page.click('#tab-subset');
  await page.fill('#subsetChars', 'Font Studio AVATAR');
  await page.click('#btnSubset');
  await page.waitForFunction(() => document.getElementById('subsetResult').textContent.length > 0);
  const sub = await page.evaluate(() => {
    const r = window.__fs.view.subset;
    const f = window.__fs.view.font;
    return { bytes: r.bytes.length, gids: r.gids.length, cps: r.cps.length, tables: r.tables, source: window.__fs.view.fileSize, format: r.format };
  });
  assert(sub.cps === 13, `13 distinct characters were kept (got ${sub.cps})`);
  assert(sub.gids === sub.cps + 1, `one glyph per character plus .notdef (got ${sub.gids})`);
  assert(sub.bytes < sub.source / 20, `the subset is far smaller than the original (${sub.bytes} vs ${sub.source})`);
  assert(sub.tables.includes('glyf') && sub.tables.includes('cmap') && sub.tables.includes('name'),
    `the subset keeps the tables a font needs (got ${sub.tables.join(',')})`);

  // re-parse the produced file and compare it with the source, glyph by glyph
  const roundTrip = await page.evaluate(async () => {
    const src = window.__fs.view.font;
    const r = window.__fs.view.subset;
    const re = await FS.loadFonts(r.bytes.buffer.slice(r.bytes.byteOffset, r.bytes.byteOffset + r.bytes.length));
    const out = re.fonts[0];
    let same = 0, diff = [];
    for (const cp of r.cps) {
      const a = JSON.stringify(src.glyphPath(src.gidFor(cp), null));
      const b = JSON.stringify(out.glyphPath(out.gidFor(cp), null));
      const advA = src.advance(src.gidFor(cp)), advB = out.advance(out.gidFor(cp));
      if (a !== b || advA !== advB) diff.push(String.fromCodePoint(cp));
      else if (a !== '[]') same++;   // space has no outline; it counts as equal, not as compared
    }
    return { same, diff, glyphs: out.numGlyphs, upem: out.unitsPerEm, family: out.familyName };
  });
  assert(roundTrip.diff.length === 0, `every kept glyph survives the round trip unchanged (differs: ${roundTrip.diff.join('')})`);
  assert(roundTrip.same === 12, `12 visible glyphs compared byte for byte (space has no outline) (got ${roundTrip.same})`);
  assert(roundTrip.family === 'Times New Roman', `the subset keeps its name table (got ${roundTrip.family})`);

  // the browser itself accepts the generated font
  const live = await page.evaluate(async () => {
    const fam = document.getElementById('subsetSample').dataset.family;
    return { fam, ready: document.fonts.check('32px "' + fam + '"'), text: document.getElementById('subsetSample').textContent };
  });
  assert(live.ready, `the browser loaded the generated font (family ${live.fam})`);
  assert(live.text.includes('A') && live.text.includes('S'), `the sample is rendered with the subsetted characters (got ${live.text})`);
  assert((await text('#faceCss')).includes('@font-face'), 'the CSS snippet is offered');
  const kept = await page.locator('#subsetTable tbody tr').count();
  assert(kept > 8, `the kept-tables list is filled in (got ${kept - 1})`);

  /* ---------- 8. a variable font interpolates ---------- */
  await openFont(FONTS.newyork);
  const ny = await info();
  assert(ny.glyphs === 1811, `New York has 1811 glyphs (got ${ny.glyphs})`);
  assert(ny.axes && ny.axes.join(',') === 'opsz,wght,GRAD', `its three axes are read (got ${ny.axes})`);
  const varied = await page.evaluate(() => {
    const f = window.__fs.view.font;
    const gid = f.gidFor(65);
    const at = (v) => f.glyphPath(gid, f.normalizeCoords({ opsz: v, wght: 400, GRAD: 0 }));
    const wt = (w) => f.glyphPath(gid, f.normalizeCoords({ opsz: 256, wght: w, GRAD: 0 }));
    const width = (p) => { let a = Infinity, b = -Infinity; for (const c of p) for (let k = 1; k < c.length; k += 2) { a = Math.min(a, c[k]); b = Math.max(b, c[k]); } return b - a; };
    return { thin: width(wt(400)), bold: width(wt(1000)), small: width(at(12)), large: width(at(256)),
      norm12: f.normalizeCoords({ opsz: 12 })[0], norm134: f.normalizeCoords({ opsz: 134 })[0] };
  });
  assert(varied.bold > varied.thin + 5, `weight 1000 is wider than 400 (${varied.thin.toFixed(1)} -> ${varied.bold.toFixed(1)})`);
  assert(Math.abs(varied.small - varied.large) > 5, `the optical size axis changes the shape (${varied.small.toFixed(1)} vs ${varied.large.toFixed(1)})`);
  assert(Math.abs(varied.norm12 + 1) < 1e-6, `the axis minimum normalises to -1 (got ${varied.norm12})`);
  assert(Math.abs(varied.norm134 + 0.289144) < 1e-4, `avar remapping matches fontTools (got ${varied.norm134})`);
  await page.click('#tab-preview');
  assert(await display('#axisCard') !== 'none', 'the axis panel shows up for a variable font');
  const sliders = await page.locator('#axisList input[type=range]').count();
  assert(sliders === 3, `one slider per axis (got ${sliders})`);
  const instances = await page.locator('#instanceSelect option').count();
  assert(instances > 3, `the named instances are listed (got ${instances})`);

  /* ---------- 9. a font collection exposes every face ---------- */
  if (existsSync(FONTS.menlo)) {
    await openFont(FONTS.menlo);
    assert(await display('#faceRow') !== 'none', 'a .ttc offers its face picker');
    const faces = await page.locator('#faceSelect option').count();
    assert(faces === 4, `Menlo.ttc carries four faces (got ${faces})`);
    await page.selectOption('#faceSelect', '2');
    await page.waitForFunction(() => window.__fs.view.faceIndex === 2);
    const bold = await info();
    assert(bold.glyphs === 2490, `face 2 of the collection has its own glyph count (got ${bold.glyphs})`);
    assert(/Bold|Italic/i.test(bold.family + ' ' + (await text('#famSub'))), `face 2 is a different style (got ${bold.family})`);
  }

  /* ---------- 9b. GSUB really substitutes: a font with Latin ligatures ---------- */
  if (existsSync(FONTS.avenir)) {
    await openFont(FONTS.avenir);
    const av = await info();
    assert(av.glyphs === 1187, `Avenir Next face 0 has 1187 glyphs (got ${av.glyphs})`);
    const liga = await page.evaluate(() => {
      const f = window.__fs.view.font;
      const off = f.shape('fi fl', { features: [], kerning: false }).glyphs;
      const on = f.shape('fi fl', { features: ['liga'], kerning: false }).glyphs;
      return { off: off.length, on: on.length, gid: on[0].gid, ch: on[0].ch, subst: on[0].subst,
        plainF: off[0].gid, plainI: off[1].gid };
    });
    assert(liga.off === 5 && liga.on === 3, `enabling liga merges glyphs (${liga.off} -> ${liga.on})`);
    assert(liga.plainF === 73 && liga.plainI === 76, `unsubstituted f/i are gids 73/76 (got ${liga.plainF}/${liga.plainI})`);
    assert(liga.gid === 403 && liga.subst === 'liga' && liga.ch === 'fi',
      `"f" + "i" becomes the single ligature glyph 403 (got ${liga.gid}, ${liga.subst})`);
    await page.click('#tab-preview');
    const featBoxes = await page.locator('.fs-feat').count();
    assert(featBoxes >= 10, `every GSUB feature gets a switch (got ${featBoxes})`);
    const ligaChecked = await page.isChecked('#feat-liga');
    assert(ligaChecked, 'common ligatures are on by default');
  }

  /* ---------- 10. an old Mac font with a MacRoman name table ---------- */
  if (existsSync(FONTS.geneva)) {
    await openFont(FONTS.geneva);
    const gen = await info();
    assert(gen.glyphs === 3742, `Geneva has 3742 glyphs (got ${gen.glyphs})`);
    assert(gen.family === 'Geneva', `its MacRoman name decodes (got ${gen.family})`);
  }

  /* ---------- 11. layout guards ---------- */
  await openFont(FONTS.times);
  let scanned = 0;
  for (const tab of ['overview', 'preview', 'glyphs', 'coverage', 'subset']) {
    await page.click('#tab-' + tab);
    await page.waitForTimeout(90);
    const bad = await page.evaluate(() => {
      const out = [];
      let n = 0;
      for (const el of document.querySelectorAll('input, select, button, textarea')) {
        const r = el.getBoundingClientRect();
        if (!r.width && !r.height) continue;
        if (getComputedStyle(el).display === 'none' || getComputedStyle(el).visibility === 'hidden') continue;
        n++;
        if (el.type === 'checkbox') { if (r.width < 16 || r.height < 16) out.push('checkbox ' + el.id + ' ' + Math.round(r.width)); continue; }
        const minW = el.tagName === 'BUTTON' ? 52 : 100;
        if (r.width < minW || r.height < 18) out.push(`${el.tagName}#${el.id || el.className} ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
      return { out, n };
    });
    scanned += bad.n;
    assert(bad.out.length === 0, `[${tab}] no control collapses: ${bad.out.join(', ')}`);
  }
  assert(scanned >= 40, `the size guard actually saw the controls (${scanned} scanned across five tabs)`);

  // nothing escapes its card, and no glyph cell spills its content
  await page.click('#tab-glyphs');
  await page.waitForSelector('.fs-cell');
  const escapes = await page.evaluate(() => {
    const bad = [];
    for (const box of document.querySelectorAll('.fs-card, .fs-cell, .fs-stat, td, th')) {
      const p = box.getBoundingClientRect();
      if (!p.width) continue;
      for (const kid of box.children) {
        const k = kid.getBoundingClientRect();
        if (!k.width && !k.height) continue;
        if (k.left < p.left - 1 || k.right > p.right + 1 || k.top < p.top - 1 || k.bottom > p.bottom + 1) {
          bad.push(`${kid.tagName}.${kid.className} out of ${box.tagName}.${box.className}`);
        }
      }
    }
    return bad;
  });
  assert(escapes.length === 0, `nothing escapes its container: ${escapes.slice(0, 4).join(' | ')}`);

  // code blocks scroll inside their own box instead of stretching the card
  await page.click('#tab-subset');
  const preOver = await page.$eval('#faceCss', (el) => el.scrollWidth - el.clientWidth);
  assert(preOver <= 2, `the CSS snippet does not stretch its card (overflow ${preOver}px)`);

  // labels must not have been case-mangled into wrong unit symbols
  const shouty = await page.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll('th, dt, label')) {
      const t = (el.textContent || '').trim();
      if (/\b(PX|EM|KB|MS|UPEM|UNITS)\b/.test(t)) bad.push(t);
      if (getComputedStyle(el).textTransform !== 'none') bad.push('text-transform on: ' + t);
    }
    return bad;
  });
  assert(shouty.length === 0, `no label was uppercased into a wrong unit: ${shouty.join(' | ')}`);

  // narrow screens must not scroll the page sideways, and the diagrams must still
  // place every label rather than silently dropping half of them
  await page.click('#tab-overview');
  for (const w of [390, 768]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(320);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert(over <= 1, `no horizontal overflow at ${w}px (overflow ${over}px)`);
    const lab = await page.evaluate(() => ({ d: window.__fs.view.metricsDropped, n: window.__fs.view.metricsDrawn }));
    assert(lab.d === 0 && lab.n >= 8, `[${w}px] the metrics diagram still labels every rule (drawn ${lab.n}, dropped ${lab.d})`);
  }
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.waitForTimeout(220);

  /* ---------- 12. state survives a reload ---------- */
  await page.click('#tab-preview');
  await page.fill('#previewText', '记住我 Remember');
  await page.waitForTimeout(120);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#tab-preview');
  await page.click('#tab-preview');   // panels start on the overview tab after a reload
  assert((await page.inputValue('#previewText')) === '记住我 Remember', 'the sample text is remembered across reloads');
  const hist = await text('#histList');
  assert(hist.includes('Times New Roman'), `the fonts looked at are listed (got ${hist.slice(0, 60)})`);

  /* ---------- 13. thumbnail: a CJK glyph with its outline points and metrics ---------- */
  const thumbFont = existsSync(FONTS.songti) ? FONTS.songti : FONTS.newyork;
  await openFont(thumbFont);
  if (thumbFont === FONTS.songti) {
    const st = await info();
    assert(st.glyphs === 8535, `Songti face 0 has 8535 glyphs (got ${st.glyphs})`);
    assert(st.chars === 8159, `Songti maps 8159 characters, as fontTools counts them (got ${st.chars})`);
  }
  await page.click('#tab-glyphs');
  await page.fill('#glyphSearch', thumbFont === FONTS.songti ? '永' : 'R');
  await page.waitForFunction(() => (document.getElementById('detailTitle').textContent || '').includes('#'));
  await page.evaluate(() => window.scrollTo(0, 430));
  await page.waitForTimeout(260); // let the pill transitions settle before the shot
  await screenshot('thumb.png');
}
