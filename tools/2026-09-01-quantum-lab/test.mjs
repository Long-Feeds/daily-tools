// 量子线路实验室 —— 真实浏览器集成测试。
// 真的点门、放门、跑采样，并断言算出来的振幅 / 概率 / 布洛赫读数是对的；
// 另带四类结构守卫：[hidden] 计算样式、逐 tab 控件尺寸、逐视口横向溢出、
// 门速查表逐行「广告了就必须真能用」。
export default async function ({ page, toolURL, screenshot, assert: rawAssert }) {
  let nAssert = 0;
  const assert = (cond, msg) => { nAssert++; return rawAssert(cond, msg); };
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#ql-svg rect.ql-cell');

  const TABS = ['lab', 'qasm', 'presets', 'saved', 'about'];
  const RVIEWS = ['amp', 'prob', 'bloch', 'matrix', 'shots'];
  const goTab = async (t) => { await page.click('#ql-tab-' + t); await page.waitForFunction((x) => !document.getElementById('ql-panel-' + x).hidden, t); };
  const goView = async (v) => { await page.click('#ql-rt-' + v); await page.waitForFunction((x) => !document.getElementById('ql-view-' + x).hidden, v); };
  const loadPreset = async (id) => {
    await goTab('presets');
    await page.click('#ql-load-' + id);
    await page.waitForFunction(() => !document.getElementById('ql-panel-lab').hidden);
  };
  const ampRow = async (basis) => {
    const row = page.locator(`#ql-amp-tbl tr[data-basis="${basis}"] td`);
    return (await row.allTextContents()).map((s) => s.trim());
  };
  const num = (s) => Number(String(s).replace(/[%°]/g, ''));

  // ============================ 1. 返回链接 + 首屏 ============================
  const back = page.locator('a[href="../../"]');
  assert((await back.count()) >= 1, '页面顶部必须有「返回工具集」链接');
  assert(/返回工具集/.test((await back.first().textContent()) || ''), '返回链接文案正确');

  // ============================ 2. 贝尔态：振幅是真算出来的 ============================
  await loadPreset('bell');
  await goView('amp');
  let r00 = await ampRow('00');
  let r11 = await ampRow('11');
  assert(r00.length === 4, `贝尔态应有 |00> 行（拿到 ${JSON.stringify(r00)}）`);
  assert(Math.abs(num(r00[1]) - 0.7071) < 1e-3, `|00> 振幅应为 0.7071，实际 ${r00[1]}`);
  assert(Math.abs(num(r00[2]) - 50) < 1e-3, `|00> 概率应为 50%，实际 ${r00[2]}`);
  assert(Math.abs(num(r11[1]) - 0.7071) < 1e-3, `|11> 振幅应为 0.7071，实际 ${r11[1]}`);
  assert((await page.locator('#ql-amp-tbl tbody tr').count()) === 2, '贝尔态默认只列出 2 个非零基态');
  assert((await ampRow('01')).length === 0, '|01> 振幅为 0，默认不该出现');

  // 勾「显示全部」后 4 行都在
  await page.check('#ql-amp-all');
  await page.waitForFunction(() => document.querySelectorAll('#ql-amp-tbl tbody tr').length === 4);
  const r01 = await ampRow('01');
  assert(Math.abs(num(r01[2])) < 1e-6, `|01> 概率应为 0，实际 ${r01[2]}`);
  await page.uncheck('#ql-amp-all');
  await page.waitForFunction(() => document.querySelectorAll('#ql-amp-tbl tbody tr').length === 2);

  // ============================ 3. 布洛赫球：最大纠缠 ============================
  await goView('bloch');
  const blochOf = async (q, k) => (await page.locator(`.ql-bloch[data-q="${q}"] dd[data-k="${k}"]`).textContent()).trim();
  assert((await page.locator('.ql-bloch').count()) === 2, '2 比特线路应画 2 个布洛赫球');
  for (const q of [0, 1]) {
    assert(Math.abs(num(await blochOf(q, 'entropy')) - 1) < 1e-3, `贝尔态 q${q} 纠缠熵应为 1.000，实际 ${await blochOf(q, 'entropy')}`);
    assert(Math.abs(num(await blochOf(q, 'purity')) - 0.5) < 1e-3, `贝尔态 q${q} 纯度应为 0.5`);
    for (const k of ['x', 'y', 'z']) assert(Math.abs(num(await blochOf(q, k))) < 1e-3, `贝尔态 q${q} <${k}> 应为 0`);
    assert(Math.abs(num(await blochOf(q, 'p1')) - 50) < 1e-3, `贝尔态 q${q} P(1) 应为 50%`);
  }
  assert((await page.locator('.ql-bloch .ql-sphere').count()) === 2, '每个比特画一个球');

  // ============================ 4. Grover：一次迭代必中 ============================
  await loadPreset('grover');
  await goView('prob');
  const bars = await page.locator('#ql-prob-bars .ql-bar-row').count();
  assert(bars === 1, `Grover 一次迭代后应只剩 1 个非零基态，实际 ${bars} 个`);
  const gKey = (await page.locator('#ql-prob-bars .ql-bar-key').first().textContent()).trim();
  const gVal = (await page.locator('#ql-prob-bars .ql-bar-val').first().textContent()).trim();
  assert(gKey === '|11>', `Grover 应把振幅全集中到 |11>，实际 ${gKey}`);
  assert(Math.abs(num(gVal) - 100) < 1e-3, `Grover |11> 概率应为 100%，实际 ${gVal}`);

  // 条形必须真的画出来：span 是 inline 时 width 无效，整条会不可见（DOM 断言对此失明）
  const grovBar = await page.evaluate(() => {
    const fill = document.querySelector('#ql-prob-bars .ql-bar-fill');
    const track = document.querySelector('#ql-prob-bars .ql-bar-track');
    return { f: fill.getBoundingClientRect().width, t: track.getBoundingClientRect().width, disp: getComputedStyle(fill).display };
  });
  assert(grovBar.disp !== 'inline', `.ql-bar-fill 的 display 不能是 inline（inline 会让 width 失效），实际 ${grovBar.disp}`);
  assert(grovBar.t > 40, `条形轨道应有宽度，实际 ${grovBar.t}`);
  assert(Math.abs(grovBar.f / grovBar.t - 1) < 0.02, `100% 的条应铺满轨道，实际 ${(grovBar.f / grovBar.t * 100).toFixed(1)}%`);

  // QFT：8 个基态各 12.5%，条形宽度也要按比例
  await loadPreset('qft3');
  await goView('prob');
  await page.waitForFunction(() => document.querySelectorAll('#ql-prob-bars .ql-bar-row').length === 8);
  const qftBars = await page.evaluate(() => [...document.querySelectorAll('#ql-prob-bars .ql-bar-row')].map((r) => ({
    val: Number(r.querySelector('.ql-bar-val').textContent.replace('%', '')),
    ratio: r.querySelector('.ql-bar-fill').getBoundingClientRect().width / r.querySelector('.ql-bar-track').getBoundingClientRect().width
  })));
  assert(qftBars.length === 8, `QFT 后应有 8 个等概率基态，实际 ${qftBars.length}`);
  for (const b of qftBars) {
    assert(Math.abs(b.val - 12.5) < 1e-3, `QFT 每个基态应为 12.5%，实际 ${b.val}`);
    assert(Math.abs(b.ratio - 0.125) < 0.02, `12.5% 的条宽应占轨道 12.5%，实际 ${(b.ratio * 100).toFixed(1)}%`);
  }

  // ============================ 5. W 态：三项各 1/3 ============================
  await loadPreset('wstate');
  await goView('amp');
  for (const b of ['001', '010', '100']) {
    const row = await ampRow(b);
    assert(row.length === 4, `W 态应含 |${b}>`);
    assert(Math.abs(num(row[2]) - 100 / 3) < 1e-2, `W 态 |${b}> 概率应为 33.33%，实际 ${row[2]}`);
  }
  assert((await page.locator('#ql-amp-tbl tbody tr').count()) === 3, 'W 态只有 3 个非零基态');

  // ============================ 6. 酉矩阵 ============================
  await loadPreset('bell');
  await goView('matrix');
  await page.waitForSelector('#ql-mat-tbl');
  const cell = async (r, c) => (await page.locator(`#ql-mat-tbl td[data-r="${r}"][data-c="${c}"]`).textContent()).trim();
  // 贝尔线路 U 的第一列 = (1/√2)(|00> + |11>)
  assert(Math.abs(num(await cell(0, 0)) - 0.71) < 0.02, `U[0][0] 应约 0.71，实际 "${await cell(0, 0)}"`);
  assert(Math.abs(num(await cell(3, 0)) - 0.71) < 0.02, `U[3][0] 应约 0.71，实际 "${await cell(3, 0)}"`);
  assert((await cell(1, 0)) === '', `U[1][0] 应为 0（空格子），实际 "${await cell(1, 0)}"`);
  assert((await page.locator('#ql-mat-tbl td').count()) === 16, '2 比特酉矩阵是 4×4 = 16 格');

  // ============================ 7. 采样：与精确概率一致 ============================
  await goView('shots');
  await page.fill('#ql-shots', '4096');
  await page.fill('#ql-seed', '11');
  await page.click('#ql-run-shots');
  await page.waitForFunction(() => {
    const t = document.querySelectorAll('#ql-shot-tbl tbody tr');
    return t.length > 0 && !/—/.test(t[0].children[1].textContent);
  });
  const shotRows = await page.locator('#ql-shot-tbl tbody tr').evaluateAll((rows) =>
    rows.map((r) => ({
      key: r.getAttribute('data-key'),
      count: Number(r.children[1].textContent.trim()),
      exact: Number(r.children[3].textContent.replace('%', ''))
    })));
  assert(shotRows.length === 2, `贝尔态只有 2 种测量结果，实际 ${shotRows.length}`);
  assert(shotRows.every((r) => r.key === '00' || r.key === '11'), `贝尔态不该出现 01/10，实际 ${shotRows.map((r) => r.key).join(',')}`);
  const total = shotRows.reduce((s, r) => s + r.count, 0);
  assert(total === 4096, `采样次数应合计 4096，实际 ${total}`);
  for (const r of shotRows) {
    assert(Math.abs(r.exact - 50) < 1e-3, `贝尔态 ${r.key} 的精确概率应为 50%，实际 ${r.exact}`);
    assert(Math.abs(r.count / 4096 - 0.5) < 0.04, `${r.key} 的采样频率应接近 50%，实际 ${(r.count / 4096 * 100).toFixed(2)}%`);
  }

  // 隐形传态：中途测量 + 经典条件 → 四个结果各 25%
  await loadPreset('teleport');
  await goView('shots');
  const tp = await page.locator('#ql-shot-tbl tbody tr').evaluateAll((rows) =>
    rows.map((r) => ({ key: r.getAttribute('data-key'), exact: Number(r.children[3].textContent.replace('%', '')) })));
  assert(tp.length === 4, `隐形传态应有 4 个经典结果，实际 ${tp.length}`);
  for (const r of tp) assert(Math.abs(r.exact - 25) < 1e-3, `隐形传态 ${r.key} 应为 25%，实际 ${r.exact}`);

  // ============================ 8. 真的动手放门 ============================
  await goTab('lab');
  await page.selectOption('#ql-nq', '2');
  await page.click('#ql-clear');
  await goView('amp');
  await page.waitForFunction(() => document.querySelectorAll('#ql-amp-tbl tbody tr').length === 1);
  let r0 = await ampRow('00');
  assert(Math.abs(num(r0[2]) - 100) < 1e-6, `空线路应是 |00> 100%，实际 ${r0[2]}`);

  // 放一个 X 到 q0
  await page.click('#ql-gate-x');
  await page.click('#ql-cell-0-0');
  await page.waitForFunction(() => document.querySelector('#ql-amp-tbl tbody tr')?.getAttribute('data-basis') === '01');
  assert(Math.abs(num((await ampRow('01'))[2]) - 100) < 1e-6, 'X 作用后应是 |01> 100%');

  // 再放 H 到 q1 → 两个基态各 50%
  await page.click('#ql-gate-h');
  await page.click('#ql-cell-1-1');
  await page.waitForFunction(() => document.querySelectorAll('#ql-amp-tbl tbody tr').length === 2);
  for (const b of ['01', '11']) {
    assert(Math.abs(num((await ampRow(b))[2]) - 50) < 1e-3, `H 之后 |${b}> 应为 50%`);
  }

  // 放一个 CX（先控制位、后目标位）→ 变成贝尔态形态
  await page.click('#ql-gate-cx');
  assert(/正在放置|已选/.test((await page.locator('#ql-hint').textContent()) || ''), '选中 cx 后应给出放置提示');
  await page.click('#ql-cell-1-2');
  assert(/正在放置/.test((await page.locator('#ql-hint').textContent()) || ''), '点了第一个比特后应提示还差一个');
  await page.click('#ql-cell-0-2');
  await page.waitForFunction(() => document.querySelectorAll('#ql-amp-tbl tbody tr').length === 2);
  const after = (await page.locator('#ql-amp-tbl tbody tr').evaluateAll((r) => r.map((x) => x.getAttribute('data-basis')))).sort();
  assert(after.join(',') === '01,10', `X→H→CX 后应得到 |01> 与 |10>，实际 ${after.join(',')}`);

  // 门数统计跟上了
  const stat = (await page.locator('#ql-stat').textContent()) || '';
  assert(/门数 3/.test(stat), `统计条应显示 3 个门，实际 "${stat.trim()}"`);

  // 点已有的门 = 删除
  const gBefore = await page.locator('#ql-svg rect.ql-gbox').count();
  await page.locator('#ql-svg rect.ql-gbox').first().click();
  await page.waitForFunction((n) => document.querySelectorAll('#ql-svg rect.ql-gbox').length === n - 1, gBefore);
  assert(/门数 2/.test((await page.locator('#ql-stat').textContent()) || ''), '删掉一个门后统计应变成 2');

  // 撤销把它加回来
  await page.click('#ql-undo');
  await page.waitForFunction((n) => document.querySelectorAll('#ql-svg rect.ql-gbox').length === n, gBefore);
  assert(/门数 3/.test((await page.locator('#ql-stat').textContent()) || ''), '撤销后应恢复到 3 个门');

  // 参数门：RZ(pi/2) 后 |+> 的相位差应为 90°
  await page.click('#ql-clear');
  await page.click('#ql-gate-h');
  await page.click('#ql-cell-0-0');
  await page.click('#ql-gate-rz');
  await page.fill('#ql-param0', 'pi/2');
  await page.click('#ql-cell-0-1');
  await page.waitForFunction(() => document.querySelectorAll('#ql-amp-tbl tbody tr').length === 2);
  const ph0 = num((await ampRow('00'))[3]);
  const ph1 = num((await ampRow('01'))[3]);
  assert(Math.abs(ph0 - (-45)) < 0.2, `rz(pi/2) 后 |00> 相位应为 -45°，实际 ${ph0}`);
  assert(Math.abs(ph1 - 45) < 0.2, `rz(pi/2) 后 |01> 相位应为 +45°，实际 ${ph1}`);
  assert((await page.locator('#ql-svg text.ql-gparam').count()) >= 1, 'RZ 门下方应标出参数');
  const pTxt = (await page.locator('#ql-svg text.ql-gparam').first().textContent()).trim();
  assert(pTxt === 'π/2', `参数应显示成 π/2，实际 "${pTxt}"`);

  // 非法参数要报错而不是静默算错
  await page.fill('#ql-param0', 'pi/');
  await page.click('#ql-cell-0-3');
  assert((await page.locator('#ql-lab-err .ql-err').count()) >= 1, '非法参数表达式应给出错误提示');
  await page.fill('#ql-param0', 'pi/4');

  // ============================ 9. QASM 双向 ============================
  await goTab('qasm');
  let src = await page.inputValue('#ql-qasm');
  assert(/OPENQASM 2\.0;/.test(src), 'QASM 应有版本头');
  assert(/qreg q\[2\];/.test(src), `QASM 应声明 2 个比特，实际:\n${src}`);
  assert(/rz\(pi\/2\) q\[0\];/.test(src), `QASM 应含 rz(pi/2)，实际:\n${src}`);

  const GHZ = 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[3];\ncreg c[3];\nh q[0];\ncx q[0],q[1];\ncx q[1],q[2];\n';
  await page.fill('#ql-qasm', GHZ);
  await page.click('#ql-qasm-import');
  await page.waitForSelector('#ql-qasm-msg .ql-okline');
  assert(/导入成功：3 个比特/.test((await page.locator('#ql-qasm-msg').textContent()) || ''), 'GHZ 导入应成功');
  await goTab('lab');
  await goView('amp');
  await page.waitForFunction(() => document.querySelectorAll('#ql-amp-tbl tbody tr').length === 2);
  for (const b of ['000', '111']) {
    assert(Math.abs(num((await ampRow(b))[2]) - 50) < 1e-3, `GHZ |${b}> 应为 50%`);
  }
  assert((await page.locator('#ql-svg rect.ql-cell[data-q="2"]').count()) > 0, '导入 3 比特后线路图应有 q2 这一行');

  // 导出再导入必须还是同一个态（往返）
  await goTab('qasm');
  await page.click('#ql-qasm-export');
  const exported = await page.inputValue('#ql-qasm');
  await page.click('#ql-qasm-import');
  await page.waitForSelector('#ql-qasm-msg .ql-okline');
  await goTab('lab');
  await page.waitForFunction(() => document.querySelectorAll('#ql-amp-tbl tbody tr').length === 2);
  for (const b of ['000', '111']) {
    assert(Math.abs(num((await ampRow(b))[2]) - 50) < 1e-3, `QASM 往返后 |${b}> 仍应为 50%`);
  }

  // 非法 QASM 要报错并指出行号
  await goTab('qasm');
  await page.fill('#ql-qasm', 'OPENQASM 2.0;\nqreg q[2];\nh q[9];\nfoo q[0];\n');
  await page.click('#ql-qasm-import');
  await page.waitForSelector('#ql-qasm-msg .ql-err');
  const errTxt = (await page.locator('#ql-qasm-msg').textContent()) || '';
  assert((await page.locator('#ql-qasm-msg .ql-err').count()) === 2, `两处错误应各报一条，实际 ${await page.locator('#ql-qasm-msg .ql-err').count()} 条`);
  assert(/第 3 行/.test(errTxt) && /越界/.test(errTxt), `应报第 3 行下标越界，实际 "${errTxt}"`);
  assert(/第 4 行/.test(errTxt) && /不支持的门/.test(errTxt), `应报第 4 行未知门，实际 "${errTxt}"`);
  // 报错时不能把线路改坏
  await goTab('lab');
  assert((await page.locator('#ql-amp-tbl tbody tr').count()) === 2, '导入失败时不应改动当前线路');

  // ============================ 10. 我的线路（localStorage） ============================
  await goTab('saved');
  await page.fill('#ql-save-name', '测试用 GHZ');
  await page.click('#ql-save');
  await page.waitForSelector('#ql-saved-list .ql-saved-item');
  assert((await page.locator('#ql-saved-list .ql-saved-item').count()) === 1, '保存后列表里应有 1 条');
  assert(/3 比特 · 3 操作/.test((await page.locator('.ql-saved-meta').first().textContent()) || ''), '保存条目应记录规模');
  await page.click('#ql-save');   // 空名字
  assert((await page.locator('#ql-save-msg .ql-err').count()) === 1, '空名字保存应报错');
  await page.locator('button[data-act="load"]').first().click();
  await page.waitForFunction(() => !document.getElementById('ql-panel-lab').hidden);
  assert((await page.locator('#ql-amp-tbl tbody tr').count()) === 2, '载入保存的线路后读数应恢复');
  await goTab('saved');
  await page.locator('button[data-act="del"]').first().click();
  await page.waitForFunction(() => document.querySelectorAll('#ql-saved-list .ql-saved-item').length === 0);
  assert(/还没有保存过/.test((await page.locator('#ql-saved-sub').textContent()) || ''), '删除后应回到空状态');

  // ============================ 11. 能力清单守卫：表里列的门必须真能用 ============================
  await goTab('about');
  const listed = await page.locator('#ql-gate-table tbody tr').evaluateAll((rows) =>
    rows.map((r) => ({ id: r.getAttribute('data-gate'), cells: [...r.children].map((c) => c.textContent.trim()) })));
  assert(listed.length >= 30, `门速查表至少列出 30 个门，实际 ${listed.length}`);
  const dead = await page.evaluate((rows) => {
    const bad = [];
    for (const row of rows) {
      const g = row.id, G = window.QL.GATES[g];
      if (!G) { bad.push(g + '：目录里没有这个门'); continue; }
      // 用表里公布的 QASM 写法真的解析一遍
      const qasmCell = row.cells[4];
      const n = Math.max(G.kind === 'barrier' ? 1 : window.QL.gateArity(g), 1);
      const src = 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[' + n + '];\ncreg c[' + n + '];\n' + qasmCell + '\n';
      const res = window.QL.parseQasm(src);
      if (res.errors.length) { bad.push(g + '：速查表里的 QASM 写法解析失败 ' + JSON.stringify(res.errors)); continue; }
      if (res.circuit.ops.length < 1) { bad.push(g + '：解析后没有产生任何操作'); continue; }
      const got = res.circuit.ops[0].g;
      if (got !== g) { bad.push(g + '：速查表的写法解析成了 ' + got); continue; }
      // 真的跑一遍，态向量必须仍归一
      const st = window.QL.runUnitary(res.circuit);
      if (Math.abs(window.QL.norm2(st) - 1) > 1e-9) bad.push(g + '：作用后态向量未归一');
      // 比特数 / 参数个数两列必须与实现一致
      const nq = G.kind === 'barrier' ? '全部' : String(window.QL.gateArity(g));
      if (row.cells[2] !== nq) bad.push(g + '：速查表写比特数 ' + row.cells[2] + '，实现是 ' + nq);
      const np = G.np === 0 ? '—' : ['θ', 'φ', 'λ'].slice(0, G.np).join(', ');
      if (row.cells[3] !== np) bad.push(g + '：速查表写参数 ' + row.cells[3] + '，实现是 ' + np);
    }
    return bad;
  }, listed);
  assert(dead.length === 0, `速查表里有「公布了但不能用」的门：\n  ${dead.join('\n  ')}`);
  const paletteIds = await page.locator('#ql-palette .ql-gate').evaluateAll((b) => b.map((x) => x.getAttribute('data-gate')));
  const missing = listed.map((l) => l.id).filter((id) => !paletteIds.includes(id));
  assert(missing.length === 0, `速查表里的门都应能在门面板里点到，缺：${missing.join(',')}`);

  // 算法库里每条线路都要能真的载入并算出结果
  const presetIds = await page.locator('.ql-preset').evaluateAll((els) => els.map((e) => e.getAttribute('data-preset')));
  assert(presetIds.length >= 10, `算法库至少 10 条线路，实际 ${presetIds.length}`);
  const presetBad = await page.evaluate(() => {
    const bad = [];
    for (const p of window.QL.PRESETS) {
      const errs = window.QL.validate(p.circuit);
      if (errs.length) { bad.push(p.id + '：' + errs.join('；')); continue; }
      const st = window.QL.runUnitary(p.circuit);
      if (Math.abs(window.QL.norm2(st) - 1) > 1e-9) bad.push(p.id + '：末态未归一');
      let tot = 0;
      for (const v of window.QL.exactOutcomes(p.circuit).dist.values()) tot += v;
      if (Math.abs(tot - 1) > 1e-9) bad.push(p.id + '：结果分布概率和为 ' + tot);
      const rt = window.QL.parseQasm(window.QL.printQasm(p.circuit));
      if (rt.errors.length) bad.push(p.id + '：导出的 QASM 无法回读 ' + JSON.stringify(rt.errors));
    }
    return bad;
  });
  assert(presetBad.length === 0, `算法库线路有问题：\n  ${presetBad.join('\n  ')}`);

  // ============================ 12. [hidden] 守卫（断计算样式，不是断属性） ============================
  await goTab('lab');
  for (const t of TABS) {
    const disp = await page.evaluate((x) => getComputedStyle(document.getElementById('ql-panel-' + x)).display, t);
    if (t === 'lab') assert(disp !== 'none', 'lab 面板此时应可见');
    else assert(disp === 'none', `切到 lab 时 ${t} 面板的计算样式 display 应为 none，实际 ${disp}`);
  }
  await goView('amp');
  for (const v of RVIEWS) {
    const disp = await page.evaluate((x) => getComputedStyle(document.getElementById('ql-view-' + x)).display, v);
    if (v === 'amp') assert(disp !== 'none', '振幅视图此时应可见');
    else assert(disp === 'none', `切到振幅视图时 ${v} 的计算样式 display 应为 none，实际 ${disp}`);
  }
  // 参数输入框：无参门时必须真的藏起来
  await page.click('#ql-gate-h');
  assert((await page.evaluate(() => getComputedStyle(document.getElementById('ql-param-wrap')).display)) === 'none',
    '选中 h（无参数）时参数输入框应真的不可见');
  await page.click('#ql-gate-u');
  for (const w of ['ql-param-wrap', 'ql-param-wrap1', 'ql-param-wrap2']) {
    assert((await page.evaluate((x) => getComputedStyle(document.getElementById(x)).display, w)) !== 'none',
      `选中 u（3 参数）时 ${w} 应可见`);
  }
  await page.click('#ql-gate-rz');
  assert((await page.evaluate(() => getComputedStyle(document.getElementById('ql-param-wrap1')).display)) === 'none',
    '选中 rz（1 参数）时第二个参数框应不可见');
  await page.click('#ql-gate-h');

  // ============================ 13. 逐 tab 控件尺寸守卫 ============================
  let scanned = 0;
  for (const t of TABS) {
    await goTab(t);
    const views = t === 'lab' ? RVIEWS : [null];
    for (const v of views) {
      if (v) await goView(v);
      const bad = await page.evaluate(() => {
        const out = [];
        let n = 0;
        for (const el of document.querySelectorAll('input,select,button,textarea')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;   // 在隐藏面板里，交给它自己那一轮扫
          n++;
          const tag = el.tagName.toLowerCase();
          const isCheck = tag === 'input' && el.type === 'checkbox';
          const minW = isCheck ? 18 : (tag === 'button' ? 52 : 100);
          const minH = 18;
          if (r.width < minW - 0.5) out.push(`${tag}#${el.id || el.className} 宽 ${r.width.toFixed(1)} < ${minW}`);
          if (r.height < minH - 0.5) out.push(`${tag}#${el.id || el.className} 高 ${r.height.toFixed(1)} < ${minH}`);
        }
        return { out, n };
      });
      scanned += bad.n;
      assert(bad.out.length === 0, `控件塌缩（${t}${v ? '/' + v : ''}）：${bad.out.join(' | ')}`);
    }
  }
  assert(scanned >= 120, `逐 tab 累计应扫到足够多的控件（防止一个都没扫到也算绿），实际 ${scanned}`);

  // legend 一律不许 float（2026-08-07 教训）
  const floatedLegend = await page.evaluate(() =>
    [...document.querySelectorAll('legend')].filter((l) => getComputedStyle(l).float !== 'none').length);
  assert(floatedLegend === 0, 'legend 不允许 float');

  // th / dt / label 不许 uppercase（单位符号会被改写成错字）
  const upper = await page.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll('th,dt,label')) {
      if (getComputedStyle(el).textTransform === 'uppercase') bad.push(el.tagName + ':' + el.textContent.trim().slice(0, 20));
    }
    for (const el of document.querySelectorAll('body *')) {
      if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(el.tagName)) continue;
      if (el.childElementCount !== 0) continue;
      if (!el.getBoundingClientRect().width) continue;      // 只看真的渲染出来的文字
      const t = el.textContent || '';
      if (/\b(HZ|KHZ|DBFS|DB|PI|RAD)\b/.test(t)) bad.push('文本被改写: ' + t.trim().slice(0, 30));
    }
    return bad;
  });
  assert(upper.length === 0, `不该有 uppercase 的标签/被改写的单位：${upper.join(' | ')}`);

  // 渲染出来的文字里不许出现没解开的 HTML 实体（textContent 里手写 &gt; 会原样显示）
  for (const t of TABS) {
    await goTab(t);
    const views = t === 'lab' ? RVIEWS : [null];
    for (const v of views) {
      if (v) await goView(v);
      const ents = await page.evaluate(() => {
        const bad = [];
        for (const el of document.querySelectorAll('body *')) {
          if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(el.tagName)) continue;
          if (el.childElementCount !== 0) continue;
          if (!el.getBoundingClientRect().width) continue;
          const m = (el.textContent || '').match(/&(gt|lt|amp|quot|#\d+);/);
          if (m) bad.push(m[0] + ' 出现在「' + el.textContent.trim().slice(0, 40) + '」');
        }
        return bad;
      });
      assert(ents.length === 0, `${t}${v ? '/' + v : ''} 里有未解开的 HTML 实体：${ents.join(' | ')}`);
    }
  }

  // 酉矩阵三档显示模式：格子里的字不能宽过格子本身
  await goTab('lab');
  for (const [pid, mode, nCell] of [['bell', 'full', 16], ['qft3', 'mag', 64], ['deutsch', 'color', 256]]) {
    await loadPreset(pid);
    await goView('matrix');
    await page.waitForSelector(`#ql-mat-tbl[data-mode="${mode}"]`);
    const info = await page.evaluate(() => {
      const tbl = document.getElementById('ql-mat-tbl');
      const cells = [...tbl.querySelectorAll('td')];
      const over = [];
      for (const td of cells) {
        const sp = td.querySelector('.ql-mcell');
        if (sp && sp.scrollWidth - sp.clientWidth > 1) over.push(sp.textContent);
      }
      return { n: cells.length, over, titled: cells.filter((t) => t.getAttribute('title')).length };
    });
    assert(info.n === nCell, `${pid} 的酉矩阵应有 ${nCell} 格，实际 ${info.n}`);
    assert(info.over.length === 0, `${pid}（${mode} 模式）有 ${info.over.length} 个格子文字被切：${info.over.slice(0, 4).join(',')}`);
    assert(info.titled === nCell, `${pid} 每个格子都该带精确值的悬停提示，实际 ${info.titled}/${nCell}`);
  }
  // 8×8 模式写的是模长
  await loadPreset('qft3');
  await goView('matrix');
  const magCell = (await page.locator('#ql-mat-tbl td[data-r="0"][data-c="0"]').textContent()).trim();
  assert(Math.abs(Number(magCell) - 0.35) < 0.01, `QFT 矩阵首格模长应约 0.35，实际 "${magCell}"`);

  // ============================ 14. 线路图几何：文字不越格、不互相重叠 ============================
  await goTab('lab');
  await loadPreset('teleport');
  const geo = await page.evaluate(() => {
    const svg = document.getElementById('ql-svg');
    const sb = svg.getBoundingClientRect();
    const bad = [];
    const boxes = [];
    for (const t of svg.querySelectorAll('text')) {
      const r = t.getBoundingClientRect();
      if (r.width === 0) continue;
      if (r.left < sb.left - 1 || r.right > sb.right + 1 || r.top < sb.top - 1 || r.bottom > sb.bottom + 1) {
        bad.push(`"${t.textContent}" 越出画布`);
      }
      boxes.push({ t: t.textContent, r });
      // 门上的参数/标签不能宽过一格（52px）
      if (t.classList.contains('ql-gparam') || t.classList.contains('ql-gtext')) {
        if (r.width > 52) bad.push(`"${t.textContent}" 宽 ${r.width.toFixed(1)} 超过列宽 52`);
      }
    }
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i].r, b = boxes[j].r;
        const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (ox > 1 && oy > 1) bad.push(`"${boxes[i].t}" 与 "${boxes[j].t}" 视觉重叠 ${ox.toFixed(1)}x${oy.toFixed(1)}`);
      }
    }
    return { bad, n: boxes.length };
  });
  assert(geo.n >= 10, `线路图上应有足够多的文字标签，实际 ${geo.n}`);
  assert(geo.bad.length === 0, `线路图文字有问题：${geo.bad.slice(0, 6).join(' | ')}`);

  // 布洛赫球里的读数不许溢出它的卡片
  await goView('bloch');
  const blochBad = await page.evaluate(() => {
    const bad = [];
    for (const card of document.querySelectorAll('.ql-bloch')) {
      const cr = card.getBoundingClientRect();
      for (const kid of card.querySelectorAll('svg,dd,dt,h4')) {
        const r = kid.getBoundingClientRect();
        if (r.width === 0) continue;
        if (r.left < cr.left - 1 || r.right > cr.right + 1 || r.top < cr.top - 1 || r.bottom > cr.bottom + 1) {
          bad.push(`${kid.tagName} "${kid.textContent.trim().slice(0, 12)}" 越出布洛赫卡片`);
        }
      }
    }
    return bad;
  });
  assert(blochBad.length === 0, `布洛赫卡片内有元素越界：${blochBad.slice(0, 5).join(' | ')}`);

  // ============================ 15. 逐视口 × 逐 tab 横向溢出守卫 ============================
  for (const vw of [390, 768, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of TABS) {
      await goTab(t);
      const views = t === 'lab' ? ['amp', 'bloch', 'matrix', 'shots'] : [null];
      for (const v of views) {
        if (v) await goView(v);
        const res = await page.evaluate(() => {
          const de = document.documentElement;
          const over = de.scrollWidth - de.clientWidth;
          const guilty = [];
          if (over > 1) {
            for (const el of document.querySelectorAll('body *')) {
              const r = el.getBoundingClientRect();
              if (r.width > 0 && r.right > de.clientWidth + 1) {
                guilty.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}@right=${r.right.toFixed(0)}`);
              }
              if (guilty.length > 6) break;
            }
          }
          return { over, guilty };
        });
        assert(res.over <= 1, `${vw}px / ${t}${v ? '/' + v : ''} 横向溢出 ${res.over}px，越界元素：${res.guilty.join(', ')}`);
      }
    }
  }
  await page.setViewportSize({ width: 1280, height: 850 });

  // ============================ 16. 卡片里的表格不许被切掉 ============================
  await goTab('lab');
  await goView('matrix');
  const clipped = await page.evaluate(() =>
    [...document.querySelectorAll('.ql-scroll')].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && el.scrollWidth - el.clientWidth > 0 && getComputedStyle(el).overflowX !== 'auto';
    }).length);
  assert(clipped === 0, '会横向溢出的容器必须自己能滚动');

  // ============================ 17. 收尾：截图用的漂亮状态 ============================
  await loadPreset('ghz');
  await goView('bloch');
  await page.waitForFunction(() => document.querySelectorAll('.ql-bloch').length === 3);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(120);
  await screenshot('thumb.png');
  console.log(`      (quantum-lab: ${nAssert} 条浏览器断言)`);
}
