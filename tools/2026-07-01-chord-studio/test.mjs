// Integration test for 和弦与音阶 · Chord Studio.
// Drives the real music-theory engine (chord construction with proper letter
// spelling, reverse chord identification incl. inversions, diatonic scale spelling,
// diatonic chords of a key, note frequencies) plus the piano/identify/progression
// UI, asserting concrete computed outputs — not mere element presence. Ends by
// capturing thumb.png for the hub card.

export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.__music);

  const call = (name, ...args) =>
    page.evaluate(({ n, a }) => window.__music[n].apply(null, a), { n: name, a: args });

  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  // ============ 1. chord construction with correct enharmonic spelling ============
  let c = await call('buildChord', 'C', 'maj');
  assert(eq(c.notes, ['C', 'E', 'G']) && eq(c.pcs, [0, 4, 7]) && c.symbol === 'C',
    `C maj = C E G (got ${JSON.stringify(c.notes)} / ${c.symbol})`);

  c = await call('buildChord', 'C', 'dom7');
  assert(eq(c.notes, ['C', 'E', 'G', 'Bb']) && c.symbol === 'C7',
    `C7 spells the 7th as B♭ not A♯ (got ${JSON.stringify(c.notes)})`);

  c = await call('buildChord', 'C', 'maj7');
  assert(eq(c.notes, ['C', 'E', 'G', 'B']) && c.symbol === 'Cmaj7', `Cmaj7 = C E G B (got ${JSON.stringify(c.notes)})`);

  c = await call('buildChord', 'D', 'min');
  assert(eq(c.notes, ['D', 'F', 'A']) && c.symbol === 'Dm', `Dm = D F A (got ${JSON.stringify(c.notes)})`);

  c = await call('buildChord', 'Eb', 'maj');
  assert(eq(c.notes, ['Eb', 'G', 'Bb']), `E♭ maj = E♭ G B♭, all flats (got ${JSON.stringify(c.notes)})`);

  c = await call('buildChord', 'G', 'dom7');
  assert(eq(c.notes, ['G', 'B', 'D', 'F']) && c.symbol === 'G7', `G7 = G B D F (got ${JSON.stringify(c.notes)})`);

  c = await call('buildChord', 'C', 'dim7');
  assert(eq(c.pcs, [0, 3, 6, 9]) && c.symbol === 'Cdim7', `Cdim7 pcs [0,3,6,9] stacked minor thirds (got ${JSON.stringify(c.pcs)})`);

  c = await call('buildChord', 'F', 'min7');
  assert(eq(c.pcs, [5, 8, 0, 3]) && c.symbol === 'Fm7', `Fm7 pcs [5,8,0,3] (got ${JSON.stringify(c.pcs)})`);

  // role labels reflect chord-tone alterations
  assert((await call('roleLabel', 3, 3)) === '♭3', 'minor third labelled ♭3');
  assert((await call('roleLabel', 7, 10)) === '♭7', 'dominant seventh labelled ♭7');
  assert((await call('roleLabel', 5, 8)) === '♯5', 'augmented fifth labelled ♯5');
  assert((await call('roleLabel', 5, 7)) === '5', 'perfect fifth labelled 5');

  // ============ 2. scale construction with proper diatonic (one-letter-per-degree) spelling ============
  let s = await call('buildScale', 'G', 'major');
  assert(eq(s.notes, ['G', 'A', 'B', 'C', 'D', 'E', 'F#']), `G major uses F♯ not G♭ (got ${JSON.stringify(s.notes)})`);

  s = await call('buildScale', 'Db', 'major');
  assert(eq(s.notes, ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C']), `D♭ major spelled with flats (got ${JSON.stringify(s.notes)})`);

  s = await call('buildScale', 'A', 'minor');
  assert(eq(s.notes, ['A', 'B', 'C', 'D', 'E', 'F', 'G']), `A natural minor = white keys (got ${JSON.stringify(s.notes)})`);

  s = await call('buildScale', 'C', 'harmonicMinor');
  assert(eq(s.notes, ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'B']), `C harmonic minor raises the 7th to B (got ${JSON.stringify(s.notes)})`);

  s = await call('buildScale', 'C', 'dorian');
  assert(eq(s.notes, ['C', 'D', 'Eb', 'F', 'G', 'A', 'Bb']), `C dorian = ♭3 ♭7, natural 6 (got ${JSON.stringify(s.notes)})`);

  s = await call('buildScale', 'C', 'majorPentatonic');
  assert(eq(s.notes, ['C', 'D', 'E', 'G', 'A']), `C major pentatonic = 5 notes (got ${JSON.stringify(s.notes)})`);

  s = await call('buildScale', 'C', 'blues');
  assert(eq(s.notes, ['C', 'Eb', 'F', 'Gb', 'G', 'Bb']), `C blues scale with the ♭5 blue note (got ${JSON.stringify(s.notes)})`);

  // sharp-key spelling (C# major → E# and B#)
  s = await call('buildScale', 'C#', 'major');
  assert(s.notes[0] === 'C#' && s.notes.indexOf('E#') >= 0 && s.notes.indexOf('B#') >= 0,
    `C♯ major spelled with sharps incl. E♯/B♯ (got ${JSON.stringify(s.notes)})`);

  // ============ 3. reverse chord identification (incl. inversions + ambiguity) ============
  let r = await call('identify', ['C', 'E', 'G']);
  assert(r.length >= 1 && r[0].symbol === 'C' && r[0].quality === 'maj' && r[0].inversion === false,
    `identify C E G → C major, root position (got ${JSON.stringify(r)})`);

  r = await call('identify', ['C', 'Eb', 'G']);
  assert(r[0].symbol === 'Cm', `identify C E♭ G → Cm (got ${JSON.stringify(r.map(x => x.symbol))})`);

  r = await call('identify', ['C', 'E', 'G', 'B']);
  assert(r[0].symbol === 'Cmaj7', `identify C E G B → Cmaj7 (got ${JSON.stringify(r.map(x => x.symbol))})`);

  r = await call('identify', ['C', 'E', 'G', 'Bb']);
  assert(r[0].symbol === 'C7', `identify C E G B♭ → C7 (got ${JSON.stringify(r.map(x => x.symbol))})`);

  // first inversion: bass is the 3rd → slash chord
  r = await call('identify', ['E', 'G', 'C']);
  assert(r[0].symbol === 'C/E' && r[0].root === 'C' && r[0].bass === 'E' && r[0].inversion === true,
    `identify E G C (bass E) → C/E first inversion (got ${JSON.stringify(r)})`);

  // symmetric diminished-7th: all four rotations match
  r = await call('identify', ['C', 'Eb', 'Gb', 'A']);
  assert(r.length === 4 && r[0].symbol === 'Cdim7' && r.every(x => x.quality === 'dim7'),
    `dim7 is symmetric → 4 matching roots, C on the bass (got ${JSON.stringify(r.map(x => x.symbol))})`);

  // C6 and Am7 share the same notes — both surfaced, root-position first
  r = await call('identify', ['C', 'E', 'G', 'A']);
  assert(r[0].symbol === 'C6' && r.some(x => x.symbol.indexOf('Am7') === 0),
    `C E G A → C6 (root pos) + Am7 (inversion) (got ${JSON.stringify(r.map(x => x.symbol))})`);

  // too few / no-match cases are safe
  assert((await call('identify', ['C'])).length === 0, 'a single note identifies nothing');
  assert((await call('identify', ['C', 'C#'])).length === 0, 'a random dyad matches no template');

  // ============ 4. intervals ============
  assert((await call('intervalName', 'C', 'G')) === 'P5', 'C→G is a perfect fifth');
  assert((await call('intervalName', 'C', 'E')) === 'M3', 'C→E is a major third');
  assert((await call('intervalName', 'C', 'Eb')) === 'm3', 'C→E♭ is a minor third');
  assert((await call('intervalName', 'C', 'F#')) === 'TT', 'C→F♯ is a tritone');

  // ============ 5. diatonic chords of a key ============
  let d = await call('diatonic', 'C', 'major');
  assert(d.length === 7, 'a key has 7 diatonic triads');
  assert(d[0].symbol === 'C' && d[0].roman === 'I', `C major I = C (got ${d[0].symbol} ${d[0].roman})`);
  assert(d[1].symbol === 'Dm' && d[1].roman === 'ii', `ii = Dm (got ${d[1].symbol})`);
  assert(d[4].symbol === 'G' && d[4].roman === 'V', `V = G (got ${d[4].symbol})`);
  assert(d[6].symbol === 'Bdim' && d[6].roman === 'vii°', `vii° = Bdim (got ${d[6].symbol})`);

  d = await call('diatonic', 'G', 'major');
  assert(d[0].symbol === 'G' && d[4].symbol === 'D' && d[6].symbol === 'F♯dim',
    `G major: I=G, V=D, vii°=F♯dim (got ${JSON.stringify(d.map(x => x.symbol))})`);

  d = await call('diatonic', 'A', 'minor');
  assert(d[0].symbol === 'Am' && d[0].roman === 'i' && d[1].symbol === 'Bdim',
    `A minor: i=Am, ii°=Bdim (got ${JSON.stringify(d.map(x => x.symbol))})`);

  // key signatures
  assert((await call('keySignature', 'C', 'major')) === '无升降号', 'C major has no accidentals');
  assert((await call('keySignature', 'G', 'major')).indexOf('1') === 0, 'G major has 1 sharp');
  assert((await call('keySignature', 'F', 'major')).indexOf('1') === 0 &&
    (await call('keySignature', 'F', 'major')).indexOf('降') >= 0, 'F major has 1 flat');

  // ============ 6. note frequencies (equal temperament, A4=440) ============
  assert(Math.abs((await call('noteFreq', 'A', 4)) - 440) < 1e-9, 'A4 = 440 Hz exactly');
  assert(Math.abs((await call('noteFreq', 'C', 4)) - 261.6255653) < 1e-4, 'C4 ≈ 261.63 Hz');
  assert(Math.abs((await call('noteFreq', 'A', 5)) - 880) < 1e-9, 'A5 = 880 Hz (one octave up)');

  // ============ 7. transpose ============
  assert(eq(await call('transpose', ['C', 'E', 'G'], 2), ['D', 'F#', 'A']), 'transpose C major up 2 → D major');
  assert(eq(await call('transpose', ['C', 'E', 'G'], 7), ['G', 'B', 'D']), 'transpose up a fifth → G major');

  // ============ 8. builder UI reflects the engine + highlights the piano ============
  await call('reset');
  await call('setTab', 'chord');
  await call('setRoot', 2);          // D
  await call('setQuality', 'maj7');
  await page.waitForTimeout(20);
  assert((await page.locator('#chord-name').textContent()).trim() === 'Dmaj7',
    `chord readout shows Dmaj7 (got "${(await page.locator('#chord-name').textContent()).trim()}")`);
  assert((await page.locator('#chord-notes .note-chip').count()) === 4, 'Dmaj7 shows 4 note chips');
  assert((await page.locator('#chord-notes .note-chip .nn').first().textContent()).trim() === 'D', 'first chip is the root D');
  // 4 pitch classes × 2 octaves highlighted; the root pc twice
  assert((await page.locator('.key.hl').count()) === 8, `Dmaj7 highlights 8 keys (4 pcs × 2 octaves) (got ${await page.locator('.key.hl').count()})`);
  assert((await page.locator('.key.root').count()) === 2, 'the root note is marked on both octaves');

  // ============ 9. identify via clicking piano keys in the DOM ============
  await call('reset');
  await page.locator('#tab-identify').click();
  await page.waitForTimeout(10);
  // click C, E, G on octave 4 (whites); use engine hook for stable pc targeting
  await call('toggleNote', 0, 4);
  await call('toggleNote', 4, 4);
  await call('toggleNote', 7, 4);
  await page.waitForTimeout(20);
  assert((await page.locator('#identify-selection .note-chip').count()) === 3, 'three selected notes shown');
  assert((await page.locator('#identify-result .id-item .sym').first().textContent()).trim() === 'C',
    `clicked C+E+G identifies as C (got "${(await page.locator('#identify-result .id-item .sym').first().textContent()).trim()}")`);
  assert((await page.locator('.key.sel').count()) === 3, 'the three clicked keys are marked selected');
  const idDesc = await page.locator('#identify-result .id-item .desc').first().textContent();
  assert(idDesc.indexOf('大三和弦') >= 0, `identify shows the quality name (got "${idDesc}")`);

  // ============ 10. circle of fifths + diatonic table + click-to-load ============
  await call('reset');
  await page.locator('.cof-key[data-pc="7"]').click(); // choose G as the key
  await page.waitForTimeout(20);
  assert((await page.locator('#key-name').textContent()).indexOf('G') >= 0, 'circle-of-fifths click sets the key to G');
  assert((await page.locator('#diatonic-table tr').count()) === 7, 'diatonic table lists 7 chords');
  assert((await page.locator('#diatonic-table tr .sym').nth(4).textContent()).trim() === 'D', 'V of G major is D');
  // click the V row → loads it into the chord builder
  await page.locator('#diatonic-table tr').nth(4).click();
  await page.waitForTimeout(20);
  assert((await page.locator('#chord-name').textContent()).trim() === 'D', 'clicking a diatonic row loads it into the chord tab');

  // ============ 11. progression build + save + persistence across reload ============
  await call('reset');
  await call('addToProgression', 'C', 'maj');
  await call('addToProgression', 'G', 'dom7');
  await page.waitForTimeout(10);
  assert((await page.locator('#prog-strip .prog-chip').count()) === 2, 'two chords added to the progression');
  assert((await page.locator('#prog-strip .prog-chip').nth(1).textContent()).indexOf('G7') >= 0, 'second chip is G7');
  const saved = await call('saveProgression', '测试进行');
  assert(saved === true, 'progression saved to localStorage');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.__music);
  assert((await page.locator('#prog-strip .prog-chip').count()) === 2, 'current progression restored after reload');
  const progs = await call('getProgressions');
  assert(progs['测试进行'] && progs['测试进行'].length === 2, 'named progression persisted with its 2 chords');
  const loaded = await call('loadProgression', '测试进行');
  assert(loaded === true, 'saved progression can be reloaded by name');

  // ============ 12. spelling toggle relabels roots (♭ ↔ ♯) ============
  await call('setSpelling', 'sharp');
  await page.waitForTimeout(10);
  assert((await page.locator('#root-select option').nth(1).textContent()).trim() === 'C♯', 'sharp mode labels pc1 as C♯');
  await call('setSpelling', 'flat');
  await page.waitForTimeout(10);
  assert((await page.locator('#root-select option').nth(1).textContent()).trim() === 'D♭', 'flat mode labels pc1 as D♭');

  // ============ thumbnail: builder on a lush chord + diatonic + a saved progression ============
  await call('reset');
  await call('setSpelling', 'flat');
  await call('setTab', 'chord');
  await call('setRoot', 0);
  await call('setQuality', 'maj7');
  await call('setKey', 0, 'major');
  await call('addToProgression', 'C', 'maj7');
  await call('addToProgression', 'A', 'min7');
  await call('addToProgression', 'D', 'min7');
  await call('addToProgression', 'G', 'dom7');
  await call('render');
  await page.evaluate(() => window.scrollTo(0, 0)); // show the piano (highlighted Cmaj7) + chord readout
  await page.waitForTimeout(80);
  await screenshot('thumb.png');
}
