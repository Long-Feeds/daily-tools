// 儿童生长工作台 · 集成测试（真实 Chromium）
// 真值一律来自 ORACLE：WHO 官方 R 包 anthro / anthroplus 的公开 API（两位小数 z、异常标记、换算后身长、BMI），
// 未取整 z 用同一张 LMS 表按 WHO 公式复算、并断言它取整后 = 官方值（truth/truth.R）；由 inject-oracle.mjs 机械注入，不手抄。
import { guardHidden, guardControlSize, guardTextTransform, guardOverflow, guardEscape, guardFigText, guardUniqueIds } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const ORACLE = {
 "meta": {
  "tabs": [
   "quick",
   "kids",
   "chart",
   "height",
   "about"
  ],
  "src": "WHO 官方 R 包 anthro 1.1.0 / anthroplus 1.1.0（truth/truth.R），未取整 z 用同表 LMS 公式复算并断言取整 = 官方值"
 },
 "quick": [
  {
   "name": "S1 新生儿男",
   "input": {
    "name": "S1 新生儿男",
    "sex": 1,
    "birth": "2026-10-30",
    "date": "2026-11-01",
    "weight": 3.4,
    "lenhei": 50.1,
    "measure": "auto",
    "headc": 34.6
   },
   "out": {
    "evalDays": 2,
    "std": "who2006",
    "clenhei": 50.1,
    "cbmi": 13.5457627658854,
    "c9mo": 0,
    "lfa": {
     "z": -0.07,
     "flag": 0,
     "zr": -0.0716618991597627,
     "p": 47.1435489118221
    },
    "wfa": {
     "z": 0.13,
     "flag": 0,
     "zr": 0.127802609009315,
     "p": 55.0847407346458
    },
    "wflh": {
     "z": 0.17,
     "flag": 0,
     "zr": 0.17234492571822,
     "p": 56.8416816449326
    },
    "bfa": {
     "z": 0.12,
     "flag": 0,
     "zr": 0.121319724102879,
     "p": 54.8281101082729
    },
    "hcfa": {
     "z": -0.05,
     "flag": 0,
     "zr": -0.0495023994139277,
     "p": 48.0259462545067
    },
    "chronDays": 2
   }
  },
  {
   "name": "S2 6月女 0.05cm 插值",
   "input": {
    "name": "S2 6月女 0.05cm 插值",
    "sex": 2,
    "birth": "2026-05-01",
    "date": "2026-11-01",
    "weight": 7.05,
    "lenhei": 65.35,
    "measure": "l",
    "headc": 41.7
   },
   "out": {
    "evalDays": 184,
    "std": "who2006",
    "clenhei": 65.35,
    "cbmi": 16.5081320111998,
    "c9mo": 0,
    "lfa": {
     "z": -0.2,
     "flag": 0,
     "zr": -0.200153079191126,
     "p": 42.0680430978172
    },
    "wfa": {
     "z": -0.3,
     "flag": 0,
     "zr": -0.301261031721619,
     "p": 38.1607726765964
    },
    "wflh": {
     "z": -0.17,
     "flag": 0,
     "zr": -0.171960383726346,
     "p": 43.1734337097593
    },
    "bfa": {
     "z": -0.27,
     "flag": 0,
     "zr": -0.266406057572921,
     "p": 39.4963250242118
    },
    "hcfa": {
     "z": -0.41,
     "flag": 0,
     "zr": -0.406705415858844,
     "p": 34.2112181136278
    },
    "chronDays": 184
   }
  },
  {
   "name": "S3 18月男",
   "input": {
    "name": "S3 18月男",
    "sex": 1,
    "birth": "2025-05-01",
    "date": "2026-11-01",
    "weight": 10.9,
    "lenhei": 81.2,
    "measure": "auto",
    "headc": 47
   },
   "out": {
    "evalDays": 549,
    "std": "who2006",
    "clenhei": 81.2,
    "cbmi": 16.5315829066466,
    "c9mo": 0,
    "lfa": {
     "z": -0.41,
     "flag": 0,
     "zr": -0.405847102744409,
     "p": 34.2427473456714
    },
    "wfa": {
     "z": -0.04,
     "flag": 0,
     "zr": -0.0379485114806225,
     "p": 48.4864367156955
    },
    "wflh": {
     "z": 0.25,
     "flag": 0,
     "zr": 0.252143757366121,
     "p": 59.9535025585461
    },
    "bfa": {
     "z": 0.31,
     "flag": 0,
     "zr": 0.305711911915158,
     "p": 62.0087998561354
    },
    "hcfa": {
     "z": -0.28,
     "flag": 0,
     "zr": -0.284493691687839,
     "p": 38.8016033856006
    },
    "chronDays": 549
   }
  },
  {
   "name": "S4 30月女 卧位-0.7",
   "input": {
    "name": "S4 30月女 卧位-0.7",
    "sex": 2,
    "birth": "2024-05-01",
    "date": "2026-11-01",
    "weight": 12.6,
    "lenhei": 91.4,
    "measure": "l",
    "headc": 48.3
   },
   "out": {
    "evalDays": 914,
    "std": "who2006",
    "clenhei": 90.7,
    "cbmi": 15.3163742981515,
    "c9mo": 0,
    "lfa": {
     "z": 0,
     "flag": 0,
     "zr": -0.000538087387584847,
     "p": 49.9785334200901
    },
    "wfa": {
     "z": -0.07,
     "flag": 0,
     "zr": -0.0698345543587689,
     "p": 47.2162671951778
    },
    "wflh": {
     "z": -0.19,
     "flag": 0,
     "zr": -0.194412676278046,
     "p": 42.2926382522972
    },
    "bfa": {
     "z": -0.16,
     "flag": 0,
     "zr": -0.16230025927663,
     "p": 43.5534705257068
    },
    "hcfa": {
     "z": 0.26,
     "flag": 0,
     "zr": 0.258037337456501,
     "p": 60.1810954215682
    },
    "chronDays": 914
   }
  },
  {
   "name": "S5 4岁男 立位",
   "input": {
    "name": "S5 4岁男 立位",
    "sex": 1,
    "birth": "2022-09-15",
    "date": "2026-11-01",
    "weight": 16.2,
    "lenhei": 103.5,
    "measure": "h",
    "headc": 50.1
   },
   "out": {
    "evalDays": 1508,
    "std": "who2006",
    "clenhei": 103.5,
    "cbmi": 15.1228733459357,
    "c9mo": 0,
    "lfa": {
     "z": -0.16,
     "flag": 0,
     "zr": -0.162994245646823,
     "p": 43.5261482696368
    },
    "wfa": {
     "z": -0.19,
     "flag": 0,
     "zr": -0.192599379999633,
     "p": 42.3636365262869
    },
    "wflh": {
     "z": -0.13,
     "flag": 0,
     "zr": -0.132551183525806,
     "p": 44.7274170767086
    },
    "bfa": {
     "z": -0.15,
     "flag": 0,
     "zr": -0.148210662685513,
     "p": 44.1088258574249
    },
    "hcfa": {
     "z": -0.13,
     "flag": 0,
     "zr": -0.128433007122495,
     "p": 44.8903155770446
    },
    "chronDays": 1508
   }
  },
  {
   "name": "S6 7岁女",
   "input": {
    "name": "S6 7岁女",
    "sex": 2,
    "birth": "2019-08-20",
    "date": "2026-11-01",
    "weight": 22.8,
    "lenhei": 121.6,
    "measure": "h",
    "headc": null
   },
   "out": {
    "evalDays": 2630,
    "std": "who2007",
    "cbmi": 15.4194078947368,
    "lfa": {
     "z": -0.06,
     "flag": 0,
     "zr": -0.063573650564323,
     "p": 47.4654856546059
    },
    "wfa": {
     "z": -0.02,
     "flag": 0,
     "zr": -0.0185806435039933,
     "p": 49.2587822208741
    },
    "bfa": {
     "z": -0.02,
     "flag": 0,
     "zr": -0.0168878504684394,
     "p": 49.3263042654035
    },
    "chronDays": 2630
   }
  },
  {
   "name": "S7 12岁男 超重",
   "input": {
    "name": "S7 12岁男 超重",
    "sex": 1,
    "birth": "2014-06-10",
    "date": "2026-11-01",
    "weight": 52,
    "lenhei": 151,
    "measure": "h",
    "headc": null
   },
   "out": {
    "evalDays": 4527,
    "std": "who2007",
    "cbmi": 22.8060172799439,
    "lfa": {
     "z": -0.1,
     "flag": 0,
     "zr": -0.0980528190914874,
     "p": 46.094517591393
    },
    "bfa": {
     "z": 1.72,
     "flag": 0,
     "zr": 1.72119766633539,
     "p": 95.7392519417642
    },
    "chronDays": 4527
   }
  },
  {
   "name": "S8 17岁女",
   "input": {
    "name": "S8 17岁女",
    "sex": 2,
    "birth": "2009-07-01",
    "date": "2026-11-01",
    "weight": 54,
    "lenhei": 160.2,
    "measure": "h",
    "headc": null
   },
   "out": {
    "evalDays": 6332,
    "std": "who2007",
    "cbmi": 21.0411143374153,
    "lfa": {
     "z": -0.41,
     "flag": 0,
     "zr": -0.409875880235384,
     "p": 34.0948499784192
    },
    "bfa": {
     "z": -0.03,
     "flag": 0,
     "zr": -0.0267159583550427,
     "p": 48.9343142374385
    },
    "chronDays": 6332
   }
  },
  {
   "name": "S9 早产34+2 矫正",
   "input": {
    "name": "S9 早产34+2 矫正",
    "sex": 1,
    "birth": "2026-07-20",
    "date": "2026-11-01",
    "gaW": 34,
    "gaD": 2,
    "weight": 5,
    "lenhei": 56.8,
    "measure": "auto",
    "headc": 38.5
   },
   "out": {
    "evalDays": 64,
    "std": "who2006",
    "clenhei": 56.8,
    "cbmi": 15.4979170799445,
    "c9mo": 0,
    "lfa": {
     "z": -0.98,
     "flag": 0,
     "zr": -0.977753801159931,
     "p": 16.409805267503
    },
    "wfa": {
     "z": -1,
     "flag": 0,
     "zr": -0.998030001817696,
     "p": 15.9132405349853
    },
    "wflh": {
     "z": -0.16,
     "flag": 0,
     "zr": -0.157834643321376,
     "p": 43.7293549686836
    },
    "bfa": {
     "z": -0.66,
     "flag": 0,
     "zr": -0.655631869999191,
     "p": 25.6030507301036
    },
    "hcfa": {
     "z": -0.67,
     "flag": 0,
     "zr": -0.670725344944369,
     "p": 25.119775691255
    },
    "chronDays": 104
   }
  },
  {
   "name": "S10 极端肥胖 受限z",
   "input": {
    "name": "S10 极端肥胖 受限z",
    "sex": 1,
    "birth": "2024-11-01",
    "date": "2026-11-01",
    "weight": 17.5,
    "lenhei": 86,
    "measure": "l",
    "headc": 48
   },
   "out": {
    "evalDays": 730,
    "std": "who2006",
    "clenhei": 86,
    "cbmi": 23.6614386154678,
    "c9mo": 0,
    "lfa": {
     "z": -0.59,
     "flag": 0,
     "zr": -0.589859712065136,
     "p": 27.7642353067043
    },
    "wfa": {
     "z": 3.2,
     "flag": 0,
     "zr": 3.2002597714579,
     "p": 99.9313481122806
    },
    "wflh": {
     "z": 4.83,
     "flag": 0,
     "zr": 4.8343134755188,
     "p": 99.999933197045
    },
    "bfa": {
     "z": 4.97,
     "flag": 0,
     "zr": 4.97350916069909,
     "p": 99.9999671241674
    },
    "hcfa": {
     "z": -0.18,
     "flag": 0,
     "zr": -0.183232052269501,
     "p": 42.7307973004785
    },
    "chronDays": 730
   }
  },
  {
   "name": "S11 不满9月填立位",
   "input": {
    "name": "S11 不满9月填立位",
    "sex": 2,
    "birth": "2026-06-01",
    "date": "2026-11-01",
    "weight": 6.5,
    "lenhei": 63,
    "measure": "h",
    "headc": 40.5
   },
   "out": {
    "evalDays": 153,
    "std": "who2006",
    "clenhei": 63,
    "cbmi": 16.3769211388259,
    "c9mo": 1,
    "lfa": {
     "z": -0.49,
     "flag": 0,
     "zr": -0.485984431236988,
     "p": 31.348910217568
    },
    "wfa": {
     "z": -0.5,
     "flag": 0,
     "zr": -0.49914154873411,
     "p": 30.8839834486202
    },
    "wflh": {
     "z": -0.19,
     "flag": 0,
     "zr": -0.191713734808053,
     "p": 42.3983223366642
    },
    "bfa": {
     "z": -0.31,
     "flag": 0,
     "zr": -0.308043013555882,
     "p": 37.9024801279752
    },
    "hcfa": {
     "z": -0.76,
     "flag": 0,
     "zr": -0.761936139977798,
     "p": 22.30490595154
    },
    "chronDays": 153
   }
  },
  {
   "name": "S12 消瘦 受限z<-3",
   "input": {
    "name": "S12 消瘦 受限z<-3",
    "sex": 1,
    "birth": "2025-11-01",
    "date": "2026-11-01",
    "weight": 6.2,
    "lenhei": 74.25,
    "measure": "l",
    "headc": 45
   },
   "out": {
    "evalDays": 365,
    "std": "who2006",
    "clenhei": 74.25,
    "cbmi": 11.2460179800247,
    "c9mo": 0,
    "lfa": {
     "z": -0.63,
     "flag": 0,
     "zr": -0.626742585397725,
     "p": 26.5413992117603
    },
    "wfa": {
     "z": -3.89,
     "flag": 0,
     "zr": -3.89110315025765,
     "p": 0.00498947482098359
    },
    "wflh": {
     "z": -4.97,
     "flag": 0,
     "zr": -4.97288516045964,
     "p": 0.0000329818701491395
    },
    "bfa": {
     "z": -5.06,
     "flag": 1,
     "zr": -5.05941653245584,
     "p": 0.0000210270655829495
    },
    "hcfa": {
     "z": -0.83,
     "flag": 0,
     "zr": -0.827964708944952,
     "p": 20.3845243234827
    },
    "chronDays": 365
   }
  },
  {
   "name": "S14 59.5月 2006标准最后几天",
   "input": {
    "name": "S14 59.5月 2006标准最后几天",
    "sex": 1,
    "birth": "2021-11-16",
    "date": "2026-11-01",
    "weight": 18.6,
    "lenhei": 110.2,
    "measure": "h",
    "headc": 51
   },
   "out": {
    "evalDays": 1811,
    "std": "who2006",
    "clenhei": 110.2,
    "cbmi": 15.3161550851282,
    "c9mo": 0,
    "lfa": {
     "z": 0.11,
     "flag": 0,
     "zr": 0.110491128299006,
     "p": 54.3990057308482
    },
    "wfa": {
     "z": 0.14,
     "flag": 0,
     "zr": 0.138929899558245,
     "p": 55.5247228176057
    },
    "wflh": {
     "z": 0.01,
     "flag": 0,
     "zr": 0.00787137489471479,
     "p": 50.3140191823407
    },
    "bfa": {
     "z": 0.09,
     "flag": 0,
     "zr": 0.0906580300297791,
     "p": 53.6117839785328
    },
    "hcfa": {
     "z": 0.19,
     "flag": 0,
     "zr": 0.1888639999177,
     "p": 57.4900295177287
    },
    "chronDays": 1811
   }
  },
  {
   "name": "S15 刚满60月 换2007参考",
   "input": {
    "name": "S15 刚满60月 换2007参考",
    "sex": 2,
    "birth": "2021-10-31",
    "date": "2026-11-01",
    "weight": 17.9,
    "lenhei": 108.4,
    "measure": "h",
    "headc": 49.8
   },
   "out": {
    "evalDays": 1827,
    "std": "who2007",
    "cbmi": 15.2333165398075,
    "lfa": {
     "z": -0.14,
     "flag": 0,
     "zr": -0.144594601030183,
     "p": 44.2515480094557
    },
    "wfa": {
     "z": -0.07,
     "flag": 0,
     "zr": -0.0730068431480116,
     "p": 47.0900336000156
    },
    "bfa": {
     "z": -0.01,
     "flag": 0,
     "zr": -0.00813381925889732,
     "p": 49.6755111376295
    },
    "chronDays": 1827
   }
  },
  {
   "name": "S13 录入错误标记",
   "input": {
    "name": "S13 录入错误标记",
    "sex": 2,
    "birth": "2023-11-01",
    "date": "2026-11-01",
    "weight": 45,
    "lenhei": 95,
    "measure": "h",
    "headc": null
   },
   "out": {
    "evalDays": 1096,
    "std": "who2006",
    "clenhei": 95,
    "cbmi": 49.8614958448753,
    "c9mo": 0,
    "lfa": {
     "z": -0.02,
     "flag": 0,
     "zr": -0.0150172935003808,
     "p": 49.4009191859961
    },
    "wfa": {
     "z": 11.55,
     "flag": 1,
     "zr": 11.5510648081652,
     "p": 100
    },
    "wflh": {
     "z": 18.37,
     "flag": 1,
     "zr": 18.3742480367857,
     "p": 100
    },
    "bfa": {
     "z": 18.72,
     "flag": 1,
     "zr": 18.7223084442336,
     "p": 100
    },
    "chronDays": 1096
   }
  }
 ],
 "demo": {
  "demo-mili": [
   {
    "evalDays": 0,
    "std": "who2006",
    "clenhei": 49.6,
    "cbmi": 13.0072840790843,
    "c9mo": 0,
    "lfa": {
     "z": 0.24,
     "flag": 0,
     "zr": 0.242819845879138,
     "p": 59.5927519590817
    },
    "wfa": {
     "z": -0.07,
     "flag": 0,
     "zr": -0.070518261494057,
     "p": 47.1890583080805
    },
    "wflh": {
     "z": -0.25,
     "flag": 0,
     "zr": -0.245485804842891,
     "p": 40.304014903303
    },
    "bfa": {
     "z": -0.27,
     "flag": 0,
     "zr": -0.269627093790328,
     "p": 39.3723577115166
    },
    "hcfa": {
     "z": 0.1,
     "flag": 0,
     "zr": 0.102414780787552,
     "p": 54.0786274005335
    },
    "id": "m0",
    "chronDays": 0
   },
   {
    "evalDays": 31,
    "std": "who2006",
    "clenhei": 54,
    "cbmi": 14.7462277091907,
    "c9mo": 0,
    "lfa": {
     "z": 0.12,
     "flag": 0,
     "zr": 0.124202114037793,
     "p": 54.9422375779441
    },
    "wfa": {
     "z": 0.16,
     "flag": 0,
     "zr": 0.158956303799525,
     "p": 56.3148349728387
    },
    "wflh": {
     "z": 0.03,
     "flag": 0,
     "zr": 0.031966452976581,
     "p": 51.2750598067996
    },
    "bfa": {
     "z": 0.1,
     "flag": 0,
     "zr": 0.104304136543388,
     "p": 54.1536002332766
    },
    "hcfa": {
     "z": 0.27,
     "flag": 0,
     "zr": 0.268654216328522,
     "p": 60.5902106563156
    },
    "id": "m1",
    "chronDays": 31
   },
   {
    "evalDays": 92,
    "std": "who2006",
    "clenhei": 60.2,
    "cbmi": 16.2801735080187,
    "c9mo": 0,
    "lfa": {
     "z": 0.16,
     "flag": 0,
     "zr": 0.161932388152073,
     "p": 56.4320451325099
    },
    "wfa": {
     "z": 0.05,
     "flag": 0,
     "zr": 0.0536709264949248,
     "p": 52.1401326650198
    },
    "wflh": {
     "z": -0.05,
     "flag": 0,
     "zr": -0.0466846241988605,
     "p": 48.1382292547854
    },
    "bfa": {
     "z": -0.06,
     "flag": 0,
     "zr": -0.0573497634876194,
     "p": 47.7133290010842
    },
    "hcfa": {
     "z": 0.03,
     "flag": 0,
     "zr": 0.0332489850324691,
     "p": 51.3261982355668
    },
    "id": "m2",
    "chronDays": 92
   },
   {
    "evalDays": 184,
    "std": "who2006",
    "clenhei": 66,
    "cbmi": 16.7584940312213,
    "c9mo": 0,
    "lfa": {
     "z": 0.09,
     "flag": 0,
     "zr": 0.0864096993864713,
     "p": 53.4429631611933
    },
    "wfa": {
     "z": -0.02,
     "flag": 0,
     "zr": -0.0152549881345879,
     "p": 49.3914376282652
    },
    "wflh": {
     "z": -0.01,
     "flag": 0,
     "zr": -0.0114243892776503,
     "p": 49.5442427229467
    },
    "bfa": {
     "z": -0.1,
     "flag": 0,
     "zr": -0.0993712674048323,
     "p": 46.0421747557885
    },
    "hcfa": {
     "z": -0.18,
     "flag": 0,
     "zr": -0.176581642268401,
     "p": 42.9918507411306
    },
    "id": "m3",
    "chronDays": 184
   },
   {
    "evalDays": 275,
    "std": "who2006",
    "clenhei": 70.4,
    "cbmi": 16.5450671487603,
    "c9mo": 0,
    "lfa": {
     "z": 0.09,
     "flag": 0,
     "zr": 0.0864158186792824,
     "p": 53.4432063758967
    },
    "wfa": {
     "z": -0.03,
     "flag": 0,
     "zr": -0.0345272351893837,
     "p": 48.6228362375598
    },
    "wflh": {
     "z": -0.06,
     "flag": 0,
     "zr": -0.0601813718193503,
     "p": 47.6005590977322
    },
    "bfa": {
     "z": -0.13,
     "flag": 0,
     "zr": -0.129640111387996,
     "p": 44.8425583360802
    },
    "hcfa": {
     "z": -0.26,
     "flag": 0,
     "zr": -0.257734298126193,
     "p": 39.830598701606
    },
    "id": "m4",
    "chronDays": 275
   },
   {
    "evalDays": 366,
    "std": "who2006",
    "clenhei": 74.3,
    "cbmi": 16.8463306699224,
    "c9mo": 0,
    "lfa": {
     "z": 0.1,
     "flag": 0,
     "zr": 0.0989507482759012,
     "p": 53.9411312357036
    },
    "wfa": {
     "z": 0.31,
     "flag": 0,
     "zr": 0.308225108904446,
     "p": 62.1044476111527
    },
    "wflh": {
     "z": 0.34,
     "flag": 0,
     "zr": 0.340443046904796,
     "p": 63.3238547090475
    },
    "bfa": {
     "z": 0.34,
     "flag": 0,
     "zr": 0.335647166025598,
     "p": 63.1431524035411
    },
    "hcfa": {
     "z": -0.08,
     "flag": 0,
     "zr": -0.0762929148206858,
     "p": 46.9593031285401
    },
    "id": "m5",
    "chronDays": 366
   },
   {
    "evalDays": 550,
    "std": "who2006",
    "clenhei": 80.5,
    "cbmi": 13.8883530727981,
    "c9mo": 0,
    "lfa": {
     "z": -0.1,
     "flag": 0,
     "zr": -0.0960435821223189,
     "p": 46.1742979500631
    },
    "wfa": {
     "z": -1.07,
     "flag": 0,
     "zr": -1.07164428410904,
     "p": 14.1939917397468
    },
    "wflh": {
     "z": -1.43,
     "flag": 0,
     "zr": -1.42545185980967,
     "p": 7.70133131576881
    },
    "bfa": {
     "z": -1.48,
     "flag": 0,
     "zr": -1.47853610609749,
     "p": 6.96321701471123
    },
    "hcfa": {
     "z": -0.18,
     "flag": 0,
     "zr": -0.184419734985715,
     "p": 42.6842094527955
    },
    "id": "m6",
    "chronDays": 550
   },
   {
    "evalDays": 731,
    "std": "who2006",
    "clenhei": 85.4,
    "cbmi": 15.4939696921499,
    "c9mo": 0,
    "lfa": {
     "z": -0.1,
     "flag": 0,
     "zr": -0.102235184162952,
     "p": 45.9285000566399
    },
    "wfa": {
     "z": -0.13,
     "flag": 0,
     "zr": -0.128484436209365,
     "p": 44.8882807120867
    },
    "wflh": {
     "z": -0.19,
     "flag": 0,
     "zr": -0.191504240264977,
     "p": 42.4065279384172
    },
    "bfa": {
     "z": -0.15,
     "flag": 0,
     "zr": -0.147808540372015,
     "p": 44.1246934567354
    },
    "hcfa": {
     "z": -0.2,
     "flag": 0,
     "zr": -0.203906743548279,
     "p": 41.9213187602127
    },
    "id": "m7",
    "chronDays": 731
   },
   {
    "evalDays": 915,
    "std": "who2006",
    "clenhei": 89.8,
    "cbmi": 15.2529005312474,
    "c9mo": 0,
    "lfa": {
     "z": -0.26,
     "flag": 0,
     "zr": -0.262446005923454,
     "p": 39.6488803847199
    },
    "wfa": {
     "z": -0.27,
     "flag": 0,
     "zr": -0.266569434533148,
     "p": 39.4900345989125
    },
    "wflh": {
     "z": -0.27,
     "flag": 0,
     "zr": -0.268591370943334,
     "p": 39.4122076677795
    },
    "bfa": {
     "z": -0.21,
     "flag": 0,
     "zr": -0.211305850662559,
     "p": 41.632430891472
    },
    "hcfa": {
     "z": -0.24,
     "flag": 0,
     "zr": -0.242301275071308,
     "p": 40.4273362922174
    },
    "id": "m8",
    "chronDays": 915
   },
   {
    "evalDays": 1096,
    "std": "who2006",
    "clenhei": 94.2,
    "cbmi": 14.9882122781632,
    "c9mo": 0,
    "lfa": {
     "z": -0.23,
     "flag": 0,
     "zr": -0.225049370428794,
     "p": 41.0970433583344
    },
    "wfa": {
     "z": -0.32,
     "flag": 0,
     "zr": -0.316693413490243,
     "p": 37.5738123511246
    },
    "wflh": {
     "z": -0.32,
     "flag": 0,
     "zr": -0.32387137185652,
     "p": 37.3017709368127
    },
    "bfa": {
     "z": -0.32,
     "flag": 0,
     "zr": -0.317388363685951,
     "p": 37.547446778936
    },
    "hcfa": {
     "z": -0.29,
     "flag": 0,
     "zr": -0.290663787404702,
     "p": 38.5654234902546
    },
    "id": "m9",
    "chronDays": 1096
   },
   {
    "evalDays": 1280,
    "std": "who2006",
    "clenhei": 98,
    "cbmi": 14.7855060391504,
    "c9mo": 0,
    "lfa": {
     "z": -0.27,
     "flag": 0,
     "zr": -0.265204611660471,
     "p": 39.5425921238449
    },
    "wfa": {
     "z": -0.4,
     "flag": 0,
     "zr": -0.404506190819422,
     "p": 34.2920263175498
    },
    "wflh": {
     "z": -0.36,
     "flag": 0,
     "zr": -0.363347436930089,
     "p": 35.8172680808356
    },
    "bfa": {
     "z": -0.4,
     "flag": 0,
     "zr": -0.400103082735315,
     "p": 34.4540296878986
    },
    "hcfa": {
     "z": -0.33,
     "flag": 0,
     "zr": -0.329195627737287,
     "p": 37.1003913748204
    },
    "id": "m10",
    "chronDays": 1280
   }
  ],
  "demo-doudou": [
   {
    "id": "d0",
    "preTerm": true
   },
   {
    "evalDays": 4,
    "std": "who2006",
    "clenhei": 49.8,
    "cbmi": 13.3062369961775,
    "c9mo": 0,
    "lfa": {
     "z": -0.41,
     "flag": 0,
     "zr": -0.414731825449863,
     "p": 33.9169115868806
    },
    "wfa": {
     "z": -0.19,
     "flag": 0,
     "zr": -0.186445455956655,
     "p": 42.6047724304339
    },
    "wflh": {
     "z": 0.04,
     "flag": 0,
     "zr": 0.0432856997009355,
     "p": 51.7263104737996
    },
    "bfa": {
     "z": -0.05,
     "flag": 0,
     "zr": -0.0490641798766263,
     "p": 48.0434074663707
    },
    "hcfa": {
     "z": -0.21,
     "flag": 0,
     "zr": -0.21142744358865,
     "p": 41.6276871923459
    },
    "id": "d1",
    "chronDays": 49
   },
   {
    "evalDays": 47,
    "std": "who2006",
    "clenhei": 55.6,
    "cbmi": 15.5271466280213,
    "c9mo": 0,
    "lfa": {
     "z": -0.63,
     "flag": 0,
     "zr": -0.630627049464594,
     "p": 26.4142204082804
    },
    "wfa": {
     "z": -0.49,
     "flag": 0,
     "zr": -0.488753988659534,
     "p": 31.2507938137489
    },
    "wflh": {
     "z": 0.2,
     "flag": 0,
     "zr": 0.200733492847447,
     "p": 57.9546515394936
    },
    "bfa": {
     "z": -0.22,
     "flag": 0,
     "zr": -0.222882523008742,
     "p": 41.1813469444233
    },
    "hcfa": {
     "z": -0.48,
     "flag": 0,
     "zr": -0.483430806619176,
     "p": 31.4394939348228
    },
    "id": "d2",
    "chronDays": 92
   },
   {
    "evalDays": 138,
    "std": "who2006",
    "clenhei": 62.8,
    "cbmi": 16.9885188040083,
    "c9mo": 0,
    "lfa": {
     "z": -1.05,
     "flag": 0,
     "zr": -1.05229687866698,
     "p": 14.6331681651414
    },
    "wfa": {
     "z": -0.75,
     "flag": 0,
     "zr": -0.745675238644925,
     "p": 22.7931810250199
    },
    "wflh": {
     "z": -0.05,
     "flag": 0,
     "zr": -0.051253165284329,
     "p": 47.9561893854228
    },
    "bfa": {
     "z": -0.18,
     "flag": 0,
     "zr": -0.177479204277213,
     "p": 42.9565999256047
    },
    "hcfa": {
     "z": -0.79,
     "flag": 0,
     "zr": -0.788466559914406,
     "p": 21.5211925616648
    },
    "id": "d3",
    "chronDays": 183
   },
   {
    "evalDays": 228,
    "std": "who2006",
    "clenhei": 68.4,
    "cbmi": 17.0992784104511,
    "c9mo": 0,
    "lfa": {
     "z": -0.68,
     "flag": 0,
     "zr": -0.675852910433033,
     "p": 24.9567018826098
    },
    "wfa": {
     "z": -0.51,
     "flag": 0,
     "zr": -0.509515372172815,
     "p": 30.5195513063708
    },
    "wflh": {
     "z": -0.09,
     "flag": 0,
     "zr": -0.0892583046289639,
     "p": 46.4438314920799
    },
    "bfa": {
     "z": -0.15,
     "flag": 0,
     "zr": -0.145134908282704,
     "p": 44.2302178623904
    },
    "hcfa": {
     "z": -0.69,
     "flag": 0,
     "zr": -0.694979909892261,
     "p": 24.3533945954984
    },
    "id": "d4",
    "chronDays": 273
   },
   {
    "evalDays": 320,
    "std": "who2006",
    "clenhei": 72.5,
    "cbmi": 16.9322235434007,
    "c9mo": 0,
    "lfa": {
     "z": -0.62,
     "flag": 0,
     "zr": -0.621159656210526,
     "p": 26.7247290530202
    },
    "wfa": {
     "z": -0.4,
     "flag": 0,
     "zr": -0.39632676644193,
     "p": 34.5931991856651
    },
    "wflh": {
     "z": -0.11,
     "flag": 0,
     "zr": -0.10685863284136,
     "p": 45.7450565714182
    },
    "bfa": {
     "z": -0.04,
     "flag": 0,
     "zr": -0.0386718685946036,
     "p": 48.4576001117492
    },
    "hcfa": {
     "z": -0.62,
     "flag": 0,
     "zr": -0.622779254526411,
     "p": 26.6714796417055
    },
    "id": "d5",
    "chronDays": 365
   },
   {
    "evalDays": 461,
    "std": "who2006",
    "clenhei": 77.6,
    "cbmi": 16.4403762355192,
    "c9mo": 0,
    "lfa": {
     "z": -0.67,
     "flag": 0,
     "zr": -0.671081169690932,
     "p": 25.108441101333
    },
    "wfa": {
     "z": -0.4,
     "flag": 0,
     "zr": -0.396208178334727,
     "p": 34.5975729262999
    },
    "wflh": {
     "z": -0.13,
     "flag": 0,
     "zr": -0.131670163339923,
     "p": 44.7622593104828
    },
    "bfa": {
     "z": 0.01,
     "flag": 0,
     "zr": 0.0119488978147721,
     "p": 50.4766807111171
    },
    "hcfa": {
     "z": -0.64,
     "flag": 0,
     "zr": -0.639530945163332,
     "p": 26.1238794602424
    },
    "id": "d6",
    "chronDays": 506
   }
  ]
 },
 "height": [
  {
   "sex": 1,
   "father": 175,
   "mother": 162,
   "mph": 175,
   "lo": 166.5,
   "hi": 183.5,
   "z": -0.21
  },
  {
   "sex": 2,
   "father": 176,
   "mother": 161,
   "mph": 162,
   "lo": 153.5,
   "hi": 170.5,
   "z": -0.18
  },
  {
   "sex": 2,
   "father": 158.5,
   "mother": 149,
   "mph": 147.25,
   "lo": 138.75,
   "hi": 155.75,
   "z": -2.43
  },
  {
   "sex": 1,
   "father": 190,
   "mother": 175,
   "mph": 189,
   "lo": 180.5,
   "hi": 197.5,
   "z": 1.71
  }
 ],
 "proj": {
  "z": -0.27,
  "adult": 161.38876349836
 }
};

