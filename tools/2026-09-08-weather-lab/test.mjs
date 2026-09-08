// 气象工作台 —— 真实浏览器集成测试。
// 断真值（CAPE/LCL/密度高度/METAR 解码结果的具体数字），不只查元素在不在；
// 另有五类守卫：[hidden] 计算样式、控件塌缩（逐分区扫）、窄屏横向溢出（逐视口 × 逐分区）、
// SVG 标签避让（画出来几个，不只是掉了几个）、页面公布统计数字的**异源**核对。
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#wx-skewt-box svg');

  const TABS = ['sounding', 'params', 'wind', 'metar', 'calc', 'about'];
  const onTab = async (name, fn) => {
    await page.click('#wx-tab-' + name);
    await page.waitForFunction((n) => !document.getElementById('wx-p-' + n).hidden, name, { timeout: 8000 });
    return fn ? await fn() : undefined;
  };
  const txt = async (sel) => ((await page.locator(sel).textContent()) || '').trim();
  const num = (s) => { const m = /-?\d+(?:\.\d+)?/.exec(String(s).replace(/,/g, '')); return m ? Number(m[0]) : NaN; };

  /* ── 0. [hidden] 守卫：非当前分区的计算样式必须真的是 none ── */
  for (const t of TABS.slice(1)) {
    const d = await page.evaluate((n) => getComputedStyle(document.getElementById('wx-p-' + n)).display, t);
    assert(d === 'none', `启动时 ${t} 分区计算样式应为 none（实得 ${d}）`);
  }
  assert(await page.evaluate(() => getComputedStyle(document.getElementById('wx-p-sounding')).display) !== 'none',
    '探空分区应当可见');

  /* ── 1. Skew-T：默认样本（利雅得）的真实读数 ── */
  const idx = await page.evaluate(() => WX.SOUNDINGS.map((s) => s.id));
  assert(idx.length === 14, `应内置 14 份探空（实得 ${idx.length}）`);
  await page.selectOption('#wx-snd-pick', '72249-2024-05-21-12');   // 沃思堡强对流
  await page.waitForFunction(() => document.querySelector('#wx-skewt-box svg polyline'));
  const kv = async (label) => page.evaluate((L) => {
    const d = [...document.querySelectorAll('#wx-p-sounding .wx-kv dt')].find((x) => x.textContent.trim() === L);
    return d ? d.parentElement.querySelector('dd').textContent.trim() : null;
  }, label);
  const capeShown = num(await kv('CAPE'));
  const lclShown = num(await kv('LCL'));
  // 异源核对①：页面卡片上的数与引擎现场重算的数必须一致
  const engine = await page.evaluate(() => {
    const s = WX.SOUNDINGS.find((x) => x.id === '72249-2024-05-21-12');
    const p = [], t = [], td = [];
    s.levels.forEach((r) => { if (r[0] !== null && r[2] !== null) { p.push(r[0]); t.push(r[2]); td.push(r[3] === null ? NaN : r[3]); } });
    const c = WX.removeNans([p, t, td]);
    const sb = WX.surfaceBasedCapeCin(c[0], c[1], c[2]);
    const l = WX.lcl(c[0][0], c[1][0], c[2][0]);
    return { cape: sb.cape, cin: sb.cin, lfc: sb.lfcP, el: sb.elP, lclP: l.p, lclT: l.t,
      pw: WX.precipitableWater(c[0], c[2]), k: WX.kIndex(c[0], c[1], c[2]) };
  });
  // 与 MetPy 1.7.1 离线对拍过的真值（tools 目录外的对拍套件里逐条核过）
  assert(Math.abs(engine.cape - 1313.5970) < 0.5, `沃思堡 SBCAPE 应约 1313.60 J/kg（与 MetPy 1.7.1 对拍过；实得 ${engine.cape}）`);
  assert(Math.abs(engine.lclP - 935.7259) < 0.01, `SB LCL 应约 935.726 hPa（实得 ${engine.lclP}）`);
  assert(Math.abs(engine.pw - 27.3165) < 0.01, `可降水量应约 27.32 mm（实得 ${engine.pw}）`);
  assert(Math.abs(capeShown - Math.round(engine.cape)) < 1, `卡片上的 CAPE ${capeShown} 应等于现场重算的 ${engine.cape}`);
  assert(Math.abs(lclShown - Math.round(engine.lclP)) < 1, `卡片上的 LCL ${lclShown} 应等于现场重算的 ${engine.lclP}`);

  // 图元几何：温度/露点/气块三条曲线都要在，且落在绘图框内
  const geom = await page.evaluate(() => {
    const svg = document.querySelector('#wx-skewt-box svg');
    const polys = [...svg.querySelectorAll('polyline')].filter((p) => (p.getAttribute('points') || '').split(' ').length > 5);
    const frame = svg.querySelector('rect[stroke="#000"]');
    const fb = frame.getBBox();
    const thick = polys.filter((p) => parseFloat(p.getAttribute('stroke-width') || '1') >= 2);
    // Skew-T 的曲线在高层本来就会斜出画框（等温线倾斜 45°），靠 clipPath 裁掉；
    // 所以这里断的是「裁剪确实生效、且裁剪框就是绘图框」，不是「几何上不越界」。
    const g = polys[0].parentElement;
    const clip = (g.getAttribute('clip-path') || '').match(/url\(#(.+)\)/);
    const cr = clip ? svg.querySelector('#' + clip[1] + ' rect') : null;
    const inside = thick.filter((p) => {
      const pts = (p.getAttribute('points') || '').trim().split(' ').map((s) => s.split(',').map(Number));
      return pts.some((q) => q[0] >= fb.x - 1 && q[0] <= fb.x + fb.width + 1 && q[1] >= fb.y - 1 && q[1] <= fb.y + fb.height + 1);
    }).length;
    return {
      total: polys.length, thick: thick.length, inside: inside,
      clipped: !!cr,
      clipMatches: cr ? (Math.abs(+cr.getAttribute('x') - fb.x) < 1.5 && Math.abs(+cr.getAttribute('width') - fb.width) < 1.5
        && Math.abs(+cr.getAttribute('y') - fb.y) < 1.5 && Math.abs(+cr.getAttribute('height') - fb.height) < 1.5) : false,
      shades: svg.querySelectorAll('polygon').length,
      barbs: svg.querySelectorAll('g[transform^="translate"]').length
    };
  });
  assert(geom.thick >= 3, `应画出环境温度、露点、气块三条粗线（实得 ${geom.thick}）`);
  assert(geom.total >= 50, `应画出成套的干绝热/湿绝热/等混合比背景线（29 条干绝热 + 13 条湿绝热 + 10 条等混合比 + 3 条廓线；实得 ${geom.total}）`);
  assert(geom.clipped && geom.clipMatches, '绘图组必须挂在与绘图框等大的 clipPath 上（否则曲线会画到坐标轴外面）');
  assert(geom.inside === geom.thick, `${geom.thick - geom.inside} 条主曲线完全落在绘图框之外`);
  assert(geom.shades >= 1, 'CAPE/CIN 应有阴影多边形');
  assert(geom.barbs >= 10, `右侧应画出风羽（实得 ${geom.barbs}）`);

  // 避让器：标注不能被静默丢光
  const placer = await page.evaluate(() => {
    const p = document.querySelector('#wx-skewt-box svg')._placer;
    return { dropped: p.dropped, drawn: p.drawn.length, marks: p.drawn.filter((s) => /LCL|LFC|EL|0°C/.test(s)).length };
  });
  assert(placer.marks >= 3, `LCL/LFC/EL/0°C 四个标注至少要画出 3 个（实得 ${placer.marks}，掉了 ${placer.dropped}）`);
  assert(placer.drawn > 20, `坐标轴刻度应当画出来（实得 ${placer.drawn}）`);

  /* ── 2. 换气块口径：MU 的 CAPE 不应小于 SB ── */
  await page.selectOption('#wx-parcel-pick', 'mu');
  await page.waitForTimeout(60);
  const muCape = num(await kv('CAPE'));
  assert(muCape >= capeShown - 1, `MU 气块的 CAPE(${muCape}) 不应小于 SB(${capeShown})`);
  await page.selectOption('#wx-parcel-pick', 'sb');
  await page.waitForTimeout(60);

  /* ── 3. 自定义探空导入：粘一份人造廓线，CAPE 必须随之改变 ── */
  await page.click('#wx-open-import');
  await page.waitForFunction(() => !document.getElementById('wx-import-box').hidden);
  await page.fill('#wx-import-ta',
    '1000 100 30 24 180 5\n950 550 26 22 190 8\n900 1000 23 20 200 10\n850 1500 20 17 210 12\n700 3100 10 5 230 16\n500 5800 -8 -20 250 22\n400 7300 -20 -34 260 26\n300 9300 -38 -52 265 30\n200 11900 -58 -70 270 34');
  await page.click('#wx-do-import');
  await page.waitForFunction(() => document.getElementById('wx-snd-pick').value === 'custom', null, { timeout: 8000 });
  const customCape = num(await kv('CAPE'));
  assert(Math.abs(customCape - 4179) <= 1, `自定义廓线的 CAPE 应约 4179 J/kg（实得 ${customCape}）`);
  assert(customCape !== capeShown, '导入后读数应当变化');
  const customCheck = await page.evaluate(() => {
    const s = WX.SOUNDINGS[0];
    void s;
    const p = [1000, 950, 900, 850, 700, 500, 400, 300, 200], t = [30, 26, 23, 20, 10, -8, -20, -38, -58], td = [24, 22, 20, 17, 5, -20, -34, -52, -70];
    return WX.surfaceBasedCapeCin(p, t, td).cape;
  });
  assert(Math.abs(customCape - Math.round(customCheck)) <= 1, `导入后的 CAPE ${customCape} 应等于对该廓线直接算出的 ${customCheck}`);
  // 导入成功后面板必须仍然开着（否则「清除自定义」和提示都被折叠掉了）
  assert(await page.evaluate(() => getComputedStyle(document.getElementById('wx-import-box')).display) !== 'none',
    '导入成功后，导入面板应保持展开');
  assert(/已载入 9 层/.test(await txt('#wx-import-msg')), `导入提示应说明载入了 9 层（实得 ${await txt('#wx-import-msg')}）`);
  // 清除自定义，回到内置样本
  await page.click('#wx-clear-import');
  await page.waitForFunction(() => document.getElementById('wx-snd-pick').value !== 'custom', null, { timeout: 8000 });

  /* ── 4. 参数分区：三种气块的表格 ── */
  await onTab('params');
  await page.selectOption('#wx-snd-pick2', '45004-2024-08-30-00');
  await page.waitForTimeout(80);
  const prows = await page.evaluate(() => [...document.querySelectorAll('#wx-p-params table tbody tr')]
    .slice(0, 3).map((tr) => [...tr.children].map((td) => td.textContent.trim())));
  assert(prows.length === 3 && /SB|ML|MU/.test(prows[0][0]), '应有 SB/ML/MU 三行');
  const sbC = Number(prows[0][1]), muC = Number(prows[2][1]);
  assert(muC >= sbC, `MU 的 CAPE(${muC}) 不应小于 SB(${sbC})`);
  const engine2 = await page.evaluate(() => {
    const s = WX.SOUNDINGS.find((x) => x.id === '45004-2024-08-30-00');
    const p = [], t = [], td = [];
    s.levels.forEach((r) => { if (r[0] !== null && r[2] !== null) { p.push(r[0]); t.push(r[2]); td.push(r[3] === null ? NaN : r[3]); } });
    const c = WX.removeNans([p, t, td]);
    return { sb: WX.surfaceBasedCapeCin(c[0], c[1], c[2]).cape, mu: WX.mostUnstableCapeCin(c[0], c[1], c[2]).cape,
      ml: WX.mixedLayerCapeCin(c[0], c[1], c[2]).cape };
  });
  assert(Math.abs(sbC - Math.round(engine2.sb)) <= 1, `表里的 SBCAPE ${sbC} 应等于现场算的 ${engine2.sb}`);
  assert(Math.abs(muC - Math.round(engine2.mu)) <= 1, `表里的 MUCAPE ${muC} 应等于现场算的 ${engine2.mu}`);
  assert(Math.abs(engine2.sb - 3560.6194) < 1, `香港 SBCAPE 应约 3560.6 J/kg（实得 ${engine2.sb}）`);
  assert(Math.abs(engine2.ml - 1684.8213) < 1, `香港 MLCAPE 应约 1684.8 J/kg（实得 ${engine2.ml}）`);

  /* ── 5. 风分区：风矢端图与 Bunkers 矢量 ── */
  await onTab('wind');
  await page.selectOption('#wx-snd-pick3', '72249-2024-05-21-12');
  await page.waitForTimeout(80);
  const hodo = await page.evaluate(() => {
    const svg = document.querySelector('#wx-hodo-box svg');
    const p = svg._placer;
    return {
      bands: [...svg.querySelectorAll('polyline')].length,
      movers: [...svg.querySelectorAll('path')].length,
      drawn: p.drawn.length, dropped: p.dropped,
      labels: p.drawn.filter((s) => /RM|LM|平均风/.test(s)).length,
      km: p.drawn.filter((s) => / km$/.test(s)).length
    };
  });
  assert(hodo.bands >= 3, `风矢端图应按高度分段着色（实得 ${hodo.bands} 段）`);
  assert(hodo.movers === 3, `应画出 RM / LM / 平均风三个菱形（实得 ${hodo.movers}）`);
  assert(hodo.labels === 3, `三个风暴移动矢量的标签都要画出来（实得 ${hodo.labels}，掉了 ${hodo.dropped}）`);
  assert(hodo.km >= 4, `高度标点标签至少画出 4 个（实得 ${hodo.km}）；这条是在数 placer 真的画出来几个，不是只看 dropped`);
  const shear6 = num(await page.evaluate(() => {
    const d = [...document.querySelectorAll('#wx-p-wind .wx-kv dt')].find((x) => x.textContent.indexOf('0–6 km 切变') === 0);
    return d ? d.parentElement.querySelector('dd').textContent : '';
  }));
  const engine3 = await page.evaluate(() => {
    const s = WX.SOUNDINGS.find((x) => x.id === '72249-2024-05-21-12');
    const p = [], h = [], u = [], v = [];
    s.levels.forEach((r) => {
      if (r[0] === null || r[4] === null || r[5] === null) return;
      const c = WX.windComponents(r[5], r[4]); p.push(r[0]); h.push(r[1]); u.push(c.u); v.push(c.v);
    });
    const sh = WX.bulkShear(p, u, v, h, 6000);
    const b = WX.bunkersStormMotion(p, u, v, h);
    return { s6: Math.hypot(sh.u, sh.v), rm: [b.right.u, b.right.v] };
  });
  assert(Math.abs(shear6 - engine3.s6) < 0.06, `页面上的 0–6 km 切变 ${shear6} 应等于现场算的 ${engine3.s6}`);
  assert(Math.abs(engine3.s6 - 23.4236) < 0.02, `沃思堡 0–6 km 切变应约 23.42 m/s（实得 ${engine3.s6}）`);
  assert(Math.abs(engine3.rm[0] - 5.836) < 0.01 && Math.abs(engine3.rm[1] - 0.767) < 0.01, `Bunkers 右移矢量应约 (5.84, 0.77) m/s（实得 ${engine3.rm}）`);

  /* ── 6. METAR 分区：真报文的解码结果 ── */
  await onTab('metar');
  await page.fill('#wx-rwy', '9');
  await page.fill('#wx-elev', '1655');
  await page.fill('#wx-metar-ta', 'METAR KDEN 081753Z 18015G25KT 10SM FEW120 SCT200 33/06 A2992 RMK AO2 SLP066 T03330061');
  await page.click('#wx-decode');
  await page.waitForFunction(() => document.querySelectorAll('#wx-metar-out .wx-card').length === 1, null, { timeout: 8000 });
  const mkv = async (label) => page.evaluate((L) => {
    const d = [...document.querySelectorAll('#wx-metar-out .wx-kv dt')].find((x) => x.textContent.trim().indexOf(L) === 0);
    return d ? d.parentElement.querySelector('dd').textContent.trim() : null;
  }, label);
  assert(((await page.locator('#wx-metar-out .wx-badge').first().textContent()) || '').indexOf('KDEN') >= 0, '应认出 KDEN');
  const catTxt = await page.evaluate(() => [...document.querySelectorAll('#wx-metar-out .wx-badge')].map((b) => b.textContent.trim()).join('|'));
  assert(/VFR/.test(catTxt) && !/MVFR/.test(catTxt), `10 sm 能见度、无云底 ⇒ VFR（实得 ${catTxt}）`);
  const tShown = num(await mkv('气温'));
  assert(Math.abs(tShown - 33.3) < 0.05, `备注段 T03330061 给出的精确气温 33.3°C 应优先于报文体的 33（实得 ${tShown}）`);
  const dShown = num(await mkv('露点'));
  assert(Math.abs(dShown - 6.1) < 0.05, `精确露点应为 6.1°C（实得 ${dShown}）`);
  const cross = num(await mkv('跑道 09 侧风'));
  const engine4 = await page.evaluate(() => {
    const stp = WX.altimeterToStationPressure(29.92 * 33.863886666667, 1655);
    return { stp: stp, da: WX.densityAltitude(stp, 33.3, 6.1), pa: WX.pressureAltitude(stp),
      cross: WX.metar.runwayComponents(180, 15 * WX.metar.KT2MS, 90).cross };
  });
  assert(Math.abs(cross - Math.abs(engine4.cross)) < 0.06, `跑道 09 的侧风分量 ${cross} 应等于现场算的 ${Math.abs(engine4.cross)}`);
  assert(Math.abs(Math.abs(engine4.cross) - 7.7167) < 0.01, `180° 15 kt 对 090 跑道是全侧风 7.72 m/s（实得 ${engine4.cross}）`);
  const daShown = num(await mkv('密度高度'));
  assert(Math.abs(daShown - Math.round(engine4.da * 3.28084)) <= 2, `密度高度 ${daShown} ft 应等于现场算的 ${engine4.da * 3.28084}`);
  assert(Math.abs(engine4.da - 2684.660) < 0.5, `丹佛 33.3°C / QNH 29.92 的密度高度应约 2684.7 m（实得 ${engine4.da}）`);
  const rh = num(await mkv('相对湿度'));
  assert(Math.abs(rh - 18) < 1.2, `33.3°C / 露点 6.1°C 的相对湿度应约 18%（实得 ${rh}）`);

  // 认不出来的组必须原样列出，不能悄悄吞掉
  await page.fill('#wx-metar-ta', 'METAR ZZZZ 010000Z 09008KT 9999 SCT030 20/12 Q1013 XXQQ ZZTOP');
  await page.click('#wx-decode');
  await page.waitForFunction(() => !!document.getElementById('wx-unparsed'), null, { timeout: 8000 });
  const un = await txt('#wx-unparsed');
  assert(/XXQQ/.test(un) && /ZZTOP/.test(un), `未识别的组应原样列出（实得 ${un}）`);

  // TAF
  await page.fill('#wx-metar-ta', 'TAF EGLL 081100Z 0812/0918 25012KT 9999 BKN020 TEMPO 0812/0816 6000 -RA BKN008 PROB30 TEMPO 0900/0906 3000 BR BKN004');
  await page.click('#wx-decode');
  await page.waitForFunction(() => document.querySelectorAll('#wx-metar-out table tbody tr').length >= 3, null, { timeout: 8000 });
  const tafRows = await page.evaluate(() => [...document.querySelectorAll('#wx-metar-out table tbody tr')].map((tr) => tr.children[0].textContent.trim()));
  assert(tafRows.some((r) => /基本预报/.test(r)) && tafRows.some((r) => /短时/.test(r)) && tafRows.some((r) => /30%/.test(r)),
    `TAF 应拆出基本预报/短时/概率组（实得 ${JSON.stringify(tafRows)}）`);

  /* ── 7. 计算器分区：湿空气 + 密度高度 + 侧风的真值 ── */
  await onTab('calc');
  await page.fill('#wx-c-p', '1000'); await page.fill('#wx-c-t', '26');
  await page.selectOption('#wx-c-mode', 'td'); await page.fill('#wx-c-v', '20');
  await page.waitForTimeout(60);
  const ckv = async (label) => page.evaluate((L) => {
    const d = [...document.querySelectorAll('#wx-p-calc .wx-kv dt')].find((x) => x.textContent.trim() === L);
    return d ? d.parentElement.querySelector('dd').textContent.trim() : null;
  }, label);
  const tw = num(await ckv('湿球温度'));
  assert(Math.abs(tw - 21.7127) < 0.005, `1000 hPa / 26°C / 露点 20°C 的湿球温度应为 21.71°C（实得 ${tw}）`);
  const thetae = num(await ckv('相当位温 θe'));
  assert(Math.abs(thetae - 342.7216) < 0.005, `θe 应为 342.72 K（实得 ${thetae}）`);
  const rh2 = num(await ckv('相对湿度'));
  assert(Math.abs(rh2 - 69.6) < 0.15, `相对湿度应约 69.6%（实得 ${rh2}）`);
  // 反解：给湿球温度，应还原出同一个露点
  await page.selectOption('#wx-c-mode', 'tw'); await page.fill('#wx-c-v', String(tw));
  await page.waitForTimeout(60);
  const tdBack = num(await ckv('露点'));
  assert(Math.abs(tdBack - 20) < 0.02, `由湿球 ${tw}°C 反解露点应回到 20°C（实得 ${tdBack}）`);
  // 非法输入
  await page.fill('#wx-c-p', '0');
  await page.waitForFunction(() => !!document.getElementById('wx-calc-err'), null, { timeout: 5000 });
  await page.fill('#wx-c-p', '1000');
  await page.waitForFunction(() => !document.getElementById('wx-calc-err'), null, { timeout: 5000 });
  // 密度高度
  await page.fill('#wx-a-elev', '2000'); await page.fill('#wx-a-qnh', '1013.25');
  await page.fill('#wx-a-t', '35'); await page.fill('#wx-a-td', '10');
  await page.waitForTimeout(60);
  const da2 = await page.evaluate(() => {
    const d = [...document.querySelectorAll('#wx-p-calc .wx-kv dt')].find((x) => x.textContent.trim() === '密度高度');
    return d.parentElement.querySelector('dd').textContent.trim();
  });
  const da2n = num(da2);
  const engine5 = await page.evaluate(() => {
    const stp = WX.altimeterToStationPressure(1013.25, 2000);
    return { stp: stp, da: WX.densityAltitude(stp, 35, 10), isaT: WX.isaAt(WX.geometricToGeopotential(2000)).T - 273.15 };
  });
  assert(Math.abs(da2n - Math.round(engine5.da)) <= 1, `密度高度 ${da2n} 应等于现场算的 ${engine5.da}`);
  assert(Math.abs(engine5.da - 3168.216) < 0.5, `2000 m 场地 35°C 的密度高度应约 3168.2 m（实得 ${engine5.da}）`);
  // 侧风
  await page.fill('#wx-x-rwy', '27'); await page.fill('#wx-x-dir', '180'); await page.fill('#wx-x-spd', '10');
  await page.waitForTimeout(60);
  const xkv = await page.evaluate(() => [...document.querySelectorAll('#wx-p-calc .wx-kv dt')]
    .filter((x) => x.textContent.trim() === '侧风分量').map((x) => x.parentElement.querySelector('dd').textContent.trim()));
  assert(/10\.00 自左/.test(xkv[0]), `180° 10 m/s 对 27 号跑道应是 10 m/s 的左侧风（实得 ${xkv[0]}）`);

  /* ── 8. 口径页：公布的统计数字必须与离线套件跑出来的字面量一致（异源） ── */
  await onTab('about');
  const total = await page.evaluate(() => Number(document.getElementById('wx-verify-total').dataset.wxTotal));
  assert(total === 78683, `页面公布的验证总数应为离线套件实测的 78683（实得 ${total}）`);
  // 逐行也要钉死：只断「分项之和 = 总数」是同源推导、恒真，改错一行照样绿（2026-09-06 教训）。
  // 下面这几个数是离线套件五个分区各自打印出来的 pass 数。
  const EXPECT = [644, 51274, 22301, 3607, 857];
  const shownRows = await page.evaluate(() => [...document.querySelectorAll('#wx-p-about [data-wx-n]')].map((n) => Number(n.dataset.wxN)));
  assert(JSON.stringify(shownRows) === JSON.stringify(EXPECT),
    `口径页各行的断言条数应为 ${JSON.stringify(EXPECT)}（实得 ${JSON.stringify(shownRows)}）`);
  assert(shownRows.reduce((a, b) => a + b, 0) === total, '各行之和应等于公布的总数');
  // 异源核对②：口径页里「现场复算」的几行必须等于引擎当场算出来的值
  const live = await page.evaluate(() => ({
    lcl: document.getElementById('wx-live-lcl').textContent,
    lclt: document.getElementById('wx-live-lclt').textContent,
    isa: document.getElementById('wx-live-isa').textContent,
    tw: document.getElementById('wx-live-tw').textContent,
    real: { lcl: WX.lcl(1000, 26, 20).p, lclt: WX.lcl(1000, 26, 20).t,
      isa: WX.isaAt(5000).p / 100, tw: WX.wetBulbTemperature(1000, 26, 20) }
  }));
  assert(Math.abs(num(live.lcl) - live.real.lcl) < 5e-4, `现场复算 LCL 气压 ${live.lcl} vs ${live.real.lcl}`);
  assert(Math.abs(num(live.isa) - live.real.isa) < 5e-4, `现场复算标准大气气压 ${live.isa} vs ${live.real.isa}`);
  assert(Math.abs(live.real.isa - 540.1989) < 0.01, `5000 m 位势高的标准大气气压应约 540.20 hPa（实得 ${live.real.isa}）`);
  assert(Math.abs(num(live.tw) - live.real.tw) < 5e-4, `现场复算湿球温度 ${live.tw} vs ${live.real.tw}`);
  // markdown 记号不应原样显示
  const stray = await page.evaluate(() => [...document.querySelectorAll('#wx-p-about *')]
    .filter((n) => n.children.length === 0 && /\*\*|__/.test(n.textContent)).length);
  assert(stray === 0, `口径页有 ${stray} 处 markdown 记号被原样显示`);

  /* ── 9. 控件塌缩守卫：逐分区扫一遍所有可见控件 ── */
  let scanned = 0;
  for (const t of TABS) {
    await onTab(t);
    const bad = await page.evaluate(() => {
      const out = [];
      let n = 0;
      for (const e of document.querySelectorAll('section:not([hidden]) input, section:not([hidden]) select, section:not([hidden]) button, section:not([hidden]) textarea')) {
        const r = e.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        n++;
        const isBox = e.tagName === 'INPUT' || e.tagName === 'SELECT' || e.tagName === 'TEXTAREA';
        const minW = isBox ? 100 : 52;
        if (r.width < minW || r.height < 18) out.push(`${e.tagName}#${e.id || '?'} ${r.width.toFixed(0)}×${r.height.toFixed(0)}`);
      }
      return { bad: out, n: n };
    });
    scanned += bad.n;
    assert(bad.bad.length === 0, `${t} 分区有控件被压扁：${bad.bad.join(', ')}`);
  }
  assert(scanned >= 20, `逐分区累计应扫到 20 个以上控件（实得 ${scanned}）`);

  /* ── 10. 窄屏横向溢出守卫：逐视口 × 逐分区 ── */
  for (const vw of [390, 768, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of TABS) {
      await onTab(t);
      await page.waitForTimeout(40);
      const over = await page.evaluate(() => {
        const de = document.documentElement;
        const d = de.scrollWidth - de.clientWidth;
        if (d <= 1) return { d: d, who: '' };
        const w = de.clientWidth;
        const who = [...document.querySelectorAll('section:not([hidden]) *')]
          .filter((n) => n.getBoundingClientRect().right > w + 1)
          .slice(0, 4).map((n) => { const c = typeof n.className === 'string' ? n.className : (n.getAttribute('class') || ''); return `${n.tagName}${c ? '.' + c.split(' ')[0] : ''}@${n.getBoundingClientRect().right.toFixed(0)}`; });
        return { d: d, who: who.join(' ') };
      });
      assert(over.d <= 1, `${vw}px 下 ${t} 分区横向溢出 ${over.d}px：${over.who}`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });

  /* ── 11. 表格里的数字不能溢出格子 ── */
  await onTab('sounding');
  const spill = await page.evaluate(() => {
    let bad = 0;
    for (const td of document.querySelectorAll('#wx-p-sounding table tbody td')) {
      const r = td.getBoundingClientRect();
      if (r.width > 0 && td.scrollWidth > td.clientWidth + 2) bad++;
    }
    return bad;
  });
  assert(spill === 0, `${spill} 个表格单元格里的内容溢出了格子`);

  /* ── 12. 缩略图：截 Skew-T 那一屏 ── */
  await page.selectOption('#wx-snd-pick', '72249-2024-05-21-12');
  await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector('#wx-skewt-box').scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(150);
  await screenshot('thumb.png');
}
