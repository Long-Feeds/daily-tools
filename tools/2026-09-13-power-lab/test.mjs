// 电力系统工作台 · Power Lab —— 浏览器集成测试。
//
// 断言里的每个数值期望都指得到一次具体的参照调用（注释写明是谁算的）：
//   · 交流潮流：pandapower 3.5.4，且 GridCal 与 PowSyBl OpenLoadFlow 在同一算例上
//     与它一致到 1e-15（本期离线套件 expected.json 记录的 agree 值）
//   · 直流潮流：numpy 按 MATPOWER makeBdc 的定义独立实现
//   · 短路：链式网络闭式解 + numpy 独立复现（52,316 + 45,907 条离线断言）
//   · 连续潮流：pandapower 收敛性二分出的 λmax
//   · 经济调度：scipy SLSQP
// 引擎级精度（1e-9 ~ 1e-13）由离线套件负责；这里验的是「页面上显示的数是不是那个数」，
// 所以容差按页面显示位数取「半个最小单位」。
export default async function ({ page, toolURL, screenshot, assert }) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('body[data-pw-ready="1"]');

  const txt = async (sel) => ((await page.locator(sel).textContent()) || '').trim();
  const num = async (sel) => Number((await txt(sel)).replace(/[^\d.eE+-]/g, ''));
  const near = (got, want, tol, what) =>
    assert(Math.abs(got - want) <= tol, `${what}：期望 ${want} ± ${tol}，实际 ${got}`);
  // 页面按 d 位小数显示 ⇒ 浏览器侧能验到的最细粒度是半个最小单位
  const nearD = (got, want, d, what) => near(got, want, Math.pow(10, -d) / 2 + 1e-12, `${what}（页面 ${d} 位小数）`);
  const show = async (tab) => {
    await page.click(`#pw-tab-${tab}`);
    await page.waitForFunction((t) => !document.getElementById('pw-panel-' + t).hidden, tab);
  };
  const cellNum = async (rowSel, idx) => {
    const t = await page.locator(`${rowSel} td`).nth(idx).textContent();
    return Number((t || '').replace(/[^\d.eE+-]/g, ''));
  };

  /* ══════════ 1. 网络页：解析、单线图、算例切换 ══════════ */
  assert((await txt('#pw-parse-status')).includes('14 条母线'), 'IEEE 14 默认算例应解析出 14 条母线');
  assert((await txt('#pw-parse-status')).includes('20 条在运支路'), 'IEEE 14 应有 20 条在运支路');
  assert((await txt('#pw-net-stats')).includes('变压器 3'), 'IEEE 14 有 3 台变压器');
  assert((await txt('#pw-net-stats')).includes('总负荷 MW 259.0'), 'IEEE 14 总负荷 259.0 MW（MATPOWER case14 的 PD 之和）');

  const sldCount = await page.locator('#pw-sld > *').count();
  assert(sldCount > 60, `单线图应该画出几十个图元，实际 ${sldCount}`);
  await page.click('#pw-format');
  await page.waitForTimeout(120);
  // 布局必须确定 —— 这份快照会在换到 IEEE 30 再换回来之后（布局缓存已失效、算法真的重跑一遍）
  // 与新的一份逐字节比对。只在同一份缓存上比两次是测不出算法带随机性的。
  const sldSnapshot = await page.locator('#pw-sld').innerHTML();
  assert(sldSnapshot.length > 2000, '单线图应有实质内容');
  // 规范化（打印器）之后网络不变
  assert((await txt('#pw-parse-status')).includes('14 条母线'), '规范化后网络仍应是 14 条母线');
  const dslAfter = await page.locator('#pw-dsl').inputValue();
  assert(/^BASE 100\n/.test(dslAfter), '规范化后第一行应是 BASE 100');
  assert(dslAfter.split('\n').filter((l) => l.startsWith('BUS ')).length === 14, '规范化后应有 14 行 BUS');

  /* ══════════ 2. 潮流：对 pandapower ══════════ */
  await show('pf');
  // pandapower 3.5.4（GridCal 偏差 3.4e-16、PowSyBl 1.3e-15）：
  //   vm = 1.06 / 1.045 / 1.01 / 1.01767085 / 1.01951386 / 1.07 …
  //   lossP = 13.3932723579 MW，lossQ = 30.12238805 Mvar
  //   支路 1→2：Pf=156.88289053、Qf=−20.40429168、Pt=−152.58529020、Qt=27.67624973
  assert((await txt('#pw-pf-status')).includes('牛顿-拉夫逊 收敛'), '默认应以牛顿法收敛');
  assert((await txt('#pw-pf-status')).includes('4 次迭代'), 'IEEE 14 平启动牛顿法 4 次迭代（tol 1e-8 MVA）');
  nearD(await cellNum('#pw-bus-table tbody tr[data-bus="4"]', 2), 1.017671, 4, '母线 4 电压');
  nearD(await cellNum('#pw-bus-table tbody tr[data-bus="5"]', 2), 1.019514, 4, '母线 5 电压');
  nearD(await cellNum('#pw-bus-table tbody tr[data-bus="14"]', 2), 1.035530, 4, '母线 14 电压');
  nearD(await cellNum('#pw-bus-table tbody tr[data-bus="4"]', 3), -10.3129, 3, '母线 4 相角');
  nearD(await cellNum('#pw-bus-table tbody tr[data-bus="14"]', 3), -16.0336, 3, '母线 14 相角');
  {
    const kpis = await page.locator('#pw-pf-kpis .pw-kpi').allTextContents();
    const loss = kpis.find((t) => t.includes('有功网损'));
    assert(loss && loss.includes('13.393'), `有功网损应显示 13.393 MW，实际「${loss}」`);
    const lossQ = kpis.find((t) => t.includes('无功网损'));
    assert(lossQ && lossQ.includes('30.12'), `无功网损应显示 30.12 Mvar，实际「${lossQ}」`);
    assert(kpis.some((t) => t.includes('电压越限') && t.includes('3')), 'IEEE 14 的 VMAX=1.06 下应有 3 条母线越上限');
    assert(kpis.some((t) => t.includes('支路过载') && /支路过载\s*0/.test(t.replace(/\s+/g, ' '))),
      '按 N-1 最大潮流定容后基态不应有过载支路');
  }
  {
    const row = '#pw-branch-table tbody tr[data-branch="1-2"]';
    nearD(await cellNum(row, 2), 156.88, 2, '支路 1→2 首端有功');
    nearD(await cellNum(row, 3), -20.40, 2, '支路 1→2 首端无功');
    nearD(await cellNum(row, 4), -152.59, 2, '支路 1→2 末端有功');
    nearD(await cellNum(row, 5), 27.68, 2, '支路 1→2 末端无功');
    // 损耗 = 首末端之和：156.88289053 − 152.58529020 = 4.29760033
    nearD(await cellNum(row, 6), 4.298, 3, '支路 1→2 有功损耗');
  }

  // 四种算法互相一致（切换后重算）
  const vmOf = async (b) => cellNum(`#pw-bus-table tbody tr[data-bus="${b}"]`, 2);
  await page.selectOption('#pw-algo', 'fdpf');
  await page.click('#pw-run');
  await page.waitForFunction(() => document.getElementById('pw-pf-status').textContent.includes('快速解耦'));
  nearD(await vmOf(14), 1.035530, 4, '快速解耦法下母线 14 电压应与牛顿法一致');
  assert((await txt('#pw-pf-status')).includes('快速解耦 XB 收敛'), '快速解耦应收敛');
  await page.selectOption('#pw-algo', 'gs');
  await page.click('#pw-run');
  await page.waitForFunction(() => document.getElementById('pw-pf-status').textContent.includes('高斯-赛德尔'));
  nearD(await vmOf(14), 1.035530, 4, '高斯-赛德尔法下母线 14 电压应与牛顿法一致');
  await page.selectOption('#pw-algo', 'dc');
  await page.click('#pw-run');
  await page.waitForFunction(() => document.getElementById('pw-pf-status').textContent.includes('直流潮流'));
  // numpy 独立实现的直流潮流：va = 0 / −5.012011 / −12.953663 / −10.583667 / −9.093894 …
  nearD(await cellNum('#pw-bus-table tbody tr[data-bus="2"]', 3), -5.012011, 3, '直流潮流母线 2 相角');
  nearD(await cellNum('#pw-bus-table tbody tr[data-bus="3"]', 3), -12.953663, 3, '直流潮流母线 3 相角');
  nearD(await vmOf(14), 1.0, 4, '直流潮流的电压恒为 1.0 pu');
  // 直流支路有功：numpy 独立实现给 147.838596 MW
  nearD(await cellNum('#pw-branch-table tbody tr[data-branch="1-2"]', 2), 147.8386, 2, '直流潮流支路 1→2 有功');
  await page.selectOption('#pw-algo', 'nr');
  await page.click('#pw-run');
  await page.waitForFunction(() => document.getElementById('pw-pf-status').textContent.includes('牛顿-拉夫逊'));

  // 收敛曲线：叠加了三种算法的折线，且牛顿法的点数最少
  {
    const polys = await page.locator('#pw-conv polyline').count();
    assert(polys >= 2, `收敛曲线应叠加多种算法，实际 ${polys} 条`);
    const legend = await txt('#pw-conv-legend');
    assert(legend.includes('牛顿-拉夫逊（4 次迭代）'), `图例应写明牛顿法迭代次数，实际「${legend}」`);
  }
  // 电压柱状图：越限的柱子必须真的是红色，且柱高与数值成比例
  {
    const bars = await page.locator('#pw-vprofile rect').count();
    assert(bars >= 28, `电压柱状图应有限值带 + 数据柱共 ≥28 个矩形，实际 ${bars}`);
    const geo = await page.evaluate(() => {
      const rs = [...document.querySelectorAll('#pw-vprofile rect')].filter((r) => r.getAttribute('fill') !== '#f2f2f2');
      return rs.map((r) => ({ x: +r.getAttribute('x'), h: +r.getAttribute('height'), fill: r.getAttribute('fill') }))
        .sort((a, b) => a.x - b.x);
    });
    assert(geo.length === 14, `应有 14 根电压柱，实际 ${geo.length}`);
    // 母线 6/7/8（下标 5/6/7）越上限 ⇒ 红色；其余不是红色
    [5, 6, 7].forEach((i) => assert(geo[i].fill === '#e60000', `第 ${i + 1} 根柱（母线 ${i + 1}）越限应为红色，实际 ${geo[i].fill}`));
    [0, 3, 8, 13].forEach((i) => assert(geo[i].fill !== '#e60000', `第 ${i + 1} 根柱未越限，不该是红色`));
    // 几何：母线 8（1.0900）比母线 3（1.0100）高，且高度差与电压差成比例
    assert(geo[7].h > geo[2].h, '母线 8 的电压高于母线 3，柱子必须更高');
    const ratio = (geo[7].h - geo[2].h) / (geo[0].h - geo[2].h);   // (1.09−1.01)/(1.06−1.01)=1.6
    near(ratio, 1.6, 0.02, '柱高差之比应等于电压差之比 (1.09−1.01)/(1.06−1.01)');
  }

  /* ══════════ 3. 短路 ══════════ */
  await show('sc');
  await page.selectOption('#pw-sc-bus', '3');
  // 四种故障 · 母线 3 · 平启动。期望值来自链式闭式解同款公式在 numpy 里的独立复现
  // （离线套件 45,907 条断言，最大偏差 9.3e-11）：
  //   三相 Ia=8.527260 / 单相接地 Ia=8.772207 / 两相 Ib=Ic=7.384824 / 两相接地 Ib=8.586166、Ic=8.725105
  const scRun = async (type) => {
    await page.selectOption('#pw-sc-type', type);
    await page.click('#pw-sc-run');
    await page.waitForFunction((t) => document.getElementById('pw-sc-status').textContent.includes(t),
      { '3ph': '三相短路', slg: '单相接地', ll: '两相短路', dlg: '两相接地' }[type]);
  };
  const kpiNum = async (label) => {
    const t = await page.locator('#pw-sc-kpis .pw-kpi', { hasText: label }).textContent();
    return Number((t || '').replace(label, '').replace(/[^\d.eE+-]/g, ''));
  };
  await scRun('3ph');
  nearD(await kpiNum('A 相电流'), 8.7223 * 0 + 8.527260, 4, '母线 3 三相短路 Ia');
  nearD(await kpiNum('B 相电流'), 8.527260, 4, '母线 3 三相短路 Ib');
  nearD(await kpiNum('C 相电流'), 8.527260, 4, '母线 3 三相短路 Ic');
  nearD(await kpiNum('短路容量'), 852.7, 1, '母线 3 三相短路容量 MVA');
  nearD(await kpiNum('正序戴维南阻抗'), 0.11727, 5, '母线 3 正序戴维南阻抗模');
  assert((await txt('#pw-sc-status')).includes('3.752 kA') === false, '三相短路不该出现单相接地的 kA 读数');
  assert(/3\.647 kA/.test(await txt('#pw-sc-status')), '三相短路应给出 3.647 kA（基准电流 0.4277 kA × 8.52726）');

  await scRun('slg');
  nearD(await kpiNum('A 相电流'), 8.772207, 4, '母线 3 单相接地 Ia');
  nearD(await kpiNum('B 相电流'), 0, 4, '单相接地时 Ib 必须为 0');
  nearD(await kpiNum('C 相电流'), 0, 4, '单相接地时 Ic 必须为 0');
  nearD(await kpiNum('零序戴维南阻抗'), 0.10748, 5, '母线 3 零序戴维南阻抗模');
  // Ia = 3·Ia1 ⇒ Ia1 = 2.924069
  nearD(await cellNum('#pw-sc-seq tbody tr[data-seq="正序电流 Ia1"]', 3), 2.92407, 5, '单相接地 |Ia1| = Ia/3');
  {
    const rows = await page.locator('#pw-sc-check tbody tr').count();
    assert(rows === 3, `单相接地应有 3 条边界条件，实际 ${rows}`);
    const fails = await page.locator('#pw-sc-check tbody td.pw-no').count();
    assert(fails === 0, `边界条件自检应全部通过，实际 ${fails} 条不通过`);
  }
  await scRun('ll');
  nearD(await kpiNum('A 相电流'), 0, 4, '两相短路时 Ia 必须为 0');
  nearD(await kpiNum('B 相电流'), 7.384824, 4, '母线 3 两相短路 Ib');
  nearD(await kpiNum('C 相电流'), 7.384824, 4, '母线 3 两相短路 Ic');
  await scRun('dlg');
  nearD(await kpiNum('A 相电流'), 0, 4, '两相接地时 Ia 必须为 0');
  nearD(await kpiNum('B 相电流'), 8.586166, 4, '母线 3 两相接地 Ib');
  nearD(await kpiNum('C 相电流'), 8.725105, 4, '母线 3 两相接地 Ic');

  // 过渡阻抗：Xf = 0.1 ⇒ Ia 从 8.527260 降到 4.608357（1/|Z1+j0.1|）
  await page.selectOption('#pw-sc-type', '3ph');
  await page.fill('#pw-sc-xf', '0.1');
  await page.click('#pw-sc-run');
  await page.waitForTimeout(120);
  nearD(await kpiNum('A 相电流'), 4.608357, 4, '带 Xf=0.1 的三相短路 Ia');
  await page.fill('#pw-sc-xf', '0');

  // 故障期间的相电压柱：故障母线的 Va 必须是 0（几何断言，不只看数字）
  await scRun('slg');
  {
    const bars = await page.evaluate(() => {
      const rs = [...document.querySelectorAll('#pw-scv rect')].filter((r) => r.getAttribute('opacity') !== '0.07');
      return rs.map((r) => ({ x: +r.getAttribute('x'), h: +r.getAttribute('height'), fill: r.getAttribute('fill') }));
    });
    assert(bars.length === 42, `14 条母线 × 3 相应有 42 根柱，实际 ${bars.length}`);
    bars.sort((a, b) => a.x - b.x);
    // 母线 3 是第 3 组，其 Va（组内第一根，深墨色）高度应为 0
    const g3 = bars.slice(6, 9);
    assert(g3[0].h < 0.5, `故障母线的 A 相电压柱高度应为 0，实际 ${g3[0].h}`);
    assert(g3[1].h > 100 && g3[2].h > 100, '故障母线的 B/C 相电压柱应仍然很高');
    const g1 = bars.slice(0, 3);
    assert(g1[0].h > 100, '未故障母线的 A 相电压柱不该是 0');
  }
  // 支路故障电流：串联支路上的电流必须完全相等（9→10、10→11、6→11 在 IEEE 14 里是一条串联链）
  {
    const a = await cellNum('#pw-sc-branch tbody tr[data-scbranch="9-10"]', 1);
    const b = await cellNum('#pw-sc-branch tbody tr[data-scbranch="10-11"]', 1);
    const c = await cellNum('#pw-sc-branch tbody tr[data-scbranch="6-11"]', 1);
    near(a, b, 1e-4, '串联支路 9→10 与 10→11 的故障电流必须相等');
    near(b, c, 1e-4, '串联支路 10→11 与 6→11 的故障电流必须相等');
    assert(a > 0.1, `串联链上的故障电流应大于 0.1 pu，实际 ${a}`);
  }
  // 相量图：三条相电压 + 故障电流
  {
    const lines = await page.locator('#pw-phasor line').count();
    assert(lines >= 5, `相量图应至少有 2 条坐标轴 + 3 条相电压，实际 ${lines}`);
    const dashed = await page.locator('#pw-phasor line[stroke-dasharray="7 4"]').count();
    assert(dashed === 1, `单相接地只有 A 相有电流，应只画 1 条电流相量，实际 ${dashed}`);
  }

  /* ══════════ 4. 电压稳定 ══════════ */
  await show('vs');
  await page.click('#pw-cpf-run');
  await page.waitForFunction(() => document.getElementById('pw-cpf-status').textContent.includes('负荷裕度'));
  // pandapower 收敛性二分给出的 λmax = 3.004502（离线套件里两者相对差 <5e-10）
  {
    const st = await txt('#pw-cpf-status');
    assert(st.includes('λmax = 3.0045'), `λmax 应为 3.0045，实际「${st.slice(0, 60)}」`);
    assert(st.includes('1037.2 MW'), '鼻点总负荷应是 259.0 × (1+3.0045) = 1037.2 MW');
    assert(st.includes('临界母线是 5'), '临界母线应是母线 5');
  }
  nearD(await cellNum('#pw-cpf-table tbody tr[data-cpfbus="5"]', 2), 0.6792, 4, '鼻点处母线 5 的电压');
  nearD(await cellNum('#pw-cpf-table tbody tr[data-cpfbus="1"]', 3), 0, 4, '平衡节点在整条曲线上电压不变，跌落应为 0');
  // dV/dQ 排序：最弱是母线 14（0.208641），且表是降序
  {
    const ids = await page.locator('#pw-vq-table tbody tr').evaluateAll((rs) => rs.map((r) => r.getAttribute('data-vq')));
    assert(ids[0] === '14', `dV/dQ 最大的应是母线 14，实际 ${ids[0]}`);
    const vals = await page.locator('#pw-vq-table tbody tr').evaluateAll((rs) =>
      rs.map((r) => Number(r.children[1].textContent)));
    for (let i = 1; i < vals.length; i++) assert(vals[i] <= vals[i - 1] + 1e-12, 'dV/dQ 表必须按降序排列');
    near(vals[0], 0.20864, 5e-5, '母线 14 的 dV/dQ');
    assert(vals.length === 9, `IEEE 14 有 9 条 PQ 母线，dV/dQ 表应有 9 行，实际 ${vals.length}`);
  }
  // 鼻子曲线：曲线要真的折返（同一 λ 上有两个电压）
  {
    const polys = await page.locator('#pw-nose polyline').count();
    assert(polys === 4, `鼻子曲线应画 4 条母线，实际 ${polys}`);
    const turned = await page.evaluate(() => {
      const p = document.querySelector('#pw-nose polyline');
      const pts = p.getAttribute('points').split(' ').map((s) => s.split(',').map(Number));
      let maxX = -1, after = 0;
      for (const [x] of pts) { if (x > maxX) maxX = x; }
      for (const [x] of pts) if (x < maxX - 4) after++;
      return { maxX, back: pts.slice(pts.findIndex(([x]) => x === maxX) + 1).length };
    });
    assert(turned.back >= 3, `曲线应在鼻点之后折返回低压支，实际折返后只有 ${turned.back} 个点`);
  }

  /* ══════════ 5. 调度与 N-1 ══════════ */
  await show('op');
  await page.click('#pw-ed-run');
  await page.waitForFunction(() => document.getElementById('pw-ed-status').textContent.includes('系统边际成本'));
  // scipy SLSQP 在同样的需求下给出同样的最优解（离线套件 775 条，最大相对差 4.9e-13）
  // 需求 = 负荷 259 + 网损 13.39332 = 272.39 MW ⇒ λ = 39.999526、总成本 8171.7351 元/h
  {
    const st = await txt('#pw-ed-status');
    assert(st.includes('λ = 39.9995'), `系统 λ 应为 39.9995，实际「${st.slice(0, 60)}」`);
    assert(st.includes('272.39 MW'), '总需求应是 272.39 MW');
  }
  nearD(await cellNum('#pw-ed-table tbody tr[data-unit="1#0"]', 1), 232.394, 3, '母线 1 机组出力');
  nearD(await cellNum('#pw-ed-table tbody tr[data-unit="2#1"]', 1), 39.999, 3, '母线 2 机组出力');
  // 等微增率：未触限机组的边际成本必须都等于 λ
  {
    const rows = await page.locator('#pw-ed-table tbody tr').evaluateAll((rs) => rs.map((r) => ({
      mc: Number(r.children[4].textContent), st: r.children[5].textContent.trim()
    })));
    const free = rows.filter((r) => r.st === '等微增率');
    assert(free.length >= 2, `应至少有 2 台未触限机组，实际 ${free.length}`);
    free.forEach((r) => near(r.mc, 39.9995, 1e-3, '未触限机组的边际成本应等于系统 λ'));
    const sum = await page.locator('#pw-ed-table tbody tr').evaluateAll((rs) =>
      rs.reduce((a, r) => a + Number(r.children[1].textContent), 0));
    near(sum, 272.3933, 0.01, '各机出力之和应等于总需求（负荷 + 网损）');
  }
  await page.click('#pw-n1-run');
  await page.waitForFunction(() => document.getElementById('pw-ed-status').textContent.includes('N-1 扫描完成'));
  {
    const st = await txt('#pw-ed-status');
    assert(st.includes('逐条开断 20 条支路'), 'IEEE 14 应扫描 20 条支路');
    assert(st.includes('0 种开断会造成过载'), '按 N-1 最大潮流定容后，IEEE 14 应满足 N-1 静态安全');
    assert(st.includes('1 条支路一断就解列'), 'IEEE 14 里只有 7→8 一断就解列（母线 8 是端点）');
    const iso = await txt('#pw-n1-table tbody tr[data-n1="7-8"]');
    assert(iso.includes('解列'), '7→8 这一行应标注解列');
  }
  // PTDF 热力图：平衡节点那一列必须全 0（注入即回收）
  {
    const cells = await page.locator('#pw-ptdf rect').count();
    assert(cells > 20 * 14, `PTDF 热力图应有 20×14 个格子 + 色标，实际 ${cells}`);
    const col1 = await page.evaluate(() => {
      const rs = [...document.querySelectorAll('#pw-ptdf rect')];
      const xs = rs.map((r) => +r.getAttribute('x'));
      const minX = Math.min(...xs);
      return rs.filter((r) => +r.getAttribute('x') === minX).map((r) => +r.getAttribute('opacity'));
    });
    col1.forEach((o) => assert(o < 0.05, `平衡节点所在列的 PTDF 应为 0（不透明度 ${o}）`));
  }

  /* ══════════ 6. 换算例：PJM 5 母线（带真额定值，会有过载与 N-1 违规）══════════ */
  await show('net');
  await page.selectOption('#pw-preset', 'pjm5');
  await page.click('#pw-load-preset');
  await page.waitForFunction(() => document.getElementById('pw-parse-status').textContent.includes('5 条母线'));
  await show('pf');
  // pandapower：pjm5 的 lossP = 5.0271800433 MW，母线 2 电压 0.98926124
  nearD(await cellNum('#pw-bus-table tbody tr[data-bus="2"]', 2), 0.989261, 4, 'PJM5 母线 2 电压');
  {
    const kpis = await page.locator('#pw-pf-kpis .pw-kpi').allTextContents();
    assert(kpis.some((t) => t.includes('有功网损') && t.includes('5.027')), 'PJM5 有功网损应为 5.027 MW');
    assert(kpis.some((t) => t.includes('支路过载') && /支路过载\s*1/.test(t.replace(/\s+/g, ' '))),
      'PJM5 用的是 MATPOWER 原始额定值，基态就有 1 条支路过载');
  }
  await show('op');
  await page.click('#pw-n1-run');
  await page.waitForFunction(() => document.getElementById('pw-ed-status').textContent.includes('N-1 扫描完成'));
  {
    const st = await txt('#pw-ed-status');
    assert(st.includes('3 种开断会造成过载'), `PJM5 应有 3 种开断造成过载，实际「${st}」`);
    // 最重的一条：LODF 推算与「真的断开重解直流潮流」在离线套件里逐条对过（670 条，2.5e-12）
    const worst = await page.locator('#pw-n1-table tbody tr').first().locator('td').nth(5).textContent();
    nearD(Number(worst.replace('%', '')), 194.38, 1, 'PJM5 最严重开断后的载荷率');
  }
  // 纯线性成本（PJM5 五台机 c2 全为 0）⇒ 退化成优先级排序，由 scipy SLSQP 校准：
  //   λ = 30.000000、总成本 14810.0000、出力 0 / 40 / 190 / 600 / 170
  await page.uncheck('#pw-ed-losses');
  await page.click('#pw-ed-run');
  await page.waitForFunction(() => document.getElementById('pw-ed-status').textContent.includes('系统边际成本'));
  {
    const st = await txt('#pw-ed-status');
    assert(st.includes('λ = 30.0000'), `PJM5 不计网损时 λ = 30，实际「${st.slice(0, 50)}」`);
    const ps = await page.locator('#pw-ed-table tbody tr').evaluateAll((rs) => rs.map((r) => Number(r.children[1].textContent)));
    const sorted = ps.slice().sort((a, b) => a - b);
    near(sorted[0], 0, 1e-3, '最贵的机组应压到 0');
    near(sorted[4], 600, 1e-3, '最便宜的机组应顶满 600 MW');
    near(ps.reduce((a, b) => a + b, 0), 1000, 1e-3, 'PJM5 总负荷 1000 MW，出力之和应等于它');
  }

  /* ══════════ 7. 辐射状配电网：末端电压跌落 ══════════ */
  await show('net');
  await page.selectOption('#pw-preset', 'dist33');
  await page.click('#pw-load-preset');
  await page.waitForFunction(() => document.getElementById('pw-parse-status').textContent.includes('33 条母线'));
  await show('pf');
  // pandapower：dist33 网损 0.2026771270 MW，母线 5 电压 0.96805923
  nearD(await cellNum('#pw-bus-table tbody tr[data-bus="5"]', 2), 0.968059, 4, 'dist33 母线 5 电压');
  {
    const vms = await page.locator('#pw-bus-table tbody tr').evaluateAll((rs) => rs.map((r) => Number(r.children[2].textContent)));
    near(Math.min(...vms), 0.913090, 5e-5, 'dist33 末端最低电压（辐射馈线的典型压降）');
    const kpis = await page.locator('#pw-pf-kpis .pw-kpi').allTextContents();
    assert(kpis.some((t) => t.includes('有功网损') && t.includes('0.203')), 'dist33 有功网损应为 0.203 MW');
  }
  await show('op');
  await page.click('#pw-n1-run');
  await page.waitForFunction(() => document.getElementById('pw-ed-status').textContent.includes('N-1 扫描完成'));
  assert((await txt('#pw-ed-status')).includes('32 条支路一断就解列'),
    '辐射状配电网的每一条支路都是唯一通路，全部 32 条都应判为解列');

  /* ══════════ 8. 错误处理与边界 ══════════ */
  await show('net');
  // 输入是防抖解析的：一律**正向等待目标文案出现**，不要「等一个固定毫秒数再读」
  //（旧状态会让「还没算完」伪装成「值不对」）。
  const setDsl = async (s, expect, what) => {
    await page.fill('#pw-dsl', s);
    try {
      await page.waitForFunction((e) => document.getElementById('pw-parse-status').textContent.includes(e), expect, { timeout: 6000 });
    } catch (e) {
      assert(false, `${what}：状态栏迟迟没出现「${expect}」，当前是「${(await txt('#pw-parse-status')).slice(0, 90)}」`);
    }
    assert((await txt('#pw-parse-status')).includes(expect), what);
  };
  await setDsl('BASE 100\nBUS 1 SLACK\nBUS 2 PQ\nGEN 1\nLINE 1 2 R=0 X=0\n', '阻抗为零', '零阻抗支路应报错并说清原因');
  assert((await page.locator('#pw-parse-status').getAttribute('class')).includes('pw-err'), '报错时状态栏应切成红色样式');
  await setDsl('BASE 100\nBUS 1 SLACK\nBUS 2 PQ PD=10\nGEN 1\n', '孤岛', '与平衡节点不连通应报孤岛');
  await setDsl('BASE 100\nBUS 1 SLACK\nBUS 2 PQ\nGEN 1\nLINE 1 2 X=0.1 FOO=1\n', '不认识的参数 FOO', '未知参数应被指出来');
  await setDsl('BASE 100\nBUS 1 SLACK\nBUS 2 PQ PD=99999\nGEN 1 QMIN=-1e9 QMAX=1e9\nLINE 1 2 R=0.05 X=0.2\n',
    '模型可用', '极端负荷的网络本身是合法的');
  await show('pf');
  await page.click('#pw-run');
  await page.waitForFunction(() => document.getElementById('pw-pf-status').textContent.includes('没有收敛'));
  assert((await txt('#pw-pf-status')).includes('没有收敛'), '极端过载应报不收敛而不是给出假结果');
  // 恢复默认算例
  await show('net');
  await page.selectOption('#pw-preset', 'ieee14');
  await page.click('#pw-load-preset');
  await page.waitForFunction(() => document.getElementById('pw-parse-status').textContent.includes('14 条母线'));

  /* ══════════ 9. 说明页：能力清单逐项现场跑通 ══════════ */
  await show('doc');
  await page.waitForFunction(() => document.querySelectorAll('#pw-caps tbody tr').length > 20);
  {
    const total = await page.locator('#pw-caps tbody tr').count();
    const okc = await page.locator('#pw-caps [data-capok="1"]').count();
    assert(total === 31, `能力清单应有 31 条，实际 ${total}`);
    assert(okc === total, `能力清单应条条跑通，实际 ${total - okc} 条失败`);
    const dead = await page.locator('#pw-caps tbody tr').evaluateAll((rs) =>
      rs.filter((r) => r.children[1].textContent.trim() === '未能算出').map((r) => r.getAttribute('data-cap')));
    assert(dead.length === 0, `以下能力列出来了却算不出：${dead.join('、')}`);
  }
  // 页面公布的验证规模必须钉死成离线套件实测出来的那个字面量（异源核对：改任何一行都会红）
  assert((await txt('#pw-verify-count')) === '121646', '首屏公布的对拍条数应是离线套件实测的 121646');
  assert((await txt('#pw-verify-count-2')) === '121646', '说明页公布的对拍条数应与首屏一致');

  /* ══════════ 10. 通用守卫 ══════════ */
  // (a) [hidden] 真的隐藏 —— 断**计算样式**而不是只断属性：本站每期裸写数百行 CSS，
  //     任何 .foo{display:…} 都与 UA 的 [hidden]{display:none} 同特异性且靠后即胜出。
  const TABS = ['net', 'pf', 'sc', 'vs', 'op', 'doc'];
  for (const cur of TABS) {
    await show(cur);
    const disp = await page.evaluate((ts) => ts.map((t) => getComputedStyle(document.getElementById('pw-panel-' + t)).display), TABS);
    TABS.forEach((t, i) => {
      if (t === cur) assert(disp[i] !== 'none', `选中「${cur}」时它自己应当可见，实际 display:${disp[i]}`);
      else assert(disp[i] === 'none', `选中「${cur}」时 pw-panel-${t} 的计算样式应为 display:none，实际 ${disp[i]}`);
    });
  }
  // (b) th / dt / label 不许被 text-transform 改写（会把 MW、Mvar、pu 写成错字）
  {
    const bad = await page.evaluate(() => {
      const out = [];
      for (const e of document.querySelectorAll('th,dt,label,.pw-fact,.pw-chip')) {
        const tt = getComputedStyle(e).textTransform;
        if (tt && tt !== 'none') out.push(e.tagName + ':' + e.textContent.slice(0, 12) + '→' + tt);
      }
      return out;
    });
    assert(bad.length === 0, `不该有元素带 text-transform：${bad.slice(0, 3).join('、')}`);
  }
  // (c) 控件最小尺寸 —— 逐个标签页扫（藏起来的面板量不到尺寸）
  {
    let scanned = 0;
    for (const t of ['net', 'pf', 'sc', 'vs', 'op', 'doc']) {
      await show(t);
      const bad = await page.evaluate(() => {
        const out = [];
        for (const e of document.querySelectorAll('input,select,button,textarea')) {
          const r = e.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;         // 不在当前面板
          // 标签页按钮是两个汉字的文字型控件，宽度本来就按字排（43×53 是正常的），
          // 但触摸目标不能小：宽高都要 ≥40。其余按钮按 CTA 口径 ≥52 宽。
          const isTab = e.classList.contains('pw-tab');
          const minW = e.type === 'checkbox' ? 18 : (isTab ? 40 : (e.tagName === 'BUTTON' ? 52 : 100));
          const minH = isTab ? 40 : 18;
          if (r.width < minW || r.height < minH) out.push(`${e.id || e.tagName} ${Math.round(r.width)}×${Math.round(r.height)}`);
        }
        return out;
      });
      assert(bad.length === 0, `${t} 页有控件塌缩：${bad.join('、')}`);
      scanned += await page.evaluate(() => [...document.querySelectorAll('input,select,button,textarea')]
        .filter((e) => e.getBoundingClientRect().width > 0).length);
    }
    assert(scanned >= 40, `逐页累计扫到的控件数应 ≥40，实际 ${scanned}`);
  }
  // (d) 窄屏不横向溢出（宽屏永远看不出网格子项 min-width:auto 的坑）
  for (const vw of [390, 768]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of ['net', 'pf', 'sc', 'vs', 'op', 'doc']) {
      await show(t);
      await page.waitForTimeout(60);
      const info = await page.evaluate(() => {
        const de = document.documentElement;
        const over = de.scrollWidth - de.clientWidth;
        if (over <= 1) return { over };
        const w = de.clientWidth, bad = [];
        for (const e of document.querySelectorAll('body *')) {
          const r = e.getBoundingClientRect();
          if (r.right > w + 1 && r.width > 0) bad.push(`${e.tagName}.${(e.className || '').toString().split(' ')[0]}@${Math.round(r.right)}`);
        }
        return { over, bad: bad.slice(0, 4) };
      });
      assert(info.over <= 1, `${vw}px 下「${t}」页横向溢出 ${info.over}px，元凶：${(info.bad || []).join('、')}`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 850 });
  // (e) 卡片里的代码块不许把卡片撑破
  await show('doc');
  {
    const bad = await page.evaluate(() => [...document.querySelectorAll('.pw-pre')]
      .filter((e) => e.scrollWidth - e.clientWidth > 2)
      .map((e) => `${e.scrollWidth}>${e.clientWidth}`));
    assert(bad.length === 0, `说明页的代码块横向被切：${bad.join('、')}`);
  }
  // (f) 图上的文字两两不相交（避让器真的在起作用）
  await show('pf');
  await page.click('#pw-run');
  await page.waitForFunction(() => document.getElementById('pw-pf-status').textContent.includes('收敛'));
  for (const id of ['pw-vprofile', 'pw-conv']) {
    const hits = await page.evaluate((x) => {
      const ts = [...document.querySelectorAll('#' + x + ' text')].map((t) => t.getBoundingClientRect());
      const out = [];
      for (let i = 0; i < ts.length; i++) {
        for (let j = i + 1; j < ts.length; j++) {
          const a = ts[i], b = ts[j];
          if (a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5) out.push(i + '/' + j);
        }
      }
      return { n: ts.length, out: out.slice(0, 3) };
    }, id);
    assert(hits.n >= 8, `${id} 上应有 ≥8 个文字标签，实际 ${hits.n}`);
    assert(hits.out.length === 0, `${id} 上有文字两两重叠：${hits.out.join('、')}`);
  }
  // 稠密网络才验得出避让器：IEEE 30 的 30 条母线挤在同一张 900×560 的画布上
  await show('net');
  await page.selectOption('#pw-preset', 'ieee30');
  await page.click('#pw-load-preset');
  await page.waitForFunction(() => document.getElementById('pw-parse-status').textContent.includes('30 条母线'));
  {
    const hits = await page.evaluate(() => {
      const ts = [...document.querySelectorAll('#pw-sld text')].map((t) => t.getBoundingClientRect());
      const out = [];
      for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) {
        const a = ts[i], b = ts[j];
        if (a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5) out.push(i + '/' + j);
      }
      return { n: ts.length, out: out.slice(0, 4) };
    });
    assert(hits.n >= 26, `IEEE 30 的单线图上应画出至少 26 条母线标签，实际 ${hits.n}`);
    assert(hits.out.length === 0, `IEEE 30 单线图标签重叠 ${hits.out.length} 处：${hits.out.join('、')}`);
  }
  await show('pf');
  await page.click('#pw-run');
  await page.waitForFunction(() => document.getElementById('pw-pf-status').textContent.includes('收敛'));
  {
    // 30 根柱子的横轴标签放不下，避让器应当抽稀（画出来的比 30 少），且不许两两相交
    const r = await page.evaluate(() => {
      const ts = [...document.querySelectorAll('#pw-vprofile text')];
      const nums = ts.filter((t) => /^\d+$/.test(t.textContent) && +t.getAttribute('y') > 300);
      const bx = ts.map((t) => t.getBoundingClientRect());
      let hit = 0;
      for (let i = 0; i < bx.length; i++) for (let j = i + 1; j < bx.length; j++) {
        const a = bx[i], b = bx[j];
        if (a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5) hit++;
      }
      return { labels: nums.length, hit };
    });
    assert(r.hit === 0, `IEEE 30 电压分布图上有 ${r.hit} 处文字重叠`);
    assert(r.labels >= 8, `横轴至少要画出 8 个母线号，实际 ${r.labels}`);
  }
  // 其余四张图也逐张验「文字两两不相交」（纵轴标题曾经压在最上面那条刻度上，
  // 5 张图全中招，是人工看图才发现的）
  for (const [tab, id, act] of [['sc', 'pw-scv', null], ['sc', 'pw-phasor', null],
  ['vs', 'pw-nose', '#pw-cpf-run'], ['op', 'pw-lambda', '#pw-ed-run'], ['op', 'pw-ptdf', '#pw-n1-run']]) {
    await show(tab);
    if (act) { await page.click(act); await page.waitForTimeout(900); }
    const hits = await page.evaluate((x) => {
      const ts = [...document.querySelectorAll('#' + x + ' text')].map((t) => t.getBoundingClientRect());
      const out = [];
      for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) {
        const a = ts[i], b = ts[j];
        if (a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5) out.push(i + '/' + j);
      }
      return { n: ts.length, out: out.slice(0, 3) };
    }, id);
    assert(hits.n >= (id === 'pw-phasor' ? 7 : 6), `${id} 上应有足够多的文字标签，实际 ${hits.n}`);
    assert(hits.out.length === 0, `${id} 上有文字两两重叠：${hits.out.join('、')}`);
  }

  await show('net');
  await page.selectOption('#pw-preset', 'ieee14');
  await page.click('#pw-load-preset');
  await page.waitForFunction(() => document.getElementById('pw-parse-status').textContent.includes('14 条母线'));
  assert((await page.locator('#pw-sld').innerHTML()) === sldSnapshot,
    '换到 IEEE 30 再换回来之后，IEEE 14 的单线图必须与先前逐字节相同（布局算法不能带随机性）');
  {
    const hits = await page.evaluate(() => {
      const ts = [...document.querySelectorAll('#pw-sld text')].map((t) => t.getBoundingClientRect());
      const out = [];
      for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) {
        const a = ts[i], b = ts[j];
        if (a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5) out.push(i + '/' + j);
      }
      return { n: ts.length, out: out.slice(0, 3) };
    });
    assert(hits.n === 14, `单线图上应画出全部 14 条母线的标签，实际 ${hits.n}`);
    assert(hits.out.length === 0, `单线图标签重叠：${hits.out.join('、')}`);
  }
  // (g) localStorage 持久化：刷新后仍在同一个算例、同一个标签页
  await show('sc');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('body[data-pw-ready="1"]');
  assert(!(await page.locator('#pw-panel-sc').isHidden()), '刷新后应停在「短路」页');
  assert((await txt('#pw-parse-status')).includes('14 条母线'), '刷新后网络应从 localStorage 恢复');

  assert(errors.length === 0, `页面不应有 JS 错误：${errors.slice(0, 3).join(' | ')}`);

  await show('pf');
  await page.waitForTimeout(200);
  await screenshot('thumb.png');
}
