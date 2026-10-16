/* 订阅账本 · 集成测试
 *
 * 数值真值全部来自 run 目录 oracle/ui_truth.py（Python datetime/calendar + Fraction 独立实现，
 * 不调用页面引擎），由 inject-oracle.mjs 机械注入 ORACLE 块；本文件不手写任何计算真值。
 * 少数 RFC 5545 写法字面量（BYMONTHDAY=-1 / BYSETPOS=-1 / TRIGGER:-P2D）是规范本身的表达，单独注明。
 * 页面用 ?today=2026-10-16 钉住「今天」。渲染守卫 import（render-guards.mjs）。
 */
import { renderGuards } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs';

const ORACLE = {
 "meta": {
  "tabs": [
   "home",
   "subs",
   "cal",
   "plan",
   "data",
   "set"
  ],
  "today": "2026-10-16"
 },
 "hero": "¥668.04",
 "heroUSD": "$93.83",
 "yr": "¥8,016.52",
 "nActive": 10,
 "k30": "¥1,409.81",
 "c30": 8,
 "y365": "¥8,173.54",
 "monPaid": "¥409.40",
 "monAll": "¥687.81",
 "topName": "健身房",
 "topV": "¥216.32",
 "upcoming": [
  [
   "2026-10-20",
   "spotify"
  ],
  [
   "2026-10-25",
   "duo"
  ],
  [
   "2026-10-28",
   "domain"
  ],
  [
   "2026-10-31",
   "icloud"
  ],
  [
   "2026-11-03",
   "claude"
  ],
  [
   "2026-11-08",
   "copilot"
  ],
  [
   "2026-11-09",
   "gym"
  ],
  [
   "2026-11-12",
   "netflix"
  ],
  [
   "2026-11-20",
   "spotify"
  ]
 ],
 "cats": [
  [
   "效率工具",
   "¥241.08 · 36%",
   1
  ],
  [
   "健康",
   "¥216.32 · 32%",
   0.8972783057754826
  ],
  [
   "影音",
   "¥153.37 · 23%",
   0.6361689661787657
  ],
  [
   "学习",
   "¥26.78 · 4%",
   0.11106790344295983
  ],
  [
   "云存储",
   "¥21.00 · 3%",
   0.08710665899298481
  ],
  [
   "游戏",
   "¥9.49 · 1%",
   0.0393777404463525
  ]
 ],
 "months": [
  {
   "label": "2026-10",
   "total": 68781,
   "n": 7,
   "keep": 54541,
   "totalS": "¥687.81",
   "keepS": "¥545.41"
  },
  {
   "label": "2026-11",
   "total": 123777,
   "n": 6,
   "keep": 38337,
   "totalS": "¥1,237.77",
   "keepS": "¥383.37"
  },
  {
   "label": "2026-12",
   "total": 63969,
   "n": 6,
   "keep": 49729,
   "totalS": "¥639.69",
   "keepS": "¥497.29"
  },
  {
   "label": "2027-01",
   "total": 60610,
   "n": 6,
   "keep": 46370,
   "totalS": "¥606.10",
   "keepS": "¥463.70"
  },
  {
   "label": "2027-02",
   "total": 95212,
   "n": 6,
   "keep": 80972,
   "totalS": "¥952.12",
   "keepS": "¥809.72"
  },
  {
   "label": "2027-03",
   "total": 72477,
   "n": 6,
   "keep": 58237,
   "totalS": "¥724.77",
   "keepS": "¥582.37"
  },
  {
   "label": "2027-04",
   "total": 60610,
   "n": 6,
   "keep": 46370,
   "totalS": "¥606.10",
   "keepS": "¥463.70"
  },
  {
   "label": "2027-05",
   "total": 52577,
   "n": 5,
   "keep": 38337,
   "totalS": "¥525.77",
   "keepS": "¥383.37"
  },
  {
   "label": "2027-06",
   "total": 52577,
   "n": 5,
   "keep": 38337,
   "totalS": "¥525.77",
   "keepS": "¥383.37"
  },
  {
   "label": "2027-07",
   "total": 60610,
   "n": 6,
   "keep": 46370,
   "totalS": "¥606.10",
   "keepS": "¥463.70"
  },
  {
   "label": "2027-08",
   "total": 52577,
   "n": 5,
   "keep": 38337,
   "totalS": "¥525.77",
   "keepS": "¥383.37"
  },
  {
   "label": "2027-09",
   "total": 52577,
   "n": 5,
   "keep": 38337,
   "totalS": "¥525.77",
   "keepS": "¥383.37"
  }
 ],
 "sumT": "¥8,163.54",
 "sumN": 69,
 "saved": "¥2,420.80",
 "moCut": "¥201.73",
 "octTotal": "¥687.81",
 "octN": 7,
 "feb28": [
  "1Password 家庭版",
  "iCloud+ 200G"
 ],
 "feb28Total": "¥447.35",
 "feb2027Days": [
  "2027-02-01",
  "2027-02-03",
  "2027-02-12",
  "2027-02-20",
  "2027-02-28"
 ],
 "newPreview": "接下来的扣款：2027-01-31 $10.00、2027-02-28 $10.00、2027-03-31 $10.00、2027-04-30 $12.50、2027-05-31 $12.50、2027-06-30 $12.50",
 "newMo": "¥71.20"
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const O = ORACLE;
  const URL0 = toolURL + '?today=' + O.meta.today;
  const txt = async (sel) => ((await page.textContent(sel)) || '').trim();
  const shown = (sel) => page.$eval(sel, (n) => getComputedStyle(n).display !== 'none');
  const onTab = async (t) => {
    await page.click(`#sl-tab-${t}`);
    await page.waitForFunction((t) => !document.querySelector(`#sl-pane-${t}`).hidden, t);
  };

  await page.goto(URL0, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#sl-hero-v').textContent !== '—');
  assert(await page.locator('a[href="../../"]').first().isVisible(), '顶部有返回工具集链接');
  assert(await page.evaluate(() => window.SL_TODAY) === O.meta.today, 'today 参数生效');

  // ── 1. 总览（示例数据） ──
  assert(await txt('#sl-hero-v') === O.hero, `折合每月 ${await txt('#sl-hero-v')} = ${O.hero}`);
  assert(await txt('#sl-kmo') === O.hero, 'KPI 折合每月');
  assert(await txt('#sl-dk-yr') === O.yr, `按年折合 ${await txt('#sl-dk-yr')} = ${O.yr}`);
  assert(await txt('#sl-dk-12') === O.y365, `未来 365 天实扣 ${await txt('#sl-dk-12')} = ${O.y365}`);
  assert(await txt('#sl-dk-n') === O.nActive + ' 项', '进行中订阅数');
  assert(await txt('#sl-k30') === O.k30, `未来 30 天 ${await txt('#sl-k30')} = ${O.k30}`);
  assert(await txt('#sl-k30n') === O.c30 + ' 笔扣款', '未来 30 天笔数');
  assert(await txt('#sl-kmon') === O.monPaid, `本月已扣 ${await txt('#sl-kmon')} = ${O.monPaid}`);
  assert(await txt('#sl-kmonn') === '本月合计 ' + O.monAll, '本月合计');
  assert(await txt('#sl-ktop') === O.topV && await txt('#sl-ktopn') === O.topName, `最贵一项 ${O.topName} ${O.topV}`);
  const up = await page.$$eval('#sl-upcoming li', (ls) => ls.map((l) => [l.dataset.date, l.dataset.id]));
  assert(JSON.stringify(up) === JSON.stringify(O.upcoming), `45 天内扣款清单逐条一致（${up.length} 条）`);
  // 月末锚点：iCloud 1/31 起 → 10/31 扣
  assert(up.some(([d, i]) => d === '2026-10-31' && i === 'icloud'), 'iCloud 月末锚点落在 10-31');
  // 调价当天之后的第一次扣款用新价格
  const nf = await page.$eval('#sl-upcoming li[data-id="netflix"] .sl-uamt', (n) => n.firstChild.textContent);
  assert(nf === '¥78.00', `Netflix 11/12 按新价扣：${nf}`);
  assert(await page.locator('#sl-upcoming li[data-id="duo"] .sl-bneg').count() === 1, '试用转正徽标');
  const cats = await page.$$eval('#sl-cats .sl-catrow', (rs) => rs.map((r) => [r.dataset.cat, r.querySelector('.sl-cv').textContent,
    r.querySelector('.sl-fill').getBoundingClientRect().width / r.querySelector('.sl-track').getBoundingClientRect().width]));
  assert(cats.length === O.cats.length, '分类行数');
  cats.forEach(([k, v, ratio], i) => {
    assert(k === O.cats[i][0] && v === O.cats[i][1], `分类 ${k} ${v} = ${O.cats[i][0]} ${O.cats[i][1]}`);
    assert(Math.abs(ratio - O.cats[i][2]) < 0.01, `分类条宽度比例 ${k}：${ratio.toFixed(3)} vs ${O.cats[i][2].toFixed(3)}`);
  });
  const alerts = await page.$$eval('#sl-alerts li', (ls) => ls.map((l) => l.textContent));
  assert(alerts.length === 2 && alerts[0].includes('Duolingo') && alerts[1].includes('¥68.00 → ¥78.00'), `提醒：${alerts.join(' | ')}`);

  // ── 2. 键盘切页签 ──
  await page.focus('#sl-tab-home');
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => !document.querySelector('#sl-pane-subs').hidden);
  assert(await page.evaluate(() => document.activeElement.id) === 'sl-tab-subs', '方向键切到「订阅」并聚焦');
  assert(!(await shown('#sl-pane-home')), '总览面板计算样式已隐藏');

  // ── 3. 表单：非法输入 ──
  await page.fill('#sl-f-name', '测试月末');
  await page.fill('#sl-f-price', 'abc');
  await page.click('#sl-save');
  await page.waitForFunction(() => !document.querySelector('#sl-form-err').hidden);
  assert((await txt('#sl-form-err')).includes('金额'), '非数字金额报错');
  assert(await page.getAttribute('#sl-f-price', 'aria-invalid') === 'true', '金额框标红');
  await page.fill('#sl-f-price', '1.234');
  await page.click('#sl-save');
  await page.waitForFunction(() => document.querySelector('#sl-form-err').textContent.includes('最多 2 位小数'));
  await page.selectOption('#sl-f-cur', 'JPY');
  await page.fill('#sl-f-price', '1.5');
  await page.click('#sl-save');
  await page.waitForFunction(() => document.querySelector('#sl-form-err').textContent.includes('日元没有小数位'));
  await page.fill('#sl-f-every', '0');
  await page.click('#sl-save');
  await page.waitForFunction(() => document.querySelector('#sl-form-err').textContent.includes('1–99'));
  await page.fill('#sl-f-every', '1');
  await page.fill('#sl-f-start', '2027-01-31');
  await page.fill('#sl-f-end', '2026-01-01');
  await page.click('#sl-save');
  await page.waitForFunction(() => document.querySelector('#sl-form-err').textContent.includes('结束日不能早于首扣日'));
  assert(await page.locator('#sl-tbody tr').count() === 11, '非法输入不落库');

  // ── 4. 表单：新增（月末锚点 + 调价） ──
  await page.fill('#sl-f-end', '');
  await page.selectOption('#sl-f-cur', 'USD');
  await page.fill('#sl-f-price', '10');
  await page.selectOption('#sl-f-unit', 'month');
  await page.fill('#sl-f-cat', '测试');
  await page.click('#sl-chg-add');
  await page.fill('#sl-chgs .sl-chg-from', '2027-04-30');
  await page.fill('#sl-chgs .sl-chg-price', '12.5');
  await page.waitForFunction((t) => document.querySelector('#sl-preview').textContent === t, O.newPreview);
  assert(await txt('#sl-preview') === O.newPreview, `预览：${await txt('#sl-preview')}`);
  await page.click('#sl-save');
  await page.waitForFunction(() => document.querySelectorAll('#sl-tbody tr').length === 12);
  const row = page.locator('#sl-tbody tr', { hasText: '测试月末' });
  assert((await row.locator('.sl-c-next').textContent()).startsWith('2027-01-31'), '新订阅下次扣款 2027-01-31');
  assert(await row.locator('.sl-c-mo').textContent() === O.newMo, `新订阅折合每月 ${await row.locator('.sl-c-mo').textContent()} = ${O.newMo}`);
  assert(!(await shown('#sl-form-err')), '保存后错误条隐藏（计算样式）');

  // 持久化：reload 后仍在
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !document.querySelector('#sl-pane-subs').hidden && document.querySelectorAll('#sl-tbody tr').length === 12);
  assert(true, 'reload 后停在订阅页、12 条仍在');

  // 编辑：把新订阅删掉调价 → 预览全是 $10
  await page.locator('#sl-tbody tr', { hasText: '测试月末' }).locator('.sl-ed').click();
  await page.waitForFunction(() => document.querySelector('#sl-form-h').textContent.includes('测试月末'));
  assert(await page.inputValue('#sl-f-price') === '10.00', '编辑回填金额');
  assert(await page.locator('#sl-chgs .sl-chg').count() === 1, '编辑回填调价');
  await page.click('#sl-chgs .sl-chg button');
  await page.waitForFunction(() => document.querySelector('#sl-preview').textContent.includes('2027-04-30 $10.00'));
  await page.click('#sl-save');
  await page.waitForFunction(() => document.querySelector('#sl-form-h').textContent === '添加订阅');
  // 删除需要二次确认
  const del = page.locator('#sl-tbody tr', { hasText: '测试月末' }).locator('.sl-rm');
  await del.click();
  assert(await page.locator('#sl-tbody tr').count() === 12 && await del.textContent() === '确认？', '删除第一下只是武装');
  await del.click();
  await page.waitForFunction(() => document.querySelectorAll('#sl-tbody tr').length === 11);

  // 分类筛选
  await page.click('#sl-filter .sl-pill:has-text("云存储")');
  await page.waitForFunction(() => document.querySelectorAll('#sl-tbody tr').length === 2);
  await page.click('#sl-filter .sl-pill:has-text("全部")');
  await page.waitForFunction(() => document.querySelectorAll('#sl-tbody tr').length === 11);

  // 暂停：进行中数减一、折合每月变化，恢复后还原
  await page.locator('#sl-tbody tr[data-id="gym"] .sl-pz').click();
  await page.waitForFunction((n) => document.querySelector('#sl-dk-n').textContent === (n - 1) + ' 项', O.nActive);
  assert(await txt('#sl-hero-v') !== O.hero, '暂停后折合每月改变');
  await page.locator('#sl-tbody tr[data-id="gym"] .sl-pz').click();
  await page.waitForFunction((h) => document.querySelector('#sl-hero-v').textContent === h, O.hero);

  // ── 5. 日历 ──
  await onTab('cal');
  assert(await txt('#sl-cal-title') === '2026 年 10 月', '日历默认本月');
  assert(await txt('#sl-cal-sum') === `本月 ${O.octN} 笔扣款，合计 ${O.octTotal}。`, `10 月合计：${await txt('#sl-cal-sum')}`);
  assert(await page.locator('.sl-cell.sl-today[data-date="2026-10-16"]').count() === 1, '今天高亮');
  for (let i = 0; i < 4; i++) await page.click('#sl-cal-next');
  await page.waitForFunction(() => document.querySelector('#sl-cal-title').textContent === '2027 年 2 月');
  const febDays = await page.$$eval('.sl-cell.sl-has', (cs) => cs.map((c) => c.dataset.date));
  assert(JSON.stringify(febDays) === JSON.stringify(O.feb2027Days), `2027-02 有扣款的日子：${febDays}`);
  await page.click('.sl-cell[data-date="2027-02-28"]');
  await page.waitForFunction(() => document.querySelector('#sl-day-h').textContent.startsWith('2 月 28 日'));
  const names = (await page.$$eval('#sl-day-list .sl-uname', (ns) => ns.map((n) => n.textContent))).sort();
  assert(JSON.stringify(names) === JSON.stringify(O.feb28), `2/28 扣款：${names}（iCloud 月末 + 1Password 闰日年付）`);
  assert((await txt('#sl-day-s')).endsWith(O.feb28Total), `2/28 合计 ${O.feb28Total}`);
  // 窄格：格内子元素不越出格子
  for (const vw of [390, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    const esc = await page.$$eval('.sl-cell', (cs) => {
      const out = [];
      cs.forEach((c) => { const b = c.getBoundingClientRect(); c.querySelectorAll('span').forEach((s) => {
        const r = s.getBoundingClientRect(); if (r.width && (r.right > b.right + 1 || r.left < b.left - 1 || r.bottom > b.bottom + 1)) out.push(c.dataset.date + ':' + s.className);
      }); });
      return out;
    });
    assert(esc.length === 0, `视口 ${vw} 日历格内文字不越格：${esc.slice(0, 4)}`);
  }
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.click('#sl-cal-today');

  // ── 6. 预测 + 如果取消 ──
  await onTab('plan');
  const ft = await page.$$eval('#sl-ftable tbody tr', (rs) => rs.map((r) => [r.dataset.m, r.cells[1].textContent, r.cells[2].textContent, r.cells[3].textContent]));
  assert(ft.length === 13, '12 个月 + 合计行');
  O.months.forEach((m, i) => assert(ft[i][0] === m.label && ft[i][1] === String(m.n) && ft[i][2] === m.totalS,
    `${m.label}：${ft[i][1]} 笔 ${ft[i][2]} = ${m.n} 笔 ${m.totalS}`));
  assert(ft[12][2] === O.sumT && ft[12][1] === String(O.sumN), `12 个月合计 ${ft[12][2]} = ${O.sumT}`);
  await page.check('#sl-wi input[data-id="claude"]');
  await page.check('#sl-wi input[data-id="copilot"]');
  await page.waitForFunction((v) => document.querySelector('#sl-wi-save').textContent === v, O.saved);
  assert(await txt('#sl-wi-save') === O.saved, `取消 Claude+Copilot 省 ${O.saved}`);
  assert((await txt('#sl-wi-note')).includes(O.moCut), `折合每月少花 ${O.moCut}`);
  const keep = await page.$$eval('#sl-ftable tbody tr', (rs) => rs.slice(0, 12).map((r) => r.cells[3].textContent));
  assert(JSON.stringify(keep) === JSON.stringify(O.months.map((m) => m.keepS)), '勾掉后逐月金额一致');
  // 柱高与数值成比例（几何断言）
  const bars = await page.$$eval('#sl-fig rect.sl-bar', (rs) => rs.map((r) => [+r.dataset.v, r.getBoundingClientRect().height]));
  assert(bars.length === 12, '12 根柱子');
  const k = bars[0][1] / bars[0][0];
  assert(bars.every(([v, h]) => Math.abs(h - v * k) < 1.5), '保留部分柱高 ∝ 金额');
  const cutBars = await page.$$eval('#sl-fig rect.sl-bar-cut', (rs) => rs.length);
  assert(cutBars >= 12, `勾掉部分叠在柱顶（${cutBars} 段）`);

  // ── 7. 导出 .ics / JSON ──
  await onTab('data');
  let ics = await page.inputValue('#sl-ics-out');
  const unf = ics.replace(/\r?\n /g, '');
  // RFC 5545 表达：31 日锚点 = BYMONTHDAY=-1；闰日年付 = BYMONTHDAY=28,29;BYSETPOS=-1
  assert(/UID:icloud-0@[\s\S]*?RRULE:FREQ=MONTHLY;BYMONTHDAY=-1\r?\n/.test(unf), 'iCloud RRULE 用 BYMONTHDAY=-1');
  assert(/RRULE:FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=28,29;BYSETPOS=-1\r?\n/.test(unf), '1Password RRULE 用 BYSETPOS=-1');
  assert(/UID:netflix-0@[\s\S]*?UNTIL=20261012/.test(unf) && /UID:netflix-1@[\s\S]*?DTSTART;VALUE=DATE:20261112/.test(unf), 'Netflix 调价拆成两段');
  assert(/UID:baidu-0@[\s\S]*?UNTIL=20260809/.test(unf), '已结束订阅带 UNTIL');
  assert((unf.match(/TRIGGER:-P2D/g) || []).length === (unf.match(/BEGIN:VEVENT/g) || []).length, '每个事件都有提前 2 天提醒');
  assert(ics.split(/\r?\n/).every((l) => new TextEncoder().encode(l).length <= 75), '每行 ≤75 octet');
  await page.fill('#sl-remind', '5');
  await page.waitForFunction(() => document.querySelector('#sl-ics-out').value.includes('TRIGGER:-P5D'));
  // JSON：坏 JSON
  await page.fill('#sl-json-in', '{oops');
  await page.click('#sl-imp-merge');
  await page.waitForFunction(() => document.querySelector('#sl-imp-msg').textContent.includes('不是合法的 JSON'));
  // 合并：一条好、一条坏
  await page.fill('#sl-json-in', JSON.stringify([{ id: 'x1', name: '导入一号', price: 999, cur: 'EUR', unit: 'week', every: 2, start: '2026-10-20' },
    { name: '坏的', price: -1, cur: 'CNY', unit: 'month', start: '2026-10-01' }]));
  await page.click('#sl-imp-merge');
  await page.waitForFunction(() => document.querySelector('#sl-imp-msg').className.includes('sl-mwarn'));
  assert((await txt('#sl-imp-msg')).includes('已导入 1 条') && (await txt('#sl-imp-msg')).includes('跳过 1 条'), `部分导入：${await txt('#sl-imp-msg')}`);
  // 清空需要确认，清空后空状态可见
  await page.click('#sl-clear');
  assert(await shown('#sl-clear-confirm') && await txt('#sl-clear-n') === '12', '清空先弹确认条');
  await page.click('#sl-clear-yes');
  await onTab('subs');
  assert(await shown('#sl-subempty') && !(await shown('#sl-table')), '清空后显示空状态、表格隐藏');
  await onTab('home');
  assert(await shown('#sl-upempty'), '总览空状态');
  await onTab('data');
  await page.click('#sl-sample');
  await page.waitForFunction(() => document.querySelector('#sl-dk-n').textContent === '10 项');

  // ── 8. 本位币切 USD ──
  await onTab('set');
  await page.selectOption('#sl-base', 'USD');
  await page.waitForFunction((v) => document.querySelector('#sl-hero-v').textContent === v, O.heroUSD);
  assert(await txt('#sl-hero-v') === O.heroUSD, `USD 本位折合每月 ${O.heroUSD}`);
  await page.fill('#sl-rate-CNY', '-3');
  await page.dispatchEvent('#sl-rate-CNY', 'change');
  await page.waitForFunction(() => !document.querySelector('#sl-rate-err').hidden);
  assert(await txt('#sl-hero-v') === O.heroUSD, '非法汇率不生效');
  await page.click('#sl-rate-reset');
  await page.selectOption('#sl-base', 'CNY');
  await page.waitForFunction((v) => document.querySelector('#sl-hero-v').textContent === v, O.hero);

  // ── 9. 渲染守卫 ──
  await page.uncheck('#sl-wi input[data-id="claude"]').catch(() => {});
  const n = await renderGuards(page, { assert, tabs: O.meta.tabs, onTab, paneSel: (t) => `#sl-pane-${t}`, panesRoot: '#sl-panes',
    figSel: (t) => `#sl-pane-${t} svg.sl-fig`, cardSel: '.sl-card', childSel: 'svg,h2,p,dl,.sl-row', minControls: 40, minTextsInFig: 14 });
  assert(n >= 40, `尺寸守卫累计扫到 ${n} 个控件`);

  await page.setViewportSize({ width: 1280, height: 850 });
  await onTab('home');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(() => document.querySelector('#sl-toast').hidden, null, { timeout: 5000 });
  await screenshot('thumb.png');
};
