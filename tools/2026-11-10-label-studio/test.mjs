// 条码标签工坊 · 集成测试
// 真值：ORACLE 块由 runs/<run>/toracle/gen.py 机械注入（zint 2.16 --dump 的模块串 / 码字数，python-stdnum 2.2 的校验位、ISBN、ISSN、GS1）。
// 断言一律走「不经过页面引擎」的独立路径：从页面画出来的 SVG 几何反解模块串、自写 PNG 解码 + EAN-13 解码、解析 Chromium 打出来的 PDF。
// 可选外部校验器（路径走环境变量，测试本身不依赖本机装了什么）：LB_ZBAR=zbarimg 解码下载的 PNG；LB_PDFTOTEXT=pdftotext 读 PDF 里文字的坐标。
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import zlib from 'node:zlib'
import { execFileSync } from 'node:child_process'
import crypto from 'node:crypto'
import { renderGuards, guardBoxOverlap } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const ORACLE = {
 "ean13": {
  "data": "690123456789",
  "full": "6901234567892",
  "hex": "A2 D3 B3 36 F5 1A A7 50 89 23 A6 CA"
 },
 "c128": {
  "data": "Hello-123456",
  "hex": "D2 18 A2 C8 65 0C A1 1E A6 E5 DE B3 91 63 8B 76 2C 75 8",
  "cw": 13
 },
 "gs1_128": {
  "data": "(01)09501101530003(17)250101(10)ABC123",
  "cw": 24
 },
 "gs1_128b": {
  "data": "(01)09501101530003(10)ABC123(17)250101",
  "cw": 25
 },
 "upce": {
  "data": "0123456",
  "hex": "AC C9 BD 3A E5 7A A"
 },
 "itf14": {
  "data": "1540014128876",
  "hex": "AE 28 BA B8 8E 8B BA 22 EB 88 EA 3B AB 88 8E 3A BA"
 },
 "code39": {
  "data": "CODE-39",
  "hex": "96 D6 D2 B5 A5 59 6D 65 4A DB 65 56 5A 96 D"
 },
 "dm": {
  "data": "A1B2C3",
  "rows": [
   "AA A",
   "A2 F",
   "B0 4",
   "82 F",
   "B0 4",
   "84 F",
   "86 E",
   "FC B",
   "BA C",
   "BC D",
   "B2 2",
   "FF F"
  ]
 },
 "dm144": {
  "data": "01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789",
  "sha": "519e54b99532acb7256371b035a5ad6f22407e610e0f1117d998ef737c81aaa7"
 },
 "dm_hello": {
  "data": "Hello, 条码！",
  "size_zint": 20
 },
 "isbn": {
  "in": "978-7-115-42802-8",
  "isbn10": "7115428026",
  "valid": true
 },
 "issn": {
  "in": "0317-8471",
  "ean": "9770317847001"
 },
 "gtin14_body": {
  "in": "1690123456789",
  "full": "16901234567899"
 },
 "bad_ean": {
  "in": "6901234567895",
  "expected": "2"
 },
 "gs1": {
  "in": "(01)06901234567892(17)270331(10)LOT2026A(21)00123",
  "encoded": "01069012345678921727033110LOT2026A\u001d2100123",
  "ais": {
   "10": "LOT2026A",
   "17": "2027-03-31",
   "21": "00123",
   "01": "06901234567892"
  }
 },
 "gs1_bad": {
  "in": "(01)06901234567893(17)270231",
  "stdnum": "InvalidChecksum"
 },
 "rows": [
  [
   "商品01, 特价",
   "1 件",
   "9.90",
   "6901234001006",
   "浙江"
  ],
  [
   "商品02",
   "1 件",
   "10.90",
   "6901234001013",
   "浙江"
  ],
  [
   "商品03",
   "1 件",
   "11.90",
   "6901234001020",
   "浙江"
  ],
  [
   "商品04",
   "1 件",
   "12.90",
   "6901234001037",
   "浙江"
  ],
  [
   "商品05",
   "1 件",
   "13.90",
   "6901234001044",
   "浙江"
  ],
  [
   "商品06",
   "1 件",
   "14.90",
   "6901234001051",
   "浙江"
  ],
  [
   "商品07",
   "1 件",
   "15.90",
   "6901234001069",
   "浙江"
  ],
  [
   "商品08",
   "1 件",
   "16.90",
   "6901234001075",
   "浙江"
  ],
  [
   "商品09",
   "1 件",
   "17.90",
   "6901234001082",
   "浙江"
  ],
  [
   "商品10",
   "1 件",
   "18.90",
   "6901234001099",
   "浙江"
  ],
  [
   "商品11",
   "1 件",
   "19.90",
   "6901234001105",
   "浙江"
  ],
  [
   "商品12",
   "1 件",
   "20.90",
   "6901234001112",
   "浙江"
  ],
  [
   "商品13",
   "1 件",
   "21.90",
   "6901234001129",
   "浙江"
  ],
  [
   "商品14",
   "1 件",
   "22.90",
   "6901234001136",
   "浙江"
  ],
  [
   "商品15",
   "1 件",
   "23.90",
   "6901234001143",
   "浙江"
  ],
  [
   "商品16",
   "1 件",
   "24.90",
   "6901234001150",
   "浙江"
  ],
  [
   "商品17",
   "1 件",
   "25.90",
   "6901234001167",
   "浙江"
  ],
  [
   "商品18",
   "1 件",
   "26.90",
   "6901234001174",
   "浙江"
  ],
  [
   "商品19",
   "1 件",
   "27.90",
   "6901234001181",
   "浙江"
  ],
  [
   "商品20",
   "1 件",
   "28.90",
   "6901234001198",
   "浙江"
  ],
  [
   "商品21",
   "1 件",
   "29.90",
   "6901234001204",
   "浙江"
  ],
  [
   "商品22",
   "1 件",
   "30.90",
   "6901234001211",
   "浙江"
  ],
  [
   "商品23",
   "1 件",
   "31.90",
   "6901234001228",
   "浙江"
  ],
  [
   "商品24",
   "1 件",
   "32.90",
   "6901234001235",
   "浙江"
  ],
  [
   "商品25",
   "1 件",
   "33.90",
   "6901234001242",
   "浙江"
  ],
  [
   "商品26",
   "1 件",
   "34.90",
   "6901234001259",
   "浙江"
  ],
  [
   "商品27",
   "1 件",
   "35.90",
   "6901234001266",
   "浙江"
  ],
  [
   "商品28",
   "1 件",
   "36.90",
   "6901234001273",
   "浙江"
  ],
  [
   "商品29",
   "1 件",
   "37.90",
   "6901234001280",
   "浙江"
  ],
  [
   "商品30",
   "1 件",
   "38.90",
   "6901234001297",
   "浙江"
  ]
 ],
 "bad_row": 7
};

