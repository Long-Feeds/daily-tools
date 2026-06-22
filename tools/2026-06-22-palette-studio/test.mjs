// Integration test for 配色工作台 (Palette Studio).
// Drives the real color engine through the browser and asserts concrete outputs:
// color-space sync, harmony math (pure red → triadic = pure green + blue),
// the 50–950 scale, WCAG contrast (#000/#fff = 21:1), every export format,
// set-as-base, and the saved-palette localStorage flow. Captures thumb.png.
export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#base-hex');

  const hexes = async (sel) =>
    page.locator(sel).evaluateAll((els) => els.map((e) => e.dataset.hex));
  const text = async (sel) => ((await page.locator(sel).textContent()) || '').trim();
  const lum = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
  };

  // --- set base to pure red, assert cross-control sync ---
  await page.fill('#base-hex', '#ff0000');
  await page.waitForTimeout(80);
  assert((await page.locator('#r').inputValue()) === '255', 'R slider syncs to 255 for #ff0000');
  assert((await page.locator('#g').inputValue()) === '0', 'G slider syncs to 0');
  assert((await page.locator('#b').inputValue()) === '0', 'B slider syncs to 0');
  assert((await text('#h-val')) === '0', `H is 0 for red (got ${await text('#h-val')})`);
  assert((await text('#s-val')) === '100', `S is 100 for red (got ${await text('#s-val')})`);
  assert((await text('#l-val')) === '50', `L is 50 for red (got ${await text('#l-val')})`);
  assert((await text('#pv-hex')) === '#ff0000', 'preview shows #ff0000');

  // --- triadic harmony of pure red = pure green + pure blue (deterministic) ---
  await page.click('#scheme-seg button[data-scheme="triadic"]');
  await page.waitForTimeout(60);
  let harm = await hexes('#harmony-swatches .sw');
  assert(harm.length === 3, `triadic yields 3 swatches (got ${harm.length})`);
  assert(harm.includes('#ff0000'), 'triadic contains base #ff0000');
  assert(harm.includes('#00ff00'), `triadic contains #00ff00 (got ${harm.join(',')})`);
  assert(harm.includes('#0000ff'), `triadic contains #0000ff (got ${harm.join(',')})`);

  // --- complementary of red = cyan ---
  await page.click('#scheme-seg button[data-scheme="complementary"]');
  await page.waitForTimeout(60);
  harm = await hexes('#harmony-swatches .sw');
  assert(harm.length === 2, `complementary yields 2 swatches (got ${harm.length})`);
  assert(harm.includes('#00ffff'), `complementary contains cyan #00ffff (got ${harm.join(',')})`);

  // --- scale: 11 steps, monotonically darkening, labelled 50..950 ---
  const scale = await hexes('#scale-swatches .step');
  assert(scale.length === 11, `scale has 11 steps (got ${scale.length})`);
  const lums = scale.map(lum);
  let mono = true;
  for (let i = 1; i < lums.length; i++) if (lums[i] >= lums[i - 1]) mono = false;
  assert(mono, `scale brightness strictly decreases 50→950 (got ${lums.map((x) => x.toFixed(0)).join(',')})`);
  const steps = await page.locator('#scale-swatches .step .n').allTextContents();
  assert(steps[0] === '50' && steps[steps.length - 1] === '950', `scale labelled 50..950 (got ${steps.join(',')})`);

  // --- WCAG contrast: black on white = 21:1, passes AAA ---
  await page.fill('#fg-hex', '#000000');
  await page.fill('#bg-hex', '#ffffff');
  await page.waitForTimeout(60);
  assert((await text('#ratio')).startsWith('21'), `black/white ratio is 21 (got ${await text('#ratio')})`);
  assert(await page.locator('#b-aaa-normal').evaluate((e) => e.classList.contains('pass')), 'AAA normal passes at 21:1');
  assert(await page.locator('#b-ui').evaluate((e) => e.classList.contains('pass')), 'UI contrast passes at 21:1');

  // --- contrast failure: white on white = 1:1, fails everything ---
  await page.fill('#fg-hex', '#ffffff');
  await page.fill('#bg-hex', '#ffffff');
  await page.waitForTimeout(60);
  assert((await text('#ratio')) === '1.00', `white/white ratio is 1.00 (got ${await text('#ratio')})`);
  assert(await page.locator('#b-aa-normal').evaluate((e) => e.classList.contains('fail')), 'AA normal fails at 1:1');
  assert(await page.locator('#b-ui').evaluate((e) => e.classList.contains('fail')), 'UI fails at 1:1');

  // --- swap colors ---
  await page.fill('#fg-hex', '#123456');
  await page.fill('#bg-hex', '#abcdef');
  await page.waitForTimeout(40);
  await page.click('#swap-cc');
  await page.waitForTimeout(40);
  assert((await page.locator('#fg-hex').inputValue()) === '#abcdef', 'swap moves bg into fg');
  assert((await page.locator('#bg-hex').inputValue()) === '#123456', 'swap moves fg into bg');

  // --- exports reflect the live palette ---
  await page.fill('#base-hex', '#ff0000');
  await page.click('#scheme-seg button[data-scheme="triadic"]');
  await page.waitForTimeout(60);

  await page.click('#export-tabs .tab[data-fmt="hex"]');
  let out = await text('#export-out');
  assert(out.includes('#00ff00') && out.includes('#0000ff'), 'HEX export lists triadic colors');

  await page.click('#export-tabs .tab[data-fmt="css"]');
  out = await text('#export-out');
  assert(out.includes(':root') && out.includes('--brand-500'), 'CSS export has :root and --brand-500');

  await page.click('#export-tabs .tab[data-fmt="tailwind"]');
  out = await text('#export-out');
  assert(/brand:\s*\{/.test(out) && out.includes('500:'), 'Tailwind export nests brand scale');

  await page.click('#export-tabs .tab[data-fmt="json"]');
  out = await text('#export-out');
  const parsed = JSON.parse(out);
  assert(parsed.harmony.includes('#ff0000') && parsed.scale['500'], 'JSON export parses with harmony + scale');

  // --- set-as-base: click ◎ on the 2nd triadic swatch (#00ff00) ---
  const second = await page.locator('#harmony-swatches .sw').nth(1).getAttribute('data-hex');
  await page.locator('#harmony-swatches .sw').nth(1).locator('.setbase').click();
  await page.waitForTimeout(60);
  assert((await page.locator('#base-hex').inputValue()) === second, `set-as-base updates base to ${second}`);

  // --- saved palettes (localStorage) ---
  await page.fill('#base-hex', '#3366cc');
  await page.waitForTimeout(40);
  await page.click('#save-btn');
  await page.waitForTimeout(40);
  assert((await page.locator('#saved-list .saved-row').count()) === 1, 'saving adds a row');
  await page.fill('#base-hex', '#cc3366');
  await page.waitForTimeout(40);
  await page.locator('#saved-list .saved-row .load-saved').first().click();
  await page.waitForTimeout(40);
  assert((await page.locator('#base-hex').inputValue()) === '#3366cc', 'loading a saved palette restores its base');
  await page.locator('#saved-list .saved-row .del-saved').first().click();
  await page.waitForTimeout(40);
  assert((await page.locator('#saved-list .saved-row').count()) === 0, 'deleting removes the row');

  // --- settle on an attractive, colorful state for the thumbnail ---
  await page.fill('#base-hex', '#6e8bff');
  await page.click('#scheme-seg button[data-scheme="triadic"]');
  await page.fill('#fg-hex', '#16233f');
  await page.fill('#bg-hex', '#ffffff');
  await page.click('#export-tabs .tab[data-fmt="css"]');
  // frame the base + harmony swatches + colorful scale (the visual highlight)
  await page.evaluate(() => { window.scrollTo(0, 0); });
  await page.waitForTimeout(150);
  await screenshot('thumb.png');
}
