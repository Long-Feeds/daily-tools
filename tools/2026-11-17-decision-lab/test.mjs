// Decision Lab 集成测试。真值全部来自 run 目录 toracle/gen_truth.py：只调 pymcdm 1.4.0 / pyDecision 5.1.8 /
// AHPy 2.1 / numpy / scipy（SMAA 用 Python 逐行移植的 mulberry32 + pymcdm TOPSIS 打分），不经过页面引擎；
// 由 tools/inject-oracle.mjs 机械注入下面的 ORACLE 块，一个数都不手打。
import fs from 'node:fs'
import { renderGuards, guardBoxOverlap, guardControlSize } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const ORACLE = {
 "laptop": {
  "input": {
   "alts": [
    "轻薄本 A",
    "全能本 B",
    "游戏本 C",
    "商务本 D",
    "入门本 E",
    "创作本 F"
   ],
   "crits": [
    "价格",
    "保修",
    "重量",
    "续航",
    "屏幕尺寸",
    "性能跑分"
   ],
   "dirs": [
    "min",
    "max",
    "min",
    "max",
    "range",
    "max"
   ],
   "X": [
    [
     5999,
     2,
     1.12,
     14.5,
     13.3,
     9800
    ],
    [
     7299,
     2,
     1.46,
     11,
     14,
     14200
    ],
    [
     8999,
     1,
     2.35,
     5.5,
     16,
     23800
    ],
    [
     6899,
     3,
     1.28,
     16,
     14,
     10900
    ],
    [
     3999,
     1,
     1.65,
     8,
     15.6,
     6500
    ],
    [
     9999,
     2,
     1.58,
     9.5,
     16,
     18600
    ]
   ],
   "groups": [
    "花费",
    "花费",
    "便携",
    "便携",
    "便携",
    "性能"
   ]
  },
  "posRange": [
   0.8666666666666671,
   1,
   0,
   1,
   0.26666666666666694,
   0
  ],
  "ahp": {
   "eigen": {
    "groupW": [
     0.5396145502210747,
     0.29696133121249724,
     0.163424118566428
    ],
    "groupCR": 0.007933373029552273,
    "groupLam": 3.0092027127142806,
    "groupCI": 0.004601356357140318,
    "localA": [
     0.8,
     0.19999999999999998
    ],
    "localB": [
     0.3089956436328643,
     0.5815520668516159,
     0.10945228951551982
    ],
    "bCR": 0.003184998330723208,
    "bLam": 3.003694598063639,
    "global": [
     0.4316916401768598,
     0.10792291004421493,
     0.09175975767207778,
     0.17269847594163504,
     0.03250309759878442,
     0.163424118566428
    ],
    "CRtotal": 0.003184998330723208
   },
   "geo": {
    "groupW": [
     0.5396145502210746,
     0.2969613312124974,
     0.1634241185664279
    ],
    "groupCR": 0.00793337302955036,
    "groupLam": 3.0092027127142784,
    "groupCI": 0.004601356357139208,
    "localA": [
     0.8,
     0.2
    ],
    "localB": [
     0.3089956436328642,
     0.581552066851616,
     0.10945228951551983
    ],
    "bCR": 0.0031849983307235905,
    "bLam": 3.0036945980636394,
    "global": [
     0.43169164017685974,
     0.10792291004421493,
     0.0917597576720778,
     0.17269847594163518,
     0.03250309759878444,
     0.1634241185664279
    ],
    "CRtotal": 0.003184998330723591
   },
   "arith": {
    "groupW": [
     0.538961038961039,
     0.2972582972582973,
     0.16378066378066378
    ],
    "groupCR": 0.007938506010665607,
    "groupLam": 3.009208666972372,
    "groupCI": 0.004604333486186052,
    "localA": [
     0.8,
     0.2
    ],
    "localB": [
     0.30915032679738563,
     0.5812636165577342,
     0.10958605664488018
    ],
    "bCR": 0.003186283106342051,
    "bLam": 3.003696088403357,
    "global": [
     0.4311688311688312,
     0.1077922077922078,
     0.091897499740637,
     0.17278543291615187,
     0.032575364601508394,
     0.16378066378066378
    ],
    "CRtotal": 0.003186283106342051
   },
   "ahpyGlobal": {
    "价格": 0.43169164,
    "续航": 0.17269848,
    "保修": 0.10792291,
    "重量": 0.09175976,
    "屏幕尺寸": 0.0325031
   },
   "groupCR2005": 0.00884876,
   "groupCRdd": 0.00936377
  },
  "methods": {
   "saw": [
    0.6408856426024354,
    0.5103200714409241,
    0.2353727252625713,
    0.6575532090792424,
    0.5336988179190597,
    0.2914968691383013
   ],
   "topsis": [
    0.590855396685316,
    0.4749244343293932,
    0.35318175467969765,
    0.5612968010598985,
    0.5815476792428996,
    0.30055504805253896
   ],
   "topsis_pyd": [
    0.590855396685316,
    0.47492443432939313,
    0.35318175467969765,
    0.5612968010598985,
    0.5815476792428997,
    0.30055504805253896
   ],
   "vikorS": [
    0.3591143573975645,
    0.48967992855907594,
    0.7646272747374286,
    0.3424467909207576,
    0.4663011820809402,
    0.7085031308616987
   ],
   "vikorR": [
    0.1438972133922866,
    0.2374304020972729,
    0.3597430334807165,
    0.20865095941881556,
    0.163424118566428,
    0.4316916401768598
   ],
   "vikor": [
    0.019739859036265482,
    0.3368722688307086,
    0.875,
    0.11249999999999999,
    0.18060926670705657,
    0.9335306272706563
   ],
   "vikor_pymcdm": [
    0.019739859036265482,
    0.3368722688307086,
    0.875,
    0.11249999999999999,
    0.18060926670705657,
    0.9335306272706563
   ],
   "gra": [
    0.6271289922021299,
    0.5170372343677498,
    0.4602698973849878,
    0.6710416671044264,
    0.6530310878932808,
    0.44041762704357534
   ],
   "promethee": [
    0.19519730403441576,
    0.038518618640601965,
    -0.2914181967734213,
    0.21519838380658401,
    0.06657311441436498,
    -0.22406922412254537
   ],
   "edas": [
    0.8594372159173822,
    0.6120267562037164,
    0.26407627665036804,
    0.9437806255764207,
    0.6255279760247605,
    0.300891578263769
   ],
   "copras": [
    0.9776455873218972,
    0.8823414448598234,
    0.7006372760771556,
    1,
    0.9089861189334352,
    0.7475998423318508
   ],
   "topsis_minmax": [
    0.6269045188224834,
    0.47141822738124106,
    0.295996812696858,
    0.5670215040026154,
    0.6450281440649471,
    0.2531993908881406
   ],
   "promethee_gauss": [
    0.15405433885488778,
    0.027506569849090737,
    -0.23675126867323062,
    0.17270213312878585,
    0.06210212646179358,
    -0.17961389962132743
   ],
   "ranks": {
    "saw": [
     2,
     4,
     6,
     1,
     3,
     5
    ],
    "topsis": [
     1,
     4,
     5,
     3,
     2,
     6
    ],
    "vikor": [
     1,
     4,
     5,
     2,
     3,
     6
    ],
    "gra": [
     3,
     4,
     5,
     1,
     2,
     6
    ],
    "promethee": [
     2,
     4,
     6,
     1,
     3,
     5
    ],
    "edas": [
     2,
     4,
     6,
     1,
     3,
     5
    ],
    "copras": [
     2,
     4,
     6,
     1,
     3,
     5
    ]
   },
   "vikor03": [
    0.011843915421759289,
    0.3321233612984251,
    0.825,
    0.15749999999999997,
    0.13550563412825148,
    0.9601183763623937
   ]
  },
  "vikorComp": {
   "c1": false,
   "c2": true,
   "compromise": [
    0,
    3,
    4
   ]
  },
  "compare": {
   "keys": [
    "saw",
    "topsis",
    "vikor",
    "gra",
    "promethee"
   ],
   "rho": [
    [
     1,
     0.7714285714285715,
     0.8857142857142858,
     0.8857142857142858,
     1
    ],
    [
     0.7714285714285715,
     1,
     0.942857142857143,
     0.7714285714285715,
     0.7714285714285715
    ],
    [
     0.8857142857142858,
     0.942857142857143,
     1,
     0.8285714285714287,
     0.8857142857142858
    ],
    [
     0.8857142857142858,
     0.7714285714285715,
     0.8285714285714287,
     1,
     0.8857142857142858
    ],
    [
     1,
     0.7714285714285715,
     0.8857142857142858,
     0.8857142857142858,
     1
    ]
   ],
   "tau": [
    [
     0.9999999999999999,
     0.6,
     0.7333333333333333,
     0.7333333333333333,
     0.9999999999999999
    ],
    [
     0.6,
     0.9999999999999999,
     0.8666666666666666,
     0.6,
     0.6
    ],
    [
     0.7333333333333333,
     0.8666666666666666,
     0.9999999999999999,
     0.7333333333333333,
     0.7333333333333333
    ],
    [
     0.7333333333333333,
     0.6,
     0.7333333333333333,
     0.9999999999999999,
     0.7333333333333333
    ],
    [
     0.9999999999999999,
     0.6,
     0.7333333333333333,
     0.7333333333333333,
     0.9999999999999999
    ]
   ],
   "meanRank": [
    1.8,
    4,
    5.4,
    1.6,
    2.6,
    5.6
   ],
   "borda": [
    21,
    10,
    3,
    22,
    17,
    2
   ],
   "copeland": [
    3,
    -1,
    -3,
    5,
    1,
    -5
   ],
   "final": [
    2,
    4,
    5,
    1,
    3,
    6
   ]
  },
  "reversals": [
   {
    "t": 0.37062927613198077,
    "a": 3,
    "b": 0
   },
   {
    "t": 0.4458485834923047,
    "a": 0,
    "b": 4
   }
  ],
  "smaa": {
   "acc": [
    [
     0.1115,
     0.4725,
     0.2475,
     0.039,
     0.129,
     0.0005
    ],
    [
     0.094,
     0.2015,
     0.593,
     0.11,
     0.0015,
     0
    ],
    [
     0.0915,
     0.023,
     0.023,
     0.0815,
     0.2495,
     0.5315
    ],
    [
     0.646,
     0.184,
     0.073,
     0.0905,
     0.005,
     0.0015
    ],
    [
     0.035,
     0.018,
     0.03,
     0.2965,
     0.266,
     0.3545
    ],
    [
     0.022,
     0.101,
     0.0335,
     0.3825,
     0.349,
     0.112
    ]
   ],
   "holistic": [
    0.6794,
    0.6553,
    0.2062,
    0.8742,
    0.2392,
    0.3457
   ],
   "central": [
    [
     0.32681033483185534,
     0.062057137453128845,
     0.27072097614810603,
     0.13189463462437867,
     0.1263097488688545,
     0.08220716807367626
    ],
    [
     0.12289077941658018,
     0.0826874899353819,
     0.13132909289490083,
     0.08292167041219788,
     0.300624049528378,
     0.279546917812561
    ],
    [
     0.14342271359716635,
     0.09409707403347232,
     0.09567173912138484,
     0.10300661090575716,
     0.08840192822432065,
     0.4753999341178986
    ],
    [
     0.1363269515229307,
     0.21457907380582247,
     0.16138974670366923,
     0.20464169542689623,
     0.16794235303751603,
     0.11512017950316511
    ],
    [
     0.5731165160452544,
     0.07368143896046282,
     0.1126839499796488,
     0.08020108790482663,
     0.056280782090289284,
     0.10403622501951806
    ],
    [
     0.06754143814322013,
     0.14538875006491006,
     0.2776971802872954,
     0.10861143139291875,
     0.04833702970367504,
     0.35242417040798074
    ]
   ],
   "firsts": [
    223,
    188,
    183,
    1292,
    70,
    44
   ]
  },
  "smaaOrd": {
   "acc": [
    [
     0.336,
     0.664,
     0,
     0,
     0,
     0
    ],
    [
     0,
     0,
     0.392,
     0.608,
     0,
     0
    ],
    [
     0,
     0,
     0.008,
     0.064,
     0.624,
     0.304
    ],
    [
     0.508,
     0.244,
     0.248,
     0,
     0,
     0
    ],
    [
     0.156,
     0.092,
     0.352,
     0.262,
     0.034,
     0.104
    ],
    [
     0,
     0,
     0,
     0.066,
     0.342,
     0.592
    ]
   ],
   "holistic": [
    0.8672,
    0.4784,
    0.1552,
    0.8520000000000001,
    0.5524,
    0.09480000000000001
   ],
   "central": [
    [
     0.43371149672630127,
     0.08506009525555175,
     0.051037480192406934,
     0.2614165456383861,
     0.02684174830580554,
     0.1419326338815486
    ],
    [
     0,
     0,
     0,
     0,
     0,
     0
    ],
    [
     0,
     0,
     0,
     0,
     0,
     0
    ],
    [
     0.31312497849271065,
     0.12824593216940453,
     0.07777185066653004,
     0.25309536469870175,
     0.0347406219116445,
     0.19302125206100845
    ],
    [
     0.5744398513548185,
     0.07087137662734723,
     0.04276510310286478,
     0.18084630210786606,
     0.016039010915258427,
     0.1150383558918451
    ],
    [
     0,
     0,
     0,
     0,
     0,
     0
    ]
   ],
   "firsts": [
    168,
    0,
    0,
    254,
    78,
    0
   ]
  },
  "entropy": {
   "w": [
    0.14580511986072464,
    0.21702313650372546,
    0.09628537276434751,
    0.141550548204425,
    0.23497255307493997,
    0.16436326959183747
   ],
   "e": [
    0.8276748931958565,
    0.7435032788101106,
    0.8862016151343501,
    0.8327033141167272,
    0.7222891051880785,
    0.8057412660532972
   ]
  },
  "entropyRatio": [
   0.061957185745702276,
   0.09119757188665195,
   0.03102378556789209,
   0.07371108253195727,
   0.634087298266373,
   0.10802307600142336
  ],
  "entropyRatioScipy": [
   0.06195717921397558,
   0.09119756705852405,
   0.03102377727185266,
   0.07371107668502168,
   0.6340873276170327,
   0.10802307215359333
  ],
  "critic": [
   0.19139538214145416,
   0.1245571111284456,
   0.11137184211213934,
   0.10909679720952754,
   0.1508000331074443,
   0.312778834300989
  ],
  "critic_pymcdm_negcost": [
   0.1913953821389072,
   0.124557111133018,
   0.11137184210160452,
   0.10909679720911654,
   0.1508000331205201,
   0.3127788342968337
  ],
  "cv": [
   0.15787110144638217,
   0.21824489821867316,
   0.144403644743312,
   0.19575686992279906,
   0.04259213460656117,
   0.24113135106227246
  ],
  "std": [
   0.1542328105241983,
   0.16289537351044678,
   0.15039970966603303,
   0.1631884388871285,
   0.21077480282611666,
   0.15850886458607674
  ],
  "combLinear": [
   0.2887483800187922,
   0.1624730232739702,
   0.09402256521821264,
   0.15712451207303002,
   0.13373782533686218,
   0.16389369407913273
  ],
  "combLinear03": [
   0.23157107595556517,
   0.18429306856587227,
   0.09492768823666659,
   0.150894926525588,
   0.17423171643209331,
   0.16408152428421463
  ],
  "combMult": [
   0.40833914508619934,
   0.15194775414695158,
   0.05731749166583647,
   0.15858958514832633,
   0.04954690033002532,
   0.17425912362266097
  ],
  "methodsComb": {
   "topsis": [
    0.5971270788189001,
    0.5741024765592088,
    0.34752669588086466,
    0.6458569977551146,
    0.4399752043136005,
    0.3390089535489605
   ]
  },
  "maxminusTopsis": [
   0.6445611644968563,
   0.4626902297813863,
   0.2504167915480718,
   0.5377150611324473,
   0.7477918776876598,
   0.18434443713601462
  ],
  "roc": {
   "ranks": [
    2,
    5,
    4,
    1,
    6,
    3
   ],
   "w": [
    0.2416666666666667,
    0.06111111111111112,
    0.1027777777777778,
    0.4083333333333333,
    0.02777777777777778,
    0.15833333333333333
   ]
  }
 },
 "supplier": {
  "input": {
   "alts": [
    "华东精工",
    "北辰制造",
    "南岭科技",
    "西山工业",
    "东港机电"
   ],
   "crits": [
    "报价",
    "交付周期",
    "合格率",
    "准时交付率",
    "服务评分"
   ],
   "dirs": [
    "min",
    "min",
    "max",
    "max",
    "max"
   ],
   "X": [
    [
     128.5,
     21,
     99.2,
     96.5,
     8.1
    ],
    [
     116,
     30,
     97.8,
     91,
     7.4
    ],
    [
     139.9,
     14,
     99.6,
     98.2,
     8.8
    ],
    [
     109.8,
     35,
     96.1,
     88.5,
     6.9
    ],
    [
     121.3,
     25,
     98.7,
     94,
     9.2
    ]
   ]
  },
  "w": [
   0.2635565153326395,
   0.07481612120335822,
   0.4098965677396048,
   0.16772828888159771,
   0.08400250684279985
  ],
  "CR": 0.11064286104419,
  "suggest": [
   {
    "i": 1,
    "j": 4,
    "to": "2",
    "CR": 0.01637537601244917
   },
   {
    "i": 1,
    "j": 2,
    "to": "1/9",
    "CR": 0.07287845927040904
   },
   {
    "i": 3,
    "j": 4,
    "to": "2",
    "CR": 0.08594887594000641
   }
  ],
  "lam": 5.495680017477971,
  "CR2005": 0.11163964,
  "after": {
   "w": [
    0.2683598655335796,
    0.10093099974374523,
    0.41462202623656574,
    0.16580425361613715,
    0.050282854869972284
   ],
   "CR": 0.01637537601244917
  },
  "methods": {
   "saw": [
    0.694907410780017,
    0.48766546256446214,
    0.721834353042526,
    0.2635565153326395,
    0.6820896589776615
   ],
   "topsis": [
    0.5308529140174166,
    0.501919553077271,
    0.5116299159369405,
    0.4830125372752388,
    0.5796795947470682
   ],
   "topsis_pyd": [
    0.5308529140174169,
    0.501919553077271,
    0.5116299159369405,
    0.4830125372752388,
    0.579679594747068
   ],
   "vikorS": [
    0.30509258921998306,
    0.512334537435538,
    0.27816564695747426,
    0.7364434846673606,
    0.3179103410223386
   ],
   "vikorR": [
    0.16373776866180595,
    0.210803949123225,
    0.2635565153326395,
    0.4098965677396048,
    0.10540197456161168
   ],
   "vikor": [
    0.12516958546867676,
    0.4285648293307547,
    0.2597000805833327,
    1,
    0.04336309853371614
   ],
   "vikor_pymcdm": [
    0.12516958546867676,
    0.4285648293307547,
    0.2597000805833327,
    1,
    0.04336309853371614
   ],
   "gra": [
    0.6631834675369026,
    0.5186214742817465,
    0.8026175901628942,
    0.5090376768884264,
    0.6305128872526491
   ],
   "promethee": [
    0.15612091330069483,
    -0.10293152196874888,
    0.18977959112883086,
    -0.383067706008527,
    0.1400987235477503
   ],
   "edas": [
    0.5998852054648178,
    0.40280663735033057,
    0.7027037304029875,
    0.26328086998239403,
    0.6654493271187204
   ],
   "copras": [
    0.9915934884453662,
    0.96886560288346,
    1,
    0.9507446442600689,
    0.9998056308939101
   ],
   "topsis_minmax": [
    0.6941142250186797,
    0.5248268743099883,
    0.6325968188664542,
    0.3657941903150797,
    0.6881349309251422
   ],
   "promethee_gauss": [
    0.13453218107527626,
    -0.07531762251658294,
    0.13968688941854018,
    -0.3353704932178535,
    0.13646904524061987
   ]
  }
 },
 "city": {
  "input": {
   "alts": [
    "城市 A",
    "城市 B",
    "城市 C",
    "城市 D",
    "城市 E",
    "城市 F",
    "城市 G",
    "城市 H"
   ],
   "crits": [
    "人均可支配收入",
    "房价收入比",
    "PM2.5",
    "平均通勤",
    "建成区绿化率",
    "每千人医生数",
    "年均气温"
   ],
   "dirs": [
    "max",
    "min",
    "min",
    "min",
    "max",
    "max",
    "target"
   ],
   "X": [
    [
     6.8,
     18.2,
     30,
     41,
     41.5,
     3.6,
     16.2
    ],
    [
     5.2,
     11.5,
     38,
     33,
     39,
     3.1,
     18.9
    ],
    [
     7.6,
     24.8,
     27,
     47,
     43.2,
     4.2,
     22.4
    ],
    [
     4.1,
     8.9,
     45,
     28,
     36.8,
     2.7,
     13.5
    ],
    [
     5.9,
     13.7,
     22,
     36,
     44.6,
     3.3,
     15.8
    ],
    [
     4.8,
     10.2,
     51,
     31,
     35.1,
     2.9,
     11.2
    ],
    [
     6.3,
     16.4,
     34,
     39,
     40.3,
     3.8,
     20.1
    ],
    [
     3.7,
     7.6,
     29,
     26,
     38.4,
     2.4,
     17.3
    ]
   ]
  },
  "posTemp": [
   0.8620689655172413,
   0.6724137931034486,
   0.06896551724137967,
   0.39655172413793116,
   0.7931034482758622,
   0,
   0.46551724137931016,
   0.9482758620689654
  ],
  "entropy": [
   0.17192040546275203,
   0.10633773490865485,
   0.12658101893365123,
   0.12451980547930301,
   0.14789311439286876,
   0.15758126125634755,
   0.16516665956642257
  ],
  "e": [
   0.8610637183212541,
   0.9140638980545586,
   0.8977044286603969,
   0.8993701839982959,
   0.8804812067286193,
   0.8726517981255726,
   0.8665217111622633
  ],
  "methods": {
   "saw": [
    0.6595368391415726,
    0.5272197174334603,
    0.572368832379476,
    0.3765817165133301,
    0.7222344870865323,
    0.27739860223228174,
    0.5727818068564511,
    0.5434245774662884
   ],
   "topsis": [
    0.7176155646209897,
    0.6193596952260683,
    0.3862481748433498,
    0.44501673089838567,
    0.733094764524302,
    0.2980511354366199,
    0.5327313632869095,
    0.6669540922550473
   ],
   "topsis_pyd": [
    0.7176155646209897,
    0.6193596952260683,
    0.3862481748433497,
    0.4450167308983857,
    0.7330947645243019,
    0.2980511354366198,
    0.5327313632869094,
    0.6669540922550473
   ],
   "vikorS": [
    0.3404631608584275,
    0.47278028256653964,
    0.427631167620524,
    0.6234182834866697,
    0.2777655129134677,
    0.7226013977677181,
    0.4272181931435489,
    0.45657542253371164
   ],
   "vikorR": [
    0.08894271819950215,
    0.10579717259246277,
    0.15315453887068267,
    0.15428754336400827,
    0.07879063062817379,
    0.16516665956642254,
    0.08408484487017877,
    0.17192040546275203
   ],
   "vikor": [
    0.12497784374463289,
    0.3641926919715313,
    0.5676993354547242,
    0.793848952779402,
    0,
    0.9637401362328759,
    0.19641016681785597,
    0.7009841333718284
   ],
   "vikor_pymcdm": [
    0.12497784374463294,
    0.3641926919715313,
    0.5676993354547243,
    0.793848952779402,
    0,
    0.9637401362328761,
    0.19641016681785617,
    0.7009841333718284
   ],
   "gra": [
    0.6261795609910438,
    0.5283187977529741,
    0.6726658484544219,
    0.49883428308892896,
    0.6955429145287003,
    0.44759415864831253,
    0.5491653083853794,
    0.6553812303646747
   ],
   "promethee": [
    0.14639259057474102,
    -0.004826977091672846,
    0.04677201141805937,
    -0.17698469242896445,
    0.2180470453689809,
    -0.2903368230358769,
    0.047243982248887956,
    0.01369286294584493
   ],
   "edas": [
    0.799315941411955,
    0.5939896749274689,
    0.3461395411136003,
    0.35036721481632566,
    0.8420691536747444,
    0.0920944256889725,
    0.5231174660814342,
    0.8167231605929084
   ],
   "copras": [
    0.9733557674380872,
    0.8897705362877464,
    0.773567859626943,
    0.7727308630455517,
    0.9988804874729331,
    0.6499129483612327,
    0.8611056147163184,
    1
   ],
   "topsis_minmax": [
    0.6573108153332495,
    0.5151644467727275,
    0.5576583008806287,
    0.3849939440861454,
    0.6834663432079685,
    0.32251449989253206,
    0.5774367718232578,
    0.5025179234403907
   ],
   "promethee_gauss": [
    0.12144682197567022,
    0.003718336420324417,
    0.02865455338101247,
    -0.14448086594480708,
    0.17930431873033245,
    -0.24220801985301468,
    0.04668265337938321,
    0.006882201911099006
   ]
  },
  "critic": [
   0.14293912769968525,
   0.17966589639374445,
   0.10643389094023531,
   0.18385932813085212,
   0.1114000169330217,
   0.14230403111407766,
   0.13339770878838356
  ]
 },
 "paste": {
  "Y": [
   [
    12,
    3.5,
    1,
    0.75
   ],
   [
    9,
    4.1,
    0,
    0.5
   ],
   [
    15,
    2.8,
    0.8333333333333334,
    0
   ],
   [
    11,
    3.9,
    1,
    1
   ],
   [
    9,
    4.1,
    0,
    0.5
   ]
  ],
  "topsis": [
   0.785911759378493,
   0.3898202505354623,
   0.401040277606926,
   0.9204100061292092,
   0.3898202505354623
  ],
  "saw": [
   0.6971153846153847,
   0.625,
   0.20833333333333334,
   0.8782051282051282,
   0.625
  ],
  "compare": {
   "rho": [
    [
     1,
     0.6842105263157895,
     1,
     0.6842105263157895,
     1
    ],
    [
     0.6842105263157895,
     1,
     0.6842105263157895,
     0.15789473684210528,
     0.6842105263157895
    ],
    [
     1,
     0.6842105263157895,
     1,
     0.6842105263157895,
     1
    ],
    [
     0.6842105263157895,
     0.15789473684210528,
     0.6842105263157895,
     1,
     0.6842105263157895
    ],
    [
     1,
     0.6842105263157895,
     1,
     0.6842105263157895,
     1
    ]
   ],
   "tau": [
    [
     1,
     0.5555555555555556,
     1,
     0.5555555555555556,
     1
    ],
    [
     0.5555555555555556,
     1,
     0.5555555555555556,
     0.1111111111111111,
     0.5555555555555556
    ],
    [
     1,
     0.5555555555555556,
     1,
     0.5555555555555556,
     1
    ],
    [
     0.5555555555555556,
     0.1111111111111111,
     0.5555555555555556,
     1,
     0.5555555555555556
    ],
    [
     1,
     0.5555555555555556,
     1,
     0.5555555555555556,
     1
    ]
   ],
   "ranks": {
    "saw": [
     2,
     3,
     5,
     1,
     3
    ],
    "topsis": [
     2,
     4,
     3,
     1,
     4
    ],
    "vikor": [
     2,
     3,
     5,
     1,
     3
    ],
    "gra": [
     4,
     2,
     5,
     1,
     2
    ],
    "promethee": [
     2,
     3,
     5,
     1,
     3
    ]
   },
   "meanRank": [
    2.4,
    3,
    4.6,
    1,
    3
   ],
   "borda": [
    13,
    10,
    2,
    20,
    10
   ],
   "copeland": [
    2,
    -1,
    -4,
    4,
    -1
   ]
  },
  "A4": {
   "w": [
    0.5650090537990473,
    0.2622012055608733,
    0.11750425004139856,
    0.055285490598680896
   ],
   "CR": 0.04332683090639471,
   "lam": 4.116982443447266,
   "topsis": [
    0.5991408653699188,
    0.6542942212814037,
    0.29192158607313057,
    0.736717131406097,
    0.6542942212814037
   ]
  }
 },
 "offline": {
  "suites": {
   "s1": [
    13308,
    13308
   ],
   "s2": [
    18836,
    18836
   ],
   "s3": [
    41836,
    41836
   ],
   "s4": [
    6159,
    6159
   ],
   "s5": [
    17000,
    17000
   ],
   "s6": [
    2662,
    2662
   ],
   "s7": [
    11596,
    11596
   ]
  },
  "total": 111397,
  "pass": 111397,
  "coprasCost": 865,
  "coprasDiff": 833,
  "coprasRank": 757
 },
 "vikorDeg": {
  "X": [
   [
    2,
    4,
    4,
    2,
    2,
    1,
    1,
    4,
    1,
    4
   ],
   [
    4,
    4,
    4,
    4,
    1,
    2,
    2,
    1,
    4,
    4
   ],
   [
    4,
    2,
    1,
    1,
    3,
    3,
    3,
    2,
    1,
    3
   ],
   [
    2,
    4,
    1,
    2,
    3,
    3,
    1,
    2,
    1,
    4
   ]
  ],
  "t": [
   1,
   -1,
   -1,
   1,
   1,
   -1,
   1,
   -1,
   -1,
   -1
  ],
  "Q": [
   0,
   0,
   0,
   0
  ],
  "R": [
   0.1,
   0.1,
   0.1,
   0.1
  ],
  "S": [
   0.7166666666666667,
   0.6,
   0.23333333333333334,
   0.6
  ]
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const TABS = ['data', 'weights', 'rank', 'compare', 'sens', 'export', 'about']
  const near = (a, b, tol, msg) => assert(typeof a === 'number' && Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b}（容差 ${tol}）`)
  const nearV = (a, b, tol, msg) => {
    assert(Array.isArray(a) && a.length === b.length, `${msg}: 长度 ${a && a.length} ≠ ${b.length}`)
    let worst = 0
    for (let i = 0; i < b.length; i++) { const d = Math.abs(a[i] - b[i]); if (!(d <= worst)) worst = d }
    assert(worst <= tol, `${msg}: max|Δ| = ${worst}（容差 ${tol}）`)
  }
  const f4 = (v) => { const s = v.toFixed(4); return s === '-0.0000' ? '0.0000' : s }
  const settle = () => page.waitForFunction(() => {
    const A = window.DLA; if (!A) return false
    const R = A.results(), k = A.stateKey()
    const p = document.querySelector('#dl-panes > [role=tabpanel]:not([hidden])')
    return !!R && R.key === k && !!p && p.dataset.key === k
  }, null, { timeout: 15000 })
  const onTab = async (t) => {
    await page.click('#dl-tab-' + t)
    await page.waitForFunction((x) => !document.getElementById('dl-pane-' + x).hidden, t)
    await settle()
  }
  const getR = () => page.evaluate(() => {
    const R = window.DLA.results()
    const pick = (r) => r && !r.error ? { score: r.score, rank: r.rank, S: r.S, R: r.R, Q: r.Q, c1: r.c1, c2: r.c2, compromise: r.compromise } : { error: r ? r.error : 'none' }
    const m = {}; for (const k in R.methods) m[k] = pick(R.methods[k])
    const W = R.W ? { subj: R.W.subj, obj: R.W.obj, final: R.W.final, subjErr: R.W.subjErr, objErr: R.W.objErr,
      objInfo: R.W.objInfo ? { e: R.W.objInfo.e, w: R.W.objInfo.w } : null,
      ahp: R.W.subjInfo && R.W.subjInfo.kind === 'ahp' ? { blocks: R.W.subjInfo.blocks.map((b) => ({ key: b.key, w: b.res.w, CR: b.res.CR, lambda: b.res.lambda, CI: b.res.CI, RI: b.res.RI })), CRtotal: R.W.subjInfo.hier ? R.W.subjInfo.hier.CRtotal : null } : null } : null
    return { ok: R.ok, err: R.err, m, W, Y: R.P ? R.P.Y : null, order: R.order, cons: R.cons, rho: R.rho, tau: R.tau,
      sweep: R.sweep ? { reversals: R.sweep.reversals } : null, smaa: R.smaa ? { acc: R.smaa.acc, holistic: R.smaa.holistic, central: R.smaa.central, n: R.smaa.n } : null }
  })
  const col = (Y, j) => Y.map((r) => r[j])
  const pageErrors = []
  page.on('pageerror', (e) => pageErrors.push(e.message))

  // ───────── 0. 首次打开：默认载入「笔记本电脑选购」 ─────────
  await page.goto(toolURL)
  await settle()
  assert(await page.title() === '综合评价工作台 · Decision Lab', '标题')
  assert(await page.$eval('#dl-back', (a) => a.getAttribute('href')) === '../../', '顶部返回链接指向 ../../')
  const L = ORACLE.laptop
  // 页面示例数据 == 真值脚本的输入（两边各写一份，先交叉核对）
  const grid = await page.evaluate(() => ({ alts: DLA.state().alts.map((a) => a.name), crits: DLA.state().crits.map((c) => c.name), dirs: DLA.state().crits.map((c) => c.dir), cells: DLA.state().cells, groups: DLA.state().crits.map((c) => c.group) }))
  assert(JSON.stringify(grid.alts) === JSON.stringify(L.input.alts), '方案名与真值输入一致')
  assert(JSON.stringify(grid.crits) === JSON.stringify(L.input.crits), '指标名与真值输入一致')
  assert(JSON.stringify(grid.dirs) === JSON.stringify(L.input.dirs), '指标方向与真值输入一致')
  assert(JSON.stringify(grid.groups) === JSON.stringify(L.input.groups), '准则层与真值输入一致')
  assert(JSON.stringify(grid.cells.map((r) => r.map(Number))) === JSON.stringify(L.input.X), '数据与真值输入一致')
  assert(await page.$$eval('#dl-dgrid tbody tr', (rs) => rs.length) === 6, '网格 6 行方案')
  assert(await page.$$eval('#dl-dgrid tbody tr:first-child .dl-v', (cs) => cs.length) === 6, '网格 6 列指标')

  // 区间型正向化（清风口径，独立 Python 实现）
  let R = await getR()
  nearV(col(R.Y, 4), L.posRange, 1e-12, '屏幕尺寸区间型正向化')
  const posTxt = await page.$$eval('#dl-postbl tbody tr', (rs) => rs.map((r) => r.lastElementChild.textContent.trim()))
  assert(JSON.stringify(posTxt) === JSON.stringify(L.posRange.map(f4)), `正向化表显示 ${posTxt}`)
  assert(await page.$eval('#dl-alert', (el) => getComputedStyle(el).display) === 'none', '无错误时全局提示条计算样式为 none')

  // ───────── 1. 赋权：两层 AHP ─────────
  await onTab('weights')
  R = await getR()
  const A = L.ahp
  nearV(R.W.final, A.eigen.global, 1e-12, 'AHP 特征向量法全局权重（pyDecision me 逐块相乘）')
  nearV(R.W.final, [A.ahpyGlobal['价格'], A.ahpyGlobal['保修'], A.ahpyGlobal['重量'], A.ahpyGlobal['续航'], A.ahpyGlobal['屏幕尺寸'], A.eigen.groupW[2]], 5e-8, 'AHP 全局权重对 AHPy 两层结构')
  const gb = R.W.ahp.blocks.find((b) => b.key === 'groups')
  nearV(gb.w, A.eigen.groupW, 1e-12, '准则层权重')
  near(gb.CR, A.eigen.groupCR, 1e-12, '准则层 CR（Saaty 1980）')
  near(gb.lambda, A.eigen.groupLam, 1e-12, '准则层 λmax')
  near(R.W.ahp.CRtotal, A.eigen.CRtotal, 1e-12, '层次总排序 CR')
  assert(await page.$eval('#dl-crtotal', (el) => el.textContent.trim()) === f4(A.eigen.CRtotal), '层次总排序 CR 显示')
  assert(await page.$eval('[data-blk="groups"] [data-ahp="cr"]', (el) => el.textContent.trim()) === f4(A.eigen.groupCR), '准则层 CR 显示')
  assert(await page.$eval('[data-blk="groups"] [data-ahp="lambda"]', (el) => el.textContent.trim()) === f4(A.eigen.groupLam), '准则层 λmax 显示')
  assert(await page.$$eval('.dl-ahpblk', (bs) => bs.length) === 3, '两层 AHP 显示 3 个判断块（准则层 + 两个多成员组）')
  const wShown = await page.$$eval('#dl-wtbl .dl-wfinal', (cs) => cs.map((c) => c.textContent.trim()))
  assert(JSON.stringify(wShown) === JSON.stringify(A.eigen.global.map(f4)), `最终权重表显示 ${wShown}`)
  for (const [m, key] of [['geo', 'geo'], ['arith', 'arith']]) {
    await page.selectOption('#dl-ahpm', m); await settle()
    R = await getR()
    nearV(R.W.final, A[key].global, 1e-12, `AHP ${m} 全局权重（pyDecision）`)
    near(R.W.ahp.blocks.find((b) => b.key === 'groups').CR, A[key].groupCR, 1e-12, `AHP ${m} 准则层 CR（pyDecision λ = mean(Aw/w)）`)
    near(R.W.ahp.CRtotal, A[key].CRtotal, 1e-12, `AHP ${m} 层次总排序 CR`)
  }
  await page.selectOption('#dl-ahpm', 'eigen'); await settle()
  for (const [ri, key] of [['saaty2005', 'groupCR2005'], ['dd1991', 'groupCRdd']]) {
    await page.selectOption('#dl-ri', ri); await settle()
    R = await getR()
    near(R.W.ahp.blocks.find((b) => b.key === 'groups').CR, A[key], 6e-9, `RI 表 ${ri} 的准则层 CR 对 AHPy`)
  }
  await page.selectOption('#dl-ri', 'custom'); await settle()
  await page.fill('#dl-ricustom', '0.58, abc'); await settle()
  R = await getR()
  assert(!R.ok && /自定义 RI/.test(R.err), `自定义 RI 非法时报错：${R.err}`)
  assert(await page.$eval('#dl-alert', (el) => getComputedStyle(el).display) !== 'none', '自定义 RI 非法时全局提示条可见')
  await page.fill('#dl-ricustom', '0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49, 1.51, 1.48, 1.56, 1.57, 1.59'); await settle()
  R = await getR()
  near(R.W.ahp.blocks.find((b) => b.key === 'groups').CR, A.eigen.groupCR, 1e-12, '自定义 RI 填回经典表后 CR 复原')
  await page.selectOption('#dl-ri', 'saaty1980'); await settle()

  // 客观赋权
  R = await getR()
  nearV(R.W.objInfo.w, L.entropy.w, 1e-12, '熵权（极差口径）对 scipy.stats.entropy')
  nearV(R.W.objInfo.e, L.entropy.e, 1e-12, '信息熵 e')
  const entShown = await page.$$eval('#dl-objtbl tbody tr', (rs) => rs.map((r) => r.lastElementChild.textContent.trim()))
  assert(JSON.stringify(entShown) === JSON.stringify(L.entropy.w.map(f4)), `熵权表显示 ${entShown}`)
  await page.selectOption('#dl-entmode', 'ratio'); await settle()
  R = await getR()
  nearV(R.W.objInfo.w, L.entropyRatioScipy, 1e-12, '熵权（原值比重，成本型取倒数）对 scipy.stats.entropy')
  nearV(R.W.objInfo.w, L.entropyRatio, 1e-7, '熵权（原值比重）对 pyDecision entropy_method（它带 1e-9 微扰）')
  await page.selectOption('#dl-entmode', 'minmax'); await settle()
  await page.selectOption('#dl-wobj', 'critic'); await settle()
  R = await getR()
  nearV(R.W.obj, L.critic, 1e-8, 'CRITIC 对 pyDecision critic_method')
  nearV(R.W.obj, L.critic_pymcdm_negcost, 1e-12, 'CRITIC 对 pymcdm critic_weights（成本列取负后）')
  await page.selectOption('#dl-wobj', 'cv'); await settle()
  nearV((await getR()).W.obj, L.cv, 1e-12, '变异系数法对 numpy')
  await page.selectOption('#dl-wobj', 'std'); await settle()
  nearV((await getR()).W.obj, L.std, 1e-12, '标准差法对 pymcdm standard_deviation_weights')
  await page.selectOption('#dl-wobj', 'entropy'); await settle()
  await page.selectOption('#dl-wfinal', 'linear'); await settle()
  assert(await page.$eval('#dl-alphafld', (el) => getComputedStyle(el).display) !== 'none', '线性组合时 α 输入框可见')
  nearV((await getR()).W.final, L.combLinear, 1e-12, '组合赋权 0.5·AHP + 0.5·熵权')
  await page.fill('#dl-alpha', '0.3'); await settle()
  nearV((await getR()).W.final, L.combLinear03, 1e-12, '组合赋权 0.3·AHP + 0.7·熵权')
  await page.fill('#dl-alpha', '0.5'); await settle()
  await page.selectOption('#dl-wfinal', 'mult'); await settle()
  assert(await page.$eval('#dl-alphafld', (el) => getComputedStyle(el).display) === 'none', '乘法组合时 α 输入框隐藏')
  nearV((await getR()).W.final, L.combMult, 1e-12, '乘法合成归一')
  await page.selectOption('#dl-wfinal', 'linear'); await settle()
  await onTab('rank')
  nearV((await getR()).m.topsis.score, L.methodsComb.topsis, 1e-12, '组合权重下的 TOPSIS（pymcdm）')
  await onTab('weights')
  await page.selectOption('#dl-wfinal', 'subj'); await settle()

  // ROC 排序赋权
  await page.selectOption('#dl-wsubj', 'roc'); await settle()
  const critIds = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']
  for (let j = 0; j < 6; j++) { await page.selectOption(`.dl-rk[data-id="${critIds[j]}"]`, String(L.roc.ranks[j])) }
  await settle()
  R = await getR()
  nearV(R.W.final, L.roc.w, 1e-12, 'ROC 排序赋权对 pyDecision roc_method')
  await page.selectOption('.dl-rk[data-id="c2"]', String(L.roc.ranks[0])); await settle()
  R = await getR()
  assert(!R.ok && /不能并列/.test(R.err), `ROC 名次并列时报错：${R.err}`)
  await page.selectOption('.dl-rk[data-id="c2"]', String(L.roc.ranks[1])); await settle()
  assert((await getR()).ok, 'ROC 名次恢复后可算')
  // 直接输入：负数 / 全零报错
  await page.selectOption('#dl-wsubj', 'direct'); await settle()
  await page.fill('.dl-dw[data-id="c1"]', '-1'); await settle()
  R = await getR()
  assert(!R.ok && /非负/.test(R.err), `直接权重为负时报错：${R.err}`)
  await page.fill('.dl-dw[data-id="c1"]', '3'); await settle()
  R = await getR()
  nearV(R.W.final, [3, 1, 1, 1, 1, 1].map((v) => v / 8), 1e-15, '直接输入权重按比例归一（定义式）')
  await page.selectOption('#dl-wsubj', 'ahp'); await settle()
  nearV((await getR()).W.final, A.eigen.global, 1e-12, '切回 AHP 后权重复原')

  // ───────── 2. 评价：五种默认方法 ─────────
  await onTab('rank')
  R = await getR()
  const M = L.methods
  assert(JSON.stringify(R.order) === JSON.stringify(['saw', 'topsis', 'vikor', 'gra', 'promethee']), `默认参与 5 种方法：${R.order}`)
  nearV(R.m.saw.score, M.saw, 1e-12, 'SAW（极差）对 pymcdm WSM')
  nearV(R.m.topsis.score, M.topsis, 1e-12, 'TOPSIS（向量）对 pymcdm')
  nearV(R.m.topsis.score, M.topsis_pyd, 1e-12, 'TOPSIS（向量）对 pyDecision')
  nearV(R.m.vikor.score, M.vikor, 1e-12, 'VIKOR Q 对 pyDecision')
  nearV(R.m.vikor.score, M.vikor_pymcdm, 1e-12, 'VIKOR Q 对 pymcdm')
  nearV(R.m.vikor.S, M.vikorS, 1e-12, 'VIKOR S'); nearV(R.m.vikor.R, M.vikorR, 1e-12, 'VIKOR R')
  nearV(R.m.gra.score, M.gra, 1e-12, '灰色关联度对 pyDecision×m')
  nearV(R.m.promethee.score, M.promethee, 1e-12, 'PROMETHEE II（V 型 p = 极差）对 pymcdm')
  for (const k of ['saw', 'topsis', 'vikor', 'gra', 'promethee']) {
    assert(JSON.stringify(R.m[k].rank) === JSON.stringify(M.ranks[k]), `${k} 名次 ${R.m[k].rank} vs ${M.ranks[k]}`)
    const shown = await page.$$eval(`#dl-restbl td[data-m="${k}"]`, (cs) => cs.map((c) => [c.firstChild.textContent.trim(), c.querySelector('.dl-rk').textContent.trim()]))
    assert(JSON.stringify(shown) === JSON.stringify(M[k].map((v, i) => [f4(v), String(M.ranks[k][i])])), `${k} 结果表显示 ${JSON.stringify(shown)}`)
  }
  // 名次第一的格子加粗（计算样式），其余不加粗
  const bold = await page.$$eval('#dl-restbl td[data-m="topsis"]', (cs) => cs.map((c) => +getComputedStyle(c).fontWeight))
  assert(bold.filter((w) => w >= 600).length === 1 && bold[M.ranks.topsis.indexOf(1)] >= 600, `TOPSIS 第一名格子加粗：${bold}`)
  // VIKOR 折中解（Opricovic & Tzeng 2004 独立实现）
  assert(R.m.vikor.c1 === L.vikorComp.c1 && R.m.vikor.c2 === L.vikorComp.c2, `VIKOR C1/C2：${R.m.vikor.c1}/${R.m.vikor.c2}`)
  assert(JSON.stringify(R.m.vikor.compromise) === JSON.stringify(L.vikorComp.compromise), `VIKOR 折中解 ${R.m.vikor.compromise}`)
  await page.selectOption('#dl-focus', 'vikor'); await settle()
  const compTxt = await page.$eval('#dl-compromise', (el) => el.textContent)
  assert(L.vikorComp.compromise.every((i) => compTxt.includes(L.input.alts[i])), `折中解文字：${compTxt}`)
  const stepCaps = await page.$$eval('#dl-steps caption', (cs) => cs.map((c) => c.textContent))
  assert(stepCaps.length === 3 && /步骤 3/.test(stepCaps[2]), `VIKOR 计算过程 3 张表：${stepCaps}`)
  // 得分条形图：每个方案一根条，条长与 |Q| 成比例
  const bars = await page.$$eval('#dl-sfig rect[data-i]', (rs) => rs.map((r) => ({ i: +r.dataset.i, w: r.getBoundingClientRect().width })))
  assert(bars.length === 6, `得分图 6 根条，实得 ${bars.length}`)
  const qi = L.vikorComp.compromise[0], qMax = M.vikor.indexOf(Math.max(...M.vikor))
  const wMax = bars.find((b) => b.i === qMax).w, wSmall = bars.find((b) => b.i === qi).w
  near(wSmall / wMax, M.vikor[qi] / M.vikor[qMax], 0.03, '条长比例 = 分数比例（几何断言）')
  await page.selectOption('#dl-focus', 'topsis'); await settle()
  assert(await page.$$eval('#dl-steps table', (ts) => ts.length) === 4, 'TOPSIS 计算过程 4 张表')
  const dShown = await page.$$eval('#dl-steps table:last-of-type tbody tr', (rs) => rs.map((r) => r.children[3].textContent.trim()))
  void dShown

  // ───────── 3. 对比 ─────────
  await onTab('compare')
  R = await getR()
  const C = L.compare
  for (let a = 0; a < 5; a++) {
    nearV(R.rho[a], C.rho[a], 1e-12, `Spearman ρ 第 ${a} 行对 scipy`)
    nearV(R.tau[a], C.tau[a], 1e-12, `Kendall τ-b 第 ${a} 行对 scipy`)
  }
  nearV(R.cons.meanRank, C.meanRank, 1e-12, '平均名次')
  nearV(R.cons.borda, C.borda, 0, 'Borda 分')
  nearV(R.cons.copeland, C.copeland, 0, 'Copeland 分')
  nearV(R.cons.final, C.final, 0, '共识名次')
  const rhoShown = await page.$$eval('#dl-rho td[data-a="1"]', (cs) => cs.map((c) => c.textContent.trim()))
  assert(JSON.stringify(rhoShown) === JSON.stringify(C.rho[1].map((v) => v.toFixed(3))), `ρ 表第 2 行显示 ${rhoShown}`)
  const consFirst = await page.$eval('#dl-constbl tbody tr:first-child td', (td) => td.textContent.trim())
  assert(consFirst === L.input.alts[C.final.indexOf(1)], `共识第一 ${consFirst}`)
  assert(await page.$$eval('#dl-bump path', (ps) => ps.length) === 6, '名次折线图每个方案一条线')

  // ───────── 4. 敏感性：翻转点 + SMAA ─────────
  await onTab('sens')
  R = await getR()
  assert(R.sweep.reversals.length === L.reversals.length, `翻转点个数 ${R.sweep.reversals.length} vs ${L.reversals.length}`)
  L.reversals.forEach((rv, k) => {
    near(R.sweep.reversals[k].t, rv.t, 1e-9, `翻转点 ${k} 位置（pymcdm TOPSIS 网格 + 二分）`)
    assert(R.sweep.reversals[k].a === rv.a && R.sweep.reversals[k].b === rv.b, `翻转点 ${k} 前后第一名`)
  })
  const revRows = await page.$$eval('#dl-revtbl tbody tr', (rs) => rs.map((r) => r.firstElementChild.textContent.trim()))
  assert(JSON.stringify(revRows) === JSON.stringify(L.reversals.map((rv) => f4(rv.t))), `翻转点表 ${revRows}`)
  assert(await page.$eval('#dl-rev-lo', (el) => el.textContent.trim()) === f4(L.reversals[0].t), '翻转点文字（下界）')
  assert(await page.$$eval('#dl-sweep path[stroke-width="2"]', (ps) => ps.length) === 6, '扫描图每个方案一条曲线')
  // SMAA：排名可接受度逐格精确（k/2000），整体可接受度与中心权重是连续统计量（均值），对 Python 移植精确到 1e-12
  const SM = L.smaa
  assert(R.smaa.n === 2000, 'SMAA 样本数 2000')
  for (let i = 0; i < 6; i++) nearV(R.smaa.acc[i], SM.acc[i], 1e-12, `SMAA 第 ${i} 个方案的排名概率`)
  nearV(R.smaa.holistic, SM.holistic, 1e-12, 'SMAA 整体可接受度（概率加权均值）')
  for (let i = 0; i < 6; i++) nearV(R.smaa.central[i], SM.central[i], 1e-12, `SMAA 中心权重（当选第一时的平均权重）${i}`)
  const smTop = SM.holistic.indexOf(Math.max(...SM.holistic))
  const cell = await page.$eval(`#dl-smtbl td[data-i="${smTop}"][data-r="0"]`, (el) => el.textContent.trim())
  assert(cell === (SM.acc[smTop][0] * 100).toFixed(1) + '%', `SMAA 表格显示 ${cell}`)
  await page.selectOption('#dl-sm-mode', 'ordinal'); await page.selectOption('#dl-sm-n', '500'); await page.fill('#dl-sm-seed', '7'); await page.press('#dl-sm-seed', 'Enter'); await page.dispatchEvent('#dl-sm-seed', 'change'); await settle()
  await page.waitForFunction(() => window.DLA.results().smaa && window.DLA.results().smaa.n === 500)
  R = await getR()
  for (let i = 0; i < 6; i++) nearV(R.smaa.acc[i], L.smaaOrd.acc[i], 1e-12, `SMAA 保持排序模式第 ${i} 行`)
  nearV(R.smaa.holistic, L.smaaOrd.holistic, 1e-12, 'SMAA 保持排序模式整体可接受度')
  await page.selectOption('#dl-sm-mode', 'uniform'); await page.selectOption('#dl-sm-n', '2000'); await page.fill('#dl-sm-seed', '2026'); await page.dispatchEvent('#dl-sm-seed', 'change'); await settle()

  // ───────── 5. 全部七种方法 + 参数切换（能力清单逐项可用） ─────────
  await onTab('rank')
  for (const k of ['edas', 'copras']) { await page.click(`#dl-mchips .dl-chip[data-m="${k}"]`); await settle() }
  R = await getR()
  const chips = await page.$$eval('#dl-mchips .dl-chip', (cs) => cs.map((c) => c.dataset.m))
  const dead = chips.filter((k) => !R.m[k] || R.m[k].error)
  assert(chips.length === 7 && dead.length === 0, `页面列出的 7 种方法都给出结果，失败：${dead}`)
  nearV(R.m.edas.score, M.edas, 1e-12, 'EDAS 对 pymcdm')
  nearV(R.m.copras.score, M.copras, 1e-12, 'COPRAS 效用度对 pyDecision')
  await page.fill('#dl-p-v', '0.3'); await settle()
  nearV((await getR()).m.vikor.score, M.vikor03, 1e-12, 'VIKOR v = 0.3 对 pyDecision')
  await page.fill('#dl-p-v', '0.5'); await settle()
  await page.selectOption('#dl-p-topnorm', 'minmax'); await settle()
  nearV((await getR()).m.topsis.score, M.topsis_minmax, 1e-12, 'TOPSIS（极差）对 pymcdm')
  await page.selectOption('#dl-p-topnorm', 'vector'); await settle()
  await page.selectOption('#dl-p-fn', 'gaussian'); await settle()
  assert(await page.$eval('#dl-p-sf', (el) => getComputedStyle(el).display) !== 'none' && await page.$eval('#dl-p-pf', (el) => getComputedStyle(el).display) === 'none', '高斯型只显示 s')
  nearV((await getR()).m.promethee.score, M.promethee_gauss, 1e-12, 'PROMETHEE 高斯型对 pyDecision promethee_ii t6')
  await page.selectOption('#dl-p-fn', 'vshape'); await settle()
  await onTab('data')
  await page.selectOption('#dl-costmode', 'maxminus'); await settle()
  nearV((await getR()).m.topsis.score, L.maxminusTopsis, 1e-12, '成本型先 max−x 的 TOPSIS（清风口径）')
  await page.selectOption('#dl-costmode', 'native'); await settle()

  // ───────── 6. 供应商：CR 未通过 → 修正建议 ─────────
  const nProj0 = await page.$$eval('#dl-projsel option', (os) => os.length)
  await page.selectOption('#dl-sample', 'supplier')
  await page.waitForFunction((n0) => document.querySelectorAll('#dl-projsel option').length === n0 + 1 && window.DLA.state().name === '供应商选择', nProj0)
  await settle()
  const SP = ORACLE.supplier
  const sg = await page.evaluate(() => ({ alts: DLA.state().alts.map((a) => a.name), cells: DLA.state().cells.map((r) => r.map(Number)) }))
  assert(JSON.stringify(sg.alts) === JSON.stringify(SP.input.alts) && JSON.stringify(sg.cells) === JSON.stringify(SP.input.X), '供应商示例数据与真值输入一致')
  await onTab('weights')
  R = await getR()
  nearV(R.W.final, SP.w, 1e-12, '供应商 AHP 权重对 pyDecision')
  near(R.W.ahp.blocks[0].CR, SP.CR, 1e-12, '供应商 CR')
  assert(await page.$eval('[data-blk="flat"] [data-ahp="cr"]', (el) => el.textContent.trim()) === f4(SP.CR), 'CR 显示')
  assert(await page.$eval('#dl-console', (el) => el.textContent.includes('未通过')), '首屏结论台标出一致性未通过')
  const sugs = await page.$$eval('.dl-sugapply', (bs) => bs.map((b) => ({ x: b.dataset.x, y: b.dataset.y, v: b.dataset.v, cr: b.closest('.dl-sug').querySelector('b.dl-num').textContent.trim() })))
  assert(sugs.length === 3, `3 条修正建议，实得 ${sugs.length}`)
  SP.suggest.forEach((s, k) => {
    assert(sugs[k].x === 'c' + (s.i + 1) && sugs[k].y === 'c' + (s.j + 1) && sugs[k].v === s.to, `建议 ${k}：${JSON.stringify(sugs[k])} vs ${JSON.stringify(s)}`)
    assert(sugs[k].cr === f4(s.CR), `建议 ${k} 的 CR 显示 ${sugs[k].cr} vs ${f4(s.CR)}`)
  })
  const hotRows = await page.$$eval('.dl-pair.dl-hot', (rs) => rs.length)
  assert(hotRows === 3, `被建议的 3 个判断高亮，实得 ${hotRows}`)
  await onTab('rank')
  R = await getR()
  for (const k of ['saw', 'topsis', 'vikor', 'gra', 'promethee', 'edas', 'copras']) nearV(R.m[k].score, SP.methods[k], 1e-12, `供应商 ${k}`)
  await onTab('weights')
  await page.click('.dl-sugapply >> nth=0'); await settle()
  R = await getR()
  near(R.W.ahp.blocks[0].CR, SP.after.CR, 1e-12, '应用第一条建议后 CR')
  nearV(R.W.final, SP.after.w, 1e-12, '应用建议后权重')
  assert(await page.$$eval('.dl-sugapply', (bs) => bs.length) === 0, '通过后不再给建议')

  // ───────── 7. 城市：中间型 + 熵权 ─────────
  await onTab('data')
  await page.selectOption('#dl-sample', 'city')
  await page.waitForFunction(() => window.DLA.state().name.indexOf('城市宜居度') === 0)
  await settle()
  const CT = ORACLE.city
  R = await getR()
  nearV(col(R.Y, 6), CT.posTemp, 1e-12, '年均气温中间型正向化（t = 17）')
  nearV(R.W.final, CT.entropy, 1e-12, '城市熵权（客观权重）')
  await onTab('rank')
  R = await getR()
  for (const k of ['saw', 'topsis', 'vikor', 'gra', 'promethee', 'edas']) nearV(R.m[k].score, CT.methods[k], 1e-12, `城市 ${k}`)
  await onTab('weights')
  await page.selectOption('#dl-wobj', 'critic'); await settle()
  nearV((await getR()).W.final, CT.critic, 1e-8, '城市 CRITIC 对 pyDecision')
  await page.selectOption('#dl-wobj', 'entropy'); await settle()

  // ───────── 8. 粘贴导入 ─────────
  await onTab('data')
  await page.click('#dl-pastebtn')
  await page.fill('#dl-pastearea', '方案\t单价\t评分\t湿度\t温度\n方向\t成本\t效益\t区间:70~80\t中间:16\n甲\t12\t3.5\t70\t15\n乙\t9\t4.1\t64\t18\n丙\t15\t2.8\t81\t12\n丁\t11\t3.9\t77\t16\n戊&1\t9\t4.1\t64\t18')
  await page.click('#dl-pastego')
  await page.waitForFunction(() => window.DLA.state().alts.length === 5 && window.DLA.state().crits.length === 4)
  await settle()
  R = await getR()
  const PA = ORACLE.paste
  for (let i = 0; i < 5; i++) nearV(R.Y[i], PA.Y[i], 1e-12, `粘贴数据正向化第 ${i} 行`)
  await onTab('rank')
  R = await getR()
  nearV(R.m.topsis.score, PA.topsis, 1e-12, '粘贴数据 TOPSIS（全 1 判断矩阵 = 等权）')
  nearV(R.m.saw.score, PA.saw, 1e-12, '粘贴数据 SAW')
  assert(R.m.topsis.rank[1] === R.m.topsis.rank[4], '两行完全相同的方案同名次')
  for (const k of ['saw', 'topsis', 'vikor', 'gra', 'promethee']) assert(JSON.stringify(R.m[k].rank) === JSON.stringify(PA.compare.ranks[k]), `粘贴数据 ${k} 名次（并列按 1,2,2,4）`)
  await onTab('compare')
  R = await getR()
  for (let a = 0; a < 5; a++) {
    nearV(R.rho[a], PA.compare.rho[a], 1e-12, `有并列时 Spearman ρ 第 ${a} 行（平均秩）`)
    nearV(R.tau[a], PA.compare.tau[a], 1e-12, `有并列时 Kendall τ-b 第 ${a} 行`)
  }
  nearV(R.cons.meanRank, PA.compare.meanRank, 1e-12, '有并列时平均名次')
  nearV(R.cons.borda, PA.compare.borda, 0, '有并列时 Borda')
  nearV(R.cons.copeland, PA.compare.copeland, 0, '有并列时 Copeland')
  // 方向写错：报错且不替换数据
  await onTab('data')
  await page.click('#dl-pastebtn')
  await page.fill('#dl-pastearea', '方案\t甲\t乙\n方向\t奇怪\t效益\nA\t1\t2\nB\t3\t4')
  await page.click('#dl-pastego')
  await page.waitForFunction(() => getComputedStyle(document.getElementById('dl-pastemsg')).display !== 'none')
  assert(/看不懂/.test(await page.$eval('#dl-pastemsg', (el) => el.textContent)), '方向写错时提示')
  assert(await page.evaluate(() => window.DLA.state().alts[0].name) === '甲', '方向写错时原数据不变') // 正向锚点
  await page.click('#dl-pastecancel')
  // 非数字单元格：标红 + 全局提示；改回后提示消失
  await page.fill('#dl-dgrid .dl-v[data-i="1"][data-j="1"]', '4.1x'); await settle()
  assert(await page.$eval('#dl-dgrid .dl-v[data-i="1"][data-j="1"]', (el) => getComputedStyle(el).borderTopColor) === 'rgb(179, 0, 0)', '非数字单元格边框标红（计算样式）')
  assert(await page.$eval('#dl-alert', (el) => getComputedStyle(el).display) !== 'none', '非数字时全局提示可见')
  assert(/不是数字/.test(await page.$eval('#dl-datamsg', (el) => el.textContent)), '数据页提示哪一格不是数字')
  await page.fill('#dl-dgrid .dl-v[data-i="1"][data-j="1"]', '4.1'); await settle()
  assert(await page.$eval('#dl-alert', (el) => getComputedStyle(el).display) === 'none', '改回数字后提示消失')
  // Enter 在网格里往下走
  await page.focus('#dl-dgrid .dl-v[data-i="0"][data-j="2"]')
  await page.keyboard.press('Enter')
  assert(await page.evaluate(() => document.activeElement.dataset.i + ',' + document.activeElement.dataset.j) === '1,2', '回车跳到下一行同一列')

  // ───────── 9. 粘贴判断矩阵 ─────────
  await onTab('weights')
  await page.click('.dl-mpaste')
  await page.fill('.dl-mpastebox textarea', '1 3 5 7\n1/3 1 3 5\n1/5 1/3 1 3\n1/7 1/5 1/3 1')
  await page.click('.dl-mpgo'); await settle()
  R = await getR()
  nearV(R.W.final, PA.A4.w, 1e-12, '粘贴判断矩阵后的权重对 pyDecision')
  near(R.W.ahp.blocks[0].CR, PA.A4.CR, 1e-12, '粘贴判断矩阵后的 CR')
  await page.click('.dl-mpaste')
  await page.fill('.dl-mpastebox textarea', '1 3 5 7\n1/2 1 3 5\n1/5 1/3 1 3\n1/7 1/5 1/3 1')
  await page.click('.dl-mpgo')
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.dl-mpmsg')).display !== 'none')
  assert(/互为倒数/.test(await page.$eval('.dl-mpmsg', (el) => el.textContent)), '非互反矩阵被拒绝')
  near((await getR()).W.ahp.blocks[0].CR, PA.A4.CR, 1e-12, '拒绝后判断不变') // 正向锚点
  await onTab('rank')
  nearV((await getR()).m.topsis.score, PA.A4.topsis, 1e-12, '矩阵权重下的 TOPSIS')

  // ───────── 10. 导出 ─────────
  await onTab('export')
  await page.selectOption('#dl-x-what', 'results'); await page.selectOption('#dl-x-fmt', 'md')
  let out = await page.$eval('#dl-x-out', (el) => el.value)
  assert(out.includes('| 甲 | ') && out.includes(f4(PA.A4.topsis[0])), 'Markdown 结果表含 TOPSIS 数值')
  await page.selectOption('#dl-x-fmt', 'tex')
  out = await page.$eval('#dl-x-out', (el) => el.value)
  assert(/\\toprule/.test(out) && /\\midrule/.test(out) && /\\bottomrule/.test(out) && out.includes(f4(PA.A4.topsis[1])), 'LaTeX 三线表')
  assert(out.includes('戊\\&1') && !/戊&1/.test(out), 'LaTeX 里方案名的 & 被转义成 \\&')
  await page.selectOption('#dl-x-what', 'ahp')
  out = await page.$eval('#dl-x-out', (el) => el.value)
  assert(out.includes('1/3') && out.includes(f4(PA.A4.CR)), 'AHP 判断矩阵导出含分数与 CR')
  await page.selectOption('#dl-x-what', 'results'); await page.selectOption('#dl-x-fmt', 'csv'); await page.selectOption('#dl-x-dp', '6')
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#dl-x-dl')])
  const buf = fs.readFileSync(await dl.path())
  assert(buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF, 'CSV 带 UTF-8 BOM（Excel 直接打开不乱码）')
  const csv = buf.toString('utf8').slice(1)
  assert(csv.includes('甲,') && csv.includes(PA.A4.topsis[0].toFixed(6)), 'CSV 内容含 6 位小数的 TOPSIS')

  // ───────── 11. 项目：持久化 / 新建 / 切换 / 删除 / 分享 ─────────
  await onTab('data')
  await page.fill('#dl-dgrid .dl-v[data-i="2"][data-j="0"]', '14.5')
  await page.reload()   // 不等防抖：靠 pagehide 补写
  await settle()
  assert(await page.evaluate(() => window.DLA.state().cells[2][0]) === '14.5', '改完立刻刷新，修改仍在（pagehide 补写）')
  const n1 = await page.$$eval('#dl-projsel option', (os) => os.length)
  await onTab('export')
  await page.click('#dl-pnew')
  await page.waitForFunction((n0) => document.querySelectorAll('#dl-projsel option').length === n0 + 1, n1)
  await settle()
  assert(await page.evaluate(() => window.DLA.state().name) === '未命名项目', '新建空白项目')
  R = await getR()
  assert(!R.ok && /不是数字/.test(R.err), '空白项目提示先填数据')
  const projs = await page.$$eval('#dl-projsel option', (os) => os.map((o) => [o.value, o.textContent]))
  const pasteProj = projs.find((p) => p[1] === '城市宜居度（虚构数据）')
  await page.selectOption('#dl-projsel', pasteProj[0])
  await page.waitForFunction(() => window.DLA.state().alts.length === 5); await settle()
  assert(await page.evaluate(() => window.DLA.state().alts[0].name) === '甲', '切回之前的项目（粘贴数据仍在）')
  const delId = await page.evaluate(() => window.DLA.state().id)
  await page.click('#dl-pdel')
  assert(await page.$eval('#dl-pdel', (b) => b.textContent) === '再点一次确认删除', '删除要点两次')
  await page.click('#dl-pdel')
  await page.waitForFunction((n0) => document.querySelectorAll('#dl-projsel option').length === n0, n1)
  const left = await page.$$eval('#dl-projsel option', (os) => os.map((o) => o.value))
  assert(!left.includes(delId), '删除后列表里没有它')
  assert(left.length === n1 && left.some((v) => v !== delId), '其余项目都还在') // 正向锚点
  // 分享链接：新页面打开得到同样的数据
  await onTab('data')
  await page.selectOption('#dl-sample', 'laptop')
  await page.waitForFunction(() => window.DLA.state().name === '笔记本电脑选购'); await settle()
  await onTab('export')
  await page.click('#dl-share')
  await page.waitForFunction(() => /#p=/.test(document.getElementById('dl-shareout').value))
  const url = await page.$eval('#dl-shareout', (el) => el.value)
  const p2 = await page.context().newPage()
  await p2.goto(url)
  await p2.waitForFunction(() => window.DLA && window.DLA.state().name === '笔记本电脑选购')
  const s2 = await p2.evaluate(() => ({ cells: window.DLA.state().cells, j: window.DLA.state().w.ahp.j, hash: location.hash }))
  const s1 = await page.evaluate(() => ({ cells: window.DLA.state().cells, j: window.DLA.state().w.ahp.j }))
  assert(JSON.stringify(s2.cells) === JSON.stringify(s1.cells) && JSON.stringify(s2.j) === JSON.stringify(s1.j), '分享链接还原数据与 AHP 判断')
  assert(s2.hash === '', '载入后地址栏的 #p= 被清掉')
  await p2.close()

  // ───────── 11b. VIKOR 退化例：R 理论上全相等（离线对拍台 BUG-1 的最小复现 s3#3151，真值来自 scikit-criteria）─────────
  await onTab('data')
  const VD = ORACLE.vikorDeg
  const tsv = ['方案\t' + VD.t.map((_, j) => 'C' + (j + 1)).join('\t'), '方向\t' + VD.t.map((x) => (x > 0 ? '效益' : '成本')).join('\t')]
    .concat(VD.X.map((r, i) => 'P' + (i + 1) + '\t' + r.join('\t'))).join('\n')
  await page.click('#dl-pastebtn'); await page.fill('#dl-pastearea', tsv); await page.click('#dl-pastego')
  await page.waitForFunction(() => window.DLA.state().crits.length === 10); await settle()
  await onTab('weights'); await page.selectOption('#dl-wsubj', 'equal'); await settle()
  await onTab('rank'); await page.fill('#dl-p-v', '0'); await settle()
  R = await getR()
  nearV(R.m.vikor.S, VD.S, 1e-12, 'VIKOR 退化例 S 对 scikit-criteria')
  nearV(R.m.vikor.R, VD.R, 1e-15, 'VIKOR 退化例 R 全相等（先除后乘，最差项精确等于 w）')
  nearV(R.m.vikor.score, VD.Q, 1e-12, 'VIKOR 退化例 Q（R 全相等 ⇒ 该项按 0，不把舍入噪声放大）')
  assert(R.m.vikor.rank.every((r) => r === 1), `退化例四个方案并列第一：${R.m.vikor.rank}`)
  await page.fill('#dl-p-v', '0.5'); await settle()
  await onTab('data')
  await page.selectOption('#dl-sample', 'laptop')
  await page.waitForFunction(() => window.DLA.state().name === '笔记本电脑选购' && window.DLA.state().crits.length === 6); await settle()

  // ───────── 12a. 说明页公布的对拍规模 = 离线对拍台实测（异源核对：页面文字 vs oracle/out/*.summary.json）─────────
  await onTab('about')
  const pub = await page.$$eval('#dl-doc [data-v]', (ns) => Object.fromEntries(ns.map((n) => [n.dataset.v, +n.textContent.replace(/,/g, '')])))
  const OF = ORACLE.offline
  assert(OF.pass === OF.total, `离线对拍全部通过 ${OF.pass}/${OF.total}`)
  assert(pub.total === OF.total, `说明页公布的总项数 ${pub.total} vs 离线实测 ${OF.total}`)
  for (const k of Object.keys(OF.suites)) assert(pub[k] === OF.suites[k][1], `说明页 ${k} 项数 ${pub[k]} vs 离线实测 ${OF.suites[k][1]}`)
  for (const k of ['coprasCost', 'coprasDiff', 'coprasRank']) assert(pub[k] === OF[k], `说明页 ${k} ${pub[k]} vs 离线实测 ${OF[k]}`)

  // ───────── 12. 键盘：页签方向键 ─────────
  await page.focus('#dl-tab-export')
  await page.keyboard.press('ArrowRight')
  assert(await page.evaluate(() => document.activeElement.id) === 'dl-tab-about' && await page.$eval('#dl-tab-about', (b) => b.getAttribute('aria-selected')) === 'true', '→ 键切到下一个页签')
  await page.keyboard.press('Home')
  assert(await page.$eval('#dl-tab-data', (b) => b.getAttribute('aria-selected')) === 'true', 'Home 回到第一个页签')
  await settle()

  // ───────── 13. 渲染守卫 ─────────
  const scanned = await renderGuards(page, { assert, tabs: TABS, onTab, paneSel: (t) => `#dl-pane-${t}`, panesRoot: '#dl-panes',
    figSel: (t) => `#dl-pane-${t} svg.dl-fig`, cardSel: '.dl-card, .dl-card-w, .dl-figcard, .dl-band', childSel: 'svg,h2,h3,p',
    labelSel: 'th, dt, label, label > span, .dl-kpi span, .dl-bcell span, .dl-mono', minControls: 60, minTextsInFig: 6 })
  assert(scanned >= 60, `守卫扫到的控件数 ${scanned}`)
  for (const host of ['.dl-nav', '#dl-hero']) await guardControlSize(page, { assert, tabs: [host], onTab: async () => {}, paneSel: (h) => h, minControls: 2 })
  await onTab('rank')
  await guardBoxOverlap(page, { assert, sel: '.dl-tab, #dl-mchips .dl-chip, .dl-bcell, .dl-prow, .dl-cchip' })
  await onTab('weights')
  await guardBoxOverlap(page, { assert, sel: '#dl-pane-weights .dl-kpi' })
  // 隐藏的 SVG 不靠 .hidden 属性（计算样式断言）
  assert(await page.$eval('#dl-pane-sens', (el) => getComputedStyle(el).display) === 'none', '非当前页签计算样式为 none')
  assert(pageErrors.length === 0, `页面无报错：${pageErrors.join(' | ')}`)

  await onTab('data')
  await page.evaluate(() => window.scrollTo(0, 0))
  await screenshot('thumb.png')
}
