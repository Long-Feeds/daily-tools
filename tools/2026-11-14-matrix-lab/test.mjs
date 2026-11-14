// 矩阵工作台 · Matrix Lab —— 集成测试
// 真值来源（一个手打的数都不留）：
//  · ORACLE 里的矩阵、行最简形、行列式、逆、伴随、特征多项式、特征值与重数、Jordan 块、伪逆、表达式结果、
//    二次型矩阵 / 顺序主子式 / 惯性、几何读数：run 目录 toracle/oracle.py 用 sympy 1.14 / numpy 2.4 现场计算；
//  · 练习题的题面由成品引擎按题号生成（toracle/gen.mjs），答案由 sympy 重算；
//  · 复制出的 LaTeX 由成品引擎生成并在 toracle 里用 KaTeX 0.16 编译通过；
//  由 inject-oracle.mjs 机械注入下面的 ORACLE 块。
//  测试全程通过页面 UI 操作（网格逐格输入、文本框读入、粘贴、按钮、下拉框、拖动、键盘），
//  读结果区上的 data-v（纯文本精确值）与真值逐条比；能做性质验算的（Aη = b、AP = PJ、PA = LU、CᵀAC 对角）
//  用测试自带的 BigInt 分数运算重算，不调用页面引擎。
import { guardHidden, guardUniqueIds, guardControlSize, guardTextTransform, guardOverflow, guardEscape, guardFigText, guardBoxOverlap } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const ORACLE = {
 "meta": {
  "sympy": "1.14.0",
  "numpy": "2.4.6"
 },
 "A0": {
  "rref": "1 0 -3/2 3/4 5/4\n0 1 -3/2 -7/4 -1/4\n0 0 0 0 0",
  "rank": 2,
  "consistent": true
 },
 "D1": {
  "det": "4",
  "inv": "3/4 1/2 1/4\n1/2 1 1/2\n1/4 1/2 3/4",
  "adj": "3 2 1\n2 4 2\n1 2 3"
 },
 "E1": {
  "charpoly": "4 0 -3 1",
  "eigs": "-1, 2, 2",
  "geo": {
   "2": 2,
   "-1": 1
  },
  "alg": {
   "2": 2,
   "-1": 1
  }
 },
 "E2": {
  "eig": [
   [
    -0.3722813232690143,
    0
   ],
   [
    5.372281323269014,
    0
   ]
  ],
  "charpoly": "-2 -5 1"
 },
 "E3": {
  "eig": [
   [
    1,
    1
   ],
   [
    1,
    -1
   ]
  ],
  "charpoly": "2 -2 1"
 },
 "J1": {
  "sizes": "1 1 2",
  "J": "1 0 0 0\n0 2 0 0\n0 0 4 1\n0 0 0 4",
  "diagonalizable": false
 },
 "S1": {
  "eigs": [
   1,
   1,
   10
  ],
  "A": "2 2 -2\n2 5 -4\n-2 -4 5"
 },
 "SOLVE": {
  "rankA": 2,
  "rankAb": 2,
  "nullity": 2
 },
 "V1": {
  "pivots": "1 2 4",
  "reps": {
   "3": "-1 -1 0",
   "5": "4 3 -3"
  },
  "rank": 3,
  "reduceSteps": 2
 },
 "QF1": {
  "A": "1 1 0\n1 2 -1\n0 -1 3",
  "minors": "1 1 2",
  "inertia": "3 0",
  "definite": "正定"
 },
 "QF2": {
  "A": "0 1 1\n1 0 -3\n1 -3 0",
  "minors": "0 -1 -6",
  "inertia": "2 1",
  "definite": "不定"
 },
 "QR1": {
  "R": [
   [
    1.4142135623730951,
    0.7071067811865472,
    0.7071067811865475
   ],
   [
    0,
    1.224744871391589,
    0.4082482904638631
   ],
   [
    0,
    0,
    1.1547005383792515
   ]
  ]
 },
 "SVD1": {
  "sv": [
   6.70820393249937,
   2.2360679774997894
  ]
 },
 "SVD2": {
  "sv": [
   5.464985704219043,
   0.3659661906262575
  ]
 },
 "PINV1": {
  "pinv": "1/70 1/35 3/70\n1/35 2/35 3/35"
 },
 "EXPR": {
  "C": "0 -5\n0 -5",
  "scalar": "1",
  "Ainv3": "-59/4 27/4\n81/8 -37/8"
 },
 "GEO": {
  "det": "3",
  "eigs": "1, 3",
  "sv": [
   2.9999999999999996,
   1.0000000000000002
  ],
  "eigvec": {
   "1": [
    -1,
    1
   ],
   "3": [
    1,
    1
   ]
  }
 },
 "practice": [
  {
   "type": "det",
   "seed": 4242,
   "level": 1,
   "A": [
    [
     "-2",
     "1",
     "-2"
    ],
    [
     "0",
     "1",
     "3"
    ],
    [
     "5",
     "3",
     "-2"
    ]
   ],
   "b": null,
   "kind": "scalar",
   "answer": "47"
  },
  {
   "type": "eig",
   "seed": 777,
   "level": 2,
   "A": [
    [
     "-17",
     "42",
     "42"
    ],
    [
     "-7",
     "18",
     "17"
    ],
    [
     "0",
     "0",
     "1"
    ]
   ],
   "b": null,
   "kind": "list",
   "answer": "-3, 1, 4"
  },
  {
   "type": "inv",
   "seed": 9001,
   "level": 1,
   "A": [
    [
     "0",
     "1",
     "0"
    ],
    [
     "1",
     "0",
     "0"
    ],
    [
     "4",
     "0",
     "1"
    ]
   ],
   "b": null,
   "kind": "matrix",
   "answer": "0 1 0\n1 0 0\n0 -4 1"
  },
  {
   "type": "solve",
   "seed": 31337,
   "level": 1,
   "A": [
    [
     "-5",
     "6",
     "-3"
    ],
    [
     "0",
     "1",
     "0"
    ],
    [
     "2",
     "-2",
     "1"
    ]
   ],
   "b": [
    "-5",
    "1",
    "2"
   ],
   "kind": "vector",
   "answer": "1, 1, 2"
  },
  {
   "type": "quad",
   "seed": 2024,
   "level": 1,
   "A": [
    [
     "1",
     "2",
     "0"
    ],
    [
     "2",
     "-3",
     "0"
    ],
    [
     "0",
     "0",
     "0"
    ]
   ],
   "b": null,
   "kind": "choice",
   "answer": "不定"
  },
  {
   "type": "rank",
   "seed": 555,
   "level": 2,
   "A": [
    [
     "-2",
     "-2",
     "-4",
     "2"
    ],
    [
     "-2",
     "-2",
     "-4",
     "2"
    ],
    [
     "-1",
     "-1",
     "-2",
     "1"
    ],
    [
     "2",
     "2",
     "4",
     "-2"
    ]
   ],
   "b": null,
   "kind": "scalar",
   "answer": "1"
  }
 ],
 "DETDEMO": {
  "det": "40",
  "swaps": 3
 },
 "tex": {
  "rref": "\\begin{aligned}\n& \\left[\\begin{array}{cccc|c} 1 & 1 & -3 & -1 & 1 \\\\ 3 & -1 & -3 & 4 & 4 \\\\ 1 & 5 & -9 & -8 & 0 \\end{array}\\right] \\\\\n\\xrightarrow{\\substack{r_{2} - 3r_{1} \\\\ r_{3} - r_{1}}} \\; & \\left[\\begin{array}{cccc|c} 1 & 1 & -3 & -1 & 1 \\\\ 0 & -4 & 6 & 7 & 1 \\\\ 0 & 4 & -6 & -7 & -1 \\end{array}\\right] \\\\\n\\xrightarrow{\\substack{r_{2} \\leftrightarrow r_{3} \\\\ 4r_{1} - r_{2} \\\\ r_{3} + r_{2}}} \\; & \\left[\\begin{array}{cccc|c} 4 & 0 & -6 & 3 & 5 \\\\ 0 & 4 & -6 & -7 & -1 \\\\ 0 & 0 & 0 & 0 & 0 \\end{array}\\right] \\\\\n\\xrightarrow{\\substack{r_{1} \\div 4 \\\\ r_{2} \\div 4}} \\; & \\left[\\begin{array}{cccc|c} 1 & 0 & -\\frac{3}{2} & \\frac{3}{4} & \\frac{5}{4} \\\\ 0 & 1 & -\\frac{3}{2} & -\\frac{7}{4} & -\\frac{1}{4} \\\\ 0 & 0 & 0 & 0 & 0 \\end{array}\\right]\n\\end{aligned}",
  "inv": "\\begin{aligned}\n& \\left[\\begin{array}{ccc|ccc} 2 & -1 & 0 & 1 & 0 & 0 \\\\ -1 & 2 & -1 & 0 & 1 & 0 \\\\ 0 & -1 & 2 & 0 & 0 & 1 \\end{array}\\right] \\\\\n\\xrightarrow{\\substack{r_{1} \\leftrightarrow r_{2} \\\\ r_{1} \\times \\left(-1\\right) \\\\ r_{2} - 2r_{1}}} \\; & \\left[\\begin{array}{ccc|ccc} 1 & -2 & 1 & 0 & -1 & 0 \\\\ 0 & 3 & -2 & 1 & 2 & 0 \\\\ 0 & -1 & 2 & 0 & 0 & 1 \\end{array}\\right] \\\\\n\\xrightarrow{\\substack{r_{2} \\leftrightarrow r_{3} \\\\ r_{2} \\times \\left(-1\\right) \\\\ r_{1} + 2r_{2} \\\\ r_{3} - 3r_{2}}} \\; & \\left[\\begin{array}{ccc|ccc} 1 & 0 & -3 & 0 & -1 & -2 \\\\ 0 & 1 & -2 & 0 & 0 & -1 \\\\ 0 & 0 & 4 & 1 & 2 & 3 \\end{array}\\right] \\\\\n\\xrightarrow{\\substack{r_{3} \\div 4 \\\\ r_{1} + 3r_{3} \\\\ r_{2} + 2r_{3}}} \\; & \\left[\\begin{array}{ccc|ccc} 1 & 0 & 0 & \\frac{3}{4} & \\frac{1}{2} & \\frac{1}{4} \\\\ 0 & 1 & 0 & \\frac{1}{2} & 1 & \\frac{1}{2} \\\\ 0 & 0 & 1 & \\frac{1}{4} & \\frac{1}{2} & \\frac{3}{4} \\end{array}\\right]\n\\end{aligned}\n\nA^{-1} = \\begin{bmatrix} \\frac{3}{4} & \\frac{1}{2} & \\frac{1}{4} \\\\ \\frac{1}{2} & 1 & \\frac{1}{2} \\\\ \\frac{1}{4} & \\frac{1}{2} & \\frac{3}{4} \\end{bmatrix}",
  "rankV1": "\\begin{aligned}\n& \\begin{bmatrix} 2 & -1 & -1 & 1 & 2 \\\\ 1 & 1 & -2 & 1 & 4 \\\\ 4 & -6 & 2 & -2 & 4 \\\\ 3 & 6 & -9 & 7 & 9 \\end{bmatrix} \\\\\n\\xrightarrow{\\substack{r_{1} \\leftrightarrow r_{2} \\\\ r_{2} - 2r_{1} \\\\ r_{3} - 4r_{1} \\\\ r_{4} - 3r_{1}}} \\; & \\begin{bmatrix} 1 & 1 & -2 & 1 & 4 \\\\ 0 & -3 & 3 & -1 & -6 \\\\ 0 & -10 & 10 & -6 & -12 \\\\ 0 & 3 & -3 & 4 & -3 \\end{bmatrix} \\\\\n\\xrightarrow{r_{3} \\div 2} \\; & \\begin{bmatrix} 1 & 1 & -2 & 1 & 4 \\\\ 0 & -3 & 3 & -1 & -6 \\\\ 0 & -5 & 5 & -3 & -6 \\\\ 0 & 3 & -3 & 4 & -3 \\end{bmatrix} \\\\\n\\xrightarrow{\\substack{r_{2} \\leftrightarrow r_{4} \\\\ 3r_{3} + 5r_{2} \\\\ r_{4} + r_{2}}} \\; & \\begin{bmatrix} 1 & 1 & -2 & 1 & 4 \\\\ 0 & 3 & -3 & 4 & -3 \\\\ 0 & 0 & 0 & 11 & -33 \\\\ 0 & 0 & 0 & 3 & -9 \\end{bmatrix} \\\\\n\\xrightarrow{\\substack{r_{3} \\div 11 \\\\ r_{4} \\div 3}} \\; & \\begin{bmatrix} 1 & 1 & -2 & 1 & 4 \\\\ 0 & 3 & -3 & 4 & -3 \\\\ 0 & 0 & 0 & 1 & -3 \\\\ 0 & 0 & 0 & 1 & -3 \\end{bmatrix} \\\\\n\\xrightarrow{r_{4} - r_{3}} \\; & \\begin{bmatrix} 1 & 1 & -2 & 1 & 4 \\\\ 0 & 3 & -3 & 4 & -3 \\\\ 0 & 0 & 0 & 1 & -3 \\\\ 0 & 0 & 0 & 0 & 0 \\end{bmatrix}\n\\end{aligned}"
 },
 "PARSE": {
  "latex": "\\begin{bmatrix} 1 & \\frac{1}{2} \\\\ -3 & 4 \\end{bmatrix}",
  "latexCells": [
   [
    "1",
    "1/2"
   ],
   [
    "-3",
    "4"
   ]
  ],
  "numpy": "[[2, -1], [0.5, 3]]",
  "numpyCells": [
   [
    "2",
    "-1"
   ],
   [
    "1/2",
    "3"
   ]
  ]
 },
 "NOSOL": {
  "text": "1 2 | 3\n2 4 | 7",
  "rankA": 1,
  "rankAb": 2
 },
 "BRACKET": {
  "a": {
   "src": "[1 -2 3]",
   "v": "1 -2 3"
  },
  "b": {
   "src": "[1 - 2 3]",
   "v": "-1 3"
  }
 },
 "spec": {
  "A0": [
   [
    "1",
    "1",
    "-3",
    "-1",
    "1"
   ],
   [
    "3",
    "-1",
    "-3",
    "4",
    "4"
   ],
   [
    "1",
    "5",
    "-9",
    "-8",
    "0"
   ]
  ],
  "D1": [
   [
    "2",
    "-1",
    "0"
   ],
   [
    "-1",
    "2",
    "-1"
   ],
   [
    "0",
    "-1",
    "2"
   ]
  ],
  "E1": [
   [
    "-2",
    "1",
    "1"
   ],
   [
    "0",
    "2",
    "0"
   ],
   [
    "-4",
    "1",
    "3"
   ]
  ],
  "E2": [
   [
    "1",
    "2"
   ],
   [
    "3",
    "4"
   ]
  ],
  "E3": [
   [
    "1",
    "-1"
   ],
   [
    "1",
    "1"
   ]
  ],
  "J1": [
   [
    "5",
    "4",
    "2",
    "1"
   ],
   [
    "0",
    "1",
    "-1",
    "-1"
   ],
   [
    "-1",
    "-1",
    "3",
    "0"
   ],
   [
    "1",
    "1",
    "-1",
    "2"
   ]
  ],
  "S1": [
   [
    "2",
    "2",
    "-2"
   ],
   [
    "2",
    "5",
    "-4"
   ],
   [
    "-2",
    "-4",
    "5"
   ]
  ],
  "SOLVE_A": [
   [
    "1",
    "1",
    "-3",
    "-1"
   ],
   [
    "3",
    "-1",
    "-3",
    "4"
   ],
   [
    "1",
    "5",
    "-9",
    "-8"
   ]
  ],
  "SOLVE_b": [
   "1",
   "4",
   "0"
  ],
  "V1": [
   [
    "2",
    "-1",
    "-1",
    "1",
    "2"
   ],
   [
    "1",
    "1",
    "-2",
    "1",
    "4"
   ],
   [
    "4",
    "-6",
    "2",
    "-2",
    "4"
   ],
   [
    "3",
    "6",
    "-9",
    "7",
    "9"
   ]
  ],
  "QF1": "x1^2 + 2x2^2 + 3x3^2 + 2x1x2 - 2x2x3",
  "QF2": "2x1x2 + 2x1x3 - 6x2x3",
  "LU1": [
   [
    "0",
    "1",
    "2"
   ],
   [
    "1",
    "2",
    "3"
   ],
   [
    "2",
    "3",
    "5"
   ]
  ],
  "QR1": [
   [
    "1",
    "1",
    "0"
   ],
   [
    "1",
    "0",
    "1"
   ],
   [
    "0",
    "1",
    "1"
   ]
  ],
  "SVD1": [
   [
    "3",
    "0"
   ],
   [
    "4",
    "5"
   ]
  ],
  "SVD2": [
   [
    "1",
    "2"
   ],
   [
    "3",
    "4"
   ]
  ],
  "PINV1": [
   [
    "1",
    "2"
   ],
   [
    "2",
    "4"
   ],
   [
    "3",
    "6"
   ]
  ],
  "EXPR_A": [
   [
    "1",
    "2"
   ],
   [
    "3",
    "4"
   ]
  ],
  "EXPR_B": [
   [
    "0",
    "1"
   ],
   [
    "1",
    "0"
   ]
  ],
  "GEO": [
   "2",
   "1",
   "1",
   "2"
  ],
  "practice": [
   [
    "det",
    4242,
    1
   ],
   [
    "eig",
    777,
    2
   ],
   [
    "inv",
    9001,
    1
   ],
   [
    "solve",
    31337,
    1
   ],
   [
    "quad",
    2024,
    1
   ],
   [
    "rank",
    555,
    2
   ]
  ],
  "DETDEMO": [
   [
    "3",
    "1",
    "-1",
    "2"
   ],
   [
    "-5",
    "1",
    "3",
    "-4"
   ],
   [
    "2",
    "0",
    "1",
    "-1"
   ],
   [
    "1",
    "-5",
    "3",
    "-3"
   ]
  ]
 }
};

