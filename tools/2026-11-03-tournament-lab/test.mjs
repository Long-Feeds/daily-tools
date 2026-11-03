// 赛事编排工作台 · 集成测试（真实 Chromium）
// 真值一律来自 ORACLE（truth/gen_truth.mjs 现场生成、inject-oracle.mjs 机械注入，不手抄）：
//   瑞士制首轮 = 荷兰制闭式；循环赛 = FIDE C.05 Annex 1 官方贝格尔表原文；FIDE 等级分 = 按 B.02 表 8.1.2 独立重算；
//   Glicko-2 = Glickman 文档例题（1464.06 / 151.52 / 0.05999）；淘汰赛首轮 = 标准种子位闭式；
//   其余（多轮瑞士制配对、破同分数值）= 从成品 HTML 抠出的引擎在同一操作序列下的输出（引擎本身另由 oracle/ 离线套件对拍 networkx / 暴力枚举 / FIDE 条文的独立实现）。
import { renderGuards, guardOverflow, guardFigText, guardBoxOverlap } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const ORACLE = {
 "meta": {
  "tabs": [
   "players",
   "rounds",
   "standings",
   "cross",
   "ratings",
   "settings",
   "about"
  ],
  "src": "引擎（成品 HTML 抠出）+ FIDE 官方表 / 贝格尔表原文 / Glickman 例题 / 荷兰制闭式；见 truth/gen_truth.mjs"
 },
 "s1": {
  "players": [
   [
    "甲一",
    2160
   ],
   [
    "乙二",
    2050
   ],
   [
    "丙三",
    1990
   ],
   [
    "丁四",
    1930
   ],
   [
    "戊五",
    1880
   ],
   [
    "己六",
    1810
   ],
   [
    "庚七",
    1760
   ],
   [
    "辛八",
    1700
   ],
   [
    "壬九",
    1650
   ]
  ],
  "results": [
   [
    "W",
    "D",
    "B",
    "W+"
   ],
   [
    "B",
    "W",
    "D",
    "W"
   ],
   [
    "W",
    "B",
    "D",
    "B+"
   ]
  ],
  "request": {
   "round": 2,
   "name": "丙三",
   "type": "HPB"
  },
  "withdraw": {
   "afterRound": 2,
   "name": "辛八"
  },
  "rounds": 5,
  "rounds_truth": [
   {
    "boards": [
     [
      "甲一",
      "戊五"
     ],
     [
      "己六",
      "乙二"
     ],
     [
      "丙三",
      "庚七"
     ],
     [
      "辛八",
      "丁四"
     ]
    ],
    "byes": [
     [
      "壬九",
      "PAB"
     ]
    ],
    "rules": [
     "E5",
     "E5",
     "E5",
     "E5"
    ]
   },
   {
    "boards": [
     [
      "辛八",
      "甲一"
     ],
     [
      "庚七",
      "壬九"
     ],
     [
      "乙二",
      "丁四"
     ],
     [
      "戊五",
      "己六"
     ]
    ],
    "byes": [
     [
      "丙三",
      "HPB"
     ]
    ],
    "rules": [
     "E1",
     "E1",
     "E1",
     "E1"
    ]
   },
   {
    "boards": [
     [
      "甲一",
      "庚七"
     ],
     [
      "壬九",
      "乙二"
     ],
     [
      "丁四",
      "戊五"
     ],
     [
      "己六",
      "丙三"
     ]
    ],
    "byes": [],
    "rules": [
     "E1",
     "E1",
     "E1",
     "E1"
    ]
   }
  ],
  "standings": {
   "list": [
    "BH-C1",
    "BH",
    "SB",
    "DE",
    "WIN",
    "PS"
   ],
   "rows": [
    {
     "name": "甲一",
     "rank": "1",
     "score": "3",
     "tb": {
      "BH-C1": "3½",
      "BH": "5",
      "SB": "5",
      "DE": "—",
      "WIN": "3",
      "PS": "6"
     }
    },
    {
     "name": "庚七",
     "rank": "2",
     "score": "2",
     "tb": {
      "BH-C1": "4½",
      "BH": "5½",
      "SB": "2½",
      "DE": "—",
      "WIN": "2",
      "PS": "5"
     }
    },
    {
     "name": "乙二",
     "rank": "3",
     "score": "2",
     "tb": {
      "BH-C1": "2",
      "BH": "2½",
      "SB": "1.75",
      "DE": "—",
      "WIN": "1",
      "PS": "3½"
     }
    },
    {
     "name": "戊五",
     "rank": "4",
     "score": "1½",
     "tb": {
      "BH-C1": "4",
      "BH": "4½",
      "SB": "1",
      "DE": "—",
      "WIN": "1",
      "PS": "2½"
     }
    },
    {
     "name": "丙三",
     "rank": "5",
     "score": "1½",
     "tb": {
      "BH-C1": "2½",
      "BH": "4",
      "SB": "1.25",
      "DE": "—",
      "WIN": "1",
      "PS": "2"
     }
    },
    {
     "name": "辛八",
     "rank": "6–7",
     "score": "1",
     "tb": {
      "BH-C1": "4",
      "BH": "5",
      "SB": "1",
      "DE": "0",
      "WIN": "1",
      "PS": "3"
     }
    },
    {
     "name": "壬九",
     "rank": "6–7",
     "score": "1",
     "tb": {
      "BH-C1": "4",
      "BH": "5",
      "SB": "1",
      "DE": "0",
      "WIN": "1",
      "PS": "3"
     }
    },
    {
     "name": "丁四",
     "rank": "8",
     "score": "1",
     "tb": {
      "BH-C1": "3½",
      "BH": "4½",
      "SB": "1.75",
      "DE": "—",
      "WIN": "0",
      "PS": "1½"
     }
    },
    {
     "name": "己六",
     "rank": "9",
     "score": "½",
     "tb": {
      "BH-C1": "3½",
      "BH": "4",
      "SB": "1",
      "DE": "—",
      "WIN": "0",
      "PS": "1½"
     }
    }
   ],
   "trace": 3
  },
  "standings2": {
   "list": [
    "BH-C1",
    "BH",
    "SB",
    "DE",
    "WIN",
    "PS",
    "ARO",
    "TPR",
    "PTP"
   ],
   "rows": [
    {
     "name": "甲一",
     "rank": "1",
     "score": "3",
     "tb": {
      "BH-C1": "3½",
      "BH": "5",
      "SB": "5",
      "DE": "—",
      "WIN": "3",
      "PS": "6",
      "ARO": "1780",
      "TPR": "2580",
      "PTP": "2616"
     }
    },
    {
     "name": "庚七",
     "rank": "2",
     "score": "2",
     "tb": {
      "BH-C1": "4½",
      "BH": "5½",
      "SB": "2½",
      "DE": "—",
      "WIN": "2",
      "PS": "5",
      "ARO": "1933",
      "TPR": "2058",
      "PTP": "2097"
     }
    },
    {
     "name": "乙二",
     "rank": "3",
     "score": "2",
     "tb": {
      "BH-C1": "2",
      "BH": "2½",
      "SB": "1.75",
      "DE": "—",
      "WIN": "1",
      "PS": "3½",
      "ARO": "1797",
      "TPR": "1922",
      "PTP": "1929"
     }
    },
    {
     "name": "戊五",
     "rank": "4",
     "score": "1½",
     "tb": {
      "BH-C1": "4",
      "BH": "4½",
      "SB": "1",
      "DE": "—",
      "WIN": "1",
      "PS": "2½",
      "ARO": "1967",
      "TPR": "1967",
      "PTP": "1963"
     }
    },
    {
     "name": "丙三",
     "rank": "5",
     "score": "1½",
     "tb": {
      "BH-C1": "2½",
      "BH": "4",
      "SB": "1.25",
      "DE": "—",
      "WIN": "1",
      "PS": "2",
      "ARO": "1760",
      "TPR": "960",
      "PTP": "960"
     }
    },
    {
     "name": "辛八",
     "rank": "6",
     "score": "1",
     "tb": {
      "BH-C1": "4",
      "BH": "5",
      "SB": "1",
      "DE": "0",
      "WIN": "1",
      "PS": "3",
      "ARO": "2160",
      "TPR": "1360",
      "PTP": "1360"
     }
    },
    {
     "name": "壬九",
     "rank": "7",
     "score": "1",
     "tb": {
      "BH-C1": "4",
      "BH": "5",
      "SB": "1",
      "DE": "0",
      "WIN": "1",
      "PS": "3",
      "ARO": "1905",
      "TPR": "1105",
      "PTP": "960"
     }
    },
    {
     "name": "丁四",
     "rank": "8",
     "score": "1",
     "tb": {
      "BH-C1": "3½",
      "BH": "4½",
      "SB": "1.75",
      "DE": "—",
      "WIN": "0",
      "PS": "1½",
      "ARO": "1965",
      "TPR": "1965",
      "PTP": "1964"
     }
    },
    {
     "name": "己六",
     "rank": "9",
     "score": "½",
     "tb": {
      "BH-C1": "3½",
      "BH": "4",
      "SB": "1",
      "DE": "—",
      "WIN": "0",
      "PS": "1½",
      "ARO": "1965",
      "TPR": "1772",
      "PTP": "1760"
     }
    }
   ],
   "trace": 4
  },
  "fide": {
   "甲一": 6,
   "乙二": -8,
   "丙三": -16,
   "丁四": 2,
   "戊五": 6,
   "己六": -2,
   "庚七": 21,
   "辛八": -2,
   "壬九": -9
  },
  "cross": {
   "甲一": [
    "5w1",
    "8b1",
    "7w1"
   ],
   "乙二": [
    "6b½",
    "4w½",
    "9b1"
   ],
   "丙三": [
    "7w0",
    "½ 假",
    "6b+"
   ],
   "丁四": [
    "8b−",
    "2b½",
    "5w½"
   ],
   "戊五": [
    "1b0",
    "6w1",
    "4b½"
   ],
   "己六": [
    "2w½",
    "5b0",
    "3w−"
   ],
   "庚七": [
    "3b1",
    "9w1",
    "1b0"
   ],
   "辛八": [
    "4w+",
    "1w0",
    "—"
   ],
   "壬九": [
    "轮空",
    "7b0",
    "2w0"
   ]
  },
  "json": {
   "id": "x",
   "name": "x",
   "format": "swiss",
   "mode": "chess",
   "nRounds": 5,
   "useColors": true,
   "initialColor": "W",
   "pts": {
    "win": 1,
    "draw": 0.5,
    "loss": 0,
    "pab": 1,
    "fpb": 1,
    "hpb": 0.5,
    "zpb": 0
   },
   "double": false,
   "players": [
    {
     "id": "p1",
     "name": "甲一",
     "rating": 2160
    },
    {
     "id": "p2",
     "name": "乙二",
     "rating": 2050
    },
    {
     "id": "p3",
     "name": "丙三",
     "rating": 1990
    },
    {
     "id": "p4",
     "name": "丁四",
     "rating": 1930
    },
    {
     "id": "p5",
     "name": "戊五",
     "rating": 1880
    },
    {
     "id": "p6",
     "name": "己六",
     "rating": 1810
    },
    {
     "id": "p7",
     "name": "庚七",
     "rating": 1760
    },
    {
     "id": "p8",
     "name": "辛八",
     "rating": 1700
    },
    {
     "id": "p9",
     "name": "壬九",
     "rating": 1650
    }
   ],
   "rounds": [
    {
     "pairs": [
      {
       "w": "p1",
       "b": "p5",
       "res": "W",
       "sa": null,
       "sb": null
      },
      {
       "w": "p6",
       "b": "p2",
       "res": "D",
       "sa": null,
       "sb": null
      },
      {
       "w": "p3",
       "b": "p7",
       "res": "B",
       "sa": null,
       "sb": null
      },
      {
       "w": "p8",
       "b": "p4",
       "res": "W+",
       "sa": null,
       "sb": null
      }
     ],
     "byes": [
      {
       "p": "p9",
       "type": "PAB",
       "second": false
      }
     ]
    },
    {
     "pairs": [
      {
       "w": "p8",
       "b": "p1",
       "res": "B",
       "sa": null,
       "sb": null
      },
      {
       "w": "p7",
       "b": "p9",
       "res": "W",
       "sa": null,
       "sb": null
      },
      {
       "w": "p2",
       "b": "p4",
       "res": "D",
       "sa": null,
       "sb": null
      },
      {
       "w": "p5",
       "b": "p6",
       "res": "W",
       "sa": null,
       "sb": null
      }
     ],
     "byes": [
      {
       "p": "p3",
       "type": "HPB"
      }
     ]
    },
    {
     "pairs": [
      {
       "w": "p1",
       "b": "p7",
       "res": "W",
       "sa": null,
       "sb": null
      },
      {
       "w": "p9",
       "b": "p2",
       "res": "B",
       "sa": null,
       "sb": null
      },
      {
       "w": "p4",
       "b": "p5",
       "res": "D",
       "sa": null,
       "sb": null
      },
      {
       "w": "p6",
       "b": "p3",
       "res": "B+",
       "sa": null,
       "sb": null
      }
     ],
     "byes": []
    }
   ],
   "withdrawn": {
    "p8": 2
   },
   "requests": {
    "2": {
     "p3": "HPB"
    }
   },
   "tiebreaks": [
    "BH-C1",
    "BH",
    "SB",
    "DE",
    "WIN",
    "PS",
    "ARO",
    "TPR",
    "PTP"
   ],
   "seedOrder": null,
   "ko": {
    "third": true,
    "res": {}
   },
   "nextId": 10
  }
 },
 "s2": {
  "players": [
   [
    "东方白",
    2000
   ],
   [
    "南宫月",
    1950
   ],
   [
    "西门雪",
    1900
   ],
   [
    "北堂风",
    1850
   ],
   [
    "中山岚",
    1800
   ]
  ],
  "results": [
   [
    "D",
    "D"
   ],
   [
    "D",
    "W"
   ],
   [
    "W",
    "W"
   ],
   [
    "W",
    "W"
   ],
   [
    "W",
    "W"
   ]
  ],
  "boards": [
   [
    [
     "南宫月",
     "中山岚"
    ],
    [
     "西门雪",
     "北堂风"
    ]
   ],
   [
    [
     "中山岚",
     "西门雪"
    ],
    [
     "东方白",
     "南宫月"
    ]
   ],
   [
    [
     "西门雪",
     "东方白"
    ],
    [
     "北堂风",
     "中山岚"
    ]
   ],
   [
    [
     "东方白",
     "北堂风"
    ],
    [
     "南宫月",
     "西门雪"
    ]
   ],
   [
    [
     "北堂风",
     "南宫月"
    ],
    [
     "中山岚",
     "东方白"
    ]
   ]
  ],
  "rest": [
   "东方白",
   "北堂风",
   "南宫月",
   "中山岚",
   "西门雪"
  ],
  "standings": {
   "list": [
    "DE",
    "SB",
    "WIN",
    "KS"
   ],
   "rows": [
    {
     "name": "北堂风",
     "rank": "1",
     "score": "2½",
     "tb": {
      "DE": "—",
      "SB": "4½",
      "WIN": "2",
      "KS": "1½"
     }
    },
    {
     "name": "西门雪",
     "rank": "2",
     "score": "2",
     "tb": {
      "DE": "1½",
      "SB": "4.25",
      "WIN": "1",
      "KS": "2"
     }
    },
    {
     "name": "中山岚",
     "rank": "3",
     "score": "2",
     "tb": {
      "DE": "1½",
      "SB": "3.75",
      "WIN": "1",
      "KS": "1½"
     }
    },
    {
     "name": "东方白",
     "rank": "4",
     "score": "2",
     "tb": {
      "DE": "0",
      "SB": "4",
      "WIN": "2",
      "KS": "1"
     }
    },
    {
     "name": "南宫月",
     "rank": "5",
     "score": "1½",
     "tb": {
      "DE": "—",
      "SB": "3",
      "WIN": "1",
      "KS": "1½"
     }
    }
   ],
   "trace": 2
  },
  "json": {
   "id": "x",
   "name": "x",
   "format": "rr",
   "mode": "chess",
   "nRounds": 5,
   "useColors": true,
   "initialColor": "W",
   "pts": {
    "win": 1,
    "draw": 0.5,
    "loss": 0,
    "pab": 1,
    "fpb": 1,
    "hpb": 0.5,
    "zpb": 0
   },
   "double": false,
   "players": [
    {
     "id": "p1",
     "name": "东方白",
     "rating": 2000
    },
    {
     "id": "p2",
     "name": "南宫月",
     "rating": 1950
    },
    {
     "id": "p3",
     "name": "西门雪",
     "rating": 1900
    },
    {
     "id": "p4",
     "name": "北堂风",
     "rating": 1850
    },
    {
     "id": "p5",
     "name": "中山岚",
     "rating": 1800
    }
   ],
   "rounds": [
    {
     "pairs": [
      {
       "w": "p2",
       "b": "p5",
       "res": "D"
      },
      {
       "w": "p3",
       "b": "p4",
       "res": "D"
      }
     ],
     "byes": []
    },
    {
     "pairs": [
      {
       "w": "p5",
       "b": "p3",
       "res": "D"
      },
      {
       "w": "p1",
       "b": "p2",
       "res": "W"
      }
     ],
     "byes": []
    },
    {
     "pairs": [
      {
       "w": "p3",
       "b": "p1",
       "res": "W"
      },
      {
       "w": "p4",
       "b": "p5",
       "res": "W"
      }
     ],
     "byes": []
    },
    {
     "pairs": [
      {
       "w": "p1",
       "b": "p4",
       "res": "W"
      },
      {
       "w": "p2",
       "b": "p3",
       "res": "W"
      }
     ],
     "byes": []
    },
    {
     "pairs": [
      {
       "w": "p4",
       "b": "p2",
       "res": "W"
      },
      {
       "w": "p5",
       "b": "p1",
       "res": "W"
      }
     ],
     "byes": []
    }
   ],
   "withdrawn": {},
   "requests": {},
   "tiebreaks": [
    "DE",
    "SB",
    "WIN",
    "KS"
   ],
   "seedOrder": [
    "p1",
    "p2",
    "p3",
    "p4",
    "p5"
   ],
   "ko": {
    "third": true,
    "res": {}
   },
   "nextId": 6
  }
 },
 "s3": {
  "title": "循环赛 · 社区五人制足球联赛（双循环，比分制）",
  "standings": {
   "list": [
    "H2H",
    "GD",
    "GF",
    "WIN"
   ],
   "rows": [
    {
     "name": "晨风队",
     "rank": "1",
     "score": "19",
     "tb": {
      "H2H": "—",
      "GD": "5",
      "GF": "15",
      "WIN": "6"
     }
    },
    {
     "name": "青石队",
     "rank": "2",
     "score": "14",
     "tb": {
      "H2H": "7 · +4 · 8",
      "GD": "4",
      "GF": "15",
      "WIN": "4"
     }
    },
    {
     "name": "白鹭队",
     "rank": "3",
     "score": "14",
     "tb": {
      "H2H": "6 · -2 · 6",
      "GD": "-1",
      "GF": "17",
      "WIN": "4"
     }
    },
    {
     "name": "海燕队",
     "rank": "4",
     "score": "14",
     "tb": {
      "H2H": "4 · -2 · 3",
      "GD": "-2",
      "GF": "12",
      "WIN": "4"
     }
    },
    {
     "name": "赤焰队",
     "rank": "5",
     "score": "11",
     "tb": {
      "H2H": "2 · 0 · 3",
      "GD": "-2",
      "GF": "12",
      "WIN": "2"
     }
    },
    {
     "name": "远山队",
     "rank": "6",
     "score": "11",
     "tb": {
      "H2H": "2 · 0 · 3",
      "GD": "-4",
      "GF": "14",
      "WIN": "3"
     }
    }
   ],
   "trace": 2
  }
 },
 "s4": {
  "players": [
   [
    "陆一",
    1900
   ],
   [
    "陆二",
    1850
   ],
   [
    "陆三",
    1800
   ],
   [
    "陆四",
    1750
   ],
   [
    "陆五",
    1700
   ],
   [
    "陆六",
    1650
   ]
  ],
  "scores": {
   "1-1": [
    2,
    1
   ],
   "1-3": [
    0,
    2
   ],
   "2-0": [
    2,
    0
   ],
   "2-1": [
    1,
    2
   ],
   "3-0": [
    2,
    1
   ],
   "T-0": [
    2,
    0
   ]
  },
  "first": [
   [
    "陆一",
    "BYE"
   ],
   [
    "陆四",
    "陆五"
   ],
   [
    "陆二",
    "BYE"
   ],
   [
    "陆三",
    "陆六"
   ]
  ],
  "steps": [
   {
    "key": "1-1",
    "winners": [
     [
      "陆一",
      "陆四",
      "陆二",
      null
     ],
     [
      null,
      null
     ],
     [
      null
     ]
    ]
   },
   {
    "key": "1-3",
    "winners": [
     [
      "陆一",
      "陆四",
      "陆二",
      "陆六"
     ],
     [
      null,
      null
     ],
     [
      null
     ]
    ]
   },
   {
    "key": "2-0",
    "winners": [
     [
      "陆一",
      "陆四",
      "陆二",
      "陆六"
     ],
     [
      "陆一",
      null
     ],
     [
      null
     ]
    ]
   },
   {
    "key": "2-1",
    "winners": [
     [
      "陆一",
      "陆四",
      "陆二",
      "陆六"
     ],
     [
      "陆一",
      "陆六"
     ],
     [
      null
     ]
    ]
   },
   {
    "key": "T-0",
    "winners": [
     [
      "陆一",
      "陆四",
      "陆二",
      "陆六"
     ],
     [
      "陆一",
      "陆六"
     ],
     [
      null
     ]
    ]
   },
   {
    "key": "3-0",
    "winners": [
     [
      "陆一",
      "陆四",
      "陆二",
      "陆六"
     ],
     [
      "陆一",
      "陆六"
     ],
     [
      "陆一"
     ]
    ]
   }
  ],
  "champion": "陆一",
  "place": {
   "陆一": "1",
   "陆六": "2",
   "陆四": "3",
   "陆二": "4",
   "陆五": "5–8",
   "陆三": "5–8"
  },
  "order": [
   1,
   8,
   4,
   5,
   2,
   7,
   3,
   6
  ]
 },
 "s5": {
  "players": [
   [
    "甲",
    1500,
    200
   ],
   [
    "乙",
    1400,
    30
   ],
   [
    "丙",
    1550,
    100
   ],
   [
    "丁",
    1700,
    300
   ]
  ],
  "paper": {
   "r": 1464.06,
   "rd": 151.52,
   "vol": 0.05999
  },
  "results": [
   [
    "D",
    "W"
   ],
   [
    "B",
    "D"
   ],
   [
    "D",
    "B"
   ]
  ],
  "boards": [
   [
    [
     "丁",
     "乙"
    ],
    [
     "丙",
     "甲"
    ]
   ],
   [
    [
     "乙",
     "甲"
    ],
    [
     "丁",
     "丙"
    ]
   ],
   [
    [
     "丙",
     "乙"
    ],
    [
     "甲",
     "丁"
    ]
   ]
  ],
  "fide": -6,
  "engine": {
   "r": 1464.0506705393013,
   "rd": 151.51652412385727,
   "vol": 0.059995984286488495
  },
  "pr": {
   "丁": {
    "r": 1634.52622539139,
    "rd": 194.563171454791,
    "vol": 0.0599975032069097
   },
   "丙": {
    "r": 1563.90453743545,
    "rd": 93.0270621553977,
    "vol": 0.0599947842176454
   },
   "乙": {
    "r": 1400.37254949527,
    "rd": 31.5218209021361,
    "vol": 0.0599938302843664
   },
   "甲": {
    "r": 1464.05067109906,
    "rd": 151.516521337203,
    "vol": 0.0599958339047037
   }
  }
 },
 "s6": {
  "players": [
   [
    "长江",
    2450
   ],
   [
    "黄河",
    2450
   ],
   [
    "珠江",
    2340
   ]
  ],
  "tpn": [
   "黄河",
   "长江",
   "珠江"
  ],
  "boards": [
   [
    [
     "长江",
     "珠江"
    ]
   ],
   [
    [
     "黄河",
     "长江"
    ]
   ],
   [
    [
     "珠江",
     "黄河"
    ]
   ]
  ],
  "results": [
   [
    "D"
   ],
   [
    "B"
   ],
   [
    "D"
   ]
  ],
  "fide": {
   "黄河": -7
  }
 },
 "s7": {
  "name": "导入测试（北斗七星）",
  "round": 4,
  "boards": [
   [
    "天权",
    "玉衡"
   ],
   [
    "天枢",
    "摇光"
   ],
   [
    "天璇",
    "开阳"
   ]
  ],
  "byes": [
   [
    "天玑",
    "PAB"
   ]
  ],
  "cost": [
   0,
   0,
   2,
   2,
   2,
   2
  ],
  "linearBoards": [
   [
    "天权",
    "玉衡"
   ],
   [
    "天枢",
    "天璇"
   ],
   [
    "摇光",
    "开阳"
   ]
  ],
  "json": {
   "id": "imp",
   "name": "导入测试（北斗七星）",
   "format": "swiss",
   "mode": "chess",
   "nRounds": 6,
   "useColors": true,
   "initialColor": "W",
   "pts": {
    "win": 1,
    "draw": 0.5,
    "loss": 0,
    "pab": 1,
    "fpb": 1,
    "hpb": 0.5,
    "zpb": 0
   },
   "double": false,
   "players": [
    {
     "id": "p1",
     "name": "天枢",
     "rating": 2000
    },
    {
     "id": "p2",
     "name": "天璇",
     "rating": 1960
    },
    {
     "id": "p3",
     "name": "天玑",
     "rating": 1920
    },
    {
     "id": "p4",
     "name": "天权",
     "rating": 1880
    },
    {
     "id": "p5",
     "name": "玉衡",
     "rating": 1840
    },
    {
     "id": "p6",
     "name": "开阳",
     "rating": 1800
    },
    {
     "id": "p7",
     "name": "摇光",
     "rating": 1760
    }
   ],
   "rounds": [
    {
     "pairs": [
      {
       "w": "p1",
       "b": "p4",
       "res": "D",
       "sa": null,
       "sb": null
      },
      {
       "w": "p5",
       "b": "p2",
       "res": "W",
       "sa": null,
       "sb": null
      },
      {
       "w": "p3",
       "b": "p6",
       "res": "D",
       "sa": null,
       "sb": null
      }
     ],
     "byes": [
      {
       "p": "p7",
       "type": "PAB",
       "second": false
      }
     ]
    },
    {
     "pairs": [
      {
       "w": "p7",
       "b": "p5",
       "res": "B",
       "sa": null,
       "sb": null
      },
      {
       "w": "p6",
       "b": "p1",
       "res": "B",
       "sa": null,
       "sb": null
      },
      {
       "w": "p4",
       "b": "p3",
       "res": "W",
       "sa": null,
       "sb": null
      }
     ],
     "byes": [
      {
       "p": "p2",
       "type": "PAB",
       "second": false
      }
     ]
    },
    {
     "pairs": [
      {
       "w": "p5",
       "b": "p1",
       "res": "D",
       "sa": null,
       "sb": null
      },
      {
       "w": "p2",
       "b": "p4",
       "res": "B",
       "sa": null,
       "sb": null
      },
      {
       "w": "p3",
       "b": "p7",
       "res": "D",
       "sa": null,
       "sb": null
      }
     ],
     "byes": [
      {
       "p": "p6",
       "type": "PAB",
       "second": false
      }
     ]
    }
   ],
   "withdrawn": {},
   "requests": {},
   "tiebreaks": [
    "BH-C1",
    "BH",
    "SB",
    "DE",
    "WIN",
    "PS"
   ],
   "seedOrder": null,
   "ko": {
    "third": true,
    "res": {}
   },
   "nextId": 8
  }
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const T = 10000
  const wait = (fn, arg, msg) => page.waitForFunction(fn, arg, { timeout: T }).catch(() => { throw new Error('等待超时：' + msg) })
  const rev = () => page.evaluate(() => +document.body.getAttribute('data-rev'))
  async function act(fn, msg) {
    const r0 = await rev()
    await fn()
    await wait((r) => +document.body.getAttribute('data-rev') > r, r0, msg || '重绘')
  }
  async function onTab(t) {
    await page.click('#tab-' + t)
    await wait((t) => { const p = document.getElementById('pane-' + t); return p && !p.hidden && getComputedStyle(p).display !== 'none' && p.children.length > 0 }, t, '切到页签 ' + t)
  }
  async function setInput(sel, v) {
    await act(async () => {
      await page.fill(sel, String(v))
      await page.$eval(sel, (el) => el.dispatchEvent(new Event('change', { bubbles: true })))
    }, '输入 ' + sel)
  }
  const sel = (s, v) => act(() => page.selectOption(s, v), '选择 ' + s)
  const click = (s) => act(() => page.click(s), '点击 ' + s)
  async function newEvent(name, format, mode, rounds) {
    await page.click('#tl-new-open')
    await page.fill('#tl-new-name', name)
    await page.selectOption('#tl-new-format', format)
    await page.selectOption('#tl-new-mode', mode)
    await page.fill('#tl-new-rounds', String(rounds))
    await click('#tl-new-go')
    await wait((n) => document.querySelector('#tl-pick').selectedOptions[0].textContent.startsWith(n), name, '新建赛事 ' + name)
  }
  async function bulk(list) {
    await onTab('players')
    await page.fill('#tl-bulk', list.map((p) => p[0] + ', ' + p[1]).join('\n'))
    await click('#tl-bulk-go')
    await wait((n) => document.querySelectorAll('#tl-players-table tbody tr[data-id]').length === n, list.length, '批量添加 ' + list.length + ' 人')
  }
  const boards = (r) => page.$$eval(`#tl-round-${r} tbody tr`, (rows) => rows.map((tr) => Array.from(tr.querySelectorAll('.tl-pn')).map((s) => s.textContent)))
  const byes = (r) => page.$$eval(`#tl-round-${r} .tl-bye`, (ns) => ns.map((n) => n.textContent))
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
  async function standingsTable() {
    return page.$$eval('#tl-standings-table tbody tr', (rows) => rows.map((tr) => {
      const td = tr.querySelectorAll('td'), tb = {}
      tr.querySelectorAll('td[data-tb]').forEach((c) => { tb[c.getAttribute('data-tb')] = c.textContent })
      return { rank: td[0].textContent, name: td[2].textContent, score: td[3].textContent, tb }
    }))
  }
  function checkRows(got, want, label) {
    assert(got.length === want.length, `${label}：行数 ${got.length} ≠ ${want.length}`)
    want.forEach((w, i) => {
      const g = got[i]
      assert(g.name === w.name, `${label} 第 ${i + 1} 行选手 ${g.name} ≠ ${w.name}`)
      assert(g.rank === w.rank, `${label} ${w.name} 名次 ${g.rank} ≠ ${w.rank}`)
      assert(g.score === w.score, `${label} ${w.name} 积分 ${g.score} ≠ ${w.score}`)
      for (const c of Object.keys(w.tb)) assert(g.tb[c] === w.tb[c], `${label} ${w.name} ${c} = ${g.tb[c]} ≠ ${w.tb[c]}`)
    })
  }

  // ---------- 0. 首次打开：默认载入示例 A ----------
  await page.goto(toolURL)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await wait(() => document.querySelector('#tl-kpi-players') && document.querySelector('#tl-kpi-players').textContent === '23 人', null, '默认示例载入')
  assert(await page.$eval('a[href="../../"]', (a) => a.textContent.includes('返回工具集')), '缺少返回链接')
  assert((await page.$eval('#tl-pick', (s) => s.selectedOptions[0].textContent)).startsWith('城市快棋公开赛'), '默认赛事不是示例 A')

  // 键盘切页签
  await page.focus('#tab-players')
  await page.keyboard.press('ArrowRight')
  await wait(() => document.querySelector('#tab-rounds').getAttribute('aria-selected') === 'true' && document.activeElement.id === 'tab-rounds', null, '方向键切到「对阵」')

  // ---------- 1. 渲染守卫（示例 A 全部页签） ----------
  const nCtl = await renderGuards(page, {
    assert, tabs: ORACLE.meta.tabs, onTab,
    paneSel: (t) => `#pane-${t}`, panesRoot: '#tl-panes',
    figSel: (t) => `#pane-${t} svg`, cardSel: '.tl-card',
    minControls: 150, minTextsInFig: 10,
  })
  assert(nCtl >= 150, '控件数 ' + nCtl)

  // ---------- 2. 示例 B：比分制联赛 + UEFA 相互战绩 ----------
  await sel('#tl-demo', '1')
  await onTab('standings')
  checkRows(await standingsTable(), ORACLE.s3.standings.rows, '示例联赛')
  assert(await page.$$eval('#tl-trace li', (l) => l.length) === ORACLE.s3.standings.trace, '示例联赛破同分过程条数')

  // ---------- 3. 示例 C：淘汰赛对阵图（图上文字不重叠、窄屏不横溢） ----------
  await sel('#tl-demo', '2')
  await onTab('rounds')
  await wait(() => document.querySelectorAll('#tl-bracket .tl-svg-box').length >= 15, null, '对阵图')
  await guardFigText(page, { assert, tabs: ['rounds'], onTab, figSel: () => '#pane-rounds svg', minTextsInFig: 30 })
  await guardOverflow(page, { assert, tabs: ['rounds', 'standings', 'players'], onTab, panesRoot: '#tl-panes' })
  // 页签条是横向滚动的 flex 行：子项若被压缩到内容宽度以下，文字会叠进隔壁页签（2026-11-03 人工看 390px 截图发现，SVG 文字守卫管不到 HTML；已固化为 guardBoxOverlap）
  await guardBoxOverlap(page, { assert, sel: '#tl-tabs .tl-tab, .tl-top-tags .tl-tag, #tl-kpis .tl-kpi' })

  // ---------- 4. S1：瑞士制 9 人，从零走完 3 轮 ----------
  const S1 = ORACLE.s1
  await newEvent('测试瑞士制', 'swiss', 'chess', S1.rounds)
  await bulk(S1.players)
  const tpnNames = await page.$$eval('#tl-players-table tbody tr', (rows) => rows.map((tr) => tr.querySelector('input[data-f=name]').value))
  assert(same(tpnNames, S1.players.map((p) => p[0])), 'TPN 顺序应按等级分降序：' + tpnNames.join(','))
  for (let r = 1; r <= 3; r++) {
    const T1 = S1.rounds_truth[r - 1]
    if (r === S1.request.round) {
      await onTab('players')
      await sel(`#tl-players-table tr:has(input[value="${S1.request.name}"]) select[data-act=req]`, S1.request.type)
    }
    if (r === S1.withdraw.afterRound + 1) {
      await onTab('players')
      await click(`#tl-players-table tr:has(input[value="${S1.withdraw.name}"]) button[data-act=wd]`)
    }
    await onTab('rounds')
    await click('#tl-pair')
    await wait((r) => !!document.querySelector('#tl-round-' + r), r, '第 ' + r + ' 轮出现')
    const got = await boards(r)
    assert(same(got, T1.boards), `S1 第 ${r} 轮对阵 ${JSON.stringify(got)} ≠ ${JSON.stringify(T1.boards)}`)
    const by = await byes(r)
    for (const [n, type] of T1.byes) assert(by.some((t) => t.startsWith(n + ' · ')), `S1 第 ${r} 轮缺少 ${n} 的轮空/请假（${type}）：${by.join('|')}`)
    if (r === S1.withdraw.afterRound + 1) assert(by.some((t) => t === S1.withdraw.name + ' · 已退赛（零分）'), '退赛者应在第 ' + r + ' 轮标注：' + by.join('|'))
    for (let i = 0; i < S1.results[r - 1].length; i++) await sel(`#tl-round-${r} tr[data-g="${i}"] select[data-f=res]`, S1.results[r - 1][i])
    if (r === 1) {
      // 录完立刻刷新：结果是同步写盘的，不能丢
      await page.reload()
      await onTab('rounds')
      const kept = await page.$$eval('#tl-round-1 select[data-f=res]', (ss) => ss.map((s) => s.value))
      assert(same(kept, S1.results[0]), '刷新后第 1 轮结果丢失：' + kept.join(','))
    }
  }
  // 编排说明
  const why = await page.$eval('#tl-round-2 details', (d) => d.textContent)
  assert(why.includes('分差平方和') && why.includes('E1'), '编排说明缺少代价 / 配色规则')
  // 撤销第 3 轮后重新编排：同一状态必须得到同一对阵
  await click('#tl-unpair')
  await wait(() => !document.querySelector('#tl-round-3'), null, '撤销第 3 轮')
  await click('#tl-pair')
  await wait(() => !!document.querySelector('#tl-round-3'), null, '重排第 3 轮')
  assert(same(await boards(3), S1.rounds_truth[2].boards), '撤销后重排的第 3 轮对阵不一致')
  for (let i = 0; i < S1.results[2].length; i++) await sel(`#tl-round-3 tr[data-g="${i}"] select[data-f=res]`, S1.results[2][i])
  await onTab('standings')
  checkRows(await standingsTable(), S1.standings.rows, 'S1 积分榜')
  for (const c of ['ARO', 'TPR', 'PTP']) await sel('#tl-tb-add', c)
  checkRows(await standingsTable(), S1.standings2.rows, 'S1 积分榜（加 ARO/TPR/PTP）')
  await onTab('cross')
  const cross = await page.$$eval('#tl-cross-table tbody tr', (rows) => rows.map((tr) => { const td = Array.from(tr.querySelectorAll('td')); return { name: td[2].textContent, cells: td.slice(3, -1).map((x) => x.textContent) } }))
  for (const row of cross) assert(same(row.cells, S1.cross[row.name]), `S1 交叉表 ${row.name}：${row.cells.join(' ')} ≠ ${S1.cross[row.name].join(' ')}`)
  await onTab('ratings')
  const fideCells = await page.$$eval('#tl-ratings-table tbody tr', (rows) => rows.map((tr) => [tr.querySelector('td').textContent, tr.querySelector('td[data-col=fide]').textContent]))
  let nF = 0
  for (const [name, txt] of fideCells) {
    const want = S1.fide[name]
    if (want === null || want === undefined) continue
    assert(txt === (want > 0 ? '+' : '') + want, `S1 FIDE 变化 ${name}：${txt} ≠ ${want}`)
    nF++
  }
  assert(nF === 9, 'FIDE 变化应核对 9 人，实得 ' + nF)

  // ---------- 5. S2：循环赛 5 人（官方贝格尔表 + 直胜 / 索伯分） ----------
  const S2 = ORACLE.s2
  await newEvent('测试循环赛', 'rr', 'chess', 5)
  await bulk(S2.players)
  await onTab('rounds')
  await click('#tl-rr-gen')
  await wait(() => document.querySelectorAll('#tl-stream .tl-item').length === 5, null, '生成 5 轮赛程')
  for (let r = 1; r <= 5; r++) {
    assert(same(await boards(r), S2.boards[r - 1]), `S2 第 ${r} 轮与 FIDE 贝格尔表不符：${JSON.stringify(await boards(r))}`)
    assert((await byes(r)).includes(S2.rest[r - 1] + ' · 轮休'), `S2 第 ${r} 轮轮休者应是 ${S2.rest[r - 1]}`)
    for (let i = 0; i < S2.results[r - 1].length; i++) await sel(`#tl-round-${r} tr[data-g="${i}"] select[data-f=res]`, S2.results[r - 1][i])
  }
  await onTab('standings')
  checkRows(await standingsTable(), S2.standings.rows, 'S2 积分榜')
  const tr2 = await page.$$eval('#tl-trace li', (l) => l.map((x) => x.textContent))
  assert(tr2.length === S2.standings.trace && tr2.some((t) => t.includes('直胜')) && tr2.some((t) => t.includes('索伯分')), 'S2 破同分过程应先直胜后索伯分：' + tr2.join(' / '))

  // ---------- 6. S4：淘汰赛 6 人（标准种子位 + 晋级 + 名次） ----------
  const S4 = ORACLE.s4
  await newEvent('测试淘汰赛', 'ko', 'score', 3)
  await bulk(S4.players)
  await onTab('rounds')
  const firstRound = await page.$$eval('#tl-bracket text[data-k^="1-"]', (ts) => {
    const m = {}; ts.forEach((t) => { const k = t.getAttribute('data-k'); (m[k] = m[k] || {})[t.getAttribute('data-s')] = t.getAttribute('data-name') })
    return Object.keys(m).sort().map((k) => [m[k].a, m[k].b])
  })
  assert(same(firstRound, S4.first), '淘汰赛首轮种子位：' + JSON.stringify(firstRound))
  for (const step of S4.steps) {
    const [a, b] = S4.scores[step.key]
    await setInput(`#tl-ko-table tr[data-key="${step.key}"] input[data-f=sa]`, a)
    await setInput(`#tl-ko-table tr[data-key="${step.key}"] input[data-f=sb]`, b)
    const winners = await page.$$eval('#tl-bracket text[data-k]', (ts) => ts.filter((t) => t.getAttribute('font-weight') === '700' && t.getAttribute('data-k') !== 'T-0').map((t) => t.getAttribute('data-k') + ':' + t.getAttribute('data-name')))
    const want = []
    step.winners.forEach((ms, ri) => ms.forEach((w, i) => { if (w) want.push((ri + 1) + '-' + i + ':' + w) }))
    // 首轮轮空的高种子直接晋级，图上也应标为胜者
    assert(same(winners.slice().sort(), want.slice().sort()), `录入 ${step.key} 后晋级者 ${winners.join(',')} ≠ ${want.join(',')}`)
  }
  await onTab('standings')
  const place = await page.$$eval('#tl-standings-table tbody tr', (rows) => Object.fromEntries(rows.map((tr) => [tr.children[1].textContent, tr.children[0].textContent])))
  for (const [n, p] of Object.entries(S4.place)) assert(place[n] === p, `淘汰赛名次 ${n}：${place[n]} ≠ ${p}`)
  assert(await page.$eval('#tl-kpi-leader', (e) => e.textContent) === S4.champion + ' 夺冠', '冠军 KPI')

  // ---------- 7. S5：Glickman 例题（4 人单循环，甲的三盘恰是文档里的评分期） ----------
  const S5 = ORACLE.s5
  await newEvent('测试 Glicko', 'rr', 'chess', 3)
  await bulk(S5.players.map((p) => [p[0], p[1]]))
  for (const [n, , rd] of S5.players) await setInput(`#tl-players-table tr:has(input[value="${n}"]) input[data-f=rd]`, rd)
  await onTab('rounds')
  await click('#tl-rr-gen')
  for (let r = 1; r <= 3; r++) {
    assert(same(await boards(r), S5.boards[r - 1]), 'S5 第 ' + r + ' 轮对阵')
    for (let i = 0; i < 2; i++) await sel(`#tl-round-${r} tr[data-g="${i}"] select[data-f=res]`, S5.results[r - 1][i])
  }
  await onTab('ratings')
  const g = await page.$$eval('#tl-ratings-table tbody tr', (rows) => {
    const tr = rows.find((x) => x.querySelector('td').textContent === '甲')
    return { r: +tr.querySelector('[data-col=glicko]').textContent, rd: +tr.querySelector('[data-col=rd]').textContent, vol: +tr.querySelector('[data-col=vol]').textContent, fide: tr.querySelector('[data-col=fide]').textContent }
  })
  // 容差 = 页面显示位数的半个最小单位 + 文档自身两位小数的舍入
  assert(Math.abs(g.r - S5.paper.r) <= 0.051, `Glicko r′ ${g.r} vs 文档 ${S5.paper.r}`)
  assert(Math.abs(g.rd - S5.paper.rd) <= 0.051, `Glicko RD′ ${g.rd} vs 文档 ${S5.paper.rd}`)
  assert(Math.abs(g.vol - S5.paper.vol) <= 0.0000105, `Glicko σ′ ${g.vol} vs 文档 ${S5.paper.vol}`)
  assert(g.fide === String(S5.fide), `S5 FIDE 变化 ${g.fide} ≠ ${S5.fide}`)

  // S5′：第二实现 R PlayerRatings::glicko2 对全部 4 人（乙丙丁 μ≠0，测得出把 φ² 写成 μ² 那类笔误）
  const all = await page.$$eval('#tl-ratings-table tbody tr', (rows) => Object.fromEntries(rows.map((tr) => [tr.querySelector('td').textContent, { r: +tr.querySelector('[data-col=glicko]').textContent, rd: +tr.querySelector('[data-col=rd]').textContent, vol: +tr.querySelector('[data-col=vol]').textContent }])))
  for (const [n, w] of Object.entries(S5.pr)) {
    const v = all[n]
    assert(v && Math.abs(v.r - w.r) <= 0.051 && Math.abs(v.rd - w.rd) <= 0.051 && Math.abs(v.vol - w.vol) <= 0.0000015, `Glicko ${n}：页面 ${JSON.stringify(v)} vs PlayerRatings ${JSON.stringify(w)}`)
  }

  // ---------- 7b. S6：FIDE 总变化 −6.5 要远离零取 −7（K=10 才会出现 x.5） ----------
  const S6 = ORACLE.s6
  await newEvent('测试 FIDE 取整', 'rr', 'chess', 3)
  await bulk(S6.players)
  const tpn6 = await page.$$eval('#tl-players-table tbody tr', (rows) => rows.map((tr) => tr.querySelector('input[data-f=name]').value))
  assert(same(tpn6, S6.tpn), 'S6 编号顺序（同分按姓名）：' + tpn6.join(','))
  await onTab('rounds')
  await click('#tl-rr-gen')
  for (let r = 1; r <= 3; r++) {
    assert(same(await boards(r), S6.boards[r - 1]), 'S6 第 ' + r + ' 轮对阵 ' + JSON.stringify(await boards(r)))
    await sel(`#tl-round-${r} tr[data-g="0"] select[data-f=res]`, S6.results[r - 1][0])
  }
  await onTab('ratings')
  const f6 = await page.$$eval('#tl-ratings-table tbody tr', (rows) => Object.fromEntries(rows.map((tr) => [tr.querySelector('td').textContent, tr.querySelector('[data-col=fide]').textContent])))
  assert(f6['黄河'] === String(S6.fide['黄河']), `S6 黄河 FIDE 变化 ${f6['黄河']} ≠ ${S6.fide['黄河']}（−6.5 应远离零）`)

  // ---------- 7c. S7：导入 JSON 后编排第 4 轮（这里「分差平方和」与「分差和」给出不同配对） ----------
  const S7 = ORACLE.s7
  await act(() => page.setInputFiles('#tl-import', { name: 's7.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(S7.json)) }), '导入 JSON')
  await wait((n) => document.querySelector('#tl-pick').selectedOptions[0].textContent.startsWith(n), S7.name, '导入后切到该赛事')
  await onTab('rounds')
  await click('#tl-pair')
  await wait((r) => !!document.querySelector('#tl-round-' + r), S7.round, '导入后编排')
  const b7 = await boards(S7.round)
  assert(same(b7, S7.boards), `S7 第 ${S7.round} 轮 ${JSON.stringify(b7)} ≠ ${JSON.stringify(S7.boards)}（分差按线性算会得到 ${JSON.stringify(S7.linearBoards)}）`)

  // ---------- 8. 缩略图：回到示例 A 的积分榜 ----------
  await page.selectOption('#tl-pick', { index: 0 })
  await wait(() => document.querySelector('#tl-kpi-players').textContent === '23 人', null, '回到示例 A')
  await onTab('standings')
  await page.evaluate(() => { window.scrollTo(0, 0); document.getElementById('tl-toast').hidden = true })
  await wait(() => getComputedStyle(document.getElementById('tl-toast')).display === 'none', null, '提示条收起')
  await screenshot('thumb.png')
}
