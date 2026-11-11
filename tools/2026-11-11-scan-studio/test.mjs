// 扫描工坊 · 集成测试
// 真值来源（一个手打的魔数都不留，全部现场算）：
//  · 照片：本文件自带的「针孔相机」合成器 —— 纸面内容程序生成，按相机位姿投影到桌面上，角点、纸面任一点的像位置都精确已知；
//    合成器、PNG 编码、单应求解都是本文件独立实现，不调页面引擎。
//  · 尺寸：ISO 216 / ISO/IEC 7810 的毫米数按 mm/25.4×dpi 现场换算。
//  · 黑白：本文件按 scikit-image threshold_sauvola / threshold_otsu 的口径独立重写（float64 积分图），逐像素比页面输出。
//  · PDF：本文件自带的最小 PDF 解析器（xref 偏移、MediaBox、图像字典、cm 矩阵、Flate 用 zlib.inflateSync 解）。
// 可选外部校验器（路径走环境变量，测试本身不依赖本机装了什么）：
//  SS_POPPLER=<poppler bin 目录>（pdfinfo / pdfimages / pdftoppm）；SS_PY=<装了 scikit-image 与 pikepdf 的 python>
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import zlib from 'node:zlib'
import { execFileSync } from 'node:child_process'
import { renderGuards, guardBoxOverlap } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const MM = 25.4
const PT = 72 / MM
const A4 = { w: 210, h: 297 }          // ISO 216
const ID1 = { w: 85.6, h: 54 }         // GB/T 16649 二代证（ISO/IEC 7810 ID-1 为 85.60×53.98）
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'ss-test-'))

// ———————————————— 独立的合成器 ————————————————
function rng(seed) { let x = seed >>> 0 || 1; return () => { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296 } }
function rotM(ax, ay, az) {
  const [cx, sx, cy, sy, cz, sz] = [Math.cos(ax), Math.sin(ax), Math.cos(ay), Math.sin(ay), Math.cos(az), Math.sin(az)]
  const Rx = [[1, 0, 0], [0, cx, -sx], [0, sx, cx]], Ry = [[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]], Rz = [[cz, -sz, 0], [sz, cz, 0], [0, 0, 1]]
  const mul = (A, B) => A.map((r, i) => B[0].map((_, j) => r.reduce((s, _, k) => s + A[i][k] * B[k][j], 0)))
  return mul(Rz, mul(Ry, Rx))
}
// 纸面 (u,v)∈[0,1]² ↦ 图像：相机在原点、焦距 f·对角线、主点在画面中心
function projector(wmm, hmm, W, H, cam) {
  const R = rotM(cam.ax, cam.ay, cam.az), f = cam.f * Math.hypot(W, H)
  return (u, v) => {
    const x = (u - 0.5) * wmm, y = (v - 0.5) * hmm
    const c = [R[0][0] * x + R[0][1] * y, R[1][0] * x + R[1][1] * y, R[2][0] * x + R[2][1] * y + cam.Z]
    return [f * c[0] / c[2] + W / 2, f * c[1] / c[2] + H / 2]
  }
}
function solve8(src, dst) {
  const A = []
  for (let i = 0; i < 4; i++) { const [x, y] = src[i], [X, Y] = dst[i]; A.push([x, y, 1, 0, 0, 0, -X * x, -X * y, X], [0, 0, 0, x, y, 1, -Y * x, -Y * y, Y]) }
  for (let k = 0; k < 8; k++) {
    let p = k; for (let i = k + 1; i < 8; i++) if (Math.abs(A[i][k]) > Math.abs(A[p][k])) p = i
    ;[A[k], A[p]] = [A[p], A[k]]
    for (let i = k + 1; i < 8; i++) { const f = A[i][k] / A[k][k]; for (let j = k; j < 9; j++) A[i][j] -= f * A[k][j] }
  }
  const h = new Array(8); for (let i = 7; i >= 0; i--) { let s = A[i][8]; for (let j = i + 1; j < 8; j++) s -= A[i][j] * h[j]; h[i] = s / A[i][i] }
  return [...h, 1]
}
const docInk = [34, 35, 40], RED = [205, 40, 45], BLUE = [30, 70, 200]
// 文档：标题条、正文行、表格、左上蓝方块、右下红方块（方块按毫米画成正方形，便于求质心）
function docContent(wmm, hmm) {
  const sq = 18 / wmm, sqv = 18 / hmm
  return (u, v) => {
    if (u > 0.1 && u < 0.1 + sq && v > 0.06 && v < 0.06 + sqv) return BLUE
    if (u > 0.72 && u < 0.72 + sq && v > 0.86 && v < 0.86 + sqv) return RED
    if (v > 0.07 && v < 0.095 && u > 0.32 && u < 0.7) return docInk
    for (let k = 0; k < 12; k++) { const y0 = 0.15 + k * 0.034; if (v > y0 && v < y0 + 0.012 && u > 0.1 && u < (k % 4 === 3 ? 0.55 : 0.9) && ((u * 131) | 0) % 9) return docInk }
    if (u > 0.1 && u < 0.9 && v > 0.6 && v < 0.8) {
      for (const g of [0.6, 0.65, 0.7, 0.75, 0.8]) if (Math.abs(v - g) < 0.0016) return docInk
      for (const g of [0.1, 0.4, 0.65, 0.9]) if (Math.abs(u - g) < 0.0022) return docInk
    }
    return [243, 241, 235]
  }
}
function cardContent(side) {
  return (u, v) => {
    if (u > 0.06 && u < 0.14 && v > 0.08 && v < 0.2) return RED
    if (side === 'front' && u > 0.66 && u < 0.92 && v > 0.18 && v < 0.78) return [150, 158, 172]
    for (let k = 0; k < 4; k++) { const y0 = 0.3 + k * 0.14; if (v > y0 && v < y0 + 0.05 && u > 0.08 && u < (side === 'front' ? 0.55 : 0.85) - 0.04 * k) return [38, 42, 50] }
    const t = 6 * Math.sin(u * 50 + v * 18)
    return [212 + t, 224 + t, 236 + t]
  }
}
const BG = {
  wood: (x, y) => { const g = Math.sin(x * 0.04 + Math.sin(y * 0.011) * 4) * 0.5 + 0.5; return [118 + 40 * g, 76 + 26 * g, 44 + 14 * g] },
  gray: () => [204, 202, 198],
  cloth: (x, y) => (((Math.floor(x / 16) + Math.floor(y / 16)) & 1) ? [72, 108, 160] : [228, 228, 234]),
  dark: () => [44, 46, 52],
}
function makePhoto({ W, H, wmm, hmm, cam, bg, light = [1, 0, 0], seed = 1, content }) {
  const proj = projector(wmm, hmm, W, H, cam)
  const corners = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([u, v]) => proj(u, v))
  for (const [x, y] of corners) if (x < 2 || y < 2 || x > W - 2 || y > H - 2) throw new Error('合成场景的纸张出画了：' + x.toFixed(1) + ',' + y.toFixed(1))
  const Hm = solve8(corners, [[0, 0], [1, 0], [1, 1], [0, 1]])
  const rgba = Buffer.alloc(W * H * 4), rnd = rng(seed), bgf = BG[bg]
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let r = 0, g = 0, b = 0
    for (let sy = 0; sy < 2; sy++) for (let sx = 0; sx < 2; sx++) {
      const X = x + 0.25 + 0.5 * sx, Y = y + 0.25 + 0.5 * sy, z = Hm[6] * X + Hm[7] * Y + 1
      const u = (Hm[0] * X + Hm[1] * Y + Hm[2]) / z, v = (Hm[3] * X + Hm[4] * Y + Hm[5]) / z
      const c = (u >= 0 && u <= 1 && v >= 0 && v <= 1) ? content(u, v) : bgf(X, Y)
      r += c[0]; g += c[1]; b += c[2]
    }
    const L = light[0] + light[1] * (x / W - 0.5) + light[2] * (y / H - 0.5), o = (y * W + x) * 4
    for (const [k, c] of [[0, r], [1, g], [2, b]]) rgba[o + k] = Math.max(0, Math.min(255, Math.round(c / 4 * L + (rnd() - 0.5) * 6)))
    rgba[o + 3] = 255
  }
  return { rgba, W, H, corners, proj }
}
function png(rgba, W, H) {
  const raw = Buffer.alloc((W * 4 + 1) * H)
  for (let y = 0; y < H; y++) { raw[y * (W * 4 + 1)] = 0; rgba.copy(raw, y * (W * 4 + 1) + 1, y * W * 4, (y + 1) * W * 4) }
  const chunk = (t, d) => { const len = Buffer.alloc(4); len.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t, 'latin1'), d]); const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(td)); return Buffer.concat([len, td, crc]) }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 6
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}
const fileOf = (name, ph) => ({ name, mimeType: 'image/png', buffer: png(ph.rgba, ph.W, ph.H) })
const maxErr = (q, gt) => Math.max(...q.map((p, i) => Math.hypot(p[0] - gt[i][0], p[1] - gt[i][1])))

