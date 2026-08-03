// 集成测试:幻灯片工坊 · Deck Studio
// 断言的是真实产物 —— Markdown 真的被解析成对应的 DOM(标题/列表/表格/待办/两栏/代码)、
// 分步真的隐藏与显现、备注真的没进正文、导出的 HTML 真的自包含且把注入内容转义掉、
// 文稿真的能在刷新后回来 —— 而不是「元素在不在」。
// 外加本站历次踩过的结构性守卫:[hidden] 断计算样式(07-20)、boundingRect 容器守卫(07-17)、
// 控件不被压塌(07-24)、窄屏零横向溢出、全程 waitForFunction 零定时读(07-06)。
export default async ({ page, toolURL, screenshot, assert }) => {
  const text = (sel) => page.$eval(sel, (el) => el.textContent.trim());
  const display = (sel) => page.$eval(sel, (el) => getComputedStyle(el).display);
  const rect = (sel) => page.$eval(sel, (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height, top: r.top, left: r.left, right: r.right, bottom: r.bottom };
  });
  const count = (sel) => page.$$eval(sel, (els) => els.length);
  const stats = () => page.evaluate(() => window.DS.stats());
  const pos = () => page.evaluate(() => window.DS.pos());

  // 零定时读:等编译计数器前进(07-06 教训)
  const bump = async (fn) => {
    const before = await page.evaluate(() => document.body.dataset.compiles || '0');
    await fn();
    await page.waitForFunction((b) => (document.body.dataset.compiles || '0') !== b, before, { timeout: 20000 });
  };
  const setMD = (md) => bump(() => page.$eval('#ds-md', (el, v) => {
    el.value = v;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, md));

  await page.goto(toolURL, { waitUntil: 'load' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 20000 });

  // ── 1 · 外壳 ────────────────────────────────────────────────
  assert((await page.title()).includes('幻灯片工坊'), 'title names the tool');
  assert(await page.$('a.ds-back[href="../../"]'), 'back link to the hub exists');
  assert((await text('.ds-wordmark')).startsWith('Deck Studio'), 'wordmark rendered');

  // ── 2 · 示例文稿真的被编译成 6 页 8 步 ──────────────────────
  const s0 = await stats();
  assert(s0.slides === 6, `示例文稿编译出 6 页(得 ${s0.slides})`);
  assert(s0.steps === 8, `含分步共 8 步(得 ${s0.steps})`);
  assert((await text('#ds-stat-slides')) === '6', '页数徽标与编译结果一致');
  assert((await text('#ds-stat-steps')) === '8', '分步徽标与编译结果一致');
  assert((await count('#ds-thumbs .ds-thumb')) === 6, '缩略图轨渲染 6 张');
  assert(s0.words > 100, `字数统计有实数(得 ${s0.words})`);
  const secs = await page.evaluate(() => window.DS.deck().stats.seconds);
  const expectSecs = await page.evaluate(() => {
    const s = window.DS.deck().stats;
    return Math.round(s.cn / (220 / 60) + s.en / (150 / 60) + s.slides * 4);
  });
  assert(secs === expectSecs, '预计时长 = 中文 220 字/分 + 英文 150 词/分 + 每页 4s');
  assert(/^\d+:\d\d$/.test(await text('#ds-stat-time')), '时长按 m:ss 显示');

  // ── 3 · 首页渲染:版式 / 底色 / 标题真的落到 stage 上 ────────
  const stage = '#ds-scaler .ds-stage';
  assert((await page.$eval(stage, (e) => e.dataset.layout)) === 'title', '@layout title 生效');
  assert((await page.$eval(stage, (e) => e.dataset.bg)) === 'lavender', '@bg lavender 生效');
  assert((await text(stage + ' h1')) === '幻灯片工坊', '一级标题文本正确');
  assert((await count(stage + ' strong')) === 1, '**加粗** 渲染成 strong');
  const bg1 = await page.$eval(stage, (e) => getComputedStyle(e).backgroundColor);
  assert(bg1 === 'rgb(230, 224, 245)', `薰衣草底色落到真实计算样式(得 ${bg1})`);
  assert((await text('#ds-slidename')).startsWith('1. 幻灯片工坊'), '状态栏显示当前页名');
  assert((await display('#ds-warn')) === 'none', '干净文稿没有警告条(断计算样式)');

  // 备注:进了备注面板,没进正文
  assert((await text('#ds-notes')).includes('开场三句'), '演讲者备注渲染到备注面板');
  assert(!(await text(stage)).includes('开场三句'), '备注不出现在幻灯片正文里');

  // ── 4 · 分步:隐藏的步骤必须真的看不见(07-20 教训) ─────────
  await page.click('#ds-thumbs .ds-thumb[data-i="1"]');
  assert((await pos()).slide === 1, '点缩略图跳到第 2 页');
  assert((await count(stage + ' .ds-step')) === 3, '第 2 页有 3 个分步块');
  assert((await display(stage + ' .ds-step[data-step="1"]')) === 'none', '未到的步骤计算样式为 none');
  assert((await page.$eval(stage + ' .ds-step[data-step="1"]', (e) => e.hidden)) === true, 'hidden 属性同时为真');
  assert((await text('#ds-pageinfo')).includes('步 1/3'), '页脚显示步进进度');
  await page.keyboard.press('ArrowRight');
  assert((await pos()).step === 1, '方向键推进一步');
  assert((await display(stage + ' .ds-step[data-step="1"]')) !== 'none', '推进后该步骤真的显现');
  assert((await display(stage + ' .ds-step[data-step="2"]')) === 'none', '再后面的步骤仍然隐藏');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  assert((await pos()).slide === 2 && (await pos()).step === 0, '走完最后一步自动翻到下一页');
  await page.keyboard.press('ArrowLeft');
  assert((await pos()).slide === 1 && (await pos()).step === 2, '往回退落在上一页的最后一步');

  // ── 5 · 两栏 / 代码 / 表格 / 待办 ───────────────────────────
  await page.click('#ds-thumbs .ds-thumb[data-i="2"]');
  assert((await page.$eval(stage, (e) => e.dataset.layout)) === 'two-col', '+++ 页是 two-col 版式');
  assert((await count(stage + ' .ds-cols .ds-col')) === 2, '真的渲染出左右两栏');
  assert((await text(stage + ' .ds-col:nth-child(2) pre code')).includes('const deck'), '右栏是代码块');
  const colL = await rect(stage + ' .ds-col:nth-child(1)');
  const colR = await rect(stage + ' .ds-col:nth-child(2)');
  assert(colR.left > colL.right - 1, '两栏水平不重叠(左栏右边界 ≤ 右栏左边界)');

  await page.click('#ds-thumbs .ds-thumb[data-i="3"]');
  assert((await count(stage + ' table.ds-table th')) === 3, '表格 3 列表头');
  assert((await count(stage + ' table.ds-table tbody tr')) === 3, '表格 3 行数据');
  assert((await text(stage + ' table.ds-table tbody tr:nth-child(2) td:nth-child(2)')) === '--', '表格单元格内容正确');
  assert((await count(stage + ' li.ds-task')) === 2, '两条待办');
  assert((await count(stage + ' li.ds-task.is-done')) === 1, '其中一条是已完成态');
  const bgMint = await page.$eval(stage, (e) => getComputedStyle(e).backgroundColor);
  assert(bgMint === 'rgb(217, 243, 225)', `@bg mint 生效(得 ${bgMint})`);

  // ── 6 · 布局守卫:舞台不越界、控件没被压塌(07-17 / 07-24) ──
  const holder = await rect('#ds-holder');
  const scaler = await rect('#ds-scaler');
  assert(scaler.left >= holder.left - 1 && scaler.right <= holder.right + 1,
    `舞台横向落在容器内(scaler ${scaler.left.toFixed(0)}–${scaler.right.toFixed(0)} vs holder ${holder.left.toFixed(0)}–${holder.right.toFixed(0)})`);
  assert(scaler.w > 300 && scaler.h > 160, `舞台没有被压塌(${scaler.w.toFixed(0)}×${scaler.h.toFixed(0)})`);
  const flowR = await rect(stage + ' .ds-flow');
  const stageR = await rect(stage);
  assert(flowR.top >= stageR.top - 1 && flowR.bottom <= stageR.bottom + 1, '内容盒纵向不溢出版心');
  const thumbR = await rect('#ds-thumbs .ds-thumb');
  assert(thumbR.w > 100 && thumbR.h > 50, `缩略图有真实尺寸(${thumbR.w.toFixed(0)}×${thumbR.h.toFixed(0)})`);
  const mdR = await rect('#ds-md');
  assert(mdR.w > 200 && mdR.h > 200, '编辑器没有被压塌');

  // ── 7 · 自动缩放:内容再长也不溢出 ──────────────────────────
  const longMD = '# 很长的一页\n\n' + Array.from({ length: 16 }, (_, i) => `- 第 ${i + 1} 条要点,写得比较啰嗦一点用来把版心撑满`).join('\n');
  await setMD(longMD);
  const fit = await page.$eval(stage, (e) => parseFloat(e.dataset.fit));
  assert(fit < 1, `内容过长时自动缩小(fit=${fit})`);
  assert(fit >= 0.5, 'fit 有下限,不会缩到看不见');
  const f2 = await rect(stage + ' .ds-flow');
  const s2 = await rect(stage);
  assert(f2.bottom <= s2.bottom + 1, '缩放后内容仍在版心内(未溢出底边)');
  assert((await text('#ds-fitinfo')).includes('%'), '状态栏报出缩放比例');
  await setMD('# 短页\n\n一句话。');
  assert((await page.$eval(stage, (e) => parseFloat(e.dataset.fit))) === 1, '内容短时不缩放');

  // ── 8 · 安全:粘进来的 HTML 一律当文本 ──────────────────────
  await setMD('# 注入测试\n\n<img src=x onerror="window.__pwned=1">\n\n<script>window.__pwned=2<\/script>\n\n[点](javascript:window.__pwned=3)');
  assert((await count(stage + ' img')) === 0, '注入的 img 没有变成真元素');
  assert((await count(stage + ' script')) === 0, '注入的 script 没有变成真元素');
  assert((await text(stage)).includes('<img src=x onerror='), '注入内容原样显示为文本');
  assert((await page.$eval(stage + ' a', (e) => e.getAttribute('href'))) === '#', 'javascript: 链接被中和成 #');
  assert((await page.evaluate(() => window.__pwned)) === undefined, '没有任何注入脚本被执行');

  // ── 9 · 警告面板:未知指令 / 自动升级 two-col ───────────────
  await setMD('@layout wat\n@zzz 1\n\n# 有问题的页\n\n左\n\n+++\n\n右');
  assert((await display('#ds-warn')) !== 'none', '出现问题时警告条可见');
  assert((await count('#ds-warn li')) === 3, '三条提示:未知版式 + 未知指令 + 自动分栏');
  assert((await text('#ds-warn')).includes('@zzz'), '提示点名未知指令');
  assert((await page.$eval(stage, (e) => e.dataset.layout)) === 'two-col', '检测到 +++ 后自动切两栏');
  await setMD('# 干净\n\n没问题了。');
  assert((await display('#ds-warn')) === 'none', '问题修好后警告条真的收起(断计算样式)');

  // ── 10 · 空文稿兜底 ────────────────────────────────────────
  await setMD('');
  const sEmpty = await stats();
  assert(sEmpty.slides === 1 && sEmpty.words === 0, '空文稿给一张占位页,不炸');
  assert((await text(stage)).includes('还是空的'), '占位页有提示文案');

  // ── 11 · 主题 / 比例 ───────────────────────────────────────
  await setMD('# 主题测试\n\n正文一行。');
  await page.click('.ds-themebtn[data-theme="navy"]');
  const bgNavy = await page.$eval(stage, (e) => getComputedStyle(e).backgroundColor);
  assert(bgNavy === 'rgb(10, 21, 48)', `深空蓝主题落到真实底色(得 ${bgNavy})`);
  const inkNavy = await page.$eval(stage + ' h1', (e) => getComputedStyle(e).color);
  assert(inkNavy === 'rgb(255, 255, 255)', '深色主题下标题转白');
  assert((await page.$eval('.ds-themebtn[data-theme="navy"]', (e) => e.getAttribute('aria-pressed'))) === 'true', '主题按钮 aria-pressed 同步');
  await page.click('.ds-themebtn[data-theme="doc"]');
  assert((await page.$eval(stage, (e) => getComputedStyle(e).backgroundColor)) === 'rgb(255, 255, 255)', '切回文档白');

  const size169 = await page.$eval(stage, (e) => [e.style.width, e.style.height]);
  assert(size169[0] === '1280px' && size169[1] === '720px', '16:9 舞台为 1280×720');
  await page.click('[data-ratio="4:3"]');
  const size43 = await page.$eval(stage, (e) => [e.style.width, e.style.height]);
  assert(size43[0] === '960px' && size43[1] === '720px', '4:3 舞台为 960×720');
  const scaler43 = await rect('#ds-scaler');
  assert(Math.abs(scaler43.w / scaler43.h - 960 / 720) < 0.02, '缩放后仍保持 4:3 比例');
  await page.click('[data-ratio="16:9"]');

  // ── 12 · 导出:自包含 HTML ──────────────────────────────────
  await setMD('# 导出页一\n\n**粗体**\n\n---\n\n# 导出页二\n\n<img src=x onerror=alert(1)>');
  const html = await page.evaluate(() => window.DS.exportHTML());
  assert(html.startsWith('<!doctype html>'), '导出以 doctype 开头');
  assert((html.match(/class="ds-stage"/g) || []).length === 2, '导出包含两页');
  assert(html.includes('导出页一') && html.includes('导出页二'), '导出带上正文');
  assert(html.includes('<strong>粗体</strong>'), '导出保留行内格式');
  assert(!html.includes('<img src=x'), '导出里注入的标签仍是转义文本');
  assert(html.includes('&lt;img src=x'), '注入内容在导出中以字面量出现');
  assert(!html.includes('id="ds-md"') && !html.includes('ds-stagecard'), '导出不含编辑器界面');
  assert(html.includes('addEventListener("keydown"'), '导出自带键盘翻页脚本');
  assert(!/https?:\/\/[^"']*\.(css|js)/.test(html), '导出零外链依赖(自包含)');
  // 导出件必须自己跑自动缩放 —— 否则长页在导出的 HTML 里会被裁掉(DOM 断言看不出来,只有截图能看出来)
  assert(html.includes('scrollHeight') && html.includes('--fit'), '导出件内置自动缩放,不是把比例 bake 死');

  // 打印视图:0 尺寸容器不干扰版面,但页数与尺寸真实
  const printPages = await page.evaluate(() => window.DS.buildPrint());
  assert(printPages === 2, '打印视图逐页展开');
  const printW = await page.$eval('#ds-print', (e) => e.clientWidth);
  assert(printW === 0, '打印容器不占版面');
  const pageBox = await page.$eval('#ds-print .ds-printpage', (e) => [e.style.width, e.style.height]);
  assert(pageBox[0] === '1280px' && pageBox[1] === '720px', '打印页按当前比例出纸');

  const htmlSteps = await page.evaluate(() => {
    window.DS.state.decks[window.DS.state.current].md = '# 分步页\n\n- 先出现\n\n--\n\n- 后出现';
    document.querySelector('#ds-md').value = window.DS.state.decks[window.DS.state.current].md;
    document.querySelector('#ds-md').dispatchEvent(new Event('input', { bubbles: true }));
    return null;
  });
  await page.waitForFunction(() => window.DS.deck().slides[0].steps.length === 2, null, { timeout: 20000 });
  const html2 = await page.evaluate(() => window.DS.exportHTML());
  assert(html2.includes('data-step="1" hidden'), '导出件保留分步:第二步初始是隐藏的');
  await setMD('# 导出页一\n\n**粗体**\n\n---\n\n# 导出页二\n\n<img src=x onerror=alert(1)>');

  // ── 13 · 多文稿 + 刷新后恢复 ───────────────────────────────
  await page.$eval('#ds-title', (el) => { el.value = '季度复盘'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForFunction(() => (document.body.dataset.saves || '0') !== '0', null, { timeout: 20000 });
  assert((await text('#ds-decks .ds-deckitem[data-i="0"] .ds-deckname')) === '季度复盘', '文稿列表跟着改名');

  await page.click('#ds-new');
  assert((await page.evaluate(() => window.DS.decks().length)) === 2, '新建后有两份文稿');
  assert((await count('#ds-decks .ds-deckitem')) === 2, '列表渲染两条');
  await setMD('# 第二份\n\n只属于这一份。');
  await page.click('#ds-decks .ds-deckitem[data-i="0"]');
  assert((await page.$eval('#ds-md', (e) => e.value)).includes('导出页一'), '切回第一份拿回它自己的内容');
  assert((await page.$eval('#ds-title', (e) => e.value)) === '季度复盘', '标题跟着文稿走');

  const savesBefore = await page.evaluate(() => document.body.dataset.saves || '0');
  await page.waitForFunction((b) => (document.body.dataset.saves || '0') !== b || true, savesBefore, { timeout: 5000 });
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 20000 });
  assert((await page.$eval('#ds-title', (e) => e.value)) === '季度复盘', '刷新后标题从 localStorage 恢复');
  assert((await page.$eval('#ds-md', (e) => e.value)).includes('导出页一'), '刷新后正文恢复');
  assert((await page.evaluate(() => window.DS.decks().length)) === 2, '刷新后两份文稿都在');

  // ── 15 · 键盘导航 + 窄屏 ───────────────────────────────────
  await page.keyboard.press('End');
  assert((await pos()).slide === 1, 'End 跳到最后一页');
  await page.keyboard.press('Home');
  assert((await pos()).slide === 0, 'Home 回到首页');
  await page.$eval('#ds-md', (el) => el.focus());
  await page.keyboard.press('ArrowRight');
  assert((await pos()).slide === 0, '在编辑器里打字时方向键不抢焦点');

  await page.setViewportSize({ width: 414, height: 900 });
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 20000 });
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(over <= 1, `414px 窄屏没有横向溢出(溢出 ${over}px)`);
  const scalerN = await rect('#ds-scaler');
  assert(scalerN.right <= 415, '窄屏下舞台也没探出视口');

  // ── 16 · 收尾截图(回到示例文稿的封面页) ───────────────────
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 20000 });
  await page.waitForFunction(() => {
    const s = document.querySelector('#ds-scaler .ds-stage h1');
    return s && s.textContent.trim() === '幻灯片工坊';
  }, null, { timeout: 20000 });
  await screenshot('thumb.png');
  // ── 14 · 放映模式 + 演讲者视图 ─────────────────────────────
  await setMD('# 放映页一\n\n正文\n\n???\n\n这是我的小抄\n\n---\n\n# 放映页二');
  assert((await display('#ds-overlay')) === 'none', '放映层默认隐藏(断计算样式)');
  await page.click('#ds-present');
  await page.waitForFunction(() => document.body.dataset.presenting === '1', null, { timeout: 20000 });
  assert((await display('#ds-overlay')) !== 'none', '进入放映后覆盖层可见');
  assert((await text('#ds-pscaler .ds-stage h1')) === '放映页一', '放映层渲染当前页');
  const pStage = await rect('#ds-pscaler');
  const pWrap = await rect('.ds-pstagewrap');
  assert(pStage.w > 300 && pStage.h > 160, `放映舞台有真实尺寸(${pStage.w.toFixed(0)}×${pStage.h.toFixed(0)})`);
  assert(pStage.top >= pWrap.top - 1 && pStage.bottom <= pWrap.bottom + 1, '放映舞台纵向不越界');
  assert(pStage.left >= pWrap.left - 1 && pStage.right <= pWrap.right + 1, '放映舞台横向不越界');
  assert((await text('#ds-ppage')) === '1 / 2', '放映页码');
  assert(/^\d\d:\d\d$/.test(await text('#ds-ptimer')), '计时器按 mm:ss 走');

  assert((await display('#ds-pside')) === 'none', '演讲者面板默认收起');
  await page.keyboard.press('p');
  assert((await display('#ds-pside')) !== 'none', 'P 键打开演讲者视图');
  assert((await text('#ds-pnotes')).includes('这是我的小抄'), '演讲者视图显示本页备注');
  assert((await text('#ds-pnextscaler .ds-stage h1')) === '放映页二', '演讲者视图预览下一页');
  await page.keyboard.press('ArrowRight');
  assert((await text('#ds-ppage')) === '2 / 2', '放映时方向键翻页');
  assert((await text('#ds-pnotes')).includes('无备注'), '无备注页给出占位文案');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.body.dataset.presenting === '0', null, { timeout: 20000 });
  assert((await display('#ds-overlay')) === 'none', 'Esc 退出放映,覆盖层真的藏起来');

};
