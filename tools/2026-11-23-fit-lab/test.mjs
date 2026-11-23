// 曲线拟合工作台 · Fit Lab 集成测试
// 真值（ORACLE）由 run 目录 oracle/ 的 scipy 1.17 / R 4.6.1 脚本机械生成，经 inject-oracle.mjs 注入，不手抄。
// 结构：T1 米氏方程（R nls）· T2 4PL + 反算（scipy + R）· T3 阻尼振动 · T4 σ 加权两种口径 · T5 线性校准 + 预测 / 反算（R lm）
//       · T6 模型比较（R anova + AIC）· T7 NIST StRD 下界 · 交互（排除点、固定 / 边界、自定义公式、多起点、存档、导出）· 渲染守卫
import { renderGuards, guardBoxOverlap, guardFigText, guardControlSize } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const ORACLE = {
 "T1": {
  "names": [
   "Vmax",
   "Km"
  ],
  "p": [
   212.68374314253606,
   0.06412128168156707
  ],
  "se": [
   6.94715516004072,
   0.008280949498480352
  ],
  "t": [
   30.614508851892328,
   7.743228200260617
  ],
  "pval": [
   3.2411632261580585e-11,
   0.000015651338106499988
  ],
  "ciLo": [
   197.20451681967242,
   0.04567017637266675
  ],
  "ciHi": [
   228.16296946539973,
   0.08257238699046739
  ],
  "r2": 0.9612608301402018,
  "r2adj": 0.957386913154222,
  "rmse": 9.981018712366652,
  "aic": 95.27096864894754,
  "aicc": 98.27096864894754,
  "bic": 96.72568859831155,
  "loglik": -44.63548432447377,
  "ssr": 1195.4488144393592,
  "src": "mpmath 40 位 Gauss-Newton 精修（起点 scipy 紧容差解）；R 4.6.1 nls(deriv) 与 scipy 交叉 ≤1e-6",
  "dw": 1.615043876068024,
  "runs": {
   "runs": 8,
   "z": 0.6055300708194983,
   "p": 0.7275865747413667,
   "npos": 6,
   "nneg": 6
  },
  "src_dw_runs": "statsmodels durbin_watson（mp 精修解的残差，按 x 升序、并列保持原顺序）；游程检验为独立 python 实现（Wald–Wolfowitz 正态近似，p = Φ(z) 单侧）"
 },
 "T2": {
  "src": "mpmath 40 位 Gauss-Newton 精修（起点 scipy 紧容差解）；scipy 1.18 curve_fit 与 R nls(deriv) 交叉（参数 ≤1e-7、SE ≤1e-6）；反算 mp.findroot，逆回归区间 = 预测带交点（独立实现：几何步长外扫 + mp 求根）",
  "names": [
   "a",
   "b",
   "c",
   "d"
  ],
  "p": [
   -0.007897174366093544,
   0.9411068202835225,
   4.514989786867248,
   2.3772388665310515
  ],
  "se": [
   0.017199705872796598,
   0.05048037768351204,
   0.46088939653285615,
   0.1095163213495831
  ],
  "inv": [
   {
    "y": 0.25,
    "x": 0.4796693114105757,
    "seDelta": 0.04740654198914346,
    "lo": 0.3799312386510767,
    "hi": 0.5865714981302803
   },
   {
    "y": 0.8,
    "x": 2.217857853846766,
    "seDelta": 0.09531138193884234,
    "lo": 2.0173398448172954,
    "hi": 2.4334144999284546
   },
   {
    "y": 1.45,
    "x": 7.30282590935862,
    "seDelta": 0.3015307258174183,
    "lo": 6.677285752279596,
    "hi": 7.99593499474217
   }
  ]
 },
 "T3": {
  "src": "mpmath 40 位 Gauss-Newton 精修；scipy 1.18.1 curve_fit(method=lm, 解析雅可比, ftol=xtol=1e-14) 交叉 ≤1e-6",
  "names": [
   "A",
   "tau",
   "f",
   "phi",
   "c"
  ],
  "p": [
   2.4519395153156807,
   3.2680483519998433,
   0.8004134435530513,
   0.5923933885743846,
   0.10787836947632859
  ],
  "se": [
   0.03581000948974066,
   0.07136927313091469,
   0.0010615238462492026,
   0.014725362157320553,
   0.007475192431105719
  ],
  "r2": 0.9950762440423349
 },
 "T4": {
  "src": "mpmath 40 位精修；scipy 1.18.1 curve_fit(method=lm, 解析雅可比, ftol=xtol=1e-14) 交叉，sigma=第 3 列，absolute_sigma=False / True",
  "names": [
   "A",
   "tau",
   "c"
  ],
  "rel": {
   "p": [
    5122.320453096727,
    18.71849685680987,
    143.8548660108454
   ],
   "se": [
    43.73732170802452,
    0.34576362605656075,
    20.382129425328618
   ],
   "chi2red": 0.8600353736517424,
   "loglik": -76.82744058800948,
   "aic": 161.65488117601896,
   "bic": 164.7452360649781
  },
  "abs": {
   "p": [
    5122.320453096727,
    18.71849685680987,
    143.8548660108454
   ],
   "se": [
    47.16219699129037,
    0.37283883895228376,
    21.978163397301945
   ],
   "chi2red": 0.8600353736517424
  },
  "src_ic": "R 4.6.1 nls(deriv, weights = 1/σ²) 的 logLik / AIC / BIC（起点 = mp 精修解；absSigma 不影响它们）"
 },
 "T5": {
  "src": "R 4.6.1 lm + predict(interval=confidence/prediction, level=0.95)；反算 x = (y−a)/b",
  "names": [
   "a",
   "b"
  ],
  "p": [
   0.007417460317460489,
   0.09781095238095236
  ],
  "se": [
   0.0026387226585667368,
   0.0004357707049949811
  ],
  "r2": 0.9996825150332712,
  "inv": [
   {
    "y": 0.35,
    "x": 3.50249671783437
   },
   {
    "y": 0.62,
    "x": 6.2629237807302385
   },
   {
    "y": 0.905,
    "x": 9.176707902675878
   }
  ],
  "pred": [
   {
    "x": 1,
    "y": 0.10522841269841285,
    "se": 0.0022921152464147826,
    "cLo": 0.10036934544111233,
    "cHi": 0.11008747995571337,
    "pLo": 0.09098681776538636,
    "pHi": 0.11947000763143933
   },
   {
    "x": 5,
    "y": 0.4964722222222223,
    "se": 0.0014884403197770253,
    "cLo": 0.49331686970075245,
    "cHi": 0.4996275747436922,
    "pLo": 0.4827183594498888,
    "pHi": 0.5102260849945558
   },
   {
    "x": 9,
    "y": 0.8877160317460318,
    "se": 0.0022921152464147826,
    "cLo": 0.8828569644887312,
    "cHi": 0.8925750990033323,
    "pLo": 0.8734744368130053,
    "pHi": 0.9019576266790582
   }
  ]
 },
 "T6": {
  "src": "mpmath 40 位精修两个模型后按额外平方和 F 检验与 AICc 计算；R 4.6.1 anova(nls_expdec, nls_biexp) + AIC 交叉 ≤1e-6",
  "modelA": "expdec",
  "modelB": "biexp",
  "F": 1.7509999890651948,
  "df1": 1,
  "df2": 7,
  "p": 0.22733365929891783,
  "dAICc": -4.877497211596186,
  "ssrA": 0.014729200545832408,
  "ssrB": 0.011782013935511471
 },
 "T7": {
  "nls": {
   "Misra1a": {
    "1": 11,
    "2": 10.19
   },
   "Chwirut2": {
    "1": 8.86,
    "2": 8.58
   },
   "Chwirut1": {
    "1": 9.69,
    "2": 9.97
   },
   "Lanczos3": {
    "1": 6.8,
    "2": 8.11
   },
   "Gauss1": {
    "1": 10.57,
    "2": 10.56
   },
   "Gauss2": {
    "1": 10,
    "2": 9.91
   },
   "DanWood": {
    "1": 11,
    "2": 11
   },
   "Misra1b": {
    "1": 10.96,
    "2": 9.38
   },
   "Kirby2": {
    "1": 10.47,
    "2": 10.47
   },
   "Hahn1": {
    "1": 10.8,
    "2": 10.8
   },
   "MGH17": {
    "1": 10.78,
    "2": 10.83
   },
   "Lanczos1": {
    "1": 10.56,
    "2": 10.56
   },
   "Lanczos2": {
    "1": 8.48,
    "2": 9.25
   },
   "Gauss3": {
    "1": 10.45,
    "2": 9.51
   },
   "Misra1c": {
    "1": 10.8,
    "2": 10.8
   },
   "Misra1d": {
    "1": 9.4,
    "2": 11
   },
   "Roszman1": {
    "1": 8.61,
    "2": 8.62
   },
   "ENSO": {
    "1": 7.21,
    "2": 6.88
   },
   "MGH09": {
    "1": 8.82,
    "2": 8.43
   },
   "Thurber": {
    "1": 8.25,
    "2": 8.65
   },
   "BoxBOD": {
    "1": 9.38,
    "2": 10.48
   },
   "Rat42": {
    "1": 10.39,
    "2": 9.54
   },
   "MGH10": {
    "1": 9.81,
    "2": 8.97
   },
   "Eckerle4": {
    "1": 9.7,
    "2": 10.63
   },
   "Rat43": {
    "1": 7.96,
    "2": 8.38
   },
   "Bennett5": {
    "1": 11,
    "2": 11
   }
  },
  "lls": {
   "Norris": 14.06,
   "Pontius": 13.51,
   "NoInt1": 14.72,
   "NoInt2": 15,
   "Filip": 14.01,
   "Wampler1": 15,
   "Wampler2": 13.2,
   "Wampler3": 15,
   "Wampler4": 15,
   "Wampler5": 15
  },
  "src": "本对拍台 s1/s2：引擎 ftol=xtol=1e-15、maxfev=5000 下每个数据集参数的最小 LRE（认证值 11 / 15 位），浏览器重算后断言 ≥ 该值 − 0.3"
 },
 "SF": {
  "src": "scipy 1.18.1 special.erf / special.erfc / stats.t.ppf / stats.f.sf",
  "erf": [
   [
    0.3,
    0.3286267594591274
   ],
   [
    1.7,
    0.9837904585907745
   ],
   [
    2.6,
    0.9997639655834707
   ],
   [
    -3.1,
    -0.9999883513426328
   ],
   [
    4.5,
    0.9999999998033839
   ],
   [
    0.02,
    0.022564574691844943
   ]
  ],
  "erfc": [
   [
    0.3,
    0.6713732405408726
   ],
   [
    1.7,
    0.016209541409225436
   ],
   [
    2.6,
    0.000236034416529349
   ],
   [
    -3.1,
    1.9999883513426329
   ],
   [
    4.5,
    1.9661604415428876e-10
   ],
   [
    0.02,
    0.9774354253081551
   ]
  ],
  "tinv": [
   [
    0.975,
    1,
    12.706204736174694
   ],
   [
    0.975,
    2.5,
    3.574654842003682
   ],
   [
    0.995,
    7,
    3.4994832973504924
   ],
   [
    0.9,
    30,
    1.3104150253913955
   ],
   [
    0.975,
    100000,
    1.9599877075346093
   ],
   [
    1e-9,
    3,
    -1033.1096745038078
   ]
  ],
  "fsf": [
   [
    2.5,
    1,
    7,
    0.15785932279582993
   ],
   [
    0.8,
    3,
    20,
    0.5084046460438916
   ],
   [
    4.2,
    2,
    30,
    0.024651903288156606
   ],
   [
    1.7,
    5,
    1000,
    0.13184444123398273
   ]
  ]
 },
 "WL": {
  "src": "R 4.6.1 lm(y ~ x, weights = 1/σ²)（decay 示例，第 3 列 σ；r.squared 为 R 的加权口径）",
  "names": [
   "a",
   "b"
  ],
  "p": [
   3160.065158929351,
   -52.36051738638484
  ],
  "se": [
   312.8814525102227,
   6.849334603247974
  ],
  "r2": 0.8067369275250829
 },
 "DC": {
  "src": "R 4.6.1 lm(y ~ x)；表格按小数逗号手工转换（x = 0.5…4.5，y = 1.30, 2.10, 2.95, 3.70, 4.62）",
  "text": "x;y\n0,5;1,30\n1,5;2,10\n2,5;2,95\n3,5;3,70\n4,5;4,62",
  "x": [
   0.5,
   1.5,
   2.5,
   3.5,
   4.5
  ],
  "y": [
   1.3,
   2.1,
   2.95,
   3.7,
   4.62
  ],
  "names": [
   "a",
   "b"
  ],
  "p": [
   0.8740000000000007,
   0.8239999999999998
  ]
 }
};

