// Integration test for 思维导图 · Mind Map.
// Drives the real engine through the browser and asserts concrete computed
// outputs: the two-sided balanced tidy-tree LAYOUT coordinates, the outline
// PARSER, tree mutations (add/remove/indent/outdent/collapse), undo, outline
// export, plus real DOM interactions (click-select, F2 keyboard edit,
// collapse hiding, localStorage persistence across reload). Nothing here merely
// checks that an element exists. Captures thumb.png for the homepage card.

export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.__mindmap);

  const call = (name, ...args) =>
    page.evaluate(({ n, a }) => window.__mindmap[n].apply(null, a), { n: name, a: args });

  const near = (a, b, eps = 0.01) => Math.abs(a - b) <= eps;

  // ---------- 1. outline parser (pure) ----------
  {
    const tree = await call('parseOutline', '中心\n\t分支A\n\t\t子1\n\t\t子2\n\t分支B');
    assert(tree.text === '中心', `parser: single top line becomes root (got "${tree.text}")`);
    assert(tree.children.length === 2, `parser: root has 2 branches (got ${tree.children.length})`);
    assert(tree.children[0].text === '分支A', `parser: first branch text (got "${tree.children[0].text}")`);
    assert(tree.children[0].children.length === 2, `parser: 分支A has 2 children (got ${tree.children[0].children.length})`);
    assert(tree.children[0].children[0].text === '子1', `parser: grandchild text (got "${tree.children[0].children[0].text}")`);
    assert(tree.children[1].text === '分支B' && tree.children[1].children.length === 0, 'parser: 分支B is a leaf');
  }
  {
    // two top-level lines → synthetic 中心主题 root; markdown bullets stripped
    const t = await call('parseOutline', '- A\n- B');
    assert(t.text === '中心主题', `parser: multi-top → synthetic root (got "${t.text}")`);
    assert(t.children.length === 2 && t.children[0].text === 'A' && t.children[1].text === 'B',
      'parser: strips "- " bullets and keeps two tops');
  }
  {
    // 2-space indentation is one level
    const t = await call('parseOutline', 'root\n  a\n    a1');
    assert(t.text === 'root' && t.children[0].text === 'a' && t.children[0].children[0].text === 'a1',
      'parser: two-space indent = one level');
  }

  // ---------- 2. leafCount (pure) ----------
  const T = {
    id: 'r', text: 'R', collapsed: false, children: [
      { id: 'a', text: 'A', collapsed: false, children: [
        { id: 'a1', text: 'A1', collapsed: false, children: [] },
        { id: 'a2', text: 'A2', collapsed: false, children: [] } ] },
      { id: 'b', text: 'B', collapsed: false, children: [] },
      { id: 'c', text: 'C', collapsed: false, children: [] } ]
  };
  assert(await call('leafCount', T) === 4, 'leafCount: A(2)+B(1)+C(1) = 4');
  assert(await call('leafCount', T.children[0]) === 2, 'leafCount: subtree A = 2 leaves');
  {
    const Tc = JSON.parse(JSON.stringify(T));
    Tc.children[0].collapsed = true; // collapsed subtree counts as a single leaf
    assert(await call('leafCount', Tc) === 3, 'leafCount: collapsed A counts as 1 → total 3');
  }

  // ---------- 3. two-sided balanced tidy layout (pure, exact coords) ----------
  {
    // weights [A=2,B=1,C=1] → greedy "lighter side, tie→right": right=[A], left=[B,C]
    const pos = await call('computeLayout', T, { row: 100, level: 200 });
    assert(pos.r.x === 0 && pos.r.y === 0 && pos.r.side === 0, 'layout: root at origin, side 0');
    assert(pos.a.side === 1 && pos.a.x === 200, `layout: A on right at x=200 (got side${pos.a.side} x${pos.a.x})`);
    assert(pos.b.side === -1 && pos.b.x === -200, `layout: B on left at x=-200 (got side${pos.b.side} x${pos.b.x})`);
    assert(pos.c.side === -1 && pos.c.x === -200, 'layout: C on left at x=-200');
    assert(pos.a1.x === 400 && pos.a2.x === 400, `layout: depth-2 column at x=400 (got ${pos.a1.x},${pos.a2.x})`);
    assert(pos.a1.y === -50 && pos.a2.y === 50, `layout: A's children stacked at y=-50/50 (got ${pos.a1.y},${pos.a2.y})`);
    assert(near(pos.a.y, (pos.a1.y + pos.a2.y) / 2), `layout: parent A centered on children (A.y=${pos.a.y})`);
    assert(pos.a.y === 0, `layout: A vertically centered at y=0 (got ${pos.a.y})`);
    assert(pos.b.y === -50 && pos.c.y === 50, `layout: left side B/C stacked -50/50 (got ${pos.b.y},${pos.c.y})`);
  }
  {
    // four equal branches → alternate right/left starting right: [right,left,right,left]
    const F = { id: 'r', text: 'R', collapsed: false, children: [
      { id: 'w', text: 'w', collapsed: false, children: [] },
      { id: 'x', text: 'x', collapsed: false, children: [] },
      { id: 'y', text: 'y', collapsed: false, children: [] },
      { id: 'z', text: 'z', collapsed: false, children: [] } ] };
    const p = await call('computeLayout', F, { row: 100, level: 200 });
    assert(p.w.side === 1 && p.x.side === -1 && p.y.side === 1 && p.z.side === -1,
      `layout: 4 equal branches balance R/L/R/L (got ${p.w.side},${p.x.side},${p.y.side},${p.z.side})`);
    assert(p.w.y === -50 && p.y.y === 50, `layout: right pair stacked -50/50 (got ${p.w.y},${p.y.y})`);
    assert(p.x.y === -50 && p.z.y === 50, `layout: left pair stacked -50/50 (got ${p.x.y},${p.z.y})`);
    assert(p.w.x === 200 && p.x.x === -200, 'layout: sides mirror on x');
  }

  // ---------- 4. live tree mutations ----------
  await call('reset');
  const rid = await call('rootId');
  assert(await call('nodeCount') === 1, 'reset: fresh map has 1 (root) node');

  const c1 = await call('addChild', rid, '分支一');
  const c2 = await call('addChild', rid, '分支二');
  assert(await call('nodeCount') === 3, 'addChild: two branches → 3 nodes');
  let kids = await call('childrenOf', rid);
  assert(kids.length === 2 && kids[0].text === '分支一' && kids[1].text === '分支二', 'addChild: order preserved');

  const g1 = await call('addChild', c1, '子');
  assert(await call('nodeCount') === 4 && await call('parentOf', g1) === c1, 'addChild: grandchild parented correctly');

  const s = await call('addSibling', c1, '分支1.5');
  kids = await call('childrenOf', rid);
  assert(kids.length === 3 && kids[1].text === '分支1.5', `addSibling: inserted right after c1 (got ${kids.map(k => k.text).join(',')})`);

  await call('setText', c2, '改名');
  assert((await call('getNode', c2)).text === '改名', 'setText: updates node text');

  // remove subtree (c1 has child g1) drops 2 nodes; root cannot be removed
  const before = await call('nodeCount');
  await call('remove', c1);
  assert(await call('nodeCount') === before - 2, `remove: subtree c1+子 removed (${before}→${await call('nodeCount')})`);
  assert(await call('remove', rid) === false && await call('nodeCount') >= 1, 'remove: root is protected');

  // ---------- 5. indent / outdent ----------
  await call('reset');
  const R = await call('rootId');
  const A = await call('addChild', R, 'A');
  const B = await call('addChild', R, 'B');
  assert(await call('indent', B) === true && await call('parentOf', B) === A,
    'indent: B becomes child of previous sibling A');
  kids = await call('childrenOf', R);
  assert(kids.length === 1 && kids[0].id === A, 'indent: only A remains directly under root');
  assert(await call('outdent', B) === true && await call('parentOf', B) === R,
    'outdent: B returns to be a child of root');
  // indenting a genuine first child (no previous sibling) must fail:
  await call('reset');
  const R2 = await call('rootId');
  const only = await call('addChild', R2, 'only');
  assert(await call('indent', only) === false, 'indent: first child (no previous sibling) is refused');

  // ---------- 6. collapse hides descendants in the DOM ----------
  await call('reset');
  const R3 = await call('rootId');
  const P = await call('addChild', R3, 'P');
  const Q = await call('addChild', P, 'Q');
  await call('render');
  assert(await call('domNodeCount') === 3, 'collapse: root+P+Q rendered → 3 DOM nodes');
  await call('collapse', P, true);
  assert(await call('domNodeCount') === 2, 'collapse: collapsing P hides Q → 2 DOM nodes');
  await call('collapse', P, false);
  assert(await call('domNodeCount') === 3, 'collapse: expanding P shows Q again → 3');

  // ---------- 7. undo ----------
  await call('reset');
  const R4 = await call('rootId');
  await call('addChild', R4, 'temp');
  assert(await call('nodeCount') === 2, 'undo: node added');
  assert(await call('undo') === true && await call('nodeCount') === 1, 'undo: restores previous tree');

  // ---------- 8. outline / markdown export round-trip ----------
  {
    const t = await call('parseOutline', '根\n\t甲\n\t\t甲1\n\t乙');
    const outline = await call('toOutline', t);
    assert(outline === '根\n\t甲\n\t\t甲1\n\t乙', `toOutline: exact indentation (got ${JSON.stringify(outline)})`);
    const md = await call('toMarkdown', t);
    assert(md.startsWith('# 根'), 'toMarkdown: root is H1');
    assert(md.includes('\n- 甲') && md.includes('\n  - 甲1') && md.includes('\n- 乙'),
      `toMarkdown: nested bullets (got ${JSON.stringify(md)})`);
  }

  // ---------- 9. real DOM interaction: click selects, F2 edits ----------
  await call('reset');
  const R5 = await call('rootId');
  const nClick = await call('addChild', R5, 'clickme');
  await page.click(`g.node[data-id="${nClick}"]`);
  assert(await call('selected') === nClick, 'DOM: clicking a node selects it');

  const nEdit = await call('addChild', R5, 'orig');
  await call('select', nEdit);
  await page.locator('#stage').focus();
  await page.keyboard.press('F2');
  await page.waitForSelector('#node-edit', { state: 'visible' });
  await page.fill('#node-edit', 'edited-via-keyboard');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(80);
  assert((await call('getNode', nEdit)).text === 'edited-via-keyboard',
    `DOM: F2 → type → Enter commits new text (got "${(await call('getNode', nEdit)).text}")`);

  // ---------- 10. multi-map management ----------
  await call('reset');
  const nMapsBefore = (await call('maps')).length;
  const map2 = await call('newMap', '第二张');
  assert((await call('maps')).length === nMapsBefore + 1 && await call('currentMapName') === '第二张',
    'maps: newMap adds and switches to it');
  const firstMapId = (await call('maps'))[0].id;
  await call('switchMap', firstMapId);
  assert(await call('currentMapName') === '测试导图', 'maps: switchMap returns to first map');
  await call('deleteMap', map2);
  assert((await call('maps')).length === nMapsBefore, 'maps: deleteMap removes it');

  // ---------- 11. localStorage persistence across reload ----------
  await call('reset');
  const R6 = await call('rootId');
  await call('addChild', R6, 'PERSISTED');
  await page.waitForTimeout(350); // debounced save is 250ms
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.__mindmap);
  {
    const labels = await call('domLabels');
    assert(labels.some(l => l.includes('PERSISTED')), `persistence: node survives reload (labels: ${labels.join('|')})`);
  }

  // ---------- 12. settle on a rich map for the thumbnail ----------
  await call('loadSample', 'product');
  await call('fit');
  await page.waitForTimeout(120);
  const nc = await call('nodeCount');
  const dc = await call('domNodeCount');
  assert(dc === nc, `render: all ${nc} sample nodes drawn (dom ${dc})`);
  await screenshot('thumb.png');
}
