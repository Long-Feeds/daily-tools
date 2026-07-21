// Integration test for 密码实验室 · Password Lab (Vault design language).
// Drives the real zxcvbn-style minimum-guesses engine + generators through the browser:
// asserts concrete strength verdicts / bits / breakdown, meter-fills-to-score (computed
// colour), the [hidden] computed-display guard, generator structure, localStorage presets,
// and layout containment. Captures thumb.png on a Vault-yellow (score-2) analysis.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#pl-pass');
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#pl-pass');

  const outData = () => page.evaluate(() => ({ ...document.getElementById('pl-out').dataset }));
  const RGB_SURFACE3 = 'rgb(59, 61, 69)';   // --surface-3 (empty meter segment)
  const RGB_S2 = 'rgb(255, 207, 37)';        // --s2 Vault yellow (score 2)
  const SCORE_RGB = ['rgb(230, 43, 30)', 'rgb(242, 76, 83)', 'rgb(255, 207, 37)', 'rgb(20, 198, 203)', 'rgb(0, 202, 142)'];
  const segBg = (idx) => page.evaluate((i) => getComputedStyle(document.querySelectorAll('#pl-bar .pl-seg')[i]).backgroundColor, idx);
  // Wait for the meter to *settle* on a given score (segments carry a .2s transition — 07-18 lesson):
  // segment[score] shows the score colour, segment[score+1] (if any) stays empty.
  async function waitMeter(score) {
    await page.waitForFunction((args) => {
      const [s, wantOn, empty] = args;
      const segs = document.querySelectorAll('#pl-bar .pl-seg');
      const on = getComputedStyle(segs[s]).backgroundColor === wantOn;
      const off = s + 1 >= segs.length || getComputedStyle(segs[s + 1]).backgroundColor === empty;
      return on && off;
    }, [score, SCORE_RGB[score], RGB_SURFACE3]);
  }

  async function typePass(v) {
    await page.fill('#pl-pass', v);
    await page.waitForFunction((val) => {
      const d = document.getElementById('pl-out').dataset;
      return d.len === String(val.length) && d.empty === '0';
    }, v);
  }

  // ---------------- 1) weak: 'password' → dictionary, score 0 ----------------
  await typePass('password');
  let d = await outData();
  assert(d.score === '0', `'password' → score 0 (got ${d.score})`);
  assert(parseFloat(d.bits) < 15, `'password' → very low bits (got ${d.bits})`);
  assert((await page.textContent('#pl-verdict')).trim() === '危险', `verdict reads 危险`);
  // meter: first segment coloured (s0 red), later segments empty — wait for transition to settle
  await waitMeter(0);
  assert(await segBg(0) === SCORE_RGB[0], `score-0 fills segment 0 red (got ${await segBg(0)})`);
  assert(await segBg(2) === RGB_SURFACE3, `score-0 leaves segment 2 empty (got ${await segBg(2)})`);
  // crack-time cells populated (not a dash)
  assert((await page.textContent('#pl-t-gpu')).trim() !== '—', 'GPU crack-time renders a value');
  assert(/瞬间|秒/.test(await page.textContent('#pl-t-gpu')), `'password' cracked ~instantly offline (got ${await page.textContent('#pl-t-gpu')})`);
  // breakdown shows a dictionary token
  assert(await page.locator('#pl-seq .pl-token[data-kind="dict"]').count() >= 1, 'breakdown shows a dictionary block');

  // ---------------- 2) repeat + sequence + l33t detection ----------------
  await typePass('aaaaaaaa');
  assert((await outData()).score === '0', 'repeated chars → score 0');
  assert(await page.locator('#pl-seq .pl-token[data-kind="repeat"]').count() >= 1, 'repeat block detected');

  await typePass('abcdefgh');
  assert(await page.locator('#pl-seq .pl-token[data-kind="seq"]').count() >= 1, 'sequence block detected');

  await typePass('P@ssw0rd');
  const l33t = await page.evaluate(() =>
    [...document.querySelectorAll('#pl-seq .pl-token[data-kind="dict"] .why')].some(e => /l33t/.test(e.textContent)));
  assert(l33t, 'l33t-substituted dictionary word detected (P@ssw0rd → password)');

  // ---------------- 3) mid: 'brave-otter-lantern-42' → score 2, three dict words, yellow meter ----------------
  await typePass('brave-otter-lantern-42');
  await page.waitForFunction(() => document.getElementById('pl-out').dataset.score === '2');
  d = await outData();
  assert(d.score === '2', `passphrase-style → score 2 中等 (got ${d.score})`);
  assert(Math.abs(parseFloat(d.bits) - 54) < 3, `bits ≈ 54 (got ${d.bits})`);
  assert((await page.textContent('#pl-verdict')).trim() === '中等', 'verdict reads 中等');
  const dictTokens = await page.evaluate(() =>
    [...document.querySelectorAll('#pl-seq .pl-token[data-kind="dict"] .t')].map(e => e.textContent.toLowerCase()));
  assert(['brave', 'otter', 'lantern'].every(w => dictTokens.includes(w)), `three dict words shown (got ${JSON.stringify(dictTokens)})`);
  // meter fills exactly 3 segments (score 2) in Vault yellow, 4th empty — wait for settle
  await waitMeter(2);
  assert(await segBg(2) === RGB_S2, `score-2 fills segment 2 with Vault yellow (got ${await segBg(2)})`);
  assert(await segBg(3) === RGB_SURFACE3, `score-2 leaves segment 3 empty (got ${await segBg(3)})`);

  // ---------------- 4) show / hide + samples + empty ----------------
  assert(await page.getAttribute('#pl-pass', 'type') === 'password', 'field starts masked');
  await page.click('#pl-toggle-vis');
  assert(await page.getAttribute('#pl-pass', 'type') === 'text', 'toggle reveals the password');
  assert((await page.textContent('#pl-toggle-vis')).trim() === '隐藏', 'toggle label flips to 隐藏');
  await page.click('#pl-toggle-vis');
  assert(await page.getAttribute('#pl-pass', 'type') === 'password', 'toggle re-masks');

  await page.click('.pl-chip[data-sample="qwerty123456"]');
  await page.waitForFunction(() => document.getElementById('pl-pass').value === 'qwerty123456');
  assert((await outData()).score === '0', 'sample keyboard-walk → score 0');
  assert(await page.locator('#pl-seq .pl-token[data-kind="spatial"], #pl-seq .pl-token[data-kind="dict"]').count() >= 1, 'keyboard walk detected');

  await page.fill('#pl-pass', '');
  await page.waitForFunction(() => document.getElementById('pl-out').dataset.empty === '1');
  assert((await page.textContent('#pl-verdict')).trim() === '—', 'empty input blanks the verdict');
  assert((await page.textContent('#pl-t-gpu')).trim() === '—', 'empty input blanks crack times');

  // ---------------- 5) shipped engine, asserted in-browser via window.__pw ----------------
  const eng = await page.evaluate(() => {
    const P = window.__pw, log2 = Math.log2;
    const g = P.genPassword(20, { lower: true, upper: true, digits: true, symbols: true, excludeAmbiguous: false });
    let ambClean = true;
    for (let i = 0; i < 30; i++) { const x = P.genPassword(16, { lower: true, upper: true, digits: true, symbols: true, excludeAmbiguous: true }); if (/[Il1O0o]/.test(x.password)) ambClean = false; }
    const pp = P.genPassphrase(6, { sep: '-', capitalize: true, addNumber: false });
    const brave = P.analyze('brave-otter-lantern-42');
    return {
      wordsLen: P.WORDS_LEN,
      pwLen: g.password.length, pool: g.pool, pwEnt: g.entropy,
      hasAll: /[a-z]/.test(g.password) && /[A-Z]/.test(g.password) && /[0-9]/.test(g.password) && /[^a-zA-Z0-9]/.test(g.password),
      ambClean,
      ppWords: pp.phrase.split('-').length, ppEnt: pp.entropy, ppExpect: 6 * log2(P.WORDS_LEN),
      braveScore: brave.score, strongScore: P.analyze('9xK#7mLq2!vWz@4Rt&Bf').score,
      emptyScore: P.analyze('').score,
    };
  });
  assert(eng.wordsLen === 408, `word list has 408 unique words (got ${eng.wordsLen})`);
  assert(eng.pwLen === 20 && eng.pool === 85 && eng.hasAll, `genPassword(20) → 20 chars, pool 85, all classes (got ${JSON.stringify(eng)})`);
  assert(Math.abs(eng.pwEnt - 20 * Math.log2(85)) < 0.01, `genPassword entropy = 20·log2(85) (got ${eng.pwEnt})`);
  assert(eng.ambClean, 'excludeAmbiguous removes Il1O0o across 30 draws');
  assert(eng.ppWords === 6 && Math.abs(eng.ppEnt - eng.ppExpect) < 0.01, `genPassphrase(6) → 6 words, entropy 6·log2(list) (got ${eng.ppEnt} vs ${eng.ppExpect})`);
  assert(eng.braveScore === 2 && eng.strongScore === 4 && eng.emptyScore === -1, `engine scores consistent (${JSON.stringify([eng.braveScore, eng.strongScore, eng.emptyScore])})`);

  // ---------------- 6) tab switch + [hidden] COMPUTED-display guard (07-20 lesson) ----------------
  const disp = (sel) => page.evaluate((s) => getComputedStyle(document.querySelector(s)).display, sel);
  assert(await disp('#pl-panel-generate') === 'none', 'generate panel is computed-hidden while analyze is active');
  await page.click('#pl-tab-generate');
  await page.waitForFunction(() => !document.getElementById('pl-panel-generate').hidden);
  assert(await disp('#pl-panel-analyze') === 'none', 'analyze panel computed-hidden after switching to generate');
  assert(await disp('#pl-gen-pp-panel') === 'none', 'inactive passphrase sub-panel computed-hidden (default = password)');
  // every element flagged [hidden] must actually be display:none — the exact 07-20 trap
  const hiddenLeak = await page.evaluate(() =>
    [...document.querySelectorAll('[hidden]')].filter(el => getComputedStyle(el).display !== 'none').length);
  assert(hiddenLeak === 0, `no [hidden] element leaks visible (found ${hiddenLeak})`);

  // ---------------- 7) password generator UI ----------------
  await page.waitForFunction(() => document.getElementById('pl-pw-val').textContent.length >= 6);
  let pwOut = await page.evaluate(() => ({ ...document.getElementById('pl-pw-val').dataset, text: document.getElementById('pl-pw-val').textContent }));
  assert(pwOut.len === '18' && pwOut.text.length === 18, `default generated password is 18 chars (got ${pwOut.len})`);
  assert(parseFloat(await page.textContent('#pl-pw-ent')) > 100, 'default 18-char entropy > 100 bits');

  // length slider changes output length + dataset
  await page.$eval('#pl-pw-len', (el) => { el.value = '32'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForFunction(() => document.getElementById('pl-pw-val').dataset.len === '32');
  assert((await page.textContent('#pl-pw-val')).length === 32, 'slider → 32-char password');
  assert((await page.textContent('#pl-pw-lennum')).trim() === '32', 'length readout updates');

  // turning off upper/digits/symbols → lower-only output (deterministic character class)
  async function setClass(name, on) {
    await page.$eval(`#pl-pw-sets input[data-set="${name}"]`, (el, v) => { if (el.checked !== v) { el.checked = v; el.dispatchEvent(new Event('change', { bubbles: true })); } }, on);
  }
  await setClass('upper', false); await setClass('digits', false); await setClass('symbols', false);
  await page.waitForFunction(() => /^[a-z]+$/.test(document.getElementById('pl-pw-val').textContent));
  assert(/^[a-z]+$/.test(await page.textContent('#pl-pw-val')), 'lower-only settings → only a-z in output');
  assert((await page.evaluate(() => document.getElementById('pl-pw-val').dataset.pool)) === '26', 'lower-only pool = 26');

  // guard: turning the last class off forces lower back on (never empty)
  await setClass('lower', false);
  await page.waitForFunction(() => document.getElementById('pl-pw-val').textContent.length > 0);
  assert((await page.textContent('#pl-pw-val')).length > 0, 'no-classes guard keeps a non-empty password');

  // ---------------- 8) passphrase generator UI ----------------
  await page.click('#pl-sub-pp');
  await page.waitForFunction(() => !document.getElementById('pl-gen-pp-panel').hidden);
  await page.waitForFunction(() => document.getElementById('pl-pp-val').dataset.words === '5');
  // default has "append random number" ON → 5 words + a trailing 2-digit group joined by '-'
  let ppText = await page.textContent('#pl-pp-val');
  assert(/-\d\d$/.test(ppText), `default passphrase appends a random number (got "${ppText}")`);
  assert(parseFloat(await page.textContent('#pl-pp-ent')) > 40, 'default passphrase entropy > 40 bits');
  // turn the number off → clean word count
  await page.$eval('#pl-pp-num', (el) => { if (el.checked) { el.checked = false; el.dispatchEvent(new Event('change', { bubbles: true })); } });
  await page.waitForFunction(() => !/-\d\d$/.test(document.getElementById('pl-pp-val').textContent));
  ppText = await page.textContent('#pl-pp-val');
  assert(ppText.split('-').length === 5, `5 words after disabling number (got "${ppText}")`);
  // word-count slider
  await page.$eval('#pl-pp-words', (el) => { el.value = '8'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForFunction(() => document.getElementById('pl-pp-val').dataset.words === '8');
  assert((await page.textContent('#pl-pp-val')).split('-').length === 8, 'slider → 8-word passphrase');
  // separator change → dot-joined, no dashes
  await page.click('#pl-pp-sep button[data-sep="."]');
  await page.waitForFunction(() => document.getElementById('pl-pp-val').textContent.split('.').length === 8);
  ppText = await page.textContent('#pl-pp-val');
  assert(ppText.includes('.') && !ppText.includes('-'), `separator switches to dot (got "${ppText}")`);

  // copy button feedback (clipboard or execCommand fallback both resolve to 已复制)
  await page.click('#pl-pp-copy');
  await page.waitForFunction(() => document.getElementById('pl-pp-copy').textContent.trim() === '已复制');
  assert((await page.textContent('#pl-pp-copy')).trim() === '已复制', 'copy button confirms 已复制');

  // ---------------- 9) presets: save → persist across reload → load → delete ----------------
  await page.click('#pl-sub-pw');
  await page.waitForFunction(() => !document.getElementById('pl-gen-pw-panel').hidden);
  await page.fill('#pl-preset-name', '工作账号');
  await page.click('#pl-preset-save');
  await page.waitForSelector('.pl-pitem');
  assert(await page.locator('.pl-pitem').count() === 1, 'one preset appears after save');
  assert(/工作账号/.test(await page.textContent('.pl-pitem .nm')), 'preset keeps its name');
  assert((await page.textContent('.pl-pitem .pl-pkind')).trim() === '密码', 'preset records the 密码 kind');

  // persists across a full reload
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#pl-pass');
  await page.click('#pl-tab-generate');
  await page.waitForSelector('.pl-pitem');
  assert(await page.locator('.pl-pitem').count() === 1, 'preset survives reload (localStorage)');
  // load applies it (mode → password panel visible)
  await page.click('#pl-sub-pp');
  await page.waitForFunction(() => !document.getElementById('pl-gen-pp-panel').hidden);
  await page.click('.pl-pitem button:has-text("载入")');
  await page.waitForFunction(() => !document.getElementById('pl-gen-pw-panel').hidden);
  assert(await disp('#pl-gen-pw-panel') !== 'none', 'loading a 密码 preset switches to the password sub-panel');
  // delete empties the list
  await page.click('.pl-pitem button:has-text("删除")');
  await page.waitForSelector('.pl-pempty');
  assert(await page.locator('.pl-pitem').count() === 0, 'delete removes the preset');

  // ---------------- 10) layout containment + return link ----------------
  await page.click('#pl-tab-analyze');
  await page.waitForFunction(() => !document.getElementById('pl-panel-analyze').hidden);
  const contained = async (childSel, parentSel, tol = 2) =>
    page.evaluate((a) => {
      const c = document.querySelector(a[0]), p = document.querySelector(a[1]), t = a[2];
      if (!c || !p) return { ok: false, why: 'missing ' + (c ? a[1] : a[0]) };
      const r = c.getBoundingClientRect(), b = p.getBoundingClientRect();
      const ok = r.left >= b.left - t && r.right <= b.right + t && r.top >= b.top - t && r.bottom <= b.bottom + t && r.width > 0 && r.height > 0;
      return { ok, why: `child[${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.right)},${Math.round(r.bottom)}] parent[${Math.round(b.left)},${Math.round(b.top)},${Math.round(b.right)},${Math.round(b.bottom)}]` };
    }, [childSel, parentSel, tol]);

  await typePass('brave-otter-lantern-42');
  await page.waitForFunction(() => document.getElementById('pl-out').dataset.score === '2');
  let g1 = await contained('.pl-back', '.pl-nav');
  assert(g1.ok, `return link stays inside nav (${g1.why})`);
  g1 = await contained('#pl-bar', '.pl-card');
  assert(g1.ok, `strength meter stays inside its card (${g1.why})`);
  g1 = await contained('#pl-seq', '.pl-break');
  assert(g1.ok, `breakdown stays inside its card (${g1.why})`);
  const noHOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 2);
  assert(noHOverflow, 'page has no horizontal overflow');
  assert(await page.getAttribute('.pl-back', 'href') === '../../', 'return link href = ../../');

  // ---------------- thumbnail (Vault-yellow score-2 analysis, password revealed) ----------------
  await waitMeter(2);
  // reveal the analysed value so the thumbnail shows the real passphrase, not dots
  await page.evaluate(() => { const el = document.getElementById('pl-pass'); if (el.type !== 'text') document.getElementById('pl-toggle-vis').click(); });
  await page.waitForFunction(() => document.getElementById('pl-pass').type === 'text');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.move(5, 5); // avoid hover/focus artefacts on any control
  await page.evaluate(() => document.getElementById('pl-pass').blur());
  await screenshot('thumb.png');
}
