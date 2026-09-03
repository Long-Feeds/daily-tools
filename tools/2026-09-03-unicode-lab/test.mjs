// Unicode 工作台 · 浏览器集成测试
// 断言真实交互后的真实输出；并带上本站踩出来的几条通用守卫：
//   [hidden] 计算样式 / 控件塌缩（逐 tab 扫）/ 窄屏横向溢出（逐视口 × 逐 tab）
//   / 小格子里的子元素不越界 / 能力清单逐项命中 / HTML 实体没被当字面显示。
export default async ({ page, toolURL, screenshot, assert: rawAssert }) => {
  let N = 0;
  const assert = (cond, msg) => { N++; rawAssert(cond, msg); };
  await page.goto(toolURL, { waitUntil: 'load' });
  await page.waitForFunction(() => window.UL && document.querySelectorAll('#ul-rail button').length === 8);

  const TABS = ['inspect', 'normalize', 'segment', 'bidi', 'spoof', 'encoding', 'browse', 'about'];
  const go = async (id) => {
    await page.click('#t-' + id);
    await page.waitForFunction((x) => !document.getElementById('p-' + x).hidden, id);
    await page.waitForTimeout(60);
  };
  const txt = (sel) => page.textContent(sel);
  const setVal = async (sel, v) => {
    await page.fill(sel, v);
    await page.waitForTimeout(120);
  };

  // ---------------------------------------------------------- 0. 返回链接与页面骨架
  assert(await page.getAttribute('.ul-back', 'href') === '../../', '顶部必须有返回工具集的链接');
  assert((await txt('#ul-ver')).includes('16.0.0'), '页头应当写明 UCD 版本');
  const heroFacts = await page.$$eval('.ul-fact b', (ns) => ns.map((n) => n.textContent));
  assert(heroFacts[0] === '40,013', '英雄区应当报出 40013 个字符名，实得 ' + heroFacts[0]);
  assert(+heroFacts[1] > 320 && +heroFacts[2] > 160, '区块数与文字系统数应当是真实规模：' + heroFacts.join('/'));

  // ---------------------------------------------------------- 1. 解剖：真实读数
  await go('inspect');
  // 一家四口 emoji：1 簇 / 7 码点 / 11 个 UTF-16 单元 / 25 字节
  await setVal('#ul-in-text', '👩‍👩‍👧‍👦');
  let stats = await page.$$eval('#ul-stats .ul-stat', (ns) =>
    ns.map((n) => [n.querySelector('span').textContent, n.querySelector('b').textContent]));
  const S = Object.fromEntries(stats);
  assert(S['字素簇'] === '1', '家庭 emoji 应当是 1 个字素簇，实得 ' + S['字素簇']);
  assert(S['码点'] === '7', '家庭 emoji 应当是 7 个码点，实得 ' + S['码点']);
  assert(S['UTF-16 单元'] === '11', '应当是 11 个 UTF-16 单元，实得 ' + S['UTF-16 单元']);
  assert(S['UTF-8 字节'] === '25', '应当是 25 个 UTF-8 字节，实得 ' + S['UTF-8 字节']);
  assert((await page.$$('#ul-clusters .ul-chip')).length === 1, '条带里应当只有 1 个簇');
  // 簇条带必须原样渲染（把 ZWJ 换成记号的话 emoji 就合不成一个字形了）
  const chipGlyph = await page.$eval('#ul-clusters .ul-chip .ul-cg', (n) => n.textContent);
  assert([...chipGlyph].length === 7, '簇条带应当原样放 7 个码点让字体合成，实得 ' + [...chipGlyph].length);
  assert(chipGlyph.charCodeAt(2) === 0x200D, '簇里的 ZWJ 应当原样保留');
  // emoji 序列里的 ZWJ 是正常成分，不该被报成「藏字符」
  const emojiRisks = await page.$$eval('#ul-risks .ul-risk', (ns) => ns.map((n) => n.textContent));
  assert(emojiRisks.length === 0, 'emoji 序列不该报出风险，实得：' + emojiRisks.join(' | '));

  // 表格第一行必须是 WOMAN，第二行必须是 ZWJ
  let row1 = await page.$$eval('#ul-cptable tbody tr:nth-child(1) td', (ns) => ns.map((n) => n.textContent));
  assert(row1[2] === 'U+1F469' && row1[3] === 'WOMAN', '第 1 个码点应当是 U+1F469 WOMAN，实得 ' + row1.slice(2, 4));
  let row2 = await page.$$eval('#ul-cptable tbody tr:nth-child(2) td', (ns) => ns.map((n) => n.textContent));
  assert(row2[2] === 'U+200D' && row2[3] === 'ZERO WIDTH JOINER', '第 2 个码点应当是 ZWJ，实得 ' + row2.slice(2, 4));
  assert(row1[10] === 'F0 9F 91 A9', 'WOMAN 的 UTF-8 应当是 F0 9F 91 A9，实得 ' + row1[10]);

  // 中文的终端列宽
  await setVal('#ul-in-text', '你好abc');
  stats = await page.$$eval('#ul-stats .ul-stat', (ns) =>
    ns.map((n) => [n.querySelector('span').textContent, n.querySelector('b').textContent]));
  assert(Object.fromEntries(stats)['终端列宽'] === '7', '「你好abc」应当占 7 列');

  // 风险扫描要真的报出零宽字符与脚本混排
  await setVal('#ul-in-text', 'admin​user­name');
  let risks = await page.$$eval('#ul-risks .ul-risk', (ns) => ns.map((n) => n.textContent));
  assert(risks.some((r) => r.includes('零宽空格')), '应当报出零宽空格，实得：' + risks.join(' | '));
  assert(risks.some((r) => r.includes('软连字符')), '应当报出软连字符');
  await setVal('#ul-in-text', 'аpple');
  risks = await page.$$eval('#ul-risks .ul-risk', (ns) => ns.map((n) => n.textContent));
  assert(risks.some((r) => r.includes('脚本混排') && r.includes('Cyrillic')), '应当报出西里尔 + 拉丁的脚本混排');

  // 选中字符详情
  await page.click('#ul-cptable tbody tr:nth-child(1)');
  await page.waitForTimeout(60);
  let detail = await txt('#ul-detail');
  assert(detail.includes('CYRILLIC SMALL LETTER A'), '详情应当是西里尔小写 а，实得 ' + detail.slice(0, 60));
  let escapes = await page.$$eval('#ul-escapes tbody tr', (ns) => ns.map((n) => n.children[1].textContent));
  assert(escapes.includes('\\u0430'), 'JS 转义应当是 \\u0430，实得 ' + escapes.join(','));
  assert(escapes.includes('%D0%B0'), 'URL 编码应当是 %D0%B0');

  await setVal('#ul-in-text', '👩‍👩‍👧‍👦 аpple.com');

  // ---------------------------------------------------------- 2. 规范化
  await go('normalize');
  // 输入写成显式转义：e + 组合尖音符(0301) + 连字 ﬁ(FB01) + ½(00BD)，共 11 个码点
  await setVal('#ul-nf-text', 'cafe\u0301 \uFB01le \u00BD');
  const nf = await page.$$eval('#ul-nf-table tbody tr', (ns) =>
    ns.map((n) => [...n.children].map((c) => c.textContent)));
  const byForm = Object.fromEntries(nf.map((r) => [r[0], r]));
  assert(byForm['原文'][2] === '11', '原文应当是 11 个码点，实得 ' + byForm['原文'][2]);
  assert(byForm['NFC'][2] === '10', 'NFC 应当把 e+0301 合成一个码点 -> 10，实得 ' + byForm['NFC'][2]);
  assert(byForm['NFD'][2] === '11', 'NFD 应当仍是 11 个码点，实得 ' + byForm['NFD'][2]);
  assert(byForm['NFKC'][2] === '13' && byForm['NFKD'][2] === '14',
    'NFKC/NFKD 应当是 13/14 个码点，实得 ' + byForm['NFKC'][2] + '/' + byForm['NFKD'][2]);
  assert(byForm['NFC'][3] === '14' && byForm['NFD'][3] === '15',
    'NFC/NFD 的 UTF-8 字节应当是 14/15，实得 ' + byForm['NFC'][3] + '/' + byForm['NFD'][3]);
  assert(byForm['NFKC'][1].includes('file'), 'NFKC 应当把 ﬁ 拆成 fi，实得 ' + byForm['NFKC'][1]);
  assert(byForm['NFKC'][1].includes('1⁄2'), 'NFKC 应当把 ½ 变成 1⁄2');
  assert(byForm['NFD'][4] === '不变' && byForm['NFC'][4] === '变了',
    '这串原文本来就是 NFD，所以 NFD 标「不变」、NFC 标「变了」，实得 '
      + byForm['NFD'][4] + '/' + byForm['NFC'][4]);

  // 逐步展开：NFD 的第 2 步必须比原文长
  await page.selectOption('#ul-nf-form', 'NFD');
  await page.waitForTimeout(120);
  const stepHeads = await page.$$eval('#ul-nf-steps h4', (ns) => ns.map((n) => n.textContent));
  assert(stepHeads.length === 3 && stepHeads[1].includes('标准分解'), 'NFD 应当是 3 步，实得 ' + stepHeads.join(' / '));
  await page.selectOption('#ul-nf-form', 'NFKC');
  await page.waitForTimeout(120);
  const stepHeads2 = await page.$$eval('#ul-nf-steps h4', (ns) => ns.map((n) => n.textContent));
  assert(stepHeads2.length === 4 && stepHeads2[3].includes('标准组合'), 'NFKC 应当是 4 步');
  const diffRows = await page.$$eval('#ul-nf-diff tbody tr', (ns) =>
    ns.map((n) => [...n.children].map((c) => c.textContent)));
  assert(diffRows.some((r) => r[1] === 'U+FB01' && r[4] === 'U+0066 U+0069'),
    'ﬁ 应当在差异表里变成 f + i，实得 ' + JSON.stringify(diffRows.map((r) => r[1])));

  // ---------------------------------------------------------- 3. 分段
  await go('segment');
  await setVal('#ul-sg-text', 'a👩‍👩b');
  const gsegs = await page.$$eval('#ul-sg-grapheme .ul-chip', (ns) =>
    ns.map((n) => [...n.children].map((c) => c.textContent)));
  assert(gsegs.length === 3, '「a + ZWJ emoji + b」应当是 3 个字素簇，实得 ' + gsegs.length);
  // 簇标签写的是「这个簇为什么在这里断开」；ZWJ 把两个 emoji 粘住的那条规则(GB11)
  // 出现在簇内部，去逐码点表里核对它确实命中了
  const gRule = await page.$$eval('#ul-sg-table tbody tr', (ns) =>
    ns.map((n) => [...n.children].map((c) => c.textContent)));
  assert(gRule.length === 5, '这串应当是 5 个码点，实得 ' + gRule.length);
  assert(gRule[2][3] === 'GB9' && gRule[2][4] === 'ZWJ', '第 3 个码点是 ZWJ，由 GB9 吸附，实得 ' + gRule[2].slice(3, 5));
  assert(gRule[3][3] === 'GB11', '第 4 个码点(第二个 emoji) 前面应当由 GB11 禁断，实得 ' + gRule[3][3]);
  assert(gsegs[1][1] === 'GB999', '中间那个簇在 b 之前按 GB999 断开，实得 ' + gsegs[1][1]);
  // 与浏览器自带 Intl.Segmenter 一致
  for (const id of ['ul-sg-cmp-g', 'ul-sg-cmp-w', 'ul-sg-cmp-s']) {
    const t = await txt('#' + id);
    assert(t.includes('一致'), id + ' 应当与浏览器 Intl.Segmenter 一致，实得：' + t);
  }
  await setVal('#ul-sg-text', 'Dr. Smith went home. He slept.');
  const sents = await page.$$eval('#ul-sg-sentence > div', (ns) => ns.map((n) => n.textContent));
  // UAX #29 的默认句边界没有缩写词典，所以 "Dr." 后面确实会断——这一点与浏览器 ICU 完全一致，
  // 页面上也写明了。断言按真实行为写，并顺手与 Intl.Segmenter 对一次。
  assert(sents.length === 3, '默认算法应当切成 3 句（Dr. 后面也断），实得 ' + sents.length + ': ' + sents.join(' || '));
  assert(sents[0].includes('Dr. '), '第 1 句应当是 "Dr. "，实得 ' + sents[0]);
  const icuSents = await page.evaluate(() =>
    [...new Intl.Segmenter('en', { granularity: 'sentence' }).segment(document.getElementById('ul-sg-text').value)]
      .map((x) => x.segment));
  assert(icuSents.length === 3 && icuSents[0] === 'Dr. ', '浏览器 ICU 也应当切成 3 句，实得 ' + JSON.stringify(icuSents));
  assert((await txt('#ul-sg-cmp-s')).includes('一致'), '句边界应当与浏览器一致');
  // 换行：空格后有断点、单词内没有
  const lineMarks = await txt('#ul-sg-line');
  assert(lineMarks.includes('·'), '换行机会里应当出现 · 标记');
  const lbRows = await page.$$eval('#ul-sg-table tbody tr', (ns) =>
    ns.map((n) => [...n.children].map((c) => c.textContent)));
  const rSmith = lbRows.find((r) => r[1] === 'S');
  assert(rSmith && rSmith[8].startsWith('可以'), '「Smith」的 S 之前应当可以换行，实得 ' + (rSmith && rSmith[8]));
  const rM = lbRows.filter((r) => r[1] === 'm')[0];
  assert(rM && rM[8].startsWith('不行'), '单词内部不应当允许换行，实得 ' + (rM && rM[8]));
  // 折行确实按宽度生效
  await setVal('#ul-sg-width', '12');
  const wrapped = (await txt('#ul-sg-wrap')).split('\n');
  assert(wrapped.length === 3, '宽 12 列时应当折成 3 行，实得 ' + wrapped.length + ': ' + JSON.stringify(wrapped));
  // 每一行都不许超过预算（除非某一「块」本身就比预算宽，本例没有）
  const wide = wrapped.filter((l) => [...l].length > 12);
  assert(wide.length === 0, '折行后每一行都不应当超过 12 列：' + JSON.stringify(wide));
  assert(wrapped.join(' ').replace(/\s+/g, ' ') === 'Dr. Smith went home. He slept.',
    '折行不应当丢字或改字，实得 ' + JSON.stringify(wrapped));
  // 换个宽度必须真的重排
  await setVal('#ul-sg-width', '40');
  assert((await txt('#ul-sg-wrap')).split('\n').length === 1, '宽 40 列时应当只有 1 行');

  // ---------------------------------------------------------- 4. 双向
  await go('bidi');
  await setVal('#ul-bd-text', 'he said שלום');
  await page.selectOption('#ul-bd-dir', '0');
  await page.waitForTimeout(120);
  const visual = await txt('#ul-bd-visual');
  assert(visual === 'he said םולש', '希伯来词应当被反转，实得 ' + JSON.stringify(visual));
  assert((await txt('#ul-bd-para')).includes('段落层级 0'), 'LTR 时段落层级应当是 0');
  // 存储顺序那一栏必须禁用浏览器自己的重排，否则两栏长得一模一样、整个演示失去意义
  const logical = await txt('#ul-bd-logical');
  assert(logical !== visual, '存储顺序与视觉顺序两栏必须不同，实得都是 ' + JSON.stringify(logical));
  const ubidi = await page.$eval('#ul-bd-logical', (n) => getComputedStyle(n).unicodeBidi);
  assert(/bidi-override/.test(ubidi), '存储顺序栏必须 unicode-bidi:bidi-override，实得 ' + ubidi);
  const bdRows = await page.$$eval('#ul-bd-table tbody tr', (ns) =>
    ns.map((n) => [...n.children].map((c) => c.textContent)));
  const heb = bdRows.filter((r) => r[4] === 'R');
  assert(heb.length === 4, '应当有 4 个 R 类字符，实得 ' + heb.length);
  assert(heb.every((r) => r[6] === '1'), '希伯来字母的层级应当是 1，实得 ' + heb.map((r) => r[6]));
  // 自动方向：以希伯来字母开头 -> 段落层级 1
  await page.selectOption('#ul-bd-dir', '2');
  await setVal('#ul-bd-text', 'שלום world');
  assert((await txt('#ul-bd-para')).includes('段落层级 1'), '以希伯来字母开头时段落层级应当是 1');
  // Trojan Source：两副面孔必须真的不同，且视觉上把危险调用「关进」了 if
  const look = await txt('#ul-bd-tj-look'), real = await txt('#ul-bd-tj-real');
  assert(look !== real, 'Trojan Source 的两栏必须不同');
  assert(look.includes('if (isAdmin) {'), '编辑器视图里应当出现 if (isAdmin) {，实得：' + JSON.stringify(look));
  assert(!real.includes('if (isAdmin) {\n') && real.includes('‹RLO›'),
    '实际字符序列里应当显形出 RLO 记号');
  assert(real.split('\n')[1].startsWith('/*'), '第 2 行在存储顺序里其实是一整条注释');

  // ---------------------------------------------------------- 5. 同形与安全
  await go('spoof');
  await setVal('#ul-sp-a', 'apple.com');
  await setVal('#ul-sp-b', 'аpple.com');
  let verdict = await txt('#ul-sp-verdict');
  assert(verdict.includes('骨架相同'), '西里尔 а 版本应当被判为骨架相同，实得 ' + verdict.slice(0, 80));
  assert(verdict.includes('Cyrillic'), '应当报出西里尔脚本');
  const spRows = await page.$$eval('#ul-sp-table tbody tr', (ns) =>
    ns.map((n) => [...n.children].map((c) => c.textContent)));
  assert(spRows[0][7] === '互为混淆', '第 1 个字符应当被判互为混淆，实得 ' + spRows[0][7]);
  assert(spRows[1][7] === '相同', '第 2 个字符应当相同');
  await setVal('#ul-sp-b', 'githab.com');
  verdict = await txt('#ul-sp-verdict');
  assert(verdict.includes('骨架不同'), 'githab.com 应当被判骨架不同');
  // 域名体检
  await setVal('#ul-sp-domain', 'аpple.com');
  const cards = await page.$$eval('#ul-sp-domain-out .ul-card', (ns) => ns.map((n) => n.textContent));
  assert(cards.length === 3, '两段标签 + 整域骨架 = 3 张卡，实得 ' + cards.length);
  assert(cards[0].includes('xn--pple-43d'), '首标签的 ASCII 形式应当是 xn--pple-43d，实得 ' + cards[0].slice(0, 120));
  assert(cards[0].includes('Cyrillic') && cards[0].includes('Latin'), '首标签应当报出两种脚本');
  const levelRows = await page.$$eval('#ul-sp-levels tbody tr', (ns) => ns.length);
  assert(levelRows === 6, '受限等级表应当有 6 行，实得 ' + levelRows);

  // ---------------------------------------------------------- 6. 编码
  await go('encoding');
  await setVal('#ul-en-text', '你');
  const enRows = await page.$$eval('#ul-en-table tbody tr', (ns) =>
    ns.map((n) => [...n.children].map((c) => c.textContent)));
  const enc = Object.fromEntries(enRows.map((r) => [r[0], r]));
  assert(enc['UTF-8'][2] === 'E4 BD A0', '你 的 UTF-8 应当是 E4 BD A0，实得 ' + enc['UTF-8'][2]);
  assert(enc['UTF-16LE'][2] === '60 4F', '你 的 UTF-16LE 应当是 60 4F，实得 ' + enc['UTF-16LE'][2]);
  assert(enc['UTF-16BE'][2] === '4F 60', '你 的 UTF-16BE 应当是 4F 60');
  assert(enc['UTF-32BE'][2] === '00 00 4F 60', '你 的 UTF-32BE 应当是 00 00 4F 60');
  // 解码：合法与非法
  await setVal('#ul-de-bytes', 'E4 BD A0 E5 A5 BD');
  assert((await txt('#ul-de-out')) === '你好', '应当解出「你好」');
  assert((await txt('#ul-de-detail')).includes('全部合法'), '合法序列应当报全部合法');
  await setVal('#ul-de-bytes', 'E4 BD 41 42');
  let deDetail = await txt('#ul-de-detail');
  assert(deDetail.includes('2 处非法') || deDetail.includes('1 处非法'), '截断序列应当报出非法，实得 ' + deDetail.slice(0, 80));
  const deRows = await page.$$eval('#ul-de-detail tbody tr', (ns) =>
    ns.map((n) => [...n.children].map((c) => c.textContent)));
  assert(deRows[0][1] === 'E4 BD' && deRows[0][2] === 'U+FFFD', '最大子部分应当吃掉 E4 BD 两个字节，实得 ' + deRows[0].slice(1, 3));
  assert(deRows[0][5].includes('续字节'), 'E4 BD 41 的第 3 个字节不是续字节，应当这么说明，实得 ' + deRows[0][5]);
  assert(deRows[1][2] === 'U+0041', '第 3 个字节应当被解成 A');
  // 真·截断（字节直接用完）应当给出另一条说明
  await setVal('#ul-de-bytes', 'E4 BD');
  const truncRows = await page.$$eval('#ul-de-detail tbody tr', (ns) =>
    ns.map((n) => [...n.children].map((c) => c.textContent)));
  assert(truncRows.length === 1 && truncRows[0][5].includes('截断'),
    '字节用完时应当报「序列被截断」，实得 ' + JSON.stringify(truncRows.map((r) => r[5])));
  await setVal('#ul-de-bytes', 'ED A0 80');
  const surRows = await page.$$eval('#ul-de-detail tbody tr', (ns) => ns.map((n) => [...n.children].map((c) => c.textContent)));
  assert(surRows.length === 3 && surRows.every((r) => r[2] === 'U+FFFD'), 'UTF-8 里的代理码位应当被拆成 3 处非法');
  // IDNA
  await setVal('#ul-idna', '中文.中国');
  const idna = await txt('#ul-idna-out');
  assert(idna.includes('xn--fiq228c.xn--fiqs8s'), '中文.中国 的 punycode 形式，实得 ' + idna);

  // ---------------------------------------------------------- 7. 字符检索
  await go('browse');
  await setVal('#ul-br-q', 'U+2764');
  await page.waitForTimeout(260);
  let cells = await page.$$eval('#ul-br-grid .ul-cell', (ns) => ns.map((n) => n.textContent));
  assert(cells.length >= 1 && cells[0].includes('2764'), 'U+2764 应当被直接命中，实得 ' + cells.slice(0, 3));
  await page.click('#ul-br-grid .ul-cell');
  await page.waitForTimeout(80);
  assert((await txt('#ul-br-detail')).includes('HEAVY BLACK HEART'), '选中后应当显示 HEAVY BLACK HEART');
  await setVal('#ul-br-q', 'ZERO WIDTH');
  await page.waitForTimeout(300);
  cells = await page.$$eval('#ul-br-grid .ul-cell', (ns) => ns.map((n) => n.textContent));
  assert(cells.length >= 4, '「ZERO WIDTH」应当至少命中 4 个字符，实得 ' + cells.length);
  // 按区块翻
  const greekVal = await page.$$eval('#ul-br-block option', (ns) => {
    const o = ns.find((x) => x.textContent.indexOf('Greek and Coptic') === 0);
    return o ? o.value : null;
  });
  assert(greekVal, '区块下拉里应当有 Greek and Coptic');
  await page.selectOption('#ul-br-block', greekVal);
  await page.waitForTimeout(300);
  cells = await page.$$eval('#ul-br-grid .ul-cell', (ns) => ns.map((n) => n.textContent));
  assert(cells.length > 100, '希腊区块应当有一百多个字符，实得 ' + cells.length);

  // ---------------------------------------------------------- 8. 说明页的能力清单
  await go('about');
  const algos = await page.$$eval('#ul-ab-algos tbody tr', (ns) => ns.map((n) => n.children[0].textContent));
  assert(algos.length === 8, '算法清单应当有 8 行，实得 ' + algos.length);
  const verify = await page.$$eval('#ul-ab-verify tbody tr', (ns) =>
    ns.map((n) => [...n.children].map((c) => c.textContent)));
  assert(verify.length === 7, '验证表应当有 7 行');
  for (const v of verify) {
    const m = /^(\d+) \/ (\d+)$/.exec(v[2]);
    assert(m && m[1] === m[2] && +m[1] > 0, '验证表里每一行都应当是 N / N 全绿，实得 ' + v[2]);
  }
  assert((await page.$$('#ul-ab-notes li')).length >= 6, '口径说明至少 6 条');
  assert((await page.$$('#ul-ab-limits li')).length >= 5, '做不到的至少 5 条');

  // ---------------------------------------------------------- 守卫 A：[hidden] 真的藏住了
  await go('inspect');
  for (const t of TABS) {
    const disp = await page.$eval('#p-' + t, (n) => getComputedStyle(n).display);
    if (t === 'inspect') assert(disp !== 'none', 'inspect 面板应当可见');
    else assert(disp === 'none', `[hidden] 守卫：#p-${t} 的计算样式应当是 display:none，实得 ${disp}`);
  }

  // ---------------------------------------------------------- 守卫 B：控件不塌缩（逐 tab 扫）
  let scanned = 0;
  for (const t of TABS) {
    await go(t);
    const bad = await page.evaluate((tabId) => {
      const out = [];
      let n = 0;
      const root = document.getElementById('p-' + tabId);
      for (const e of root.querySelectorAll('input, select, button, textarea')) {
        const r = e.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        n++;
        const isBtn = e.tagName === 'BUTTON';
        const minW = isBtn ? 52 : (e.type === 'checkbox' || e.type === 'radio' ? 18 : 100);
        if (r.width < minW || r.height < 18)
          out.push(`${e.tagName}#${e.id || e.className} ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
      return { bad: out, n };
    }, t);
    scanned += bad.n;
    assert(bad.bad.length === 0, `控件塌缩守卫（${t}）：${bad.bad.join(', ')}`);
  }
  assert(scanned >= 60, '控件尺寸守卫总共只扫到 ' + scanned + ' 个控件，太少了，说明选择器没扫到');

  // ---------------------------------------------------------- 守卫 C：逐视口 × 逐 tab 不横向溢出
  for (const vw of [390, 768, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of TABS) {
      await go(t);
      const info = await page.evaluate(() => {
        const de = document.documentElement;
        const over = de.scrollWidth - de.clientWidth;
        if (over <= 1) return { over };
        const w = de.clientWidth, culprits = [];
        // 跳过住在横向滚动容器里的元素：它们本来就该超出，超出的是容器内部而不是页面
        const clipped = (e) => {
          for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) {
            const o = getComputedStyle(a).overflowX;
            if (o === 'auto' || o === 'scroll' || o === 'hidden') return true;
          }
          return false;
        };
        for (const e of document.querySelectorAll('body *')) {
          const r = e.getBoundingClientRect();
          if (r.width && r.right > w + 1 && !clipped(e))
            culprits.push(`${e.tagName}.${(e.className || '').toString().split(' ')[0]}@${Math.round(r.right)}`);
          if (culprits.length > 5) break;
        }
        return { over, culprits };
      });
      assert(info.over <= 1, `窄屏守卫：${vw}px 的 ${t} 面板横向溢出 ${info.over}px，越界元素：${(info.culprits || []).join(', ')}`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 850 });

  // ---------------------------------------------------------- 守卫 D：小格子里的子元素不越界
  await go('browse');
  await setVal('#ul-br-q', 'CJK RADICAL');
  await page.waitForTimeout(300);
  const escape = await page.evaluate(() => {
    const bad = [];
    for (const cell of document.querySelectorAll('#ul-br-grid .ul-cell')) {
      const pr = cell.getBoundingClientRect();
      for (const kid of cell.children) {
        const kr = kid.getBoundingClientRect();
        if (kr.left < pr.left - 1 || kr.right > pr.right + 1) bad.push(kid.textContent);
      }
      if (bad.length > 4) break;
    }
    return bad;
  });
  assert(escape.length === 0, '格子里的文字越出了格子：' + escape.join(' | '));

  // ---------------------------------------------------------- 守卫 E：没有把 HTML 实体当字面显示
  await go('inspect');
  // 「转义写法」那张表本来就要把 &#128105; 这类实体当数据显示，扫描时排除它
  const bodyText = await page.evaluate(() => {
    const c = document.body.cloneNode(true);
    c.querySelectorAll('.ul-esc').forEach((n) => n.remove());
    document.body.appendChild(c);
    const t = c.innerText;
    c.remove();
    return t;
  });
  const ent = /&(amp|lt|gt|quot|#\d+|#x[0-9A-Fa-f]+);/.exec(bodyText);
  assert(!ent, '页面上出现了未被解析的 HTML 实体：' + (ent && ent[0]));
  // 单位/属性名不应当被 text-transform 改写
  const upperBad = await page.$$eval('th, dt, label', (ns) =>
    ns.filter((n) => getComputedStyle(n).textTransform === 'uppercase').map((n) => n.textContent));
  assert(upperBad.length === 0, 'th/dt/label 不应当加 uppercase：' + upperBad.join(', '));

  // ---------------------------------------------------------- 缩略图
  await go('inspect');
  await setVal('#ul-in-text', '👩‍👩‍👧‍👦 café аpple.com שלום');
  await page.waitForTimeout(200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await screenshot('thumb.png');
  console.log(`      (unicode-lab: ${N} 条浏览器断言)`);
};
