// 空气动力学工作台 · 浏览器集成测试
// 断言分三类：①拿**独立参照实现**算出的真值对拍页面读数（ORACLE 块，机械注入）；
// ②结构守卫（[hidden] 计算样式、控件塌缩、窄屏溢出、text-transform、图上文字不重叠）；
// ③页面自己公布的东西必须现场成立（能力清单 33 条、收敛表、离线对拍规模数字）。

// ORACLE-BEGIN
// 下面这一块由 oracle/inject_oracle.mjs 从 oracle/browser.json 生成，**不要手改**。
// 真值来源：ambiance（ISA）/ aerosandbox AirfoilInviscid（面元法）/ sympy（薄翼闭式）/
// numpy 复变（卡门-特雷夫茨解析解）/ 独立 Python 升力线 / scipy 数值极值。
const ORACLE = {
  "kt_cl": 1.054384016227049,
  "naca2412_cl_asb": 0.7415672544598426,
  "naca2412_alphaL0": -2.0772404049039856,
  "atmo3000": {
    "T": 268.65919845164115,
    "p": 70121.14406807562,
    "rho": 0.9092543452517026,
    "a": 328.58355338394585
  },
  "speed120at3000": {
    "cas_kt": 120,
    "tas_kt": 139.03446128911446,
    "mach": 0.2176782905288459,
    "eas_kt": 119.78352977918047
  },
  "wing_default": {
    "S": 13.200000000000001,
    "AR": 9.166666666666666,
    "CL": 0.4635820798572532,
    "CDi": 0.0076244687742008845,
    "e": 0.9787738940543874
  },
  "wing_elliptic": {
    "S": 9.424777519776438,
    "AR": 10.610330035925566,
    "CL": 0.46135002849191664,
    "CDi": 0.006385315164910722,
    "e": 1
  },
  "perf_ga_2500": {
    "LDmax": 13.096094373106412,
    "Vstall_kt": 59.55902871597146,
    "Vmd_kt": 86.7412064534871,
    "rho": 0.9569544683963819
  },
  "offline_points": 26720,
  "caps_total": 33
};
// ORACLE-END