const IND = ['lfa', 'wfa', 'wflh', 'bfa', 'hcfa']
// 主百分位线 P3 P15 P50 P85 P97 的 z（R: qnorm(c(.03,.15,.5,.85,.97))）
const PCT_Z = [-1.880793608151251, -1.0364333894937898, 0, 1.0364333894937898, 1.880793608151251]
const fmtZ = (z) => (z > 0 ? '+' + z.toFixed(2) : z < 0 ? '−' + Math.abs(z).toFixed(2) : '0.00')
const fmtP = (p) => (p < 0.1 ? '< 0.1' : p > 99.9 ? '> 99.9' : p.toFixed(1))
/** WHO 判读口径（照「算法与说明」页的文字独立写一遍，用来核对页面给的分类码） */
function whoCode(ind, z, std) {
  const five = std === 'who2007'
  if (ind === 'lfa') return z < -3 ? 'severe-stunted' : z < -2 ? 'stunted' : z > 3 ? 'very-tall' : 'normal'
  if (ind === 'wfa') return z < -3 ? 'severe-under' : z < -2 ? 'under' : z > 1 ? 'check-wfl' : 'normal'
  if (ind === 'hcfa') return z < -2 ? 'small-hc' : z > 2 ? 'large-hc' : 'normal'
  if (z < -3) return 'severe-wasted'
  if (z < -2) return 'wasted'
  if (five) return z > 2 ? 'obese' : z > 1 ? 'overweight' : 'normal'
  return z > 3 ? 'obese' : z > 2 ? 'overweight' : z > 1 ? 'risk-over' : 'normal'
}
const crossed = (a, b) => PCT_Z.filter((t) => t > Math.min(a, b) && t < Math.max(a, b)).length

