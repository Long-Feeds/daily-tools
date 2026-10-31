// 拼豆图纸工坊 · 集成测试（真实 Chromium）
// 真值一律来自 ORACLE（run 目录 oracle/browser_truth.json：Python 独立实现——colour-science ΔE2000 暴力最近色、
// numpy float32 逐行复刻的限色、逐格复刻的误差扩散、scipy 连通块清理 / 去背景、scipy linear_sum_assignment），
// 由 inject-oracle.mjs 机械注入，不手抄。页面自身算出来的数只用于「渲染与状态是否一致」这类同源检查。
import { guardHidden, guardControlSize, guardTextTransform, guardOverflow, guardEscape, guardUniqueIds } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'
import fs from 'node:fs'

const ORACLE = {
 "meta": {
  "src": {
   "S1": "pumpkin 16×16 原生像素 → area+linear 重采样（1:1）→ colour-science Lab（NPM 口径）+ ΔE2000 暴力最近色（并列取小下标）",
   "S2": "pumpkin 16×16 原生像素 → area+linear 重采样（1:1）→ colour-science Lab（NPM 口径）+ ΔE2000 暴力最近色（并列取小下标）",
   "S3": "sunset 240×160 → 60×40 area+linear → 8 位格色 → 限 12 色：colour ΔE2000 转 float32 矩阵上逐行复刻「贪心淘汰 + PAM 交换」（单源：本复刻；第 7 节已与引擎 36/36 逐格一致）",
   "S4": "S3 的 12 色集合上做 Floyd–Steinberg（强度 1，Lab 空间蛇形扩散，截断 L∈[0,100]、a,b∈[−128,128]），独立复刻",
   "S5": "S3 结果上杂色清理 minSize=3（4 连通 scipy 标块；按面积↑、首格↑逐块并入共享边最多的邻色，并列取 ΔE2000 近者再取小下标），独立复刻",
   "S6": "Pillow 画 192×128（白底 + 蓝实心圆 (24,16)-(120,112) + 红方块 (140,40)-(172,72)）→ LANCZOS 缩到 48×32 抗锯齿 PNG；网格 48×32 area+linear；去背景：边框格 Lab 逐通道中位数为参考、ΔE76≤12、scipy 4 连通触边块并集；剩余格 colour ΔE2000 暴力最近色",
   "S7": "S1 用到的 MARD 色 × Perler 全色卡的 ΔE2000（colour）乘用量，scipy.optimize.linear_sum_assignment 求最小总代价；nearestMap = 各自取最近（可多对一）",
   "S8": "pumpkin 16×16，MARD 只允许 A1/A6/B5/C7/H7/H1，colour ΔE2000 暴力最近色",
   "S9": "bubbletea 16×16 MARD 限 5 色：impl.quantize_ref（colour ΔE2000 → float32 矩阵逐行复刻贪心淘汰 + PAM 交换；单源）",
   "S10": "Pillow 画 192×128（粉底 (248,200,216) + 绿圆 + 黄方块）→ LANCZOS 48×32；area+linear；去背景容差 12（边框 Lab 逐通道中位数、ΔE76、scipy 触边连通块）；剩余格 colour ΔE2000 暴力最近色"
  },
  "engineOriginForSamples": "成品 /Users/lon/workspace/daily-tools/tools/2026-10-31-bead-studio/index.html"
 },
 "S1": {
  "brand": "mard",
  "w": 16,
  "h": 16,
  "total": 193,
  "counts": {
   "P5": 102,
   "H16": 47,
   "R10": 24,
   "G13": 16,
   "B11": 3,
   "B17": 1
  },
  "nColors": 6
 },
 "S2": {
  "brand": "perler",
  "w": 16,
  "h": 16,
  "total": 193,
  "counts": {
   "80-15249": 102,
   "80-15262": 47,
   "80-19003": 24,
   "80-19004": 16,
   "80-15220": 3,
   "80-19061": 1
  },
  "nColors": 6
 },
 "S3": {
  "brand": "mard",
  "w": 60,
  "h": 40,
  "maxColors": 12,
  "total": 2400,
  "selected": [
   "A21",
   "C29",
   "D22",
   "D7",
   "G14",
   "G21",
   "G4",
   "M11",
   "M12",
   "M13",
   "M8",
   "R23"
  ],
  "counts": {
   "D22": 683,
   "C29": 389,
   "M11": 246,
   "M8": 173,
   "D7": 164,
   "M13": 156,
   "R23": 135,
   "G4": 132,
   "G21": 118,
   "A21": 87,
   "G14": 66,
   "M12": 51
  },
  "eliminated": 25,
  "swaps": 0,
  "uniq": 1112,
  "s0": 37
 },
 "S4": {
  "brand": "mard",
  "w": 60,
  "h": 40,
  "maxColors": 12,
  "dither": "fs",
  "strength": 1,
  "total": 2400,
  "selected": [
   "A21",
   "C29",
   "D22",
   "D7",
   "G14",
   "G21",
   "G4",
   "M11",
   "M12",
   "M13",
   "M8",
   "R23"
  ],
  "counts": {
   "D22": 493,
   "C29": 366,
   "M12": 310,
   "M11": 201,
   "A21": 194,
   "G14": 194,
   "D7": 162,
   "M8": 131,
   "R23": 94,
   "M13": 93,
   "G21": 83,
   "G4": 79
  },
  "eliminated": 25,
  "swaps": 0,
  "uniq": 1112,
  "s0": 37
 },
 "S5": {
  "brand": "mard",
  "w": 60,
  "h": 40,
  "maxColors": 12,
  "minSize": 3,
  "total": 2400,
  "selected": [
   "A21",
   "C29",
   "D22",
   "D7",
   "G14",
   "G21",
   "G4",
   "M11",
   "M12",
   "M13",
   "M8",
   "R23"
  ],
  "counts": {
   "D22": 694,
   "C29": 398,
   "M11": 244,
   "D7": 164,
   "M8": 162,
   "M13": 148,
   "R23": 138,
   "G4": 131,
   "G21": 116,
   "A21": 93,
   "G14": 73,
   "M12": 39
  },
  "eliminated": 25,
  "swaps": 0,
  "uniq": 1112,
  "s0": 37
 },
 "S6": {
  "brand": "mard",
  "w": 48,
  "h": 32,
  "bgTol": 12,
  "png_b64": "iVBORw0KGgoAAAANSUhEUgAAADAAAAAgCAIAAADbtmxLAAAEhElEQVR4nM2XXWgcVRSA7zkzs7Ozs+kmaYxJNw1NG4q1pvjX+lMRRIu2ilUQpCKFan0q9UVQRKQIYq0PghZf/XlQg6IVqfgkWilq8UFM+lCJpsH8Ndlkd7M/2c3M3nvkzt0m+5vNbrbq4YQNM3Pv/e45555zLhAR+z+JXu8Ayv9JAfjvgIgYFwTANAR2lUMIEsQQAZtHBjVdRsQEkeTwhAtKLnIAZhro9+HyN8RYU7BqAHGRR5mOOmd/mb9wKfnXVCYSdxmwoF/rD1s3bws+fEf7jt5A4cfXCkgtMBt3T3769zcXojNxRwMwdKme2ZjjCpdTyNbv2tHy8qHeW/qDgghgXaFVFUgIQoQfhxeef+/P0elsyNZ9HgcVDEBvcc4pkeGWia8d3nJ0f5cgGWMNQ1UGUrYZ/D5y7PSI6UPLh5yv5lpNAyEosuAePxg++WxfYcytSLUJitmxGs35iwvHTo8ELc00MLcqjRzC5fvudt87ZybfPTOpIagnpQtX1NUtpAw+l3D3vTQ8G3NMHwqx1swpPYWQzvIvT9x4z02hohgnEslUqZFAPgfbBl2vmoeIZOicGhwfnc50hgy3fKPVRZ587+fVD8e+fWPANGTMASMGIJKp8QOP82gMDGMFC1Ck0+FPPvDvuY1xzjStFIhI5r2ZmPP1z/MhW8+t2TbLwgUFA9rvo+nzFxMP3NoqjaRsRMSjcT4fLQJCFKkUuW7VGOIewVnvhKsz1YiQ1M9+mC157CUMo1xXC2r16tdLSYRGaZhM66YBw2PprCM0LJjHyxkVtFiKgBBgyRV/TCx65mmQiIgZBk5H3fHI0iqHvZqsAMkABJZZEpGFnK7BepoSDSGV4VdijudAWl+1X6nl6xUoyTGIeS0IaqnFn5UCGRrYfpxLrAuFiJkGtFgF8UBE6bRIpUpPWTLFcrwyEICsX7Zf295jjUxmLJ9eKz9XFgDm5ERXm29bt+UtKrEgaG/6+H1yc7JHWZ4VZI43B3YquFIglaaRsV1bg1/9NN9wdUQAx+H9m/y2X1MVWi6t6/49t9fYhxpeMhdj7JE72xvLikoAWE6wg3s7pMkL5+BCpuNyLfZDMRBKr92wObB354Zkmuv5LFuHALCsI3o6fAd2t6u8v/JOQ1kcyrVmtWeMvfJUr2WiaqLrEl3DxCJ/8cnNbS2616zVu6MyIETgggb67NePbInEXV2rY07TwCvRpafv7zy873rOG2xnK1hIdTNHHuw6/lh4as4BhJpTAzBDh6l5595drW8elQ2aiuUGpHKJ8G4RhABvfzFxanCcGAtaGvOuH4WfA+S72Kwrkov80H2dbz3XF7J1eVqb28Lma7aQGz03tHDio7Ghy2nlFJ8OavdE5OYo6wrOKdxhvvBEzzMPdeVzB1zja1CO03e/xT8/Fxm6nJ6NOamszK2mgde1GtvDgUfv3rh/d9vGDYaM4rKC0WQgdvX6of7POGIisjQTcwAg6Met3VZLQLZ5zbqUrQmIee4TgsA7g6W43sVIRVJTpL6+h7xmQg3xLl9N42gQ6F+QfwANOmIspob90AAAAABJRU5ErkJggg==",
  "removed": 968,
  "total": 568,
  "counts": {
   "C8": 359,
   "R8": 74,
   "R1": 39,
   "F5": 24,
   "R24": 15,
   "D24": 13,
   "D1": 9,
   "D17": 9,
   "C28": 5,
   "P14": 5,
   "D16": 4,
   "C9": 3,
   "D2": 3,
   "P13": 3,
   "F24": 1,
   "F25": 1,
   "ZG6": 1
  }
 },
 "S7": {
  "from": "mard",
  "to": "perler",
  "mode": "unique",
  "cost": 1185.6543046409242,
  "map": {
   "B11": "80-15220",
   "B17": "80-19097",
   "G13": "80-19021",
   "H16": "80-15262",
   "P5": "80-19004",
   "R10": "80-15269"
  },
  "de": {
   "B11": 4.620055232852675,
   "B17": 7.689446438333955,
   "G13": 9.013176027852827,
   "H16": 7.738384745011465,
   "P5": 5.448791081466584,
   "R10": 4.183879280552347
  },
  "nearestMap": {
   "B11": "80-15220",
   "B17": "80-19097",
   "G13": "80-19021",
   "H16": "80-15262",
   "P5": "80-19004",
   "R10": "80-15269"
  },
  "nearestCost": 1185.6543046409242
 },
 "S8": {
  "brand": "mard",
  "allowed": [
   "A1",
   "A6",
   "B5",
   "C7",
   "H7",
   "H1"
  ],
  "total": 193,
  "counts": {
   "A6": 142,
   "H7": 47,
   "B5": 4
  }
 },
 "S9": {
  "brand": "mard",
  "maxColors": 5,
  "total": 132,
  "counts": {
   "A19": 9,
   "G11": 64,
   "G8": 7,
   "H2": 9,
   "H6": 43
  },
  "selected": [
   "A19",
   "G11",
   "G8",
   "H2",
   "H6"
  ],
  "eliminated": 2,
  "swaps": 0
 },
 "S10": {
  "brand": "mard",
  "w": 48,
  "h": 32,
  "bgTol": 12,
  "png_b64": "iVBORw0KGgoAAAANSUhEUgAAADAAAAAgCAIAAADbtmxLAAAEuUlEQVR4nM1YXWgcVRQ+5/7MZHezu8mmTdq6lTRokqaFSkl96ENFxQd9qoIolYIIPvikD4JPQhHxQVEoiL5aBSkU+2AfxBZEEEyolGqlJCTaNqVJ+ptkd7M7OzP33iMz06S7m0ma7qbFjws7d5h77ne/c+655y5WR8fh/wSxzu8IgIgIiMIuRg0Rg99HS8iETCTjkluAHBCXCGptlGt8AODIHhEhTSbJbWCy4BX+LU1PlKdnqvOImOGJXen8jkR3TyIHRI6qhlrhQyREgQiQlKmx4tTJG3+cvnVh2p2rak+HTmOIFhNdMn0gN3Bwy9MHckPK+J5RrUuFsUFtyEgmBPKjV376+uqZgnJSzLaYYEHQRHQDR/qkK9plyA72DB/pfzUn2yuq2iKnGEKGjMVkUTvvXTx2+vbfWZmUyDWZSLO6wYAsZDjnL/anth4denNPpreinFU4NQ6vs7QaIQJiwDzQh89/ObIw2W1lFOk1LEWQyIvKyYrk8b3vDrY/5sTohACrKUfBzllC40dEZAn748mTIwuTPXbWXwcbAPBJZ0RiXpXfH/tuUVUF8no5EcAFLAAWV7QCQKVWIdG4p2Ty1PWz307/tslKe0atg8w9Th0yea5w+fNLp44MvOb4laV400BZtH5AeQwoG3TvgQFWSO8l9yMAJ1KnTiGBzNPeV1NnbCbWI0wDfKM7Zer47MilxRmbWzUiPYBCrC6WuT06PzG+OJPklqF7fl0/BLKScn68eY4xae5m9QgYeiO28VoLNYSCHv/lzkXX+KzZFGcAJBO/3hnztcsaA5RWb3GEOCBpf6I8K5loRpzlPYH8WnVuzitJxlZmivviLiGC4LSa80qXnVuSieAYbQoU2fFLl5ybnMkm7NSpSkCaTOsHkqHATnNj67b9cnXROqjRWVFiZPURE73BGEIIqMh0yPa8nbvlFa1mvYahnYxMbm/rMqTCVEThlD5AGcBqzEPBnndjCEVZ0ZaJJ1I9Zwv/ILebYBMCfaN7E5u32J3K6LAgYYBlUi+A2R1O17BOQ5QG8JZ1qi8/iPZ39h+f+R2aBUPwjL8v29cmEhW/HJ5oCKCA8qR2xJ2vCKhDkVYQYohKuc917dqe2HTTK1gomti0BCRQvNyzj0jXhAYGGqC7xkJinhDQI521Moe27S81VdYI5At+5dmuoaeyfa4K6qS4oI5tcdQikVzlvP348wdygwVVEViX1NcGQ+Yav9vKfPjkK4HvH3Q1sYQQMKgVUXw2+EaXbF/UQSGxHiscmSZT1u4nA6/3pba52osKt1YJRQutarc32f3Nnnc2W5kFVRbI68WvAwJK5BXt+kZ9sfPwiz3DS7G80TV1QrTdcBc+GP/+59sXLBQpbkeLXr6XRc9V7ZW1O9Se/3TnoeGO/hbZrEooSkttXALgidnRE9dH/yxMVYyLgNF8RKTBSOT9qa0vde99K/9MNqjwV6umN4LQcvpvE0lj/PPFK38Vr44tXpt15xEwLRK70/ld7fnhbF/KSvvKUUav4dmNIRRBk2GIbdwGFOE9Njo1ERgHoz3tKdJs4+7U979K83DdjnIJqlEUh68DXkFuQbaB9+gH+LOBBRFdq8GGsqid6OGYbR7/AcyaRPdjt0HMAAAAAElFTkSuQmCC",
  "removed": 948,
  "total": 588,
  "counts": {
   "A20": 8,
   "A25": 9,
   "A5": 26,
   "A8": 1,
   "B12": 50,
   "B25": 32,
   "B7": 4,
   "B8": 359,
   "E14": 1,
   "E20": 5,
   "F22": 1,
   "G2": 8,
   "H3": 7,
   "M1": 4,
   "M2": 22,
   "P2": 5,
   "R10": 46
  }
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const TABS = ['make', 'build', 'colors', 'saved', 'about']
  const consoleErrors = []
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()) })

  const onTab = async (t) => {
    await page.click('#tab-' + t)
    await page.waitForFunction((t) => !document.querySelector('#pane-' + t).hidden, t)
  }
  const drawn = () => page.waitForFunction(() => document.querySelector('#bs-canvas').dataset.key === window.BSApp.stateKey(), null, { timeout: 10000 })
  const settled = async () => {
    await page.waitForFunction(() => {
      const c = document.querySelector('#bs-canvas')
      return window.BSApp && window.BSApp.st.pat && c.dataset.busy === '0' && c.dataset.seq === String(window.BSApp.st.seq)
    }, null, { timeout: 20000 })
    await drawn()
  }
  // 触发一次重算，并等到「比动作前更新的那一次」结果画上画布（序号等待，防止旧结果让等待瞬间成立）
  const regen = async (fn) => {
    const before = await page.evaluate(() => window.BSApp.st.seq)
    await fn()
    await page.waitForFunction((b) => {
      const c = document.querySelector('#bs-canvas')
      return window.BSApp.st.seq > b && c.dataset.busy === '0' && c.dataset.seq === String(window.BSApp.st.seq)
    }, before, { timeout: 20000 })
    await drawn()
  }
  const legend = () => page.$$eval('#bs-legend-rows .bs-lrow', (rs) => Object.fromEntries(rs.map((r) => [r.dataset.code, +r.querySelector('.bs-lcount').textContent.replace(/,/g, '')])))
  const status = () => page.evaluate(() => ({ total: +document.querySelector('#bs-status').dataset.total, colors: +document.querySelector('#bs-status').dataset.colors }))
  const sameCounts = (got, exp, label) => {
    const ks = [...new Set([...Object.keys(got), ...Object.keys(exp)])]
    const bad = ks.filter((k) => got[k] !== exp[k]).map((k) => `${k}:${got[k]}≠${exp[k]}`)
    assert(bad.length === 0, `${label} 色号用量与真值不符（${bad.length} 处）：${bad.slice(0, 8).join(' ')}`)
  }
  const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0)
  const setNum = async (sel, v) => { await page.fill(sel, String(v)); await page.dispatchEvent(sel, 'change') }
  const grid = () => page.evaluate(() => ({ w: window.BSApp.st.pat.w, h: window.BSApp.st.pat.h, brand: window.BSApp.st.pat.brand, idx: Array.from(window.BSApp.st.pat.idx) }))
  // 画布像素：格子 (i,j) 左上角往里 3px 处（避开网格线与居中的色号文字）
  const cellPixel = (i, j) => page.evaluate(([i, j]) => {
    const A = window.BSApp, sc = document.querySelector('#bs-scroller'), cv = document.querySelector('#bs-canvas')
    const c = A.st.view.cell, dpr = cv.width / sc.clientWidth
    const x = Math.round((34 + i * c - sc.scrollLeft + 3) * dpr), y = Math.round((24 + j * c - sc.scrollTop + 3) * dpr)
    const d = cv.getContext('2d').getImageData(x, y, 1, 1).data
    return '#' + [d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()
  }, [i, j])
  const hexOf = (brand, code) => page.evaluate(([b, c]) => { const P = BS.palette(b); return P.hex[P.byCode[c.toUpperCase()]] }, [brand, code])

  await page.goto(toolURL)
  await settled()

  // ── 1. 默认示例：南瓜灯 16×16，MARD，不限色（S1）──
  let g = await grid()
  assert(g.w === 16 && g.h === 16 && g.brand === 'mard', `默认应是 16×16 的 MARD 南瓜灯，实得 ${g.w}×${g.h} ${g.brand}`)
  sameCounts(await legend(), ORACLE.S1.counts, 'S1 南瓜灯')
  let s = await status()
  assert(s.total === ORACLE.S1.total && s.colors === Object.keys(ORACLE.S1.counts).length, `S1 状态栏 ${s.total} 颗 ${s.colors} 色，真值 ${ORACLE.S1.total} 颗`)
  assert(await page.inputValue('#bs-w') === '16' && await page.inputValue('#bs-h') === '16', '尺寸输入框应同步为 16×16')
  // 几何：色号文字一个不丢、每个都落在自己的格子里；标尺数字两两不重叠
  const lab = await page.evaluate(() => window.BSApp.st.draw)
  assert(lab.labels.length === ORACLE.S1.total && lab.skipped === 0, `16×16 整图可见时应画出 ${ORACLE.S1.total} 个色号、跳过 0 个，实得 ${lab.labels.length} / 跳过 ${lab.skipped}`)
  const outCell = lab.labels.filter(([x, y, w, h, cx, cy]) => x < cx + 0.5 || y < cy + 0.5 || x + w > cx + lab.cell - 0.5 || y + h > cy + lab.cell - 0.5)
  assert(outCell.length === 0, `有 ${outCell.length} 个色号越出所在格子`)
  const rul = lab.rulers
  let rulOverlap = 0
  for (let a = 0; a < rul.length; a++) for (let b = a + 1; b < rul.length; b++) {
    const A = rul[a], B = rul[b]
    if (A[4] !== B[4]) continue
    if (Math.min(A[0] + A[2], B[0] + B[2]) - Math.max(A[0], B[0]) > 0.5 && Math.min(A[1] + A[3], B[1] + B[3]) - Math.max(A[1], B[1]) > 0.5) rulOverlap++
  }
  assert(rulOverlap === 0 && rul.filter((r) => r[4] === 'x').length === 16 && rul.filter((r) => r[4] === 'y').length === 16, `标尺应各画 16 个且互不重叠，实得 x=${rul.filter((r) => r[4] === 'x').length} y=${rul.filter((r) => r[4] === 'y').length} 重叠 ${rulOverlap}`)
  // 画布上的颜色 = 该格色号的色值（逐格抽查 16 格，含空格）
  for (const [i, j] of [[0, 0], [7, 0], [8, 1], [4, 4], [5, 6], [3, 7], [11, 7], [7, 9], [8, 10], [3, 11], [5, 11], [7, 12], [12, 13], [15, 8], [0, 8], [9, 15]]) {
    const k = g.idx[j * 16 + i]
    const want = k < 0 ? '#FFFFFF' : await page.evaluate((k) => BS.palette('mard').hex[k], k)
    const got = await cellPixel(i, j)
    assert(got === want, `格 (${i + 1},${j + 1}) 画布颜色 ${got} ≠ 该格色值 ${want}`)
  }

  // ── 2. 换 Perler 色卡（S2）──
  await regen(() => page.selectOption('#bs-brand', 'perler'))
  sameCounts(await legend(), ORACLE.S2.counts, 'S2 Perler')
  assert(await page.inputValue('#bs-pitch') === '5', '换 Perler 后豆子规格应自动为 5 mm')
  await regen(() => page.selectOption('#bs-brand', 'mard'))
  sameCounts(await legend(), ORACLE.S1.counts, '换回 MARD')

  // ── 3. 库存：只用 6 种库存色（S8）+ 缺口 + 购物清单 ──
  await onTab('colors')
  await page.click('#bs-cbrands [data-brand="mard"]')
  const stock = { A1: 500, A6: 500, B5: 500, C7: 500, H7: 500, H1: 500 }
  for (const [code, q] of Object.entries(stock)) await setNum(`#bs-swgrid .bs-swc[data-code="${code}"] .bs-qty`, q)
  await page.click('#bs-cfilter [data-f="own"]')
  assert(await page.$eval('#bs-swgrid', (e) => +e.dataset.shown) === 6, '「有库存」筛选应只剩 6 色')
  await page.click('#bs-cfilter [data-f="all"]')
  await onTab('make')
  await regen(() => page.check('#bs-owned'))
  sameCounts(await legend(), ORACLE.S8.counts, 'S8 只用库存色')
  // 把用量最多的那色库存改成 10 颗 → 色号清单出「缺 n」；购物清单（多备 10%）的缺口 = Σ max(0, ⌈n×1.1⌉ − 库存)
  const top = Object.entries(ORACLE.S8.counts).sort((a, b) => b[1] - a[1])[0]
  await onTab('colors')
  await regen(() => setNum(`#bs-swgrid .bs-swc[data-code="${top[0]}"] .bs-qty`, 10))
  stock[top[0]] = 10
  await onTab('make')
  const short = await page.$eval(`#bs-legend-rows .bs-lrow[data-code="${top[0]}"] .bs-short`, (e) => e.textContent)
  assert(short === '缺 ' + (top[1] - 10), `${top[0]} 应显示「缺 ${top[1] - 10}」，实得「${short}」`)
  await onTab('build')
  const wantLack = Object.entries(ORACLE.S8.counts).reduce((a, [c, n]) => a + Math.max(0, Math.ceil(n * 1.1) - (stock[c] || 0)), 0)
  assert(await page.$eval('#bs-shop-sum', (e) => +e.dataset.lack) === wantLack, `购物清单缺口应为 ${wantLack} 颗`)
  await page.uncheck('#bs-spare')
  const wantLack0 = Object.entries(ORACLE.S8.counts).reduce((a, [c, n]) => a + Math.max(0, n - (stock[c] || 0)), 0)
  assert(await page.$eval('#bs-shop-sum', (e) => +e.dataset.lack) === wantLack0, `去掉 10% 损耗后缺口应为 ${wantLack0} 颗`)
  await page.check('#bs-spare')
  await page.click('#bs-copy-shop')
  await page.waitForFunction(() => /缺货清单已复制/.test(document.querySelector('#bs-saved-msg').textContent))
  await onTab('make')
  await regen(() => page.uncheck('#bs-owned'))
  sameCounts(await legend(), ORACLE.S1.counts, '关掉「只用库存色」')

  // ── 4. 照片：海边落日 60×40，限 12 色（S3）→ 抖动（S4）→ 杂色清理（S5）──
  await regen(() => page.click('#bs-samples [data-sample="sunset"]'))
  g = await grid()
  assert(g.w === 48 && g.h === 32, `照片默认宽 48、按比例高 32，实得 ${g.w}×${g.h}`)
  assert(await page.inputValue('#bs-resample') === 'area-linear', '照片应默认「面积平均（线性光）」')
  await regen(() => setNum('#bs-w', 60))
  assert(await page.inputValue('#bs-h') === '40', '锁比例时宽 60 → 高 40')
  await regen(() => setNum('#bs-k', 12))
  assert(await page.getAttribute('#bs-kchips [data-k="0"]', 'aria-pressed') === 'false', '自定义上限后「不限」芯片应取消选中')
  sameCounts(await legend(), ORACLE.S3.counts, 'S3 限 12 色')
  s = await status()
  assert(s.total === ORACLE.S3.total && s.colors === 12, `S3 应 ${ORACLE.S3.total} 颗 12 色，实得 ${s.total} 颗 ${s.colors} 色`)
  await regen(() => page.selectOption('#bs-dither', 'fs'))
  assert(await page.$eval('#bs-strength-row', (e) => getComputedStyle(e).display) !== 'none', '开抖动后应出现强度滑杆')
  sameCounts(await legend(), ORACLE.S4.counts, 'S4 Floyd–Steinberg')
  await regen(() => page.selectOption('#bs-dither', 'none'))
  assert(await page.$eval('#bs-strength-row', (e) => getComputedStyle(e).display) === 'none', '不抖动时强度滑杆的计算样式应为 none')
  sameCounts(await legend(), ORACLE.S3.counts, '关抖动回到 S3')
  await regen(() => page.selectOption('#bs-clean', '3'))
  sameCounts(await legend(), ORACLE.S5.counts, 'S5 杂色清理 <3')
  assert(/清理/.test(await page.textContent('#bs-status')), '状态栏应报清理了几块')
  // 照片下格子小（≤ 15px）时不写色号；放大到能写下为止，每个色号仍在格内
  await page.click('#bs-zin'); await page.click('#bs-zin'); await page.click('#bs-zin'); await page.click('#bs-zin')
  await drawn()
  const lab2 = await page.evaluate(() => window.BSApp.st.draw)
  assert(lab2.cell >= 16 && lab2.labels.length > 50, `放大后应画出色号，格 ${lab2.cell}px、${lab2.labels.length} 个`)
  assert(lab2.labels.every(([x, y, w, h, cx, cy]) => x >= cx + 0.5 && y >= cy + 0.5 && x + w <= cx + lab2.cell - 0.5 && y + h <= cy + lab2.cell - 0.5), '放大后的色号也必须落在各自格内')
  await page.click('#bs-zfit'); await drawn()
  const lab3 = await page.evaluate(() => window.BSApp.st.draw)
  let rulOv3 = 0
  for (let a = 0; a < lab3.rulers.length; a++) for (let b = a + 1; b < lab3.rulers.length; b++) {
    const A = lab3.rulers[a], B = lab3.rulers[b]
    if (A[4] === B[4] && Math.min(A[0] + A[2], B[0] + B[2]) - Math.max(A[0], B[0]) > 0.5 && Math.min(A[1] + A[3], B[1] + B[3]) - Math.max(A[1], B[1]) > 0.5) rulOv3++
  }
  assert(lab3.cell <= 14 && rulOv3 === 0 && lab3.rulers.filter((r) => r[4] === 'x').length >= 6, `60×40 适应窗口（格 ${lab3.cell}px）时标尺应稀疏且互不重叠：重叠 ${rulOv3}，x 标签 ${lab3.rulers.filter((r) => r[4] === 'x').length}`)
  // 拼板：60×40 用 29×29 板 → 3×2 = 6 块，逐块用量之和 = 总数
  await onTab('build')
  assert(await page.$$eval('#bs-boards .bs-chip', (n) => n.length) === 6, '60×40 用 29 板应分 6 块')
  let boardSum = 0
  for (let b = 0; b < 6; b++) {
    await page.click(`#bs-boards [data-board="${b}"]`)
    await page.waitForFunction((b) => document.querySelector('#bs-bcanvas').dataset.board === String(b), b)
    boardSum += await page.$$eval('#bs-btable tbody tr td.bs-num', (ts) => ts.reduce((a, t) => a + +t.textContent.replace(/,/g, ''), 0))
    if (b === 0) assert(+(await page.getAttribute('#bs-bcanvas', 'data-labels')) === 29 * 29, '第 1 块 29×29 板应写满 841 个色号')
  }
  assert(boardSum === ORACLE.S5.total, `各板用量之和 ${boardSum} ≠ 总数 ${ORACLE.S5.total}`)
  await onTab('make')
  // 复位：不限色、不清理（下一节的真值按默认参数算）
  await regen(() => page.click('#bs-kchips [data-k="0"]'))
  await regen(() => page.selectOption('#bs-clean', '0'))

  // ── 5. 导入 PNG + 去背景（S6）──
  const before6 = await page.evaluate(() => window.BSApp.st.seq)
  await page.setInputFiles('#bs-file', { name: 'circle.png', mimeType: 'image/png', buffer: Buffer.from(ORACLE.S6.png_b64, 'base64') })
  await page.waitForFunction((b) => {
    const A = window.BSApp, c = document.querySelector('#bs-canvas')
    return A.st.src && A.st.src.name === 'circle.png' && A.st.seq > b && c.dataset.busy === '0' && c.dataset.seq === String(A.st.seq)
  }, before6, { timeout: 20000 })
  g = await grid()
  assert(g.w === ORACLE.S6.w && g.h === ORACLE.S6.h, `导入的 PNG 应得到 ${ORACLE.S6.w}×${ORACLE.S6.h} 网格，实得 ${g.w}×${g.h}`)
  assert(await page.inputValue('#bs-name') === 'circle', '导入后图纸名应取文件名')
  await regen(() => page.check('#bs-bg'))
  assert(await page.inputValue('#bs-bgtol') === '12', '背景容差默认 12')
  const removed = await page.evaluate(() => window.BSApp.st.info.bgRemoved)
  assert(removed === ORACLE.S6.removed, `去背景应移除 ${ORACLE.S6.removed} 格，实得 ${removed}`)
  sameCounts(await legend(), ORACLE.S6.counts, 'S6 去背景后')
  s = await status()
  assert(s.total === ORACLE.S6.total && s.total + removed === ORACLE.S6.w * ORACLE.S6.h, `S6 剩余 ${s.total} 颗，真值 ${ORACLE.S6.total}`)
  // S10：粉色底（参考色的 a、b 远离 0）——白底的 S6 测不出「参考色只取明度」这类错
  await regen(() => page.setInputFiles('#bs-file', { name: 'pink.png', mimeType: 'image/png', buffer: Buffer.from(ORACLE.S10.png_b64, 'base64') }))
  assert(await page.evaluate(() => window.BSApp.st.src.name) === 'pink.png' && await page.isChecked('#bs-bg'), 'S10 应在去背景打开的状态下导入')
  const removed10 = await page.evaluate(() => window.BSApp.st.info.bgRemoved)
  assert(removed10 === ORACLE.S10.removed, `粉底去背景应移除 ${ORACLE.S10.removed} 格，实得 ${removed10}`)
  sameCounts(await legend(), ORACLE.S10.counts, 'S10 粉底去背景后')
  await regen(() => page.uncheck('#bs-bg'))
  // S9：像素画（各色用量悬殊）限 5 色 —— 落日照片里每种格色几乎只出现一次，测不出「淘汰代价要按用量加权」
  await regen(() => page.click('#bs-samples [data-sample="bubbletea"]'))
  await regen(() => setNum('#bs-k', 5))
  sameCounts(await legend(), ORACLE.S9.counts, 'S9 珍珠奶茶限 5 色')
  await regen(() => page.click('#bs-kchips [data-k="0"]'))

  // ── 6. 换品牌：南瓜灯 MARD → Perler「一一对应」（S7，匈牙利算法对 scipy）──
  await regen(() => page.click('#bs-samples [data-sample="pumpkin"]'))
  sameCounts(await legend(), ORACLE.S1.counts, '重新载入南瓜灯')
  await onTab('colors')
  await page.selectOption('#bs-tbrand', 'perler')
  await page.click('#bs-tmode [data-m="unique"]')
  await page.click('#bs-tpreview')
  await page.waitForFunction(() => document.querySelector('#bs-tsum').dataset.cost)
  const cost = +(await page.getAttribute('#bs-tsum', 'data-cost'))
  assert(Math.abs(cost - ORACLE.S7.cost) <= 1e-5, `一一对应总代价 ${cost} ≠ scipy 最优 ${ORACLE.S7.cost}`)
  const map = await page.$$eval('#bs-ttable tbody tr', (rs) => Object.fromEntries(rs.map((r) => [r.children[0].textContent.trim(), r.children[1].textContent.trim()])))
  sameCounts(map, ORACLE.S7.map, 'S7 映射表')
  assert(new Set(Object.values(map)).size === Object.keys(map).length, '一一对应不应有两色并到同一色号')
  await page.click('#bs-tapply')
  await onTab('make')
  await drawn()
  const mapped = {}
  for (const [c, n] of Object.entries(ORACLE.S1.counts)) mapped[ORACLE.S7.map[c]] = (mapped[ORACLE.S7.map[c]] || 0) + n
  sameCounts(await legend(), mapped, '应用换算后')
  assert(await page.inputValue('#bs-brand') === 'perler', '应用后品牌选择应跟着变成 Perler')
  assert(await page.$eval('#bs-lockbar', (e) => getComputedStyle(e).display) !== 'none', '换算属于手动修改，应出现锁定条')
  await page.click('#bs-undo'); await drawn()
  sameCounts(await legend(), ORACLE.S1.counts, '撤销换算')
  await page.click('#bs-redo'); await drawn()
  sameCounts(await legend(), mapped, '重做换算')
  await page.click('#bs-undo'); await drawn()

  // ── 7. 编辑工具：画笔 / 填充（对测试侧独立 BFS）/ 吸管 / 橡皮 / 撤销 ──
  g = await grid()
  const P = await page.evaluate(() => ({ codes: BS.palette('mard').codes, hex: BS.palette('mard').hex }))
  const cellCenter = (i, j) => page.evaluate(([i, j]) => {
    const sc = document.querySelector('#bs-scroller'), r = sc.getBoundingClientRect(), c = window.BSApp.st.view.cell
    return { x: r.left + 34 + i * c - sc.scrollLeft + c / 2, y: r.top + 24 + j * c - sc.scrollTop + c / 2 }
  }, [i, j])
  const clickCell = async (i, j) => { const p = await cellCenter(i, j); await page.mouse.click(p.x, p.y) }
  const codeAt = (G, i, j) => { const k = G.idx[j * G.w + i]; return k < 0 ? null : P.codes[k] }
  // 选用量第二多的颜色当画笔：点色号清单那一行
  const second = Object.entries(ORACLE.S1.counts).sort((a, b) => b[1] - a[1])[1][0]
  await page.click(`#bs-legend-rows .bs-lrow[data-code="${second}"] .bs-lbtn`)
  assert(await page.textContent('#bs-paint-code') === second, `点清单行后画笔应是 ${second}`)
  await page.click(`#bs-legend-rows .bs-lrow[data-code="${second}"] .bs-lbtn`)   // 再点一次取消高亮
  await drawn()
  await page.click('#bs-tools [data-tool="pen"]')
  const target = [8, 7]                                 // 南瓜身上一格（原色不是 second）
  assert(codeAt(g, ...target) !== second, '测试前提：目标格原色不同于画笔色')
  const was = codeAt(g, ...target)
  await clickCell(...target); await drawn()
  let g2 = await grid()
  assert(codeAt(g2, ...target) === second, '画笔应把目标格改成画笔色')
  let L = await legend()
  assert(L[second] === ORACLE.S1.counts[second] + 1 && (L[was] || 0) === ORACLE.S1.counts[was] - 1, '色号清单的计数应 +1/−1')
  assert(await cellPixel(...target) === P.hex[P.codes.indexOf(second)], '画布上目标格应立即变色')
  assert(await page.$eval('#bs-lockbar', (e) => getComputedStyle(e).display) !== 'none', '手动修改后应出现锁定条')
  // 锁定后改参数不会重算
  const seqLock = await page.evaluate(() => window.BSApp.st.seq)
  await page.selectOption('#bs-metric', 'de76')
  await page.waitForTimeout(400)   // 等防抖窗口过去，再看序号（防抖本身是 120 ms）
  const seqAfter = await page.evaluate(() => window.BSApp.st.seq)
  assert(seqAfter === seqLock, '有手动修改时改参数不应重新生成')
  await page.selectOption('#bs-metric', 'de2000')
  await page.keyboard.press('Control+z'); await drawn()
  g2 = await grid()
  assert(codeAt(g2, ...target) === was, 'Ctrl+Z 应撤销画笔')
  // 填充：在测试侧用独立 BFS 算出期望结果
  await page.click('#bs-tools [data-tool="fill"]')
  const seedFill = [7, 8]
  const G0 = await grid()
  const from = G0.idx[seedFill[1] * 16 + seedFill[0]], to = P.codes.indexOf(second)
  const expect = G0.idx.slice(), q = [seedFill[1] * 16 + seedFill[0]], seen = new Set(q)
  while (q.length) {
    const c = q.pop(); expect[c] = to
    const x = c % 16, y = (c - x) / 16
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy
      if (nx < 0 || ny < 0 || nx >= 16 || ny >= 16) continue
      const n = ny * 16 + nx
      if (!seen.has(n) && G0.idx[n] === from) { seen.add(n); q.push(n) }
    }
  }
  await clickCell(...seedFill); await drawn()
  g2 = await grid()
  assert(g2.idx.every((v, i) => v === expect[i]), `填充结果与独立 BFS 不符（区域 ${seen.size} 格）`)
  assert(seen.size > 1, '测试前提：填充区域应不止一格')
  // 吸管：吸到画笔后自动切回画笔
  await page.click('#bs-tools [data-tool="pick"]')
  await clickCell(0, 7)
  assert(await page.textContent('#bs-paint-code') === codeAt(g2, 0, 7), '吸管应吸到该格色号')
  assert(await page.getAttribute('#bs-tools [data-tool="pen"]', 'aria-pressed') === 'true', '吸完应切回画笔')
  // 橡皮
  await page.click('#bs-tools [data-tool="erase"]')
  const tot0 = (await status()).total
  await clickCell(7, 0); await drawn()
  assert((await status()).total === tot0 - 1, '橡皮擦掉一颗，总数应 −1')
  assert(await cellPixel(7, 0) === '#FFFFFF', '擦掉的格子画布应为空白')
  await page.click('#bs-undo'); await drawn()
  assert((await status()).total === tot0, '撤销橡皮')

  // ── 8. 「重新生成」解锁；拼完进度；离页补写 ──
  await regen(() => page.click('#bs-regen'))
  sameCounts(await legend(), ORACLE.S1.counts, '重新生成后')
  assert(await page.$eval('#bs-lockbar', (e) => getComputedStyle(e).display) === 'none', '重新生成后锁定条的计算样式应为 none')
  const topCode = Object.entries(ORACLE.S1.counts).sort((a, b) => b[1] - a[1])[0]
  await page.check(`#bs-legend-rows .bs-lrow[data-code="${topCode[0]}"] input[type=checkbox]`)
  await onTab('build')
  assert(+(await page.$eval('#bs-prog-text', (e) => e.dataset.pct)) === Math.round(topCode[1] / ORACLE.S1.total * 100), '施工进度百分比应 = 拼完色的用量 / 总数')
  // 预览：镜像后左上角的豆子 = 原图右上角那格
  await page.click('#bs-pmode [data-pm="chart"]')
  await page.check('#bs-pmirror')
  const mir = await page.evaluate(() => {
    const cv = document.querySelector('#bs-pcanvas'), c = +cv.dataset.cell, dpr = cv.width / parseFloat(cv.style.width)
    const d = cv.getContext('2d').getImageData(Math.round(c * 7.5 * dpr), Math.round(c * 1.5 * dpr), 1, 1).data
    return { mirror: cv.dataset.mirror, px: '#' + [d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase() }
  })
  g = await grid()
  const src8 = g.idx[1 * 16 + 8], src7 = g.idx[1 * 16 + 7]
  assert(src8 >= 0 && src7 >= 0 && P.hex[src8] !== P.hex[src7], '测试前提：叶柄第 8、9 列颜色不同（左右不对称）')
  assert(mir.mirror === '1' && mir.px === P.hex[src8], `镜像预览第 2 行第 8 列应是原图第 9 列的颜色 ${P.hex[src8]}，实得 ${mir.px}`)
  await page.uncheck('#bs-pmirror')
  await page.click('#bs-pmode [data-pm="bead"]')
  await onTab('make')
  // 改一格后立刻刷新：防抖存盘必须在 pagehide 补写
  await page.click('#bs-tools [data-tool="erase"]')
  await clickCell(3, 7)
  const gridBefore = (await grid()).idx.join(',')
  await page.reload()
  await settled()
  const gridAfter = (await grid()).idx.join(',')
  assert(gridAfter === gridBefore, '改完立刻刷新，图纸应原样恢复（pagehide 补写）')
  assert(await page.isChecked(`#bs-legend-rows .bs-lrow[data-code="${topCode[0]}"] input[type=checkbox]`), '「拼完」勾选应随刷新保留')
  assert(await page.$eval('#bs-lockbar', (e) => getComputedStyle(e).display) !== 'none', '刷新后仍应记得有手动修改')

  // ── 9. 我的图纸：保存 / 刷新后仍在 / 打开 / 复制 / 两步删除 / 导出导入 ──
  await page.fill('#bs-name', '测试南瓜')
  await page.click('#bs-save')
  await page.waitForFunction(() => /已保存/.test(document.querySelector('#bs-saved-msg').textContent))
  await page.reload(); await settled()
  await onTab('saved')
  assert(await page.$$eval('#bs-masonry .bs-mcard', (n) => n.length) === 1, '保存后「我的图纸」应有 1 张')
  assert(await page.textContent('#bs-masonry .bs-mtitle') === '测试南瓜', '卡片标题应为保存时的名字')
  await page.click('#bs-masonry [data-act="dup"]')
  assert(await page.$$eval('#bs-masonry .bs-mcard', (n) => n.length) === 2, '复制后应有 2 张')
  const [dlAll] = await Promise.all([page.waitForEvent('download'), page.click('#bs-export-all')])
  const backup = JSON.parse(fs.readFileSync(await dlAll.path(), 'utf8'))
  assert(backup.app === 'bead-studio' && backup.projects.length === 2 && backup.inv.mard.A1.q === 500, '导出全部应含 2 张图纸与库存')
  const del = page.locator('#bs-masonry .bs-mcard').nth(0).locator('[data-act="del"]')
  await del.click()
  assert(await page.$$eval('#bs-masonry .bs-mcard', (n) => n.length) === 2, '删除要点两次，第一次不删')
  await del.click()
  await page.waitForFunction(() => document.querySelectorAll('#bs-masonry .bs-mcard').length === 1)
  backup.projects[0].id = 'p-imported'; backup.projects[0].name = '导入的南瓜'
  backup.projects.push({ id: 'p-bad', name: '坏的', brand: 'mard', w: 4, h: 4, grid: '@@@' })
  // 编码本身合法、但下标 400 超出 MARD 291 色：必须拒收（对拍台 BUGS.md 观察 3）
  const oob = await page.evaluate(() => BS.encodeGrid(Int16Array.from([400, 400, 400, 400])))
  backup.projects.push({ id: 'p-oob', name: '越界', brand: 'mard', w: 2, h: 2, grid: oob })
  await page.setInputFiles('#bs-import', { name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) })
  await page.waitForFunction(() => !document.querySelector('#bs-saved-note').hidden)
  assert(/导入 2 张图纸，跳过 2 张/.test(await page.textContent('#bs-saved-note')), `导入提示不对：${await page.textContent('#bs-saved-note')}`)
  // 本地剩「测试南瓜」1 张；导入改了 id 的那张 + 本地已删的副本 → 3 张
  assert(await page.$$eval('#bs-masonry .bs-mcard', (n) => n.length) === 3, '导入后应有 3 张')
  await page.evaluate(() => { document.querySelector('#bs-saved-note').hidden = true })
  await page.setInputFiles('#bs-import', { name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) })
  await page.waitForFunction(() => !document.querySelector('#bs-saved-note').hidden)
  assert(await page.$$eval('#bs-masonry .bs-mcard', (n) => n.length) === 3, '同一份备份再导一次，同 id 不应重复（仍 3 张）')
  await page.locator('#bs-masonry .bs-mcard', { hasText: '导入的南瓜' }).locator('[data-act="open"]').click()
  await settled()
  assert(await page.inputValue('#bs-name') === '导入的南瓜', '打开后名字应切换')
  assert((await grid()).idx.join(',') === gridBefore, '打开的图纸内容应与保存时一致')

  // ── 10. 导出 PNG / CSV；打印版式 ──
  const [dlPng] = await Promise.all([page.waitForEvent('download'), page.click('#bs-export-png')])
  const png = fs.readFileSync(await dlPng.path())
  assert(png.slice(1, 4).toString() === 'PNG' && png.readUInt32BE(16) >= 520 && png.readUInt32BE(20) > 16 * 22, `导出的 PNG 尺寸不对：${png.readUInt32BE(16)}×${png.readUInt32BE(20)}`)
  const [dlCsv] = await Promise.all([page.waitForEvent('download'), page.click('#bs-export-csv')])
  const csv = fs.readFileSync(await dlCsv.path(), 'utf8')
  const lines = csv.replace(/^﻿/, '').trim().split(/\r?\n/)
  const Lnow = await legend()
  assert(csv.charCodeAt(0) === 0xFEFF && lines[0] === '色号,名称,色值,数量,库存,缺口' && lines.length === Object.keys(Lnow).length + 1, 'CSV 应带 BOM、表头与每色一行')
  assert(lines.slice(1).every((l) => { const f = l.split(','); return Lnow[f[0]] === +f[3] }), 'CSV 数量应与色号清单一致')
  await page.evaluate(() => window.BSApp.preparePrint())
  await page.waitForFunction(() => { const i = document.querySelector('#bs-print img'); return i && i.complete && i.naturalWidth > 0 })
  await page.emulateMedia({ media: 'print' })
  const pr = await page.evaluate(() => [getComputedStyle(document.querySelector('#bs-print')).display, getComputedStyle(document.querySelector('#bs-panes')).display, getComputedStyle(document.querySelector('.bs-nav')).display])
  assert(pr[0] === 'block' && pr[1] === 'none' && pr[2] === 'none', `打印版式应只显示图纸：${pr.join(',')}`)
  await page.emulateMedia({ media: 'screen' })

  // ── 11. 色号换算：MARD A1 在各品牌的最近色 = 暴力最近（页面口径的同源检查只验表格完整）──
  await onTab('colors')
  await page.fill('#bs-xcode', 'h1')
  await page.waitForFunction(() => document.querySelectorAll('#bs-xtable tbody tr[data-brand]').length === 8)
  await page.fill('#bs-xcode', 'ZZ9')
  await page.waitForFunction(() => /没有色号/.test(document.querySelector('#bs-xtable tbody').textContent))

  // ── 12. 渲染守卫 ──
  await onTab('make')
  await guardHidden(page, { assert, panesRoot: '#bs-panes', tabs: TABS })
  await guardUniqueIds(page, { assert, minIds: 80 })
  const nCtl = await guardControlSize(page, { assert, tabs: TABS, onTab, paneSel: (t) => '#pane-' + t, minControls: 300 })
  await guardTextTransform(page, { assert, tabs: TABS, onTab, paneSel: (t) => '#pane-' + t, labelSel: 'th, dt, label, .bs-lbl, .bs-pill, .bs-lcode' })
  await guardOverflow(page, { assert, tabs: TABS, onTab, panesRoot: 'body', viewports: [390, 768, 1280] })
  for (const t of TABS) {
    await onTab(t)
    await guardEscape(page, { assert, cardSel: '.bs-card, .bs-swc, .bs-mcard', childSel: 'h2,h3,p,.bs-row,.bs-range,.bs-drop,.bs-samples,.bs-tscroll,.bs-bview,.bs-pill,.bs-qty' })
  }
  assert(nCtl >= 300, `各页签累计控件 ${nCtl}`)
  assert(consoleErrors.length === 0, `控制台报错：${consoleErrors.slice(0, 3).join(' | ')}`)

  // ── 缩略图：先把库存清零（UI 操作），再拍南瓜灯图纸（色块 + 色号）──
  await onTab('colors')
  await page.click('#bs-cbrands [data-brand="mard"]')
  await page.click('#bs-cfilter [data-f="own"]')
  for (const code of Object.keys(stock)) {
    const sel = `#bs-swgrid .bs-swc[data-code="${code}"] .bs-qty`
    if (await page.$(sel)) { await page.fill(sel, ''); await page.dispatchEvent(sel, 'change') }
  }
  await page.click('#bs-cfilter [data-f="all"]')
  await page.click('#bs-cfilter [data-f="own"]')
  assert(await page.$eval('#bs-swgrid', (e) => +e.dataset.shown) === 0, '库存清零后「有库存」应一个不剩')
  await onTab('make')
  await regen(() => page.click('#bs-samples [data-sample="pumpkin"]'))
  await page.evaluate(() => window.scrollTo(0, 0))
  await screenshot('thumb.png')
}
