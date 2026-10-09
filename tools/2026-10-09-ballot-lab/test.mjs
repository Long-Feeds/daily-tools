/* 计票工作台 · 集成测试
 *
 * 真值来源：run 目录 oracle/presets_oracle.py —— 11 种计票法与孔多塞胜者 / Smith 集 / 两两矩阵
 * 全部由 pref_voting 1.18 计算（截断选票的 Bucklin 因 pref_voting 该函数差一级的 bug，改用独立实现）；
 * 席位分配由 Fraction 写的「全部商值精确排序取第 H 大为界」实现计算（引擎是逐席贪心，两种算法）。
 * 由 inject-oracle.mjs 机械注入下面的 ORACLE 块，本文件不手打任何计票结果。
 */
import {
  guardHidden, guardUniqueIds, guardControlSize, guardTextTransform, guardOverflow, guardEscape, guardFigText,
} from '/Users/lon/.agents/cron/daily-website/tools/render-guards.mjs';

const ORACLE = {
 "ballots": {
  "tn": {
   "names": [
    "孟菲斯",
    "纳什维尔",
    "查塔努加",
    "诺克斯维尔"
   ],
   "n": 100,
   "m": 4,
   "errors": 0,
   "winners": {
    "copeland": "纳什维尔",
    "minimax": "纳什维尔",
    "schulze": "纳什维尔",
    "rp": "纳什维尔",
    "kemeny": "纳什维尔",
    "plurality": "孟菲斯",
    "runoff": "纳什维尔",
    "irv": "诺克斯维尔",
    "coombs": "纳什维尔",
    "borda": "纳什维尔",
    "bucklin": "纳什维尔"
   },
   "cw": "纳什维尔",
   "smith": "纳什维尔",
   "N": [
    [
     0,
     42,
     42,
     42
    ],
    [
     58,
     0,
     68,
     68
    ],
    [
     58,
     32,
     0,
     83
    ],
    [
     58,
     32,
     17,
     0
    ]
   ],
   "complete": true
  },
  "squeeze": {
   "names": [
    "激进派",
    "温和派",
    "保守派"
   ],
   "n": 100,
   "m": 3,
   "errors": 0,
   "winners": {
    "copeland": "温和派",
    "minimax": "温和派",
    "schulze": "温和派",
    "rp": "温和派",
    "kemeny": "温和派",
    "plurality": "激进派",
    "runoff": "激进派",
    "irv": "激进派",
    "coombs": "温和派",
    "borda": "温和派",
    "bucklin": "温和派"
   },
   "cw": "温和派",
   "smith": "温和派",
   "N": [
    [
     0,
     35,
     51
    ],
    [
     65,
     0,
     67
    ],
    [
     49,
     33,
     0
    ]
   ],
   "complete": true
  },
  "cycle": {
   "names": [
    "甲",
    "乙",
    "丙"
   ],
   "n": 21,
   "m": 3,
   "errors": 0,
   "winners": {
    "copeland": "甲、乙、丙",
    "minimax": "甲",
    "schulze": "甲",
    "rp": "甲",
    "kemeny": "甲",
    "plurality": "甲",
    "runoff": "甲",
    "irv": "甲",
    "coombs": "甲",
    "borda": "甲、乙",
    "bucklin": "乙"
   },
   "cw": null,
   "smith": "甲、乙、丙",
   "N": [
    [
     0,
     14,
     8
    ],
    [
     7,
     0,
     15
    ],
    [
     13,
     6,
     0
    ]
   ],
   "complete": true
  },
  "lunch": {
   "names": [
    "火锅",
    "烧烤",
    "日料",
    "粤菜",
    "西餐"
   ],
   "n": 16,
   "m": 5,
   "errors": 0,
   "winners": {
    "copeland": "粤菜",
    "minimax": "粤菜",
    "schulze": "粤菜",
    "rp": "粤菜",
    "kemeny": "粤菜",
    "plurality": "火锅、粤菜",
    "runoff": "粤菜",
    "irv": "日料",
    "coombs": null,
    "borda": "粤菜",
    "bucklin": "日料、粤菜"
   },
   "cw": null,
   "smith": "火锅、烧烤、日料、粤菜",
   "N": [
    [
     0,
     5,
     7,
     6,
     7
    ],
    [
     3,
     0,
     7,
     7,
     7
    ],
    [
     8,
     9,
     0,
     5,
     7
    ],
    [
     7,
     7,
     6,
     0,
     9
    ],
    [
     5,
     5,
     2,
     2,
     0
    ]
   ],
   "complete": false
  },
  "borda": {
   "names": [
    "方案A",
    "方案B",
    "方案C",
    "方案D"
   ],
   "n": 5,
   "m": 4,
   "errors": 0,
   "winners": {
    "copeland": "方案A",
    "minimax": "方案A",
    "schulze": "方案A",
    "rp": "方案A",
    "kemeny": "方案A",
    "plurality": "方案A",
    "runoff": "方案A",
    "irv": "方案A",
    "coombs": "方案A",
    "borda": "方案B",
    "bucklin": "方案A"
   },
   "cw": "方案A",
   "smith": "方案A",
   "N": [
    [
     0,
     3,
     3,
     3
    ],
    [
     2,
     0,
     5,
     5
    ],
    [
     2,
     0,
     0,
     5
    ],
    [
     2,
     0,
     0,
     0
    ]
   ],
   "complete": true
  }
 },
 "apportion": {
  "alabama": {
   "names": [
    "甲州",
    "乙州",
    "丙州"
   ],
   "H": 10,
   "res": {
    "dhondt": {
     "seats": [
      5,
      4,
      1
     ],
     "tie": [
      0,
      1
     ]
    },
    "sainte": {
     "seats": [
      5,
      4,
      1
     ],
     "tie": [
      0,
      1,
      2
     ]
    },
    "msainte": {
     "seats": [
      5,
      4,
      1
     ],
     "tie": [
      0,
      1,
      2
     ]
    },
    "adams": {
     "seats": [
      4,
      4,
      2
     ],
     "tie": []
    },
    "hh": {
     "seats": [
      4,
      4,
      2
     ],
     "tie": []
    },
    "hare": {
     "seats": [
      4,
      4,
      2
     ],
     "tie": []
    },
    "droop": {
     "seats": [
      5,
      4,
      1
     ],
     "tie": [
      0,
      1
     ]
    }
   },
   "gallagher": {
    "dhondt": 6.23,
    "sainte": 6.23,
    "msainte": 6.23,
    "adams": 4.95,
    "hh": 4.95,
    "hare": 4.95,
    "droop": 6.23
   },
   "events": [
    [
     4,
     2,
     1,
     0
    ],
    [
     11,
     2,
     2,
     1
    ]
   ],
   "scan": "hare",
   "max": 14
  },
  "parl": {
   "names": [
    "进步联盟",
    "人民党",
    "绿党",
    "自由民主党",
    "工人党",
    "海盗党",
    "独立名单"
   ],
   "H": 120,
   "res": {
    "dhondt": {
     "seats": [
      45,
      37,
      17,
      12,
      9,
      0,
      0
     ],
     "tie": []
    },
    "sainte": {
     "seats": [
      45,
      37,
      17,
      12,
      9,
      0,
      0
     ],
     "tie": []
    },
    "msainte": {
     "seats": [
      45,
      37,
      17,
      12,
      9,
      0,
      0
     ],
     "tie": []
    },
    "adams": {
     "seats": [
      44,
      37,
      17,
      12,
      10,
      0,
      0
     ],
     "tie": []
    },
    "hh": {
     "seats": [
      45,
      37,
      17,
      12,
      9,
      0,
      0
     ],
     "tie": []
    },
    "hare": {
     "seats": [
      45,
      37,
      17,
      12,
      9,
      0,
      0
     ],
     "tie": []
    },
    "droop": {
     "seats": [
      45,
      37,
      17,
      12,
      9,
      0,
      0
     ],
     "tie": []
    }
   },
   "gallagher": {
    "dhondt": 3.63,
    "sainte": 3.63,
    "msainte": 3.63,
    "adams": 3.45,
    "hh": 3.63,
    "hare": 3.63,
    "droop": 3.63
   },
   "events": [],
   "scan": "sainte",
   "max": 30
  },
  "small": {
   "names": [
    "甲党",
    "乙党",
    "丙党",
    "丁党",
    "戊党",
    "己党"
   ],
   "H": 10,
   "res": {
    "dhondt": {
     "seats": [
      5,
      2,
      2,
      1,
      0,
      0
     ],
     "tie": []
    },
    "sainte": {
     "seats": [
      4,
      2,
      2,
      1,
      1,
      0
     ],
     "tie": []
    },
    "msainte": {
     "seats": [
      5,
      2,
      2,
      1,
      0,
      0
     ],
     "tie": []
    },
    "adams": {
     "seats": [
      3,
      2,
      2,
      1,
      1,
      1
     ],
     "tie": []
    },
    "hh": {
     "seats": [
      4,
      2,
      1,
      1,
      1,
      1
     ],
     "tie": []
    },
    "hare": {
     "seats": [
      5,
      2,
      1,
      1,
      1,
      0
     ],
     "tie": []
    },
    "droop": {
     "seats": [
      5,
      2,
      2,
      1,
      0,
      0
     ],
     "tie": []
    }
   },
   "gallagher": {
    "dhondt": 6.84,
    "sainte": 7.47,
    "msainte": 6.84,
    "adams": 13.95,
    "hh": 9.1,
    "hare": 6.61,
    "droop": 6.84
   },
   "events": [
    [
     16,
     5,
     1,
     0
    ]
   ],
   "scan": "hare",
   "max": 20
  }
 },
 "meta": {
  "tabs": [
   "ballots",
   "results",
   "rounds",
   "pairs",
   "seats",
   "library",
   "guide"
  ]
 },
 "tn_irv": {
  "winners": [
   3
  ],
  "elim": [
   [
    2
   ],
   [
    1
   ]
  ]
 },
 "pick": {
  "plurality": "乙",
  "irv": "乙",
  "borda": "乙",
  "schulze": "乙",
  "copeland": "乙",
  "borda_scores": [
   8,
   10,
   6
  ]
 },
 "tn_spoil": {
  "孟菲斯": {
   "irv": "纳什维尔"
  },
  "纳什维尔": {
   "irv": "查塔努加"
  },
  "查塔努加": {
   "runoff": "诺克斯维尔"
  },
  "诺克斯维尔": {
   "runoff": "查塔努加"
  }
 }
};

