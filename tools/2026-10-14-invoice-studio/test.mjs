/* 票据工作台 · 集成测试
 *
 * 数值真值全部来自 run 目录 oracle/ui_truth.py（独立 Python Decimal 实现；大写取第三方库 cn2an，英文取 num2words），
 * 由 inject-oracle.mjs 机械注入 ORACLE 块，本文件不手写任何计算真值。
 * 跨源核对：中国人民银行《支付结算办法》附件里的大写示例（1680.32 / 107000.53 / 16409.02 / 325.04 / 1409.50），
 * 这几条与任何实现无关，按规定原文允许的写法逐条断言。
 * 渲染守卫 import（render-guards.mjs）。
 */
import { renderGuards } from '/Users/lon/.agents/cron/daily-website/tools/render-guards.mjs';
import fs from 'node:fs';

const ORACLE = {
 "meta": {
  "tabs": [
   "edit",
   "docs",
   "book",
   "words",
   "set"
  ]
 },
 "A": {
  "amts": [
   "1200000",
   "882000",
   "119988",
   "235"
  ],
  "groups": [
   [
    "13",
    "120223",
    "15629"
   ],
   [
    "6",
    "2082000",
    "124920"
   ]
  ],
  "sub": "2202223",
  "tax": "140549",
  "total": "2345272",
  "due": "1845272",
  "words": "人民币贰万叁仟肆佰伍拾贰元柒角贰分"
 },
 "B": {
  "amts": [
   "1200000",
   "882000",
   "119988",
   "234"
  ],
  "groups": [
   [
    "13",
    "120222",
    "15628"
   ],
   [
    "6",
    "2082000",
    "124920"
   ]
  ],
  "sub": "2202222",
  "tax": "140548",
  "total": "2345270",
  "due": "1845270",
  "words": "人民币贰万叁仟肆佰伍拾贰元柒角"
 },
 "C": {
  "amts": [
   "1200000",
   "882000",
   "119988",
   "235"
  ],
  "groups": [
   [
    "13",
    "120223",
    "15629"
   ],
   [
    "6",
    "2082000",
    "124920"
   ]
  ],
  "sub": "2202223",
  "tax": "140549",
  "total": "2345272",
  "due": "1845272",
  "words": "人民币贰万叁仟肆佰伍拾贰元柒角贰分"
 },
 "D": {
  "amts": [
   "1200000",
   "882000",
   "119988",
   "235"
  ],
  "groups": [
   [
    "13",
    "106392",
    "13831"
   ],
   [
    "6",
    "1964151",
    "117849"
   ]
  ],
  "sub": "2070543",
  "tax": "131680",
  "total": "2204723",
  "due": "1704723",
  "words": "人民币贰万贰仟零肆拾柒元贰角叁分"
 },
 "E": {
  "amts": [
   "1200000",
   "882000",
   "119988",
   "235"
  ],
  "groups": [
   [
    "13",
    "106392",
    "13831"
   ],
   [
    "6",
    "1964150",
    "117850"
   ]
  ],
  "sub": "2070542",
  "tax": "131681",
  "total": "2204723",
  "due": "1704723",
  "words": "人民币贰万贰仟零肆拾柒元贰角叁分"
 },
 "U": {
  "amts": [
   "1200000",
   "882000",
   "119988",
   "235"
  ],
  "groups": [
   [
    "13",
    "120223",
    "15629"
   ],
   [
    "6",
    "2082000",
    "124920"
   ]
  ],
  "sub": "2202223",
  "tax": "140549",
  "total": "2345272",
  "due": "1845272",
  "words": "Twenty-three thousand four hundred fifty-two dollars and seventy-two cents only"
 },
 "T1": {
  "amts": [
   "34",
   "34",
   "34"
  ],
  "groups": [
   [
    "13",
    "102",
    "12"
   ]
  ],
  "sub": "102",
  "tax": "12",
  "total": "114",
  "due": "114"
 },
 "T2": {
  "amts": [
   "34",
   "34",
   "34"
  ],
  "groups": [
   [
    "13",
    "101",
    "13"
   ]
  ],
  "sub": "101",
  "tax": "13",
  "total": "114",
  "due": "114",
  "drift": "-1"
 },
 "F": {
  "amts": [
   "1200000",
   "119988",
   "235"
  ],
  "groups": [
   [
    "13",
    "120223",
    "15629"
   ],
   [
    "6",
    "1200000",
    "72000"
   ]
  ],
  "sub": "1320223",
  "tax": "87629",
  "total": "1410352",
  "due": "910352"
 },
 "G": {
  "amts": [
   "1200000",
   "882000",
   "119988",
   "235",
   "1200000"
  ],
  "groups": [
   [
    "13",
    "120223",
    "15629"
   ],
   [
    "6",
    "3282000",
    "196920"
   ]
  ],
  "sub": "3402223",
  "tax": "212549",
  "total": "3617272",
  "due": "3117272"
 },
 "fixture": {
  "asof": "2026-10-14",
  "docs": [
   {
    "id": "a1",
    "no": "INV-T-001",
    "type": "invoice",
    "status": "sent",
    "cur": "CNY",
    "date": "2026-09-20",
    "terms": "30",
    "termsDays": "90",
    "noAuto": false,
    "mode": "excl",
    "round": "line",
    "rm": "half-up",
    "client": {
     "name": "客户a1",
     "tax": "",
     "contact": "",
     "addr": ""
    },
    "lines": [
     {
      "desc": "咨询",
      "qty": "1",
      "unit": "",
      "price": "1000",
      "disc": "",
      "rate": "6"
     }
    ],
    "shipping": "",
    "paid": "",
    "notes": "",
    "_exp": {
     "total": "106000",
     "due": "2026-10-20",
     "days": -6,
     "bucket": 0
    }
   },
   {
    "id": "a2",
    "no": "INV-T-002",
    "type": "invoice",
    "status": "sent",
    "cur": "CNY",
    "date": "2026-08-01",
    "terms": "30",
    "termsDays": "90",
    "noAuto": false,
    "mode": "excl",
    "round": "line",
    "rm": "half-up",
    "client": {
     "name": "客户a2",
     "tax": "",
     "contact": "",
     "addr": ""
    },
    "lines": [
     {
      "desc": "开发",
      "qty": "2",
      "unit": "",
      "price": "2500",
      "disc": "",
      "rate": "13"
     }
    ],
    "shipping": "",
    "paid": "",
    "notes": "",
    "_exp": {
     "total": "565000",
     "due": "2026-08-31",
     "days": 44,
     "bucket": 2
    }
   },
   {
    "id": "a3",
    "no": "INV-T-003",
    "type": "invoice",
    "status": "sent",
    "cur": "CNY",
    "date": "2026-06-01",
    "terms": "15",
    "termsDays": "90",
    "noAuto": false,
    "mode": "excl",
    "round": "line",
    "rm": "half-up",
    "client": {
     "name": "客户a3",
     "tax": "",
     "contact": "",
     "addr": ""
    },
    "lines": [
     {
      "desc": "托管",
      "qty": "3",
      "unit": "",
      "price": "99.99",
      "disc": "",
      "rate": "0"
     }
    ],
    "shipping": "",
    "paid": "100",
    "notes": "",
    "_exp": {
     "total": "29997",
     "due": "2026-06-16",
     "days": 120,
     "bucket": 4
    }
   },
   {
    "id": "a4",
    "no": "INV-T-004",
    "type": "invoice",
    "status": "sent",
    "cur": "USD",
    "date": "2026-09-01",
    "terms": "30",
    "termsDays": "90",
    "noAuto": false,
    "mode": "excl",
    "round": "line",
    "rm": "half-up",
    "client": {
     "name": "客户a4",
     "tax": "",
     "contact": "",
     "addr": ""
    },
    "lines": [
     {
      "desc": "Design",
      "qty": "10",
      "unit": "",
      "price": "12.5",
      "disc": "",
      "rate": "8.875"
     }
    ],
    "shipping": "",
    "paid": "",
    "notes": "",
    "_exp": {
     "total": "13609",
     "due": "2026-10-01",
     "days": 13,
     "bucket": 1
    }
   },
   {
    "id": "a5",
    "no": "INV-T-005",
    "type": "invoice",
    "status": "paid",
    "cur": "CNY",
    "date": "2026-05-01",
    "terms": "30",
    "termsDays": "90",
    "noAuto": false,
    "mode": "excl",
    "round": "line",
    "rm": "half-up",
    "client": {
     "name": "客户a5",
     "tax": "",
     "contact": "",
     "addr": ""
    },
    "lines": [
     {
      "desc": "维护",
      "qty": "1",
      "unit": "",
      "price": "800",
      "disc": "",
      "rate": "6"
     }
    ],
    "shipping": "",
    "paid": "",
    "notes": "",
    "_exp": {
     "total": "84800",
     "due": "2026-05-31",
     "days": 136,
     "bucket": 4
    }
   },
   {
    "id": "a6",
    "no": "QT-T-001",
    "type": "quote",
    "status": "draft",
    "cur": "CNY",
    "date": "2026-10-10",
    "terms": "30",
    "termsDays": "90",
    "noAuto": false,
    "mode": "excl",
    "round": "line",
    "rm": "half-up",
    "client": {
     "name": "客户a6",
     "tax": "",
     "contact": "",
     "addr": ""
    },
    "lines": [
     {
      "desc": "报价项",
      "qty": "1",
      "unit": "",
      "price": "5000",
      "disc": "",
      "rate": "6"
     }
    ],
    "shipping": "",
    "paid": "",
    "notes": "",
    "_exp": {
     "total": "530000",
     "due": "2026-11-09",
     "days": -26,
     "bucket": 0
    }
   },
   {
    "id": "a7",
    "no": "INV-T-006",
    "type": "invoice",
    "status": "void",
    "cur": "CNY",
    "date": "2026-07-01",
    "terms": "30",
    "termsDays": "90",
    "noAuto": false,
    "mode": "excl",
    "round": "line",
    "rm": "half-up",
    "client": {
     "name": "客户a7",
     "tax": "",
     "contact": "",
     "addr": ""
    },
    "lines": [
     {
      "desc": "作废项",
      "qty": "1",
      "unit": "",
      "price": "999",
      "disc": "",
      "rate": "6"
     }
    ],
    "shipping": "",
    "paid": "",
    "notes": "",
    "_exp": {
     "total": "105894",
     "due": "2026-07-31",
     "days": 75,
     "bucket": 3
    }
   },
   {
    "id": "a8",
    "no": "INV-T-007",
    "type": "invoice",
    "status": "sent",
    "cur": "CNY",
    "date": "2026-08-15",
    "terms": "30",
    "termsDays": "90",
    "noAuto": false,
    "mode": "excl",
    "round": "line",
    "rm": "half-up",
    "client": {
     "name": "客户a8",
     "tax": "",
     "contact": "",
     "addr": ""
    },
    "lines": [
     {
      "desc": "边界",
      "qty": "1",
      "unit": "",
      "price": "100",
      "disc": "",
      "rate": "0"
     }
    ],
    "shipping": "",
    "paid": "",
    "notes": "",
    "_exp": {
     "total": "10000",
     "due": "2026-09-14",
     "days": 30,
     "bucket": 1
    }
   },
   {
    "id": "a9",
    "no": "INV-T-008",
    "type": "invoice",
    "status": "sent",
    "cur": "CNY",
    "date": "2026-09-14",
    "terms": "30",
    "termsDays": "90",
    "noAuto": false,
    "mode": "excl",
    "round": "line",
    "rm": "half-up",
    "client": {
     "name": "客户a9",
     "tax": "",
     "contact": "",
     "addr": ""
    },
    "lines": [
     {
      "desc": "当天到期",
      "qty": "1",
      "unit": "",
      "price": "50",
      "disc": "",
      "rate": "0"
     }
    ],
    "shipping": "",
    "paid": "",
    "notes": "",
    "_exp": {
     "total": "5000",
     "due": "2026-10-14",
     "days": 0,
     "bucket": 0
    }
   }
  ],
  "aging": {
   "CNY": [
    "111000",
    "10000",
    "565000",
    "0",
    "19997"
   ],
   "USD": [
    "0",
    "13609",
    "0",
    "0",
    "0"
   ]
  },
  "open": {
   "CNY": "705997",
   "USD": "13609"
  },
  "over": {
   "CNY": "594997",
   "USD": "13609"
  },
  "paid": {
   "CNY": "84800"
  }
 },
 "overCount": 4
};

