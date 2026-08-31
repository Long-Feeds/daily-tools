// Integration test for 分子工作台 · Molecule Lab.
// Drives the real SMILES parser / ring perception / kekulizer / depiction / mass
// spectrum through the browser and asserts concrete chemistry, not element presence.
export default async function ({ page, toolURL, screenshot, assert: rawAssert }) {
  let checks = 0;
  const assert = (cond, msg) => { checks++; rawAssert(cond, msg); };
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#ml-smiles');
  await page.waitForFunction(() => !!window.ML && document.querySelectorAll('.ml-example').length > 0);

  const setSmiles = async (v) => {
    await page.fill('#ml-smiles', v);
    await page.click('#ml-go');
    await page.waitForFunction(
      (s) => document.getElementById('ml-smiles').value === s, v, { timeout: 5000 });
    await page.waitForTimeout(60);
  };
  const txt = async (sel) => ((await page.locator(sel).textContent()) || '').trim();
  const num = async (sel) => Number(await txt(sel));
  const kv = async (host, key) => page.evaluate(([h, k]) => {
    const rows = [...document.querySelectorAll('#' + h + ' .ml-kv-row')];
    const hit = rows.find((r) => r.querySelector('.ml-kv-k').textContent.indexOf(k) === 0);
    return hit ? hit.querySelector('.ml-kv-v').textContent.trim() : null;
  }, [host, key]);
  const onTab = async (name, fn) => {
    await page.click('#ml-tab-' + name);
    await page.waitForFunction((n) => !document.getElementById('ml-panel-' + n).hidden, name);
    const out = await fn();
    return out;
  };

  // ---------------------------------------------------------------- 1. 阿司匹林
  await setSmiles('CC(=O)Oc1ccccc1C(=O)O');
  assert((await page.locator('#ml-error').isHidden()), '合法 SMILES 不应报错');
  assert((await txt('#ml-out-formula')) === 'C9H8O4', `阿司匹林分子式应为 C9H8O4（得到 ${await txt('#ml-out-formula')}）`);
  const mw = await num('#ml-out-mw');
  assert(Math.abs(mw - 180.159) < 0.002, `阿司匹林分子量应为 180.159（得到 ${mw}）`);
  const exact = await num('#ml-out-exact');
  assert(Math.abs(exact - 180.04226) < 0.0002, `阿司匹林精确质量应为 180.04226（得到 ${exact}）`);
  assert((await txt('#ml-out-canon')).length > 0, '应输出规范 SMILES');
  assert((await kv('ml-out-skeleton', '环数')) === '1', '阿司匹林只有 1 个环');
  assert((await kv('ml-out-skeleton', '芳香环 / 脂环')) === '1 / 0', '阿司匹林有 1 个芳香环、0 个脂环');
  assert((await kv('ml-out-skeleton', '芳香原子数')) === '6', '阿司匹林有 6 个芳香原子');
  assert((await kv('ml-out-skeleton', '氢原子数')) === '8', '阿司匹林有 8 个氢');

  // structure really got drawn: 13 heavy atoms => 13 bond-ish lines at least
  const svgStats = await page.evaluate(() => {
    const svg = document.querySelector('#ml-depiction svg');
    return {
      lines: svg.querySelectorAll('line').length,
      labels: svg.querySelectorAll('.ml-atom-label').length,
      w: svg.getBoundingClientRect().width,
      h: svg.getBoundingClientRect().height
    };
  });
  assert(svgStats.lines >= 13, `结构图应至少画出 13 条键线（得到 ${svgStats.lines}）`);
  assert(svgStats.labels === 4, `阿司匹林应只标 4 个氧原子（碳默认不标，得到 ${svgStats.labels}）`);
  assert(svgStats.w > 200 && svgStats.h > 120, `结构图应有实际尺寸（得到 ${svgStats.w}x${svgStats.h}）`);
  assert(svgStats.h <= 500, `结构图高度应被限制在 480px 左右（得到 ${svgStats.h}）`);

  // ------------------------------------------------- 2. 芳香性 / Kekulé 化真的在跑
  await setSmiles('c1ccccc1');
  assert((await txt('#ml-out-formula')) === 'C6H6', '苯应为 C6H6');
  const benzeneDoubles = await page.evaluate(() => window.ML.parseSmiles('c1ccccc1').bonds
    .filter((b) => (b.korder !== undefined ? b.korder : b.order) === 2).length);
  assert(benzeneDoubles === 3, `苯 Kekulé 化后应有 3 根双键（得到 ${benzeneDoubles}）`);

  await setSmiles('C1=CC=CC=C1');
  assert((await kv('ml-out-skeleton', '芳香原子数')) === '6', 'Kekulé 写法的苯也应被判为芳香');

  await setSmiles('c1cc[nH]c1');
  assert((await txt('#ml-out-formula')) === 'C4H5N', `吡咯应为 C4H5N（得到 ${await txt('#ml-out-formula')}）`);
  assert((await kv('ml-out-skeleton', '芳香原子数')) === '5', '吡咯 5 个原子全芳香');

  // azulene: neither ring is Hückel on its own, only the fused 10-pi system is
  await setSmiles('c1ccc2cccc-2cc1');
  assert((await txt('#ml-out-formula')) === 'C10H8', '薁应为 C10H8');
  assert((await kv('ml-out-skeleton', '芳香原子数')) === '10', '薁 10 个原子全芳香（靠稠合体系并集判定）');
  assert((await kv('ml-out-skeleton', '环数（SSSR）')) === '2', '薁有 2 个环');

  // ---------------------------------------------------------- 3. 电荷 / 同位素
  await setSmiles('[NH4+]');
  assert((await txt('#ml-out-formula')) === 'H4N+', `铵根分子式应带电荷号（得到 ${await txt('#ml-out-formula')}）`);
  const nh4 = await num('#ml-out-exact');
  assert(Math.abs(nh4 - 18.033826) < 0.0002, `铵根精确质量应扣掉一个电子（18.033826，得到 ${nh4}）`);

  await setSmiles('[13CH3]C(=O)O');
  const isoF = await txt('#ml-out-formula');
  assert(isoF === 'C[13C]H4O2', `碳-13 乙酸分子式应标出同位素（得到 ${isoF}）`);
  const isoM = await num('#ml-out-exact');
  assert(Math.abs(isoM - 61.024484) < 0.0005, `碳-13 乙酸精确质量应为 61.0245（得到 ${isoM}）`);

  // multi-component salt
  await setSmiles('[Na+].[Cl-]');
  assert((await kv('ml-out-skeleton', '组分数')) === '2', '氯化钠应识别为 2 个组分');

  // --------------------------------------------------------------- 4. 非法输入
  const badCases = [
    ['CC(C', '缺少右括号'],
    ['C1CCC', '未闭合的环号'],
    ['CCQ', '无法识别'],
    ['=CC', '键符号'],
    ['CC)C', '多余的'],
    ['C[XyZ]C', '方括号']
  ];
  for (const [bad] of badCases) {
    await setSmiles(bad);
    assert(await page.locator('#ml-error').isVisible(), `非法 SMILES ${bad} 应报错`);
    const msg = await txt('#ml-error');
    assert(msg.length > 6, `${bad} 的报错信息应有内容（得到 "${msg}"）`);
    const disp = await page.evaluate(() => getComputedStyle(document.getElementById('ml-error')).display);
    assert(disp !== 'none', `${bad} 的错误条应真的可见`);
  }
  await setSmiles('CC(=O)Oc1ccccc1C(=O)O');
  const errHidden = await page.evaluate(() => getComputedStyle(document.getElementById('ml-error')).display);
  assert(errHidden === 'none', '恢复合法输入后错误条应被隐藏（计算样式 display:none）');

  // ------------------------------------------------------------- 5. 结构图选项
  await page.check('#ml-opt-carbon');
  await page.waitForTimeout(80);
  const withC = await page.evaluate(() => document.querySelectorAll('#ml-depiction .ml-atom-label').length);
  assert(withC === 13, `勾上「显示碳原子符号」后应标出全部 13 个重原子（得到 ${withC}）`);
  await page.uncheck('#ml-opt-carbon');

  await page.check('#ml-opt-circle');
  await page.waitForTimeout(80);
  const circles = await page.evaluate(() => document.querySelectorAll('#ml-depiction circle').length);
  assert(circles === 1, `勾上「芳香环画内圈」后苯环应画 1 个圈（得到 ${circles}）`);
  await page.uncheck('#ml-opt-circle');

  await page.check('#ml-opt-index');
  await page.waitForTimeout(80);
  const idx = await page.evaluate(() => document.querySelectorAll('#ml-depiction .ml-atom-index').length);
  assert(idx === 13, `勾上「显示原子序号」后应有 13 个序号（得到 ${idx}）`);
  await page.uncheck('#ml-opt-index');

  // atom labels must not overlap each other (SVG text boxes pairwise disjoint)
  for (const smi of ['CC(=O)Oc1ccccc1C(=O)O', 'Nc1ncnc2c1ncn2C1OC(COP(=O)(O)OP(=O)(O)OP(=O)(O)O)C(O)C1O',
    'CCCc1nn(C)c2c(=O)[nH]c(-c3cc(S(=O)(=O)N4CCN(C)CC4)ccc3OCC)nc12']) {
    await setSmiles(smi);
    const overlaps = await page.evaluate(() => {
      const els = [...document.querySelectorAll('#ml-depiction .ml-atom-label')];
      const r = els.map((e) => e.getBoundingClientRect());
      const bad = [];
      for (let i = 0; i < r.length; i++) {
        for (let j = i + 1; j < r.length; j++) {
          if (r[i].left < r[j].right - 1 && r[j].left < r[i].right - 1 &&
            r[i].top < r[j].bottom - 1 && r[j].top < r[i].bottom - 1) {
            bad.push(els[i].textContent + '/' + els[j].textContent);
          }
        }
      }
      return bad;
    });
    assert(overlaps.length === 0, `${smi} 的原子标签互相重叠：${overlaps.join(', ')}`);
  }

  // ------------------------------------------------------------------ 6. 性质
  await setSmiles('Cn1cnc2c1c(=O)n(C)c(=O)n2C');
  await onTab('props', async () => {
    assert((await kv('ml-out-props', '平均分子量')).indexOf('194.19') === 0,
      `咖啡因分子量应为 194.19（得到 ${await kv('ml-out-props', '平均分子量')}）`);
    // 61.82 is Ertl/RDKit's value (verified against rdMolDescriptors._CalcTPSAContribs:
    // 4.93 + 12.89 + 17.07 + 4.93 + 17.07 + 4.93). PubChem quotes 58.44 for caffeine
    // because Cactvs uses a different TPSA implementation — not the same number.
    assert((await kv('ml-out-props', '拓扑极性表面积')).indexOf('61.82') === 0,
      `咖啡因 TPSA 应为 61.82 Å²（Ertl/RDKit 口径，得到 ${await kv('ml-out-props', '拓扑极性表面积')}）`);
    assert((await kv('ml-out-props', '氢键给体')) === '0', '咖啡因没有氢键给体');
    assert((await kv('ml-out-props', '氢键受体')) === '6', '咖啡因有 6 个氢键受体（4N + 2O）');
    assert((await kv('ml-out-props', '可旋转键')) === '0', '咖啡因没有可旋转键');
    assert((await kv('ml-out-props', '芳香环数')) === '2', '咖啡因有 2 个芳香环');
    const flags = await page.locator('#ml-out-lipinski .ml-flag').allTextContents();
    assert(flags.length === 4, `Lipinski 应列 4 条（得到 ${flags.length}）`);
    assert(flags.every((f) => f.indexOf('通过') > 0), `咖啡因应四条全过（得到 ${flags.join(' | ')}）`);
    // element composition sums to 100%
    const pcts = await page.locator('#ml-elemtable tbody td.ml-num:nth-child(3)').allTextContents();
    const sum = pcts.reduce((a, b) => a + Number(b), 0);
    assert(Math.abs(sum - 100) < 0.05, `元素质量分数应加起来是 100%（得到 ${sum}）`);
    assert(pcts.length === 4, `咖啡因有 4 种元素（得到 ${pcts.length}）`);
  });

  // a molecule that breaks Lipinski
  await setSmiles('CC(C)c1c(C(=O)Nc2ccccc2)c(-c2ccccc2)c(-c2ccc(F)cc2)n1CCC(O)CC(O)CC(=O)O');
  await onTab('props', async () => {
    const flags = await page.locator('#ml-out-lipinski .ml-flag').allTextContents();
    assert(flags.some((f) => f.indexOf('超标') > 0), `阿托伐他汀应至少有一条 Lipinski 超标（得到 ${flags.join(' | ')}）`);
    assert((await kv('ml-out-props', '平均分子量')).indexOf('558.6') === 0,
      `阿托伐他汀分子量应为 558.6 上下（得到 ${await kv('ml-out-props', '平均分子量')}）`);
  });

  // ------------------------------------------------------------------ 7. 质谱
  await setSmiles('ClC(Cl)Cl');
  await onTab('ms', async () => {
    await page.selectOption('#ml-adduct', 'M');
    await page.waitForTimeout(120);
    const rows = await page.locator('#ml-ms-table tbody tr').count();
    assert(rows >= 4, `三氯甲烷应有至少 4 根同位素峰（得到 ${rows}）`);
    const cells = await page.locator('#ml-ms-table tbody tr').first().locator('td').allTextContents();
    assert(Math.abs(Number(cells[0]) - 117.91439) < 0.002,
      `三氯甲烷 M 的单同位素 m/z 应为 117.9144（得到 ${cells[0]}）`);
    // Three chlorines give the textbook 100 : 96 : 31 : 3.3 quartet at M, M+2, M+4,
    // M+6 (cross-checked against molmass: 100 / 1.093 / 95.987 / 1.049 / 30.712 ...).
    const byNom = await page.evaluate(() => {
      const out = {};
      document.querySelectorAll('#ml-ms-table tbody tr').forEach((tr) => {
        const c = tr.querySelectorAll('td');
        out[Math.round(Number(c[0].textContent))] = Number(c[1].textContent);
      });
      return out;
    });
    const want = { 118: 100, 119: 1.093, 120: 95.987, 122: 30.712, 124: 3.276 };
    for (const k of Object.keys(want)) {
      assert(byNom[k] !== undefined, `三氯甲烷峰表缺少 m/z ${k}`);
      assert(Math.abs(byNom[k] - want[k]) < 0.05,
        `三氯甲烷 m/z ${k} 相对强度应为 ${want[k]}%（得到 ${byNom[k]}）`);
    }
    const bars = await page.locator('#ml-ms-svg .ml-ms-bar').count();
    assert(bars === rows, `质谱图的柱数应与峰表行数一致（${bars} vs ${rows}）`);
  });

  await setSmiles('CC(=O)Oc1ccccc1C(=O)O');
  await onTab('ms', async () => {
    await page.selectOption('#ml-adduct', 'M+H');
    await page.waitForTimeout(120);
    const v = await kv('ml-ms-summary', '单同位素 m/z');
    assert(Math.abs(Number(v) - 181.04954) < 0.0005, `阿司匹林 [M+H]+ 应为 181.04954（得到 ${v}）`);
    await page.selectOption('#ml-adduct', 'M-H');
    await page.waitForTimeout(120);
    const v2 = await kv('ml-ms-summary', '单同位素 m/z');
    assert(Math.abs(Number(v2) - 179.03498) < 0.0005, `阿司匹林 [M-H]- 应为 179.03498（得到 ${v2}）`);
    await page.selectOption('#ml-adduct', 'M+2H');
    await page.waitForTimeout(120);
    const v3 = await kv('ml-ms-summary', '单同位素 m/z');
    assert(Math.abs(Number(v3) - 91.02841) < 0.001, `阿司匹林 [M+2H]2+ 应为 m/z 91.028（得到 ${v3}）`);
    await page.selectOption('#ml-adduct', 'M+H');
    await page.waitForTimeout(120);

    // mass-spectrum labels must not collide (they go through a reservation table)
    const bad = await page.evaluate(() => {
      const els = [...document.querySelectorAll('#ml-ms-svg text')];
      const r = els.map((e) => e.getBoundingClientRect());
      const out = [];
      for (let i = 0; i < r.length; i++) {
        for (let j = i + 1; j < r.length; j++) {
          if (r[i].left < r[j].right - 0.5 && r[j].left < r[i].right - 0.5 &&
            r[i].top < r[j].bottom - 0.5 && r[j].top < r[i].bottom - 0.5) out.push(els[i].textContent + '/' + els[j].textContent);
        }
      }
      return out;
    });
    assert(bad.length === 0, `质谱图上的文字互相重叠：${bad.join(', ')}`);
    const drawn = await page.locator('#ml-ms-svg .ml-ms-label').count();
    assert(drawn >= 2, `阿司匹林 [M+H]+ 至少应标出 2 根峰的 m/z（得到 ${drawn}）`);
  });

  // ------------------------------------------------------------------ 8. 批量
  await onTab('batch', async () => {
    await page.fill('#ml-batch-in', 'CCO 乙醇\nc1ccccc1 苯\nCC(=O)O 乙酸\nCC(C 坏输入');
    await page.click('#ml-batch-run');
    await page.waitForFunction(() => document.querySelectorAll('#ml-batch-table tbody tr').length === 4);
    const rows = await page.locator('#ml-batch-table tbody tr').allTextContents();
    assert(rows[0].indexOf('C2H6O') >= 0, `批量第 1 行应是 C2H6O（得到 ${rows[0]}）`);
    assert(rows[1].indexOf('C6H6') >= 0, `批量第 2 行应是 C6H6（得到 ${rows[1]}）`);
    assert(rows[3].indexOf('解析失败') >= 0, '坏输入行应显示解析失败');
    const note = await txt('#ml-batch-note');
    assert(note.indexOf('4 行') === 0 && note.indexOf('1 行解析失败') > 0, `批量提示应报 4 行 / 1 行失败（得到 ${note}）`);
    const mwCell = await page.locator('#ml-batch-table tbody tr').first().locator('td.ml-num').first().textContent();
    assert(Math.abs(Number(mwCell) - 46.069) < 0.01, `乙醇分子量应为 46.069（得到 ${mwCell}）`);
  });

  // ---------------------------------------------------------------- 9. 分子库
  await setSmiles('CN1CCCC1c1cccnc1');
  await page.fill('#ml-name', '尼古丁');
  await page.click('#ml-save');
  await onTab('library', async () => {
    await page.waitForFunction(() => document.querySelectorAll('#ml-lib-list .ml-libitem').length >= 1);
    const first = await page.locator('#ml-lib-list .ml-libitem').first().textContent();
    assert(first.indexOf('尼古丁') >= 0, `分子库应出现尼古丁（得到 ${first}）`);
    assert(first.indexOf('C10H14N2') >= 0, `分子库应显示分子式 C10H14N2（得到 ${first}）`);
    await page.click('#ml-lib-export');
    const json = await page.inputValue('#ml-lib-json');
    assert(JSON.parse(json).length === 1, '导出的 JSON 应有 1 条');
    await page.locator('#ml-lib-list .ml-lib-del').first().click();
    await page.waitForFunction(() => document.querySelectorAll('#ml-lib-list .ml-libitem').length === 0);
  });
  // survives reload
  await setSmiles('CCO');
  await page.fill('#ml-name', '乙醇');
  await page.click('#ml-save');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.ML && document.querySelectorAll('.ml-example').length > 0);
  await onTab('library', async () => {
    const n = await page.locator('#ml-lib-list .ml-libitem').count();
    assert(n === 1, `刷新后分子库应仍有 1 条（得到 ${n}）`);
    const t = await page.locator('#ml-lib-list .ml-libitem').first().textContent();
    assert(t.indexOf('乙醇') >= 0, '刷新后应还是乙醇');
    await page.locator('#ml-lib-list .ml-lib-del').first().click();
    await page.waitForFunction(() => document.querySelectorAll('#ml-lib-list .ml-libitem').length === 0);
  });

  // ------------------------------------- 10. 页面上公布的能力清单必须真的成立
  // Every row of the SMILES cheat sheet is a promise; walk it and check each one.
  await onTab('about', async () => {
    const rows = await page.evaluate(() => [...document.querySelectorAll('.ml-syntax-row')]
      .map((r) => ({ ex: r.dataset.example, expect: r.dataset.expect })));
    assert(rows.length >= 14, `速查表应至少有 14 行（得到 ${rows.length}）`);
    const dead = await page.evaluate((rs) => rs.map((r) => {
      try {
        const p = window.ML.properties(window.ML.parseSmiles(r.ex));
        return p.formula === r.expect ? null : `${r.ex} -> ${p.formula} ≠ ${r.expect}`;
      } catch (e) { return `${r.ex} 解析失败: ${e.message}`; }
    }).filter(Boolean), rows);
    assert(dead.length === 0, `速查表里有兑现不了的行：${dead.join(' | ')}`);

    // the element list is also a promise: every listed symbol must parse in brackets
    const elemBad = await page.evaluate(() => {
      const syms = document.getElementById('ml-elemlist').textContent.split('（')[0].split(' · ').map((s) => s.trim()).filter(Boolean);
      const bad = [];
      syms.forEach((s) => {
        try {
          const m = window.ML.parseSmiles('[' + s + ']');
          const mass = window.ML.massOf(window.ML.formula(m).counts, 0);
          if (!mass.ok || !(mass.mw > 0)) bad.push(s + ' 没有质量数据');
          if (!window.ML.isotopePattern(window.ML.formula(m).counts, {}).length) bad.push(s + ' 没有同位素分布');
        } catch (e) { bad.push(s + ': ' + e.message); }
      });
      return { bad: bad, n: syms.length };
    });
    assert(elemBad.bad.length === 0, `元素清单里有用不了的元素：${elemBad.bad.join(', ')}`);
    assert(elemBad.n >= 60, `应支持至少 60 种元素（得到 ${elemBad.n}）`);
  });

  // the tool's own page copy must not uppercase unit symbols (Hz/Da/HBD style bugs)
  const shouty = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('th,dt,label,.ml-label,.ml-kv-k').forEach((e) => {
      const t = e.textContent || '';
      if (/\b(DA|HZ|KHZ|DBFS|MOL|TPSA[0-9])\b/.test(t) && !/TPSA/.test(t)) bad.push(t.trim());
    });
    return bad;
  });
  assert(shouty.length === 0, `单位符号被大写改写：${shouty.join(', ')}`);

  // ---------------------------------------- 11. 控件尺寸 + 逐视口横向溢出守卫
  const TABS = ['structure', 'props', 'ms', 'batch', 'library', 'about'];
  let scanned = 0;
  for (const t of TABS) {
    await page.click('#ml-tab-' + t);
    await page.waitForFunction((n) => !document.getElementById('ml-panel-' + n).hidden, t);
    const bad = await page.evaluate(() => {
      const out = [];
      let n = 0;
      document.querySelectorAll('input,select,button,textarea').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return; // in a hidden panel
        n++;
        const isCheck = el.type === 'checkbox';
        const minW = isCheck ? 14 : (el.tagName === 'BUTTON' ? 52 : 100);
        const minH = isCheck ? 14 : 18;
        if (r.width < minW || r.height < minH) {
          out.push(`${el.tagName}#${el.id || el.className} ${r.width.toFixed(0)}x${r.height.toFixed(0)}`);
        }
      });
      return { out, n };
    });
    scanned += bad.n;
    assert(bad.out.length === 0, `「${t}」页控件塌缩：${bad.out.join(', ')}`);
  }
  assert(scanned >= 30, `六个页签合计应扫到 30 个以上控件（只扫到 ${scanned}）`);

  for (const vw of [390, 768, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of TABS) {
      await page.click('#ml-tab-' + t);
      await page.waitForFunction((n) => !document.getElementById('ml-panel-' + n).hidden, t);
      await page.waitForTimeout(40);
      const res = await page.evaluate(() => {
        const de = document.documentElement;
        const over = de.scrollWidth - de.clientWidth;
        const culprits = [];
        if (over > 1) {
          document.querySelectorAll('*').forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.right > de.clientWidth + 1 && r.width > 0) {
              culprits.push(`${el.tagName}.${(el.className || '').toString().split(' ')[0]}@${r.right.toFixed(0)}`);
            }
          });
        }
        return { over, culprits: culprits.slice(0, 6) };
      });
      assert(res.over <= 1, `${vw}px 下「${t}」页横向溢出 ${res.over}px：${res.culprits.join(', ')}`);
    }
    // code/pre-like wide blocks must scroll inside their own container
    const spill = await page.evaluate(() => {
      const bad = [];
      document.querySelectorAll('.ml-scroll').forEach((el) => {
        if (el.getBoundingClientRect().width === 0) return;
        if (el.scrollWidth - el.clientWidth > 0 && getComputedStyle(el).overflowX !== 'auto') bad.push(el.className);
      });
      return bad;
    });
    assert(spill.length === 0, `${vw}px 下宽表没有自己的横向滚动：${spill.join(', ')}`);
  }
  await page.setViewportSize({ width: 1280, height: 850 });

  // ------------------------------------------------------------- 12. 返回链接
  const back = await page.getAttribute('#ml-back', 'href');
  assert(back === '../../', `顶部返回链接应指向 ../../（得到 ${back}）`);

  // ------------------------------------------------------------------ 缩略图
  await page.click('#ml-tab-structure');
  await page.waitForFunction(() => !document.getElementById('ml-panel-structure').hidden);
  await setSmiles('CCCc1nn(C)c2c(=O)[nH]c(-c3cc(S(=O)(=O)N4CCN(C)CC4)ccc3OCC)nc12');
  await page.fill('#ml-name', '西地那非');
  await page.evaluate(() => window.scrollTo(0, 242));
  await page.waitForTimeout(250);
  await screenshot('thumb.png');
  console.log(`    (molecule-lab: ${checks} 条浏览器断言)`);
}
