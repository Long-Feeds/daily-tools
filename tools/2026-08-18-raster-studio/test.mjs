// 渲染管线工作台 · Raster Studio 集成测试
//
// 三层断言：
//  1) 真实产物层 —— 画布里真的有着色过的像素；管线各级计数满足守恒式；点一个像素选中的三角形，
//     它的屏幕坐标真的把这个像素围在里面；裁剪结果真的落在六个平面内侧；关掉左上规则真的出现重叠像素。
//  2) 交互层 —— 真的换模型/着色/剔除/分辨率，真的拖动画布转视角，真的拖动裁剪三角形与光栅三角形。
//  3) 守卫层 —— [hidden] 的计算样式、逐 tab 控件最小尺寸、子元素不越出父格、无横向溢出、
//     无 text-transform 改写单位、canvas 文字「画出来几条」而不只是「掉了几条」。
//
// 引擎（矩阵/裁剪/光栅/透视校正）已在离线阶段对拍过：numpy 200 组矩阵、40 组投影与法线矩阵、
// 240 组裁剪的蒙特卡洛面积、120 个随机三角形的逐像素覆盖，外加 97 条 node 断言。这里只测「装进页面之后还是那一套」。
export default async function ({ page, toolURL, screenshot, assert }) {
  let n = 0;
  const ok = (cond, msg) => { n++; assert(cond, msg); };
  const near = (a, b, tol, msg) => ok(Math.abs(a - b) <= tol, `${msg}（实得 ${a}，期望 ${b} ±${tol}）`);

  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.rsReady === '1');

  const stats = () => page.evaluate(() => window.RSAPP.stats());
  const ds = () => page.evaluate(() => ({ ...document.documentElement.dataset }));
  const frame = () => page.evaluate(() => document.documentElement.dataset.rsFrame);
  const afterRender = async (fn) => {
    const before = await frame();
    await fn();
    await page.waitForFunction((b) => document.documentElement.dataset.rsFrame !== b, before, { timeout: 8000 });
  };
  const tab = async (name) => {
    await page.click('#rs-tab-' + name);
    await page.waitForFunction((t) => document.documentElement.dataset.rsTab === t, name);
    await page.waitForTimeout(120);
  };
  // 取整张画布的像素，用于逐像素比较
  const pixelsOf = (sel) => page.evaluate((s) => {
    const cv = document.querySelector(s);
    return Array.from(cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data);
  }, sel);
  const diffCount = (a, b) => {
    let n = 0;
    for (let i = 0; i < a.length; i += 4) if (Math.abs(a[i] - b[i]) > 30) n++;
    return n;
  };
  // 画布像素直方图
  const canvasInfo = (sel) => page.evaluate((s) => {
    const cv = document.querySelector(s);
    const ctx = cv.getContext('2d');
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
    const seen = new Set();
    let bg = 0, gray = 0, drawn = 0, blue = 0;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      if (r === 8 && g === 9 && b === 12) { bg++; continue; }
      drawn++;
      seen.add((r << 16) | (g << 8) | b);
      if (r === g && g === b) gray++;
      if (b > 120 && b > r + 40 && b > g + 20) blue++;
    }
    return { w: cv.width, h: cv.height, bg, drawn, gray, blue, colors: seen.size };
  }, sel);

  // ===================== 1. 渲染台 =====================
  {
    const info = await canvasInfo('#rs-canvas');
    ok(info.w === 480 && info.h === 320, `主画布内部分辨率 480 × 320（实得 ${info.w} × ${info.h}）`);
    ok(info.drawn > 40000, `画布上真的画出了东西（着色像素 ${info.drawn}）`);
    ok(info.colors > 400, `着色是连续的而不是纯色块（不同颜色 ${info.colors} 种）`);
    ok(info.bg > 2000, `背景仍然存在（背景像素 ${info.bg}）`);

    const st = await stats();
    ok(st.trisIn + st.fanExtra === st.trisRaster + st.trisCulled + st.trisDegenerate + st.trisClippedOut,
      `几何阶段守恒：输入 ${st.trisIn} + 裁剪扇形多出 ${st.fanExtra} = 光栅 ${st.trisRaster} + 剔除 ${st.trisCulled} + 退化 ${st.trisDegenerate} + 整块裁掉 ${st.trisClippedOut}`);
    ok(st.drawn + st.depthFail === st.frag,
      `片元守恒：覆盖 ${st.frag} = 写入 ${st.drawn} + 深度丢弃 ${st.depthFail}`);
    ok(st.drawn <= 480 * 320, `写入像素数不超过画布容量（${st.drawn} ≤ 153600）`);
    ok(st.trisCulled > st.trisIn * 0.3, `封闭模型有大量背面被剔除（${st.trisCulled}/${st.trisIn}）`);

    // HUD 上的数字与引擎统计一致
    const hud = await page.textContent('#rs-st-drawn');
    ok(hud.replace(/\s/g, '') === String(st.drawn), `HUD 写入像素数与引擎一致（${hud} vs ${st.drawn}）`);
    const inTxt = await page.textContent('#rs-st-in');
    ok(inTxt.replace(/\s/g, '') === String(st.trisIn), `HUD 输入三角形数与引擎一致（${inTxt}）`);

    // 关掉背面剔除：光栅三角形数必须增加，且守恒式仍成立
    await afterRender(() => page.selectOption('#rs-cull', 'none'));
    const st2 = await stats();
    ok(st2.trisCulled === 0, `不剔除时剔除数为 0（实得 ${st2.trisCulled}）`);
    ok(st2.trisRaster > st.trisRaster * 1.4, `不剔除时光栅三角形数显著增加（${st2.trisRaster} vs ${st.trisRaster}）`);
    ok(st2.trisIn + st2.fanExtra === st2.trisRaster + st2.trisDegenerate + st2.trisClippedOut, '不剔除时三角形数仍然守恒');
    await afterRender(() => page.selectOption('#rs-cull', 'back'));

    // 换模型：立方体 12 个三角形 + 地板 8 个
    await afterRender(() => page.click('#rs-models button[data-id="cube"]'));
    const st3 = await stats();
    ok(st3.trisIn === 20, `立方体 + 地板共 20 个三角形（实得 ${st3.trisIn}）`);
    ok(st3.trisCulled >= 6 && st3.trisCulled <= 8, `立方体的 6 个面里约一半背对相机（剔除 ${st3.trisCulled}）`);

    // 关掉地板：正好少 8 个三角形
    await afterRender(() => page.uncheck('#rs-floor'));
    const st4 = await stats();
    ok(st4.trisIn === 12, `只剩立方体的 12 个三角形（实得 ${st4.trisIn}）`);
    await afterRender(() => page.check('#rs-floor'));

    // 深度模式：画出来的必须是灰度
    await afterRender(() => page.click('#rs-modes button[data-id="depth"]'));
    const dinfo = await canvasInfo('#rs-canvas');
    ok(dinfo.gray === dinfo.drawn, `深度模式下所有着色像素都是灰度（${dinfo.gray}/${dinfo.drawn}）`);

    // 线框模式：蓝线占少数、且确实存在
    await afterRender(() => page.click('#rs-modes button[data-id="wire"]'));
    const winfo = await canvasInfo('#rs-canvas');
    ok(winfo.blue > 300, `线框模式画出了蓝色线段（蓝色像素 ${winfo.blue}）`);
    ok(winfo.blue < winfo.drawn * 0.35, `线框只是少量线条而不是填满（${winfo.blue}/${winfo.drawn}）`);

    // 法线模式：立方体每个面只有一个法线，颜色数必然很少
    await afterRender(() => page.click('#rs-modes button[data-id="normal"]'));
    const cubeN = await canvasInfo('#rs-canvas');
    ok(cubeN.colors <= 10, `立方体在法线模式下只有平面法线（${cubeN.colors} 种颜色）`);
    // 换回曲面模型：法线连续变化，颜色数应该多两个数量级
    await afterRender(() => page.click('#rs-models button[data-id="knot"]'));
    const ninfo = await canvasInfo('#rs-canvas');
    ok(ninfo.colors > 800, `曲面在法线模式下颜色丰富（${ninfo.colors} 种，立方体只有 ${cubeN.colors} 种）`);
    await afterRender(() => page.click('#rs-modes button[data-id="texture"]'));

    // 分辨率与超采样
    await afterRender(() => page.selectOption('#rs-res', '240x160'));
    const small = await canvasInfo('#rs-canvas');
    ok(small.w === 240 && small.h === 160, `切到 240 × 160（实得 ${small.w} × ${small.h}）`);
    const badge = await page.textContent('#rs-badge-res');
    ok(badge.includes('240') && badge.includes('160'), `角标显示当前分辨率（${badge}）`);
    await afterRender(() => page.selectOption('#rs-ss', '2'));
    const ssInfo = await canvasInfo('#rs-canvas');
    ok(ssInfo.colors > small.colors, `2 × 2 超采样让颜色层次变多（${ssInfo.colors} vs ${small.colors}）`);
    const badge2 = await page.textContent('#rs-badge-res');
    ok(badge2.includes('超采样'), `角标标出超采样（${badge2}）`);
    await afterRender(() => page.selectOption('#rs-ss', '1'));
    await afterRender(() => page.selectOption('#rs-res', '480x320'));

    // 拖动画布真的转了视角
    const yaw0 = await page.evaluate(() => window.RSAPP.S.yaw);
    await page.locator('#rs-canvas').scrollIntoViewIfNeeded();
    const box = await page.locator('#rs-canvas').boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 80, box.y + box.height / 2 + 20, { steps: 6 });
    await page.mouse.up();
    await page.waitForTimeout(120);
    const yaw1 = await page.evaluate(() => window.RSAPP.S.yaw);
    ok(Math.abs(yaw1 - yaw0) > 0.2, `拖动后相机方位角改变（${yaw0.toFixed(2)} → ${yaw1.toFixed(2)}）`);

    // 场景库：保存一条并载入
    await page.fill('#rs-name', '测试场景');
    await page.click('#rs-save2');
    await page.waitForSelector('.rs-scene');
    const rows = await page.locator('.rs-scene').count();
    ok(rows === 1, `场景库里有 1 条记录（实得 ${rows}）`);
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('raster-studio-v1')).scenes[0]);
    ok(saved.name === '测试场景', `保存的场景名正确（${saved.name}）`);
    near(saved.state.yaw, yaw1, 1e-6, '保存的场景记下了当前视角');
    await afterRender(() => page.click('#rs-reset'));
    const yaw2 = await page.evaluate(() => window.RSAPP.S.yaw);
    near(yaw2, 0.72, 1e-9, '重置视角回到默认方位角');
    await afterRender(() => page.locator('.rs-scene button', { hasText: '载入' }).first().click());
    const yaw3 = await page.evaluate(() => window.RSAPP.S.yaw);
    near(yaw3, yaw1, 1e-6, '载入场景恢复了保存时的视角');
    await afterRender(() => page.click('#rs-reset'));
  }

  // ===================== 2. 管线剖面 =====================
  {
    // 在画布中央点一下：选中的三角形必须真的把这个像素围在里面
    await page.locator('#rs-canvas').scrollIntoViewIfNeeded();
    const box = await page.locator('#rs-canvas').boundingBox();
    const px = Math.round(box.width * 0.5), py = Math.round(box.height * 0.42);
    await page.mouse.click(box.x + px, box.y + py);
    await page.waitForTimeout(150);
    const pick = await page.evaluate(() => window.RSAPP.picked());
    ok(pick.srcTri >= 0, `点画面选中了一个三角形（第 ${pick.srcTri} 号）`);
    const hit = await page.evaluate(([cssX, cssY]) => {
      const app = window.RSAPP, fb = app.fb(), RS = app.RS;
      const cv = document.getElementById('rs-canvas');
      const r = cv.getBoundingClientRect();
      const x = Math.floor(cssX / r.width * fb.w) * fb.ss;
      const y = Math.floor(cssY / r.height * fb.h) * fb.ss;
      const id = fb.owner[y * fb.sw + x];
      const t = fb.triList[id];
      const e0 = RS.edgeFn(t.v[0].x, t.v[0].y, t.v[1].x, t.v[1].y, x + 0.5, y + 0.5);
      const e1 = RS.edgeFn(t.v[1].x, t.v[1].y, t.v[2].x, t.v[2].y, x + 0.5, y + 0.5);
      const e2 = RS.edgeFn(t.v[2].x, t.v[2].y, t.v[0].x, t.v[0].y, x + 0.5, y + 0.5);
      return { same: (e0 >= 0 && e1 >= 0 && e2 >= 0) || (e0 <= 0 && e1 <= 0 && e2 <= 0), id, srcTri: t.srcTri, objIdx: t.objIdx };
    }, [px, py]);
    ok(hit.same, '被点中的像素中心确实落在所选三角形的三条边内侧（三个边函数同号）');
    ok(hit.srcTri === pick.srcTri && hit.objIdx === pick.obj, '拾取到的三角形编号与面板显示一致');

    await tab('pipe');
    const rowsTb = await page.locator('#rs-pipe-tb tbody tr').count();
    ok(rowsTb === 8, `管线表有 7 级坐标 + 1 行面积（实得 ${rowsTb} 行）`);
    const cells = await page.locator('#rs-pipe-tb tbody tr').nth(4).locator('td').allTextContents();
    ok(cells.length === 3, '裁剪坐标 w 一行有三个顶点');
    const ws = cells.map((c) => parseFloat(c.replace('−', '-')));
    ok(ws.every((w) => w > 0 && w < 40), `clip.w 都是正的视距（${ws.map((w) => w.toFixed(2)).join(' / ')}）`);
    // clip.w 必须等于该顶点到相机的视距
    const wCheck = await page.evaluate(() => {
      const app = window.RSAPP, RS = app.RS, S = app.S, p = app.picked();
      const fb = app.fb();
      const mats = RS.cameraMatrices({ yaw: S.yaw, pitch: S.pitch, dist: S.dist, target: [0, 0, 0], fov: S.fov, near: S.near, far: S.far }, fb.w, fb.h);
      const tri = fb.triList.find((t) => t.srcTri === p.srcTri && t.objIdx === p.obj);
      let worst = 0;
      for (const v of tri.v) {
        const view = RS.xformPoint(mats.view, v.w);
        worst = Math.max(worst, Math.abs((1 / v.iw) - (-view[2])));
      }
      return worst;
    });
    ok(wCheck < 1e-6, `clip.w 精确等于视空间的 −z（最大偏差 ${wCheck.toExponential(1)}）`);

    // 矩阵网格：4 个矩阵 × 16 个数
    const matCells = await page.locator('#rs-matgrid .rs-grid4 b').count();
    ok(matCells === 64, `四个 4 × 4 矩阵共 64 个数（实得 ${matCells}）`);
    const mvpOk = await page.evaluate(() => {
      const app = window.RSAPP, RS = app.RS, S = app.S;
      const fb = app.fb();
      const mats = RS.cameraMatrices({ yaw: S.yaw, pitch: S.pitch, dist: S.dist, target: [0, 0, 0], fov: S.fov, near: S.near, far: S.far }, fb.w, fb.h);
      const model = RS.matTranslate(0, S.floor ? 0.35 : 0, 0);
      const mvp = RS.matMulAll([mats.proj, mats.view, model]);
      const cells = [...document.querySelectorAll('#rs-matgrid .rs-mat')][3].querySelectorAll('b');
      let worst = 0;
      for (let i = 0; i < 16; i++) {
        const shown = parseFloat(cells[i].textContent);
        if (!isFinite(shown)) continue;
        worst = Math.max(worst, Math.abs(shown - mvp[i]));
      }
      return worst;
    });
    ok(mvpOk < 0.005, `页面显示的 MVP 与现算的一致（最大偏差 ${mvpOk}）`);

    // 漏斗条：最后一行必须等于统计里的写入像素数
    const bars = await page.locator('#rs-stagebars .rs-stagerow').count();
    ok(bars === 9, `漏斗有 9 级（实得 ${bars}）`);
    const lastBar = (await page.locator('#rs-stagebars .rs-stagerow em').last().textContent()).replace(/\s/g, '');
    const pipeStat = await page.evaluate(() => {
      const cv = document.getElementById('rs-pipe-cv');
      return cv.width * cv.height;
    });
    ok(parseInt(lastBar, 10) > 0 && parseInt(lastBar, 10) <= pipeStat,
      `漏斗末级的写入像素数在画布容量之内（${lastBar} ≤ ${pipeStat}）`);

    // 放大镜：三个顶点标号 + 倍数说明都真的画出来了
    const pipeTexts = await page.evaluate(() => window.__RSDBG.placers.pipe.texts.slice());
    ok(['v0', 'v1', 'v2'].every((t) => pipeTexts.includes(t)), `放大镜里三个顶点标号都画出来了（${pipeTexts.join(' ')}）`);
    ok(pipeTexts.some((t) => t.indexOf('放大') === 0), '放大倍数说明画出来了');
    const pipeDrop = await page.evaluate(() => window.__RSDBG.placers.pipe.dropped);
    ok(pipeDrop === 0, `管线画布没有标注被挤掉（dropped ${pipeDrop}）`);

    // 投影矩阵解读表
    const projRows = await page.locator('#rs-proj-tb tbody tr').count();
    ok(projRows === 7, `投影矩阵解读表 7 行（实得 ${projRows}）`);
  }

  // ===================== 3. 齐次裁剪 =====================
  {
    await tab('clip');
    const outN = await page.textContent('#rs-clip-n');
    ok(outN === '4', `默认姿态下三角形跨过近平面，被裁成四边形（实得 ${outN} 个顶点）`);
    const clipRows = await page.locator('#rs-clip-tb tbody tr').count();
    ok(clipRows === 4, `裁剪结果表 4 行（实得 ${clipRows}）`);
    const newCount = await page.locator('#rs-clip-tb tbody tr', { hasText: '新' }).count();
    ok(newCount === 2, `其中 2 个是插值出来的新顶点（实得 ${newCount}）`);

    // 裁剪结果必须逐顶点满足六个不等式，且新顶点恰好落在近平面上
    const inside = await page.evaluate(() => {
      const RS = window.RSAPP.RS, tri = window.RSAPP.clipTri;
      const P = RS.matPerspective(40, 1.2, 1.2, 9);
      const poly = tri.map((p, i) => {
        const b = [0, 0, 0]; b[i] = 1;
        return { c: RS.matApply(P, [p[0], 0, p[1], 1]), w: [p[0], 0, p[1]], n: [0, 1, 0], uv: [0, 0], b };
      });
      const out = RS.clipPolygon(poly, RS.FRUSTUM_PLANES.map((q) => q.p));
      let worst = 0, onNear = 0;
      for (const v of out) {
        for (const pl of RS.FRUSTUM_PLANES) worst = Math.min(worst, RS.planeDist(pl.p, v.c));
        if (Math.abs(v.c[3] - 1.2) < 1e-9) onNear++;   // 视距恰好等于近平面
        if (Math.abs(v.b[0] + v.b[1] + v.b[2] - 1) > 1e-12) worst = -99;
      }
      return { worst, onNear, len: out.length };
    });
    ok(inside.worst > -1e-9, `裁剪后每个顶点都在六个平面内侧（最差 ${inside.worst}）`);
    ok(inside.onNear === 2, `两个新顶点的视距精确等于近平面 1.2（实得 ${inside.onNear} 个）`);

    // 拖动一个顶点（把整个三角形推到相机背后）
    await page.evaluate(() => {
      window.RSAPP.clipTri[0] = [0.4, 1.6];
      window.RSAPP.clipTri[1] = [1.2, 2.4];
      window.RSAPP.clipTri[2] = [-0.8, 3.2];
      window.RSAPP.drawClip();
    });
    const behind = await page.textContent('#rs-clip-n');
    ok(behind === '0', `整个三角形推到相机背后后一个顶点都不剩（实得 ${behind}）`);
    const note = await page.textContent('#rs-clip-note');
    ok(note.includes('视锥之外'), `文案说明它被整个丢掉了（${note.slice(0, 20)}…）`);
    await page.evaluate(() => {
      window.RSAPP.clipTri[0] = [0.05, -0.4];
      window.RSAPP.clipTri[1] = [2.1, -5.4];
      window.RSAPP.clipTri[2] = [-2.4, -7.4];
      window.RSAPP.drawClip();
    });
    ok((await page.textContent('#rs-clip-n')) === '4', '拖回来之后又变回四边形');

    // 关掉近平面：这个三角形不再被裁
    const sceneBefore = await pixelsOf('#rs-clip-scene');
    await page.click('#rs-planes button[data-plane="4"]');
    await page.waitForTimeout(200);
    const off = await page.textContent('#rs-clip-n');
    ok(off === '3', `关掉近平面后不再裁剪，输出仍是 3 个顶点（实得 ${off}）`);
    const planeState = await page.evaluate(() => window.RSAPP.clipPlanesOn.slice());
    ok(planeState[4] === false && planeState.filter(Boolean).length === 5, '只有近平面被关掉');
    // 只关近平面时画面几乎不变 —— w < 0 的顶点同样过不了侧向不等式，这是本引擎的真实行为
    const sceneNearOff = await pixelsOf('#rs-clip-scene');
    const diffNear = diffCount(sceneBefore, sceneNearOff);
    ok(diffNear === 0, `只关近平面时场景画面不变（差异 ${diffNear} 个像素），侧向平面已经把它挡下了`);
    const capNear = await page.textContent('#rs-clip-cap');
    ok(capNear.includes('看不出差别'), `图注如实说明只关近平面看不出差别（${capNear.slice(0, 18)}…）`);
    // 六个全关：1/w 把相机背后的几何翻上来，画面当场不同
    // （关掉单个平面之后「全部打开」已自动取消勾选，所以要先勾回去再取消，才会触发全关）
    await page.check('#rs-clip-all');
    await page.waitForTimeout(150);
    await page.uncheck('#rs-clip-all');
    await page.waitForTimeout(250);
    const allOffState = await page.evaluate(() => window.RSAPP.clipPlanesOn.slice());
    ok(allOffState.every((v) => v === false), '六个平面全部关掉');
    const sceneAllOff = await pixelsOf('#rs-clip-scene');
    const diffAll = diffCount(sceneBefore, sceneAllOff);
    ok(diffAll > 500, `六个平面全关之后画面明显撕开（差异 ${diffAll} 个像素）`);
    const capAll = await page.textContent('#rs-clip-cap');
    ok(capAll.includes('撕开'), `图注说明几何被撕开了（${capAll.slice(0, 18)}…）`);
    await page.check('#rs-clip-all');
    await page.waitForTimeout(200);
    const backOn = await pixelsOf('#rs-clip-scene');
    ok(diffCount(sceneBefore, backOn) === 0, '六个平面重新打开后画面逐像素回到原样');
    ok((await page.textContent('#rs-clip-n')) === '4', '重新打开近平面后又开始裁剪');

    const clipTexts = await page.evaluate(() => window.__RSDBG.placers.clip.texts.slice());
    ok(['A', 'B', 'C', '相机'].every((t) => clipTexts.includes(t)), `俯视图的四个关键标注都画出来了（${clipTexts.join(' ')}）`);
    ok(clipTexts.some((t) => t.includes('近平面')) && clipTexts.some((t) => t.includes('远平面')), '近/远平面标注都画出来了');
    ok((await page.evaluate(() => window.__RSDBG.placers.clip.dropped)) === 0, '俯视图没有标注被挤掉');
  }

  // ===================== 4. 深度与插值 =====================
  {
    await tab('depth');
    const d = await ds();
    const errPc = parseFloat(d.rsErrPc), errAff = parseFloat(d.rsErrAff);
    ok(errPc < 0.02, `透视校正插值与射线-平面解析解一致（最大 u 偏差 ${errPc}）`);
    ok(errAff > 0.15, `仿射插值明显偏离解析解（最大 u 偏差 ${errAff}）`);
    ok(errAff > errPc * 8, `仿射误差是透视校正的 ${(errAff / errPc).toFixed(0)} 倍以上`);
    const dRows = await page.locator('#rs-d-tb tbody tr').count();
    ok(dRows === 2, `插值对比表 2 行（实得 ${dRows}）`);
    const verdict = await page.textContent('#rs-d-tb tbody tr:nth-child(2)');
    ok(verdict.includes('偏了'), `仿射那一行给出了偏离程度（${verdict.replace(/\s+/g, ' ').trim().slice(0, 40)}）`);

    // 两张图必须真的不同
    const pcInfo = await canvasInfo('#rs-d-pc');
    const affInfo = await canvasInfo('#rs-d-aff');
    ok(pcInfo.drawn > 20000 && affInfo.drawn > 20000, '两张地板图都画满了');
    const diff = await page.evaluate(() => {
      const a = document.getElementById('rs-d-pc').getContext('2d').getImageData(0, 0, 280, 200).data;
      const b = document.getElementById('rs-d-aff').getContext('2d').getImageData(0, 0, 280, 200).data;
      let n = 0;
      for (let i = 0; i < a.length; i += 4) if (Math.abs(a[i] - b[i]) > 60) n++;
      return n;
    });
    ok(diff > 3000, `透视校正与仿射两张图逐像素差异明显（${diff} 个像素）`);

    // 抬高俯角（更垂直地俯视）——同一块地板横跨的深度范围变小，仿射的平均误差必须跟着变小
    const meanCell = '#rs-d-tb tbody tr:nth-child(2) td:nth-child(3)';
    const meanLow = parseFloat(await page.textContent(meanCell));
    await page.evaluate(() => {
      const el = document.getElementById('rs-d-pitch');
      el.value = '1.2';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForTimeout(500);
    const meanHigh = parseFloat(await page.textContent(meanCell));
    ok(meanHigh < meanLow, `俯角从 0.24 抬到 1.2 之后仿射的平均误差变小（${meanLow} → ${meanHigh}）`);
    const d2 = await ds();
    ok(parseFloat(d2.rsErrPc) < 0.02, `俯角改变后透视校正依然贴合解析解（${d2.rsErrPc}）`);
    await page.evaluate(() => {
      const el = document.getElementById('rs-d-pitch');
      el.value = '0.24';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForTimeout(400);

    // 深度精度曲线
    const zTexts = await page.evaluate(() => window.__RSDBG.placers.zchart.texts.slice());
    ok(zTexts.includes('视距（横轴）'), `横轴标题画出来了（${zTexts.length} 条标注）`);
    ok(zTexts.filter((t) => t.indexOf('10') === 0).length >= 5, `纵轴刻度至少画出 5 条（实得 ${zTexts.filter((t) => t.indexOf('10') === 0).length}）`);
    ok(zTexts.some((t) => t.indexOf('near =') === 0), '主曲线图例画出来了');
    ok(zTexts.some((t) => t.indexOf('对照') === 0), '对照曲线图例画出来了');
    ok(zTexts.some((t) => t.indexOf('视距 ') === 0 && t.includes('处约')), '曲线上的读数标注画出来了');
    const zDrop = await page.evaluate(() => window.__RSDBG.placers.zchart.dropped);
    ok(zDrop <= 1, `深度曲线图最多只有超出画布的刻度被舍弃（dropped ${zDrop}）`);
    const zRows = await page.locator('#rs-z-tb tbody tr').count();
    ok(zRows === 4, `深度精度读数表 4 行（实得 ${zRows}）`);
    const firstCell = await page.textContent('#rs-z-tb tbody tr:first-child td:nth-child(2)');
    await page.evaluate(() => {
      const el = document.getElementById('rs-z-near');
      el.value = '1';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForTimeout(200);
    const firstCell2 = await page.textContent('#rs-z-tb tbody tr:first-child td:nth-child(2)');
    ok(firstCell !== firstCell2, `抬高近平面后可分辨深度差跟着变（${firstCell} → ${firstCell2}）`);
    // 抬高 near 之后远处精度必须变好（数值变小）
    const better = await page.evaluate(() => {
      const RS = window.RSAPP.RS;
      return RS.depthResolution(1, 1000, 100, 24) < RS.depthResolution(0.05, 1000, 100, 24);
    });
    ok(better, 'near 从 0.05 抬到 1 之后，100 米处的可分辨深度差确实变小');

    // z-fighting：默认间距下条纹翻转比例很高，拉开之后归零
    const zf1 = parseFloat((await ds()).rsZfFlip);
    ok(zf1 > 0.05, `默认间距下出现 z-fighting 条纹（翻转比例 ${zf1}）`);
    await page.evaluate(() => {
      const el = document.getElementById('rs-zf-delta');
      el.value = '40';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForTimeout(300);
    const zf2 = parseFloat((await ds()).rsZfFlip);
    ok(zf2 < 0.01, `把两片拉开之后条纹消失（翻转比例 ${zf2}）`);
    const zfCap = await page.textContent('#rs-zf-cap');
    ok(zfCap.includes('分得清'), `图注说明已经分得清了（${zfCap.slice(0, 24)}…）`);

    // 画家算法 vs 深度缓冲
    const pd = parseInt((await ds()).rsPainterDiff, 10);
    ok(pd > 500, `互相穿插的两片：画家算法与深度缓冲相差 ${pd} 个像素`);
    const paNote = await page.textContent('#rs-pa-note');
    ok(paNote.includes('画错了'), '文案给出了画错的像素数');
  }

  // ===================== 5. 光栅规则 =====================
  {
    await tab('raster');
    const c1 = parseInt(await page.textContent('#rs-r-c1'), 10);
    const c2 = parseInt(await page.textContent('#rs-r-c2'), 10);
    const cov = await page.evaluate(() => window.RSAPP.coverage());
    ok(c1 === cov.t1 && c2 === cov.t2, `覆盖数与引擎一致（${c1}/${c2} vs ${cov.t1}/${cov.t2}）`);
    ok(c1 >= 25 && c2 >= 25, `两个三角形都覆盖了足够多的像素（${c1} / ${c2}）`);
    // 两个三角形拼成一个平行四边形：覆盖像素总数应当贴近它的解析面积
    const geo = await page.evaluate(() => {
      const RS = window.RSAPP.RS, t = window.RSAPP.rTri;
      const area = Math.abs(RS.edgeFn(t[0][0], t[0][1], t[1][0], t[1][1], t[2][0], t[2][1]));
      const per = 2 * (Math.hypot(t[1][0] - t[0][0], t[1][1] - t[0][1]) + Math.hypot(t[2][0] - t[1][0], t[2][1] - t[1][1]));
      return { area, per };
    });
    ok(Math.abs((c1 + c2) - geo.area) <= geo.per,
      `覆盖总数 ${c1 + c2} 贴近平行四边形面积 ${geo.area.toFixed(1)}（容差为周长 ${geo.per.toFixed(1)}）`);
    ok((await page.textContent('#rs-r-dup')) === '0', '左上规则开启时零重叠');
    ok((await page.textContent('#rs-r-gap')) === '0', '左上规则开启时零缝隙');

    // 关掉左上规则：共享的竖边整列被画两次
    await page.uncheck('#rs-r-rule');
    await page.waitForTimeout(150);
    const dup = parseInt(await page.textContent('#rs-r-dup'), 10);
    ok(dup >= 10, `关掉左上规则后共享竖边整列被画两次（重叠 ${dup} 个像素）`);
    const dupNote = await page.textContent('#rs-r-note');
    ok(dupNote.includes('规则已关闭'), '文案说明规则已关闭');
    const dsRaster = await ds();
    ok(parseInt(dsRaster.rsRdup, 10) === dup, '页面标记与显示的重叠数一致');
    await page.check('#rs-r-rule');
    await page.waitForTimeout(150);
    ok((await page.textContent('#rs-r-dup')) === '0', '重新打开规则后重叠归零');

    // 点一个恰好压在共享边上的像素：读数表要说清它归谁
    await page.evaluate(() => {
      const cv = document.getElementById('rs-r-cv');
      const r = cv.getBoundingClientRect();
      const k = r.width / cv.width;
      const ev = new PointerEvent('pointerdown', {
        clientX: r.left + (38 + 8 * 27 + 13) * k, clientY: r.top + (24 + 7 * 27 + 13) * k, bubbles: true
      });
      cv.dispatchEvent(ev);
    });
    await page.waitForTimeout(150);
    const selRows = await page.locator('#rs-r-tb tbody tr').count();
    ok(selRows === 5, `选中像素后读数表 5 行（实得 ${selRows}）`);
    const selText = await page.textContent('#rs-r-tb');
    ok(selText.includes('边上'), `落在共享边上的像素被判为「边上」（读数表：${selText.replace(/\s+/g, ' ').slice(0, 60)}…）`);
    ok(selText.includes('弃') || selText.includes('收'), '并给出了收/弃的结论');

    // 拖动顶点：覆盖数跟着变
    const before = parseInt(await page.textContent('#rs-r-c1'), 10);
    await page.evaluate(() => window.RSAPP.setRTri(1, 5.0, 9.0));
    await page.waitForTimeout(120);
    const after = parseInt(await page.textContent('#rs-r-c1'), 10);
    ok(after !== before, `拖动顶点 B 之后覆盖像素数改变（${before} → ${after}）`);
    const covAfter = await page.evaluate(() => window.RSAPP.coverage());
    ok(after === covAfter.t1, '改动后覆盖数依然与引擎一致');
    await page.evaluate(() => window.RSAPP.setRTri(1, 2.4, 4.2));
    await page.waitForTimeout(120);

    const rTexts = await page.evaluate(() => window.__RSDBG.placers.raster.texts.slice());
    ok(['A', 'B', 'C'].every((t) => rTexts.includes(t)), '三个顶点标号都画出来了');
    ok(rTexts.filter((t) => /^\d+$/.test(t)).length >= 18, `网格坐标刻度画出了 ${rTexts.filter((t) => /^\d+$/.test(t)).length} 条`);
    ok((await page.evaluate(() => window.__RSDBG.placers.raster.dropped)) === 0, '光栅网格没有标注被挤掉');
  }

  // ===================== 6. 守卫层 =====================
  {
    // [hidden] 必须真的隐藏（作者 CSS 与 UA 规则同特异性的老陷阱）
    const hiddenOk = await page.evaluate(() => {
      const ids = ['rs-p-view', 'rs-p-pipe', 'rs-p-clip', 'rs-p-depth', 'rs-p-raster'];
      const cur = document.documentElement.dataset.rsTab;
      return ids.filter((id) => id !== 'rs-p-' + cur)
        .every((id) => getComputedStyle(document.getElementById(id)).display === 'none');
    });
    ok(hiddenOk, '非当前面板的计算样式确实是 display:none');

    // 逐 tab 扫控件最小尺寸（隐藏面板里的控件对尺寸守卫失明，必须切过去再扫）
    let scanned = 0, tooSmall = [];
    for (const t of ['view', 'pipe', 'clip', 'depth', 'raster']) {
      await tab(t);
      const res = await page.evaluate(() => {
        const bad = [];
        let count = 0;
        for (const el of document.querySelectorAll('input,select,button')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          count++;
          const type = el.getAttribute('type');
          if (type === 'checkbox' || type === 'color') {
            if (r.width < 18 || r.height < 18) bad.push(el.id || el.className);
          } else if (el.tagName === 'BUTTON') {
            if (r.width < 52 || r.height < 18) bad.push((el.id || el.textContent).slice(0, 14) + ':' + Math.round(r.width) + 'x' + Math.round(r.height));
          } else if (type === 'range') {
            if (r.width < 100 || r.height < 18) bad.push((el.id) + ':' + Math.round(r.width) + 'x' + Math.round(r.height));
          } else {
            if (r.width < 100 || r.height < 18) bad.push((el.id || el.name) + ':' + Math.round(r.width) + 'x' + Math.round(r.height));
          }
        }
        return { bad, count };
      });
      scanned += res.count;
      tooSmall = tooSmall.concat(res.bad);
    }
    ok(scanned >= 60, `逐 tab 一共扫到 ${scanned} 个可见控件`);
    ok(tooSmall.length === 0, `没有被压塌的控件（问题项：${tooSmall.join(', ')}）`);

    // 单位不能被 text-transform 改写成错字
    const upper = await page.evaluate(() => {
      const bad = [];
      for (const el of document.querySelectorAll('th,dt,label,figcaption')) {
        const t = (el.textContent || '');
        if (/\b(HZ|KHZ|DBFS|DB|PX|MS|NDC\.X)\b/.test(t)) bad.push(t.slice(0, 20));
        if (getComputedStyle(el).textTransform === 'uppercase') bad.push('uppercase:' + t.slice(0, 16));
      }
      return bad;
    });
    ok(upper.length === 0, `没有被 uppercase 改写的单位（问题项：${upper.join(' | ')}）`);

    // 子元素不越出父格（窄格 + 变长文本的老问题）
    await tab('view');
    const escaped = await page.evaluate(() => {
      const bad = [];
      for (const box of document.querySelectorAll('.rs-statgrid div, .rs-scene, .rs-hud > div')) {
        const pr = box.getBoundingClientRect();
        for (const ch of box.children) {
          const cr = ch.getBoundingClientRect();
          if (cr.width === 0) continue;
          if (cr.left < pr.left - 1 || cr.right > pr.right + 1 || cr.top < pr.top - 1 || cr.bottom > pr.bottom + 1) {
            bad.push((ch.textContent || '').slice(0, 12));
          }
        }
      }
      return bad;
    });
    ok(escaped.length === 0, `没有子元素越出父格（问题项：${escaped.join(' | ')}）`);

    // 卡片内不出现横向溢出
    const overflow = await page.evaluate(() => {
      const bad = [];
      for (const el of document.querySelectorAll('.rs-card, .rs-mat, .rs-hud')) {
        if (el.scrollWidth - el.clientWidth > 2) bad.push(el.className + ':' + (el.scrollWidth - el.clientWidth));
      }
      return bad;
    });
    ok(overflow.length === 0, `卡片内没有横向溢出（问题项：${overflow.join(' | ')}）`);

    const pageOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(pageOverflow <= 0, `1280 宽下页面没有横向滚动（溢出 ${pageOverflow}px）`);

    // 字形描边必须配 paint-order（黑白棋子那次的教训）
    const strokeOk = await page.evaluate(() => {
      const html = document.documentElement.outerHTML;
      const s = (html.match(/text-stroke/g) || []).length;
      const p = (html.match(/paint-order/g) || []).length;
      return s === 0 || p > 0;
    });
    ok(strokeOk, '没有使用 -webkit-text-stroke，或者已经配了 paint-order');

    // 返回链接
    const back = await page.getAttribute('.rs-back', 'href');
    ok(back === '../../', `顶部有返回工具集的链接（${back}）`);

    // 窄屏
    await page.setViewportSize({ width: 390, height: 900 });
    await page.waitForTimeout(300);
    const narrowOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(narrowOverflow <= 1, `390 宽下页面没有横向滚动（溢出 ${narrowOverflow}px）`);
    const canvasFits = await page.evaluate(() => {
      const r = document.getElementById('rs-canvas').getBoundingClientRect();
      return r.width <= window.innerWidth;
    });
    ok(canvasFits, '窄屏下主画布不超出视口宽度');
    await page.setViewportSize({ width: 1280, height: 850 });
    await page.waitForTimeout(250);
  }

  // ===================== 缩略图 =====================
  await tab('view');
  await afterRender(() => page.evaluate(() => {
    window.RSAPP.S.yaw = 0.72;
    window.RSAPP.S.pitch = 0.42;
    window.RSAPP.render();
  }));
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  await screenshot('thumb.png');

  if (process.env.RS_SHOTS) {
    for (const t of ['pipe', 'clip', 'depth', 'raster']) {
      await tab(t);
      await page.waitForTimeout(400);
      await screenshot('review-' + t + '.png');
    }
    await tab('view');
    await page.setViewportSize({ width: 390, height: 900 });
    await page.waitForTimeout(300);
    await screenshot('review-narrow.png');
    await page.evaluate(() => window.scrollTo(0, 900));
    await screenshot('review-narrow2.png');
    await page.setViewportSize({ width: 1280, height: 850 });
  }

  console.log('    (raster-studio: ' + n + ' 条断言)');
}
