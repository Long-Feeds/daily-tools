// 固定收益工作台 · 浏览器集成测试
// 断言原则：真的填表 + 真的点击，断的是**与 QuantLib 1.43 对拍过的真实数值**（每个期望值都能指到
// 具体一次 BondFunctions/Schedule/PiecewiseLinearZero/VanillaSwap 调用）。
// 另带六类守卫：[hidden] 计算样式、逐视口横向溢出、逐分区控件尺寸、SVG 文字不重叠/不越界/画出个数、
// 表格数值一致性、能力清单逐项命中。
export default async ({ page, toolURL, screenshot, assert }) => {
  let n = 0;
  const A = (cond, msg) => { n++; assert(cond, msg); };
  const near = (a, b, tol, msg) => A(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b}（容差 ${tol}）`);
  // parseFloat 而不是 Number：读数里带 bp / % / 年 这类单位后缀（"1.921 bp" 用 Number 会变 NaN，
  // 而 NaN < 5 恒为 false，会把「通过」伪装成「失败」，反过来也可能把失败伪装成通过）
  const numOf = (s) => parseFloat(String(s).replace(/[,%\s]/g, ''));
  const txt = async (sel) => (await page.locator(sel).innerText()).trim();
  const val = async (sel) => Number(numOf(await txt(sel)));

  const TABS = ['bond', 'curve', 'portfolio', 'swap', 'daycount', 'notes'];
  const onTab = async (id) => {
    await page.locator(`#bl-tab-${id}`).click();
    await page.waitForFunction(
      (t) => getComputedStyle(document.getElementById('bl-panel-' + t)).display !== 'none', id);
  };
  const setField = async (sel, v) => {
    await page.fill(sel, String(v));
    await page.locator(sel).dispatchEvent('input');
  };

  await page.goto(toolURL, { waitUntil: 'load' });
  await page.evaluate(() => localStorage.clear());
  await page.goto(toolURL, { waitUntil: 'load' });
  await page.waitForSelector('#bl-bond-head dd');

  /* ---------- 0. 骨架 ---------- */
  A(await page.locator('a[href="../../"]').first().isVisible(), '缺少「返回工具集」链接');
  A((await page.title()).includes('固定收益'), '标题不对：' + (await page.title()));
  for (const t of TABS) A(await page.locator(`#bl-tab-${t}`).count() === 1, `缺少分区按钮 ${t}`);
  // [hidden] 守卫：断计算样式，不是断属性（2026-07-20 教训）
  for (const t of TABS.slice(1)) {
    const disp = await page.locator(`#bl-panel-${t}`).evaluate((e) => getComputedStyle(e).display);
    A(disp === 'none', `分区 ${t} 应被隐藏，实际 display=${disp}`);
  }
  A(await page.locator('#bl-panel-bond').evaluate((e) => getComputedStyle(e).display) !== 'none', '默认分区没显示');
  A(await page.locator('#bl-bond-err').evaluate((e) => getComputedStyle(e).display) === 'none', '首屏不该有报错条');

  /* ---------- 1. 债券：给净价反解收益率（QuantLib bondYield 对拍） ---------- */
  await setField('#bl-b-eff', '2025-08-15');
  await setField('#bl-b-mat', '2035-08-15');
  await setField('#bl-b-settle', '2026-09-04');
  await setField('#bl-b-coupon', '4.25');
  await page.selectOption('#bl-b-freq', '2');
  await page.selectOption('#bl-b-dc', 'ACT/ACT (ICMA)');
  await setField('#bl-b-price', '98.5');
  await page.waitForFunction(() => document.getElementById('bl-out-ytm').textContent.startsWith('4.45'));

  near(await val('#bl-out-ytm'), 4.454830946, 5e-4, '到期收益率（QuantLib bondYield）');
  near(await val('#bl-out-clean'), 98.5, 1e-5, '净价应回到输入值');
  near(await val('#bl-out-accrued'), 0.230978261, 1e-6, '应计利息（QuantLib accruedAmount）');
  near(await val('#bl-out-dirty'), 98.730978261, 1e-6, '全价 = 净价 + 应计');
  near(await val('#bl-out-mac'), 7.504326674, 1e-5, '麦考利久期（QuantLib duration Macaulay）');
  near(await val('#bl-out-mod'), 7.340816198, 1e-5, '修正久期（QuantLib duration Modified）');
  near(await val('#bl-out-cvx'), 63.78525621, 1e-4, '凸性（QuantLib convexity）');
  near(await val('#bl-out-dv01'), 0.072476596, 1e-6, 'DV01 = 修正久期 × 全价 × 1bp');   // 页面显示 6 位小数，容差不能比显示精度还紧
  near(await val('#bl-out-cy'), 4.25 / 98.5 * 100, 1e-4, '当期收益率 = 票息 / 净价');
  A((await txt('#bl-out-nflow')) === '19', '未来现金流应为 19 笔，实际 ' + (await txt('#bl-out-nflow')));
  A((await txt('#bl-out-next')) === '2027-02-15', '下一付息日应为 2027-02-15，实际 ' + (await txt('#bl-out-next')));

  /* ---------- 2. 债券：改成给收益率（QuantLib cleanPrice 对拍） ---------- */
  await page.locator('#bl-b-mode button[data-mode="yield"]').click();
  await page.waitForFunction(() =>
    getComputedStyle(document.getElementById('bl-b-yield-wrap')).display !== 'none');
  A(await page.locator('#bl-b-price-wrap').evaluate((e) => getComputedStyle(e).display) === 'none',
    '切到收益率模式后净价输入框应真的藏起来（计算样式）');
  await setField('#bl-b-yield', '4.45');
  await page.waitForFunction(() => document.getElementById('bl-out-clean').textContent.startsWith('98.535'));
  near(await val('#bl-out-clean'), 98.535020404, 1e-6, '给 4.45% 应得净价 98.535020（QuantLib cleanPrice）');
  near(await val('#bl-out-dirty'), 98.765998665, 1e-6, '对应全价');

  /* ---------- 3. 债券：30/360 首期折现口径（只有这类惯例才暴露） ---------- */
  await setField('#bl-b-eff', '2024-11-30');
  await setField('#bl-b-mat', '2029-11-30');
  await setField('#bl-b-coupon', '6.25');
  await page.selectOption('#bl-b-dc', '30/360 (Bond Basis)');
  await setField('#bl-b-yield', '5');
  await page.waitForFunction(() => document.getElementById('bl-out-clean').textContent.startsWith('103.68'));
  near(await val('#bl-out-clean'), 103.685781324, 1e-6, '30/360 债净价（QuantLib cleanPrice，首期口径敏感）');
  near(await val('#bl-out-accrued'), 1.631944444, 1e-6, '30/360 应计利息');
  near(await val('#bl-out-mod'), 2.871415823, 1e-6, '30/360 修正久期');

  /* ---------- 4. 债券：零息债的解析闭式 ---------- */
  await setField('#bl-b-eff', '2026-09-04');
  await setField('#bl-b-mat', '2036-09-04');
  await setField('#bl-b-coupon', '0');
  await page.selectOption('#bl-b-freq', '1');
  await page.selectOption('#bl-b-dc', 'ACT/ACT (ICMA)');
  await setField('#bl-b-yield', '4');
  await page.waitForFunction(() => document.getElementById('bl-out-clean').textContent.startsWith('67.55'));
  near(await val('#bl-out-clean'), 100 / Math.pow(1.04, 10), 1e-6, '零息债价格 = 100/1.04^10');
  near(await val('#bl-out-mac'), 10, 1e-6, '零息债麦考利久期 = 剩余年数');
  near(await val('#bl-out-accrued'), 0, 1e-9, '零息债无应计');

  /* ---------- 5. 冲击表：真实重估 vs 一阶/二阶近似 ---------- */
  await setField('#bl-b-eff', '2025-08-15');
  await setField('#bl-b-mat', '2035-08-15');
  await setField('#bl-b-coupon', '4.25');
  await page.selectOption('#bl-b-freq', '2');
  await setField('#bl-b-yield', '4.45');
  await page.waitForFunction(() => document.getElementById('bl-out-clean').textContent.startsWith('98.535'));
  const shiftRows = await page.locator('#bl-shift-table tbody tr').all();
  A(shiftRows.length === 9, `冲击表应有 9 行，实际 ${shiftRows.length}`);
  const cellsOf = async (row) => (await row.locator('td').allInnerTexts()).map((s) => s.trim());
  const zeroRow = await cellsOf(shiftRows[4]);
  A(zeroRow[0] === '0 bp', '第 5 行应是 0bp，实际 ' + zeroRow[0]);
  near(numOf(zeroRow[1]), 98.535020404, 1e-4, '0bp 行的重估净价应等于当前净价');
  near(numOf(zeroRow[2]), 0, 1e-6, '0bp 行价格变化应为 0');
  const up100 = await cellsOf(shiftRows[7]);
  A(up100[0] === '+100 bp', '第 8 行应是 +100bp，实际 ' + up100[0]);
  near(numOf(up100[1]), 91.589679, 1e-4, '+100bp 的重估净价（QuantLib cleanPrice @5.45%）');
  const dn200 = await cellsOf(shiftRows[0]);
  A(dn200[0] === '-200 bp', '第 1 行应是 -200bp，实际 ' + dn200[0]);
  near(numOf(dn200[1]), 114.379898, 1e-4, '-200bp 的重估净价（QuantLib cleanPrice @2.45%）');
  near(numOf((await cellsOf(shiftRows[8]))[1]), 85.218282, 1e-4, '+200bp 的重估净价（QuantLib cleanPrice @6.45%）');
  // 一阶必然低估凸债价格 ⇒ 久期估算 < 真实；二阶误差必须更小
  const e1 = Math.abs(numOf(up100[5])), e2 = Math.abs(numOf(up100[6]));
  A(numOf(up100[3]) < numOf(up100[1]), '+100bp 时一阶近似应低于真实价格（凸性为正）');
  A(e2 < e1 / 5, `二阶误差 ${e2} 应远小于一阶误差 ${e1}`);

  /* ---------- 6. 现金流表：逐行加总必须回到全价 ---------- */
  const flowRows = await page.locator('#bl-flow-table tbody tr').all();
  A(flowRows.length === 19, `现金流应有 19 行，实际 ${flowRows.length}`);
  let pvSum = 0, amtSum = 0;
  for (const r of flowRows) {
    const c = await cellsOf(r);
    pvSum += numOf(c[8]);
    amtSum += numOf(c[5]);
  }
  near(pvSum, 98.765998665, 2e-4, '现金流现值之和应等于全价');
  const lastFlow = await cellsOf(flowRows[flowRows.length - 1]);
  A(lastFlow[0] === '2035-08-15' && lastFlow[1] === '本金', '最后一笔应是 2035-08-15 的本金');
  near(numOf(lastFlow[5]), 100, 1e-9, '本金金额应为 100');
  A(amtSum > 100 && amtSum < 200, `现金流名义合计 ${amtSum} 不合理`);

  /* ---------- 7. 收益率曲线：自举 vs QuantLib PiecewiseLinearZero ---------- */
  await onTab('curve');
  await setField('#bl-c-ref', '2026-09-04');
  await setField('#bl-c-probe', '8.5');
  await page.waitForFunction(() => document.getElementById('bl-out-probe-zero').textContent.startsWith('3.96'));
  near(await val('#bl-out-probe-zero'), 3.96291818, 1e-4, '8.5 年零息利率（曲线线性插值）');
  near(await val('#bl-out-probe-df'), 0.71401733, 1e-6, '8.5 年折现因子');
  near(await val('#bl-out-probe-fwd'), 4.42249544, 1e-4, '8.5→9.5 年隐含 1 年远期');

  const curveRows = await page.locator('#bl-curve-tbl tbody tr').all();
  A(curveRows.length === 9, `曲线表应有 9 行，实际 ${curveRows.length}`);
  const row1y = await cellsOf(curveRows[1]);
  A(row1y[2] === '2027-09-04', '1 年节点到期日应为 2027-09-04，实际 ' + row1y[2]);
  near(numOf(row1y[4]), 3.9793445, 1e-4, '1 年零息利率（QuantLib PiecewiseLinearZero）');
  near(numOf(row1y[6]), 0.9609879, 1e-6, '1 年折现因子');
  const row10y = await cellsOf(curveRows[6]);
  near(numOf(row10y[4]), 4.03588063, 1e-4, '10 年零息利率（QuantLib PiecewiseLinearZero）');
  near(numOf(row10y[6]), 0.66769768, 1e-6, '10 年折现因子');
  const row30y = await cellsOf(curveRows[8]);
  near(numOf(row30y[6]), 0.27171042, 1e-6, '30 年折现因子');
  // 平价票息 4.02% 的 1 年期与零息 3.979%（连续）：换算成半年复利后应几乎相等
  near(numOf(row1y[5]), 4.017, 0.01, '1 年零息按半年复利换算应接近平价票息 4.02%');

  const nssRows = await page.locator('#bl-nss-tbl tbody tr').all();
  A(nssRows.length === 6, 'NSS 参数表应有 6 行');
  A((await val('#bl-out-nss-rmse')) < 5, 'NSS 拟合残差应小于 5bp');

  /* ---------- 8. 曲线形态切换：倒挂时短端必须高于长端 ---------- */
  await page.locator('#bl-c-presets button[data-cpreset="inverted"]').click();
  await page.waitForFunction(() =>
    Number(document.querySelector('#bl-curve-tbl tbody tr td:nth-child(2)').textContent.replace('%', '')) > 5);
  const invRows = await page.locator('#bl-curve-tbl tbody tr').all();
  const invShort = numOf((await cellsOf(invRows[0]))[4]);
  const invLong = numOf((await cellsOf(invRows[8]))[4]);
  A(invShort > invLong, `倒挂形态下 6 个月零息 ${invShort}% 应高于 30 年 ${invLong}%`);
  await page.locator('#bl-c-presets button[data-cpreset="normal"]').click();
  await page.waitForFunction(() => document.getElementById('bl-out-probe-zero').textContent.startsWith('3.96'));

  /* ---------- 9. 组合：逐券与汇总（QuantLib 逐券对拍） ---------- */
  await onTab('portfolio');
  await page.waitForSelector('#bl-pf-rows-table tbody tr');
  A((await txt('#bl-pf-settle')) === '2026-09-04', '组合应沿用债券页的结算日');
  const pfRows = await page.locator('#bl-pf-rows-table tbody tr').all();
  A(pfRows.length === 3, `示例组合应有 3 只，实际 ${pfRows.length}`);
  const h2 = await cellsOf(pfRows[1]);
  near(numOf(h2[3]), 101.2139946, 1e-4, '10 年国债全价（QuantLib cleanPrice + accrued）');
  near(numOf(h2[5]), 4.14851783, 1e-4, '10 年国债到期收益率（QuantLib bondYield）');
  near(numOf(h2[6]), 7.9838341, 1e-4, '10 年国债修正久期');
  near(numOf(h2[4]), 3036419.84, 0.02, '10 年国债市值 = 面值/100 × 全价');
  const h3 = await cellsOf(pfRows[2]);
  near(numOf(h3[6]), 16.4292289, 1e-4, '30 年国债修正久期');
  near(await val('#bl-out-pf-mv'), 2038290.76 + 3036419.84 + 1037631.79, 0.05, '组合市值 = 三只之和');
  near(await val('#bl-out-pf-dv01'), 0.0190985642 * 20000 + 0.0808075744 * 30000 + 0.1704749028 * 10000, 0.02,
    '组合 DV01 = 逐券 DV01 之和');
  // 加权久期必须落在最短与最长之间，且等于按市值加权的结果
  const wdur = (1.8739783912 * 2038290.76 + 7.9838341263 * 3036419.84 + 16.4292289346 * 1037631.79) /
    (2038290.76 + 3036419.84 + 1037631.79);
  near(await val('#bl-out-pf-dur'), wdur, 1e-4, '组合修正久期 = 市值加权');
  const pfIrr = await val('#bl-out-pf-irr');
  A(pfIrr > 3.9 && pfIrr < 4.4, `组合现金流 XIRR ${pfIrr}% 应落在各券收益率之间`);

  const scenRows = await page.locator('#bl-scen-table tbody tr').all();
  A(scenRows.length === 9, '情景表应有 9 行');
  const scen0 = await cellsOf(scenRows[4]);
  near(numOf(scen0[2]), 0, 0.01, '0bp 情景损益应为 0');
  const scenUp = await cellsOf(scenRows[8]);
  A(scenUp[0] === '+200 bp' && numOf(scenUp[2]) < 0, '+200bp 应该是亏损');
  const scenDn = await cellsOf(scenRows[0]);
  A(scenDn[0] === '-200 bp' && numOf(scenDn[2]) > 0, '-200bp 应该是盈利');
  A(Math.abs(numOf(scenDn[2])) > Math.abs(numOf(scenUp[2])),
    '凸性 ⇒ 下行 200bp 的盈利应大于上行 200bp 的亏损');

  /* ---------- 10. 组合可编辑：删一只，读数必须跟着变 ---------- */
  const mvBefore = await val('#bl-out-pf-mv');
  await page.locator('#bl-pf-edit-table button[data-del="2"]').click();
  await page.waitForFunction((v) => Number(document.getElementById('bl-out-pf-mv').textContent.replace(/,/g, '')) < v, mvBefore);
  A((await page.locator('#bl-pf-rows-table tbody tr').count()) === 2, '删除后应剩 2 只');
  near(await val('#bl-out-pf-mv'), 2038290.76 + 3036419.84, 0.05, '删掉 30 年债后的组合市值');
  await page.locator('#bl-pf-reset').click();
  await page.waitForFunction(() => document.querySelectorAll('#bl-pf-rows-table tbody tr').length === 3);

  /* ---------- 11. 互换：vs QuantLib VanillaSwap ---------- */
  await onTab('swap');
  await setField('#bl-sw-years', '5');
  await setField('#bl-sw-rate', '3.9');
  await setField('#bl-sw-not', '10000000');
  await page.waitForFunction(() => document.getElementById('bl-out-sw-par').textContent.startsWith('3.83'));
  near(await val('#bl-out-sw-par'), 3.83592468, 1e-5, '5 年平价互换利率（QuantLib VanillaSwap.fairRate）');
  near(await val('#bl-out-sw-npv'), -28646.11, 0.05, '付固定方现值（QuantLib NPV × 10）');
  // 页面把两条腿都按正数额度显示，卡片上写明「现值（付固定方）= 浮动腿现值 − 固定腿现值」；
  // QuantLib 的 fixedLegNPV 是付方视角的负数，两者只差一个符号约定
  near(await val('#bl-out-sw-fix'), 1743570.50, 0.1, '固定腿现值（QuantLib fixedLegNPV 的绝对值 × 10）');
  near(await val('#bl-out-sw-flt'), 1714924.39, 0.1, '浮动腿现值（QuantLib floatingLegNPV × 10）');
  near(await val('#bl-out-sw-flt') - await val('#bl-out-sw-fix'), await val('#bl-out-sw-npv'), 0.02,
    '卡片上写的等式：现值 = 浮动腿 − 固定腿');
  near(await val('#bl-out-sw-dv01'), 4470.6936, 0.02, '固定腿 DV01（QuantLib fixedLegBPS × 10）');
  A((await txt('#bl-out-sw-nfix')) === '5' && (await txt('#bl-out-sw-nflt')) === '10',
    '5 年年付/半年付应是 5 期与 10 期');
  const fixLeg = await page.locator('#bl-swap-fixed-table tbody tr').all();
  A(fixLeg.length === 5, '固定腿应有 5 期');
  // 把固定利率设成平价利率 ⇒ 现值必须归零
  await page.locator('#bl-sw-par').click();
  await page.waitForFunction(() => Math.abs(Number(
    document.getElementById('bl-out-sw-npv').textContent.replace(/[+,]/g, ''))) < 1);
  near(await val('#bl-out-sw-npv'), 0, 0.5, '固定利率 = 平价利率时现值应归零');

  /* ---------- 12. 计息惯例：八种惯例逐项对拍 QuantLib ---------- */
  await onTab('daycount');
  await setField('#bl-dc-d1', '2026-02-28');
  await setField('#bl-dc-d2', '2026-08-31');
  await page.waitForFunction(() => document.querySelectorAll('#bl-dc-tbl tbody tr').length === 8);
  const EXPECT_DC = {
    'ACT/ACT (ICMA)': [184, 0.50815217],
    'ACT/ACT (ISDA)': [184, 0.50410959],
    'ACT/365F': [184, 0.50410959],
    'ACT/360': [184, 0.51111111],
    '30/360 (Bond Basis)': [183, 0.50833333],
    '30/360 (US)': [180, 0.5],
    '30E/360': [182, 0.50555556],
    '30E/360 (ISDA)': [180, 0.5]
  };
  const dcRows = await page.locator('#bl-dc-tbl tbody tr').all();
  const seenDc = new Set();
  for (const r of dcRows) {
    const c = await cellsOf(r);
    const e = EXPECT_DC[c[0]];
    A(!!e, `计息惯例表出现未知条目 ${c[0]}`);
    seenDc.add(c[0]);
    A(numOf(c[1]) === e[0], `${c[0]} 天数应为 ${e[0]}，实际 ${c[1]}`);
    near(numOf(c[2]), e[1], 1e-7, `${c[0]} 年化分数（QuantLib yearFraction）`);
    near(numOf(c[3]), e[1] * 5, 1e-6, `${c[0]} 的 5% 票息利息`);
  }
  // 能力清单守卫：页面公布的 8 种惯例，一种都不能少（2026-08-28 教训）
  A(seenDc.size === 8, `八种惯例应全部出现，实际 ${seenDc.size} 种`);
  const dcNames = await page.evaluate(() => window.BL.DC_NAMES);
  for (const nm of dcNames) A(seenDc.has(nm), `引擎声明的惯例 ${nm} 没有出现在对照表里`);

  /* ---------- 13. 日程生成：vs QuantLib Schedule（含月末规则） ---------- */
  await setField('#bl-s-eff', '2026-01-31');
  await setField('#bl-s-mat', '2031-01-31');
  await page.selectOption('#bl-s-freq', '2');
  await page.selectOption('#bl-s-bdc', 'ModifiedFollowing');
  await page.locator('#bl-s-eom').check();
  await page.waitForFunction(() => document.querySelectorAll('#bl-sch-tbl tbody tr').length === 11);
  const EXPECT_SCH = ['2026-01-30', '2026-07-31', '2027-01-29', '2027-07-30', '2028-01-31',
    '2028-07-31', '2029-01-31', '2029-07-31', '2030-01-31', '2030-07-31', '2031-01-31'];
  const schRows = await page.locator('#bl-sch-tbl tbody tr').all();
  A(schRows.length === EXPECT_SCH.length, `日程应有 ${EXPECT_SCH.length} 行，实际 ${schRows.length}`);
  for (let i = 0; i < schRows.length; i++) {
    const c = await cellsOf(schRows[i]);
    A(c[2] === EXPECT_SCH[i], `第 ${i} 个付息日应为 ${EXPECT_SCH[i]}，实际 ${c[2]}`);
  }
  // 月末开关必须真的接了线。注意 1/31→7/31 这组日期**开关与否结果相同**（两个月都有 31 天），
  // 所以换一组 2 月末的日期才测得出差别（2026-08-10 教训：等待目标态出现，别等「不等于旧值」）。
  const schDates = async () => (await page.locator('#bl-sch-tbl tbody tr td:nth-child(3)').allInnerTexts()).map((x) => x.trim());
  await setField('#bl-s-eff', '2026-02-28');
  await setField('#bl-s-mat', '2031-02-28');
  await page.waitForFunction(() =>
    document.querySelector('#bl-sch-tbl tbody tr:nth-child(2) td:nth-child(3)').textContent.trim() === '2026-08-31');
  const EOM_ON = ['2026-02-27', '2026-08-31', '2027-02-26', '2027-08-31', '2028-02-29', '2028-08-31',
    '2029-02-28', '2029-08-31', '2030-02-28', '2030-08-30', '2031-02-28'];
  const EOM_OFF = ['2026-02-27', '2026-08-28', '2027-02-26', '2027-08-30', '2028-02-28', '2028-08-28',
    '2029-02-28', '2029-08-28', '2030-02-28', '2030-08-28', '2031-02-28'];
  A(JSON.stringify(await schDates()) === JSON.stringify(EOM_ON),
    `月末规则开启时的日程（QuantLib Schedule endOfMonth=true）：${(await schDates()).join(',')}`);
  await page.locator('#bl-s-eom').uncheck();
  await page.waitForFunction(() =>
    document.querySelector('#bl-sch-tbl tbody tr:nth-child(2) td:nth-child(3)').textContent.trim() === '2026-08-28');
  A(JSON.stringify(await schDates()) === JSON.stringify(EOM_OFF),
    `关掉月末规则后的日程（QuantLib Schedule endOfMonth=false）：${(await schDates()).join(',')}`);

  /* ---------- 14. 非法输入必须报错且不留下脏读数 ---------- */
  await onTab('bond');
  await setField('#bl-b-mat', '2020-01-01');
  await page.waitForFunction(() =>
    getComputedStyle(document.getElementById('bl-bond-err')).display !== 'none');
  A((await txt('#bl-bond-err')).includes('到期日'), '到期日早于起息日应给出明确报错');
  await setField('#bl-b-mat', '2035-08-15');
  await setField('#bl-b-coupon', 'abc');
  await page.waitForFunction(() => document.getElementById('bl-bond-err').textContent.includes('票面利率'));
  A((await txt('#bl-bond-err')).includes('不是有效数字'), '非数字票息应报「不是有效数字」');
  await setField('#bl-b-coupon', '4.25');
  await page.waitForFunction(() =>
    getComputedStyle(document.getElementById('bl-bond-err')).display === 'none');
  near(await val('#bl-out-clean'), 98.535020404, 1e-6, '改回合法输入后读数应恢复');

  /* ---------- 15. localStorage 持久化 ---------- */
  await page.reload({ waitUntil: 'load' });
  await page.waitForSelector('#bl-out-clean');
  A((await page.locator('#bl-b-mat').inputValue()) === '2035-08-15', '刷新后到期日应被记住');
  A((await page.locator('#bl-b-coupon').inputValue()) === '4.25', '刷新后票息应被记住');

  /* ---------- 16. SVG 图元守卫：画出来了 + 文字不重叠不越界 ---------- */
  const checkChart = async (sel, minLabels) => {
    const info = await page.locator(sel).evaluate((svg) => {
      const vb = svg.viewBox.baseVal;
      const texts = [...svg.querySelectorAll('text')];
      const boxes = texts.map((t) => { const b = t.getBBox(); return { b, s: t.textContent }; });
      let overlaps = [], outside = [];
      for (let i = 0; i < boxes.length; i++) {
        const a = boxes[i].b;
        if (a.x < -1 || a.y < -1 || a.x + a.width > vb.width + 1 || a.y + a.height > vb.height + 1)
          outside.push(boxes[i].s);
        for (let j = i + 1; j < boxes.length; j++) {
          const c = boxes[j].b;
          if (a.x < c.x + c.width && c.x < a.x + a.width && a.y < c.y + c.height && c.y < a.y + a.height)
            overlaps.push(boxes[i].s + ' ↔ ' + boxes[j].s);
        }
      }
      return {
        texts: texts.length, paths: svg.querySelectorAll('path').length,
        rects: svg.querySelectorAll('rect[data-bl-bar],rect[data-bl-cal-bar]').length,
        dropped: Number(svg.getAttribute('data-bl-dropped')), drawn: Number(svg.getAttribute('data-bl-drawn')),
        overlaps, outside, w: vb.width, h: vb.height
      };
    });
    A(info.overlaps.length === 0, `${sel} 有文字重叠：${info.overlaps.slice(0, 4).join(' / ')}`);
    A(info.outside.length === 0, `${sel} 有文字越出画布：${info.outside.slice(0, 4).join(' / ')}`);
    A(info.drawn >= minLabels, `${sel} 只画出 ${info.drawn} 个标注（应 ≥ ${minLabels}，丢弃 ${info.dropped}）`);
    A(info.texts === info.drawn, `${sel} 文字节点 ${info.texts} 与计数 ${info.drawn} 不一致`);
    return info;
  };
  const bondChart = await checkChart('#bl-bond-chart svg', 8);
  A(bondChart.paths >= 3, `价格-收益率图应有 3 条曲线，实际 ${bondChart.paths}`);
  await onTab('curve');
  const curveChart = await checkChart('#bl-curve-chart svg', 8);
  A(curveChart.paths >= 4, `曲线图应有 4 条线，实际 ${curveChart.paths}`);
  await onTab('portfolio');
  const krd = await checkChart('#bl-pf-krd svg', 12);
  A(krd.rects === 8, `关键期限图应有 8 根柱子，实际 ${krd.rects}`);
  const cal = await checkChart('#bl-pf-cal svg', 4);
  A(cal.rects >= 20, `现金流日历应有 ≥20 根柱子，实际 ${cal.rects}`);
  // 几何断言：柱子高度必须和数值成比例（2026-09-02 教训：只断数字测不出图错）
  const bars = await page.locator('#bl-pf-krd svg rect[data-bl-bar]').evaluateAll(
    (els) => els.map((e) => ({ h: +e.getAttribute('height'), w: +e.getAttribute('width') })));
  A(bars.every((b) => b.w > 8), `关键期限柱子太窄：${JSON.stringify(bars.map((b) => b.w))}`);
  A(Math.max(...bars.map((b) => b.h)) > 100, '最高的柱子应占据画布主要高度');
  A(bars.filter((b) => b.h > 2).length >= 2, '应有至少两个非零期限桶');

  /* ---------- 17. 逐分区控件尺寸守卫（隐藏面板里的控件同样要扫） ---------- */
  let scanned = 0;
  for (const t of TABS) {
    await onTab(t);
    const bad = await page.evaluate((tab) => {
      const out = [];
      const root = document.getElementById('bl-panel-' + tab);
      for (const el of root.querySelectorAll('input,select,button')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        const isCheck = el.type === 'checkbox';
        const minW = isCheck ? 16 : (el.tagName === 'BUTTON' ? 52 : 100);
        if (r.width < minW || r.height < 18) out.push(`${el.id || el.tagName}:${r.width.toFixed(0)}x${r.height.toFixed(0)}`);
      }
      return { bad: out, count: root.querySelectorAll('input,select,button').length };
    }, t);
    scanned += bad.count;
    A(bad.bad.length === 0, `分区 ${t} 有塌缩控件：${bad.bad.join(' ')}`);
  }
  A(scanned >= 45, `逐分区控件扫描应覆盖 ≥45 个控件，实际 ${scanned}`);

  /* ---------- 18. 逐视口 × 逐分区横向溢出守卫 ---------- */
  for (const vw of [390, 768, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of TABS) {
      await onTab(t);
      const over = await page.evaluate(() => {
        const de = document.documentElement;
        const spill = de.scrollWidth - de.clientWidth;
        if (spill <= 1) return { spill: 0, who: '' };
        let who = [];
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.right > de.clientWidth + 1 && r.width > 0)
            who.push(`${el.tagName}.${(el.className || '').toString().split(' ')[0]}@${r.right.toFixed(0)}`);
        }
        return { spill, who: who.slice(0, 5).join(' ') };
      });
      A(over.spill <= 1, `${vw}px 下分区 ${t} 横向溢出 ${over.spill}px：${over.who}`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 850 });

  /* ---------- 19. 单位/大小写守卫：th/dt/label 不许被 uppercase 改写 ---------- */
  const bogus = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('th,dt,label,.bl-eyebrow')) {
      if (getComputedStyle(el).textTransform === 'uppercase') out.push(el.textContent.trim().slice(0, 20));
      if (/\b(HZ|KHZ|DBFS|BP|YTM)\b/.test(el.textContent) && /[a-z]/.test(el.textContent) === false && el.textContent.length < 4)
        out.push('可疑大写：' + el.textContent);
    }
    return out;
  });
  A(bogus.length === 0, `有被 uppercase 改写的标签：${bogus.join(' / ')}`);

  /* ---------- 20. 说明页公布的验证规模必须自洽（分项之和 = 总数） ---------- */
  await onTab('notes');
  const parts = await page.locator('#bl-notes-verify [data-bl-n]').allInnerTexts();
  A(parts.length === 10, `说明页应列出 10 个分项，实际 ${parts.length}`);
  const partSum = parts.map(numOf).reduce((a, b) => a + b, 0);
  const claimed = numOf(await txt('#bl-verify-total'));
  A(partSum === claimed, `说明页分项之和 ${partSum} 应等于公布的总数 ${claimed}`);
  A(claimed === 91982, `离线对拍总数应是 91,982，实际 ${claimed}`);
  A(numOf(await txt('#bl-fact-assert')) === claimed, '首屏徽标与说明页公布的断言数应一致');

  /* ---------- 21. 缩略图：截「债券」页读数那一屏 ---------- */
  await onTab('bond');
  await page.waitForSelector('#bl-out-ytm');
  // 缩略图截读数 + 价格-收益率图那一屏，而不是顶部的英雄带／输入表单
  // （2026-09-04 教训：卡片缩略图要一眼看出工具在干什么）
  await page.evaluate(() => {
    const y = document.getElementById('bl-bond-head').getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.max(0, y - 96));
  });
  await page.waitForTimeout(220);          // 让 sticky 分区条与卡片过渡稳定后再截图
  await screenshot('thumb.png');

  console.log(`    (bond-lab: ${n} 条断言)`);
};
