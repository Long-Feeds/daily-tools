// Integration test runner.
// Auto-discovers test/hub.test.mjs + every tools/<slug>/test.mjs, runs each in a
// fresh Playwright (Chromium) page against a local static server, captures a
// screenshot, and fails (exit 1) on any assertion failure or uncaught page error.
//
// Each test module: `export default async ({ page, baseURL, toolURL, screenshot, assert }) => {...}`
//   - toolURL: the tool's own URL (for tool tests); baseURL + '/' is the hub.
//   - screenshot(name): saves a PNG next to the test (tool dir / assets) — used for card thumbnails.
import { chromium } from 'playwright';
import { startServer } from './server.mjs';
import { readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function assert(cond, msg) {
  if (!cond) throw new Error('Assertion failed: ' + msg);
}

async function collectTests() {
  const tests = [];
  const hubTest = join(__dirname, 'hub.test.mjs');
  if (existsSync(hubTest)) tests.push({ name: 'hub', file: hubTest, kind: 'hub' });
  const toolsDir = join(ROOT, 'tools');
  if (existsSync(toolsDir)) {
    for (const slug of (await readdir(toolsDir)).sort()) {
      const tf = join(toolsDir, slug, 'test.mjs');
      if (existsSync(tf)) tests.push({ name: 'tool:' + slug, file: tf, kind: 'tool', slug });
    }
  }
  return tests;
}

async function main() {
  const { server, url: baseURL } = await startServer(ROOT, 0);
  const browser = await chromium.launch();
  const tests = await collectTests();
  console.log(`Running ${tests.length} test module(s) against ${baseURL}\n`);
  const results = [];

  for (const t of tests) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 850 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    const pageErrors = [];
    page.on('pageerror', (e) => pageErrors.push(String(e)));

    const screenshot = async (name) => {
      const dir = t.kind === 'tool' ? join(ROOT, 'tools', t.slug) : join(ROOT, 'assets');
      const path = join(dir, name);
      await page.screenshot({ path, fullPage: false });
      return path;
    };
    const toolURL = t.kind === 'tool' ? `${baseURL}/tools/${t.slug}/` : `${baseURL}/`;

    try {
      const mod = await import(pathToFileURL(t.file).href);
      await mod.default({ page, baseURL, toolURL, screenshot, assert });
      assert(pageErrors.length === 0, `uncaught page errors: ${pageErrors.join(' | ')}`);
      results.push({ name: t.name, ok: true });
      console.log(`  ✓ ${t.name}`);
    } catch (e) {
      results.push({ name: t.name, ok: false, error: e.message || String(e) });
      console.log(`  ✗ ${t.name}\n      ${e.message || e}`);
    } finally {
      await ctx.close();
    }
  }

  await browser.close();
  server.close();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
