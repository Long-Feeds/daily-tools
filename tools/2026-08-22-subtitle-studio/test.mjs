// Integration test for 字幕工作台 · Subtitle Studio.
// Drives the real parsers, the timing maths, the QC engine and the audio
// auto-sync through a real browser and asserts concrete outputs — including a
// WAV synthesised in-page and fed through the actual file input, where the
// injected offset must come back out of the cross-correlation.
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REVIEW = process.env.SS_REVIEW ? process.env.SS_REVIEW : null;

export default async function ({ page, toolURL, screenshot, assert }) {
  let checks = 0;
  const is = (cond, msg) => { checks++; assert(cond, msg); };
  const eq = (a, b, msg) => { checks++; assert(a === b, `${msg} (got ${JSON.stringify(a)}, want ${JSON.stringify(b)})`); };
  const near = (a, b, tol, msg) => { checks++; assert(Math.abs(a - b) <= tol, `${msg} (got ${a}, want ${b}±${tol})`); };

  const shot = async (name) => {
    if (!REVIEW) return;
    mkdirSync(REVIEW, { recursive: true });
    await page.screenshot({ path: join(REVIEW, name) });
  };

  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#ss-timeline');
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#ss-sample');

  const onTab = async (name, fn) => { await page.click(`.ss-tab[data-tab="${name}"]`); await fn(); };
  const doc = () => page.evaluate(() => ({
    n: window.ssApp.doc ? window.ssApp.doc.cues.length : 0,
    cues: window.ssApp.doc ? window.ssApp.doc.cues.map((c) => [c.start, c.end, c.text]) : [],
    issues: window.ssApp.issues.map((i) => i.type),
  }));

  /* ---------- 0. shell ---------- */
  eq(await page.title(), '字幕工作台 · Subtitle Studio', 'page title');
  eq(await page.getAttribute('.ss-back', 'href'), '../../', 'back link points at the hub');

  /* ---------- 1. sample loads and parses ---------- */
  await page.click('#ss-sample');
  await page.waitForFunction(() => window.ssApp.doc && window.ssApp.doc.cues.length > 0);
  let d = await doc();
  eq(d.n, 14, 'sample parses into 14 cues');
  eq(d.cues[0][0], 2000, 'first cue starts at 2.000s');
  eq(d.cues[1][1], 6320, 'second cue ends at 6.320s');
  eq(d.cues[1][2], '你有没有想过，\n为什么下载来的字幕总是差半秒？', 'multi-line cue text survives parsing');
  eq(await page.textContent('#ss-st-count'), '14', 'stat strip shows the cue count');

  /* ---------- 2. QC finds the planted defects ---------- */
  await onTab('qc', async () => {
    const types = new Set(d.issues);
    for (const t of ['overlap', 'reversed', 'empty', 'dupe', 'cps', 'hi', 'lineLen'])
      is(types.has(t), `QC flags "${t}" in the sample`);
    const summary = await page.textContent('#ss-issue-summary');
    is(/^共 \d+ 项/.test(summary.trim()), `issue summary is populated (got "${summary.trim().slice(0, 40)}")`);
    is((await page.locator('.ss-issue').count()) > 5, 'issue list renders rows');
  });

  // the reversed cue (#12 in the sample) really is inverted
  eq(d.cues[11][0] > d.cues[11][1], true, 'sample really contains an end-before-start cue');

  /* ---------- 3. clicking an issue selects that cue ---------- */
  await onTab('qc', async () => {
    const first = page.locator('.ss-issue').first();
    const idx = Number(await first.getAttribute('data-i'));
    await first.click();
    const sel = await page.evaluate(() => Array.from(window.ssApp.selected));
    eq(sel.length, 1, 'clicking an issue selects exactly one cue');
    eq(sel[0], idx, 'the selected cue is the one the issue points at');
  });

  /* ---------- 4. exporting round-trips through every format ---------- */
  await onTab('export', async () => {
    for (const fmt of ['srt', 'vtt', 'ass', 'sbv']) {
      await page.selectOption('#ss-export-fmt', fmt);
      const r = await page.evaluate((f) => {
        const txt = window.SS.printAny(window.ssApp.doc, f, { fps: 25 });
        const back = window.SS.parseAny(txt, { format: f });
        const src = window.ssApp.doc.cues;
        let same = 0;
        for (let i = 0; i < Math.min(src.length, back.cues.length); i++) {
          const rounding = f === 'ass' ? 10 : 1;
          if (Math.abs(src[i].start - back.cues[i].start) < rounding &&
              Math.abs(src[i].end - back.cues[i].end) < rounding) same++;
        }
        return { n: back.cues.length, src: src.length, same, head: txt.slice(0, 24) };
      }, fmt);
      eq(r.n, r.src, `${fmt}: export keeps every cue`);
      eq(r.same, r.src, `${fmt}: every exported timestamp parses back to the same time`);
    }
    await page.selectOption('#ss-export-fmt', 'vtt');
    is((await page.textContent('#ss-export-preview')).startsWith('WEBVTT'), 'WebVTT export starts with the WEBVTT header');
    await page.selectOption('#ss-export-fmt', 'ass');
    is((await page.textContent('#ss-export-preview')).indexOf('[Events]') > 0, 'ASS export has an [Events] section');
    is((await page.textContent('#ss-export-size')).indexOf('14 条') > 0, 'export size badge reports the cue count');
    await page.selectOption('#ss-export-fmt', 'srt');
  });

  /* ---------- 5. pasting a WebVTT with entities ---------- */
  await onTab('import', async () => {
    await page.fill('#ss-paste', 'WEBVTT\n\n00:01.000 --> 00:02.500\nthe S&amp;P 500 &lt;index&gt;\n\n00:03.000 --> 00:04.000\n<v Bob>second</v>\n');
    await page.click('#ss-load-paste');
    await page.waitForFunction(() => window.ssApp.doc.cues.length === 2);
    const dd = await doc();
    eq(dd.cues[0][2], 'the S&P 500 <index>', 'WebVTT HTML entities are decoded');
    eq(dd.cues[0][0], 1000, 'WebVTT MM:SS.mmm timestamp read correctly');
    eq(dd.cues[1][2], 'second', 'WebVTT voice tag stripped from the text');
    const badge = await page.textContent('#ss-fmt-badge');
    is(badge.indexOf('WebVTT') >= 0, `format badge shows WebVTT (got "${badge}")`);
    const warn = await page.textContent('#ss-warnings');
    is(warn.indexOf('VTT') >= 0 && warn.indexOf('2 条') >= 0, 'parse report names the format and the cue count');
  });

  /* ---------- 6. timing maths ---------- */
  await page.click('#ss-sample');
  await page.waitForFunction(() => window.ssApp.doc.cues.length === 14);

  await onTab('sync', async () => {
    await page.fill('#ss-shift-ms', '-1500');
    await page.click('#ss-shift-apply');
    let dd = await doc();
    eq(dd.cues[0][0], 500, 'shift of -1500ms moves the first cue from 2000 to 500');
    eq(dd.cues[1][0], 2500, 'shift applies to every cue');

    await page.fill('#ss-shift-ms', '1500');
    await page.click('#ss-shift-apply');
    dd = await doc();
    eq(dd.cues[0][0], 2000, 'shifting back restores the original time');

    // two-point stretch: 2.000s stays put, 40.000s should land on 41.000s
    await page.fill('#ss-a1', '00:00:02,000');
    await page.fill('#ss-b1', '00:00:02,000');
    await page.fill('#ss-a2', '00:00:40,000');
    await page.fill('#ss-b2', '00:00:41,000');
    await page.click('#ss-linear-apply');
    dd = await doc();
    eq(dd.cues[0][0], 2000, 'linear sync pins the first anchor exactly');
    eq(dd.cues[13][0], 41000, 'linear sync lands the second anchor exactly');
    const mid = dd.cues[6][0];
    near(mid, 2000 + (16200 - 2000) * (39000 / 38000), 1, 'linear sync interpolates the middle correctly');

    await page.click('#ss-undo');
    dd = await doc();
    eq(dd.cues[13][0], 40000, 'undo restores the pre-stretch timings');

    await page.selectOption('#ss-fps-from', '25');
    await page.selectOption('#ss-fps-to', '23.976023976023978');
    await page.click('#ss-fps-apply');
    dd = await doc();
    eq(dd.cues[0][0], Math.round(2000 * 25 / (24000 / 1001)), '25 -> 23.976 conversion is exact');
    await page.click('#ss-undo');
  });

  /* ---------- 7. one-click fixes actually fix ---------- */
  await onTab('qc', async () => {
    const before = (await doc()).issues.length;
    await page.click('#ss-fix-all');
    await page.click('#ss-fix-apply');
    await page.waitForFunction(() => !document.getElementById('ss-fix-result').hidden);
    const dd = await doc();
    const kinds = new Set(dd.issues);
    for (const t of ['overlap', 'reversed', 'empty', 'dupe', 'hi', 'spacing', 'gap'])
      is(!kinds.has(t), `after fixing, no "${t}" issues remain`);
    is(dd.issues.length < before, `total issues dropped (${before} -> ${dd.issues.length})`);
    is(dd.n < 14, `empty and duplicate cues were removed (14 -> ${dd.n})`);
    // every remaining cue is well-formed
    for (const c of dd.cues) is(c[1] > c[0], 'every surviving cue ends after it starts');
    for (let i = 0; i + 1 < dd.cues.length; i++)
      is(dd.cues[i][1] <= dd.cues[i + 1][0], `cue ${i + 1} no longer overlaps the next one`);
    const res = await page.textContent('#ss-fix-result');
    is(/×\d/.test(res), `fix report lists what changed (got "${res.split('\n')[0]}")`);
  });

  /* ---------- 8. bilingual merge ---------- */
  await page.click('#ss-sample');
  await page.waitForFunction(() => window.ssApp.doc.cues.length === 14);
  await onTab('merge', async () => {
    await page.fill('#ss-second',
      '1\n00:00:04,200 --> 00:00:06,000\nHave you ever wondered\n\n' +
      '2\n00:00:16,300 --> 00:00:18,900\nTwo anchors are enough.\n\n' +
      '3\n00:01:40,000 --> 00:01:42,000\nway out of range\n');
    await page.click('#ss-merge-apply');
    await page.waitForFunction(() => /匹配上/.test(document.getElementById('ss-merge-info').textContent));
    const dd = await doc();
    eq(dd.cues[1][2], '你有没有想过，\n为什么下载来的字幕总是差半秒？\nHave you ever wondered',
      'overlapping second-language line is appended below');
    eq(dd.cues[6][2].indexOf('Two anchors are enough.') > 0, true, 'second match also merged');
    eq(dd.cues[0][2], '[轻快的片头音乐]', 'non-overlapping cues are left untouched');
    const info = await page.textContent('#ss-merge-info');
    is(info.indexOf('匹配上：2 / 14') >= 0, `merge report counts the matches (got "${info.split('\n')[1]}")`);
  });

  /* ---------- 9. auto-sync against a synthesised WAV ---------- */
  // 12 speech bursts at known times; the subtitles are handed to the tool
  // 2.500s late, so the analyser must report an offset of -2500 ms.
  const SHIFT = 2500;
  const bursts = await page.evaluate((shift) => {
    let seed = 12345;
    const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    const windows = [];
    let t = 1500;
    for (let i = 0; i < 12; i++) {
      const dur = 900 + Math.floor(rnd() * 1500);
      windows.push([t, t + dur]);
      t += dur + 600 + Math.floor(rnd() * 1400);
    }
    const sr = 8000, total = t + 2000;
    const n = Math.round(sr * total / 1000);
    const pcm = new Int16Array(n);
    for (let i = 0; i < n; i++) pcm[i] = Math.round((rnd() - 0.5) * 600);
    for (const [a, b] of windows) {
      const s = Math.round(a / 1000 * sr), e = Math.round(b / 1000 * sr);
      for (let i = s; i < e; i++) {
        const tt = (i - s) / sr;
        const env = 0.6 + 0.4 * Math.sin(2 * Math.PI * 4 * tt);
        pcm[i] = Math.max(-32000, Math.min(32000,
          Math.round(Math.sin(2 * Math.PI * 220 * tt) * env * 9000 + (rnd() - 0.5) * 1500)));
      }
    }
    const buf = new ArrayBuffer(44 + pcm.length * 2);
    const dv = new DataView(buf);
    const wr = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
    wr(0, 'RIFF'); dv.setUint32(4, 36 + pcm.length * 2, true); wr(8, 'WAVE');
    wr(12, 'fmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
    dv.setUint32(24, sr, true); dv.setUint32(28, sr * 2, true); dv.setUint16(32, 2, true); dv.setUint16(34, 16, true);
    wr(36, 'data'); dv.setUint32(40, pcm.length * 2, true);
    new Int16Array(buf, 44).set(pcm);

    const file = new File([buf], 'sync-test.wav', { type: 'audio/wav' });
    const dt = new DataTransfer();
    dt.items.add(file);
    const input = document.getElementById('ss-media');
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));

    // subtitles handed over `shift` ms late
    const srt = windows.map(([a, b], i) =>
      `${i + 1}\n${window.SS.TC.fmtSrt(a + shift)} --> ${window.SS.TC.fmtSrt(b + shift)}\n第 ${i + 1} 句台词\n`).join('\n');
    return { windows, srt, totalMs: total };
  }, SHIFT);

  await page.waitForFunction(() => !document.getElementById('ss-autosync-run').disabled, { timeout: 20000 });
  const vad = await page.evaluate(() => ({
    voicedMs: window.ssApp.speech.voicedFrames * 10,
    frames: window.ssApp.speech.frames,
    durationMs: window.ssApp.media.durationMs,
  }));
  const truthMs = bursts.windows.reduce((a, [s, e]) => a + (e - s), 0);
  near(vad.durationMs, bursts.totalMs, 60, 'WAV duration read back from the RIFF header');
  is(Math.abs(vad.voicedMs - truthMs) / truthMs < 0.25,
    `speech detector finds ${vad.voicedMs}ms of voice against ${truthMs}ms of real bursts`);

  await onTab('import', async () => {
    await page.fill('#ss-paste', bursts.srt);
    await page.click('#ss-load-paste');
    await page.waitForFunction(() => window.ssApp.doc.cues.length === 12);
  });

  await onTab('sync', async () => {
    await page.click('#ss-autosync-run');
    await page.waitForFunction(() => window.ssApp.autosync != null, { timeout: 30000 });
    const r = await page.evaluate(() => window.ssApp.autosync);
    near(r.offsetMs, -SHIFT, 40, 'auto-sync recovers the injected 2.500s offset from the audio alone');
    is(r.coverage > 0.7, `subtitles land on speech after the shift (coverage ${(r.coverage * 100).toFixed(1)}%)`);
    is(r.confidence > 0.05, `auto-sync reports a usable confidence (${r.confidence.toFixed(2)})`);
    const out = await page.textContent('#ss-autosync-result');
    is(out.indexOf('建议偏移') >= 0, 'the result panel spells out the suggested offset');

    const beforeStart = (await doc()).cues[0][0];
    await page.click('#ss-autosync-apply');
    const after = (await doc()).cues[0][0];
    near(after, beforeStart - SHIFT, 40, 'applying the suggestion moves the subtitles onto the speech');
    near(after, bursts.windows[0][0], 40, 'first cue now sits on the first real burst');
  });

  /* ---------- 9b. thumbnail: the moment the tool earns its keep ---------- */
  // Captured here on purpose — waveform, detected speech and the freshly
  // aligned cue blocks are all on screen at once.
  await page.evaluate(() => { document.querySelectorAll('.ss-toast').forEach((t) => t.remove()); });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(240);
  await screenshot('thumb.png');

  /* ---------- 10. waveform is actually drawn ---------- */
  const px = await page.evaluate(() => {
    const cv = document.getElementById('ss-timeline');
    const ctx = cv.getContext('2d');
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
    let nonBg = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i] > 20 || d[i + 1] > 20 || d[i + 2] > 20) nonBg++;
    }
    return { nonBg, total: d.length / 4 };
  });
  is(px.nonBg > 4000, `timeline canvas has real content drawn (${px.nonBg} non-background pixels)`);
  await shot('review-timeline.png');

  /* ---------- 11. canvas labels: drawn, not silently dropped ---------- */
  const placer = await page.evaluate(() => {
    const p = window.ssPlacer;
    return {
      dropped: p.dropped,
      ticks: p.drawn.filter((x) => x.kind === 'tick').length,
      cues: p.drawn.filter((x) => x.kind === 'cue').length,
      texts: p.drawn.map((x) => ({ str: x.str, x: x.x, y: x.y })),
    };
  });
  is(placer.ticks >= 4, `ruler ticks are actually drawn (${placer.ticks})`);
  is(placer.cues >= 8, `cue index labels are actually drawn (${placer.cues} of 12)`);
  is(placer.dropped <= 2, `almost nothing had to be dropped for collisions (${placer.dropped})`);

  /* ---------- 12. table editing writes through ---------- */
  const firstStart = page.locator('.ss-row').first().locator('.ss-tc-start');
  await firstStart.fill('00:00:09,250');
  await firstStart.press('Enter');
  await page.waitForFunction(() => window.ssApp.doc.cues.some((c) => c.start === 9250));
  is(true, 'editing a start time in the table writes back into the document');
  await firstStart.evaluate((el) => el.blur());

  const badTime = page.locator('.ss-row').first().locator('.ss-tc-end');
  const goodBefore = await page.evaluate(() => window.ssApp.doc.cues[0].end);
  await badTime.fill('nonsense');
  await badTime.press('Enter');
  const goodAfter = await page.evaluate(() => window.ssApp.doc.cues[0].end);
  eq(goodAfter, goodBefore, 'an unparseable time code is rejected and the old value restored');
  eq(await badTime.inputValue(), await page.evaluate(() => window.SS.TC.fmtSrt(window.ssApp.doc.cues[0].end)),
    'the rejected input snaps back to the stored value');

  /* ---------- 13. persistence across a reload ---------- */
  const beforeReload = await page.evaluate(() => window.ssApp.doc.cues.map((c) => c.start + ':' + c.end).join('|'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.ssApp.doc && window.ssApp.doc.cues.length > 0, { timeout: 10000 });
  const afterReload = await page.evaluate(() => window.ssApp.doc.cues.map((c) => c.start + ':' + c.end).join('|'));
  eq(afterReload, beforeReload, 'the edit survives a page reload via localStorage');

  /* ---------- 14. structural guards ---------- */
  // [hidden] really hides — author CSS must not out-specify the UA rule
  await page.click('.ss-tab[data-tab="sync"]');
  const hiddenDisplay = await page.evaluate(() =>
    ['import', 'qc', 'merge', 'export'].map((id) => getComputedStyle(document.getElementById('ss-panel-' + id)).display));
  for (const dsp of hiddenDisplay) eq(dsp, 'none', 'a hidden panel computes to display:none');
  eq(await page.evaluate(() => getComputedStyle(document.getElementById('ss-panel-sync')).display), 'block',
    'the active panel is visible');

  // control sizing, swept across every tab (hidden controls are invisible to a
  // single-panel sweep, so switch first)
  let scanned = 0;
  for (const tab of ['import', 'sync', 'qc', 'merge', 'export']) {
    await page.click(`.ss-tab[data-tab="${tab}"]`);
    const bad = await page.evaluate(() => {
      const out = [];
      let n = 0;
      for (const el of document.querySelectorAll('input, select, button, textarea')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;      // deliberately hidden file inputs
        const st = getComputedStyle(el);
        if (st.display === 'none' || st.visibility === 'hidden' || st.opacity === '0') continue;
        n++;
        const isCheck = el.type === 'checkbox' || el.type === 'radio';
        const minW = isCheck ? 18 : el.tagName === 'BUTTON' ? 52 : 100;
        if (r.width < minW - 0.5 || r.height < 18 - 0.5) {
          out.push(`${el.tagName}#${el.id || el.className} ${r.width.toFixed(0)}x${r.height.toFixed(0)} (min ${minW})`);
        }
      }
      return { out, n };
    });
    scanned += bad.n;
    eq(bad.out.length, 0, `[${tab}] every visible control is big enough: ${bad.out.join(', ')}`);
  }
  is(scanned >= 45, `the control sweep actually visited controls on every tab (${scanned})`);

  // no uppercased unit strings in table headers / labels
  const shouty = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('th, dt, label, .ss-label')) {
      if (/\b(HZ|KHZ|DBFS|DB|MS|FPS|CPS|SRT|VTT|ASS|LRC|SBV)\b/.test(el.textContent) &&
          getComputedStyle(el).textTransform === 'uppercase') out.push(el.textContent.trim());
    }
    return out;
  });
  eq(shouty.length, 0, `no label uppercases a unit symbol: ${shouty.join(', ')}`);

  // children stay inside their cells; mono blocks do not overflow their card
  const overflow = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('.ss-mono-out')) {
      if (el.offsetParent === null) continue;
      if (el.scrollWidth - el.clientWidth > 2) out.push('mono block scrolls: ' + el.id);
    }
    for (const td of document.querySelectorAll('.ss-table td')) {
      const pr = td.getBoundingClientRect();
      for (const kid of td.children) {
        const kr = kid.getBoundingClientRect();
        if (kr.width === 0) continue;
        if (kr.right > pr.right + 1 || kr.left < pr.left - 1 || kr.bottom > pr.bottom + 1)
          out.push('cell child escapes: ' + kid.className);
      }
    }
    return out;
  });
  eq(overflow.length, 0, `nothing overflows its container: ${overflow.slice(0, 3).join(' | ')}`);

  eq(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true,
    'the page does not scroll sideways at 1280px');

  /* ---------- 15. narrow viewport ---------- */
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(160);
  eq(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true,
    'the page does not scroll sideways at 390px either');
  const narrowBad = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('#ss-panel-sync input, #ss-panel-sync select, #ss-panel-sync button')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.height < 18) out.push(el.id || el.className);
    }
    return out;
  });
  eq(narrowBad.length, 0, `controls keep their height on a phone: ${narrowBad.join(', ')}`);
  await shot('review-narrow.png');
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.waitForTimeout(160);

  if (REVIEW) {
    for (const tab of ['import', 'sync', 'qc', 'merge', 'export']) {
      await page.click(`.ss-tab[data-tab="${tab}"]`);
      await page.waitForTimeout(120);
      await shot(`review-tab-${tab}.png`);
    }
  }

  console.log(`      (${checks} assertions)`);
}
