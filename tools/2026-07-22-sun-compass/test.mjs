// Integration test for 日光罗盘 · Sun Compass (Mistral AI design language).
// Drives the real NOAA solar-position engine through the browser: asserts concrete
// astronomical output (sunrise/sunset/day length vs published tables, equinox azimuths,
// polar day/night, DST offsets, shadow geometry), the [hidden] computed-display guard,
// localStorage round-trip, canvas paint, and layout containment. Captures thumb.png.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#sc-path');
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.getElementById('sc-out').dataset.noon !== undefined);

  const out = () => page.evaluate(() => ({ ...document.getElementById('sc-out').dataset }));
  const num = (v) => Number(v);
  const disp = (sel) => page.evaluate((s) => getComputedStyle(document.querySelector(s)).display, sel);
  const text = async (sel) => (await page.textContent(sel)).trim();
  const hm = (mins) => {
    const r = Math.round(mins), v = ((r % 1440) + 1440) % 1440;
    return String(Math.floor(v / 60)).padStart(2, '0') + ':' + String(v % 60).padStart(2, '0');
  };
  const atNoon = () => page.waitForFunction(() => {
    const o = document.getElementById('sc-out').dataset;
    return o.minute === String(Math.round(Number(o.noon)));
  });

  // Switch location + date, then wait for the engine output to converge on both.
  async function setup(city, date) {
    await page.selectOption('#sc-city', { label: city });
    await page.fill('#sc-date', date);
    await page.waitForFunction((d) => document.getElementById('sc-out').dataset.date === d, date);
    return out();
  }

  // ---------------- 1) Singapore 2026-06-21 vs published sun tables ----------------
  let d = await setup('新加坡', '2026-06-21');
  assert(d.tz === 'Asia/Singapore', `tz applied (got ${d.tz})`);
  assert(d.tzoff === '480', `Singapore is UTC+8 → 480 min (got ${d.tzoff})`);
  const sgRise = num(d.sunrise), sgSet = num(d.sunset), sgNoon = num(d.noon);
  assert(sgRise > 6 * 60 + 50 && sgRise < 7 * 60 + 10, `SG 6/21 sunrise ≈ 07:00 (got ${hm(sgRise)})`);
  assert(sgSet > 19 * 60 && sgSet < 19 * 60 + 20, `SG 6/21 sunset ≈ 19:12 (got ${hm(sgSet)})`);
  assert(sgNoon > 13 * 60 && sgNoon < 13 * 60 + 12, `SG 6/21 solar noon ≈ 13:06 (got ${hm(sgNoon)})`);
  assert(Math.abs((sgRise + sgSet) / 2 - sgNoon) < 1.5, 'sunrise/sunset symmetric about solar noon');
  // rendered strings must match the engine numbers, not merely "be non-empty"
  assert(await text('#sc-t-sunrise') === hm(sgRise), `#sc-t-sunrise renders ${hm(sgRise)}`);
  assert(await text('#sc-t-sunset') === hm(sgSet), `#sc-t-sunset renders ${hm(sgSet)}`);
  assert(await text('#sc-t-noon') === hm(sgNoon), `#sc-t-noon renders ${hm(sgNoon)}`);
  const dayLen = num(d.daylen);
  assert(Math.abs(dayLen - (sgSet - sgRise)) <= 1, `day length = sunset − sunrise (got ${dayLen})`);
  assert(await text('#sc-t-daylen') === `${Math.floor(dayLen / 60)} 小时 ${dayLen % 60} 分`, 'day-length cell matches');
  // twilight chronology: astronomical dawn < civil dawn < sunrise < solar noon
  const order = await page.evaluate(() => ['sc-t-astro-dawn', 'sc-t-civil-dawn', 'sc-t-sunrise', 'sc-t-noon']
    .map((id) => document.getElementById(id).textContent.trim()));
  assert(order[0] < order[1] && order[1] < order[2] && order[2] < order[3],
    `twilight chronology 天文<民用<日出<正午 (got ${order.join(' < ')})`);

  // ---------------- 2) noon: near-overhead sun, shadow = h / tan(alt) ----------------
  await page.click('#sc-jump-noon');
  await atNoon();
  d = await out();
  const noonAlt = num(d.alt);
  // the identity that must hold at solar noon: geometric altitude = 90 − |latitude − declination|
  const wantNoonAlt = 90 - Math.abs(num(d.lat) - num(d.decl));
  assert(Math.abs(num(d.altgeom) - wantNoonAlt) < 0.3,
    `noon altitude = 90 − |φ − δ| (got ${d.altgeom}, want ${wantNoonAlt.toFixed(2)}; φ=${d.lat}, δ=${d.decl})`);
  assert(noonAlt > 67 && noonAlt < 69, `SG on the June solstice tops out at ~67.9°, not overhead (got ${noonAlt.toFixed(1)}°)`);
  assert(Math.abs(num(d.noonalt) - noonAlt) < 0.02, 'live altitude at noon equals the stored noon altitude');
  const expectRatio = 1 / Math.tan(noonAlt * Math.PI / 180);
  assert(Math.abs(num(d.ratio) - expectRatio) < 1e-3, `shadow ratio = 1/tan(alt) (got ${d.ratio}, want ${expectRatio.toFixed(4)})`);
  assert(Math.abs(num(d.shadow) - 1.7 * num(d.ratio)) < 1e-3, 'shadow length = height × ratio');
  const dirDelta = ((num(d.shadowdir) - num(d.az) - 180) % 360 + 360) % 360;
  assert(dirDelta < 0.02 || Math.abs(dirDelta - 360) < 0.02, `shadow points opposite the sun (Δ=${dirDelta.toFixed(3)}°)`);
  // daytime: figures visible, night note hidden — assert COMPUTED display (07-20 lesson)
  assert(await disp('#sc-shadow-figs') !== 'none', 'daytime → shadow figures visible');
  assert(await disp('#sc-night-note') === 'none', 'daytime → night note computed display:none');
  assert(await disp('#sc-polar-note') === 'none', 'non-polar day → polar note computed display:none');

  // height rescales the length but never the ratio
  const ratioBefore = num(d.ratio);
  await page.fill('#sc-height', '10');
  await page.waitForFunction(() => {
    const o = document.getElementById('sc-out').dataset;
    return Math.abs(Number(o.shadow) - 10 * Number(o.ratio)) < 1e-3;
  });
  d = await out();
  assert(Math.abs(num(d.ratio) - ratioBefore) < 1e-9, 'ratio is height-independent');
  assert(Math.abs(num(d.shadow) - 10 * ratioBefore) < 1e-3, `10 m pole shadow = 10 × ratio (got ${d.shadow})`);
  await page.fill('#sc-height', '1.7');
  await page.waitForFunction(() => {
    const o = document.getElementById('sc-out').dataset;
    return o.shadow !== '' && Math.abs(Number(o.shadow) - 1.7 * Number(o.ratio)) < 1e-3;
  });

  // ---------------- 3) midnight → below horizon, no shadow ([hidden] guard) ----------------
  await page.evaluate(() => {
    const r = document.getElementById('sc-time');
    r.value = '0';
    r.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForFunction(() => document.getElementById('sc-out').dataset.minute === '0');
  d = await out();
  assert(num(d.alt) < 0, `midnight sun is below the horizon (got ${d.alt}°)`);
  assert(d.shadow === '', 'no shadow length below the horizon');
  assert(await disp('#sc-shadow-figs') === 'none', 'night → shadow figures computed display:none');
  assert(await disp('#sc-night-note') !== 'none', 'night → note visible');
  assert((await text('#sc-night-note')).includes('没有影子'), 'night note explains why');

  // ---------------- 3b) zenith passage: at 1.35°N the sun is truly overhead on 24 Mar ----------------
  await setup('新加坡', '2026-03-24');
  await page.click('#sc-jump-noon');
  await atNoon();
  d = await out();
  assert(num(d.alt) > 89.5, `SG zenith passage (24 Mar) puts the sun overhead (got ${num(d.alt).toFixed(2)}°)`);
  // δ moves ~0.39°/day, so on the nearest calendar day it lands within a fifth of a degree of φ
  assert(Math.abs(num(d.decl) - num(d.lat)) < 0.2, `overhead ⇔ declination meets the latitude (δ=${d.decl}, φ=${d.lat})`);
  assert(num(d.ratio) < 0.02, `overhead sun ⇒ almost no shadow (ratio ${d.ratio})`);
  assert(num(d.shadow) < 0.04, `1.7 m person casts a <4 cm shadow at zenith passage (got ${d.shadow} m)`);

  // ---------------- 4) equinox geometry: rises due east, sets due west ----------------
  d = await setup('新加坡', '2026-03-20');
  assert(Math.abs(num(d.riseaz) - 90) < 1.6, `equinox sunrise azimuth ≈ 90° due east (got ${d.riseaz})`);
  assert(Math.abs(num(d.setaz) - 270) < 1.6, `equinox sunset azimuth ≈ 270° due west (got ${d.setaz})`);
  assert(Math.abs(num(d.daylen) - 720) < 15, `equinox day length ≈ 12 h (got ${num(d.daylen)} min)`);
  assert((await text('#sc-t-riseaz')).includes('东'), `sunrise-azimuth cell names the compass point (got ${await text('#sc-t-riseaz')})`);

  // ---------------- 5) London: solstice swing + BST daylight-saving offset ----------------
  d = await setup('伦敦', '2026-06-21');
  assert(d.tz === 'Europe/London', `London selected (got ${d.tz})`);
  assert(d.tzoff === '60', `June in London is BST = UTC+1 (got ${d.tzoff})`);
  const junLen = num(d.daylen);
  assert(junLen > 16 * 60, `London midsummer day > 16 h (got ${(junLen / 60).toFixed(2)} h)`);
  assert(num(d.sunrise) > 4 * 60 + 33 && num(d.sunrise) < 4 * 60 + 53, `London midsummer sunrise ≈ 04:43 (got ${hm(num(d.sunrise))})`);
  d = await setup('伦敦', '2026-12-21');
  assert(d.tzoff === '0', `December in London is GMT = UTC+0 (got ${d.tzoff})`);
  const decLen = num(d.daylen);
  assert(decLen < 8 * 60, `London midwinter day < 8 h (got ${(decLen / 60).toFixed(2)} h)`);
  assert(junLen > decLen * 2, 'midsummer more than doubles midwinter daylight');
  assert(num(d.noonalt) < 16, `London midwinter noon sun is low (got ${d.noonalt}°)`);

  // ---------------- 6) polar day / polar night above the Arctic Circle ----------------
  d = await setup('特罗姆瑟(北极圈内)', '2026-06-21');
  assert(d.polar === 'day', `Tromsø midsummer = polar day (got '${d.polar}')`);
  assert(d.daylen === '1440', 'polar day = 1440 min of daylight');
  assert(await disp('#sc-polar-note') !== 'none', 'polar day shows the explanation note');
  assert((await text('#sc-polar-note')).startsWith('极昼'), 'note reads 极昼');
  assert(await text('#sc-t-sunrise') === '极昼', 'sunrise cell reads 极昼');
  d = await setup('特罗姆瑟(北极圈内)', '2026-12-21');
  assert(d.polar === 'night', `Tromsø midwinter = polar night (got '${d.polar}')`);
  assert(d.daylen === '0', 'polar night = 0 min of daylight');
  assert(num(d.noonalt) < 0, `polar-night noon sun stays below the horizon (got ${d.noonalt}°)`);
  assert((await text('#sc-polar-note')).startsWith('极夜'), 'note reads 极夜');

  // ---------------- 7) southern hemisphere flips the seasons ----------------
  const sydJun = await setup('悉尼', '2026-06-21');
  const sydDec = await setup('悉尼', '2026-12-21');
  assert(num(sydDec.daylen) > num(sydJun.daylen),
    `Sydney December day longer than June (${num(sydDec.daylen)} vs ${num(sydJun.daylen)} min)`);
  assert(num(sydDec.daylen) > 14 * 60, `Sydney midsummer > 14 h (got ${(num(sydDec.daylen) / 60).toFixed(2)} h)`);
  await page.click('#sc-jump-noon');
  await atNoon();
  const sydAz = num((await out()).az);
  assert(sydAz < 1 || sydAz > 359, `Sydney noon sun stands due north (got ${sydAz.toFixed(2)}°)`);

  // ---------------- 8) date stepping + custom coordinates + validation ----------------
  await setup('新加坡', '2026-07-22');
  await page.click('#sc-next-day');
  await page.waitForFunction(() => document.getElementById('sc-out').dataset.date === '2026-07-23');
  await page.click('#sc-prev-day');
  await page.click('#sc-prev-day');
  await page.waitForFunction(() => document.getElementById('sc-out').dataset.date === '2026-07-21');
  await page.fill('#sc-date', '2026-12-31');
  await page.waitForFunction(() => document.getElementById('sc-out').dataset.date === '2026-12-31');
  await page.click('#sc-next-day');
  await page.waitForFunction(() => document.getElementById('sc-out').dataset.date === '2027-01-01');

  await setup('新加坡', '2026-07-22');
  await page.fill('#sc-lat', '64.1466');
  await page.fill('#sc-lon', '-21.9426');
  await page.waitForFunction(() => Math.abs(Number(document.getElementById('sc-out').dataset.lat) - 64.1466) < 1e-6 &&
    Math.abs(Number(document.getElementById('sc-out').dataset.lon) + 21.9426) < 1e-6);
  d = await out();
  assert(await page.inputValue('#sc-city') === 'custom', 'manual coordinates switch the city select to 自定义');
  assert(num(d.daylen) > 17 * 60, `Reykjavík in late July still gets >17 h of daylight (got ${(num(d.daylen) / 60).toFixed(2)} h)`);
  assert(await disp('#sc-err') === 'none', 'valid input shows no error');
  // invalid latitude → error surfaces, last good value survives
  const goodLat = d.lat;
  await page.fill('#sc-lat', '999');
  await page.waitForFunction(() => getComputedStyle(document.getElementById('sc-err')).display !== 'none');
  assert((await text('#sc-err')).includes('纬度'), `error names the offending field (got ${await text('#sc-err')})`);
  assert((await out()).lat === goodLat, 'invalid latitude does not corrupt the computed state');
  await page.fill('#sc-lat', '64.1466');
  await page.waitForFunction(() => getComputedStyle(document.getElementById('sc-err')).display === 'none');

  // ---------------- 9) saved locations survive a reload ----------------
  await setup('北京', '2026-07-22');
  assert(await disp('#sc-saved-empty') !== 'none', 'empty-state visible before saving');
  await page.click('#sc-save');
  await page.waitForFunction(() => document.getElementById('sc-out').dataset.saved === '1');
  assert(await disp('#sc-saved-empty') === 'none', 'empty-state computed display:none once a chip exists');
  assert(await page.locator('#sc-saved-list .sc-chip').count() === 1, 'one saved chip');
  assert(await text('#sc-saved-list .sc-chip span') === '北京', 'chip carries the city name');
  await page.click('#sc-save');
  assert(await page.locator('#sc-saved-list .sc-chip').count() === 1, 'saving the same place twice does not duplicate');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.getElementById('sc-out').dataset.saved === '1');
  assert((await out()).tz === 'Asia/Shanghai', 'last location restored from localStorage after reload');
  await setup('开罗', '2026-07-22');
  assert((await out()).tz === 'Africa/Cairo', 'moved to Cairo');
  await page.click('#sc-saved-list .sc-chip span');
  await page.waitForFunction(() => document.getElementById('sc-out').dataset.tz === 'Asia/Shanghai');
  assert(Math.abs(num((await out()).lat) - 39.9042) < 1e-6, 'chip restores the saved latitude');
  await page.click('#sc-saved-list .sc-chip button');
  await page.waitForFunction(() => document.getElementById('sc-out').dataset.saved === '0');
  assert(await disp('#sc-saved-empty') !== 'none', 'empty-state returns after deleting the last chip');

  // ---------------- 10) play / pause the day ----------------
  await setup('新加坡', '2026-07-22');
  await page.click('#sc-jump-rise');
  const startMin = num((await out()).minute);
  await page.click('#sc-play');
  await page.waitForFunction((m0) => document.getElementById('sc-play').dataset.playing === '1' &&
    Number(document.getElementById('sc-out').dataset.minute) !== m0, startMin);
  assert(await text('#sc-play') === '暂停', 'play button flips to 暂停 while running');
  await page.click('#sc-play');
  await page.waitForFunction(() => document.getElementById('sc-play').dataset.playing === '0');
  const stoppedAt = num((await out()).minute);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(r)))));
  assert(num((await out()).minute) === stoppedAt, 'clock stays frozen after pause');
  assert(await text('#sc-play') === '播放一天', 'button label resets after pause');

  // ---------------- 11) canvases really painted ----------------
  await page.click('#sc-jump-noon');
  await atNoon();
  const paint = await page.evaluate(() => {
    const scan = (id, test) => {
      const c = document.getElementById(id);
      const g = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
      let n = 0;
      for (let i = 0; i < g.length; i += 4) if (test(g[i], g[i + 1], g[i + 2], g[i + 3])) n++;
      return n;
    };
    return {
      pathAll: scan('sc-path', (r, g, b, a) => a > 0),
      pathOrange: scan('sc-path', (r, g, b, a) => a > 200 && r > 200 && g < 150 && b < 90),
      yearNight: scan('sc-year', (r, g, b, a) => a > 200 && r < 60 && g < 60 && b < 60),
      yearDay: scan('sc-year', (r, g, b, a) => a > 200 && r > 200 && g > 140 && b < 110),
      shadowInk: scan('sc-shadow', (r, g, b, a) => a > 200 && r < 120 && g < 120 && b < 120)
    };
  });
  assert(paint.pathAll > 20000, `sun-path canvas is painted (${paint.pathAll} px)`);
  assert(paint.pathOrange > 300, `sun-path draws the orange arc + sun (${paint.pathOrange} orange px)`);
  assert(paint.yearNight > 5000, `year chart paints night (${paint.yearNight} px)`);
  assert(paint.yearDay > 5000, `year chart paints the daylight ribbon (${paint.yearDay} px)`);
  assert(paint.shadowInk > 300, `shadow canvas paints the object + cast shadow (${paint.shadowInk} px)`);

  // ---------------- 12) twilight band + cursor track the engine ----------------
  const band = await page.evaluate(() => getComputedStyle(document.getElementById('sc-band')).backgroundImage);
  assert(band.includes('linear-gradient'), 'twilight band renders a gradient');
  assert((band.match(/rgb/g) || []).length >= 8, `band has multiple hard-stop segments (got ${(band.match(/rgb/g) || []).length} colour stops)`);
  const cursor = await page.evaluate(() => {
    const b = document.getElementById('sc-band').getBoundingClientRect();
    const c = document.getElementById('sc-cursor').getBoundingClientRect();
    const o = document.getElementById('sc-out').dataset;
    return {
      frac: (c.left + c.width / 2 - b.left) / b.width,
      want: Number(o.minute) / 1440,
      inside: c.left >= b.left - 2 && c.right <= b.right + 2
    };
  });
  assert(Math.abs(cursor.frac - cursor.want) < 0.01, `band cursor sits at minute/1440 (got ${cursor.frac.toFixed(4)}, want ${cursor.want.toFixed(4)})`);
  assert(cursor.inside, 'band cursor stays inside the band');

  // ---------------- 13) layout containment (07-17 / 07-20 lessons, document coords) ----------------
  const layout = await page.evaluate(() => {
    const abs = (el) => {
      const r = el.getBoundingClientRect();
      return { l: r.left + scrollX, t: r.top + scrollY, r: r.right + scrollX, b: r.bottom + scrollY };
    };
    const box = (sel) => abs(document.querySelector(sel));
    const inCard = (sel) => {
      const el = document.querySelector(sel);
      const i = abs(el), o = abs(el.closest('.sc-card'));
      return i.l >= o.l - 2 && i.r <= o.r + 2 && i.t >= o.t - 2 && i.b <= o.b + 2;
    };
    const nav = box('.sc-nav'), back = box('.sc-back');
    let escaped = 0;
    for (const el of document.querySelectorAll('a,button,input,select,canvas,.sc-card,.sc-chip')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.left + scrollX < -4 || r.top + scrollY < -4) escaped++;
    }
    return {
      backInNav: back.l >= nav.l - 2 && back.r <= nav.r + 2 && back.t >= nav.t - 2 && back.b <= nav.b + 2,
      pathInCard: inCard('#sc-path'),
      shadowInCard: inCard('#sc-shadow'),
      yearInCard: inCard('#sc-year'),
      figsInCard: inCard('#sc-shadow-figs'),
      bandInCard: inCard('#sc-band'),
      escaped,
      noOverflowX: document.documentElement.scrollWidth <= window.innerWidth + 1
    };
  });
  assert(layout.backInNav, 'back link stays inside the nav bar');
  assert(layout.pathInCard, 'sun-path canvas stays inside its card');
  assert(layout.shadowInCard, 'shadow canvas stays inside its card');
  assert(layout.yearInCard, 'year chart stays inside its card');
  assert(layout.figsInCard, 'shadow readouts stay inside their card');
  assert(layout.bandInCard, 'twilight band stays inside its card');
  assert(layout.escaped === 0, `no control escapes above/left of the page (${layout.escaped} escapees)`);
  assert(layout.noOverflowX, 'page does not scroll horizontally');

  // ---------------- 14) responsive: phone viewport keeps everything contained ----------------
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction(() => document.getElementById('sc-path').getBoundingClientRect().width < 380);
  const narrow = await page.evaluate(() => ({
    noOverflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
    canvasFits: document.getElementById('sc-path').getBoundingClientRect().width <= window.innerWidth
  }));
  assert(narrow.noOverflow, 'no horizontal overflow at 390px');
  assert(narrow.canvasFits, 'compass canvas fits a phone viewport');
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.waitForFunction(() => document.getElementById('sc-path').getBoundingClientRect().width > 380);

  // ---------------- thumbnail: Singapore, late-afternoon golden hour ----------------
  await setup('新加坡', '2026-07-22');
  await page.click('#sc-jump-golden');
  await page.waitForFunction(() => {
    const o = document.getElementById('sc-out').dataset;
    return Number(o.alt) > 3 && Number(o.alt) < 9 && Number(o.minute) > Number(o.noon);
  });
  await page.mouse.move(640, 30);                      // park the cursor off every control
  // land the sticky nav on the cream panel's top padding so nothing is sliced mid-line
  await page.evaluate(() => window.scrollTo(0, 405));
  await page.waitForFunction(() => Math.abs(window.scrollY - 405) < 2);
  await screenshot('thumb.png');
}
