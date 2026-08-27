// 预测工作台 · 集成测试
// 真的敲数据、切模型、翻标签页，并断言真实数值输出（引擎本身已与 statsmodels 逐点对拍 143016 条）。
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#fs-verdict .fs-verdict-name');

  const runs = () => page.evaluate(() => window.FS_UI.state.runCount);
  const waitRun = async (before) => {
    // run() 是同步渲染完才自增 runCount 的，所以计数一涨 DOM 就已经是新的了；
    // 不能顺手再等 #fs-chart —— 数据不足时它压根不会被画出来，等它就是死等。
    await page.waitForFunction((b) => window.FS_UI.state.runCount > b, before, { timeout: 20000 });
  };
  const st = () => page.evaluate(() => {
    const s = window.FS_UI.state, r = s.result;
    return {
      n: s.y.length, m: s.m, runCount: s.runCount,
      id: r && r.id, h: r && r.h, how: r && r.how,
      point: r ? r.point.slice() : null, lo: r && r.lo ? r.lo.slice() : null,
      hi: r && r.hi ? r.hi.slice() : null, lo2: r && r.lo2 ? r.lo2.slice() : null,
      hi2: r && r.hi2 ? r.hi2.slice() : null,
      labels: r ? r.futureLabels.slice() : null,
      last: s.y[s.y.length - 1],
      bt: s.bt ? s.bt.rows.map((x) => ({ id: x.id, mase: x.mase, origins: x.origins })) : null
    };
  });
  const near = (got, want, tol, what) =>
    assert(Math.abs(got - want) <= tol, `${what}: got ${got}, want ${want} ±${tol}`);

  // ================= 1. 默认示例（大气二氧化碳，真实 Mauna Loa 数据） =================
  let S = await st();
  assert(S.n === 192, `默认示例载入 192 期（实得 ${S.n}）`);
  const pills = (await page.locator('#fs-parse-pills').textContent()) || '';
  assert(/192 个观测值/.test(pills), `摘要显示观测数（实得 "${pills.trim()}"）`);
  assert(/月度/.test(pills), `摘要识别出月度频率（实得 "${pills.trim()}"）`);
  assert(/m = 12/.test(pills), `摘要显示季节周期 12（实得 "${pills.trim()}"）`);

  // 自动选模应挑中加法季节的 Holt-Winters，且回测 MASE ≈ 0.308
  assert(S.id === 'hwAdd', `CO2 自动选模挑中 Holt-Winters 加法季节（实得 ${S.id}）`);
  const btWin = S.bt[0];
  near(btWin.mase, 0.308, 0.004, 'CO2 冠军回测 MASE');
  assert(btWin.origins === 24, `回测折点数 24（实得 ${btWin.origins}）`);
  const verdict = (await page.locator('#fs-verdict').textContent()) || '';
  assert(/Holt-Winters 加法季节/.test(verdict), '结论卡写出模型名');
  assert(/照抄去年同月/.test(verdict), `月度数据的基准应写成「照抄去年同月」而不是「上一季同期」（实得 "${verdict.replace(/\s+/g, ' ').slice(0, 130)}"）`);
  assert(/0\.308/.test(verdict), `结论卡写出 MASE 0.308（实得 "${verdict.replace(/\s+/g, ' ').slice(0, 160)}"）`);
  assert(/自动挑选/.test(verdict), '结论卡标注这是自动挑选的');

  // 点预测：真实数值（与离线 statsmodels 对拍过的引擎一致）
  near(S.point[0], 372.042, 0.05, 'CO2 下一期（2002-01）预测');
  assert(S.labels[0] === '2002-01', `未来标签接续正确（实得 ${S.labels[0]}）`);
  assert(S.h === 24 && S.point.length === 24, `预测 24 期（实得 ${S.h}）`);
  assert(S.point[0] > S.last, `CO2 预测继续上升（${S.point[0]} > ${S.last}）`);

  // 季节形状必须对：Mauna Loa 的二氧化碳每年 5 月见顶、9-10 月见底
  const yr = S.point.slice(0, 12);
  const peak = yr.indexOf(Math.max.apply(null, yr));
  const trough = yr.indexOf(Math.min.apply(null, yr));
  assert(peak === 4, `年内峰值落在 5 月（实得第 ${peak + 1} 期 ${S.labels[peak]}）`);
  assert(trough === 8 || trough === 9, `年内谷值落在 9 或 10 月（实得 ${S.labels[trough]}）`);

  // 区间必须严格嵌套且随步长变宽
  assert(S.how === 'analytic', `默认走解析式区间（实得 ${S.how}）`);
  for (let i = 0; i < S.h; i++) {
    assert(S.lo[i] < S.lo2[i] && S.lo2[i] < S.point[i] && S.point[i] < S.hi2[i] && S.hi2[i] < S.hi[i],
      `第 ${i + 1} 期区间嵌套 95%⊃80%⊃点预测（${S.lo[i]} < ${S.lo2[i]} < ${S.point[i]} < ${S.hi2[i]} < ${S.hi[i]}）`);
  }
  const w1 = S.hi[0] - S.lo[0], w12 = S.hi[11] - S.lo[11];
  assert(w12 > w1 * 1.5, `区间随步长变宽（h=1 宽 ${w1.toFixed(3)}，h=12 宽 ${w12.toFixed(3)}）`);

  // 预测表行数与首行数字
  const rowCount = await page.locator('#fs-fc-table tbody tr').count();
  assert(rowCount === 24, `预测表 24 行（实得 ${rowCount}）`);
  const firstRow = (await page.locator('#fs-fc-table tbody tr').first().textContent()) || '';
  assert(/2002-01/.test(firstRow) && /372/.test(firstRow), `预测表首行含期次与数值（实得 "${firstRow.trim()}"）`);

  // ================= 2. 图形结构 =================
  assert((await page.locator('#fs-chart .fs-line-hist').count()) >= 1, '图上有历史折线');
  assert((await page.locator('#fs-chart .fs-line-fc').count()) === 1, '图上有一条预测线');
  assert((await page.locator('#fs-chart .fs-band-95').count()) === 1, '图上有 95% 区间带');
  assert((await page.locator('#fs-chart .fs-band-80').count()) === 1, '图上有 80% 区间带');
  assert((await page.locator('#fs-chart circle.fs-dot').count()) === 24, '每个预测点都画了标记');
  assert((await page.locator('#fs-chart .fs-line-fit').count()) === 0, '默认不画拟合线');
  // y 轴刻度不能塌成两根（nice-number 阶梯选档不当时会这样，只有人工看图或数刻度能发现）
  const yTickCount = async () => page.evaluate(() =>
    Array.from(document.querySelectorAll('#fs-chart text')).filter((t) => t.getAttribute('text-anchor') === 'end').length);
  assert((await yTickCount()) >= 4, `y 轴至少 4 根刻度（实得 ${await yTickCount()}）`);

  // 勾上「显示拟合值」后应出现拟合线
  await page.check('#fs-show-fitted');
  await page.waitForSelector('#fs-chart .fs-line-fit');
  assert((await page.locator('#fs-chart .fs-line-fit').count()) >= 1, '勾选后出现拟合线');
  await page.uncheck('#fs-show-fitted');
  await page.waitForFunction(() => document.querySelectorAll('#fs-chart .fs-line-fit').length === 0);

  // 悬停读数
  const box = await page.locator('#fs-chart').boundingBox();
  await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.5);
  await page.waitForFunction(() => /预测/.test(document.getElementById('fs-readout').textContent || ''), null, { timeout: 8000 });
  const readout = (await page.locator('#fs-readout').textContent()) || '';
  assert(/期次/.test(readout) && /\d/.test(readout), `悬停读出具体数值（实得 "${readout.replace(/\s+/g, ' ').trim()}"）`);

  // ================= 3. 模型对比页 =================
  await page.click('#fs-tab-compare');
  await page.waitForSelector('#fs-bt-table tbody tr');
  const btRows = await page.locator('#fs-bt-table tbody tr').count();
  assert(btRows >= 8, `排行榜至少 8 个模型（实得 ${btRows}）`);
  const winRow = (await page.locator('#fs-bt-table tbody tr.fs-row-win').first().textContent()) || '';
  assert(/Holt-Winters 加法季节/.test(winRow), `冠军行高亮的是 HW 加法季节（实得 "${winRow.trim()}"）`);
  // 榜单必须按 MASE 升序
  const maseCells = await page.locator('#fs-bt-table tbody tr td:nth-child(2)').allTextContents();
  const maseVals = maseCells.map(Number).filter((v) => isFinite(v));
  for (let i = 1; i < maseVals.length; i++) {
    assert(maseVals[i] >= maseVals[i - 1] - 1e-9, `排行榜按 MASE 升序（第 ${i} 位 ${maseVals[i - 1]} > 第 ${i + 1} 位 ${maseVals[i]}）`);
  }
  // 季节朴素法的 MASE 应该在 1 附近（它就是 MASE 的分母基准）
  const sn = S.bt.filter((r) => r.id === 'snaive')[0];
  assert(sn && Math.abs(sn.mase - 1) < 0.45, `季节朴素法 MASE 落在 1 附近（实得 ${sn && sn.mase}）`);
  assert(btWin.mase < sn.mase, `冠军确实优于季节朴素法（${btWin.mase} < ${sn.mase}）`);
  assert((await page.locator('#fs-bth-chart rect.fs-bar-win').count()) >= 1, '步长误差图画出了冠军柱');

  // 点「选用」把模型切成朴素法 —— 朴素法的预测必须是一条水平线且等于最后一个观测值
  let before = await runs();
  await page.click('#fs-bt-table tbody tr td button[data-model="naive"]');
  await waitRun(before);
  S = await st();
  assert(S.id === 'naive', `选用按钮切换到朴素法（实得 ${S.id}）`);
  assert(await page.locator('#fs-panel-forecast').isVisible(), '选用后跳回预测页');
  for (let i = 0; i < S.h; i++) near(S.point[i], S.last, 1e-9, `朴素法第 ${i + 1} 期恒等于最后观测`);
  // 朴素法区间宽度应正比于 √h
  const rw = (S.hi[3] - S.lo[3]) / (S.hi[0] - S.lo[0]);
  near(rw, 2, 0.02, '朴素法 h=4 与 h=1 的区间宽度比应为 √4 = 2');

  // ================= 4. 换示例：尼罗河（无季节，水平漂移）=================
  before = await runs();
  await page.click('#fs-examples button[data-example="nile"]');
  await waitRun(before);
  S = await st();
  assert(S.n === 100, `尼罗河示例 100 期（实得 ${S.n}）`);
  assert(S.m === 1 || (await page.inputValue('#fs-m')) === '1', '尼罗河按无季节处理');
  assert(S.id === 'ses', `尼罗河自动选中 SES（实得 ${S.id}）`);
  assert((await yTickCount()) >= 4, `尼罗河图 y 轴至少 4 根刻度（实得 ${await yTickCount()}）`);
  const flat = S.point.every((v) => Math.abs(v - S.point[0]) < 1e-9);
  assert(flat, 'SES 对无趋势序列给出水平预测');
  near(S.point[0], 805.04, 0.5, '尼罗河 SES 预测水平');

  // ================= 5. 换示例：太阳黑子（AR 抓 11 年周期）=================
  before = await runs();
  await page.click('#fs-examples button[data-example="sunspots"]');
  await waitRun(before);
  S = await st();
  assert(S.id === 'ar', `太阳黑子自动选中自回归（实得 ${S.id}）`);
  assert((await yTickCount()) >= 4, `太阳黑子图 y 轴至少 4 根刻度（实得 ${await yTickCount()}）`);
  near(S.point[0], 24.42, 0.6, '太阳黑子下一期预测');
  const mx = Math.max.apply(null, S.point), mn = Math.min.apply(null, S.point);
  assert(mx > 60 && mn < 40, `AR 复现出周期性起伏（峰 ${mx.toFixed(1)} 谷 ${mn.toFixed(1)}）`);
  const rise = S.point.slice(0, 5);
  assert(rise[4] > rise[0] * 2, `预测先上行（${rise[0].toFixed(1)} → ${rise[4].toFixed(1)}）`);

  // ================= 6. 诊断页（含隐藏面板内的控件，必须先切页再操作）=================
  await page.click('#fs-tab-diag');
  await page.waitForSelector('#fs-acf-chart');
  const lagsDefault = await page.locator('#fs-acf-chart rect.fs-bar').count();
  assert(lagsDefault === 24, `ACF 默认画 24 根柱（实得 ${lagsDefault}）`);
  await page.fill('#fs-lags', '40');
  await page.dispatchEvent('#fs-lags', 'change');
  await page.waitForFunction(() => document.querySelectorAll('#fs-acf-chart rect.fs-bar').length === 40, null, { timeout: 8000 });
  assert((await page.locator('#fs-pacf-chart rect.fs-bar').count()) === 40, 'PACF 同步跟到 40 阶');
  // 太阳黑子的 ACF 在 11 阶附近应有正峰（约 11 年周期）
  const acfPeak = await page.evaluate(() => {
    const y = window.FS_UI.state.y, a = FS.acf(y, 24);
    let best = 2;
    for (let k = 5; k <= 20; k++) if (a[k] > a[best]) best = k;
    return { best, v: a[best] };
  });
  assert(acfPeak.best >= 9 && acfPeak.best <= 13, `太阳黑子 ACF 峰落在 9-13 阶（实得 ${acfPeak.best} 阶，值 ${acfPeak.v.toFixed(3)}）`);
  const descTxt = (await page.locator('#fs-desc').textContent()) || '';
  assert(/期数 n/.test(descTxt) && /259/.test(descTxt), `描述统计写出期数（实得 "${descTxt.replace(/\s+/g, ' ').slice(0, 90)}"）`);

  // 切回 CO2 看分解图（4 联）
  before = await runs();
  await page.click('#fs-examples button[data-example="co2"]');
  await waitRun(before);
  await page.click('#fs-tab-diag');
  await page.waitForSelector('#fs-dc-seasonal');
  for (const id of ['fs-dc-raw', 'fs-dc-trend', 'fs-dc-seasonal', 'fs-dc-resid']) {
    assert((await page.locator('#' + id + ' polyline').count()) >= 1, `分解图 ${id} 画出了折线`);
  }
  // 季节分量必须是严格周期的：相隔 12 期完全相等
  const seasonalOK = await page.evaluate(() => {
    const d = FS.decompose(window.FS_UI.state.y, 12, 'add');
    for (let i = 12; i < d.seasonal.length; i++) if (Math.abs(d.seasonal[i] - d.seasonal[i - 12]) > 1e-12) return false;
    return Math.max.apply(null, d.indices) - Math.min.apply(null, d.indices) > 3;
  });
  assert(seasonalOK, '季节分量以 12 期为周期严格重复，且振幅显著');
  const periodTxt = (await page.locator('#fs-period-table tbody tr.fs-row-win').textContent()) || '';
  assert(/^12/.test(periodTxt.trim()), `候选周期表把 12 标为当前（实得 "${periodTxt.trim()}"）`);
  const cands = (await page.locator('#fs-period-table tbody tr td:first-child').allTextContents()).map(Number);
  assert(cands.every((v) => [2, 3, 4, 6, 12, 24].includes(v)),
    `月度数据的候选周期只应来自月度池（实得 ${cands.join(',')}）`);

  // ================= 7. 设置项真的起作用 =================
  await page.click('#fs-tab-forecast');
  before = await runs();
  await page.fill('#fs-h', '6');
  await page.dispatchEvent('#fs-h', 'change');
  await waitRun(before);
  S = await st();
  assert(S.h === 6 && S.point.length === 6, `预测步数改成 6 生效（实得 ${S.h}）`);

  before = await runs();
  await page.selectOption('#fs-interval', 'boot');
  await waitRun(before);
  S = await st();
  assert(S.how === 'boot', `切成自助抽样区间（实得 ${S.how}）`);
  for (let i = 0; i < S.h; i++) {
    assert(S.lo[i] < S.point[i] && S.point[i] < S.hi[i], `自助区间第 ${i + 1} 期仍包住点预测`);
  }
  const noteTxt = (await page.locator('#fs-interval-note').textContent()) || '';
  assert(/自助抽样/.test(noteTxt), '区间口径说明跟着切换');

  before = await runs();
  await page.selectOption('#fs-interval', 'auto');
  await page.selectOption('#fs-level', '0.8');
  await waitRun(before);
  const S80 = await st();
  before = await runs();
  await page.selectOption('#fs-level', '0.95');
  await waitRun(before);
  const S95 = await st();
  assert((S95.hi[0] - S95.lo[0]) > (S80.hi[0] - S80.lo[0]) * 1.2,
    `95% 区间明显宽于 80%（${(S95.hi[0] - S95.lo[0]).toFixed(3)} vs ${(S80.hi[0] - S80.lo[0]).toFixed(3)}）`);

  // 对数变换：CO2 全为正，应该能开启且结果仍为正
  before = await runs();
  await page.check('#fs-log');
  await waitRun(before);
  S = await st();
  assert(S.point.every((v) => v > 0), '对数变换后预测仍为正数');
  assert((await page.locator('#fs-verdict').textContent() || '').includes('已做对数变换'), '结论卡标注了对数变换');
  before = await runs();
  await page.uncheck('#fs-log');
  await waitRun(before);

  // ================= 8. 导出与复制 =================
  const csv = await page.evaluate(() => window.FS_UI.forecastCSV());
  const csvLines = csv.trim().split('\n');
  assert(csvLines.length === 7, `CSV 含表头 + 6 行（实得 ${csvLines.length}）`);
  assert(/^期次,点预测,/.test(csvLines[0]), `CSV 表头正确（实得 "${csvLines[0]}"）`);
  assert(/^2002-01,/.test(csvLines[1]), `CSV 首行是第一期（实得 "${csvLines[1]}"）`);
  const csvNum = Number(csvLines[1].split(',')[1]);
  near(csvNum, (await st()).point[0], 1e-4, 'CSV 里的数值与页面一致');
  await page.click('#fs-copy');
  await page.waitForFunction(() => /已复制/.test(document.getElementById('fs-copy').textContent || ''), null, { timeout: 8000 });

  // ================= 9. 项目保存 / 载入（localStorage）=================
  await page.fill('#fs-pname', '测试项目');
  await page.click('#fs-save');
  await page.waitForFunction(() => document.querySelectorAll('#fs-project option').length >= 2, null, { timeout: 8000 });
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('fs.forecast-studio.projects') || '[]'));
  assert(saved.length === 1 && saved[0].name === '测试项目', `项目写进 localStorage（实得 ${JSON.stringify(saved.map((x) => x.name))}）`);
  assert(saved[0].text.split('\n').length === 192, `项目存下了完整数据（实得 ${saved[0].text.split('\n').length} 行）`);
  // 换掉数据后再从下拉载回来，内容应还原
  before = await runs();
  await page.fill('#fs-input', '10\n20\n30\n40\n50\n60');
  await waitRun(before);
  assert((await st()).n === 6, '手敲的 6 个数被解析');
  before = await runs();
  await page.selectOption('#fs-project', saved[0].id);
  await waitRun(before);
  assert((await st()).n === 192, '从项目载回后恢复成 192 期');

  // ================= 10. 边界与非法输入 =================
  before = await runs();
  await page.fill('#fs-input', '');
  await waitRun(before);
  assert(/至少需要 4 个观测值/.test((await page.locator('#fs-chart-box').textContent()) || ''), '空输入给出明确提示');

  before = await runs();
  await page.fill('#fs-input', '月份,销量\n2024-01,100\n2024-02,NA\n2024-03,120\n2024-04,不是数字\n2024-05,140\n2024-06,150');
  await waitRun(before);
  S = await st();
  assert(S.n === 5, `表头被跳过、非法行被剔除、NA 被插值后剩 5 期（实得 ${S.n}）`);
  await page.click('#fs-tab-data');
  await page.waitForSelector('#fs-data-table tbody tr');
  const dataTxt = (await page.locator('#fs-panel-data').textContent()) || '';
  assert(/表头/.test(dataTxt), '数据页说明首行被当表头跳过');
  assert(/不是数字/.test(dataTxt), '数据页列出无法解析的行');
  assert(/插值补齐/.test(dataTxt), '数据页标出被插值的那一期');
  const naVal = await page.evaluate(() => window.FS_UI.state.y[1]);
  near(naVal, 110, 1e-9, 'NA 按前后线性插值补成 110');

  before = await runs();
  await page.fill('#fs-input', '5\n-3\n8\n-1\n9\n2\n7\n0\n6\n4\n11\n-2');
  await page.check('#fs-log');
  await waitRun(before);
  S = await st();
  assert(S.point.length > 0 && S.point.every((v) => isFinite(v)), '含负数时勾选对数变换不会崩，且退回原尺度');
  before = await runs();
  await page.uncheck('#fs-log');
  await waitRun(before);

  before = await runs();
  await page.fill('#fs-m', '1');
  await page.dispatchEvent('#fs-m', 'change');
  await waitRun(before);
  S = await st();
  assert(S.bt.every((r) => r.id !== 'snaive' && r.id !== 'hwAdd'), 'm=1 时季节模型不参与排行榜');
  assert(S.point.length > 0, 'm=1 时仍能给出预测');

  before = await runs();
  await page.fill('#fs-input', '1\n2\n3\n4');
  await page.fill('#fs-m', '1');
  await page.dispatchEvent('#fs-m', 'change');
  await waitRun(before);
  S = await st();
  assert(S.point.length > 0 && S.point.every((v) => isFinite(v)), '只有 4 个点时也能出预测且不产生 NaN');

  // ================= 11. 教训守卫 =================
  // (a) [hidden] 必须真的藏住：断计算样式而不是属性
  before = await runs();
  await page.click('#fs-examples button[data-example="gdp"]');
  await waitRun(before);
  await page.click('#fs-tab-forecast');
  const hiddenCheck = await page.evaluate(() => {
    const ids = ['fs-panel-forecast', 'fs-panel-compare', 'fs-panel-diag', 'fs-panel-data', 'fs-panel-method'];
    return ids.map((id) => {
      const e = document.getElementById(id);
      return { id, hidden: e.hidden, display: getComputedStyle(e).display };
    });
  });
  const shown = hiddenCheck.filter((x) => !x.hidden);
  assert(shown.length === 1 && shown[0].id === 'fs-panel-forecast', `只有一个面板可见（实得 ${shown.map((x) => x.id)}）`);
  hiddenCheck.filter((x) => x.hidden).forEach((x) => {
    assert(x.display === 'none', `${x.id} 标了 hidden 就必须计算样式为 none（实得 ${x.display}）`);
  });

  // (b) 逐个标签页扫控件尺寸（隐藏面板里的控件对尺寸守卫失明，必须切过去再量）
  let scanned = 0;
  for (const tab of ['fs-tab-forecast', 'fs-tab-compare', 'fs-tab-diag', 'fs-tab-data', 'fs-tab-method']) {
    await page.click('#' + tab);
    await page.waitForFunction((t) => document.getElementById(t).getAttribute('aria-selected') === 'true', tab);
    const bad = await page.evaluate(() => {
      const out = [];
      let count = 0;
      document.querySelectorAll('input,select,button,textarea').forEach((e) => {
        const r = e.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;      // 当前不可见的，跳过
        count++;
        const isCheck = e.type === 'checkbox' || e.type === 'radio';
        const minW = isCheck ? 18 : (e.tagName === 'BUTTON' ? 52 : 100);
        if (r.width < minW - 0.5 || r.height < 18 - 0.5) {
          out.push(`${e.tagName}#${e.id || e.className} ${r.width.toFixed(1)}x${r.height.toFixed(1)} (需 ≥${minW}x18)`);
        }
      });
      return { out, count };
    });
    assert(bad.out.length === 0, `${tab} 上控件尺寸合格（塌缩的有：${bad.out.join('; ')}）`);
    scanned += bad.count;
  }
  assert(scanned >= 60, `逐页累计扫到足够多的控件（实得 ${scanned}，防止「一个都没扫到也算绿」）`);

  // (c) 图内文字两两不重叠 —— SVG 版的「fillText 避让表」守卫
  for (const [tab, sel] of [['fs-tab-forecast', '#fs-chart'], ['fs-tab-compare', '#fs-bth-chart'],
  ['fs-tab-diag', '#fs-acf-chart'], ['fs-tab-diag', '#fs-pacf-chart'],
  ['fs-tab-diag', '#fs-dc-trend'], ['fs-tab-diag', '#fs-dc-seasonal']]) {
    await page.click('#' + tab);
    await page.waitForSelector(sel);
    const clash = await page.evaluate((s) => {
      const svg = document.querySelector(s);
      const ts = Array.from(svg.querySelectorAll('text'));
      const boxes = ts.map((t) => ({ t: t.textContent, r: t.getBoundingClientRect() }));
      const hits = [];
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i].r, b = boxes[j].r;
          const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (ox > 0.5 && oy > 0.5) hits.push(`"${boxes[i].t}" x "${boxes[j].t}"`);
        }
      }
      return { hits, n: boxes.length };
    }, sel);
    assert(clash.n >= 3, `${sel} 里画出了足够多的标签（实得 ${clash.n}）`);
    assert(clash.hits.length === 0, `${sel} 内文字互不重叠（重叠：${clash.hits.slice(0, 4).join(', ')}）`);
  }

  // (d) 子元素盒不越出父容器（pills / 图例 / 表格单元格）
  const overflow = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('#fs-parse-pills, #fs-legend, #fs-bth-legend').forEach((p) => {
      const pr = p.getBoundingClientRect();
      if (pr.width === 0) return;
      p.querySelectorAll(':scope > *').forEach((c) => {
        const cr = c.getBoundingClientRect();
        if (cr.left < pr.left - 1 || cr.right > pr.right + 1 || cr.top < pr.top - 1 || cr.bottom > pr.bottom + 1) {
          bad.push(`${p.id} > ${c.className || c.tagName}: ${cr.left.toFixed(0)},${cr.right.toFixed(0)} 越出 ${pr.left.toFixed(0)},${pr.right.toFixed(0)}`);
        }
      });
    });
    return bad;
  });
  assert(overflow.length === 0, `pill 与图例的子元素不越出父容器（越界：${overflow.slice(0, 3).join(' | ')}）`);

  // (e) 页面本身不横向滚动；宽表格只在自己的容器里滚
  const hScroll = await page.evaluate(() => ({
    body: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    tables: Array.from(document.querySelectorAll('.fs-tablewrap')).map((e) => getComputedStyle(e).overflowX)
  }));
  assert(hScroll.body <= 1, `页面不横向滚动（溢出 ${hScroll.body}px）`);
  assert(hScroll.tables.every((v) => v === 'auto' || v === 'scroll'), '宽表格自己带横向滚动容器');

  // 窄屏才是横向溢出的真正暴露口：宽视口下网格有余量，min-width:auto 的坑照样全绿。
  // 2026-08-27 实撞——1280px 全绿，390px 下 min-width:520px 的宽表把整列顶开、整页横向滚动。
  const outer = page.viewportSize();
  for (const vw of [390, 768]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const tab of ['fs-tab-forecast', 'fs-tab-compare', 'fs-tab-diag', 'fs-tab-data']) {
      await page.click('#' + tab);
      await page.waitForFunction((t) => document.getElementById(t).getAttribute('aria-selected') === 'true', tab);
      const ov = await page.evaluate(() => {
        const de = document.documentElement;
        const wide = [];
        document.querySelectorAll('body *').forEach((e) => {
          const r = e.getBoundingClientRect();
          if (r.width > 0 && r.right > de.clientWidth + 2 && !e.closest('.fs-tablewrap')) {
            wide.push(`${e.tagName}.${(e.className || '').toString().split(' ')[0]} 右边界 ${r.right.toFixed(0)}`);
          }
        });
        return { scroll: de.scrollWidth - de.clientWidth, wide: wide.slice(0, 4) };
      });
      assert(ov.scroll <= 1, `${vw}px 下 ${tab} 不横向滚动（溢出 ${ov.scroll}px，越界元素：${ov.wide.join(' | ')}）`);
    }
  }
  await page.setViewportSize(outer);
  await page.click('#fs-tab-forecast');

  // (f) 表头 / 标签不得被 text-transform 改写单位（通用守卫）
  const mangled = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('th,dt,label,figcaption').forEach((e) => {
      const t = (e.textContent || '');
      if (/\b(HZ|KHZ|DBFS|DB|MASE_|RMSE_)\b/.test(t)) bad.push(t.slice(0, 40));
      if (getComputedStyle(e).textTransform === 'uppercase') bad.push('uppercase: ' + t.slice(0, 40));
    });
    return bad;
  });
  assert(mangled.length === 0, `表头与标签没有被 uppercase 改写（可疑：${mangled.slice(0, 3).join(' | ')}）`);

  // (g) 返回链接
  const back = page.locator('a.fs-back');
  assert((await back.count()) === 1, '顶部有返回工具集链接');
  assert((await back.getAttribute('href')) === '../../', '返回链接指向 ../../');

  // ================= 12. 缩略图 =================
  before = await runs();
  await page.click('#fs-examples button[data-example="co2"]');
  await waitRun(before);
  await page.click('#fs-tab-forecast');
  await page.waitForSelector('#fs-chart .fs-band-95');
  await page.evaluate(() => window.scrollTo(0, 0));
  await screenshot('thumb.png');
}