/* ── 测试自带的精确分数（BigInt），不依赖页面 ── */
function gcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b] } return a }
function fr(n, d = 1n) { if (d < 0n) { n = -n; d = -d } const g = gcd(n, d) || 1n; return { n: n / g, d: d / g } }
function F(s) { s = String(s).trim(); const k = s.indexOf('/'); return k < 0 ? fr(BigInt(s)) : fr(BigInt(s.slice(0, k)), BigInt(s.slice(k + 1))) }
const fadd = (a, b) => fr(a.n * b.d + b.n * a.d, a.d * b.d)
const fmul = (a, b) => fr(a.n * b.n, a.d * b.d)
const feq = (a, b) => a.n === b.n && a.d === b.d
const fz = (a) => a.n === 0n
const parseM = (s) => s.split('\n').map((r) => r.trim().split(/\s+/).map(F))
const mmul = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, x, t) => fadd(s, fmul(x, B[t][j])), fr(0n))))
const meq = (A, B) => A.length === B.length && A.every((r, i) => r.length === B[i].length && r.every((x, j) => feq(x, B[i][j])))
const T = (A) => A[0].map((_, j) => A.map((r) => r[j]))
const toM = (rows) => rows.map((r) => r.map(F))
const col = (s) => s.split('\n').map((r) => [F(r.trim())])