// ———————————————— 独立的黑白二值化（skimage 口径） ————————————————
function reflect(i, n) { return i < 0 ? -i : i >= n ? 2 * n - 2 - i : i }
function sauvolaRef(g, w, h, win, k, R) {
  const rad = win >> 1, pw = w + 2 * rad, ph = h + 2 * rad, S = pw + 1
  const I = new Float64Array(S * (ph + 1)), I2 = new Float64Array(S * (ph + 1))
  for (let y = 0; y < ph; y++) for (let x = 0; x < pw; x++) {
    const v = g[reflect(y - rad, h) * w + reflect(x - rad, w)]
    I[(y + 1) * S + x + 1] = v + I[y * S + x + 1] + I[(y + 1) * S + x] - I[y * S + x]
    I2[(y + 1) * S + x + 1] = v * v + I2[y * S + x + 1] + I2[(y + 1) * S + x] - I2[y * S + x]
  }
  const n = win * win, out = new Uint8Array(w * h)
  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) {
    const a = i * S + j, b = i * S + j + win, c = (i + win) * S + j, d = (i + win) * S + j + win
    const m = (I[d] - I[b] - I[c] + I[a]) / n, g2 = (I2[d] - I2[b] - I2[c] + I2[a]) / n
    const vv = g2 - m * m, s = Math.sqrt(vv > 0 ? vv : 0), T = m * (1 + k * ((s / R) - 1))
    out[i * w + j] = g[i * w + j] > T ? 1 : 0
  }
  return out
}
function otsuRef(g) {
  let lo = 255, hi = 0; for (const v of g) { if (v < lo) lo = v; if (v > hi) hi = v }
  const m = hi - lo + 1, hist = new Float64Array(m); for (const v of g) hist[v - lo]++
  const c = (i) => lo + i
  const w1 = [], m1 = [], w2 = new Array(m), m2 = new Array(m); let a = 0, b = 0
  for (let i = 0; i < m; i++) { a += hist[i]; b += hist[i] * c(i); w1.push(a); m1.push(b / a) }
  a = 0; b = 0; for (let i = m - 1; i >= 0; i--) { a += hist[i]; b += hist[i] * c(i); w2[i] = a; m2[i] = b / a }
  let best = -1, bi = 0
  for (let i = 0; i < m - 1; i++) { const v = w1[i] * w2[i + 1] * (m1[i] - m2[i + 1]) ** 2; if (v > best) { best = v; bi = i } }
  return c(bi)
}

// ———————————————— 独立的最小 PDF 解析器 ————————————————
function parsePDF(buf) {
  const s = buf.toString('latin1')
  if (!s.startsWith('%PDF-')) throw new Error('不是 PDF')
  const sx = s.lastIndexOf('startxref'), xrefAt = parseInt(s.slice(sx + 9).trim(), 10)
  if (s.slice(xrefAt, xrefAt + 4) !== 'xref') throw new Error('startxref 没指到 xref')
  const head = /xref\n0 (\d+)\n/.exec(s.slice(xrefAt)), n = +head[1], base = xrefAt + head[0].length
  const objs = {}
  for (let i = 1; i < n; i++) {
    const off = parseInt(s.slice(base + i * 20, base + i * 20 + 10), 10)
    if (!s.startsWith(i + ' 0 obj', off)) throw new Error(`xref 偏移错：对象 ${i} 不在 ${off}`)
    const end = s.indexOf('endobj', off), body = s.slice(off, end)
    const o = { id: i, dict: body.slice(body.indexOf('<<'), body.indexOf('stream') > 0 ? body.indexOf('stream') : undefined) }
    const st = body.indexOf('stream\n')
    if (st >= 0) { const len = +/\/Length (\d+)/.exec(o.dict)[1], at = off + st + 7; o.data = buf.subarray(at, at + len); if (s.slice(at + len, at + len + 10) !== '\nendstream') throw new Error(`对象 ${i} 的 /Length 不对`) }
    objs[i] = o
  }
  const trailer = s.slice(s.indexOf('trailer', xrefAt))
  const root = +/\/Root (\d+) 0 R/.exec(trailer)[1], size = +/\/Size (\d+)/.exec(trailer)[1]
  const pagesId = +/\/Pages (\d+) 0 R/.exec(objs[root].dict)[1]
  const kids = [...objs[pagesId].dict.match(/\/Kids \[([^\]]*)\]/)[1].matchAll(/(\d+) 0 R/g)].map((m) => +m[1])
  const pages = kids.map((k) => {
    const d = objs[k].dict, mb = /\/MediaBox \[([^\]]+)\]/.exec(d)[1].trim().split(/\s+/).map(Number)
    const content = objs[+/\/Contents (\d+) 0 R/.exec(d)[1]].data.toString('latin1')
    const cms = [...content.matchAll(/([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+) cm\n\/(\w+) Do/g)].map((m) => ({ a: +m[1], d: +m[4], e: +m[5], f: +m[6], name: m[7] }))
    const xo = {}; for (const m of d.matchAll(/\/(Im\d+) (\d+) 0 R/g)) xo[m[1]] = objs[+m[2]]
    const imgs = cms.map((c) => {
      const o = xo[c.name], dd = o.dict
      return { ...c, w: +/\/Width (\d+)/.exec(dd)[1], h: +/\/Height (\d+)/.exec(dd)[1], bpc: +/\/BitsPerComponent (\d+)/.exec(dd)[1], filter: /\/Filter \/(\w+)/.exec(dd)[1], cs: /\/ColorSpace \/(\w+)/.exec(dd)[1], data: o.data }
    })
    return { mb, imgs }
  })
  return { pages, size, n }
}
function jpegDims(b) {
  let i = 2
  while (i < b.length) { if (b[i] !== 0xff) { i++; continue } const mk = b[i + 1]; if (mk >= 0xc0 && mk <= 0xc2) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) }; i += 2 + b.readUInt16BE(i + 2) }
  return null
}
const near = (a, b, tol) => Math.abs(a - b) <= tol

