// Integration test for 桁架工作台 · Truss Studio (Tesla design language).
// Drives the real direct-stiffness engine through the browser and asserts *structural
// facts*, not element presence: the hand-calculable 3-bar truss, method-of-sections
// chord forces (N = M/h) for Pratt and Howe, per-joint equilibrium residuals, the
// virtual-work cross-check of the displacement field, Euler buckling / section-shape
// effects, mechanism detection, and the localStorage round-trip. Plus the standing
// structural guards: [hidden] computed display (lesson 2026-07-20), boundingRect
// containment + control width/height floors (07-17 / 07-24), no horizontal overflow at
// 390px (07-23), and zero waitForTimeout anywhere (07-06).
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.body.dataset.ok === '1');
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.body.dataset.ok === '1');

  const txt = (sel) => page.evaluate((s) => {
    const el = document.querySelector(s);
    return el ? el.textContent.replace(/\s+/g, ' ').trim() : 'MISSING';
  }, sel);
  const disp = (sel) => page.evaluate((s) => {
    const el = document.querySelector(s);
    return el ? getComputedStyle(el).display : 'MISSING';
  }, sel);
  const rect = (sel) => page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height, r: r.right + scrollX, b: r.bottom + scrollY };
  }, sel);
  const inside = async (child, parent, pad = 1) => {
    const a = await rect(child), b = await rect(parent);
    assert(a && b, `both ${child} and ${parent} exist`);
    return a.x >= b.x - pad && a.r <= b.r + pad && a.y >= b.y - pad && a.b <= b.b + pad;
  };
  // 每次成功渲染都会重写 body[data-sig];等它变成目标值 = 等 DOM 真的反映了这次输入
  const sig = () => page.evaluate(() => document.body.dataset.sig);
  const settle = async (prev) => {
    await page.waitForFunction((p) => document.body.dataset.sig !== p && document.body.dataset.ok !== undefined, prev);
  };
  const setRange = async (id, value) => {
    const prev = await sig();
    await page.evaluate(({ id, value }) => {
      const el = document.getElementById(id);
      el.value = String(value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, { id, value });
    await settle(prev);
  };
  const solve = () => page.evaluate(() => {
    const r = window.__ts.result, m = window.__ts.model;
    return {
      ok: r.ok, reason: r.reason, det: r.determinacy.label, detCode: r.determinacy.code,
      sum: r.determinacy.sum, need: r.determinacy.need,
      nodes: m.nodes.length, members: m.members.length,
      maxDisp: r.maxDisp, maxUtil: r.maxUtil, mass: r.mass,
      relFx: r.equilibrium.relFx, relFy: r.equilibrium.relFy, relMz: r.equilibrium.relMz,
      joint: r.jointResidual, strain: r.strainEnergy, work: r.externalWork,
      maxT: Math.max(0, ...r.members.map((x) => x.N)),
      maxC: Math.min(0, ...r.members.map((x) => x.N)),
      zeros: r.members.filter((x) => x.kind === 'zero').length,
      presetName: m.presetName
    };
  });

  // ═══ 1) 出厂即已求解:6 节间华伦桁架 ═══════════════════════════════════
  {
    const s = await solve();
    assert(s.ok, `默认可解: ${s.reason}`);
    assert(s.presetName === '华伦桁架', `默认型式=华伦桁架 (${s.presetName})`);
    assert(s.nodes === 13 && s.members === 23, `6 节间华伦: 13 节点 / 23 杆件 (${s.nodes}/${s.members})`);
    assert(s.detCode === 'determinate' && s.sum === s.need, `静定: m+r=${s.sum}, 2j=${s.need}`);
    assert(s.joint < 1e-9, `每个节点都平衡 (${s.joint.toExponential(2)})`);
    assert(Math.abs(s.strain - s.work) / s.work < 1e-8, 'Clapeyron: 应变能 = 外力功');
  }

  // ═══ 2) 浏览器里跑的引擎 == 离线校核过的地面真值 ══════════════════════
  const eng = await page.evaluate(() => {
    const T = window.__ts.TRUSS;
    const cfg = (o) => T.buildModel(Object.assign({
      preset: 'warren', span: 24, height: 3.5, panels: 6, load: 40000,
      loadMode: 'uniform', mat: 'steel', sec: 'tube', area: 0.0024, selfWeight: false
    }, o));
    // (a) 三杆桁架:跨 4m、高 2m、顶点 10kN → 手算 5 / −7.0711 / +5 kN
    const tri = T.analyze(cfg({ preset: 'triangle', span: 4, height: 2, load: 10000 }));
    const pick = (r, a, b) => r.members.find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a));
    // (b) 截面法:普拉特下弦[4,8] = M(4)/h、豪威下弦[4,8] = M(8)/h
    const mp = cfg({ preset: 'pratt', panels: 6 }), mh = cfg({ preset: 'howe', panels: 6 });
    const rp = T.analyze(mp), rh = T.analyze(mh);
    const chord = (r, m, x0) => r.members.find((z) =>
      Math.abs(m.nodes[z.a].y) < 1e-9 && Math.abs(m.nodes[z.b].y) < 1e-9 &&
      Math.abs(Math.min(m.nodes[z.a].x, m.nodes[z.b].x) - x0) < 1e-9).N;
    // (c) 虚功法独立复核位移
    const mw = cfg({});
    const rw = T.analyze(mw);
    const vw = T.unitLoadDeflection(mw, rw.maxDispNode, 'y');
    // (d) 抽掉一根斜腹杆 → 机构
    const cut = JSON.parse(JSON.stringify(mw));
    cut.members.splice(12, 1);
    const rcut = T.analyze(cut);
    // (e) 静定桁架轴力与 EA 无关
    const a1 = T.analyze(cfg({ area: 0.0024 })), a2 = T.analyze(cfg({ area: 0.0096 }));
    const eaMax = Math.max(...a1.members.map((m, i) => Math.abs(a2.members[i].N - m.N) / Math.max(1, Math.abs(m.N))));
    // (f) 屈曲:同面积圆管 vs 实心方
    const sq = T.analyze(cfg({ preset: 'triangle', span: 4, height: 2, load: 10000, sec: 'square', area: 0.001 }));
    const tb = T.analyze(cfg({ preset: 'triangle', span: 4, height: 2, load: 10000, sec: 'tube', area: 0.001 }));
    const L = Math.hypot(2, 2);
    return {
      triL: pick(tri, 0, 2).N, triR: pick(tri, 2, 1).N, triBot: pick(tri, 0, 1).N,
      triRy: tri.reactions.find((x) => x.node === 0).ry, triRx: tri.reactions.find((x) => x.node === 0).rx,
      triKind: pick(tri, 0, 1).kind + '/' + pick(tri, 0, 2).kind,
      pratt48: chord(rp, mp, 4), howe48: chord(rh, mh, 4),
      prattDiagTension: rp.members.filter((m) => {
        const a = mp.nodes[m.a], b = mp.nodes[m.b];
        return Math.abs(a.x - b.x) > 1e-9 && Math.abs(a.y - b.y) > 1e-9 && ![0, 6].includes(m.a) && ![0, 6].includes(m.b);
      }).every((m) => m.N > 1),
      howeDiagComp: rh.members.filter((m) => {
        const a = mh.nodes[m.a], b = mh.nodes[m.b];
        return Math.abs(a.x - b.x) > 1e-9 && Math.abs(a.y - b.y) > 1e-9 && ![0, 6].includes(m.a) && ![0, 6].includes(m.b);
      }).every((m) => m.N < -1),
      vwErr: Math.abs(vw - rw.nodes[rw.maxDispNode].uy) / Math.abs(rw.nodes[rw.maxDispNode].uy),
      cutOk: rcut.ok, cutLabel: rcut.determinacy.label, eaMax,
      sqPcr: sq.members[0].Pcr, sqPcrHand: Math.PI ** 2 * 206e9 * (1e-6 / 12) / (L * L),
      pcrRatio: tb.members[0].Pcr / sq.members[0].Pcr,
      sqGoverns: sq.members[0].governs, tubeK: T.SECTIONS.tube.k
    };
  });
  const near = (a, b, tol, m) => assert(Math.abs(a - b) <= tol, `${m}: got ${a}, want ${b} ±${tol}`);
  near(eng.triRy, 5000, 1e-6, '三角桁架:左支座反力 5 kN');
  near(eng.triRx, 0, 1e-6, '三角桁架:水平反力 0');
  near(eng.triL, -7071.0678, 1e-3, '三角桁架:左斜杆 −7.0711 kN(压)');
  near(eng.triR, -7071.0678, 1e-3, '三角桁架:右斜杆 −7.0711 kN(压)');
  near(eng.triBot, 5000, 1e-6, '三角桁架:下弦 +5 kN(拉)');
  assert(eng.triKind === 'tension/compression', `拉压判别正确 (${eng.triKind})`);
  near(eng.pratt48, 80000 / 3.5, 1e-6, '截面法:普拉特下弦[4,8] = M(4)/h = 22.857 kN');
  near(eng.howe48, 128000 / 3.5, 1e-6, '截面法:豪威下弦[4,8] = M(8)/h = 36.571 kN');
  assert(eng.prattDiagTension, '普拉特内部斜腹杆全部受拉');
  assert(eng.howeDiagComp, '豪威内部斜腹杆全部受压');
  assert(eng.vwErr < 1e-7, `虚功法位移 == 刚度法位移 (相对差 ${eng.vwErr.toExponential(2)})`);
  assert(!eng.cutOk && eng.cutLabel.includes('机构'), `抽掉斜腹杆被判为机构 (${eng.cutLabel})`);
  assert(eng.eaMax < 1e-9, `静定结构轴力与截面无关 (最大相对差 ${eng.eaMax.toExponential(2)})`);
  near(eng.sqPcr, eng.sqPcrHand, 1e-3, '欧拉临界力 Pcr = π²EI/L²');
  near(eng.pcrRatio, eng.tubeK * 12, 1e-9, '同面积圆管抗屈曲 = 9.097 倍实心方');
  near(eng.pcrRatio, 9.096961, 1e-5, '屈曲比数值 9.09696');
  assert(eng.sqGoverns === 'buckle', '细长实心方压杆由屈曲控制');

  // ═══ 3) 界面读数与引擎一致 ═════════════════════════════════════════════
  {
    const s = await solve();
    const dockUtil = await txt('#ts-dock-util');
    assert(dockUtil === Math.round(s.maxUtil * 100) + '%', `底栏最大利用率 = ${Math.round(s.maxUtil * 100)}% (${dockUtil})`);
    const dockDisp = await txt('#ts-dock-disp');
    assert(dockDisp === (s.maxDisp * 1000).toFixed(2) + ' mm', `底栏挠度 = ${(s.maxDisp * 1000).toFixed(2)} mm (${dockDisp})`);
    assert((await txt('#ts-dock-det')) === '静定结构', '底栏判别 = 静定结构');
    const eq = await txt('#ts-dock-eq');
    assert(/e-\d\d?$/.test(eq) && parseFloat(eq) < 1e-9, `底栏平衡残差极小 (${eq})`);
    const stats = await txt('#ts-stats');
    assert(stats.includes('最大拉力') && stats.includes('静定判别'), '结果概览含关键指标');
    assert((await txt('#ts-title')) === '华伦桁架', 'hero 标题 = 华伦桁架');
  }

  // ═══ 4) 桁高翻倍 ⇒ 弦杆轴力精确减半(M 不变、力臂加倍);斜腹杆反而变陡变大 ══
  {
    // 追踪同一根下弦杆 [8,12](华伦 6 节间跨中节间),而不是「全局最大值」——
    // 桁高变大后全局最大拉力会换到斜腹杆上(V/sinθ),那是另一条规律。
    const chord = () => page.evaluate(() => {
      const m = window.__ts.model, r = window.__ts.result;
      const i = m.members.findIndex((z) => Math.abs(m.nodes[z.a].y) < 1e-9 && Math.abs(m.nodes[z.b].y) < 1e-9 &&
        Math.abs(Math.min(m.nodes[z.a].x, m.nodes[z.b].x) - 8) < 1e-9);
      const diag = r.members.filter((z) => {
        const a = m.nodes[z.a], b = m.nodes[z.b];
        return Math.abs(a.x - b.x) > 1e-9 && Math.abs(a.y - b.y) > 1e-9;
      });
      return { N: r.members[i].N, maxDiag: Math.max(...diag.map((z) => z.N)), maxAll: Math.max(...r.members.map((z) => z.N)) };
    });
    const a = await chord();
    near(a.N, 136000 / 3.5, 1e-6, '桁高 3.5m:下弦[8,12] = M(10)/h = 38.857 kN');
    await setRange('ts-height', 7);
    const b = await chord();
    near(b.N, 136000 / 7, 1e-6, '桁高 7m:同一根下弦 = M(10)/h = 19.429 kN(精确减半)');
    assert(Math.abs(b.N / a.N - 0.5) < 1e-9, `弦杆轴力精确减半 (${(b.N / a.N).toFixed(9)})`);
    // 斜腹杆承担剪力:N = V/sinθ。桁高加大 ⇒ 腹杆变陡 ⇒ sinθ→1 ⇒ 轴力下降并趋近 V(=20kN)
    const diagN = (h) => 20000 / (h / Math.hypot(2, h));
    assert(Math.abs(a.maxDiag - diagN(3.5)) / diagN(3.5) < 0.02,
      `桁高 3.5m 端斜腹杆 = V/sinθ = ${(diagN(3.5) / 1000).toFixed(1)} kN (实得 ${(a.maxDiag / 1000).toFixed(1)})`);
    assert(Math.abs(b.maxDiag - diagN(7)) / diagN(7) < 0.02,
      `桁高 7m 端斜腹杆 = V/sinθ = ${(diagN(7) / 1000).toFixed(1)} kN (实得 ${(b.maxDiag / 1000).toFixed(1)})`);
    assert(b.maxDiag < a.maxDiag && b.maxDiag > 20000,
      `腹杆变陡后轴力下降并仍高于剪力 20kN:${(a.maxDiag / 1000).toFixed(1)}→${(b.maxDiag / 1000).toFixed(1)} kN`);
    assert(Math.abs(b.maxAll - b.maxDiag) < 1e-9, '桁高 7m 时全局最大拉力已换成斜腹杆(弦杆降得更快)');
    assert(Math.abs(a.maxAll - a.N) < 1e-9, '桁高 3.5m 时全局最大拉力仍是下弦');
    await setRange('ts-height', 3.5);
  }

  // ═══ 5) 荷载翻倍 ⇒ 轴力与位移翻倍(线性) ═══════════════════════════════
  {
    const a = await solve();
    await setRange('ts-load', 80);
    const b = await solve();
    assert(Math.abs(b.maxT / a.maxT - 2) < 1e-9, `荷载 40→80kN 最大拉力翻倍 (${(b.maxT / a.maxT).toFixed(9)})`);
    assert(Math.abs(b.maxDisp / a.maxDisp - 2) < 1e-9, '荷载翻倍位移翻倍');
    assert(b.joint < 1e-9, '翻倍后每个节点仍平衡');
    await setRange('ts-load', 40);
  }

  // ═══ 6) 换材料:轴力不变、位移按 E 反比放大 ══════════════════════════════
  {
    const a = await solve();
    const prev = await sig();
    await page.selectOption('#ts-mat', 'wood');
    await settle(prev);
    const b = await solve();
    assert(Math.abs(b.maxT - a.maxT) / a.maxT < 1e-9, '静定:换木材轴力不变');
    assert(Math.abs(b.maxDisp / a.maxDisp - 206 / 11) / (206 / 11) < 2e-3,
      `换木材位移放大 E 比 206/11 (${(b.maxDisp / a.maxDisp).toFixed(2)})`);
    assert(b.maxUtil > a.maxUtil, '木材容许应力低 ⇒ 利用率上升');
    const p2 = await sig();
    await page.selectOption('#ts-mat', 'steel');
    await settle(p2);
  }

  // ═══ 7) 截面形状:实心方 → 圆管,稳定利用率骤降 ═══════════════════════
  {
    const p0 = await sig();
    await page.selectOption('#ts-sec', 'square');
    await settle(p0);
    const sq = await page.evaluate(() => {
      const c = window.__ts.result.members.filter((m) => m.N < 0);
      return { maxB: Math.max(...c.map((m) => m.utilBuckle)), governs: c.map((m) => m.governs) };
    });
    const p1 = await sig();
    await page.selectOption('#ts-sec', 'tube');
    await settle(p1);
    const tb = await page.evaluate(() => {
      const c = window.__ts.result.members.filter((m) => m.N < 0);
      return { maxB: Math.max(...c.map((m) => m.utilBuckle)) };
    });
    assert(Math.abs(sq.maxB / tb.maxB - 9.096961) < 1e-4,
      `同面积换圆管稳定利用率降到 1/9.097 (${(sq.maxB / tb.maxB).toFixed(4)})`);
    assert(sq.governs.some((g) => g === 'buckle'), '实心方细长压杆由屈曲控制');
  }

  // ═══ 8) 自重:反力与位移都变大,平衡仍成立 ═══════════════════════════════
  {
    const a = await solve();
    const prev = await sig();
    await page.check('#ts-sw');
    await settle(prev);
    const b = await page.evaluate(() => {
      const r = window.__ts.result;
      return {
        sumRy: r.reactions.reduce((s, x) => s + x.ry, 0), mass: r.mass,
        joint: r.jointResidual, maxDisp: r.maxDisp, G: window.__ts.TRUSS.G
      };
    });
    assert(Math.abs(b.sumRy - (40000 + b.mass * b.G)) / b.sumRy < 1e-9,
      `竖向反力 = 40kN + 自重 ${(b.mass * b.G / 1000).toFixed(2)}kN (${(b.sumRy / 1000).toFixed(3)}kN)`);
    assert(b.maxDisp > a.maxDisp, '计入自重后挠度增大');
    assert(b.joint < 1e-9, '计入自重后每个节点仍平衡');
    const p2 = await sig();
    await page.uncheck('#ts-sw');
    await settle(p2);
  }

  // ═══ 9) 荷载分布:跨中集中 vs 节点均布 ═══════════════════════════════════
  {
    const uni = await solve();
    await page.click('#ts-modes [data-mode="center"]');
    await page.waitForFunction(() => document.getElementById('ts-modes').querySelector('[data-mode="center"]').getAttribute('aria-pressed') === 'true');
    const ctr = await page.evaluate(() => {
      const m = window.__ts.model, r = window.__ts.result;
      return {
        loads: m.loads.length, node: m.loads[0].node, total: m.loads.reduce((s, l) => s + l.fy, 0),
        maxDisp: r.maxDisp, maxT: Math.max(...r.members.map((x) => x.N)), joint: r.jointResidual
      };
    });
    assert(ctr.loads === 1 && ctr.node === 3, `跨中集中落在跨中节点 N4 (${ctr.loads} 处, 节点 ${ctr.node})`);
    assert(Math.abs(ctr.total + 40000) < 1e-6, '集中荷载合力 = 40 kN');
    assert(ctr.maxDisp > uni.maxDisp, '同总量集中在跨中 ⇒ 挠度大于均布');
    assert(ctr.maxT > uni.maxT, '同总量集中在跨中 ⇒ 最大拉力大于均布');
    assert(ctr.joint < 1e-9, '集中荷载下每个节点仍平衡');
    await page.click('#ts-modes [data-mode="uniform"]');
    await page.waitForFunction(() => document.getElementById('ts-modes').querySelector('[data-mode="uniform"]').getAttribute('aria-pressed') === 'true');
  }

  // ═══ 10) 轮播切换型式:节点/杆件数与静定性逐一核对 ══════════════════════
  {
    const expect = {
      triangle: { nodes: 3, members: 3 }, warren: { nodes: 13, members: 23 },
      pratt: { nodes: 12, members: 21 }, howe: { nodes: 12, members: 21 },
      cantilever: { nodes: 10, members: 16 }, tower: { nodes: 12, members: 20 },
      roof: { nodes: 8, members: 13 }
    };
    for (const id of Object.keys(expect)) {
      await page.click(`#ts-dots [data-preset="${id}"]`);
      await page.waitForFunction((p) => document.body.dataset.preset === p && document.body.dataset.ok === '1', id);
      const s = await solve();
      assert(s.ok, `${id} 可解: ${s.reason}`);
      assert(s.nodes === expect[id].nodes && s.members === expect[id].members,
        `${id}: ${expect[id].nodes} 节点/${expect[id].members} 杆件 (实得 ${s.nodes}/${s.members})`);
      assert(s.detCode === 'determinate', `${id} 静定 (m+r=${s.sum}, 2j=${s.need})`);
      assert(s.joint < 1e-8, `${id} 每个节点平衡 (${s.joint.toExponential(2)})`);
      assert(s.relFx < 1e-8 && s.relFy < 1e-8 && s.relMz < 1e-8, `${id} 整体 ΣF/ΣM ≈ 0`);
      const cur = await page.getAttribute(`#ts-dots [data-preset="${id}"]`, 'aria-current');
      assert(cur === 'true', `${id} 圆点处于选中态`);
    }
    // 屋架含零杆(王柱在对称上弦荷载下不受力)
    await page.click('#ts-dots [data-preset="roof"]');
    await page.waitForFunction(() => document.body.dataset.preset === 'roof' && document.body.dataset.ok === '1');
    const roof = await solve();
    assert(roof.zeros >= 1, `屋架出现零杆 (${roof.zeros} 根)`);
    assert((await txt('#ts-stats')).includes('零杆'), '概览显示零杆统计');
    // 箭头前进/后退回到华伦
    await page.click('#ts-next');
    await page.waitForFunction(() => document.body.dataset.preset === 'triangle');
    await page.click('#ts-next');
    await page.waitForFunction(() => document.body.dataset.preset === 'warren' && document.body.dataset.ok === '1');
    assert((await txt('#ts-title')) === '华伦桁架', '箭头轮播回到华伦桁架');
  }

  // ═══ 11) [hidden] 守卫:断计算样式,而不是断属性(教训 2026-07-20) ══════
  {
    // 非塔架时「水平风载」按钮必须真的不可见
    assert((await disp('#ts-modes [data-mode="wind"]')) === 'none', '非塔架:风载按钮 computed display=none');
    assert((await disp('#ts-modes [data-mode="center"]')) !== 'none', '非塔架:跨中集中按钮可见');
    await page.click('#ts-dots [data-preset="tower"]');
    await page.waitForFunction(() => document.body.dataset.preset === 'tower' && document.body.dataset.ok === '1');
    assert((await disp('#ts-modes [data-mode="wind"]')) !== 'none', '塔架:风载按钮可见');
    assert((await disp('#ts-modes [data-mode="center"]')) === 'none', '塔架:跨中集中 computed display=none');
    // 切到塔架应自动改用水平风载(竖向加载会退化成两根受压柱 + 全零腹杆)
    assert((await page.getAttribute('#ts-modes [data-mode="wind"]', 'aria-pressed')) === 'true',
      '塔架默认即水平风载');
    const degenerate = await page.evaluate(() => window.__ts.result.members.filter((m) => m.kind === 'zero').length);
    assert(degenerate < 10, `塔架风载下不是退化算例(零杆 ${degenerate} 根 < 10)`);
    // 塔架水平风载:反力水平合力 = 施加值,且顶部水平位移最大
    const tw = await page.evaluate(() => {
      const r = window.__ts.result, m = window.__ts.model;
      return {
        fx: m.loads.reduce((s, l) => s + l.fx, 0),
        sumRx: r.reactions.reduce((s, x) => s + x.rx, 0),
        ux: Math.abs(r.nodes[r.maxDispNode].ux), uy: Math.abs(r.nodes[r.maxDispNode].uy),
        joint: r.jointResidual
      };
    });
    assert(Math.abs(tw.fx - 40000) < 1e-6, `塔架风载合力 40 kN (${(tw.fx / 1000).toFixed(2)})`);
    assert(Math.abs(tw.sumRx + tw.fx) / tw.fx < 1e-9, '塔架:水平反力抵消风载');
    assert(tw.ux > tw.uy, '塔架:水平风载下最大位移以水平为主');
    assert(tw.joint < 1e-8, '塔架:每个节点平衡');
    // 固定节间的型式(三角/屋架)要隐藏节间数滑杆
    await page.click('#ts-dots [data-preset="triangle"]');
    await page.waitForFunction(() => document.body.dataset.preset === 'triangle' && document.body.dataset.ok === '1');
    assert((await disp('#ts-panelfield')) === 'none', '三角桁架:节间数滑杆 computed display=none');
    await page.click('#ts-dots [data-preset="warren"]');
    await page.waitForFunction(() => document.body.dataset.preset === 'warren' && document.body.dataset.ok === '1');
    assert((await disp('#ts-panelfield')) !== 'none', '华伦桁架:节间数滑杆可见');
  }

  // ═══ 12) 节间数:改数量后拓扑与静定性都跟着变 ═══════════════════════════
  {
    await setRange('ts-panels', 10);
    const s = await solve();
    assert(s.nodes === 21 && s.members === 39, `10 节间华伦: 21 节点/39 杆件 (${s.nodes}/${s.members})`);
    assert(s.detCode === 'determinate' && s.joint < 1e-8, '10 节间仍静定且节点平衡');
    await setRange('ts-panels', 6);
  }

  // ═══ 13) 表格与详情:点击行选中,详情跟着换 ═══════════════════════════════
  {
    const rows = await page.$$eval('#ts-mbody tr', (t) => t.length);
    assert(rows === 23, `内力表 23 行 (${rows})`);
    const first = await page.$$eval('#ts-mbody tr:first-child td', (t) => t.map((x) => x.textContent.trim()));
    assert(/^M1\s+N1–N2$/.test(first[0]), `首行标签 M1 N1–N2 (${first[0]})`);
    assert(first[1] === '受拉', `华伦下弦第一根受拉 (${first[1]})`);
    const engFirst = await page.evaluate(() => {
      const m = window.__ts.result.members[0];
      return { kN: m.N / 1000, L: m.L.toFixed(2), s: (m.sigma / 1e6).toFixed(1) };
    });
    assert(first[2] === engFirst.L, `表内长度 = 引擎值 ${engFirst.L} (${first[2]})`);
    // 断「值一致 + 格式够精细」,而不是照抄格式化分支
    assert(first[3].startsWith('+'), `受拉杆轴力带正号 (${first[3]})`);
    assert(Math.abs(parseFloat(first[3]) - engFirst.kN) < 0.005,
      `表内轴力 = 引擎值 ${engFirst.kN.toFixed(3)} kN (${first[3]})`);
    assert(/^\+\d+\.\d{2}$/.test(first[3]), `百 kN 以下轴力保留两位小数 (${first[3]})`);
    assert(first[4] === engFirst.s, `表内应力 = 引擎值 ${engFirst.s} MPa (${first[4]})`);
    // 点第 7 行 → 详情标题与选中态跟随
    await page.click('#ts-mbody tr:nth-child(7)');
    await page.waitForFunction(() => document.querySelector('#ts-dtitle').textContent.indexOf('M7') >= 0);
    assert((await page.getAttribute('#ts-mbody tr:nth-child(7)', 'aria-selected')) === 'true', '第 7 行处于选中态');
    const det = await txt('#ts-detail');
    assert(det.includes('欧拉临界力') && det.includes('长细比'), '详情含屈曲与长细比');
    const selN = await page.evaluate(() => {
      const m = window.__ts.result.members[6];
      return { n: (m.N > 0 ? '+' : '') + (m.N / 1000).toFixed(2) + ' kN', sel: window.__ts.state.sel };
    });
    assert(selN.sel === 6, `state.sel 指向第 7 根 (${selN.sel})`);
    assert(det.includes(selN.n), `详情显示 M7 轴力 ${selN.n}`);
  }

  // ═══ 14) 显示开关:aria-pressed 翻转 + 画布真的重绘 ═══════════════════
  {
    const shot = () => page.evaluate(() => {
      const c = document.getElementById('ts-canvas');
      return c.toDataURL().length + ':' + c.toDataURL().slice(-48);
    });
    const a = await shot();
    await page.click('#ts-t-forces');
    await page.waitForFunction(() => document.getElementById('ts-t-forces').getAttribute('aria-pressed') === 'true');
    const b = await shot();
    assert(a !== b, '打开轴力标注后画布像素变化');
    assert((await txt('#ts-hintline')).startsWith('标注单位 kN'), '图例提示切到「标注单位 kN」');
    const skipped = await page.evaluate(() => +document.getElementById('ts-canvas').dataset.labelsSkipped);
    assert(skipped === 0, `默认 6 节间华伦 23 个标注互不重叠、无一省略 (省略 ${skipped})`);
    await page.click('#ts-t-deform');
    await page.waitForFunction(() => document.getElementById('ts-t-deform').getAttribute('aria-pressed') === 'false');
    const c = await shot();
    assert(b !== c, '关闭变形形态后画布再次变化');
    await page.click('#ts-t-deform');
    await page.waitForFunction(() => document.getElementById('ts-t-deform').getAttribute('aria-pressed') === 'true');
    await page.click('#ts-t-forces');
    await page.waitForFunction(() => document.getElementById('ts-t-forces').getAttribute('aria-pressed') === 'false');
  }

  // ═══ 15) 拖动节点改几何:标题标注「已编辑」,新几何仍严格平衡 ═════════════
  {
    const before = await solve();
    const box = await rect('#ts-canvas');
    // 精确命中跨中上弦节点(华伦 6 节间:x=12 附近的顶弦节点)
    const target = await page.evaluate(() => {
      const v = window.__ts.model.nodes;
      let best = -1;
      v.forEach((n, i) => { if (n.y > 1 && Math.abs(n.x - 12) < 2.1 && (best < 0 || Math.abs(n.x - 12) < Math.abs(v[best].x - 12))) best = i; });
      const p = window.__ts.screenOf(best);
      return { idx: best, x: p.x, y: p.y, gx: v[best].x, gy: v[best].y };
    });
    assert(target.idx >= 0, '找到跨中上弦节点');
    await page.mouse.move(box.x + target.x, box.y + target.y);
    await page.mouse.down();
    await page.mouse.move(box.x + target.x, box.y + target.y - 70, { steps: 10 });
    await page.mouse.up();
    await page.waitForFunction(() => !!(window.__ts.state.overrides && window.__ts.state.overrides.pos.length));
    const dragged = await page.evaluate((i) => ({ x: window.__ts.model.nodes[i].x, y: window.__ts.model.nodes[i].y }), target.idx);
    const moved = dragged.y;
    assert(moved > target.gy + 0.5, `节点被真的拖高了 (${target.gy.toFixed(2)}m → ${moved.toFixed(2)}m)`);
    // 纯竖直拖动不能让 x 漂移(抓取偏移修正:显示变形时也不许瞬移)
    assert(Math.abs(dragged.x - target.gx) < 1e-9,
      `竖直拖动不改变 x 坐标 (${target.gx} → ${dragged.x})`);
    const after = await solve();
    assert((await txt('#ts-title')).includes('已编辑'), 'hero 标题标注「已编辑」');
    assert(after.ok, `编辑后的几何仍可解: ${after.reason}`);
    assert(after.joint < 1e-8, `编辑后每个节点仍平衡 (${after.joint.toExponential(2)})`);
    assert(after.relFy < 1e-8 && after.relMz < 1e-8, '编辑后整体 ΣF/ΣM 仍 ≈ 0');
    // 被拖高的那个上弦节点(x=10)正是下弦[8,12]取矩点 ⇒ 该杆轴力 = M(10)/新力臂,精确可验。
    // 注:不能断「全局最大拉力变了」——结构对称,镜像杆[12,16]的取矩点(x=14)没动,
    // 它仍保持 38.857 kN,全局最大值因此原封不动(这本身就是静定结构的正确行为)。
    const chord812 = await page.evaluate(() => {
      const m = window.__ts.model, r = window.__ts.result;
      const i = m.members.findIndex((z) => Math.abs(m.nodes[z.a].y) < 1e-9 && Math.abs(m.nodes[z.b].y) < 1e-9 &&
        Math.abs(Math.min(m.nodes[z.a].x, m.nodes[z.b].x) - 8) < 1e-9);
      return r.members[i].N;
    });
    near(chord812, 136000 / moved, 1e-3, `拖动后下弦[8,12] = M(10)/${moved.toFixed(3)}m`);
    assert(chord812 < before.maxT - 1, `力臂变长使该杆轴力下降 ${(before.maxT / 1000).toFixed(2)}→${(chord812 / 1000).toFixed(2)} kN`);
    await page.click('#ts-reset');
    await page.waitForFunction(() => !(window.__ts.state.overrides && window.__ts.state.overrides.pos.length));
    const back = await solve();
    assert(Math.abs(back.maxT - before.maxT) < 1e-6, '「恢复预设几何」把轴力复原');
    assert(!(await txt('#ts-title')).includes('已编辑'), '复原后标题去掉「已编辑」');
  }

  // ═══ 16) 方案保存 → 刷新 → 复原(localStorage 往返) ═══════════════════
  {
    await setRange('ts-span', 36);
    await setRange('ts-load', 250);
    const saved = await solve();
    await page.fill('#ts-savename', '36米重载方案');
    await page.click('#ts-save');
    await page.waitForFunction(() => document.querySelectorAll('#ts-savelist .ts-save').length === 1);
    assert((await txt('#ts-savelist')).includes('36米重载方案'), '方案出现在列表里');
    // 改回小跨度,再从列表复原
    await setRange('ts-span', 12);
    assert(Math.abs((await solve()).maxT - saved.maxT) > 1, '改动后与已存方案不同');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.body.dataset.ok === '1');
    assert((await txt('#ts-savelist')).includes('36米重载方案'), '刷新后方案仍在(localStorage 持久化)');
    const persisted = await page.evaluate(() => window.__ts.state.span);
    assert(persisted === 12, `刷新后沿用上次参数 span=12 (${persisted})`);
    await page.click('#ts-savelist .ts-open');
    await page.waitForFunction(() => window.__ts.state.span === 36 && document.body.dataset.ok === '1');
    const restored = await solve();
    assert(Math.abs(restored.maxT - saved.maxT) / saved.maxT < 1e-9,
      `复原方案后轴力完全一致 (${(restored.maxT / 1000).toFixed(2)} vs ${(saved.maxT / 1000).toFixed(2)} kN)`);
    // 删除
    await page.click('#ts-savelist .ts-save button[aria-label^="删除方案"]');
    await page.waitForFunction(() => document.querySelectorAll('#ts-savelist .ts-save').length === 0);
    assert((await txt('#ts-savelist')).includes('还没有保存的方案'), '删除后回到空态提示');
  }

  // ═══ 17) CSV 导出可用(不抛错、内容正确) ═══════════════════════════════
  {
    const csv = await page.evaluate(() => {
      const r = window.__ts.result;
      const rows = [['member', 'nodeA', 'nodeB', 'length_m', 'axial_kN', 'kind', 'stress_MPa', 'Pcr_kN', 'utilization']];
      r.members.forEach((m, i) => rows.push(['M' + (i + 1), 'N' + (m.a + 1), 'N' + (m.b + 1), m.L.toFixed(4),
        (m.N / 1000).toFixed(4), m.kind, (m.sigma / 1e6).toFixed(3), (m.Pcr / 1000).toFixed(3), m.util.toFixed(4)]));
      return rows.length + '|' + rows[1].length;
    });
    assert(csv === '24|9', `CSV 行列数 = 表头+23 行 × 9 列 (${csv})`);
    const dl = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
    await page.click('#ts-csv');
    const file = await dl;
    assert(file && /^truss-warren-\d+\.csv$/.test(file.suggestedFilename()),
      `点击导出触发下载 (${file ? file.suggestedFilename() : 'no download'})`);
  }

  // ═══ 18) 布局守卫:容器内不逃逸 + 控件渲染尺寸下限(07-17 / 07-24) ══════
  {
    assert(await inside('.ts-back', '.ts-nav'), '返回链接落在导航条内');
    assert(await inside('#ts-canvas', '#ts-stage'), '画布落在舞台内');
    assert(await inside('.ts-legend', '#ts-stage'), '图例落在舞台内');
    assert(await inside('#ts-dots', '#ts-stage'), '轮播圆点落在舞台内');
    assert(await inside('.ts-toggles', '#ts-stage'), '显示开关落在舞台内');
    assert(await inside('#ts-stats', '.ts-section.ash .ts-wrap'), '结果概览落在版心内');
    // 图例与圆点不重叠(两者都在舞台底部)
    const lg = await rect('.ts-legend'), dt = await rect('#ts-dots');
    assert(lg.r <= dt.x + 1 || dt.r <= lg.x + 1 || lg.b <= dt.y + 1 || dt.b <= lg.y + 1,
      `图例与轮播圆点不重叠 (legend right=${lg.r.toFixed(0)}, dots left=${dt.x.toFixed(0)})`);
    // 控件不能被同特异性通用规则压塌(2026-07-24 的 input[type=range] 教训)
    for (const id of ['ts-span', 'ts-height', 'ts-load', 'ts-defscale']) {
      const r = await rect('#' + id);
      assert(r.w >= 120, `#${id} 渲染宽度 ${r.w.toFixed(0)}px ≥ 120`);
      assert(r.h >= 4 && r.h <= 40, `#${id} 渲染高度 ${r.h.toFixed(1)}px 在 4–40 之间`);
    }
    for (const sel of ['#ts-mat', '#ts-sec', '#ts-area', '#ts-savename']) {
      const r = await rect(sel);
      assert(r.w >= 120 && r.h >= 32, `${sel} 渲染 ${r.w.toFixed(0)}×${r.h.toFixed(0)} ≥ 120×32`);
    }
    const arrow = await rect('#ts-prev');
    assert(arrow.w >= 36 && arrow.h >= 36, `轮播箭头 ${arrow.w}×${arrow.h} ≥ 36×36(触摸目标)`);
    const stage = await rect('#ts-stage');
    assert(stage.h >= 300, `舞台高度 ${stage.h.toFixed(0)}px ≥ 300`);
    const canvasBox = await page.evaluate(() => {
      const c = document.getElementById('ts-canvas');
      return { css: c.getBoundingClientRect().width, buf: c.width };
    });
    assert(canvasBox.buf >= canvasBox.css, '画布后备缓冲区不低于 CSS 宽度(高 DPI 清晰)');
  }

  // ═══ 19) 窄屏 390px:无横向溢出(07-23 教训) ══════════════════════════
  {
    await page.setViewportSize({ width: 390, height: 780 });
    await page.waitForFunction(() => document.body.dataset.ok === '1');
    const ov = await page.evaluate(() => ({
      doc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      body: document.body.scrollWidth - window.innerWidth
    }));
    assert(ov.doc <= 0 && ov.body <= 0, `390px 无横向溢出 (doc=${ov.doc}, body=${ov.body})`);
    assert(await inside('#ts-canvas', '#ts-stage'), '390px 画布仍在舞台内');
    assert(await inside('.ts-legend', '#ts-stage'), '390px 图例仍在舞台内');
    assert(await inside('#ts-dots', '#ts-stage'), '390px 圆点仍在舞台内');
    // 窄屏图例会换行,必须和居中的圆点分行,不能压叠
    const lg2 = await rect('.ts-legend'), dt2 = await rect('#ts-dots');
    assert(lg2.b <= dt2.y + 1 || dt2.b <= lg2.y + 1 || lg2.r <= dt2.x + 1 || dt2.r <= lg2.x + 1,
      `390px 图例与圆点不重叠 (legend bottom=${lg2.b.toFixed(0)}, dots top=${dt2.y.toFixed(0)})`);
    // 副标题不能被右上角开关压住(窄屏给文字留了 padding-right)
    const sub = await rect('.ts-sub'), tg = await rect('.ts-toggles');
    assert(sub.r <= tg.x + 1, `390px 副标题不伸到开关下方 (sub right=${sub.r.toFixed(0)}, toggles left=${tg.x.toFixed(0)})`);
    const s = await solve();
    assert(s.ok && s.joint < 1e-8, '390px 下仍正常求解');
    await page.setViewportSize({ width: 1280, height: 850 });
    await page.waitForFunction(() => document.body.dataset.ok === '1');
  }

  // ═══ 20) 非法输入与极端参数不崩 ═══════════════════════════════════════
  {
    await page.fill('#ts-area', '');
    await page.dispatchEvent('#ts-area', 'change');
    await page.waitForFunction(() => document.getElementById('ts-area').value === '24');
    assert((await solve()).ok, '清空面积后回落到 24 cm² 并继续可解');
    await page.fill('#ts-area', '-5');
    await page.dispatchEvent('#ts-area', 'change');
    await page.waitForFunction(() => parseFloat(document.getElementById('ts-area').value) > 0);
    assert((await solve()).ok, '负面积被拒并保持可解');
    await setRange('ts-height', 0.5);   // 极扁
    let s = await solve();
    assert(s.ok && s.joint < 1e-7, `桁高 0.5m 极扁仍可解 (残差 ${s.joint.toExponential(1)})`);
    assert(s.maxUtil > 1, '极扁桁架被判为超限(利用率 > 100%)');
    assert((await txt('#ts-mbody')).includes('超限'), '内力表出现「超限」标记');
    await setRange('ts-height', 10);    // 极高
    s = await solve();
    assert(s.ok && s.joint < 1e-8, '桁高 10m 仍可解');
    await setRange('ts-height', 3.5);
    await setRange('ts-load', 600);
    assert((await solve()).ok, '600 kN 满量程可解');
    await setRange('ts-load', 40);
    await setRange('ts-span', 4);
    assert((await solve()).ok, '跨度下限 4m 可解');
    await setRange('ts-span', 24);
  }

  // ═══ 21) 缩略图:回到默认视图并等过渡 settle 再截(07-18 / 07-22) ═══════
  {
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.body.dataset.ok === '1' && document.body.dataset.preset === 'warren');
    await page.click('#ts-t-forces');   // 缩略图里显示轴力数值更有说服力
    await page.waitForFunction(() => document.getElementById('ts-t-forces').getAttribute('aria-pressed') === 'true');
    await page.evaluate(() => window.scrollTo(0, 0));
    // 等所有 0.33s 过渡真正结束(教训 2026-07-18/07-22:别截到中间态)
    await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running'));
    await page.waitForFunction(() => {
      const d = document.querySelector('#ts-dots .ts-dot[aria-current="true"]');
      return d && getComputedStyle(d).backgroundColor === 'rgb(255, 255, 255)';
    });
    const s = await solve();
    assert(s.ok && s.presetName === '华伦桁架', '截图前恢复到默认华伦桁架');
    await screenshot('thumb.png');
  }
}
