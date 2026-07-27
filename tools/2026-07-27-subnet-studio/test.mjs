// Integration test for 网络工作台 · Subnet Studio (Warp design language).
// Drives the real BigInt address engine through the browser: asserts textbook ipcalc
// output (network / broadcast / usable range / wildcard), RFC 5952 canonical IPv6,
// RFC 1918 / 6598 / 3849 classification, equal split boundaries, a textbook VLSM
// allocation with its exact free-block remainder, lossless route aggregation, and the
// localStorage round-trip — plus the standing structural guards: [hidden] computed
// display (2026-07-20), boundingRect containment + control-width floors (07-17 / 07-24),
// grid min-width overflow at 390px (07-23), and zero waitForTimeout (07-06).
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#ss-facts .ss-fact');
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.body.dataset.ok === '1');

  const fact = (k) => page.evaluate((key) => {
    const el = document.querySelector('#ss-facts .ss-fact[data-f="' + key + '"] dd');
    return el ? el.dataset.v : 'MISSING';
  }, k);
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
  // body[data-src] is stamped at the end of every successful render, so this waits for
  // the DOM to actually reflect THIS input rather than sleeping (lesson 2026-07-06).
  async function setInput(v) {
    await page.fill('#ss-input', v);
    await page.waitForFunction((val) => document.body.dataset.src === val && document.body.dataset.ok === '1', v);
  }

  // ═══ 1) the shipped engine agrees with the offline-verified ground truth ═══
  const eng = await page.evaluate(() => {
    const E = window.__ss;
    const cidr = (s) => { const r = E.parseCidr(s); return E.cidrInfo(r.fam, r.network, r.prefix); };
    const p = E.parseCidr('192.168.10.0/24');
    const plan = E.vlsmPlan(p.network, 24, [
      { name: 'A', hosts: 60 }, { name: 'B', hosts: 28 }, { name: 'C', hosts: 12 }, { name: 'D', hosts: 2 }
    ], false);
    const list = E.parseList('10.0.0.0/24 10.0.1.0/24 10.0.2.0/24 10.0.3.0/24');
    const ag = E.aggregate(list.items);
    return {
      c26: cidr('192.168.1.130/26').cidr,
      bcast: E.fmtIPv4(cidr('192.168.1.130/26').last),
      usable26: cidr('192.168.1.130/26').usable.toString(),
      wildcard: E.fmtIPv4(cidr('192.168.1.130/26').wildcard),
      p31: cidr('10.1.1.4/31').usable.toString(),
      v6: E.fmtIPv6(E.parseIPv6('2001:0db8:0000:0000:0000:ff00:0042:8329')),
      v6tie: E.fmtIPv6(E.parseIPv6('2001:db8:0:0:1:0:0:1')),
      arpa: E.arpaOf(4, E.parseIPv4('192.168.1.130')),
      cgnat: E.scopeOf(4, E.parseIPv4('100.64.0.1')).rfc,
      out172: E.scopeOf(4, E.parseIPv4('172.32.0.1')).kind,
      plan: plan.allocations.map((a) => a.name + '=' + a.cidr).join(' '),
      free: plan.free.map((f) => f.cidr).join(' '),
      util: plan.utilization,
      agg: ag.blocks.map((b) => E.fmtIPv4(b.net) + '/' + b.prefix).join(' '),
      lossless: E.unionSize(list.items) === E.unionSize(ag.blocks),
      sizing: [1, 2, 60, 62, 63, 254].map((h) => E.prefixForHosts(h, false)).join(',')
    };
  });
  assert(eng.c26 === '192.168.1.128/26', `engine: 192.168.1.130/26 → 192.168.1.128/26 (got ${eng.c26})`);
  assert(eng.bcast === '192.168.1.191', `engine: broadcast 192.168.1.191 (got ${eng.bcast})`);
  assert(eng.usable26 === '62', `engine: /26 has 62 usable (got ${eng.usable26})`);
  assert(eng.wildcard === '0.0.0.63', `engine: /26 wildcard 0.0.0.63 (got ${eng.wildcard})`);
  assert(eng.p31 === '2', `engine: /31 has 2 usable per RFC 3021 (got ${eng.p31})`);
  assert(eng.v6 === '2001:db8::ff00:42:8329', `engine: RFC 5952 canonical form (got ${eng.v6})`);
  assert(eng.v6tie === '2001:db8::1:0:0:1', `engine: RFC 5952 leftmost-longest tie-break (got ${eng.v6tie})`);
  assert(eng.arpa === '130.1.168.192.in-addr.arpa', `engine: reverse DNS (got ${eng.arpa})`);
  assert(eng.cgnat === 'RFC 6598', `engine: 100.64/10 is CGNAT (got ${eng.cgnat})`);
  assert(eng.out172 === 'public', `engine: 172.32.0.1 is outside 172.16/12 (got ${eng.out172})`);
  assert(eng.plan === 'A=192.168.10.0/26 B=192.168.10.64/27 C=192.168.10.96/28 D=192.168.10.112/30',
    `engine: textbook VLSM layout (got ${eng.plan})`);
  assert(eng.free === '192.168.10.116/30 192.168.10.120/29 192.168.10.128/25',
    `engine: exact free remainder (got ${eng.free})`);
  assert(Math.abs(eng.util - 45.31) < 0.02, `engine: utilization ≈ 45.31% (got ${eng.util})`);
  assert(eng.agg === '10.0.0.0/22', `engine: four /24 aggregate to one /22 (got ${eng.agg})`);
  assert(eng.lossless, 'engine: aggregation preserves the covered address set');
  assert(eng.sizing === '30,30,26,26,25,24', `engine: hosts→prefix sizing ladder (got ${eng.sizing})`);

  // ═══ 2) overview DOM reflects the engine — 192.168.1.130/26 ═══
  await setInput('192.168.1.130/26');
  assert((await fact('network')) === '192.168.1.128', 'DOM network = 192.168.1.128');
  assert((await fact('last')) === '192.168.1.191', 'DOM broadcast = 192.168.1.191');
  assert((await fact('first-host')) === '192.168.1.129', 'DOM first host = .129');
  assert((await fact('last-host')) === '192.168.1.190', 'DOM last host = .190');
  assert((await fact('usable')) === '62', 'DOM usable hosts = 62');
  assert((await fact('mask')) === '255.255.255.192', 'DOM netmask = 255.255.255.192');
  assert((await fact('int')) === '3,232,235,906', 'DOM decimal integer = 3,232,235,906');
  assert((await fact('class')) === 'C 类', 'DOM legacy class = C');
  assert((await fact('arpa')) === '130.1.168.192.in-addr.arpa', 'DOM reverse DNS name');
  const term = await txt('#ss-term-body');
  assert(term.includes('255.255.255.192') && term.includes('0.0.0.63'), 'terminal block prints netmask + wildcard');
  assert(term.includes('192.168.1.129 → 192.168.1.190'), 'terminal block prints the host range');
  assert(term.includes('带有主机位'), 'terminal block flags that .130 carries host bits');
  assert((await txt('#ss-badges .ss-badge')).includes('私有'), 'scope badge says private (RFC 1918)');

  // bit ruler really shows 26 highlighted bits and the exact bit string
  const ruler = await page.evaluate(() => {
    const cells = Array.from(document.querySelectorAll('#ss-ruler .ss-bit'));
    return {
      n: cells.length,
      on: cells.filter((c) => c.classList.contains('on')).length,
      edge: cells.filter((c) => c.classList.contains('edge')).length,
      bits: cells.map((c) => c.textContent).join(''),
      groups: document.querySelectorAll('#ss-ruler .ss-oct').length
    };
  });
  assert(ruler.n === 32 && ruler.groups === 4, `ruler renders 32 bits in 4 octets (got ${ruler.n}/${ruler.groups})`);
  assert(ruler.on === 26, `ruler highlights 26 network bits (got ${ruler.on})`);
  assert(ruler.edge === 1, `ruler marks exactly one prefix boundary (got ${ruler.edge})`);
  assert(ruler.bits === '11000000101010000000000110000010', `ruler bit string = 192.168.1.130 (got ${ruler.bits})`);
  assert((await txt('#ss-netbits')) === '26 bit', 'legend shows 26 network bits');

  // ═══ 3) alternate syntaxes + edge prefixes ═══
  await setInput('10.0.0.0 255.0.0.0');
  assert((await fact('network')) === '10.0.0.0', 'dotted netmask input → 10.0.0.0');
  assert((await fact('last')) === '10.255.255.255', 'dotted netmask input → broadcast');
  assert((await fact('usable')) === '16,777,214', '10/8 has 16,777,214 usable hosts');

  await setInput('10.1.1.4/31');
  assert((await fact('usable')) === '2', '/31 exposes 2 usable addresses (RFC 3021)');
  assert((await fact('first-host')) === '10.1.1.4', '/31 first host IS the network address');
  assert((await txt('#ss-badges')).includes('点对点'), '/31 shows the point-to-point badge');

  await setInput('100.64.0.1/10');
  assert((await txt('#ss-badges .ss-badge')).includes('RFC 6598'), '100.64/10 classified as carrier-grade NAT');

  // ═══ 4) IPv6 ═══
  await setInput('2001:db8:abcd:1234::5/48');
  assert((await fact('network')) === '2001:db8:abcd::', 'IPv6 /48 network in RFC 5952 form');
  assert((await fact('last')) === '2001:db8:abcd:ffff:ffff:ffff:ffff:ffff', 'IPv6 /48 last address');
  assert((await fact('expanded')) === '2001:0db8:abcd:1234:0000:0000:0000:0005', 'IPv6 expanded form');
  assert((await fact('usable')).includes('2^80'), 'IPv6 /48 spans 2^80 addresses');
  assert((await txt('#ss-badges .ss-badge')).includes('文档'), '2001:db8::/32 flagged as documentation space');
  const v6ruler = await page.evaluate(() => {
    const cells = Array.from(document.querySelectorAll('#ss-ruler .ss-bit'));
    return { n: cells.length, on: cells.filter((c) => c.classList.contains('on')).length, s: cells.map((c) => c.textContent).join('') };
  });
  assert(v6ruler.n === 32 && v6ruler.on === 12, `IPv6 ruler: 32 nibbles, 12 in the /48 prefix (got ${v6ruler.on})`);
  assert(v6ruler.s === '20010db8abcd12340000000000000005', `IPv6 ruler nibbles (got ${v6ruler.s})`);

  // ═══ 5) invalid input surfaces an error and never crashes ═══
  assert((await disp('#ss-error')) === 'none', 'error banner is hidden while input is valid');
  await page.fill('#ss-input', '999.1.1.1/24');
  await page.waitForFunction(() => document.body.dataset.ok === '0');
  assert((await disp('#ss-error')) !== 'none', 'error banner becomes visible on bad input');
  assert((await txt('#ss-error')).includes('不是合法的 IP 地址'), 'error text names the problem');
  await page.fill('#ss-input', '192.168.1.1/255.0.255.0');
  await page.waitForFunction(() => document.getElementById('ss-error').textContent.includes('连续掩码'));
  assert((await txt('#ss-error')).includes('连续掩码'), 'non-contiguous mask is rejected with a clear message');
  assert((await fact('network')) === '2001:db8:abcd::', 'last good result stays on screen while input is broken');

  // ═══ 6) split tab ═══
  await setInput('192.168.1.0/24');
  await page.click('#ss-tab-split');
  await page.waitForFunction(() => document.body.dataset.tab === 'split');
  assert((await disp('#ss-panel-overview')) === 'none', '[hidden] overview panel computes to display:none');
  assert((await disp('#ss-panel-split')) !== 'none', 'split panel is visible');
  await page.selectOption('#ss-split-prefix', '26');
  await page.waitForFunction(() => document.querySelectorAll('#ss-split-body tr').length === 4);
  const split = await page.evaluate(() => Array.from(document.querySelectorAll('#ss-split-body tr'))
    .map((tr) => Array.from(tr.children).map((td) => td.textContent.trim())));
  assert(split.length === 4, `/24 → four /26 rows (got ${split.length})`);
  assert(split.map((r) => r[1]).join(' ') === '192.168.1.0/26 192.168.1.64/26 192.168.1.128/26 192.168.1.192/26',
    `split boundaries (got ${split.map((r) => r[1]).join(' ')})`);
  assert(split[2][2] === '192.168.1.129' && split[2][4] === '192.168.1.191', '3rd /26 host range + broadcast');
  assert(split.every((r) => r[5] === '62'), 'each /26 reports 62 usable');
  // /31 · /32 only appear once RFC 3021 is opted into
  const before31 = await page.evaluate(() => Array.from(document.querySelectorAll('#ss-split-prefix option')).map((o) => o.value));
  assert(!before31.includes('31') && !before31.includes('32'), 'by default the split stops at /30');
  await page.check('#ss-split-p2p');
  await page.waitForFunction(() => Array.from(document.querySelectorAll('#ss-split-prefix option')).some((o) => o.value === '31'));
  await page.selectOption('#ss-split-prefix', '30');
  await page.waitForFunction(() => document.getElementById('ss-split-summary').dataset.count === '64');
  assert((await page.evaluate(() => document.querySelectorAll('#ss-split-body tr').length)) === 64, '/24 → 64 /30 rows');
  await page.uncheck('#ss-split-p2p');

  // ═══ 7) VLSM planner ═══
  await page.click('#ss-tab-plan');
  await page.waitForFunction(() => document.body.dataset.tab === 'plan');
  await page.fill('#ss-plan-parent', '192.168.10.0/24');
  await page.click('#ss-plan-run');
  await page.waitForFunction(() => document.querySelectorAll('#ss-plan-body tr').length === 7);
  const plan = await page.evaluate(() => Array.from(document.querySelectorAll('#ss-plan-body tr'))
    .map((tr) => ({ free: tr.classList.contains('free'), cells: Array.from(tr.children).map((td) => td.textContent.trim()) })));
  const alloc = plan.filter((r) => !r.free), freeRows = plan.filter((r) => r.free);
  assert(alloc.length === 4, `4 segments allocated (got ${alloc.length})`);
  assert(alloc.map((r) => r.cells[0] + '=' + r.cells[1]).join(' ')
    === '办公区=192.168.10.0/26 研发=192.168.10.64/27 服务器=192.168.10.96/28 互联链路=192.168.10.112/30',
    `VLSM allocation table (got ${alloc.map((r) => r.cells[0] + '=' + r.cells[1]).join(' ')})`);
  assert(alloc[0].cells[2] === '255.255.255.192', 'first segment mask = 255.255.255.192');
  assert(alloc[0].cells[3] === '192.168.10.1 – 192.168.10.62', 'first segment usable range');
  assert(alloc[1].cells[5] === '30' && alloc[2].cells[5] === '14', '/27 → 30 usable, /28 → 14 usable');
  assert(freeRows.map((r) => r.cells[1]).join(' ') === '192.168.10.116/30 192.168.10.120/29 192.168.10.128/25',
    `free remainder rows (got ${freeRows.map((r) => r.cells[1]).join(' ')})`);
  assert((await txt('#ss-stat-used')) === '116', 'allocated 116 addresses');
  assert((await txt('#ss-stat-util')) === '45.3%', 'utilization 45.3%');
  assert((await txt('#ss-plan-parentlabel')) === '192.168.10.0/24', 'parent label echoes the plan');
  const segs = await page.evaluate(() => Array.from(document.querySelectorAll('#ss-plan-bar .ss-seg'))
    .map((s) => ({ free: s.classList.contains('free'), w: s.getBoundingClientRect().width })));
  assert(segs.length === 7, `address bar draws 7 segments (got ${segs.length})`);
  const barTotal = segs.reduce((a, s) => a + s.w, 0);
  const barW = (await rect('#ss-plan-bar')).w;
  assert(Math.abs(barTotal - (barW - 2)) < 8, `bar segments tile its full width (${barTotal} vs ${barW})`);
  assert(segs[0].w / barTotal > 0.24 && segs[0].w / barTotal < 0.26, 'the /26 segment occupies ~25% of the parent');

  // over-subscription is reported, not silently swallowed
  await page.fill('#ss-plan-parent', '192.168.10.0/27');
  await page.waitForFunction(() => !document.getElementById('ss-plan-note').hidden);
  assert((await txt('#ss-plan-note')).includes('放不下'), 'oversized requirements are reported');
  assert((await disp('#ss-plan-note')) !== 'none', 'the warning is actually visible');
  await page.fill('#ss-plan-parent', '192.168.10.0/24');
  await page.waitForFunction(() => document.getElementById('ss-plan-note').hidden);
  assert((await disp('#ss-plan-note')) === 'none', 'warning hides again — [hidden] computes to display:none');

  // containment probe
  await page.fill('#ss-plan-probe', '192.168.10.70');
  await page.click('#ss-plan-probe-run');
  await page.waitForFunction(() => document.getElementById('ss-plan-probe-out').dataset.hit === '研发');
  assert((await txt('#ss-plan-probe-out')).includes('192.168.10.64/27'), 'probe locates .70 inside the 研发 /27');
  await page.fill('#ss-plan-probe', '192.168.10.200');
  await page.click('#ss-plan-probe-run');
  await page.waitForFunction(() => document.getElementById('ss-plan-probe-out').dataset.hit === 'free');
  assert((await txt('#ss-plan-probe-out')).includes('192.168.10.128/25'), 'probe reports the free block for .200');
  await page.fill('#ss-plan-probe', '10.9.9.9');
  await page.click('#ss-plan-probe-run');
  await page.waitForFunction(() => document.getElementById('ss-plan-probe-out').textContent.includes('不在父网段'));

  // add a segment → the plan re-solves
  await page.click('#ss-plan-add');
  await page.waitForFunction(() => document.querySelectorAll('#ss-plan-reqs .ss-req').length === 5);
  await page.waitForFunction(() => Array.from(document.querySelectorAll('#ss-plan-body tr'))
    .filter((tr) => !tr.classList.contains('free')).length === 5);
  const withNew = await page.evaluate(() => Array.from(document.querySelectorAll('#ss-plan-body tr'))
    .filter((tr) => !tr.classList.contains('free')).map((tr) => tr.children[1].textContent.trim()));
  // the 10-host segment needs a /28; the only aligned /28 left is .112, which displaces
  // the point-to-point /30 down to .128 — every block stays on its own boundary.
  assert(withNew.join(' ') === '192.168.10.0/26 192.168.10.64/27 192.168.10.96/28 192.168.10.112/28 192.168.10.128/30',
    `re-solved layout after adding a segment (got ${withNew.join(' ')})`);
  const aligned = await page.evaluate(() => Array.from(document.querySelectorAll('#ss-plan-body tr'))
    .map((tr) => tr.children[1].textContent.trim())
    .every((c) => {
      const [ip, p] = c.split('/');
      const v = ip.split('.').reduce((a, o) => a * 256 + Number(o), 0);
      return (v % Math.pow(2, 32 - Number(p))) === 0;
    }));
  assert(aligned, 'every allocated and free block sits on its own prefix boundary');

  // ═══ 8) localStorage round-trip ═══
  await page.click('#ss-plan-save');
  await page.waitForSelector('#ss-plan-saved .ss-plan-chip');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('subnet-studio:plans')));
  assert(Array.isArray(saved) && saved.length === 1 && saved[0].reqs.length === 5, 'plan persisted to localStorage');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.body.dataset.ok === '1');
  assert((await page.inputValue('#ss-input')) === '192.168.1.0/24', 'last inspected CIDR is restored after reload');
  await page.click('#ss-tab-plan');
  await page.waitForSelector('#ss-plan-saved .ss-plan-chip');
  await page.click('#ss-plan-saved [data-load="0"]');
  await page.waitForFunction(() => document.querySelectorAll('#ss-plan-reqs .ss-req').length === 5);
  assert((await page.inputValue('#ss-plan-parent')) === '192.168.10.0/24', 'saved plan restores its parent network');

  // ═══ 9) aggregation ═══
  await page.click('#ss-tab-agg');
  await page.waitForFunction(() => document.body.dataset.tab === 'agg');
  await page.fill('#ss-agg-in', '10.0.0.0/24\n10.0.1.0/24\n10.0.2.0/24\n10.0.3.0/24\n192.168.4.0/24\n192.168.5.0/24\n192.168.5.128/25\n172.16.0.0/16');
  await page.click('#ss-agg-run');
  await page.waitForFunction(() => document.body.dataset.aggout === '10.0.0.0/22 172.16.0.0/16 192.168.4.0/23');
  assert((await txt('#ss-agg-in-n')) === '8' && (await txt('#ss-agg-out-n')) === '3', '8 routes collapse to 3');
  assert((await txt('#ss-agg-out')).includes('10.0.0.0/22'), 'terminal output prints the supernet');
  assert((await txt('#ss-agg-report')).includes('聚合无损'), 'report certifies the address set is unchanged');
  assert(await page.evaluate(() => document.body.dataset.aggok === '1'), 'union size before == after');
  // a non-buddy pair must NOT be over-aggregated
  await page.fill('#ss-agg-in', '192.168.1.0/24 192.168.2.0/24');
  await page.click('#ss-agg-run');
  await page.waitForFunction(() => document.body.dataset.aggout === '192.168.1.0/24 192.168.2.0/24');
  assert((await txt('#ss-agg-out-n')) === '2', 'non-buddy /24 pair is left alone (merging would over-cover)');
  // bad tokens are reported rather than silently dropped
  await page.fill('#ss-agg-in', '10.0.0.0/24 nonsense 10.0.1.0/24');
  await page.click('#ss-agg-run');
  await page.waitForFunction(() => document.body.dataset.aggout === '10.0.0.0/23');
  assert((await txt('#ss-agg-report')).includes('无法解析'), 'unparseable tokens are surfaced');

  // ═══ 10) structural guards ═══
  await page.click('#ss-tab-overview');
  await page.waitForFunction(() => document.body.dataset.tab === 'overview');
  for (const t of ['split', 'plan', 'agg']) {
    assert((await disp('#ss-panel-' + t)) === 'none', `#ss-panel-${t} computes to display:none when not selected`);
  }
  assert(await inside('.ss-back', '.ss-nav'), 'back link stays inside the nav bar');
  assert(await inside('#ss-ruler', '#ss-panel-overview'), 'bit ruler stays inside its panel');
  assert(await inside('#ss-term-body', '#ss-term'), 'terminal body stays inside its frame');
  const backR = await rect('.ss-back');
  assert(backR.w >= 90 && backR.h >= 24, `back link renders at a real size (${backR.w}×${backR.h})`);
  const inputR = await rect('#ss-input');
  assert(inputR.w >= 300 && inputR.h >= 30, `main input is not squeezed (${inputR.w}×${inputR.h})`);
  const runR = await rect('#ss-run');
  assert(runR.w >= 50 && runR.h >= 30, `submit button keeps its size (${runR.w}×${runR.h})`);
  const bitR = await rect('#ss-ruler .ss-bit');
  assert(bitR.w >= 12 && bitR.h >= 18, `ruler cells are not collapsed (${bitR.w}×${bitR.h})`);
  const factR = await rect('#ss-facts .ss-fact');
  assert(factR.w >= 150 && factR.h >= 40, `fact tiles render at a usable size (${factR.w}×${factR.h})`);
  const noOverlap = await page.evaluate(() => {
    const cells = Array.from(document.querySelectorAll('#ss-ruler .ss-oct'));
    return cells.every((c) => c.getBoundingClientRect().width > 100);
  });
  assert(noOverlap, 'each octet group keeps its width');

  // no horizontal overflow at desktop, tablet and phone widths (lesson 2026-07-23)
  for (const w of [1280, 768, 390]) {
    await page.setViewportSize({ width: w, height: 850 });
    await page.waitForFunction((vw) => document.documentElement.clientWidth === vw
      || Math.abs(document.documentElement.clientWidth - vw) <= 16, w);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert(over <= 1, `no horizontal overflow at ${w}px (overflow ${over}px)`);
    const r = await rect('#ss-ruler');
    const p = await rect('#ss-panel-overview');
    assert(r.r <= p.r + 1, `bit ruler stays inside the viewport at ${w}px (${r.r} vs ${p.r})`);
  }
  await page.setViewportSize({ width: 1280, height: 850 });

  // keyboard: arrow keys move between tabs
  await page.focus('#ss-tab-overview');
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => document.body.dataset.tab === 'split');
  await page.keyboard.press('ArrowLeft');
  await page.waitForFunction(() => document.body.dataset.tab === 'overview');

  // ═══ 11) thumbnail ═══
  await setInput('192.168.1.130/26');
  await page.waitForFunction(() => document.querySelectorAll('#ss-ruler .ss-bit.on').length === 26);
  await page.evaluate(() => window.scrollTo(0, 278));
  await page.waitForFunction(() => Math.abs(window.scrollY - 278) < 2);
  await screenshot('thumb.png');
}
