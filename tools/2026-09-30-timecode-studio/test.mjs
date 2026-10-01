/* 时间码工作台 · 集成测试
 *
 * 真值全部来自 oracle/truth.json（run 目录 oracle/truth.py：OpenTimelineIO / timecode 库 / fractions / ffmpeg telecine），
 * 由 inject-oracle.mjs **机械注入**下面的 ORACLE 块 —— 本文件不手打任何时间码或帧数。
 * 渲染守卫一律 import（render-guards.mjs）。
 */
import { renderGuards } from '/Users/lon/.agents/cron/daily-website/tools/render-guards.mjs';

const ORACLE = {
 "meta": {
  "tabs": [
   "calc",
   "edl",
   "rate",
   "notes"
  ],
  "source": "oracle/truth.py（OpenTimelineIO 0.17 / timecode / fractions / ffmpeg telecine）"
 },
 "df": {
  "tc10": "00:10:00;00",
  "f10": 17982,
  "frames_in": 107892,
  "tc_of_107892": "01:00:00;00",
  "real_107892": "00:59:59.996",
  "drift_107892": -0.004,
  "real_10": "00:09:59.999",
  "edge": [
   [
    1798,
    "00:00:59;28"
   ],
   [
    1799,
    "00:00:59;29"
   ],
   [
    1800,
    "00:01:00;02"
   ],
   [
    1801,
    "00:01:00;03"
   ],
   [
    17981,
    "00:09:59;29"
   ],
   [
    17982,
    "00:10:00;00"
   ],
   [
    19781,
    "00:10:59;29"
   ],
   [
    19782,
    "00:11:00;02"
   ]
  ],
  "tcl_f10": 17982
 },
 "allrates": [
  {
   "id": "23.976",
   "label": "23.976",
   "tc": "00:59:56:10",
   "frames": 86314,
   "exact": false
  },
  {
   "id": "24",
   "label": "24",
   "tc": "01:00:00:00",
   "frames": 86400,
   "exact": true
  },
  {
   "id": "25",
   "label": "25",
   "tc": "01:00:00:00",
   "frames": 90000,
   "exact": true
  },
  {
   "id": "29.97df",
   "label": "29.97 DF",
   "tc": "01:00:00;00",
   "frames": 107892,
   "exact": false
  },
  {
   "id": "29.97",
   "label": "29.97 NDF",
   "tc": "00:59:56:12",
   "frames": 107892,
   "exact": false
  },
  {
   "id": "30",
   "label": "30",
   "tc": "01:00:00:00",
   "frames": 108000,
   "exact": true
  },
  {
   "id": "47.952",
   "label": "47.952",
   "tc": "00:59:56:19",
   "frames": 172627,
   "exact": false
  },
  {
   "id": "48",
   "label": "48",
   "tc": "01:00:00:00",
   "frames": 172800,
   "exact": true
  },
  {
   "id": "50",
   "label": "50",
   "tc": "01:00:00:00",
   "frames": 180000,
   "exact": true
  },
  {
   "id": "59.94df",
   "label": "59.94 DF",
   "tc": "01:00:00;00",
   "frames": 215784,
   "exact": false
  },
  {
   "id": "59.94",
   "label": "59.94 NDF",
   "tc": "00:59:56:24",
   "frames": 215784,
   "exact": false
  },
  {
   "id": "60",
   "label": "60",
   "tc": "01:00:00:00",
   "frames": 216000,
   "exact": true
  },
  {
   "id": "119.88",
   "label": "119.88",
   "tc": "00:59:56:048",
   "frames": 431568,
   "exact": false
  },
  {
   "id": "120",
   "label": "120",
   "tc": "01:00:00:000",
   "frames": 432000,
   "exact": true
  }
 ],
 "tape": {
  "text": "00:00:59;29 + 1\n00:09:59;29 + 1\n00:10:00;00 -> 00:20:00;00\n1m\n00:01:00;00\n01:00:00;00 / 00:00:01;00\n\n00:00:10;00 -> 00:00:20;15\n_ * 3\n合计",
  "rows": [
   {
    "line": 0,
    "tc": "00:01:00;02",
    "f": 1800
   },
   {
    "line": 1,
    "tc": "00:10:00;00",
    "f": 17982
   },
   {
    "line": 2,
    "tc": "00:10:00;00",
    "f": 17982
   },
   {
    "line": 3,
    "tc": "00:01:00;02",
    "f": 1800
   },
   {
    "line": 4,
    "err": true
   },
   {
    "line": 5,
    "num": 3596.4
   },
   {
    "line": 7,
    "tc": "00:00:10;15",
    "f": 315
   },
   {
    "line": 8,
    "tc": "00:00:31;15",
    "f": 945
   },
   {
    "line": 9,
    "tc": "00:00:42;00",
    "f": 1260,
    "total": true
   }
  ],
  "sum_all": "00:22:42;04"
 },
 "edl": {
  "events": 10,
  "span_tc": "00:00:22:00",
  "gaps": [
   [
    "01:00:20:12",
    "01:00:21:00",
    12
   ]
  ],
  "overlaps": [
   [
    "A003C007",
    "A001C009",
    6
   ]
  ],
  "mismatch": [
   "006"
  ],
  "mismatch_frames": [
   [
    82,
    84
   ]
  ],
  "otio_v_clips": [
   [
    "A001C003_260914_R1AB.mov",
    108
   ],
   [
    "A002C011_260914_R1AB.mov",
    54
   ],
   [
    "B001C002_260915_R2CD.mov",
    120
   ],
   [
    "A003C007_260916_R3EF.mov",
    60
   ],
   [
    "A001C009_260914_R1AB.mov",
    66
   ],
   [
    "A004C001_260917_R4GH.mov",
    84
   ],
   [
    "007",
    24
   ]
  ],
  "otio_errs": [
   "Overlapping record in value: 01:00:14:00 for clip A001C009_260914_R1AB.mov",
   "Source and record duration don't match: RationalTime(82, 23.976) != RationalTime(84, 23.976) for clip A004C001_260917_R4GH.mov"
  ],
  "rec_dur_006": "00:00:03:12",
  "lanes": [
   "V",
   "A1",
   "A2",
   "A3"
  ],
  "m2_expect_004": 48.048,
  "m2_src_004": 48
 },
 "conv": {
  "tc": "01:30:05:10",
  "frames": 135135,
  "exact": true,
  "real": "01:30:05.400"
 },
 "conv_frame": {
  "tc": "01:26:24:00",
  "real_b": "01:26:24.000",
  "speed_pct": 4.167,
  "semis": 0.707
 },
 "pd": {
  "23": [
   [
    0,
    0
   ],
   [
    1,
    1
   ],
   [
    1,
    2
   ],
   [
    2,
    3
   ],
   [
    3,
    3
   ],
   [
    4,
    4
   ],
   [
    5,
    5
   ],
   [
    5,
    6
   ],
   [
    6,
    7
   ],
   [
    7,
    7
   ]
  ],
  "2332": [
   [
    0,
    0
   ],
   [
    1,
    1
   ],
   [
    1,
    2
   ],
   [
    2,
    2
   ],
   [
    3,
    3
   ],
   [
    4,
    4
   ],
   [
    5,
    5
   ],
   [
    5,
    6
   ],
   [
    6,
    6
   ],
   [
    7,
    7
   ]
  ],
  "q7": [
   5,
   6
  ],
  "euro_q24": [
   23,
   23
  ]
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.goto(toolURL);
  await page.evaluate(() => localStorage.removeItem('tcs-v1'));
  await page.reload();
  await page.waitForFunction(() => document.querySelector('#tcs-o-frames').textContent !== '—');

  const txt = (sel) => page.$eval(sel, (n) => n.textContent.trim());
  const waitTxt = (sel, want) => page.waitForFunction(([s, w]) => {
    const n = document.querySelector(s); return n && n.textContent.trim() === w;
  }, [sel, want], { timeout: 10000 }).then(() => true, () => false);
  const onTab = async (t) => {
    await page.click('#tab-' + t);
    await page.waitForFunction((t) => !document.querySelector('#pane-' + t).hidden, t);
  };

  // ── 1. 换算卡：29.97 DF ──
  await page.selectOption('#tcs-rate', '29.97df');
  await page.fill('#tcs-in', ORACLE.df.tc10);
  assert(await waitTxt('#tcs-o-frames', ORACLE.df.f10.toLocaleString('en-US')), `00:10:00;00 应为 ${ORACLE.df.f10} 帧，实得 ${await txt('#tcs-o-frames')}`);
  assert(ORACLE.df.f10 === ORACLE.df.tcl_f10, 'OTIO 与 timecode 库对 10 分钟帧数一致');
  assert(await txt('#tcs-o-real') === ORACLE.df.real_10, `10 分钟 DF 真实时长 ${await txt('#tcs-o-real')}`);
  // 丢帧制里不存在的标签
  await page.fill('#tcs-in', '00:01:00;00');
  await page.waitForFunction(() => /不存在/.test(document.querySelector('#tcs-in-msg').textContent));
  assert(/00:01:00;02/.test(await txt('#tcs-in-msg')), '非法 DF 标签要给出下一个合法值');
  assert(await page.getAttribute('#tcs-in', 'aria-invalid') === 'true', '非法输入 aria-invalid');
  assert(await txt('#tcs-o-frames') === '—', '非法输入不出读数');
  // 按帧数输入
  await page.selectOption('#tcs-in-kind', 'frames');
  await page.fill('#tcs-in', String(ORACLE.df.frames_in));
  assert(await waitTxt('#tcs-o-tc', ORACLE.df.tc_of_107892), `107892 帧应标 ${ORACLE.df.tc_of_107892}，得 ${await txt('#tcs-o-tc')}`);
  assert(await txt('#tcs-o-real') === ORACLE.df.real_107892, '1 小时 DF 真实时长');
  assert(await txt('#tcs-o-drift') === '快 ' + Math.abs(ORACLE.df.drift_107892).toFixed(3) + ' 秒', `墙钟偏差 ${await txt('#tcs-o-drift')}`);
  // 丢帧边界两侧（第 1 分钟、第 10 分钟、第 11 分钟）逐帧
  for (const [F, want] of ORACLE.df.edge) {
    await page.fill('#tcs-in', String(F));
    assert(await waitTxt('#tcs-o-tc', want), `帧 ${F} 应标 ${want}，实得 ${await txt('#tcs-o-tc')}`);
  }
  await page.fill('#tcs-in', String(ORACLE.df.frames_in));
  await waitTxt('#tcs-o-tc', ORACLE.df.tc_of_107892);
  // 方向键 ±1 帧
  await page.focus('#tcs-in');
  await page.keyboard.press('ArrowUp');
  const v1 = await page.inputValue('#tcs-in');
  assert(v1 === String(ORACLE.df.frames_in + 1), `ArrowUp 应 +1 帧，实得 ${v1}`);
  await page.selectOption('#tcs-in-kind', 'tc');
  assert(await page.inputValue('#tcs-in') === '01:00:00;01', `切回时间码输入应保留帧号：${await page.inputValue('#tcs-in')}`);

  // ── 2. 全帧率表（25 fps 的 1 小时）──
  await page.selectOption('#tcs-rate', '25');
  await page.fill('#tcs-in', '01:00:00:00');
  await page.waitForFunction(() => document.querySelectorAll('#tcs-all tbody tr').length === 14);
  const rows = await page.$$eval('#tcs-all tbody tr', (trs) => trs.map((tr) => ({ id: tr.dataset.rate, c: [...tr.cells].map((c) => c.textContent.trim()) })));
  assert(rows.length === ORACLE.allrates.length, '全帧率表行数');
  for (const w of ORACLE.allrates) {
    const r = rows.find((x) => x.id === w.id);
    assert(r && r.c[1] === w.tc, `全帧率表 ${w.label} 时间码 ${r && r.c[1]} ≠ ${w.tc}`);
    assert(r && r.c[2].replace(/[≈ ,]/g, '') === String(w.frames), `全帧率表 ${w.label} 帧数`);
    assert(r && (r.c[2].startsWith('≈') === !w.exact), `全帧率表 ${w.label} 取整标记`);
  }
  assert(await page.$eval('#tcs-all tr.tcs-cur', (n) => n.dataset.rate) === '25', '当前帧率行高亮');

  // ── 3. 算式纸（29.97 DF）──
  await page.selectOption('#tcs-rate', '29.97df');
  await page.fill('#tcs-tape', ORACLE.tape.text);
  await page.waitForFunction((n) => document.querySelectorAll('#tcs-tape-out .tcs-tl').length === n, ORACLE.tape.text.split('\n').length);
  for (const w of ORACLE.tape.rows) {
    const cell = await page.$eval(`#tcs-tape-out .tcs-tl[data-line="${w.line}"]`, (n) => ({ t: n.textContent, cls: n.className, f: n.dataset.frames, v: n.dataset.num }));
    if (w.err) assert(/tcs-tl-bad/.test(cell.cls) && /不存在/.test(cell.t), `第 ${w.line} 行应报丢帧非法：${cell.t}`);
    else if (w.num != null) assert(Math.abs(+cell.v - w.num) < 1e-9, `第 ${w.line} 行比值 ${cell.v} ≠ ${w.num}`);
    else {
      assert(cell.t.startsWith((w.total ? '＝ ' : '') + w.tc), `第 ${w.line} 行 ${cell.t} 应以 ${w.tc} 开头`);
      assert(+cell.f === w.f, `第 ${w.line} 行帧数 ${cell.f} ≠ ${w.f}`);
    }
  }
  assert(await txt('#tcs-tape-total') === ORACLE.tape.sum_all, `全部时长之和 ${await txt('#tcs-tape-total')} ≠ ${ORACLE.tape.sum_all}`);
  // 持久化：刷新后算式纸与帧率都在
  await page.reload();
  await page.waitForFunction(() => document.querySelector('#tcs-rate').value === '29.97df');
  assert((await page.inputValue('#tcs-tape')) === ORACLE.tape.text, '算式纸 localStorage 持久化');
  assert(await waitTxt('#tcs-tape-total', ORACLE.tape.sum_all), '刷新后结果重算一致');

  // ── 4. EDL 体检 ──
  await onTab('edl');
  await page.click('#tcs-edl-sample');
  await page.waitForFunction((n) => document.querySelectorAll('#tcs-edl-table tbody tr').length === n, ORACLE.edl.events);
  assert(await txt('#tcs-k-events') === String(ORACLE.edl.events), '事件数');
  assert(await txt('#tcs-k-span') === ORACLE.edl.span_tc, `录制总长 ${await txt('#tcs-k-span')}`);
  assert(await txt('#tcs-k-lanes') === String(ORACLE.edl.lanes.length), '轨道数');
  // OTIO 逐条拒绝的两个问题 = 本工具报的两个问题
  assert(ORACLE.edl.otio_errs.length === 2, 'OTIO 应报 2 个问题');
  assert(await txt('#tcs-k-issues') === String(ORACLE.edl.otio_errs.length), `问题数 ${await txt('#tcs-k-issues')}`);
  const iss = await page.$$eval('#tcs-edl-issues li', (ls) => ls.map((l) => ({ sev: l.dataset.sev, t: l.textContent })));
  const [ov] = ORACLE.edl.overlaps;
  assert(iss.some((i) => i.sev === 'warn' && i.t.includes('事件 005') && i.t.includes(`重叠 ${ov[2]} 帧`)), `重叠 ${ov[2]} 帧：${JSON.stringify(iss)}`);
  const [mf] = ORACLE.edl.mismatch_frames;
  assert(iss.some((i) => i.sev === 'err' && i.t.includes('事件 ' + ORACLE.edl.mismatch[0]) && i.t.includes(`${mf[0]} 帧 ≠ 录制长度 ${mf[1]} 帧`)), '长度不一致');
  const [g] = ORACLE.edl.gaps;
  assert(iss.some((i) => i.sev === 'info' && i.t.includes(`空隙 ${g[2]} 帧`) && i.t.includes(g[0]) && i.t.includes(g[1])), '空隙提示');
  assert(!iss.some((i) => /004/.test(i.t) && /长度/.test(i.t)), `M2 变速的 004 不应报长度（期望 ${ORACLE.edl.m2_expect_004}，实 ${ORACLE.edl.m2_src_004}）`);
  // 事件表 vs OTIO 修正后解析出的 V 轨片段时长
  const tbl = await page.$$eval('#tcs-edl-table tbody tr', (trs) => trs.map((tr) => [...tr.cells].map((c) => c.textContent.trim())));
  assert(tbl.find((r) => r[0] === '006')[8] === ORACLE.edl.rec_dur_006, '006 时长');
  const flagged = await page.$$eval('#tcs-edl-table tbody tr.tcs-flag td:first-child', (n) => n.map((x) => x.textContent));
  assert(flagged.join() === '005,006', `标红行 ${flagged}`);
  // 时间线几何：每轨的块数、红框数、转场斜线、LOC
  const fig = await page.evaluate(() => {
    const svg = document.querySelector('#tcs-fig-edl'), sb = svg.getBoundingClientRect();
    const blk = [...svg.querySelectorAll('g.tcs-blk')];
    const by = {}; blk.forEach((g) => { by[g.dataset.lane] = (by[g.dataset.lane] || 0) + 1; });
    const red = blk.filter((g) => g.querySelector('rect').getAttribute('stroke') === '#ff6b5e').map((g) => g.dataset.ev);
    const inside = blk.every((g) => { const r = g.getBoundingClientRect(); return r.left >= sb.left - 1 && r.right <= sb.right + 1 && r.width > 0; });
    const v = blk.filter((g) => g.dataset.lane === 'V').map((g) => { const r = g.querySelector('rect').getBoundingClientRect(); return [g.dataset.ev, r.left, r.right]; });
    return { by, red, inside, v, hatch: svg.querySelectorAll('rect[fill="url(#tcs-hatch)"]').length, loc: svg.querySelectorAll('.tcs-loc').length, ticks: [...svg.querySelectorAll('text')].filter((t) => /^\d\d:\d\d:\d\d:\d\d$/.test(t.textContent)).length };
  });
  assert(fig.by.V === 7 && fig.by.A1 === 1 && fig.by.A2 === 1 && fig.by.A3 === 1, `各轨块数 ${JSON.stringify(fig.by)}`);
  assert(ORACLE.edl.otio_v_clips.length === fig.by.V, `V 轨片段数应与 OTIO 一致（${ORACLE.edl.otio_v_clips.length}）`);
  assert(fig.red.sort().join() === '005,006', `红框 ${fig.red}`);
  assert(fig.inside, '时间线块都在画布内');
  assert(fig.hatch === 1 && fig.loc === 1, `转场斜线 ${fig.hatch} / LOC ${fig.loc}`);
  assert(fig.ticks >= 4, `时间刻度 ≥4，实得 ${fig.ticks}`);
  // 几何：V 轨块按录制时间从左到右，005 的左边缘在 004 右边缘之左（重叠）
  const x4 = fig.v.find((x) => x[0] === '004'), x5 = fig.v.find((x) => x[0] === '005');
  assert(x5[1] < x4[2] - 1, `005 应与 004 画成重叠：${x4} / ${x5}`);
  // 点片段 → 表格定位
  await page.click('#tcs-fig-edl g.tcs-blk[data-ev="006"]');
  await page.waitForFunction(() => document.querySelector('#tcs-edl-table tr.tcs-cur td')?.textContent === '006');
  // 修掉两处问题后问题数归零（与 OTIO 修正后成功解析一致）
  const fixedText = (await page.inputValue('#tcs-edl'))
    .replace('17:02:10:00 17:02:13:10', '17:02:10:00 17:02:13:12')
    .replace('14:31:00:00 14:31:03:00 01:00:14:00', '14:31:00:06 14:31:03:00 01:00:14:06');
  await page.fill('#tcs-edl', fixedText);
  assert(await waitTxt('#tcs-k-issues', '0'), `修正后问题应为 0，实得 ${await txt('#tcs-k-issues')}`);
  // 库：存入 → 改文本 → 打开 → 删除
  await page.click('#tcs-edl-save');
  await page.waitForFunction(() => document.querySelectorAll('#tcs-edl-lib .tcs-lib-item').length === 1);
  await page.fill('#tcs-edl', 'TITLE: X\n001  A  V  C  01:00:00:00 01:00:00:30 01:00:00:00 01:00:01:06');
  await page.waitForFunction(() => document.querySelector('#tcs-edl-issues').textContent.includes('帧号应 <'));
  await page.click('#tcs-edl-lib [data-load="0"]');
  assert(await waitTxt('#tcs-k-events', String(ORACLE.edl.events)), '从库打开');
  // 导出：规范化 EDL 可再次导入且结果一致
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#tcs-edl-norm')]);
  const norm = await (await dl.createReadStream()).toArray().then((c) => Buffer.concat(c).toString('utf8'));
  assert(/^TITLE: SHORT_FILM_R1_V07\nFCM: NON-DROP FRAME\n001 /.test(norm), '规范化 EDL 开头');
  await page.fill('#tcs-edl', norm);
  assert(await waitTxt('#tcs-k-events', String(ORACLE.edl.events)) && await txt('#tcs-k-issues') === '0', '规范化 EDL 回灌后事件数/问题数不变');
  await page.click('#tcs-edl-lib [data-del="0"]');
  await page.waitForFunction(() => document.querySelectorAll('#tcs-edl-lib .tcs-lib-item').length === 0);
  await page.click('#tcs-edl-sample');
  await page.waitForFunction(() => document.querySelector('#tcs-k-issues').textContent === '2');
  await page.$eval('#tcs-fig-edl', (n) => n.scrollIntoView({ block: 'center' }));
  await screenshot('view-edl.png');

  // ── 5. 跨帧率换算 ──
  await onTab('rate');
  await page.fill('#tcs-cv-in', '01:30:00:00');
  await page.selectOption('#tcs-cv-from', '23.976');
  await page.selectOption('#tcs-cv-to', '25');
  await page.check('#tcs-cv-real');
  assert(await waitTxt('#tcs-cv-tc', ORACLE.conv.tc), `23.976→25 保持时长 ${await txt('#tcs-cv-tc')} ≠ ${ORACLE.conv.tc}`);
  assert(await txt('#tcs-cv-frames') === ORACLE.conv.frames.toLocaleString('en-US'), '目标帧数');
  assert(await txt('#tcs-cv-real-b') === ORACLE.conv.real && await txt('#tcs-cv-real-a') === ORACLE.conv.real, '前后真实时长相同');
  await page.selectOption('#tcs-cv-from', '24');
  await page.check('#tcs-cv-frame');
  assert(await waitTxt('#tcs-cv-tc', ORACLE.conv_frame.tc), `逐帧对应 ${await txt('#tcs-cv-tc')}`);
  assert(await txt('#tcs-cv-real-b') === ORACLE.conv_frame.real_b, '加速后时长');
  assert(await txt('#tcs-cv-speed') === '+' + ORACLE.conv_frame.speed_pct.toFixed(3) + '%', `速度 ${await txt('#tcs-cv-speed')}`);
  assert((await txt('#tcs-cv-pitch')).startsWith('+' + ORACLE.conv_frame.semis.toFixed(3) + ' 半音'), `音高 ${await txt('#tcs-cv-pitch')}`);
  assert(await page.$eval('#tcs-cv-round', (n) => n.disabled), '逐帧模式下取整不可用');
  await page.fill('#tcs-cv-in', '00:00:00:24');
  await page.waitForFunction(() => /帧号应 < 24/.test(document.querySelector('#tcs-cv-msg').textContent));
  await page.fill('#tcs-cv-in', '01:30:00:00');

  // ── 6. 下拉：与 ffmpeg telecine 逐场一致 ──
  await page.selectOption('#tcs-pd-pat', '23');
  await page.selectOption('#tcs-pd-phase', '0');
  await page.waitForFunction(() => document.querySelectorAll('#tcs-pd-table tbody tr').length >= 10);
  const pd = await page.$$eval('#tcs-pd-table tbody tr', (trs) => trs.map((tr) => [...tr.cells].map((c) => c.textContent)));
  ORACLE.pd['23'].forEach((w, k) => {
    const top = +pd[k][1].match(/胶片帧 (\d+)/)[1], bot = +pd[k][2].match(/胶片帧 (\d+)/)[1];
    assert(top === w[0] && bot === w[1], `2:3 视频帧 ${k}：${top}/${bot} ≠ ffmpeg ${w}`);
    assert((pd[k][3] === '混帧') === (w[0] !== w[1]), `2:3 视频帧 ${k} 混帧判定`);
  });
  assert(await txt('#tcs-pd-cad') === 'AA BB BC CD DD', `节奏 ${await txt('#tcs-pd-cad')}`);
  assert(await txt('#tcs-pd-ratio') === '4 : 5' && await txt('#tcs-pd-mixed') === '2 / 5 帧', '4:5 与 2 个混帧');
  await page.fill('#tcs-pd-q', '7');
  await page.waitForFunction(() => document.querySelector('#tcs-pd-ans').dataset.top != null);
  const q = await page.$eval('#tcs-pd-ans', (n) => [+n.dataset.top, +n.dataset.bottom]);
  assert(q[0] === ORACLE.pd.q7[0] && q[1] === ORACLE.pd.q7[1], `查询帧 7：${q} ≠ ffmpeg ${ORACLE.pd.q7}`);
  // 图：视频帧块数、混帧红虚线数与表一致；胶片帧块宽度比 = 场数比（2:3）
  const pg = await page.evaluate(() => {
    const vids = [...document.querySelectorAll('#tcs-fig-pd rect.tcs-vid')];
    const films = [...document.querySelectorAll('#tcs-fig-pd rect.tcs-film')].map((r) => r.getBoundingClientRect().width);
    return { n: vids.length, mix: vids.filter((r) => r.classList.contains('tcs-vid-mix')).length, films };
  });
  assert(pg.n === pd.length && pg.mix === pd.filter((r) => r[3] === '混帧').length, `图上视频帧 ${pg.n}/${pg.mix}`);
  assert(Math.abs((pg.films[1] + 4) / (pg.films[0] + 4) - 1.5) < 0.02, `B 帧（3 场）应是 A 帧（2 场）的 1.5 倍宽：${pg.films.slice(0, 2)}`);
  await page.selectOption('#tcs-pd-pat', '2332');
  await page.waitForFunction(() => document.querySelector('#tcs-pd-cad').textContent === 'AA BB BC CC DD');
  const pd2 = await page.$$eval('#tcs-pd-table tbody tr', (trs) => trs.map((tr) => [+tr.cells[1].textContent.match(/(\d+)/)[1], +tr.cells[2].textContent.match(/(\d+)/)[1]]));
  assert(JSON.stringify(pd2.slice(0, 10)) === JSON.stringify(ORACLE.pd['2332']), `2:3:3:2 与 ffmpeg 一致：${JSON.stringify(pd2.slice(0, 10))}`);
  await page.selectOption('#tcs-pd-pat', '222222222223');
  await page.fill('#tcs-pd-q', '24');
  await page.waitForFunction(() => /视频帧 24/.test(document.querySelector('#tcs-pd-ans').textContent));
  const q24 = await page.$eval('#tcs-pd-ans', (n) => [+n.dataset.top, +n.dataset.bottom]);
  assert(q24.join() === ORACLE.pd.euro_q24.join(), `欧洲下拉帧 24：${q24} ≠ ffmpeg ${ORACLE.pd.euro_q24}`);
  assert(await txt('#tcs-pd-ratio') === '24 : 25', '欧洲下拉 24:25');
  await page.selectOption('#tcs-pd-pat', '23');
  await page.$eval('#tcs-fig-pd', (n) => n.scrollIntoView({ block: 'center' }));
  await screenshot('view-pulldown.png');

  // ── 7. 页签键盘可用 ──
  await page.focus('#tab-rate');
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => !document.querySelector('#pane-notes').hidden);
  assert(await page.evaluate(() => document.activeElement.id) === 'tab-notes', '方向键切页签并移焦');

  // ── 8. 渲染守卫 ──
  const nCtl = await renderGuards(page, {
    assert, tabs: ORACLE.meta.tabs, onTab,
    paneSel: (t) => `#pane-${t}`, panesRoot: '#tcs-panes',
    figSel: (t) => `#pane-${t} svg.tcs-fig`, cardSel: '.tcs-card',
    minControls: 20, minTextsInFig: 8, minIds: 80,
  });
  assert(nCtl >= 20, `逐页签累计应扫到 ≥20 个控件，实得 ${nCtl}`);
  assert(errs.length === 0, `页面有报错：${errs.slice(0, 3).join(' | ')}`);

  await onTab('calc');
  await page.selectOption('#tcs-rate', '29.97df');
  await page.fill('#tcs-in', '01:00:00;00');
  await page.fill('#tcs-tape', '');
  await page.click('#tcs-tape-ex1');
  await page.evaluate(() => window.scrollTo(0, 0));
  await screenshot('thumb.png');
};
