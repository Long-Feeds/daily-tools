// 诗词格律工作台 · Prosody Lab 集成测试
// 真值（ORACLE）由 run 目录 truth/truth_gen.py 机械生成、经 inject-oracle.mjs 注入，不手抄：
//   look  —《佩文诗韵释要》原表（hantang 转录，逐韵字数与原书 10306 一致）+ OpenCC，页面读音须为其超集
//   shi   — Python 按王力四句型 + 粘对独立排格律、用单读常用字造诗，再定点改坏（失粘 / 失对 / 孤平 / 三平尾 / 出韵 / 大拗 / 特拗…），期望由构造决定
//   ci    — 按龙谱逐位填字造词，期望 0 错；改一位平仄，期望恰好该位报错
//   gen   — 王力《诗词格律》近体四式；rb / psyChars — Python 独立重算的字表计数
//   self  — 离线套件（node:vm 从成品抠引擎）实测的例词自检数，页面在「说明」页现场复算，两边对拍
// 名篇的期望（春望合律、登高押灰韵、清明首句借邻韵、静夜思是古绝…）是诗律学通行结论，逐条注明。
import { renderGuards, guardBoxOverlap, guardControlSize } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'
import fs from 'node:fs'

const ORACLE = {
 "look": {
  "看": [
   "上平十四寒",
   "去声十五翰"
  ],
  "思": [
   "上平四支",
   "去声四寘"
  ],
  "胜": [
   "下平十蒸",
   "去声二十五径"
  ],
  "花": [
   "下平六麻"
  ],
  "东": [
   "上平一东"
  ],
  "月": [
   "入声六月"
  ],
  "一": [
   "入声四质"
  ],
  "行": [
   "下平七阳",
   "下平八庚",
   "去声二十三漾",
   "去声二十四敬"
  ],
  "重": [
   "上声二肿",
   "上平二冬",
   "去声二宋"
  ],
  "长": [
   "上声二十二养",
   "下平七阳",
   "去声二十三漾"
  ],
  "教": [
   "下平三肴",
   "去声十九效"
  ],
  "听": [
   "上声十二吻",
   "下平九青",
   "去声二十五径"
  ],
  "望": [
   "下平七阳",
   "去声二十三漾"
  ],
  "忘": [
   "下平七阳",
   "去声二十三漾"
  ],
  "醒": [
   "上声二十四迥",
   "下平九青",
   "去声二十五径"
  ],
  "过": [
   "下平五歌",
   "去声二十一个"
  ],
  "回": [
   "上平十灰",
   "去声十一队"
  ],
  "雁": [
   "去声十六谏"
  ],
  "留": [
   "下平十一尤",
   "去声二十六宥"
  ],
  "啼": [
   "上平八齐"
  ]
 },
 "fallback": {
  "间": [
   "上平十五删",
   "去声十六谏"
  ],
  "这": [
   "去声十七霰"
  ],
  "们": [
   "上平十三元"
  ]
 },
 "look_src": "《佩文诗韵释要》原表（hantang 转录，逐韵字数与原书 10306 一致）+ OpenCC t2s；页面读音须为其超集",
 "pool_n": {
  "ping": 446,
  "ze": 505
 },
 "shi": [
  {
   "name": "perfect-5-8-仄-noru",
   "text": "鼓代均斜展，\n俱今角草危。\n晴金侯甲仲，\n渺髻限蛾悲。\n候戴鬟余籍，\n刀兮尺翅池。\n田恩堪住曳，\n案歇黛停奇。",
   "types": [
    "甲",
    "乙",
    "丙",
    "丁",
    "甲",
    "乙",
    "丙",
    "丁"
   ],
   "exp": {
    "verdict": "ok",
    "errCells": [],
    "notes": [],
    "form": null,
    "summary": "五言律诗 · 仄起首句不入韵 · 平水韵上平四支韵"
   }
  },
  {
   "name": "perfect-5-8-平-noru",
   "text": "牙公天起者，\n速雅及胡郎。\n帽茂篇阿酌，\n林魂落偶裳。\n朝春勤渺感，\n戍寞史冰煌。\n萼利琴瓜妒，\n蓬巴品秉棠。",
   "types": [
    "丙",
    "丁",
    "甲",
    "乙",
    "丙",
    "丁",
    "甲",
    "乙"
   ],
   "exp": {
    "verdict": "ok",
    "errCells": [],
    "notes": [],
    "form": null,
    "summary": "五言律诗 · 平起首句不入韵 · 平水韵下平七阳韵"
   }
  },
  {
   "name": "perfect-7-8-平-ru",
   "text": "裴攀草座各偷途，\n妙退衰疑漾剩殊。\n乞二村余欺及念，\n遭仙怯姓寄形徒。\n胸堪玉每餐帘偶，\n似省青稽土服湖。\n以福毫梁投境孝，\n卑棠殿定血春姑。",
   "types": [
    "丁",
    "乙",
    "丙",
    "丁",
    "甲",
    "乙",
    "丙",
    "丁"
   ],
   "exp": {
    "verdict": "ok",
    "errCells": [],
    "notes": [],
    "form": null,
    "summary": "七言律诗 · 平起首句入韵 · 平水韵上平七虞韵"
   }
  },
  {
   "name": "perfect-7-8-仄-ru",
   "text": "避鬼端碑貌魏幽，\n蛟旬石慢梵餐洲。\n侵田邑困追麟入，\n侍佛勤臣竟曰抽。\n臂幸竿琴稀印室，\n寰滋自背座朱愁。\n夷芳遇磬喧精指，\n郡渭宵春土尚流。",
   "types": [
    "乙",
    "丁",
    "甲",
    "乙",
    "丙",
    "丁",
    "甲",
    "乙"
   ],
   "exp": {
    "verdict": "ok",
    "errCells": [],
    "notes": [],
    "form": null,
    "summary": "七言律诗 · 仄起首句入韵 · 平水韵下平十一尤韵"
   }
  },
  {
   "name": "perfect-5-4-平-ru",
   "text": "蕉岑次柏千，\n逼旦社蜂娟。\n畔校雄芙宦，\n荒秦字怕前。",
   "types": [
    "乙",
    "丁",
    "甲",
    "乙"
   ],
   "exp": {
    "verdict": "ok",
    "errCells": [],
    "notes": [],
    "form": null,
    "summary": "五言绝句 · 平起首句入韵 · 平水韵下平一先韵"
   }
  },
  {
   "name": "perfect-7-4-仄-noru",
   "text": "刻弱酬冬邀用寺，\n旬良鬼媚秀哀夷。\n惆煌可屋精貂社，\n曳仲凡巢士腹肌。",
   "types": [
    "丙",
    "丁",
    "甲",
    "乙"
   ],
   "exp": {
    "verdict": "ok",
    "errCells": [],
    "notes": [],
    "form": null,
    "summary": "七言绝句 · 仄起首句不入韵 · 平水韵上平四支韵"
   }
  },
  {
   "name": "perfect-5-12-仄-noru",
   "text": "破宅欺威丈，\n憔辰也穴商。\n峰初柔幸渭，\n水附恰莎康。\n拜甲梳稀入，\n呈支漏列郎。\n洲余凡百酒，\n戒勿是消娘。\n剩戴多端杜，\n池薰榭束方。\n名兵朱哭佐，\n席拂欲天昌。",
   "types": [
    "甲",
    "乙",
    "丙",
    "丁",
    "甲",
    "乙",
    "丙",
    "丁",
    "甲",
    "乙",
    "丙",
    "丁"
   ],
   "exp": {
    "verdict": "ok",
    "errCells": [],
    "notes": [],
    "form": null,
    "summary": "五言排律（6韵） · 仄起首句不入韵 · 平水韵下平七阳韵"
   }
  },
  {
   "name": "perfect-7-6-平-ru",
   "text": "廊多藻臂己恩姑，\n耳歇文牛劫佐朱。\n媚雪徊才枝履菊，\n嵩梳理世苑筵都。\n投戎府稻州初值，\n庾簇哀韶窈味衢。",
   "types": [
    "丁",
    "乙",
    "丙",
    "丁",
    "甲",
    "乙"
   ],
   "exp": {
    "verdict": "ok",
    "errCells": [],
    "notes": [],
    "form": null,
    "summary": "七言六句（三韵小律） · 平起首句入韵 · 平水韵上平七虞韵"
   }
  },
  {
   "name": "shinian",
   "text": "紫管名科等，\n晨兵快表悲。\n爽友翔廊黛，\n煌宜博惹姿。\n昌灰期葛院，\n祝政篆恩疑。\n物夕袍瓜可，\n延招墨簇奇。",
   "types": [
    "甲",
    "乙",
    "丙",
    "丁",
    "甲",
    "乙",
    "丙",
    "丁"
   ],
   "exp": {
    "verdict": "err",
    "errCells": [
     [
      2,
      1
     ]
    ],
    "notes": [
     [
      2,
      "失粘"
     ]
    ],
    "form": null,
    "summary": "五言律诗 · 仄起首句不入韵 · 平水韵上平四支韵"
   }
  },
  {
   "name": "shidui",
   "text": "木窈酬嫌晚，\n苔甘五劫棠。\n娟迢仁孝屈，\n形侵幸郭昌。\n黄延秋渭四，\n蝶魏退岐狼。\n季滴禽心整，\n扶喧汝架堂。",
   "types": [
    "甲",
    "乙",
    "丙",
    "丁",
    "甲",
    "乙",
    "丙",
    "丁"
   ],
   "exp": {
    "verdict": "err",
    "errCells": [
     [
      3,
      1
     ]
    ],
    "notes": [
     [
      3,
      "失对"
     ]
    ],
    "form": null,
    "summary": "五言律诗 · 仄起首句不入韵 · 平水韵下平七阳韵"
   }
  },
  {
   "name": "guping",
   "text": "赴映童悲篆，\n尺蛾浩玉夫。\n盈村眠死冉，\n哭助葛荆芙。\n宅色惟阿意，\n追偷乞染呼。\n埋根梅泣友，\n露犬退咸扶。",
   "types": [
    "甲",
    "乙",
    "丙",
    "丁",
    "甲",
    "乙",
    "丙",
    "丁"
   ],
   "exp": {
    "verdict": "err",
    "errCells": [
     [
      1,
      0
     ],
     [
      1,
      2
     ]
    ],
    "notes": [
     [
      1,
      "犯孤平"
     ]
    ],
    "form": null,
    "summary": "五言律诗 · 仄起首句不入韵 · 平水韵上平七虞韵"
   }
  },
  {
   "name": "zijiu",
   "text": "石列霏良眷，\n影延梯灞周。\n工猨巢典蝶，\n橘返系潭裘。\n杳火班扉紫，\n兄肌姓保洲。\n谿成墀制佛，\n往蕙曰迢舟。",
   "types": [
    "甲",
    "乙",
    "丙",
    "丁",
    "甲",
    "乙",
    "丙",
    "丁"
   ],
   "exp": {
    "verdict": "ok",
    "errCells": [],
    "notes": [
     [
      1,
      "孤平拗救"
     ]
    ],
    "form": null,
    "summary": "五言律诗 · 仄起首句不入韵 · 平水韵下平十一尤韵"
   }
  },
  {
   "name": "sanping",
   "text": "悟底猨林拜，\n官摧特主娟。\n同欣泠衮命，\n固典娘裙田。\n渡熟貂帘恣，\n冬常舜菊全。\n芝姑青惹用，\n季匣晚咸然。",
   "types": [
    "甲",
    "乙",
    "丙",
    "丁",
    "甲",
    "乙",
    "丙",
    "丁"
   ],
   "exp": {
    "verdict": "err",
    "errCells": [
     [
      3,
      2
     ]
    ],
    "notes": [
     [
      3,
      "三平尾"
     ]
    ],
    "form": null,
    "summary": "五言律诗 · 仄起首句不入韵 · 平水韵下平一先韵"
   }
  },
  {
   "name": "chuyun",
   "text": "袂耀常徒冉，\n弦符表玉姬。\n阿生胡竹法，\n舞戒黑戈支。\n阻悟坤波附，\n昏曹草渚香。\n裘梢林秀起，\n梵乳郡筵芝。",
   "types": [
    "甲",
    "乙",
    "丙",
    "丁",
    "甲",
    "乙",
    "丙",
    "丁"
   ],
   "exp": {
    "verdict": "err",
    "errCells": [
     [
      5,
      4
     ]
    ],
    "notes": [
     [
      5,
      "出韵"
     ]
    ],
    "form": null,
    "summary": "五言律诗 · 仄起首句不入韵 · 平水韵上平四支韵"
   }
  },
  {
   "name": "dajiu",
   "text": "稻隔墀展舜，\n名迢元恰裳。\n京萋周黍舞，\n世乃篆前祥。\n按蘂音酣性，\n排移者早方。\n升崔邦健恨，\n老茂遇幽常。",
   "types": [
    "甲",
    "乙",
    "丙",
    "丁",
    "甲",
    "乙",
    "丙",
    "丁"
   ],
   "exp": {
    "verdict": "ok",
    "errCells": [],
    "notes": [
     [
      0,
      "大拗，对句已救"
     ]
    ],
    "form": null,
    "jiu": [
     [
      1,
      2
     ]
    ],
    "summary": "五言律诗 · 仄起首句不入韵 · 平水韵下平七阳韵"
   }
  },
  {
   "name": "daao",
   "text": "永利垣犬把，\n勤材序映徒。\n城民江耿局，\n酌制井舟巫。\n臂屋刀峰午，\n臣功每白殊。\n弦霜商隔表，\n到鬼性廊蒲。",
   "types": [
    "甲",
    "乙",
    "丙",
    "丁",
    "甲",
    "乙",
    "丙",
    "丁"
   ],
   "exp": {
    "verdict": "err",
    "errCells": [
     [
      0,
      3
     ]
    ],
    "notes": [
     [
      0,
      "大拗未救"
     ]
    ],
    "form": null,
    "summary": "五言律诗 · 仄起首句不入韵 · 平水韵上平七虞韵"
   }
  },
  {
   "name": "teao",
   "text": "衰多宰全嫩，\n木佐露岑流。\n考逼文僧晚，\n初疑福策幽。\n忙仍材美候，\n注短茂潮秋。\n汝集升拈曰，\n雄催者五偷。",
   "types": [
    "丙",
    "丁",
    "甲",
    "乙",
    "丙",
    "丁",
    "甲",
    "乙"
   ],
   "exp": {
    "verdict": "ok",
    "errCells": [],
    "notes": [
     [
      0,
      "特拗句（平平仄平仄）"
     ]
    ],
    "form": null,
    "summary": "五言律诗 · 平起首句不入韵 · 平水韵下平十一尤韵"
   }
  },
  {
   "name": "shouchu",
   "text": "恁灞鼎唐知，\n青夫恣火娟。\n痕霜宸漏九，\n政退典希年。",
   "types": [
    "甲",
    "乙",
    "丙",
    "丁"
   ],
   "exp": {
    "verdict": "err",
    "errCells": [
     [
      0,
      4
     ]
    ],
    "notes": [
     [
      0,
      "首句出韵"
     ]
    ],
    "form": null,
    "summary": "五言绝句 · 仄起首句入韵 · 平水韵下平一先韵"
   }
  },
  {
   "name": "chuping",
   "text": "唐豪勒辨袖求之，\n列恨添南此寐池。\n濯保荒周甘奏酌，\n温栖促慰橘盈欺。\n威扉水健哉潭光，\n立夜珠忠皎井宜。\n鼎肉裙偏酣免眷，\n娥琴喜外黯翩滋。",
   "types": [
    "丁",
    "乙",
    "丙",
    "丁",
    "甲",
    "乙",
    "丙",
    "丁"
   ],
   "exp": {
    "verdict": "err",
    "errCells": [
     [
      4,
      6
     ]
    ],
    "notes": [
     [
      4,
      "出句平收"
     ]
    ],
    "form": null,
    "summary": "七言律诗 · 平起首句入韵 · 平水韵上平四支韵"
   }
  },
  {
   "name": "qi-p2",
   "text": "宣同嶂兀直篇符，\n次奏祥瓶彼兔芙。\n了襄忠追牛碎夜，\n皇森武曰壁樵奴。\n帷流柳四欺腰透，\n己到悠徐醉七珠。\n惜巷梁民崔考性，\n娟蛾政篆入莎湖。",
   "types": [
    "丁",
    "乙",
    "丙",
    "丁",
    "甲",
    "乙",
    "丙",
    "丁"
   ],
   "exp": {
    "verdict": "err",
    "errCells": [
     [
      2,
      1
     ]
    ],
    "notes": [],
    "form": null,
    "summary": "七言律诗 · 平起首句入韵 · 平水韵上平七虞韵"
   }
  },
  {
   "name": "te-bad",
   "text": "史哀絮功血，\n但踏藻臣悠。\n系拾僧仁八，\n存神杳曰抽。\n原襄官指失，\n悟乃九川州。\n案困昏兮立，\n咸亡宇斾休。",
   "types": [
    "丙",
    "丁",
    "甲",
    "乙",
    "丙",
    "丁",
    "甲",
    "乙"
   ],
   "exp": {
    "verdict": "err",
    "errCells": [
     [
      0,
      0
     ]
    ],
    "notes": [
     [
      0,
      "特拗句首字用仄"
     ]
    ],
    "form": null,
    "summary": "五言律诗 · 平起首句不入韵 · 平水韵下平十一尤韵"
   }
  },
  {
   "name": "ding-p4",
   "text": "退俯梧扉辱，\n萍扶舜典鞭。\n犀超莎染掌，\n橘具旬灞筵。\n建市偷徐果，\n薰檀笑校川。\n温公桑健嶂，\n窈晚戚房年。",
   "types": [
    "甲",
    "乙",
    "丙",
    "丁",
    "甲",
    "乙",
    "丙",
    "丁"
   ],
   "exp": {
    "verdict": "err",
    "errCells": [
     [
      3,
      3
     ]
    ],
    "notes": [],
    "form": null,
    "noNotes": [
     [
      3,
      "三平尾"
     ]
    ],
    "summary": "五言律诗 · 仄起首句不入韵 · 平水韵下平一先韵"
   }
  }
 ],
 "ci": [
  {
   "pai": "浣溪沙",
   "fi": 0,
   "n": 42,
   "groups": 1,
   "text": "畔帝恣珠均六芝。未工玉秀定扉危。痛麻餐感妾鞭之。絮曳嵩麟攀骨益，星熏登管味根追。符梅戴苑四桑移。",
   "bad": "畔呼恣珠均六芝。未工玉秀定扉危。痛麻餐感妾鞭之。絮曳嵩麟攀骨益，星熏登管味根追。符梅戴苑四桑移。",
   "badPos": 1
  },
  {
   "pai": "菩萨蛮",
   "fi": 0,
   "n": 44,
   "groups": 4,
   "text": "媿帘韶展衾芙史。檐凄五敬坡均起。塘固疾悠蒲。妙茫雕寸奴。底之梅窈午。蛾住升投杜。苔刻昨梁湘。非卑袍雅昌。",
   "bad": "媿世韶展衾芙史。檐凄五敬坡均起。塘固疾悠蒲。妙茫雕寸奴。底之梅窈午。蛾住升投杜。苔刻昨梁湘。非卑袍雅昌。",
   "badPos": 1
  },
  {
   "pai": "清平乐",
   "fi": 0,
   "n": 46,
   "groups": 2,
   "text": "雅冤羽似。杜具苔柔水。潮怕署餐微束指。雷子乞皆房喜。途追腰逼香娟。株韶候博存仙。拍急鹿冥住禹，霜霏古木蟾偏。",
   "bad": "雅巧羽似。杜具苔柔水。潮怕署餐微束指。雷子乞皆房喜。途追腰逼香娟。株韶候博存仙。拍急鹿冥住禹，霜霏古木蟾偏。",
   "badPos": 1
  }
 ],
 "gen": {
  "7-8-平-ru": [
   "中平中仄仄平平",
   "中仄平平中仄平",
   "中仄中平平仄仄",
   "中平中仄仄平平",
   "中平中仄平平仄",
   "中仄平平中仄平",
   "中仄中平平仄仄",
   "中平中仄仄平平"
  ],
  "5-4-仄-noru": [
   "中仄平平仄",
   "平平中仄平",
   "中平平仄仄",
   "中仄仄平平"
  ]
 },
 "gen_src": "王力《诗词格律》近体诗平仄四式（七律平起首句入韵 / 五绝仄起首句不入韵），中 标可平可仄位",
 "rb": {
  "上平一东": 230,
  "下平十一尤": 338
 },
 "psyChars": 14414,
 "self": {
  "ok": 207,
  "total": 230,
  "auto": 230,
  "src": "成品 index.html 抠 pl-data + pl-engine，node:vm 逐体复算（truth/self_from_html.mjs）"
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const SHOTS = process.env.PL_SHOTS || ''
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto(toolURL)
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1')

  const onTab = async (t) => {
    await page.click('#pl-tab-' + t)
    await page.waitForFunction((t) => !document.querySelector('#pl-pane-' + t).hidden, t)
  }
  // 填正文后，等「这一次的输入」算完（state.input === v，且结果区 data-key 与本次表单一致）
  async function fillText(v) {
    await page.fill('#pl-text', v)
    await page.waitForFunction((v) => window.PLA.state.input === v && document.querySelector('#pl-result').dataset.key === window.PLA.state.key, v, { timeout: 10000 })
    return page.evaluate(() => {
      const r = window.PLA.last()
      if (!r) return null
      if (!r.ok) return { ok: false, error: r.error }
      const errs = []
      if (r.kind === 'shi') r.lines.forEach((l, i) => l.cells.forEach((c, j) => { if (c.st === 'err') errs.push([i, j]) }))
      else r.cells.forEach((c, j) => { if (c.st === 'err') errs.push(j) })
      return {
        ok: true, kind: r.kind, verdict: r.verdict, summary: r.summary, errs, pai: r.pai, label: r.label, author: r.author, n: r.n,
        notes: r.kind === 'shi' ? r.lines.map((l) => l.notes.map((x) => x.msg)) : [], groups: r.kind === 'ci' ? r.groups.map((g) => ({ name: g.name, st: g.members.map((m) => m.st) })) : [],
        jiu: r.kind === 'shi' ? r.lines.map((l) => l.cells.map((c) => c.st === 'jiu')) : [], poemNotes: (r.notes || []).map((n) => n.msg),
      }
    })
  }
  async function setSel(sel, v) {
    await page.selectOption(sel, v)
  }
  async function setPai(v) {
    await page.fill('#pl-pai', v)
    await page.dispatchEvent('#pl-pai', 'change')
  }
  // DOM 侧再核一次：verdict 标题、错误格数与结果对象一致
  async function domVerdict() {
    return page.evaluate(() => ({
      v: document.querySelector('#pl-verdict')?.dataset.verdict,
      h: document.querySelector('#pl-verdict h3')?.textContent,
      errCells: document.querySelectorAll('#pl-grid .pl-cell.pl-s-err').length,
      cells: document.querySelectorAll('#pl-grid .pl-cell').length,
      rh: document.querySelectorAll('#pl-grid .pl-cell.pl-rh-ok').length,
    }))
  }

  // ---------- T1 默认：杜甫《春望》五律，深 / 心 / 金 / 簪 押下平十二侵（通行结论：合律）
  let d = await domVerdict()
  assert(d.v === 'ok' && d.h === '合律', `春望应合律，得 ${d.v}/${d.h}`)
  assert(d.cells === 40 && d.rh === 4, `春望 40 字 4 韵脚，得 ${d.cells} 字 ${d.rh} 韵脚`)
  let r = await page.evaluate(() => window.PLA.last().summary)
  assert(r === '五言律诗 · 仄起首句不入韵 · 平水韵下平十二侵韵', `春望摘要：${r}`)

  // ---------- T2 名篇（诗律学通行结论）
  const SAMP = await page.evaluate(() => window.PLA.SAMPLES.map((s) => s.t))
  async function loadSample(t) {
    const i = SAMP.indexOf(t); assert(i >= 0, '示例缺 ' + t)
    const x = await page.evaluate((i) => window.PLA.SAMPLES[i].x, i)
    await page.selectOption('#pl-sample', String(i))
    await page.waitForFunction((x) => window.PLA.state.input === x && document.querySelector('#pl-result').dataset.key === window.PLA.state.key, x)
    return page.evaluate(() => { const r = window.PLA.last(); return { ok: r.ok, verdict: r.verdict, summary: r.summary, kind: r.kind, label: r.label, author: r.author, pai: r.pai, notes: r.kind === 'shi' ? r.lines.map((l) => l.notes.map((n) => n.msg)) : [], groups: r.kind === 'ci' ? r.groups.map((g) => g.members.map((m) => m.st)) : [] } })
  }
  r = await loadSample('登高')   // 哀回来台杯 押上平十灰，首句入韵
  assert(r.verdict === 'ok' && r.summary === '七言律诗 · 仄起首句入韵 · 平水韵上平十灰韵', `登高：${r.verdict} ${r.summary}`)
  r = await loadSample('清明')   // 魂 / 村 属元韵，首句「纷」属文韵：首句借邻韵（孤雁出群）
  assert(r.verdict === 'warn' && r.notes[0].includes('首句借邻韵') && r.summary.endsWith('上平十三元韵'), `清明：${r.verdict} ${r.summary} ${r.notes[0]}`)
  r = await loadSample('静夜思')  // 古绝，不合近体格律
  assert(r.verdict === 'err', `静夜思应不合律，得 ${r.verdict}`)
  r = await loadSample('黄鹤楼')  // 前四句不拘平仄的拗律
  assert(r.verdict === 'err' && r.notes.flat().some((n) => n.includes('失粘') || n.includes('大拗未救')), `黄鹤楼：${r.verdict} ${r.notes}`)
  r = await loadSample('天末怀李白')  // 首句「凉风起天末」平平仄平仄，特拗合律
  assert(r.verdict === 'ok' && r.notes[0].includes('特拗句（平平仄平仄）'), `天末怀李白：${r.verdict} ${r.notes[0]}`)
  r = await loadSample('野望')   // 「东皋薄暮望」平平仄仄仄，三仄尾不算失律
  assert(r.verdict === 'warn' && r.notes[0].includes('三仄尾'), `野望：${r.verdict} ${r.notes[0]}`)
  r = await loadSample('春晓')   // 晓 / 鸟 / 少 押仄声（上声筱韵）
  assert(r.summary.startsWith('押仄韵'), `春晓：${r.summary}`)
  r = await loadSample('水调歌头')  // 苏轼此首即龙谱「格二·夹叶仄韵格」例词；合 / 缺 入声通押
  assert(r.kind === 'ci' && r.pai === '水调歌头' && r.label === '格二·夹叶仄韵格' && r.author === '苏轼', `水调歌头认调：${r.pai} ${r.label} ${r.author}`)
  assert(r.groups.length === 3 && r.groups[2].includes('lin') && r.verdict === 'warn', `水调歌头韵组：${JSON.stringify(r.groups)} ${r.verdict}`)
  r = await loadSample('菩萨蛮')   // 四换韵：织碧 / 楼愁 / 立急 / 程亭
  assert(r.verdict === 'ok' && r.groups.length === 4, `菩萨蛮：${r.verdict} ${r.groups.length}`)
  r = await loadSample('如梦令')   // 叠句「知否，知否」
  assert(r.verdict === 'ok' && r.groups.length === 1 && r.groups[0].length === 6, `如梦令：${r.verdict} ${JSON.stringify(r.groups)}`)

  // ---------- T3 合成诗（王力句型独立排格律）：逐例断判词、摘要、出错格与标注
  await setPai('')
  await setSel('#pl-mode', 'shi')
  assert(await page.evaluate(() => getComputedStyle(document.querySelector('#pl-pai-field')).display) === 'none', '近体诗模式下词牌栏应隐藏')
  let n3 = 0, x0
  for (const c of ORACLE.shi) {
    const x = await fillText(c.text)
    assert(x && x.ok, `${c.name} 未出结果`)
    assert(x.verdict === c.exp.verdict, `${c.name} 判词 ${x.verdict} ≠ ${c.exp.verdict}`)
    assert(x.summary === c.exp.summary, `${c.name} 摘要「${x.summary}」≠「${c.exp.summary}」`)
    assert(JSON.stringify(x.errs) === JSON.stringify(c.exp.errCells), `${c.name} 出错格 ${JSON.stringify(x.errs)} ≠ ${JSON.stringify(c.exp.errCells)}`)
    for (const [i, msg] of c.exp.notes) assert(x.notes[i].includes(msg), `${c.name} 第 ${i + 1} 句缺标注「${msg}」：${x.notes[i]}`)
    for (const [i, j] of (c.exp.jiu || [])) assert(x.jiu[i][j], `${c.name} (${i},${j}) 应标「救」`)
    for (const [i, msg] of (c.exp.noNotes || [])) assert(!x.notes[i].includes(msg), `${c.name} 第 ${i + 1} 句不该标「${msg}」：${x.notes[i]}`)
    const dv = await domVerdict()
    assert(dv.errCells === c.exp.errCells.length, `${c.name} 页面红格 ${dv.errCells} ≠ ${c.exp.errCells.length}`)
    n3++
  }
  assert(n3 === ORACLE.shi.length && n3 >= 22, `合成诗应跑满 ${ORACLE.shi.length} 例`)
  // 未收字（Codex P1）：关键位与韵脚都查不到时不能给「合律」
  x0 = await fillText('𰻞'.repeat(20))
  assert(x0.verdict === 'warn' && x0.poemNotes.some((n) => n.includes('未收')) && x0.poemNotes.some((n) => n.includes('无法判定所押韵部')), `全是未收字：${x0.verdict} ${x0.poemNotes}`)
  // 首句末字两读且可借邻韵（Codex P2）：「重」读仄即首句仄收、合律
  x0 = await fillText('国破山河重，城春草木东。感时花溅泪，恨别鸟惊风。')
  assert(x0.verdict === 'ok' && x0.summary === '五言绝句 · 仄起首句不入韵 · 平水韵上平一东韵', `首句两读可借邻韵：${x0.verdict} ${x0.summary}`)
  // 无标点的六句小律（Codex P2）：王维《山居秋暝》前六句去掉标点
  x0 = await fillText('空山新雨后天气晚来秋明月松间照清泉石上流竹喧归浣女莲动下渔舟')
  assert(x0.ok && x0.kind === 'shi' && x0.summary === '五言六句（三韵小律） · 平起首句不入韵 · 平水韵下平十一尤韵', `无标点六句：${x0.summary}`)

  // ---------- T4 合成词：指定词牌 0 错；改一位只报那一位；不给词牌名能认回本调
  await setSel('#pl-mode', 'ci')
  for (const c of ORACLE.ci) {
    await setPai(c.pai)
    let x = await fillText(c.text)
    assert(x.ok && x.pai === c.pai && x.errs.length === 0 && x.groups.length === c.groups && x.n === c.n, `${c.pai} 合成词：${JSON.stringify(x).slice(0, 200)}`)
    x = await fillText(c.bad)
    assert(JSON.stringify(x.errs) === JSON.stringify([c.badPos]), `${c.pai} 改坏位 ${JSON.stringify(x.errs)} ≠ [${c.badPos}]`)
    await setPai('')
    x = await fillText(c.text)
    assert(x.ok && x.pai === c.pai, `${c.pai} 自动认调得「${x.pai}」`)
  }
  // 叠句写错：《如梦令》第二个「知否」改成「知道」→ 提示叠句应重复上句
  let x
  await setPai('如梦令')
  x = await fillText('昨夜雨疏风骤，浓睡不消残酒。试问卷帘人，却道海棠依旧。知否，知道？应是绿肥红瘦。')
  assert(x.ok && x.verdict !== 'ok' && x.poemNotes.some((n) => n.includes('叠句')), `叠句写错应提示：${x.verdict} ${x.poemNotes}`)
  const pinggao = await page.evaluate(() => PL.forms().find((f) => f.name === '念奴娇' && f.fi === 0).example)
  await setPai('')
  x = await fillText(pinggao)
  assert(x.pai === '念奴娇' && x.label === '定格' && x.errs.length === 0, `凭高眺远自动认调：${x.pai} ${x.label} 错 ${x.errs.length}`)
  await setPai('念奴娇')
  x = await fillText(pinggao + ' ')
  assert(x.label === '定格' && x.errs.length === 0, `凭高眺远指定念奴娇：${x.label} 错 ${x.errs.length}`)
  await page.click('#pl-alts .pl-chip[data-fi="1"]')
  await page.waitForFunction(() => window.PLA.last()?.label === '格二·变格一' && window.PLA.S.cur.form === 1)
  // 字数不符 / 词谱里没有
  await setPai('水调歌头')
  x = await fillText('昨夜雨疏风骤，浓睡不消残酒。')
  assert(!x.ok && /字数不符/.test(x.error), `字数不符应报错：${x.error}`)
  assert(await page.isVisible('#pl-error'), '错误信息应显示')
  await setPai('不存在调')
  x = await fillText('昨夜雨疏风骤。')
  assert(!x.ok && /词谱里没有/.test(x.error), `未知词牌：${x.error}`)
  await setPai('')

  // ---------- T5 新韵 / 通韵：光 / 霜 / 乡 普通话韵母 ang
  await setSel('#pl-mode', 'shi')
  await setSel('#pl-book', 'xin')
  x = await fillText('床前明月光，疑是地上霜。举头望明月，低头思故乡。')
  assert(x.summary.endsWith('中华新韵十唐韵'), `新韵：${x.summary}`)
  await setSel('#pl-book', 'tong')
  x = await fillText('床前明月光，疑是地上霜。举头望明月，低头思故乡。\n')
  assert(x.summary.endsWith('中华通韵十三昂韵'), `通韵：${x.summary}`)
  await setSel('#pl-book', 'psy')

  // 首句末字两读：司空曙「年少身无累」——「累」支 / 纸 / 寘两读，按仄读是甲句、合律（couyun 判合律，见 oracle/s2 与 BUGS.md BUG-3）
  x = await fillText('年少身无累，相逢忆此时。雪过云寺宿，酒向竹园期。')
  assert(x.verdict === 'ok' && x.summary === '五言绝句 · 仄起首句不入韵 · 平水韵上平四支韵', `首句两读字：${x.verdict} ${x.summary}`)

  // ---------- T6 同一首诗的几种写法：繁体 / 无标点 / 一行一联，结果都应与简体相同
  const base = await fillText('国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。烽火连三月，家书抵万金。白头搔更短，浑欲不胜簪。')
  for (const v of ['國破山河在，城春草木深。感時花濺淚，恨別鳥驚心。烽火連三月，家書抵萬金。白頭搔更短，渾欲不勝簪。',
    '国破山河在城春草木深感时花溅泪恨别鸟惊心烽火连三月家书抵万金白头搔更短浑欲不胜簪',
    '国破山河在城春草木深\n感时花溅泪恨别鸟惊心\n烽火连三月家书抵万金\n白头搔更短浑欲不胜簪']) {
    x = await fillText(v)
    assert(x.verdict === base.verdict && x.summary === base.summary && x.errs.length === 0, `写法「${v.slice(0, 12)}…」结果不同：${x.summary}`)
  }

  // ---------- T7 点字看读音：胜（勝）在原表里属蒸韵与径韵
  await fillText('国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。烽火连三月，家书抵万金。白头搔更短，浑欲不胜簪。')
  await page.click('#pl-grid .pl-cell[data-i="7"][data-j="3"]')
  await page.waitForFunction(() => document.querySelector('#pl-detail-rd'))
  const rd = await page.textContent('#pl-detail-rd')
  for (const nm of ORACLE.look['胜']) assert(rd.includes(nm), `胜的读音应含 ${nm}：${rd}`)
  assert(await page.getAttribute('#pl-grid .pl-cell[data-i="7"][data-j="3"]', 'aria-pressed') === 'true', '被点的字应高亮')
  await page.focus('#pl-grid .pl-cell[data-i="0"][data-j="4"]')
  await page.keyboard.press('Enter')
  await page.waitForFunction(() => document.querySelector('#pl-grid .pl-cell[data-i="0"][data-j="4"]').getAttribute('aria-pressed') === 'true')
  assert((await page.textContent('#pl-detail-rd')).includes('上声十贿'), '键盘 Enter 应显示「在」的读音（上声十贿）')

  // ---------- T8 空文本 / 非诗非词
  await setSel('#pl-mode', 'auto')
  x = await fillText('')
  assert(x === null && await page.isVisible('#pl-result .pl-empty'), '空文本应回到空状态')
  x = await fillText('一二三')
  assert(!x.ok, '三个字既不是诗也没有对应词调')

  // ---------- T9 查韵：页面读音 ⊇ 原表读音
  await onTab('look')
  for (const [ch, names] of Object.entries(ORACLE.look)) {
    await page.fill('#pl-q', ch)
    await page.click('#pl-q-go')
    await page.waitForFunction((ch) => document.querySelector('#pl-lk .pl-lkc')?.dataset.ch === ch, ch)
    const t = await page.textContent('#pl-lk .pl-lk-psy')
    for (const nm of names) assert(t.includes(nm), `${ch} 平水韵应含 ${nm}：${t}`)
    assert(names.length > 0, `${ch} 原表应有读音`)
  }
  // 原表未收、由 couyun 补的通行字：标注来源，读音与 couyun 一致
  for (const [ch, names] of Object.entries(ORACLE.fallback)) {
    await page.fill('#pl-q', ch)
    await page.click('#pl-q-go')
    await page.waitForFunction((ch) => document.querySelector('#pl-lk .pl-lkc')?.dataset.ch === ch, ch)
    const t = await page.textContent('#pl-lk .pl-lk-psy')
    assert(t.includes('据 couyun 补'), `${ch} 应标注据 couyun 补：${t}`)
    for (const nm of names) assert(t.includes(nm), `${ch} 平水韵应含 ${nm}：${t}`)
  }
  // 韵部字表计数（Python 独立按「略去繁体形」口径重算）
  await setSel('#pl-rb-book', 'psy')
  await setSel('#pl-rb-yun', '0')
  await page.waitForFunction((n) => document.querySelector('#pl-rb-list').dataset.n === String(n), ORACLE.rb['上平一东'])
  await setSel('#pl-rb-yun', '25')
  await page.waitForFunction((n) => document.querySelector('#pl-rb-list').dataset.n === String(n), ORACLE.rb['下平十一尤'])
  assert(+(await page.getAttribute('#pl-rb-list', 'data-n')) === 338, '下平十一尤字表应 338 字（truth_gen.py 独立计数）')
  await page.click('#pl-rb-list .pl-rc >> nth=0')
  await page.waitForFunction(() => document.querySelector('#pl-lk .pl-lkc')?.dataset.ch === document.querySelector('#pl-rb-list .pl-rc').dataset.ch)
  const t9 = await page.textContent('#pl-lk .pl-lk-psy')
  assert(t9.includes('下平十一尤'), `字表首字应属尤韵：${t9}`)

  // ---------- T10 格律谱
  await onTab('pat')
  for (const [k, rows] of Object.entries(ORACLE.gen)) {
    const [L, n, qi, ru] = k.split('-')
    await setSel('#pl-g-L', L); await setSel('#pl-g-n', n); await setSel('#pl-g-qi', qi)
    if ((await page.isChecked('#pl-g-ru')) !== (ru === 'ru')) await page.click('#pl-g-ru')
    await page.waitForFunction((key) => document.querySelector('#pl-g-out').dataset.key === key, [L, n, qi, ru === 'ru'].join('|'))
    const got = await page.$$eval('#pl-g-out .pl-c-k', (ns) => ns.map((n) => n.textContent))
    assert(JSON.stringify(got) === JSON.stringify(rows), `格律谱 ${k}：${got.join(' ')}`)
  }
  // 词谱：按别名搜「大江东去」→ 念奴娇，三体；键盘切体后焦点留在版本按钮上
  await page.fill('#pl-cp-q', '大江东去')
  await page.waitForFunction(() => document.querySelector('#pl-cp-list').dataset.n === '1')
  await page.click('#pl-cp-list .pl-cpb')
  await page.waitForFunction(() => document.querySelector('#pl-cp-name')?.textContent === '念奴娇')
  assert(await page.locator('#pl-cp-forms .pl-chip').count() === 3, '念奴娇应有三体')
  await page.focus('#pl-cp-forms .pl-chip[data-fi="1"]')
  await page.keyboard.press('Enter')
  await page.waitForFunction(() => document.querySelector('#pl-cp-forms .pl-chip[data-fi="1"]')?.getAttribute('aria-pressed') === 'true')
  const foc = await page.evaluate(() => ({ inside: !!document.activeElement.closest('#pl-cp-forms'), fi: document.activeElement.dataset.fi }))
  assert(foc.inside && foc.fi === '1', `切体后焦点应留在第二体按钮上：${JSON.stringify(foc)}`)
  assert((await page.textContent('#pl-cp-ex')).startsWith('大江东去'), '念奴娇格二例词应是苏轼「大江东去」')
  await page.click('#pl-cp-use')
  await page.waitForFunction(() => !document.querySelector('#pl-pane-check').hidden && window.PLA.last()?.pai === '念奴娇')
  r = await page.evaluate(() => ({ label: window.PLA.last().label, mode: document.querySelector('#pl-mode').value, nErr: window.PLA.last().nErr }))
  assert(r.label === '格二·变格一' && r.mode === 'ci' && r.nErr === 0, `用例词检测：${JSON.stringify(r)}`)
  // 第三体（平韵格）：所选体要原样带到检测页（Codex P1）
  await onTab('pat')
  await page.click('#pl-cp-forms .pl-chip[data-fi="2"]')
  await page.waitForFunction(() => document.querySelector('#pl-cp-forms .pl-chip[data-fi="2"]')?.getAttribute('aria-pressed') === 'true')
  await page.click('#pl-cp-use')
  await page.waitForFunction(() => !document.querySelector('#pl-pane-check').hidden && window.PLA.last()?.label === '格三·平韵格')

  // ---------- T11 诗稿：存入 → 列表 +1；改题目后立刻刷新，题目仍在（pagehide 补写）
  await setSel('#pl-mode', 'auto')
  await setPai('')
  await fillText('空山新雨后，天气晚来秋。明月松间照，清泉石上流。竹喧归浣女，莲动下渔舟。随意春芳歇，王孙自可留。')
  await page.fill('#pl-title', '山居秋暝')
  await page.fill('#pl-author', '王维')
  const n0 = await page.evaluate(() => window.PLA.S.drafts.length)
  await page.click('#pl-save')
  await page.waitForFunction((n0) => window.PLA.S.drafts.length === n0 + 1, n0)
  // 标题里的尖括号必须原样显示（innerHTML 前转义）
  await page.fill('#pl-title', '<img src=x onerror="window.__pwn=1">秋暝')
  await page.click('#pl-save')
  await page.waitForFunction((n0) => window.PLA.S.drafts.length === n0 + 2, n0)
  await onTab('draft')
  const h4 = await page.textContent('#pl-dlist .pl-ditem h4')
  assert(h4.includes('<img src=x') && await page.locator('#pl-dlist img').count() === 0 && !(await page.evaluate(() => window.__pwn)), `标题应转义显示：${h4}`)
  await page.click('#pl-dlist .pl-ditem [data-act="del"]')
  await page.click('#pl-dlist .pl-ditem [data-act="del"]')
  await page.waitForFunction((n) => document.querySelectorAll('#pl-dlist .pl-ditem').length === n, n0 + 1)
  await onTab('check')
  await page.fill('#pl-title', '山居秋暝（改）')
  await page.fill('#pl-text', '空山新雨后，天气晚来秋。明月松间照，清泉石上流。竹喧归浣女，莲动下渔舟。随意春芳歇，王孙自可留。\n（改）')
  await page.reload()
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1')
  assert(await page.inputValue('#pl-title') === '山居秋暝（改）', '改题目后立刻刷新，题目应保留')
  assert((await page.inputValue('#pl-text')).endsWith('（改）'), '改正文后立刻刷新，正文改动应保留（离页补写）')
  assert(await page.getAttribute('#pl-text', 'maxlength') === '20000', '正文框应有 2 万字上限')
  assert(await page.evaluate(() => window.PLA.S.drafts.length) === n0 + 1, '刷新后诗稿应仍在')
  await onTab('draft')
  assert(await page.locator('#pl-dlist .pl-ditem').count() === n0 + 1, '诗稿列表应多一条')
  const it = await page.textContent('#pl-dlist .pl-ditem h4')
  assert(it.includes('山居秋暝') && it.includes('王维'), `诗稿标题：${it}`)
  // 诗笺：等画布按当前状态画完（stateKey），检查字没有互相压住、真的画上了
  await page.click('#pl-dlist .pl-ditem [data-act="jian"]')
  await page.waitForFunction(() => document.querySelector('#pl-jian').dataset.key === window.PLA.stateKey())
  const jj = await page.evaluate(() => {
    const D = window.PLA.JIAN.drawn, cv = document.querySelector('#pl-jian')
    let ov = 0
    for (let i = 0; i < D.length; i++) for (let k = i + 1; k < D.length; k++) {
      const a = D[i], b = D[k]
      if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) ov++
    }
    const img = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data
    let ink = 0
    for (let p = 0; p < img.length; p += 4) if (img[p] < 120 && img[p + 1] < 120) ink++
    return { n: D.length, ov, ink, w: cv.width, h: cv.height, cols: +cv.dataset.cols }
  })
  // 山居秋暝：题 4 + 正文 40 + 署名 2 + 印章 1
  assert(jj.ov === 0 && jj.n === 47, `诗笺：${JSON.stringify(jj)}`)
  // 下限：47 个字形 × 每字至少 200 个深色像素（字号约 54px 的楷 / 宋体，实测每字 350–450）
  assert(jj.ink > 47 * 200 && jj.cols === 10, `诗笺墨迹像素 / 列数：${JSON.stringify(jj)}`)
  if (SHOTS) await page.locator('.pl-jian-wrap').screenshot({ path: `${SHOTS}/jian.png` })
  await setSel('#pl-jian-style', 'zhusi')
  await page.waitForFunction(() => document.querySelector('#pl-jian').dataset.key === window.PLA.stateKey() && window.PLA.stateKey().startsWith('zhusi'))
  // 导出 → 删除（两步）→ 导入恢复
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#pl-export')])
  const bak = JSON.parse(fs.readFileSync(await dl.path(), 'utf8'))
  assert(bak.app === 'prosody-lab' && bak.drafts.length === n0 + 1, `导出备份：${bak.drafts?.length}`)
  await page.click('#pl-dlist .pl-ditem [data-act="del"]')
  assert(await page.locator('#pl-dlist .pl-ditem').count() === n0 + 1, '第一次点删除只是待确认')
  await page.click('#pl-dlist .pl-ditem [data-act="del"]')
  await page.waitForFunction((n) => document.querySelectorAll('#pl-dlist .pl-ditem').length === n, n0)
  await page.setInputFiles('#pl-import', { name: 'bak.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(bak)) })
  await page.waitForFunction((n) => document.querySelectorAll('#pl-dlist .pl-ditem').length === n, n0 + 1)
  // 写盘失败：存诗稿与导入都不能报成功，列表保持原样
  await page.evaluate(() => { window.__set = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (k === 'pl-v1-drafts') throw new DOMException('full', 'QuotaExceededError'); return window.__set.call(this, k, v) } })
  await onTab('check')
  await page.fill('#pl-title', '存不下')
  await page.click('#pl-save')
  await page.waitForFunction(() => /没有存进诗稿/.test(document.querySelector('#pl-toast').textContent))
  assert(await page.evaluate(() => window.PLA.S.drafts.length) === n0 + 1, '写盘失败时诗稿数不应变化')
  await onTab('draft')
  await page.setInputFiles('#pl-import', { name: 'more.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ drafts: [{ id: 'zz-new', text: '一首新诗', ts: Date.now() + 9e9 }] })) })
  await page.waitForFunction(() => /导入已撤销/.test(document.querySelector('#pl-toast').textContent))
  assert(await page.locator('#pl-dlist .pl-ditem').count() === n0 + 1 && !(await page.evaluate(() => window.PLA.S.drafts.some((d) => d.id === 'zz-new'))), '导入写盘失败时应回到导入前的列表')
  await page.evaluate(() => { Storage.prototype.setItem = window.__set })
  // 结构不对的条目（id 不是字符串、过长、没有正文）一律跳过
  await page.setInputFiles('#pl-import', { name: 'odd.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ drafts: [{ id: 1, text: '甲' }, { id: 'z1' }, null, 'x', { id: 'a'.repeat(41), text: '乙' }] })) })
  await page.waitForFunction(() => /导入 0 首/.test(document.querySelector('#pl-toast').textContent))
  assert(await page.locator('#pl-dlist .pl-ditem').count() === n0 + 1, '结构不对的条目不应导入')
  // 坏备份不该弄坏现有数据
  await page.setInputFiles('#pl-import', { name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{not json') })
  await page.waitForFunction(() => !document.querySelector('#pl-toast').hidden && /不是有效/.test(document.querySelector('#pl-toast').textContent))
  assert(await page.locator('#pl-dlist .pl-ditem').count() === n0 + 1, '坏备份不应影响已有诗稿')
  // 打开诗稿 → 回到检测页并载入
  await page.click('#pl-dlist .pl-ditem [data-act="open"]')
  await page.waitForFunction(() => !document.querySelector('#pl-pane-check').hidden && window.PLA.last()?.summary?.startsWith('五言律诗'))
  const opened = await page.evaluate(() => ({ t: document.querySelector('#pl-title').value, x: document.querySelector('#pl-text').value, id: window.PLA.S.openId }))
  assert(opened.t === bak.drafts[0].title && opened.x === bak.drafts[0].text && opened.id === bak.drafts[0].id, `打开的应是导入的那首：${JSON.stringify(opened).slice(0, 120)}`)
  // 清空本机数据（两步）
  await onTab('draft')
  await page.click('#pl-wipe')
  assert(await page.locator('#pl-dlist .pl-ditem').count() === n0 + 1, '第一次点清空只是待确认')
  await page.click('#pl-wipe')
  await page.waitForFunction(() => document.querySelectorAll('#pl-dlist .pl-ditem').length === 0)
  // 正向锚点：清空的是诗稿，当前正文与检测结果仍在
  assert((await page.inputValue('#pl-text')).startsWith('空山新雨后'), '清空诗稿后当前正文应仍在')
  assert(await page.evaluate(() => window.PLA.last()?.verdict) === 'ok', '清空诗稿后检测结果应仍可用')

  // 两个标签页：B 页存一首，A 页（列表是旧的）随后只改题目，B 的新稿仍在；A 收到 storage 事件后列表同步
  const pageB = await page.context().newPage()
  await pageB.goto(toolURL)
  await pageB.waitForFunction(() => document.documentElement.dataset.ready === '1')
  await pageB.fill('#pl-title', 'B 页新稿')
  await pageB.fill('#pl-text', '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。')
  const nb0 = await pageB.evaluate(() => window.PLA.S.drafts.length)
  await pageB.click('#pl-save')
  await pageB.waitForFunction((n) => window.PLA.S.drafts.length === n + 1, nb0)
  await onTab('check')
  await page.fill('#pl-title', 'A 页改题目')
  await page.waitForFunction(() => window.PLA.S.drafts.some((d) => d.title === 'B 页新稿'))
  await page.evaluate(() => window.PLA.saveNow())
  // A 页再存一首（列表写入）：必须在存储里的最新列表上追加，不能用 A 页内存里的旧列表覆盖
  await page.fill('#pl-text', '床前明月光，疑是地上霜。举头望明月，低头思故乡。')
  await page.click('#pl-save')
  await page.waitForFunction(() => window.PLA.S.drafts.some((d) => d.title === 'A 页改题目'))
  await pageB.close()
  await page.reload()
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1')
  const both = await page.evaluate(() => window.PLA.S.drafts.map((d) => d.title))
  assert(both.includes('B 页新稿') && both.includes('A 页改题目'), `两页各存一首后都应在：${both}`)
  // 「当前正文」是整个浏览器共用的一格（后写者为准），这里只断诗稿列表不丢

  // 长排律的诗笺：列数多时画布加宽，所有字都画上（Codex P2）
  await onTab('check')
  const longPoem = Array.from({ length: 30 }, (_, i) => ['白日依山尽', '黄河入海流', '欲穷千里目', '更上一层楼'][i % 4] + (i % 2 ? '。' : '，')).join('')
  await page.fill('#pl-title', '长')
  await page.fill('#pl-text', longPoem)
  await onTab('draft')
  await page.evaluate(() => { window.PLA.S.jian.src = null; window.PLA.drawJian() })
  await page.waitForFunction(() => document.querySelector('#pl-jian').dataset.key === window.PLA.stateKey())
  const lj = await page.evaluate(() => ({ n: window.PLA.JIAN.drawn.length, w: document.querySelector('#pl-jian').width }))
  // 题 1 + 正文 150 + 署名 0 + 印章 1（作者栏沿用上面的 A 页稿：王维 2 字）
  assert(lj.w > 900 && lj.n === 1 + 150 + 2 + 1, `长排律诗笺：${JSON.stringify(lj)}`)

  // ---------- T12 说明页：例词自检现场复算 = 离线实测（钉死字面量）
  await onTab('doc')
  const st = await page.evaluate(() => ({ ok: +document.querySelector('#pl-stats').dataset.ok, self: document.querySelector('#pl-st-self').textContent, auto: document.querySelector('#pl-st-auto').textContent, psy: document.querySelector('#pl-st-psy').textContent }))
  assert(st.ok === ORACLE.self.ok && st.self === `${ORACLE.self.ok} / ${ORACLE.self.total}`, `例词自检：页面 ${st.self}，离线 ${ORACLE.self.ok}/${ORACLE.self.total}`)
  assert(st.ok === 207, '例词自检全合体数（离线实测）应为 207')
  assert(st.auto === `${ORACLE.self.auto} / ${ORACLE.self.total}`, `自动认调：${st.auto}`)
  assert(st.psy.replace(/,/g, '') === String(ORACLE.psyChars), `平水韵收字：${st.psy} vs ${ORACLE.psyChars}`)
  assert(ORACLE.psyChars === 14414, '平水韵收字数（Python 独立计数）应为 14414')

  // ---------- T13 键盘切页签
  await page.focus('#pl-tab-doc')
  await page.keyboard.press('ArrowLeft')
  await page.waitForFunction(() => document.activeElement.id === 'pl-tab-draft' && !document.querySelector('#pl-pane-draft').hidden)
  await page.keyboard.press('Home')
  await page.waitForFunction(() => document.activeElement.id === 'pl-tab-check' && !document.querySelector('#pl-pane-check').hidden)

  // ---------- T14 渲染守卫（逐页签 × 逐视口）
  const tabs = ['check', 'look', 'pat', 'draft', 'doc']
  await renderGuards(page, {
    assert, tabs, onTab, paneSel: (t) => `#pl-pane-${t}`, panesRoot: '#pl-panes', cardSel: '.pl-card, .pl-feature, .pl-verdict',
    figSel: (t) => `#pl-pane-${t} svg`,   // 本页没有 SVG 图；诗笺是 canvas，另有逐字占位盒两两不交断言（T11）
    labelSel: 'th, dt, label, label > span, .pl-tab, .pl-badge, .pl-kpi', minControls: 30,
  })
  await onTab('check')
  await guardBoxOverlap(page, { assert, sel: '.pl-tab, .pl-kpi, #pl-result .pl-badge, .pl-cta .pl-btn, #pl-pane-check .pl-actions .pl-btn, #pl-grid .pl-cell, .pl-legend > span' })
  for (const host of ['.pl-hero', '.pl-callout']) {   // 页签面板之外的按钮区（顶栏只有链接）
    if (host === '.pl-callout') await onTab('doc')
    await guardControlSize(page, { assert, tabs: [host], onTab: async () => {}, paneSel: (h) => h, minControls: 1 })
  }
  // 窄屏下检测结果格子没有被挤扁（宽 ≥ 36px）、且都落在结果栏里
  await page.setViewportSize({ width: 390, height: 900 })
  await onTab('check')
  await setSel('#pl-mode', 'auto')
  await fillText('国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。烽火连三月，家书抵万金。白头搔更短，浑欲不胜簪。')
  const geo = await page.evaluate(() => {
    const host = document.querySelector('#pl-result').getBoundingClientRect()
    const cs = [...document.querySelectorAll('#pl-grid .pl-cell')].map((c) => c.getBoundingClientRect())
    return { n: cs.length, minW: Math.min(...cs.map((b) => b.width)), out: cs.filter((b) => b.right > host.right + 1 || b.left < host.left - 1).length }
  })
  assert(geo.n === 40 && geo.minW >= 36 && geo.out === 0, `390px 结果格：${JSON.stringify(geo)}`)
  await page.setViewportSize({ width: 1280, height: 900 })

  // ---------- 缩略图
  await onTab('check')
  await page.selectOption('#pl-sample', String(SAMP.indexOf('登高')))
  await page.waitForFunction(() => window.PLA.last()?.summary?.includes('七言律诗'))
  if (SHOTS) await page.locator('#pl-result').screenshot({ path: `${SHOTS}/result.png` })
  await page.evaluate(() => window.scrollTo(0, 0))
  await screenshot('thumb.png')
}
