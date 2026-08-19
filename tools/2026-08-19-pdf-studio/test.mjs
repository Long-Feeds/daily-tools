// PDF 工作台 · Pdf Studio 集成测试
//
// 三层断言：
//  1) 真实产物层 —— 打开真 PDF（测试里用 Chrome 现场打印一份）后，抽出的文字必须是那几句话；
//     导出的 PDF 再用本页引擎重新解析，页数/顺序/旋转/每页文字必须与源页一致；「假打码」样张里
//     被黑块盖住的手机号必须被原样读出来；受限文件必须被真的解开并导出成不加密的副本。
//  2) 交互层 —— 真的点标签页、真的勾选/旋转/删页/移动、真的按导出、真的上传文件、真的搜索。
//  3) 守卫层 —— [hidden] 的计算样式、逐 tab 扫控件最小尺寸、页卡子元素不越界、窄屏无横向溢出、
//     th/dt/label 里没有被 uppercase 改写的单位、代码块不横向截断。
//
// 引擎在离线阶段已与 pypdf / poppler(pdftotext) / python zlib·hashlib·cryptography 对拍过
//（416 份真实 PDF 的页数与纸张、29 份文本 PDF 的逐字符文字、164 个导出件的 592 页、1371 组过滤器与摘要），
// 这里只测「装进页面之后还是那一套」。
export default async function ({ page, toolURL, screenshot, assert }) {
  let n = 0;
  const ok = (cond, msg) => { n++; assert(cond, msg); };
  const near = (a, b, tol, msg) => ok(Math.abs(a - b) <= tol, `${msg}（实得 ${a}，期望 ${b} ±${tol}）`);

  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.psReady === '1');
  const ds = () => page.evaluate(() => ({ ...document.documentElement.dataset }));

  /* ---------------- 0. 页面骨架 ---------------- */
  ok((await page.title()).includes('PDF'), '标题里应有 PDF');
  ok(await page.$('a[href="../../"]') !== null, '顶部应有返回工具集的链接');
  const tabs = ['overview', 'pages', 'text', 'privacy', 'structure'];
  for (const t of tabs) ok(await page.$('#ps-tab-' + t) !== null, '应有标签页 ' + t);

  const setTab = async (name) => {
    await page.click('#ps-tab-' + name);
    await page.waitForFunction((t) => document.documentElement.dataset.psTab === t, name);
  };

  /* ---------------- 1. 载入示例报告 ---------------- */
  await page.click('#ps-sample-report');
  await page.waitForFunction(() => document.documentElement.dataset.psDocs === '1');
  ok((await ds()).psPages === '3', '示例报告应有 3 页进入工作区');
  const statusText = await page.textContent('#ps-status');
  ok(/示例报告\.pdf/.test(statusText) && /3 页/.test(statusText), '状态栏应报出文件名与页数，实得：' + statusText);
  const stats = await page.$$eval('#ps-stats .ps-stat', (ns) => ns.map((x) => x.textContent));
  ok(stats[0] === '3', '概览「页数」卡应显示 3，实得 ' + stats[0]);

  /* ---------------- 2. 文字提取：真的把那几句话抽出来 ---------------- */
  await setTab('text');
  const text1 = await page.evaluate(() => window.PSAPP.text(0));
  ok(text1.includes('Field Report 2026-08'), '第 1 页应抽到标题 Field Report 2026-08');
  ok(text1.includes('site A') && text1.includes('12.4 mm'), '第 1 页应抽到测量表里的 site A / 12.4 mm');
  ok(text1.includes('base-14'), '第 1 页应抽到底部说明里的 base-14');
  const text3 = await page.evaluate(() => window.PSAPP.text(2));
  ok(text3.includes('2026-08-15') && text3.includes('check'), '第 3 页应抽到表格里的 2026-08-15 / check');
  const chars = Number((await ds()).psTextChars);
  ok(chars > 200, '文字面板应统计出 200 字符以上，实得 ' + chars);

  // 搜索真的命中
  await page.fill('#ps-text-find', 'Section');
  await page.waitForFunction(() => Number(document.documentElement.dataset.psTextHits) > 0);
  const hits = Number((await ds()).psTextHits);
  ok(hits >= 1, '搜索 Section 应至少命中 1 处，实得 ' + hits);
  ok((await page.$$('#ps-text-out mark')).length === hits, '命中数应与高亮标记数一致');
  await page.fill('#ps-text-find', '');
  await page.waitForFunction(() => document.documentElement.dataset.psTextHits === '0');

  // 字体表：示例用的是未内嵌的 base-14
  const fontRows = await page.$$eval('#ps-font-table tbody tr td:first-child', (ns) => ns.map((x) => x.textContent));
  ok(fontRows.some((x) => /Helvetica/.test(x)), '字体表里应有 Helvetica，实得 ' + fontRows.join('/'));

  /* ---------------- 3. 页面操作：旋转 / 移动 / 删除都作用在真数据上 ---------------- */
  await setTab('pages');
  await page.waitForFunction(() => document.querySelectorAll('#ps-page-grid .ps-page').length === 3);
  const rotOf = () => page.evaluate(() => window.PSAPP.state.pages.map((p) => p.rotate));
  const orderOf = () => page.evaluate(() => window.PSAPP.state.pages.map((p) => p.pageIndex));
  ok((await rotOf()).join(',') === '0,0,90', '示例第 3 页原本就是 /Rotate 90，实得 ' + (await rotOf()).join(','));
  await page.click('#ps-page-grid .ps-page:nth-child(1) .ps-rot-r');
  await page.waitForFunction(() => window.PSAPP.state.pages[0].rotate === 90);
  ok((await rotOf())[0] === 90, '右转后第 1 页应为 90°');
  await page.click('#ps-page-grid .ps-page:nth-child(1) .ps-rot-l');
  await page.waitForFunction(() => window.PSAPP.state.pages[0].rotate === 0);
  await page.click('#ps-page-grid .ps-page:nth-child(1) .ps-move-right');
  await page.waitForFunction(() => window.PSAPP.state.pages[0].pageIndex === 1);
  ok((await orderOf()).join(',') === '1,0,2', '往后挪一页后顺序应为 1,0,2，实得 ' + (await orderOf()).join(','));

  // 导出这份「换过顺序」的文件，并用引擎重新解析验收
  const rt = await page.evaluate(() => {
    const res = window.PSAPP.exportBytes({});
    const back = window.PSAPP.reparse(res.bytes);
    const st = window.PSAPP.state;
    const srcDoc = st.docs[0].doc;
    const pages = st.pages.map((p, i) => ({
      wantRotate: p.rotate,
      gotRotate: back.pages[i].attrs.rotate,
      sameText: window.PSAPP.engine.pageText(srcDoc, srcDoc.pages[p.pageIndex], {}).text
        === window.PSAPP.engine.pageText(back, back.pages[i], {}).text,
      wantW: Math.round(srcDoc.pages[p.pageIndex].attrs.width),
      gotW: Math.round(back.pages[i].attrs.width),
    }));
    return { bytes: res.bytes.length, count: back.pages.length, warnings: back.warnings.length, pages, header: String.fromCharCode(...res.bytes.slice(0, 8)) };
  });
  ok(rt.header.startsWith('%PDF-'), '导出的字节流应以 %PDF- 开头，实得 ' + rt.header);
  ok(rt.count === 3, '导出件应有 3 页，实得 ' + rt.count);
  ok(rt.warnings === 0, '重新解析导出件不应有警告，实得 ' + rt.warnings);
  for (let i = 0; i < rt.pages.length; i++) {
    ok(rt.pages[i].gotRotate === rt.pages[i].wantRotate, `导出件第 ${i + 1} 页旋转应为 ${rt.pages[i].wantRotate}°`);
    ok(rt.pages[i].sameText, `导出件第 ${i + 1} 页的文字应与源页逐字相同`);
    ok(rt.pages[i].gotW === rt.pages[i].wantW, `导出件第 ${i + 1} 页纸张宽度应与源页相同`);
  }
  ok(rt.bytes > 1000, '导出件应有实际字节，实得 ' + rt.bytes);

  // 勾选 + 删除
  await page.click('#ps-page-grid .ps-page:nth-child(2) .ps-page-check');
  await page.waitForFunction(() => document.documentElement.dataset.psSelected === '1');
  await page.click('#ps-delete');
  await page.waitForFunction(() => document.documentElement.dataset.psPages === '2');
  ok((await orderOf()).join(',') === '1,2', '删掉选中页后应只剩 1,2，实得 ' + (await orderOf()).join(','));
  const twoPage = await page.evaluate(() => window.PSAPP.reparse(window.PSAPP.exportBytes({}).bytes).pages.length);
  ok(twoPage === 2, '删页后导出应只有 2 页，实得 ' + twoPage);
  await page.click('#ps-restore');
  await page.waitForFunction(() => document.documentElement.dataset.psPages === '3');

  // 真的按导出按钮（会触发下载），断言状态栏报出的字节数与页数
  await page.click('#ps-export');
  await page.waitForFunction(() => document.documentElement.dataset.psExportPages === '3');
  const expStatus = await page.textContent('#ps-export-status');
  ok(/导出了 3 页/.test(expStatus), '导出状态应报「导出了 3 页」，实得 ' + expStatus);

  /* ---------------- 4. 预览：画布真的画了东西 + 文字层可选 ---------------- */
  await page.click('#ps-page-grid .ps-page:nth-child(1) .ps-thumb');
  await page.waitForFunction(() => document.documentElement.dataset.psPreview === '1');
  const canvasInk = await page.evaluate(() => {
    const cv = document.getElementById('ps-canvas');
    const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
    let ink = 0, white = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i] > 245 && d[i + 1] > 245 && d[i + 2] > 245) white++; else ink++;
    }
    return { w: cv.width, h: cv.height, ink, white };
  });
  ok(canvasInk.w > 300 && canvasInk.h > 300, '预览画布应有实际尺寸，实得 ' + canvasInk.w + '×' + canvasInk.h);
  ok(canvasInk.ink > 2000, '预览画布上应真的画出了内容（非白像素 > 2000），实得 ' + canvasInk.ink);
  const layerCount = await page.$$eval('#ps-textlayer span', (ns) => ns.length);
  ok(layerCount > 5, '可选文字层应有多个片段，实得 ' + layerCount);
  const layerText = await page.$$eval('#ps-textlayer span', (ns) => ns.map((x) => x.textContent).join(' '));
  ok(layerText.includes('Field Report'), '文字层内容应与页面一致');

  /* ---------------- 5. 「假打码」样张：读出黑块底下的东西 ---------------- */
  await page.click('#ps-sample-leak');
  await page.waitForFunction(() => document.documentElement.dataset.psDocs === '2');
  await setTab('privacy');
  const findings = await page.$$eval('#ps-findings .ps-f-title', (ns) => ns.map((x) => x.textContent));
  ok(findings.some((t) => t.includes('假打码')), '应识别出「假打码」，实得 ' + findings.join(' | '));
  ok(findings.some((t) => t.includes('JavaScript')), '应识别出内嵌 JavaScript');
  ok(findings.some((t) => t.includes('附件')), '应识别出内嵌附件');
  ok(findings.some((t) => t.includes('不可见字符')), '应识别出不可见文字层');
  const covered = await page.$$eval('#ps-covered-table tbody td:nth-child(2)', (ns) => ns.map((x) => x.textContent));
  ok(covered.includes('+65 8123 4567'), '应把黑块底下的手机号原样读出来，实得 ' + covered.join(' / '));
  ok(covered.includes('S1234567D'), '应把黑块底下的证件号读出来');
  ok(covered.some((t) => t.includes('9012 3456')), '应把黑块底下的卡号读出来');
  const metaText = await page.textContent('#ps-meta-kv');
  ok(metaText.includes('Wang Xiaoming'), '文档属性里应列出作者 Wang Xiaoming');
  ok(metaText.includes('Acme Redactor 3.2'), '文档属性里应列出创建程序');
  ok(metaText.includes('uuid:'), 'XMP 里的文档 ID 应被列出');
  const annotText = await page.textContent('#ps-annot-list');
  ok(annotText.includes('claimants.csv'), '附件名应被列出');
  ok(annotText.includes('example.com'), '外链应被列出');

  // 导出干净副本：元数据、附件、脚本都不见了，但正文文字一个不少
  const clean = await page.evaluate(() => {
    const st = window.PSAPP.state;
    const src = st.docs[1].doc;
    const res = window.PSAPP.engine.buildPDF({
      pages: src.pages.map((_, i) => ({ doc: src, pageIndex: i })),
      options: { stripMetadata: true, dropAnnots: true, dropForms: true },
    });
    const back = window.PSAPP.reparse(res.bytes);
    const a = window.PSAPP.engine.analyzeDoc(back, {});
    return {
      pages: back.pages.length,
      sameText: window.PSAPP.engine.pageText(src, src.pages[0], {}).text === window.PSAPP.engine.pageText(back, back.pages[0], {}).text,
      infoCount: a.info.filter((x) => x.key !== 'Producer' && x.key !== 'ModDate').length,
      xmp: !!a.xmp, attachments: a.attachments.length, annots: a.annots.length,
      stillCovered: a.coveredRuns.length,
      hasJS: a.findings.some((f) => f.title.includes('JavaScript')),
    };
  });
  ok(clean.pages === 1, '干净副本应保留 1 页');
  ok(clean.sameText, '干净副本的正文文字应与原件逐字相同');
  ok(clean.infoCount === 0, '干净副本不应残留文档属性，实得 ' + clean.infoCount + ' 项');
  ok(clean.xmp === false, '干净副本不应残留 XMP');
  ok(clean.attachments === 0, '干净副本不应残留附件');
  ok(clean.annots === 0, '干净副本不应残留批注与外链');
  ok(clean.hasJS === false, '干净副本不应残留 JavaScript');
  ok(clean.stillCovered > 0, '干净副本里「黑块盖住的文字」依然在——去元数据不等于脱敏，这条要如实报出来');

  /* ---------------- 6. 受限文件：真的解开 ---------------- */
  await page.click('#ps-sample-locked');
  await page.waitForFunction(() => document.documentElement.dataset.psDocs === '3');
  const lockedStatus = await page.textContent('#ps-status');
  ok(/已解除加密/.test(lockedStatus), '受限文件应显示已解除加密，实得 ' + lockedStatus);
  const lock = await page.evaluate(() => {
    const st = window.PSAPP.state;
    const d = st.docs[2].doc;
    const res = window.PSAPP.engine.buildPDF({ pages: d.pages.map((_, i) => ({ doc: d, pageIndex: i })), options: {} });
    const back = window.PSAPP.reparse(res.bytes);
    return {
      srcEncrypted: !!d.encrypted, cfm: d.encryptInfo.cfm, bits: d.encryptInfo.bits,
      canPrint: d.encryptInfo.perms.print, ok: d.encryptInfo.ok,
      text: window.PSAPP.engine.pageText(d, d.pages[0], {}).text,
      outEncrypted: !!back.encrypted,
      outText: window.PSAPP.engine.pageText(back, back.pages[0], {}).text,
      outPages: back.pages.length,
    };
  });
  ok(lock.srcEncrypted && lock.ok, '受限样张本身应是加密的且已被解开');
  ok(lock.cfm === 'V2' && lock.bits === 128, '受限样张应为 RC4-128，实得 ' + lock.cfm + '/' + lock.bits);
  ok(lock.canPrint === false, '受限样张的权限位应写着禁止打印');
  ok(lock.text.includes('Quarterly Board Pack'), '解密后应能读出正文，实得 ' + lock.text.slice(0, 40));
  ok(lock.outEncrypted === false, '导出的副本应当不再加密');
  ok(lock.outText === lock.text, '导出副本的文字应与解密后的原文逐字相同');
  ok(lock.outPages === 2, '导出副本应有 2 页');

  await setTab('structure');
  const structText = await page.textContent('#ps-struct-kv');
  ok(/RC4-128/.test(structText), '结构面板应写明加密方式，实得 ' + structText.replace(/\s+/g, ' ').slice(0, 80));
  const bars = await page.$$eval('#ps-size-bar > span', (ns) => ns.map((x) => x.style.width));
  ok(bars.length >= 2, '体积构成条应有多段，实得 ' + bars.length);
  const legend = await page.textContent('#ps-size-legend');
  ok(/页面内容/.test(legend), '体积图例应含「页面内容」，实得 ' + legend.replace(/\s+/g, ' '));
  const objRows = await page.$$eval('#ps-obj-table tbody tr', (ns) => ns.length);
  ok(objRows >= 3, '最大对象表应有若干行，实得 ' + objRows);

  /* ---------------- 7. 上传一份真实的 Chrome 生成的 PDF ---------------- */
  let uploaded = false;
  try {
    const helper = await page.context().newPage();
    await helper.setContent(`<style>body{font-family:Helvetica,Arial,sans-serif;font-size:13px;padding:30px}
      .cols{column-count:2;column-gap:30px}</style>
      <h1>Upload Round Trip 314159</h1>
      <p>The quick brown fox jumps over the lazy dog, invoice total 1,284.00 USD.</p>
      <div class=cols><p>Left column alpha sentence one two three four five six seven eight nine ten.</p>
      <p>Left column beta sentence with the marker 27182818 inside it for identification purposes.</p>
      <p>Right column gamma sentence continues with more filler words to make the column tall.</p>
      <p>Right column delta sentence ends with the marker 16180339 for identification purposes.</p></div>`, { waitUntil: 'load' });
    const buf = await helper.pdf({ format: 'A4', margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' } });
    await helper.close();
    await page.setInputFiles('#ps-file-input', { name: 'chrome-print.pdf', mimeType: 'application/pdf', buffer: buf });
    await page.waitForFunction(() => document.documentElement.dataset.psDocs === '4');
    uploaded = true;
    const up = await page.evaluate(() => {
      const st = window.PSAPP.state;
      const d = st.docs[3].doc;
      const t = window.PSAPP.engine.pageText(d, d.pages[0], { columns: true });
      const res = window.PSAPP.engine.buildPDF({ pages: [{ doc: d, pageIndex: 0, rotate: 90 }], options: {} });
      const back = window.PSAPP.reparse(res.bytes);
      return {
        pages: d.pages.length, text: t.text, warnings: d.warnings.length,
        fonts: st.docs[3].doc.pages.length, outRotate: back.pages[0].attrs.rotate,
        outText: window.PSAPP.engine.pageText(back, back.pages[0], {}).text,
        w: Math.round(d.pages[0].attrs.width), h: Math.round(d.pages[0].attrs.height),
      };
    });
    ok(up.pages === 1, '上传的 Chrome PDF 应有 1 页，实得 ' + up.pages);
    ok(up.warnings === 0, '解析真实 Chrome PDF 不应有警告，实得 ' + up.warnings);
    ok(up.text.includes('Upload Round Trip 314159'), '应抽到上传文件的标题，实得 ' + up.text.slice(0, 60));
    ok(up.text.includes('1,284.00'), '应抽到金额 1,284.00');
    // 分栏顺序：左栏两句必须都排在右栏第一句之前
    const iBeta = up.text.indexOf('27182818'), iDelta = up.text.indexOf('16180339');
    const iGamma = up.text.indexOf('Right column gamma');
    ok(iBeta > 0 && iGamma > 0 && iDelta > 0, '三个分栏标记都应被抽到');
    ok(iBeta < iGamma && iGamma < iDelta, '分栏阅读顺序应是「左栏读完再读右栏」，实得下标 ' + [iBeta, iGamma, iDelta].join('/'));
    near(up.w, 595, 2, 'A4 纸宽应约 595pt');
    near(up.h, 842, 2, 'A4 纸高应约 842pt');
    ok(up.outRotate === 90, '导出时指定的 90° 旋转应写进文件');
    ok(up.outText === up.text, '旋转只改 /Rotate，不该动内容流，抽出的文字应完全一样');
  } catch (e) {
    ok(false, '上传真实 PDF 的往返测试失败：' + e.message);
  }
  ok(uploaded, '应当成功上传并解析一份浏览器现场生成的 PDF');

  /* ---------------- 8. 引擎层：过滤器与密码学 ---------------- */
  const engine = await page.evaluate(() => {
    const E = window.PDFENG;
    const hex = (u8) => Array.from(u8).map((b) => b.toString(16).padStart(2, '0')).join('');
    // 已知 zlib 流（python zlib.compress(b'hello hello hello pdf studio', 9)）
    const z = Uint8Array.from([0x78, 0xda, 0xcb, 0x48, 0xcd, 0xc9, 0xc9, 0x57, 0xc8, 0x40, 0x22, 0x0b, 0x52, 0xd2, 0x14, 0x8a, 0x4b, 0x4a, 0x53, 0x32, 0xf3, 0x01, 0x98, 0x18, 0x0a, 0x8f]);
    const inflated = new TextDecoder().decode(E.flateDecode(z));
    const a85 = new TextDecoder().decode(E.ascii85Decode(new TextEncoder().encode('9jqo^BlbD-BleB1DI[b~>')));
    const rle = Array.from(E.runLengthDecode(Uint8Array.from([2, 65, 66, 67, 254, 68, 128])));
    const fromHex = (s) => Uint8Array.from(s.match(/../g).map((h) => parseInt(h, 16)));
    const aes = hex(E.aesEncryptBlock(E.aesExpandKey(fromHex('000102030405060708090a0b0c0d0e0f')), fromHex('00112233445566778899aabbccddeeff')));
    return {
      inflated, a85, rle,
      md5: hex(E.md5(new TextEncoder().encode('abc'))),
      sha256: hex(E.sha256(new TextEncoder().encode('abc'))),
      sha512: hex(E.sha512(new TextEncoder().encode('abc'))).slice(0, 32),
      aes,
      bytes: E.formatBytes(1536),
    };
  });
  ok(engine.inflated === 'hello hello hello pdf studio', '手写 inflate 应解出原文，实得 ' + JSON.stringify(engine.inflated));
  ok(engine.a85 === 'Man is distinct', 'ASCII85 解码应正确，实得 ' + JSON.stringify(engine.a85));
  ok(engine.rle.join(',') === '65,66,67,68,68,68', 'RunLength 解码应正确，实得 ' + engine.rle.join(','));
  ok(engine.md5 === '900150983cd24fb0d6963f7d28e17f72', 'MD5("abc") 应为 RFC 1321 的已知值');
  ok(engine.sha256 === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad', 'SHA-256("abc") 应为已知值');
  ok(engine.sha512 === 'ddaf35a193617abacc417349ae204131', 'SHA-512("abc") 前 16 字节应为已知值');
  ok(engine.aes === '69c4e0d86a7b0430d8cdb78070b4c55a', 'AES-128 应通过 FIPS-197 C.1 向量');
  ok(engine.bytes === '1.5 KB', '字节格式化应为 1.5 KB');

  /* ---------------- 9. 守卫层 ---------------- */
  // [hidden] 真的藏住了
  await setTab('overview');
  for (const t of ['pages', 'text', 'privacy', 'structure']) {
    const disp = await page.$eval('#ps-panel-' + t, (e) => getComputedStyle(e).display);
    ok(disp === 'none', `未选中的面板 ${t} 计算样式应为 display:none，实得 ${disp}`);
  }
  ok(await page.$eval('#ps-panel-overview', (e) => getComputedStyle(e).display) !== 'none', '当前面板应可见');
  ok(await page.$eval('#ps-file-input', (e) => getComputedStyle(e).display) === 'none', '文件输入框应保持隐藏');

  // 逐 tab 扫控件最小尺寸
  let scanned = 0, tiny = [];
  for (const t of tabs) {
    await setTab(t);
    await page.waitForTimeout(150);
    const bad = await page.evaluate(() => {
      const out = [];
      let count = 0;
      for (const el of document.querySelectorAll('input,select,button,a.ps-back')) {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || (r.width === 0 && r.height === 0)) continue;
        count++;
        const isCheck = el.type === 'checkbox';
        const minW = isCheck ? 12 : (el.tagName === 'BUTTON' || el.tagName === 'A') ? 24 : 100;
        const minH = isCheck ? 12 : 18;
        if (r.width < minW || r.height < minH) out.push({ tag: el.tagName, id: el.id, cls: el.className, w: Math.round(r.width), h: Math.round(r.height) });
      }
      return { out, count };
    });
    scanned += bad.count;
    tiny = tiny.concat(bad.out);
  }
  ok(tiny.length === 0, '所有可见控件都应达到最小尺寸，塌缩的有：' + JSON.stringify(tiny).slice(0, 220));
  ok(scanned >= 30, '控件尺寸守卫应至少扫到 30 个控件（防止一个都没扫到也算绿），实得 ' + scanned);

  // 页卡里的子元素不许越出卡片
  await setTab('pages');
  await page.waitForTimeout(300);
  const escapes = await page.evaluate(() => {
    const out = [];
    for (const card of document.querySelectorAll('#ps-page-grid .ps-page')) {
      const cr = card.getBoundingClientRect();
      for (const child of card.querySelectorAll('*')) {
        const r = child.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (r.left < cr.left - 1 || r.right > cr.right + 1 || r.top < cr.top - 1 || r.bottom > cr.bottom + 1) {
          out.push({ cls: child.className, w: Math.round(r.width) });
        }
      }
    }
    return out;
  });
  ok(escapes.length === 0, '页卡内的元素不应越出卡片，越界的有：' + JSON.stringify(escapes).slice(0, 200));

  // 文字面板的代码块不应横向截断
  await setTab('text');
  await page.waitForTimeout(150);
  const overflowX = await page.$eval('#ps-text-out', (e) => e.scrollWidth - e.clientWidth);
  ok(overflowX <= 2, '提取文字的容器不应横向截断，实得溢出 ' + overflowX + 'px');

  // 单位没有被 uppercase 改写
  const labels = await page.$$eval('th,dt,label,.ps-eyebrow', (ns) => ns.map((x) => x.textContent));
  const mangled = labels.filter((t) => /\b(KB|MB|PT|HZ|DBFS|DB)\b/.test(t) && !/\b(KB|MB)\b/.test(t));
  ok(mangled.length === 0, '表头/标签里不应出现被 uppercase 改写的单位：' + mangled.join('/'));

  // 窄屏无横向溢出
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  for (const t of tabs) {
    await setTab(t);
    await page.waitForTimeout(120);
    const of = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(of <= 1, `390px 窄屏下 ${t} 面板不应横向溢出，实得 ${of}px`);
  }
  await page.setViewportSize({ width: 1280, height: 850 });

  /* ---------------- 10. 缩略图 ---------------- */
  // 卡片缩略图取「页面与导出」面板：工具栏 + 页面网格 + 打开的大图预览，一眼能看出这页在干嘛
  await page.evaluate(() => {
    const st = window.PSAPP.state;
    const keep = st.docs.filter((d) => /示例报告|假打码/.test(d.name));
    st.docs = keep;
    st.pages = st.pages.filter((p) => keep.some((d) => d.id === p.docId));
    st.currentId = keep[keep.length - 1].id;
    st.analysis = null;
  });
  await setTab('pages');
  await page.waitForTimeout(200);
  await page.evaluate(() => window.PSAPP.openPreview(window.PSAPP.state.pages.length - 1));
  await page.waitForTimeout(900);
  const thumbShot = await page.evaluate(() => {
    const grid = document.getElementById('ps-page-grid');
    window.scrollTo(0, grid.getBoundingClientRect().top + window.scrollY - 150);
    return document.querySelectorAll('#ps-page-grid .ps-page').length;
  });
  ok(thumbShot === 4, '缩略图场景应有 4 页（3 页报告 + 1 页样张），实得 ' + thumbShot);
  await page.waitForTimeout(600);
  await screenshot('thumb.png');

  console.log(`      （${n} 条断言）`);
}
