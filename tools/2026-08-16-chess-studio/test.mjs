// 国际象棋工作台 · Chess Studio 集成测试
//
// 断言分三层:
//  1) 引擎层——perft 与六个标准局面的参考值逐位对拍(参考值由 python-chess 独立算出),
//     外加 FEN 往返、SAN 消歧、终局判定、精确交换值、一步杀搜索;
//  2) 界面层——真的点棋盘走子、升变、悔棋、翻阅棋谱、载入 FEN/PGN、摆棋、跑 perft 面板;
//  3) 守卫层——[hidden] 的计算样式、逐 tab 扫控件最小尺寸、棋子不越出格子、无横向溢出、
//     无 text-transform(单位/棋子字母被大小写改写是本站的历史事故族)。
export default async function ({ page, toolURL, screenshot, assert }) {
  let n = 0;
  const ok = (cond, msg) => { n++; assert(cond, msg); };

  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.csReady === '1');

  /* ================= 1. 引擎层 ================= */

  // 1.1 perft:六个标准局面(参考值来自 python-chess 独立计算)
  const PERFT = [
    ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', [20, 400, 8902, 197281]],
    ['r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1', [48, 2039, 97862]],
    ['8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1', [14, 191, 2812, 43238]],
    ['r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1', [6, 264, 9467, 422333]],
    ['rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8', [44, 1486, 62379]],
    ['r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10', [46, 2079, 89890]]
  ];
  const perftGot = await page.evaluate((cases) => cases.map(([fen, refs]) => {
    const pos = window.CS.parseFEN(fen);
    return refs.map((_, i) => window.CS.perft(pos, i + 1));
  }), PERFT);
  PERFT.forEach(([fen, refs], i) => {
    refs.forEach((ref, d) => {
      ok(perftGot[i][d] === ref, `perft(${d + 1}) on "${fen.slice(0, 24)}…" = ${ref} (got ${perftGot[i][d]})`);
    });
  });

  // 1.2 FEN 往返:解析再序列化必须逐字节一致
  const fenRound = await page.evaluate((fens) => fens.map((f) => window.CS.toFEN(window.CS.parseFEN(f))), PERFT.map((p) => p[0]));
  PERFT.forEach(([fen], i) => ok(fenRound[i] === fen, `FEN 往返一致:${fen.slice(0, 30)}…`));

  // 1.3 SAN 生成 + 落子后 FEN(全部由 python-chess 生成的期望值)
  const SAN = [
    ['r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1', 'e1g1', 'O-O', 'r3k2r/8/8/8/8/8/8/R4RK1 b kq - 1 1'],
    ['r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1', 'e1c1', 'O-O-O', 'r3k2r/8/8/8/8/8/8/2KR3R b kq - 1 1'],
    ['8/2P5/8/8/8/8/8/K1k5 w - - 0 1', 'c7c8n', 'c8=N', '2N5/8/8/8/8/8/8/K1k5 b - - 0 1'],
    ['8/2P5/8/8/8/8/8/K1k5 w - - 0 1', 'c7c8q', 'c8=Q+', '2Q5/8/8/8/8/8/8/K1k5 b - - 0 1'],
    ['4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 2', 'e5d6', 'exd6', '4k3/8/3P4/8/8/8/8/4K3 b - - 0 2'],
    ['4k3/8/8/8/8/8/8/1N1NK3 w - - 0 1', 'b1c3', 'Nbc3', '4k3/8/8/8/8/2N5/8/3NK3 b - - 1 1'],
    ['4k3/8/8/8/R7/8/8/R3K3 w - - 0 1', 'a1a3', 'R1a3', '4k3/8/8/8/R7/R7/8/4K3 b - - 1 1'],
    ['4k3/8/8/3Q1Q2/8/8/3Q4/4K3 w - - 0 1', 'd5f3', 'Qdf3', '4k3/8/8/5Q2/8/5Q2/3Q4/4K3 b - - 1 1'],
    ['r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', 'h5f7', 'Qxf7#', 'r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4'],
    ['6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1', 'a1a8', 'Ra8#', 'R5k1/5ppp/8/8/8/8/5PPP/6K1 b - - 1 1'],
    ['4k3/8/8/8/8/8/5PPP/6K1 w - - 0 1', 'g2g4', 'g4', '4k3/8/8/8/6P1/8/5P1P/6K1 b - - 0 1']
  ];
  const sanGot = await page.evaluate((cases) => cases.map(([fen, uci]) => {
    const CS = window.CS, pos = CS.parseFEN(fen), m = CS.uciToMove(pos, uci);
    if (!m) return { san: '(不合法)', after: '', back: false };
    const san = CS.moveToSAN(pos, m);
    const back = CS.sanToMove(pos, san) === m;
    CS.makeMove(pos, m);
    return { san, after: CS.toFEN(pos), back };
  }), SAN);
  SAN.forEach(([fen, uci, san, after], i) => {
    ok(sanGot[i].san === san, `SAN ${uci} = ${san}(得到 ${sanGot[i].san})`);
    ok(sanGot[i].after === after, `落子后 FEN 正确:${uci} → ${after.slice(0, 28)}…`);
    ok(sanGot[i].back === true, `SAN「${san}」能回解析成同一个着法`);
  });

  // 1.4 终局判定(期望值由 python-chess 逐条确认)
  const ENDS = [
    ['7k/5Q2/6K1/8/8/8/8/8 b - - 0 1', 'stalemate'],
    ['7k/5Q1K/8/8/8/8/8/8 b - - 0 1', 'checkmate'],
    ['R5k1/5ppp/8/8/8/8/5PPP/6K1 b - - 1 1', 'checkmate'],
    ['k7/8/1Q6/8/8/8/8/K7 b - - 0 1', 'stalemate'],
    ['8/8/8/4k3/8/8/8/4K2B w - - 0 1', 'material'],
    ['8/8/8/4k3/8/8/8/2B1K1B1 w - - 0 1', 'material'],
    ['8/8/8/4k3/8/8/8/2B1K2B w - - 0 1', 'ok'],
    ['8/8/8/4k3/8/8/8/4K1NB w - - 0 1', 'ok']
  ];
  const endGot = await page.evaluate((cases) => cases.map(([fen]) => window.CS.gameStatus(window.CS.parseFEN(fen)).reason), ENDS);
  ENDS.forEach(([fen, want], i) => ok(endGot[i] === want, `终局判定 ${fen.slice(0, 22)}… → ${want}(得到 ${endGot[i]})`));

  // 1.5 50 回合与三次重复
  const draws = await page.evaluate(() => {
    const CS = window.CS;
    const fifty = CS.gameStatus(CS.parseFEN('8/8/4k3/8/8/4K3/8/7R w - - 100 60')).reason;
    // 双方各来回两次 → 出现第三次重复局面
    const pos = CS.parseFEN('4k3/8/8/8/8/8/8/R3K3 w - - 0 1');
    ['a1a2', 'e8e7', 'a2a1', 'e7e8', 'a1a2', 'e8e7', 'a2a1', 'e7e8'].forEach((u) => CS.makeMove(pos, CS.uciToMove(pos, u)));
    return { fifty, rep: CS.gameStatus(pos).reason, repCount: CS.repetitionCount(pos) };
  });
  ok(draws.fifty === 'fifty', `半回合数 100 判 50 回合和棋(得到 ${draws.fifty})`);
  ok(draws.rep === 'repetition', `同一局面第三次出现判和(得到 ${draws.rep},计数 ${draws.repCount})`);

  // 1.6 精确交换值(手算 + 独立 python 实现对拍过)
  const see = await page.evaluate(() => {
    const CS = window.CS;
    const f = (fen, uci) => { const p = CS.parseFEN(fen); return CS.seeExact(p, CS.uciToMove(p, uci)); };
    return {
      freePawn: f('1k1r4/1pp4p/p7/4p3/8/P5P1/1PP4P/2K1R3 w - - 0 1', 'e1e5'),
      badKnight: f('1k1r3q/1ppn3p/p4b2/4p3/8/P2N2P1/1PP1R1BP/2K1Q3 w - - 0 1', 'd3e5'),
      queenGrabsDefendedPawn: f('4k3/8/8/3p4/8/8/3Q4/4K3 w - - 0 1', 'd2d5')
    };
  });
  ok(see.freePawn === 100, `车吃无保护兵 SEE = +100(得到 ${see.freePawn})`);
  ok(see.badKnight === -220, `马吃兵后被连吃 SEE = -220(得到 ${see.badKnight})`);
  ok(see.queenGrabsDefendedPawn === 100, `后吃无保护兵 SEE = +100(得到 ${see.queenGrabsDefendedPawn})`);

  // 1.7 搜索:一步杀必须找到
  const mates = await page.evaluate(() => {
    const CS = window.CS;
    const best = (fen, d) => CS.think(CS.parseFEN(fen), { depth: d, maxMs: 4000 });
    return {
      backRank: best('6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1', 3),
      scholar: best('r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', 3),
      fools: best('rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 3', 3),
      hangingQueen: best('rnb1kbnr/pppp1ppp/8/4q3/8/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 4', 3)
    };
  });
  ok(mates.backRank.san === 'Ra8#', `底线一步杀:期望 Ra8#,得到 ${mates.backRank.san}`);
  ok(mates.scholar.san === 'Qxf7#', `学者将:期望 Qxf7#,得到 ${mates.scholar.san}`);
  ok(mates.fools.san === 'Qh4#', `傻瓜将(黑方):期望 Qh4#,得到 ${mates.fools.san}`);
  ok(mates.backRank.score > 90000, `找到杀棋时评分是杀分(得到 ${mates.backRank.score})`);
  ok(mates.hangingQueen.san === 'Nxe5' && mates.hangingQueen.score > 700, `白马吃掉停在 e5 的无保护黑后:期望 Nxe5 且评分 >700(得到 ${mates.hangingQueen.san} / ${mates.hangingQueen.score})`);

  // 1.8 PGN:解析真实对局(莫尔菲「歌剧院之夜」)并比对终局 FEN
  const pgnText = '1.e4 e5 2.Nf3 d6 3.d4 Bg4 4.dxe5 Bxf3 5.Qxf3 dxe5 6.Bc4 Nf6 7.Qb3 Qe7 8.Nc3 c6 9.Bg5 b5 10.Nxb5 cxb5 11.Bxb5+ Nbd7 12.O-O-O Rd8 13.Rxd7 Rxd7 14.Rd1 Qe6 15.Bxd7+ Nxd7 16.Qb8+ Nxb8 17.Rd8#';
  const pgnParsed = await page.evaluate((t) => {
    const g = window.CS.parsePGN(t);
    return { plies: g.moves.length, final: g.finalFen, last: g.moves[g.moves.length - 1].san };
  }, pgnText);
  ok(pgnParsed.plies === 33, `PGN 解析出 33 手(得到 ${pgnParsed.plies})`);
  ok(pgnParsed.final === '1n1Rkb1r/p4ppp/4q3/4p1B1/4P3/8/PPP2PPP/2K5 b k - 1 17', `PGN 终局 FEN 与 python-chess 一致(得到 ${pgnParsed.final})`);
  ok(pgnParsed.last === 'Rd8#', `最后一手是 Rd8#(得到 ${pgnParsed.last})`);
  const badPgn = await page.evaluate(() => { try { window.CS.parsePGN('1. e4 e5 2. Qxq9'); return 'no-throw'; } catch (e) { return e.message; } });
  ok(/不是当前局面的合法着法/.test(badPgn), `非法 PGN 会报错并指出第几手(得到「${badPgn}」)`);

  /* ================= 2. 界面层 ================= */

  const sq = (a) => page.locator(`.cs-sq[data-sq="${a}"]`);
  const moveCount = () => page.locator('#cs-movelist .cs-mv').count();

  // 2.1 人人对弈模式下点棋盘走子
  await page.selectOption('#cs-level', '0');
  await page.click('#cs-new');
  await sq('e2').click();
  ok((await page.locator('.cs-sq .cs-dot:not([hidden])').count()) === 2, '选中 e2 兵后高亮出 2 个可走格(e3 / e4)');
  await sq('e4').click();
  await page.waitForFunction(() => document.querySelectorAll('#cs-movelist .cs-mv').length === 1);
  ok((await page.locator('#cs-movelist .cs-mv').first().textContent()) === 'e4', '棋谱第一手记为 e4');
  let fenNow = await page.evaluate(() => window.CS.toFEN(window.CSUI.state.pos));
  ok(fenNow === 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', `走 e4 后局面正确(得到 ${fenNow})`);
  ok((await sq('e4').getAttribute('aria-label')) === 'e4 白兵', 'e4 格的无障碍标签更新为「e4 白兵」');
  ok((await sq('e2').getAttribute('aria-label')) === 'e2 空格', 'e2 格变为空格');

  // 2.2 非法目标格只会取消选中,不会走子
  await sq('e4').click();
  await sq('a8').click();
  ok((await moveCount()) === 1, '点非法目标格不会产生新的着法');

  // 2.3 黑方应招 + 悔棋
  await sq('e7').click();
  await sq('e5').click();
  await page.waitForFunction(() => document.querySelectorAll('#cs-movelist .cs-mv').length === 2);
  await page.click('#cs-undo');
  await page.waitForFunction(() => document.querySelectorAll('#cs-movelist .cs-mv').length === 1);
  ok((await moveCount()) === 1, '人人模式下悔棋一次退回一手');

  // 2.4 翻阅棋谱:上一手 / 下一手
  await page.click('#cs-prev');
  fenNow = await page.evaluate(() => window.CS.toFEN(window.CSUI.state.pos));
  ok(fenNow.startsWith('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w'), '「上一手」退回开局局面');
  await page.click('#cs-next');
  fenNow = await page.evaluate(() => window.CS.toFEN(window.CSUI.state.pos));
  ok(fenNow.startsWith('rnbqkbnr/pppppppp/8/8/4P3'), '「下一手」重新走到 e4');

  // 2.5 引擎真的会应招(深度 2,人机对弈)
  // reset first, *then* raise the level: switching to level 2 while black is to move
  // starts a search on the old position, and that search was still running when the
  // board got reset -- the wait below then burned its whole timeout (flaky 3 runs in 4)
  await page.click('#cs-new');
  await page.waitForFunction(() => window.CSUI.state.moves.length === 0, null, { polling: 150, timeout: 10000 });
  await page.selectOption('#cs-level', '2');
  await page.waitForFunction(() => !window.CSUI.state.thinking, null, { polling: 150, timeout: 10000 });
  await sq('e2').click();
  await sq('e4').click();
  await page.waitForFunction(() => document.querySelectorAll('#cs-movelist .cs-mv').length >= 1, null, { polling: 150, timeout: 10000 });
  await page.waitForFunction(() => document.querySelectorAll('#cs-movelist .cs-mv').length === 2, null, { polling: 150, timeout: 20000 });
  const engineReply = await page.evaluate(() => window.CSUI.state.moves[1]);
  ok(!!engineReply && engineReply.uci.length >= 4, `引擎回了一手合法着法:${engineReply && engineReply.san}`);
  const replyLegal = await page.evaluate((uci) => {
    const CS = window.CS, pos = CS.parseFEN('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1');
    return CS.legalMoves(pos).some((m) => CS.moveToUCI(m) === uci);
  }, engineReply.uci);
  ok(replyLegal, `引擎的应招 ${engineReply.uci} 在合法着法集合里`);

  // 2.6 升变对话框:选马 → 棋谱记 =N
  await page.selectOption('#cs-level', '0');
  await page.click('#cs-tab-position');
  await page.fill('#cs-fen', '4k3/2P5/8/8/8/8/8/4K3 w - - 0 1');
  await page.click('#cs-fen-load');
  await page.waitForFunction(() => window.CSUI.state.startFen.startsWith('4k3/2P5'));
  await sq('c7').click();
  await sq('c8').click();
  await page.waitForSelector('#cs-promo:not([hidden])');
  ok((await page.evaluate(() => getComputedStyle(document.getElementById('cs-promo')).display)) !== 'none', '升变对话框弹出');
  await page.click('.cs-promobtn[data-promo="n"]');
  await page.waitForFunction(() => document.querySelectorAll('#cs-movelist .cs-mv').length === 1);
  ok((await page.locator('#cs-movelist .cs-mv').first().textContent()) === 'c8=N', '选马升变后棋谱记为 c8=N');
  ok((await page.evaluate(() => getComputedStyle(document.getElementById('cs-promo')).display)) === 'none', '升变对话框关闭后计算样式为 display:none');

  // 2.7 载入 PGN → 棋谱与终局判定
  await page.click('#cs-tab-position');
  await page.fill('#cs-pgn', pgnText);
  await page.click('#cs-pgn-load');
  await page.waitForFunction(() => window.CSUI.state.moves.length === 33);
  ok((await moveCount()) === 33, '载入 PGN 后棋谱有 33 手');
  const status = await page.locator('#cs-status').textContent();
  ok(/将杀/.test(status), `载入的对局以将杀收尾(状态栏:${status})`);
  const exported = await page.evaluate(() => { document.getElementById('cs-pgn-export').click(); return document.getElementById('cs-pgn').value; });
  ok(/17\. Rd8#/.test(exported) && /\[Result "1-0"\]/.test(exported), '导出的 PGN 含第 17 手 Rd8# 与 Result 头(白胜)');
  const reimport = await page.evaluate((t) => window.CS.parsePGN(t).moves.length, exported);
  ok(reimport === 33, `导出的 PGN 能被自己重新解析成 33 手(得到 ${reimport})`);

  // 2.8 棋谱点击跳转(棋谱住在「对弈」面板,先切过去再点)
  await page.click('#cs-tab-play');
  await page.locator('#cs-movelist .cs-mv').nth(5).click();
  ok((await page.evaluate(() => window.CSUI.state.ply)) === 6, '点棋谱第 6 手可跳到该手的局面');
  await page.locator('#cs-movelist .cs-mv').nth(32).click();

  // 2.9 预设局面 + 翻转棋盘(预设下拉在「局面」面板)
  await page.click('#cs-tab-position');
  await page.selectOption('#cs-preset', { label: '底线杀(白先一步杀)' });
  await page.waitForFunction(() => window.CSUI.state.startFen.startsWith('6k1/5ppp'));
  const topLeftBefore = await page.locator('.cs-sq').first().getAttribute('data-sq');
  await page.click('#cs-flip');
  const topLeftAfter = await page.locator('.cs-sq').first().getAttribute('data-sq');
  ok(topLeftBefore === 'a8' && topLeftAfter === 'h1', `翻转棋盘后左上角从 a8 变 h1(得到 ${topLeftBefore} → ${topLeftAfter})`);
  await page.click('#cs-flip');

  // 2.10 分析面板:候选着法 + 静态拆解 + 控制格热力
  await page.click('#cs-tab-analyze');
  await page.selectOption('#cs-depth', '3');
  await page.click('#cs-analyze');
  await page.waitForFunction(() => !document.getElementById('cs-analyze').disabled && /主要变例：\S/.test(document.getElementById('cs-pv').textContent));
  const bestLine = await page.locator('#cs-lines tbody tr').nth(1).textContent();
  ok(/Ra8#/.test(bestLine), `分析给出的首选着法是 Ra8#(得到「${bestLine.trim()}」)`);
  const staticRows = await page.locator('#cs-static tbody tr').count();
  ok(staticRows >= 5, `静态评估拆解至少 5 行(得到 ${staticRows})`);
  await page.check('#cs-heat-toggle');
  await page.waitForFunction(() => document.querySelectorAll('#cs-heat-table tbody tr').length > 1);
  const tinted = await page.evaluate(() => Array.from(document.querySelectorAll('.cs-heat')).filter((e) => e.style.background && e.style.background !== 'transparent').length);
  ok(tinted > 10, `开启热力后至少 10 个格子被染色(得到 ${tinted})`);
  await page.uncheck('#cs-heat-toggle');
  const clean = await page.evaluate(() => Array.from(document.querySelectorAll('.cs-heat')).filter((e) => e.style.background && e.style.background !== 'transparent').length);
  ok(clean === 0, '关闭热力后所有染色被清掉');

  // 2.11 摆棋模式:清空 → 放子 → 应用
  await page.click('#cs-tab-position');
  await page.check('#cs-edit-toggle');
  await page.click('#cs-edit-clear');
  await page.click('.cs-pal[data-piece="wk"]');
  await sq('e1').click();
  await page.click('.cs-pal[data-piece="bk"]');
  await sq('e8').click();
  await page.click('.cs-pal[data-piece="wq"]');
  await sq('d4').click();
  await page.uncheck('#cs-c-wk'); await page.uncheck('#cs-c-wq');
  await page.uncheck('#cs-c-bk'); await page.uncheck('#cs-c-bq');
  await page.click('#cs-edit-apply');
  await page.waitForFunction(() => window.CSUI.state.startFen === '4k3/8/8/8/3Q4/8/8/4K3 w - - 0 1');
  ok((await page.inputValue('#cs-fen')) === '4k3/8/8/8/3Q4/8/8/4K3 w - - 0 1', '摆好的局面被写回 FEN 输入框');

  // 2.12 非法局面被拒绝(两个白王)
  await page.fill('#cs-fen', '4k3/8/8/8/8/8/8/K3K3 w - - 0 1');
  await page.click('#cs-fen-load');
  await page.waitForSelector('#cs-fen-err:not([hidden])');
  const fenErr = await page.locator('#cs-fen-err').textContent();
  ok(/只有一个王/.test(fenErr), `两个白王的 FEN 被拒绝(提示:${fenErr.trim()})`);
  await page.fill('#cs-fen', 'rnbqkbnr/pppppppp/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  await page.click('#cs-fen-load');
  const fenErr2 = await page.locator('#cs-fen-err').textContent();
  ok(/8 行|格数/.test(fenErr2), `只有 7 行的 FEN 被拒绝(提示:${fenErr2.trim()})`);

  // 2.13 存档往返(注意:#cs-pgn 住在「局面」面板里,必须先切过去再填,否则 fill 会卡满超时)
  await page.click('#cs-tab-position');
  await page.fill('#cs-pgn', pgnText);
  await page.click('#cs-pgn-load');
  await page.waitForFunction(() => window.CSUI.state.moves.length === 33);
  await page.click('#cs-tab-play');
  await page.fill('#cs-save-name', '歌剧院之夜');
  await page.click('#cs-save');
  await page.waitForSelector('#cs-saves .cs-load-save');
  await page.click('#cs-new');
  await page.waitForFunction(() => window.CSUI.state.moves.length === 0);
  await page.click('#cs-saves .cs-load-save');
  await page.waitForFunction(() => window.CSUI.state.moves.length === 33);
  ok((await moveCount()) === 33, '从存档读回对局后棋谱恢复成 33 手');

  // 2.14 刷新后自动恢复(localStorage)
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.csReady === '1');
  ok((await page.evaluate(() => window.CSUI.state.moves.length)) === 33, '刷新页面后对局被 localStorage 恢复');

  /* ================= 3. perft 自检面板 ================= */
  await page.selectOption('#cs-perft-pos', { label: 'Kiwipete · 战术密集(参考值来自 python-chess)' });
  await page.selectOption('#cs-perft-depth', '3');
  await page.click('#cs-perft-run');
  await page.waitForFunction(() => document.getElementById('cs-perft-table').dataset.state === 'done', null, { timeout: 60000 });
  const rows = await page.locator('#cs-perft-table tbody tr').count();
  ok(rows === 3, `自检表出了 3 行(得到 ${rows})`);
  const verdicts = await page.locator('#cs-perft-table tbody tr td:nth-child(4)').allTextContents();
  ok(verdicts.every((v) => v.includes('一致')), `三个深度全部与参考值一致(得到 ${verdicts.join(' / ')})`);
  const kiwi = await page.locator('#cs-perft-table tbody tr').nth(2).locator('td').nth(1).textContent();
  ok(kiwi.replace(/,/g, '') === '97862', `Kiwipete perft(3) 显示 97,862(得到 ${kiwi})`);
  const sum = await page.locator('#cs-perft-sum').textContent();
  ok(/3\/3 全部与参考值一致/.test(sum), `自检结论行报告全部通过(得到「${sum.trim()}」)`);
  const divideRows = await page.locator('#cs-perft-divide tbody tr').count();
  ok(divideRows === 49, `perft divide 列出 48 个首着 + 表头(得到 ${divideRows})`);

  /* ================= 4. 守卫层 ================= */

  // 4.1 [hidden] 必须真的不显示(本站历史事故:作者 CSS 盖掉 UA 的 [hidden])
  const hiddenDisplays = await page.evaluate(() => Array.from(document.querySelectorAll('[hidden]')).map((e) => ({
    id: e.id || e.className, d: getComputedStyle(e).display
  })));
  ok(hiddenDisplays.length > 0, '页面上存在 [hidden] 元素(守卫本身有意义)');
  hiddenDisplays.forEach((h) => ok(h.d === 'none', `[hidden] 元素 ${h.id} 的计算 display 是 none(得到 ${h.d})`));

  // 4.2 逐 tab 扫控件最小尺寸(隐藏面板里的控件对尺寸守卫失明)
  let scanned = 0;
  for (const tab of ['play', 'analyze', 'position']) {
    await page.click(`#cs-tab-${tab}`);
    if (tab === 'position') await page.check('#cs-edit-toggle');
    const bad = await page.evaluate(() => {
      const out = [];
      let count = 0;
      document.querySelectorAll('input, select, button, textarea').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;          // 不在当前面板
        count++;
        if (el.type === 'checkbox') { if (r.width < 16 || r.height < 16) out.push([el.id || el.className, r.width, r.height]); return; }
        if (el.classList.contains('cs-sq')) { if (r.width < 28 || r.height < 28) out.push(['棋盘格 ' + el.dataset.sq, r.width, r.height]); return; }
        const minW = (el.tagName === 'BUTTON') ? 52 : 100;   // 教训口径：按钮 ≥52px、输入/下拉 ≥100px
        if (r.width < minW || r.height < 18) out.push([el.id || el.textContent.slice(0, 8), r.width, r.height]);
      });
      return { out, count };
    });
    scanned += bad.count;
    ok(bad.out.length === 0, `「${tab}」面板下没有塌缩的控件(问题:${JSON.stringify(bad.out)})`);
    if (tab === 'position') await page.uncheck('#cs-edit-toggle');
  }
  ok(scanned >= 150, `三个面板累计扫到 ${scanned} 个可见控件(应远多于 150,含 64 个棋盘格)`);

  // 4.3 棋子与坐标标签必须落在自己的格子里(窄格 + 变长内容的历史事故族)
  const escaped = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.cs-sq').forEach((cell) => {
      const pr = cell.getBoundingClientRect();
      cell.querySelectorAll('.cs-pc, .cs-cf, .cs-cr').forEach((child) => {
        if (!child.textContent) return;
        const cr = child.getBoundingClientRect();
        if (cr.width === 0) return;
        if (cr.left < pr.left - 1 || cr.right > pr.right + 1 || cr.top < pr.top - 1 || cr.bottom > pr.bottom + 1) {
          out.push([cell.dataset.sq, child.className, Math.round(cr.width), Math.round(pr.width)]);
        }
      });
    });
    return out;
  });
  ok(escaped.length === 0, `棋子/坐标没有溢出格子(越界:${JSON.stringify(escaped.slice(0, 4))})`);

  // 4.4 没有 text-transform(单位与棋子字母被大小写改写是本站的历史事故族)
  const transformed = await page.evaluate(() => Array.from(document.querySelectorAll('*'))
    .filter((e) => { const t = getComputedStyle(e).textTransform; return t && t !== 'none'; })
    .map((e) => e.tagName + '.' + e.className).slice(0, 5));
  ok(transformed.length === 0, `全页没有 text-transform(命中:${transformed.join(', ')})`);

  // 4.5 代码/表格不撑破容器 + 页面无横向滚动(宽屏与 414px 窄屏各测一次)
  for (const w of [1280, 414]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(120);
    const overflow = await page.evaluate(() => ({
      page: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      board: (() => { const b = document.getElementById('cs-board'); return b.scrollWidth - b.clientWidth; })(),
      tables: Array.from(document.querySelectorAll('.cs-tablewrap')).map((t) => t.scrollWidth - t.clientWidth).filter((d) => d > 2).length
    }));
    ok(overflow.page <= 2, `${w}px 下页面没有横向滚动(溢出 ${overflow.page}px)`);
    ok(overflow.board <= 2, `${w}px 下棋盘不撑破容器(溢出 ${overflow.board}px)`);
  }
  await page.setViewportSize({ width: 1280, height: 850 });

  // 4.6 返回链接
  ok((await page.locator('a[href="../../"]').first().getAttribute('href')) === '../../', '顶部有「返回工具集」链接');

  /* ================= 5. 缩略图 ================= */
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.csReady === '1');
  await page.evaluate(() => {
    // 摆一个有内容的局面当封面:西班牙开局的典型中局
    window.CSUI.loadPgn('1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3 Nb8 10.d4 Nbd7');
  });
  await page.waitForFunction(() => window.CSUI.state.moves.length === 20);
  await page.waitForTimeout(350);          // 让评估条的 transition 走完再截图
  await page.evaluate(() => {
    const t = document.querySelector('.cs-tabs');
    window.scrollTo(0, t.getBoundingClientRect().top + window.scrollY - 14);
  });
  await page.waitForTimeout(200);
  await screenshot('thumb.png');

  console.log(`      (${n} 条断言)`);
}
