// Integration test for 视觉工作台 · Vision Lab.
// 断言的是真实像素输出(Rec.709 亮度、Otsu 阈值往返、中值滤波真的把噪声块的标准差砍掉一半、
// 二值化只剩 0/255、流水线停用 = 原图哈希),而不是「元素在不在」;外加本站历次踩过的
// 结构性守卫:[hidden] 断计算样式、控件不被压塌、窄屏零横向溢出、canvas 标签不重叠、
// 原生控件不引入设计系统之外的强调色。
export default async ({ page, toolURL, screenshot, assert }) => {
  const text = (sel) => page.$eval(sel, (el) => el.textContent.trim());
  const display = (sel) => page.$eval(sel, (el) => getComputedStyle(el).display);
  const rect = (sel) => page.$eval(sel, (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height, top: r.top, left: r.left, right: r.right, bottom: r.bottom };
  });
  const num = (s) => { const m = String(s).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/); return m ? parseFloat(m[0]) : NaN; };

  // 绝不用固定等待:等流水线运行计数器前进(07-06 教训)
  const settle = async (fn) => {
    const before = await page.evaluate(() => document.body.dataset.runs || '0');
    await fn();
    await page.waitForFunction((b) => (document.body.dataset.runs || '0') !== b, before, { timeout: 25000 });
  };
  const setRange = (sel, v) => settle(() => page.$eval(sel, (el, val) => {
    el.value = String(val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, v));
  const pick = (sel, v) => settle(() => page.selectOption(sel, v));
  const hash = (which) => page.evaluate((w) => window.VL.hash(w), which);
  const stats = () => page.evaluate(() => {
    const s = window.VL.outStats();
    return { lumaMean: s.lumaMean, lumaStd: s.lumaStd, binary: s.binary, brightRatio: s.brightRatio, min: s.min, max: s.max };
  });
  const stepOps = () => page.$$eval('#vl-steps .vl-note', (ns) => ns.map((n) => n.dataset.op));
  const traceText = () => page.$eval('#vl-trace', (el) => el.textContent);

  await page.goto(toolURL, { waitUntil: 'load' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 25000 });

  // ── 1 · 外壳与首屏 ───────────────────────────────────────────
  assert((await page.title()).includes('视觉工作台'), 'title names the tool');
  assert(await page.$('a.vl-back[href="../../"]'), 'back link to the hub exists');
  assert((await text('.vl-wordmark')) === 'Vision Lab', 'wordmark rendered');
  assert((await stepOps()).join(',') === 'gray,bc,dither', '首次打开落在「黑白点描」默认流水线');
  assert((await text('#vl-stepcount')) === '3 步', '步数计数正确');

  const cvSize = await page.$eval('#vl-after', (c) => [c.width, c.height]);
  assert(cvSize[0] === 900 && cvSize[1] === 600, `结果画布尺寸 = 内置示例图 900×600 (得 ${cvSize})`);
  const meta0 = await text('#vl-meta');
  assert(meta0.includes('900×600') && meta0.includes('风景') && /\d+ ms/.test(meta0), `状态条报出真实来源与耗时:「${meta0}」`);
  assert((await page.$eval('#vl-meta', (e) => e.dataset.ops)) === '3', '状态条的算子计数与流水线一致');

  // 默认输出是误差扩散抖动 ⇒ 只有 0/255,且黑白各占相当比例
  const s0 = await stats();
  assert(s0.binary, '默认流水线输出是二值图(仅 0/255)');
  assert(s0.brightRatio > 0.2 && s0.brightRatio < 0.8, `点描图黑白比例合理(亮像素 ${(s0.brightRatio * 100).toFixed(1)}%)`);
  assert((await page.$eval('#vl-readout', (el) => el.dataset.binary)) === '1', '读数面板判定为二值图');
  const shownMean = num(await page.$eval('#vl-readout', (el) => {
    const dts = [...el.querySelectorAll('dt')];
    const i = dts.findIndex((d) => d.textContent.includes('亮度均值'));
    return el.querySelectorAll('dd')[i].textContent;
  }));
  assert(Math.abs(shownMean - s0.lumaMean) < 0.06, `读数「亮度均值 ${shownMean}」= 引擎真实均值 ${s0.lumaMean.toFixed(2)}`);

  // ── 2 · 流水线语义:停用 / 清空 = 原图 ────────────────────────
  const srcHash = await hash('src');
  assert((await hash('out')) !== srcHash, '有效流水线的输出 ≠ 原图');
  await settle(() => page.click('#vl-steps .vl-note:nth-child(3) .vl-noteacts button:nth-child(1)'));
  assert((await page.$eval('#vl-steps .vl-note:nth-child(3)', (n) => n.className)).includes('vl-muted'), '停用的步骤在卡片上被标出');
  assert(!(await stats()).binary, '停用抖动后输出不再是二值图');
  await settle(() => page.click('#vl-clear'));
  assert((await hash('out')) === srcHash, '清空流水线后输出与原图逐字节一致');
  assert((await traceText()).includes('流水线为空'), '空流水线有明确提示');
  assert((await display('#vl-params')) === 'none', '无选中步骤时参数面板被真正隐藏(计算样式)');
  assert((await display('#vl-paramsempty')) !== 'none', '空态提示可见');

  // ── 3 · 灰度:逐像素对 Rec.709 亮度公式 ───────────────────────
  await settle(() => page.evaluate(() => window.VL.addStep('gray')));
  const grayCheck = await page.evaluate(() => {
    const pts = [[100, 80], [450, 300], [820, 520], [10, 590], [899, 0]];
    return pts.map(([x, y]) => {
      const s = window.VL.srcPixel(x, y), o = window.VL.outPixel(x, y);
      return { expect: Math.round(0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2]), got: o, gray: o[0] === o[1] && o[1] === o[2] };
    });
  });
  assert(grayCheck.every((c) => c.gray), '灰度输出三通道相等');
  assert(grayCheck.every((c) => c.got[0] === c.expect), `5 个采样点都精确等于 Rec.709 亮度 (${grayCheck.map((c) => c.got[0]).join('/')})`);

  // ── 4 · 大津法:自动阈值与手动同值必须完全一致 ────────────────
  await settle(() => page.evaluate(() => window.VL.addStep('threshold')));
  const otsuNote = await traceText();
  const t = num(otsuNote.slice(otsuNote.indexOf('Otsu 阈值')));
  assert(Number.isFinite(t) && t > 0 && t < 255, `trace 报出了真实的 Otsu 阈值 ${t}`);
  const otsuHash = await hash('out');
  const sBin = await stats();
  assert(sBin.binary && sBin.min[0] === 0 && sBin.max[0] === 255, '二值化输出只有 0 与 255');
  assert((await display('#vl-f-t')) === 'none', '大津法模式下「阈值」滑杆被真正隐藏(计算样式,不只是 hidden 属性)');
  assert((await display('#vl-f-win')) === 'none', '大津法模式下自适应窗口滑杆同样隐藏');
  await pick('#vl-p-method', 'adaptive');
  assert((await display('#vl-f-win')) !== 'none' && (await display('#vl-f-t')) === 'none', '切到自适应:窗口滑杆现身、全局阈值滑杆退场');
  assert((await traceText()).includes('自适应'), '自适应模式的读数标明窗口与偏置');
  await pick('#vl-p-method', 'manual');
  assert((await display('#vl-f-t')) !== 'none' && (await display('#vl-f-win')) === 'none', '切到手动阈值后只显示全局阈值滑杆');
  await setRange('#vl-p-t', t);
  assert((await hash('out')) === otsuHash, `手动把阈值设成 ${t} 得到与大津法逐字节相同的结果`);
  await setRange('#vl-p-t', t + 40);
  assert((await hash('out')) !== otsuHash, '阈值改变后结果确实变化');
  const brightHi = (await stats()).brightRatio;
  await setRange('#vl-p-t', Math.max(1, t - 40));
  assert((await stats()).brightRatio > brightHi, '阈值调低后前景(亮像素)变多 —— 单调性成立');

  // ── 4b · 扫描件:自适应阈值必须真的救回照明暗角 ────────────────
  await settle(() => page.click('#vl-sample-doc'));
  const darkCorner = () => page.evaluate(() => {
    const im = window.VL.state.out;
    const box = (x0, x1, y0, y1) => {
      let n = 0, tot = 0;
      for (let y = Math.round(y0 * im.h); y < y1 * im.h; y++) {
        for (let x = Math.round(x0 * im.w); x < x1 * im.w; x++) { if (im.data[(y * im.w + x) * 4] < 128) n++; tot++; }
      }
      return n / tot;
    };
    return { dark: box(0.75, 1, 0.75, 1), lit: box(0, 0.25, 0, 0.25) };
  });
  await settle(() => page.evaluate(() => window.VL.applyPreset([{ op: 'gray' }, { op: 'threshold', params: { method: 'otsu' } }])));
  const gGlobal = await darkCorner();
  assert(gGlobal.dark > 0.9, `全局大津法把照明暗角整片判成墨(黑占 ${(gGlobal.dark * 100).toFixed(0)}%)—— 这就是扫描件的真实痛点`);
  await settle(() => page.click('[data-preset="2"]'));
  const gAdapt = await darkCorner();
  assert(Math.abs(gAdapt.dark - gAdapt.lit) < 0.12,
    `配方「扫描件增强」的自适应阈值把暗角墨占比拉回 ${(gAdapt.dark * 100).toFixed(0)}%,与亮处 ${(gAdapt.lit * 100).toFixed(0)}% 一致`);
  assert((await traceText()).includes('自适应 · 窗口 31×31'), '读数如实报出自适应窗口尺寸');

  // ── 5 · 中值滤波:真的把噪声块的标准差砍掉 ────────────────────
  await settle(() => page.click('#vl-sample-chart'));
  await settle(() => page.click('#vl-clear'));
  // 噪声块(色卡示例图右下角)的亮度标准差 —— 中值/高斯的降噪效果就用它来量
  const stdIn = async (which) => page.evaluate((w) => {
    const im = w === 'src' ? window.VL.state.src : window.VL.state.out;
    let s = 0, q = 0, n = 0;
    for (let y = Math.round(im.h * 0.82); y < im.h * 0.96; y++) {
      for (let x = Math.round(im.w * 0.7); x < im.w * 0.95; x++) {
        const i = (y * im.w + x) * 4;
        const l = 0.2126 * im.data[i] + 0.7152 * im.data[i + 1] + 0.0722 * im.data[i + 2];
        s += l; q += l * l; n++;
      }
    }
    const m = s / n;
    return Math.sqrt(q / n - m * m);
  }, which);
  const noiseBefore = await stdIn('src');
  assert(noiseBefore > 45, `色卡示例图的噪声块标准差 ${noiseBefore.toFixed(1)} > 45(构造如此)`);
  await settle(() => page.evaluate(() => window.VL.addStep('median', { radius: 2 })));
  const noiseAfter = await stdIn('out');
  assert(noiseAfter < noiseBefore * 0.5, `5×5 中值把噪声块标准差从 ${noiseBefore.toFixed(1)} 降到 ${noiseAfter.toFixed(1)}(<50%)`);
  assert((await traceText()).includes('窗口 5×5'), '读数报出真实窗口尺寸');
  const edgeKept = await page.evaluate(() => {
    // 色带边界(x≈150 处红/黄交界)在中值后仍是硬边:两侧色差应保持
    const a = window.VL.outPixel(140, 60), b = window.VL.outPixel(160, 60);
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
  });
  assert(edgeKept > 60, `中值滤波保边:色带交界两侧仍有 ${edgeKept} 的通道差`);

  // ── 6 · 高斯 σ 单调降噪 ──────────────────────────────────────
  await settle(() => page.click('#vl-clear'));
  await settle(() => page.evaluate(() => window.VL.addStep('blur', { sigma: 1 })));
  const std1 = await stdIn('out');
  await setRange('#vl-p-sigma', 5);
  const std5 = await stdIn('out');
  assert(std5 < std1, `σ 从 1 增到 5,噪声块标准差从 ${std1.toFixed(1)} 降到 ${std5.toFixed(1)}`);
  assert((await traceText()).includes('核半径'), '高斯读数报出核半径');

  // ── 7 · 步骤顺序 / 增删 ──────────────────────────────────────
  await settle(() => page.click('#vl-sample-scene'));
  await settle(() => page.click('[data-preset="1"]'));
  assert((await stepOps()).join(',') === 'gray,blur,canny,invert', '配方「素描线稿」装配了 4 步');
  const cannyTrace = await traceText();
  assert(/边缘\s[\d,]+\s*px/.test(cannyTrace), `trace 回报了 Canny 的真实边缘像素数:${cannyTrace.match(/边缘[^)]*\)/)}`);
  assert((await stats()).brightRatio > 0.9, '线稿是白底黑线');
  const beforeOrder = await hash('out');
  await settle(() => page.click('#vl-steps .vl-note:nth-child(4) .vl-noteacts button:nth-child(2)'));
  assert((await stepOps()).join(',') === 'gray,blur,invert,canny', '上移把「反相」提到 Canny 之前');
  assert((await hash('out')) !== beforeOrder, '换序真的改变了结果(反相与 Canny 不可交换)');
  await settle(() => page.click('#vl-steps .vl-note:nth-child(1) .vl-noteacts button:nth-child(4)'));
  assert((await stepOps()).length === 3 && (await text('#vl-stepcount')) === '3 步', '删除步骤后计数同步');

  // ── 8 · 算子菜单的显隐(again: 计算样式) ──────────────────────
  assert((await display('#vl-opmenu')) === 'none', '算子菜单默认收起');
  await page.click('#vl-add');
  assert((await display('#vl-opmenu')) !== 'none', '点击后菜单展开');
  assert((await page.$eval('#vl-add', (b) => b.getAttribute('aria-expanded'))) === 'true', 'aria-expanded 同步');
  const menuOps = await page.$$eval('#vl-opmenu .vl-chip', (bs) => bs.length);
  assert(menuOps === 16, `菜单里 16 个算子(得 ${menuOps})`);
  await page.keyboard.press('Escape');
  assert((await display('#vl-opmenu')) === 'none', 'Escape 收起菜单');

  // ── 9 · 误差扩散抖动:量化到两级且保均值 ─────────────────────
  await settle(() => page.click('[data-preset="0"]'));
  const dith = await page.evaluate(() => {
    const set = new Set(), out = window.VL.state.out, d = out.data;
    let so = 0, si = 0;
    const gray = window.VL.engine.grayscale(window.VL.state.src, { mode: '709' });
    const bc = window.VL.engine.brightnessContrast(gray, { contrast: 18 });
    for (let i = 0; i < d.length; i += 4) { set.add(d[i]); so += d[i]; si += bc.data[i]; }
    const n = out.w * out.h;
    return { vals: [...set].sort((a, b) => a - b), meanOut: so / n, meanIn: si / n };
  });
  assert(dith.vals.length === 2 && dith.vals[0] === 0 && dith.vals[1] === 255, `「黑白点描」把图量化到 2 级 (得 ${dith.vals})`);
  assert(Math.abs(dith.meanOut - dith.meanIn) < 3,
    `Floyd–Steinberg 误差扩散保住了平均亮度:${dith.meanOut.toFixed(1)} vs 量化前 ${dith.meanIn.toFixed(1)}`);

  // ── 10 · 对比模式与分界滑块 ─────────────────────────────────
  await page.evaluate(() => window.VL.setMode('side'));
  assert((await display('#vl-divider')) === 'none', '并排模式下分界线被隐藏(计算样式)');
  assert((await display('#vl-paneA')) !== 'none', '并排模式下仍显示原图');
  await page.evaluate(() => window.VL.setMode('after'));
  assert((await display('#vl-paneA')) === 'none', '「仅结果」模式下原图面板被隐藏');
  await page.evaluate(() => window.VL.setMode('split'));
  assert((await display('#vl-divider')) !== 'none' && (await display('#vl-paneA')) !== 'none', '回到滑动对比,两者都在');
  await page.focus('#vl-divider');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  const nowVal = await page.$eval('#vl-divider', (d) => d.getAttribute('aria-valuenow'));
  assert(nowVal === '58', `键盘右移两次:50 → ${nowVal}`);
  const clipAt58 = await page.$eval('#vl-paneB', (el) => getComputedStyle(el).clipPath);
  await page.evaluate(() => window.VL.setSplit(20));
  const clipAt20 = await page.$eval('#vl-paneB', (el) => getComputedStyle(el).clipPath);
  assert(clipAt58 !== clipAt20 && /inset/.test(clipAt20), `分界位置真的改变了裁剪 (${clipAt20})`);
  await page.evaluate(() => window.VL.setSplit(50));

  // ── 11 · 直方图:画了东西 + 标签互不重叠 ─────────────────────
  const histInk = await page.evaluate(() => {
    const cv = document.querySelector('#vl-hist');
    const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 12) n++;
    return n / (d.length / 4);
  });
  assert(histInk > 0.02, `直方图画布真的画了内容(着墨率 ${(histInk * 100).toFixed(1)}%)`);
  const labels = await page.evaluate(() => window.VL.histLabels());
  assert(labels.length >= 3, `直方图至少画出 3 个刻度标签(得 ${labels.length})`);
  let overlap = null;
  for (let i = 0; i < labels.length; i++) {
    for (let j = i + 1; j < labels.length; j++) {
      const a = labels[i], b = labels[j];
      if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) overlap = [a.text, b.text];
    }
  }
  assert(!overlap, `直方图刻度标签两两不重叠(冲突: ${overlap})`);
  await page.click('#vl-chans button[data-ch="0"]');
  assert((await page.$eval('#vl-chans button[data-ch="0"]', (b) => b.getAttribute('aria-pressed'))) === 'true', 'R 通道可单独开关');

  // ── 12 · 导出 ────────────────────────────────────────────────
  const png = await page.evaluate(() => window.VL.exportPNG());
  assert(png.startsWith('data:image/png;base64,') && png.length > 5000, '导出的是真正的 PNG data URL');
  const decoded = await page.evaluate((u) => new Promise((res) => {
    const im = new Image();
    im.onload = () => res([im.naturalWidth, im.naturalHeight]);
    im.src = u;
  }), png);
  assert(decoded[0] === 900 && decoded[1] === 600, `导出的 PNG 尺寸 = 工作分辨率 (得 ${decoded})`);
  await page.click('#vl-export');
  await page.waitForFunction(() => document.body.dataset.exports === '1', null, { timeout: 10000 });

  // ── 13 · 配方 JSON 与持久化 ─────────────────────────────────
  await settle(() => page.evaluate(() => {
    document.querySelector('#vl-json').value = '[{"op":"gray"},{"op":"sobel","params":{"scale":2}}]';
    document.querySelector('#vl-applyjson').click();
  }));
  assert((await stepOps()).join(',') === 'gray,sobel', 'JSON 可以直接装配流水线');
  assert((await traceText()).includes('梯度峰值'), 'Sobel 报出真实梯度峰值');
  await page.evaluate(() => {
    document.querySelector('#vl-json').value = '{不是数组}';
    document.querySelector('#vl-applyjson').click();
  });
  assert((await display('#vl-jsonmsg')) !== 'none', '坏 JSON 给出可见的错误提示');
  assert((await stepOps()).join(',') === 'gray,sobel', '坏 JSON 不会破坏当前流水线');
  await page.click('#vl-saverecipe');
  assert((await page.$$eval('#vl-recipes [data-recipe]', (b) => b.length)) === 1, '配方已保存到本地');

  const sampleBefore = await page.$$eval('[data-sample]', (bs) => bs.filter((b) => b.getAttribute('aria-pressed') === 'true').map((b) => b.dataset.sample)[0]);
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 25000 });
  assert((await stepOps()).join(',') === 'gray,sobel', '刷新后流水线从 localStorage 恢复');
  assert((await page.$$eval('#vl-recipes [data-recipe]', (b) => b.length)) === 1, '刷新后我的配方仍在');
  const sampleAfter = await page.$$eval('[data-sample]', (bs) => bs.filter((b) => b.getAttribute('aria-pressed') === 'true').map((b) => b.dataset.sample)[0]);
  assert(sampleAfter === sampleBefore, `刷新后仍停在上次选的示例图(${sampleBefore})`);

  // ── 14 · 设计系统守卫(Figma:黑白 + 药丸,不得混入别的强调色) ──
  const palette = await page.evaluate(() => {
    const btn = getComputedStyle(document.querySelector('#vl-export'));
    const pillRadii = [...document.querySelectorAll('.vl-pill')].map((b) => getComputedStyle(b).borderRadius);
    const rangeAccent = [...document.querySelectorAll('input[type=range]')].map((r) => getComputedStyle(r).accentColor);
    const lime = getComputedStyle(document.querySelector('.vl-lime')).backgroundColor;
    const strip = getComputedStyle(document.querySelector('.vl-strip')).backgroundColor;
    return { bg: btn.backgroundColor, fg: btn.color, radius: btn.borderRadius, pillRadii, rangeAccent, lime, strip };
  });
  assert(palette.bg === 'rgb(0, 0, 0)' && palette.fg === 'rgb(255, 255, 255)', '主按钮是纯黑底白字(Figma 的 primary)');
  assert(palette.pillRadii.every((r) => parseFloat(r) >= 50), '所有 CTA 都是药丸形(半径 ≥ 50px)');
  assert(palette.rangeAccent.every((c) => c === 'rgb(0, 0, 0)'), `原生滑杆没有引入系统蓝(得 ${palette.rangeAccent[0]})`);
  assert(palette.lime === 'rgb(220, 238, 177)', `色块用的是 Figma 的 lime #dceeb1 (得 ${palette.lime})`);
  assert(palette.strip === 'rgb(0, 0, 0)', '顶部细带是纯黑 marquee');
  assert((await page.$$eval('#vl-reftiles .vl-tile', (t) => t.length)) === 16, '算子索引卡 16 张');
  assert((await page.$$eval('#vl-factgrid .vl-fact', (f) => f.length)) === 4, '事实卡 4 张');

  // ── 15 · 布局守卫:不逃逸、不塌缩、不横向溢出 ────────────────
  await settle(() => page.click('#vl-sample-scene'));
  await settle(() => page.click('[data-preset="0"]'));
  const geo = await page.evaluate(() => {
    const r = (s) => { const e = document.querySelector(s); const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height, right: b.right, bottom: b.bottom }; };
    return {
      vw: document.documentElement.clientWidth,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      box: r('#vl-box'), stage: r('.vl-stage'), left: r('.vl-left'), right: r('.vl-right'),
      hist: r('#vl-hist'), divider: r('#vl-divider'),
      note: r('#vl-steps .vl-note'), icon: r('#vl-steps .vl-icon'),
      range: document.querySelector('input[type=range]') ? r('input[type=range]') : null,
      pill: r('#vl-export'),
    };
  });
  assert(geo.overflow <= 0, `1280px 下无横向溢出(得 ${geo.overflow}px)`);
  assert(geo.box.right <= geo.stage.right + 1 && geo.box.x >= geo.stage.x - 1, '画布盒子没有逃出舞台卡片');
  assert(geo.divider.x > geo.box.x && geo.divider.x < geo.box.right, '分界线落在画布内');
  assert(geo.hist.w >= 200 && geo.hist.h >= 100, `直方图画布没被压塌 (${geo.hist.w}×${geo.hist.h})`);
  assert(geo.note.w >= 180 && geo.note.h >= 40, `步骤卡尺寸正常 (${geo.note.w}×${geo.note.h})`);
  assert(geo.icon.w >= 20 && geo.icon.h >= 20, `圆形图标按钮没被挤没 (${geo.icon.w}×${geo.icon.h})`);
  assert(!geo.range || (geo.range.w >= 120 && geo.range.h >= 12), `参数滑杆宽高正常 (${geo.range && geo.range.w}×${geo.range && geo.range.h})`);
  assert(geo.pill.h >= 28, `药丸按钮高度 ${geo.pill.h} ≥ 28`);
  assert(geo.left.w > 0 && geo.right.w > 0 && geo.box.w > 400, '三栏都真实占位');

  await page.setViewportSize({ width: 390, height: 820 });
  await settle(() => page.click('[data-preset="2"]'));
  const narrow = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    boxRight: document.querySelector('#vl-box').getBoundingClientRect().right,
    vw: document.documentElement.clientWidth,
    navWrap: document.querySelector('.vl-nav').getBoundingClientRect().height,
    histW: document.querySelector('#vl-hist').getBoundingClientRect().width,
  }));
  assert(narrow.overflow <= 0, `390px 下无横向溢出(得 ${narrow.overflow}px)`);
  assert(narrow.boxRight <= narrow.vw + 1, '窄屏画布不越界');
  assert(narrow.histW >= 200, `窄屏直方图仍有 ${Math.round(narrow.histW)}px 宽`);

  // ── 16 · 收尾:回到最佳展示状态并截图 ────────────────────────
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.evaluate(() => { localStorage.clear(); });
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 25000 });
  await settle(() => page.evaluate(() => { window.VL.setSplit(46); window.VL.applyPreset(window.VL.PRESETS[0].steps); }));
  await page.evaluate(() => document.querySelectorAll('#vl-steps .vl-notemain')[2].click());
  await page.waitForFunction(() => document.querySelector('#vl-paramop').textContent.includes('抖动'), null, { timeout: 10000 });
  await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))));
  await screenshot('thumb.png');

  // 面板视图快照:DOM 断言看不出「两段文字视觉重叠」,留一张给人工过目
  await page.evaluate(() => document.querySelector('.vl-right').scrollIntoView({ block: 'center' }));
  await screenshot('view-panels.png');
  await page.evaluate(() => document.querySelector('.vl-lime').scrollIntoView({ block: 'center' }));
  await screenshot('view-block.png');
  await page.evaluate(() => window.scrollTo(0, 0));
};