// —— 独立小工具 ——
const hexOf = (bits) => { const b = bits + '0'.repeat((4 - bits.length % 4) % 4); let h = ''; for (let i = 0; i < b.length; i += 4) h += parseInt(b.slice(i, i + 4), 2).toString(16).toUpperCase(); return h.match(/.{1,2}/g).join(' ') }
const gs1ck = (body) => { let s = 0; for (let i = 0; i < body.length; i++) s += (+body[body.length - 1 - i]) * (i % 2 ? 1 : 3); return (10 - s % 10) % 10 }
// SVG path（M x y h w v h h -w z）→ 矩形
function rectsOfPath(d) {
  const out = []; const re = /M([\d.-]+) ([\d.-]+)h([\d.-]+)v([\d.-]+)h[\d.-]+z/g; let m
  while ((m = re.exec(d))) out.push({ x: +m[1], y: +m[2], w: +m[3], h: +m[4] })
  return out
}
// 一维：取穿过条中部的扫描线，按 X 换算成模块串（第一根条为原点）
function bitsFromRects(rects, X, scanY) {
  const hit = rects.filter((r) => r.y <= scanY && r.y + r.h >= scanY && r.w < 20).sort((a, b) => a.x - b.x)
  const x0 = hit[0].x; let bits = ''
  for (const r of hit) { const s = Math.round((r.x - x0) / X), e = Math.round((r.x + r.w - x0) / X); bits = bits.padEnd(s, '0') + '1'.repeat(e - s) }
  return bits
}
// 二维：矩形（每行合并过的横向段）→ 0/1 矩阵
function matrixFromRects(rects, X, rows, cols) {
  const x0 = Math.min(...rects.map((r) => r.x)), y0 = Math.min(...rects.map((r) => r.y))
  const M = Array.from({ length: rows }, () => new Array(cols).fill(0))
  for (const r of rects) { const row = Math.round((r.y - y0) / X), c0 = Math.round((r.x - x0) / X), c1 = Math.round((r.x + r.w - x0) / X); for (let c = c0; c < c1; c++) M[row][c] = 1 }
  return M
}
// 最小 PNG 解码（8 位 RGBA / RGB / 灰度，五种滤波）
function decodePNG(buf) {
  let p = 8, W = 0, H = 0, ct = 0; const idat = []
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString('latin1', p + 4, p + 8), data = buf.subarray(p + 8, p + 8 + len)
    if (type === 'IHDR') { W = data.readUInt32BE(0); H = data.readUInt32BE(4); if (data[8] !== 8) throw new Error('只支持 8 位'); ct = data[9] }
    if (type === 'IDAT') idat.push(data)
    p += 12 + len
  }
  const bpp = ct === 6 ? 4 : ct === 2 ? 3 : ct === 4 ? 2 : 1
  const raw = zlib.inflateSync(Buffer.concat(idat)); const stride = W * bpp; const px = Buffer.alloc(H * stride)
  for (let y = 0; y < H; y++) {
    const f = raw[y * (stride + 1)], src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1))
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? px[y * stride + x - bpp] : 0, b = y ? px[(y - 1) * stride + x] : 0, c = (x >= bpp && y) ? px[(y - 1) * stride + x - bpp] : 0
      let v = src[x]
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1
      else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c }
      px[y * stride + x] = v & 255
    }
  }
  return { W, H, dark: (x, y) => px[y * stride + x * bpp] < 128 }
}
// 独立 EAN-13 解码（GS1 通用规范的 L/G/R 码表与首位奇偶表）
const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011']
const R = L.map((p) => p.replace(/./g, (b) => b === '0' ? '1' : '0')), G = R.map((p) => p.split('').reverse().join(''))
const PAR = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL']
function decodeEAN13Row(png, y) {
  const runs = []; let cur = png.dark(0, y), n = 0, x0 = -1, x1 = -1
  for (let x = 0; x < png.W; x++) { const d = png.dark(x, y); if (d && x0 < 0) x0 = x; if (d) x1 = x + 1; if (d === cur) n++; else { runs.push([cur, n]); cur = d; n = 1 } }
  runs.push([cur, n])
  const pm = (x1 - x0) / 95; let bits = ''; let pos = 0
  for (const [d, w] of runs) { const s = pos, e = pos + w; pos = e; if (e <= x0 || s >= x1) continue; const a = Math.max(s, x0), b = Math.min(e, x1); bits += (d ? '1' : '0').repeat(Math.round((b - x0) / pm) - Math.round((a - x0) / pm)) }
  if (bits.length !== 95 || bits.slice(0, 3) !== '101' || bits.slice(45, 50) !== '01010' || bits.slice(92) !== '101') return { ok: false, bits }
  let par = '', digits = ''
  for (let k = 0; k < 6; k++) { const c = bits.slice(3 + 7 * k, 10 + 7 * k); const i = L.indexOf(c), j = G.indexOf(c); if (i >= 0) { digits += i; par += 'L' } else if (j >= 0) { digits += j; par += 'G' } else return { ok: false, bits } }
  for (let k = 0; k < 6; k++) { const c = bits.slice(50 + 7 * k, 57 + 7 * k); const i = R.indexOf(c); if (i < 0) return { ok: false, bits }; digits += i }
  const first = PAR.indexOf(par); if (first < 0) return { ok: false, bits }
  const all = first + digits
  return { ok: gs1ck(all.slice(0, 12)) === +all[12], text: all, pm }
}
// PDF：页数、MediaBox（Chromium 输出的对象不压缩，/Type /Page 可直接数）
const pdfPages = (buf) => (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length
const pdfBox = (buf) => { const m = /\/MediaBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]/.exec(buf.toString('latin1')); return m ? [+m[3] - +m[1], +m[4] - +m[2]] : null }
const PT2MM = 25.4 / 72
// LB_ZXING=<装了 zxing-cpp 与 pillow 的 python>：把下载件交给 zxing-cpp 解码（zbarimg 0.23.93 在本机读 PNG 直接段错误，不能用）
const ZX = process.env.LB_ZXING
const ZX_PY = 'import sys,json,zxingcpp\nfrom PIL import Image\nr=zxingcpp.read_barcodes(Image.open(sys.argv[1]))\nprint(json.dumps([{"format":x.format.name,"text":x.text,"sid":x.symbology_identifier,"hex":bytes(x.bytes).hex()} for x in r]))'
function zxing(buf) {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'lbzx-')), 'a.png'); fs.writeFileSync(f, buf)
  return JSON.parse(execFileSync(ZX, ['-c', ZX_PY, f], { encoding: 'utf8' }))
}
function pdfWords(buf, tool) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lbpdf-')); const f = path.join(dir, 'a.pdf'); fs.writeFileSync(f, buf)
  execFileSync(tool, ['-bbox', f, path.join(dir, 'a.html')])
  const html = fs.readFileSync(path.join(dir, 'a.html'), 'utf8'); const out = []; const re = /<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g; let m
  while ((m = re.exec(html))) out.push({ x0: +m[1] * PT2MM, y0: +m[2] * PT2MM, x1: +m[3] * PT2MM, y1: +m[4] * PT2MM, t: m[5] })
  return out
}

