// 历法工作台 · Calendar Studio —— 真实浏览器集成测试
// 断言真实历算结果（对照香港天文台公布数据）而不是元素存在性。
export default async ({ page, toolURL, screenshot, assert }) => {
  await page.goto(toolURL);
  await page.waitForFunction(() => document.body.dataset.ready === '1');

  const txt = async (sel) => (await page.textContent(sel)).trim();
  const settle = async (sel, want) => page.waitForFunction(
    ([s, w]) => { const el = document.querySelector(s); return el && el.textContent.trim() === w; },
    [sel, want], { timeout: 10000 });

  // 面板助手：藏在别的面板里的控件对 fill/selectOption 不可见（会卡满超时），先切面板再操作
  const onPanel = async (name, fn) => {
    await page.click('#cs-tab-' + name);
    await page.waitForFunction((n) => !document.getElementById('cs-panel-' + n).hidden, name);
    return fn();
  };
  const setSolar = async (y, m, d) => {
    await page.fill('#cs-sy', String(y));
    await page.dispatchEvent('#cs-sy', 'change');
    await page.selectOption('#cs-sm', String(m));
    await page.selectOption('#cs-sd', String(d));
    await settle('#cs-solar-big', `${y} 年 ${m} 月 ${d} 日`);
  };

  assert(await page.isVisible('a[href="../../"]'), '顶部有返回工具集链接');

  /* ═════ 面板 1：日期换算 ═════ */
  // 2026-08-11 = 农历六月廿九、丙午马年、丁巳日（新华社「7月15日入伏」同源的干支序列）
  await setSolar(2026, 8, 11);
  assert(await txt('#cs-lunar-label') === '六月廿九', '2026-08-11 → 农历六月廿九');
  assert(await txt('#cs-ganzhi-year') === '丙午年 · 属马', '2026 为丙午马年');
  assert(await txt('#cs-p-y') === '丙午' && await txt('#cs-p-m') === '丙申' && await txt('#cs-p-d') === '丁巳',
    '四柱年月日 = 丙午 丙申 丁巳');
  assert(await txt('#cs-m-star') === '狮子座', '8-11 狮子座');
  assert((await txt('#cs-m-term')).startsWith('立秋第 5 天'), `节气区间：${await txt('#cs-m-term')}`);
  assert((await txt('#cs-m-fest')).includes('中伏'), `8-11 落在中伏内：${await txt('#cs-m-fest')}`);

  // 四柱两个字必须排在同一行（柱格太窄会折成上下两字，看着像两个柱）
  const pillarLines = await page.$$eval('.cs-pillar > span[id]', (ns) => ns.map((n) => ({
    id: n.id, lines: n.getClientRects().length,
    spill: Math.round(n.getBoundingClientRect().width - n.parentElement.getBoundingClientRect().width) })));
  assert(pillarLines.length === 4, '四柱四格齐全');
  assert(pillarLines.every((p) => p.lines === 1), `四柱每格单行，实得 ${JSON.stringify(pillarLines)}`);
  assert(pillarLines.every((p) => p.spill <= 0), `四柱文字不溢出格子，实得 ${JSON.stringify(pillarLines)}`);

  // 时柱随时刻改变：默认 12:00 是午时 → 丙午；改 10:00 是巳时 → 乙巳（丁日五鼠遁自庚子起）
  assert(await txt('#cs-p-h') === '丙午', `默认 12:00 为午时 → 丙午时，实得 ${await txt('#cs-p-h')}`);
  await page.fill('#cs-st', '10:00');
  await settle('#cs-p-h', '乙巳');
  await page.fill('#cs-st', '23:30');
  await settle('#cs-p-d', '戊午');
  assert(await txt('#cs-p-h') === '壬子', '23:30 为子时 → 壬子时');
  await page.uncheck('#cs-latezi');
  await settle('#cs-p-d', '丁巳');
  assert(await txt('#cs-p-d') === '丁巳', '关掉晚子时换日后日柱退回丁巳');
  await page.check('#cs-latezi');
  await settle('#cs-p-d', '戊午');
  await page.fill('#cs-st', '12:00');
  await settle('#cs-p-d', '丁巳');

  // 闰月：2033-12-22 是闰十一月初一（著名的 2033 年问题）
  await setSolar(2033, 12, 22);
  assert(await txt('#cs-lunar-label') === '闰十一月初一', '2033-12-22 → 闰十一月初一');
  // 2025-07-25 是闰六月初一
  await setSolar(2025, 7, 25);
  assert(await txt('#cs-lunar-label') === '闰六月初一', '2025-07-25 → 闰六月初一');

  // 农历 → 公历：2026 正月初一 = 2026-02-17（春节）
  await page.click('#cs-dir-l2s');
  await page.waitForFunction(() => !document.getElementById('cs-form-l2s').hidden);
  await page.fill('#cs-ly', '2026');
  await page.dispatchEvent('#cs-ly', 'change');
  await page.selectOption('#cs-lm', 'N1');
  await page.selectOption('#cs-ld', '1');
  await page.click('#cs-l2s-go');
  await settle('#cs-solar-big', '2026 年 2 月 17 日');
  assert((await txt('#cs-m-fest')).includes('春节'), '2026-02-17 标为春节');
  // 中秋：2026 八月十五 = 2026-09-25
  await page.selectOption('#cs-lm', 'N8');
  await page.selectOption('#cs-ld', '15');
  await page.click('#cs-l2s-go');
  await settle('#cs-solar-big', '2026 年 9 月 25 日');
  assert((await txt('#cs-m-fest')).includes('中秋节'), '2026-09-25 标为中秋节');
  // 端午：2026 五月初五 = 2026-06-19
  await page.selectOption('#cs-lm', 'N5');
  await page.selectOption('#cs-ld', '5');
  await page.click('#cs-l2s-go');
  await settle('#cs-solar-big', '2026 年 6 月 19 日');

  // 2026 年没有闰月 → 月下拉里不应出现任何「闰」；2025 年应有闰六月
  const monthOpts2026 = await page.$$eval('#cs-lm option', (os) => os.map((o) => o.textContent));
  assert(monthOpts2026.length === 12 && !monthOpts2026.some((t) => t.includes('闰')), '2026 农历年 12 个月且无闰月');
  await page.fill('#cs-ly', '2025');
  await page.dispatchEvent('#cs-ly', 'change');
  const monthOpts2025 = await page.$$eval('#cs-lm option', (os) => os.map((o) => o.textContent));
  assert(monthOpts2025.length === 13 && monthOpts2025.includes('闰六月'), '2025 农历年 13 个月且含闰六月');

  // 日数随月份变化：农历月只有 29 或 30 天，绝不出现 31
  await page.selectOption('#cs-lm', 'L6');
  const dayOpts = await page.$$eval('#cs-ld option', (os) => os.map((o) => o.textContent));
  assert(dayOpts.length === 29 || dayOpts.length === 30, `闰六月 ${dayOpts.length} 天（29 或 30）`);
  assert(!dayOpts.includes('三十一'), '农历没有三十一日');

  // 回到公历模式与今天
  await page.click('#cs-dir-s2l');
  await page.waitForFunction(() => !document.getElementById('cs-form-s2l').hidden);
  await setSolar(2026, 8, 11);

  // 日历网格：8 月 13 日是七月初一，格子里应显示月名
  const cell813 = await page.$eval('.cs-day[data-iso="2026-08-13"] i', (n) => n.textContent);
  assert(cell813 === '七月', `8/13 格显示月名「七月」，实得「${cell813}」`);
  const cell807 = await page.$eval('.cs-day[data-iso="2026-08-07"] i', (n) => n.textContent);
  assert(cell807 === '立秋', `8/7 格显示节气「立秋」，实得「${cell807}」`);
  // 点日历格 → 选中日期真的跟着变
  await page.click('.cs-day[data-iso="2026-08-19"]');
  await settle('#cs-lunar-label', '七月初七');
  assert((await txt('#cs-m-fest')).includes('七夕'), '2026-08-19 是七夕');
  await page.click('.cs-day[data-iso="2026-08-11"]');
  await settle('#cs-lunar-label', '六月廿九');

  // 本月天象：立秋（天文台 2026-08-07 19:43）与处暑必须在列
  const slots = await page.$$eval('#cs-slots .cs-slot', (rows) => rows.map((r) => ({
    name: r.querySelector('b').textContent, time: r.querySelector('span').textContent, kind: r.dataset.kind })));
  const liqiu = slots.find((s) => s.name === '立秋');
  assert(liqiu && liqiu.kind === '节气', '本月天象含立秋');
  assert(liqiu.time === '8/07 19:43', `立秋时刻应与天文台公布的 8/07 19:43 逐分一致，实得 ${liqiu && liqiu.time}`);
  assert(slots.some((s) => s.name === '处暑'), '本月天象含处暑');
  assert(slots.some((s) => s.kind === '月相'), '本月天象含月相时刻');

  await screenshot('view-convert.png');
  await page.evaluate(() => document.querySelector('.cs-book').scrollIntoView({ block: 'start' }));
  await screenshot('view-book.png');
  await page.evaluate(() => window.scrollTo(0, 0));

  /* ═════ 面板 2：年历 ═════ */
  await onPanel('yr', async () => {
    await page.fill('#cs-yr-y', '2025');
    await page.dispatchEvent('#cs-yr-y', 'change');
    await page.waitForFunction(() => document.body.dataset.yr === '2025');
    const stats = await page.$$eval('#cs-yr-stats .cs-stat', (ns) => ns.map((n) => [n.querySelector('b').textContent, n.querySelector('span').textContent]));
    const get = (k) => (stats.find((s) => s[0] === k) || [])[1];
    assert(get('干支 · 生肖').startsWith('乙巳'), `2025 干支：${get('干支 · 生肖')}`);
    assert(get('春节') === '1 月 29 日', `2025 春节 1 月 29 日，实得 ${get('春节')}`);
    assert(get('闰月') === '闰六月', `2025 闰六月，实得 ${get('闰月')}`);
    assert(get('农历月数').startsWith('13'), `闰年 13 个月，实得 ${get('农历月数')}`);
    const ld = parseInt(get('农历年长'), 10);
    assert(ld >= 383 && ld <= 385, `闰年农历年长 383–385 天，实得 ${ld}`);

    // 平年
    await page.fill('#cs-yr-y', '2026');
    await page.dispatchEvent('#cs-yr-y', 'change');
    await page.waitForFunction(() => document.body.dataset.yr === '2026');
    const stats2 = await page.$$eval('#cs-yr-stats .cs-stat', (ns) => ns.map((n) => [n.querySelector('b').textContent, n.querySelector('span').textContent]));
    const get2 = (k) => (stats2.find((s) => s[0] === k) || [])[1];
    assert(get2('闰月') === '无', '2026 无闰月');
    assert(get2('春节') === '2 月 17 日', `2026 春节 2 月 17 日，实得 ${get2('春节')}`);
    const ld2 = parseInt(get2('农历年长'), 10);
    assert(ld2 >= 353 && ld2 <= 355, `平年农历年长 353–355 天，实得 ${ld2}`);

    // 三伏：新华社「2026 年 7 月 15 日入伏，全程 40 天」
    const fu = await page.$$eval('#cs-yr-fu tbody tr', (rs) => rs.map((r) => Array.from(r.cells).map((c) => c.textContent)));
    const chu = fu.find((r) => r[1] === '初伏');
    assert(chu && chu[2].startsWith('7 月 15 日'), `2026 初伏 7 月 15 日，实得 ${chu && chu[2]}`);
    const total = fu.filter((r) => r[0] === '三伏').reduce((s, r) => s + parseInt(r[3], 10), 0);
    assert(total === 40, `2026 三伏共 40 天，实得 ${total}`);

    // 12 个月网格都渲染出来了，且 2 月 17 日格子标着春节
    const minis = await page.$$('#cs-yr-months .cs-mini');
    assert(minis.length === 12, `年历 12 个月，实得 ${minis.length}`);
    const cells = await page.$$eval('#cs-yr-months .cs-day', (ns) => ns.length);
    assert(cells >= 12 * 28, `年历格子数 ${cells} 合理`);
    const festCells = await page.$$eval('#cs-yr-months .cs-day.cs-fest i', (ns) => ns.map((n) => n.textContent));
    assert(festCells.includes('春节') && festCells.includes('中秋节') && festCells.includes('除夕'),
      `年历标出春节/中秋/除夕，实得 ${festCells.join(',')}`);
    const termCells = await page.$$eval('#cs-yr-months .cs-day.cs-term i', (ns) => ns.map((n) => n.textContent));
    assert(new Set(termCells).size === 24, `年历标出 24 个不同节气，实得 ${new Set(termCells).size}`);
    // 同日撞车：2026-03-20 既是春分又是龙抬头 —— 节气必须留在格子里，节日退成角点
    const clash = await page.$eval('#cs-yr-months .cs-day[data-iso="2026-03-20"]',
      (n) => ({ text: n.querySelector('i').textContent, fest: n.dataset.fest, dot: n.classList.contains('cs-dot'), aria: n.getAttribute('aria-label') }));
    assert(clash.text === '春分', `3/20 格应显示春分（曾被龙抬头顶掉），实得 ${clash.text}`);
    assert(clash.fest === '龙抬头' && clash.dot, '龙抬头退成角点但仍留在 data-fest 里');
    assert(clash.aria.includes('龙抬头') && clash.aria.includes('春分'), '读屏文本两者都有');
    // 重要节日仍然压过节气：2026-02-17 春节
    const cny26 = await page.$eval('#cs-yr-months .cs-day[data-iso="2026-02-17"]', (n) => n.querySelector('i').textContent);
    assert(cny26 === '春节', `2/17 格应显示春节，实得 ${cny26}`);
    await screenshot('view-year.png');
    await page.evaluate(() => document.querySelector('#cs-yr-months').scrollIntoView({ block: 'start' }));
    await screenshot('view-year-months.png');
    await page.evaluate(() => window.scrollTo(0, 0));
  });

  /* ═════ 面板 3：节气与月相 ═════ */
  await onPanel('tm', async () => {
    await page.fill('#cs-tm-y', '2026');
    await page.dispatchEvent('#cs-tm-y', 'change');
    await page.waitForFunction(() => document.body.dataset.tmy === '2026');
    const rows = await page.$$eval('#cs-tm-table tbody tr', (rs) => rs.map((r) => Array.from(r.cells).map((c) => c.textContent.trim())));
    assert(rows.length === 24, `24 个节气，实得 ${rows.length}`);
    // 与香港天文台公布时刻对照（允许 ±1 分钟：本页用截断级数）
    const check = (name, date, hm) => {
      const r = rows.find((x) => x[0] === name);
      assert(r, `表中有${name}`);
      assert(r[2] === date, `${name} 日期 ${date}，实得 ${r[2]}`);
      const [H, M] = hm.split(':').map(Number);
      const [h2, m2] = r[3].split(':').map(Number);
      const dm = Math.abs((h2 * 60 + m2) - (H * 60 + M));
      assert(dm <= 1, `${name} 时刻应约 ${hm}，实得 ${r[3]}`);
    };
    check('小寒', '1 月 5 日', '16:23');
    check('立春', '2 月 4 日', '04:02');
    check('雨水', '2 月 18 日', '23:52');   // 距午夜仅 8 分钟，最考验精度
    check('春分', '3 月 20 日', '22:46');
    check('夏至', '6 月 21 日', '16:25');
    check('立秋', '8 月 7 日', '19:43');
    check('冬至', '12 月 22 日', '04:50');
    const tstats = await page.$$eval('#cs-tm-stats .cs-stat', (ns) => ns.map((n) => [n.querySelector('b').textContent, n.querySelector('span').textContent.trim()]));
    const gs = (k) => (tstats.find((x) => x[0] === k) || [])[1];
    assert(gs('立春') === '2/4 04:02', `立春统计条与天文台一致，实得 ${gs('立春')}`);
    assert(gs('夏至') === '6/21 16:25', `夏至统计条与天文台一致，实得 ${gs('夏至')}`);
    // 中气/节各 12 个
    assert(rows.filter((r) => r[5] === '中气').length === 12, '中气 12 个');
    assert(rows.filter((r) => r[5] === '节').length === 12, '节 12 个');
    // 黄经必须是 15 的倍数且互不重复
    const lons = rows.map((r) => parseInt(r[1], 10));
    assert(new Set(lons).size === 24 && lons.every((l) => l % 15 === 0), '24 个黄经互不重复且都是 15 的倍数');

    // 单位符号没有被 text-transform 改写（dBc→DBC 这类事故的通用守卫）
    const heads = await page.$$eval('th, dt, label', (ns) => ns.map((n) => n.textContent));
    assert(!heads.some((t) => /\b(HZ|KHZ|DB|DBFS|KM|AU)\b/.test(t)), '表头/标签里没有被大写化的单位');

    // 节气盘：24 个节气名一个都不能被避让掉（多标签断言「画出来几个」）
    const labels = JSON.parse(await page.$eval('#cs-dial', (c) => c.dataset.labels));
    const TERMS = ['立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
      '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'];
    const drawnTerms = TERMS.filter((t) => labels.includes(t));
    assert(drawnTerms.length === 24, `节气盘应画出全部 24 个节气名，实得 ${drawnTerms.length}：缺 ${TERMS.filter((t) => !labels.includes(t)).join('、')}`);
    // 盘上每个节气的日期标签都必须与表格里那一行对得上（"8/11" 是太阳标记，不算在内）
    const wantDates = rows.map((r) => r[2].replace(/(\d+) 月 (\d+) 日/, '$1/$2'));
    const missDates = wantDates.filter((d) => !labels.includes(d));
    assert(missDates.length === 0, `节气盘缺日期标签：${missDates.join('、')}`);
    assert(new Set(wantDates).size === 24, '24 个节气日期互不相同');
    assert(['春', '夏', '秋', '冬'].every((s) => labels.includes(s)), '节气盘四季标注齐全');
    assert(labels.some((t) => /^8\/11 太阳黄经 \d+(\.\d+)?°$/.test(t)), `节气盘中心画出太阳黄经读数，实得 ${labels.slice(0, 3).join('|')}`);
    assert(labels.filter((t) => t === '8/11').length === 1, '太阳标记点旁画出了短日期标注');
    assert(labels.includes('2026') && labels.includes('黄道二十四节气'), '节气盘中心三行读数齐全');
    const dropped = +(await page.$eval('#cs-dial', (c) => c.dataset.dropped));
    assert(dropped === 0, `节气盘不应有被挤掉的标注，实得 ${dropped}`);

    // 月相表：每一个「朔」都必须落在农历初一
    const mrows = await page.$$eval('#cs-mp-table tbody tr', (rs) => rs.map((r) => ({
      phase: r.dataset.phase, cells: Array.from(r.cells).map((c) => c.textContent.trim()) })));
    assert(mrows.length >= 48 && mrows.length <= 53, `一年 48–53 个月相，实得 ${mrows.length}`);
    const shuo = mrows.filter((r) => r.phase === '0');
    assert(shuo.length >= 12, `一年至少 12 个朔，实得 ${shuo.length}`);
    assert(shuo.every((r) => r.cells[3].endsWith('初一')), '每个朔都落在农历初一');
    const wang = mrows.filter((r) => r.phase === '2');
    assert(wang.every((r) => /(十四|十五|十六|十七)$/.test(r.cells[3])), '望都落在十四到十七之间');

    // 月相图：朔时不画亮面，望时几乎全亮
    const frac = await txt('#cs-moon-frac');
    assert(/^\d+(\.\d+)?%$/.test(frac), `照亮率格式正确：${frac}`);
    const dist = await txt('#cs-moon-dist');
    assert(/^\d{3},\d{3} km$/.test(dist), `地月距离带千分位，实得 ${dist}`);
    const km = parseInt(dist.replace(/[^\d]/g, ''), 10);
    assert(km > 356000 && km < 407000, `地月距离 ${km} km 落在合理区间`);
    await page.evaluate(() => document.querySelector('#cs-mp-table').closest('.cs-card').scrollIntoView({ block: 'start' }));
    await screenshot('view-moon.png');
    await page.evaluate(() => window.scrollTo(0, 0));
    await screenshot('view-terms.png');
  });

  /* ═════ 面板 4：纪念日 ═════ */
  await onPanel('an', async () => {
    // 农历八月十五 → 2026 年公历 9 月 25 日（与中秋一致）
    await page.fill('#cs-an-name', '测试·农历八月十五');
    await page.selectOption('#cs-an-kind', 'lunar');
    await page.fill('#cs-an-y', '1990');
    await page.selectOption('#cs-an-m', '8');
    await page.selectOption('#cs-an-d', '15');
    await page.click('#cs-an-add');
    await page.waitForFunction(() => Array.from(document.querySelectorAll('.cs-an-main b')).some((b) => b.textContent === '测试·农历八月十五'));
    const card = await page.$('.cs-an:has(b:text-is("测试·农历八月十五"))');
    const ups = await card.$$eval('.cs-upcoming span', (ns) => ns.map((n) => n.textContent));
    assert(ups.includes('2026: 9/25'), `农历八月十五在 2026 年落在 9/25，实得 ${ups.join(' ')}`);
    assert(ups.includes('2027: 9/15'), `农历八月十五在 2027 年落在 9/15，实得 ${ups.join(' ')}`);
    assert(ups.length === 10, `未来十年各一条，实得 ${ups.length}`);
    // 每年公历日期都不同 —— 正是这个工具存在的理由
    assert(new Set(ups.map((u) => u.split(': ')[1])).size >= 8, '农历生日的公历日期逐年不同');

    // 公历纪念日固定不变
    await page.fill('#cs-an-name', '测试·公历双十');
    await page.selectOption('#cs-an-kind', 'solar');
    await page.selectOption('#cs-an-m', '10');
    await page.selectOption('#cs-an-d', '1');
    await page.click('#cs-an-add');
    await page.waitForFunction(() => Array.from(document.querySelectorAll('.cs-an-main b')).some((b) => b.textContent === '测试·公历双十'));
    const card2 = await page.$('.cs-an:has(b:text-is("测试·公历双十"))');
    const ups2 = await card2.$$eval('.cs-upcoming span', (ns) => ns.map((n) => n.textContent));
    assert(ups2.every((u) => u.endsWith('10/01')), `公历纪念日每年同一天，实得 ${ups2.join(' ')}`);

    // 空名称必须报错而不是静默加入
    const before = +(await page.getAttribute('body', 'data-anncount'));
    await page.fill('#cs-an-name', '   ');
    await page.click('#cs-an-add');
    assert(await page.isVisible('#cs-an-msg'), '空名称提示可见');
    assert((await txt('#cs-an-msg')).includes('名称'), '空名称报错文案正确');
    assert(+(await page.getAttribute('body', 'data-anncount')) === before, '报错时没有写入清单');

    // localStorage 真的持久化：重载后条目还在
    await page.reload();
    await page.waitForFunction(() => document.body.dataset.ready === '1');
    await page.click('#cs-tab-an');
    await page.waitForFunction(() => !document.getElementById('cs-panel-an').hidden);
    const names = await page.$$eval('.cs-an-main b', (ns) => ns.map((n) => n.textContent));
    assert(names.includes('测试·农历八月十五'), '刷新后农历纪念日仍在（localStorage 生效）');

    // 删除
    const n0 = +(await page.getAttribute('body', 'data-anncount'));
    await page.click('.cs-an:has(b:text-is("测试·公历双十")) button[data-del]');
    await page.waitForFunction((n) => +document.body.dataset.anncount === n - 1, n0);
    const names2 = await page.$$eval('.cs-an-main b', (ns) => ns.map((n) => n.textContent));
    assert(!names2.includes('测试·公历双十'), '删除生效');

    // 导出 .ics：真的产生下载且内容含 VEVENT
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#cs-an-ics')]);
    const stream = await dl.createReadStream();
    let ics = '';
    for await (const chunk of stream) ics += chunk;
    assert(ics.startsWith('BEGIN:VCALENDAR') && ics.includes('END:VCALENDAR'), 'ics 结构完整');
    assert(ics.includes('DTSTART;VALUE=DATE:20260925'), 'ics 里含 2026-09-25 这条农历生日');
    assert((ics.match(/BEGIN:VEVENT/g) || []).length >= 10, 'ics 至少十条事件');
    await screenshot('view-anniv.png');
  });

  /* ═════ 面板 5：置闰原理 ═════ */
  await onPanel('pr', async () => {
    // 2033 冬至 → 2034 冬至：13 个月，闰十一月紧跟在十一月后（著名的 2033 年问题）
    await page.click('#cs-pr-2033');
    await page.waitForFunction(() => document.body.dataset.pry === '2033');
    const rows = await page.$$eval('#cs-pr-table tbody tr', (rs) => rs.map((r) => ({
      month: r.dataset.month, leap: r.classList.contains('cs-rowhi'),
      cells: Array.from(r.cells).map((c) => c.textContent.trim()) })));
    assert(rows.length === 13, `闰岁 13 个月，实得 ${rows.length}`);
    const leapRows = rows.filter((r) => r.leap);
    assert(leapRows.length === 1 && leapRows[0].month === '闰十一月', `闰月应为闰十一月，实得 ${leapRows.map((r) => r.month).join(',')}`);
    assert(leapRows[0].cells[4] === '—', '闰月那一行确实没有中气');
    assert(leapRows[0].cells[2].startsWith('2033 年 12 月 22 日'), `闰十一月初一 = 2033-12-22，实得 ${leapRows[0].cells[2]}`);
    // 第一个月必是十一月，且含冬至
    assert(rows[0].month === '十一月', '岁首为十一月');
    assert(rows[0].cells[4].includes('冬至'), '十一月含冬至');
    // 2033 年问题的要害：这一岁有「两个」月不含中气，规则只认第一个
    const noMajor = rows.filter((r) => r.cells[4] === '—');
    assert(noMajor.length === 2, `2033 岁应有 2 个无中气之月，实得 ${noMajor.length}`);
    assert(noMajor[0].month === '闰十一月' && noMajor[0].leap, '第一个无中气之月被判为闰月');
    assert(noMajor[1].month === '正月' && !noMajor[1].leap, `第二个无中气之月（正月）不再置闰，实得 ${noMajor[1].month}`);
    assert(noMajor[1].cells[5].includes('不再置闰'), `第二个的判定文案说明原因：${noMajor[1].cells[5]}`);
    // 十一月与十二月各塞下了两个中气 —— 正是后面月份「饿肚子」的原因
    assert(rows[0].cells[4].split('、').length === 2, `十一月含两个中气，实得 ${rows[0].cells[4]}`);
    const stats = await page.$$eval('#cs-pr-stats .cs-stat', (ns) => ns.map((n) => [n.querySelector('b').textContent, n.querySelector('span').textContent]));
    assert((stats.find((x) => x[0] === '无中气之月') || [])[1].startsWith('2'), '统计条报出 2 个无中气之月');
    assert((await txt('#cs-pr-note')).includes('2033 年问题'), '结论文案点明 2033 年问题');
    // 天数只能是 29 / 30
    assert(rows.every((r) => ['29', '30'].includes(r.cells[3])), '每月 29 或 30 天');

    // 平岁
    await page.click('#cs-pr-plain');
    await page.waitForFunction(() => document.body.dataset.pry === '2026');
    const rows2 = await page.$$eval('#cs-pr-table tbody tr', (rs) => rs.length);
    assert(rows2 === 12, `平岁 12 个月，实得 ${rows2}`);
    assert((await txt('#cs-pr-note')).includes('不置闰'), '平岁结论文案正确');

    // 自检全绿
    assert(await page.getAttribute('body', 'data-selfcheck') === 'ok', '引擎自检全部通过');
    const marks = await page.$$eval('#cs-selfcheck .cs-checkrow em', (ns) => ns.map((n) => n.textContent));
    assert(marks.length >= 9 && marks.every((m) => m === '✓'), `自检 ${marks.length} 条全绿`);
    await screenshot('view-rules.png');
  });

  /* ═════ 结构守卫 ═════ */
  // 1) [hidden] 必须真的藏住（作者 CSS 与 UA 规则同特异性时会失效）
  await page.click('#cs-tab-cv');
  await page.waitForFunction(() => !document.getElementById('cs-panel-cv').hidden);
  for (const p of ['yr', 'tm', 'an', 'pr']) {
    const disp = await page.$eval('#cs-panel-' + p, (n) => getComputedStyle(n).display);
    assert(disp === 'none', `#cs-panel-${p} 隐藏时计算样式必须是 none，实得 ${disp}`);
  }
  const hiddenForm = await page.$eval('#cs-form-l2s', (n) => getComputedStyle(n).display);
  assert(hiddenForm === 'none', `隐藏的农历表单计算样式必须是 none，实得 ${hiddenForm}`);

  // 2) 控件尺寸：逐个面板扫一遍（藏起来的面板量不到，必须切过去）
  let scanned = 0;
  for (const p of ['cv', 'yr', 'tm', 'an', 'pr']) {
    await page.click('#cs-tab-' + p);
    await page.waitForFunction((n) => !document.getElementById('cs-panel-' + n).hidden, p);
    const bad = await page.$$eval('#cs-panel-' + p + ' input, #cs-panel-' + p + ' select, #cs-panel-' + p + ' button', (ns) =>
      ns.filter((n) => n.offsetParent !== null && !n.closest('.cs-days')).map((n) => {
        const r = n.getBoundingClientRect();
        const isCheck = n.tagName === 'INPUT' && n.type === 'checkbox';
        const isIcon = n.tagName === 'BUTTON' && n.hasAttribute('aria-label') && n.textContent.trim().length <= 2;
        const minW = isCheck ? 18 : isIcon ? 32 : n.tagName === 'BUTTON' ? 52 : 100;
        return { tag: n.tagName, id: n.id, cls: n.className, w: Math.round(r.width), h: Math.round(r.height), minW };
      }).filter((o) => o.w < o.minW || o.h < 18));
    assert(bad.length === 0, `${p} 面板控件塌缩：${JSON.stringify(bad)}`);
    scanned += await page.$$eval('#cs-panel-' + p + ' input, #cs-panel-' + p + ' select, #cs-panel-' + p + ' button',
      (ns) => ns.filter((n) => n.offsetParent !== null && !n.closest('.cs-days')).length);
  }
  assert(scanned >= 20, `五个面板累计扫到 ${scanned} 个控件（下界 20），防止「一个都没扫到也算绿」`);

  // 3) 格子里的农历/节气小字不得溢出格子（4 个汉字曾在 31px 的年历格里与邻格糊成一片，
  //    DOM 断言查不出来——只能断「子元素盒必须落在父格盒内」）
  for (const p of ['cv', 'yr']) {
    await page.click('#cs-tab-' + p);
    await page.waitForFunction((n) => !document.getElementById('cs-panel-' + n).hidden, p);
    const scope = p === 'cv' ? '#cs-days' : '#cs-yr-months';
    const spill = await page.$$eval(scope + ' .cs-day', (ns) => ns.map((n) => {
      const c = n.getBoundingClientRect(), t = n.querySelector('i').getBoundingClientRect();
      return { iso: n.dataset.iso, text: n.querySelector('i').textContent,
        over: Math.max(0, Math.round(c.left - t.left), Math.round(t.right - c.right)) };
    }).filter((o) => o.over > 1));
    assert(spill.length === 0, `${p} 面板有 ${spill.length} 个格子的小字溢出：${JSON.stringify(spill.slice(0, 4))}`);
  }

  // 4) 日历格子本身也是可点控件，不能被压扁
  await page.click('#cs-tab-cv');
  await page.waitForFunction(() => !document.getElementById('cs-panel-cv').hidden);
  const cellBad = await page.$$eval('#cs-days .cs-day', (ns) => ns.map((n) => n.getBoundingClientRect())
    .filter((r) => r.width < 28 || r.height < 38).length);
  assert(cellBad === 0, `日历格子不应被压扁，异常 ${cellBad} 个`);

  // 5) 不横向溢出（宽屏 + 窄屏）
  for (const w of [1280, 390]) {
    await page.setViewportSize({ width: w, height: 900 });
    for (const p of ['cv', 'yr', 'tm', 'an', 'pr']) {
      await page.click('#cs-tab-' + p);
      await page.waitForFunction((n) => !document.getElementById('cs-panel-' + n).hidden, p);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert(over <= 1, `${w}px 下 ${p} 面板横向溢出 ${over}px`);
    }
  }
  // 窄屏留一张给人工过目
  await page.setViewportSize({ width: 390, height: 1400 });
  await page.click('#cs-tab-cv');
  await page.waitForFunction(() => !document.getElementById('cs-panel-cv').hidden);
  await page.evaluate(() => document.querySelector('.cs-book').scrollIntoView({ block: 'start' }));
  await screenshot('view-narrow.png');
  await page.setViewportSize({ width: 1280, height: 850 });

  // 6) 中文文案里不应残留 \u 转义写法的痕迹（易错字只能靠字面汉字复核）
  const bodyText = await page.$eval('body', (n) => n.innerText);
  assert(!/\\u[0-9a-f]{4}/i.test(bodyText), '页面文案里没有未转换的 \\uXXXX');

  /* ═════ 缩略图 ═════ */
  await page.click('#cs-tab-cv');
  await page.waitForFunction(() => !document.getElementById('cs-panel-cv').hidden);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(() => document.querySelectorAll('#cs-days .cs-day').length > 27);
  await page.evaluate(() => window.scrollTo(0, 420));
  await screenshot('thumb.png');
};
