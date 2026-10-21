// 排班工作台 · Shift Lab 集成测试
// 真值全部由 run 目录 uitruth/ 生成并机械注入（tools/inject-oracle.mjs），本文件不手打任何班表、分数或目标值：
//   · 班表 / 分数：离线用同一份成品引擎按同样的种子与冲突预算跑出，再由 oracle/roster.py（独立的 Python 口径实现）逐条核硬约束、重算分数；
//   · 最优值：OR-Tools CP-SAT 独立建模求解并证明最优；最小冲突集：CP-SAT 证明「整组无解、删任意一条有解」；
//   · 公平目标、禁止相接矩阵：roster.py 的 norm() 独立计算。
import { renderGuards } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs';
import fs from 'node:fs';

const ORACLE = {
 "meta": {
  "tabs": [
   "roster",
   "team",
   "rules",
   "diag",
   "about"
  ]
 },
 "demo": {
  "names": [
   "王芳",
   "李娜",
   "张敏",
   "刘洋",
   "黄丽",
   "陈静",
   "杨帆",
   "赵磊",
   "周婷",
   "吴昊",
   "孙悦",
   "郑凯"
  ],
  "days": 28,
  "shifts": [
   "D",
   "E",
   "N"
  ],
  "leaveCount": 6,
  "tg": [
   [
    20,
    21
   ],
   [
    17,
    18
   ],
   [
    20,
    21
   ],
   [
    20,
    21
   ],
   [
    20,
    21
   ],
   [
    20,
    21
   ],
   [
    20,
    21
   ],
   [
    20,
    21
   ],
   [
    20,
    21
   ],
   [
    20,
    21
   ],
   [
    10,
    11
   ],
   [
    20,
    21
   ]
  ],
  "tgw": [
   [
    4,
    5
   ],
   [
    4,
    5
   ],
   [
    4,
    5
   ],
   [
    4,
    5
   ],
   [
    4,
    5
   ],
   [
    4,
    5
   ],
   [
    4,
    5
   ],
   [
    4,
    5
   ],
   [
    4,
    5
   ],
   [
    4,
    5
   ],
   [
    2,
    3
   ],
   [
    4,
    5
   ]
  ],
  "tgn": [
   [
    5,
    6
   ],
   [
    4,
    5
   ],
   [
    5,
    6
   ],
   [
    5,
    6
   ],
   [
    5,
    6
   ],
   [
    5,
    6
   ],
   [
    5,
    6
   ],
   [
    5,
    6
   ],
   [
    0,
    0
   ],
   [
    5,
    6
   ],
   [
    0,
    0
   ],
   [
    5,
    6
   ]
  ]
 },
 "demoProject": {
  "v": 1,
  "name": "仁和社区医院 · 内科护理组",
  "start": "2026-11-02",
  "days": 28,
  "shifts": [
   {
    "id": "D",
    "name": "早班",
    "short": "早",
    "start": "07:00",
    "end": "15:00",
    "color": "orange",
    "night": false
   },
   {
    "id": "E",
    "name": "中班",
    "short": "中",
    "start": "15:00",
    "end": "23:00",
    "color": "violet",
    "night": false
   },
   {
    "id": "N",
    "name": "夜班",
    "short": "夜",
    "start": "23:00",
    "end": "07:00",
    "color": "pink",
    "night": true
   }
  ],
  "demand": {
   "weekday": {
    "D": 4,
    "E": 3,
    "N": 2
   },
   "weekend": {
    "D": 3,
    "E": 2,
    "N": 2
   }
  },
  "dayOverrides": [],
  "holidays": [],
  "skills": [
   {
    "id": "sr",
    "name": "资深",
    "min": {
     "D": 1,
     "E": 1,
     "N": 1
    }
   }
  ],
  "staff": [
   {
    "id": "p01",
    "name": "王芳",
    "fte": 1,
    "skills": [
     "sr"
    ],
    "shifts": [
     "D",
     "E",
     "N"
    ],
    "minShifts": null,
    "maxShifts": null,
    "histConsec": 0,
    "histLast": ""
   },
   {
    "id": "p02",
    "name": "李娜",
    "fte": 1,
    "skills": [
     "sr"
    ],
    "shifts": [
     "D",
     "E",
     "N"
    ],
    "minShifts": null,
    "maxShifts": null,
    "histConsec": 2,
    "histLast": "D"
   },
   {
    "id": "p03",
    "name": "张敏",
    "fte": 1,
    "skills": [
     "sr"
    ],
    "shifts": [
     "D",
     "E",
     "N"
    ],
    "minShifts": null,
    "maxShifts": null,
    "histConsec": 4,
    "histLast": "N"
   },
   {
    "id": "p04",
    "name": "刘洋",
    "fte": 1,
    "skills": [
     "sr"
    ],
    "shifts": [
     "D",
     "E",
     "N"
    ],
    "minShifts": null,
    "maxShifts": null,
    "histConsec": 0,
    "histLast": ""
   },
   {
    "id": "p05",
    "name": "黄丽",
    "fte": 1,
    "skills": [
     "sr"
    ],
    "shifts": [
     "D",
     "E",
     "N"
    ],
    "minShifts": null,
    "maxShifts": null,
    "histConsec": 1,
    "histLast": "E"
   },
   {
    "id": "p06",
    "name": "陈静",
    "fte": 1,
    "skills": [],
    "shifts": [
     "D",
     "E",
     "N"
    ],
    "minShifts": null,
    "maxShifts": null,
    "histConsec": 3,
    "histLast": "E"
   },
   {
    "id": "p07",
    "name": "杨帆",
    "fte": 1,
    "skills": [],
    "shifts": [
     "D",
     "E",
     "N"
    ],
    "minShifts": null,
    "maxShifts": null,
    "histConsec": 0,
    "histLast": ""
   },
   {
    "id": "p08",
    "name": "赵磊",
    "fte": 1,
    "skills": [],
    "shifts": [
     "D",
     "E",
     "N"
    ],
    "minShifts": null,
    "maxShifts": null,
    "histConsec": 5,
    "histLast": "D"
   },
   {
    "id": "p09",
    "name": "周婷",
    "fte": 1,
    "skills": [],
    "shifts": [
     "D",
     "E"
    ],
    "minShifts": null,
    "maxShifts": null,
    "histConsec": 0,
    "histLast": ""
   },
   {
    "id": "p10",
    "name": "吴昊",
    "fte": 1,
    "skills": [],
    "shifts": [
     "D",
     "E",
     "N"
    ],
    "minShifts": null,
    "maxShifts": null,
    "histConsec": 2,
    "histLast": "N"
   },
   {
    "id": "p11",
    "name": "孙悦",
    "fte": 0.5,
    "skills": [],
    "shifts": [
     "D",
     "E"
    ],
    "minShifts": null,
    "maxShifts": 11,
    "histConsec": 0,
    "histLast": ""
   },
   {
    "id": "p12",
    "name": "郑凯",
    "fte": 1,
    "skills": [],
    "shifts": [
     "D",
     "E",
     "N"
    ],
    "minShifts": null,
    "maxShifts": null,
    "histConsec": 1,
    "histLast": "D"
   }
  ],
  "requests": [
   {
    "staff": "p02",
    "date": "2026-11-16",
    "kind": "leave",
    "shift": ""
   },
   {
    "staff": "p02",
    "date": "2026-11-17",
    "kind": "leave",
    "shift": ""
   },
   {
    "staff": "p02",
    "date": "2026-11-18",
    "kind": "leave",
    "shift": ""
   },
   {
    "staff": "p02",
    "date": "2026-11-19",
    "kind": "leave",
    "shift": ""
   },
   {
    "staff": "p02",
    "date": "2026-11-20",
    "kind": "leave",
    "shift": ""
   },
   {
    "staff": "p06",
    "date": "2026-11-09",
    "kind": "leave",
    "shift": ""
   },
   {
    "staff": "p07",
    "date": "2026-11-03",
    "kind": "on",
    "shift": "D"
   },
   {
    "staff": "p07",
    "date": "2026-11-04",
    "kind": "on",
    "shift": "D"
   },
   {
    "staff": "p08",
    "date": "2026-11-25",
    "kind": "off",
    "shift": ""
   },
   {
    "staff": "p08",
    "date": "2026-11-26",
    "kind": "off",
    "shift": ""
   },
   {
    "staff": "p10",
    "date": "2026-11-14",
    "kind": "off",
    "shift": ""
   },
   {
    "staff": "p10",
    "date": "2026-11-15",
    "kind": "off",
    "shift": ""
   },
   {
    "staff": "p01",
    "date": "2026-11-21",
    "kind": "off",
    "shift": ""
   },
   {
    "staff": "p12",
    "date": "2026-11-11",
    "kind": "on",
    "shift": "E"
   },
   {
    "staff": "p09",
    "date": "2026-11-28",
    "kind": "off",
    "shift": ""
   },
   {
    "staff": "p09",
    "date": "2026-11-29",
    "kind": "off",
    "shift": ""
   }
  ],
  "rules": {
   "maxConsec": 6,
   "minRest": 11,
   "maxConsecNights": 3,
   "maxNights": 8,
   "overstaff": 0
  },
  "weights": {
   "wish": 5,
   "fair": 3,
   "weekend": 2,
   "night": 2,
   "isoWork": 1,
   "isoOff": 1,
   "split": 1
  }
 },
 "demo40k": {
  "status": "feasible",
  "cost": 55,
  "pyCost": 55,
  "by": {
   "wish": 0,
   "fair": 0,
   "weekend": 4,
   "night": 0,
   "isoWork": 1,
   "isoOff": 36,
   "split": 14
  },
  "conflicts": 40000,
  "cells": {
   "p01": {
    "2026-11-02": "D",
    "2026-11-03": "D",
    "2026-11-04": "D",
    "2026-11-06": "D",
    "2026-11-07": "D",
    "2026-11-08": "D",
    "2026-11-09": "D",
    "2026-11-10": "D",
    "2026-11-11": "D",
    "2026-11-15": "D",
    "2026-11-16": "D",
    "2026-11-17": "D",
    "2026-11-18": "N",
    "2026-11-19": "N",
    "2026-11-20": "N",
    "2026-11-23": "E",
    "2026-11-24": "N",
    "2026-11-25": "N",
    "2026-11-26": "N",
    "2026-11-28": "D",
    "2026-11-29": "D"
   },
   "p02": {
    "2026-11-02": "E",
    "2026-11-03": "E",
    "2026-11-05": "N",
    "2026-11-06": "N",
    "2026-11-09": "E",
    "2026-11-10": "E",
    "2026-11-11": "N",
    "2026-11-12": "N",
    "2026-11-14": "D",
    "2026-11-15": "N",
    "2026-11-22": "D",
    "2026-11-23": "D",
    "2026-11-24": "D",
    "2026-11-25": "D",
    "2026-11-26": "D",
    "2026-11-27": "D",
    "2026-11-29": "E"
   },
   "p03": {
    "2026-11-02": "N",
    "2026-11-05": "D",
    "2026-11-06": "E",
    "2026-11-07": "N",
    "2026-11-08": "N",
    "2026-11-10": "D",
    "2026-11-11": "E",
    "2026-11-12": "E",
    "2026-11-13": "E",
    "2026-11-14": "E",
    "2026-11-16": "E",
    "2026-11-17": "N",
    "2026-11-19": "D",
    "2026-11-20": "D",
    "2026-11-21": "D",
    "2026-11-22": "E",
    "2026-11-24": "D",
    "2026-11-25": "D",
    "2026-11-26": "D",
    "2026-11-27": "N",
    "2026-11-28": "N"
   },
   "p04": {
    "2026-11-02": "D",
    "2026-11-03": "E",
    "2026-11-04": "E",
    "2026-11-05": "E",
    "2026-11-06": "E",
    "2026-11-09": "D",
    "2026-11-10": "D",
    "2026-11-11": "D",
    "2026-11-12": "D",
    "2026-11-13": "N",
    "2026-11-14": "N",
    "2026-11-16": "E",
    "2026-11-17": "E",
    "2026-11-18": "E",
    "2026-11-21": "N",
    "2026-11-22": "N",
    "2026-11-23": "N",
    "2026-11-25": "E",
    "2026-11-26": "E",
    "2026-11-28": "E",
    "2026-11-29": "N"
   },
   "p05": {
    "2026-11-02": "E",
    "2026-11-03": "N",
    "2026-11-04": "N",
    "2026-11-06": "D",
    "2026-11-07": "E",
    "2026-11-08": "E",
    "2026-11-09": "N",
    "2026-11-10": "N",
    "2026-11-13": "D",
    "2026-11-14": "D",
    "2026-11-15": "E",
    "2026-11-16": "N",
    "2026-11-18": "D",
    "2026-11-19": "E",
    "2026-11-20": "E",
    "2026-11-21": "E",
    "2026-11-23": "D",
    "2026-11-24": "E",
    "2026-11-25": "E",
    "2026-11-26": "E",
    "2026-11-27": "E"
   },
   "p06": {
    "2026-11-02": "N",
    "2026-11-04": "E",
    "2026-11-05": "E",
    "2026-11-06": "E",
    "2026-11-07": "E",
    "2026-11-08": "E",
    "2026-11-10": "D",
    "2026-11-11": "D",
    "2026-11-12": "D",
    "2026-11-13": "N",
    "2026-11-16": "N",
    "2026-11-17": "N",
    "2026-11-19": "D",
    "2026-11-20": "D",
    "2026-11-21": "E",
    "2026-11-23": "D",
    "2026-11-24": "D",
    "2026-11-25": "D",
    "2026-11-26": "N",
    "2026-11-27": "N",
    "2026-11-29": "D"
   },
   "p07": {
    "2026-11-02": "D",
    "2026-11-03": "D",
    "2026-11-04": "D",
    "2026-11-05": "D",
    "2026-11-06": "D",
    "2026-11-09": "E",
    "2026-11-10": "N",
    "2026-11-11": "N",
    "2026-11-13": "D",
    "2026-11-14": "N",
    "2026-11-15": "N",
    "2026-11-17": "E",
    "2026-11-18": "E",
    "2026-11-20": "D",
    "2026-11-21": "N",
    "2026-11-22": "N",
    "2026-11-24": "D",
    "2026-11-25": "D",
    "2026-11-26": "D",
    "2026-11-27": "D",
    "2026-11-28": "D"
   },
   "p08": {
    "2026-11-03": "E",
    "2026-11-04": "N",
    "2026-11-05": "N",
    "2026-11-07": "N",
    "2026-11-08": "N",
    "2026-11-09": "N",
    "2026-11-11": "D",
    "2026-11-12": "E",
    "2026-11-13": "E",
    "2026-11-14": "E",
    "2026-11-15": "E",
    "2026-11-16": "E",
    "2026-11-18": "E",
    "2026-11-19": "E",
    "2026-11-20": "E",
    "2026-11-23": "E",
    "2026-11-24": "N",
    "2026-11-27": "D",
    "2026-11-28": "D",
    "2026-11-29": "D"
   },
   "p09": {
    "2026-11-02": "D",
    "2026-11-03": "D",
    "2026-11-04": "D",
    "2026-11-05": "E",
    "2026-11-07": "D",
    "2026-11-08": "D",
    "2026-11-09": "D",
    "2026-11-12": "D",
    "2026-11-13": "D",
    "2026-11-14": "D",
    "2026-11-15": "D",
    "2026-11-17": "D",
    "2026-11-18": "D",
    "2026-11-19": "E",
    "2026-11-20": "E",
    "2026-11-22": "D",
    "2026-11-23": "D",
    "2026-11-24": "E",
    "2026-11-25": "E",
    "2026-11-26": "E",
    "2026-11-27": "E"
   },
   "p10": {
    "2026-11-03": "D",
    "2026-11-04": "D",
    "2026-11-05": "D",
    "2026-11-06": "D",
    "2026-11-09": "D",
    "2026-11-10": "E",
    "2026-11-11": "E",
    "2026-11-12": "E",
    "2026-11-13": "E",
    "2026-11-16": "D",
    "2026-11-17": "E",
    "2026-11-18": "N",
    "2026-11-19": "N",
    "2026-11-21": "D",
    "2026-11-22": "D",
    "2026-11-23": "N",
    "2026-11-26": "D",
    "2026-11-27": "D",
    "2026-11-28": "N",
    "2026-11-29": "N"
   },
   "p11": {
    "2026-11-04": "E",
    "2026-11-07": "D",
    "2026-11-08": "D",
    "2026-11-12": "D",
    "2026-11-13": "D",
    "2026-11-16": "D",
    "2026-11-17": "D",
    "2026-11-18": "D",
    "2026-11-19": "D",
    "2026-11-20": "D",
    "2026-11-21": "D"
   },
   "p12": {
    "2026-11-02": "E",
    "2026-11-03": "N",
    "2026-11-05": "D",
    "2026-11-06": "N",
    "2026-11-09": "E",
    "2026-11-10": "E",
    "2026-11-11": "E",
    "2026-11-12": "N",
    "2026-11-15": "D",
    "2026-11-16": "D",
    "2026-11-17": "D",
    "2026-11-18": "D",
    "2026-11-19": "D",
    "2026-11-20": "N",
    "2026-11-22": "E",
    "2026-11-23": "E",
    "2026-11-24": "E",
    "2026-11-25": "N",
    "2026-11-27": "E",
    "2026-11-28": "E",
    "2026-11-29": "E"
   }
  },
  "ids": [
   "p01",
   "p02",
   "p03",
   "p04",
   "p05",
   "p06",
   "p07",
   "p08",
   "p09",
   "p10",
   "p11",
   "p12"
  ],
  "dates": [
   "2026-11-02",
   "2026-11-03",
   "2026-11-04",
   "2026-11-05",
   "2026-11-06",
   "2026-11-07",
   "2026-11-08",
   "2026-11-09",
   "2026-11-10",
   "2026-11-11",
   "2026-11-12",
   "2026-11-13",
   "2026-11-14",
   "2026-11-15",
   "2026-11-16",
   "2026-11-17",
   "2026-11-18",
   "2026-11-19",
   "2026-11-20",
   "2026-11-21",
   "2026-11-22",
   "2026-11-23",
   "2026-11-24",
   "2026-11-25",
   "2026-11-26",
   "2026-11-27",
   "2026-11-28",
   "2026-11-29"
  ],
  "cover": "236 / 236",
  "wish": "10 / 10"
 },
 "keys": {
  "staff1": "p02",
  "d": 1,
  "dateD": "2026-11-03",
  "staff2": "p03",
  "date5": "2026-11-07",
  "hardLockN": [
   "cover",
   "coverMax"
  ],
  "hardLockOff": [
   "cover"
  ]
 },
 "small": {
  "cpsat": 9,
  "cells": {
   "c1": {
    "2026-11-02": "A",
    "2026-11-03": "A",
    "2026-11-04": "A",
    "2026-11-05": "A",
    "2026-11-06": "B"
   },
   "c2": {
    "2026-11-02": "B",
    "2026-11-06": "A",
    "2026-11-07": "A",
    "2026-11-08": "A"
   },
   "c3": {
    "2026-11-07": "B",
    "2026-11-08": "B"
   },
   "c4": {
    "2026-11-05": "B",
    "2026-11-07": "B",
    "2026-11-08": "B"
   },
   "c5": {
    "2026-11-03": "B",
    "2026-11-04": "B",
    "2026-11-07": "A",
    "2026-11-08": "A"
   }
  },
  "ids": [
   "c1",
   "c2",
   "c3",
   "c4",
   "c5"
  ],
  "dates": [
   "2026-11-02",
   "2026-11-03",
   "2026-11-04",
   "2026-11-05",
   "2026-11-06",
   "2026-11-07",
   "2026-11-08"
  ],
  "csv": [
   [
    "姓名",
    "11月2日 周一",
    "11月3日 周二",
    "11月4日 周三",
    "11月5日 周四",
    "11月6日 周五",
    "11月7日 周六",
    "11月8日 周日",
    "班数",
    "夜班",
    "周末班",
    "工时"
   ],
   [
    "林可",
    "早班",
    "早班",
    "早班",
    "早班",
    "晚班",
    "休",
    "休",
    "5",
    "0",
    "0",
    "35"
   ],
   [
    "许嘉",
    "晚班",
    "休",
    "休",
    "休",
    "早班",
    "早班",
    "早班",
    "4",
    "0",
    "2",
    "28"
   ],
   [
    "何雨",
    "休",
    "休",
    "请假",
    "休",
    "休",
    "晚班",
    "晚班",
    "2",
    "0",
    "2",
    "14"
   ],
   [
    "马骁",
    "休",
    "休",
    "休",
    "晚班",
    "休",
    "晚班",
    "晚班",
    "3",
    "0",
    "2",
    "21"
   ],
   [
    "宋晴",
    "休",
    "晚班",
    "晚班",
    "休",
    "休",
    "早班",
    "早班",
    "4",
    "0",
    "2",
    "28"
   ]
  ]
 },
 "infeas": {
  "leaves": [
   [
    0,
    1
   ],
   [
    1,
    1
   ],
   [
    2,
    1
   ]
  ],
  "mus": [
   "11月3日（周二） 早班至少 1 名店长",
   "林可 11月3日（周二） 请假",
   "许嘉 11月3日（周二） 请假"
  ],
  "cpInfeasible": true,
  "cpMinimal": true,
  "supplyRed": [],
  "supplyAmber": [
   "1:0"
  ],
  "relax": "11月3日（周二） 早班至少 1 名店长",
  "relaxedCpsat": 16
 },
 "fteChange": {
  "p": 10,
  "fte": 1,
  "fte0": 0.5,
  "tg": [
   [
    20,
    21
   ],
   [
    16,
    17
   ],
   [
    20,
    21
   ],
   [
    20,
    21
   ],
   [
    20,
    21
   ],
   [
    19,
    20
   ],
   [
    20,
    21
   ],
   [
    20,
    21
   ],
   [
    20,
    21
   ],
   [
    20,
    21
   ],
   [
    11,
    11
   ],
   [
    20,
    21
   ]
  ]
 },
 "forb": {
  "11": [
   0,
   0,
   0,
   1,
   0,
   0,
   1,
   1,
   0
  ],
  "17": [
   1,
   0,
   0,
   1,
   1,
   0,
   1,
   1,
   1
  ]
 },
 "ics": {
  "p": 0,
  "events": 21,
  "nightStart": "20261118T230000",
  "nightEnd": "20261119T070000"
 },
 "unbal": {
  "cells": {
   "p01": {
    "2026-11-07": "D",
    "2026-11-08": "D",
    "2026-11-09": "D",
    "2026-11-10": "D",
    "2026-11-11": "D",
    "2026-11-15": "D",
    "2026-11-16": "D",
    "2026-11-17": "D",
    "2026-11-18": "N",
    "2026-11-19": "N",
    "2026-11-20": "N",
    "2026-11-23": "E",
    "2026-11-24": "N",
    "2026-11-25": "N",
    "2026-11-26": "N",
    "2026-11-28": "D",
    "2026-11-29": "D"
   },
   "p02": {
    "2026-11-02": "E",
    "2026-11-03": "E",
    "2026-11-05": "N",
    "2026-11-06": "N",
    "2026-11-09": "E",
    "2026-11-10": "E",
    "2026-11-11": "N",
    "2026-11-12": "N",
    "2026-11-14": "D",
    "2026-11-15": "N",
    "2026-11-22": "D",
    "2026-11-23": "D",
    "2026-11-24": "D",
    "2026-11-25": "D",
    "2026-11-26": "D",
    "2026-11-27": "D",
    "2026-11-29": "E"
   },
   "p03": {
    "2026-11-02": "N",
    "2026-11-05": "D",
    "2026-11-06": "E",
    "2026-11-07": "N",
    "2026-11-08": "N",
    "2026-11-10": "D",
    "2026-11-11": "E",
    "2026-11-12": "E",
    "2026-11-13": "E",
    "2026-11-14": "E",
    "2026-11-16": "E",
    "2026-11-17": "N",
    "2026-11-19": "D",
    "2026-11-20": "D",
    "2026-11-21": "D",
    "2026-11-22": "E",
    "2026-11-24": "D",
    "2026-11-25": "D",
    "2026-11-26": "D",
    "2026-11-27": "N",
    "2026-11-28": "N"
   },
   "p04": {
    "2026-11-02": "D",
    "2026-11-03": "E",
    "2026-11-04": "E",
    "2026-11-05": "E",
    "2026-11-06": "E",
    "2026-11-07": "D",
    "2026-11-08": "D",
    "2026-11-09": "D",
    "2026-11-10": "D",
    "2026-11-11": "D",
    "2026-11-12": "D",
    "2026-11-13": "N",
    "2026-11-14": "N",
    "2026-11-15": "D",
    "2026-11-16": "E",
    "2026-11-17": "E",
    "2026-11-18": "E",
    "2026-11-21": "N",
    "2026-11-22": "N",
    "2026-11-23": "N",
    "2026-11-25": "E",
    "2026-11-26": "E",
    "2026-11-28": "E",
    "2026-11-29": "N"
   },
   "p05": {
    "2026-11-02": "E",
    "2026-11-03": "N",
    "2026-11-04": "N",
    "2026-11-06": "D",
    "2026-11-07": "E",
    "2026-11-08": "E",
    "2026-11-09": "N",
    "2026-11-10": "N",
    "2026-11-13": "D",
    "2026-11-14": "D",
    "2026-11-15": "E",
    "2026-11-16": "N",
    "2026-11-18": "D",
    "2026-11-19": "E",
    "2026-11-20": "E",
    "2026-11-21": "E",
    "2026-11-23": "D",
    "2026-11-24": "E",
    "2026-11-25": "E",
    "2026-11-26": "E",
    "2026-11-27": "E"
   },
   "p06": {
    "2026-11-02": "N",
    "2026-11-04": "E",
    "2026-11-05": "E",
    "2026-11-06": "E",
    "2026-11-07": "E",
    "2026-11-08": "E",
    "2026-11-10": "D",
    "2026-11-11": "D",
    "2026-11-12": "D",
    "2026-11-13": "N",
    "2026-11-16": "N",
    "2026-11-17": "N",
    "2026-11-19": "D",
    "2026-11-20": "D",
    "2026-11-21": "E",
    "2026-11-23": "D",
    "2026-11-24": "D",
    "2026-11-25": "D",
    "2026-11-26": "N",
    "2026-11-27": "N",
    "2026-11-29": "D"
   },
   "p07": {
    "2026-11-02": "D",
    "2026-11-03": "D",
    "2026-11-04": "D",
    "2026-11-05": "D",
    "2026-11-06": "D",
    "2026-11-09": "E",
    "2026-11-10": "N",
    "2026-11-11": "N",
    "2026-11-13": "D",
    "2026-11-14": "N",
    "2026-11-15": "N",
    "2026-11-17": "E",
    "2026-11-18": "E",
    "2026-11-20": "D",
    "2026-11-21": "N",
    "2026-11-22": "N",
    "2026-11-24": "D",
    "2026-11-25": "D",
    "2026-11-26": "D",
    "2026-11-27": "D",
    "2026-11-28": "D"
   },
   "p08": {
    "2026-11-03": "E",
    "2026-11-04": "N",
    "2026-11-05": "N",
    "2026-11-07": "N",
    "2026-11-08": "N",
    "2026-11-09": "N",
    "2026-11-11": "D",
    "2026-11-12": "E",
    "2026-11-13": "E",
    "2026-11-14": "E",
    "2026-11-15": "E",
    "2026-11-16": "E",
    "2026-11-18": "E",
    "2026-11-19": "E",
    "2026-11-20": "E",
    "2026-11-23": "E",
    "2026-11-24": "N",
    "2026-11-27": "D",
    "2026-11-28": "D",
    "2026-11-29": "D"
   },
   "p09": {
    "2026-11-02": "D",
    "2026-11-03": "D",
    "2026-11-04": "D",
    "2026-11-05": "E",
    "2026-11-07": "D",
    "2026-11-08": "D",
    "2026-11-09": "D",
    "2026-11-12": "D",
    "2026-11-13": "D",
    "2026-11-14": "D",
    "2026-11-15": "D",
    "2026-11-17": "D",
    "2026-11-18": "D",
    "2026-11-19": "E",
    "2026-11-20": "E",
    "2026-11-22": "D",
    "2026-11-23": "D",
    "2026-11-24": "E",
    "2026-11-25": "E",
    "2026-11-26": "E",
    "2026-11-27": "E"
   },
   "p10": {
    "2026-11-03": "D",
    "2026-11-04": "D",
    "2026-11-05": "D",
    "2026-11-06": "D",
    "2026-11-09": "D",
    "2026-11-10": "E",
    "2026-11-11": "E",
    "2026-11-12": "E",
    "2026-11-13": "E",
    "2026-11-16": "D",
    "2026-11-17": "E",
    "2026-11-18": "N",
    "2026-11-19": "N",
    "2026-11-21": "D",
    "2026-11-22": "D",
    "2026-11-23": "N",
    "2026-11-26": "D",
    "2026-11-27": "D",
    "2026-11-28": "N",
    "2026-11-29": "N"
   },
   "p11": {
    "2026-11-04": "E",
    "2026-11-07": "D",
    "2026-11-08": "D",
    "2026-11-12": "D",
    "2026-11-13": "D",
    "2026-11-16": "D",
    "2026-11-17": "D",
    "2026-11-18": "D",
    "2026-11-19": "D",
    "2026-11-20": "D",
    "2026-11-21": "D"
   },
   "p12": {
    "2026-11-02": "E",
    "2026-11-03": "N",
    "2026-11-05": "D",
    "2026-11-06": "N",
    "2026-11-09": "E",
    "2026-11-10": "E",
    "2026-11-11": "E",
    "2026-11-12": "N",
    "2026-11-15": "D",
    "2026-11-16": "D",
    "2026-11-17": "D",
    "2026-11-18": "D",
    "2026-11-19": "D",
    "2026-11-20": "N",
    "2026-11-22": "E",
    "2026-11-23": "E",
    "2026-11-24": "E",
    "2026-11-25": "N",
    "2026-11-27": "E",
    "2026-11-28": "E",
    "2026-11-29": "E"
   }
  },
  "cost": 100,
  "by": {
   "wish": 0,
   "fair": 36,
   "weekend": 16,
   "night": 0,
   "isoWork": 1,
   "isoOff": 34,
   "split": 13
  },
  "hard": [
   "consec",
   "cover",
   "coverMax",
   "rest",
   "skill"
  ],
  "devCells": 5
 },
 "verify": [
  "sat=3000 / 3000",
  "inc=6000 / 6000",
  "maxsat=800 / 800",
  "roster=408 / 408",
  "mus=225 / 225",
  "checker=3200 / 3200",
  "props=1553 / 1553"
 ]
};

