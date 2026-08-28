// 抓包解剖台 · 集成测试
// 真的载入抓包、点行、写过滤器、追踪流、导出，并断言真实解析结果。
// （解析引擎本身已与 scapy 2.7.0 逐字段对拍 32540 条、写入器回读 4602 条、
//   过滤器打印↔解析往返 fuzz 4000 组，全部 0 失配；这里只测浏览器里的行为。）
export default async function ({ page, toolURL, screenshot, assert: rawAssert }) {
  let nAssert = 0;
  const assert = (cond, msg) => { nAssert++; return rawAssert(cond, msg); };
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.PL_UI && window.PL_UI.state.cap);

  const st = () => page.evaluate(() => {
    const S = window.PL_UI.state;
    return {
      packets: S.cap.packets.length, listed: S.list.length, fmt: S.cap.format,
      label: S.cap.formatLabel, file: S.fileName, tab: S.tab,
      sel: S.sel ? S.sel.num : null, flows: S.an.flows.length, expert: S.an.expert.length,
      marks: Object.keys(S.marks).length, warnings: S.cap.warnings.length
    };
  });
  const setFilter = async (expr) => {
    await page.fill('#pl-filter', expr);
    await page.click('#pl-apply');
    await page.waitForFunction((e) => window.PL_UI.state.filterText === e, expr);
  };
  const listed = () => page.evaluate(() => window.PL_UI.state.list.length);

  // ================= 1. 首屏：默认载入示例 =================
  let S = await st();
  assert(S.packets === 16, `默认示例载入 16 个包（实得 ${S.packets}）`);
  assert(S.fmt === 'pcap', `默认示例是经典 pcap（实得 ${S.fmt}）`);
  assert(/大端/.test(S.label) && /微秒/.test(S.label), `格式标签写出字节序与精度（实得 "${S.label}"）`);
  assert(S.flows === 2, `解出 2 条会话（实得 ${S.flows}）`);
  assert(S.warnings === 0, `干净文件没有警告（实得 ${S.warnings}）`);
  const info = (await page.locator('#pl-capinfo').textContent()) || '';
  assert(/16 个包/.test(info), `文件信息条写出包数（实得 "${info.replace(/\s+/g, ' ').trim().slice(0, 120)}"）`);
  assert(/2 条会话/.test(info), '文件信息条写出会话数');
  assert((await page.locator('#pl-warnings').isVisible()) === false, '没有警告时警告区应隐藏');
  assert(await page.evaluate(() => getComputedStyle(document.getElementById('pl-warnings')).display) === 'none',
    '隐藏的警告区计算样式必须是 display:none（防作者 CSS 盖掉 [hidden]）');

  // ================= 2. 包列表与虚拟滚动 =================
  const rows = page.locator('.pl-row');
  const rowCount = await rows.count();
  assert(rowCount === 16, `16 个包应全部渲染在视口窗口内（实得 ${rowCount}）`);
  const r1 = (await rows.nth(0).textContent()) || '';
  assert(/ARP/.test(r1), `第 1 帧是 ARP（实得 "${r1.replace(/\s+/g, ' ').trim()}"）`);
  assert(/谁是 192\.168\.1\.1/.test(r1), 'ARP 请求的说明写成「谁是 …」');
  const r2 = (await rows.nth(1).textContent()) || '';
  assert(/5c:e3:0e:9f:11:22/.test(r2), 'ARP 应答里写出对方 MAC');
  const r3 = (await rows.nth(2).textContent()) || '';
  assert(/DNS/.test(r3) && /A example\.com/.test(r3), `第 3 帧是 DNS 查询（实得 "${r3.replace(/\s+/g, ' ').trim()}"）`);
  const r4 = (await rows.nth(3).textContent()) || '';
  assert(/93\.184\.216\.34/.test(r4), `第 4 帧是 DNS 应答且含 A 记录（实得 "${r4.replace(/\s+/g, ' ').trim()}"）`);
  const r5 = (await rows.nth(4).textContent()) || '';
  assert(/\[SYN\]/.test(r5) && /MSS=1460/.test(r5) && /WS=256/.test(r5),
    `第 5 帧是带 MSS/WS 选项的 SYN（实得 "${r5.replace(/\s+/g, ' ').trim()}"）`);
  const r6 = (await rows.nth(5).textContent()) || '';
  assert(/\[SYN, ACK\]/.test(r6), `第 6 帧写作 [SYN, ACK] 而不是 [ACK, SYN]（实得 "${r6.replace(/\s+/g, ' ').trim()}"）`);
  const r8 = (await rows.nth(7).textContent()) || '';
  assert(/Client Hello/.test(r8) && /SNI=example\.com/.test(r8),
    `第 8 帧是带 SNI 的 ClientHello（实得 "${r8.replace(/\s+/g, ' ').trim()}"）`);

  // ================= 3. 选中一帧 → 字段树 + 十六进制联动 =================
  await rows.nth(3).click();   // DNS 应答
  await page.waitForFunction(() => window.PL_UI.state.sel && window.PL_UI.state.sel.num === 4);
  const hd = (await page.locator('#pl-detail-hd').textContent()) || '';
  assert(/帧 4/.test(hd) && /DNS/.test(hd), `详情头写出帧号与协议（实得 "${hd.replace(/\s+/g, ' ').trim()}"）`);
  assert(/eth → ip → udp → dns/.test(hd), `详情头写出协议路径（实得 "${hd.replace(/\s+/g, ' ').trim()}"）`);
  const treeText = () => page.locator('#pl-tree').textContent();
  let tt = (await treeText()) || '';
  assert(/目的 MAC/.test(tt) && /3c:22:fb:1a:2b:3c/.test(tt), '字段树里有以太网目的 MAC');
  assert(/源地址：192\.168\.1\.1/.test(tt), `字段树里有 IPv4 源地址（实得片段 "${tt.replace(/\s+/g, ' ').slice(0, 200)}"）`);
  assert(/首部校验和[^（]*（正确）/.test(tt), 'IPv4 校验和被验证为正确');

  // 各协议层默认展开一级：DNS 的计数字段应当已经可见
  assert(/回答数：1/.test(tt), `DNS 回答数为 1（实得片段 "${tt.replace(/\s+/g, ' ').slice(0, 300)}"）`);
  // 点层节点可以收起 / 再展开
  const dnsNode = page.locator('.pl-node', { hasText: '域名系统 DNS' }).first();
  await dnsNode.click();
  tt = (await treeText()) || '';
  assert(!/回答数：1/.test(tt), '点一下层节点会把它收起来');
  await page.locator('.pl-node', { hasText: '域名系统 DNS' }).first().click();
  tt = (await treeText()) || '';
  assert(/回答数：1/.test(tt), '再点一下又展开');
  // 展开回答区，读出真实的 A 记录
  const ansNode = page.locator('.pl-node', { hasText: '回答区' }).first();
  await ansNode.click();
  tt = (await treeText()) || '';
  assert(/example\.com：A → 93\.184\.216\.34/.test(tt), `回答区里写出 A 记录（实得片段 "${tt.replace(/\s+/g, ' ').slice(0, 400)}"）`);

  // 点一个具体字段 → 十六进制里恰好高亮那几个字节
  const srcNode = page.locator('.pl-node', { hasText: '源地址：192.168.1.1' }).first();
  await srcNode.click();
  const hi = await page.evaluate(() => {
    const bs = Array.from(document.querySelectorAll('#pl-hex b'));
    return { count: bs.length, hex: bs.slice(0, 4).map((b) => b.textContent).join(' ') };
  });
  // 4 字节的 IPv4 地址：十六进制区 4 个 + ASCII 区 4 个
  assert(hi.count === 8, `点「源地址」应高亮 4 个字节（十六进制 + ASCII 共 8 处，实得 ${hi.count}）`);
  assert(hi.hex === 'c0 a8 01 01', `高亮的字节正是 192.168.1.1 的十六进制（实得 "${hi.hex}"）`);
  const hexText = (await page.locator('#pl-hex').textContent()) || '';
  assert(/^0000 {2}/.test(hexText.trim()) || /0000/.test(hexText), '十六进制视图有偏移列');
  // ASCII 列必须完整落在容器里（不能靠横向滚动把它藏起来）
  const hexFit = await page.evaluate(() => {
    const el = document.getElementById('pl-hex');
    return { over: el.scrollWidth - el.clientWidth, w: el.clientWidth, perLine: (el.textContent.split('\n')[0].slice(6).match(/[0-9a-f]{2}/g) || []).length };
  });
  assert(hexFit.over <= 2, `十六进制视图不应横向溢出（实得溢出 ${hexFit.over}px，容器宽 ${hexFit.w}）`);
  assert(hexFit.perLine === 16, `1280px 下十六进制应当排满 16 字节一行（实得 ${hexFit.perLine}）`);

  // ================= 4. 显示过滤器 =================
  await setFilter('tls');
  assert((await listed()) === 4, `过滤 tls 命中 4 个包（实得 ${await listed()}）`);
  let msg = (await page.locator('#pl-filter-msg').textContent()) || '';
  assert(/命中 4 \/ 16 个包/.test(msg), `过滤提示写出命中数（实得 "${msg.trim()}"）`);
  assert(/是 TLS 报文/.test(msg), `过滤提示给出中文释义（实得 "${msg.trim()}"）`);

  await setFilter('tcp.port == 443 && tcp.flags.syn == 1');
  assert((await listed()) === 2, `443 上的 SYN/SYN-ACK 共 2 个（实得 ${await listed()}）`);
  await setFilter('ip.addr == 192.168.0.0/16');
  assert((await listed()) === 14, `CIDR 过滤命中 14 个（16 帧里 2 帧是 ARP，没有 IP 层；实得 ${await listed()}）`);
  await setFilter('dns.qry.name contains "example" || arp');
  assert((await listed()) === 4, `或运算命中 4 个（2 个 DNS + 2 个 ARP，实得 ${await listed()}）`);
  await setFilter('http.request.method in {"GET", "POST"}');
  assert((await listed()) === 0, `这个示例里没有明文 HTTP（实得 ${await listed()}）`);
  await setFilter('!(tcp || udp)');
  assert((await listed()) === 2, `既非 TCP 也非 UDP 的只有 2 个 ARP（实得 ${await listed()}）`);

  // 语法错误：给出可读提示 + 红框
  await page.fill('#pl-filter', 'tcp.port === 443');
  await page.click('#pl-apply');
  await page.waitForFunction(() => !window.PL_UI.state.filterOK);
  msg = (await page.locator('#pl-filter-msg').textContent()) || '';
  assert(/语法有问题/.test(msg), `非法语法给出提示（实得 "${msg.trim()}"）`);
  assert(/第 \d+ 个字符附近/.test(msg), '错误提示带出错位置');
  assert(await page.evaluate(() => document.getElementById('pl-filter-card').classList.contains('pl-filter-bad')), '出错时过滤框标红');
  await page.fill('#pl-filter', 'nosuch.field == 1');
  await page.click('#pl-apply');
  msg = (await page.locator('#pl-filter-msg').textContent()) || '';
  assert(/没有这个字段/.test(msg), `未知字段给出专门提示（实得 "${msg.trim()}"）`);

  // 收藏（书签）可点，且能写进 localStorage
  await page.click('#pl-clear-filter');
  assert((await listed()) === 16, '清空过滤器后恢复全部 16 个包');
  const bmCount = await page.locator('.pl-bm').count();
  assert(bmCount >= 6, `预置了至少 6 条收藏（实得 ${bmCount}）`);
  await page.locator('.pl-bm', { hasText: '建连与断连' }).click();
  await page.waitForFunction(() => window.PL_UI.state.filterText.indexOf('tcp.flags.syn') === 0);
  assert((await listed()) === 4, `建连与断连命中 4 个（SYN、SYN-ACK、两个 FIN-ACK；这条会话没有 RST，实得 ${await listed()}）`);

  await page.fill('#pl-filter', 'tls.sni == "example.com"');
  await page.click('#pl-apply');
  await page.click('#pl-save-filter');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('packetlab.bookmarks.v1') || '[]'));
  // 存进去的是规范形式：不必要的引号会被去掉，语义不变
  assert(saved.some((b) => b.expr === 'tls.sni == example.com'), `收藏被写进 localStorage（实得 ${JSON.stringify(saved.slice(-1))}）`);

  // 字段速查：点一下把字段名填进过滤框
  await page.click('#pl-clear-filter');
  await page.locator('.pl-fieldref summary').click();
  await page.locator('.pl-fieldbtn[data-f="tcp.window_size_value"]').click();
  assert((await page.inputValue('#pl-filter')).trim() === 'tcp.window_size_value',
    `点字段名填进过滤框（实得 "${await page.inputValue('#pl-filter')}"）`);
  await page.click('#pl-clear-filter');

  // ================= 5. 会话表 =================
  await page.click('.pl-tab[data-tab="flows"]');
  await page.waitForSelector('#pl-flow-table tbody tr');
  const flowRows = await page.locator('#pl-flow-table tbody tr').count();
  assert(flowRows === 2, `会话表 2 行（实得 ${flowRows}）`);
  const flowText = (await page.locator('#pl-flow-table').textContent()) || '';
  assert(/93\.184\.216\.34:443/.test(flowText), '会话表写出服务端地址与端口');
  assert(/SNI example\.com/.test(flowText), '会话表把 SNI 显示出来');
  assert(/握手完成/.test(flowText), '会话表写出 TCP 状态');
  assert(/正常关闭/.test(flowText), '双向 FIN 判为正常关闭');
  assert(/握手 27\.881 ms/.test(flowText), `会话表写出握手 RTT 27.881 ms = 0.041983 − 0.014102（实得片段 "${flowText.replace(/\s+/g, ' ').slice(0, 400)}"）`);
  assert(/次采样/.test(flowText), '会话表同时给出数据段 RTT 的采样次数');
  assert(/12\.597 ms/.test(flowText), `DNS 会话时长 12.597 ms = 0.013807 − 0.001210（实得片段 "${flowText.replace(/\s+/g, ' ').slice(0, 400)}"）`);

  // 「只看这条」把过滤器切过去
  await page.locator('.pl-flow-only').first().click();
  await page.waitForFunction(() => window.PL_UI.state.tab === 'packets');
  const flowExpr = await page.inputValue('#pl-filter');
  assert(/ip\.addr == /.test(flowExpr) && /tcp\.port == 443/.test(flowExpr) || /udp\.port/.test(flowExpr),
    `「只看这条」生成五元组过滤器（实得 "${flowExpr}"）`);
  assert((await listed()) === 12 || (await listed()) === 2, `五元组过滤后的包数合理（实得 ${await listed()}）`);
  await page.click('#pl-clear-filter');

  // ================= 6. 追踪流（换到明文 HTTP 示例） =================
  await page.locator('.pl-sample', { hasText: '明文 HTTP 请求' }).click();
  await page.waitForFunction(() => window.PL_UI.state.cap.packets.length === 11);
  S = await st();
  assert(S.packets === 11, `HTTP 示例 11 个包（实得 ${S.packets}）`);
  await page.click('.pl-tab[data-tab="follow"]');
  await page.waitForSelector('#pl-follow-body');
  const follow = (await page.locator('#pl-follow-body').textContent()) || '';
  assert(/GET \/index\.html HTTP\/1\.1/.test(follow), '追踪流里有请求行');
  assert(/Host: example\.com/.test(follow), '追踪流里有 Host 首部');
  assert(/HTTP\/1\.1 200 OK/.test(follow), '追踪流里有响应状态行');
  assert(/<h1>Example Domain<\/h1>/.test(follow), '跨两个 TCP 段的正文被拼回来');
  assert(/<\/html>/.test(follow), '正文结尾完整');
  const fmeta = (await page.locator('#pl-follow-meta').textContent()) || '';
  assert(/没有缺口/.test(fmeta), `完整抓包不应报缺口（实得 "${fmeta.trim()}"）`);
  const dirColors = await page.evaluate(() => ({
    a: document.querySelectorAll('#pl-follow-body .pl-dir-a').length,
    b: document.querySelectorAll('#pl-follow-body .pl-dir-b').length
  }));
  assert(dirColors.a === 1 && dirColors.b === 1, `双向各合并成一段（实得 A=${dirColors.a} B=${dirColors.b}）`);
  // 切到十六进制
  await page.click('#pl-follow-mode');
  const followHex = (await page.locator('#pl-follow-body').textContent()) || '';
  assert(/47 45 54 20/.test(followHex), `十六进制模式里 "GET " = 47 45 54 20（实得片段 "${followHex.slice(0, 80)}"）`);
  await page.click('#pl-follow-mode');

  // ================= 7. 统计 =================
  await page.click('.pl-tab[data-tab="stats"]');
  await page.waitForSelector('#pl-summary .pl-stat');
  const sum = (await page.locator('#pl-summary').textContent()) || '';
  assert(/包数/.test(sum) && /11/.test(sum), `总览写出包数（实得 "${sum.replace(/\s+/g, ' ').slice(0, 140)}"）`);
  const chart = await page.evaluate(() => {
    const svg = document.getElementById('pl-io-chart');
    const texts = Array.from(svg.querySelectorAll('text')).map((t) => ({
      s: t.textContent, b: t.getBoundingClientRect()
    }));
    let overlap = 0;
    for (let i = 0; i < texts.length; i++) {
      for (let j = i + 1; j < texts.length; j++) {
        const a = texts[i].b, c = texts[j].b;
        if (a.left < c.right && a.right > c.left && a.top < c.bottom && a.bottom > c.top) overlap++;
      }
    }
    const vbW = Number((svg.getAttribute('viewBox') || '0 0 0 0').split(' ')[2]);
    const cssW = svg.clientWidth;
    return {
      rects: svg.querySelectorAll('rect').length, texts: texts.length, overlap,
      dropped: Number(svg.dataset.dropped), buckets: Number(svg.dataset.buckets),
      labels: texts.map((t) => t.s), vbW, cssW, fillsCard: Math.abs(vbW - cssW) <= 2 && cssW > 600
    };
  });
  assert(chart.rects > 0, `吞吐图画出了柱子（实得 ${chart.rects}）`);
  assert(chart.fillsCard, `吞吐图应铺满卡片宽度（viewBox 宽 ${chart.vbW} / 实际宽 ${chart.cssW}）`);
  const yUnits = new Set(chart.labels.filter((s2) => /(B|KB|MB)$/.test(s2)).map((s2) => s2.split(' ').pop()));
  assert(yUnits.size <= 1, `纵轴刻度只能用一种单位（实得 ${JSON.stringify(Array.from(yUnits))}）`);
  assert(chart.labels.includes('0 s') || chart.labels.includes('0 ms'), `时间轴起点应写作 0 s / 0 ms（实得 ${JSON.stringify(chart.labels)}）`);
  const tUnits = new Set(chart.labels.filter((s2) => /(ms|s|µs)$/.test(s2) && !/(B|KB|MB)$/.test(s2)).map((s2) => s2.split(' ').pop()));
  assert(tUnits.size <= 1, `时间轴刻度只能用一种单位（实得 ${JSON.stringify(Array.from(tUnits))}）`);
  assert(chart.texts >= 5, `吞吐图有坐标标签（实得 ${chart.texts}）`);
  assert(chart.overlap === 0, `吞吐图上的文字两两不重叠（实得重叠 ${chart.overlap} 对）`);
  assert(chart.dropped === 0, `没有标签因为放不下被丢掉（实得丢弃 ${chart.dropped}）`);
  assert(!chart.labels.some((s) => /\b(HZ|KB\b.*[A-Z]{3}|MBIT|GBIT|DBFS)\b/.test(s)), '坐标标签里没有被大写规则改写的单位');
  const ioRows = await page.locator('#pl-io-table tbody tr').count();
  assert(ioRows === chart.buckets, `吞吐表的行数等于分桶数（图 ${chart.buckets} / 表 ${ioRows}）`);
  const hier = (await page.locator('#pl-hier-table').textContent()) || '';
  assert(/HTTP/.test(hier), '协议层次里有 HTTP');
  const hierRows = await page.evaluate(() => {
    const out = {};
    for (const tr of document.querySelectorAll('#pl-hier-table tbody tr')) {
      const nameSpan = tr.querySelector('.pl-sub');
      if (nameSpan) out[nameSpan.textContent.trim()] = tr.querySelectorAll('td')[1].textContent.trim();
    }
    return out;
  });
  // 第二个响应段是纯续传数据（不以状态行开头），照抓包工具的惯例不算作一个 HTTP 报文
  assert(hierRows.http === '2', `协议层次里 HTTP 计 2 个包（1 个请求 + 1 个响应首段，实得 ${hierRows.http}）`);
  assert(hierRows.tcp === '11', `协议层次里 TCP 计 11 个包（实得 ${hierRows.tcp}）`);
  assert(hierRows.frame === '11', `层次根节点覆盖全部 11 个包（实得 ${hierRows.frame}）`);
  const ep = (await page.locator('#pl-ep-table').textContent()) || '';
  assert(/93\.184\.216\.34/.test(ep) && /192\.168\.1\.24/.test(ep), '端点表列出两端地址');

  // ================= 8. 专家信息（换到「有问题的连接」示例） =================
  await page.locator('.pl-sample', { hasText: '有问题的连接' }).click();
  await page.waitForFunction(() => window.PL_UI.state.cap.packets.length === 19);
  await page.click('.pl-tab[data-tab="expert"]');
  await page.waitForSelector('.pl-expert-row');
  const expertRows = await page.locator('.pl-expert-row').count();
  assert(expertRows === 8, `专家信息 8 条（实得 ${expertRows}）`);
  const expertText = (await page.locator('#pl-expert-list').textContent()) || '';
  for (const kind of ['重传', '重复 ACK', '零窗口', '连接重置', 'ICMP 不可达', 'DNS 失败', '序号跳跃']) {
    assert(expertText.includes(kind), `专家信息里有「${kind}」（实得片段 "${expertText.replace(/\s+/g, ' ').slice(0, 300)}"）`);
  }
  assert(/连续 3 个重复 ACK/.test(expertText), '重复 ACK 的描述写出连续 3 个');
  // 点一条 → 跳到包列表并选中那一帧
  const targetFrame = await page.evaluate(() => Number(document.querySelectorAll('.pl-expert-row')[0].dataset.frame));
  await page.locator('.pl-expert-row').first().click();
  await page.waitForFunction((n) => window.PL_UI.state.tab === 'packets' && window.PL_UI.state.sel && window.PL_UI.state.sel.num === n, targetFrame);
  S = await st();
  assert(S.sel === targetFrame, `点专家信息跳到帧 ${targetFrame}（实得 ${S.sel}）`);

  // 逐帧核对时序分析的判定落在正确的帧上
  const notes = await page.evaluate(() => {
    const out = {};
    for (const p of window.PL_UI.state.cap.packets) {
      if (p.tcpNotes && p.tcpNotes.length) out[p.num] = p.tcpNotes.map((n) => n.k).join(',');
    }
    return out;
  });
  assert(notes[5] === 'gap', `第 5 帧应判为序号跳跃（实得 ${notes[5]}）`);
  assert(notes[7] === 'dupack' && notes[8] === 'dupack' && notes[9] === 'dupack',
    `第 7–9 帧应判为重复 ACK（实得 ${JSON.stringify([notes[7], notes[8], notes[9]])}）`);
  assert(notes[10] === 'retrans', `第 10 帧是补上缺失段的快速重传（实得 ${notes[10]}）`);
  assert(notes[12] === 'retrans', `第 12 帧是与第 5 帧完全相同的超时重传（实得 ${notes[12]}）`);
  assert(notes[13] === 'zerowin', `第 13 帧通告零窗口（实得 ${notes[13]}）`);
  assert(notes[15] === 'rst', `第 15 帧是 RST（实得 ${notes[15]}）`);
  assert(notes[2] === 'rtt', `第 2 帧记下握手 RTT（实得 ${notes[2]}）`);
  assert(Object.keys(notes).length === 9, `一共 9 帧带时序标记（实得 ${Object.keys(notes).length}）`);

  // 重传帧在详情头上被标出来，并指回原始帧
  await setFilter('frame.number == 12');
  await page.waitForFunction(() => window.PL_UI.state.list.length === 1);
  await page.locator('.pl-row').first().click();
  const hd2 = (await page.locator('#pl-detail-hd').textContent()) || '';
  assert(/重传/.test(hd2), `重传帧的详情头标出重传（实得 "${hd2.replace(/\s+/g, ' ').trim()}"）`);
  assert(/与帧 5 相同的数据/.test(hd2), `重传标注指回原始帧 5（实得 "${hd2.replace(/\s+/g, ' ').trim()}"）`);
  await page.click('#pl-clear-filter');

  // ICMP 差错报文里解出被丢弃的那个 UDP 报文
  await setFilter('icmp.type == 3');
  await page.waitForFunction(() => window.PL_UI.state.list.length === 1);
  const icmpRow = (await page.locator('.pl-row').first().textContent()) || '';
  assert(/端口不可达/.test(icmpRow) && /原始：UDP 51000 → 9999/.test(icmpRow),
    `ICMP 不可达里解出内嵌报文的端口（实得 "${icmpRow.replace(/\s+/g, ' ').trim()}"）`);
  await setFilter('dns.flags.rcode == 3');
  await page.waitForFunction(() => window.PL_UI.state.list.length === 1);
  const nxRow = (await page.locator('.pl-row').first().textContent()) || '';
  assert(/NXDOMAIN/.test(nxRow) && /no-such-host\.invalid/.test(nxRow),
    `NXDOMAIN 写进说明列（实得 "${nxRow.replace(/\s+/g, ' ').trim()}"）`);
  await page.click('#pl-clear-filter');

  // ================= 9. 旗标 + 备注的持久化 =================
  await page.evaluate(() => window.PL_UI.selectByNum(3));
  await page.evaluate(() => window.PL_UI.toggleFlag(3));
  await page.fill('#pl-note', '这里握手就完成了');
  await page.waitForFunction(() => {
    const m = JSON.parse(localStorage.getItem('packetlab.marks.v1') || '{}');
    return Object.values(m).some((c) => c['3'] && c['3'].note === '这里握手就完成了');
  });
  S = await st();
  assert(S.marks === 1, `插旗 1 帧（实得 ${S.marks}）`);
  const flagShown = await page.evaluate(() => document.querySelectorAll('.pl-row-flag').length);
  assert(flagShown === 1, `列表里画出旗标（实得 ${flagShown}）`);

  // 刷新页面后，重新载入同一个示例，旗标与备注应当还在
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.PL_UI && window.PL_UI.state.cap);
  await page.locator('.pl-sample', { hasText: '有问题的连接' }).click();
  await page.waitForFunction(() => window.PL_UI.state.cap.packets.length === 19);
  S = await st();
  assert(S.marks === 1, `刷新后旗标仍在（实得 ${S.marks}）`);
  await page.evaluate(() => window.PL_UI.selectByNum(3));
  assert((await page.inputValue('#pl-note')) === '这里握手就完成了', '刷新后备注仍在');
  // 收藏也应还在
  const savedAfter = await page.evaluate(() => JSON.parse(localStorage.getItem('packetlab.bookmarks.v1') || '[]'));
  assert(savedAfter.some((b) => b.expr === 'tls.sni == example.com'), '刷新后自定义收藏仍在');

  // ================= 10. 导出：写出去再读回来 =================
  // 时序分析的结论必须能被过滤器选中（字段速查里写了就得真能用）
  await setFilter('tcp.analysis.retransmission == 1');
  assert((await listed()) === 2, `重传过滤命中 2 帧（实得 ${await listed()}）`);
  await setFilter('tcp.analysis.duplicate_ack == 1');
  assert((await listed()) === 3, `重复 ACK 过滤命中 3 帧（实得 ${await listed()}）`);
  await setFilter('tcp.analysis.duplicate_ack_num == 3');
  assert((await listed()) === 1, `第 3 个重复 ACK 只有 1 帧（实得 ${await listed()}）`);
  await setFilter('tcp.analysis.zero_window == 1');
  assert((await listed()) === 1, `零窗口过滤命中 1 帧（实得 ${await listed()}）`);
  await setFilter('tcp.analysis.lost_segment == 1');
  assert((await listed()) === 1, `序号跳跃过滤命中 1 帧（实得 ${await listed()}）`);
  await setFilter('tcp.analysis.retransmission || tcp.analysis.zero_window || tcp.flags.rst == 1');
  assert((await listed()) === 4, `问题帧合起来 4 帧（2 重传 + 1 零窗 + 1 RST，实得 ${await listed()}）`);

  const rt = await page.evaluate(() => {
    const S2 = window.PL_UI.state;
    const subset = S2.list.slice();
    const out = {};
    for (const fmt of ['pcap', 'pcapng']) {
      const bytes = fmt === 'pcap'
        ? PL.build.writePcap(subset, { linktype: 1 })
        : PL.build.writePcapNg(subset, { interfaces: [{ linktype: 1, name: 'x' }] });
      const re = PL.container.parseCapture(bytes);
      re.packets.forEach((p) => PL.dissect.dissectPacket(p));
      out[fmt] = {
        n: re.packets.length, size: bytes.length,
        sameLen: re.packets.every((p, i) => p.capLen === subset[i].capLen),
        sameTs: re.packets.every((p, i) => p.tsSec === subset[i].tsSec && Math.floor(p.tsNsec / 1000) === Math.floor(subset[i].tsNsec / 1000)),
        sameInfo: re.packets.every((p, i) => p.info === subset[i].info)
      };
    }
    out.subset = subset.length;
    return out;
  });
  assert(rt.subset === 4, `导出的正是过滤后的 4 帧（实得 ${rt.subset}）`);
  for (const fmt of ['pcap', 'pcapng']) {
    assert(rt[fmt].n === rt.subset, `导出的 ${fmt} 读回来包数一致（实得 ${rt[fmt].n}）`);
    assert(rt[fmt].sameLen, `导出的 ${fmt} 每个包长度一致`);
    assert(rt[fmt].sameTs, `导出的 ${fmt} 每个包时间戳一致（微秒级）`);
    assert(rt[fmt].sameInfo, `导出的 ${fmt} 重新解析出的说明一致`);
    assert(rt[fmt].size > 100, `导出的 ${fmt} 文件非空（实得 ${rt[fmt].size} 字节）`);
  }

  await page.click('#pl-clear-filter');

  // 字段速查里列出的每个字段都必须是真能用的（不能广告一个永远匹配不到的字段）
  const deadFields = await page.evaluate(() => {
    const seen = new Set();
    for (const p of window.PL_UI.state.cap.packets) for (const k in p.f) seen.add(k);
    return { seen: Array.from(seen), total: PL.filter.FIELDS.length };
  });
  const webFields = await page.evaluate(() => {
    const bytes = PL.build.buildSample('web-visit');
    const cap = PL.container.parseCapture(bytes);
    cap.packets.forEach((p) => PL.dissect.dissectPacket(p));
    PL.analyze.analyze(cap);
    const seen = new Set();
    for (const p of cap.packets) for (const k in p.f) seen.add(k);
    for (const id of ['http-plain', 'v6-lan']) {
      const c2 = PL.container.parseCapture(PL.build.buildSample(id));
      c2.packets.forEach((p) => PL.dissect.dissectPacket(p));
      PL.analyze.analyze(c2);
      for (const p of c2.packets) for (const k in p.f) seen.add(k);
    }
    return Array.from(seen);
  });
  const allSeen = new Set(deadFields.seen.concat(webFields));
  const dead = await page.evaluate((seenArr) => {
    const seen = new Set(seenArr);
    return PL.filter.FIELDS.map((f) => f.name).filter((n) => !seen.has(n));
  }, Array.from(allSeen));
  assert(dead.length === 0, `字段速查里的字段都应在四个示例里真的出现过（没出现的：${JSON.stringify(dead)}）`);

  // ================= 11. 上传一个真实文件（pcapng 多接口） =================
  const upload = await page.evaluate(async () => {
    const bytes = PL.build.buildSample('v6-lan');
    const dt = new DataTransfer();
    dt.items.add(new File([bytes], '局域网杂项.pcapng', { type: 'application/octet-stream' }));
    const input = document.getElementById('pl-file');
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return bytes.length;
  });
  assert(upload > 0, '构造出示例字节');
  await page.waitForFunction(() => window.PL_UI.state.cap.format === 'pcapng');
  S = await st();
  assert(S.packets === 13, `pcapng 示例 13 个包（实得 ${S.packets}）`);
  assert(S.file === '局域网杂项.pcapng', `文件名跟着走（实得 "${S.file}"）`);
  const ngInfo = (await page.locator('#pl-capinfo').textContent()) || '';
  assert(/en0 \/ vlan100/.test(ngInfo), `写出两个接口名（实得 "${ngInfo.replace(/\s+/g, ' ').trim()}"）`);
  assert(/2 个接口/.test(ngInfo), 'pcapng 标签写出接口数');
  await setFilter('vlan.id == 100');
  assert((await listed()) === 2, `VLAN 100 上有 2 个 NTP 包（实得 ${await listed()}）`);
  await setFilter('frame.interface_id == 1');
  assert((await listed()) === 3, `第 2 个接口上共 3 个包（2 个 NTP + 1 个 mDNS，实得 ${await listed()}）`);
  await setFilter('icmpv6.type == 135');
  assert((await listed()) === 1, `邻居请求 1 个（实得 ${await listed()}）`);
  await page.locator('.pl-row').first().click();
  const ndTree = (await page.locator('#pl-tree').textContent()) || '';
  assert(/跳数限制：255/.test(ndTree), `邻居发现的跳数限制是 255（实得片段 "${ndTree.replace(/\s+/g, ' ').slice(0, 300)}"）`);
  await setFilter('ipv6.addr == fe80::/10');
  assert((await listed()) === 6, `fe80::/10 命中 6 个 IPv6 包（实得 ${await listed()}）`);
  await setFilter('icmp.type == 8');
  assert((await listed()) === 2, `IPv4 ping 请求 2 个（实得 ${await listed()}）`);
  await setFilter('icmp.seq == 2');
  assert((await listed()) === 2, `序号为 2 的 ping 一来一回共 2 个（实得 ${await listed()}）`);
  const pingRow = (await page.locator('.pl-row').first().textContent()) || '';
  assert(/回显请求 \(ping\)/.test(pingRow) && /seq=2/.test(pingRow),
    `ping 的说明写出类型与序号（实得 "${pingRow.replace(/\s+/g, ' ').trim()}"）`);
  await page.click('#pl-clear-filter');

  // 坏文件：给出可读错误而不是崩掉
  await page.evaluate(() => {
    const dt = new DataTransfer();
    dt.items.add(new File([new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])], '不是抓包.txt'));
    const input = document.getElementById('pl-file');
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForFunction(() => /不是 pcap/.test(document.getElementById('pl-warnings').textContent || ''));
  const errText = (await page.locator('#pl-warnings').textContent()) || '';
  assert(/不是 pcap \/ pcapng 文件/.test(errText), `坏文件给出可读错误（实得 "${errText.trim()}"）`);

  // ================= 12. 键盘操作 =================
  await page.locator('.pl-sample', { hasText: '一次 HTTPS 访问' }).click();
  await page.waitForFunction(() => window.PL_UI.state.cap.packets.length === 16);
  await page.evaluate(() => window.PL_UI.selectByNum(1));
  await page.locator('#pl-vp').focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.waitForFunction(() => window.PL_UI.state.sel.num === 3);
  S = await st();
  assert(S.sel === 3, `按两次 ↓ 走到第 3 帧（实得 ${S.sel}）`);
  await page.keyboard.press('ArrowUp');
  await page.waitForFunction(() => window.PL_UI.state.sel.num === 2);
  await page.keyboard.press('f');
  await page.waitForFunction(() => window.PL_UI.state.marks[2]);
  assert(await page.evaluate(() => !!window.PL_UI.state.marks[2]), 'F 键给当前帧插旗');
  await page.keyboard.press('f');
  await page.waitForFunction(() => !window.PL_UI.state.marks[2]);

  // ================= 13. 面板隐藏 / 显示的计算样式 =================
  await page.click('.pl-tab[data-tab="help"]');
  const disp = await page.evaluate(() => {
    const out = {};
    for (const n of ['packets', 'flows', 'follow', 'stats', 'expert', 'help']) {
      out[n] = getComputedStyle(document.getElementById('pl-panel-' + n)).display;
    }
    return out;
  });
  assert(disp.help !== 'none', '当前面板可见');
  for (const n of ['packets', 'flows', 'follow', 'stats', 'expert']) {
    assert(disp[n] === 'none', `非当前面板 ${n} 的计算样式必须是 none（实得 ${disp[n]}）`);
  }
  const helpText = (await page.locator('#pl-panel-help').textContent()) || '';
  assert(/不能抓包/.test(helpText), '说明页如实写出「不能抓包」');
  assert(/不解密 TLS/.test(helpText), '说明页写出不解密 TLS');
  assert(/scapy 2\.7\.0/.test(helpText), '说明页写出对拍用的参照实现');
  assert(/32540/.test(helpText), '说明页写出对拍断言数');

  // ================= 14. 单位大写守卫 + 控件尺寸 + 窄屏布局（逐标签页） =================
  const TABS = ['packets', 'flows', 'follow', 'stats', 'expert', 'help'];
  let controlsSeen = 0;
  for (const tab of TABS) {
    await page.click(`.pl-tab[data-tab="${tab}"]`);
    await page.waitForFunction((t) => window.PL_UI.state.tab === t, tab);

    const badWords = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('th, dt, label, legend')) {
        const t = (el.textContent || '').trim();
        if (/\b(HZ|KHZ|DBFS|DB|KB\/S|MBIT\/S|BYTES)\b/.test(t)) out.push(t);
      }
      return out;
    });
    assert(badWords.length === 0, `${tab}：表头/标签里不应出现被大写改写的单位（实得 ${JSON.stringify(badWords)}）`);

    const small = await page.evaluate(() => {
      const bad = [];
      let n = 0;
      for (const el of document.querySelectorAll('input, select, button, textarea')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;   // 不可见的跳过
        n++;
        const tag = el.tagName.toLowerCase();
        const isCheck = tag === 'input' && (el.type === 'checkbox' || el.type === 'radio');
        const minW = isCheck ? 18 : (tag === 'button' ? 52 : 100);
        if (r.width < minW || r.height < 18) {
          bad.push(`${tag}#${el.id || el.className} ${r.width.toFixed(0)}x${r.height.toFixed(0)} (需 ≥${minW}x18)`);
        }
      }
      return { bad, n };
    });
    controlsSeen += small.n;
    assert(small.bad.length === 0, `${tab}：控件不应塌缩（实得 ${JSON.stringify(small.bad.slice(0, 4))}）`);
  }
  assert(controlsSeen >= 60, `逐标签页累计扫到足够多的控件（实得 ${controlsSeen}）`);

  // 窄屏：整页不许横向溢出
  for (const vw of [390, 768, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const tab of TABS) {
      await page.click(`.pl-tab[data-tab="${tab}"]`);
      await page.waitForFunction((t) => window.PL_UI.state.tab === t, tab);
      const over = await page.evaluate(() => {
        const d = document.documentElement;
        const spill = d.scrollWidth - d.clientWidth;
        if (spill <= 1) return { spill: 0, who: '' };
        let worst = null;
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          if (r.right > d.clientWidth + 1 && (!worst || r.right > worst.right)) {
            worst = { right: r.right, tag: el.tagName + '.' + (el.className || '').toString().split(' ')[0] };
          }
        }
        return { spill, who: worst ? `${worst.tag} 右边界 ${worst.right.toFixed(0)}` : '未定位' };
      });
      assert(over.spill <= 1, `${vw}px / ${tab}：整页不应横向溢出（实得溢出 ${over.spill}px，越界元素 ${over.who}）`);
      if (tab === 'packets') {
        const infoW = await page.evaluate(() => {
          const el = document.querySelector('.pl-row .pl-c-info');
          return el ? el.getBoundingClientRect().width : -1;
        });
        assert(infoW > 80, `${vw}px：包列表的「说明」列必须留出可读宽度（实得 ${infoW.toFixed(0)}px）`);
      }
    }
  }
  await page.setViewportSize({ width: 1280, height: 850 });

  // ================= 15. 子元素不越出父格 =================
  await page.click('.pl-tab[data-tab="packets"]');
  await page.waitForFunction(() => window.PL_UI.state.tab === 'packets');
  const escaped = await page.evaluate(() => {
    const bad = [];
    for (const row of document.querySelectorAll('.pl-row')) {
      const pr = row.getBoundingClientRect();
      for (const kid of row.children) {
        const kr = kid.getBoundingClientRect();
        if (kr.left < pr.left - 1 || kr.right > pr.right + 1 || kr.top < pr.top - 1 || kr.bottom > pr.bottom + 1) {
          bad.push(kid.className + ' 越出所在行');
        }
      }
    }
    for (const card of document.querySelectorAll('.pl-card')) {
      const cr = card.getBoundingClientRect();
      for (const pre of card.querySelectorAll('.pl-codeblock, .pl-stream, .pl-hex')) {
        if (pre.scrollWidth - pre.clientWidth > 2 && getComputedStyle(pre).overflowX === 'visible') {
          bad.push('代码块横向撑破卡片');
        }
        const r = pre.getBoundingClientRect();
        if (r.right > cr.right + 1) bad.push('代码块右边界越出卡片');
      }
    }
    return bad;
  });
  assert(escaped.length === 0, `列表行内的字段不应越出行、代码块不应撑破卡片（实得 ${JSON.stringify(escaped.slice(0, 4))}）`);

  // ================= 16. 缩略图 =================
  await page.evaluate(() => window.PL_UI.selectByNum(8));   // ClientHello，右侧详情最有看头
  await page.waitForTimeout(150);
  // 缩略图取「包列表 + 字段树 + 十六进制」这一屏，而不是首屏的大标题
  await page.evaluate(() => {
    const el = document.querySelector('.pl-tabs');
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 12);
  });
  await page.waitForTimeout(120);
  await screenshot('thumb.png');
  console.log(`      (packet-lab: ${nAssert} 条浏览器断言)`);
}
