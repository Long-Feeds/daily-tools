// 动态几何作图台 · Construct Lab 集成测试
// 真值（ORACLE）由 run 目录 truth/gen_truth.py 用 sympy 精确有理 / 根式计算、按引擎文件头写明的规范分支口径独立实现，
// 经 inject-oracle.mjs 机械注入，不手抄、不读本页引擎。界面操作产生的坐标（点击、拖动）是运行时才知道的，
// 对应的派生值（中点、等边三角形顶点、轨迹方程）在测试里用闭式现场复算。
import { renderGuards, guardBoxOverlap, guardControlSize } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'
import fs from 'node:fs'

const ORACLE = {
 "euler": {
  "O": [
   0.22883939038686987,
   -0.9310668229777257
  ],
  "G": [
   0.43333333333333335,
   -0.26666666666666666
  ],
  "H": [
   0.8423212192262602,
   1.0621336459554513
  ],
  "og": 0.6951585002054935,
  "gh": 1.390317000410987
 },
 "nine": {
  "center": [
   0.75,
   -0.2814655172413793
  ],
  "r": 2.1472513487333837
 },
 "cc": [
  [
   -0.19342686690669153,
   0.7280895563556384
  ],
  [
   0.4594819127782512,
   -1.4482730425941706
  ]
 ],
 "lc": [
  [
   -1.4219453001163391,
   1.4322526110464782
  ],
  [
   -4.37050753007234,
   -0.20583751670685557
  ]
 ],
 "tangent": [
  [
   -2.579591274852758,
   1.431886912279137
  ],
  [
   0.02189896716045028,
   -2.4703484507406754
  ]
 ],
 "bisfoot": [
  -0.45038895784680416,
  1.1694554590144741
 ],
 "incircle": {
  "c": [
   0.7160675662822578,
   0.9431358477122864
  ],
  "r": 1.0807303184677757
 },
 "rot": [
  0.017949192431122706,
  -0.6650635094610966
 ],
 "refl": [
  5.2110091743119265,
  -1.036697247706422
 ],
 "dil": [
  -5.75,
  -6.25
 ],
 "hex4": [
  0.40192378864668404,
  9.160254037844387
 ],
 "angle": 55.35905248808371,
 "area": 6.875,
 "perim": 12.722878006693012,
 "distSeg": 2.692582403567252,
 "distLine": 2.107217827486533
};

const FIX = `A = 点(-2, -1)
B = 点(3, 0.5)
C = 点(0.5, 2.5)
D = 点(4, 3)
F = 点(-4, 0)
k1 = 圆(A, 2.5)
k2 = 圆(B, C)
X1 = 交点(k1, k2, 1)
X2 = 交点(k1, k2, 2)
l = 直线(C, F)
Y1 = 交点(l, k1, 1)
Y2 = 交点(l, k1, 2)
t1 = 切线(D, k1, 1)
t2 = 切线(D, k1, 2)
T1 = 垂足(A, t1)
T2 = 垂足(A, t2)
nb = 角平分线(A, B, C)
ac = 直线(A, C)
Z = 交点(nb, ac)
ic = 内切圆(A, B, C)
I = 圆心(ic)
R1 = 旋转(C, 60, B)
ab = 直线(A, B)
R2 = 对称(D, ab)
R3 = 位似(C, -1.5, A)
hx = 正多边形(A, B, 6)
V4 = 顶点(hx, 4)
α = 角度(A, B, C)
tri = 多边形(A, B, C)
m1 = 面积(tri)
m2 = 周长(tri)
sAB = 线段(A, B)
m3 = 距离(D, sAB)
m4 = 距离(D, ab)
S9 = 点(sAB, 1.7)
A0 = 点(0, 0)
B0 = 点(1, 2)
C0 = 点(4, 8)
bb = 角平分线(A0, B0, C0)
tt = 三等分角线(A0, B0, C0, 1)
pb0 = 中垂线(A0, B0)
R0 = 对称(A0, pb0)
nb0 = 角平分线(C0, B0, R0)
β = 角度(C0, B0, R0)
U = 点(1000000, 0)
U2 = 点(1000001, 0)
lu = 直线(U, U2)
O9 = 点(0, 0)
cu = 圆(O9, 1)
W1 = 交点(lu, cu, 1)
W2 = 交点(lu, cu, 2)
A8 = 点(100000000, 100000000)
B8 = 点(100000001, 100000000)
C8 = 点(100000000, 100000001)
t8 = 多边形(A8, B8, C8)
m8 = 面积(t8)`

// 一个「普通」构造：D 是自由点、恰好此刻落在 AC 上（偶然），任何关于 D 的关系都不该被报出来
const GENERIC = `A = 点(-2.3, -1.1)
B = 点(2.9, -0.7)
C = 点(0.4, 2.6)
D = 点(-0.95, 0.75)
a = 线段(B, C)
b = 线段(C, A)
c = 线段(A, B)
M = 中点(A, B)
N = 中点(B, C)
e = 线段(M, D)
g = 直线(C, D)`

