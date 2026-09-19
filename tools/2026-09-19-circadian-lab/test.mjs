/* 昼夜节律工作台 · 浏览器集成测试
 * ①真实交互后的读数对拍 ORACLE（由 oracle/page_inputs.mjs 用**成品里的引擎**算出、机械注入，
 *   测试里没有一个手打的期望值）；②渲染守卫（计算样式 / 控件尺寸 / 窄屏溢出 / 图上文字避让 /
 *   子元素不越格）；③能力清单逐项现场跑。 */
// ORACLE-BEGIN（由 oracle/inject_oracle.mjs 机械注入，勿手改）
const ORACLE = {
  "jetIn": {
    "from": "SIN",
    "to": "SFO",
    "depDate": "2026-10-12",
    "depTime": "09:20",
    "arrDate": "2026-10-12",
    "arrTime": "09:50",
    "homeSleep": "23:30",
    "homeWake": "07:30",
    "destSleep": "23:00",
    "destWake": "07:00",
    "prep": 1,
    "planDays": 6,
    "brightH": 2,
    "avoidH": 3,
    "brightLux": 10000,
    "wakeLux": 250
  },
  "jet": {
    "forger99": {
      "tzDiff": -15,
      "flightHours": 15.5,
      "adaptPlan": 5,
      "adaptBase": null,
      "totalDays": 7,
      "finalPlan": 0.019,
      "finalBase": 6.9263,
      "totalMove": 9.519,
      "moveDir": "advance",
      "targetCbt": "04:28",
      "targetDlmo": "21:28",
      "rowCount": 9,
      "arriveMis": -8.5087,
      "firstBright": "06:00–08:00",
      "firstBrightDate": "2026-10-11",
      "brightCount": 9,
      "avoidCount": 5,
      "lastCbtClock": "04:26",
      "dayRows": [
        {
          "date": "2026-10-11",
          "kind": "prep",
          "mis": -8.5087,
          "cbt": "13:32",
          "bright": "06:00–08:00",
          "sunrise": "06:49"
        },
        {
          "date": "2026-10-12",
          "kind": "travel",
          "mis": -7.9782,
          "cbt": "13:00",
          "bright": "06:00–08:00",
          "sunrise": "06:49"
        },
        {
          "date": "2026-10-12",
          "kind": "arrive",
          "mis": -6.94,
          "cbt": "11:28",
          "bright": "14:30–16:30",
          "sunrise": "07:15"
        },
        {
          "date": "2026-10-13",
          "kind": "dest",
          "mis": -5.1012,
          "cbt": "09:57",
          "bright": "14:30–16:30",
          "sunrise": "07:16"
        },
        {
          "date": "2026-10-14",
          "kind": "dest",
          "mis": -3.0234,
          "cbt": "07:28",
          "bright": "09:00–11:00",
          "sunrise": "07:17"
        },
        {
          "date": "2026-10-15",
          "kind": "dest",
          "mis": -1.0724,
          "cbt": "06:56",
          "bright": "07:00–09:00",
          "sunrise": "07:18"
        },
        {
          "date": "2026-10-16",
          "kind": "dest",
          "mis": 0.0297,
          "cbt": "05:37",
          "bright": "07:00–09:00",
          "sunrise": "07:19"
        },
        {
          "date": "2026-10-17",
          "kind": "dest",
          "mis": 0.0249,
          "cbt": "04:28",
          "bright": "19:00–21:00",
          "sunrise": "07:20"
        },
        {
          "date": "2026-10-18",
          "kind": "dest",
          "mis": 0.019,
          "cbt": "04:26",
          "bright": "18:30–20:30",
          "sunrise": "07:21"
        }
      ]
    },
    "jewett99": {
      "tzDiff": -15,
      "flightHours": 15.5,
      "adaptPlan": 5,
      "adaptBase": null,
      "totalDays": 7,
      "finalPlan": 0.0265,
      "finalBase": 4.0353,
      "totalMove": 9.5265,
      "moveDir": "advance",
      "targetCbt": "04:00",
      "targetDlmo": "21:00",
      "rowCount": 9,
      "arriveMis": -8.6234,
      "firstBright": "06:30–08:30",
      "firstBrightDate": "2026-10-11",
      "brightCount": 9,
      "avoidCount": 5,
      "lastCbtClock": "03:46",
      "dayRows": [
        {
          "date": "2026-10-11",
          "kind": "prep",
          "mis": -8.6234,
          "cbt": "12:46",
          "bright": "06:30–08:30",
          "sunrise": "06:49"
        },
        {
          "date": "2026-10-12",
          "kind": "travel",
          "mis": -8.2343,
          "cbt": "12:44",
          "bright": "06:00–08:00",
          "sunrise": "06:49"
        },
        {
          "date": "2026-10-12",
          "kind": "arrive",
          "mis": -7.0918,
          "cbt": "12:41",
          "bright": "14:00–16:00",
          "sunrise": "07:15"
        },
        {
          "date": "2026-10-13",
          "kind": "dest",
          "mis": -5.3559,
          "cbt": "10:45",
          "bright": "13:30–15:30",
          "sunrise": "07:16"
        },
        {
          "date": "2026-10-14",
          "kind": "dest",
          "mis": -3.4799,
          "cbt": "09:07",
          "bright": "09:30–11:30",
          "sunrise": "07:17"
        },
        {
          "date": "2026-10-15",
          "kind": "dest",
          "mis": -1.483,
          "cbt": "07:44",
          "bright": "08:00–10:00",
          "sunrise": "07:18"
        },
        {
          "date": "2026-10-16",
          "kind": "dest",
          "mis": -0.133,
          "cbt": "06:02",
          "bright": "07:00–09:00",
          "sunrise": "07:19"
        },
        {
          "date": "2026-10-17",
          "kind": "dest",
          "mis": 0.0571,
          "cbt": "04:28",
          "bright": "18:30–20:30",
          "sunrise": "07:20"
        },
        {
          "date": "2026-10-18",
          "kind": "dest",
          "mis": 0.0265,
          "cbt": "03:46",
          "bright": "13:00–15:00",
          "sunrise": "07:21"
        }
      ]
    }
  },
  "jetLHR": {
    "tzDiff": -7,
    "adapt": 4,
    "final": 0.0279
  },
  "shift": {
    "none": {
      "wocl": 41.5423,
      "lastCbt": "05:59",
      "move": -0.7484,
      "rowCount": 8,
      "firstCbt": "04:32"
    },
    "bright": {
      "wocl": 16.0448,
      "lastCbt": "07:27",
      "move": -2.4469,
      "rowCount": 8,
      "firstCbt": "04:32"
    },
    "full": {
      "wocl": 11.4428,
      "lastCbt": "07:27",
      "move": -2.5438,
      "rowCount": 8,
      "firstCbt": "04:32"
    }
  },
  "dose": [
    {
      "zh": "清晨 30 分钟 10000 lux",
      "luxHours": 5000,
      "first": 0.1406,
      "total": 0.4435
    },
    {
      "zh": "上午 2 小时 2500 lux",
      "luxHours": 5000,
      "first": 0.1283,
      "total": 0.403
    },
    {
      "zh": "白天 5 小时 1000 lux",
      "luxHours": 5000,
      "first": 0.099,
      "total": 0.3185
    },
    {
      "zh": "夜里 2 小时 2500 lux",
      "luxHours": 5000,
      "first": -0.2649,
      "total": -0.7543
    }
  ],
  "screen": {
    "first": -0.128,
    "total": -0.4433,
    "firstMin": 7.7
  },
  "lightResp": [
    {
      "model": "forger99",
      "bhat": [
        0.045014,
        0.102812,
        0.173097,
        0.220838
      ]
    },
    {
      "model": "jewett99",
      "bhat": [
        0.043271,
        0.1149,
        0.196683,
        0.239505
      ]
    },
    {
      "model": "hannay19",
      "bhat": [
        0.005578,
        0.099313,
        0.211956,
        0.219841
      ]
    }
  ],
  "sim": {
    "forger99": {
      "tau": 24.2003,
      "nCbt": 12,
      "lastSpacing": 24.2004,
      "entrainedSpacing": 24.0473,
      "firstCbt": 5.1628,
      "lastCbt": 269.9313,
      "lastCbtClock": "05:56",
      "lastAmp": 0.9961
    },
    "hannay19": {
      "tau": 24.1769,
      "nCbt": 12,
      "lastSpacing": 24.178,
      "entrainedSpacing": 23.7985,
      "firstCbt": 8.0223,
      "lastCbt": 270.002,
      "lastCbtClock": "06:00",
      "lastAmp": 0.7023
    }
  },
  "prc": {
    "single": {
      "maxAdv": 0.4561,
      "maxDel": -0.6415,
      "pp": 1.0976,
      "ampRatio": 93.2546,
      "advAt": 0,
      "nPoints": 18
    },
    "strong": {
      "maxAdv": 2.8809,
      "maxDel": -4.3042,
      "pp": 7.1851,
      "ampRatio": 55.887,
      "advAt": 1.3333,
      "nPoints": 18
    }
  },
  "offline": {
    "pass": 1048,
    "scalars": 829638,
    "cases": 66,
    "worstTraj": 3.552713678800501e-15,
    "solarWorstMin": 0.58
  },
  "cities": 36,
  "models": 3,
  "caps": null
};
// ORACLE-END

