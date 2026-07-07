// Integration test for 寻路可视化 · Pathfinding Visualizer.
// Drives the real page: exercises the pure graph-search engine (BFS/DFS/Dijkstra/
// A*/Greedy) through window.__pf against hand-built ASCII grids and asserts exact
// ground-truth (shortest-path lengths, weighted costs, node-expansion counts,
// no-path cases), then real UI interaction (pointer-drawn walls, maze gen, run).
// Reads from synchronous engine returns / instant mode — never a timed read of an
// animated value. Ends by capturing thumb.png for the homepage card.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#grid');
  await page.waitForFunction(() => !!(window.__pf && window.__pf.solve));

  // basic shell
  assert((await page.locator('.back').getAttribute('href')) === '../../', 'back link points to hub');
  assert(/Pathfinding|寻路/.test(await page.title()), 'title mentions pathfinding');

  // helper: solve one ascii grid with a chosen algo in the page context
  const solveAscii = (lines, algo, opts) =>
    page.evaluate(({ lines, algo, opts }) => {
      const pf = window.__pf;
      const g = pf.fromAscii(lines);
      return pf.solve(g, algo, opts || {});
    }, { lines, algo, opts });

  // node-side path validity: contiguous, right endpoints, avoids walls
  const wallsOf = (lines) => {
    const set = new Set();
    lines.forEach((row, r) => { for (let c = 0; c < row.length; c++) if (row[c] === '#') set.add(r + ',' + c); });
    return set;
  };
  const findChar = (lines, ch) => {
    for (let r = 0; r < lines.length; r++) { const c = lines[r].indexOf(ch); if (c >= 0) return { r, c }; }
    return null;
  };
  const assertValidPath = (res, lines, diag, tag) => {
    assert(res.found, `${tag}: path found`);
    const walls = wallsOf(lines), s = findChar(lines, 'S'), t = findChar(lines, 'T');
    const p = res.path;
    assert(p[0].r === s.r && p[0].c === s.c, `${tag}: path starts at S`);
    assert(p[p.length - 1].r === t.r && p[p.length - 1].c === t.c, `${tag}: path ends at T`);
    for (let i = 0; i < p.length; i++) assert(!walls.has(p[i].r + ',' + p[i].c), `${tag}: path avoids walls @${i}`);
    for (let i = 1; i < p.length; i++) {
      const dr = Math.abs(p[i].r - p[i - 1].r), dc = Math.abs(p[i].c - p[i - 1].c);
      const ok = diag ? (dr <= 1 && dc <= 1 && dr + dc >= 1) : (dr + dc === 1);
      assert(ok, `${tag}: step ${i} is contiguous (dr=${dr},dc=${dc})`);
    }
  };

  // ---- Test 1: open grid, straight shortest path ----
  const open1 = ['S......T', '........', '........', '........', '........'];
  const bfs1 = await solveAscii(open1, 'bfs');
  assert(bfs1.found && bfs1.pathLength === 8 && bfs1.cost === 7, `open BFS: 8 cells / cost 7 (got len=${bfs1.pathLength} cost=${bfs1.cost})`);
  const astar1 = await solveAscii(open1, 'astar');
  const dij1 = await solveAscii(open1, 'dijkstra');
  assert(astar1.cost === 7 && astar1.pathLength === 8, `open A*: cost 7 len 8 (got ${astar1.cost}/${astar1.pathLength})`);
  assert(dij1.cost === 7, `open Dijkstra: cost 7 (got ${dij1.cost})`);
  // Manhattan optimality: |dr|+|dc| == 7
  assert(bfs1.pathLength - 1 === 7, 'open shortest steps == Manhattan distance (7)');
  // A* is more focused than Dijkstra: expands no more nodes
  assert(astar1.visitedCount <= dij1.visitedCount, `A* visits <= Dijkstra (A*=${astar1.visitedCount}, Dij=${dij1.visitedCount})`);
  assert(astar1.visitedCount < dij1.visitedCount, `A* strictly fewer here (A*=${astar1.visitedCount}, Dij=${dij1.visitedCount})`);

  // ---- Test 2: wall fully blocks, then a gap opens a route ----
  const blocked = ['..#..', '..#..', 'S.#.T', '..#..', '..#..'];
  const blkRes = await solveAscii(blocked, 'astar');
  assert(!blkRes.found && blkRes.pathLength === 0, `fully walled column => no path (found=${blkRes.found})`);
  const gapped = ['.....', '..#..', 'S.#.T', '..#..', '..#..'];
  const gapRes = await solveAscii(gapped, 'bfs');
  assert(gapRes.found && gapRes.pathLength === 9 && gapRes.cost === 8,
    `one gap => detour of 9 cells / cost 8 (got len=${gapRes.pathLength} cost=${gapRes.cost})`);
  assertValidPath(gapRes, gapped, false, 'gap BFS');

  // ---- Test 3: weighted terrain — Dijkstra/A* route around cost, BFS ploughs through ----
  const weighted = ['.....', 'S.9.T', '.....'];
  const wDij = await solveAscii(weighted, 'dijkstra');
  const wAst = await solveAscii(weighted, 'astar');
  const wBfs = await solveAscii(weighted, 'bfs');
  const includes = (res, r, c) => res.path.some((p) => p.r === r && p.c === c);
  assert(wDij.cost === 6 && !includes(wDij, 1, 2), `Dijkstra routes around weight-9: cost 6, avoids (1,2) (got cost=${wDij.cost})`);
  assert(wAst.cost === 6 && !includes(wAst, 1, 2), `A* routes around weight-9: cost 6 (got ${wAst.cost})`);
  assert(wDij.pathLength === 7, `Dijkstra detour is 7 cells (got ${wDij.pathLength})`);
  assert(wBfs.pathLength === 5 && includes(wBfs, 1, 2), `BFS takes 5-cell straight line through weight (len=${wBfs.pathLength})`);
  assert(wBfs.cost === 12, `BFS path's weighted cost is 12 (1+9+1+1) (got ${wBfs.cost})`);
  assert(wDij.cost < wBfs.cost, `weighted-optimal cost (6) < BFS cost (12)`);

  // ---- Test 4: diagonal movement ----
  const diagGrid = ['S....', '.....', '.....', '.....', '....T'];
  const d8 = await solveAscii(diagGrid, 'astar', { diagonal: true });
  const d4 = await solveAscii(diagGrid, 'astar', { diagonal: false });
  assert(d8.found && d8.pathLength === 5, `diagonal: 5-cell path corner-to-corner (got ${d8.pathLength})`);
  assert(Math.abs(d8.cost - 4 * Math.SQRT2) < 0.01, `diagonal cost ~= 4·√2 (got ${d8.cost})`);
  assertValidPath(d8, diagGrid, true, 'diagonal A*');
  assert(d4.cost === 8 && d4.pathLength === 9, `4-dir cost 8 / 9 cells (got ${d4.cost}/${d4.pathLength})`);

  // ---- Test 5: DFS returns a valid (not necessarily shortest) path ----
  const dfs1 = await solveAscii(open1, 'dfs');
  assertValidPath(dfs1, open1, false, 'DFS');
  assert(dfs1.pathLength >= 8, `DFS path is at least the shortest length (got ${dfs1.pathLength})`);

  // ---- Test 6: greedy finds a valid path ----
  const greedy1 = await solveAscii(gapped, 'greedy');
  assertValidPath(greedy1, gapped, false, 'Greedy');

  // ---- Test 7: start == target ----
  const same = await page.evaluate(() => {
    const pf = window.__pf; const g = pf.makeGrid(4, 4); g.start = g.target = pf.idOf(g, 1, 1);
    return pf.solve(g, 'astar');
  });
  assert(same.found && same.pathLength === 1 && same.cost === 0, `start==target => trivial path (len ${same.pathLength}, cost ${same.cost})`);

  // ---- Test 8: maze generator is solvable + deterministic ----
  const maze = await page.evaluate(() => {
    const pf = window.__pf;
    function build(seed) {
      const g = pf.makeGrid(15, 21); pf.genDivision(g, pf.seededRng(seed));
      g.start = pf.idOf(g, 0, 0); g.target = pf.idOf(g, 14, 20);
      g.walls.delete(g.start); g.walls.delete(g.target);
      const res = pf.solveRaw(g, 'bfs', {});
      return { walls: Array.from(g.walls).sort((a, b) => a - b), found: res.found };
    }
    const a = build(7), b = build(7), c = build(9);
    return { aFound: a.found, aWalls: a.walls.length, reproducible: JSON.stringify(a.walls) === JSON.stringify(b.walls),
      differsBySeed: JSON.stringify(a.walls) !== JSON.stringify(c.walls) };
  });
  assert(maze.aFound, 'recursive-division maze is solvable (BFS finds a path)');
  assert(maze.aWalls > 0, `maze actually has walls (${maze.aWalls})`);
  assert(maze.reproducible, 'same seed => identical maze (deterministic RNG)');
  assert(maze.differsBySeed, 'different seed => different maze');

  // backtracker made solvable by ensureSolvable
  const bt = await page.evaluate(() => {
    const pf = window.__pf; const g = pf.makeGrid(15, 21); pf.genBacktracker(g, pf.seededRng(3));
    g.start = pf.idOf(g, 0, 0); g.target = pf.idOf(g, 14, 20); pf.ensureSolvable(g);
    return pf.solveRaw(g, 'bfs', {}).found;
  });
  assert(bt, 'backtracker maze + ensureSolvable => solvable');

  // ---- Test 9: live UI — draw a wall by pointer, run, edit-driven state ----
  await page.evaluate(() => { window.__pf.ui.reset(); window.__pf.ui.setInstant(true); window.__pf.ui.setTool('wall'); });
  assert((await page.evaluate(() => window.__pf.ui.wallCount())) === 0, 'reset clears walls');

  // draw a wall on an empty cell via a real pointer drag
  const wallTarget = { r: 2, c: 2 };
  await page.evaluate(() => { window.__pf.ui.selectAlgo('astar'); });
  const pt = await page.evaluate(({ r, c }) => window.__pf.ui.pointerAt(r, c), wallTarget);
  await page.mouse.move(pt.x, pt.y);
  await page.mouse.down();
  await page.mouse.move(pt.x + 1, pt.y + 1);
  await page.mouse.up();
  assert(await page.evaluate(({ r, c }) => window.__pf.ui.isWall(r, c), wallTarget), 'pointer drag drew a wall at (2,2)');

  // generate a maze through the real select + button, then run via the real button
  await page.selectOption('#maze', 'division');
  await page.evaluate(() => window.__pf.ui.generate('division', 4242));
  const wc = await page.evaluate(() => window.__pf.ui.wallCount());
  assert(wc > 0, `UI maze generated walls (${wc})`);
  await page.click('#run');
  await page.waitForFunction(() => window.__pf.ui.status() === 'done' || window.__pf.ui.status() === 'nopath');
  const uiRes = await page.evaluate(() => window.__pf.ui.result());
  assert(uiRes && uiRes.found, 'running A* on the generated maze finds a path');
  // stats DOM reflects the result
  const stat = await page.evaluate(() => window.__pf.ui.statValues());
  assert(Number(stat.visited) === uiRes.visitedCount, `visited stat matches (${stat.visited} vs ${uiRes.visitedCount})`);
  assert(/\d/.test(stat.path), `path-length stat shows a number (got "${stat.path}")`);
  assert(stat.algo === 'A*', `algo stat shows A* (got "${stat.algo}")`);

  // switching algorithm live re-solves without a fresh click
  await page.selectOption('#algo', 'dijkstra');
  await page.waitForFunction(() => window.__pf.ui.statValues().algo === 'Dijkstra');
  const dijUi = await page.evaluate(() => window.__pf.ui.result());
  assert(dijUi.found, 'live re-solve after algorithm switch keeps a path');
  // Dijkstra should visit >= A* on the same maze (no worse-informed search expands fewer)
  assert(dijUi.visitedCount >= uiRes.visitedCount, `Dijkstra visits >= A* on same maze (Dij=${dijUi.visitedCount}, A*=${uiRes.visitedCount})`);

  // clear walls empties the grid
  await page.click('#clear-walls');
  assert((await page.evaluate(() => window.__pf.ui.wallCount())) === 0, 'clear-walls empties the grid');

  // ---- Test 10: save / load named grid ----
  await page.evaluate(() => { window.__pf.ui.generate('division', 55); });
  await page.fill('#save-name', 'my-maze');
  await page.click('#save');
  assert((await page.evaluate(() => window.__pf.ui.savedNames())).includes('my-maze'), 'named grid was saved');
  const savedWalls = await page.evaluate(() => window.__pf.ui.wallCount());
  await page.evaluate(() => { window.__pf.ui.reset(); });
  assert((await page.evaluate(() => window.__pf.ui.wallCount())) === 0, 'reset before load clears');
  await page.evaluate(() => { window.__pf.ui.loadNamed('my-maze'); });
  assert((await page.evaluate(() => window.__pf.ui.wallCount())) === savedWalls, 'loaded grid restores wall count');

  // theme toggle should not throw
  await page.click('#theme-toggle');

  // ---- pretty final frame for the thumbnail ----
  await page.evaluate(() => {
    const ui = window.__pf.ui;
    ui.reset(); ui.setInstant(true); ui.selectAlgo('astar'); ui.setDiagonal(false);
    ui.generate('division', 20240707);
    ui.runInstant();
  });
  await page.waitForFunction(() => window.__pf.ui.status() === 'done');
  // make sure no transient toast covers the card (07-05 lesson)
  await page.evaluate(() => { const t = document.getElementById('toast'); if (t) { t.classList.remove('show'); t.style.display = 'none'; } });
  await screenshot('thumb.png');
}
