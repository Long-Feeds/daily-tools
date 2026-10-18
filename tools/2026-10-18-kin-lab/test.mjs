/* 家谱称谓工作台 · 集成测试
 *
 * 数值与称谓真值全部来自 run 目录 oracle/ui_truth.mjs：从成品 HTML 抠出引擎算，并逐项用 relationship.js 1.2.9
 * 交叉核对（对不上就拒绝写出），再由 inject-oracle.mjs 机械注入下面的 ORACLE 块；本文件不手写任何称谓或份额。
 * 引擎本身的正确性由离线套件 oracle/offline.mjs 兜底（relationship.js 全量 ≤4 步链、Python 路径计数法 φ、
 * Python Fraction 继承、python-gedcom 解析）。渲染守卫 import（render-guards.mjs）。
 */
import { renderGuards } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs';
import fs from 'node:fs';

const ORACLE = {
 "meta": {
  "tabs": [
   "calc",
   "tree",
   "rel",
   "heir",
   "ref",
   "data"
  ]
 },
 "calc": {
  "妈妈的妈妈的哥哥|1": [
   {
    "main": "舅外公",
    "names": [
     "舅外公",
     "舅姥爷",
     "舅外祖父"
    ],
    "chain": "妈妈的妈妈的哥哥",
    "gen": "长两辈",
    "r": 0.125,
    "pair": "",
    "marry": "不在法定禁婚范围（超出三代旁系）",
    "rev": [
     "甥外孙"
    ]
   }
  ],
  "外婆的哥哥|1": [
   {
    "main": "舅外公",
    "names": [
     "舅外公",
     "舅姥爷",
     "舅外祖父"
    ],
    "chain": "妈妈的妈妈的哥哥",
    "gen": "长两辈",
    "r": 0.125,
    "pair": "",
    "marry": "不在法定禁婚范围（超出三代旁系）",
    "rev": [
     "甥外孙"
    ]
   }
  ],
  "老婆的妹妹的老公|1": [
   {
    "main": "妹夫",
    "names": [
     "妹夫",
     "襟弟",
     "小姨夫"
    ],
    "chain": "老婆的妹妹的老公",
    "gen": "同辈",
    "r": 0,
    "pair": "连襟",
    "marry": "法律不禁止（无血缘）",
    "rev": [
     "姐夫"
    ]
   }
  ],
  "老公的弟弟的老婆|0": [
   {
    "main": "弟妹",
    "names": [
     "弟妹",
     "弟媳"
    ],
    "chain": "老公的弟弟的老婆",
    "gen": "同辈",
    "r": 0,
    "pair": "妯娌",
    "marry": "法律不禁止（无血缘）",
    "rev": [
     "嫂子"
    ]
   }
  ],
  "爸爸的爸爸的弟弟的儿子|1": [
   {
    "main": "堂伯 / 堂叔",
    "names": [
     "堂伯",
     "堂叔"
    ],
    "chain": "爸爸的爸爸的弟弟的儿子",
    "gen": "长一辈",
    "r": 0.0625,
    "pair": "堂叔侄",
    "marry": "不在法定禁婚范围（超出三代旁系）",
    "rev": [
     "堂侄"
    ]
   }
  ],
  "表哥的老婆|1": [
   {
    "main": "表嫂",
    "names": [
     "表嫂",
     "表弟媳",
     "表弟妹",
     "姑表嫂",
     "姑表弟媳",
     "姑表弟妹"
    ],
    "chain": "爸爸的姐妹的儿子的老婆",
    "gen": "同辈",
    "r": 0,
    "pair": "",
    "marry": "法律不禁止（无血缘）",
    "rev": [
     "表哥 / 表弟"
    ]
   }
  ],
  "舅舅的女儿|0": [
   {
    "main": "表姐 / 表妹",
    "names": [
     "表姐",
     "表妹",
     "舅表姐",
     "舅表妹"
    ],
    "chain": "妈妈的兄弟的女儿",
    "gen": "同辈",
    "r": 0.125,
    "pair": "表姐妹",
    "marry": "禁止结婚（三代以内旁系血亲，民法典第 1048 条）",
    "rev": [
     "表姐 / 表妹"
    ]
   }
  ],
  "舅舅的女儿|1": [
   {
    "main": "表姐 / 表妹",
    "names": [
     "表姐",
     "表妹",
     "舅表姐",
     "舅表妹"
    ],
    "chain": "妈妈的兄弟的女儿",
    "gen": "同辈",
    "r": 0.125,
    "pair": "表兄妹/表姐弟",
    "marry": "禁止结婚（三代以内旁系血亲，民法典第 1048 条）",
    "rev": [
     "表哥 / 表弟"
    ]
   }
  ],
  "七舅姥爷|1": [
   {
    "main": "舅外公",
    "names": [
     "舅外公",
     "舅姥爷",
     "舅外祖父"
    ],
    "chain": "妈妈的妈妈的兄弟",
    "gen": "长两辈",
    "r": 0.125,
    "pair": "",
    "marry": "不在法定禁婚范围（超出三代旁系）",
    "rev": [
     "甥外孙"
    ]
   }
  ],
  "爸爸的儿子|1": [
   {
    "main": "自己",
    "names": [
     "自己"
    ],
    "chain": "自己",
    "gen": "同辈",
    "r": 1,
    "pair": "",
    "rev": [
     "自己",
     "哥哥 / 弟弟"
    ]
   },
   {
    "main": "哥哥 / 弟弟",
    "names": [
     "哥哥",
     "弟弟"
    ],
    "chain": "兄弟",
    "gen": "同辈",
    "r": 0.5,
    "pair": "兄弟",
    "marry": "禁止结婚（三代以内旁系血亲，民法典第 1048 条）",
    "rev": [
     "自己",
     "哥哥 / 弟弟"
    ]
   }
  ],
  "妈妈的妈妈|1": [
   {
    "main": "外婆",
    "names": [
     "外婆",
     "姥姥",
     "外祖母"
    ],
    "chain": "妈妈的妈妈",
    "gen": "长两辈",
    "r": 0.25,
    "pair": "外祖孙/婆孙",
    "marry": "禁止结婚（直系血亲，民法典第 1048 条）",
    "rev": [
     "外孙"
    ]
   }
  ],
  "儿子的老婆的妈妈|1": [
   {
    "main": "亲家母",
    "names": [
     "亲家母"
    ],
    "chain": "儿子的老婆的妈妈",
    "gen": "同辈",
    "r": 0,
    "pair": "亲家",
    "marry": "法律不禁止（无血缘）",
    "rev": [
     "亲家公"
    ]
   }
  ]
 },
 "key": {
  "main": "舅外公",
  "rev": "甥外孙",
  "revCodes": [
   "ls",
   "d",
   "s"
  ],
  "revSex": 1,
  "revMain": "甥外孙"
 },
 "north": {
  "std": "外婆",
  "north": "姥姥"
 },
 "labels": {
  "c4": "表姐",
  "gfbs": "堂叔",
  "mgmb": "舅外公",
  "wlsh": "妹夫",
  "mggf": "太外公",
  "c1": "堂哥",
  "c2": "堂妹",
  "wobw": "嫂子",
  "osc": "外甥",
  "c1s": "堂侄",
  "gfs": "姑奶奶",
  "fysh": "小姑父",
  "son": "儿子",
  "mosh": "大姨父"
 },
 "labelsSon": {
  "ego": "爸爸",
  "mo": "奶奶",
  "fa": "爷爷",
  "w": "妈妈",
  "gf": "太爷爷",
  "mgf": "曾外祖父",
  "dau": "妹妹",
  "c4": "表姑",
  "wf": "外公"
 },
 "nPeople": 44,
 "nUnions": 16,
 "nWithParent": 27,
 "gens": 5,
 "rel": {
  "ego|c4": {
   "label": "表姐",
   "back": "表弟",
   "pair": "表兄妹/表姐弟/姨兄妹/姨姐弟",
   "chain": "妈妈的姐姐的女儿",
   "phi": "1/16",
   "r": 0.125,
   "ban": true,
   "why": "三代以内旁系血亲（共同长辈 陈振华，按代数算第 3 代）",
   "type": "旁系血亲",
   "n": 3
  },
  "ego|gfbs": {
   "label": "堂叔",
   "back": "堂侄",
   "pair": "堂叔侄",
   "chain": "爸爸的爸爸的弟弟的儿子",
   "phi": "1/32",
   "r": 0.0625,
   "ban": false,
   "why": "旁系血亲，但共同长辈 林福 已在第 4 代，超出三代",
   "type": "旁系血亲",
   "n": 4
  },
  "c1|c2": {
   "label": "妹妹",
   "back": "哥哥",
   "pair": "兄妹",
   "chain": "妹妹",
   "phi": "0",
   "r": 0,
   "ban": false,
   "why": "只是收养形成的拟制旁系血亲（共同长辈 林建国）：法律没有明文禁止，实务中一般认为可以结婚",
   "type": "旁系血亲",
   "n": 1
  },
  "ego|w": {
   "label": "老婆",
   "back": "老公",
   "pair": "夫妻",
   "chain": "老婆",
   "phi": "0",
   "r": 0,
   "ban": false,
   "why": "没有共同的长辈（无血缘或家谱里没记）",
   "type": "配偶",
   "n": 1
  },
  "ego|wlsh": {
   "label": "妹夫",
   "back": "姐夫",
   "pair": "连襟",
   "chain": "老婆的妹妹的老公",
   "phi": "0",
   "r": 0,
   "ban": false,
   "why": "没有共同的长辈（无血缘或家谱里没记）",
   "type": "姻亲",
   "n": 3
  },
  "son|mgmb": {
   "label": "舅曾外祖父",
   "back": "甥外曾孙",
   "pair": "",
   "chain": "爸爸的妈妈的妈妈的哥哥",
   "phi": "1/32",
   "r": 0.0625,
   "ban": false,
   "why": "旁系血亲，但共同长辈 李老太爷 已在第 5 代，超出三代",
   "type": "旁系血亲",
   "n": 4
  }
 },
 "heir": {
  "mgf": [
   [
    "mgm",
    "1/4",
    "配偶"
   ],
   [
    "myb",
    "1/4",
    "子女"
   ],
   [
    "mo",
    "1/4",
    "子女"
   ],
   [
    "c4",
    "1/4",
    "子女（代位）"
   ]
  ],
  "mgfWidow": [
   [
    "mgm",
    "1/5",
    "配偶"
   ],
   [
    "myb",
    "1/5",
    "子女"
   ],
   [
    "mo",
    "1/5",
    "子女"
   ],
   [
    "mosh",
    "1/5",
    "丧偶女婿（尽了主要赡养义务）"
   ],
   [
    "c4",
    "1/5",
    "子女（代位）"
   ]
  ],
  "gf": [
   [
    "gm",
    "1/4",
    "配偶"
   ],
   [
    "fa",
    "1/4",
    "子女"
   ],
   [
    "fob",
    "1/4",
    "子女"
   ],
   [
    "fys",
    "1/4",
    "子女"
   ]
  ],
  "mgmb": [
   [
    "mgm",
    "1",
    "兄弟姐妹"
   ]
  ],
  "mgmbOrder": 2
 },
 "ref": {
  "f,f|1": [
   "爷爷",
   "孙子"
  ],
  "f,m|1": [
   "奶奶",
   "孙子"
  ],
  "f,ob|1": [
   "伯父",
   "侄子"
  ],
  "f,ob,w|1": [
   "伯母",
   "侄子"
  ],
  "f,lb|1": [
   "叔叔",
   "侄子"
  ],
  "f,lb,w|1": [
   "婶婶",
   "侄子"
  ],
  "f,os|1": [
   "大姑",
   "侄子"
  ],
  "f,ls|1": [
   "小姑",
   "侄子"
  ],
  "f,xs,h|1": [
   "姑父",
   "内侄"
  ],
  "f,f,ob|1": [
   "伯公",
   "侄孙"
  ],
  "f,f,lb|1": [
   "叔公",
   "侄孙"
  ],
  "f,f,xs|1": [
   "姑奶奶",
   "侄孙"
  ],
  "f,m,xb|1": [
   "舅爷",
   "甥孙"
  ],
  "f,m,xs|1": [
   "姨奶奶",
   "甥孙"
  ],
  "f,f,f|1": [
   "太爷爷",
   "曾孙"
  ],
  "f,f,m|1": [
   "太奶奶",
   "曾孙"
  ],
  "m,f|1": [
   "外公",
   "外孙"
  ],
  "m,m|1": [
   "外婆",
   "外孙"
  ],
  "m,ob|1": [
   "大舅",
   "外甥"
  ],
  "m,lb|1": [
   "小舅",
   "外甥"
  ],
  "m,xb,w|1": [
   "舅妈",
   "外甥"
  ],
  "m,os|1": [
   "大姨",
   "外甥"
  ],
  "m,ls|1": [
   "小姨",
   "外甥"
  ],
  "m,xs,h|1": [
   "姨父",
   "外甥"
  ],
  "m,m,xb|1": [
   "舅外公",
   "甥外孙"
  ],
  "m,m,xs|1": [
   "姨外婆",
   "甥外孙"
  ],
  "m,f,ob|1": [
   "伯外公",
   "侄外孙"
  ],
  "m,f,xs|1": [
   "姑外婆",
   "侄外孙"
  ],
  "m,f,f|1": [
   "太外公",
   "曾外孙"
  ],
  "m,m,m|1": [
   "太外婆",
   "外曾外孙"
  ],
  "ob|1": [
   "哥哥",
   "弟弟"
  ],
  "ob,w|1": [
   "嫂子",
   "小叔子"
  ],
  "lb|1": [
   "弟弟",
   "哥哥"
  ],
  "lb,w|1": [
   "弟妹",
   "大伯子"
  ],
  "os|1": [
   "姐姐",
   "弟弟"
  ],
  "os,h|1": [
   "姐夫",
   "小舅子"
  ],
  "ls|1": [
   "妹妹",
   "哥哥"
  ],
  "ls,h|1": [
   "妹夫",
   "大舅子"
  ],
  "f,ob,s|1": [
   "堂哥 / 堂弟",
   "堂哥 / 堂弟"
  ],
  "f,lb,d|1": [
   "堂姐 / 堂妹",
   "堂哥 / 堂弟"
  ],
  "f,xs,s|1": [
   "表哥 / 表弟",
   "表哥 / 表弟"
  ],
  "m,xb,d|1": [
   "表姐 / 表妹",
   "表哥 / 表弟"
  ],
  "m,xs,s|1": [
   "表哥 / 表弟",
   "表哥 / 表弟"
  ],
  "f,ob,s,w|1": [
   "堂嫂",
   "堂哥 / 堂弟"
  ],
  "f,f,ob,s,s|1": [
   "堂哥 / 堂弟",
   "堂哥 / 堂弟"
  ],
  "s|1": [
   "儿子",
   "爸爸"
  ],
  "s,w|1": [
   "儿媳",
   "公公"
  ],
  "d|1": [
   "女儿",
   "爸爸"
  ],
  "d,h|1": [
   "女婿",
   "岳父"
  ],
  "s,s|1": [
   "孙子",
   "爷爷"
  ],
  "s,d|1": [
   "孙女",
   "爷爷"
  ],
  "d,s|1": [
   "外孙",
   "外公"
  ],
  "d,d|1": [
   "外孙女",
   "外公"
  ],
  "ob,s|1": [
   "侄子",
   "叔叔"
  ],
  "ob,d|1": [
   "侄女",
   "叔叔"
  ],
  "os,s|1": [
   "外甥",
   "小舅"
  ],
  "os,d|1": [
   "外甥女",
   "小舅"
  ],
  "ob,s,s|1": [
   "侄孙",
   "叔公"
  ],
  "f,ob,s,s|1": [
   "堂侄",
   "堂伯 / 堂叔"
  ],
  "s,s,s|1": [
   "曾孙",
   "太爷爷"
  ],
  "h,f|0": [
   "公公",
   "儿媳"
  ],
  "h,m|0": [
   "婆婆",
   "儿媳"
  ],
  "h,ob|0": [
   "大伯子",
   "弟妹"
  ],
  "h,lb|0": [
   "小叔子",
   "嫂子"
  ],
  "h,os|0": [
   "大姑子",
   "弟妹"
  ],
  "h,ls|0": [
   "小姑子",
   "嫂子"
  ],
  "h,ob,w|0": [
   "嫂子",
   "弟妹"
  ],
  "h,lb,w|0": [
   "弟妹",
   "嫂子"
  ],
  "h,os,h|0": [
   "姐夫",
   "弟妹"
  ],
  "h,ob,s|0": [
   "侄子",
   "婶婶"
  ],
  "h,os,s|0": [
   "外甥",
   "小舅妈"
  ],
  "h,f,f|0": [
   "爷爷",
   "孙媳妇"
  ],
  "h,f,ob|0": [
   "伯父",
   "侄媳妇"
  ],
  "w,f|1": [
   "岳父",
   "女婿"
  ],
  "w,m|1": [
   "岳母",
   "女婿"
  ],
  "w,ob|1": [
   "大舅子",
   "妹夫"
  ],
  "w,lb|1": [
   "小舅子",
   "姐夫"
  ],
  "w,os|1": [
   "大姨子",
   "妹夫"
  ],
  "w,ls|1": [
   "小姨子",
   "姐夫"
  ],
  "w,ob,w|1": [
   "嫂子",
   "妹夫"
  ],
  "w,ls,h|1": [
   "妹夫",
   "姐夫"
  ],
  "w,ob,s|1": [
   "内侄",
   "小姑父"
  ],
  "w,os,d|1": [
   "外甥女",
   "小姨父"
  ],
  "w,f,f|1": [
   "爷爷",
   "孙女婿"
  ],
  "w,m,xb|1": [
   "舅舅",
   "外甥女婿"
  ],
  "s,w,f|1": [
   "亲家公",
   "亲家公"
  ]
 },
 "refF": {
  "f,ob": [
   "伯父",
   "侄女"
  ],
  "ob,w": [
   "嫂子",
   "小姑子"
  ],
  "os,h": [
   "姐夫",
   "小姨子"
  ]
 },
 "ged": {
  "indi": 44,
  "fam": 16,
  "lines": 394
 },
 "key3": {
  "main": "堂姐 / 堂妹",
  "rev": "堂哥 / 堂弟"
 },
 "addWfBrother": "伯父",
 "addWfParents": [
  "爷爷",
  "奶奶"
 ]
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const O = ORACLE;
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const txt = async (sel) => ((await page.textContent(sel)) || '').trim();
  const disp = (sel) => page.$eval(sel, (n) => getComputedStyle(n).display);
  const onTab = async (t) => {
    await page.click(`#kl-tab-${t}`);
    await page.waitForFunction((t) => !document.querySelector(`#kl-pane-${t}`).hidden, t);
  };
  const query = async (q) => {
    await page.fill('#kl-q', q);
    await page.press('#kl-q', 'Enter');
  };
  const waitTerm = (v, i = 0) => page.waitForFunction(([v, i]) => { const e = document.querySelector('#kl-term-' + i); return e && e.textContent === v; }, [v, i]);

  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitTerm(O.key.main);
  assert(await page.locator('a[href="../../"]').first().isVisible(), '顶部有「← 返回工具集」');
  assert(await txt('#kl-navstat') === `本机 · ${O.nPeople} 人`, `导航统计 ${await txt('#kl-navstat')}`);

  // ── 1. 称谓计算：默认链 母→母→兄 ──
  assert(await txt('#kl-term-0') === O.key.main, `外婆的哥哥 = ${O.key.main}`);
  assert(await txt('#kl-rv-0') === O.key.rev, `TA 叫我 = ${O.key.rev}（实得 ${await txt('#kl-rv-0')}）`);
  assert((await txt('#kl-chain-0')) === '妈妈的妈妈的哥哥', '关系链');
  assert(await disp('#kl-res-empty') === 'none', '有结果时空状态计算样式为 none');
  const cnodes = await page.$$eval('#kl-chainbar .kl-cnode', (ns) => ns.map((n) => n.textContent));
  assert(JSON.stringify(cnodes) === JSON.stringify(['我', '妈妈', '妈妈', '哥哥']), `链条显示 ${cnodes.join('›')}`);
  // 对调：反过来算
  await page.click('#kl-rev');
  await waitTerm(O.key.revMain);
  assert(await page.inputValue('#kl-q') === O.key.revCodes.map((c) => ({ ls: '妹妹', d: '女儿', s: '儿子' })[c]).join('的'), `对调后输入框 ${await page.inputValue('#kl-q')}`);
  assert(await page.getAttribute('#kl-sex-' + O.key.revSex, 'aria-pressed') === 'true', '对调后性别跟着变');
  // 清空 → 空状态
  await page.click('#kl-clear');
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#kl-res-empty')).display !== 'none');
  assert(await page.$$eval('#kl-res .kl-cand', (n) => n.length) === 0, '清空后无候选');
  // 键盘：父 → 兄 → 女
  for (const k of ['f', 'ob', 'd']) await page.click(`#kl-pad [data-k="${k}"]`);
  await waitTerm(O.key3.main);
  assert(await txt('#kl-rv-0') === O.key3.rev, `堂姐/堂妹 叫我 ${O.key3.rev}`);
  await page.click('#kl-back');
  await waitTerm('伯父');
  assert(await txt('#kl-chain-0') === '爸爸的哥哥', '退格');
  // 文本输入：常见称谓 / 连写 / 排行
  for (const q of ['外婆的哥哥', '爸爸的爸爸的弟弟的儿子', '七舅姥爷', '妈妈的妈妈', '儿子的老婆的妈妈', '表哥的老婆']) {
    const G = O.calc[q + '|1'];
    await query(q);
    await waitTerm(G[0].main);
    assert(await page.$$eval('#kl-res .kl-cand', (n) => n.length) === G.length, `「${q}」候选数 ${G.length}`);
    assert(await txt('#kl-gen-0') === G[0].gen, `「${q}」辈分 ${G[0].gen}`);
    if (G[0].pair) assert(await txt('#kl-pair-0') === G[0].pair, `「${q}」合称 ${G[0].pair}`);
  }
  // 多义：爸爸的儿子 = 自己 / 哥哥 / 弟弟
  await query('爸爸的儿子');
  const G2 = O.calc['爸爸的儿子|1'];
  await page.waitForFunction((n) => document.querySelectorAll('#kl-res .kl-cand').length === n, G2.length);
  const mains = await page.$$eval('#kl-res .kl-term', (ns) => ns.map((n) => n.textContent));
  assert(JSON.stringify(mains) === JSON.stringify(G2.map((g) => g.main)), `多义候选 ${mains.join('、')}`);
  assert(await disp('#kl-multi') !== 'none', '多义提示可见');
  // 非法输入
  await query('abc');
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#kl-qerr')).display !== 'none');
  assert((await txt('#kl-qerr')).includes('不认识「abc」'), '不认识的词给出提示');
  await query('');
  await page.waitForFunction(() => document.querySelector('#kl-qerr').textContent.includes('请输入'));
  // 性别不符：我是男 + 老公的… → 提示并一键切换
  await page.click('#kl-sex-1');
  await query('老公的弟弟的老婆');
  await page.waitForSelector('#kl-invalid');
  assert((await txt('#kl-invalid')).includes('只有女性才有'), '男性视角下「老公」不成立');
  await page.click('#kl-flipsex');
  await waitTerm(O.calc['老公的弟弟的老婆|0'][0].main);
  assert(await page.getAttribute('#kl-sex-0', 'aria-pressed') === 'true', '已切成「我是女」');
  assert(await txt('#kl-pair-0') === O.calc['老公的弟弟的老婆|0'][0].pair, `妯娌合称 ${await txt('#kl-pair-0')}`);
  await page.click('#kl-sex-1');
  // 北方叫法
  await query('妈妈的妈妈');
  await waitTerm(O.north.std);
  await page.click('#kl-reg-north');
  await waitTerm(O.north.north);
  await page.click('#kl-reg-std');
  await waitTerm(O.north.std);
  // 例子
  await page.click('#kl-examples .kl-ex[data-i="0"]');
  await waitTerm(O.calc['外婆的哥哥|1'][0].main);
  assert(await txt('#kl-marry-0') === O.calc['外婆的哥哥|1'][0].marry, '禁婚说明');
  // 持久化
  await query('舅舅的女儿');
  await waitTerm(O.calc['舅舅的女儿|1'] ? O.calc['舅舅的女儿|1'][0].main : '表姐 / 表妹');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitTerm(O.calc['舅舅的女儿|1'] ? O.calc['舅舅的女儿|1'][0].main : '表姐 / 表妹');
  assert(true, 'reload 后结果仍在');
  // 键盘切页签
  await page.focus('#kl-tab-calc');
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => !document.querySelector('#kl-pane-tree').hidden);
  assert(await page.evaluate(() => document.activeElement.id) === 'kl-tab-tree', '方向键切到「家谱」并聚焦');
  assert(await disp('#kl-pane-calc') === 'none', '称谓页计算样式已隐藏');

  // ── 2. 家谱 ──
  await page.waitForFunction((n) => document.querySelectorAll('#kl-svg .kl-node').length === n, O.nPeople);
  const lab = (id) => page.$eval(`.kl-node[data-id="${id}"] .kl-nlab`, (n) => n.textContent);
  for (const id of Object.keys(O.labels)) assert(await lab(id) === O.labels[id], `卡片称谓 ${id} = ${O.labels[id]}（实得 ${await lab(id)}）`);
  assert(await lab('ego') === '我', '「我」的卡片');
  // 卡片两两不重叠（真实渲染盒）
  const boxes = await page.$$eval('#kl-svg .kl-node > rect:first-child', (rs) => rs.map((r) => { const b = r.getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom]; }));
  let ov = 0;
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) { const a = boxes[i], b = boxes[j]; if (a[0] < b[2] - 0.5 && b[0] < a[2] - 0.5 && a[1] < b[3] - 0.5 && b[1] < a[3] - 0.5) ov++; }
  assert(ov === 0, `卡片重叠 ${ov} 处`);
  // 子女在父母下方
  const ys = await page.evaluate(() => Object.fromEntries(window.KL_APP.layout().nodes.map((n) => [n.id, n.y])));
  assert(ys.c4 > ys.mos && ys.mos > ys.mgf && ys.ego > ys.fa && ys.son > ys.ego, '子女卡片在父母下方');
  // 找人 + 选中
  await page.fill('#kl-find', '黄思琪');
  await page.press('#kl-find', 'Enter');
  await page.waitForFunction(() => document.querySelector('#kl-i-name') && document.querySelector('#kl-i-name').textContent.includes('黄思琪'));
  assert(await txt('#kl-i-lab') === O.labels.c4, '检查器徽标');
  assert(await page.$eval('.kl-node[data-id="c4"] > rect', (r) => r.getAttribute('stroke')) === '#222222', '选中卡片描边');
  // 改名 → 卡片更新 → 撤销
  await page.fill('#kl-f-name', '黄思琪改');
  await page.press('#kl-f-name', 'Tab');
  await page.waitForFunction(() => document.querySelector('.kl-node[data-id="c4"] .kl-nname').textContent === '黄思琪改');
  await page.click('#kl-undo');
  await page.waitForFunction(() => document.querySelector('.kl-node[data-id="c4"] .kl-nname').textContent === '黄思琪');
  // 非法日期
  await page.fill('#kl-f-birth', '1988-13-01');
  await page.press('#kl-f-birth', 'Tab');
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#kl-f-err')).display !== 'none');
  assert((await txt('#kl-f-err')).includes('日期'), '非法日期报错');
  assert(await page.inputValue('#kl-f-birth') === '1988-06-06', '非法日期不落库');
  await page.fill('#kl-f-death', '1980-01-01');
  await page.press('#kl-f-death', 'Tab');
  await page.waitForFunction(() => document.querySelector('#kl-f-err').textContent.includes('早于出生'));
  // 键盘选中：聚焦卡片按回车
  await page.focus('.kl-node[data-id="ego"]');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.querySelector('#kl-i-name').textContent.includes('林小川'));
  // 添加儿子
  await page.click('#kl-addrow [data-add="son"]');
  await page.waitForFunction((n) => document.querySelectorAll('#kl-svg .kl-node').length === n + 1, O.nPeople);
  const newId = await page.evaluate(() => window.KL_APP.state().sel);
  assert(await lab(newId) === '儿子', `新加的儿子卡片称谓（实得 ${await lab(newId)}）`);
  await page.waitForFunction(() => document.activeElement && document.activeElement.id === 'kl-f-name');
  // 删除要点两下
  await page.click('#kl-del');
  assert(await page.$$eval('#kl-svg .kl-node', (n) => n.length) === O.nPeople + 1 && (await txt('#kl-del')).includes('再点一次'), '删除第一下只武装');
  await page.click('#kl-del');
  await page.waitForFunction((n) => document.querySelectorAll('#kl-svg .kl-node').length === n, O.nPeople);
  // 给没有父母的岳父加哥哥：自动补父母占位
  await page.fill('#kl-find', '周国强');
  await page.press('#kl-find', 'Enter');
  await page.waitForFunction(() => document.querySelector('#kl-i-name').textContent.includes('周国强'));
  await page.click('#kl-addrow [data-add="ob"]');
  await page.waitForFunction((n) => document.querySelectorAll('#kl-svg .kl-node').length === n + 3, O.nPeople);
  const bro = await page.evaluate(() => window.KL_APP.state().sel);
  assert(await lab(bro) === O.addWfBrother, `岳父的哥哥 = ${O.addWfBrother}（实得 ${await lab(bro)}）`);
  const parIds = await page.evaluate((b) => { const p = window.KL_APP.state().tree.people.find((q) => q.id === b); return [p.father, p.mother]; }, bro);
  assert(await lab(parIds[0]) === O.addWfParents[0] && await lab(parIds[1]) === O.addWfParents[1], `补出的占位父母 ${O.addWfParents.join('/')}`);
  await page.click('#kl-undo');
  await page.waitForFunction((n) => document.querySelectorAll('#kl-svg .kl-node').length === n, O.nPeople);
  // 关联已有成员：非法关系被拦下
  await page.fill('#kl-find', '周晴');
  await page.press('#kl-find', 'Enter');
  await page.waitForFunction(() => document.querySelector('#kl-i-name').textContent.includes('周晴'));
  await page.selectOption('#kl-link-who', 'lb');
  await page.selectOption('#kl-link-type', 'father');
  await page.click('#kl-link-go');
  await page.waitForFunction(() => document.querySelector('#kl-f-err').textContent.includes('已经有'));
  await page.selectOption('#kl-link-type', 'mother');
  await page.click('#kl-link-go');
  await page.waitForFunction(() => document.querySelector('#kl-f-err').textContent.includes('男性'));
  // 离婚 → 婚姻线变虚线 → 撤销
  await page.fill('#kl-find', '林小雨');
  await page.press('#kl-find', 'Enter');
  await page.waitForFunction(() => document.querySelector('#kl-i-name').textContent.includes('林小雨'));
  await page.selectOption('#kl-insp select[data-sp="osh"]', 'd');
  await page.waitForFunction(() => { const m = document.querySelector('.kl-marr[data-a="osh"][data-b="os"]'); return m && m.getAttribute('stroke-dasharray'); });
  await page.click('#kl-undo');
  await page.waitForFunction(() => !document.querySelector('.kl-marr[data-a="osh"][data-b="os"]').getAttribute('stroke-dasharray'));
  // 换视角：以儿子为「我」
  await page.selectOption('#kl-ego', 'son');
  await page.waitForFunction(() => document.querySelector('.kl-node[data-id="son"] .kl-nlab').textContent === '我');
  for (const id of Object.keys(O.labelsSon)) assert(await lab(id) === O.labelsSon[id], `儿子视角 ${id} = ${O.labelsSon[id]}（实得 ${await lab(id)}）`);
  await page.selectOption('#kl-ego', 'ego');
  await page.waitForFunction(() => document.querySelector('.kl-node[data-id="ego"] .kl-nlab').textContent === '我');
  // 缩放
  const vb = async () => (await page.getAttribute('#kl-svg', 'viewBox')).split(' ').map(Number);
  const v0 = await vb();
  await page.click('#kl-zoomin');
  await page.waitForFunction((w) => +document.querySelector('#kl-svg').getAttribute('viewBox').split(' ')[2] < w - 1, v0[2]);
  await page.click('#kl-fit');
  const L = await page.evaluate(() => window.KL_APP.layout());
  await page.waitForFunction((w) => +document.querySelector('#kl-svg').getAttribute('viewBox').split(' ')[2] >= w - 1, L.w);
  // 导出图片
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#kl-svgout')]);
  assert(dl.suggestedFilename().endsWith('.png') || dl.suggestedFilename().endsWith('.svg'), `导出文件 ${dl.suggestedFilename()}`);
  const ex = await page.evaluate(() => window.KL_LAST_EXPORT);
  assert(ex.kind === 'svg' && ex.text.includes('林小川') && (ex.text.match(/class="kl-node/g) || []).length === O.nPeople, '导出的 SVG 含全部卡片');

  // ── 3. 关系查询 ──
  await onTab('rel');
  const relCase = async (a, b) => {
    const R = O.rel[a + '|' + b];
    await page.selectOption('#kl-ra', a);
    await page.selectOption('#kl-rb', b);
    await page.waitForFunction((v) => document.querySelector('#kl-r-ab') && document.querySelector('#kl-r-ab').textContent === v, R.label);
    assert(await txt('#kl-r-ba') === R.back, `${a}→${b} 反向 ${R.back}`);
    assert(await txt('#kl-r-chain') === R.chain, `${a}→${b} 链 ${R.chain}`);
    assert((await txt('#kl-r-coef')).includes('φ = ' + R.phi), `${a}→${b} φ = ${R.phi}`);
    const pct = R.r === 0 ? '0' : (R.r * 100).toFixed(R.r >= 0.01 ? 2 : 3).replace(/\.?0+$/, '') + '%';
    assert((await txt('#kl-r-coef')).startsWith('r = ' + pct), `${a}→${b} r = ${pct}`);
    const cls = await page.getAttribute('#kl-r-marry', 'class');
    assert((cls || '').includes('kl-ban') === R.ban, `${a}→${b} 禁婚 ${R.ban}`);
    assert((await txt('#kl-r-marry')).includes(R.why), `${a}→${b} 禁婚理由`);
    if (R.pair) assert(await txt('#kl-r-pair') === R.pair, `${a}→${b} 合称 ${R.pair}`);
    const circles = await page.$$eval('#kl-pathfig circle', (n) => n.length);
    assert(circles === R.n + 1, `${a}→${b} 路径图 ${R.n + 1} 个人（实得 ${circles}）`);
  };
  for (const k of Object.keys(O.rel)) { const [a, b] = k.split('|'); await relCase(a, b); }
  await page.selectOption('#kl-ra', 'ego'); await page.selectOption('#kl-rb', 'c4');
  await page.waitForFunction((v) => document.querySelector('#kl-r-ab').textContent === v, O.rel['ego|c4'].label);
  await page.click('#kl-rswap');
  await page.waitForFunction((v) => document.querySelector('#kl-r-ab').textContent === v, O.rel['ego|c4'].back);

  // ── 4. 继承 ──
  await onTab('heir');
  const heirRows = () => page.$$eval('#kl-heirs tbody tr', (rs) => rs.map((r) => [r.dataset.id, r.querySelector('.kl-share').textContent, r.querySelector('.kl-bar i').getBoundingClientRect().width / r.querySelector('.kl-bar').getBoundingClientRect().width]));
  const expectHeirs = async (exp, tag) => {
    await page.waitForFunction((n) => document.querySelectorAll('#kl-heirs tbody tr').length === n, exp.length);
    const rows = await heirRows();
    const got = rows.map((r) => r[0] + ':' + r[1]).sort().join(','), want = exp.map((h) => h[0] + ':' + h[1]).sort().join(',');
    assert(got === want, `${tag} 继承人与份额 ${got} = ${want}`);
    rows.forEach((r) => { const [n, d] = r[1].split('/').map(Number); const v = d ? n / d : n; assert(Math.abs(r[2] - v) < 0.01, `${tag} 份额条宽度 ${r[0]} ${r[2].toFixed(3)} ≈ ${v}`); });
  };
  await page.selectOption('#kl-hx', 'mgf');
  await expectHeirs(O.heir.mgf, '外公');
  assert(await txt('#kl-h-order') === '第一顺序继承人', '第一顺序');
  assert(await txt('#kl-h-total') === '份额合计：1', '份额合计 1');
  await page.click('input[data-widow="mosh"]');
  await expectHeirs(O.heir.mgfWidow, '外公 + 丧偶女婿');
  await page.click('input[data-widow="mosh"]');
  await expectHeirs(O.heir.mgf, '取消勾选');
  await page.selectOption('#kl-hx', 'gf');
  await expectHeirs(O.heir.gf, '爷爷');
  await page.selectOption('#kl-hx', 'mgmb');
  await expectHeirs(O.heir.mgmb, '舅外公');
  assert(await txt('#kl-h-order') === (O.heir.mgmbOrder === 2 ? '第二顺序继承人' : '第一顺序继承人'), '舅外公：第二顺序');
  await page.fill('#kl-hdate', 'abc');
  await page.press('#kl-hdate', 'Tab');
  await page.waitForSelector('#kl-h-err');
  await page.fill('#kl-hdate', '');
  await page.press('#kl-hdate', 'Tab');
  await page.waitForSelector('#kl-heirs');

  // ── 5. 速查表（能力清单：每一行都要算得出，且等于真值） ──
  await onTab('ref');
  const refRows = await page.$$eval('#kl-refgrid tr[data-k]', (rs) => rs.map((r) => [r.dataset.k + '|' + r.dataset.sex, r.querySelector('.kl-ref-t').textContent, r.querySelector('.kl-ref-r').textContent]));
  assert(refRows.length === Object.keys(O.ref).length, `速查表行数 ${refRows.length} = ${Object.keys(O.ref).length}`);
  const dead = refRows.filter((r) => !O.ref[r[0]] || r[1] !== O.ref[r[0]][0] || r[2] !== O.ref[r[0]][1] || r[1] === '—');
  assert(dead.length === 0, `速查表与真值不符：${dead.map((d) => d.join('=')).slice(0, 5).join('；')}`);
  await page.click('#kl-refsex-0');
  await page.waitForFunction(() => document.querySelector('tr[data-k="f,ob"]').dataset.sex === '0');
  for (const k of Object.keys(O.refF)) {
    const got = await page.$eval(`tr[data-k="${k}"][data-sex="0"]`, (r) => [r.querySelector('.kl-ref-t').textContent, r.querySelector('.kl-ref-r').textContent]);
    assert(got[0] === O.refF[k][0] && got[1] === O.refF[k][1], `女性视角 ${k}：${got.join('/')} = ${O.refF[k].join('/')}`);
  }
  await page.click('#kl-refsex-1');
  await page.click('tr[data-k="m,m,xb"] button');
  await page.waitForFunction(() => !document.querySelector('#kl-pane-calc').hidden);
  await waitTerm(O.ref['m,m,xb|1'][0]);

  // ── 6. 数据 ──
  await onTab('data');
  assert(await txt('#kl-k-n') === String(O.nPeople) && await txt('#kl-k-g') === String(O.gens) && await txt('#kl-k-u') === String(O.nUnions) && await txt('#kl-k-f') === String(O.nWithParent), 'KPI：人数 / 代数 / 婚姻 / 有父母记录');
  assert(await page.locator('#kl-valid-ok').count() === 1, '示例家族体检无问题');
  const [g1] = await Promise.all([page.waitForEvent('download'), page.click('#kl-expged')]);
  const gedText = fs.readFileSync(await g1.path(), 'utf8');
  assert(gedText.startsWith('0 HEAD') && gedText.includes('1 CHAR UTF-8') && gedText.trimEnd().endsWith('0 TRLR'), 'GEDCOM 头尾');
  assert((gedText.match(/^0 @[^@]+@ INDI$/gm) || []).length === O.ged.indi && (gedText.match(/^0 @[^@]+@ FAM$/gm) || []).length === O.ged.fam, `GEDCOM ${O.ged.indi} 人 ${O.ged.fam} 家庭`);
  const [j1] = await Promise.all([page.waitForEvent('download'), page.click('#kl-expjson')]);
  const js = JSON.parse(fs.readFileSync(await j1.path(), 'utf8'));
  assert(js.tree.people.length === O.nPeople && js.ego === 'ego', 'JSON 备份');
  // 粘贴导入 GEDCOM
  const smallGed = '0 HEAD\n1 CHAR UTF-8\n0 @I1@ INDI\n1 NAME 张 /三/\n1 SEX M\n1 FAMS @F1@\n0 @I2@ INDI\n1 NAME 李四\n1 SEX F\n1 FAMS @F1@\n0 @I3@ INDI\n1 NAME 张小五\n1 SEX F\n1 BIRT\n2 DATE 12 JUN 1990\n1 FAMC @F1@\n0 @F1@ FAM\n1 HUSB @I1@\n1 WIFE @I2@\n1 CHIL @I3@\n0 TRLR\n';
  await page.fill('#kl-paste', smallGed);
  await page.click('#kl-pastego');
  await page.waitForSelector('#kl-imp-ok');
  assert((await txt('#kl-imp-ok')).includes('3 人、1 个家庭'), `导入提示 ${await txt('#kl-imp-ok')}`);
  assert(await txt('#kl-k-n') === '3', 'KPI 变成 3 人');
  // 导入后在家谱里撤销
  await onTab('tree');
  await page.waitForFunction(() => document.querySelectorAll('#kl-svg .kl-node').length === 3);
  await page.click('#kl-undo');
  await page.waitForFunction((n) => document.querySelectorAll('#kl-svg .kl-node').length === n, O.nPeople);
  await onTab('data');
  // 非法内容
  await page.fill('#kl-paste', 'hello world');
  await page.click('#kl-pastego');
  await page.waitForFunction(() => document.querySelector('#kl-impmsg').textContent.includes('不是 GEDCOM'));
  await page.fill('#kl-paste', '{"people":[{"id":"a","name":"A","sex":1},{"id":"a","name":"B","sex":0}]}');
  await page.click('#kl-pastego');
  await page.waitForFunction(() => document.querySelector('#kl-impmsg').textContent.includes('id 重复'));
  // 带问题的 JSON：子女比父母出生早 → 体检报出来
  await page.fill('#kl-paste', JSON.stringify({ tree: { people: [{ id: 'a', name: '老爸', sex: 1, birth: '1990' }, { id: 'b', name: '孩子', sex: 0, birth: '1980', father: 'a' }], unions: [] } }));
  await page.click('#kl-pastego');
  await page.waitForFunction(() => document.querySelector('#kl-valid').textContent.includes('比父母'));
  // 文件导入（用刚才导出的 GEDCOM）
  await page.setInputFiles('#kl-file', await g1.path());
  await page.waitForFunction((n) => document.querySelector('#kl-imp-ok') && document.querySelector('#kl-imp-ok').textContent.includes(n + ' 人'), O.nPeople);
  // 清空要点两下，再载入示例
  await page.click('#kl-wipe');
  assert(await txt('#kl-k-n') === String(O.nPeople) && (await txt('#kl-wipe')).includes('再点一次'), '清空第一下只武装');
  await page.click('#kl-wipe');
  await page.waitForFunction(() => document.querySelector('#kl-k-n').textContent === '0');
  await page.click('#kl-sample');
  await page.waitForFunction((n) => document.querySelector('#kl-k-n').textContent === String(n), O.nPeople);

  // ── 7. 渲染守卫（逐页签 × 逐视口） ──
  await onTab('tree');
  await page.fill('#kl-find', '林小川');
  await page.press('#kl-find', 'Enter');
  await page.waitForFunction(() => document.querySelector('#kl-i-name'));
  await onTab('rel');
  await page.selectOption('#kl-ra', 'son'); await page.selectOption('#kl-rb', 'mgmb');
  await page.waitForSelector('#kl-pathfig');
  const n = await renderGuards(page, {
    assert, tabs: O.meta.tabs, onTab,
    paneSel: (t) => `#kl-pane-${t}`, panesRoot: '#kl-panes',
    figSel: (t) => (t === 'tree' ? '#kl-svg' : t === 'rel' ? '#kl-pathfig' : `#kl-pane-${t} svg.kl-nofig`),
    cardSel: '.kl-card', minControls: 100, minTextsInFig: 6,
  });
  assert(n >= 100, `累计扫到可见控件 ${n}`);
  assert(errors.length === 0, `页面无 JS 错误：${errors.join(' | ')}`);

  // ── 缩略图 ──
  await onTab('calc');
  await query('外婆的哥哥');
  await waitTerm(O.calc['外婆的哥哥|1'][0].main);
  await page.evaluate(() => window.scrollTo(0, 0));
  // 截图前等提示条自己消失（2026-10-11 教训：缩略图截到了「已复制」toast）
  await page.waitForFunction(() => document.getElementById('kl-toast').hidden, null, { timeout: 8000 });
  assert(await disp('#kl-toast') === 'none', '截图时没有可见的提示条');
  await screenshot('thumb.png');
};
