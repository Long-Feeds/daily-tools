// 集成测试:声音实验室 · Sound Lab
//
// 两段闸门:
//   A) 离线引擎断言 —— 从 index.html 抽 <<<ENGINE 块直接求值,与**独立 oracle** 对照:
//      FFT ≡ 朴素 DFT、NSDF(FFT) ≡ NSDF(朴素)、解析频响 ≡ 真的滤一段正弦量出来的幅度/相位、
//      THD ≡ 按谐波定律闭式算出的期望值、律制音分 ≡ 有理数比值。
//   B) 浏览器断言 —— 真的改信号源/律制/滤波器,断言页面上出现的**频率、音分、dB 数字**,
//      而不是「元素存在」。
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));

export default async function ({ page, toolURL, screenshot, assert }) {
  /* ══════════════ A. 离线引擎断言 ══════════════ */
  const html = await readFile(join(HERE, 'index.html'), 'utf8');
  const blk = html.match(/\/\*<<<ENGINE\*\/([\s\S]*?)\/\*ENGINE>>>\*\//);
  assert(blk, '能从 index.html 抽出 <<<ENGINE 引擎块');
  const E = (await import('data:text/javascript;charset=utf-8,' +
    encodeURIComponent(blk[1] + '\nexport default SL_ENGINE;\n'))).default;

  const near = (a, b, tol, msg) => assert(Math.abs(a - b) <= tol, `${msg}(得 ${a},期望 ${b},容差 ${tol})`);
  const FS = 48000;

  /* ── A1. FFT ≡ 朴素 DFT / Parseval / 往返 ── */
  {
    const r = E.rng(7);
    for (const N of [8, 64, 256]) {
      const re = new Float64Array(N), im = new Float64Array(N);
      for (let i = 0; i < N; i++) { re[i] = r(); im[i] = r(); }
      const xr = Float64Array.from(re), xi = Float64Array.from(im);
      E.fft(re, im, false);
      let worst = 0;
      for (let k = 0; k < N; k++) {
        let sr = 0, si = 0;
        for (let t = 0; t < N; t++) {
          const a = -2 * Math.PI * k * t / N, c = Math.cos(a), s = Math.sin(a);
          sr += xr[t] * c - xi[t] * s; si += xr[t] * s + xi[t] * c;
        }
        worst = Math.max(worst, Math.abs(sr - re[k]), Math.abs(si - im[k]));
      }
      assert(worst < 1e-9, `FFT(N=${N}) ≡ 朴素 DFT(最大偏差 ${worst.toExponential(2)})`);
    }
    const N = 1024, re = new Float64Array(N), im = new Float64Array(N);
    for (let i = 0; i < N; i++) re[i] = r();
    const orig = Float64Array.from(re);
    E.fft(re, im, false); E.fft(re, im, true);
    let w = 0; for (let i = 0; i < N; i++) w = Math.max(w, Math.abs(re[i] - orig[i]));
    assert(w < 1e-12, `FFT 正逆往返还原(最大偏差 ${w.toExponential(2)})`);
    const a = new Float64Array(256), b = new Float64Array(256);
    for (let i = 0; i < 256; i++) a[i] = r();
    let e1 = 0; for (let i = 0; i < 256; i++) e1 += a[i] * a[i];
    E.fft(a, b, false);
    let e2 = 0; for (let i = 0; i < 256; i++) e2 += a[i] * a[i] + b[i] * b[i];
    near(e2 / 256, e1, 1e-9, 'Parseval 定理 Σ|X|²/N = Σ|x|²');
    let threw = false;
    try { E.fft(new Float64Array(100), new Float64Array(100), false); } catch (e) { threw = true; }
    assert(threw, '非 2 的幂长度会抛错');
  }

  /* ── A2. 窗函数相干增益 / 等效噪声带宽 ── */
  for (const [t, cg, enbw] of [['rect', 1, 1.0], ['hann', 0.5, 1.5], ['hamming', 0.54, 1.3628], ['blackman', 0.35875, 2.0044]]) {
    const st = E.windowStats(E.windowFn(t, 8192));
    near(st.coherentGain, cg, 1e-9, `${t} 相干增益 = ${cg}`);
    near(st.enbw, enbw, 0.002, `${t} 等效噪声带宽 ≈ ${enbw} bin`);
  }

  /* ── A3. 幅度还原(精确 DFT 口径)+ 峰值频率细化 ── */
  {
    const N = 8192;
    for (const win of ['hann', 'hamming', 'blackman']) {
      for (const [f, amp] of [[440, 0.5], [1000, 0.25], [97.3, 0.8], [5000.7, 0.1]]) {
        const x = E.generate({ fs: FS, n: N, freq: f, amp, type: 'sine' });
        const sp = E.spectrum(x, FS, { size: N, window: win });
        const pk = E.findPeaks(sp, { count: 1, minFreq: 20, samples: x })[0];
        near(Math.pow(10, pk.db / 20), amp, amp * 0.02, `${win} ${f}Hz 幅度 ${amp} 还原`);
        near(pk.freq, f, 0.5, `${win} ${f}Hz 峰值频率细化`);
      }
    }
    const xs = E.generate({ fs: FS, n: N, freq: 1000, amp: 0.5, type: 'sine' });
    const sp = E.spectrum(xs, FS, { size: N, window: 'hann' });
    near(E.findPeaks(sp, { count: 1, samples: xs })[0].db, -6.0206, 0.02, '振幅 0.5 正弦 = −6.02 dBFS');
    // 半 bin 偏移时抛物线插值会系统性高估幅度,这正是要走精确 DFT 的原因
    near(E.findPeaks(sp, { count: 1 })[0].db, -6.0206, 0.35, '仅抛物线插值时偏差仍 < 0.35 dB');
    let worstCents = 0;
    const bin = FS / N;
    for (let i = 0; i < 40; i++) {
      const f = 200 + i * 47.3 + bin * 0.5;                       // 刻意落在半 bin
      const x = E.generate({ fs: FS, n: N, freq: f, amp: 0.4, type: 'sine' });
      const got = E.refineFreq(x, FS, Math.round(f / bin) * bin);
      worstCents = Math.max(worstCents, Math.abs(1200 * Math.log2(got / f)));
    }
    assert(worstCents < 0.5, `refineFreq 最坏偏差 ${worstCents.toFixed(4)} 音分 < 0.5`);
  }

  /* ── A4. NSDF(FFT 版)≡ NSDF(朴素版)—— 独立 oracle ── */
  {
    const fs = 8000, W = 1024, r = E.rng(99);
    for (const type of ['sine', 'saw', 'square']) {
      const x = E.generate({ fs, n: W, freq: 220, amp: 0.5, type });
      for (let i = 0; i < W; i++) x[i] += 0.02 * r();
      const a = E.nsdfCurve(x, fs, { min: 60 }), b = E.nsdfNaive(x, fs, { min: 60 });
      let worst = 0;
      for (let t = 1; t < b.length; t++) worst = Math.max(worst, Math.abs(a[t] - b[t]));
      assert(worst < 1e-9, `NSDF(FFT) ≡ NSDF(朴素) [${type}] 偏差 ${worst.toExponential(2)}`);
    }
  }

  /* ── A5. 音高检测:40 组精度 + 缺失基频 + 抗噪 + 静音闸 ── */
  {
    const N = 8192;
    let worst = 0, worstAt = '';
    for (const type of ['sine', 'saw', 'square', 'tri']) {
      for (const f of [82.41, 110, 146.83, 220, 329.63, 440, 587.33, 880, 1318.5, 2000]) {
        const p = E.detectPitch(E.generate({ fs: FS, n: N, freq: f, amp: 0.5, type }), FS, { min: 40, max: 2400 });
        const c = Math.abs(1200 * Math.log2(p.freq / f));
        if (c > worst) { worst = c; worstAt = `${type}@${f}`; }
      }
    }
    assert(worst < 1.0, `40 组(4 波形 × 10 频率)音高最坏偏差 ${worst.toFixed(3)} 音分 [${worstAt}]`);

    const x = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      const t = i / FS;
      x[i] = 0.3 * (Math.sin(2 * Math.PI * 440 * t) + Math.sin(2 * Math.PI * 660 * t) + Math.sin(2 * Math.PI * 880 * t));
    }
    near(E.detectPitch(x, FS, { min: 40, max: 2400 }).freq, 220, 0.3, '缺失基频(440/660/880)仍判定 f₀=220');

    const r = E.rng(4242);
    const y = E.generate({ fs: FS, n: N, freq: 293.66, amp: 0.4, type: 'saw' });
    for (let i = 0; i < N; i++) y[i] += 0.08 * r();
    const q = E.detectPitch(y, FS, { min: 40, max: 2400 });
    assert(Math.abs(1200 * Math.log2(q.freq / 293.66)) < 3, `含噪锯齿 D4 偏差 ${(1200 * Math.log2(q.freq / 293.66)).toFixed(2)} 音分`);

    const z = E.detectPitch(new Float64Array(N), FS);
    assert(z.freq === 0 && z.reason === 'quiet', '静音返回 freq=0 / quiet');
    const wn = new Float64Array(N), rr = E.rng(1);
    for (let i = 0; i < N; i++) wn[i] = 0.5 * rr();
    const wp = E.detectPitch(wn, FS, { min: 40, max: 2400 });
    assert(wp.freq === 0 || wp.clarity < 0.9, `白噪不产生高置信音高(clarity ${wp.clarity.toFixed(2)})`);
  }

  /* ── A6. 音名与律制 ── */
  {
    near(E.noteFreq(0, 440, 'equal', 0), 440, 1e-9, 'A4 = 440');
    near(E.noteFreq(-9, 440, 'equal', 0), 261.6256, 1e-3, 'C4 = 261.626');
    near(E.noteFreq(3, 440, 'equal', 0), 523.2511, 1e-3, 'C5 = 523.251');
    near(E.noteFreq(-48, 440, 'equal', 0), 27.5, 1e-6, 'A0 = 27.5');
    assert(['A4', 'C4', 'B3', 'C5', 'A♯4'].join() ===
      [0, -9, -10, 3, 1].map((k) => E.noteName(k).label).join(), '音名/八度编号正确');
    for (let k = -40; k <= 40; k++) {
      assert(E.parseNote(E.noteName(k).label.replace('♯', '#')) === k, `parseNote ∘ noteName 往返 ${k}`);
    }
    assert(E.parseNote('Bb3') === -11 && E.parseNote('xx') === null && E.parseNote('H4') === null, 'parseNote 处理降号与非法输入');
    for (let k = -24; k <= 24; k++) near(E.noteFreq(k, 440, 'equal', 0) / 440, Math.pow(2, k / 12), 1e-9, `平均律 ${k} 半音比`);
    const c = E.freqToNote(440, 440, 'equal', 0);
    assert(c.label === 'A4' && Math.abs(c.cents) < 1e-9, 'freqToNote(440) = A4 0 音分');
    assert(E.freqToNote(466.1638, 440, 'equal', 0).label === 'A♯4', '466.164 → A♯4');
    near(E.freqToNote(440, 432, 'equal', 0).cents, 31.7667, 1e-3, 'A4 基准 432 时 440 Hz = +31.77 音分');
    // 律制音程 ≡ 有理数比值(独立 oracle)
    const ratio = (temp, semi) => E.noteFreq(-9 + semi, 440, temp, 0) / E.noteFreq(-9, 440, temp, 0);
    near(ratio('just', 7), 3 / 2, 1e-9, '纯律五度 = 3/2');
    near(ratio('just', 4), 5 / 4, 1e-9, '纯律大三度 = 5/4');
    near(ratio('just', 5), 4 / 3, 1e-9, '纯律四度 = 4/3');
    near(ratio('pyth', 7), 3 / 2, 1e-9, '毕氏五度 = 3/2');
    near(ratio('pyth', 4), 81 / 64, 1e-9, '毕氏大三度 = 81/64');
    near(ratio('mean', 4), 5 / 4, 1e-9, '中庸大三度 = 5/4(纯)');
    near(ratio('mean', 7), Math.pow(5, 0.25), 1e-9, '中庸五度 = 5^(1/4)');
    near(1200 * Math.log2(ratio('just', 7) / Math.pow(2, 7 / 12)), 1.955, 1e-2, '纯律五度比平均律高 1.955 音分');
    for (const t of Object.keys(E.TEMPERAMENTS)) {
      const cs = E.TEMPERAMENTS[t].cents;
      assert(cs.length === 12 && cs[0] === 0 && cs.every((v, i) => i === 0 || v > cs[i - 1]) && cs[11] < 1200,
        `${t} 音分表单调递增且 < 1200`);
      near(E.noteFreq(-9, 440, t, 0), E.noteFreq(-9, 440, 'equal', 0), 1e-9, `${t} 的主音 C4 = 平均律 C4`);
    }
    near(E.noteFreq(0, 440, 'just', 9), 440, 1e-9, '纯律以 A 为主音时 A4 仍 = 440');
    assert(Math.abs(E.noteFreq(0, 440, 'just', 0) - 440) > 3, '纯律以 C 为主音时 A4 目标不再是 440');
    // 乐器空弦
    assert(E.INSTRUMENTS.guitar.strings.map((n) => E.noteName(n).label).join(' ') === 'E2 A2 D3 G3 B3 E4', '吉他空弦 EADGBE');
    assert(E.INSTRUMENTS.ukulele.strings.map((n) => E.noteName(n).label).join(' ') === 'G4 C4 E4 A4', '尤克里里 GCEA(high-G)');
    near(E.noteFreq(E.INSTRUMENTS.guitar.strings[0], 440, 'equal', 0), 82.4069, 1e-3, '吉他 6 弦 E2 = 82.41 Hz');
    near(E.noteFreq(E.INSTRUMENTS.bass.strings[0], 440, 'equal', 0), 41.2034, 1e-3, '贝斯 4 弦 E1 = 41.20 Hz');
    near(E.noteFreq(E.INSTRUMENTS.violin.strings[3], 440, 'equal', 0), 659.2551, 1e-3, '小提琴 E5 = 659.26 Hz');
  }

  /* ── A7. 双二阶:解析响应 ≡ 真的滤一段正弦(独立 oracle)── */
  {
    near(E.chainResponse([E.designBiquad('lowpass', 1000, Math.SQRT1_2, 0, FS)], 1000, FS).db, -3.0103, 1e-6,
      'Butterworth 低通在 f0 恰为 −3.0103 dB');
    near(E.chainResponse([E.designBiquad('highpass', 1000, Math.SQRT1_2, 0, FS)], 1000, FS).db, -3.0103, 1e-6,
      'Butterworth 高通在 f0 恰为 −3.0103 dB');
    for (const g of [-18, -6, 3, 12]) {
      near(E.chainResponse([E.designBiquad('peaking', 2000, 2, g, FS)], 2000, FS).db, g, 1e-9, `峰值 EQ 在 f0 精确给出 ${g} dB`);
    }
    assert(E.chainResponse([E.designBiquad('notch', 3000, 4, 0, FS)], 3000, FS).db < -100, '陷波在 f0 深度 < −100 dB');
    near(E.chainResponse([E.designBiquad('bandpass', 1000, 1, 0, FS)], 1000, FS).db, 0, 1e-9, '带通在 f0 = 0 dB');
    near(E.chainResponse([E.designBiquad('lowshelf', 200, 0.707, 9, FS)], 1, FS).db, 9, 0.05, '低搁架在近直流 = +9 dB');
    near(E.chainResponse([E.designBiquad('highshelf', 4000, 0.707, -8, FS)], 23000, FS).db, -8, 0.05, '高搁架在近奈奎斯特 = −8 dB');
    for (const f of [100, 1000, 8000]) {
      near(E.chainResponse([E.designBiquad('allpass', 1200, 1.4, 0, FS)], f, FS).mag, 1, 1e-9, `全通在 ${f}Hz 幅度恒为 1`);
    }
    const lp = [E.designBiquad('lowpass', 500, 0.707, 0, FS)];
    near(E.chainResponse(lp, 4000, FS).db - E.chainResponse(lp, 2000, FS).db, -12.04, 0.6, '二阶低通阻带 ≈ −12 dB/oct');

    // ★ 真的滤一段正弦,量稳态幅度与相移
    const measure = (secs, f) => {
      const N = 60000, x = new Float64Array(N);
      for (let i = 0; i < N; i++) x[i] = Math.sin(2 * Math.PI * f * i / FS);
      const y = E.applyChain(x, secs);
      const skip = 20000;
      let sr = 0, si = 0;
      for (let i = skip; i < N; i++) { const a = 2 * Math.PI * f * i / FS; sr += y[i] * Math.cos(a); si += y[i] * Math.sin(a); }
      const M = N - skip;
      return { db: 20 * Math.log10(2 * Math.sqrt(sr * sr + si * si) / M), phase: Math.atan2(sr, si) * 180 / Math.PI };
    };
    const cases = [
      [['lowpass', 800, 0.707, 0], [200, 800, 3000]],
      [['highpass', 300, 1.2, 0], [100, 300, 2000]],
      [['peaking', 1500, 3, 9], [1000, 1500, 2500]],
      [['peaking', 1500, 1, -12], [1500, 4000]],
      [['bandpass', 1000, 2, 0], [500, 1000, 2000]],
      [['lowshelf', 400, 0.707, 6], [80, 400, 5000]],
      [['highshelf', 3000, 0.707, -9], [500, 3000, 12000]],
      [['allpass', 900, 0.9, 0], [300, 900, 4000]]
    ];
    let worstDb = 0, worstPh = 0;
    for (const [[type, f0, Q, g], freqs] of cases) {
      const secs = [E.designBiquad(type, f0, Q, g, FS)];
      for (const f of freqs) {
        const m = measure(secs, f), a = E.chainResponse(secs, f, FS);
        worstDb = Math.max(worstDb, Math.abs(m.db - a.db));
        let dp = m.phase - a.phase;
        while (dp > 180) dp -= 360;
        while (dp < -180) dp += 360;
        worstPh = Math.max(worstPh, Math.abs(dp));
      }
    }
    assert(worstDb < 0.02, `解析幅频 ≡ 实测滤波幅度(最大偏差 ${worstDb.toFixed(5)} dB)`);
    assert(worstPh < 0.5, `解析相频 ≡ 实测相移(最大偏差 ${worstPh.toFixed(4)}°)`);

    const A = E.designBiquad('highpass', 120, 0.7, 0, FS), B = E.designBiquad('peaking', 2500, 3, 8, FS);
    for (const f of [80, 500, 2500, 9000]) {
      near(E.chainResponse([A, B], f, FS).db,
        E.chainResponse([A], f, FS).db + E.chainResponse([B], f, FS).db, 1e-9, `级联在 ${f}Hz = 两段 dB 之和`);
    }
    assert(E.isStable(E.designBiquad('lowpass', 1000, 10, 0, FS)), '高 Q 低通仍稳定');
    assert(!E.isStable({ b0: 1, b1: 0, b2: 0, a1: 0, a2: 1.5 }), '|a2|>1 判为不稳定');
    // 跨帧状态连续:分两帧 ≡ 一次性
    {
      const secs = [E.designBiquad('lowpass', 700, 1.1, 0, FS), E.designBiquad('peaking', 2000, 2, 5, FS)];
      const N = 4096, x = new Float64Array(N), r = E.rng(31337);
      for (let i = 0; i < N; i++) x[i] = r() * 0.4;
      const whole = E.applyChain(x, secs);
      const st = [];
      const p1 = E.applyChain(x.slice(0, 2048), secs, st), p2 = E.applyChain(x.slice(2048), secs, st);
      let worst = 0;
      for (let i = 0; i < 2048; i++) worst = Math.max(worst, Math.abs(whole[i] - p1[i]), Math.abs(whole[2048 + i] - p2[i]));
      assert(worst < 1e-12, `跨帧滤波状态连续(偏差 ${worst.toExponential(2)})`);
    }
  }

  /* ── A7b. 频响极值与 −3 dB 穿越:网格扫描 + 精修 ── */
  {
    const pk = [E.designBiquad('peaking', 1000, 1, 12, FS)];
    const ex = E.chainExtrema(pk, FS);
    near(ex.maxF, 1000, 0.05, `峰值 EQ 的极值频率精修到 1000 Hz(得 ${ex.maxF.toFixed(3)},网格点只能给到 995.7)`);
    near(ex.maxDb, 12, 1e-6, '峰值 EQ 的极值 = +12 dB');
    const nt = [E.designBiquad('notch', 3000, 4, 0, FS)];
    const en = E.chainExtrema(nt, FS);
    near(en.minF, 3000, 0.5, `陷波谷底精修到 3000 Hz(得 ${en.minF.toFixed(3)})`);
    assert(en.minDb < -120, `陷波谷底深度 < −120 dB(得 ${en.minDb.toFixed(1)})`);
    for (const [type, f0] of [['lowpass', 1000], ['highpass', 300], ['lowpass', 4000]]) {
      const secs = [E.designBiquad(type, f0, Math.SQRT1_2, 0, FS)];
      const ref = Math.max(E.chainExtrema(secs, FS).maxDb, 0);
      const f3 = E.chainCrossing(secs, FS, ref, -3);
      assert(f3 !== null, `${type} ${f0}Hz 找得到 −3 dB 穿越点`);
      near(E.chainResponse(secs, f3, FS).db - ref, -3, 1e-4, `${type} 的 −3 dB 穿越点自洽(f=${f3.toFixed(2)} Hz)`);
      assert(Math.abs(f3 - f0) / f0 < 0.05, `Butterworth ${type} 的 −3 dB 点 ≈ f0(${f3.toFixed(1)} vs ${f0})`);
    }
    // Q>1/√2 的低通是谐振型:通带里先冒一个峰,−3 dB 点(相对峰值)因此落在 f0 之上 —— 这是对的
    {
      const rs = [E.designBiquad('lowpass', 4000, 1.2, 0, FS)];
      const ex = E.chainExtrema(rs, FS);
      assert(ex.maxDb > 1 && ex.maxF < 4000, `Q=1.2 低通在 f0 之下冒出谐振峰(+${ex.maxDb.toFixed(2)} dB @ ${ex.maxF.toFixed(0)} Hz)`);
      const f3 = E.chainCrossing(rs, FS, ex.maxDb, -3);
      assert(f3 > 4000, `谐振低通的 −3 dB 点落在 f0 之上(${f3.toFixed(0)} Hz)`);
      near(E.chainResponse(rs, f3, FS).db - ex.maxDb, -3, 1e-4, '谐振低通的 −3 dB 穿越点自洽');
    }
    assert(E.chainCrossing([E.designBiquad('allpass', 900, 1, 0, FS)], FS, 0, -3) === null, '全通不存在 −3 dB 穿越点');
  }

  /* ── A8. 发生器与 THD ── */
  {
    const N = 16384;
    const thdOf = (type, f0) => {
      const x = E.generate({ fs: FS, n: N, freq: f0, amp: 0.8, type });
      return E.thd(E.spectrum(x, FS, { size: N, window: 'blackman' }), f0, { samples: x }).thd;
    };
    const nmax = Math.floor(FS / 2 / 440);
    let sq = 0, sw = 0, tr = 0;
    for (let k = 3; k <= nmax; k++) {
      if (k % 2 === 1) { sq += 1 / (k * k); tr += 1 / (k * k * k * k); }
      sw += 1 / (k * k);
    }
    sw += 1 / 4;                                        // 锯齿含偶次谐波,补上 n=2
    near(thdOf('square', 440), Math.sqrt(sq), 0.004, `方波 THD ≈ ${Math.sqrt(sq).toFixed(4)}`);
    near(thdOf('saw', 440), Math.sqrt(sw), 0.004, `锯齿 THD ≈ ${Math.sqrt(sw).toFixed(4)}`);
    near(thdOf('tri', 440), Math.sqrt(tr), 0.002, `三角 THD ≈ ${Math.sqrt(tr).toFixed(4)}`);
    assert(thdOf('sine', 440) < 0.002, '纯正弦 THD ≈ 0');
    {
      const x = E.generate({ fs: FS, n: N, freq: 500, amp: 0.8, type: 'square' });
      const h = E.thd(E.spectrum(x, FS, { size: N, window: 'blackman' }), 500, { samples: x }).harmonics;
      near(h[2].amp / h[0].amp, 1 / 3, 0.005, '方波 3 次谐波 = 基波的 1/3');
      near(h[4].amp / h[0].amp, 1 / 5, 0.005, '方波 5 次谐波 = 基波的 1/5');
      assert(h[1].db < h[0].db - 60, `方波偶次谐波被抑制(2 次 ${h[1].db.toFixed(1)} dB)`);
    }
    {
      const x = E.generate({ fs: FS, n: N, freq: 8000, amp: 0.6, type: 'saw' });
      const pk = E.findPeaks(E.spectrum(x, FS, { size: N, window: 'blackman' }), { count: 6, minDb: -70 });
      assert(pk.length === 2, `8 kHz 锯齿在 24 kHz 奈奎斯特下只有 2 根谱线(得 ${pk.length})`);
    }
    {
      const x = E.generate({ fs: FS, n: N, freq: 1000, freq2: 1300, amp: 0.6, type: 'twotone' });
      const pk = E.findPeaks(E.spectrum(x, FS, { size: N, window: 'blackman' }), { count: 4, minDb: -70 })
        .map((p) => p.freq).sort((a, b) => a - b);
      assert(pk.length === 2 && Math.abs(pk[0] - 1000) < 0.5 && Math.abs(pk[1] - 1300) < 0.5, '双音 = 1000 + 1300');
      const y = E.generate({ fs: FS, n: N, freq: 440, amp: 0.6, type: 'chord', chord: 'major' });
      const p2 = E.findPeaks(E.spectrum(y, FS, { size: N, window: 'blackman' }), { count: 5, minDb: -70 })
        .map((p) => p.freq).sort((a, b) => a - b);
      assert(p2.length === 3, `大三和弦 3 根谱线(得 ${p2.length})`);
      near(p2[1], 440 * Math.pow(2, 4 / 12), 0.5, '大三和弦第二音 = 554.37');
      near(p2[2], 440 * Math.pow(2, 7 / 12), 0.5, '大三和弦第三音 = 659.26');
    }
    for (const type of ['sine', 'square', 'saw', 'tri', 'chord', 'twotone', 'white', 'pink', 'sweep']) {
      const m = E.meters(E.generate({ fs: FS, n: 4096, freq: 440, amp: 0.5, type, rand: E.rng(5), pinkState: { b0: 0, b1: 0, b2: 0 } }));
      assert(m.peak <= 0.75 && m.rms > 0 && isFinite(m.rms), `${type} 峰值 ${m.peak.toFixed(3)} 未爆表且有能量`);
    }
    {
      const a = E.generate({ fs: FS, n: 1024, freq: 440, amp: 0.5, type: 'sine', t0: 0 });
      const b = E.generate({ fs: FS, n: 1024, freq: 440, amp: 0.5, type: 'sine', t0: 1024 });
      const whole = E.generate({ fs: FS, n: 2048, freq: 440, amp: 0.5, type: 'sine', t0: 0 });
      let worst = 0;
      for (let i = 0; i < 1024; i++) worst = Math.max(worst, Math.abs(a[i] - whole[i]), Math.abs(b[i] - whole[1024 + i]));
      assert(worst < 1e-12, `发生器跨帧相位连续(偏差 ${worst.toExponential(2)})`);
    }
    // 噪声谱斜率:白噪 ≈ 0、粉噪 ≈ −3 dB/oct
    const slope = (type) => {
      const x = E.generate({ fs: FS, n: 1 << 17, freq: 1, amp: 0.9, type, rand: E.rng(0xbeef), pinkState: { b0: 0, b1: 0, b2: 0 } });
      const sp = E.spectrum(x, FS, { size: 1 << 15, window: 'hann' });
      const pts = [125, 250, 500, 1000, 2000, 4000, 8000].map((fc) => {
        let p = 0, cnt = 0;
        for (let k = 1; k < sp.db.length; k++) {
          const f = sp.freqs[k];
          if (f >= fc / Math.SQRT2 && f < fc * Math.SQRT2) { p += sp.mag[k] * sp.mag[k]; cnt++; }
        }
        return { x: Math.log2(fc), y: 10 * Math.log10(p / cnt) };
      });
      const mx = pts.reduce((s, p) => s + p.x, 0) / pts.length, my = pts.reduce((s, p) => s + p.y, 0) / pts.length;
      let num = 0, den = 0;
      for (const p of pts) { num += (p.x - mx) * (p.y - my); den += (p.x - mx) * (p.x - mx); }
      return num / den;
    };
    const sw2 = slope('white'), sp2 = slope('pink');
    assert(Math.abs(sw2) < 0.6, `白噪声谱斜率 ${sw2.toFixed(2)} dB/oct ≈ 0`);
    assert(Math.abs(sp2 + 3) < 0.8, `粉噪声谱斜率 ${sp2.toFixed(2)} dB/oct ≈ −3`);
    {
      const fe = E.findPeaks(E.spectrum(E.generate({ fs: FS, n: 8192, amp: 0.6, type: 'sweep', t0: 0 }), FS, { size: 8192, window: 'hann' }), { count: 1 })[0].freq;
      const fl = E.findPeaks(E.spectrum(E.generate({ fs: FS, n: 8192, amp: 0.6, type: 'sweep', t0: FS * 5 }), FS, { size: 8192, window: 'hann' }), { count: 1 })[0].freq;
      assert(fl > fe * 8, `扫频由低到高(0s ≈ ${fe.toFixed(0)}Hz → 5s ≈ ${fl.toFixed(0)}Hz)`);
    }
  }

  /* ── A9. 仪表与边界 ── */
  {
    const N = 48000, x = new Float64Array(N);
    for (let i = 0; i < N; i++) x[i] = Math.sin(2 * Math.PI * 100 * i / FS);
    const m = E.meters(x);
    near(m.rms, Math.SQRT1_2, 1e-4, '正弦 RMS = 1/√2');
    near(m.crest, Math.SQRT2, 1e-4, '正弦波峰因数 = √2');
    near(m.rmsDb, -3.0103, 1e-3, '满幅正弦 RMS = −3.01 dBFS');
    near(E.dbfs(0.5), -6.0206, 1e-3, 'dbfs(0.5) = −6.02');
    assert(E.dbfs(0) < -200 && isFinite(E.dbfs(0)), 'dbfs(0) 不产生 −Infinity/NaN');
    assert(E.designBiquad('lowpass', 999999, 0.7, 0, FS).f0 < FS / 2, '超奈奎斯特频率被夹住');
    assert(E.designBiquad('lowpass', -5, 0, 0, FS).f0 >= 1, '负频率被夹住');
    assert(isFinite(E.designBiquad('peaking', 1000, 0.0001, 24, FS).b0), '极小 Q 不产生 NaN');
    assert(E.freqToNote(0, 440, 'equal', 0) === null && E.freqToNote(-3, 440, 'equal', 0) === null, 'freqToNote 非正频率返回 null');
    assert(E.generate({ fs: FS, n: 2048, freq: 19000, amp: 0.5, type: 'square' }).every((v) => isFinite(v)), '近奈奎斯特方波仍为有限值');
    const zsp = E.spectrum(new Float64Array(4096), FS, { size: 4096, window: 'hann' });
    assert(zsp.db.every((v) => isFinite(v)) && zsp.db[10] < -200, '全零输入的谱为有限极小值');
    assert(E.findPeaks(zsp, { count: 5, minDb: -80 }).length === 0, '全零输入无峰值');
    assert(E.generate({ fs: FS, n: 1024, freq: 440, amp: 0, type: 'sine' }).every((v) => v === 0), '幅度 0 输出全零');
  }

  /* ══════════════ B. 浏览器断言 ══════════════ */
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Number(document.body.dataset.frames || 0) >= 2, null, { timeout: 20000 });

  // 全程等帧计数收敛,零 waitForTimeout(2026-07-06 教训)
  const settle = async (act, k = 4) => {
    if (act) await act();
    const start = Number(await page.evaluate(() => document.body.dataset.frames || 0));
    await page.waitForFunction((s) => Number(document.body.dataset.frames || 0) >= s, start + k, { timeout: 20000 });
  };
  const txt = async (sel) => (await page.textContent(sel)).trim();
  const num = async (sel) => parseFloat((await txt(sel)).replace(/−/g, '-').replace(/[^\d.eE+-]/g, ''));
  const disp = (sel) => page.evaluate((s) => getComputedStyle(document.querySelector(s)).display, sel);
  const rows = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll(s + ' tbody tr'))
    .map((tr) => Array.from(tr.children).map((td) => td.textContent.trim())), sel);
  const setNum = async (sel, v) => { await page.fill(sel, String(v)); await page.dispatchEvent(sel, 'input'); };
  const setRange = async (sel, v) => page.evaluate(([s, val]) => {
    const el = document.querySelector(s);
    el.value = String(val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, [sel, v]);

  assert(await page.getAttribute('a.sl-back', 'href') === '../../', '顶部有返回工具集链接');
  assert(/声音实验室/.test(await txt('h1')), '标题正确');

  /* ── B1. 调音器:默认 440 Hz 正弦 = A4 0 音分 ── */
  await settle();
  assert(await txt('#sl-note') === 'A4', `440 Hz 判为 A4(得 ${await txt('#sl-note')})`);
  near(await num('#sl-cents'), 0, 0.5, '440 Hz 在 A4 基准下 0 音分');
  near(parseFloat(await txt('#sl-hz')), 440, 0.1, '读数频率 = 440.00 Hz');
  assert(await txt('#sl-verdict-text') === '准了', '判定为「准了」');
  assert((await page.getAttribute('#sl-notecard', 'class')).includes('sl-tuned'), '音准时卡片进入 tuned 态');

  // 换到 C4 / A♯4
  await settle(() => setNum('#sl-freq', 261.63));
  assert(await txt('#sl-note') === 'C4', `261.63 Hz 判为 C4(得 ${await txt('#sl-note')})`);
  near(await num('#sl-cents'), 0, 1, 'C4 偏差 ≈ 0 音分');
  await settle(() => setNum('#sl-freq', 466.16));
  assert(await txt('#sl-note') === 'A♯4', `466.16 Hz 判为 A♯4(得 ${await txt('#sl-note')})`);

  // 明显走音:445 Hz ⇒ +19.6 音分、判「偏高 · 调松」
  await settle(() => setNum('#sl-freq', 445));
  near(await num('#sl-cents'), 1200 * Math.log2(445 / 440), 0.5, '445 Hz = +19.56 音分');
  assert(await txt('#sl-verdict-text') === '偏高 · 调松', `445 Hz 判偏高(得 ${await txt('#sl-verdict-text')})`);
  await settle(() => setNum('#sl-freq', 435));
  assert(await txt('#sl-verdict-text') === '偏低 · 调紧', '435 Hz 判偏低');

  // A4 基准改 432:同一个 440 Hz 变成 +31.77 音分
  await settle(() => setNum('#sl-freq', 440));
  await settle(() => setRange('#sl-a4', 432));
  near(await num('#sl-cents'), 31.7667, 0.5, 'A4 基准 432 时 440 Hz = +31.77 音分');
  assert(/432\.0 Hz/.test(await txt('#sl-a4-out')), 'A4 读数显示 432.0 Hz');
  await settle(() => setRange('#sl-a4', 440));

  // 律制:纯律 + 主音 C ⇒ A4 目标 = C4×5/3,440 Hz 变成 +15.6 音分
  await settle(() => page.selectOption('#sl-temp', 'just'));
  const expJust = 1200 * Math.log2(440 / (440 * Math.pow(2, -9 / 12) * 5 / 3));
  near(await num('#sl-cents'), expJust, 0.5, `纯律(主音 C)下 440 Hz = ${expJust.toFixed(2)} 音分`);
  assert(/5\/4/.test(await txt('#sl-temp-note')), '律制说明提到纯律大三度 5/4');
  // 主音换成 A ⇒ 回到 0 音分
  await settle(() => page.selectOption('#sl-tonic', '9'));
  near(await num('#sl-cents'), 0, 0.5, '纯律主音换成 A 后 440 Hz 回到 0 音分');
  await settle(() => page.selectOption('#sl-temp', 'equal'));
  await settle(() => page.selectOption('#sl-tonic', '0'));

  /* ── B2. 乐器空弦表 ── */
  {
    const st = await rows('#sl-tbl-strings');
    assert(st.length === 6, `吉他 6 根空弦(得 ${st.length})`);
    // 吉他 1 弦是最高音的 E4、6 弦才是最低的 E2(数组按音高从低到高存,序号必须反着编)
    assert(st[0][0] === '6 弦 · E2', `最低音那根是 6 弦 E2(得 ${st[0][0]})`);
    assert(st[5][0] === '1 弦 · E4', `最高音那根是 1 弦 E4(得 ${st[5][0]})`);
    assert(st[4][0] === '2 弦 · B3' && st[1][0] === '5 弦 · A2', '中间各弦序号连续且方向正确');
    near(parseFloat(st[0][1]), 82.41, 0.01, '6 弦目标 82.41 Hz');
    near(parseFloat(st[5][1]), 329.63, 0.01, '1 弦目标 329.63 Hz');
    // 弹一个略低于标准的 6 弦 E2
    await settle(() => setNum('#sl-freq', 81.5));
    const st2 = await rows('#sl-tbl-strings');
    near(parseFloat(st2[0][2].replace('−', '-')), 1200 * Math.log2(81.5 / 82.4069), 1, '6 弦偏差 = −19.2 音分');
    assert(st2[0][3] === '偏低', `6 弦判偏低(得 ${st2[0][3]})`);
    assert(st2[1][2] === '—', '其余弦不给偏差读数');
    const onRow = await page.evaluate(() => document.querySelectorAll('#sl-tbl-strings tr.sl-rowon').length);
    assert(onRow === 1, `只有最接近的那根弦被高亮(得 ${onRow})`);
    // 换乐器
    await settle(() => page.selectOption('#sl-inst', 'bass'));
    const bs = await rows('#sl-tbl-strings');
    assert(bs.length === 4, '贝斯 4 根弦');
    assert(bs[0][0] === '4 弦 · E1' && bs[3][0] === '1 弦 · G2', `贝斯弦序 4→1(得 ${bs[0][0]} … ${bs[3][0]})`);
    await settle(() => page.selectOption('#sl-inst', 'none'));
    assert((await rows('#sl-tbl-strings'))[0][0].includes('自由音高'), '自由音高时不比对空弦');
    await settle(() => page.selectOption('#sl-inst', 'guitar'));
  }

  /* ── B3. 频谱:方波的奇次谐波阶梯 + THD ── */
  await settle(() => page.click('#sl-tab-spectrum'));
  await settle(() => page.selectOption('#sl-wave', 'square'));
  await settle(() => setNum('#sl-freq', 500), 6);
  near(await num('#sl-ro-f0'), 500, 0.3, '基频读数 = 500 Hz');
  {
    const pk = await rows('#sl-tbl-peaks');
    assert(pk.length === 8, `峰值表 8 行(得 ${pk.length})`);
    near(parseFloat(pk[0][1]), 500, 0.3, '第 1 峰 = 500 Hz');
    near(parseFloat(pk[1][1]), 1500, 0.5, '第 2 峰 = 1500 Hz(3 次谐波)');
    near(parseFloat(pk[2][1]), 2500, 0.5, '第 3 峰 = 2500 Hz(5 次谐波)');
    const d1 = parseFloat(pk[0][2].replace('−', '-')), d2 = parseFloat(pk[1][2].replace('−', '-')), d3 = parseFloat(pk[2][2].replace('−', '-'));
    near(d1 - d2, 20 * Math.log10(3), 0.15, '3 次谐波比基波低 9.54 dB');
    near(d1 - d3, 20 * Math.log10(5), 0.15, '5 次谐波比基波低 13.98 dB');
    assert(pk[0][3] === 'B4', `500 Hz 音名 = B4(得 ${pk[0][3]})`);
    near(parseFloat(pk[0][4].replace('−', '-')), 1200 * Math.log2(500 / 493.8833), 0.3, '500 Hz = B4 +21.3 音分');
    assert(pk[1][5] === '×3' && pk[2][5] === '×5', `相对 f₀ 列标出 ×3 / ×5(得 ${pk[1][5]} / ${pk[2][5]})`);
    // 独立算一遍期望 THD(只数引擎会统计的前 40 次谐波)
    let s = 0;
    for (let k = 3; k <= 40; k += 2) s += 1 / (k * k);
    near(await num('#sl-ro-thd'), Math.sqrt(s) * 100, 0.6, `方波 THD ≈ ${(Math.sqrt(s) * 100).toFixed(2)}%`);
  }
  // 正弦几乎无失真
  await settle(() => page.selectOption('#sl-wave', 'sine'), 6);
  assert(await num('#sl-ro-thd') < 0.5, `正弦 THD < 0.5%(得 ${await txt('#sl-ro-thd')})`);
  assert((await rows('#sl-tbl-peaks')).length === 1, '纯正弦只有 1 个峰');
  // FFT 长度与窗函数会改分辨率 / ENBW
  near(await num('#sl-ro-bin'), 48000 / 8192, 0.01, '8192 点 @48k = 5.86 Hz/bin');
  await settle(() => page.selectOption('#sl-fft', '2048'));
  near(await num('#sl-ro-bin'), 48000 / 2048, 0.01, '2048 点 = 23.44 Hz/bin');
  await settle(() => page.selectOption('#sl-fft', '8192'));
  near(await num('#sl-ro-enbw'), 1.5, 0.01, 'Hann 的 ENBW = 1.5 bin');
  await settle(() => page.selectOption('#sl-win', 'blackman'));
  near(await num('#sl-ro-enbw'), 2.0044, 0.01, 'Blackman–Harris 的 ENBW = 2.0044 bin');
  await settle(() => page.selectOption('#sl-win', 'hann'));

  /* ── B4. 滤波器:设计 → 频响读数 → 真的改变信号谱(端到端)── */
  await settle(() => page.click('#sl-tab-filter'));
  // 默认第 1 段 80 Hz 高通:在 80 Hz 恰好 −3.01 dB
  {
    const coef = await rows('#sl-tbl-coef');
    assert(coef.length === 5, '系数表 5 行');
    assert(/高通 80 Hz/.test(coef[0][1]), `第 1 段 = 高通 80 Hz(得 ${coef[0][1]})`);
    const q = E.designBiquad('highpass', 80, 0.707, 0, 48000);
    near(parseFloat(coef[0][2]), q.b0, 1e-6, '系数 b₀ 与引擎一致');
    near(parseFloat(coef[0][5]), q.a1, 1e-6, '系数 a₁ 与引擎一致');
    assert(coef[1][1] === '旁路', '未启用段显示旁路');
    assert(await txt('#sl-ro-nsec') === '1 / 5', '生效段数 1 / 5');
  }
  // 换成 1 kHz +12 dB 峰值 EQ
  await settle(() => page.selectOption('#sl-sec-type-0', 'peaking'));
  await settle(() => setNum('#sl-sec-f0-0', 1000));
  await settle(() => setNum('#sl-sec-q-0', 1));
  await settle(() => setNum('#sl-sec-g-0', 12));
  assert(/\+12\.00 dB @ 1\.00 kHz/.test(await txt('#sl-ro-fmax')), `峰值增益读数 = +12.00 dB @ 1.00 kHz(得 ${await txt('#sl-ro-fmax')})`);
  // 端到端:接上滤波器后,1 kHz 正弦的谱峰应真的抬高 12 dB
  await settle(() => page.click('#sl-tab-spectrum'));
  await settle(() => setNum('#sl-freq', 1000), 6);
  await setRange('#sl-amp', 0.2);
  await settle(null, 6);
  const before = parseFloat((await rows('#sl-tbl-peaks'))[0][2].replace('−', '-'));
  near(before, 20 * Math.log10(0.2), 0.1, '幅度 0.2 的 1 kHz 正弦 = −13.98 dBFS');
  await settle(() => page.check('#sl-filter-on'), 6);
  const after = parseFloat((await rows('#sl-tbl-peaks'))[0][2].replace('−', '-'));
  near(after - before, 12, 0.1, `接入 +12 dB 峰值 EQ 后谱峰真的抬高 12 dB(得 ${(after - before).toFixed(2)})`);
  // 陷波:同一频率反过来应几乎消失
  await settle(() => page.click('#sl-tab-filter'));
  await settle(() => page.selectOption('#sl-sec-type-0', 'notch'));
  await settle(() => setNum('#sl-sec-q-0', 2));
  await settle(() => page.click('#sl-tab-spectrum'), 8);
  // 陷波打在信号频率上时会把它彻底吃掉,峰值表因此进入空态 —— 直接量 1 kHz 那几个 bin 的残留
  const notched = await page.evaluate(() => {
    const sp = window.__sl.analysed.sp, k = Math.round(1000 / sp.binHz);
    let best = -999;
    for (let j = k - 2; j <= k + 2; j++) best = Math.max(best, sp.db[j]);
    return best;
  });
  assert(notched < before - 40, `1 kHz 陷波把该频率压下去 40 dB 以上(${before.toFixed(1)} → ${notched.toFixed(1)} dBFS)`);
  const emptyRow = await rows('#sl-tbl-peaks');
  assert(emptyRow.length === 1 && emptyRow[0][0] === '未检出峰值', `信号被陷波吃光后峰值表进入空态(得 ${JSON.stringify(emptyRow[0])})`);
  await settle(() => page.uncheck('#sl-filter-on'), 6);
  // 预设
  await settle(() => page.click('#sl-tab-filter'));
  await settle(() => page.selectOption('#sl-fpreset', 'phone'));
  assert(await txt('#sl-ro-nsec') === '4 / 5', `电话音预设启用 4 段(得 ${await txt('#sl-ro-nsec')})`);
  {
    const secs = await page.evaluate(() => window.__sl.activeSections().map((s) => [s.type, Math.round(s.f0)]));
    assert(JSON.stringify(secs) === JSON.stringify([['highpass', 300], ['highpass', 300], ['lowpass', 3400], ['lowpass', 3400]]),
      `电话音 = 两级 300 Hz 高通 + 两级 3400 Hz 低通(得 ${JSON.stringify(secs)})`);
    // 四级级联在通带内接近 0 dB、在 100 Hz 深衰减
    const at = await page.evaluate(() => {
      const E2 = window.__sl.engine, s = window.__sl.activeSections();
      return { mid: E2.chainResponse(s, 1000, 48000).db, low: E2.chainResponse(s, 100, 48000).db, high: E2.chainResponse(s, 12000, 48000).db };
    });
    assert(at.mid > -1.5 && at.low < -25 && at.high < -25,
      `电话音带通形状正确(100Hz ${at.low.toFixed(1)} / 1kHz ${at.mid.toFixed(1)} / 12kHz ${at.high.toFixed(1)} dB)`);
  }
  await settle(() => page.click('#sl-freset'));
  assert(await txt('#sl-ro-nsec') === '0 / 5', '「全部旁路」后 0 段生效');
  assert(await txt('#sl-ro-f3db') === '—', '零段时没有 −3 dB 点');
  assert(await txt('#sl-ro-fmax') === '0.00 dB', '零段时峰值增益 0.00 dB');
  await settle(() => page.selectOption('#sl-fpreset', 'voice'));

  /* ── B5. 声谱图 ── */
  await settle(() => page.click('#sl-tab-spectro'));
  await settle(() => page.click('#sl-tab-spectrum'));
  await settle(() => setNum('#sl-freq', 1000));
  await settle(() => page.click('#sl-tab-spectro'), 8);
  {
    const peak = await txt('#sl-ro-sgpeak');
    near(parseFloat(peak) * (/kHz/.test(peak) ? 1000 : 1), 1000, 60, `声谱图最强频段 ≈ 1 kHz(得 ${peak})`);
    assert(await txt('#sl-ro-sgdim') === '256 × 600', '声谱图 256 频率行 × 600 时间列');
    // 换成 4 kHz,最强频段应跟着走
    await settle(() => page.click('#sl-tab-spectrum'));
    await settle(() => setNum('#sl-freq', 4000));
    await settle(() => page.click('#sl-tab-spectro'), 8);
    const p2 = await txt('#sl-ro-sgpeak');
    near(parseFloat(p2) * (/kHz/.test(p2) ? 1000 : 1), 4000, 220, `换 4 kHz 后最强频段跟随(得 ${p2})`);
  }

  /* ── B6. 冻结 ── */
  await settle(() => page.click('#sl-tab-tuner'));
  await settle(() => setNum('#sl-freq', 440));
  await page.click('#sl-freeze');
  const f1 = await page.evaluate(() => Number(document.body.dataset.frames));
  const f2 = await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(Number(document.body.dataset.frames))))));
  assert(f1 === f2, `冻结后帧计数停住(${f1} → ${f2})`);
  assert(await txt('#sl-ro-state') === '已冻结', '状态读数显示已冻结');
  assert(await txt('#sl-freeze') === '继续', '按钮变成「继续」');
  await page.click('#sl-freeze');
  await settle();
  assert(await txt('#sl-ro-state') === '发生器', '继续后状态回到发生器');

  /* ── B7. 画布真的画了东西 + 每张图上的文字零重叠 ── */
  const inkOf = (sel) => page.evaluate((s) => {
    const c = document.querySelector(s), g = c.getContext('2d');
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let n = 0, off = 0;
    for (let i = 0; i < d.length; i += 4) {
      const v = d[i] + d[i + 1] + d[i + 2];
      if (v < 700) n++;                                                   // 浅底上的深色笔迹
      if (Math.abs(d[i] - 12) + Math.abs(d[i + 1] - 10) + Math.abs(d[i + 2] - 9) > 24) off++;   // 偏离深底
    }
    return { dark: n / (c.width * c.height), offBg: off / (c.width * c.height) };
  }, sel);
  for (const [t, sels] of [
    ['tuner', ['#sl-cv-wave', '#sl-cv-gauge', '#sl-cv-hist']],
    ['spectrum', ['#sl-cv-spectrum']],
    ['spectro', ['#sl-cv-spectro']],
    ['filter', ['#sl-cv-filter']]
  ]) {
    await settle(() => page.click('#sl-tab-' + t), 3);
    for (const sel of sels) {
      const ink = await inkOf(sel);
      // 声谱图是深底浅笔,其余是浅底深笔
      const ok = sel === '#sl-cv-spectro' ? ink.offBg > 0.005 : ink.dark > 0.004;
      assert(ok, `${sel} 上有实际笔迹(深笔 ${(ink.dark * 100).toFixed(2)}% / 离底 ${(ink.offBg * 100).toFixed(2)}%)`);
    }
  }
  {
    const placer = await page.evaluate(() => window.__slPlacer);
    for (const key of ['wave', 'gauge', 'hist', 'spectrum', 'spectro', 'filter']) {
      const p = placer[key];
      assert(p && p.drawn.length > 0, `${key} 画布通过 placer 落笔了文字(${p ? p.drawn.length : 0} 段)`);
      for (let i = 0; i < p.drawn.length; i++) {
        for (let j = i + 1; j < p.drawn.length; j++) {
          const a = p.drawn[i], b = p.drawn[j];
          const hit = !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
          assert(!hit, `${key} 画布上「${a.text}」与「${b.text}」文字盒重叠`);
        }
      }
      assert(p.dropped <= 3, `${key} 画布被避让掉的标签不超过 3 个(得 ${p.dropped})`);
    }
  }

  /* ── B7b. 谐波丰富的信号下,峰值标注必须真的落在画布上 ──
     纯正弦只有 1 个峰,即使标注被谐波标尺全挡掉,dropped ≤ 3 也照样放行;
     必须用锯齿这种多峰信号才测得出来(2026-08-08 靠人工看图才发现 5 个标注一个没画)。*/
  await settle(() => page.click('#sl-tab-spectrum'));
  await settle(() => page.selectOption('#sl-wave', 'saw'));
  await settle(() => setNum('#sl-freq', 220), 8);
  {
    const p = await page.evaluate(() => window.__slPlacer.spectrum);
    const labels = p.drawn.map((d) => d.text);
    const peakLabels = labels.filter((t) => /Hz · [A-G]/.test(t));
    assert(peakLabels.length === 5, `锯齿的前 5 个谐波都标了频率+音名(得 ${peakLabels.length} 个:${JSON.stringify(peakLabels)})`);
    assert(/220\.0 Hz · A3/.test(peakLabels[0] || ''), `基频标注写着 220.0 Hz · A3(得 ${peakLabels[0]})`);
    assert(labels.filter((t) => /^×\d+$/.test(t)).length >= 3, `谐波标尺标了 ×n 序号(得 ${JSON.stringify(labels.filter((t) => /^×\d+$/.test(t)))})`);
    // 峰值标注一个都不能少;挤掉的只允许是优先级最低的 ×n 谐波序号
    assert(p.dropped <= 2, `多峰谱下最多只让 ×n 序号被挤掉(得 ${p.dropped})`);
  }
  await settle(() => page.selectOption('#sl-wave', 'sine'));
  await settle(() => setNum('#sl-freq', 440), 6);

  /* ── B8. 结构守卫 ── */
  await settle(() => page.click('#sl-tab-tuner'));
  for (const k of ['spectrum', 'spectro', 'filter']) {
    assert((await disp('#sl-panel-' + k)) === 'none', `#sl-panel-${k} 计算样式为 none`);
  }
  assert((await disp('#sl-panel-tuner')) !== 'none', '当前面板可见');
  // 键盘可用:聚焦 tab 后回车切换
  await page.focus('#sl-tab-filter');
  await settle(() => page.keyboard.press('Enter'));
  assert((await disp('#sl-panel-filter')) !== 'none', '键盘回车能切换标签页');
  await settle(() => page.click('#sl-tab-tuner'));
  // 信号源切换:发生器 / 麦克风面板互斥
  assert((await disp('#sl-mic-box')) === 'none', '默认隐藏麦克风面板');
  await settle(() => page.click('#sl-src-mic'));
  assert((await disp('#sl-gen-box')) === 'none' && (await disp('#sl-mic-box')) !== 'none', '切到麦克风后发生器面板隐藏');
  await settle(() => page.click('#sl-src-gen'));
  assert((await disp('#sl-mic-box')) === 'none', '切回发生器后麦克风面板隐藏');
  // 波形相关的条件控件
  assert((await disp('#sl-chord-box')) === 'none', '非和弦波形时隐藏和弦选择');
  await settle(() => page.selectOption('#sl-wave', 'chord'));
  assert((await disp('#sl-chord-box')) !== 'none' && (await disp('#sl-freq2-box')) === 'none', '和弦波形显示和弦选择、隐藏第二频率');
  await settle(() => page.selectOption('#sl-wave', 'twotone'));
  assert((await disp('#sl-freq2-box')) !== 'none' && (await disp('#sl-chord-box')) === 'none', '双音波形显示第二频率');
  await settle(() => page.selectOption('#sl-wave', 'sine'));

  // text-transform:uppercase 会把 Hz→HZ、dBFS→DBFS 悄悄改写,中文不受影响所以极易漏
  // (2026-08-06 circuit-bench 撞过一次,2026-08-08 本工具的表头与读数标题又撞一次)
  {
    const mangled = await page.evaluate(() => {
      const bad = [];
      document.querySelectorAll('th, dt, label, .sl-label, .sl-eyebrow, .sl-chip').forEach((el) => {
        const t = el.textContent.trim();
        if (/\b(HZ|KHZ|DBFS|DBC|DB)\b/.test(t)) bad.push(t);
      });
      return bad;
    });
    assert(mangled.length === 0, `没有被 uppercase 改写的单位符号(异常:${JSON.stringify(mangled)})`);
    const tt = await page.evaluate(() => [
      getComputedStyle(document.querySelector('thead th')).textTransform,
      getComputedStyle(document.querySelector('.sl-ro dt')).textTransform
    ]);
    assert(tt.every((v) => v === 'none'), `表头与读数标题不做大写化(得 ${JSON.stringify(tt)})`);
    assert(await txt('#sl-tbl-peaks thead th:nth-child(2)') === '频率 Hz', '峰值表表头保留小写 Hz');
    assert(await txt('#sl-tbl-peaks thead th:nth-child(3)') === '电平 dBFS', '峰值表表头保留 dBFS 大小写');
    assert(await page.evaluate(() => document.querySelector('#sl-ro-f0').previousElementSibling.textContent) === '基频 f0',
      '读数标题保留小写 f0(下标用 <sub> 而非 U+2080,后者在小字号下和「。」难分)');
    assert(await page.evaluate(() => document.querySelector('#sl-tbl-coef thead th:nth-child(3)').innerHTML) === 'b<sub>0</sub>',
      '系数表头用 <sub> 标记下标');
  }

  // 控件既不越界也没被压塌(2026-08-07 教训:浮动 legend 曾把输入框挤成 34px)
  const boxBad = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('input, select, button').forEach((el) => {
      if (el.offsetParent === null) return;
      const r = el.getBoundingClientRect();
      const min = el.type === 'checkbox' ? 18 : (el.tagName === 'BUTTON' ? 52 : 100);
      if (r.width < min || r.height < 18) out.push([el.id || el.className, Math.round(r.width), Math.round(r.height)]);
    });
    return out;
  });
  assert(boxBad.length === 0, `所有可见控件尺寸达标(异常:${JSON.stringify(boxBad)})`);
  const escaped = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.sl-card').forEach((box) => {
      const br = box.getBoundingClientRect();
      box.querySelectorAll('input, select, table, canvas, .sl-btn').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0) return;
        if (r.left < br.left - 2 || r.right > br.right + 2) out.push(el.id || el.tagName);
      });
    });
    return out;
  });
  assert(escaped.length === 0, `子元素未逃出所在卡片(异常:${escaped.join(',')})`);
  for (const w of [1280, 390]) {
    await page.setViewportSize({ width: w, height: 900 });
    await settle(null, 2);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert(over <= 1, `${w}px 视口下无横向溢出(超出 ${over}px)`);
  }
  await page.setViewportSize({ width: 1280, height: 850 });
  await settle(null, 2);

  /* ── B9. 配方库 localStorage 往返 ── */
  await settle(() => setNum('#sl-freq', 329.63));
  await settle(() => page.selectOption('#sl-inst', 'violin'));
  await page.fill('#sl-save-name', '小提琴 E 弦');
  await page.click('#sl-save');
  assert(/已保存/.test(await txt('#sl-save-msg')), '保存配方给出反馈');
  await settle(() => setNum('#sl-freq', 880));
  await settle(() => page.selectOption('#sl-inst', 'guitar'));
  await settle(() => page.click('#sl-load'), 6);
  assert(await page.inputValue('#sl-freq') === '329.63', '载入配方恢复频率 329.63');
  assert(await page.inputValue('#sl-inst') === 'violin', '载入配方恢复乐器');
  // 刷新后自动恢复上次状态
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Number(document.body.dataset.frames || 0) >= 2, null, { timeout: 20000 });
  assert(await page.inputValue('#sl-freq') === '329.63', '刷新后自动恢复上次输入');
  assert(await page.inputValue('#sl-inst') === 'violin', '刷新后恢复乐器选择');
  const savedOpts = await page.evaluate(() => Array.from(document.querySelectorAll('#sl-saved option')).map((o) => o.value));
  assert(savedOpts.includes('小提琴 E 弦'), '配方列表在刷新后仍在');
  await settle(() => page.click('#sl-del'));
  assert(/已删除/.test(await txt('#sl-save-msg')), '删除配方给出反馈');
  await settle(() => page.selectOption('#sl-inst', 'guitar'));
  await settle(() => setNum('#sl-freq', 440));

  /* ── B10. CSV 导出:拦 Blob 读真实内容 ── */
  await page.evaluate(() => {
    window.__csv = null;
    const orig = URL.createObjectURL.bind(URL);
    URL.createObjectURL = (b) => { b.text().then((t) => { window.__csv = t; }); return orig(b); };
    HTMLAnchorElement.prototype.click = function () { /* 阻止真实下载 */ };
  });
  await page.click('#sl-export');
  await page.waitForFunction(() => window.__csv !== null, null, { timeout: 10000 });
  {
    const csv = await page.evaluate(() => window.__csv);
    const lines = csv.trim().split('\n');
    assert(lines.length === 4096, `CSV = 表头 + 4095 个 bin(得 ${lines.length} 行)`);
    assert(lines[0] === '频率Hz,幅度dBFS,线性幅度', 'CSV 表头正确');
    const first = lines[1].split(','), last = lines[lines.length - 1].split(',');
    near(parseFloat(first[0]), 48000 / 8192, 0.01, 'CSV 第一行频率 = 1 个 bin');
    near(parseFloat(last[0]), 48000 / 8192 * 4095, 0.1, 'CSV 末行频率 ≈ 奈奎斯特');
    // 440 Hz 那一行应是全表最大
    let bestI = 1, bestV = -999;
    for (let i = 1; i < lines.length; i++) {
      const v = parseFloat(lines[i].split(',')[1]);
      if (v > bestV) { bestV = v; bestI = i; }
    }
    near(parseFloat(lines[bestI].split(',')[0]), 440, 6, 'CSV 中最大幅度出现在 440 Hz 附近');
  }

  /* ── B11. 麦克风路径不崩(无授权时优雅降级)── */
  await page.click('#sl-src-mic');
  await page.click('#sl-mic-start');
  await page.waitForFunction(() => /不可用|就绪|不支持/.test(document.querySelector('#sl-mic-state').textContent), null, { timeout: 15000 });
  assert(/不可用|就绪|不支持/.test(await txt('#sl-mic-state')), `麦克风路径给出明确状态(得 ${await txt('#sl-mic-state')})`);
  await settle(() => page.click('#sl-src-gen'), 4);
  assert(await txt('#sl-ro-state') === '发生器', '麦克风失败后回落到发生器仍在跑');

  /* ── B12. 设计语言守卫:ElevenLabs ── */
  await page.mouse.move(4, 4);
  await page.addStyleTag({ content: '*{transition:none!important}' });
  await settle(null, 2);
  {
    const brand = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const cta = document.querySelector('.sl-btn:not(.sl-btn--ghost)');
      const card = document.querySelector('.sl-card');
      const badge = document.querySelector('.sl-eyebrow');
      const tabOn = document.querySelector('.sl-tab--on');
      return {
        page: getComputedStyle(document.body).backgroundColor,
        h1Weight: getComputedStyle(h1).fontWeight,
        h1Family: getComputedStyle(h1).fontFamily,
        ctaBg: getComputedStyle(cta).backgroundColor,
        ctaRadius: getComputedStyle(cta).borderRadius,
        cardRadius: getComputedStyle(card).borderRadius,
        cardBg: getComputedStyle(card).backgroundColor,
        badgeRadius: getComputedStyle(badge).borderRadius,
        badgeSpacing: getComputedStyle(badge).letterSpacing,
        tabOnBg: getComputedStyle(tabOn).backgroundColor,
        orbs: document.querySelectorAll('.sl-orb').length
      };
    });
    assert(brand.page === 'rgb(245, 245, 245)', `画布 = off-white #f5f5f5(得 ${brand.page})`);
    assert(brand.h1Weight === '300', `display 字重 300 —— 绝不加粗(得 ${brand.h1Weight})`);
    assert(/Waldenburg|serif|Garamond|Georgia/i.test(brand.h1Family), `display 走衬线族(得 ${brand.h1Family})`);
    assert(brand.ctaBg === 'rgb(41, 37, 36)', `主 CTA = 墨水 #292524,没有饱和品牌色(得 ${brand.ctaBg})`);
    assert(brand.ctaRadius === '9999px', `CTA 是药丸形(得 ${brand.ctaRadius})`);
    assert(brand.badgeRadius === '9999px', `徽标也是药丸形(得 ${brand.badgeRadius})`);
    assert(brand.badgeSpacing === '0.96px', `小标签字距 0.96px(得 ${brand.badgeSpacing})`);
    assert(brand.cardRadius === '16px', `卡片圆角 16px(得 ${brand.cardRadius})`);
    assert(brand.cardBg === 'rgb(255, 255, 255)', `卡片纯白(得 ${brand.cardBg})`);
    assert(brand.tabOnBg === 'rgb(12, 10, 9)', `选中标签 = 墨水填充(得 ${brand.tabOnBg})`);
    assert(brand.orbs === 4, `4 个大气渐变球(得 ${brand.orbs})`);
  }

  /* ── 人工过目用的多视图截图(.gitignore 已覆盖 view-*.png)── */
  const shoot = async (t, name) => {
    await settle(() => page.click('#sl-tab-' + t), 4);
    await page.locator('#sl-panel-' + t).evaluate((el) => el.scrollIntoView({ block: 'start' }));
    await settle(null, 2);
    await screenshot(name);
  };
  await settle(() => page.selectOption('#sl-wave', 'saw'));
  await settle(() => setNum('#sl-freq', 220), 6);
  await shoot('spectrum', 'view-spectrum.png');
  await shoot('filter', 'view-filter.png');
  await settle(() => page.selectOption('#sl-wave', 'sweep'), 10);
  await shoot('spectro', 'view-spectro.png');
  await settle(() => page.selectOption('#sl-wave', 'sine'));
  await settle(() => setNum('#sl-freq', 329.63), 6);
  await shoot('tuner', 'view-tuner.png');
  await page.setViewportSize({ width: 414, height: 900 });
  await settle(null, 3);
  await page.evaluate(() => window.scrollTo(0, 0));
  await screenshot('view-narrow.png');
  await page.setViewportSize({ width: 1280, height: 850 });
  await settle(null, 3);

  /* ── 首页卡片缩略图 ── */
  await settle(() => page.click('#sl-tab-tuner'));
  await setRange('#sl-amp', 0.5);
  await settle(() => setNum('#sl-freq', 440), 6);
  await page.evaluate(() => window.scrollTo(0, 330));
  await settle(null, 3);
  await screenshot('thumb.png');
}
