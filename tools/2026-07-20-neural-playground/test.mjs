// Integration test for 神经网络游乐场 · Neural Playground.
//
// Two halves:
//   A) offline — the <<<ENGINE block is lifted straight out of index.html and exercised in
//      node: hand-computed forward passes, central-difference gradient checks against the
//      analytic backprop, dataset invariants, convergence, regularisation, determinism.
//   B) browser — real clicks/drags on the page, asserting the numbers the engine actually
//      produces (loss falls, accuracy rises, structure edits change the shape, a neuron view
//      really switches the rendered field), persistence across reload, and layout containment.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

export default async function ({ page, toolURL, screenshot, assert }) {
  /* ==================== A) offline engine validation ==================== */
  const html = readFileSync(join(HERE, 'index.html'), 'utf8');
  const parts = html.split('// <<<ENGINE');
  assert(parts.length === 2, 'index.html carries exactly one ENGINE block opener');
  const src = parts[1].split('// ENGINE>>>')[0].replace(/^.*\r?\n/, '');   // drop the rest of the marker line
  assert(!/document|window|localStorage/.test(src), 'engine block is DOM-free');
  const exports = 'export { mulberry32, makeDataset, featurize, makeNet, forward, backpropAccum, zeroGrads, applyGrads, trainEpoch, evalLoss, evalAcc, totalLoss, FEATURES, DATASETS, ACT };';
  const E = await import('data:text/javascript;base64,' + Buffer.from(src + '\n' + exports, 'utf8').toString('base64'));

  // -- deterministic PRNG
  {
    const a = E.mulberry32(42), b = E.mulberry32(42), c = E.mulberry32(43);
    let same = true, diff = false, inRange = true;
    for (let i = 0; i < 500; i++) {
      const x = a(), y = b(), z = c();
      if (x !== y) same = false;
      if (x !== z) diff = true;
      if (!(x >= 0 && x < 1)) inRange = false;
    }
    assert(same && diff && inRange, 'PRNG: seeded, reproducible, in [0,1)');
  }

  // -- datasets
  for (const d of E.DATASETS) {
    const pts = E.makeDataset(d.id, 200, 0, 7);
    assert(pts.length === 200, `${d.id}: 200 points`);
    assert(pts.every((p) => p.label === 1 || p.label === -1), `${d.id}: labels are ±1`);
    const pos = pts.filter((p) => p.label === 1).length;
    assert(pos >= 60 && pos <= 140, `${d.id}: roughly balanced (${pos}/200)`);
    const again = E.makeDataset(d.id, 200, 0, 7);
    assert(again.every((p, i) => p.x === pts[i].x && p.y === pts[i].y && p.label === pts[i].label), `${d.id}: same seed → same points`);
  }
  {
    const xor = E.makeDataset('xor', 300, 0, 3);
    assert(xor.every((p) => (p.x * p.y >= 0 ? 1 : -1) === p.label), 'xor: label = sign(x·y) with no noise');
    const circ = E.makeDataset('circle', 300, 0, 3);
    assert(circ.every((p) => (Math.hypot(p.x, p.y) < 3 ? 1 : -1) === p.label), 'circle: inner ring is +1 with no noise');
    const noisy = E.makeDataset('xor', 400, 0.4, 3);
    const bad = noisy.filter((p) => (p.x * p.y >= 0 ? 1 : -1) !== p.label).length;
    assert(bad > 0, `xor: noise really mislabels points (${bad}/400)`);
  }

  // -- features
  {
    const v = E.featurize(2, -3, ['x1', 'x2', 'x1sq', 'x2sq', 'x1x2', 'sin1', 'sin2']);
    const want = [2, -3, 4, 9, -6, Math.sin(2), Math.sin(-3)];
    assert(v.every((n, i) => Math.abs(n - want[i]) < 1e-12), `feature transforms exact (got ${v.map((n) => n.toFixed(3))})`);
  }

  // -- forward pass vs hand computation
  {
    const net = E.makeNet([2, 1, 1], 'linear', 1);
    net.layers[0][0].w = [2, -1]; net.layers[0][0].b = 0.5;
    net.layers[1][0].w = [3]; net.layers[1][0].b = -0.25;
    const out = E.forward(net, [1, 2]);          // hidden = 2·1 − 1·2 + 0.5 = 0.5 → tanh(3·0.5 − 0.25)
    assert(Math.abs(out - Math.tanh(1.25)) < 1e-12, `forward: hand-computed 2-1-1 net = tanh(1.25) (got ${out})`);
    assert(Math.abs(net.layers[0][0].out - 0.5) < 1e-12, 'forward: hidden pre-activation is 0.5');
  }
  {
    const net = E.makeNet([2, 2, 1], 'relu', 5);
    net.layers[0][0].w = [1, 0]; net.layers[0][0].b = 0;
    net.layers[0][1].w = [0, 1]; net.layers[0][1].b = 0;
    net.layers[1][0].w = [1, 1]; net.layers[1][0].b = 0;
    const out = E.forward(net, [-3, 4]);
    assert(Math.abs(out - Math.tanh(4)) < 1e-12, `forward: ReLU kills the negative unit (got ${out})`);
    assert(net.layers[0][0].out === 0, 'forward: ReLU output is exactly 0 below zero');
  }

  // -- gradient check: analytic backprop vs central finite differences
  for (const act of ['tanh', 'relu', 'sigmoid', 'linear']) {
    const feats = ['x1', 'x2', 'x1x2'];
    const net = E.makeNet([feats.length, 4, 3, 1], act, 2024);
    const pts = E.makeDataset('xor', 12, 0.1, 11);
    E.zeroGrads(net);
    for (const p of pts) E.backpropAccum(net, E.featurize(p.x, p.y, feats), p.label);
    const analytic = [], knobs = [];
    for (const layer of net.layers) for (const nd of layer) {
      for (let k = 0; k < nd.w.length; k++) { analytic.push(nd.gw[k]); knobs.push({ nd, k }); }
      analytic.push(nd.gb); knobs.push({ nd, k: -1 });
    }
    const eps = 1e-6;
    let worst = 0;
    for (let i = 0; i < knobs.length; i++) {
      const { nd, k } = knobs[i];
      const get = () => (k < 0 ? nd.b : nd.w[k]);
      const set = (v) => { if (k < 0) nd.b = v; else nd.w[k] = v; };
      const orig = get();
      set(orig + eps); const lp = E.totalLoss(net, pts, feats);
      set(orig - eps); const lm = E.totalLoss(net, pts, feats);
      set(orig);
      const num = (lp - lm) / (2 * eps);
      const rel = Math.abs(num - analytic[i]) / Math.max(1e-4, Math.abs(num) + Math.abs(analytic[i]));
      if (rel > worst) worst = rel;
    }
    assert(worst < 1e-5, `gradient check (${act}): ${knobs.length} weights, max relative error ${worst.toExponential(2)}`);
  }

  // -- convergence
  const runOffline = (kind, hidden, act, feats, epochs, lr, seed) => {
    const all = E.makeDataset(kind, 250, 0, seed);
    const cut = Math.floor(all.length / 2);
    const tr = all.slice(0, cut), te = all.slice(cut);
    const net = E.makeNet([feats.length, ...hidden, 1], act, seed);
    const before = E.evalLoss(net, tr, feats);
    for (let i = 0; i < epochs; i++) E.trainEpoch(net, tr, { lr, batch: 10, reg: 'none', lambda: 0, feats });
    return { before, after: E.evalLoss(net, tr, feats), accTrain: E.evalAcc(net, tr, feats), accTest: E.evalAcc(net, te, feats) };
  };
  {
    const r = runOffline('xor', [4, 2], 'tanh', ['x1', 'x2'], 300, 0.1, 5);
    assert(r.after < r.before && r.after < 0.01, `xor: train loss ${r.before.toFixed(3)} → ${r.after.toFixed(4)}`);
    assert(r.accTrain > 0.98, `xor: train accuracy ${(r.accTrain * 100).toFixed(1)}%`);
    const accs = [1, 2, 3, 5, 7, 11, 42].map((s) => runOffline('xor', [4, 2], 'tanh', ['x1', 'x2'], 300, 0.1, s).accTest);
    const mean = accs.reduce((a, b) => a + b, 0) / accs.length;
    assert(mean > 0.9, `xor: mean test accuracy over 7 seeds ${(mean * 100).toFixed(1)}%`);
  }
  {
    const r = runOffline('circle', [4, 2], 'tanh', ['x1', 'x2'], 300, 0.1, 5);
    assert(r.accTest > 0.92, `circle: test accuracy ${(r.accTest * 100).toFixed(1)}%`);
  }
  {
    const r = runOffline('gauss', [4], 'tanh', ['x1', 'x2'], 120, 0.1, 5);
    assert(r.accTest > 0.97, `gauss: linearly separable → ${(r.accTest * 100).toFixed(1)}%`);
  }
  {
    // the X₁X₂ feature makes xor separable with no hidden layer at all
    const r = runOffline('xor', [], 'tanh', ['x1x2'], 120, 0.1, 5);
    assert(r.accTest > 0.95, `xor via X₁X₂ with zero hidden layers → ${(r.accTest * 100).toFixed(1)}%`);
  }

  // -- regularisation shrinks weights, L1 zeroes some of them
  {
    const feats = ['x1', 'x2', 'x1sq', 'x2sq', 'x1x2'];
    const all = E.makeDataset('circle', 200, 0.1, 8);
    const mk = () => E.makeNet([feats.length, 5, 4, 1], 'tanh', 77);
    const mean = (net) => { let s = 0, n = 0; for (const L of net.layers) for (const nd of L) for (const w of nd.w) { s += Math.abs(w); n++; } return s / n; };
    const plain = mk(), l2 = mk(), l1 = mk();
    for (let i = 0; i < 200; i++) {
      E.trainEpoch(plain, all, { lr: 0.1, batch: 10, reg: 'none', lambda: 0, feats });
      E.trainEpoch(l2, all, { lr: 0.1, batch: 10, reg: 'l2', lambda: 0.1, feats });
      E.trainEpoch(l1, all, { lr: 0.1, batch: 10, reg: 'l1', lambda: 0.1, feats });
    }
    assert(mean(l2) < mean(plain), `L2 shrinks mean |w| (${mean(l2).toFixed(3)} < ${mean(plain).toFixed(3)})`);
    assert(mean(l1) < mean(plain), `L1 shrinks mean |w| (${mean(l1).toFixed(3)} < ${mean(plain).toFixed(3)})`);
    let zeros = 0;
    for (const L of l1.layers) for (const nd of L) for (const w of nd.w) if (w === 0) zeros++;
    assert(zeros > 0, `L1 drives ${zeros} weights to exactly 0`);
  }

  // -- edge cases
  {
    const feats = ['x1', 'x2'];
    const bare = E.makeNet([2, 1], 'tanh', 1);
    assert(bare.layers.length === 1 && Number.isFinite(E.forward(bare, [0, 0])), 'zero hidden layers still runs');
    assert(E.evalLoss(bare, [], feats) === 0 && E.evalAcc(bare, [], feats) === 0, 'empty point set does not divide by zero');
    const deep = E.makeNet([2, 8, 8, 8, 8, 8, 1], 'tanh', 3);
    assert(Number.isFinite(E.forward(deep, [6, -6])), 'deep net stays finite at the domain corner');
    const net = E.makeNet([2, 1], 'tanh', 1);
    E.trainEpoch(net, E.makeDataset('xor', 30, 0, 2), { lr: 0.1, batch: 9999, reg: 'none', lambda: 0, feats });
    assert(Number.isFinite(E.evalLoss(net, E.makeDataset('xor', 30, 0, 2), feats)), 'batch larger than the dataset is clamped');
    assert(E.makeDataset('spiral', 1, 0, 4).length === 1, 'a dataset of one point works');
  }

  /* ==================== B) browser ==================== */
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#np-out');
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.getElementById('np-out').dataset.drawn !== undefined);

  const st = () => page.evaluate(() => ({ ...document.getElementById('np-state').dataset }));
  const settled = () => page.waitForFunction(() => {
    const s = document.getElementById('np-state').dataset;
    return document.getElementById('np-out').dataset.drawn === s.nonce;
  });
  // range inputs need a real input event, not fill()
  const setRange = (sel, val) => page.evaluate((a) => {
    const el = document.querySelector(a[0]);
    el.value = String(a[1]);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, [sel, val]);
  const frames = (n) => page.evaluate((k) => new Promise((res) => {
    let i = 0;
    const hop = () => (++i >= k ? res() : requestAnimationFrame(hop));
    requestAnimationFrame(hop);
  }), n);

  // -- 1) initial state
  let s = await st();
  assert(s.epoch === '0', `starts at epoch 0 (got ${s.epoch})`);
  assert(s.shape === '2-4-2-1', `default shape 2-4-2-1 (got ${s.shape})`);
  assert(s.ds === 'circle', `default dataset circle (got ${s.ds})`);
  assert(s.ntrain === '125' && s.ntest === '125', `50/50 split of 250 points (got ${s.ntrain}/${s.ntest})`);
  assert(await page.textContent('#np-shape') === '2 – 4 – 2 – 1', 'shape label renders');
  assert((await page.$$('#np-net .np-node')).length === 2 + 4 + 2 + 1, 'diagram draws 9 nodes (2 inputs + 4 + 2 + 1 output)');
  assert((await page.$$('#np-edges line')).length === 2 * 4 + 4 * 2 + 2 * 1, 'diagram draws 18 weight edges');

  // -- 2) one step trains exactly one epoch
  await page.click('#np-step');
  await settled();
  s = await st();
  assert(s.epoch === '1', `单步 advances exactly one epoch (got ${s.epoch})`);
  const loss1 = parseFloat(s.losstrain);

  // -- 3) ×100 really trains 100 epochs and the loss falls
  await page.click('#np-fast');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.epoch === '101');
  await settled();
  s = await st();
  assert(s.epoch === '101', `×100 advances 100 epochs (got ${s.epoch})`);
  const loss101 = parseFloat(s.losstrain);
  assert(loss101 < loss1, `training reduces loss (${loss1.toFixed(4)} → ${loss101.toFixed(4)})`);

  await page.click('#np-fast');
  await page.click('#np-fast');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.epoch === '301');
  await settled();
  s = await st();
  const acc = parseFloat(s.acctest);
  assert(acc > 0.9, `circle is solved after 300 epochs: test accuracy ${(acc * 100).toFixed(1)}%`);
  assert(parseFloat(s.losstrain) < 0.05, `train loss below 0.05 (got ${s.losstrain})`);
  assert((await page.textContent('#np-m-acc')).trim() === (acc * 100).toFixed(1) + '%', 'accuracy tile matches state');

  // -- 4) the decision boundary really is blue inside / magenta outside the circle
  const probe = async () => page.evaluate(() => {
    const cv = document.getElementById('np-out');
    const ctx = cv.getContext('2d');
    const at = (x, y) => {                       // x,y in input space [-6,6]
      const px = Math.round(((x + 6) / 12) * cv.width), py = Math.round(((6 - y) / 12) * cv.height);
      const d = ctx.getImageData(Math.min(cv.width - 1, px), Math.min(cv.height - 1, py), 1, 1).data;
      return [d[0], d[1], d[2]];
    };
    return { centre: at(0, 0), corner: at(5.4, 5.4), edge: at(0, 5.4) };
  });
  {
    const p = await probe();
    const bluish = (c) => c[2] > c[0] + 40;      // blue channel dominates → class +1
    const magentaish = (c) => c[0] > c[2] + 40;  // red channel dominates → class −1
    assert(bluish(p.centre), `centre of the circle is painted blue (rgb ${p.centre})`);
    assert(magentaish(p.corner), `far corner is painted magenta (rgb ${p.corner})`);
    assert(magentaish(p.edge), `outside the ring is magenta (rgb ${p.edge})`);
  }

  // -- 5) reset returns to epoch 0, and replaying the same sequence is bit-identical (same seed)
  const lossAt301 = (await st()).losstrain;
  await page.click('#np-reset');
  await settled();
  assert((await st()).epoch === '0', 'reset returns to epoch 0');
  await page.click('#np-step');                         // same call sequence as before: 1 + 100×3
  for (let i = 0; i < 3; i++) await page.click('#np-fast');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.epoch === '301');
  await settled();
  assert((await st()).losstrain === lossAt301,
    `same seed replays bit-identically (${(await st()).losstrain} vs ${lossAt301})`);

  // -- 6) clicking a hidden neuron switches the main view to that neuron's activation
  const beforeView = await probe();
  await page.click('#np-net .np-node[data-kind="hidden"][data-l="0"][data-j="0"]');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.view === 'h:0:0');
  await settled();
  assert(/隐藏层 1 · 第 1 个神经元/.test(await page.textContent('#np-viewlabel')), 'view label names the neuron');
  const neuronView = await probe();
  const changed = ['centre', 'corner', 'edge'].some((k) => neuronView[k].join() !== beforeView[k].join());
  assert(changed, 'the rendered field actually changes when a neuron is selected');
  assert(await page.isVisible('#np-viewreset'), '回到网络输出 button appears');
  await page.click('#np-viewreset');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.view === 'out');
  await settled();
  assert(await page.isHidden('#np-viewreset'), '回到网络输出 button disappears again on the output view');
  const backView = await probe();
  assert(backView.centre.join() === beforeView.centre.join(), 'returning to the output view restores the same field');

  // -- 7) structure edits change the shape and the diagram
  await page.click('#np-layer-plus');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.nhidden === '3');
  s = await st();
  assert(s.shape === '2-4-2-2-1', `adding a layer → 2-4-2-2-1 (got ${s.shape})`);
  assert(s.epoch === '0', 'a structure change resets training');
  assert((await page.$$('#np-net .np-node')).length === 2 + 4 + 2 + 2 + 1, 'diagram gains the new layer');
  await page.click('#np-net .np-stepper button[data-act="plus"][data-l="0"]');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.shape === '2-5-2-2-1');
  assert((await page.$$('#np-net .np-col[data-col="h0"] .np-node')).length === 5, 'first hidden layer now has 5 neurons');
  await page.click('#np-layer-minus');
  await page.click('#np-layer-minus');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.shape === '2-5-1');
  assert((await st()).nhidden === '1', 'layers can be removed again');

  // -- 8) features: X₁X₂ alone solves xor with no hidden layer
  await page.click('#np-layer-minus');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.nhidden === '0');
  assert((await st()).shape === '2-1', 'zero hidden layers is allowed');
  await page.click('#np-datasets .np-tile[data-ds="xor"]');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.ds === 'xor');
  await page.click('#np-features .np-tile[data-f="x1x2"]');
  await page.click('#np-features .np-tile[data-f="x1"]');
  await page.click('#np-features .np-tile[data-f="x2"]');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.nfeats === '1');
  assert((await st()).shape === '1-1', `only X₁X₂ remains → shape 1-1 (got ${(await st()).shape})`);
  assert((await page.$$('#np-net .np-col[data-col="input"] .np-node')).length === 1, 'diagram shows a single input');
  await page.click('#np-fast');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.epoch === '100');
  await settled();
  s = await st();
  assert(parseFloat(s.acctest) > 0.95,
    `xor solved by the X₁X₂ feature with no hidden layer: ${(parseFloat(s.acctest) * 100).toFixed(1)}%`);

  // the last feature can never be switched off
  await page.click('#np-features .np-tile[data-f="x1x2"]');
  assert((await st()).nfeats === '1', 'the last remaining feature cannot be removed');

  // -- 9) play / pause runs the loop and stops on demand
  await page.click('#np-play');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.running === '1');
  await page.waitForFunction(() => Number(document.getElementById('np-state').dataset.epoch) > 105);
  await page.click('#np-play');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.running === '0');
  const frozen = (await st()).epoch;
  await frames(5);                                      // 5 rendered frames would be 5 epochs if still running
  assert((await st()).epoch === frozen, `paused training stays at epoch ${frozen}`);

  // -- 10) data controls
  await page.click('#np-features .np-tile[data-f="x1"]');
  await page.click('#np-features .np-tile[data-f="x2"]');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.nfeats === '3');
  await page.fill('#np-seed', '9');
  await page.dispatchEvent('#np-seed', 'change');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.epoch === '0');
  const seed9 = await page.evaluate(() => document.getElementById('np-state').dataset.losstrain);
  await page.fill('#np-seed', '5');
  await page.dispatchEvent('#np-seed', 'change');
  await settled();
  const seed5 = await page.evaluate(() => document.getElementById('np-state').dataset.losstrain);
  assert(seed9 !== seed5, `changing the seed changes the initial loss (${seed9} vs ${seed5})`);

  await setRange('#np-ratio', 80);
  await page.waitForFunction(() => document.getElementById('np-state').dataset.ntrain === '200');
  s = await st();
  assert(s.ntrain === '200' && s.ntest === '50', `80% split of 250 → 200/50 (got ${s.ntrain}/${s.ntest})`);
  assert((await page.textContent('#np-split')).includes('训练 200 个'), 'split caption updates');

  await setRange('#np-count', 100);
  await page.waitForFunction(() => document.getElementById('np-state').dataset.ntrain === '80');
  assert((await st()).ntest === '20', '100 points at 80% → 80/20');

  // -- 11) persistence across a reload
  await page.click('#np-datasets .np-tile[data-ds="spiral"]');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.ds === 'spiral');
  await page.fill('#np-name', '螺旋实验');
  await page.click('#np-save');
  await page.waitForSelector('#np-saved .np-card');
  assert((await page.textContent('#np-saved .np-card h3')).trim() === '螺旋实验', 'experiment saved under its name');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.getElementById('np-out').dataset.drawn !== undefined);
  s = await st();
  assert(s.ds === 'spiral', `dataset survives reload (got ${s.ds})`);
  assert(s.nfeats === '3', `feature selection survives reload (got ${s.nfeats})`);
  assert(s.ntrain === '80', `sample count + split survive reload (got ${s.ntrain})`);
  assert((await page.textContent('#np-saved .np-card h3')).trim() === '螺旋实验', 'saved experiment survives reload');

  // load it back after changing things
  await page.click('#np-datasets .np-tile[data-ds="gauss"]');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.ds === 'gauss');
  await page.click('#np-saved [data-load]');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.ds === 'spiral');
  assert((await st()).ds === 'spiral', 'loading a saved experiment restores its dataset');
  await page.click('#np-saved [data-del]');
  await page.waitForFunction(() => !document.querySelector('#np-saved .np-card'));
  assert(await page.isVisible('#np-saved-empty'), 'deleting the last experiment shows the empty state');

  /* -- 12) layout containment guards (a control escaping its box passes DOM checks) -- */
  const contained = async (childSel, parentSel, tol = 2) =>
    page.evaluate((a) => {
      const c = document.querySelector(a[0]), p = document.querySelector(a[1]), t = a[2];
      if (!c || !p) return { ok: false, why: 'missing ' + (c ? a[1] : a[0]) };
      const r = c.getBoundingClientRect(), b = p.getBoundingClientRect();
      return {
        ok: r.left >= b.left - t && r.right <= b.right + t && r.top >= b.top - t && r.bottom <= b.bottom + t && r.width > 0 && r.height > 0,
        why: `child[${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.right)},${Math.round(r.bottom)}] parent[${Math.round(b.left)},${Math.round(b.top)},${Math.round(b.right)},${Math.round(b.bottom)}]`,
      };
    }, [childSel, parentSel, tol]);

  let g = await contained('.np-back', '.np-nav');
  assert(g.ok, `return link stays inside the nav (${g.why})`);
  g = await contained('#np-state', '.np-strip');
  assert(g.ok, `metrics stay inside the control strip (${g.why})`);
  g = await contained('#np-out', '.np-stage');
  assert(g.ok, `output canvas stays inside its stage (${g.why})`);
  g = await contained('#np-curve', '.np-curvewrap');
  assert(g.ok, `loss curve stays inside its box (${g.why})`);
  g = await contained('#np-net', '.np-netscroll', 4);
  assert(g.ok, `network diagram stays inside its scroller (${g.why})`);
  g = await page.evaluate(() => {
    const cv = document.getElementById('np-out'), r = cv.getBoundingClientRect();
    return { ok: r.width > 180 && Math.abs(r.width - r.height) < 3, w: Math.round(r.width), h: Math.round(r.height) };
  });
  assert(g.ok, `output canvas is a decent square (${g.w}×${g.h})`);
  const stray = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('button, input, select, canvas, a').forEach((el) => {
      const r = el.getBoundingClientRect();                       // document coords: the page may be scrolled
      const x = r.left + window.scrollX, y = r.top + window.scrollY;
      if (r.width && r.height && (x < -4 || y < -4)) bad.push(el.id || el.className || el.tagName);
    });
    return bad;
  });
  assert(stray.length === 0, `no control escapes the top/left of the page (${stray.join(', ')})`);
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 2), 'no horizontal overflow');
  assert((await page.getAttribute('.np-back', 'href')) === '../../', 'return link points at the hub');

  /* -- 13) thumbnail: a solved spiral, which is the most striking thing this tool does -- */
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.getElementById('np-out').dataset.drawn !== undefined);
  await page.click('#np-datasets .np-tile[data-ds="spiral"]');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.ds === 'spiral');
  for (const f of ['sin1', 'sin2']) await page.click(`#np-features .np-tile[data-f="${f}"]`);
  await page.click('#np-layer-plus');
  await page.waitForFunction(() => document.getElementById('np-state').dataset.nhidden === '3');
  for (const l of [0, 1, 2]) {
    for (;;) {
      const n = await page.$$eval(`#np-net .np-col[data-col="h${l}"] .np-node`, (els) => els.length);
      if (n >= 8) break;
      await page.click(`#np-net .np-stepper button[data-act="plus"][data-l="${l}"]`);
      await page.waitForFunction(
        (a) => document.querySelectorAll(`#np-net .np-col[data-col="h${a[0]}"] .np-node`).length === a[1],
        [l, n + 1]
      );
    }
  }
  await page.waitForFunction(() => document.getElementById('np-state').dataset.shape === '4-8-8-8-1');
  for (let i = 0; i < 12; i++) {
    await page.click('#np-fast');
    await page.waitForFunction((n) => Number(document.getElementById('np-state').dataset.epoch) >= n, (i + 1) * 100);
  }
  await settled();
  s = await st();
  assert(Number(s.epoch) >= 1200, `thumbnail run reached ${s.epoch} epochs`);
  assert(parseFloat(s.acc) > 0.85, `deep net separates the spiral: train accuracy ${(parseFloat(s.acc) * 100).toFixed(1)}%`);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.move(4, 4);
  await page.waitForFunction(() => {
    const s2 = document.getElementById('np-state').dataset;
    return s2.running === '0' && document.getElementById('np-out').dataset.drawn === s2.nonce;
  });
  await screenshot('thumb.png');
}
