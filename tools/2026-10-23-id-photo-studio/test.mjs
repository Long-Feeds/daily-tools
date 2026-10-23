// 证件照工坊 · ID Photo Studio 集成测试
// 真值全部由 run 目录 uitruth/make_truth.py 生成并机械注入（tools/inject-oracle.mjs），本文件不手打期望数字：
//   · demo：示例照片上人工放大量取的头顶 / 下巴 / 中线；
//   · doc：规格原文数值（美国签证 travel.state.gov 归档页、身份证 GA 461 转载）；
//   · layout：Python 穷举一刀切（不限切口位置）得到的最多张数；png_ppm_300 = round(300/0.0254)。
// 合成人像的真值（剪影、头顶、下巴、中线）由下面的生成器在测试里现算。
import { renderGuards } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs';
import fs from 'node:fs';

const ORACLE = {
 "meta": {
  "tabs": [
   "make",
   "print",
   "specs",
   "help"
  ]
 },
 "demo": {
  "crown": 119,
  "chin": 464,
  "cx": 370,
  "w": 736,
  "h": 799,
  "tol": {
   "crown": 6,
   "chin": 12,
   "cx": 15
  }
 },
 "doc": {
  "us": {
   "px": 600,
   "maxKB": 240,
   "head": [
    0.5,
    0.69
   ],
   "eye": [
    0.56,
    0.69
   ],
   "dpi": 300
  },
  "cnid": {
   "px": [
    358,
    441
   ],
   "dpi": 350
  }
 },
 "layout": {
  "6/one-inch/2/3": 13,
  "5/one-inch/2/3": 9,
  "6/two-inch/2/3": 6,
  "6/us-visa/2/3": 2,
  "7/cn-passport/2/3": 10,
  "6/one-inch/0/0": 16
 },
 "png_ppm_300": 11811,
 "synth": {
  "seed": 4242,
  "W": 360,
  "H": 470,
  "variant": 1
 }
};

// ---- 合成人像生成器（与 run 目录 oracle/synth.mjs 同一份）----
function synthPortrait(seed, W, H, variant) {
  let a = seed >>> 0;
  const rnd = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const v = variant == null ? Math.floor(rnd() * 4) : variant;
  const cx = W * (0.46 + rnd() * 0.08);
  const headRx = W * (0.15 + rnd() * 0.03), faceRy = headRx * (1.28 + rnd() * 0.1);
  const faceCy = H * (0.36 + rnd() * 0.06);
  const hairUp = headRx * (0.18 + rnd() * 0.12);
  const crown = faceCy - faceRy - hairUp, chin = faceCy + faceRy;
  const neckW = headRx * 0.62, neckBottom = chin + headRx * 0.55;
  const shW = W * (0.36 + rnd() * 0.06), shTop = neckBottom - headRx * 0.15;
  const skin = [200 + rnd() * 30, 150 + rnd() * 30, 120 + rnd() * 25];
  const hair = [25 + rnd() * 40, 18 + rnd() * 25, 12 + rnd() * 20];
  const cloth = [[30, 40, 70], [60, 60, 65], [235, 235, 240], [90, 30, 35]][Math.floor(rnd() * 4)];
  const bgA = [[180, 185, 190], [90, 140, 200], [220, 210, 190], [120, 160, 120]][v];
  const bgB = [[140, 150, 160], [40, 80, 150], [180, 150, 120], [200, 200, 160]][v];
  const rgb = new Uint8Array(3 * W * H), mask = new Uint8Array(W * H);
  const blobs = Array.from({ length: 6 }, () => [rnd() * W, rnd() * H, 20 + rnd() * 60, (rnd() - 0.5) * 60]);
  const inEll = (x, y, ex, ey, rx, ry) => ((x - ex) / rx) ** 2 + ((y - ey) / ry) ** 2 <= 1;
  function shade(x, y) {
    const inFace = inEll(x, y, cx, faceCy, headRx, faceRy);
    const inHair = inEll(x, y, cx, faceCy - faceRy * 0.25, headRx * 1.12, faceRy * 0.78 + hairUp) && y < faceCy - faceRy * 0.15;
    const inNeck = Math.abs(x - cx) <= neckW && y >= faceCy && y <= neckBottom + 4;
    const sy = y - shTop;
    const inBody = sy >= 0 && Math.abs(x - cx) <= neckW + sy * 2.2 && Math.abs(x - cx) <= shW;
    if (inHair && !(inFace && y > faceCy - faceRy * 0.55)) return [hair[0] + (rnd() - 0.5) * 18, hair[1] + (rnd() - 0.5) * 14, hair[2] + (rnd() - 0.5) * 10, 1];
    if (inFace) {
      const ey = faceCy - faceRy * 0.18, ex = headRx * 0.42;
      if (inEll(x, y, cx - ex, ey, headRx * 0.14, headRx * 0.07) || inEll(x, y, cx + ex, ey, headRx * 0.14, headRx * 0.07)) return [40, 30, 30, 1];
      if (inEll(x, y, cx, faceCy + faceRy * 0.5, headRx * 0.3, headRx * 0.06)) return [170, 70, 70, 1];
      const lit = 1 - 0.18 * Math.max(0, (y - faceCy) / faceRy);
      return [skin[0] * lit, skin[1] * lit, skin[2] * lit, 1];
    }
    if (inBody) return [cloth[0] + (rnd() - 0.5) * 10, cloth[1] + (rnd() - 0.5) * 10, cloth[2] + (rnd() - 0.5) * 10, 1];
    if (inNeck) { const s = y < chin + headRx * 0.25 ? 0.62 : 0.8; return [skin[0] * s, skin[1] * s, skin[2] * s, 1]; }
    const t = y / H;
    let r = bgA[0] * (1 - t) + bgB[0] * t, g = bgA[1] * (1 - t) + bgB[1] * t, b = bgA[2] * (1 - t) + bgB[2] * t;
    for (const [bx, by, br, bd] of blobs) { const d2 = ((x - bx) ** 2 + (y - by) ** 2) / (br * br); if (d2 < 1) { r += bd * (1 - d2); g += bd * (1 - d2) * 0.8; b += bd * (1 - d2) * 0.6; } }
    if (v === 3 && Math.floor(x / 14) % 2 === 0) { r -= 25; g -= 20; b -= 20; }
    return [r + (rnd() - 0.5) * 12, g + (rnd() - 0.5) * 12, b + (rnd() - 0.5) * 12, 0];
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let r = 0, g = 0, b = 0, f = 0;
    for (let sy = 0; sy < 2; sy++) for (let sx = 0; sx < 2; sx++) { const s = shade(x + 0.25 + 0.5 * sx, y + 0.25 + 0.5 * sy); r += s[0]; g += s[1]; b += s[2]; f += s[3]; }
    const i = y * W + x;
    rgb[3 * i] = Math.max(0, Math.min(255, Math.round(r / 4))); rgb[3 * i + 1] = Math.max(0, Math.min(255, Math.round(g / 4))); rgb[3 * i + 2] = Math.max(0, Math.min(255, Math.round(b / 4)));
    mask[i] = f >= 2 ? 1 : 0;
  }
  return { rgb, mask, W, H, crown, chin, cx, headRx, hair };
}