export default async ({ page, toolURL, screenshot, assert }) => {
  const num = async (sel) => {
    const t = await page.$eval(sel, (e) => e.textContent);
    const m = /-?\d+(\.\d+)?/.exec(t.replace(/[０-９]/g, ''));
    return m ? parseFloat(m[0]) : NaN;
  };
  const text = (sel) => page.$eval(sel, (e) => e.textContent.trim());
  const near = (a, b, tol, msg) => assert(Math.abs(a - b) <= tol, `${msg}：得到 ${a}，期望 ${b}±${tol}`);
  const showTab = async (t) => {
    await page.click('#tab-' + t);
    await page.waitForFunction((x) => document.getElementById('pane-' + x) && !document.getElementById('pane-' + x).hidden, t);
    await page.waitForTimeout(60);
  };

  await page.goto(toolURL, { waitUntil: 'networkidle' });
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.CLApp && window.CLApp.jet, null, { timeout: 30000 });

  // ───────── ① 页面骨架 ─────────
  assert(await page.$('a[href="../../"]'), '顶部必须有返回工具集的链接');
  assert((await page.$$('.cl-tab')).length === 6, '应有 6 个标签页');
  assert((await page.$$('#hero-panes .cl-pane')).length === 4, 'hero 应是 2×2 四格终端面板');
  assert((await page.$$('canvas')).length === 0, '本工具全程 SVG，不应出现 canvas');
  const cityCount = await page.$eval('#jet-from', (e) => e.options.length);
  assert(cityCount === ORACLE.cities, `城市下拉应有 ${ORACLE.cities} 项，实际 ${cityCount}`);
  assert(await page.$eval('#jet-model', (e) => e.options.length) === ORACLE.models, '模型下拉应有 3 项');

  // ───────── ② 倒时差：填固定行程后逐项对拍 ─────────
  const IN = ORACLE.jetIn;
  async function fillJet(over) {
    const v = Object.assign({}, IN, over || {});
    await page.selectOption('#jet-from', v.from);
    await page.selectOption('#jet-to', v.to);
    for (const [sel, val] of [['#jet-dep-date', v.depDate], ['#jet-dep-time', v.depTime],
      ['#jet-arr-date', v.arrDate], ['#jet-arr-time', v.arrTime], ['#jet-home-sleep', v.homeSleep],
      ['#jet-home-wake', v.homeWake], ['#jet-dest-sleep', v.destSleep], ['#jet-dest-wake', v.destWake],
      ['#jet-prep', String(v.prep)], ['#jet-days', String(v.planDays)], ['#jet-bright-h', String(v.brightH)],
      ['#jet-avoid-h', String(v.avoidH)], ['#jet-bright-lux', String(v.brightLux)], ['#jet-wake-lux', String(v.wakeLux)]]) {
      await page.fill(sel, val);
    }
    await page.click('#jet-run');
    await page.waitForFunction(() => window.CLApp.jet && window.CLApp.jet.planned, null, { timeout: 30000 });
    await page.waitForTimeout(80);
  }
  await page.selectOption('#jet-model', 'forger99');
  await fillJet();
  const J = ORACLE.jet.forger99;
  assert((await text('#jet-msg')) === '', '合法输入不应报错：' + (await text('#jet-msg')));
  near(await num('#kpi-adapt-plan'), J.adaptPlan, 0, '计划收敛天数');
  assert((await text('#kpi-adapt-base')).indexOf('>') === 0, '不干预在 7 天内不应收敛（应显示 > N 天）');
  near(await num('#kpi-move'), Math.abs(J.totalMove), 0.05, '计划走的相位位移');
  assert((await text('#kpi-move')).indexOf(J.moveDir === 'advance' ? '提前' : '延后') === 0, '位移方向标注');
  assert((await text('#kpi-target')).indexOf(J.targetCbt) === 0, `目标 CBTmin 应为 ${J.targetCbt}`);
  assert((await text('#kpi-target')).indexOf(J.targetDlmo) > 0, `目标 DLMO 应为 ${J.targetDlmo}`);
  const finalTxt = await text('#kpi-final');
  near(parseFloat(finalTxt.split('/')[0]), J.finalPlan, 0.005, '第 7 天残余相位差（计划）');
  near(parseFloat(finalTxt.split('/')[1].replace(/[^\d.+-]/g, '')), J.finalBase, 0.005, '第 7 天残余相位差（不干预）');
  near(await num('#hero-mis'), J.arriveMis, 0.05, 'hero 落地错位');
  assert((await text('#hero-today')) === J.firstBright, `hero 第一天求光窗口应为 ${J.firstBright}`);

  // 逐日表：每一行都对拍
  const rowsTxt = await page.$$eval('#jet-table tbody tr', (trs) => trs.map((tr) =>
    Array.from(tr.children).map((td) => td.textContent.trim())));
  assert(rowsTxt.length === J.rowCount, `逐日表应有 ${J.rowCount} 行，实际 ${rowsTxt.length}`);
  J.dayRows.forEach((r, i) => {
    assert(rowsTxt[i][0].indexOf(r.date) === 0, `第 ${i + 1} 行日期应为 ${r.date}，实际 ${rowsTxt[i][0]}`);
    if (r.bright) assert(rowsTxt[i][3] === r.bright, `第 ${i + 1} 行求光窗口应为 ${r.bright}，实际 ${rowsTxt[i][3]}`);
    if (r.cbt) assert(rowsTxt[i][5] === r.cbt, `第 ${i + 1} 行 CBTmin 应为 ${r.cbt}，实际 ${rowsTxt[i][5]}`);
    near(parseFloat(rowsTxt[i][6]), r.mis, 0.005, `第 ${i + 1} 行相位差`);
    if (r.sunrise) assert(rowsTxt[i][7].indexOf(r.sunrise) === 0, `第 ${i + 1} 行日出应为 ${r.sunrise}`);
  });
  const brightCount = rowsTxt.filter((r) => r[3] !== '—').length;
  const avoidCount = rowsTxt.filter((r) => r[4] !== '—').length;
  assert(brightCount === J.brightCount && avoidCount === J.avoidCount,
    `求光/避光窗口数应为 ${J.brightCount}/${J.avoidCount}，实际 ${brightCount}/${avoidCount}`);

  // 甘特图：条块数量与位置
  const gantt = await page.evaluate(() => {
    const svg = document.getElementById('fig-jet-gantt');
    const rects = Array.from(svg.querySelectorAll('rect'));
    const byFill = {};
    for (const r of rects) { const f = r.getAttribute('fill'); byFill[f] = (byFill[f] || 0) + 1; }
    return { rects: rects.length, byFill, dots: svg.querySelectorAll('circle').length,
             texts: svg.querySelectorAll('text').length };
  });
  assert(gantt.byFill['#2b36ff'] >= J.rowCount, `甘特图睡眠块应至少 ${J.rowCount} 条，实际 ${gantt.byFill['#2b36ff']}`);
  assert(gantt.byFill['#00d4ff'] === J.brightCount, `甘特图求光块应为 ${J.brightCount} 条，实际 ${gantt.byFill['#00d4ff']}`);
  assert(gantt.byFill['#9a6cff'] === J.avoidCount, `甘特图避光块应为 ${J.avoidCount} 条`);
  assert(gantt.dots >= 7, `甘特图上的 CBTmin 点太少：${gantt.dots}`);

  // 相位差曲线：两条线 + 计划那条必须最终落回 0 附近
  const misFig = await page.evaluate(() => {
    const svg = document.getElementById('fig-jet-mis');
    const paths = Array.from(svg.querySelectorAll('path')).filter((p) => (p.getAttribute('d') || '').length > 50);
    return { n: paths.length, texts: Array.from(svg.querySelectorAll('text')).map((t) => t.textContent) };
  });
  assert(misFig.n >= 2, '相位差图应有「计划」与「不干预」两条曲线');
  assert(misFig.texts.includes('本计划') && misFig.texts.includes('不干预'), '相位差图应标出两条曲线的名字');

  // CSV 与分享码
  const csv = await page.evaluate(() => window.CLApp.csv());
  assert(csv.split('\n').length === J.rowCount + 1, `CSV 应有表头 + ${J.rowCount} 行`);
  assert(csv.split('\n')[1].indexOf(J.dayRows[0].date) === 0, 'CSV 第一行应是计划首日');
  const code = await page.evaluate(() => window.CLApp.share());
  assert(/^[A-Za-z0-9_-]+$/.test(code), '分享码应是 URL 安全字符');
  const back = await page.evaluate((c) => window.CLApp.CL.codec.decodePlan(c), code);
  assert(back.from === IN.from && back.to === IN.to && back.depTime === IN.depTime && back.prepDays === String(IN.prep),
    '分享码应能原样解回输入：' + JSON.stringify(back));
  assert((await page.evaluate(() => location.hash)).indexOf('#p=') === 0, '分享后地址栏应带 #p= 分享码');

  // 换模型 / 换目的地 / 非法输入
  await page.selectOption('#jet-model', 'jewett99');
  await page.waitForTimeout(400);
  near(await num('#kpi-adapt-plan'), ORACLE.jet.jewett99.adaptPlan, 0, 'Jewett99 下的收敛天数');
  near(parseFloat((await text('#kpi-final')).split('/')[0]), ORACLE.jet.jewett99.finalPlan, 0.005, 'Jewett99 残余相位差');
  // Jewett99 的 CBTmin 要在 x 的极小值上再加 phi_ref = 0.8 h —— 相位差类读数对这个偏移天然不敏感，
  // 必须直接断 CBTmin 钟点，否则把 phi_ref 改成 0 也不会红（2026-09-19 改坏验证实测）。
  const jwRows = await page.$$eval('#jet-table tbody tr', (trs) => trs.map((tr) =>
    Array.from(tr.children).map((td) => td.textContent.trim())));
  assert(jwRows[jwRows.length - 1][5] === ORACLE.jet.jewett99.lastCbtClock,
    `Jewett99 末日 CBTmin 应为 ${ORACLE.jet.jewett99.lastCbtClock}，实际 ${jwRows[jwRows.length - 1][5]}`);
  assert((await text('#kpi-target')).indexOf(ORACLE.jet.jewett99.targetCbt) === 0,
    `Jewett99 目标 CBTmin 应为 ${ORACLE.jet.jewett99.targetCbt}`);
  await page.selectOption('#jet-model', 'forger99');
  await page.waitForTimeout(300);
  await page.selectOption('#jet-to', 'LHR');
  await page.waitForFunction((v) => document.getElementById('kpi-adapt-plan').textContent.indexOf(String(v)) >= 0,
    ORACLE.jetLHR.adapt, { timeout: 30000 });
  near(parseFloat((await text('#kpi-final')).split('/')[0]), ORACLE.jetLHR.final, 0.005, '换目的地后的残余相位差');
  await page.selectOption('#jet-to', 'SIN');          // 与出发地相同 ⇒ 必须报错
  await page.waitForTimeout(500);
  assert((await text('#jet-msg')).indexOf('⚠') === 0, '出发地与目的地相同应报错');
  await page.selectOption('#jet-to', IN.to);
  await page.waitForTimeout(600);
  await page.fill('#jet-home-wake', '23:45');          // 睡眠不足 3 小时
  await page.click('#jet-run');
  await page.waitForTimeout(200);
  assert((await text('#jet-msg')).indexOf('睡眠时长') > 0, '睡眠时长过短应报错');
  await fillJet();
  assert((await text('#jet-msg')) === '', '改回合法输入后错误提示应清空');

  // ───────── ③ 夜班 ─────────
  await showTab('shift');
  await page.waitForFunction(() => window.CLApp.shift, null, { timeout: 30000 });
  await page.selectOption('#shift-strategy', 'full');
  await page.waitForFunction(() => document.querySelectorAll('#shift-compare tbody tr').length === 3, null, { timeout: 30000 });
  near(await num('#kpi-wocl'), ORACLE.shift.full.wocl, 0.06, 'WOCL 工时占比（全套策略）');
  assert((await text('#kpi-shift-cbt')) === ORACLE.shift.full.lastCbt, `末班日 CBTmin 应为 ${ORACLE.shift.full.lastCbt}`);
  near(await num('#kpi-shift-move'), ORACLE.shift.full.move, 0.06, '夜班期间相位移动');
  const cmp = await page.$$eval('#shift-compare tbody tr', (trs) => trs.map((tr) =>
    Array.from(tr.children).map((td) => td.textContent.trim())));
  ['none', 'bright', 'full'].forEach((k, i) => {
    near(parseFloat(cmp[i][3]), ORACLE.shift[k].wocl, 0.06, `策略 ${k} 的 WOCL`);
    assert(cmp[i][1] === ORACLE.shift[k].lastCbt, `策略 ${k} 的末日 CBTmin 应为 ${ORACLE.shift[k].lastCbt}`);
  });
  assert(ORACLE.shift.none.wocl > ORACLE.shift.full.wocl, '不干预的 WOCL 应高于全套策略（oracle 自检）');
  assert(parseFloat(cmp[0][3]) > parseFloat(cmp[2][3]), '页面上：不干预的 WOCL 应明显高于全套策略');
  const shiftRows = await page.$$eval('#shift-table tbody tr', (t) => t.length);
  assert(shiftRows === ORACLE.shift.full.rowCount, `夜班逐日表应有 ${ORACLE.shift.full.rowCount} 行`);
  const shiftFig = await page.evaluate(() => {
    const svg = document.getElementById('fig-shift');
    return { rects: svg.querySelectorAll('rect').length, dots: svg.querySelectorAll('circle').length };
  });
  assert(shiftFig.dots >= 6, `夜班图上的 CBTmin 点太少：${shiftFig.dots}`);

  // ───────── ④ 光照剂量 ─────────
  await showTab('dose');
  await page.waitForFunction(() => document.querySelectorAll('#dose-table tbody tr').length === 4, null, { timeout: 30000 });
  const doseRows = await page.$$eval('#dose-table tbody tr', (trs) => trs.map((tr) =>
    Array.from(tr.children).map((td) => td.textContent.trim())));
  ORACLE.dose.forEach((d, i) => {
    assert(doseRows[i][0] === d.zh, `剂量表第 ${i + 1} 行名称`);
    near(parseFloat(doseRows[i][3]), d.luxHours, 0.5, `剂量表第 ${i + 1} 行 lux·小时`);
    near(parseFloat(doseRows[i][4]), d.first, 0.0006, `剂量表第 ${i + 1} 行第 1 天位移`);
    near(parseFloat(doseRows[i][5]), d.total, 0.006, `剂量表第 ${i + 1} 行 7 天稳态位移`);
  });
  const lh = doseRows.map((r) => parseFloat(r[3]));
  assert(lh.every((v) => Math.abs(v - lh[0]) < 0.5), '四种安排的 lux·小时必须完全相同（这正是这张表的论点）');
  assert(parseFloat(doseRows[0][5]) > 0 && parseFloat(doseRows[3][5]) < 0, '清晨应提前、夜里应延后');
  await page.fill('#dose-screen-h', '2');
  await page.fill('#dose-screen-lux', '80');
  await page.click('#dose-run');
  await page.waitForTimeout(600);
  near(await num('#kpi-screen-day'), ORACLE.screen.firstMin, 0.06, '睡前屏幕第一晚的分钟数');
  near(await num('#kpi-screen-total'), ORACLE.screen.total, 0.006, '睡前屏幕 7 天后的稳态位移');
  assert(ORACLE.screen.total < 0 && (await text('#kpi-screen-total')).indexOf('延后') > 0,
    '睡前屏幕相对昏暗对照必须是相位延后');
  const alphaFig = await page.evaluate(() => {
    const svg = document.getElementById('fig-dose-alpha');
    return { paths: Array.from(svg.querySelectorAll('path')).filter((p) => (p.getAttribute('d') || '').length > 80).length,
             labels: Array.from(svg.querySelectorAll('text')).map((t) => t.textContent) };
  });
  assert(alphaFig.paths >= 3, '饱和曲线图应有三条模型曲线');
  ['Forger99', 'Jewett99', 'Hannay19'].forEach((m) => assert(alphaFig.labels.includes(m), `曲线 ${m} 应有标注`));

  // ───────── ⑤ 模型仿真 ─────────
  await showTab('sim');
  await page.waitForFunction(() => window.CLApp.sim, null, { timeout: 30000 });
  const S = ORACLE.sim.forger99;
  near(await num('#kpi-tau'), S.tau, 0.0006, '全黑自由运转周期 τ');
  near(await num('#kpi-ncbt'), S.nCbt, 0, 'CBTmin 个数');
  near(await num('#kpi-spacing'), S.lastSpacing, 0.0006, '最后两次 CBTmin 间隔（自由运转段）');
  near(await num('#kpi-amp'), S.lastAmp, 0.0006, '末刻振幅');
  assert(Math.abs(S.lastSpacing - S.tau) < 0.01, '自由运转段的间隔应等于 τ（oracle 自检）');
  assert(Math.abs(S.entrainedSpacing - 24) < 0.1, '牵引段的间隔应接近 24 h（oracle 自检）');
  const simRows = await page.$$eval('#sim-table tbody tr', (trs) => trs.map((tr) =>
    Array.from(tr.children).map((td) => td.textContent.trim())));
  assert(simRows.length === S.nCbt, `标记表应有 ${S.nCbt} 行`);
  near(parseFloat(simRows[0][1]), S.firstCbt, 0.005, '第 1 个 CBTmin 时刻');
  near(parseFloat(simRows[simRows.length - 1][1]), S.lastCbt, 0.005, '最后一个 CBTmin 时刻');
  assert(simRows[simRows.length - 1][2] === S.lastCbtClock, `最后一个 CBTmin 钟点应为 ${S.lastCbtClock}`);
  near(parseFloat(simRows[4][4]), S.entrainedSpacing, 0.005, '牵引段的 CBTmin 间隔');
  await page.selectOption('#sim-model', 'hannay19');
  await page.click('#sim-run');
  await page.waitForTimeout(700);
  near(await num('#kpi-tau'), ORACLE.sim.hannay19.tau, 0.0006, 'Hannay19 的 τ');
  await page.selectOption('#sim-model', 'forger99');
  await page.click('#sim-run');
  await page.waitForTimeout(700);
  const phaseFig = await page.evaluate(() => {
    const svg = document.getElementById('fig-sim-phase');
    const ps = Array.from(svg.querySelectorAll('path')).filter((p) => (p.getAttribute('d') || '').length > 200);
    return ps.length;
  });
  assert(phaseFig >= 2, '相平面图应有「前两天」与「之后」两条轨迹');

  // ───────── ⑥ 相位响应曲线 ─────────
  await showTab('prc');
  await page.waitForFunction(() => window.CLApp.prc, null, { timeout: 60000 });
  await page.fill('#prc-n', '18');
  await page.fill('#prc-dur', '1');
  await page.fill('#prc-lux', '10000');
  await page.fill('#prc-cycles', '1');
  await page.click('#prc-run');
  await page.waitForTimeout(1200);
  await page.waitForFunction((n) => window.CLApp.prc && window.CLApp.prc.points.length === n, 18, { timeout: 60000 });
  const P1 = ORACLE.prc.single;
  near(await num('#kpi-prc-adv'), P1.maxAdv, 0.006, 'PRC 最大提前');
  near(await num('#kpi-prc-del'), P1.maxDel, 0.006, 'PRC 最大延后');
  near(await num('#kpi-prc-pp'), P1.pp, 0.006, 'PRC 峰峰值');
  assert((await text('#kpi-prc-type')).indexOf('Type 1') === 0, '单次 1 小时脉冲应判为 Type 1 弱重置');
  const prcPts = await page.evaluate(() => window.CLApp.prc.points.map((q) => [q.phase, q.shift]));
  assert(prcPts.filter((q) => q.phase).length >= 0 && prcPts.length === 18, 'PRC 采样点数');
  assert(prcPts.find((q) => Math.abs(q[0] - 1.3333) < 0.4)[1] > 0, 'CBTmin 之后的脉冲必须是相位提前');
  assert(prcPts.find((q) => Math.abs(q[0] - 20) < 0.7)[1] < 0, 'CBTmin 之前（相位 20 h）的脉冲必须是相位延后');
  await page.click('#prc-strong');
  await page.waitForTimeout(1500);
  await page.waitForFunction(() => window.CLApp.prc && window.CLApp.prc.cycles === 3, null, { timeout: 90000 });
  const P3 = ORACLE.prc.strong;
  near(await num('#kpi-prc-pp'), P3.pp, 0.01, '三周期强刺激的峰峰值');
  near(await num('#kpi-prc-amp'), P3.ampRatio, 0.06, '三周期强刺激把振幅压到的百分比');
  assert(P3.pp > P1.pp * 2 && P3.ampRatio < 80, '三周期强刺激应显著放大位移并压低振幅（oracle 自检）');
  assert((await text('#kpi-prc-type')).indexOf('强重置') === 0, '三周期强刺激应判为强重置');

  // ───────── ⑦ 说明页：参数表、能力清单、公布的验证数字 ─────────
  await showTab('about');
  const params = await page.$$eval('#about-params tbody tr', (trs) => trs.map((tr) =>
    Array.from(tr.children).map((td) => td.textContent.trim())));
  assert(params.length >= 18, `参数表行数太少：${params.length}`);
  const taux = params.find((r) => r[0] === 'taux');
  assert(taux && taux[1] === '24.2' && taux[2] === '24.2', 'τx 参数应为 24.2');
  const validTxt = await page.$eval('#about-valid', (e) => e.textContent);
  assert(validTxt.indexOf(String(ORACLE.offline.scalars)) >= 0,
    `说明页公布的对拍标量点数应为 ${ORACLE.offline.scalars}（离线套件实测），实际文本：${validTxt.slice(0, 200)}`);
  assert(validTxt.indexOf(String(ORACLE.offline.pass)) >= 0, `说明页公布的离线断言条数应为 ${ORACLE.offline.pass}`);
  assert(validTxt.indexOf(String(ORACLE.offline.cases)) >= 0, `说明页公布的算例数应为 ${ORACLE.offline.cases}`);

  // 能力清单：逐项现场验证，不许有「广告了但不存在」的条目
  const caps = await page.$$eval('#cap-list [data-cap]', (es) => es.map((e) => e.getAttribute('data-cap')));
  assert(caps.length >= 20, `能力清单条目太少：${caps.length}`);
  const seen = await page.evaluate(() => {
    const CL = window.CLApp.CL, A = window.CLApp, out = {};
    const city = CL.city('SIN'), dest = CL.city('NRT');
    const base = {
      home: city, dest: dest, depart: { y: 2026, mo: 10, d: 12, h: 9, mi: 0 },
      arrive: { y: 2026, mo: 10, d: 12, h: 17, mi: 30 }, homeSleep: 23.5, homeWake: 7.5,
      destSleep: 23.5, destWake: 7.5, prepDays: 1, planDays: 3, dt: 0.1,
    };
    for (const m of ['forger99', 'jewett99', 'hannay19']) {
      const tr = CL.simulate({ model: m, t0: 0, tEnd: 48, dt: 0.1, lightFn: () => 500 });
      out['model-' + m] = isFinite(tr.states[tr.n * tr.ns - 1]);
    }
    const P = CL.plan.planJetLag(Object.assign({ model: 'forger99' }, base));
    const B = CL.plan.planJetLag(Object.assign({ model: 'forger99', optimize: false }, base));
    out['jetlag-plan'] = P.rows.some((r) => r.bright);
    out['jetlag-baseline'] = B.rows.every((r) => !r.bright && !r.avoid);
    out['jetlag-prep'] = P.rows[0].kind === 'prep' && P.rows[0].sleeps.length > 0;
    out['jetlag-inflight'] = CL.plan.planJetLag(Object.assign({ model: 'forger99' }, base, {
      dest: CL.city('LHR'), arrive: { y: 2026, mo: 10, d: 12, h: 18, mi: 0 },
    })).rows.some((r) => r.kind === 'travel' && r.sleeps.length >= 2);
    const PD = CL.plan.planJetLag(Object.assign({ model: 'forger99' }, base, { daylightOnly: true }));
    out['jetlag-daylight'] = PD.rows.filter((r) => r.bright).every((r) => r.sunrise == null
      || (r.bright.fromClock >= r.sunrise - 1e-9 && r.bright.toClock <= r.sunset + 1e-9));
    out['jetlag-csv'] = (A.csv() || '').split('\n').length > 3;
    out['jetlag-share'] = CL.codec.decodePlan(A.share()).from === document.getElementById('jet-from').value;
    const sw = CL.plan.shiftWork({ model: 'forger99', shiftStart: 23, shiftEnd: 7, daySleepStart: 8.5,
      sleepHours: 7, nights: 3, offDays: 1, strategy: 'full', dt: 0.1 });
    out['shift-wocl'] = sw.woclFraction > 0 && sw.woclFraction < 1;
    out['shift-strategies'] = document.querySelectorAll('#shift-compare tbody tr').length === 3;
    const lr = CL.plan.lightResponse('forger99', [10, 10000]);
    out['dose-saturation'] = lr[1].Bhat > lr[0].Bhat;
    out['dose-equal'] = document.querySelectorAll('#dose-table tbody tr').length === 4;
    out['dose-screen'] = /分钟/.test(document.getElementById('kpi-screen-day').textContent);
    out['sim-freerun'] = Math.abs(CL.freeRunPeriod('forger99', { days: 20, dt: 0.1 }) - 24.2) < 0.3;
    out['sim-limitcycle'] = document.querySelectorAll('#fig-sim-phase path').length >= 2;
    out['sim-markers'] = document.querySelectorAll('#sim-table tbody tr').length > 5;
    out['prc-curve'] = A.prc && A.prc.points.length >= 12;
    out['prc-cycles'] = A.prc && A.prc.cycles === 3;
    const se = CL.sun.events(city.lat, city.lon, Date.UTC(2026, 9, 12), city.tz);
    out['solar'] = se.sunrise > 5 && se.sunrise < 8 && se.sunset > 18;
    const win = CL.tz.offset('America/Los_Angeles', Date.UTC(2026, 0, 15));
    const sum = CL.tz.offset('America/Los_Angeles', Date.UTC(2026, 6, 15));
    out['tz-dst'] = (sum - win) === 1;
    out['storage'] = !!localStorage.getItem('circadian-lab-v1');
    return out;
  });
  const dead = caps.filter((c) => seen[c] !== true);
  assert(dead.length === 0, `能力清单里有 ${dead.length} 项没有被现场跑通：${dead.join(', ')}`);
  assert(Object.keys(seen).length === caps.length,
    `现场验证了 ${Object.keys(seen).length} 项，清单有 ${caps.length} 项 —— 两边必须一一对应`);

  // ───────── ⑧ 渲染守卫 ─────────
  // (a) 隐藏面板必须真的不显示（断计算样式，不是断 hidden 属性）
  const hiddenOk = await page.evaluate(() => {
    const out = [];
    for (const t of ['jet', 'shift', 'dose', 'sim', 'prc', 'about']) {
      const p = document.getElementById('pane-' + t);
      out.push([t, p.hidden, getComputedStyle(p).display]);
    }
    return out;
  });
  hiddenOk.forEach(([t, h, disp]) => {
    if (h) assert(disp === 'none', `页签 ${t} 标了 hidden 却仍在渲染（display=${disp}）`);
    else assert(disp !== 'none', `当前页签 ${t} 不应被藏起来`);
  });

  // (b) 控件最小尺寸：逐页签扫一遍（藏起来的面板量不到，必须先切过去）
  let controlCount = 0;
  for (const t of ['jet', 'shift', 'dose', 'sim', 'prc', 'about']) {
    await showTab(t);
    const bad = await page.evaluate((tab) => {
      const out = [];
      let n = 0;
      for (const e of document.querySelectorAll('#pane-' + tab + ' input, #pane-' + tab + ' select, #pane-' + tab + ' button')) {
        const r = e.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        n++;
        const isCheck = e.type === 'checkbox';
        const minW = isCheck ? 16 : (e.tagName === 'BUTTON' ? 52 : 100);
        if (r.width < minW || r.height < 18) out.push(`${e.id || e.tagName}:${r.width.toFixed(0)}×${r.height.toFixed(0)}`);
      }
      return { out, n };
    }, t);
    controlCount += bad.n;
    assert(bad.out.length === 0, `页签 ${t} 有控件被压扁：${bad.out.join(' / ')}`);
  }
  assert(controlCount >= 35, `扫到的控件数只有 ${controlCount}，守卫可能一个都没量到`);

  // (c) 窄屏不许横向溢出（逐视口 × 逐页签）
  for (const vw of [390, 768]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of ['jet', 'shift', 'dose', 'sim', 'prc', 'about']) {
      await showTab(t);
      await page.waitForTimeout(80);
      const info = await page.evaluate(() => {
        const d = document.documentElement;
        const over = d.scrollWidth - d.clientWidth;
        if (over <= 1) return { over };
        const bad = [];
        for (const e of document.querySelectorAll('*')) {
          const r = e.getBoundingClientRect();
          if (r.width > 0 && r.right > d.clientWidth + 1) bad.push(`${e.tagName}.${(e.className || '').toString().slice(0, 20)}@${r.right.toFixed(0)}`);
        }
        return { over, bad: bad.slice(0, 6) };
      });
      assert(info.over <= 1, `${vw}px 下页签 ${t} 横向溢出 ${info.over}px：${(info.bad || []).join(' / ')}`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });

  // (d) 标签大小写由 CSS 决定 ⇒ 断计算样式，不是断文本
  for (const t of ['jet', 'shift', 'dose', 'sim', 'prc', 'about']) {
    await showTab(t);
    const upper = await page.evaluate((tab) => {
      const out = [];
      for (const e of document.querySelectorAll('#pane-' + tab + ' th, #pane-' + tab + ' label, #pane-' + tab + ' dt')) {
        if (!e.getClientRects().length) continue;
        const tt = getComputedStyle(e).textTransform;
        if (tt !== 'none') out.push(`${e.textContent.slice(0, 12)}:${tt}`);
      }
      return out;
    }, t);
    assert(upper.length === 0, `页签 ${t} 里有标签被 text-transform 改写（单位符号会被写错）：${upper.join(' / ')}`);
  }

  // (e) 图上的文字两两不重叠，且都落在画布内
  await showTab('jet');
  const overlaps = await page.evaluate(() => {
    const bad = [];
    for (const svg of document.querySelectorAll('svg')) {
      const sr = svg.getBoundingClientRect();
      if (!sr.width) continue;
      // 用 getBoundingClientRect（已经算上 transform）：旋转过的轴标题在 getBBox 里
      // 拿到的是**未旋转**的盒子，会假报重叠与越界（2026-09-19 实撞）。
      const boxes = [];
      for (const t of svg.querySelectorAll('text')) {
        const b = t.getBoundingClientRect();
        if (!b.width || !b.height) continue;
        boxes.push({ b, s: t.textContent });
      }
      const pad = 1;
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i].b, c = boxes[j].b;
          if (a.left + pad < c.right - pad && c.left + pad < a.right - pad
            && a.top + pad < c.bottom - pad && c.top + pad < a.bottom - pad) {
            bad.push(`${svg.id}: “${boxes[i].s}” × “${boxes[j].s}”`);
          }
        }
      }
      for (const box of boxes) {
        if (box.b.left < sr.left - 1 || box.b.right > sr.right + 1
          || box.b.top < sr.top - 1 || box.b.bottom > sr.bottom + 1) {
          bad.push(`${svg.id}: “${box.s}” 越出画布`);
        }
      }
    }
    return bad;
  });
  assert(overlaps.length === 0, `图上文字重叠/越界：${overlaps.slice(0, 5).join(' | ')}`);

  // (f) 甘特图里每个条块都必须落在它那一行的行框内
  const escapes = await page.evaluate(() => {
    const svg = document.getElementById('fig-jet-gantt');
    const rects = Array.from(svg.querySelectorAll('rect'));
    const bgs = rects.filter((r) => r.getAttribute('fill') === '#141414').map((r) => ({
      x: +r.getAttribute('x'), y: +r.getAttribute('y'), w: +r.getAttribute('width'), h: +r.getAttribute('height'),
    }));
    const bad = [];
    for (const r of rects) {
      const f = r.getAttribute('fill');
      if (f === '#141414' || f === 'none') continue;
      const x = +r.getAttribute('x'), y = +r.getAttribute('y'), w = +r.getAttribute('width'), h = +r.getAttribute('height');
      const row = bgs.find((b) => Math.abs(b.y - y) < 0.5);
      if (!row) { bad.push(`fill=${f} 的块找不到对应行`); continue; }
      if (x < row.x - 0.5 || x + w > row.x + row.w + 0.5 || h > row.h + 0.5) bad.push(`fill=${f} 的块越出行框`);
    }
    return bad;
  });
  assert(escapes.length === 0, `甘特图有条块越出行框：${escapes.slice(0, 4).join(' | ')}`);

  // (g) 说明页的公式块不许横向撑破卡片
  await showTab('about');
  const eqOver = await page.$eval('#about-eq', (e) => e.scrollWidth - e.clientWidth);
  assert(eqOver <= 2, `说明页公式块横向溢出 ${eqOver}px（应把行写窄，别靠 overflow 兜底）`);

  // ───────── ⑨ 输入留存 ─────────
  await showTab('jet');
  await page.fill('#jet-prep', '3');
  await page.click('#jet-run');
  await page.waitForTimeout(300);
  // 先把地址栏里的分享码清掉：分享码的优先级**高于**本机留存（打开别人发来的链接就该看到他那份计划），
  // 留着它会把刚改的 prep 覆盖回分享时的值。
  await page.evaluate(() => history.replaceState(null, '', location.pathname));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.CLApp && window.CLApp.jet);
  assert(await page.$eval('#jet-prep', (e) => e.value) === '3', '输入应写进 localStorage 并在刷新后复原');
  await page.fill('#jet-prep', String(IN.prep));
  await page.click('#jet-run');
  await page.waitForTimeout(400);

  await showTab('jet');
  await page.waitForTimeout(200);
  await screenshot('thumb.png');
};
