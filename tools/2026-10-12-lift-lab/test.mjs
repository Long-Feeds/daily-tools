/* 力量训练工作台 · 集成测试
 *
 * 数值真值全部来自 run 目录 oracle/ui_truth.py（独立 Python 实现：1RM 公式 + 二分反解、配片暴力枚举、
 * OPL 系数的 DOTS/Wilks/GL、5/3/1 取整、示例数据独立重写后统计），由 inject-oracle.mjs 机械注入 ORACLE 块。
 * 另有一条跨源核对：IPF 公布的 Inzarkin 成绩 GL = 112.85（OPL 源码测试里的公布值，与任何实现无关）。
 * 页面读数按显示精度比较（display-tolerance.mjs）；渲染守卫 import（render-guards.mjs）。
 */
import { renderGuards } from '/Users/lon/.agents/cron/daily-website/tools/render-guards.mjs';
import { makeDisplayCompare } from '/Users/lon/.agents/cron/daily-website/tools/display-tolerance.mjs';

const ORACLE = {
 "rm": {
  "mean": 115.49009491384298,
  "epley": 116.66666666666667,
  "min": 112.5,
  "max": 119.01068045151959,
  "rpe8": 121.61529574884227,
  "r3": 105.65489233265208,
  "r3load": 105,
  "r10rpe8": 83.90409908743217,
  "brzycki_12x60": 86.4
 },
 "plates": {
  "p1425": {
   "total": 142.5,
   "perSide": 61.25,
   "count": 4,
   "plates": [
    [
     25,
     2
    ],
    [
     10,
     1
    ],
    [
     1.25,
     1
    ]
   ],
   "down": 142.5,
   "up": 142.5
  },
  "p143": {
   "total": 142.5,
   "perSide": 61.25,
   "count": 4,
   "plates": [
    [
     25,
     2
    ],
    [
     10,
     1
    ],
    [
     1.25,
     1
    ]
   ],
   "down": 142.5,
   "up": 143.5
  },
  "p143up": {
   "total": 143.5,
   "perSide": 61.75,
   "count": 5,
   "plates": [
    [
     25,
     2
    ],
    [
     10,
     1
    ],
    [
     1.25,
     1
    ],
    [
     0.5,
     1
    ]
   ],
   "down": 142.5,
   "up": 143.5
  },
  "p143down": {
   "total": 142.5,
   "perSide": 61.25,
   "count": 4,
   "plates": [
    [
     25,
     2
    ],
    [
     10,
     1
    ],
    [
     1.25,
     1
    ]
   ],
   "down": 142.5,
   "up": 143.5
  },
  "max": 517,
  "lb315": {
   "total": 315,
   "perSide": 135,
   "count": 3,
   "plates": [
    [
     45,
     3
    ]
   ],
   "down": 315,
   "up": 315
  },
  "no25_200": {
   "total": 200,
   "perSide": 90,
   "count": 5,
   "plates": [
    [
     20,
     4
    ],
    [
     10,
     1
    ]
   ],
   "down": 200,
   "up": 200
  },
  "ramp": [
   20,
   55,
   85,
   105,
   120,
   142.5
  ]
 },
 "plan": {
  "sq_c1": {
   "tm": 125,
   "weeks": [
    [
     82.5,
     95,
     107.5
    ],
    [
     87.5,
     100,
     112.5
    ],
    [
     95,
     107.5,
     120
    ],
    [
     50,
     62.5,
     75
    ]
   ]
  },
  "sq_c2": {
   "tm": 130,
   "weeks": [
    [
     85,
     97.5,
     112.5
    ],
    [
     92.5,
     105,
     117.5
    ],
    [
     97.5,
     112.5,
     125
    ],
    [
     52.5,
     65,
     77.5
    ]
   ]
  },
  "bp_c2": {
   "tm": 92.5,
   "weeks": [
    [
     60,
     70,
     77.5
    ],
    [
     65,
     75,
     82.5
    ],
    [
     70,
     77.5,
     87.5
    ],
    [
     37.5,
     47.5,
     55
    ]
   ]
  },
  "dl_bbb": {
   "tm": 152.5,
   "weeks": [
    [
     100,
     115,
     130,
     77.5
    ],
    [
     107.5,
     122.5,
     137.5,
     77.5
    ],
    [
     115,
     130,
     145,
     77.5
    ],
    [
     60,
     77.5,
     92.5
    ]
   ]
  },
  "ohp_lb_c1": {
   "tm": 120,
   "weeks": [
    [
     80,
     90,
     100
    ],
    [
     85,
     95,
     105
    ],
    [
     90,
     100,
     115
    ],
    [
     50,
     60,
     70
    ]
   ]
  },
  "amrap": 148,
  "amrap_tm": 132.5
 },
 "log": {
  "e1_a": 115.49009491384298,
  "e1_b": 127.03910440522726,
  "ton_a": 1500,
  "ton_b": 330
 },
 "demo": {
  "n": 50,
  "prs": 24,
  "ton_t": 88.8925,
  "best": {
   "深蹲": 147.2498710151498,
   "卧推": 105.20971996695765,
   "硬拉": 213.6566755906095,
   "推举": 57.74504745692149
  }
 },
 "score": {
  "def": {
   "dots": 391.5506778795915,
   "gl": 80.28741790757788,
   "wilks": 387.1496674299481
  },
  "f60b": {
   "dots": 135.7968390214381,
   "gl": 105.23705227031095
  },
  "eq93": 615.402676765412,
  "m220": 287.4599838371885,
  "f30": {
   "dots": 861.1820094873275,
   "gl": 0
  }
 },
 "unit": {
  "rm_lb": 220.5
 },
 "meta": {
  "tabs": [
   "rm",
   "plates",
   "plan",
   "log",
   "score",
   "about"
  ]
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const { closeS, closeV } = makeDisplayCompare(page, assert);
  await page.goto(toolURL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => window.__llReady === true);

  const onTab = async (t) => {
    await page.click(`#tab-${t}`);
    await page.waitForFunction((t) => !document.getElementById('pane-' + t).hidden, t);
  };
  const txt = (sel) => page.$eval(sel, (n) => n.textContent.trim());
  const waitText = (sel, re) => page.waitForFunction(([s, r]) => {
    const n = document.querySelector(s); return n && new RegExp(r).test(n.textContent);
  }, [sel, re], { timeout: 10000 });
  const cssDisplay = (sel) => page.$eval(sel, (n) => getComputedStyle(n).display);

  // ── 返回链接 ──
  assert(await page.$eval('#ll-back', (a) => a.getAttribute('href')) === '../../', '返回链接指向 ../../');

  // ── 1RM ──
  const R = ORACLE.rm;
  await closeS('#rm-out', R.mean, '100×5 七式平均 1RM');
  await closeS('#rm-ftable tr[data-f="epley"] td:nth-child(3)', R.epley, 'Epley 行');
  await closeS('#rm-min', R.min, '公式最低');
  await closeS('#rm-max', R.max, '公式最高');
  await closeS('#rm-rtable tr[data-reps="3"] td:nth-child(3)', R.r3, '3 次反推重量');
  await closeS('#rm-rtable tr[data-reps="3"] td:nth-child(4)', R.r3load, '3 次可装重量（向下取到库存能装）');
  await closeS('#rm-rtable tr[data-reps="10"] td:nth-child(5)', R.r10rpe8, '10 次 @RPE8');
  await closeS('#rm-rtable tr[data-reps="5"] td:nth-child(3)', 100, '主公式反推回代：5 次 = 原重量');
  await page.selectOption('#rm-rpe', '8');
  await page.waitForFunction(() => /7 次/.test(document.getElementById('rm-eff').textContent));
  await closeS('#rm-out', R.rpe8, '100×5 @8 ⇒ 力竭 7 次');
  await page.selectOption('#rm-rpe', '');
  await page.selectOption('#rm-f', 'brzycki');
  await page.fill('#rm-w', '60'); await page.fill('#rm-r', '12');
  await page.waitForFunction(() => document.getElementById('rm-out').textContent === '86.4');
  await closeS('#rm-out', R.brzycki_12x60, 'Brzycki 60×12');
  assert(await page.$eval('#rm-ftable tr.ll-hl', (n) => n.getAttribute('data-f')) === 'brzycki', '主公式行高亮');
  assert(/超过 10 次/.test(await txt('#rm-note')), '>10 次给出误差提示');
  // 非法输入
  await page.fill('#rm-r', '0');
  await page.waitForFunction(() => !document.getElementById('rm-err').hidden);
  assert(await cssDisplay('#rm-err') !== 'none', '非法次数显示错误条');
  assert(await txt('#rm-out') === '—', '非法输入时不出数');
  assert(await page.$eval('#rm-r', (n) => n.getAttribute('aria-invalid')) === 'true', 'aria-invalid');
  await page.fill('#rm-r', '5'); await page.fill('#rm-w', '100'); await page.selectOption('#rm-f', 'mean');
  await page.waitForFunction(() => document.getElementById('rm-err').hidden);
  assert(await cssDisplay('#rm-err') === 'none', '修正后错误条隐藏（计算样式）');

  // ── 1RM → 配片 联动 ──
  await page.click('#rm-to-plates');
  await page.waitForFunction(() => !document.getElementById('pane-plates').hidden);
  assert(await page.inputValue('#pl-target') === '115.5', '1RM 一键带到配片页');

  // ── 配片 ──
  const PL = ORACLE.plates;
  const chips = () => page.$$eval('#pl-list .ll-pchip', (ns) => ns.map((n) => [+n.dataset.w, +n.dataset.n]));
  const setTarget = async (v) => { await page.fill('#pl-target', String(v)); };
  await setTarget(142.5);
  await waitText('#pl-sub', '正好');
  await closeS('#pl-total', PL.p1425.total, '142.5 正好');
  assert(JSON.stringify(await chips()) === JSON.stringify(PL.p1425.plates), `142.5 每侧片：${JSON.stringify(await chips())}`);
  const nPlates = await page.$$eval('#pl-svg rect.ll-plate', (ns) => ns.length);
  assert(nPlates === PL.p1425.count, `杠铃图画了 ${nPlates} 片（应 ${PL.p1425.count}）`);
  // 几何：片子从里到外由大到小、全部在画布内、不互相重叠
  const geo = await page.$$eval('#pl-svg rect.ll-plate', (ns) => ns.map((n) => { const b = n.getBoundingClientRect(); return [b.left, b.right, b.height]; }));
  const svgBox = await page.$eval('#pl-svg', (n) => { const b = n.getBoundingClientRect(); return [b.left, b.right]; });
  assert(geo.every((g, i) => i === 0 || (g[0] >= geo[i - 1][1] - 0.5 && g[2] <= geo[i - 1][2] + 0.5)), `片子顺序/重叠：${JSON.stringify(geo)}`);
  assert(geo.every((g) => g[0] >= svgBox[0] && g[1] <= svgBox[1]), '片子都在画布内');
  const ramp = await page.$$eval('#pl-ramp tbody tr td:nth-child(4)', (ns) => ns.map((n) => +n.textContent));
  assert(JSON.stringify(ramp) === JSON.stringify(PL.ramp), `热身阶梯 ${JSON.stringify(ramp)} vs ${JSON.stringify(PL.ramp)}`);
  await setTarget(143);
  await waitText('#pl-sub', '轻');
  await closeS('#pl-total', PL.p143.total, '143 就近（平手取轻）');
  assert((await txt('#pl-alt')).includes(String(PL.p143.up)), '给出向上最近方案');
  await page.click('#pane-plates [data-mode="up"]');
  await waitText('#pl-sub', '重');
  await closeS('#pl-total', PL.p143up.total, '143 宁重勿轻');
  assert(JSON.stringify(await chips()) === JSON.stringify(PL.p143up.plates), '143 向上片组');
  await page.click('#pane-plates [data-mode="nearest"]');
  // 库存约束：25 kg 改成 0 对
  await setTarget(200);
  await page.fill('#inv-25', '0');
  await page.waitForFunction(() => !document.querySelector('#pl-list [data-w="25"]'));
  assert(JSON.stringify(await chips()) === JSON.stringify(PL.no25_200.plates), `无 25 kg 时 200 的装法 ${JSON.stringify(await chips())}`);
  await page.click('#pl-inv-reset');
  await page.waitForFunction(() => document.getElementById('inv-25').value === '4');
  // 越界
  await setTarget(600);
  await waitText('#pl-err', '库存不够');
  assert((await txt('#pl-err')).includes(String(PL.max)), `库存上限 ${PL.max}`);
  await setTarget(15);
  await waitText('#pl-err', '还轻');
  assert(await cssDisplay('#pl-err') !== 'none', '低于空杆报错');
  await setTarget(142.5);
  await page.waitForFunction(() => document.getElementById('pl-err').hidden);

  // ── 5/3/1 ──
  const PP = ORACLE.plan;
  await onTab('plan');
  const card = (lift) => page.$$eval(`#pp-out .ll-pcard[data-lift="${lift}"] .ll-set b`, (ns) => ns.map((n) => parseFloat(n.textContent)));
  const flat = (w) => w.flat();
  assert(JSON.stringify(await card('深蹲')) === JSON.stringify(flat(PP.sq_c1.weeks)), `深蹲第 1 周期 ${JSON.stringify(await card('深蹲'))}`);
  await closeS('#pp-out .ll-pcard[data-lift="深蹲"] .ll-tm', PP.sq_c1.tm, '深蹲 TM');
  await page.click('#pp-cyc-tabs [data-cyc="1"]');
  await page.waitForFunction(() => document.querySelector('#pp-cyc-tabs [data-cyc="1"]').getAttribute('aria-pressed') === 'true');
  assert(JSON.stringify(await card('深蹲')) === JSON.stringify(flat(PP.sq_c2.weeks)), '深蹲第 2 周期（+5）');
  assert(JSON.stringify(await card('卧推')) === JSON.stringify(flat(PP.bp_c2.weeks)), '卧推第 2 周期（+2.5）');
  await page.click('#pp-cyc-tabs [data-cyc="0"]');
  await page.check('#pp-bbb');
  await page.waitForFunction(() => document.querySelectorAll('#pp-out .ll-bbb').length === 12);
  assert(JSON.stringify(await card('硬拉')) === JSON.stringify(flat(PP.dl_bbb.weeks)), '硬拉 + BBB');
  await page.uncheck('#pp-bbb');
  await closeS('#pp-ae', PP.amrap, 'AMRAP 120×7 Epley');
  await closeS('#pp-atm', PP.amrap_tm, 'AMRAP 回填 TM');
  const amrapUnderlined = await page.$$eval('#pp-out .ll-pcard[data-lift="深蹲"] .ll-amrap b', (ns) => ns.map((n) => getComputedStyle(n).textDecorationLine));
  assert(amrapUnderlined.length === 3 && amrapUnderlined.every((d) => d.includes('underline')), 'AMRAP 组带下划线');

  // ── 训练日志 ──
  const LG = ORACLE.log, DM = ORACLE.demo;
  await onTab('log');
  assert(await txt('#lg-count') === String(DM.n), `示例数据 ${DM.n} 条`);
  assert(await txt('#ll-hs-pr') === String(DM.prs), `PR 次数 ${await txt('#ll-hs-pr')} vs ${DM.prs}（独立重算）`);
  await closeS('#ll-hs-ton', DM.ton_t, '总吨位');
  await closeS('#lg-rm tr[data-lift="深蹲"] td:nth-child(8)', DM.best['深蹲'], '深蹲最佳估算 1RM');
  await closeS('#lg-rm tr[data-lift="硬拉"] td:nth-child(8)', DM.best['硬拉'], '硬拉最佳估算 1RM');
  // 图：3 条线 + PR 点数 = 表里的 PR 徽章所在系列
  assert(await page.$$eval('#lg-fig path[data-lift]', (ns) => ns.length) === 3, '默认画 3 条线');
  await page.click('#lg-lift-chips [data-lift="推举"]');
  await page.waitForFunction(() => document.querySelectorAll('#lg-fig path[data-lift]').length === 4);
  const yTicks = await page.$$eval('#lg-fig text', (ns) => ns.filter((n) => n.getAttribute('text-anchor') === 'end').length);
  assert(yTicks >= 4, `趋势图 y 轴刻度 ${yTicks} ≥ 4`);
  const bars = await page.$$eval('#lg-vol rect.ll-vbar', (ns) => ns.map((n) => n.getBoundingClientRect().height));
  assert(bars.length === 10 && bars.every((h) => h > 5), `周吨位 10 根柱且有高度：${bars.map(Math.round)}`);
  assert(await page.$$eval('#lg-list .ll-sess', (ns) => ns.length) === 12, '列表默认 12 条');
  await page.click('#lg-more');
  await page.waitForFunction(() => document.querySelectorAll('#lg-list .ll-sess').length === 32);
  // 清空 → 手记
  await page.click('#lg-clear');
  await page.waitForFunction(() => document.getElementById('lg-count').textContent === '0');
  assert(await cssDisplay('#lg-more') === 'none', '空列表时「再显示」按钮隐藏（计算样式）');
  await page.fill('#lg-date', '2026-10-05');
  await page.selectOption('#lg-lift', '深蹲');
  await page.fill('#lg-sets', '100x0');
  await page.click('#lg-add');
  await waitText('#lg-err', '次数');
  assert(await page.$$eval('#lg-list .ll-sess', (ns) => ns.length) === 0, '非法输入不入库');
  await page.fill('#lg-sets', '100x5x3');
  await waitText('#lg-preview', '3 组');
  assert((await txt('#lg-preview')).includes('1,500'), '预览吨位 1,500');
  await page.click('#lg-add');
  await waitText('#lg-ok', '已记下');
  assert(!(await txt('#lg-ok')).includes('PR'), '第一次记录不算 PR');
  await page.fill('#lg-date', '2026-10-12');
  await page.fill('#lg-sets', '110x3 @8');
  await page.click('#lg-add');
  await waitText('#lg-ok', 'PR');
  closeV((await txt('#lg-ok')).split('1RM ')[1], LG.e1_b, '新 PR 估算 1RM');
  assert(await txt('#ll-hs-pr') === '1', '概览 PR = 1');
  await closeS('#lg-rm tr[data-lift="深蹲"] td:nth-child(8)', LG.e1_b, 'RM 表最佳估算');
  assert(await txt('#lg-rm tr[data-lift="深蹲"] td:nth-child(5)') === '100', '5RM = 100');
  assert(await txt('#lg-rm tr[data-lift="深蹲"] td:nth-child(4)') === '110', '3RM = 110');
  assert(await page.$$eval('#lg-list .ll-pr', (ns) => ns.length) === 1, '列表里一个 PR 徽章');
  assert(await page.$$eval('#lg-fig circle.ll-dot-pr', (ns) => ns.length) === 1, '图上一个 PR 点');
  // 编辑：回填快记法
  await page.click('#lg-list .ll-sess:last-child button[data-act="edit"]');
  assert(await page.inputValue('#lg-sets') === '100x5x3', `编辑回填：${await page.inputValue('#lg-sets')}`);
  await page.fill('#lg-sets', '100x5x4');
  await page.click('#lg-add');
  await waitText('#lg-ok', '已更新');
  assert(await txt('#lg-count') === '2', '编辑不新增');
  assert((await txt('#lg-list .ll-sess:last-child .ll-sess-d')).includes('2,000'), '编辑后吨位 2,000');
  // 导入：一条合法一条非法
  await page.evaluate(() => window.__llImport(JSON.stringify({ sessions: [
    { date: '2026-10-01', lift: '前蹲', sets: [{ w: 80, r: 5 }] },
    { date: 'bad', lift: '深蹲', sets: [{ w: 80, r: 5 }] }] })));
  await waitText('#lg-ok', '跳过 1');
  assert(await txt('#lg-count') === '3', '导入 1 条');
  await page.evaluate(() => window.__llImport('{oops'));
  await waitText('#lg-err', '不是合法的 JSON');
  // 删除
  await page.click('#lg-list .ll-sess:first-child button[data-act="del"]');
  await page.waitForFunction(() => document.getElementById('lg-count').textContent === '2');
  // 持久化
  await page.reload(); await page.waitForFunction(() => window.__llReady === true);
  await onTab('log');
  assert(await txt('#lg-count') === '2', '刷新后记录仍在（localStorage）');

  // ── 分数 ──
  const SC = ORACLE.score;
  await onTab('score');
  await closeS('#sc-dots', SC.def.dots, 'DOTS 默认');
  await closeS('#sc-gl', SC.def.gl, 'IPF GL 默认');
  await closeS('#sc-wilks', SC.def.wilks, 'Wilks 默认');
  await closeS('#sc-eqt tr[data-bw="93"] td:nth-child(2)', SC.eq93, '93 kg 同分总成绩');
  assert(await page.$$eval('#sc-fig circle.ll-you', (ns) => ns.length) === 1, 'DOTS 图上标出你的位置');
  const youLab = await page.$$eval('#sc-fig text', (ns) => ns.filter((n) => n.textContent.startsWith('你')).length);
  assert(youLab === 1, '「你」标注画出来了');
  // 体重越界：DOTS 男子夹在 210 kg；IPF GL 体重 < 35 kg 记 0
  await page.fill('#sc-bw', '220');
  await page.waitForFunction(() => document.getElementById('sc-eqt').textContent.length > 0 && !document.querySelector('#sc-eqt tr.ll-hl'));
  await closeS('#sc-dots', SC.m220, 'DOTS 220 kg（按 210 夹取）');
  await page.click('#pane-score [data-sex="F"]');
  await page.fill('#sc-bw', '30');
  await page.waitForFunction(() => document.getElementById('sc-gl').textContent === '0.00');
  await closeS('#sc-dots', SC.f30.dots, 'DOTS 女 30 kg（按 40 夹取）');
  await page.click('#pane-score [data-sex="M"]');
  // 跨源：IPF 公布值（OPL 源码测试）
  await page.selectOption('#sc-eq', 'single');
  await page.fill('#sc-bw', '92.04');
  await page.fill('#sc-s', '400'); await page.fill('#sc-b', '285'); await page.fill('#sc-d', '350');
  await page.waitForFunction(() => document.getElementById('sc-gl').textContent === '112.85');
  assert(await txt('#sc-gl') === '112.85', 'Inzarkin 2019 公布 GL 112.85');
  await page.click('#pane-score [data-sex="F"]');
  await page.selectOption('#sc-eq', 'raw'); await page.selectOption('#sc-ev', 'B');
  await page.fill('#sc-bw', '60'); await page.fill('#sc-b', '122.5');
  await page.waitForFunction(() => /122\.5/.test(document.getElementById('sc-total').textContent));
  await closeS('#sc-gl', SC.f60b.gl, '女 60 kg 卧推 GL');
  await closeS('#sc-dots', SC.f60b.dots, '女 60 kg 卧推 DOTS');
  assert(await cssDisplay('#sc-lifts .ll-field:first-child') === 'none', '单卧推时隐藏深蹲输入（计算样式）');
  await page.fill('#sc-bw', '-3');
  await waitText('#sc-err', '体重');
  await page.fill('#sc-bw', '83'); await page.click('#pane-score [data-sex="M"]');
  await page.selectOption('#sc-ev', 'SBD');
  await page.fill('#sc-s', '200'); await page.fill('#sc-b', '140'); await page.fill('#sc-d', '240');

  // ── 单位切换 ──
  await page.click('#ll-unit-lb');
  await onTab('rm');
  assert(await page.inputValue('#rm-w') === String(ORACLE.unit.rm_lb), `kg→lb 输入换算 ${await page.inputValue('#rm-w')}`);
  assert((await txt('#rm-out-u')).startsWith('lb'), '单位标签变 lb');
  await onTab('plates');
  await setTarget(315);
  await waitText('#pl-sub', '正好');
  assert(JSON.stringify(await chips()) === JSON.stringify(ORACLE.plates.lb315.plates), 'lb 模式 315 = 每侧 3 片 45');
  await onTab('plan');
  await page.fill('#pp-ohp', '132.5');
  await page.waitForFunction(() => /lb/.test(document.querySelector('#pp-out .ll-pcard[data-lift="推举"] .ll-tm').textContent));
  assert(JSON.stringify(await card('推举')) === JSON.stringify(flat(ORACLE.plan.ohp_lb_c1.weeks)), 'lb 推举按 5 lb 取整');
  await page.click('#ll-unit-kg');

  // ── 键盘：方向键切页签 ──
  await page.focus('#tab-plan');
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => !document.getElementById('pane-log').hidden && document.activeElement.id === 'tab-log');

  // ── 文案自检：数字与单位之间的空格、无半角逗号冒号混排在中文句里 ──
  const lede = await page.$$eval('.ll-lede', (ns) => ns.map((n) => n.textContent).join(''));
  assert(!/[一-龥][,:;][一-龥]/.test(lede), '中文说明里没有夹半角标点');

  // ── 渲染守卫 ──
  await renderGuards(page, {
    assert, tabs: ORACLE.meta.tabs, onTab,
    paneSel: (t) => `#pane-${t}`, panesRoot: '#ll-panes',
    figSel: (t) => `#pane-${t} svg.ll-fig`, cardSel: '.ll-card',
    minControls: 45, minTextsInFig: 3,
  });

  // ── 缩略图 ──
  // 先跳到目标页签再清存档：hashchange 会触发一次渲染并 save()，清早了会被写回
  await page.goto(toolURL + '#plates');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => window.__llReady === true && document.getElementById('pl-total').textContent === '142.5');
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(() => document.getElementById('ll-toast').hidden);
  await screenshot('thumb.png');
};
