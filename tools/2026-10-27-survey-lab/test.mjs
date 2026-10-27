// 问卷统计工作台 · Survey Lab —— 集成测试
// ORACLE 由离线对拍脚本 oracle/build-oracle.py 用 Python 独立算出（pingouin / factor_analyzer / scipy / statsmodels / numpy，
// 不借页面引擎），再由 inject-oracle.mjs 机械注入，这里一个数都不手打。
// 页面每个数值单元格都带 data-raw（全精度），断言比 data-raw；另抽查显示文本（三位小数 / p 值格式）。
import { renderGuards, guardFigText, guardControlSize, guardEscape } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const ORACLE = {
 "src": "Python 独立计算（不借引擎）：α / 删除后 α = pingouin.cronbach_alpha（与 numpy 公式互证），Feldt CI = scipy.stats.f.isf，CITC / SMC / 折半 = numpy；KMO / Bartlett = factor_analyzer；PCA = numpy.linalg.eigh，varimax = numpy 复刻 R stats::varimax 的 SVD 迭代（Kaiser 标准化，按旋转矩阵变化 <1e-14 判停），statsmodels rotate_factors(GPA) 与 factor_analyzer Rotator 两家独立实现在 1e-7 内互证；PAF = numpy 复刻 SPSS 规则；描述 = scipy.stats.skew/kurtosis(bias=False) + numpy weibull 百分位；相关 = scipy pearsonr / spearmanr（成对删除）；t 检验 = scipy ttest_ind / ttest_1samp + levene(center=mean)；ANOVA = scipy f_oneway / tukey_hsd，Welch 与 Games-Howell = pingouin；卡方 / Fisher = scipy chi2_contingency / fisher_exact；回归 = statsmodels OLS（VIF = variance_inflation_factor，DW = durbin_watson）；中介 = statsmodels OLS，自助抽样逐位复刻引擎 mulberry32（种子 20261027，5000 次）+ numpy 线性插值百分位；调节 = statsmodels OLS + cov_params；xlsx = openpyxl 写、zipfile+ElementTree 读",
 "meta": {
  "tabs": [
   "data",
   "scales",
   "analyze",
   "report",
   "about"
  ],
  "validation": [
   "902 项",
   "377,595 条",
   "27,409 条"
  ]
 },
 "sample": {
  "n": 360,
  "reliability": {
   "MD": {
    "alpha": 0.8532416860254729,
    "alphaStd": 0.853136379542269,
    "n": 355,
    "citc": [
     0.6437687354265877,
     0.6750110399540724,
     0.6848247588899304,
     0.601923210260151,
     0.580914618476907,
     0.6472938136884531
    ],
    "alphaIfDeleted": [
     0.8279817020862629,
     0.8221631426559475,
     0.8201043270742464,
     0.8356767595165495,
     0.8394649417269556,
     0.8272880546291661
    ],
    "smc": [
     0.421764227438822,
     0.4620787471927853,
     0.4725956931022598,
     0.36768571425487107,
     0.3410809017383474,
     0.4277218599945548
    ],
    "scaleMean": 19.898591549295773,
    "scaleVar": 25.464263547386004,
    "ciLo": 0.8282625762679395,
    "ciHi": 0.8756882632584858,
    "splitR": 0.7368347233994829,
    "splitSB": 0.848479954335881,
    "guttman": 0.847600101747011,
    "alpha1": 0.7815630647316814,
    "alpha2": 0.7096173816721665
   },
   "SC": {
    "alpha": 0.8193616764951882,
    "alphaStd": 0.8192970730883579,
    "n": 360,
    "citc": [
     0.6797573875617988,
     0.6035986283448274,
     0.5384619141895435,
     0.6007907917366707,
     0.6339938124254814
    ],
    "alphaIfDeleted": [
     0.7634956161292348,
     0.7860382715135863,
     0.8045565529829544,
     0.7868819525110814,
     0.7769680048244313
    ],
    "smc": [
     0.47226886075813435,
     0.3707123858439162,
     0.29227633199633596,
     0.361646141409506,
     0.4212387477517029
    ],
    "scaleMean": 17.002777777777776,
    "scaleVar": 17.91921231816775,
    "ciLo": 0.7880851509697964,
    "ciHi": 0.847271835444076,
    "splitR": 0.6844541439870919,
    "splitSB": 0.817860927030259,
    "guttman": 0.7916683039139785,
    "alpha1": 0.726981561302682,
    "alpha2": 0.6604084407604007
   },
   "AP": {
    "alpha": 0.8752842812777436,
    "alphaStd": 0.87531101162001,
    "n": 357,
    "citc": [
     0.7039436869607963,
     0.6997242720549591,
     0.7156072917599192,
     0.7057021117563327,
     0.6338473660141087,
     0.6150054480134491
    ],
    "alphaIfDeleted": [
     0.8496223542430845,
     0.8504401870934877,
     0.8475331470501448,
     0.8493510844889363,
     0.8618138101460426,
     0.864416802766468
    ],
    "smc": [
     0.5005278393399151,
     0.496700294272044,
     0.5201378357793066,
     0.5078187340991,
     0.4034839993578164,
     0.3877542893835155
    ],
    "scaleMean": 19.168067226890756,
    "scaleVar": 27.75819091681616,
    "ciLo": 0.8541198200531888,
    "ciHi": 0.8943086877592017,
    "splitR": 0.7895747317981298,
    "splitSB": 0.8824160486494805,
    "guttman": 0.8818530524592356,
    "alpha1": 0.8055091545029236,
    "alpha2": 0.7393026232559725
   },
   "MD_excl": {
    "alpha": 0.85392159749047,
    "alphaStd": 0.8537537875561237,
    "n": 344,
    "citc": [
     0.6458246689552539,
     0.6879862980496994,
     0.6810644231412043,
     0.6035375165645851,
     0.579300881701107,
     0.6431017273296866
    ],
    "alphaIfDeleted": [
     0.8285870144356453,
     0.820686931749186,
     0.8218322966167522,
     0.8363017432710917,
     0.8406540768161576,
     0.8291045522091456
    ],
    "smc": [
     0.42367003909335166,
     0.47556519694956667,
     0.4689831489380941,
     0.37135454316200855,
     0.3426334229725937,
     0.41880525659986023
    ],
    "scaleMean": 19.962209302325583,
    "scaleVar": 25.04521492982575,
    "ciLo": 0.8286413355573836,
    "ciHi": 0.8766001530791441,
    "splitR": 0.7433129945367721,
    "splitSB": 0.8527590821225801,
    "guttman": 0.8515780158943667,
    "alpha1": 0.7832922603512734,
    "alpha2": 0.7044809465728912
   }
  },
  "efa": {
   "n": 352,
   "kmo": 0.9078890307468467,
   "msa": [
    0.9169072150195834,
    0.8775156823928917,
    0.9133645482627579,
    0.927879227597006,
    0.9171212442084049,
    0.9003974228478266,
    0.8512949967933089,
    0.9079093786110192,
    0.929852273791802,
    0.8576691070630577,
    0.8918442876886415,
    0.9282212207647269,
    0.9110148826073884,
    0.9164732750225262,
    0.9159528154404911,
    0.9311362428800259,
    0.9306855496812265
   ],
   "bartlettChi2": 2474.053324039863,
   "bartlettDf": 136,
   "bartlettP": 0,
   "m": 3,
   "eigen": [
    6.034738422229357,
    2.2359693867849155,
    1.8652083809408515,
    0.6977237196688338,
    0.6463624724352034,
    0.62922198270997,
    0.6041302299384791,
    0.5814202182459469,
    0.5418274720075528,
    0.47637559334383045,
    0.440145363181717,
    0.4290054304466925,
    0.41769295381204247,
    0.38408403978126265,
    0.3551603410241177,
    0.3373546207367125,
    0.3235793727125135
   ],
   "pctVar": [
    35.49846130723151,
    13.152761098734796,
    10.971814005534421,
    4.104257174522552,
    3.8021321907953145,
    3.7013057806468823,
    3.55370723493223,
    3.420118930858511,
    3.18722042357384,
    2.802209372610767,
    2.589090371657159,
    2.5235613555687793,
    2.4570173753649556,
    2.259317881066251,
    2.089178476612457,
    1.9844389455100735,
    1.9034080747794913
   ],
   "cumPct": [
    35.49846130723151,
    48.65122240596631,
    59.62303641150073,
    63.72729358602328,
    67.5294257768186,
    71.23073155746548,
    74.78443879239771,
    78.20455772325622,
    81.39177814683005,
    84.19398751944081,
    86.78307789109797,
    89.30663924666675,
    91.7636566220317,
    94.02297450309796,
    96.11215297971042,
    98.0965919252205,
    99.99999999999999
   ],
   "loadings": [
    [
     0.5919149212714622,
     0.45263502976447245,
     0.18743065484091495
    ],
    [
     0.5842495473673478,
     0.5185473234217447,
     0.11882619104871067
    ],
    [
     0.6111017485782327,
     0.5011616072603974,
     0.14061542789453169
    ],
    [
     0.5649551460571517,
     0.4149407722583929,
     0.20234085063000795
    ],
    [
     0.5836093897293333,
     0.3753946556519739,
     0.13437513695668418
    ],
    [
     0.5798715514162012,
     0.4705059447509364,
     0.2029973622964689
    ],
    [
     -0.5669130178178863,
     0.0477671908124279,
     0.5929042016311061
    ],
    [
     -0.5565581524811333,
     0.027858301192959907,
     0.5017317000254821
    ],
    [
     -0.536881803329694,
     0.043325956515215536,
     0.43256221016836777
    ],
    [
     -0.4959912891842797,
     0.11712752732591383,
     0.5793363437105754
    ],
    [
     -0.5891475651318718,
     -0.07363785956891195,
     0.5122377880957153
    ],
    [
     0.6715887932508409,
     -0.38513505825482397,
     0.2110376376323916
    ],
    [
     0.6264791496474003,
     -0.455612494435223,
     0.22976039068904464
    ],
    [
     0.6646855930845772,
     -0.3991846008432753,
     0.2657050341128048
    ],
    [
     0.643480197660927,
     -0.4208454192429043,
     0.2548297152535608
    ],
    [
     0.6037296885146841,
     -0.38916749578737525,
     0.22478616263376397
    ],
    [
     0.6302336971798893,
     -0.3296440003642276,
     0.15552538380476105
    ]
   ],
   "rotated": [
    [
     0.15370975149426094,
     0.7443909983225536,
     -0.11237147538279099
    ],
    [
     0.07741741269150108,
     0.7690365699141829,
     -0.16415791864157284
    ],
    [
     0.11475903001146348,
     0.7782477160034673,
     -0.15981820871032018
    ],
    [
     0.16754540324845035,
     0.7046178061075379,
     -0.0879446788557372
    ],
    [
     0.17747056505355377,
     0.6656589161773538,
     -0.15805110109581563
    ],
    [
     0.1407295178579148,
     0.7553665095015566,
     -0.09193165077404548
    ],
    [
     -0.14686715372123357,
     -0.12146999274080456,
     0.7993012865138439
    ],
    [
     -0.16461086226293656,
     -0.15744952241457852,
     0.714409317384302
    ],
    [
     -0.19068921688325105,
     -0.1548048080334893,
     0.6456797727158665
    ],
    [
     -0.15316073230450872,
     -0.0316170623816388,
     0.7555785645413765
    ],
    [
     -0.11420893882422697,
     -0.24981234620009934,
     0.7344760373181285
    ],
    [
     0.7643806933711659,
     0.16845706182918438,
     -0.17675344052046826
    ],
    [
     0.7898464879690127,
     0.09448854139002667,
     -0.14164444269720003
    ],
    [
     0.7916600414547428,
     0.17008455849053122,
     -0.12688605157559502
    ],
    [
     0.7880263721551363,
     0.13808601290938285,
     -0.12673793939660508
    ],
    [
     0.7297501347005241,
     0.1295745541797362,
     -0.13093842559293783
    ],
    [
     0.6789978630532132,
     0.16933218578714623,
     -0.20083908451917284
    ]
   ],
   "comm": [
    0.5903719945677803,
    0.6243585239059509,
    0.6443810022691606,
    0.5322919813725242,
    0.49957774470443655,
    0.5988347892871271,
    0.6752074666013133,
    0.5622677608490304,
    0.4772292749202458,
    0.5953568157481044,
    0.6149049394158949,
    0.643897404814528,
    0.6528487071579983,
    0.671754448357488,
    0.6561158154556924,
    0.5664696954830672,
    0.5300478250447815
   ],
   "ssRotated": [
    3.6931126656781026,
    3.519052331909962,
    2.9237511923670665
   ],
   "primary": [
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    2,
    0,
    0,
    0,
    0,
    0,
    0
   ],
   "gapGpa": 3.488223182523953e-9,
   "gapFa": 1.916606803820109e-9
  },
  "efa_paf": {
   "m": 3,
   "rotated": [
    [
     0.1611161359970091,
     0.6835020845495521,
     -0.12460163271493457
    ],
    [
     0.0922884692778227,
     0.7170061506443242,
     -0.16507845683147498
    ],
    [
     0.12252766249859781,
     0.7335553635919944,
     -0.1660066202276761
    ],
    [
     0.17182390469426728,
     0.6277572070793664,
     -0.1107154734200164
    ],
    [
     0.1828681088754175,
     0.5911938359814279,
     -0.16941140803758015
    ],
    [
     0.14736246708119038,
     0.6923464836493605,
     -0.10991632511233027
    ],
    [
     -0.15046919117069615,
     -0.12839801085869249,
     0.7577627616769178
    ],
    [
     -0.1776598245928413,
     -0.16949897357167396,
     0.6254084598223755
    ],
    [
     -0.2008428865727669,
     -0.17000185299848772,
     0.5426368220325798
    ],
    [
     -0.16417377979879383,
     -0.059329828567852176,
     0.6591277898586818
    ],
    [
     -0.12892532395809114,
     -0.24916915364632983,
     0.6702853786606311
    ],
    [
     0.7150797284140104,
     0.17765908207730696,
     -0.18774844513808667
    ],
    [
     0.7368954540481693,
     0.10820954357226868,
     -0.15565758139925567
    ],
    [
     0.7498811640086332,
     0.176314404905073,
     -0.14062040236019416
    ],
    [
     0.7392543120718347,
     0.14846154367658912,
     -0.1402523938293956
    ],
    [
     0.6552465261138433,
     0.14267930689684943,
     -0.15113909566893655
    ],
    [
     0.6071558642383653,
     0.17927111664269327,
     -0.21355921230725186
    ]
   ],
   "comm": [
    0.5086590757374171,
    0.5498658785332958,
    0.5806746974913691,
    0.4358604813190895,
    0.4116511221193825,
    0.5131409486520884,
    0.6133314296682615,
    0.4514286569336057,
    0.36369321573541813,
    0.464922501895304,
    0.5279894951327525,
    0.5781512460849753,
    0.5789534981640422,
    0.6131826270719157,
    0.5882085018425132,
    0.4725484208404488,
    0.44638391390264825
   ],
   "commInit": [
    0.4500029457242761,
    0.49821918710815305,
    0.49380839509385255,
    0.38897682965414415,
    0.3938887392867424,
    0.458824649652373,
    0.5052296209605978,
    0.3969666129324485,
    0.32690938625122723,
    0.4079411147558808,
    0.46018859746782503,
    0.5153701090992913,
    0.5136129143137301,
    0.5399973907104876,
    0.5224825345612973,
    0.4291971293056046,
    0.4261750683304796
   ],
   "ssRotated": [
    3.2334439997744093,
    3.0309263561794912,
    2.434275355170629
   ],
   "iterations": 7
  },
  "describe": {
   "MD": {
    "n": 355,
    "mean": 3.3164319248826297,
    "sd": 0.8410354654198929,
    "min": 1,
    "max": 5,
    "median": 3.3333333333333335,
    "q1": 2.6666666666666665,
    "q3": 4,
    "skew": -0.03685961851683452,
    "seSkew": 0.12946058576774203,
    "kurt": -0.617797448589172,
    "seKurt": 0.2582091400348279
   },
   "SC": {
    "n": 360,
    "mean": 3.4005555555555556,
    "sd": 0.846621812101903,
    "min": 1,
    "max": 5,
    "median": 3.4,
    "q1": 2.8,
    "q3": 4,
    "skew": -0.4379793318288203,
    "seSkew": 0.12856586409433837,
    "kurt": -0.2839272596087268,
    "seKurt": 0.2564342048385878
   },
   "AP": {
    "n": 357,
    "mean": 3.1946778711484596,
    "sd": 0.8781007110807102,
    "min": 1,
    "max": 5,
    "median": 3.1666666666666665,
    "q1": 2.6666666666666665,
    "q3": 3.8333333333333335,
    "skew": -0.08723158006890701,
    "seSkew": 0.12910046068077996,
    "kurt": -0.3602029652482761,
    "seKurt": 0.25749475293775
   }
  },
  "freq": {
   "性别": [
    [
     1,
     151,
     41.94444444444444,
     41.94444444444444,
     41.94444444444444
    ],
    [
     2,
     209,
     58.05555555555556,
     58.05555555555556,
     100
    ]
   ],
   "年级": [
    [
     1,
     108,
     30,
     30,
     30
    ],
    [
     2,
     95,
     26.38888888888889,
     26.38888888888889,
     56.388888888888886
    ],
    [
     3,
     93,
     25.833333333333332,
     25.833333333333332,
     82.22222222222223
    ],
    [
     4,
     64,
     17.77777777777778,
     17.77777777777778,
     100
    ]
   ]
  },
  "corr": {
   "vars": [
    "MD",
    "SC",
    "AP"
   ],
   "r": [
    [
     1,
     -0.38230422521977486,
     0.3856251090663361
    ],
    [
     -0.38230422521977486,
     1,
     -0.41764934802173015
    ],
    [
     0.3856251090663361,
     -0.41764934802173015,
     1
    ]
   ],
   "p": [
    [
     null,
     8.447421019604093e-14,
     6.316738023431239e-14
    ],
    [
     8.447421019604093e-14,
     null,
     1.6743851757574505e-16
    ],
    [
     6.316738023431239e-14,
     1.6743851757574505e-16,
     null
    ]
   ],
   "n": [
    [
     355,
     355,
     352
    ],
    [
     355,
     360,
     357
    ],
    [
     352,
     357,
     357
    ]
   ],
   "rs": [
    [
     1,
     -0.36735929005055473,
     0.38289425550551204
    ],
    [
     -0.36735929005055473,
     1,
     -0.39408172062950053
    ],
    [
     0.38289425550551204,
     -0.3940817206295005,
     1
    ]
   ],
   "ps": [
    [
     null,
     8.763098382992454e-13,
     9.786041345514732e-14
    ],
    [
     8.763098382992454e-13,
     null,
     1.0332525368982799e-14
    ],
    [
     9.786041345514732e-14,
     1.0332525368983103e-14,
     null
    ]
   ]
  },
  "ttest": {
   "a": {
    "n": 148,
    "mean": 3.1182432432432434,
    "sd": 0.8323698235740326,
    "se": 0.06842037802955493
   },
   "b": {
    "n": 207,
    "mean": 3.458132045088567,
    "sd": 0.8201988535679827,
    "se": 0.05700776112067079
   },
   "leveneF": 0.022623869556784925,
   "leveneP": 0.8805252209058626,
   "t": -3.8258914071924655,
   "df": 353,
   "p": 0.00015406429432893984,
   "ciLo": -0.5146093094653501,
   "ciHi": -0.16516829422529727,
   "tW": -3.816510866013265,
   "dfW": 313.96905406662137,
   "pW": 0.00016302958023911216,
   "ciLoW": -0.5151136887060755,
   "ciHiW": -0.1646639149845718,
   "d": -0.4118421430382749,
   "md": -0.33988880184532366
  },
  "ttestOne": {
   "n": 355,
   "mean": 3.3164319248826297,
   "t": 7.088921379435268,
   "df": 354,
   "p": 7.373259368869187e-12,
   "md": 0.3164319248826297,
   "ciLo": 0.22864383930348176,
   "ciHi": 0.4042200104617777,
   "d": 0.3762408815003406
  },
  "anova": {
   "levels": [
    1,
    2,
    3,
    4
   ],
   "groups": [
    {
     "n": 48,
     "mean": 2.8541666666666665,
     "sd": 0.7192268307304401
    },
    {
     "n": 134,
     "mean": 3.20273631840796,
     "sd": 0.8836588373403708
    },
    {
     "n": 105,
     "mean": 3.2301587301587302,
     "sd": 0.8159667829034408
    },
    {
     "n": 70,
     "mean": 3.3595238095238096,
     "sd": 1.003470513310434
    }
   ],
   "F": 3.3544864356073534,
   "p": 0.019112053618400217,
   "dfb": 3,
   "dfw": 353,
   "ssb": 7.6085764571168495,
   "ssw": 266.88908927584305,
   "eta2": 0.027718182727712943,
   "omega2": 0.01940172551310399,
   "leveneF": 2.7030587254012253,
   "leveneP": 0.0454211072637284,
   "welchF": 4.132905228049313,
   "welchDf1": 3,
   "welchDf2": 154.75840003322224,
   "welchP": 0.007503126424640197,
   "qCrit": 3.650523720974759,
   "pairs": [
    {
     "i": 0,
     "j": 1,
     "md": -0.3485696517412933,
     "lsdP": 0.017694242557662422,
     "lsdLo": -0.6362302628579304,
     "lsdHi": -0.06090904062465613,
     "tukeyP": 0.08219000060596138,
     "tukeyLo": -0.7261252465676167,
     "tukeyHi": 0.028985943085030108,
     "ghP": 0.03942126876968122,
     "ghLo": -0.6851784525267841,
     "ghHi": -0.011960850955802405,
     "ghDf": 101.12160421852795
    },
    {
     "i": 0,
     "j": 2,
     "md": -0.3759920634920637,
     "lsdP": 0.013535973263509223,
     "lsdLo": -0.6739453428895759,
     "lsdHi": -0.0780387840945515,
     "tukeyP": 0.0645124818450139,
     "tukeyLo": -0.7670568227467423,
     "tukeyHi": 0.015072695762614885,
     "ghP": 0.02503521089100469,
     "ghLo": -0.7176892598458215,
     "ghHi": -0.03429486713830593,
     "ghDf": 102.53746505798637
    },
    {
     "i": 0,
     "j": 3,
     "md": -0.5053571428571431,
     "lsdP": 0.0020815614626133144,
     "lsdLo": -0.8258284026348851,
     "lsdHi": -0.18488588307940101,
     "tukeyP": 0.011148263699230943,
     "tukeyLo": -0.9259768329858924,
     "tukeyHi": -0.08473745272839367,
     "ghP": 0.009894352212231006,
     "ghLo": -0.9188525207769219,
     "ghHi": -0.0918617649373642,
     "ghDf": 115.74313009087983
    },
    {
     "i": 1,
     "j": 2,
     "md": -0.027422411750770426,
     "lsdP": 0.8089378075208431,
     "lsdLo": -0.25030165493745565,
     "lsdHi": 0.1954568314359148,
     "tukeyP": 0.9950116171994056,
     "tukeyLo": -0.31995222634422504,
     "tukeyHi": 0.2651074028426842,
     "ghP": 0.9945922021429731,
     "ghLo": -0.3128882098044407,
     "ghHi": 0.25804338630289986,
     "ghDf": 230.6573103998532
    },
    {
     "i": 1,
     "j": 3,
     "md": -0.15678749111584978,
     "lsdP": 0.22225896322251165,
     "lsdLo": -0.40897953834032247,
     "lsdHi": 0.09540455610862292,
     "tukeyP": 0.6128270848910189,
     "tukeyLo": -0.48779046726435266,
     "tukeyHi": 0.1742154850326531,
     "ghP": 0.6884689182937342,
     "ghLo": -0.5269664941951462,
     "ghHi": 0.21339151196344663,
     "ghDf": 125.53792174588756
    },
    {
     "i": 2,
     "j": 3,
     "md": -0.12936507936507935,
     "lsdP": 0.3356095866545563,
     "lsdLo": -0.39323693879500315,
     "lsdHi": 0.13450678006484446,
     "tukeyP": 0.7698826311167968,
     "tukeyLo": -0.47569785137117643,
     "tukeyHi": 0.21696769264101773,
     "ghP": 0.8055747480927775,
     "ghLo": -0.5041652641211349,
     "ghHi": 0.2454351053909763,
     "ghDf": 126.88108090599374
    }
   ]
  },
  "chisq": {
   "chi2": 5.360010574735664,
   "df": 3,
   "p": 0.1472554517922714,
   "lr": 5.396423827941195,
   "lrP": 0.14496654952448992,
   "linear": 5.002355906257447,
   "linearP": 0.025312840844476103,
   "cramerV": 0.12202015515132991,
   "minExpected": 20.552777777777777,
   "smallCells": 0,
   "O": [
    [
     26,
     59,
     43,
     23
    ],
    [
     23,
     76,
     62,
     48
    ]
   ]
  },
  "chisq2x2": {
   "chi2": 0.49221861039659215,
   "p": 0.48293929888871834,
   "yates": 0.3521974714027689,
   "yatesP": 0.5528718230216263,
   "fisher2": 0.517172042940137,
   "fisherLess": 0.7910118318430849,
   "fisherGreater": 0.2762756762110745,
   "phi": 0.03697666720742032,
   "O": [
    [
     67,
     84
    ],
    [
     85,
     124
    ]
   ]
  },
  "hier": {
   "n": 352,
   "models": [
    {
     "r2": 0.02170882963422638,
     "adjR2": 0.016102576508921107,
     "F": 3.8722528485625975,
     "pF": 0.02171147586183491,
     "dR2": 0.02170882963422638,
     "dF": 3.872252848562596,
     "dDf1": 2,
     "dDf2": 349,
     "dP": 0.021711475861834938
    },
    {
     "r2": 0.23395708361957757,
     "adjR2": 0.22512661772470244,
     "F": 26.494308047252176,
     "pF": 3.4428505461200435e-19,
     "dR2": 0.2122482539853512,
     "dF": 48.07181331361706,
     "dDf1": 2,
     "dDf2": 347,
     "dP": 3.729853814227963e-19
    }
   ],
   "final": {
    "coefs": [
     {
      "name": "(常量)",
      "B": 3.228933952436226,
      "se": 0.3259783107416402,
      "t": 9.905364393999127,
      "p": 1.5579546096365943e-20,
      "lo": 2.5877919863267196,
      "hi": 3.8700759185457323
     },
     {
      "name": "性别",
      "B": 0.1032853542811588,
      "se": 0.0856877842928567,
      "t": 1.2053684796908573,
      "p": 0.22888241757305333,
      "lo": -0.06524743665238132,
      "hi": 0.27181814521469894,
      "beta": 0.057863345782173906,
      "vif": 1.043863702682603,
      "tol": 0.9579794732110346
     },
     {
      "name": "年级",
      "B": -0.0005534822120405875,
      "se": 0.03844508308121302,
      "t": -0.014396696994291525,
      "p": 0.9885217682656302,
      "lo": -0.07616819442357799,
      "hi": 0.07506122999949681,
      "beta": -0.0006811159419994398,
      "vif": 1.013894427534887,
      "tol": 0.986295981950834
     },
     {
      "name": "MD",
      "B": 0.2689453623699764,
      "se": 0.05413507051601316,
      "t": 4.968043078292885,
      "p": 0.000001063801911682721,
      "lo": 0.16247120626079253,
      "hi": 0.3754195184791603,
      "beta": 0.2573355024081928,
      "vif": 1.2153603964839126,
      "tol": 0.8228012060398224
     },
     {
      "name": "SC",
      "B": -0.3206965901834907,
      "se": 0.053491251357659406,
      "t": -5.995309177555261,
      "p": 5.095462910058951e-9,
      "lo": -0.42590446731826437,
      "hi": -0.21548871304871706,
      "beta": -0.3063724787757361,
      "vif": 1.182912729713805,
      "tol": 0.8453709008964178
     }
    ],
    "dw": 2.087084056621407,
    "seEst": 0.7759992132173459
   }
  },
  "mediation": {
   "n": 352,
   "a": -0.3810627335424193,
   "aSe": 0.04932873636136416,
   "aP": 1.1911000342604874e-13,
   "b": -0.32437747574691295,
   "bSe": 0.05316814423738249,
   "bP": 2.801046082529883e-9,
   "c": 0.40302283876981915,
   "cSe": 0.05154302850211746,
   "cP": 6.316738023431346e-14,
   "cp": 0.27941467116211255,
   "cpSe": 0.05308493179220467,
   "cpP": 2.473830338575642e-7,
   "ind": 0.12360816760770847,
   "lo": 0.06851842356091224,
   "hi": 0.1919471938803547,
   "bootSe": 0.031735585133817405,
   "sobelZ": 4.787850671039872,
   "sobelP": 0.0000016857700629525326,
   "ratio": 0.3067026374609642
  },
  "moderation": {
   "n": 352,
   "b1": 0.38883088203680966,
   "b2": 0.14371138466366218,
   "b3": 0.21222087345815419,
   "b3se": 0.10579442417720425,
   "b3p": 0.04563256238304378,
   "r2": 0.1636568876718676,
   "dR2": 0.009670654725644212,
   "dF": 4.023932038079371,
   "slopes": [
    {
     "w": 1,
     "slope": 0.2652363392557824,
     "se": 0.08038020818799682,
     "t": 3.2997717377819646,
     "p": 0.0010677320808276417,
     "lo": 0.10714420634213173,
     "hi": 0.42332847216943303
    },
    {
     "w": 2,
     "slope": 0.4774572127139366,
     "se": 0.06878577119317993,
     "t": 6.941220610481085,
     "p": 1.9106757452604042e-11,
     "lo": 0.34216906744555886,
     "hi": 0.6127453579823143
    }
   ],
   "jn": []
  },
  "moderation2": {
   "n": 352,
   "b1": 0.27454583947156075,
   "b2": -0.31382894166269276,
   "b3": -0.0759691265635331,
   "b3se": 0.05348885662337085,
   "b3p": 0.15642160339993852,
   "r2": 0.23518285571984354,
   "dR2": 0.004433288640683819,
   "dF": 2.017193859337493,
   "slopes": [
    {
     "w": 2.552145174499985,
     "slope": 0.3385249872529081,
     "se": 0.06739394839875397,
     "t": 5.0230769274703455,
     "p": 8.142713899031151e-7,
     "lo": 0.2059742849343421,
     "hi": 0.47107568957147405
    },
    {
     "w": 3.394318181818181,
     "slope": 0.27454583947156075,
     "se": 0.053118473483134004,
     "t": 5.168556652117151,
     "p": 3.985092321132698e-7,
     "lo": 0.17007220150305566,
     "hi": 0.3790194774400658
    },
    {
     "w": 4.236491189136377,
     "slope": 0.21056669169021347,
     "se": 0.071830643785937,
     "t": 2.9314326113757905,
     "p": 0.0035971414648571843,
     "lo": 0.0692898781477572,
     "hi": 0.3518435052326697
    }
   ],
   "jn": [
    4.684427515331478
   ]
  },
  "quality": {
   "straight": [
    89,
    96,
    109,
    151,
    159,
    261
   ],
   "fast": [
    89,
    96,
    109,
    142,
    151,
    159,
    177,
    189,
    201,
    333
   ],
   "flagged": [
    89,
    96,
    109,
    142,
    151,
    159,
    177,
    189,
    201,
    261,
    333
   ],
   "nKept": 349
  },
  "xlsx": {
   "b64": "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",
   "rows": [
    [
     "序号",
     "性别",
     "Q1",
     "Q2",
     "Q3",
     "备注"
    ],
    [
     "1",
     "男",
     "非常同意",
     "同意",
     "4",
     "第一份"
    ],
    [
     "2",
     "女",
     "同意",
     "一般",
     "5",
     ""
    ],
    [
     "3",
     "女",
     "一般",
     "不同意",
     "3",
     "含&符号<>"
    ],
    [
     "4",
     "男",
     "不同意",
     "非常不同意",
     "2",
     "  前后空格  "
    ],
    [
     "5",
     "女",
     "非常不同意",
     "同意",
     "1",
     "换行\n第二行"
    ],
    [
     "6",
     "男",
     "同意",
     "",
     "2.5",
     "end"
    ]
   ],
   "sheet": "问卷数据"
  }
 }
};