const BOM_RE = new RegExp('^' + String.fromCharCode(0xFEFF))   // 不在源码里写字面 BOM（2026-11-04 lessons）

export default async ({ page, toolURL, screenshot, assert }) => {
  const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300)
  const nearRel = (a, b, tol, msg) => assert(Number.isFinite(a) && Number.isFinite(b) && rel(a, b) <= tol, `${msg}：${a} vs ${b}（相对差 ${rel(a, b).toExponential(2)} > ${tol}）`)
  const nearAbs = (a, b, tol, msg) => assert(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tol, `${msg}：${a} vs ${b}（差 ${Math.abs(a - b).toExponential(2)} > ${tol}）`)
  // 把页面里的数组按参数名取出来
  const byName = (fit, names, key) => names.map((n) => fit[key][fit.names.indexOf(n)])

  await page.goto(toolURL, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => window.FLA && FLA.R.fit && FLA.R.fit.ok, null, { timeout: 15000 })

  // 等拟合结果对应「这一次的输入」，再等主图按当前状态重画（2026-11-18：等待条件要绑定本次输入）
  const settled = async () => {
    await page.waitForFunction(() => FLA.R.fitInput === FLA.inputKey() && document.getElementById('fl-fig').dataset.key === FLA.stateKey(), null, { timeout: 15000 })
  }
  const loadEx = async (id) => {
    await page.selectOption('#fl-example', id)
    await page.waitForFunction((id) => FLA.state.exampleId === id && FLA.R.fitInput === FLA.inputKey(), id, { timeout: 15000 })
    await settled()
  }
  const onTab = async (t) => {
    await page.click(`#fl-tab-${t}`)
    await page.waitForFunction((t) => getComputedStyle(document.getElementById('fl-pane-' + t)).display !== 'none' && FLA.state.tab === t, t)
  }
  const fit = () => page.evaluate(() => {
    const r = FLA.R.fit
    return r && r.ok ? { names: r.names, p: Array.from(r.p), se: Array.from(r.se), t: Array.from(r.t), pval: Array.from(r.pval), ciLo: Array.from(r.ciLo), ciHi: Array.from(r.ciHi),
      r2: r.r2, r2adj: r.r2adj, rmse: r.rmse, aic: r.aic, aicc: r.aicc, bic: r.bic, loglik: r.loglik, ssr: r.ssr, s2: r.s2, n: r.n, m: r.m, method: r.method, converged: r.converged, centered: r.centered, atBound: r.atBound } : { ok: false, msg: r && r.msg }
  })

  // ───── 首屏：默认载入嘌呤霉素 + 米氏方程 ─────
  assert(await page.locator('a[href="../../"]', { hasText: '返回工具集' }).count() === 1, '顶部有「← 返回工具集」链接')
  assert(await page.inputValue('#fl-example') === 'puromycin', '首屏默认示例是嘌呤霉素')
  await settled()

  // T1：米氏方程，真值 R nls（scipy 交叉）
  {
    const T = ORACLE.T1, f = await fit()
    assert(f.method === 'lm' && f.converged, `T1 走 LM 并收敛（${f.method}）`)
    T.names.forEach((n, k) => {
      nearRel(byName(f, T.names, 'p')[k], T.p[k], 1e-7, `T1 ${n} 估计值 vs ${T.src}`)
      nearRel(byName(f, T.names, 'se')[k], T.se[k], 1e-6, `T1 ${n} 标准误`)
      nearRel(byName(f, T.names, 't')[k], T.t[k], 1e-6, `T1 ${n} t 值`)
      nearRel(byName(f, T.names, 'pval')[k], T.pval[k], 1e-5, `T1 ${n} p 值`)
      nearRel(byName(f, T.names, 'ciLo')[k], T.ciLo[k], 1e-6, `T1 ${n} 95% 下限`)
      nearRel(byName(f, T.names, 'ciHi')[k], T.ciHi[k], 1e-6, `T1 ${n} 95% 上限`)
    })
    for (const k of ['r2', 'r2adj', 'rmse', 'aic', 'aicc', 'bic', 'loglik', 'ssr']) nearRel(f[k], T[k], 1e-7, `T1 ${k}`)
    const dg = await page.evaluate(() => ({ dw: FLA.R.fit.dw, runs: FLA.R.fit.runs.runs, z: FLA.R.fit.runs.z, p: FLA.R.fit.runs.p }))
    nearRel(dg.dw, T.dw, 1e-7, 'T1 Durbin–Watson（statsmodels）')
    assert(dg.runs === T.runs.runs, `T1 游程数 ${dg.runs} vs ${T.runs.runs}`)
    nearRel(dg.z, T.runs.z, 1e-9, 'T1 游程检验 z')
    nearRel(dg.p, T.runs.p, 1e-7, 'T1 游程检验 p')
    // 页面表格显示的数字（7 位有效数字）与真值一致：容差 = 显示位数的半个末位
    const shown = await page.$$eval('#fl-rtable tbody tr', (trs) => trs.map((tr) => ({ p: tr.dataset.p, est: tr.querySelector('.fl-est').textContent, se: tr.querySelector('.fl-se').textContent })))
    assert(shown.length === 2, `T1 参数表 2 行（${shown.length}）`)
    for (const row of shown) {
      const k = T.names.indexOf(row.p)
      nearRel(Number(row.est), T.p[k], 5e-7 + 1e-9, `T1 表格显示的 ${row.p}`)
      nearRel(Number(row.se), T.se[k], 5e-5 + 1e-9, `T1 表格显示的 ${row.p} 标准误`)
    }
    const r2txt = await page.locator('#fl-gof .fl-stat[data-i="6"] dd').textContent()
    nearRel(Number(r2txt), T.r2, 5e-7, 'T1 页面显示的 R²')
    // 主图：曲线与置信带都画出来了，12 个点都在
    const fig = await page.evaluate(() => ({ pts: document.querySelectorAll('#fl-fig .fl-pt').length, curve: !!document.querySelector('#fl-fig .fl-curve'), ci: !!document.querySelector('#fl-fig .fl-ci'),
      rfig: getComputedStyle(document.getElementById('fl-rfig')).display, rh: document.getElementById('fl-rfig').getBoundingClientRect().height }))
    assert(fig.pts === 12 && fig.curve && fig.ci, `T1 主图 12 点 + 曲线 + 置信带（${JSON.stringify(fig)}）`)
    // 曲线只画在数据 x 范围内：米氏方程在 x = −Km 有极点，往两侧的留白外推会画出一截负值（改坏 M33 首轮 GREEN 后补）
    const ext = await page.evaluate(() => {
      const xs = (document.querySelector('#fl-fig .fl-curve').getAttribute('d').match(/[ML](-?[\d.]+)/g) || []).map((t) => +t.slice(1))
      const cx = Array.from(document.querySelectorAll('#fl-fig .fl-pt')).map((c) => +c.getAttribute('cx'))
      return { c0: Math.min(...xs), c1: Math.max(...xs), p0: Math.min(...cx), p1: Math.max(...cx) }
    })
    assert(ext.c0 >= ext.p0 - 0.6 && ext.c1 <= ext.p1 + 0.6, `T1 曲线不越过最外侧数据点（曲线 ${ext.c0.toFixed(1)}–${ext.c1.toFixed(1)}，点 ${ext.p0.toFixed(1)}–${ext.p1.toFixed(1)}）`)
    assert(fig.rfig !== 'none' && fig.rh >= 100, `T1 残差图可见（display=${fig.rfig}，高 ${fig.rh}）`)
  }

  // ───── 交互：点图上的点排除 / 恢复 ─────
  {
    const n0 = (await fit()).n
    const pt = page.locator('#fl-fig .fl-pt[data-k="2"]')
    await pt.click()
    await page.waitForFunction(() => FLA.state.exclude.length === 1 && FLA.state.exclude[0] === 2)
    await settled()
    const f1 = await fit()
    assert(f1.n === n0 - 1, `排除第 2 点后 n = ${n0 - 1}（${f1.n}）`)
    assert(await page.inputValue('#fl-exclude') === '2', '排除框里写上了行号 2')
    const hollow = await page.locator('#fl-fig .fl-pt-ex[data-k="2"]').count()
    assert(hollow === 1, '被排除的点画成空心')
    // 独立复算：排除第 2 点（47）后用自己的 Gauss-Newton 在测试里重解米氏方程，与页面一致
    const mine = await page.evaluate(() => {
      const X = [0.02, 0.06, 0.06, 0.11, 0.11, 0.22, 0.22, 0.56, 0.56, 1.10, 1.10], Y = [76, 97, 107, 123, 139, 159, 152, 191, 201, 207, 200]
      let V = 200, K = 0.06
      for (let it = 0; it < 200; it++) {
        let a = 0, b = 0, c = 0, g1 = 0, g2 = 0
        for (let i = 0; i < X.length; i++) {
          const d = K + X[i], f = V * X[i] / d, r = Y[i] - f, j1 = X[i] / d, j2 = -V * X[i] / (d * d)
          a += j1 * j1; b += j1 * j2; c += j2 * j2; g1 += j1 * r; g2 += j2 * r
        }
        const det = a * c - b * b, dv = (c * g1 - b * g2) / det, dk = (a * g2 - b * g1) / det
        V += dv; K += dk
        if (Math.abs(dv) < 1e-14 * Math.abs(V) && Math.abs(dk) < 1e-14 * Math.abs(K)) break
      }
      return { V, K }
    })
    nearRel(f1.p[f1.names.indexOf('Vmax')], mine.V, 1e-9, '排除一点后 Vmax 与测试内独立高斯-牛顿一致')
    nearRel(f1.p[f1.names.indexOf('Km')], mine.K, 1e-9, '排除一点后 Km 与测试内独立高斯-牛顿一致')
    await page.locator('#fl-fig .fl-pt[data-k="2"]').click()
    await page.waitForFunction(() => FLA.state.exclude.length === 0)
    await settled()
    assert((await fit()).n === n0, '再点一次恢复')
  }

  // ───── 交互：固定参数（闭式解交叉）+ 上界 ─────
  {
    const kmRow = page.locator('#fl-ptable tr[data-p="Km"]')
    await kmRow.locator('input[data-k="value"]').fill('0.06')
    await kmRow.locator('input[data-k="fixed"]').check()
    await page.waitForFunction(() => FLA.state.params.Km.fixed === true && FLA.R.fitInput === FLA.inputKey(), null, { timeout: 10000 })
    await settled()
    const f = await fit()
    // Km 固定时模型对 Vmax 线性：Vmax = Σ y·g / Σ g²，g = x/(0.06 + x)（测试里闭式算）
    const X = [0.02, 0.02, 0.06, 0.06, 0.11, 0.11, 0.22, 0.22, 0.56, 0.56, 1.10, 1.10], Y = [76, 47, 97, 107, 123, 139, 159, 152, 191, 201, 207, 200]
    let num = 0, den = 0
    X.forEach((x, i) => { const g = x / (0.06 + x); num += Y[i] * g; den += g * g })
    assert(f.m === 1, `固定 Km 后只剩 1 个自由参数（${f.m}）`)
    nearRel(f.p[f.names.indexOf('Vmax')], num / den, 1e-12, '固定 Km = 0.06 时 Vmax 等于闭式最小二乘解')
    assert((await page.locator('#fl-rtable tr[data-p="Km"] .fl-tag', { hasText: '固定' }).count()) === 1, '结果表标出「固定」')
    // 解除固定，给 Vmax 加上界 200（真值 212.68 在界外）⇒ 停在边界上并标注
    await kmRow.locator('input[data-k="fixed"]').uncheck()
    await page.locator('#fl-ptable tr[data-p="Vmax"] input[data-k="max"]').fill('200')
    await page.waitForFunction(() => FLA.state.params.Vmax.max === '200' && !FLA.state.params.Km.fixed && FLA.R.fitInput === FLA.inputKey(), null, { timeout: 10000 })
    await settled()
    const fb = await fit()
    nearAbs(fb.p[fb.names.indexOf('Vmax')], 200, 1e-6, '上界 200 时 Vmax 停在 200')
    assert(fb.atBound[fb.names.indexOf('Vmax')] === true, 'Vmax 被标为在边界上')
    assert((await page.locator('#fl-rtable tr[data-p="Vmax"] .fl-tag', { hasText: '在边界上' }).count()) === 1, '结果表标出「在边界上」')
    await page.locator('#fl-ptable tr[data-p="Vmax"] input[data-k="max"]').fill('')
    await page.waitForFunction(() => FLA.state.params.Vmax.max === '' && FLA.R.fitInput === FLA.inputKey(), null, { timeout: 10000 })
    await settled()
    nearRel((await fit()).p[0], ORACLE.T1.p[ORACLE.T1.names.indexOf('Vmax')], 1e-7, '去掉上界后回到无约束解')
  }

  // ───── T2：ELISA 4PL（对数 x 轴）+ 标准曲线反算 ─────
  await loadEx('dnase')
  {
    const T = ORACLE.T2, f = await fit()
    assert(await page.isChecked('#fl-logx'), 'T2 4PL 示例默认 x 对数轴')
    T.names.forEach((n, k) => {
      nearRel(byName(f, T.names, 'p')[k], T.p[k], 1e-6, `T2 ${n} 估计值 vs ${T.src}`)
      nearRel(byName(f, T.names, 'se')[k], T.se[k], 1e-5, `T2 ${n} 标准误`)
    })
    // 对数轴刻度是 1/2/5×10^k 档，曲线点全是有限数
    const ax = await page.evaluate(() => {
      const ticks = Array.from(document.querySelectorAll('#fl-fig text')).map((t) => t.textContent)
      const d = document.querySelector('#fl-fig .fl-curve').getAttribute('d')
      return { ticks, finite: !/NaN|Infinity/.test(d), segs: (d.match(/L/g) || []).length }
    })
    assert(ax.ticks.includes('0.1') && ax.ticks.includes('1') && ax.ticks.includes('10'), `T2 对数轴刻度含 0.1 / 1 / 10（${ax.ticks.join(' ')}）`)
    assert(ax.finite && ax.segs >= 300, `T2 曲线路径全为有限数（${ax.segs} 段）`)
    await onTab('pred')
    assert((await page.inputValue('#fl-iy')).trim() === '0.25\n0.80\n1.45', 'T2 示例带了 3 个未知样')
    await page.click('#fl-iy-run')
    await page.waitForFunction(() => document.querySelectorAll('#fl-iy-table tbody tr').length === 3)
    const rows = await page.$$eval('#fl-iy-table tbody tr', (trs) => trs.map((tr) => Array.from(tr.cells).map((c) => c.textContent)))
    const inv = await page.evaluate(() => [0.25, 0.8, 1.45].map((y) => FL.inverse(FLA.R.fit, y, { level: 0.95, reps: 1 })[0]))
    T.inv.forEach((q, i) => {
      nearRel(inv[i].x, q.x, 1e-6, `T2 反算 y=${q.y} 的 x̂`)
      nearRel(inv[i].seDelta, q.seDelta, 1e-5, `T2 反算 y=${q.y} 的 delta SE`)
      nearRel(inv[i].lo, q.lo, 1e-5, `T2 反算 y=${q.y} 的逆回归下限`)
      nearRel(inv[i].hi, q.hi, 1e-5, `T2 反算 y=${q.y} 的逆回归上限`)
      nearRel(Number(rows[i][1]), q.x, 5e-7 + 1e-9, `T2 表格显示的 x̂（y=${q.y}）`)
      assert(inv[i].lo < inv[i].x && inv[i].x < inv[i].hi, `T2 区间包住 x̂（y=${q.y}）`)
    })
    // 超出标准曲线范围的读数要明说，不能给个外推值
    await page.fill('#fl-iy', '2.5')
    await page.click('#fl-iy-run')
    await page.waitForFunction(() => /超出标准曲线范围/.test(document.querySelector('#fl-iy-table tbody').textContent))
    await page.fill('#fl-iy', '0.25\n0.80\n1.45')
    await onTab('fit')
  }

  // ───── T3：阻尼振动；多起点从坏初值救回 ─────
  await loadEx('damped')
  {
    const T = ORACLE.T3, f = await fit()
    T.names.forEach((n, k) => {
      nearRel(byName(f, T.names, 'p')[k], T.p[k], 1e-6, `T3 ${n} 估计值 vs ${T.src}`)
      nearRel(byName(f, T.names, 'se')[k], T.se[k], 1e-5, `T3 ${n} 标准误`)
    })
    nearRel(f.r2, T.r2, 1e-9, 'T3 R²')
    // 坏初值：f = 2.2 时 LM 停在局部极小（R² 很低）
    await page.evaluate(() => { FLA.state.auto = false })
    for (const [n, v] of [['A', '1'], ['tau', '1'], ['f', '2.2'], ['phi', '0'], ['c', '0']]) await page.locator(`#fl-ptable tr[data-p="${n}"] input[data-k="value"]`).fill(v)
    await page.click('#fl-run')
    await page.waitForFunction(() => FLA.state.params.f.value === '2.2' && FLA.R.fitInput === FLA.inputKey())
    const bad = await fit()
    assert(bad.r2 < 0.5, `T3 坏初值单起点只拿到局部极小（R² = ${bad.r2}）`)
    await page.click('#fl-multistart')
    await page.waitForFunction(() => /多起点搜索/.test(document.getElementById('fl-status').textContent) && FLA.R.fitInput === FLA.inputKey(), null, { timeout: 30000 })
    const ms = await fit()
    nearRel(ms.r2, T.r2, 1e-9, 'T3 多起点搜索回到全局最优的 R²')
    nearRel(ms.p[ms.names.indexOf('f')], T.p[T.names.indexOf('f')], 1e-6, 'T3 多起点取到 0.8 Hz 的解（不是采样混叠出的高频解）')
    await page.evaluate(() => { FLA.state.auto = true })
  }

  // ───── T4：σ 加权，两种口径 ─────
  await loadEx('decay')
  {
    const T = ORACLE.T4
    assert(await page.inputValue('#fl-cols') === '2', 'T4 示例自动选中第 3 列为 σ')
    let f = await fit()
    T.names.forEach((n, k) => {
      nearRel(byName(f, T.names, 'p')[k], T.rel.p[k], 1e-7, `T4 ${n} 估计值（相对权重）`)
      nearRel(byName(f, T.names, 'se')[k], T.rel.se[k], 1e-6, `T4 ${n} 标准误（相对权重，按 χ²ᵣ 缩放）`)
    })
    nearRel(f.s2, T.rel.chi2red, 1e-7, 'T4 χ²ᵣ')
    for (const k of ['aic', 'bic', 'loglik']) nearRel(f[k], T.rel[k], 1e-7, `T4 加权拟合的 ${k}（R nls weights = 1/σ²）`)
    // 加权线性：同一份带 σ 的数据换成直线模型，对 R lm(weights)；再强制走 LM 路径交叉
    const wl = await page.evaluate(() => {
      const d = FLA.R.data, m = FL.compile('a + b*x')
      const L = FL.fit({ model: m, x: d.x, y: d.y, sigma: d.sigma, params: [] })
      const N = FL.fit({ model: m, x: d.x, y: d.y, sigma: d.sigma, params: [{ name: 'a', value: 1 }, { name: 'b', value: 1 }], method: 'lm', ftol: 1e-15, xtol: 1e-15 })
      return { method: L.method, p: Array.from(L.p), se: Array.from(L.se), r2: L.r2, pl: Array.from(N.p) }
    })
    assert(wl.method === 'linear', `加权直线走线性求解（${wl.method}）`)
    ORACLE.WL.names.forEach((n, k) => {
      nearRel(wl.p[k], ORACLE.WL.p[k], 1e-11, `加权直线 ${n} vs ${ORACLE.WL.src}`)
      nearRel(wl.se[k], ORACLE.WL.se[k], 1e-9, `加权直线 ${n} 标准误`)
      nearRel(wl.pl[k], ORACLE.WL.p[k], 1e-8, `加权直线 ${n}：强制走 LM 也到同一点`)
    })
    nearRel(wl.r2, ORACLE.WL.r2, 1e-10, '加权直线 R²（R 的加权口径）')
    await page.selectOption('#fl-abs', '1')
    await page.waitForFunction(() => FLA.state.absSigma === true && FLA.R.fitInput === FLA.inputKey())
    await settled()
    f = await fit()
    T.names.forEach((n, k) => {
      nearRel(byName(f, T.names, 'p')[k], T.abs.p[k], 1e-7, `T4 ${n} 估计值（绝对 σ，参数不变）`)
      nearRel(byName(f, T.names, 'se')[k], T.abs.se[k], 1e-6, `T4 ${n} 标准误（绝对 σ，不缩放）`)
    })
    // 误差棒画出来了（每个点一根竖线）
    const bars = await page.evaluate(() => Array.from(document.querySelectorAll('#fl-fig line')).filter((l) => l.getAttribute('x1') === l.getAttribute('x2') && l.getAttribute('stroke') === '#525252').length)
    assert(bars === 16, `T4 画了 16 根误差棒（${bars}）`)
    await page.selectOption('#fl-abs', '0')
    await page.waitForFunction(() => FLA.state.absSigma === false && FLA.R.fitInput === FLA.inputKey())
  }

  // ───── T5：线性校准直线 + 预测区间 + 反算（R lm）─────
  await loadEx('calib')
  {
    const T = ORACLE.T5, f = await fit()
    assert(f.method === 'linear', `T5 直线模型走线性求解（${f.method}）`)
    T.names.forEach((n, k) => {
      nearRel(byName(f, T.names, 'p')[k], T.p[k], 1e-12, `T5 ${n} 系数 vs ${T.src}`)
      nearRel(byName(f, T.names, 'se')[k], T.se[k], 1e-11, `T5 ${n} 标准误`)
    })
    nearRel(f.r2, T.r2, 1e-13, 'T5 R²')
    await onTab('pred')
    assert((await page.inputValue('#fl-px')).trim() === '1\n5\n9', 'T5 预测 x 默认取数据范围的 10% / 50% / 90%')
    await page.click('#fl-px-run')
    await page.waitForFunction(() => document.querySelectorAll('#fl-px-table tbody tr').length === 3)
    const pr = await page.evaluate(() => {
      const r = FLA.R.fit, xs = [1, 5, 9], c = FL.band(r, xs, { level: 0.95, kind: 'conf' }), p = FL.band(r, xs, { level: 0.95, kind: 'pred' })
      return xs.map((x, i) => ({ y: c.y[i], se: c.se[i], cLo: c.lo[i], cHi: c.hi[i], pLo: p.lo[i], pHi: p.hi[i] }))
    })
    T.pred.forEach((q, i) => {
      for (const k of ['y', 'se', 'cLo', 'cHi', 'pLo', 'pHi']) nearRel(pr[i][k], q[k], 1e-10, `T5 x=${q.x} 的 ${k}（R predict）`)
    })
    const yhat = await page.$$eval('#fl-px-table .fl-yhat', (ns) => ns.map((n) => Number(n.textContent)))
    T.pred.forEach((q, i) => nearRel(yhat[i], q.y, 5e-7 + 1e-9, `T5 表格显示的 ŷ（x=${q.x}）`))
    await page.click('#fl-iy-run')
    await page.waitForFunction(() => document.querySelectorAll('#fl-iy-table tbody tr').length === 3)
    const xh = await page.$$eval('#fl-iy-table .fl-xhat', (ns) => ns.map((n) => Number(n.textContent)))
    T.inv.forEach((q, i) => nearRel(xh[i], q.x, 5e-7 + 1e-9, `T5 反算 y=${q.y}`))
    await onTab('fit')
  }

  // ───── 自定义公式：报错定位 → 改对后与内置模型逐位相同 ─────
  await loadEx('bod')
  {
    const builtin = await fit()
    await page.fill('#fl-formula', 'Ymax*(1 - exp(-k*x)) +')
    await page.waitForFunction(() => !document.getElementById('fl-formula-msg').hidden)
    const msg = await page.textContent('#fl-formula-msg')
    assert(/公式不完整/.test(msg), `残缺公式给出中文报错（${msg}）`)
    assert(await page.inputValue('#fl-model') === 'custom', '改了公式后模型库切到「自定义公式」')
    await page.click('#fl-run')
    await page.waitForFunction(() => FLA.R.fit === null && FLA.R.fitInput !== FLA.inputKey() || (FLA.R.fit === null))
    assert(await page.evaluate(() => getComputedStyle(document.getElementById('fl-rfig')).display) === 'none', '公式有误、没有拟合结果时残差图藏起来')
    await page.fill('#fl-formula', 'y = Ymax*(1 - exp(-k*x))')
    await page.waitForFunction(() => document.getElementById('fl-formula-msg').hidden && FLA.state.formula === 'y = Ymax*(1 - exp(-k*x))')
    await page.click('#fl-guess')
    await page.waitForFunction(() => FLA.R.fitInput === FLA.inputKey())
    await settled()
    const cu = await fit()
    builtin.names.forEach((n) => nearRel(cu.p[cu.names.indexOf(n)], builtin.p[builtin.names.indexOf(n)], 1e-9, `写成「y = …」的同一公式给出同一个 ${n}`))
    const rf = await page.evaluate(() => { const s = document.getElementById('fl-rfig'); return { d: getComputedStyle(s).display, h: s.getBoundingClientRect().height, n: s.querySelectorAll('.fl-rpt').length } })
    assert(rf.d !== 'none' && rf.h >= 100 && rf.n === 6, `公式改对后残差图重新显示、6 个残差点（${JSON.stringify(rf)}）`)
    const deriv = await page.textContent('#fl-deriv')
    assert(/∂f\/∂k = /.test(deriv) && /exp/.test(deriv), `偏导数面板列出 ∂f/∂k（${deriv.slice(0, 80)}）`)
    // 拟合式：参数值代回公式
    const fitted = await page.textContent('#fl-fitted')
    assert(/^y = /.test(fitted) && !/Ymax|\bk\b/.test(fitted.split('\n')[0]), `拟合式第一行已代入数值（${fitted.split('\n')[0]}）`)
    // Ctrl+Enter 触发拟合
    await page.evaluate(() => { FLA.R.fitInput = null })
    await page.keyboard.press('Control+Enter')
    await page.waitForFunction(() => FLA.R.fitInput === FLA.inputKey())
  }

  // ───── T6：模型比较（R anova + AIC）─────
  await loadEx('indometh')
  {
    const T = ORACLE.T6
    await onTab('cmp')
    await page.selectOption('#fl-cmp-a', T.modelA)
    await page.selectOption('#fl-cmp-b', T.modelB)
    await page.evaluate(() => { FLA.R.cmp = null })
    await page.click('#fl-cmp-run')
    await page.waitForFunction(() => FLA.R.cmp && FLA.R.cmp.c)
    const c = await page.evaluate(() => ({ F: FLA.R.cmp.c.F, df1: FLA.R.cmp.c.df1, df2: FLA.R.cmp.c.df2, p: FLA.R.cmp.c.p, d: FLA.R.cmp.c.dAICc, ssrA: FLA.R.cmp.A.ssr, ssrB: FLA.R.cmp.B.ssr }))
    nearRel(c.ssrA, T.ssrA, 1e-7, `T6 模型 A 的 SSR vs ${T.src}`)
    nearRel(c.ssrB, T.ssrB, 1e-7, 'T6 模型 B 的 SSR')
    nearRel(c.F, T.F, 1e-6, 'T6 F')
    assert(c.df1 === T.df1 && c.df2 === T.df2, `T6 自由度 ${c.df1},${c.df2} vs ${T.df1},${T.df2}`)
    nearRel(c.p, T.p, 1e-5, 'T6 p')
    nearAbs(c.d, T.dAICc, 1e-6 * Math.max(1, Math.abs(T.dAICc)), 'T6 ΔAICc')
    const wA = await page.evaluate(() => FLA.R.cmp.c.wA)
    nearRel(wA, 1 / (1 + Math.exp(T.dAICc / 2)), 1e-6, 'T6 Akaike 权重 = 1/(1 + e^{ΔAICc/2})')
    const shownD = await page.textContent('#fl-cmp-d')
    nearAbs(Number(shownD), T.dAICc, 5e-5 * Math.max(1, Math.abs(T.dAICc)), 'T6 页面显示的 ΔAICc')
    const curves = await page.evaluate(() => document.querySelectorAll('#fl-cmp-fig path').length)
    assert(curves >= 2, `T6 比较图画了两条曲线（${curves} 条 path）`)
    await onTab('fit')
  }

  // ───── T7：NIST StRD 全部重算 ─────
  {
    await onTab('nist')
    await page.click('#fl-nist-run')
    await page.waitForFunction(() => FLA.R.nist && document.getElementById('fl-nist-ok'), null, { timeout: 60000 })
    const N = await page.evaluate(() => FLA.R.nist.rows.map((r) => ({ name: r.name, start: r.start, kind: r.kind, ok: r.ok, minP: r.minP, lreS: r.lreS, lreR: r.lreR, r2: r.r2 })))
    assert(N.length === 62, `NIST 共 62 次拟合（${N.length}）`)
    assert(N.every((r) => r.ok), `62 次全部收敛（未收敛：${N.filter((r) => !r.ok).map((r) => r.name + '/' + r.start).join(',')}）`)
    const T = ORACLE.T7
    for (const r of N) {
      const want = r.kind === 'nls' ? T.nls[r.name][String(r.start)] : T.lls[r.name]
      // 离线基线来自 node:vm 跑同一引擎；噪声底上的题（ENSO 含 sin/cos，LRE ~7）浏览器与 Node 的 libm 末位不同，
      // 实测 ENSO 起点 1 浏览器 6.83 / Node 7.21 ⇒ 允许 1 位的跨运行时差，绝对下限另断（非线性 6 位、线性 13 位）
      assert(r.minP >= want - 1.0, `NIST ${r.name} 起点 ${r.start || '线性'} 参数 LRE ${r.minP.toFixed(2)} ≥ 离线基线 ${want.toFixed(2)} − 1`)
      assert(r.minP >= (r.kind === 'nls' ? 6 : 13), `NIST ${r.name} 起点 ${r.start || '线性'} 参数 LRE ${r.minP.toFixed(2)} 达到 ${r.kind === 'nls' ? 6 : 13} 位`)
      if (r.name !== 'Lanczos1') assert(r.lreS >= (r.kind === 'nls' ? 6 : 13), `NIST ${r.name} 起点 ${r.start || '线性'} 标准误 LRE ${r.lreS.toFixed(2)}`)
      if (r.kind === 'lls') assert(r.r2 >= 13, `NIST ${r.name} R² LRE ${r.r2.toFixed(2)} ≥ 13（NoInt1/2 为非中心化口径）`)
      const rssMin = r.name === 'Lanczos1' ? 2 : r.kind === 'nls' ? 9 : 13
      assert(r.lreR >= rssMin, `NIST ${r.name} 起点 ${r.start || '线性'} 残差平方和 LRE ${r.lreR.toFixed(2)} ≥ ${rssMin}`)
    }
    const filip = N.find((r) => r.name === 'Filip')
    assert(filip.minP >= 13.5, `Filip 十次多项式 11 个系数 LRE ≥ 13.5（${filip.minP.toFixed(2)}）`)
    assert((await page.textContent('#fl-nist-ok')).trim() === '62 / 62', '汇总显示 62 / 62')
    // 载入一份 NIST 数据集到工作区：公式与起点 1 都带过去
    await page.click('#fl-nist-table tr[data-n="Misra1a"][data-s="1"] .fl-nist-load')
    await page.waitForFunction(() => FLA.state.tab === 'fit' && FLA.state.formula === 'b1*(1-exp(-b2*x))' && FLA.R.fitInput === FLA.inputKey())
    const m = await fit()
    nearRel(m.p[m.names.indexOf('b1')], 238.94212918, 1e-9, 'Misra1a 载入后 b1 对上 NIST 认证值 2.3894212918E+02')
  }

  // ───── 存档：离页补写、我的拟合（保存 / 改名 / 两步删除 / 刷新后仍在）─────
  await loadEx('orange')
  {
    await page.locator('#fl-ptable tr[data-p="K"] input[data-k="value"]').fill('160')
    await page.reload({ waitUntil: 'domcontentloaded' })   // 防抖 300 ms 内立刻刷新：靠 pagehide 补写
    await page.waitForFunction(() => window.FLA && FLA.R.fit && FLA.R.fit.ok)
    assert(await page.inputValue('#fl-example') === 'orange', '刷新后还在橙树示例')
    assert(await page.locator('#fl-ptable tr[data-p="K"] input[data-k="value"]').inputValue() === '160', '刷新前刚改的初值 160 被离页补写保住了')
    await page.click('#fl-save')
    await page.waitForFunction(() => FLA.state.tab === 'proj' && document.querySelectorAll('#fl-proj-list .fl-proj-card').length === 1)
    await page.click('#fl-proj-list .fl-pj-ren')
    await page.fill('#fl-proj-list .fl-pj-name', '橙树 1 号 logistic')
    await page.keyboard.press('Enter')
    await page.waitForFunction(() => document.querySelector('#fl-proj-list h3') && document.querySelector('#fl-proj-list h3').textContent === '橙树 1 号 logistic')
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => window.FLA && FLA.R.fit)
    await onTab('proj')
    assert((await page.textContent('#fl-proj-list h3')) === '橙树 1 号 logistic', '刷新后「我的拟合」里还有改过名的那条')
    assert((await page.textContent('#fl-kpi-proj')).trim() === '1', '顶部计数 = 1')
    // 换个示例后再打开存档：数据、模型都回来
    await page.evaluate(() => FLA.loadExample('bod'))
    await page.click('#fl-proj-list .fl-pj-open')
    await page.waitForFunction(() => FLA.state.tab === 'fit' && FLA.state.exampleId === 'orange' && FLA.state.modelId === 'logistic' && FLA.R.fitInput === FLA.inputKey())
    await onTab('proj')
    await page.click('#fl-proj-list .fl-pj-del')
    assert((await page.textContent('#fl-proj-list .fl-pj-del')) === '确认删除', '删除要点两次（第一次变成「确认删除」）')
    assert(await page.locator('#fl-proj-list .fl-proj-card').count() === 1, '第一次点删除不删')
    await page.click('#fl-proj-list .fl-pj-del')
    await page.waitForFunction(() => document.querySelectorAll('#fl-proj-list .fl-proj-card').length === 0)
    // 导入：一条合法 + 一条垃圾
    const n = await page.evaluate(() => FLA.importProjects(JSON.stringify({ projects: [{ name: '<b>导入</b>', ws: { dataText: 'x\ty\n1\t2\n2\t4\n3\t6.1' } }, { junk: 1 }] })))
    assert(n === 1, `导入只收合法条目（${n}）`)
    const h3 = await page.locator('#fl-proj-list h3').first().innerHTML()
    assert(h3 === '&lt;b&gt;导入&lt;/b&gt;', `导入的名字按纯文本显示，不当 HTML 解析（${h3}）`)
    await onTab('fit')
  }

  // ───── 导出 CSV：下载件内容由测试独立复核 ─────
  await loadEx('puromycin')
  {
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#fl-exp-csv')])
    const fs = await import('node:fs')
    const txt = fs.readFileSync(await dl.path(), 'utf8').replace(BOM_RE, '')
    const lines = txt.trim().split('\n')
    assert(lines[0] === 'row,x,y,sigma,excluded,fitted,residual', `CSV 表头（${lines[0]}）`)
    assert(lines.length === 13, `CSV 12 行数据（${lines.length - 1}）`)
    const T = ORACLE.T1, V = T.p[T.names.indexOf('Vmax')], K = T.p[T.names.indexOf('Km')]
    for (const ln of lines.slice(1)) {
      const c = ln.split(',').map(Number)
      nearRel(c[5], V * c[1] / (K + c[1]), 1e-6, `CSV 第 ${c[0]} 行拟合值 = Vmax·x/(Km+x)（用 R 的参数在测试里算）`)
      nearAbs(c[6], c[2] - c[5], 1e-9, `CSV 第 ${c[0]} 行残差 = y − 拟合值`)
    }
  }

  // ───── 粘贴：分号分隔 + 小数逗号（欧洲区 Excel 导出）─────
  {
    await page.fill('#fl-data', 'x;y\n0,5;1,30\n1,5;2,10\n2,5;2,95\n3,5;3,70\n4,5;4,62')
    await page.selectOption('#fl-model', 'line')
    await page.waitForFunction(() => FLA.state.modelId === 'line' && FLA.R.fit && FLA.R.fit.ok && FLA.R.fitInput === FLA.inputKey(), null, { timeout: 10000 })
    const dc = await fit()
    assert(dc.n === 5, `小数逗号表读出 5 个点（${dc.n}）`)
    ORACLE.DC.p.forEach((v, k) => nearRel(dc.p[k], v, 1e-12, `小数逗号表直线系数 ${['a', 'b'][k]}（R lm）`))
    // 非数字格：报出行号，该行跳过
    await page.fill('#fl-data', 'x\ty\n1\t2\n2\tabc\n3\t6\n4\t8.1')
    await page.waitForFunction(() => /第 3 行第 2 列不是数字/.test(document.getElementById('fl-data-msg').textContent))
    await page.waitForFunction(() => FLA.R.fit && FLA.R.fit.ok && FLA.R.fit.n === 3 && FLA.R.fitInput === FLA.inputKey(), null, { timeout: 10000 })
  }
  // ───── Codex 复核补测（每条对应一条已修的意见）─────
  {
    const errs = []
    page.on('pageerror', (e) => errs.push(e.message))
    // P1：单侧下界且初值就在边界上，不能停在初值
    const b0 = await page.evaluate(() => { const r = FL.fit({ formula: 'a*x', x: [1, 2, 3], y: [2, 4, 6], params: [{ name: 'a', value: 0, min: 0 }] }); return { a: r.p[0], ok: r.converged } })
    nearRel(b0.a, 2, 1e-9, '下界 0、初值 0 的 y = a*x 收敛到 a = 2')
    // P1：清空数据再粘两列，y 列仍是第 2 列
    await page.selectOption('#fl-model', 'line')
    await page.fill('#fl-data', '')
    await page.waitForFunction(() => FLA.R.data && FLA.R.data.nrows === 0)
    await page.fill('#fl-data', '1\t3\n2\t5\n3\t7.2\n4\t8.8')
    await page.waitForFunction(() => FLA.R.fit && FLA.R.fit.ok && FLA.R.fitInput === FLA.inputKey() && FLA.R.fit.n === 4, null, { timeout: 10000 })
    const cl = await fit()
    assert(await page.evaluate(() => FLA.state.coly) === 1 && await page.inputValue('#fl-coly') === '1', '清空再粘贴后 y 列仍是第 2 列')
    { // 期望斜率在测试里按闭式算（Σ(x−x̄)(y−ȳ)/Σ(x−x̄)²），不手填
      const X = [1, 2, 3, 4], Y = [3, 5, 7.2, 8.8], mx = 2.5, my = Y.reduce((a, b) => a + b) / 4
      const sl = X.reduce((a, x, i) => a + (x - mx) * (Y[i] - my), 0) / X.reduce((a, x) => a + (x - mx) ** 2, 0)
      nearRel(cl.p[cl.names.indexOf('b')], sl, 1e-12, `清空再粘贴后斜率按 (x, 第 2 列) 计算 = ${sl}`)
    }
    // P1：秩亏线性模型 a*x + 3*b*x —— 系数取基本解、SSR = 2.8、标出不可辨识
    await page.fill('#fl-data', '0\t1\n1\t2\n2\t1')
    await page.fill('#fl-formula', 'a*x + 3*b*x')
    await page.waitForFunction(() => FLA.state.formula === 'a*x + 3*b*x' && FLA.R.fit && FLA.R.fit.ok && FLA.R.fitInput === FLA.inputKey(), null, { timeout: 10000 })
    const rd = await page.evaluate(() => ({ ssr: FLA.R.fit.ssr, p: Array.from(FLA.R.fit.p), un: FLA.R.fit.unidentifiable, fitted: Array.from(FLA.R.fit.fitted) }))
    nearRel(rd.ssr, 2.8, 1e-12, '秩亏模型 SSR = 2.8（过原点直线的最小二乘）')
    assert(rd.un.includes('b') && Math.abs(rd.p[0] + 3 * rd.p[1] - 0.8) < 1e-12, `秩亏：a + 3b = 0.8 且 b 标为不可辨识（${JSON.stringify(rd)}）`)
    assert(/不可辨识/.test(await page.textContent('#fl-status')), '状态条提示不可辨识')
    // P2：固定截距的 a + b*x 与 b*x 的 R² 一致
    const r2s = await page.evaluate(() => {
      const x = [1, 2, 3, 4], y = [2.1, 3.9, 6.2, 7.8]
      const A = FL.fit({ formula: 'a + b*x', x, y, params: [{ name: 'a', value: 0, fixed: true }] }), B = FL.fit({ formula: 'b*x', x, y, params: [] })
      return [A.r2, B.r2, A.r2adj, B.r2adj]
    })
    nearRel(r2s[0], r2s[1], 1e-14, '固定截距为 0 的 a + b*x 与 b*x 的 R² 一致'); nearRel(r2s[2], r2s[3], 1e-14, '调整 R² 也一致')
    // P2：反算不把极点当根、能找到切点
    // x 取 −3…4（不对称）：对称区间下 x = 0 恰是扫描网格点，那一格被当成非有限跳过，验残差这道关根本走不到（改坏 M51 首轮 GREEN 后补）
    const pole = await page.evaluate(() => { const r = FL.fit({ formula: 'a/x', x: [-3, -2, -1, 1, 2, 3, 4], y: [-1, -1.5, -3, 3, 1.5, 1, 0.75], params: [] }); return FL.inverse(r, 0).length })
    assert(pole === 0, `a/x 反算 y = 0 没有根（极点两侧的变号不算，得 ${pole} 个）`)
    const tan = await page.evaluate(() => { const r = FL.fit({ formula: 'a*(x-0.333333)^2', x: [0, 0.2, 0.5, 0.8, 1], y: [0.111, 0.0178, 0.0278, 0.218, 0.445], params: [] }); return FL.inverse(r, 0).map((q) => q.x) })
    assert(tan.length === 1 && Math.abs(tan[0] - 0.333333) < 1e-6, `切点反算找到顶点 x = 0.333333（${tan}）`)
    // P1：逆回归区间与预测带一致 —— 区间端点处预测带的边恰好穿过 y₀（等权与绝对 σ 两种口径）
    for (const abs of [false, true]) {
      const cons = await page.evaluate((abs) => {
        const x = [1, 2, 3, 4, 5, 6], y = [2.2, 3.8, 6.3, 7.7, 10.4, 11.9], sg = [0.3, 0.2, 0.4, 0.3, 0.5, 0.3]
        const r = FL.fit({ formula: 'a + b*x', x, y, sigma: abs ? sg : null, absSigma: abs, params: [] })
        const q = FL.inverse(r, 7, { reps: 2 })[0], b = FL.band(r, [q.lo, q.hi], { kind: 'pred', reps: 2 })
        return { lo: b.hi[0] - 7, hi: b.lo[1] - 7 }
      }, abs)
      assert(Math.abs(cons.lo) < 1e-9 && Math.abs(cons.hi) < 1e-9, `${abs ? '绝对 σ' : '等权'}：反算区间端点落在预测带边上（${JSON.stringify(cons)}）`)
    }
    // P1：「同时」只作用于置信带，预测带仍是逐点 t 分位
    const sim = await page.evaluate(() => {
      const r = FL.fit({ formula: 'a + b*x', x: [1, 2, 3, 4, 5], y: [1.1, 2.3, 2.8, 4.2, 4.9], params: [] })
      return { p1: FL.band(r, [2.5], { kind: 'pred' }).hi[0], p2: FL.band(r, [2.5], { kind: 'pred', simultaneous: true }).hi[0], c1: FL.band(r, [2.5], { kind: 'conf' }).hi[0], c2: FL.band(r, [2.5], { kind: 'conf', simultaneous: true }).hi[0] }
    })
    assert(sim.p1 === sim.p2 && sim.c2 > sim.c1, `Scheffé 只放宽置信带（${JSON.stringify(sim)}）`)
    // P1：对数 y 轴 + 预测带整条不可画时不中断绘图
    await page.fill('#fl-formula', 'a + b*x')
    await page.fill('#fl-data', '1\t1\n2\t10\n3\t100')
    await page.check('#fl-logy'); await page.check('#fl-showpi')
    await page.waitForFunction(() => FLA.R.fit && FLA.R.fit.ok && FLA.R.fit.n === 3 && document.getElementById('fl-fig').dataset.key === FLA.stateKey(), null, { timeout: 10000 })
    assert(await page.locator('#fl-fig .fl-pt').count() === 3, '对数 y 轴 + 预测带下，3 个点照样画出来')
    await page.uncheck('#fl-logy'); await page.uncheck('#fl-showpi')
    // P2：x 在 1e16 量级（刻度步长加不动）不卡死；排除框填超大范围不卡死
    await page.fill('#fl-data', '10000000000000000\t1\n10000000000000002\t2\n10000000000000004\t3.1')
    await page.waitForFunction(() => FLA.R.data && FLA.R.data.x.length === 3 && document.getElementById('fl-fig').dataset.key === FLA.stateKey(), null, { timeout: 10000 })
    await page.fill('#fl-exclude', '9007199254740992-9007199254740993, 2-3')
    await page.dispatchEvent('#fl-exclude', 'change')
    await page.waitForFunction(() => FLA.state.exclude.join(',') === '2,3', null, { timeout: 5000 })
    await page.fill('#fl-exclude', ''); await page.dispatchEvent('#fl-exclude', 'change')
    await page.waitForFunction(() => FLA.state.exclude.length === 0)
    // P2：点数不够时 AICc 无定义，不宣布赢家
    await page.fill('#fl-data', '1\t2\n2\t4.1\n3\t5.9\n4\t8.2')
    await page.waitForFunction(() => FLA.R.data && FLA.R.data.x.length === 4)
    await onTab('cmp')
    await page.selectOption('#fl-cmp-a', 'line'); await page.selectOption('#fl-cmp-b', 'poly2')
    await page.click('#fl-cmp-run')
    await page.waitForFunction(() => /AICc 无定义/.test(document.getElementById('fl-cmp-msg').textContent))
    assert(!/NaN/.test(await page.textContent('#fl-cmp-table')), '比较表里不出现 NaN')
    await onTab('fit')
    // P2：关了自动拟合再改数据，导出的 CSV 仍满足 残差 = y − 拟合值（导出前先按当前输入重拟合）
    await page.uncheck('#fl-auto')
    await page.fill('#fl-data', '1\t2.5\n2\t4.4\n3\t6.1\n4\t8.6')
    const [dl2] = await Promise.all([page.waitForEvent('download'), page.click('#fl-exp-csv')])
    const fs2 = await import('node:fs')
    const rows2 = fs2.readFileSync(await dl2.path(), 'utf8').replace(BOM_RE, '').trim().split('\n').slice(1).map((l) => l.split(',').map(Number))
    assert(rows2.length === 4 && rows2.every((c) => Math.abs(c[6] - (c[2] - c[5])) < 1e-12) && rows2[0][2] === 2.5, `关自动拟合后改数据再导出，CSV 自洽（${JSON.stringify(rows2[0])}）`)
    await page.check('#fl-auto')
    // P1：导出的 SVG 不夹带工作区数据与内部属性
    const [dl3] = await Promise.all([page.waitForEvent('download'), page.click('#fl-exp-svg')])
    const svgTxt = fs2.readFileSync(await dl3.path(), 'utf8')
    // 旧实现把 JSON.stringify(工作区) 放进 data-key：数据行以「4\\t8.6」的转义形式出现；这里两种写法都查
    assert(svgTxt.startsWith('<?xml') && /<svg[\s>]/.test(svgTxt) && !/data-key|data-k=/.test(svgTxt) && !svgTxt.includes('4\t8.6') && !svgTxt.includes('4\\t8.6'),
      '导出的 SVG 不含 data-key、点序号与原始数据行')
    // P1：另一个标签页刚存的条目，不会被本页过期的列表写回覆盖
    await onTab('proj')
    await page.click('#fl-proj-save')
    await page.waitForFunction(() => document.querySelectorAll('#fl-proj-list .fl-proj-card').length >= 1)
    const before = await page.evaluate(() => JSON.parse(localStorage.getItem('fl-proj-v1')).length)
    await page.evaluate(() => {   // 模拟别的标签页：直接往存储里加一条，不通知本页
      const L = JSON.parse(localStorage.getItem('fl-proj-v1')); L.push({ id: 'pOther', name: '别的标签页存的', savedAt: new Date().toISOString(), ws: { dataText: '1\t2\n2\t3' }, sum: {} })
      localStorage.setItem('fl-proj-v1', JSON.stringify(L))
    })
    await page.click('#fl-proj-list .fl-pj-ren')
    await page.fill('#fl-proj-list .fl-pj-name', '改个名')
    await page.keyboard.press('Enter')
    await page.waitForFunction(() => Array.from(document.querySelectorAll('#fl-proj-list h3')).some((h) => h.textContent === '改个名'))
    const after = await page.evaluate(() => JSON.parse(localStorage.getItem('fl-proj-v1')).map((p) => p.name))
    assert(after.length === before + 1 && after.includes('别的标签页存的') && after.includes('改个名'), `改名后别的标签页的条目还在（${after}）`)
    // P2：导入的工作区字段不合法时清洗成默认值，打开不报错
    const ni = await page.evaluate(() => FLA.importProjects(JSON.stringify([{ name: '缺字段', ws: { dataText: '1\t2\n2\t4.2\n3\t5.9', exclude: null, params: 5, level: 'x' } }])))
    assert(ni === 1, `字段不合法的条目被清洗后导入（${ni}）`)
    await page.locator('#fl-proj-list .fl-proj-card', { hasText: '缺字段' }).locator('.fl-pj-open').click()
    await page.waitForFunction(() => FLA.state.tab === 'fit' && FLA.R.fit && FLA.R.fit.ok && FLA.R.fit.n === 3 && Array.isArray(FLA.state.exclude) && FLA.state.level === 0.95)
    assert(errs.length === 0, `补测期间页面无报错（${errs.join(' | ')}）`)
  }

  // ───── 残差诊断与行序无关（M30：DW 要按 x 排序再算）───── 打乱嘌呤霉素的行序，DW 仍等于 statsmodels 按 x 排序的值
  {
    await page.selectOption('#fl-model', 'mm')
    // 行序整体打乱，但同一个 x 的两行保持原来的先后（DW 对并列 x 的先后本来就有歧义，引擎按「x，再原行号」排序）
    await page.fill('#fl-data', '[S] ppm\tv\n0.56\t191\n0.02\t76\n1.10\t207\n0.22\t159\n0.06\t97\n0.11\t123\n0.02\t47\n0.56\t201\n0.11\t139\n1.10\t200\n0.06\t107\n0.22\t152')
    await page.click('#fl-guess')
    await page.waitForFunction(() => FLA.state.modelId === 'mm' && FLA.R.fit && FLA.R.fit.ok && FLA.R.fit.n === 12 && FLA.R.fitInput === FLA.inputKey(), null, { timeout: 10000 })
    const dw = await page.evaluate(() => FLA.R.fit.dw)
    nearRel(dw, ORACLE.T1.dw, 1e-6, '行序打乱后 Durbin–Watson 不变（按 x 排序后计算）')
  }
  // ───── 打印器往返（M39）：parse(print(ast)) 与 ast 结构相同 —— 刁钻写法 + 页内 400 个随机表达式 ─────
  {
    const rt = await page.evaluate(() => {
      const fixed = ['-(a*b)', '-(x^2)', '(-a)^2', '2^-x', 'a/(b*c)', 'a-(b-c)', 'a-(-b)', '-(a/b)*c', 'a^b^c', '(a^b)^c', 'exp(-(x-m)^2/(2*s^2))', 'a*(b/c)', '-a*b', '-(-x)']
      const bad = []
      for (const f of fixed) { const t = FL.parse(f); if (FL.key(FL.parse(FL.print(t))) !== FL.key(t)) bad.push(f + ' → ' + FL.print(t)) }
      let seed = 20261123; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648 }
      const leaf = () => { const r = rnd(); return r < 0.4 ? { t: 'var', n: ['x', 'a', 'b'][Math.floor(rnd() * 3)] } : { t: 'num', v: Math.round((rnd() * 20 - 10) * 100) / 100 } }
      const gen = (d) => {
        if (d <= 0 || rnd() < 0.25) return leaf()
        const r = rnd()
        if (r < 0.12) return { t: 'neg', a: gen(d - 1) }
        if (r < 0.22) return { t: 'fn', f: ['exp', 'ln', 'sin', 'sqrt'][Math.floor(rnd() * 4)], args: [gen(d - 1)] }
        return { t: ['add', 'sub', 'mul', 'div', 'pow'][Math.floor(rnd() * 5)], a: gen(d - 1), b: gen(d - 1) }
      }
      let n = 0
      for (let i = 0; i < 400; i++) { const t = gen(5); n++; const back = FL.parse(FL.print(t)); if (FL.key(back) !== FL.key(t)) { bad.push(FL.print(t)); if (bad.length > 5) break } }
      return { bad, n }
    })
    assert(rt.n === 400 && rt.bad.length === 0, `打印器往返 0 失配（${rt.n} 个随机 + 14 个刁钻写法；失配：${rt.bad.slice(0, 3).join(' | ')}）`)
  }
  // ───── 特殊函数抽查（scipy 真值）─────
  {
    const sf = await page.evaluate((SF) => ({
      erf: SF.erf.map(([x]) => FL.stats.erf(x)), erfc: SF.erfc.map(([x]) => FL.stats.erfc(x)),
      tinv: SF.tinv.map(([p, df]) => FL.stats.tinv(p, df)), fsf: SF.fsf.map(([f, a, b]) => FL.stats.fSurvival(f, a, b))
    }), ORACLE.SF)
    ORACLE.SF.erf.forEach(([x, v], i) => nearRel(sf.erf[i], v, 1e-14, `erf(${x})`))
    ORACLE.SF.erfc.forEach(([x, v], i) => nearRel(sf.erfc[i], v, 1e-13, `erfc(${x})`))
    ORACLE.SF.tinv.forEach(([p, df, v], i) => nearRel(sf.tinv[i], v, 1e-12, `t 分位 tinv(${p}, ${df})`))
    ORACLE.SF.fsf.forEach(([f, a, b, v], i) => nearRel(sf.fsf[i], v, 1e-11, `F 上尾 P(F_${a},${b} > ${f})`))
  }

  // ───── 页签键盘可用 ─────
  await page.focus('#fl-tab-fit')
  await page.keyboard.press('ArrowRight')
  await page.waitForFunction(() => FLA.state.tab === 'pred' && document.activeElement.id === 'fl-tab-pred', null, { timeout: 5000 }).catch(async (e) => {
    const st = await page.evaluate(() => ({ tab: FLA.state.tab, act: document.activeElement && (document.activeElement.id || document.activeElement.tagName) }))
    throw new Error('页签键盘切换没生效：' + JSON.stringify(st))
  })
  await page.keyboard.press('ArrowLeft')
  await page.waitForFunction(() => FLA.state.tab === 'fit')

  // ───── 渲染守卫（逐页签、逐视口）─────
  await loadEx('spectrum')
  await onTab('cmp'); await page.click('#fl-cmp-run'); await page.waitForFunction(() => FLA.R.cmp && FLA.R.cmp.c)
  // 前面刷新过页面，NIST 结果不在内存里了：重算一次，守卫才扫得到结果表与汇总块
  await onTab('nist'); await page.click('#fl-nist-run'); await page.waitForFunction(() => FLA.R.nist && document.getElementById('fl-nist-ok'), null, { timeout: 60000 })
  const tabs = ['fit', 'pred', 'cmp', 'nist', 'proj', 'doc']
  const nCtl = await renderGuards(page, {
    assert, tabs, onTab, paneSel: (t) => `#fl-pane-${t}`, panesRoot: '#fl-panes',
    figSel: (t) => `#fl-pane-${t} svg.fl-fig`, cardSel: '.fl-card', minControls: 40, minTextsInFig: 0,
    labelSel: 'th, dt, label, label > span, .fl-lbl'
  })
  assert(nCtl >= 40, `尺寸守卫扫到 ${nCtl} 个控件`)
  // 页签外的控件区（顶栏返回链接所在的 nav）与图里的文字
  await guardControlSize(page, { assert, tabs: ['#fl-tabs'], onTab: async () => {}, paneSel: (h) => h, minControls: 6 })
  await onTab('nist')
  await guardBoxOverlap(page, { assert, sel: '.fl-tab, .fl-kpi, #fl-nist-sum .fl-stat' })
  await onTab('fit')
  await guardBoxOverlap(page, { assert, sel: '.fl-tab, .fl-kpi, #fl-gof .fl-stat, #fl-diag .fl-stat' })
  await guardFigText(page, { assert, tabs: ['fit'], onTab, figSel: () => '#fl-pane-fit svg.fl-fig', minTextsInFig: 8 })
  // 守卫之后切回拟合页再做几何断言：主图里所有点都落在绘图框内，且框有实际尺寸
  await settled()
  const geo = await page.evaluate(() => {
    // 绘图框 = axes() 画的那个无填充外框（clipPath 里的 rect 在 <defs> 里不参与布局，取不到屏幕盒子）
    const svg = document.getElementById('fl-fig'), box = svg.querySelector(':scope > rect[fill="none"]').getBoundingClientRect()
    const pts = Array.from(svg.querySelectorAll('.fl-pt')).map((c) => { const r = c.getBoundingClientRect(); return { x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 } })
    return { w: box.width, h: box.height, n: pts.length, out: pts.filter((c) => c.x < box.left - 0.5 || c.x > box.right + 0.5 || c.y < box.top - 0.5 || c.y > box.bottom + 0.5).length }
  })
  assert(geo.w >= 400 && geo.h >= 200 && geo.n === 81 && geo.out === 0, `光谱示例 81 个点都在图框内（${JSON.stringify(geo)}）`)
  // 双峰拆分：两个峰中心分别落在 7.2 与 10.4 附近（模拟真值），峰宽为正
  const sp = await fit()
  nearAbs(sp.p[sp.names.indexOf('m1')], 7.2, 0.15, '双峰拆分：峰 1 中心')
  nearAbs(sp.p[sp.names.indexOf('m2')], 10.4, 0.15, '双峰拆分：峰 2 中心')

  // 缩略图：4PL 标准曲线（对数 x 轴 + 置信带 + 预测带）
  await loadEx('dnase')
  await page.check('#fl-showpi')
  await page.waitForFunction(() => FLA.state.showPI === true && document.getElementById('fl-fig').dataset.key === FLA.stateKey() && document.querySelectorAll('#fl-fig .fl-pi').length === 2)
  await page.evaluate(() => window.scrollTo(0, 0))
  await screenshot('thumb.png')
}
