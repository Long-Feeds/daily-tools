// 截图工作台 · Shot Studio 集成测试
//
// 三层断言:
//  1) 真实产物层 —— 检测框真的落在样例截图的文字行上;打码之后那块像素真的变了、别处一个字节没动;
//     撤销之后逐像素回到原图;反卷积实验的相关系数真的回升(模糊)/ 真的不回升(马赛克)。
//  2) 交互层 —— 真的用鼠标拖出方框/箭头/画笔,点出文字与序号,切标签页、换示例、改参数。
//  3) 守卫层 —— [hidden] 的计算样式、逐 tab 控件最小尺寸、子元素不越出父格、无横向溢出、
//     无 text-transform、无描边字形,以及导出画布的真实尺寸与像素。
//
// 引擎(Sobel / 大津 / 连通域 / 高斯 / RL 反卷积 / 像素化)已在离线阶段与 scipy.ndimage 随机对拍
// 930 组逐值一致,这里只测「装进页面之后还是那一套」。
export default async function ({ page, toolURL, screenshot, assert }) {
  let n = 0;
  const ok = (cond, msg) => { n++; assert(cond, msg); };
  const near = (a, b, tol, msg) => ok(Math.abs(a - b) <= tol, msg + '(实得 ' + a + ',期望 ' + b + ' ±' + tol + ')');

  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.ssReady === '1');

  const S = () => page.evaluate(() => ({
    W: window.SS.S.W, H: window.SS.S.H,
    layers: window.SS.S.layers.map((l) => ({ id: l.id, type: l.type, mode: l.mode, block: l.block, sigma: l.sigma, x: l.x, y: l.y, w: l.w, h: l.h, x0: l.x0, y0: l.y0, x1: l.x1, y1: l.y1, text: l.text, num: l.num, size: l.size, pts: l.pts ? l.pts.length : 0, color: l.color, grade: l.grade })),
    lines: window.SS.S.detect.lines.length,
    masked: window.SS.S.maskedLines.size,
    sel: window.SS.S.sel
  }));
  const lineBoxes = () => page.evaluate(() => window.SS.S.detect.lines.map((L) => ({ x: L.x, y: L.y, w: L.w, h: L.h, gh: L.gh, words: L.words.length })));
  // 同一块区域:原图 vs 打码后的画布,逐像素比较
  const diffIn = (box) => page.evaluate((b) => {
    window.SS.rebuild();
    const base = window.SS.S.base.getContext('2d').getImageData(b.x, b.y, b.w, b.h).data;
    const flat = window.SS.flat.getContext('2d').getImageData(b.x, b.y, b.w, b.h).data;
    let diff = 0;
    for (let i = 0; i < base.length; i += 4) {
      if (Math.abs(base[i] - flat[i]) > 4 || Math.abs(base[i + 1] - flat[i + 1]) > 4 || Math.abs(base[i + 2] - flat[i + 2]) > 4) diff++;
    }
    return { diff, total: base.length / 4 };
  }, box);
  const at = async (ix, iy) => page.evaluate(([x, y]) => {
    const cv = document.getElementById('ss-canvas');
    const r = cv.getBoundingClientRect();
    const k = parseFloat(cv.dataset.scale) || 1;
    return { x: r.left + x * k, y: r.top + y * k };
  }, [ix, iy]);
  const dragOn = async (x0, y0, x1, y1) => {
    await page.locator('#ss-canvas').scrollIntoViewIfNeeded();
    const a = await at(x0, y0), b = await at(x1, y1);
    await page.mouse.move(a.x, a.y);
    await page.mouse.down();
    await page.mouse.move((a.x + b.x) / 2, (a.y + b.y) / 2, { steps: 4 });
    await page.mouse.move(b.x, b.y, { steps: 4 });
    await page.mouse.up();
  };
  const clickOn = async (x, y) => {
    await page.locator('#ss-canvas').scrollIntoViewIfNeeded();
    const p = await at(x, y);
    await page.mouse.click(p.x, p.y);
  };
  const tab = async (name) => {
    await page.click('#ss-tab-' + name);
    await page.waitForFunction((t) => !document.getElementById('ss-panel-' + t).hidden, name);
  };

  /* ═════════ 1. 页面骨架 ═════════ */
  ok((await page.title()).includes('截图工作台'), '标题含「截图工作台」');
  ok(await page.getAttribute('.ss-back', 'href') === '../../', '顶部有指向工具集首页的返回链接');
  ok((await page.textContent('.ss-hero h1')).length > 6, '英雄区标题非空');

  /* ═════════ 2. 默认示例 + 文字行检测 ═════════ */
  let s = await S();
  ok(s.W === 900 && s.H === 560, '默认载入 900×560 的订单示例(实得 ' + s.W + '×' + s.H + ')');
  ok(s.lines >= 14, '在订单示例上检测出 ' + s.lines + ' 行文字(下界 14)');
  ok(s.layers.length === 0, '刚载入时没有任何图层');

  const rowCount = await page.locator('#ss-lines .ss-item').count();
  ok(rowCount === s.lines, '侧栏行列表条数(' + rowCount + ')与检测结果(' + s.lines + ')一致');
  const statusText = await page.textContent('#ss-detect-status');
  ok(/找到 \d+ 行 \/ \d+ 个词块/.test(statusText), '检测状态栏给出行数与词块数:「' + statusText + '」');

  const boxes = await lineBoxes();
  // 手机号那一行:值列 x≈148 起,基线 y=175 ⇒ 框大致落在 y 160..180
  const phoneIdx = boxes.findIndex((b) => b.x >= 130 && b.x <= 200 && b.y >= 155 && b.y <= 180);
  ok(phoneIdx >= 0, '「手机号码 138 2946 5507」那一行被单独框出(x≈148,y≈160)');
  const phone = boxes[phoneIdx];
  ok(phone.w >= 80 && phone.w <= 260, '该行框宽 ' + phone.w + 'px,与一串手机号的宽度相称');
  ok(phone.gh >= 8 && phone.gh <= 20, '该行字高估计 ' + phone.gh + 'px(源码里就是 13.5px 字号)');
  ok(boxes.every((b) => b.x >= 0 && b.y >= 0 && b.x + b.w <= 900 && b.y + b.h <= 560), '所有检测框都落在画布内');
  // 表格三行商品:应各自成行,y 依次递增
  const ys = boxes.map((b) => b.y);
  ok(ys.every((y, i) => i === 0 || y >= ys[i - 1]), '行列表按 y 从上到下排序');

  /* ═════════ 3. 点一行 = 打码那一行(真的改像素) ═════════ */
  await page.locator('#ss-lines .ss-item').nth(phoneIdx).click();
  s = await S();
  ok(s.layers.filter((l) => l.type === 'redact').length === 1, '点一行之后多出 1 个脱敏图层');
  const red = s.layers.find((l) => l.type === 'redact');
  ok(red.mode === 'pixelate', '默认脱敏方式是马赛克');
  ok(red.block >= Math.round(phone.gh * 0.9), '格子 ' + red.block + 'px 按字高 ' + phone.gh + 'px 自动挑到了安全值');

  let d = await diffIn(phone);
  ok(d.diff / d.total > 0.5, '该行区域有 ' + (100 * d.diff / d.total).toFixed(0) + '% 的像素真的被改写(下界 50%)');
  const far = { x: 600, y: 420, w: 200, h: 60 };
  d = await diffIn(far);
  ok(d.diff === 0, '画面别处(x600,y420 的商品表)一个像素都没被动到');

  await page.locator('#ss-lines .ss-item').nth(phoneIdx).click();
  d = await diffIn(phone);
  ok(d.diff === 0, '再点一次取消打码,该区域逐像素回到原图');
  s = await S();
  ok(s.layers.length === 0 && s.masked === 0, '取消后脱敏图层被移除');

  /* ═════════ 4. 一键打码全部文字 + 体检 ═════════ */
  await page.click('#ss-mask-all');
  await page.waitForFunction(() => window.SS.S.layers.length > 0);
  s = await S();
  ok(s.masked === s.lines, '一键打码把全部 ' + s.lines + ' 行都标成已遮挡');
  const reds = s.layers.filter((l) => l.type === 'redact');
  ok(reds.length >= 1 && reds.length <= s.lines, '生成 ' + reds.length + ' 个脱敏块(相邻行框已合并,不多于行数 ' + s.lines + ')');

  let allCovered = true, minRatio = 1;
  for (const b of boxes) {
    const r = await diffIn(b);
    const ratio = r.diff / r.total;
    if (ratio < 0.35) allCovered = false;
    minRatio = Math.min(minRatio, ratio);
  }
  ok(allCovered, '检测到的每一行都被真正改写(最低一行也有 ' + (100 * minRatio).toFixed(0) + '% 像素变化)');
  ok(await page.getAttribute('html', 'data-ss-audit') === 'safe', '自动挑参数下,体检总评为「安全」');
  ok((await page.textContent('#ss-audit-overall')).includes('都够强'), '体检徽标文案:' + (await page.textContent('#ss-audit-overall')));
  const auditRows = await page.locator('#ss-audit tbody tr').count();
  ok(auditRows === 1, '全部达标时体检表收成 1 行汇总,而不是把 ' + reds.length + ' 行清一色的「安全」全铺出来');
  const auditText = await page.textContent('#ss-audit tbody');
  ok(auditText.includes('共 ' + reds.length + ' 块') && /最紧一块 \d+px \/ 建议 \d+px/.test(auditText), '汇总行给出块数与「最紧一块」的余量:「' + auditText.replace(/\s+/g, ' ').trim() + '」');
  const tight = /最紧一块 (\d+)px \/ 建议 (\d+)px/.exec(auditText);
  ok(tight && Number(tight[1]) >= Number(tight[2]), '最紧的一块(' + tight[1] + 'px)确实不小于它的建议值(' + tight[2] + 'px)—— 这正是判「全部达标」的依据');
  // 用 Range 数「这段文字实际排了几行」—— 单元格高度会被同一行的其它列带高,测不出本列有没有折行
  const auditLines = await page.evaluate(() => {
    const cells = Array.from(document.querySelectorAll('#ss-audit tbody tr')).map((tr) => tr.children[0]).filter((td) => td && td.textContent.trim());
    return cells.map((td) => { const r = document.createRange(); r.selectNodeContents(td); return r.getClientRects().length; });
  });
  ok(auditLines.length > 0 && auditLines.every((c) => c === 1), '体检表首列每一格都只排一行,没有被挤成折行(实得 ' + JSON.stringify(auditLines) + ')');

  await tab('export');
  const pre = await page.textContent('#ss-preflight');
  ok(pre.includes('全部被遮挡'), '导出前检查报「文字全部被遮挡」');
  ok(pre.includes('不含图层与 EXIF'), '导出前检查提示导出物不含图层与 EXIF');
  await tab('work');

  /* ═════════ 5. 撤销 / 重做 ═════════ */
  await page.click('#ss-undo');
  s = await S();
  ok(s.layers.filter((l) => l.type === 'redact').length === 0, '撤销之后脱敏块清零');
  d = await diffIn(phone);
  ok(d.diff === 0, '撤销之后画布逐像素回到原图');
  await page.click('#ss-redo');
  s = await S();
  ok(s.layers.filter((l) => l.type === 'redact').length === reds.length, '重做之后 ' + reds.length + ' 个脱敏块回来了');
  await page.click('#ss-mask-none');
  s = await S();
  ok(s.layers.length === 0, '「清除脱敏」清空所有脱敏块');

  /* ═════════ 6. 脱敏刷 + 强度不足要报危险 ═════════ */
  await page.uncheck('#ss-autoblock');
  await page.click('#ss-mode button[data-mode="blur"]');
  ok(await page.evaluate(() => getComputedStyle(document.getElementById('ss-row-sigma')).display) !== 'none', '切到模糊后 σ 滑杆显形');
  ok(await page.evaluate(() => getComputedStyle(document.getElementById('ss-row-block')).display) === 'none', '切到模糊后格子滑杆按 [hidden] 真的隐藏(计算样式为 none)');
  await page.locator('#ss-sigma').fill('2');
  await page.locator('#ss-sigma').dispatchEvent('input');
  await page.click('#ss-tool-redact');
  await dragOn(phone.x - 4, phone.y - 4, phone.x + phone.w + 4, phone.y + phone.h + 4);
  s = await S();
  const blurLayer = s.layers.find((l) => l.type === 'redact');
  ok(!!blurLayer && blurLayer.mode === 'blur', '用脱敏刷拖出的是一个模糊块');
  near(blurLayer.sigma, 2, 0.01, '关掉自动挑参数后,σ 用的是滑杆上的值');
  ok(await page.getAttribute('html', 'data-ss-audit') === 'danger', 'σ=2 相对 ' + phone.gh + 'px 的字高太弱,体检判「危险」');
  ok((await page.textContent('#ss-audit tbody')).includes('危险'), '体检表里那一行标着「危险」');
  d = await diffIn(phone);
  ok(d.diff / d.total > 0.5, '模糊同样真的改了像素(' + (100 * d.diff / d.total).toFixed(0) + '%)');

  await page.click('#ss-mask-none');
  await page.check('#ss-autoblock');
  await page.click('#ss-mode button[data-mode="pixelate"]');
  await page.click('#ss-tool-select');

  /* ═════════ 7. 标注工具:真的拖出图形 ═════════ */
  await page.click('#ss-tool-rect');
  await dragOn(120, 300, 320, 400);
  s = await S();
  let L = s.layers[s.layers.length - 1];
  ok(L.type === 'rect', '拖出了一个方框图层');
  near(L.x, 120, 6, '方框左边界'); near(L.y, 300, 6, '方框上边界');
  near(L.w, 200, 8, '方框宽'); near(L.h, 100, 8, '方框高');

  await page.click('#ss-tool-arrow');
  await dragOn(600, 120, 700, 200);
  s = await S();
  L = s.layers[s.layers.length - 1];
  ok(L.type === 'arrow', '拖出了一个箭头图层');
  near(L.x0, 600, 6, '箭头起点 x'); near(L.y1, 200, 6, '箭头终点 y');

  await page.click('#ss-tool-pen');
  await dragOn(200, 460, 400, 500);
  s = await S();
  L = s.layers[s.layers.length - 1];
  ok(L.type === 'pen' && L.pts >= 3, '画笔留下了 ' + L.pts + ' 个采样点');

  await page.click('#ss-tool-text');
  await clickOn(430, 250);
  ok(await page.evaluate(() => getComputedStyle(document.getElementById('ss-row-text')).display) !== 'none', '放下文字后,右侧「文字」输入框显形');
  await page.fill('#ss-text-input', '这里要打码');
  s = await S();
  L = s.layers.find((l) => l.type === 'text');
  ok(L && L.text === '这里要打码', '文字图层内容跟着输入框变成「这里要打码」');
  const textPix = await page.evaluate(() => {
    const cv = document.getElementById('ss-canvas');
    const k = parseFloat(cv.dataset.scale) || 1;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const c = cv.getContext('2d');
    const d = c.getImageData(Math.round(430 * k * dpr), Math.round(255 * k * dpr), Math.round(80 * k * dpr), Math.round(20 * k * dpr)).data;
    let white = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i] > 235 && d[i + 1] > 235 && d[i + 2] > 235) white++;
    return white / (d.length / 4);
  });
  ok(textPix > 0.3, '文字图层在画布上真的画出来了(白色衬底覆盖了 ' + (100 * textPix).toFixed(0) + '% 采样区)');

  await page.click('#ss-tool-badge');
  await clickOn(500, 330);
  await clickOn(560, 330);
  s = await S();
  const badges = s.layers.filter((l) => l.type === 'badge');
  ok(badges.length === 2 && badges[0].num === 1 && badges[1].num === 2, '序号徽标自增:1、2');

  await page.click('#ss-tool-hl');
  await dragOn(60, 120, 300, 145);
  s = await S();
  ok(s.layers[s.layers.length - 1].type === 'hl', '高亮块已添加');

  const beforeDel = (await S()).layers.length;
  await page.click('#ss-tool-select');
  await clickOn(180, 132);      // 点在高亮块上
  s = await S();
  ok(s.sel !== null, '选择工具点中了一个图层');
  await page.click('#ss-del');
  s = await S();
  ok(s.layers.length === beforeDel - 1, '「删除选中」把图层数从 ' + beforeDel + ' 减到 ' + s.layers.length);

  const layerRows = await page.locator('#ss-layers .ss-item').count();
  ok(layerRows === s.layers.length, '图层列表条数与图层数一致(' + layerRows + ')');
  ok((await page.textContent('#ss-layer-count')) === String(s.layers.length), '图层计数徽标同步');

  /* ═════════ 8. 缩放 ═════════ */
  await page.selectOption('#ss-zoom', '1');
  const cssW = await page.evaluate(() => document.getElementById('ss-canvas').style.width);
  ok(cssW === '900px', '选 100% 时画布 CSS 宽度等于图片像素宽(实得 ' + cssW + ')');
  await page.selectOption('#ss-zoom', 'fit');

  /* ═════════ 9. 导出:真实合成画布 ═════════ */
  await tab('export');
  let dims = await page.evaluate(() => { const c = window.SS.composite(1); return [c.width, c.height]; });
  ok(dims[0] === 900 && dims[1] === 560, '无衬底时导出画布 = 原图尺寸(实得 ' + dims.join('×') + ')');
  await page.click('#ss-bg button[data-bg="grad"]');
  dims = await page.evaluate(() => { const c = window.SS.composite(1); return [c.width, c.height]; });
  ok(dims[0] === 900 + 96 && dims[1] === 560 + 96, '渐变衬底 + 48px 留白后导出画布变成 ' + dims.join('×'));
  const corner = await page.evaluate(() => {
    const c = window.SS.composite(1);
    const d = c.getContext('2d').getImageData(3, 3, 1, 1).data;
    return [d[0], d[1], d[2]];
  });
  ok(corner[2] > 120 && corner[0] > 90, '左上角是渐变紫色而不是透明(rgb ' + corner.join(',') + ')');
  dims = await page.evaluate(() => { const c = window.SS.composite(2); return [c.width, c.height]; });
  ok(dims[0] === (900 + 96) * 2, '2× 倍率导出真的把像素翻倍(' + dims[0] + ')');
  const blobSize = await page.evaluate(() => new Promise((res) => {
    window.SS.composite(1).toBlob((b) => res(b ? b.size : 0), 'image/png');
  }));
  ok(blobSize > 8000, 'PNG 编码成功,' + (blobSize / 1024).toFixed(0) + ' KB');
  const pvW = await page.evaluate(() => document.getElementById('ss-preview').width);
  ok(pvW > 100, '预览画布已绘制(宽 ' + pvW + ')');
  await page.click('#ss-bg button[data-bg="none"]');

  /* ═════════ 10. 模糊还原实验:数字必须支持结论 ═════════ */
  await tab('lab');
  await page.click('#ss-lab-mode button[data-mode="blur"]');
  await page.locator('#ss-lab-strength').fill('3');
  await page.locator('#ss-lab-strength').dispatchEvent('input');
  await page.locator('#ss-lab-iters').fill('60');
  await page.locator('#ss-lab-iters').dispatchEvent('input');
  await page.evaluate(() => { delete document.documentElement.dataset.ssLab; });
  await page.click('#ss-lab-run');
  await page.waitForFunction(() => document.documentElement.dataset.ssLab !== undefined, null, { timeout: 60000 });
  const labBlur = JSON.parse(await page.getAttribute('html', 'data-ss-lab'));
  ok(labBlur.mode === 'blur', '实验跑的是高斯模糊路径');
  ok(labBlur.rec > labBlur.hid, '反卷积把与原图的相关系数从 ' + labBlur.hid.toFixed(3) + ' 拉到 ' + labBlur.rec.toFixed(3));
  ok(labBlur.closed > 0.4, 'σ=3 时反卷积追回了与原图差距的 ' + (labBlur.closed * 100).toFixed(0) + '%(下界 40%)—— 模糊确实能被还原');
  ok(await page.getAttribute('#ss-lab-verdict', 'data-level') === 'danger', '结论徽标判「模糊被逼回来了」');
  const labRows = await page.locator('#ss-lab-table tbody tr').count();
  ok(labRows === 4, '实验读数表列出 4 项(实得 ' + labRows + ')');

  await page.click('#ss-lab-mode button[data-mode="pixelate"]');
  await page.evaluate(() => { delete document.documentElement.dataset.ssLab; });
  await page.click('#ss-lab-run');
  await page.waitForFunction(() => document.documentElement.dataset.ssLab !== undefined, null, { timeout: 60000 });
  const labPix = JSON.parse(await page.getAttribute('html', 'data-ss-lab'));
  ok(labPix.mode === 'pixelate', '第二次跑的是马赛克路径');
  ok(labPix.closed < 0.1, '同一套反卷积对马赛克几乎无效(只动了 ' + (labPix.closed * 100).toFixed(1) + '%,上界 10%)');
  ok(labPix.closed < labBlur.closed / 3, '马赛克的追回幅度不到模糊的三分之一,结论方向正确');
  ok(await page.getAttribute('#ss-lab-verdict', 'data-level') === 'safe', '马赛克路径的结论徽标是「安全」');
  const labCanvas = await page.evaluate(() => {
    const c = document.getElementById('ss-lab-rec');
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let mn = 255, mx = 0;
    for (let i = 0; i < d.length; i += 4) { mn = Math.min(mn, d[i]); mx = Math.max(mx, d[i]); }
    return { w: c.width, h: c.height, range: mx - mn };
  });
  ok(labCanvas.w === 640 && labCanvas.range > 40, '还原画布真的画了东西(尺寸 ' + labCanvas.w + ',灰度跨度 ' + labCanvas.range + ')');

  /* ═════════ 11. 深色示例:梯度法与明暗无关 ═════════ */
  await tab('work');
  await page.click('#ss-sample-term');
  await page.waitForFunction(() => window.SS.S.source.indexOf('终端') >= 0 && window.SS.S.detect.done);
  s = await S();
  ok(s.lines >= 12, '深色终端截图(白字黑底)同样检测出 ' + s.lines + ' 行文字');
  const termBoxes = await lineBoxes();
  ok(termBoxes.some((b) => b.y < 100 && b.x < 120), '顶部第一行命令也被框到');
  await page.click('#ss-mask-all');
  ok(await page.getAttribute('html', 'data-ss-audit') === 'safe', '深色图上一键打码同样通过体检');
  const termCover = await diffIn(termBoxes[3]);
  ok(termCover.diff / termCover.total > 0.4, '深色图上的密钥那几行也真的被改写了');

  await page.click('#ss-sample-chat');
  await page.waitForFunction(() => window.SS.S.source.indexOf('聊天') >= 0 && window.SS.S.detect.done);
  s = await S();
  ok(s.lines >= 8, '聊天记录示例检测出 ' + s.lines + ' 行(气泡内文字)');

  /* ═════════ 12. 守卫层 ═════════ */
  // 12.1 [hidden] 必须真的不显示
  const hiddenOK = await page.evaluate(() => {
    const ids = ['ss-panel-export', 'ss-panel-lab', 'ss-panel-doc'];
    return ids.every((id) => {
      const el = document.getElementById(id);
      return el.hidden && getComputedStyle(el).display === 'none';
    });
  });
  ok(hiddenOK, '三个非当前面板的计算样式都是 display:none(不是只把 hidden 属性设上)');

  // 12.2 逐 tab 扫控件最小尺寸
  let scanned = 0, tooSmall = [];
  for (const t of ['work', 'export', 'lab', 'doc']) {
    await tab(t);
    const r = await page.evaluate(() => {
      const bad = [];
      let cnt = 0;
      document.querySelectorAll('input,select,button').forEach((el) => {
        if (el.classList.contains('ss-sr') || el.closest('.ss-sr')) return;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') return;
        const b = el.getBoundingClientRect();
        if (b.width === 0 && b.height === 0) return;
        cnt++;
        const isCheck = el.type === 'checkbox';
        const isBtn = el.tagName === 'BUTTON';
        const minW = isCheck ? 18 : (isBtn ? 26 : 100);
        const minH = 18;
        if (b.width < minW - 0.5 || b.height < minH - 0.5) {
          bad.push((el.id || el.tagName) + ' ' + Math.round(b.width) + 'x' + Math.round(b.height));
        }
      });
      return { cnt, bad };
    });
    scanned += r.cnt;
    tooSmall = tooSmall.concat(r.bad);
  }
  ok(tooSmall.length === 0, '四个面板里没有被压塌的控件' + (tooSmall.length ? ':' + tooSmall.join(', ') : ''));
  ok(scanned >= 45, '控件尺寸守卫累计扫到 ' + scanned + ' 个控件(下界 45)');

  // 12.3 无 text-transform:uppercase(历史事故:单位符号被改写)
  await tab('work');
  const upper = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('th,dt,label,.ss-lab,.ss-num,.ss-tag').forEach((el) => {
      if (getComputedStyle(el).textTransform === 'uppercase') bad.push(el.textContent.slice(0, 12));
    });
    const txt = document.body.innerText;
    const wrong = /\b(HZ|KHZ|DBFS|PX|MS)\b/.test(txt);
    return { bad, wrong };
  });
  ok(upper.bad.length === 0, '没有任何标签用 text-transform:uppercase');
  ok(!upper.wrong, '页面上没有出现被大写化的单位(PX / MS / HZ)');

  // 12.4 列表项子元素不越出父格
  const overflowItems = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('#ss-lines li, #ss-layers li').forEach((li) => {
      const pb = li.getBoundingClientRect();
      li.querySelectorAll('*').forEach((c) => {
        const cb = c.getBoundingClientRect();
        if (cb.width === 0) return;
        if (cb.right > pb.right + 1 || cb.left < pb.left - 1) bad.push(c.className + ':' + Math.round(cb.right - pb.right));
      });
    });
    return bad;
  });
  ok(overflowItems.length === 0, '行列表 / 图层列表里没有子元素撑出格子' + (overflowItems.length ? ':' + overflowItems.slice(0, 3).join(', ') : ''));

  // 12.5 描边字形必须配 paint-order(历史事故:黑白棋子被描边糊成一样)
  const strokeOK = await page.evaluate(() => {
    const css = Array.from(document.querySelectorAll('style')).map((s) => s.textContent).join('');
    return !/-webkit-text-stroke/.test(css) || /paint-order/.test(css);
  });
  ok(strokeOK, '没用 -webkit-text-stroke(用了就必须配 paint-order)');

  // 12.6 横向溢出:宽屏与窄屏
  const ovWide = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok(ovWide <= 1, '1280px 下没有横向溢出(实得 ' + ovWide + 'px)');
  await page.setViewportSize({ width: 390, height: 900 });
  await page.waitForTimeout(120);
  const ovNarrow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok(ovNarrow <= 1, '390px 窄屏下没有横向溢出(实得 ' + ovNarrow + 'px)');
  const narrowTools = await page.evaluate(() => {
    const b = document.getElementById('ss-tool-redact').getBoundingClientRect();
    return { w: b.width, h: b.height };
  });
  ok(narrowTools.w >= 40 && narrowTools.h >= 40, '窄屏下工具按钮仍是可点的实心块(' + Math.round(narrowTools.w) + '×' + Math.round(narrowTools.h) + ')');
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.waitForTimeout(120);

  /* ═════════ 13. 收尾:摆一个好看的状态截图 ═════════ */
  await tab('work');
  await page.click('#ss-sample-order');
  await page.waitForFunction(() => window.SS.S.source.indexOf('订单') >= 0 && window.SS.S.detect.done);
  // 只挡真正敏感的四行(手机号 / 身份证 / 地址 / 银行卡),其余保持可读 —— 这才是这个工具日常的用法
  const finalBoxes = await lineBoxes();
  const sensitive = finalBoxes
    .map((b, i) => ({ b, i }))
    .filter(({ b }) => b.x >= 130 && ((b.y >= 155 && b.y <= 225) || (b.y >= 255 && b.y <= 285)));
  ok(sensitive.length >= 3, '订单示例里能挑出 ' + sensitive.length + ' 行敏感信息(手机/身份证/地址/卡号)');
  for (const { i } of sensitive) await page.locator('#ss-lines .ss-item').nth(i).click();
  s = await S();
  ok(s.layers.filter((l) => l.type === 'redact').length === sensitive.length, '逐行点选后正好有 ' + sensitive.length + ' 个脱敏块');
  const keepVisible = finalBoxes.find((b) => b.y > 400 && b.x < 200);
  if (keepVisible) {
    const untouched = await diffIn(keepVisible);
    ok(untouched.diff === 0, '没被点到的商品行仍然逐像素原样(这正是选择性打码的意义)');
  }
  await page.click('#ss-tool-arrow');
  await dragOn(600, 300, 430, 200);
  await page.click('#ss-tool-badge');
  await clickOn(742, 120);
  await page.click('#ss-tool-select');
  await clickOn(866, 46);          // 点空白处取消选中,免得缩略图里挂着选择框
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(() => window.SS.S.layers.length >= 3);
  s = await S();
  ok(s.layers.filter((l) => l.type === 'redact').length >= 1 && s.layers.some((l) => l.type === 'arrow'), '收尾状态:脱敏 + 箭头 + 序号都在');

  await page.evaluate(() => {
    const st = document.querySelector('.ss-stage');
    if (st) st.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(150);
  await screenshot('thumb.png');

  if (process.env.SS_SHOTS) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await screenshot('review-top.png');
    await page.evaluate(() => document.querySelector('.ss-side').scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(120);
    await screenshot('review-side.png');
    await tab('export');
    await page.evaluate(() => window.scrollTo(0, 240));
    await screenshot('review-export.png');
    await tab('lab');
    await page.click('#ss-lab-mode button[data-mode="blur"]');
    await page.evaluate(() => { delete document.documentElement.dataset.ssLab; });
    await page.click('#ss-lab-run');
    await page.waitForFunction(() => document.documentElement.dataset.ssLab !== undefined, null, { timeout: 60000 });
    await page.evaluate(() => window.scrollTo(0, 240));
    await screenshot('review-lab.png');
    await tab('doc');
    await page.evaluate(() => window.scrollTo(0, 240));
    await screenshot('review-doc.png');
    await tab('work');
    await page.click('#ss-sample-term');
    await page.waitForFunction(() => window.SS.S.detect.done);
    await page.click('#ss-mask-all');
    await page.evaluate(() => document.querySelector('.ss-stage').scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(120);
    await screenshot('review-term.png');
    await page.setViewportSize({ width: 390, height: 900 });
    await page.waitForTimeout(200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await screenshot('review-narrow.png');
    await page.evaluate(() => window.scrollTo(0, 700));
    await screenshot('review-narrow2.png');
    await page.setViewportSize({ width: 1280, height: 850 });
  }

  console.log('    (shot-studio: ' + n + ' 条断言)');
}
