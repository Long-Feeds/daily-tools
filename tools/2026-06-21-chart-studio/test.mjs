// Integration test for 数据成图 (Chart Studio).
// Drives the real UI and asserts concrete, independently-verifiable outputs:
//   - bar heights are exactly proportional to values (40:30:20:10 -> 4:3:2:1)
//   - the y-axis "nice max" actually covers the data
//   - line chart emits a polyline whose points fall monotonically (rising data -> falling y)
//   - pie slice angles sum to 360 and percentages match the data share
//   - multi-series cardinality (cats x series), legend toggling hides/shows a series
//   - numeric type-inference drives which columns are offered as series
//   - the header toggle re-parses (row/bar counts change)
//   - PNG and SVG exports actually download real files; copy-JSON carries the data
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { statSync, readFileSync, rmSync } from 'node:fs';

export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#chart');

  const near = (a, b, tol = 0.05) => Math.abs(a - b) <= tol;
  const attrF = async (sel, name) => parseFloat(await page.locator(sel).first().getAttribute(name));
  const count = (sel) => page.locator(sel).count();
  const setData = async (csv) => { await page.fill('#data-input', csv); await page.waitForTimeout(110); };

  // sanity: the default sample renders a real chart on load
  assert((await count('#chart .bar-rect')) > 0, 'default sample renders bars on load');

  // --- 1) single series: bar heights are exactly proportional to values ---
  await page.click('#type button[data-type="bar"]');
  await setData('月份,销量\n1月,10\n2月,20\n3月,30\n4月,40');
  assert((await count('#preview-body tr')) === 4, `preview shows 4 data rows (got ${await count('#preview-body tr')})`);
  assert((await count('#chart .bar-rect')) === 4, `4 bars for 4 rows, 1 series (got ${await count('#chart .bar-rect')})`);

  const h10 = await attrF('#chart .bar-rect[data-value="10"]', 'height');
  const h20 = await attrF('#chart .bar-rect[data-value="20"]', 'height');
  const h30 = await attrF('#chart .bar-rect[data-value="30"]', 'height');
  const h40 = await attrF('#chart .bar-rect[data-value="40"]', 'height');
  assert(near(h40 / h10, 4, 0.06), `bar(40)/bar(10) height ratio == 4 (got ${(h40 / h10).toFixed(3)})`);
  assert(near(h30 / h10, 3, 0.06), `bar(30)/bar(10) height ratio == 3 (got ${(h30 / h10).toFixed(3)})`);
  assert(near(h20 / h10, 2, 0.06), `bar(20)/bar(10) height ratio == 2 (got ${(h20 / h10).toFixed(3)})`);
  assert(h40 > h30 && h30 > h20 && h20 > h10, 'taller bars encode larger values');

  const ymax = await attrF('#chart', 'data-ymax');
  assert(ymax >= 40 && ymax <= 60, `y-axis max covers the data and stays tight (got ${ymax})`);

  // --- 2) value labels appear only when enabled, one per bar ---
  assert((await count('#chart .val-label')) === 0, 'no value labels by default');
  await page.check('#opt-values');
  await page.waitForTimeout(60);
  assert((await count('#chart .val-label')) === 4, `one value label per bar when enabled (got ${await count('#chart .val-label')})`);
  await page.uncheck('#opt-values');
  await page.waitForTimeout(40);

  // --- 3) line chart: a polyline whose points descend as values rise ---
  await page.click('#type button[data-type="line"]');
  await page.waitForTimeout(70);
  assert((await count('#chart polyline.series-line')) === 1, 'line chart emits one polyline for one series');
  assert((await count('#chart .bar-rect')) === 0, 'no bars remain in line mode');
  const cys = await page.locator('#chart .pt').evaluateAll((els) => els.map((e) => parseFloat(e.getAttribute('cy'))));
  assert(cys.length === 4, `4 points plotted (got ${cys.length})`);
  assert(cys[0] > cys[1] && cys[1] > cys[2] && cys[2] > cys[3], `rising values -> falling y (cy: ${cys.map((v) => v.toFixed(0)).join(',')})`);

  // --- 4) pie chart: slice angles sum to 360, percentages match the data share ---
  await page.click('#type button[data-type="pie"]');
  await page.waitForTimeout(70);
  assert((await count('#chart .slice')) === 4, `4 pie slices for 4 categories (got ${await count('#chart .slice')})`);
  const angles = await page.locator('#chart .slice').evaluateAll((els) => els.map((e) => parseFloat(e.getAttribute('data-angle'))));
  const angleSum = angles.reduce((a, b) => a + b, 0);
  assert(near(angleSum, 360, 0.5), `slice angles sum to 360 (got ${angleSum.toFixed(2)})`);
  // value 40 of total 100 => 40%
  const pct40 = await attrF('#chart .slice[data-value="40"]', 'data-percent');
  assert(near(pct40, 40, 0.1), `slice for 40 is 40% of total 100 (got ${pct40})`);
  const ang40 = await attrF('#chart .slice[data-value="40"]', 'data-angle');
  assert(near(ang40, 144, 0.5), `40% slice spans 144° (got ${ang40})`);

  // --- 5) copy-JSON payload carries exactly the plotted data ---
  await page.click('#type button[data-type="bar"]');
  await page.waitForTimeout(60);
  const payload = JSON.parse(await page.locator('#copy-json').getAttribute('data-payload'));
  assert(payload.labels.join(',') === '1月,2月,3月,4月', `JSON labels match (got ${payload.labels.join(',')})`);
  assert(payload.series.length === 1 && payload.series[0].name === '销量', 'JSON has the single named series');
  assert(payload.series[0].data.join(',') === '10,20,30,40', `JSON series data matches (got ${payload.series[0].data.join(',')})`);

  // --- 6) multi-series: type inference, cardinality, legend toggling ---
  await setData('月份,线上,线下\n1月,10,5\n2月,20,15');
  assert((await count('#series-list .ser-chk')) === 2, `only the 2 numeric columns are offered as series (got ${await count('#series-list .ser-chk')})`);
  assert((await page.locator('#label-col').inputValue()) === '0', 'first text column auto-selected as the category axis');
  assert((await count('#chart .bar-rect')) === 4, `2 categories x 2 series = 4 bars (got ${await count('#chart .bar-rect')})`);
  assert((await count('#legend .leg-item[data-idx]')) === 2, '2 legend toggles for 2 series');

  // hide the first series via its legend chip -> only the other series' bars remain
  await page.click('#legend .leg-item[data-idx="1"]');
  await page.waitForTimeout(70);
  assert((await page.locator('#legend .leg-item[data-idx="1"]').getAttribute('aria-pressed')) === 'false', 'legend chip reflects hidden state');
  assert((await count('#chart .bar-rect')) === 2, `hiding one series leaves 2 bars (got ${await count('#chart .bar-rect')})`);
  // bring it back
  await page.click('#legend .leg-item[data-idx="1"]');
  await page.waitForTimeout(70);
  assert((await count('#chart .bar-rect')) === 4, `restoring the series brings back 4 bars (got ${await count('#chart .bar-rect')})`);

  // --- 7) header toggle re-parses the grid (row + bar counts change) ---
  await setData('10,5\n20,15\n30,25');
  await page.uncheck('#opt-header'); // 3 rows, 2 numeric cols, row-index labels
  await page.waitForTimeout(90);
  assert((await count('#preview-body tr')) === 3, `header OFF -> 3 data rows (got ${await count('#preview-body tr')})`);
  assert((await count('#chart .bar-rect')) === 6, `header OFF -> 3 cats x 2 series = 6 bars (got ${await count('#chart .bar-rect')})`);
  await page.check('#opt-header'); // first row becomes the header -> 2 data rows
  await page.waitForTimeout(90);
  assert((await count('#preview-body tr')) === 2, `header ON -> 2 data rows (got ${await count('#preview-body tr')})`);
  assert((await count('#chart .bar-rect')) === 4, `header ON -> 2 cats x 2 series = 4 bars (got ${await count('#chart .bar-rect')})`);

  // --- 8) empty input surfaces the empty-state, no bars ---
  await page.click('#clear');
  await page.waitForTimeout(80);
  assert(await page.locator('#chart-empty').isVisible(), 'empty-state shown when there is no data');
  assert((await count('#chart .bar-rect')) === 0, 'no bars when there is no data');

  // --- 9) exports actually produce real files ---
  await setData('月份,销量\n1月,10\n2月,20\n3月,30\n4月,40');
  await page.waitForTimeout(60);

  const svgPath = join(tmpdir(), 'cs-test-' + process.pid + '.svg');
  const [svgDl] = await Promise.all([ page.waitForEvent('download'), page.click('#dl-svg') ]);
  assert(svgDl.suggestedFilename().endsWith('.svg'), `SVG export download named *.svg (got ${svgDl.suggestedFilename()})`);
  await svgDl.saveAs(svgPath);
  const svgText = readFileSync(svgPath, 'utf8');
  assert(svgText.includes('<svg') && svgText.includes('data-value'), 'exported SVG contains the rendered chart markup');
  assert(/<rect[^>]+fill=/.test(svgText), 'exported SVG has a background + bar rects');
  rmSync(svgPath, { force: true });

  const pngPath = join(tmpdir(), 'cs-test-' + process.pid + '.png');
  const [pngDl] = await Promise.all([ page.waitForEvent('download'), page.click('#dl-png') ]);
  assert(pngDl.suggestedFilename().endsWith('.png'), `PNG export download named *.png (got ${pngDl.suggestedFilename()})`);
  await pngDl.saveAs(pngPath);
  assert(statSync(pngPath).size > 1500, `exported PNG is a real raster (got ${statSync(pngPath).size} bytes)`);
  rmSync(pngPath, { force: true });

  // --- showcase state for the homepage card thumbnail ---
  await page.evaluate(() => {
    const ta = document.getElementById('data-input');
    ta.value = '月份,线上,线下\n1月,1200,800\n2月,1500,900\n3月,1800,1100\n4月,1400,1300\n5月,2100,1500\n6月,2600,1700';
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(80);
  await page.click('#type button[data-type="bar"]');
  await page.fill('#opt-title', '上半年销售额(线上 vs 线下)');
  await page.check('#opt-values');
  // let the export buttons' "done ✓" flash (1.2s) reset so the thumbnail shows real labels
  await page.waitForTimeout(1350);
  // bring the chart card to the top of the viewport for the thumbnail
  await page.evaluate(() => {
    const svg = document.getElementById('chart');
    if (svg) svg.closest('.card').scrollIntoView({ block: 'start' });
    window.scrollBy(0, -14);
  });
  await page.waitForTimeout(180);
  await screenshot('thumb.png');
}
