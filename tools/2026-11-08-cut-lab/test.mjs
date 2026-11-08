// 下料优化工作台 · 集成测试（真实 Chromium）
// 真值：ORACLE 由 run 目录 truth/gen_truth.py 现场生成后用 inject-oracle.mjs 机械注入（不手抄）——
//   一维：枚举全部切法 + OR-Tools CP-SAT 整数规划求精确最优（含锯缝 / 修边 / 多原料 / 单价 / 有限库存 / 余料成本 0）；
//   二维：独立公式算膨胀面积下界与大件互斥界，并用 CP-SAT（非一刀切 NoOverlap2D + 旋转 + 锯缝膨胀）判定下界张数可行。
// 页面结果一律用本文件里**不经过页面引擎**的代码复核：一维逐根长度 / 锯缝 / 数量 / 库存；二维越界、锯缝间距、
//   旋转与纹理、数量、库存、一刀切递归可分；并把 cuts 按刀序在矩形上真的「切」一遍（刀必须整刀贯穿当前块、不穿过零件）。
import fs from 'node:fs'
import { renderGuards, guardBoxOverlap } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const ORACLE = {
 "meta": {
  "by": "truth/gen_truth.py (CP-SAT 9.15.6755)"
 },
 "win": {
  "status": "ok",
  "obj": 60000,
  "nBarsAtOpt": 10,
  "byStockAtOpt": [
   10
  ],
  "patterns": 686,
  "totalPieceLen": 57240
 },
 "custom": {
  "status": "ok",
  "obj": 4,
  "nBarsAtOpt": 4,
  "byStockAtOpt": [
   4,
   0
  ],
  "patterns": 648
 },
 "rebar": {
  "status": "ok",
  "obj": 1111.6,
  "nBarsAtOpt": 29,
  "byStockAtOpt": [
   19,
   10
  ],
  "patterns": 286
 },
 "stud": {
  "status": "ok",
  "obj": 80000,
  "nBarsAtOpt": 20,
  "byStockAtOpt": [
   20
  ],
  "patterns": 34
 },
 "studRem": {
  "status": "ok",
  "obj": 68000,
  "nBarsAtOpt": 22,
  "byStockAtOpt": [
   17,
   3,
   2
  ],
  "patterns": 47
 },
 "exact": {
  "status": "ok",
  "obj": 2000,
  "nBarsAtOpt": 2,
  "byStockAtOpt": [
   2
  ],
  "patterns": 3
 },
 "mixA": {
  "status": "ok",
  "obj": 1264.3,
  "nBarsAtOpt": 17,
  "byStockAtOpt": [
   11,
   0,
   6
  ],
  "patterns": 131
 },
 "mixB": {
  "status": "ok",
  "obj": 1444.2,
  "nBarsAtOpt": 28,
  "byStockAtOpt": [
   0,
   10,
   18
  ],
  "patterns": 69
 },
 "infeasible": {
  "status": "infeasible"
 },
 "shelf": {
  "lb": 2,
  "lbArea": 2,
  "lbBig": 0,
  "fitsLB": "OPTIMAL",
  "partsArea": 5203320,
  "nParts": 15,
  "bandLen": 20416
 },
 "acrylic": {
  "lb": 4,
  "lbArea": 4,
  "lbBig": 0,
  "fitsLB": "OPTIMAL",
  "nParts": 32
 },
 "shelfRem": {
  "lbNew": 2
 }
};

const EPS = 1e-6

