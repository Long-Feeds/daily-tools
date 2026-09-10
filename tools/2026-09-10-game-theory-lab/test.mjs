// 集成测试 · 博弈论工作台
// 每个数值期望都先用引擎/oracle 实算过再写进来（见 run 目录 offline.mjs 与 oracle/）。
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.getAttribute('data-gt-ready') === '1');

  const txt = async (sel) => ((await page.locator(sel).textContent()) || '').trim();
  const num = async (sel) => Number((await txt(sel)).replace(/[,%\s]/g, ''));
  const TABS = ['normal', 'tree', 'evo', 'coop', 'mech', 'about'];
  const showTab = async (name) => {
    await page.click(`#gt-tabbtn-${name}`);
    await page.waitForFunction((n) => !document.getElementById('gt-panel-' + n).hidden, name);
  };

  // ---------- 1. 骨架与返回链接 ----------
  assert((await page.locator('#gt-back').getAttribute('href')) === '../../', '顶部有「← 返回工具集」且指向站点根');
  assert((await txt('#gt-back')).includes('返回工具集'), '返回链接文案正确');

  // ---------- 2. 策略式：囚徒困境（默认预设） ----------
  await page.selectOption('#gt-preset', 'pd');
  await page.waitForFunction(() => document.getElementById('gt-eq-count') && document.getElementById('gt-eq-count').textContent === '1');
  assert((await num('#gt-eq-count')) === 1, '囚徒困境只有 1 个纳什均衡');
  assert((await txt('#gt-eq-table')).includes('严格纯均衡'), '该均衡被判为严格纯均衡');
  assert((await txt('#gt-eq-row-0')).includes('招供'), '均衡是「招供 / 招供」');
  // 收益格 1,1 被高亮
  const pdCellClass = await page.locator('#gt-cell-1-1').getAttribute('class');
  assert((pdCellClass || '').includes('gt-eqcell'), '矩阵里 (招供,招供) 这一格被标成均衡格');
  assert((await page.locator('#gt-matwrap td.gt-eqcell').count()) === 1, '只有一格被标成均衡格');
  // 迭代剔除：严格优超两步解出
  assert((await page.locator('#gt-iesds-steps li').count()) === 2, '囚徒困境严格优超剔除恰好 2 步');
  assert((await txt('#gt-iesds-left')).includes('招供'), '剔除后只剩「招供」');
  assert((await txt('#gt-zs')).includes('不是零和'), '囚徒困境不是零和博弈');

  // ---------- 3. 性别战：三个均衡 + 混合概率必须是精确分数 ----------
  await page.selectOption('#gt-preset', 'bos');
  await page.waitForFunction(() => document.getElementById('gt-eq-count').textContent === '3');
  assert((await num('#gt-eq-count')) === 3, '性别战有 3 个纳什均衡');
  const bosMixed = await txt('#gt-eq-row-2');
  assert(bosMixed.includes('3/5') && bosMixed.includes('2/5'), `混合均衡以精确分数显示 3/5、2/5（得到 ${bosMixed}）`);
  assert(bosMixed.includes('1.2'), '混合均衡收益 6/5 显示为 1.2');
  assert((await txt('#gt-eq-degen')) === '非退化', '性别战判为非退化博弈');
  // Lemke–Howson：起始标签 1 走 2 步到 (看球赛,看球赛)，收益 2
  await page.selectOption('#gt-lh-label', '1');
  await page.click('#gt-lh-run');
  await page.waitForFunction(() => !!document.getElementById('gt-lh-steps'));
  assert((await num('#gt-lh-steps')) === 2, 'LH 从标签 1 出发走 2 步换基');
  assert((await txt('#gt-lh-gap')) === '0', 'LH 结果的偏离收益差为 0（确认是均衡）');
  assert((await txt('#gt-lh-payoff')).replace(/\s/g, '') === '2,3', `LH 结果收益应为 2 , 3（得到 ${await txt('#gt-lh-payoff')}）`);

  // ---------- 4. 退化博弈：精确判定 + 4 个端点 ----------
  await page.selectOption('#gt-preset', 'degen');
  await page.waitForFunction(() => document.getElementById('gt-eq-count').textContent === '4');
  assert((await num('#gt-eq-count')) === 4, '退化预设有 4 个极端均衡');
  assert((await txt('#gt-eq-degen')) === '退化', '被判为退化博弈');
  assert((await txt('#gt-diag-body')).includes('连续统'), '诊断里说明了均衡集含连续统');

  // 奇数个均衡但仍然退化：只看 Wilson 奇偶会判成「非退化」，精确判据必须判成「退化」
  await page.selectOption('#gt-preset', 'pd');
  await page.waitForFunction(() => document.getElementById('gt-eq-count').textContent === '1');
  for (const [id, v] of [['gt-a-0-0', '0'], ['gt-a-0-1', '0'], ['gt-a-1-0', '0'], ['gt-a-1-1', '1'],
                         ['gt-b-0-0', '1'], ['gt-b-0-1', '0'], ['gt-b-1-0', '0'], ['gt-b-1-1', '2']]) await page.fill('#' + id, v);
  await page.click('#gt-solve');
  await page.waitForFunction(() => document.getElementById('gt-eq-count').textContent === '3');
  assert((await num('#gt-eq-count')) === 3, '该局有 3 个极端均衡（奇数）');
  assert((await txt('#gt-eq-degen')) === '退化', '均衡数是奇数，但精确判据仍判为退化（顶点紧约束数超过维数）');
  assert((await txt('#gt-diag-body')).includes('1'), '诊断里给出了退化顶点的个数');

  // ---------- 5. 零和：石头剪刀布 ----------
  await page.selectOption('#gt-preset', 'rps');
  await page.waitForFunction(() => document.getElementById('gt-eq-count').textContent === '1');
  assert((await txt('#gt-eq-row-0')).includes('1/3'), '石头剪刀布均衡是各 1/3（精确分数）');
  assert((await txt('#gt-zs-value')).includes('0'), '零和博弈值为 0');
  assert((await txt('#gt-zs')).includes('零和博弈'), '被识别为零和博弈');

  // ---------- 6. 相关均衡：斗鸡博弈严格优于所有纳什均衡 ----------
  await page.selectOption('#gt-preset', 'chicken');
  await page.waitForFunction(() => document.getElementById('gt-eq-count').textContent === '3');
  await page.selectOption('#gt-ce-obj', 'egal');
  await page.click('#gt-ce-run');
  await page.waitForFunction(() => !!document.getElementById('gt-ce-obj-val'));
  assert((await num('#gt-ce-obj-val')) === 0, '斗鸡博弈的相关均衡能让两人中较低者达到 0');
  assert((await num('#gt-ce-ne-val')) === -0.1, '最好的纳什均衡在该目标下只有 -0.1');
  assert((await txt('#gt-ce-note')).includes('严格更优'), '页面指出相关均衡严格更优');
  assert((await txt('#gt-ce-0-0')) === '9/11', `联合分布 p(避让,避让)=9/11（得到 ${await txt('#gt-ce-0-0')}）`);

  // ---------- 7. 价格战 3×3：迭代剔除解出唯一均衡 ----------
  await page.selectOption('#gt-preset', 'price');
  await page.waitForFunction(() => document.getElementById('gt-eq-count').textContent === '1');
  assert((await page.locator('#gt-iesds-steps li').count()) === 4, '价格战严格优超剔除 4 步');
  assert((await txt('#gt-iesds')).includes('可解博弈'), '被判定为可解博弈');
  assert((await txt('#gt-eq-row-0')).includes('低价'), '唯一均衡是双方都「低价」');

  // ---------- 8. 手动改一格收益，结论必须跟着变 ----------
  await page.selectOption('#gt-preset', 'pd');
  await page.waitForFunction(() => document.getElementById('gt-eq-count').textContent === '1');
  await page.fill('#gt-a-1-0', '2');            // 招供/沉默 的行收益 5 → 2，招供不再严格优超
  await page.fill('#gt-b-0-1', '2');
  await page.click('#gt-solve');
  await page.waitForFunction(() => document.getElementById('gt-eq-count').textContent !== '1');
  assert((await num('#gt-eq-count')) === 3, `改掉两格收益后均衡从 1 个变成 3 个（得到 ${await num('#gt-eq-count')}）`);
  // 文本导出 / 导入往返
  await page.click('#gt-export');
  const exported = await page.inputValue('#gt-io');
  // 改后的矩阵：沉默行 = 3,3 / 0,2；招供行 = 2,0 / 1,1（A[1][0] 5→2、B[0][1] 5→2）
  assert(/沉默\t3,3\t0,2/.test(exported) && /招供\t2,0\t1,1/.test(exported), `导出的文本逐格等于改后的矩阵（得到 ${exported.replace(/\n/g, ' ⏎ ')}）`);
  await page.selectOption('#gt-preset', 'bos');
  await page.waitForFunction(() => document.getElementById('gt-eq-count').textContent === '3');
  await page.fill('#gt-io', exported);
  await page.click('#gt-import');
  await page.waitForFunction(() => document.getElementById('gt-a-1-0').value === '2');
  assert((await page.inputValue('#gt-a-1-0')) === '2', '导入后收益恢复成导出时的值');
  assert((await num('#gt-eq-count')) === 3, '导入后的均衡个数与导出时一致');
  // 非法输入要报错而不是静默
  await page.fill('#gt-a-0-0', 'abc');
  await page.click('#gt-solve');
  await page.waitForFunction(() => !document.getElementById('gt-materr').hidden);
  assert((await txt('#gt-materr')).includes('读不出来'), '非法收益给出明确报错');
  await page.selectOption('#gt-preset', 'pd');
  await page.waitForFunction(() => document.getElementById('gt-materr').hidden);
  assert((await page.evaluate(() => getComputedStyle(document.getElementById('gt-materr')).display)) === 'none',
    '报错框恢复后计算样式确实是 display:none（不是只把 hidden 属性设上）');

  // ---------- 9. 扩展式：进入威慑 ----------
  await showTab('tree');
  await page.selectOption('#gt-tree-preset', 'entry');
  await page.waitForFunction(() => (document.getElementById('gt-spne-value') || {}).textContent === '(2, 5)');
  assert((await txt('#gt-spne-value')) === '(2, 5)', '进入威慑的 SPNE 收益是 (2, 5)');
  assert((await num('#gt-spne-count')) === 1, '只有 1 个 SPNE');
  assert((await num('#gt-tree-pure-ne')) === 2, '策略式里有 2 个纯策略纳什均衡');
  assert((await num('#gt-noncredible')) === 1, '其中 1 个靠不可信威胁');
  assert((await txt('#gt-tree-ne')).includes('不可信威胁'), '页面点明了不可信威胁');
  const treeDrawn = Number(await page.locator('#gt-tree-fig').getAttribute('data-drawn'));
  const treeDropped = Number(await page.locator('#gt-tree-fig').getAttribute('data-dropped'));
  assert(Number(await page.locator('#gt-tree-fig').getAttribute('data-leaves')) === 3, '树上画了 3 个终局');
  assert(treeDrawn >= 8, `树形图至少画出 8 个标签（2 决策点 + 3 终局 + 3 动作，实得 ${treeDrawn}）`);
  assert(treeDropped === 0, `树形图没有被避让器丢弃的标签（丢了 ${treeDropped}）`);
  // 蜈蚣博弈：4 个决策点、5 个终局、4×4 策略式、SPNE 收益 (4,1)
  await page.selectOption('#gt-tree-preset', 'centipede');
  await page.waitForFunction(() => (document.getElementById('gt-spne-value') || {}).textContent === '(4, 1)');
  assert((await txt('#gt-spne-value')) === '(4, 1)', '蜈蚣博弈逆向归纳出第一步就「取」，收益 (4, 1)');
  assert(Number(await page.locator('#gt-tree-fig').getAttribute('data-leaves')) === 5, '蜈蚣博弈有 5 个终局');
  assert((await page.locator('#gt-bi-table tbody tr').count()) === 4, '逆向归纳表有 4 个决策点');
  assert((await page.locator('#gt-tree-strategic tbody tr').count()) === 4, '策略式是 4×4');
  const cDropped = Number(await page.locator('#gt-tree-fig').getAttribute('data-dropped'));
  assert(cDropped === 0, `蜈蚣树形图没有被丢弃的标签（丢了 ${cDropped}）`);
  // 并列最优 → 多个 SPNE
  await page.selectOption('#gt-tree-preset', 'tie');
  await page.waitForFunction(() => (document.getElementById('gt-spne-count') || {}).textContent === '2');
  assert((await num('#gt-spne-count')) === 2, '并列最优展开出 2 个 SPNE');
  // 送到策略式
  await page.selectOption('#gt-tree-preset', 'entry');
  await page.waitForFunction(() => (document.getElementById('gt-spne-value') || {}).textContent === '(2, 5)');
  await page.click('#gt-tree-send');
  await page.waitForFunction(() => !document.getElementById('gt-panel-normal').hidden);
  assert((await num('#gt-eq-count')) === 3, '送到策略式后算出 3 个极端均衡（含 1 个混合）');
  // 语法错误要报错
  await showTab('tree');
  await page.fill('#gt-tree-src', 'P1\n  进入 -> 打压');
  await page.click('#gt-tree-run');
  await page.waitForFunction(() => !document.getElementById('gt-tree-err').hidden);
  assert((await txt('#gt-tree-err')).includes('终局收益'), '博弈树语法错误给出明确报错');
  await page.selectOption('#gt-tree-preset', 'entry');
  await page.waitForFunction(() => document.getElementById('gt-tree-err').hidden);

  // ---------- 10. 演化 ----------
  await showTab('evo');
  await page.selectOption('#gt-evo-preset', 'hawkdove');
  await page.waitForFunction(() => (document.getElementById('gt-sym-count') || {}).textContent === '1');
  assert((await num('#gt-sym-count')) === 1, '鹰鸽博弈有 1 个对称均衡');
  assert((await num('#gt-ess-count')) === 1, '该均衡是 ESS');
  assert((await txt('#gt-ess-row-0')).includes('1/2'), '鹰鸽均衡是鹰、鸽各 1/2（V/C = 2/4）');
  await page.selectOption('#gt-evo-preset', 'rps');
  await page.waitForFunction(() => (document.getElementById('gt-ess-count') || {}).textContent === '0');
  assert((await num('#gt-sym-count')) === 1 && (await num('#gt-ess-count')) === 0, '石头剪刀布有唯一对称均衡但不是 ESS');
  const simDrawn = Number(await page.locator('#gt-evo-fig').getAttribute('data-drawn'));
  const simDropped = Number(await page.locator('#gt-evo-fig').getAttribute('data-dropped'));
  assert(simDrawn >= 4, `单纯形相图至少画出 3 个角标 + 1 个均衡标（实得 ${simDrawn}）`);
  assert(simDropped === 0, `单纯形相图没有丢弃标签（丢了 ${simDropped}）`);
  assert((await page.locator('#gt-evo-fig svg path').count()) >= 21, '相图上至少画了 21 条复制动态轨迹');
  await page.selectOption('#gt-evo-preset', 'punish');
  await page.waitForFunction(() => (document.getElementById('gt-sym-count') || {}).textContent === '3');
  assert((await num('#gt-sym-count')) === 3, '合作/背叛/惩罚有 3 个对称均衡');
  assert((await num('#gt-ess-count')) === 1, '其中只有「全背叛」是 ESS（惩罚者会被合作者搭便车侵入）');
  // 复制动态轨迹：囚徒困境从五五开出发必收敛到全背叛
  await page.selectOption('#gt-evo-preset', 'pd');
  await page.waitForFunction(() => (document.getElementById('gt-sym-count') || {}).textContent === '1');
  const finalMix = (await page.locator('#gt-evo-path-fig').getAttribute('data-final')).split(',').map(Number);
  assert(finalMix[1] > 0.999, `囚徒困境的复制动态收敛到全背叛（背叛占比 ${finalMix[1]}）`);
  // 重复囚徒困境循环赛
  await page.fill('#gt-ipd-turns', '200');
  await page.uncheck('#gt-ipd-self');
  await page.click('#gt-ipd-run');
  await page.waitForFunction(() => document.querySelectorAll('#gt-ipd-rank tbody tr').length === 10);
  assert((await txt('#gt-ipd-rank-0')).includes('以牙还牙'), '循环赛冠军是以牙还牙（TFT）');
  assert((await num('#gt-ipd-cell-ALLD-ALLC')) === 1000, '铁公鸡对老好人 200 轮拿满 1000 分（5×200）');
  assert((await num('#gt-ipd-cell-TFT-GRIM')) === 600, '以牙还牙对冷酷触发全程合作，600 分（3×200）');
  await page.selectOption('#gt-ipd-a', 'TFT');
  await page.selectOption('#gt-ipd-b', 'GRIM');
  await page.fill('#gt-ipd-show', '24');
  await page.click('#gt-ipd-play');
  await page.waitForFunction(() => (document.getElementById('gt-ipd-replay').getAttribute('data-score') || '') === '72:72');
  const seq = await page.locator('#gt-ipd-replay').getAttribute('data-seq');
  assert(seq === 'C'.repeat(24) + '|' + 'C'.repeat(24), '以牙还牙 vs 冷酷触发：24 轮全合作');

  // ---------- 11. 合作与投票 ----------
  await showTab('coop');
  await page.selectOption('#gt-vote-preset', 'sh3');
  await page.waitForFunction(() => (document.getElementById('gt-ss-0') || {}).textContent === '33.333%');
  assert((await txt('#gt-ss-0')) === '33.333%' && (await txt('#gt-ss-2')) === '33.333%',
    '49/48/3 三个股东的 Shapley–Shubik 权力完全相同（各 1/3）');
  await page.selectOption('#gt-vote-preset', 'unsc');
  await page.waitForFunction(() => (document.getElementById('gt-ss-0') || {}).textContent === '19.627%');
  assert((await txt('#gt-ss-0')) === '19.627%', '常任理事国权力 19.627%（与公开发表值一致）');
  assert((await txt('#gt-ss-5')) === '0.186%', '非常任理事国权力 0.186%');
  assert((await txt('#gt-vote-note')).includes('否决者 5 位'), '识别出 5 个否决者');
  assert((await txt('#gt-ss-sum')) === '1', '权力指数之和恰为 1');
  await page.selectOption('#gt-vote-preset', 'eec58');
  await page.waitForFunction(() => (document.getElementById('gt-ss-5') || {}).textContent === '0.000%');
  assert((await txt('#gt-vote-row-5')).includes('傀儡'), '1958 欧共体里卢森堡被判为傀儡');
  // 权力条形图的几何断言：票数条与权力条长度不同（票数 ≠ 权力）
  const bars = await page.evaluate(() => {
    const w = document.getElementById('gt-vbar-w-5'), p = document.getElementById('gt-vbar-p-5');
    return [Number(w.getAttribute('width')), Number(p.getAttribute('width'))];
  });
  assert(bars[0] > 5 && bars[1] === 0, `卢森堡有票数条（${bars[0]}px）但权力条长度为 0（${bars[1]}px）`);
  // 联盟值
  await page.selectOption('#gt-coop-preset', 'glove');
  await page.waitForFunction(() => (document.getElementById('gt-shapley-0') || {}).textContent === '2/3');
  assert((await txt('#gt-shapley-0')) === '2/3', '手套市场里持左手者的 Shapley 值 = 2/3');
  assert((await txt('#gt-shapley-1')) === '1/6' && (await txt('#gt-shapley-2')) === '1/6', '两个右手各 1/6');
  assert((await txt('#gt-coop-shsum')) === (await txt('#gt-coop-total')), 'Shapley 值之和等于大联盟总值');
  assert((await txt('#gt-coop-core')) === '非空', '手套市场的核心非空');
  await page.selectOption('#gt-coop-preset', 'majority');
  await page.waitForFunction(() => (document.getElementById('gt-coop-core') || {}).textContent === '空');
  assert((await txt('#gt-coop-core')) === '空', '三人多数决的核心是空的');
  assert((await txt('#gt-coop-eps')) === '1/3', `最小核 ε = 1/3（得到 ${await txt('#gt-coop-eps')}）`);
  await page.selectOption('#gt-coop-preset', 'partner');
  await page.waitForFunction(() => (document.getElementById('gt-coop-convex') || {}).textContent === '是');
  assert((await txt('#gt-coop-convex')) === '是', '四人合伙（v = 人数²）是凸博弈');
  assert((await txt('#gt-shapley-0')) === '4' && (await txt('#gt-coop-total')) === '16', '每人 Shapley 值 4，总值 16');
  // 手改一个联盟值，结论跟着变
  await page.fill('#gt-coop-v-15', '40');
  await page.click('#gt-coop-run');
  await page.waitForFunction(() => (document.getElementById('gt-coop-total') || {}).textContent === '40');
  assert((await txt('#gt-shapley-0')) === '10', '把大联盟值改成 40 后每人 Shapley 值变成 10');

  // ---------- 12. 匹配与拍卖 ----------
  await showTab('mech');
  await page.selectOption('#gt-match-preset', 'classic');
  await page.waitForFunction(() => (document.getElementById('gt-match-allcount') || {}).textContent === '3');
  assert((await num('#gt-match-blocking')) === 0, 'Gale–Shapley 的结果没有阻塞对');
  assert((await num('#gt-match-allcount')) === 3, '该实例共有 3 个稳定匹配');
  assert((await txt('#gt-match-a-0')) === '乙1' && (await txt('#gt-match-b-0')) === '乙3',
    '甲方求婚甲1得乙1，乙方求婚甲1只得乙3 —— 谁求婚谁占优');
  assert((await txt('#gt-match-note')).includes('谁先开口'), '页面点明了先开口的一方占优');
  await page.selectOption('#gt-match-preset', 'lattice');
  await page.waitForFunction(() => (document.getElementById('gt-match-allcount') || {}).textContent === '10');
  assert((await num('#gt-match-allcount')) === 10, '4×4 格结构示例有 10 个稳定匹配');
  await page.selectOption('#gt-match-preset', 'agree');
  await page.waitForFunction(() => (document.getElementById('gt-match-allcount') || {}).textContent === '1');
  assert((await txt('#gt-match-note')).includes('唯一'), '偏好一致时稳定匹配唯一');
  // 拍卖
  await page.fill('#gt-auc-v', '10,8,6,3');
  await page.fill('#gt-auc-k', '2');
  await page.click('#gt-auc-run');
  await page.waitForFunction(() => (document.getElementById('gt-auc-rev-second') || {}).textContent === '8');
  assert((await txt('#gt-auc-rev-second')) === '8', '二价拍卖收入 = 次高估值 8');
  assert((await txt('#gt-auc-rev-first')) === '7.5', '一价对称均衡出价 v×3/4，收入 7.5');
  // 全支付均衡出价 b(v)=(n−1)/n·vⁿ/V^(n−1)，V=10：7.5 / 3.072 / 0.972 / 0.06075，和 = 46419/4000
  assert((await txt('#gt-auc-rev-allpay')) === '11.60475', `全支付收入 = 四家出价之和 11.60475（得到 ${await txt('#gt-auc-rev-allpay')}）`);
  assert((await txt('#gt-auc-vmax')) === '10', '估值分布上界 V 取本批最大估值 10');
  assert((await txt('#gt-auc-exprev')) === '6', '三种规则的理论期望收入 (n−1)/(n+1)·V = 6');
  assert((await txt('#gt-auc-winner-second')).includes('买家 1'), '三种规则都由估值最高者胜出');
  assert((await txt('#gt-vcg-pay-0')) === '6' && (await txt('#gt-vcg-pay-1')) === '6', 'VCG 两个赢家各付第 3 高的估值 6');
  assert((await txt('#gt-vcg-welfare')) === '18' && (await txt('#gt-vcg-rev')) === '12', 'VCG 总福利 18、收入 12');
  // TTC
  await page.waitForFunction(() => !!document.getElementById('gt-ttc-got-0'));
  assert((await txt('#gt-ttc-got-0')) === '房 2', 'TTC：第 1 人换到房 2');
  assert((await txt('#gt-ttc-got-1')) === '房 3' && (await txt('#gt-ttc-got-2')) === '房 1', 'TTC 三人成环互换');
  assert((await txt('#gt-ttc-got-3')) === '房 4', '第 4 人最想要自己的房，留在原地');
  assert(Number(await page.locator('#gt-ttc-fig').getAttribute('data-rounds')) === 1, 'TTC 一轮就全部成交');

  // ---------- 13. 说明页：能力清单必须逐项现场跑通 ----------
  await showTab('about');
  const caps = await page.evaluate(() => window.GT_CAPS.map((c) => {
    let okv = false; try { okv = !!c.probe(); } catch (e) { okv = false; }
    return { id: c.id, ok: okv };
  }));
  const dead = caps.filter((c) => !c.ok).map((c) => c.id);
  assert(dead.length === 0, `能力清单里有 ${dead.length} 项跑不通：${dead.join(', ')}`);
  assert(caps.length === 32, `能力清单共 32 项（得到 ${caps.length}）`);
  const capRows = await page.locator('#gt-cap-table tbody tr').count();
  assert(capRows === caps.length, `表里的行数 ${capRows} 与清单项数 ${caps.length} 一致`);
  const capPassText = await txt('#gt-kv-capspass');
  assert(capPassText === caps.length + ' 项', `页面公布的「现场自检通过」= ${caps.length} 项（异源核对：这是浏览器里逐项跑出来的）`);
  // 验证规模：钉死离线套件实测出来的字面量（改任何一行都会红）
  assert((await num('#gt-verify-total')) === 17396, `页面公布的离线对拍总数应为 17396（得到 ${await num('#gt-verify-total')}）`);
  assert((await num('#gt-verify-count')) === 17396, '顶栏的对拍条数与说明页一致');
  assert((await num('#gt-verify-n-0')) === 628, 'Gambit enummixed 那一行是 628 条');
  assert((await num('#gt-verify-n-5')) === 3567, 'Lemke–Howson 自检那一行是 3567 条');
  assert((await num('#gt-verify-n-19')) === 1000, 'Axelrod 那一行是 1000 条');
  const verifyRows = await page.locator('#gt-verify-table tbody tr').count();
  assert(verifyRows === 24, `验证表 23 行来源 + 1 行合计（得到 ${verifyRows}）`);
  assert((await txt('#gt-about-caliber')).includes('nashpy'), '口径页写明了 nashpy 的 support_enumeration 会漏均衡');

  // ---------- 14. 通用守卫 ----------
  // (a) markdown 记号不得泄漏到页面上
  const mdLeak = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('#gt-panel-about *, #gt-panel-normal *').forEach((el) => {
      if (el.children.length) return;
      const t = (el.textContent || '');
      if (/\*\*/.test(t)) out.push(el.tagName + ':' + t.slice(0, 40));
    });
    return out;
  });
  assert(mdLeak.length === 0, `页面上出现了未渲染的 markdown 记号：${mdLeak.join(' | ')}`);
  // (b) 单位符号不得被 uppercase 改写
  const upper = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('th,dt,label').forEach((el) => {
      const t = (el.textContent || '');
      if (/\b(HZ|KHZ|DBFS|DB)\b/.test(t)) out.push(t.slice(0, 40));
    });
    return out;
  });
  assert(upper.length === 0, `疑似被 uppercase 改写的单位：${upper.join(' | ')}`);
  // (c) 控件塌缩守卫：逐个标签页扫一遍
  let scanned = 0;
  for (const t of TABS) {
    await showTab(t);
    const bad = await page.evaluate((tab) => {
      const out = [];
      let n = 0;
      document.querySelectorAll(`#gt-panel-${tab} input, #gt-panel-${tab} select, #gt-panel-${tab} button`).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;      // 不可见的不算
        n++;
        const isCell = el.classList.contains('gt-cellin') || el.classList.contains('gt-namein');
        const isCheck = el.type === 'checkbox';
        const minW = isCheck ? 12 : isCell ? 40 : el.tagName === 'BUTTON' ? 52 : 100;
        if (r.width < minW || r.height < 18) out.push(`${tab}:${el.id || el.className}=${r.width.toFixed(0)}×${r.height.toFixed(0)}(需≥${minW}×18)`);
      });
      return { out, n };
    }, t);
    scanned += bad.n;
    assert(bad.out.length === 0, `控件塌缩：${bad.out.join(' | ')}`);
    // 说明页是纯文本，没有控件；其余每页都必须扫到东西（防「选择器写错也算绿」）
    if (t !== 'about') assert(bad.n >= 3, `「${t}」页至少要扫到 3 个可见控件（实得 ${bad.n}，说明选择器或面板可见性出问题了）`);
  }
  // 下界防「一个都没扫到也算绿」：实测 102（2×2 矩阵 8 格 + 各页控件）
  assert(scanned >= 95, `逐页扫到的可见控件数应 ≥ 95（实得 ${scanned}）`);
  // (d) 窄屏横向溢出守卫：逐视口 × 逐标签页
  for (const vw of [390, 768]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const t of TABS) {
      await showTab(t);
      const over = await page.evaluate(() => {
        const de = document.documentElement;
        const delta = de.scrollWidth - de.clientWidth;
        if (delta <= 1) return { delta: 0, who: '' };
        let who = '', worst = 0;
        document.querySelectorAll('body *').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.right > de.clientWidth + 1 && r.width > 0) {
            if (r.right > worst) { worst = r.right; who = el.tagName + (el.id ? '#' + el.id : '.' + String(el.className).split(' ')[0]); }
          }
        });
        return { delta, who: who + '@' + worst.toFixed(0) };
      });
      assert(over.delta === 0, `${vw}px 下「${t}」页横向溢出 ${over.delta}px，元凶 ${over.who}`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  // (e) 小格子里的文字不得溢出格子（矩阵单元格）
  await showTab('normal');
  const escapes = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('#gt-matwrap td').forEach((td) => {
      const p = td.getBoundingClientRect();
      td.querySelectorAll('input').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.left < p.left - 1 || r.right > p.right + 1 || r.top < p.top - 1 || r.bottom > p.bottom + 1) out.push(el.id);
      });
    });
    return out;
  });
  assert(escapes.length === 0, `收益输入框跑出了所在格子：${escapes.join(', ')}`);
  // (f) 图里的文字两两不重叠（避让器自检）+ 真的画出来了
  await showTab('normal');
  const figs = await page.evaluate(() => {
    const out = [];
    ['gt-payoff-fig', 'gt-br-fig'].forEach((id) => {
      const el = document.getElementById(id);
      out.push({ id, drawn: Number(el.getAttribute('data-drawn') || 0), dropped: Number(el.getAttribute('data-dropped') || 0), texts: el.querySelectorAll('text').length });
    });
    return out;
  });
  for (const f of figs) {
    assert(f.drawn >= 6, `${f.id} 至少画出 6 个标签（实得 ${f.drawn}）`);
    assert(f.dropped <= 2, `${f.id} 被丢弃的标签过多（${f.dropped}）`);
    assert(f.texts >= f.drawn, `${f.id} 的 <text> 数量与避让器计数对得上`);
  }
  // (f2) 图里的文字两两不重叠 —— force 标签绕过了避让器，只能靠几何断言兜
  for (const [tab, ids] of [['normal', ['gt-payoff-fig', 'gt-br-fig']], ['tree', ['gt-tree-fig']],
                            ['evo', ['gt-evo-fig', 'gt-evo-path-fig', 'gt-ipd-replay']],
                            ['coop', ['gt-coop-fig', 'gt-vote-fig']], ['mech', ['gt-match-fig', 'gt-ttc-fig']]]) {
    await showTab(tab);
    for (const id of ids) {
      const bad = await page.evaluate((fid) => {
        const els = [...document.querySelectorAll('#' + fid + ' text')];
        const rs = els.map((e) => { const r = e.getBoundingClientRect(); return { t: e.textContent, x: r.left, y: r.top, x2: r.right, y2: r.bottom }; });
        const out = [];
        for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) {
          const a = rs[i], b = rs[j];
          const ox = Math.min(a.x2, b.x2) - Math.max(a.x, b.x);
          const oy = Math.min(a.y2, b.y2) - Math.max(a.y, b.y);
          if (ox > 1 && oy > 1) out.push(`${a.t} × ${b.t}`);
        }
        return { n: rs.length, out };
      }, id);
      assert(bad.n >= 3, `${id} 至少有 3 段文字（实得 ${bad.n}）`);
      assert(bad.out.length === 0, `${id} 里有文字互相压住：${bad.out.slice(0, 4).join(' | ')}`);
    }
  }
  await showTab('normal');

  // (g) tab 切换真的把别的面板藏起来（断计算样式，不是只断 hidden 属性）
  await showTab('coop');
  const disp = await page.evaluate(() => ['normal', 'tree', 'evo', 'coop', 'mech', 'about']
    .map((t) => [t, getComputedStyle(document.getElementById('gt-panel-' + t)).display]));
  const visible = disp.filter((d) => d[1] !== 'none').map((d) => d[0]);
  assert(visible.length === 1 && visible[0] === 'coop', `只有当前面板可见（实际可见：${visible.join(',')}）`);

  // ---------- 15. 缩略图 ----------
  await showTab('normal');
  await page.selectOption('#gt-preset', 'bos');
  await page.waitForFunction(() => document.getElementById('gt-eq-count').textContent === '3');
  await page.waitForTimeout(120);
  await screenshot('thumb.png');
}
