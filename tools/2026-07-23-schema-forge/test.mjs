// Integration test for 类型工坊 · Schema Forge (MongoDB design language).
// Drives the real inference engine through the browser: asserts concrete generated output for
// six targets (TypeScript / JSON Schema / Zod / Go / Python / Rust), optional & enum & format
// detection against known sample data, structural dedupe, every inference option, invalid-input
// handling, the [hidden] computed-display guard, localStorage round-trip and layout containment.
// Captures thumb.png.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#sf-code');
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });

  const stats = () => page.evaluate(() => ({ ...document.getElementById('sf-stats').dataset }));
  const status = () => page.evaluate(() => ({ ...document.getElementById('sf-status').dataset }));
  const code = () => page.evaluate(() => document.getElementById('sf-code').textContent);
  const text = async (sel) => (await page.textContent(sel)).trim();
  const disp = (sel) => page.evaluate((s) => {
    const el = document.querySelector(s);
    return el ? getComputedStyle(el).display : 'MISSING';
  }, sel);
  const waitCode = (sub) => page.waitForFunction(
    (s) => document.getElementById('sf-code').textContent.includes(s), sub, { timeout: 8000 });
  const waitStat = (k, v) => page.waitForFunction(
    (a) => document.getElementById('sf-stats').dataset[a[0]] === a[1], [k, v], { timeout: 8000 });
  const rows = () => page.$$eval('#sf-tree .sf-row', (els) => els.map((el) => ({
    key: el.querySelector('.sf-key').textContent,
    keyW: Math.round(el.querySelector('.sf-key').getBoundingClientRect().width),
    type: el.querySelector('.sf-ty').textContent,
    tags: Array.from(el.querySelectorAll('.sf-tag')).map((t) => t.textContent),
    enumTitle: el.querySelector('.sf-tag.sf-enum') ? el.querySelector('.sf-tag.sf-enum').title : '',
    count: el.querySelector('.sf-count') ? el.querySelector('.sf-count').textContent : '',
    bar: el.querySelector('.sf-presence i') ? el.querySelector('.sf-presence i').style.width : '',
    path: el.dataset.path
  })));
  const rowFor = async (key) => (await rows()).find((r) => r.key === key);
  const tab = async (lang) => {
    await page.click(`#sf-tabs .sf-tab[data-lang="${lang}"]`);
    await page.waitForFunction((l) => document.getElementById('sf-code').dataset.lang === l, lang);
    return code();
  };

  // ---------------- 1) 默认载入订单示例：统计量是真实推断结果 ----------------
  await page.waitForFunction(() => Number(document.getElementById('sf-status').dataset.rev) > 0);
  let st = await stats();
  let sr = await status();
  assert(sr.ok === '1' && sr.mode === 'json', `默认样本解析成功 (ok=${sr.ok} mode=${sr.mode})`);
  assert(st.samples === '1', `顶层数组算 1 个样本 (got ${st.samples})`);
  assert(st.types === '3', `订单示例推出 3 个类型 Root/Buyer/Item (got ${st.types})`);
  assert(st.fields === '16', `三个类型共 16 个字段 (got ${st.fields})`);
  assert(st.depth === '2', `嵌套深度 2 (got ${st.depth})`);
  assert(st.shared === '1', `buyer/shipTo 结构相同 → 1 处复用 (got ${st.shared})`);
  assert(await text('#sf-st-root') === 'Root[]', '根类型显示为 Root[]');
  assert(await text('#sf-st-types') === '3' && await text('#sf-st-fields') === '16',
    '角标数字与 dataset 一致');

  let ts = await code();
  for (const frag of ['export interface Root {', "status: 'paid' | 'shipped' | 'refunded';",
    'buyer: Buyer;', 'shipTo: Buyer;', 'items: Item[];', 'coupon?: string;',
    'export interface Buyer {', 'export interface Item {', 'export type RootList = Root[];']) {
    assert(ts.includes(frag), `TypeScript 输出包含 ${frag}`);
  }
  assert(!ts.includes('export interface ShipTo'), 'shipTo 复用 Buyer,不再单独生成类型');

  // 行数/字符数读数必须与代码本身一致（不是写死的装饰）
  const meta = await text('#sf-outmeta');
  const expectMeta = ts.replace(/\n$/, '').split('\n').length + ' 行 · ' + ts.length + ' 字符';
  assert(meta === expectMeta, `输出读数 = 真实行数/字符数 (got "${meta}", want "${expectMeta}")`);

  // ---------------- 2) 结构树：格式 / 枚举 / 可选 / 存在率 / 复用 都是真值 ----------------
  const orderId = await rowFor('orderId');
  assert(orderId && orderId.tags.includes('uuid'), `orderId 打上 uuid 格式标 (got ${JSON.stringify(orderId)})`);
  const placedAt = await rowFor('placedAt');
  assert(placedAt.tags.includes('date-time'), 'placedAt 打上 date-time 格式标');
  const statusRow = await rowFor('status');
  assert(statusRow.type === 'enum(3)', `status 识别为 3 值枚举 (got ${statusRow.type})`);
  assert(statusRow.enumTitle === 'paid · shipped · refunded',
    `枚举徽标完整列出三个取值 (got "${statusRow.enumTitle}")`);
  const coupon = await rowFor('coupon');
  assert(coupon.tags.includes('可选'), 'coupon 标为可选');
  assert(coupon.count === '2/5', `coupon 存在率 2/5 (got ${coupon.count})`);
  assert(coupon.bar === '40%', `存在率条宽度 = 2/5 = 40% (got ${coupon.bar})`);
  assert((await rowFor('orderId')).bar === '', '每个样本都有的字段不画存在率条(满格条没信息量)');
  const shipTo = await rowFor('shipTo');
  assert(shipTo.type === 'Buyer' && shipTo.tags.includes('复用'), `shipTo 复用 Buyer (got ${shipTo.type})`);
  const items = await rowFor('items');
  assert(items.type === 'Item[]' && items.count === '5/5', `items 是 Item[] 且 5/5 (got ${items.type} ${items.count})`);
  // 布局回归守卫：徽标不得把字段名压成 0 宽（首版真的发生过，纯 DOM 断言看不出来）
  const squeezed = (await rows()).filter((r) => r.keyW < 40 || !r.key.trim());
  assert(squeezed.length === 0, `每行字段名都要有可读宽度 — 违规行 ${JSON.stringify(squeezed.slice(0, 3))}`);
  // 六个语言 tab 必须排在同一行（换行会把代码区顶下去）
  const tabTops = await page.$$eval('#sf-tabs .sf-tab', (els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
  assert(new Set(tabTops).size === 1, `六个 tab 在同一行 (tops=${tabTops.join(',')})`);

  // ---------------- 3) 六种输出各自成立 ----------------
  const schema = JSON.parse(await tab('jsonschema'));
  assert(schema.$schema === 'https://json-schema.org/draft/2020-12/schema', 'JSON Schema 声明 2020-12');
  assert(schema.type === 'array' && schema.items.$ref === '#/$defs/Root', '根是 array 且 items 指向 $defs/Root');
  assert(schema.$defs.Root.required.includes('orderId') && !schema.$defs.Root.required.includes('coupon'),
    'required 含 orderId、不含只出现 2 次的 coupon');
  assert(schema.$defs.Root.properties.placedAt.format === 'date-time', 'placedAt 带 date-time format');
  assert(schema.$defs.Root.properties.buyer.$ref === '#/$defs/Buyer', 'buyer 指向 Buyer 定义');
  assert(schema.$defs.Root.properties.shipTo.$ref === '#/$defs/Buyer', 'shipTo 也指向 Buyer(结构复用)');
  assert(JSON.stringify(schema.$defs.Root.properties.status.enum) === '["paid","shipped","refunded"]',
    'status 的 enum 取值正确');

  const zod = await tab('zod');
  assert(zod.includes("z.enum(['paid', 'shipped', 'refunded'])"), 'Zod 生成 z.enum');
  assert(zod.includes('z.string().uuid()') && zod.includes('z.string().datetime()'), 'Zod 把格式翻成校验器');
  assert(zod.indexOf('export const Buyer = z.object({') < zod.indexOf('export const Root = z.object({'),
    'Zod 里被引用的 Buyer 必须先于 Root 定义(否则运行时 ReferenceError)');
  assert(zod.includes('coupon: z.string().optional(),'), 'Zod 里 coupon 是 .optional()');

  const go = await tab('go');
  assert(/OrderID\s+string\s+`json:"orderId"`/.test(go), `Go: orderId → OrderID string + tag\n${go.slice(0, 400)}`);
  assert(/Coupon\s+\*string\s+`json:"coupon,omitempty"`/.test(go), 'Go: 可选字段 → 指针 + omitempty');
  assert(/Total\s+float64/.test(go), 'Go: total 混了 128.5 与 42 → float64');
  assert(go.includes('// paid | shipped | refunded'), 'Go 用注释标出枚举取值');

  const py = await tab('python');
  assert(py.indexOf('class Buyer(BaseModel):') < py.indexOf('class Root(BaseModel):'),
    'Python 里 Buyer 必须先于 Root 定义');
  assert(py.includes("status: Literal['paid', 'shipped', 'refunded']"), 'Python 枚举 → Literal');
  assert(py.includes('ship_to: Buyer = Field(alias="shipTo")'), 'Python: shipTo → ship_to + alias');
  assert(py.includes('coupon: str | None = None'), 'Python 可选字段 → | None = None');

  const rust = await tab('rust');
  assert(rust.includes('#[derive(Debug, Clone, Serialize, Deserialize)]'), 'Rust 带 derive');
  assert(rust.includes('#[serde(rename = "orderId")]') && rust.includes('pub order_id: String,'),
    'Rust: orderId → order_id + rename');
  assert(rust.includes('pub items: Vec<Item>,'), 'Rust: items → Vec<Item>');
  assert(rust.includes('#[serde(default, skip_serializing_if = "Option::is_none")]'), 'Rust 可选字段带 skip');
  assert(await text('#sf-outlang') === 'Rust · serde', '底部语言名跟着 tab 走');

  await tab('ts');

  // ---------------- 4) 自己输入 JSONL → 精确输出 ----------------
  const fixture = [
    '{"userId":1,"name":"a","role":"admin","tags":["x"]}',
    '{"userId":2,"name":"b","role":"user","tags":[],"note":null}',
    '{"userId":3,"name":"c","role":"admin","tags":["y","z"]}'
  ].join('\n');
  await page.fill('#sf-input', fixture);
  await waitCode('userId: number;');
  sr = await status();
  assert(sr.mode === 'jsonl' && sr.samples === '3', `JSONL 三行 → 3 个样本 (mode=${sr.mode} n=${sr.samples})`);
  const expectTS =
    'export interface Root {\n' +
    '  userId: number;\n' +
    '  name: string;\n' +
    "  role: 'admin' | 'user';\n" +
    '  tags: string[];\n' +
    '  note?: null;\n' +
    '}\n';
  const got = await code();
  assert(got.endsWith(expectTS), `TypeScript 输出逐字符匹配\n---got---\n${got}\n---want---\n${expectTS}`);
  const nameRow = await rowFor('note');
  assert(nameRow.count === '1/3' && nameRow.tags.includes('可选'), `note 存在率 1/3 且可选 (got ${nameRow.count})`);

  // ---------------- 5) 每个推断选项都真的改变输出 ----------------
  await page.selectOption('#sf-optional', 'null');
  await waitCode('note: null;');
  assert(!(await code()).includes('note?'), 'optional=null 模式下不再用 ? 标记');
  await page.selectOption('#sf-optional', 'both');
  await waitCode('note?: null;');
  await page.selectOption('#sf-optional', 'question');

  await page.uncheck('#sf-enums');
  await waitCode('role: string;');
  assert(!(await code()).includes("'admin'"), '关掉枚举检测后不再生成字面量联合');
  await page.check('#sf-enums');
  await waitCode("role: 'admin' | 'user';");

  await page.fill('#sf-root-name', 'LogLine');
  await waitCode('export interface LogLine {');
  assert((await code()).includes('export interface LogLine {'), '根类型名可自定义');
  await page.fill('#sf-root-name', 'Root');
  await waitCode('export interface Root {');

  // 结构合并开关：订单示例下 3 个类型 ↔ 4 个类型
  await page.click('#sf-samples .sf-chip[data-sample="orders"]');
  await waitStat('types', '3');
  await page.uncheck('#sf-dedupe');
  await waitStat('types', '4');
  assert((await code()).includes('export interface ShipTo {'), '关掉合并后 shipTo 自成一类');
  await page.check('#sf-dedupe');
  await waitStat('types', '3');

  await page.uncheck('#sf-formats');
  const noFmt = JSON.parse(await tab('jsonschema'));
  assert(noFmt.$defs.Root.properties.placedAt.format === undefined, '关掉格式检测后 JSON Schema 不再有 format');
  await page.check('#sf-formats');
  await page.waitForFunction(() =>
    JSON.parse(document.getElementById('sf-code').textContent).$defs.Root.properties.placedAt.format === 'date-time');

  await page.uncheck('#sf-intfloat');
  const goFloat = await tab('go');
  assert(/Qty\s+float64/.test(goFloat), '关掉整数/小数区分后 qty 也变 float64');
  await page.check('#sf-intfloat');
  await tab('go');
  await page.waitForFunction(() => /Qty\s+int64/.test(document.getElementById('sf-code').textContent));
  await tab('ts');

  // 枚举上限：6 个取值在上限 8 时是枚举,压到 4 就退回 string
  const sixValues = Array.from({ length: 18 }, (_, i) => JSON.stringify({ k: 'v' + (i % 6) })).join('\n');
  await page.fill('#sf-input', sixValues);
  await waitCode("k: 'v0' | 'v1'");
  await page.selectOption('#sf-enum-max', '4');
  await waitCode('k: string;');
  await page.selectOption('#sf-enum-max', '8');
  await waitCode("k: 'v0' | 'v1'");

  await page.click('#sf-samples .sf-chip[data-sample="logs"]');
  await waitCode("level: 'info' | 'warn' | 'error';");
  st = await stats();
  assert(st.samples === '6', `JSONL 日志 6 行 → 6 个样本 (got ${st.samples})`);
  assert((await code()).includes('clientIp?: string;'), '只出现一次的 clientIp 是可选字段');

  // ---------------- 6) 非法输入 + [hidden] 计算样式守卫 ----------------
  await page.fill('#sf-input', '{"a":1,}');
  await page.waitForFunction(() => document.getElementById('sf-status').dataset.ok === '0');
  assert(await disp('#sf-error') !== 'none', '非法 JSON 时错误面板可见');
  const errText = await text('#sf-error');
  assert(/第 1 行/.test(errText), `错误信息给出行号 (got "${errText}")`);
  assert((await code()) === '', '解析失败时不输出任何类型定义');
  assert((await stats()).types === '0', '解析失败时统计清零');

  await page.fill('#sf-input', '{"a":1}\n{"b":');
  await page.waitForFunction(() => /第 2 行/.test(document.getElementById('sf-error').textContent));
  assert(/第 2 行/.test(await text('#sf-error')), '第二行出错时定位到第 2 行');

  await page.fill('#sf-input', '{"a":1}');
  await waitCode('a: number;');
  assert(await disp('#sf-error') === 'none',
    '修好后错误面板必须真的隐藏(计算样式 display:none,防作者 CSS 覆盖 [hidden])');

  await page.fill('#sf-input', '');
  await page.waitForFunction(() => document.getElementById('sf-status-text').textContent.includes('等待输入'));
  assert(await disp('#sf-error') === 'none', '空输入不显示错误面板');
  assert((await rows()).length === 0, '空输入时结构树没有行');

  // ---------------- 7) 格式化按钮 ----------------
  await page.fill('#sf-input', '{"z":[1,2],"a":{"b":true}}');
  await waitCode('z: number[];');
  await page.click('#sf-format');
  await page.waitForFunction(() => document.getElementById('sf-input').value.includes('\n'));
  const formatted = await page.inputValue('#sf-input');
  assert(formatted.startsWith('{\n  "z": [') && formatted.includes('    1,'), `格式化成两空格缩进\n${formatted}`);
  assert((await status()).ok === '1', '格式化后仍然解析成功');

  // ---------------- 8) localStorage 保存 / 载入 / 删除 ----------------
  await page.fill('#sf-save-name', '我的接口');
  await page.click('#sf-save');
  await page.waitForSelector('#sf-saved .sf-savedchip');
  assert(await disp('#sf-saved-empty') === 'none', '有保存项后空态提示隐藏(计算样式)');
  await page.fill('#sf-input', '{"other":1}');
  await waitCode('other: number;');
  await page.click('#sf-saved .sf-savedchip .sf-load');
  await waitCode('z: number[];');
  assert((await page.inputValue('#sf-input')).includes('"z"'), '点击保存项能载回原 JSON');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Number(document.getElementById('sf-status').dataset.rev) > 0);
  assert((await page.inputValue('#sf-input')).includes('"z"'), '刷新后自动恢复上次输入');
  assert(await page.$('#sf-saved .sf-savedchip') !== null, '刷新后保存项仍在');
  await page.click('#sf-saved .sf-savedchip button[aria-label^="删除"]');
  await page.waitForFunction(() => document.querySelectorAll('#sf-saved .sf-savedchip').length === 0);
  assert(await disp('#sf-saved-empty') !== 'none', '删完后空态提示重新出现');

  // ---------------- 9) 折叠 / 展开 ----------------
  await page.click('#sf-samples .sf-chip[data-sample="weather"]');
  await waitCode('export interface Root {');
  const full = (await rows()).length;
  await page.click('#sf-collapse');
  await page.waitForFunction((n) => document.querySelectorAll('#sf-tree .sf-row').length < n, full);
  const collapsed = (await rows()).length;
  assert(collapsed < full, `折叠后行数变少 (${full} → ${collapsed})`);
  await page.click('#sf-expand');
  await page.waitForFunction((n) => document.querySelectorAll('#sf-tree .sf-row').length === n, full);
  assert((await rows()).length === full, '展开后行数复原');
  const beforeRow = (await rows()).length;
  await page.click('#sf-tree .sf-row[data-path="$.location"]');
  await page.waitForFunction((n) => document.querySelectorAll('#sf-tree .sf-row').length < n, beforeRow);
  assert((await rows()).length === beforeRow - 4, 'location 折叠后正好少掉它的 4 个子字段');

  // ---------------- 10) 复制按钮 ----------------
  await page.click('#sf-samples .sf-chip[data-sample="orders"]');
  await waitCode('export interface Root {');
  await page.click('#sf-copy');
  await page.waitForFunction(() => document.getElementById('sf-copy').dataset.copied === '1', null, { timeout: 5000 });
  assert(await text('#sf-copy') === '已复制', '复制成功后按钮给出反馈');

  // ---------------- 11) 布局守卫（07-17：断 boundingRect,不只断元素存在） ----------------
  const layout = await page.evaluate(() => {
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height,
        right: r.right + scrollX, bottom: r.bottom + scrollY };
    };
    const inside = (a, b, pad = 2) => !!a && !!b && a.x >= b.x - pad && a.right <= b.right + pad &&
      a.y >= b.y - pad && a.bottom <= b.bottom + pad;
    // 每个关键控件都必须落在它自己所属的卡片里（07-17 教训：类名撞车会把控件甩出容器）
    const inOwnCard = (sel) => {
      const el = document.querySelector(sel);
      const card = el && el.closest('.sf-card');
      return inside(rect(el), rect(card));
    };
    let minX = Infinity, minY = Infinity;
    document.querySelectorAll('button, a, input, select, pre, textarea').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      minX = Math.min(minX, r.left + scrollX);
      minY = Math.min(minY, r.top + scrollY);
    });
    const out = document.querySelector('.sf-card.sf-out');
    return {
      backInHero: inside(rect(document.querySelector('.sf-back')), rect(document.querySelector('.sf-hero'))),
      codeInCard: inOwnCard('#sf-code'),
      treeInCard: inOwnCard('#sf-tree'),
      copyInCard: inOwnCard('#sf-copy'),
      inputInCard: inOwnCard('#sf-input'),
      statsInHero: inside(rect(document.querySelector('#sf-stats')), rect(document.querySelector('.sf-hero'))),
      minX, minY,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      codeW: rect(document.querySelector('#sf-code')).w, cardW: rect(out).w
    };
  });
  assert(layout.backInHero && layout.statsInHero, '返回链接与统计条都在 hero 内');
  assert(layout.codeInCard && layout.copyInCard, '代码块与复制按钮都在输出卡片内');
  assert(layout.inputInCard && layout.treeInCard, '输入框与结构树都在各自卡片内');
  assert(layout.minX >= -1 && layout.minY >= -1, `没有控件被甩到页面左上外 (minX=${layout.minX}, minY=${layout.minY})`);
  assert(layout.overflow <= 1, `页面没有横向溢出 (overflow=${layout.overflow})`);
  assert(layout.codeW <= layout.cardW, '代码块不比卡片宽');

  // ---------------- 12) 窄屏（手机）不塌 ----------------
  await page.setViewportSize({ width: 414, height: 900 });
  await page.waitForFunction(() =>
    getComputedStyle(document.querySelector('.sf-grid')).gridTemplateColumns.split(' ').length === 1);
  const narrow = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    cardW: Math.round(document.querySelector('.sf-card').getBoundingClientRect().width),
    codeIn: (() => {
      const c = document.querySelector('#sf-code').getBoundingClientRect();
      const card = document.querySelector('.sf-card.sf-out').getBoundingClientRect();
      return c.left >= card.left - 2 && c.right <= card.right + 2;
    })()
  }));
  assert(narrow.overflow <= 1, `414px 宽下没有横向溢出 (overflow=${narrow.overflow})`);
  assert(narrow.cardW <= 414 && narrow.cardW > 300, `卡片自适应到窄屏 (w=${narrow.cardW})`);
  assert(narrow.codeIn, '窄屏下代码块仍在卡片内');
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.waitForFunction(() =>
    getComputedStyle(document.querySelector('.sf-grid')).gridTemplateColumns.split(' ').length === 3);

  // ---------------- 13) 缩略图：默认订单示例 + TypeScript ----------------
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Number(document.getElementById('sf-status').dataset.rev) > 0);
  await waitCode('export type RootList = Root[];');
  await page.mouse.move(640, 20);
  await page.evaluate(() => window.scrollTo(0, 0));
  // 开关底色有 0.15s 过渡：等它 settle 再截图（承 07-18 / 07-21 教训，别截到中间态）
  await page.waitForFunction(() => Array.from(document.querySelectorAll('.sf-toggle'))
    .filter((i) => i.checked)
    .every((i) => getComputedStyle(i).backgroundColor === 'rgb(0, 163, 92)'));
  await screenshot('thumb.png');
}
