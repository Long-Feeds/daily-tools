// Integration test for 序列工作台 · Sequence Lab (Supabase design language).
// Drives the real engines through the browser and asserts *biological/numerical facts*,
// not element presence: GC/Tm recomputed independently, the back-translate → ORF-find →
// translate round-trip, genetic-code table differences (TGA/AGA/ATA), alignment invariants
// (ungapped projection == input, independent re-scoring of the returned alignment, exact
// self-alignment scores incl. the BLOSUM62 diagonal), an exactly-predictable Smith-Waterman
// core, restriction digest fragment arithmetic (linear + circular), IUPAC degenerate sites,
// protein pI/MW, and the localStorage round-trip.
// Plus the standing structural guards: [hidden] computed display (lesson 2026-07-20),
// boundingRect containment + control size floors (07-17 / 07-24), no horizontal overflow at
// 390px (07-23), and zero waitForTimeout anywhere (07-06).
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.body.dataset.ok === '1');
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.body.dataset.ok === '1');

  /* ── helpers ───────────────────────────────────────────────── */
  const txt = (sel) => page.evaluate((s) => {
    const el = document.querySelector(s);
    return el ? el.textContent.replace(/\s+/g, ' ').trim() : 'MISSING';
  }, sel);
  const disp = (sel) => page.evaluate((s) => {
    const el = document.querySelector(s);
    return el ? getComputedStyle(el).display : 'MISSING';
  }, sel);
  const rect = (sel) => page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height, r: r.right + scrollX, b: r.bottom + scrollY };
  }, sel);
  const inside = async (child, parent, pad = 1) => {
    const a = await rect(child), b = await rect(parent);
    assert(a && b, `both ${child} and ${parent} exist`);
    return a.x >= b.x - pad && a.r <= b.r + pad && a.y >= b.y - pad && a.b <= b.b + pad;
  };
  const sig = () => page.evaluate(() => document.body.dataset.sig);
  const settle = async (prev) => { await page.waitForFunction((p) => document.body.dataset.sig !== p, prev); };
  const act = async (fn) => { const p = await sig(); await fn(); await settle(p); };
  const click = (sel) => act(() => page.click(sel));
  const tile = (key) => page.evaluate((k) => {
    const el = document.querySelector(`[data-key="${k}"]`);
    if (!el) return null;
    const dd = el.querySelector('dd');
    return { value: dd.firstChild.textContent.trim(), unit: (dd.querySelector('small') || {}).textContent || '', sub: (el.querySelector('.sl-tilesub') || {}).textContent || '' };
  }, key);
  const setVal = (sel, value) => act(() => page.evaluate(({ s, v }) => {
    const el = document.querySelector(s);
    el.value = String(v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, { s: sel, v: value }));
  const setCheck = (sel, on) => act(() => page.evaluate(({ s, v }) => {
    const el = document.querySelector(s);
    if (el.checked !== v) { el.checked = v; el.dispatchEvent(new Event('change', { bubbles: true })); }
  }, { s: sel, v: on }));
  const rows = (sel) => page.evaluate((s) => [...document.querySelectorAll(s)].map(tr => [...tr.children].map(td => td.textContent.trim())), sel);
  const selectOpt = (sel, v) => act(() => page.selectOption(sel, v));
  const fmt1 = (x) => Number(x).toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const demo = await page.evaluate(() => ({ seq: window.__sl.demo.seq, protein: window.__sl.demo.protein }));
  assert(demo.seq.length === 485, `demo sequence is 485 nt (got ${demo.seq.length})`);
  assert(demo.protein.length === 118, `demo protein is 118 aa (got ${demo.protein.length})`);

  /* ══ 1. 概览:独立重算 GC / Tm / 长度 ═════════════════════════ */
  assert((await txt('#type-a')) === 'DNA', 'demo is detected as DNA');
  const gcCount = [...demo.seq].filter((c) => c === 'G' || c === 'C').length;
  const gcPct = gcCount / demo.seq.length * 100;
  const tGC = await tile('gc');
  assert(tGC.value === fmt1(gcPct), `GC tile ${tGC.value} == independently computed ${fmt1(gcPct)}`);
  const tLen = await tile('length');
  assert(tLen.value === '485' && tLen.unit === 'nt', `length tile shows 485 nt (got ${tLen.value}${tLen.unit})`);
  // 485 nt > 60 → GC 经验式 64.9 + 41*(GC-16.4)/N
  const wallace = 64.9 + 41 * (gcCount - 16.4) / demo.seq.length;
  const tTm = await tile('tm');
  assert(tTm.value === fmt1(wallace), `Tm tile ${tTm.value} == Wallace ${fmt1(wallace)}`);
  const tOrf = await tile('orf');
  assert(tOrf.value === '118', `longest-ORF tile shows 118 aa (got ${tOrf.value})`);
  // 分子量:单链脱水近似,应落在 300–340 Da/nt 区间
  const mwK = Number((await tile('mw')).value.replace(/,/g, ''));
  assert(mwK > 140 && mwK < 165, `ssDNA MW ${mwK} kDa plausible for 485 nt (≈308 Da/nt)`);

  // 组成条:各段宽度之和 = 100%
  const segTotal = await page.evaluate(() =>
    [...document.querySelectorAll('#comp-bar .sl-compseg')].reduce((s, e) => s + parseFloat(e.style.width), 0));
  assert(Math.abs(segTotal - 100) < 0.01, `composition bar widths sum to 100% (got ${segTotal})`);

  /* ══ 2. 序列视图 + 反向互补 ═══════════════════════════════════ */
  const rcOK = await page.evaluate((s) => {
    const rc = window.__sl.api.revcomp;
    return rc('ATGC', false) === 'GCAT' && rc(rc(s, false), false) === s && rc('AUGC', true) === 'GCAU';
  }, demo.seq);
  assert(rcOK, 'revcomp: ATGC→GCAT, involutive on the demo, RNA-aware');
  const viewHead = (await txt('#viewer')).slice(0, 30);
  assert(viewHead.startsWith('1 ' + demo.seq.slice(0, 10)), `viewer starts with position 1 + sequence head (got "${viewHead}")`);
  await setCheck('#opt-rc', true);
  const rcSeq = await page.evaluate((s) => window.__sl.api.revcomp(s, false), demo.seq);
  assert((await txt('#viewer')).includes(rcSeq.slice(0, 20)), 'viewer switches to the reverse-complement strand');
  await setCheck('#opt-rc', false);

  /* ══ 3. 翻译与 ORF ════════════════════════════════════════════ */
  await click('#tab-btn-orf');
  assert((await disp('#tab-overview')) === 'none', '[hidden] guard: overview panel is display:none when ORF tab is active');
  assert((await disp('#tab-orf')) !== 'none', 'ORF panel is visible');
  const orfRows = await rows('#orf-rows tr');
  assert(orfRows.length === 1, `default minAA=30 yields exactly 1 ORF (got ${orfRows.length})`);
  assert(orfRows[0][1] === '+1' && orfRows[0][5] === '118' && orfRows[0][6] === 'ATG',
    `top ORF is +1 frame / 118 aa / ATG start (got ${orfRows[0].join(' | ')})`);
  assert(orfRows[0][2] === '37' && orfRows[0][4] === '357',
    `top ORF spans nt 37 with 357 nt incl. stop (got start=${orfRows[0][2]} nt=${orfRows[0][4]})`);
  // 回译 → ORF 查找 → 翻译 的完整往返
  const protPane = (await txt('#orf-protein')).replace(/[\s0-9]/g, '');
  assert(protPane === demo.protein, 'ORF protein pane reproduces the back-translated demo protein exactly');
  assert((await disp('#orf-empty')) === 'none', '[hidden] guard: empty-state hidden while ORFs exist');

  // 最短长度过滤真的在过滤
  await setVal('#opt-minaa', 10);
  assert((await rows('#orf-rows tr')).length === 3, 'minAA=10 surfaces 3 ORFs');
  await setVal('#opt-minaa', 200);
  assert((await rows('#orf-rows tr')).length === 0, 'minAA=200 filters every ORF out');
  assert((await disp('#orf-empty')) !== 'none', 'empty-state becomes visible when nothing passes the filter');
  await setVal('#opt-minaa', 30);

  // 链过滤
  await setVal('#opt-minaa', 10);
  await selectOpt('#opt-strand', 'minus');
  const minusRows = await rows('#orf-rows tr');
  assert(minusRows.length > 0 && minusRows.every((r) => r[1].startsWith('−')), 'strand filter: only minus-strand ORFs listed');
  await selectOpt('#opt-strand', 'both');
  await setVal('#opt-minaa', 30);

  // 遗传密码表差异:TGA / AGA / ATA 在标准表与脊椎动物线粒体表下不同
  const codeDiff = await page.evaluate(() => {
    const t = window.__sl.api.translate;
    return { std: t('TGAAGAATA', 1, 0), mito: t('TGAAGAATA', 2, 0) };
  });
  assert(codeDiff.std === '*RI', `standard table: TGA AGA ATA → *RI (got ${codeDiff.std})`);
  assert(codeDiff.mito === 'W*M', `vertebrate mito table: TGA AGA ATA → W*M (got ${codeDiff.mito})`);
  // 六框翻译面板真的有 6 条框
  const frames = await txt('#frames');
  for (const f of ['+1', '+2', '+3', '−1', '−2', '−3']) assert(frames.includes(f), `six-frame pane contains frame ${f}`);

  /* ══ 4. 比对:不变式 + 独立重算得分 ═══════════════════════════ */
  await click('#tab-btn-align');
  // 4a. 自比对:全局 NW,得分应恰为 len × match
  await setVal('#seq-b', demo.seq);
  await click('#btn-align');
  let al = await page.evaluate(() => {
    const r = window.__sl.state.alignment;
    return { score: r.score, identities: r.identities, columns: r.columns, gaps: r.gaps, a: r.alignedA, b: r.alignedB, aStart: r.aStart, aEnd: r.aEnd };
  });
  assert(al.score === 485 * 2, `self-alignment score == 485×2 = 970 (got ${al.score})`);
  assert(al.identities === 485 && al.columns === 485 && al.gaps === 0, 'self-alignment is 485/485 identical, gap-free');
  assert((await tile('identity')).value === fmt1(100), 'identity tile reads 100.0%');

  // 4b. 突变体:缺失 12 nt + 3 处替换 → 不变式 + 独立重算
  const mutant = (() => {
    const s = demo.seq.slice(0, 100) + demo.seq.slice(112);
    const arr = [...s];
    for (const p of [40, 180, 300]) arr[p] = ({ A: 'C', C: 'A', G: 'T', T: 'G' })[arr[p]];
    return arr.join('');
  })();
  await setVal('#seq-b', mutant);
  await click('#btn-align');
  al = await page.evaluate(() => {
    const r = window.__sl.state.alignment;
    return { score: r.score, identities: r.identities, columns: r.columns, gaps: r.gaps, a: r.alignedA, b: r.alignedB };
  });
  assert(al.a.replace(/-/g, '') === demo.seq, 'global NW: ungapped projection of row A == input A');
  assert(al.b.replace(/-/g, '') === mutant, 'global NW: ungapped projection of row B == input B');
  assert(al.a.length === al.b.length, 'both alignment rows have equal length');
  const rescore = (aa, bb, { match = 2, mismatch = -1, gapOpen = 10, gapExt = 1, mat = null } = {}) => {
    let score = 0, gapA = false, gapB = false;
    for (let k = 0; k < aa.length; k++) {
      const x = aa[k], y = bb[k];
      if (x === '-') { score -= gapA ? gapExt : gapOpen; gapA = true; gapB = false; }
      else if (y === '-') { score -= gapB ? gapExt : gapOpen; gapB = true; gapA = false; }
      else { score += mat ? mat[x][y] : (x === y ? match : mismatch); gapA = gapB = false; }
    }
    return score;
  };
  assert(rescore(al.a, al.b) === al.score, `reported score ${al.score} == independently re-scored alignment ${rescore(al.a, al.b)}`);
  assert(al.gaps === 12, `the 12-nt deletion shows up as exactly 12 gap columns (got ${al.gaps})`);
  assert(al.identities === 485 - 12 - 3, `identities == 485 − 12 gaps − 3 substitutions (got ${al.identities})`);
  assert(al.score === 470 * 2 - 3 - (10 + 11 * 1),
    `score == 470 matches ×2 − 3 mismatches − affine gap(10+11×1) = 916 (got ${al.score})`);

  // 4c. 局部比对 Smith–Waterman:构造一个得分可精确预测的核心
  const core = demo.seq.slice(200, 240);
  await setVal('#seq-a', 'CCCCCCCCCC' + core + 'CCCCCCCCCC');
  await setVal('#seq-b', 'AAAAAAAAAA' + core + 'AAAAAAAAAA');
  await selectOpt('#opt-mode', 'local');
  await click('#btn-align');
  al = await page.evaluate(() => {
    const r = window.__sl.state.alignment;
    return { score: r.score, a: r.alignedA, b: r.alignedB, aStart: r.aStart, aEnd: r.aEnd, bStart: r.bStart, bEnd: r.bEnd, id: r.identities };
  });
  assert(al.score === core.length * 2, `SW recovers exactly the 40-nt core: score ${al.score} == 80`);
  assert(al.a === core && al.b === core, 'SW aligned rows are the shared core itself');
  assert(al.aStart === 11 && al.aEnd === 50 && al.bStart === 11 && al.bEnd === 50,
    `SW coordinates point at the core in both sequences (A ${al.aStart}-${al.aEnd}, B ${al.bStart}-${al.bEnd})`);
  assert(rescore(al.a, al.b) === al.score, 'SW score survives independent re-scoring');
  await selectOpt('#opt-mode', 'global');

  // 4d. BLOSUM62:蛋白自比对得分 == 对角线之和
  await setVal('#seq-a', demo.protein);
  await setVal('#seq-b', demo.protein);
  await selectOpt('#opt-matrix', 'blosum62');
  await click('#btn-align');
  const blo = await page.evaluate((p) => {
    const B = window.__sl.api.BLOSUM;
    const diag = [...p].reduce((s, c) => s + B[c][c], 0);
    return { diag, score: window.__sl.state.alignment.score, sym: B['W']['Y'] === B['Y']['W'] && B['W']['W'] === 11 && B['C']['C'] === 9 };
  }, demo.protein);
  assert(blo.sym, 'BLOSUM62 is symmetric with the canonical W:W=11 / C:C=9 diagonal');
  assert(blo.score === blo.diag, `protein self-alignment score ${blo.score} == BLOSUM62 diagonal sum ${blo.diag}`);
  assert((await disp('#lb-match')) === 'none', '[hidden] guard: match/mismatch inputs vanish under BLOSUM62');
  await selectOpt('#opt-matrix', 'simple');
  assert((await disp('#lb-match')) !== 'none', 'match input returns under simple scoring');

  /* ══ 5. 酶切与电泳 ═══════════════════════════════════════════ */
  await click('#btn-demo');            // 恢复示例序列
  await click('#tab-btn-digest');
  const siteRows = await rows('#site-rows tr');
  const byName = Object.fromEntries(siteRows.map((r) => [r[0], r]));
  assert(siteRows.length === 3, `three default enzymes listed (got ${siteRows.length})`);
  assert(byName['EcoRI'][2] === '2' && byName['BamHI'][2] === '2' && byName['HindIII'][2] === '1',
    `cut counts EcoRI 2 / BamHI 2 / HindIII 1 (got ${siteRows.map((r) => r[0] + ':' + r[2]).join(', ')})`);
  assert(byName['EcoRI'][3].startsWith('1, 461'), `EcoRI cuts after G at 1 and 461 (got ${byName['EcoRI'][3]})`);
  assert(byName['EcoRI'][4] === "5′ 突出" && byName['HindIII'][4] === "5′ 突出", 'EcoRI/HindIII produce 5′ overhangs');
  // 独立重算片段:cuts [1,394,413,443,461] on a 485 bp linear molecule
  let frags = (await rows('#frag-rows tr')).map((r) => Number(r[1].replace(/,/g, '')));
  const expLinear = [393, 30, 24, 19, 18, 1];
  assert(JSON.stringify(frags) === JSON.stringify(expLinear), `linear digest fragments ${frags} == ${expLinear}`);
  assert(frags.reduce((a, b) => a + b, 0) === 485, 'linear fragments sum back to the full 485 bp');
  // 环状:5 个切点 → 5 个片段,总长守恒
  await selectOpt('#opt-topo', 'circular');
  frags = (await rows('#frag-rows tr')).map((r) => Number(r[1].replace(/,/g, '')));
  assert(frags.length === 5, `circular digest with 5 cuts yields 5 fragments (got ${frags.length})`);
  assert(frags.reduce((a, b) => a + b, 0) === 485, `circular fragments also sum to 485 (got ${frags.reduce((a, b) => a + b, 0)})`);
  await selectOpt('#opt-topo', 'linear');
  // 凝胶:Marker + 同时消化 + 每种酶各一道 = 5 道,条带数 = 片段数
  const gel = await page.evaluate(() => ({
    lanes: [...document.querySelectorAll('#gel text.lane')].map((t) => t.textContent),
    bands: document.querySelectorAll('#gel rect[opacity]').length
  }));
  assert(gel.lanes.length === 5, `gel draws 5 lanes: marker + multi-digest + 3 single digests (got ${gel.lanes.length})`);
  assert(gel.lanes[0] === '1 kb Marker' && gel.lanes[1] === '同时消化' && gel.lanes.includes('EcoRI'),
    `gel lanes include marker, multi-digest and single cutters (got ${gel.lanes.join('/')})`);
  assert(gel.bands >= 12 + 6, `gel draws ladder + sample bands (got ${gel.bands})`);
  // IUPAC 简并识别位点(HinfI GANTC)
  const iupac = await page.evaluate(() => window.__sl.api.findSites('AAGAATCTTGACTCAA', 'GANTC', false));
  assert(JSON.stringify(iupac) === '[2,9]', `GANTC matches both GAATC and GACTC (got ${JSON.stringify(iupac)})`);
  // 「只选单切酶」真的只留单切酶
  await click('#btn-enz-single');
  const chips = await page.evaluate(() => [...document.querySelectorAll('.sl-chip')]
    .filter((c) => c.querySelector('input').checked)
    .map((c) => c.querySelector('.n').textContent));
  assert(chips.length > 0 && chips.every((c) => c === '1×'), `every auto-selected enzyme cuts exactly once (got ${chips.join(',')})`);

  /* ══ 6. 蛋白模式:功能降级 + pI/MW ════════════════════════════ */
  await setVal('#seq-a', demo.protein);
  assert((await txt('#type-a')) === '蛋白', 'protein input is detected as protein');
  assert((await disp('#dig-body')) === 'none' && (await disp('#dig-gel')) === 'none',
    '[hidden] guard: digest panels collapse to display:none for protein input');
  assert((await disp('#dig-na')) !== 'none', 'protein notice is visible on the digest tab');
  await click('#tab-btn-orf');
  assert((await disp('#orf-body')) === 'none' && (await disp('#orf-na')) !== 'none',
    '[hidden] guard: ORF finder collapses and its notice shows for protein input');
  await click('#tab-btn-overview');
  const pI = await tile('pi');
  assert(pI && Number(pI.value) > 3 && Number(pI.value) < 11, `pI tile within 3–11 (got ${pI && pI.value})`);
  const chem = await page.evaluate(() => {
    const s = window.__sl.api.proteinStats;
    return { acid: s('DDDD').pI, base: s('KKKK').pI, mwG: s('G').mw, charge: s('KKKK').charge7 };
  });
  assert(chem.acid < 4.5, `poly-D is acidic (pI ${chem.acid.toFixed(2)} < 4.5)`);
  assert(chem.base > 9.5, `poly-K is basic (pI ${chem.base.toFixed(2)} > 9.5)`);
  assert(Math.abs(chem.mwG - 75.07) < 0.05, `glycine MW == 75.07 Da (got ${chem.mwG.toFixed(2)})`);
  assert(chem.charge > 3, `poly-K carries a net positive charge at pH 7 (got ${chem.charge.toFixed(2)})`);

  /* ══ 7. 序列库 localStorage 往返 ═════════════════════════════ */
  await click('#btn-save');
  assert((await txt('#lib-count')) === '1 条', `library holds 1 entry after saving (got ${await txt('#lib-count')})`);
  assert((await disp('#lib-empty')) === 'none', '[hidden] guard: library empty-state hidden once populated');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.body.dataset.ok === '1');
  assert((await txt('#lib-count')) === '1 条', 'library survives a reload (localStorage)');
  await act(() => page.click('#lib-list .sl-libitem .sl-mini'));   // 载入到 A
  assert((await page.inputValue('#seq-a')) === demo.protein, 'loading a library entry writes it back into sequence A');

  /* ══ 8. 布局守卫 ═════════════════════════════════════════════ */
  await click('#btn-demo');
  await click('#tab-btn-orf');
  assert(await inside('#orf-map', '.sl-figure', 2), 'ORF map stays inside its figure container');
  assert(await inside('.sl-tab[data-tab="digest"]', '.sl-tabs', 2), 'last tab button stays inside the tab strip');
  const ctlSizes = await page.evaluate(() => ['#opt-minaa', '#opt-table', '#opt-strand', '#btn-demo'].map((s) => {
    const r = document.querySelector(s).getBoundingClientRect();
    return { s, w: r.width, h: r.height };
  }));
  for (const c of ctlSizes) assert(c.w >= 60 && c.h >= 26, `control ${c.s} renders at usable size (${c.w.toFixed(0)}×${c.h.toFixed(0)})`);
  const mapBox = await rect('#orf-map');
  assert(mapBox.w > 300 && mapBox.h > 120, `ORF map has real dimensions (${mapBox.w.toFixed(0)}×${mapBox.h.toFixed(0)})`);
  const orfBars = await page.evaluate(() => document.querySelectorAll('#orf-map .orf-bar').length);
  assert(orfBars === 1, `ORF map draws one bar for the single default ORF (got ${orfBars})`);

  // 窄屏:不出现横向溢出
  await page.setViewportSize({ width: 390, height: 800 });
  await page.waitForFunction(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  const narrow = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  assert(narrow.sw <= narrow.iw + 1, `no horizontal overflow at 390px (scrollWidth ${narrow.sw} vs ${narrow.iw})`);
  assert(await inside('.sl-nav', 'body', 2), 'nav bar stays within the body at 390px');
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.waitForFunction(() => document.documentElement.clientWidth > 1000);

  /* ══ 9. 缩略图 ═══════════════════════════════════════════════ */
  await page.evaluate(() => window.scrollTo(0, 0));
  // 等 ORF 图按宽屏容器重绘完毕(resize 是防抖的)—— 不用定时器,等尺寸收敛
  await page.waitForFunction(() => {
    const svg = document.querySelector('#orf-map');
    if (!svg) return false;
    return Math.abs(svg.getBoundingClientRect().width - (svg.parentElement.clientWidth - 32)) < 4;
  });
  // 标签指示条有 .15s 过渡:截图前等它 settle,否则会截到上一个标签的下划线(教训 2026-07-22)
  await page.waitForFunction(() => {
    const on = document.querySelector('.sl-tab[aria-selected="true"]');
    const off = [...document.querySelectorAll('.sl-tab[aria-selected="false"]')];
    return on && getComputedStyle(on).borderBottomColor === 'rgb(62, 207, 142)'
      && off.every((b) => getComputedStyle(b).borderBottomColor === 'rgba(0, 0, 0, 0)');
  });
  await screenshot('thumb.png');
}
