/* 射频微波工作台 · 浏览器集成测试
 * 每个数值期望都先用 scikit-rf 2.1.0 / SciPy 实算过再填（见注释里的来源），不靠手算。 */
const TABS = ['tl', 'mt', 'tp', 'ln', 'fl', 'doc'];

export default async ({ page, toolURL, screenshot, assert }) => {
  const txt = async (sel) => (await page.locator(sel).first().textContent()).trim();
  // 读数卡：按 dt 文本找到对应的 dd
  const readOf = async (scope, label) => page.evaluate(([sc, lb]) => {
    const nodes = [...document.querySelectorAll(sc + ' .rf-read')];
    const hit = nodes.find((n) => n.querySelector('dt').textContent.trim() === lb);
    return hit ? hit.querySelector('dd').textContent.replace(/\s+/g, ' ').trim() : null;
  }, [scope, label]);
  const numOf = async (scope, label) => {
    const t = await readOf(scope, label);
    if (t === null) return null;
    const m = t.replace(/−/g, '-').match(/-?\d+(\.\d+)?([eE][-+]?\d+)?/);
    return m ? parseFloat(m[0]) : null;
  };
  const near = (got, want, tol, msg) =>
    assert(got !== null && Math.abs(got - want) <= tol, `${msg}：得到 ${got}，期望 ${want}±${tol}`);
  const show = async (id) => { await page.click('#rf-tabbtn-' + id); await page.waitForTimeout(140); };

  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(toolURL, { waitUntil: 'networkidle' });
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload({ waitUntil: 'networkidle' });

  // ---------- 0 页面骨架 ----------
  assert((await page.title()).includes('射频微波'), '标题含「射频微波」');
  assert(await page.locator('a[href="../../"]').first().isVisible(), '顶部有返回工具集链接');
  assert(await page.locator('#rf-tabs .rf-tab').count() === TABS.length, `有 ${TABS.length} 个标签页`);

  // ---------- 1 传输线：与 skrf DefinedGammaZ0 实算值比对 ----------
  await show('tl');
  // skrf: |ΓL| = 0.5549400666, ∠ = −93.932896°, VSWR = 3.4937767924, RL = 5.11507836 dB
  const gl = await readOf('#rf-tl-out', '负载反射系数 ΓL');
  assert(/0\.5549/.test(gl) && /-93\.93/.test(gl.replace(/−/g, '-')), 'ΓL 显示 0.5549 ∠ −93.93°，实得 ' + gl);
  near(await numOf('#rf-tl-out', '驻波比 VSWR'), 3.4937768, 1e-4, 'VSWR');
  near(await numOf('#rf-tl-out', '回波损耗'), 5.115, 1e-3, '回波损耗 dB');
  near(await numOf('#rf-tl-out', '失配损耗'), 1.5987, 1e-4, '失配损耗 dB');
  near(await numOf('#rf-tl-out', '负载品质因数 Q'), 1.6, 1e-6, '负载 Q');
  // skrf: Zin(45°) = 14.3266475645 + 1.5759312321j Ω；λ = 202.12003395 mm
  const zin = await readOf('#rf-tl-out', '输入阻抗 Zin');
  assert(/14\.327/.test(zin) && /1\.576/.test(zin), 'Zin ≈ 14.327 + j1.576 Ω，实得 ' + zin);
  near(await numOf('#rf-tl-out', '波长 λ'), 202.12, 1e-2, '波长 mm');
  near(await numOf('#rf-tl-out', '物理长度'), 25.265, 1e-3, '45° 段长度 mm');
  // 交互：短路负载 Γ = −1 ⇒ VSWR 严格发散，显示 ∞；开路预设给 1 TΩ ⇒ VSWR 极大但有限
  await page.click('text=短路');
  await page.waitForTimeout(150);
  assert((await readOf('#rf-tl-out', '驻波比 VSWR')) === '∞', '短路负载的 VSWR 显示为 ∞');
  assert((await readOf('#rf-tl-out', '回波损耗')).startsWith('0.000'), '短路时回波损耗为 0 dB（全反射）');
  await page.click('text=开路');
  await page.waitForTimeout(150);
  assert((await numOf('#rf-tl-out', '驻波比 VSWR')) > 1e9, '开路预设（1 TΩ）的 VSWR 应大于 1e9');
  await page.click('#rf-tl-ex');
  await page.waitForTimeout(150);
  near(await numOf('#rf-tl-out', '驻波比 VSWR'), 3.4937768, 1e-4, '点回天线示例后 VSWR 复原');
  // 改成有耗线：整段损耗必须 > 0 且输入端 VSWR 变小
  const vswr0 = await numOf('#rf-tl-out', '输入端 VSWR');
  await page.fill('#rf-tl-loss', '20');
  await page.waitForTimeout(150);
  const vswr1 = await numOf('#rf-tl-out', '输入端 VSWR');
  assert(vswr1 < vswr0 - 0.01, `加 20 dB/m 线损后输入端 VSWR 应下降：${vswr0} → ${vswr1}`);
  assert((await numOf('#rf-tl-out', '整段损耗')) > 0.4, '整段损耗 > 0.4 dB');
  await page.fill('#rf-tl-loss', '0');
  await page.waitForTimeout(150);
  // 沿线阻抗表：θ=180° 一行应回到负载阻抗（无耗半波重复）
  const row180 = await page.locator('#rf-tl-out table tbody tr').last().textContent();
  assert(/25\.00/.test(row180) && /40\.00/.test(row180), '半波长处输入阻抗回到 25 − j40 Ω，实得 ' + row180.replace(/\s+/g, ' '));

  // ---------- 2 匹配网络：与 SciPy 数值求根值比对 ----------
  await show('mt');
  const cards = page.locator('#rf-mt-cards .rf-card');
  assert(await cards.count() === 4, `ZL = 25 − j40 有 4 组 L 型解，实得 ${await cards.count()}`);
  // 数值求根：X = +65.0 Ω → L = 10.345071 nH；B = +0.02 S → C = 3.183099 pF
  const c0 = (await cards.nth(0).textContent()).replace(/\s+/g, ' ');
  assert(/10\.345\d* nH/.test(c0), '方案 1 串联电感 10.3451 nH，实得 ' + c0);
  assert(/3\.183\d* pF/.test(c0), '方案 1 并联电容 3.1831 pF，实得 ' + c0);
  // 第二解：X = +15 Ω → 2.387324 nH；B = −0.02 S → 7.957747 nH
  const c1 = (await cards.nth(1).textContent()).replace(/\s+/g, ' ');
  assert(/2\.387\d* nH/.test(c1) && /7\.957\d* nH/.test(c1), '方案 2 = 串 2.3873 nH + 并 7.9577 nH，实得 ' + c1);
  // 单支节：SciPy brentq d = 0.04135235 λ，开路 0.35236867 λ，短路 0.10236867 λ
  const stubRow = (await page.locator('#rf-mt-out table').nth(0).locator('tbody tr').first().textContent()).replace(/\s+/g, ' ');
  assert(/0\.04135/.test(stubRow) && /0\.35237/.test(stubRow) && /0\.10237/.test(stubRow),
    '并联支节解 1 = (d 0.04135λ, 开路 0.35237λ, 短路 0.10237λ)，实得 ' + stubRow);
  // λ/4：复负载先走线到实轴 → Zt = 93.45823656 与 26.74991624 Ω
  const qwTxt = (await page.locator('#rf-mt-out table').nth(1).textContent()).replace(/\s+/g, ' ');
  assert(/93\.458/.test(qwTxt) && /26\.750/.test(qwTxt), 'λ/4 变换器两解 93.458 / 26.750 Ω，实得 ' + qwTxt);
  // 切比雪夫 3 节变换器：57.480674 / 70.710678 / 86.985759 Ω（Python 独立实现）
  const xfTxt = (await page.locator('#rf-mt-out table').nth(2).textContent()).replace(/\s+/g, ' ');
  assert(/57\.4807/.test(xfTxt) && /70\.7107/.test(xfTxt) && /86\.9858/.test(xfTxt),
    '切比雪夫变换器各节阻抗，实得 ' + xfTxt);
  // 切换方案要真的改图
  const sweepBefore = await page.locator('#rf-mt-sweep path[stroke="#FFC000"]').first().getAttribute('d');
  await cards.nth(2).click();
  await page.waitForTimeout(200);
  assert(await page.locator('#rf-mt-cards .rf-card[aria-pressed="true"]').count() === 1, '同时只有一个方案处于选中态');
  const sweepAfter = await page.locator('#rf-mt-sweep path[stroke="#FFC000"]').first().getAttribute('d');
  assert(sweepBefore !== sweepAfter, '切换方案后失配曲线必须重画');
  await cards.nth(0).click();
  await page.waitForTimeout(180);
  // 匹配后 |Γ| 必须是 0（页面自己现场复算的那一行）
  const capTxt = await page.locator('#rf-mt-sweep .rf-cap').textContent();
  const gmatch = capTxt.match(/\|Γ\| = ([0-9.e+-]+)/);
  assert(gmatch && parseFloat(gmatch[1]) < 1e-12, '方案 1 在 f0 处 |Γ| < 1e-12，实得 ' + capTxt);

  // ---------- 3 二端口：与 skrf Network.stability / max_stable_gain 比对 ----------
  await show('tp');
  // skrf @1 GHz：K = 0.8663714058，|Δ| = 0.3246258329，MSG = 18.95264649 dB，|S21| = 11.70921459 dB
  near(await numOf('#rf-tp-out', 'Rollett K'), 0.866371, 1e-5, 'Rollett K');
  near(await numOf('#rf-tp-out', '行列式 |Δ|'), 0.324626, 1e-5, '|Δ|');
  near(await numOf('#rf-tp-out', '最大稳定增益 MSG'), 18.9526, 1e-3, 'MSG dB');
  near(await numOf('#rf-tp-out', '|S21|'), 11.7092, 1e-3, '|S21| dB');
  assert((await readOf('#rf-tp-out', '稳定性')).includes('有条件稳定'), '1 GHz 处 K < 1 ⇒ 有条件稳定');
  // Z11 = 14.35060445601611 − 14.156677201050723j Ω（numpy 矩阵闭式）
  const zrow = (await page.locator('#rf-tp-out table').nth(0).locator('tbody tr').first().textContent()).replace(/\s+/g, ' ');
  assert(/14\.351/.test(zrow) && /14\.157/.test(zrow), 'Z11 ≈ 14.351 − j14.157 Ω，实得 ' + zrow);
  // Friis：1.2/12、3.5/15、8/20 dB ⇒ 1.48296798 dB、47 dB、118.03 K
  near(await numOf('#rf-tp-friis', '级联噪声系数'), 1.48297, 1e-4, 'Friis 噪声系数 dB');
  near(await numOf('#rf-tp-friis', '级联增益'), 47, 1e-6, 'Friis 级联增益 dB');
  near(await numOf('#rf-tp-friis', '等效噪声温度'), 118.03, 0.02, '等效噪声温度 K');
  await page.fill('#rf-tp-nf1', '0.6');
  await page.waitForTimeout(150);
  assert((await numOf('#rf-tp-friis', '级联噪声系数')) < 1.0, '一级 NF 降到 0.6 dB 后级联 NF 应 < 1 dB');
  await page.fill('#rf-tp-nf1', '1.2');
  await page.waitForTimeout(120);
  // 换频点：6 GHz 处 skrf 给 K = 2.32190414、MAG = 3.50935041 dB
  await page.selectOption('#rf-tp-fi', '7');
  await page.waitForTimeout(220);
  near(await numOf('#rf-tp-out', 'Rollett K'), 2.321904, 1e-5, '6 GHz 的 K');
  // 该读数显示到小数点后 3 位 ⇒ 容差下界取半个最小显示单位（5e-4）
  near(await numOf('#rf-tp-out', '最大资用增益 MAG'), 3.50935, 6e-4, '6 GHz 的 MAG dB');
  assert((await readOf('#rf-tp-out', '稳定性')).includes('无条件稳定'), '6 GHz 处 K>1 且 |Δ|<1 ⇒ 无条件稳定');
  // 全频段表 8 行
  assert(await page.locator('#rf-tp-out table').nth(1).locator('tbody tr').count() === 8, '全频段表 8 行');
  // Touchstone 往返：导出为 RI 后再解析，读数必须一致
  const kBefore = await numOf('#rf-tp-out', 'Rollett K');
  await page.click('#rf-tp-export');
  await page.waitForTimeout(250);
  assert((await page.locator('#rf-tp-ta').inputValue()).includes('# GHZ S RI R 50'), '导出的文本是 RI 格式');
  await page.selectOption('#rf-tp-fi', '7');
  await page.waitForTimeout(220);
  near(await numOf('#rf-tp-out', 'Rollett K'), kBefore, 1e-6, 'MA → RI 往返后 K 不变');
  // 坏输入必须给出可读的报错而不是崩
  await page.fill('#rf-tp-ta', '1 2 3\n4 5 6');
  await page.waitForTimeout(200);
  assert(await page.locator('#rf-tp-err').count() === 1, '缺 # 选项行时给出错误提示');
  assert((await txt('#rf-tp-err')).includes('选项行'), '错误信息点名缺少选项行');
  await page.fill('#rf-tp-ta', '# GHZ S MA R 50\n1 0.5 -30\n0.5 0.4 -20\n');
  await page.waitForTimeout(200);
  assert((await txt('#rf-tp-err')).includes('递增'), '频率倒序时报「不是严格递增」');
  // 一端口文件（3 个频点 = 9 个数，历史上会被误判成二端口）
  await page.fill('#rf-tp-ta', '# GHZ S MA R 50\n1 0.5 -30\n2 0.4 -20\n3 0.3 -10\n');
  await page.waitForTimeout(220);
  assert(await page.locator('#rf-tp-err').count() === 0, '一端口文件应能解析');
  assert((await txt('#rf-tp-out .rf-ptitle')).includes('1 端口'), '3 个频点的一端口文件不被误判成二端口');
  near(await numOf('#rf-tp-out', '驻波比'), 3, 1e-9, '|Γ| = 0.5 的一端口 VSWR = 3');
  await page.click('text=放大管示例');
  await page.waitForTimeout(250);

  // ---------- 4 平面传输线：与 skrf media.MLine 二分求解值比对 ----------
  await show('ln');
  // skrf: FR-4(h=1.6mm, εr=4.4, tanδ=0.02, t=35µm) @2.4 GHz 的 50 Ω 线宽 = 3.01854114 mm
  near(await numOf('#rf-ln-out', '线宽 W'), 3.0185, 1e-3, '50 Ω 微带线宽 mm');
  near(await numOf('#rf-ln-out', '特性阻抗 Z0'), 50, 1e-6, '综合出的 Z0 回到 50 Ω');
  near(await numOf('#rf-ln-out', '有效介电常数 εeff'), 3.354128, 1e-5, 'εeff');
  near(await numOf('#rf-ln-out', '导波波长 λg'), 68.2055, 1e-3, 'λg mm');
  near(await numOf('#rf-ln-out', '90° 段长度'), 17.0514, 1e-3, '四分之一波长 mm');
  near(await numOf('#rf-ln-out', '总损耗'), 7.8225, 1e-3, '总损耗 dB/m');
  // 换成 Rogers RO4003C：损耗必须显著下降（tanδ 0.02 → 0.0027）
  const loss4 = await numOf('#rf-ln-out', '总损耗');
  await page.selectOption('#rf-ln-sub', 'ro4003');
  await page.waitForTimeout(250);
  const lossR = await numOf('#rf-ln-out', '总损耗');
  assert(lossR < loss4 * 0.6, `RO4003C 的损耗应远低于 FR-4：${loss4} → ${lossR} dB/m`);
  await page.selectOption('#rf-ln-sub', 'fr4');
  await page.waitForTimeout(250);
  // 切到共面波导：缝隙一栏要从隐藏变可见（断计算样式，不只断属性）
  const cpwRowHidden = await page.evaluate(() => getComputedStyle(document.querySelector('#rf-ln-cpwrow')).display);
  assert(cpwRowHidden === 'none', '微带模式下共面波导的缝隙输入行必须真的不显示（计算样式）');
  await page.selectOption('#rf-ln-kind', 'cpw');
  await page.waitForTimeout(300);
  const cpwRowShown = await page.evaluate(() => getComputedStyle(document.querySelector('#rf-ln-cpwrow')).display);
  assert(cpwRowShown !== 'none', '共面波导模式下缝隙输入行必须显示');
  near(await numOf('#rf-ln-out', '特性阻抗 Z0'), 50, 1e-6, '共面波导综合也回到 50 Ω');
  assert((await numOf('#rf-ln-out', '线宽 W')) > 0, '共面波导综合出的线宽为正');
  await page.selectOption('#rf-ln-kind', 'ms');
  await page.waitForTimeout(250);
  // 分析方向：手填线宽 3.0185 mm 应给回 50 Ω
  await page.selectOption('#rf-ln-mode', 'anal');
  await page.fill('#rf-ln-w', '3.01854114');
  await page.waitForTimeout(250);
  near(await numOf('#rf-ln-out', '特性阻抗 Z0'), 50, 1e-4, '分析方向：3.01854 mm 给回 50 Ω');
  // 做不出来的目标要给出提示而不是画错图（FR-4 1.6 mm 在 2.4 GHz 的上限约 310 Ω）
  await page.selectOption('#rf-ln-mode', 'synth');
  await page.fill('#rf-ln-z0', '400');
  await page.waitForTimeout(250);
  assert((await page.locator('#rf-ln-out .rf-msg').count()) === 1, '不可实现的 Z0 给出明确提示');
  assert((await txt('#rf-ln-out .rf-msg')).includes('做不出'), '提示语点明是这套基板做不出来');
  // 非法基板参数（εr < 1）同样要拦住
  await page.fill('#rf-ln-z0', '50');
  await page.fill('#rf-ln-epr', '0.5');
  await page.waitForTimeout(250);
  assert((await page.locator('#rf-ln-out .rf-msg').count()) === 1, 'εr < 1 时给出提示');
  await page.fill('#rf-ln-epr', '4.4');
  await page.waitForTimeout(250);
  near(await numOf('#rf-ln-out', '线宽 W'), 3.0185, 1e-3, '参数改回来后线宽复原');

  // ---------- 5 滤波器：与 Python 独立 g 值 / numpy ABCD 响应比对 ----------
  await show('fl');
  // g 值（0.5 dB 纹波 N=5）：1.70582138 1.22961013 2.54088090 …
  const gTxt = (await page.locator('#rf-fl-out table').nth(0).textContent()).replace(/\s+/g, ' ');
  assert(/1\.70582/.test(gTxt) && /1\.22961/.test(gTxt) && /2\.54088/.test(gTxt), 'g 值表，实得 ' + gTxt);
  // 元件：C1 = 5.42979810 pF，L2 = 9.78492655 nH，C3 = 8.08787511 pF
  const eTxt = (await page.locator('#rf-fl-out table').nth(1).textContent()).replace(/\s+/g, ' ');
  assert(/5\.42980 pF/.test(eTxt) && /9\.78493 nH/.test(eTxt) && /8\.08788 pF/.test(eTxt), '元件值表，实得 ' + eTxt);
  // 关键频点：fc 处插损 −0.500051 dB，2fc 处 −42.039169 dB
  const kTxt = (await page.locator('#rf-fl-out table').nth(2).textContent()).replace(/\s+/g, ' ');
  assert(/-0\.5001/.test(kTxt.replace(/−/g, '-')), 'fc 处插损 ≈ −0.5001 dB，实得 ' + kTxt);
  assert(/-42\.039/.test(kTxt.replace(/−/g, '-')), '2fc 处插损 ≈ −42.039 dB，实得 ' + kTxt);
  // 阶数估算：40 dB @ ωs/ωc = 2，0.5 dB 纹波 ⇒ 切比雪夫 5 阶（精确 4.82）
  near(await numOf('#rf-fl-est', '切比雪夫所需阶数'), 5, 1e-9, '切比雪夫所需阶数');
  // 切到带通：每节要变成一对 LC，且元件数翻倍
  const nEl = await page.locator('#rf-fl-out table').nth(1).locator('tbody tr').count();
  await page.selectOption('#rf-fl-kind', 'bp');
  await page.waitForTimeout(300);
  const nEl2 = await page.locator('#rf-fl-out table').nth(1).locator('tbody tr').count();
  assert(nEl2 === nEl * 2, `带通每节一对 LC，元件行数应翻倍：${nEl} → ${nEl2}`);
  // 带通中心插损 ≈ 纹波（奇数阶等阻抗端接）
  const kTxt2 = (await page.locator('#rf-fl-out table').nth(2).textContent()).replace(/\s+/g, ' ');
  assert(/-0\.500/.test(kTxt2.replace(/−/g, '-')), '带通中心插损 ≈ −0.5 dB，实得 ' + kTxt2);
  // 切到带阻：中心必须深陷而不是 NaN
  await page.selectOption('#rf-fl-kind', 'bs');
  await page.waitForTimeout(300);
  const bsTxt = (await page.locator('#rf-fl-out table').nth(2).textContent()).replace(/\s+/g, ' ');
  assert(!/NaN|Infinity/.test(bsTxt), '带阻关键频点表里不得出现 NaN/Infinity，实得 ' + bsTxt);
  await page.selectOption('#rf-fl-kind', 'lp');
  await page.waitForTimeout(300);
  // 偶数阶切比雪夫：终端阻抗不再等于 Z0
  await page.fill('#rf-fl-n', '4');
  await page.waitForTimeout(300);
  const rl4 = await numOf('#rf-fl-out', '终端阻抗 RL');
  assert(Math.abs(rl4 - 50) > 1, `偶数阶切比雪夫的负载阻抗必须偏离 50 Ω，实得 ${rl4}`);
  await page.fill('#rf-fl-n', '5');
  await page.waitForTimeout(300);
  near(await numOf('#rf-fl-out', '终端阻抗 RL'), 50, 1e-6, '奇数阶回到 50 Ω 端接');

  // ---------- 6 能力清单：逐项现场跑 ----------
  await show('doc');
  const capList = await page.locator('#rf-caplist li').count();
  const capRun = await page.evaluate(() => window.RF_CAPS.map((c) => {
    try { return [c[0], !!c[1]()]; } catch (e) { return [c[0], 'EX:' + e.message]; }
  }));
  assert(capList === capRun.length && capList >= 35, `能力清单 ${capList} 条且与可执行表一一对应`);
  const dead = capRun.filter((c) => c[1] !== true);
  assert(dead.length === 0, '页面上列出的每条能力都要真的跑通，未通过：' + JSON.stringify(dead));
  // 公布的对拍条数必须钉死成离线套件实测的那个字面量（跨来源，不是页面自己加出来的）
  const verified = await page.evaluate(() => window.RF_VERIFIED);
  assert(verified === 56548, `页面公布的离线对拍条数应为 56548，实得 ${verified}`);
  assert((await txt('#rf-vercount')).replace(/,/g, '') === '56548', '页脚显示的对拍条数与常量一致');
  assert((await txt('#rf-vertext')).replace(/,/g, '') === '56548', '说明页里的对拍条数与常量一致');

  // ---------- 7 通用守卫 ----------
  // 7a 大小写：由 CSS 决定的表现要断计算样式，不能断 DOM 文本（text-transform 不改文本）
  let ttScanned = 0;
  for (const t of TABS) {
    await show(t);
    const bad = await page.evaluate((tab) => {
      const out = [];
      let n = 0;
      for (const e of document.querySelectorAll('#rf-page-' + tab + ' th, #rf-page-' + tab + ' dt, #rf-page-' + tab + ' label')) {
        if (!e.getClientRects().length) continue;
        n++;
        const tt = getComputedStyle(e).textTransform;
        if (tt !== 'none') out.push(e.tagName + ':' + e.textContent.slice(0, 14) + '=' + tt);
      }
      return { n, out };
    }, t);
    ttScanned += bad.n;
    assert(bad.out.length === 0, `${t} 页的表头/标签不得被 text-transform 改写（Hz→HZ 类事故）：${bad.out.join(', ')}`);
  }
  assert(ttScanned >= 60, `大小写守卫要真的扫到东西，实扫 ${ttScanned} 个元素`);

  // 7b 控件塌缩：逐个标签页扫（隐藏面板里的控件对守卫失明）
  let ctlScanned = 0;
  for (const t of TABS) {
    await show(t);
    const bad = await page.evaluate((tab) => {
      const out = [];
      let n = 0;
      for (const e of document.querySelectorAll('#rf-page-' + tab + ' input, #rf-page-' + tab + ' select, #rf-page-' + tab + ' button, #rf-page-' + tab + ' textarea')) {
        const r = e.getBoundingClientRect();
        if (!e.getClientRects().length) continue;
        n++;
        const min = e.tagName === 'BUTTON' ? 52 : 100;
        if (r.width < min || r.height < 18) out.push(`${e.tagName}#${e.id || e.className} ${r.width.toFixed(1)}x${r.height.toFixed(1)}`);
      }
      return { n, out };
    }, t);
    ctlScanned += bad.n;
    assert(bad.out.length === 0, `${t} 页有控件被压塌：${bad.out.join(', ')}`);
  }
  assert(ctlScanned >= 40, `控件守卫要真的扫到东西，实扫 ${ctlScanned} 个控件`);

  // 7c 窄屏横向溢出：390 / 768 两个视口 × 每个标签页
  for (const vw of [390, 768]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of TABS) {
      await show(t);
      await page.waitForTimeout(90);
      const info = await page.evaluate(() => {
        const de = document.documentElement;
        const over = de.scrollWidth - de.clientWidth;
        let who = '';
        if (over > 1) {
          for (const e of document.querySelectorAll('body *')) {
            const r = e.getBoundingClientRect();
            // SVG 元素的 className 是 SVGAnimatedString，直接拼会打出 [object …]，要走 getAttribute
            if (r.right > de.clientWidth + 1 && r.width > 0) { who = e.tagName + '.' + (e.getAttribute('class') || '') + ' right=' + r.right.toFixed(0); break; }
          }
        }
        return { over, who };
      });
      assert(info.over <= 1, `${vw}px 下 ${t} 页横向溢出 ${info.over}px（元凶 ${info.who}）`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });

  // 7d [hidden] 必须真的藏住（断计算样式）
  await show('tl');
  const hiddenOk = await page.evaluate(() => {
    const bad = [];
    for (const e of document.querySelectorAll('[hidden]')) if (getComputedStyle(e).display !== 'none') bad.push(e.id || e.className);
    return bad;
  });
  assert(hiddenOk.length === 0, '带 hidden 属性的元素必须计算样式为 display:none，违例：' + hiddenOk.join(','));
  const hiddenCount = await page.evaluate(() => document.querySelectorAll('[hidden]').length);
  assert(hiddenCount >= 5, `hidden 守卫要真的扫到东西，实扫 ${hiddenCount} 个`);

  // 7e 图上文字两两不重叠 + 每张图都真的画出了文字
  for (const t of ['tl', 'mt', 'tp', 'ln', 'fl']) {
    await show(t);
    await page.waitForTimeout(160);
    const r = await page.evaluate((tab) => {
      const res = [];
      for (const s of document.querySelectorAll('#rf-page-' + tab + ' svg')) {
        const texts = [...s.querySelectorAll('text')].map((e) => {
          const b = e.getBBox();
          return { t: e.textContent, x: b.x, y: b.y, w: b.width, h: b.height };
        }).filter((b) => b.w > 0);
        let hits = 0;
        for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
          const a = texts[i], b = texts[j];
          if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) hits++;
        }
        res.push({ n: texts.length, hits, drawn: +s.dataset.drawn, dropped: +s.dataset.dropped });
      }
      return res;
    }, t);
    assert(r.length > 0, `${t} 页至少有一张图`);
    r.forEach((x, i) => {
      assert(x.hits === 0, `${t} 页第 ${i + 1} 张图有 ${x.hits} 对文字重叠`);
      assert(x.n >= 4, `${t} 页第 ${i + 1} 张图只画出 ${x.n} 段文字，疑似标签被整片丢弃`);
      assert(x.dropped <= Math.max(2, x.drawn * 0.25), `${t} 页第 ${i + 1} 张图丢了 ${x.dropped} 个标签（画出 ${x.drawn}）`);
    });
  }

  // 7f 几何：史密斯圆图上的点必须落在单位圆内，且负载点位置与 Γ 对得上
  await show('tl');
  const geo = await page.evaluate(() => {
    const s = document.querySelector('#rf-tl-out svg');
    const vb = s.viewBox.baseVal, cx = vb.width / 2, cy = vb.height / 2;
    const Rr = Math.min(vb.width, vb.height) / 2 - 30;
    const dots = [...s.querySelectorAll('circle')].filter((c) => c.getAttribute('fill') && c.getAttribute('fill') !== 'none')
      .map((c) => ({ x: +c.getAttribute('cx'), y: +c.getAttribute('cy'), r: +c.getAttribute('r'), fill: c.getAttribute('fill') }));
    return { cx, cy, Rr, dots };
  });
  assert(geo.dots.length === 2, `史密斯圆图上应有 2 个标记点，实得 ${geo.dots.length}`);
  const load = geo.dots.find((d) => d.fill === '#29ABE2');
  const rr = Math.hypot(load.x - geo.cx, load.y - geo.cy) / geo.Rr;
  near(rr, 0.5549400666, 2e-3, '负载点到圆心的距离 / 半径 = |ΓL|');
  const ang = Math.atan2(-(load.y - geo.cy), load.x - geo.cx) * 180 / Math.PI;
  near(ang, -93.932896, 0.3, '负载点的极角 = ∠ΓL');
  geo.dots.forEach((d) => assert(Math.hypot(d.x - geo.cx, d.y - geo.cy) <= geo.Rr + 0.5, '标记点必须落在单位圆内'));

  // 7g 子元素盒不越出父格（读数卡）
  const escape = await page.evaluate(() => {
    const bad = [];
    for (const cell of document.querySelectorAll('.rf-read')) {
      const p = cell.getBoundingClientRect();
      for (const k of cell.children) {
        const c = k.getBoundingClientRect();
        if (c.right > p.right + 1 || c.left < p.left - 1) bad.push(cell.querySelector('dt').textContent + '|' + k.tagName);
      }
    }
    return bad;
  });
  assert(escape.length === 0, '读数卡里的文字不得溢出格子：' + escape.join(','));

  // 7h 状态持久化：改一个值刷新后还在
  await show('ln');
  await page.fill('#rf-ln-f', '5.8');
  await page.waitForTimeout(200);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(250);
  assert((await page.locator('#rf-ln-f').inputValue()) === '5.8', '频率设置刷新后仍在（localStorage）');
  assert((await page.locator('#rf-ln-f').isVisible()), '刷新后直接落在上次的标签页');
  await page.fill('#rf-ln-f', '2.4');
  await page.waitForTimeout(200);

  // 7i 键盘可达
  await page.locator('#rf-tabbtn-ln').focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  assert(await page.locator('#rf-tabbtn-fl').getAttribute('aria-selected') === 'true', '方向键可以切换标签页');

  assert(errors.length === 0, '页面不得抛异常：' + errors.join(' | '));

  await show('tl');
  await page.waitForTimeout(200);
  // 缩略图往下滚一点，让史密斯圆图（这个工具的主视觉）整块进画面
  await page.evaluate(() => window.scrollTo(0, 330));
  await page.waitForTimeout(300);
  await screenshot('thumb.png');
};
