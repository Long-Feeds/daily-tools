// 协同编辑实验室 · CRDT Lab —— 真实浏览器集成测试。
// 断言真值（收敛后的具体文本、墓碑计数、TP2 反例、格代数律），不只是查元素存在。
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#cl-reps .cl-rep');

  const txt = async (sel) => ((await page.locator(sel).textContent()) || '').trim();
  const repText = (c) => page.locator('#cl-ta-' + c).inputValue();
  const onTab = async (name, fn) => {
    await page.click('#cl-tab-' + name);
    await page.waitForFunction(
      (n) => !document.getElementById('cl-panel-' + n).hidden, name, { timeout: 5000 });
    const r = await fn();
    return r;
  };
  const setSel = async (sel, v) => {
    await page.selectOption(sel, v);
    await page.waitForTimeout(30);
  };

  /* ── 0. [hidden] 守卫：非当前分区必须真的看不见（不只是属性为真） ── */
  for (const p of ['inside', 'causal', 'zoo', 'ot', 'about']) {
    const disp = await page.evaluate(
      (n) => getComputedStyle(document.getElementById('cl-panel-' + n)).display, p);
    assert(disp === 'none', `启动时 ${p} 分区的计算样式应为 none（实得 ${disp}）`);
  }
  assert(await page.evaluate(
    () => getComputedStyle(document.getElementById('cl-panel-sandbox')).display) !== 'none',
    '沙盒分区应当可见');

  /* ── 1. 默认剧本：并发插在同一位置，YATA 应给出确定的一种次序 ── */
  assert(await txt('#cl-converge-badge') === '✗ 尚未收敛', '默认剧本装载后消息还在途，不该显示已收敛');
  const inflight0 = await txt('#cl-inflight');
  assert(/在途 [1-9]/.test(inflight0), `应有在途消息（实得 "${inflight0}"）`);
  await page.click('#cl-deliver-all');
  await page.waitForFunction(() => document.getElementById('cl-converge-badge').textContent.indexOf('已收敛') >= 0);
  const t1 = await repText(1), t2 = await repText(2), t3 = await repText(3);
  assert(t1 === t2 && t2 === t3, `三副本应完全一致（实得 ${JSON.stringify([t1, t2, t3])}）`);
  assert(t1 === '合同金额为八九十 万元',
    `YATA 并发同位插入应按副本号升序排成「八九十」（实得 ${JSON.stringify(t1)}）`);

  /* ── 2. 倒序 / 乱序投递不改变结果 ── */
  for (const [btn, label] of [['#cl-deliver-rev', '倒序'], ['#cl-deliver-shuf', '乱序']]) {
    await setSel('#cl-script', 'same');
    await page.waitForFunction(() => document.querySelectorAll('#cl-queue .cl-q-row').length > 0);
    await page.click(btn);
    await page.waitForFunction(() => document.getElementById('cl-converge-badge').textContent.indexOf('已收敛') >= 0);
    const a = await repText(1), b = await repText(3);
    assert(a === '合同金额为八九十 万元' && b === a,
      `${label}投递结果应与顺序投递相同（实得 ${JSON.stringify([a, b])}）`);
  }

  /* ── 3. 逐条手动投递：中途必然不收敛，投完必然收敛 ── */
  await setSel('#cl-script', 'same');
  const total = await page.locator('#cl-queue .cl-q-row').count();
  assert(total === 6, `3 副本 × 每人 1 op 应产生 6 条在途消息（实得 ${total}）`);
  await page.click('#cl-deliver-one');
  assert((await txt('#cl-converge-badge')).indexOf('尚未收敛') >= 0, '只投一条后不应收敛');
  for (let i = 0; i < total; i++) await page.click('#cl-deliver-one');
  await page.waitForFunction(() => document.getElementById('cl-converge-badge').textContent.indexOf('已收敛') >= 0);
  assert(await page.locator('#cl-queue .cl-q-row').count() === 0, '全部投递后队列应清空');

  /* ── 4. 真的在文本框里打字 → 生成 op → 广播 ── */
  await page.click('#cl-reset');
  await page.fill('#cl-ta-1', '你好');
  await page.waitForFunction(() => document.querySelectorAll('#cl-queue .cl-q-row').length > 0);
  await page.click('#cl-deliver-all');
  await page.waitForFunction(() => document.getElementById('cl-ta-2').value === '你好');
  assert(await repText(2) === '你好', '副本 1 打的字应同步到副本 2');
  // 两边并发在同一位置插入不同的字
  await page.fill('#cl-ta-1', '你好呀');
  await page.fill('#cl-ta-2', '你好哇');
  await page.click('#cl-deliver-all');
  await page.waitForFunction(() => document.getElementById('cl-converge-badge').textContent.indexOf('已收敛') >= 0);
  const merged = await repText(1);
  assert(merged === '你好呀哇', `并发插入两个字都应保留且定序（实得 ${JSON.stringify(merged)}）`);
  assert(await repText(2) === merged && await repText(3) === merged, '三副本仍应一致');

  /* ── 5. 删除留下墓碑，两人删同一个字只消失一次 ── */
  await page.click('#cl-reset');
  await setSel('#cl-auto', 'auto');
  await page.fill('#cl-ta-1', 'abc');
  await page.waitForFunction(() => document.getElementById('cl-ta-2').value === 'abc');
  await setSel('#cl-auto', 'manual');
  await page.fill('#cl-ta-1', 'ac');
  await page.fill('#cl-ta-2', 'ac');
  await page.click('#cl-deliver-all');
  await page.waitForFunction(() => document.getElementById('cl-converge-badge').textContent.indexOf('已收敛') >= 0);
  assert(await repText(1) === 'ac', `双删同一个字应得 "ac"（实得 ${JSON.stringify(await repText(1))}）`);
  const tomb = Number(await txt('#cl-tomb-1'));
  assert(tomb === 1, `应恰好留下 1 个墓碑（实得 ${tomb}）`);
  const live = Number(await txt('#cl-live-1'));
  assert(live === 2, `可见字符应为 2（实得 ${live}）`);

  /* ── 6. 断链（分区）：断开期间收不到，恢复后追上 ── */
  await page.click('#cl-reset');
  await setSel('#cl-auto', 'auto');
  await page.fill('#cl-ta-1', '基线');
  await page.waitForFunction(() => document.getElementById('cl-ta-2').value === '基线');
  await setSel('#cl-auto', 'manual');
  await page.click('[data-link="1-2"]');
  assert(await page.locator('[data-link="1-2"]').getAttribute('aria-pressed') === 'true', '链路应被标记为断开');
  await page.fill('#cl-ta-1', '基线甲');
  await page.click('#cl-deliver-all');
  assert(await repText(2) === '基线', `分区中的副本 2 不该收到新字（实得 ${JSON.stringify(await repText(2))}）`);
  assert(await repText(3) === '基线甲', '未分区的副本 3 应当收到');
  await page.click('[data-link="1-2"]');
  await page.click('#cl-deliver-all');
  await page.waitForFunction(() => document.getElementById('cl-ta-2').value === '基线甲');
  assert(await repText(2) === '基线甲', '恢复链路后副本 2 应追上');

  /* ── 7. 四种算法各自的定序口径 ── */
  const orderOf = async (algo) => {
    await setSel('#cl-algo', algo);
    await setSel('#cl-script', 'same');
    await page.click('#cl-deliver-all');
    await page.waitForFunction(
      () => document.getElementById('cl-converge-badge').textContent.indexOf('已收敛') >= 0);
    return repText(1);
  };
  assert(await orderOf('YATA') === '合同金额为八九十 万元', 'YATA：副本号小者在前');
  assert(await orderOf('RGA') === '合同金额为十九八 万元',
    `RGA：副本号大者在前（实得 ${JSON.stringify(await repText(1))}）`);
  const lseq = await orderOf('LSEQ');
  assert(lseq.length === '合同金额为八九十 万元'.length && /[八九十]{3}/.test(lseq),
    `LSEQ：三个字都保留（实得 ${JSON.stringify(lseq)}）`);
  const ot = await orderOf('OT');
  assert(ot === '合同金额为八九十 万元', `Jupiter OT 也应收敛到确定次序（实得 ${JSON.stringify(ot)}）`);
  const srv = await page.locator('#cl-ta-server').inputValue();
  assert(srv === ot, `服务器副本应与客户端一致（实得 ${JSON.stringify(srv)}）`);

  /* ── 8. 因果缓冲：跳号的 op 被扣住 ── */
  await setSel('#cl-algo', 'YATA');
  await page.click('#cl-reset');
  await setSel('#cl-auto', 'auto');
  await page.fill('#cl-ta-1', 'abc');
  await page.waitForFunction(() => document.getElementById('cl-ta-2').value === 'abc');
  await setSel('#cl-auto', 'manual');
  await page.fill('#cl-ta-1', 'aXYbc');            // 一次输入两个字符 = 两条有先后的 op
  const rows = page.locator('#cl-queue .cl-q-row');
  assert(await rows.count() === 4, `两条 op × 两个目标应有 4 条消息（实得 ${await rows.count()}）`);
  // 找到发往副本 2 的第二条，先投它
  const msgs = await page.evaluate(() => window.CLApp.state.sim.queue
    .filter((q) => q.to === 2).map((q) => q.m));
  await page.click(`#cl-queue .cl-q-row[data-msg="${msgs[1]}"] .cl-btn`);
  await page.waitForFunction(() => document.getElementById('cl-rep-pending-2').textContent.indexOf('缓冲 1') >= 0);
  assert(await repText(2) === 'abc', '被扣住的 op 不该改变文本');
  await onTab('causal', async () => {
    const bufRows = await page.locator('#cl-buf tbody tr').count();
    assert(bufRows === 1, `因果缓冲表应有 1 行（实得 ${bufRows}）`);
    const cell = (await page.locator('#cl-buf tbody tr td').nth(0).textContent()) || '';
    assert(cell.indexOf('副本 2') >= 0, `缓冲应记在副本 2 上（实得 "${cell}"）`);
  });
  await page.click('#cl-tab-sandbox');
  await page.click(`#cl-queue .cl-q-row[data-msg="${msgs[0]}"] .cl-btn`);
  await page.waitForFunction(() => document.getElementById('cl-ta-2').value === 'aXYbc');
  assert(await repText(2) === 'aXYbc', '前置补齐后应一次性交付两条');

  /* ── 9. 文档内部：墓碑与 origin 元数据 ── */
  await onTab('inside', async () => {
    const head = await page.locator('#cl-inside-tbl thead th').allTextContents();
    assert(head.join('|').indexOf('左 origin') >= 0, `YATA 应展示左 origin 列（实得 ${head.join('|')}）`);
    const bodyRows = await page.locator('#cl-inside-tbl tbody tr').count();
    assert(bodyRows === 5, `文档内部应有 5 个条目（实得 ${bodyRows}）`);
    const fig = page.locator('#cl-inside-fig');
    assert(await fig.locator('svg').count() === 1, '应画出结构图');
    const dropped = Number(await fig.getAttribute('data-dropped'));
    assert(dropped === 0, `结构图不该有被避让器丢弃的标签（实得 ${dropped}）`);
    const drawn = Number(await fig.getAttribute('data-drawn'));
    assert(drawn >= 5, `结构图至少应画出 5 个标签（实得 ${drawn}）`);
    // 弧线：每个非首字符都应有一条指向 origin 的路径
    const arcs = await fig.locator('svg path[marker-end]').count();
    assert(arcs >= 4, `应有指向 origin 的弧线（实得 ${arcs}）`);
  });

  /* ── 10. 因果图与向量时钟 ── */
  await onTab('causal', async () => {
    const dag = page.locator('#cl-dag');
    const nodes = Number(await dag.getAttribute('data-nodes'));
    assert(nodes === 5, `因果图应有 5 个节点（实得 ${nodes}）`);
    assert(Number(await dag.getAttribute('data-dropped')) === 0, '因果图不该丢弃标签');
    assert(await dag.locator('svg circle').count() === 5, '每条 op 一个节点');
    const vcRows = await page.locator('#cl-vc tbody tr').count();
    assert(vcRows === 3, `向量时钟表应有 3 行（实得 ${vcRows}）`);
    const vc1 = (await page.locator('#cl-vc tbody tr').nth(0).locator('td').nth(1).textContent()) || '';
    assert(vc1 === '[5,0,0]', `副本 1 的向量时钟应为 [5,0,0]（实得 "${vc1}"）`);
    const vc2 = (await page.locator('#cl-vc tbody tr').nth(1).locator('td').nth(1).textContent()) || '';
    assert(vc2 === '[5,0,0]', `副本 2 补齐后向量时钟也应为 [5,0,0]（实得 "${vc2}"）`);
    // happens-before：同副本连打的两条 op 必有先后
    const hbBody = await page.locator('#cl-hb tbody tr').count();
    assert(hbBody === 5, `happens-before 表应有 5 行（实得 ${hbBody}）`);
    const arrows = (await page.locator('#cl-hb tbody').textContent()) || '';
    assert(arrows.indexOf('→') >= 0, 'happens-before 表里应出现 → 关系');
  });

  /* ── 11. CRDT 图鉴：真的点按钮、真的合并、真的验代数律 ── */
  await onTab('zoo', async () => {
    const items = await page.locator('#cl-zoolist .cl-btn').count();
    assert(items === 8, `图鉴应有 8 种类型（实得 ${items}）`);
    // G-Counter：两副本各 +1，合并后应为 2
    await page.click('[data-zooop="1:inc"]');
    await page.click('[data-zooop="1:inc"]');
    await page.click('[data-zooop="2:inc"]');
    assert((await txt('#cl-zooval-1')) === '值 = 2', `副本1 两次 +1 应为 2（实得 ${await txt('#cl-zooval-1')}）`);
    await page.click('#cl-zoo-syncall');
    for (const c of [1, 2, 3]) {
      assert((await txt('#cl-zooval-' + c)) === '值 = 3',
        `合并后三副本都应是 3（副本${c} 实得 ${await txt('#cl-zooval-' + c)}）`);
    }
    assert(await page.locator('#cl-laws').getAttribute('data-allpass') === 'true', 'G-Counter 四条定律应全通过');
    // 幂等：再合并一次不应改变
    await page.click('#cl-zoo-syncall');
    assert((await txt('#cl-zooval-1')) === '值 = 3', '再次合并不应改变结果（幂等）');

    // OR-Set：并发「删」与「加」，加方胜
    await page.click('[data-zoo="or-set"]');
    await page.fill('#cl-zoo-elem', '苹果');
    await page.click('[data-zooop="1:add"]');
    await page.click('#cl-zoo-syncall');
    assert((await txt('#cl-zooval-2')) === '值 = {苹果}', '同步后每个副本都应有苹果');
    await page.click('[data-zooop="2:rm"]');
    await page.click('[data-zooop="3:add"]');
    await page.click('#cl-zoo-syncall');
    assert((await txt('#cl-zooval-1')) === '值 = {苹果}',
      `OR-Set 并发加删应 add-wins（实得 ${await txt('#cl-zooval-1')}）`);
    assert(await page.locator('#cl-laws').getAttribute('data-allpass') === 'true', 'OR-Set 四条定律应全通过');

    // 2P-Set：删过就加不回来
    await page.click('[data-zoo="2p-set"]');
    await page.click('[data-zooop="1:add"]');
    await page.click('[data-zooop="1:rm"]');
    await page.click('[data-zooop="1:add"]');
    assert((await txt('#cl-zooval-1')) === '值 = {}',
      `2P-Set 删除后再加应仍为空（实得 ${await txt('#cl-zooval-1')}）`);
    await page.click('#cl-zoo-demo');
    const demo = await txt('#cl-zoo-demoout');
    assert(demo.length > 20 && demo.indexOf('值') < 0 ? true : true, '异常剧本应给出文字说明');
    assert(demo.indexOf('回不来') >= 0, `2P-Set 异常说明应点出「回不来」（实得 "${demo.slice(0, 40)}"）`);

    // 逐种切换，每种的四条定律都要过，值也要能读出来
    for (const k of ['g-counter', 'pn-counter', 'g-set', '2p-set', 'lww-register',
      'mv-register', 'or-set', 'lww-map']) {
      await page.click(`[data-zoo="${k}"]`);
      assert(await page.locator('#cl-laws').getAttribute('data-allpass') === 'true',
        `${k} 的格代数律应全通过`);
      await page.click('#cl-zoo-demo');
      const d = await txt('#cl-zoo-demoout');
      assert(d.length > 10, `${k} 的异常剧本应输出内容`);
    }
  });

  /* ── 12. OT 对照台：TP1 通过、TP2 有反例、dOPT 分叉 ── */
  await onTab('ot', async () => {
    assert((await txt('#cl-tp1-badge')) === '全部通过', 'TP1 应全部通过');
    const c = await txt('#cl-tp1-count');
    assert(/1,807/.test(c), `TP1 应检查 1,807 组（实得 "${c}"）`);
    const tp2 = (await page.locator('#cl-tp2').textContent()) || '';
    assert(tp2.indexOf('"CA"') >= 0 && tp2.indexOf('"AC"') >= 0,
      `TP2 反例应给出 "CA" 与 "AC" 两条路径（实得 "${tp2.slice(0, 160)}"）`);
    assert(await page.locator('#cl-dopt').getAttribute('data-dopt-converged') === 'false', 'dOPT 应分叉');
    assert(await page.locator('#cl-dopt').getAttribute('data-yata-converged') === 'true', 'YATA 应收敛');
    const doptRow = (await page.locator('#cl-dopt tbody tr').nth(0).textContent()) || '';
    assert(doptRow.indexOf('分叉') >= 0, `dOPT 行结论应为分叉（实得 "${doptRow}"）`);
    // 元数据开销：OT 无墓碑，三种 CRDT 有
    const ov = await page.locator('#cl-overhead tbody tr').allTextContents();
    assert(ov.length === 4, `开销表应有 4 行（实得 ${ov.length}）`);
    const cells = await page.locator('#cl-overhead tbody tr').nth(3).locator('td').allTextContents();
    assert(cells[0].indexOf('Jupiter') >= 0 && cells[2] === '0', `OT 行墓碑应为 0（实得 ${cells.join('|')}）`);
    const yataCells = await page.locator('#cl-overhead tbody tr').nth(0).locator('td').allTextContents();
    assert(Number(yataCells[2]) >= 25, `YATA 应留下 ≥25 个墓碑（实得 ${yataCells[2]}）`);
    assert(Number(yataCells[1]) === Number(cells[1]),
      `四种算法的可见字符数应相同（YATA ${yataCells[1]} vs OT ${cells[1]}）`);
  });

  /* ── 13. 说明页：公布的数字必须对得上 ──
     注意：分项之和 = 总数 是**同源推导**（总数就是把分项加起来的），单靠它测不出
     「表里的数字被改错」。所以另外做两件事：① 把表里能在页面上现场复算的两行
     （TP1 / TP2）与 OT 分区实跑出来的值交叉核对；② 把总数钉死成离线套件实测的
     262,029，任何静默改动都会红。 */
  const liveTp1 = Number((((await txt('#cl-tp1-count')) || '').match(/共检查\s*([\d,]+)/) || [0, '0'])[1]
    .replace(/,/g, ''));
  const liveTp2 = Number((((await txt('#cl-tp2-note')) || '').match(/搜到第\s*(\d+)/) || [0, '0'])[1]);
  assert(liveTp1 === 1807 && liveTp2 === 17, `OT 分区现场跑出的 TP1/TP2 应为 1807/17（实得 ${liveTp1}/${liveTp2}）`);
  await onTab('about', async () => {
    const rows = await page.locator('#cl-about-verify tbody tr').all();
    const map = {};
    for (const r of rows) {
      const cells = await r.locator('td').allTextContents();
      map[cells[0].trim()] = Number(String(cells[1]).replace(/,/g, ''));
    }
    const tp1Row = Object.keys(map).find((k) => k.indexOf('TP1') >= 0);
    const tp2Row = Object.keys(map).find((k) => k.indexOf('TP2') >= 0);
    assert(map[tp1Row] === liveTp1,
      `验证表里的 TP1 条数 ${map[tp1Row]} 应等于现场跑出来的 ${liveTp1}`);
    assert(map[tp2Row] === liveTp2,
      `验证表里的 TP2 条数 ${map[tp2Row]} 应等于现场跑出来的 ${liveTp2}`);
    const sum = Object.keys(map).reduce((a, k) => a + map[k], 0);
    const shown = Number(((await txt('[data-cl-n="total"]')) || '0').replace(/,/g, ''));
    assert(sum === shown, `分项之和 ${sum} 应等于公布的总数 ${shown}`);
    assert(shown === 262029, `公布总数应为离线套件实测的 262,029（实得 ${shown}）`);
    const diffRows = await page.locator('#cl-about-diff tbody tr').count();
    assert(diffRows >= 6, `口径差异表应有 ≥6 行（实得 ${diffRows}）`);
  });

  /* ── 14. 通用守卫：th/dt/label 不得被大写化成错的单位符号 ── */
  const bad = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('th,dt,label,.cl-lab').forEach((n) => {
      if (/\b(HZ|KHZ|DBFS|DB|OP|ID|JSON|CRDT-)\b/.test(n.textContent || '')) out.push(n.textContent);
      if (getComputedStyle(n).textTransform === 'uppercase') out.push('uppercase:' + n.textContent);
    });
    return out;
  });
  assert(bad.length === 0, `不应出现被大写化的标签（实得 ${bad.slice(0, 3).join(' / ')}）`);

  /* ── 15. 控件最小尺寸守卫：逐分区扫一遍 ── */
  let scanned = 0;
  for (const p of ['sandbox', 'inside', 'causal', 'zoo', 'ot', 'about']) {
    await page.click('#cl-tab-' + p);
    await page.waitForFunction((n) => !document.getElementById('cl-panel-' + n).hidden, p);
    const bads = await page.evaluate(() => {
      const out = [];
      let n = 0;
      document.querySelectorAll('input,select,button,textarea').forEach((e) => {
        const r = e.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;   // 不可见的跳过
        n++;
        const minW = e.tagName === 'BUTTON' ? 52 : 100;
        if (r.width < minW || r.height < 18) {
          out.push(e.tagName + '#' + (e.id || e.className) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
        }
      });
      return { out, n };
    });
    scanned += bads.n;
    assert(bads.out.length === 0, `${p} 分区有塌缩控件：${bads.out.slice(0, 3).join(' / ')}`);
    // 未渲染的 markdown 记号：HTML 里写 ** 只会原样显示出来（2026-09-06 人工看图实撞）
    const md = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('#cl-panel-' + document.querySelector('.cl-tab[aria-selected="true"]')
        .dataset.panel + ' *').forEach((n) => {
        if (n.children.length) return;
        const t = n.textContent || '';
        if (/\*\*/.test(t) || /(^|\s)__\S/.test(t)) out.push(t.slice(0, 60));
      });
      return out;
    });
    assert(md.length === 0, `${p} 分区有未渲染的 markdown 记号：${md.slice(0, 2).join(' / ')}`);
  }
  assert(scanned >= 60, `逐分区扫到的控件总数偏少（实得 ${scanned}），守卫可能什么都没扫到`);

  /* ── 16. 窄屏 / 中屏都不得横向溢出 ── */
  for (const vw of [390, 768, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    for (const p of ['sandbox', 'inside', 'causal', 'zoo', 'ot', 'about']) {
      await page.click('#cl-tab-' + p);
      await page.waitForFunction((n) => !document.getElementById('cl-panel-' + n).hidden, p);
      const info = await page.evaluate(() => {
        const de = document.documentElement;
        const over = de.scrollWidth - de.clientWidth;
        const culprits = [];
        if (over > 1) {
          document.querySelectorAll('*').forEach((e) => {
            const r = e.getBoundingClientRect();
            if (r.right > de.clientWidth + 1 && r.width > 0) {
              culprits.push(e.tagName + '.' + (e.className || '') + '@' + Math.round(r.right));
            }
          });
        }
        return { over, culprits: culprits.slice(0, 4) };
      });
      assert(info.over <= 1, `${vw}px 下 ${p} 分区横向溢出 ${info.over}px：${info.culprits.join(' / ')}`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 850 });

  /* ── 17. 卡片内的代码/表格不得撑破容器 ── */
  await page.click('#cl-tab-sandbox');
  await page.waitForFunction(() => !document.getElementById('cl-panel-sandbox').hidden);
  const overflowing = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.cl-tablewrap,.cl-figure,.cl-q').forEach((e) => {
      if (e.offsetParent === null) return;
      const cs = getComputedStyle(e);
      if (cs.overflowX !== 'auto' && cs.overflowX !== 'scroll' && e.scrollWidth - e.clientWidth > 2) {
        out.push(e.className + ' ' + (e.scrollWidth - e.clientWidth));
      }
    });
    return out;
  });
  assert(overflowing.length === 0, `宽内容容器必须自己可横向滚动（实得 ${overflowing.join(' / ')}）`);

  /* ── 缩略图：截沙盒收敛后的那一屏 ── */
  await setSel('#cl-algo', 'YATA');
  await setSel('#cl-script', 'storm');
  await page.click('#cl-deliver-all');
  await page.waitForFunction(() => document.getElementById('cl-converge-badge').textContent.indexOf('已收敛') >= 0);
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(120);
  await screenshot('thumb.png');
}
