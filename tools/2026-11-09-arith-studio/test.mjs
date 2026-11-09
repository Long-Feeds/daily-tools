// 小学计算工坊 · 集成测试
// 真值来源：ORACLE 块由 runs/<run>/toracle/oracle.py（Python 暴力枚举 + 直接算术）机械注入，不读页面引擎；
// 其余断言用本文件里的独立实现（进位计数、表达式求值、长除法）现场算。
import { renderGuards, guardBoxOverlap } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const ORACLE = {
 "presets": {
  "g1a-add20c": 43,
  "g1b-sub20b": 36,
  "g1b-add21": 774,
  "g2a-mul": 81,
  "g2a-sub22": 1620,
  "g3a-sub0": 19845,
  "g3a-mul1": 7092,
  "g3a-mul1n": 198,
  "g3b-div0": 3960,
  "g2b-divr": 324,
  "g5b-fsame": 351,
  "g5b-fdiff": 2664
 },
 "defaultCounts": [
  774,
  81,
  1620
 ],
 "addEq1": 360,
 "v305x24": {
  "rows": [
   "305",
   "24",
   "1220",
   "610",
   "7320"
  ],
  "answer": "7320"
 },
 "v1005m998": {
  "res": "7",
  "dots": 3
 },
 "v568p475": {
  "res": "1043",
  "carries": 3,
  "nocarry_tens": 3,
  "units": 3
 },
 "v75d6": "1.25",
 "v10d3r2": "3.33",
 "v618d6": {
  "q": "103",
  "r": 0,
  "lines": 3
 },
 "meta": {
  "tabs": [
   "sheet",
   "vert",
   "drill",
   "book",
   "stats",
   "about"
  ]
 }
};

// —— 独立小工具（不经过页面引擎） ——
const digitsOf = (x) => String(x).split('').reverse().map(Number)
function addCarries(a, b) {
  const da = digitsOf(a), db = digitsOf(b); let c = 0, k = 0
  for (let i = 0; i < Math.max(da.length, db.length); i++) { const t = (da[i] || 0) + (db[i] || 0) + c; c = t >= 10 ? 1 : 0; k += c }
  return k
}
function evalExpr(s, flat) {   // 小学写法 → 值；flat=true 时不分先乘除后加减（模拟错法）
  const toks = s.replace(/[[{]/g, '(').replace(/[\]}]/g, ')').match(/\d+|[+−×÷()]/g)
  let i = 0
  const P = { '+': 1, '−': 1, '×': flat ? 1 : 2, '÷': flat ? 1 : 2 }
  const ap = (o, a, b) => o === '+' ? a + b : o === '−' ? a - b : o === '×' ? a * b : a / b
  function prim() { const t = toks[i++]; if (t === '(') { const v = expr(1); i++; return v } return Number(t) }
  function expr(minP) {
    let lhs = prim()
    while (i < toks.length && P[toks[i]] >= minP) { const o = toks[i++]; const rhs = expr(P[o] + 1); lhs = ap(o, lhs, rhs) }
    return lhs
  }
  return expr(1)
}

