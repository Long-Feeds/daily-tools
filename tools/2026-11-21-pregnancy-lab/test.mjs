// 孕期工作台 · Pregnancy Lab —— 浏览器集成测试
// 真值：run 目录 oracle/truth.json —— R 4.x 的 pnorm/qnorm/pt、gamlss.dist 6.1.11 的 pST3/qST3、
// growthstandards 0.1.7（ki-tools，MIT）的 INTERGROWTH-21st 口径与系数、Python datetime 生成，经 inject-oracle.mjs 机械注入 ORACLE，
// 本文件不手打期望值。增重推荐表、Hadlock 估重系数在本文件里按原文第二次转写（来源见各段注释），只用来核对页面接线与显示。
// 显示格式（百分位 1 位小数、z 2 位、孕周 w+d）在本文件里按「说明」页口径独立重写，不调页面的格式化函数。
import { guardHidden, guardUniqueIds, guardControlSize, guardTextTransform, guardOverflow, guardEscape, guardBoxOverlap, guardFigText } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const ORACLE = {
 "fetal": [
  {
   "v": "hc",
   "ga": 105,
   "mm": 89,
   "z": -3.602701716580457,
   "centile": 0.015746342015236878
  },
  {
   "v": "hc",
   "ga": 196,
   "mm": 263.9,
   "z": 0.39625208784382415,
   "centile": 65.40404655857354
  },
  {
   "v": "hc",
   "ga": 273,
   "mm": 347.3,
   "z": 1.3003067416457577,
   "centile": 90.32520708182197
  },
  {
   "v": "bpd",
   "ga": 119,
   "mm": 36.4,
   "z": -1.1815028720321852,
   "centile": 11.870150659329251
  },
  {
   "v": "bpd",
   "ga": 168,
   "mm": 63.5,
   "z": 0.7965869963313449,
   "centile": 78.71545339786552
  },
  {
   "v": "bpd",
   "ga": 252,
   "mm": 103.4,
   "z": 3.5113633821733163,
   "centile": 99.97770927281216
  },
  {
   "v": "ac",
   "ga": 140,
   "mm": 131.7,
   "z": -2.100736786808839,
   "centile": 1.7832039090037917
  },
  {
   "v": "ac",
   "ga": 203,
   "mm": 236.5,
   "z": -0.6026039505591291,
   "centile": 27.33860958202946
  },
  {
   "v": "ac",
   "ga": 266,
   "mm": 368.5,
   "z": 1.900727275250139,
   "centile": 97.13311279822605
  },
  {
   "v": "fl",
   "ga": 98,
   "mm": 13.4,
   "z": 0.19178395740675883,
   "centile": 57.60442810840443
  },
  {
   "v": "fl",
   "ga": 182,
   "mm": 43.5,
   "z": -1.5995090924340478,
   "centile": 5.485376496460621
  },
  {
   "v": "fl",
   "ga": 280,
   "mm": 79.8,
   "z": 2.3866200332074645,
   "centile": 99.14979722723739
  },
  {
   "v": "ofd",
   "ga": 126,
   "mm": 54.1,
   "z": 0.8922541449151293,
   "centile": 81.38716367672185
  },
  {
   "v": "ofd",
   "ga": 224,
   "mm": 102.2,
   "z": -0.30376059180571274,
   "centile": 38.06551460318002
  },
  {
   "v": "ofd",
   "ga": 259,
   "mm": 105.9,
   "z": -1.394155545202088,
   "centile": 8.163531944758267
  },
  {
   "v": "hc",
   "ga": 210,
   "mm": 248.8,
   "z": -3.198675529972703,
   "centile": 0.06903022913661896
  },
  {
   "v": "ac",
   "ga": 231,
   "mm": 329.6,
   "z": 3.1975625133812655,
   "centile": 99.93070281622539
  }
 ],
 "fetalEquiv": [
  {
   "v": "hc",
   "mm": 215.3,
   "gaDays": 165.62675494810966
  },
  {
   "v": "bpd",
   "mm": 61.7,
   "gaDays": 168.69032856655548
  },
  {
   "v": "ac",
   "mm": 288.4,
   "gaDays": 234.2579949747409
  },
  {
   "v": "fl",
   "mm": 33.2,
   "gaDays": 144.81145273493274
  },
  {
   "v": "ofd",
   "mm": 98.6,
   "gaDays": 211.37787495587924
  }
 ],
 "newborn": [
  {
   "v": "wtkg",
   "sex": "Female",
   "ga": 175,
   "val": 0.712,
   "centile": 56.94391212084938,
   "z": 0.17494639101026702
  },
  {
   "v": "wtkg",
   "sex": "Male",
   "ga": 203,
   "val": 1.42,
   "centile": 79.06745549615593,
   "z": 0.808764029753119
  },
  {
   "v": "lencm",
   "sex": "Female",
   "ga": 196,
   "val": 36.8,
   "centile": 48.95272181098673,
   "z": -0.026254387048188325
  },
  {
   "v": "hcircm",
   "sex": "Male",
   "ga": 217,
   "val": 29.9,
   "centile": 80.57522080533671,
   "z": 0.8623488405585434
  },
  {
   "v": "wtkg",
   "sex": "Female",
   "ga": 230,
   "val": 1.385,
   "centile": 7.99226369593635,
   "z": -1.4055921314085567
  },
  {
   "v": "wtkg",
   "sex": "Male",
   "ga": 231,
   "val": 2.94,
   "centile": 98.28571759544008,
   "z": 2.116696099541714
  },
  {
   "v": "wtkg",
   "sex": "Female",
   "ga": 273,
   "val": 2.48,
   "centile": 4.127128898543073,
   "z": -1.7361202305045773
  },
  {
   "v": "lencm",
   "sex": "Male",
   "ga": 274,
   "val": 50.6,
   "centile": 76.86862670526497,
   "z": 0.7345272377540057
  },
  {
   "v": "hcircm",
   "sex": "Female",
   "ga": 280,
   "val": 33.2,
   "centile": 29.887377225805373,
   "z": -0.5276424202637455
  },
  {
   "v": "wtkg",
   "sex": "Male",
   "ga": 287,
   "val": 4.61,
   "centile": 99.11168192932696,
   "z": 2.370451776370075
  },
  {
   "v": "lencm",
   "sex": "Female",
   "ga": 294,
   "val": 51.9,
   "centile": 86.8021777841722,
   "z": 1.1170885999784046
  },
  {
   "v": "hcircm",
   "sex": "Male",
   "ga": 300,
   "val": 35.6,
   "centile": 58.02553096479707,
   "z": 0.20254666528254014
  },
  {
   "v": "wtkg",
   "sex": "Female",
   "ga": 259,
   "val": 3.02,
   "centile": 71.29623271272978,
   "z": 0.562059698301288
  },
  {
   "v": "wtkg",
   "sex": "Male",
   "ga": 245,
   "val": 2.205,
   "centile": 25.512659428626154,
   "z": -0.6584435040741778
  },
  {
   "v": "lencm",
   "sex": "Male",
   "ga": 238,
   "val": 46.1,
   "centile": 71.37408678669964,
   "z": 0.5643466130118893
  }
 ],
 "newbornCurve": [
  {
   "sex": "Female",
   "ga": 182,
   "p": 10,
   "wtkg": 0.612770394337738
  },
  {
   "sex": "Male",
   "ga": 210,
   "p": 50,
   "wtkg": 1.3722851451371996
  },
  {
   "sex": "Female",
   "ga": 231,
   "p": 3,
   "wtkg": 1.1977759804725112
  },
  {
   "sex": "Male",
   "ga": 245,
   "p": 90,
   "wtkg": 3.0273822505019345
  },
  {
   "sex": "Female",
   "ga": 266,
   "p": 97,
   "wtkg": 3.782030709643585
  },
  {
   "sex": "Male",
   "ga": 273,
   "p": 10,
   "wtkg": 2.73519351451462
  },
  {
   "sex": "Female",
   "ga": 280,
   "p": 50,
   "wtkg": 3.259987073527831
  },
  {
   "sex": "Male",
   "ga": 294,
   "p": 90,
   "wtkg": 4.1721692368632155
  },
  {
   "sex": "Male",
   "ga": 245,
   "p": 47,
   "wtkg": 2.4366975564035216
  },
  {
   "sex": "Female",
   "ga": 266,
   "p": 47,
   "wtkg": 2.9458428767604268
  }
 ],
 "gwg": [
  {
   "ga": 98,
   "gain": 1.2,
   "z": 1.0573778316524773,
   "centile": 85.48304076473232
  },
  {
   "ga": 140,
   "gain": 4.6,
   "z": 0.700021765649465,
   "centile": 75.80431441348095
  },
  {
   "ga": 182,
   "gain": 7.9,
   "z": 0.5528024412088601,
   "centile": 70.98006516503395
  },
  {
   "ga": 210,
   "gain": 12.4,
   "z": 1.1586785921887968,
   "centile": 87.6706389932349
  },
  {
   "ga": 252,
   "gain": 9,
   "z": -0.7144560121577466,
   "centile": 23.747262353212946
  },
  {
   "ga": 280,
   "gain": 16.8,
   "z": 0.6564536688522963,
   "centile": 74.42338657172604
  }
 ],
 "dates": {
  "lmp": [
   {
    "lmp": "2026-06-01",
    "cycle": 28,
    "edd": "2027-03-08"
   },
   {
    "lmp": "2026-05-10",
    "cycle": 35,
    "edd": "2027-02-21"
   },
   {
    "lmp": "2026-08-02",
    "cycle": 24,
    "edd": "2027-05-05"
   },
   {
    "lmp": "2025-12-29",
    "cycle": 30,
    "edd": "2026-10-07"
   }
  ],
  "conc": [
   {
    "conc": "2026-06-14",
    "edd": "2027-03-07"
   },
   {
    "conc": "2026-02-28",
    "edd": "2026-11-21"
   }
  ],
  "ivf": [
   {
    "transfer": "2026-07-03",
    "emb": 5,
    "edd": "2027-03-21"
   },
   {
    "transfer": "2026-04-30",
    "emb": 3,
    "edd": "2027-01-18"
   },
   {
    "transfer": "2026-09-11",
    "emb": 6,
    "edd": "2027-05-29"
   }
  ],
  "acog": [
   {
    "gaLMP": 62,
    "gaUS": 67,
    "redate": false
   },
   {
    "gaLMP": 63,
    "gaUS": 71,
    "redate": true
   },
   {
    "gaLMP": 97,
    "gaUS": 90,
    "redate": false
   },
   {
    "gaLMP": 98,
    "gaUS": 106,
    "redate": true
   },
   {
    "gaLMP": 111,
    "gaUS": 118,
    "redate": false
   },
   {
    "gaLMP": 112,
    "gaUS": 122,
    "redate": false
   },
   {
    "gaLMP": 153,
    "gaUS": 142,
    "redate": true
   },
   {
    "gaLMP": 154,
    "gaUS": 168,
    "redate": false
   },
   {
    "gaLMP": 195,
    "gaUS": 210,
    "redate": true
   },
   {
    "gaLMP": 196,
    "gaUS": 218,
    "redate": true
   }
  ]
 },
 "hadlock1991": [
  {
   "week": 10,
   "p": 3,
   "g": 26
  },
  {
   "week": 10,
   "p": 10,
   "g": 29
  },
  {
   "week": 10,
   "p": 50,
   "g": 35
  },
  {
   "week": 10,
   "p": 90,
   "g": 41
  },
  {
   "week": 10,
   "p": 97,
   "g": 44
  },
  {
   "week": 11,
   "p": 3,
   "g": 34
  },
  {
   "week": 11,
   "p": 10,
   "g": 37
  },
  {
   "week": 11,
   "p": 50,
   "g": 45
  },
  {
   "week": 11,
   "p": 90,
   "g": 53
  },
  {
   "week": 11,
   "p": 97,
   "g": 56
  },
  {
   "week": 12,
   "p": 3,
   "g": 43
  },
  {
   "week": 12,
   "p": 10,
   "g": 48
  },
  {
   "week": 12,
   "p": 50,
   "g": 58
  },
  {
   "week": 12,
   "p": 90,
   "g": 68
  },
  {
   "week": 12,
   "p": 97,
   "g": 73
  },
  {
   "week": 13,
   "p": 3,
   "g": 55
  },
  {
   "week": 13,
   "p": 10,
   "g": 61
  },
  {
   "week": 13,
   "p": 50,
   "g": 73
  },
  {
   "week": 13,
   "p": 90,
   "g": 85
  },
  {
   "week": 13,
   "p": 97,
   "g": 91
  },
  {
   "week": 14,
   "p": 3,
   "g": 70
  },
  {
   "week": 14,
   "p": 10,
   "g": 77
  },
  {
   "week": 14,
   "p": 50,
   "g": 93
  },
  {
   "week": 14,
   "p": 90,
   "g": 109
  },
  {
   "week": 14,
   "p": 97,
   "g": 116
  },
  {
   "week": 15,
   "p": 3,
   "g": 88
  },
  {
   "week": 15,
   "p": 10,
   "g": 97
  },
  {
   "week": 15,
   "p": 50,
   "g": 117
  },
  {
   "week": 15,
   "p": 90,
   "g": 137
  },
  {
   "week": 15,
   "p": 97,
   "g": 146
  },
  {
   "week": 16,
   "p": 3,
   "g": 110
  },
  {
   "week": 16,
   "p": 10,
   "g": 121
  },
  {
   "week": 16,
   "p": 50,
   "g": 146
  },
  {
   "week": 16,
   "p": 90,
   "g": 171
  },
  {
   "week": 16,
   "p": 97,
   "g": 183
  },
  {
   "week": 17,
   "p": 3,
   "g": 136
  },
  {
   "week": 17,
   "p": 10,
   "g": 150
  },
  {
   "week": 17,
   "p": 50,
   "g": 181
  },
  {
   "week": 17,
   "p": 90,
   "g": 212
  },
  {
   "week": 17,
   "p": 97,
   "g": 226
  },
  {
   "week": 18,
   "p": 3,
   "g": 167
  },
  {
   "week": 18,
   "p": 10,
   "g": 185
  },
  {
   "week": 18,
   "p": 50,
   "g": 223
  },
  {
   "week": 18,
   "p": 90,
   "g": 261
  },
  {
   "week": 18,
   "p": 97,
   "g": 279
  },
  {
   "week": 19,
   "p": 3,
   "g": 205
  },
  {
   "week": 19,
   "p": 10,
   "g": 227
  },
  {
   "week": 19,
   "p": 50,
   "g": 273
  },
  {
   "week": 19,
   "p": 90,
   "g": 319
  },
  {
   "week": 19,
   "p": 97,
   "g": 341
  },
  {
   "week": 20,
   "p": 3,
   "g": 248
  },
  {
   "week": 20,
   "p": 10,
   "g": 275
  },
  {
   "week": 20,
   "p": 50,
   "g": 331
  },
  {
   "week": 20,
   "p": 90,
   "g": 387
  },
  {
   "week": 20,
   "p": 97,
   "g": 414
  },
  {
   "week": 21,
   "p": 3,
   "g": 299
  },
  {
   "week": 21,
   "p": 10,
   "g": 331
  },
  {
   "week": 21,
   "p": 50,
   "g": 399
  },
  {
   "week": 21,
   "p": 90,
   "g": 467
  },
  {
   "week": 21,
   "p": 97,
   "g": 499
  },
  {
   "week": 22,
   "p": 3,
   "g": 359
  },
  {
   "week": 22,
   "p": 50,
   "g": 478
  },
  {
   "week": 22,
   "p": 90,
   "g": 559
  },
  {
   "week": 22,
   "p": 97,
   "g": 598
  },
  {
   "week": 23,
   "p": 3,
   "g": 426
  },
  {
   "week": 23,
   "p": 10,
   "g": 471
  },
  {
   "week": 23,
   "p": 50,
   "g": 568
  },
  {
   "week": 23,
   "p": 90,
   "g": 665
  },
  {
   "week": 23,
   "p": 97,
   "g": 710
  },
  {
   "week": 24,
   "p": 3,
   "g": 503
  },
  {
   "week": 24,
   "p": 10,
   "g": 556
  },
  {
   "week": 24,
   "p": 50,
   "g": 670
  },
  {
   "week": 24,
   "p": 90,
   "g": 784
  },
  {
   "week": 24,
   "p": 97,
   "g": 838
  },
  {
   "week": 25,
   "p": 3,
   "g": 589
  },
  {
   "week": 25,
   "p": 10,
   "g": 652
  },
  {
   "week": 25,
   "p": 50,
   "g": 785
  },
  {
   "week": 25,
   "p": 90,
   "g": 918
  },
  {
   "week": 25,
   "p": 97,
   "g": 981
  },
  {
   "week": 26,
   "p": 3,
   "g": 685
  },
  {
   "week": 26,
   "p": 10,
   "g": 758
  },
  {
   "week": 26,
   "p": 50,
   "g": 913
  },
  {
   "week": 26,
   "p": 90,
   "g": 1068
  },
  {
   "week": 26,
   "p": 97,
   "g": 1141
  },
  {
   "week": 27,
   "p": 3,
   "g": 791
  },
  {
   "week": 27,
   "p": 10,
   "g": 876
  },
  {
   "week": 27,
   "p": 50,
   "g": 1055
  },
  {
   "week": 27,
   "p": 90,
   "g": 1234
  },
  {
   "week": 27,
   "p": 97,
   "g": 1319
  },
  {
   "week": 28,
   "p": 3,
   "g": 908
  },
  {
   "week": 28,
   "p": 10,
   "g": 1004
  },
  {
   "week": 28,
   "p": 50,
   "g": 1210
  },
  {
   "week": 28,
   "p": 90,
   "g": 1416
  },
  {
   "week": 28,
   "p": 97,
   "g": 1513
  },
  {
   "week": 29,
   "p": 3,
   "g": 1034
  },
  {
   "week": 29,
   "p": 10,
   "g": 1145
  },
  {
   "week": 29,
   "p": 50,
   "g": 1379
  },
  {
   "week": 29,
   "p": 90,
   "g": 1613
  },
  {
   "week": 29,
   "p": 97,
   "g": 1724
  },
  {
   "week": 30,
   "p": 3,
   "g": 1169
  },
  {
   "week": 30,
   "p": 10,
   "g": 1294
  },
  {
   "week": 30,
   "p": 50,
   "g": 1559
  },
  {
   "week": 30,
   "p": 90,
   "g": 1824
  },
  {
   "week": 31,
   "p": 3,
   "g": 1313
  },
  {
   "week": 31,
   "p": 10,
   "g": 1453
  },
  {
   "week": 31,
   "p": 50,
   "g": 1751
  },
  {
   "week": 31,
   "p": 90,
   "g": 2049
  },
  {
   "week": 31,
   "p": 97,
   "g": 2189
  },
  {
   "week": 32,
   "p": 3,
   "g": 1465
  },
  {
   "week": 32,
   "p": 10,
   "g": 1621
  },
  {
   "week": 32,
   "p": 50,
   "g": 1953
  },
  {
   "week": 32,
   "p": 90,
   "g": 2285
  },
  {
   "week": 32,
   "p": 97,
   "g": 2441
  },
  {
   "week": 33,
   "p": 3,
   "g": 1622
  },
  {
   "week": 33,
   "p": 10,
   "g": 1794
  },
  {
   "week": 33,
   "p": 50,
   "g": 2162
  },
  {
   "week": 33,
   "p": 90,
   "g": 2530
  },
  {
   "week": 33,
   "p": 97,
   "g": 2703
  },
  {
   "week": 34,
   "p": 3,
   "g": 1783
  },
  {
   "week": 34,
   "p": 10,
   "g": 1973
  },
  {
   "week": 34,
   "p": 50,
   "g": 2377
  },
  {
   "week": 34,
   "p": 90,
   "g": 2781
  },
  {
   "week": 34,
   "p": 97,
   "g": 2971
  },
  {
   "week": 35,
   "p": 3,
   "g": 1946
  },
  {
   "week": 35,
   "p": 10,
   "g": 2154
  },
  {
   "week": 35,
   "p": 50,
   "g": 2595
  },
  {
   "week": 35,
   "p": 90,
   "g": 3036
  },
  {
   "week": 35,
   "p": 97,
   "g": 3244
  },
  {
   "week": 36,
   "p": 3,
   "g": 2110
  },
  {
   "week": 36,
   "p": 10,
   "g": 2335
  },
  {
   "week": 36,
   "p": 50,
   "g": 2813
  },
  {
   "week": 36,
   "p": 90,
   "g": 3291
  },
  {
   "week": 36,
   "p": 97,
   "g": 3516
  },
  {
   "week": 37,
   "p": 3,
   "g": 2271
  },
  {
   "week": 37,
   "p": 10,
   "g": 2513
  },
  {
   "week": 37,
   "p": 50,
   "g": 3028
  },
  {
   "week": 37,
   "p": 90,
   "g": 3543
  },
  {
   "week": 37,
   "p": 97,
   "g": 3785
  },
  {
   "week": 38,
   "p": 3,
   "g": 2427
  },
  {
   "week": 38,
   "p": 10,
   "g": 2686
  },
  {
   "week": 38,
   "p": 50,
   "g": 3236
  },
  {
   "week": 38,
   "p": 90,
   "g": 3786
  },
  {
   "week": 38,
   "p": 97,
   "g": 4045
  },
  {
   "week": 39,
   "p": 3,
   "g": 2576
  },
  {
   "week": 39,
   "p": 10,
   "g": 2851
  },
  {
   "week": 39,
   "p": 50,
   "g": 3435
  },
  {
   "week": 39,
   "p": 90,
   "g": 4019
  },
  {
   "week": 39,
   "p": 97,
   "g": 4294
  },
  {
   "week": 40,
   "p": 3,
   "g": 2714
  },
  {
   "week": 40,
   "p": 10,
   "g": 3004
  },
  {
   "week": 40,
   "p": 50,
   "g": 3619
  },
  {
   "week": 40,
   "p": 90,
   "g": 4234
  },
  {
   "week": 40,
   "p": 97,
   "g": 4524
  }
 ],
 "igefwExample": {
  "ac_cm": 26,
  "hc_cm": 29,
  "efw_g": 1499,
  "week": 30,
  "l": -0.4451729,
  "m": 7.241468,
  "s": 0.017517,
  "p3_g": 1106,
  "source": "Stirnemann 2017 UOG 49:478 worked examples"
 },
 "hcflExample": {
  "hc": 250,
  "fl": 55,
  "ga": 200.5,
  "source": "Papageorghiou 2016 UOG 48:719 worked example"
 },
 "meta": {
  "generator": "oracle/r/gen_truth.R + oracle/py/gen_truth.py (growthstandards 0.1.7 source, gamlss.dist pST3/qST3, Python datetime, ACOG CO 700 table)",
  "R": "R version 4.6.1 (2026-06-24)",
  "gamlss.dist": "6.1.11"
 }
};

