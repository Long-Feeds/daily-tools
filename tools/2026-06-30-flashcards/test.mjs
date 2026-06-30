// Integration test for 记忆闪卡 · Flashcards.
// Drives the real SM-2 spaced-repetition engine + deck/card state + study UI
// through the browser and asserts concrete computed outputs (intervals, easiness
// factors, due-queue membership), not mere element presence. Captures thumb.png.

export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.__srs);

  // call any window.__srs.<name>(...args) in the page and get the result back
  const call = (name, ...args) =>
    page.evaluate(({ n, a }) => window.__srs[n].apply(null, a), { n: name, a: args });

  const DAY = 86400000;
  const T0 = 1700000000000; // fixed epoch ms for deterministic scheduling

  // ---- 1. pure SM-2 scheduling math (the engine) ----
  let s = await call('schedule', { ef: 2.5, reps: 0, interval: 0, lapses: 0 }, 4);
  assert(s.reps === 1 && s.interval === 1 && s.ef === 2.5,
    `new card + Good → reps1 int1 ef2.5 (got ${JSON.stringify(s)})`);

  s = await call('schedule', { ef: 2.5, reps: 1, interval: 1, lapses: 0 }, 4);
  assert(s.reps === 2 && s.interval === 6, `2nd Good → interval jumps to 6 (got ${JSON.stringify(s)})`);

  s = await call('schedule', { ef: 2.5, reps: 2, interval: 6, lapses: 0 }, 4);
  assert(s.reps === 3 && s.interval === 15, `3rd Good → round(6*2.5)=15 (got ${JSON.stringify(s)})`);

  s = await call('schedule', { ef: 2.5, reps: 0, interval: 0, lapses: 0 }, 5);
  assert(s.ef === 2.6 && s.interval === 1, `Easy raises EF 2.5→2.6 (got ${JSON.stringify(s)})`);

  s = await call('schedule', { ef: 2.5, reps: 2, interval: 6, lapses: 0 }, 3);
  assert(s.ef === 2.36 && s.interval === 14 && s.reps === 3,
    `Hard (q3) → EF 2.36, interval round(6*2.36)=14 (got ${JSON.stringify(s)})`);

  s = await call('schedule', { ef: 2.5, reps: 3, interval: 15, lapses: 0 }, 0);
  assert(s.reps === 0 && s.interval === 1 && s.lapses === 1 && s.ef === 1.7,
    `Again (q0) resets reps/interval, +1 lapse, EF 2.5→1.7 (got ${JSON.stringify(s)})`);

  s = await call('schedule', { ef: 1.3, reps: 5, interval: 40, lapses: 0 }, 0);
  assert(s.ef === 1.3, `EF floored at 1.3, never lower (got ${s.ef})`);

  // ---- 2. due queue + reviewCard + overridable clock ----
  await call('_setNow', T0);
  await call('reset');
  const deckId = await call('newDeck', 'Test');
  const c1 = await call('addCard', deckId, 'front1', 'back1');
  await call('addCard', deckId, 'front2', 'back2');
  await call('addCard', deckId, 'front3', 'back3');

  let due = await call('dueCards', deckId);
  assert(due.length === 3, `3 brand-new cards are all due now (got ${due.length})`);

  let st = await call('stats', deckId);
  assert(st.total === 3 && st.fresh === 3 && st.due === 3 && st.today === 0,
    `initial stats total3 fresh3 due3 today0 (got ${JSON.stringify(st)})`);

  const rc = await call('reviewCard', deckId, c1, 4); // Good
  assert(rc.reps === 1 && rc.interval === 1 && rc.ef === 2.5, `reviewCard applies SM-2 (got reps${rc.reps} int${rc.interval} ef${rc.ef})`);
  assert(rc.due === T0 + DAY, `reviewed card due set to now + 1 day (got +${(rc.due - T0) / DAY}d)`);

  due = await call('dueCards', deckId);
  assert(due.length === 2 && due.indexOf(c1) < 0, `reviewed card leaves today's queue (got ${due.length})`);

  st = await call('stats', deckId);
  assert(st.fresh === 2 && st.today === 1 && st.due === 2, `after 1 review: fresh2 today1 due2 (got ${JSON.stringify(st)})`);

  await call('_setNow', T0 + DAY + 60000); // a day and a minute later
  due = await call('dueCards', deckId);
  assert(due.indexOf(c1) >= 0, `card resurfaces in the queue one day later (got ${JSON.stringify(due.length)})`);
  st = await call('stats', deckId);
  assert(st.today === 0, `"今日已学" resets on a new calendar day (got ${st.today})`);

  // ---- 3. editing a card preserves its scheduling state ----
  await call('_setNow', T0); await call('reset');
  const ed = await call('newDeck', 'Edit');
  const ec = await call('addCard', ed, 'old front', 'old back');
  await call('reviewCard', ed, ec, 4); // reps1 int1 ef2.5
  await call('editCard', ed, ec, 'new front', 'new back');
  const ecard = await call('getCard', ed, ec);
  assert(ecard.front === 'new front' && ecard.back === 'new back' && ecard.reps === 1 && ecard.ef === 2.5,
    `editing text keeps SM-2 state (got front "${ecard.front}" reps${ecard.reps} ef${ecard.ef})`);

  // ---- 4. bulk add from pasted text (| or tab separated) ----
  await call('reset');
  const bd = await call('newDeck', 'Bulk');
  const r = await call('bulkAdd', bd, 'apple | 苹果\nubiquitous\t无处不在的\n\nno separator here\n法国 | 巴黎');
  assert(r.added === 3 && r.skipped === 1, `bulkAdd: 3 added, 1 skipped (blank ignored) (got ${JSON.stringify(r)})`);
  const bstat = await call('stats', bd);
  assert(bstat.total === 3, `bulk deck holds 3 cards (got ${bstat.total})`);
  const bcards = (await call('getState')).decks.find((d) => d.name === 'Bulk').cards;
  assert(bcards[0].front === 'apple' && bcards[0].back === '苹果', 'first bulk card parsed front/back');
  assert(bcards[1].front === 'ubiquitous' && bcards[1].back === '无处不在的', 'tab-separated card parsed');

  // ---- 5. export / import round-trip + invalid-input safety ----
  const exported = await call('exportJSON');
  assert(exported.indexOf('苹果') >= 0, 'export JSON contains card data');
  const bad = await call('importJSON', '{not valid json');
  assert(bad.ok === false, 'invalid JSON is rejected, not thrown');
  let intact = await call('stats', await call('getActiveId'));
  assert(intact.total === 3, `state intact after a failed import (got ${intact.total})`);
  const imp = await call('importJSON', exported);
  assert(imp.ok === true && imp.decks === 1, `valid import restores decks (got ${JSON.stringify(imp)})`);
  const impStat = await call('stats', await call('getActiveId'));
  assert(impStat.total === 3, `imported deck has its 3 cards back (got ${impStat.total})`);

  // ---- 6. deck management reflected in the UI <select> ----
  await call('reset'); await call('render');
  await call('newDeck', '牌组A');
  const dB = await call('newDeck', '牌组B');
  await call('render');
  assert((await page.locator('#deck-select option').count()) === 2, 'deck <select> lists both decks');
  assert((await page.locator('#deck-select').inputValue()) === dB, 'newest deck is the active selection');
  await call('renameDeck', dB, '牌组B改名'); await call('render');
  const labels = await page.locator('#deck-select option').allTextContents();
  assert(labels.some((t) => t.indexOf('牌组B改名') >= 0), `rename shows up in the dropdown (got ${labels.join(' / ')})`);

  // ---- 7. cards-management view renders real rows ----
  await call('_setNow', T0); await call('reset');
  const md = await call('newDeck', 'Manage');
  await call('addCard', md, 'alpha', 'A');
  await call('addCard', md, 'beta', 'B');
  await call('setView', 'cards');
  await page.waitForTimeout(20);
  assert((await page.locator('#card-list tr').count()) === 2, 'cards view lists 2 rows');
  assert((await page.locator('#card-list .c-front').first().textContent()).trim() === 'alpha', 'row shows the front text');

  // ---- 8. study flow through the real DOM: flip + grade ----
  await call('_setNow', T0); await call('reset');
  const sd = await call('newDeck', 'Study');
  await call('addCard', sd, '2 + 2 = ?', '4');
  await call('setView', 'study');
  await page.waitForTimeout(20);
  assert((await page.locator('#card-front').textContent()).trim() === '2 + 2 = ?', 'study view shows the front');
  assert(await page.locator('#card-answer').isHidden(), 'answer is hidden before flipping');
  assert(await page.locator('#grades').isHidden(), 'grade buttons hidden before flipping');

  await page.locator('#flashcard').click(); // flip
  await page.waitForTimeout(30);
  assert(await page.locator('#card-answer').isVisible(), 'answer revealed after flip');
  assert((await page.locator('#card-back').textContent()).trim() === '4', 'back shows the answer');
  assert(await page.locator('#grades').isVisible(), 'grade buttons appear after flip');
  assert((await page.locator('#int-4').textContent()).trim() === '1天', `Good shows projected interval 1天 (got "${(await page.locator('#int-4').textContent()).trim()}")`);

  await page.locator('.grade[data-q="4"]').click(); // grade Good
  await page.waitForTimeout(30);
  assert(await page.locator('#study-empty').isVisible(), 'empty state shown after the only due card is graded');
  assert((await page.locator('#stat-today').textContent()).trim() === '1', `今日已学 counter = 1 (got ${(await page.locator('#stat-today').textContent()).trim()})`);
  const sdStat = await call('stats', sd);
  assert(sdStat.due === 0 && sdStat.total === 1, `nothing due today after grading (got ${JSON.stringify(sdStat)})`);

  // ---- 9. keyboard study flow (Space to flip, digit to grade) ----
  await call('addCard', sd, 'capital of Japan', 'Tokyo');
  await call('setView', 'study');
  await page.waitForTimeout(20);
  assert((await page.locator('#card-front').textContent()).trim() === 'capital of Japan', 'next due card appears');
  await page.locator('#flashcard').focus();
  await page.locator('#flashcard').press('Space');
  await page.waitForTimeout(20);
  assert(await page.locator('#card-answer').isVisible(), 'Space flips the card');
  await page.locator('#flashcard').press('3'); // 3 = Good
  await page.waitForTimeout(30);
  assert(await page.locator('#study-empty').isVisible(), 'queue empties after grading via keyboard');
  assert((await page.locator('#stat-today').textContent()).trim() === '2', `今日已学 now 2 (got ${(await page.locator('#stat-today').textContent()).trim()})`);

  // ---- 10. persistence across reload ----
  await call('_clearNow');
  await call('reset');
  const pd = await call('newDeck', 'Persist');
  const pc = await call('addCard', pd, 'persist-front', 'persist-back');
  const before = await call('reviewCard', pd, pc, 5); // Easy → ef2.6 reps1
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.__srs);
  const stateAfter = await call('getState');
  const deckAfter = stateAfter.decks.find((d) => d.name === 'Persist');
  assert(deckAfter, 'deck survives a page reload');
  const cardAfter = deckAfter.cards.find((c) => c.front === 'persist-front');
  assert(cardAfter && cardAfter.back === 'persist-back' && cardAfter.ef === before.ef && cardAfter.reps === before.reps,
    `card SM-2 state persisted across reload (ef ${cardAfter && cardAfter.ef}, reps ${cardAfter && cardAfter.reps})`);

  // ---- thumbnail: a flipped sample card with the SM-2 grade buttons ----
  await call('_clearNow');
  await call('reset');
  await call('loadSample');
  await call('setView', 'study');
  await call('flip');
  await page.waitForTimeout(80);
  await screenshot('thumb.png');
}