// ---- 与引擎无关的字节解析（导出文件的独立校验）----
function jpegHeader(u8) {
  if (u8[0] !== 0xFF || u8[1] !== 0xD8) return null;
  const out = { units: null, xd: null, yd: null, w: 0, h: 0 };
  let p = 2;
  while (p + 4 <= u8.length) {
    const mk = u8[p + 1], len = (u8[p + 2] << 8) | u8[p + 3];
    if (mk === 0xDA) break;
    if (mk === 0xE0 && String.fromCharCode(u8[p + 4], u8[p + 5], u8[p + 6], u8[p + 7]) === 'JFIF') { out.units = u8[p + 11]; out.xd = (u8[p + 12] << 8) | u8[p + 13]; out.yd = (u8[p + 14] << 8) | u8[p + 15]; }
    if (mk === 0xC0 || mk === 0xC1 || mk === 0xC2) { out.h = (u8[p + 5] << 8) | u8[p + 6]; out.w = (u8[p + 7] << 8) | u8[p + 8]; }
    p += 2 + len;
  }
  return out;
}
function pngHeader(u8) {
  const out = { w: 0, h: 0, ppm: null, unit: null };
  let p = 8;
  while (p < u8.length) {
    const len = ((u8[p] << 24) | (u8[p + 1] << 16) | (u8[p + 2] << 8) | u8[p + 3]) >>> 0, type = String.fromCharCode(u8[p + 4], u8[p + 5], u8[p + 6], u8[p + 7]);
    if (type === 'IHDR') { out.w = ((u8[p + 8] << 24) | (u8[p + 9] << 16) | (u8[p + 10] << 8) | u8[p + 11]) >>> 0; out.h = ((u8[p + 12] << 24) | (u8[p + 13] << 16) | (u8[p + 14] << 8) | u8[p + 15]) >>> 0; }
    if (type === 'pHYs') { out.ppm = ((u8[p + 8] << 24) | (u8[p + 9] << 16) | (u8[p + 10] << 8) | u8[p + 11]) >>> 0; out.unit = u8[p + 16]; }
    if (type === 'IEND') break;
    p += 12 + len;
  }
  return out;
}