export default async ({ page, toolURL, screenshot, assert }) => {
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(toolURL, { waitUntil: 'load' });
  await page.waitForFunction(() => window.AE_READY === true, null, { timeout: 40000 });

  // ── 小工具 ──
  const val = async (k) => page.$eval(`[data-k="${k}"] dd`, (el) => el.textContent.trim());
  const num = async (k) => {
    const t = await val(k);
    const m = t.replace(/[^\d.eE+-]/g, '');
    return parseFloat(m);
  };
  const near = (a, b, tol, msg) => assert(Math.abs(a - b) <= tol, `${msg}：${a} vs ${b}（容差 ${tol}）`);
  const rel = (a, b, r, msg) => assert(Math.abs(a - b) <= Math.abs(b) * r + 1e-12, `${msg}：${a} vs ${b}（相对 ${r}）`);
  const setVal = async (sel, v) => {
    await page.fill(sel, String(v));
    await page.dispatchEvent(sel, 'change');
    await page.waitForTimeout(80);
  };
  const setSel = async (sel, v) => { await page.selectOption(sel, v); await page.waitForTimeout(80); };
  const tab = async (name) => { await page.click('#ae-tab-' + name); await page.waitForTimeout(160); };

  // ───────── 1. 基本结构 ─────────
  assert(await page.title() === '空气动力学工作台 · Aero Lab', '标题');
  assert(await page.$eval('.ae-back', (e) => e.getAttribute('href')) === '../../', '返回工具集链接');
  assert((await page.$$('.ae-tabbtn')).length === 5, '五个标签页');

  // [hidden] 守卫：断计算样式而不是属性（2026-07-20 教训）
  const hiddenPane = await page.$eval('#ae-pane-wing', (el) => getComputedStyle(el).display);
  assert(hiddenPane === 'none', `未选中的面板必须真的不显示，实际 display=${hiddenPane}`);
  assert(await page.$eval('#ae-pane-foil', (el) => getComputedStyle(el).display) !== 'none', '当前面板要显示');

  // ───────── 2. 翼型页：对拍 aerosandbox / sympy ─────────
  assert((await val('npan')) === '200', '默认面元数 = 200（输入框里填的就是真实面元数）');
  const cl0 = await num('cl'), clkj0 = await num('clkj');
  rel(cl0, ORACLE.naca2412_cl_asb, 0.02, 'NACA 2412 α=4° 的 cl 对 aerosandbox AirfoilInviscid');
  near(cl0, clkj0, 0.02, '压力积分与环量两条升力路径');
  const res0 = await num('res');
  assert(res0 < 1e-9, `物面无穿透残差应 ≈ 0，实际 ${res0}`);
  const cd0 = await num('cd');
  assert(Math.abs(cd0) < 5e-3, `无粘阻力应 ≈ 0（达朗贝尔），实际 ${cd0}`);
  near(await num('al0'), ORACLE.naca2412_alphaL0, 0.02, '薄翼零升迎角对 sympy 闭式积分');
  near(await num('tmax'), 12.0, 0.05, 'NACA 2412 最大厚度 12%');
  const slope = await num('slope');
  rel(slope, 2 * Math.PI * (1 + 0.77 * 0.12), 0.03, '升力线斜率对厚度修正的 2π(1+0.77t/c)');

  // 对称翼型在 0° 迎角必须无升力无力矩（不依赖任何实现的性质）
  await setVal('#ae-foil-code', '0012');
  await setVal('#ae-foil-alpha', 0);
  const clSym = await num('cl'), cmSym = await num('cm');
  assert(Math.abs(clSym) < 1e-6 && Math.abs(cmSym) < 1e-6, `对称翼型 α=0 应当 cl=cm=0，实际 ${clSym} / ${cmSym}`);

  // 卡门-特雷夫茨：页面读数与**解析解**对拍（跨来源核对）
  await setSel('#ae-foil-src', 'kt');
  await setVal('#ae-foil-tau', 10);
  await setVal('#ae-foil-eps', 0.1);
  await setVal('#ae-foil-camb', 0.05);
  await setVal('#ae-foil-alpha', 6);
  await setVal('#ae-foil-n', 400);
  await page.waitForTimeout(200);
  const exact = await num('exact'), err = await num('exacterr'), clkt = await num('clkj');
  // 容差下界 = 页面显示位数的半个最小单位（这里显示 4 位小数 ⇒ 5e-5）
  near(exact, ORACLE.kt_cl, 5e-5, '页面算的解析解 cl 对 numpy 独立实现');
  assert(err < 2e-3, `N=400 时面元解与解析解偏差应 < 2e-3，实际 ${err}`);
  near(clkt, ORACLE.kt_cl, 2e-3, '面元解（环量路径）对解析解');

  // 迎角增大 ⇒ 升力增大（真实交互后的真实输出）
  await setVal('#ae-foil-alpha', 9);
  const cl9 = await num('clkj');
  assert(cl9 > clkt + 0.2, `α 从 6° 加到 9° 升力应显著增大：${clkt} → ${cl9}`);

  // 非法输入要给出可读的错误，而不是静默失败
  await setSel('#ae-foil-src', 'naca4');
  await setVal('#ae-foil-code', '99');
  const errBox = await page.$eval('#ae-foil-err', (el) => ({ hidden: el.hidden, txt: el.textContent }));
  assert(!errBox.hidden && /4 个数字/.test(errBox.txt), `非法翼型代号要报错，实际：${JSON.stringify(errBox)}`);
  await setVal('#ae-foil-code', '4412');
  await setVal('#ae-foil-alpha', 4);
  assert(await page.$eval('#ae-foil-err', (el) => getComputedStyle(el).display) === 'none', '恢复后错误条要真的藏起来');
  // 有弯度的翼型在正迎角下，上表面在 30% 弦处必须是负压
  const cpRow = await page.$$eval('#ae-foil-table tbody tr', (rows) =>
    rows.map((r) => [...r.cells].map((c) => parseFloat(c.textContent))));
  assert(cpRow.length === 14, `Cp 站位表 14 行，实际 ${cpRow.length}`);
  const r30 = cpRow.find((r) => Math.abs(r[0] - 0.3) < 1e-6);
  assert(r30 && r30[1] < -0.3 && r30[1] < r30[2], `x/c=0.3 处上表面应是吸力面：${JSON.stringify(r30)}`);
  // 两列都只显示 4 位小数 ⇒ 这条恒等式只能核到 ~3e-4
  assert(Math.abs((r30[4] * r30[4] + r30[1]) - 1) < 3e-4, `V/V∞ 与 Cp 必须满足 Cp = 1 − (V/V∞)²：${r30[4]} / ${r30[1]}`);

  // ───────── 3. 机翼页：对拍独立 Python 升力线 ─────────
  await tab('wing');
  const wS = await num('S'), wAR = await num('AR'), wCL = await num('CL'), wCDi = await num('CDi'), wE = await num('e');
  rel(wS, ORACLE.wing_default.S, 1e-4, '机翼面积');
  rel(wAR, ORACLE.wing_default.AR, 1e-4, '展弦比');
  near(wCL, ORACLE.wing_default.CL, 3e-4, 'CL 对独立 Python 升力线解');
  near(wCDi, ORACLE.wing_default.CDi, 3e-5, 'CDi 对独立 Python 升力线解');
  near(wE, ORACLE.wing_default.e, 3e-4, '展向效率 e');
  near(await num('CLcheck'), wCL, 2e-4, 'CL 的第二条积分路径');
  near(await num('CLdisc'), wCL, 3e-3, '离散马蹄涡解的 CL');

  // 椭圆翼：e = 1 是不依赖实现的判据
  await setSel('#ae-wing-kind', 'elliptic');
  await setVal('#ae-wing-span', 10);
  await setVal('#ae-wing-croot', 1.2);
  await setVal('#ae-wing-twist', 0);
  await setVal('#ae-wing-alpha', 5);
  await setVal('#ae-wing-a0', 6.2832);
  await setVal('#ae-wing-al0', 0);
  await page.waitForTimeout(150);
  near(await num('e'), 1, 1e-4, '椭圆翼展向效率必须是 1');
  near(await num('CL'), ORACLE.wing_elliptic.CL, 3e-4, '椭圆翼 CL 对独立解');
  near(await num('CDi'), ORACLE.wing_elliptic.CDi, 3e-5, '椭圆翼 CDi 对独立解');
  const spanRows = await page.$$eval('#ae-wing-table tbody tr', (rows) =>
    rows.map((r) => [...r.cells].map((c) => parseFloat(c.textContent))));
  assert(spanRows.length === 11, `展向表 11 行，实际 ${spanRows.length}`);
  for (let i = 1; i < spanRows.length; i++)
    assert(spanRows[i][1] <= spanRows[i - 1][1] + 1e-9, `椭圆翼弦长应沿展向单调减小（第 ${i} 行）`);
  // 局部 cl 对椭圆翼应当沿展向基本不变（椭圆载荷的标志）
  const clLoc = spanRows.slice(0, 9).map((r) => r[3]);
  assert(Math.max(...clLoc) - Math.min(...clLoc) < 5e-3, `椭圆翼局部 cl 应基本恒定：${clLoc.join(',')}`);

  // 「用翼型页的结果」把两页串起来
  await setSel('#ae-wing-kind', 'taper');
  await page.click('#ae-wing-import');
  await page.waitForTimeout(150);
  const a0v = parseFloat(await page.inputValue('#ae-wing-a0'));
  assert(a0v > 6.5 && a0v < 7.3, `导入的翼型升力线斜率应是翼型页扫掠出来的值，实际 ${a0v}`);

  // ───────── 4. 大气与空速：对拍 ambiance ─────────
  await tab('atmo');
  near(await num('T'), ORACLE.atmo3000.T, 5e-3, '3000 m 温度对 ambiance');
  rel(await num('p'), ORACLE.atmo3000.p, 5e-6, '3000 m 气压对 ambiance');
  rel(await num('rho'), ORACLE.atmo3000.rho, 5e-6, '3000 m 密度对 ambiance');
  rel(await num('a'), ORACLE.atmo3000.a, 1e-5, '3000 m 音速对 ambiance');
  near(await num('tas'), ORACLE.speed120at3000.tas_kt, 0.02, 'CAS 120 kt @3000 m 的 TAS');
  near(await num('eas'), ORACLE.speed120at3000.eas_kt, 0.02, '同一状态的 EAS');
  near(await num('mach'), ORACLE.speed120at3000.mach, 2e-5, '同一状态的马赫数');
  near(await num('cas'), 120, 0.02, 'CAS 往返应回到输入值');
  // ΔISA 必须原样加到温度上
  await setVal('#ae-atmo-disa', 20);
  near(await num('T'), ORACLE.atmo3000.T + 20, 5e-3, 'ΔISA=+20 K 后的温度');
  const rhoHot = await num('rho');
  assert(rhoHot < ORACLE.atmo3000.rho, `热天密度应变小：${rhoHot}`);
  await setVal('#ae-atmo-disa', 0);
  const atmoRows = await page.$$eval('#ae-atmo-table tbody tr', (r) => r.length);
  assert(atmoRows === 12, `ISA 表 12 行，实际 ${atmoRows}`);

  // ───────── 5. 性能：对拍闭式与 scipy ─────────
  await tab('perf');
  rel(await num('ldmax'), ORACLE.perf_ga_2500.LDmax, 1e-4, '(L/D)max 闭式');
  near(await num('vstall'), ORACLE.perf_ga_2500.Vstall_kt, 0.1, '失速速度（2500 m）');
  near(await num('vmd'), ORACLE.perf_ga_2500.Vmd_kt, 0.1, '最小阻力速度对 scipy 求根');
  const roc = await num('roc'), hAbs = await num('habs'), rng = await num('range');
  assert(roc > 0 && roc < 20, `爬升率量级：${roc}`);
  assert(hAbs > 2500 && hAbs < 20000, `绝对升限量级：${hAbs}`);
  assert(rng > 200 && rng < 5000, `航程量级：${rng} km`);
  // 切到喷气预置：面板的显隐必须断计算样式
  await setSel('#ae-perf-preset', 'jet');
  await page.waitForTimeout(200);
  const disp = await page.evaluate(() => ({
    jet: getComputedStyle(document.getElementById('ae-perf-jetwrap')).display,
    power: getComputedStyle(document.getElementById('ae-perf-powerwrap')).display
  }));
  assert(disp.jet !== 'none' && disp.power === 'none', `切到喷气后推力面板要显示、功率面板要藏起来：${JSON.stringify(disp)}`);
  const ldJet = await num('ldmax');
  assert(ldJet > 15 && ldJet < 25, `窄体客机的 (L/D)max 量级：${ldJet}`);
  await setSel('#ae-perf-preset', 'ga');
  await page.waitForTimeout(200);

  // ───────── 6. 验证页：能力清单与收敛表都要现场跑 ─────────
  await tab('val');
  await page.click('#ae-val-run');
  await page.waitForFunction(() => document.querySelectorAll('#ae-val-table tbody tr').length > 0, null, { timeout: 60000 });
  const caps = await page.$$eval('#ae-val-table tbody tr', (rows) =>
    rows.map((r) => ({ name: r.cells[0].innerText.split('\n')[0], ok: /PASS/.test(r.cells[3].innerText) })));
  assert(caps.length === ORACLE.caps_total, `能力清单应有 ${ORACLE.caps_total} 条，实际 ${caps.length}`);
  const dead = caps.filter((c) => !c.ok);
  assert(dead.length === 0, `能力清单里有跑不过的项：${dead.map((d) => d.name).join(' / ')}`);
  const badge = await page.$eval('#ae-val-badge', (el) => [el.getAttribute('data-pass'), el.getAttribute('data-total')]);
  assert(badge[0] === String(ORACLE.caps_total) && badge[1] === String(ORACLE.caps_total), `徽章 ${badge}`);

  await page.click('#ae-val-conv');
  await page.waitForFunction(() => document.querySelectorAll('#ae-conv-table tbody tr').length >= 5, null, { timeout: 60000 });
  const conv = await page.$$eval('#ae-conv-table tbody tr', (rows) =>
    rows.map((r) => [...r.cells].map((c) => parseFloat(c.textContent))));
  assert(conv.length === 5, `收敛表 5 行，实际 ${conv.length}`);
  for (const row of conv) near(row[3], ORACLE.kt_cl, 2e-6, `收敛表里的解析解 cl（N=${row[0]}）`);
  assert(conv[4][4] < 1e-3, `N=800 时与解析解的偏差应 < 1e-3，实际 ${conv[4][4]}`);
  assert(conv[4][4] < conv[0][4] / 4, `偏差要随面元数明显下降：${conv[0][4]} → ${conv[4][4]}`);
  // 一阶格式：N·误差应当大致稳定（不超过 4 倍波动）
  const prod = conv.map((r) => r[5]);
  assert(Math.max(...prod) / Math.min(...prod) < 4, `N×误差应大致稳定（一阶收敛）：${prod.join(', ')}`);

  // 页面公布的离线对拍规模必须是钉死的那个数（跨来源：由 offline.mjs 实跑得出）
  const docTxt = await page.$eval('#ae-doc', (el) => el.innerText);
  assert(docTxt.includes(ORACLE.offline_points.toLocaleString('en-US')),
    `说明里应写明离线对拍点数 ${ORACLE.offline_points.toLocaleString('en-US')}`);
  assert(/ambiance/.test(docTxt) && /aerosandbox/.test(docTxt) && /sympy/.test(docTxt), '说明里要列出参照实现');

  // ───────── 7. 结构守卫 ─────────
  const TABS = ['foil', 'wing', 'atmo', 'perf', 'val'];
  // 7a. 控件塌缩（逐个标签页扫，隐藏面板里的控件同样要量）
  let scanned = 0;
  for (const t of TABS) {
    await tab(t);
    const bad = await page.evaluate((tid) => {
      const out = [];
      const pane = document.getElementById('ae-pane-' + tid);
      for (const el of pane.querySelectorAll('input,select,button')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        const isBtn = el.tagName === 'BUTTON';
        const minW = isBtn ? 52 : (el.type === 'checkbox' ? 18 : 100);
        if (r.width < minW || r.height < 18) out.push({ tag: el.tagName, id: el.id, w: +r.width.toFixed(1), h: +r.height.toFixed(1), minW });
      }
      return { bad: out, n: pane.querySelectorAll('input,select,button').length };
    }, t);
    scanned += bad.n;
    assert(bad.bad.length === 0, `[${t}] 控件被压塌：${JSON.stringify(bad.bad).slice(0, 300)}`);
  }
  assert(scanned >= 45, `扫到的控件数应 ≥ 45，实际 ${scanned}（扫太少说明守卫没真跑到）`);

  // 7b. text-transform：断计算样式（DOM 文本测不出 CSS 改写）
  const upper = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('th,dt,label,button,.ae-ttl')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const tt = getComputedStyle(el).textTransform;
      if (tt !== 'none') out.push({ tag: el.tagName, txt: el.textContent.slice(0, 20), tt });
    }
    return out;
  });
  assert(upper.length === 0, `不许用 text-transform 改写文字（单位会被写错）：${JSON.stringify(upper).slice(0, 300)}`);

  // 7c. 窄屏溢出：逐视口 × 逐标签页
  for (const vw of [390, 768]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of TABS) {
      await tab(t);
      await page.waitForTimeout(120);
      const info = await page.evaluate(() => {
        const over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        const culprits = [];
        if (over > 1) {
          const lim = document.documentElement.clientWidth;
          for (const el of document.querySelectorAll('body *')) {
            const r = el.getBoundingClientRect();
            if (r.right > lim + 1 && r.width > 8) culprits.push(el.tagName + '.' + (el.className || '') + '@' + Math.round(r.right));
          }
        }
        return { over, culprits: culprits.slice(0, 6) };
      });
      assert(info.over <= 1, `[${vw}px · ${t}] 横向溢出 ${info.over}px，元凶：${info.culprits.join(' | ')}`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.waitForTimeout(150);

  // 7d. 图上文字两两不重叠（DOM 断言测不出视觉重叠，只能量渲染盒）
  // 每张图的**最少**文字段数：带坐标轴的图至少 6 段，流线图/平面形状图只有注记
  const FIGS = { foil: [['ae-fig-cp', 8], ['ae-fig-stream', 2], ['ae-fig-sweep', 8], ['ae-fig-geom', 3]],
    wing: [['ae-fig-span', 8], ['ae-fig-plan', 2]], atmo: [['ae-fig-isa', 8], ['ae-fig-vconv', 8]],
    perf: [['ae-fig-req', 8], ['ae-fig-polar', 8], ['ae-fig-vn', 8], ['ae-fig-ceil', 8]] };
  let labels = 0;
  for (const t of Object.keys(FIGS)) {
    await tab(t);
    await page.waitForTimeout(150);
    for (const [id, minN] of FIGS[t]) {
      const r = await page.evaluate((fid) => {
        const svg = document.getElementById(fid);
        const boxes = [...svg.querySelectorAll('text')].map((n) => {
          const b = n.getBoundingClientRect();
          return { t: n.textContent, x: b.x, y: b.y, w: b.width, h: b.height };
        }).filter((b) => b.w > 0);
        const hits = [];
        for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i], c = boxes[j];
          if (a.x < c.x + c.w - 1 && c.x < a.x + a.w - 1 && a.y < c.y + c.h - 1 && c.y < a.y + a.h - 1)
            hits.push(a.t + ' ✕ ' + c.t);
        }
        return { n: boxes.length, hits };
      }, id);
      assert(r.hits.length === 0, `[${id}] 图上文字重叠：${r.hits.slice(0, 4).join(' / ')}`);
      assert(r.n >= minN, `[${id}] 只画出 ${r.n} 段文字（下界 ${minN}）——避让器可能把标注全丢了`);
      labels += r.n;
    }
  }
  assert(labels >= 120, `12 张图累计文字标签 ${labels} 段，太少`);

  // 7e. 读数格里的子元素不许越出格子（窄格 + 变长文本）
  const escape = await page.evaluate(() => {
    const out = [];
    for (const cell of document.querySelectorAll('.ae-read > div')) {
      const p = cell.getBoundingClientRect();
      if (p.width === 0) continue;
      for (const kid of cell.children) {
        const k = kid.getBoundingClientRect();
        if (k.width === 0) continue;
        if (k.right > p.right + 1 || k.left < p.left - 1 || k.bottom > p.bottom + 1)
          out.push(kid.textContent.slice(0, 18));
      }
    }
    return out;
  });
  assert(escape.length === 0, `读数格里有子元素溢出：${escape.slice(0, 5).join(' / ')}`);

  // ───────── 8. 收尾：缩略图 ─────────
  await tab('foil');
  await page.waitForTimeout(200);
  await page.evaluate(() => { const el = document.getElementById('ae-fig-cp'); if (el) el.scrollIntoView({ block: 'center' }); });
  await page.waitForTimeout(250);
  assert(errs.length === 0, `页面抛了异常：${errs.slice(0, 3).join(' | ')}`);
  await screenshot('thumb.png');
};