export default async ({ page, toolURL, screenshot, assert }) => {
  const errs = []
  page.on('pageerror', (e) => errs.push(String(e)))
  const tabOf = async (t) => { await page.click('#tab-' + t); await page.waitForFunction((t) => !document.getElementById('pane-' + t).hidden, t) }
  const waitScan = () => page.waitForFunction(() => { const c = document.getElementById('ss-out'); return !!c.dataset.key && c.dataset.key === window.SS.pageKey() }, null, { timeout: 30000 })
  const waitID = () => page.waitForFunction(() => { const c = document.getElementById('ss-a4'); return !!c.dataset.key && c.dataset.key === window.SS.idKey() }, null, { timeout: 30000 })
  const outDims = () => page.evaluate(() => { const c = document.getElementById('ss-out'); return [c.width, c.height] })
  // 加页要先等「页数 +1 且选中新页」，再等渲染键：只等渲染键的话，上一页的键在新页读进来之前就对得上（假绿 / 读错页）
  const addPhoto = async (file) => {
    const n0 = await page.evaluate(() => SS.pages.length)
    await page.setInputFiles('#ss-file', file)
    await page.waitForFunction((n0) => SS.pages.length === n0 + 1 && SS.cur() === n0, n0, { timeout: 30000 })
    await waitScan()
  }
  const px = (mm, dpi) => Math.round(mm / MM * dpi)

  await page.goto(toolURL)
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  // ── 0. 外壳 ──
  assert((await page.title()).includes('扫描工坊'), '标题')
  assert(await page.$eval('a.ss-back', (a) => a.getAttribute('href')) === '../../', '返回工具集链接')
  assert((await page.$$('.ss-tab')).length === 4, '四个页签')
  assert(await page.$eval('#pane-id', (p) => getComputedStyle(p).display) === 'none', '非当前页签按计算样式藏住')

  // ── 0b. 拉平的超采样：400×400 的 1 像素棋盘缩到 100×100，不超采样会出摩尔纹（输出仍是黑白交替），超采样后应接近均匀灰 ──
  const alias = await page.evaluate(() => {
    const n = 400, src = new Uint8ClampedArray(n * n * 4)
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const v = ((x + y) & 1) ? 255 : 0, o = (y * n + x) * 4; src[o] = src[o + 1] = src[o + 2] = v; src[o + 3] = 255 }
    const r = SS.E.warp(src, n, n, [[0, 0], [n, 0], [n, n], [0, n]], 97, 97, {})
    let s = 0, s2 = 0; const m = 97 * 97
    for (let i = 0; i < m; i++) { const v = r.data[i * 4]; s += v; s2 += v * v }
    return { ss: r.ss, mean: s / m, std: Math.sqrt(s2 / m - (s / m) ** 2) }
  })
  assert(alias.ss === 3 && Math.abs(alias.mean - 127.5) < 6 && alias.std < 30, `缩小拉平自动 3×3 超采样、无摩尔纹 ${JSON.stringify(alias)}`)

  // ── 0c. 去阴影的光照场先做 3×3 分块闭运算：纸上 2.5 个分块宽的深色块（照片、印章）不能被当成「暗处的纸」提白 ──
  //     期望值 = 60 × 250 / 236（引擎目标纸色 250、纸 236）≈ 63.6；不做闭运算时实测提到 90（dev/closing.mjs）；≥3 块宽的大块闭运算也救不了，不在此测
  const blk = await page.evaluate(() => {
    const n = 960, src = new Uint8ClampedArray(n * n * 4)
    for (let i = 0; i < n * n; i++) { src[i * 4] = src[i * 4 + 1] = src[i * 4 + 2] = 236; src[i * 4 + 3] = 255 }
    const bs = Math.max(8, Math.round(n / 48)), x0 = 10 * bs, x1 = x0 + Math.round(2.5 * bs)   // 分块口径同引擎：长边 / 48
    for (let y = x0; y < x1; y++) for (let x = x0; x < x1; x++) { const o = (y * n + x) * 4; src[o] = src[o + 1] = src[o + 2] = 60 }
    const r = SS.E.enhance(src, n, n, 'clean', {}), c = Math.round((x0 + x1) / 2)
    return { center: r.rgba[(c * n + c) * 4], paper: r.rgba[(5 * n + 5) * 4] }
  })
  assert(blk.center >= 58 && blk.center <= 70 && blk.paper >= 248, `去阴影不把 2.5 块宽的深色块提白：中心 ${blk.center}（≈64）、纸 ${blk.paper}`)

  // ── 1. A4 通知拍在木纹桌上：找角、透视比例、套 A4、拉平后两个色块落在纸面原位 ──
  const camA = { f: 1.0, ax: 0.3, ay: -0.18, az: 0.08, Z: 700 }
  const A = makePhoto({ W: 1400, H: 1050, wmm: A4.w, hmm: A4.h, cam: camA, bg: 'wood', seed: 3, content: docContent(A4.w, A4.h) })
  await addPhoto(fileOf('notice.png', A))
  const dA = await page.evaluate(() => { const p = SS.curPage(); return { quad: p.det.quad, found: p.det.found, score: p.det.score, w: p.w, h: p.h } })
  assert(dA.found && dA.w === 1400 && dA.h === 1050, `A：检测到纸张且没有缩图 ${JSON.stringify([dA.found, dA.w, dA.h])}`)
  const eA = maxErr(dA.quad, A.corners)
  assert(eA <= 1.0, `A：四角最大误差 ${eA.toFixed(3)} px ≤ 1.0`)
  assert(await page.$eval('#ss-conf', (e) => e.dataset.level) === 'high', 'A：可信度为高')
  const matchA = await page.$eval('#ss-match', (e) => e.textContent)
  assert(/^A4 竖/.test(matchA) && /已套用/.test(matchA), 'A：自动套用 A4 竖：' + matchA)
  const devA = +/偏差 ([\d.]+)%/.exec(matchA)[1]
  assert(devA <= 0.2, `A：透视反推比例与 A4 偏差 ${devA}% ≤ 0.2%`)
  let dims = await outDims()
  assert(dims[0] === px(A4.w, 200) && dims[1] === px(A4.h, 200), `A：输出 = A4@200dpi ${dims}`)
  // 拉平后的色块质心 —— 期望位置由合成器的纸面坐标直接换算
  const blobs = async (filt) => page.evaluate((filt) => {
    const c = document.getElementById('ss-out'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data
    const acc = { red: [0, 0, 0], blue: [0, 0, 0] }
    for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
      const o = (y * c.width + x) * 4, r = d[o], g = d[o + 1], b = d[o + 2]
      if (r > 150 && g < 110 && b < 110) { acc.red[0] += x + 0.5; acc.red[1] += y + 0.5; acc.red[2]++ }
      if (b > 140 && r < 110 && g < 140) { acc.blue[0] += x + 0.5; acc.blue[1] += y + 0.5; acc.blue[2]++ }
    }
    return { w: c.width, h: c.height, red: [acc.red[0] / acc.red[2], acc.red[1] / acc.red[2], acc.red[2]], blue: [acc.blue[0] / acc.blue[2], acc.blue[1] / acc.blue[2], acc.blue[2]] }
  }, filt)
  const bA = await blobs()
  const wantRed = [(0.72 + 9 / A4.w) * bA.w, (0.86 + 9 / A4.h) * bA.h], wantBlue = [(0.1 + 9 / A4.w) * bA.w, (0.06 + 9 / A4.h) * bA.h]
  assert(bA.red[2] > 500 && bA.blue[2] > 500, `A：两个色块都在 ${bA.red[2]} / ${bA.blue[2]}`)
  assert(Math.hypot(bA.red[0] - wantRed[0], bA.red[1] - wantRed[1]) <= 3, `A：红块质心 ${bA.red.slice(0, 2).map((v) => v.toFixed(1))} ≈ ${wantRed.map((v) => v.toFixed(1))}`)
  assert(Math.hypot(bA.blue[0] - wantBlue[0], bA.blue[1] - wantBlue[1]) <= 3, `A：蓝块质心 ${bA.blue.slice(0, 2).map((v) => v.toFixed(1))} ≈ ${wantBlue.map((v) => v.toFixed(1))}`)
  // 色块是 18 mm 见方：拉平后宽高相等 ⇒ 比例没被拉歪
  assert(near(bA.red[2], (18 / A4.w * bA.w) * (18 / A4.h * bA.h), 0.08 * bA.red[2]), `A：红块面积 ${bA.red[2]} ≈ (18 mm)²`)

  // ── 2. 拖动左上角（鼠标）+ 方向键微调右上角 ──
  const k0 = await page.evaluate(() => { const c = document.querySelector('#ss-editor canvas'); return c.getBoundingClientRect().width / SS.curPage().w })
  const q0 = await page.evaluate(() => SS.curPage().quad.map((p) => p.slice()))
  const hb = await page.locator('#ss-editor .ss-h').nth(0).boundingBox()
  await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2)
  await page.mouse.down()
  for (let i = 1; i <= 6; i++) await page.mouse.move(hb.x + hb.width / 2 + 5 * i, hb.y + hb.height / 2 + 4 * i)
  assert(await page.$eval('.ss-loupe', (l) => getComputedStyle(l).display) !== 'none', '拖动时放大镜出现')
  await page.mouse.up()
  await waitScan()
  const q1 = await page.evaluate(() => SS.curPage().quad.map((p) => p.slice()))
  assert(near(q1[0][0] - q0[0][0], 30 / k0, 1.5) && near(q1[0][1] - q0[0][1], 24 / k0, 1.5), `拖动左上角位移 ${(q1[0][0] - q0[0][0]).toFixed(2)},${(q1[0][1] - q0[0][1]).toFixed(2)} ≈ ${(30 / k0).toFixed(2)},${(24 / k0).toFixed(2)}`)
  assert(await page.$eval('.ss-loupe', (l) => getComputedStyle(l).display) === 'none', '松手后放大镜藏起来')
  await page.locator('#ss-editor .ss-h').nth(1).focus()
  await page.keyboard.press('Shift+ArrowLeft'); await page.keyboard.press('Shift+ArrowLeft'); await page.keyboard.press('ArrowDown')
  await waitScan()
  const q2 = await page.evaluate(() => SS.curPage().quad.map((p) => p.slice()))
  assert(near(q2[1][0] - q1[1][0], -20 / k0, 0.01) && near(q2[1][1] - q1[1][1], 1 / k0, 0.01), `方向键微调右上角 ${(q2[1][0] - q1[1][0]).toFixed(3)},${(q2[1][1] - q1[1][1]).toFixed(3)}`)
  assert(/右上角，x \d+/.test(await page.locator('#ss-editor .ss-h').nth(1).getAttribute('aria-label')), '角点 aria-label 带坐标')
  await page.click('#ss-redetect')
  await waitScan()
  assert(maxErr(await page.evaluate(() => SS.curPage().quad), A.corners) <= 1.0, '重新识别回到精确四角')

  // ── 3. 尺寸、旋转 ──
  await page.selectOption('#ss-paper', 'idcard'); await waitScan()
  dims = await outDims()
  assert(dims[0] === px(ID1.h, 200) && dims[1] === px(ID1.w, 200), `改成身份证尺寸（竖）${dims}`)
  await page.selectOption('#ss-paper', 'custom'); await page.fill('#ss-cw', '150'); await page.press('#ss-cw', 'Enter'); await page.fill('#ss-ch', '120'); await page.press('#ss-ch', 'Enter'); await waitScan()
  dims = await outDims()
  assert(dims[0] === px(120, 200) && dims[1] === px(150, 200), `自定义 150×120 mm 按竖版输出 ${dims}`)
  await page.fill('#ss-cw', '5'); await page.press('#ss-cw', 'Enter')
  assert(await page.inputValue('#ss-cw') === '150', '非法宽度被拒并回填')
  await page.selectOption('#ss-paper', 'auto'); await waitScan()
  await page.click('#ss-rotr'); await waitScan()
  dims = await outDims()
  assert(dims[0] === px(A4.h, 200) && dims[1] === px(A4.w, 200), `右转后横版 A4 ${dims}`)
  await page.click('#ss-rotl'); await waitScan()

  // ── 4. 去阴影：低反差浅灰桌 + 强光照梯度 ──
  const camB = { f: 1.05, ax: -0.22, ay: 0.2, az: -0.1, Z: 720 }
  const B = makePhoto({ W: 1400, H: 1050, wmm: A4.w, hmm: A4.h, cam: camB, bg: 'gray', light: [1.04, -0.42, 0.3], seed: 5, content: docContent(A4.w, A4.h) })
  await addPhoto(fileOf('shadow.png', B))
  const dB = await page.evaluate(() => SS.curPage().det)
  const eB = maxErr(dB.quad, B.corners)
  assert(dB.found && eB <= 1.0, `B：低反差 + 光照梯度下四角误差 ${eB.toFixed(3)} px`)
  assert(await page.$eval('#ss-count', (e) => e.textContent) === '2 页', '两页')
  const paperSpread = () => page.evaluate(() => {
    const c = document.getElementById('ss-out'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data, vals = []
    for (const [u, v] of [[0.04, 0.03], [0.5, 0.03], [0.96, 0.03], [0.04, 0.5], [0.96, 0.5], [0.04, 0.97], [0.5, 0.97], [0.96, 0.97], [0.5, 0.88]]) {
      let s = 0, n = 0
      for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { const o = ((Math.round(v * c.height) + dy) * c.width + Math.round(u * c.width) + dx) * 4; s += 0.299 * d[o] + 0.587 * d[o + 1] + 0.114 * d[o + 2]; n++ }
      vals.push(s / n)
    }
    return { min: Math.min(...vals), max: Math.max(...vals) }
  })
  await page.check('input[name="ss-filter"][value="color"]', { force: true }); await waitScan()
  const raw = await paperSpread()
  assert(raw.max - raw.min > 40, `B 原色：纸面底色明暗差 ${(raw.max - raw.min).toFixed(1)} > 40（光照不均）`)
  await page.check('input[name="ss-filter"][value="enhance"]', { force: true }); await waitScan()
  const en = await paperSpread()
  assert(en.min >= 245 && en.max - en.min <= 6, `B 增强：纸面 ${en.min.toFixed(1)}–${en.max.toFixed(1)}，去阴影后应 ≥245 且差 ≤6`)

  // ── 5. 黑白：Sauvola / Otsu 与独立实现逐像素一致（150 dpi） ──
  await page.selectOption('#ss-dpi', '150')
  await page.check('input[name="ss-filter"][value="bw"]', { force: true }); await waitScan()
  assert(await page.$eval('#ss-bwopts', (e) => getComputedStyle(e).display) !== 'none', '黑白参数面板出现')
  const getBW = () => page.evaluate(() => {
    const r = SS.renderPage(SS.curPage()), b64 = (u8) => { let s = ''; for (let i = 0; i < u8.length; i += 32768) s += String.fromCharCode.apply(null, u8.subarray(i, i + 32768)); return btoa(s) }
    return { w: r.w, h: r.h, gray: b64(r.gray), bits: b64(r.bits), k: SS.S.k }
  })
  let bw = await getBW()
  const g = Buffer.from(bw.gray, 'base64'), bits = Buffer.from(bw.bits, 'base64')
  assert(bw.w === px(A4.w, 150) && g.length === bw.w * bw.h, `黑白 150 dpi 尺寸 ${bw.w}×${bw.h}`)
  let win = Math.round(Math.min(bw.w, bw.h) / 40); if (win % 2 === 0) win++; win = Math.max(15, Math.min(151, win))
  const ref = sauvolaRef(g, bw.w, bw.h, win, bw.k, 128)
  let diff = 0, black = 0; for (let i = 0; i < ref.length; i++) { if (ref[i] !== bits[i]) diff++; if (!bits[i]) black++ }
  assert(diff === 0, `Sauvola 与独立实现逐像素一致：差 ${diff} / ${ref.length}`)
  assert(black > 0.01 * ref.length && black < 0.3 * ref.length, `黑白页有正文笔画 ${black}`)
  if (process.env.SS_PY) {
    const gp = path.join(TMP, 'g.bin'); fs.writeFileSync(gp, g)
    const out = execFileSync(process.env.SS_PY, ['-c', `import numpy as np,sys\nfrom skimage.filters import threshold_sauvola\ng=np.fromfile(sys.argv[1],dtype=np.uint8).reshape(${bw.h},${bw.w})\nT=threshold_sauvola(g,window_size=${win},k=${bw.k},r=128)\nsys.stdout.buffer.write((g>T).astype(np.uint8).tobytes())`, gp], { maxBuffer: 64 << 20 })
    let d2 = 0; for (let i = 0; i < out.length; i++) if (out[i] !== bits[i]) d2++
    assert(out.length === bits.length && d2 === 0, `Sauvola 与 scikit-image 逐像素一致：差 ${d2}`)
  }
  await page.selectOption('#ss-bwm', 'otsu'); await waitScan()
  assert(await page.$eval('#ss-kbox', (e) => getComputedStyle(e).display) === 'none', 'Otsu 时藏起 k 滑块')
  bw = await getBW()
  const bo = Buffer.from(bw.bits, 'base64'), t = otsuRef(g)
  let d3 = 0; for (let i = 0; i < g.length; i++) if ((g[i] > t ? 1 : 0) !== bo[i]) d3++
  assert(d3 === 0, `Otsu（阈值 ${t}）与独立实现一致：差 ${d3}`)
  await page.selectOption('#ss-bwm', 'sauvola'); await waitScan()

  // ── 6. 第三页：格子布上的身份证 → 自动认出身份证并套尺寸；排序 ──
  const camC = { f: 1.0, ax: 0.22, ay: -0.15, az: 0.12, Z: 240 }
  const C = makePhoto({ W: 1300, H: 975, wmm: ID1.w, hmm: ID1.h, cam: camC, bg: 'cloth', seed: 9, content: cardContent('front') })
  await page.check('input[name="ss-filter"][value="enhance"]', { force: true })
  await page.selectOption('#ss-dpi', '200')
  await addPhoto(fileOf('card.png', C))
  const dC = await page.evaluate(() => SS.curPage().det)
  const eC = maxErr(dC.quad, C.corners)
  assert(dC.found && eC <= 1.5, `C：格子布背景上的证件四角误差 ${eC.toFixed(3)} px`)
  const matchC = await page.$eval('#ss-match', (e) => e.textContent)
  assert(/^身份证 横/.test(matchC) && /已套用/.test(matchC), 'C：认出身份证横版：' + matchC)
  dims = await outDims()
  assert(dims[0] === px(ID1.w, 200) && dims[1] === px(ID1.h, 200), `C：输出身份证 200 dpi ${dims}`)
  const ids0 = await page.evaluate(() => SS.pages.map((p) => p.id))
  await page.click('.ss-pg:nth-child(3) .ss-pg-op:nth-child(1)')
  const ids1 = await page.evaluate(() => SS.pages.map((p) => p.id))
  assert(JSON.stringify(ids1) === JSON.stringify([ids0[0], ids0[2], ids0[1]]), `上移第 3 页 ${ids1}`)
  assert(await page.$eval('.ss-pg:nth-child(1) .ss-pg-op:nth-child(1)', (b) => b.disabled), '第 1 页不能再上移')
  await page.click('.ss-pg:nth-child(2) .ss-pg-op:nth-child(2)')
  assert(JSON.stringify(await page.evaluate(() => SS.pages.map((p) => p.id))) === JSON.stringify(ids0), '再下移回原序')

  // ── 7. 导出 PDF：增强（JPEG）三页，再黑白（1 位 Flate）三页 ──
  await tabOf('export')
  assert(await page.$eval('#ss-export', (b) => b.textContent) === '导出 PDF（3 页）', '导出按钮显示页数')
  const grab = async () => { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#ss-export')]); const p = await dl.path(); return { name: dl.suggestedFilename(), buf: fs.readFileSync(p) } }
  const pdf1 = await grab()
  assert(pdf1.name === '扫描件.pdf', '文件名 ' + pdf1.name)
  const P1 = parsePDF(pdf1.buf)
  assert(P1.pages.length === 3, 'PDF 三页')
  const expSize = [[A4.w, A4.h], [A4.w, A4.h], [ID1.w, ID1.h]]
  P1.pages.forEach((pg, i) => {
    assert(near(pg.mb[2], expSize[i][0] * PT, 0.01) && near(pg.mb[3], expSize[i][1] * PT, 0.01), `第 ${i + 1} 页 MediaBox ${pg.mb} = ${expSize[i]} mm`)
    const im = pg.imgs[0], jd = jpegDims(im.data)
    assert(pg.imgs.length === 1 && im.filter === 'DCTDecode' && im.bpc === 8 && im.cs === 'DeviceRGB', `第 ${i + 1} 页是 RGB JPEG（${im.cs}）`)
    assert(jd && jd.w === im.w && jd.h === im.h && im.w === px(expSize[i][0], 200), `第 ${i + 1} 页 JPEG 尺寸 ${jd && jd.w}×${jd && jd.h} 与字典一致`)
    assert(near(im.a, pg.mb[2], 0.01) && near(im.d, pg.mb[3], 0.01) && im.e === 0 && im.f === 0, `第 ${i + 1} 页图像铺满页面（cm ${im.a} ${im.d} ${im.e} ${im.f}）`)
  })
  await tabOf('scan')
  await page.check('input[name="ss-filter"][value="bw"]', { force: true }); await waitScan()
  await tabOf('export')
  await page.selectOption('#ss-pagemode', 'a4'); await page.fill('#ss-margin', '10'); await page.press('#ss-margin', 'Enter')
  await page.fill('#ss-name', '黑白测试')
  const pdf2 = await grab()
  assert(pdf2.name === '黑白测试.pdf', '改名后的文件名 ' + pdf2.name)
  const P2 = parsePDF(pdf2.buf)
  const want = await page.evaluate(() => SS.pages.map((p) => { const r = SS.renderPage(p); let s = ''; for (let i = 0; i < r.bits.length; i += 32768) s += String.fromCharCode.apply(null, r.bits.subarray(i, i + 32768)); return { w: r.w, h: r.h, mmW: r.mmW, mmH: r.mmH, bits: btoa(s) } }))
  P2.pages.forEach((pg, i) => {
    const im = pg.imgs[0], wb = want[i], wbits = Buffer.from(wb.bits, 'base64')
    assert(im.filter === 'FlateDecode' && im.bpc === 1 && im.cs === 'DeviceGray', `黑白第 ${i + 1} 页是 1 位 Flate`)
    const raw = zlib.inflateSync(im.data), rb = (im.w + 7) >> 3
    assert(im.w === wb.w && im.h === wb.h && raw.length === rb * im.h, `黑白第 ${i + 1} 页尺寸 ${im.w}×${im.h}`)
    let dd = 0
    for (let y = 0; y < im.h; y++) for (let x = 0; x < im.w; x++) if (((raw[y * rb + (x >> 3)] >> (7 - (x & 7))) & 1) !== wbits[y * im.w + x]) dd++
    assert(dd === 0, `黑白第 ${i + 1} 页解压后与页面位图逐像素一致：差 ${dd}`)
    const land = wb.mmW > wb.mmH, pw = land ? A4.h : A4.w, ph = land ? A4.w : A4.h
    assert(near(pg.mb[2], pw * PT, 0.01) && near(pg.mb[3], ph * PT, 0.01), `统一放进 A4：第 ${i + 1} 页 ${pg.mb}`)
    const sc = Math.min((pw - 20) / wb.mmW, (ph - 20) / wb.mmH)
    assert(near(im.a, wb.mmW * sc * PT, 0.01) && near(im.d, wb.mmH * sc * PT, 0.01), `第 ${i + 1} 页按 10 mm 页边距等比放入`)
    assert(near(im.e, (pw - wb.mmW * sc) / 2 * PT, 0.01) && near(im.f, (ph - wb.mmH * sc) / 2 * PT, 0.01), `第 ${i + 1} 页居中`)
  })
  const kb1 = pdf2.buf.length / 3 / 1024
  assert(kb1 < 160, `黑白页平均 ${kb1.toFixed(1)} KB（1 位 Flate 应远小于 JPEG）`)
  if (process.env.SS_POPPLER) {
    const bin = (n) => path.join(process.env.SS_POPPLER, n), f1 = path.join(TMP, 'a.pdf'), f2 = path.join(TMP, 'b.pdf')
    fs.writeFileSync(f1, pdf1.buf); fs.writeFileSync(f2, pdf2.buf)
    const info = execFileSync(bin('pdfinfo'), [f1]).toString()
    assert(/Pages:\s+3/.test(info) && /Title:\s+扫描件/.test(info), 'pdfinfo 读出 3 页与中文标题')
    assert(/Page size:\s+595\.2\d+ x 841\.8\d+ pts/.test(info), 'pdfinfo 页面 A4')
    const list = execFileSync(bin('pdfimages'), ['-list', f2]).toString().trim().split('\n').slice(2)
    assert(list.length === 3 && list.every((l) => /\bimage\b.*\bgray\b\s+1\s+1\b/.test(l)), 'pdfimages：三张 1 位灰度图\n' + list.join('\n'))
    execFileSync(bin('pdftoppm'), ['-r', '72', '-gray', '-f', '1', '-l', '1', f2, path.join(TMP, 'pg')])
    const pgm = fs.readdirSync(TMP).find((n) => n.startsWith('pg') && n.endsWith('.pgm'))
    assert(!!pgm, 'pdftoppm 能渲染')
  }
  if (process.env.SS_PY) {
    const f2 = path.join(TMP, 'b.pdf'); fs.writeFileSync(f2, pdf2.buf)
    const chk = execFileSync(process.env.SS_PY, ['-c', 'import pikepdf,sys\np=pikepdf.open(sys.argv[1])\nprint(len(p.pages), len(p.check_pdf_syntax() if hasattr(p,"check_pdf_syntax") else p.check()))', f2]).toString().trim()
    assert(chk === '3 0', 'pikepdf：3 页、结构问题 0 个：' + chk)
  }
  const hist = await page.$$eval('#ss-hist tr', (rs) => rs.map((r) => r.textContent))
  assert(hist.length === 2 && /黑白测试\.pdf/.test(hist[0]) && /扫描件\.pdf/.test(hist[1]), '导出记录两条，新的在上')

  // ── 8. 设置与记录写在本机：改完立刻刷新 ──
  await tabOf('scan')
  await page.$eval('#ss-k', (el) => { el.value = '0.31'; el.dispatchEvent(new Event('input', { bubbles: true })) })
  await page.reload()
  const st = await page.evaluate(() => ({ k: SS.S.k, filter: SS.S.filter, hist: SS.S.hist.length, kv: document.getElementById('ss-kv').textContent, checked: document.querySelector('input[name="ss-filter"]:checked').value, pages: SS.pages.length, name: SS.S.name, mode: SS.S.pagemode }))
  assert(st.k === 0.31 && st.kv === '0.31' && st.filter === 'bw' && st.checked === 'bw', '刷新后 k 与滤镜还在 ' + JSON.stringify(st))
  assert(st.hist === 2 && st.name === '黑白测试' && st.mode === 'a4', '刷新后导出记录、文件名、页面模式还在')
  assert(st.pages === 0, '图片不落盘：刷新后页面列表为空')
  const lsHasImg = await page.evaluate(() => /data:image|base64/.test(localStorage.getItem('ss-v1') || ''))
  assert(!lsHasImg, 'localStorage 里没有图片')

  // ── 9. 证件复印：正反面 → A4 原大排版 + 水印 ──
  await tabOf('id')
  const camD = { f: 1.0, ax: 0.18, ay: 0.14, az: -0.07, Z: 230 }, camE = { f: 1.0, ax: -0.2, ay: -0.12, az: 0.05, Z: 235 }
  const D = makePhoto({ W: 1300, H: 975, wmm: ID1.w, hmm: ID1.h, cam: camD, bg: 'cloth', seed: 13, content: cardContent('front') })
  const Ee = makePhoto({ W: 1300, H: 975, wmm: ID1.w, hmm: ID1.h, cam: camE, bg: 'dark', seed: 17, content: cardContent('back') })
  for (const [slot, ph] of [['front', D], ['back', Ee]]) {
    const [fc] = await Promise.all([page.waitForEvent('filechooser'), page.click(`.ss-slot-pick[data-slot="${slot}"]`)])
    await fc.setFiles(fileOf(slot + '.png', ph))
    await page.waitForFunction((s) => !!(window.SS.slots[s] && window.SS.slots[s].quad), slot)
  }
  await waitID()
  const dD = await page.evaluate(() => [SS.slots.front.det.quad, SS.slots.back.det.quad])
  const eD = maxErr(dD[0], D.corners), eE = maxErr(dD[1], Ee.corners)
  assert(eD <= 1.5 && eE <= 1.5, `证件正反面四角误差 ${eD.toFixed(3)} / ${eE.toFixed(3)} px`)
  const pl = await page.evaluate(() => SS.idA4().placed)
  const fx = (A4.w - ID1.w) / 2, fy = (A4.h / 2 - ID1.h) / 2, by = A4.h / 2 + fy
  assert(pl.length === 2 && near(pl[0].x, fx, 1e-9) && near(pl[0].y, fy, 1e-9) && near(pl[1].y, by, 1e-9), `正反面毫米位置 ${JSON.stringify(pl.map((p) => [p.x, p.y]))}`)
  assert(JSON.stringify(pl[0].px) === JSON.stringify([px(fx, 300), px(fy, 300), px(ID1.w, 300), px(ID1.h, 300)]), `正面像素框 ${pl[0].px}`)
  await page.fill('#ss-wm-purpose', '办理测试业务'); await waitID()
  const today = new Date(), ds = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`
  assert(await page.evaluate(() => SS.wmText()) === `仅供办理测试业务使用 他用无效 ${ds}`, '水印文字按用途 + 日期生成')
  // 水印只盖证件：开 / 关水印各取一次 A4 像素，证件内有差异、证件外全白
  const a4Stats = () => page.evaluate(() => {
    const a = SS.idA4(), d = a.canvas.getContext('2d').getImageData(0, 0, a.W, a.H).data, P = a.placed.map((p) => p.px)
    let outside = 0, sum = 0
    for (let y = 0; y < a.H; y += 3) for (let x = 0; x < a.W; x += 3) {
      const inCard = P.some((r) => x >= r[0] && x < r[0] + r[2] && y >= r[1] && y < r[1] + r[3])
      const o = (y * a.W + x) * 4
      if (!inCard && (d[o] !== 255 || d[o + 1] !== 255 || d[o + 2] !== 255)) outside++
      if (inCard) sum += d[o] + d[o + 1] + d[o + 2]
    }
    const r = P[0], c0 = (r[1] * a.W + r[0]) * 4, mid = ((r[1] + 60) * a.W + r[0] + 60) * 4
    return { outside, sum, corner: [d[c0], d[c0 + 1], d[c0 + 2]], inner: [d[mid], d[mid + 1], d[mid + 2]], hash: Array.from(d.subarray(((r[1] + 300) * a.W + r[0]) * 4, ((r[1] + 300) * a.W + r[0] + r[2]) * 4)).join(',') }
  })
  const on = await a4Stats()
  await page.uncheck('#ss-wm-on'); await waitID()
  const off = await a4Stats()
  assert(on.outside === 0 && off.outside === 0, `证件外全白（水印只盖证件）${on.outside}/${off.outside}`)
  assert(on.hash !== off.hash && on.sum < off.sum, '开水印后证件内像素变化且变暗')
  assert(on.corner.join() === '255,255,255', '3.18 mm 圆角外是白的 ' + on.corner)
  await page.uncheck('#ss-round'); await waitID()
  const sq = await a4Stats()
  assert(sq.corner.join() !== '255,255,255', '关掉圆角裁切后角上是证件底色 ' + sq.corner)
  await page.check('#ss-round'); await page.check('#ss-wm-on'); await waitID()
  await page.selectOption('#ss-wm-scope', 'page'); await waitID()
  const pageWm = await a4Stats()
  assert(pageWm.outside > 200, `整页水印时证件外也有水印 ${pageWm.outside}`)
  await page.selectOption('#ss-wm-scope', 'card')
  await page.selectOption('#ss-idfilter', 'color'); await waitID()   // 原色：证件底色不被提白，回渲时外接框才是整张证件
  // 导出 PDF：一页 A4、整页一张 300 dpi JPEG
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#ss-id-pdf')])
  const idpdf = fs.readFileSync(await dl.path()), PI = parsePDF(idpdf)
  assert(PI.pages.length === 1 && near(PI.pages[0].mb[2], A4.w * PT, 0.01) && near(PI.pages[0].mb[3], A4.h * PT, 0.01), '证件 PDF 一页 A4')
  const ii = PI.pages[0].imgs[0], jd = jpegDims(ii.data)
  assert(ii.filter === 'DCTDecode' && ii.w === px(A4.w, 300) && ii.h === px(A4.h, 300) && jd.w === ii.w && jd.h === ii.h, `证件 PDF 内是 300 dpi 整页 ${ii.w}×${ii.h}`)
  if (process.env.SS_POPPLER) {
    const f = path.join(TMP, 'id.pdf'); fs.writeFileSync(f, idpdf)
    execFileSync(path.join(process.env.SS_POPPLER, 'pdftoppm'), ['-r', '100', '-gray', f, path.join(TMP, 'id')])
    const fn = fs.readdirSync(TMP).find((n) => n.startsWith('id') && n.endsWith('.pgm')), pg = fs.readFileSync(path.join(TMP, fn))
    const hdr = /^P5\s+(\d+)\s+(\d+)\s+255\s/.exec(pg.toString('latin1', 0, 40)), Wp = +hdr[1], Hp = +hdr[2], dat = pg.subarray(hdr[0].length)
    // 上半页非白像素的外接框 → 毫米
    let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1
    for (let y = 0; y < Hp / 2; y++) for (let x = 0; x < Wp; x++) if (dat[y * Wp + x] < 235) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
    const mmx = (v) => v / 100 * MM
    assert(near(mmx(x0), fx, 0.8) && near(mmx(y0), fy, 0.8) && near(mmx(x1 + 1) - mmx(x0), ID1.w, 1.0) && near(mmx(y1 + 1) - mmx(y0), ID1.h, 1.0), `pdftoppm 回渲：正面在 ${mmx(x0).toFixed(2)},${mmx(y0).toFixed(2)} 宽 ${(mmx(x1 + 1) - mmx(x0)).toFixed(2)} 高 ${(mmx(y1 + 1) - mmx(y0)).toFixed(2)} mm`)
  }
  assert(await page.$$eval('#ss-wm-recent .ss-chip', (cs) => cs.map((c) => c.textContent).join('|')) === '仅供办理测试业务使用 他用无效', '导出后记住这条水印（不含日期）')
  // 横向并排
  await page.selectOption('#ss-idlayout', 'side'); await waitID()
  const ps = await page.evaluate(() => { const a = SS.idA4(); return { page: a.page, placed: a.placed.map((p) => [p.x, p.y]) } })
  const sx0 = (297 - (2 * ID1.w + 16)) / 2
  assert(ps.page.w === A4.h && ps.page.h === A4.w && near(ps.placed[0][0], sx0, 1e-9) && near(ps.placed[1][0], sx0 + ID1.w + 16, 1e-9) && near(ps.placed[0][1], (A4.w - ID1.h) / 2, 1e-9), '横向 A4 并排 ' + JSON.stringify(ps))
  await page.selectOption('#ss-idlayout', 'half'); await waitID()
  // 打印：打印样式里只剩 210×297 mm 的整页图，Chromium 出 1 页 A4
  await page.evaluate(() => { window.__printed = 0; window.print = () => { window.__printed++ } })
  await page.click('#ss-id-print')
  await page.waitForFunction(() => window.__printed === 1)
  await page.emulateMedia({ media: 'print' })
  const vis = await page.evaluate(() => ({ nav: getComputedStyle(document.querySelector('.ss-nav')).display, pr: getComputedStyle(document.getElementById('ss-print')).display, w: document.querySelector('#ss-print img').getBoundingClientRect().width }))
  assert(vis.nav === 'none' && vis.pr === 'block' && near(vis.w, 210 / MM * 96, 0.5), '打印样式只留整页图，宽 210 mm ' + JSON.stringify(vis))
  const printed = parsePDF(await page.pdf({ preferCSSPageSize: true, printBackground: true }))
  assert(printed.pages.length === 1 && near(printed.pages[0].mb[2], A4.w * PT, 1) && near(printed.pages[0].mb[3], A4.h * PT, 1), `打印出 1 页 A4：${printed.pages.length} 页 ${printed.pages[0] && printed.pages[0].mb}`)
  await page.emulateMedia({ media: null })

  // ── 10. 示例与守卫 ──
  await tabOf('scan')
  await page.click('#ss-demo2'); await waitScan()
  const demo = await page.evaluate(() => ({ m: document.getElementById('ss-match').textContent, lvl: document.getElementById('ss-conf').dataset.level }))
  assert(/^A4 竖/.test(demo.m) && demo.lvl === 'high', '示例照片认出 A4：' + demo.m)
  const onTab = async (t) => { await page.evaluate((t) => window.SS.showTab(t), t); await page.waitForFunction((t) => !document.getElementById('pane-' + t).hidden, t) }
  const n = await renderGuards(page, {
    assert, tabs: ['scan', 'id', 'export', 'help'], onTab,
    paneSel: (t) => `#pane-${t}`, panesRoot: '#ss-panes', figSel: (t) => `#pane-${t} svg`, cardSel: '.ss-card',
    labelSel: 'th, dt, label, label > span, .ss-lab', minControls: 40,
  })
  assert(n >= 40, '各页签可见控件 ' + n)
  await onTab('scan')
  await guardBoxOverlap(page, { assert, sel: '.ss-tab, .ss-pill, #pane-scan .ss-seg span, #pane-scan .ss-toolbar .ss-btn, .ss-hero-stats > div' })
  await onTab('id')
  await guardBoxOverlap(page, { assert, sel: '#pane-id .ss-row .ss-btn, #pane-id .ss-chip, #pane-id .ss-slot-h > *' })
  await onTab('scan')
  // 角点在卡片内（窄屏也不越出）
  for (const vw of [390, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 })
    // 角点位置由 ResizeObserver 回调重排：轮询到排好，别在改视口后立刻读（读到的是旧宽度下的位置）
    const esc = await page.waitForFunction(() => {
      const card = document.querySelector('.ss-stage').getBoundingClientRect(), cv = document.querySelector('#ss-editor canvas').getBoundingClientRect()
      const hs = [...document.querySelectorAll('#ss-editor .ss-h')], k = cv.width / SS.curPage().w
      const laid = hs.every((h, i) => Math.abs(parseFloat(h.style.left) - SS.curPage().quad[i][0] * k) < 0.5)
      return laid && hs.filter((h) => { const r = h.getBoundingClientRect(); return r.left < card.left - 1 || r.right > card.right + 1 }).length === 0
    }, null, { timeout: 5000 }).then(() => 0, () => 1)
    assert(esc === 0, `视口 ${vw}：角点排好且没越出卡片`)
  }
  await page.setViewportSize({ width: 1280, height: 850 })
  assert(errs.length === 0, '页面无报错 ' + errs.join(' | '))
  fs.rmSync(TMP, { recursive: true, force: true })

  // 缩略图：示例照片 + 「增强」结果（红章留色）
  await page.check('input[name="ss-filter"][value="enhance"]', { force: true }); await waitScan()
  await page.evaluate(() => { const el = document.querySelector('.ss-main'); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 64 - 8) })
  await page.waitForTimeout(150)
  await screenshot('thumb.png')
}
