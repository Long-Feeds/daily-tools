// Integration test for 地理工作台 · Geo Studio.
// Asserts real geodetic output (analytic closed forms, datum round trips through the
// UI, measured areas/lengths) rather than element existence, plus the layout guards
// that DOM assertions are systematically blind to.
export default async ({ page, toolURL, screenshot, assert }) => {
  const text = (sel) => page.$eval(sel, (el) => el.textContent.trim());
  // first numeric token only — these readouts carry units and second numbers
  const num = (s) => {
    const m = String(s).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
    return m ? parseFloat(m[0]) : NaN;
  };
  // wait for the render marker to advance — never a fixed timeout
  const settle = async (fn) => {
    const before = await page.evaluate(() => document.body.dataset.sig || '');
    await fn();
    await page.waitForFunction((b) => (document.body.dataset.sig || '') !== b, before, { timeout: 8000 });
  };
  const setPair = async (a, b) => settle(async () => {
    await page.fill('#pt-a', a);
    await page.fill('#pt-b', b);
    await page.click('#calc');
  });
  const display = (sel) => page.$eval(sel, (el) => getComputedStyle(el).display);
  const rect = (sel) => page.$eval(sel, (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height, right: r.right, bottom: r.bottom };
  });

  await page.goto(toolURL, { waitUntil: 'load' });
  await page.waitForFunction(() => !!document.body.dataset.sig, null, { timeout: 8000 });

  // ── shell ──────────────────────────────────────────────────────────
  assert((await page.title()).includes('地理工作台'), 'title names the tool');
  assert(await page.$('a.back[href="../../"]'), 'back link to the hub exists');
  assert((await text('#tab-geodesy')) === '测距与航向', 'first tab label');

  // ── 1 · geodesy: analytic closed forms straight through the UI ──────
  // The equator is a geodesic, so 1° of longitude is exactly a·π/180 = 111319.4908 m.
  await setPair('0, 0', '0, 1');
  assert((await text('#res-dist')) === '111.319 km',
    `equator 1° = a·π/180 → 111.319 km, got ${await text('#res-dist')}`);
  assert((await text('#res-az1')).startsWith('90.0000°'), `due-east azimuth, got ${await text('#res-az1')}`);
  // A meridian is a geodesic too: 0→1° must equal the WGS84 meridian arc 110574.3886 m.
  await setPair('0, 0', '1, 0');
  assert((await text('#res-dist')) === '110.574 km',
    `meridian 1° = 110.574 km, got ${await text('#res-dist')}`);
  assert((await text('#res-az1')).startsWith('0.0000°'), `due-north azimuth, got ${await text('#res-az1')}`);
  assert((await text('#res-dist')) !== '111.319 km', 'a degree of latitude differs from a degree of longitude');

  // Singapore → Beijing, pinned against the offline engine suite
  await setPair('1.2838, 103.8607', '39.9086, 116.3974');
  assert((await text('#res-dist')) === '4,462.060 km', `SG→BJ distance, got ${await text('#res-dist')}`);
  assert((await text('#res-az1')).startsWith('15.0130°'), `SG→BJ α₁, got ${await text('#res-az1')}`);
  assert((await text('#res-az2')).startsWith('19.7033°'), `SG→BJ α₂, got ${await text('#res-az2')}`);
  assert((await text('#res-hav')) === '4,478.230 km', `haversine, got ${await text('#res-hav')}`);
  const hd = await text('#res-havdiff');
  assert(hd.includes('16.170 km') && hd.includes('-0.362%'), `ellipsoid − sphere, got ${hd}`);
  assert((await text('#res-iters')) === '5 次', `iteration count, got ${await text('#res-iters')}`);
  assert((await text('#res-method')).includes('收敛'), 'converged Vincenty is labelled as such');
  assert(num(await text('#res-check')) < 1,
    `direct(inverse) self-check is sub-millimetre, got ${await text('#res-check')}`);
  assert((await text('#res-mid')) === '20.729110, 109.304367', `midpoint, got ${await text('#res-mid')}`);
  assert((await text('#ref-quarter')) === '10,001.966 km',
    `quarter-meridian reference, got ${await text('#ref-quarter')}`);
  // a degree of longitude shrinks with latitude
  assert(num(await text('#ref-lonlat')) < num(await text('#ref-eq')),
    'a degree of longitude at 1.28°N is shorter than at the equator');
  // a nautical mile is 1852 m by definition at 45°; near the equator the meridian
  // radius of curvature is smaller, so one arcminute is measurably shorter
  assert((await text('#ref-nm')) === '1.843 km',
    `1′ of latitude at 1.28°N = 1.843 km, got ${await text('#ref-nm')}`);
  assert(num(await text('#ref-nm')) < 1.852, 'one arcminute near the equator is under a nautical mile');

  // reverse azimuth: swapping the endpoints must give α₂ + 180 exactly
  await settle(() => page.click('#swap'));
  assert((await text('#res-az1')).startsWith('199.7033°'),
    `swapped α₁ = α₂ + 180, got ${await text('#res-az1')}`);
  assert((await text('#res-dist')) === '4,462.060 km', 'distance is symmetric under swap');
  await settle(() => page.click('#swap'));

  // direct solution round-trips back onto the destination
  await settle(() => page.click('#dir-go'));
  assert(/^39\.9086/.test(await text('#dir-out')), `direct landing point, got ${await text('#dir-out')}`);
  assert(num(await text('#dir-delta')) < 500 && (await text('#dir-delta')).includes('cm'),
    `direct lands within a metre of the destination, got ${await text('#dir-delta')}`);
  assert((await text('#dir-dms')).includes('39°54'), `DMS rendering, got ${await text('#dir-dms')}`);

  // ── hidden-element guard: assert computed style, not just the attribute ──
  assert((await display('#anti-note')) === 'none', 'the fallback note is genuinely invisible when Vincenty converges');
  assert((await display('#parse-err')) === 'none', 'the error box is invisible while input is valid');

  // near-antipodal points: the engine must fall back and say so
  await setPair('0, 0', '0.5, 179.7');
  assert((await text('#res-method')).includes('回退'), `antipodal falls back, got ${await text('#res-method')}`);
  assert((await display('#anti-note')) !== 'none', 'the fallback note becomes visible');
  assert(num(await text('#res-dist')) > 19000, `antipodal distance is ~20000 km, got ${await text('#res-dist')}`);

  // invalid input is reported, not swallowed
  await setPair('not a coordinate', '39.9086, 116.3974');
  assert((await display('#parse-err')) !== 'none', 'the parse error is shown');
  assert((await text('#parse-err')).includes('起点'), `error names the offending field, got ${await text('#parse-err')}`);
  await setPair('95, 200', '39.9086, 116.3974');
  assert((await display('#parse-err')) !== 'none', 'out-of-range latitude/longitude is rejected');
  // DMS input parses
  await setPair(`1°17'01.7"N 103°51'38.5"E`, '39.9086, 116.3974');
  assert((await display('#parse-err')) === 'none', 'DMS input is accepted');
  assert(Math.abs(num(await text('#res-dist')) - 4462.06) < 1,
    `DMS input reproduces the SG→BJ distance, got ${await text('#res-dist')}`);

  // favourites persist through localStorage
  await setPair('1.2838, 103.8607', '39.9086, 116.3974');
  assert((await display('#fav-wrap')) === 'none', 'the favourites block is hidden while empty');
  await settle(() => page.click('#fav-add'));
  assert((await display('#fav-wrap')) !== 'none', 'saving a pair reveals the favourites block');
  assert((await page.$$('#favs button')).length === 2, 'one favourite renders as a chip + delete button');

  // Keyboard zoom: assert the scale bar's pixel length, not its label — the label snaps
  // to 1/2/5-decade values, so a 1.5625× zoom can legitimately leave the text unchanged.
  const barW = () => page.$eval('#m1-bar', (el) => el.getBoundingClientRect().width);
  const barBefore = await barW();
  await page.focus('#map1');
  await page.keyboard.press('+');
  await page.keyboard.press('+');
  await page.waitForFunction((w) => Math.abs(document.getElementById('m1-bar').getBoundingClientRect().width - w) > 2,
    barBefore, { timeout: 4000 });
  assert(Math.abs((await barW()) - barBefore) > 2,
    `keyboard zoom rescales the map (bar ${barBefore} → ${await barW()} px)`);
  assert(/^(1|2|5)(0*)(\.\d+)? (m|km)$/.test(await text('#m1-scale')),
    `the scale bar reports a round distance, got ${await text('#m1-scale')}`);
  // Arrow-key pan moves the centre; the readout shows the map centre until the pointer
  // has entered the canvas, which it has not in this action sequence.
  const centreBefore = await text('#m1-coord');
  assert(/^-?\d+\.\d{6}, -?\d+\.\d{6}$/.test(centreBefore),
    `the map reports its centre coordinate, got "${centreBefore}"`);
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction((c) => document.getElementById('m1-coord').textContent.trim() !== c,
    centreBefore, { timeout: 4000 });
  assert((await text('#m1-coord')) !== centreBefore, 'arrow-key pan moves the map centre');
  await settle(() => page.click('#m1-fit'));

  // ── 2 · datum & projection ─────────────────────────────────────────
  await settle(() => page.click('#tab-datum'));
  assert((await display('#panel-geodesy')) === 'none', 'the inactive panel is genuinely hidden');
  assert((await display('#panel-datum')) !== 'none', 'the datum panel is shown');

  await settle(async () => { await page.fill('#dm-in', '39.90864, 116.39745'); await page.click('#dm-go'); });
  assert((await text('#out-wgs84')) === '39.908640, 116.397450', `WGS84 echo, got ${await text('#out-wgs84')}`);
  assert((await text('#out-gcj02')) === '39.910043, 116.403694', `GCJ-02, got ${await text('#out-gcj02')}`);
  assert((await text('#out-bd09')) === '39.916383, 116.410067', `BD-09, got ${await text('#out-bd09')}`);
  const offG = num(await text('#off-gcj02')), offB = num(await text('#off-bd09'));
  assert((await text('#off-gcj02')).includes('556.1 m'), `GCJ offset magnitude, got ${await text('#off-gcj02')}`);
  assert((await text('#off-bd09')).includes('1.379 km'), `BD offset magnitude, got ${await text('#off-bd09')}`);
  assert(offG > 150 && offG < 900, 'the Beijing GCJ-02 offset lands in the expected few-hundred-metre band');
  assert((await display('#china-note')) === 'none', 'the out-of-China note stays hidden inside China');
  assert((await text('#out-wgs84-dms')).includes(`39°54'31.10"N`), `DMS output, got ${await text('#out-wgs84-dms')}`);

  // projections + grid codes
  assert((await text('#out-utm')).includes('50S') && (await text('#out-utm')).includes('448497.86')
    && (await text('#out-utm')).includes('4417790.98'), `UTM, got ${await text('#out-utm')}`);
  assert((await text('#out-utm-cm')) === '117°E · 北半球', `UTM central meridian, got ${await text('#out-utm-cm')}`);
  assert((await text('#out-merc')) === 'X 12957304.86  Y 4852674.96', `Web Mercator, got ${await text('#out-merc')}`);
  assert((await text('#out-tile')) === '14 / 13489 / 6208', `tile index, got ${await text('#out-tile')}`);
  assert((await text('#out-qk')) === '13210012110001', `quadkey, got ${await text('#out-qk')}`);
  assert((await text('#out-qk')).length === 14, 'quadkey length equals the zoom level');
  assert((await text('#out-geohash')) === 'wx4g09nh9', `geohash, got ${await text('#out-geohash')}`);
  assert((await text('#gh-cell')) === '3.67 m × 4.77 m', `geohash cell size, got ${await text('#gh-cell')}`);
  const cells = await page.$$eval('#gh-grid div', (ds) => ds.map((d) => ({ t: d.textContent.trim(), c: d.className })));
  assert(cells.length === 9, `3×3 neighbour block, got ${cells.length}`);
  assert(cells[4].t === 'wx4g09nh9' && cells[4].c === 'c', 'the centre cell is the point’s own hash');
  assert(new Set(cells.map((c) => c.t)).size === 9, 'the nine neighbour cells are distinct');
  assert(cells.every((c) => c.t.length === 9), 'neighbours share the source precision');

  // geohash prefix property, exercised through the slider
  const long9 = await text('#out-geohash');
  await settle(() => page.fill('#gh-prec', '5'));
  const short5 = await text('#out-geohash');
  assert(short5 === 'wx4g0', `precision 5 geohash, got ${short5}`);
  assert(long9.startsWith(short5), 'a coarser geohash is a prefix of the finer one');
  assert(num(await text('#gh-cell')) > 3.67, 'a coarser geohash cell is larger');
  await settle(() => page.fill('#gh-prec', '9'));

  // datum round trip *through the UI*: feed the BD-09 output back in as BD-09
  await settle(() => page.click('#src-bd09'));
  await settle(async () => { await page.fill('#dm-in', '39.916383, 116.410067'); await page.click('#dm-go'); });
  assert((await text('#out-wgs84')) === '39.908640, 116.397450',
    `BD-09 → WGS84 recovers the original point, got ${await text('#out-wgs84')}`);
  assert((await page.$eval('#src-bd09', (el) => el.getAttribute('aria-pressed'))) === 'true',
    'the active datum chip is marked pressed');
  assert((await page.$eval('#src-wgs84', (el) => el.getAttribute('aria-pressed'))) === 'false',
    'the other datum chips are unpressed');
  await settle(() => page.click('#src-wgs84'));

  // outside China all three datums coincide and the note appears
  await settle(async () => { await page.fill('#dm-in', '1.2838, 103.8607'); await page.click('#dm-go'); });
  assert((await display('#china-note')) !== 'none', 'the out-of-China note becomes visible');
  const w0 = await text('#out-wgs84');
  assert(w0 === (await text('#out-gcj02')) && w0 === (await text('#out-bd09')),
    'outside China the three datums are identical');
  assert((await text('#off-gcj02')) === '无偏移', `no offset outside China, got ${await text('#off-gcj02')}`);
  assert((await text('#out-utm')).includes('48N') && (await text('#out-utm')).includes('373247.64')
    && (await text('#out-utm')).includes('141926.95'), `Singapore UTM, got ${await text('#out-utm')}`);
  // bad datum input
  await settle(async () => { await page.fill('#dm-in', 'xyz'); await page.click('#dm-go'); });
  assert((await display('#dm-err')) !== 'none', 'invalid datum input is reported');

  // ── 3 · GeoJSON measurement ────────────────────────────────────────
  await settle(() => page.click('#tab-geojson'));
  assert((await display('#panel-datum')) === 'none', 'the datum panel hides when leaving it');
  assert((await text('#tot-count')) === '3 / 23', `feature/vertex totals, got ${await text('#tot-count')}`);
  assert((await text('#tot-len')) === '10.263 km', `total geodesic length, got ${await text('#tot-len')}`);
  assert((await text('#tot-area')) === '70.459 公顷', `total spherical area, got ${await text('#tot-area')}`);
  assert((await text('#gj-bbox')).includes('103.8300, 1.2494, 103.8641, 1.3030'),
    `bounding box, got ${await text('#gj-bbox')}`);

  const rows = await page.$$eval('#gj-tbody tr', (trs) =>
    trs.map((tr) => Array.from(tr.children).map((td) => td.textContent.trim())));
  assert(rows.length === 3, `three measured rows, got ${rows.length}`);
  assert(rows[0][0] === '滨海湾环线' && rows[0][1] === '线' && rows[0][2] === '14' && rows[0][3] === '5.601 km',
    `line row, got ${JSON.stringify(rows[0])}`);
  assert(rows[1][1] === '多边形（1 个内环）' && rows[1][4] === '70.459 公顷',
    `polygon row reports its hole and net area, got ${JSON.stringify(rows[1])}`);
  assert(rows[1][5] === '1.299500, 103.842500', `polygon centroid, got ${rows[1][5]}`);
  assert(rows[2][1] === '点' && rows[2][3] === '—' && rows[2][4] === '—',
    `a point has neither length nor area, got ${JSON.stringify(rows[2])}`);

  // Douglas–Peucker: fewer vertices, shorter path, area preserved
  await settle(() => page.fill('#simp-tol', '200'));
  assert((await text('#simp-tol-val')) === '200 m', 'the tolerance readout follows the slider');
  assert((await text('#simp-pts')) === '23 → 16（−30.4%）', `simplified vertex count, got ${await text('#simp-pts')}`);
  const sl = await text('#simp-len');
  assert(sl.includes('10.103 km') && sl.includes('-1.56%'), `simplified length, got ${sl}`);
  assert((await text('#simp-area')).includes('0.00%'),
    `rectangular rings survive a 200 m tolerance, got ${await text('#simp-area')}`);

  // export the simplified geometry as valid GeoJSON
  assert((await display('#gj-out')) === 'none', 'the export box is hidden until asked for');
  await settle(() => page.click('#gj-export'));
  assert((await display('#gj-out')) !== 'none', 'the export box appears');
  const exported = JSON.parse(await page.$eval('#gj-out', (el) => el.value));
  assert(exported.type === 'FeatureCollection' && exported.features.length === 3, 'export is a 3-feature collection');
  assert(exported.properties.toleranceMetres === 200, 'export records the tolerance it used');
  const expLine = exported.features.find((f) => f.geometry.type === 'LineString');
  assert(expLine.geometry.coordinates.length < 14, 'the exported line really is thinned');
  const expPoly = exported.features.find((f) => f.geometry.type === 'Polygon');
  assert(expPoly.geometry.coordinates.length === 2, 'the exported polygon keeps its hole');
  assert(expPoly.geometry.coordinates.every((r) =>
    r.length >= 4 && r[0][0] === r[r.length - 1][0] && r[0][1] === r[r.length - 1][1]),
    'exported rings are explicitly closed');
  await settle(() => page.fill('#simp-tol', '0'));
  assert((await text('#simp-pts')).startsWith('23 → 23'), 'tolerance 0 keeps every vertex');

  // convex hull encloses everything
  await settle(() => page.click('#hull-toggle'));
  assert((await text('#hull-pts')) === '8 点', `hull vertex count, got ${await text('#hull-pts')}`);
  assert((await text('#hull-area')) === '11.807 km²', `hull area, got ${await text('#hull-area')}`);
  assert(num(await text('#hull-area')) * 100 > num(await text('#tot-area')),
    'the hull (km²) encloses far more than the polygon (hectares)');

  // point in polygon, including the hole
  const pip = async (v) => { await settle(async () => { await page.fill('#pip-in', v); await page.click('#pip-go'); }); return text('#pip-out'); };
  assert((await pip('1.2970, 103.8390')).includes('命中 1 个多边形：示例园区红线'),
    'a point inside the ring but outside the hole is a hit');
  assert((await pip('1.2995, 103.8425')).includes('未命中'), 'a point inside the hole is a miss');
  assert((await pip('1.2000, 103.7000')).includes('未命中'), 'a point far outside is a miss');
  assert((await pip('garbage')).includes('无法识别'), 'an unparseable test point is reported');

  // malformed GeoJSON is rejected without wiping out the UI
  await settle(async () => { await page.fill('#gj-src', '{oops'); await page.click('#gj-load'); });
  assert((await display('#gj-err')) !== 'none', 'the GeoJSON error box is shown');
  assert((await text('#gj-err')).includes('JSON 语法错误'), `syntax error message, got ${await text('#gj-err')}`);
  assert((await text('#tot-count')) === '—', 'totals reset when parsing fails');
  await settle(async () => {
    await page.fill('#gj-src', '{"type":"FeatureCollection","features":[]}');
    await page.click('#gj-load');
  });
  assert((await text('#gj-err')).includes('没有 features'), `empty collection message, got ${await text('#gj-err')}`);
  await settle(() => page.click('#gj-example'));
  assert((await text('#tot-count')) === '3 / 23', 'the example reloads cleanly');
  assert((await display('#gj-err')) === 'none', 'the error box clears on a good parse');

  // saved schemes survive a reload
  await settle(async () => { await page.fill('#gj-name', '园区红线'); await page.click('#gj-save'); });
  assert((await display('#gj-saved-wrap')) !== 'none', 'the saved-schemes block appears');
  assert((await page.$eval('#gj-saved button', (el) => el.textContent.trim())) === '园区红线', 'the scheme chip is named');
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => !!document.body.dataset.sig, null, { timeout: 8000 });
  assert((await page.$eval('#gj-saved button', (el) => el.textContent.trim())) === '园区红线',
    'the saved scheme is still there after a reload');
  assert((await display('#panel-geojson')) !== 'none', 'the last active tab is restored');
  assert((await page.$$('#favs button')).length === 2, 'the saved favourite also survives the reload');

  // ── layout guards (DOM assertions are blind to these) ──────────────
  await settle(() => page.click('#tab-geodesy'));
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 1, `no horizontal overflow at 1280px (got ${overflow}px)`);

  const card1 = await rect('#map1-card'), canv1 = await rect('#map1');
  assert(canv1.w > 300 && canv1.h > 200, `map canvas is substantial (${canv1.w}×${canv1.h})`);
  assert(canv1.x >= card1.x - 1 && canv1.right <= card1.right + 1
    && canv1.y >= card1.y - 1 && canv1.bottom <= card1.bottom + 1, 'the canvas stays inside its card');
  const big = await rect('#res-dist');
  assert(big.w > 120 && big.h > 24, `the headline distance renders at size (${big.w}×${big.h})`);

  // controls must not be collapsed by a same-specificity generic selector
  for (const sel of ['#dir-az', '#dir-dist', '#pt-a', '#pt-b']) {
    const r = await rect(sel);
    assert(r.w >= 80 && r.h >= 14, `${sel} is not squashed (${r.w}×${r.h})`);
  }
  for (const sel of ['#swap', '#fav-add']) {
    const r = await rect(sel);
    assert(r.w >= 40 && r.h >= 40, `${sel} keeps a 44px touch target (${r.w}×${r.h})`);
  }
  await settle(() => page.click('#tab-datum'));
  for (const sel of ['#gh-prec', '#tile-z']) {
    const r = await rect(sel);
    assert(r.w >= 100 && r.h >= 12, `slider ${sel} is not collapsed (${r.w}×${r.h})`);
  }
  const ghCell = await rect('#gh-grid div');
  assert(ghCell.w >= 40, `geohash cells are readable (${ghCell.w}px wide)`);
  const gridBox = await rect('#gh-grid');
  assert(ghCell.x >= gridBox.x - 1 && ghCell.right <= gridBox.right + 1, 'geohash cells stay inside the grid');

  // every pill really is a pill, and the palette stays monochrome
  const radii = await page.$$eval('.pill', (bs) => bs.slice(0, 12).map((b) => getComputedStyle(b).borderRadius));
  assert(radii.every((r) => parseFloat(r) >= 36), `every pill is fully rounded (${radii[0]})`);
  // covers inputs and checkboxes too: a native control's accent-color is exactly how a
  // second hue sneaks into an otherwise achromatic system
  const hues = await page.$$eval('.pill, .card, .big, input, textarea, .switch input', (els) => {
    const out = [];
    for (const el of els.slice(0, 60)) {
      const cs = getComputedStyle(el);
      for (const v of [cs.color, cs.backgroundColor, cs.accentColor, cs.borderColor]) {
        const m = v.match(/rgba?\((\d+), (\d+), (\d+)/);
        if (!m) continue;
        const [r, g, b] = [+m[1], +m[2], +m[3]];
        if (Math.max(r, g, b) - Math.min(r, g, b) > 12) out.push(v);
      }
    }
    return out;
  });
  assert(hues.length === 0, `the Uber palette stays achromatic (found ${JSON.stringify(hues.slice(0, 3))})`);

  // narrow viewport
  await page.setViewportSize({ width: 390, height: 780 });
  await settle(() => page.click('#tab-geojson'));
  const ov390 = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(ov390 <= 1, `no horizontal overflow at 390px (got ${ov390}px)`);
  const canv3 = await rect('#map3'), card3 = await rect('#map3-card');
  assert(canv3.w >= 300, `the map still renders wide enough at 390px (${canv3.w})`);
  assert(canv3.x >= card3.x - 1 && canv3.right <= card3.right + 1, 'the narrow canvas stays inside its card');
  const tabsBox = await rect('.tabs'), navBox = await rect('.nav');
  assert(tabsBox.right <= 390 + 1 && navBox.right <= 390 + 1, 'nav and tabs stay within the viewport at 390px');
  assert((await text('#tot-count')) === '3 / 23', 'measurements survive the resize');

  // long mono values must wrap rather than be clipped mid-number on a phone
  await settle(() => page.click('#tab-datum'));
  const ovDatum = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(ovDatum <= 1, `the datum panel has no horizontal overflow at 390px (got ${ovDatum}px)`);
  for (const sel of ['#out-utm', '#out-merc', '#out-qk', '#out-tile']) {
    const clipped = await page.$eval(sel, (el) => el.scrollWidth - el.clientWidth);
    assert(clipped <= 1, `${sel} is fully visible at 390px, not clipped by ${clipped}px`);
  }

  // ── thumbnail: the geodesic map plus the ink result band ───────────
  await page.setViewportSize({ width: 1280, height: 850 });
  await settle(() => page.click('#tab-geodesy'));
  await setPair('1.2838, 103.8607', '39.9086, 116.3974');
  // Park the sticky nav's bottom edge inside the lead→form gap: an opaque nav that
  // lands mid-paragraph leaves a sliver of clipped glyphs and reads as broken.
  await page.evaluate(() => {
    const gapTop = document.querySelector('#panel-geodesy .lead').getBoundingClientRect().bottom + window.scrollY;
    const gapBottom = document.querySelector('#panel-geodesy .card.form').getBoundingClientRect().top + window.scrollY;
    const navH = document.querySelector('.nav').getBoundingClientRect().height;
    window.scrollTo(0, Math.round((gapTop + gapBottom) / 2 - navH));
  });
  const framing = await page.evaluate(() => {
    const navB = document.querySelector('.nav').getBoundingClientRect().bottom;
    const lead = document.querySelector('#panel-geodesy .lead').getBoundingClientRect();
    const form = document.querySelector('#panel-geodesy .card.form').getBoundingClientRect();
    const big = document.getElementById('res-dist').getBoundingClientRect();
    const canv = document.getElementById('map1').getBoundingClientRect();
    return { navB, leadBottom: lead.bottom, formTop: form.top, bigTop: big.top, bigBottom: big.bottom,
             canvTop: canv.top, canvBottom: canv.bottom, vh: window.innerHeight };
  });
  assert(framing.navB >= framing.leadBottom && framing.navB <= framing.formTop,
    `the nav bottom sits in a text gap, not mid-line (nav ${framing.navB}, gap ${framing.leadBottom}–${framing.formTop})`);
  assert(framing.bigBottom < framing.vh && framing.bigTop > framing.navB,
    'the headline distance is fully in frame for the thumbnail');
  assert(framing.canvBottom > framing.navB + 200,
    'a substantial slice of the map is in frame for the thumbnail');
  // let every transition finish so the shot never catches a mid-state
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running'),
    null, { timeout: 4000 });
  await page.waitForFunction(() => document.getElementById('res-dist').textContent.includes('4,462'),
    null, { timeout: 4000 });
  await screenshot('thumb.png');
};