const METHODS = ['plurality', 'runoff', 'irv', 'coombs', 'borda', 'bucklin', 'copeland', 'minimax', 'schulze', 'rp', 'kemeny'];
const APP = ['dhondt', 'sainte', 'msainte', 'hare', 'droop', 'hh', 'adams'];

export default async ({ page, toolURL, screenshot, assert }) => {
  const T = ORACLE.meta.tabs;
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(toolURL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => document.querySelectorAll('#bl-mgrid .bl-mcard').length === 11, null, { timeout: 10000 });

  const onTab = async (t) => {
    await page.click(`#bl-tab-${t}`);
    await page.waitForFunction((t) => !document.getElementById(`bl-pane-${t}`).hidden, t, { timeout: 5000 });
  };

  // 顶部返回链接
  assert((await page.getAttribute('a.bl-back', 'href')) === '../../', '返回链接应指向 ../../');

  // ── 1. 每个示例 × 11 种方法的胜者对 pref_voting ──
  const winnersOnPage = () => page.$$eval('#bl-mgrid .bl-mcard', (cs) => Object.fromEntries(cs.map((c) => [
    c.id.replace('bl-mcard-', ''), c.querySelector('.bl-mwin').firstChild.textContent.trim(),
  ])));
  for (const id of Object.keys(ORACLE.ballots)) {
    const O = ORACLE.ballots[id];
    await onTab('ballots');
    await page.selectOption('#bl-preset', id);
    await page.click('#bl-preset-load');
    await page.waitForFunction((n) => /已读入/.test(document.getElementById('bl-parse-ok').textContent) &&
      document.getElementById('bl-parse-ok').textContent.includes(n.toLocaleString('zh-CN') + ' 张选票'), O.n, { timeout: 5000 });
    assert((await page.$$('#bl-errs li')).length === O.errors, `${id}：示例不应有解析错误`);
    const W = await winnersOnPage();
    for (const m of METHODS) {
      const want = O.winners[m] === null ? '不适用' : O.winners[m];
      assert(W[m] === want, `${id}：${m} 胜者应为 ${want}，页面为 ${W[m]}`);
    }
    // 并列标签：凡多胜者必须带「并列」
    for (const m of METHODS) {
      if (O.winners[m] && O.winners[m].includes('、')) {
        assert(await page.$(`#bl-mcard-${m} .bl-tag-org`), `${id}：${m} 有并列胜者，应显示并列标签`);
      }
    }
    const cw = await page.textContent('#bl-mock-cw');
    assert(O.cw ? cw === O.cw : /不存在/.test(cw), `${id}：孔多塞胜者应为 ${O.cw}，摘要卡为 ${cw}`);
    // 两两矩阵逐格
    await onTab('pairs');
    for (let i = 0; i < O.m; i++) for (let j = 0; j < O.m; j++) {
      if (i === j) continue;
      const v = await page.textContent(`#bl-n-${i}-${j}`);
      assert(+v.replace(/,/g, '') === O.N[i][j], `${id}：N[${i}][${j}] 应为 ${O.N[i][j]}，页面 ${v}`);
      const cls = await page.getAttribute(`#bl-n-${i}-${j}`, 'class');
      const want = O.N[i][j] > O.N[j][i] ? 'bl-win' : O.N[i][j] < O.N[j][i] ? 'bl-lose' : 'bl-draw';
      assert(cls.includes(want), `${id}：N[${i}][${j}] 着色应为 ${want}`);
    }
    const smith = await page.textContent('#bl-smith');
    assert(smith.includes('Smith 集：{' + O.smith + '}'), `${id}：Smith 集应为 ${O.smith}，页面：${smith}`);
    // 多数关系图：边数 = C(m,2)，名字标签一个不少，孔多塞胜者节点为绿色
    const g = await page.evaluate(() => ({
      edges: document.querySelectorAll('#bl-graph .bl-edge').length,
      labels: [...document.querySelectorAll('#bl-graph .bl-glabel')].map((t) => t.firstChild.textContent),
      green: [...document.querySelectorAll('#bl-graph .bl-node')].map((c) => c.getAttribute('fill') === '#1aae39'),
    }));
    assert(g.edges === O.m * (O.m - 1) / 2, `${id}：图应有 ${O.m * (O.m - 1) / 2} 条边，实得 ${g.edges}`);
    assert(g.labels.length === O.m, `${id}：图上名字标签应画出 ${O.m} 个，实得 ${g.labels.length}`);
    assert(g.green.filter(Boolean).length === (O.cw ? 1 : 0), `${id}：绿色节点数应为 ${O.cw ? 1 : 0}`);
    if (O.cw) assert(g.green[O.names.indexOf(O.cw)], `${id}：绿色节点应是孔多塞胜者`);
  }

  // ── 2. 即时决选逐轮（tn）+ 条形几何 ──
  await onTab('ballots');
  await page.selectOption('#bl-preset', 'tn');
  await page.click('#bl-preset-load');
  await page.waitForFunction(() => document.querySelector('#bl-mcard-irv .bl-mwin').textContent.includes('诺克斯维尔'), null, { timeout: 5000 });
  await onTab('rounds');
  const rounds = await page.$$eval('#bl-irv .bl-round', (rs) => rs.map((r) => r.dataset.out));
  const elim = ORACLE.tn_irv.elim.map((x) => x.join(','));
  assert(rounds.length === elim.length + 1, `tn：IRV 应有 ${elim.length + 1} 轮，实得 ${rounds.length}`);
  elim.forEach((e, k) => assert(rounds[k] === e, `tn：第 ${k + 1} 轮淘汰应为 ${e}，实得 ${rounds[k]}`));
  const geo = await page.evaluate(() => {
    const row = document.querySelector('#bl-irv-r1 .bl-rrow');
    const track = row.querySelector('.bl-rtrack').getBoundingClientRect();
    const fill = row.querySelector('.bl-rfill').getBoundingClientRect();
    const need = row.querySelector('.bl-rneed').getBoundingClientRect();
    return { ratio: fill.width / track.width, needAt: (need.left + 1 - track.left) / track.width, name: row.querySelector('.bl-rname').textContent };
  });
  const tn = ORACLE.ballots.tn;
  assert(geo.name === '孟菲斯', '第 1 轮最长条应是孟菲斯');
  assert(Math.abs(geo.ratio - tn.N[0][1] / tn.n) < 0.01, `孟菲斯首轮条形比例应为 ${tn.N[0][1] / tn.n}，实得 ${geo.ratio.toFixed(3)}`);
  assert(Math.abs(geo.needAt - (Math.floor(tn.n / 2) + 1) / tn.n) < 0.01, `过半线位置不对：${geo.needAt.toFixed(3)}`);
  // 博达分逐项（tn 排满，经典 Borda：第 1 名 m-1 分）——用两两矩阵的行和交叉核对
  for (let c = 0; c < tn.m; c++) {
    const want = tn.N[c].reduce((a, b) => a + b, 0);
    const got = +(await page.textContent(`#bl-borda-${c}`)).replace(/[^\d.]/g, '');
    assert(got === want, `tn：${tn.names[c]} 博达分应为 ${want}（矩阵行和），页面 ${got}`);
  }
  // 库姆斯表、巴克林表存在且行数对
  assert((await page.$$('#bl-coombs-t tbody tr')).length >= 1, '库姆斯逐轮表应有内容');
  assert((await page.$$('#bl-bucklin-t tbody tr')).length === tn.m, '巴克林表每位候选人一行');

  // ── 3. 搅局者（tn）──
  await onTab('results');
  const spoil = await page.$$eval('#bl-spoil tbody tr[data-removed]', (rs) => rs.map((r) => ({ who: r.querySelector('th').textContent, txt: r.querySelector('td').textContent })));
  for (const [who, ch] of Object.entries(ORACLE.tn_spoil)) {
    const row = spoil.find((s) => s.who === who);
    assert(row, `搅局者表应有「${who}」一行`);
    if (ch.irv) assert(row.txt.includes('即时决选') && row.txt.includes('→ ' + ch.irv), `拿掉 ${who} 后 IRV 应变为 ${ch.irv}：${row.txt}`);
    if (ch.runoff) assert(row.txt.includes('两轮决选') && row.txt.includes('→ ' + ch.runoff), `拿掉 ${who} 后两轮决选应变为 ${ch.runoff}：${row.txt}`);
  }

  // ── 4. 点选录票 ──
  await onTab('ballots');
  await page.click('#bl-clear');
  await page.fill('#bl-ballots', '候选人: 甲, 乙, 丙\n3: 丙 > 甲 > 乙\n');
  await page.waitForFunction(() => document.querySelectorAll('#bl-pick-grid .bl-pick').length === 3, null, { timeout: 5000 });
  assert(await page.isDisabled('#bl-pick-add'), '未选择时「加入」应禁用');
  await page.click('#bl-pick-1');
  await page.click('#bl-pick-0');
  assert((await page.textContent('#bl-pick-order')) === '乙 > 甲', '点选顺序应显示 乙 > 甲');
  await page.click('#bl-pick-2'); await page.click('#bl-pick-2'); // 再点一次取消
  assert((await page.getAttribute('#bl-pick-2', 'aria-pressed')) === 'false', '再点一次应取消选择');
  await page.fill('#bl-pick-n', '0');
  await page.click('#bl-pick-add');
  assert(!(await page.inputValue('#bl-ballots')).includes('0: 乙'), '票数 0 不应被加入');
  await page.fill('#bl-pick-n', '5');
  await page.click('#bl-pick-add');
  assert((await page.inputValue('#bl-ballots')).includes('5: 乙 > 甲'), '点选结果应追加成「5: 乙 > 甲」');
  await page.waitForFunction(() => document.getElementById('bl-parse-ok').textContent.includes('8 张选票'), null, { timeout: 5000 });
  const W2 = await winnersOnPage();
  for (const m of ['plurality', 'irv', 'borda', 'schulze', 'copeland']) assert(W2[m] === ORACLE.pick[m], `点选用例：${m} 应为 ${ORACLE.pick[m]}，实得 ${W2[m]}`);

  // ── 5. 非法输入 ──
  await page.fill('#bl-ballots', '候选人: 甲, 乙\nx: 甲 > 乙\n2: 甲 > 甲\n2: 甲 = 乙\n1: 甲 > 丁\n0: 乙\n1: 甲 >> 乙\n4: 乙 > 甲\n');
  await page.waitForFunction(() => document.querySelectorAll('#bl-errs li').length === 6, null, { timeout: 5000 });
  const errs = await page.$$eval('#bl-errs li', (ls) => ls.map((l) => l.textContent));
  assert(/第 3 行.*出现了两次/.test(errs.join('|')), '应报告同一选票重复候选人');
  assert(/第 4 行.*并列/.test(errs.join('|')), '应报告不支持并列');
  assert(/第 5 行.*未声明.*丁/.test(errs.join('|')), '应报告未声明候选人');
  assert(/第 6 行.*正整数/.test(errs.join('|')), '应报告票数 0 无效');
  assert(/空项/.test(errs.join('|')), '应报告 >> 空项');
  assert((await page.textContent('#bl-parse-ok')).includes('4 张选票'), '有错的行应跳过、合法行照常计票');
  // 完全空 → 结果页提示
  await page.fill('#bl-ballots', '');
  await page.waitForFunction(() => document.getElementById('bl-parse-ok').textContent === '还没有有效选票', null, { timeout: 5000 });
  assert((await page.$$('#bl-mgrid .bl-mcard')).length === 0, '无选票时不应渲染结果卡');
  // 超过 12 位候选人
  await page.fill('#bl-ballots', '1: ' + Array.from({ length: 13 }, (_, i) => 'c' + i).join(' > '));
  await page.waitForFunction(() => /最多 12 位/.test(document.getElementById('bl-errs').textContent), null, { timeout: 5000 });

  // ── 6. 席位分配：三个示例 × 7 种方法逐格对拍 ──
  await onTab('seats');
  for (const id of Object.keys(ORACLE.apportion)) {
    const O = ORACLE.apportion[id];
    await page.selectOption('#bl-app-preset', id);
    await page.click('#bl-app-load');
    await page.waitForFunction((H) => document.getElementById('bl-seats').value === String(H) && document.querySelector('#bl-app-table tbody'), O.H, { timeout: 5000 });
    for (const m of APP) {
      const seats = await page.$$eval(O.names.map((_, i) => `#bl-s-${m}-${i}`).join(','), (cs) => cs.map((c) => +c.dataset.seats));
      assert(JSON.stringify(seats) === JSON.stringify(O.res[m].seats), `${id}：${m} 席位应为 ${O.res[m].seats}，页面 ${seats}`);
      assert(seats.reduce((a, b) => a + b, 0) === O.H, `${id}：${m} 席位总和应为 ${O.H}`);
      const g = await page.textContent(`#bl-g-${m}`);
      assert(Math.abs(+g - O.gallagher[m]) < 0.006, `${id}：${m} 加拉格尔指数应为 ${O.gallagher[m]}，页面 ${g}`);
      const tieShown = !!(await page.$(`#bl-tie-${m}`));
      assert(tieShown === O.res[m].tie.length > 0, `${id}：${m} 并列提示应${O.res[m].tie.length ? '出现' : '不出现'}`);
      if (tieShown) {
        const t = await page.textContent(`#bl-tie-${m}`);
        for (const i of O.res[m].tie) assert(t.includes(O.names[i]), `${id}：${m} 并列提示应含 ${O.names[i]}`);
      }
    }
    // 阿拉巴马扫描：悖论格子一一对上
    const par = await page.$$eval('#bl-scan td.bl-par', (cs) => cs.map((c) => c.id));
    const want = O.events.map(([h, i]) => `bl-sc-${h}-${i}`);
    assert(JSON.stringify(par) === JSON.stringify(want), `${id}：悖论格应为 ${want}，页面 ${par}`);
    for (const [h, i, , to] of O.events) assert((await page.textContent(`#bl-sc-${h}-${i}`)).startsWith(String(to)), `${id}：H=${h} 时应为 ${to} 席`);
  }
  // 门槛：parl 示例 5% 门槛下最后两份名单不参与
  await page.selectOption('#bl-app-preset', 'parl');
  await page.click('#bl-app-load');
  await page.waitForFunction(() => document.querySelectorAll('#bl-app-table .bl-tag-gry').length === 2, null, { timeout: 5000 });
  // 改门槛为 0：所有名单参与，未过门槛标签消失，席位总数仍为 H
  await page.fill('#bl-thresh', '0');
  await page.waitForFunction(() => document.querySelectorAll('#bl-app-table .bl-tag-gry').length === 0, null, { timeout: 5000 });
  const sum0 = await page.$$eval('[id^="bl-s-dhondt-"]', (cs) => cs.reduce((a, c) => a + +c.dataset.seats, 0));
  assert(sum0 === ORACLE.apportion.parl.H, '去掉门槛后席位总和仍为 H');
  // 非法席位
  await page.fill('#bl-seats', '0');
  await page.waitForFunction(() => /1–2000/.test(document.getElementById('bl-app-errs').textContent), null, { timeout: 5000 });
  await page.fill('#bl-seats', '120');
  // 最高平均数法扫描不出现悖论
  await page.selectOption('#bl-scan-method', 'dhondt');
  await page.waitForFunction(() => /不会出现/.test(document.getElementById('bl-scan-summary').textContent), null, { timeout: 5000 });

  // ── 7. 方案库：保存 / 载入 / 导出 / 导入 / 删除 / 草稿持久化 ──
  await onTab('ballots');
  await page.selectOption('#bl-preset', 'squeeze');
  await page.click('#bl-preset-load');
  await onTab('library');
  await page.fill('#bl-save-name', '测试方案');
  await page.click('#bl-save');
  await page.waitForFunction(() => document.querySelectorAll('#bl-lib .bl-lib-item').length === 1, null, { timeout: 5000 });
  assert((await page.textContent('#bl-lib .bl-lib-item span')).includes('100 张选票'), '方案条目应显示 100 张选票');
  await onTab('ballots');
  await page.fill('#bl-ballots', '1: 甲');
  await onTab('library');
  await page.click('#bl-lib .bl-lib-item button[data-act="load"]');
  await page.waitForFunction(() => document.querySelector('#bl-mcard-irv .bl-mwin').textContent.includes('激进派'), null, { timeout: 5000 });
  await page.click('#bl-export');
  const exported = JSON.parse(await page.inputValue('#bl-io'));
  assert(exported.items.length === 1 && exported.items[0].name === '测试方案', '导出应含刚保存的方案');
  await page.click('#bl-lib .bl-lib-item button[data-act="del"]');
  await page.waitForFunction(() => document.querySelector('#bl-lib .bl-empty-note'), null, { timeout: 5000 });
  await page.fill('#bl-io', '{"items":[{"name":"x"}]}');
  await page.click('#bl-import');
  assert(/导入失败/.test(await page.textContent('#bl-io-msg')), '格式不对的导入应报错');
  await page.fill('#bl-io', JSON.stringify(exported));
  await page.click('#bl-import');
  await page.waitForFunction(() => document.querySelectorAll('#bl-lib .bl-lib-item').length === 1, null, { timeout: 5000 });
  // 草稿：刷新后选票保持
  await page.waitForTimeout(200);
  await page.reload();
  await page.waitForFunction(() => document.querySelector('#bl-mcard-irv') && document.querySelector('#bl-mcard-irv .bl-mwin').textContent.includes('激进派'), null, { timeout: 10000 });
  assert((await page.$$('#bl-lib .bl-lib-item')).length === 1, '刷新后方案库应保留');

  // ── 8. 键盘切换页签 ──
  await page.focus('#bl-tab-ballots');
  await page.click('#bl-tab-ballots');
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => document.getElementById('bl-tab-results').getAttribute('aria-selected') === 'true' && document.activeElement.id === 'bl-tab-results', null, { timeout: 5000 });
  await page.keyboard.press('End');
  await page.waitForFunction(() => !document.getElementById('bl-pane-guide').hidden, null, { timeout: 5000 });

  // ── 9. 渲染守卫 ──
  await onTab('ballots');
  await page.selectOption('#bl-preset', 'lunch');
  await page.click('#bl-preset-load');
  await page.waitForFunction(() => document.getElementById('bl-parse-ok').textContent.includes('16 张选票'), null, { timeout: 5000 });
  const G = { assert, tabs: T, onTab, paneSel: (t) => `#bl-pane-${t}`, panesRoot: '#bl-panes' };
  await guardHidden(page, G);
  await guardUniqueIds(page, { assert, minIds: 150 });
  const nCtl = await guardControlSize(page, { ...G, minControls: 25 });
  assert(nCtl >= 25, `控件守卫应扫到 ≥25 个控件，实得 ${nCtl}`);
  await guardTextTransform(page, G);
  await guardOverflow(page, G);
  await guardEscape(page, { assert, cardSel: '.bl-card, .bl-mcard, .bl-banner', childSel: 'table,svg,.bl-scroll,textarea,h3,h4,.bl-mwin,.bl-row' });
  await guardFigText(page, { assert, tabs: ['pairs'], onTab, figSel: () => '#bl-graph', minTextsInFig: 10 });
  // 12 位候选人（上限）：环形图标签最密，避让器必须把 12 个名字全部放下且两两不重叠
  await onTab('ballots');
  const many = ['北辰星光队', '南山松柏队', '东海潮汐队', '西岭雪峰队', '中原麦浪队', '江南烟雨队', '塞北长风队', '岭南荔枝队', '巴蜀火锅队', '齐鲁泰山队', '燕赵古道队', '吴越丝绸队'];
  await page.fill('#bl-ballots', many.map((n, i) => `${i + 1}: ` + [...many.slice(i), ...many.slice(0, i)].join(' > ')).join('\n'));
  await page.waitForFunction(() => document.getElementById('bl-parse-ok').textContent.includes('12 位候选人'), null, { timeout: 5000 });
  await onTab('pairs');
  const nLab = await page.$$eval('#bl-graph .bl-glabel', (ts) => ts.length);
  assert(nLab === 12, `12 人时图上应画出 12 个名字标签，实得 ${nLab}`);
  await guardFigText(page, { assert, tabs: ['pairs'], onTab, figSel: () => '#bl-graph', minTextsInFig: 24 });
  // 窄屏下图上名字与编号也不重叠
  await page.setViewportSize({ width: 390, height: 900 });
  await guardFigText(page, { assert, tabs: ['pairs'], onTab, figSel: () => '#bl-graph', minTextsInFig: 10 });
  await page.setViewportSize({ width: 1280, height: 850 });

  assert(errors.length === 0, '页面不应有 JS 错误：' + errors.join('; '));

  // 缩略图：开票对比（田纳西）
  await onTab('ballots');
  await page.selectOption('#bl-preset', 'tn');
  await page.click('#bl-preset-load');
  await onTab('results');
  await page.waitForFunction(() => document.querySelector('#bl-mcard-irv .bl-mwin').textContent.includes('诺克斯维尔'), null, { timeout: 5000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await screenshot('thumb.png');
};
