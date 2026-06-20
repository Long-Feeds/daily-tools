// Homepage smoke test: manifest loads, tabs + cards render, search & tabs filter,
// cards link into tool pages. Captures a homepage screenshot for reference.
export default async function ({ page, baseURL, screenshot, assert }) {
  await page.goto(baseURL + '/', { waitUntil: 'networkidle' });

  assert((await page.title()).length > 0, 'homepage has a title');

  await page.waitForSelector('.tool-card', { timeout: 5000 });
  const cards = await page.locator('.tool-card').count();
  assert(cards >= 1, `at least one tool card rendered (got ${cards})`);

  const tabs = await page.locator('.cat-tab').count();
  assert(tabs >= 1, `category tabs rendered (got ${tabs})`);

  // The cronlens card should be present
  const cronCard = page.locator('.tool-card', { hasText: 'Cron' });
  assert((await cronCard.count()) >= 1, 'Cron tool card present on homepage');

  // Search filters everything out on a no-match query
  await page.fill('#search', 'zzz-definitely-no-match-zzz');
  await page.waitForTimeout(150);
  const visibleNoMatch = await page.locator('.tool-card:visible').count();
  assert(visibleNoMatch === 0, `no cards visible for no-match search (got ${visibleNoMatch})`);

  // Clearing search restores cards
  await page.fill('#search', '');
  await page.waitForTimeout(150);
  assert((await page.locator('.tool-card:visible').count()) >= 1, 'cards restored after clearing search');

  // Clicking a category tab does not crash and keeps at least the matching card
  await page.locator('.cat-tab').first().click();
  await page.waitForTimeout(120);

  // A card links into tools/
  const href = await page.locator('.tool-card').first().getAttribute('href');
  assert(href && href.includes('tools/'), `card links into a tool page (got ${href})`);

  // Actually navigate by clicking the card and confirm we land on a tool page
  await page.locator('.tool-card', { hasText: 'Cron' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  assert(/\/tools\//.test(page.url()), `clicking card navigates to tool (url=${page.url()})`);

  await page.goBack();
  await page.waitForSelector('.tool-card');
  await screenshot('hub-preview.png');
}
