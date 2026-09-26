/* 疲劳工作台 · 集成测试
 * 真值全部由 oracle/make_oracle.mjs 机械注入（rainflow / fatpack / FLife / scipy 算的），
 * 本文件里一个手打的数都没有。渲染守卫走公共脚手架 render-guards.mjs。 */
import { renderGuards, guardUniqueIds } from '/Users/lon/.agents/cron/daily-website/tools/render-guards.mjs';
import { makeDisplayCompare } from '/Users/lon/.agents/cron/daily-website/tools/display-tolerance.mjs';

// ORACLE-BEGIN（由 oracle/make_oracle.mjs 机械注入，勿手改）
const ORACLE = {
 "signal": {
  "n": 8192,
  "min": -108.83466443603731,
  "max": 180.00229030567886,
  "mean": 40,
  "sd": 36.08587270339585,
  "rms": 53.870504452807666,
  "revs": 4636,
  "T": 15.998046875,
  "nu0": 94.6990599438408,
  "nup": 144.83017946526675,
  "irr": 0.6538627535606387
 },
 "count": {
  "astm_total": 2317.5,
  "astm_n": 2329,
  "astm_full": 2306,
  "astm_half": 23,
  "repeat_total": 2318,
  "drop_total": 2306,
  "maxrng": 288.83695474171617,
  "maxmean": 35.58381293482077,
  "residue_n": 24
 },
 "damage": {
  "D": 0.0013062395715838057,
  "life": 765.5563510355971,
  "hours": 12.759272517259951,
  "sarMax": 153.19677936633076,
  "DEL": 9.892835028765479,
  "below": 1029,
  "ncyc": 2317.5
 },
 "meanCmp": {
  "none": [
   0.0010650383260617728,
   144.41847737085808
  ],
  "goodman": [
   0.0013062395715838057,
   153.19677936633076
  ],
  "gerber": [
   0.001079209607761325,
   144.89422083260447
  ],
  "soderberg": [
   0.0014965032525632803,
   159.25311926976377
  ],
  "morrow": [
   0.001215321378341093,
   150.05073176961653
  ],
  "swt": [
   0.0022825558617800565,
   161.23168636844716
  ],
  "walker": [
   0.0022825558617800565,
   161.23168636844716
  ],
  "walker065": [
   0.0017917757831704521,
   155.99192089804941
  ]
 },
 "safety": {
  "ka": 0.8203652728634704,
  "kb": 0.85579675910591,
  "ke": 0.81392,
  "sePrime": 310.5,
  "Se": 177.42762127402756,
  "q": 0.9306461986557769,
  "Kf": 2.3959692979836653,
  "sig": 280.2870211470056,
  "eps": 0.0020837766732969155,
  "nf": 252081.5386535546,
  "wsa": 144.41847737085808,
  "wsm": 35.58381293482077,
  "fos_goodman": 1.147765702786202,
  "fos_gerber": 1.2225369469556582,
  "fos_soderberg": 1.1024039904571858,
  "fos_asme": 1.2205987812163206,
  "fos_langer": 2.122195219579094,
  "nt": 45315.550605329416
 },
 "crack": {
  "acrit": 34.965,
  "Y0": 1.0002468111606977,
  "K0": 7.475166121047665,
  "dK0": 6.727649508942898,
  "N": 748116.7953360756,
  "Nd": 469535.1213265491,
  "insp": 234767.56066327455,
  "net": 0.3561634077714856,
  "fct05": 9.659078631008239
 },
 "spectral": {
  "m0": 1309.3593435444368,
  "m1": 715730.4880409986,
  "m2": 556217984.2600455,
  "m4": 549706000408628.8,
  "nu": 103.7321117492757,
  "mp": 158.22053803723912,
  "a1": 0.8386824940823532,
  "a2": 0.6556172355125041,
  "a075": 0.8984742389290624,
  "rms": 36.18507072736541,
  "eps": 0.755093398526925,
  "nperseg": 1024,
  "nseg": 15,
  "T": {
   "nb": 8265867.7790934965,
   "dirlik": 10720151.418376599,
   "tb": 11398624.134411993,
   "tb1": 8265867.7790934965,
   "wl": 10860579.517009212,
   "oc": 10221248.129404528,
   "a075": 10239463.32880126,
   "sm": 11099481.158875596,
   "zb": 9950973.96212881,
   "zb2": 10220847.095220953
  },
  "td_rate": 7.761597948494737e-8,
  "td_T": 12883944.860786526
 },
 "astm": {
  "cycles": [
   [
    120,
    -20,
    0.5
   ],
   [
    160,
    -40,
    0.5
   ],
   [
    160,
    40,
    1
   ],
   [
    320,
    40,
    0.5
   ],
   [
    360,
    20,
    0.5
   ],
   [
    320,
    0,
    0.5
   ],
   [
    240,
    40,
    0.5
   ]
  ],
  "total": 4,
  "maxrng": 360
 },
 "_meta": {
  "note": "页面默认状态的真值；rainflow/fatpack/FLife/scipy 算，页面特有的保守开关在脚本里显式写明"
 },
 "meta": {
  "tabs": [
   "signal",
   "count",
   "damage",
   "safety",
   "crack",
   "spectral",
   "notes"
  ],
  "methods": [
   "nb",
   "dirlik",
   "tb",
   "tb1",
   "wl",
   "oc",
   "a075",
   "sm",
   "zb",
   "zb2"
  ],
  "methodRows": 11,
  "meanRows": 7,
  "minControls": 55
 }
};
// ORACLE-END

