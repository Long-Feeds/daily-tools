// Git 内核实验室 · Git Lab —— 真实浏览器集成测试
// 断言的是「引擎真的是 git」：在浏览器里敲出来的对象 id 必须与本机 git CLI 事先算好的逐字节相同
// （blob / tree / commit / 合并冲突文件内容 / rebase 后的新哈希），而不只是元素存在。
// 并带上历史踩过的守卫：隐藏面板计算样式、逐面板控件塌缩、子元素不越出格子、
// <pre> 不横向截断、th/label 不被 uppercase 改写单位、SVG 图元不越界、localStorage 往返。
export default async ({ page, toolURL, screenshot, assert }) => {
  await page.goto(toolURL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 30000 });

  const txt = async (sel) => (await page.textContent(sel)).trim();
  const cmds = () => page.evaluate(() => +document.body.dataset.cmds);
  // 敲一条命令：正向等待命令计数前进（不用「≠ 旧值」当条件，2026-08-10 教训）
  const sh = async (cmd) => {
    const before = await cmds();
    await page.fill('#gl-term-in', cmd);
    await page.press('#gl-term-in', 'Enter');
    await page.waitForFunction((b) => +document.body.dataset.cmds > b, before, { timeout: 20000 });
    return txt('#gl-term-out');
  };
  // 切面板助手：藏在别的面板里的控件对 fill/click 不可见（Playwright 会卡满超时，2026-08-09 教训）
  const onTab = async (name, fn) => {
    await page.click('#gl-tab-' + name);
    await page.waitForFunction((n) => !document.getElementById('gl-p-' + n).hidden, name, { timeout: 10000 });
    return fn ? await fn() : null;
  };
  const listText = async (sel) => (await page.$$eval(sel + ' .gl-file', (els) => els.map((e) => e.textContent.trim())));

  assert(await page.isVisible('a[href="../../"]'), '顶部有返回工具集链接');

  /* ═════════ 1. 与真 git 的定值对拍表（页面自己现算） ═════════ */
  await onTab('obj');
  const verdicts = await page.$$eval('[data-verify]', (els) => els.map((e) => e.getAttribute('data-verify')));
  assert(verdicts.length === 6, '对拍表有 6 条固定值，实得 ' + verdicts.length);
  assert(verdicts.every((v) => v === 'ok'), '6 条全部与本机 git 的答案一致，实得 ' + verdicts.join(','));
  const verifyText = await txt('#gl-verify-table');
  assert(verifyText.includes('ce013625030ba8dba906f756967f9e9ca394464a'), '对拍表里是真 git 的 hello blob 哈希');
  assert(verifyText.includes('4b825dc642cb6eb9a060e54bf8d69288fbee4904'), '对拍表里是真 git 的空树哈希');

  /* ═════════ 2. 在浏览器里重放一遍真 git 跑过的场景，逐个哈希对拍 ═════════ */
  await page.click('[data-scenario="areas"]');       // 场景会把沙盒重置成全新空仓库
  await page.waitForFunction(() => +document.body.dataset.cmds >= 0);
  await onTab('work');
  await sh('git init -b main');
  await sh('echo "# Git Lab\\n\\n一个学习 git 的沙盒。" > README.md');
  await sh('echo "export function add(a, b) {\\n  return a + b\\n}" > src/math.js');
  await sh('echo "hello" > doc/note.txt');
  await sh('git add .');
  let out = await sh('git commit -m "init: 项目骨架"');
  assert(out.includes('95f47c9'), '第一个提交的短哈希与真 git 一致（95f47c9），实得 ' + out.slice(-260));
  out = await sh('git rev-parse HEAD');
  assert(out.includes('95f47c92243961b5dd5270c44ae120d3ed3cd09b'),
    '提交对象 id 与本机 git 逐字节一致，实得 ' + out.slice(-120));
  out = await sh('git rev-parse HEAD^{tree}');
  assert(out.includes('1ea7f2017eb1daa987af2e1a49f2328e776b40e8'), '根树 id 与真 git 一致');
  out = await sh('git rev-parse HEAD:src');
  assert(out.includes('f59256d240c8e4ab93b468148c976b7aadc5220e'), '子目录 src 的树 id 与真 git 一致');
  out = await sh('git rev-parse HEAD:README.md');
  assert(out.includes('31442efbe5d89ecfca84e02623cf904336f2ce7b'), 'README.md 的 blob id 与真 git 一致');
  out = await sh('git cat-file -p HEAD:doc/note.txt');
  assert(out.trim().endsWith('hello'), 'cat-file 读回 blob 原文，实得 ' + JSON.stringify(out.slice(-40)));
  out = await sh('git cat-file -p doc/note.txt');
  assert(out.includes('是工作区里的一个文件路径') && out.includes('git cat-file -p HEAD:doc/note.txt'),
    '把工作区路径当对象传时给出可照抄的正确写法，实得 ' + out.slice(-120));
  out = await sh('git cat-file -t HEAD^{tree}');
  assert(out.trim().endsWith('tree'), 'cat-file -t 认出树对象');

  // 第二个提交也要对得上（说明父提交/时间戳的序列化也是对的）
  await sh('echo "export function add(a, b) {\\n  return a + b\\n}\\n\\nexport function mul(a, b) {\\n  return a * b\\n}" > src/math.js');
  await sh('git add src/math.js');
  await sh('git commit -m "feat: 加个乘法"');
  out = await sh('git rev-parse HEAD');
  assert(out.includes('2620084d5e79731e8a8b89189712d27199a6b365'), '第二个提交 id 与真 git 一致（含 parent 行），实得 ' + out.slice(-120));

  /* ═════════ 3. 三个区域的语义：提交的是索引，不是工作区 ═════════ */
  await sh('echo "临时改动，不要提交" > src/math.js');
  let work = await listText('#gl-work-list');
  assert(work.some((t) => t.includes('src/math.js') && t.includes('已修改')), '改过的文件在工作区列显示「已修改」，实得 ' + JSON.stringify(work));
  let index = await listText('#gl-index-list');
  assert(index.some((t) => t.includes('src/math.js')), '索引里仍是旧内容');
  out = await sh('git status');
  assert(out.includes('尚未暂存以备提交的变更'), 'status 指出有未暂存的改动');
  out = await sh('git diff');
  assert(out.includes('+临时改动，不要提交'), 'git diff（工作区↔索引）显示新增行，实得 ' + out.slice(-160));
  out = await sh('git diff --staged');
  assert(out.includes('（没有差异）') || !out.includes('临时改动'), 'git diff --staged 不该看到未暂存的改动');
  await sh('git restore src/math.js');
  work = await listText('#gl-work-list');
  assert(!work.some((t) => t.includes('src/math.js') && t.includes('已修改')), 'restore 之后工作区回到索引的内容');

  /* ═════════ 4. 分支 / 冲突 / 三方合并：文件内容与真 git 逐字节一致 ═════════ */
  await sh('git switch -c feature HEAD~1');
  out = await sh('git rev-parse HEAD');
  assert(out.includes('95f47c92243961b5dd5270c44ae120d3ed3cd09b'), 'HEAD~1 解析正确，回到第一个提交');
  await sh('echo "export function add(a, b) {\\n  return a + b\\n}\\n\\nexport function sub(a, b) {\\n  return a - b\\n}" > src/math.js');
  await sh('git add src/math.js');
  await sh('git commit -m "feat: 加个减法"');
  out = await sh('git rev-parse HEAD');
  assert(out.includes('6307b7e59e7a9ccec1f9e9423c5491a954875d74'), '分支上的提交 id 也与真 git 一致');
  await sh('git switch main');
  out = await sh('git merge-base main feature');
  assert(out.includes('95f47c92243961b5dd5270c44ae120d3ed3cd09b'), 'merge-base 找到共同祖先');
  out = await sh('git merge feature');
  assert(out.includes('自动合并失败'), '同一处两边都改 -> 冲突，实得 ' + out.slice(-200));

  const conflictBody = await page.evaluate(() => {
    document.querySelectorAll('#gl-work-list .gl-file-name').forEach((b) => { if (b.textContent === 'src/math.js') b.click(); });
    return document.getElementById('gl-edit-body').value;
  });
  const wantConflict = 'export function add(a, b) {\n  return a + b\n}\n\n<<<<<<< HEAD\nexport function mul(a, b) {\n  return a * b\n=======\nexport function sub(a, b) {\n  return a - b\n>>>>>>> feature\n}\n';
  assert(conflictBody === wantConflict, '冲突文件内容与真 git merge 输出逐字节一致，实得 ' + JSON.stringify(conflictBody));

  out = await sh('git ls-files --stage');
  assert(out.includes('06047664e37809f466f10c4b38a28fb8b2ff2c87 1'), '索引阶段 1 = 共同祖先的 blob（与真 git 一致）');
  assert(out.includes('b68010625532c10298fed1a29df04bb81b069ed6 2'), '索引阶段 2 = 我方 blob');
  assert(out.includes('241be4f120264683d618a29e66e06b759ec79a0e 3'), '索引阶段 3 = 对方 blob');
  index = await listText('#gl-index-list');
  assert(index.filter((t) => t.includes('阶段')).length === 3, '索引面板显示 3 条阶段记录，实得 ' + JSON.stringify(index));

  const cbVisible = await page.evaluate(() => {
    const el = document.getElementById('gl-conflict-box');
    return { hidden: el.hidden, display: getComputedStyle(el).display };
  });
  assert(cbVisible.hidden === false && cbVisible.display !== 'none', '冲突提示条真的显示出来了（不只是属性），实得 ' + JSON.stringify(cbVisible));

  // 解决冲突：手工写回合并后的内容（真实用户路径）
  await page.fill('#gl-edit-body', 'export function add(a, b) {\n  return a + b\n}\n\nexport function mul(a, b) {\n  return a * b\n}\n\nexport function sub(a, b) {\n  return a - b\n}\n');
  const before = await cmds();
  await page.click('#gl-edit-stage');
  await page.waitForFunction((b) => +document.body.dataset.cmds > b, before, { timeout: 20000 });
  const cbAfter = await page.evaluate(() => {
    const el = document.getElementById('gl-conflict-box');
    return { hidden: el.hidden, display: getComputedStyle(el).display };
  });
  assert(cbAfter.hidden === true && cbAfter.display === 'none', 'add 之后冲突条被真正藏起来（计算样式也是 none），实得 ' + JSON.stringify(cbAfter));
  await sh('git commit -m "merge: feature 进 main"');
  out = await sh('git rev-parse HEAD');
  // 期望值来自本机 git commit-tree（沙盒的虚拟时钟此刻是 1755111600，故用该时间戳算的真值）：
  //   git commit-tree 21562721… -p 2620084d… -p 6307b7e6… -m "merge: feature 进 main" -> 9a3e3a66…
  assert(out.includes('9a3e3a66fcce4d5762e502ba517c18135108d152'), '合并提交 id 与真 git commit-tree 一致（两个 parent 行的顺序也对），实得 ' + out.slice(-120));

  /* ═════════ 5. 提交图：结构、HEAD 标签、合并节点 ═════════ */
  await onTab('graph');
  const rows = await page.$$('.gl-grow');
  assert(rows.length === 4, '提交图有 4 个提交（3 个普通 + 1 个合并），实得 ' + rows.length);
  const headPills = await page.$$eval('.gl-ref-head', (els) => els.map((e) => e.textContent));
  assert(headPills.length === 1 && headPills[0].includes('HEAD → main'), 'HEAD 标签只有一个且指向 main，实得 ' + JSON.stringify(headPills));
  await page.click('.gl-grow');       // 最新的一行 = 合并提交
  const commitBody = await txt('#gl-commit-body');
  assert(commitBody.includes('2620084') && commitBody.includes('6307b7e'), '合并提交详情列出两个父提交，实得 ' + commitBody.slice(0, 200));
  assert(commitBody.includes('21562721ff880c0f82a5aebefc160671efaf4ee7'), '合并后的树 id 与真 git 一致');
  const graphGeom = await page.evaluate(() => {
    const svg = document.querySelector('.gl-graph-svg').getBoundingClientRect();
    const circles = [...document.querySelectorAll('.gl-graph-svg circle')].map((c) => c.getBoundingClientRect());
    const firstOid = document.querySelector('.gl-grow .gl-oid').getBoundingClientRect();
    const rowsR = [...document.querySelectorAll('.gl-grow')].map((r) => r.getBoundingClientRect());
    return {
      circles: circles.length,
      inside: circles.every((c) => c.left >= svg.left - 1 && c.right <= svg.right + 1 && c.top >= svg.top - 1 && c.bottom <= svg.bottom + 1),
      textClear: firstOid.left >= svg.right - 1,
      overlap: rowsR.some((a, i) => rowsR.some((b, j) => j > i && a.bottom > b.top + 1 && a.top < b.bottom - 1)),
    };
  });
  assert(graphGeom.circles === 4, '每个提交画一个节点，实得 ' + graphGeom.circles);
  assert(graphGeom.inside, '所有节点圆点都落在 SVG 画布内（没被裁掉）');
  assert(graphGeom.textClear, '提交文字排在图形轨道右侧，不与连线重叠');
  assert(!graphGeom.overlap, '提交行两两不重叠');

  /* ═════════ 6. 对象库：剖面显示「类型 长度 NUL 内容」 ═════════ */
  await onTab('obj');
  const objCount = await txt('#gl-obj-count');
  assert(/\d+ 个对象/.test(objCount), '对象库统计出对象数，实得 ' + objCount);
  await page.click('.gl-objfilter[data-type="tree"]');
  const treeRows = await page.$$eval('#gl-obj-table tbody tr td:first-child', (els) => els.map((e) => e.textContent.trim()));
  assert(treeRows.length > 0 && treeRows.every((t) => t === 'tree'), '按 tree 过滤后只剩树对象，实得 ' + JSON.stringify(treeRows));
  await page.click('#gl-obj-table tbody tr td:nth-child(2) button');
  const raw = await txt('#gl-obj-raw');
  assert(raw.startsWith('tree ') && raw.includes('[NUL]'), '对象剖面按 「类型 长度 NUL 内容」 展示，实得 ' + JSON.stringify(raw.slice(0, 40)));
  const parsed = await txt('#gl-obj-parsed');
  assert(parsed.includes('040000') || parsed.includes('100644'), '树对象解析出模式位，实得 ' + parsed.slice(0, 80));
  await page.click('.gl-objfilter[data-type="blob"]');
  await page.click('#gl-obj-table tbody tr td:nth-child(2) button');
  const rawBlob = await txt('#gl-obj-raw');
  assert(rawBlob.startsWith('blob '), 'blob 剖面头部是 blob + 字节数，实得 ' + JSON.stringify(rawBlob.slice(0, 20)));
  assert(rawBlob.trim().length > 20 && /[0-9a-f]{40}/.test(rawBlob), '剖面末尾给出这串字节的 SHA-1');

  /* ═════════ 7. 差异面板：两侧任选 ═════════ */
  await onTab('diff');
  await page.selectOption('#gl-diff-left', 'HEAD');
  await page.selectOption('#gl-diff-right', 'work');
  await page.click('#gl-diff-run');
  let diffOut = await txt('#gl-diff-out');
  assert(diffOut.includes('（没有差异）'), '刚提交完，HEAD 与工作区应当没有差异，实得 ' + diffOut.slice(0, 120));
  await onTab('work');
  await sh('echo "新加的一行" >> README.md');
  await onTab('diff');
  await page.click('#gl-diff-run');
  diffOut = await txt('#gl-diff-out');
  assert(diffOut.includes('+新加的一行') && diffOut.includes('@@'), '差异面板给出带 @@ 块头的统一 diff，实得 ' + diffOut.slice(0, 200));
  const stat = await txt('#gl-diff-stat');
  assert(/1 个文件 · \+\d+ \/ -\d+/.test(stat), '差异统计给出文件数与增删行数，实得 ' + stat);

  /* ═════════ 8. 教程场景：整套跑通且真的产生了对应结果 ═════════ */
  await page.click('[data-scenario="undo"]');
  await onTab('learn');
  const stepCount = await page.$$eval('.gl-step', (els) => els.length);
  assert(stepCount === 10, '「后悔药」场景有 10 步，实得 ' + stepCount);
  // 先走到第 6 步（reset --hard 之后）：那个提交应当已经没人指向了
  for (let i = 0; i < 6; i++) {
    const b = await cmds();
    await page.click('#gl-learn-next');
    await page.waitForFunction((x) => +document.body.dataset.cmds > x, b, { timeout: 20000 });
  }
  await onTab('graph');
  const lost = await page.$$eval('.gl-grow', (els) => els.filter((e) => e.querySelector('.gl-ref-dangling'))
    .map((e) => e.querySelector('.gl-oid').textContent));
  assert(lost.length === 1, 'reset --hard 之后恰好有一个提交变成悬空，实得 ' + JSON.stringify(lost));
  // 再跑完剩下的步骤：reflog 恢复应当把它接回来
  await onTab('learn');
  const beforeAll = await cmds();
  await page.click('#gl-learn-all');
  await page.waitForFunction((b) => +document.body.dataset.cmds >= b + 4, beforeAll, { timeout: 30000 });
  const termAll = await txt('#gl-term-out');
  assert(!/内部错误|不认识的命令|未知的版本/.test(termAll), '整套场景跑完没有报错，实得 ' + termAll.slice(-200));
  assert(termAll.includes('挪了分支指针 + 重置索引 + 覆盖工作区'), 'reset --hard 的解释真的输出了');
  assert(termAll.includes('Revert'), 'revert 生成了反向提交');
  const bar = await page.$eval('#gl-learn-bar', (e) => e.style.width);
  assert(bar === '100%', '进度条走到 100%，实得 ' + bar);
  await onTab('graph');
  const stillLost = await page.$$eval('.gl-grow', (els) => els.filter((e) => e.querySelector('.gl-ref-dangling'))
    .map((e) => e.querySelector('.gl-oid').textContent));
  assert(!stillLost.includes(lost[0]),
    '用 reflog reset 回去之后，刚才那个悬空提交（' + lost[0] + '）重新被引用到了，实得悬空表 ' + JSON.stringify(stillLost));

  /* ═════════ 9. 快照往返：刷新后仓库还在 ═════════ */
  await onTab('work');
  const headBefore = await txt('#gl-st-oid');
  await page.waitForTimeout(300);      // 让防抖的存档落盘
  await page.reload();
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 30000 });
  const headAfter = await txt('#gl-st-oid');
  assert(headAfter === headBefore && headAfter !== '—', '刷新后仓库从 localStorage 恢复，HEAD 一致（' + headBefore + ' vs ' + headAfter + '）');

  /* ═════════ 10. 守卫：隐藏面板 / 控件塌缩 / 越格 / 横向截断 / 大小写 ═════════ */
  const hiddenDisplay = await page.evaluate(() => getComputedStyle(document.getElementById('gl-p-graph')).display);
  assert(hiddenDisplay === 'none', '非当前面板的计算样式是 none（[hidden] 没被作者 CSS 压过），实得 ' + hiddenDisplay);

  let scanned = 0;
  for (const tab of ['work', 'graph', 'obj', 'diff', 'learn']) {
    await onTab(tab);
    const bad = await page.evaluate(() => {
      const out = [];
      let n = 0;
      for (const el of document.querySelectorAll('input,select,button,textarea')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;          // 不在当前面板
        n++;
        const isCheck = el.type === 'checkbox' || el.type === 'radio';
        const minW = isCheck ? 18 : (el.tagName === 'BUTTON' ? 52 : 100);
        if (r.width < minW || r.height < 18) out.push(el.id || el.className + '|' + el.textContent.slice(0, 10) + '|' + Math.round(r.width) + 'x' + Math.round(r.height));
      }
      return { out, n };
    });
    scanned += bad.n;
    assert(bad.out.length === 0, tab + ' 面板上没有塌缩的控件，实得 ' + JSON.stringify(bad.out));
  }
  assert(scanned >= 60, '五个面板累计扫到的可见控件足够多（防止一个都没扫到也算绿），实得 ' + scanned);

  await onTab('work');
  const overflow = await page.evaluate(() => {
    const bad = [];
    for (const li of document.querySelectorAll('.gl-file')) {
      const p = li.getBoundingClientRect();
      for (const c of li.children) {
        const r = c.getBoundingClientRect();
        if (r.right > p.right + 1 || r.left < p.left - 1) bad.push(c.textContent.slice(0, 16) + '@' + Math.round(r.right - p.right));
      }
    }
    return bad;
  });
  assert(overflow.length === 0, '文件行里的子元素没有溢出行盒（窄格文本越界守卫），实得 ' + JSON.stringify(overflow));

  const preCut = await page.evaluate(() => {
    const bad = [];
    for (const pre of document.querySelectorAll('pre')) {
      if (pre.getBoundingClientRect().width === 0) continue;
      if (pre.scrollWidth - pre.clientWidth > 2) bad.push(pre.id + ':' + (pre.scrollWidth - pre.clientWidth));
    }
    return bad;
  });
  assert(preCut.length === 0, '代码块没有被横向截断（内容自动折行），实得 ' + JSON.stringify(preCut));

  const upper = await page.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll('th,dt,label,.gl-area-h b,.gl-chip')) {
      if (getComputedStyle(el).textTransform === 'uppercase') bad.push(el.textContent.slice(0, 12));
    }
    return bad;
  });
  assert(upper.length === 0, '表头 / 标签没有被 uppercase 改写（单位与命令名会被写错），实得 ' + JSON.stringify(upper));

  const bodyScroll = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  assert(bodyScroll, '页面没有横向滚动条');

  /* ═════════ 11. 错误路径与窄屏 ═════════ */
  out = await sh('git frobnicate');
  assert(out.includes('还没实现'), '未知子命令给出明确提示，实得 ' + out.slice(-80));
  out = await sh('git cat-file -p 不存在的对象');
  assert(out.includes('未知的版本') || out.includes('对象不存在'), '未知版本报错，实得 ' + out.slice(-80));
  out = await sh('git branch -d main');
  assert(out.includes('不能删除当前所在的分支'), '删除当前分支被拦住，实得 ' + out.slice(-60));

  await page.setViewportSize({ width: 390, height: 900 });
  await page.waitForTimeout(120);
  const narrow = await page.evaluate(() => {
    const block = document.querySelector('.gl-term .gl-codeblock').getBoundingClientRect();
    const inRow = [...document.querySelectorAll('.gl-terminput > *')].map((el) => {
      const r = el.getBoundingClientRect();
      return { tag: el.tagName, ok: r.right <= block.right + 1 && r.left >= block.left - 1, w: Math.round(r.width) };
    });
    return {
      scroll: document.documentElement.scrollWidth <= window.innerWidth + 1,
      hero: document.querySelector('.gl-hero h1').getBoundingClientRect().width <= window.innerWidth,
      inRow,
    };
  });
  assert(narrow.scroll && narrow.hero, '390px 窄屏下没有横向溢出');
  assert(narrow.inRow.every((x) => x.ok), '390px 下终端输入行的每个控件都还在框内（不被裁掉），实得 ' + JSON.stringify(narrow.inRow));
  assert(narrow.inRow.some((x) => x.tag === 'INPUT' && x.w >= 100), '390px 下命令输入框仍有可用宽度，实得 ' + JSON.stringify(narrow.inRow));
  await page.setViewportSize({ width: 1280, height: 900 });

  /* ═════════ 缩略图 ═════════ */
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 30000 });
  await page.evaluate(() => { document.getElementById('gl-tab-graph').click(); window.scrollTo(0, 0); });
  await page.waitForTimeout(260);
  await screenshot('thumb.png');
};
