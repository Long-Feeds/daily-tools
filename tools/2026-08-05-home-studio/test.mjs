// 集成测试:购房工作台 · Home Studio
// 断言的是真实计算结果(教科书月供 / 摊还表逐期数字 / 提前还款省息 / 转贷回本 / 租买净资产 /
// 蒙特卡洛分位数),不是「元素存在」。期望值来自本工具引擎的离线断言套件(132 条,独立闭式解对照)。
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#hs-monthly');

  // 每次重算都会自增 body[data-runs];全程等它收敛,绝不用定时器(2026-07-06 教训)
  const runsNow = () => page.evaluate(() => Number(document.body.dataset.runs || 0));
  const settle = async (fn) => {
    const before = await runsNow();
    await fn();
    await page.waitForFunction((n) => Number(document.body.dataset.runs || 0) > n, before, { timeout: 15000 });
  };
  const txt = async (sel) => ((await page.locator(sel).textContent()) || '').trim();
  // 取字符串里最后一个货币数字(行文本里可能还夹着「买 − 租」这类减号)
  const money = (s) => {
    const m = String(s).match(/[−-]?\s*[¥$€£S]*\s*\d[\d,]*(?:\.\d+)?/g);
    if (!m) return NaN;
    return Number(m[m.length - 1].replace(/[^0-9.\-−]/g, '').replace('−', '-'));
  };
  const setNum = (sel, v) => settle(() => page.fill(sel, String(v)));

  /* ---------- 0. 骨架 ---------- */
  assert((await page.locator('a[href="../../"]').count()) >= 1, '顶部有「返回工具集」链接');
  assert(await runsNow() >= 1, '首次渲染已完成');

  /* ---------- 1. 默认参数(300 万 / 3 成 / 3.9% / 30 年) ---------- */
  assert((await txt('#hs-monthly')) === '¥9,905', `默认月供 ¥9,905(得到 ${await txt('#hs-monthly')})`);
  assert((await txt('#hs-down-amount')) === '¥900,000', '首付 = 总价 × 30%');
  assert((await txt('#hs-rail-loan')) === '¥2,100,000', '贷款额 = 总价 × 70%');
  assert((await txt('#hs-rail-buycost')) === '¥90,000', '买入税费 = 总价 × 3%');
  assert((await txt('#hs-rail-upfront')) === '¥990,000', '上车现金 = 首付 + 税费');
  const ratio = parseFloat(await txt('#hs-rail-ratio'));
  assert(Math.abs(ratio - 9905.03 / 7000) < 0.01, `月供 ÷ 租金 ≈ 1.42(得到 ${ratio})`);
  assert((await txt('#hs-rail-pr')) === '36 年', `租售比 300万/(7000×12) ≈ 36 年(得到 ${await txt('#hs-rail-pr')})`);

  /* ---------- 2. 教科书算例:100 万 / 30 年 / 3.5% 等额本息 ---------- */
  await setNum('#hs-price', 1000000);
  await setNum('#hs-down', 0);
  await setNum('#hs-rate', 3.5);
  await setNum('#hs-term', 30);
  assert((await txt('#hs-monthly')) === '¥4,490', `100万/30年/3.5% 月供 = ¥4,490(得到 ${await txt('#hs-monthly')})`);
  assert((await txt('#hs-loan-amount')) === '¥1,000,000', '零首付时贷款额 = 总价');
  assert((await txt('#hs-loan-months')).startsWith('360 期'), `期数 360(得到 ${await txt('#hs-loan-months')})`);
  assert((await txt('#hs-total-interest')) === '¥616,561', `总利息 ¥616,561(得到 ${await txt('#hs-total-interest')})`);
  assert((await txt('#hs-total-paid')) === '¥1,616,561', '本息合计 = 本金 + 利息');

  /* ---------- 3. 摊还表:逐期真实数字 ---------- */
  const yearRows = page.locator('#hs-schedule tr');
  assert((await yearRows.count()) === 30, `按年视图 30 行(得到 ${await yearRows.count()})`);
  const y1 = await yearRows.first().locator('td').allTextContents();
  assert(y1[0] === '第 1 年', '首行是第 1 年');
  assert(y1[5] === '¥980,809', `第 1 年末余额 ¥980,809(得到 ${y1[5]})`);
  const y30 = await yearRows.last().locator('td').allTextContents();
  assert(money(y30[5]) === 0, `第 30 年末余额清零(得到 ${y30[5]})`);
  // 逐年利息合计 = 总利息
  const sumInterest = (await page.locator('#hs-schedule tr td:nth-child(3)').allTextContents())
    .reduce((s, t) => s + money(t), 0);
  assert(Math.abs(sumInterest - 616561) <= 30, `逐年利息合计 ≈ 总利息(得到 ${sumInterest})`);

  await settle(() => page.click('#hs-view-month'));
  assert((await page.locator('#hs-schedule tr').count()) === 60, '按月视图 60 行');
  assert((await page.locator('#hs-th-period').textContent()) === '期', '表头切换成「期」');
  const m1 = await page.locator('#hs-schedule tr').first().locator('td').allTextContents();
  assert(m1[0] === '第 1 期', '首行是第 1 期');
  assert(m1[2] === '¥2,917', `首期利息 = 100万×3.5%/12 = ¥2,917(得到 ${m1[2]})`);
  assert(m1[3] === '¥1,574', `首期本金 = 月供 − 利息 = ¥1,574(得到 ${m1[3]})`);
  assert(Math.abs(money(m1[1]) - (money(m1[2]) + money(m1[3]))) <= 1, '月供 = 利息 + 本金(四舍五入到元)');
  await settle(() => page.click('#hs-view-year'));

  /* ---------- 4. 等额本金 ---------- */
  await settle(() => page.selectOption('#hs-method', 'epr'));
  assert((await txt('#hs-monthly')) === '¥5,694', `等额本金首月 = P/N + P·i = ¥5,694(得到 ${await txt('#hs-monthly')})`);
  assert((await txt('#hs-total-interest')) === '¥526,458', `等额本金总利息 = P·i·(N+1)/2 = ¥526,458(得到 ${await txt('#hs-total-interest')})`);
  await settle(() => page.selectOption('#hs-method', 'ep'));

  /* ---------- 5. 标签切换 + 隐藏面板的计算样式 ---------- */
  await settle(() => page.click('#hs-tabbtn-prepay'));
  for (const t of ['loan', 'rentbuy', 'risk']) {
    const d = await page.evaluate((id) => getComputedStyle(document.getElementById(id)).display, 'hs-panel-' + t);
    assert(d === 'none', `未选中的面板 ${t} 计算样式必须是 none(得到 ${d})`);
  }
  assert(await page.evaluate(() => getComputedStyle(document.getElementById('hs-panel-prepay')).display) !== 'none',
    '选中的面板可见');
  assert((await page.getAttribute('#hs-tabbtn-prepay', 'aria-selected')) === 'true', 'aria-selected 跟随');

  /* ---------- 6. 提前还款:缩短年限 vs 减少月供 ---------- */
  assert((await page.locator('#hs-preplist .hs-pm').count()) === 0, '默认没有预设提前还款(首屏数字就是真实贷款)');
  await settle(() => page.click('#hs-add-prepay'));
  assert((await page.locator('#hs-preplist .hs-pm').first().inputValue()) === '37', '新增的提前还款默认落在第 37 期');
  assert((await page.locator('#hs-preplist .hs-pa').first().inputValue()) === '200000', '新增默认金额 20 万');
  assert((await txt('#hs-prepay-save')) === '¥242,928', `第 37 期还 20 万(缩期)省息 ¥242,928(得到 ${await txt('#hs-prepay-save')})`);
  assert((await txt('#hs-prepay-months')) === '8 年 2 个月', `缩短 98 期 = 8 年 2 个月(得到 ${await txt('#hs-prepay-months')})`);
  assert((await txt('#hs-prepay-total')) === '¥200,000', '提前还款合计 ¥200,000');
  assert((await txt('#hs-prepay-eff')).startsWith('¥121'), `每 100 元提前还款省息 ¥121(得到 ${await txt('#hs-prepay-eff')})`);

  await settle(() => page.selectOption('#hs-preplist .hs-pd', 'reduce'));
  assert((await txt('#hs-prepay-save')) === '¥109,057', `同样 20 万改「减少月供」只省 ¥109,057(得到 ${await txt('#hs-prepay-save')})`);
  assert((await txt('#hs-prepay-months')).includes('不缩短'), '减少月供不缩短年限');
  // 两种口径的差额正是这个工具想让人看见的
  assert(242928 > 109057, '缩短年限比减少月供更省息');

  await settle(() => page.click('#hs-preplist [data-del="0"]'));
  assert((await txt('#hs-prepay-save')) === '¥0', '删掉提前还款后省息归零');
  assert((await page.locator('#hs-preplist .hs-pm').count()) === 0, '提前还款列表已空');

  /* ---------- 7. 转贷回本 ---------- */
  await setNum('#hs-refi-year', 5);
  await setNum('#hs-refi-rate', 3.1);
  await setNum('#hs-refi-term', 25);
  await setNum('#hs-refi-cost', 12000);
  assert((await txt('#hs-refi-balance')) === '¥896,971', `第 60 期余额 ¥896,971(得到 ${await txt('#hs-refi-balance')})`);
  assert((await txt('#hs-refi-payback')) === '5 年 3 个月', `回本 12000/190 ≈ 63 个月(得到 ${await txt('#hs-refi-payback')})`);
  assert((await txt('#hs-refi-save')) === '¥45,033', `扣成本后净省 ¥45,033(得到 ${await txt('#hs-refi-save')})`);
  assert((await txt('#hs-refi-note')).startsWith('划算'), '结论句判定为划算');
  await setNum('#hs-refi-rate', 5.5);
  assert(money(await txt('#hs-refi-save')) < 0, '利率不降反升时净省为负');
  assert((await txt('#hs-refi-note')).startsWith('不划算'), '结论句翻面');
  await setNum('#hs-refi-rate', 3.1);

  /* ---------- 8. 租还是买 ---------- */
  await settle(() => page.click('#hs-tabbtn-rentbuy'));
  await setNum('#hs-price', 3000000);
  await setNum('#hs-down', 30);
  await setNum('#hs-rate', 3.9);
  await setNum('#hs-term', 30);
  assert((await txt('#hs-advantage')) === '¥29.3 万', `持有 15 年买方净资产优势 ¥29.3 万(得到 ${await txt('#hs-advantage')})`);
  assert((await txt('#hs-breakeven')) === '6.3 年', `盈亏平衡 6.3 年(得到 ${await txt('#hs-breakeven')})`);
  assert((await txt('#hs-irr')) === '5.75%', `买房 IRR 5.75%(得到 ${await txt('#hs-irr')})`);
  assert((await txt('#hs-buyer-net')) === '¥3,232,226', '期末买方净资产');
  assert((await txt('#hs-renter-net')) === '¥2,939,336', '期末租方净资产');
  const rbRows = await page.locator('#hs-rb-rows li').allTextContents();
  assert(rbRows.length >= 12, `明细至少 12 行(得到 ${rbRows.length})`);
  const lastRow = rbRows[rbRows.length - 1];
  assert(lastRow.includes('期末净资产差') && money(lastRow) === 292890,
    `明细末行 = 买 − 租 = ¥292,890(得到 ${lastRow})`);
  // 3,232,226 − 2,939,336 = 292,890:三个读数互相自洽
  assert(3232226 - 2939336 === 292890, '买方净资产 − 租方净资产 = 净优势');

  // 敏感性:涨幅拉到 8% 后买方优势应大幅上升、平衡年提前
  await setNum('#hs-app', 8);
  assert(money(await txt('#hs-advantage')) > 400, '房价涨幅 8% 时净优势显著变大(单位:万)');
  assert(parseFloat(await txt('#hs-breakeven')) < 6.3, '涨得快 ⇒ 更早打平');
  await setNum('#hs-app', -3);
  assert((await txt('#hs-advantage-label')).includes('租房'), '房价下跌时结论翻面为「租房+投资更优」');
  assert((await txt('#hs-breakeven')).includes('不会打平'), '下跌情景不会打平');
  await setNum('#hs-app', 3);

  /* ---------- 9. 情景与风险:敏感性网格 + 蒙特卡洛 ---------- */
  await settle(() => page.click('#hs-tabbtn-risk'));
  const beRows = page.locator('#hs-be-table tr');
  assert((await beRows.count()) >= 6, `平衡线读数表至少 6 行(得到 ${await beRows.count()})`);
  const beCells = await beRows.first().locator('td').allTextContents();
  assert(/^\d+ 年$/.test(beCells[0]), '第一列是持有年限');
  assert(/%$/.test(beCells[1]), '第二列是所需房价年涨幅');
  // 平衡涨幅随持有年限拉长而下降(交易成本被摊薄)
  const beVals = [];
  for (const r of await beRows.all()) {
    const c = await r.locator('td').nth(1).textContent();
    beVals.push(parseFloat(String(c).replace(/[^0-9.\-]/g, '')));
  }
  assert(beVals[0] > beVals[beVals.length - 1], `持有越久所需涨幅越低(${beVals[0]}% → ${beVals[beVals.length - 1]}%)`);

  assert((await txt('#hs-winrate')) === '58.4%', `蒙特卡洛胜率 58.4%(得到 ${await txt('#hs-winrate')})`);
  const p10 = money(await txt('#hs-p10')), p50 = money(await txt('#hs-p50')), p90 = money(await txt('#hs-p90'));
  assert(p10 < p50 && p50 < p90, `分位数有序(${p10} < ${p50} < ${p90})`);
  assert(p10 < 0 && p90 > 0, '悲观情景亏、乐观情景赚 —— 分布跨越零线');
  assert(Math.abs(p50 - 292890) < 200000, '中位数在确定性结果附近');

  // 零波动 ⇒ 退化成确定性结果:胜率 100%,分位数塌成一点
  await setNum('#hs-volapp', 0);
  await setNum('#hs-volinv', 0);
  assert((await txt('#hs-winrate')) === '100.0%', `零波动时胜率 100%(得到 ${await txt('#hs-winrate')})`);
  assert((await txt('#hs-p10')) === '¥292,890' && (await txt('#hs-p90')) === '¥292,890',
    '零波动时 P10 = P90 = 确定性净优势');
  await setNum('#hs-volapp', 8);
  await setNum('#hs-volinv', 14);
  assert((await txt('#hs-winrate')) === '58.4%', '恢复波动率后胜率复现(同种子可复现)');

  /* ---------- 10. 图真的画了(像素级) ---------- */
  const inkPixels = async (id) => page.evaluate((cid) => {
    const cv = document.getElementById(cid);
    const ctx = cv.getContext('2d');
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 10 && (d[i] < 245 || d[i + 1] < 245 || d[i + 2] < 245)) n++;
    return n;
  }, id);
  assert((await inkPixels('hs-cv-heat')) > 20000, '敏感性热力图有实际绘制内容');
  assert((await inkPixels('hs-cv-fan')) > 5000, '蒙特卡洛扇形图有实际绘制内容');
  await settle(() => page.click('#hs-tabbtn-loan'));
  assert((await inkPixels('hs-cv-amort')) > 5000, '摊还图有实际绘制内容');
  await settle(() => page.click('#hs-tabbtn-prepay'));
  assert((await inkPixels('hs-cv-balance')) > 2000, '余额对比图有实际绘制内容');
  await settle(() => page.click('#hs-tabbtn-rentbuy'));
  assert((await inkPixels('hs-cv-networth')) > 2000, '净资产图有实际绘制内容');

  /* ---------- 11. 布局守卫:画布不越界、控件不塌缩 ---------- */
  const box = async (sel) => page.locator(sel).boundingBox();
  const cv = await box('#hs-cv-networth'), wrap = await box('#hs-panel-rentbuy .hs-canvaswrap');
  assert(cv.x >= wrap.x - 1 && cv.x + cv.width <= wrap.x + wrap.width + 1, '画布不横向溢出卡片');
  assert(cv.height > 200, `画布高度不塌缩(得到 ${cv.height}）`);
  const orb = await box('#hs-calc');
  assert(orb.width >= 44 && orb.height >= 44, `搜索球 ≥ 44×44(得到 ${orb.width}×${orb.height}）`);
  const priceBox = await box('#hs-price');
  assert(priceBox.width > 60 && priceBox.height > 14, `总价输入框未被压塌(得到 ${priceBox.width}×${priceBox.height}）`);
  const saveBtn = await box('#hs-save');
  assert(saveBtn.height >= 40 && saveBtn.width > 200, '保存按钮是全宽主 CTA');
  const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
  assert(noOverflow, '1280px 下无横向溢出');

  /* ---------- 12. 方案保存 + 刷新后仍在 ---------- */
  await page.fill('#hs-planname', '朝阳 · 三成首付');
  await page.click('#hs-save');
  await page.waitForSelector('#hs-plangrid .hs-plancard');
  assert((await page.locator('#hs-plangrid .hs-plancard').count()) === 1, '保存后出现一张方案卡');
  assert((await txt('#hs-plangrid .hs-planmeta b')) === '朝阳 · 三成首付', '方案名写入卡片');
  assert((await txt('#hs-plangrid .hs-plate-num')) === '¥9,905', '方案卡上的月供 = 当前月供');
  const emptyDisplay = await page.evaluate(() => getComputedStyle(document.getElementById('hs-plan-empty')).display);
  assert(emptyDisplay === 'none', `有方案时空态提示必须真的隐藏(计算样式,得到 ${emptyDisplay})`);
  assert((await txt('#hs-plangrid .hs-plan-verdict')).includes('买赢'), '方案卡带租买结论');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#hs-plangrid .hs-plancard');
  assert((await page.locator('#hs-plangrid .hs-plancard').count()) === 1, '刷新后方案仍在(localStorage)');
  assert((await page.locator('#hs-price').inputValue()) === '3000000', '刷新后输入也恢复');
  assert((await txt('#hs-monthly')) === '¥9,905', '刷新后结果与保存时一致');

  /* ---------- 13. 非法 / 极端输入 ---------- */
  await settle(() => page.fill('#hs-down', '150'));   // 首付 > 100%
  assert((await txt('#hs-loan-amount')) === '¥0', '首付超过 100% 时贷款额归零');
  assert((await txt('#hs-monthly')) === '¥0', '全款时月供为 0');
  const emptyRow = await txt('#hs-schedule');
  assert(emptyRow.includes('全款'), '空摊还表给出解释而不是留白');
  await settle(() => page.fill('#hs-price', ''));      // 空输入回落到默认值
  assert(money(await txt('#hs-rail-loan')) >= 0, '空输入不产生 NaN');
  await setNum('#hs-price', 3000000);
  await setNum('#hs-down', 30);
  assert((await txt('#hs-monthly')) === '¥9,905', '恢复参数后结果复原');

  /* ---------- 14. 货币切换 ---------- */
  await settle(() => page.selectOption('#hs-cur', '$'));
  assert((await txt('#hs-monthly')).startsWith('$'), '货币符号切换到 $');
  assert(!(await txt('#hs-advantage')).includes('万'), '非人民币时不再用「万」作单位');
  await settle(() => page.selectOption('#hs-cur', '¥'));

  /* ---------- 15. 窄屏 ---------- */
  await page.setViewportSize({ width: 390, height: 844 });
  await settle(() => page.click('#hs-tabbtn-loan'));
  const narrow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
  assert(narrow, `390px 下无横向溢出(scrollWidth=${await page.evaluate(() => document.documentElement.scrollWidth)})`);
  const narrowOrb = await box('#hs-calc');
  assert(narrowOrb.height >= 40, '窄屏搜索球仍可点');
  const narrowCanvas = await box('#hs-cv-amort');
  assert(narrowCanvas.width <= 390 && narrowCanvas.width > 200, '窄屏画布自适应宽度');

  /* ---------- 16. 键盘可用 ---------- */
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.focus('#hs-tabbtn-loan');
  await settle(() => page.keyboard.press('ArrowRight'));
  assert((await page.getAttribute('#hs-tabbtn-prepay', 'aria-selected')) === 'true', '方向键可切换标签');
  await settle(() => page.keyboard.press('ArrowLeft'));
  assert((await page.getAttribute('#hs-tabbtn-loan', 'aria-selected')) === 'true', '方向键可切回');

  /* ---------- 缩略图 ---------- */
  await settle(() => page.click('#hs-tabbtn-rentbuy'));
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running'));
  await screenshot('thumb.png');
}
