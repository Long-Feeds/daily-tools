// 二进制解剖台 · Binary Scope —— 真实浏览器集成测试
// 断言真实的解析结果（尺寸 / GPS 坐标 / CRC / 时长 / box 树 / 字节解释器读数），
// 而不是元素存在性；并带上历史踩过的三类守卫：隐藏面板计算样式、控件塌缩、canvas 标注避让。
export default async ({ page, toolURL, screenshot, assert }) => {
  await page.goto(toolURL);
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 30000 });

  const txt = async (sel) => (await page.textContent(sel)).trim();
  // 概览键值表读数：按 dt 文本取 dd
  const kv = async (label) => page.evaluate((l) => {
    const dts = Array.from(document.querySelectorAll('#bs-kv dt'));
    const i = dts.findIndex((d) => d.textContent.trim() === l);
    return i < 0 ? null : document.querySelectorAll('#bs-kv dd')[i].textContent.trim();
  }, label);
  const finds = async () => page.$$eval('.bs-find-t', (ns) => ns.map((n) => n.textContent.trim()));
  const treeNames = async () => page.$$eval('#bs-tree .bs-node .bs-node-n', (ns) => ns.map((n) => n.textContent.trim()));
  // 面板助手：藏在别的面板里的控件对 fill/click 不可见（Playwright 会卡满超时）
  const onTab = async (name, fn) => {
    await page.click('#bs-tab-' + name);
    await page.waitForFunction((n) => !document.getElementById('bs-panel-' + n).hidden, name);
    return fn ? fn() : null;
  };
  // 正向等待目标态出现（不用「≠ 旧值」当条件：旧值会让条件瞬间为真，见 2026-08-10 教训）
  const openSample = async (id) => {
    const want = (await page.textContent('[data-sample="' + id + '"] .bs-pal-name')).trim();
    await page.click('[data-sample="' + id + '"]');
    await page.waitForFunction((n) => document.querySelector('#bs-fname').textContent.trim() === n, want, { timeout: 20000 });
  };

  const waitImg = () => page.waitForFunction(() => {
    const i = document.querySelector('#bs-prev img');
    return !!(i && i.complete && i.naturalWidth > 0);
  }, null, { timeout: 10000 });

  assert(await page.isVisible('a[href="../../"]'), '顶部有返回工具集链接');

  /* ═════════ 1. JPEG：EXIF / GPS / 结构 ═════════ */
  assert((await txt('#bs-fname')).includes('GPS'), '首屏默认载入带 GPS 的示例照片');
  assert(await txt('#bs-fmt') === 'JPEG', '识别为 JPEG');
  assert(await kv('识别格式') === 'JPEG 图像', 'JPEG 识别格式');
  assert(await kv('图像尺寸') === '240 × 150 px', 'SOF0 解出画布尺寸 240 × 150，实得 ' + await kv('图像尺寸'));
  assert(await kv('色度抽样') === '4:2:0', '色度抽样按采样因子算出 4:2:0');
  assert(await kv('编码方式') === '基线 DCT', 'canvas 导出的是基线 JPEG');
  // GPS：写进样本的是 1.3521N / 103.8198E（度分秒有理数往返）
  const gps = await kv('EXIF · GPS');
  assert(gps === '1.352100°N 103.819800°E', 'GPS 度分秒还原成十进制，实得 ' + gps);
  assert(await kv('EXIF · 厂商') === 'BinaryScope' && await kv('EXIF · 型号') === 'DemoCam X1', 'EXIF 厂商与型号');
  assert(await kv('EXIF · 焦距') === '35（350/10）', '有理数标签按分数与小数同时给出');
  assert((await kv('EXIF · 曝光时间')) === '0.008（1/125）', '曝光时间 1/125');
  assert((await kv('EXIF · 软件')).includes('二进制解剖台'), 'ASCII 字段里的 UTF-8 中文能正确还原，实得 ' + await kv('EXIF · 软件'));
  const jf = await finds();
  assert(jf.some((f) => f.includes('含 GPS 定位：1.352100°N')), '体检发现里报出 GPS 泄露，实得 ' + JSON.stringify(jf));
  assert(jf.some((f) => f.includes('设备指纹')), '体检发现里报出设备指纹');
  // 结构树：JPEG 标记段
  await onTab('tree');
  const jn = await treeNames();
  for (const m of ['SOI', 'APP1', 'APP0', 'SOF0', 'DHT', 'SOS', 'EOI']) assert(jn.includes(m), '结构树含 ' + m + ' 段');
  assert(jn.filter((n) => n === 'DQT').length === 2, '两张量化表');
  // 预览真的渲染出来了
  await waitImg();
  const prev = await page.evaluate(() => { const i = document.querySelector('#bs-prev img'); return i ? [i.naturalWidth, i.naturalHeight] : null; });
  assert(prev && prev[0] === 240 && prev[1] === 150, '浏览器能解码这张合成 JPEG（含注入的 EXIF），实得 ' + JSON.stringify(prev));

  /* ═════════ 2. PNG：逐块 CRC + 文本块 ═════════ */
  await onTab('overview');
  await openSample('png');
  assert(await txt('#bs-fmt') === 'PNG', '识别为 PNG');
  assert(await kv('图像尺寸') === '200 × 120 px', 'IHDR 尺寸');
  assert(await kv('颜色类型') === '真彩色 RGB（类型 2）', 'IHDR 颜色类型');
  assert(await kv('分辨率') === '72 DPI', 'pHYs 换算成 DPI（2835 像素/米 = 72 DPI）');
  assert((await kv('文本 · Title')) === 'Binary Scope 示例图', 'tEXt 关键字与文本');
  const pf = await finds();
  assert(pf.some((f) => f.includes('CRC 校验通过')), 'PNG 全块 CRC 通过，实得 ' + JSON.stringify(pf));
  const ratio = await kv('压缩比');
  assert(parseFloat(ratio) > 1.5, 'IDAT 是真 deflate 流（压缩比 > 1.5），实得 ' + ratio);
  await onTab('tree');
  const pn = await treeNames();
  for (const c of ['签名', 'IHDR', 'pHYs', 'IDAT', 'IEND']) assert(pn.includes(c), 'PNG 结构树含 ' + c);
  // 选中 IHDR，字段明细与高亮范围要对
  await page.click('#bs-tree .bs-node:nth-child(2)');
  assert(await txt('#bs-detail-title') === 'IHDR', '点节点后明细标题跟着换');
  assert((await txt('#bs-detail-range')).startsWith('0x0008'), 'IHDR 从偏移 8 开始，实得 ' + await txt('#bs-detail-range'));

  /* ═════════ 3. 十六进制 + 字节解释器（真读数） ═════════ */
  await onTab('hex');
  await page.fill('#bs-goto', '0x10');
  await page.click('#bs-goto-btn');
  await page.waitForFunction(() => document.querySelector('#bs-insp-off').textContent.includes('0x0010'));
  // PNG 偏移 0x10 起是 IHDR 数据：宽度 200 的大端 u32
  const w32 = await page.evaluate(() => {
    const dts = Array.from(document.querySelectorAll('#bs-insp td'));
    const i = dts.findIndex((d) => d.textContent.trim() === '32 位小端 / 大端');
    return dts[i + 1].textContent.trim();
  });
  assert(w32.split('/')[1].trim() === '200', '字节解释器在 0x10 处的大端 u32 = 图像宽度 200，实得 ' + w32);
  // 点某个字节，光标与偏移显示要跟着变
  await page.click('#bs-hexrows .bs-hexrow:nth-child(2) .bs-hexb span:nth-child(1)');
  const curOff = await txt('#bs-insp-off');
  assert(/0x00[0-9A-F]{2}/.test(curOff), '点击字节后解释器显示该偏移，实得 ' + curOff);
  const rowCount = await page.$$eval('#bs-hexrows .bs-hexrow', (n) => n.length);
  assert(rowCount > 10 && rowCount < 40, '虚拟滚动只渲染可视窗口的行（实得 ' + rowCount + ' 行，而不是全文件 ' + '2000+ 行）');
  await page.selectOption('#bs-bpr', '32');
  await page.waitForFunction(() => document.querySelector('#bs-hex-sum').textContent.includes('每行 32 字节'));
  const cells32 = await page.$$eval('#bs-hexrows .bs-hexrow:nth-child(1) .bs-hexb span', (n) => n.length);
  assert(cells32 === 32, '切到每行 32 字节后一行渲染 32 个字节格，实得 ' + cells32);
  await page.selectOption('#bs-bpr', '16');

  /* ═════════ 4. ZIP：真解压 + CRC + 路径穿越体检 ═════════ */
  await onTab('overview');
  await openSample('zip');
  assert(await txt('#bs-fmt') === 'ZIP', '识别为 ZIP');
  assert((await kv('条目数')).startsWith('3 个'), 'ZIP 三个条目');
  assert((await kv('解压自检')).includes('CRC 通过 3 / 失败 0'), '三个条目都真解压且 CRC 一致，实得 ' + await kv('解压自检'));
  assert((await kv('压缩方法')).includes('Deflate'), '含真 deflate 条目（由浏览器 CompressionStream 压、本页 inflate 解）');
  const zf = await finds();
  assert(zf.some((f) => f.includes('穿越或绝对路径')), 'Zip Slip 体检命中，实得 ' + JSON.stringify(zf));
  assert(zf.some((f) => f.includes('真解压并通过 CRC 校验')), 'CRC 自检通过项');
  await onTab('tree');
  const zn = await treeNames();
  assert(zn.includes('本地条目区') && zn.includes('中央目录') && zn.includes('EOCD'), 'ZIP 三大区齐全');
  assert(zn.some((n) => n.includes('读我.txt')), 'UTF-8 中文条目名正确解出，实得 ' + JSON.stringify(zn.slice(0, 8)));
  assert(zn.some((n) => n.includes('../etc/evil.conf')), '穿越路径条目出现在树里');
  const chips = await page.$$eval('#bs-tree .bs-chip', (ns) => ns.map((n) => n.textContent.trim()));
  assert(chips.length >= 6 && chips.every((c) => c === 'CRC ✓'), '每个条目都挂上 CRC 通过徽标，实得 ' + JSON.stringify(chips));
  // 真解压出来的文本预览
  const previewOK = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('#bs-tree .bs-node'));
    const t = nodes.find((n) => n.textContent.includes('读我.txt'));
    t.click();
    const dts = Array.from(document.querySelectorAll('#bs-detail dt'));
    const i = dts.findIndex((d) => d.textContent.trim() === '内容预览');
    return i < 0 ? null : document.querySelectorAll('#bs-detail dd')[i].textContent;
  });
  assert(previewOK && previewOK.includes('二进制解剖台'), 'deflate 条目解压出的正文能预览，实得 ' + String(previewOK).slice(0, 40));

  /* ═════════ 5. GZIP：inflate 与尾部 CRC/ISIZE 对拍 ═════════ */
  await onTab('overview');
  await openSample('gzip');
  assert(await txt('#bs-fmt') === 'GZIP', '识别为 GZIP');
  assert(await kv('原始文件名') === 'report.txt', 'FNAME 字段还原原始文件名');
  const iso = await kv('解压自检');
  assert(iso.includes('CRC-32 与长度均一致'), 'inflate 结果与尾部 CRC-32、ISIZE 全部对上，实得 ' + iso);
  const origLen = parseInt((await kv('原始长度（尾部记录）')).replace(/[^0-9]/g, ''), 10);
  assert(origLen > 1000 && iso.includes(origLen.toLocaleString('zh-CN')), '解出的字节数等于 ISIZE 记录值');

  /* ═════════ 6. GIF：帧数 / 延时 / 循环 ═════════ */
  await openSample('gif');
  assert(await txt('#bs-fmt') === 'GIF', '识别为 GIF');
  assert(await kv('画布尺寸') === '128 × 80 px', 'GIF 逻辑屏幕尺寸');
  assert(await kv('帧数') === '3 帧（动图）', '数出 3 帧');
  assert(await kv('总时长') === '0.600 秒', '3 × 20 厘秒 = 0.6 秒，实得 ' + await kv('总时长'));
  assert(await kv('循环') === '无限循环', 'NETSCAPE2.0 循环次数 0 = 无限');
  assert((await kv('注释')).includes('GIF89a'), '注释扩展按子块正确读出（长度写错会把尾块吃掉）');
  await waitImg();
  const gifImg = await page.evaluate(() => { const i = document.querySelector('#bs-prev img'); return i ? [i.naturalWidth, i.naturalHeight] : null; });
  assert(gifImg && gifImg[0] === 128, '浏览器能解码这张手写 LZW 码流的 GIF，实得 ' + JSON.stringify(gifImg));

  /* ═════════ 7. WAV：采样参数与时长 ═════════ */
  await openSample('wav');
  assert(await txt('#bs-fmt') === 'WAV', '识别为 WAV');
  assert(await kv('采样率') === '22,050 Hz' && await kv('位深') === '16 位' && await kv('声道') === '单声道', 'fmt 块参数');
  assert(await kv('时长') === '0.500 秒', 'data 块字节数 ÷ 字节率 = 0.5 秒，实得 ' + await kv('时长'));
  assert(await kv('码率') === '353 kbps', 'PCM 码率');

  /* ═════════ 8. MP4：ISO-BMFF box 树 ═════════ */
  await openSample('mp4');
  assert(await txt('#bs-fmt') === 'MP4', '识别为 MP4');
  assert(await kv('时长') === '5.000 秒', 'mvhd duration 5000 ÷ timescale 1000 = 5 秒，实得 ' + await kv('时长'));
  assert((await kv('画面尺寸')).startsWith('320 × 180'), 'tkhd 的 16.16 定点宽高，实得 ' + await kv('画面尺寸'));
  assert((await kv('主品牌')) === 'isom', 'ftyp 主品牌');
  await onTab('tree');
  const mn = await treeNames();
  for (const b of ['ftyp', 'moov', 'mvhd', 'trak', 'mdia', 'minf', 'stbl', 'stsd', 'mdat']) assert(mn.includes(b), 'box 树含 ' + b);
  const depth = await page.$$eval('#bs-tree .bs-node', (ns) => Math.max(...ns.map((n) => parseInt(n.style.paddingLeft) || 0)));
  assert(depth >= 8 + 16 * 4, 'box 树至少嵌套到第 5 层（stsd 在 moov/trak/mdia/minf/stbl 下），实得缩进 ' + depth);
  const mf = await finds();
  assert(mf.some((f) => f.includes('moov 在 mdat 之前')), '判断出适合边下边播（faststart）');

  /* ═════════ 9. 聚合体：PNG 尾部藏 ZIP ═════════ */
  await onTab('overview');
  await openSample('polyglot');
  assert(await txt('#bs-fmt') === 'PNG', '聚合体按魔数仍识别为 PNG（看图工具也是这么认的）');
  const gf = await finds();
  assert(gf.some((f) => /图像结束标记后还有 [0-9,]+ 字节/.test(f)), 'IEND 之后的附加数据被抓出来，实得 ' + JSON.stringify(gf));
  const detail = await page.$$eval('.bs-find-d', (ns) => ns.map((n) => n.textContent).join(' '));
  assert(detail.includes('ZIP'), '尾部数据的魔数被识别为 ZIP');
  await onTab('tree');
  assert((await treeNames()).includes('尾部附加数据'), '结构树里多出一段「尾部附加数据」');

  /* ═════════ 10. 现造文件喂进来：ELF / SQLite / 未知高熵 ═════════ */
  const drop = async (name, arr) => {
    await page.setInputFiles('#bs-file', { name, mimeType: 'application/octet-stream', buffer: Buffer.from(arr) });
    await page.waitForFunction((n) => document.querySelector('#bs-fname').textContent === n, name, { timeout: 10000 });
  };
  const elf = new Uint8Array(120);
  elf.set([0x7F, 0x45, 0x4C, 0x46, 2, 1, 1, 0], 0);
  new DataView(elf.buffer).setUint16(16, 2, true);   // e_type = EXEC
  new DataView(elf.buffer).setUint16(18, 62, true);  // e_machine = x86-64
  new DataView(elf.buffer).setUint16(52, 64, true);  // e_ehsize
  await drop('a.out', elf);
  await onTab('overview');
  assert(await txt('#bs-fmt') === 'ELF', '手工造的 ELF 头被认出来');
  assert(await kv('架构') === 'x86-64' && await kv('文件类型') === '可执行文件', 'ELF e_machine / e_type 解码');
  assert((await finds()).some((f) => f.includes('可执行文件')), '可执行文件给出风险提示');

  const sq = new Uint8Array(200);
  const enc = new TextEncoder().encode('SQLite format 3');
  sq.set(enc, 0);
  const dvq = new DataView(sq.buffer);
  dvq.setUint16(16, 4096); dvq.setUint32(28, 12); dvq.setUint32(56, 1);
  await drop('app.db', sq);
  assert(await txt('#bs-fmt') === 'SQLite', 'SQLite 头识别');
  assert(await kv('页大小') === '4,096 字节' && await kv('页数') === '12', 'SQLite 头字段');

  const rnd = new Uint8Array(4096);
  let seed = 12345;
  for (let i = 0; i < rnd.length; i++) { seed = (seed * 1103515245 + 12345) & 0x7fffffff; rnd[i] = (seed >> 16) & 255; }
  await drop('blob.bin', rnd);
  assert(await txt('#bs-fmt') === '未知', '无魔数的随机数据判为未知');
  const ent = parseFloat(await kv('整体熵'));
  assert(ent > 7.8, '伪随机数据的熵接近 8，实得 ' + ent);

  const jsonBytes = new TextEncoder().encode(JSON.stringify({ 名称: '示例', 列表: [1, 2, 3], 嵌套: { 深: { 度: true } } }, null, 2));
  await drop('data.json', jsonBytes);
  assert(await txt('#bs-fmt') === 'JSON', '文本嗅探识别出 JSON');
  assert(await kv('JSON 顶层') === '对象（3 个键）' && await kv('嵌套深度') === '3', 'JSON 结构统计');

  /* ═════════ 11. 字符串面板 ═════════ */
  await openSample('zip');
  await onTab('str');
  const before = await page.$$eval('#bs-str-tbl tbody tr', (n) => n.length);
  assert(before > 5, '字符串面板扫出内容');
  const hasCJK = await page.$$eval('#bs-str-tbl .bs-str', (ns) => ns.some((n) => /[一-鿿]/.test(n.textContent)));
  assert(hasCJK, 'UTF-8 中文串能被扫出来');
  await page.fill('#bs-str-q', 'evil');
  await page.waitForFunction(() => document.querySelectorAll('#bs-str-tbl tbody tr').length > 0);
  const hits = await page.$$eval('#bs-str-tbl .bs-str', (ns) => ns.map((n) => n.textContent));
  assert(hits.length > 0 && hits.every((h) => h.toLowerCase().includes('evil')), '过滤只留命中项，实得 ' + JSON.stringify(hits.slice(0, 3)));
  await page.fill('#bs-str-q', '/pixel\\.png/');
  await page.waitForFunction(() => Array.from(document.querySelectorAll('#bs-str-tbl .bs-str')).every((n) => n.textContent.includes('pixel.png')));
  assert((await page.$$eval('#bs-str-tbl .bs-str', (n) => n.length)) > 0, '/正则/ 语法生效');
  await page.fill('#bs-str-q', '');
  // 点一条跳到十六进制
  await page.click('#bs-str-tbl tbody tr:nth-child(2)');
  await page.waitForFunction(() => !document.getElementById('bs-panel-hex').hidden);
  assert(!(await page.isHidden('#bs-panel-hex')), '点字符串会跳到十六进制面板');

  /* ═════════ 12. 图谱：canvas 标注真的画出来了（DOM 断言测不出重叠） ═════════ */
  await onTab('map');
  const chart = await page.evaluate(() => window.__bsChart);
  const hist = await page.evaluate(() => window.__bsHist);
  assert(chart.dropped === 0, '熵曲线没有标注被避让掉，实得 dropped=' + chart.dropped);
  const yticks = chart.drawn.filter((d) => d.tag === 'ytick').length;
  const xticks = chart.drawn.filter((d) => d.tag === 'xtick').length;
  const segLabels = chart.drawn.filter((d) => d.tag === 'seg').length;
  assert(yticks === 5, 'y 轴 5 个刻度全部画出（0/2/4/6/8），实得 ' + yticks);
  assert(xticks === 5, 'x 轴 5 个偏移刻度全部画出，实得 ' + xticks);
  assert(segLabels === chart.segs, '每个分段标注都真的画在画布上（不是被静默丢弃），实得 ' + segLabels + '/' + chart.segs);
  assert(hist.dropped === 0 && hist.drawn.length === 9, '字节分布图 9 个标注全部画出，实得 ' + hist.drawn.length + ' 掉 ' + hist.dropped);
  // 文字盒两两不相交（避让器自己的不变量）
  const overlap = await page.evaluate(() => {
    const boxes = window.__bsChart.drawn.map((d) => ({ x: d.x, y: d.y, w: d.text.length * 7.5, h: 13 }));
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      if (!(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y)) return [a, b];
    }
    return null;
  });
  assert(!overlap, 'canvas 上没有两段文字互相重叠，实得 ' + JSON.stringify(overlap));
  const segRows = await page.$$eval('#bs-seg-tbl tbody tr', (n) => n.length);
  assert(segRows >= 3, '分段读数表给出逐段体积与熵（图之外的表格读数），实得 ' + segRows + ' 行');

  /* ═════════ 13. 守卫一：隐藏面板必须真的不可见（[hidden] 被作者 CSS 压过的老坑） ═════════ */
  const hiddenOK = await page.evaluate(() => {
    const cur = ['overview', 'tree', 'hex', 'map', 'str'].filter((t) => !document.getElementById('bs-panel-' + t).hidden);
    const bad = ['overview', 'tree', 'hex', 'map', 'str']
      .filter((t) => document.getElementById('bs-panel-' + t).hidden)
      .filter((t) => getComputedStyle(document.getElementById('bs-panel-' + t)).display !== 'none');
    return { cur, bad };
  });
  assert(hiddenOK.cur.length === 1, '同一时刻只有一个面板可见，实得 ' + JSON.stringify(hiddenOK.cur));
  assert(hiddenOK.bad.length === 0, '隐藏面板的计算样式必须是 display:none，实得 ' + JSON.stringify(hiddenOK.bad));

  /* ═════════ 14. 守卫二：逐面板扫控件尺寸（藏在别的 tab 里的塌缩测不出来） ═════════ */
  let scanned = 0;
  for (const t of ['overview', 'tree', 'hex', 'map', 'str']) {
    await onTab(t);
    const bad = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('input, select, button, a.bs-back')) {
        const r = el.getBoundingClientRect();
        if (!r.width && !r.height) continue;                       // 不可见的跳过
        if (getComputedStyle(el).display === 'none') continue;
        const isCheck = el.type === 'checkbox';
        const minW = isCheck ? 18 : (el.tagName === 'BUTTON' || el.tagName === 'A' ? 52 : 100);
        if (r.width < minW || r.height < 18) out.push({ tag: el.tagName, id: el.id || el.className, w: Math.round(r.width), h: Math.round(r.height) });
      }
      return { bad: out, n: document.querySelectorAll('input, select, button').length };
    });
    scanned += bad.n;
    assert(bad.bad.length === 0, t + ' 面板存在塌缩控件：' + JSON.stringify(bad.bad));
  }
  assert(scanned > 60, '五个面板累计扫到的控件数应有下界（防止一个都没扫到也算绿），实得 ' + scanned);

  /* ═════════ 15. 守卫三：窄格里的文字不许溢出父格 + 单位大写守卫 ═════════ */
  await onTab('overview');
  const spill = await page.evaluate(() => {
    const out = [];
    for (const seg of document.querySelectorAll('#bs-map .bs-seg')) {
      const l = seg.querySelector('.bs-seg-l');
      if (!l) continue;
      const a = seg.getBoundingClientRect(), b = l.getBoundingClientRect();
      if (b.left < a.left - 1 || b.right > a.right + 1) out.push({ t: l.textContent, segW: Math.round(a.width), lblW: Math.round(b.width) });
    }
    return out;
  });
  assert(spill.length === 0, '文件地图里的段标签不越出所在格，实得 ' + JSON.stringify(spill));
  const upper = await page.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll('th, dt, label, .bs-hint')) {
      if (/\b(HZ|KHZ|DBFS|DB|KBPS|BIT\/BYTE|CRC-32|MIME)\b/.test(el.textContent) && /[a-z]/.test(el.textContent) === false && /HZ|KHZ|DBFS|KBPS/.test(el.textContent)) bad.push(el.textContent);
      if (getComputedStyle(el).textTransform === 'uppercase') bad.push('uppercase: ' + el.textContent.slice(0, 20));
    }
    return bad;
  });
  assert(upper.length === 0, '标签与表头没有被 uppercase 改写单位符号，实得 ' + JSON.stringify(upper));

  /* ═════════ 16. 键盘与状态持久化 ═════════ */
  await page.click('body');
  await page.keyboard.press('3');
  await page.waitForFunction(() => !document.getElementById('bs-panel-hex').hidden);
  assert(!(await page.isHidden('#bs-panel-hex')), '按 3 切到十六进制面板');
  await page.keyboard.press('1');
  await page.waitForFunction(() => !document.getElementById('bs-panel-overview').hidden);
  assert(!(await page.isHidden('#bs-panel-overview')), '按 1 回到概览');
  const recent = await page.evaluate(() => JSON.parse(localStorage.getItem('bs.recent') || '[]').length);
  assert(recent >= 3, '最近打开记录写进 localStorage，实得 ' + recent + ' 条');
  await page.reload();
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 30000 });
  const recentRows = await page.$$eval('.bs-pal-sec', (ns) => ns.map((n) => n.textContent));
  assert(recentRows.some((r) => r.includes('最近打开')), '刷新后命令面板里能看到最近打开分组');
  // 面板搜索过滤
  await page.fill('#bs-pal-search', 'zip');
  await page.waitForFunction(() => document.querySelectorAll('#bs-pal-list .bs-pal-row').length > 0);
  const rows = await page.$$eval('#bs-pal-list .bs-pal-row', (ns) => ns.map((n) => n.textContent));
  assert(rows.length > 0 && rows.every((r) => r.toLowerCase().includes('zip')), '命令面板搜索按名称与说明过滤，实得 ' + JSON.stringify(rows));
  const zipRow = await page.$$eval('#bs-pal-list .bs-pal-row .bs-pal-name', (ns) => ns.map((n) => n.textContent));
  assert(zipRow.includes('示例压缩包.zip'), '搜索结果里有 ZIP 样本本体');
  await page.fill('#bs-pal-search', '');

  /* ═════════ 缩略图 ═════════ */
  await onTab('overview');
  await page.evaluate(() => window.scrollTo(0, 470));
  await page.waitForTimeout(300);
  await screenshot('thumb.png');
  await onTab('map');
  await page.evaluate(() => document.querySelector('#bs-panel-map').scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(250);
  await screenshot('view-entropy.png');
  await onTab('hex');
  await page.evaluate(() => document.querySelector('#bs-panel-hex').scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(200);
  await screenshot('view-hex.png');
  await onTab('tree');
  await page.evaluate(() => document.querySelector('#bs-panel-tree').scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(200);
  await screenshot('view-tree.png');
};
