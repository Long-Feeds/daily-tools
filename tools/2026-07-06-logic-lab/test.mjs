// Integration test for 逻辑电路实验室 · Logic Lab.
// Drives the real topological-evaluation engine + truth-table generator through the
// browser and asserts concrete, ground-truth outputs (half/full adder, MUX, XOR-from-NAND,
// cycle detection), then exercises real UI (input toggle, palette add, wiring, persistence).
// Captures thumb.png for the homepage card.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#canvas');
  await page.waitForFunction(() => !!window.__circuit);

  const C = () => page.evaluate.bind(page);
  const ev = (fn, arg) => page.evaluate(fn, arg);

  // ---------- pure gate logic ----------
  const gates = await ev(() => {
    const g = window.__circuit.gateEval;
    return {
      and: [g('AND',[0,0]),g('AND',[0,1]),g('AND',[1,0]),g('AND',[1,1])],
      or:  [g('OR',[0,0]),g('OR',[0,1]),g('OR',[1,0]),g('OR',[1,1])],
      not: [g('NOT',[0]),g('NOT',[1])],
      nand:[g('NAND',[0,0]),g('NAND',[0,1]),g('NAND',[1,0]),g('NAND',[1,1])],
      nor: [g('NOR',[0,0]),g('NOR',[0,1]),g('NOR',[1,0]),g('NOR',[1,1])],
      xor: [g('XOR',[0,0]),g('XOR',[0,1]),g('XOR',[1,0]),g('XOR',[1,1])],
      xnor:[g('XNOR',[0,0]),g('XNOR',[0,1]),g('XNOR',[1,0]),g('XNOR',[1,1])],
    };
  });
  assert(JSON.stringify(gates.and) === JSON.stringify([0,0,0,1]), `AND truth: ${gates.and}`);
  assert(JSON.stringify(gates.or)  === JSON.stringify([0,1,1,1]), `OR truth: ${gates.or}`);
  assert(JSON.stringify(gates.not) === JSON.stringify([1,0]),     `NOT truth: ${gates.not}`);
  assert(JSON.stringify(gates.nand)=== JSON.stringify([1,1,1,0]), `NAND truth: ${gates.nand}`);
  assert(JSON.stringify(gates.nor) === JSON.stringify([1,0,0,0]), `NOR truth: ${gates.nor}`);
  assert(JSON.stringify(gates.xor) === JSON.stringify([0,1,1,0]), `XOR truth: ${gates.xor}`);
  assert(JSON.stringify(gates.xnor)=== JSON.stringify([1,0,0,1]), `XNOR truth: ${gates.xnor}`);

  // ---------- half-adder: evaluate all 4 input combos via the engine ----------
  const ha = await ev(() => {
    const api = window.__circuit;
    const c = api.buildSpec(api.presets['半加器 Half Adder']);
    const combos = [[0,0],[0,1],[1,0],[1,1]];
    return combos.map(([a,b]) => {
      const r = api.evaluate(c, { A:a, B:b });
      // find comp ids by label
      const S = c.comps.find(x => x.label==='Sum').id;
      const Cy = c.comps.find(x => x.label==='Carry').id;
      return { a, b, sum:r.val[S]||0, carry:r.val[Cy]||0, cyc:r.hasCycle };
    });
  });
  for (const row of ha) {
    assert(row.sum === (row.a ^ row.b), `half-adder Sum(${row.a},${row.b})=${row.sum} expected ${row.a^row.b}`);
    assert(row.carry === (row.a & row.b), `half-adder Carry(${row.a},${row.b})=${row.carry} expected ${row.a&row.b}`);
    assert(row.cyc === false, `half-adder has no cycle`);
  }

  // ---------- truthTable() shape for the half-adder ----------
  const haTT = await ev(() => {
    const api = window.__circuit;
    return api.truthTable(api.buildSpec(api.presets['半加器 Half Adder']));
  });
  assert(haTT.rows.length === 4, `half-adder truth table has 4 rows (got ${haTT.rows.length})`);
  assert(haTT.inputs.length === 2 && haTT.outputs.length === 2, 'half-adder: 2 inputs / 2 outputs');

  // ---------- XOR-from-NAND must equal a plain XOR truth table ----------
  const xorNand = await ev(() => {
    const api = window.__circuit;
    const tt = api.truthTable(api.buildSpec(api.presets['用与非门搭异或 XOR from NAND']));
    // single output; return [in..]->out map
    return tt.rows.map(r => ({ a:r.in[0], b:r.in[1], y:r.out[0] }));
  });
  for (const r of xorNand) {
    assert(r.y === (r.a ^ r.b), `XOR-from-NAND(${r.a},${r.b})=${r.y} expected ${r.a^r.b}`);
  }
  assert(xorNand.length === 4, `XOR-from-NAND enumerated 4 rows (got ${xorNand.length})`);

  // ---------- full-adder: all 8 rows correct ----------
  const fa = await ev(() => {
    const api = window.__circuit;
    const tt = api.truthTable(api.buildSpec(api.presets['全加器 Full Adder']));
    const sumI = tt.outputs.findIndex(o => o.label==='Sum');
    const coutI = tt.outputs.findIndex(o => o.label==='Cout');
    return { rows: tt.rows.map(r => ({ in:r.in, sum:r.out[sumI], cout:r.out[coutI] })), sumI, coutI };
  });
  assert(fa.rows.length === 8, `full-adder has 8 rows (got ${fa.rows.length})`);
  assert(fa.sumI >= 0 && fa.coutI >= 0, 'full-adder Sum & Cout columns exist');
  for (const r of fa.rows) {
    const [a,b,ci] = r.in;
    const expSum = a ^ b ^ ci;
    const expCout = (a & b) | (a & ci) | (b & ci);
    assert(r.sum === expSum, `full-adder Sum(${a},${b},${ci})=${r.sum} expected ${expSum}`);
    assert(r.cout === expCout, `full-adder Cout(${a},${b},${ci})=${r.cout} expected ${expCout}`);
  }

  // ---------- 2:1 MUX selects correctly ----------
  const mux = await ev(() => {
    const api = window.__circuit;
    const tt = api.truthTable(api.buildSpec(api.presets['二选一 多路选择器 MUX 2:1']));
    // inputs sorted: A,B,Sel
    const iA = tt.inputs.findIndex(i=>i.label==='A');
    const iB = tt.inputs.findIndex(i=>i.label==='B');
    const iS = tt.inputs.findIndex(i=>i.label==='Sel');
    return tt.rows.map(r => ({ A:r.in[iA], B:r.in[iB], S:r.in[iS], Y:r.out[0] }));
  });
  for (const r of mux) {
    const exp = r.S ? r.B : r.A;
    assert(r.Y === exp, `MUX(A=${r.A},B=${r.B},Sel=${r.S})=${r.Y} expected ${exp}`);
  }

  // ---------- cycle detection ----------
  const cyc = await ev(() => {
    const api = window.__circuit;
    const loop = api.buildSpec({ comps:[['g','NOT']], wires:[['g','g',0]] });
    const acyclic = api.buildSpec(api.presets['半加器 Half Adder']);
    return { loop: api.evaluate(loop).hasCycle, ok: api.evaluate(acyclic).hasCycle };
  });
  assert(cyc.loop === true, 'self-feedback NOT is flagged as a cycle');
  assert(cyc.ok === false, 'half-adder is acyclic');

  // ==================== LIVE UI ====================
  // boot loads the half-adder preset by default
  await page.waitForFunction(() => document.getElementById('count-comp').textContent === '6');
  assert((await page.locator('#count-comp').textContent()) === '6', 'half-adder shows 6 components');

  // truth-table DOM renders 4 rows
  await page.waitForSelector('#tt-host table.tt tbody tr');
  assert((await page.locator('#tt-host table.tt tbody tr').count()) === 4, 'DOM truth table has 4 rows');

  // toggle inputs via the live engine, assert live output value + lit badge
  let out = await ev(() => { window.__circuit.setInput('A',1); window.__circuit.setInput('B',0);
    return { sum: window.__circuit.outputValue('Sum'), carry: window.__circuit.outputValue('Carry') }; });
  assert(out.sum === 1 && out.carry === 0, `A=1,B=0 -> Sum=1,Carry=0 (got Sum=${out.sum},Carry=${out.carry})`);
  // the Sum output badge should be lit ('on'); Carry not
  let badges = await page.locator('#out-readout .obadge').allTextContents();
  assert(badges.some(t => /Sum\s*1/.test(t.replace(/\s+/g,' '))), `readout shows Sum 1 (got ${JSON.stringify(badges)})`);

  out = await ev(() => { window.__circuit.setInput('A',1); window.__circuit.setInput('B',1);
    return { sum: window.__circuit.outputValue('Sum'), carry: window.__circuit.outputValue('Carry') }; });
  assert(out.sum === 0 && out.carry === 1, `A=1,B=1 -> Sum=0,Carry=1 (got Sum=${out.sum},Carry=${out.carry})`);

  // real DOM click on the input switch body toggles it (pointer path, not just helper)
  const before = await ev(() => window.__circuit.outputValue('Carry')); // 1
  const aId = await ev(() => window.__circuit.compIdByLabel('A'));
  await page.locator(`#comp-layer g[data-comp="${aId}"]`).click();
  await page.waitForTimeout(60);
  const afterA = await ev(() => ({ carry: window.__circuit.outputValue('Carry'), state: window.__circuit.getState().comps.find(c=>c.label==='A').state }));
  assert(afterA.state === 0, `clicking input A toggled its state to 0 (got ${afterA.state})`);
  assert(afterA.carry === 0, `after A->0 with B=1, Carry=0 (got ${afterA.carry})`);

  // palette add increments component count
  await page.locator('#palette button[data-type="AND"]').click();
  await page.waitForTimeout(40);
  assert((await page.locator('#count-comp').textContent()) === '7', 'palette AND added a 7th component');

  // clear empties the canvas + shows hint
  await page.locator('#clear-btn').click();
  await page.waitForTimeout(40);
  assert((await page.locator('#count-comp').textContent()) === '0', 'clear empties the canvas');
  assert(await page.locator('#empty-hint').isVisible(), 'empty hint visible after clear');

  // build a tiny circuit live (addComponent + addWire) and verify signal flows
  const wired = await ev(() => {
    const api = window.__circuit;
    api.clear();
    const inId = api.addComponent('INPUT', 80, 120);
    const notId = api.addComponent('NOT', 360, 120);
    const outId = api.addComponent('OUTPUT', 780, 120);
    api.addWire(inId, notId, 0);
    api.addWire(notId, outId, 0);
    const inLabel = api.getState().comps.find(c=>c.type==='INPUT').label;
    const outLabel = api.getState().comps.find(c=>c.type==='OUTPUT').label;
    api.setInput(inLabel, 0);
    const off = api.outputValue(outLabel);     // NOT 0 = 1
    api.setInput(inLabel, 1);
    const on = api.outputValue(outLabel);       // NOT 1 = 0
    return { off, on, wires: api.getState().wires.length };
  });
  assert(wired.wires === 2, `two wires created (got ${wired.wires})`);
  assert(wired.off === 1 && wired.on === 0, `NOT inverter: in0->out1, in1->out0 (got off=${wired.off}, on=${wired.on})`);

  // named save persists into localStorage
  const saved = await ev(() => {
    window.__circuit.loadPreset('全加器 Full Adder');
    window.__circuit.saveNamed('我的全加器');
    return JSON.parse(localStorage.getItem('logiclab.circuits') || '{}');
  });
  assert(saved['我的全加器'] && saved['我的全加器'].data.comps.length === 10, 'named save stored the full-adder (10 comps)');
  assert((await page.locator('#saved-list .saved-item').count()) >= 1, 'saved list shows the saved circuit');

  // autosave + reload persistence: full-adder should survive a reload
  await ev(() => window.__circuit.loadPreset('全加器 Full Adder'));
  await page.waitForTimeout(60);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.__circuit);
  await page.waitForSelector('#comp-layer g[data-comp]');
  assert((await page.locator('#count-comp').textContent()) === '10', 'reload restored the 10-component full-adder from autosave');

  // ---------- settle on a lit half-adder for a good thumbnail ----------
  await ev(() => {
    const api = window.__circuit;
    api.loadPreset('半加器 Half Adder');
    api.setInput('A', 1);
    api.setInput('B', 1);
  });
  await page.waitForTimeout(120);
  // sanity: the lit state is what we expect (Sum 0, Carry 1) so the thumbnail tells a true story
  const thumbState = await ev(() => ({ s: window.__circuit.outputValue('Sum'), c: window.__circuit.outputValue('Carry') }));
  assert(thumbState.c === 1 && thumbState.s === 0, `thumbnail state A=B=1 -> Carry lit (got Sum=${thumbState.s},Carry=${thumbState.c})`);
  // hide the transient toast instantly so it doesn't overlap the shot (07-05 lesson);
  // display:none skips the opacity fade that a classList removal would leave mid-transition
  await ev(() => { const t = document.getElementById('toast'); if (t) { t.classList.remove('show'); t.style.display = 'none'; } });
  await page.waitForTimeout(20);
  await screenshot('thumb.png');
}
