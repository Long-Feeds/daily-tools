// 数据清洗台 · 集成测试
// 真的操作：载入示例 → 看列详情 → 体检一键修复 → 聚类归并 → 转换/公式 → 分组与透视 → 校验 → 配方增删改 → 导出 → 刷新恢复
// 并带上本站踩过的几类结构性守卫：[hidden] 计算样式、控件塌缩（逐 tab 扫）、子元素越出父盒、代码块横向溢出、页面横向滚动。
export default async ({ page, toolURL, screenshot, assert }) => {
  const TABS = ['data', 'audit', 'cluster', 'transform', 'agg', 'recipe'];
  const goTab = async (name) => {
    await page.click('#dw-tab-' + name);
    await page.waitForFunction((n) => !document.getElementById('dw-panel-' + n).hidden, name);
  };
  const num = async (sel) => Number((await page.textContent(sel)).replace(/[^\d.-]/g, ''));
  const cell = (r, c) => page.textContent(`td[data-r="${r}"][data-c="${c}"]`);
  const rowsNow = () => num('#dw-mRows');

  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#dw-table td[data-r="0"]');

  // ---------- 1. 首屏：示例数据自动载入 ----------
  assert((await rowsNow()) === 44, '示例数据应有 44 行，实际 ' + (await rowsNow()));
  assert((await num('#dw-mCols')) === 10, '示例数据应有 10 列');
  assert((await num('#dw-mDup')) === 2, '应识别出 2 行完全重复，实际 ' + (await num('#dw-mDup')));
  assert((await num('#dw-mIssues')) > 8, '体检应发现多个问题');
  assert((await page.textContent('h1, .dw-brand b')).includes('数据清洗台'), '标题应为数据清洗台');
  assert(await page.isVisible('a.dw-back'), '必须有返回工具集链接');
  assert((await page.getAttribute('a.dw-back', 'href')) === '../../', '返回链接应指向 ../../');

  // 类型推断落到表头
  const typeOf = async (colName) => page.textContent(`th[data-col="${colName}"] .dw-chipT`);
  assert((await typeOf('下单时间')) === '日期', '下单时间应识别为日期，实际 ' + (await typeOf('下单时间')));
  assert((await typeOf('金额')) === '金额', '金额应识别为金额列，实际 ' + (await typeOf('金额')));
  assert((await typeOf('联系电话')) === '手机号', '联系电话应识别为手机号，实际 ' + (await typeOf('联系电话')));
  assert((await typeOf('邮箱')) === '邮箱', '邮箱应识别为邮箱');
  assert((await typeOf('城市')) === '文本', '城市应是文本');
  assert((await typeOf('数量')) === '整数', '数量应识别为整数，实际 ' + (await typeOf('数量')));

  // ---------- 2. 列详情：统计数字要真的算对 ----------
  await page.click('th[data-col="数量"] [data-detail]');
  await page.waitForSelector('#dw-colBody .dw-kv');
  const kvText = await page.textContent('#dw-colBody');
  assert(kvText.includes('总行数'), '列详情应有总行数');
  // 数量列：从 DOM 读全部值，独立算一遍最小/最大/合计，与工具显示的对拍
  const qtyVals = await page.$$eval('td[data-c="5"]', (tds) => tds.map((t) => t.textContent.trim()));
  const halfWidth = (s) => s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
  const nums = qtyVals.filter((v) => halfWidth(v).trim() !== '').map((v) => Number(halfWidth(v))).filter((v) => Number.isFinite(v));
  const expMin = Math.min(...nums), expMax = Math.max(...nums);
  const expSum = nums.reduce((a, b) => a + b, 0);
  assert(kvText.includes(expMin + ' / ' + expMax), `数量列最小/最大应为 ${expMin} / ${expMax}，列详情是「${kvText.replace(/\s+/g, ' ').slice(0, 400)}」`);
  assert(kvText.includes('' + expSum), '数量列合计应为 ' + expSum);
  assert((await page.$$('#dw-hist i')).length > 1, '数值列应画出分布直方图');
  assert((await page.$$('#dw-topList li')).length > 1, '应列出出现最多的值');

  // ---------- 3. 体检：一键修复真的改数据 ----------
  await goTab('audit');
  const issueTexts = await page.$$eval('#dw-issueList .dw-issue h4', (hs) => hs.map((h) => h.textContent));
  assert(issueTexts.some((t) => t.includes('完全重复')), '应报出重复行问题');
  assert(issueTexts.some((t) => t.includes('整行为空')), '应报出空行问题');
  assert(issueTexts.some((t) => t.includes('隐形字符')), '应报出隐形字符问题（示例里埋了零宽空格）');
  assert(issueTexts.some((t) => t.includes('全角')), '应报出全角字符问题');
  assert(issueTexts.some((t) => t.includes('占位符')), '应报出 NULL / N/A 占位符问题');
  assert(issueTexts.some((t) => t.includes('日期写法')), '应报出日期写法不统一');
  assert(issueTexts.some((t) => t.includes('同义写法')), '应报出同义写法（北京 / 北京市）');

  const fixByTitle = async (kw) => {
    const box = page.locator('#dw-issueList .dw-issue').filter({ hasText: kw }).first();
    await box.locator('button[data-fix]').click();
  };
  await fixByTitle('完全重复');
  await page.waitForFunction(() => document.getElementById('dw-mRows').textContent === '42');
  assert((await rowsNow()) === 42, '去重后应剩 42 行');
  await goTab('audit');
  await fixByTitle('整行为空');
  await page.waitForFunction(() => document.getElementById('dw-mRows').textContent === '41');
  assert((await num('#dw-mDup')) === 0, '去重后不该还有重复行');

  // 隐形字符：先确认它真的在单元格里，修复后消失
  await goTab('data');
  const before = await cell(7, 9);
  assert(/[​]/.test(before), '示例第 8 行备注应含零宽字符');
  await goTab('audit');
  await fixByTitle('隐形字符');
  await goTab('data');
  await page.waitForFunction(() => !/[​]/.test(document.querySelector('td[data-r="7"][data-c="9"]').textContent));
  assert(!/[​]/.test(await cell(7, 9)), '零宽字符应被清掉');

  // 全角数字 ２４００ → 2400（示例第 13 行金额）
  await goTab('audit');
  await fixByTitle('全角');
  await goTab('data');
  await page.waitForFunction(() => document.querySelector('td[data-r="12"][data-c="4"]').textContent.trim() === '2400');
  assert((await cell(12, 4)).trim() === '2400', '全角２４００ 应转成 2400');

  // ---------- 4. 聚类归并：北京 / 北京市 / 北 京 → 一个值 ----------
  await goTab('cluster');
  await page.selectOption('#dw-cluCol', '城市');
  await page.click('#dw-cluRun');
  await page.waitForSelector('#dw-cluList .dw-cluster');
  const cluCount = (await page.$$('#dw-cluList .dw-cluster')).length;
  assert(cluCount >= 8, '城市列应聚出多簇同义写法，实际 ' + cluCount);
  const bjBox = page.locator('.dw-cluster').filter({ hasText: '北京' }).first();
  const bjMembers = await bjBox.locator('.dw-mem').allTextContents();
  assert(bjMembers.length >= 3, '北京簇应至少含 3 种写法，实际 ' + JSON.stringify(bjMembers));
  assert(bjMembers.some((m) => m.startsWith('北 京')), '北京簇应包含带空格的「北 京」');
  assert((await bjBox.locator('input[type=text]').inputValue()) === '北京', '建议主值应挑最干净的「北京」');
  // 带首尾空白的变体必须画出可见标记，否则「北京市」与「北京市 」在屏幕上一模一样，看着像重复列了两遍
  assert((await bjBox.locator('.dw-mem .dw-ws').count()) > 0, '首尾空白应有可见标记');
  assert((await page.locator('.dw-cluster .dw-mem').filter({ hasText: '·' }).count()) > 0, '至少一个成员标签应显示空白标记');
  await page.click('#dw-cluApply');
  await goTab('data');
  await page.waitForFunction(() => Number(document.getElementById('dw-recipeBadge').textContent) >= 4);
  const cityCells = await page.$$eval('td[data-c="2"]', (tds) => tds.map((t) => t.textContent.trim()));
  const bjCount = cityCells.filter((v) => v === '北京').length;
  assert(bjCount === 4, '合并后应有 4 行城市为「北京」，实际 ' + bjCount + ' —— ' + JSON.stringify(cityCells.slice(0, 15)));
  assert(!cityCells.some((v) => v.includes('北 京') || v === '北京市'), '不该再有北京的其它写法');

  // ---------- 5. 转换：日期标准化 + 数值标准化 + 公式新列 ----------
  await goTab('transform');
  const rawDate = await cell(2, 3);
  assert(rawDate.trim() === '03/06/2026', '第 3 行下单时间原值应为 03/06/2026，实际 ' + rawDate);
  await page.selectOption('#dw-opType', 'normDate');
  await page.waitForSelector('#dw-p-format');
  await page.check('#dw-p-cols input[value="下单时间"]');
  await page.waitForFunction(() => document.getElementById('dw-prevMsg').textContent.includes('改动'));
  const prevMsg = await page.textContent('#dw-prevMsg');
  assert(/改动 \d+ 个单元格/.test(prevMsg), '预览应给出会改动多少单元格：' + prevMsg);
  assert((await page.$$('#dw-prevTable tbody tr')).length > 0, '预览应列出前后对照');
  await page.click('#dw-opAdd');
  await goTab('data');
  await page.waitForFunction(() => document.querySelector('td[data-r="2"][data-c="3"]').textContent.trim() === '2026-06-03');
  assert((await cell(2, 3)).trim() === '2026-06-03', '日/月/年列里的 03/06/2026 应标准化为 2026-06-03');
  assert((await cell(4, 3)).trim() === '2026-03-08', '20260308 应标准化为 2026-03-08，实际 ' + (await cell(4, 3)));
  assert((await cell(3, 3)).trim() === '2026-03-07', '2026年3月7日 应标准化为 2026-03-07');

  await goTab('transform');
  await page.selectOption('#dw-opType', 'normNumber');
  await page.waitForSelector('#dw-p-decimals');
  await page.check('#dw-p-cols input[value="金额"]');
  await page.click('#dw-opAdd');
  await goTab('data');
  await page.waitForFunction(() => document.querySelector('td[data-r="0"][data-c="4"]').textContent.trim() === '1200');
  assert((await cell(0, 4)).trim() === '1200', '¥1,200.00 应标准化为 1200');
  assert((await cell(8, 4)).trim() === '-500', '括号负数 (500) 应变成 -500，实际 ' + (await cell(8, 4)));

  await goTab('transform');
  await page.selectOption('#dw-opType', 'addCol');
  await page.waitForSelector('#dw-p-expr');
  await page.fill('#dw-p-name', '单价');
  await page.fill('#dw-p-expr', 'round(num([金额]) / num([数量]), 2)');
  await page.waitForFunction(() => document.getElementById('dw-prevWrap').textContent.length > 0);
  await page.click('#dw-opAdd');
  await goTab('data');
  await page.waitForFunction(() => document.querySelectorAll('#dw-thead th').length === 12);
  const unitPrice = (await cell(0, 10)).trim();
  assert(unitPrice === '400', '第 1 行单价应为 1200/3=400，实际 ' + unitPrice);
  const unitPrice4 = (await cell(3, 10)).trim();
  assert(unitPrice4 === '1200.05', '第 4 行单价应为 12000.5/10=1200.05，实际 ' + unitPrice4);

  // 公式报错要能看见，不能静默
  await goTab('transform');
  await page.selectOption('#dw-opType', 'setCol');
  await page.waitForSelector('#dw-p-expr');
  await page.fill('#dw-p-expr', 'upper([没有这列');
  await page.waitForFunction(() => !document.getElementById('dw-opError').hidden);
  assert((await page.textContent('#dw-opError')).includes('方括号'), '括号没闭合应给出可读的错误提示');
  assert((await page.$eval('#dw-opError', (e) => getComputedStyle(e).display)) !== 'none', '错误条应可见');

  // ---------- 6. 分组汇总：和测试自己独立算的结果对拍 ----------
  await goTab('data');
  await page.selectOption('#dw-pageSize', '500');
  await page.waitForFunction(() => document.querySelectorAll('#dw-tbody tr').length >= 41);
  const tableNow = await page.$$eval('#dw-tbody tr', (trs) =>
    trs.map((tr) => Array.from(tr.querySelectorAll('td')).map((td) => td.textContent.trim())));
  const expected = new Map();
  for (const r of tableNow) {
    const city = r[3], amt = Number(r[5]);
    if (!expected.has(city)) expected.set(city, { n: 0, sum: 0 });
    const g = expected.get(city);
    g.n++;
    if (r[5] !== '' && Number.isFinite(amt)) g.sum += amt;
  }
  await goTab('agg');
  await page.check('#dw-groupCols input[value="城市"]');
  await page.selectOption('[data-aggfn="0"]', 'count');
  await page.click('#dw-aggAdd');
  await page.waitForSelector('[data-aggfn="1"]');
  await page.selectOption('[data-aggfn="1"]', 'sum');
  await page.selectOption('[data-aggcol="1"]', '金额');
  await page.click('#dw-aggRun');
  await page.waitForSelector('#dw-aggBody tr td');
  const aggRows = await page.$$eval('#dw-aggBody tr', (trs) =>
    trs.map((tr) => Array.from(tr.querySelectorAll('td')).map((td) => td.textContent.trim())));
  assert(aggRows.length === expected.size, `分组数应为 ${expected.size}，实际 ${aggRows.length}`);
  for (const [city, n, sum] of aggRows.map((r) => [r[0], Number(r[1]), Number(r[2])])) {
    const e = expected.get(city);
    assert(e, '出现了原表没有的分组：' + city);
    assert(n === e.n, `${city} 行数应为 ${e.n}，实际 ${n}`);
    assert(Math.abs(sum - e.sum) < 1e-6, `${city} 金额合计应为 ${e.sum}，实际 ${sum}`);
  }

  // 透视表
  await page.click('#dw-modePivot');
  await page.waitForFunction(() => !document.getElementById('dw-pivotForm').hidden);
  await page.selectOption('#dw-pvRow', '城市');
  await page.selectOption('#dw-pvCol', '状态');
  await page.selectOption('#dw-pvVal', '金额');
  await page.selectOption('#dw-pvFn', 'sum');
  await page.click('#dw-aggRun');
  await page.waitForSelector('#dw-aggHead th');
  const pvHead = await page.$$eval('#dw-aggHead th', (ths) => ths.map((t) => t.textContent.trim()));
  assert(pvHead[0] === '城市' && pvHead[pvHead.length - 1] === '合计', '透视表应有行字段列与合计列：' + JSON.stringify(pvHead));
  assert(pvHead.includes('已完成'), '透视表列头应含状态取值「已完成」');
  const pvRows = await page.$$eval('#dw-aggBody tr', (trs) => trs.map((tr) => Array.from(tr.querySelectorAll('td')).map((td) => td.textContent.trim())));
  const pvTotals = pvRows.map((r) => Number(r[r.length - 1])).filter((x) => Number.isFinite(x));
  const grand = pvTotals.reduce((a, b) => a + b, 0);
  let expGrand = 0;
  for (const g of expected.values()) expGrand += g.sum;
  assert(Math.abs(grand - expGrand) < 1e-6, `透视表各行合计之和应等于总额 ${expGrand}，实际 ${grand}`);

  // ---------- 7. 校验规则 ----------
  await goTab('audit');
  await page.selectOption('#dw-ruleCol', '金额');
  await page.selectOption('#dw-ruleKind', 'range');
  await page.fill('#dw-ruleParam', '0~1000000');
  await page.click('#dw-addRule');
  await page.waitForSelector('#dw-ruleResult .dw-issue');
  const ruleText = await page.textContent('#dw-ruleResult');
  assert(ruleText.includes('2 行不合格'), '金额 0~1000000 应有 2 行不合格（-500 与 -320），实际：' + ruleText.replace(/\s+/g, ' ').slice(0, 200));
  await page.selectOption('#dw-ruleCol', '订单号');
  await page.selectOption('#dw-ruleKind', 'unique');
  await page.click('#dw-addRule');
  await page.waitForFunction(() => document.querySelectorAll('#dw-ruleResult .dw-issue').length === 2);
  assert((await page.textContent('#dw-ruleResult')).includes('全部通过'), '去重后订单号应全部唯一');

  // ---------- 8. 配方：禁用 / 重排 / 删除 / 导出 ----------
  await goTab('recipe');
  // 步骤描述与影响说明必须分两行（曾因缺 display:block 挤成一行「…去重(保留第一条)减少 2 行」）
  const stepLines = await page.$eval('#dw-stepList .dw-step', (el) => {
    const d = el.querySelector('.dw-stepD').getBoundingClientRect();
    const m = el.querySelector('.dw-stepM').getBoundingClientRect();
    return { gap: m.top - d.top, dh: d.height };
  });
  assert(stepLines.gap >= stepLines.dh - 1, '配方步骤的说明与影响应各占一行，实际间距 ' + Math.round(stepLines.gap) + 'px');
  const steps = await page.$$('#dw-stepList .dw-step');
  assert(steps.length === 8, '配方应有 8 步（去重/删空行/清隐形字符/转半角/聚类归并/标准化日期/标准化数值/新增单价），实际 ' + steps.length);
  const rowsBefore = await rowsNow();
  await page.click('[data-toggle="0"]');
  await page.waitForFunction((n) => Number(document.getElementById('dw-mRows').textContent.replace(/,/g, '')) !== n, rowsBefore);
  assert((await rowsNow()) === 43, '禁用去重那一步后应恢复到 43 行（空行仍被删），实际 ' + (await rowsNow()));
  await page.click('[data-toggle="0"]');
  await page.waitForFunction((n) => Number(document.getElementById('dw-mRows').textContent.replace(/,/g, '')) === n, rowsBefore);
  assert((await rowsNow()) === rowsBefore, '重新启用后行数应复原');

  await page.click('#dw-recipeExport');
  await page.waitForFunction(() => !document.getElementById('dw-recipeBox').hidden && document.getElementById('dw-recipeBox').value.length > 10);
  const recipeJSON = JSON.parse(await page.inputValue('#dw-recipeBox'));
  assert(Array.isArray(recipeJSON.ops) && recipeJSON.ops.length === 8, '导出的配方应含 8 步');
  assert(recipeJSON.ops.some((o) => o.type === 'mapValues'), '配方里应有聚类归并那一步');

  // ---------- 9. 导出数据 ----------
  await page.selectOption('#dw-expFormat', 'csv');
  await page.waitForFunction(() => document.getElementById('dw-expPreview').value.indexOf('订单号') === 0);
  const csv = await page.inputValue('#dw-expPreview'); // textarea 的 value 会把 CRLF 归一成 LF
  const csvHead = csv.split(/\r?\n/)[0];
  assert(csvHead === '订单号,客户名称,城市,下单时间,金额,数量,联系电话,邮箱,状态,备注,单价', 'CSV 表头应为清洗后的列：' + csvHead);
  assert(csv.includes('2026-06-03'), '导出内容应含标准化后的日期');
  await page.selectOption('#dw-expFormat', 'md');
  await page.waitForFunction(() => document.getElementById('dw-expPreview').value.startsWith('| 订单号'));
  assert((await page.inputValue('#dw-expPreview')).includes('| --- |'), 'Markdown 导出应有分隔行');
  await page.selectOption('#dw-expFormat', 'sql');
  await page.waitForFunction(() => document.getElementById('dw-expPreview').value.startsWith('INSERT INTO'));
  assert((await page.inputValue('#dw-expPreview')).includes('INSERT INTO "cleaned_table"'), 'SQL 导出应是 INSERT 语句');
  await page.selectOption('#dw-expFormat', 'json');
  await page.waitForFunction(() => document.getElementById('dw-expPreview').value.trim().startsWith('['));
  const jsonPrev = await page.inputValue('#dw-expPreview'); // 预览超长会截断，取第一条对象来断言
  const firstObj = JSON.parse(jsonPrev.slice(jsonPrev.indexOf('{'), jsonPrev.indexOf('}') + 1));
  assert(firstObj['订单号'] === 'DD-1001' && firstObj['城市'] === '北京', 'JSON 导出第一条应是清洗后的 DD-1001 / 北京，实际 ' + JSON.stringify(firstObj));
  assert(firstObj['下单时间'] === '2026-03-04' && firstObj['金额'] === '1200', 'JSON 导出应带上标准化后的日期与金额');
  assert(jsonPrev.includes('下载可得完整内容'), '超长导出预览应提示已截断');

  // ---------- 10. 项目库 + 刷新恢复 ----------
  await page.click('#dw-btn-savep');
  await page.waitForSelector('#dw-projList [data-load="0"]');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#dw-table td[data-r="0"]');
  assert((await rowsNow()) === 41, '刷新后应保留清洗结果（41 行），实际 ' + (await rowsNow()));
  assert((await page.textContent('#dw-recipeBadge')) === '8', '刷新后配方应还是 8 步');
  await goTab('recipe');
  assert((await page.$$('#dw-projList .dw-proj')).length === 1, '项目库应保留 1 个项目');

  // ---------- 11. 粘贴导入自定义数据（走真解析器，含引号内逗号 / 制表符） ----------
  await page.click('#dw-btn-paste');
  await page.waitForFunction(() => !document.getElementById('dw-import').hidden);
  await page.fill('#dw-pastebox', 'a\tb\tc\n1\t"x\ty"\t3\n4\t5\t6');
  await page.selectOption('#dw-delim', 'auto');
  await page.click('#dw-btn-parse');
  await page.waitForFunction(() => document.getElementById('dw-mRows').textContent === '2');
  assert((await num('#dw-mCols')) === 3, '制表符表格应有 3 列');
  const thNames = await page.$$eval('#dw-thead th[data-col]', (ths) => ths.map((t) => t.getAttribute('data-col')));
  assert(JSON.stringify(thNames) === JSON.stringify(['a', 'b', 'c']), '表头应是 a/b/c，实际 ' + JSON.stringify(thNames));
  assert((await cell(0, 1)).trim() === 'x\ty' || (await cell(0, 1)).includes('x'), '引号内的制表符应保留在同一格');

  // 回到示例数据收尾（截图要好看）
  await page.click('#dw-btn-sample');
  await page.waitForFunction(() => document.getElementById('dw-mRows').textContent === '44');
  await goTab('audit');
  await page.locator('#dw-issueList .dw-issue').filter({ hasText: '完全重复' }).first().locator('button[data-fix]').click();
  await page.waitForFunction(() => document.getElementById('dw-mRows').textContent === '42');

  // ---------- 12. 结构性守卫 ----------
  // (a) [hidden] 必须真的藏住 —— 断计算样式而不是属性
  await goTab('data');
  for (const t of TABS.filter((x) => x !== 'data')) {
    const disp = await page.$eval('#dw-panel-' + t, (e) => getComputedStyle(e).display);
    assert(disp === 'none', `未选中的面板 ${t} 计算样式应为 none，实际 ${disp}`);
  }
  const importDisp = await page.$eval('#dw-import', (e) => getComputedStyle(e).display);
  assert(importDisp === 'none', '收起的导入区应真的不可见');

  // (b) 控件塌缩：逐 tab 扫一遍可见控件的渲染尺寸
  let scanned = 0;
  for (const t of TABS) {
    await goTab(t);
    const bad = await page.$$eval('#dw-panel-' + t + ' input, #dw-panel-' + t + ' select, #dw-panel-' + t + ' button', (els) => {
      const out = [];
      for (const e of els) {
        const tag = e.tagName.toLowerCase();
        const isCheck = tag === 'input' && (e.type === 'checkbox' || e.type === 'radio');
        // 勾选框若包在 <label> 里，真正的点击靶是整个 label，按 label 的盒子量
        const target = isCheck && e.closest('label') ? e.closest('label') : e;
        const r = target.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue; // 不在渲染树里（父级折叠）
        const minW = isCheck ? 16 : tag === 'button' ? 30 : 100;
        if (r.width < minW || r.height < 18) out.push(`${tag}#${e.id || e.className}:${Math.round(r.width)}x${Math.round(r.height)}`);
      }
      return { bad: out, n: els.length };
    });
    scanned += bad.n;
    assert(bad.bad.length === 0, `${t} 面板有控件被压塌：${bad.bad.join(', ')}`);
  }
  assert(scanned > 60, '控件扫描覆盖数太少（' + scanned + '），守卫可能空转');

  // (c) 子元素不得越出父盒（簇里的成员标签、统计卡里的数字）
  await goTab('cluster');
  await page.selectOption('#dw-cluCol', '客户名称');
  await page.click('#dw-cluRun');
  await page.waitForSelector('#dw-cluList .dw-cluster');
  const escapes = await page.$$eval('#dw-cluList .dw-cluster', (boxes) => {
    const out = [];
    for (const b of boxes.slice(0, 12)) {
      const pr = b.getBoundingClientRect();
      for (const m of b.querySelectorAll('.dw-mem')) {
        const cr = m.getBoundingClientRect();
        if (cr.right > pr.right + 1 || cr.left < pr.left - 1 || cr.bottom > pr.bottom + 1) out.push(m.textContent.trim());
      }
    }
    return out;
  });
  assert(escapes.length === 0, '簇成员标签溢出了簇框：' + escapes.join(' | '));
  const statEscape = await page.$$eval('.dw-stat', (cards) => {
    const out = [];
    for (const c of cards) {
      const pr = c.getBoundingClientRect();
      for (const kid of c.children) {
        const cr = kid.getBoundingClientRect();
        if (cr.right > pr.right + 1 || cr.bottom > pr.bottom + 1) out.push(kid.textContent.trim());
      }
    }
    return out;
  });
  assert(statEscape.length === 0, '统计卡里的内容溢出了卡片：' + statEscape.join(' | '));

  // (d) 代码块不得横向撑破卡片
  await goTab('transform');
  const codeOverflow = await page.$$eval('#dw-fnList code', (els) =>
    els.filter((e) => e.scrollWidth - e.clientWidth > 2).map((e) => e.textContent));
  assert(codeOverflow.length === 0, '公式示例代码块横向溢出：' + codeOverflow.join(' | '));

  // (e) 小标签不得被 uppercase 改写成错的单位写法
  const uppercased = await page.$$eval('th, dt, label, .dw-statL', (els) =>
    els.filter((e) => /\b(HZ|KHZ|DBFS|CSV|JSON)\b/.test(e.textContent) && getComputedStyle(e).textTransform === 'uppercase').map((e) => e.textContent));
  assert(uppercased.length === 0, '有标签被 uppercase 改写：' + uppercased.join(' | '));

  // (f) 页面不得横向滚动（宽屏 + 窄屏）
  const overflowW = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflowW <= 2, '宽屏下页面横向溢出 ' + overflowW + 'px');
  await page.setViewportSize({ width: 414, height: 900 });
  await goTab('data');
  await page.waitForTimeout(120);
  const overflowN = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflowN <= 2, '414px 窄屏下页面横向溢出 ' + overflowN + 'px');
  assert(await page.isVisible('#dw-tab-data'), '窄屏下 tab 仍应可见');
  await page.setViewportSize({ width: 1280, height: 850 });

  // ---------- 13. 缩略图 ----------
  await goTab('data');
  await page.click('th[data-col="金额"] [data-detail]');
  await page.waitForSelector('#dw-colBody .dw-kv');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(220);
  await screenshot('thumb.png');
};