const SYM = { CNY: '¥', USD: '$', SGD: 'S$' };
// 最小单位整数串 → 页面显示串（与票面同口径：千分位 + 两位小数，负号用 U+2212）
function m(minor, cur = 'CNY') {
  const v = BigInt(minor), neg = v < 0n, a = (neg ? -v : v).toString().padStart(3, '0');
  const ip = a.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ','), fp = a.slice(-2);
  return (neg ? '−' : '') + SYM[cur] + ip + '.' + fp;
}

export default async ({ page, toolURL, screenshot, assert }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(toolURL);
  await page.evaluate(() => localStorage.clear());
  await page.goto(toolURL + '#edit');
  await page.waitForFunction(() => document.querySelector('#iv-p-total') && document.querySelector('#iv-p-total').textContent.length > 0);

  const txt = (sel) => page.$eval(sel, (n) => n.textContent.trim());
  const onTab = async (t) => { await page.click(`#tab-${t}`); await page.waitForFunction((t) => !document.querySelector(`#pane-${t}`).hidden, t); };
  const waitText = (sel, want) => page.waitForFunction(([s, w]) => { const n = document.querySelector(s); return n && n.textContent.trim() === w; }, [sel, want], { timeout: 10000 })
    .catch(() => {});
  async function checkTotals(K, cur = 'CNY', label = K) {
    const O = ORACLE[K];
    await waitText('#iv-p-total', m(O.total, cur));
    assert(await txt('#iv-p-total') === m(O.total, cur), `${label} 价税合计 应为 ${m(O.total, cur)}，实得 ${await txt('#iv-p-total')}`);
    assert(await txt('#iv-p-sub') === m(O.sub, cur), `${label} 小计 应为 ${m(O.sub, cur)}，实得 ${await txt('#iv-p-sub')}`);
    for (let k = 0; k < O.groups.length; k++) {
      const got = await txt(`#iv-p-tax-${k}`);
      assert(got === m(O.groups[k][2], cur), `${label} 第 ${k + 1} 组税额（${O.groups[k][0]}%）应为 ${m(O.groups[k][2], cur)}，实得 ${got}`);
    }
    const amts = await page.$$eval('#iv-p-body td[data-amt]', (ns) => ns.map((n) => n.dataset.amt));
    assert(JSON.stringify(amts) === JSON.stringify(O.amts), `${label} 行金额 ${amts} ≠ ${O.amts}`);
    if (O.words) assert(await txt('#iv-p-words') === O.words, `${label} 大写 应为 ${O.words}，实得 ${await txt('#iv-p-words')}`);
  }

  // ---------- 1. 示例单：价外税 · 逐行 · 四舍五入 ----------
  await checkTotals('A');
  assert(await txt('#iv-p-due-amt') === m(ORACLE.A.due), '应付金额 = 价税合计 − 定金');
  assert(await txt('#iv-l3-amt') === m(ORACLE.A.amts[3]), '表单侧第 4 行金额与票面一致');
  assert(/^INV-\d{6}-0001$/.test(await page.inputValue('#iv-no')), '默认编号按模板 {T}-{YYYY}{MM}-{SEQ:4} 生成');

  // ---------- 2. 银行家舍入：0.335×7 = 2.345 → 2.34 ----------
  await page.selectOption('#iv-rm', 'half-even');
  await checkTotals('B', 'CNY', '银行家舍入');
  await page.selectOption('#iv-rm', 'half-up');

  // ---------- 3. 价内税（按税率合计 / 逐行） ----------
  await page.selectOption('#iv-mode', 'incl');
  await page.selectOption('#iv-round', 'group');
  await checkTotals('D', 'CNY', '价内税·合计舍入');
  await page.selectOption('#iv-round', 'line');
  await checkTotals('E', 'CNY', '价内税·逐行舍入');
  await page.selectOption('#iv-mode', 'excl');

  // ---------- 4. 美元：英文金额 ----------
  await page.selectOption('#iv-cur', 'USD');
  await checkTotals('U', 'USD', '美元');
  assert(await txt('#iv-p-words-lab') === 'Amount in words', '外币改英文金额标签');
  await page.selectOption('#iv-cur', 'CNY');
  await checkTotals('A', 'CNY', '切回人民币');

  // ---------- 5. 非法输入：第 2 行数量 abc、折扣 120 ----------
  await page.fill('#iv-l1-qty', 'abc');
  await page.waitForFunction(() => !document.querySelector('#iv-errs').hidden);
  assert((await txt('#iv-errs')).includes('第 2 行数量：不是数字'), '错误列表报出第 2 行数量');
  assert(await page.getAttribute('#iv-l1-qty', 'aria-invalid') === 'true', '非法输入框 aria-invalid');
  await checkTotals('F', 'CNY', '剔除非法行');
  await page.fill('#iv-l1-qty', '3.5');
  await page.fill('#iv-l1-disc', '120');
  await page.waitForFunction(() => document.querySelector('#iv-errs').textContent.includes('折扣'));
  assert((await txt('#iv-errs')).includes('不能超过 100'), '折扣上限 100%');
  await page.fill('#iv-l1-disc', '10');
  await page.waitForFunction(() => document.querySelector('#iv-errs').hidden);
  assert(await page.$eval('#iv-errs', (n) => getComputedStyle(n).display) === 'none', '错误条修好后真的藏起来（计算样式）');
  await page.fill('#iv-l2-price', '1.23456');
  await page.waitForFunction(() => document.querySelector('#iv-errs').textContent.includes('最多 4 位小数'));
  await page.fill('#iv-l2-price', '99.99');
  await checkTotals('A', 'CNY', '修正后');
  // 保存被拦
  await page.fill('#iv-l0-qty', '0');
  await page.click('#iv-save');
  await page.waitForFunction(() => /未保存/.test(document.querySelector('#iv-toast').textContent));
  await page.fill('#iv-l0-qty', '1');

  // ---------- 6. 按税率合计舍入的舍入差 ----------
  await page.click('#iv-new');
  await page.waitForFunction(() => document.querySelectorAll('.iv-line').length === 1);
  for (let k = 0; k < 3; k++) {
    if (k) { await page.press(`#iv-l${k - 1}-rate`, 'Enter'); await page.waitForFunction((k) => document.activeElement && document.activeElement.id === `iv-l${k}-desc`, k); }
    await page.fill(`#iv-l${k}-desc`, `贴纸${k + 1}`);
    await page.fill(`#iv-l${k}-qty`, '1');
    await page.fill(`#iv-l${k}-price`, '0.335');
    await page.fill(`#iv-l${k}-rate`, '13');
  }
  await checkTotals('T1', 'CNY', '三行 0.335 逐行');
  assert(await page.$eval('#iv-p-drift', (n) => getComputedStyle(n).display) === 'none', '逐行舍入没有舍入差提示');
  await page.selectOption('#iv-round', 'group');
  await checkTotals('T2', 'CNY', '三行 0.335 合计');
  await page.waitForFunction(() => !document.querySelector('#iv-p-drift').hidden);
  assert((await txt('#iv-p-drift')).includes('相差 ' + m(ORACLE.T2.drift)), `舍入差提示应为 ${m(ORACLE.T2.drift)}：${await txt('#iv-p-drift')}`);
  // Alt+↑ 调整顺序
  await page.focus('#iv-l2-desc');
  await page.keyboard.press('Alt+ArrowUp');
  await page.waitForFunction(() => document.querySelector('#iv-l1-desc').value === '贴纸3' && document.activeElement.id === 'iv-l1-desc');
  // 删除一行，焦点落到删除按钮
  await page.click('#iv-l0-del');
  await page.waitForFunction(() => document.querySelectorAll('.iv-line').length === 2 && document.activeElement && document.activeElement.id === 'iv-l0-del');

  // ---------- 7. 品目库带入 ----------
  await page.selectOption('#iv-round', 'line');
  await page.click('#iv-new');
  await page.waitForFunction(() => document.querySelectorAll('.iv-line').length === 1);
  const pick = await page.$$eval('#iv-item-pick option', (os) => os.map((o) => o.textContent));
  assert(pick.length === 5, `品目下拉 = 提示 + 4 个示例品目，实得 ${pick.length}`);
  await page.selectOption('#iv-item-pick', '1');
  await page.waitForFunction(() => document.querySelector('#iv-l0-desc').value === '网站前端开发');
  assert(await page.inputValue('#iv-l0-price') === '2800' && await page.inputValue('#iv-l0-rate') === '6', '品目带出单价与税率，并替换掉空白行');
  await page.fill('#iv-bill-name', '测试客户 A');
  // ---------- 8. 保存 → 流水号递增 → 单据列表 ----------
  const no1 = await page.inputValue('#iv-no');
  await page.focus('#iv-notes');
  await page.keyboard.press('Control+s');
  await page.waitForFunction(() => /已保存/.test(document.querySelector('#iv-toast').textContent));
  assert(/正在编辑已保存的单据/.test(await txt('#iv-editing')), '保存后进入编辑已保存单据状态');
  await page.click('#iv-new');
  const no2 = await page.inputValue('#iv-no');
  assert(no1.endsWith('-0001') && no2.endsWith('-0002'), `流水号递增：${no1} → ${no2}`);
  await page.fill('#iv-no', no1);
  await page.waitForFunction(() => /已被其他单据使用/.test(document.querySelector('#iv-errs').textContent));
  await page.fill('#iv-no', no2);
  await page.selectOption('#iv-type', 'quote');
  await page.waitForFunction(() => document.querySelector('#iv-due-lab').textContent === '有效期至');
  assert(await page.inputValue('#iv-no') === no2, '手改过的编号切换类型时保持不变');
  assert(await txt('#iv-p-title') === '报价单', '票面标题随类型变');
  await page.selectOption('#iv-type', 'invoice');
  await page.selectOption('#iv-terms', 'custom');
  await page.waitForFunction(() => !document.querySelector('#iv-terms-days-f').hidden);
  await page.fill('#iv-date', '2026-01-31');
  await page.fill('#iv-terms-days', '29');
  await page.waitForFunction(() => document.querySelector('#iv-due').value === '2026-03-01');
  await page.fill('#iv-terms-days', '-3');
  await page.waitForFunction(() => /自定义天数/.test(document.querySelector('#iv-errs').textContent));
  await page.selectOption('#iv-terms', '30');
  await page.waitForFunction(() => document.querySelector('#iv-terms-days-f').hidden && document.querySelector('#iv-due').value === '2026-03-02');
  assert(await page.$eval('#iv-terms-days-f', (n) => getComputedStyle(n).display) === 'none', '自定义天数框真的藏起来');

  // CSV（防公式注入）
  await page.fill('#iv-l0-desc', '=SUM(A1:A9)');
  await page.fill('#iv-l0-price', '10');
  await page.fill('#iv-l0-rate', '0');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#iv-csv')]);
  const csv = fs.readFileSync(await dl.path(), 'utf8');
  assert(csv.includes("'=SUM(A1:A9)"), 'CSV 以 = 开头的单元格被转义');
  assert(/价税合计,,,,,,10\.00,CNY/.test(csv.replace(/\r/g, '')), 'CSV 带价税合计行：' + csv.slice(-60));

  // ---------- 9. 账龄：注入固定夹具 ----------
  const F = ORACLE.fixture;
  await page.evaluate((docs) => {
    const S = JSON.parse(localStorage.getItem('iv-studio-v1'));
    S.docs = docs.map((d) => { const c = { ...d }; delete c._exp; return c; });
    localStorage.setItem('iv-studio-v1', JSON.stringify(S));
  }, F.docs);
  await page.goto(toolURL + '#docs');
  await page.reload(); // 只改 hash 的 goto 是同文档导航，不会重新读 localStorage
  await page.waitForFunction(() => !document.querySelector('#pane-docs').hidden);
  await page.fill('#iv-asof', F.asof);
  await page.waitForFunction(() => document.querySelectorAll('#iv-aging tbody tr[data-cur]').length === 2);
  for (const cur of Object.keys(F.aging)) {
    const cells = await page.$$eval(`#iv-aging tr[data-cur="${cur}"] td[data-b]`, (ns) => ns.map((n) => n.textContent.trim()));
    const want = F.aging[cur].map((v) => m(v, cur)).concat([m(F.open[cur], cur)]);
    assert(JSON.stringify(cells) === JSON.stringify(want), `账龄 ${cur}：${cells} ≠ ${want}`);
    const open = await page.$eval(`#iv-kpi-open b[data-cur="${cur}"]`, (n) => n.firstChild.textContent.trim());
    assert(open === m(F.open[cur], cur), `未收款 ${cur} ${open} ≠ ${m(F.open[cur], cur)}`);
    const over = await page.$eval(`#iv-kpi-over b[data-cur="${cur}"]`, (n) => n.firstChild.textContent.trim());
    assert(over === m(F.over[cur], cur), `逾期 ${cur} ${over} ≠ ${m(F.over[cur], cur)}`);
  }
  const paidCNY = await page.$eval('#iv-kpi-paid b[data-cur="CNY"]', (n) => n.firstChild.textContent.trim());
  assert(paidCNY === m(F.paid.CNY), `已收款 ${paidCNY}`);
  // 账龄条宽度与金额成比例（几何断言）
  const bar = await page.$$eval('#iv-agebar-CNY i', (ns) => ns.map((n) => n.getBoundingClientRect().width));
  const barW = await page.$eval('#iv-agebar-CNY', (n) => n.getBoundingClientRect().width);
  const nz = F.aging.CNY.filter((v) => v !== '0');
  assert(bar.length === nz.length, `账龄条段数 ${bar.length} ≠ ${nz.length}`);
  const tot = Number(F.open.CNY);
  nz.forEach((v, k) => { const want = barW * Number(v) / tot; assert(Math.abs(bar[k] - want) < 1.5, `账龄条第 ${k + 1} 段宽 ${bar[k].toFixed(1)} 应≈${want.toFixed(1)}`); });
  // 每行金额 + 逾期徽标
  for (const d of F.docs) {
    const row = `#iv-doc-body tr[data-id="${d.id}"]`;
    const tt = await page.$eval(`${row} td[data-total]`, (n) => n.dataset.total);
    assert(tt === d._exp.total, `${d.no} 合计 ${tt} ≠ ${d._exp.total}`);
    const pill = await page.$eval(`${row} .iv-pill`, (n) => n.textContent.trim());
    if (d.type === 'invoice' && d.status === 'sent' && d._exp.days > 0) assert(pill === `已逾期 ${d._exp.days} 天`, `${d.no} 徽标 ${pill}`);
  }
  await page.click('.iv-chip[data-st="over"]');
  await page.waitForFunction((n) => document.querySelectorAll('#iv-doc-body tr[data-id]').length === n, ORACLE.overCount);
  await page.fill('#iv-q', 'INV-T-002');
  await page.waitForFunction(() => document.querySelectorAll('#iv-doc-body tr[data-id]').length === 1);
  await page.fill('#iv-q', '');
  // 标记已收款 → 逾期金额减少
  await page.click('#iv-doc-body tr[data-id="a2"] button[data-act="paid"]');
  await page.click('.iv-chip[data-st="all"]');
  const wantOver = m(BigInt(F.over.CNY) - BigInt(F.aging.CNY[2]));
  await page.waitForFunction((w) => document.querySelector('#iv-kpi-over b[data-cur="CNY"]').firstChild.textContent.trim() === w, wantOver);
  // 删除需二次确认
  await page.click('#iv-doc-body tr[data-id="a7"] button[data-act="del"]');
  assert(await page.$$eval('#iv-doc-body tr[data-id="a7"]', (n) => n.length) === 1, '第一次点删除不删');
  await page.click('#iv-doc-body tr[data-id="a7"] button[data-act="del"]');
  await page.waitForFunction(() => !document.querySelector('#iv-doc-body tr[data-id="a7"]'));
  // 打开单据回到编辑
  await page.click('#iv-doc-body tr[data-id="a4"] button[data-act="open"]');
  await page.waitForFunction(() => !document.querySelector('#pane-edit').hidden && document.querySelector('#iv-no').value === 'INV-T-004');
  assert(await page.inputValue('#iv-cur') === 'USD', '打开的单据带回币种');

  // ---------- 10. 金额大写：《支付结算办法》原文示例（跨源） ----------
  await onTab('words');
  const OFFICIAL = [
    ['1680.32', ['壹仟陆佰捌拾元零叁角贰分', '壹仟陆佰捌拾元叁角贰分']],
    ['107000.53', ['壹拾万柒仟元零伍角叁分', '壹拾万零柒仟元伍角叁分', '壹拾万柒仟元伍角叁分']],
    ['16409.02', ['壹万陆仟肆佰零玖元零贰分']],
    ['325.04', ['叁佰贰拾伍元零肆分']],
    ['1409.50', ['壹仟肆佰零玖元伍角', '壹仟肆佰零玖元伍角整']],
  ];
  for (const [v, ok] of OFFICIAL) {
    await page.fill('#iv-w-in', v);
    await page.waitForFunction((v) => document.querySelector('#iv-w-num').textContent.replace(/,/g, '') === Number(v).toFixed(2), v);
    const got = await txt('#iv-w-cn');
    assert(ok.includes(got), `《支付结算办法》示例 ${v}：${got} 不在允许写法 ${ok.join(' / ')} 中`);
  }
  await page.fill('#iv-w-in', '23452.72');
  await page.waitForFunction(() => document.querySelector('#iv-w-num').textContent === '23,452.72');
  assert('人民币' + await txt('#iv-w-cn') === ORACLE.A.words, '大写页与 cn2an 一致');
  assert(await txt('#iv-w-en') === ORACLE.U.words, '英文金额与 num2words 一致');
  await page.fill('#iv-w-in', '12.345');
  await page.waitForFunction(() => /最多 2 位小数/.test(document.querySelector('#iv-w-cn').textContent));
  await page.selectOption('#iv-w-cur', 'JPY');
  await page.fill('#iv-w-in', '1000.5');
  await page.waitForFunction(() => /没有小数单位/.test(document.querySelector('#iv-w-en').textContent));

  // ---------- 11. 设置：模板校验 ----------
  await onTab('set');
  await page.fill('#iv-s-tpl', '{T}{YY}-{MONTH}');
  await page.waitForFunction(() => /必须包含/.test(document.querySelector('#iv-s-preview').textContent));
  await page.fill('#iv-s-tpl', '{T}{YY}-{SEQ:3}{X}');
  await page.waitForFunction(() => /未知占位符 \{X\}/.test(document.querySelector('#iv-s-preview').textContent));
  await page.fill('#iv-s-tpl', '{T}{YY}{MM}{DD}-{SEQ:3}');
  await page.waitForFunction(() => /^下一张发票编号预览：INV\d{6}-\d{3}$/.test(document.querySelector('#iv-s-preview').textContent));
  await page.fill('#iv-s-name', '测试工作室');
  // 导出 → 导入（重复跳过 + 新增计数）
  const [ex] = await Promise.all([page.waitForEvent('download'), page.click('#iv-export')]);
  const dump = JSON.parse(fs.readFileSync(await ex.path(), 'utf8'));
  assert(dump.settings.name === '测试工作室' && dump.settings.tpl === '{T}{YY}{MM}{DD}-{SEQ:3}', '导出包含最新设置');
  dump.docs.push({ ...dump.docs[0], id: 'imp1', no: 'IMP-1' });
  dump.clients.push({ name: '导入客户', tax: '', contact: '', addr: '' });
  await page.setInputFiles('#iv-import', { name: 'b.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(dump)) });
  await page.waitForFunction(() => /已导入：单据 1 张、客户 1 个、品目 0 个/.test(document.querySelector('#iv-data-msg').textContent));
  await page.setInputFiles('#iv-import', { name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"a":1}') });
  await page.waitForFunction(() => /不是本工具导出的备份/.test(document.querySelector('#iv-data-msg').textContent));

  // ---------- 12. 客户与品目 ----------
  await onTab('book');
  await page.click('#iv-i-add');
  await page.waitForFunction(() => /品名不能为空/.test(document.querySelector('#iv-i-msg').textContent));
  await page.fill('#iv-i-desc', '年度维护');
  await page.fill('#iv-i-price', '3600');
  await page.fill('#iv-i-rate', '6');
  await page.click('#iv-i-add');
  await page.waitForFunction(() => /已添加：年度维护/.test(document.querySelector('#iv-i-msg').textContent));
  assert(await page.$$eval('#iv-i-list li', (n) => n.length) === 5, '品目库 5 条');
  await page.fill('#iv-c-name', '导入客户');
  await page.click('#iv-c-add');
  await page.waitForFunction(() => /已有同名客户/.test(document.querySelector('#iv-c-msg').textContent));

  // ---------- 13. 持久化：刷新后仍在 ----------
  await page.reload();
  await page.waitForFunction(() => !document.querySelector('#pane-book').hidden);
  await onTab('set');
  assert(await page.inputValue('#iv-s-name') === '测试工作室', '刷新后设置仍在');
  await onTab('book');
  assert(await page.$$eval('#iv-i-list li', (n) => n.length) === 5, '刷新后品目库仍是 5 条');

  // ---------- 14. 打印样式：只留票面 ----------
  await onTab('edit');
  await page.emulateMedia({ media: 'print' });
  const pr = await page.evaluate(() => ({ mesh: getComputedStyle(document.querySelector('.iv-mesh')).display, form: getComputedStyle(document.querySelector('.iv-noprint')).display,
    paper: document.querySelector('#iv-paper').getBoundingClientRect().width }));
  assert(pr.mesh === 'none' && pr.form === 'none' && pr.paper > 400, `打印时只留票面：${JSON.stringify(pr)}`);
  await page.emulateMedia({ media: 'screen' });

  // ---------- 15. 渲染守卫（逐页签 × 逐视口） ----------
  const n = await renderGuards(page, {
    assert, tabs: ORACLE.meta.tabs, onTab,
    paneSel: (t) => `#pane-${t}`, panesRoot: '#iv-panes',
    figSel: (t) => `#pane-${t} svg.iv-none`, cardSel: '.iv-card, .iv-paper',
    minControls: 60,
  });
  assert(n >= 60, `控件尺寸守卫至少扫到 60 个控件，实得 ${n}`);
  // 票面金额列不越出票面
  const esc = await page.evaluate(() => { const p = document.querySelector('#iv-paper').getBoundingClientRect(); return [...document.querySelectorAll('#iv-p-sum dd, #iv-p-body td')].filter((n) => n.getBoundingClientRect().right > p.right + 1).length; });
  assert(esc === 0, `票面里有 ${esc} 个单元格越出票面`);

  assert(errors.length === 0, '页面无 JS 错误：' + errors.join(' | '));

  // 缩略图：恢复示例单
  await page.evaluate(() => localStorage.clear());
  await page.goto(toolURL + '#edit');
  await page.reload();
  await page.waitForFunction((w) => document.querySelector('#iv-p-total').textContent === w, m(ORACLE.A.total));
  await page.mouse.move(2, 840);
  await screenshot('thumb.png');
};
