// 编译器工作台 · Compiler Studio —— 真实浏览器集成测试
// 断言的是「引擎真的算对了」：程序输出、闭包上值解析、字节码指令数、优化前后差、
// 断点暂停时的局部变量读数、运行时错误的调用栈；并带上历史踩过的守卫：
// 隐藏面板计算样式、逐面板控件塌缩、SVG 节点互不重叠 / 文字不越出节点盒、编辑器高亮与行号对齐。
export default async ({ page, toolURL, screenshot, assert }) => {
  await page.goto(toolURL);
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 30000 });

  const txt = async (sel) => (await page.textContent(sel)).trim();
  const build = () => page.evaluate(() => +document.body.dataset.build);
  // 面板助手：藏在别的面板里的控件对 fill/click 不可见（Playwright 会卡满超时）
  const onTab = async (name, fn) => {
    await page.click('#cx-tab-' + name);
    await page.waitForFunction((n) => !document.getElementById('cx-panel-' + n).hidden, name);
    return fn ? await fn() : null;
  };
  // 换示例：正向等待「新源码真的进了编辑器」，不用「≠ 旧值」当条件（2026-08-10 教训）
  const useSample = async (id) => {
    const before = await build();
    await page.selectOption('#cx-sample', id);
    await page.waitForFunction((b) => +document.body.dataset.build > b, before, { timeout: 20000 });
  };
  const setSrc = async (code) => {
    const before = await build();
    await page.fill('#cx-src', code);
    await page.waitForFunction((b) => +document.body.dataset.build > b, before, { timeout: 20000 });
  };
  const console_ = () => txt('#cx-out-console');
  const pill = (k) => txt('#cx-pill-' + k);

  assert(await page.isVisible('a[href="../../"]'), '顶部有返回工具集链接');

  /* ═════════ 1. 默认示例：进页面就已经跑完 ═════════ */
  let out = await console_();
  assert(out.includes('你好，世界！'), '首屏默认示例自动运行并输出，实得 ' + JSON.stringify(out.slice(0, 40)));
  assert(out.includes('[3] 你好，mini') && out.includes('一共打了 3 次招呼'), 'for 循环 + 函数返回值正确，实得 ' + JSON.stringify(out));
  assert((await pill('lex')).includes('词元'), '词法流水线徽标显示词元数，实得 ' + await pill('lex'));
  assert((await pill('run')).includes('条指令'), '运行徽标显示执行指令数，实得 ' + await pill('run'));

  /* ═════════ 2. FizzBuzz：逐字比对整行输出 ═════════ */
  await useSample('fizzbuzz');
  out = await console_();
  const want = '1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz 16 17 Fizz 19 Buzz';
  assert(out.trim() === want, 'FizzBuzz(20) 输出逐字正确，实得 ' + JSON.stringify(out));

  /* ═════════ 3. 递归 + 记忆化：大数也要精确 ═════════ */
  await useSample('fib');
  out = await console_();
  assert(out.includes('fib(20) = 6765'), '朴素递归 fib(20)=6765，实得 ' + JSON.stringify(out));
  assert(out.includes('fib(70) = 190392490709135'), '记忆化 fib(70)=190392490709135（双精度内精确），实得 ' + JSON.stringify(out));

  /* ═════════ 4. 快排：真的排好了 ═════════ */
  await useSample('sort');
  out = await console_();
  assert(out.includes('排序后 [2, 4, 4, 8, 12, 16, 23, 37, 55, 61, 70, 91]'), '快排结果正确（含重复元素），实得 ' + JSON.stringify(out));

  /* ═════════ 5. 闭包：上值捕获 —— 本工具的核心 ═════════ */
  await useSample('closure');
  out = await console_();
  assert(out.includes('a: 1 2 3'), '同一个闭包连续调用累加 1 2 3，实得 ' + JSON.stringify(out));
  assert(out.includes('b: 1'), '第二个闭包捕获的是自己那份 n（不是共享的），实得 ' + JSON.stringify(out));
  assert(out.includes('add10(5) = 15') && out.includes('add99(5) = 104'), '匿名函数捕获参数 k 正确');

  // 作用域面板：n 被标成「被闭包捕获」，tick 有 1 个上值，引用解析出「上值」
  await onTab('scope');
  const capTxt = await page.$$eval('#cx-scope-tree .cx-var-cap', (ns) => ns.map((n) => n.textContent.replace(/\s+/g, ' ').trim()));
  assert(capTxt.some((t) => t.startsWith('n ') && t.includes('被闭包捕获')), '局部变量 n 被标记为被闭包捕获，实得 ' + JSON.stringify(capTxt));
  assert(capTxt.some((t) => t.startsWith('k ')), '参数 k 也被标记为被捕获，实得 ' + JSON.stringify(capTxt));
  const upvRows = await page.$$eval('#cx-upv-table tbody tr', (rs) => rs.map((r) => Array.from(r.cells).map((c) => c.textContent.trim())));
  const tickRow = upvRows.find((r) => r[0] === 'tick');
  assert(tickRow && tickRow[1] === '1' && tickRow[2].includes('捕获外层槽位'), 'tick 有 1 个上值且来自捕获外层槽位，实得 ' + JSON.stringify(upvRows));
  const refKinds = await page.$$eval('#cx-refs tbody tr', (rs) => rs.map((r) => r.cells[1].textContent.trim() + ':' + r.cells[2].textContent.trim()));
  // tick 里 n 出现三次：n = n + 1 的读与写、return n 的读；三处都必须解析成上值，一处都不许落成局部或全局
  const nRefs = refKinds.filter((k) => k.startsWith('n:'));
  assert(nRefs.length === 3 && nRefs.every((k) => k === 'n:上值'),
    'tick 里对 n 的三处引用（读/写/读）全部解析成上值，实得 ' + JSON.stringify(nRefs));
  assert(refKinds.some((k) => k === 'makeCounter:全局'), 'makeCounter 解析成全局');

  // 字节码面板：tick 里应出现 GET_UPVAL / SET_UPVAL，makeCounter 里应有 CLOSURE 捕获局部
  await onTab('code');
  const fnNames = await page.$$eval('#cx-fnsel option', (os) => os.map((o) => o.textContent.trim()));
  assert(fnNames.some((n) => n.startsWith('<脚本>')) && fnNames.some((n) => n.startsWith('tick')), '函数下拉列出脚本与各函数，实得 ' + JSON.stringify(fnNames));
  const pickFn = async (prefix) => {
    const idx = await page.$$eval('#cx-fnsel option', (os, p) => os.findIndex((o) => o.textContent.trim().startsWith(p)), prefix);
    assert(idx >= 0, '函数下拉里有 ' + prefix);
    await page.selectOption('#cx-fnsel', String(idx));
    await page.waitForFunction((i) => document.querySelector('#cx-fnsel').value === String(i), idx);
    return page.$$eval('#cx-code-table tbody tr', (rs) => rs.map((r) => Array.from(r.cells).map((c) => c.textContent.trim())));
  };
  const tickCode = await pickFn('tick');
  const tickOps = tickCode.map((r) => r[2]);
  assert(tickOps.includes('GET_UPVAL') && tickOps.includes('SET_UPVAL'), 'tick 的字节码里读写的是上值而不是局部，实得 ' + JSON.stringify(tickOps));
  assert(!tickOps.includes('GET_GLOBAL'), 'tick 里不该出现按名字查全局');
  const mkCode = await pickFn('makeCounter');
  const closureRow = mkCode.find((r) => r[2] === 'CLOSURE');
  assert(closureRow && closureRow[4].includes('捕获局部'), 'makeCounter 里的 CLOSURE 指令带「捕获局部」的上值描述，实得 ' + JSON.stringify(closureRow));

  /* ═════════ 6. 优化：指令数真的少了，且结果不变 ═════════ */
  await useSample('optimize');
  out = await console_();
  assert(out.trim() === '86400 / mini v1 / true / 86400', '优化后程序输出仍然正确，实得 ' + JSON.stringify(out));
  await onTab('code');
  const insRaw = +(await txt('#cx-ins-raw')), insOpt = +(await txt('#cx-ins-opt'));
  assert(insRaw === 74 && insOpt === 37, '优化前后指令数 74 → 37，实得 ' + insRaw + ' → ' + insOpt);
  const optKinds = await page.$$eval('#cx-opt-table tbody tr', (rs) => rs.map((r) => r.cells[1].textContent.trim()));
  for (const k of ['常量折叠', '短路化简', '分支消除', '死循环体消除', '不可达代码']) {
    assert(optKinds.includes(k), '优化摘要里有「' + k + '」，实得 ' + JSON.stringify([...new Set(optKinds)]));
  }
  const folded = await page.$$eval('#cx-const-table tbody tr', (rs) => rs.map((r) => r.cells[2].textContent.trim()));
  assert(folded.includes('86400'), '60*60*24 已在编译期折叠进常量池（86400），实得 ' + JSON.stringify(folded));
  assert(folded.includes('"mini v1"'), '字符串常量也被折叠成 "mini v1"，实得 ' + JSON.stringify(folded));

  // 关闭优化 → 指令变多、常量池里不再有 86400、输出不变
  await page.uncheck('#cx-opt');
  await page.waitForFunction(() => document.querySelector('#cx-ins-now') !== null && document.querySelector('#cx-ins-now').textContent.trim() === '74', null, { timeout: 10000 });
  const foldedOff = await page.$$eval('#cx-const-table tbody tr', (rs) => rs.map((r) => r.cells[2].textContent.trim()));
  assert(!foldedOff.includes('86400'), '关掉优化后常量池里不再有折叠好的 86400，实得 ' + JSON.stringify(foldedOff));
  await page.click('#cx-run');
  await onTab('out');
  assert((await console_()).trim() === '86400 / mini v1 / true / 86400', '关掉优化后运行结果与优化版逐字一致');
  await page.check('#cx-opt');
  await page.waitForFunction(() => +document.body.dataset.build > 0);

  /* ═════════ 7. 运行时错误：调用栈回溯 ═════════ */
  await useSample('error');
  out = await console_();
  assert(out.includes('开始'), '错误前的输出保留下来了');
  assert(out.includes('数组下标越界：5（长度 3）'), '越界错误信息带下标与长度，实得 ' + JSON.stringify(out));
  assert(/在 third 第 2 行/.test(out) && /被 second 第 3 行 调用/.test(out) && /被 first 第 4 行 调用/.test(out),
    '运行时错误带 third ← second ← first 的调用栈回溯，实得 ' + JSON.stringify(out));
  assert(!out.includes('这一行不会被执行'), '出错后停止执行');
  assert((await pill('run')).includes('运行时错误'), '运行徽标转为错误态');

  /* ═════════ 8. 语法/语义错误：诊断表 + 发布闸 ═════════ */
  await setSrc('let a = 1\nlet b = zzz;\nfn f() { let unused = 3; return 1; }\n');
  const diags = await page.$$eval('#cx-diag li', (ls) => ls.map((l) => l.textContent.replace(/\s+/g, ' ').trim()));
  assert(diags.some((d) => d.includes('2:1') && d.includes('期望 “;”')), '缺分号报在下一行行首并说明期望，实得 ' + JSON.stringify(diags));
  assert(diags.some((d) => d.includes('未定义的变量 “zzz”')), '未定义变量被静态查出，实得 ' + JSON.stringify(diags));
  assert(diags.some((d) => d.includes('unused') && d.includes('从未被读取')), '未读取的局部变量给出警告，实得 ' + JSON.stringify(diags));
  assert(await page.isDisabled('#cx-run') && await page.isDisabled('#cx-debug'), '有错误时运行/调试按钮被禁用（发布闸）');

  /* ═════════ 9. 调试器：断点 → 暂停 → 读局部变量 → 继续 ═════════ */
  const dbgSrc = [
    'fn addAll(xs) {',
    '  let total = 0;',
    '  for (let i = 0; i < len(xs); i = i + 1) {',
    '    total = total + xs[i];',
    '  }',
    '  return total;',
    '}',
    'let data = [5, 7, 9];',
    'let sum = addAll(data);',
    'print("sum=" + str(sum));'
  ].join('\n');
  await setSrc(dbgSrc);
  assert(!(await page.isDisabled('#cx-run')), '改成合法程序后运行按钮恢复可用');
  await page.click('#cx-run');
  assert((await console_()).includes('sum=21'), '5+7+9=21，实得 ' + JSON.stringify(await console_()));

  await page.click('.cx-gl[data-line="4"]');
  await page.waitForSelector('.cx-gl[data-line="4"].cx-gl-on');
  await page.click('#cx-debug');
  await page.waitForFunction(() => !document.getElementById('cx-panel-dbg').hidden);
  assert((await txt('#cx-dbg-state')).includes('已暂停'), '开始调试后进入暂停态，实得 ' + await txt('#cx-dbg-state'));

  const locals = async () => page.$$eval('#cx-locals tbody tr', (rs) => rs.map((r) => Array.from(r.cells).map((c) => c.textContent.trim())));
  const waitPausedAt = async (line) =>
    page.waitForFunction((l) => (document.getElementById('cx-dbg-state').textContent || '').includes('已暂停 · 第 ' + l + ' 行'), line, { timeout: 15000 });

  await page.click('#cx-cont');
  await waitPausedAt(4);
  let lv = await locals();
  const cell = (rows, name) => { const r = rows.find((x) => x[1] === name); return r ? r[2] : null; };
  assert(cell(lv, 'xs') === '[5, 7, 9]', '第一次命中断点时参数 xs=[5, 7, 9]，实得 ' + JSON.stringify(lv));
  assert(cell(lv, 'total') === '0', '第一次命中断点时 total=0，实得 ' + JSON.stringify(lv));
  assert(cell(lv, 'i') === '0', '第一次命中断点时 i=0，实得 ' + JSON.stringify(lv));
  const frames = await page.$$eval('#cx-frames .cx-frame', (bs) => bs.map((b) => b.textContent.trim()));
  assert(frames.length === 2 && frames[0].includes('addAll'), '调用栈两帧且栈顶是 addAll，实得 ' + JSON.stringify(frames));
  assert((await txt('#cx-dbg-ins')).startsWith('addAll @'), '当前指令来自 addAll，实得 ' + await txt('#cx-dbg-ins'));

  await page.click('#cx-cont');
  await waitPausedAt(4);
  lv = await locals();
  assert(cell(lv, 'total') === '5' && cell(lv, 'i') === '1', '第二次命中断点时 total=5、i=1（循环真的推进了），实得 ' + JSON.stringify(lv));

  // 单步：指令指针要动
  const insBefore = await txt('#cx-dbg-ins');
  await page.click('#cx-step');
  await page.waitForFunction((b) => document.getElementById('cx-dbg-ins').textContent.trim() !== b, insBefore, { timeout: 10000 });
  // 步过一行：离开第 4 行
  await page.click('#cx-stepline');
  await page.waitForFunction(() => !(document.getElementById('cx-dbg-state').textContent || '').includes('第 4 行'), null, { timeout: 10000 });
  const st4 = await txt('#cx-dbg-state');
  assert(/已暂停 · 第 [356] 行/.test(st4), '步过一行后停在第 3/5/6 行之一，实得 ' + st4);

  // 去掉断点后继续 → 直接跑完
  await page.click('.cx-gl[data-line="4"]');
  await page.click('#cx-cont');
  await page.waitForFunction(() => (document.getElementById('cx-dbg-state').textContent || '').includes('已结束'), null, { timeout: 15000 });
  assert((await txt('#cx-dbg-out')).includes('sum=21'), '调试跑到结束也输出 sum=21');
  const globals = await page.$$eval('#cx-globals tbody tr', (rs) => rs.map((r) => r.cells[0].textContent.trim() + '=' + r.cells[1].textContent.trim()));
  assert(globals.includes('sum=21') && globals.includes('data=[5, 7, 9]'), '全局变量表读数正确，实得 ' + JSON.stringify(globals));
  await page.click('#cx-stop');

  /* ═════════ 10. 词元面板 ═════════ */
  await onTab('tok');
  const toks = await page.$$eval('#cx-tok-table tbody tr', (rs) => rs.map((r) => Array.from(r.cells).map((c) => c.textContent.trim())));
  assert(toks[0][1] === '1:1' && toks[0][2] === '关键字' && toks[0][3] === 'fn', '首个词元是第 1 行第 1 列的关键字 fn，实得 ' + JSON.stringify(toks[0]));
  const strTok = toks.find((t) => t[2] === '字符串');
  assert(strTok && strTok[4] === '"sum="', '字符串词元带解析后的字面量值，实得 ' + JSON.stringify(strTok));
  const numTok = toks.find((t) => t[3] === '9');
  assert(numTok && numTok[2] === '数字' && numTok[4] === '9', '数字词元的字面量值已解析成数值，实得 ' + JSON.stringify(numTok));

  /* ═════════ 11. 语法树：结构 + 折叠 + 零重叠守卫 ═════════ */
  await onTab('ast');
  const nodeCount = await page.$$eval('#cx-ast-svg .cx-node', (ns) => ns.length);
  assert(nodeCount > 30, '语法树画出了足够多的节点，实得 ' + nodeCount);
  const rootTxt = await page.$$eval('#cx-ast-svg .cx-node', (ns) => ns[0].textContent.trim());
  assert(rootTxt.includes('程序') && rootTxt.includes('4 条顶层语句'), '根节点是程序且顶层 4 条语句，实得 ' + JSON.stringify(rootTxt));

  // 守卫 A：任意两个节点盒不重叠（canvas 的 fillText 重叠问题在 SVG 里可被真断言拦住）
  const boxes = await page.$$eval('#cx-ast-svg .cx-node rect', (rs) => rs.map((r) => { const b = r.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; }));
  let overlaps = 0;
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j];
    if (a.x < b.x + b.w - 1 && b.x < a.x + a.w - 1 && a.y < b.y + b.h - 1 && b.y < a.y + a.h - 1) overlaps++;
  }
  assert(overlaps === 0, '语法树节点两两不重叠，实得 ' + overlaps + ' 对重叠');

  // 守卫 B：每个节点的文字盒都落在自己的节点盒内（窄格溢出族，2026-08-11）
  const escaped = await page.$$eval('#cx-ast-svg .cx-node', (ns) => {
    const bad = [];
    for (const g of ns) {
      const r = g.querySelector('rect').getBoundingClientRect();
      for (const t of g.querySelectorAll('text.cx-nk, text.cx-nd')) {
        const b = t.getBoundingClientRect();
        if (b.width === 0) continue;
        if (b.left < r.left - 1 || b.right > r.right + 1 || b.top < r.top - 1 || b.bottom > r.bottom + 1) bad.push(t.textContent + '@' + Math.round(b.width) + '/' + Math.round(r.width));
      }
    }
    return bad;
  });
  assert(escaped.length === 0, '节点里的文字没有溢出节点盒，实得 ' + JSON.stringify(escaped.slice(0, 5)));

  // 折叠交互
  await page.click('#cx-ast-fold');
  await page.waitForFunction((n) => document.querySelectorAll('#cx-ast-svg .cx-node').length < n, nodeCount, { timeout: 10000 });
  const folded2 = await page.$$eval('#cx-ast-svg .cx-node', (ns) => ns.length);
  assert(folded2 < nodeCount, '折到两层后可见节点变少：' + nodeCount + ' → ' + folded2);
  assert((await txt('#cx-ast-count')).includes('共 ' + nodeCount), '计数条给出「显示 N / 共 M」，实得 ' + await txt('#cx-ast-count'));
  await page.click('#cx-ast-expand');
  await page.waitForFunction((n) => document.querySelectorAll('#cx-ast-svg .cx-node').length === n, nodeCount, { timeout: 10000 });

  /* ═════════ 12. 片段库（localStorage） ═════════ */
  await page.fill('#cx-snipname', '我的求和');
  await page.click('#cx-save');
  await page.waitForFunction(() => document.querySelectorAll('#cx-snips option').length === 2, null, { timeout: 10000 });
  await setSrc('print("换掉了");\n');
  await page.selectOption('#cx-snips', '0');
  await page.waitForFunction(() => document.querySelector('#cx-src').value.includes('addAll'), null, { timeout: 10000 });
  assert((await page.inputValue('#cx-src')).includes('fn addAll(xs)'), '从片段库取回了保存的源码');

  /* ═════════ 13. 编辑器：着色 + 行号对齐 ═════════ */
  const kwCount = await page.$$eval('#cx-hl .cx-k', (ns) => ns.length);
  assert(kwCount >= 5, '关键字被着色，实得 ' + kwCount + ' 处');
  const kwColor = await page.$eval('#cx-hl .cx-k', (n) => getComputedStyle(n).color);
  assert(kwColor === 'rgb(179, 71, 0)', '关键字用的是 Cursor 暖橙系着色，实得 ' + kwColor);
  const align = await page.evaluate(() => {
    const a = document.querySelector('#cx-hl .cx-line[data-line="5"]').getBoundingClientRect();
    const b = document.querySelector('#cx-gutter .cx-gl[data-line="5"]').getBoundingClientRect();
    return { d: Math.abs(a.top - b.top), h: a.height, gh: b.height };
  });
  assert(align.d <= 2, '高亮层与行号栏第 5 行纵向对齐（差 ' + align.d.toFixed(1) + 'px）');
  assert(Math.abs(align.h - 21) < 1.5 && Math.abs(align.gh - 21) < 1.5, '行高一致为 21px，实得 ' + JSON.stringify(align));

  /* ═════════ 14. 守卫：隐藏面板 / 控件塌缩 / 排版 ═════════ */
  // 隐藏面板必须计算样式为 none（[hidden] 被作者 CSS 压掉是本站结构性陷阱）
  const hiddenOk = await page.evaluate(() => {
    const names = ['out', 'tok', 'ast', 'scope', 'code', 'dbg'];
    const shown = names.filter((n) => !document.getElementById('cx-panel-' + n).hidden);
    const bad = names.filter((n) => document.getElementById('cx-panel-' + n).hidden &&
      getComputedStyle(document.getElementById('cx-panel-' + n)).display !== 'none');
    return { shown: shown.length, bad };
  });
  assert(hiddenOk.shown === 1 && hiddenOk.bad.length === 0, '同时只显示一个面板且隐藏面板计算样式为 none，实得 ' + JSON.stringify(hiddenOk));

  // 逐个面板扫控件尺寸（藏起来的控件对尺寸守卫失明，2026-08-09）
  let scanned = 0;
  for (const t of ['out', 'tok', 'ast', 'scope', 'code', 'dbg']) {
    await onTab(t);
    const bad = await page.evaluate(() => {
      const out = [];
      let n = 0;
      for (const el of document.querySelectorAll('input, select, button')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        n++;
        const tag = el.tagName.toLowerCase();
        const isCheck = tag === 'input' && el.type === 'checkbox';
        const minW = isCheck ? 18 : (tag === 'button' ? 52 : 100);
        const minH = 18;
        if (r.width < minW - 0.5 || r.height < minH - 0.5) out.push(tag + '#' + (el.id || el.className) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
      }
      return { out, n };
    });
    scanned += bad.n;
    assert(bad.out.length === 0, t + ' 面板下没有被压塌的控件，实得 ' + JSON.stringify(bad.out));
  }
  assert(scanned > 60, '尺寸守卫累计扫到足够多的控件（防止一个都没扫到也算绿），实得 ' + scanned);

  // 行号栏（不是 button，单独按尺寸判）
  const glBox = await page.$eval('#cx-gutter .cx-gl[data-line="1"]', (n) => { const r = n.getBoundingClientRect(); return [r.width, r.height]; });
  assert(glBox[0] >= 34 && glBox[1] >= 18, '行号/断点栏可点区域够大，实得 ' + JSON.stringify(glBox));

  // 单位符号不被 uppercase 改写（2026-08-06/08-08 同族）
  const shouty = await page.$$eval('th, dt, label', (ns) => ns.map((n) => n.textContent.trim()).filter((t) => /\b(HZ|KHZ|DBFS|DB)\b/.test(t)));
  assert(shouty.length === 0, '表头/标签里没有被 uppercase 改写坏的单位符号，实得 ' + JSON.stringify(shouty));

  // 页面本体不横向溢出
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert(overflow <= 1, '页面没有横向溢出，实得 ' + overflow + 'px');

  // 说明卡里的代码块不能撑出卡片（窄容器 + 变长文本，同 2026-08-11 溢出族）
  const preOver = await page.$$eval('.cx-card pre', (ps) => ps.map((p) => p.scrollWidth - p.clientWidth).filter((d) => d > 2));
  assert(preOver.length === 0, '语言速查代码块没有横向撑破卡片，实得溢出 ' + JSON.stringify(preOver) + 'px');

  /* ═════════ 15. 收尾：定格在闭包示例的语法树上截图 ═════════ */
  await useSample('closure');
  await onTab('ast');
  await page.waitForFunction(() => document.querySelectorAll('#cx-ast-svg .cx-node').length > 50);
  // 语法树容器已自动横向居中到根节点：断言根节点确实落在可视区里（不是滚在视野外）
  const rootVisible = await page.evaluate(() => {
    const wrap = document.querySelector('.cx-astwrap');
    const g = document.querySelector('#cx-ast-svg .cx-node rect');
    const a = wrap.getBoundingClientRect(), b = g.getBoundingClientRect();
    return b.left >= a.left - 1 && b.right <= a.right + 1 && b.top >= a.top - 1;
  });
  assert(rootVisible, '打开语法树时根节点完整落在可视区内（容器已居中到根）');
  // 按元素位置定滚动（不写死像素），让流水线徽标正好落在吸顶栏下方，缩略图里不会切出半行字
  await page.evaluate(() => {
    const y = document.querySelector('#cx-pipe').getBoundingClientRect().top + window.scrollY - 64 - 14;
    window.scrollTo(0, Math.max(0, y));
  });
  await page.waitForTimeout(120); // 等 hover/过渡 settle 再截图
  await screenshot('thumb.png');
};