// ───────── 独立校验（不调用页面引擎） ─────────
function check1(inp, res) {
  const errs = []
  const made = inp.pieces.map(() => 0), used = inp.stocks.map(() => 0)
  res.bars.forEach((b, i) => {
    const s = inp.stocks[b.stock]
    used[b.stock]++
    let sum = 0
    for (const p of b.pieces) { sum += p.len; made[p.src]++; if (Math.abs(inp.pieces[p.src].len - p.len) > EPS) errs.push(`根${i + 1} 零件长度错`) }
    const need = sum + Math.max(0, b.pieces.length - 1) * inp.kerf + inp.trim
    if (need > s.len + EPS) errs.push(`根${i + 1} 超长 ${need} > ${s.len}`)
    const rem = s.len - inp.trim - sum - (b.pieces.length - 1) * inp.kerf
    const off = rem > EPS ? Math.max(0, rem - inp.kerf) : 0
    if (Math.abs(off - b.offcut) > 1e-6) errs.push(`根${i + 1} 余料应 ${off} 实为 ${b.offcut}`)
    const reu = off > 0 && inp.minRemnant > 0 && off >= inp.minRemnant - 1e-9
    if (reu !== !!b.reusable) errs.push(`根${i + 1} 余料 ${off} 可用标记应为 ${reu}`)
  })
  made.forEach((m, i) => { if (m !== inp.pieces[i].qty) errs.push(`零件${i} 应 ${inp.pieces[i].qty} 实 ${m}`) })
  used.forEach((u, k) => { const q = inp.stocks[k].qty; if (q !== Infinity && q != null && u > q) errs.push(`原料${k} 超库存`) })
  return errs
}
function sepOK(a, b, k) {
  return a.x + a.w + k <= b.x + EPS || b.x + b.w + k <= a.x + EPS || a.y + a.h + k <= b.y + EPS || b.y + b.h + k <= a.y + EPS
}
function guil(R, k) {
  if (R.length <= 1) return true
  for (const dim of ['x', 'y']) {
    const sz = dim === 'x' ? 'w' : 'h'
    const cuts = [...new Set(R.map((p) => p[dim] + p[sz]))]
    for (const c of cuts) {
      const A = R.filter((p) => p[dim] + p[sz] <= c + EPS), B = R.filter((p) => p[dim] + p[sz] > c + EPS)
      if (A.length && B.length && B.every((p) => p[dim] >= c + k - EPS)) return guil(A, k) && guil(B, k)
    }
  }
  return false
}
function check2(inp, res) {
  const errs = [], made = inp.parts.map(() => 0), used = inp.sheets.map(() => 0)
  res.sheets.forEach((o, si) => {
    const s = inp.sheets[o.sheet]
    used[o.sheet]++
    if (Math.abs(o.L - s.l) > EPS || Math.abs(o.W - s.w) > EPS) errs.push(`板${si} 尺寸错`)
    o.placements.forEach((p) => {
      const pt = inp.parts[p.part]
      made[p.part]++
      const w = p.rot ? pt.w : pt.l, h = p.rot ? pt.l : pt.w
      if (Math.abs(w - p.w) > EPS || Math.abs(h - p.h) > EPS) errs.push(`板${si} #${p.no} 尺寸错`)
      if (p.rot && (inp.rotate === false || (pt.grain && s.grain))) errs.push(`板${si} #${p.no} 不该旋转`)
      if (p.x < inp.trim - EPS || p.y < inp.trim - EPS || p.x + p.w > s.l - inp.trim + EPS || p.y + p.h > s.w - inp.trim + EPS) errs.push(`板${si} #${p.no} 越界`)
    })
    const R = o.placements
    for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) if (!sepOK(R[i], R[j], inp.kerf)) errs.push(`板${si} #${R[i].no}×#${R[j].no} 间距 < 锯缝`)
    if (res.mode === 'guillotine' && !guil(R, inp.kerf)) errs.push(`板${si} 不可一刀切`)
  })
  made.forEach((m, i) => { if (m !== inp.parts[i].qty) errs.push(`零件${i} 应 ${inp.parts[i].qty} 实 ${m}`) })
  used.forEach((u, k) => { const q = inp.sheets[k].qty; if (q !== Infinity && q != null && u > q) errs.push(`板材${k} 超库存`) })
  return errs
}
// 按刀序在矩形上真的切：每刀必须完整贯穿它所在的那一块，切完后每个零件恰好是一块
function replay(o, kerf, trim) {
  const errs = []
  let regs = [{ x0: trim, y0: trim, x1: o.L - trim, y1: o.W - trim }]
  const cuts = o.cuts.slice().sort((a, b) => a.order - b.order)
  cuts.forEach((c, i) => {
    if (c.order !== i + 1) errs.push(`刀序不连续 ${c.order}`)
    const hit = regs.findIndex((r) => c.dir === 'v'
      ? (c.pos > r.x0 + EPS && c.pos < r.x1 - EPS && Math.abs(c.from - r.y0) < EPS && Math.abs(c.to - r.y1) < EPS)
      : (c.pos > r.y0 + EPS && c.pos < r.y1 - EPS && Math.abs(c.from - r.x0) < EPS && Math.abs(c.to - r.x1) < EPS))
    if (hit < 0) { errs.push(`第 ${c.order} 刀不贯穿任何当前块（${c.dir} ${c.pos} ${c.from}→${c.to}）`); return }
    const r = regs[hit], out = []
    if (c.dir === 'v') { out.push({ x0: r.x0, y0: r.y0, x1: c.pos, y1: r.y1 }); if (c.pos + kerf < r.x1 - EPS) out.push({ x0: c.pos + kerf, y0: r.y0, x1: r.x1, y1: r.y1 }) }
    else { out.push({ x0: r.x0, y0: r.y0, x1: r.x1, y1: c.pos }); if (c.pos + kerf < r.y1 - EPS) out.push({ x0: r.x0, y0: c.pos + kerf, x1: r.x1, y1: r.y1 }) }
    regs.splice(hit, 1, ...out)
    // 刀带不得穿过零件
    o.placements.forEach((p) => {
      const band = c.dir === 'v' ? { x: c.pos, y: c.from, w: kerf, h: c.to - c.from } : { x: c.from, y: c.pos, w: c.to - c.from, h: kerf }
      const ox = Math.min(band.x + band.w, p.x + p.w) - Math.max(band.x, p.x), oy = Math.min(band.y + band.h, p.y + p.h) - Math.max(band.y, p.y)
      if (ox > EPS && oy > EPS) errs.push(`第 ${c.order} 刀穿过零件 #${p.no}`)
    })
  })
  o.placements.forEach((p) => {
    if (!regs.some((r) => Math.abs(r.x0 - p.x) < EPS && Math.abs(r.y0 - p.y) < EPS && Math.abs(r.x1 - (p.x + p.w)) < EPS && Math.abs(r.y1 - (p.y + p.h)) < EPS)) errs.push(`零件 #${p.no} 切完后不是独立一块`)
  })
  return errs
}

