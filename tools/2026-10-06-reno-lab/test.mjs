/* 装修用料工作台 · 集成测试
 *
 * 数值真值全部来自 oracle/truth.json（run 目录 oracle/scenarios.py：shapely/GEOS 逐砖求交、墙纸闭式与独立模拟、
 * 凑桶暴力枚举），由 inject-oracle.mjs 机械注入下面的 ORACLE 块 —— 本文件不手打任何计算结果。
 * 地板铺设没有第二份独立实现，按性质断言（每排各块之和 = 排长、★ 块数 = 图上余料块数、片数与箱数回代）。
 * 页面读数按显示精度比较（display-tolerance.mjs）；渲染守卫 import（render-guards.mjs）。
 */
import fs from 'node:fs';
import { renderGuards } from '/Users/lon/.agents/cron/daily-website/tools/render-guards.mjs';
import { makeDisplayCompare } from '/Users/lon/.agents/cron/daily-website/tools/display-tolerance.mjs';

const ORACLE = {
 "meta": {
  "tabs": [
   "room",
   "tile",
   "plank",
   "paper",
   "paint",
   "bom",
   "about"
  ],
  "source": "oracle/scenarios.py（shapely/GEOS 求交 · 闭式 · 独立模拟 · 暴力枚举）"
 },
 "rect": {
  "area": 15120000,
  "per": 15600,
  "wallg": 43680000,
  "walln": 39090000,
  "skirt": 14700,
  "walls": [
   4200,
   3600,
   4200,
   3600
  ]
 },
 "rectTile": {
  "full": 30,
  "cut": 12,
  "sliver": 0,
  "min": 588,
  "reuse": 42,
  "count": 42,
  "buy": 45,
  "boxes": 12,
  "grout": 1.2902400000000003,
  "glue": 75.6
 },
 "L": {
  "area": 28560000,
  "per": 23600,
  "wallg": 66080000,
  "walln": 57980000,
  "skirt": 21800,
  "walls": [
   6000,
   3200,
   2400,
   2600,
   3600,
   5800
  ]
 },
 "LTile": {
  "full": 65,
  "cut": 19,
  "sliver": 0,
  "min": 190,
  "reuse": 81,
  "count": 84,
  "buy": 86,
  "boxes": 22,
  "grout": 2.4371200000000006,
  "glue": 142.8
 },
 "LTile45": {
  "full": 61,
  "cut": 59,
  "sliver": 15,
  "min": 9.640687099999923,
  "reuse": 120,
  "count": 120,
  "buy": 126,
  "boxes": 42,
  "grout": 4.11264,
  "glue": 142.8
 },
 "LTile45opt": {
  "tw": 800,
  "th": 400,
  "gap": 3,
  "bond": 0.5,
  "angle": 45,
  "anchor": "center",
  "ox": 0,
  "oy": 0,
  "sliver": 80,
  "kerf": 3,
  "extra": 5,
  "perBox": 3,
  "depth": 8,
  "glue": 5,
  "reuse": false
 },
 "Lbest": {
  "ox": 0,
  "oy": 414,
  "min": 378,
  "count": 84,
  "baseMin": 190,
  "baseCount": 84
 },
 "Lpaper": {
  "strips": 47,
  "rolls": 16,
  "perRoll": 3,
  "cut": 2900
 },
 "LpaperHalf": {
  "strips": 45,
  "rolls": 15,
  "perRoll": null,
  "cut": 2700
 },
 "Lpaint": {
  "area": 86.54,
  "top": 18.1734,
  "pri": 7.57225,
  "topBest": {
   "cost": 867,
   "vol": 19,
   "n": 2
  },
  "priBest": {
   "cost": 396,
   "vol": 10,
   "n": 2
  },
  "cost": 1263
 },
 "Lpaint3": {
  "area": 57.98,
  "top": 18.2637,
  "topBest": {
   "cost": 867,
   "vol": 19,
   "n": 2
  }
 },
 "Lbom": {
  "total": 8470.6,
  "grout": 2.5,
  "glue": 143,
  "skirt": 21.8
 },
 "Lclosed": {
  "area": 25660000,
  "per": 22685.575587824864,
  "last": 5885.575587824865,
  "gapBefore": 1000
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const O = ORACLE;
  const T = O.meta.tabs;
  const { closeS } = makeDisplayCompare(page, assert);
  const txt = (sel) => page.$eval(sel, (e) => e.textContent.trim());
  const int = async (sel) => parseInt((await txt(sel)).replace(/,/g, ''), 10);
  const onTab = async (t) => {
    await page.click(`#rn-tab-${t}`);
    await page.waitForFunction((t) => !document.getElementById(`rn-pane-${t}`).hidden, t, { timeout: 10000 });
  };
  const disp = (sel) => page.$eval(sel, (e) => getComputedStyle(e).display);
  // 填一个输入框并等引擎重算（重算挂在 rAF 上）
  const setVal = async (sel, v) => {
    await page.fill(sel, String(v));
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  };
  const preset = async (k) => {
    await onTab('room');
    await page.selectOption('#rn-preset', k);
    await page.click('#rn-preset-go');
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  };

  await page.goto(toolURL);
  await page.evaluate(() => localStorage.clear());
  await page.goto(toolURL);
  await page.waitForSelector('#rn-k-area');
  assert(await page.$('a[href="../../"]'), '顶部应有返回工具集链接');

  // ── 1. 房间（默认矩形卧室） ──
  await page.waitForFunction(() => document.getElementById('rn-k-area').textContent !== '—', null, { timeout: 10000 });
  await closeS('#rn-k-area', O.rect.area / 1e6, '矩形地面面积');
  await closeS('#rn-k-per', O.rect.per / 1000, '矩形周长');
  await closeS('#rn-k-wallg', O.rect.wallg / 1e6, '墙面毛面积');
  await closeS('#rn-k-walln', O.rect.walln / 1e6, '墙面净面积');
  await closeS('#rn-k-skirt', O.rect.skirt / 1000, '踢脚线');
  await closeS('#rn-h-area', O.rect.area / 1e6, '主视觉地面面积');
  assert(await disp('#rn-room-msg') === 'none', '闭合房间不应显示错误条（计算样式）');
  let fig = await page.$eval('#rn-fig-room', (s) => ({ drawn: +s.dataset.drawn, dropped: +s.dataset.dropped,
    door: s.querySelectorAll('.rn-door').length, win: s.querySelectorAll('.rn-win').length, texts: [...s.querySelectorAll('text')].map((t) => t.textContent) }));
  assert(fig.drawn === O.rect.walls.length + 1 && fig.dropped === 0, `平面图应画出 ${O.rect.walls.length} 个墙标 + 面积，实得 ${fig.drawn}，丢 ${fig.dropped}`);
  assert(fig.door === 1 && fig.win === 1, `门窗图元 门${fig.door} 窗${fig.win}`);
  O.rect.walls.forEach((w, i) => assert(fig.texts.some((t) => t === `墙${i + 1} ${(w / 1000).toFixed(2)} m`), `缺墙标 墙${i + 1}：${fig.texts}`));

  // ── 2. 地砖（矩形，默认 600×600 直铺） ──
  await onTab('tile');
  const tileCheck = async (W, tag) => {
    assert(await int('#rn-t-full') === W.full, `${tag} 整砖 ${await txt('#rn-t-full')} vs ${W.full}`);
    assert(await int('#rn-t-cut') === W.cut, `${tag} 切砖 ${await txt('#rn-t-cut')} vs ${W.cut}`);
    assert(await int('#rn-t-sl') === W.sliver, `${tag} 窄条 ${await txt('#rn-t-sl')} vs ${W.sliver}`);
    await closeS('#rn-t-min', W.min, `${tag} 最窄切片`);
    assert(await int('#rn-t-reusen') === W.reuse, `${tag} 拼余料后 ${await txt('#rn-t-reusen')} vs ${W.reuse}`);
    assert(await int('#rn-t-buy') === W.buy, `${tag} 需购 ${await txt('#rn-t-buy')} vs ${W.buy}`);
    assert(await int('#rn-t-boxes') === W.boxes, `${tag} 箱数 ${await txt('#rn-t-boxes')} vs ${W.boxes}`);
    await closeS('#rn-t-grout', W.grout, `${tag} 填缝剂`);
    await closeS('#rn-t-glueKg', W.glue, `${tag} 瓷砖胶`);
    const g = await page.$eval('#rn-fig-tile', (s) => ({ full: s.querySelectorAll('.rn-tl-full').length,
      cut: s.querySelectorAll('.rn-tl-cut').length, sl: s.querySelectorAll('.rn-tl-sliver').length }));
    assert(g.full === W.full && g.cut + g.sl === W.cut && g.sl === W.sliver, `${tag} 排版图图元 ${JSON.stringify(g)}`);
    const listN = await page.$$eval('#rn-t-cuts tbody tr td:nth-child(3)', (ns) => ns.reduce((s, n) => s + +n.textContent, 0));
    assert(listN === W.cut, `${tag} 切片清单合计 ${listN} vs ${W.cut}`);
  };
  await tileCheck(O.rectTile, '矩形');
  assert(await disp('#rn-t-msg') === 'none', '无窄条时提示条应隐藏（计算样式）');
  // 几何：排版图里整砖多边形的屏幕尺寸应该是正方形（600×600 砖）
  const sq = await page.$eval('#rn-fig-tile .rn-tl-full', (p) => { const r = p.getBoundingClientRect(); return r.width / r.height; });
  assert(Math.abs(sq - 1) < 0.02, `整砖在图上应为正方形，宽高比 ${sq}`);

  // ── 3. L 形客餐厅 ──
  await preset('lshape');
  await closeS('#rn-k-area', O.L.area / 1e6, 'L 形面积');
  await closeS('#rn-k-per', O.L.per / 1000, 'L 形周长');
  await closeS('#rn-k-walln', O.L.walln / 1e6, 'L 形墙净面积');
  await closeS('#rn-k-skirt', O.L.skirt / 1000, 'L 形踢脚线（扣两扇门）');
  fig = await page.$eval('#rn-fig-room', (s) => ({ drawn: +s.dataset.drawn, dropped: +s.dataset.dropped, door: s.querySelectorAll('.rn-door').length }));
  assert(fig.drawn === 7 && fig.dropped === 0 && fig.door === 2, `L 形平面图 ${JSON.stringify(fig)}`);
  // 几何：墙标文字盒不许压到门窗图元上
  const hitOpen = await page.$eval('#rn-fig-room', (s) => {
    const ops = [...s.querySelectorAll('.rn-door,.rn-win')].map((l) => l.getBoundingClientRect());
    return [...s.querySelectorAll('text')].filter((t) => { const a = t.getBoundingClientRect();
      return ops.some((o) => a.left < o.right && o.left < a.right && a.top < o.bottom && o.top < a.bottom); }).map((t) => t.textContent);
  });
  assert(hitOpen.length === 0, `墙标压到门窗：${hitOpen}`);
  await onTab('tile');
  await tileCheck(O.LTile, 'L 形');
  // 自动找最佳起铺位置（oracle：shapely 逐砖求交上的同目标 16×16 网格搜索）
  await page.click('#rn-t-best');
  await page.waitForFunction(() => document.getElementById('rn-t-bestmsg').textContent.length > 0, null, { timeout: 10000 });
  assert(await page.inputValue('#rn-t-ox') === String(O.Lbest.ox) && await page.inputValue('#rn-t-oy') === String(O.Lbest.oy),
    `最佳偏移 ${await page.inputValue('#rn-t-ox')},${await page.inputValue('#rn-t-oy')} vs ${O.Lbest.ox},${O.Lbest.oy}`);
  await page.waitForFunction((v) => Math.abs(parseFloat(document.getElementById('rn-t-min').textContent.replace(/,/g, '')) - v) < 0.6, O.Lbest.min, { timeout: 10000 });
  await closeS('#rn-t-min', O.Lbest.min, '最佳起铺后最窄切片');
  const bm = await txt('#rn-t-bestmsg');
  assert(bm.includes(`${O.Lbest.baseMin} mm → ${O.Lbest.min} mm`) && bm.includes(`${O.Lbest.baseCount} → ${O.Lbest.count}`), `最佳提示 ${bm}`);
  await page.click('#rn-t-reset');
  await page.waitForFunction(() => document.getElementById('rn-t-ox').value === '0', null, { timeout: 10000 });
  // 斜铺 45°、800×400 工字铺、中心起铺、不拼余料
  const o45 = O.LTile45opt;
  await setVal('#rn-t-tw', o45.tw); await setVal('#rn-t-th', o45.th); await setVal('#rn-t-gap', o45.gap);
  await page.selectOption('#rn-t-bond', String(o45.bond)); await setVal('#rn-t-angle', o45.angle);
  await page.selectOption('#rn-t-anchor', o45.anchor); await setVal('#rn-t-sliver', o45.sliver);
  await page.uncheck('#rn-t-reuse'); await setVal('#rn-t-box', o45.perBox);
  await page.waitForFunction((n) => document.getElementById('rn-t-full').textContent === String(n), O.LTile45.full, { timeout: 10000 });
  await tileCheck(O.LTile45, 'L 形 45°');
  assert(await disp('#rn-t-msg') !== 'none' && (await txt('#rn-t-msg')).includes(`${O.LTile45.sliver} 片`), '有窄条时应显示提示');
  await page.screenshot({ path: '/tmp/reno-lab-tile45.png' });
  // 非法输入：砖长写成字母 → 标坏、结果不变
  await setVal('#rn-t-tw', 'abc');
  assert(await page.$eval('#rn-t-tw', (e) => e.classList.contains('rn-bad') && e.getAttribute('aria-invalid') === 'true'), '非法砖长应标坏');
  assert(await int('#rn-t-full') === O.LTile45.full, '非法输入不应改动结果');
  // 恢复默认砖
  await setVal('#rn-t-tw', 600); await setVal('#rn-t-th', 600); await setVal('#rn-t-gap', 2);
  await page.selectOption('#rn-t-bond', '0'); await setVal('#rn-t-angle', 0); await page.selectOption('#rn-t-anchor', 'corner');
  await setVal('#rn-t-sliver', 60); await page.check('#rn-t-reuse'); await setVal('#rn-t-box', 4);
  await page.waitForFunction((n) => document.getElementById('rn-t-full').textContent === String(n), O.LTile.full, { timeout: 10000 });
  await tileCheck(O.LTile, 'L 形（恢复）');

  // ── 4. 木地板（性质断言） ──
  const plankCheck = async (tag) => {
    await onTab('plank');
    const rows = await page.$$eval('#rn-p-table tbody tr', (trs) => trs.map((tr) => {
      const td = tr.querySelectorAll('td');
      return { row: +td[0].textContent, len: +td[1].textContent.replace(/,/g, ''), parts: td[2].textContent.replace(/（.*）/, '').split(' + ').map((x) => x.trim()) };
    }));
    assert(rows.length > 10, `${tag} 逐排表行数 ${rows.length}`);
    let stars = 0, bad = [];
    rows.forEach((r) => {
      const sum = r.parts.reduce((s, x) => s + +x.replace(/[,★]/g, ''), 0);
      stars += r.parts.filter((x) => x.endsWith('★')).length;
      if (Math.abs(sum - r.len) > r.parts.length) bad.push(`${r.row}:${sum}≠${r.len}`); // 每块四舍五入到 mm，容差 = 块数
    });
    assert(bad.length === 0, `${tag} 各块之和应等于排长：${bad.slice(0, 5)}`);
    const fig = await page.$eval('#rn-fig-plank', (s) => ({ n: +s.dataset.n, dark: [...s.querySelectorAll('.rn-pk')].filter((p) => p.getAttribute('fill') === '#4b4b4b').length }));
    const pieces = rows.reduce((s, r) => s + r.parts.length, 0);
    assert(fig.n === pieces && fig.dark === stars, `${tag} 图上 ${fig.n} 块/余料 ${fig.dark} vs 表 ${pieces}/${stars}`);
    const n = await int('#rn-p-n'), buy = await int('#rn-p-buy'), boxes = await int('#rn-p-boxes');
    assert(buy === Math.ceil(n * 1.05 - 1e-9) && boxes === Math.ceil(buy / 8 - 1e-9), `${tag} 片数/箱数回代 ${n}/${buy}/${boxes}`);
    const distinct = new Set(rows.map((r) => r.row)).size;
    assert(await int('#rn-p-rows') === distinct, `${tag} 排数`);
    // 每排都铺满到最宽处：排长 ≤ 包围盒宽 − 2×伸缩缝
    return { n, stars, pieces };
  };
  const p0 = await plankCheck('地板顺铺');
  assert(await disp('#rn-p-msg') === 'none', 'L 形默认参数应能满足错缝（提示条隐藏）');
  await page.selectOption('#rn-p-dir', '90');
  await page.waitForFunction((n) => +document.querySelector('#rn-fig-plank').dataset.n !== n, p0.pieces, { timeout: 10000 });
  await plankCheck('地板横铺');
  await page.selectOption('#rn-p-dir', '0');

  // ── 5. 墙纸 ──
  await onTab('paper');
  assert(await int('#rn-w-strips') === O.Lpaper.strips, `幅数 ${await txt('#rn-w-strips')} vs ${O.Lpaper.strips}`);
  assert(await int('#rn-w-cut') === O.Lpaper.cut, '每幅裁长');
  assert(await int('#rn-w-per') === O.Lpaper.perRoll, `每卷幅数 ${await txt('#rn-w-per')} vs ${O.Lpaper.perRoll}`);
  assert(await int('#rn-w-buy') === O.Lpaper.rolls + 1, `需购卷数 ${await txt('#rn-w-buy')} vs ${O.Lpaper.rolls}+1`);
  const wsum = await page.$$eval('#rn-w-table tbody td:nth-child(3)', (ns) => ns.reduce((s, n) => s + +n.textContent, 0));
  assert(wsum === O.Lpaper.strips, `逐面墙幅数合计 ${wsum}`);
  let pf = await page.$eval('#rn-fig-paper', (s) => ({ strips: s.querySelectorAll('.rn-strip').length, dropped: +s.dataset.dropped }));
  assert(pf.dropped === 0 && pf.strips >= 1, `裁幅图 ${JSON.stringify(pf)}`);
  // 几何：每一幅都必须落在它那一卷的灰条里（裁到卷外 = 卷长不够还硬裁）
  const outRoll = await page.$eval('#rn-fig-paper', (s) => {
    const rolls = [...s.querySelectorAll('rect:not(.rn-strip)')].map((r) => r.getBoundingClientRect());
    return [...s.querySelectorAll('.rn-strip')].filter((st) => {
      const b = st.getBoundingClientRect();
      return !rolls.some((r) => b.left >= r.left - 0.5 && b.right <= r.right + 0.5 && b.top >= r.top - 0.5 && b.bottom <= r.bottom + 0.5);
    }).length;
  });
  assert(outRoll === 0, `有 ${outRoll} 幅画到了卷外`);
  await page.selectOption('#rn-w-match', 'half'); await setVal('#rn-w-rep', 530); await setVal('#rn-w-h', 2600);
  await page.selectOption('#rn-w-mode', 'loop');
  await page.waitForFunction((n) => document.getElementById('rn-w-strips').textContent === String(n), O.LpaperHalf.strips, { timeout: 10000 });
  assert(await int('#rn-w-buy') === O.LpaperHalf.rolls + 1, `跌落对花卷数 ${await txt('#rn-w-buy')} vs ${O.LpaperHalf.rolls}+1`);
  assert(await int('#rn-w-cut') === O.LpaperHalf.cut, '跌落对花幅长');
  await setVal('#rn-w-rl', 2000);
  await page.waitForFunction(() => getComputedStyle(document.getElementById('rn-w-msg')).display !== 'none', null, { timeout: 10000 });
  assert((await txt('#rn-w-buy')) === '—' && (await txt('#rn-w-msg')).includes('卷长'), '卷长不足要报错');
  await setVal('#rn-w-rl', 10050); await page.selectOption('#rn-w-match', 'straight'); await setVal('#rn-w-rep', 640);
  await setVal('#rn-w-h', ''); await page.selectOption('#rn-w-mode', 'wall');
  await page.waitForFunction((n) => document.getElementById('rn-w-strips').textContent === String(n), O.Lpaper.strips, { timeout: 10000 });

  // ── 6. 涂料（默认） ──
  await onTab('paint');
  await closeS('#rn-c-area', O.Lpaint.area, '涂刷面积');
  await closeS('#rn-c-topL', O.Lpaint.top, '面漆升数');
  await closeS('#rn-c-priL', O.Lpaint.pri, '底漆升数');
  await closeS('#rn-c-cost', O.Lpaint.cost, '涂料合计');
  const combo = await txt('#rn-c-combo');
  assert(combo.includes(`${O.Lpaint.topBest.vol.toFixed(1)} L`) && combo.includes(`¥${O.Lpaint.topBest.cost}`), `面漆组合 ${combo}`);
  const alt = await page.$$eval('#rn-c-alt tbody tr', (trs) => trs.map((tr) => +tr.cells[4].textContent.replace(/,/g, '')));
  assert(alt.length === 3 && alt.every((d) => d >= 0) && Math.min(...alt) >= 0, `单规格对比都不应比最优便宜：${alt}`);

  // ── 7. 采购清单 ──
  await onTab('bom');
  await closeS('#rn-bom-total', O.Lbom.total, '采购合计');
  await closeS('#rn-h-cost', O.Lbom.total, '主视觉预算');
  const tileSub = +(await page.$eval('#rn-bom tr[data-k="tile"] .rn-bsub', (e) => e.textContent)).replace(/,/g, '');
  await page.uncheck('#rn-bom tr[data-k="tile"] .rn-bon');
  await page.waitForFunction(() => document.querySelector('#rn-bom tr[data-k="tile"] .rn-bsub').textContent === '—', null, { timeout: 10000 });
  await closeS('#rn-bom-total', O.Lbom.total - tileSub, '取消地砖后合计');
  await page.check('#rn-bom tr[data-k="tile"] .rn-bon');
  await page.waitForFunction(() => document.querySelector('#rn-bom tr[data-k="tile"] .rn-bsub').textContent !== '—', null, { timeout: 10000 });
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#rn-csv')]);
  const csv = fs.readFileSync(await dl.path(), 'utf8');
  const last = csv.trim().split('\n').pop().split(',');
  assert(last[0] === '合计' && Math.abs(+last[4] - O.Lbom.total) < 0.01, `CSV 合计行 ${last}`);
  assert(csv.includes('"踢脚线",' + O.Lbom.skirt + ',m'), 'CSV 应含踢脚线数量');

  // ── 8. 涂料改参数：3 遍、不刷顶、不刷底漆、加 2.5 L 规格 ──
  await onTab('paint');
  await setVal('#rn-c-coats', 3); await page.uncheck('#rn-c-ceil'); await page.uncheck('#rn-c-primer');
  await page.click('#rn-c-add');
  await page.waitForFunction(() => document.querySelectorAll('#rn-c-cans tbody tr').length === 4, null, { timeout: 10000 });
  await closeS('#rn-c-area', O.Lpaint3.area, '只刷墙面积');
  await closeS('#rn-c-cost', O.Lpaint3.topBest.cost, '加 2.5L 后最低价');
  assert((await txt('#rn-c-priL')) === '—' && (await txt('#rn-c-pcombo')) === '不刷底漆', '关掉底漆');

  // ── 9. 房间非法输入 / 不闭合 / 自动补齐 ──
  await onTab('room');
  const wl = page.locator('#rn-walls .rn-wl').first();
  await wl.fill('abc');
  assert(await wl.evaluate((e) => e.classList.contains('rn-bad')), '非法墙长应标坏');
  await closeS('#rn-k-area', O.L.area / 1e6, '非法输入不改面积');
  await wl.fill('5000');
  await page.waitForFunction(() => getComputedStyle(document.getElementById('rn-room-msg')).display !== 'none', null, { timeout: 10000 });
  assert((await txt('#rn-room-msg')).includes(`还差 ${O.Lclosed.gapBefore} mm`) && (await txt('#rn-k-area')) === '—', `不闭合提示 ${await txt('#rn-room-msg')}`);
  await onTab('tile');
  assert((await txt('#rn-t-msg')).includes('房间尺寸有误'), '地砖页应提示回房间页修正');
  await onTab('room');
  await page.click('#rn-wall-close');
  await page.waitForFunction(() => getComputedStyle(document.getElementById('rn-room-msg')).display === 'none', null, { timeout: 10000 });
  await closeS('#rn-k-area', O.Lclosed.area / 1e6, '补齐后面积');
  await closeS('#rn-k-per', O.Lclosed.per / 1000, '补齐后周长');
  const lastLen = +(await page.locator('#rn-walls .rn-wl').last().inputValue());
  assert(Math.abs(lastLen - O.Lclosed.last) < 1e-5, `补齐的最后一面墙 ${lastLen} vs ${O.Lclosed.last}`);

  // ── 10. 方案保存 / 刷新 / 载入 ──
  await preset('lshape');
  await page.fill('#rn-pname', '测试客厅');
  await page.click('#rn-save');
  await preset('rect');
  await page.reload();
  await page.waitForFunction(() => document.getElementById('rn-k-area').textContent !== '—', null, { timeout: 10000 });
  await closeS('#rn-k-area', O.rect.area / 1e6, '刷新后保留当前房间');
  await onTab('bom');
  const names = await page.$$eval('#rn-projs tbody td:first-child', (ns) => ns.map((n) => n.textContent));
  assert(names.includes('测试客厅'), `方案列表 ${names}`);
  assert(await disp('#rn-projs-empty') === 'none', '有方案时空提示应隐藏');
  await page.click('#rn-projs tbody tr:first-child .rn-pload');
  await page.waitForFunction((a) => document.getElementById('rn-h-area').textContent === a, (O.L.area / 1e6).toFixed(2), { timeout: 10000 });
  assert(await page.inputValue('#rn-pname') === '测试客厅', '载入后方案名');

  // ── 11. 键盘：页签方向键 ──
  await page.focus('#rn-tab-bom');
  await page.keyboard.press('ArrowRight');
  assert(await page.$eval('#rn-tab-about', (e) => e.getAttribute('aria-selected') === 'true' && document.activeElement === e), '→ 应切到说明页');
  await page.keyboard.press('Home');
  assert(await page.$eval('#rn-tab-room', (e) => e.getAttribute('aria-selected') === 'true'), 'Home 应回到房间页');

  // ── 12. 渲染守卫（逐页签 × 逐视口） ──
  const n = await renderGuards(page, {
    assert, tabs: T, onTab,
    paneSel: (t) => `#rn-pane-${t}`, panesRoot: '#rn-panes',
    figSel: (t) => `#rn-pane-${t} svg.rn-fig`, cardSel: '.rn-card', childSel: 'svg,table,dl,h2,h3,.rn-row-btns',
    minControls: 70, minTextsInFig: 0,
  });
  assert(n >= 70, `应扫到 ≥70 个可见控件，实得 ${n}`);
  // 窄格逃逸：KPI 卡里的数值不许越出卡片
  for (const vw of [390, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of ['room', 'tile', 'plank', 'paper', 'paint']) {
      await onTab(t);
      const esc = await page.$$eval(`#rn-pane-${t} .rn-kpi`, (ks) => ks.filter((k) => {
        const b = k.getBoundingClientRect(), d = k.querySelector('dd').getBoundingClientRect();
        return d.right > b.right + 1 || d.left < b.left - 1;
      }).length);
      assert(esc === 0, `视口 ${vw} 页签 ${t} 有 ${esc} 个 KPI 数值越出卡片`);
    }
  }
  // 窄屏平面图文字不能被缩成蚂蚁字：渲染后的字高 ≥ 9px
  await page.setViewportSize({ width: 390, height: 900 });
  await onTab('room');
  const minH = await page.$$eval('#rn-fig-room text', (ts) => Math.min(...ts.map((t) => t.getBoundingClientRect().height)));
  assert(minH >= 9, `390px 下平面图最小字高 ${minH}`);
  await page.setViewportSize({ width: 1280, height: 850 });

  // 人工看图用：房间与墙纸
  await onTab('room');
  await page.locator('#rn-pane-room .rn-figwrap').screenshot({ path: '/tmp/reno-lab-room.png' });
  await onTab('paper');
  await page.locator('#rn-pane-paper .rn-figwrap').screenshot({ path: '/tmp/reno-lab-paper.png' });
  // 缩略图：L 形最佳起铺
  await onTab('tile');
  await page.click('#rn-t-best');
  await page.waitForFunction(() => document.getElementById('rn-t-bestmsg').textContent.length > 0, null, { timeout: 10000 });
  await page.evaluate(() => window.scrollTo(0, document.querySelector('.rn-tabs').getBoundingClientRect().top + scrollY - 16));
  await screenshot('thumb.png');
};
