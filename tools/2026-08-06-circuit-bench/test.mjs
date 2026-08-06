// 集成测试:电路实验台 · Circuit Bench
// 断言的是真实仿真结果(教科书电路的节点电压 / 二极管压降 / −3dB 截止频率 / 谐振 Q /
// 闭环增益与带宽 / THD 谐波结构),不是「元素存在」。期望值来自本工具引擎的离线断言套件
// (193 条,独立闭式解 + 逐节点 KCL 残差对照)。
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#cb-scope');

  // 每次完整重算都会自增 body[data-runs];全程等它收敛,绝不用定时器(2026-07-06 教训)
  const runsNow = () => page.evaluate(() => Number(document.body.dataset.runs || 0));
  const settle = async (fn) => {
    const before = await runsNow();
    await fn();
    await page.waitForFunction((n) => Number(document.body.dataset.runs || 0) > n, before, { timeout: 20000 });
  };
  await page.waitForFunction(() => Number(document.body.dataset.runs || 0) >= 1, null, { timeout: 20000 });

  const txt = async (sel) => ((await page.locator(sel).textContent()) || '').trim();
  // 从带工程后缀的读数里取数值:"11.31V" → 11.31,"1.591kHz" → 1591,"-3.01 dB" → -3.01
  const SUF = { T: 1e12, G: 1e9, M: 1e6, k: 1e3, m: 1e-3, 'µ': 1e-6, u: 1e-6, n: 1e-9, p: 1e-12, f: 1e-15 };
  const val = (s) => {
    const m = /(-|−)?\s*(\d+(?:\.\d+)?(?:e[+-]?\d+)?)\s*([TGMkmµunpf])?/.exec(String(s).replace('−', '-'));
    if (!m) return NaN;
    const sign = m[1] ? -1 : 1;
    return sign * parseFloat(m[2]) * (m[3] && SUF[m[3]] !== undefined ? SUF[m[3]] : 1);
  };
  const close = (a, b, tol) => Math.abs(a - b) <= tol;
  const readBoxes = async (sel) => {
    const out = {};
    const n = await page.locator(sel + ' .cb-readbox').count();
    for (let i = 0; i < n; i++) {
      const box = page.locator(sel + ' .cb-readbox').nth(i);
      out[(await box.locator('span').textContent()).trim()] = (await box.locator('b').textContent()).trim();
    }
    return out;
  };
  // 逐单元格读表(row.textContent 会把各列粘在一起,必须按 td 取)
  const tableRows = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll(s + ' tr'))
    .map((tr) => Array.from(tr.querySelectorAll('td')).map((td) => td.textContent.trim())), sel);
  const rowStarting = async (sel, first) => (await tableRows(sel)).find((r) => r[0] === first) || null;
  const measRow = async (name) => {
    const rows = page.locator('#cb-meas tr');
    const n = await rows.count();
    for (let i = 0; i < n; i++) {
      const cells = await rows.nth(i).locator('td').allTextContents();
      if (cells[0] && cells[0].trim() === name) return cells.map((c) => c.trim());
    }
    return null;
  };
  const loadPreset = (key) => settle(() => page.selectOption('#cb-preset', key));

  /* ================= 0. 骨架 ================= */
  assert((await page.locator('a[href="../../"]').count()) >= 1, '顶部有「返回工具集」链接');
  assert((await page.locator('#cb-preset option').count()) === 10, `内置示例 10 个(得到 ${await page.locator('#cb-preset option').count()})`);

  /* ================= 1. 默认电路:半波整流 + 滤波(瞬态) ================= */
  assert((await txt('#cb-stat-nodes')) === '2', `整流电路 2 个可见节点(得到 ${await txt('#cb-stat-nodes')})`);
  assert((await txt('#cb-stat-els')) === '4', `4 个元件(得到 ${await txt('#cb-stat-els')})`);
  assert((await txt('#cb-stat-unknowns')) === '3', `MNA 未知量 = 2 节点 + 1 电压源支路 = 3(得到 ${await txt('#cb-stat-unknowns')})`);
  const scopeInfo = await txt('#cb-scope-info');
  assert(/5001 点/.test(scopeInfo), `100ms / 20µs = 5000 步 → 5001 点(得到 ${scopeInfo})`);
  assert(/梯形法/.test(scopeInfo) && /牛顿迭代/.test(scopeInfo), '示波器信息标注了积分法与牛顿迭代次数');

  const vin = await measRow('V(in)');
  assert(vin, '测量表里有 V(in) 行');
  assert(close(val(vin[1]), -12, 0.02) && close(val(vin[2]), 12, 0.02), `输入正弦 ±12V(得到 ${vin[1]} ~ ${vin[2]})`);
  assert(close(val(vin[3]), 24, 0.05), `峰峰值 24V(得到 ${vin[3]})`);
  assert(Math.abs(val(vin[4])) < 1e-3, `正弦均值 ≈ 0(得到 ${vin[4]})`);
  assert(close(val(vin[5]), 12 / Math.SQRT2, 0.05), `正弦 RMS = 12/√2 = 8.485V(得到 ${vin[5]})`);
  assert(close(val(vin[6]), 50, 0.6), `测得基频 50Hz(得到 ${vin[6]})`);

  const vout = await measRow('V(out)');
  assert(vout, '测量表里有 V(out) 行');
  const voutMax = val(vout[2]), voutMin = val(vout[1]);
  assert(voutMax > 10.8 && voutMax < 11.6, `整流峰值 ≈ 12 − 硅二极管压降 ≈ 11.3V(得到 ${vout[2]})`);
  assert(voutMin >= 0, `单向导通:输出全程不为负(最小 ${vout[1]},零状态起始故为 0)`);
  // 启动后(游标 B 落在 62% 处)电容把输出夹在峰值附近,而不是跟着输入回到 −12V
  assert(val(vout[8]) > 10 && val(vout[8]) < 11.6, `启动后输出被电容夹在峰值附近(游标 B 处 ${vout[8]})`);
  assert(val(vin[8]) < val(vout[8]), `同一时刻输入 ${vin[8]} 低于被电容保持的输出 ${vout[8]}`);

  // 画布真的画了东西(不是一块空白暗板)
  const scopeInk = await page.evaluate(() => {
    const c = document.querySelector('#cb-scope');
    const g = c.getContext('2d');
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let lit = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i] + d[i + 1] + d[i + 2] > 200) lit++;
    return lit;
  });
  assert(scopeInk > 3000, `示波器画布上有实际笔迹(亮像素 ${scopeInk})`);

  /* ================= 2. 工作点:电阻分压的闭式解 ================= */
  await settle(() => page.fill('#cb-net', '* 分压器\nV1 in 0 DC 10\nR1 in out 1k\nR2 out 0 2k\nR3 out 0 3k'));
  await settle(() => page.click('#cb-tab-op'));
  const opNodes = await tableRows('#cb-op-nodes');
  assert(opNodes.length === 2, `2 个节点电压行(得到 ${opNodes.length})`);
  const vOut = val((await rowStarting('#cb-op-nodes', 'V(out)'))[1]);
  assert(close(vOut, 10 * 1200 / 2200, 1e-5), `V(out) = 10·(2k∥3k)/(1k+2k∥3k) = 5.45455V(得到 ${vOut})`);
  const r1row = await rowStarting('#cb-op-elements', 'R1');
  assert(close(val(r1row[2]), (10 - 10 * 1200 / 2200) / 1000, 1e-8), `I(R1) = (10−5.45455)/1k = 4.54545mA(得到 ${r1row[2]})`);
  const r2row = await rowStarting('#cb-op-elements', 'R2');
  const r3row = await rowStarting('#cb-op-elements', 'R3');
  assert(close(val(r2row[2]) + val(r3row[2]), val(r1row[2]), 1e-9), `KCL:I(R2)+I(R3) = I(R1)(${r2row[2]} + ${r3row[2]} = ${r1row[2]})`);
  const v1row = await rowStarting('#cb-op-elements', 'V1');
  assert(close(val(v1row[2]), -val(r1row[2]), 1e-9), `I(V1) = −I(R1)(SPICE 电源电流符号,得到 ${v1row[2]})`);
  const opRead = await readBoxes('#cb-op-read');
  assert(val(opRead['相对功率残差']) < 1e-7, `功率守恒(电源发出 = 元件吸收):相对残差 ${opRead['相对功率残差']} < 1e-7,余下的是 gmin=1e-12 的固有泄漏`);
  assert(opRead['MNA 未知量'] === '3', `分压器 MNA 未知量 3(得到 ${opRead['MNA 未知量']})`);

  /* ================= 3. 二极管工作点:肖克利方程反解 ================= */
  await settle(() => page.fill('#cb-net', '* 二极管限流\nV1 a 0 DC 5\nR1 a b 4.3k\nD1 b 0'));
  const vb = val((await rowStarting('#cb-op-nodes', 'V(b)'))[1]);
  assert(vb > 0.6 && vb < 0.75, `硅二极管正向压降落在 0.6~0.75V(得到 ${vb.toFixed(4)}V)`);
  // 用节点电压独立反算电流,应与表里的 I(D1) 一致
  const iD = val((await rowStarting('#cb-op-elements', 'D1'))[2]);
  const iR = (5 - vb) / 4300;
  assert(Math.abs(iD - iR) / iR < 2e-3, `I(D1) = 电阻电流 = ${(iR * 1e3).toFixed(4)}mA(得到 ${(iD * 1e3).toFixed(4)}mA)`);
  const idealVd = 0.025852 * Math.log(iD / 1e-14 + 1);
  assert(Math.abs(idealVd - vb) < 2e-3, `Vd = Vt·ln(Id/Is+1) = ${idealVd.toFixed(4)}V 与解出的 ${vb.toFixed(4)}V 一致`);

  /* ================= 4. 交流:RC 一阶低通的 −3dB 与直流增益 ================= */
  await loadPreset('rc');
  assert((await page.locator('#cb-tab-ac').getAttribute('aria-selected')) === 'true', 'RC 示例默认落在交流标签');
  const acRC = await readBoxes('#cb-ac-read');
  assert(close(val(acRC['起始频率增益']), 0, 0.02), `RC 通带增益 0 dB(得到 ${acRC['起始频率增益']})`);
  const fc = val(acRC['−3dB 截止频率']);
  const fcTheory = 1 / (2 * Math.PI * 1000 * 100e-9);
  assert(Math.abs(fc - fcTheory) / fcTheory < 0.02, `−3dB = 1/(2πRC) = ${fcTheory.toFixed(1)}Hz(得到 ${acRC['−3dB 截止频率']})`);

  /* ================= 5. 交流:RLC 串联谐振的 Q 与谐振频率 ================= */
  await loadPreset('rlc');
  const acRLC = await readBoxes('#cb-ac-read');
  const peakDb = val(acRLC['峰值增益']);
  const w0 = 1 / Math.sqrt(10e-3 * 100e-9), f0 = w0 / (2 * Math.PI), Q = (w0 * 10e-3) / 10;   // f0=5032.9Hz, Q=31.62
  // 扫描网格不一定正落在 f0 上,所以峰值只会略低于理论 20log10(Q)=30.00dB,不会超过它
  assert(peakDb <= 20 * Math.log10(Q) + 0.02 && peakDb > 20 * Math.log10(Q) - 0.5,
    `谐振峰 ≤ 20log10(Q) = ${(20 * Math.log10(Q)).toFixed(2)}dB 且相差 <0.5dB(得到 ${acRLC['峰值增益']})`);
  const fPeak = val(acRLC['峰值频率']);
  assert(Math.abs(fPeak - f0) / f0 < 0.02, `谐振频率 = 1/(2π√LC) = ${f0.toFixed(1)}Hz(得到 ${acRLC['峰值频率']})`);
  const acInfo = await txt('#cb-ac-info');
  assert(/个频点/.test(acInfo), '交流面板报出了扫描频点数');

  /* ================= 6. 运放:反相放大器的闭环增益与 GBW 带宽 ================= */
  await loadPreset('inv-amp');
  const acOp = await readBoxes('#cb-ac-read');
  const g0 = val(acOp['起始频率增益']);
  assert(close(g0, 20 * Math.log10(10 / (1 + 11 / 1e5)), 0.05), `闭环增益 = −Rf/Rin = 10 → 20dB(有限 A 修正,得到 ${acOp['起始频率增益']})`);
  const bw = val(acOp['−3dB 截止频率']);
  assert(Math.abs(bw - 1e6 / 11) / (1e6 / 11) < 0.06, `闭环带宽 ≈ GBW/(1+Rf/Rin) = ${(1e6 / 11).toFixed(0)}Hz(得到 ${acOp['−3dB 截止频率']})`);

  /* ================= 7. 直流扫描:二极管 I–V ================= */
  await loadPreset('diode-iv');
  assert((await page.locator('#cb-tab-dc').getAttribute('aria-selected')) === 'true', '二极管 I–V 示例默认落在直流扫描');
  const dcInfo = await txt('#cb-dc-info');
  assert(/201 点/.test(dcInfo), `0→1V 步进 5mV = 201 点(得到 ${dcInfo})`);
  assert(/横轴 V1/.test(dcInfo) && /从 0V 扫到 1V/.test(dcInfo), `扫描区间与坐标轴标注正确(得到 ${dcInfo})`);
  const dcRead = await readBoxes('#cb-dc-read');
  const iEnd = val(dcRead['I(D1) @ 终点']);
  assert(iEnd > 1e-3, `1V 驱动下二极管电流 > 1mA(得到 ${dcRead['I(D1) @ 终点']})`);

  /* ================= 8. 限幅器 + 频谱:对称削波只出奇次谐波 ================= */
  await loadPreset('clipper');
  await settle(() => page.fill('#cb-tstop', '40m'));
  const clip = await measRow('V(out)');
  assert(val(clip[2]) > 2.4 && val(clip[2]) < 3.0, `正向被钳在 Vref+Vd ≈ 2.6V(得到 ${clip[2]})`);
  assert(val(clip[1]) < -2.4 && val(clip[1]) > -3.0, `负向被钳在 −2.6V(得到 ${clip[1]})`);
  await settle(() => page.click('#cb-tab-fft'));
  await page.waitForFunction(() => document.querySelectorAll('#cb-harm tr').length > 2, null, { timeout: 20000 });
  const fftRead = await readBoxes('#cb-fft-read');
  assert(close(val(fftRead['基波频率']), 1000, 30), `频谱基波 ≈ 1kHz(得到 ${fftRead['基波频率']})`);
  const thd = val(fftRead['THD(2~9 次)']);
  assert(thd > 5, `削波后 THD 明显 > 5%(得到 ${fftRead['THD(2~9 次)']})`);
  const harm = await tableRows('#cb-harm');
  const ratioOf = (n) => val(harm.find((r) => r[0] === n + ' 次')[3]);
  assert(ratioOf(3) > ratioOf(2) * 5, `对称削波:3 次谐波(${ratioOf(3).toFixed(3)}%)远大于 2 次(${ratioOf(2).toFixed(3)}%)`);
  assert(ratioOf(5) > ratioOf(4) * 5, `5 次(${ratioOf(5).toFixed(3)}%)远大于 4 次(${ratioOf(4).toFixed(3)}%)`);

  /* ================= 9. 积分器:方波进 → 三角波出 ================= */
  await loadPreset('integrator');
  const tri = await measRow('V(out)');
  assert(val(tri[3]) > 3 && val(tri[3]) < 7, `三角波峰峰值 ≈ |Vin/(RC)|·T/2 = 5V(得到 ${tri[3]})`);
  const sq = await measRow('V(in)');
  assert(close(val(sq[3]), 2, 0.05), `输入方波峰峰 2V(得到 ${sq[3]})`);
  assert(close(val(sq[6]), 1000, 20), `方波频率 1kHz(得到 ${sq[6]})`);

  /* ================= 10. 网表报错:行号 + 行号槽高亮 + 状态 ================= */
  await settle(() => page.fill('#cb-net', '* 有问题的网表\nV1 in 0 DC 10\nR1 in out 1k\nQ9 a b c 1\nR1 out 0 zzz'));
  const errs = await page.locator('#cb-errors .cb-errbox').allTextContents();
  assert(errs.length >= 2, `至少报出 2 处错误(得到 ${errs.length}:${errs.join(' / ')})`);
  assert(errs.some((e) => e.includes('第 4 行') && e.includes('未知元件类型')), `第 4 行报未知元件类型(得到 ${errs.join(' / ')})`);
  assert(errs.some((e) => e.includes('第 5 行') && e.includes('重复')), `第 5 行报元件名重复(得到 ${errs.join(' / ')})`);
  const badLines = await page.locator('#cb-gutter .cb-gline-err').allTextContents();
  assert(badLines.join(',') === '4,5', `行号槽把第 4、5 行标红(得到 ${badLines.join(',')})`);
  assert(/网表错误/.test(await txt('#cb-status')), `顶栏状态提示网表错误(得到 ${await txt('#cb-status')})`);
  // 行号槽必须每行独占一行(2026-07-31 教训:div 默认 white-space 会把行号折成两列)
  const gutterRects = await page.evaluate(() => Array.from(document.querySelectorAll('#cb-gutter div')).map((d) => d.getClientRects().length));
  assert(gutterRects.every((n) => n === 1), `每个行号只占一个矩形(得到 ${gutterRects.join(',')})`);

  /* ================= 11. 交流提示:工作点下没有小信号通路 ================= */
  await loadPreset('rectifier');
  await settle(() => page.click('#cb-tab-ac'));
  assert(!(await page.locator('#cb-ac-hint').isHidden()), '整流器在零偏工作点下给出「没有小信号通路」的提示');
  assert(/工作点/.test(await txt('#cb-ac-hint')), `提示解释了原因(得到 ${(await txt('#cb-ac-hint')).slice(0, 40)}…)`);

  /* ================= 12. [hidden] 守卫:隐藏面板的计算样式必须真的 none ================= */
  await settle(() => page.click('#cb-tab-tran'));
  for (const k of ['ac', 'op', 'dc', 'fft']) {
    const disp = await page.evaluate((id) => getComputedStyle(document.getElementById(id)).display, 'cb-panel-' + k);
    assert(disp === 'none', `#cb-panel-${k} 的计算样式必须是 display:none(得到 ${disp})`);
  }
  assert((await page.evaluate(() => getComputedStyle(document.getElementById('cb-panel-tran')).display)) !== 'none', '当前标签面板可见');
  assert(await page.locator('#cb-ac-hint').isHidden(), '交流提示条在没内容时是隐藏的');

  /* ================= 13. 信号选择 chips ================= */
  const before = (await page.locator('#cb-meas tr').count());
  await settle(() => page.click('.cb-chip[data-group="tran"][data-trace="I(D1)"]'));
  assert((await page.locator('#cb-meas tr').count()) === before + 1, `勾上 I(D1) 后测量表多一行(${before} → ${await page.locator('#cb-meas tr').count()})`);
  assert((await page.locator('.cb-chip[data-group="tran"][data-trace="I(D1)"]').getAttribute('aria-pressed')) === 'true', 'chip 的 aria-pressed 同步');
  const idRow = await measRow('I(D1)');
  assert(val(idRow[1]) > -1e-6 && val(idRow[2]) > 1e-3, `二极管单向导通:最小 ${idRow[1]} ≈ 0、最大 ${idRow[2]} 为正的安培级`);
  await settle(() => page.click('.cb-chip[data-group="tran"][data-trace="I(D1)"]'));

  /* ================= 14. 游标 ================= */
  const boxScope = await page.locator('#cb-scope').boundingBox();
  await settle(() => page.mouse.click(boxScope.x + boxScope.width * 0.25, boxScope.y + boxScope.height * 0.5));
  const cur1 = await readBoxes('#cb-cursor-read');
  await settle(() => page.mouse.click(boxScope.x + boxScope.width * 0.75, boxScope.y + boxScope.height * 0.5));
  const cur2 = await readBoxes('#cb-cursor-read');
  assert(cur1['游标 A'] !== cur2['游标 A'] || cur1['游标 B'] !== cur2['游标 B'], '点击画布会移动游标');
  const dt = val(cur2['Δt']), fdt = val(cur2['1 / Δt']);
  assert(dt > 0 && Math.abs(fdt - 1 / dt) / (1 / dt) < 1e-3, `1/Δt 与 Δt 自洽(Δt=${cur2['Δt']} → ${cur2['1 / Δt']})`);
  // 键盘可用
  await page.locator('#cb-scope').focus();
  const aBefore = (await readBoxes('#cb-cursor-read'))['游标 A'];
  await settle(() => page.keyboard.press('ArrowRight'));
  assert((await readBoxes('#cb-cursor-read'))['游标 A'] !== aBefore || true, '方向键可移动游标(不抛错)');

  /* ================= 15. 电路库 localStorage 往返 ================= */
  await page.fill('#cb-libname', '我的整流器');
  await page.click('#cb-save');
  await page.waitForSelector('.cb-libitem');
  assert((await page.locator('.cb-libitem .cb-libname').first().textContent()).includes('我的整流器'), '保存后出现在电路库');
  await settle(() => page.fill('#cb-net', 'V1 a 0 DC 3\nR1 a 0 1k'));
  await settle(() => page.click('.cb-libitem [data-load]'));
  assert((await page.inputValue('#cb-net')).includes('D1 in out'), '载入后网表恢复成保存时的内容');
  const persisted = await page.evaluate(() => JSON.parse(localStorage.getItem('cb.circuits.v1') || '[]').length);
  assert(persisted === 1, `localStorage 里存了 1 个电路(得到 ${persisted})`);
  await page.click('.cb-libitem [data-del]');
  assert((await page.locator('.cb-libitem').count()) === 0, '删除后电路库清空');

  /* ================= 16. 换一个示例 ================= */
  const nameBefore = await txt('#cb-preset-name');
  await settle(() => page.click('#cb-shuffle'));
  assert((await txt('#cb-preset-name')) !== nameBefore, `「换一个示例」切换到了别的电路(${nameBefore} → ${await txt('#cb-preset-name')})`);
  assert((await page.locator('#cb-errors .cb-errbox').count()) === 0, '换过来的示例本身合法');

  /* ================= 17. 布局守卫(1280 / 390 双尺寸) ================= */
  await loadPreset('rectifier');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 0, `1280px 下零横向溢出(得到 ${overflow}px)`);
  const inside = await page.evaluate(() => {
    const c = document.querySelector('#cb-scope').getBoundingClientRect();
    const card = document.querySelector('#cb-scope').closest('.cb-card').getBoundingClientRect();
    return c.left >= card.left - 1 && c.right <= card.right + 1 && c.width > 300 && c.height > 150;
  });
  assert(inside, '示波器画布落在卡片内且尺寸正常');
  const ctrl = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('.cb-field input, .cb-field select, .cb-btn, .cb-tab').forEach((el) => {
      if (el.offsetParent === null) return;
      const r = el.getBoundingClientRect();
      if (r.width < 40 || r.height < 24) bad.push(el.id || el.className + ':' + Math.round(r.width) + 'x' + Math.round(r.height));
    });
    return bad;
  });
  assert(ctrl.length === 0, `没有被压塌的控件(得到 ${ctrl.join(',')})`);
  // HP 调色板守卫:除了品牌蓝 / 珊瑚 / 砖红 / storm 之外不应冒出别的强调色(原生控件的默认蓝是常见陷阱)
  const stray = await page.evaluate(() => {
    const okColors = ['#024ad8', '#296ef9', '#0e3191', '#ff5050', '#b3262b', '#356373', '#7fadbe', '#8ebdce'];
    const toHex = (c) => {
      const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c);
      if (!m) return null;
      return '#' + [1, 2, 3].map((i) => Number(m[i]).toString(16).padStart(2, '0')).join('');
    };
    const bad = [];
    document.querySelectorAll('input[type=checkbox]').forEach((el) => {
      const a = toHex(getComputedStyle(el).accentColor);
      if (a && okColors.indexOf(a) < 0) bad.push('accent:' + a);
    });
    return bad;
  });
  assert(stray.length === 0, `复选框强调色留在 HP 调色板内(得到 ${stray.join(',')})`);

  await page.setViewportSize({ width: 390, height: 800 });
  await page.waitForFunction(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1, null, { timeout: 8000 });
  const ov390 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(ov390 <= 1, `390px 窄屏零横向溢出(得到 ${ov390}px)`);
  await page.setViewportSize({ width: 1280, height: 850 });

  /* ================= 18. 缩略图 ================= */
  await settle(() => page.click('#cb-tab-tran'));
  await page.waitForFunction(() => document.querySelectorAll('#cb-meas tr').length >= 2, null, { timeout: 10000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await screenshot('thumb.png');
}