export default async ({ page, toolURL, screenshot, assert }) => {
  let nAssert = 0
  const ok = (c, m) => { nAssert++; assert(c, m) }
  const near = (a, b, tol, m) => ok(Math.abs(a - b) <= tol, `${m}：${a} vs ${b}（容差 ${tol}）`)
  const onTab = async (t) => {
    await page.click('#gl-tab-' + t)
    await page.waitForFunction((t) => !document.getElementById('pane-' + t).hidden && document.getElementById('gl-tab-' + t).getAttribute('aria-selected') === 'true', t)
  }

  await page.goto(toolURL)
  await page.waitForFunction(() => window.GLApp && document.querySelectorAll('#gl-kids .gl-kid').length > 0)
  ok((await page.getAttribute('#gl-back', 'href')) === '../../', '顶部返回链接指向 ../../')
  ok((await page.$$eval('#gl-kids .gl-kid', (ns) => ns.length)) === 2, '首次打开自动载入 2 份示例档案')

  // ───────── 1. 速算：13 个场景逐项对 WHO R 包 ─────────
  await onTab('quick')
  for (const sc of ORACLE.quick) {
    const i = sc.input, o = sc.out
    await page.check(i.sex === 2 ? '#gl-q-sex-f' : '#gl-q-sex-m')
    await page.fill('#gl-q-birth', i.birth)
    await page.fill('#gl-q-date', i.date)
    await page.fill('#gl-q-weight', i.weight == null ? '' : String(i.weight))
    await page.fill('#gl-q-len', i.lenhei == null ? '' : String(i.lenhei))
    await page.fill('#gl-q-hc', i.headc == null ? '' : String(i.headc))
    await page.selectOption('#gl-q-meas', i.measure || 'auto')
    await page.fill('#gl-q-gaw', i.gaW == null ? '' : String(i.gaW))
    await page.fill('#gl-q-gad', i.gaD == null ? '' : String(i.gaD))
    await page.setChecked('#gl-q-oed', false)
    const sig = JSON.stringify([i.sex, i.birth, i.date, i.weight ?? null, i.lenhei ?? null, i.headc ?? null, i.measure || 'auto', i.gaW ?? null, i.gaD ?? 0, false])
    await page.waitForFunction((sig) => document.getElementById('gl-q-res').dataset.sig === sig, sig, { timeout: 10000 })
    const cards = await page.$$eval('#gl-q-res .gl-ic', (ns) => ns.map((n) => {
      const r = { ind: n.dataset.ind, valid: n.dataset.valid, z: n.dataset.z, p: n.dataset.p, flag: n.dataset.flag,
        zv: n.querySelector('.gl-zv')?.textContent, pv: n.querySelector('.gl-pv')?.textContent,
        code: n.querySelector('.gl-cat')?.dataset.code, why: n.querySelector('.gl-why')?.textContent || '' }
      const g = n.querySelector('.gl-gauge')
      if (g) {
        const t = g.querySelector('.gl-gauge-track').getBoundingClientRect(), d = g.querySelector('.gl-gauge-dot').getBoundingClientRect()
        r.gauge = (d.left + d.width / 2 - t.left) / t.width
      }
      return r
    }))
    ok(cards.length === 5, `${sc.name}：5 张指标卡`)
    for (const c of cards) {
      const t = o[c.ind]
      if (!t) { ok(c.valid === '0', `${sc.name} ${c.ind}：R 判为不可算，页面也应不可算（实得 valid=${c.valid}）`); continue }
      ok(c.valid === '1', `${sc.name} ${c.ind}：应可算`)
      ok(Number(c.z) === t.z, `${sc.name} ${c.ind} z = R ${t.z}（页面 ${c.z}）`)
      ok(Number(c.flag) === t.flag, `${sc.name} ${c.ind} 异常标记 = R ${t.flag}`)
      near(Number(c.p), t.p, 1e-8, `${sc.name} ${c.ind} 百分位 = R pnorm(未取整 z)`)
      ok(c.zv === fmtZ(t.z), `${sc.name} ${c.ind} 显示的 z「${c.zv}」= ${fmtZ(t.z)}`)
      ok(c.pv === fmtP(t.p), `${sc.name} ${c.ind} 显示的百分位「${c.pv}」= ${fmtP(t.p)}`)
      ok(c.code === whoCode(c.ind, t.z, o.std), `${sc.name} ${c.ind} 分类 ${c.code} = ${whoCode(c.ind, t.z, o.std)}`)
      // 几何：刻度条上的点落在 (clamp(z,−4,4)+4)/8 处
      near(c.gauge, (Math.max(-4, Math.min(4, t.z)) + 4) / 8, 0.012, `${sc.name} ${c.ind} 刻度条点位`)
    }
    const std = await page.getAttribute('#gl-q-std', 'data-std')
    ok(std === o.std, `${sc.name} 标准 ${std} = ${o.std}`)
    if (o.evalDays !== o.chronDays) {
      ok(Number(await page.getAttribute('#gl-q-age-corr', 'data-days')) === o.evalDays, `${sc.name} 矫正日龄 = ${o.evalDays}`)
    } else {
      ok((await page.$('#gl-q-age-corr')) === null, `${sc.name} 足月 / 已满 2 岁不显示矫正年龄`)
    }
    ok(Number(await page.getAttribute('#gl-q-age-chron', 'data-days')) === o.chronDays, `${sc.name} 实际日龄 = ${o.chronDays}`)
    const notes = await page.textContent('#gl-q-notes')
    if (o.c9mo === 1) ok(notes.includes('“立位”与年龄不符'), `${sc.name} 提示不满 9 个月填了立位`)
    if (o.std === 'who2006' && i.lenhei != null && Math.abs(o.clenhei - i.lenhei) > 1e-9) ok(notes.includes('换算为 ' + o.clenhei.toFixed(1) + ' cm'), `${sc.name} 提示 0.7 cm 换算为 ${o.clenhei}`)
    if (IND.some((k) => o[k] && o[k].flag === 1)) ok(notes.includes('生物学上可能的范围'), `${sc.name} 异常值提示`)
    if (o.std === 'who2007') {
      const wf = cards.find((c) => c.ind === 'wflh'), hc = cards.find((c) => c.ind === 'hcfa')
      ok(wf.why.includes('5 岁以上'), `${sc.name} 体重-身高不可算的原因`)
      ok(hc.why.includes('只到 5 岁'), `${sc.name} 头围不可算的原因`)
      if (!o.wfa) ok(cards.find((c) => c.ind === 'wfa').why.includes('10 岁'), `${sc.name} 体重-年龄只到 10 岁`)
    }
  }
  // 非法输入
  await page.fill('#gl-q-weight', '-3')
  await page.waitForFunction(() => document.getElementById('gl-q-weight').getAttribute('aria-invalid') === 'true')
  ok((await page.textContent('#gl-q-msg')).includes('体重应在'), '负体重给出错误提示')
  await page.fill('#gl-q-date', '2020-01-01')
  await page.waitForFunction(() => document.getElementById('gl-q-res').dataset.ready === '0')
  ok((await page.textContent('#gl-q-msg')).includes('早于出生日期'), '测量日期早于出生日期时报错')
  await page.fill('#gl-q-weight', '')

  // 速算存进新档案：最后一个场景（S13）
  const last = ORACLE.quick[ORACLE.quick.length - 1]
  await page.fill('#gl-q-date', last.input.date)
  await page.fill('#gl-q-weight', String(last.input.weight))
  await page.waitForFunction(() => document.getElementById('gl-q-res').dataset.ready === '1')
  await page.selectOption('#gl-q-kid', '')
  await page.click('#gl-q-save')
  await page.waitForFunction(() => window.GLApp.state().kids.length === 3)
  ok((await page.textContent('#gl-q-msg')).includes('已存入'), '速算结果存入新档案')

  // ───────── 2. 成长档案：示例档案逐条对 R ─────────
  await onTab('kids')
  for (const kidId of ['demo-mili', 'demo-doudou']) {
    await page.click(`#gl-kids .gl-kid[data-id="${kidId}"]`)
    await page.waitForFunction((id) => document.querySelector(`#gl-kids .gl-kid[data-id="${id}"]`).getAttribute('aria-pressed') === 'true', kidId)
    const truth = ORACLE.demo[kidId]
    const rows = await page.$$eval('#gl-rows tbody tr[data-id]', (trs) => trs.map((tr) => ({
      id: tr.dataset.id, age: tr.children[1].textContent,
      z: Object.fromEntries(Array.from(tr.querySelectorAll('.gl-zc')).map((s) => [s.dataset.ind, s.dataset.z == null ? null : Number(s.dataset.z)]))
    })))
    ok(rows.length === truth.length, `${kidId}：${truth.length} 条记录`)
    for (const t of truth) {
      const r = rows.find((x) => x.id === t.id)
      ok(!!r, `${kidId} 记录 ${t.id} 在表里`)
      if (t.preTerm) { ok(r.age.includes('未到预产期') && IND.every((k) => r.z[k] == null), `${kidId} ${t.id}：未到预产期不评价`); continue }
      for (const k of IND) ok(r.z[k] === (t[k] ? t[k].z : null), `${kidId} ${t.id} ${k} z ${r.z[k]} = R ${t[k] ? t[k].z : null}`)
    }
    // 提醒条数：相邻两次在 lfa / wfa / bfa / wflh 任一项上跨过 ≥ 2 条主百分位线
    const valid = truth.filter((t) => !t.preTerm)
    let expect = 0
    for (let j = 1; j < valid.length; j++) {
      if (['lfa', 'wfa', 'bfa', 'wflh'].some((k) => valid[j - 1][k] && valid[j][k] && crossed(valid[j - 1][k].z, valid[j][k].z) >= 2)) expect++
    }
    ok(Number(await page.getAttribute('#gl-trend', 'data-alerts')) === expect, `${kidId} 跨线提醒 ${expect} 条`)
    if (kidId === 'demo-mili') ok(expect === 1, '示例小米粒：1 岁 → 18 月腹泻掉线（体重 / BMI / 体重-身长各跨 2 条线）提醒一次')
  }
  // 新档案（速算存进来的）+ 表单校验 + 新增 / 删除记录 + 刷新后仍在
  const newId = await page.evaluate(() => window.GLApp.state().kids[2].id)
  await page.click(`#gl-kids .gl-kid[data-id="${newId}"]`)
  await page.waitForFunction((id) => window.GLApp.state().active === id, newId)
  await page.fill('#gl-kf-name', '')
  await page.click('#gl-kf-save')
  ok((await page.textContent('#gl-kid-msg')).includes('请填名字'), '名字为空时拒绝保存')
  await page.fill('#gl-kf-name', '测试宝宝')
  await page.fill('#gl-kf-father', '80')
  await page.click('#gl-kf-save')
  ok((await page.textContent('#gl-kid-msg')).includes('爸爸身高'), '爸爸身高越界时拒绝保存')
  await page.fill('#gl-kf-father', '170')
  await page.fill('#gl-kf-mother', '158')
  await page.click('#gl-kf-save')
  await page.waitForFunction((id) => window.GLApp.state().kids.find((k) => k.id === id).name === '测试宝宝', newId)
  // 同一孩子再加一条（用 S13 的出生日期，换个日期与数值，z 只断「有」，数值由速算那组断过）
  await page.fill('#gl-m-date', '2026-05-01')
  await page.fill('#gl-m-weight', '13.1')
  await page.fill('#gl-m-len', '93.0')
  await page.selectOption('#gl-m-meas', 'h')
  await page.click('#gl-m-add')
  await page.waitForFunction((id) => window.GLApp.state().kids.find((k) => k.id === id).rows.length === 2, newId)
  await page.reload()
  await page.waitForFunction(() => window.GLApp && window.GLApp.state().kids.length === 3)
  const kNew = await page.evaluate((id) => window.GLApp.state().kids.find((k) => k.id === id), newId)
  ok(kNew && kNew.rows.length === 2 && kNew.name === '测试宝宝' && kNew.father === 170, '新增记录与改名后立刻刷新仍在（同步写盘）')
  await onTab('kids')
  await page.click(`#gl-kids .gl-kid[data-id="${newId}"]`)
  await page.waitForFunction((id) => window.GLApp.state().active === id, newId)
  await page.click('#gl-rows .gl-row-del >> nth=0')
  await page.waitForFunction((id) => window.GLApp.state().kids.find((k) => k.id === id).rows.length === 1, newId)
  ok(true, '删除一条记录')
  // 导出 JSON → 改名 → 导入回来（合并）
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#gl-exp-json')])
  const fs = await import('node:fs')
  const backup = JSON.parse(fs.readFileSync(await dl.path(), 'utf8'))
  ok(backup.app === 'growth-lab' && backup.kids.length === 3, '导出 JSON 含 3 份档案')
  backup.kids = [backup.kids[0]]
  backup.kids[0].id = 'imported-1'; backup.kids[0].name = '导入的小米粒'
  await page.setInputFiles('#gl-imp-file', { name: 'b.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) })
  await page.waitForFunction(() => window.GLApp.state().kids.length === 4)
  ok((await page.textContent('#gl-kid-msg')).includes('已导入 1 份档案、11 条记录'), '导入 JSON：1 份档案 11 条记录')
  await page.setInputFiles('#gl-imp-file', { name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"kids":') })
  await page.waitForFunction(() => document.getElementById('gl-kid-msg').textContent.includes('不是有效的 JSON'))
  ok(true, '坏 JSON 被拒绝')
  // CSV：小米粒
  await page.click('#gl-kids .gl-kid[data-id="demo-mili"]')
  await page.waitForFunction(() => window.GLApp.state().active === 'demo-mili')
  const [dc] = await Promise.all([page.waitForEvent('download'), page.click('#gl-exp-csv')])
  const csv = fs.readFileSync(await dc.path(), 'utf8')
  ok(csv.charCodeAt(0) === 0xfeff, 'CSV 带 BOM（Excel 打开不乱码）')
  const lines = csv.replace(/^﻿/, '').trim().split(/\r\n/)
  ok(lines.length === 12, `CSV 1 行表头 + 11 行记录（实得 ${lines.length}）`)
  const head = lines[0].split(',')
  const col = (name) => head.indexOf(name)
  ok(col('体重 z') > 0 && col('BMI z') > 0, 'CSV 表头含各指标 z')
  ORACLE.demo['demo-mili'].forEach((t, j) => {
    const cells = lines[j + 1].split(',')
    ok(Number(cells[col('体重 z')]) === t.wfa.z && Number(cells[col('BMI z')]) === t.bfa.z, `CSV 第 ${j + 1} 行 z 与 R 一致`)
  })
  // 删除档案要点两次
  await page.click(`#gl-kids .gl-kid[data-id="imported-1"]`)
  await page.waitForFunction(() => window.GLApp.state().active === 'imported-1')
  await page.click('#gl-kf-del')
  ok((await page.textContent('#gl-kf-del')).includes('再点一次'), '删除档案第一次只是确认')
  ok((await page.evaluate(() => window.GLApp.state().kids.length)) === 4, '第一次点击不删除')
  await page.click('#gl-kf-del')
  await page.waitForFunction(() => window.GLApp.state().kids.length === 3)
  ok(true, '第二次点击删除档案')

  // ───────── 3. 生长曲线：点位几何 + 夹在正确的参考线之间 ─────────
  await onTab('chart')
  const drawn = () => page.waitForFunction(() => document.getElementById('gl-fig').dataset.key === window.GLApp.stateKey(), null, { timeout: 10000 })
  await page.selectOption('#gl-c-kid', 'demo-mili')
  await page.selectOption('#gl-c-ind', 'lfa')
  await page.selectOption('#gl-c-range', 'auto')
  await page.selectOption('#gl-c-mode', 'p')
  await drawn()
  const geo = async () => page.evaluate(() => {
    const svg = document.getElementById('gl-fig')
    const [x0, x1, xmin, xmax] = svg.dataset.fx.split(',').map(Number), [y0, y1, ymin, ymax] = svg.dataset.fy.split(',').map(Number)
    const sx = (x) => x0 + (x - xmin) / (xmax - xmin) * (x1 - x0), sy = (y) => y0 + (y - ymin) / (ymax - ymin) * (y1 - y0)
    return { range: svg.dataset.range, lines: +svg.dataset.lines, n: +svg.dataset.points, sex: +svg.dataset.sex,
      refs: Array.from(svg.querySelectorAll('path.gl-ref')).map((p) => p.dataset.lab),
      pts: Array.from(svg.querySelectorAll('circle.gl-pt')).map((c) => {
        const x = +c.dataset.x, y = +c.dataset.y
        return { date: c.dataset.date, x, y, z: +c.dataset.z, cx: +c.getAttribute('cx'), cy: +c.getAttribute('cy'), ex: sx(x), ey: sy(y), syf: 'ok' }
      }), tick: { sx: [x0, x1, xmin, xmax], sy: [y0, y1, ymin, ymax] } }
  })
  let g = await geo()
  ok(g.range === '0-5y' && g.lines === 5 && g.refs.join() === 'P3,P15,P50,P85,P97', `身长曲线：0–5 岁、5 条百分位线（${g.range} ${g.refs}）`)
  ok(g.n === 11, `小米粒 11 个点都画上（实得 ${g.n}）`)
  for (const p of g.pts) {
    near(p.cx, p.ex, 0.01, `${p.date} 点的横坐标`)
    near(p.cy, p.ey, 0.01, `${p.date} 点的纵坐标`)
    const t = ORACLE.demo['demo-mili'].find((r) => r.id && r.lfa && Math.abs(r.lfa.z - p.z) < 1e-9)
    ok(!!t, `${p.date} 点的 z ${p.z} 来自 R 真值`)
  }
  // 每个点必须落在与其 z 相邻的两条参考线之间（用页面自己的引擎在该日龄求参考线高度，再映射到屏幕）
  const between = await page.evaluate(() => {
    const E = window.GLEngine, svg = document.getElementById('gl-fig')
    const [y0, y1, ymin, ymax] = svg.dataset.fy.split(',').map(Number), sy = (y) => y0 + (y - ymin) / (ymax - ymin) * (y1 - y0)
    const Z = [-1.880793608151251, -1.0364333894937898, 0, 1.0364333894937898, 1.880793608151251]
    const sex = +svg.dataset.sex, bad = []
    for (const c of svg.querySelectorAll('circle.gl-pt')) {
      const z = +c.dataset.z, day = Math.round(+c.dataset.x * E.DAYS_PER_MONTH), r = E.lmsDay('lfa', sex, day)
      const lo = Z.filter((t) => t < z).pop(), hi = Z.find((t) => t > z)
      const cy = +c.getAttribute('cy')
      if (lo != null && !(cy <= sy(E.yAtZ(lo, r[0], r[1], r[2], false)) + 0.01)) bad.push(c.dataset.date + ' 低于下方参考线')
      if (hi != null && !(cy >= sy(E.yAtZ(hi, r[0], r[1], r[2], false)) - 0.01)) bad.push(c.dataset.date + ' 高于上方参考线')
    }
    return bad
  })
  ok(between.length === 0, `点落在相邻两条百分位线之间：${between.join('; ')}`)
  ok((await page.$$eval('#gl-c-table tbody tr[data-date]', (t) => t.length)) === 11, '图下表格 11 行')
  // z 模式
  await page.selectOption('#gl-c-mode', 'z')
  await drawn()
  g = await geo()
  ok(g.lines === 7 && g.refs.join() === '−3,−2,−1,0,+1,+2,+3', `z 模式 7 条线（${g.refs}）`)
  // 体重-身高：只画 ≥ 2 岁且有体重和身高的点
  await page.selectOption('#gl-c-ind', 'wflh')
  await drawn()
  g = await geo()
  const wfhN = ORACLE.demo['demo-mili'].filter((r) => r.wflh && r.evalDays >= 731).length
  ok(g.range === '2-5y' && g.n === wfhN, `体重-身高图：${wfhN} 个点（实得 ${g.n}）`)
  ok((await page.textContent('#gl-c-msg')).includes('不在当前年龄段'), '其余记录提示不在当前表内')
  for (const p of g.pts) { near(p.cx, p.ex, 0.01, `体重-身高 ${p.date} 横坐标`); near(p.cy, p.ey, 0.01, `体重-身高 ${p.date} 纵坐标`) }
  // 5–19 岁头围：没有标准
  await page.selectOption('#gl-c-ind', 'hcfa')
  await page.selectOption('#gl-c-range', '5-19y')
  await drawn()
  ok((await page.textContent('#gl-fig')).includes('头围标准只到 5 岁'), '5–19 岁没有头围曲线时给出说明')
  // 早产儿：豆豆按矫正月龄画，0–2 岁
  await page.selectOption('#gl-c-kid', 'demo-doudou')
  await page.selectOption('#gl-c-ind', 'wfa')
  await page.selectOption('#gl-c-range', 'auto')
  await page.selectOption('#gl-c-mode', 'p')
  await drawn()
  g = await geo()
  const dTruth = ORACLE.demo['demo-doudou'].filter((r) => !r.preTerm)
  ok(g.range === '0-2y' && g.n === dTruth.length, `豆豆体重曲线 ${dTruth.length} 个点（实得 ${g.n}）`)
  for (const p of g.pts) {
    const t = dTruth.find((r) => Math.abs(r.evalDays / 30.4375 - p.x) < 1e-9)
    ok(!!t && t.wfa.z === p.z, `${p.date} 横坐标 = R 矫正日龄 / 30.4375，z = R`)
  }
  // 下载 PNG
  const [dp] = await Promise.all([page.waitForEvent('download'), page.click('#gl-c-png')])
  const png = fs.readFileSync(await dp.path())
  ok(dp.suggestedFilename() === 'growth-chart.png' && png[0] === 0x89 && png.length > 20000, `下载 PNG（${png.length} 字节）`)

  // ───────── 4. 靶身高 ─────────
  await onTab('height')
  await page.selectOption('#gl-h-kid', 'demo-mili')
  await page.waitForFunction(() => document.getElementById('gl-h-proj'))
  const h0 = ORACLE.height.find((h) => h.sex === 2 && h.father === 176)
  near(Number(await page.getAttribute('#gl-h-mph', 'data-v')), h0.mph, 1e-9, '小米粒靶身高')
  ok((await page.textContent('#gl-h-lo')) === h0.lo.toFixed(1) && (await page.textContent('#gl-h-hi')) === h0.hi.toFixed(1), '靶身高 ±8.5 cm 范围')
  ok(Number(await page.getAttribute('#gl-h-pos', 'data-z')) === h0.z, `靶身高在 19 岁人群的 z = R ${h0.z}`)
  near(Number(await page.getAttribute('#gl-h-proj', 'data-v')), ORACLE.proj.adult, 1e-9, '按最近身高 z 延续到 19 岁')
  await page.selectOption('#gl-h-kid', '')
  for (const h of ORACLE.height) {
    await page.selectOption('#gl-h-sex', String(h.sex))
    await page.fill('#gl-h-father', String(h.father))
    await page.fill('#gl-h-mother', String(h.mother))
    await page.waitForFunction((v) => Math.abs(Number(document.getElementById('gl-h-res').dataset.mph) - v) < 1e-9, h.mph)
    ok(Number(await page.getAttribute('#gl-h-pos', 'data-z')) === h.z, `父 ${h.father} 母 ${h.mother}：z = R ${h.z}`)
  }
  await page.fill('#gl-h-father', '80')
  await page.waitForFunction(() => !document.getElementById('gl-h-msg').hidden)
  ok((await page.textContent('#gl-h-msg')).includes('100–230'), '父母身高越界提示')

  // ───────── 5. 键盘：页签方向键 ─────────
  await page.focus('#gl-tab-height')
  await page.keyboard.press('ArrowRight')
  await page.waitForFunction(() => document.getElementById('gl-tab-about').getAttribute('aria-selected') === 'true' && document.activeElement.id === 'gl-tab-about')
  await page.keyboard.press('Home')
  await page.waitForFunction(() => document.getElementById('gl-tab-quick').getAttribute('aria-selected') === 'true')
  ok(true, '页签可用方向键 / Home 切换')

  // ───────── 6. 渲染守卫 ─────────
  const tabs = ORACLE.meta.tabs
  const paneSel = (t) => `#pane-${t}`
  await onTab('quick')
  await guardHidden(page, { assert: ok, panesRoot: '#gl-panes', tabs })
  await guardUniqueIds(page, { assert: ok, minIds: 80 })
  const nCtl = await guardControlSize(page, { assert: ok, tabs, onTab, paneSel, minControls: 40 })
  ok(nCtl >= 40, `控件尺寸守卫扫到 ${nCtl} 个控件`)
  await guardTextTransform(page, { assert: ok, tabs, onTab, paneSel })
  await guardOverflow(page, { assert: ok, tabs, onTab, panesRoot: '#gl-panes', viewports: [390, 768, 1280] })
  await onTab('chart')
  await page.selectOption('#gl-c-kid', 'demo-mili')
  await page.selectOption('#gl-c-ind', 'lfa')
  await page.selectOption('#gl-c-range', 'auto')
  await drawn()
  await guardFigText(page, { assert: ok, tabs: ['chart'], onTab, figSel: () => '#gl-fig', minTextsInFig: 20 })
  await guardEscape(page, { assert: ok, cardSel: '.gl-figcard, .gl-ic, .gl-hc, .gl-card, .gl-card-cream', childSel: 'svg,table,input,select,button,p,h3' })
  ok(Number(await page.getAttribute('#gl-fig', 'data-dropped')) <= 2, '曲线图标签几乎没被避让器丢弃')
  // 窄屏下曲线图也要把 11 个点都画出来、文字不重叠
  await page.setViewportSize({ width: 390, height: 900 })
  await page.evaluate(() => window.GLApp.renderChart())
  await drawn()
  ok(Number(await page.getAttribute('#gl-fig', 'data-points')) === 11, '窄屏曲线 11 个点')
  await guardFigText(page, { assert: ok, tabs: ['chart'], onTab, figSel: () => '#gl-fig', minTextsInFig: 16 })
  await page.setViewportSize({ width: 1280, height: 850 })

  // ───────── 缩略图：速算页 + 示例 ─────────
  await onTab('quick')
  await page.click('#gl-q-example')
  await page.waitForFunction(() => document.getElementById('gl-q-res').dataset.ready === '1' && document.querySelectorAll('#gl-q-res .gl-ic[data-valid="1"]').length === 5)
  await page.evaluate(() => window.scrollTo(0, document.getElementById('gl-tabs').getBoundingClientRect().top + window.scrollY - 8))
  await page.waitForTimeout(150)
  await screenshot('thumb.png')
  console.log(`    growth-lab：${nAssert} 条断言`)
}
