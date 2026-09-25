/* 可靠性工程工作台 · 浏览器集成测试
 *
 * ORACLE 块由 oracle/make_page_oracle.mjs **机械注入**，块外不许出现手打的数字。
 * 真值三路：reliability / lifelines / scipy（oracle.json）、本脚本现算的穷举法
 * （框图 2^8、故障树 2^9 状态）、离线套件实跑出来的规模数字。
 */
import { renderGuards } from '/Users/lon/.agents/cron/daily-website/tools/render-guards.mjs';
import { makeDisplayCompare } from '/Users/lon/.agents/cron/daily-website/tools/display-tolerance.mjs';

const ORACLE = {
  "meta": {
    "tabs": [
      "life",
      "rbd",
      "fta",
      "avail",
      "growth",
      "alt",
      "plan",
      "about"
    ]
  },
  "life": {
    "alpha": 134651.03560404223,
    "beta": 1.1544266852141882,
    "seAlpha": 42767.18689829768,
    "seBeta": 0.2961405146196595,
    "loglik": -128.97383225876007,
    "aicc": 262.3762359460916,
    "bic": 264.8156389264904,
    "ciAlphaLo": 72252.9079912986,
    "ciAlphaHi": 250936.63207887145,
    "mttf": 128005.0141200747,
    "b10": 19170.04538785067,
    "b50": 98022.95778720661,
    "rt": 0.8380396288119385,
    "ht": 0.000006799184128980016,
    "warrQ": 0.10474245556046924,
    "returns": 1047.4245556046924,
    "cost": 890310.8722639885,
    "n": 31,
    "nf": 10,
    "nCens": 21,
    "bestName": "指数 1P",
    "bestAICc": 260.38022948069715,
    "secondName": "伽马 2P",
    "nDists": 8,
    "bearingAlpha": 10055.887866177545,
    "bearingBeta": 2.340053438137009,
    "bearingN": 80,
    "mileageN": 100,
    "expLambda": 0.0000067086358928802246,
    "expAICc": 260.38022948069715,
    "lognMu": 11.547713472517588,
    "lognSigma": 1.3847513369802704,
    "rrxAlpha": 134242.8171341353,
    "rrxBeta": 1.056698593436215
  },
  "rbd": {
    "R": 0.8305258229349655,
    "R20000": 0.43408722218771645,
    "structText": "series(主电机, parallel(水泵A, 水泵B), koon(2, 压力传感1, 压力传感2, 压力传感3), 调节阀, 控制器)",
    "mttf": 19214.630229944127,
    "horizon": 130161.11155156119,
    "imp": {
      "主电机": 0.9542436928224299,
      "压力传感1": 0.1062061333560903,
      "压力传感2": 0.1062061333560903,
      "压力传感3": 0.1062061333560903,
      "控制器": 0.8324669527932133,
      "水泵A": 0.12352154693825035,
      "水泵B": 0.12352154693825035,
      "调节阀": 0.8387661726145155
    },
    "topName": "主电机",
    "topBirnbaum": 0.9542436928224299,
    "nComp": 8,
    "compR": {
      "主电机": 0.8703498164902344,
      "压力传感1": 0.9323192313839364,
      "压力传感2": 0.9323192313839364,
      "压力传感3": 0.9323192313839364,
      "控制器": 0.9976682199194398,
      "水泵A": 0.8544249172720695,
      "水泵B": 0.8544249172720695,
      "调节阀": 0.9901756294559853
    }
  },
  "fta": {
    "top": 0.013829522915580355,
    "rare": 0.013888608116198036,
    "mcub": 0.013832871210892606,
    "nMCS": 7,
    "nOrder1": 2,
    "nBasic": 9,
    "topEventName": "E_压力开关",
    "maxCutP": 0.008,
    "topNoDC": 0.009868998911225222
  },
  "avail": {
    "A": 0.9999047679632831,
    "mut": 84333.33333333326,
    "mdt": 8.032,
    "mttff": 84999.99999999993,
    "downtimeMin": 50.0882420316249,
    "singleA": 0.9960159362549801,
    "spareMean": 1.08,
    "spareNeed": 3,
    "spareAchieved": 0.9757095636978081,
    "spareNoStockout": [
      0.33959552564493906,
      0.7063586933414734,
      0.904410803897602,
      0.9757095636978081,
      0.9949602288438639,
      0.9991183725154119,
      0.9998668383762905,
      0.9999823159662548,
      0.9999979054408998
    ],
    "transientAt60": 0.9999052479032853,
    "pi": [
      0.9880481896870376,
      0.011856578276245512,
      0.00009485262621091959,
      3.794105056908643e-7
    ],
    "nStates": 4,
    "singleUnitA": 0.9960159362549801
  },
  "growth": {
    "beta": 0.6142103999317297,
    "betaUnbiased": 0.5583730908470269,
    "lambda": 0.42394221488057504,
    "growthRate": 0.38578960006827034,
    "mtbfC": 28.181818181818183,
    "mtbfI": 45.88300391030604,
    "timeToTarget60": 1242.7055172806402,
    "projMTBF1500": 64.51774006020202,
    "duaneAlpha": 0.4253106567646677,
    "duaneC": 26.86511097232994,
    "duaneI": 46.74718835238401,
    "n": 22,
    "T": 620,
    "laplaceU": -2.7831596856069787,
    "cvm": 0.04928067144722571
  },
  "alt": {
    "a": 7082.104673184571,
    "b": 0.0000036569396782837643,
    "shape": 1.4728169797446071,
    "loglik": -339.96407916624287,
    "aicc": 686.1086094603053,
    "Ea": 0.6102885616519904,
    "useLife": 51166.158683533664,
    "useMean": 46296.27166210389,
    "useB10": 11102.210387799296,
    "afTop": 27.320016636369413,
    "nLevels": 3,
    "nRecs": 137
  },
  "plan": {
    "R0": 0.95,
    "nExact": 44.89056748035485,
    "nCeil": 45,
    "tNeeded": 15017.14956116833,
    "bound": 0.8912509381337456,
    "binom": 0.8190390365632615,
    "demoTime": 5834.580254801143,
    "hours": 175200,
    "n99": 230
  },
  "inputs": {
    "rbdT": 8760,
    "rbdT2": 20000,
    "lifeT2": 12345,
    "planR2": 0.99,
    "availN": 3,
    "availK": 2,
    "availN1": 1,
    "availKBad": 9
  },
  "verify": {
    "assertions": 8769,
    "pass": 8769,
    "pairs": 8625,
    "cases": {
      "life": 119,
      "interval": 25,
      "fta": 40,
      "rbd": 30,
      "avail": 40,
      "growth": 25,
      "alt": 18,
      "plan": 40
    }
  }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e.message)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

  await page.goto(toolURL, { waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 20000 });

  const TABS = ORACLE.meta.tabs;
  const onTab = async (t) => {
    await page.click(`#tab-${t}`);
    await page.waitForFunction((tt) => !document.getElementById('pane-' + tt).hidden, t, { timeout: 5000 });
  };
  // 读一个 KPI 的数值：去掉千分位以外的一切非数字字符再 parseFloat
  const num = async (sel) => page.$eval(sel, (n) => {
    const m = /-?[\d.]+(?:e[+-]?\d+)?/i.exec(n.textContent.replace(/,/g, ''));
    return m ? parseFloat(m[0]) : NaN;
  });
  const txt = async (sel) => page.$eval(sel, (n) => n.textContent.trim());
  // 按页面**显示精度**给容差的比较器 —— 已固化，别再每期手写（见该文件头部注释）
  const { closeS, closeV, parseNum } = makeDisplayCompare(page, assert);
  const close = (got, want, tol, what) => {
    const r = Math.abs(got - want) / Math.max(Math.abs(want), 1e-300);
    assert(r <= tol, `${what}：页面 ${got}，真值 ${want}（相对差 ${r.toExponential(2)} > ${tol}）`);
  };

  // ══════════════ 1. 寿命数据页：默认 automotive + 威布尔 2P + 极大似然 ══════════════
  await onTab('life');
  const L = ORACLE.life;
  const prow = await page.$$eval('#life-params tbody tr', (rs) =>
    rs.map((r) => [...r.children].map((c) => c.textContent.trim())));
  assert(prow.length === 2, `威布尔 2P 应有 2 个参数行，实得 ${prow.length}`);
  closeV(prow[0][1], L.alpha, 'α 估计值');
  closeV(prow[1][1], L.beta, 'β 估计值');
  closeV(prow[0][2], L.seAlpha, 'α 标准误');
  closeV(prow[1][2], L.seBeta, 'β 标准误');
  closeV(prow[0][3], L.ciAlphaLo, 'α 置信下限');
  closeV(prow[0][4], L.ciAlphaHi, 'α 置信上限');
  await closeS('#kpi-mttf', L.mttf, 'MTTF');
  await closeS('#kpi-b10', L.b10, 'B10 寿命');
  await closeS('#kpi-b50', L.b50, '中位寿命');
  await closeS('#kpi-rt', L.rt, 'R(t)', 100);
  await closeS('#kpi-ht', L.ht, 'h(t)');
  await closeS('#kpi-warr', L.warrQ, '保修期内返修率', 100);
  await closeS('#kpi-ret', L.returns, '预计返修台数');
  await closeS('#kpi-cost', L.cost, '预计保修成本');
  // 返修台数 = 返修率 × 投放台数、成本 = 台数 × 单价：页面三个读数必须互相自洽
  const wq = await num('#kpi-warr') / 100, wr = await num('#kpi-ret'), wc = await num('#kpi-cost');
  close(wr / wq, L.returns / L.warrQ, 1e-3, '返修台数 ÷ 返修率 = 投放台数');
  close(wc / wr, L.cost / L.returns, 1e-3, '成本 ÷ 台数 = 单价');

  // 分布选型排名：AICc 最小的那个排第一，且就是 reliability 的排序结果
  const rank = await page.$$eval('#life-rank tbody tr', (rs) =>
    rs.map((r) => [r.children[0].textContent.trim(), parseFloat(r.children[3].textContent)]));
  assert(rank.length >= 6, `选型排名至少应有 6 个分布，实得 ${rank.length}`);
  assert(rank[0][0] === L.bestName, `AICc 最小的应是「${L.bestName}」，页面给的是「${rank[0][0]}」`);
  closeV(String(rank[0][1]), L.bestAICc, '最优分布的 AICc');
  assert(rank[1][0] === L.secondName, `排名第二应是「${L.secondName}」，实得「${rank[1][0]}」`);
  for (let i = 1; i < rank.length; i++) {
    assert(rank[i][1] >= rank[i - 1][1] - 1e-9, `选型排名没有按 AICc 升序：第 ${i} 行 ${rank[i][1]} < ${rank[i - 1][1]}`);
  }

  // 切分布：指数 1P
  await page.selectOption('#life-dist', 'exponential1');
  await page.waitForFunction((w) => {
    const el = document.querySelector('#life-params tbody tr td:nth-child(2)');
    return el && Math.abs(parseFloat(el.textContent) - w) / w < 1e-3;
  }, ORACLE.life.expLambda, { timeout: 8000 });
  closeV(await page.$eval('#life-params tbody tr td:nth-child(2)', (n) => n.textContent), L.expLambda, '指数分布 λ');
  // 切估计方法：秩回归 RRX（回到威布尔）
  await page.selectOption('#life-dist', 'weibull2');
  await page.selectOption('#life-method', 'RRX');
  await page.waitForFunction((w) => {
    const el = document.querySelector('#life-params tbody tr td:nth-child(2)');
    return el && Math.abs(parseFloat(el.textContent) - w) / w < 1e-3;
  }, ORACLE.life.rrxAlpha, { timeout: 8000 });
  const rrx = await page.$$eval('#life-params tbody tr', (rs) => rs.map((r) => r.children[1].textContent.trim()));
  closeV(rrx[0], L.rrxAlpha, '秩回归 RRX 的 α');
  closeV(rrx[1], L.rrxBeta, '秩回归 RRX 的 β');
  await page.selectOption('#life-method', 'MLE');

  // 切数据集：轴承定检（区间删失，一条精确失效都没有）
  await page.selectOption('#life-preset', 'bearing');
  await page.waitForFunction((w) => {
    const el = document.querySelector('#life-params tbody tr td:nth-child(2)');
    return el && Math.abs(parseFloat(el.textContent) - w) / w < 1e-3;
  }, ORACLE.life.bearingAlpha, { timeout: 8000 });
  const bp = await page.$$eval('#life-params tbody tr', (rs) => rs.map((r) => r.children[1].textContent.trim()));
  closeV(bp[0], L.bearingAlpha, '区间删失数据的 α（对拍 lifelines）');
  closeV(bp[1], L.bearingBeta, '区间删失数据的 β（对拍 lifelines）');
  const kpiTexts = await page.$$eval('#life-kpis .rl-kpi', (ns) => ns.map((n) => n.textContent));
  assert(kpiTexts.some((t) => t.includes(String(ORACLE.life.bearingN))),
    `区间删失数据的样本量应显示 ${ORACLE.life.bearingN}，实得 ${kpiTexts[0]}`);
  // 非法数据必须报错而不是静默算错
  await page.fill('#life-data', 'abc\n100 Z\n5~3 I');
  await page.waitForFunction(() => document.querySelectorAll('#life-errors .rl-err').length > 0, null, { timeout: 8000 });
  const errText = await txt('#life-errors .rl-err');
  assert(/第 1 行/.test(errText) && /第 2 行/.test(errText) && /第 3 行/.test(errText),
    `三行非法数据应逐行报错，实得：${errText}`);
  await page.selectOption('#life-preset', 'automotive');
  await page.waitForFunction((w) => {
    const el = document.getElementById('kpi-mttf');
    return el && Math.abs(parseFloat(el.textContent) - w) / w < 1e-3;
  }, ORACLE.life.mttf, { timeout: 8000 });


  // ══════════════ 2. 系统框图页 ══════════════
  await onTab('rbd');
  const B = ORACLE.rbd;
  await closeS('#kpi-rbdR', B.R, '系统可靠度（对拍 2^8 穷举）', 100);
  await closeS('#kpi-rbdMTTF', B.mttf, '系统 MTTF（对拍复化辛普森 + 穷举）');
  const impRows = await page.$$eval('#rbd-imp tbody tr', (rs) =>
    rs.map((r) => [r.children[0].textContent.trim(), r.children[2].textContent.trim()]));
  assert(impRows.length === B.nComp, `重要度表应有 ${B.nComp} 行，实得 ${impRows.length}`);
  assert(impRows[0][0] === B.topName, `伯恩鲍姆最大的应是「${B.topName}」，页面给的是「${impRows[0][0]}」`);
  closeV(impRows[0][1], B.topBirnbaum, '最大伯恩鲍姆重要度');
  for (const [nm, v] of impRows) closeV(v, B.imp[nm], `元件 ${nm} 的伯恩鲍姆重要度`);
  // 结构图：每个元件一个方框
  const boxes = await page.$$eval('#fig-rbd rect', (ns) => ns.length);
  assert(boxes === B.nComp, `结构图应画出 ${B.nComp} 个元件方框，实得 ${boxes}`);
  // 改任务时间 → 可靠度按穷举真值变
  await page.fill('#rbd-t', String(ORACLE.inputs.rbdT2));
  await page.waitForFunction((w) => {
    const el = document.getElementById('kpi-rbdR');
    return el && Math.abs(parseFloat(el.textContent) / 100 - w) / w < 1e-3;
  }, ORACLE.rbd.R20000, { timeout: 8000 });
  await closeS('#kpi-rbdR', B.R20000, `t=${ORACLE.inputs.rbdT2} 时的系统可靠度`, 100);
  await page.fill('#rbd-t', String(ORACLE.inputs.rbdT));
  // 非法结构式要报错
  await page.fill('#rbd-struct', 'series(主电机, 不存在的元件)');
  await page.waitForFunction(() => document.querySelectorAll('#rbd-errors .rl-err').length > 0, null, { timeout: 8000 });
  assert(/没有对应元件/.test(await txt('#rbd-errors .rl-err')), '结构式引用不存在的元件时应报错');
  await page.fill('#rbd-struct', 'koon(9, 水泵A, 水泵B)');
  await page.waitForFunction(() => /koon/.test(document.querySelector('#rbd-errors .rl-err')?.textContent || ''), null, { timeout: 8000 });
  await page.fill('#rbd-struct', ORACLE.rbd.structText);
  await page.waitForFunction((w) => {
    const el = document.getElementById('kpi-rbdR');
    return el && Math.abs(parseFloat(el.textContent) / 100 - w) / w < 1e-3;
  }, ORACLE.rbd.R, { timeout: 8000 });

  // ══════════════ 3. 故障树页 ══════════════
  await onTab('fta');
  const T = ORACLE.fta;
  const ftaOriginal = await page.inputValue('#fta-text');
  await closeS('#kpi-top', T.top, '顶事件概率（对拍 2^9 穷举）');
  await closeS('#kpi-rare', T.rare, '稀有事件近似');
  await closeS('#kpi-mcub', T.mcub, '最小割集上界');
  assert(await num('#kpi-nmcs') === T.nMCS, `最小割集数应为 ${T.nMCS}`);
  assert(await num('#kpi-order1') === T.nOrder1, `一阶割集数应为 ${T.nOrder1}`);
  // 三者的大小关系：精确 ≤ MCUB ≤ 稀有事件近似
  const [pe, pm, pr] = [await num('#kpi-top'), await num('#kpi-mcub'), await num('#kpi-rare')];
  assert(pe <= pm + 1e-12 && pm <= pr + 1e-12, `界的大小关系不对：精确 ${pe} / MCUB ${pm} / 稀有 ${pr}`);
  const cutRows = await page.$$eval('#fta-mcs tbody tr', (rs) =>
    rs.map((r) => [parseInt(r.children[1].textContent, 10), r.children[3].textContent.trim()]));
  assert(cutRows.length === T.nMCS, `割集表应有 ${T.nMCS} 行，实得 ${cutRows.length}`);
  closeV(cutRows[0][1], T.maxCutP, '概率最大的那个割集');
  for (let i = 1; i < cutRows.length; i++) {
    assert(parseNum(cutRows[i][1]) <= parseNum(cutRows[i - 1][1]) + 1e-15, `割集表没有按概率降序：第 ${i} 行`);
  }
  // 把共因事件的概率改成 0：顶事件概率必须落到穷举出来的那个值
  await page.fill('#fta-text', (await page.inputValue('#fta-text')).replace(/E_直流电源\s*=\s*[\d.eE+-]+/, 'E_直流电源  = 0'));
  await page.waitForFunction((w) => {
    const el = document.getElementById('kpi-top');
    return el && Math.abs(parseFloat(el.textContent) - w) / Math.max(w, 1e-12) < 1e-3;
  }, ORACLE.fta.topNoDC, { timeout: 8000 });
  await closeS('#kpi-top', T.topNoDC, '去掉共因事件后的顶事件概率');
  await page.click('#tab-fta');
  await page.fill('#fta-text', 'TOP = xor(A, B)\nA = 0.1\nB = 0.2');
  await page.waitForFunction(() => document.querySelectorAll('#fta-errors .rl-err').length > 0, null, { timeout: 8000 });
  assert(/未知门类型/.test(await txt('#fta-errors .rl-err')), '未知门类型应报错');
  /* 复原成原始故障树。**不能靠 reload**：输入是存在 localStorage 里的，
   * 刷新只会把刚才那棵坏树再读回来，页面上连 #kpi-top 都不存在（实撞：等它超时）。 */
  await page.fill('#fta-text', ftaOriginal);
  await page.waitForFunction((w) => {
    const el = document.getElementById('kpi-top');
    return el && Math.abs(parseFloat(el.textContent) - w) / w < 1e-3;
  }, ORACLE.fta.top, { timeout: 8000 });
  const gateShapes = await page.$$eval('#fig-fta path', (ns) => ns.length);
  assert(gateShapes >= T.nBasic, `故障树图至少要画出 ${T.nBasic} 条连线/门形，实得 ${gateShapes}`);

  // ══════════════ 4. 可用度页 ══════════════
  await onTab('avail');
  const V = ORACLE.avail;
  await closeS('#kpi-A', V.A, '稳态可用度（对拍 scipy 线性解）', 100);
  await closeS('#kpi-U', 1 - V.A, '不可用度');
  await closeS('#kpi-dt', V.downtimeMin, '年停机分钟数');
  await closeS('#kpi-mut', V.mut, '平均正常时间（对拍 scipy）');
  await closeS('#kpi-mdt', V.mdt, '平均停机时间（对拍 scipy）');
  await closeS('#kpi-mttff', V.mttff, '首次故障前时间（对拍 scipy）');
  await closeS('#kpi-single', V.singleA, '单机可用度', 100);
  const states = await page.$$eval('#av-states tbody tr', (rs) => rs.map((r) => r.children[2].textContent.trim()));
  assert(states.length === V.nStates, `状态表应有 ${V.nStates} 行，实得 ${states.length}`);
  for (let i = 0; i < states.length; i++) closeV(states[i], V.pi[i], `状态 ${i} 的稳态概率`);
  await closeS('#kpi-spmean', V.spareMean, '备件期望需求');
  assert(await num('#kpi-spneed') === V.spareNeed, `达标备件数应为 ${V.spareNeed}`);
  await closeS('#kpi-spach', V.spareAchieved, '不缺件概率', 100);
  /* 备件表逐行对拍泊松累积分布。**页面列出来的每一行都是承诺**，只断三个 KPI 的话，
   * 表里那一列算错了也测不出来（本 run 的改坏验证实撞：把累积概率乘 2 之后全绿）。 */
  const spRows = await page.$$eval('#av-sparetab tbody tr', (rs) =>
    rs.map((r) => [...r.children].map((c) => c.textContent.trim())));
  assert(spRows.length === V.spareNoStockout.length,
    `备件表应有 ${V.spareNoStockout.length} 行，实得 ${spRows.length}`);
  spRows.forEach((r, i) => {
    assert(parseInt(r[0], 10) === i, `备件表第 ${i} 行的备件数应为 ${i}`);
    closeV(r[1], V.spareNoStockout[i], `备件数 ${i} 的不缺件概率（对拍 scipy 泊松）`, 100);
    // 期望缺件数与不缺件概率之间的递推：B(s) = B(s-1) − (1 − F(s-1))
    if (i > 0) {
      const b0 = parseNum(spRows[i - 1][2]), b1 = parseNum(r[2]);
      const drop = 1 - V.spareNoStockout[i - 1];
      assert(Math.abs((b0 - b1) - drop) < 5e-4,
        `备件数 ${i} 的期望缺件数递推不成立：${b0} − ${b1} = ${b0 - b1}，应为 ${drop}`);
    }
  });
  // n=k=1 时必须退化成 MTBF/(MTBF+MTTR)
  await page.fill('#av-n', String(ORACLE.inputs.availN1));
  await page.fill('#av-k', String(ORACLE.inputs.availN1));
  await page.waitForFunction((w) => {
    const el = document.getElementById('kpi-A');
    return el && Math.abs(parseFloat(el.textContent) / 100 - w) < 1e-6;   // 页面只显示 5 位小数
  }, ORACLE.avail.singleUnitA, { timeout: 8000 });
  await closeS('#kpi-A', V.singleUnitA, '单机退化解', 100);
  await page.fill('#av-n', String(ORACLE.inputs.availN));
  await page.fill('#av-k', String(ORACLE.inputs.availK));
  await page.waitForFunction((w) => {
    const el = document.getElementById('kpi-A');
    return el && Math.abs(parseFloat(el.textContent) / 100 - w) / w < 1e-6;
  }, ORACLE.avail.A, { timeout: 8000 });
  // 非法输入要拦住
  await page.fill('#av-k', String(ORACLE.inputs.availKBad));
  await page.waitForFunction(() => document.querySelectorAll('#av-errors .rl-err').length > 0, null, { timeout: 8000 });
  await page.fill('#av-k', String(ORACLE.inputs.availK));
  await page.waitForFunction(() => document.querySelectorAll('#av-errors .rl-err').length === 0, null, { timeout: 8000 });

  // ══════════════ 5. 可靠性增长页 ══════════════
  await onTab('growth');
  const G = ORACLE.growth;
  await closeS('#kpi-beta', G.beta, 'Crow-AMSAA 的 β（对拍 reliability）');
  await closeS('#kpi-betau', G.betaUnbiased, 'β 的无偏修正');
  await closeS('#kpi-lam', G.lambda, 'λ');
  await closeS('#kpi-gr', G.growthRate, '增长率', 100);
  await closeS('#kpi-mtbfc', G.mtbfC, '累积 MTBF');
  await closeS('#kpi-mtbfi', G.mtbfI, '瞬时 MTBF');
  await closeS('#kpi-tt', G.timeToTarget60, '达到目标 MTBF 所需累计时间');
  await closeS('#kpi-proj', G.projMTBF1500, '外推瞬时 MTBF');
  // 拉普拉斯趋势统计量：页面把它当「增长趋势是否显著」的判据在用，必须对拍
  await closeS('#kpi-laplace', G.laplaceU, '拉普拉斯趋势统计量 U');
  // Cramér-von Mises 统计量写在结论句里，按文本取出来比
  const grNote = await txt('#gr-note');
  const cvmM = /Cramér-von Mises 统计量\s*([\d.eE+-]+)/.exec(grNote);
  assert(cvmM, `结论句里应给出 Cramér-von Mises 统计量，实得：${grNote.slice(0, 80)}`);
  closeV(cvmM[1], G.cvm, 'Cramér-von Mises 统计量');
  const cmp = await page.$$eval('#gr-cmp tbody tr', (rs) =>
    rs.map((r) => [...r.children].map((c) => c.textContent.trim())));
  assert(cmp.length === 2, `模型对比表应有 2 行（Crow-AMSAA 与杜安），实得 ${cmp.length}`);
  closeV(cmp[1][2], G.duaneC, '杜安累积 MTBF');
  closeV(cmp[1][3], G.duaneI, '杜安瞬时 MTBF');

  // ══════════════ 6. 加速寿命页 ══════════════
  await onTab('alt');
  const A2 = ORACLE.alt;
  close(await num('#kpi-altshape'), A2.shape, 1e-3, '共用形状参数（对拍 reliability）');
  close(await num('#kpi-ea'), A2.Ea, 1e-3, '活化能');
  close(await num('#kpi-uselife'), A2.useLife, 5e-3, '使用应力下的特征寿命');
  close(await num('#kpi-usemean'), A2.useMean, 5e-3, '使用应力下的 MTTF');
  close(await num('#kpi-useb10'), A2.useB10, 5e-3, '使用应力下的 B10');
  // ALT 的参数在窄应力设计上有一条平脊，这里用 1e-3 的相对容差（而不是显示精度），
  // 因为这几个读数的真值本身就只跟 reliability 一致到 5e-3。
  const lv = await page.$$eval('#alt-levels tbody tr', (rs) =>
    rs.map((r) => [...r.children].map((c) => c.textContent.trim())));
  assert(lv.length === A2.nLevels, `应力水平表应有 ${A2.nLevels} 行，实得 ${lv.length}`);
  const totalN = lv.reduce((a, r) => a + parseInt(r[1], 10), 0);
  assert(totalN === A2.nRecs, `三个应力水平的样本数之和应为 ${A2.nRecs}，实得 ${totalN}`);
  // 加速因子 = 该应力寿命与使用应力寿命之比：表里最后一行应当与读数一致
  const afLast = parseFloat(lv[lv.length - 1][5]);
  const lifeLast = parseFloat(lv[lv.length - 1][4]);
  close(A2.useLife / lifeLast, afLast, 2e-3, '加速因子 = 使用应力寿命 ÷ 该应力寿命');
  // 切数据集：载荷加速（幂律模型）
  await page.selectOption('#alt-preset', 'load');
  await page.waitForFunction(() => document.getElementById('alt-model').value === 'power', null, { timeout: 8000 });
  const lv2 = await page.$$eval('#alt-levels tbody tr', (rs) => rs.length);
  assert(lv2 === 3, `载荷数据也应有 3 个应力水平，实得 ${lv2}`);
  await page.selectOption('#alt-preset', 'temperature');
  await page.waitForFunction((w) => {
    const el = document.getElementById('kpi-uselife');
    return el && Math.abs(parseFloat(el.textContent) - w) / w < 1e-2;
  }, ORACLE.alt.useLife, { timeout: 8000 });

  // ══════════════ 7. 验证试验页 ══════════════
  await onTab('plan');
  const P2 = ORACLE.plan;
  assert(await num('#kpi-zn') === P2.nCeil, `零失效样本量应为 ${P2.nCeil}`);
  await closeS('#kpi-znx', P2.nExact, '样本量精确值');
  await closeS('#kpi-zt', P2.tNeeded, '每台所需试验时间');
  await closeS('#kpi-zb', P2.bound, '置信下限', 100);
  await closeS('#kpi-bin', P2.binom, '二项置信下限（对拍 scipy）', 100);
  await closeS('#kpi-demo', P2.demoTime, 'MTBF 验证机时（对拍 scipy 卡方）');
  await closeS('#kpi-hours', P2.hours, '总试验机时');
  const trade = await page.$$eval('#pl-trade tbody tr', (rs) =>
    rs.map((r) => [parseFloat(r.children[0].textContent), parseInt(r.children[2].textContent, 10)]));
  for (let i = 1; i < trade.length; i++) {
    assert(trade[i][1] <= trade[i - 1][1], `试验时间越长、所需样本应越少：t/T=${trade[i][0]} 时反而是 ${trade[i][1]}`);
  }
  // 提高目标可靠度 → 样本量必须变大，且等于同一条闭式算出来的数
  await page.fill('#pl-R', String(ORACLE.inputs.planR2));
  await page.waitForFunction((w) => {
    const el = document.getElementById('kpi-zn');
    return el && parseInt(el.textContent, 10) === w;
  }, ORACLE.plan.n99, { timeout: 8000 });
  assert(await num('#kpi-zn') === P2.n99, `R₀=0.99 时样本量应为 ${P2.n99}`);
  await page.fill('#pl-R', String(ORACLE.plan.R0));
  await page.waitForFunction((w) => {
    const el = document.getElementById('kpi-zn');
    return el && parseInt(el.textContent, 10) === w;
  }, ORACLE.plan.nCeil, { timeout: 8000 });

  // ══════════════ 8. 说明页：公布的规模数字必须等于离线套件实跑出来的那些 ══════════════
  await onTab('about');
  const aboutText = await txt('#pane-about');
  assert(aboutText.includes(String(ORACLE.verify.assertions)),
    `说明页应写明离线套件的断言总数 ${ORACLE.verify.assertions}`);
  assert(aboutText.includes(String(ORACLE.verify.cases.fta)),
    `说明页应写明随机故障树算例数 ${ORACLE.verify.cases.fta}`);
  assert(aboutText.includes(String(ORACLE.verify.cases.life)),
    `说明页应写明随机寿命数据算例数 ${ORACLE.verify.cases.life}`);
  const srcItems = await page.$$eval('#about-src li', (ns) => ns.length);
  assert(srcItems >= 6, `数据来源应逐条列出（至少 6 条），实得 ${srcItems}`);

  /* 8.5 全文档 id 唯一。七个页签都在同一份文档里，两个页签取了同名 id 时
   * getElementById 只返回靠前的那一个，页面看着没事、测试却在读另一个页签的读数
   * （本 run 实撞：增长页的「拉普拉斯 U」和可用度页的「不可用度」都叫 kpi-U）。 */
  const dupIds = await page.evaluate(() => {
    const seen = {}, dup = [];
    document.querySelectorAll('[id]').forEach((n) => {
      if (seen[n.id]) dup.push(n.id); else seen[n.id] = 1;
    });
    return dup;
  });
  assert(dupIds.length === 0, `文档里有重复 id：${dupIds.join(', ')}`);

  // ══════════════ 9. 渲染守卫（六条一律 import，不手抄）══════════════
  await renderGuards(page, {
    assert,
    tabs: TABS,
    onTab,
    paneSel: (t) => `#pane-${t}`,
    panesRoot: '#rl-panes',
    figSel: (t) => `#pane-${t} svg.rl-fig`,
    // 表格住在 .rl-tw 横向滚动容器里，按约定断「容器不越出卡片」而不是断表格本身
    cardSel: '.rl-card',
    childSel: 'svg.rl-fig:not(.rl-fig-wide), dl, h2, p, .rl-tw',
    minControls: 40,
    minTextsInFig: 12,   // 实测最少的一张图有 13 段文字；低于 12 说明避让器把标签丢掉了
  });

  // 10. 分享链接：状态能编码进 URL 再解回来
  await onTab('life');
  await page.fill('#life-t', String(ORACLE.inputs.lifeT2));
  await page.waitForFunction(() => {
    const el = document.getElementById('kpi-rt');
    return el && el.textContent.length > 1;
  }, null, { timeout: 8000 });
  const rtBefore = await txt('#kpi-rt');
  const share = await page.evaluate(() => window.RLUI.shareURL());
  assert(/#s=[A-Za-z0-9_-]+$/.test(share), `分享链接格式不对：${share}`);
  await page.goto(share, { waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 20000 });
  const tAfter = await page.inputValue('#life-t');
  assert(tAfter === String(ORACLE.inputs.lifeT2), `分享链接应还原关注时刻，实得 ${tAfter}`);
  assert(await txt('#kpi-rt') === rtBefore, `分享链接还原后的 R(t) 应一致：${await txt('#kpi-rt')} vs ${rtBefore}`);

  // 11. 键盘可用：左右方向键切页签
  await page.goto(toolURL, { waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 20000 });
  await page.focus('#tab-life');
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => document.getElementById('tab-rbd').getAttribute('aria-selected') === 'true',
    null, { timeout: 5000 });
  await page.keyboard.press('ArrowLeft');
  await page.waitForFunction(() => document.getElementById('tab-life').getAttribute('aria-selected') === 'true',
    null, { timeout: 5000 });

  assert(errors.length === 0, `页面有 ${errors.length} 条错误：${errors.slice(0, 3).join(' | ')}`);

  // 缩略图要拍默认状态：前面测分享链接时把关注时刻改成过，得先把本地存储清掉
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* 隐私模式 */ } });
  await page.goto(toolURL, { waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 20000 });
  await onTab('life');
  await page.waitForFunction((w) => {
    const el = document.getElementById('kpi-mttf');
    return el && Math.abs(parseFloat(el.textContent) - w) / w < 1e-3;
  }, ORACLE.life.mttf, { timeout: 8000 });
  await screenshot('thumb.png');
};
