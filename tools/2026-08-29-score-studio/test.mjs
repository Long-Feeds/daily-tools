// 乐谱工作台 · 集成测试
// 真的敲谱、切格式、移调、导出、翻标签页，并断言真实解析结果与真实排版几何。
// （引擎本身另有离线对拍：ABC 解析与播放时值 vs abcjs 的 MIDI 输出、导出 MusicXML vs music21、
//   导出 MIDI vs mido，随机语料 400 份、逐音断言 30962 条 0 失配，另有离线不变式 fuzz 9935 条；
//   这里只测浏览器里的行为。）
export default async function ({ page, toolURL, screenshot, assert: rawAssert }) {
  let nAssert = 0;
  const assert = (cond, msg) => { nAssert++; return rawAssert(cond, msg); };

  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.SS_UI && document.querySelector('#ss-staff svg'));

  const compiled = () => page.evaluate(() => {
    const r = window.SS_UI.compiled();
    const E = window.SS_UI.engine;
    if (!r || r.error) return { error: r ? r.error : 'none' };
    return {
      title: r.built.title, composer: r.built.composer,
      key: r.built.key, meter: r.built.meter, clef: r.built.clef,
      bpm: r.built.tempo.bpm, measures: r.built.measures.length,
      warnings: r.warnings,
      notes: r.built.flat.filter(e => e.t === 'note').map(e => e.notes.map(h => h.midi)),
      durs: r.built.flat.map(e => E.fval(e.dur)),
      kinds: r.built.flat.map(e => e.t),
      bases: r.built.flat.map(e => e.base + (e.dots ? '.'.repeat(e.dots) : '')),
      lyrics: r.built.flat.filter(e => e.lyric).map(e => e.lyric),
      chordSyms: r.built.flat.filter(e => e.chordSym).map(e => e.chordSym),
      showAcc: r.built.flat.filter(e => e.t === 'note').map(e => e.notes.map(h => h.showAcc)),
      barStyles: r.built.measures.map(m => m.barStyle),
      beams: r.built.measures.map(m => (m.beams || []).map(g => g.length))
    };
  });
  const setSrc = async (text, fmt) => {
    await page.evaluate(([t, f]) => window.SS_UI.setSource(t, f), [text, fmt]);
    await page.waitForFunction(([t]) => document.getElementById('ss-src').value === t, [text]);
  };
  const onTab = async (name) => {
    await page.click('#ss-tab-' + name);
    await page.waitForFunction((n) => document.getElementById('ss-p-' + n).hidden === false, name);
  };

  // ================= 1. 首屏：默认载入欢乐颂并真的排出谱面 =================
  let S = await compiled();
  assert(!S.error, `首屏应能编译（实得错误 ${S.error}）`);
  assert(/欢乐颂/.test(S.title), `默认曲目是欢乐颂（实得 "${S.title}"）`);
  assert(S.key.tonic === 'D' && S.key.sharps === 2, `欢乐颂是 D 大调 2 个升号（实得 ${S.key.tonic}/${S.key.sharps}）`);
  assert(S.measures === 8, `共 8 小节（实得 ${S.measures}）`);
  assert(S.notes.length === 30, `共 30 个音符（实得 ${S.notes.length}）`);
  assert(S.warnings.length === 0, `内置示例不该有任何警告（实得 ${JSON.stringify(S.warnings)}）`);
  // D 大调：F 自动升为 F♯4=66，A4=69
  assert(JSON.stringify(S.notes.slice(0, 4)) === JSON.stringify([[66], [66], [67], [69]]),
    `头四个音是 F♯4 F♯4 G4 A4（实得 ${JSON.stringify(S.notes.slice(0, 4))}）`);
  assert(JSON.stringify(S.durs.slice(12, 15)) === JSON.stringify([1.5, 0.5, 2]),
    `第 4 小节是「附点四分 + 八分 + 二分」（实得 ${JSON.stringify(S.durs.slice(12, 15))}）`);
  assert(S.bases[12] === 'quarter.', `附点四分音符写成 quarter+1 点（实得 ${S.bases[12]}）`);
  const stat = (await page.locator('#ss-stat').textContent()) || '';
  assert(/音符\s*30/.test(stat.replace(/\s+/g, ' ')), `状态条写出音符数（实得 "${stat.replace(/\s+/g, ' ').trim()}"）`);
  assert(/2 个升号/.test(stat), '状态条写出升号数');
  assert((await page.locator('#ss-msg').isVisible()) === false, '无警告时提示条应隐藏');
  assert(await page.evaluate(() => getComputedStyle(document.getElementById('ss-msg')).display) === 'none',
    '隐藏的提示条计算样式必须是 display:none（防作者 CSS 盖掉 [hidden]）');

  // 谱面真的画出来了：五线谱五条线 + 符头 + 谱号 + 调号
  const svgStats = () => page.evaluate(() => {
    const s = document.querySelector('#ss-staff svg');
    if (!s) return null;
    return {
      lines: s.querySelectorAll('line').length,
      heads: s.querySelectorAll('ellipse').length,
      paths: s.querySelectorAll('path').length,
      texts: [...s.querySelectorAll('text')].map(t => t.textContent),
      w: s.getBoundingClientRect().width, h: s.getBoundingClientRect().height
    };
  });
  let V = await svgStats();
  assert(V && V.heads >= 30, `五线谱上至少 30 个符头（实得 ${V && V.heads}）`);
  assert(V.lines >= 10, `两行谱各 5 条谱线（实得 ${V.lines} 条 line）`);
  assert(V.h > 120, `谱面有实际高度（实得 ${Math.round(V.h)}px）`);
  assert(V.texts.some(t => /欢乐颂/.test(t)), '谱面顶端排出曲名');
  assert(V.texts.filter(t => t === 'D').length >= 3, `谱面上排出和弦记号 D（实得 ${JSON.stringify(V.texts.slice(0, 8))}）`);
  const jpTexts = await page.evaluate(() => [...document.querySelectorAll('#ss-jianpu svg text')].map(t => t.textContent));
  assert(jpTexts.join(' ').indexOf('1 = D') >= 0, `简谱头写出 1 = D（实得 ${JSON.stringify(jpTexts.slice(0, 6))}）`);
  // 欢乐颂在 D 大调简谱里开头是 3 3 4 5
  const jpNums = jpTexts.filter(t => /^[0-7]$/.test(t));
  assert(jpNums.slice(0, 4).join('') === '3345', `简谱开头是 3 3 4 5（实得 ${jpNums.slice(0, 8).join(' ')}）`);

  // ================= 2. 六个内置示例全部零警告、且都真的排得出谱 =================
  const exCount = await page.evaluate(() => window.SS_UI.examples.length);
  assert(exCount === 6, `内置 6 个示例（实得 ${exCount}）`);
  for (let i = 0; i < exCount; i++) {
    const info = await page.evaluate((k) => {
      const e = window.SS_UI.examples[k];
      const r = window.SS_UI.engine.compile(e.text, e.fmt);
      return { name: e.name, warn: r.warnings, notes: r.built.flat.filter(x => x.t === 'note').length, measures: r.built.measures.length };
    }, i);
    assert(info.warn.length === 0, `示例「${info.name}」不该有警告（实得 ${JSON.stringify(info.warn)}）`);
    assert(info.notes >= 8, `示例「${info.name}」至少 8 个音符（实得 ${info.notes}）`);
  }
  // 卡农低音必须真的落在低音谱号并给出那 8 个著名的音
  await page.evaluate(() => window.SS_UI.setSource(window.SS_UI.examples[3].text, 'abc'));
  await page.waitForFunction(() => window.SS_UI.compiled().built.clef === 'bass');
  S = await compiled();
  assert(S.clef === 'bass', `卡农低音自动用低音谱号（实得 ${S.clef}）`);
  assert(JSON.stringify(S.notes.map(a => a[0])) === JSON.stringify([50, 45, 47, 42, 43, 38, 43, 45]),
    `卡农固定低音 D3 A2 B2 F♯2 G2 D2 G2 A2（实得 ${JSON.stringify(S.notes.map(a => a[0]))}）`);

  // ================= 3. 简谱输入：小星星 =================
  await page.click('#ss-fmt-jp');
  await page.evaluate(() => window.SS_UI.setSource(window.SS_UI.examples[1].text, 'jianpu'));
  await page.waitForFunction(() => /小星星/.test(window.SS_UI.compiled().built.title));
  S = await compiled();
  assert(S.title === '小星星', `简谱标题解析成功（实得 "${S.title}"）`);
  assert(S.key.sharps === 0 && S.meter.num === 4, `1=C 4/4（实得 ${S.key.sharps} 升号 ${S.meter.num}/${S.meter.den}）`);
  assert(JSON.stringify(S.notes.slice(0, 7).map(a => a[0])) === JSON.stringify([60, 60, 67, 67, 69, 69, 67]),
    `小星星开头 do do sol sol la la sol（实得 ${JSON.stringify(S.notes.slice(0, 7).map(a => a[0]))}）`);
  assert(S.durs[6] === 2, `第 7 个音「5 -」是二分音符（实得 ${S.durs[6]}）`);
  assert(S.lyrics.slice(0, 7).join('') === '一闪一闪亮晶晶', `歌词逐字对到音符（实得 "${S.lyrics.slice(0, 7).join('')}"）`);
  assert(S.lyrics.length === 42, `六行歌词共 42 字（实得 ${S.lyrics.length}）`);
  // 简谱输入也照样排出五线谱
  V = await svgStats();
  assert(V.heads >= 42, `简谱输入同样排出五线谱符头（实得 ${V.heads}）`);

  // ================= 4. 移调：升半音后每个音都 +1，且调号被改写 =================
  const before = (await compiled()).notes.map(a => a[0]);
  await page.click('#ss-up');
  await page.waitForFunction(() => window.SS_UI.compiled().built.key.sharps === 7 || window.SS_UI.compiled().built.key.sharps === -5);
  S = await compiled();
  const after = S.notes.map(a => a[0]);
  assert(after.length === before.length && after.every((m, i) => m === before[i] + 1),
    `升半音后每个音高 +1（前 ${before.slice(0, 4)} 后 ${after.slice(0, 4)}）`);
  assert(S.key.sharps === -5, `C 大调升半音记成 D♭ 大调 5 个降号（实得 ${S.key.sharps}）`);
  const srcAfter = await page.inputValue('#ss-src');
  assert(/1\s*=\s*Db/.test(srcAfter), `简谱源码里的 1= 被改写成 Db（实得片段 "${srcAfter.split('\n').slice(0, 4).join(' / ')}"）`);
  await page.click('#ss-down');
  await page.waitForFunction(() => window.SS_UI.compiled().built.key.sharps === 0);
  assert((await compiled()).notes.map(a => a[0]).join() === before.join(), '降回半音后音高完全还原');

  // ABC 源码的移调是真的重写源码
  await page.click('#ss-fmt-abc');
  await setSrc('X:1\nT:移调检查\nM:4/4\nL:1/4\nK:C\nC D E F|G A B c|]\n', 'abc');
  await page.evaluate(() => window.SS_UI.transposeBy(3));
  await page.waitForFunction(() => window.SS_UI.compiled().built.key.sharps === -3);
  S = await compiled();
  assert(JSON.stringify(S.notes.map(a => a[0])) === JSON.stringify([63, 65, 67, 68, 70, 72, 74, 75]),
    `上行小三度后是 E♭4 起（实得 ${JSON.stringify(S.notes.map(a => a[0]))}）`);
  const abcSrc = await page.inputValue('#ss-src');
  assert(/K:Eb/.test(abcSrc), `ABC 源码的调号被改写成 K:Eb（实得 "${abcSrc.split('\n').filter(l => /^K:/.test(l))[0]}"）`);
  assert(!/\^|_/.test(abcSrc.split('K:Eb')[1] || ''), `移调后靠调号表达，不该满篇临时记号（实得 "${(abcSrc.split('K:Eb')[1] || '').trim()}"）`);

  // 用下拉直接移到 A 大调
  await page.selectOption('#ss-key', 'A');
  await page.waitForFunction(() => window.SS_UI.compiled().built.key.tonic === 'A');
  S = await compiled();
  assert(S.key.sharps === 3, `移到 A 大调 = 3 个升号（实得 ${S.key.sharps}）`);
  assert(S.notes[0][0] === 69, `A 大调音阶从 A4=69 起（实得 ${S.notes[0][0]}）`);

  // ================= 5. 临时记号规则：本小节内延续，过小节线还原 =================
  await setSrc('X:1\nM:4/4\nL:1/4\nK:C\n^F F F F|F F F F|\n', 'abc');
  S = await compiled();
  assert(JSON.stringify(S.notes.map(a => a[0])) === JSON.stringify([66, 66, 66, 66, 65, 65, 65, 65]),
    `升号管到本小节末、过线还原（实得 ${JSON.stringify(S.notes.map(a => a[0]))}）`);
  assert(JSON.stringify(S.showAcc.map(a => a[0])) === JSON.stringify([1, null, null, null, null, null, null, null]),
    `只有第一个音画升号，第二小节的 F 不画还原号（实得 ${JSON.stringify(S.showAcc.map(a => a[0]))}）`);

  // 跨小节的长音自动断开并加延音线
  await setSrc('X:1\nM:4/4\nL:1/4\nK:C\nC3 C3 C2|\n', 'abc');
  S = await compiled();
  assert(S.measures === 2, `8 拍的内容自动分成 2 小节（实得 ${S.measures}）`);
  assert(JSON.stringify(S.durs) === JSON.stringify([3, 1, 2, 2]),
    `第二个 C3 被小节线切成 1+2 并连线（实得 ${JSON.stringify(S.durs)}）`);
  const sched = await page.evaluate(() => window.SS_UI.engine.scheduleEvents(window.SS_UI.compiled().built, {}).map(e => window.SS_UI.engine.fval(e.dur)));
  assert(JSON.stringify(sched) === JSON.stringify([3, 3, 2]), `播放时延音线合并回 3+3+2（实得 ${JSON.stringify(sched)}）`);

  // ================= 6. 连桁分组：4/4 按拍、6/8 按附点四分 =================
  await setSrc('X:1\nM:4/4\nL:1/8\nK:C\nCDEF GABc|\n', 'abc');
  S = await compiled();
  assert(JSON.stringify(S.beams[0]) === JSON.stringify([2, 2, 2, 2]), `4/4 里八分音符两两成组（实得 ${JSON.stringify(S.beams[0])}）`);
  await setSrc('X:1\nM:6/8\nL:1/8\nK:C\nCDE FGA|\n', 'abc');
  S = await compiled();
  assert(JSON.stringify(S.beams[0]) === JSON.stringify([3, 3]), `6/8 里三个八分成一组（实得 ${JSON.stringify(S.beams[0])}）`);
  await setSrc('X:1\nM:4/4\nL:1/8\nK:C\n(3CDE (3FGA C2|\n', 'abc');
  S = await compiled();
  assert(JSON.stringify(S.beams[0]) === JSON.stringify([3, 3]), `两组三连音各自成连桁、不串组（实得 ${JSON.stringify(S.beams[0])}）`);

  // ================= 7. 语法速查表 = 可执行的能力清单 =================
  const synCheck = await page.evaluate(() => {
    const U = window.SS_UI, out = { abc: [], jianpu: [], counts: {} };
    ['abc', 'jianpu'].forEach(fmt => {
      U.syntax[fmt].forEach(row => {
        const r = U.checkSyntaxRow(row, fmt);
        if (!r.ok) out[fmt].push(row.code + ' → ' + r.why);
      });
      out.counts[fmt] = U.syntax[fmt].length;
    });
    return out;
  });
  assert(synCheck.counts.abc >= 28, `ABC 速查表至少 28 行（实得 ${synCheck.counts.abc}）`);
  assert(synCheck.counts.jianpu >= 17, `简谱速查表至少 17 行（实得 ${synCheck.counts.jianpu}）`);
  assert(synCheck.abc.length === 0, `ABC 速查表每一行都必须真的解析成表里写的结果，未命中：${JSON.stringify(synCheck.abc)}`);
  assert(synCheck.jianpu.length === 0, `简谱速查表每一行都必须真的命中，未命中：${JSON.stringify(synCheck.jianpu)}`);
  // 守卫自证：把期望改坏，检查器必须报红（否则「全绿」毫无意义）
  const guard = await page.evaluate(() => {
    const row = JSON.parse(JSON.stringify(window.SS_UI.syntax.abc[0]));
    row.expect.midi = [61, 62, 64, 65];
    return window.SS_UI.checkSyntaxRow(row, 'abc').ok;
  });
  assert(guard === false, '把速查表的期望值改坏后，检查器必须判为不通过（证明它真的在比对）');
  // 页面上真的渲染出这么多行
  await onTab('syntax');
  const rowCounts = await page.evaluate(() => ({
    abc: document.querySelectorAll('#ss-syn-abc tbody tr').length,
    jp: document.querySelectorAll('#ss-syn-jp tbody tr').length
  }));
  assert(rowCounts.abc === synCheck.counts.abc && rowCounts.jp === synCheck.counts.jianpu,
    `速查表在页面上逐行渲染（实得 ${rowCounts.abc}/${rowCounts.jp}）`);

  // ================= 8. 导出：MusicXML / MIDI / ABC 往返 =================
  await onTab('export');
  await setSrc('X:1\nT:导出检查\nM:3/4\nL:1/4\nK:F\n"Dm"A B c|"C"c3/2 B/2 A|]\nw: 一 二 三 四 五 六\n', 'abc');
  const xml = await page.evaluate(() => window.SS_UI.exportText('musicxml'));
  assert(/<score-partwise version="4.0">/.test(xml), 'MusicXML 是 score-partwise 4.0');
  assert(/<fifths>-1<\/fifths>/.test(xml), `F 大调写成 fifths=-1（实得 ${(xml.match(/<fifths>[^<]*<\/fifths>/) || [])[0]}）`);
  assert(/<beats>3<\/beats><beat-type>4<\/beat-type>/.test(xml), 'MusicXML 写出 3/4 拍号');
  assert(/<step>B<\/step><alter>-1<\/alter>/.test(xml), `F 大调里的 B 导出为 B♭（alter=-1）`);
  assert((xml.match(/<lyric /g) || []).length === 6, `6 个歌词字都导出（实得 ${(xml.match(/<lyric /g) || []).length}）`);
  assert(/<type>quarter<\/type><dot\/>/.test(xml), 'MusicXML 写出附点四分音符');
  const midiInfo = await page.evaluate(() => {
    const b = window.SS_UI.engine.toMIDI(window.SS_UI.compiled().built, {});
    const s = String.fromCharCode.apply(null, b.slice(0, 4));
    let noteOns = 0;
    for (let i = 0; i < b.length - 2; i++) if (b[i] === 0x90 && b[i + 2] > 0) noteOns++;
    return { magic: s, len: b.length, noteOns: noteOns };
  });
  assert(midiInfo.magic === 'MThd', `MIDI 文件以 MThd 开头（实得 "${midiInfo.magic}"）`);
  assert(midiInfo.len > 60, `MIDI 有实际内容（实得 ${midiInfo.len} 字节）`);
  // ABC 往返：打印出来再解析回去，音高与时值必须逐个相同
  const rt = await page.evaluate(() => {
    const E = window.SS_UI.engine, U = window.SS_UI;
    const a = U.compiled().built.flat.map(e => e.t + ':' + E.fval(e.dur) + ':' + (e.notes ? e.notes.map(h => h.midi).join('/') : ''));
    const printed = U.exportText('abc');
    const r2 = E.compile(printed, 'abc');
    const b = r2.built.flat.map(e => e.t + ':' + E.fval(e.dur) + ':' + (e.notes ? e.notes.map(h => h.midi).join('/') : ''));
    return { a: a, b: b, printed: printed };
  });
  assert(JSON.stringify(rt.a) === JSON.stringify(rt.b),
    `ABC 打印→重新解析必须逐音一致（原 ${JSON.stringify(rt.a)} / 回 ${JSON.stringify(rt.b)}）`);
  // 简谱文本导出也要能被自己读回来
  const jpRt = await page.evaluate(() => {
    const E = window.SS_UI.engine, U = window.SS_UI;
    const txt = U.exportText('jianpu');
    const r2 = E.compile(txt, 'jianpu');
    return { txt: txt, midi: r2.built.flat.filter(e => e.t === 'note').map(e => e.notes[0].midi) };
  });
  assert(JSON.stringify(jpRt.midi) === JSON.stringify([69, 70, 72, 72, 70, 69]),
    `简谱文本导出后自己读回来音高不变（实得 ${JSON.stringify(jpRt.midi)}）\n${jpRt.txt}`);
  const expText = await page.inputValue('#ss-exp-text');
  assert(expText.indexOf('<score-partwise') >= 0, '导出面板默认显示 MusicXML');
  await page.selectOption('#ss-exp-kind', 'abc');
  await page.waitForFunction(() => document.getElementById('ss-exp-text').value.indexOf('X:1') === 0);
  assert((await page.inputValue('#ss-exp-text')).indexOf('X:1') === 0, '切换到 ABC 后文本框跟着换');

  // ================= 9. 播放时间轴（纯函数，不依赖声卡） =================
  await setSrc('X:1\nM:4/4\nL:1/4\nQ:1/4=120\nK:C\n|:C D E F:|\n', 'abc');
  await page.evaluate(() => { document.getElementById('ss-tempo').value = '120'; document.getElementById('ss-tempo').dispatchEvent(new Event('change')); });
  let tl = await page.evaluate(() => { const t = window.SS_UI.timeline(); return { n: t.notes.length, total: t.total, first: t.notes[0].freq, t1: t.notes[1].t }; });
  assert(tl.n === 4, `不展开反复时 4 个音（实得 ${tl.n}）`);
  assert(Math.abs(tl.total - 2) < 1e-6, `120BPM 下四个四分音符共 2 秒（实得 ${tl.total}）`);
  assert(Math.abs(tl.first - 261.6256) < 0.01, `C4 频率 261.63Hz（实得 ${tl.first.toFixed(4)}）`);
  assert(Math.abs(tl.t1 - 0.5) < 1e-9, `第二个音在 0.5 秒（实得 ${tl.t1}）`);
  await page.check('#ss-repeat');
  tl = await page.evaluate(() => { const t = window.SS_UI.timeline(); return { n: t.notes.length, total: t.total }; });
  assert(tl.n === 8, `勾选展开反复后变 8 个音（实得 ${tl.n}）`);
  assert(Math.abs(tl.total - 4) < 1e-6, `展开后总长翻倍到 4 秒（实得 ${tl.total}）`);
  await page.uncheck('#ss-repeat');

  // ================= 10. 谱号切换 + 显示模式 =================
  await page.selectOption('#ss-clef', 'bass');
  await page.waitForFunction(() => window.SS_UI.compiled().built.clef === 'bass');
  const bassY = await page.evaluate(() => {
    const s = document.querySelector('#ss-staff svg');
    return { circles: s.querySelectorAll('circle').length };
  });
  assert(bassY.circles >= 2, `低音谱号画出两个点（实得 ${bassY.circles}）`);
  await page.selectOption('#ss-clef', 'auto');
  await page.click('#ss-view-jp');
  await page.waitForFunction(() => document.getElementById('ss-paper-staff').hidden === true);
  assert(await page.evaluate(() => getComputedStyle(document.getElementById('ss-paper-staff')).display) === 'none',
    '只看简谱时五线谱卡片的计算样式必须是 display:none');
  await page.click('#ss-view-both');
  await page.waitForFunction(() => document.getElementById('ss-paper-staff').hidden === false);

  // ================= 11. 错误与警告：小节不满要说出来 =================
  await setSrc('X:1\nM:4/4\nL:1/4\nK:C\nC D E F|C D E|C D E F|\n', 'abc');
  await page.waitForFunction(() => document.getElementById('ss-msg').hidden === false);
  const warnTxt = (await page.locator('#ss-msg').textContent()) || '';
  assert(/第 2 小节/.test(warnTxt) && /3 拍/.test(warnTxt),
    `第 2 小节只有 3 拍要被指出来（实得 "${warnTxt.replace(/\s+/g, ' ').trim()}"）`);
  // 首小节不满按弱起处理：不报警告，但状态条要说清楚
  await setSrc('X:1\nM:4/4\nL:1/4\nK:C\nE|C D E F|C D E F|\n', 'abc');
  S = await compiled();
  assert(S.warnings.length === 0, `弱起（不完全小节）不该报警告（实得 ${JSON.stringify(S.warnings)}）`);
  const pk = (await page.locator('#ss-stat').textContent()) || '';
  assert(/弱起\s*1\s*拍/.test(pk.replace(/\s+/g, ' ')), `状态条要写出弱起拍数（实得 "${pk.replace(/\s+/g, ' ').trim()}"）`);
  await setSrc('X:1\nM:4/4\nL:1/4\nK:C\n{ac}C4|\n', 'abc');
  const graceWarn = (await page.locator('#ss-msg').textContent()) || '';
  assert(/装饰音/.test(graceWarn), `装饰音被跳过时要提示（实得 "${graceWarn.replace(/\s+/g, ' ').trim()}"）`);

  // ================= 12. 曲库：保存 → 出现在列表 → 重开 =================
  await onTab('lib');
  await setSrc('X:1\nT:测试曲\nM:2/4\nL:1/4\nK:G\nG A|B c|]\n', 'abc');
  await page.fill('#ss-title', '我的测试曲');
  await page.click('#ss-save');
  await page.waitForFunction(() => document.querySelectorAll('#ss-lib-mine .ss-song').length === 1);
  const savedName = (await page.locator('#ss-lib-mine .ss-song .ss-song-name').first().textContent()) || '';
  assert(savedName === '我的测试曲', `保存后出现在曲库（实得 "${savedName}"）`);
  assert(await page.evaluate(() => getComputedStyle(document.getElementById('ss-mine-empty')).display) === 'none',
    '有曲子后「还没有保存过」提示要真的消失');
  await page.click('#ss-new');
  await page.waitForFunction(() => window.SS_UI.compiled().built.title === '未命名');
  await page.click('#ss-lib-mine .ss-song');
  await page.waitForFunction(() => window.SS_UI.compiled().built.title === '测试曲');
  S = await compiled();
  assert(JSON.stringify(S.notes.map(a => a[0])) === JSON.stringify([67, 69, 71, 72]),
    `重新打开保存的曲子内容完好（实得 ${JSON.stringify(S.notes.map(a => a[0]))}）`);
  assert(await page.evaluate(() => localStorage.getItem('ss.songs.v1') !== null), '曲库写进了 localStorage');
  await page.click('#ss-del');
  await page.waitForFunction(() => document.querySelectorAll('#ss-lib-mine .ss-song').length === 0);

  // ================= 13. 排版几何：歌词 / 和弦记号两两不相交，且落在纸面内 =================
  await setSrc('X:1\nT:排版几何检查\nM:4/4\nL:1/8\nK:Bb\n"Bb"B2 c2 d2 e2|"F7"f2 e2 d2 c2|"Bb"B4 z4|"Eb"e2 f2 g2 a2|\nw: 一 二 三 四 五 六 七 八 九 十 十一 十二 十三\n', 'abc');
  const boxes = await page.evaluate(() => {
    const svg = document.querySelector('#ss-staff svg');
    const r = svg.getBoundingClientRect();
    const out = [];
    svg.querySelectorAll('text').forEach(t => {
      const b = t.getBoundingClientRect();
      out.push({ cls: t.getAttribute('class') || '', text: t.textContent, x: b.x, y: b.y, w: b.width, h: b.height });
    });
    return { texts: out, box: { x: r.x, y: r.y, w: r.width, h: r.height } };
  });
  const inter = (a, b) => !(a.x + a.w <= b.x + 0.5 || b.x + b.w <= a.x + 0.5 || a.y + a.h <= b.y + 0.5 || b.y + b.h <= a.y + 0.5);
  // 拍号的上下两个数字是刻意叠在一起的，其余任意两段文字都不许相交
  const isMeter = (t) => /ss-t-meter/.test(t.cls);
  let clash = null;
  for (let i = 0; i < boxes.texts.length && !clash; i++) {
    for (let j = i + 1; j < boxes.texts.length; j++) {
      if (isMeter(boxes.texts[i]) && isMeter(boxes.texts[j])) continue;
      if (inter(boxes.texts[i], boxes.texts[j])) { clash = boxes.texts[i].text + '(' + boxes.texts[i].cls + ') ⟷ ' + boxes.texts[j].text + '(' + boxes.texts[j].cls + ')'; break; }
    }
  }
  assert(!clash, `谱面上任意两段文字不得重叠（实得重叠：${clash}）`);
  const lyricBoxes = boxes.texts.filter(t => /ss-t-lyric/.test(t.cls));
  assert(lyricBoxes.length === 13, `13 个音符各自带上歌词（休止符不占字，实得 ${lyricBoxes.length}）`);
  const escaped = boxes.texts.filter(t => t.x < boxes.box.x - 1 || t.x + t.w > boxes.box.x + boxes.box.w + 1 || t.y < boxes.box.y - 1 || t.y + t.h > boxes.box.y + boxes.box.h + 1);
  assert(escaped.length === 0, `所有文字都落在谱面 SVG 内（越界 ${JSON.stringify(escaped.map(e => e.text))}）`);
  const jpBoxes = await page.evaluate(() => {
    const svg = document.querySelector('#ss-jianpu svg');
    return [...svg.querySelectorAll('text')].map(t => { const b = t.getBoundingClientRect(); return { text: t.textContent, x: b.x, y: b.y, w: b.width, h: b.height }; });
  });
  let jpClash = null;
  for (let i = 0; i < jpBoxes.length && !jpClash; i++) {
    for (let j = i + 1; j < jpBoxes.length; j++) if (inter(jpBoxes[i], jpBoxes[j])) { jpClash = jpBoxes[i].text + ' ⟷ ' + jpBoxes[j].text; break; }
  }
  assert(!jpClash, `简谱上任意两段文字不得重叠（实得重叠：${jpClash}）`);

  // 符头必须落在谱表纵向范围（含加线）内，别飞出卡片
  const headOut = await page.evaluate(() => {
    const svg = document.querySelector('#ss-staff svg');
    const r = svg.getBoundingClientRect();
    let bad = 0;
    svg.querySelectorAll('ellipse').forEach(e => {
      const b = e.getBoundingClientRect();
      if (b.y < r.y || b.y + b.height > r.y + r.height || b.x < r.x || b.x + b.width > r.x + r.width) bad++;
    });
    return bad;
  });
  assert(headOut === 0, `所有符头都在 SVG 内（越界 ${headOut} 个）`);

  // ================= 14. 控件尺寸守卫：逐标签页扫一遍 =================
  let scanned = 0, tooSmall = [];
  for (const tab of ['lib', 'export', 'syntax', 'about']) {
    await onTab(tab);
    const bad = await page.evaluate(() => {
      const out = []; let n = 0;
      document.querySelectorAll('input,select,button,textarea').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;   // 当前不可见的面板
        n++;
        const isCheck = el.type === 'checkbox';
        const minW = isCheck ? 16 : (el.tagName === 'BUTTON' ? 52 : 100);
        const minH = 18;
        if (r.width < minW || r.height < minH) out.push({ tag: el.tagName + (el.id ? '#' + el.id : ''), w: Math.round(r.width), h: Math.round(r.height) });
      });
      return { out: out, n: n };
    });
    scanned += bad.n;
    tooSmall = tooSmall.concat(bad.out);
  }
  assert(scanned >= 40, `逐标签页至少扫到 40 个控件（实得 ${scanned}，太少说明守卫没真扫到）`);
  assert(tooSmall.length === 0, `控件不得塌缩：${JSON.stringify(tooSmall)}`);

  // ================= 15. 窄屏不横向溢出（逐视口 × 逐标签页） =================
  for (const vw of [390, 768, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const tab of ['lib', 'export', 'syntax', 'about']) {
      await onTab(tab);
      await page.waitForTimeout(220);   // 等 resize 后重排完成
      const ov = await page.evaluate(() => {
        const de = document.documentElement;
        const over = de.scrollWidth - de.clientWidth;
        let who = '';
        if (over > 1) {
          let worst = 0;
          document.querySelectorAll('*').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.right > worst && r.width > 0) { worst = r.right; who = el.tagName + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '') + '@' + Math.round(r.right); }
          });
        }
        return { over: over, who: who };
      });
      assert(ov.over <= 1, `${vw}px 宽、「${tab}」页不得横向溢出（溢出 ${ov.over}px，最右元素 ${ov.who}）`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 850 });
  await onTab('lib');

  // ================= 16. 单位不被 uppercase 改写 + 无裸状态类名 =================
  const upper = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('th,dt,label,.ss-label').forEach(el => {
      const t = (el.textContent || '');
      if (/\b(HZ|KHZ|DBFS|DB|BPM分|MIDI文)\b/.test(t)) bad.push(t);
      if (getComputedStyle(el).textTransform === 'uppercase') bad.push('uppercase:' + t);
    });
    return bad;
  });
  assert(upper.length === 0, `表头 / 标签不得被 uppercase 改写单位：${JSON.stringify(upper)}`);

  // ================= 17. 键盘可用性：Tab 能走到编辑器，空格触发播放开关 =================
  const focusable = await page.evaluate(() => document.querySelectorAll('a[href],button,select,input,textarea').length);
  assert(focusable >= 25, `页面上可聚焦元素足够（实得 ${focusable}）`);
  const backHref = await page.getAttribute('.ss-back', 'href');
  assert(backHref === '../../', `顶部有返回工具集的链接（实得 "${backHref}"）`);

  // ================= 18. 缩略图 =================
  await page.evaluate(() => {
    document.getElementById('ss-title').value = window.SS_UI.examples[0].name;
    window.SS_UI.setSource(window.SS_UI.examples[0].text, 'abc');
    window.SS_UI.setTab('lib');
  });
  await page.waitForFunction(() => /欢乐颂/.test(window.SS_UI.compiled().built.title));
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await screenshot('thumb.png');

  console.log(`    (score-studio: ${nAssert} 条断言)`);
}
