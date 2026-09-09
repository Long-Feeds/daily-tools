// 集成测试 · 计算几何工作台
// 真的操作交互并断言算出来的数（面积/顶点数/判定），不是只查元素在不在。
// 期望值全部来自离线三方对拍（GEOS / Clipper / Qhull / earcut / Fraction）或闭式解。
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.getAttribute('data-gx-ready') === '1');

  const txt = async (sel) => ((await page.locator(sel).textContent()) || '').trim();
  const num = async (sel) => Number((await txt(sel)).replace(/[,%\s]/g, ''));
  const near = (a, b, tol, what) => assert(Math.abs(a - b) <= tol, `${what}：得到 ${a}，期望 ${b}±${tol}`);
  const showTab = async (name) => {
    await page.click(`#gx-tabbtn-${name}`);
    await page.waitForFunction((n) => !document.getElementById('gx-panel-' + n).hidden, name);
  };

  // ---------- 1. 返回链接与基本骨架 ----------
  assert((await page.locator('#gx-back').getAttribute('href')) === '../../', '顶部有「← 返回工具集」且指向站点根');
  assert((await txt('#gx-back')).includes('返回工具集'), '返回链接文案正确');

  // ---------- 2. 点集：凸包 / Delaunay / Voronoi 的真实读数 ----------
  // 用 WKT 导入一个已知点集：4×4=16 个整点网格（边长 30）
  const gridPts = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) gridPts.push(`(${i * 30} ${j * 30})`);
  await page.fill('#gx-pt-io', `MULTIPOINT (${gridPts.join(', ')})`);
  await page.click('#gx-pt-import');
  await page.waitForFunction(() => document.getElementById('gx-pt-n-out').textContent.trim() === '16');
  near(await num('#gx-pt-harea'), 8100, 5e-3, '4×4 网格（步长 30）的凸包面积 = 90×90');
  near(await num('#gx-pt-hperim'), 360, 5e-3, '凸包周长 = 4×90');
  assert((await num('#gx-pt-hull')) === 4, '凸包顶点数 = 4');
  assert((await num('#gx-pt-tri')) === 18, `网格三角形数应为 2×3×3=18（得到 ${await num('#gx-pt-tri')}）`);
  assert((await num('#gx-pt-edge')) === 33, `网格 Delaunay 边数应为 3V−3−h=33（得到 ${await num('#gx-pt-edge')}）`);
  near(await num('#gx-pt-close'), 30, 5e-5, '最近点对距离 = 网格步长 30');
  near(await num('#gx-pt-diam'), Math.hypot(90, 90), 5e-4, '直径 = 网格对角线');
  near(await num('#gx-pt-mec'), Math.hypot(45, 45), 5e-4, '最小外接圆半径 = 半对角线');
  near(await num('#gx-pt-rect'), 8100, 5e-3, '最小面积外接矩形 = 8100');
  // Delaunay/Voronoi 图元真的画出来了（几何断言，不只是数字）
  const triSeg = await page.evaluate(() => {
    const paths = [...document.querySelectorAll('#gx-pt-stage path')];
    const tri = paths.find((p) => p.getAttribute('stroke') === '#ffffff' && p.getAttribute('stroke-opacity') === '0.26');
    return tri ? (tri.getAttribute('d').match(/M/g) || []).length : 0;
  });
  assert(triSeg === 33, `三角网真的画了 33 段（得到 ${triSeg}）`);
  const vorCells = await page.locator('#gx-pt-stage path[stroke="#c3d9f3"]').count();
  assert(vorCells === 16, `Voronoi 画出 16 个胞腔（得到 ${vorCells}）`);
  const dots = await page.locator('#gx-pt-stage circle[fill="#ffffff"]').count();
  assert(dots === 16, `画布上有 16 个点（得到 ${dots}）`);
  // 图层开关真的会让图元消失
  await page.uncheck('#gx-pt-l-vor');
  await page.waitForFunction(() => document.querySelectorAll('#gx-pt-stage path[stroke="#c3d9f3"]').length === 0);
  await page.check('#gx-pt-l-vor');
  await page.waitForFunction(() => document.querySelectorAll('#gx-pt-stage path[stroke="#c3d9f3"]').length === 16);
  // 导出往返
  await page.click('#gx-pt-export');
  const ptWkt = await page.inputValue('#gx-pt-io');
  assert(/^MULTIPOINT \(/.test(ptWkt) && (ptWkt.match(/\(/g) || []).length === 17, 'WKT 导出为 MULTIPOINT 且含 16 个点');

  // ---------- 3. 布尔运算：与 GEOS 已核对的解析值逐个对上 ----------
  await showTab('bool');
  const sq = (x, y, w) => `(${x} ${y}, ${x + w} ${y}, ${x + w} ${y + w}, ${x} ${y + w}, ${x} ${y})`;
  const setPoly = async (which, wkt) => {
    await page.selectOption('#gx-bl-target', which);
    await page.fill('#gx-bl-io', wkt);
    await page.click('#gx-bl-import');
    await page.waitForFunction(() => /已导入/.test(document.getElementById('gx-bl-iomsg').textContent));
  };
  await setPoly('A', `POLYGON (${sq(0, 0, 100)})`);
  await setPoly('B', `POLYGON (${sq(50, 50, 100)})`);
  const opArea = async (op) => {
    await page.click(`#gx-bl-op-${op}`);
    await page.waitForFunction((o) => document.getElementById('gx-bl-op-' + o).getAttribute('aria-pressed') === 'true', op);
    return num('#gx-bl-area');
  };
  near(await opArea('union'), 17500, 5e-3, '两个 100×100 方块（错开 50）并集面积');
  near(await opArea('intersection'), 2500, 5e-3, '交集面积');
  near(await opArea('difference'), 7500, 5e-3, '差集 A−B 面积');
  near(await opArea('xor'), 15000, 5e-3, '对称差面积');
  assert((await num('#gx-bl-outer')) === 2, '对称差有 2 个外环');
  assert((await txt('#gx-bl-invariant')).includes('0 处不符'), '绕数不变量没有被破坏');

  // 带洞：20×20 方块挖 10×10 的洞，再并上洞里的 4×4 小方块 ⇒ 面积 316，且结果含 1 个洞
  await setPoly('A', `POLYGON (${sq(0, 0, 20)}, (5 5, 5 15, 15 15, 15 5, 5 5))`);
  await setPoly('B', `POLYGON (${sq(8, 8, 4)})`);
  await page.click('#gx-bl-op-union');
  await page.waitForFunction(() => Math.abs(Number(document.getElementById('gx-bl-area').textContent.replace(/,/g, '')) - 316) < 1e-6);
  near(await num('#gx-bl-area'), 316, 5e-3, '环 ∪ 洞内小方块的面积');
  assert((await num('#gx-bl-holes')) === 1, '结果保留 1 个洞');
  assert((await num('#gx-bl-outer')) === 2, '结果有 2 个外环（大环 + 洞里的岛）');

  // 填充规则：自交五角星 —— 非零 11225.699414490 / 奇偶 7756.767521667（闭式解，且经 GEOS polygonize 复核）
  const star = [];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + i * 4 * Math.PI / 5;
    star.push(`${(100 * Math.cos(a)).toFixed(9)} ${(100 * Math.sin(a)).toFixed(9)}`);
  }
  await setPoly('A', `POLYGON ((${star.join(', ')}, ${star[0]}))`);
  await setPoly('B', 'POLYGON ((900 900, 901 900, 901 901, 900 901, 900 900))');
  await page.click('#gx-bl-op-difference');
  await page.selectOption('#gx-bl-rule', 'nonzero');
  await page.waitForFunction(() => Math.abs(Number(document.getElementById('gx-bl-area').textContent.replace(/,/g, '')) - 11225.7) < 1);
  near(await num('#gx-bl-area'), 11225.699414, 0.02, '五角星按非零绕数的面积（闭式解 11225.699414）');
  await page.selectOption('#gx-bl-rule', 'evenodd');
  await page.waitForFunction(() => Math.abs(Number(document.getElementById('gx-bl-area').textContent.replace(/,/g, '')) - 7756.77) < 1);
  near(await num('#gx-bl-area'), 7756.767522, 0.02, '五角星按奇偶规则的面积（闭式解 7756.767522）');
  await page.selectOption('#gx-bl-rule', 'nonzero');

  // 缓冲区：直角边 100 的三角形内缩 10 ⇒ 2168.629150（内切圆半径按比例缩放的解析值）
  await setPoly('A', 'POLYGON ((0 0, 100 0, 0 100, 0 0))');
  await setPoly('B', 'POLYGON ((900 900, 901 900, 901 901, 900 901, 900 900))');
  await page.click('#gx-bl-op-difference');
  await page.fill('#gx-bl-off', '-10');
  await page.dispatchEvent('#gx-bl-off', 'input');
  await page.waitForFunction(() => Math.abs(Number(document.getElementById('gx-bl-area').textContent.replace(/,/g, '')) - 2168.63) < 1);
  near(await num('#gx-bl-area'), 2168.629150, 0.02, '三角形内缩 10 的面积（解析值 2168.629150）');
  // 外扩到 16 段圆弧，应落在 Steiner 解析上界之下、且差距小于 0.1%
  await page.fill('#gx-bl-arc', '16');
  await page.dispatchEvent('#gx-bl-arc', 'input');
  await page.fill('#gx-bl-off', '10');
  await page.dispatchEvent('#gx-bl-off', 'input');
  await page.waitForFunction(() => Number(document.getElementById('gx-bl-area').textContent.replace(/,/g, '')) > 8000);
  const grow = await num('#gx-bl-area');
  const steiner = 5000 + (200 + Math.hypot(100, 100)) * 10 + Math.PI * 100;
  assert(grow < steiner + 5e-3 && grow > steiner * 0.999,
    `外扩面积 ${grow} 应略小于 Steiner 解析值 ${steiner.toFixed(4)}（离散圆弧必然偏小）`);
  // 三角剖分开关：结果被剖成三角形，且三角形数 = 顶点数 − 2
  await page.check('#gx-bl-l-t');
  await page.waitForFunction(() => Number(document.getElementById('gx-bl-tris').textContent) > 0);
  const nv = await num('#gx-bl-verts'), nt = await num('#gx-bl-tris');
  assert(nt === nv - 2, `单个无洞外环的三角形数应为顶点数−2（顶点 ${nv}，三角形 ${nt}）`);
  await page.fill('#gx-bl-off', '0');
  await page.dispatchEvent('#gx-bl-off', 'input');
  // 结果路径确实画出来了，且落在画布里
  const resBox = await page.evaluate(() => {
    const p = document.getElementById('gx-bl-result');
    if (!p) return null;
    const b = p.getBBox();
    return { w: b.width, h: b.height, x: b.x, y: b.y };
  });
  assert(resBox && resBox.w > 40 && resBox.h > 40, `结果图形有可见尺寸（${JSON.stringify(resBox)}）`);
  assert(resBox.x >= -1 && resBox.y >= -1 && resBox.x + resBox.w <= 901 && resBox.y + resBox.h <= 621,
    `结果图形没有跑出画布（${JSON.stringify(resBox)}）`);

  // 预设 + 拖点：拖动顶点后 A 与结果都必须变（证明是实时重算而不是静态图）
  // 用「两个方块」而不是齿轮：齿轮的第一个顶点恰好落在 B 内部，挪动它并不改变并集面积。
  await page.selectOption('#gx-bl-preset', 'squares');
  await page.click('#gx-bl-load');
  await page.click('#gx-bl-op-union');
  // 期望值 62600 由 GEOS 复核：box(-140,-90,50,100) ∪ box(-30,-20,160,170)
  await page.waitForFunction(() => Math.abs(Number(document.getElementById('gx-bl-area').textContent.replace(/,/g, '')) - 62600) < 0.01);
  near(await num('#gx-bl-area'), 62600, 5e-3, '两个 190×190 方块（错开 110×70）的并集面积');
  const beforeA = await num('#gx-bl-aarea'), beforeR = await num('#gx-bl-area');
  await page.locator('#gx-bl-stage').scrollIntoViewIfNeeded();
  const box = await page.locator('#gx-bl-stage').boundingBox();
  const target = await page.evaluate(() => {
    const st = document.getElementById('gx-bl-stage');
    const c = [...st.querySelectorAll('path')].find((p) => p.getAttribute('stroke') === '#ffffff');
    const m = /M([\d.\-]+) ([\d.\-]+)/.exec(c.getAttribute('d'));
    return { sx: Number(m[1]), sy: Number(m[2]), vw: st.viewBox.baseVal.width };
  });
  const sc = box.width / target.vw;
  const cx = box.x + target.sx * sc, cy = box.y + target.sy * sc;
  assert(cy > 0 && cy < 850 && cx > 0, `拖拽目标点在视口内（${cx.toFixed(0)}, ${cy.toFixed(0)}）`);
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx - 40, cy + 36, { steps: 6 });
  await page.mouse.up();
  await page.waitForFunction((a) => Math.abs(Number(document.getElementById('gx-bl-aarea').textContent.replace(/,/g, '')) - a) > 1e-6, beforeA);
  assert(Math.abs((await num('#gx-bl-aarea')) - beforeA) > 1e-6, `拖动顶点后 A 的面积随之改变（${beforeA} → ${await num('#gx-bl-aarea')}）`);
  assert(Math.abs((await num('#gx-bl-area')) - beforeR) > 1e-6, `拖动顶点后并集面积随之改变（${beforeR} → ${await num('#gx-bl-area')}）`);
  assert((await txt('#gx-bl-invariant')).includes('0 处不符'), '拖动后不变量仍然成立');

  // ---------- 4. 折线简化：DP / VW 的真实点数与 GEOS 同口径 ----------
  await showTab('line');
  await page.fill('#gx-ln-io', 'LINESTRING (0 0, 1 0.2, 2 -0.1, 3 5, 4 0.1, 5 0)');
  await page.click('#gx-ln-import');
  await page.waitForFunction(() => document.getElementById('gx-ln-n0').textContent.trim() === '6');
  // 逐档与 GEOS simplify(preserve_topology=false) 对齐：阈值 0/0.5/1/2 → 保留 6/5/4/3 点
  for (const [tol, keep] of [['0', 6], ['0.5', 5], ['1', 4], ['2', 3]]) {
    await page.fill('#gx-ln-tol', tol);
    await page.dispatchEvent('#gx-ln-tol', 'input');
    await page.waitForFunction((k) => document.getElementById('gx-ln-ndp').textContent.trim() === String(k), keep);
    assert((await num('#gx-ln-ndp')) === keep, `DP 阈值 ${tol} 时保留 ${keep} 点（与 GEOS simplify 逐档一致）`);
  }
  await page.fill('#gx-ln-keep', '4');
  await page.dispatchEvent('#gx-ln-keep', 'input');
  await page.waitForFunction(() => document.getElementById('gx-ln-nvw').textContent.trim() === '4');
  assert((await num('#gx-ln-nvw')) === 4, 'VW 保留点数由控件决定');
  // 自交检测：蝴蝶结应报 1 处
  await page.fill('#gx-ln-io', 'LINESTRING (0 0, 10 10, 10 0, 0 10)');
  await page.click('#gx-ln-import');
  await page.waitForFunction(() => /自交 1 处/.test(document.getElementById('gx-ln-cross').textContent));
  assert(/自交 1 处/.test(await txt('#gx-ln-cross')), '蝴蝶结折线报 1 处自交');
  // 生成一条长折线，DP 应该真的压缩
  await page.selectOption('#gx-ln-preset', 'coast');
  await page.fill('#gx-ln-n', '200');
  await page.click('#gx-ln-gen');
  await page.waitForFunction(() => Number(document.getElementById('gx-ln-n0').textContent.replace(/,/g, '')) >= 100);
  await page.fill('#gx-ln-tol', '8');
  await page.dispatchEvent('#gx-ln-tol', 'input');
  await page.waitForFunction(() => Number(document.getElementById('gx-ln-ndp').textContent.replace(/,/g, ''))
    < Number(document.getElementById('gx-ln-n0').textContent.replace(/,/g, '')));
  const n0 = await num('#gx-ln-n0'), ndp = await num('#gx-ln-ndp');
  assert(ndp < n0 && ndp >= 2, `DP 真的压缩了（${n0} → ${ndp}）`);
  const maxErr = await num('#gx-ln-err');
  assert(maxErr <= 8 + 1e-9, `DP 最大偏离 ${maxErr} 不超过阈值 8`);
  const dpLen = (await page.locator('#gx-ln-dppath').getAttribute('d')).match(/L/g).length;
  assert(dpLen === ndp - 1, `DP 折线真的按 ${ndp} 个点画出来了`);

  // ---------- 5. 稳健谓词：浮点判定确实会出错，精确判定不会 ----------
  await showTab('robust');
  await page.waitForFunction(() => Number(document.getElementById('gx-rb-cells').textContent.replace(/,/g, '')) > 0);
  const cells = await num('#gx-rb-cells');
  assert(cells === 1936, `44×44 格点（得到 ${cells}）`);
  const rects = await page.locator('#gx-rb-g0 rect').count() + await page.locator('#gx-rb-g1 rect').count();
  assert(rects === 2 * cells, `两幅图各画满 ${cells} 个格子（矩形数 ${rects}）`);
  // Kettner 构型：p 在 (0.5,0.5) 附近逐 ulp 扫，q=(12,12)、r=(24,24)
  // 离线实测浮点判错 974 / 1936 格；精确判定给出干净的 946 / 946 / 44（左 / 右 / 共线）
  const bad = await num('#gx-rb-bad');
  assert(bad === 974, `浮点与精确判定的不一致格数应为 974（得到 ${bad}）`);
  const colorHist = await page.evaluate(() => {
    const h = {};
    for (const r of document.querySelectorAll('#gx-rb-g1 rect')) { const f = r.getAttribute('fill'); h[f] = (h[f] || 0) + 1; }
    return h;
  });
  assert(colorHist['#c3d9f3'] === 946 && colorHist['#3a3a3a'] === 946 && colorHist['#d4a017'] === 44,
    `精确判定那幅图应是干净的 946/946/44（得到 ${JSON.stringify(colorHist)}）`);
  // 固定种子 + n=200：精确谓词得 10 顶点、0 点漏在外面；浮点谓词只得 5 顶点、把 23 个点漏在「包」外
  assert((await txt('#gx-rb-h-exact')) === '10 顶点 · 包外 0 点', `精确凸包应是 10 顶点且不漏点（得到 ${await txt('#gx-rb-h-exact')}）`);
  assert((await txt('#gx-rb-h-naive')) === '5 顶点 · 包外 23 点', `浮点凸包应漏掉 23 个点（得到 ${await txt('#gx-rb-h-naive')}）`);
  assert((await num('#gx-rb-h-bad')) === 23, '被浮点凸包漏在外面的点数 = 23');

  // ---------- 6. 能力清单：每一行都必须现场跑出值（广告了就必须真有） ----------
  await showTab('about');
  const caps = await page.evaluate(() => [...document.querySelectorAll('#gx-cap-body tr')].map((tr) => ({
    name: tr.children[0].textContent.trim(),
    val: tr.children[2].textContent.trim(),
    failed: tr.children[2].className.indexOf('gx-warn') >= 0
  })));
  assert(caps.length >= 18, `能力清单至少 18 行（得到 ${caps.length}）`);
  const dead = caps.filter((c) => c.failed || !c.val || c.val === '—');
  assert(dead.length === 0, `能力清单里有跑不出来的项：${dead.map((d) => d.name).join(' / ')}`);
  const capsSummary = await txt('#gx-cap-summary');
  assert(new RegExp(`现场跑通 ${caps.length} 项，失败 0 项`).test(capsSummary), `能力汇总与行数自洽（${capsSummary}）`);
  // 抽查两行的具体值（跨来源：期望值来自离线对拍/闭式解，不是页面自己算的）
  const capMap = Object.fromEntries(caps.map((c) => [c.name, c.val]));
  assert(/并 175 · 交 25/.test(capMap['布尔运算 · 并 / 交 / 差 / 异或'] || ''),
    `布尔能力行的现场值应为「并 175 · 交 25」（得到 ${capMap['布尔运算 · 并 / 交 / 差 / 异或']}）`);
  assert(/8 三角形 · 面积和 300/.test(capMap['三角剖分 · 耳切（含洞）'] || ''),
    `耳切能力行的现场值（得到 ${capMap['三角剖分 · 耳切（含洞）']}）`);

  // ---------- 7. 公布的验证数字：逐行钉死 + 总数钉死（跨来源，改坏任一行都会红） ----------
  const rows = await page.evaluate(() => [...document.querySelectorAll('#gx-val-body tr')].map((tr) => ({
    item: tr.children[0].textContent.trim(),
    n: Number(tr.children[2].getAttribute('data-gx-n')),
    f: Number(tr.children[3].getAttribute('data-gx-f'))
  })));
  const EXPECT = [28000, 180, 210, 300, 210, 1680, 1680, 790926, 77936, 200, 200, 200, 360, 360, 76, 200, 200, 90, 90, 90, 90, 90, 90, 90];
  assert(rows.length === EXPECT.length, `验证表应有 ${EXPECT.length} 行（得到 ${rows.length}）`);
  rows.forEach((r, i) => {
    assert(r.n === EXPECT[i], `验证表第 ${i + 1} 行「${r.item}」条数应为 ${EXPECT[i]}，得到 ${r.n}`);
    assert(r.f === 0, `验证表第 ${i + 1} 行「${r.item}」失配应为 0，得到 ${r.f}`);
  });
  assert((await num('#gx-val-total')) === 903548, `公布总条数应为 903548（离线套件实测），得到 ${await num('#gx-val-total')}`);
  assert((await num('#gx-val-fail')) === 0, '公布失配数应为 0');

  // ---------- 8. 通用守卫 ----------
  const TABS = ['points', 'bool', 'line', 'robust', 'about'];
  // (a) [hidden] 必须真的藏住（断计算样式，不只断属性）
  for (const t of TABS) {
    await showTab(t);
    const vis = await page.evaluate((cur) => {
      const names = ['points', 'bool', 'line', 'robust', 'about'];
      return names.filter((n) => n !== cur)
        .filter((n) => getComputedStyle(document.getElementById('gx-panel-' + n)).display !== 'none');
    }, t);
    assert(vis.length === 0, `切到「${t}」时其余面板必须计算样式为 none，仍可见：${vis.join(',')}`);
  }
  // (b) 控件塌缩守卫：逐个标签页扫一遍（隐藏面板里的控件对守卫失明）
  let scanned = 0;
  for (const t of TABS) {
    await showTab(t);
    const small = await page.evaluate(() => {
      const out = [];
      let n = 0;
      for (const el of document.querySelectorAll('input, select, button, textarea')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        n++;
        const isBox = el.type === 'checkbox';
        const minW = isBox ? 14 : (el.tagName === 'BUTTON' ? 52 : 100);
        if (r.width < minW || r.height < 18) out.push(`${el.tagName}#${el.id || '?'} ${r.width.toFixed(0)}x${r.height.toFixed(0)}`);
      }
      return { out, n };
    });
    scanned += small.n;
    assert(small.out.length === 0, `「${t}」页有被压扁的控件：${small.out.join(' | ')}`);
  }
  assert(scanned >= 60, `控件守卫至少要扫到 60 个控件（实扫 ${scanned}）`);
  // (c) 逐视口 × 逐标签页：整页不得横向溢出
  for (const vw of [390, 768, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of TABS) {
      await showTab(t);
      const over = await page.evaluate(() => {
        const de = document.documentElement;
        const gap = de.scrollWidth - de.clientWidth;
        if (gap <= 1) return { gap: 0, who: '' };
        let worst = null;
        for (const el of document.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0) continue;
          if (r.right > de.clientWidth + 1 && (!worst || r.right > worst.right))
            worst = { right: r.right, tag: el.tagName, id: el.id, cls: el.className };
        }
        return { gap, who: worst ? `${worst.tag}#${worst.id || ''}.${worst.cls || ''} right=${worst.right.toFixed(0)}` : '未定位' };
      });
      assert(over.gap <= 1, `视口 ${vw}px 的「${t}」页横向溢出 ${over.gap}px，元凶 ${over.who}`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 850 });
  // (d) 渲染文本里不得出现原样的 markdown 记号
  const mdLeak = await page.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll('p, li, td, th, h1, h2, h3, span, label, div.gx-kvval, div.gx-kvlab')) {
      if (el.children.length) continue;
      const t = (el.textContent || '');
      if (/\*\*|^#{1,3}\s|\[[^\]]+\]\([^)]+\)/.test(t)) bad.push(t.slice(0, 60));
    }
    return bad;
  });
  assert(mdLeak.length === 0, `页面上出现了原样的 markdown 记号：${mdLeak.join(' | ')}`);
  // (e) 单位不得被 uppercase 改写
  const badUnits = await page.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll('th, dt, label, .gx-kvlab')) {
      const t = (el.textContent || '');
      if (/\b(HZ|KHZ|DBFS|PX|ULP)\b/.test(t)) bad.push(t.slice(0, 40));
    }
    return bad;
  });
  assert(badUnits.length === 0, `疑似被 uppercase 改写的单位：${badUnits.join(' | ')}`);
  // (f) 表格文字不得溢出所在单元格 / 卡片
  const spill = await page.evaluate(() => {
    const bad = [];
    for (const wrap of document.querySelectorAll('.gx-tablewrap, .gx-kv')) {
      if (!wrap.offsetParent && wrap.closest('[hidden]')) continue;
      const r = wrap.getBoundingClientRect();
      if (r.width === 0) continue;
      for (const child of wrap.querySelectorAll('*')) {
        const c = child.getBoundingClientRect();
        if (c.width === 0) continue;
        if (c.right > r.right + 1.5 && wrap.scrollWidth <= wrap.clientWidth + 1)
          bad.push(`${child.tagName}.${child.className} 越出 ${(c.right - r.right).toFixed(1)}px`);
      }
    }
    return bad.slice(0, 5);
  });
  assert(spill.length === 0, `有文字越出容器：${spill.join(' | ')}`);

  // ---------- 9. localStorage 持久化 ----------
  await showTab('points');
  const saved = await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('gx-geometry-lab/v1')); } catch (e) { return null; }
  });
  assert(saved && Array.isArray(saved.pts) && saved.pts.length > 0, '场景已写入 localStorage');

  // ---------- 10. 缩略图（回到布尔页，画面信息量最大） ----------
  await showTab('bool');
  await page.selectOption('#gx-bl-preset', 'gear');
  await page.click('#gx-bl-load');
  await page.check('#gx-bl-l-t');
  await page.click('#gx-bl-op-intersection');
  await page.waitForFunction(() => {
    const p = document.getElementById('gx-bl-result');
    return p && p.getAttribute('d').length > 50;
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await screenshot('thumb.png');
}