export default async ({ page, toolURL, screenshot, assert }) => {
  const eq = (a, b, msg) => assert(a === b, `${msg}：期望 ${JSON.stringify(b)}，实得 ${JSON.stringify(a)}`)
  const ready = () => page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 10000 })
  const onTab = async (t) => {
    await page.click('#tab-' + t)
    await page.waitForFunction((t) => !document.getElementById('pane-' + t).hidden, t)
  }
  const previewKey = () => page.$eval('#as-pages', (e) => e.dataset.key)
  const waitPreviewChange = async (old) => page.waitForFunction((o) => document.getElementById('as-pages').dataset.key !== o && document.getElementById('as-pages').dataset.key, old, { timeout: 5000 })
  const problems = () => page.$$eval('#as-pages .as-page:not([data-ans]) .as-pi', (ns) => ns.map((n) => n.textContent.replace(/\s+/g, '')))
  const answers = () => page.$$eval('#as-pages .as-page[data-ans] .as-ans-grid > div', (ns) => ns.map((n) => n.textContent.replace(/\s+/g, '')).filter(Boolean))
  const parseP = (s) => { const m = /^(\d+)\.(\d+(?:\.\d+)?)([+−×÷])(\d+(?:\.\d+)?)=?$/.exec(s); return m && { no: +m[1], a: +m[2], op: m[3], b: +m[4] } }
  const ansMap = async () => { const m = {}; for (const s of await answers()) { const r = /^(\d+)\.(.+)$/.exec(s); if (r) m[+r[1]] = r[2] } return m }

  await page.goto(toolURL)
  await ready()

  // ================= 1. 默认题卡：每组精确计数 =================
  for (let gi = 0; gi < 3; gi++) {
    const c = await page.$eval('#as-g' + gi + '-count', (e) => e.dataset.count)
    eq(c, String(ORACLE.defaultCounts[gi]), `默认第 ${gi + 1} 组的符合条件题数（Python 暴力枚举）`)
  }
  eq(await page.$eval('#as-total', (e) => e.textContent), '共 32 题', '题组合计')
  // 每道题都满足本组条件、组内不重复；答案页与独立计算一致
  let ps = (await problems()).map(parseP)
  assert(ps.every(Boolean), '预览里每道题都能解析成「a op b」')
  eq(ps.length, 32, '预览题数')
  let A = await ansMap()
  const g0 = ps.filter((p) => p.no <= 16), g1 = ps.filter((p) => p.no > 16 && p.no <= 28), g2 = ps.filter((p) => p.no > 28)
  assert(g0.every((p) => p.op === '+' && p.a >= 10 && p.a <= 99 && p.b >= 1 && p.b <= 9 && p.a + p.b <= 100), '第 1 组：两位数加一位数、和 ≤ 100')
  assert(g1.every((p) => p.op === '×' && p.a >= 1 && p.a <= 9 && p.b >= 1 && p.b <= 9), '第 2 组：表内乘法')
  assert(g2.every((p) => p.op === '−' && p.a >= 10 && p.a <= 99 && p.b >= 10 && p.b <= 99 && p.a >= p.b && p.a % 10 < p.b % 10), '第 3 组：两位数退位减法')
  for (const g of [g0, g1, g2]) eq(new Set(g.map((p) => p.a + p.op + p.b)).size, g.length, '组内不重复')
  for (const p of ps) eq(A[p.no], String(p.op === '+' ? p.a + p.b : p.op === '×' ? p.a * p.b : p.a - p.b), `答案页第 ${p.no} 题`)

  // ================= 2. 改条件：恰好进位一次 =================
  let k0 = await previewKey()
  await page.selectOption('#as-g0-carry', 'eq1')
  await waitPreviewChange(k0)
  eq(await page.$eval('#as-g0-count', (e) => e.dataset.count), String(ORACLE.addEq1), '两位数加一位数、恰好进位一次的题数')
  ps = (await problems()).map(parseP)
  assert(ps.filter((p) => p.no <= 16).every((p) => addCarries(p.a, p.b) === 1), '改成「恰好 1 次」后每道加法题都正好进位一次')

  // ================= 3. 题不够时的提示 =================
  k0 = await previewKey()
  await page.fill('#as-g1-n', '100')
  await waitPreviewChange(k0)
  const warn = await page.$eval('#as-warns', (e) => e.textContent)
  assert(warn.includes('只有 81 道'), '表内乘法只有 81 道题，要求 100 道时给出提示：' + warn)
  assert((await page.$eval('#as-g1-count', (e) => e.textContent)).includes('不够 100 道'), '题组徽标提示不够')
  ps = (await problems()).map(parseP)
  const mulAll = ps.filter((p) => p.op === '×')
  eq(mulAll.length, 81, '表内乘法全部 81 道都出了')
  eq(new Set(mulAll.map((p) => p.a * 10 + p.b)).size, 81, '81 道互不重复（覆盖整张乘法表）')
  k0 = await previewKey()
  await page.fill('#as-g1-n', '12')
  await waitPreviewChange(k0)

  // ================= 4. 种子：同种子同卡，换一批不同 =================
  const snap = (await problems()).join('|')
  k0 = await previewKey()
  await page.click('#as-reseed')
  await waitPreviewChange(k0)
  const other = (await problems()).join('|')
  assert(other !== snap, '换一批后题目变了')
  k0 = await previewKey()
  await page.fill('#as-seed', '2026')
  await waitPreviewChange(k0)
  eq((await problems()).join('|'), snap, '种子改回 2026，题卡逐字复原')

  // ================= 5. 打印：PDF 页数 = A4 页数，题目不被裁 =================
  const pageInfo = async () => page.$eval('#as-pageinfo', (e) => e.textContent)
  for (const [font, cols] of [['16', '4'], ['24', '5']]) {
    k0 = await previewKey()
    await page.selectOption('#as-font', font); await page.selectOption('#as-cols', cols)
    if (font !== '16') await waitPreviewChange(k0)
    const nPages = await page.$$eval('#as-printbox .as-page', (ns) => ns.length)
    const info = await pageInfo()
    assert(info.includes(nPages + ' 页'), `页数显示 ${info} 与 A4 页 ${nPages} 一致`)
    const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true })
    const pdfPages = (pdf.toString('latin1').match(/\/Type\s*\/Page(?!s)/g) || []).length
    eq(pdfPages, nPages, `字号 ${font}、每行 ${cols} 题时 Chromium 打印出的 PDF 页数`)
    await page.emulateMedia({ media: 'print' })
    const clip = await page.evaluate(() => {
      const out = []
      document.querySelectorAll('#as-printbox .as-page').forEach((pg, pi) => {
        const pr = pg.getBoundingClientRect(), foot = pg.querySelector('.as-pg-foot').getBoundingClientRect()
        pg.querySelectorAll('.as-pi, .as-ans-grid > div, .as-pg-sec').forEach((el) => {
          const r = el.getBoundingClientRect()
          if (el.scrollWidth > el.clientWidth + 1) out.push(`第${pi + 1}页「${el.textContent.trim()}」被裁 ${el.scrollWidth - el.clientWidth}px`)
          if (r.bottom > foot.top + 1 || r.right > pr.right + 1) out.push(`第${pi + 1}页「${el.textContent.trim().slice(0, 12)}」越出版心`)
        })
      })
      return out
    })
    await page.emulateMedia({ media: null })   // 复位：设成 'screen' 会让下一次 page.pdf() 按屏幕样式出 PDF（实撞：2 页变 6 页）
    assert(clip.length === 0, '打印版面：' + clip.slice(0, 4).join('; '))
  }
  k0 = await previewKey()
  await page.selectOption('#as-font', '16'); await page.selectOption('#as-cols', '4')
  await waitPreviewChange(k0)

  // ================= 6. 分享链接：别人打开是同一张卡 =================
  await page.click('#as-share')
  const url = await page.$eval('#as-share', (e) => e.dataset.url)
  assert(/#s=[A-Za-z0-9_-]+$/.test(url), '分享链接带题卡编码')
  const mine = (await problems()).join('|')
  const p2 = await page.context().newPage()
  await p2.goto(url)
  await p2.waitForFunction(() => document.body.dataset.ready === '1')
  const theirs = await p2.$$eval('#as-pages .as-page:not([data-ans]) .as-pi', (ns) => ns.map((n) => n.textContent.replace(/\s+/g, '')).join('|'))
  eq(theirs, mine, '分享链接打开后的题卡')
  await p2.close()

  // ================= 7. 年级模板：计数与题面 =================
  await page.click('#as-openpresets')
  await page.waitForSelector('#as-presets .as-preset')
  for (const [pid, want] of Object.entries(ORACLE.presets)) {
    const txt = await page.$eval(`.as-preset[data-pid="${pid}"] small`, (e) => e.textContent)
    const shown = txt.match(/共 (?:约 )?([\d,.]+) (万 )?道/)
    const val = shown ? (shown[2] ? Math.round(parseFloat(shown[1]) * 1e4) : Number(shown[1].replace(/,/g, ''))) : NaN
    if (want >= 1e5) assert(Math.abs(val - want) <= 500, `模板 ${pid} 约数 ${txt} vs ${want}`)
    else eq(val, want, `模板 ${pid} 的题数（Python 暴力枚举）`)
  }
  k0 = await previewKey()
  await page.click('.as-preset[data-pid="g3b-div0"]')
  await waitPreviewChange(k0)
  eq(await page.$eval('#as-g3-count', (e) => e.dataset.count), String(ORACLE.presets['g3b-div0']), '商中间有 0 的除法题数')
  ps = (await problems()).map(parseP)
  A = await ansMap()
  const divs = ps.filter((p) => p.op === '÷')
  eq(divs.length, 8, '加进来 8 道除法')
  for (const p of divs) {
    const q = Math.floor(p.a / p.b), r = p.a % p.b
    assert(p.b >= 2 && p.b <= 9 && q >= 100 && q <= 999 && Math.floor(q / 10) % 10 === 0, `${p.a} ÷ ${p.b} 的商 ${q} 十位是 0`)
    eq(A[p.no], r ? q + '……' + r : String(q), `答案页 ${p.a} ÷ ${p.b}`)
  }
  await page.click('#as-closepresets')
  eq(await page.$eval('#as-presetbox', (e) => getComputedStyle(e).display), 'none', '收起后年级模板面板真的藏住了（计算样式）')
  // 竖式题在卡上是带框的
  const vbox = await page.$$eval('#as-pages .as-pi-v', (ns) => ns.length)
  eq(vbox, 12, '竖式题（4 道减法 + 8 道除法）都留了演算框')

  // ================= 8. 在线练习（用分享链接固定一张测试卡） =================
  const slim = { t: '测试卡', s: '7', x: 0, c: 4, a: 1, f: 16, g: [
    ['mix', { ops: 2, set: 'all', numMax: 100, resMax: 200, interMax: 1000, paren: 'none' }, 4, 'h', '两步混合', null],
    ['add', { aMin: 2, aMax: 9, bMin: 2, bMax: 9, rMin: 0, rMax: 18, carry: 'eq1' }, 4, 'h', '凑十法', null],
    ['div', { dMin: 2, dMax: 9, qMin: 1, qMax: 9, rem: 'pos' }, 2, 'h', '有余数', null]] }
  const code = Buffer.from(JSON.stringify(slim), 'utf8').toString('base64url')
  await page.goto('about:blank')
  await page.goto(toolURL + '#s=' + code)
  await ready()
  eq(await page.$eval('#as-title', (e) => e.value), '测试卡', '用独立编码的分享串载入题卡（标题）')
  await onTab('sheet')
  await page.click('#as-drill-this')
  await page.waitForFunction(() => !document.getElementById('as-drun').hidden)
  let nOk = 0, nWrong = 0, orderHits = 0, carryHits = 0
  for (let i = 0; i < 10; i++) {
    await page.waitForFunction((i) => document.getElementById('as-dcard').dataset.q === String(i) && !document.getElementById('as-dsubmit').hidden, i)
    const q = (await page.$eval('#as-dq', (e) => e.textContent)).replace(/=\s*$/, '').trim()
    const hasRem = await page.$eval('#as-dremwrap', (e) => !e.hidden)
    let ans, rem = '', expectOk = true, expectMsg = ''
    if (i < 4) {
      const v = evalExpr(q, false), l2r = evalExpr(q, true)
      if (Number.isInteger(l2r) && l2r >= 0 && l2r !== v) { ans = String(l2r); expectOk = false; expectMsg = '运算顺序错了'; orderHits++ }
      else ans = String(v)
    } else if (i < 8) {
      const m = /^(\d+)\s*\+\s*(\d+)$/.exec(q); const a = +m[1], b = +m[2]
      if (i >= 6) { ans = String((a + b) % 10); expectOk = false; expectMsg = '漏了进位'; carryHits++ } else ans = String(a + b)
    } else {
      const m = /^(\d+)\s*÷\s*(\d+)$/.exec(q); const a = +m[1], b = +m[2]
      assert(hasRem, '有余数的除法显示余数格')
      ans = String(Math.floor(a / b)); rem = String(a % b)
      if (i === 9) { rem = String(a % b + 1 < b ? a % b + 1 : a % b - 1); expectOk = false; expectMsg = '正确答案是 ' + Math.floor(a / b) + '……' + (a % b) }
    }
    await page.fill('#as-dinput', ans)
    if (hasRem) await page.fill('#as-drem', rem)
    await page.click('#as-dsubmit')
    if (expectOk) { nOk++; await page.waitForFunction(() => document.getElementById('as-dfeed').textContent.includes('对了')) }
    else {
      nWrong++
      await page.waitForFunction(() => !document.getElementById('as-dnext').hidden)
      const fb = await page.$eval('#as-dfeed', (e) => e.textContent)
      assert(fb.includes(expectMsg), `第 ${i + 1} 题「${q}」答 ${ans} 应诊断为「${expectMsg}」，实得：${fb}`)
      await page.click('#as-dnext')
    }
  }
  assert(orderHits >= 1, '测试卡里至少有一道「先算加减会算错」的混合运算（换种子）')
  eq(carryHits, 2, '两道故意漏进位')
  await page.waitForFunction(() => !document.getElementById('as-dsum').hidden)
  eq(await page.$eval('#as-dk-acc', (e) => e.textContent), Math.round(nOk / 10 * 100) + '%', '本轮正确率')
  eq(await page.$$eval('#as-dsumlist .as-sum-item', (ns) => ns.length), nWrong, '小结里列出每道错题')
  // 立刻刷新：记录与错题必须已经落盘
  await page.reload()
  await ready()
  await onTab('stats')
  eq(await page.$eval('#as-st-n', (e) => e.textContent), '10', '刷新后累计做题')
  eq(await page.$eval('#as-st-acc', (e) => e.textContent), Math.round(nOk / 10 * 100) + '%', '刷新后平均正确率')
  await onTab('book')
  eq(await page.$eval('#as-bk-total', (e) => e.textContent), String(nWrong), '错题本收进了每道错题')
  eq(await page.$$eval('#as-bk-table tbody tr[data-key]', (ns) => ns.length), nWrong, '错题本表格行数')
  assert(await page.$eval('#as-bk-review', (e) => e.disabled), '错题明天才到期，今天不能复习')
  const dueTxt = await page.$$eval('#as-bk-table tbody tr[data-key] td:nth-child(6)', (ns) => ns.map((n) => n.textContent))
  assert(dueTxt.every((t) => t === '明天'), '新错题明天复习：' + dueTxt.join(','))
  // 把到期日改成今天 → 复习全对 → 进第 2 盒
  await page.evaluate(() => {
    const k = 'as-v1-book', d = new Date(), t = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
    const b = JSON.parse(localStorage.getItem(k)); b.forEach((x) => { x.due = t }); localStorage.setItem(k, JSON.stringify(b))
  })
  await page.reload(); await ready()
  await onTab('book')
  eq(await page.$eval('#as-bk-review', (e) => e.textContent), '复习今天到期的 ' + nWrong + ' 道', '到期题数')
  eq(await page.$eval('#as-book-n', (e) => e.textContent), String(nWrong), '页签上的到期角标')
  await page.click('#as-bk-review')
  await page.waitForFunction(() => !document.getElementById('as-drun').hidden)
  for (let i = 0; i < nWrong; i++) {
    await page.waitForFunction((i) => document.getElementById('as-dcard').dataset.q === String(i) && !document.getElementById('as-dsubmit').hidden, i)
    const q = (await page.$eval('#as-dq', (e) => e.textContent)).replace(/=\s*$/, '').trim()
    const dm = /^(\d+)\s*÷\s*(\d+)$/.exec(q)
    if (dm && await page.$eval('#as-dremwrap', (e) => !e.hidden)) { await page.fill('#as-dinput', String(Math.floor(+dm[1] / +dm[2]))); await page.fill('#as-drem', String(+dm[1] % +dm[2])) }
    else await page.fill('#as-dinput', String(evalExpr(q, false)))
    await page.click('#as-dsubmit')
    await page.waitForFunction(() => document.getElementById('as-dfeed').textContent.includes('对了'))
  }
  await page.waitForFunction(() => !document.getElementById('as-dsum').hidden)
  eq(await page.$eval('#as-dk-acc', (e) => e.textContent), '100%', '复习全对')
  await onTab('book')
  const boxes = await page.$$eval('#as-bk-table tbody tr[data-key] td:nth-child(5)', (ns) => ns.map((n) => n.textContent))
  assert(boxes.length === nWrong && boxes.every((t) => t === '第 2 盒'), '复习答对后升到第 2 盒：' + boxes.join(','))
  eq(await page.$eval('#as-bk-due', (e) => e.textContent), '0', '复习完今天没有到期题了')

  // ================= 9. 竖式：看过程 =================
  await onTab('vert')
  const vRows = () => page.$$eval('#as-vgrid .as-vrow:not(.as-vrow-s)', (rs) => rs.map((r) => Array.from(r.querySelectorAll('.as-c')).filter((c) => !c.classList.contains('as-c-op')).map((c) => c.textContent).join('').trim()))
  const vGo = async (expr, mode) => {
    if (mode) await page.selectOption('#as-vdivmode', mode)
    await page.fill('#as-vexpr', expr)
    await page.press('#as-vexpr', 'Enter')
    await page.waitForFunction((e) => document.getElementById('as-vgrid').dataset.key.startsWith(e.replace(/\s+/g, ' ')), expr)
  }
  await vGo('305 × 24')
  eq((await vRows()).join('|'), ORACLE.v305x24.rows.join('|'), '305 × 24 的竖式各行（因数、两行部分积、积）')
  eq(await page.$eval('#as-vanswer', (e) => e.textContent), '得数：' + ORACLE.v305x24.answer, '305 × 24 的得数')
  const rowCols = (ri) => page.$$eval('#as-vgrid .as-vrow:not(.as-vrow-s)', (rs, ri) => Array.from(rs[ri].querySelectorAll('.as-c[id]')).filter((c) => !c.classList.contains('as-c-op') && !c.classList.contains('as-c-br')).map((c) => +c.id.split('c').pop()), ri)
  const smallCols = (ch) => page.$$eval('#as-vgrid .as-vrow-s .as-c[id]', (ns, ch) => ns.filter((n) => n.textContent === ch).map((n) => +n.id.split('c').pop()), ch)
  const last = (a) => a[a.length - 1]
  const [c1, cp1, cp2, cpr] = [await rowCols(0), await rowCols(2), await rowCols(3), await rowCols(4)]
  eq(last(cp1), last(c1), '个位那一行部分积的末位对齐个位')
  eq(last(cp2), last(c1) - 1, '十位那一行部分积的末位对齐十位（错位一格）')
  eq(last(cpr), last(c1), '积的末位对齐个位')
  await page.click('#as-vreset')
  eq(await page.$eval('#as-vstepno', (e) => e.textContent), '0 / 3', '从头开始')
  const hidden0 = await page.$$eval('#as-vgrid .as-c-hide', (ns) => ns.length)
  await page.click('#as-vnext'); await page.click('#as-vnext')
  eq(await page.$eval('#as-vstepno', (e) => e.textContent), '2 / 3', '走两步')
  const nowTxt = await page.$$eval('#as-vgrid .as-c-now', (ns) => ns.map((n) => n.textContent).join(''))
  eq(nowTxt, ORACLE.v305x24.rows[3], '第 2 步正在写的是十位那一行部分积')
  assert((await page.$$eval('#as-vgrid .as-c-hide', (ns) => ns.length)) < hidden0, '走两步后藏着的格子变少了')
  await vGo('1005 − 998')
  const r1005 = await vRows()
  eq(r1005[r1005.length - 1], ORACLE.v1005m998.res, '1005 − 998 的得数行（最高位的 0 不写）')
  eq(await page.$$eval('#as-vgrid .as-vrow-s .as-c', (ns) => ns.filter((n) => n.textContent === '·').length), ORACLE.v1005m998.dots, '连续退位点的个数')
  eq((await smallCols('·')).join(','), (await rowCols(0)).slice(0, -1).join(','), '退位点写在被借走的千位、百位、十位上面')
  await vGo('7.5 ÷ 6', 'exact')
  eq(await page.$eval('#as-vanswer', (e) => e.textContent), '得数：' + ORACLE.v75d6, '7.5 ÷ 6 除尽')
  await vGo('10 ÷ 3', 'r2')
  eq(await page.$eval('#as-vanswer', (e) => e.textContent), '得数：≈ ' + ORACLE.v10d3r2, '10 ÷ 3 保留两位（Python ROUND_HALF_UP）')

  // ================= 10. 竖式：自己算 + 逐格诊断 =================
  await vGo('568 + 475')
  const resCols = await rowCols(2)
  eq((await smallCols('1')).length, ORACLE.v568p475.carries, '568 + 475 的进位标记个数')
  eq((await smallCols('1')).join(','), resCols.slice(0, -1).join(','), '进位的 1 写在横线上方前一位（十位、百位、千位）')
  await page.click('#as-vm-do')
  await page.waitForFunction(() => document.querySelector('#as-vgrid .as-c-cur') !== null)
  for (const k of [String(ORACLE.v568p475.units), String(ORACLE.v568p475.nocarry_tens), '0', '1']) await page.keyboard.press(k)
  await page.click('#as-vcheck')
  const types = await page.$$eval('#as-vissues .as-issue[data-type]', (ns) => ns.map((n) => n.dataset.type))
  eq(types.join(','), 'add-nocarry', '十位漏加进位被认出来')
  eq(await page.$$eval('#as-vgrid .as-c-bad', (ns) => ns.length), 1, '只有十位那一格标红')
  await page.click('#as-vhint')
  await page.click('#as-vcheck')
  assert((await page.$eval('#as-vissues', (e) => e.textContent)).includes('全部填对了'), '提示补上后全对')
  eq((await vRows()).slice(-1)[0], ORACLE.v568p475.res, '填完的得数行')
  await page.click('#as-vm-show')
  await vGo('618 ÷ 6', 'rem')
  await page.click('#as-vm-do')
  await page.waitForFunction(() => document.querySelector('#as-vgrid .as-c-cur') !== null)
  await page.keyboard.press('2')
  await page.click('#as-vcheck')
  const t2 = await page.$$eval('#as-vissues .as-issue[data-type]', (ns) => ns.map((n) => n.dataset.type))
  assert(t2.includes('div-big'), '商写 2：2 × 6 = 12 > 6，试商偏大：' + t2.join(','))
  await page.click('#as-vm-show')
  eq(await page.$eval('#as-vanswer', (e) => e.textContent), '得数：' + ORACLE.v618d6.q, '618 ÷ 6')
  const qCols = await rowCols(0), dCols = (await rowCols(1)).slice(1)
  eq(qCols.join(','), dCols.join(','), '商的每一位写在被除数相应数位的上面')
  eq(await page.$$eval('#as-vgrid .as-vline', (ns) => ns.length), ORACLE.v618d6.lines, '除号上的横杠 + 每次相减的横线')

  // ================= 11. 记录页的图 =================
  await onTab('stats')
  eq(await page.$eval('#as-st-n', (e) => e.textContent), String(10 + nWrong + 1), '累计做题 = 第一轮 10 + 复习 ' + nWrong + ' + 竖式 1')
  eq(await page.$$eval('#as-st-chart circle', (ns) => ns.length), 3, '图上 3 轮各一个点')

  // ================= 12. 渲染守卫 =================
  const n = await renderGuards(page, {
    assert, tabs: ORACLE.meta.tabs, onTab,
    paneSel: (t) => `#pane-${t}`, panesRoot: '#as-panes',
    figSel: (t) => (t === 'stats' ? '#as-st-chart' : `#pane-${t} svg.as-fig`), cardSel: '.as-card',
    minControls: 40, minTextsInFig: 8,
  })
  assert(n >= 40, '各页签累计扫到的可见控件数 ' + n)
  await onTab('sheet')
  await guardBoxOverlap(page, { assert, sel: '#as-tabs .as-tab, .as-preview-bar > button, .as-group-head > select, .as-group-head > button' })

  // 测试卡里混合运算组排在最前：版面上题号必须从 1 连续往下编
  const nos = await page.$$eval('#as-pages .as-page:not([data-ans]) .as-pi-no', (ns) => ns.map((n) => parseInt(n.textContent, 10)))
  eq(nos.join(','), nos.map((_, i) => i + 1).join(','), '版面题号按出现顺序 1、2、3…连续')
  const ansNos = await page.$$eval('#as-pages .as-page[data-ans] .as-pi-no', (ns) => ns.map((n) => parseInt(n.textContent, 10)))
  eq(ansNos.slice().sort((a, b) => a - b).join(','), nos.slice().sort((a, b) => a - b).join(','), '答案页题号与题面一一对应')

  // ================= 缩略图（换回默认题卡） =================
  await page.evaluate(() => localStorage.removeItem('as-v1-sheet'))
  await page.goto('about:blank')
  await page.goto(toolURL)
  await ready()
  await page.setViewportSize({ width: 1280, height: 850 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await screenshot('thumb.png')
}