export default async ({ page, toolURL, screenshot, assert }) => {
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  const SHOTS = process.env.CL_SHOTS || ''
  const shot = async (name) => { if (SHOTS) await page.screenshot({ path: `${SHOTS}/${name}` }) }
  const rel = (a, b) => Math.abs(a - b) / Math.max(1, Math.abs(a), Math.abs(b))
  const near = (a, b, tol = 1e-9) => rel(a, b) <= tol
  const nearP = (p, q, tol = 1e-9) => !!p && near(p.x, q[0], tol) && near(p.y, q[1], tol)
  const settle = () => page.waitForFunction(() => document.getElementById('cl-svg').dataset.key === CL.stateKey(), null, { timeout: 10000 }).catch(async (e) => { console.log('SETTLE', await page.evaluate(() => JSON.stringify({ key: document.getElementById('cl-svg').dataset.key, sk: CL.stateKey(), vis: document.visibilityState, pane: !document.getElementById('pane-draw').hidden }))); throw e })
  const val = (n) => page.evaluate((n) => { const o = CL.S.doc.get(n); return o && o.val ? JSON.parse(JSON.stringify(o.val)) : null }, n)
  const free = (n) => page.evaluate((n) => { const o = CL.S.doc.get(n); return o ? JSON.parse(JSON.stringify(o.free)) : null }, n)
  const names = () => page.evaluate(() => CL.S.doc.objs.map((o) => o.name))
  // 画布整块露在视口里再算屏幕坐标（点到视口外的点击会静默落空）
  const w2s = async (x, y) => {
    await page.evaluate(() => { const r = document.getElementById('cl-svg').getBoundingClientRect(); if (r.top < 0 || r.bottom > innerHeight) document.getElementById('cl-svg').scrollIntoView({ block: 'center' }) })
    return page.evaluate(([x, y]) => { const r = document.getElementById('cl-svg').getBoundingClientRect(); return [r.left + CL.sx(x), r.top + CL.sy(y)] }, [x, y])
  }
  const clickW = async (x, y) => { const [px, py] = await w2s(x, y); await page.mouse.click(px, py); await settle() }
  const clickObj = async (n) => { const v = await val(n); await clickW(v.x, v.y) }
  const tool = async (id) => { await page.click(`.cl-tool[data-tool="${id}"]`); await page.waitForFunction((id) => CL.S.tool === id, id) }
  const onTab = async (t) => { await page.click(`#tab-${t}`); await page.waitForFunction((t) => !document.getElementById('pane-' + t).hidden, t) }
  const loadText = async (text) => { await page.evaluate((t) => CL.load(t, { fit: true }), text); await settle() }
  const fillCmd = async (v) => { await page.fill('#cl-cmd', v); await page.press('#cl-cmd', 'Enter') }
  const relButtons = () => page.$$eval('#cl-rels .cl-rel', (bs) => bs.map((b) => ({ type: b.dataset.type, objs: b.dataset.objs.split(','), k: b.dataset.k, def: b.dataset.def, cls: b.className, text: b.textContent })))

  // ── 0. 首次打开：清空本机数据后重开 ──
  await page.goto(toolURL)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.waitForFunction(() => window.CL && CL.S.doc.objs.length > 0)
  await settle()
  assert((await page.title()).includes('Construct Lab'), '标题含 Construct Lab')
  assert(await page.$eval('a.cl-back', (a) => a.getAttribute('href') === '../../' && a.textContent.includes('返回工具集')), '顶部有返回工具集链接')
  const counts = await page.evaluate(() => ({ cmd: CL.CMD_HELP.length, g: CL.GC.GALLERY.length, l: CL.GC.LEVELS.length, badges: [...document.querySelectorAll('.cl-badges .cl-badge')].map((b) => b.textContent) }))
  assert(counts.badges[0].startsWith(counts.cmd + ' '), `徽标里的命令数 = 命令表行数 ${counts.cmd}：${counts.badges[0]}`)
  assert(counts.badges[1].startsWith(counts.g + ' ') && counts.g === 20, `徽标里的定理数 = 图库条数 20：${counts.badges[1]}`)
  assert(counts.badges[2].startsWith(counts.l + ' ') && counts.l === 14, `徽标里的挑战数 = 关卡数 14：${counts.badges[2]}`)
  assert((await names()).length === 9, '首次打开载入 9 个对象的示例三角形')

  // ── 1. 用工具在画布上作图 ──
  await page.click('#cl-clear'); await settle()
  assert((await names()).length === 0, '清空后没有对象')
  assert(await page.isVisible('#cl-toastbtn'), '清空后的提示条带「撤销」按钮')
  await page.evaluate(() => CL.setView(0, 0, 40)); await settle()
  await page.click('body', { position: { x: 5, y: 5 } })
  await page.keyboard.press('p')
  assert(await page.$eval('.cl-tool[data-tool="point"]', (b) => b.getAttribute('aria-pressed') === 'true'), '按 P 切到点工具')
  await clickW(-2, -1); await clickW(2, -1.5)
  let ns = await names()
  assert(ns.join(',') === 'A,B', `点两下得到 A、B：${ns}`)
  const fa = await free('A'), fb = await free('B')
  assert(Math.abs(fa.x + 2) < 0.05 && Math.abs(fa.y + 1) < 0.05, `A 落在点击处 (${fa.x}, ${fa.y})`)
  await tool('segment')
  {
    // 偏离 A、B 各 6 像素点下去：命中已有的点，不另建新点
    const [ax, ay] = await w2s(fa.x, fa.y), [bx, by] = await w2s(fb.x, fb.y)
    await page.mouse.click(ax + 6, ay - 2); await settle(); await page.mouse.click(bx - 4, by + 5); await settle()
  }
  ns = await names(); assert(ns.join(',') === 'A,B,f', `线段工具在 A、B 附近 6 像素处点击，选中已有的点得到线段 f：${ns}`)
  await tool('midpoint')
  await clickW((fa.x * 0.3 + fb.x * 0.7), (fa.y * 0.3 + fb.y * 0.7))
  let C = await val('C')
  assert(C && near(C.x, (fa.x + fb.x) / 2, 1e-12) && near(C.y, (fa.y + fb.y) / 2, 1e-12), '中点工具点线段 f 得到 AB 中点 C')
  await tool('circle'); await clickObj('A'); await clickObj('B')
  await clickObj('B'); await clickObj('A')
  ns = await names(); assert(ns.includes('c') && ns.includes('d'), `圆工具作出 c（圆心 A）、d（圆心 B）：${ns}`)
  await tool('intersect')
  await clickW(2 * fa.x - fb.x, 2 * fa.y - fb.y)        // c 上离 d 最远的一点
  await clickW(2 * fb.x - fa.x, 2 * fb.y - fa.y)        // d 上离 c 最远的一点
  // 规范分支：两圆圆心 A→B，左侧的是第 1 个 = A + (B−A) 逆时针转 60°（闭式现场复算）
  const ex = fb.x - fa.x, ey = fb.y - fa.y, c60 = 0.5, s60 = Math.sqrt(3) / 2
  const apexL = [fa.x + ex * c60 - ey * s60, fa.y + ex * s60 + ey * c60], apexR = [fa.x + ex * c60 + ey * s60, fa.y - ex * s60 + ey * c60]
  const D = await val('D'), E = await val('E')
  assert(nearP(D, apexL) && nearP(E, apexR), `交点工具得到两个交点，第 1 个在圆心连线左侧：D=(${D && D.x}, ${D && D.y})`)
  await tool('line'); await clickObj('D'); await clickObj('E')
  ns = await names(); assert(ns.includes('g'), '直线 DE（中垂线）：' + ns)
  const n0 = ns.length
  await tool('point'); await clickObj('C')
  assert((await names()).length === n0, '点工具点在已有的点 C 上不会重复建点')
  await clickW(fa.x, fa.y + Math.hypot(ex, ey))         // 圆 c 的正上方：线上点
  ns = await names()
  const pon = await page.evaluate((n) => { const o = CL.S.doc.get(n); return { cmd: o.cmd, host: o.args[0] && o.args[0].name } }, ns[ns.length - 1])
  assert(pon.cmd === 'PointOn' && pon.host === 'c', `点在圆上得到线上点：${JSON.stringify(pon)}`)
  const PON = ns[ns.length - 1]

  // ── 2. 拖动 ──
  await page.keyboard.press('Escape')
  await page.click('body', { position: { x: 5, y: 5 } })
  await page.keyboard.press('v')
  await page.waitForFunction(() => CL.S.tool === 'move')
  {
    const [px, py] = await w2s(fa.x, fa.y), [qx, qy] = await w2s(-3, 0.5)
    await page.mouse.move(px, py); await page.mouse.down(); await page.mouse.move((px + qx) / 2, (py + qy) / 2, { steps: 4 }); await page.mouse.move(qx, qy, { steps: 4 }); await page.mouse.up()
    await settle()
  }
  const fa2 = await free('A')
  assert(Math.abs(fa2.x + 3) < 0.05 && Math.abs(fa2.y - 0.5) < 0.05, `拖动 A 到 (-3, 0.5)：实得 (${fa2.x}, ${fa2.y})`)
  C = await val('C')
  assert(near(C.x, (fa2.x + fb.x) / 2, 1e-12) && near(C.y, (fa2.y + fb.y) / 2, 1e-12), '拖动后中点 C 跟着更新')
  {
    const ex2 = fb.x - fa2.x, ey2 = fb.y - fa2.y, D2 = await val('D')
    assert(nearP(D2, [fa2.x + ex2 * c60 - ey2 * s60, fa2.y + ex2 * s60 + ey2 * c60]), '拖动后交点 D 仍是左侧的等边三角形顶点')
    const pv = await val(PON), r = Math.hypot(ex2, ey2)
    assert(Math.abs(Math.hypot(pv.x - fa2.x, pv.y - fa2.y) - r) < 1e-9 * r, '线上点仍在圆 c 上')
  }
  {
    const before = await val('C'), [px, py] = await w2s(before.x, before.y)
    await page.mouse.move(px, py); await page.mouse.down(); await page.mouse.move(px + 40, py + 30, { steps: 3 }); await page.mouse.up(); await settle()
    const after = await val('C')
    assert(after.x === before.x && after.y === before.y, '由作图决定的点 C 拖不动')
  }
  await page.click('body', { position: { x: 5, y: 5 } })
  await page.keyboard.press('Control+z'); await settle()
  const fa3 = await free('A')
  assert(fa3.x === fa.x && fa3.y === fa.y, 'Ctrl+Z 撤销拖动，A 回到原处')
  await page.keyboard.press('Control+Shift+z'); await settle()
  assert((await free('A')).x === fa2.x, 'Ctrl+Shift+Z 重做拖动')

  // ── 3. 双击改名（Enter 收尾只执行一次）──
  {
    const bv = await val('B'), [px, py] = await w2s(bv.x, bv.y)
    await page.mouse.dblclick(px, py)
    await page.waitForSelector('#cl-objs .cl-rename')
    assert(await page.evaluate(() => document.activeElement.classList.contains('cl-rename')), '双击点 B 打开改名输入框并聚焦')
    await page.fill('#cl-objs .cl-rename', 'Q')
    await page.keyboard.press('Enter')
    await page.waitForFunction(() => CL.S.doc.has('Q') && !CL.S.doc.has('B'))
    const txt = await page.evaluate(() => CL.S.doc.print())
    assert(txt.includes('线段(A, Q)') && txt.includes('圆(Q, A)'), '改名后依赖它的命令一起改名')
    assert(await page.evaluate(() => document.activeElement && document.activeElement.dataset.n === 'Q'), '改名后焦点回到 Q 这一行')
    // Enter 收尾后重画列表会让输入框失焦：收尾只能执行一次，否则第二次会把「已改名」换成「没有 B」的错误
    assert((await page.textContent('#cl-cmderr')) === '已改名为 Q', `改名只收尾一次：${await page.textContent('#cl-cmderr')}`)
    assert(errors.length === 0, '改名按 Enter 没有页面报错：' + errors.join('|'))
  }
  {
    await page.focus('#cl-objs .cl-objbtn[data-n="C"]')
    await page.keyboard.press('F2')
    await page.waitForSelector('#cl-objs .cl-rename')
    await page.fill('#cl-objs .cl-rename', 'A')
    await page.keyboard.press('Enter')
    await page.waitForFunction(() => document.getElementById('cl-cmderr').textContent.includes('已经有'))
    assert(await page.evaluate(() => CL.S.doc.has('C')), '改成已有的名字被拒绝，C 还在')
    await page.focus('#cl-objs .cl-objbtn[data-n="C"]')
    await page.keyboard.press('F2')
    await page.waitForSelector('#cl-objs .cl-rename')
    await page.fill('#cl-objs .cl-rename', 'M')
    await page.click('#cl-hint')                        // blur 收尾
    await page.waitForFunction(() => CL.S.doc.has('M') && !CL.S.doc.has('C'))
    assert(errors.length === 0, 'blur 收尾改名没有页面报错')
  }

  // ── 4. 命令栏 ──
  await fillCmd('h = 垂线(D, f)')
  await page.waitForFunction(() => CL.S.doc.has('h'))
  assert((await page.textContent('#cl-cmderr')).includes('已添加 h'), '命令栏执行成功有提示')
  await fillCmd('中点(A)')
  await page.waitForFunction(() => document.getElementById('cl-cmderr').classList.contains('cl-is-err'))
  assert((await page.textContent('#cl-cmderr')).includes('参数不对'), '参数个数不对给出中文错误')
  await fillCmd('k9 = 圆(A, Z9)')
  await page.waitForFunction(() => document.getElementById('cl-cmderr').textContent.includes('Z9'))
  assert((await page.textContent('#cl-cmderr')).includes('没有名为「Z9」'), '引用不存在的对象给出错误')
  assert(!(await page.evaluate(() => CL.S.doc.has('k9'))), '出错的命令不入文档')
  await fillCmd('P1 = 中点（A，Q）')
  await page.waitForFunction(() => CL.S.doc.has('P1'))
  assert(true, '全角括号逗号也认')
  await fillCmd('u1 = 1.5; u2 = u1 * 2 + sqrt(9)')
  await page.waitForFunction(() => CL.S.doc.has('u2'))
  assert((await val('u2')).v === 6, '一行多条命令 + 表达式：u2 = 1.5*2 + 3 = 6')
  await page.click('body', { position: { x: 5, y: 5 } })
  await page.keyboard.press('Control+z'); await settle()
  assert(!(await page.evaluate(() => CL.S.doc.has('u1') || CL.S.doc.has('u2'))), '同一次提交的两条命令一步撤销')
  await page.keyboard.press('Control+y'); await settle()
  assert(await page.evaluate(() => CL.S.doc.has('u2')), 'Ctrl+Y 重做')

  // ── 5. 原语与 sympy 精确真值对拍 ──
  await page.fill('#cl-text', FIX)
  await page.click('#cl-apply')
  await page.waitForFunction(() => CL.S.doc.has('m4'))
  {
    const V = await page.evaluate(() => { const o = {}; CL.S.doc.objs.forEach((x) => { o[x.name] = x.val ? JSON.parse(JSON.stringify(x.val)) : null }); return o })
    assert(nearP(V.X1, ORACLE.cc[0]) && nearP(V.X2, ORACLE.cc[1]), '圆∩圆两个分支 = sympy')
    assert(nearP(V.Y1, ORACLE.lc[0]) && nearP(V.Y2, ORACLE.lc[1]), '直线∩圆两个分支 = sympy')
    assert(nearP(V.T1, ORACLE.tangent[0]) && nearP(V.T2, ORACLE.tangent[1]), '两条切线的切点 = sympy')
    assert(nearP(V.Z, ORACLE.bisfoot), '角平分线分对边 = sympy')
    assert(nearP(V.I, ORACLE.incircle.c) && near(V.ic.r, ORACLE.incircle.r), '内切圆圆心与半径 = sympy')
    assert(nearP(V.R1, ORACLE.rot) && nearP(V.R2, ORACLE.refl) && nearP(V.R3, ORACLE.dil), '旋转 / 轴对称 / 负比例位似 = sympy')
    assert(nearP(V.V4, ORACLE.hex4), '正六边形第 4 个顶点 = sympy')
    assert(near(V['α'].v, ORACLE.angle) && near(V.m1.v, ORACLE.area) && near(V.m2.v, ORACLE.perim), '角度 / 面积 / 周长 = sympy')
    assert(near(V.m3.v, ORACLE.distSeg) && near(V.m4.v, ORACLE.distLine) && V.m3.v > V.m4.v, '点到线段（端点）与点到直线的距离 = sympy')
    // fork BUG-4：线段上的点参数超出 [0, 1] 截到端点（与射线、圆弧、拖动的口径一致）
    assert(V.S9 && V.S9.x === 3 && V.S9.y === 0.5, `线段参数 1.7 截到端点 B：(${V.S9 && V.S9.x}, ${V.S9 && V.S9.y})`)
    // fork BUG-1：平角时三等分角线与角平分线同侧（BA 逆时针一侧）；闭式：BA 方向逆时针转 60°
    const ux = -1 / Math.sqrt(5), uy = -2 / Math.sqrt(5)
    assert(V.tt && near(V.tt.d.x, ux * 0.5 - uy * Math.sqrt(3) / 2, 1e-12) && near(V.tt.d.y, ux * Math.sqrt(3) / 2 + uy * 0.5, 1e-12), `平角的三等分角线 = BA 逆时针 60°：(${V.tt && V.tt.d.x}, ${V.tt && V.tt.d.y})`)
    assert(V.bb && V.bb.d.x * uy - V.bb.d.y * ux < 0 && V.tt.d.x * uy - V.tt.d.y * ux < 0, '平角的角平分线与三等分角线在同一侧')
    // fork BUG-3：角的一边是舍入级零长（R0 数学上就是 B0）⇒ 角平分线与角度未定义，而不是噪声值
    assert(V.nb0 === null && V['β'] === null, `零长角边：角平分线 ${JSON.stringify(V.nb0)}、角度 ${JSON.stringify(V['β'])} 都应未定义`)
    // Codex P1：直线起点在 10⁶ 处、穿过单位圆心——两个交点是 (∓1, 0)，不能塌成切点
    assert(V.W1 && V.W1.x === -1 && V.W1.y === 0 && V.W2 && V.W2.x === 1 && V.W2.y === 0, `远起点直线 ∩ 单位圆 = (−1,0)、(1,0)：${JSON.stringify([V.W1, V.W2])}`)
    // Codex P2：顶点在 10⁸ 处的直角三角形面积 0.5（以第一个顶点为原点累加，不丢面积）
    assert(V.m8 && V.m8.v === 0.5, `10⁸ 处的三角形面积 = 0.5：${V.m8 && V.m8.v}`)
  }
  await page.fill('#cl-text', 'A = 点(0, 0)\nB = 中点(A)\nC = 点(1, 1)')
  await page.click('#cl-apply')
  await page.waitForSelector('#cl-texterr:not([hidden]) li')
  assert((await page.textContent('#cl-texterr')).includes('第 2 行'), '命令文本出错时列出行号')
  assert(await page.evaluate(() => CL.S.doc.has('m4')), '有错误的文本不应用，原图保留')

  // ── 6. 发现关系：图库每一条公布的定理都要找得到 ──
  const gallery = await page.evaluate(() => CL.GC.GALLERY.map((g) => ({ id: g.id, check: g.check || null, locus: g.locus || null })))
  const dead = []
  for (const g of gallery) {
    if (!g.check) continue
    await page.evaluate((id) => CL.openGallery(id), g.id); await settle()
    await page.click('#cl-discover')
    await page.waitForFunction(() => document.querySelectorAll('#cl-rels .cl-rel').length > 0 || document.getElementById('cl-relsum').textContent.length > 0)
    const rs = await relButtons()
    for (const c of g.check) {
      // 有方向的关系（倍数）按顺序比对对象、再核对倍数 k；其余按集合包含
      const directed = c.type === 'ratio' || c.type === 'numratio'
      const hit = rs.some((r) => r.type === c.type && (directed ? r.objs.join(',') === c.objs.join(',') && Number(r.k) === c.k : c.objs.every((n) => r.objs.includes(n))))
      if (!hit) dead.push(`${g.id}:${c.type}(${c.objs})`)
    }
  }
  assert(dead.length === 0, `图库公布的定理都能被「发现关系」找到，缺：${dead.join('；')}`)
  await page.evaluate((id) => CL.openGallery(id), 'euler'); await settle()
  await page.click('#cl-discover')
  await page.waitForSelector('#cl-rels .cl-rel')
  {
    const rs = await relButtons()
    const col = rs.find((r) => r.type === 'collinear')
    assert(col && ['G', 'H', 'O'].every((n) => col.objs.includes(n)) && col.objs.length === 3, `欧拉线：O、G、H 共线是第一条共线关系：${col && col.text}`)
    assert(rs.filter((r) => r.type === 'concurrent').length === 3, '欧拉线图里三组三线共点（中线、高、中垂线）')
    assert(rs.length === 8, `欧拉线图一共发现 8 条关系（离线 node 实测的字面量）：${rs.length}`)
    const metas = await page.$$eval('#cl-rels .cl-rel', (bs) => bs.map((b) => ({ m: (b.querySelector('.cl-relmeta') || {}).textContent || '', d: +b.dataset.def })))
    assert(metas.length > 0 && metas.every((x) => /^\d+\/12$/.test(x.m) && x.d >= 6 && x.m === x.d + '/12'), `每条关系右侧写出实际检验次数（≥6/12）：${metas.map((x) => x.m).join(',')}`)
    await page.hover('#cl-rels .cl-rel[data-type="collinear"]')
    await page.waitForFunction(() => CL.S.hl.join(',').includes('G'))
    const hlCount = await page.$$eval('#cl-l-hl circle', (c) => c.length)
    assert(hlCount >= 3, `悬停关系时画布上高亮相关的点：${hlCount}`)
  }
  await shot('euler-discover.png')
  // fork BUG-2：扰动落在两圆几乎相切处时规范分支会换人，这组扰动要跳过，真定理不能被判成偶然
  {
    const MIQ = 'A = 点(-3.4927072463929654, -2.1142983643244952)\nB = 点(3.527766491966322, -1.8881395718641578)\nC = 点(0.32881714034825565, 2.967085960013792)\na = 线段(B, C)\nb = 线段(C, A)\nc = 线段(A, B)\nD = 点(a, 0.39450371350161734)\nE = 点(b, 0.42895617175847295)\nF = 点(c, 0.538256116444245)\nk1 = 圆(A, F, E)\nk2 = 圆(B, D, F)\nk3 = 圆(C, E, D)\nM = 交点(k1, k2, 1)'
    const r = await page.evaluate((t) => { const d = CL.GC.parse(t).doc; return d.discover({ seed: 1018 }).rels.map((x) => x.type + ':' + x.objs.join(',')) }, MIQ)
    assert(r.some((x) => x.startsWith('concyclic:') && ['C', 'D', 'E', 'M'].every((n) => x.includes(n))), `近分支点的扰动被跳过，密克定理照样找到：${r.join('|')}`)
  }
  // 偶然关系不报：D 此刻恰好在 AC 上，但它是自由点
  await loadText(GENERIC)
  await page.click('#cl-discover')
  await page.waitForFunction(() => document.getElementById('cl-relsum').textContent.length > 0)
  {
    const rs = await relButtons()
    assert(!rs.some((r) => r.objs.includes('D') || r.objs.includes('e') || r.objs.includes('g')), `偶然共线的自由点 D 不进任何关系：${rs.map((r) => r.text).join('|')}`)
  }

  // ── 7. 关系工具：恒成立 vs 只是此刻巧合 ──
  await tool('relation')
  await clickObj('A'); await clickObj('C'); await clickObj('D')
  await page.click('#cl-relgo')
  await page.waitForSelector('#cl-rels .cl-rel.cl-st-now')
  assert((await page.textContent('#cl-rels')).includes('仅此刻成立'), '关系工具：A、C、D 共线只是此刻成立')
  await page.evaluate((id) => CL.openGallery(id), 'euler'); await settle()
  await tool('relation')
  await clickObj('O'); await clickObj('G'); await clickObj('H')
  await page.click('#cl-relgo')
  await page.waitForSelector('#cl-rels .cl-rel.cl-st-always')
  assert((await page.textContent('#cl-rels')).includes('16/16'), '关系工具：O、G、H 共线在 16 次随机扰动里都成立')
  await page.evaluate((id) => CL.openGallery(id), 'thales'); await settle()
  assert((await page.textContent('#cl-relsum')) === '' && (await page.$$('#cl-rels .cl-rel')).length === 0, '换一张图后上一张图的关系检验结果清掉')

  // ── 8. 轨迹与解析式 ──
  const lociRes = {}
  for (const g of gallery.filter((x) => x.locus)) {
    await page.evaluate((id) => CL.openGallery(id), g.id); await settle()
    const r = await page.evaluate((L) => {
      const d = CL.S.doc, q = d.get('L1').val, P = (n) => d.get(n).val
      let worst = 0, cnt = 0
      const pts = q.paths.flat()
      for (const X of pts) {
        let res
        if (L.kind === 'ellipse') res = Math.hypot(X.x - P(L.f1).x, X.y - P(L.f1).y) + Math.hypot(X.x - P(L.f2).x, X.y - P(L.f2).y) - 2 * L.a
        else if (L.kind === 'hyperbola') res = Math.abs(Math.hypot(X.x - P(L.f1).x, X.y - P(L.f1).y) - Math.hypot(X.x - P(L.f2).x, X.y - P(L.f2).y)) - 2 * L.a
        else if (L.kind === 'parabola') res = Math.hypot(X.x - P(L.focus).x, X.y - P(L.focus).y) - (X.y - L.y0)
        else { const A = P(L.a), dx = X.x - A.x, dy = X.y - A.y; res = Math.hypot(dx, dy) - L.r * (1 - Math.cos(Math.atan2(dy, dx))) }
        cnt++
        if (!(Math.abs(res) <= worst)) worst = Math.abs(res)
      }
      return { worst, cnt, paths: q.paths.length }
    }, g.locus)
    lociRes[g.id] = r
    assert(r.cnt >= 150 && r.worst <= 1e-9, `轨迹 ${g.id}：${r.cnt} 个采样点满足解析式，最大残差 ${r.worst.toExponential(2)}`)
  }
  assert(lociRes.hyperbola.paths === 2, `双曲线轨迹有两支：${lociRes.hyperbola.paths}`)
  {
    // 可见范围里的采样要够密：两端都在画布里的相邻采样点之间不超过 12 像素（细分预算不能被画布外的远端吃光）
    const gap = await page.evaluate(() => {
      const q = CL.S.doc.get('L1').val, { W, H } = CL.size(); let worst = 0
      q.paths.forEach((p) => { for (let i = 1; i < p.length; i++) { const x0 = CL.sx(p[i - 1].x), y0 = CL.sy(p[i - 1].y), x1 = CL.sx(p[i].x), y1 = CL.sy(p[i].y); if ([x0, x1].every((x) => x >= 0 && x <= W) && [y0, y1].every((y) => y >= 0 && y <= H)) worst = Math.max(worst, Math.hypot(x1 - x0, y1 - y0)) } })
      return worst
    })
    assert(gap > 0 && gap <= 12, `双曲线在画布里的相邻采样点最多相距 ${gap.toFixed(1)} 像素`)
  }
  await shot('locus-hyperbola.png')
  await page.evaluate((id) => CL.openGallery(id), 'ellipse'); await settle()
  for (const zoom of [false, true]) {
    if (zoom) { await page.click('#cl-zoomin'); await settle() }
    const e = await page.evaluate(() => {
      const q = CL.S.doc.get('L1').val, p = q.paths[0], a = p[0], b = p[p.length - 1]
      const ang = p.map((X) => Math.atan2(X.y, X.x)).sort((x, y) => x - y)
      let gap = ang[0] + 2 * Math.PI - ang[ang.length - 1]
      for (let i = 1; i < ang.length; i++) gap = Math.max(gap, ang[i] - ang[i - 1])
      return { n: q.paths.length, len: p.length, close: Math.hypot(a.x - b.x, a.y - b.y), gap: gap * 180 / Math.PI }
    })
    assert(e.n === 1 && e.len >= 150 && e.close < 0.15 && e.gap < 5, `椭圆（${zoom ? '放大后' : '适应视图'}）是一条闭曲线：首尾距 ${e.close.toFixed(4)}、最大角缺口 ${e.gap.toFixed(2)}°`)
  }

  // ── 9. 作图步骤回放 ──
  await page.evaluate((id) => CL.openGallery(id), 'euler'); await settle()
  {
    const N = await page.evaluate(() => CL.S.doc.objs.length)
    await page.$eval('#cl-step', (el) => { el.value = '3'; el.dispatchEvent(new Event('input', { bubbles: true })) })
    await settle()
    const shown = await page.evaluate(() => ({ pts: document.querySelectorAll('#cl-l-pts circle[data-n]').length, lines: document.querySelectorAll('#cl-l-lines line').length, rows: document.querySelectorAll('#cl-stepsbody tr:not(.cl-future)').length, out: document.getElementById('cl-stepout').textContent }))
    assert(shown.pts === 3 && shown.lines === 0 && shown.rows === 3 && shown.out === `3 / ${N}`, `回放到第 3 步只画出 A、B、C：${JSON.stringify(shown)}`)
    await page.click('#cl-play')
    await page.waitForFunction(() => parseInt(document.getElementById('cl-stepout').textContent, 10) >= 5, null, { timeout: 10000 })
    await page.click('#cl-play')
    assert(await page.evaluate(() => CL.S.playing === null), '再点一次暂停播放')
    await page.$eval('#cl-step', (el) => { el.value = el.max; el.dispatchEvent(new Event('input', { bubbles: true })) })
    await settle()
    assert(await page.evaluate(() => CL.S.replay === -1), '拖到最后一步回到完整图')
  }

  // ── 10. 尺规作图挑战 ──
  await onTab('challenge')
  assert((await page.$$('#cl-levels .cl-lv')).length === 14, '挑战页列出 14 关')
  await page.click('[data-start="L02"]')
  await page.waitForFunction(() => !document.getElementById('cl-chal').hidden)
  await page.click('#cl-chal-ref')
  await page.waitForFunction(() => document.getElementById('cl-chal-meta').textContent.includes('已看过参考解'))
  assert(!(await page.evaluate((k) => (JSON.parse(localStorage.getItem(k) || '{}').L02 || {}).solved, 'cl.progress.v1')), '看参考解做出来的不计成绩')
  await page.evaluate(() => { if (CL.S.playing) document.getElementById('cl-play').click() })
  await onTab('challenge')
  await page.click('[data-start="L01"]')
  await page.waitForFunction(() => !document.getElementById('cl-chal').hidden && CL.S.level && CL.S.level.id === 'L01')
  assert(await page.$eval('.cl-tool[data-tool="midpoint"]', (b) => b.disabled), '第 1 关里「中点」工具不可用')
  assert(await page.$eval('#cl-cmd', (b) => b.disabled), '挑战中命令栏锁住')
  await tool('circle'); await clickObj('A'); await clickObj('B')
  await clickObj('B'); await clickObj('A')
  await page.waitForFunction(() => document.getElementById('cl-chal-meta').textContent.includes('已用 2 步'), null, { timeout: 8000 }).catch(async (e) => { console.log('DBG', await page.evaluate(() => JSON.stringify({ meta: document.getElementById('cl-chal-meta').textContent, objs: CL.S.doc.objs.map((o) => o.name), picks: CL.S.picks, tool: CL.S.tool, replay: CL.S.replay, view: CL.S.view }))); throw e })
  await tool('intersect')
  {
    // 两个圆各取一个看得见、又离另一个圆远的点：A 处沿 AB 方向转 120°，B 处镜像
    const a = await val('A'), b = await val('B'), r = Math.hypot(b.x - a.x, b.y - a.y), ux = (b.x - a.x) / r, uy = (b.y - a.y) / r
    const rot = (x, y, t) => [x * Math.cos(t) - y * Math.sin(t), x * Math.sin(t) + y * Math.cos(t)]
    const pc = rot(ux, uy, 2 * Math.PI / 3), pd = rot(-ux, -uy, -2 * Math.PI / 3)
    await clickW(a.x + r * pc[0], a.y + r * pc[1]); await clickW(b.x + r * pd[0], b.y + r * pd[1])
  }
  await page.waitForFunction(() => document.getElementById('cl-chal-title').textContent.includes('完成'), null, { timeout: 10000 }).catch(async (e) => { console.log('DBG2', await page.evaluate(() => JSON.stringify({ meta: document.getElementById('cl-chal-meta').textContent, objs: CL.S.doc.objs.map((o) => o.name + ':' + (o.val ? 1 : 0)), picks: CL.S.picks, tool: CL.S.tool, view: CL.S.view, size: CL.size(), err: document.getElementById('cl-cmderr').textContent }))); throw e })
  await page.waitForFunction(() => document.getElementById('cl-chal').dataset.saved === '1')
  await page.reload()                                   // 完成后立刻刷新：进度不能丢
  await page.waitForFunction(() => window.CL && CL.S.doc)
  await onTab('challenge')
  assert(await page.$eval('[data-level="L01"]', (el) => el.classList.contains('cl-solved') && el.textContent.includes('最少 2 步')), '刷新后第 1 关显示已完成、最少 2 步')
  await page.click('[data-start="L03"]')
  await page.waitForFunction(() => CL.S.level && CL.S.level.id === 'L03')
  await tool('line'); await clickObj('A'); await clickW(0.3, 2.2)
  await page.waitForFunction(() => document.getElementById('cl-chal-meta').textContent.includes('已用 1 步'))
  assert(!(await page.textContent('#cl-chal-title')).includes('完成'), '随手画的直线不算找到中点')
  // 每一关的参考解都要能被判为完成，且步数 = 公布的参考步数
  const lvBad = []
  const levels = await page.evaluate(() => CL.GC.LEVELS.map((L) => ({ id: L.id, ref: L.ref, steps: L.refSteps })))
  for (const L of levels) {
    await page.evaluate((id) => CL.startLevel(id), L.id)
    await page.evaluate((ref) => CL.runCmd(ref), L.ref)
    const ok = await page.waitForFunction(() => document.getElementById('cl-chal').dataset.saved === '1' && document.getElementById('cl-chal-title').textContent.includes('完成'), null, { timeout: 6000 }).then(() => true, () => false)
    const meta = await page.textContent('#cl-chal-meta')
    if (!ok || !meta.includes(`已用 ${L.steps} 步`)) lvBad.push(`${L.id}:${ok ? '' : '未完成'} ${meta}`)
    await page.evaluate(() => { delete document.getElementById('cl-chal').dataset.saved })
  }
  assert(lvBad.length === 0, `14 关参考解全部判为完成且步数一致：${lvBad.join('；')}`)
  {
    const prog = await page.evaluate(() => JSON.parse(localStorage.getItem('cl.progress.v1') || '{}'))
    assert(Object.keys(prog).length === 14 && prog.L01.best === 2, `进度里 14 关都已完成，第 1 关保留最少 2 步：${Object.keys(prog).length}`)
  }
  await page.click('#cl-chal-exit')
  await page.waitForFunction(() => document.getElementById('cl-chal').hidden)
  assert(!(await page.$eval('.cl-tool[data-tool="midpoint"]', (b) => b.disabled)) && !(await page.$eval('#cl-cmd', (b) => b.disabled)), '退出挑战后工具与命令栏恢复')
  await page.keyboard.press('Escape')
  await page.waitForFunction(() => document.getElementById('cl-toast').hidden)
  assert(await page.evaluate(() => getComputedStyle(document.getElementById('cl-chal')).display === 'none' && getComputedStyle(document.getElementById('cl-toast')).display === 'none'), '退出挑战后横幅、关掉的提示条计算样式都是 display:none')

  // ── 11. 图库页 ──
  await onTab('gallery')
  await page.click('[data-gtag="轨迹"]')
  assert((await page.$$('#cl-gallery .cl-lv')).length === 4, '轨迹筛选出 4 条')
  await page.click('[data-gtag="全部"]')
  await page.click('[data-open="ninepoint"]')
  await page.waitForFunction(() => !document.getElementById('pane-draw').hidden && CL.S.doc.has('n9'))
  await settle()
  {
    const n9 = await val('n9')
    assert(nearP(n9.c, ORACLE.nine.center) && near(n9.r, ORACLE.nine.r), '九点圆圆心与半径 = sympy')
    assert((await page.textContent('#cl-gnote-text')).includes('九点圆'), '打开图库条目时显示说明条')
  }
  await page.click('#cl-discover')
  await page.waitForSelector('#cl-rels .cl-rel[data-type="concyclic"]')
  {
    const first = (await relButtons())[0]
    assert(first.type === 'concyclic' && first.objs.length === 9, `九点共圆排在发现结果第一条：${first.text}`)
  }
  await shot('ninepoint.png')

  // ── 12. 我的作图：分键存储、跨页签、并发、写盘失败 ──
  await page.evaluate((id) => CL.openGallery(id), 'euler'); await settle()
  await onTab('saves')
  await page.fill('#cl-savename', '欧拉线测试')
  await page.click('#cl-savebtn')
  await page.waitForFunction(() => document.querySelectorAll('#cl-saves .cl-save').length === 1)
  const p2 = await page.context().newPage()
  await p2.goto(toolURL)
  await p2.waitForFunction(() => window.CL && CL.S.doc)
  await p2.click('#tab-saves')
  await p2.fill('#cl-savename', '第二页的作图')
  await p2.click('#cl-savebtn')
  await page.waitForFunction(() => document.querySelectorAll('#cl-saves .cl-save').length === 2)
  assert(true, '另一页签保存后，本页列表经 storage 事件同步为 2 条')
  // ext-write：同页直接改存储（不触发本页的 storage 事件），本页内存过期，再保存时外部那条必须还在
  await page.evaluate((k) => { const l = JSON.parse(localStorage.getItem(k)); l.push({ id: 'ext1', name: '外部写入', text: 'A = 点(0, 0)', n: 1, updated: '2026-11-26T00:00:00Z' }); localStorage.setItem(k, JSON.stringify(l)) }, 'cl.saves.v1')
  await page.fill('#cl-savename', '第三份')
  await page.click('#cl-savebtn')
  await page.waitForFunction(() => document.querySelectorAll('#cl-saves .cl-save').length === 4)
  assert(await page.evaluate((k) => JSON.parse(localStorage.getItem(k)).some((s) => s.id === 'ext1'), 'cl.saves.v1'), 'ext-write：外部写入的那条在本页保存后还在')
  await Promise.all([page.click('#cl-savebtn'), p2.click('#cl-savebtn')])
  await page.waitForFunction((k) => JSON.parse(localStorage.getItem(k)).length === 6, 'cl.saves.v1')
  assert(true, '两个页签同时保存，两条都留下（Web Locks 读改写）')
  await p2.close()
  {
    const before = await page.evaluate((k) => localStorage.getItem(k), 'cl.saves.v1')
    await page.evaluate(() => { window.__setItem = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (k === 'cl.saves.v1') throw new DOMException('quota', 'QuotaExceededError'); return window.__setItem.call(this, k, v) } })
    await page.fill('#cl-savename', '存不进去')
    await page.click('#cl-savebtn')
    await page.waitForFunction(() => document.getElementById('cl-toasttext').textContent.includes('没能保存'))
    await page.evaluate(() => { Storage.prototype.setItem = window.__setItem })
    const after = await page.evaluate((k) => localStorage.getItem(k), 'cl.saves.v1')
    assert(after === before, '写盘抛 QuotaExceededError 时如实提示失败、列表不变')
  }
  await page.click('[data-sren="ext1"]')
  await page.fill('#cl-saves input.cl-input', '外部写入（改名）')
  await page.keyboard.press('Enter')
  await page.waitForFunction((k) => JSON.parse(localStorage.getItem(k)).some((s) => s.name === '外部写入（改名）'), 'cl.saves.v1')
  assert(true, '列表里就地改名')
  await page.click('[data-sdel="ext1"]')
  assert((await page.textContent('[data-sdel="ext1"]')).includes('确认删除'), '删除要点两次')
  await page.click('[data-sdel="ext1"]')
  await page.waitForFunction((k) => !JSON.parse(localStorage.getItem(k)).some((s) => s.id === 'ext1'), 'cl.saves.v1')
  {
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#cl-exportall')])
    const data = JSON.parse(fs.readFileSync(await dl.path(), 'utf8'))
    assert(data.saves.length === 5 && data.progress.L01.solved, `导出全部 JSON：5 份作图 + 进度`)
    data.saves.push({ id: 'bad', name: '坏的', text: 'A = 中点(Z)' })
    await page.setInputFiles('#cl-import', { name: 'saves.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ saves: data.saves.slice(0, 2).concat([data.saves[data.saves.length - 1]]) })) })
    await page.waitForFunction(() => document.getElementById('cl-toasttext').textContent.includes('导入了'))
    assert((await page.textContent('#cl-toasttext')).includes('导入了 2 份') && (await page.textContent('#cl-toasttext')).includes('1 份有错误'), '导入时跳过有错误的作图')
  }
  await page.click('#cl-saves [data-sopen]')
  await page.waitForFunction(() => !document.getElementById('pane-draw').hidden)

  // ── 13. 草稿：改完立刻刷新不丢 ──
  await fillCmd('zz = 42')
  await page.waitForFunction(() => CL.S.doc.has('zz'))
  await page.reload()
  await page.waitForFunction(() => window.CL && CL.S.doc)
  assert(await page.evaluate(() => CL.S.doc.has('zz') && CL.S.doc.get('zz').val.v === 42), '改动后立刻刷新，草稿经 pagehide 补写不丢')

  // ── 14. 分享链接（同页 hashchange 与新开页都要能载入）──
  await page.evaluate((id) => CL.openGallery(id), 'simson'); await settle()
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {})
  await page.click('#cl-share')
  await page.waitForFunction(() => CL.S.lastShare.includes('#c='))
  const link = await page.evaluate(() => CL.S.lastShare)
  const simsonN = await page.evaluate(() => CL.S.doc.objs.length)
  await page.click('#cl-clear'); await settle()
  await page.evaluate((u) => { location.href = u }, link)
  await page.waitForFunction((n) => CL.S.doc.objs.length === n && CL.S.doc.has('s'), simsonN)
  await page.waitForFunction(() => location.hash === '')
  assert(true, '同一页里打开分享链接（hashchange）载入作图并去掉 hash')
  const p3 = await page.context().newPage()
  await p3.goto(link)
  await p3.waitForFunction((n) => window.CL && CL.S.doc.objs.length === n, simsonN)
  assert(await p3.evaluate(() => location.hash === ''), '新开页打开分享链接载入作图')
  await p3.close()

  // ── 15. 导出 SVG / PNG / 文本 ──
  {
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#cl-svgout')])
    const svg = fs.readFileSync(await dl.path(), 'utf8')
    const pr = await page.evaluate((s) => { const d = new DOMParser().parseFromString(s, 'image/svg+xml'); return { err: d.getElementsByTagName('parsererror').length, pts: d.querySelectorAll('#cl-l-pts circle[data-n]').length, circ: d.querySelectorAll('#cl-l-circ circle[data-n]').length, w: d.documentElement.getAttribute('width') } }, svg)
    const vis = await page.evaluate(() => CL.S.doc.objs.filter((o) => o.val && o.val.t === 'P' && o.flags.indexOf('hide') < 0).length)
    assert(pr.err === 0 && pr.pts === vis && pr.circ === 1 && +pr.w > 200, `导出的 SVG 是合法 XML，点数 ${pr.pts} = 可见点 ${vis}，外接圆 ${pr.circ} 个`)
  }
  {
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#cl-pngout')])
    const b = fs.readFileSync(await dl.path())
    const W = await page.evaluate(() => CL.size().W)
    assert(b.slice(0, 8).toString('hex') === '89504e470d0a1a0a' && b.readUInt32BE(16) === 2 * W, `导出 PNG：签名正确、宽 = 2×画布宽 ${2 * W}`)
  }
  {
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#cl-txtout')])
    const t = fs.readFileSync(await dl.path(), 'utf8')
    const expect = await page.evaluate(() => CL.S.doc.print({ meta: true }) + '\n')
    assert(t === expect, '下载的 .txt 与命令文本一致')
    const back = await page.evaluate((t) => { const r = CL.GC.parse(t); return { e: r.errors.length, k: CL.GC.docKey(r.doc) === CL.GC.docKey(CL.S.doc) } }, t)
    assert(back.e === 0 && back.k, '下载的文本再解析回来逐对象一致（往返）')
  }

  // ── 16. 说明页的命令表：每条例子都真的能用 ──
  {
    const r = await page.evaluate(() => CL.CMD_HELP.map((row) => { const p = CL.GC.parse(CL.HELP_FIXTURE + '\n' + row[2]); const o = p.doc.objs[p.doc.objs.length - 1]; return { cmd: row[0], ok: p.errors.length === 0 && !!o.val, err: p.errors.map((e) => e.msg).join('') } }))
    const bad = r.filter((x) => !x.ok)
    assert(bad.length === 0 && r.length === 38, `命令表 38 条例子全部可用：${bad.map((x) => x.cmd + ' ' + x.err).join('；')}`)
  }

  // ── 17. 键盘：对象列表里方向键微调，焦点不丢 ──
  await page.evaluate((id) => CL.openGallery(id), 'euler'); await settle()
  await page.focus('#cl-objs .cl-objbtn[data-n="A"]')
  {
    const a0 = await free('A')
    await page.keyboard.press('ArrowRight'); await settle()
    assert(await page.evaluate(() => document.activeElement && document.activeElement.closest('#cl-objs') && document.activeElement.closest('.cl-obj').dataset.n === 'A'), '方向键之后焦点还在 A 这一行')
    await page.keyboard.press('Shift+ArrowUp'); await settle()
    const a1 = await free('A')
    assert(Math.abs(a1.x - a0.x - 0.1) < 1e-9 && Math.abs(a1.y - a0.y - 1) < 1e-9, `→ 微调 0.1、Shift+↑ 微调 1：(${a0.x},${a0.y}) → (${a1.x},${a1.y})`)
    assert(await page.evaluate(() => document.activeElement.closest('.cl-obj').dataset.n === 'A'), '两次按键之间焦点一直在列表里')
    await page.keyboard.press('Delete'); await settle()
    assert(!(await page.evaluate(() => CL.S.doc.has('A'))), 'Delete 删除选中的对象')
    await page.click('#cl-undo'); await settle()
    assert(await page.evaluate(() => CL.S.doc.has('A') && CL.S.doc.has('O')), '撤销后 A 与依赖它的对象都回来')
  }

  // ── 19. Codex 复核采纳的修复，各补一条能抓住它的断言 ──
  // P1：第 8 关只用界面工具作出圆心——题目藏起来的圆心不能挡住用户作出的交点
  await page.evaluate((id) => CL.startLevel(id), 'L08'); await settle()
  {
    const kv = await val('k')
    const onK = (ang) => clickW(kv.c.x + kv.r * Math.cos(ang), kv.c.y + kv.r * Math.sin(ang))
    await tool('point'); await onK(0.3); await onK(2.2); await onK(4.0)
    const rot = (x, y, t) => [x * Math.cos(t) - y * Math.sin(t), x * Math.sin(t) + y * Math.cos(t)]
    const bisect = async (P, Q) => {
      await tool('circle'); await clickObj(P); await clickObj(Q); await clickObj(Q); await clickObj(P)
      const a = await val(P), b = await val(Q), r = Math.hypot(b.x - a.x, b.y - a.y), ux = (b.x - a.x) / r, uy = (b.y - a.y) / r
      const pc = rot(ux, uy, 2 * Math.PI / 3), pd = rot(-ux, -uy, -2 * Math.PI / 3), n0 = (await names()).length
      await tool('intersect'); await clickW(a.x + r * pc[0], a.y + r * pc[1]); await clickW(b.x + r * pd[0], b.y + r * pd[1])
      const ns2 = await names(), X = ns2[n0], Y = ns2[n0 + 1]
      await tool('line'); await clickObj(X); await clickObj(Y)
      const x = await val(X), y = await val(Y)
      return { line: (await names()).pop(), mid: [(x.x + y.x) / 2, (x.y + y.y) / 2] }
    }
    const f1 = await bisect('A', 'B'), f2 = await bisect('B', 'C')
    await tool('intersect'); await clickW(f1.mid[0], f1.mid[1]); await clickW(f2.mid[0], f2.mid[1])
    await page.waitForFunction(() => document.getElementById('cl-chal-title').textContent.includes('完成'), null, { timeout: 8000 })
    assert((await page.textContent('#cl-chal-meta')).includes('已用 6 步'), '第 8 关用界面工具 6 步作出圆心（藏起来的圆心不拦交点）')
  }
  // P1：看过参考解后刷新，进度也不能记成自己的
  await page.evaluate(() => { const k = 'cl.progress.v1', p = JSON.parse(localStorage.getItem(k) || '{}'); delete p.L05; localStorage.setItem(k, JSON.stringify(p)) })
  await page.evaluate((id) => CL.startLevel(id), 'L05'); await settle()
  await page.click('#cl-chal-ref')
  await page.waitForFunction(() => (localStorage.getItem('cl.draft.v1') || '').includes('"usedRef":true'))
  await page.reload()
  await page.waitForFunction(() => window.CL && CL.S.level && CL.S.level.id === 'L05')
  await page.waitForFunction(() => document.getElementById('cl-chal').dataset.checked)
  assert((await page.textContent('#cl-chal-meta')).includes('已看过参考解') && !(await page.evaluate(() => (JSON.parse(localStorage.getItem('cl.progress.v1') || '{}').L05 || {}).solved)), '看参考解后刷新：仍标「已看过参考解」，不记成绩')
  // P1：进入关卡后撤销历史清空（不能把上一张自由作图撤回到关卡里）
  await page.click('#cl-chal-exit'); await settle()
  await page.evaluate(() => CL.runCmd('Z7 = 点(1, 1)'))
  assert(!(await page.$eval('#cl-undo', (b) => b.disabled)), '自由作图里有撤销')
  await page.evaluate((id) => CL.startLevel(id), 'L01'); await settle()
  assert(await page.$eval('#cl-undo', (b) => b.disabled), '进入关卡后撤销按钮不可用')
  await page.click('#cl-chal-exit'); await settle()
  await page.evaluate(() => CL.flushDraft(true))        // 草稿立刻落盘（不在关卡里），后面新开的页签都从自由作图开始
  // P1：第 2 关用线段代替直线不算；第 4 关从顶点出发、指向角内的射线算，反向射线不算
  {
    const lv = await page.evaluate(() => {
      const G = CL.GC, L2 = G.LEVELS.find((L) => L.id === 'L02'), L4 = G.LEVELS.find((L) => L.id === 'L04')
      const base = 'c = 圆(A, B)\nd = 圆(B, A)\nC = 交点(c, d, 1)\nD = 交点(c, d, 2)\n'
      const b4 = 'c = 圆(O, A)\nP = 交点(c, ob, 2)\nd = 圆(A, O)\ne = 圆(P, O)\nQ = 交点(d, e, 2)\n'
      return {
        seg: G.checkLevel(L2, G.levelDoc(L2, base + 's = 线段(C, D)').doc).ok,
        line: G.checkLevel(L2, G.levelDoc(L2, base + 'f = 直线(C, D)').doc).ok,
        ray: G.checkLevel(L4, G.levelDoc(L4, b4 + 'r = 射线(O, Q)').doc).ok,
        back: G.checkLevel(L4, G.levelDoc(L4, b4 + 'R = 对称(Q, O)\nr = 射线(O, R)').doc).ok
      }
    })
    assert(!lv.seg && lv.line && lv.ray && !lv.back, `关卡区分直线 / 线段 / 射线：${JSON.stringify(lv)}`)
  }
  // P1：一直没动过的旧页签关掉时，不能把旧图写回去盖掉别的页签刚存的草稿
  {
    const pOld = await page.context().newPage(); await pOld.goto(toolURL); await pOld.waitForFunction(() => window.CL && CL.S.doc)
    const pNew = await page.context().newPage(); await pNew.goto(toolURL); await pNew.waitForFunction(() => window.CL && CL.S.doc)
    await pNew.evaluate(() => CL.runCmd('fresh9 = 9'))
    await pNew.waitForFunction(() => (localStorage.getItem('cl.draft.v1') || '').includes('fresh9'))
    await pOld.close({ runBeforeUnload: true })
    await pNew.close({ runBeforeUnload: true })
    assert((await page.evaluate(() => localStorage.getItem('cl.draft.v1') || '')).includes('fresh9'), '没改过的旧页签关掉后，草稿仍是另一页签刚存的那份')
  }
  // P1：导入带数字 updated 的作图、以及存储里本来就有的坏记录，都不能把列表与整页弄挂
  await onTab('saves')
  await page.setInputFiles('#cl-import', { name: 'n.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ saves: [{ id: 'num1', name: '数字时间', text: 'A = 点(1, 1)', updated: 12345 }] })) })
  await page.waitForSelector('#cl-saves [data-id="num1"]')
  await page.evaluate(() => { const k = 'cl.saves.v1', l = JSON.parse(localStorage.getItem(k)); l.push(null, { id: 'bad2', name: 3, text: 5 }, 'x'); localStorage.setItem(k, JSON.stringify(l)) })
  await page.reload()
  await page.waitForFunction(() => window.CL && CL.S.doc)
  await onTab('saves')
  assert(await page.$('#cl-saves [data-id="num1"]') && !(await page.$('#cl-saves [data-id="bad2"]')) && errors.length === 0, '数字 updated 与坏记录都不让页面报错，坏记录被跳过')
  // P1：「导出全部」→ 清掉进度 → 再导入，挑战进度回来
  {
    const before = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('cl.progress.v1') || '{}')).length)
    const [dl2] = await Promise.all([page.waitForEvent('download'), page.click('#cl-exportall')])
    const buf = fs.readFileSync(await dl2.path())
    await page.evaluate(() => localStorage.removeItem('cl.progress.v1'))
    await page.setInputFiles('#cl-import', { name: 'all.json', mimeType: 'application/json', buffer: buf })
    await page.waitForFunction(() => document.getElementById('cl-toasttext').textContent.includes('关挑战进度'))
    const after = await page.evaluate(() => JSON.parse(localStorage.getItem('cl.progress.v1') || '{}'))
    assert(before >= 13 && Object.keys(after).length === before && after.L01.best === 2, `导入全部 JSON 恢复 ${before} 关挑战进度（第 1 关仍是 2 步）：${Object.keys(after).length}`)
  }
  await onTab('draw')
  // P1：超范围的 @视图 被拒绝；远处视图开网格时条数有上限、不卡死
  assert(await page.evaluate(() => CL.GC.parse('@视图 1e20, 0, 40\nA = 点(0, 0)').errors.length === 1), '@视图 中心 1e20 被拒绝')
  await page.evaluate(() => CL.load('@视图 100000000, 0, 40\n@网格\nA = 点(100000000, 0)', {})); await settle()
  {
    const ng = await page.$$eval('#cl-l-grid line', (ls) => ls.length)
    assert(ng > 10 && ng <= 802, `远处视图的网格线条数有上限：${ng}`)
  }
  await page.evaluate(() => { CL.S.grid = false }); await page.evaluate(() => CL.setView(0, 0, 46)); await settle()
  // P2：关系工具——线段延长线上的点只说「所在的直线上」，不冒充在线段上
  {
    const r = await page.evaluate(() => { const d = CL.GC.parse('A = 点(0, 0)\nB = 点(2, 0.5)\ns = 线段(A, B)\nY = 位似(B, 1.5, A)').doc; return d.relation(['Y', 's']).items.map((x) => x.state + ':' + x.text) })
    assert(r.some((x) => x.startsWith('always:') && x.includes('所在的直线上')) && r.some((x) => x.startsWith('no:') && x.includes('不含延长线')), `延长线上的点：${r.join('|')}`)
  }
  // P2：追踪点此刻未定义（驱动点在圆内、切点不存在）时轨迹照样画出来，且每个点都在圆上
  await page.evaluate(() => CL.load('O = 点(0, 0)\nk = 圆(O, 1)\nA = 点(-5, 0)\nB = 点(5, 0)\nl = 直线(A, B)\nP = 点(l, 0.5)\nt = 切线(P, k, 1)\nT = 垂足(O, t)\nL = 轨迹(T, P)', { fit: true })); await settle()
  {
    const r = await page.evaluate(() => { const d = CL.S.doc, q = d.get('L').val; let w = 0; q.paths.flat().forEach((X) => { const e = Math.abs(Math.hypot(X.x, X.y) - 1); if (!(e <= w)) w = e }); return { now: d.get('T').val, n: q.paths.length, cnt: q.paths.flat().length, w, svg: document.querySelectorAll('#cl-l-loci path').length } })
    assert(r.now === null && r.n >= 1 && r.cnt >= 50 && r.w < 1e-9 && r.svg >= 1, `切点此刻不存在，轨迹仍有 ${r.n} 段 ${r.cnt} 点（都在单位圆上，残差 ${r.w.toExponential(1)}）`)
  }
  // P2：偶然落在欧拉线上的自由点（建在 O、G、H 之前）不挡住 O、G、H 共线
  {
    const X = [ORACLE.euler.O[0] + 2 * (ORACLE.euler.H[0] - ORACLE.euler.O[0]), ORACLE.euler.O[1] + 2 * (ORACLE.euler.H[1] - ORACLE.euler.O[1])]
    const r = await page.evaluate((x) => { const g = CL.GC.GALLERY.find((q) => q.id === 'euler'); const d = CL.GC.parse('Q9 = 点(' + x[0] + ', ' + x[1] + ')\n' + g.text).doc; return d.discover().rels.filter((q) => q.type === 'collinear').map((q) => q.objs.join(',')) }, X)
    assert(r.length === 1 && r[0] === 'G,H,O', `偶然点不挡住欧拉线：${r.join('|')}`)
  }
  // P2：大作图的发现关系有上限，跳过的检查如实写出
  {
    let t = ''
    for (let i = 0; i < 120; i++) t += `P${i} = 点(${(Math.sin(i * 1.7) * 9).toFixed(3)}, ${(Math.cos(i * 2.3) * 9).toFixed(3)})\n`
    await page.evaluate((t) => CL.load(t, { fit: true }), t); await settle()
    const t0 = Date.now()
    await page.click('#cl-discover')
    await page.waitForFunction(() => document.getElementById('cl-relsum').textContent.length > 0)
    const ms = Date.now() - t0
    assert((await page.textContent('#cl-relsum')).includes('跳过了共圆') && ms < 5000, `120 个点的发现关系 ${ms}ms，并说明跳过了共圆检查`)
  }
  // P2：constructor() / 1e309 给出错误而不是抛异常
  await fillCmd('u7 = constructor()')
  await page.waitForFunction(() => document.getElementById('cl-cmderr').textContent.includes('constructor'))
  assert((await page.textContent('#cl-cmderr')).includes('不认识的函数'), '原型上的名字当成不认识的函数')
  await fillCmd('u8 = 1e309')
  await page.waitForFunction(() => document.getElementById('cl-cmderr').textContent.includes('1e309'))
  assert((await page.textContent('#cl-cmderr')).includes('太大') && errors.length === 0, '溢出的数字报错、没有页面异常')
  // P2：回放到中间再清空不报错、回放复位
  await page.evaluate((id) => CL.openGallery(id), 'euler'); await settle()
  await page.$eval('#cl-step', (el) => { el.value = '3'; el.dispatchEvent(new Event('input', { bubbles: true })) })
  await settle()
  await page.click('#cl-clear'); await settle()
  assert(errors.length === 0 && (await page.evaluate(() => CL.S.replay === -1 && CL.S.replayK === -1)), '回放中清空：不报错、回放复位')
  // P2：清空后刷新仍是空白（空白草稿也是草稿，不会换成示例）
  await page.waitForFunction(() => { try { return JSON.parse(localStorage.getItem('cl.draft.v1')).text === '' } catch (e) { return false } })
  await page.reload()
  await page.waitForFunction(() => window.CL && CL.S.doc)
  assert((await names()).length === 0, '清空后刷新仍是空白画布')
  // P2：第 8 关回放按「可见步」计数（藏起来的题目圆心不占步）
  await page.evaluate((id) => CL.startLevel(id), 'L08'); await settle()
  await page.click('#cl-chal-ref')
  await page.evaluate(() => { if (CL.S.playing) document.getElementById('cl-play').click() })
  {
    const n = await page.evaluate(() => document.querySelectorAll('#cl-stepsbody tr').length)
    await page.$eval('#cl-step', (el) => { el.value = '1'; el.dispatchEvent(new Event('input', { bubbles: true })) })
    await settle()
    const st = await page.evaluate(() => ({ out: document.getElementById('cl-stepout').textContent, rows: document.querySelectorAll('#cl-stepsbody tr:not(.cl-future)').length, now: (document.querySelector('#cl-stepsbody tr.cl-now') || {}).dataset, circ: document.querySelectorAll('#cl-l-circ [data-n]').length, pts: document.querySelectorAll('#cl-l-pts circle').length }))
    assert(st.out === `1 / ${n}` && st.rows === 1 && st.now && st.now.n === 'k' && st.circ === 1 && st.pts === 0, `第 8 关回放第 1 步只画题目的圆：${JSON.stringify(st)}`)
  }
  await page.click('#cl-chal-exit'); await settle()

  // 点工具点在「直线与圆的交叉处」（那里没有已有的点）⇒ 建的是交点对象，分支号按规范口径
  await page.evaluate(() => CL.load('A = 点(-2, 0)\nB = 点(2, 0)\nl = 直线(A, B)\nO2 = 点(0, 1)\nk = 圆(O2, 2)', {})); await page.evaluate(() => CL.setView(0, 0, 60)); await settle()
  await tool('point'); await clickW(Math.sqrt(3), 0)
  {
    const last = (await names()).pop()
    const o = await page.evaluate((n) => { const q = CL.S.doc.get(n); return { cmd: q.cmd, txt: CL.S.doc.printObj(q), x: q.val.x, y: q.val.y } }, last)
    assert(o.cmd === 'Intersect' && o.txt.endsWith('交点(l, k, 2)') && near(o.x, Math.sqrt(3), 1e-12) && Math.abs(o.y) < 1e-12, `点工具吸附到直线与圆的交点：${o.txt} (${o.x}, ${o.y})`)
  }
  // 对象列表整组重画（显隐切换）后，焦点回到同一行的同一个按钮
  await page.evaluate((id) => CL.openGallery(id), 'euler'); await settle()
  await page.focus('#cl-objs .cl-vis[data-n="B"]')
  await page.keyboard.press('Enter')
  await page.waitForFunction(() => CL.S.doc.get('B').flags.includes('hide'))
  assert(await page.evaluate(() => document.activeElement && document.activeElement.classList.contains('cl-vis') && document.activeElement.dataset.n === 'B' && document.activeElement.textContent === '显示'), '切换显隐后焦点仍在 B 的「显示」按钮上')
  await page.keyboard.press('Enter')
  await page.waitForFunction(() => !CL.S.doc.get('B').flags.includes('hide'))

  // ── 18. 渲染守卫 ──
  await page.evaluate((id) => CL.openGallery(id), 'euler'); await settle()
  await renderGuards(page, {
    assert, tabs: ['draw', 'challenge', 'gallery', 'saves', 'help'], onTab,
    paneSel: (t) => `#pane-${t}`, panesRoot: '#cl-panes',
    figSel: (t) => `#pane-${t} #cl-svg`, cardSel: '.cl-card',
    minControls: 60, minTextsInFig: 8,
    labelSel: 'th, dt, label, label > span, .cl-tglabel, .cl-reltag, .cl-badge'
  })
  await onTab('draw')
  await guardBoxOverlap(page, { assert, sel: '.cl-tab, .cl-hero .cl-badge, .cl-tool, .cl-stagebar .cl-btn' })
  await guardControlSize(page, { assert, tabs: ['.cl-nav', '.cl-hero', '#cl-tools'], onTab: async () => {}, paneSel: (h) => h, minControls: 30 })
  await onTab('gallery')
  await guardBoxOverlap(page, { assert, sel: '.cl-chip, #cl-gallery .cl-badge' })
  await onTab('draw'); await settle()
  {
    const g = await page.$eval('#cl-svg', (s) => { const r = s.getBoundingClientRect(); return { w: r.width, h: r.height } })
    assert(g.w >= 300 && g.h >= 380, `画布有实际尺寸：${g.w}×${g.h}`)
    const lab = await page.$$eval('#cl-l-lab text', (ts) => ts.map((t) => t.textContent))
    assert(['A', 'B', 'C', 'O', 'G', 'H'].every((n) => lab.includes(n)), `欧拉线图上标出了 A、B、C、O、G、H：${lab.join(',')}`)
  }
  await page.setViewportSize({ width: 390, height: 900 })
  await settle()
  await shot('mobile-390.png')
  {
    const g = await page.$eval('#cl-svg', (s) => s.getBoundingClientRect().width)
    assert(g >= 340, `390px 下画布占满宽度：${g}`)
  }
  await page.setViewportSize({ width: 1280, height: 850 })
  await settle()

  // ── 缩略图：欧拉线 + 发现关系高亮 ──
  await page.evaluate((id) => CL.openGallery(id), 'euler'); await settle()
  await page.click('#cl-gnote-close')
  await page.click('#cl-discover')
  await page.waitForSelector('#cl-rels .cl-rel')
  await page.click('#cl-rels .cl-rel[data-type="collinear"]')
  await settle()
  await page.keyboard.press('Escape')                  // 关掉提示条
  await page.waitForFunction(() => document.getElementById('cl-toast').hidden)
  await page.evaluate(() => { window.scrollTo(0, 0); const r = document.querySelector('.cl-work').getBoundingClientRect(); window.scrollBy(0, r.top - 64) })
  assert(errors.length === 0, '全程没有页面报错：' + errors.join(' | '))
  await screenshot('thumb.png')
}
