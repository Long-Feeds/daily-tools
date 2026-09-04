// 轨道力学工作台 · 浏览器集成测试
// 断言原则：真的操作 + 断真实数值（与官方 / Skyfield 对拍过的期望值），
// 并额外带四类守卫：[hidden] 计算样式、逐视口横向溢出、逐分区控件尺寸、SVG 文字不重叠/不越界。
export default async ({ page, toolURL, screenshot, assert }) => {
  const D = 180 / Math.PI;
  let n = 0;
  const A = (cond, msg) => { n++; assert(cond, msg); };
  const near = (a, b, tol, msg) => A(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b}（容差 ${tol}）`);

  await page.goto(toolURL, { waitUntil: 'load' });
  await page.evaluate(() => localStorage.clear());              // 让本轮不受上一轮残留状态影响
  await page.goto(toolURL + '#elements', { waitUntil: 'load' });
  await page.waitForSelector('#ol-elem-grid');

  /* ---------- 0. 基本骨架 ---------- */
  A(await page.locator('a[href="../../"]').first().isVisible(), '缺少「返回工具集」链接');
  A((await page.title()).includes('轨道力学'), '标题不对');
  const tabs = ['elements', 'track', 'passes', 'dv', 'notes'];
  for (const t of tabs) A(await page.locator(`#ol-tab-${t}`).count() === 1, `缺少分区按钮 ${t}`);

  // [hidden] 守卫：断计算样式而不是属性
  for (const t of tabs.slice(1)) {
    const disp = await page.locator(`#ol-panel-${t}`).evaluate((e) => getComputedStyle(e).display);
    A(disp === 'none', `分区 ${t} 应被隐藏，实际 display=${disp}`);
  }
  A(await page.locator('#ol-panel-elements').evaluate((e) => getComputedStyle(e).display) !== 'none', '默认分区没显示');

  /* ---------- 1. 默认载入 ISS：解析状态 ---------- */
  const status = await page.locator('#ol-status').innerText();
  A(status.includes('25544'), `状态区没有 ISS 的 NORAD 编号：${status.slice(0, 120)}`);
  A(status.includes('98067A'), '状态区没有国际标识 98067A');
  A(status.includes('SGP4 近地'), 'ISS 应走近地分支');
  A(/第 1 行 通过/.test(status) && /第 2 行 通过/.test(status), `校验和应通过：${status}`);

  /* ---------- 2. 轨道根数：真实数值（与 sgp4/skyfield 对拍过） ---------- */
  const grid = await page.locator('#ol-elem-grid').innerText();
  const cellOf = async (label) => page.locator('#ol-elem-grid .ol-cell', { hasText: label }).first().locator('dd').innerText();
  const period = parseFloat(await cellOf('轨道周期'));
  near(period, 93.0, 0.15, 'ISS 轨道周期应约 93 分钟');
  const inc = parseFloat(await cellOf('轨道倾角'));
  near(inc, 51.63, 0.05, 'ISS 倾角应为 51.63°');
  const semi = parseFloat(await cellOf('半长轴'));
  near(semi, 6798, 6, 'ISS 半长轴应约 6798 km');
  A(grid.includes('近地轨道 LEO'), `ISS 应被判成近地轨道，实得：${grid.slice(0, 200)}`);

  // 电文逐字段表：列位与原文必须对得上
  const f1 = await page.locator('#ol-panel-elements .ol-card-soft').first().innerText();
  A(f1.includes('弹道系数 B*'), '第 1 行字段表缺少 B*');
  A(f1.includes('2026 年第 246 天') || /2026 年第 246\./.test(f1), `历元字段解读不对：${f1.slice(0, 400)}`);

  // 此刻读数：与页面自己的引擎一致，且在物理范围内
  const live = page.locator('#ol-live');
  const lat = parseFloat(await live.getAttribute('data-lat'));
  const alt = parseFloat(await live.getAttribute('data-alt'));
  A(Math.abs(lat) <= 51.7, `ISS 星下点纬度不可能超过倾角，实得 ${lat}`);
  A(alt > 380 && alt < 460, `ISS 高度应在 380–460 km，实得 ${alt}`);

  /* ---------- 3. 切到别的卫星：深空分支 ---------- */
  await page.selectOption('#ol-sat', { label: '向日葵 9 号' });
  await page.waitForFunction(() => document.getElementById('ol-status').innerText.includes('SDP4'));
  const geoStatus = await page.locator('#ol-status').innerText();
  A(geoStatus.includes('SDP4 深空'), '静止轨道应走深空分支');
  const geoGrid = await page.locator('#ol-elem-grid').innerText();
  A(geoGrid.includes('地球静止轨道 GEO'), `向日葵 9 号应被判成静止轨道：${geoGrid.slice(0, 200)}`);
  near(parseFloat(await cellOf('轨道周期')), 1436.1, 1.0, '静止轨道周期应约 1436 分钟');

  await page.selectOption('#ol-sat', { label: '闪电 2-14（历史电文）' });
  await page.waitForFunction(() => document.getElementById('ol-elem-grid').innerText.includes('闪电轨道'));
  const molGrid = await page.locator('#ol-elem-grid').innerText();
  A(molGrid.includes('闪电轨道 Molniya'), '闪电轨道分类不对');
  near(parseFloat(await cellOf('轨道倾角')), 64.16, 0.05, '闪电轨道倾角应为 64.16°');
  // 历史电文（2006 年）必须触发「电文太老」提示
  A(await page.locator('#ol-age-warn').count() === 1, '2006 年的历史电文没有触发年龄警告');

  /* ---------- 4. 粘一段自己的电文 + 非法输入 ---------- */
  await page.fill('#ol-tle', 'BAD DATA\nnot a tle');
  await page.click('#ol-parse');
  const errText = await page.locator('#ol-status-alert').innerText();
  A(errText.includes('没找到成对'), `非法输入应报错：${errText}`);

  const HST = ['HST',
    '1 20580U 90037B   26246.55000000  .00002000  00000+0  10000-3 0  9990',
    '2 20580  28.4700 100.0000 0002500  90.0000 270.0000 15.10000000000010'];
  await page.fill('#ol-tle', HST.join('\n'));
  await page.click('#ol-parse');
  await page.waitForFunction(() => document.getElementById('ol-status').innerText.includes('20580'));
  near(parseFloat(await cellOf('轨道倾角')), 28.47, 0.01, '手工粘的电文倾角读错');
  // 校验和是我随手编的，必须被指出来
  const cs = await page.locator('#ol-status').innerText();
  A(/第 1 行 不符|第 2 行 不符/.test(cs), `编造的校验和应被指出：${cs}`);

  /* ---------- 5. 地面轨迹 ---------- */
  await page.click('#ol-tab-track');
  await page.waitForSelector('#ol-map');
  await page.fill('#ol-track-start', '2026-09-04T20:00');
  await page.dispatchEvent('#ol-track-start', 'change');
  await page.waitForFunction(() => document.querySelector('#ol-map') !== null);
  const paths = await page.locator('#ol-trackpaths path').count();
  A(paths >= 1, '地面轨迹一条线都没画出来');
  const landPaths = await page.locator('#ol-map g[fill="#161a20"] path').count();
  A(landPaths === 121, `世界地图陆地轮廓应为 121 条，实得 ${landPaths}`);
  A(await page.locator('#ol-daypath').count() === 1, '缺少昼夜分界（白昼半球）');
  A(await page.locator('#ol-subpoint').count() === 1, '缺少当前星下点标记');
  const dropped = Number(await page.locator('#ol-map').getAttribute('data-dropped'));
  A(dropped === 0, `地图上有 ${dropped} 条标注因为重叠被丢弃`);
  // 轨迹点必须落在地图框内
  const bad = await page.evaluate(() => {
    const svg = document.getElementById('ol-map');
    let out = 0;
    svg.querySelectorAll('#ol-trackpaths path').forEach((p) => {
      p.getAttribute('d').slice(1).split('L').forEach((seg) => {
        const [x, y] = seg.split(',').map(Number);
        if (!(x >= -0.5 && x <= 720.5 && y >= -0.5 && y <= 360.5)) out++;
      });
    });
    return out;
  });
  A(bad === 0, `${bad} 个地面轨迹采样点画到了地图框外`);
  // 昼夜多边形必须与太阳高度角一致（几何断言：谁在白昼那一半）
  const dayCheck = await page.evaluate(() => {
    const path = document.getElementById('ol-daypath');
    const jd = OL.jdFromDate(new Date(document.getElementById('ol-track-start').value));
    const D = 180 / Math.PI, R = Math.PI / 180;
    const pt = document.getElementById('ol-map').createSVGPoint();
    let checked = 0, bad = [];
    for (let lat = -80; lat <= 80; lat += 10) for (let lon = -175; lon < 180; lon += 15) {
      const el = OL.sunElevation(jd, { lat: lat * R, lon: lon * R, alt: 0 }) * D;
      if (Math.abs(el) < 1.5) continue;                 // 晨昏线附近 1.5° 内不判
      pt.x = (lon + 180) / 360 * 720; pt.y = (90 - lat) / 180 * 360;
      checked++;
      if (path.isPointInFill(pt) !== (el > 0)) bad.push(`${lat},${lon} 太阳高度 ${el.toFixed(1)}°`);
    }
    return { checked, bad: bad.slice(0, 5), n: bad.length };
  });
  A(dayCheck.checked > 150, `昼夜守卫只检了 ${dayCheck.checked} 个点`);
  A(dayCheck.n === 0, `昼夜分界画反或画错了（${dayCheck.n} 处不符）：${dayCheck.bad.join('；')}`);
  A(await page.locator('#ol-terminator').count() === 1, '缺少晨昏线');

  // 读数：星下点纬度不能超过倾角
  const trackRead = await page.locator('#ol-track-read').innerText();
  A(/星下点纬度/.test(trackRead) && /覆盖半径/.test(trackRead), `地面轨迹读数不全：${trackRead.slice(0, 200)}`);

  // 时间游标：拖动后星下点应该真的动
  const before = await page.locator('#ol-subpoint').getAttribute('cx');
  await page.locator('#ol-track-time').evaluate((e) => { e.value = String(Math.round(Number(e.max) / 3)); e.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForFunction((b) => document.getElementById('ol-subpoint') && document.getElementById('ol-subpoint').getAttribute('cx') !== b, before);
  const after = await page.locator('#ol-subpoint').getAttribute('cx');
  A(before !== after, '拖时间游标后星下点没有移动');

  /* ---------- 6. 过境预报：ISS 在新加坡（与 Skyfield 对过） ---------- */
  await page.selectOption('#ol-sat', { label: '国际空间站' });
  await page.click('#ol-tab-passes');
  await page.waitForSelector('#ol-city');
  await page.selectOption('#ol-city', { label: '新加坡' });
  await page.fill('#ol-pass-start', '2026-09-04T08:00');
  await page.fill('#ol-days', '3');
  await page.fill('#ol-minel', '10');
  await page.click('#ol-calc');
  await page.waitForSelector('#ol-pass-table tbody tr');
  const rows = await page.locator('#ol-pass-table tbody tr').count();
  A(rows >= 4 && rows <= 40, `新加坡 3 天内的 ISS 过境次数应在 4–40 之间，实得 ${rows}`);
  const summary = await page.locator('#ol-pass-summary').innerText();
  A(/共 \d+ 次过境/.test(summary), `过境摘要不对：${summary}`);
  // 每一行的最高仰角都必须 ≥ 门槛，落下必须晚于升起
  const bads = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('#ol-pass-table tbody tr').forEach((tr, i) => {
      const td = tr.querySelectorAll('td');
      const el = parseFloat(td[4].textContent);
      if (!(el >= 9.99)) out.push(`第 ${i + 1} 行最高仰角 ${el}`);
      const rise = td[0].textContent.trim().split(' ')[1], set = td[7].textContent.trim();
      if (rise > set && rise.slice(0, 2) === set.slice(0, 2)) out.push(`第 ${i + 1} 行落下早于升起`);
    });
    return out;
  });
  A(bads.length === 0, `过境表有问题的行：${bads.join('；')}`);

  // 天空图
  A(await page.locator('#ol-sky').count() === 1, '缺少天空图');
  const skyDropped = Number(await page.locator('#ol-sky').getAttribute('data-dropped'));
  const skyDrawn = Number(await page.locator('#ol-sky').getAttribute('data-drawn'));
  A(skyDrawn === 3, `天空图应画出升/高/落三条标注，实得 ${skyDrawn}（丢弃 ${skyDropped}）`);
  A(skyDropped === 0, `天空图有 ${skyDropped} 条标注被丢弃`);
  // 天空图上的轨迹点必须落在地平圆内
  const outside = await page.evaluate(() => {
    const svg = document.getElementById('ol-sky');
    let bad = 0;
    svg.querySelectorAll('path[stroke="#1c69d4"],path[stroke="#5a6472"]').forEach((p) => {
      p.getAttribute('d').slice(1).split('L').forEach((seg) => {
        const [x, y] = seg.split(',').map(Number);
        if (Math.hypot(x - 230, y - 230) > 187) bad++;
      });
    });
    return bad;
  });
  A(outside === 0, `天空图有 ${outside} 个轨迹点画到了地平圈外`);

  // 选中另一行 → 详情跟着换；选最高的那次，读数应与表格一致
  const firstPeak = await page.locator('#ol-pass-stats').innerText();
  const elList = await page.evaluate(() =>
    [...document.querySelectorAll('#ol-pass-table tbody tr')].map((tr) => parseFloat(tr.querySelectorAll('td')[4].textContent)));
  const bestIdx = elList.indexOf(Math.max(...elList));
  A(Math.max(...elList) > 45, `三天里应至少有一次高仰角过境，实得最高 ${Math.max(...elList)}°`);
  await page.locator('#ol-pass-table tbody tr').nth(bestIdx).click();
  await page.waitForFunction((t) => document.getElementById('ol-pass-stats').innerText !== t, firstPeak);
  const stats = await page.locator('#ol-pass-stats').innerText();
  A(stats !== firstPeak, '点另一行后详情没有更新');
  const statEl = parseFloat(await page.locator('#ol-pass-stats .ol-cell', { hasText: '最高仰角' }).first().locator('dd').innerText());
  near(statEl, elList[bestIdx], 0.06, '天空图详情里的最高仰角与表格不一致（度/弧度或选错行都会在这里现形）');
  // 多普勒：高仰角过境时径向速度接近 ±7 km/s，145.8 MHz 下峰峰值应约 6.5 kHz
  A(await page.locator('#ol-doppler').count() === 1, '缺少多普勒曲线');
  const dop = await page.locator('#ol-pass-stats').innerText();
  A(/多普勒峰峰值/.test(dop), '缺少多普勒峰峰值读数');
  const dopKHz = parseFloat(dop.split('多普勒峰峰值')[1].trim());
  A(dopKHz > 5.5 && dopKHz < 8, `${statEl.toFixed(1)}° 高仰角过境、145.8 MHz 下行的多普勒峰峰值应在 5.5–8 kHz，实得 ${dopKHz}`);
  // 换个频率：多普勒应成正比
  await page.fill('#ol-freq', '437.5');
  await page.locator('#ol-pass-table tbody tr').nth(bestIdx).click();
  await page.waitForFunction((v) => !document.getElementById('ol-pass-stats').innerText.includes(v), String(dopKHz));
  const dop2 = parseFloat((await page.locator('#ol-pass-stats').innerText()).split('多普勒峰峰值')[1].trim());
  near(dop2 / dopKHz, 437.5 / 145.8, 0.02, '多普勒频移应与载波频率成正比');
  await page.fill('#ol-freq', '145.8');

  // 静止轨道从新加坡看：仰角/方位/距离是几乎不变的固定值（度当弧度用会立刻现形）
  await page.selectOption('#ol-sat', { label: '向日葵 9 号' });
  await page.click('#ol-tab-elements');
  await page.waitForSelector('#ol-live[data-el]');
  await page.waitForFunction(() => document.getElementById('ol-live').getAttribute('data-site') === '新加坡');
  const gEl = parseFloat(await page.locator('#ol-live').getAttribute('data-el'));
  const gAz = parseFloat(await page.locator('#ol-live').getAttribute('data-az'));
  const gRange = parseFloat(await page.locator('#ol-live').getAttribute('data-range'));
  near(gEl, 47.2, 0.4, '向日葵 9 号（140.7°E 静止）从新加坡看的仰角');
  near(gAz, 91.8, 1.0, '向日葵 9 号从新加坡看的方位角');
  near(gRange, 37266, 400, '向日葵 9 号从新加坡看的斜距');

  // 静止轨道：必须说「整段都在天上」而不是「没有过境」
  await page.selectOption('#ol-sat', { label: '向日葵 9 号' });
  await page.click('#ol-tab-passes');
  await page.waitForSelector('#ol-city');
  await page.selectOption('#ol-city', { label: '新加坡' });
  await page.fill('#ol-pass-start', '2026-09-04T08:00');
  await page.click('#ol-calc');
  await page.waitForSelector('#ol-pass-table tbody tr');
  const geoRows = await page.locator('#ol-pass-table tbody tr').innerText();
  A(geoRows.includes('整段都在天上'), `静止轨道应报「整段都在天上」：${geoRows}`);

  /* ---------- 7. 机动 Δv：教科书数值 ---------- */
  await page.click('#ol-tab-dv');
  await page.waitForSelector('#ol-dv-grid');
  await page.fill('#ol-h1', '200');
  await page.fill('#ol-h2', '35786');
  await page.waitForFunction(() => document.getElementById('ol-dv-grid').innerText.includes('霍曼总'));
  const dvOf = async (label) => parseFloat(await page.locator('#ol-dv-grid .ol-cell', { hasText: label }).first().locator('dd').innerText());
  near(await dvOf('霍曼 Δv₁'), 2.4546, 0.001, 'LEO(200km)→GEO 的第一次点火 Δv');
  near(await dvOf('霍曼 Δv₂'), 1.4773, 0.001, 'LEO(200km)→GEO 的第二次点火 Δv');
  near(await dvOf('霍曼总 Δv'), 3.9319, 0.001, 'LEO(200km)→GEO 总 Δv');
  const dvText = await page.locator('#ol-dv-grid').innerText();
  A(/转移耗时 5\.2[0-9]* 小时/.test(dvText), `霍曼转移时间应约 5.26 小时：${dvText.slice(0, 300)}`);
  near(await dvOf('单独改倾角'), 1.5137, 0.002, 'GEO 上改 28.5° 倾角的 Δv');
  // 合并机动必须比「先圆化再转向」省
  const comb = await dvOf('转移末端合并改倾角');
  A(comb < 3.9319 + 1.5137, '合并机动没有比分开做省');
  A(comb > 1.4, '合并机动的数值不合理');
  // 双椭圆：r2/r1 < 11.94 时霍曼必须更省
  const ratioText = await page.locator('#ol-dv-grid .ol-cell', { hasText: '半径比' }).first().innerText();
  A(ratioText.includes('霍曼必定更省'), `200→35786 km 的半径比约 6.3，应判霍曼更省：${ratioText}`);
  // 换成极大半径比：双椭圆应反超
  await page.fill('#ol-h2', '380000');
  await page.fill('#ol-hb', '900000');
  await page.waitForFunction(() => document.getElementById('ol-dv-grid').innerText.includes('双椭圆'));
  const be = await page.locator('#ol-dv-grid .ol-cell', { hasText: '双椭圆总' }).first().innerText();
  A(be.includes('比霍曼省'), `半径比 ~57 时双椭圆应该更省：${be}`);
  // 转移示意图的几何：椭圆必须与两个圆各相切一次（近点贴起始圆、远点贴目标圆）
  await page.fill('#ol-h1', '417');
  await page.fill('#ol-h2', '35786');
  await page.waitForFunction(() => document.querySelector('#ol-dvfig ellipse') !== null);
  const fig = await page.evaluate(() => {
    const svg = document.getElementById('ol-dvfig');
    const cs = [...svg.querySelectorAll('circle')].map((c) => ({ cx: +c.getAttribute('cx'), r: +c.getAttribute('r'), s: c.getAttribute('stroke') }));
    const e = svg.querySelector('ellipse');
    return { c1: cs.find((c) => c.s === '#0066b1'), c2: cs.find((c) => c.s === '#1c69d4'),
      ex: +e.getAttribute('cx'), erx: +e.getAttribute('rx'), ery: +e.getAttribute('ry') };
  });
  near(fig.ex - fig.erx, fig.c1.cx - fig.c1.r, 0.5, '转移椭圆的近点没有贴住起始圆');
  near(fig.ex + fig.erx, fig.c2.cx + fig.c2.r, 0.5, '转移椭圆的远点没有贴住目标圆');
  A(fig.ery < fig.erx, '转移椭圆的短半轴应小于长半轴');
  A(fig.c2.r > fig.c1.r, 'GEO 圈应该比 LEO 圈大');

  // 非法输入
  await page.fill('#ol-h1', '0');
  await page.waitForSelector('#ol-dv-err');
  A(await page.locator('#ol-dv-err').count() === 1, '非法高度没有报错');
  await page.fill('#ol-h1', '400');
  await page.waitForSelector('#ol-dv-grid');

  /* ---------- 8. 说明页：公布的数字要能在页面上找到 ---------- */
  await page.click('#ol-tab-notes');
  await page.waitForSelector('#ol-panel-notes h2');
  const notes = await page.locator('#ol-panel-notes').innerText();
  for (const k of ['SGP4 / SDP4', 'tcppver.out', 'Skyfield', 'DE421', 'WGS-72', 'UT1', 'Celestrak', 'Natural Earth']) {
    A(notes.includes(k), `说明页缺少「${k}」`);
  }
  A(/121 条轮廓/.test(notes) && /3482 个点/.test(notes), `说明页里的海岸线规模应与实际一致：${notes.slice(-400)}`);

  // 分区高亮：任何时刻只能有一个 tab 被选中，且只有它带 M 蓝下划线
  for (const t of tabs) {
    await page.click(`#ol-tab-${t}`);
    // 下划线有 0.15s 过渡，必须等目标态出现再断言（正向等待，不用 !== 旧值）
    await page.waitForFunction((id) => getComputedStyle(document.getElementById(id)).borderBottomColor === 'rgb(28, 105, 212)', `ol-tab-${t}`);
    const st = await page.evaluate(() => [...document.querySelectorAll('.ol-tab')].map((b) => ({
      id: b.id, sel: b.getAttribute('aria-selected'), bc: getComputedStyle(b).borderBottomColor })));
    const on = st.filter((x) => x.sel === 'true');
    A(on.length === 1 && on[0].id === `ol-tab-${t}`, `选中的分区应只有 ${t}，实得 ${on.map((x) => x.id).join(',')}`);
    A(on[0].bc === 'rgb(28, 105, 212)', `选中分区的下划线应是 M 蓝，实得 ${on[0].bc}`);
    const others = st.filter((x) => x.sel !== 'true');
    A(others.every((x) => x.bc === 'rgba(0, 0, 0, 0)'), `未选中的分区不该有下划线：${others.map((x) => x.id + '=' + x.bc).join('、')}`);
  }

  /* ---------- 9. 四类通用守卫 ---------- */
  // (a) 单位不被大写化（本页零 text-transform，仍留守卫）
  const upper = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('th,dt,label').forEach((e) => {
      const t = e.textContent;
      if (/\b(HZ|KHZ|MHZ|KM|DBFS|DB|UTC1)\b/.test(t)) bad.push(t.trim().slice(0, 30));
    });
    return bad;
  });
  A(upper.length === 0, `有表头/标签把单位写成了全大写：${upper.join('、')}`);

  // (b) 逐分区扫控件尺寸（隐藏面板里的控件对守卫失明，必须先切过去）
  let scanned = 0;
  for (const t of tabs) {
    await page.click(`#ol-tab-${t}`);
    await page.waitForFunction((id) => getComputedStyle(document.getElementById(id)).display !== 'none', `ol-panel-${t}`);
    const small = await page.evaluate(() => {
      const out = [];
      let count = 0;
      document.querySelectorAll('input,select,button,textarea').forEach((e) => {
        const r = e.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;      // 不可见的跳过
        count++;
        const isCheck = e.type === 'checkbox';
        const minW = isCheck ? 16 : (e.tagName === 'BUTTON' ? 52 : 100);
        if (r.width < minW || r.height < 18) out.push(`${e.tagName}#${e.id || e.className} ${r.width.toFixed(0)}×${r.height.toFixed(0)}`);
      });
      return { out, count };
    });
    scanned += small.count;
    A(small.out.length === 0, `分区 ${t} 有控件塌缩：${small.out.join('、')}`);
  }
  A(scanned >= 40, `逐分区一共只扫到 ${scanned} 个控件，守卫可能没生效`);

  // (c) 逐视口 × 逐分区的横向溢出守卫
  for (const vw of [390, 768, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of tabs) {
      await page.click(`#ol-tab-${t}`);
      await page.waitForFunction((id) => getComputedStyle(document.getElementById(id)).display !== 'none', `ol-panel-${t}`);
      const info = await page.evaluate(() => {
        const de = document.documentElement;
        const over = de.scrollWidth - de.clientWidth;
        const culprits = [];
        if (over > 1) {
          document.querySelectorAll('*').forEach((e) => {
            const r = e.getBoundingClientRect();
            if (r.right > de.clientWidth + 1 && r.width > 0) culprits.push(`${e.tagName}.${(e.className || '').toString().split(' ')[0]}@${r.right.toFixed(0)}`);
          });
        }
        return { over, culprits: culprits.slice(0, 6) };
      });
      A(info.over <= 1, `${vw}px 下分区 ${t} 横向溢出 ${info.over}px，越界元素：${info.culprits.join('、')}`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 850 });

  // (d) SVG 文字两两不重叠、且都在画布内
  await page.click('#ol-tab-passes');
  await page.waitForSelector('#ol-sky');
  const svgBad = await page.evaluate(() => {
    const problems = [];
    document.querySelectorAll('svg').forEach((svg) => {
      if (getComputedStyle(svg).display === 'none' || !svg.getBoundingClientRect().width) return;
      const texts = [...svg.querySelectorAll('text')];
      const boxes = texts.map((t) => ({ t: t.textContent, b: t.getBoundingClientRect() }));
      const sb = svg.getBoundingClientRect();
      boxes.forEach((x) => {
        if (x.b.left < sb.left - 2 || x.b.right > sb.right + 2 || x.b.top < sb.top - 2 || x.b.bottom > sb.bottom + 2)
          problems.push(`「${x.t}」越出画布`);
      });
      for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i].b, b = boxes[j].b;
        if (a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1)
          problems.push(`「${boxes[i].t}」与「${boxes[j].t}」重叠`);
      }
    });
    return problems;
  });
  A(svgBad.length === 0, `SVG 文字有问题：${svgBad.slice(0, 6).join('；')}`);

  // (e) 小格子里的子元素不越出父格
  const escaped = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('.ol-cell').forEach((c) => {
      const cb = c.getBoundingClientRect();
      if (!cb.width) return;
      c.querySelectorAll('dt,dd,.ol-cell-note').forEach((k) => {
        const kb = k.getBoundingClientRect();
        if (kb.right > cb.right + 1 || kb.left < cb.left - 1 || kb.bottom > cb.bottom + 1)
          bad.push(`${k.tagName}「${k.textContent.slice(0, 14)}」越出数据格`);
      });
    });
    return bad;
  });
  A(escaped.length === 0, `数据格里的内容越界：${escaped.slice(0, 5).join('；')}`);

  /* ---------- 10. localStorage 有状态：存的电文能回来 ---------- */
  await page.evaluate(() => { document.getElementById('ol-tle').value =
    'MY SAT\n1 20580U 90037B   26246.55000000  .00002000  00000+0  10000-3 0  9990\n2 20580  28.4700 100.0000 0002500  90.0000 270.0000 15.10000000000010'; });
  await page.click('#ol-parse');
  await page.waitForFunction(() => document.getElementById('ol-status').innerText.includes('20580'));
  await page.click('#ol-save');
  await page.waitForSelector('#ol-saved');
  await page.reload({ waitUntil: 'load' });
  await page.waitForSelector('#ol-sat option', { state: 'attached' });
  const opts = await page.locator('#ol-sat option').allInnerTexts();
  A(opts.some((o) => o.includes('MY SAT')), `刷新后自存的电文应还在下拉里：${opts.join('|')}`);
  // 刷新后应回到离开时的分区（这也是「有状态」的一部分）
  const restored = await page.evaluate(() => [...document.querySelectorAll('.ol-tab')].find((b) => b.getAttribute('aria-selected') === 'true').id);
  A(restored === 'ol-tab-passes', `刷新后应恢复到离开时的分区，实得 ${restored}`);

  /* ---------- 11. 零页面错误 + 截图 ---------- */
  await page.click('#ol-tab-track');
  await page.waitForSelector('#ol-map');
  await page.click('#ol-tab-elements');
  await page.waitForSelector('#ol-elem-grid');
  await page.evaluate(() => window.scrollTo(0, 0));
  await screenshot('thumb.png');
  console.log(`  轨道力学工作台：${n} 条断言通过`);
};