export default async ({ page, toolURL, screenshot, assert }) => {
  const eq = (a, b, msg) => assert(a === b, `${msg}：期望 ${JSON.stringify(b)}，实得 ${JSON.stringify(a)}`)
  const near = (a, b, tol, msg) => assert(Math.abs(a - b) <= tol, `${msg}：期望 ${b} ± ${tol}，实得 ${a}`)
  const TABS = ['code', 'design', 'data', 'print', 'check', 'about']
  const onTab = async (t) => { await page.click('#tab-' + t); await page.waitForFunction((t) => !document.getElementById('pane-' + t).hidden, t) }
  const stageKey = () => page.$eval('#lb-stage', (e) => e.dataset.key || '')
  const waitStage = (has) => page.waitForFunction((h) => (document.getElementById('lb-stage').dataset.key || '').includes(h), has, { timeout: 10000 })
  const setData = async (type, data) => {
    if (await page.$eval('#lb-type', (e) => e.value) !== type) { await page.selectOption('#lb-type', type); await waitStage(type + ':') }
    await page.fill('#lb-data', data); await waitStage(type + ':' + data + ':')
  }
  const svgRects = () => page.$eval('#lb-svg path', (p) => p.getAttribute('d')).then(rectsOfPath)
  const svgBits = async (X) => { const rs = await svgRects(); const top = Math.min(...rs.filter((r) => r.w < 20).map((r) => r.y)); const hh = Math.min(...rs.filter((r) => r.w < 20).map((r) => r.h)); return bitsFromRects(rs, X, top + hh / 2) }
  const download = async (sel) => { const [dl] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); return { name: dl.suggestedFilename(), buf: fs.readFileSync(await dl.path()) } }

  await page.goto(toolURL)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.waitForFunction(() => document.body.dataset.ready === '1')

  // ================= 1. 默认 EAN-13：页面画出来的条 = zint 的模块串 =================
  await waitStage('ean13:')
  eq(hexOf(await svgBits(0.33)), ORACLE.ean13.hex, 'EAN-13 690123456789 的 SVG 模块串（zint --dump）')
  assert((await page.textContent('#lb-status')).includes('补上校验位 ' + ORACLE.ean13.full.slice(-1)), '状态行说明补上的校验位（python-stdnum）')
  eq(await page.textContent('#lb-dim-w'), '37.29', 'EAN-13 在 X = 0.330 mm 时连静区宽 37.29 mm（GS1 通用规范标称尺寸）')
  assert((await page.textContent('#lb-readout')).includes(ORACLE.ean13.full), 'TUI 读数显示完整 13 位')
  assert((await page.textContent('#lb-checks')).includes('放大系数 100%'), 'GS1 放大系数 100%')
  {
    const rs = await svgRects(); const x0 = Math.min(...rs.map((r) => r.x))
    const tx = await page.$$eval('#lb-svg text', (ts) => ts.map((t) => [t.textContent, +t.getAttribute('x'), t.getAttribute('text-anchor')]))
    eq(tx.map((t) => t[0]).join(''), ORACLE.ean13.full, '人眼可读数字逐位')
    const mod = (x) => (x - x0) / 0.33
    assert(mod(tx[0][1]) < -1, '首位数字在起始护线左边的静区里：' + mod(tx[0][1]).toFixed(2))
    for (let k = 1; k <= 12; k++) {
      const lo = k <= 6 ? 3 + 7 * (k - 1) : 50 + 7 * (k - 7), m = mod(tx[k][1])
      assert(tx[k][2] === 'middle' && m > lo + 1 && m < lo + 6, `第 ${k + 1} 位数字居中在它的 7 个模块（${lo}–${lo + 7}）下：${m.toFixed(2)}`)
    }
  }
  // 校验位错
  await page.fill('#lb-data', ORACLE.bad_ean.in)
  await page.waitForFunction(() => (document.getElementById('lb-stage').dataset.key || '').startsWith('err:'))
  assert((await page.textContent('#lb-status')).includes('校验位应为 ' + ORACLE.bad_ean.expected), '错的校验位给出正确值（python-stdnum）')
  eq(await page.getAttribute('#lb-data', 'aria-invalid'), 'true', '输入框标红')
  assert(await page.$eval('#lb-dl-svg', (b) => b.disabled), '出错时导出按钮不可点')
  await page.fill('#lb-data', ORACLE.ean13.data); await waitStage('ean13:' + ORACLE.ean13.data + ':')

  // PNG 导出 → 自写 PNG 解码 + 独立 EAN-13 解码
  const png = await download('#lb-dl-png')
  assert(/\.png$/.test(png.name), 'PNG 文件名')
  const img = decodePNG(png.buf)
  const dots = Math.round(0.33 / 25.4 * 600)   // PNG 导出把模块宽对齐到整像素：0.33 mm @ 600 dpi = 7.8 → 8 像素
  near(img.W, 113 * dots, 1, 'PNG 宽度 = (11 + 95 + 7) 模块 × 8 像素')
  const dec = decodeEAN13Row(img, Math.round(img.H * 0.3))
  assert(dec.ok, 'PNG 能被独立的 EAN-13 解码器读出：' + (dec.bits || '').slice(0, 40))
  eq(dec.text, ORACLE.ean13.full, 'PNG 解码内容')
  near(dec.pm, dots, 0.05, 'PNG 模块宽是整 8 像素')
  if (ZX) eq(zxing(png.buf)[0].text, ORACLE.ean13.full, 'zxing-cpp 解码下载的 PNG')
  const svgDl = await download('#lb-dl-svg')
  assert(/width="37\.29mm"/.test(svgDl.buf.toString()), 'SVG 下载件按毫米标注宽度')

  // 打印机点阵对齐
  await page.selectOption('#lb-dpi', '203'); await waitStage('"dpi":203')
  eq(await page.textContent('#lb-dim-x'), String(Math.round(3 * 25.4 / 203 * 1000) / 1000), '203 dpi 时 0.33 mm 对齐到 3 个点')
  assert((await page.textContent('#lb-checks')).includes('取 3 点'), '点阵检查说明取 3 点')
  await page.selectOption('#lb-dpi', '0'); await waitStage('"dpi":0')

  // ================= 2. 其它码制逐模块对 zint =================
  await setData('code128', ORACLE.c128.data)
  eq(hexOf(await svgBits(0.33)), ORACLE.c128.hex, 'Code 128 的 SVG 模块串（zint）')
  eq(await page.$$eval('#lb-cw span', (s) => s.length), ORACLE.c128.cw, 'Code 128 码字个数（从 zint 模块串反解）')
  assert((await page.textContent('#lb-struct-sub')).includes('全用 B 码集要 15 个'), '说明比全 B 码集省了码字')
  await setData('gs1-128', ORACLE.gs1_128.data)
  eq(await page.$$eval('#lb-cw span', (s) => s.length), ORACLE.gs1_128.cw, 'GS1-128 码字个数与 zint 一样短')
  eq(await page.$$eval('#lb-gs1-tbl tr', (r) => r.length), 4, 'GS1 表 3 个 AI + 表头')
  eq(await page.$eval('#lb-cw span', (s) => s.textContent.trim().split(' ')[0]), 'Start', '第一个码字是起始符')
  eq(await page.$eval('#lb-cw span:nth-child(2)', (s) => s.textContent.trim().split(' ')[0]), 'FNC1', '第二个码字是 FNC1')
  if (ZX) {
    const z = zxing((await download('#lb-dl-png')).buf)
    eq(z.length && z[0].sid, ']C1', 'zxing-cpp 认出 GS1-128（符号标识 ]C1）')
    eq(z[0].text, ORACLE.gs1_128.data, 'zxing-cpp 读出的 GS1 元素串')
  }
  await setData('gs1-128', ORACLE.gs1_128b.data)
  eq(await page.$$eval('#lb-cw span', (s) => s.length), ORACLE.gs1_128b.cw, '(10) 在中间时码字数与 zint 一样（含 FNC1 分隔）')
  eq(await page.$$eval('#lb-cw .lb-cw-fnc1', (s) => s.length), 2, '开头 FNC1 + (10) 之后的分隔 FNC1')
  if (ZX) eq(zxing((await download('#lb-dl-png')).buf)[0].text, ORACLE.gs1_128b.data, 'zxing-cpp 读出 (10) 与 (17) 的边界')
  await setData('upce', ORACLE.upce.data)
  eq(hexOf(await svgBits(0.33)), ORACLE.upce.hex, 'UPC-E 的 SVG 模块串（zint）')
  await page.selectOption('#lb-type', 'code39'); await waitStage('code39:')
  await page.fill('#lb-ratio', '2'); await page.fill('#lb-data', ORACLE.code39.data); await waitStage('code39:' + ORACLE.code39.data + ':')
  await page.waitForFunction(() => !(document.getElementById('lb-stage').dataset.key || '').startsWith('err'))
  eq(hexOf(await svgBits(await page.$eval('#lb-x', (e) => +e.value))), ORACLE.code39.hex, 'Code 39（宽窄比 2）的 SVG 模块串（zint）')
  await page.selectOption('#lb-type', 'itf14'); await waitStage('itf14:')
  await page.selectOption('#lb-bearer', 'bars'); await page.fill('#lb-data', ORACLE.itf14.data); await waitStage('itf14:' + ORACLE.itf14.data + ':')
  eq(await page.$eval('#lb-ratio', (e) => e.value), '3', 'ITF-14 默认宽窄比 3')
  eq(hexOf(await svgBits(0.635)), ORACLE.itf14.hex, 'ITF-14（宽窄比 3）的 SVG 模块串（zint）')
  // Data Matrix：与 zint 逐模块一致（C40 段恰好填满 12×12，省掉换回码）
  await setData('datamatrix', ORACLE.dm.data)
  const dmr = await svgRects(); const n = ORACLE.dm.rows.length
  const M = matrixFromRects(dmr, 0.5, n, n)
  eq(M.map((r) => hexOf(r.join(''))).join('\n'), ORACLE.dm.rows.join('\n'), 'Data Matrix A1B2C3 的 12×12 矩阵（zint）')
  assert((await page.textContent('#lb-dm-segs')).includes('C40'), '结构里显示 C40 分段')
  // 点阵对齐后（X = 4 × 25.4/203 = 0.50049… mm）相邻模块共用同一条边：上一行的下边 = 下一行的上边，逐位相等
  await page.selectOption('#lb-dpi', '203'); await waitStage('"dpi":203')
  {
    const rs = await svgRects(); const ys = [...new Set(rs.map((r) => r.y))].sort((a, b) => a - b); const bot = new Set(rs.map((r) => +(r.y + r.h).toFixed(6)))
    let seams = 0; for (const y of ys) for (const b of bot) if (Math.abs(b - y) < 0.002 && Math.abs(b - y) > 1e-9) seams++
    eq(seams, 0, '203 dpi 下 Data Matrix 上下相邻模块无接缝（离线 s7 同款检查）')
  }
  await page.selectOption('#lb-dpi', '0'); await waitStage('"dpi":0')
  // 144×144：纠错码字按 zint / BWIPP 的错位交织（整张矩阵的 sha256 对 zint --vers=24）
  await page.selectOption('#lb-dmsize', '144×144'); await page.fill('#lb-data', ORACLE.dm144.data); await waitStage('datamatrix:' + ORACLE.dm144.data + ':')
  {
    const M144 = matrixFromRects(await svgRects(), 0.5, 144, 144)
    eq(crypto.createHash('sha256').update(M144.map((r) => hexOf(r.join(''))).join('\n')).digest('hex'), ORACLE.dm144.sha, '144×144 矩阵与 zint 逐位一致（sha256）')
  }
  await page.selectOption('#lb-dmsize', '')
  await setData('datamatrix', ORACLE.dm_hello.data)
  const side = await page.$eval('#lb-dim-mod', (e) => +e.textContent.split('×')[0])
  assert(side <= ORACLE.dm_hello.size_zint, `中文 Data Matrix 不比 zint 大：${side} ≤ ${ORACLE.dm_hello.size_zint}`)
  assert((await page.textContent('#lb-dm-segs')).includes('ECI 26'), '中文走 ECI 26 + Base256')
  if (ZX) { const z = zxing((await download('#lb-dl-png')).buf); eq(z.length && z[0].text, ORACLE.dm_hello.data, 'zxing-cpp 读出中文 Data Matrix') }
  // 推荐码制
  await page.fill('#lb-data', '6901234567892'); await waitStage(':6901234567892:')
  const sug = await page.$$eval('#lb-suggest [data-type]', (bs) => bs.map((b) => b.dataset.type))
  eq(sug[0], 'ean13', '13 位且校验位对的数字首推 EAN-13')

  // ================= 3. 校验位 · GS1 =================
  await onTab('check')
  eq(await page.textContent('#lb-ck-isbn10'), ORACLE.isbn.isbn10, 'ISBN-13 → ISBN-10（python-stdnum）')
  await page.fill('#lb-ck-in', ORACLE.issn.in); await page.waitForSelector('#lb-ck-issn')
  eq(await page.textContent('#lb-ck-issn'), ORACLE.issn.ean, 'ISSN → 期刊 EAN-13（python-stdnum）')
  await page.fill('#lb-ck-in', ORACLE.gtin14_body.in); await page.waitForSelector('#lb-ck-full')
  eq(await page.textContent('#lb-ck-full'), ORACLE.gtin14_body.full, '13 位补校验位成 GTIN-14（python-stdnum）')
  await page.fill('#lb-ck-in', ORACLE.bad_ean.in); await page.waitForSelector('#lb-ck-verdict')
  assert((await page.textContent('#lb-ck-verdict')).includes('校验位应为 ' + ORACLE.bad_ean.expected), '核对出错的 EAN-13')
  await page.fill('#lb-gs-in', ORACLE.gs1.in)
  await page.waitForFunction((x) => document.getElementById('lb-gs-raw') && document.getElementById('lb-gs-raw').textContent === x, ORACLE.gs1.encoded.replace(/\x1d/g, '␝'))
  eq(await page.textContent('#lb-gs-fnc'), '1', 'FNC1 分隔符只在变长的 (10) 之后')
  const gsVals = await page.$$eval('#lb-gs-tbl tr', (rs) => rs.slice(1).map((r) => [r.cells[0].textContent.replace(/[()]/g, ''), r.cells[2].textContent]))
  for (const [ai, v] of Object.entries(ORACLE.gs1.ais)) {
    const row = gsVals.find((x) => x[0] === ai); assert(row, '解析出 AI ' + ai)
    if (ai === '17') assert(row[1].includes(v), `(17) 解读成日期 ${v}（python-stdnum），实得 ${row[1]}`); else assert(row[1].startsWith(v), `(${ai}) 的值 ${v}（python-stdnum），实得 ${row[1]}`)
  }
  await page.fill('#lb-gs-in', ORACLE.gs1_bad.in)
  await page.waitForFunction(() => document.getElementById('lb-gs-status').classList.contains('lb-st-err'))
  const gsBad = await page.textContent('#lb-gs-tbl')
  eq(ORACLE.gs1_bad.stdnum, 'InvalidChecksum', 'python-stdnum 也判这串校验位错')
  assert(gsBad.includes('校验位应为 2'), '(01) 校验位错')
  assert(gsBad.includes('2027 年 2 月没有 31 日'), '(17) 2 月 31 日不存在')

  // ================= 4. 数据：30 行，第 7 行校验位错 =================
  await onTab('data')
  const q = (v) => /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v
  const csv = [['品名', '规格', '价格', '条码', '产地']].concat(ORACLE.rows).map((r) => r.map(q).join(',')).join('\n')
  await page.fill('#lb-csv', csv)
  await page.waitForFunction(() => document.getElementById('lb-data-count') && document.getElementById('lb-data-count').textContent === '30')
  eq(await page.textContent('#lb-data-bad'), '1', '只有 1 处条码错')
  assert((await page.textContent('#lb-data-errs')).includes('第 ' + ORACLE.bad_row + ' 行'), '错误定位到第 7 行')
  eq(await page.$$eval('#lb-data-tbl tr.lb-tr-bad', (r) => r.length), 1, '表里标红 1 行')
  eq(await page.$eval('#lb-data-tbl tr:nth-child(2) td:nth-child(2)', (t) => t.textContent), ORACLE.rows[0][0], '带引号的逗号字段整格保留')
  await page.fill('#lb-copies', '2'); await page.waitForFunction(() => document.getElementById('lb-data-total').textContent === '60')
  await page.fill('#lb-copies', '1'); await page.waitForFunction(() => document.getElementById('lb-data-total').textContent === '30')
  // 序列号（追加一列）：GS1 模 10
  await page.fill('#lb-sq-prefix', ''); await page.fill('#lb-sq-pad', '6'); await page.fill('#lb-sq-count', '30'); await page.selectOption('#lb-sq-check', 'gs1')
  await page.click('#lb-sq-add')
  await page.waitForFunction(() => /生成了 30 个/.test(document.getElementById('lb-sq-note').textContent))
  const seqHead = await page.$$eval('#lb-data-tbl tr:first-child th', (t) => t.map((x) => x.textContent))
  eq(seqHead[seqHead.length - 1], '序号', '追加了「序号」列')
  const seq3 = await page.$eval('#lb-data-tbl tr:nth-child(4) td:last-child', (t) => t.textContent)
  eq(seq3, '000003' + gs1ck('000003'), '第 3 个序号带 GS1 校验位')

  // ================= 5. 排版：拖动 / 键盘 / 双击 / 删除 =================
  await onTab('design')
  await page.waitForSelector('#lb-dsvg')
  const priceId = await page.evaluate(() => window.__lb.S.tpl.els[2].id)
  const hit = await page.$eval(`#lb-dsvg [data-id="${priceId}"] .lb-hit`, (r) => { const b = r.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 } })
  const scale = await page.$eval('#lb-dsvg', (s) => s.getBoundingClientRect().width / window.__lb.S.tpl.w)
  const before = await page.evaluate((id) => { const e = window.__lb.S.tpl.els.find((x) => x.id === id); return { x: e.x, y: e.y } }, priceId)
  await page.mouse.move(hit.x, hit.y); await page.mouse.down()
  await page.mouse.move(hit.x + 30, hit.y + 15, { steps: 4 }); await page.mouse.move(hit.x + 10 * scale, hit.y + 5 * scale, { steps: 4 }); await page.mouse.up()
  await page.waitForFunction(([id, x]) => window.__lb.S.tpl.els.find((e) => e.id === id).x !== x, [priceId, before.x])
  const after = await page.evaluate((id) => { const e = window.__lb.S.tpl.els.find((x) => x.id === id); return { x: e.x, y: e.y } }, priceId)
  eq(after.x, Math.round((before.x + 10) * 2) / 2, '拖动 10 mm 后 X（吸附到 0.5 mm）')
  eq(after.y, Math.round((before.y + 5) * 2) / 2, '拖动 5 mm 后 Y（吸附到 0.5 mm）')
  eq(await page.$eval('#lb-p-x', (e) => +e.value), after.x, '属性面板同步 X')
  await page.keyboard.press('ArrowRight')
  await page.waitForFunction(([id, x]) => window.__lb.S.tpl.els.find((e) => e.id === id).x === x, [priceId, Math.round((after.x + 0.5) * 10) / 10])
  await page.keyboard.press('Shift+ArrowDown')
  await page.waitForFunction(([id, y]) => window.__lb.S.tpl.els.find((e) => e.id === id).y === y, [priceId, Math.round((after.y + 5) * 10) / 10])
  // 双击文字元素 → 光标进文字框（按下时没有重建元素，dblclick 才派发得出来）
  const nameId = await page.evaluate(() => window.__lb.S.tpl.els[0].id)
  const nb = await page.$eval(`#lb-dsvg [data-id="${nameId}"] .lb-hit`, (r) => { const b = r.getBoundingClientRect(); return { x: b.x + 6, y: b.y + b.height / 2 } })
  await page.mouse.dblclick(nb.x, nb.y)
  await page.waitForFunction(() => document.activeElement && document.activeElement.id === 'lb-p-text')
  eq(await page.$eval('#lb-p-text', (e) => e.value), '{{品名}}', '双击后编辑的是品名文字')
  // 复制一份再用 Delete 删掉
  await page.click('#lb-p-dup'); await page.waitForFunction(() => window.__lb.S.tpl.els.length === 6)
  await page.focus('#lb-canvasbox'); await page.keyboard.press('Delete')
  await page.waitForFunction(() => window.__lb.S.tpl.els.length === 5)
  // 刚改完立刻刷新：防抖保存要在离页时补写
  await page.click(`#lb-els li[data-id="${priceId}"] button`)
  await page.focus('#lb-canvasbox'); await page.keyboard.press('ArrowLeft')
  const moved = await page.evaluate((id) => window.__lb.S.tpl.els.find((e) => e.id === id).x, priceId)
  await page.reload(); await page.waitForFunction(() => document.body.dataset.ready === '1')
  eq(await page.evaluate((id) => (window.__lb.S.tpl.els.find((e) => e.id === id) || {}).x, priceId), moved, '移动后立刻刷新，位置还在（pagehide 补写）')
  eq(await page.evaluate(() => window.__lb.tableOf().rows.length), 30, '刷新后 30 行数据还在')
  // 把价格挪回原位（后面打印要按模板原坐标核对 PDF）
  await onTab('design'); await page.click(`#lb-els li[data-id="${priceId}"] button`)
  await page.fill('#lb-p-x', String(before.x)); await page.fill('#lb-p-y', String(before.y))
  await page.waitForFunction(([id, x, y]) => { const e = window.__lb.S.tpl.els.find((q) => q.id === id); return e.x === x && e.y === y }, [priceId, before.x, before.y])
  // 模板库
  await onTab('design')
  await page.fill('#lb-tpl-name', '测试价签'); await page.click('#lb-tpl-save')
  await page.reload(); await page.waitForFunction(() => document.body.dataset.ready === '1'); await onTab('design')
  assert((await page.textContent('#lb-tpls')).includes('测试价签'), '模板库保存后刷新还在')

  // ================= 6. 打印：起始空位 + 分页 + PDF =================
  await onTab('print')
  await page.click('#lb-slots [data-slot="5"]')
  await page.waitForFunction(() => document.getElementById('lb-pr-pages') && document.getElementById('lb-pr-pages').textContent === '2')
  eq(await page.$eval('#lb-skip', (e) => e.value), '5', '点第 6 格 = 跳过前 5 个')
  eq(await page.textContent('#lb-pr-total'), '30', '30 张标签')
  eq(await page.textContent('#lb-pr-bad'), '1', '打印页提示 1 处条码错')
  eq(await page.$eval('#lb-printbox', (e) => e.querySelectorAll('.lb-page').length), 2, '打印容器里 2 页（5 + 30 = 35 > 24）')
  eq(await page.$eval('#lb-printbox .lb-page:nth-child(2)', (e) => e.querySelectorAll('svg.lb-lab').length), 11, '第 2 页 11 张')
  const pdfA = await page.pdf({ preferCSSPageSize: true })
  eq(pdfPages(pdfA), 2, 'Chromium 实打 PDF 的页数')
  const boxA = pdfBox(pdfA); near(boxA[0] * PT2MM, 210, 0.2, 'PDF 页宽 210 mm'); near(boxA[1] * PT2MM, 297, 0.2, 'PDF 页高 297 mm')
  await page.fill('#lb-offx', '1.5'); await page.fill('#lb-offy', '2')
  await page.waitForFunction(() => document.querySelector('#lb-printbox svg.lb-lab').getAttribute('x') === '141.5' && document.querySelector('#lb-printbox svg.lb-lab').getAttribute('y') === '39.5')
  const pdfB = await page.pdf({ preferCSSPageSize: true })
  eq(pdfPages(pdfB), 2, '加偏移后仍 2 页')
  if (process.env.LB_PDFTOTEXT) {
    const wa = pdfWords(pdfA, process.env.LB_PDFTOTEXT), wb = pdfWords(pdfB, process.env.LB_PDFTOTEXT)
    const pa = wa.find((w) => w.t === '¥9.90'), pb = wb.find((w) => w.t === '¥9.90')
    assert(pa && pb, 'PDF 里读得到第 1 行的价格')
    // 第 1 行落在第 6 格：第 2 列、第 1 行（0 起）；价格右对齐到标签内 x = 67 mm
    near(pa.x1, 140 + 67, 0.6, '第 1 行价格右边缘（PDF 实测，mm）')
    assert(pa.y0 > 37.5 && pa.y1 < 37.5 + 37, '第 1 行价格落在第 2 行标签里')
    near(pb.x0 - pa.x0, 1.5, 0.05, '向右偏移 1.5 mm（PDF 实测）')
    near(pb.y0 - pa.y0, 2.0, 0.05, '向下偏移 2 mm（PDF 实测）')
  }
  await page.fill('#lb-offx', '0'); await page.fill('#lb-offy', '0')
  // 热敏卷纸：资产标签 50×30，一张一页
  await onTab('design'); await page.click('[data-starter="asset"]')
  await onTab('print')
  await page.waitForFunction(() => document.getElementById('lb-pr-pages').textContent === '3')
  assert(await page.$eval('#lb-skip-sec', (e) => getComputedStyle(e).display === 'none'), '卷纸不显示起始空位')
  const pdfC = await page.pdf({ preferCSSPageSize: true })
  eq(pdfPages(pdfC), 3, '卷纸 3 行 = 3 页')
  const boxC = pdfBox(pdfC); near(boxC[0] * PT2MM, 50, 0.2, '卷纸页宽 50 mm'); near(boxC[1] * PT2MM, 30, 0.2, '卷纸页高 30 mm')
  await onTab('design'); await page.click('[data-starter="price"]')
  await onTab('print'); await page.waitForFunction(() => document.getElementById('lb-pr-pages').textContent === '1')

  // ================= 7. 渲染守卫 =================
  await onTab('code')
  await renderGuards(page, {
    assert, tabs: TABS, onTab, paneSel: (t) => `#pane-${t}`, panesRoot: '#lb-panes',
    figSel: (t) => t === 'design' ? '#lb-dsvg' : `#pane-${t} .lb-none`, cardSel: '.lb-card, .lb-panel', minControls: 70, minTextsInFig: 0,
    labelSel: 'th, dt, label, label > span, .lb-lab, .lb-h'   // 本页标签文字在 label 里的 span 上：只断 label 本身时 span 被 uppercase 也恒绿（改坏 M26 实测）
  })
  for (const t of ['code', 'design', 'print']) { await onTab(t); await guardBoxOverlap(page, { assert, sel: '.lb-tab, #pane-' + t + ' .lb-chip, #pane-' + t + ' .lb-btns > .lb-btn, #pane-' + t + ' .lb-slot' }) }
  await onTab('code')
  await page.selectOption('#lb-type', 'ean13'); await page.fill('#lb-data', ORACLE.ean13.data); await waitStage('ean13:' + ORACLE.ean13.data + ':')
  await page.evaluate(() => window.scrollTo(0, 0))
  await screenshot('thumb.png')
}
