// 集成测试 · 复式记账工作台 · Ledger Lab
// 每一个数值期望都先用引擎/oracle 实算过再写进来（见 run 目录 offline.mjs 与 oracle/）。
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.getAttribute('data-ll-ready') === '1');

  const txt = async (sel) => ((await page.locator(sel).textContent()) || '').trim();
  const num = async (sel) => Number((await txt(sel)).replace(/[,%\s]/g, ''));
  const TABS = ['ledger', 'reports', 'holdings', 'query', 'import', 'about'];
  const showTab = async (name) => {
    await page.click(`#ll-tabbtn-${name}`);
    await page.waitForFunction((n) => !document.getElementById('ll-panel-' + n).hidden, name);
  };
  const cellText = async (table, row, col) =>
    ((await page.locator(`${table} tbody tr:nth-child(${row}) td:nth-child(${col})`).textContent()) || '').trim();

  // ---------- 1. 骨架 ----------
  assert((await page.locator('#ll-back').getAttribute('href')) === '../../', '顶部有「← 返回工具集」且指向站点根');
  assert((await txt('#ll-back')).includes('返回工具集'), '返回链接文案正确');

  // ---------- 2. 账本面板：默认示例的体检与统计 ----------
  assert((await txt('#ll-status')).includes('账实相符'), '默认示例账本全部配平（状态徽章）');
  assert((await txt('#ll-status')).includes('13 笔'), '状态徽章报出 13 笔交易');
  const statsText = (await txt('#ll-stats')).replace(/\s+/g, ' ');
  assert(statsText.includes('13 笔') && statsText.includes('31 条') && statsText.includes('13 个'),
    `账本概况：13 笔交易 / 31 条分录 / 13 个账户（实得 ${statsText.slice(0, 80)}）`);
  assert((await txt('#ll-errlist')).includes('没有发现问题'), '体检面板显示无问题');
  // 断言表：两条 balance 都通过（差额 0）
  assert((await page.locator('#ll-asserts tbody tr').count()) === 2, '余额断言表有 2 行');
  assert((await cellText('#ll-asserts', 1, 3)) === '1,812.00 CNY', '第一条断言的目标值是 1,812.00 CNY');
  assert((await cellText('#ll-asserts', 1, 5)) === '0.00', '第一条断言差额为 0');
  assert((await cellText('#ll-asserts', 2, 3)) === '2,300 ETF300', '第二条断言的目标值是 2,300 ETF300');
  assert((await txt('#ll-asserts')).includes('通过'), '断言状态列显示「通过」');

  // ---------- 3. 改账本 → 当场报错 → 改回来 ----------
  const original = await page.locator('#ll-source').inputValue();
  // 挑一笔两条腿都写死了金额的（换汇那笔）——如果挑带「自动补齐腿」的交易，多记的钱会被那条腿吸收掉，根本不会报错
  assert(original.includes('  Assets:Bank:DBS         3704.00 SGD'), '示例账本里有换汇那一笔（两条腿都是写死的金额）');
  await page.locator('#ll-source').fill(original.replace('  Assets:Bank:DBS         3704.00 SGD', '  Assets:Bank:DBS         3705.00 SGD'));
  await page.waitForFunction(() => document.getElementById('ll-status').textContent.includes('处问题'));
  assert((await page.locator('#ll-errlist .ll-erritem').count()) >= 1, '换汇那一腿多写 1 SGD 就会立刻报「不平」');
  assert((await txt('#ll-errlist')).includes('交易两边不平'), `错误文案点明了两边不平（实得 ${(await txt('#ll-errlist')).slice(0, 60)}）`);
  await page.locator('#ll-source').fill(original);
  await page.waitForFunction(() => document.getElementById('ll-status').textContent.includes('账实相符'));

  // ---------- 4. 报表：资产负债表 / 利润表 ----------
  await showTab('reports');
  // 市值口径（价格表：ETF300 4.402、SGD 5.402）
  assert((await txt('#ll-bs')).includes('211,133.91'), '市值口径下资产合计 211,133.91 CNY');
  assert((await txt('#ll-bs-unreal')) === '856.60', `未实现损益 856.60 = 2300 × (4.402 − 4.0296)（实得 ${await txt('#ll-bs-unreal')}）`);
  // CTA 手算：20000 CNY 按 0.1852 换成 3704 SGD，报表按 5.402 折回来 = 20009.008 ⇒ 差 9.008
  assert((await txt('#ll-bs-cta')) === '9.01', `折算差额 CTA = 9.01（3704 × 5.402 − 20000 = 9.008，实得 ${await txt('#ll-bs-cta')}）`);
  assert((await txt('#ll-bs-check')) === '0.00', '资产 − 负债 − 权益 = 0');
  assert((await txt('#ll-is-income')) === '92,588.00', '收入合计 92,588.00');
  assert((await txt('#ll-is-expense')) === '23,659.30', '支出合计 23,659.30');
  assert((await txt('#ll-is-net')) === '68,928.70', '本期结余 68,928.70');
  assert((await txt('#ll-is-rate')) === '74.4%', '储蓄率 74.4%');
  // 切成本口径：资产应少掉未实现损益那一截
  await page.selectOption('#ll-mode', 'cost');
  await page.waitForFunction(() => document.getElementById('ll-bs-unreal').textContent === '0.00');
  assert((await txt('#ll-bs')).includes('210,277.31'), `成本口径资产 210,277.31 = 211,133.91 − 856.60（实得 ${(await txt('#ll-bs')).slice(0, 40)}）`);
  assert((await txt('#ll-bs-cta')) === '9.01', '折算差额与口径无关（换汇本身的差额）');
  await page.selectOption('#ll-mode', 'market');
  await page.waitForFunction(() => document.getElementById('ll-bs-unreal').textContent === '856.60');
  // 试算平衡：按权重的差额必须恒为 0
  const tbalRow = (await txt('#ll-tbal-net')).replace(/\s+/g, ' ');
  assert(/0\.00.*0\.00/.test(tbalRow), `试算平衡差额两种货币都是 0.00（实得 ${tbalRow}）`);
  assert((await txt('#ll-tbal')).includes('223,665.60'), '借方合计 223,665.60 CNY');
  // 逐月收支
  assert((await page.locator('#ll-monthly tbody tr').count()) === 3, '逐月收支 3 行');
  assert((await cellText('#ll-monthly', 1, 2)) === '28,500.00', '2024-01 收入 28,500.00');
  assert((await cellText('#ll-monthly', 1, 3)) === '20,891.30', '2024-01 支出 20,891.30 = 20400 + 5 + 486.30');
  assert((await cellText('#ll-monthly', 2, 4)) === '61,320.00', '2024-02 结余 61,320.00');
  // 现金流向：工资是流入（正），房租是流出（负）
  const cash = (await txt('#ll-cashflow')).replace(/\s+/g, '');
  assert(cash.includes('Income:Salary92,000.00') && cash.includes('Expenses:Rent-20,400.00'),
    `现金流向的符号：工资 +92,000、房租 −20,400（实得 ${cash.slice(0, 90)}）`);

  // ---------- 5. 持仓与批次 ----------
  await showTab('holdings');
  assert((await cellText('#ll-hold', 1, 3)) === '2,300', '持仓份额 2,300 = 2000 + 1500 − 1200');
  assert((await cellText('#ll-hold', 1, 4)) === '4.0296', '平均成本 4.0296 = 9268 / 2300');
  assert((await cellText('#ll-hold', 1, 5)) === '9,268.00 CNY', '成本基础 9,268.00');
  assert((await cellText('#ll-hold', 1, 7)) === '10,124.60', '市值 10,124.60 = 2300 × 4.402');
  assert((await cellText('#ll-hold', 1, 8)).startsWith('856.60'), '浮动盈亏 856.60');
  assert((await page.locator('#ll-lots tbody tr').count()) === 2, '剩两个批次（1 月那批被 FIFO 减掉 1200）');
  assert((await cellText('#ll-lots', 1, 3)) === '800' && (await cellText('#ll-lots', 1, 5)) === '2024-01-15',
    'FIFO 先减 1 月那批：2000 − 1200 = 800 份还在');
  assert((await cellText('#ll-lots', 2, 3)) === '1,500' && (await cellText('#ll-lots', 2, 4)) === '4.1200 CNY',
    '2 月那批 1500 份原样保留');
  // 已实现损益
  assert((await cellText('#ll-trades', 1, 5)) === '53', '持有天数 53（2024-01-15 → 2024-03-08）');
  assert((await cellText('#ll-trades', 1, 6)) === '4,632.00 CNY', '卖出成本 4,632.00 = 1200 × 3.86');
  assert((await cellText('#ll-trades', 1, 7)) === '5,220.00', '卖出所得 5,220.00 = 1200 × 4.35');
  assert((await txt('#ll-trade-total')) === '588.00', '已实现损益合计 588.00');
  // 批次法对照（同一份账本换 booking 方法重跑）
  const methodCells = {};
  for (let i = 0; i < 5; i++) {
    const name = (await cellText('#ll-methods', i + 1, 1)).trim();
    methodCells[name] = { gain: await cellText('#ll-methods', i + 1, 2), basis: await cellText('#ll-methods', i + 1, 3), lots: await cellText('#ll-methods', i + 1, 4) };
  }
  assert(methodCells.FIFO.gain === '588.00', `FIFO 已实现损益 588.00 = 1200 × (4.35 − 3.86)（实得 ${methodCells.FIFO.gain}）`);
  assert(methodCells.LIFO.gain === '276.00', `LIFO 276.00 = 1200 × (4.35 − 4.12)（实得 ${methodCells.LIFO.gain}）`);
  assert(methodCells.HIFO.gain === '276.00', 'HIFO 与 LIFO 同（4.12 就是最高成本批次）');
  assert(methodCells.AVERAGE.gain === '454.29', `加权平均 454.29 = 1200 × (4.35 − 13900/3500)（实得 ${methodCells.AVERAGE.gain}）`);
  assert(methodCells.AVERAGE.lots === '1', '加权平均法下批次被合并成 1 个');
  assert(methodCells.FIFO.lots === '2', 'FIFO 下剩 2 个批次');
  assert(methodCells.STRICT.gain === '—' && (await cellText('#ll-methods', 1, 5)).includes('报错'),
    'STRICT 下这笔减仓有歧义，直接报错（这正是它存在的意义）');
  assert(methodCells.AVERAGE.basis === '9,134.29', '加权平均期末成本基础 9,134.29 = 2300 × 3.9714285714…');

  // ---------- 6. 查询 ----------
  await showTab('query');
  assert((await page.locator('#ll-qres tbody tr').count()) === 11, '默认查询进页面就已经跑出 11 行');
  assert((await cellText('#ll-qres', 1, 1)) === 'Income:Salary', '按合计升序，工资科目排第一');
  assert((await cellText('#ll-qres', 1, 2)) === '-92,000.00', '工资合计 −92,000.00');
  await page.locator('#ll-sql').fill('SELECT sum(number) AS 总额 WHERE account ~ "^Expenses" AND currency = "CNY"');
  await page.click('#ll-run');
  await page.waitForFunction(() => document.querySelectorAll('#ll-qres tbody tr').length === 1);
  assert((await cellText('#ll-qres', 1, 1)) === '23,659.30', `中文别名 + 正则筛选：支出合计 23,659.30（实得 ${await cellText('#ll-qres', 1, 1)}）`);
  await page.locator('#ll-sql').fill('SELECT date, narration, number WHERE "travel" IN tags AND account ~ "^Expenses"');
  await page.click('#ll-run');
  await page.waitForFunction(() => document.querySelectorAll('#ll-qres tbody tr').length === 1);
  assert((await cellText('#ll-qres', 1, 3)) === '2,180.00', '按标签查：#travel 那笔支出 2,180.00');
  // 写错的查询要给出可读的错误，而不是白屏
  await page.locator('#ll-sql').fill('SELECT nosuchcolumn FROM');
  await page.click('#ll-run');
  await page.waitForFunction(() => !document.getElementById('ll-qerr').hidden);
  assert((await txt('#ll-qerr')).includes('查询没跑通'), '语法错误有明确提示');
  await page.selectOption('#ll-examples', '1');
  await page.waitForFunction(() => document.getElementById('ll-qerr').hidden);
  assert((await page.locator('#ll-qres tbody tr').count()) === 3, '示例「按月看支出」出 3 行');

  // ---------- 7. 流水导入 ----------
  await showTab('import');
  await page.click('#ll-csv-sample');
  await page.waitForFunction(() => document.querySelectorAll('#ll-imp-table tbody tr').length > 0);
  assert((await page.locator('#ll-imp-table tbody tr').count()) === 9, '示例流水 9 行全部认出来（收入/支出分两列也要认）');
  assert((await txt('#ll-imp-sub')).includes('认出 9 笔'), '预览说明里写明认出 9 笔');
  assert((await cellText('#ll-imp-table', 1, 5)) === 'Income:Salary', '「工资」按规则归到 Income:Salary');
  assert((await cellText('#ll-imp-table', 2, 4)) === '-286.40', '支出列的金额自动带负号');
  assert((await cellText('#ll-imp-table', 2, 5)) === 'Expenses:Food', '「永辉超市」归到 Expenses:Food');
  assert((await cellText('#ll-imp-table', 9, 5)) === 'Expenses:Health', '「某医院门诊」归到 Expenses:Health');
  assert((await txt('#ll-imp-out')).includes('2024-04-01 * "某某科技有限公司" "工资"'), '生成的账本文本是标准写法');
  assert((await txt('#ll-imp-out')).includes('open Expenses:Health') && (await txt('#ll-imp-out')).includes('open Income:Refund'),
    '账本里还没有的科目会自动补 open 指令（否则一粘进去就是一片「没有 open 过」）');
  assert((await txt('#ll-imp-sub')).includes('2 个账户账本里还没有'), '预览里点名说明要补几个账户');
  assert(!(await txt('#ll-imp-out')).includes('28,500.00'), '生成的金额不带千分位（贴回账本更干净）');
  // 追加进账本 → 交易数变多且仍然全部配平
  await page.click('#ll-imp-append');
  await page.waitForFunction(() => document.getElementById('ll-status').textContent.includes('22 笔'));
  assert((await txt('#ll-status')).includes('账实相符'), '导入的 9 笔追加进账本后依然全部配平');
  // 再导一次：全部被标成疑似重复
  await showTab('import');
  await page.click('#ll-csv-sample');
  await page.waitForFunction(() => (document.getElementById('ll-imp-sub').textContent || '').includes('重复'));
  assert((await txt('#ll-imp-sub')).includes('9 笔与账本里已有的重复'), '第二次导入时 9 笔全部被识别为重复');
  assert((await txt('#ll-imp-out')).includes('没有要追加的交易'), '勾选「跳过疑似重复」后没有可追加的内容');

  // ---------- 8. 换示例账本：pad 与故障演示 ----------
  await showTab('ledger');
  await page.selectOption('#ll-sample', 'freelance');
  await page.click('#ll-load-sample');
  await page.waitForFunction(() => document.getElementById('ll-status').textContent.includes('账实相符'));
  assert((await txt('#ll-stats')).includes('1 笔'), 'pad 自动补了 1 笔差额交易');
  assert((await page.locator('#ll-asserts tbody tr').count()) === 2, '自由职业示例有 2 条断言');
  assert((await cellText('#ll-asserts', 1, 5)) === '0.00', 'pad 之后断言差额为 0');
  await page.selectOption('#ll-sample', 'broken');
  await page.click('#ll-load-sample');
  await page.waitForFunction(() => document.getElementById('ll-status').textContent.includes('处问题'));
  assert((await page.locator('#ll-errlist .ll-erritem').count()) === 8, `故障演示账本恰好 8 处问题（实得 ${await page.locator('#ll-errlist .ll-erritem').count()}）`);
  const brokenText = (await txt('#ll-errlist')).replace(/\s+/g, '');
  for (const kw of ['交易两边不平', '只允许USD', '没有open过的账户', '无法判断减的是哪一批', '最多只能有一条', 'balance断言不成立']) {
    assert(brokenText.includes(kw), `故障演示覆盖到「${kw}」这一类问题`);
  }
  // 点行号能跳到出问题的那一行：选中的文本必须正好等于账本里的第 N 行
  const firstLineNo = Number(((await page.locator('#ll-errlist .ll-errline').first().textContent()) || '').replace(/\D/g, ''));
  assert(firstLineNo === 13, `第一处问题在第 13 行（不平的那笔交易抬头，实得第 ${firstLineNo} 行）`);
  await page.locator('#ll-errlist .ll-errline').first().click();
  const jump = await page.evaluate(() => {
    const ta = document.getElementById('ll-source');
    const n = Number(document.querySelector('#ll-errlist .ll-errline').textContent.replace(/\D/g, ''));
    return { sel: ta.value.slice(ta.selectionStart, ta.selectionEnd), want: ta.value.split('\n')[n - 1] };
  });
  assert(jump.sel === jump.want && jump.sel.length > 0, `点错误行号会精确选中那一行（选中「${jump.sel}」，第 N 行是「${jump.want}」）`);
  await page.selectOption('#ll-sample', 'personal');
  await page.click('#ll-load-sample');
  await page.waitForFunction(() => document.getElementById('ll-status').textContent.includes('账实相符'));

  // ---------- 9. 格式化：打印回去再读回来，账不变 ----------
  const beforeFmt = await txt('#ll-status');
  await page.click('#ll-format');
  await page.waitForTimeout(120);
  assert((await txt('#ll-status')) === beforeFmt, '格式化之后账本状态不变（打印器往返不丢东西）');
  await showTab('holdings');
  assert((await cellText('#ll-hold', 1, 5)) === '9,268.00 CNY', '格式化之后成本基础仍是 9,268.00');

  // ---------- 10. 说明页：能力清单逐项现场跑通 ----------
  await showTab('about');
  const caps = await page.evaluate(() => window.LL_CAPS.map((c) => {
    let okv = false;
    try { okv = !!c.probe(); } catch (e) { okv = false; }
    return { id: c.id, ok: okv };
  }));
  const dead = caps.filter((c) => !c.ok).map((c) => c.id);
  assert(dead.length === 0, `能力清单里有 ${dead.length} 项跑不通：${dead.join(' / ')}`);
  assert(caps.length === 40, `能力清单共 40 项（实得 ${caps.length}）`);
  assert((await page.locator('#ll-cap-table tbody tr').count()) === caps.length, '表里的行数与清单项数一致');
  assert((await txt('#ll-kv-capspass')) === caps.length + ' 项', '页面公布的「现场自检通过」= 浏览器里逐项跑出来的项数');
  // 验证规模：钉死离线套件实测出来的字面量（异源核对：改任何一行都会红）
  assert((await num('#ll-verify-total')) === 11807, `页面公布的离线对拍总数应为 11807（实得 ${await num('#ll-verify-total')}）`);
  assert((await num('#ll-verify-n-1')) === 6436, 'beancount 逐字段那一行是 6436 条');
  assert((await num('#ll-verify-n-3')) === 2440, 'hledger 那一行是 2440 条');
  assert((await page.locator('#ll-verify-table tbody tr').count()) === 6, '验证表 5 行来源 + 1 行合计');
  const caliber = await txt('#ll-caliber');
  assert(caliber.includes('AVERAGE') && caliber.includes('not supported'), '口径页写明了 beancount 的 AVERAGE 会直接报 not supported、本工具把它实现成扩展');
  assert(caliber.includes('TypeError'), '口径页给出了 beancount 丢批次日期那个 bug 的具体表现');

  // ---------- 11. 通用守卫 ----------
  // (a) markdown 记号不得泄漏
  const mdLeak = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('#ll-panel-about *, #ll-panel-ledger *').forEach((el) => {
      if (el.children.length) return;
      if (/\*\*/.test(el.textContent || '')) out.push(el.tagName + ':' + (el.textContent || '').slice(0, 40));
    });
    return out;
  });
  assert(mdLeak.length === 0, `页面上出现了未渲染的 markdown 记号：${mdLeak.join(' | ')}`);
  // (b) 单位符号不得被 uppercase 改写
  const upper = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('th,dt,label').forEach((el) => {
      if (/\b(HZ|KHZ|DBFS|DB)\b/.test(el.textContent || '')) out.push((el.textContent || '').slice(0, 40));
    });
    return out;
  });
  assert(upper.length === 0, `疑似被 uppercase 改写的单位：${upper.join(' | ')}`);
  // (c) 控件塌缩守卫：逐个标签页扫
  let scanned = 0;
  for (const t of TABS) {
    await showTab(t);
    const bad = await page.evaluate((tab) => {
      const out = [];
      let n = 0;
      document.querySelectorAll(`#ll-panel-${tab} input, #ll-panel-${tab} select, #ll-panel-${tab} button, #ll-panel-${tab} textarea`).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        n++;
        const isCheck = el.type === 'checkbox';
        const isDate = el.type === 'date';
        const minW = isCheck ? 12 : el.tagName === 'BUTTON' ? 52 : isDate ? 90 : 100;
        if (r.width < minW || r.height < 18) out.push(`${tab}:${el.id || el.className}=${r.width.toFixed(0)}x${r.height.toFixed(0)}(需≥${minW}x18)`);
      });
      return { out, n };
    }, t);
    scanned += bad.n;
    assert(bad.out.length === 0, `控件塌缩：${bad.out.join(' | ')}`);
    // 每页至少要扫到东西（防「选择器写错也算绿」）：持仓页只有一个账户下拉，说明页是纯文本
    const floor = { ledger: 4, reports: 5, holdings: 1, query: 3, import: 10, about: 0 }[t];
    assert(bad.n >= floor, `「${t}」页至少要扫到 ${floor} 个可见控件（实得 ${bad.n}）`);
  }
  assert(scanned >= 30, `逐页扫到的可见控件数应 ≥ 30（实得 ${scanned}）`);
  // (d) 窄屏横向溢出守卫：逐视口 × 逐标签页
  for (const vw of [390, 768]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of TABS) {
      await showTab(t);
      const over = await page.evaluate(() => {
        const de = document.documentElement;
        const delta = de.scrollWidth - de.clientWidth;
        if (delta <= 1) return { delta: 0, who: '' };
        let who = '', worst = 0;
        document.querySelectorAll('body *').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.right > de.clientWidth + 1 && r.width > 0 && r.right > worst) {
            worst = r.right;
            who = el.tagName + (el.id ? '#' + el.id : '.' + String(el.className).split(' ')[0]);
          }
        });
        return { delta, who: who + '@' + worst.toFixed(0) };
      });
      assert(over.delta === 0, `${vw}px 下「${t}」页横向溢出 ${over.delta}px，元凶 ${over.who}`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  // (e) tab 切换真的把别的面板藏起来（断计算样式）
  await showTab('reports');
  const disp = await page.evaluate((tabs) => tabs.map((t) => [t, getComputedStyle(document.getElementById('ll-panel-' + t)).display]), TABS);
  const visible = disp.filter((d) => d[1] !== 'none').map((d) => d[0]);
  assert(visible.length === 1 && visible[0] === 'reports', `只有当前面板可见（实际可见：${visible.join(',')}）`);
  // (f) 图：真的画出了标签，且没有两段文字互相压住
  for (const [tab, ids] of [['reports', ['ll-fig-networth', 'll-fig-monthly', 'll-fig-expense']]]) {
    await showTab(tab);
    for (const id of ids) {
      const fig = await page.evaluate((fid) => {
        const el = document.getElementById(fid);
        const els = [...el.querySelectorAll('text')];
        const rs = els.map((e) => { const r = e.getBoundingClientRect(); return { t: e.textContent, x: r.left, y: r.top, x2: r.right, y2: r.bottom }; });
        const hits = [];
        for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) {
          const a = rs[i], b = rs[j];
          if (Math.min(a.x2, b.x2) - Math.max(a.x, b.x) > 1 && Math.min(a.y2, b.y2) - Math.max(a.y, b.y) > 1) hits.push(`${a.t} × ${b.t}`);
        }
        return { drawn: Number(el.getAttribute('data-drawn') || 0), dropped: Number(el.getAttribute('data-dropped') || 0), n: rs.length, hits };
      }, id);
      assert(fig.drawn >= 5, `${id} 至少画出 5 段文字（实得 ${fig.drawn}）`);
      assert(fig.dropped === 0, `${id} 不该有被挤掉的标签（掉了 ${fig.dropped}）`);
      assert(fig.n >= fig.drawn, `${id} 的 <text> 数量与避让器计数对得上`);
      assert(fig.hits.length === 0, `${id} 里有文字互相压住：${fig.hits.slice(0, 3).join(' | ')}`);
    }
  }
  // (f2) 密集数据：24 个月的账本会让月份标签挤在一起 —— 避让器必须真的丢掉一些，且留下的两两不重叠
  await showTab('ledger');
  const dense = ['option "operating_currency" "CNY"', '2022-12-01 open Assets:Cash', '2022-12-01 open Income:Salary', ''];
  for (let y = 2023; y <= 2024; y++) {
    for (let m = 1; m <= 12; m++) {
      const mm = String(m).padStart(2, '0');
      dense.push(`${y}-${mm}-15 * "月薪"`, '  Assets:Cash   1000.00 CNY', '  Income:Salary', '');
    }
  }
  await page.locator('#ll-source').fill(dense.join('\n'));
  await page.waitForFunction(() => document.getElementById('ll-status').textContent.includes('24 笔'));
  await showTab('reports');
  const denseFig = await page.evaluate(() => {
    const el = document.getElementById('ll-fig-networth');
    const rs = [...el.querySelectorAll('text')].map((e) => { const r = e.getBoundingClientRect(); return { t: e.textContent, x: r.left, y: r.top, x2: r.right, y2: r.bottom }; });
    const hits = [];
    for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) {
      const a = rs[i], b = rs[j];
      if (Math.min(a.x2, b.x2) - Math.max(a.x, b.x) > 1 && Math.min(a.y2, b.y2) - Math.max(a.y, b.y) > 1) hits.push(`${a.t} × ${b.t}`);
    }
    return { drawn: Number(el.getAttribute('data-drawn')), dropped: Number(el.getAttribute('data-dropped')), hits };
  });
  assert(denseFig.dropped > 0, `24 个月的账本下避让器必须真的丢掉一些月份标签（实得 dropped=${denseFig.dropped}）`);
  assert(denseFig.drawn >= 8, `仍然要画出至少 8 段文字（实得 ${denseFig.drawn}）`);
  assert(denseFig.hits.length === 0, `密集数据下图上的文字仍然两两不重叠：${denseFig.hits.slice(0, 3).join(' | ')}`);
  await showTab('ledger');
  await page.selectOption('#ll-sample', 'personal');
  await page.click('#ll-load-sample');
  await page.waitForFunction(() => document.getElementById('ll-status').textContent.includes('13 笔'));
  await showTab('reports');

  // 净值曲线必须两条线都画出来（成本虚线 + 市值实线）
  const paths = await page.evaluate(() => [...document.querySelectorAll('#ll-fig-networth path')].map((p) => p.getAttribute('stroke-dasharray') || 'solid'));
  assert(paths.filter((p) => p !== 'solid').length >= 1 && paths.length >= 3, `净值曲线有实线 + 虚线两条（实得 ${paths.join(',')}）`);

  // ---------- 12. 缩略图 ----------
  await showTab('reports');
  await page.evaluate(() => { const c = document.getElementById('ll-fig-networth').closest('.ll-card'); window.scrollTo(0, c.getBoundingClientRect().top + window.scrollY - 104); });
  await page.waitForTimeout(200);
  await screenshot('thumb.png');
}