export default async ({ page, toolURL, screenshot, assert }) => {
  const T = ORACLE;
  await page.goto(toolURL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const waitReady = (rev) => page.waitForFunction((r) => {
    const a = document.getElementById('ip-app');
    return a.dataset.state === 'ready' && +(a.dataset.segRev || 0) >= r;
  }, rev, { timeout: 60000 });
  const waitOut = () => page.waitForFunction(() => window.__idp && document.getElementById('ip-out').dataset.key === window.__idp.stateKey()
    && document.getElementById('ip-src').dataset.key === window.__idp.stateKey(), null, { timeout: 20000 });
  const segRev = () => page.$eval('#ip-app', (a) => +(a.dataset.segRev || 0));
  const onTab = async (t) => { await page.click('#tab-' + t); await page.waitForFunction((k) => !document.getElementById('pane-' + k).hidden, t); };
  const setRange = (sel, v) => page.$eval(sel, (e, val) => { e.value = String(val); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  const download = async (sel) => {
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click(sel)]);
    return { name: dl.suggestedFilename(), bytes: new Uint8Array(fs.readFileSync(await dl.path())) };
  };
  const outInfo = () => page.evaluate(() => {
    const c = document.getElementById('ip-out'), x = c.getContext('2d'), d = x.getImageData(0, 0, c.width, c.height).data;
    const px = (X, Y) => { const i = 4 * (Y * c.width + X); return [d[i], d[i + 1], d[i + 2]]; };
    const pl = window.__idp.S.plan;
    return { w: c.width, h: c.height, tl: px(0, 0), tr: px(c.width - 1, 0), bl: px(0, c.height - 1), mid: px(c.width >> 1, c.height >> 1),
      crownOut: pl.crownOut, chinOut: pl.chinOut, headMm: pl.headMm, topMm: pl.topMm, spec: pl.spec.id };
  });
  // 成品上「头发最高处」：中线附近的列里，从上往下第一行与底色相差明显的像素
  const hairTop = () => page.evaluate(() => {
    const c = document.getElementById('ip-out'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    const bg = [d[0], d[1], d[2]], x0 = Math.round(c.width * 0.35), x1 = Math.round(c.width * 0.65);
    for (let y = 0; y < c.height; y++) {
      let n = 0;
      for (let x = x0; x < x1; x++) { const i = 4 * (y * c.width + x); if (Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]) > 90) n++; }
      if (n >= 3) return y;
    }
    return -1;
  });

  // ---- 1. 空状态 ----
  assert(await page.$eval('#ip-app', (e) => e.dataset.state) === 'empty', '初始应为 empty');
  assert(await page.$eval('#ip-export', (e) => e.disabled), '没有照片时导出按钮应禁用');
  assert(await page.$eval('#ip-empty', (e) => getComputedStyle(e).display !== 'none'), '空状态提示应可见');

  // ---- 2. 示例照片：抠图 + 头部估计 ----
  await page.click('#ip-demo');
  await waitReady(1);
  await waitOut();
  assert(await page.$eval('#ip-empty', (e) => getComputedStyle(e).display === 'none'), '载入后空状态提示应隐藏（计算样式）');
  const demo = await page.evaluate(() => {
    const S = window.__idp.S, g = window.__idp.guidesSrc(), W = S.work;
    let fg = 0; for (let i = 0; i < S.fg.length; i++) fg += S.fg[i];
    // 脸中心一圈应全是前景；四个角应是背景
    const cxW = Math.round(S.head.cx), cyW = Math.round((S.head.crown + S.head.chin) / 2);
    let face = 0, faceN = 0;
    for (let y = cyW - 15; y <= cyW + 15; y++) for (let x = cxW - 15; x <= cxW + 15; x++) { faceN++; face += S.fg[y * W.w + x]; }
    const corners = [0, W.w - 1, (W.h - 1) * W.w, (W.h - 1) * W.w + W.w - 1].map((i) => S.fg[i]);
    return { g, src: [S.src.w, S.src.h], frac: fg / S.fg.length, face: face / faceN, cornersTop: corners.slice(0, 2), status: document.getElementById('ip-status').textContent };
  });
  assert(demo.src[0] === T.demo.w && demo.src[1] === T.demo.h, `示例原图尺寸 ${demo.src}`);
  assert(Math.abs(demo.g.crown - T.demo.crown) <= T.demo.tol.crown, `示例头顶 ${demo.g.crown.toFixed(1)} vs 人工量取 ${T.demo.crown}`);
  assert(Math.abs(demo.g.chin - T.demo.chin) <= T.demo.tol.chin, `示例下巴 ${demo.g.chin.toFixed(1)} vs 人工量取 ${T.demo.chin}`);
  assert(Math.abs(demo.g.cx - T.demo.cx) <= T.demo.tol.cx, `示例中线 ${demo.g.cx.toFixed(1)} vs 人工量取 ${T.demo.cx}`);
  assert(demo.face === 1, `脸中心应全是前景，实得 ${demo.face}`);
  assert(demo.cornersTop.every((v) => v === 0), '左上 / 右上角应是背景');
  assert(demo.frac > 0.25 && demo.frac < 0.75, `前景占比 ${demo.frac}`);
  assert(/抠图完成/.test(demo.status), '状态栏应报抠图完成');
  // 默认规格一寸：295×413，白底；构图合格
  let o = await outInfo();
  assert(o.w === 295 && o.h === 413 && o.spec === 'one-inch', `默认成品 ${o.w}×${o.h} ${o.spec}`);
  assert(o.tl.join() === '255,255,255', `白底角落像素 ${o.tl}`);
  assert(await page.$eval('#ip-verdict', (e) => e.dataset.bad) === '0', '示例一寸不应有不合规项');
  const ed = await page.evaluate(() => ({ drawn: window.__idp.ED.placer.drawn.slice(), dropped: window.__idp.ED.placer.dropped }));
  assert(ed.dropped === 0 && ed.drawn.length === 3, `原图标签应画出 3 个且不丢：${ed.drawn.join('|')} 丢 ${ed.dropped}`);
  // 成品上的头发最高处应落在规划的头顶行上（渲染几何回代）
  let ht = await hairTop();
  assert(Math.abs(ht - o.crownOut) <= 3, `一寸成品头顶 ${ht} vs 规划 ${o.crownOut.toFixed(1)}`);

  // ---- 3. 美国签证：600×600、白底 / 蓝底、合规 ----
  await page.selectOption('#ip-spec', 'us-visa');
  await waitOut();
  o = await outInfo();
  assert(o.w === T.doc.us.px && o.h === T.doc.us.px, `美签成品 ${o.w}×${o.h}`);
  assert(o.headMm / 51 >= T.doc.us.head[0] && o.headMm / 51 <= T.doc.us.head[1], `美签头高占比 ${(o.headMm / 51).toFixed(3)}`);
  ht = await hairTop();
  assert(Math.abs(ht - o.crownOut) <= 3, `美签成品头顶 ${ht} vs 规划 ${o.crownOut.toFixed(1)}`);
  // 面部水平居中：头顶与下巴正中那一行，非底色像素的左右端点的中点应落在成品正中（±3%）
  const midX = await page.evaluate(() => {
    const c = document.getElementById('ip-out'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data, pl = window.__idp.S.plan;
    const y = Math.round((pl.crownOut + pl.chinOut) / 2), bg = [d[0], d[1], d[2]];
    let l = -1, r = -1;
    for (let x = 0; x < c.width; x++) { const i = 4 * (y * c.width + x); if (Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]) > 90) { if (l < 0) l = x; r = x; } }
    return { mid: (l + r) / 2, w: c.width };
  });
  assert(Math.abs(midX.mid - midX.w / 2) <= 0.03 * midX.w, `面部中点 ${midX.mid} vs 成品中线 ${midX.w / 2}`);
  const eyeLi = await page.$eval('#ip-checks li[data-key="eye"]', (e) => e.dataset.state);
  assert(eyeLi === 'ok', `眼线估计应合格，实得 ${eyeLi}`);
  await page.click('#ip-bg-blue');
  await waitOut();
  o = await outInfo();
  assert(o.tl.join() === '67,142,219' && o.tr.join() === '67,142,219', `蓝底角落像素 ${o.tl} / ${o.tr}`);
  assert(await page.$eval('#ip-checks li[data-key="bg"]', (e) => e.dataset.state) === 'bad', '美签用蓝底应判不合规');
  assert(await page.$eval('#ip-verdict', (e) => +e.dataset.bad) >= 1, '总评应显示不合规');
  await page.click('#ip-bg-white');
  await waitOut();
  assert(await page.$eval('#ip-checks li[data-key="bg"]', (e) => e.dataset.state) === 'ok', '换回白底应合格');

  // ---- 4. 导出：JPEG 尺寸 / dpi / 文件上限；PNG 的 pHYs ----
  let f = await download('#ip-export');
  let jh = jpegHeader(f.bytes);
  assert(/\.jpg$/.test(f.name), `文件名 ${f.name}`);
  assert(jh && jh.w === 600 && jh.h === 600, `JPEG 尺寸 ${jh && jh.w}×${jh && jh.h}`);
  assert(jh.units === 1 && jh.xd === T.doc.us.dpi && jh.yd === T.doc.us.dpi, `JPEG 密度 ${jh.units}/${jh.xd}/${jh.yd}`);
  assert(f.bytes.length <= T.doc.us.maxKB * 1024, `美签 JPEG ${f.bytes.length} 字节（上限 ${T.doc.us.maxKB} KB）`);
  await page.waitForFunction(() => document.querySelector('#ip-checks li[data-key="file"]'));
  assert(await page.$eval('#ip-checks li[data-key="file"]', (e) => e.dataset.state) === 'ok', '文件大小项应合格');
  await page.fill('#ip-maxkb', '25');
  f = await download('#ip-export');
  assert(f.bytes.length <= 25 * 1024, `上限 25 KB，实得 ${(f.bytes.length / 1024).toFixed(1)} KB`);
  assert(f.bytes.length > 8 * 1024, `25 KB 上限下应取尽量高的质量，实得 ${(f.bytes.length / 1024).toFixed(1)} KB`);
  assert(await page.$eval('#ip-exp-kb', (e) => /上限 25 KB/.test(e.textContent)), '导出信息应写明上限');
  await page.fill('#ip-maxkb', '');
  await page.selectOption('#ip-fmt', 'png');
  f = await download('#ip-export');
  const ph = pngHeader(f.bytes);
  assert(/\.png$/.test(f.name) && ph.w === 600 && ph.h === 600, `PNG ${f.name} ${ph.w}×${ph.h}`);
  assert(ph.unit === 1 && ph.ppm === T.png_ppm_300, `PNG pHYs ${ph.ppm}/${ph.unit}`);
  await page.selectOption('#ip-fmt', 'jpeg');
  // 身份证：358×441 @350 dpi
  await page.selectOption('#ip-spec', 'cn-id');
  await waitOut();
  o = await outInfo();
  assert(o.w === T.doc.cnid.px[0] && o.h === T.doc.cnid.px[1], `身份证成品 ${o.w}×${o.h}`);
  f = await download('#ip-export');
  jh = jpegHeader(f.bytes);
  assert(jh.w === 358 && jh.h === 441 && jh.xd === T.doc.cnid.dpi, `身份证 JPEG ${jh.w}×${jh.h} @${jh.xd}`);

  // ---- 5. 参考线：鼠标拖动 / 键盘 / 重新估计；头部大小微调 ----
  const g0 = await page.evaluate(() => ({ h: { ...window.__idp.S.head }, scale: window.__idp.ED.scale, ky: window.__idp.S.work.ky }));
  // 先把下巴线滚到视口中部：鼠标只能落在视口里
  await page.evaluate((y) => { const r = document.getElementById('ip-src').getBoundingClientRect(); window.scrollTo(0, window.scrollY + r.top + y - 420); }, (g0.h.chin / g0.ky) * g0.scale);
  const box = await page.locator('#ip-src').boundingBox();
  const chinY = box.y + (g0.h.chin / g0.ky) * g0.scale;
  await page.mouse.move(box.x + box.width * 0.3, chinY);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.3, chinY + 12, { steps: 3 });
  await page.mouse.move(box.x + box.width * 0.3, chinY + 25, { steps: 3 });
  await page.mouse.up();
  await waitOut();
  const g1 = await page.evaluate(() => ({ ...window.__idp.S.head }));
  const expect = g0.h.chin + 25 / g0.scale * g0.ky;
  assert(Math.abs(g1.chin - expect) < 1.5, `拖动下巴线：${g1.chin.toFixed(2)} vs 期望 ${expect.toFixed(2)}`);
  assert(Math.abs(g1.crown - g0.h.crown) < 1e-9, '拖下巴线不应动头顶线');
  await page.focus('#ip-g-crown');
  for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowUp');
  await waitOut();
  const g2 = await page.evaluate(() => ({ ...window.__idp.S.head }));
  assert(Math.abs(g2.crown - (g0.h.crown + 2)) < 1e-9, `键盘 ↑×4 应把头顶下移 2 个工作像素：${g0.h.crown} → ${g2.crown}`);
  await page.click('#ip-auto');
  await waitOut();
  const g3 = await page.evaluate(() => ({ ...window.__idp.S.head, auto: window.__idp.S.auto }));
  assert(g3.crown === g3.auto.crown && g3.chin === g3.auto.chin, '「重新估计头部」应恢复自动值');
  await page.selectOption('#ip-spec', 'us-visa');
  await waitOut();
  // 滑块范围是规格区间外扩 4 mm（美签 25.5–35.2 → 21.5–39.2），拖到 38 mm（74.5%）应判不合规
  await setRange('#ip-t-head', 38);
  await waitOut();
  o = await outInfo();
  assert(Math.abs(o.headMm - 38) < 1e-9, `头部大小滑块 → ${o.headMm}`);
  assert(await page.$eval('#ip-checks li[data-key="head"]', (e) => e.dataset.state) === 'bad', '美签头高 38 mm（74.5%）应判不合规');
  await page.selectOption('#ip-spec', 'one-inch');
  await waitOut();

  // ---- 6. 合成人像：剪影 IoU 与头部估计误差（真值来自生成器）----
  const P = synthPortrait(T.synth.seed, T.synth.W, T.synth.H, T.synth.variant);
  const pngB64 = await page.evaluate(({ w, h, rgb }) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d'), im = x.createImageData(w, h), bin = atob(rgb);
    for (let i = 0; i < w * h; i++) { im.data[4 * i] = bin.charCodeAt(3 * i); im.data[4 * i + 1] = bin.charCodeAt(3 * i + 1); im.data[4 * i + 2] = bin.charCodeAt(3 * i + 2); im.data[4 * i + 3] = 255; }
    x.putImageData(im, 0, 0);
    return c.toDataURL('image/png').split(',')[1];
  }, { w: P.W, h: P.H, rgb: Buffer.from(P.rgb).toString('base64') });
  let rev = await segRev();
  await page.setInputFiles('#ip-file', { name: 'synth.png', mimeType: 'image/png', buffer: Buffer.from(pngB64, 'base64') });
  await waitReady(rev + 1);
  await waitOut();
  const syn = await page.evaluate(() => { const S = window.__idp.S; return { fg: Array.from(S.fg), w: S.work.w, h: S.work.h, g: window.__idp.guidesSrc() }; });
  assert(syn.w === P.W && syn.h === P.H, `合成图不应缩小：${syn.w}×${syn.h}`);
  let inter = 0, uni = 0;
  for (let i = 0; i < P.mask.length; i++) { if (syn.fg[i] && P.mask[i]) inter++; if (syn.fg[i] || P.mask[i]) uni++; }
  const iou = inter / uni, headH = P.chin - P.crown;
  assert(iou >= 0.97, `合成人像剪影 IoU ${iou.toFixed(4)}`);
  assert(Math.abs(syn.g.crown - P.crown) / headH < 0.03, `合成头顶误差 ${((syn.g.crown - P.crown) / headH * 100).toFixed(1)}%`);
  assert(Math.abs(syn.g.chin - P.chin) / headH < 0.06, `合成下巴误差 ${((syn.g.chin - P.chin) / headH * 100).toFixed(1)}%`);
  assert(Math.abs(syn.g.cx - P.cx) / headH < 0.05, `合成中线误差 ${((syn.g.cx - P.cx) / headH * 100).toFixed(1)}%`);

  // 换底不渗旧色：合成图的旧背景是蓝色，换成红底后，头发边缘（0.15 < α < 0.85）反推出的前景色 F = out/α
  // 的蓝色分量应接近头发本色（生成器给出），而不是被旧背景染蓝（关掉前景估计时实测 ≈123）
  await page.click('#ip-bg-red');
  await waitOut();
  const halo = await page.evaluate(() => {
    const S = window.__idp.S, c = document.getElementById('ip-out'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data, A = S.lastAlpha, pl = S.plan;
    const y0 = Math.max(0, Math.floor(pl.crownOut - 4)), y1 = Math.round(pl.crownOut + 0.2 * (pl.chinOut - pl.crownOut));
    let n = 0, sb = 0;
    for (let y = y0; y <= y1; y++) for (let x = 0; x < c.width; x++) { const i = y * c.width + x, a = A[i]; if (a > 0.15 && a < 0.85) { n++; sb += d[4 * i + 2] / a; } }
    return { n, FB: sb / n };
  });
  assert(halo.n >= 100, `头发边缘半透明像素 ${halo.n}`);
  assert(halo.FB < P.hair[2] + 30, `头发边缘蓝色分量 ${halo.FB.toFixed(1)}，头发本色 B=${P.hair[2].toFixed(1)}：旧背景渗进来了`);
  await page.click('#ip-bg-white');
  await waitOut();

  // ---- 7. 画笔：在脸上涂一笔「去除」→ 那一圈变背景；撤销 → 恢复 ----
  await page.click('#ip-mode-bg');
  const sc = await page.evaluate(() => window.__idp.ED.scale);
  await page.evaluate((y) => { const r = document.getElementById('ip-src').getBoundingClientRect(); window.scrollTo(0, window.scrollY + r.top + y - 420); }, ((P.crown + P.chin) / 2) * sc);
  const bx = await page.locator('#ip-src').boundingBox();
  const fy = bx.y + ((P.crown + P.chin) / 2) * sc, fx = bx.x + P.cx * sc;
  rev = await segRev();
  await page.mouse.move(fx - 14, fy); await page.mouse.down();
  await page.mouse.move(fx, fy, { steps: 4 }); await page.mouse.move(fx + 14, fy, { steps: 4 });
  await page.mouse.up();
  await waitReady(rev + 1);
  const painted = (cxp, cyp) => page.evaluate(({ x, y }) => { const S = window.__idp.S; let n = 0, f = 0; for (let yy = y - 2; yy <= y + 2; yy++) for (let xx = x - 6; xx <= x + 6; xx++) { n++; f += S.fg[yy * S.work.w + xx]; } return f / n; }, { x: Math.round(cxp), y: Math.round(cyp) });
  let fr = await painted(P.cx, (P.crown + P.chin) / 2);
  assert(fr === 0, `涂过「去除」的地方应全是背景，实得前景 ${fr}`);
  assert(await page.$eval('#ip-undo', (e) => !e.disabled), '有笔画时撤销应可用');
  rev = await segRev();
  await page.click('#ip-undo');
  await waitReady(rev + 1);
  fr = await painted(P.cx, (P.crown + P.chin) / 2);
  assert(fr === 1, `撤销后脸中心应恢复为前景，实得 ${fr}`);
  await page.click('#ip-mode-guide');

  // ---- 8. 冲印排版（张数真值 = Python 穷举一刀切）----
  await onTab('print');
  await page.waitForFunction(() => document.getElementById('ip-sheet-count'));
  const sheetTotal = () => page.$eval('#ip-sheet-count', (e) => +e.dataset.total);
  assert(await sheetTotal() === T.layout['6/one-inch/2/3'], `6 寸排一寸：${await sheetTotal()} vs 穷举 ${T.layout['6/one-inch/2/3']}`);
  await page.selectOption('#ip-paper', '5');
  assert(await sheetTotal() === T.layout['5/one-inch/2/3'], `5 寸排一寸：${await sheetTotal()}`);
  await page.selectOption('#ip-paper', '6');
  await page.fill('#ip-gap', '0'); await page.dispatchEvent('#ip-gap', 'change');
  await page.fill('#ip-margin', '0'); await page.dispatchEvent('#ip-margin', 'change');
  assert(await sheetTotal() === T.layout['6/one-inch/0/0'], `6 寸零间距零边距：${await sheetTotal()}`);
  await page.fill('#ip-gap', '2'); await page.dispatchEvent('#ip-gap', 'change');
  await page.fill('#ip-margin', '3'); await page.dispatchEvent('#ip-margin', 'change');
  await page.selectOption('#ip-pa', 'two-inch');
  assert(await sheetTotal() === T.layout['6/two-inch/2/3'], `6 寸排二寸：${await sheetTotal()}`);
  await page.selectOption('#ip-pa', 'one-inch');
  await page.selectOption('#ip-pa-n', '4');
  await page.selectOption('#ip-pb', 'two-inch');
  const mix = await page.evaluate(() => { const L = window.__idp.S.lastSheet; return { counts: L.counts, P: L.placements, pw: L.pw, ph: L.ph }; });
  assert(mix.counts[0] === 4 && mix.counts[1] >= 1, `混排张数 ${mix.counts}`);
  for (let i = 0; i < mix.P.length; i++) {
    const a = mix.P[i];
    assert(a.xMm >= 3 - 1e-6 && a.yMm >= 3 - 1e-6 && a.xMm + a.wMm <= mix.pw - 3 + 1e-6 && a.yMm + a.hMm <= mix.ph - 3 + 1e-6, `第 ${i} 张越出页边距`);
    for (let j = i + 1; j < mix.P.length; j++) {
      const b = mix.P[j];
      const gap = Math.max(b.xMm - (a.xMm + a.wMm), a.xMm - (b.xMm + b.wMm), b.yMm - (a.yMm + a.hMm), a.yMm - (b.yMm + b.hMm));
      assert(gap >= 2 - 1e-6, `第 ${i}、${j} 张间距 ${gap.toFixed(2)} mm`);
    }
  }
  // 每个摆放位置里都真的画上了照片：照片框内非纯白像素占比 ≥ 10%
  const sheetPx = await page.evaluate(() => {
    const L = window.__idp.S.lastSheet, c = document.getElementById('ip-sheet'), k = 300 / 25.4, x = c.getContext('2d');
    const fr = L.placements.map((p) => {
      const d = x.getImageData(Math.round(p.xMm * k) + 2, Math.round(p.yMm * k) + 2, Math.round(p.wMm * k) - 4, Math.round(p.hMm * k) - 4).data;
      let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 250 || d[i + 1] < 250 || d[i + 2] < 250) n++;
      return n / (d.length / 4);
    });
    return { fr, w: c.width, h: c.height };
  });
  assert(sheetPx.fr.every((v) => v >= 0.1), `冲印画布上每张照片都应画上：${sheetPx.fr.map((v) => v.toFixed(2)).join(',')}`);
  f = await download('#ip-sheet-export');
  jh = jpegHeader(f.bytes);
  assert(jh.w === sheetPx.w && jh.h === sheetPx.h && jh.xd === 300 && jh.units === 1, `冲印 JPEG ${jh.w}×${jh.h} @${jh.xd}`);
  assert((jh.w === 1205 && jh.h === 1795) || (jh.w === 1795 && jh.h === 1205), `6 寸 300 dpi 应为 1205×1795，实得 ${jh.w}×${jh.h}`);
  await page.selectOption('#ip-pb', '');
  await page.selectOption('#ip-pa-n', 'max');

  // ---- 9. 规格库 + 自定义规格（含持久化）----
  await onTab('specs');
  const nRows = await page.$$eval('#ip-spec-table tbody tr', (r) => r.length);
  const nOpts = await page.$$eval('#ip-spec option', (o) => o.length);
  assert(nRows === nOpts && nRows >= 18, `规格表 ${nRows} 行 / 下拉 ${nOpts} 项`);
  await page.click('#ip-spec-table [data-use="uk"]');
  await page.waitForFunction(() => !document.getElementById('pane-make').hidden);
  await waitOut();
  o = await outInfo();
  assert(o.spec === 'uk' && o.w === 413 && o.h === 531, `「使用」英国规格 → ${o.spec} ${o.w}×${o.h}`);
  await onTab('specs');
  await page.fill('#ip-c-name', '');
  await page.click('#ip-c-save');
  assert(await page.$eval('#ip-c-name', (e) => !e.checkValidity()), '空名称应被表单拦下');
  await page.fill('#ip-c-name', '测试报名');
  await page.fill('#ip-c-w', '30'); await page.fill('#ip-c-h', '40');
  await page.fill('#ip-c-pw', '354'); await page.fill('#ip-c-ph', '');
  await page.click('#ip-c-save');
  assert(/要么都填/.test(await page.$eval('#ip-c-msg', (e) => e.textContent)), '像素只填一半应报错');
  await page.fill('#ip-c-ph', '472'); await page.fill('#ip-c-h0', '25'); await page.fill('#ip-c-h1', '30'); await page.fill('#ip-c-kb', '30');
  await page.click('#ip-c-save');
  assert(/已保存/.test(await page.$eval('#ip-c-msg', (e) => e.textContent)), '合法规格应保存');
  await onTab('make');
  await waitOut();
  o = await outInfo();
  assert(o.w === 354 && o.h === 472 && /^custom-/.test(o.spec), `自定义规格成品 ${o.w}×${o.h} ${o.spec}`);
  assert(Math.abs(o.headMm - 27.5) < 1e-9, `自定义头高取 25–30 正中，实得 ${o.headMm}`);
  f = await download('#ip-export');
  assert(f.bytes.length <= 30 * 1024 && jpegHeader(f.bytes).w === 354, `自定义规格导出 ${(f.bytes.length / 1024).toFixed(1)} KB`);
  await page.reload();
  const persisted = await page.evaluate(() => ({ spec: document.getElementById('ip-spec').value, n: document.querySelectorAll('#ip-customs .ip-custom').length }));
  assert(/^custom-/.test(persisted.spec) && persisted.n === 1, `刷新后自定义规格应保留并选中：${JSON.stringify(persisted)}`);
  await onTab('specs');
  await page.click('#ip-customs button');
  assert(await page.$$eval('#ip-customs .ip-custom', (e) => e.length) === 0, '删除后列表应为空');
  assert(await page.$eval('#ip-spec', (e) => e.value) === 'one-inch', '删除正在用的规格后应回到一寸');

  // ---- 10. 页签键盘导航 ----
  await page.focus('#tab-specs');
  await page.keyboard.press('ArrowRight');
  assert(await page.$eval('#tab-help', (e) => e.getAttribute('aria-selected')) === 'true', '→ 应切到说明');
  await page.keyboard.press('ArrowRight');
  assert(await page.$eval('#tab-make', (e) => e.getAttribute('aria-selected')) === 'true', '→ 应循环回制作');

  // ---- 11. 渲染守卫（逐页签 × 逐视口），带照片跑 ----
  await page.click('#ip-demo');
  await waitReady(1);
  await waitOut();
  const nCtl = await renderGuards(page, {
    assert, tabs: T.meta.tabs, onTab,
    paneSel: (t) => `#pane-${t}`, panesRoot: '#ip-panes',
    figSel: (t) => `#pane-${t} svg.ip-dim`, cardSel: '.ip-card',
    minControls: 50, minTextsInFig: 4,
  });
  assert(nCtl >= 50, `各页签可见控件 ${nCtl}`);

  // ---- 12. 缩略图：示例照片做蓝底一寸，停在工作区 ----
  await onTab('make');
  await page.selectOption('#ip-spec', 'one-inch');
  await page.click('#ip-bg-blue');
  await waitOut();
  await page.evaluate(() => { const r = document.getElementById('ip-app').getBoundingClientRect(); window.scrollTo(0, r.top + window.scrollY - 64); });
  await page.waitForFunction(() => document.getElementById('ip-out').dataset.key === window.__idp.stateKey());
  await screenshot('thumb.png');
};