const TABS = ['overview', 'dating', 'scan', 'weight', 'kicks', 'ctx', 'baby', 'about']
const DAY = 864e5
const fmtC = (c) => c < 0.1 ? '< 0.1' : c > 99.9 ? '> 99.9' : c.toFixed(1)
const fmtCs = (c) => [fmtC(c - 1e-9), fmtC(c + 1e-9)]       // 真值落在 x.x5 边界时两边都算对
const fmtZ = (z) => { const s = z.toFixed(2); return s === '-0.00' ? '0.00' : s }
const fmtZs = (z) => [fmtZ(z - 1e-9), fmtZ(z + 1e-9)]
const plus = (d) => Math.floor(d / 7) + '+' + (d % 7)
const dnum = (s) => Math.round(Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) / DAY)
const dstr = (n) => new Date(n * DAY).toISOString().slice(0, 10)
const TODAY = '2026-11-21'

export default async ({ page, toolURL, screenshot, assert }) => {
  // 固定「今天」：本机时区 2026-11-21 上午
  await page.clock.install({ time: new Date('2026-11-21T09:30:00') })
  await page.goto(toolURL)
  await page.waitForFunction(() => window.PGA && window.PG && document.getElementById('pg-today').textContent.includes('2026-11-21'))
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.waitForFunction(() => window.PGA && document.getElementById('pg-today').textContent.includes('2026-11-21'))

  const tab = async (t) => {
    await page.click('#pg-tab-' + t)
    await page.waitForFunction((t) => !document.getElementById('pg-pane-' + t).hidden && document.getElementById('pg-tab-' + t).getAttribute('aria-selected') === 'true', t)
  }
  const text = (sel) => page.$eval(sel, (e) => e.textContent.trim())
  const disp = (sel) => page.$eval(sel, (e) => getComputedStyle(e).display)

  // ── 0. 初始：没有预产期 ──
  assert((await text('#pg-headline')) === '孕期工作台', '初始标题')
  assert((await disp('#pg-stats')) === 'none', '没有预产期时统计条藏起来（计算样式）')
  assert((await disp('#pg-pane-dating')) === 'none', '非当前页签的面板计算样式为 none')
  assert((await disp('#pg-sched-empty')) !== 'none', '概览提示先填预产期')

  // ── 1. 预产期：末次月经（含周期修正）、受孕日、试管移植 ──
  await tab('dating')
  for (const c of ORACLE.dates.lmp) {
    await page.fill('#pg-d-cycle', String(c.cycle))
    await page.fill('#pg-d-lmp', c.lmp)
    await page.waitForFunction((c) => { const r = document.querySelector('#pg-d-rows tr[data-method="lmp"]'); return r && r.children[1] && r.children[1].textContent === c.edd }, c)
  }
  assert(true, `末次月经 ${ORACLE.dates.lmp.length} 例（周期 28/35/24/30）预产期与 Python datetime 一致`)
  // 统一用周期 28、末次月经 2026-06-01
  await page.fill('#pg-d-cycle', '28')
  await page.fill('#pg-d-lmp', '2026-06-01')
  await page.waitForFunction(() => document.getElementById('pg-d-mine').textContent === '2027-03-08')
  {
    const ga = dnum(TODAY) - (dnum('2027-03-08') - 280)
    assert((await text('#pg-headline')).replace(/\s+/g, '') === `孕${Math.floor(ga / 7)}周${ga % 7 ? (ga % 7) + '天' : ''}`, 'hero 孕周 = 今天 − (预产期 − 280)：' + (await text('#pg-headline')))
    assert((await text('#pg-st-left')) === (dnum('2027-03-08') - dnum(TODAY)) + ' 天', '距预产期天数')
    assert((await disp('#pg-stats')) !== 'none', '有预产期后统计条显示')
  }
  for (const c of ORACLE.dates.conc) {
    await page.fill('#pg-d-conc', c.conc)
    await page.waitForFunction((c) => { const r = document.querySelector('#pg-d-rows tr[data-method="conc"]'); return r && r.children[1].textContent === c.edd }, c)
  }
  for (const c of ORACLE.dates.ivf) {
    await page.selectOption('#pg-d-emb', String(c.emb))
    await page.fill('#pg-d-ivf', c.transfer)
    await page.waitForFunction((c) => { const r = document.querySelector('#pg-d-rows tr[data-method="ivf"]'); return r && r.children[1].textContent === c.edd }, c)
  }
  assert(true, `受孕日 ${ORACLE.dates.conc.length} 例、试管移植 ${ORACLE.dates.ivf.length} 例预产期与 Python 一致`)
  // 自动优先级：有试管移植时自动用它；点「采用」改回末次月经
  {
    const ivfLast = ORACLE.dates.ivf[ORACLE.dates.ivf.length - 1]
    await page.waitForFunction((e) => document.getElementById('pg-d-mine').textContent === e, ivfLast.edd)
    assert((await text('#pg-d-basis')).includes('自动'), '自动依据标注')
    await page.click('#pg-d-rows [data-adopt="lmp"]')
    await page.waitForFunction(() => document.getElementById('pg-d-mine').textContent === '2027-03-08')
    assert(!(await text('#pg-d-basis')).includes('自动'), '手动采用后不再标「自动」')
    assert(await page.evaluate(() => document.activeElement && document.activeElement.closest('#pg-d-rows') !== null), '点「采用」后焦点仍在结果表里（重画保焦点）')
    await page.fill('#pg-d-conc', ''); await page.fill('#pg-d-ivf', '')
  }
  // 非法输入
  await page.fill('#pg-d-lmp', '2026-12-25')
  await page.waitForFunction(() => /不能晚于今天/.test(document.getElementById('pg-d-err').textContent))
  assert((await disp('#pg-d-err')) !== 'none', '末次月经在未来：报错可见')
  await page.fill('#pg-d-lmp', '2026-06-01')
  await page.fill('#pg-d-cycle', '50')
  await page.waitForFunction(() => /20–45/.test(document.getElementById('pg-d-err').textContent))
  await page.fill('#pg-d-cycle', '28')
  await page.waitForFunction(() => document.getElementById('pg-d-err').hidden)
  // ACOG 第 700 号意见：表驱动的边界真值（每一行的上下界 × 阈值 / 阈值 + 1 天）
  {
    const got = await page.evaluate((cases) => cases.map((c) => { const r = PG.acogRedate(c.gaLMP, c.gaUS); return r ? r.redate : null }), ORACLE.dates.acog)
    const bad = ORACLE.dates.acog.filter((c, i) => got[i] !== c.redate)
    assert(bad.length === 0, `ACOG 改写判定 ${ORACLE.dates.acog.length} 个边界例：失配 ${JSON.stringify(bad)}`)
  }
  // ACOG 接线：早孕 B 超 CRL 与末次月经相差 > 7 天 ⇒ 自动改用 B 超（INTERGROWTH-21st：GA = 40.9041 + 3.21585·√CRL + 0.348956·CRL，第二次转写）
  {
    // B 超孕周先取整到天（与预产期、提示文字同一口径；对拍台 BUG-1）
    const crl = 62, gaUS = Math.round(40.9041 + 3.21585 * Math.sqrt(crl) + 0.348956 * crl), usDate = '2026-08-20'
    await page.fill('#pg-d-crldate', usDate)
    await page.fill('#pg-d-crl', String(crl))
    const gaLMP = dnum(usDate) - dnum('2026-06-01')
    const expRedate = Math.abs(gaUS - gaLMP) > 7
    await page.waitForFunction(() => !document.getElementById('pg-d-acog').hidden)
    assert((await page.$eval('#pg-d-acog', (e) => e.getAttribute('data-redate'))) === (expRedate ? '1' : '0'), `CRL ${crl} mm：B 超 ${gaUS.toFixed(2)} 天 vs 末次月经 ${gaLMP} 天 ⇒ redate=${expRedate}`)
    const crlEDD = dstr(dnum(usDate) + 280 - gaUS)
    const row = await page.$eval('#pg-d-rows tr[data-method="crl"]', (r) => r.children[1].textContent)
    assert(row === crlEDD, `CRL 推算预产期 ${row} = ${crlEDD}`)
    // CRL 61 mm：B 超孕周 87.31 天 → 取整 87 天，与末次月经恰好差 7 天 ⇒ 不改写；预产期 = 检查日 + 193 天
    //（不取整时差 7.31 天会被判「改写」、预产期落在 +192.69 天那天 —— 对拍台 BUG-1 的形态）
    {
      const crl2 = 61, g2 = Math.round(40.9041 + 3.21585 * Math.sqrt(crl2) + 0.348956 * crl2)
      await page.fill('#pg-d-crl', String(crl2))
      await page.waitForFunction((e) => { const r = document.querySelector('#pg-d-rows tr[data-method="crl"]'); return r && r.children[1].textContent === e }, dstr(dnum(usDate) + 280 - g2))
      assert((await page.$eval('#pg-d-acog', (e) => e.getAttribute('data-redate'))) === (Math.abs(g2 - gaLMP) > 7 ? '1' : '0'), `CRL ${crl2} mm：取整后 ${g2} 天 vs ${gaLMP} 天 ⇒ redate=${Math.abs(g2 - gaLMP) > 7}`)
      assert(/相差 7 天/.test(await text('#pg-d-acog')), '提示里写的差值与判定同一口径（7 天、不改写）')
    }
    // 设回末次月经，后面各页签都按 2027-03-08 换算
    await page.fill('#pg-d-crldate', ''); await page.fill('#pg-d-crl', '')
    await page.waitForFunction(() => document.getElementById('pg-d-mine').textContent === '2027-03-08' && !document.querySelector('#pg-d-rows tr[data-method="crl"]'))
  }
  const EDD = '2027-03-08', BASE = dnum(EDD) - 280

  // ── 2. 概览：产检时间表与换算 ──
  await tab('overview')
  {
    const items = await page.$$eval('#pg-sched li', (ls) => ls.map((l) => l.textContent))
    const third = items.find((s) => s.includes('第 3 次产检'))
    assert(third && third.startsWith(dstr(BASE + 140) + ' 起') && third.includes('至 ' + dstr(BASE + 174)), '第 3 次产检 20+0–24+6 周的日期：' + third)
    assert(items.some((s) => s.startsWith(EDD) && s.includes('预产期（40+0 周）')), '预产期条目')
    const nowItem = await page.$$eval('#pg-sched li.pg-now', (ls) => ls.map((l) => l.textContent))
    const gaToday = dnum(TODAY) - BASE
    assert(nowItem.length === 1 && nowItem[0].includes('当前'), `今天（${plus(gaToday)}）高亮且只高亮一条`)
    await page.fill('#pg-cv-date', '2026-12-24')
    await page.waitForFunction((t) => document.getElementById('pg-cv-out1').textContent.replace(/\s/g, '') === t, '孕' + Math.floor((dnum('2026-12-24') - BASE) / 7) + '周' + ((dnum('2026-12-24') - BASE) % 7 ? ((dnum('2026-12-24') - BASE) % 7) + '天' : ''))
    await page.fill('#pg-cv-ga', '37+0')
    await page.waitForFunction((t) => document.getElementById('pg-cv-out2').textContent.startsWith(t), dstr(BASE + 259))
    await page.fill('#pg-cv-ga', '37+9')
    await page.waitForFunction(() => document.getElementById('pg-cv-out2').textContent === '—')
    assert(true, '换算：日期→孕周、孕周→日期、非法孕周 37+9 不出结果')
  }

  // ── 3. B 超单：INTERGROWTH-21st 胎儿百分位（R growthstandards 口径）──
  await tab('scan')
  await page.click('#pg-s-unit [data-unit="mm"]')
  await page.waitForFunction(() => PGA.S.scanUnit === 'mm')
  const ids = ['bpd', 'hc', 'ac', 'fl', 'ofd']
  const clearM = async () => { for (const v of ids) await page.fill('#pg-s-' + v, '') }
  // 填一项并等这一次的输入真的被算过（等待条件绑定本次输入，2026-11-18 教训）
  const fillOne = async (v, mm, gaTxt) => {
    await page.fill('#pg-s-ga', gaTxt)
    await clearM()
    await page.fill('#pg-s-' + v, String(mm))
    await page.waitForFunction(([v, mm, ga]) => { const R = PGA.readScan(); return R.m[v] === mm && R.ga === ga && document.querySelector('#pg-s-rows tr[data-var="' + v + '"]') }, [v, mm, PGA_GA(gaTxt)])
    return page.$eval('#pg-s-rows tr[data-var="' + v + '"]', (r) => ({ c: +r.children[2].getAttribute('data-c'), ct: r.children[2].textContent, z: r.children[3].textContent, eq: r.children[5].textContent, band: r.children[4].textContent }))
  }
  function PGA_GA(t) { const m = /^(\d+)\+(\d)$/.exec(t); return +m[1] * 7 + +m[2] }
  {
    let worst = 0, n = 0
    for (const c of ORACLE.fetal) {
      const r = await fillOne(c.v, c.mm, plus(c.ga))
      const d = Math.abs(r.c - c.centile)
      if (!(d <= worst)) worst = d
      assert(d <= 1e-7, `胎儿 ${c.v} ${c.mm} mm @ ${plus(c.ga)}：页面百分位 ${r.c} vs R ${c.centile}`)
      assert(fmtCs(c.centile).includes(r.ct), `显示百分位 ${r.ct} vs ${fmtC(c.centile)}`)
      assert(fmtZs(c.z).includes(r.z), `显示 z ${r.z} vs ${fmtZ(c.z)}`)
      const band = c.centile < 3 ? '< P3' : c.centile < 10 ? 'P3–P10' : c.centile <= 90 ? 'P10–P90' : c.centile <= 97 ? 'P90–P97' : '> P97'
      assert(r.band === band, `区间标签 ${r.band} vs ${band}`)
      n++
    }
    assert(n >= 12 && worst <= 1e-7, `INTERGROWTH-21st 胎儿 ${n} 例，最大百分位误差 ${worst.toExponential(2)}`)
    // 超出 14+0–40+0 周：不给百分位，提示标准覆盖范围
    {
      const r = await fillOne('hc', 340, '40+1')
      assert(r.ct === '—' && r.band === '—', '40+1 周不出百分位：' + r.ct)
      assert((await text('#pg-s-gainfo')).includes('14+0–40+0'), '提示 INTERGROWTH-21st 胎儿标准覆盖范围')
    }
    for (const c of ORACLE.fetalEquiv) {
      const r = await fillOne(c.v, c.mm, '24+0')
      assert(r.eq === plus(Math.round(c.gaDays)), `相当于孕周 ${c.v} ${c.mm} mm：${r.eq} vs R ${c.gaDays.toFixed(3)} 天`)
    }
  }
  // 单位：厘米 ⇄ 毫米互换时输入框跟着换算
  {
    await page.fill('#pg-s-ga', '24+0'); await clearM()
    await page.fill('#pg-s-hc', '215.3')
    await page.click('#pg-s-unit [data-unit="cm"]')
    await page.waitForFunction(() => document.getElementById('pg-s-hc').value === '21.53')
    await page.fill('#pg-s-bpd', '91')   // 厘米单位下填了毫米数
    await page.waitForFunction(() => /单位是不是选错了/.test(document.getElementById('pg-s-err').textContent))
    assert((await disp('#pg-s-err')) !== 'none', '单位填错（91 cm 的双顶径）给出提示且可见')
    await page.fill('#pg-s-bpd', '')
    await page.waitForFunction(() => document.getElementById('pg-s-err').hidden)
  }
  // 估重：Hadlock 1985 四式（系数第二次转写自 Am J Obstet Gynecol 151:333，单位 cm）
  const HAD = {
    'ac-fl': (m) => 1.304 + 0.05281 * m.ac + 0.1938 * m.fl - 0.004 * m.ac * m.fl,
    'bpd-ac-fl': (m) => 1.335 - 0.0034 * m.ac * m.fl + 0.0316 * m.bpd + 0.0457 * m.ac + 0.1623 * m.fl,
    'hc-ac-fl': (m) => 1.326 - 0.00326 * m.ac * m.fl + 0.0107 * m.hc + 0.0438 * m.ac + 0.158 * m.fl,
    'bpd-hc-ac-fl': (m) => 1.3596 - 0.00386 * m.ac * m.fl + 0.0064 * m.hc + 0.00061 * m.bpd * m.ac + 0.0424 * m.ac + 0.174 * m.fl
  }
  const SCANS = [
    { date: '2026-09-25', m: { bpd: 4.62, hc: 17.05, ac: 14.8, fl: 3.15 } },
    { date: '2026-11-20', m: { bpd: 6.18, hc: 22.4, ac: 20.35, fl: 4.48 } },
  ]
  {
    for (const s of SCANS) {
      await page.fill('#pg-s-date', s.date); await page.fill('#pg-s-ga', '')
      for (const v of ['bpd', 'hc', 'ac', 'fl']) await page.fill('#pg-s-' + v, String(s.m[v]))
      const gaAuto = dnum(s.date) - BASE
      await page.waitForFunction(([ga, hc]) => { const R = PGA.readScan(); return R.ga === ga && Math.abs(R.m.hc - hc * 10) < 1e-9 }, [gaAuto, s.m.hc])
      const efw = await page.$$eval('#pg-s-efwrows tr[data-efw]', (rs) => Object.fromEntries(rs.map((r) => [r.getAttribute('data-efw'), r.children[1].textContent])))
      for (const k of Object.keys(HAD)) {
        const g = Math.pow(10, HAD[k](s.m))
        assert(efw[k] === Math.round(g) + ' g', `Hadlock ${k} @ ${s.date}：页面 ${efw[k]} vs ${Math.round(g)} g`)
      }
      const n0 = await page.evaluate(() => PGA.S.scans.length)
      await page.click('#pg-s-save')
      await page.waitForFunction((n0) => PGA.S.scans.length === n0 + 1, n0)
    }
    await page.click('#pg-s-chartsel [data-var="hc"]')
    await page.waitForFunction(() => document.getElementById('pg-s-fig').getAttribute('data-key') === PGA.scanKey())
    const pts = await page.$eval('#pg-s-fig', (s) => +s.getAttribute('data-points'))
    assert(pts === 3, `头围曲线上画出 2 个已保存点 + 1 个当前点：${pts}`)
    const lab = await page.$$eval('#pg-s-fig text', (ts) => ts.map((t) => t.textContent).filter((x) => /^P\d+$/.test(x)).sort().join())
    assert(lab === 'P10,P3,P50,P90,P97', '右端 5 条百分位标签都画出来了（断「画出来几个」）：' + lab)
    const hist = await page.$$eval('#pg-s-histrows tr', (rs) => rs.length)
    assert(hist === 2, '已保存表 2 行')
    // 曲线点几何：已保存的 22.4 cm 点落在 y 轴量程内且在 x = 孕周处
    const geo = await page.evaluate(() => {
      const svg = document.getElementById('pg-s-fig'), b = svg.getBoundingClientRect()
      const dots = [...svg.querySelectorAll('circle')].map((c) => c.getBoundingClientRect())
      return { w: b.width, h: b.height, dots: dots.map((d) => ({ x: d.x - b.x, y: d.y - b.y, w: d.width })) }
    })
    assert(geo.w >= 600 && geo.h >= 200, `生长曲线渲染尺寸 ${geo.w}×${geo.h}`)
    assert(geo.dots.length === 3 && geo.dots.every((d) => d.x > 0 && d.x < geo.w && d.y > 0 && d.y < geo.h && d.w >= 6), '三个点都在图内且可见：' + JSON.stringify(geo.dots))
    // 估重曲线（Hadlock 1991 百分位）
    await page.click('#pg-s-chartsel [data-var="efw"]')
    await page.waitForFunction(() => document.getElementById('pg-s-fig').getAttribute('data-key') === PGA.scanKey())
    assert((await page.$eval('#pg-s-fig', (s) => +s.getAttribute('data-points'))) === 3, '估重曲线 3 个点')
  }
  // Hadlock 1991 原文表 1 逐格（研究代理从原文扫描件转写；两格与同行乘数矛盾的印刷值已剔除）：
  // 表是「中位数 × 0.75 / 0.83 / 1 / 1.17 / 1.25」；页面用相对 SD = 0.17/z₀.₉ 的连续百分位 ⇒ P10/P50/P90 取整后 ±1 g，
  // P3/P97 的乘数是 1 ∓ 1.8808 × 0.13265 = 1 ∓ 0.2495（表取 0.25）⇒ 允许 0.1% + 1 g
  {
    const got = await page.evaluate((H) => H.map((h) => PG.efwValue('hadlock', h.week * 7, h.p)), ORACLE.hadlock1991)
    const tol = (h) => (h.p === 3 || h.p === 97) ? 1 + 0.001 * h.g : 1
    const bad = ORACLE.hadlock1991.filter((h, i) => !(Math.abs(Math.round(got[i]) - h.g) <= tol(h))).map((h) => `${h.week}w P${h.p}: 表 ${h.g}`)
    assert(ORACLE.hadlock1991.length >= 150 && bad.length === 0, `Hadlock 1991 表 1 共 ${ORACLE.hadlock1991.length} 格，超出 ±1 g 的：${bad.slice(0, 6).join('; ')}`)
  }
  // INTERGROWTH-21st 估重论文算例：AC 26 cm、HC 29 cm → 1499 g；30 周 λ/μ/σ 与第 3 百分位 1106 g
  {
    const E = ORACLE.igefwExample
    await page.fill('#pg-s-ga', '30+0'); await clearM()
    await page.fill('#pg-s-hc', String(E.hc_cm)); await page.fill('#pg-s-ac', String(E.ac_cm))
    await page.waitForFunction((E) => { const R = PGA.readScan(); return Math.abs(R.m.ac - E.ac_cm * 10) < 1e-9 && document.querySelector('#pg-s-efwrows tr[data-efw="ig"]') }, E)
    const ig = await page.$eval('#pg-s-efwrows tr[data-efw="ig"]', (r) => r.children[1].textContent)
    assert(ig === E.efw_g + ' g', `INTERGROWTH-21st 估重：页面 ${ig}，论文算例 ${E.efw_g} g`)
    const q = await page.evaluate((w) => { const o = PG.EFW_MODELS.ig.lms(w); return [o.l, o.m, o.s, Math.round(PG.efwValue('ig', w * 7, 3))] }, E.week)
    assert(Math.abs(q[0] - E.l) < 5e-7 && Math.abs(q[1] - E.m) < 5e-7 && Math.abs(q[2] - E.s) < 5e-7, `30 周 LMS：${q.slice(0, 3).join(', ')} vs 论文 ${E.l}, ${E.m}, ${E.s}`)
    assert(q[3] === E.p3_g, `30 周第 3 百分位 ${q[3]} g vs 论文 ${E.p3_g} g`)
    const X = ORACLE.hcflExample
    const g = await page.evaluate((X) => PG.gaFromHCFL(X.hc, X.fl), X)
    assert(Math.abs(g - X.ga) < 0.05, `HC ${X.hc} / FL ${X.fl} mm 定孕周 ${g.toFixed(3)} 天 vs 论文算例 ${X.ga} 天`)
    await clearM()
  }

  // ── 4. 体重：WS/T 801-2022 与 IOM 2009（第二次转写），INTERGROWTH-21st 增重百分位（R 口径）──
  await tab('weight')
  await page.fill('#pg-w-h', '162')
  await page.fill('#pg-w-pre', '55')
  {
    const bmi = 55 / (1.62 * 1.62)
    await page.waitForFunction(() => document.getElementById('pg-w-bmi'))
    assert((await text('#pg-w-bmi')).startsWith(bmi.toFixed(1)) && (await text('#pg-w-bmi')).includes('正常（18.5–23.9）'), 'BMI 与中国分类：' + (await text('#pg-w-bmi')))
    assert((await text('#pg-w-total')) === '8–14 kg', 'WS/T 801 正常体重全程 8.0–14.0 kg')
    assert((await text('#pg-w-week')).replace(/\s+/g, ' ') === '0.37 kg 0.26–0.48', 'WS/T 801 孕中晚期每周 0.37（0.26–0.48）')
    assert(await page.$eval('#pg-w-twin', (e) => e.disabled), '中国标准下「双胎」不可选')
    await page.click('#pg-w-std [data-std="iom"]')
    await page.waitForFunction(() => /正常（18\.5–24\.9）/.test(document.getElementById('pg-w-bmi').textContent))
    assert((await text('#pg-w-total')) === '11.5–16 kg', 'IOM 正常 11.5–16 kg')
    await page.check('#pg-w-twin')
    await page.waitForFunction(() => document.getElementById('pg-w-total').textContent === '17–25 kg')
    assert(true, 'IOM 双胎（正常 BMI）17–25 kg')
    await page.uncheck('#pg-w-twin')
    await page.click('#pg-w-std [data-std="cn"]')
    await page.waitForFunction(() => document.getElementById('pg-w-total').textContent === '8–14 kg')
    // 超重分界：先按显示的 1 位小数取整再分类（62.88 kg → 23.96 → 显示 24.0 → 超重；62.85 kg → 23.95 → 显示 23.9…… 见下）
    for (const [kg, cat] of [[62.88, '超重'], [62.83, '正常']]) {
      const b1 = Math.round(kg / (1.62 * 1.62) * 10) / 10
      await page.fill('#pg-w-pre', String(kg))
      await page.waitForFunction(([b1, cat]) => { const t = document.getElementById('pg-w-bmi').textContent; return t.startsWith(b1.toFixed(1)) && t.includes(cat) }, [b1, cat])
      assert(true, `孕前 ${kg} kg：BMI 显示 ${b1.toFixed(1)}，归「${cat}」`)
    }
    await page.fill('#pg-w-pre', '55')
    await page.waitForFunction(() => /正常/.test(document.getElementById('pg-w-bmi').textContent))
  }
  {
    // 按 R iggwg 真值逐条记体重：日期 = 预产期 − 280 + GA，体重 = 55 + 增重
    for (const c of ORACLE.gwg) {
      await page.fill('#pg-w-date', dstr(BASE + c.ga))
      await page.fill('#pg-w-kg', String(+(55 + c.gain).toFixed(1)))
      const n0 = await page.evaluate(() => PGA.S.weights.length)
      await page.click('#pg-w-add')
      await page.waitForFunction((n0) => PGA.S.weights.length === n0 + 1, n0)
    }
    const rows = await page.$$eval('#pg-w-rows tr', (rs) => rs.map((r) => ({ id: r.getAttribute('data-wid'), date: r.children[0].textContent, ga: r.children[1].textContent, rec: r.children[4].textContent, ig: r.children[5].textContent })))
    for (const c of ORACLE.gwg) {
      const r = rows.find((x) => x.date === dstr(BASE + c.ga))
      assert(r && r.ga === plus(c.ga), '增重记录孕周 ' + plus(c.ga))
      assert(r && fmtCs(c.centile).includes(r.ig), `INTERGROWTH-21st 增重百分位 ${c.gain} kg @ ${plus(c.ga)}：${r && r.ig} vs R ${fmtC(c.centile)}`)
      // WS/T 801 正常体重：孕早期（未满 14 周）合计 0–2.0 kg；14+0 周起再逐周加 0.26–0.48
      const w = (c.ga - 98) / 7
      const lo = c.ga < 98 ? 0 : 0 + w * 0.26, hi = c.ga < 98 ? 2.0 : 2.0 + w * 0.48
      assert(r && r.rec.startsWith(lo.toFixed(1) + '–' + hi.toFixed(1)), `推荐区间 ${r && r.rec} vs ${lo.toFixed(1)}–${hi.toFixed(1)}`)
      const judge = c.gain < lo ? '偏少' : c.gain > hi ? '偏多' : '在范围内'
      assert(r && r.rec.endsWith(judge), '判读 ' + judge)
    }
    // 孕早期：5+4 周增重 0.8 kg 在 0–2.0 范围内（不按周线性摊）
    await page.fill('#pg-w-date', dstr(BASE + 39)); await page.fill('#pg-w-kg', '55.8')
    { const n0 = await page.evaluate(() => PGA.S.weights.length); await page.click('#pg-w-add'); await page.waitForFunction((n0) => PGA.S.weights.length === n0 + 1, n0) }
    {
      const r = await page.$$eval('#pg-w-rows tr', (rs, d) => rs.map((r) => [r.children[0].textContent, r.children[4].textContent]).find((x) => x[0] === d), dstr(BASE + 39))
      assert(r && r[1] === '0.0–2.0 在范围内', '孕早期 5+4 周 +0.8 kg：' + (r && r[1]))
      const id = await page.evaluate((d) => PGA.S.weights.find((w) => w.date === d).id, dstr(BASE + 39))
      await page.click(`#pg-w-rows [data-delw="${id}"]`)
      await page.waitForFunction((d) => !PGA.S.weights.some((w) => w.date === d), dstr(BASE + 39))
    }
    await page.waitForFunction(() => document.getElementById('pg-w-fig').getAttribute('data-key') === PGA.weightKey())
    assert((await page.$eval('#pg-w-fig', (s) => +s.getAttribute('data-points'))) === ORACLE.gwg.length, '增重曲线点数 = 记录数')
    // 键盘删除一条：焦点留在表里（重画保焦点）
    const before = await page.evaluate(() => PGA.S.weights.length)
    await page.focus('#pg-w-rows tr:first-child [data-delw]')
    await page.keyboard.press('Enter')
    await page.waitForFunction((b) => PGA.S.weights.length === b - 1, before)
    assert(await page.evaluate(() => !!document.activeElement.closest('#pg-w-rows')), '删除后焦点仍在体重表里')
    // 立刻刷新：同步写盘的数据不丢；防抖写盘的输入（身高）靠 pagehide 补写也不丢
    await page.fill('#pg-w-h', '163')
    await page.reload()
    await page.waitForFunction(() => window.PGA)
    assert((await page.$eval('#pg-w-h', (e) => e.value)) === '163', '改完身高立刻刷新：值还在（pagehide 补写防抖）')
    await page.fill('#pg-w-h', '162')
    await page.reload()
    await page.waitForFunction(() => window.PGA)
    assert((await page.evaluate(() => PGA.S.weights.length)) === before - 1, '刷新后体重记录还在')
    assert((await page.evaluate(() => PGA.S.ui.tab)) === 'weight', '刷新后回到上次的页签')
  }

  // ── 5. 新生儿：INTERGROWTH-21st（gamlss.dist ST3 + 极早产正态）──
  await tab('baby')
  {
    let worst = 0
    for (const c of ORACLE.newborn) {
      await page.selectOption('#pg-b-sex', c.sex)
      await page.fill('#pg-b-ga', plus(c.ga))
      for (const id of ['wt', 'len', 'hc']) await page.fill('#pg-b-' + id, '')
      const id = c.v === 'wtkg' ? 'wt' : c.v === 'lencm' ? 'len' : 'hc'
      const val = c.v === 'wtkg' ? String(Math.round(c.val * 1000)) : String(c.val)
      await page.fill('#pg-b-' + id, val)
      await page.waitForFunction(([v, sex, ga, val]) => { const B = PGA.S.baby; return B.sex === sex && B.ga === ga && B[v] === val && document.querySelector('#pg-b-rows tr[data-var]') }, [id, c.sex, plus(c.ga), val])
      const r = await page.$eval('#pg-b-rows tr[data-var]', (t) => ({ v: t.getAttribute('data-var'), c: t.children[2].textContent, z: t.children[3].textContent, j: t.children[4].textContent }))
      assert(r.v === c.v, '行变量 ' + r.v)
      assert(fmtCs(c.centile).includes(r.c), `新生儿 ${c.v} ${c.sex} ${plus(c.ga)} ${val}：百分位 ${r.c} vs R ${fmtC(c.centile)}`)
      assert(fmtZs(c.z).includes(r.z), `z ${r.z} vs R ${fmtZ(c.z)}`)
      if (c.v === 'wtkg') assert(r.j.startsWith(c.centile < 10 ? '小于胎龄' : c.centile > 90 ? '大于胎龄' : '适于胎龄'), 'SGA/AGA/LGA 判读：' + r.j)
      const pc = await page.evaluate(([v, sex, ga, val]) => PG.igbCentile(v, sex, ga, val), [c.v, c.sex, c.ga, c.val])
      if (!(Math.abs(pc - c.centile) <= worst)) worst = Math.abs(pc - c.centile)
    }
    assert(worst <= 1e-6, `新生儿 ${ORACLE.newborn.length} 例页面引擎 vs R gamlss.dist 最大百分位误差 ${worst.toExponential(2)}`)
    // 性质：Φ(Φ⁻¹(p)) = p（绝对误差 ≤ 1e-14）—— 页面上 z 只显示 2 位，分辨不出分位数精修写坏这类 1e-9 级的误差
    const rt = await page.evaluate(() => { let w = 0; for (let i = 1; i < 2000; i++) { const p = i / 2000; const d = Math.abs(PG.pnorm(PG.qnorm(p)) - p); if (!(d <= w)) w = d } for (const p of [1e-6, 1e-4, 0.01, 0.99, 0.9999, 1 - 1e-6]) { const d = Math.abs(PG.pnorm(PG.qnorm(p)) - p); if (!(d <= w)) w = d } return w })
    assert(rt <= 1e-14, `Φ(Φ⁻¹(p)) 往返最大误差 ${rt.toExponential(2)}`)
    const qv = await page.evaluate((cs) => cs.map((c) => PG.igbValue('wtkg', c.sex, c.ga, c.p)), ORACLE.newbornCurve)
    const qbad = ORACLE.newbornCurve.filter((c, i) => !(Math.abs(qv[i] - c.wtkg) <= 1e-7 * c.wtkg))
    assert(qbad.length === 0, `出生体重百分位曲线（qST3 / qnorm）${ORACLE.newbornCurve.length} 点：失配 ${JSON.stringify(qbad)}`)
    await page.fill('#pg-b-ga', '20+0')
    await page.waitForFunction(() => /24\+0–42\+6/.test(document.getElementById('pg-b-err').textContent))
    assert((await disp('#pg-b-err')) !== 'none', '出生孕周超出 24–42+6 报错可见')
    await page.fill('#pg-b-ga', '39+2'); await page.selectOption('#pg-b-sex', 'Female')
    await page.fill('#pg-b-wt', '3300'); await page.fill('#pg-b-len', '50'); await page.fill('#pg-b-hc', '34')
    await page.waitForFunction(() => document.getElementById('pg-b-fig').getAttribute('data-key') === PGA.babyKey())
    assert((await page.$eval('#pg-b-fig', (s) => +s.getAttribute('data-points'))) === 1, '出生体重图上画出宝宝的点')
    const xt = await page.$$eval('#pg-b-fig text', (ts) => ts.map((t) => t.textContent).filter((s) => /^\d+$/.test(s) && +s >= 24 && +s <= 42 && +s % 2 === 0))
    assert(xt.includes('24') && xt.includes('42') && xt.includes('33') === false, 'x 轴刻度是偶数周整数：' + xt.join(','))
  }

  // ── 6. 胎动：数到 10 次（假时钟精确推进）──
  await tab('kicks')
  await page.clock.pauseAt(new Date('2026-11-21T10:00:00'))
  {
    await page.click('#pg-k-orb')                    // 开始
    await page.waitForFunction(() => PGA.S.kicks.active)
    const gaps = [40, 75, 30, 120, 65, 50, 90, 45, 60, 80]   // 秒
    for (let i = 0; i < gaps.length; i++) {
      await page.clock.runFor(gaps[i] * 1000)
      await page.click('#pg-k-orb')
      if (i < 9) await page.waitForFunction((n) => document.getElementById('pg-k-n').textContent === String(n), i + 1)
    }
    await page.waitForFunction(() => !PGA.S.kicks.active && PGA.S.kicks.sessions.length === 1)
    const to10 = gaps.reduce((a, b) => a + b, 0)
    const row = await page.$eval('#pg-k-rows tr', (r) => [...r.children].map((c) => c.textContent))
    const mm = (s) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0')
    assert(row[1] === '10' && row[2] === mm(to10), `第 10 次自动结束：${row.join(' | ')}，数到 10 次用时应为 ${mm(to10)}`)
    assert((await text('#pg-k-msg')).includes(mm(to10)), '提示里给出用时')
    // 合并 5 分钟内的连续胎动
    await page.check('#pg-k-merge')
    await page.click('#pg-k-orb')
    const taps = [0, 60, 200, 299, 300, 600, 900, 905]      // 秒（相对开始），合并窗 300 s；300 / 600 / 900 恰好落在窗口边界
    let t0 = 0
    for (const s of taps) { await page.clock.runFor((s - t0) * 1000 + (s === 0 ? 1000 : 0)); t0 = s; await page.click('#pg-k-orb') }
    // 参考：距上一次「计入」不足 300 s 的并入（第一次点击在开始后 1 s）
    let n = 0, last = -Infinity
    for (const s of taps) { const t = s + 1; if (t - last >= 300) { n++; last = t } }
    await page.waitForFunction((n) => document.getElementById('pg-k-n').textContent === String(n), n)
    assert(true, `合并窗口 5 分钟：${taps.length} 次点击计为 ${n} 次`)
    await page.click('#pg-k-undo')
    await page.waitForFunction(() => PGA.S.kicks.active.taps.length === 7)
    // 2 小时还没到 10 次 ⇒ 醒目提示
    await page.clock.fastForward(2 * 3600 * 1000)   // 跳过 2 小时（runFor 会把 500 ms 的界面刷新逐个触发 1.4 万次，太慢）
    await page.waitForFunction(() => /2 小时/.test(document.getElementById('pg-k-msg').textContent))
    assert((await page.$eval('#pg-k-msg', (e) => e.className)).includes('pg-callout-flag'), '超过 2 小时：提示样式为警示')
    await page.click('#pg-k-stop')
    await page.waitForFunction(() => PGA.S.kicks.sessions.length === 2)
  }

  // ── 7. 宫缩计时：5-1-1 / 4-1-1 规则（假时钟）──
  await tab('ctx')
  await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 1000)
  {
    // 全部踩在阈值上：每次恰好 60 秒、相邻开始恰好 5 分钟；每记完一次时钟停在「下一次该开始」那一刻（距最新一次开始恰好 5 分钟）
    // ⇒ 第 k 次记完时已持续 k×5 分钟：k = 11（55 分钟）不满足、k = 12（恰好 60 分钟）满足 5-1-1
    const add = async (durS, gapS) => { await page.click('#pg-c-orb'); await page.clock.fastForward(durS * 1000); await page.click('#pg-c-orb'); await page.clock.fastForward((gapS - durS) * 1000) }
    const met = () => page.$eval('#pg-c-msg', (e) => e.getAttribute('data-met'))
    for (let k = 1; k <= 13; k++) {
      await add(60, 300)
      await page.waitForFunction((k) => PGA.S.ctx.list.length === k && document.getElementById('pg-c-orb').getAttribute('data-key') === PGA.ctxKey(), k)
      if (k === 6 || k === 11) assert((await met()) === '0', `记了 ${k} 次、已持续 ${k * 5} 分钟：还不满足 5-1-1`)
      if (k === 12) assert((await met()) === '1', '恰好 60 分钟、间隔恰好 5 分钟、每次恰好 60 秒：满足 5-1-1（阈值都按「≥ / ≤」）')
    }
    assert((await met()) === '1', '13 次后仍满足 5-1-1')
    const kv = await text('#pg-c-gap')
    assert(kv === '5 分 0 秒', '平均间隔 5 分 0 秒：' + kv)
    assert((await text('#pg-c-dur')) === '60 秒', '平均持续 60 秒')
    await page.click('#pg-c-rule [data-rule="411"]')
    await page.waitForFunction(() => document.getElementById('pg-c-msg').getAttribute('data-met') === '0')
    assert(true, '换 4-1-1：5 分钟的间隔不满足')
    await page.click('#pg-c-rule [data-rule="511"]')
    await page.waitForFunction(() => document.getElementById('pg-c-msg').getAttribute('data-met') === '1')
    // 停 1 秒：距最新一次开始已 5 分 01 秒还没有下一次 ⇒ 规律中断（定时器会自己刷新判定，不用等点击）
    await page.click('#pg-c-rule [data-rule="511"]')
    await page.waitForFunction(() => document.getElementById('pg-c-msg').getAttribute('data-met') === '1')
    await page.clock.fastForward(1000)
    await page.waitForFunction(() => document.getElementById('pg-c-msg').getAttribute('data-met') === '0' && document.getElementById('pg-c-orb').getAttribute('data-key') === PGA.ctxKey())
    assert(true, '距最新一次开始 5 分 01 秒仍没有下一次：自动变为不满足')
    // 再来一次只有 59 秒的宫缩 ⇒ 最新一次不足 1 分钟 ⇒ 不满足
    await add(59, 300)
    await page.waitForFunction(() => PGA.S.ctx.list.length === 14 && document.getElementById('pg-c-msg').getAttribute('data-met') === '0')
    const rows = await page.$$eval('#pg-c-rows tr', (rs) => rs.map((r) => [...r.children].map((c) => c.textContent)))
    assert(rows[0][1] === '59 秒' && rows[0][2] === '05:01', '最新一条：持续 59 秒、间隔 05:01：' + rows[0].join(' | '))
    await page.click('#pg-c-undo')
    await page.waitForFunction(() => PGA.S.ctx.list.length === 13 && document.getElementById('pg-c-orb').getAttribute('data-key') === PGA.ctxKey())
    assert((await met()) === '0', '删掉最后一条后，上一条开始已过 10 分钟：仍不满足')
  }
  await page.clock.resume()
  await page.reload()
  await page.waitForFunction(() => window.PGA)
  assert((await page.evaluate(() => [PGA.S.kicks.sessions.length, PGA.S.ctx.list.length].join())) === '2,13', '胎动 2 轮、宫缩 13 条刷新后都还在（同步写盘）')

  // ── 8. 备份 / 恢复 ──
  {
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#pg-export')])
    const fs = await import('node:fs')
    const p = await dl.path()
    const json = JSON.parse(fs.readFileSync(p, 'utf8'))
    assert(json.v === 1 && json.scans.length === 2 && json.profile.lmp === '2026-06-01', '备份 JSON 含 B 超 2 条与末次月经')
    // 清空：两步确认（不弹对话框）；直接 localStorage.clear() 再刷新没用 —— 离页时 pagehide 会把内存里的状态补写回去
    await tab('about')
    await page.click('#pg-wipe')
    assert((await text('#pg-wipe')) === '再点一次确认清空' && (await page.evaluate(() => PGA.S.scans.length)) === 2, '点一下只是待确认，数据还在')
    await page.click('#pg-wipe')
    await page.waitForFunction(() => PGA.S.scans.length === 0 && PGA.S.kicks.sessions.length === 0 && /已清空/.test(document.getElementById('pg-wipe-msg').textContent))
    await page.reload()
    await page.waitForFunction(() => window.PGA && PGA.S.scans.length === 0 && PGA.S.profile.lmp === '')
    assert((await text('#pg-headline')) === '孕期工作台', '清空并刷新后回到初始状态')
    await page.setInputFiles('#pg-import', { name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(json)) })
    await page.waitForFunction(() => PGA.S.scans.length === 2 && PGA.S.profile.lmp === '2026-06-01')
    assert((await page.$eval('#pg-d-lmp', (e) => e.value)) === '2026-06-01', '恢复后表单回填')
    await page.setInputFiles('#pg-import', { name: 'x.json', mimeType: 'application/json', buffer: Buffer.from('{"hello":1}') })
    await page.waitForFunction(() => /恢复失败/.test(document.getElementById('pg-d-err').textContent))
    assert(true, '非本工具的 JSON：恢复失败提示')
  }

  // ── 9. 键盘：页签方向键 ──
  await tab('overview')
  await page.focus('#pg-tab-overview')
  await page.keyboard.press('ArrowRight')
  await page.waitForFunction(() => PGA.S.ui.tab === 'dating' && document.activeElement.id === 'pg-tab-dating')
  await page.keyboard.press('End')
  await page.waitForFunction(() => PGA.S.ui.tab === 'about')
  const aboutCards = await page.$$eval('#pg-about .pg-card', (c) => c.length)
  assert(aboutCards >= 6, '说明页列出口径卡片 ' + aboutCards)

  // ── 10. 渲染守卫 ──
  const onTab = (t) => tab(t)
  await guardHidden(page, { assert, panesRoot: '#pg-panes', tabs: TABS })
  await guardUniqueIds(page, { assert, minIds: 100 })
  await guardControlSize(page, { assert, tabs: TABS, onTab, paneSel: (t) => '#pg-pane-' + t, minControls: 50 })
  await guardControlSize(page, { assert, tabs: ['.pg-nav', '.pg-hero', '.pg-tabs'], onTab: async () => {}, paneSel: (h) => h, minControls: 11 })
  // 页签条在窄屏也要扫一遍尺寸（页签不在任何面板里，面板守卫扫不到它）
  for (const vw of [390, 768]) {
    await page.setViewportSize({ width: vw, height: 900 })
    await guardControlSize(page, { assert, tabs: ['.pg-tabs'], onTab: async () => {}, paneSel: (h) => h, minControls: 8 })
  }
  await page.setViewportSize({ width: 1280, height: 850 })
  await guardTextTransform(page, { assert, tabs: TABS, onTab, paneSel: (t) => '#pg-pane-' + t, labelSel: 'th, dt, label, label > span, .pg-tag, .pg-note' })
  await guardOverflow(page, { assert, tabs: TABS, onTab, panesRoot: 'body' })
  for (const t of TABS) { await onTab(t); await guardEscape(page, { assert, cardSel: '#pg-pane-' + t + ' .pg-card' }) }
  await guardFigText(page, { assert, tabs: ['scan', 'weight', 'baby'], onTab, figSel: (t) => `#pg-pane-${t} svg.pg-fig`, minTextsInFig: 8 })
  for (const t of ['scan', 'weight', 'ctx']) {
    await onTab(t)
    await guardBoxOverlap(page, { assert, sel: '.pg-tab, .pg-seg button, .pg-nav-act .pg-btn, .pg-hero-cta .pg-btn, .pg-stats > div' })
  }
  // 守卫最后停在别的页签上：几何断言前切回去，并断尺寸下限
  await onTab('kicks')
  {
    const o = await page.$eval('#pg-k-orb', (e) => { const r = e.getBoundingClientRect(); return { w: r.width, h: r.height } })
    assert(o.w >= 150 && Math.abs(o.w - o.h) < 1, `胎动圆钮是正圆：${o.w}×${o.h}`)
  }

  // ── 缩略图：B 超页，填入示例让百分位表出现在首屏 ──
  await onTab('scan')
  await page.click('#pg-s-demo')
  await page.waitForFunction(() => document.querySelectorAll('#pg-s-rows tr[data-var]').length === 4 && document.querySelectorAll('#pg-s-efwrows tr[data-efw]').length === 5)
  await page.click('#pg-s-chartsel [data-var="hc"]')
  await page.waitForFunction(() => document.getElementById('pg-s-fig').getAttribute('data-key') === PGA.scanKey())
  await page.evaluate(() => window.scrollTo(0, 0))
  await screenshot('thumb.png')
}
