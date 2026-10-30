// 凑单拆单工作台 · 集成测试（真实 Chromium）
// 真值一律来自 ORACLE（toracle/build.py：oracle/ref.py 照 SPEC 独立计价 + 暴力穷举 ≤12 件 / HiGHS 16 件），
// 由 inject-oracle.mjs 机械注入，不手抄。引擎只贡献「选了哪种划分」，金额全由 ref 复算；最优性由暴力 / MILP 判定。
import { guardHidden, guardControlSize, guardTextTransform, guardOverflow, guardEscape, guardFigText, guardUniqueIds } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const ORACLE = {
 "meta": {
  "tabs": [
   "cart",
   "promo",
   "plan",
   "fill",
   "refund",
   "saved",
   "about"
  ],
  "src": "toracle/build.py：oracle/ref.py 独立计价 + 暴力穷举（≤12 件）+ HiGHS/CP-SAT（16 件大车）"
 },
 "d11": {
  "best": {
   "benefit": 54000,
   "net": 120570,
   "nOrders": 2,
   "nCoupons": 4
  },
  "nofill": {
   "benefit": 52000,
   "net": 122570,
   "paid": 122570,
   "nOrders": 2
  },
  "src": "暴力",
  "single": {
   "paid": 126570,
   "net": 126570,
   "benefit": 48000
  },
  "plan": {
   "paid": 123150,
   "benefit": 54000,
   "orders": [
    91250,
    31900
   ],
   "unitPaid": {
    "0": 46585,
    "1": 31900,
    "2": 21450,
    "3": 9255,
    "4": 4508,
    "5": 4508,
    "6": 3003,
    "7": 970,
    "8": 971
   },
   "nUnits": 9,
   "list0": 131250
  },
  "mustList": 174570,
  "refund": [
   [
    0,
    46585,
    41900
   ],
   [
    2,
    21450,
    12900
   ],
   [
    3,
    9255,
    -2100
   ],
   [
    4,
    4508,
    -4010
   ],
   [
    5,
    4508,
    -4010
   ],
   [
    6,
    3003,
    -6010
   ],
   [
    7,
    970,
    -8710
   ],
   [
    8,
    971,
    -8710
   ],
   [
    1,
    31900,
    31900
   ]
  ],
  "fill": [
   {
    "store": -1,
    "base": 91250,
    "jumps": [
     [
      18750,
      13750,
      5000
     ],
     [
      48750,
      38750,
      10000
     ],
     [
      78750,
      63750,
      15000
     ],
     [
      108750,
      88750,
      20000
     ]
    ]
   },
   {
    "store": 0,
    "base": 91250,
    "jumps": [
     [
      18750,
      13750,
      5000
     ],
     [
      48750,
      38750,
      10000
     ],
     [
      78750,
      63750,
      15000
     ],
     [
      108750,
      88750,
      20000
     ]
    ]
   },
   {
    "store": 1,
    "base": 91250,
    "jumps": [
     [
      18750,
      13750,
      5000
     ],
     [
      48750,
      38750,
      10000
     ],
     [
      78750,
      63750,
      15000
     ],
     [
      108750,
      88750,
      20000
     ]
    ]
   },
   {
    "store": 2,
    "base": 91250,
    "jumps": [
     [
      18750,
      13750,
      5000
     ],
     [
      48750,
      38750,
      10000
     ],
     [
      78750,
      63750,
      15000
     ],
     [
      108750,
      88750,
      20000
     ]
    ]
   }
  ],
  "units": 11,
  "sec": 15
 },
 "split": {
  "best": {
   "benefit": 6000,
   "net": 46500,
   "nOrders": 2,
   "nCoupons": 0
  },
  "nofill": {
   "benefit": 6000,
   "net": 46500,
   "paid": 46500,
   "nOrders": 2
  },
  "src": "暴力",
  "single": {
   "paid": 49500,
   "net": 49500,
   "benefit": 3000
  },
  "plan": {
   "paid": 46500,
   "benefit": 6000,
   "orders": [
    24700,
    21800
   ],
   "unitPaid": {
    "0": 11340,
    "1": 7936,
    "2": 9720,
    "3": 7044,
    "4": 10460
   },
   "nUnits": 5,
   "list0": 27700
  },
  "mustList": 52500,
  "refund": [
   [
    1,
    7936,
    5900
   ],
   [
    2,
    9720,
    7900
   ],
   [
    3,
    7044,
    4900
   ],
   [
    0,
    11340,
    9900
   ],
   [
    4,
    10460,
    8900
   ]
  ],
  "fill": [
   {
    "store": -1,
    "base": 24700,
    "jumps": []
   },
   {
    "store": 0,
    "base": 24700,
    "jumps": []
   }
  ],
  "units": 6,
  "sec": 0.1
 },
 "beauty": {
  "best": {
   "benefit": 16190,
   "net": 67310,
   "nOrders": 1,
   "nCoupons": 2
  },
  "nofill": {
   "benefit": 16190,
   "net": 67310,
   "paid": 67310,
   "nOrders": 1
  },
  "src": "暴力",
  "single": {
   "paid": 67310,
   "net": 67310,
   "benefit": 16190
  },
  "plan": {
   "paid": 67310,
   "benefit": 16190,
   "orders": [
    67310
   ],
   "unitPaid": {
    "0": 17895,
    "1": 28054,
    "2": 6955,
    "3": 6956,
    "4": 6650
   },
   "nUnits": 5,
   "list0": 83500
  },
  "mustList": 83500,
  "refund": [
   [
    0,
    17895,
    19465
   ],
   [
    1,
    28054,
    30515
   ],
   [
    2,
    6955,
    7565
   ],
   [
    3,
    6956,
    7565
   ],
   [
    4,
    6650,
    6900
   ]
  ],
  "units": 7,
  "sec": 0
 },
 "d11_K1": {
  "best": {
   "benefit": 51840,
   "net": 122730,
   "nOrders": 1,
   "nCoupons": 3
  },
  "nofill": {
   "benefit": 48000,
   "net": 126570,
   "paid": 126570,
   "nOrders": 1
  },
  "src": "暴力",
  "single": {
   "paid": 126570,
   "net": 126570,
   "benefit": 48000
  },
  "plan": {
   "paid": 127050,
   "benefit": 51840,
   "orders": [
    127050
   ],
   "unitPaid": {
    "0": 48235,
    "1": 31674,
    "2": 21678,
    "3": 9353,
    "4": 4555,
    "5": 4555,
    "6": 3035,
    "7": 981,
    "8": 982,
    "10": 2002
   },
   "nUnits": 10,
   "list0": 180050
  },
  "mustList": 174570,
  "refund": [
   [
    0,
    48235,
    40900
   ],
   [
    1,
    31674,
    35900
   ],
   [
    2,
    21678,
    22900
   ],
   [
    3,
    9353,
    7900
   ],
   [
    4,
    4555,
    990
   ],
   [
    5,
    4555,
    990
   ],
   [
    6,
    3035,
    -1010
   ],
   [
    7,
    981,
    -3710
   ],
   [
    8,
    982,
    -3710
   ],
   [
    10,
    2002,
    -2100
   ]
  ],
  "units": 11,
  "sec": 0
 },
 "d11_price": {
  "best": {
   "benefit": 50000,
   "net": 119570,
   "nOrders": 2,
   "nCoupons": 4
  },
  "nofill": {
   "benefit": 49400,
   "net": 120170,
   "paid": 120170,
   "nOrders": 2
  },
  "src": "暴力",
  "single": {
   "paid": 121570,
   "net": 121570,
   "benefit": 48000
  },
  "plan": {
   "paid": 122150,
   "benefit": 50000,
   "orders": [
    90250,
    31900
   ],
   "unitPaid": {
    "0": 45706,
    "1": 31900,
    "2": 21392,
    "3": 9229,
    "4": 4496,
    "5": 4496,
    "6": 2994,
    "7": 968,
    "8": 969
   },
   "nUnits": 9,
   "list0": 126250
  },
  "mustList": 169570,
  "refund": [
   [
    0,
    45706,
    40900
   ],
   [
    2,
    21392,
    12900
   ],
   [
    3,
    9229,
    -2100
   ],
   [
    4,
    4496,
    -4010
   ],
   [
    5,
    4496,
    -4010
   ],
   [
    6,
    2994,
    -6010
   ],
   [
    7,
    968,
    -8710
   ],
   [
    8,
    969,
    -8710
   ],
   [
    1,
    31900,
    31900
   ]
  ],
  "units": 11,
  "sec": 12.6
 },
 "d11_add": {
  "best": {
   "benefit": 57240,
   "net": 127230,
   "nOrders": 2,
   "nCoupons": 4
  },
  "nofill": {
   "benefit": 54400,
   "net": 130070,
   "paid": 130070,
   "nOrders": 2
  },
  "src": "暴力",
  "single": {
   "paid": 131470,
   "net": 131470,
   "benefit": 53000
  },
  "plan": {
   "paid": 132840,
   "benefit": 57240,
   "orders": [
    91150,
    41690
   ],
   "unitPaid": {
    "0": 47503,
    "1": 30108,
    "2": 20991,
    "3": 9984,
    "4": 4507,
    "5": 4507,
    "6": 3002,
    "7": 970,
    "8": 970,
    "9": 998,
    "10": 1972,
    "11": 6728
   },
   "nUnits": 12,
   "list0": 131150
  },
  "mustList": 184470,
  "refund": [
   [
    0,
    47503,
    41900
   ],
   [
    2,
    20991,
    12900
   ],
   [
    4,
    4507,
    -4010
   ],
   [
    5,
    4507,
    -4010
   ],
   [
    6,
    3002,
    -6010
   ],
   [
    7,
    970,
    -8710
   ],
   [
    8,
    970,
    -8710
   ],
   [
    10,
    1972,
    -7100
   ],
   [
    11,
    6728,
    -100
   ],
   [
    1,
    30108,
    26900
   ],
   [
    3,
    9984,
    7900
   ],
   [
    9,
    998,
    -3710
   ]
  ],
  "units": 12,
  "sec": 80.7
 },
 "big": {
  "best": {
   "benefit": 57148,
   "net": 150052,
   "nOrders": 3
  },
  "milp": {
   "highs": [
    "ok",
    57148,
    3,
    75.6
   ],
   "cpsat": [
    "timeout",
    null,
    null,
    90.2
   ]
  },
  "src": "HiGHS（CP-SAT 限时内未解出，单源）",
  "single": {
   "paid": 154052,
   "net": 154052,
   "benefit": 53148
  },
  "plan": {
   "paid": 150052,
   "benefit": 57148,
   "orders": [
    94552,
    27800,
    27700
   ],
   "unitPaid": {
    "0": 15098,
    "1": 16801,
    "2": 6423,
    "3": 29158,
    "4": 16734,
    "5": 9427,
    "6": 3541,
    "7": 2531,
    "8": 5138,
    "9": 6165,
    "10": 2763,
    "11": 4027,
    "12": 6180,
    "13": 8888,
    "14": 12702,
    "15": 4476
   },
   "nUnits": 16,
   "list0": 129700
  },
  "mustList": 207200,
  "refund": [
   [
    3,
    29158,
    25900
   ],
   [
    4,
    16734,
    17900
   ],
   [
    5,
    9427,
    7900
   ],
   [
    6,
    3541,
    4590
   ],
   [
    7,
    2531,
    3280
   ],
   [
    8,
    5138,
    6660
   ],
   [
    9,
    6165,
    7990
   ],
   [
    10,
    2763,
    3582
   ],
   [
    11,
    4027,
    5220
   ],
   [
    12,
    6180,
    8010
   ],
   [
    13,
    8888,
    6520
   ],
   [
    0,
    15098,
    11900
   ],
   [
    14,
    12702,
    8900
   ],
   [
    1,
    16801,
    10900
   ],
   [
    2,
    6423,
    6900
   ],
   [
    15,
    4476,
    3900
   ]
  ],
  "units": 16,
  "sec": 0
 },
 "free": {
  "best": {
   "benefit": 0,
   "net": 18900,
   "nOrders": 1,
   "nCoupons": 0
  },
  "src": "暴力",
  "single": {
   "paid": 18900,
   "net": 18900,
   "benefit": 0
  },
  "plan": {
   "paid": 18900,
   "benefit": 0,
   "orders": [
    18900
   ],
   "unitPaid": {
    "0": 18900
   },
   "nUnits": 1,
   "list0": 18900
  },
  "mustList": 18900,
  "refund": [
   [
    0,
    18900,
    18900
   ]
  ],
  "fill": [
   {
    "store": -1,
    "base": 18900,
    "jumps": []
   },
   {
    "store": 0,
    "base": 18900,
    "jumps": [
     [
      1000,
      -4000,
      5000
     ]
    ]
   }
  ],
  "units": 1,
  "sec": 0.1
 },
 "cart": {
  "big": {
   "v": 1,
   "stores": [
    {
     "id": "b1",
     "name": "服饰店",
     "act": {
      "type": "tier",
      "tiers": [
       [
        199,
        20
       ],
       [
        399,
        50
       ]
      ]
     },
     "coupons": [
      {
       "id": "bc1",
       "x": 300,
       "y": 30,
       "n": 1
      }
     ],
     "ship": {
      "fee": 0,
      "free": null
     }
    },
    {
     "id": "b2",
     "name": "家电店",
     "act": {
      "type": "every",
      "x": 500,
      "y": 40,
      "cap": 0
     },
     "coupons": [],
     "ship": {
      "fee": 0,
      "free": null
     }
    },
    {
     "id": "b3",
     "name": "超市",
     "act": {
      "type": "none"
     },
     "coupons": [],
     "ship": {
      "fee": 6,
      "free": 99
     }
    },
    {
     "id": "b4",
     "name": "书店",
     "act": {
      "type": "qty",
      "tiers": [
       [
        3,
        90
       ],
       [
        5,
        80
       ]
      ]
     },
     "coupons": [],
     "ship": {
      "fee": 0,
      "free": null
     }
    }
   ],
   "items": [
    {
     "id": "g0",
     "name": "卫衣",
     "store": "b1",
     "price": 189,
     "qty": 1,
     "opt": false,
     "val": 100,
     "fs": true,
     "fx": true,
     "fc": true
    },
    {
     "id": "g1",
     "name": "牛仔裤",
     "store": "b1",
     "price": 259,
     "qty": 1,
     "opt": false,
     "val": 100,
     "fs": true,
     "fx": true,
     "fc": true
    },
    {
     "id": "g2",
     "name": "围巾",
     "store": "b1",
     "price": 99,
     "qty": 1,
     "opt": false,
     "val": 100,
     "fs": true,
     "fx": true,
     "fc": true
    },
    {
     "id": "g3",
     "name": "电饭煲",
     "store": "b2",
     "price": 399,
     "qty": 1,
     "opt": false,
     "val": 100,
     "fs": true,
     "fx": true,
     "fc": true
    },
    {
     "id": "g4",
     "name": "吹风机",
     "store": "b2",
     "price": 229,
     "qty": 1,
     "opt": false,
     "val": 100,
     "fs": true,
     "fx": true,
     "fc": true
    },
    {
     "id": "g5",
     "name": "电水壶",
     "store": "b2",
     "price": 129,
     "qty": 1,
     "opt": false,
     "val": 100,
     "fs": true,
     "fx": true,
     "fc": true
    },
    {
     "id": "g6",
     "name": "洗衣液",
     "store": "b3",
     "price": 45.9,
     "qty": 1,
     "opt": false,
     "val": 100,
     "fs": true,
     "fx": true,
     "fc": true
    },
    {
     "id": "g7",
     "name": "纸巾",
     "store": "b3",
     "price": 32.8,
     "qty": 1,
     "opt": false,
     "val": 100,
     "fs": true,
     "fx": true,
     "fc": true
    },
    {
     "id": "g8",
     "name": "零食",
     "store": "b3",
     "price": 66.6,
     "qty": 1,
     "opt": false,
     "val": 100,
     "fs": true,
     "fx": true,
     "fc": true
    },
    {
     "id": "g9",
     "name": "大米",
     "store": "b3",
     "price": 79.9,
     "qty": 1,
     "opt": false,
     "val": 100,
     "fs": true,
     "fx": true,
     "fc": true
    },
    {
     "id": "g10",
     "name": "小说",
     "store": "b4",
     "price": 39.8,
     "qty": 1,
     "opt": false,
     "val": 100,
     "fs": true,
     "fx": true,
     "fc": true
    },
    {
     "id": "g11",
     "name": "绘本",
     "store": "b4",
     "price": 58,
     "qty": 1,
     "opt": false,
     "val": 100,
     "fs": true,
     "fx": true,
     "fc": true
    },
    {
     "id": "g12",
     "name": "字典",
     "store": "b4",
     "price": 89,
     "qty": 1,
     "opt": false,
     "val": 100,
     "fs": true,
     "fx": true,
     "fc": true
    },
    {
     "id": "g13",
     "name": "画册",
     "store": "b4",
     "price": 128,
     "qty": 1,
     "opt": false,
     "val": 100,
     "fs": true,
     "fx": true,
     "fc": true
    },
    {
     "id": "g14",
     "name": "台灯",
     "store": "b2",
     "price": 159,
     "qty": 1,
     "opt": false,
     "val": 100,
     "fs": true,
     "fx": true,
     "fc": true
    },
    {
     "id": "g15",
     "name": "手套",
     "store": "b1",
     "price": 69,
     "qty": 1,
     "opt": false,
     "val": 100,
     "fs": true,
     "fx": true,
     "fc": true
    }
   ],
   "plat": {
    "cross": {
     "type": "every",
     "x": 300,
     "y": 50,
     "cap": 0
    },
    "coupons": [
     {
      "id": "bp1",
      "x": 200,
      "y": 20,
      "n": 2
     },
     {
      "id": "bp2",
      "x": 800,
      "y": 80,
      "n": 1
     }
    ]
   },
   "rules": {
    "scBase": "list",
    "xBase": "list",
    "pcBase": "list",
    "maxOrders": 0
   }
  },
  "free": {
   "v": 1,
   "stores": [
    {
     "id": "f1",
     "name": "小店",
     "act": {
      "type": "tier",
      "tiers": [
       [
        199,
        50
       ]
      ]
     },
     "coupons": [],
     "ship": {
      "fee": 5,
      "free": 189
     }
    }
   ],
   "items": [
    {
     "id": "f1i",
     "name": "台灯",
     "store": "f1",
     "price": 189,
     "qty": 1,
     "opt": false,
     "val": 100,
     "fs": true,
     "fx": true,
     "fc": true
    }
   ],
   "plat": {
    "cross": {
     "type": "none"
    },
    "coupons": []
   },
   "rules": {
    "scBase": "after",
    "xBase": "list",
    "pcBase": "after",
    "maxOrders": 0
   }
  }
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const errs = []
  page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()) })
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message))
  const fmt = (c) => { const neg = c < 0; c = Math.abs(c); const y = Math.floor(c / 100), f = c % 100; return (neg ? '−' : '') + '¥' + String(y).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + String(f).padStart(2, '0') }
  const seqNow = () => page.evaluate(() => +document.getElementById('cl-panes').dataset.seq)
  const settle = (after = 0, timeout = 20000) => page.waitForFunction((a) => {
    const p = document.getElementById('cl-panes')
    return p.dataset.busy === '0' && p.dataset.seq === p.dataset.req && +p.dataset.seq > a
  }, after, { timeout })
  const onTab = async (t) => {
    await page.click('#tab-' + t)
    await page.waitForFunction((x) => !document.getElementById('pane-' + x).hidden, t)
  }
  const text = (sel) => page.$eval(sel, (n) => n.textContent.trim())
  const summary = () => page.evaluate(() => ['cl-sum-list', 'cl-sum-single', 'cl-sum-best', 'cl-sum-save'].map((id) => document.getElementById(id).textContent.trim()))
  const result = () => page.evaluate(() => { const r = CLApp.result(); return r.ok ? { b: r.plan.benefit, n: r.plan.nOrders, c: r.plan.nCoupons, m: r.plan.method, proven: r.plan.proven, paid: r.plan.paid } : { err: r.errors } })
  const checkSummary = async (O, tag) => {
    const s = await summary()
    assert(s[0] === fmt(O.mustList), `${tag} 必买原价 ${s[0]} ≠ ${fmt(O.mustList)}`)
    assert(s[1] === fmt(O.single.paid), `${tag} 一单结算 ${s[1]} ≠ ${fmt(O.single.paid)}（ref.single）`)
    assert(s[2] === fmt(O.plan.paid), `${tag} 最优实付 ${s[2]} ≠ ${fmt(O.plan.paid)}（ref 逐单复算）`)
    assert(s[3] === fmt(Math.max(0, O.single.net - O.best.net)), `${tag} 多省 ${s[3]} ≠ ${fmt(O.single.net - O.best.net)}`)
    const r = await result()
    assert(r.b === O.best.benefit, `${tag} 收益 ${r.b} ≠ ${O.src} 最优 ${O.best.benefit}`)
    assert(r.n === O.best.nOrders, `${tag} 订单数 ${r.n} ≠ ${O.src} 最优 ${O.best.nOrders}`)
    if (O.best.nCoupons !== undefined) assert(r.c === O.best.nCoupons, `${tag} 用券数 ${r.c} ≠ 暴力 ${O.best.nCoupons}`)
    return r
  }
  const loadPreset = async (key) => {
    const q = await seqNow()
    await page.selectOption('#cl-preset', key)
    await page.click('#cl-load-preset')
    await settle(q)
  }
  const D = ORACLE.d11

  // ── 0. 干净开局：默认就是「跨店满减 + 平台券 + 凑单品」示例 ──
  await page.goto(toolURL)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await settle()
  assert(await page.evaluate(() => CLApp.workerOn()), '计算应跑在 Web Worker 里（主线程不卡）')
  assert((await page.$$eval('#cl-items .cl-irow', (ns) => ns.length)) === 8, '默认示例应有 8 行商品')

  // ── 1. 概览条与最优性 ──
  const r1 = await checkSummary(D, 'd11')
  assert(r1.m === 'dp' && r1.proven, `d11 应走精确 DP 并证明最优，实得 ${r1.m}/${r1.proven}`)
  assert((await text('#cl-status')).includes('已证明最优'), '概览状态应写「已证明最优」')

  // ── 2. 方案页：三档价格卡、逐单实付、逐件分摊、进度条几何 ──
  await onTab('plan')
  const tiers = await page.evaluate(() => ['cl-tier-single', 'cl-tier-best', 'cl-tier-nofill'].map((id) => { const n = document.getElementById(id); return n ? [+n.dataset.paid, +n.dataset.net] : null }))
  assert(tiers[0][0] === D.single.paid, `一单结算卡 ${tiers[0][0]} ≠ ${D.single.paid}`)
  assert(tiers[1][0] === D.plan.paid && tiers[1][1] === D.best.net, `最优卡 ${tiers[1]} ≠ ${D.plan.paid}/${D.best.net}`)
  assert(tiers[2] && tiers[2][0] === D.nofill.paid && tiers[2][1] === D.nofill.net, `不加凑单品卡 ${tiers[2]} ≠ 暴力 ${D.nofill.paid}/${D.nofill.net}`)
  const featBg = await page.$eval('#cl-tier-best', (n) => getComputedStyle(n).backgroundColor)
  assert(featBg === 'rgb(193, 251, 212)', `推荐卡应是 Shopify 的 aloe 底色，实得 ${featBg}`)
  const pill = await page.$eval('#cl-copy-plan', (n) => parseFloat(getComputedStyle(n).borderTopLeftRadius))
  assert(pill >= 999, `按钮应是胶囊形，圆角 ${pill}`)
  const orders = await page.$$eval('#cl-orders .cl-order', (ns) => ns.map((n) => +n.dataset.paid))
  assert(JSON.stringify(orders) === JSON.stringify(D.plan.orders), `逐单实付 ${orders} ≠ ref ${D.plan.orders}`)
  const totals = await page.$$eval('#cl-orders .cl-order dd.cl-rtot', (ns) => ns.map((n) => n.textContent.trim()))
  assert(totals.join('|') === D.plan.orders.map(fmt).join('|'), `小票合计 ${totals} ≠ ${D.plan.orders.map(fmt)}`)
  const alloc = await page.$$eval('#cl-alloc tbody tr', (ns) => ns.map((n) => [n.dataset.u, +n.dataset.paid]))
  assert(alloc.length === D.plan.nUnits, `分摊表 ${alloc.length} 行 ≠ ${D.plan.nUnits} 件`)
  const badAlloc = alloc.filter(([u, p]) => D.plan.unitPaid[u] !== p)
  assert(badAlloc.length === 0, `逐件分摊实付与 ref 不符：${JSON.stringify(badAlloc)}`)
  assert((await text('#cl-dropped')).includes('运动袜'), '没放进方案的凑单品里应有「运动袜」')
  assert(await page.$eval('#cl-dropped-card', (n) => getComputedStyle(n).display !== 'none'), '「没放进方案的凑单品」卡应可见')
  // 第 1 单的跨店满减进度条：宽度比例 = 已到金额 / 下一档（每满 300 的下一个整倍数）
  const meter = await page.evaluate(() => {
    const m = document.querySelector('#cl-orders .cl-order .cl-meter')
    const i = m.querySelector('i').getBoundingClientRect(), b = m.querySelector('i b').getBoundingClientRect()
    return { txt: m.textContent, ratio: b.width / i.width }
  })
  const at = (Math.floor(D.plan.list0 / 30000) + 1) * 30000
  assert(meter.txt.includes('跨店满减') && meter.txt.includes(fmt(at - D.plan.list0)), `进度条文案 ${meter.txt} 应写再凑 ${fmt(at - D.plan.list0)}`)
  assert(Math.abs(meter.ratio - D.plan.list0 / at) < 0.01, `进度条比例 ${meter.ratio.toFixed(3)} ≠ ${(D.plan.list0 / at).toFixed(3)}`)
  assert((await text('#cl-proof')).includes('已证明最优'), '方案页应注明「已证明最优」')

  // ── 3. 凑单页：跳点表 = ref 逐分扫描出的门槛；图上每个跳点都有标注 ──
  const fillRows = () => page.evaluate(() => ({
    max: Math.round(+document.getElementById('cl-fill-max').value * 100),
    rows: [...document.querySelectorAll('#cl-fill-table tbody tr[data-a]')].map((r) => [+r.dataset.a, +r.dataset.d]),
    labels: [...document.querySelectorAll('#cl-fill-fig text')].filter((n) => n.textContent.includes('起多减')).length,
    key: document.getElementById('cl-fill-fig').dataset.key
  }))
  const checkFill = async (O, store, tag) => {
    const f = await fillRows()
    const exp = O.fill.find((x) => x.store === store).jumps.filter((j) => j[0] <= f.max).map((j) => [j[0], j[1]])
    assert(exp.length > 0, `${tag} 量程内应至少有一个门槛`)
    assert(JSON.stringify(f.rows) === JSON.stringify(exp), `${tag} 跳点 ${JSON.stringify(f.rows)} ≠ ref ${JSON.stringify(exp)}`)
    assert(f.labels === exp.length, `${tag} 图上「起多减」标注 ${f.labels} 个 ≠ 跳点 ${exp.length} 个（避让器不许把标注丢光）`)
  }
  await onTab('fill')
  await checkFill(D, -1, 'd11 外部店凑单')
  const same = D.fill.find((x) => x.store >= 0)
  await page.selectOption('#cl-fill-store', String(same.store))
  await page.waitForFunction((s) => document.getElementById('cl-fill-fig').dataset.key.split('|')[2] === String(s), same.store)
  await checkFill(D, same.store, 'd11 同店凑单')
  const tip = await text('#cl-fill-tip')
  assert(tip.includes('最划算') || tip.includes('白送'), `凑单建议应给出结论：${tip}`)

  // ── 4. 退货页：两种口径逐件 = ref §6 ──
  await onTab('refund')
  const rf = await page.$$eval('#cl-refund-table tbody tr[data-u]', (ns) => ns.map((n) => [+n.dataset.u, +n.dataset.prop, +n.dataset.rec, n.textContent]))
  assert(rf.length === D.refund.length, `退货表 ${rf.length} 行 ≠ ${D.refund.length}`)
  const refMap = new Map(D.refund.map((x) => [x[0], x]))
  const badRf = rf.filter((x) => { const o = refMap.get(x[0]); return !o || o[1] !== x[1] || o[2] !== x[2] })
  assert(badRf.length === 0, `退货口径与 ref 不符：${JSON.stringify(badRf.map((x) => x.slice(0, 3)))}`)
  const negRows = rf.filter((x) => x[2] < 0)
  assert(negRows.length > 0 && negRows.every((x) => x[3].includes('倒欠')), '重算退款为负的行应写「倒欠」')
  await page.click('#cl-refund-table tbody tr[data-u]')
  await page.waitForFunction(() => getComputedStyle(document.getElementById('cl-refund-detail')).display !== 'none')
  assert((await text('#cl-refund-detail')).includes('按分摊'), '退货明细卡应解释两种口径')
  await page.focus('#cl-refund-table tbody tr[data-u]:nth-child(2)')
  await page.keyboard.press('Enter')
  await page.waitForFunction(() => document.querySelector('#cl-refund-table tbody tr[data-u]:nth-child(2)').dataset.pick === '1')

  // ── 5. 改规则：最多拆 1 单 ⇒ 等于暴力在 K=1 下的最优 ──
  await onTab('promo')
  let q = await seqNow()
  await page.fill('#cl-r-max', '1')
  await settle(q)
  await checkSummary(ORACLE.d11_K1, 'K=1')
  q = await seqNow()
  await page.fill('#cl-r-max', '0')
  await settle(q)
  await checkSummary(D, '复原 K')

  // ── 6. 改价：羽绒服 699 → 649 ──
  await onTab('cart')
  q = await seqNow()
  await page.fill('#cl-items input[data-path="items.0.price"]', '649')
  await settle(q)
  await checkSummary(ORACLE.d11_price, '改价')
  q = await seqNow()
  await page.fill('#cl-items input[data-path="items.0.price"]', '699')
  await settle(q)
  await checkSummary(D, '复原价格')

  // ── 7. 加一件商品，立刻刷新：防抖存盘必须在 pagehide 补写 ──
  // 点完立刻刷新、不等防抖（300 ms）到点：只有 pagehide 补写才保得住这一行
  await page.click('#cl-add-item')
  await page.reload()
  await settle()
  assert((await page.$$eval('#cl-items .cl-irow', (ns) => ns.length)) === 9, '加商品后立刻刷新，应还是 9 行商品（pagehide 补写）')
  await checkSummary(ORACLE.d11_add, '加商品（刷新后）')

  // ── 8. 非法输入：清空单价 ⇒ 报错条可见、不出数；删掉后复原 ──
  q = await seqNow()
  await page.fill('#cl-items input[data-path="items.8.price"]', '')
  await settle(q)
  assert(await page.$eval('#cl-errs', (n) => getComputedStyle(n).display !== 'none'), '非法输入时报错条应可见（断计算样式）')
  assert((await text('#cl-errs')).includes('单价'), '报错条应指出单价')
  assert((await summary())[2] === '—', '非法输入时不该给出最优实付')
  q = await seqNow()
  await page.click('#cl-items [data-act="del-item"][data-k="8"]')
  await settle(q)
  assert(await page.$eval('#cl-errs', (n) => getComputedStyle(n).display === 'none'), '修好后报错条应隐藏（计算样式 none）')
  await checkSummary(D, '删商品后')

  // ── 9. 另外两个示例 ──
  await loadPreset('split')
  await checkSummary(ORACLE.split, 'split')
  await onTab('fill')
  // 两单都已过「满 199 减 30」（每单只减一次）、又没有跨店满减：ref 扫出来量程内没有任何门槛
  assert(ORACLE.split.fill.every((x) => x.jumps.length === 0), 'split 的 ref 跳点应为空')
  const fs0 = await fillRows()
  assert(fs0.rows.length === 0 && (await text('#cl-fill-table')).includes('没有任何额外优惠'), `split 凑单表应写「没有任何额外优惠」，实得 ${JSON.stringify(fs0.rows)}`)
  assert((await text('#cl-fill-tip')).includes('没有白送区'), 'split 凑单建议应写「没有白送区」')
  await loadPreset('beauty')
  await checkSummary(ORACLE.beauty, 'beauty')
  // 退掉「洗发水」= 个护店在这单里没东西了，运费也跟着没了：重算退款按商品实付算、不含运费
  await onTab('refund')
  const rfB = await page.$$eval('#cl-refund-table tbody tr[data-u]', (ns) => ns.map((n) => [+n.dataset.u, +n.dataset.prop, +n.dataset.rec]))
  assert(JSON.stringify(rfB) === JSON.stringify(ORACLE.beauty.refund), `beauty 退货 ${JSON.stringify(rfB)} ≠ ref ${JSON.stringify(ORACLE.beauty.refund)}`)
  // 白送区：同店再凑 10 元吃到「满 199 减 50」，加购 10–50 元都不多花钱
  q = await seqNow()
  await page.evaluate((c) => CLApp.setCart(c), ORACLE.cart.free)
  await settle(q)
  await checkSummary(ORACLE.free, '白送区（包邮门槛恰好等于合计）')
  await onTab('fill')
  const fr = ORACLE.free.fill.find((x) => x.store >= 0)
  await page.selectOption('#cl-fill-store', String(fr.store))
  await page.waitForFunction((s) => document.getElementById('cl-fill-fig').dataset.key.split('|')[2] === String(s), fr.store)
  await checkFill(ORACLE.free, fr.store, '白送区')
  assert(fr.jumps[0][1] < 0, 'ref：这个门槛处实付应不增反降')
  const bands = await page.$$eval('#cl-fill-fig rect[data-free]', (ns) => ns.map((n) => n.getBoundingClientRect().width))
  assert(bands.length > 0 && bands.every((w) => w > 1), `图上应画出白送区色带，实得 ${bands}`)
  assert((await text('#cl-fill-tip')).includes('白送区'), '凑单建议应指出白送区')
  assert((await page.$$eval('#cl-fill-table tbody tr[data-a] td', (ns) => ns.map((n) => n.textContent).join('|'))).includes('白送'), '跳点表应把这一档标成「白送」')

  // ── 10. 16 件大车：自动档给近似解，点「穷举证明」后 = HiGHS 最优 ──
  q = await seqNow()
  await page.evaluate((c) => CLApp.setCart(c), ORACLE.cart.big)
  await settle(q, 30000)
  const rb = await result()
  assert(rb.m === 'lns' && !rb.proven, `16 件大车自动档应先给近似解，实得 ${rb.m}/${rb.proven}`)
  assert((await text('#cl-status')).includes('近似'), '概览状态应写「近似最优」')
  await onTab('plan')
  assert(await page.$eval('#cl-exact', (n) => getComputedStyle(n).display !== 'none'), '应出现「穷举证明」按钮')
  q = await seqNow()
  await page.click('#cl-exact')
  await settle(q, 90000)
  const rx = await result()
  assert(rx.m === 'dp' && rx.proven, `穷举后应证明最优，实得 ${rx.m}/${rx.proven}`)
  assert(rx.b === ORACLE.big.best.benefit && rx.n === ORACLE.big.best.nOrders, `穷举结果 ${rx.b}/${rx.n} ≠ ${ORACLE.big.src} ${ORACLE.big.best.benefit}/${ORACLE.big.best.nOrders}`)
  assert((await summary())[2] === fmt(ORACLE.big.plan.paid), `大车最优实付 ≠ ${fmt(ORACLE.big.plan.paid)}`)
  assert((await text('#cl-proof')).includes('已证明最优'), '穷举后方案页应写「已证明最优」')

  // ── 11. 存档 / 撤销删除 / 分享链接 / 导入 ──
  await loadPreset('d11')
  await onTab('saved')
  await page.fill('#cl-save-name', '测试存档')
  await page.click('#cl-save')
  assert((await text('#cl-saves')).includes('测试存档'), '保存后列表里应有「测试存档」')
  await page.reload()
  await settle()
  await onTab('saved')
  assert((await text('#cl-saves')).includes('测试存档'), '刷新后存档还在')
  await loadPreset('split')
  await onTab('saved')
  q = await seqNow()
  await page.click('#cl-saves [data-act="load-save"]')
  await settle(q)
  await checkSummary(D, '载入存档')
  await onTab('saved')
  await page.click('#cl-saves [data-act="del-save"]')
  assert(!(await text('#cl-saves')).includes('测试存档'), '删除后列表里不该再有')
  await page.click('#cl-toast-act')
  assert((await text('#cl-saves')).includes('测试存档'), '撤销后存档应回来')
  const link = await page.evaluate(() => CLApp.shareLink())
  assert(link.includes('#cart='), '分享链接应带 #cart=')
  await loadPreset('split')
  await page.goto('about:blank')
  await page.goto(link)
  await settle()
  await checkSummary(D, '分享链接打开')
  const splitJson = await page.evaluate(() => JSON.stringify(CLApp.presets.split))
  await onTab('saved')
  await page.fill('#cl-import-text', splitJson)
  q = await seqNow()
  await page.click('#cl-import')
  await settle(q)
  await checkSummary(ORACLE.split, '导入 JSON')

  // ── 12. 键盘：页签可用方向键切换 ──
  await page.focus('#tab-cart')
  await onTab('cart')
  await page.keyboard.press('ArrowRight')
  assert((await page.getAttribute('#tab-promo', 'aria-selected')) === 'true', '方向键 → 应切到「优惠」页签')
  await page.keyboard.press('End')
  assert((await page.getAttribute('#tab-about', 'aria-selected')) === 'true', 'End 应切到最后一个页签')

  // ── 13. 渲染守卫（回到默认示例）──
  await loadPreset('d11')
  const tabs = ORACLE.meta.tabs
  await guardHidden(page, { assert, panesRoot: '#cl-panes', tabs })
  await guardControlSize(page, { assert, tabs, onTab, paneSel: (t) => '#pane-' + t, minControls: 120 })
  await guardTextTransform(page, { assert, tabs, onTab, paneSel: (t) => '#pane-' + t, labelSel: 'th, dt, label, .cl-cap, .cl-tag' })
  await guardOverflow(page, { assert, tabs, onTab, panesRoot: 'body', viewports: [390, 768, 1280] })
  for (const t of ['cart', 'promo', 'plan', 'fill', 'refund', 'saved']) {
    await onTab(t)
    await guardEscape(page, { assert, cardSel: '.cl-card, .cl-order, .cl-tier', childSel: 'svg,dl,h2,h3,p,ul,.cl-tscroll,.cl-irow,.cl-srow,.cl-tierrow' })
  }
  await page.setViewportSize({ width: 390, height: 900 })
  await onTab('plan')
  await guardEscape(page, { assert, cardSel: '.cl-card, .cl-order, .cl-tier', childSel: 'svg,dl,h2,h3,p,ul,.cl-tscroll' })
  // 窄屏重画后，每个跳点的标注仍要画出来（贴右边的那个改放左下）
  await onTab('fill')
  const maxNarrow = Math.round(+(await page.inputValue('#cl-fill-max')) * 100)
  const nJ = D.fill.find((x) => x.store === -1).jumps.filter((j) => j[0] <= maxNarrow).length
  await page.waitForFunction((n) => {
    const svg = document.getElementById('cl-fill-fig')
    return svg.viewBox.baseVal.width < 500 && [...svg.querySelectorAll('text')].filter((x) => x.textContent.includes('起多减')).length === n
  }, nJ, { timeout: 5000 })
  await page.setViewportSize({ width: 1280, height: 850 })
  await guardFigText(page, { assert, tabs: ['fill'], onTab, figSel: () => '#cl-fill-fig', minTextsInFig: 8 })
  await guardUniqueIds(page, { assert, minIds: 60 })
  const toastDisp = await page.$eval('#cl-toast', (n) => n.hidden ? getComputedStyle(n).display : 'none')
  assert(toastDisp === 'none', `toast 隐藏时计算样式应为 none，实得 ${toastDisp}`)

  assert(errs.length === 0, `页面错误：${errs.join(' | ')}`)

  // ── 缩略图：默认示例的方案页顶部 ──
  await page.setViewportSize({ width: 1280, height: 850 })
  await onTab('plan')
  await page.evaluate(() => window.scrollTo(0, 0))
  await screenshot('thumb.png')
}