const S = ORACLE.sample
const NAME = { MD: '手机依赖', SC: '自我控制', AP: '学业拖延' }
const ITEMS = { MD: ['MD1', 'MD2', 'MD3', 'MD4', 'MD5', 'MD6'], SC: ['SC1', 'SC2', 'SC3', 'SC4', 'SC5'], AP: ['AP1', 'AP2', 'AP3', 'AP4', 'AP5', 'AP6'] }
const ALL17 = [...ITEMS.MD, ...ITEMS.SC, ...ITEMS.AP]
// 页面显示口径（与 app 的 nf / pf 同式）：三位小数、-0.000 去负号；p < 0.001 显示 <0.001
const f3 = (x) => { let s = Number(x).toFixed(3); if (/^-0\.?0*$/.test(s)) s = s.slice(1); return s }
const fp = (p) => (p < 0.001 ? '<0.001' : p.toFixed(3))

export default async ({ page, toolURL, screenshot, assert }) => {
  const TABS = ['data', 'scales', 'analyze', 'report', 'about']
  const onTab = async (t) => {
    await page.click(`#sv-tab-${t}`)
    await page.waitForFunction((x) => !document.getElementById('sv-pane-' + x).hidden && document.getElementById('sv-tab-' + x).getAttribute('aria-selected') === 'true', t)
  }
  const cell = (t, k, root = '#sv-out') => `${root} table[data-t="${t}"] td[data-k="${k}"]`
  const raw = async (t, k, root) => {
    const sel = cell(t, k, root)
    const n = await page.$(sel)
    assert(n, `找不到单元格 ${sel}`)
    return Number(await n.getAttribute('data-raw'))
  }
  const near = async (t, k, exp, tol, root) => {
    const v = await raw(t, k, root)
    assert(Math.abs(v - exp) <= tol, `${t} / ${k} = ${v}，期望 ${exp}（容差 ${tol}）`)
  }
  const shows = async (t, k, text, root) => {
    const got = (await page.textContent(cell(t, k, root))).trim()
    assert(got === text, `${t} / ${k} 显示「${got}」，期望「${text}」`)
  }
  let seq = 0
  const run = async (m, setup) => {
    await onTab('analyze')
    await page.click(`.sv-m[data-m="${m}"]`)
    await page.waitForFunction((x) => document.querySelector(`.sv-m[data-m="${x}"]`).getAttribute('aria-current') === 'true', m)
    if (setup) await setup()
    const before = await page.getAttribute('#sv-out', 'data-ran')
    const n0 = before ? Number(before.split(':')[1]) : 0
    await page.click('#sv-run')
    await page.waitForFunction(([x, want]) => document.querySelector('#sv-out').getAttribute('data-ran') === want || document.getElementById('sv-run-msg').textContent !== '', [m, `${m}:${n0 + 1}`])
    const msg = (await page.textContent('#sv-run-msg')).trim()
    assert(!msg, `${m} 运行报错：${msg}`)
    seq++
  }
  const setVars = async (id, names) => {
    await page.click(`#sv-p-${id}-none`)
    await page.waitForFunction((x) => document.querySelectorAll(`#sv-p-${x} input:checked`).length === 0, id)
    for (const nm of names) await page.check(`#sv-p-${id} input[data-v="${nm}"]`)
    await page.waitForFunction(([x, k]) => document.querySelectorAll(`#sv-p-${x} input:checked`).length === k, [id, names.length])
  }

  // ── 0. 干净状态，载入示例 ──
  await page.goto(toolURL)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.waitForSelector('html[data-sv-ready="1"]')
  assert(await page.isVisible('#sv-hero'), '空状态应显示首屏介绍')
  await page.click('#sv-load-sample')
  await page.waitForFunction(() => document.querySelectorAll('#sv-grid tbody tr').length === 100)
  const meta = await page.textContent('#sv-ds-meta')
  assert(/^360 行 · 24 个变量 · 3 个维度/.test(meta), `数据集摘要不对：${meta}`)
  assert(S.n === 360, '示例应为 360 份')
  // 李克特色块：SC3 是反向题，表头有「反向」徽标；数据格显示原始分值
  assert(await page.$eval('#sv-grid thead th:nth-child(16)', (n) => n.textContent.includes('SC3') && n.textContent.includes('反向')), 'SC3 表头应带「反向」徽标')
  await page.click('#sv-grid-next')
  await page.waitForFunction(() => document.querySelector('#sv-grid tbody tr').getAttribute('data-row') === '101')
  assert((await page.textContent('#sv-grid-page')).includes('第 101–200 行'), '翻页后应显示第 101–200 行')

  // ── 1. 质检：直线作答 6 份、过快 10 份、合计 11 份（行号逐一对拍） ──
  await page.click('#sv-view-quality')
  await page.waitForFunction(() => !document.getElementById('sv-v-quality').hidden)
  assert((await page.textContent('#sv-q-count')).trim() === String(S.quality.flagged.length), `可疑问卷数应为 ${S.quality.flagged.length}`)
  const qrows = await page.$$eval('#sv-q-table tbody tr[data-row]', (ns) => ns.map((n) => Number(n.getAttribute('data-row'))))
  assert(JSON.stringify(qrows) === JSON.stringify(S.quality.flagged), `质检行号 ${qrows} ≠ ${S.quality.flagged}`)
  const straightRows = await page.$$eval('#sv-q-table tbody tr[data-row]', (ns) => ns.filter((n) => n.textContent.includes('直线作答')).map((n) => Number(n.getAttribute('data-row'))))
  assert(JSON.stringify(straightRows) === JSON.stringify(S.quality.straight), `直线作答行 ${straightRows} ≠ ${S.quality.straight}`)
  const fastRows = await page.$$eval('#sv-q-table tbody tr[data-row]', (ns) => ns.filter((n) => n.textContent.includes('作答过快')).map((n) => Number(n.getAttribute('data-row'))))
  assert(JSON.stringify(fastRows) === JSON.stringify(S.quality.fast), `作答过快行 ${fastRows} ≠ ${S.quality.fast}`)
  // 阈值改成 40 秒：期望值由测试自己从原始 CSV 的「作答时长」列算（不经引擎），再与直线作答取并集
  const times = await page.evaluate(() => { const L = SV_SAMPLE.trim().split('\n'), h = L[0].split(','), j = h.indexOf('作答时长'); return L.slice(1).map((l) => Number(l.split(',')[j])) })
  const fast40 = times.map((t, i) => (t < 40 ? i + 1 : 0)).filter(Boolean)
  const flag40 = [...new Set([...S.quality.straight, ...fast40])].sort((a, b) => a - b)
  assert(fast40.length > 0 && fast40.length < S.quality.fast.length, `示例里短于 40 秒的应比短于 60 秒的少：${fast40.length}`)
  await page.fill('#sv-q-mintime', '40')
  await page.dispatchEvent('#sv-q-mintime', 'change')
  await page.waitForFunction((k) => document.getElementById('sv-q-count').textContent.trim() === String(k), flag40.length)
  const rows40 = await page.$$eval('#sv-q-table tbody tr[data-row]', (ns) => ns.map((n) => Number(n.getAttribute('data-row'))))
  assert(JSON.stringify(rows40) === JSON.stringify(flag40), `40 秒阈值下的质检行号 ${rows40} ≠ ${flag40}`)
  await page.fill('#sv-q-mintime', '60')
  await page.dispatchEvent('#sv-q-mintime', 'change')
  await page.waitForFunction((k) => document.getElementById('sv-q-count').textContent.trim() === String(k), S.quality.flagged.length)

  // ── 2. 量表页：三个维度的 α ──
  await onTab('scales')
  const alphas = await page.$$eval('.sv-sc-alpha', (ns) => ns.map((n) => Number(n.getAttribute('data-raw'))))
  assert(alphas.length === 3, `应有 3 个维度卡片，实得 ${alphas.length}`)
  ;['MD', 'SC', 'AP'].forEach((k, i) => assert(Math.abs(alphas[i] - S.reliability[k].alpha) < 1e-9, `${NAME[k]} 卡片 α ${alphas[i]} ≠ ${S.reliability[k].alpha}`))
  assert(await page.$eval('.sv-scale[data-scale="自我控制"] .sv-item[data-item="SC3"]', (n) => n.classList.contains('sv-rev') && n.textContent.includes('反')), 'SC3 应标为反向题')

  // ── 3. 信度：汇总表 + 项总计统计（CITC、删除后 α、SMC） ──
  await run('rel', async () => { await page.selectOption('#sv-p-mode', 'scales') })
  for (const k of ['MD', 'SC', 'AP']) {
    const R = S.reliability[k], nm = NAME[k]
    await near('rel-sum', `${nm}:alpha`, R.alpha, 1e-9)
    await near('rel-sum', `${nm}:alphaStd`, R.alphaStd, 1e-9)
    await near('rel-sum', `${nm}:n`, R.n, 0)
    await near('rel-sum', `${nm}:k`, ITEMS[k].length, 0)
    for (let i = 0; i < ITEMS[k].length; i++) {
      const it = ITEMS[k][i]
      await near(`rel-items-${nm}`, `${it}:citc`, R.citc[i], 1e-9)
      await near(`rel-items-${nm}`, `${it}:del`, R.alphaIfDeleted[i], 1e-9)
      await near(`rel-items-${nm}`, `${it}:smc`, R.smc[i], 1e-9)
    }
  }
  await shows('rel-sum', '手机依赖:alpha', f3(S.reliability.MD.alpha))
  const relText = await page.textContent('#sv-out .sv-interp')
  assert(relText.includes(f3(S.reliability.MD.alpha)) && relText.includes('信度'), '信度解读应写出 α 系数')
  // 自选题项模式：Feldt 置信区间与折半信度
  await run('rel', async () => { await page.selectOption('#sv-p-mode', 'items'); await setVars('items', ITEMS.MD) })
  await near('rel-stat', 'alpha', S.reliability.MD.alpha, 1e-9)
  await near('rel-stat', 'ci', S.reliability.MD.ciLo, 1e-9)
  assert((await page.textContent(cell('rel-stat', 'ci'))).includes(f3(S.reliability.MD.ciHi)), 'α 置信区间上限显示不对')
  await near('rel-split', 'r', S.reliability.MD.splitR, 1e-9)
  await near('rel-split', 'sb', S.reliability.MD.splitSB, 1e-9)
  await near('rel-split', 'guttman', S.reliability.MD.guttman, 1e-9)
  await near('rel-split', 'a1', S.reliability.MD.alpha1, 1e-9)
  await near('rel-split', 'a2', S.reliability.MD.alpha2, 1e-9)

  // ── 4. 效度：KMO / Bartlett / 特征值 / 旋转载荷（主成分 + varimax），再换主轴因子 ──
  await run('efa', async () => {
    await page.selectOption('#sv-p-items-scale', '*')
    await page.waitForFunction(() => document.querySelectorAll('#sv-p-items input:checked').length === 17)
    await page.selectOption('#sv-p-method', 'pca'); await page.selectOption('#sv-p-nf', '0'); await page.selectOption('#sv-p-rot', 'varimax'); await page.selectOption('#sv-p-cut', '0')
  })
  const E = S.efa
  await near('efa-kmo', 'kmo', E.kmo, 1e-9)
  await near('efa-kmo', 'chi2', E.bartlettChi2, 1e-7)
  await near('efa-kmo', 'df', E.bartlettDf, 0)
  await shows('efa-kmo', 'kmo', f3(E.kmo))
  await shows('efa-kmo', 'p', fp(E.bartlettP))
  assert(Number(await page.getAttribute('#sv-out table[data-t="efa-rot"]', 'data-m')) === E.m, `因子个数应为 ${E.m}`)
  for (let i = 0; i < 17; i++) await near('efa-var', `eig-${i + 1}`, E.eigen[i], 1e-9)
  await near('efa-var', `cum-${E.m}`, E.cumPct[E.m - 1], 1e-8)
  for (let f = 0; f < E.m; f++) await near('efa-var', `ssr-${f + 1}`, E.ssRotated[f], 1e-8)
  for (let i = 0; i < 17; i++) {
    for (let f = 0; f < E.m; f++) await near('efa-rot', `${ALL17[i]}:${f + 1}`, E.rotated[i][f], 1e-8)
    await near('efa-rot', `${ALL17[i]}:h2`, E.comm[i], 1e-9)
  }
  // 主载荷高亮的格子 = oracle 的 primary（几何化的另一面：每行恰好一个高亮）
  const hl = await page.$$eval('#sv-out table[data-t="efa-rot"] td.sv-hl', (ns) => ns.map((n) => n.getAttribute('data-k')))
  assert(hl.length === 17 && ALL17.every((it, i) => hl.includes(`${it}:${E.primary[i] + 1}`)), `主载荷高亮与 oracle primary 不一致：${hl.join(',')}`)
  // 碎石图几何：17 个点，前 m 个实心；点的纵坐标随特征值单调
  const scree = await page.$$eval('#sv-out svg[data-fig="efa-scree"] circle', (ns) => ns.map((n) => ({ cy: +n.getAttribute('cy'), fill: n.getAttribute('fill') })))
  assert(scree.length === 17, `碎石图应有 17 个点，实得 ${scree.length}`)
  assert(scree.filter((c) => c.fill !== '#ffffff').length === E.m, '碎石图实心点数应等于提取因子数')
  assert(scree.every((c, i) => i === 0 || c.cy >= scree[i - 1].cy - 0.01), '碎石图点的高度应随特征值递减')
  // 三线表：贴着表头底边 / 表格底边的每个单元格（含跨行合并格）都要真的画出那条线 —— 断计算样式与几何
  // （1.5px 的线在 DPR=1 下会被 Chrome 吸附成 1px，所以门槛取「有实线且 ≥ 0.9px」）
  const lineBad = await page.$$eval('#sv-out table.sv-t', (ts) => {
    const bad = []
    for (const t of ts) {
      const tb = t.tBodies[0].getBoundingClientRect().bottom, th = t.tHead.getBoundingClientRect().bottom
      for (const c of t.querySelectorAll('tbody td')) { const r = c.getBoundingClientRect(); if (Math.abs(r.bottom - tb) < 1.5 && !(parseFloat(getComputedStyle(c).borderBottomWidth) >= 0.9 && getComputedStyle(c).borderBottomStyle === 'solid')) bad.push(t.dataset.t + ' 底线缺：' + c.textContent.slice(0, 12)) }
      for (const c of t.querySelectorAll('thead th')) { const r = c.getBoundingClientRect(); if (Math.abs(r.bottom - th) < 1.5 && parseFloat(getComputedStyle(c).borderBottomWidth) < 0.9) bad.push(t.dataset.t + ' 表头线缺：' + c.textContent.slice(0, 12)) }
    }
    return bad
  })
  assert(lineBad.length === 0, `三线表缺线 ${lineBad.length} 处：${lineBad.slice(0, 4).join('; ')}`)
  const efaText = await page.textContent('#sv-out .sv-interp')
  assert(efaText.includes(f3(E.kmo)) && efaText.includes(`${E.m} 个因子`), 'EFA 解读应写出 KMO 与因子数')
  await guardFigText(page, { assert, tabs: ['analyze'], onTab, figSel: () => '#sv-out svg.sv-fig', minTextsInFig: 10 })
  await run('efa', async () => { await page.selectOption('#sv-p-method', 'paf') })
  for (let i = 0; i < 17; i++) {
    for (let f = 0; f < S.efa_paf.m; f++) await near('efa-rot', `${ALL17[i]}:${f + 1}`, S.efa_paf.rotated[i][f], 1e-8)
    await near('efa-rot', `${ALL17[i]}:h2`, S.efa_paf.comm[i], 1e-9)
  }
  assert((await page.textContent('#sv-out .sv-blk[data-b="efa-rot"] .sv-note')).includes('主轴因子'), 'PAF 结果注释应写明主轴因子法')

  // ── 5. 描述统计 ──
  await run('desc', async () => { await setVars('vars', ['手机依赖', '自我控制', '学业拖延']) })
  for (const k of ['MD', 'SC', 'AP']) {
    const D = S.describe[k], nm = NAME[k]
    await near('desc', `${nm}:n`, D.n, 0)
    for (const f of ['mean', 'sd', 'min', 'max', 'median', 'skew', 'kurt']) await near('desc', `${nm}:${f}`, D[f], 1e-9)
  }
  await shows('desc', '学业拖延:skew', f3(S.describe.AP.skew))

  // ── 6. 频数 ──
  await run('freq', async () => { await setVars('vars', ['性别', '年级']) })
  for (const v of ['性别', '年级']) for (const r of S.freq[v]) {
    await near('freq', `${v}=${r[0]}:n`, r[1], 0)
    await near('freq', `${v}=${r[0]}:pct`, r[3], 1e-9)
    await near('freq', `${v}=${r[0]}:cum`, r[4], 1e-9)
  }

  // ── 7. 相关（成对删除；Pearson 与 Spearman） ──
  for (const [method, rk, pk] of [['pearson', 'r', 'p'], ['spearman', 'rs', 'ps']]) {
    await run('corr', async () => { await setVars('vars', ['手机依赖', '自我控制', '学业拖延']); await page.selectOption('#sv-p-method', method) })
    for (let i = 1; i < 3; i++) for (let j = 0; j < i; j++) {
      await near('corr', `${i + 1}-${j + 1}:${'r'}`, S.corr[rk][i][j], 1e-9)
      const pv = Number(await page.getAttribute(cell('corr', `${i + 1}-${j + 1}:r`), 'data-p'))
      assert(Math.abs(pv - S.corr[pk][i][j]) <= 1e-12 + 1e-7 * S.corr[pk][i][j], `${method} p[${i}][${j}] = ${pv} ≠ ${S.corr[pk][i][j]}`)
    }
  }

  // ── 8. 独立样本 t：手机依赖 × 性别 ──
  await run('ttest', async () => {
    await setVars('ys', ['手机依赖'])
    await page.selectOption('#sv-p-g', '性别')
    await page.waitForFunction(() => document.querySelectorAll('#sv-p-g1 option').length === 2)
    await page.selectOption('#sv-p-g1', '1'); await page.selectOption('#sv-p-g2', '2')
  })
  const T = S.ttest
  for (const [k, v, tol] of [['leveneF', T.leveneF, 1e-9], ['leveneP', T.leveneP, 1e-9], ['tP', T.t, 1e-9], ['dfP', T.df, 0], ['pP', T.p, 1e-12], ['loP', T.ciLo, 1e-9], ['hiP', T.ciHi, 1e-9],
    ['tW', T.tW, 1e-9], ['dfW', T.dfW, 1e-8], ['pW', T.pW, 1e-12], ['loW', T.ciLoW, 1e-9], ['hiW', T.ciHiW, 1e-9], ['md', T.md, 1e-12]]) await near('tt-full', `手机依赖:${k}`, v, tol)
  await near('tt', '手机依赖:d', T.d, 1e-9)
  await near('tt-grp', '手机依赖:1:mean', T.a.mean, 1e-12)
  await near('tt-grp', '手机依赖:2:sd', T.b.sd, 1e-12)
  await shows('tt', '手机依赖:p', fp(T.p))
  await shows('tt', '手机依赖:t', f3(T.t))

  // ── 9. 单样本 t：手机依赖 vs 3 ──
  await run('onet', async () => { await setVars('vars', ['手机依赖']); await page.fill('#sv-p-mu', '3'); await page.dispatchEvent('#sv-p-mu', 'change') })
  for (const k of ['t', 'df', 'p', 'md', 'd']) await near('onet', `手机依赖:${k}`, S.ttestOne[k], 1e-9)
  await near('onet', '手机依赖:ci', S.ttestOne.ciLo, 1e-9)

  // ── 10. 单因素方差分析：学业拖延 × 日均使用时长，三种事后比较 ──
  const AN = S.anova
  for (const [ph, pk, lo, hi] of [['tukey', 'tukeyP', 'tukeyLo', 'tukeyHi'], ['gh', 'ghP', 'ghLo', 'ghHi'], ['lsd', 'lsdP', 'lsdLo', 'lsdHi']]) {
    await run('anova', async () => { await setVars('ys', ['学业拖延']); await page.selectOption('#sv-p-g', '日均使用时长'); await page.selectOption('#sv-p-ph', ph) })
    assert((await page.getAttribute('#sv-out table[data-t="an-ph-学业拖延"]', 'data-ph')) === ph, `事后比较方法应为 ${ph}`)
    for (const q of AN.pairs) {
      const k = `${q.i}-${q.j}`, tol = ph === 'lsd' ? 1e-10 : 1e-7  // Tukey / GH 的 p 来自学生化极差分布的数值积分
      await near('an-ph-学业拖延', `${k}:md`, q.md, 1e-12)
      await near('an-ph-学业拖延', `${k}:p`, q[pk], tol)
      await near('an-ph-学业拖延', `${k}:lo`, q[lo], tol)
      await near('an-ph-学业拖延', `${k}:hi`, q[hi], tol)
    }
  }
  for (const [k, v] of [['F', AN.F], ['p', AN.p], ['ssb', AN.ssb], ['ssw', AN.ssw], ['dfb', AN.dfb], ['dfw', AN.dfw]]) await near('an-tab-学业拖延', k, v, 1e-9)
  for (const [k, v] of [['leveneF', AN.leveneF], ['leveneP', AN.leveneP], ['welchF', AN.welchF], ['welchDf2', AN.welchDf2], ['welchP', AN.welchP]]) await near('an-lev-学业拖延', k, v, 1e-8)
  await near('an', '学业拖延:eta2', AN.eta2, 1e-12)
  // 均值图几何：每组一条 CI 竖线、竖线跨过均值点
  const meansOk = await page.$$eval('#sv-out svg[data-fig="an-means"]', (svgs) => {
    const s = svgs[0], lines = [...s.querySelectorAll('line')].filter((l) => l.getAttribute('x1') === l.getAttribute('x2') && +l.getAttribute('y1') !== +l.getAttribute('y2'))
    const dots = [...s.querySelectorAll('circle')]
    return { lines: lines.length, dots: dots.length, inside: dots.every((c) => lines.some((l) => Math.abs(+l.getAttribute('x1') - +c.getAttribute('cx')) < 0.01 && +c.getAttribute('cy') <= Math.max(+l.getAttribute('y1'), +l.getAttribute('y2')) && +c.getAttribute('cy') >= Math.min(+l.getAttribute('y1'), +l.getAttribute('y2')))) }
  })
  assert(meansOk.dots === 4 && meansOk.inside, `均值图应有 4 个均值点且都落在各自的 CI 竖线上：${JSON.stringify(meansOk)}`)
  await guardFigText(page, { assert, tabs: ['analyze'], onTab, figSel: () => '#sv-out svg.sv-fig', minTextsInFig: 6 })

  // ── 11. 卡方：性别 × 日均使用时长（2×4），性别 × 独生子女（2×2：连续性校正 + Fisher） ──
  await run('chisq', async () => { await page.selectOption('#sv-p-r', '性别'); await page.selectOption('#sv-p-c', '日均使用时长') })
  const CX = S.chisq
  for (const [k, v] of [['pearson:chi2', CX.chi2], ['pearson:df', CX.df], ['pearson:p', CX.p], ['lr:chi2', CX.lr], ['linear:chi2', CX.linear], ['linear:p', CX.linearP]]) await near('cx-test', k, v, 1e-9)
  assert(Math.abs(Number(await page.getAttribute('#sv-out table[data-t="cx-test"]', 'data-v')) - CX.cramerV) < 1e-12, 'Cramér V 不对')
  for (let i = 0; i < CX.O.length; i++) for (let j = 0; j < CX.O[i].length; j++) await near('cx', `O-${i}-${j}`, CX.O[i][j], 0)
  await run('chisq', async () => { await page.selectOption('#sv-p-r', '性别'); await page.selectOption('#sv-p-c', '独生子女') })
  const C2 = S.chisq2x2
  for (const [k, v] of [['pearson:chi2', C2.chi2], ['pearson:p', C2.p], ['yates:chi2', C2.yates], ['yates:p', C2.yatesP], ['fisher:two', C2.fisher2]]) await near('cx-test', k, v, 1e-9)

  // ── 12. 分层回归：学业拖延 ← [性别, 年级] → + [手机依赖, 自我控制] ──
  await run('reg', async () => {
    await page.selectOption('#sv-p-y', '学业拖延')
    await setVars('b1', ['性别', '年级']); await setVars('b2', ['手机依赖', '自我控制'])
  })
  const HR = S.hier
  for (let m = 0; m < 2; m++) {
    const o = HR.models[m], k = `m${m + 1}`
    for (const [f, v] of [['r2', o.r2], ['adj', o.adjR2], ['dR2', o.dR2], ['dF', o.dF], ['dP', o.dP]]) await near('reg-sum', `${k}:${f}`, v, 1e-9)
    await near('reg-anova', `${k}:F`, o.F, 1e-9)
  }
  await near('reg-sum', 'dw', HR.final.dw, 1e-9)
  const nm2 = { '(常量)': '(常量)', 性别: '性别', 年级: '年级', MD: '手机依赖', SC: '自我控制' }
  for (const c of HR.final.coefs) {
    const k = nm2[c.name]
    for (const f of ['B', 'se', 't', 'p', 'lo', 'hi']) await near('reg-coef', `${k}:${f}`, c[f], f === 'p' ? 1e-12 : 1e-9)
    if (c.vif != null) { await near('reg-coef', `${k}:vif`, c.vif, 1e-9); await near('reg-coef', `${k}:beta`, c.beta, 1e-9) }
  }

  // ── 13. 中介：手机依赖 → 自我控制 → 学业拖延，Bootstrap 5000 次、种子 20261027（与 oracle 逐位复刻的抽样一致） ──
  await run('med', async () => {
    await page.selectOption('#sv-p-x', '手机依赖'); await setVars('ms', ['自我控制']); await page.selectOption('#sv-p-y', '学业拖延'); await setVars('cov', [])
    await page.selectOption('#sv-p-boot', '5000'); await page.fill('#sv-p-seed', '20261027'); await page.dispatchEvent('#sv-p-seed', 'change')
  })
  const MD_ = S.mediation
  for (const [t, k, v] of [['med-path', 'a1:B', MD_.a], ['med-path', 'a1:se', MD_.aSe], ['med-path', 'b1:B', MD_.b], ['med-path', 'b1:se', MD_.bSe], ['med-path', 'cp:B', MD_.cp], ['med-path', 'c:B', MD_.c], ['med-path', 'c:se', MD_.cSe],
    ['med-eff', 'ind1:eff', MD_.ind], ['med-eff', 'ind1:lo', MD_.lo], ['med-eff', 'ind1:hi', MD_.hi], ['med-eff', 'ind1:se', MD_.bootSe], ['med-eff', 'ind1:ratio', MD_.ratio], ['med-sobel', 'z', MD_.sobelZ]]) await near(t, k, v, 1e-9)
  // 恒等式 c = c′ + ab（OLS 下精确成立，不依赖任何实现）
  const cc = await raw('med-path', 'c:B'), cpv = await raw('med-path', 'cp:B'), ab = await raw('med-eff', 'ind1:eff')
  assert(Math.abs(cc - cpv - ab) < 1e-12, `c − c′ − ab = ${cc - cpv - ab}，应为 0`)
  await shows('med-eff', 'ind1:lo', f3(MD_.lo))
  const medText = await page.textContent('#sv-out .sv-interp')
  assert(medText.includes(`[${f3(MD_.lo)}, ${f3(MD_.hi)}]`) && medText.includes('部分中介'), `中介解读应写出置信区间与「部分中介」：${medText.slice(0, 120)}`)
  // 路径图：3 个方框、3 条带箭头的线；a 路径标注落在 X 与 M 方框之间
  const diag = await page.$$eval('#sv-out svg[data-fig="med-diagram"]', (s) => ({ rects: s[0].querySelectorAll('rect[rx]').length, arrows: s[0].querySelectorAll('line[marker-end]').length, texts: [...s[0].querySelectorAll('text')].map((t) => t.textContent) }))
  assert(diag.rects === 3 && diag.arrows === 3, `路径图应为 3 框 3 箭头：${JSON.stringify(diag)}`)
  assert(diag.texts.some((t) => t.startsWith('a = ' + f3(MD_.a))) && diag.texts.some((t) => t.startsWith('b = ' + f3(MD_.b))), '路径图应标出 a、b 系数')
  await guardFigText(page, { assert, tabs: ['analyze'], onTab, figSel: () => '#sv-out svg.sv-fig', minTextsInFig: 5 })
  // 同一种子再跑一次：区间逐位相同（可复现）；换种子：区间变化
  const lo1 = await raw('med-eff', 'ind1:lo'), hi1 = await raw('med-eff', 'ind1:hi')
  await run('med')
  assert((await raw('med-eff', 'ind1:lo')) === lo1 && (await raw('med-eff', 'ind1:hi')) === hi1, '同一种子重跑，Bootstrap 区间应逐位相同')
  await run('med', async () => { await page.fill('#sv-p-seed', '7'); await page.dispatchEvent('#sv-p-seed', 'change') })
  assert(Math.abs((await raw('med-eff', 'ind1:lo')) - MD_.lo) > 1e-6, '换种子后 Bootstrap 区间应有变化')

  // ── 14. 调节：手机依赖 × 性别 → 学业拖延（两组简单斜率）；手机依赖 × 自我控制（M±1SD + Johnson-Neyman） ──
  await run('mod', async () => { await page.selectOption('#sv-p-x', '手机依赖'); await page.selectOption('#sv-p-w', '性别'); await page.selectOption('#sv-p-y', '学业拖延'); await setVars('cov', []); await page.check('#sv-p-center') })
  const MO = S.moderation
  for (const [k, v] of [['XW:B', MO.b3], ['XW:se', MO.b3se], ['XW:p', MO.b3p], ['X:B', MO.b1], ['W:B', MO.b2], ['r2', MO.r2], ['dR2', MO.dR2]]) await near('mod-coef', k, v, 1e-9)
  for (let i = 0; i < MO.slopes.length; i++) for (const f of ['slope', 'se', 't', 'p', 'lo', 'hi']) await near('mod-slope', `s${i + 1}:${f}`, MO.slopes[i][f], 1e-9)
  // 简单斜率图几何：两条线的像素斜率之比 = 两个简单斜率之比
  const pr = await page.$$eval('#sv-out svg[data-fig="mod-slopes"] path[clip-path]', (ps) => ps.map((p) => { const m = p.getAttribute('d').match(/-?\d+(\.\d+)?/g).map(Number); return (m[1] - m[3]) / (m[2] - m[0]) }))
  assert(pr.length === 2 && Math.abs(pr[1] / pr[0] - MO.slopes[1].slope / MO.slopes[0].slope) < 0.01, `斜率图两条线的斜率比 ${pr[1] / pr[0]} ≠ ${MO.slopes[1].slope / MO.slopes[0].slope}`)
  await guardFigText(page, { assert, tabs: ['analyze'], onTab, figSel: () => '#sv-out svg.sv-fig', minTextsInFig: 8 })
  await run('mod', async () => { await page.selectOption('#sv-p-w', '自我控制') })
  const M2 = S.moderation2
  await near('mod-coef', 'XW:B', M2.b3, 1e-9)
  for (let i = 0; i < 3; i++) await near('mod-slope', `s${i + 1}:slope`, M2.slopes[i].slope, 1e-9)
  const jn = (await page.getAttribute('#sv-out .sv-interp', 'data-jn')).split(',').filter(Boolean).map(Number)
  assert(jn.length === M2.jn.length && jn.every((v, i) => Math.abs(v - M2.jn[i]) < 1e-8), `Johnson-Neyman 点 ${jn} ≠ ${M2.jn}`)

  // ── 15. 页面列出的 14 种方法逐一用默认参数跑通（「能力清单」逐项命中） ──
  const methods = await page.$$eval('.sv-m', (ns) => ns.map((n) => n.getAttribute('data-m')))
  assert(methods.length === 14, `方法清单应有 14 项，实得 ${methods.length}`)
  await page.evaluate(() => { SVA.S.ui.params = {} })
  for (const m of methods) {
    await run(m)
    const nt = await page.$$eval('#sv-out table.sv-t', (ns) => ns.length)
    assert(nt >= 1, `${m} 用默认参数应至少出 1 张表`)
  }

  // ── 16. 剔除可疑问卷后重算：手机依赖 α 与 n 变化 ──
  await onTab('data'); await page.click('#sv-view-quality')
  await page.check('#sv-q-exclude')
  await page.waitForFunction((k) => document.getElementById('sv-ds-meta').textContent.includes(`分析用 ${k} 份`), S.quality.nKept)
  await run('rel', async () => { await page.selectOption('#sv-p-mode', 'scales') })
  await near('rel-sum', '手机依赖:alpha', S.reliability.MD_excl.alpha, 1e-9)
  await near('rel-sum', '手机依赖:n', S.reliability.MD_excl.n, 0)

  // ── 17. 持久化：改名后**立刻**刷新（防抖写盘必须在离页时补写） ──
  await onTab('data'); await page.click('#sv-view-grid')
  await page.fill('#sv-ds-name', '持久化测试')
  await page.dispatchEvent('#sv-ds-name', 'change')
  await page.reload()
  await page.waitForSelector('html[data-sv-ready="1"]')
  await onTab('data')
  assert((await page.inputValue('#sv-ds-name')) === '持久化测试', '改名后立刻刷新，名字应已保存')
  assert((await page.textContent('#sv-ds-meta')).includes(`分析用 ${S.quality.nKept} 份`), '剔除设置应在刷新后保留')
  await onTab('scales')
  assert((await page.$$('.sv-scale')).length === 3, '刷新后 3 个维度应保留')
  await onTab('data'); await page.click('#sv-view-quality'); await page.uncheck('#sv-q-exclude')
  await page.waitForFunction(() => !document.getElementById('sv-ds-meta').textContent.includes('分析用'))

  // ── 18. 报告：一键生成 + 导出 Word ──
  await onTab('report')
  for (const s of ['sample', 'rel', 'efa', 'desc', 'diff', 'corr', 'reg', 'med']) await page.check(`#sv-rep-s-${s}`)
  await page.selectOption('#sv-rep-dv', '学业拖延'); await page.selectOption('#sv-rep-x', '手机依赖'); await page.selectOption('#sv-rep-m', '自我控制')
  await page.click('#sv-rep-gen')
  await page.waitForFunction(() => Number(document.getElementById('sv-rep').getAttribute('data-tables')) > 0)
  const nTab = Number(await page.getAttribute('#sv-rep', 'data-tables'))
  const heads = await page.$$eval('#sv-rep h3', (ns) => ns.map((n) => n.textContent))
  assert(heads.length === 8 && heads[0].startsWith('一、') && heads[7].startsWith('八、'), `报告应有 8 个部分：${heads.join('|')}`)
  assert(nTab >= 14, `报告表格数 ${nTab} 太少`)
  assert(!(await page.textContent('#sv-rep-msg')).includes('没能生成'), '报告各部分都应生成成功')
  await near('rel-sum', '手机依赖:alpha', S.reliability.MD.alpha, 1e-9, '#sv-rep')
  await near('med-eff', 'ind1:lo', MD_.lo, 1e-9, '#sv-rep')
  const caps = await page.$$eval('#sv-rep .sv-cap', (ns) => ns.map((n) => n.textContent))
  assert(caps[0].startsWith('表 1') && caps[caps.length - 1].startsWith('表 ' + nTab), `表格编号应连续 1…${nTab}`)
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#sv-rep-doc')])
  assert(/数据分析\.doc$/.test(dl.suggestedFilename()), `导出文件名不对：${dl.suggestedFilename()}`)
  const doc = await page.evaluate(() => SVA.lastDoc)
  assert(doc.includes('urn:schemas-microsoft-com:office:word') && (doc.match(/<table/g) || []).length === nTab && doc.includes('表 1　'), 'Word 文档应含全部表格与编号')
  assert(doc.includes('border-top:1.5pt solid #000') && doc.includes('border-bottom:0.75pt solid #000'), 'Word 表格应为三线表样式')

  // ── 19. 导入：粘贴（问卷星文字选项自动编码） ──
  await onTab('data')
  await page.click('#sv-new-data')
  await page.waitForFunction(() => !document.getElementById('sv-noData').hidden)
  await page.fill('#sv-paste', '编号\t性别\tQ1\tQ2\tQ3\n1\t男\t同意\t非常同意\t一般\n2\t女\t不同意\t同意\t同意\n3\t女\t非常同意\t一般\t不同意\n4\t男\t一般\t不同意\t非常不同意\n')
  await page.click('#sv-paste-go')
  await page.waitForFunction(() => /^4 行 · 5 个变量/.test(document.getElementById('sv-ds-meta').textContent))
  const q1 = await page.$$eval('#sv-grid tbody tr', (rs) => rs.map((r) => r.children[3].textContent))
  assert(JSON.stringify(q1) === JSON.stringify(['4', '2', '5', '3']), `李克特文字应按「非常不同意=1 … 非常同意=5」编码：${q1}`)
  await page.click('#sv-view-vars')
  assert((await page.inputValue('#sv-vars tr[data-var="Q1"] .sv-v-values')) === '1=非常不同意; 2=不同意; 3=一般; 4=同意; 5=非常同意', 'Q1 值标签不对')
  assert((await page.inputValue('#sv-vars tr[data-var="性别"] .sv-v-values')) === '1=男; 2=女', '性别值标签应按出现顺序编码')
  await guardControlSize(page, { assert, tabs: ['data'], onTab: async () => {}, paneSel: () => '#sv-pane-data', minControls: 30 })
  await page.click('#sv-view-grid')

  // ── 20. 导入：xlsx（openpyxl 写的工作簿：共享字符串、空格子、XML 转义、单元格内换行、第二个工作表） ──
  await page.click('#sv-new-data')
  await page.setInputFiles('#sv-file', { name: 'mini.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: Buffer.from(S.xlsx.b64, 'base64') })
  await page.waitForFunction(() => /^6 行 · 6 个变量/.test(document.getElementById('sv-ds-meta').textContent))
  const xr = S.xlsx.rows
  const grid = await page.$$eval('#sv-grid tbody tr', (rs) => rs.map((r) => [...r.children].slice(1).map((c) => c.textContent)))
  const LK = { 非常不同意: '1', 不同意: '2', 一般: '3', 同意: '4', 非常同意: '5', '': '·' }
  for (let i = 1; i < xr.length; i++) {
    assert(grid[i - 1][2] === LK[xr[i][2]] && grid[i - 1][3] === LK[xr[i][3]], `xlsx 第 ${i} 行 Q1/Q2 编码不对：${grid[i - 1]} vs ${xr[i]}`)
    assert(grid[i - 1][4] === xr[i][4], `xlsx 第 ${i} 行数字列 ${grid[i - 1][4]} ≠ ${xr[i][4]}`)
    const note = xr[i][5].trim()
    assert(note === '' ? grid[i - 1][5] === '·' : grid[i - 1][5] === note, `xlsx 第 ${i} 行文字列「${grid[i - 1][5]}」≠「${note}」`)
  }
  // csv 文件（UTF-8 BOM + 引号里的逗号与换行）
  await page.click('#sv-new-data')
  const csv = String.fromCharCode(0xfeff) + '组别,得分,说明\r\n1,3.5,"甲,乙"\r\n2,4,"多\n行"\r\n1,2.5,普通\r\n'
  await page.setInputFiles('#sv-file', { name: 'mini.csv', mimeType: 'text/csv', buffer: Buffer.from(csv, 'utf8') })
  await page.waitForFunction(() => /^3 行 · 3 个变量/.test(document.getElementById('sv-ds-meta').textContent))
  const cg = await page.$$eval('#sv-grid tbody tr', (rs) => rs.map((r) => r.children[2].textContent + '|' + r.children[3].textContent))
  assert(JSON.stringify(cg) === JSON.stringify(['3.5|甲,乙', '4|多\n行', '2.5|普通']), `CSV 解析不对：${JSON.stringify(cg)}`)
  // 切回示例数据集
  const sampleId = await page.$eval('#sv-ds-switch', (s) => [...s.options].find((o) => o.textContent === '持久化测试').value)
  await page.selectOption('#sv-ds-switch', sampleId)
  await page.waitForFunction(() => /^360 行/.test(document.getElementById('sv-ds-meta').textContent))

  // ── 21. 键盘：页签可用方向键切换 ──
  await page.focus('#sv-tab-data')
  await page.keyboard.press('ArrowRight')
  await page.waitForFunction(() => document.activeElement && document.activeElement.id === 'sv-tab-scales' && !document.getElementById('sv-pane-scales').hidden)
  await page.keyboard.press('End')
  await page.waitForFunction(() => document.activeElement.id === 'sv-tab-about')

  // ── 22. 说明页公布的对拍数字 = 离线套件实测值（异源核对，钉死字面量） ──
  await onTab('about')
  const about = await page.textContent('#sv-validation')
  for (const s of ORACLE.meta.validation) assert(about.includes(s), `说明页缺少对拍数字「${s}」`)

  // ── 23. 渲染守卫（逐页签 × 390/768/1280 视口） ──
  await run('efa', async () => { await page.selectOption('#sv-p-items-scale', '*'); await page.selectOption('#sv-p-method', 'pca') })
  await onTab('report'); await page.click('#sv-rep-gen')
  await page.waitForFunction(() => Number(document.getElementById('sv-rep').getAttribute('data-tables')) > 0)
  const nCtl = await renderGuards(page, {
    assert, tabs: TABS, onTab, paneSel: (t) => `#sv-pane-${t}`, panesRoot: '#sv-panes',
    figSel: (t) => `#sv-pane-${t} svg.sv-fig`, cardSel: '.sv-card, .sv-soft, .sv-sig, .sv-scale, .sv-cream', minControls: 40, minTextsInFig: 10, minIds: 60
  })
  assert(nCtl >= 40, `可见控件数 ${nCtl}`)
  for (const t of TABS) { await onTab(t); await guardEscape(page, { assert, cardSel: '.sv-card, .sv-soft, .sv-sig, .sv-scale, .sv-cream', childSel: 'svg,table,dl,h2,h3,p,button,select,input' }) }

  // ── 缩略图：分析页的中介效应结果 ──
  await page.setViewportSize({ width: 1280, height: 800 })
  await run('med', async () => { await page.selectOption('#sv-p-x', '手机依赖'); await setVars('ms', ['自我控制']); await page.selectOption('#sv-p-y', '学业拖延') })
  await page.evaluate(() => { const el = document.querySelector('#sv-out .sv-blk[data-b="med-eff"]'); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 80) })
  await page.waitForFunction(() => window.scrollY > 200)
  await screenshot('thumb.png')
}