export default async ({ page, toolURL, screenshot, assert }) => {
  const pageErrors = []
  page.on('pageerror', (e) => pageErrors.push(String(e)))
  await page.goto(toolURL)
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  const settle = (m) => page.waitForFunction((m) => {
    const o = document.querySelector(m === '2d' ? '#ct2-out' : '#ct1-out')
    return !!(o && o.dataset.key && o.dataset.key === window.ctStateKey(m))
  }, m, { timeout: 20000 })
  const onTab = async (t) => {
    await page.click(`#ct-tab-${t}`)
    await page.waitForFunction((t) => !document.querySelector('#ct-pane-' + t).hidden, t)
    if (t === '1d' || t === '2d') await settle(t)
  }
  const last1 = () => page.evaluate(() => window.ctLast1D)
  const last2 = () => page.evaluate(() => window.ctLast2D)
  const text = (sel) => page.$eval(sel, (n) => n.textContent.trim())

  // ── 1. 默认示例：断桥铝窗型材 ──
  await settle('1d')
  let L1 = await last1()
  assert(L1.res.status === 'ok', '默认一维示例应算出方案')
  assert(L1.res.stats.obj === ORACLE.win.obj, `窗型材原料总长应为 CP-SAT 最优 ${ORACLE.win.obj}，实得 ${L1.res.stats.obj}`)
  assert(L1.res.stats.nBars === ORACLE.win.nBarsAtOpt, `窗型材应 ${ORACLE.win.nBarsAtOpt} 根，实得 ${L1.res.stats.nBars}`)
  assert(await text('#ct1-nbars') === ORACLE.win.nBarsAtOpt + '根', '页面「用料」读数')
  assert(L1.res.stats.proven && await text('#ct1-badge') === '已证明最优', '应标「已证明最优」')
  assert(await page.$eval('#ct1-proof', (n) => n.dataset.proven) === '1', 'proof data-proven=1')
  assert(await text('#ct1-util') === (ORACLE.win.totalPieceLen / ORACLE.win.obj * 100).toFixed(1) + '%', '利用率 = 零件总长 ÷ 原料总长')
  let e1 = check1(L1.input, L1.res)
  assert(e1.length === 0, '独立校验（窗型材）：' + e1.slice(0, 4).join('；'))
  const nPat = await page.$$eval('#ct1-pats .ct-pat', (ns) => ns.length)
  assert(nPat === L1.res.patterns.length && nPat >= 2, `切法卡片数 ${nPat}`)
  const timesSum = await page.$$eval('#ct1-pats .ct-pat', (ns) => ns.reduce((a, n) => a + +n.dataset.times, 0))
  assert(timesSum === ORACLE.win.nBarsAtOpt, `各切法根数之和应等于总根数，实得 ${timesSum}`)
  assert(await page.$eval('#ct1-self', (n) => n.textContent.includes('全部核对通过')), '页面自检通过')
  // 下料图几何：同一比例尺、锯缝条数、文字落在零件内
  const geo1 = await page.$$eval('#ct1-pats svg.ct-bar', (svgs) => svgs.map((svg) => {
    const pcs = [...svg.querySelectorAll('rect.ct-pc')].map((r) => ({ w: +r.getAttribute('width'), len: +r.dataset.len, x: +r.getAttribute('x') }))
    const kerfs = svg.querySelectorAll('rect.ct-kerf').length
    const labs = [...svg.querySelectorAll('text.ct-lab')].map((t) => t.getBoundingClientRect())
    const boxes = [...svg.querySelectorAll('rect.ct-pc, rect.ct-off')].map((r) => r.getBoundingClientRect())
    const outside = labs.filter((b) => !boxes.some((r) => b.left >= r.left - 1 && b.right <= r.right + 1 && b.top >= r.top - 1 && b.bottom <= r.bottom + 1)).length
    const off = svg.querySelector('rect.ct-off')
    return { pcs, kerfs, nLab: labs.length, outside, off: off ? +off.dataset.len : 0, svgW: svg.getBoundingClientRect().width }
  }))
  const scales = geo1.flatMap((g) => g.pcs.map((p) => p.w / p.len))
  assert(Math.max(...scales) - Math.min(...scales) < 1e-6, '所有下料图应同一比例尺')
  geo1.forEach((g, i) => {
    const p = L1.res.patterns[i]
    assert(g.pcs.length === p.pieces.length, `切法 ${i} 零件块数`)
    assert(g.kerfs === p.pieces.length - 1 + (p.offcut > 0 ? 1 : 0), `切法 ${i} 锯缝条数应 ${p.pieces.length - 1 + (p.offcut > 0 ? 1 : 0)}，实 ${g.kerfs}`)
    assert(g.outside === 0, `切法 ${i} 有 ${g.outside} 个标签不在零件 / 余料块内`)
    assert(g.svgW > 200, `切法 ${i} 图宽 ${g.svgW}`)
  })
  assert(geo1.reduce((a, g) => a + g.nLab, 0) >= 20, '下料图上应有零件长度标签')
  assert(L1.res.stats.lb <= ORACLE.win.obj + 1e-9 && L1.res.stats.lb === L1.res.stats.obj, `下界 ${L1.res.stats.lb} 不得高于真最优 ${ORACLE.win.obj}`)
  // 窄屏：图按容器宽重画，放不下的标签要丢掉而不是溢出
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForFunction(() => { const v = document.querySelector('#ct1-pats svg.ct-bar'); return v && +v.getAttribute('width') < 380 })
  const narrow = await page.$$eval('#ct1-pats svg.ct-bar', (svgs) => {
    let outside = 0, overlap = 0, n = 0
    for (const svg of svgs) {
      const labs = [...svg.querySelectorAll('text.ct-lab')].map((t) => t.getBoundingClientRect())
      const boxes = [...svg.querySelectorAll('rect.ct-pc, rect.ct-off')].map((r) => r.getBoundingClientRect())
      n += labs.length
      labs.forEach((b) => { if (!boxes.some((r) => b.left >= r.left - 1 && b.right <= r.right + 1)) outside++ })
      for (let i = 0; i < labs.length; i++) for (let j = i + 1; j < labs.length; j++) if (Math.min(labs[i].right, labs[j].right) - Math.max(labs[i].left, labs[j].left) > 1) overlap++
    }
    return { outside, overlap, n }
  })
  assert(narrow.outside === 0 && narrow.overlap === 0, `390px 下料图标签越界 ${narrow.outside}、重叠 ${narrow.overlap}`)
  assert(narrow.n >= 10, `390px 下料图仍应保留放得下的标签（${narrow.n}）`)
  await page.setViewportSize({ width: 1280, height: 850 })
  await page.waitForFunction(() => +document.querySelector('#ct1-pats svg.ct-bar').getAttribute('width') > 500)

  // ── 2. 手输清单：小数 + 多种写法 + 有限库存的短料 + 根数目标 ──
  await page.fill('#ct1-stocks', '6米型材 6m 不限\n短料 2400 2')
  await page.fill('#ct1-pieces', '立柱 1203.5x6\n横档 803.5 9根\n斜撑,644.5,5\n短撑 297 12\n坏行 abc')
  await page.fill('#ct1-kerf', '2.5')
  await page.fill('#ct1-trim', '5')
  await page.selectOption('#ct1-obj', 'count')
  await settle('1d')
  L1 = await last1()
  const custPieces = [[1203.5, 6], [803.5, 9], [644.5, 5], [297, 12]]
  assert(JSON.stringify(L1.input.pieces.map((p) => [p.len, p.qty])) === JSON.stringify(custPieces), '四种写法都解析对：' + JSON.stringify(L1.input.pieces))
  assert(L1.input.stocks.length === 2 && L1.input.stocks[0].len === 6000 && L1.input.stocks[0].qty === Infinity && L1.input.stocks[1].qty === 2, '「6m」「不限」与有限库存解析对')
  const totLen = custPieces.reduce((a, [l, q]) => a + l * q, 0)
  assert((await text('#ct1-pieces-st')).includes((totLen / 1000).toFixed(2) + ' m') && (await text('#ct1-pieces-st')).includes('共 32 件'), '解析摘要：件数与总长')
  assert((await text('#ct1-pieces-err')).includes('第 5 行'), '坏行要报出行号')
  assert(L1.res.stats.obj === ORACLE.custom.obj, `手输清单根数应为 CP-SAT 最优 ${ORACLE.custom.obj}，实得 ${L1.res.stats.obj}`)
  assert(L1.res.stats.proven === (L1.res.stats.obj <= L1.res.stats.lb), 'proven 与 obj/lb 一致')
  assert(L1.res.stats.lb <= ORACLE.custom.obj + 1e-9, `下界 ${L1.res.stats.lb} 不得高于真最优 ${ORACLE.custom.obj}`)
  e1 = check1(L1.input, L1.res)
  assert(e1.length === 0, '独立校验（手输）：' + e1.slice(0, 4).join('；'))

  // ── 3. 原料不够 / 零件超长 ──
  await page.fill('#ct1-stocks', '6000 2')
  await page.fill('#ct1-pieces', '2000 9')
  await page.fill('#ct1-kerf', '0'); await page.fill('#ct1-trim', '0')
  await settle('1d')
  assert(ORACLE.infeasible.status === 'infeasible' && (await text('#ct1-msg')).includes('原料数量不够'), '库存不够要明说')
  await page.fill('#ct1-pieces', '7000 1')
  await settle('1d')
  assert((await text('#ct1-msg')).includes('比所有原料都长'), '超长零件要明说')

  // ── 3b. 恰好装满：3×330 + 2 道锯缝 5 = 1000，一根正好三件、无余料 ──
  await page.fill('#ct1-stocks', '1000 不限')
  await page.fill('#ct1-pieces', '330 6')
  await page.fill('#ct1-kerf', '5'); await page.fill('#ct1-trim', '0')
  await page.selectOption('#ct1-obj', 'length')
  await settle('1d')
  L1 = await last1()
  assert(L1.res.stats.obj === ORACLE.exact.obj && L1.res.bars.every((b) => b.pieces.length === 3 && b.offcut === 0), `恰好装满应 ${ORACLE.exact.obj / 1000} 根且无余料，实得 ${L1.res.stats.obj}`)
  // ── 3c. 三种定尺按总价：潜水取整与换料 / 并料都要走到（两组 CP-SAT 精确最优） ──
  const mixes = [
    ['mixA', '9米 9000 不限 ¥89.3\n4米 4000 不限 ¥46\n5米 5000 不限 ¥47', '2540 9\n5190 6\n4210 9\n2430 10\n570 9', '2'],
    ['mixB', '3米 3000 不限 ¥34.1\n6米 6000 不限 ¥69.9\n4米 4000 不限 ¥41.4', 'A 3440 12\nB 1970 5\nC 3310 7\nD 2320 9\nE 1970 14\nF 510 4', '4']
  ]
  for (const [k, st, pc, kf] of mixes) {
    await page.fill('#ct1-stocks', st); await page.fill('#ct1-pieces', pc); await page.fill('#ct1-kerf', kf)
    await page.selectOption('#ct1-obj', 'cost')
    await settle('1d')
    L1 = await last1()
    assert(Math.abs(L1.res.stats.obj - ORACLE[k].obj) < 1e-6, `${k} 总价应为 CP-SAT 最优 ${ORACLE[k].obj}，实得 ${L1.res.stats.obj}`)
    assert(L1.res.stats.lb <= ORACLE[k].obj + 1e-9, `${k} 下界 ${L1.res.stats.lb} 不得高于真最优`)
    e1 = check1(L1.input, L1.res)
    assert(e1.length === 0, `独立校验（${k}）：` + e1.slice(0, 4).join('；'))
  }

  // ── 4. 示例：钢筋（两种定尺、按总价） ──
  await onTab('proj')
  await page.click('[data-ex="rebar"]')
  await settle('1d')
  L1 = await last1()
  assert(Math.abs(L1.res.stats.obj - ORACLE.rebar.obj) < 1e-6, `钢筋总价应为 CP-SAT 最优 ${ORACLE.rebar.obj}，实得 ${L1.res.stats.obj}`)
  assert(L1.res.stats.lb <= ORACLE.rebar.obj + 1e-9, '钢筋下界不得高于真最优')
  assert(await text('#ct1-price') === '¥' + ORACLE.rebar.obj.toFixed(2).replace(/\.00$/, ''), '总价读数：' + await text('#ct1-price'))
  e1 = check1(L1.input, L1.res)
  assert(e1.length === 0, '独立校验（钢筋）：' + e1.slice(0, 4).join('；'))

  // ── 5. 余料库：手动登记 → 立刻刷新仍在 → 下料先用余料 → 登记扣减与新增 ──
  await onTab('proj')
  await page.click('[data-ex="stud"]')
  await settle('1d')
  L1 = await last1()
  assert(L1.res.stats.obj === ORACLE.stud.obj, `木方龙骨应为 CP-SAT 最优 ${ORACLE.stud.obj}，实得 ${L1.res.stats.obj}`)
  assert(L1.res.stats.lb <= ORACLE.stud.obj + 1e-9, '木方下界不得高于真最优')
  await onTab('rem')
  await page.fill('#ctr-spec', '樟子松 40×60'); await page.fill('#ctr-size', '2400'); await page.fill('#ctr-qty', '3'); await page.click('#ctr-add')
  await page.fill('#ctr-size', '1500'); await page.fill('#ctr-qty', '2'); await page.click('#ctr-add')
  await page.fill('#ctr-size', '800x'); await page.click('#ctr-add')
  assert((await text('#ctr-err')).includes('尺寸'), '非法尺寸要报错')
  assert(await text('#ct-rem-n') === '5', '余料库计数 5')
  await page.reload()
  await page.waitForFunction(() => document.querySelector('#ct-rem-n').textContent === '5')
  assert(await page.$$eval('#ctr-bars-t tbody tr', (ns) => ns.length) === 2, '刷新后余料仍在（两种长度）')
  await onTab('1d')
  await page.check('#ct1-userem')
  await settle('1d')
  L1 = await last1()
  assert(L1.res.stats.obj === ORACLE.studRem.obj, `先用余料后新料总长应为 CP-SAT 最优 ${ORACLE.studRem.obj}，实得 ${L1.res.stats.obj}`)
  e1 = check1(L1.input, L1.res)
  assert(e1.length === 0, '独立校验（用余料）：' + e1.slice(0, 4).join('；'))
  const usedRem = L1.res.bars.filter((b) => L1.input.stocks[b.stock].remnant).length
  const newRe = L1.res.bars.filter((b) => b.reusable).length
  assert(usedRem >= 1, '应用到余料')
  await page.click('#ct1-reg')
  await page.waitForFunction((n) => document.querySelector('#ct-rem-n').textContent === String(n), 5 - usedRem + newRe)
  assert(await page.$eval('#ct1-reg', (b) => b.disabled), '登记后按钮应禁用，防止重复登记')
  await page.reload()
  await page.waitForFunction((n) => document.querySelector('#ct-rem-n').textContent === String(n), 5 - usedRem + newRe)
  const lib = await page.evaluate(() => JSON.parse(localStorage.getItem('ct-remnants-v1')))
  const libTotal = lib.bars.reduce((a, b) => a + b.qty, 0)
  assert(libTotal === 5 - usedRem + newRe, `余料库应剩 ${5 - usedRem + newRe} 段，实 ${libTotal}`)

  // ── 6. 二维默认示例：书柜（有纹板 + 锁纹件 + 一刀切） ──
  await onTab('2d')
  let L2 = await last2()
  assert(L2.res.status === 'ok' && L2.res.mode === 'guillotine', '书柜应算出一刀切方案')
  assert(ORACLE.shelf.fitsLB === 'OPTIMAL' && L2.res.stats.nSheets === ORACLE.shelf.lb, `书柜应 ${ORACLE.shelf.lb} 张（= 下界且 CP-SAT 证实可行），实得 ${L2.res.stats.nSheets}`)
  assert(L2.res.stats.lb === ORACLE.shelf.lb && L2.res.stats.proven, '下界与「已证明最优」')
  assert(await text('#ct2-badge') === '已证明最优', '二维徽标')
  assert(L2.res.stats.bandLen === ORACLE.shelf.bandLen, `封边总长应 ${ORACLE.shelf.bandLen}，实 ${L2.res.stats.bandLen}`)
  assert(await text('#ct2-util') === (ORACLE.shelf.partsArea / (ORACLE.shelf.lb * 2440 * 1220) * 100).toFixed(1) + '%', '二维利用率读数')
  let e2 = check2(L2.input, L2.res)
  assert(e2.length === 0, '独立校验（书柜）：' + e2.slice(0, 4).join('；'))
  L2.res.sheets.forEach((o, i) => { const r = replay(o, L2.input.kerf, L2.input.trim); assert(r.length === 0, `第 ${i + 1} 张刀序复演：` + r.slice(0, 3).join('；')) })
  // 图：零件块数（按排版组 × 张数）、坐标比例、文字在块内、余料不压零件
  const geo2 = await page.$$eval('#ct2-sheets-out .ct-sheet', (ds) => ds.map((d) => {
    const svg = d.querySelector('svg'), vb = svg.viewBox.baseVal
    const parts = [...svg.querySelectorAll('rect.ct-part')].map((r) => ({ x: +r.getAttribute('x'), dx: +r.dataset.x, w: +r.getAttribute('width'), dw: +r.dataset.w, b: r.getBoundingClientRect() }))
    const rems = [...svg.querySelectorAll('rect.ct-rem')].map((r) => r.getBoundingClientRect())
    const labs = [...svg.querySelectorAll('text.ct-lab')].map((t) => t.getBoundingClientRect())
    const boxes = parts.map((p) => p.b).concat(rems)
    const outside = labs.filter((b) => !boxes.some((r) => b.left >= r.left - 1 && b.right <= r.right + 1 && b.top >= r.top - 1 && b.bottom <= r.bottom + 1)).length
    let remHit = 0
    rems.forEach((r) => parts.forEach((p) => { const ox = Math.min(r.right, p.b.right) - Math.max(r.left, p.b.left), oy = Math.min(r.bottom, p.b.bottom) - Math.max(r.top, p.b.top); if (ox > 1 && oy > 1) remHit++ }))
    return { times: +d.dataset.times, n: parts.length, parts, vbw: vb.width, outside, nLab: labs.length, remHit, cuts: svg.querySelectorAll('line.ct-cut').length }
  }))
  assert(geo2.reduce((a, g) => a + g.n * g.times, 0) === ORACLE.shelf.nParts, `图上零件数 × 张数应为 ${ORACLE.shelf.nParts}`)
  geo2.forEach((g, i) => {
    const sc = g.vbw / 2440
    assert(g.parts.every((p) => Math.abs(p.x - p.dx * sc) < 0.01 && Math.abs(p.w - p.dw * sc) < 0.01), `第 ${i + 1} 张图坐标与数据同比例`)
    assert(g.outside === 0, `第 ${i + 1} 张图有 ${g.outside} 个标签越出它的块`)
    assert(g.remHit === 0, `第 ${i + 1} 张图余料与零件重叠 ${g.remHit} 处`)
    assert(g.nLab >= g.n, `第 ${i + 1} 张图每个零件都应有标签（${g.nLab}/${g.n}）`)
  })
  const nCutsData = L2.res.sheets.filter((o) => o.times).reduce((a, o) => a + o.cuts.length, 0)
  assert(geo2.reduce((a, g) => a + g.cuts, 0) === nCutsData, '切割线条数 = 刀序表刀数')
  await page.uncheck('#ct2-showcuts')
  await page.waitForFunction(() => document.querySelectorAll('#ct2-out line.ct-cut').length === 0)
  await page.check('#ct2-showcuts')
  await page.waitForFunction((n) => document.querySelectorAll('#ct2-out line.ct-cut').length === n, nCutsData)
  // 锁纹件在有纹板上不得旋转（侧板、门板），其余可转
  const rotLocked = L2.res.sheets.flatMap((o) => o.placements).filter((p) => L2.input.parts[p.part].grain && p.rot).length
  assert(rotLocked === 0, '锁纹件被旋转了')

  // ── 7. 雕刻机自由排版：亚克力（小数刀缝 0.2） ──
  await onTab('proj')
  await page.click('[data-ex="acrylic"]')
  await settle('2d')
  L2 = await last2()
  assert(L2.res.mode === 'free', '亚克力示例走雕刻机模式')
  assert(ORACLE.acrylic.fitsLB === 'OPTIMAL' && L2.res.stats.nSheets === ORACLE.acrylic.lb, `亚克力应 ${ORACLE.acrylic.lb} 张，实得 ${L2.res.stats.nSheets}`)
  e2 = check2(L2.input, L2.res)
  assert(e2.length === 0, '独立校验（亚克力）：' + e2.slice(0, 4).join('；'))
  assert(await page.$$eval('#ct2-out line.ct-cut', (ns) => ns.length) === 0, '雕刻机模式不画刀序线')

  // ── 8. 衣柜：两种板材、整张限 6 张、按总价 ──
  await onTab('proj')
  await page.click('[data-ex="wardrobe"]')
  await settle('2d')
  L2 = await last2()
  e2 = check2(L2.input, L2.res)
  assert(e2.length === 0, '独立校验（衣柜）：' + e2.slice(0, 4).join('；'))
  const priceSum = L2.res.sheets.reduce((a, o) => a + L2.input.sheets[o.sheet].price, 0)
  assert(Math.abs(priceSum - L2.res.stats.price) < 1e-6, '总价 = 各张单价之和')
  const minCostPerArea = Math.min(...L2.input.sheets.map((s) => s.price / ((s.l - 2 * L2.input.trim + L2.input.kerf) * (s.w - 2 * L2.input.trim + L2.input.kerf))))
  const inflArea = L2.input.parts.reduce((a, p) => a + (p.l + L2.input.kerf) * (p.w + L2.input.kerf) * p.qty, 0)
  assert(priceSum >= inflArea * minCostPerArea - 1e-6, '总价不可能低于面积成本下界（否则方案必不可行）')

  // ── 8b. 锁纹件只有转过来才放得下 ⇒ 必须报「放不下」；去掉锁纹就该转着放 ──
  await onTab('2d')
  await page.fill('#ct2-sheets', '有纹板 1000 500 不限 有纹')
  await page.fill('#ct2-parts', '立板 300 800 1 锁纹')
  await settle('2d')
  assert((await text('#ct2-msg')).includes('放不下'), '锁纹件在有纹板上不能靠旋转塞进去')
  await page.fill('#ct2-parts', '立板 300 800 1')
  await settle('2d')
  L2 = await last2()
  assert(L2.res.status === 'ok' && L2.res.sheets[0].placements[0].rot === true, '不锁纹时应旋转后放下')
  e2 = check2(L2.input, L2.res)
  assert(e2.length === 0, '独立校验（旋转件）：' + e2.slice(0, 4).join('；'))

  // ── 9. 板材余料：登记一块有纹余料 → 书柜先用它 → 新板张数 = 下界 ──
  await onTab('rem')
  await page.fill('#ctr-spec', '18mm 暖白颗粒板'); await page.fill('#ctr-size', '1200x600'); await page.fill('#ctr-qty', '1'); await page.check('#ctr-grain'); await page.click('#ctr-add')
  await page.waitForFunction(() => document.querySelectorAll('#ctr-boards-t tbody tr').length === 1)
  await onTab('proj')
  await page.click('[data-ex="shelf"]')
  await settle('2d')
  await page.check('#ct2-userem')
  await settle('2d')
  L2 = await last2()
  const newSheets = L2.res.sheets.filter((o) => !L2.input.sheets[o.sheet].remnant).length
  const remSheets = L2.res.sheets.filter((o) => L2.input.sheets[o.sheet].remnant).length
  assert(newSheets === ORACLE.shelfRem.lbNew, `用余料后新板应 ${ORACLE.shelfRem.lbNew} 张（下界），实 ${newSheets}`)
  assert(remSheets === 1, '应用上那块余料')
  e2 = check2(L2.input, L2.res)
  assert(e2.length === 0, '独立校验（书柜 + 余料）：' + e2.slice(0, 4).join('；'))
  L2.res.sheets.forEach((o, i) => { const r = replay(o, L2.input.kerf, L2.input.trim); assert(r.length === 0, `余料版第 ${i + 1} 张刀序复演：` + r.slice(0, 3).join('；')) })

  // ── 10. CSV 下载件：独立解析 ──
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#ct2-csv')])
  const csv = fs.readFileSync(await dl.path(), 'utf8')
  assert(csv.charCodeAt(0) === 0xFEFF, 'CSV 带 BOM（Excel 认中文）')
  const rows = csv.slice(1).trim().split('\n')
  assert(rows.length === 1 + ORACLE.shelf.nParts, `CSV 行数应 ${1 + ORACLE.shelf.nParts}，实 ${rows.length}`)
  assert(rows[0].split(',')[0] === '板号' && rows.slice(1).every((r) => r.split(',').length === 9), 'CSV 列结构')

  // ── 11. 方案库：保存 → 改坏输入 → 刷新 → 打开恢复；分享链接在新页打开 ──
  await onTab('proj')
  await page.fill('#ctp-name', '测试方案 A')
  await page.click('#ctp-save')
  await page.waitForFunction(() => document.querySelectorAll('#ctp-table tbody tr').length === 1)
  const share = await page.evaluate(() => window.ctShareURL())
  await onTab('2d')
  await page.fill('#ct2-parts', '临时 100 100 1')
  await page.reload()
  await onTab('proj')
  await page.click('#ctp-table [data-open]')
  await page.waitForFunction(() => document.querySelector('#ct2-parts').value.startsWith('侧板 2000 350'))
  const p2 = await page.context().newPage()
  await p2.goto(share)
  await p2.waitForFunction(() => document.querySelector('#ct2-parts').value.startsWith('侧板 2000 350') && !document.querySelector('#ct-pane-2d').hidden)
  await p2.close()

  // ── 12. 键盘切页签 ──
  await page.focus('#ct-tab-proj')
  await page.keyboard.press('ArrowRight')
  await page.waitForFunction(() => document.querySelector('#ct-tab-about').getAttribute('aria-selected') === 'true')
  await page.keyboard.press('Home')
  await page.waitForFunction(() => document.activeElement && document.activeElement.id === 'ct-tab-1d')

  // ── 12b. 改完立刻刷新也要保留（防抖写盘要在离页时补写） ──
  await onTab('1d')
  await page.fill('#ct1-minrem', '450')
  await page.reload()
  await page.waitForFunction(() => document.querySelector('#ct1-minrem').value === '450', null, { timeout: 8000 })

  // ── 13. 渲染守卫 ──
  const TABS = ['1d', '2d', 'rem', 'proj', 'about']
  const nCtl = await renderGuards(page, {
    assert, tabs: TABS, onTab,
    paneSel: (t) => `#ct-pane-${t}`, panesRoot: '#ct-panes',
    figSel: (t) => (t === '1d' ? '#ct-pane-1d svg.ct-bar' : t === '2d' ? '#ct-pane-2d svg.ct-sheet-svg' : `#ct-pane-${t} svg.ct-none`),
    cardSel: '.ct-card, .ct-pat, .ct-sheet, .ct-res', minControls: 40, minTextsInFig: 1, minIds: 60
  })
  assert(nCtl >= 40, `扫到的控件太少：${nCtl}`)
  await guardBoxOverlap(page, { assert, sel: '#ct-tabs .ct-tab, .ct-hero-cta .ct-btn, .ct-nav .ct-brand' })
  await onTab('1d')
  await guardBoxOverlap(page, { assert, sel: '#ct1-out .ct-stat, #ct1-out .ct-res-actions .ct-btn, #ct1-out .ct-badge, #ct1-out .ct-pat-h > *' })
  await onTab('2d')
  await guardBoxOverlap(page, { assert, sel: '#ct2-out .ct-stat, #ct2-out .ct-res-actions .ct-btn, #ct2-out .ct-badge, #ct2-out .ct-sheet-h > *' })
  // 提示条藏起来时计算样式必须是 none（[hidden] 守卫）
  await page.waitForFunction(() => document.querySelector('#ct-toast').hidden, null, { timeout: 8000 })
  assert(await page.$eval('#ct-toast', (n) => getComputedStyle(n).display) === 'none', 'toast 隐藏后计算样式应为 none')

  assert(pageErrors.length === 0, '页面报错：' + pageErrors.join(' | '))

  // 缩略图：二维排版结果（书柜两张、已证明最优），滚到结果条正好露出在吸顶页签下方
  await onTab('2d')
  await page.uncheck('#ct2-userem')
  await settle('2d')
  await page.waitForFunction(() => document.querySelector('#ct-toast').hidden, null, { timeout: 8000 })
  await page.evaluate(() => { const o = document.querySelector('#ct2-out'); window.scrollTo(0, o.getBoundingClientRect().top + window.scrollY - document.querySelector('.ct-sub').offsetHeight - 20) })
  await page.waitForFunction(() => window.scrollY > 300)
  await screenshot('thumb.png')
}
