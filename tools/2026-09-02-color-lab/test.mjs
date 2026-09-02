// Color Lab 集成测试：真操作 + 断真实产出。
// 期望值来源：颜色读数取自 culori 4.0.2，光谱读数取自 colour-science 0.4.7（同 5 nm 输入的精确对拍），
// CIEDE2000 取自 Sharma 等 2005 随论文公布的官方数据。
export default async ({ page, toolURL, screenshot, assert: rawAssert }) => {
  let assertions = 0;
  const assert = (cond, msg) => { assertions++; rawAssert(cond, msg); };
  const near = (a, b, tol, msg) => assert(Math.abs(a - b) <= tol, `${msg}: ${a} 与 ${b} 相差 ${Math.abs(a - b)} > ${tol}`);
  const txt = async (sel) => (await page.textContent(sel) || '').trim();
  const nums = (s) => (s.match(/-?\d+(\.\d+)?(e[-+]?\d+)?/gi) || []).map(Number);
  // dl 的 textContent 不含换行，逐项读成对象才可靠
  const readKV = (sel) => page.$eval(sel, (dl) => {
    const o = {}; let k = null;
    for (const c of dl.children) {
      if (c.tagName === 'DT') k = c.textContent.trim();
      else if (k !== null) o[k] = c.textContent.trim().replace(/\s+/g, ' ');
    }
    return o;
  });

  await page.goto(toolURL);
  await page.waitForSelector('body[data-cl-ready="1"]', { timeout: 20000 });

  // ---------- 外壳 ----------
  assert((await page.title()).includes('色彩'), '标题应含「色彩」');
  assert(await page.getAttribute('.cl-back', 'href') === '../../', '必须有返回工具集链接');
  const TABS = ['convert', 'chroma', 'delta', 'mix', 'spectral', 'a11y', 'icc', 'notes'];
  const show = async (t) => { await page.click('#tab-' + t); await page.waitForTimeout(160); };

  // [hidden] 守卫：断计算样式而不是属性
  for (const t of TABS) {
    await show(t);
    for (const o of TABS) {
      const disp = await page.$eval('#p-' + o, (el) => getComputedStyle(el).display);
      if (o === t) assert(disp !== 'none', `切到 ${t} 后 #p-${t} 应可见`);
      else assert(disp === 'none', `切到 ${t} 后 #p-${o} 的 display 应为 none，实为 ${disp}`);
    }
    assert(await page.getAttribute('#tab-' + t, 'aria-selected') === 'true', `${t} 标签应被选中`);
  }

  // ---------- 换算 ----------
  await show('convert');
  const setColor = async (v) => {
    await page.fill('#cv-input', v);
    await page.waitForTimeout(140);
  };
  await setColor('#CF4500');
  const readA = await readKV('#cv-read-a'), readB = await readKV('#cv-read-b');
  assert(readA['sRGB 0–255'] === '207 69 0', 'sRGB 0-255 应为 207 69 0，实为 ' + readA['sRGB 0–255']);
  assert(readB['CIELAB (D65)'] === '48.913 52.338 59.907', 'CIELAB(D65) 应为 48.913 52.338 59.907（culori 对拍值），实为 ' + readB['CIELAB (D65)']);
  assert(readB['Oklab'].startsWith('0.57945'), 'Oklab L 应为 0.57945，实为 ' + readB['Oklab']);
  assert(readA['xyY'] === '0.58901 0.37049 0.17524', 'xyY 应为 0.58901 0.37049 0.17524，实为 ' + readA['xyY']);
  assert(readA['线性 sRGB'].startsWith('0.62396'), '线性 sRGB 的 R 应为 0.62396，实为 ' + readA['线性 sRGB']);
  near(nums(readB['与白 / 与黑对比度'])[0], 4.66, 0.01, '#CF4500 与白的 WCAG 对比度');
  const cssRows = await page.$$eval('#cv-css .cl-css-row code', (n) => n.map((e) => e.textContent));
  assert(cssRows.length === 15, 'CSS 写法应有 15 行，实为 ' + cssRows.length);
  assert(cssRows.some((s) => s === '#cf4500'), 'hex 输出应为 #cf4500');
  assert(cssRows.some((s) => s === 'rgb(207 69 0)'), 'rgb() 输出应为 rgb(207 69 0)');
  assert(cssRows.some((s) => s.startsWith('oklch(0.57945 0.18449 39.302')), 'oklch() 输出应为 0.57945 0.18449 39.302，实为 ' + cssRows.find((s) => s.startsWith('oklch')));
  assert(cssRows.some((s) => s.startsWith('lab(49.6763 53.8206 61.2788')), 'lab() 用 D50，应为 49.6763 53.8206 61.2788');
  assert(cssRows.some((s) => s === 'color(display-p3 0.7508 0.3099 0.1282)'), 'P3 坐标应为 0.7508 0.3099 0.1282');
  // 「公布了就必须真能用」：每一条 CSS 输出都要能被自己的解析器读回来
  const cssRoundTrip = await page.evaluate((list) => list.map((s) => (CL.parseColor(s) ? null : s)).filter(Boolean), cssRows);
  assert(cssRoundTrip.length === 0, '这些 CSS 输出自己解析不了：' + cssRoundTrip.join(' | '));

  // 色域判定
  await setColor('color(display-p3 1 0 0)');
  const gamutRows = await page.$$eval('#cv-gamut tbody tr', (rows) => rows.map((r) => Array.from(r.children).map((c) => c.textContent.trim())));
  assert(gamutRows.length === 5, '色域表应有 5 行');
  assert(gamutRows[0][4].includes('超出色域'), 'P3 纯红应超出 sRGB');
  assert(gamutRows[1][4].includes('在色域内'), 'P3 纯红应在 P3 内');
  // P3 的红原色 (0.680,0.320) 其实落在 BT.2020 三角形 R–G 边之外一点点，蓝分量为负：
  // culori 给 rec2020 b = -0.0054465，两边独立算出同一结论
  assert(gamutRows[4][4].includes('超出色域'), 'P3 纯红其实略微超出 Rec.2020（蓝分量为负）');
  near(Number(gamutRows[0][1]), 1.0931, 0.001, 'P3 纯红换到 sRGB 的 R 分量（culori: 1.09307）');
  near(Number(gamutRows[0][2]), -0.2267, 0.001, 'P3 纯红换到 sRGB 的 G 分量（culori: -0.22674）');
  near(Number(gamutRows[4][3]), -0.0054, 0.0005, 'P3 纯红换到 Rec.2020 的 B 分量（culori: -0.0054465）');
  near(Number(gamutRows[2][2]), -0.2367, 0.001, 'P3 纯红换到 Adobe RGB 的 G 分量（culori: -0.23673）');
  assert((await txt('#cv-gamut-note')).includes('4 个色域装不下'), '应提示有 4 个色域装不下，实为 ' + await txt('#cv-gamut-note'));
  const mappedHex = await page.evaluate(() => {
    const g = CL.gamutMap('srgb', CL.toXYZ65(CL.parseColor('color(display-p3 1 0 0)')));
    return { hex: CL.toHex(g.rgb), dE: g.deltaEOK };
  });
  assert(mappedHex.dE < 0.02, '映射后的 ΔE_ok 必须小于 CSS 规定的 0.02，实为 ' + mappedHex.dE);

  // 非法输入
  await setColor('这不是颜色');
  assert((await txt('#cv-parse-status')).includes('读不懂'), '非法输入要给出可读提示');
  assert(await page.$eval('#cv-parse-status', (e) => e.className.includes('cl-err-msg')), '非法输入状态应标红');
  await setColor('rebeccapurple');
  assert((await txt('#cv-parse-status')).includes('具名色'), '具名色应被识别');
  assert((await readKV('#cv-read-a'))['sRGB 0–255'] === '102 51 153', 'rebeccapurple = 102 51 153');

  // 色卡 localStorage
  await setColor('#0052EF');
  await page.click('#cv-save');
  await page.waitForTimeout(80);
  assert((await txt('#cv-library')).includes('#0052ef'), '收藏后色卡里应出现该颜色');
  await page.reload();
  await page.waitForSelector('body[data-cl-ready="1"]');
  assert((await txt('#cv-library')).includes('#0052ef'), '刷新后色卡应从 localStorage 恢复');
  await page.click('#cv-clear');
  assert((await txt('#cv-library')).includes('还没有收藏'), '清空后应回到空态');

  // ---------- 色度图 ----------
  await show('chroma');
  await page.waitForTimeout(300);
  // 画布真的画上了：数非背景像素（元素级截图会拍到空白，故用 getImageData）
  const painted = await page.evaluate(() => {
    const c = document.getElementById('ch-canvas');
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let n = 0, hues = new Set();
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] > 0) { n++; if (n % 997 === 0) hues.add(d[i] + ',' + d[i + 1] + ',' + d[i + 2]); }
    }
    return { n, hues: hues.size };
  });
  assert(painted.n > 100000, '色度图底色应有 10 万以上非透明像素，实为 ' + painted.n);
  assert(painted.hues > 50, '底色应是连续色相而非一片纯色，采样到 ' + painted.hues + ' 种');
  assert(await page.$eval('#ch-svg', (s) => +s.dataset.dropped) === 0, '色度图不应有被丢弃的标注：' + await page.getAttribute('#ch-svg', 'data-dropped-labels'));
  assert(await page.$eval('#ch-svg', (s) => +s.dataset.drawn) >= 40, '色度图标注数应 ≥ 40');
  const areaRows = await page.$$eval('#ch-areas tbody tr', (rows) => rows.map((r) => Array.from(r.children).map((c) => c.textContent.trim())));
  assert(areaRows.length === 5, '色域面积表 5 行');
  assert(areaRows[0][2] === '100 %', 'sRGB 相对自身应为 100 %');
  near(Number(areaRows[1][2].replace(' %', '')), 135.7, 0.15, 'Display P3 在 xy 上的三角形面积相对 sRGB');
  near(Number(areaRows[4][2].replace(' %', '')), 189.1, 0.15, 'Rec.2020 在 xy 上的三角形面积相对 sRGB');
  // 三角形开关真的会增减图元
  const triCount = () => page.$$eval('#ch-svg polygon', (n) => n.length);
  const before = await triCount();
  await page.click('#ch-t-rec2020');
  await page.waitForTimeout(150);
  assert(await triCount() === before - 1, '关掉 Rec.2020 应少一个三角形');
  await page.click('#ch-t-rec2020');
  await page.waitForTimeout(150);
  assert(await triCount() === before, '打开 Rec.2020 应恢复');
  // 主波长与纯度
  await page.fill('#ch-color', '#CF4500');
  await page.waitForTimeout(200);
  const chRead = await readKV('#ch-readout');
  near(nums(chRead['主波长'])[0], 599.3, 0.6, '#CF4500 的主波长，实为 ' + chRead['主波长']);
  near(nums(chRead['兴奋纯度'])[0], 88.8, 0.4, '#CF4500 的兴奋纯度');
  assert(chRead['落在哪些色域内'].includes('sRGB'), '#CF4500 应落在 sRGB 内');
  // u'v' 模式
  await page.selectOption('#ch-mode', 'uv');
  await page.waitForTimeout(300);
  assert(await page.$eval('#ch-svg', (s) => +s.dataset.dropped) === 0, "u'v' 模式也不应丢标注");
  const uvRows = await page.$$eval('#ch-areas tbody tr', (rows) => rows.map((r) => r.children[2].textContent.trim()));
  near(Number(uvRows[4].replace(' %', '')), 172.1, 6, "Rec.2020 在 u'v' 上的面积比应明显小于 xy 上的 189%");
  await page.selectOption('#ch-mode', 'xy');
  await page.waitForTimeout(250);

  // ---------- 色差 ----------
  await show('delta');
  await page.fill('#de-a', '#CF4500');
  await page.fill('#de-b', '#D24E12');
  await page.waitForTimeout(180);
  const deRows = await page.$$eval('#de-table tbody tr', (rows) => rows.map((r) => [r.children[0].textContent.trim(), Number(r.children[1].textContent)]));
  assert(deRows.length === 7, '色差表应有 7 种公式');
  const e00 = deRows.find((r) => r[0].includes('ΔE00'))[1];
  near(e00, 2.1922, 0.0005, 'ΔE00（culori differenceCiede2000 = 2.192247）');
  near(deRows.find((r) => r[0].includes('1976'))[1], 4.4737, 0.001, 'ΔE*ab 1976');
  const detail = await readKV('#de-detail');
  assert(detail['Lab A（D65）'] === '48.913 52.338 59.907', '分项里应给出 A 的 Lab，实为 ' + detail['Lab A（D65）']);
  assert(detail['Lab B（D65）'] === '50.916 49.76 56.848', '分项里应给出 B 的 Lab，实为 ' + detail['Lab B（D65）']);
  near(Number(detail['ΔE00 合计']), e00, 1e-3, '分项合计应与表里一致');
  near(nums(detail["ΔL'  ΔC'  ΔH'"])[0], 2.0027, 1e-3, "ΔL' 应为 2.0027（B 比 A 亮）");
  // 官方数据自检表
  const sharma = await page.$$eval('#de-sharma tbody tr', (rows) => rows.map((r) => Array.from(r.children).map((c) => c.textContent.trim())));
  assert(sharma.length === 33, 'Sharma 官方数据应有 33 行，实为 ' + sharma.length);
  let worstSharma = 0;
  for (const r of sharma) {
    const pub = Number(r[3]), mine = Number(r[4]);
    worstSharma = Math.max(worstSharma, Math.abs(pub - mine));
    near(mine, pub, 5e-5, 'Sharma 第 ' + r[0] + ' 行');
  }
  assert(worstSharma < 5e-5, 'Sharma 全表最大偏差应 < 5e-5，实为 ' + worstSharma);

  // ---------- 渐变 ----------
  await show('mix');
  await page.fill('#mx-a', '#0052EF');
  await page.fill('#mx-b', '#F79E1B');
  await page.waitForTimeout(220);
  const rampIds = ['srgb', 'srgb-linear', 'lab', 'lch', 'oklab', 'oklch', 'hsl'];
  for (const id of rampIds) {
    const n = await page.$$eval('#mx-ramp-' + id + ' span', (s) => s.length);
    assert(n === 13, `${id} 色阶应有 13 档，实为 ${n}`);
  }
  const mxStats = await page.$$eval('#mx-stats tbody tr', (rows) => rows.map((r) => Array.from(r.children).map((c) => c.textContent.trim())));
  assert(mxStats.length === 7, '统计表 7 行');
  const midL = Object.fromEntries(mxStats.map((r) => [r[0], Number(r[1])]));
  const devL = Object.fromEntries(mxStats.map((r) => [r[0], Number(r[2])]));
  assert(devL['CIELAB'] === 0, 'CIELAB 插值的中点必然等于两端平均，实为 ' + devL['CIELAB']);
  assert(devL['sRGB（CSS 默认）'] < -3, 'sRGB 插值的中点 L* 应明显低于两端平均（这正是「中间发灰」），实为 ' + devL['sRGB（CSS 默认）']);
  assert(Math.abs(devL['Oklab']) < 2, 'Oklab 插值的中点偏差应远小于 sRGB');
  assert(midL['sRGB（CSS 默认）'] < midL['CIELAB'], 'sRGB 中点应比 CIELAB 中点暗');
  assert(Number(mxStats.find((r) => r[0].startsWith('CIELCh'))[4]) > 0, 'LCh 走短弧会绕出 sRGB，应有若干档被映射');
  // 色阶数联动
  await page.fill('#mx-steps', '21');
  await page.dispatchEvent('#mx-steps', 'input');
  await page.waitForTimeout(200);
  assert(await page.$$eval('#mx-ramp-oklch span', (s) => s.length) === 21, '拖动滑块后色阶数应变成 21');
  assert((await txt('#mx-steps-val')) === '21', '色阶数读数应同步');
  const tokens = (await txt('#mx-tokens')).split('\n').filter((l) => l.includes('--ramp-'));
  assert(tokens.length === 21, 'CSS 变量块应有 21 行');
  assert(tokens[0].includes('#0052ef'), '第一档应等于起点色');
  // 色相走法
  await page.selectOption('#mx-hue', 'longer');
  await page.waitForTimeout(200);
  const longerCss = await page.$$eval('#mx-css code', (n) => n.map((e) => e.textContent));
  assert(longerCss.some((s) => s.includes('in oklch longer hue')), '切到 longer 后 CSS 应写 longer hue');
  const hueCheck = await page.evaluate(() => ({
    shorter: CL.hueLerp(10, 350, 0.5, 'shorter'),
    longer: CL.hueLerp(10, 350, 0.5, 'longer')
  }));
  assert(hueCheck.shorter === 0 && hueCheck.longer === 180, '色相插值的两种走法必须给出不同中点');
  await page.selectOption('#mx-hue', 'shorter');
  await page.waitForTimeout(150);

  // ---------- 光源 ----------
  await show('spectral');
  await page.selectOption('#sp-std', 'FL2');
  await page.waitForTimeout(250);
  const spRead = () => readKV('#sp-readout');
  let sp = await spRead();
  near(nums(sp['相关色温 CCT'])[0], 4223.8, 0.2, 'FL2 的 CCT（colour-science: 4223.822）');
  near(Number(sp['显色指数 Ra']), 64.15, 0.02, 'FL2 的 Ra（colour-science: 64.1488）');
  near(Number(sp['R9（饱和红）']), -83.92, 0.02, 'FL2 的 R9（colour-science: -83.918）');
  near(nums(sp['色品 xy'])[0], 0.37207, 5e-5, 'FL2 的色品 x');
  near(nums(sp['色品 xy'])[1], 0.37512, 5e-5, 'FL2 的色品 y');
  assert(sp['参照体'].includes('黑体辐射'), 'CCT < 5000 K 时参照体应是黑体');
  const criBars = await page.$$eval('#sp-cri-chart rect', (n) => n.length);
  assert(criBars >= 14, 'CRI 图应有 14 根柱，实为 ' + criBars);
  const criRows = await page.$$eval('#sp-cri-table tbody tr', (rows) => rows.length);
  assert(criRows === 7, 'CRI 表应有 7 行（每行两列样品）');
  const r14 = await page.$eval('#sp-cri-table tbody', (t) => t.textContent);
  assert(/R14/.test(r14) && /树叶绿/.test(r14), 'R1–R14 每一项都要列出说明');
  // 换到 D65：参照体应切成日光 D，Ra 接近 100
  await page.selectOption('#sp-std', 'D65');
  await page.waitForTimeout(250);
  sp = await spRead();
  near(nums(sp['相关色温 CCT'])[0], 6503.0, 0.2, 'D65 的 CCT');
  near(Number(sp['显色指数 Ra']), 100, 0.01, 'D65 对自己的参照体 Ra 应为 100');
  assert(sp['参照体'].includes('CIE 日光 D'), 'CCT ≥ 5000 K 时参照体应是 CIE 日光 D');
  // 黑体
  await page.selectOption('#sp-kind', 'bb');
  await page.waitForTimeout(120);
  await page.fill('#sp-bb', '2700');
  await page.dispatchEvent('#sp-bb', 'input');
  await page.waitForTimeout(220);
  sp = await spRead();
  near(nums(sp['相关色温 CCT'])[0], 2700, 3, '黑体 2700 K 的 CCT 应回到 2700');
  near(Number(sp['显色指数 Ra']), 100, 0.05, '黑体对自己的 Ra 应为 100');
  near(nums(sp['Duv'])[0], 0, 1e-4, '黑体的 Duv 应为 0');
  // 自拼 LED：把红峰关掉，R9 必须掉下去
  await page.selectOption('#sp-kind', 'led');
  await page.waitForTimeout(200);
  const r9Of = async () => Number((await spRead())['R9（饱和红）']);
  const r9With = await r9Of();
  await page.fill('#sp-peak-a-2', '0');
  await page.dispatchEvent('#sp-peak-a-2', 'input');
  await page.waitForTimeout(220);
  const r9Without = await r9Of();
  assert(r9Without < r9With - 8, `去掉红色荧光粉后 R9 应显著下降：${r9With} -> ${r9Without}`);
  await page.fill('#sp-peak-a-2', '26');
  await page.dispatchEvent('#sp-peak-a-2', 'input');
  await page.waitForTimeout(200);
  // 全灭：不能崩
  for (const i of [0, 1, 2]) { await page.fill('#sp-peak-a-' + i, '0'); await page.dispatchEvent('#sp-peak-a-' + i, 'input'); }
  await page.waitForTimeout(220);
  assert(JSON.stringify(await spRead()).includes('算不出颜色'), '光谱全为 0 时应给出可读提示而不是崩');
  await page.selectOption('#sp-kind', 'std');
  await page.selectOption('#sp-std', 'FL11');
  await page.waitForTimeout(250);
  // 对照表
  await page.click('#sp-add');
  await page.waitForTimeout(120);
  let cmp = await page.$$eval('#sp-compare tbody tr', (rows) => rows.map((r) => r.textContent));
  assert(cmp.length === 1 && cmp[0].includes('FL11'), '加入对照表后应出现 FL11 一行');
  await page.reload();
  await page.waitForSelector('body[data-cl-ready="1"]');
  await show('spectral');
  cmp = await page.$$eval('#sp-compare tbody tr', (rows) => rows.map((r) => r.textContent));
  assert(cmp[0].includes('FL11'), '对照表应从 localStorage 恢复');
  await page.click('#sp-clear');
  await page.waitForTimeout(100);
  assert((await txt('#sp-compare')).includes('还没有加入任何光源'), '清空后应回到空态');
  // 「列出来的光源都必须真能算」：逐个选一遍
  const badSources = await page.evaluate(() => {
    const bad = [];
    for (const opt of document.getElementById('sp-std').options) {
      const sd = CL.ILL[opt.value];
      if (!sd) { bad.push(opt.value + '（没有数据）'); continue; }
      const r = CL.cri(sd);
      if (!isFinite(r.CCT) || !isFinite(r.Ra) || r.R.some((v) => !isFinite(v))) bad.push(opt.value + '（算出 NaN）');
    }
    return bad;
  });
  assert(badSources.length === 0, '光源下拉里列出的每一项都必须真能算出 CCT/Ra：' + badSources.join('、'));

  // ---------- 可及性 ----------
  await show('a11y');
  await page.waitForTimeout(200);
  const cvdRows = await page.$$eval('#ac-cvd-table tbody tr', (rows) => rows.map((r) => [r.children[0].textContent.trim(), Number(r.children[1].textContent)]));
  assert(cvdRows.length === 4, '色觉表应有 4 行');
  const normalMin = cvdRows[0][1], protanMin = cvdRows[1][1];
  assert(protanMin < normalMin, `红色弱下的最小色差必须比常色觉小：${protanMin} vs ${normalMin}`);
  assert(protanMin < 12, '默认调色板在红色弱下确实会撞（用来演示），实测最小 ΔE00 = ' + protanMin);
  // 程度归零时四行应该完全一样
  await page.fill('#ac-sev', '0');
  await page.dispatchEvent('#ac-sev', 'input');
  await page.waitForTimeout(200);
  const zeroRows = await page.$$eval('#ac-cvd-table tbody tr', (rows) => rows.map((r) => Number(r.children[1].textContent)));
  for (const v of zeroRows) near(v, zeroRows[0], 0.01, '缺陷程度 0 时各色觉的最小色差应一致');
  await page.fill('#ac-sev', '100');
  await page.dispatchEvent('#ac-sev', 'input');
  await page.waitForTimeout(200);
  // 对比度矩阵
  const cHead = await page.$$eval('#ac-contrast thead th', (n) => n.length);
  const cBody = await page.$$eval('#ac-contrast tbody tr', (n) => n.length);
  assert(cHead === 6 && cBody === 5, `对比度矩阵应为 5 色 + 表头，实为 ${cHead}/${cBody}`);
  const knownContrast = await page.evaluate(() => ({
    bw: CL.wcagContrast([0, 0, 0], [1, 1, 1]),
    same: CL.wcagContrast([0.2, 0.4, 0.6], [0.2, 0.4, 0.6])
  }));
  near(knownContrast.bw, 21, 1e-9, '黑白对比度必须正好 21:1');
  near(knownContrast.same, 1, 1e-9, '同色对比度必须是 1:1');
  // 加色 / 删色
  await page.fill('#ac-add', '#FFFFFF');
  await page.click('#ac-add-btn');
  await page.waitForTimeout(200);
  assert(await page.$$eval('#ac-palette .cl-pal-item', (n) => n.length) === 6, '加入白色后调色板应有 6 个颜色');
  await page.click('#ac-palette .cl-pal-item:last-child .cl-pal-x');
  await page.waitForTimeout(200);
  assert(await page.$$eval('#ac-palette .cl-pal-item', (n) => n.length) === 5, '移除后应回到 5 个');
  await page.fill('#ac-add', '不是颜色');
  await page.click('#ac-add-btn');
  await page.waitForTimeout(120);
  assert((await txt('#ac-status')).includes('读不懂'), '加入非法颜色应给出提示');
  // 色觉友好八色应该比默认板安全
  await page.click('#ac-presets button:nth-child(3)');
  await page.waitForTimeout(250);
  const safeRows = await page.$$eval('#ac-cvd-table tbody tr', (rows) => rows.map((r) => Number(r.children[1].textContent)));
  assert(safeRows[1] > protanMin, `色觉友好板在红色弱下的最小色差应高于默认板：${safeRows[1]} vs ${protanMin}`);
  await page.click('#ac-presets button:nth-child(1)');
  await page.waitForTimeout(200);

  // ---------- ICC ----------
  await show('icc');
  await page.waitForTimeout(200);
  for (const [sid, name, prim] of [
    ['srgb', 'sRGB', [[0.64, 0.33], [0.30, 0.60], [0.15, 0.06]]],
    ['display-p3', 'Display P3', [[0.680, 0.320], [0.265, 0.690], [0.150, 0.060]]],
    ['rec2020', 'Rec. 2020', [[0.708, 0.292], [0.170, 0.797], [0.131, 0.046]]]
  ]) {
    await page.click('#ic-build-' + sid);
    await page.waitForTimeout(200);
    const head = await readKV('#ic-header');
    assert(head['规范版本'] === 'ICC 4.3.0', 'v4 描述文件的版本应为 4.3.0，实为 ' + head['规范版本']);
    assert(head['设备类别'].includes('mntr'), '设备类别应为 mntr');
    assert(head['声明长度 / 实际长度'].includes('一致'), '头部声明长度应与实际长度一致');
    assert(head['连接空间 PCS'].includes('XYZ'), 'PCS 应为 XYZ');
    assert((await txt('#ic-title')).includes(name), '标题应是 ' + name);
    const tagRows = await page.$$eval('#ic-tags tbody tr', (rows) => rows.map((r) => r.children[0].textContent.trim()));
    assert(tagRows.length === 10, '生成的描述文件应有 10 个标签，实为 ' + tagRows.length);
    for (const t of ['desc', 'cprt', 'wtpt', 'chad', 'rXYZ', 'gXYZ', 'bXYZ', 'rTRC', 'gTRC', 'bTRC']) {
      assert(tagRows.includes(t), '缺少标签 ' + t);
    }
    const gi = await readKV('#ic-gamut-info');
    const got = nums(gi['原色 xy（还原到媒体白点）']);
    for (let i = 0; i < 3; i++) {
      near(got[i * 2], prim[i][0], 5e-4, name + ' 原色 x');
      near(got[i * 2 + 1], prim[i][1], 5e-4, name + ' 原色 y');
    }
  }
  // sRGB 描述文件的相对面积必须是 100%
  await page.click('#ic-build-srgb');
  await page.waitForTimeout(200);
  const icG = await readKV('#ic-gamut-info'), icT = await readKV('#ic-trc-info');
  near(nums(icG['xy 三角形面积'])[1], 100, 0.6, 'sRGB 描述文件相对 sRGB 的色域面积必须是 100 %，实为 ' + icG['xy 三角形面积']);
  near(nums(icG['白点 xy'])[0], 0.3127, 5e-4, 'sRGB 描述文件的白点 x 应为 D65 的 0.3127');
  assert(icT['曲线类型'].includes('参数曲线 type 3'), 'sRGB 的 TRC 应是参数曲线 type 3，实为 ' + icT['曲线类型']);
  near(Number(icT['有效 gamma（0.05–0.95 对数拟合）']), 2.18, 0.05, 'sRGB 的有效 gamma 约 2.18');
  assert(icG['还原方式'].includes('chad'), '本页生成的描述文件带 chad 标签，应按其逆矩阵还原');
  assert(await page.$eval('#ic-download', (b) => !b.disabled), '生成后下载按钮应可用');
  // 真的走一遍「拖文件进来」的路径：把页面生成的字节交回给 input
  const bytes = await page.evaluate(() => Array.from(CL.buildICC('display-p3')));
  await page.setInputFiles('#ic-file', { name: 'p3-test.icc', mimeType: 'application/vnd.iccprofile', buffer: Buffer.from(bytes) });
  await page.waitForTimeout(300);
  assert((await txt('#ic-status')).includes('已解析 p3-test.icc'), '上传路径应能解析文件，实为 ' + await txt('#ic-status'));
  assert((await txt('#ic-title')).includes('Display P3'), '上传后标题应来自文件里的 desc 标签');
  // 损坏文件
  await page.setInputFiles('#ic-file', { name: 'broken.icc', mimeType: 'application/octet-stream', buffer: Buffer.from(new Uint8Array(300)) });
  await page.waitForTimeout(300);
  const st = await txt('#ic-status');
  assert(st.includes('解析失败'), '损坏文件应给出可读错误，实为 ' + st);
  assert(await page.$eval('#ic-status', (e) => e.className.includes('cl-err-msg')), '解析失败应标红');
  await page.click('#ic-build-srgb');
  await page.waitForTimeout(200);

  // ---------- 说明页：公布的数字必须与引擎一致 ----------
  await show('notes');
  const notes = await txt('#p-notes');
  const facts = await page.evaluate(() => ({
    ill: Object.keys(CL.ILL).length, tcs: Object.keys(CL.TCS).length,
    named: Object.keys(CL.NAMED).length, sharma: CL.SHARMA.dE.length,
    rob: CL.ROBERTSON.length, wl: CL.WL.length
  }));
  assert(facts.ill === 28 && notes.includes('28 个 CIE 标准光源'), '说明页写的光源数应与引擎一致');
  assert(facts.tcs === 14 && notes.includes('TCS01–TCS14'), '说明页写的 TCS 数应与引擎一致');
  assert(facts.named === 148 && notes.includes('148 个'), '说明页写的具名色数应与引擎一致');
  assert(facts.sharma === 33 && notes.includes('33 组'), '说明页写的 Sharma 组数应与引擎一致');
  assert(facts.rob === 31 && notes.includes('31 行'), '说明页写的 Robertson 行数应与引擎一致');
  assert(facts.wl === 95 && notes.includes('95 点'), '说明页写的光谱采样点数应与引擎一致');
  assert(await page.$$eval('#nt-conventions tbody tr', (n) => n.length) >= 8, '数值口径表至少 8 条');
  assert(await page.$$eval('#nt-limits li', (n) => n.length) >= 6, '局限清单至少 6 条');
  assert(await page.$$eval('#nt-validation tbody tr', (n) => n.length) >= 6, '验证表至少 6 行');

  // ---------- 通用守卫 ----------
  // 1) 控件不塌缩：逐个分区扫一遍（隐藏面板里的控件测不到，必须先切过去）
  let ctrlSeen = 0;
  for (const t of TABS) {
    await show(t);
    const bad = await page.$$eval('#p-' + t + ' input, #p-' + t + ' select, #p-' + t + ' button', (els) => {
      const out = [];
      let seen = 0;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        seen++;
        const tag = el.tagName.toLowerCase(), type = (el.type || '').toLowerCase();
        const iconOnly = tag === 'button' && (el.textContent || '').trim().length <= 2;
        const minW = (type === 'checkbox' || type === 'radio') ? 14 : (iconOnly ? 24 : (tag === 'button' ? 44 : 52));
        const minH = iconOnly ? 24 : 18;
        if (r.width < minW || r.height < minH) out.push(`${tag}${el.id ? '#' + el.id : ''}[${type}] ${Math.round(r.width)}x${Math.round(r.height)} < ${minW}x${minH}`);
      }
      return { out, seen };
    });
    ctrlSeen += bad.seen;
    assert(bad.out.length === 0, `${t} 分区有控件被压塌：${bad.out.join('、')}`);
  }
  assert(ctrlSeen >= 60, '逐分区累计扫到的控件数应 ≥ 60，实为 ' + ctrlSeen);

  // 2) 逐视口 × 逐分区：整页不得横向溢出
  for (const vw of [390, 768, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of TABS) {
      await show(t);
      await page.waitForTimeout(120);
      const info = await page.evaluate(() => {
        const de = document.documentElement;
        const over = de.scrollWidth - de.clientWidth;
        let worst = null;
        if (over > 1) {
          for (const el of document.querySelectorAll('*')) {
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.right > de.clientWidth + 1 && (!worst || r.right > worst.right)) {
              worst = { tag: el.tagName + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.split(' ')[0] : ''), right: Math.round(r.right) };
            }
          }
        }
        return { over, worst };
      });
      assert(info.over <= 1, `${vw}px 下 ${t} 分区横向溢出 ${info.over}px，最右元素 ${JSON.stringify(info.worst)}`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 850 });

  // 3) SVG 文字：两两不相交、不越出画布
  for (const t of ['chroma', 'mix', 'spectral', 'icc']) {
    await show(t);
    await page.waitForTimeout(200);
    const svgIssues = await page.evaluate((tab) => {
      const issues = [];
      for (const svg of document.querySelectorAll('#p-' + tab + ' svg[data-drawn]')) {
        if (!svg.getBoundingClientRect().width) continue;
        const dropped = svg.dataset.droppedLabels || '';
        if (+svg.dataset.dropped > 0) issues.push(svg.id + ' 丢了标注：' + dropped);
        const texts = Array.from(svg.querySelectorAll('text'));
        const sb = svg.getBoundingClientRect();
        for (let i = 0; i < texts.length; i++) {
          const a = texts[i].getBoundingClientRect();
          if (a.left < sb.left - 1 || a.right > sb.right + 1 || a.top < sb.top - 1 || a.bottom > sb.bottom + 1) {
            issues.push(svg.id + ' 文字越出画布: "' + texts[i].textContent + '"');
          }
          for (let j = i + 1; j < texts.length; j++) {
            const b = texts[j].getBoundingClientRect();
            if (a.left < b.right - 0.5 && a.right > b.left + 0.5 && a.top < b.bottom - 0.5 && a.bottom > b.top + 0.5) {
              issues.push(svg.id + ' 文字重叠: "' + texts[i].textContent + '" / "' + texts[j].textContent + '"');
            }
          }
        }
      }
      return issues;
    }, t);
    assert(svgIssues.length === 0, `${t} 分区的图有问题：${svgIssues.slice(0, 5).join('；')}`);
  }

  // 4) 单位符号不得被 uppercase 改写；也不该出现被转义的实体
  const textGuards = await page.evaluate((tabs) => {
    const bad = [];
    for (const t of tabs) {
      const p = document.getElementById('p-' + t);
      for (const el of p.querySelectorAll('th, dt, label, td, li, p')) {
        const s = el.textContent || '';
        if (/\b(HZ|KHZ|DBFS|NM|CD|LC)\b/.test(s)) bad.push('疑似被 uppercase 改写: ' + s.slice(0, 40));
        if (/&(gt|lt|amp|quot|nbsp);/.test(s)) bad.push('页面上出现了未解码的 HTML 实体: ' + s.slice(0, 40));
      }
    }
    return bad;
  }, TABS);
  assert(textGuards.length === 0, textGuards.slice(0, 3).join('；'));
  assert(await page.evaluate(() => !/text-transform\s*:\s*uppercase/i.test(document.querySelector('style').textContent)),
    '本页不应使用 text-transform:uppercase（会把单位符号改写成错字）');

  // 5) 卡片内的代码块不得被横向切掉；子元素不得逃出卡片
  await show('mix');
  await page.waitForTimeout(200);
  const preOver = await page.$eval('#mx-tokens', (el) => el.scrollWidth - el.clientWidth);
  assert(preOver <= 2, `色阶代码块横向溢出 ${preOver}px`);
  const escapes = await page.evaluate((tabs) => {
    const bad = [];
    for (const t of tabs) {
      const p = document.getElementById('p-' + t);
      if (getComputedStyle(p).display === 'none') continue;
      for (const card of p.querySelectorAll('.cl-card')) {
        const cb = card.getBoundingClientRect();
        for (const kid of card.querySelectorAll('.cl-ramp, .cl-figure, .cl-css-row, .cl-pal-item, table')) {
          const r = kid.getBoundingClientRect();
          if (r.width && (r.left < cb.left - 1 || r.right > cb.right + 1)) {
            bad.push(t + ' 里 ' + kid.className + ' 逃出了卡片');
          }
        }
      }
    }
    return bad;
  }, TABS);
  assert(escapes.length === 0, escapes.slice(0, 3).join('；'));

  // 6) 键盘可用：方向键切分区
  await show('convert');
  await page.focus('#tab-convert');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(150);
  assert(await page.getAttribute('#tab-chroma', 'aria-selected') === 'true', '方向键应能切换分区');
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(150);
  assert(await page.getAttribute('#tab-convert', 'aria-selected') === 'true', '方向键应能切回');

  // ---------- 缩略图 ----------
  await show('chroma');
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  await screenshot('thumb.png');
  console.log(`      (color-lab: ${assertions} 条浏览器断言)`);
};
