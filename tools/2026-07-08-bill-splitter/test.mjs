// Integration test for 账单分摊 · Split & Settle.
// Drives the real split-math + greedy settle-up engine through the browser and
// asserts concrete ground-truth outputs (not just element presence). Also drives
// the real expense form end-to-end. Captures thumb.png for the homepage card.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__split && typeof window.__split.settleUp === 'function');

  // ---------- pure engine: parseAmount ----------
  const pa = await page.evaluate(() => {
    const p = window.__split.parseAmount;
    return { a:p('12.5'), b:p('12'), c:p('.5'), d:p('1,234.50'), e:p('abc'),
             f:p('12.567'), g:p('-5'), h:p(''), i:p('0') };
  });
  assert(pa.a === 1250, `parseAmount("12.5")=1250 (got ${pa.a})`);
  assert(pa.b === 1200, `parseAmount("12")=1200 (got ${pa.b})`);
  assert(pa.c === 50, `parseAmount(".5")=50 (got ${pa.c})`);
  assert(pa.d === 123450, `parseAmount("1,234.50")=123450 (got ${pa.d})`);
  assert(pa.e === null, `parseAmount("abc")=null (got ${pa.e})`);
  assert(pa.f === null, `parseAmount("12.567")=null: >2 decimals rejected (got ${pa.f})`);
  assert(pa.g === null, `parseAmount("-5")=null (got ${pa.g})`);
  assert(pa.h === null, `parseAmount("")=null (got ${pa.h})`);
  assert(pa.i === 0, `parseAmount("0")=0 (got ${pa.i})`);

  // ---------- pure engine: centsToStr ----------
  const cs = await page.evaluate(() => {
    const f = window.__split.centsToStr;
    return { a:f(123456), b:f(-3000), c:f(50), d:f(0), e:f(100) };
  });
  assert(cs.a === '1,234.56', `centsToStr(123456)="1,234.56" (got "${cs.a}")`);
  assert(cs.b === '-30.00', `centsToStr(-3000)="-30.00" (got "${cs.b}")`);
  assert(cs.c === '0.50', `centsToStr(50)="0.50" (got "${cs.c}")`);
  assert(cs.d === '0.00', `centsToStr(0)="0.00" (got "${cs.d}")`);
  assert(cs.e === '1.00', `centsToStr(100)="1.00" (got "${cs.e}")`);

  // ---------- pure engine: distribute (remainder is deterministic) ----------
  const dist = await page.evaluate(() => {
    const d = window.__split.distribute;
    return { thirds:d(10000,[1,1,1]), shares:d(10000,[1,3]), pct:d(10000,[25,75]), one:d(100,[1,1,1]) };
  });
  assert(JSON.stringify(dist.thirds) === JSON.stringify([3334,3333,3333]),
    `100.00/3 → [3334,3333,3333] (got ${JSON.stringify(dist.thirds)})`);
  assert(dist.thirds.reduce((a,b)=>a+b,0) === 10000, 'thirds sum back to 10000 cents (no cent lost)');
  assert(JSON.stringify(dist.shares) === JSON.stringify([2500,7500]),
    `shares [1,3] of 100 → [25,75] (got ${JSON.stringify(dist.shares)})`);
  assert(JSON.stringify(dist.pct) === JSON.stringify([2500,7500]),
    `percent [25,75] of 100 → [25,75] (got ${JSON.stringify(dist.pct)})`);
  assert(JSON.stringify(dist.one) === JSON.stringify([34,33,33]),
    `1.00/3 single remainder cent to first → [34,33,33] (got ${JSON.stringify(dist.one)})`);
  assert(dist.one.reduce((a,b)=>a+b,0) === 100, 'single-remainder distribution still sums to 100');

  // ---------- pure engine: computeOwed per split mode ----------
  const owed = await page.evaluate(() => {
    const co = window.__split.computeOwed;
    return {
      equal: co({ amountCents:9000, split:{ mode:'equal', among:['m1','m2','m3'] } }),
      shares: co({ amountCents:10000, split:{ mode:'shares', shares:{ m1:1, m2:3 } } }),
      percent: co({ amountCents:10000, split:{ mode:'percent', percents:{ m1:25, m2:75 } } }),
      exact: co({ amountCents:5000, split:{ mode:'exact', amounts:{ m1:2000, m2:3000 } } }),
    };
  });
  assert(owed.equal.m1===3000 && owed.equal.m2===3000 && owed.equal.m3===3000,
    `equal 90/3 → 30 each (got ${JSON.stringify(owed.equal)})`);
  assert(owed.shares.m1===2500 && owed.shares.m2===7500,
    `shares 1:3 of 100 → 25/75 (got ${JSON.stringify(owed.shares)})`);
  assert(owed.percent.m1===2500 && owed.percent.m2===7500,
    `percent 25/75 → 25/75 (got ${JSON.stringify(owed.percent)})`);
  assert(owed.exact.m1===2000 && owed.exact.m2===3000,
    `exact → literal cents (got ${JSON.stringify(owed.exact)})`);

  // ---------- pure engine: balances + settle-up ground truth ----------
  const eng = await page.evaluate(() => {
    const g = {
      id:'g1', name:'T', currency:'¥',
      members:[{id:'m1',name:'A'},{id:'m2',name:'B'},{id:'m3',name:'C'}],
      expenses:[{ id:'e1', desc:'d', payer:'m1', amountCents:9000,
                  split:{ mode:'equal', among:['m1','m2','m3'] }, ts:1 }]
    };
    const bal = window.__split.computeBalances(g);
    const tx = window.__split.settleUp(bal);
    return { bal, tx };
  });
  assert(eng.bal.m1===6000 && eng.bal.m2===-3000 && eng.bal.m3===-3000,
    `A pays 90/3 → A +60, B -30, C -30 (got ${JSON.stringify(eng.bal)})`);
  assert(Math.abs(eng.bal.m1+eng.bal.m2+eng.bal.m3) === 0, 'balances sum to exactly zero');
  assert(eng.tx.length === 2, `settle needs 2 transfers (got ${eng.tx.length})`);
  assert(eng.tx.length <= 3 - 1, 'transfers <= members-1');
  // tie-break: both debtors owe 30 → lower id (m2) settled first
  assert(eng.tx[0].from==='m2' && eng.tx[0].to==='m1' && eng.tx[0].amountCents===3000,
    `first transfer B→A 30 (got ${JSON.stringify(eng.tx[0])})`);
  assert(eng.tx[1].from==='m3' && eng.tx[1].to==='m1' && eng.tx[1].amountCents===3000,
    `second transfer C→A 30 (got ${JSON.stringify(eng.tx[1])})`);

  // ---------- circular debt collapses to ZERO transfers ----------
  const circ = await page.evaluate(() => {
    const g = {
      id:'gc', name:'Circle', currency:'¥',
      members:[{id:'m1',name:'A'},{id:'m2',name:'B'},{id:'m3',name:'C'}],
      expenses:[
        { id:'e1', payer:'m2', amountCents:1000, split:{ mode:'exact', amounts:{ m1:1000 } }, ts:1 },
        { id:'e2', payer:'m3', amountCents:1000, split:{ mode:'exact', amounts:{ m2:1000 } }, ts:2 },
        { id:'e3', payer:'m1', amountCents:1000, split:{ mode:'exact', amounts:{ m3:1000 } }, ts:3 },
      ]
    };
    const bal = window.__split.computeBalances(g);
    return { bal, tx: window.__split.settleUp(bal) };
  });
  assert(circ.bal.m1===0 && circ.bal.m2===0 && circ.bal.m3===0,
    `circular A→B→C→A all net zero (got ${JSON.stringify(circ.bal)})`);
  assert(circ.tx.length === 0, `circular debt collapses to 0 transfers (got ${circ.tx.length})`);

  // ---------- live UI: drive the real expense form end-to-end ----------
  await page.evaluate(() => {
    window.__split.loadState({
      groups:[{ id:'g1', name:'Trip', currency:'¥',
        members:[{id:'m1',name:'A'},{id:'m2',name:'B'},{id:'m3',name:'C'}], expenses:[] }],
      currentId:'g1'
    });
  });
  await page.waitForFunction(() => document.querySelectorAll('#members .chip').length === 3);
  // add a 4th member through the real input
  await page.fill('#member-name', 'D');
  await page.click('#add-member');
  await page.waitForFunction(() => document.querySelectorAll('#members .chip').length === 4);

  // record an expense: A pays 90, split equally — but D just joined, so uncheck D
  await page.fill('#exp-desc', 'Dinner');
  await page.fill('#exp-amount', '90');
  await page.selectOption('#exp-payer', 'm1');
  // uncheck D (4th checkbox) so split is among A,B,C only
  await page.evaluate(() => {
    const boxes = document.querySelectorAll('#split-editor .eq-check');
    const last = boxes[boxes.length - 1];
    if (last.checked) { last.checked = false; last.dispatchEvent(new Event('change', { bubbles:true })); }
  });
  await page.click('#save-exp');

  // settlement should converge to 2 transfers into A
  await page.waitForFunction(() => document.querySelectorAll('#settlement .tx').length === 2);

  const ui = await page.evaluate(() => {
    const bal = {};
    document.querySelectorAll('#balances .bal').forEach(r => { bal[r.dataset.id] = Number(r.querySelector('.bal-amount').dataset.cents); });
    const tx = [...document.querySelectorAll('#settlement .tx')].map(r => ({ from:r.dataset.from, to:r.dataset.to, cents:Number(r.dataset.cents) }));
    // D joined via the real UI (generated id) — look it up by name through the engine
    const g = window.__split.group();
    const d = g.members.find(m => m.name === 'D');
    const liveBal = window.__split.balances();
    return {
      bal, tx,
      expCount: document.querySelectorAll('#expenses .exp').length,
      total: document.getElementById('stat-total').textContent,
      per: document.getElementById('stat-per').textContent,
      txCount: document.getElementById('tx-count').textContent,
      dNet: d ? liveBal[d.id] : 'no-D',
      memberCount: g.members.length,
    };
  });
  assert(ui.expCount === 1, `one expense row rendered (got ${ui.expCount})`);
  assert(ui.bal.m1 === 6000 && ui.bal.m2 === -3000 && ui.bal.m3 === -3000,
    `UI balances A +60 / B,C -30 (got ${JSON.stringify(ui.bal)})`);
  assert(ui.dNet === 0, `D was excluded from split → net 0 (got ${ui.dNet})`);
  assert(ui.tx.length === 2 && ui.tx.every(t => t.to === 'm1'),
    `two transfers, both into A (got ${JSON.stringify(ui.tx)})`);
  assert(ui.total === '¥90.00', `total ¥90.00 (got "${ui.total}")`);
  assert(ui.per === '¥22.50', `per-head across 4 members = ¥22.50 (got "${ui.per}")`);

  // ---------- invalid amount is rejected (guard), no expense added ----------
  await page.fill('#exp-amount', 'abc');
  await page.click('#save-exp');
  await page.waitForFunction(() => (document.getElementById('exp-error').textContent || '').trim().length > 0);
  const afterBad = await page.evaluate(() => document.querySelectorAll('#expenses .exp').length);
  assert(afterBad === 1, `invalid amount did not add an expense (still ${afterBad})`);

  // ---------- persistence across reload ----------
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__split && document.querySelectorAll('#expenses .exp').length === 1);
  const persisted = await page.evaluate(() => ({
    members: document.querySelectorAll('#members .chip').length,
    tx: document.querySelectorAll('#settlement .tx').length,
    desc: (document.querySelector('#expenses .exp .exp-desc') || {}).textContent,
  }));
  assert(persisted.members === 4, `members persisted across reload (got ${persisted.members})`);
  assert(persisted.tx === 2, `settlement persisted across reload (got ${persisted.tx})`);
  assert(persisted.desc === 'Dinner', `expense persisted across reload (got "${persisted.desc}")`);

  // ---------- settle to a rich demo state for the thumbnail ----------
  await page.evaluate(() => window.__split.reset());
  await page.waitForFunction(() => document.querySelectorAll('#members .chip').length === 3
    && document.querySelectorAll('#settlement .tx').length >= 1);
  await screenshot('thumb.png');
}
