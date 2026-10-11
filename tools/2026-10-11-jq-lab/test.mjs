/* jq 工作台 · 集成测试
 *
 * 真值来源：run 目录 oracle/test_oracle.mjs —— 每个期望输出都由本机真 jq 1.7.1（/usr/bin/jq）现算，
 * 速查表 95 条与食谱 16 条的输出也是真 jq 跑出来的；由 inject-oracle.mjs 机械注入下面的 ORACLE 块，
 * 本文件不手打任何 jq 结果。引擎本身另有离线随机差分对拍（见 run 目录 oracle/fuzz*.mjs）。
 */
import {
  guardHidden, guardUniqueIds, guardControlSize, guardTextTransform, guardOverflow, guardEscape,
} from '/Users/lon/.agents/cron/daily-website/tools/render-guards.mjs';

const ORACLE = {
 "meta": {
  "tabs": [
   "work",
   "paths",
   "ref",
   "recipes"
  ],
  "refN": 95,
  "recN": 16,
  "dateCards": 4
 },
 "defaultFilter": ".orders | map({id, who: .customer.name, total: (.items | map(.price * .qty) | add)})",
 "defaultC": [
  "[{\"id\":1001,\"who\":\"林夏\",\"total\":92},{\"id\":1002,\"who\":\"Owen\",\"total\":25},{\"id\":1003,\"who\":\"周舟\",\"total\":82}]"
 ],
 "ids": [
  "1001",
  "1002",
  "1003"
 ],
 "argsFilter": "[.orders[] | select(.customer.city == $city and (.items | map(.price * .qty) | add) > $min) | .id]",
 "argsOut": [
  "[1001,1003]"
 ],
 "argsCli": "jq -c --arg city '上海' --argjson min '30' '[.orders[] | select(.customer.city == $city and (.items | map(.price * .qty) | add) > $min) | .id]' input.json",
 "errFilter": ".orders[] | .id, .coupon.code",
 "errOut": [
  "1001",
  "null",
  "1002",
  "null",
  "1003"
 ],
 "errMsg": "Cannot index string with string \"code\"",
 "errExit": 5,
 "inputErr": {
  "text": "{\"a\":1,}",
  "line": 1,
  "col": 8,
  "exit": 5
 },
 "compileExit": 3,
 "pathName": [
  "\"林夏\""
 ],
 "leafCount": 38,
 "priceCount": 5,
 "configLeaf": 15,
 "slurpOut": [
  "5"
 ],
 "rawCsv": [
  "1001,\"林夏\",\"燕麦拿铁\",56",
  "1001,\"林夏\",\"牛油果吐司\",36",
  "1002,\"Owen\",\"冷萃\",25",
  "1003,\"周舟\",\"燕麦拿铁\",28",
  "1003,\"周舟\",\"可颂\",54"
 ],
 "ref": [
  [
   "{\"a\":1,\"b\":[2,3]}"
  ],
  [
   "\"林夏\"",
   "\"昨天\""
  ],
  [
   "[1,3]"
  ],
  [
   "10",
   "30",
   "null"
  ],
  [
   "[1,2]",
   "[3,4]",
   "\"你好\""
  ],
  [
   "1",
   "2"
  ],
  [
   "[1,2,3]"
  ],
  [
   "1",
   "2"
  ],
  [
   "\"笔\"",
   "\"纸\""
  ],
  [
   "[10,20,30]"
  ],
  [
   "{\"name\":\"拿铁\",\"total\":56,\"A1\":true}"
  ],
  [
   "\"订单 1001 共 3 件\""
  ],
  [
   "\"https://x.dev/search?q=jq%20%E6%95%99%E7%A8%8B%20%26%20%E7%A4%BA%E4%BE%8B\""
  ],
  [
   "[3,[1,3],{\"x\":{\"y\":1,\"z\":2}},[\"a\",\"b\"]]"
  ],
  [
   "[true,true,true,true]"
  ],
  [
   "[false,true,true,false]"
  ],
  [
   "[\"夏夏\",\"周舟\"]"
  ],
  [
   "\"小\"",
   "\"中\"",
   "\"大\""
  ],
  [
   "5",
   "\"⚠ 除数为零\"",
   "2"
  ],
  [
   "42"
  ],
  [
   "{\"items\":[{\"price\":90},{\"price\":18}]}"
  ],
  [
   "{\"items\":[{\"p\":3},{\"p\":4}],\"total\":7}"
  ],
  [
   "{\"n\":2,\"tags\":[]}"
  ],
  [
   "{\"user\":\"a\"}"
  ],
  [
   "[2,4,6]"
  ],
  [
   "\"jq:json\""
  ],
  [
   "1",
   "2"
  ],
  [
   "10"
  ],
  [
   "[[1,1],[2,3],[3,6]]"
  ],
  [
   "[1,2,6,24,120,720]"
  ],
  [
   "[1,2,5]"
  ],
  [
   "{\"file\":\"<top-level>\",\"line\":1}"
  ],
  [
   "12"
  ],
  [
   "\"object\""
  ],
  [
   "[0,1,2,3]",
   "[10,7,4,1]"
  ],
  [
   "[0,1,2]",
   "5",
   "12"
  ],
  [
   "\"a\"",
   "\"c\"",
   "\"b\""
  ],
  [
   "243",
   "[1,3,9,27]"
  ],
  [
   "\"hahaha\""
  ],
  [
   "[2,4,16,256]"
  ],
  [
   "[true,false]"
  ],
  [
   "[2,4]"
  ],
  [
   "[2,3,4]",
   "{\"a\":10,\"b\":20}"
  ],
  [
   "[\"乙\"]"
  ],
  [
   "[\"上海-45\",\"上海-31\",\"杭州-20\"]"
  ],
  [
   "[{\"t\":\"a\",\"n\":1},{\"t\":\"b\",\"n\":2}]"
  ],
  [
   "[1,2,3]",
   "[\"b\",\"aa\"]"
  ],
  [
   "\"乙\"",
   "71"
  ],
  [
   "6",
   "\"ab\"",
   "{\"x\":1,\"y\":2}"
  ],
  [
   "[true,true,false]"
  ],
  [
   "[3,2,1]"
  ],
  [
   "[1,2,3,4]",
   "[1,2,[3,[4]]]"
  ],
  [
   "[2,1,3,5,0]"
  ],
  [
   "[0,2]",
   "1",
   "3"
  ],
  [
   "[[1,\"a\"],[2,\"b\"],[3,null]]"
  ],
  [
   "[\"红S\",\"红M\",\"蓝S\",\"蓝M\"]"
  ],
  [
   "3",
   "-3"
  ],
  [
   "true",
   "{\"1\":{\"id\":1,\"v\":\"a\"},\"2\":{\"id\":2,\"v\":\"b\"}}"
  ],
  [
   "{\"a\":[1,2,3],\"b\":{\"c\":[8,9]}}"
  ],
  [
   "[\"a\",\"b\",\"日\"]",
   "[\"b\",\"a\",\"日\"]"
  ],
  [
   "true",
   "true"
  ],
  [
   "true",
   "true"
  ],
  [
   "{\"A\":1,\"C\":3}"
  ],
  [
   "[[\"a\"],[\"b\",\"c\"]]"
  ],
  [
   "1",
   "{\"a\":{\"b\":1,\"c\":9}}",
   "{\"a\":{}}"
  ],
  [
   "{\"user\":{\"name\":\"林夏\"},\"id\":7}"
  ],
  [
   "[[[\"a\",0],1],[[\"a\",1,\"b\"],2],[[\"a\",1,\"b\"]],[[\"a\",1]],[[\"a\"]]]",
   "{\"a\":[1,{\"b\":2}]}"
  ],
  [
   "\"hello 世界\"",
   "\"HELLO 世界\""
  ],
  [
   "\"api.dev/v1.json\"",
   "\"https://api.dev/v1\""
  ],
  [
   "true",
   "true"
  ],
  [
   "\"A|B|C\""
  ],
  [
   "[72,65,76]",
   "\"IBM\""
  ],
  [
   "[true,false,true]"
  ],
  [
   "[{\"offset\":1,\"n\":\"12\"},{\"offset\":6,\"n\":\"3\"}]"
  ],
  [
   "{\"y\":\"2026\",\"m\":\"10\",\"d\":\"11\"}"
  ],
  [
   "[\"#jq\",\"#json\"]"
  ],
  [
   "\"a<1>b<22>c<333>\""
  ],
  [
   "[\"a\",\"b\",\"c;d|e\"]",
   "[\"a, b,c\",\"d\",\"e\"]"
  ],
  [
   "[\"1\",\"a\",\"[2]\",\"null\"]",
   "4.5"
  ],
  [
   "\"{\\\"a\\\":[1,\\\"x\\\"]}\"",
   "[1,\"x\"]"
  ],
  [
   "[3,6,4]"
  ],
  [
   "1,\"甲,乙\",true",
   "2,\"say \"\"hi\"\"\","
  ],
  [
   "\"{\\\"a\\\":\\\"x\\\"}\"",
   "\"{\\\"a\\\":\\\"x\\\"}\""
  ],
  [
   "\"&lt;a href=&apos;x&apos;&gt;A&amp;B&lt;/a&gt;\"",
   "\"%3Ca%20href%3D%27x%27%3EA%26B%3C%2Fa%3E\""
  ],
  [
   "\"rm -- 'it'\\\\''s a file.txt'\""
  ],
  [
   "\"anEg5bel5L2c5Y+w\"",
   "\"jq 工作台\""
  ],
  [
   "[\"null\",\"boolean\",\"number\",\"string\",\"array\",\"object\"]"
  ],
  [
   "[3,-3,2,1024,2]"
  ],
  [
   "[3,0,2.5]"
  ],
  [
   "\"[1.7976931348623157e+308,-1.7976931348623157e+308,null]\"",
   "true"
  ],
  [
   "[1,\"a\",null]",
   "[1,1]"
  ],
  [
   "\"2025-10-11T06:59:59Z\"",
   "1791701999"
  ],
  [
   "\"2025年10月11日 Saturday 06:59\"",
   "1791676800"
  ],
  [
   "[2025,9,11,6,59,59,6,283]",
   "1760165999"
  ],
  [
   "\"number\""
  ]
 ],
 "recipes": [
  [
   "1001,\"林夏\",\"燕麦拿铁\",56",
   "1001,\"林夏\",\"牛油果吐司\",36",
   "1002,\"Owen\",\"冷萃\",25",
   "1003,\"周舟\",\"燕麦拿铁\",28",
   "1003,\"周舟\",\"可颂\",54"
  ],
  [
   "[{\"city\":\"上海\",\"orders\":2,\"revenue\":174}]"
  ],
  [
   "[{\"id\":1001,\"qty\":3},{\"id\":1003,\"qty\":4}]"
  ],
  [
   "[{\"id\":1001,\"day\":\"2025-10-10\"},{\"id\":1002,\"day\":\"2025-10-11\"},{\"id\":1003,\"day\":\"2025-10-12\"}]"
  ],
  [
   "{\"name\":\"gateway\",\"version\":\"2.4.1\",\"servers\":[{\"host\":\"10.0.0.5\",\"port\":8080,\"tags\":[\"blue\",\"canary\"]},{\"host\":\"10.0.0.6\",\"port\":8081,\"tags\":[]}],\"limits\":{\"rps\":1200,\"per-ip\":{\"rps\":40}},\"features\":{\"dark-mode\":true,\"beta\":false}}"
  ],
  [
   "{\"name\":\"gateway\",\"version\":\"2.4.1\",\"servers.0.host\":\"10.0.0.5\",\"servers.0.port\":8080,\"servers.0.tags.0\":\"blue\",\"servers.0.tags.1\":\"canary\",\"servers.1.host\":\"10.0.0.6\",\"servers.1.port\":8081,\"limits.rps\":1200,\"limits.per-ip.rps\":40,\"features.dark-mode\":true}"
  ],
  [
   "{\"name\":\"gateway\",\"version\":\"2.4.1\",\"debug\":null,\"servers\":[{\"host\":\"10.0.0.5\",\"port\":9080,\"tags\":[\"blue\",\"canary\"]},{\"host\":\"10.0.0.6\",\"port\":9081,\"tags\":[]}],\"limits\":{\"rps\":1200,\"burst\":null,\"per-ip\":{\"rps\":40}},\"features\":{\"dark-mode\":true,\"beta\":false}}"
  ],
  [
   "{\"dark_mode\":true,\"beta\":false}"
  ],
  [
   "[{\"who\":\"octocat\",\"pushes\":1,\"commits\":3},{\"who\":\"mona\",\"pushes\":1,\"commits\":1}]"
  ],
  [
   "[\"Fix @base64d\",\"Docs\",\"Add tests\",\"Bump wasm\"]"
  ],
  [
   "{\"count\":5,\"errors\":1,\"avg_ms\":474.4,\"slowest\":\"/api/orders\"}"
  ],
  [
   "06:00:02 warn /api/orders 812ms",
   "06:00:04 error /api/orders 1503ms"
  ],
  [
   "{\"/api/users\":55,\"/api/orders\":2315,\"/health\":2}"
  ],
  [
   "{\"1001\":\"paid\",\"1002\":\"refunded\",\"1003\":\"paid\"}"
  ],
  [
   "[\"0.repo.name\",\"1.repo.name\",\"2.repo.name\",\"3.repo.name\"]"
  ],
  [
   "{\"q\":\"jq\",\"page\":\"2\",\"sort\":\"stars\"}"
  ]
 ],
 "chain": [
  "3006"
 ],
 "fuzz": []
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const W = (fn, arg, ms = 10000) => page.waitForFunction(fn, arg, { timeout: ms });
  const items = () => page.$$eval('#jq-output .jq-out-item', (ns) => ns.map((n) => n.textContent));
  async function setFilter(f) { await page.fill('#jq-filter', f); }
  async function setOpt(id, on) { const el = page.locator('#jq-o-' + id); if ((await el.isChecked()) !== on) await el.click(); }
  async function onTab(t) { await page.click('#jq-tab-' + t); await W((t) => !document.getElementById('pane-' + t).hidden, t); }
  async function waitItems(expect) {
    await W((exp) => {
      const got = Array.from(document.querySelectorAll('#jq-output .jq-out-item')).map((n) => n.textContent);
      return JSON.stringify(got) === JSON.stringify(exp);
    }, expect).catch(() => {});
    const got = await items();
    return got;
  }

  await page.goto(toolURL);
  await W(() => document.querySelectorAll('#jq-output .jq-out-item').length > 0);

  // 1. 返回链接与默认示例
  const back = page.locator('a[href="../../"]');
  assert(await back.count() === 1 && (await back.textContent()).includes('返回工具集'), '顶部应有返回工具集链接');
  assert((await page.inputValue('#jq-filter')) === ORACLE.defaultFilter, '默认过滤器');
  await setOpt('c', true);
  let got = await waitItems(ORACLE.defaultC);
  assert(JSON.stringify(got) === JSON.stringify(ORACLE.defaultC), `默认示例 -c 输出应与 jq 一致：${got.join(' | ')}`);
  assert(await page.locator('#jq-output .jq-n').count() > 0, '输出应带语法着色（数字 span）');
  assert((await page.textContent('#jq-exit')).includes('退出码 0'), '退出码 0');

  // 2. 改过滤器：逐个产出
  await setFilter('.orders[] | .id');
  got = await waitItems(ORACLE.ids);
  assert(JSON.stringify(got) === JSON.stringify(ORACLE.ids), `.orders[] | .id 应得 ${ORACLE.ids}，实得 ${got}`);
  assert((await page.textContent('#jq-nres')) === String(ORACLE.ids.length), '结果计数');

  // 3. 变量 --arg / --argjson + 等价命令行
  await setFilter(ORACLE.argsFilter);
  await page.fill('#jq-args', 'city=上海\nmin:=30');
  got = await waitItems(ORACLE.argsOut);
  assert(JSON.stringify(got) === JSON.stringify(ORACLE.argsOut), `变量过滤应得 ${ORACLE.argsOut}，实得 ${got}`);
  await W((exp) => document.getElementById('jq-cli').textContent === exp, ORACLE.argsCli);
  assert((await page.textContent('#jq-cli')) === ORACLE.argsCli, `等价命令行：${await page.textContent('#jq-cli')}`);
  await page.fill('#jq-args', 'bad line');
  await W(() => (document.getElementById('jq-errbox') || {}).textContent?.includes('格式不对'));
  await page.fill('#jq-args', '');

  // 4. 运行期错误：错误前的输出保留，错误文案与 jq 一致
  await setFilter(ORACLE.errFilter);
  await W(() => document.querySelector('#jq-output .jq-out-err'));
  got = await items();
  assert(JSON.stringify(got) === JSON.stringify(ORACLE.errOut), `出错前的输出应与 jq 一致：${got}`);
  const errText = await page.textContent('#jq-output .jq-out-err');
  assert(errText.includes(ORACLE.errMsg), `运行期错误文案应含 jq 的「${ORACLE.errMsg}」，实得 ${errText}`);
  assert((await page.textContent('#jq-exit')).includes('退出码 ' + ORACLE.errExit), '运行期错误退出码 5');

  // 5. 编译错误：带行列与 ^ 指示
  await setFilter('.orders | map(.id');
  await W(() => document.getElementById('jq-errbox'));
  const ce = await page.textContent('#jq-errbox');
  assert(ce.includes('编译错误') && ce.includes('第 1 行') && ce.includes('^'), `编译错误提示：${ce}`);
  assert((await page.textContent('#jq-status')).includes('退出码 ' + ORACLE.compileExit), '编译错误退出码 3');

  // 6. 输入错误：行列号与 jq 相同
  await setFilter('.');
  const keepInput = await page.inputValue('#jq-input');
  await page.fill('#jq-input', ORACLE.inputErr.text);
  await W(() => document.getElementById('jq-inmeta').classList.contains('jq-st-bad'));
  const im = await page.textContent('#jq-inmeta');
  assert(im.includes(`第 ${ORACLE.inputErr.line} 行第 ${ORACLE.inputErr.col} 列`), `输入错误位置应与 jq 的 line ${ORACLE.inputErr.line}, column ${ORACLE.inputErr.col} 一致：${im}`);
  await W(() => (document.getElementById('jq-errbox') || {}).textContent?.includes('输入不是合法 JSON'));
  await page.fill('#jq-input', keepInput);
  await W(() => !document.getElementById('jq-inmeta').classList.contains('jq-st-bad'));

  // 7. 死循环：Worker 3 秒超时后能恢复
  await setFilter('last(repeat(1))');
  await W(() => document.getElementById('jq-status').textContent.includes('超时'), null, 9000);
  assert((await page.textContent('#jq-output')).includes('3 秒'), '超时提示');
  await setFilter('.orders[] | .id');
  got = await waitItems(ORACLE.ids);
  assert(JSON.stringify(got) === JSON.stringify(ORACLE.ids), '超时后 Worker 重建，能继续运行');

  // 8. 选项：-s 吞成数组 / -n + inputs / -r 原始输出（食谱 1：订单拍平成 CSV）
  await onTab('recipes');
  assert(await page.locator('#jq-recipes .jq-rec').count() === ORACLE.meta.recN, '食谱条数');
  await page.click('[data-load="0"]');
  await W(() => !document.getElementById('pane-work').hidden);
  assert(await page.locator('#jq-o-r').isChecked(), '载入 CSV 食谱后应勾上 -r');
  got = await waitItems(ORACLE.rawCsv);
  assert(JSON.stringify(got) === JSON.stringify(ORACLE.rawCsv), `-r @csv 原始输出：${got.join(' | ')}`);
  assert(await page.locator('#jq-output .jq-out-raw').count() === ORACLE.rawCsv.length, '原始字符串不着色');

  // 9. 全部 16 个食谱：载入后勾 -c，逐字节对拍 jq
  for (let i = 0; i < ORACLE.meta.recN; i++) {
    await onTab('recipes');
    await page.click(`[data-load="${i}"]`);
    await W(() => !document.getElementById('pane-work').hidden);
    await setOpt('c', true);
    got = await waitItems(ORACLE.recipes[i]);
    assert(JSON.stringify(got) === JSON.stringify(ORACLE.recipes[i]), `食谱 #${i + 1} 输出与 jq 不一致：\n  页面 ${got.join(' | ')}\n  jq   ${ORACLE.recipes[i].join(' | ')}`);
  }

  // 10. 结果作为新输入（链式）
  await setOpt('r', false); await setOpt('s', false); await setOpt('n', false);
  await page.selectOption('#jq-sample', 'orders');
  await setFilter('.orders | map(.id)');
  await W(() => document.querySelectorAll('#jq-output .jq-out-item').length === 1 && document.querySelector('#jq-output .jq-out-item').textContent.startsWith('[1001'));
  await page.click('#jq-use-out');
  await setFilter('add');
  got = await waitItems(ORACLE.chain);
  assert(JSON.stringify(got) === JSON.stringify(ORACLE.chain), `链式运行：${got}`);

  // 11. 收藏：保存 → 刷新仍在 → 载入 → 删除
  await page.selectOption('#jq-sample', 'orders');
  await setFilter('.orders[] | .id');
  await waitItems(ORACLE.ids);
  await page.click('#jq-save');
  assert(await page.locator('#jq-snips [data-snip]').count() === 1, '收藏后列表应有 1 条');
  await page.reload();
  await W(() => document.querySelectorAll('#jq-output .jq-out-item').length > 0);
  assert(await page.locator('#jq-snips [data-snip]').count() === 1, '刷新后收藏仍在（localStorage）');
  assert((await page.inputValue('#jq-filter')) === '.orders[] | .id', '刷新后恢复上次的过滤器');
  assert(await page.locator('#jq-hist [data-hist]').count() >= 3, '最近运行有记录');
  await setFilter('.store');
  await page.click('#jq-snips [data-snip="0"]');
  got = await waitItems(ORACLE.ids);
  assert(JSON.stringify(got) === JSON.stringify(ORACLE.ids), '点收藏能载入');
  await page.click('#jq-snips [data-del="0"]');
  assert(await page.locator('#jq-snips [data-snip]').count() === 0, '删除收藏');

  // 12. 分享链接：新页面打开同一链接能恢复过滤器
  await setFilter('.orders | length');
  await W(() => document.querySelector('#jq-output .jq-out-item')?.textContent === '3');
  await page.click('#jq-share');
  const shareURL = page.url();
  assert(shareURL.includes('#s='), '分享链接应写进 hash');
  const p2 = await page.context().newPage();
  await p2.goto(shareURL);
  await p2.waitForFunction(() => document.querySelector('#jq-output .jq-out-item')?.textContent === '3', null, { timeout: 10000 });
  assert((await p2.inputValue('#jq-filter')) === '.orders | length', '分享链接恢复过滤器');
  await p2.close();

  // 13. 键盘：Ctrl+Enter 运行、方向键切页签
  await page.focus('#jq-tab-work');
  await page.keyboard.press('ArrowRight');
  await W(() => !document.getElementById('pane-paths').hidden);
  assert(await page.evaluate(() => document.activeElement.id) === 'jq-tab-paths', '方向键切页签并移动焦点');
  await page.keyboard.press('ArrowLeft');
  await W(() => !document.getElementById('pane-work').hidden);

  // 14. 路径探索：点树 → 表达式 → 回代 → 用作过滤器
  await page.selectOption('#jq-sample', 'orders');
  await setOpt('c', true);
  await onTab('paths');
  await page.click('#jq-tree .jq-node[data-path=\'["orders"]\']');
  await page.click('#jq-tree .jq-node[data-path=\'["orders",0]\']');
  await page.click('#jq-tree .jq-node[data-path=\'["orders",0,"customer"]\']');
  await page.click('#jq-tree .jq-node[data-path=\'["orders",0,"customer","name"]\']');
  assert((await page.textContent('#jq-pexpr')) === '.orders[0].customer.name', `路径表达式：${await page.textContent('#jq-pexpr')}`);
  assert((await page.textContent('#jq-parr')).replace(/\s/g, '') === '["orders",0,"customer","name"]', 'getpath 数组');
  assert((await page.textContent('#jq-pcheck')).includes('✓'), '表达式回代一致');
  assert((await page.textContent('#jq-pcount')).includes(String(ORACLE.leafCount)), `叶子路径数应为 jq 算的 ${ORACLE.leafCount}：${await page.textContent('#jq-pcount')}`);
  await page.fill('#jq-pfilter', 'price');
  await W((n) => document.querySelectorAll('#jq-ptable tbody tr').length === n, ORACLE.priceCount);
  assert(await page.locator('#jq-ptable tbody tr').count() === ORACLE.priceCount, `按 price 筛选应剩 ${ORACLE.priceCount} 行`);
  await page.click('#jq-ptable tbody tr >> nth=0');
  assert((await page.textContent('#jq-pexpr')) === '.orders[0].items[0].price', '点表格行定位节点');
  await page.click('#jq-tree .jq-node[data-path=\'["orders",0,"customer","name"]\']');
  await page.click('#jq-puse');
  got = await waitItems(ORACLE.pathName);
  assert(JSON.stringify(got) === JSON.stringify(ORACLE.pathName), `用作过滤器后应输出 ${ORACLE.pathName}`);

  // 15. 路径表达式 round-trip 性质：怪键名（空格/中文/关键字/空串/数字开头/引号）全部回代一致
  const rt = await page.evaluate(() => {
    const L = window.__jqlab, J = L.JQ;
    const docs = [L.data.samples.orders.text, L.data.samples.config.text, L.data.samples.events.text,
      JSON.stringify({ 'a b': { '日本': [1, { if: true, '': null, '1x': 'k', 'q"uote': [[], {}], 'back\\slash': 2, '$x': 3, 'per-ip': { rps: 4 } }] } })];
    let n = 0, bad = [];
    for (const d of docs) {
      const v = J.parseJsonSeq(d)[0];
      for (const p of L.leafPaths(v)) {
        const ex = L.pathExpr(p);
        const r = J.run(ex, d, {});
        n++;
        if (r.compileError || r.results.length !== 1 || r.results[0].error !== undefined || J.cmp(r.results[0].v, J.getpath(v, p)) !== 0) bad.push(ex);
      }
    }
    return { n, bad };
  });
  assert(rt.bad.length === 0, `路径表达式回代失败：${rt.bad.slice(0, 5).join(' ; ')}`);
  assert(rt.n >= ORACLE.leafCount + ORACLE.configLeaf + 8, `round-trip 应扫到足够多的叶子，实得 ${rt.n}`);

  // 16. 速查：95 张卡片的现场输出逐条等于真 jq
  await onTab('ref');
  assert(await page.locator('#jq-refgrid .jq-ref').count() === ORACLE.meta.refN, '速查卡片数');
  const refOuts = await page.$$eval('#jq-refgrid .jq-ex-o', (ns) => ns.map((n) => n.textContent));
  const refBad = [];
  refOuts.forEach((t, i) => { if (t !== ORACLE.ref[i].join('\n')) refBad.push(`#${i + 1} 页面「${t}」 jq「${ORACLE.ref[i].join('\\n')}」`); });
  assert(refBad.length === 0, `速查输出与 jq 不一致 ${refBad.length} 处：${refBad.slice(0, 3).join(' ; ')}`);
  await page.click('#jq-cats [data-cat="日期"]');
  await W((n) => document.querySelectorAll('#jq-refgrid .jq-ref:not([hidden])').length === n, ORACLE.meta.dateCards);
  const hiddenDisp = await page.$eval('#jq-refgrid .jq-ref[hidden]', (n) => getComputedStyle(n).display);
  assert(hiddenDisp === 'none', '筛掉的卡片计算样式应为 none');
  await page.click('#jq-cats [data-cat="全部"]');
  await page.fill('#jq-ref-search', 'gsub');
  await W(() => Array.from(document.querySelectorAll('#jq-refgrid .jq-ref:not([hidden]) .jq-ref-sig')).some((n) => n.textContent.includes('gsub')));
  await page.fill('#jq-ref-search', 'zzzz不存在');
  await W(() => !document.getElementById('jq-ref-none').hidden);
  await page.fill('#jq-ref-search', '');
  await page.click('#jq-refgrid [data-try="0"]');
  await W(() => !document.getElementById('pane-work').hidden);
  got = await waitItems(ORACLE.ref[0]);
  assert(JSON.stringify(got) === JSON.stringify(ORACLE.ref[0]), '速查「在工作台打开」');

  // 17. 渲染守卫：[hidden] 计算样式 / id 唯一 / 逐页签控件尺寸 / text-transform / 逐视口溢出 / 卡片逃逸
  await onTab('work');
  await guardHidden(page, { assert, panesRoot: '#jq-panes', tabs: ORACLE.meta.tabs });
  await guardUniqueIds(page, { assert, minIds: 60 });
  const nCtl = await guardControlSize(page, { assert, tabs: ORACLE.meta.tabs, onTab, paneSel: (t) => `#pane-${t}`, minControls: 40 });
  assert(nCtl >= 40, `逐页签扫到的控件应 ≥40，实得 ${nCtl}`);
  await guardTextTransform(page, { assert, tabs: ORACLE.meta.tabs, onTab, paneSel: (t) => `#pane-${t}` });
  await guardOverflow(page, { assert, tabs: ORACLE.meta.tabs, onTab, panesRoot: 'body', viewports: [390, 768, 1280] });
  await guardEscape(page, { assert, cardSel: '.jq-card', childSel: 'table,h2,p,pre,code,textarea' });
  const navOverlap = await page.evaluate(() => {
    const a = document.querySelector('.jq-back').getBoundingClientRect(), t = document.querySelector('.jq-tabs').getBoundingClientRect();
    return !(a.right <= t.left || t.right <= a.left || a.bottom <= t.top || t.bottom <= a.top);
  });
  assert(!navOverlap, '返回链接与页签不重叠');

  // 18. 缩略图：工作台 + 一个有分量的过滤器
  await page.setViewportSize({ width: 1280, height: 850 });
  await onTab('work');
  await page.selectOption('#jq-sample', 'orders');
  await setOpt('c', false);
  await setFilter(ORACLE.defaultFilter);
  await W(() => document.getElementById('jq-cli').textContent.includes('map({id, who') && (document.querySelector('#jq-output .jq-out-item') || {}).textContent?.includes('"who"') && document.getElementById('jq-toast').hidden, null, 10000);
  assert(await page.evaluate(() => getComputedStyle(document.getElementById('jq-toast')).display) === 'none', '截图前提示条应已隐藏');
  await page.evaluate(() => window.scrollTo(0, 0));
  await screenshot('thumb.png');
};
