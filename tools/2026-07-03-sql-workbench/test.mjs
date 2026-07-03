// Integration test for SQL 工作台 · SQL Workbench.
// Drives the real in-browser SQL engine (tokenizer → parser → executor) and
// asserts concrete query results — join / group-by / aggregates / null semantics /
// CSV+JSON import — not mere element presence. Also exercises the real UI (run
// button, sample-query chips, export, persistence). Captures thumb.png.

export default async function ({ page, toolURL, screenshot, assert }) {
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#sql-editor');
  await page.waitForFunction(() => window.__sql && typeof window.__sql.query === 'function');

  const q = (sql) => page.evaluate((s) => window.__sql.query(s), sql);
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const rowsOf = async (sql) => (await q(sql)).rows;

  // deterministic starting point: only the two sample tables
  await page.evaluate(() => { window.__sql.clearAll(); window.__sql.loadSample(); });

  // ---- 0. sample tables registered ----
  const tables = await page.evaluate(() => window.__sql.getTables().map((t) => t.name).sort());
  assert(eq(tables, ['departments', 'employees']), `sample tables loaded (got ${tables})`);

  // ---- 1. SELECT * projects every column of every row ----
  let r = await q('SELECT * FROM employees');
  assert(eq(r.columns, ['id', 'name', 'dept_id', 'salary', 'age', 'city', 'active']), `SELECT * columns (got ${r.columns})`);
  assert(r.rowCount === 7, `SELECT * returns all 7 rows (got ${r.rowCount})`);

  // ---- 2. WHERE comparison + ORDER BY DESC ----
  assert(eq(await rowsOf("SELECT name, salary FROM employees WHERE salary > 100000 ORDER BY salary DESC"),
    [['Alice', 120000], ['Frank', 115000]]), 'WHERE salary>100000 ORDER BY salary DESC → Alice,Frank');

  // ---- 3. COUNT(*) with alias ----
  r = await q('SELECT COUNT(*) AS n FROM employees');
  assert(eq(r.columns, ['n']) && eq(r.rows, [[7]]), `COUNT(*) AS n → 7 (got ${JSON.stringify(r.rows)})`);

  // ---- 4. GROUP BY + COUNT + SUM, order by aggregate alias ----
  assert(eq(await rowsOf("SELECT dept_id, COUNT(*) AS c, SUM(salary) AS total FROM employees WHERE dept_id IS NOT NULL GROUP BY dept_id ORDER BY total DESC"),
    [[1, 3, 330000], [2, 2, 152000], [3, 1, 60000]]), 'GROUP BY dept_id: counts + salary sums ordered by total');

  // ---- 5. AVG over a filtered group ----
  assert(eq(await rowsOf("SELECT AVG(salary) AS a FROM employees WHERE dept_id = 1"), [[110000]]),
    'AVG(salary) of dept 1 = (120000+95000+115000)/3 = 110000');

  // ---- 6. INNER JOIN + qualified columns + filter on joined table ----
  assert(eq(await rowsOf("SELECT e.name, d.name AS dept FROM employees e JOIN departments d ON e.dept_id = d.id WHERE d.name = 'Sales' ORDER BY e.name"),
    [['Carol', 'Sales'], ['Dave', 'Sales']]), 'INNER JOIN employees↔departments filtered to Sales');

  // ---- 7. LEFT JOIN preserves unmatched left row as NULLs; IS NULL finds it ----
  assert(eq(await rowsOf("SELECT e.name, d.name AS dept FROM employees e LEFT JOIN departments d ON e.dept_id = d.id WHERE d.id IS NULL"),
    [['Grace', null]]), 'LEFT JOIN: Grace has no dept → d.name NULL, found via IS NULL');

  // ---- 8. LIKE (case-insensitive, % wildcard) ----
  assert(eq(await rowsOf("SELECT name FROM employees WHERE city LIKE 'S%' ORDER BY name"),
    [['Alice'], ['Bob']]), "LIKE 'S%' matches SF → Alice, Bob");

  // ---- 9. IN list ----
  assert(eq(await rowsOf("SELECT name FROM employees WHERE dept_id IN (2, 3) ORDER BY id"),
    [['Carol'], ['Dave'], ['Eve']]), 'IN (2,3) → Carol, Dave, Eve');

  // ---- 10. BETWEEN (inclusive) ----
  assert(eq(await rowsOf("SELECT name FROM employees WHERE age BETWEEN 30 AND 45 ORDER BY age"),
    [['Alice'], ['Dave'], ['Grace'], ['Bob']]), 'BETWEEN 30 AND 45 ordered by age → Alice30,Dave38,Grace41,Bob45');

  // ---- 11. DISTINCT ----
  assert(eq(await rowsOf("SELECT DISTINCT dept_id FROM employees WHERE dept_id IS NOT NULL ORDER BY dept_id"),
    [[1], [2], [3]]), 'DISTINCT dept_id → 1,2,3');

  // ---- 12. HAVING filters groups by aggregate ----
  assert(eq(await rowsOf("SELECT dept_id, COUNT(*) AS c FROM employees WHERE dept_id IS NOT NULL GROUP BY dept_id HAVING COUNT(*) >= 2 ORDER BY dept_id"),
    [[1, 3], [2, 2]]), 'HAVING COUNT(*)>=2 keeps depts 1 & 2, drops dept 3');

  // ---- 13. scalar function + arithmetic + alias ----
  assert(eq(await rowsOf("SELECT UPPER(name) AS u, salary / 1000 AS k FROM employees WHERE id = 1"),
    [['ALICE', 120]]), 'UPPER(name)=ALICE, salary/1000=120');

  // ---- 14. string concatenation with || ----
  assert(eq(await rowsOf("SELECT name || ' (' || city || ')' AS label FROM employees WHERE id = 3"),
    [['Carol (NY)']]), "|| concat → 'Carol (NY)'");

  // ---- 15. error handling (no throw; returns {error}) ----
  assert((await q('SELECT * FROM nope')).error, 'unknown table → error');
  assert(/列/.test((await q('SELECT foo FROM employees')).error || ''), 'unknown column → error mentions 列');
  assert(/SELECT/.test((await q('DELETE FROM employees')).error || ''), 'non-SELECT rejected');
  assert((await q('SELECT 1 +')).error, 'syntax error → error');

  // ---- 16. multiple aggregates over the whole table (implicit single group) ----
  assert(eq(await rowsOf("SELECT COUNT(*) AS n, MAX(salary) AS hi, MIN(age) AS young FROM employees"),
    [[7, 120000, 25]]), 'COUNT/MAX/MIN over whole table');

  // ---- 17. COUNT(col) ignores NULLs, unlike COUNT(*) ----
  assert(eq(await rowsOf("SELECT COUNT(dept_id) AS c FROM employees"), [[6]]),
    'COUNT(dept_id) ignores Grace NULL → 6 (COUNT(*) would be 7)');

  // ---- 18. LIMIT + OFFSET ----
  assert(eq(await rowsOf("SELECT name FROM employees ORDER BY id LIMIT 2 OFFSET 1"),
    [['Bob'], ['Carol']]), 'LIMIT 2 OFFSET 1 over id order → Bob, Carol');

  // ---- 19. FROM-less expression evaluation (calculator mode) ----
  assert(eq(await rowsOf("SELECT 1 + 2 * 3 AS x"), [[7]]), 'operator precedence 1+2*3 → 7');
  assert(eq(await rowsOf("SELECT 10 / 4 AS x"), [[2.5]]), '10/4 → 2.5');
  assert(eq(await rowsOf("SELECT 1 / 0 AS x"), [[null]]), 'division by zero → NULL');
  assert(eq(await rowsOf("SELECT 'a' || 'b' AS s"), [['ab']]), "'a'||'b' → 'ab'");

  // ---- 20. IS NULL ----
  assert(eq(await rowsOf("SELECT name FROM employees WHERE dept_id IS NULL"), [['Grace']]),
    'IS NULL finds Grace');

  // ---- 21. NOT + AND precedence over boolean column ----
  assert(eq(await rowsOf("SELECT name FROM employees WHERE NOT active AND age > 40 ORDER BY id"),
    [['Grace']]), 'NOT active AND age>40 → only Grace (Dave is 38)');

  // ---- 22. CSV import: type inference (number / boolean / empty→NULL) + aggregates ----
  const csvRes = await page.evaluate(() => window.__sql.addTable('scores', 'csv', 'name,score,passed\nAnn,90,true\nBen,,false\nCy,78.5,true'));
  assert(csvRes.ok && csvRes.rows === 3, `CSV import ok, 3 rows (got ${JSON.stringify(csvRes)})`);
  assert(eq(await rowsOf("SELECT COUNT(*) AS c, SUM(score) AS s, AVG(score) AS a FROM scores"), [[3, 168.5, 84.25]]),
    'CSV numbers: SUM ignores empty (90+78.5=168.5), AVG over 2 non-null = 84.25');
  assert(eq(await rowsOf("SELECT name FROM scores WHERE passed = TRUE ORDER BY score DESC"), [['Ann'], ['Cy']]),
    'CSV boolean inference: passed=TRUE → Ann, Cy');
  assert(eq(await rowsOf("SELECT score FROM scores WHERE name = 'Ben'"), [[null]]),
    'empty CSV field inferred as NULL');

  // ---- 23. JSON import ----
  const jsonRes = await page.evaluate(() => window.__sql.addTable('items', 'json', '[{"sku":"A","qty":3},{"sku":"B","qty":5}]'));
  assert(jsonRes.ok && jsonRes.rows === 2, `JSON import ok, 2 rows (got ${JSON.stringify(jsonRes)})`);
  assert(eq(await rowsOf("SELECT SUM(qty) AS t FROM items"), [[8]]), 'JSON import queried: SUM(qty)=8');

  // ---- 24. real UI: type in editor, click Run, read the rendered result table ----
  await page.evaluate(() => window.__sql.setSQL('SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3'));
  await page.click('#run-btn');
  await page.waitForSelector('#result-table tbody tr');
  const dom = await page.evaluate(() => {
    const t = document.getElementById('result-table');
    const cols = [...t.querySelectorAll('thead th')].map((th) => th.textContent);
    const rows = [...t.querySelectorAll('tbody tr')].map((tr) => [...tr.querySelectorAll('td')].map((td) => td.textContent));
    return { cols, rows };
  });
  assert(eq(dom.cols, ['name', 'salary']), `rendered header (got ${dom.cols})`);
  assert(dom.rows.length === 3 && dom.rows[0][0] === 'Alice' && dom.rows[0][1] === '120000',
    `rendered rows top = Alice/120000 (got ${JSON.stringify(dom.rows[0])})`);
  const status1 = (await page.textContent('#status')) || '';
  assert(status1.includes('3 行'), `status shows row count (got "${status1}")`);

  // ---- 25. sample-query chip populates + runs a JOIN query through the UI ----
  await page.click('#sample-queries .chip');
  await page.waitForSelector('#result-table tbody tr');
  const chipStatus = (await page.textContent('#status')) || '';
  assert(chipStatus.startsWith('✓'), `sample query ran green (got "${chipStatus}")`);

  // ---- 26. export reflects the last run result ----
  await page.evaluate(() => { window.__sql.setSQL("SELECT name FROM employees WHERE id = 1"); window.__sql.run(); });
  const csvOut = await page.evaluate(() => window.__sql.exportCSV());
  assert(csvOut === 'name\nAlice', `exportCSV (got ${JSON.stringify(csvOut)})`);
  const jsonOut = await page.evaluate(() => window.__sql.exportJSON());
  assert(eq(JSON.parse(jsonOut), [{ name: 'Alice' }]), `exportJSON (got ${jsonOut})`);

  // ---- 27. persistence across reload (localStorage) ----
  await page.evaluate(() => { window.__sql.addTable('keepme', 'csv', 'a,b\n1,2\n3,4'); window.__sql.setSQL('SELECT SUM(b) AS s FROM keepme'); });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__sql && typeof window.__sql.query === 'function');
  const afterTables = await page.evaluate(() => window.__sql.getTables().map((t) => t.name));
  assert(afterTables.includes('keepme'), `imported table survives reload (got ${afterTables})`);
  assert((await page.evaluate(() => window.__sql.getSQL())).includes('keepme'), 'editor SQL survives reload');
  assert(eq((await q('SELECT SUM(b) AS s FROM keepme')).rows, [[6]]), 'persisted table still queryable: SUM(b)=6');

  // ---- thumbnail: a clean showcase (JOIN + GROUP BY + aggregates) ----
  await page.evaluate(() => {
    window.__sql.clearAll();
    window.__sql.loadSample();
    window.__sql.setSQL('SELECT d.name AS 部门,\n       COUNT(*) AS 人数,\n       ROUND(AVG(e.salary)) AS 平均薪资\nFROM employees e\nJOIN departments d ON e.dept_id = d.id\nGROUP BY d.name\nORDER BY 平均薪资 DESC;');
    window.__sql.run();
  });
  await page.waitForSelector('#result-table tbody tr');
  await page.waitForTimeout(80);
  await screenshot('thumb.png');
}
