// Integration test for 白板 · Board.
// Drives the real canvas engine through mouse/keyboard: draws shapes, edits
// sticky/text content, moves/resizes/duplicates/deletes elements, exercises
// undo/redo, zoom, JSON import (bad + good), localStorage persistence and PNG
// export — asserting engine state via the read-only window.__board hook.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#board-canvas');
  await page.waitForFunction(() => !!window.__board);

  const state = () => page.evaluate(() => window.__board.getState());
  const waitCount = (n) => page.waitForFunction((m) => window.__board.getState().elements.length === m, n);

  // back link required by site conventions
  assert((await page.locator('a[href="../../"]').count()) >= 1, 'back link to hub exists');

  // --- 1) draw a rectangle: 160x100 drag ---
  await page.click('#tool-rect');
  await page.mouse.move(400, 300);
  await page.mouse.down();
  await page.mouse.move(560, 400, { steps: 8 });
  await page.mouse.up();
  await waitCount(1);
  let s = await state();
  const rect0 = s.elements[0];
  assert(rect0.type === 'rect', `first element is a rect (got ${rect0.type})`);
  assert(Math.abs(rect0.w - 160) < 3 && Math.abs(rect0.h - 100) < 3,
    `rect is ~160x100 world units (got ${rect0.w}x${rect0.h})`);
  assert(s.tool === 'select', 'tool auto-switches back to select after drawing');
  assert(s.selection.length === 1 && s.selection[0] === rect0.id, 'new rect is selected');

  // --- 2) style panel applies fill to the selected rect ---
  await page.click('[data-fill="#c3faf5"]');
  await page.waitForFunction(() => window.__board.getState().elements[0].fill === '#c3faf5');

  // --- 3) sticky note: click to place, type, Escape commits ---
  await page.click('#tool-sticky');
  await page.mouse.click(700, 420);
  await page.waitForSelector('#text-editor', { state: 'visible' });
  await page.keyboard.type('需求评审');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => {
    const e = window.__board.getState().elements;
    return e.length === 2 && e[1].type === 'sticky' && e[1].text === '需求评审';
  });

  // --- 4) text element ---
  await page.click('#tool-text');
  await page.mouse.click(400, 560);
  await page.waitForSelector('#text-editor', { state: 'visible' });
  await page.keyboard.type('Hello Board');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => {
    const e = window.__board.getState().elements;
    return e.length === 3 && e.some((x) => x.type === 'text' && x.text === 'Hello Board');
  });

  // --- 5) arrow: drag 160px to the right ---
  await page.click('#tool-arrow');
  await page.mouse.move(600, 250);
  await page.mouse.down();
  await page.mouse.move(760, 250, { steps: 6 });
  await page.mouse.up();
  await waitCount(4);
  s = await state();
  const arrow = s.elements.find((x) => x.type === 'arrow');
  assert(arrow, 'arrow element exists');
  assert(Math.abs((arrow.x2 - arrow.x1) - 160) < 3, `arrow spans ~160 world units (got ${arrow.x2 - arrow.x1})`);

  // --- 6) move the (filled) rect by +40,+40 via drag ---
  const beforeMove = (await state()).elements[0];
  await page.mouse.move(480, 350);
  await page.mouse.down();
  await page.mouse.move(520, 390, { steps: 6 });
  await page.mouse.up();
  await page.waitForFunction((args) => {
    const el = window.__board.getState().elements[0];
    return Math.abs(el.x - (args.x + 40)) < 3 && Math.abs(el.y - (args.y + 40)) < 3;
  }, { x: beforeMove.x, y: beforeMove.y });
  s = await state();
  assert(s.selection.length === 1 && s.selection[0] === rect0.id, 'dragging the rect selects it');

  // --- 7) resize via the SE handle: +30,+20 ---
  const r1 = (await state()).elements[0];
  const [hx, hy] = await page.evaluate(([x, y]) => window.__board.w2s(x, y), [r1.x + r1.w, r1.y + r1.h]);
  await page.mouse.move(hx, hy);
  await page.mouse.down();
  await page.mouse.move(hx + 30, hy + 20, { steps: 5 });
  await page.mouse.up();
  await page.waitForFunction((args) => {
    const el = window.__board.getState().elements[0];
    return Math.abs(el.w - (args.w + 30)) < 3 && Math.abs(el.h - (args.h + 20)) < 3;
  }, { w: r1.w, h: r1.h });

  // --- 8) duplicate (Ctrl+D) -> 5, delete (Delete) -> 4 ---
  await page.keyboard.press('Control+d');
  await waitCount(5);
  s = await state();
  assert(s.selection.length === 1 && s.selection[0] !== rect0.id, 'duplicate selects the clone');
  await page.keyboard.press('Delete');
  await waitCount(4);

  // --- 9) undo / redo ---
  await page.keyboard.press('Control+z');
  await waitCount(5);
  await page.keyboard.press('Control+Shift+z');
  await waitCount(4);

  // --- 10) select all / deselect ---
  await page.keyboard.press('Control+a');
  await page.waitForFunction(() => window.__board.getState().selection.length === 4);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => window.__board.getState().selection.length === 0);

  // --- 11) zoom buttons update camera + status pill ---
  await page.click('#zoom-in');
  await page.waitForFunction(() => window.__board.getState().camera.z > 1.15);
  assert((await page.locator('#stat-zoom').textContent()).trim() === '120%', 'zoom pill shows 120%');
  await page.click('#zoom-reset');
  await page.waitForFunction(() => window.__board.getState().camera.z === 1);

  // --- 12) invalid JSON import is rejected with an error toast ---
  await page.setInputFiles('#import-file', {
    name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{definitely not json'),
  });
  await page.waitForSelector('#toast.show.err');
  s = await state();
  assert(s.elements.length === 4, `bad import leaves scene untouched (got ${s.elements.length})`);

  // --- 13) valid JSON import replaces the scene (also our thumbnail scene) ---
  const sticky = (x, y, color, text) => ({ type: 'sticky', x, y, w: 160, h: 160, color, text });
  const colText = (x, text) => ({ type: 'text', x, y: 78, size: 18, text, stroke: '#555a6a' });
  const scene = {
    app: 'daily-tools-board', version: 1,
    elements: [
      { type: 'text', x: 40, y: 4, size: 30, text: 'Sprint 12 · 冲刺看板', stroke: '#1c1c1e' },
      { type: 'draw', x: 40, y: 48, stroke: '#fcb900', sw: 3.5, points: [[0, 8], [22, 1], [44, 9], [66, 2], [88, 8], [110, 1], [132, 7], [154, 2], [176, 6]] },
      colText(60, '待办'), colText(340, '进行中'), colText(620, '已完成'),
      sticky(40, 120, '#fff4c4', '接入登录 API'),
      sticky(40, 300, '#fde0f0', '设计评审意见归档'),
      sticky(320, 120, '#c3faf5', '重构画布渲染层'),
      sticky(320, 300, '#ffe6cd', '补充集成测试'),
      sticky(600, 120, '#ffc6c6', '发布 v2.3 🚀'),
      sticky(600, 300, '#f5f3ff', '整理发布说明'),
      { type: 'arrow', x1: 210, y1: 200, x2: 312, y2: 200, stroke: '#1c1c1e', sw: 2 },
      { type: 'arrow', x1: 490, y1: 200, x2: 592, y2: 200, stroke: '#1c1c1e', sw: 2 },
      { type: 'ellipse', x: 820, y: 120, w: 150, h: 96, stroke: '#0fbcb0', fill: '#c3faf5', sw: 2 },
      { type: 'diamond', x: 820, y: 250, w: 150, h: 104, stroke: '#4262ff', fill: 'none', sw: 2 },
      { type: 'line', x1: 820, y1: 400, x2: 970, y2: 428, stroke: '#ff9999', sw: 3.5 },
    ],
  };
  await page.setInputFiles('#import-file', {
    name: 'kanban.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(scene)),
  });
  await waitCount(scene.elements.length);
  await page.waitForFunction(() => window.__board.getState().camera.z !== 1); // import auto-fits

  // --- 14) localStorage persistence across reload ---
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.__board);
  await waitCount(scene.elements.length);
  s = await state();
  const stickies = s.elements.filter((x) => x.type === 'sticky');
  assert(stickies.length === 6 && stickies[0].text === '接入登录 API', 'sticky content survives reload');

  // --- 15) PNG export triggers a real download ---
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#btn-export-png'),
  ]);
  assert(/^board-.*\.png$/.test(download.suggestedFilename()),
    `PNG download has expected name (got ${download.suggestedFilename()})`);

  // --- settle a nice frame for the thumbnail ---
  await page.click('#zoom-fit');
  await page.mouse.move(200, 700);
  await page.waitForFunction(() => window.__board.getState().selection.length === 0);
  await screenshot('thumb.png');
}
