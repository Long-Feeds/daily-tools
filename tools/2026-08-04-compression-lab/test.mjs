// Integration test for 压缩实验室 · Compression Lab.
// Drives the real codecs through the browser: sets inputs, waits for the render
// marker (never a bare timeout), and asserts concrete numeric outputs — output
// sizes, entropy figures, per-codec round-trip verdicts, Huffman code lengths,
// LZ token semantics — plus layout guards (no overflow, nothing collapsed to 0px,
// hidden panes really computed-hidden). Captures thumb.png for the homepage card.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#cl-input');

  const settled = async () => {
    await page.waitForFunction(() => document.body.dataset.state === 'ready');
  };
  // wait for a *new* run to finish, not a stale ready flag
  const runAnd = async (fn) => {
    const before = await page.evaluate(() => Number(document.body.dataset.run || 0));
    await fn();
    await page.waitForFunction((b) => document.body.dataset.state === 'ready' && Number(document.body.dataset.run || 0) > b, before);
  };
  const setText = async (t) => runAnd(async () => {
    await page.evaluate((v) => {
      const el = document.getElementById('cl-input');
      el.value = v;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, t);
  });
  const rowOf = (id) => page.locator(`#cl-results-body tr[data-codec="${id}"]`);
  const cell = async (id, f) => ((await rowOf(id).locator(`td[data-f="${f}"]`).textContent()) || '').trim();
  const sizeOf = async (id) => {
    const raw = await cell(id, 'size');
    const m = raw.match(/^([\d.,]+)\s*(B|KB|MB)$/);
    assert(m, `codec ${id} reports a parseable size (got "${raw}")`);
    const v = Number(m[1].replace(/,/g, ''));
    return m[2] === 'B' ? v : (m[2] === 'KB' ? v * 1024 : v * 1048576);
  };
  const CODECS = ['rle', 'huffman', 'lzss', 'deflate', 'ar0', 'ar1', 'bwt'];

  await settled();

  // ---------- 0. shell ----------
  assert(await page.locator('a[href="../../"]').first().isVisible(), 'back-to-hub link is present');
  assert((await page.locator('#cl-results-body tr').count()) >= 7, 'all seven codecs produce a row');

  // ---------- 1. a known, hand-checkable input ----------
  // 3000 identical bytes: H0 = 0, so the entropy floor is 0 and RLE should be tiny.
  await setText('A'.repeat(3000));
  assert((await page.locator('#cl-stat-bytes').textContent()).trim() === '3,000', 'byte count of 3000 ASCII chars is 3,000');
  assert((await page.locator('#cl-stat-syms').textContent()).trim() === '1', 'constant input uses exactly 1 distinct byte');
  assert((await page.locator('#cl-stat-h0').textContent()).trim() === '0.000', 'constant input has zero-order entropy 0.000');
  assert((await page.locator('#cl-stat-floor').textContent()).trim() === '0', 'H0 floor of constant input is 0 bytes');
  const rleConst = await sizeOf('rle');
  assert(rleConst > 0 && rleConst < 120, `RLE compresses 3000 identical bytes to under 120 B (got ${rleConst})`);
  for (const id of CODECS) {
    const rt = ((await cell(id, 'rt')) || '').trim();
    assert(rt.includes('一致') && !rt.includes('不一致'), `${id} round-trips the constant input (verdict "${rt}")`);
  }

  // ---------- 2. incompressible input: nothing may claim a win ----------
  // 4-bit-per-char hex noise from a fixed LCG => H0 should be ~4.000 bits/byte.
  const hexNoise = await page.evaluate(() => {
    let s = 0x9e3779b9, out = '';
    for (let i = 0; i < 4000; i++) {
      s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0;
      out += '0123456789abcdef'[s & 15];
    }
    return out;
  });
  await setText(hexNoise);
  const h0hex = Number((await page.locator('#cl-stat-h0').textContent()).trim());
  assert(Math.abs(h0hex - 4) < 0.02, `16-symbol uniform noise has H0 ≈ 4 bits/byte (got ${h0hex})`);
  const floorHex = Number((await page.locator('#cl-stat-floor').textContent()).replace(/,/g, ''));
  assert(Math.abs(floorHex - 2000) <= 10, `H0 floor of 4000 hex chars is ≈2000 B (got ${floorHex})`);
  const huffHex = await sizeOf('huffman');
  assert(huffHex > 1900 && huffHex < 2200, `Huffman on hex noise lands near the 2000 B floor (got ${huffHex})`);
  const rleHex = await sizeOf('rle');
  assert(rleHex > 4000, `RLE cannot compress non-repeating data — it grows past 4000 B (got ${rleHex})`);
  assert((await rowOf('rle').locator('td[data-f="size"].cl-badge-grow').count()) === 1, 'a codec that grows the input is flagged');

  // ---------- 3. structured text: the interesting comparisons ----------
  const prose = 'the quick brown fox jumps over the lazy dog. pack my box with five dozen liquor jugs. '.repeat(120);
  await setText(prose);
  const S = {};
  for (const id of CODECS) S[id] = await sizeOf(id);
  const n = Number((await page.locator('#cl-stat-bytes').textContent()).replace(/,/g, ''));
  assert(n === prose.length, `byte count matches the ASCII input length (${n} vs ${prose.length})`);
  assert(S.huffman < S.rle, 'Huffman beats RLE on English prose');
  assert(S.deflate < S.lzss, 'Deflate-lite beats plain LZSS (entropy-coding the tokens pays)');
  assert(S.deflate < S.huffman, 'Deflate-lite beats Huffman alone on repetitive prose');
  assert(S.bwt < S.huffman, 'the BWT pipeline beats Huffman alone on repetitive prose');
  assert(S.ar1 < S.ar0, 'order-1 arithmetic beats order-0 on natural language');
  const h0 = Number((await page.locator('#cl-stat-h0').textContent()).trim());
  const h1 = Number((await page.locator('#cl-stat-h1').textContent()).trim());
  assert(h1 < h0, `conditional entropy is below zero-order entropy (H1 ${h1} < H0 ${h0})`);
  const floor0 = Number((await page.locator('#cl-stat-floor').textContent()).replace(/,/g, ''));
  assert(Math.abs(floor0 - Math.ceil(n * h0 / 8)) <= 2, `reported floor equals ceil(n·H0/8) (${floor0})`);
  assert(S.ar0 < floor0 * 1.05 + 32, `order-0 arithmetic lands within 5% of the H0 floor (${S.ar0} vs ${floor0})`);
  for (const id of CODECS) {
    const rt = ((await cell(id, 'rt')) || '').trim();
    assert(rt.includes('一致') && !rt.includes('不一致'), `${id} round-trips English prose`);
  }
  // best row is the actual minimum and is marked
  const bestId = await page.locator('#cl-results-body tr.cl-best').getAttribute('data-codec');
  const minId = CODECS.reduce((a, b) => (S[a] <= S[b] ? a : b));
  assert(bestId === minId, `the highlighted "best" row is the true minimum (marked ${bestId}, min ${minId})`);
  // bits/byte must agree with the reported size
  const bpb = Number(await cell('deflate', 'bpb'));
  assert(Math.abs(bpb - S.deflate * 8 / n) < 0.01, `bits/byte column is consistent with the byte column (${bpb})`);

  // ---------- 4. browser-native gzip/deflate reference rows ----------
  await page.waitForFunction(() => ['done', 'none'].includes(document.body.dataset.native));
  if ((await page.evaluate(() => document.body.dataset.native)) === 'done') {
    assert((await page.locator('#cl-results-body tr.cl-ref').count()) === 2, 'two browser-native reference rows appear');
    const gz = await sizeOf('gzip');
    assert(gz > 0 && gz < n, 'browser gzip also compresses the sample');
    assert(S.deflate < gz * 2.2, `hand-written Deflate-lite is in the same league as the browser's real deflate (${S.deflate} vs ${gz})`);
    assert((await rowOf('gzip').locator('td[data-f="rt"]').textContent()).includes('参照'), 'reference rows are labelled as such, not as round-trip verified');
  }

  // ---------- 5. options actually change the result ----------
  const before32k = S.lzss;
  await runAnd(() => page.selectOption('#cl-window', '12'));
  const after4k = await sizeOf('lzss');
  assert(after4k !== before32k, `changing the LZ window changes LZSS output (${before32k} → ${after4k})`);
  await runAnd(() => page.selectOption('#cl-window', '15'));
  assert((await sizeOf('lzss')) === before32k, 'switching the window back reproduces the original size exactly');

  // ---------- 6. Huffman tab: code table + tree ----------
  const codeRows = page.locator('#cl-codes-body tr');
  assert((await codeRows.count()) > 5, 'the Huffman code table is populated');
  const lens = await page.evaluate(() => Array.from(document.querySelectorAll('#cl-codes-body tr'), (tr) => ({
    sym: tr.children[0].textContent.trim(),
    freq: Number(tr.children[1].textContent.replace(/,/g, '')),
    len: Number(tr.children[2].textContent),
    code: tr.children[3].textContent.trim()
  })));
  assert(lens[0].sym === "' '", `the most frequent byte in this prose is the space (got ${lens[0].sym})`);
  for (const r of lens) assert(r.code.length === r.len, `code string length matches the code-length column for ${r.sym}`);
  for (let i = 1; i < lens.length; i++) assert(lens[i].freq <= lens[i - 1].freq, 'code table is sorted by descending frequency');
  assert(lens[0].len <= lens[lens.length - 1].len, 'the most frequent symbol never gets a longer code than the rarest');
  // Kraft inequality over the visible codes must not be violated
  const kraft = lens.reduce((s, r) => s + Math.pow(2, -r.len), 0);
  assert(kraft <= 1.0000001, `visible codes satisfy the Kraft inequality (sum ${kraft.toFixed(4)})`);
  // prefix-freeness across visible codes
  let viol = 0;
  for (const a of lens) for (const b of lens) if (a !== b && b.code.startsWith(a.code)) viol++;
  assert(viol === 0, `visible Huffman codes are prefix-free (violations ${viol})`);
  const leaves = page.locator('#cl-tree text[data-term="leaf"]');
  assert((await leaves.count()) >= 5, 'the pruned code tree renders leaf labels');
  assert((await page.locator('#cl-tree circle').count()) > 8, 'the code tree renders nodes');

  // ---------- 7. LZ tab ----------
  await page.click('#cl-tab-lz');
  assert(await page.locator('#cl-pane-lz').isVisible(), 'the LZ pane shows after clicking its tab');
  assert(
    await page.evaluate(() => getComputedStyle(document.getElementById('cl-pane-huff')).display === 'none'),
    'the previously active pane is really hidden (computed display:none, not just [hidden])'
  );
  const matches = page.locator('#cl-lzview .cl-mat');
  assert((await matches.count()) > 3, 'the LZ view marks several matches in repetitive prose');
  await matches.first().click();
  const detail = (await page.locator('#cl-lz-detail').textContent()) || '';
  const md = detail.match(/offset=([\d,]+),\s*length=(\d+)/);
  assert(md, `clicking a match reports its (offset, length) — got "${detail.slice(0, 80)}"`);
  const off = Number(md[1].replace(/,/g, '')), len = Number(md[2]);
  assert(len >= 3, `a reported match is at least the 3-byte minimum (got ${len})`);
  // the claimed match must actually hold in the input: text[p..p+len) === text[p-off..p-off+len)
  const claimOk = await page.evaluate(([off, len, text]) => {
    // find the highlighted source region and confirm it holds the same bytes as the match
    const sel = document.querySelector('#cl-lzview .cl-mat-sel');
    if (!sel) return 'no-selection';
    const spans = Array.from(document.querySelectorAll('#cl-lzview span'));
    let pos = 0, matchStart = -1, srcStart = -1;
    for (const s of spans) {
      if (s === sel) matchStart = pos;
      if (s.classList.contains('cl-src') && srcStart < 0) srcStart = pos;
      pos += s.textContent.length;
    }
    if (matchStart < 0) return 'no-match-span';
    if (srcStart < 0) return 'src-offscreen';
    if (matchStart - srcStart !== off) return `offset mismatch: ${matchStart - srcStart} vs ${off}`;
    return text.slice(matchStart, matchStart + len) === text.slice(srcStart, srcStart + len) ? 'ok' : 'bytes differ';
  }, [off, len, prose]);
  assert(claimOk === 'ok' || claimOk === 'src-offscreen',
    `the highlighted source region really contains the matched bytes (got "${claimOk}")`);
  const stats = (await page.locator('#cl-lz-stats').textContent()) || '';
  assert(/最长匹配 (\d+) B/.test(stats), 'LZ stats report the longest match');
  assert(Number(stats.match(/最长匹配 (\d+) B/)[1]) >= len, 'the longest match is at least as long as the clicked one');

  // ---------- 8. histogram + bit ribbon ----------
  await page.click('#cl-tab-hist');
  assert((await page.locator('#cl-hist rect').count()) > 20, 'the byte histogram draws a bar per observed byte value');
  const tickCount = await page.locator('#cl-hist text').count();
  assert(tickCount === 9, `the histogram axis has exactly 9 fixed ticks, so labels cannot collide (got ${tickCount})`);
  await page.click('#cl-tab-bits');
  assert((await page.locator('#cl-bits .cl-bit').count()) === 512, 'the bit ribbon renders 512 output bits');
  const onesNote = (await page.locator('#cl-bits-note').textContent()) || '';
  assert(/占比 [\d.]+%/.test(onesNote), 'the bit ribbon reports the share of 1 bits');
  await runAnd(async () => {
    await page.selectOption('#cl-bits-codec', 'ar1');
    // selecting a codec re-renders bits only; force a full run so the marker advances
    await page.selectOption('#cl-block', '14');
  });
  assert((await page.locator('#cl-bits .cl-bit-1').count()) > 100, 'a well-compressed stream is roughly half ones');

  // ---------- 9. saved samples persist ----------
  await page.click('#cl-tab-huff');
  await page.fill('#cl-save-name', '测试样本');
  await page.click('#cl-save');
  assert((await page.locator('#cl-saved li').count()) === 1, 'saving adds an entry to the sample library');
  assert(
    await page.evaluate(() => getComputedStyle(document.getElementById('cl-saved-empty')).display === 'none'),
    'the empty-state hint is computed-hidden once a sample exists'
  );
  await page.reload({ waitUntil: 'domcontentloaded' });
  await settled();
  assert((await page.locator('#cl-saved li').count()) === 1, 'the saved sample survives a reload (localStorage)');
  const savedLabel = (await page.locator('#cl-saved .cl-saved-name').first().textContent()) || '';
  assert(savedLabel.includes('测试样本'), `the saved sample keeps its name (got "${savedLabel}")`);
  await runAnd(() => page.click('#cl-saved .cl-saved-name'));
  assert((await sizeOf('deflate')) === S.deflate, 'reloading the saved sample reproduces the exact same Deflate-lite size');
  await page.click('#cl-saved .cl-x');
  assert((await page.locator('#cl-saved li').count()) === 0, 'deleting removes the saved sample');

  // ---------- 10. built-in samples ----------
  await runAnd(() => page.click('.cl-tag[data-sample="dna"]'));
  const dnaH0 = Number((await page.locator('#cl-stat-h0').textContent()).trim());
  assert(dnaH0 > 1.9 && dnaH0 < 2.25, `a 4-letter DNA sample sits near 2 bits/byte of entropy (got ${dnaH0})`);
  const dnaBest = await page.locator('#cl-results-body tr.cl-best').getAttribute('data-codec');
  assert(CODECS.includes(dnaBest), 'a winner is still selected on the DNA sample');
  assert((await sizeOf('ar0')) < Number((await page.locator('#cl-stat-bytes').textContent()).replace(/,/g, '')) * 0.32,
    'order-0 arithmetic squeezes 2-bit DNA below 32% of its ASCII size');
  await runAnd(() => page.click('.cl-tag[data-sample="noise"]'));
  const noiseH0 = Number((await page.locator('#cl-stat-h0').textContent()).trim());
  assert(noiseH0 > 5.85 && noiseH0 <= 6.1, `random base64 text sits near 6 bits/byte (got ${noiseH0})`);

  // ---------- 11. empty + tiny inputs must not explode ----------
  await setText('');
  assert((await page.locator('#cl-stat-bytes').textContent()).trim() === '0', 'an empty input reports 0 bytes');
  assert((await page.locator('#cl-results-body tr').count()) >= 7, 'the table still renders for an empty input');
  await setText('x');
  for (const id of CODECS) {
    const rt = ((await cell(id, 'rt')) || '').trim();
    assert(rt.includes('一致') && !rt.includes('不一致'), `${id} round-trips a single-byte input`);
  }

  // ---------- 12. layout guards ----------
  await runAnd(() => page.click('.cl-tag[data-sample="log"]'));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 1, `the page does not scroll horizontally at 1280px (overflow ${overflow}px)`);
  const boxes = await page.evaluate(() => {
    const ids = ['cl-input', 'cl-window', 'cl-block', 'cl-save', 'cl-dl', 'cl-dl-report', 'cl-tab-huff', 'cl-chart', 'cl-results'];
    return ids.map((id) => { const r = document.getElementById(id).getBoundingClientRect(); return { id, w: r.width, h: r.height }; });
  });
  for (const b of boxes) assert(b.w >= 24 && b.h >= 16, `control #${b.id} is not collapsed (${Math.round(b.w)}×${Math.round(b.h)})`);
  const escapes = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('.cl-card').forEach((card) => {
      const c = card.getBoundingClientRect();
      card.querySelectorAll('button, select, input, table, svg').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        if (r.left < c.left - 2 || r.right > c.right + 2 || r.top < c.top - 2) bad.push(el.id || el.className || el.tagName);
      });
    });
    return bad;
  });
  assert(escapes.length === 0, `no control escapes its card (offenders: ${escapes.join(', ')})`);
  // chart reference labels must not overlap each other (the placeLabels guard)
  const markBoxes = await page.evaluate(() => Array.from(document.querySelectorAll('#cl-chart text[data-mark]'), (t) => {
    const r = t.getBoundingClientRect(); return { x1: r.left, x2: r.right, y1: r.top, y2: r.bottom, t: t.textContent };
  }));
  assert(markBoxes.length === 3, 'the chart draws all three reference markers');
  for (let i = 0; i < markBoxes.length; i++) for (let j = i + 1; j < markBoxes.length; j++) {
    const a = markBoxes[i], b = markBoxes[j];
    const hit = a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2;
    assert(!hit, `chart reference labels "${a.t}" and "${b.t}" do not overlap`);
  }
  // codec bars are all inside the plot and ordered by size
  const bars = await page.evaluate(() => Array.from(document.querySelectorAll('#cl-chart rect[data-bar]'), (r) => ({
    id: r.getAttribute('data-bar'), w: Number(r.getAttribute('width'))
  })));
  assert(bars.length >= 7, 'the chart draws a bar per codec');
  for (const b of bars) assert(b.w > 0 && b.w < 700, `bar for ${b.id} has a sane width (${b.w})`);

  // ---------- 13. keyboard access ----------
  await page.locator('#cl-tab-huff').focus();
  await page.keyboard.press('ArrowRight');
  assert(await page.locator('#cl-pane-lz').isVisible(), 'arrow keys move between detail tabs');
  await page.keyboard.press('ArrowLeft');
  assert(await page.locator('#cl-pane-huff').isVisible(), 'arrow keys move back');

  // ---------- thumbnail ----------
  await runAnd(() => page.click('.cl-tag[data-sample="log"]'));
  await page.waitForFunction(() => ['done', 'none'].includes(document.body.dataset.native));
  await page.evaluate(() => window.scrollTo(0, 330));
  await page.waitForFunction(() => window.scrollY > 100);
  await screenshot('thumb.png');
}
