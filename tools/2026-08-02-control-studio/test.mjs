// Integration test for 控制工作台 · Control Studio.
// Drives the real UI and asserts real control-theory output — textbook stability margins,
// Ziegler–Nichols ultimate gain, closed-form second-order step metrics, steady-state error
// of a type-0 loop — plus the layout / visibility guards that DOM-existence assertions are
// structurally blind to (hidden panels checked by computed display, canvases checked for ink).
export default async ({ page, toolURL, screenshot, assert }) => {
  const text = (sel) => page.$eval(sel, (el) => el.textContent.trim());
  const val = (sel) => page.$eval(sel, (el) => el.value);
  const num = (s) => { const m = String(s).replace(/,/g, '').replace(/−/g, '-').match(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/i); return m ? parseFloat(m[0]) : NaN; };
  const display = (sel) => page.$eval(sel, (el) => getComputedStyle(el).display);
  const rect = (sel) => page.$eval(sel, (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height, top: r.top, left: r.left, right: r.right, bottom: r.bottom };
  });
  // 绝不用固定等待:等分析计数器前进(见 07-06 教训)
  const settle = async (fn) => {
    const before = await page.evaluate(() => document.body.dataset.runs || '0');
    await fn();
    await page.waitForFunction((b) => (document.body.dataset.runs || '0') !== b, before, { timeout: 20000 });
  };
  // 切标签 / 改尺寸只重绘、不重算,所以等的是绘制计数器
  const settleDraw = async (fn) => {
    const before = await page.evaluate(() => document.body.dataset.drawn || '0');
    await fn();
    await page.waitForFunction((b) => (document.body.dataset.drawn || '0') !== b, before, { timeout: 20000 });
  };
  const setPlant = (n, d, delay = '0') => settle(async () => {
    await page.fill('#num', n);
    await page.fill('#den', d);
    await page.fill('#delay', delay);
  });
  const setGains = (kp, ki, kd) => settle(async () => {
    await page.fill('#kp', String(kp));
    await page.fill('#ki', String(ki));
    await page.fill('#kd', String(kd));
  });
  // 画布真的画了东西:统计非白像素占比
  const inkRatio = (sel) => page.evaluate((s) => {
    const cv = document.querySelector(s);
    const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 12 && (d[i] < 238 || d[i + 1] < 238 || d[i + 2] < 238)) n++;
    return n / (d.length / 4);
  }, sel);

  await page.goto(toolURL, { waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 20000 });

  // ── 1 · 外壳 ────────────────────────────────────────────────
  assert((await page.title()).includes('控制工作台'), 'title names the tool');
  assert(await page.$('a.back[href="../../"]'), 'back link to the hub exists');
  assert((await text('#verdict')) === '稳定', `默认巡航控制方案闭环稳定(得「${await text('#verdict')}」)`);
  assert(await page.$('.tile[data-id="cruise"][aria-pressed="true"]'), '默认选中「巡航控制」预设');

  // ── 2 · 教科书算例 L = 1/(s(s+1)(s+2)),Kp=1 ────────────────
  // 手推:ωpc = √2、GM = 6 倍 = 15.563 dB;ωgc = 0.4457、PM = 53.4°
  await setPlant('1', 's(s+1)(s+2)');
  await setGains(1, 0, 0);
  assert((await page.evaluate(() => document.body.dataset.state)) === 'stable', 'Kp=1 时闭环稳定');
  const gm = num(await text('#d-gm')), wpc = num(await text('#d-wpc'));
  const pm = num(await text('#d-pm')), wgc = num(await text('#d-wgc'));
  assert(Math.abs(gm - 15.5630) < 0.01, `增益裕度 = 15.56 dB(得 ${gm})`);
  assert(Math.abs(wpc - Math.SQRT2) < 0.005, `相位穿越频率 = √2 = 1.414(得 ${wpc})`);
  assert(Math.abs(pm - 53.4172) < 0.02, `相位裕度 = 53.42°(得 ${pm})`);
  assert(Math.abs(wgc - 0.44646) < 0.002, `增益穿越频率 = 0.4465(得 ${wgc})`);
  assert((await text('#d-type')).startsWith('1 型'), `I 型系统(一个积分器),得「${await text('#d-type')}」`);
  assert(Math.abs(num(await text('#m-ess'))) < 1e-6, 'I 型系统对阶跃参考无静差');
  assert((await text('#verdict-line')).includes('53.4'), 'hero 副标题带上相位裕度');

  // ── 3 · 自动整定:ZN 临界比例度法 Ku = 6、Tu = 4.443 ─────────
  await settle(async () => { await page.click('#btn-tune'); });
  const tuneNote = await text('#tune-note');
  assert(tuneNote.includes('Ku = 6'), `整定说明报出 Ku = 6(得「${tuneNote}」)`);
  assert(Math.abs(num(tuneNote.split('Tu =')[1]) - 4.4429) < 0.01, `整定说明报出 Tu = 4.4429 s(得「${tuneNote}」)`);
  assert(Math.abs(parseFloat(await val('#kp')) - 3.6) < 1e-3, `ZN PID: Kp = 0.6Ku = 3.6(得 ${await val('#kp')})`);
  assert(Math.abs(parseFloat(await val('#ki')) - 1.2 * 6 / 4.442882938) < 2e-3, `ZN PID: Ki = 1.2Ku/Tu = 1.621(得 ${await val('#ki')})`);
  assert(Math.abs(parseFloat(await val('#kd')) - 0.075 * 6 * 4.442882938) < 2e-3, `ZN PID: Kd = 0.075·Ku·Tu = 2.0(得 ${await val('#kd')})`);
  assert((await page.evaluate(() => document.body.dataset.state)) === 'stable', 'ZN 整定后闭环仍稳定');
  const osZN = num(await text('#m-os'));
  assert(osZN > 20 && osZN < 80, `ZN 整定以超调换速度(超调 ${osZN}%,落在 20–80% 的经典区间)`);

  // ── 4 · 超过临界增益必须失稳(Kp = 7 > Ku = 6) ──────────────
  await setGains(7, 0, 0);
  assert((await page.evaluate(() => document.body.dataset.state)) === 'unstable', 'Kp=7 > Ku=6 时闭环不稳定');
  assert((await text('#verdict')) === '不稳定', 'hero 结论为「不稳定」');
  assert((await text('#m-os')) === '—', '不稳定时不报超调量');
  const rhpRows = await page.$$eval('#t-poles tbody tr', (trs) => trs.filter((t) => t.textContent.includes('右半平面')).length);
  assert(rhpRows === 2, `极点表标出 2 个右半平面极点(得 ${rhpRows})`);
  await settleDraw(async () => { await page.click('.tab[data-p="data"]'); });
  const routhNote = await text('#routh-note');
  assert(routhNote.includes('符号变化 2 次') && routhNote.includes('同样得到 2 个'), `劳斯判据与求根法一致(得「${routhNote}」)`);
  const routhRows = await page.$$eval('#t-routh tbody tr', (trs) => trs.length);
  assert(routhRows === 4, `三阶特征多项式的劳斯阵列有 4 行(得 ${routhRows})`);
  const verdictColor = await page.$eval('#verdict', (el) => getComputedStyle(el).color);
  assert(verdictColor !== 'rgb(255, 255, 255)', `不稳定结论用告警色而非普通白字(得 ${verdictColor})`);

  // ── 5 · 闭式解校验:T = 1/(s²+s+1) ⇒ ζ=0.5, ωn=1 ────────────
  // 取 G = 1/(s(s+1))、Kp=1,闭环恰为标准二阶系统
  await setPlant('1', 's(s+1)');
  await setGains(1, 0, 0);
  await settleDraw(async () => { await page.click('.tab[data-p="step"]'); });
  const os = num(await text('#m-os')), tp = num(await text('#d-tp'));
  assert(Math.abs(os - 16.303) < 0.05, `超调量 = 100·exp(−πζ/√(1−ζ²)) = 16.30%(得 ${os})`);
  assert(Math.abs(tp - 3.6276) < 0.02, `峰值时间 = π/ωd = 3.628 s(得 ${tp})`);
  const poleRow = await page.$$eval('#t-poles tbody tr', (trs) => Array.from(trs[0].cells).map((c) => c.textContent.trim()));
  assert(Math.abs(num(poleRow[1]) - 0.5) < 0.002, `主导极点阻尼比 ζ = 0.5(得 ${poleRow[1]})`);
  assert(Math.abs(num(poleRow[2]) - 1) < 0.002, `主导极点自然频率 ωn = 1(得 ${poleRow[2]})`);
  assert(poleRow[0].includes('0.866'), `极点为 −0.5 ± 0.866j(得 ${poleRow[0]})`);

  // ── 6 · 0 型系统静差 = 1/(1+K) ─────────────────────────────
  // G = 2/((s+1)(s+3)) ⇒ G(0) = 2/3;Kp=5 ⇒ K = 10/3 ⇒ ess = 3/13 = 0.2308
  await setPlant('2', '(s+1)(s+3)');
  await setGains(5, 0, 0);
  assert((await text('#d-type')).startsWith('0 型'), '该对象是 0 型系统');
  const ess = num(await text('#m-ess'));
  assert(Math.abs(ess - 3 / 13) < 1e-3, `0 型系统静差 = 1/(1+K) = 0.2308(得 ${ess})`);
  assert(Math.abs(num(await text('#d-yss')) - 10 / 13) < 1e-3, `稳态输出 = K/(1+K) = 0.7692(得 ${await text('#d-yss')})`);
  // 加积分作用后静差必须消掉
  await setGains(5, 3, 0);
  assert(Math.abs(num(await text('#m-ess'))) < 2e-3, `加入积分后静差归零(得 ${await text('#m-ess')})`);
  assert((await text('#chips')).includes('PI 控制') || (await page.$eval('#chips', (el) => el.textContent)).includes('PI'), '控制器形态标注为 PI');

  // ── 7 · 阶跃幅值放大,稳态输出同比放大 ──────────────────────
  const yss1 = num(await text('#d-yss'));
  await settle(async () => { await page.fill('#ref', '2'); });
  const yss2 = num(await text('#d-yss'));
  assert(Math.abs(yss2 - 2 * yss1) < 1e-3, `阶跃幅值 ×2 ⇒ 稳态输出 ×2(${yss1} → ${yss2})`);
  await settle(async () => { await page.fill('#ref', '1'); });

  // ── 8 · ZN 不适用的对象要如实说明,而不是硬给一组数 ──────────
  await settle(async () => { await page.click('.tile[data-id="osc"]'); });
  assert(await page.$('.tile[data-id="osc"][aria-pressed="true"]'), '点击预设后瓦片高亮');
  assert((await val('#den')).replace(/\s/g, '') === 's^2+0.4s+1', '预设写入分母表达式');
  await page.click('#btn-tune');
  await page.waitForFunction(() => document.body.dataset.tuned === 'na', null, { timeout: 10000 });
  assert((await text('#tune-note')).includes('不适用'), 'ZN 对永不失稳的二阶对象明确报「不适用」');
  assert(parseFloat(await val('#kp')) === 1, 'ZN 不适用时不改动现有增益');

  // ── 9 · 非法输入 ───────────────────────────────────────────
  await settle(async () => { await page.fill('#den', 's^^2'); });
  assert((await display('#parse-err')) !== 'none', '语法错误时错误条真的可见(计算样式)');
  assert((await page.evaluate(() => document.body.dataset.state)) === 'error', '解析失败时状态标记为 error');
  await settle(async () => { await page.fill('#num', 's^3'); await page.fill('#den', 's+1'); });
  assert((await text('#parse-err')).includes('分子阶次高于分母'), `拒绝非真传递函数(得「${await text('#parse-err')}」)`);
  await settle(async () => { await page.fill('#den', '0'); });
  assert((await display('#parse-err')) !== 'none', '分母为 0 时报错');
  // 恢复成一个合法对象
  await setPlant('1', 's(s+1)(s+2)');
  await setGains(2, 0.4, 1.2);
  assert((await display('#parse-err')) === 'none', '修正后错误条隐藏(计算样式 = none)');

  // ── 10 · 面板真的藏起来了(不只是 hidden 属性) ─────────────
  for (const p of ['#p-bode', '#p-locus', '#p-nyq', '#p-data']) {
    assert((await display(p)) === 'none', `${p} 计算样式为 none`);
  }
  assert((await display('#p-step')) !== 'none', '阶跃响应面板可见');
  const stepInk = await inkRatio('#cv-step');
  assert(stepInk > 0.004, `阶跃响应画布确实画了内容(非白像素占比 ${stepInk.toFixed(4)})`);

  // ── 11 · 逐个标签页:切换 + 画布落笔 + 关键读数 ─────────────
  await settleDraw(async () => { await page.click('.tab[data-p="bode"]'); });
  assert((await display('#p-bode')) !== 'none' && (await display('#p-step')) === 'none', '切到伯德图后互斥显示');
  assert((await page.evaluate(() => document.body.dataset.panel)) === 'bode', 'panel 状态标记为 bode');
  assert((await inkRatio('#cv-mag')) > 0.004, '幅频图有内容');
  assert((await inkRatio('#cv-pha')) > 0.004, '相频图有内容');
  await screenshot('view-bode.png');

  await settleDraw(async () => { await page.click('.tab[data-p="locus"]'); });
  assert((await inkRatio('#cv-locus')) > 0.004, '根轨迹图有内容');
  await screenshot('view-locus.png');

  await settleDraw(async () => { await page.click('.tab[data-p="nyq"]'); });
  assert((await inkRatio('#cv-nyq')) > 0.004, '奈奎斯特图有内容');
  await screenshot('view-nyquist.png');

  await settleDraw(async () => { await page.click('.tab[data-p="data"]'); });
  // 三阶对象 + 带滤波 PID(分母 τs²+s,2 阶)⇒ 特征多项式 5 阶 ⇒ 5 个闭环极点
  const poleCount = await page.$$eval('#t-poles tbody tr', (t) => t.length);
  assert(poleCount === 5, `PID(带微分滤波)+ 三阶对象 ⇒ 5 个闭环极点(得 ${poleCount})`);
  const routhRows2 = await page.$$eval('#t-routh tbody tr', (t) => t.length);
  assert(routhRows2 === 6, `5 阶特征多项式的劳斯阵列有 6 行(得 ${routhRows2})`);
  await screenshot('view-data.png');

  // 键盘可用:方向键在 tablist 内切换
  await page.focus('.tab[data-p="data"]');
  await settleDraw(async () => { await page.keyboard.press('ArrowRight'); });
  assert((await page.evaluate(() => document.body.dataset.panel)) === 'step', '方向键在标签间循环切换');

  // ── 12 · 滑杆与数字框双向同步 ──────────────────────────────
  await settle(async () => {
    await page.$eval('#kp-r', (el) => { el.value = '5'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  });
  assert(parseFloat(await val('#kp')) === 5, '拖滑杆后数字框同步为 5');
  await settle(async () => { await page.fill('#kp', '9'); });
  assert(parseFloat(await val('#kp-r')) === 9, '改数字框后滑杆同步为 9');
  await setGains(2, 0.4, 1.2);

  // ── 13 · 方案库存取(localStorage 往返) ────────────────────
  await page.fill('#save-name', '教科书三阶 · PID');
  await page.click('#btn-save');
  await page.waitForFunction(() => document.querySelectorAll('#saved .sv').length === 1, null, { timeout: 8000 });
  assert((await display('#saved-empty')) === 'none', '有方案后空态提示隐藏(计算样式)');
  assert((await text('#saved .sv b')) === '教科书三阶 · PID', '方案卡片显示名称');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('controlStudio.designs.v1'))[0]);
  assert(stored.kp === 2 && stored.ki === 0.4 && stored.kd === 1.2, `localStorage 里存下了当前增益(得 ${JSON.stringify(stored)})`);
  await setGains(0.5, 0, 0);
  await settle(async () => { await page.click('#saved .sv .load'); });
  assert(parseFloat(await val('#kp')) === 2 && parseFloat(await val('#kd')) === 1.2, '载入方案后增益复原');
  await page.click('#saved .sv .del');
  await page.waitForFunction(() => document.querySelectorAll('#saved .sv').length === 0, null, { timeout: 8000 });
  assert((await display('#saved-empty')) !== 'none', '删除后空态提示重新出现');

  // ── 14 · 布局守卫:元素不逃逸、控件不塌缩、无横向溢出 ───────
  await settleDraw(async () => { await page.click('.tab[data-p="step"]'); });
  const panelBox = await rect('#p-step');
  const canvasBox = await rect('#cv-step');
  assert(canvasBox.left >= panelBox.left - 1 && canvasBox.right <= panelBox.right + 1,
    `阶跃画布落在面板内(canvas ${canvasBox.left}–${canvasBox.right} vs panel ${panelBox.left}–${panelBox.right})`);
  assert(canvasBox.w > 300 && canvasBox.h > 200, `画布尺寸合理(${canvasBox.w}×${canvasBox.h})`);
  for (const sel of ['#kp-r', '#ki-r', '#kd-r']) {
    const r = await rect(sel);
    assert(r.w >= 140 && r.h >= 14, `${sel} 没有被通用选择器压塌(${r.w}×${r.h})`);
  }
  for (const sel of ['#num', '#den', '#kp']) {
    const r = await rect(sel);
    assert(r.w >= 60 && r.h >= 30, `${sel} 渲染尺寸正常(${r.w}×${r.h})`);
  }
  const heroBox = await rect('.specs');
  const heroWrap = await rect('.hero .wrap');
  assert(heroBox.right <= heroWrap.right + 1, 'hero 参数格未越出容器');
  const overflow1280 = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert(overflow1280 <= 1, `1280 视口零横向溢出(得 ${overflow1280}px)`);

  // 窄屏:同样零溢出,画布仍在面板内
  await settleDraw(async () => { await page.setViewportSize({ width: 390, height: 844 }); });
  const overflow390 = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert(overflow390 <= 1, `390 视口零横向溢出(得 ${overflow390}px)`);
  const nb = await rect('#cv-step'), np = await rect('#p-step');
  assert(nb.left >= np.left - 1 && nb.right <= np.right + 1, '窄屏画布仍在面板内');
  assert(nb.w > 260, `窄屏画布仍有可用宽度(${nb.w})`);
  await screenshot('view-narrow.png');
  await settleDraw(async () => { await page.setViewportSize({ width: 1280, height: 850 }); });

  // ── 15 · 缩略图:回到默认巡航控制方案 ──────────────────────
  await settle(async () => { await page.click('.tile[data-id="cruise"]'); });
  assert((await text('#verdict')) === '稳定', '巡航控制默认设计闭环稳定');
  assert(num(await text('#m-os')) > 0 && num(await text('#m-os')) < 40, '默认设计超调在合理范围');
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running'), null, { timeout: 5000 }).catch(() => {});
  await screenshot('view-step.png');
  await screenshot('thumb.png');
};
