/* 地震工程工作台 · 浏览器集成测试
 *
 * 真值全部由 oracle/make_oracle.mjs 机械注入（本文件 ORACLE 块之外不许出现手打的数字）。
 * 三类真值：① scipy + eqsig + OpenSees 独立重算的**异源**读数；② 引擎按页面 fmt 口径算出的
 * 期望字符串；③ 离线套件实测后钉死的规模字面量（页面公布什么，这里就断什么）。
 */
const ORACLE = {
  "xsrc": {
    "recPGA": {
      "ridgecrest-ccc": 0.512,
      "illapel-co03": 0.344,
      "maras-khmn": 0.53,
      "anchorage-k220": 0.326,
      "samos-gmld": 0.183,
      "ridgecrest-tow2": 0.386
    },
    "pga_g": 0.5058729945957612,
    "pgv_cms": 41.41996322877964,
    "ia": 2.3310156223606984,
    "cav": 13.34528275757496,
    "d595": 10.91,
    "psa02_g": 0.7711739129904402,
    "psa10_g": 0.40563688890450406,
    "psa30_g": 0.14064710875928313,
    "si_cm": 145.08904650418663,
    "peakT": 0.10672305629909891,
    "T1": 1.5970471225447782,
    "T2": 0.5425008446783873,
    "T3": 0.33112157367085515,
    "sdofSd_cm": 9.94913223415517,
    "sdofPsa_g": 0.40052005235320065
  },
  "txt": {
    "pga": "0.506",
    "pgv": "41.4",
    "pgd": "26.2",
    "ia": "2.33",
    "d595": "10.9",
    "psa02": "0.771",
    "psa10": "0.406",
    "psa30": "0.141",
    "si": "145.1",
    "peakT": "0.11",
    "T1": "1.597",
    "mtot": "3136",
    "thaV": "5660",
    "rsaV": "1263",
    "drift": "1/138",
    "driftFloor": "第 2 层",
    "alpha1": "0.0460",
    "FEk": "1203",
    "rsaV0": "1263",
    "lamMin": "4.11",
    "lamLimit": "3.2",
    "sdSd": "9.95",
    "sdSa": "0.403",
    "sdPsa": "0.401",
    "sdSv": "76.0"
  },
  "verify": {
    "asserts": 3294,
    "points": 106296,
    "opsPoints": 22532,
    "opsRel": "2.134e-11"
  },
  "meta": {
    "records": 6,
    "periods": 110,
    "stories": 10,
    "recIds": [
      "ridgecrest-ccc",
      "illapel-co03",
      "maras-khmn",
      "anchorage-k220",
      "samos-gmld",
      "ridgecrest-tow2"
    ],
    "tabs": [
      "motion",
      "spectrum",
      "sdof",
      "struct",
      "code",
      "notes"
    ]
  }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const errs = [];
  /* 页面侧助手：深色条的 dd 是「<dd>0.506<small>g</small></dd>」，单位在子元素里。
     waitForFunction 跑在页面上下文，看不到测试作用域的函数，所以用 addInitScript 装进去。*/
  await page.addInitScript(() => {
    window.__sq = (root, i) => {
      const d = document.querySelectorAll(root + ' > div')[i];
      if (!d) return null;
      const dd = d.querySelector('dd');
      if (!dd) return null;
      const c = dd.cloneNode(true);
      c.querySelectorAll('small').forEach((s) => s.remove());
      return c.textContent.trim();
    };
  });
  page.on('pageerror', (e) => errs.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await page.goto(toolURL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#mo-strip dd', { timeout: 15000 });

  const txt = (sel) => page.locator(sel).first().innerText();
  /* 深色条里的 dd 长这样：<dd>0.506<small>g</small></dd> —— 单位在子元素里，
     直接读 innerText 会拿到「0.506g」，必须把 <small> 摘掉再比。*/
  const stripVal = async (root, idx) => page.locator(`${root} > div`).nth(idx).locator('dd').evaluate((n) => {
    const c = n.cloneNode(true);
    c.querySelectorAll('small').forEach((s) => s.remove());
    return c.textContent.trim();
  });
  const num = (s) => parseFloat(String(s).replace(/[^0-9.eE+-]/g, ''));

  /* 切到某个页签并等它真的可见（隐藏面板里的控件对 fill/check 会卡满 30 s 超时） */
  const onTab = async (id) => {
    await page.click(`#tab-${id}`);
    await page.waitForFunction((t) => {
      const p = document.getElementById('pane-' + t);
      return p && !p.hidden && getComputedStyle(p).display !== 'none';
    }, id, { timeout: 15000 });
    await page.waitForTimeout(140);       // 让重算与 SVG 重绘 settle
  };

  // ── 1. 外壳 ────────────────────────────────────────────────────────
  assert((await txt('h1')).includes('地震工程'), '标题是地震工程工作台');
  const back = page.locator('a[href="../../"]').first();
  assert(await back.count() === 1 || await back.isVisible(), '有返回工具集的链接');
  assert((await page.locator('#sq-tabs button').count()) === ORACLE.meta.tabs.length,
    `页签数 = ${ORACLE.meta.tabs.length}`);
  assert((await page.locator('#mo-recs button').count()) === ORACLE.meta.records,
    `内置记录卡 ${ORACLE.meta.records} 张`);

  // ── 2. 地震动读数（对拍 scipy + eqsig 的独立重算）────────────────────
  assert(await stripVal('#mo-strip', 0) === ORACLE.txt.pga, `PGA 显示 ${ORACLE.txt.pga}`);
  assert(await stripVal('#mo-strip', 1) === ORACLE.txt.pgv, `PGV 显示 ${ORACLE.txt.pgv}`);
  assert(await stripVal('#mo-strip', 2) === ORACLE.txt.pgd, `PGD 显示 ${ORACLE.txt.pgd}`);
  assert(await stripVal('#mo-strip', 3) === ORACLE.txt.ia, `Arias 显示 ${ORACLE.txt.ia}`);
  assert(await stripVal('#mo-strip', 4) === ORACLE.txt.d595, `D5-95 显示 ${ORACLE.txt.d595}`);
  // 异源核对：页面的数必须等于 scipy/eqsig 独立算出来的那个
  const relOK = (a, b, tol) => Math.abs(a - b) / Math.max(1e-12, Math.abs(b)) < tol;
  assert(relOK(num(await stripVal('#mo-strip', 0)), ORACLE.xsrc.pga_g, 2e-3), 'PGA 与 scipy 管线一致');
  assert(relOK(num(await stripVal('#mo-strip', 1)), ORACLE.xsrc.pgv_cms, 2e-3), 'PGV 与 scipy 管线一致');
  assert(relOK(num(await stripVal('#mo-strip', 3)), ORACLE.xsrc.ia, 6e-3), 'Arias 与 scipy 管线一致');
  assert(relOK(num(await stripVal('#mo-strip', 4)), ORACLE.xsrc.d595, 1e-2), 'D5-95 与 scipy 管线一致');

  // 每张记录卡上的 PGA 必须等于 Python 侧解码后算出来的值
  for (const id of ORACLE.meta.recIds) {
    const card = page.locator(`#mo-recs button[data-rec="${id}"]`);
    assert(await card.count() === 1, `记录卡 ${id} 存在`);
    const shown = num(await card.locator('.sq-rec-num').innerText());
    assert(Math.abs(shown - ORACLE.xsrc.recPGA[id]) < 5e-4, `${id} 卡片 PGA ${shown} = ${ORACLE.xsrc.recPGA[id]}`);
  }

  // 强度指标表：至少 12 行
  assert((await page.locator('#mo-im tbody tr').count()) >= 12, '强度指标表 ≥ 12 行');
  /* 深色条上的 Arias 只有 2 位小数（2.33），把 g 从 9.80665 写成 9.81 只差 0.034%，
     在那个精度上根本看不出来 —— 2026-09-24 改坏验证实测这条溜过去了。
     强度指标表里是 3 位小数，分辨率 2.1e-4，刚好拦得住，故异源核对放在这里。*/
  const imRows = await page.$$eval('#mo-im tbody tr', (ns) => ns.map((r) => Array.from(r.cells).map((c) => c.innerText.trim())));
  const iaRow = imRows.find((r) => r[0].includes('Arias'));
  assert(iaRow, '强度指标表里应有 Arias 强度一行');
  assert(Math.abs(parseFloat(iaRow[1]) - ORACLE.xsrc.ia) / ORACLE.xsrc.ia < 2.5e-4,
    `Arias 表值 ${iaRow[1]} 与 scipy 管线 ${ORACLE.xsrc.ia} 应一致到 2.5e-4（g 常数写错就会红）`);
  const cavRow = imRows.find((r) => r[0].includes('CAV'));
  assert(cavRow && Math.abs(parseFloat(cavRow[1]) - ORACLE.xsrc.cav) / ORACLE.xsrc.cav < 2.5e-4,
    `CAV 表值应与 scipy 管线一致`);

  /* 图上的「峰值 …」标注必须和深色条里的读数是同一个数。
     2026-09-24 实撞：速度图标注打成「峰值 0.4 cm/s」而真值 41.4（曲线单位 m/s，轴单位 cm/s，
     标注漏了换算），位移图打成「0.3 cm」而真值 26.2 —— 当轮 145 条 DOM 断言全绿。
     这类「数字对不上但结构没错」的坑，只有把标注文字抠出来和读数对一遍才拦得住。*/
  const peakOf = async (figId) => {
    const t = await page.$$eval(`#${figId} text`, (ns) => ns.map((n) => n.textContent)
      .filter((x) => x.indexOf('峰值') === 0));
    assert(t.length === 1, `${figId} 应有且仅有一条峰值标注，实得 ${t.length}`);
    return parseFloat(t[0].replace('峰值', ''));
  };
  for (const [figId, idx, tol] of [['fig-acc', null, null], ['fig-vel', 1, 0.06], ['fig-disp', 2, 0.06]]) {
    const shown = await peakOf(figId);
    if (idx === null) {
      // 加速度图标注用 m/s²，深色条用 g —— 换算后比
      const g = parseFloat(await stripVal('#mo-strip', 0));
      assert(Math.abs(shown / 9.80665 - g) < 0.002, `${figId} 峰值标注 ${shown} m/s² 应等于 ${g} g`);
    } else {
      const v = parseFloat(await stripVal('#mo-strip', idx));
      assert(Math.abs(shown - v) < tol, `${figId} 峰值标注 ${shown} 应等于深色条读数 ${v}`);
    }
  }

  // ── 3. 改处理参数必须真的改变结果 ──────────────────────────────────
  const pgd0 = num(await stripVal('#mo-strip', 2));
  await page.fill('#mo-hp', '0.5');
  await page.waitForFunction((p0) => {
    const v = window.__sq('#mo-strip', 2);
    return v && Math.abs(parseFloat(v) - p0) > 0.05 * p0;
  }, pgd0, { timeout: 10000 });
  const pgd1 = num(await stripVal('#mo-strip', 2));
  assert(pgd1 < pgd0, `高通提到 0.5 Hz 后位移应变小：${pgd1} < ${pgd0}`);
  await page.fill('#mo-hp', '0.05');
  await page.waitForFunction((p0) => {
    const v = window.__sq('#mo-strip', 2);
    return v && Math.abs(parseFloat(v) - p0) < 1e-6;
  }, pgd0, { timeout: 10000 });

  // 调幅：目标 PGA 0.8 g 后 PGA 必须正好是 0.800
  await page.selectOption('#mo-scale', 'pga');
  await page.fill('#mo-pga', '0.8');
  await page.waitForFunction(() => {
    const v = window.__sq('#mo-strip', 0);
    return v && Math.abs(parseFloat(v) - 0.8) < 5e-4;
  }, null, { timeout: 10000 });
  assert(Math.abs(num(await stripVal('#mo-strip', 0)) - 0.8) < 5e-4, '按目标 PGA 调幅后 PGA = 0.800 g');
  await page.selectOption('#mo-scale', 'none');
  await page.waitForFunction((v) => window.__sq('#mo-strip', 0) === v, ORACLE.txt.pga, { timeout: 10000 });

  // 粘自有记录：导出成 AT2 再读回来，PGA 应当一致（打印器 / 解析器 round-trip）
  await page.click('#mo-demo');
  await page.click('#mo-load');
  await page.waitForFunction(() => (document.getElementById('mo-parse').textContent || '').indexOf('已载入') === 0,
    null, { timeout: 15000 });
  const parsed = await txt('#mo-parse');
  assert(parsed.includes('已载入'), 'AT2 往返解析成功：' + parsed);
  assert((await page.locator('#mo-recs button').count()) === ORACLE.meta.records + 1, '自有记录多出一张卡');
  // 换回内置记录
  await page.click(`#mo-recs button[data-rec="${ORACLE.meta.recIds[0]}"]`);
  await page.waitForFunction((v) => window.__sq('#mo-strip', 0) === v, ORACLE.txt.pga, { timeout: 10000 });

  // 坏输入要报错而不是崩
  await page.fill('#mo-text', 'foo bar\nbaz');
  await page.click('#mo-load');
  await page.waitForFunction(() => (document.getElementById('mo-parse').textContent || '').indexOf('解析失败') === 0,
    null, { timeout: 10000 });
  assert((await txt('#mo-parse')).startsWith('解析失败'), '非法文本给出解析失败提示');

  // ── 4. 反应谱 ──────────────────────────────────────────────────────
  await onTab('spectrum');
  assert(await stripVal('#sp-strip', 0) === ORACLE.txt.psa02, `pSa(0.2s) = ${ORACLE.txt.psa02}`);
  assert(await stripVal('#sp-strip', 1) === ORACLE.txt.psa10, `pSa(1.0s) = ${ORACLE.txt.psa10}`);
  assert(await stripVal('#sp-strip', 2) === ORACLE.txt.psa30, `pSa(3.0s) = ${ORACLE.txt.psa30}`);
  assert(await stripVal('#sp-strip', 3) === ORACLE.txt.si, `谱烈度 = ${ORACLE.txt.si}`);
  assert(await stripVal('#sp-strip', 4) === ORACLE.txt.peakT, `谱峰周期 = ${ORACLE.txt.peakT}`);
  assert(relOK(num(await stripVal('#sp-strip', 0)), ORACLE.xsrc.psa02_g, 3e-3), 'pSa(0.2s) 与 eqsig 管线一致');
  assert(relOK(num(await stripVal('#sp-strip', 1)), ORACLE.xsrc.psa10_g, 3e-3), 'pSa(1.0s) 与 eqsig 管线一致');
  assert(relOK(num(await stripVal('#sp-strip', 2)), ORACLE.xsrc.psa30_g, 3e-3), 'pSa(3.0s) 与 eqsig 管线一致');
  assert(relOK(num(await stripVal('#sp-strip', 3)), ORACLE.xsrc.si_cm, 3e-3), '谱烈度与 eqsig 管线一致');

  // 谱曲线真的画出来了（路径点数 = 网格点数量级），而不是空 path
  const specPaths = await page.$$eval('#fig-spec path[stroke]', (ns) => ns.map((n) => (n.getAttribute('d') || '').length));
  assert(specPaths.filter((l) => l > 400).length >= 4, `反应谱图至少 4 条实曲线，实得 ${specPaths.filter((l) => l > 400).length}`);

  // 换规范必须改变规范谱曲线
  const codeD = async () => page.$eval('#fig-spec path[stroke-dasharray]', (n) => n.getAttribute('d'));
  const gbD = await codeD();
  await page.selectOption('#cd-code', 'asce');
  await page.waitForFunction((d0) => {
    const n = document.querySelector('#fig-spec path[stroke-dasharray]');
    return n && n.getAttribute('d') !== d0;
  }, gbD, { timeout: 10000 });
  assert((await txt('#sp-cap')).includes('ASCE'), '切到 ASCE 后说明文字跟着变');
  await page.selectOption('#cd-code', 'ec8');
  await page.waitForFunction(() => (document.getElementById('sp-cap').textContent || '').includes('EN 1998'),
    null, { timeout: 10000 });
  await page.selectOption('#cd-code', 'gb');
  await page.waitForFunction((d0) => {
    const n = document.querySelector('#fig-spec path[stroke-dasharray]');
    return n && n.getAttribute('d') === d0;
  }, gbD, { timeout: 10000 });

  // 烈度从 8 度调到 9 度，规范谱必须整体抬高
  const alphaOf = async () => page.$eval('#cd-note', (n) => n.textContent);
  await page.selectOption('#gb-int', '9');
  await page.waitForFunction((t0) => document.getElementById('cd-note').textContent !== t0, await alphaOf(), { timeout: 10000 });
  assert((await alphaOf()).includes('0.32'), '9 度多遇 αmax = 0.32');
  await page.selectOption('#gb-int', '8');
  await page.waitForFunction(() => (document.getElementById('cd-note').textContent || '').includes('0.16'), null, { timeout: 10000 });

  // 谱值表：行数与列数
  assert((await page.locator('#sp-table tbody tr').count()) >= 10, '谱值表 ≥ 10 行');

  // ── 5. 单自由度 ────────────────────────────────────────────────────
  await onTab('sdof');
  await page.fill('#sd-t-num', '1');
  await page.waitForFunction(() => (window.__sq('#sd-strip', 0) || '').length > 0, null, { timeout: 10000 });
  await page.waitForTimeout(200);
  assert(await stripVal('#sd-strip', 0) === ORACLE.txt.sdSd, `T=1s 的 Sd = ${ORACLE.txt.sdSd}`);
  assert(await stripVal('#sd-strip', 1) === ORACLE.txt.sdSa, `T=1s 的 Sa = ${ORACLE.txt.sdSa}`);
  assert(await stripVal('#sd-strip', 2) === ORACLE.txt.sdPsa, `T=1s 的 pSa = ${ORACLE.txt.sdPsa}`);
  assert(relOK(num(await stripVal('#sd-strip', 0)), ORACLE.xsrc.sdofSd_cm, 3e-3), 'SDOF Sd 与 eqsig 一致');
  assert(relOK(num(await stripVal('#sd-strip', 2)), ORACLE.xsrc.sdofPsa_g, 3e-3), 'SDOF pSa 与 eqsig 一致');
  // 位移图的峰值标注要等于 Sd 读数（同上那条坑的第二处）
  const sdPeak = await page.$$eval('#fig-sd-u text', (ns) => ns.map((n) => n.textContent).filter((x) => x.indexOf('峰值') === 0));
  assert(sdPeak.length === 1, `单自由度位移图应有一条峰值标注，实得 ${sdPeak.length}`);
  assert(Math.abs(parseFloat(sdPeak[0].replace('峰值', '')) - parseFloat(await stripVal('#sd-strip', 0))) < 0.02,
    `单自由度位移峰值标注「${sdPeak[0]}」应等于 Sd 读数 ${await stripVal('#sd-strip', 0)}`);

  // 能量平衡残差必须远小于输入能
  const kv = await page.$$eval('#sd-kv dd', (ns) => ns.map((n) => n.textContent.trim()));
  const ei = parseFloat(kv[9]), resid = parseFloat(kv[11]);
  assert(resid / ei < 2e-3, `能量残差 ${resid} 相对输入能 ${ei} 应当可以忽略`);
  // 换周期必须换结果
  const sd0 = num(await stripVal('#sd-strip', 0));
  await page.fill('#sd-t-num', '3');
  await page.waitForFunction((v) => Math.abs(parseFloat(window.__sq('#sd-strip', 0)) - v) > 1e-6, sd0, { timeout: 10000 });
  assert(num(await stripVal('#sd-strip', 0)) > sd0, 'T 从 1 s 调到 3 s，位移应当变大');
  await page.fill('#sd-t-num', '1');
  await page.waitForFunction((v) => Math.abs(parseFloat(window.__sq('#sd-strip', 0)) - v) < 1e-9, sd0, { timeout: 10000 });

  // ── 6. 多层结构 ────────────────────────────────────────────────────
  await onTab('struct');
  assert(await stripVal('#st-strip', 0) === ORACLE.txt.T1, `T₁ = ${ORACLE.txt.T1}`);
  assert(await stripVal('#st-strip', 1) === ORACLE.txt.mtot, `总质量 = ${ORACLE.txt.mtot}`);
  assert(await stripVal('#st-strip', 2) === ORACLE.txt.thaV, `时程基底剪力 = ${ORACLE.txt.thaV}`);
  assert(await stripVal('#st-strip', 3) === ORACLE.txt.rsaV, `规范谱基底剪力 = ${ORACLE.txt.rsaV}`);
  assert(await stripVal('#st-strip', 4) === ORACLE.txt.drift, `最大层间位移角 = ${ORACLE.txt.drift}`);
  // 异源：T1/T2/T3 对 OpenSees
  const modeRows = await page.$$eval('#st-modes tbody tr', (ns) => ns.map((r) => Array.from(r.cells).map((c) => c.innerText.trim())));
  assert(modeRows.length >= 10, `模态表 ≥ 10 行，实得 ${modeRows.length}`);
  assert(relOK(parseFloat(modeRows[0][1]), ORACLE.xsrc.T1, 1e-3), `T1 与 OpenSees 一致：${modeRows[0][1]}`);
  assert(relOK(parseFloat(modeRows[1][1]), ORACLE.xsrc.T2, 1e-3), `T2 与 OpenSees 一致：${modeRows[1][1]}`);
  assert(relOK(parseFloat(modeRows[2][1]), ORACLE.xsrc.T3, 1e-3), `T3 与 OpenSees 一致：${modeRows[2][1]}`);
  // 性质：有效质量累计到 100%
  const cumLast = parseFloat(modeRows[modeRows.length - 1][5]);
  assert(Math.abs(cumLast - 100) < 0.02, `累计有效质量应到 100%，实得 ${cumLast}%`);
  // 周期严格降序
  for (let i = 1; i < modeRows.length; i++)
    assert(parseFloat(modeRows[i][1]) < parseFloat(modeRows[i - 1][1]), `第 ${i + 1} 阶周期应小于第 ${i} 阶`);

  // 改一层刚度 → 周期必须变；改回来必须还原
  const t1Before = await stripVal('#st-strip', 0);
  const stiffInput = page.locator('#st-edit input[data-kind="k"][data-i="0"]');
  const k0 = await stiffInput.inputValue();
  await stiffInput.fill(String(Math.round(parseFloat(k0) / 4)));
  await page.waitForFunction((v) => window.__sq('#st-strip', 0) !== v, t1Before, { timeout: 10000 });
  assert(parseFloat(await stripVal('#st-strip', 0)) > parseFloat(t1Before), '底层刚度削到 1/4，T₁ 必须变长');
  await page.locator('#st-edit input[data-kind="k"][data-i="0"]').fill(k0);
  await page.waitForFunction((v) => window.__sq('#st-strip', 0) === v, t1Before, { timeout: 10000 });

  // 层数改变 → 表格行数跟着变
  await page.fill('#st-n', '4');
  await page.waitForFunction(() => document.querySelectorAll('#st-edit tbody tr').length === 4, null, { timeout: 10000 });
  assert((await page.locator('#st-modes tbody tr').count()) === 4, '4 层时模态表 4 行');
  await page.fill('#st-n', String(ORACLE.meta.stories));
  await page.waitForFunction((n) => document.querySelectorAll('#st-edit tbody tr').length === n,
    ORACLE.meta.stories, { timeout: 10000 });
  await page.waitForFunction((v) => window.__sq('#st-strip', 0) === v, ORACLE.txt.T1, { timeout: 10000 });

  // 三张沿高分布图每张都要有三条曲线
  for (const fig of ['#fig-shear', '#fig-drift', '#fig-udisp']) {
    const paths = await page.$$eval(`${fig} path[stroke]`, (ns) => ns.map((n) => (n.getAttribute('d') || '').length));
    assert(paths.filter((l) => l > 40).length >= 3, `${fig} 应有 3 条曲线，实得 ${paths.filter((l) => l > 40).length}`);
  }

  // ── 7. 规范校核 ────────────────────────────────────────────────────
  await onTab('code');
  assert(await stripVal('#ck-strip', 0) === ORACLE.txt.alpha1, `α₁ = ${ORACLE.txt.alpha1}`);
  assert(await stripVal('#ck-strip', 1) === ORACLE.txt.FEk, `FEk = ${ORACLE.txt.FEk}`);
  assert(await stripVal('#ck-strip', 2) === ORACLE.txt.rsaV0, `振型分解基底剪力 = ${ORACLE.txt.rsaV0}`);
  assert(await stripVal('#ck-strip', 3) === ORACLE.txt.lamMin, `最小剪重比 = ${ORACLE.txt.lamMin}`);
  // 性质：底部剪力法的 ΣFi = FEk，且底层剪力 = FEk
  const gbRows = await page.$$eval('#ck-gb tbody tr', (ns) => ns.map((r) => Array.from(r.cells).map((c) => c.innerText.trim())));
  assert(gbRows.length === ORACLE.meta.stories, `底部剪力法表 ${ORACLE.meta.stories} 行`);
  const sumF = gbRows.reduce((s, r) => s + parseFloat(r[2]), 0);
  assert(Math.abs(sumF - parseFloat(ORACLE.txt.FEk)) / parseFloat(ORACLE.txt.FEk) < 2e-3,
    `ΣFi = ${sumF} 应等于 FEk = ${ORACLE.txt.FEk}`);
  assert(Math.abs(parseFloat(gbRows[gbRows.length - 1][3]) - parseFloat(ORACLE.txt.FEk)) / parseFloat(ORACLE.txt.FEk) < 2e-3,
    '底层剪力 = FEk');
  // 校核结论：4 条，每条都带一个徽标
  const verdicts = await page.locator('#ck-verdicts .sq-note').count();
  assert(verdicts === 4, `校核结论 4 条，实得 ${verdicts}`);
  assert((await page.locator('#ck-verdicts .sq-badge').count()) === 4, '每条结论带一个徽标');
  // 改结构类型必须改变位移角限值判定文字
  const v0 = await txt('#ck-verdicts');
  await page.selectOption('#ck-kind', 'steel');
  await page.waitForFunction((t0) => document.getElementById('ck-verdicts').innerText !== t0, v0, { timeout: 10000 });
  assert((await txt('#ck-verdicts')).includes('1/250'), '钢结构弹性位移角限值 1/250');
  await page.selectOption('#ck-kind', 'rcFrame');
  await page.waitForFunction(() => (document.getElementById('ck-verdicts').innerText || '').includes('1/550'), null, { timeout: 10000 });
  // ASCE 表：ΣFx = V
  const asceRows = await page.$$eval('#ck-asce tbody tr', (ns) => ns.map((r) => Array.from(r.cells).map((c) => c.innerText.trim())));
  const tot = asceRows[asceRows.length - 1];
  const sumFx = asceRows.slice(0, -1).reduce((s, r) => s + parseFloat(r[3]), 0);
  assert(Math.abs(sumFx - parseFloat(tot[3])) / parseFloat(tot[3]) < 2e-3, `ΣFx = ${sumFx} 应等于 V = ${tot[3]}`);

  // ── 8. 口径与校验页：页面公布的规模数字必须等于离线套件实测的字面量（异源）──
  await onTab('notes');
  const ntScale = await txt('#nt-scale');
  assert(ntScale.includes(String(ORACLE.verify.asserts)),
    `页面公布的断言条数应为 ${ORACLE.verify.asserts}，实得「${ntScale}」`);
  assert(ntScale.includes(String(ORACLE.verify.points)),
    `页面公布的对拍点数应为 ${ORACLE.verify.points}，实得「${ntScale}」`);
  const ntOps = await txt('#nt-ops');
  assert(ntOps.includes(String(ORACLE.verify.opsPoints)),
    `页面公布的 OpenSees 对拍点数应为 ${ORACLE.verify.opsPoints}，实得「${ntOps}」`);
  assert(ntOps.includes(ORACLE.verify.opsRel), `页面公布的最大相对差应为 ${ORACLE.verify.opsRel}`);
  // 记录来源表：每条内置记录一行，且 PGA 列对得上异源值
  const ntRows = await page.$$eval('#nt-recs tbody tr', (ns) => ns.map((r) => Array.from(r.cells).map((c) => c.innerText.trim())));
  assert(ntRows.length === ORACLE.meta.records, `记录来源表 ${ORACLE.meta.records} 行`);
  const pgaSet = new Set(Object.values(ORACLE.xsrc.recPGA).map((v) => v.toFixed(3)));
  for (const r of ntRows) {
    assert(/^[A-Z0-9]+\.[A-Z0-9]+\./.test(r[1]), `来源列应是台网.台站.位置.通道，实得「${r[1]}」`);
    assert(pgaSet.has(parseFloat(r[5]).toFixed(3)), `记录 PGA ${r[5]} 应在异源集合里`);
  }

  // ── 9. 渲染守卫：这些在结构断言上系统性失明，必须断计算样式与几何 ──
  // 9a. [hidden] 真的把面板藏住了（属性为真 ≠ 视觉藏住）
  const hiddenDisp = await page.$$eval('#sq-panes > div[hidden]', (ns) => ns.map((n) => getComputedStyle(n).display));
  assert(hiddenDisp.length === ORACLE.meta.tabs.length - 1, `应有 ${ORACLE.meta.tabs.length - 1} 个隐藏面板`);
  assert(hiddenDisp.every((d) => d === 'none'), `隐藏面板的计算样式必须是 none，实得 ${hiddenDisp.join(',')}`);

  // 9b. 控件最小尺寸 —— 逐页签扫一遍（藏在别的页签里的控件对这条守卫失明）
  let scanned = 0;
  for (const t of ORACLE.meta.tabs) {
    await onTab(t);
    const bad = await page.$$eval(`#pane-${t} input, #pane-${t} select, #pane-${t} button, #pane-${t} textarea`,
      (ns) => {
        const out = [];
        let n = 0;
        for (const el of ns) {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden' || (r.width === 0 && r.height === 0)) continue;
          n++;
          const type = el.type || el.tagName.toLowerCase();
          let minW = 100, minH = 18;
          if (type === 'button' || el.tagName === 'BUTTON') minW = 52;
          if (type === 'checkbox' || type === 'radio') { minW = 16; minH = 16; }
          if (type === 'range') minW = 100;
          if (r.width < minW - 0.5 || r.height < minH - 0.5)
            out.push(`${el.id || el.className || type} ${Math.round(r.width)}×${Math.round(r.height)} (需 ${minW}×${minH})`);
        }
        return { bad: out, n };
      });
    scanned += bad.n;
    assert(bad.bad.length === 0, `页签 ${t} 控件塌缩：${bad.bad.join('; ')}`);
  }
  assert(scanned >= 40, `六个页签累计应扫到 ≥40 个可见控件，实得 ${scanned}`);

  // 9c. text-transform 不许把单位符号改写成错字（断计算样式，扫文本是恒绿的）
  for (const t of ORACLE.meta.tabs) {
    await onTab(t);
    const upp = await page.$$eval(`#pane-${t} th, #pane-${t} dt, #pane-${t} label, #pane-${t} .sq-chip`,
      (ns) => ns.filter((n) => n.getBoundingClientRect().width > 0)
                .filter((n) => getComputedStyle(n).textTransform === 'uppercase')
                .map((n) => n.textContent.slice(0, 20)));
    assert(upp.length === 0, `页签 ${t} 有 ${upp.length} 个被 uppercase 改写的标签：${upp.join('|')}`);
  }

  // 9d. 逐视口 × 逐页签：横向不许溢出
  for (const vw of [390, 768, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of ORACLE.meta.tabs) {
      await onTab(t);
      const over = await page.evaluate(() => {
        const d = document.documentElement;
        const ext = d.scrollWidth - d.clientWidth;
        if (ext <= 1) return { ext, who: '' };
        const w = d.clientWidth, list = [];
        for (const el of document.querySelectorAll('#sq-panes *')) {
          const r = el.getBoundingClientRect();
          if (r.right > w + 1 && r.width > 0)
            list.push(`${el.tagName}.${(el.className || '').toString().split(' ')[0]}@${Math.round(r.right)}`);
        }
        return { ext, who: list.slice(0, 6).join(', ') };
      });
      assert(over.ext <= 1, `视口 ${vw} 页签 ${t} 横向溢出 ${over.ext}px：${over.who}`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 850 });

  // 9e. 卡片内的表格不许被裁（横向滚动容器自身不许溢出其父卡片）
  await onTab('struct');
  const tw = await page.$$eval('#pane-struct .sq-tw', (ns) => ns.map((n) => {
    const r = n.getBoundingClientRect(), p = n.parentElement.getBoundingClientRect();
    return { over: Math.round(r.right - p.right), w: Math.round(r.width) };
  }));
  assert(tw.every((x) => x.over <= 2), `表格容器溢出卡片：${JSON.stringify(tw)}`);

  // 9f. 图上的文字不许两两重叠（避让器失效时这条会红）
  for (const t of ['motion', 'spectrum', 'sdof', 'struct', 'code']) {
    await onTab(t);
    const hits = await page.$$eval(`#pane-${t} svg.sq-fig`, (svgs) => {
      const out = [];
      for (const svg of svgs) {
        if (svg.getBoundingClientRect().width === 0) continue;
        const ts = Array.from(svg.querySelectorAll('text')).filter((n) => n.textContent.trim());
        const boxes = ts.map((n) => ({ t: n.textContent.trim(), r: n.getBoundingClientRect() }))
                        .filter((b) => b.r.width > 0);
        for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i].r, b = boxes[j].r;
          const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (ox > 1.5 && oy > 1.5) out.push(`${svg.id}: 「${boxes[i].t}」×「${boxes[j].t}」`);
        }
      }
      return out;
    });
    assert(hits.length === 0, `页签 ${t} 图上文字重叠 ${hits.length} 处：${hits.slice(0, 4).join('; ')}`);
  }

  // 9g. 图里必须真的有刻度文字（避让器把所有标签都丢光时这条会红）
  await onTab('spectrum');
  const nTexts = await page.$eval('#fig-spec', (n) => n.querySelectorAll('text').length);
  assert(nTexts >= 10, `反应谱图应至少有 10 段文字（刻度+轴名），实得 ${nTexts}`);

  // ── 10. 持久化与分享码 ─────────────────────────────────────────────
  await onTab('code');
  await page.click('#ck-share');
  await page.waitForFunction(() => location.hash.startsWith('#s='), null, { timeout: 10000 });
  const shareURL = page.url();
  await page.goto(shareURL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => {
    const p = document.getElementById('pane-code');
    return p && !p.hidden;
  }, null, { timeout: 15000 });
  assert(await stripVal('#ck-strip', 1) === ORACLE.txt.FEk, '分享链接打开后回到同一状态');

  // ── 11. 零页面错误 ────────────────────────────────────────────────
  assert(errs.length === 0, '页面不应有任何 JS 错误：' + errs.slice(0, 3).join(' | '));

  /* 缩略图：回到「地震动」页。不能只 goto —— 上一步的分享码把 tab 存进了 localStorage，
     重新打开会停在「规范校核」，而 #mo-strip 藏在隐藏面板里，waitForSelector 等不到可见。*/
  await page.goto(toolURL.split('#')[0], { waitUntil: 'networkidle' });
  await page.waitForSelector('#sq-tabs button', { timeout: 15000 });
  await onTab('motion');
  await page.waitForSelector('#mo-strip dd', { state: 'visible', timeout: 15000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await screenshot('thumb.png');
};