/* ── 把页面纯文本（(5 - sqrt(33))/2、1 + i、2*sqrt(5)/15 …）求成复数，独立于页面引擎 ── */
function evalC(src) {
  let i = 0; const s = src.replace(/\s+/g, '')
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]], sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
  const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]
  const div = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d] }
  function expr() { let v = term(); while (s[i] === '+' || s[i] === '-') { const op = s[i++]; const w = term(); v = op === '+' ? add(v, w) : sub(v, w) } return v }
  function term() { let v = unary(); while (s[i] === '*' || s[i] === '/') { const op = s[i++]; const w = unary(); v = op === '*' ? mul(v, w) : div(v, w) } return v }
  function unary() { if (s[i] === '-') { i++; const v = unary(); return [-v[0], -v[1]] } if (s[i] === '+') { i++; return unary() } return prim() }
  function prim() {
    if (s[i] === '(') { i++; const v = expr(); i++; return v }
    if (s.startsWith('sqrt(', i)) { i += 5; const v = expr(); i++; return [Math.sqrt(v[0]), 0] }
    if (s[i] === 'i') { i++; return [0, 1] }
    const m = /^\d+(\.\d+)?(e[+-]?\d+)?/.exec(s.slice(i)); if (!m) throw new Error('evalC 无法解析：' + src)
    i += m[0].length; return [parseFloat(m[0]), 0]
  }
  const v = expr(); if (i !== s.length) throw new Error('evalC 多余字符：' + src); return v
}
const numM = (s) => s.split('\n').map((r) => r.trim().split(/\s+/).map((x) => evalC(x)[0]))
const rowsStr = (rows) => rows.map((r) => r.join(' ')).join('\n')

