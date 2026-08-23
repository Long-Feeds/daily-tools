// 邮件解剖台 · Mail Scope —— 真实浏览器集成测试
// 断言的是真实产物：DKIM 验签结论、body hash 的 base64、解码出的中文、
// MIME 结构签名、SPF 的 CIDR 判定、体检规则命中，而不是「元素存在」。

const TABS = ['scan', 'tree', 'body', 'auth', 'route', 'raw'];

export default async ({ page, toolURL, screenshot, assert: rawAssert }) => {
  let asserted = 0;
  const assert = (cond, msg) => { asserted++; rawAssert(cond, msg); };
  await page.goto(toolURL, { waitUntil: 'networkidle' });

  /* ---------- 0. 首屏 ---------- */
  await page.waitForSelector('.ms-sample');
  assert(await page.locator('.ms-sample').count() === 6, '首屏应有 6 个示例');
  assert((await page.title()).includes('Mail Scope'), '标题应含 Mail Scope');
  const back = page.locator('a[href="../../"]');
  assert(await back.count() === 1, '顶部必须有返回工具集的链接');
  assert((await back.innerText()).includes('返回工具集'), '返回链接文案');
  assert(await page.locator('#ms-result').isHidden(), '未载入邮件前结果区应隐藏');

  /* ---------- 1. 引擎自检：往返 + 真实验签 + 规范化幂等 ---------- */
  const self = await page.evaluate(() => window.__msSelfTest());
  assert(self.roundTripFail === 0 && self.roundTrip === 24,
    `6 份示例 × 4 种导出模式的往返应全部一致，实际 ${self.roundTrip}/${self.roundTrip + self.roundTripFail}`);
  assert(self.canonFail === 0 && self.canon === 12, `DKIM 规范化幂等，实际 ${self.canon}/${self.canon + self.canonFail}`);
  const receiptSig = self.dkim.find((d) => d.id === 'receipt');
  const tamperedSig = self.dkim.find((d) => d.id === 'tampered');
  assert(receiptSig && receiptSig.pass === true && receiptSig.bodyHashOk === true, '正常账单的 RSA 验签必须通过');
  assert(receiptSig.bits === 2048, `公钥应为 2048 位，实际 ${receiptSig && receiptSig.bits}`);
  assert(tamperedSig && tamperedSig.pass === false && tamperedSig.bodyHashOk === false, '被篡改的邮件必须验签失败');

  /* ---------- 2. 正常账单：摘要、认证、正文 ---------- */
  await page.locator('[data-ms-sample="receipt"]').click();
  await page.waitForSelector('#ms-result:not([hidden])');
  assert(await page.locator('#ms-subject').innerText() === '收据・2026 年 8 月（LP-20260823-4471）',
    '主题的 RFC 2047 base64 应解码正确，实际 ' + (await page.locator('#ms-subject').innerText()));
  const envRows = await page.locator('.ms-env-rows').innerText();
  assert(envRows.includes('LonPay 账单') && envRows.includes('billing@lonpay.example'), '发件人显示名与地址');
  assert(envRows.includes('2026-08-23 07:00:05') && envRows.includes('UTC+08:00'),
    '日期应按信头声明的时区显示，实际 ' + envRows.replace(/\n/g, ' '));
  assert(envRows.includes('= 2026-08-22 23:00:05 UTC'), '同时给出 UTC 对照');

  const chips = await page.locator('#ms-authchips').innerText();
  for (const w of ['SPF pass', 'DKIM pass', 'DMARC pass', '本机重算正文摘要 一致']) {
    assert(chips.includes(w), `认证徽章应含「${w}」，实际 ${chips.replace(/\n/g, ' ')}`);
  }
  assert(await page.locator('#ms-score').innerText() === '11', '正常账单风险分应为 11（只有追踪像素一条中等）');
  assert(await page.locator('#ms-verdict').innerText() === '基本正常', '结论应为基本正常');
  assert(await page.locator('#ms-c-high').innerText() === '0', '正常账单不应有高危');

  await page.locator('#ms-tab-scan').click();
  await page.waitForSelector('#ms-findings .ms-finding');
  const scanText = await page.locator('#ms-panel-scan').innerText();
  assert(scanText.includes('正文里有追踪像素'), '应识别追踪像素');
  assert(scanText.includes('track.lonpay.example'), '应指出追踪像素的回报域名');
  const linkRows = await page.locator('#ms-linktable tbody tr').count();
  assert(linkRows === 5, `链接清单应有 5 行（HTML 3 条 + 纯文本 2 条），实际 ${linkRows}`);
  const receiptLinks = await page.locator('#ms-linktable').innerText();
  assert(receiptLinks.includes('同域'), '同域链接应标记为同域');
  const srcCells = await page.locator('#ms-linktable tbody tr td:first-child').allInnerTexts();
  const htmlRows = srcCells.filter((t) => t.trim() === 'HTML').length;
  const textRows = srcCells.filter((t) => t.trim() === '纯文本').length;
  assert(htmlRows === 3 && textRows === 2,
    `链接应按来源分开标注（HTML 3 条 / 纯文本 2 条），实际 ${htmlRows}/${textRows}：${JSON.stringify(srcCells)}`);

  /* --- DKIM 面板：贴公钥、验签、看被签名的原文 --- */
  await page.locator('#ms-tab-auth').click();
  await page.waitForSelector('[data-ms-dkim="0"]');
  const bhClaimed = await page.locator('.ms-hashcmp span').nth(1).innerText();
  const bhComputed = await page.locator('[data-ms-bh-computed="0"]').innerText();
  assert(bhClaimed === bhComputed && bhClaimed.length === 44,
    `bh= 与本机重算应逐字符相同（44 字符 base64），claimed=${bhClaimed} computed=${bhComputed}`);
  assert(bhComputed === 'QitbAJaNunIUsBjqxzo7K772RoPcioIzaQIAiXz74FA=',
    '正常账单的正文摘要应为固定值，实际 ' + bhComputed);
  assert((await page.locator('[data-ms-bh="0"]').innerText()).includes('一致'), '正文摘要一致');
  assert((await page.locator('[data-ms-dkim-verdict="0"]').innerText()) === '签名有效',
    '示例自带公钥，页面应直接给出「签名有效」');

  await page.locator('.ms-showcanon').first().click();
  await page.waitForSelector('#ms-canon-0:not([hidden])');
  const canon = await page.locator('#ms-canon-0').innerText();
  assert(canon.includes('from:LonPay') && canon.includes('dkim-signature:v=1'),
    'relaxed 规范化后的抬头应小写字段名并压缩空白，实际前 120 字：' + canon.slice(0, 120));
  assert(canon.includes('b=') && !/b=[A-Za-z0-9+/]{20}/.test(canon.split('dkim-signature')[1] || ''),
    '被签名的那份 DKIM-Signature 里 b= 的值必须清空');

  /* --- SPF：真的做 CIDR 判定 --- */
  const spfIn = page.locator('#ms-spf');
  assert((await spfIn.inputValue()).startsWith('v=spf1'), 'SPF 输入框应预填示例记录');
  await page.locator('#ms-spf-ip').fill('203.0.113.42');
  await page.locator('#ms-spf-go').click();
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-ms-spf-verdict]');
    return el && el.textContent.includes('pass');
  });
  assert((await page.locator('#ms-spftable').innerText()).includes('203.0.113.42 落在 203.0.113.0/24 内'),
    'SPF 应给出命中的 CIDR 依据');
  await page.locator('#ms-spf-ip').fill('198.51.100.9');
  await page.locator('#ms-spf-go').click();
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-ms-spf-verdict]');
    return el && el.textContent.includes('fail');
  });
  const spfTable = await page.locator('#ms-spftable').innerText();
  assert(spfTable.includes('需要 DNS'), 'include: 机制应如实标注需要 DNS');
  assert(spfTable.includes('不在 203.0.113.0/24 内'), '换成不在网段里的 IP 应判 miss');

  /* --- DMARC 对齐 --- */
  const dmarcTable = await page.locator('#ms-dmarctable').innerText();
  assert(dmarcTable.includes('DKIM d=lonpay.example') && dmarcTable.includes('对齐'), 'DKIM 应与 From 域严格对齐');
  assert(dmarcTable.includes('Return-Path mail.lonpay.example'), 'Return-Path 也应参与对齐检查');
  assert(dmarcTable.includes('不对齐') === false || dmarcTable.split('不对齐').length === 2,
    'aspf=r 下 mail.lonpay.example 与 lonpay.example 宽松对齐应通过');

  /* --- 正文：安全渲染 / 纯文本 / 源码 --- */
  await page.locator('#ms-tab-body').click();
  await page.waitForSelector('#ms-frame');
  assert((await page.locator('#ms-blocked').innerText()).includes('已拦截 1 个远程资源'), '应拦下 1 个远程资源');
  const frame = page.frameLocator('#ms-frame');
  await frame.locator('body').waitFor();
  const frameText = await frame.locator('body').innerText();
  assert(frameText.includes('SGD 36.00') && frameText.includes('专业版订阅'), '沙箱里应渲染出正文内容');
  assert(await frame.locator('img[data-ms-blocked-src]').count() === 1, '远程图片应被替换成占位');
  assert(await frame.locator('script').count() === 0, '净化后不应残留 script');
  await page.locator('.ms-bodymode[data-mode="plain"]').click();
  await page.waitForSelector('.ms-code-body');
  assert((await page.locator('#ms-panel-body').innerText()).includes('合计               SGD 36.00'),
    '纯文本版本应保留原始对齐空格');
  await page.locator('.ms-bodymode[data-mode="source"]').click();
  assert((await page.locator('#ms-panel-body').innerText()).includes('<table width="560"'), '源码模式应显示原始 HTML');
  await page.locator('.ms-bodymode[data-mode="render"]').click();

  /* ---------- 3. 被篡改的同一封邮件 ---------- */
  await page.locator('#ms-another').click();
  await page.locator('[data-ms-sample="tampered"]').click();
  await page.locator('#ms-tab-auth').click();
  await page.waitForSelector('[data-ms-bh="0"]');
  assert((await page.locator('[data-ms-bh="0"]').innerText()).includes('不一致'), '篡改后正文摘要必须不一致');
  assert((await page.locator('[data-ms-dkim-verdict="0"]').innerText()) === '签名无效', '篡改后应判签名无效');
  const why = await page.locator('[data-ms-dkim-why="0"]').innerText();
  assert(why.includes('抬头的签名本身是对的') && why.includes('只有正文被改过'),
    '结论不许自相矛盾：抬头签名有效而正文摘要不符时要说清楚，实际：' + why);
  const tamperedScan = await (async () => { await page.locator('#ms-tab-scan').click(); await page.waitForSelector('.ms-finding'); return page.locator('#ms-panel-scan').innerText(); })();
  assert(tamperedScan.includes('DKIM 的正文摘要对不上'), '正文摘要不符必须列成一条高危发现');
  assert(tamperedScan.includes('收信服务器记的是 dkim=pass'), '与 Authentication-Results 的矛盾应单独指出');
  assert(await page.locator('#ms-verdict').innerText() === '需要留神',
    `被改过的签名邮件应判「需要留神」，实际 ${await page.locator('#ms-verdict').innerText()}（分 ${await page.locator('#ms-score').innerText()}）`);
  await page.locator('#ms-tab-auth').click();
  await page.waitForSelector('#ms-pk-0');

  // 换成另一把真实但不配对的 2048 位公钥：应报「公钥与签名不配对」，而不是「摘要不符」
  await page.locator('#ms-pk-0').fill('v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArJam9lKJujBHdId8ndAVzm16053C0stS91XQ4+bas76jjpayvUzbbnmPPfOj1pDvygjQacvpbMZtZ+tZntCvtXg9a9E2jJ16e0G8ZZL5GkxjfPPBki7uJJXUwXVVmtR2XrQttqhzdueGu4q8ey7hu7kxIoONOK5kxTxMOoLPWmsaw2+XonBrNZFg6Foynb1kV9xLZqdHLeS3TwQ9NQIZ9gATGe+GiG4ulTSlq9OQeAQnnWeC2Gu5VUcqc9DsD24MEqio6x56b9AJ4KBsmnEsxYFiMEPfJTb5rbk9nJ55bEWMKH6Z9wqaT7e51NpDT2J8JEQ9YdYrWcWwdYALhwjjkQIDAQAB');
  await page.locator('.ms-verify').first().click();
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-ms-dkim-why="0"]');
    return el && el.textContent.length > 0 && !el.textContent.includes('抬头的签名本身是对的');
  }, null, { timeout: 8000 });
  const wrongKeyWhy = await page.locator('[data-ms-dkim-why="0"]').innerText();
  assert(wrongKeyWhy.includes('公钥与签名不配对'),
    'RSA 应能区分「公钥不配对」与「内容被改」两种失败，实际：' + wrongKeyWhy);

  // 畸形 p=：只能报错，不许抛异常把页面打挂
  await page.locator('#ms-pk-0').fill('v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7VJTUt9Us8cKjMzEfYyjiWA4R4/M2bS1GB4t7NXp98C3SC6dVMvDuictGeurT8jNbvJZHtCSuYEvuNMoSfm76oqFvAp8Gy0iz5sxjZmSnXyCdPEovGhLa0VzMaQ8s+CLOyS56YyCFGeJZqgtzJ6GR3eqoYSW9b9UMvkBpZODSctWSNGj3P7jRFDO5VoTwCQAWbFnOjDfH5Ulgp2PKSQnSJP3AJLQNFNe7br1XbrhV');
  await page.locator('.ms-verify').first().click();
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-ms-dkim-why="0"]');
    return el && el.textContent.includes('公钥解析失败');
  }, null, { timeout: 8000 });
  assert(await page.locator('[data-ms-dkim-verdict="0"]').innerText() === '签名无效', '畸形公钥应判签名无效而不是崩溃');
  await page.evaluate(() => localStorage.removeItem('ms.dns.v1'));
  const tamperedBh = await page.locator('[data-ms-bh-computed="0"]').innerText();
  assert(tamperedBh !== 'QitbAJaNunIUsBjqxzo7K772RoPcioIzaQIAiXz74FA=', '改了正文，重算的摘要必须变');
  await page.locator('#ms-tab-body').click();
  await page.waitForSelector('#ms-frame');
  assert((await page.frameLocator('#ms-frame').locator('body').innerText()).includes('SGD 96.00'), '被改成 96.00');

  /* ---------- 4. 钓鱼邮件：规则命中 ---------- */
  await page.locator('#ms-another').click();
  await page.locator('[data-ms-sample="phish"]').click();
  await page.locator('#ms-tab-scan').click();
  await page.waitForSelector('#ms-findings .ms-finding');
  assert(await page.locator('#ms-verdict').innerText() === '高度可疑', '钓鱼邮件应判高度可疑');
  const phishText = await page.locator('#ms-panel-scan').innerText();
  const wanted = [
    '显示名里写着另一个邮箱地址', 'URL 里藏了 @ 前缀', '链接文字与真实地址不是同一个域',
    '链接域名混用多种文字', '链接直接指向 IP 地址', 'HTML 正文里有表单',
    '附件名里有方向控制字符', '附件的文件头就是可执行文件', 'HTML 里有大段隐藏文字',
    '这封邮件没有 DKIM 签名', '回复地址指向另一个域', '投递链路上出现时间倒流'
  ];
  for (const w of wanted) assert(phishText.includes(w), `钓鱼邮件应命中「${w}」`);
  assert(Number(await page.locator('#ms-c-high').innerText()) >= 8,
    `高危条目应 ≥8，实际 ${await page.locator('#ms-c-high').innerText()}`);

  // 同形域名：Punycode 必须解出来给人看
  const linkTable = await page.locator('#ms-linktable').innerText();
  assert(linkTable.includes('xn--lonpy-7ve.example'), '链接表应列出原始 Punycode 主机');
  assert(/lonp[^\s]*y\.example\s+←\s+xn--lonpy-7ve\.example/.test(linkTable.replace(/\n/g, ' ')) ||
    linkTable.includes('← xn--lonpy-7ve.example'), '应给出 Punycode 解码后的可读域名');
  assert(linkTable.includes('混合文字') && linkTable.includes('@ 前缀') && linkTable.includes('裸 IP'),
    '链接标记应包含混合文字 / @ 前缀 / 裸 IP');

  // 附件：RTLO 必须显形，且不能把界面上的其它字段一起翻过去
  const attachTable = await page.locator('#ms-attachtable').innerText();
  assert(attachTable.includes('RLO'), 'RTLO 控制符必须在界面上显形为记号');
  assert(attachTable.includes('账单详情') && attachTable.includes('fdp.exe'), '文件名的真实字符顺序');
  assert(attachTable.includes('Windows 可执行文件'), '按魔数认出真实类型是 Windows 可执行文件');
  assert(attachTable.includes('113 B'), `RTLO 不应把大小数字翻过来，实际表格：${attachTable.replace(/\n/g, ' | ')}`);
  assert(await page.locator('.ms-ctrl').count() >= 2, '控制字符记号应在多处出现');

  /* --- 链路 --- */
  await page.locator('#ms-tab-route').click();
  await page.waitForSelector('#ms-hops .ms-hop');
  const route = await page.locator('#ms-panel-route').innerText();
  assert(await page.locator('#ms-hops .ms-hop').count() === 2, '应解析出 2 跳');
  assert(route.includes('198.51.100.77'), '应抽出 Received 里的 IP');
  assert(route.includes('时间不自洽') || route.includes('时间倒流'), '应指出链路时间不自洽');
  assert(route.includes('明文'), '没有 TLS 的跳应标为明文');

  /* ---------- 5. GBK 老邮件 ---------- */
  await page.locator('#ms-another').click();
  await page.locator('[data-ms-sample="gbk"]').click();
  await page.waitForSelector('#ms-subject');
  assert(await page.locator('#ms-subject').innerText() === '关于第三季度对账单的说明（补发）',
    'GB2312 的 RFC 2047 主题应解码正确，实际 ' + (await page.locator('#ms-subject').innerText()));
  assert((await page.locator('.ms-env-rows').innerText()).includes('财务部 张伟'), 'GB2312 显示名应解码正确');
  await page.locator('#ms-tab-tree').click();
  await page.waitForSelector('#ms-tree .ms-node');
  const treeText = await page.locator('#ms-tree').innerText();
  assert(treeText.includes('第三季度对账单（修订版）.xls'),
    'RFC 2231 分段续行的文件名应拼回来，实际树：' + treeText.replace(/\n/g, ' | '));
  await page.locator('#ms-tree .ms-node').nth(1).click();
  await page.waitForSelector('#ms-partdetail');
  const partText = await page.locator('#ms-partdetail').innerText();
  assert(partText.includes('第三季度对账单，此前一版数字有误'), 'GB2312 正文应解码成可读中文');
  assert(partText.includes('gb2312'), '应显示声明的 charset');

  /* ---------- 6. 嵌套转发与退信 ---------- */
  await page.locator('#ms-another').click();
  await page.locator('[data-ms-sample="forward"]').click();
  await page.locator('#ms-tab-tree').click();
  await page.waitForSelector('#ms-tree .ms-node');
  const fwdTree = await page.locator('#ms-tree').innerText();
  for (const t of ['multipart/mixed', 'multipart/alternative', 'message/rfc822', 'multipart/related', 'image/png']) {
    assert(fwdTree.includes(t), `转发邮件的结构树应含 ${t}，实际 ${fwdTree.replace(/\n/g, ' | ')}`);
  }
  const nodeCount = await page.locator('#ms-tree .ms-node').count();
  assert(nodeCount === 8, `转发邮件应有 8 个部件（mixed > alternative(2) + rfc822 > related(2)），实际 ${nodeCount}`);
  await page.locator('#ms-tree .ms-node').nth(7).click();
  assert((await page.locator('#ms-partdetail').innerText()).includes('diagram-1@corp.example'), '应读出 Content-ID');
  await page.locator('#ms-tab-body').click();
  await page.waitForSelector('#ms-frame');

  await page.locator('#ms-another').click();
  await page.locator('[data-ms-sample="dsn"]').click();
  await page.locator('#ms-tab-tree').click();
  await page.waitForSelector('#ms-tree .ms-node');
  const dsnTree = await page.locator('#ms-tree').innerText();
  assert(dsnTree.includes('message/delivery-status'), 'DSN 应解析出 delivery-status');
  assert(dsnTree.includes('报文级') && dsnTree.includes('收件人级'), 'DSN 的字段块应分成报文级与收件人级');
  const dsnNodes = await page.locator('#ms-tree .ms-node').all();
  let found511 = false;
  for (let i = 0; i < dsnNodes.length; i++) {
    await dsnNodes[i].click();
    const t = await page.locator('#ms-partdetail').innerText();
    if (t.includes('5.1.1') && t.includes('User unknown')) { found511 = true; break; }
  }
  assert(found511, 'DSN 的收件人块里应能读到 Status 5.1.1 与展开后的 Diagnostic-Code');

  /* ---------- 7. 真实文件上传 + 粘贴 ---------- */
  await page.locator('#ms-another').click();
  const CRLF = String.fromCharCode(13) + String.fromCharCode(10);
  const eml = [
    'From: =?utf-8?B?5rWL6K+V5Y+R5Lu25Lq6?= <t@example.org>',
    'To: you@example.net',
    'Subject: =?utf-8?Q?=E4=B8=8A=E4=BC=A0=E6=B5=8B=E8=AF=95?=',
    'Date: Sat, 23 Aug 2026 12:00:00 +0000',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from('通过 file input 走一遍真实的读取路径。', 'utf8').toString('base64')
  ].join(CRLF) + CRLF;
  await page.setInputFiles('#ms-file', { name: 'upload.eml', mimeType: 'message/rfc822', buffer: Buffer.from(eml, 'utf8') });
  await page.waitForFunction(() => {
    const el = document.querySelector('#ms-subject');
    return el && el.textContent === '上传测试';
  }, null, { timeout: 5000 });
  assert((await page.locator('.ms-env-rows').innerText()).includes('测试发件人'), 'B 编码的显示名应解码');
  assert((await page.locator('#ms-envbody').innerText()).includes('通过 file input 走一遍真实的读取路径'),
    'base64 正文应解码成中文');
  assert((await page.locator('#ms-filemeta').innerText()).includes('upload.eml'), '应显示上传的文件名');

  // 最近打开：写进 localStorage 并能点回来
  await page.locator('#ms-another').click();
  await page.waitForSelector('#ms-recent .ms-recent-btn');
  const recentCount = await page.locator('#ms-recent .ms-recent-btn').count();
  assert(recentCount >= 2, `最近打开应至少记住 2 封，实际 ${recentCount}`);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('ms.recent.v1') || '[]').length);
  assert(stored >= 2 && stored <= 5, `localStorage 里应留 2~5 条记录，实际 ${stored}`);

  await page.locator('#ms-paste-toggle').click();
  await page.waitForSelector('#ms-paste-box:not([hidden])');
  await page.locator('#ms-paste').fill('Subject: 粘贴进来的邮件\nFrom: p@example.com\n\n正文一行。\n');
  await page.locator('#ms-paste-go').click();
  await page.waitForFunction(() => {
    const el = document.querySelector('#ms-subject');
    return el && el.textContent === '粘贴进来的邮件';
  }, null, { timeout: 5000 });
  assert((await page.locator('#ms-filemeta').innerText()).includes('行尾 CRLF'), '粘贴的原文应被规范成 CRLF');

  /* ---------- 8. 导出真的产出了字节 ---------- */
  await page.locator('#ms-another').click();
  await page.locator('[data-ms-sample="receipt"]').click();
  await page.locator('#ms-tab-raw').click();
  await page.waitForSelector('#ms-export-raw');
  await page.evaluate(() => {
    window.__blobs = [];
    const orig = URL.createObjectURL.bind(URL);
    URL.createObjectURL = (b) => { window.__blobs.push({ size: b.size, type: b.type }); return orig(b); };
  });
  for (const id of ['#ms-export-raw', '#ms-export-safe', '#ms-export-utf8', '#ms-export-noattach', '#ms-export-json']) {
    await page.locator(id).click();
  }
  const blobs = await page.evaluate(() => window.__blobs);
  assert(blobs.length === 5, `五个导出按钮应各产出一个 Blob，实际 ${blobs.length}`);
  assert(blobs.slice(0, 4).every((b) => b.size > 1000 && b.type === 'message/rfc822'), '四个 .eml 导出都应是像样的报文');
  assert(blobs[4].type === 'application/json' && blobs[4].size > 500, '体检报告应是有内容的 JSON');
  const rawText = await page.locator('#ms-panel-raw').innerText();
  assert(rawText.includes('DKIM-Signature') && rawText.includes('alt_9f2b7c1d'), '原文面板应高亮出信头与分隔行');

  /* ---------- 9. 教训清单：结构性守卫 ---------- */
  // 9a. [hidden] 必须真的隐藏（断计算样式，不是断属性）
  const hiddenOk = await page.evaluate(() => {
    const el = document.querySelector('#ms-panel-scan');
    el.hidden = true;
    const d = getComputedStyle(el).display;
    el.hidden = false;
    return d;
  });
  assert(hiddenOk === 'none', `[hidden] 必须让元素真的不显示，实际 display=${hiddenOk}`);

  // 9b. 控件尺寸：逐个 tab 扫，防止藏在别的面板里的控件塌缩
  let scanned = 0, tooSmall = [];
  for (const t of TABS) {
    await page.locator('#ms-tab-' + t).click();
    await page.waitForTimeout(120);
    const bad = await page.evaluate(() => {
      const out = [];
      let n = 0;
      for (const el of document.querySelectorAll('input,select,button,textarea')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;   // 隐藏面板里的不算
        n++;
        const tag = el.tagName.toLowerCase();
        const isCheck = el.type === 'checkbox' || el.type === 'radio';
        const minW = isCheck ? 18 : (tag === 'button' ? 52 : 100);
        if (r.width < minW || r.height < 18) out.push(`${tag}#${el.id || el.className} ${Math.round(r.width)}x${Math.round(r.height)} (需 ≥${minW}x18)`);
      }
      return { out, n };
    });
    scanned += bad.n;
    tooSmall = tooSmall.concat(bad.out);
  }
  assert(scanned >= 25, `逐 tab 扫到的可见控件应 ≥25，实际 ${scanned}（扫不到就等于守卫失效）`);
  assert(tooSmall.length === 0, '有控件被压塌：' + tooSmall.join(' | '));

  // 9c. 小格子里的文字不许越出格子（信封行、表格单元、徽章）
  await page.locator('#ms-tab-scan').click();
  await page.waitForSelector('.ms-finding');
  const overflow = await page.evaluate(() => {
    const bad = [];
    const check = (parentSel, childSel) => {
      for (const p of document.querySelectorAll(parentSel)) {
        const pr = p.getBoundingClientRect();
        if (pr.width === 0) continue;
        for (const c of p.querySelectorAll(childSel)) {
          const cr = c.getBoundingClientRect();
          if (cr.width === 0) continue;
          if (cr.left < pr.left - 1 || cr.right > pr.right + 1) {
            bad.push(`${parentSel}>${childSel} 越界 ${Math.round(cr.left - pr.left)}/${Math.round(cr.right - pr.right)}`);
          }
        }
      }
    };
    check('.ms-env-rows dd', 'span,i');
    check('.ms-envelope', '.ms-chip');
    check('.ms-finding', '.ms-sevtag,.ms-finding-title,.ms-mini');
    check('.ms-count', 'b,span');
    return bad;
  });
  assert(overflow.length === 0, '子元素越出父格：' + overflow.join(' | '));

  // 9d. 卡片里的等宽块不许横向撑破
  const preOverflow = await page.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll('.ms-evidence')) {
      if (el.scrollWidth - el.clientWidth > 2) bad.push(`.ms-evidence ${el.scrollWidth}>${el.clientWidth}`);
    }
    return bad;
  });
  assert(preOverflow.length === 0, '证据块横向溢出：' + preOverflow.join(' | '));

  // 9e. th / dt / label 不该被 uppercase 改写单位符号
  const upper = await page.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll('th,dt,label')) {
      if (/\b(HZ|KHZ|DBFS|DB|MIB|KB\b)/.test(el.textContent) && getComputedStyle(el).textTransform === 'uppercase') bad.push(el.textContent);
    }
    return bad;
  });
  assert(upper.length === 0, '有标签被 uppercase 改写：' + upper.join(' | '));

  // 9f. 页面不许横向滚动
  const bodyOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(bodyOverflow <= 1, `1280px 下页面横向溢出 ${bodyOverflow}px`);

  /* ---------- 10. 窄屏 ---------- */
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);
  const narrowOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(narrowOverflow <= 1, `390px 下页面横向溢出 ${narrowOverflow}px`);
  const narrowSmall = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('button,input,textarea')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.height < 18) out.push(el.tagName + '#' + el.id + ' h=' + Math.round(r.height));
    }
    return out;
  });
  assert(narrowSmall.length === 0, '窄屏控件被压扁：' + narrowSmall.join(' | '));
  await page.setViewportSize({ width: 1280, height: 850 });

  /* ---------- 11. 缩略图 ---------- */
  await page.locator('#ms-another').click();
  await page.locator('[data-ms-sample="phish"]').click();
  await page.locator('#ms-tab-scan').click();
  await page.waitForSelector('#ms-findings .ms-finding');
  await page.waitForTimeout(320);   // 等过渡 settle，别截到中间态
  await page.evaluate(() => window.scrollTo(0, 0));
  await screenshot('thumb.png');
  console.log(`      （mail-scope: ${asserted} 条浏览器断言）`);
};
