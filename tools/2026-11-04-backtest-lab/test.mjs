// 量化回测工作台 · 集成测试（真实 Chromium）
// 真值一律来自 ORACLE（truth/gen_truth.py 现场生成、inject-oracle.mjs 机械注入，不手抄）：
//   交易明细 / 权益 = backtesting.py 0.6.6（信号由 TA-Lib 0.8.3 在全量数据上算好后喂进去）；
//   夏普 / 索提诺 / 回撤 / Alpha / Beta = empyrical 0.7.2（夏普另有 quantstats 0.0.86 第二家）；
//   指标手册 = TA-Lib 0.8.3 / numpy / pandas；标普全收益 = 直接读 Shiller 原始 CSV 自算；
//   参数寻优 90 格、滚动前推 5 段的选参与样本外 = backtesting.py 逐格逐段重跑；CSV 导入 = pandas 独立解析。
import fs from 'node:fs'
import { renderGuards, guardBoxOverlap } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const ORACLE = {
 "lastBar": {
  "date": "2025-08-29",
  "o": 222.36,
  "h": 227.63,
  "l": 219.61,
  "c": 224.37,
  "prevDate": "2025-08-28",
  "prevC": 221.81
 },
 "meta": {
  "tabs": [
   "bt",
   "opt",
   "wf",
   "data",
   "ref",
   "about"
  ],
  "n": 2520,
  "dates": [
   "2016-01-04",
   "2025-08-29"
  ],
  "src": "backtesting.py 0.6.6 + TA-Lib 0.8.3 + empyrical 0.7.2 + quantstats 0.0.86 + pandas；见 truth/gen_truth.py"
 },
 "golden": {
  "m": {
   "final": 126415.43316500002,
   "total": 0.26415433165000013,
   "cagr": 0.0245855410712279,
   "sharpe": 0.22429150795199956,
   "sharpe_qs": 0.22429150795199956,
   "mdd": -0.3620160652463307,
   "years": 9.650924024640657
  },
  "bench": {
   "final": 223076.1582819646,
   "total": 1.230761582819646,
   "cagr": 0.08669001891048134,
   "sharpe": 0.4682236864079605,
   "sharpe_qs": 0.4682236864079607,
   "mdd": -0.4405099150141648,
   "years": 9.650924024640657
  },
  "ext": {
   "sortino": 0.3191913130421292,
   "annVol": 0.16582949940542532,
   "alpha": -0.019596251573800738,
   "beta": 0.5389011321129868,
   "calmar": 0.06791284539955121,
   "ddTrough": "2023-07-31",
   "years": {
    "2016": -0.030232383500000015,
    "2017": -0.16623529813443705,
    "2018": -0.0548585339336598,
    "2019": 0.6773279874828908,
    "2020": -0.11870162041940135,
    "2021": 0.23811791231944657,
    "2022": -0.07968836700324322,
    "2023": -0.004842370547528896,
    "2024": -0.07859125100849673,
    "2025": 0.07105064007999418
   }
  },
  "trades": [
   {
    "ei": 259,
    "xi": 315,
    "ep": 106.82,
    "xp": 84.03,
    "qty": 935,
    "pnl": -21397.872374999995,
    "ret": -0.2142428852274854,
    "mae": -0.2191537165324845,
    "mfe": 0.00917431192660545
   },
   {
    "ei": 512,
    "xi": 621,
    "ep": 91.06,
    "xp": 79.15,
    "qty": 862,
    "pnl": -10339.780509999997,
    "ret": -0.13172748737096415,
    "mae": -0.14946189325719306,
    "mfe": 0.14880298704151107
   },
   {
    "ei": 687,
    "xi": 1185,
    "ep": 97.98,
    "xp": 162.34,
    "qty": 696,
    "pnl": 44703.96864,
    "ret": 0.6555403143498674,
    "mae": -0.020514390691978024,
    "mfe": 1.0513370075525619
   },
   {
    "ei": 1317,
    "xi": 1371,
    "ep": 161.7,
    "xp": 149.38,
    "qty": 698,
    "pnl": -8707.926919999994,
    "ret": -0.0771523809523809,
    "mae": -0.1053184910327768,
    "mfe": 0.02238713667285097
   },
   {
    "ei": 1391,
    "xi": 1403,
    "ep": 150.66,
    "xp": 151.3,
    "qty": 691,
    "pnl": 337.91282000001024,
    "ret": 0.003245851586353402,
    "mae": -0.016660029204832005,
    "mfe": 0.0395592725341829
   },
   {
    "ei": 1412,
    "xi": 1676,
    "ep": 153.94,
    "xp": 189.64,
    "qty": 679,
    "pnl": 24123.65458999999,
    "ret": 0.23079258152526946,
    "mae": -0.04768091464206836,
    "mfe": 0.5193581915031831
   },
   {
    "ei": 1945,
    "xi": 1975,
    "ep": 169.88,
    "xp": 133.33,
    "qty": 757,
    "pnl": -27783.11498499999,
    "ret": -0.2160442959736284,
    "mae": -0.22480574523192842,
    "mfe": 0.005886508123381207
   },
   {
    "ei": 2039,
    "xi": 2328,
    "ep": 166.87,
    "xp": 195.35,
    "qty": 604,
    "pnl": 17092.529559999995,
    "ret": 0.16958644453766394,
    "mae": -0.00856954515491104,
    "mfe": 0.48343021513753204
   }
  ],
  "open": {
   "ei": 2515,
   "ep": 209.37,
   "qty": 563
  },
  "win": 0.5,
  "exposure": 0.5226190476190476,
  "pf": 1.2642490945414144,
  "entry_dates": [
   "2016-12-30",
   "2017-12-20",
   "2018-08-22",
   "2021-01-20",
   "2021-05-04",
   "2021-06-02",
   "2023-06-19",
   "2023-10-27"
  ],
  "exit_dates": [
   "2017-03-20",
   "2018-05-22",
   "2020-07-20",
   "2021-04-06",
   "2021-05-20",
   "2022-06-07",
   "2023-07-31",
   "2024-12-05"
  ]
 },
 "rsi": {
  "m": {
   "final": 115568.22531500003,
   "total": 0.1556822531500004,
   "cagr": 0.015105386768105022,
   "sharpe": 0.1734935228804397,
   "sharpe_qs": 0.1734935228804397,
   "mdd": -0.3775061791675779,
   "years": 9.650924024640657
  },
  "trades": 18,
  "sl": 10,
  "pnl": [
   14459.992079999993,
   -9255.293766399991,
   -8507.843519999999,
   1884.5708200000033,
   -7964.256220799993,
   -7324.182412800004,
   8917.306199999997,
   -7455.055871999999,
   2680.5430799999913,
   -7072.076211200002,
   18880.77991,
   -8029.450880000004,
   27413.246574999997,
   -9591.923827199991,
   -8812.065292799989,
   7318.135430000007,
   -8689.200396799994,
   16714.999619999995
  ],
  "ei": [
   15,
   306,
   413,
   598,
   1084,
   1102,
   1237,
   1708,
   1713,
   1843,
   1886,
   1953,
   1975,
   2306,
   2321,
   2329,
   2427,
   2461
  ],
  "xi": [
   258,
   408,
   450,
   649,
   1094,
   1230,
   1280,
   1712,
   1807,
   1885,
   1933,
   1974,
   2043,
   2320,
   2328,
   2386,
   2460,
   2493
  ],
  "open": null
 },
 "rsi3": {
  "final": 100214.68565815,
  "trades": 31,
  "gapIdx": [
   29
  ],
  "gap": [
   {
    "exitDate": "2025-06-05",
    "xp": 176.96,
    "stop": 177.3548,
    "pnl": -2932.9915999999976
   }
  ],
  "pnl": [
   -3096.1550552000062,
   -3000.5334860999956,
   -2905.6952177999974,
   -2817.2522535000103,
   -2729.8231184000038,
   -2641.3163249999993,
   -2561.0961600000082,
   -2481.7277726500038,
   -2406.082542900007,
   -2331.1031807999966,
   -2257.641463999997,
   -2188.5325199999997,
   -2119.765340549998,
   -2055.665431649998,
   -1994.1261231500034,
   5364.800839999999,
   -2096.6805859999977,
   15429.811350000002,
   -2508.1350487500094,
   -2432.1712931999964,
   23717.071000000004,
   -3091.0127845999996,
   -2997.302990000007,
   -2903.777866000002,
   -2813.387494450004,
   -2723.1752866500015,
   -2639.3865792000065,
   -2560.246551300003,
   8495.825590000004,
   -2932.9915999999976,
   14491.960949999995
  ]
 },
 "ref": {
  "sma": 211.2915000000004,
  "ema": 210.59347241840524,
  "wma": 213.5656666666666,
  "rsi": 75.49231561560157,
  "macd": 6.663472967674551,
  "macd_signal": 6.012232079737177,
  "macd_hist": 0.6512408879373739,
  "stoch_k": 86.53231753353036,
  "stoch_d": 82.2036962387982,
  "cci": 239.5414074887184,
  "willr": -13.101290574892433,
  "roc": 6.7920038077106115,
  "mom": 10.110000000000014,
  "adx": 46.11322477682641,
  "plus_di": 31.15166664569562,
  "minus_di": 6.815152009602237,
  "bb_upper": 222.0917930978747,
  "bb_mid": 211.2915000000004,
  "bb_lower": 200.49120690212612,
  "atr": 6.128113033311413,
  "trange": 8.019999999999982,
  "stdev": 5.4001465489371405,
  "obv": 81302801,
  "highest": 227.72,
  "lowest": 196.22,
  "sum": 3,
  "ref": 221.81,
  "change": 2.5600000000000023,
  "abs": 2.5600000000000023,
  "log": 5.413296474871686,
  "sqrt": 956.4219779992511,
  "min": 222.36,
  "max": 224.37,
  "iff": 227.63,
  "crossover": [
   false,
   43
  ],
  "crossunder": [
   false,
   83
  ],
  "rising": [
   false,
   349
  ],
  "falling": [
   false,
   288
  ],
  "barssince": [
   false,
   606
  ]
 },
 "macdEarly": {
  "i": 33,
  "date": "2016-02-18",
  "macd": -2.169399589851878,
  "signal": -2.6606744296612166,
  "hist": 0.4912748398093387
 },
 "faber": {
  "n": 1830,
  "first": "1871-01-01",
  "last": "2023-06-01",
  "tr_last": 2849643.3253917354,
  "final": 94778057778.43759,
  "cagr": 0.09449679791487209,
  "sharpe": 0.9546043065408749,
  "mdd": -0.4814220960906055,
  "trades": 92,
  "win": 0.5978260869565217,
  "bench_cagr": 0.09170092677960029,
  "bench_mdd": -0.8175983465052695
 },
 "optFull": {
  "final": 276544.47753000003,
  "sharpe": 0.69721476831257,
  "trades": 15,
  "open": true
 },
 "opt": {
  "nIS": 1764,
  "grid": [
   {
    "fast": 10,
    "slow": 100,
    "sharpe": 0.5250495955530156,
    "total": 0.6675929184500007
   },
   {
    "fast": 10,
    "slow": 125,
    "sharpe": 0.4508940591371281,
    "total": 0.5369010761999997
   },
   {
    "fast": 10,
    "slow": 150,
    "sharpe": 0.38167279907165136,
    "total": 0.4212911123500003
   },
   {
    "fast": 10,
    "slow": 175,
    "sharpe": 0.2731345079351862,
    "total": 0.2524131806499996
   },
   {
    "fast": 10,
    "slow": 200,
    "sharpe": 0.43779128306103693,
    "total": 0.5322661994500002
   },
   {
    "fast": 10,
    "slow": 225,
    "sharpe": 0.5934071226746112,
    "total": 0.8547592354
   },
   {
    "fast": 10,
    "slow": 250,
    "sharpe": 0.5754985001222731,
    "total": 0.81672530395
   },
   {
    "fast": 10,
    "slow": 275,
    "sharpe": 0.5395765503001289,
    "total": 0.7166860681999994
   },
   {
    "fast": 10,
    "slow": 300,
    "sharpe": 0.5319733870841639,
    "total": 0.7059716054499998
   },
   {
    "fast": 20,
    "slow": 100,
    "sharpe": 0.6915321970970219,
    "total": 1.0362754851
   },
   {
    "fast": 20,
    "slow": 125,
    "sharpe": 0.6557517899175374,
    "total": 0.9496563965999998
   },
   {
    "fast": 20,
    "slow": 150,
    "sharpe": 0.5528455034652784,
    "total": 0.7347993605999994
   },
   {
    "fast": 20,
    "slow": 175,
    "sharpe": 0.3024699183952659,
    "total": 0.29945144324999995
   },
   {
    "fast": 20,
    "slow": 200,
    "sharpe": 0.4644630290415288,
    "total": 0.5856038685
   },
   {
    "fast": 20,
    "slow": 225,
    "sharpe": 0.5781075820779873,
    "total": 0.82497194075
   },
   {
    "fast": 20,
    "slow": 250,
    "sharpe": 0.5276889542424004,
    "total": 0.7110689258000009
   },
   {
    "fast": 20,
    "slow": 275,
    "sharpe": 0.5059480049699556,
    "total": 0.6483887136999997
   },
   {
    "fast": 20,
    "slow": 300,
    "sharpe": 0.45882794481611366,
    "total": 0.5627394377499999
   },
   {
    "fast": 30,
    "slow": 100,
    "sharpe": 0.6372104437226426,
    "total": 0.9145765787
   },
   {
    "fast": 30,
    "slow": 125,
    "sharpe": 0.6051236892223818,
    "total": 0.8296559814000002
   },
   {
    "fast": 30,
    "slow": 150,
    "sharpe": 0.45160440890305686,
    "total": 0.5356053458499999
   },
   {
    "fast": 30,
    "slow": 175,
    "sharpe": 0.26456467146949075,
    "total": 0.23855505035000002
   },
   {
    "fast": 30,
    "slow": 200,
    "sharpe": 0.4612402978819802,
    "total": 0.5763542697999999
   },
   {
    "fast": 30,
    "slow": 225,
    "sharpe": 0.531761763458995,
    "total": 0.71575895155
   },
   {
    "fast": 30,
    "slow": 250,
    "sharpe": 0.40580544682249386,
    "total": 0.47491715580000027
   },
   {
    "fast": 30,
    "slow": 275,
    "sharpe": 0.44672689131728116,
    "total": 0.5359412107500001
   },
   {
    "fast": 30,
    "slow": 300,
    "sharpe": 0.43506050129557744,
    "total": 0.5159791252499999
   },
   {
    "fast": 40,
    "slow": 100,
    "sharpe": 0.41687041833036836,
    "total": 0.4911937748000006
   },
   {
    "fast": 40,
    "slow": 125,
    "sharpe": 0.48258231447882316,
    "total": 0.59763749675
   },
   {
    "fast": 40,
    "slow": 150,
    "sharpe": 0.386630256648698,
    "total": 0.42697377154999994
   },
   {
    "fast": 40,
    "slow": 175,
    "sharpe": 0.42964753803984806,
    "total": 0.5080883778499996
   },
   {
    "fast": 40,
    "slow": 200,
    "sharpe": 0.3913725809677908,
    "total": 0.45085276490000026
   },
   {
    "fast": 40,
    "slow": 225,
    "sharpe": 0.3871658955447608,
    "total": 0.4417245299999999
   },
   {
    "fast": 40,
    "slow": 250,
    "sharpe": 0.2918798534380785,
    "total": 0.2849393817000001
   },
   {
    "fast": 40,
    "slow": 275,
    "sharpe": 0.3989000383051294,
    "total": 0.45267767895
   },
   {
    "fast": 40,
    "slow": 300,
    "sharpe": 0.3786764544145504,
    "total": 0.4176678820500004
   },
   {
    "fast": 50,
    "slow": 100,
    "sharpe": 0.30402430834284533,
    "total": 0.30389045559999994
   },
   {
    "fast": 50,
    "slow": 125,
    "sharpe": 0.37135641501680416,
    "total": 0.40762340425
   },
   {
    "fast": 50,
    "slow": 150,
    "sharpe": 0.3824990230145896,
    "total": 0.42251924574999955
   },
   {
    "fast": 50,
    "slow": 175,
    "sharpe": 0.22657474152229798,
    "total": 0.1842576682499999
   },
   {
    "fast": 50,
    "slow": 200,
    "sharpe": 0.29271931357996817,
    "total": 0.28719956245000033
   },
   {
    "fast": 50,
    "slow": 225,
    "sharpe": 0.2158158855894539,
    "total": 0.17034649209999997
   },
   {
    "fast": 50,
    "slow": 250,
    "sharpe": 0.26391127894129124,
    "total": 0.2416791099000002
   },
   {
    "fast": 50,
    "slow": 275,
    "sharpe": 0.4373303692880597,
    "total": 0.5206606755499998
   },
   {
    "fast": 50,
    "slow": 300,
    "sharpe": 0.33051553342874607,
    "total": 0.3402078153500001
   },
   {
    "fast": 60,
    "slow": 100,
    "sharpe": 0.19931972835518455,
    "total": 0.14736310779999973
   },
   {
    "fast": 60,
    "slow": 125,
    "sharpe": 0.3848277888079559,
    "total": 0.4352463771999997
   },
   {
    "fast": 60,
    "slow": 150,
    "sharpe": 0.35643968812612287,
    "total": 0.3837147136999999
   },
   {
    "fast": 60,
    "slow": 175,
    "sharpe": 0.34456404534889973,
    "total": 0.36818904195
   },
   {
    "fast": 60,
    "slow": 200,
    "sharpe": 0.31411030341563956,
    "total": 0.32348079694999954
   },
   {
    "fast": 60,
    "slow": 225,
    "sharpe": 0.3147192766472419,
    "total": 0.3229872716000002
   },
   {
    "fast": 60,
    "slow": 250,
    "sharpe": 0.3025007892596026,
    "total": 0.30308452374999995
   },
   {
    "fast": 60,
    "slow": 275,
    "sharpe": 0.38043731424867877,
    "total": 0.4248296429
   },
   {
    "fast": 60,
    "slow": 300,
    "sharpe": 0.35262861691338476,
    "total": 0.3773857922499999
   },
   {
    "fast": 70,
    "slow": 100,
    "sharpe": 0.33515584632587303,
    "total": 0.36004223940000024
   },
   {
    "fast": 70,
    "slow": 125,
    "sharpe": 0.4548226871274085,
    "total": 0.5658027118499995
   },
   {
    "fast": 70,
    "slow": 150,
    "sharpe": 0.37783614823105877,
    "total": 0.4236892836999997
   },
   {
    "fast": 70,
    "slow": 175,
    "sharpe": 0.2821505237953162,
    "total": 0.26795053329999985
   },
   {
    "fast": 70,
    "slow": 200,
    "sharpe": 0.2937850075700728,
    "total": 0.2908257556
   },
   {
    "fast": 70,
    "slow": 225,
    "sharpe": 0.25425829894373475,
    "total": 0.22805604965000015
   },
   {
    "fast": 70,
    "slow": 250,
    "sharpe": 0.2751963542879005,
    "total": 0.26093641365000053
   },
   {
    "fast": 70,
    "slow": 275,
    "sharpe": 0.2775156212487129,
    "total": 0.2590779298500001
   },
   {
    "fast": 70,
    "slow": 300,
    "sharpe": 0.29474839093756894,
    "total": 0.28575611115
   },
   {
    "fast": 80,
    "slow": 100,
    "sharpe": 0.3964474672459743,
    "total": 0.46780643315000003
   },
   {
    "fast": 80,
    "slow": 125,
    "sharpe": 0.4405062943243135,
    "total": 0.5490545742499999
   },
   {
    "fast": 80,
    "slow": 150,
    "sharpe": 0.34463479538987224,
    "total": 0.3703197675999996
   },
   {
    "fast": 80,
    "slow": 175,
    "sharpe": 0.32706194523626353,
    "total": 0.3398124133
   },
   {
    "fast": 80,
    "slow": 200,
    "sharpe": 0.4852351495404927,
    "total": 0.6393004875000001
   },
   {
    "fast": 80,
    "slow": 225,
    "sharpe": 0.2838680171946793,
    "total": 0.2780978619500001
   },
   {
    "fast": 80,
    "slow": 250,
    "sharpe": 0.20301832818161009,
    "total": 0.15279097809999986
   },
   {
    "fast": 80,
    "slow": 275,
    "sharpe": 0.36080348632581805,
    "total": 0.3919589607999998
   },
   {
    "fast": 80,
    "slow": 300,
    "sharpe": 0.2796181690535278,
    "total": 0.2627169650999994
   },
   {
    "fast": 90,
    "slow": 100,
    "sharpe": 0.4667105014303542,
    "total": 0.6054618178000002
   },
   {
    "fast": 90,
    "slow": 125,
    "sharpe": 0.3577392596388932,
    "total": 0.4031364261999999
   },
   {
    "fast": 90,
    "slow": 150,
    "sharpe": 0.33136941940056514,
    "total": 0.3477212743500002
   },
   {
    "fast": 90,
    "slow": 175,
    "sharpe": 0.29682002072557784,
    "total": 0.29154387829999995
   },
   {
    "fast": 90,
    "slow": 200,
    "sharpe": 0.3675493991025215,
    "total": 0.4181723003500002
   },
   {
    "fast": 90,
    "slow": 225,
    "sharpe": 0.338158236701804,
    "total": 0.36879294235000004
   },
   {
    "fast": 90,
    "slow": 250,
    "sharpe": 0.34520344687151006,
    "total": 0.38077283315
   },
   {
    "fast": 90,
    "slow": 275,
    "sharpe": 0.3861677482626855,
    "total": 0.4375905900000001
   },
   {
    "fast": 90,
    "slow": 300,
    "sharpe": 0.2945785289919589,
    "total": 0.2864114431500002
   },
   {
    "fast": 100,
    "slow": 100,
    "sharpe": null,
    "total": 0
   },
   {
    "fast": 100,
    "slow": 125,
    "sharpe": 0.3152934024059712,
    "total": 0.3292569172500004
   },
   {
    "fast": 100,
    "slow": 150,
    "sharpe": 0.30602784682170725,
    "total": 0.3065466914000001
   },
   {
    "fast": 100,
    "slow": 175,
    "sharpe": 0.37331130143749264,
    "total": 0.4187242457499998
   },
   {
    "fast": 100,
    "slow": 200,
    "sharpe": 0.43011987131853247,
    "total": 0.5332774311999999
   },
   {
    "fast": 100,
    "slow": 225,
    "sharpe": 0.41923699169486295,
    "total": 0.5146874646499997
   },
   {
    "fast": 100,
    "slow": 250,
    "sharpe": 0.26442164879428026,
    "total": 0.24722240515000005
   },
   {
    "fast": 100,
    "slow": 275,
    "sharpe": 0.36932250202854233,
    "total": 0.4084235638000002
   },
   {
    "fast": 100,
    "slow": 300,
    "sharpe": 0.29222935812671674,
    "total": 0.2828574837000002
   }
  ],
  "best": {
   "fast": 20,
   "slow": 100
  },
  "bestSharpe": 0.6915321970970219,
  "oosSharpe": 0.7107696477717946,
  "cells": 90,
  "nanCells": 1
 },
 "wf": {
  "L": 315,
  "folds": [
   {
    "isA": 0,
    "isB": 945,
    "oA": 945,
    "oB": 1260,
    "fast": 30,
    "slow": 100,
    "isSharpe": 0.8029538127780653,
    "oosTotal": 0.01569288769999977,
    "oosSharpe": 0.1578320000468515,
    "oosMdd": -0.254378663639536,
    "oosTrades": 2,
    "isDate": [
     "2016-01-04",
     "2019-08-16"
    ],
    "oosDate": [
     "2019-08-19",
     "2020-10-30"
    ]
   },
   {
    "isA": 315,
    "isB": 1260,
    "oA": 1260,
    "oB": 1575,
    "fast": 20,
    "slow": 125,
    "isSharpe": 0.9971545091407005,
    "oosTotal": 0.13622626049999997,
    "oosSharpe": 0.6566810041558665,
    "oosMdd": -0.13718607089258744,
    "oosTrades": 1,
    "isDate": [
     "2017-03-20",
     "2020-10-30"
    ],
    "oosDate": [
     "2020-11-02",
     "2022-01-14"
    ]
   },
   {
    "isA": 630,
    "isB": 1575,
    "oA": 1575,
    "oB": 1890,
    "fast": 80,
    "slow": 200,
    "isSharpe": 1.271165124377842,
    "oosTotal": 0,
    "oosSharpe": null,
    "oosMdd": 0,
    "oosTrades": 0,
    "isDate": [
     "2018-06-04",
     "2022-01-14"
    ],
    "oosDate": [
     "2022-01-17",
     "2023-03-31"
    ]
   },
   {
    "isA": 945,
    "isB": 1890,
    "oA": 1890,
    "oB": 2205,
    "fast": 80,
    "slow": 200,
    "isSharpe": 0.6166742569049558,
    "oosTotal": 0.2372294105999999,
    "oosSharpe": 1.1924169708287342,
    "oosMdd": -0.10187880947011756,
    "oosTrades": 0,
    "isDate": [
     "2019-08-19",
     "2023-03-31"
    ],
    "oosDate": [
     "2023-04-03",
     "2024-06-14"
    ]
   },
   {
    "isA": 1260,
    "isB": 2205,
    "oA": 2205,
    "oB": 2520,
    "fast": 80,
    "slow": 200,
    "isSharpe": 0.8798573408877648,
    "oosTotal": 0,
    "oosSharpe": null,
    "oosMdd": 0,
    "oosTrades": 0,
    "isDate": [
     "2020-11-02",
     "2024-06-14"
    ],
    "oosDate": [
     "2024-06-17",
     "2025-08-29"
    ]
   }
  ],
  "cagr": 0.060856522789278555,
  "sharpe": 0.5051013007851138,
  "mdd": -0.3171254118034838,
  "wfe": 0.39796485575030904
 },
 "csv": {
  "text": "Date,Open,High,Low,Close,Adj Close,Volume\n2024-03-08,171.0,173.7,168.9,170.73,170.73,\"76,114,600\"\n2024-03-07,169.15,170.73,168.49,169.0,169.0,71765100\n2024-03-06,171.06,171.24,168.68,169.12,169.12,68587700\n2024-03-06,171.5,172.0,168.0,169.5,169.5,1000\n2024-03-05,170.76,172.04,169.62,170.12,170.12,95132400\n2024-13-04,176.15,176.9,173.79,175.1,175.1,81510100\n2024-03-01,179.55,180.53,177.38,179.66,179.66,73563100\n2024-02-29,181.27,182.57,179.53,180.75,180.75,136682600\n2024-02-28,182.51,183.12,180.13,181.42,181.42,null\n2024-02-27,181.1,183.92,179.56,182.63,null,54318900\n2024-02-26,182.24,182.76,180.65,null,null,40867400\n2024-02-23,185.01,185.04,182.23,182.52,91.26,45119700\n2024-02-22,183.48,184.96,182.46,184.37,92.185,52292200\n",
  "rows": 13,
  "kept": 10,
  "badDate": 1,
  "badClose": 1,
  "duplicate": 1,
  "first": [
   "2024-02-22",
   91.74,
   92.185
  ],
  "last": [
   "2024-03-08",
   171,
   170.73,
   76114600
  ],
  "row0306": [
   169.5,
   1000
  ]
 },
 "csvDe": {
  "text": "Datum;Eröffnung;Hoch;Tief;Schluss;Volumen\n2024-01-02;10,5;11;10;10,8;1200\n2024-01-03;10,8;11,2;10,6;11,1;1500\n2024-01-04;11,1;11,4;10,9;11,3;900\n",
  "rows": 3,
  "closes": [
   10.8,
   11.1,
   11.3
  ],
  "vols": [
   1200,
   1500,
   900
  ]
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const T = 20000
  const wait = (fn, arg, msg) => page.waitForFunction(fn, arg, { timeout: T }).catch(() => { throw new Error('等待超时：' + msg) })
  const runSeq = () => page.evaluate(() => +(document.body.getAttribute('data-run') || 0))
  async function act(fn, msg) {
    const r0 = await runSeq()
    await fn()
    await wait((r) => +(document.body.getAttribute('data-run') || 0) > r, r0, msg || '重跑回测')
  }
  async function onTab(t) {
    await page.click('#bl-tab-' + t)
    await wait((t) => { const p = document.getElementById('bl-pane-' + t); return p && !p.hidden && getComputedStyle(p).display !== 'none' }, t, '切到页签 ' + t)
  }
  const chartsSynced = () => wait(() => {
    const k = window.BLApp.stateKey()
    return ['bl-price', 'bl-equity', 'bl-dd'].every((id) => document.getElementById(id).getAttribute('data-key') === k)
  }, null, '图表画到当前状态')
  const kpiV = (id) => page.$eval('#bl-kpi-' + id, (el) => +el.getAttribute('data-v'))
  const kpiT = (id) => page.$eval('#bl-kpi-' + id, (el) => el.textContent.trim())
  const rel = (a, b) => Math.abs(a - b) / Math.max(1e-300, Math.abs(b))
  const near = (a, b, tol, msg) => assert(Math.abs(a - b) <= tol, `${msg}：${a} vs ${b}（容差 ${tol}）`)
  // 与页面同口径的格式化（只用于把真值排成页面应显示的字面）
  const grp = (s) => { const p = s.split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.') }
  const pct = (x, d = 2, sign = false) => { if (x == null || !Number.isFinite(x)) return '—'; let s = (x * 100).toFixed(d); if (/^-0\.?0*$/.test(s)) s = s.slice(1); return (sign && x > 0 && +s !== 0 ? '+' : '') + s + '%' }
  const num = (x, d = 2) => { if (x == null || !Number.isFinite(x)) return '—'; const s = x.toFixed(d); return /^-0\.?0*$/.test(s) ? s.slice(1) : s }
  const money = (x) => (x < 0 ? '-' : '') + grp(Math.abs(x).toFixed(2))
  const price2 = (x) => grp(x.toFixed(2))
  const G = ORACLE.golden

  // ───────── 0. 首次打开 ─────────
  await page.goto(toolURL)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await wait(() => document.body.getAttribute('data-ready') === '1' && +document.body.getAttribute('data-run') >= 1, null, '首次回测')
  assert(await page.$eval('a[href="../../"]', (a) => a.textContent.includes('返回工具集')), '缺少返回工具集链接')
  assert(await page.$eval('#bl-ds', (s) => s.value) === 'syn', '默认数据集不是 SYN')
  assert(await page.$eval('#bl-strat', (s) => s.value) === 'tpl:golden', '默认策略不是均线金叉')
  // 页签键盘可用
  await page.focus('#bl-tab-bt')
  await page.keyboard.press('ArrowRight')
  await wait(() => document.getElementById('bl-tab-opt').getAttribute('aria-selected') === 'true' && document.activeElement.id === 'bl-tab-opt', null, '方向键切到参数寻优')
  await onTab('bt')

  // ───────── 1. 均线金叉：KPI 对 backtesting.py + empyrical ─────────
  const final = await kpiV('final')
  assert(rel(final, G.m.final) < 1e-9, `期末权益 ${final} ≠ backtesting.py ${G.m.final}`)
  assert(rel(await kpiV('total'), G.m.total) < 1e-9, '总收益')
  assert(rel(await kpiV('cagr'), G.m.cagr) < 1e-9, '年化收益')
  assert(Math.abs(G.m.sharpe - G.m.sharpe_qs) < 1e-12, `两家真值不一致：empyrical ${G.m.sharpe} vs quantstats ${G.m.sharpe_qs}`)
  near(await kpiV('sharpe'), G.m.sharpe, 1e-10, '夏普（empyrical / quantstats 两家一致）')
  near(await kpiV('mdd'), G.m.mdd, 1e-10, '最大回撤（empyrical）')
  near(await kpiV('win'), G.win, 1e-12, '胜率')
  assert(await kpiV('trades') === G.trades.length, `交易次数 ${await kpiV('trades')} ≠ ${G.trades.length}`)
  near(await kpiV('excess'), G.m.cagr - G.bench.cagr, 1e-10, '超额年化（相对买入持有）')
  assert(await kpiT('total') === pct(G.m.total, 2, true), `总收益显示 ${await kpiT('total')} ≠ ${pct(G.m.total, 2, true)}`)
  assert(await kpiT('sharpe') === num(G.m.sharpe), '夏普显示')
  assert(await kpiT('mdd') === pct(G.m.mdd), '最大回撤显示')
  assert((await page.$eval('#bl-kpi-mdd', (e) => getComputedStyle(e).color)) === 'rgb(246, 70, 93)', '最大回撤应为跌色')
  assert((await page.$eval('#bl-kpi-final', (e) => getComputedStyle(e).color)) === 'rgb(252, 213, 53)', '期末权益是 Binance 黄')

  // 交易明细逐笔对 backtesting.py
  const rows = await page.$$eval('#bl-trades tbody tr[data-ei]', (trs) => trs.map((tr) => Array.from(tr.children).map((td) => td.textContent.trim())))
  assert(rows.length === G.trades.length, `交易明细 ${rows.length} 行 ≠ ${G.trades.length}`)
  G.trades.forEach((t, i) => {
    const r = rows[i]
    assert(r[2] === G.entry_dates[i] && r[4] === G.exit_dates[i], `第 ${i + 1} 笔日期 ${r[2]}→${r[4]} ≠ ${G.entry_dates[i]}→${G.exit_dates[i]}`)
    assert(r[3] === price2(t.ep) && r[5] === price2(t.xp), `第 ${i + 1} 笔价格 ${r[3]}/${r[5]} ≠ ${price2(t.ep)}/${price2(t.xp)}`)
    assert(r[6] === grp(String(t.qty)), `第 ${i + 1} 笔股数 ${r[6]} ≠ ${t.qty}`)
    assert(r[7] === money(t.pnl), `第 ${i + 1} 笔盈亏 ${r[7]} ≠ ${money(t.pnl)}`)
    assert(r[8] === pct(t.ret, 2, true), `第 ${i + 1} 笔收益率 ${r[8]} ≠ ${pct(t.ret, 2, true)}`)
    assert(r[10] === pct(t.mae, 1) && r[11] === pct(t.mfe, 1), `第 ${i + 1} 笔浮亏/浮盈 ${r[10]}/${r[11]} ≠ ${pct(t.mae, 1)}/${pct(t.mfe, 1)}`)
  })
  const openRow = await page.$$eval('#bl-trades tbody tr.bl-open td', (tds) => tds.map((td) => td.textContent.trim()))
  assert(!!G.open === (openRow.length > 0), '持仓中那一行与 backtesting.py 不一致')
  if (G.open) assert(openRow[4] === '持仓中' && openRow[3] === price2(G.open.ep) && openRow[6] === grp(String(G.open.qty)), `持仓行 ${openRow.join('|')}`)

  // ───────── 2. 图表：状态键、成交点、缩放、十字线 ─────────
  await chartsSynced()
  assert(await page.$eval('#bl-price', (s) => s.getAttribute('data-mode')) === 'line', '2520 根全显示时应是折线')
  const nMk = await page.$eval('#bl-price', (s) => +s.getAttribute('data-markers'))
  assert(nMk === 2 * G.trades.length + (G.open ? 1 : 0), `成交点 ${nMk} ≠ ${2 * G.trades.length + (G.open ? 1 : 0)}`)
  await page.click('#bl-range button[data-r="12"]')
  await chartsSynced()
  const v1 = await page.evaluate(() => window.BLApp.view())
  assert(v1.i1 === ORACLE.meta.n - 1 && v1.i1 - v1.i0 > 200 && v1.i1 - v1.i0 < 270, `「1 年」视窗 ${JSON.stringify(v1)}`)
  assert(await page.$eval('#bl-price', (s) => s.getAttribute('data-mode')) === 'candle', '1 年视窗应画 K 线')
  // 键盘：聚焦图 → ← 两次，十字线落到倒数第二根
  await page.focus('#bl-pricewrap')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await wait(() => !document.getElementById('bl-tip').hidden, null, '十字线提示')
  const tipTxt = await page.textContent('#bl-tip')
  assert(tipTxt.includes(ORACLE.lastBar.prevDate) && tipTxt.includes('收 ' + price2(ORACLE.lastBar.prevC)), `十字线提示 ${tipTxt.slice(0, 60)} 不是 ${ORACLE.lastBar.prevDate}`)
  await page.keyboard.press('Escape')
  // 滚轮缩放
  const box = await page.$eval('#bl-price', (s) => { const r = s.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } })
  await page.mouse.move(box.x, box.y)
  await page.mouse.wheel(0, -300)
  await wait((w) => { const v = window.BLApp.view(); return v.i1 - v.i0 < w }, v1.i1 - v1.i0, '滚轮放大')
  await chartsSynced()
  await page.click('#bl-range button[data-r="all"]')
  await chartsSynced()
  // 权益图例里的期末权益（中文单位）= backtesting.py
  assert(await page.textContent('#bl-eq-last') === (G.m.final / 1e4).toFixed(2) + ' 万', '权益图例期末值 ' + await page.textContent('#bl-eq-last'))
  // 金叉没有副图指标：副图必须真的藏起来（计算样式）
  assert(await page.$eval('#bl-osc', (o) => getComputedStyle(o).display) === 'none', '没有副图指标时副图应隐藏')
  // 回撤图上的最大回撤标注 = empyrical
  const ddTxt = await page.$$eval('#bl-dd text', (ts) => ts.map((t) => t.textContent).join('|'))
  assert(ddTxt.includes('最大回撤 ' + pct(G.m.mdd, 1)), `回撤图标注缺失：${ddTxt}`)
  // 对数坐标开关会重画
  const k0 = await page.$eval('#bl-equity', (s) => s.getAttribute('data-key'))
  await page.click('#bl-loge')
  await wait((k) => document.getElementById('bl-equity').getAttribute('data-key') !== k && document.getElementById('bl-equity').getAttribute('data-key') === window.BLApp.stateKey(), k0, '切换线性坐标')
  await page.click('#bl-loge')
  await chartsSynced()

  // ───────── 3. 月度 / 回撤区间 / 全部指标 ─────────
  await page.click('#bl-st-monthly')
  await wait(() => !document.getElementById('bl-sub-monthly').hidden, null, '月度页')
  assert(await page.$eval('#bl-sub-trades', (e) => getComputedStyle(e).display) === 'none', '切走后交易明细必须真的藏起来（计算样式）')
  const yrs = await page.$$eval('#bl-monthly tbody tr', (trs) => trs.map((tr) => [tr.children[0].textContent, tr.lastElementChild.textContent]))
  const yw = Object.keys(G.ext.years)
  assert(yrs.length === yw.length, `年份行数 ${yrs.length} ≠ ${yw.length}`)
  yrs.forEach(([y, v]) => assert(v === pct(G.ext.years[y], 1), `${y} 年收益 ${v} ≠ ${pct(G.ext.years[y], 1)}`))
  await page.click('#bl-st-dd')
  const dd1 = await page.$$eval('#bl-ddtable tbody tr:first-child td', (tds) => tds.map((td) => td.textContent))
  assert(dd1[2] === G.ext.ddTrough && dd1[4] === pct(G.m.mdd, 2), `最深回撤 ${dd1.join('|')} ≠ 谷底 ${G.ext.ddTrough} ${pct(G.m.mdd, 2)}`)
  await page.click('#bl-st-all')
  const allm = Object.fromEntries(await page.$$eval('#bl-allm tbody tr', (trs) => trs.map((tr) => [tr.children[0].textContent, tr.children[1].textContent])))
  assert(allm['索提诺比率'] === num(G.ext.sortino, 3), `索提诺 ${allm['索提诺比率']} ≠ empyrical ${num(G.ext.sortino, 3)}`)
  assert(allm['年化波动'] === pct(G.ext.annVol, 2), `年化波动 ${allm['年化波动']} ≠ ${pct(G.ext.annVol, 2)}`)
  assert(allm['Beta（对买入持有）'] === num(G.ext.beta, 3), `Beta ${allm['Beta（对买入持有）']} ≠ ${num(G.ext.beta, 3)}`)
  assert(allm['Alpha（年化）'] === pct(G.ext.alpha, 2, true), `Alpha ${allm['Alpha（年化）']} ≠ ${pct(G.ext.alpha, 2, true)}`)
  assert(allm['卡玛比率'] === num(G.ext.calmar, 3), `卡玛 ${allm['卡玛比率']} ≠ ${num(G.ext.calmar, 3)}`)
  await page.click('#bl-st-dist')
  await wait(() => +document.getElementById('bl-hist').getAttribute('data-drawn') > 3, null, '收益分布图')
  const bars = await page.$$eval('#bl-hist rect', (rs) => rs.filter((r) => /^#(0ecb81|f6465d)$/.test(r.getAttribute('fill') || '') && +r.getAttribute('height') > 0).length)
  assert(bars >= 3, '收益分布直方图柱子太少 ' + bars)
  await page.click('#bl-st-trades')

  // ───────── 4. 规则编辑：报错带位置，改好后自动重跑 ─────────
  const ta = '#bl-rule-longEntry', orig = await page.$eval(ta, (e) => e.value)
  const errOf = () => page.$eval('#bl-err-longEntry', (e) => e.textContent)
  await page.fill(ta, 'rsii(close) < 30')
  await wait(() => /是不是想写 rsi/.test(document.getElementById('bl-err-longEntry').textContent), null, '拼写建议')
  const e1 = (await errOf()).split('\n')
  assert(e1[1] === 'rsii(close) < 30' && e1[2] === '^^^^', `报错的定位行 ${JSON.stringify(e1)}`)
  assert(await page.$eval(ta, (e) => getComputedStyle(e).borderTopColor) === 'rgb(246, 70, 93)', '出错的规则框要变红（计算样式）')
  await page.fill(ta, 'clsoe > open')
  await wait(() => /是不是想写 close/.test(document.getElementById('bl-err-longEntry').textContent), null, '名字拼写建议')
  await page.fill(ta, 'close >')
  await wait(() => /表达式不完整/.test(document.getElementById('bl-err-longEntry').textContent), null, '不完整表达式')
  await page.fill(ta, 'sma(close, 2.5) > close')
  await wait(() => /要是整数/.test(document.getElementById('bl-err-longEntry').textContent), null, '周期非整数')
  await page.fill(ta, 'close > sma（close, 20)')
  await wait(() => /全角/.test(document.getElementById('bl-err-longEntry').textContent), null, '全角括号')
  await page.fill(ta, 'close > open > high')
  await wait(() => /不能连写/.test(document.getElementById('bl-err-longEntry').textContent), null, '比较连写')
  await page.fill(ta, 'sma(close, 20)')
  await wait(() => /真\/假/.test(document.getElementById('bl-err-longEntry').textContent), null, '规则必须返回真/假')
  await act(() => page.fill(ta, orig), '改回原规则自动重跑')
  assert(await errOf() === '', '改好后错误提示应清空')
  assert(rel(await kpiV('final'), G.m.final) < 1e-9, '改回后结果回到真值')

  // ───────── 5. RSI 模板：8% 止损逐笔对 backtesting.py ─────────
  await act(() => page.selectOption('#bl-strat', 'tpl:rsi'), '切到 RSI 模板')
  const RS = ORACLE.rsi
  assert(await kpiV('trades') === RS.trades, `RSI 交易次数 ${await kpiV('trades')} ≠ ${RS.trades}`)
  assert(rel(await kpiV('final'), RS.m.final) < 1e-9, `RSI 期末权益 ${await kpiV('final')} ≠ ${RS.m.final}`)
  near(await kpiV('sharpe'), RS.m.sharpe, 1e-10, 'RSI 夏普')
  const reasons = await page.$$eval('#bl-trades tbody tr[data-ei] td:last-child', (tds) => tds.map((t) => t.textContent))
  assert(reasons.filter((r) => r === '止损').length === RS.sl, `止损笔数 ${reasons.filter((r) => r === '止损').length} ≠ ${RS.sl}`)
  const pnls = await page.$$eval('#bl-trades tbody tr[data-ei] td:nth-child(8)', (tds) => tds.map((t) => t.textContent))
  RS.pnl.forEach((p, i) => assert(pnls[i] === money(p), `RSI 第 ${i + 1} 笔盈亏 ${pnls[i]} ≠ ${money(p)}`))
  // 止损收紧到 3%：31 笔里有 1 笔跳空低开越过止损 —— 必须按开盘价成交，不是止损价（backtesting.py 同口径）
  await act(async () => { await page.fill('#bl-set-stopLossPct', '3'); await page.$eval('#bl-set-stopLossPct', (e) => e.dispatchEvent(new Event('change', { bubbles: true }))) }, '止损改 3%')
  const R3 = ORACLE.rsi3
  assert(await kpiV('trades') === R3.trades && rel(await kpiV('final'), R3.final) < 1e-9, `RSI+3% 止损 ${await kpiV('trades')} 笔 / ${await kpiV('final')} ≠ ${R3.trades} / ${R3.final}`)
  const gapRow = await page.$$eval('#bl-trades tbody tr[data-ei]', (trs, d) => { const tr = trs.find((t) => t.children[4].textContent === d); return tr ? Array.from(tr.children).map((td) => td.textContent) : null }, R3.gap[0].exitDate)
  assert(gapRow && gapRow[5] === price2(R3.gap[0].xp) && gapRow[12] === '止损' && gapRow[7] === money(R3.gap[0].pnl), `跳空止损那笔 ${gapRow && gapRow.join('|')} 应按开盘价 ${price2(R3.gap[0].xp)}（止损价 ${price2(R3.gap[0].stop)}）`)
  const p3 = await page.$$eval('#bl-trades tbody tr[data-ei] td:nth-child(8)', (tds) => tds.map((t) => t.textContent))
  assert(p3.length === R3.pnl.length && R3.pnl.every((v, i) => p3[i] === money(v)), 'RSI+3% 逐笔盈亏与 backtesting.py 不一致')
  await act(async () => { await page.fill('#bl-set-stopLossPct', '8'); await page.$eval('#bl-set-stopLossPct', (e) => e.dispatchEvent(new Event('change', { bubbles: true }))) }, '止损改回 8%')
  // 副图：RSI 要真的显示出来（SVGElement 没有 .hidden 的 IDL 映射，svg.hidden=false 不会生效 —— 看图才发现的坑），并画出 30 / 70 参考线
  await wait(() => { const o = document.getElementById('bl-osc'); return o.getAttribute('data-key') === window.BLApp.stateKey() && getComputedStyle(o).display !== 'none' && o.getBoundingClientRect().height > 60 }, null, 'RSI 副图可见')
  const oscTxt = await page.$$eval('#bl-osc text', (ts) => ts.map((t) => t.textContent))
  assert(oscTxt.includes('30') && oscTxt.includes('70'), '副图缺少 30 / 70 参考线标注：' + oscTxt.join('|'))
  const oscLine = await page.$$eval('#bl-osc path', (ps) => ps.filter((p) => p.getAttribute('stroke') === '#2dbdb6' && (p.getAttribute('d') || '').length > 200).length)
  assert(oscLine === 1, 'RSI 曲线没画出来')
  assert((await page.textContent('#bl-legend')).includes('副图 · rsi(close, 14)（参考线 30 / 70）'), '图例应列出副图指标与参考线')

  // MACD：预热刚结束那一根（第 34 根）的 MACD / 信号线 —— 种子写错在最后一根早已衰减到看不见，只有开头看得出
  await act(() => page.selectOption('#bl-strat', 'tpl:macd'), '切到 MACD 模板')
  await page.click('#bl-range button[data-r="6"]')
  await chartsSynced()
  await page.focus('#bl-pricewrap')
  await page.keyboard.press('Home')
  await chartsSynced()
  const ME = ORACLE.macdEarly
  const hx = await page.evaluate((i) => window.BLApp.barClientX(i), ME.i)
  const hy = await page.$eval('#bl-price', (s) => { const r = s.getBoundingClientRect(); return r.top + r.height / 2 })
  await page.mouse.move(hx, hy)
  await wait((d) => !document.getElementById('bl-tip').hidden && document.getElementById('bl-tip').textContent.includes(d), ME.date, '十字线落到第 ' + (ME.i + 1) + ' 根')
  const mtip = await page.textContent('#bl-tip')
  const grab = (k) => { const m = mtip.match(new RegExp(k.replace(/[()]/g, '\\$&') + '：(-?[\\d.]+)')); return m ? +m[1] : NaN }
  near(grab('macd(close, 12, 26, 9)'), ME.macd, 0.5e-4 + 1e-12, `第 ${ME.i + 1} 根 MACD（TA-Lib）`)
  near(grab('macd_signal(close, 12, 26, 9)'), ME.signal, 0.5e-4 + 1e-12, `第 ${ME.i + 1} 根 MACD 信号线（TA-Lib）`)
  await page.mouse.move(5, 5)

  // ───────── 6. Faber 月线择时：自动切到标普全收益 ─────────
  await act(() => page.selectOption('#bl-strat', 'tpl:faber'), '切到 Faber 模板')
  const FB = ORACLE.faber
  assert(await page.$eval('#bl-ds', (s) => s.value) === 'spx-tr', '模板应自动切到标普月度全收益')
  assert((await page.textContent('#bl-status')).includes(FB.n.toLocaleString('en-US') + ' 根'), '状态栏应报 ' + FB.n + ' 根')
  assert(rel(await kpiV('final'), FB.final) < 1e-9, `Faber 期末权益 ${await kpiV('final')} ≠ 独立实现 ${FB.final}`)
  near(await kpiV('cagr'), FB.cagr, 1e-10, 'Faber 年化')
  near(await kpiV('mdd'), FB.mdd, 1e-10, 'Faber 最大回撤（empyrical）')
  near(await kpiV('sharpe'), FB.sharpe, 1e-9, 'Faber 夏普（月度，12 期 / 年）')
  assert(await kpiV('trades') === FB.trades, `Faber 交易次数 ${await kpiV('trades')} ≠ ${FB.trades}`)
  assert((await page.$eval('#bl-kpi-cagr', (e) => e.nextElementSibling.textContent)) === '买入持有 ' + pct(FB.bench_cagr, 2, true), '买入持有年化（Shiller 全收益自算）')
  await chartsSynced()

  // ───────── 7. A 股预设：100 股一手 ─────────
  await act(() => page.selectOption('#bl-strat', 'tpl:golden'), '回到金叉')
  await act(() => page.selectOption('#bl-preset', 'cn'), 'A 股预设')
  assert(await page.$eval('#bl-set-lot', (e) => e.value) === '100' && await page.$eval('#bl-set-minCommission', (e) => e.value) === '5', 'A 股预设没填进表单')
  const qtys = await page.$$eval('#bl-trades tbody tr td:nth-child(7)', (tds) => tds.map((t) => +t.textContent.replace(/,/g, '')))
  assert(qtys.length > 0 && qtys.every((q) => q > 0 && q % 100 === 0), 'A 股每笔都应是 100 股的整数倍：' + qtys.join(','))
  assert(await kpiV('final') < G.m.final, '加了印花税与最低佣金后期末权益应更低')
  await act(() => page.selectOption('#bl-strat', 'tpl:golden'), '还原模板')

  // ───────── 8. 参数寻优：90 格逐格对 backtesting.py ─────────
  await onTab('opt')
  assert(await page.$eval('#bl-opt-x', (s) => s.value) === 'fast' && await page.$eval('#bl-opt-y', (s) => s.value) === 'slow', '默认横纵轴参数')
  await page.click('#bl-opt-run')
  await wait(() => /完成：90 组/.test(document.getElementById('bl-opt-status').textContent), null, '寻优完成')
  const cells = await page.$$eval('#bl-opt-hm .bl-cell', (bs) => bs.map((b) => [JSON.parse(b.getAttribute('data-p')), b.textContent, b.classList.contains('bl-best')]))
  assert(cells.length === ORACLE.opt.cells, `热力图 ${cells.length} 格 ≠ ${ORACLE.opt.cells}`)
  const gmap = Object.fromEntries(ORACLE.opt.grid.map((g) => [g.fast + '|' + g.slow, g.sharpe]))
  let badCells = 0
  cells.forEach(([p, t]) => { if (t !== num(gmap[p.fast + '|' + p.slow])) badCells++ })
  assert(badCells === 0, `${badCells} 个格子的夏普与 backtesting.py 不一致`)
  const bestCell = cells.filter((c) => c[2])
  assert(bestCell.length === 1 && bestCell[0][0].fast === ORACLE.opt.best.fast && bestCell[0][0].slow === ORACLE.opt.best.slow, `最优格 ${JSON.stringify(bestCell.map((c) => c[0]))} ≠ ${JSON.stringify(ORACLE.opt.best)}`)
  assert(await page.textContent('#bl-opt-bestv') === num(ORACLE.opt.bestSharpe), '样本内最优夏普')
  assert(await page.textContent('#bl-opt-oos') === num(ORACLE.opt.oosSharpe), `样本外夏普 ${await page.textContent('#bl-opt-oos')} ≠ ${num(ORACLE.opt.oosSharpe)}`)
  assert(await page.$eval('#bl-opt-bar', (e) => e.style.width) === '100%', '进度条应走满')
  // 点最优格 → 参数写回策略并在全样本重跑
  await act(() => page.click('#bl-opt-hm .bl-cell.bl-best'), '应用最优参数')
  await wait(() => document.getElementById('bl-pane-bt').hidden === false, null, '回到回测页')
  const pv = await page.$$eval('#bl-params .bl-prow', (rs) => rs.map((r) => [r.querySelector('[data-pk="name"]').value, +r.querySelector('[data-pk="value"]').value]))
  assert(JSON.stringify(pv) === JSON.stringify([['fast', ORACLE.opt.best.fast], ['slow', ORACLE.opt.best.slow]]), '参数没写回：' + JSON.stringify(pv))
  assert(rel(await kpiV('final'), ORACLE.optFull.final) < 1e-9, `最优参数全样本期末权益 ${await kpiV('final')} ≠ ${ORACLE.optFull.final}`)
  assert(await kpiV('trades') === ORACLE.optFull.trades, '最优参数全样本交易次数')
  assert(!(await page.$eval('#bl-dirty', (e) => e.hidden)), '改了参数应显示「未保存」')
  await act(() => page.selectOption('#bl-strat', 'tpl:golden'), '还原默认参数')

  // ───────── 9. 滚动前推：每段选参与样本外 = backtesting.py ─────────
  await onTab('wf')
  await page.click('#bl-wf-run')
  await wait(() => /完成：5 段 × 90 组/.test(document.getElementById('bl-wf-status').textContent), null, '前推完成')
  const wfr = await page.$$eval('#bl-wf-table tbody tr', (trs) => trs.map((tr) => Array.from(tr.children).map((td) => td.textContent)))
  const WF = ORACLE.wf
  assert(wfr.length === WF.folds.length, `前推段数 ${wfr.length}`)
  WF.folds.forEach((f, i) => {
    const r = wfr[i]
    assert(r[2] === `fast=${f.fast} slow=${f.slow}`, `第 ${i + 1} 段选参 ${r[2]} ≠ fast=${f.fast} slow=${f.slow}`)
    assert(r[1] === `${f.isDate[0]} → ${f.isDate[1]}` && r[4] === `${f.oosDate[0]} → ${f.oosDate[1]}`, `第 ${i + 1} 段区间 ${r[1]} / ${r[4]}`)
    assert(r[3] === num(f.isSharpe) && r[6] === num(f.oosSharpe), `第 ${i + 1} 段夏普 ${r[3]}/${r[6]} ≠ ${num(f.isSharpe)}/${num(f.oosSharpe)}`)
    assert(r[5] === pct(f.oosTotal, 1, true) && r[7] === pct(f.oosMdd, 1) && +r[8] === f.oosTrades, `第 ${i + 1} 段样本外 ${r.slice(5).join('|')}`)
  })
  assert(await page.textContent('#bl-wf-cagr') === pct(WF.cagr, 2, true), `样本外年化 ${await page.textContent('#bl-wf-cagr')} ≠ ${pct(WF.cagr, 2, true)}`)
  assert(await page.textContent('#bl-wf-sharpe') === num(WF.sharpe), '样本外夏普')
  assert(await page.textContent('#bl-wf-mdd') === pct(WF.mdd, 1), '样本外最大回撤')
  assert(await page.textContent('#bl-wf-wfe') === pct(WF.wfe, 0), `前推效率 ${await page.textContent('#bl-wf-wfe')} ≠ ${pct(WF.wfe, 0)}`)
  const segLabels = await page.$$eval('#bl-wf-eq text', (ts) => ts.filter((t) => /^第 \d 段$/.test(t.textContent)).length)
  assert(segLabels === WF.folds.length, `前推图上的段标注 ${segLabels}`)

  // ───────── 10. 指标手册：能力清单逐项对 TA-Lib / numpy ─────────
  await onTab('ref')
  const refRows = await page.$$eval('#bl-reftable tr[data-fn]', (trs) => trs.map((tr) => [tr.getAttribute('data-fn'), tr.querySelector('.bl-fnval').textContent]))
  assert(refRows.length === Object.keys(ORACLE.ref).length, `手册列了 ${refRows.length} 个函数，真值有 ${Object.keys(ORACLE.ref).length} 个`)
  const dead = []
  for (const [f, txt] of refRows) {
    const want = ORACLE.ref[f]
    if (want === undefined) { dead.push(f + '（无真值）'); continue }
    if (Array.isArray(want)) {
      if (txt !== `${want[0] ? '真' : '假'}（共 ${want[1]} 根为真）`) dead.push(`${f}: ${txt} ≠ ${want[0] ? '真' : '假'}/${want[1]}`)
      continue
    }
    const shown = +txt.replace(/,/g, ''), dec = (txt.split('.')[1] || '').length
    if (!Number.isFinite(shown) || Math.abs(shown - want) > 0.5 * Math.pow(10, -dec) + 1e-9 * Math.abs(want)) dead.push(`${f}: ${txt} ≠ ${want}`)
  }
  assert(dead.length === 0, `指标手册里这些函数与真值不符或算不出来：${dead.join('；')}`)

  // ───────── 11. 数据：导入一份脏 CSV（倒序 + 重复 + 坏行 + 复权） ─────────
  await onTab('data')
  const CV = ORACLE.csv
  await page.fill('#bl-imp-name', '测试导入')
  await page.setInputFiles('#bl-imp-file', { name: 'AAPL.csv', mimeType: 'text/csv', buffer: Buffer.from(CV.text) })
  await act(() => page.click('#bl-imp-go'), '导入后自动切到新数据')
  const rep = await page.evaluate(() => Object.fromEntries(['kept', 'rows', 'badDate', 'badClose', 'duplicate'].map((k) => [k, +document.getElementById('bl-rep-' + k).textContent])))
  assert(rep.kept === CV.kept && rep.rows === CV.rows && rep.badDate === CV.badDate && rep.badClose === CV.badClose && rep.duplicate === CV.duplicate, '导入报告 ' + JSON.stringify(rep) + ' ≠ pandas ' + JSON.stringify(CV))
  const st = await page.textContent('#bl-imp-status')
  assert(st.includes('时间正序') && st.includes('复权'), '导入说明应提到翻正与复权：' + st)
  const prev = await page.$$eval('#bl-preview tbody tr', (trs) => trs.map((tr) => Array.from(tr.children).map((td) => td.textContent)))
  assert(prev[0][0] === CV.first[0] && prev[0][1] === price2(CV.first[1]) && prev[0][4] === price2(CV.first[2]), `复权后首行 ${prev[0].join('|')} ≠ ${CV.first.join('|')}`)
  const lastRow = prev[prev.length - 1]
  assert(lastRow[0] === CV.last[0] && lastRow[4] === price2(CV.last[2]) && lastRow[5] === grp(String(CV.last[3])), `末行 ${lastRow.join('|')} ≠ ${CV.last.join('|')}`)
  const r0306 = prev.filter((r) => r[0] === '2024-03-06')[0]
  assert(r0306 && r0306[4] === price2(CV.row0306[0]) && r0306[5] === grp(String(CV.row0306[1])), '重复日期应保留原文件里靠后的那条：' + (r0306 || []).join('|'))
  assert((await page.$eval('#bl-ds', (s) => s.value)).startsWith('d:'), '导入后应切到新数据集')
  assert(await page.$$eval('#bl-trades tbody tr', (trs) => trs.length === 1 && /一次都没有触发/.test(trs[0].textContent)), '10 根 K 线上金叉不该成交')
  // 没有英文列名的表头：德文列名 + 分号分隔 + 小数逗号（表头靠「能解析成数 / 日期的格子不到一半」识别）
  const DE = ORACLE.csvDe
  await page.fill('#bl-imp-name', '德文表头')
  await page.setInputFiles('#bl-imp-file', [])
  await page.fill('#bl-imp-text', DE.text)
  await act(() => page.click('#bl-imp-go'), '粘贴导入德文 CSV')
  const rep2 = await page.evaluate(() => ['kept', 'rows', 'badDate'].map((k) => +document.getElementById('bl-rep-' + k).textContent))
  assert(rep2[0] === DE.rows && rep2[1] === DE.rows && rep2[2] === 0, '德文表头应被认成表头：' + rep2.join(','))
  const prevDe = await page.$$eval('#bl-preview tbody tr', (trs) => trs.map((tr) => [+tr.children[4].textContent.replace(/,/g, ''), +tr.children[5].textContent.replace(/,/g, '')]))
  assert(JSON.stringify(prevDe.map((r) => r[0])) === JSON.stringify(DE.closes) && JSON.stringify(prevDe.map((r) => r[1])) === JSON.stringify(DE.vols), '小数逗号 / 成交量解析：' + JSON.stringify(prevDe))
  await page.$$eval('#bl-dslist .bl-ds', (cards) => cards.find((c) => c.querySelector('h4').textContent === '德文表头').querySelector('[data-act="del"]').click())
  await wait(() => !Array.from(document.querySelectorAll('#bl-dslist h4')).some((h) => h.textContent === '德文表头'), null, '删除德文数据集')
  // 随机行情
  await page.fill('#bl-syn-seed', '42')
  await act(() => page.click('#bl-syn-go'), '生成随机行情')
  assert(/2520 根/.test(await page.textContent('#bl-syn-status')), '10 年 × 252 根')
  assert((await page.textContent('#bl-status')).includes('2,520 根'), '随机行情已用于回测')
  // 删除导入的数据集
  await page.$$eval('#bl-dslist .bl-ds', (cards) => cards.find((c) => c.querySelector('h4').textContent === '测试导入').querySelector('[data-act="del"]').click())
  await wait(() => !Array.from(document.querySelectorAll('#bl-dslist h4')).some((h) => h.textContent === '测试导入'), null, '删除数据集')
  await act(() => page.click('#bl-dslist .bl-ds[data-id="syn"] [data-act="use"]'), '切回 SYN')

  // ───────── 12. 保存策略 + 刷新后还在；未等防抖就刷新也不丢 ─────────
  await onTab('bt')
  await page.fill('#bl-name', '我的金叉')
  await page.click('#bl-save')
  await wait(() => document.getElementById('bl-savemsg').textContent === '已保存「我的金叉」', null, '保存')
  await page.fill('#bl-rule-longExit', 'crossunder(sma(close, fast), sma(close, slow)) or close < lowest(low, 60)[1]')
  await page.reload()   // 不等 250 ms 防抖，靠 pagehide 补写
  await wait(() => document.body.getAttribute('data-ready') === '1', null, '刷新后就绪')
  assert(await page.$eval('#bl-rule-longExit', (e) => e.value) === 'crossunder(sma(close, fast), sma(close, slow)) or close < lowest(low, 60)[1]', '刷新后最后一次编辑丢了（pagehide 没补写）')
  assert(await page.$$eval('#bl-strat option', (os) => os.some((o) => o.textContent === '我的金叉')), '刷新后保存的策略不见了')
  assert(await page.$eval('#bl-strat', (s) => s.selectedOptions[0].textContent) === '我的金叉', '刷新后应停在「我的金叉」')
  assert(!(await page.$eval('#bl-dirty', (e) => e.hidden)), '有未保存改动时要提示')
  // 导出交易 CSV：表头 + 逐笔（第一笔对 backtesting.py）
  await act(() => page.selectOption('#bl-strat', 'tpl:golden'), '回到模板')
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#bl-exp-trades')])
  const csv = fs.readFileSync(await dl.path(), 'utf8').trim().split('\n')
  assert(csv[0].startsWith('#,direction,entry_date') && csv.length === G.trades.length + 1, '导出交易 CSV 行数 ' + csv.length)
  const c1 = csv[1].split(',')
  assert(c1[2] === G.entry_dates[0] && Math.abs(+c1[7] - G.trades[0].pnl) < 1e-6, '导出第一笔 ' + csv[1])
  // 导出 / 导入策略 JSON
  const [dj] = await Promise.all([page.waitForEvent('download'), page.click('#bl-export')])
  const js = JSON.parse(fs.readFileSync(await dj.path(), 'utf8'))
  assert(js.format === 'backtest-lab/strategy' && js.strategy.rules.longEntry === 'crossover(sma(close, fast), sma(close, slow))', '导出的策略 JSON')
  js.strategy.name = '导入测试'; js.strategy.params[0].value = 20; js.strategy.params[1].value = 100
  await act(() => page.setInputFiles('#bl-import', { name: 's.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(js)) }), '导入策略')
  assert(await page.$eval('#bl-strat', (s) => s.selectedOptions[0].textContent) === '导入测试', '导入后选中导入的策略')
  assert(rel(await kpiV('final'), ORACLE.optFull.final) < 1e-9, '导入的 (20, 100) 参数结果 = backtesting.py')
  // 删除需要点两次
  await page.click('#bl-del')
  assert(await page.textContent('#bl-del') === '再点一次确认删除', '删除要二次确认')
  await act(() => page.click('#bl-del'), '确认删除')
  assert(!(await page.$$eval('#bl-strat option', (os) => os.some((o) => o.textContent === '导入测试'))), '删掉后选项应消失')

  // ───────── 13. 渲染守卫（全部页签 × 3 个视口） ─────────
  const nCtl = await renderGuards(page, {
    assert, tabs: ORACLE.meta.tabs, onTab,
    paneSel: (t) => `#bl-pane-${t}`, panesRoot: '#bl-panes',
    figSel: (t) => `#bl-pane-${t} svg.bl-fig`, cardSel: '.bl-card', childSel: 'svg,dl,h2,p,.bl-tablewrap,.bl-hmwrap',
    minControls: 90, minTextsInFig: 4,
  })
  assert(nCtl >= 90, '控件数 ' + nCtl)
  await onTab('bt')
  // 顶栏是 position:sticky，页面滚下去以后它会按设计盖在内容上 —— 按视口坐标两两比会把这种「设计内的覆盖」误报成重叠，先回到顶部
  await page.evaluate(() => window.scrollTo(0, 0))
  await guardBoxOverlap(page, { assert, sel: '#bl-tabs .bl-tab, .bl-kpi, #bl-range button, #bl-dir button, .bl-snip, #bl-subtabs .bl-subtab, .bl-prow .bl-fl' })
  // 图上文字守卫要真的扫到文字：价格图刻度 ≥ 8 段、回撤图有标注
  const nPriceTxt = await page.$$eval('#bl-price text', (ts) => ts.filter((t) => t.textContent.trim()).length)
  assert(nPriceTxt >= 8, '价格图文字太少 ' + nPriceTxt)
  assert(await page.$eval('#bl-price', (s) => +s.getAttribute('data-dropped')) <= 2, '价格图刻度被避让器丢掉太多')

  // ───────── 14. 截图 ─────────
  await page.setViewportSize({ width: 1280, height: 850 })
  await onTab('bt')
  await chartsSynced()
  await page.evaluate(() => window.scrollTo(0, document.querySelector('.bl-toolbar').getBoundingClientRect().top + window.scrollY - document.querySelector('.bl-nav').offsetHeight - 12))
  await screenshot('thumb.png')
}