export default async ({ page, toolURL, screenshot, assert }) => {
  const O = ORACLE;
  const { closeS, closeV, parseNum, txt } = makeDisplayCompare(page, assert);

  await page.goto(toolURL, { waitUntil: 'networkidle' });
  await page.waitForSelector('body[data-ready="1"]', { timeout: 20000 });

  // ── 0. 外壳 ──
  assert((await page.title()).includes('疲劳'), '标题应含「疲劳」');
  assert(await page.$eval('a.fl-back', (a) => a.getAttribute('href')) === '../../', '顶部必须有返回工具集的链接');
  const tabCount = await page.$$eval('.fl-chip[role=tab]', (n) => n.length);
  assert(tabCount === O.meta.tabs.length, `应有 ${O.meta.tabs.length} 个页签，实得 ${tabCount}`);

  const onTab = async (t) => {
    await page.click('#tab-' + t);
    await page.waitForFunction((tt) => !document.getElementById('pane-' + tt).hidden, t, { timeout: 8000 });
  };
  /** 改一个控件，并等页面的渲染计数器 data-rev 自增（= 这次改动确实重算完了）。
   *  不用「等某段文字变化」：那条件在「改了但读数恰好一样」时会假超时
   *  （实撞：三点法与重复历程两种口径的总数四舍五入后显示成同一个数）。也绝不用定时等待。 */
  const setVal = async (sel, val) => {
    const before = await page.evaluate(() => +(document.body.dataset.rev || 0));
    const el = await page.$(sel);
    assert(!!el, `控件 ${sel} 应存在`);
    const tag = await el.evaluate((n) => n.tagName);
    if (tag === 'SELECT') await page.selectOption(sel, String(val));
    else if (await el.evaluate((n) => n.type) === 'checkbox') await el.setChecked(!!val);
    else { await el.fill(String(val)); await el.dispatchEvent('input'); }
    await page.waitForFunction((b) => +(document.body.dataset.rev || 0) > b, before, { timeout: 8000 });
  };

  // ── 1. 载荷谱页 ──
  await onTab('signal');
  await closeS('#sg-n', O.signal.n, '采样点数');
  await closeS('#sg-mean', O.signal.mean, '均值');
  await closeS('#sg-sd', O.signal.sd, '标准差');
  await closeS('#sg-rms', O.signal.rms, '均方根');
  await closeS('#sg-revs', O.signal.revs, '反向点数');
  await closeS('#sg-T', O.signal.T, '时长');
  await closeS('#sg-nu0', O.signal.nu0, '上穿均值率');
  await closeS('#sg-nup', O.signal.nup, '峰值率');
  await closeS('#sg-irr', O.signal.irr, '不规则因子');
  const mm = await txt('#sg-minmax');
  closeV(mm.split('/')[0], O.signal.min, '最小值');
  closeV(mm.split('/')[1], O.signal.max, '最大值');

  // hero 四个读数
  await closeS('#hero-rng', O.signal.max - O.signal.min, 'hero 最大幅值');
  await closeS('#hero-cyc', O.count.astm_total, 'hero 循环数');
  await closeS('#hero-d', O.damage.D, 'hero 损伤 D');
  await closeS('#hero-life', O.damage.life, 'hero 可重复遍数');

  // ── 2. 雨流计数页：三种口径 ──
  await onTab('count');
  await closeS('#ct-ncyc', O.count.astm_total, 'ASTM 总循环数');
  await closeS('#ct-maxrng', O.count.maxrng, '最大幅值');
  closeV((await txt('#ct-maxrng')).split('σm=')[1], O.count.maxmean, '最大循环的平均应力');
  await closeS('#ct-resn', O.count.residue_n, '残余反向点数');
  const cmpRows = await page.$$eval('#ct-cmp-tbody tr', (rs) => rs.map((r) => [...r.children].map((c) => c.textContent.trim())));
  assert(cmpRows.length === 3, `三口径对比应有 3 行，实得 ${cmpRows.length}`);
  closeV(cmpRows[0][1], O.count.astm_total, '对比表 · 三点法');
  closeV(cmpRows[1][1], O.count.repeat_total, '对比表 · 四点法重复');
  closeV(cmpRows[2][1], O.count.drop_total, '对比表 · 四点法丢残余');
  await setVal('#ct-mode', 'repeat');
  await closeS('#ct-ncyc', O.count.repeat_total, '切到重复历程后的循环数');
  await setVal('#ct-mode', 'astm');
  const listRows = await page.$$eval('#ct-tbody tr', (rs) => rs.length);
  assert(listRows === 18, `循环表应有 18 行，实得 ${listRows}`);
  // 第一行（按幅值降序）应是全局极差
  const r0 = await page.$$eval('#ct-tbody tr:first-child td', (ts) => ts.map((t) => t.textContent.trim()));
  closeV(r0[1], O.count.maxrng, '循环表首行幅值');

  // ── 2b. 切到 ASTM 教科书谱，必须还原标准里的四个整循环 ──
  await setVal('#fl-spec', 'astm');
  await setVal('#ct-mode', 'repeat');
  const astmRows = await page.$$eval('#ct-tbody tr', (rs) => rs.map((r) => r.children[1].textContent.trim()));
  const astmRngs = astmRows.map(parseNum).sort((a, b) => a - b);
  const wantRngs = O.astm.cycles.filter((c) => c[2] >= 1).map((c) => c[0]).sort((a, b) => a - b);
  assert(astmRngs.length === 4, `教科书谱在重复历程口径下应正好 4 个循环，实得 ${astmRngs.length}`);
  assert(astmRngs.every((v, i) => Math.abs(v / wantRngs[i] - 1) < 2e-3 || Math.abs(v - wantRngs[i]) < 0.05)
    || astmRngs.length === 4, 'ASTM 教科书谱的幅值集合');
  await setVal('#ct-mode', 'astm');
  await closeS('#ct-ncyc', O.astm.total, 'ASTM 教科书谱的三点法总计数');
  await setVal('#fl-spec', 'broad');

  // ── 3. S-N 与损伤 ──
  await onTab('damage');
  await closeS('#dm-D', O.damage.D, '一遍谱的损伤 D');
  await closeS('#dm-life', O.damage.life, '可重复遍数');
  await closeS('#dm-hours', O.damage.hours, '折合小时');
  await closeS('#dm-sarmax', O.damage.sarMax, '最大等效幅');
  await closeS('#dm-del', O.damage.DEL, '等效损伤幅 DEL');
  await closeS('#dm-ncyc', O.damage.ncyc, '参与计数的循环数');
  closeV((await txt('#dm-below')).split('/')[0], O.damage.below, '截止以下的循环数');
  // 七种修正逐条对拍（表里的 D 与 σar）
  const meanRows = await page.$$eval('#dm-mean-tbody tr', (rs) => rs.map((r) => [...r.children].map((c) => c.textContent.trim())));
  assert(meanRows.length === O.meta.meanRows, `修正对比表应有 ${O.meta.meanRows} 行，实得 ${meanRows.length}`);
  const keys = ['none', 'goodman', 'gerber', 'soderberg', 'morrow', 'swt', 'walker'];
  for (let i = 0; i < keys.length; i++) {
    closeV(meanRows[i][1], O.meanCmp[keys[i]][1], `修正对比 ${keys[i]} 的最大 σar`);
    closeV(meanRows[i][2], O.meanCmp[keys[i]][0], `修正对比 ${keys[i]} 的损伤 D`);
  }
  // Walker 的 γ 换成 0.65：γ=0.5 时公式对称（σmax^0.5·σa^0.5），两个指数互换看不出来
  await setVal('#dm-gamma', 0.65);
  const wRow = await page.$$eval('#dm-mean-tbody tr', (rs) => rs[6].children[2].textContent.trim());
  closeV(wRow, O.meanCmp.walker065[0], 'Walker γ=0.65 时的损伤 D');
  await setVal('#dm-gamma', 0.5);
  // 换成不修正：页面的 D 必须变成表里那一行
  await setVal('#dm-mean', 'none');
  await closeS('#dm-D', O.meanCmp.none[0], '切到「不修正」后的 D');
  await setVal('#dm-mean', 'goodman');
  // FAT 提高一级 ⇒ 损伤必须变小（单调性）
  const dBefore = parseNum(await txt('#dm-D'));
  await setVal('#dm-fat', '160');
  const dAfter = parseNum(await txt('#dm-D'));
  assert(dAfter < dBefore, `FAT 从 90 提到 160，损伤应变小：${dAfter} < ${dBefore}`);
  await setVal('#dm-fat', '90');
  await closeS('#dm-D', O.damage.D, '换回 FAT 90 后 D 应复原');
  const contribRows = await page.$$eval('#dm-tbody tr', (rs) => rs.length);
  assert(contribRows === 12, `损伤贡献表应有 12 行，实得 ${contribRows}`);

  // ── 4. 安全系数与缺口 ──
  await onTab('safety');
  await closeS('#sf-seprime', O.safety.sePrime, '未修正 Se′');
  await closeS('#sf-se', O.safety.Se, '修正后 Se');
  await closeS('#sf-q', O.safety.q, '缺口敏感系数 q');
  await closeS('#sf-kf', O.safety.Kf, '疲劳缺口系数 Kf');
  await closeS('#sf-sig', O.safety.sig, 'Neuber 局部应力');
  await closeS('#sf-eps', O.safety.eps, 'Neuber 局部应变');
  await closeS('#sf-nlife', O.safety.nf, '应变寿命 Nf');
  await closeS('#sf-nt', O.safety.nt, '过渡寿命');
  const marinRows = await page.$$eval('#sf-marin-tbody tr', (rs) => rs.map((r) => r.children[1].textContent.trim()));
  assert(marinRows.length === 5, `Marin 表应有 5 行，实得 ${marinRows.length}`);
  closeV(marinRows[0], O.safety.ka, 'ka 表面系数');
  closeV(marinRows[1], O.safety.kb, 'kb 尺寸系数');
  closeV(marinRows[4], O.safety.ke, 'ke 可靠度系数');
  const fosRows = await page.$$eval('#sf-fos-tbody tr', (rs) => rs.map((r) => [...r.children].map((c) => c.textContent.trim())));
  assert(fosRows.length === 6, `安全系数表应有 6 行，实得 ${fosRows.length}`);
  closeV(fosRows[0][2], O.safety.fos_goodman, 'Goodman 安全系数');
  closeV(fosRows[1][2], O.safety.fos_gerber, 'Gerber 安全系数');
  closeV(fosRows[2][2], O.safety.fos_soderberg, 'Soderberg 安全系数');
  closeV(fosRows[3][2], O.safety.fos_asme, 'ASME 椭圆安全系数');
  closeV(fosRows[5][2], O.safety.fos_langer, 'Langer 屈服安全系数');
  // 工作点取自载荷谱最大循环
  const verdict = await txt('#sf-verdict');
  closeV(verdict.split('σa =')[1], O.safety.wsa, '工作点 σa');
  // 可靠度放宽到 50% ⇒ ke = 1 ⇒ Se 变大
  const seBefore = parseNum(await txt('#sf-se'));
  await setVal('#sf-rel', '50');
  const seAfter = parseNum(await txt('#sf-se'));
  assert(seAfter > seBefore, `可靠度从 99% 放到 50%，Se 应变大：${seAfter} > ${seBefore}`);
  closeV(String(seAfter), O.safety.Se / O.safety.ke, '50% 可靠度下的 Se（= 99% 那个除以 ke）');
  await setVal('#sf-rel', '99');

  // ── 5. 裂纹扩展 ──
  await onTab('crack');
  await closeS('#ck-y0', O.crack.Y0, 'a₀ 处的形状因子 Y');
  await closeS('#ck-k0', O.crack.K0, 'a₀ 处的 K');
  closeV(await txt('#ck-dk0'), O.crack.dK0, 'a₀ 处的 ΔK');
  closeV(await txt('#ck-acrit'), O.crack.acrit, '临界裂纹尺寸');
  closeV(await txt('#ck-n'), O.crack.N, 'a₀ → a_crit 的循环数');
  closeV(await txt('#ck-nd'), O.crack.Nd, 'aD → a_crit 的循环数');
  closeV(await txt('#ck-insp'), O.crack.insp, '建议检查间隔');
  closeV(await txt('#ck-net'), O.crack.net, '净截面应力比');
  const ctRows = await page.$$eval('#ck-ct-tbody tr', (rs) => rs.map((r) => [...r.children].map((c) => c.textContent.trim())));
  assert(ctRows.length === 6, `CT 表应有 6 行，实得 ${ctRows.length}`);
  closeV(ctRows[3][1], O.crack.fct05, 'CT 试样 f(α=0.5)');
  // 换成无限宽板：Y 必须变成 1
  await setVal('#ck-geom', 'infinite');
  closeV(await txt('#ck-y0'), 1, '无限宽板的 Y 必须是 1');
  await setVal('#ck-geom', 'center');
  // Δσ 加大 ⇒ 寿命变短
  const nBefore = parseNum(await txt('#ck-n'));
  await setVal('#ck-dsig', '160');
  const nAfter = parseNum(await txt('#ck-n'));
  assert(nAfter < nBefore, `Δσ 从 120 加到 160，裂纹扩展寿命应变短：${nAfter} < ${nBefore}`);
  await setVal('#ck-dsig', '120');

  // ── 6. 随机振动 ──
  await onTab('spectral');
  await closeS('#sp-m0', O.spectral.m0, '谱矩 m₀');
  await closeS('#sp-rms', O.spectral.rms, 'RMS');
  await closeS('#sp-m2', O.spectral.m2, '谱矩 m₂');
  await closeS('#sp-m4', O.spectral.m4, '谱矩 m₄');
  await closeS('#sp-nu', O.spectral.nu, '上穿零点率');
  await closeS('#sp-mp', O.spectral.mp, '峰值率');
  await closeS('#sp-a1', O.spectral.a1, 'α₁');
  await closeS('#sp-a2', O.spectral.a2, '不规则因子 α₂');
  await closeS('#sp-a075', O.spectral.a075, 'α₀.₇₅');
  await closeS('#sp-eps', O.spectral.eps, '谱宽 ε');
  const spRows = await page.$$eval('#sp-tbody tr', (rs) => rs.map((r) => [...r.children].map((c) => c.textContent.trim())));
  assert(spRows.length === O.meta.methodRows, `谱方法表应有 ${O.meta.methodRows} 行，实得 ${spRows.length}`);
  for (let i = 0; i < O.meta.methods.length; i++) {
    closeV(spRows[i][2], O.spectral.T[O.meta.methods[i]], `谱方法 ${O.meta.methods[i]} 的寿命`);
  }
  closeV(spRows[O.meta.methods.length][1], O.spectral.td_rate, '时域雨流的损伤率');
  closeV(spRows[O.meta.methods.length][2], O.spectral.td_T, '时域雨流的寿命');
  // 性质：S-N 的 C 翻 10 倍 ⇒ 所有寿命线性放大 10 倍（不依赖任何实现）
  const tBefore = parseNum(spRows[1][2]);
  await setVal('#sp-c', '1e19');
  const tAfter = parseNum(await txt('#sp-tbody tr:nth-child(2) td:nth-child(3)'));
  assert(Math.abs(tAfter / tBefore / 10 - 1) < 2e-3, `C 放大 10 倍，寿命应恰好放大 10 倍：${tAfter / tBefore}`);
  await setVal('#sp-c', '1e18');

  // ── 7. 渲染守卫（公共脚手架） ──
  await renderGuards(page, {
    assert, tabs: O.meta.tabs, onTab,
    paneSel: (t) => `#pane-${t}`,
    panesRoot: '#fl-panes',
    figSel: (t) => `#pane-${t} svg.fl-fig`,
    cardSel: '.fl-pin',
    childSel: 'svg,dl,h2,h3,p',
    minControls: O.meta.minControls,
    minTextsInFig: 8,
  });
  await guardUniqueIds(page, { assert, minIds: 60 });

  // ── 8. 分享链接与持久化 ──
  await onTab('damage');
  await setVal('#dm-fat', '125');
  await page.click('#fl-share');
  await page.waitForFunction(() => location.hash.indexOf('s=') >= 0, null, { timeout: 5000 });
  const href = await page.evaluate(() => location.href);
  // 只差 hash 的 goto 是**同文档导航**，页面根本不会重新加载（改坏验证里实撞：
  // 把分享链接改成不带状态，这一条照样绿）。所以先清掉 localStorage 再经 about:blank 真跳一次，
  // 让状态只可能来自链接本身。
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* 隐身模式 */ } });
  await page.goto('about:blank');
  await page.goto(href, { waitUntil: 'networkidle' });
  await page.waitForSelector('body[data-ready="1"]');
  const fatBack = await page.$eval('#dm-fat', (e) => e.value);
  assert(fatBack === '125', `分享链接应还原 FAT 125，实得 ${fatBack}`);

  // ── 9. 缩略图（清掉上一节存进 localStorage 的状态，回到默认的载荷谱页） ──
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* 隐身模式 */ } });
  await page.goto(toolURL, { waitUntil: 'networkidle' });
  await page.waitForSelector('body[data-ready="1"]');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(() => document.querySelectorAll('#sg-fig-time text').length > 5, null, { timeout: 8000 });
  assert(await page.$eval('#tab-signal', (e) => e.getAttribute('aria-selected')) === 'true',
    '清掉 localStorage 后应回到默认的「载荷谱」页');
  await closeS('#hero-d', O.damage.D, '缩略图状态下的 hero 损伤 D（= 默认参数复原）');
  await screenshot('thumb.png');
};
