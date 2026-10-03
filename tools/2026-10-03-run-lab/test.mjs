/* 跑步工作台 · 集成测试
 *
 * 数值真值全部来自 oracle/truth.json（run 目录 oracle/scenarios.py 调 oracle.py：Python 独立实现，
 * brentq 解等效成绩 / numpy.roots 解训练配速 / quad 积分分段 / isocalendar 归周 / pstdev 算单调度），
 * 由 inject-oracle.mjs 机械注入下面的 ORACLE 块 —— 本文件不手打任何计算结果。
 * 渲染守卫一律 import（render-guards.mjs）。
 */
import { renderGuards } from '/Users/lon/.agents/cron/daily-website/tools/render-guards.mjs';

const ORACLE = {
 "meta": {
  "tabs": [
   "pace",
   "vdot",
   "split",
   "hr",
   "log",
   "about"
  ],
  "source": "oracle/scenarios.py（Python 独立实现）"
 },
 "pace1": {
  "pace": "5:00",
  "pmi": "8:03",
  "kmh": 12,
  "mph": 7.456454306848007,
  "mps": 3.3333333333333335,
  "lap": "2:00.0",
  "hm_time": "1:45:29",
  "m_time": "3:30:59"
 },
 "pace2": {
  "time": "1:34:56"
 },
 "pace3": {
  "dist": 15
 },
 "pace_mi": {
  "pace": "8:03",
  "dist": 6.2137
 },
 "gap": {
  "v": "6:51",
  "mul": 1.3686261264,
  "down": "2:59"
 },
 "vd": {
  "V": 43.38150323525253,
  "pct": 94.59695304787355,
  "eq": {
   "3k": "13:04",
   "10k": "46:40",
   "hm": "1:43:27",
   "m": "3:34:43"
  },
  "riegel_m": "3:35:48",
  "riegel_m_k110": "3:55:01",
  "T": "4:46",
  "I": "4:23",
  "R": "4:08",
  "M": "5:05",
  "E": "5:29–6:34",
  "I_lap": "1:45",
  "T_mi": "7:41"
 },
 "sp": {
  "n": 22,
  "rows": [
   [
    "5:04",
    "5:04",
    "5:04"
   ],
   [
    "5:03",
    "5:03",
    "10:08"
   ],
   [
    "5:03",
    "5:03",
    "15:10"
   ],
   [
    "5:02",
    "5:02",
    "20:13"
   ],
   [
    "5:02",
    "5:02",
    "25:15"
   ],
   [
    "5:01",
    "5:01",
    "30:16"
   ],
   [
    "5:01",
    "5:01",
    "35:17"
   ],
   [
    "5:00",
    "5:00",
    "40:17"
   ],
   [
    "5:00",
    "5:00",
    "45:17"
   ],
   [
    "4:59",
    "4:59",
    "50:16"
   ],
   [
    "4:59",
    "4:59",
    "55:15"
   ],
   [
    "4:58",
    "4:58",
    "1:00:13"
   ],
   [
    "4:58",
    "4:58",
    "1:05:10"
   ],
   [
    "4:57",
    "4:57",
    "1:10:07"
   ],
   [
    "4:56",
    "4:56",
    "1:15:04"
   ],
   [
    "4:56",
    "4:56",
    "1:20:00"
   ],
   [
    "4:55",
    "4:55",
    "1:24:55"
   ],
   [
    "4:55",
    "4:55",
    "1:29:50"
   ],
   [
    "4:54",
    "4:54",
    "1:34:44"
   ],
   [
    "4:54",
    "4:54",
    "1:39:38"
   ],
   [
    "4:53",
    "4:53",
    "1:44:31"
   ],
   [
    "0:29",
    "4:53",
    "1:45:00"
   ]
  ],
  "h1": "53:00",
  "h2": "52:00",
  "avg": "4:59"
 },
 "spm": {
  "n": 27,
  "first": "7:52",
  "h1": "1:44:00",
  "h2": "1:46:00"
 },
 "hr": {
  "max": 185.6,
  "hrr": [
   [
    120.3,
    133.36
   ],
   [
    133.36,
    146.42
   ],
   [
    146.42,
    159.48000000000002
   ],
   [
    159.48000000000002,
    172.54
   ],
   [
    172.54,
    185.6
   ]
  ],
  "pmax": [
   [
    92.8,
    111.36
   ],
   [
    111.36,
    129.92
   ],
   [
    129.92,
    148.48
   ],
   [
    148.48,
    167.04
   ],
   [
    167.04,
    185.6
   ]
  ],
  "fox": 188,
  "meas": [
   [
    120,
    134
   ],
   [
    134,
    148
   ],
   [
    148,
    162
   ],
   [
    162,
    176
   ],
   [
    176,
    190
   ]
  ]
 },
 "log": {
  "end": "2026-10-03",
  "demo": [
   {
    "id": "demo00",
    "date": "2026-08-11",
    "distM": 5400,
    "sec": 1863,
    "hr": 142,
    "type": "easy",
    "note": ""
   },
   {
    "id": "demo01",
    "date": "2026-08-13",
    "distM": 6000,
    "sec": 1740,
    "hr": 162,
    "type": "tempo",
    "note": ""
   },
   {
    "id": "demo02",
    "date": "2026-08-15",
    "distM": 5100,
    "sec": 1785,
    "hr": 142,
    "type": "easy",
    "note": ""
   },
   {
    "id": "demo03",
    "date": "2026-08-16",
    "distM": 13500,
    "sec": 4860,
    "hr": 142,
    "type": "long",
    "note": ""
   },
   {
    "id": "demo10",
    "date": "2026-08-18",
    "distM": 6100,
    "sec": 2105,
    "hr": 142,
    "type": "easy",
    "note": ""
   },
   {
    "id": "demo11",
    "date": "2026-08-20",
    "distM": 6800,
    "sec": 1972,
    "hr": 162,
    "type": "tempo",
    "note": ""
   },
   {
    "id": "demo12",
    "date": "2026-08-22",
    "distM": 5800,
    "sec": 2030,
    "hr": 142,
    "type": "easy",
    "note": ""
   },
   {
    "id": "demo13",
    "date": "2026-08-23",
    "distM": 15300,
    "sec": 5508,
    "hr": 142,
    "type": "long",
    "note": ""
   },
   {
    "id": "demo20",
    "date": "2026-08-25",
    "distM": 6800,
    "sec": 2346,
    "hr": 142,
    "type": "easy",
    "note": ""
   },
   {
    "id": "demo21",
    "date": "2026-08-27",
    "distM": 7600,
    "sec": 2204,
    "hr": 162,
    "type": "tempo",
    "note": ""
   },
   {
    "id": "demo22",
    "date": "2026-08-29",
    "distM": 6500,
    "sec": 2275,
    "hr": 142,
    "type": "easy",
    "note": ""
   },
   {
    "id": "demo23",
    "date": "2026-08-30",
    "distM": 17100,
    "sec": 6156,
    "hr": 142,
    "type": "long",
    "note": ""
   },
   {
    "id": "demo30",
    "date": "2026-09-01",
    "distM": 5000,
    "sec": 1725,
    "hr": 142,
    "type": "easy",
    "note": ""
   },
   {
    "id": "demo31",
    "date": "2026-09-03",
    "distM": 5600,
    "sec": 1624,
    "hr": 162,
    "type": "tempo",
    "note": ""
   },
   {
    "id": "demo32",
    "date": "2026-09-05",
    "distM": 4800,
    "sec": 1680,
    "hr": 142,
    "type": "easy",
    "note": ""
   },
   {
    "id": "demo33",
    "date": "2026-09-06",
    "distM": 12600,
    "sec": 4536,
    "hr": 142,
    "type": "long",
    "note": ""
   },
   {
    "id": "demo40",
    "date": "2026-09-08",
    "distM": 6500,
    "sec": 2243,
    "hr": 142,
    "type": "easy",
    "note": ""
   },
   {
    "id": "demo41",
    "date": "2026-09-10",
    "distM": 7200,
    "sec": 2088,
    "hr": 162,
    "type": "tempo",
    "note": ""
   },
   {
    "id": "demo42",
    "date": "2026-09-12",
    "distM": 6100,
    "sec": 2135,
    "hr": 142,
    "type": "easy",
    "note": ""
   },
   {
    "id": "demo43",
    "date": "2026-09-13",
    "distM": 16200,
    "sec": 5832,
    "hr": 142,
    "type": "long",
    "note": ""
   },
   {
    "id": "demo50",
    "date": "2026-09-15",
    "distM": 7200,
    "sec": 2484,
    "hr": 142,
    "type": "easy",
    "note": ""
   },
   {
    "id": "demo51",
    "date": "2026-09-17",
    "distM": 8000,
    "sec": 2320,
    "hr": 162,
    "type": "tempo",
    "note": ""
   },
   {
    "id": "demo52",
    "date": "2026-09-19",
    "distM": 6800,
    "sec": 2380,
    "hr": 142,
    "type": "easy",
    "note": ""
   },
   {
    "id": "demo53",
    "date": "2026-09-20",
    "distM": 18000,
    "sec": 6480,
    "hr": 142,
    "type": "long",
    "note": ""
   },
   {
    "id": "demo60",
    "date": "2026-09-22",
    "distM": 7900,
    "sec": 2726,
    "hr": 142,
    "type": "easy",
    "note": ""
   },
   {
    "id": "demo61",
    "date": "2026-09-24",
    "distM": 8800,
    "sec": 2552,
    "hr": 162,
    "type": "tempo",
    "note": ""
   },
   {
    "id": "demo62",
    "date": "2026-09-26",
    "distM": 7500,
    "sec": 2625,
    "hr": 142,
    "type": "easy",
    "note": ""
   },
   {
    "id": "demo63",
    "date": "2026-09-27",
    "distM": 19800,
    "sec": 7128,
    "hr": 142,
    "type": "long",
    "note": ""
   },
   {
    "id": "demo70",
    "date": "2026-09-29",
    "distM": 5800,
    "sec": 2001,
    "hr": 142,
    "type": "easy",
    "note": ""
   },
   {
    "id": "demo71",
    "date": "2026-10-01",
    "distM": 6400,
    "sec": 1856,
    "hr": 162,
    "type": "tempo",
    "note": ""
   },
   {
    "id": "demo72",
    "date": "2026-10-03",
    "distM": 5400,
    "sec": 1890,
    "hr": 142,
    "type": "easy",
    "note": ""
   },
   {
    "id": "demoR1",
    "date": "2026-08-29",
    "distM": 5000,
    "sec": 1380,
    "hr": 176,
    "type": "race",
    "note": "5K 测试"
   },
   {
    "id": "demoR2",
    "date": "2026-09-26",
    "distM": 10000,
    "sec": 2790,
    "hr": 172,
    "type": "race",
    "note": "10K 比赛"
   }
  ],
  "weekly": [
   {
    "week": "2026-07-13",
    "km": 0,
    "n": 0
   },
   {
    "week": "2026-07-20",
    "km": 0,
    "n": 0
   },
   {
    "week": "2026-07-27",
    "km": 0,
    "n": 0
   },
   {
    "week": "2026-08-03",
    "km": 0,
    "n": 0
   },
   {
    "week": "2026-08-10",
    "km": 30,
    "n": 4
   },
   {
    "week": "2026-08-17",
    "km": 34,
    "n": 4
   },
   {
    "week": "2026-08-24",
    "km": 43,
    "n": 5
   },
   {
    "week": "2026-08-31",
    "km": 28,
    "n": 4
   },
   {
    "week": "2026-09-07",
    "km": 36,
    "n": 4
   },
   {
    "week": "2026-09-14",
    "km": 40,
    "n": 4
   },
   {
    "week": "2026-09-21",
    "km": 54,
    "n": 5
   },
   {
    "week": "2026-09-28",
    "km": 17.6,
    "n": 3
   }
  ],
  "load": {
   "acute": 37.4,
   "chronic": 40.05,
   "acwr": 0.933832709113608,
   "monotony": 0.8216625545916278,
   "strain": 30.73017954172688
  },
  "best": 43.56023904011448,
  "best_date": "2026-09-26"
 },
 "log2": {
  "load": {
   "acute": 70.5,
   "chronic": 48.325,
   "acwr": 1.4588722193481634,
   "monotony": 1.1862535905056937,
   "strain": 83.63087813065141
  },
  "week": 50.7,
  "best": 46.20054544776615,
  "n": 35
 },
 "thumbV": 45.26300308121324
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const O = ORACLE;
  const T = O.meta.tabs;
  const txt = (sel) => page.$eval(sel, (n) => n.textContent.trim());
  const val = (sel) => page.$eval(sel, (n) => n.value);
  const onTab = async (t) => {
    await page.click(`#rl-tab-${t}`);
    await page.waitForFunction((t) => !document.getElementById(`rl-pane-${t}`).hidden, t);
  };
  const waitTxt = (sel, want) => page.waitForFunction(([s, w]) => {
    const n = document.querySelector(s); return n && n.textContent.trim() === w;
  }, [sel, want], { timeout: 10000 }).catch(() => null);
  const eqTxt = async (sel, want, msg) => { await waitTxt(sel, want); const got = await txt(sel); assert(got === want, `${msg}：期望 ${want}，实得 ${got}`); };
  const shown = (sel) => page.$eval(sel, (n) => getComputedStyle(n).display !== 'none');
  // 页面显示 dp 位小数：容差 = 半个最小单位 + 浮点余量（求和顺序不同会让 x.x5 落到两边）
  const numNear = async (sel, v, dp, msg) => { const got = parseFloat(await txt(sel)); assert(Math.abs(got - v) <= 0.5 * 10 ** -dp + 1e-9, `${msg}：期望 ≈${v}，实得 ${got}`); };
  const cell = (tbl, key, col) => txt(`${tbl} tbody tr[data-k="${key}"] td:nth-child(${col})`);

  await page.goto(toolURL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => window.__rl && window.RL);
  await page.evaluate(() => window.__rl.setToday('2026-10-03'));

  // ── 1. 配速换算：默认 10 km 50:00 → 5:00/km ──
  await eqTxt('#rl-pc-pkm', O.pace1.pace, '每公里配速');
  await eqTxt('#rl-pc-pmi', O.pace1.pmi, '每英里配速');
  await eqTxt('#rl-pc-lap', O.pace1.lap, '400 米圈速');
  assert((await txt('#rl-pc-kmh')).startsWith(O.pace1.kmh.toFixed(2)), '时速');
  assert((await txt('#rl-pc-mph')).startsWith(O.pace1.mph.toFixed(2)), '英里时速');
  assert((await cell('#rl-pc-tbl', 'hm', 2)) === O.pace1.hm_time, '按该配速半马用时');
  assert((await cell('#rl-pc-tbl', 'm', 2)) === O.pace1.m_time, '按该配速全马用时');
  assert(await page.$eval('#rl-pc-tbl tr[data-k="10k"]', (n) => n.classList.contains('rl-hl')), '当前距离行应高亮');
  assert(await page.$eval('#rl-pc-pace', (n) => n.disabled), '求配速时配速框应禁用');

  // 求用时：半马 4:30/km
  await page.click('#rl-pc-mode [data-v="time"]');
  await page.selectOption('#rl-pc-preset', 'hm');
  await page.fill('#rl-pc-pace', '4:30');
  await eqTxt('#rl-pc-v', O.pace2.time, '半马 4:30 配速用时');
  assert((await val('#rl-pc-time')) === O.pace2.time, '用时框被回填');
  // 求距离：1 小时 @ 4:00
  await page.click('#rl-pc-mode [data-v="dist"]');
  await page.fill('#rl-pc-time', '1:00:00');
  await page.fill('#rl-pc-pace', '4:00');
  await page.waitForFunction((w) => document.getElementById('rl-pc-dist').value === String(w), O.pace3.dist, { timeout: 10000 }).catch(() => null);
  assert((await val('#rl-pc-dist')) === String(O.pace3.dist), `求距离应为 ${O.pace3.dist}，实得 ${await val('#rl-pc-dist')}`);
  assert((await val('#rl-pc-preset')) === '15k', '15 km 应自动匹配到预设');
  // 非法输入
  await page.fill('#rl-pc-time', '1:75');
  await page.waitForFunction(() => document.getElementById('rl-pc-msg').textContent.length > 0, null, { timeout: 10000 });
  assert(await page.$eval('#rl-pc-time', (n) => n.getAttribute('aria-invalid') === 'true'), '1:75 应标为非法');
  assert((await txt('#rl-pc-pkm')) === '—', '非法输入时读数清空');
  // 回到求配速，切英里
  await page.click('#rl-pc-mode [data-v="pace"]');
  await page.selectOption('#rl-pc-preset', '10k');
  await page.fill('#rl-pc-time', '50:00');
  await eqTxt('#rl-pc-pkm', O.pace1.pace, '恢复后每公里配速');
  await page.click('#rl-pc-unit [data-v="mi"]');
  await page.waitForFunction((w) => document.getElementById('rl-pc-pace').value === w, O.pace_mi.pace, { timeout: 10000 }).catch(() => null);
  assert((await val('#rl-pc-pace')) === O.pace_mi.pace, `切英里后配速 ${await val('#rl-pc-pace')} ≠ ${O.pace_mi.pace}`);
  assert((await val('#rl-pc-dist')) === String(O.pace_mi.dist), '切英里后距离换算');
  assert((await txt('#rl-pc-pkm')) === O.pace1.pace, '切单位不改变每公里配速');
  await page.click('#rl-pc-unit [data-v="km"]');

  // 坡度
  await page.fill('#rl-gp-flat', '5:00');
  await page.fill('#rl-gp-grade', '6');
  await eqTxt('#rl-gp-out', O.gap.v, '+6% 等效配速');
  assert((await txt('#rl-gp-mul')) === '×' + O.gap.mul.toFixed(3), '能耗倍数');
  await page.fill('#rl-gp-grade', '-10');
  await eqTxt('#rl-gp-out', O.gap.down, '−10% 等效配速');
  await page.fill('#rl-gp-grade', '60');
  await page.waitForFunction(() => document.getElementById('rl-gp-msg').textContent.includes('45'), null, { timeout: 10000 });
  assert((await txt('#rl-gp-out')) === '—', '超范围坡度不出读数');
  await page.fill('#rl-gp-grade', '6');
  const gpLabel = await page.$$eval('#rl-gp-fig text', (ns) => ns.map((n) => n.textContent).filter((s) => /^×1\.\d\d$/.test(s)));
  assert(gpLabel.length === 1, `坡度图上应画出当前点倍数标签，实得 ${gpLabel.length}`);

  // ── 2. 成绩预测：5K 22:30 ──
  await onTab('vdot');
  await eqTxt('#rl-vd-v', O.vd.V.toFixed(1), 'VDOT');
  assert((await txt('#rl-vd-d')).includes(O.vd.pct.toFixed(1) + '%'), '维持最大摄氧百分比');
  for (const k of ['3k', '10k', 'hm', 'm']) assert((await cell('#rl-vd-eq', k, 2)) === O.vd.eq[k], `Daniels 等效 ${k}：${await cell('#rl-vd-eq', k, 2)} ≠ ${O.vd.eq[k]}`);
  assert((await cell('#rl-vd-eq', 'm', 4)) === O.vd.riegel_m, 'Riegel 全马');
  assert((await page.$$('#rl-vd-eq tbody tr')).length === 10, '等效表应有 10 行（≥1500 米）');
  const zrow = (z, col) => txt(`#rl-vd-train tr[data-z="${z}"] td:nth-child(${col})`);
  for (const z of ['M', 'T', 'I', 'R']) assert((await zrow(z, 2)) === O.vd[z], `${z} 配速 ${await zrow(z, 2)} ≠ ${O.vd[z]}`);
  assert((await zrow('E', 2)) === O.vd.E, `E 区间 ${await zrow('E', 2)} ≠ ${O.vd.E}`);
  assert((await zrow('I', 4)) === O.vd.I_lap, 'I 400 米圈速');
  assert((await zrow('T', 3)) === O.vd.T_mi, 'T 每英里');
  await page.fill('#rl-vd-k', '1.10');
  await page.waitForFunction((w) => document.querySelector('#rl-vd-eq tr[data-k="m"] td:nth-child(4)').textContent === w, O.vd.riegel_m_k110, { timeout: 10000 }).catch(() => null);
  assert((await cell('#rl-vd-eq', 'm', 4)) === O.vd.riegel_m_k110, 'Riegel k=1.10 全马');
  assert((await cell('#rl-vd-eq', 'm', 2)) === O.vd.eq.m, '改 k 不影响 Daniels');
  await page.fill('#rl-vd-k', '1.06');
  // 图：两条曲线 + 你的成绩标签都画出来了
  const vdFig = await page.$$eval('#rl-vd-fig path', (ns) => ns.filter((n) => (n.getAttribute('d') || '').length > 200).length);
  assert(vdFig === 2, `配速衰减图应有 2 条曲线，实得 ${vdFig}`);
  assert(await page.$$eval('#rl-vd-fig text', (ns) => ns.some((n) => n.textContent.startsWith('你的成绩'))), '图上应标出你的成绩');
  // 1500 米以下拒绝
  await page.selectOption('#rl-vd-preset', '800');
  await page.waitForFunction(() => document.getElementById('rl-vd-msg').textContent.includes('1500'), null, { timeout: 10000 });
  assert((await txt('#rl-vd-v')) === '—', '800 米不给 VDOT');
  assert((await page.$$('#rl-vd-eq tbody tr')).length === 0, '非法时清空等效表');
  await page.selectOption('#rl-vd-preset', '5k');
  await eqTxt('#rl-vd-v', O.vd.V.toFixed(1), '恢复 5K 后 VDOT');
  assert(await page.$eval('#rl-vd-fromlog', (n) => n.disabled), '日志为空时「用日志最佳成绩」应禁用');

  // ── 3. 分段：半马 1:45:00 负分段 60 s ──
  await onTab('split');
  await page.waitForFunction((n) => document.querySelectorAll('#rl-sp-tbl tbody tr').length === n, O.sp.n, { timeout: 10000 });
  const rows = await page.$$eval('#rl-sp-tbl tbody tr', (ns) => ns.map((r) => [3, 4, 5].map((c) => r.children[c - 1].textContent)));
  assert(rows.length === O.sp.n, `段数 ${rows.length}`);
  const badRows = rows.map((r, i) => (r.join('|') === O.sp.rows[i].join('|') ? null : `${i + 1}: ${r.join('|')} ≠ ${O.sp.rows[i].join('|')}`)).filter(Boolean);
  assert(badRows.length === 0, `分段表与 oracle 不符：${badRows.slice(0, 3).join('; ')}`);
  assert((await txt('#rl-sp-halves')).includes(`前半程 ${O.sp.h1}`) && (await txt('#rl-sp-halves')).includes(`后半程 ${O.sp.h2}`), '半程读数');
  assert((await txt('#rl-sp-avg')).startsWith(O.sp.avg), '平均配速');
  const bars = await page.$$eval('#rl-sp-fig rect.rl-sp-bar', (ns) => ns.map((n) => n.getBoundingClientRect().height));
  assert(bars.length === O.sp.n, `配速柱 ${bars.length} 根`);
  assert(bars[20] > bars[0], '负分段：后段柱子（越快越高）应高于首段');
  // 匀速：所有整公里配速相同
  await page.click('#rl-sp-strat [data-v="even"]');
  await page.waitForFunction(() => document.getElementById('rl-sp-delta').disabled, null, { timeout: 10000 });
  const evenP = await page.$$eval('#rl-sp-tbl tbody tr td:nth-child(4)', (ns) => [...new Set(ns.map((n) => n.textContent))]);
  assert(evenP.length === 1 && evenP[0] === O.sp.avg, `匀速时配速应全为 ${O.sp.avg}，实得 ${evenP.join(',')}`);
  // 全马 3:30 正分段 120 s，按英里
  await page.click('#rl-sp-strat [data-v="pos"]');
  await page.selectOption('#rl-sp-preset', 'm');
  await page.fill('#rl-sp-time', '3:30:00');
  await page.fill('#rl-sp-delta', '120');
  await page.selectOption('#rl-sp-step', 'mi');
  await page.waitForFunction((n) => document.querySelectorAll('#rl-sp-tbl tbody tr').length === n, O.spm.n, { timeout: 10000 });
  assert((await txt('#rl-sp-tbl tbody tr:first-child td:nth-child(3)')) === O.spm.first, '全马首英里用时');
  assert((await txt('#rl-sp-halves')).includes(`前半程 ${O.spm.h1}`) && (await txt('#rl-sp-halves')).includes(`后半程 ${O.spm.h2}`), '正分段半程读数');
  const card = await page.evaluate(() => window.__rl.spText());
  assert(card.split('\n').length === O.spm.n + 1 && card.split('\n').pop().includes('3:30:00'), '手环卡文本行数与终点累计');
  await page.fill('#rl-sp-delta', '99999');
  await page.waitForFunction(() => document.getElementById('rl-sp-msg').textContent.includes('1/8'), null, { timeout: 10000 });
  assert((await page.$$('#rl-sp-tbl tbody tr')).length === 0, '半程差过大时拒绝');
  await page.selectOption('#rl-sp-preset', 'hm'); await page.fill('#rl-sp-time', '1:45:00'); await page.fill('#rl-sp-delta', '60');
  await page.selectOption('#rl-sp-step', '1'); await page.click('#rl-sp-strat [data-v="neg"]');

  // ── 4. 心率 ──
  await onTab('hr');
  const zr = (z) => txt(`#rl-hr-tbl tr[data-z="${z}"] td:nth-child(3)`);
  const rng = (z) => `${Math.round(z[0])}–${Math.round(z[1])}`;
  await waitTxt('#rl-hr-tbl tr[data-z="2"] td:nth-child(3)', rng(O.hr.hrr[1]));
  for (let i = 0; i < 5; i++) assert((await zr(i + 1)) === rng(O.hr.hrr[i]), `储备心率 Z${i + 1}：${await zr(i + 1)} ≠ ${rng(O.hr.hrr[i])}`);
  assert((await txt('#rl-hr-v')).startsWith(String(Math.round(O.hr.max))), '估算最大心率');
  await page.fill('#rl-hr-check', '150');
  const expectZ = O.hr.hrr.findIndex((z, i) => 150 >= z[0] && (i === 4 || 150 < O.hr.hrr[i + 1][0])) + 1;
  await page.waitForFunction((z) => document.getElementById('rl-hr-which').textContent.startsWith('Z' + z), expectZ, { timeout: 10000 }).catch(() => null);
  assert((await txt('#rl-hr-which')).startsWith('Z' + expectZ), `150 应落在 Z${expectZ}，实得 ${await txt('#rl-hr-which')}`);
  await page.click('#rl-hr-method [data-v="max"]');
  await waitTxt('#rl-hr-tbl tr[data-z="1"] td:nth-child(3)', rng(O.hr.pmax[0]));
  for (let i = 0; i < 5; i++) assert((await zr(i + 1)) === rng(O.hr.pmax[i]), `%最大心率 Z${i + 1}`);
  assert(await page.$eval('#rl-hr-rest', (n) => n.disabled), '%最大心率法不需要静息心率');
  await page.click('#rl-hr-method [data-v="hrr"]');
  await page.fill('#rl-hr-max', '190'); await page.fill('#rl-hr-rest', '50');
  await waitTxt('#rl-hr-tbl tr[data-z="4"] td:nth-child(3)', rng(O.hr.meas[3]));
  for (let i = 0; i < 5; i++) assert((await zr(i + 1)) === rng(O.hr.meas[i]), `实测最大心率 Z${i + 1}`);
  await page.fill('#rl-hr-rest', '185');
  await page.waitForFunction(() => document.getElementById('rl-hr-msg').textContent.length > 0, null, { timeout: 10000 });
  assert((await page.$$('#rl-hr-tbl tbody tr')).length === 0, '静息心率不合理时清空区间');
  await page.fill('#rl-hr-max', ''); await page.fill('#rl-hr-rest', '55');
  await waitTxt('#rl-hr-tbl tr[data-z="2"] td:nth-child(3)', rng(O.hr.hrr[1]));
  await page.selectOption('#rl-hr-formula', 'fox');
  await page.waitForFunction((w) => document.getElementById('rl-hr-v').textContent.startsWith(w), String(O.hr.fox), { timeout: 10000 });
  await page.selectOption('#rl-hr-formula', 'tanaka');

  // ── 5. 训练日志 ──
  await onTab('log');
  assert(await shown('#rl-lg-empty'), '空日志显示空状态');
  const demo = await page.evaluate(() => window.__rl.demo('2026-10-03'));
  assert(JSON.stringify(demo) === JSON.stringify(O.log.demo), '示例日志生成规格与 oracle 独立重写版逐字段一致');
  await page.click('#rl-lg-demo');
  await page.waitForFunction((n) => document.querySelectorAll('#rl-lg-tbl tbody tr').length === n, O.log.demo.length, { timeout: 10000 });
  assert(!(await shown('#rl-lg-empty')), '有数据后空状态隐藏（计算样式）');
  const L = O.log.load;
  await numNear('#rl-lg-acute', L.acute, 1, '近 7 天');
  await numNear('#rl-lg-chronic', L.chronic, 1, '28 天周均');
  await numNear('#rl-lg-acwr', L.acwr, 2, 'ACWR');
  await numNear('#rl-lg-mono', L.monotony, 2, '单调度');
  assert((await txt('#rl-lg-vdot')) === O.log.best.toFixed(1), '90 天最佳 VDOT');
  await numNear('#rl-lg-week', O.log.weekly[11].km, 1, '本周跑量');
  assert(await page.$eval('#rl-lg-band', (n) => n.classList.contains('rl-band-ok')), 'ACWR 0.93 应在适宜区间');
  // 柱子：每根的数据与 oracle 周跑量一致；几何：高度比例正确
  const lb = await page.$$eval('#rl-lg-fig rect.rl-lg-bar', (ns) => ns.map((n) => ({ km: +n.dataset.km, h: n.getBoundingClientRect().height })));
  const wkNZ = O.log.weekly.filter((w) => w.km > 0);
  assert(lb.length === wkNZ.length, `周跑量柱 ${lb.length} ≠ ${wkNZ.length}`);
  assert(lb.every((b, i) => Math.abs(b.km - wkNZ[i].km) < 0.006), '柱子数据与 oracle 周跑量一致');
  const ratioBad = lb.filter((b) => Math.abs(b.h / lb[0].h - b.km / lb[0].km) > 0.02);
  assert(ratioBad.length === 0, `柱高与跑量不成比例 ${ratioBad.length} 根`);
  // 几何：每根柱子的底边都落在坐标框底线上（整体缩放/平移会保持比例，比例断言测不出）
  const baseOff = await page.$eval('#rl-lg-fig', (svg) => {
    const frame = [...svg.querySelectorAll('rect')].find((r) => r.getAttribute('fill') === 'none');
    const by = frame.getBoundingClientRect().bottom;
    return [...svg.querySelectorAll('rect.rl-lg-bar')].map((r) => Math.abs(r.getBoundingClientRect().bottom - by)).filter((d) => d > 1.5).length;
  });
  assert(baseOff === 0, `${baseOff} 根柱子底边没落在坐标框底线上`);
  const wkLabels = await page.$$eval('#rl-lg-fig text', (ns) => ns.filter((n) => /^\d+\/\d+$/.test(n.textContent)).length);
  assert(wkLabels === 12, `12 周日期标签应全部画出，实得 ${wkLabels}`);
  // 加两笔
  const addRun = async (date, km, t, type) => {
    await page.fill('#rl-lg-date', date); await page.fill('#rl-lg-dist', km); await page.fill('#rl-lg-time', t);
    await page.selectOption('#rl-lg-type', type); await page.click('#rl-lg-add');
  };
  await addRun('2026-10-03', '12', '55:00', 'tempo');
  await addRun('2026-10-02', '21.1', '1:38:00', 'race');
  await page.waitForFunction((n) => document.querySelectorAll('#rl-lg-tbl tbody tr').length === n, O.log2.n, { timeout: 10000 });
  await numNear('#rl-lg-acwr', O.log2.load.acwr, 2, '加量后 ACWR');
  assert((await txt('#rl-lg-vdot')) === O.log2.best.toFixed(1), '新比赛刷新最佳 VDOT');
  await numNear('#rl-lg-week', O.log2.week, 1, '加量后本周跑量');
  // 非法：配速太快
  await addRun('2026-10-03', '10', '10:00', 'easy');
  await page.waitForFunction(() => document.getElementById('rl-lg-msg').textContent.includes('1:40'), null, { timeout: 10000 });
  assert((await page.$$('#rl-lg-tbl tbody tr')).length === O.log2.n, '非法记录不入库');
  // 持久化
  await page.reload();
  await page.waitForFunction(() => window.__rl);
  await page.evaluate(() => window.__rl.setToday('2026-10-03'));
  await onTab('log');
  assert((await page.$$('#rl-lg-tbl tbody tr')).length === O.log2.n, '刷新后记录仍在（localStorage）');
  // 删除
  await page.click('#rl-lg-tbl tbody tr:first-child [data-del]');
  await page.waitForFunction((n) => document.querySelectorAll('#rl-lg-tbl tbody tr').length === n, O.log2.n - 1, { timeout: 10000 });
  // 导入：两条有效（其一重复 id）+ 两条无效
  const r = await page.evaluate(() => window.__rl.importText(JSON.stringify({ log: [
    { id: 'demoR1', date: '2026-08-29', distM: 5000, sec: 1380, type: 'race' },
    { id: 'imp-a', date: '2026-09-30', distM: 8000, sec: 2400, type: 'easy' },
    { id: 'bad1', date: '2026-02-30', distM: 5000, sec: 1500 },
    { id: 'bad2', date: '2026-09-01', distM: -3, sec: 100 }] })));
  assert(r === true, '导入成功');
  const io = await txt('#rl-lg-iomsg');
  assert(io.includes('导入 1 条') && io.includes('1 条已存在') && io.includes('跳过 2 条'), `导入汇总：${io}`);
  assert(!(await page.evaluate(() => window.__rl.importText('{oops'))), '坏 JSON 返回 false');
  // 日志最佳成绩带入预测页
  await onTab('vdot');
  assert(!(await page.$eval('#rl-vd-fromlog', (n) => n.disabled)), '有比赛记录后按钮可用');
  await page.click('#rl-vd-fromlog');
  await eqTxt('#rl-vd-v', O.log2.best.toFixed(1), '从日志带入后的 VDOT');

  // ── 6. 键盘：方向键切页签 ──
  await page.focus('#rl-tab-vdot');
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => !document.getElementById('rl-pane-split').hidden, null, { timeout: 10000 });
  assert(await page.evaluate(() => document.activeElement.id === 'rl-tab-split'), '方向键移动焦点');

  // ── 7. 渲染守卫（逐页签 × 逐视口） ──
  const n = await renderGuards(page, {
    assert, tabs: T, onTab,
    paneSel: (t) => `#rl-pane-${t}`, panesRoot: '#rl-panes',
    figSel: (t) => `#rl-pane-${t} svg.rl-figsvg`, cardSel: '.rl-card', childSel: 'svg,dl,h2,h3,p',
    minControls: 40, minTextsInFig: 8,
  });
  assert(n >= 40, `应扫到 ≥40 个可见控件，实得 ${n}`);
  // 表格不得在卡片里横向溢出（宽视口）
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const t of ['pace', 'vdot', 'split', 'log']) {
    await onTab(t);
    const over = await page.$$eval(`#rl-pane-${t} .rl-tbl-wrap`, (ns) => ns.map((n) => n.scrollWidth - n.clientWidth).filter((d) => d > 2));
    assert(over.length === 0, `页签 ${t} 有表格横向溢出 ${over.join(',')}px`);
  }

  // ── 缩略图：成绩预测页 ──
  await onTab('vdot');
  await page.selectOption('#rl-vd-preset', '10k');
  await page.fill('#rl-vd-time', '45:00');
  await eqTxt('#rl-vd-v', O.thumbV.toFixed(1), '缩略图场景 10K 45:00 的 VDOT');
  await page.evaluate(() => window.scrollTo(0, 0));
  await screenshot('thumb.png');
};
