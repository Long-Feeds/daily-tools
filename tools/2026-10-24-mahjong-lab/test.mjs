// 麻将工作台 · 集成测试
// 真值全部来自 uitruth/oracle.py（mahjong 2.0 的向听数与 HandCalculator、PyMahjongGB 1.4），由 inject-oracle.mjs 机械注入，不手抄。
import { renderGuards } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs';

const ORACLE = {
 "meta": {
  "tabs": [
   "eff",
   "score",
   "train",
   "ref",
   "saved"
  ],
  "seed": 7
 },
 "eff": {
  "rows": [
   {
    "d": 11,
    "shanten": 1,
    "kinds": 12,
    "count": 38
   },
   {
    "d": 14,
    "shanten": 1,
    "kinds": 12,
    "count": 38
   },
   {
    "d": 24,
    "shanten": 1,
    "kinds": 9,
    "count": 32
   },
   {
    "d": 5,
    "shanten": 2,
    "kinds": 19,
    "count": 66
   },
   {
    "d": 18,
    "shanten": 2,
    "kinds": 16,
    "count": 53
   },
   {
    "d": 19,
    "shanten": 2,
    "kinds": 16,
    "count": 53
   },
   {
    "d": 20,
    "shanten": 2,
    "kinds": 16,
    "count": 53
   },
   {
    "d": 23,
    "shanten": 2,
    "kinds": 16,
    "count": 53
   },
   {
    "d": 26,
    "shanten": 2,
    "kinds": 16,
    "count": 53
   },
   {
    "d": 22,
    "shanten": 2,
    "kinds": 15,
    "count": 50
   },
   {
    "d": 25,
    "shanten": 2,
    "kinds": 15,
    "count": 50
   }
  ],
  "deep": {
   "11": 4.92,
   "14": 4.92,
   "24": 5.75
  }
 },
 "eff13": {
  "shanten": 0,
  "waits": [
   {
    "t": 0,
    "left": 4,
    "ron": {
     "han": 2,
     "fu": 30,
     "main": 2000,
     "additional": 0,
     "total": 2000,
     "yaku": [
      "riichi",
      "pinfu"
     ]
    },
    "tsumo": {
     "han": 3,
     "fu": 20,
     "main": 1300,
     "additional": 700,
     "total": 2700,
     "yaku": [
      "tsumo",
      "riichi",
      "pinfu"
     ]
    }
   },
   {
    "t": 3,
    "left": 3,
    "ron": {
     "han": 2,
     "fu": 30,
     "main": 2000,
     "additional": 0,
     "total": 2000,
     "yaku": [
      "riichi",
      "pinfu"
     ]
    },
    "tsumo": {
     "han": 3,
     "fu": 20,
     "main": 1300,
     "additional": 700,
     "total": 2700,
     "yaku": [
      "tsumo",
      "riichi",
      "pinfu"
     ]
    }
   },
   {
    "t": 6,
    "left": 4,
    "ron": {
     "han": 2,
     "fu": 30,
     "main": 2000,
     "additional": 0,
     "total": 2000,
     "yaku": [
      "riichi",
      "pinfu"
     ]
    },
    "tsumo": {
     "han": 3,
     "fu": 20,
     "main": 1300,
     "additional": 700,
     "total": 2700,
     "yaku": [
      "tsumo",
      "riichi",
      "pinfu"
     ]
    }
   }
  ]
 },
 "riichi": {
  "R1": {
   "han": 3,
   "fu": 50,
   "main": 6400,
   "additional": 0,
   "total": 6400,
   "yaku": [
    "riichi",
    "sanankou"
   ]
  },
  "R1b": {
   "han": 4,
   "fu": 40,
   "main": 4000,
   "additional": 2000,
   "total": 9600,
   "yaku": [
    "tsumo",
    "riichi",
    "sanankou"
   ]
  },
  "R2": {
   "han": 2,
   "fu": 40,
   "main": 2600,
   "additional": 0,
   "total": 2600,
   "yaku": [
    "chun",
    "aka"
   ]
  },
  "R3": {
   "han": 4,
   "fu": 20,
   "main": 2600,
   "additional": 2600,
   "total": 7800,
   "yaku": [
    "tsumo",
    "riichi",
    "pinfu",
    "dora"
   ]
  }
 },
 "mcr": {
  "M1": {
   "total": 71,
   "fans": [
    [
     "一色双龙会",
     1,
     64
    ],
    [
     "不求人",
     1,
     4
    ],
    [
     "单钓将",
     1,
     1
    ],
    [
     "花牌",
     2,
     1
    ]
   ]
  },
  "M2": {
   "total": 24,
   "fans": [
    [
     "七星不靠",
     1,
     24
    ]
   ]
  },
  "M3": {
   "total": 15,
   "fans": [
    [
     "组合龙",
     1,
     12
    ],
    [
     "箭刻",
     1,
     2
    ],
    [
     "单钓将",
     1,
     1
    ]
   ]
  },
  "M4": {
   "total": 27,
   "fans": [
    [
     "花龙",
     1,
     8
    ],
    [
     "妙手回春",
     1,
     8
    ],
    [
     "不求人",
     1,
     4
    ],
    [
     "和绝张",
     1,
     4
    ],
    [
     "平和",
     1,
     2
    ],
    [
     "花牌",
     1,
     1
    ]
   ]
  }
 },
 "mcr13": [
  {
   "t": 31,
   "ron": {
    "total": 24,
    "fans": [
     [
      "全不靠",
      1,
      12
     ],
     [
      "组合龙",
      1,
      12
     ]
    ]
   },
   "self": {
    "total": 25,
    "fans": [
     [
      "全不靠",
      1,
      12
     ],
     [
      "组合龙",
      1,
      12
     ],
     [
      "自摸",
      1,
      1
     ]
    ]
   }
  },
  {
   "t": 32,
   "ron": {
    "total": 24,
    "fans": [
     [
      "全不靠",
      1,
      12
     ],
     [
      "组合龙",
      1,
      12
     ]
    ]
   },
   "self": {
    "total": 25,
    "fans": [
     [
      "全不靠",
      1,
      12
     ],
     [
      "组合龙",
      1,
      12
     ],
     [
      "自摸",
      1,
      1
     ]
    ]
   }
  },
  {
   "t": 33,
   "ron": {
    "total": 24,
    "fans": [
     [
      "全不靠",
      1,
      12
     ],
     [
      "组合龙",
      1,
      12
     ]
    ]
   },
   "self": {
    "total": 25,
    "fans": [
     [
      "全不靠",
      1,
      12
     ],
     [
      "组合龙",
      1,
      12
     ],
     [
      "自摸",
      1,
      1
     ]
    ]
   }
  }
 ],
 "quiz": {
  "q1": {
   "tiles": [
    36,
    5,
    17,
    23,
    6,
    14,
    10,
    32,
    5,
    18,
    13,
    4,
    17,
    11
   ],
   "best": [
    5,
    18,
    32
   ],
   "worst": 17,
   "bestCount": 20,
   "rows": [
    [
     5,
     2,
     20
    ],
    [
     18,
     2,
     20
    ],
    [
     32,
     2,
     20
    ],
    [
     10,
     3,
     69
    ],
    [
     14,
     3,
     65
    ],
    [
     13,
     3,
     63
    ],
    [
     22,
     3,
     63
    ],
    [
     11,
     3,
     59
    ]
   ]
  },
  "q2": {
   "tiles": [
    3,
    33,
    21,
    29,
    28,
    14,
    20,
    31,
    19,
    15,
    3,
    16,
    26,
    31
   ],
   "best": [
    28,
    29,
    33
   ],
   "worst": 31,
   "bestCount": 21,
   "rows": [
    [
     28,
     2,
     21
    ],
    [
     29,
     2,
     21
    ],
    [
     33,
     2,
     21
    ],
    [
     26,
     2,
     13
    ],
    [
     3,
     3,
     41
    ],
    [
     14,
     3,
     32
    ],
    [
     16,
     3,
     32
    ],
    [
     19,
     3,
     32
    ]
   ]
  },
  "wait": {
   "tiles": [
    18,
    19,
    19,
    20,
    20,
    21,
    21,
    22,
    23,
    24,
    25,
    25,
    25
   ],
   "waits": [
    18,
    20,
    21,
    23,
    24,
    26
   ]
  },
  "wait2": {
   "tiles": [
    18,
    18,
    20,
    21,
    22,
    22,
    23,
    24,
    24,
    25,
    26,
    26,
    26
   ],
   "waits": [
    18,
    23,
    26
   ]
  },
  "score": {
   "han": 5,
   "fu": 50,
   "main": 4000,
   "additional": 2000,
   "total": 8000,
   "yaku": [
    "tsumo",
    "riichi",
    "seat_n",
    "sanankou"
   ],
   "hand": {
    "tiles": [
     2,
     2,
     10,
     11,
     12,
     25,
     25,
     30,
     30,
     30,
     25
    ],
    "melds": [
     {
      "type": "ankan",
      "tiles": [
       15,
       15,
       15,
       15
      ]
     }
    ],
    "win": 10
   }
  }
 },
 "examples": {
  "riichi": [
   {
    "key": "tsumo",
    "hand": "123m456p2355789s+4s",
    "han": 2,
    "fu": 20,
    "total": 1500
   },
   {
    "key": "riichi",
    "hand": "123m456p2355789s+4s",
    "han": 2,
    "fu": 30,
    "total": 2000
   },
   {
    "key": "ippatsu",
    "hand": "123m456p2355789s+4s",
    "han": 3,
    "fu": 30,
    "total": 3900
   },
   {
    "key": "pinfu",
    "hand": "123m456p2355789s+4s",
    "han": 1,
    "fu": 30,
    "total": 1000
   },
   {
    "key": "tanyao",
    "hand": "234m456p2234567s+8s",
    "han": 2,
    "fu": 30,
    "total": 2000
   },
   {
    "key": "iipeiko",
    "hand": "22334m56799p678s+4m",
    "han": 2,
    "fu": 30,
    "total": 2000
   },
   {
    "key": "haku",
    "hand": "123m45556p789s55z+5z",
    "han": 1,
    "fu": 40,
    "total": 1300
   },
   {
    "key": "hatsu",
    "hand": "123m45556p789s66z+6z",
    "han": 1,
    "fu": 40,
    "total": 1300
   },
   {
    "key": "chun",
    "hand": "123m45556p789s77z+7z",
    "han": 1,
    "fu": 40,
    "total": 1300
   },
   {
    "key": "seat_e",
    "hand": "123m45556p789s11z+1z",
    "han": 1,
    "fu": 40,
    "total": 2000
   },
   {
    "key": "seat_s",
    "hand": "123m45556p789s22z+2z",
    "han": 1,
    "fu": 40,
    "total": 1300
   },
   {
    "key": "seat_w",
    "hand": "123m45556p789s33z+3z",
    "han": 1,
    "fu": 40,
    "total": 1300
   },
   {
    "key": "seat_n",
    "hand": "123m45556p789s44z+4z",
    "han": 1,
    "fu": 40,
    "total": 1300
   },
   {
    "key": "round_e",
    "hand": "123m45556p789s11z+1z",
    "han": 1,
    "fu": 40,
    "total": 1300
   },
   {
    "key": "round_s",
    "hand": "123m45556p789s22z+2z",
    "han": 1,
    "fu": 40,
    "total": 2000
   },
   {
    "key": "round_w",
    "hand": "123m45556p789s33z+3z",
    "han": 1,
    "fu": 40,
    "total": 1300
   },
   {
    "key": "round_n",
    "hand": "123m45556p789s44z+4z",
    "han": 1,
    "fu": 40,
    "total": 2000
   },
   {
    "key": "sanshoku",
    "hand": "123456m123p1299s+3s",
    "han": 2,
    "fu": 40,
    "total": 2600
   },
   {
    "key": "ittsu",
    "hand": "12345678m234p55s+9m",
    "han": 3,
    "fu": 30,
    "total": 3900
   },
   {
    "key": "chantai",
    "hand": "1239m789p789s555z+9m",
    "han": 3,
    "fu": 40,
    "total": 5200
   },
   {
    "key": "honroto",
    "hand": "111m999p11999s11z+1z",
    "han": 7,
    "fu": 60,
    "total": 12000
   },
   {
    "key": "toitoi",
    "hand": "4466p888s+6p [222m] [555p]",
    "han": 3,
    "fu": 30,
    "total": 3900
   },
   {
    "key": "sanankou",
    "hand": "222456m555p8889s+9s",
    "han": 2,
    "fu": 50,
    "total": 3200
   },
   {
    "key": "sankantsu",
    "hand": "456m9s+9s (1111m) [2222p] [3333s]",
    "han": 2,
    "fu": 70,
    "total": 4500
   },
   {
    "key": "sanshoku_douko",
    "hand": "222456m222p2229s+9s",
    "han": 4,
    "fu": 50,
    "total": 8000
   },
   {
    "key": "chiitoitsu",
    "hand": "1144m2255p3366s7z+7z",
    "han": 2,
    "fu": 25,
    "total": 1600
   },
   {
    "key": "shosangen",
    "hand": "123m56p55566677z+4p",
    "han": 4,
    "fu": 50,
    "total": 8000
   },
   {
    "key": "honitsu",
    "hand": "123345678m2333z+2z",
    "han": 3,
    "fu": 50,
    "total": 6400
   },
   {
    "key": "junchan",
    "hand": "123789m1239p789s+9p",
    "han": 3,
    "fu": 40,
    "total": 5200
   },
   {
    "key": "ryanpeiko",
    "hand": "223344m556677p9s+9s",
    "han": 3,
    "fu": 40,
    "total": 5200
   },
   {
    "key": "chinitsu",
    "hand": "1122334567899m+9m",
    "han": 10,
    "fu": 30,
    "total": 16000
   },
   {
    "key": "daburu_riichi",
    "hand": "123m456p2355789s+4s",
    "han": 3,
    "fu": 30,
    "total": 3900
   },
   {
    "key": "haitei",
    "hand": "123m456p2355789s+4s",
    "han": 3,
    "fu": 20,
    "total": 2700
   },
   {
    "key": "houtei",
    "hand": "123m456p2355789s+4s",
    "han": 2,
    "fu": 30,
    "total": 2000
   },
   {
    "key": "rinshan",
    "hand": "456p2355789s+4s (1111m)",
    "han": 2,
    "fu": 60,
    "total": 4000
   },
   {
    "key": "chankan",
    "hand": "123m456p2355789s+4s",
    "han": 2,
    "fu": 30,
    "total": 2000
   },
   {
    "key": "renhou",
    "hand": "123m456p2355789s+4s",
    "han": 6,
    "fu": 30,
    "total": 12000
   },
   {
    "key": "kokushi",
    "hand": "119m19p19s123456z+7z",
    "han": 13,
    "fu": 0,
    "total": 32000
   },
   {
    "key": "daburu_kokushi",
    "hand": "19m19p19s1234567z+1m",
    "han": 26,
    "fu": 0,
    "total": 64000
   },
   {
    "key": "chuuren",
    "hand": "1113456788999m+2m",
    "han": 13,
    "fu": 50,
    "total": 32000
   },
   {
    "key": "daburu_chuuren",
    "hand": "1112345678999m+5m",
    "han": 26,
    "fu": 50,
    "total": 64000
   },
   {
    "key": "suuankou",
    "hand": "111m222p33344s55z+4s",
    "han": 13,
    "fu": 50,
    "total": 32000
   },
   {
    "key": "suuankou_tanki",
    "hand": "111m222p333444s5z+5z",
    "han": 26,
    "fu": 60,
    "total": 64000
   },
   {
    "key": "daisangen",
    "hand": "123m4p555666777z+4p",
    "han": 13,
    "fu": 60,
    "total": 32000
   },
   {
    "key": "shosuushi",
    "hand": "56m11122233344z+7m",
    "han": 13,
    "fu": 60,
    "total": 32000
   },
   {
    "key": "daisuushi",
    "hand": "5m111222333444z+5m",
    "han": 52,
    "fu": 70,
    "total": 128000
   },
   {
    "key": "ryuisou",
    "hand": "223344666888s6z+6z",
    "han": 13,
    "fu": 50,
    "total": 32000
   },
   {
    "key": "suukantsu",
    "hand": "5z+5z (1111m) [2222p] [3333s] [4444s]",
    "han": 13,
    "fu": 80,
    "total": 32000
   },
   {
    "key": "tsuisou",
    "hand": "1112223335556z+6z",
    "han": 39,
    "fu": 70,
    "total": 96000
   },
   {
    "key": "chinroto",
    "hand": "111999m111999p1s+1s",
    "han": 39,
    "fu": 70,
    "total": 96000
   },
   {
    "key": "tenhou",
    "hand": "123m456p2355789s+4s",
    "han": 13,
    "fu": 20,
    "total": 48000
   },
   {
    "key": "chiihou",
    "hand": "123m456p2355789s+4s",
    "han": 13,
    "fu": 20,
    "total": 32000
   },
   {
    "key": "dora",
    "hand": "123m456p2355789s+4s",
    "han": 2,
    "fu": 30,
    "total": 2000
   },
   {
    "key": "aka",
    "hand": "123m406p2355789s+4s",
    "han": 2,
    "fu": 30,
    "total": 2000
   },
   {
    "key": "ura",
    "hand": "123m456p2355789s+4s",
    "han": 3,
    "fu": 30,
    "total": 3900
   }
  ],
  "mcr": [
   {
    "name": "大四喜",
    "hand": "5m111222333444z+5m",
    "total": 159
   },
   {
    "name": "大三元",
    "hand": "123m4p555666777z+4p",
    "total": 108
   },
   {
    "name": "绿一色",
    "hand": "223344666888s6z+6z",
    "total": 94
   },
   {
    "name": "九莲宝灯",
    "hand": "1112345678999m+5m",
    "total": 91
   },
   {
    "name": "四杠",
    "hand": "5z+5z (1111m) [2222p] [3333s] [4444s]",
    "total": 97
   },
   {
    "name": "连七对",
    "hand": "1122334455667m+7m",
    "total": 88
   },
   {
    "name": "十三幺",
    "hand": "19m19p19s1234567z+1m",
    "total": 88
   },
   {
    "name": "清幺九",
    "hand": "111999m111999p1s+1s",
    "total": 129
   },
   {
    "name": "小四喜",
    "hand": "56m11122233344z+7m",
    "total": 92
   },
   {
    "name": "小三元",
    "hand": "123m56p55566677z+4p",
    "total": 69
   },
   {
    "name": "字一色",
    "hand": "1112223335556z+6z",
    "total": 147
   },
   {
    "name": "四暗刻",
    "hand": "111m222p333444s5z+5z",
    "total": 74
   },
   {
    "name": "一色双龙会",
    "hand": "1122335778899m+5m",
    "total": 67
   },
   {
    "name": "一色四同顺",
    "hand": "1111222233335m+5m",
    "total": 76
   },
   {
    "name": "一色四节高",
    "hand": "111222333444p5s+5s",
    "total": 123
   },
   {
    "name": "一色四步高",
    "hand": "123234345456m9s+9s",
    "total": 38
   },
   {
    "name": "三杠",
    "hand": "456m9s+9s (1111m) [2222p] [3333s]",
    "total": 43
   },
   {
    "name": "混幺九",
    "hand": "111m999p11999s11z+1z",
    "total": 56
   },
   {
    "name": "七对",
    "hand": "1144m2255p3366s7z+7z",
    "total": 24
   },
   {
    "name": "七星不靠",
    "hand": "147m25p36s123456z+7z",
    "total": 24
   },
   {
    "name": "全双刻",
    "hand": "222m2444p666888s+2p",
    "total": 88
   },
   {
    "name": "清一色",
    "hand": "1122334567899m+9m",
    "total": 45
   },
   {
    "name": "一色三同顺",
    "hand": "456p9s+9s [123m] [123m] [123m]",
    "total": 27
   },
   {
    "name": "一色三节高",
    "hand": "111222333m456p9s+9s",
    "total": 45
   },
   {
    "name": "全大",
    "hand": "7888m789p777999s+9m",
    "total": 30
   },
   {
    "name": "全中",
    "hand": "4556m456p444456s+5m",
    "total": 37
   },
   {
    "name": "全小",
    "hand": "1223m123p111333s+2m",
    "total": 31
   },
   {
    "name": "清龙",
    "hand": "123456789m55p78s+9s",
    "total": 21
   },
   {
    "name": "三色双龙会",
    "hand": "123789m5p123789s+5p",
    "total": 19
   },
   {
    "name": "一色三步高",
    "hand": "123234345m55p78s+9s",
    "total": 20
   },
   {
    "name": "全带五",
    "hand": "3455m456p555567s+5m",
    "total": 26
   },
   {
    "name": "三同刻",
    "hand": "222567m222p2229s+9s",
    "total": 36
   },
   {
    "name": "三暗刻",
    "hand": "222567m555p8889s+9s",
    "total": 19
   },
   {
    "name": "全不靠",
    "hand": "147m258p36s12345z+6z",
    "total": 12
   },
   {
    "name": "组合龙",
    "hand": "123147m258p369s4z+4z",
    "total": 15
   },
   {
    "name": "大于五",
    "hand": "6778m789p666999s+7m",
    "total": 18
   },
   {
    "name": "小于五",
    "hand": "2334m123p111444s+3m",
    "total": 18
   },
   {
    "name": "三风刻",
    "hand": "456m9p111222333z+9p",
    "total": 36
   },
   {
    "name": "花龙",
    "hand": "1239m456p234789s+9m",
    "total": 13
   },
   {
    "name": "推不倒",
    "hand": "123345p456888s5z+5z",
    "total": 11
   },
   {
    "name": "三色三同顺",
    "hand": "123456m123p1239s+9s",
    "total": 14
   },
   {
    "name": "三色三节高",
    "hand": "222567m333p4449s+9s",
    "total": 28
   },
   {
    "name": "无番和",
    "hand": "55m55z+5m [234m] [567p] [678s]",
    "total": 8
   },
   {
    "name": "妙手回春",
    "hand": "123m456p2355789s+4s",
    "total": 22
   },
   {
    "name": "海底捞月",
    "hand": "123m456p2355789s+4s",
    "total": 20
   },
   {
    "name": "杠上开花",
    "hand": "456p2355789s+4s (1111m)",
    "total": 16
   },
   {
    "name": "抢杠和",
    "hand": "123m456p2355789s+4s",
    "total": 20
   },
   {
    "name": "碰碰和",
    "hand": "4466p888s+6p [222m] [555p]",
    "total": 8
   },
   {
    "name": "混一色",
    "hand": "123345678m2333z+2z",
    "total": 11
   },
   {
    "name": "三色三步高",
    "hand": "123678m234p3459s+9s",
    "total": 11
   },
   {
    "name": "五门齐",
    "hand": "123m456p78s11155z+9s",
    "total": 20
   },
   {
    "name": "全求人",
    "hand": "5p+5p [123m] [456m] [789s] [111z]",
    "total": 11
   },
   {
    "name": "双暗杠",
    "hand": "456789s9m+9m (1111m) (2222p)",
    "total": 12
   },
   {
    "name": "双箭刻",
    "hand": "123m456p9s555666z+9s",
    "total": 11
   },
   {
    "name": "全带幺",
    "hand": "1239m789p789s111z+9m",
    "total": 12
   },
   {
    "name": "不求人",
    "hand": "123m456p2355789s+4s",
    "total": 14
   },
   {
    "name": "双明杠",
    "hand": "456789s9m+9m [1111m] [2222p]",
    "total": 8
   },
   {
    "name": "和绝张",
    "hand": "123m456p2355789s+4s",
    "total": 16
   },
   {
    "name": "箭刻",
    "hand": "12399m456p78s555z+9s",
    "total": 12
   },
   {
    "name": "圈风刻",
    "hand": "123m45556p789s22z+2z",
    "total": 12
   },
   {
    "name": "门风刻",
    "hand": "123m45556p789s33z+3z",
    "total": 12
   },
   {
    "name": "门前清",
    "hand": "123m456p2355789s+4s",
    "total": 12
   },
   {
    "name": "平和",
    "hand": "123m456p2355789s+4s",
    "total": 12
   },
   {
    "name": "四归一",
    "hand": "111123m456p789s5s+5s",
    "total": 15
   },
   {
    "name": "双同刻",
    "hand": "2229m222p567789s+9m",
    "total": 8
   },
   {
    "name": "双暗刻",
    "hand": "2229m555p567789s+9m",
    "total": 6
   },
   {
    "name": "暗杠",
    "hand": "9m555p567789s+9m (2222m)",
    "total": 8
   },
   {
    "name": "断幺",
    "hand": "234m456p2234567s+8s",
    "total": 13
   },
   {
    "name": "一般高",
    "hand": "2233449m567p789s+9m",
    "total": 6
   },
   {
    "name": "喜相逢",
    "hand": "2349m234p567789s+9m",
    "total": 6
   },
   {
    "name": "连六",
    "hand": "1234569m567p789s+9m",
    "total": 6
   },
   {
    "name": "老少副",
    "hand": "1237899m456p567s+9m",
    "total": 5
   },
   {
    "name": "幺九刻",
    "hand": "1119m456p567789s+9m",
    "total": 5
   },
   {
    "name": "明杠",
    "hand": "9m456p567789s+9m [2222m]",
    "total": 3
   },
   {
    "name": "缺一门",
    "hand": "123456m2345789p+5p",
    "total": 6
   },
   {
    "name": "无字",
    "hand": "1119m456p567789s+9m",
    "total": 5
   },
   {
    "name": "边张",
    "hand": "12m456p23455789s+3m",
    "total": 13
   },
   {
    "name": "嵌张",
    "hand": "13m456p23455789s+2m",
    "total": 13
   },
   {
    "name": "单钓将",
    "hand": "123m456p234789s1z+1z",
    "total": 11
   },
   {
    "name": "自摸",
    "hand": "123m456p2355s+4s [789s]",
    "total": 11
   },
   {
    "name": "花牌",
    "hand": "123m456p2355789s+4s",
    "total": 14
   },
   {
    "name": "明暗杠",
    "hand": "456789s9m+9m (2222m) [3333p]",
    "total": 8
   }
  ]
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const ready = async (url) => {
    await page.goto(url || toolURL);
    await page.waitForSelector('[data-mj-ready]');
  };
  await ready();
  await page.evaluate(() => localStorage.clear());
  await ready();

  const fmtOf = (text) => page.evaluate((t) => MJ.format(MJ.parse(t)), text);
  async function setHand(text) {
    const fmt = await fmtOf(text);
    await page.fill('#mj-input', text);
    await page.press('#mj-input', 'Enter');
    await page.waitForFunction((f) => MJ.format(window.MJLAB.state().hand) === f, fmt, { timeout: 10000 });
    return fmt;
  }
  const outReady = (sel, prefix) => page.waitForFunction(([s, p]) => {
    const o = document.querySelector(s);
    return !!o && typeof o.dataset.key === 'string' && o.dataset.key.indexOf(p) === 0;
  }, [sel, prefix], { timeout: 10000 });
  const txt = (sel) => page.$eval(sel, (n) => n.textContent.replace(/\s+/g, ' ').trim());
  const tab = async (t) => { await page.click('#mj-tab-' + t); await page.waitForFunction((x) => document.querySelector('#mj-tab-' + x).getAttribute('aria-selected') === 'true', t); };
  const rule = async (r) => { await page.click('#mj-rule-' + r); await page.waitForFunction((x) => window.MJLAB.state().rule === x, r); };

  // ———— 1. 默认手牌的何切表：逐行对 mahjong 2.0 的向听数独立算出的进张 ————
  const defFmt = await fmtOf('66m36p123567789s+7s');
  await outReady('#mj-eff-out', 'riichi|' + defFmt);
  const rows = await page.$$eval('#mj-eff-table tbody tr', (trs) => trs.map((tr) => ({
    d: +tr.dataset.d, cells: Array.from(tr.children).map((td) => td.textContent.replace(/\s+/g, ' ').trim()),
  })));
  assert(rows.length === ORACLE.eff.rows.length, `何切表应有 ${ORACLE.eff.rows.length} 行，实得 ${rows.length}`);
  const SZ = ['和了', '听牌', '一向听', '二向听', '三向听', '四向听', '五向听', '六向听'];
  ORACLE.eff.rows.forEach((o, i) => {
    const r = rows[i];
    assert(r && r.d === o.d, `第 ${i + 1} 行应打 ${o.d}，实得 ${r && r.d}`);
    assert(r.cells[1] === SZ[o.shanten + 1], `第 ${i + 1} 行向听应为 ${SZ[o.shanten + 1]}，实得 ${r.cells[1]}`);
    assert(r.cells[2].startsWith(o.count + ' 张') && r.cells[2].includes(o.kinds + ' 种'), `第 ${i + 1} 行进张应为 ${o.count} 张 ${o.kinds} 种，实得 ${r.cells[2]}`);
  });
  await page.waitForSelector('#mj-eff-out[data-deep="done"]', { timeout: 15000 });
  for (const [d, v] of Object.entries(ORACLE.eff.deep)) {
    const cell = await txt(`[data-deep-cell="${d}"]`);
    assert(cell.startsWith(v.toFixed(2)), `二阶进张（打 ${d}）应为 ${v.toFixed(2)}，实得 ${cell}`);
  }
  const bestDeep = Object.entries(ORACLE.eff.deep).sort((a, b) => b[1] - a[1])[0][0];
  const badge = await page.$eval(`[data-deep-cell="${bestDeep}"]`, (n) => n.textContent);
  assert(badge.includes('二阶最佳'), `二阶最佳应标在 ${bestDeep} 上：${badge}`);
  const maxDeep = Math.max(...Object.values(ORACLE.eff.deep));
  const wantBadges = Object.values(ORACLE.eff.deep).filter((v) => v === maxDeep).length;
  const nBadges = await page.$$eval('#mj-eff-table [data-deep-cell]', (cs) => cs.filter((c) => c.textContent.includes('二阶最佳')).length);
  assert(nBadges === wantBadges, `「二阶最佳」徽标应只有 ${wantBadges} 个，实得 ${nBadges}`);
  assert((await txt('#mj-eff-shanten')).startsWith('1'), '默认手牌是一向听');
  assert(await page.$eval('#mj-eff-forms', (n) => n.textContent.includes('七对子 4') && n.textContent.includes('国士 11')), '和型拆分：七对子 4、国士 11');
  // 二阶列能关掉
  await page.click('#mj-deep');
  await page.waitForFunction(() => !document.querySelector('[data-deep-cell]') && document.querySelector('#mj-eff-out').dataset.deep === 'off');
  await page.click('#mj-deep');
  await page.waitForSelector('#mj-eff-out[data-deep="done"]', { timeout: 15000 });

  // 「打出」：从 14 张变成 13 张
  await page.click(`[data-discard="${ORACLE.eff.rows[0].d}"]`);
  await page.waitForFunction(() => window.MJLAB.state().hand.tiles.length === 13);
  assert((await page.inputValue('#mj-input')).length > 0 && (await txt('#mj-eff-count-label')) === '有效进张', '打出后变成 13 张型、显示有效进张');

  // ———— 2. 13 张听牌：听牌张、剩余张数与每张的荣和 / 自摸点数 ————
  const f13 = await setHand('23456m678p34599s');
  await outReady('#mj-eff-out', 'riichi|' + f13);
  const waitRows = await page.$$eval('#mj-wait-table tbody tr', (trs) => trs.map((tr) => ({ t: +tr.dataset.wait, cells: Array.from(tr.children).map((td) => td.textContent.replace(/\s+/g, ' ').trim()) })));
  assert(waitRows.length === ORACLE.eff13.waits.length, `听牌 ${ORACLE.eff13.waits.length} 种，实得 ${waitRows.length}`);
  ORACLE.eff13.waits.forEach((w, i) => {
    const r = waitRows[i];
    assert(r.t === w.t && r.cells[1] === String(w.left), `听牌 ${w.t}：剩 ${w.left}，实得 ${r.t}/${r.cells[1]}`);
    assert(r.cells[2].includes('荣和 ' + w.ron.main), `听 ${w.t} 荣和应为 ${w.ron.main}：${r.cells[2]}`);
    assert(r.cells[3].includes(`自摸 ${w.tsumo.additional} / ${w.tsumo.main}`), `听 ${w.t} 自摸应为 ${w.tsumo.additional}/${w.tsumo.main}：${r.cells[3]}`);
  });
  // 场上已见：剩余张数随之减少；自家舍牌：振听提示
  await page.fill('#mj-visible', '1m1m');
  await page.waitForFunction(() => { const tr = document.querySelector('#mj-wait-table tr[data-wait="0"]'); return tr && tr.children[1].textContent.trim() === '2'; });
  assert(await page.$('#mj-furiten') === null, '还没填舍牌时不应提示振听');
  await page.fill('#mj-own', '7m');
  await page.waitForSelector('#mj-furiten');
  assert((await txt('#mj-furiten')).includes('七万'), '振听提示应点名七万');
  await page.fill('#mj-visible', '');
  await page.fill('#mj-own', '');
  await page.waitForFunction(() => !document.querySelector('#mj-furiten'));

  // ———— 3. 日麻算点：对 mahjong 2.0 HandCalculator ————
  await tab('score');
  const yakuKeys = () => page.$$eval('#mj-yaku-table tbody tr', (trs) => trs.map((t) => t.dataset.yaku).sort());
  async function checkRiichi(id) {
    const o = ORACLE.riichi[id];
    await page.waitForFunction((t) => (document.querySelector('#mj-score-total') || {}).textContent === String(t), o.total, { timeout: 10000 })
      .catch(() => {});
    const hf = await txt('#mj-score-hanfu'), tot = await txt('#mj-score-total');
    assert(hf.startsWith(`${o.han} 番 ${o.fu} 符`), `${id} 应为 ${o.han} 番 ${o.fu} 符，实得 ${hf}`);
    assert(tot === String(o.total), `${id} 合计应为 ${o.total}，实得 ${tot}`);
    const ks = await yakuKeys();
    assert(JSON.stringify(ks) === JSON.stringify(o.yaku.slice().sort()), `${id} 役种应为 ${o.yaku.slice().sort()}，实得 ${ks}`);
  }
  await setHand('222456m555p8889s+9s');
  await checkRiichi('R1');
  await page.click('#mj-ri-tsumo');
  await page.fill('#mj-ri-honba', '2');
  await page.fill('#mj-ri-kyoutaku', '1');
  await checkRiichi('R1b');
  // 自摸时每家另付 100 × 本场
  assert((await txt('#mj-pay-main')) === String(ORACLE.riichi.R1b.main + 200) && (await txt('#mj-pay-add')) === String(ORACLE.riichi.R1b.additional + 200),
    `R1b 庄付 ${ORACLE.riichi.R1b.main}+200、闲付 ${ORACLE.riichi.R1b.additional}+200`);
  await page.click('#mj-ri-ron');
  await page.fill('#mj-ri-honba', '0');
  await page.fill('#mj-ri-kyoutaku', '0');
  await setHand('234m406p5s+5s [678s] [7777z]');
  await checkRiichi('R2');
  const fuRows = await page.$$eval('#mj-fu-table tbody tr', (trs) => trs.map((t) => t.textContent));
  assert(fuRows.some((t) => t.includes('明杠（幺九）') && t.includes('16')), '符明细里应有明杠（幺九）16 符');
  await setHand('123m456p2355789s+4s');
  await page.selectOption('#mj-ri-seat', '0');
  await page.click('#mj-ri-tsumo');
  await page.fill('#mj-ri-dora', '3s');
  await checkRiichi('R3');
  assert((await txt('#mj-score-card')).includes('三家各付'), '庄家自摸应显示三家各付');
  // 无役与不和
  await page.click('#mj-ri-ron');
  await page.selectOption('#mj-ri-riichi', 'none');
  await page.fill('#mj-ri-dora', '1s');
  await page.selectOption('#mj-ri-seat', '1');
  await setHand('234m456p5s+5s [678s] [999m]');
  await page.waitForFunction(() => (document.querySelector('#mj-score-error') || {}).textContent === '无役：没有任何役种，不能和牌');
  await setHand('66m36p123567789s+7s');
  await page.waitForSelector('#mj-score-gen');
  await page.click('#mj-score-gen');
  // 随机和牌在当前场况下可能无役：等「出了点数」或「出了非“没和”的报错」都算生成成功
  await page.waitForFunction(() => document.querySelector('#mj-score-hanfu') || (document.querySelector('#mj-score-error') && !document.querySelector('#mj-score-gen')), null, { timeout: 10000 });
  await page.selectOption('#mj-ri-riichi', 'riichi');
  await page.click('#mj-ri-ron');

  // ———— 4. 国标算番：对 PyMahjongGB ————
  await rule('mcr');
  await page.waitForSelector('#mj-gb-self');
  async function setGb(c) {
    await page.click(c.selfDrawn ? '#mj-gb-self' : '#mj-gb-ron');
    await page.fill('#mj-gb-flowers', String(c.flowers));
    await page.selectOption('#mj-gb-seat', String(c.seat));
    await page.selectOption('#mj-gb-prev', String(c.prevalent));
    for (const [id, on] of [['#mj-gb-last', c.lastTile], ['#mj-gb-kong', c.kong], ['#mj-gb-wall', c.wallLast]]) {
      if ((await page.isChecked(id)) !== on) await page.click(id);
    }
  }
  const MC = { M1: ['1122335778899m+5m', { selfDrawn: true, lastTile: false, kong: false, wallLast: false, flowers: 2, seat: 2, prevalent: 1 }],
    M2: ['147m25p36s123456z+7z', { selfDrawn: false, lastTile: false, kong: false, wallLast: false, flowers: 0, seat: 0, prevalent: 0 }],
    M3: ['1477m369p258s+7m [666z]', { selfDrawn: false, lastTile: false, kong: false, wallLast: false, flowers: 0, seat: 0, prevalent: 0 }],
    M4: ['123m456p2355789s+4s', { selfDrawn: true, lastTile: true, kong: false, wallLast: true, flowers: 1, seat: 3, prevalent: 2 }] };
  for (const id of Object.keys(MC)) {
    const [text, c] = MC[id], o = ORACLE.mcr[id];
    await setHand(text);
    await setGb(c);
    await page.waitForFunction((t) => (document.querySelector('#mj-score-fan') || {}).textContent === t + ' 番', o.total, { timeout: 10000 }).catch(() => {});
    assert((await txt('#mj-score-fan')) === o.total + ' 番', `${id} 应为 ${o.total} 番，实得 ${await txt('#mj-score-fan')}`);
    const fans = await page.$$eval('#mj-fan-table tbody tr[data-fan]', (trs) => trs.map((t) => t.dataset.fan + '×' + t.children[2].textContent + '=' + t.children[1].textContent).sort());
    const want = o.fans.map(([n, cnt, pt]) => `${n}×${cnt}=${pt}`).sort();
    assert(JSON.stringify(fans) === JSON.stringify(want), `${id} 番种应为 ${want}，实得 ${fans}`);
  }
  assert((await txt('#mj-score-card')).includes('三家各付 ' + (8 + ORACLE.mcr.M4.total)), 'M4 自摸：三家各付 8 + 总番');
  // 国标 13 张（全不靠）听牌一览
  await setGb({ selfDrawn: false, lastTile: false, kong: false, wallLast: false, flowers: 0, seat: 0, prevalent: 0 });
  await tab('eff');
  const fm = await setHand('147m258p369s1234z');
  await outReady('#mj-eff-out', 'mcr|' + fm);
  assert((await txt('#mj-eff-shanten')).startsWith('听牌'), '全不靠 13 张应为听牌');
  const mrows = await page.$$eval('#mj-wait-table tbody tr', (trs) => trs.map((tr) => ({ t: +tr.dataset.wait, ron: tr.children[2].textContent, self: tr.children[3].textContent })));
  assert(mrows.length === ORACLE.mcr13.length, `国标听牌 ${ORACLE.mcr13.length} 种，实得 ${mrows.length}`);
  ORACLE.mcr13.forEach((w, i) => {
    assert(mrows[i].t === w.t && mrows[i].ron.includes(w.ron.total + ' 番') && mrows[i].self.includes(w.self.total + ' 番'),
      `听 ${w.t}：点和 ${w.ron.total} 番 / 自摸 ${w.self.total} 番，实得 ${JSON.stringify(mrows[i])}`);
  });

  // ———— 5. 速查：每个番种 / 役种的示例都要真的打出它（能力清单逐项断言）————
  await tab('ref');
  const deadGb = [];
  for (let i = 0; i < ORACLE.examples.mcr.length; i++) {
    const ex = ORACLE.examples.mcr[i];
    await page.click(`[data-load-gb="${i}"]`);
    await outReady('#mj-score-out', 'mcr|' + await fmtOf(ex.hand));
    const hasFan = await page.$(`#mj-fan-table tr[data-fan="${ex.name}"]`);
    const total = await txt('#mj-score-fan');
    if (!hasFan || total !== ex.total + ' 番') deadGb.push(`${ex.name}（${total} vs ${ex.total}）`);
    await tab('ref');
  }
  assert(deadGb.length === 0, `国标示例没打出标注的番种或总番不对：${deadGb.join('、')}`);
  assert((await page.$$('[data-load-gb]')).length === 82, '国标速查应有 82 个番种示例');
  await rule('riichi');
  await page.waitForSelector('[data-load-ex]');
  const deadRi = [];
  for (let i = 0; i < ORACLE.examples.riichi.length; i++) {
    const ex = ORACLE.examples.riichi[i];
    await page.click(`[data-load-ex="${i}"]`);
    await outReady('#mj-score-out', 'riichi|' + await fmtOf(ex.hand));
    const has = await page.$(`#mj-yaku-table tr[data-yaku="${ex.key}"]`);
    const total = await txt('#mj-score-total');
    if (!has || total !== String(ex.total)) deadRi.push(`${ex.key}（${total} vs ${ex.total}）`);
    await tab('ref');
  }
  assert(deadRi.length === 0, `日麻示例没打出标注的役或点数不对：${deadRi.join('、')}`);
  const pt = await page.$$eval('#mj-ptable-child tbody tr', (trs) => trs.map((t) => t.textContent.replace(/\s+/g, ' ')));
  assert(pt.some((t) => t.startsWith('30 符') && t.includes('1000 ｜ 300/500') && t.includes('7700 ｜ 2000/3900')), '点数表：子家 30 符 1 番 1000、4 番 7700');

  // ———— 6. 练习（?seed=7 出题可复现；答案对参考实现）————
  await page.evaluate(() => localStorage.clear());
  await ready(toolURL + '?seed=' + ORACLE.meta.seed);
  await tab('train');
  const qTiles = () => page.evaluate(() => window.MJLAB.question().tiles);
  assert(JSON.stringify(await qTiles()) === JSON.stringify(ORACLE.quiz.q1.tiles), '第 1 题牌面应与离线复现一致');
  const clickKind = async (k) => {
    const i = await page.evaluate((kk) => window.MJLAB.question().tiles.findIndex((t) => MJ.kind(t) === kk), k);
    await page.click(`[data-qi="${i}"]`);
  };
  await clickKind(ORACLE.quiz.q1.best[0]);
  await page.waitForSelector('#mj-tr-verdict');
  assert((await txt('#mj-tr-verdict')) === '正确！', '打最优的牌应判对');
  assert((await txt('#mj-st-n')) === '1' && (await txt('#mj-st-rate')) === '100%', '成绩：1 题 100%');
  // 解析表逐行对参考实现（这题含赤五条，同时守住「赤五按五算」）
  const q1rows = await page.$$eval('#mj-tr-table tbody tr', (trs) => trs.map((t) => [+t.dataset.d, t.children[1].textContent.trim(), +t.children[2].textContent.trim()]));
  const SZ2 = ['和了', '听牌', '一向听', '二向听', '三向听', '四向听'];
  assert(JSON.stringify(q1rows) === JSON.stringify(ORACLE.quiz.q1.rows.map(([d, s, c]) => [d, SZ2[s + 1], c])), `第 1 题解析表应为 ${JSON.stringify(ORACLE.quiz.q1.rows)}，实得 ${JSON.stringify(q1rows)}`);
  await page.click('#mj-q-next');
  await page.waitForFunction(() => !document.querySelector('#mj-tr-verdict'));
  assert(JSON.stringify(await qTiles()) === JSON.stringify(ORACLE.quiz.q2.tiles), '第 2 题牌面应与离线复现一致');
  await clickKind(ORACLE.quiz.q2.worst);
  await page.waitForSelector('#mj-tr-verdict');
  assert((await txt('#mj-tr-verdict')) === '不是最优', '打最差的牌应判错');
  assert((await txt('#mj-st-review')) === '1' && (await txt('#mj-st-streak')) === '0', '答错进复习队列、连对清零');
  const bestRowCls = await page.$$eval('#mj-tr-table tbody tr.mj-best', (trs) => trs.map((t) => +t.dataset.d).sort((a, b) => a - b));
  assert(JSON.stringify(bestRowCls) === JSON.stringify(ORACLE.quiz.q2.best.slice().sort((a, b) => a - b)), `解析表里的最优行应为 ${ORACLE.quiz.q2.best}`);
  await page.click('[data-mode="wait"]');
  await page.waitForSelector('[data-tk]');
  assert(JSON.stringify(await qTiles()) === JSON.stringify(ORACLE.quiz.wait.tiles), '听牌题牌面应与离线复现一致');
  // 第一题故意漏选最后一张：必须判错，并点名漏了哪张
  for (const k of ORACLE.quiz.wait.waits.slice(0, -1)) await page.click(`[data-tk="${k}"]`);
  await page.click('#mj-q-submit');
  await page.waitForSelector('#mj-tr-verdict');
  assert((await txt('#mj-tr-verdict')) === '还差一点', '漏选一张应判错');
  assert((await txt('#mj-tr-feedback')).includes('漏选'), '反馈里应点出漏选');
  await page.click('#mj-q-next');
  await page.waitForFunction(() => !document.querySelector('#mj-tr-verdict'));
  assert(JSON.stringify(await qTiles()) === JSON.stringify(ORACLE.quiz.wait2.tiles), '第 2 道听牌题牌面应与离线复现一致');
  for (const k of ORACLE.quiz.wait2.waits) await page.click(`[data-tk="${k}"]`);
  await page.click('#mj-q-submit');
  await page.waitForSelector('#mj-tr-verdict');
  assert((await txt('#mj-tr-verdict')) === '全对！', `选出 ${ORACLE.quiz.wait2.waits} 应全对`);
  await page.click('[data-mode="score"]');
  await page.waitForSelector('#mj-qa-han');
  const sq = ORACLE.quiz.score;
  const qh = await page.evaluate(() => window.MJLAB.question().hand);
  assert(JSON.stringify(qh) === JSON.stringify(sq.hand), '算点题的手牌应与离线复现一致');
  await page.selectOption('#mj-qa-han', String(Math.min(sq.han, 13)));
  await page.selectOption('#mj-qa-fu', String(sq.han >= 5 ? 0 : sq.fu));
  await page.fill('#mj-qa-pts', String(sq.total));
  await page.click('#mj-q-submit');
  await page.waitForSelector('#mj-tr-verdict');
  assert((await txt('#mj-tr-verdict')) === '算对了！', `答 ${sq.han} 番 ${sq.fu} 符 ${sq.total} 点应判对`);
  // 成绩持久化
  await ready(toolURL + '?seed=1');
  await tab('train');
  await page.click('[data-mode="discard"]');
  await page.waitForSelector('#mj-st-n');
  assert((await txt('#mj-st-n')) === '2' && (await txt('#mj-st-best')) === '1', '刷新后何切成绩仍是 2 题、最佳连对 1');
  assert((await page.$$('#mj-tr-hist li')).length === 5, '最近练习应有 5 条');

  // ———— 7. 收藏：存、刷新后还在、载入 ————
  await tab('eff');
  await setHand('1112345678999m+5m');
  await tab('saved');
  await page.fill('#mj-save-name', '九莲宝灯');
  await page.click('#mj-save-btn');
  await page.waitForSelector('[data-sload="0"]');
  await ready();
  await tab('eff');
  await setHand('19m19p19s1234567z+1m');
  await tab('saved');
  assert((await txt('#mj-saved-list')).includes('九莲宝灯'), '刷新后收藏仍在');
  await page.click('[data-sload="0"]');
  await page.waitForFunction(() => window.MJLAB.state().tab === 'eff');
  assert((await page.inputValue('#mj-input')) === '1112345678999m+5m', '载入收藏后牌谱应恢复');

  // ———— 8. 手牌编辑：选牌、张数上限、副露、记法报错 ————
  await page.click('#mj-clear');
  await page.waitForSelector('.mj-rack-empty');
  for (let i = 0; i < 4; i++) await page.click('#mj-palette [data-code="0"]');
  assert(await page.$eval('#mj-palette [data-code="0"]', (b) => b.disabled && b.querySelector('.mj-pb-left').textContent === '0'), '一万用满 4 张后按钮应禁用、剩 0');
  await page.click('.mj-meldbar [data-meld="pon"]');
  assert((await page.getAttribute('.mj-meldbar [data-meld="pon"]', 'aria-pressed')) === 'true', '碰按钮应处于按下状态');
  await page.click('#mj-palette [data-code="31"]');
  await page.waitForFunction(() => window.MJLAB.state().hand.melds.length === 1);
  assert((await page.inputValue('#mj-input')).includes('[555z]'), '碰白之后牌谱应含 [555z]');
  await page.click('[data-mi="0"]');
  await page.waitForFunction(() => window.MJLAB.state().hand.melds.length === 0);
  await page.fill('#mj-input', '12x');
  await page.press('#mj-input', 'Enter');
  await page.waitForFunction(() => document.querySelector('#mj-input-msg').classList.contains('mj-bad'));
  assert((await txt('#mj-input-msg')).includes('无法识别的字符'), '非法记法要报错');
  // 键盘：页签左右切换
  await page.focus('#mj-tab-eff');
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => window.MJLAB.state().tab === 'score');
  await page.keyboard.press('ArrowLeft');
  await page.waitForFunction(() => window.MJLAB.state().tab === 'eff');

  // ———— 9. 渲染守卫：[hidden]、控件尺寸、大写改写、逐视口横溢、卡片逃逸、重复 id ————
  await setHand('66m36p123567789s+7s');
  const onTab = async (t) => { await tab(t); await page.waitForTimeout(60); };
  const scanned = await renderGuards(page, {
    assert, tabs: ORACLE.meta.tabs, onTab,
    paneSel: (t) => `#mj-pane-${t}`, panesRoot: '#mj-panes',
    figSel: (t) => `#mj-pane-${t} svg.mj-fig`, cardSel: '.mj-card', childSel: 'table,h2,p,.mj-tablewrap',
    minControls: 80, minTextsInFig: 0, viewports: [390, 768, 1280],
  });
  assert(scanned >= 80, `各页签累计扫到 ${scanned} 个可见控件`);
  // 牌桌上的牌按钮也不能塌缩（守卫只扫面板）
  await tab('eff');
  const tileSizes = await page.$$eval('#mj-rack .mj-tb, #mj-palette .mj-pb', (ns) => ns.map((n) => { const r = n.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }));
  assert(tileSizes.length >= 50 && tileSizes.every(([w, h]) => w >= 24 && h >= 32), `牌按钮尺寸：${JSON.stringify(tileSizes.slice(0, 5))}`);
  assert(await page.$eval('#mj-stage-train', (n) => getComputedStyle(n).display === 'none'), '牌效率页上练习牌桌应真的隐藏');

  assert(errors.length === 0, '页面异常：' + errors.join(' | '));
  await page.setViewportSize({ width: 1280, height: 850 });
  await outReady('#mj-eff-out', 'riichi|' + defFmt);
  await page.waitForSelector('#mj-eff-out[data-deep="done"]', { timeout: 15000 });
  // 缩略图：牌桌 + 下方三张结果卡（向听 / 最优打法 / 状态）同框
  await page.evaluate(() => window.scrollTo(0, document.querySelector('.mj-console').getBoundingClientRect().top + window.scrollY - 84));
  await screenshot('thumb.png');
};
