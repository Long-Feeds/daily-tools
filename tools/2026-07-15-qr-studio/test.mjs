// Integration test for 二维码工坊 · QR Studio.
// Drives the real UI + white-box-validates the embedded QR engine in-browser:
// asserts concrete encoded outputs (version/mask/size, payload strings, module
// round-trip, RS syndromes) — not mere element presence. Captures thumb.png.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#forms');
  await page.waitForFunction(() => !!window.__qr && !!window.__app);

  // ---------- white-box engine validation (embedded engine === validated engine) ----------
  const eng = await page.evaluate(() => {
    const QR = window.__qr;
    const out = {};
    // mode detection
    out.modeNum = QR.encode('12345', { ec: 'L' }).mode;
    out.modeAlnum = QR.encode('HELLO', { ec: 'L' }).mode;
    out.modeByte = QR.encode('hello', { ec: 'L' }).mode;
    // capacity boundaries (byte mode via lowercase 'a')
    out.v17L = QR.encode('a'.repeat(17), { ec: 'L' }).version;
    out.v18L = QR.encode('a'.repeat(18), { ec: 'L' }).version;
    out.v7H = QR.encode('a'.repeat(7), { ec: 'H' }).version;
    out.v8H = QR.encode('a'.repeat(8), { ec: 'H' }).version;
    // known fixture: HELLO WORLD alphanumeric fits version 1
    const hw = QR.encode('HELLO WORLD', { ec: 'Q' });
    out.hwVersion = hw.version; out.hwSize = hw.size; out.hwMode = hw.mode;
    // deterministic mask
    out.maskA = QR.encode('deterministic', { ec: 'M' }).mask;
    out.maskB = QR.encode('deterministic', { ec: 'M' }).mask;
    // structural: finder pattern corners
    const r = QR.encode('https://example.com', { ec: 'M' });
    out.size = r.size; out.version = r.version;
    out.finderTL = [r.modules[0][0], r.modules[0][6], r.modules[1][1], r.modules[3][3]].join('');
    out.finderTR = r.modules[0][r.size - 1];
    out.finderBL = r.modules[r.size - 1][0];
    // RS syndrome zero for a multi-block config (v5-Q)
    const cap = QR.totalDataCodewords(5, 'Q');
    const dummy = Array.from({ length: cap }, (_, i) => (i * 7 + 3) & 0xff);
    const il = QR.interleave(5, 'Q', dummy);
    let synOk = true;
    for (const bl of il.blocks) { const code = bl.data.concat(bl.ec); for (let i = 0; i < il.ecPerBlock; i++) if (QR.polyEval(code, QR.EXP[i]) !== 0) synOk = false; }
    out.synOk = synOk; out.v5qBlocks = il.blocks.length; out.v5qData = cap;
    // module + mask round-trip: read data modules back, unmask, compare codewords
    function maskCond(m, x, y) { switch (m) { case 0: return (x + y) % 2 === 0; case 1: return y % 2 === 0; case 2: return x % 3 === 0; case 3: return (x + y) % 3 === 0; case 4: return (((y / 2) | 0) + ((x / 3) | 0)) % 2 === 0; case 5: return (x * y) % 2 + (x * y) % 3 === 0; case 6: return ((x * y) % 2 + (x * y) % 3) % 2 === 0; case 7: return ((x + y) % 2 + (x * y) % 3) % 2 === 0; } }
    const txt = 'https://long-feeds.github.io/daily-tools/';
    const rr = QR.encode(txt, { ec: 'M' });
    const seg = QR.encodeData(txt, 'M'); const il2 = QR.interleave(seg.version, 'M', seg.dataCodewords);
    const base = QR.buildMatrix(seg.version, 'M', il2.codewords);
    const size = rr.size; const bits = [];
    for (let right = size - 1; right >= 1; right -= 2) { if (right === 6) right = 5; for (let vert = 0; vert < size; vert++) { for (let j = 0; j < 2; j++) { const x = right - j; const up = ((right + 1) & 2) === 0; const y = up ? size - 1 - vert : vert; if (!base.fn[y][x]) { let b = rr.modules[y][x]; if (maskCond(rr.mask, x, y)) b ^= 1; bits.push(b); } } } }
    const cw = []; for (let i = 0; i + 8 <= il2.codewords.length * 8; i += 8) { let b = 0; for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j]; cw.push(b); }
    let same = cw.length === il2.codewords.length; for (let i = 0; i < il2.codewords.length; i++) if (cw[i] !== il2.codewords[i]) same = false;
    out.roundTrip = same;
    return out;
  });
  assert(eng.modeNum === 'numeric' && eng.modeAlnum === 'alphanumeric' && eng.modeByte === 'byte', `mode detection (${eng.modeNum}/${eng.modeAlnum}/${eng.modeByte})`);
  assert(eng.v17L === 1 && eng.v18L === 2, `byte capacity v1-L boundary 17->1 / 18->2 (got ${eng.v17L}/${eng.v18L})`);
  assert(eng.v7H === 1 && eng.v8H === 2, `byte capacity v1-H boundary 7->1 / 8->2 (got ${eng.v7H}/${eng.v8H})`);
  assert(eng.hwVersion === 1 && eng.hwSize === 21 && eng.hwMode === 'alphanumeric', `HELLO WORLD -> v1/21x21/alnum (got ${eng.hwVersion}/${eng.hwSize}/${eng.hwMode})`);
  assert(eng.maskA === eng.maskB, 'mask selection deterministic');
  assert(eng.finderTL === '1101' && eng.finderTR === 1 && eng.finderBL === 1, `finder patterns in 3 corners (TL=${eng.finderTL})`);
  assert(eng.synOk, 'RS syndromes zero for v5-Q blocks (ECC correct)');
  assert(eng.v5qBlocks === 4 && eng.v5qData === 62, `v5-Q interleave 4 blocks / 62 data (got ${eng.v5qBlocks}/${eng.v5qData})`);
  assert(eng.roundTrip, 'module + mask round-trip reproduces interleaved codewords');

  // ---------- UI: text/URL ----------
  const url = 'https://long-feeds.github.io/daily-tools/';
  await page.fill('#i-text', url);
  await page.waitForFunction(() => document.getElementById('meta-readout').textContent.includes('VERSION'));
  const metaText = await page.locator('#meta-readout').textContent();
  assert(/VERSION\s*3/.test(metaText), `URL meta shows version 3 (got "${metaText.trim()}")`);
  assert(/BYTE/.test(metaText), 'URL uses byte mode');
  const payloadView = await page.locator('#payload-view').textContent();
  assert(payloadView === url, `payload view equals the URL (got "${payloadView}")`);

  // canvas actually rendered dark modules
  const px = await page.evaluate(() => { const c = document.getElementById('qr-canvas'); const ctx = c.getContext('2d'); const d = ctx.getImageData(0, 0, c.width, c.height).data; let dark = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 128 && d[i + 3] > 0) dark++; return { w: c.width, dark }; });
  assert(px.w > 0 && px.dark > 50, `canvas has dark modules (w=${px.w}, dark=${px.dark})`);

  // export payloads available
  const svgOk = await page.evaluate(() => { const s = window.__app.current && window.__app.current.svg; return !!s && s.startsWith('<svg') && s.includes('<path'); });
  assert(svgOk, 'SVG export string is well-formed (<svg ... <path)');
  assert(!(await page.locator('#dl-png').isDisabled()), 'download PNG enabled when content present');

  // ---------- EC level: raising L->H increases version (needs more space) ----------
  await page.click('#ec-seg button[data-ec="L"]');
  await page.waitForFunction(() => document.getElementById('meta-readout').dataset.version && document.getElementById('meta-readout').textContent.includes('ECC L'));
  const verL = Number(await page.evaluate(() => document.getElementById('meta-readout').dataset.version));
  await page.click('#ec-seg button[data-ec="H"]');
  await page.waitForFunction(() => document.getElementById('meta-readout').textContent.includes('ECC H'));
  const verH = Number(await page.evaluate(() => document.getElementById('meta-readout').dataset.version));
  assert(verH > verL, `raising EC L(${verL})->H(${verH}) increases version`);
  await page.click('#ec-seg button[data-ec="M"]');
  await page.waitForFunction(() => document.getElementById('meta-readout').textContent.includes('ECC M'));

  // ---------- Wi-Fi payload (exact string + escaping) ----------
  await page.click('.type-tab[data-type="wifi"]');
  await page.waitForSelector('#i-ssid');
  await page.fill('#i-ssid', 'Cafe;Net');
  await page.fill('#i-pass', 'p@ss,word');
  await page.selectOption('#i-auth', 'WPA');
  await page.check('#i-hidden');
  await page.waitForFunction(() => document.getElementById('payload-view').textContent.startsWith('WIFI:'));
  const wifi = await page.locator('#payload-view').textContent();
  assert(wifi === 'WIFI:T:WPA;S:Cafe\\;Net;P:p@ss\\,word;H:true;;', `wifi payload exact w/ escaping (got "${wifi}")`);

  // nopass omits password field
  await page.selectOption('#i-auth', 'nopass');
  await page.waitForFunction(() => !document.getElementById('payload-view').textContent.includes('P:'));
  const wifiNo = await page.locator('#payload-view').textContent();
  assert(wifiNo === 'WIFI:T:nopass;S:Cafe\\;Net;H:true;;', `nopass wifi omits P (got "${wifiNo}")`);

  // ---------- vCard payload ----------
  await page.click('.type-tab[data-type="vcard"]');
  await page.waitForSelector('#i-first');
  await page.fill('#i-first', 'San');
  await page.fill('#i-last', 'Zhang');
  await page.fill('#i-phone', '+8613800000000');
  await page.fill('#i-email', 'san@example.com');
  await page.waitForFunction(() => document.getElementById('payload-view').textContent.includes('BEGIN:VCARD'));
  const vc = await page.locator('#payload-view').textContent();
  assert(vc.includes('BEGIN:VCARD') && vc.includes('VERSION:3.0') && vc.includes('END:VCARD'), 'vcard has envelope');
  assert(vc.includes('FN:San Zhang') && vc.includes('TEL;TYPE=CELL:+8613800000000') && vc.includes('EMAIL:san@example.com'), `vcard fields present (got "${vc.replace(/\n/g, '|')}")`);

  // ---------- Email ----------
  await page.click('.type-tab[data-type="email"]');
  await page.waitForSelector('#i-addr');
  await page.fill('#i-addr', 'hi@example.com');
  await page.fill('#i-subject', 'Hello there');
  await page.waitForFunction(() => document.getElementById('payload-view').textContent.startsWith('mailto:'));
  const mail = await page.locator('#payload-view').textContent();
  assert(mail === 'mailto:hi@example.com?subject=Hello%20there', `mailto payload (got "${mail}")`);

  // ---------- SMS ----------
  await page.click('.type-tab[data-type="sms"]');
  await page.waitForSelector('#i-number');
  await page.fill('#i-number', '+6591234567');
  await page.fill('#i-message', 'ping');
  await page.waitForFunction(() => document.getElementById('payload-view').textContent.startsWith('SMSTO:'));
  const sms = await page.locator('#payload-view').textContent();
  assert(sms === 'SMSTO:+6591234567:ping', `sms payload (got "${sms}")`);

  // ---------- Geo ----------
  await page.click('.type-tab[data-type="geo"]');
  await page.waitForSelector('#i-lat');
  await page.fill('#i-lat', '1.3521');
  await page.fill('#i-lng', '103.8198');
  await page.waitForFunction(() => document.getElementById('payload-view').textContent.startsWith('geo:'));
  const geo = await page.locator('#payload-view').textContent();
  assert(geo === 'geo:1.3521,103.8198', `geo payload (got "${geo}")`);

  // ---------- empty content clears output, no error ----------
  await page.click('.type-tab[data-type="text"]');
  await page.waitForSelector('#i-text');
  await page.fill('#i-text', '');
  await page.waitForFunction(() => document.getElementById('meta-readout').textContent.trim() === '');
  assert(await page.locator('#dl-png').isDisabled(), 'PNG disabled when content empty');
  assert(!(await page.locator('#err').evaluate((e) => e.classList.contains('show'))), 'no error surfaced on empty content');

  // ---------- contrast guard ----------
  await page.fill('#i-text', 'contrast check');
  await page.waitForFunction(() => document.getElementById('meta-readout').textContent.includes('VERSION'));
  await page.evaluate(() => { const fg = document.getElementById('fg'); fg.value = '#eeeeee'; fg.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForFunction(() => document.getElementById('contrast-warn').classList.contains('show'));
  assert(await page.locator('#contrast-warn').evaluate((e) => e.classList.contains('show')), 'low-contrast fg triggers scannability warning');
  await page.evaluate(() => { const fg = document.getElementById('fg'); fg.value = '#171717'; fg.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForFunction(() => !document.getElementById('contrast-warn').classList.contains('show'));

  // ---------- save + persistence round-trip ----------
  await page.fill('#i-text', 'https://claude.com');
  await page.waitForFunction(() => document.getElementById('meta-readout').textContent.includes('VERSION'));
  await page.click('#save-btn');
  await page.waitForFunction(() => document.querySelectorAll('#saved-list .saved-item').length >= 1);
  const savedCount = await page.locator('#saved-list .saved-item').count();
  assert(savedCount >= 1, 'saved item appears in gallery');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelectorAll('#saved-list .saved-item').length >= 1);
  const afterReload = await page.locator('#saved-list .saved-item').count();
  assert(afterReload >= 1, 'saved gallery persists across reload (localStorage)');
  // restore from saved
  await page.click('#saved-list .saved-item');
  await page.waitForFunction(() => document.getElementById('meta-readout').textContent.includes('VERSION'));
  const restored = await page.locator('#payload-view').textContent();
  assert(restored === 'https://claude.com', `restoring saved item repopulates payload (got "${restored}")`);

  // ---------- settle on a nice state for the thumbnail ----------
  await page.evaluate(() => {
    const s = window.__app.state; s.type = 'text'; s.ec = 'M'; s.scale = 8; s.fields.text = { text: 'https://long-feeds.github.io/daily-tools/' };
    document.querySelector('.type-tab[data-type="text"]').click();
  });
  await page.fill('#i-text', 'https://long-feeds.github.io/daily-tools/');
  await page.click('#ec-seg button[data-ec="M"]');
  await page.waitForFunction(() => document.getElementById('meta-readout').textContent.includes('VERSION'));
  await page.evaluate(() => { window.scrollTo(0, 0); const t = document.getElementById('toast'); if (t) t.classList.remove('show'); });
  await page.waitForFunction(() => !document.getElementById('toast').classList.contains('show'));
  await screenshot('thumb.png');
}