export default async ({ page, toolURL, screenshot, assert }) => {
  const ok = assert
  await page.goto(toolURL)
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1')

  const seq = () => page.$eval('#ml-out', (e) => +e.dataset.seq)
  async function waitRun(op, s0) {
    await page.waitForFunction(([op, s0]) => { const o = document.querySelector('#ml-out'); return o.dataset.op === op && +o.dataset.seq > s0 }, [op, s0], { timeout: 15000 })
  }
  async function runOp(op) { const s0 = await seq(); await page.click(`.ml-op[data-op="${op}"]`); await waitRun(op, s0) }
  const dv = (k, root = '#ml-out') => page.$eval(`${root} [data-k="${k}"]`, (e) => e.dataset.v)
  async function onTab(t) { await page.click(`#ml-tab-${t}`); await page.waitForFunction((t) => !document.querySelector('#pane-' + t).hidden, t) }
  async function setText(rows, op) {
    if (await page.$eval('#ml-textbox', (e) => e.hidden)) await page.click('#ml-text-toggle')
    await page.fill('#ml-text', typeof rows === 'string' ? rows : rowsStr(rows))
    const s0 = await seq(); await page.click('#ml-text-apply'); await waitRun(await page.$eval('#ml-out', (e) => e.dataset.op), s0)
    if (op) await runOp(op)
  }
  const cells = () => page.$$eval('#ml-grid tr', (trs) => trs.map((tr) => Array.from(tr.querySelectorAll('input')).map((i) => i.value)))

  /* 0. 默认状态：增广矩阵的行最简形 */
  ok(await page.$eval('#ml-out', (e) => e.dataset.op) === 'rref', '默认运算是行最简形')
  ok(await dv('rref') === ORACLE.A0.rref, `默认增广矩阵的行最简形 = sympy：${await dv('rref')}`)
  ok(await dv('rank') === String(ORACLE.A0.rank), '默认秩 = sympy')
  ok(+(await page.$eval('#ml-out [data-k="steps"]', (e) => e.dataset.n)) >= 2, '至少两步初等行变换')
  const sepH = await page.$eval('#ml-out [data-k="rref"] .ml-m-sep', (e) => [e.getBoundingClientRect().height, e.closest('.ml-m-g').getBoundingClientRect().height])
  ok(sepH[0] >= sepH[1] * 0.8, `增广竖线贯穿整列：${sepH[0].toFixed(1)} / ${sepH[1].toFixed(1)} px`)
  await page.click('#ml-copy-tex')
  ok(await page.evaluate(() => window.__mlLastCopy) === ORACLE.tex.rref, '复制的过程 LaTeX = KaTeX 编译过的那一份')

  /* 1. 网格逐格输入 → 行列式三种方法 */
  await page.selectOption('#ml-cols', '3')
  await page.waitForFunction(() => document.querySelectorAll('#ml-grid tr:first-child input').length === 3)
  const D1 = ORACLE.spec.D1
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) await page.fill(`#ml-grid .ml-cell[data-r="${i}"][data-c="${j}"]`, D1[i][j])
  ok(JSON.stringify(await cells()) === JSON.stringify(D1), '网格逐格输入写进了矩阵')
  await runOp('det')
  ok(await dv('det') === ORACLE.D1.det, `化上三角：|A| = ${await dv('det')}`)
  for (const m of ['expand', 'sarrus']) {
    const s0 = await seq(); await page.selectOption('#ml-detm', m); await waitRun('det', s0)
    ok(await dv('det') === ORACLE.D1.det, `${m}：|A| = sympy`)
  }
  await page.selectOption('#ml-detm', 'elim')

  /* 2. 逆矩阵 + 伴随矩阵 + 复制 LaTeX */
  await runOp('inv')
  ok(await dv('inv') === ORACLE.D1.inv, `A⁻¹ = sympy：${await dv('inv')}`)
  ok(await dv('adj') === ORACLE.D1.adj, 'A* = sympy adjugate')
  await page.click('#ml-copy-tex')
  ok(await page.evaluate(() => window.__mlLastCopy) === ORACLE.tex.inv, '逆矩阵过程 LaTeX = KaTeX 编译过的那一份')

  /* 3. 文本框读入 LaTeX；网格里粘贴 NumPy */
  await setText(ORACLE.PARSE.latex)
  ok(JSON.stringify(await cells()) === JSON.stringify(ORACLE.PARSE.latexCells), 'LaTeX bmatrix 读入正确（\\frac 化成分数）')
  await page.evaluate((txt) => { const el = document.querySelector('#ml-grid .ml-cell[data-r="0"][data-c="0"]'); const dt = new DataTransfer(); dt.setData('text/plain', txt); el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })) }, ORACLE.PARSE.numpy)
  await page.waitForFunction((want) => JSON.stringify(Array.from(document.querySelectorAll('#ml-grid tr')).map((tr) => Array.from(tr.querySelectorAll('input')).map((i) => i.value))) === want, JSON.stringify(ORACLE.PARSE.numpyCells))
  ok(/numpy/.test(await page.textContent('#ml-edit-msg')), '粘贴识别为 NumPy 格式')

  /* 4. 特征值（演示按钮）：特征多项式、重数、特征向量 Aξ = λξ */
  { const s0 = await seq(); await page.click('.ml-cat[data-demo="eig"]'); await waitRun('eig', s0) }
  ok(await dv('charpoly') === ORACLE.E1.charpoly, `特征多项式系数 = sympy：${await dv('charpoly')}`)
  ok(await dv('eigs') === ORACLE.E1.eigs, `特征值（含重数）= sympy：${await dv('eigs')}`)
  const rowsE = await page.$$eval('#ml-out tr[data-k="eigrow"]', (rs) => rs.map((r) => ({ l: r.dataset.lambda, alg: +r.dataset.alg, geo: +r.dataset.geo, vecs: r.dataset.vecs })))
  ok(rowsE.length === Object.keys(ORACLE.E1.geo).length, '每个特征值一行')
  const E1 = toM(ORACLE.spec.E1)
  for (const r of rowsE) {
    ok(r.geo === ORACLE.E1.geo[r.l] && r.alg === ORACLE.E1.alg[r.l], `λ=${r.l} 的代数/几何重数 = sympy（${r.alg}/${r.geo}）`)
    for (const v of r.vecs.split(' | ')) {
      const x = v.split(' ').map((t) => [F(t)]), lam = F(r.l)
      ok(meq(mmul(E1, x), x.map((t) => [fmul(lam, t[0])])), `A·ξ = ${r.l}·ξ（ξ = ${v}）`)
    }
  }

  /* 5. 二次根式与复数特征值：数值对 numpy；Q(√33) 里精确对角化 */
  for (const k of ['E2', 'E3']) {
    await setText(ORACLE.spec[k], 'eig')
    const got = (await dv('eigs')).split(', ').map(evalC)
    ok(got.length === ORACLE[k].eig.length, `${k} 特征值个数`)
    let worst = 0
    got.forEach((z, t) => { worst = Math.max(worst, Math.hypot(z[0] - ORACLE[k].eig[t][0], z[1] - ORACLE[k].eig[t][1])) })
    ok(worst <= 1e-9, `${k} 特征值（精确根式）对 numpy 误差 ${worst.toExponential(2)}`)
    await runOp('diag')
    ok(await dv('verified') === 'true', `${k} 在二次域里精确对角化并验算 AP = PΛ`)
  }

  /* 6. Jordan 标准形 */
  await setText(ORACLE.spec.J1, 'jordan')
  ok(await dv('blocks') === ORACLE.J1.sizes, `Jordan 块大小 = sympy：${await dv('blocks')}`)
  ok(await dv('J') === ORACLE.J1.J, 'J = sympy jordan_form（按特征值升序、块从大到小）')
  ok(await dv('verified') === 'true', 'Jordan 形精确验算 AP = PJ')
  const Pj = parseM(await dv('P')), Jj = parseM(await dv('J')), J1 = toM(ORACLE.spec.J1)
  ok(meq(mmul(J1, Pj), mmul(Pj, Jj)), '测试自己重算 A·P = P·J（BigInt 分数）')
  await runOp('diag')
  ok(await dv('diag') === (ORACLE.J1.diagonalizable ? 'yes' : 'no'), '不可对角化判断 = sympy')

  /* 7. 实对称矩阵：正交矩阵 Q（精确根式）数值验 QᵀQ = E、QᵀAQ = Λ */
  await setText(ORACLE.spec.S1, 'diag')
  const Q = numM(await dv('Q')), S1 = ORACLE.spec.S1.map((r) => r.map(Number)), n = Q.length
  let eQ = 0, eL = 0
  for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
    let qq = 0, qaq = 0
    for (let t = 0; t < n; t++) { qq += Q[t][a] * Q[t][b]; for (let u = 0; u < n; u++) qaq += Q[t][a] * S1[t][u] * Q[u][b] }
    eQ = Math.max(eQ, Math.abs(qq - (a === b ? 1 : 0)))
    eL = Math.max(eL, Math.abs(qaq - (a === b ? ORACLE.S1.eigs[a] : 0)))
  }
  ok(eQ <= 1e-12 && eL <= 1e-12, `正交对角化：QᵀQ 误差 ${eQ.toExponential(1)}，QᵀAQ 误差 ${eL.toExponential(1)}`)

  /* 8. 解方程组（演示按钮）：Aη = b、Aξ = 0 精确验算 */
  { const s0 = await seq(); await page.click('.ml-cat[data-demo="solve"]'); await waitRun('solve', s0) }
  ok(await dv('status') === 'infinite', '演示方程组有无穷多解')
  ok(await page.$eval('#ml-rhs', (e) => e.value) === 'b', '右端自动选 b')
  const SA = toM(ORACLE.spec.SOLVE_A), Sb = ORACLE.spec.SOLVE_b.map((x) => [F(x)])
  ok(meq(mmul(SA, col(await dv('eta'))), Sb), '特解满足 Aη = b')
  const nXi = await page.$$eval('#ml-out [data-k^="xi"]', (e) => e.length)
  ok(nXi === ORACLE.SOLVE.nullity, `基础解系 ${nXi} 个 = n − r(A)`)
  for (let t = 1; t <= nXi; t++) ok(mmul(SA, col(await dv('xi' + t))).every((r) => fz(r[0])), `ξ${t} 满足 Aξ = 0`)
  ok((await page.textContent('#ml-out')).includes('r(A) = ' + ORACLE.SOLVE.rankA + '，r(A|b) = ' + ORACLE.SOLVE.rankAb), '徽标里的两个秩 = sympy')

  /* 8b. 无解：增广列用「|」标出，右端选「最后一列」 */
  await setText(ORACLE.NOSOL.text)
  { const s0 = await seq(); await page.selectOption('#ml-rhs', '@aug'); await waitRun('solve', s0) }
  ok(await dv('status') === 'none', '矛盾方程组判为无解')
  ok((await page.textContent('#ml-out')).includes('r(A) = ' + ORACLE.NOSOL.rankA + '，r(A|b) = ' + ORACLE.NOSOL.rankAb), '无解时两个秩 = sympy')

  /* 9. 极大无关组与线性表示 */
  await setText(ORACLE.spec.V1, 'space')
  ok(await dv('maxind') === ORACLE.V1.pivots, `极大无关组 α${ORACLE.V1.pivots} = sympy 主元列`)
  for (const [j, coefs] of Object.entries(ORACLE.V1.reps)) ok(await dv('rep' + j) === coefs, `α${j} 的表示系数 = sympy rref 第 ${j} 列`)

  /* 9b. 求秩：整数优先行阶梯形（V1 的消元里要约公因子），复制的 LaTeX = KaTeX 编译过的那一份 */
  await runOp('rank')
  ok(await dv('rank') === String(ORACLE.V1.rank), `r(V1) = sympy：${await dv('rank')}`)
  ok(+(await page.$eval('#ml-out [data-k="steps"]', (e) => e.dataset.n)) >= ORACLE.V1.reduceSteps + 1, '行阶梯形过程里有「约去公因子」步骤')
  await page.click('#ml-copy-tex')
  ok(await page.evaluate(() => window.__mlLastCopy) === ORACLE.tex.rankV1, '求秩过程 LaTeX = KaTeX 编译过的那一份')

  /* 9c. 4 阶行列式演示：化三角时换行 ORACLE.DETDEMO.swaps 次（奇数次才测得出「换行变号」） */
  { const s0 = await seq(); await page.click('.ml-cat[data-demo="det"]'); await waitRun('det', s0) }
  ok(await dv('det') === ORACLE.DETDEMO.det, `4 阶演示 |A| = sympy：${await dv('det')}`)
  ok(ORACLE.DETDEMO.swaps % 2 === 1, '演示里换行次数是奇数')

  /* 10. 二次型：多项式输入、配方法、正定性 */
  await runOp('quad')
  for (const k of ['QF1', 'QF2']) {
    const s0 = await seq()
    await page.fill('#ml-qf', ORACLE.spec[k]); await page.press('#ml-qf', 'Enter')
    await waitRun('quad', s0)
    ok(await dv('qfA') === ORACLE[k].A, `${k} 的矩阵 = sympy Hessian/2`)
    ok(await dv('minors') === ORACLE[k].minors, `${k} 顺序主子式 = sympy`)
    ok(await dv('definite') === ORACLE[k].definite, `${k} 正定性 = sympy 特征值符号：${await dv('definite')}`)
    ok(await dv('inertia') === ORACLE[k].inertia, `${k} 正负惯性指数 = sympy`)
    const d = (await dv('stdLagrange')).split(' ').map(F), C = parseM(await dv('qfC')), A = parseM(await dv('qfA'))
    const CtAC = mmul(mmul(T(C), A), C)
    ok(CtAC.every((r, i) => r.every((x, j) => feq(x, i === j ? d[i] : fr(0n)))), `${k} 配方法：CᵀAC = diag(标准形系数)`)
    const [p, q] = ORACLE[k].inertia.split(' ').map(Number)
    ok(d.filter((x) => x.n > 0n).length === p && d.filter((x) => x.n < 0n).length === q, `${k} 配方法系数正负个数 = 惯性指数（惯性定律）`)
  }

  /* 11. LU（需要换行）：测试重算 PA = LU */
  await setText(ORACLE.spec.LU1, 'lu')
  ok(await dv('lu') === 'PLU', '零主元 ⇒ 带置换矩阵')
  const P = parseM(await dv('luP')), L = parseM(await dv('luL')), U = parseM(await dv('luU')), LU1 = toM(ORACLE.spec.LU1)
  ok(meq(mmul(P, LU1), mmul(L, U)), 'PA = LU（BigInt 分数重算）')
  ok(L.every((r, i) => r.every((x, j) => (j > i ? fz(x) : (j === i ? feq(x, fr(1n)) : true)))) && U.every((r, i) => r.every((x, j) => j >= i || fz(x))), 'L 单位下三角、U 上三角')

  /* 12. QR：R 对 numpy（对角取正），Q 列正交 */
  await setText(ORACLE.spec.QR1, 'qr')
  const Rq = numM(await dv('R')), Qq = numM(await dv('Q'))
  let eR = 0; Rq.forEach((r, i) => r.forEach((x, j) => { eR = Math.max(eR, Math.abs(x - ORACLE.QR1.R[i][j])) }))
  ok(eR <= 1e-12, `QR 的 R（精确根式）对 numpy 误差 ${eR.toExponential(1)}`)
  let eO = 0; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) { let s = 0; for (let t = 0; t < 3; t++) s += Qq[t][a] * Qq[t][b]; eO = Math.max(eO, Math.abs(s - (a === b ? 1 : 0))) }
  ok(eO <= 1e-12, `QᵀQ = E 误差 ${eO.toExponential(1)}`)

  /* 13. SVD：精确与数值两条路 */
  for (const [k, kind] of [['SVD1', 'exact'], ['SVD2', 'num']]) {
    await setText(ORACLE.spec[k], 'svd')
    ok(await dv('svd') === kind, `${k} 走${kind === 'exact' ? '精确' : '数值'}路径`)
    const sv = (await dv('sv')).split(', ').map((x) => evalC(x)[0])
    let w = 0; sv.forEach((x, i) => { w = Math.max(w, Math.abs(x - ORACLE[k].sv[i])) })
    ok(sv.length === ORACLE[k].sv.length && w <= 1e-9, `${k} 奇异值对 numpy 误差 ${w.toExponential(1)}`)
  }

  /* 14. 伪逆（降秩） */
  await setText(ORACLE.spec.PINV1, 'pinv')
  ok(await dv('pinv') === ORACLE.PINV1.pinv, `A⁺ = sympy pinv：${await dv('pinv')}`)
  ok(await dv('penrose') === 'ok', '四个 Penrose 条件精确成立')

  /* 15. 小数显示只改显示、不改精确值 */
  await setText(ORACLE.spec.D1, 'inv')
  { const s0 = await seq(); await page.selectOption('#ml-display', 'dec'); await waitRun('inv', s0) }
  ok(await page.$$eval('#ml-out .ml-apx', (e) => e.length) > 0 && await dv('inv') === ORACLE.D1.inv, '小数模式下 data-v 仍是精确分数')
  { const s0 = await seq(); await page.selectOption('#ml-display', 'frac'); await waitRun('inv', s0) }

  /* 16. 表达式：赋值、新增矩阵、负幂、报错 */
  const chipN = () => page.$$eval('.ml-chip[data-i]', (e) => e.length)
  async function expr(src) { await page.fill('#ml-expr', src); await page.press('#ml-expr', 'Enter'); await page.waitForFunction(() => document.querySelector('#ml-expr-out').children.length > 0) }
  await expr('A = ' + '[' + ORACLE.spec.EXPR_A.map((r) => r.join(' ')).join('; ') + ']')
  const n0 = await chipN()
  await expr('B = ' + '[' + ORACLE.spec.EXPR_B.map((r) => r.join(' ')).join('; ') + ']')
  await page.waitForFunction((n0) => document.querySelectorAll('.ml-chip[data-i]').length === n0 + 1, n0)
  await expr('C = A*B - 2A^T')
  ok(await dv('expr', '#ml-expr-out') === ORACLE.EXPR.C, `C = A*B − 2Aᵀ = sympy：${await dv('expr', '#ml-expr-out')}`)
  ok((await page.$$eval('.ml-chip[data-i]', (e) => e.map((x) => x.textContent))).some((t) => t.startsWith('C')), 'C 存进了工作区')
  await expr('det(A) + rank(E(3))')
  ok(await dv('expr', '#ml-expr-out') === ORACLE.EXPR.scalar, '标量表达式 = sympy')
  await expr('A^-3')
  ok(await dv('expr', '#ml-expr-out') === ORACLE.EXPR.Ainv3, 'A⁻³ = sympy')
  for (const k of ['a', 'b']) { await expr(ORACLE.BRACKET[k].src); ok(await dv('expr', '#ml-expr-out') === ORACLE.BRACKET[k].v, `MATLAB 方括号：${ORACLE.BRACKET[k].src} → ${ORACLE.BRACKET[k].v}`) }
  await page.fill('#ml-expr', 'A*[1 2 3]'); await page.press('#ml-expr', 'Enter')
  await page.waitForFunction(() => !!document.querySelector('#ml-expr-out [data-k="expr-error"]'))
  ok(/维度不匹配/.test(await page.textContent('#ml-expr-out')), '维度不对时给中文报错')

  /* 17. 新建一项：等「项数 +1 且选中新项」；删除复原 */
  const c0 = await chipN()
  await page.click('#ml-add')
  await page.waitForFunction((c0) => { const cs = document.querySelectorAll('.ml-chip[data-i]'); return cs.length === c0 + 1 && cs[c0].getAttribute('aria-pressed') === 'true' }, c0)
  await page.click('#ml-del')
  await page.waitForFunction((c0) => document.querySelectorAll('.ml-chip[data-i]').length === c0, c0)

  /* 18. 持久化：改完立刻刷新 */
  await page.click('.ml-chip[data-i="0"]')
  await page.fill('#ml-grid .ml-cell[data-r="0"][data-c="0"]', ORACLE.D1.det)
  await page.reload(); await page.waitForFunction(() => document.documentElement.dataset.ready === '1')
  ok((await cells())[0][0] === ORACLE.D1.det, '刚改的格子刷新后还在（pagehide 补写）')
  ok((await page.$$eval('.ml-chip[data-i]', (e) => e.map((x) => x.textContent))).some((t) => t.startsWith('C')), '表达式存的 C 刷新后还在')

  /* 19. 几何页：读数、面积、特征方向、椭圆、假时钟播放、拖动与键盘 */
  await onTab('geo')
  const G = ORACLE.spec.GEO
  for (const [i, id] of ['geo-a', 'geo-b', 'geo-c', 'geo-d'].entries()) await page.fill('#' + id, G[i])
  const stateKey = () => page.evaluate(() => window.MLApp.stateKey())
  await page.waitForFunction(() => document.querySelector('#geo-svg').dataset.key === window.MLApp.stateKey())
  ok(await page.$eval('#geo-det', (e) => e.dataset.v) === ORACLE.GEO.det, '行列式读数 = sympy')
  ok(await page.$eval('#geo-eigs', (e) => e.dataset.v) === ORACLE.GEO.eigs, '特征值读数 = sympy')
  const svTxt = (await page.textContent('#geo-sv')).split('，').map(Number)
  ok(svTxt.every((x, i) => Math.abs(x - ORACLE.GEO.sv[i]) < 1e-3), '奇异值读数 = numpy（4 位）')
  const area = await page.$eval('#geo-sq', (p) => { const pts = p.getAttribute('points').trim().split(/\s+/).map((s) => s.split(',').map(Number)); let a = 0; for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; a += x1 * y2 - x2 * y1 } return Math.abs(a) / 2 })
  ok(Math.abs(area / (56 * 56) - Math.abs(Number(ORACLE.GEO.det))) < 1e-3, `单位正方形的像面积 = |det|·56²（${(area / 3136).toFixed(4)}）`)
  const eigl = await page.$$eval('.ml-eigl', (ls) => ls.map((l) => ({ l: l.dataset.l, d: [l.x2.baseVal.value - l.x1.baseVal.value, l.y2.baseVal.value - l.y1.baseVal.value] })))
  ok(eigl.length === Object.keys(ORACLE.GEO.eigvec).length, '两条特征方向')
  for (const e of eigl) {
    const v = ORACLE.GEO.eigvec[e.l]; const cross = (e.d[0] * -v[1] - e.d[1] * v[0]) / (Math.hypot(...e.d) * Math.hypot(...v))
    ok(v && Math.abs(cross) < 1e-3, `λ=${e.l} 的虚线方向平行于 sympy 特征向量（叉积 ${cross.toExponential(1)}）`)
  }
  await page.check('#geo-svd')
  await page.waitForFunction(() => document.querySelector('#geo-svg').dataset.key === window.MLApp.stateKey())
  const rr = await page.$eval('#geo-ell', (p) => p.getAttribute('points').trim().split(/\s+/).map((s) => { const [x, y] = s.split(',').map(Number); return Math.hypot(x - 320, y - 320) }))
  ok(Math.abs(Math.max(...rr) / 56 - ORACLE.GEO.sv[0]) < 0.01 && Math.abs(Math.min(...rr) / 56 - ORACLE.GEO.sv[1]) < 0.01, `单位圆的像是半轴 σ₁、σ₂ 的椭圆（${(Math.max(...rr) / 56).toFixed(3)}、${(Math.min(...rr) / 56).toFixed(3)}）`)
  await page.clock.install()
  await page.fill('#geo-t', '0')
  await page.waitForFunction(() => document.querySelector('#geo-svg').dataset.key === window.MLApp.stateKey())
  const a0 = await page.$eval('#geo-sq', (p) => p.getAttribute('points'))
  ok(a0.startsWith('320.00,320.00 376.00,320.00'), 't = 0 时还是原来的单位正方形')
  await page.click('#geo-play')
  await page.clock.runFor(800)
  const tMid = await page.evaluate(() => window.MLApp.state().geo.t)
  ok(tMid > 0.3 && tMid < 0.7, `播放到一半 t ≈ 0.5（${tMid.toFixed(3)}）`)
  await page.clock.runFor(1200)
  await page.waitForFunction(() => window.MLApp.state().geo.t === 1 && document.querySelector('#geo-svg').dataset.key === window.MLApp.stateKey())
  await page.clock.resume()
  const k0 = await stateKey()
  await page.focus('#geo-svg'); await page.keyboard.press('ArrowRight')
  await page.waitForFunction((k0) => document.querySelector('#geo-svg').dataset.key !== k0 && document.querySelector('#geo-svg').dataset.key === window.MLApp.stateKey(), k0)
  ok(Math.abs((await page.evaluate(() => window.MLApp.state().geo.x[0])) - 1.75) < 1e-9, '方向键把 x 右移 0.25')
  const xc = await page.$eval('#geo-x', (c) => { const r = c.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2] })
  await page.mouse.move(xc[0], xc[1]); await page.mouse.down(); await page.mouse.move(xc[0] - 40, xc[1] - 30, { steps: 4 }); await page.mouse.up()
  const xAfter = await page.evaluate(() => window.MLApp.state().geo.x)
  ok(xAfter[0] < 1.75 - 0.3 && xAfter[1] > 1 + 0.2, `拖动黑点改变 x（${xAfter.map((v) => v.toFixed(2)).join(', ')}）`)
  ok(+(await page.$eval('#geo-svg', (s) => s.dataset.labels)) >= 6, '图上标签都画出来了（î ĵ x Ax λ σ）')

  /* 20. 练习：按题号出题（题面 = 引擎出的那道）、作答、判分、成绩持久化、看解答 */
  await onTab('practice')
  let total = 0, right = 0
  for (const p of ORACLE.practice) {
    await page.click(`.ml-prtype[data-t="${p.type}"]`)
    await page.selectOption('#pr-level', String(p.level))
    await page.fill('#pr-seed', String(p.seed)); await page.press('#pr-seed', 'Enter')
    await page.waitForFunction(([t, s]) => { const e = document.querySelector('#pr-prob'); return e.dataset.type === t && e.dataset.seed === String(s) }, [p.type, p.seed])
    ok(await dv('prA', '#pr-prob') === rowsStr(p.A), `${p.type}#${p.seed} 题面 = 引擎按题号出的题`)
    if (p.b) ok(await dv('prb', '#pr-prob') === p.b.join('\n'), `${p.type}#${p.seed} 右端 b`)
    if (p.kind === 'matrix') { const M = p.answer.split('\n').map((r) => r.split(' ')); for (let i = 0; i < M.length; i++) for (let j = 0; j < M.length; j++) await page.fill(`#pr-grid .ml-cell[data-r="${i}"][data-c="${j}"]`, M[i][j]) }
    else if (p.kind === 'choice') await page.click(`.ml-choice[data-c="${p.answer}"]`)
    else await page.fill('#pr-ans', p.kind === 'list' ? p.answer.split(', ').reverse().join(', ') : p.answer)   // 特征值故意倒序作答：按多重集判分
    await page.click('#pr-submit'); total++; right++
    await page.waitForFunction(() => document.querySelector('#pr-fb').dataset.ok !== '')
    ok(await page.$eval('#pr-fb', (e) => e.dataset.ok) === '1', `${p.type}#${p.seed} 用 sympy 的答案提交 → 判对`)
  }
  const pd = ORACLE.practice[0]
  await page.click(`.ml-prtype[data-t="${pd.type}"]`); await page.selectOption('#pr-level', String(pd.level))
  await page.fill('#pr-seed', String(pd.seed)); await page.press('#pr-seed', 'Enter')
  await page.waitForFunction((s) => document.querySelector('#pr-prob').dataset.seed === String(s) && document.querySelector('#pr-fb').hidden, pd.seed)
  await page.fill('#pr-ans', pd.answer + '1'); await page.click('#pr-submit'); total++
  await page.waitForFunction(() => document.querySelector('#pr-fb').dataset.ok !== '')
  ok(await page.$eval('#pr-fb', (e) => e.dataset.ok) === '0', '错误答案判错')
  ok(await page.$eval('#pr-fb [data-k="prAnswer"]', (e) => e.textContent.trim()) === pd.answer.replace('-', '−'), '判错时给出正确答案')
  const st = await page.$eval('#pr-stats', (e) => [+e.dataset.total, +e.dataset.correct])
  ok(st[0] === total && st[1] === right, `成绩 ${st[0]} 题对 ${st[1]} 题`)
  await page.reload(); await page.waitForFunction(() => document.documentElement.dataset.ready === '1')
  const st2 = await page.$eval('#pr-stats', (e) => [+e.dataset.total, +e.dataset.correct])
  ok(st2[0] === total && st2[1] === right, '答完立刻刷新，成绩还在（同步写入）')
  await page.click(`.ml-prtype[data-t="${pd.type}"]`); await page.selectOption('#pr-level', String(pd.level))
  await page.fill('#pr-seed', String(pd.seed)); await page.press('#pr-seed', 'Enter')
  await page.waitForFunction((s) => document.querySelector('#pr-prob').dataset.seed === String(s), pd.seed)
  { const s0 = await seq(); await page.click('#pr-solve'); await waitRun('det', s0) }
  ok(!(await page.$eval('#pane-calc', (e) => e.hidden)) && await dv('det') === pd.answer, '「看详细解答」跳到计算页，行列式 = sympy')

  /* 21. 渲染守卫 */
  const TABS = ['calc', 'geo', 'practice', 'help']
  await guardHidden(page, { assert, panesRoot: '#ml-panes', tabs: TABS })
  await guardUniqueIds(page, { assert, minIds: 60 })
  // 矩阵格子（#ml-grid、#pr-grid）是刻意的紧凑输入框（64px），按区域排除出通用的 100px 下限，下面单独断言
  const scope = { calc: '#pane-calc :is(.ml-chips, .ml-dimrow, .ml-tools, .ml-exprrow, .ml-main)', geo: '#pane-geo', practice: '#pane-practice :is(.ml-card-h, .ml-types, .ml-tools, .ml-ansrow, .ml-choices, .ml-hist)', help: '#pane-help' }
  const nCtl = await guardControlSize(page, { assert, tabs: TABS, onTab, paneSel: (t) => scope[t], minControls: 45 })
  ok(nCtl >= 45, `尺寸守卫扫到 ${nCtl} 个控件`)
  await guardControlSize(page, { assert, tabs: ['.ml-nav', '.ml-hero'], onTab: async () => {}, paneSel: (h) => h, minControls: 9 })
  await onTab('calc')
  const cellBox = await page.$$eval('#ml-grid .ml-cell', (cs) => cs.map((c) => { const r = c.getBoundingClientRect(); return [r.width, r.height] }))
  ok(cellBox.length >= 4 && cellBox.every(([w, h]) => w >= 56 && h >= 30), `矩阵格子不塌缩（${cellBox.length} 个，最小 ${Math.min(...cellBox.map((b) => b[0])).toFixed(0)}×${Math.min(...cellBox.map((b) => b[1])).toFixed(0)}）`)
  await guardTextTransform(page, { assert, tabs: TABS, onTab, paneSel: (t) => `#pane-${t}`, labelSel: 'th, dt, label, label > span, .ml-cap' })
  await guardOverflow(page, { assert, tabs: TABS, onTab, panesRoot: '#ml-panes' })
  await onTab('calc')
  await guardEscape(page, { assert, cardSel: '.ml-card' })
  await guardFigText(page, { assert, tabs: TABS, onTab, figSel: (t) => (t === 'geo' ? '#geo-svg' : `#pane-${t} svg.ml-fig`), minTextsInFig: 4 })
  for (const t of ['calc', 'geo', 'practice']) { await onTab(t); await guardBoxOverlap(page, { assert, sel: '.ml-tab, .ml-op, .ml-chip, .ml-cat, .ml-geo-preset, .ml-choice' }) }

  /* 缩略图：演示「解方程组」，露出彩色题型卡片与逐步过程 */
  await onTab('calc')
  { const s0 = await seq(); await page.click('.ml-cat[data-demo="solve"]'); await waitRun('solve', s0) }
  ok(await page.$eval('#ml-expr-out', (e) => e.classList.contains('ml-stale')), '工作区换了之后，旧的表达式结果标成过期')
  await page.fill('#ml-expr', 'rank(A)'); await page.press('#ml-expr', 'Enter')
  await page.waitForFunction(() => !!document.querySelector('#ml-expr-out [data-k="expr"]') && !document.querySelector('#ml-expr-out').classList.contains('ml-stale'))
  ok(await dv('expr', '#ml-expr-out') === String(ORACLE.SOLVE.rankA), '表达式 rank(A) = sympy 的 r(A)')
  await page.evaluate(() => window.scrollTo(0, 300))
  await page.waitForFunction(() => Math.abs(window.scrollY - 300) < 2)
  await screenshot('thumb.png')
}