export default async ({ page, toolURL, screenshot, assert }) => {
  await page.goto(toolURL);
  await page.waitForFunction(() => document.body.getAttribute('data-sl-ready') === '1', null, { timeout: 20000 });

  const TABS = ORACLE.meta.tabs;
  const onTab = async (t) => {
    await page.click('#sl-tab-' + t);
    await page.waitForFunction((t) => SLAPP.tab() === t && !document.getElementById('pane-' + t).hidden, t);
  };
  const doneStamp = () => page.evaluate(() => document.body.getAttribute('data-sl-done') || '');
  const solve = async (sel) => {
    const b = await doneStamp();
    await page.click(sel || '#sl-solve');
    await page.waitForFunction((b) => document.body.getAttribute('data-sl-busy') === '0' && (document.body.getAttribute('data-sl-done') || '') !== b, b, { timeout: 120000 });
  };
  const st = () => page.evaluate(() => SLAPP.state());
  const disp = (sel) => page.$eval(sel, (n) => getComputedStyle(n).display);
  const cellsOf = (s) => {   // { staffId: { date: shift } } → 只留有班的格子，便于比较
    const out = {};
    for (const [k, v] of Object.entries(s.cells || {})) { const o = {}; for (const [d, x] of Object.entries(v)) if (x) o[d] = x; out[k] = o; }
    return out;
  };
  const sameCells = (a, b, ids, dates) => {
    let bad = 0;
    for (const id of ids) for (const d of dates) if (((a[id] || {})[d] || '') !== ((b[id] || {})[d] || '')) bad++;
    return bad;
  };
  const setField = async (sel, v) => { await page.fill(sel, String(v)); await page.press(sel, 'Tab'); };

  // ── 1. 加载：返回链接、示例项目、Worker ──
  const back = await page.$eval('#sl-back', (a) => [a.textContent.trim(), a.getAttribute('href')]);
  assert(back[0] === '← 返回工具集' && back[1] === '../../', `返回链接 ${back}`);
  assert(await page.evaluate(() => SLAPP.engineMode()) === 'worker', '求解在 Web Worker 里跑');
  const D = ORACLE.demo;
  assert(await page.$$eval('#sl-grid tbody tr', (r) => r.length) === D.names.length, '示例：每人一行');
  assert(await page.$$eval('#sl-grid td.sl-c', (c) => c.length) === D.names.length * D.days, `示例：${D.names.length}×${D.days} 个格子`);
  const names = await page.$$eval('#sl-grid tbody .sl-who-n', (n) => n.map((x) => x.textContent));
  assert(JSON.stringify(names) === JSON.stringify(D.names), '人员顺序与名字');
  assert(await page.$$eval('#sl-legend .sl-sh', (n) => n.length) === D.shifts.length, '图例：每个班次一枚');
  assert((await page.textContent('#sl-period')).includes(D.days + ' 天'), '周期标签');
  // 请假格画斜纹（李娜 11/16–11/20）
  const leaveCells = await page.$$eval('#sl-grid td.sl-c[data-req="leave"]', (c) => c.length);
  assert(leaveCells === D.leaveCount, `请假格 ${leaveCells} 个，应为 ${D.leaveCount}`);

  // ── 2. 公平目标 = Python 独立口径 ──
  const s0 = await page.evaluate(() => SLAPP.check().stats.map((x) => [x.tgt.lo, x.tgt.hi, x.tgtWk.lo, x.tgtWk.hi, x.tgtN.lo, x.tgtN.hi]));
  let tgtBad = 0;
  s0.forEach((t, p) => { if (t[0] !== D.tg[p][0] || t[1] !== D.tg[p][1] || t[2] !== D.tgw[p][0] || t[3] !== D.tgw[p][1] || t[4] !== D.tgn[p][0] || t[5] !== D.tgn[p][1]) tgtBad++; });
  assert(tgtBad === 0, `公平目标（班数 / 周末 / 夜班）与 Python 不一致 ${tgtBad} 人：${JSON.stringify(s0)}`);
  const firstTitle = await page.$eval('#sl-grid tbody tr:nth-child(1) td.sl-st-first', (n) => n.title);
  assert(firstTitle === '目标 ' + (D.tg[0][0] === D.tg[0][1] ? D.tg[0][0] : D.tg[0][0] + '–' + D.tg[0][1]) + ' 个班', `班数列提示 ${firstTitle}`);

  // ── 3. 确定性求解：种子 1、冲突预算 4 万 → 与离线同一张班表；Python 核过 0 违规、分数一致 ──
  await onTab('rules');
  await setField('#sl-conf', ORACLE.demo40k.conflicts);
  await setField('#sl-seed', 1);
  await onTab('roster');
  await page.selectOption('#sl-budget', '60');
  assert(await disp('#sl-stop') === 'none', '空闲时「停止」按钮藏住（计算样式）');
  const busyStop = page.waitForFunction(() => document.body.getAttribute('data-sl-busy') === '1' && getComputedStyle(document.getElementById('sl-stop')).display !== 'none', null, { timeout: 10000 });
  const solving = solve();
  busyStop.catch(() => {}); solving.catch(() => {});   // 先挂上处理器：后面断言失败时它们不会变成悬空拒绝
  await busyStop;
  assert(await page.$eval('#sl-solve', (b) => b.disabled), '求解中「自动排班」禁用');
  await solving;
  let s = await st();
  assert(s.res.status === ORACLE.demo40k.status, `状态 ${s.res.status}`);
  assert(s.res.cost === ORACLE.demo40k.cost, `分数 ${s.res.cost}，离线 ${ORACLE.demo40k.cost}（Python 重算 ${ORACLE.demo40k.pyCost}）`);
  const mism = sameCells(cellsOf(s), ORACLE.demo40k.cells, ORACLE.demo40k.ids, ORACLE.demo40k.dates);
  assert(mism === 0, `与离线同参数班表逐格不同 ${mism} 格`);
  assert(await page.textContent('#sl-k-cost') === String(ORACLE.demo40k.cost), '概况卡显示分数');
  assert((await page.textContent('#sl-st-t')) === (ORACLE.demo40k.status === 'optimal' ? '已证明最优' : '已找到'), '状态标题');
  const byShown = await page.$$eval('#sl-by dd[data-kind]', (d) => Object.fromEntries(d.map((x) => [x.getAttribute('data-kind'), +x.textContent])));
  for (const [k, v] of Object.entries(ORACLE.demo40k.by)) assert(byShown[k] === v, `扣分明细 ${k}=${byShown[k]}，Python ${v}`);
  assert(+(await page.textContent('#sl-by-total')) === ORACLE.demo40k.pyCost, '合计 = Python 重算的总分');
  assert(!(await page.isHidden('#sl-hard-ok')) && (await page.textContent('#sl-hard-ok')).startsWith('全部硬规则都满足'), '合规核对：全部满足');
  const covBad = await page.$$eval('#sl-grid tfoot td[data-cv]', (t) => t.filter((x) => x.getAttribute('data-cv') !== 'ok').length);
  assert(covBad === 0, `覆盖行有 ${covBad} 格缺人或超编`);
  assert(await page.textContent('#sl-k-cover') === ORACLE.demo40k.cover, `需求覆盖 ${await page.textContent('#sl-k-cover')}`);
  assert(await page.textContent('#sl-k-wish') === ORACLE.demo40k.wish, `心愿满足 ${await page.textContent('#sl-k-wish')}`);
  // 优化曲线：点数 = 改进次数，确实是下降的
  const tr = await page.evaluate(() => SLAPP.trace());
  assert(tr.length >= 3 && tr.every((q, i) => !i || q.cost < tr[i - 1].cost), `优化轨迹应严格下降：${tr.map((q) => q.cost).join('→')}`);
  assert(+(await page.getAttribute('#sl-conv', 'data-points')) === tr.length, '曲线点数 = 轨迹长度');
  assert(await page.$$eval('#sl-conv path', (p) => p.length) >= 1, '曲线已画出');
  // 几何：每个班次徽标都落在自己的格子里；1280 宽下表格不横向滚动
  const esc = await page.$$eval('#sl-grid td.sl-c', (cs) => cs.filter((c) => {
    const sh = c.querySelector('.sl-sh'); if (!sh) return false;
    const a = c.getBoundingClientRect(), b = sh.getBoundingClientRect();
    return b.left < a.left - 1 || b.right > a.right + 1 || b.top < a.top - 1 || b.bottom > a.bottom + 1;
  }).length);
  assert(esc === 0, `${esc} 个班次徽标越出格子`);
  const fit = await page.$eval('#sl-grid-wrap', (w) => w.scrollWidth - w.clientWidth);
  assert(fit <= 1, `1280 宽下班表横向溢出 ${fit}px`);
  const covFit = await page.$$eval('#sl-grid tfoot td[data-cv]', (t) => t.filter((x) => x.scrollWidth > x.clientWidth + 1).length);
  assert(covFit === 0, '覆盖行数字没被截断');
  // 手机宽度：班表在卡片里横向滚得到最后一列，姓名列吸附在左边（卡片 overflow:hidden 会把「滚不动」藏起来，页面级溢出守卫看不见）
  await page.setViewportSize({ width: 390, height: 850 });
  const sc = await page.$eval('#sl-grid-wrap', (w) => {
    w.scrollLeft = w.scrollWidth;
    const wr = w.getBoundingClientRect(), last = w.querySelector('tbody tr:first-child td:last-child').getBoundingClientRect();
    const nm = w.querySelector('tbody tr:first-child th.sl-nm').getBoundingClientRect();
    const r = { scrolled: w.scrollLeft, over: w.scrollWidth - w.clientWidth, lastIn: last.right <= wr.right + 1 && last.left >= wr.left - 1, stick: Math.abs(nm.left - wr.left) <= 1 };
    w.scrollLeft = 0;
    return r;
  });
  assert(sc.over > 0 && sc.scrolled > 0 && sc.lastIn && sc.stick, `390 宽：班表可横向滚到最后一列且姓名列吸附 ${JSON.stringify(sc)}`);
  await page.setViewportSize({ width: 1280, height: 850 });

  // ── 4. 键盘：方向键移动、数字锁定、0 锁休、W 想休、Delete 清除；锁定后违反哪些硬规则 = Python 校验 ──
  const K = ORACLE.keys;
  const hardTypes = async () => (await page.evaluate(() => SLAPP.check().hard)).filter((v, i, a) => a.indexOf(v) === i).sort();
  const cellSel = `#sl-grid td.sl-c[data-p="1"][data-d="${K.d}"]`;
  await page.focus('#sl-grid td.sl-c[data-p="0"][data-d="0"]');
  await page.keyboard.press('ArrowDown');
  for (let i = 0; i < K.d; i++) await page.keyboard.press('ArrowRight');
  const focused = await page.evaluate(() => [document.activeElement.getAttribute('data-p'), document.activeElement.getAttribute('data-d'), document.activeElement.getAttribute('tabindex')]);
  assert(focused.join(',') === `1,${K.d},0`, `方向键后焦点 ${focused}`);
  await page.keyboard.press('3');
  await page.waitForFunction((sel) => document.querySelector(sel).getAttribute('data-v') === 'N', cellSel);
  s = await st();
  let rq = s.pj.requests.filter((r) => r.staff === K.staff1 && r.date === K.dateD);
  assert(rq.length === 1 && rq[0].kind === 'lock' && rq[0].shift === 'N', `按 3 = 锁定夜班：${JSON.stringify(rq)}`);
  assert(await page.$$eval(cellSel + ' .sl-mk[data-k="lock"]', (m) => m.length) === 1, '锁定角标');
  assert((await page.textContent('#sl-st-t')) === '已手动修改', '改格子后状态 = 已手动修改');
  assert(JSON.stringify(await hardTypes()) === JSON.stringify(K.hardLockN), `锁成夜班后违反 ${await hardTypes()}，Python ${K.hardLockN}`);
  await page.keyboard.press('Delete');
  await page.waitForFunction((sel) => !document.querySelector(sel + ' .sl-mk'), cellSel);
  s = await st();
  assert(s.pj.requests.filter((r) => r.staff === K.staff1 && r.date === K.dateD).length === 0, 'Delete 清除');
  await page.keyboard.press('w');
  await page.waitForFunction((sel) => document.querySelector(sel).getAttribute('data-req') === 'off', cellSel);
  await page.keyboard.press('Delete');
  await page.waitForFunction((sel) => !document.querySelector(sel).getAttribute('data-req'), cellSel);
  await page.keyboard.press('0');
  await page.waitForFunction((sel) => document.querySelector(sel).getAttribute('data-v') === '', cellSel);
  const hl = await hardTypes();
  assert(JSON.stringify(hl) === JSON.stringify(K.hardLockOff), `锁休后违反 ${hl}，Python ${K.hardLockOff}`);
  assert(hl.includes('cover') && await page.isHidden('#sl-hard-ok') && await page.$$eval('#sl-hard li[data-type="cover"]', (l) => l.length) >= 1, '合规核对列出缺人');
  const covShort = await page.$$eval(`#sl-grid tfoot td[data-cv="short"][data-d="${K.d}"]`, (t) => t.length);
  assert(covShort >= 1, '覆盖行把缺人的那格标红');
  // 继续优化：硬约束不满足 ⇒ 改为重新排，但锁定必须守住
  await solve('#sl-more');
  s = await st();
  assert(s.res.status === 'feasible' || s.res.status === 'optimal', '重新排班有解');
  assert(!((s.cells[K.staff1] || {})[K.dateD]), '锁定休息那格没被排班');
  assert((await page.evaluate(() => SLAPP.check().ok)), '重新排班后全部硬规则满足');

  // ── 5. 菜单：点格子打开、想休（这格正排着班 ⇒ 角标标成未满足）、Esc 关闭并把焦点还给格子 ──
  const d5 = +(await page.$$eval('#sl-grid td.sl-c[data-p="2"]', (cs) => cs.find((c) => +c.getAttribute('data-d') >= 3 && c.getAttribute('data-v') && !c.getAttribute('data-req')).getAttribute('data-d')));
  const c5 = `#sl-grid td.sl-c[data-p="2"][data-d="${d5}"]`, date5 = ORACLE.demo40k.dates[d5];
  await page.click(c5);
  await page.waitForFunction(() => getComputedStyle(document.getElementById('sl-menu')).display !== 'none');
  assert((await page.textContent('#sl-menu h4')).startsWith(D.names[2]), '菜单标题是这个人');
  const mi = await page.$$eval('#sl-menu .sl-mi', (b) => b.map((x) => x.getAttribute('data-act')));
  assert(mi.includes('lock:D') && mi.includes('lock:') && mi.includes('off') && mi.includes('on:N') && mi.includes('leave') && mi.includes('clear'), `菜单项 ${mi}`);
  await page.click('#sl-menu .sl-mi[data-act="off"]');
  await page.waitForFunction(() => getComputedStyle(document.getElementById('sl-menu')).display === 'none');
  s = await st();
  assert(s.pj.requests.some((r) => r.staff === K.staff2 && r.date === date5 && r.kind === 'off'), '菜单：想休已记录');
  assert(await page.$eval(c5 + ' .sl-mk[data-k="off"]', (m) => m.getAttribute('data-miss')) === '1', '排着班的「想休」角标标成未满足');
  assert((await page.getAttribute(c5, 'aria-label')).endsWith('想休（未满足）'), '读屏文字带「未满足」');
  await page.click(c5);
  await page.waitForFunction(() => getComputedStyle(document.getElementById('sl-menu')).display !== 'none');
  assert(await page.$eval('#sl-menu .sl-mi[data-act="off"]', (b) => b.getAttribute('aria-pressed')) === 'true', '当前心愿按钮呈按下态');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => getComputedStyle(document.getElementById('sl-menu')).display === 'none');
  assert(await page.evaluate(() => document.activeElement.getAttribute('data-p') + ',' + document.activeElement.getAttribute('data-d')) === '2,' + d5, 'Esc 后焦点回到格子');

  // ── 6. 页签键盘导航 ──
  await page.focus('#sl-tab-roster');
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => SLAPP.tab() === 'team');
  assert(await page.evaluate(() => document.activeElement.id) === 'sl-tab-team', '→ 键切到下一个页签并聚焦');
  assert(await disp('#pane-roster') === 'none' && await disp('#pane-team') !== 'none', '面板显隐（计算样式）');
  await page.keyboard.press('End');
  await page.waitForFunction(() => SLAPP.tab() === 'about');
  await page.keyboard.press('Home');
  await page.waitForFunction(() => SLAPP.tab() === 'roster');

  // ── 7. 改 FTE → 公平目标按 Python 口径重算 ──
  await onTab('team');
  const F = ORACLE.fteChange;
  await setField(`#sl-staff-tbl tr[data-p="${F.p}"] input[data-f="fte"]`, F.fte);
  await page.waitForFunction((F) => SLAPP.state().pj.staff[F.p].fte === F.fte, F);
  const t2 = await page.evaluate(() => SLAPP.check().stats.map((x) => [x.tgt.lo, x.tgt.hi]));
  assert(JSON.stringify(t2) === JSON.stringify(F.tg), `改 FTE 后班数目标 ${JSON.stringify(t2)}，Python ${JSON.stringify(F.tg)}`);
  await setField(`#sl-staff-tbl tr[data-p="${F.p}"] input[data-f="fte"]`, F.fte0);

  // ── 8. 最短间隔 → 禁止相接矩阵 = Python ──
  await onTab('rules');
  const fx = async () => page.$$eval('#sl-fx .sl-fx-row[data-from] .sl-fx-c', (c) => c.map((x) => +x.getAttribute('data-f')));
  assert(JSON.stringify(await fx()) === JSON.stringify(ORACLE.forb[11]), `间隔 11 小时矩阵 ${await fx()}`);
  await setField('#sl-r-rest', 17);
  await page.waitForFunction((m) => JSON.stringify(Array.from(document.querySelectorAll('#sl-fx .sl-fx-row[data-from] .sl-fx-c')).map((x) => +x.getAttribute('data-f'))) === JSON.stringify(m), ORACLE.forb[17]);
  await setField('#sl-r-rest', 11);
  assert(JSON.stringify(await fx()) === JSON.stringify(ORACLE.forb[11]), '改回 11 小时');

  // ── 9. 小例子：证明最优 = CP-SAT 最优；CSV 导出逐格对 ──
  await onTab('roster');
  await page.click('#sl-small');
  await page.waitForFunction(() => document.querySelectorAll('#sl-grid td.sl-c').length === 35);
  assert((await page.textContent('#sl-st-d')).includes('已载入'), '载入小例子');
  await solve();
  s = await st();
  const SM = ORACLE.small;
  assert(s.res.status === 'optimal', `小例子应证明最优，实得 ${s.res.status}`);
  assert(s.res.cost === SM.cpsat, `小例子最优值 ${s.res.cost}，CP-SAT ${SM.cpsat}`);
  assert(sameCells(cellsOf(s), SM.cells, SM.ids, SM.dates) === 0, '小例子班表与离线同参数一致');
  assert((await page.textContent('#sl-st-t')) === '已证明最优' && (await page.textContent('#sl-k-cost2')) === '已证明是最低分', '状态：已证明最优');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#sl-csv')]);
  const csv = fs.readFileSync(await dl.path(), 'utf8');
  assert(csv.charCodeAt(0) === 0xfeff, 'CSV 带 BOM（Excel 认 UTF-8）');
  const rows = csv.slice(1).trim().split('\r\n').map((l) => l.split(','));
  assert(JSON.stringify(rows) === JSON.stringify(SM.csv), `CSV 内容\n${JSON.stringify(rows)}\n应为\n${JSON.stringify(SM.csv)}`);

  // ── 10. 无解 → 自动诊断 → 最小冲突集（CP-SAT 证明无解且最小）→ 放宽 → 有解 ──
  const I = ORACLE.infeas;
  for (const c of I.leaves) {
    await page.focus(`#sl-grid td.sl-c[data-p="${c[0]}"][data-d="${c[1]}"]`);
    await page.keyboard.press('L');
    await page.waitForFunction((c) => document.querySelector(`#sl-grid td.sl-c[data-p="${c[0]}"][data-d="${c[1]}"]`).getAttribute('data-req') === 'leave', c);
  }
  await solve();
  s = await st();
  assert(s.res.status === 'infeasible', `请假后应无解，实得 ${s.res.status}`);
  assert((await page.textContent('#sl-st-t')) === '无解' && await disp('#sl-goto-diag') !== 'none', '状态无解 + 「查看冲突」按钮');
  await page.waitForFunction(() => document.body.getAttribute('data-sl-diag') === 'infeasible', null, { timeout: 60000 });
  await page.click('#sl-goto-diag');
  await page.waitForFunction(() => SLAPP.tab() === 'diag');
  const mus = await page.$$eval('#sl-mus li', (l) => l.map((x) => x.querySelector('.sl-mus-t').textContent));
  assert(JSON.stringify(mus.slice().sort()) === JSON.stringify(I.mus.slice().sort()), `最小冲突集 ${JSON.stringify(mus)}，应为 ${JSON.stringify(I.mus)}（CP-SAT：整组无解 ${I.cpInfeasible}、逐条删去有解 ${I.cpMinimal}）`);
  assert((await page.textContent('#sl-tab-diag')) === '冲突诊断 · ' + I.mus.length, '页签带冲突条数');
  assert((await page.textContent('#sl-mus-sub')).includes('最小的一组'), '注明已证明最小');
  const supLv = async (lv) => page.$$eval(`#sl-sup td[data-lv="${lv}"]`, (t) => t.map((x) => x.getAttribute('data-d') + ':' + x.getAttribute('data-s')));
  assert(JSON.stringify(await supLv(2)) === JSON.stringify(I.supplyRed), `供需体检红格 ${await supLv(2)}，应为 ${I.supplyRed}`);
  assert(JSON.stringify(await supLv(1)) === JSON.stringify(I.supplyAmber), `供需体检黄格 ${await supLv(1)}，应为 ${I.supplyAmber}`);
  const relaxIdx = mus.indexOf(I.relax);
  assert(relaxIdx >= 0, '冲突集里有要放宽的那条');
  await page.click(`#sl-mus button[data-relax="${relaxIdx}"]`);
  await page.waitForFunction(() => document.body.getAttribute('data-sl-diag') === 'feasible', null, { timeout: 60000 });
  assert((await page.textContent('#sl-mus-sub')).startsWith('当前设置没有冲突'), '放宽后诊断：没有冲突');
  await onTab('roster');
  await solve();
  s = await st();
  assert(s.res.status === 'optimal' && s.res.cost === I.relaxedCpsat, `放宽后最优 ${s.res.status} ${s.res.cost}，CP-SAT ${I.relaxedCpsat}`);

  // ── 11. 权重全 0 ⇒ 0 分且已证明最优 ──
  await onTab('rules');
  for (const w of ['wish', 'fair', 'weekend', 'night', 'isoWork', 'isoOff', 'split']) await setField('#sl-w-' + w, 0);
  await onTab('roster');
  await solve();
  s = await st();
  assert(s.res.status === 'optimal' && s.res.cost === 0, `权重全 0：${s.res.status} ${s.res.cost}`);

  // ── 12. 导入 JSON（示例 + 离线班表）→ 个人日历 .ics：跨夜班结束在次日 ──
  await page.setInputFiles('#sl-import', { name: 'demo.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ format: 'shift-lab', v: 1, pj: ORACLE.demoProject, cells: ORACLE.demo40k.cells })) });
  await page.waitForFunction((n) => document.querySelectorAll('#sl-grid td.sl-c').length === n, D.names.length * D.days);
  s = await st();
  assert(sameCells(cellsOf(s), ORACLE.demo40k.cells, ORACLE.demo40k.ids, ORACLE.demo40k.dates) === 0, '导入后班表逐格一致');
  assert((await page.textContent('#sl-st-t')) === '已导入', '导入后状态 = 已导入');
  assert(+(await page.textContent('#sl-k-cost')) === ORACLE.demo40k.pyCost, '导入后分数 = Python 重算');
  const C = ORACLE.ics;
  await page.selectOption('#sl-ics-who', String(C.p));
  const [dl2] = await Promise.all([page.waitForEvent('download'), page.click('#sl-ics')]);
  const ics = fs.readFileSync(await dl2.path(), 'utf8');
  assert((ics.match(/BEGIN:VEVENT/g) || []).length === C.events, `日历事件 ${(ics.match(/BEGIN:VEVENT/g) || []).length}，应为 ${C.events}`);
  assert(ics.includes('DTSTART:' + C.nightStart + '\r\nDTEND:' + C.nightEnd), `夜班 ${C.nightStart} → ${C.nightEnd}`);
  assert(ics.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0') && ics.trim().endsWith('END:VCALENDAR'), 'iCalendar 外壳');

  // ── 12b. 导入一张故意失衡的班表：扣分（凸罚）与违规类型 = Python 校验 ──
  const UB = ORACLE.unbal;
  await page.setInputFiles('#sl-import', { name: 'unbal.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ pj: ORACLE.demoProject, cells: UB.cells })) });
  await page.waitForFunction((n) => +document.getElementById('sl-by-total').textContent === n, UB.cost, { timeout: 10000 }).catch(() => {});
  const byU = await page.$$eval('#sl-by dd[data-kind]', (d) => Object.fromEntries(d.map((x) => [x.getAttribute('data-kind'), +x.textContent])));
  for (const [k, v] of Object.entries(UB.by)) assert(byU[k] === v, `失衡班表 ${k}=${byU[k]}，Python ${v}`);
  assert(+(await page.textContent('#sl-by-total')) === UB.cost, `失衡班表总分 = Python ${UB.cost}`);
  const hu = (await page.evaluate(() => SLAPP.check().hard)).filter((v, i, a) => a.indexOf(v) === i).sort();
  assert(JSON.stringify(hu) === JSON.stringify(UB.hard), `失衡班表违规类型 ${hu}，Python ${UB.hard}`);
  const devCells = await page.$$eval('#sl-grid tbody td.sl-st[data-dev="1"]', (t) => t.length);
  assert(devCells === UB.devCells, `偏离目标的统计格 ${devCells}，Python ${UB.devCells}`);
  await page.setInputFiles('#sl-import', { name: 'demo.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ pj: ORACLE.demoProject, cells: ORACLE.demo40k.cells })) });
  await page.waitForFunction((n) => +document.getElementById('sl-by-total').textContent === n, ORACLE.demo40k.pyCost);

  // ── 13. 刷新后从本地存档恢复 ──
  const before = cellsOf(await st());
  await page.reload();
  await page.waitForFunction(() => document.body.getAttribute('data-sl-ready') === '1');
  assert(sameCells(cellsOf(await st()), before, ORACLE.demo40k.ids, ORACLE.demo40k.dates) === 0, '刷新后班表还在');
  assert(await page.$$eval('#sl-grid td.sl-c', (c) => c.length) === D.names.length * D.days, '刷新后网格还在');
  assert((await page.textContent('#sl-st-t')) === '已导入', '刷新后状态仍是「已导入」');

  // ── 14. 原理页的对拍数字 = 离线套件实测 ──
  await onTab('about');
  const ver = await page.$$eval('#sl-ver li', (l) => l.map((x) => x.getAttribute('data-k') + '=' + x.querySelector('b').textContent));
  assert(JSON.stringify(ver) === JSON.stringify(ORACLE.verify), `对拍清单 ${JSON.stringify(ver)}`);

  // ── 15. 渲染守卫（逐页签：[hidden] / 控件尺寸 / uppercase / 390·768 溢出 / 卡片逃逸 / 图上文字 / id 唯一）──
  const n = await renderGuards(page, {
    assert, tabs: TABS, onTab,
    paneSel: (t) => `#pane-${t}`, panesRoot: '#sl-panes',
    figSel: (t) => `#pane-${t} svg.sl-conv`, cardSel: '.sl-card, .sl-mock',
    childSel: 'h2, dl, .sl-tw, .sl-sup-wrap, .sl-grid-wrap, .sl-exp, .sl-fx, ul, ol',
    minControls: 60, minTextsInFig: 6,
  });
  assert(n >= 60, `控件扫描 ${n}`);

  // ── 16. 缩略图：重新排一次示例（同样的种子与预算 ⇒ 与第 3 步同一张表），截工具条 + 状态 + 班表 ──
  await onTab('roster');
  await page.selectOption('#sl-budget', '60');
  await solve();
  s = await st();
  assert(s.res.cost === ORACLE.demo40k.cost && sameCells(cellsOf(s), ORACLE.demo40k.cells, ORACLE.demo40k.ids, ORACLE.demo40k.dates) === 0, '再次排班结果不变（确定性）');
  await page.evaluate(() => { const b = document.querySelector('.sl-bar').getBoundingClientRect(); window.scrollTo(0, window.scrollY + b.top - 80); });
  await page.waitForFunction(() => window.scrollY > 100);
  await screenshot('thumb.png');
};
