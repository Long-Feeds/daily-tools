// cURL 工作台 · 集成测试（真实 Chromium）
// 真值一律来自 ORACLE（toracle/build.py：本机 curl 8.7.1 原始 TCP 抓包 + bash/zsh 自己切的 argv + Chrome escapeStringWin 转写），
// 由 inject-oracle.mjs 机械注入，不手抄。报文断言 = 页面「报文」页的文本与真 curl 发出的字节逐字比对（multipart 的随机 boundary 归一化）。
import { guardHidden, guardControlSize, guardTextTransform, guardOverflow, guardEscape, guardUniqueIds } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const ORACLE = {
 "meta": {
  "tabs": [
   "convert",
   "wire",
   "explain",
   "build",
   "saved",
   "about"
  ],
  "files": {
   "f1.txt": "hello\r\nworld\n",
   "d.json": "{\"b\":[1,2]}",
   "up.txt": "上传内容 OK\n",
   "empty.txt": ""
  },
  "src": "toracle/build.py：本机 curl 8.7.1 原始 TCP 抓包 + bash argv"
 },
 "wire": {
  "hdr": {
   "cmd": "curl http://127.0.0.1:8765/h -H 'X-Foo: bar' -H 'User-Agent: myua' -H 'Accept:' -H 'Empty;' -u 'üser:pa:ss' -b 'a=1' -b 'c=2' -e 'http://ref/;auto' -H 'hOsT:  other.example' --compressed -r 0-99",
   "raw": "GET /h HTTP/1.1\r\nHost:  other.example\r\nAuthorization: Basic w7xzZXI6cGE6c3M=\r\nRange: bytes=0-99\r\nAccept-Encoding: deflate, gzip\r\nReferer: http://ref/\r\nCookie: a=1;c=2\r\nX-Foo: bar\r\nUser-Agent: myua\r\nEmpty:\r\n\r\n",
   "argc": 22
  },
  "get": {
   "cmd": "curl -G 'http://127.0.0.1:8765/g?k=v' -d 'a=%2F' --data-urlencode 'b=c d&e' --data-urlencode '=x y' --data-urlencode 'q=咖啡' -d x",
   "raw": "GET /g?k=v&a=%2f&b=c+d%26e&x+y&q=%e5%92%96%e5%95%a1&x HTTP/1.1\r\nHost: 127.0.0.1:8765\r\nUser-Agent: curl/8.7.1\r\nAccept: */*\r\n\r\n",
   "argc": 12
  },
  "multi": {
   "cmd": "curl http://127.0.0.1:8765/m -F 'name=val' -F 'file=@f1.txt' -F 'j=@d.json;type=application/json;filename=data.json' -F 'x=<f1.txt' --form-string 's=@lit;type=x'",
   "raw": "POST /m HTTP/1.1\r\nHost: 127.0.0.1:8765\r\nUser-Agent: curl/8.7.1\r\nAccept: */*\r\nContent-Length: 688\r\nContent-Type: multipart/form-data; boundary=------------------------BOUNDARY\r\n\r\n--------------------------BOUNDARY\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\nval\r\n--------------------------BOUNDARY\r\nContent-Disposition: form-data; name=\"file\"; filename=\"f1.txt\"\r\nContent-Type: text/plain\r\n\r\nhello\r\nworld\n\r\n--------------------------BOUNDARY\r\nContent-Disposition: form-data; name=\"j\"; filename=\"data.json\"\r\nContent-Type: application/json\r\n\r\n{\"b\":[1,2]}\r\n--------------------------BOUNDARY\r\nContent-Disposition: form-data; name=\"x\"\r\n\r\nhello\r\nworld\n\r\n--------------------------BOUNDARY\r\nContent-Disposition: form-data; name=\"s\"\r\n\r\n@lit;type=x\r\n--------------------------BOUNDARY--\r\n",
   "argc": 11
  },
  "json": {
   "cmd": "curl http://127.0.0.1:8765/j --json '{\"a\":1}' --json @d.json -d 'k=v' -H 'Accept: text/x'",
   "raw": "POST /j HTTP/1.1\r\nHost: 127.0.0.1:8765\r\nUser-Agent: curl/8.7.1\r\nAccept: text/x\r\nContent-Type: application/json\r\nContent-Length: 22\r\n\r\n{\"a\":1}{\"b\":[1,2]}&k=v",
   "argc": 9
  },
  "ansi": {
   "cmd": "curl $'http://127.0.0.1:8765/路径/\\x41?x=中' --data-binary $'line1\\nline2\\t\\u00e9' -H \"X-Q: \\\"q\\\" \\$HOME\" -X 'post'",
   "raw": "post /%e8%b7%af%e5%be%84/A?x=中 HTTP/1.1\r\nHost: 127.0.0.1:8765\r\nUser-Agent: curl/8.7.1\r\nAccept: */*\r\nX-Q: \"q\" $HOME\r\nContent-Length: 14\r\nContent-Type: application/x-www-form-urlencoded\r\n\r\nline1\nline2\té",
   "argc": 7
  },
  "strip": {
   "cmd": "curl http://127.0.0.1:8765/f -d @f1.txt --data-binary @f1.txt --data-raw '@f1.txt'",
   "raw": "POST /f HTTP/1.1\r\nHost: 127.0.0.1:8765\r\nUser-Agent: curl/8.7.1\r\nAccept: */*\r\nContent-Length: 32\r\nContent-Type: application/x-www-form-urlencoded\r\n\r\nhelloworld&hello\r\nworld\n&@f1.txt",
   "argc": 7
  },
  "upload": {
   "cmd": "curl -T up.txt http://127.0.0.1:8765/up/",
   "raw": "PUT /up/up.txt HTTP/1.1\r\nHost: 127.0.0.1:8765\r\nUser-Agent: curl/8.7.1\r\nAccept: */*\r\nContent-Length: 16\r\n\r\n上传内容 OK\n",
   "argc": 3
  },
  "glob_ok": {
   "cmd": "curl -g 'http://127.0.0.1:8765/?a[b]=1&c={d}'",
   "raw": "GET /?a[b]=1&c={d} HTTP/1.1\r\nHost: 127.0.0.1:8765\r\nUser-Agent: curl/8.7.1\r\nAccept: */*\r\n\r\n",
   "argc": 2
  },
  "authbits": {
   "cmd": "curl http://127.0.0.1:8765/auth --oauth2-bearer T0K --basic -u u:p -r 5-9 -d abc",
   "raw": "POST /auth HTTP/1.1\r\nHost: 127.0.0.1:8765\r\nContent-Range: bytes 5-9/3\r\nUser-Agent: curl/8.7.1\r\nAccept: */*\r\nContent-Length: 3\r\nContent-Type: application/x-www-form-urlencoded\r\n\r\nabc",
   "argc": 10
  },
  "bearer_only": {
   "cmd": "curl http://127.0.0.1:8765/auth2 -u u:p --oauth2-bearer T0K",
   "raw": "GET /auth2 HTTP/1.1\r\nHost: 127.0.0.1:8765\r\nAuthorization: Bearer T0K\r\nUser-Agent: curl/8.7.1\r\nAccept: */*\r\n\r\n",
   "argc": 5
  },
  "empty_amp": {
   "cmd": "curl http://127.0.0.1:8765/e -d @empty.txt --data-raw x --data-urlencode 'n@empty.txt' -d y",
   "raw": "POST /e HTTP/1.1\r\nHost: 127.0.0.1:8765\r\nUser-Agent: curl/8.7.1\r\nAccept: */*\r\nContent-Length: 4\r\nContent-Type: application/x-www-form-urlencoded\r\n\r\nx&&y",
   "argc": 9
  },
  "gq": {
   "cmd": "curl -G 'http://127.0.0.1:8765/g6?x=1' -d '' --url-query 'z=1'",
   "raw": "GET /g6?x=1& HTTP/1.1\r\nHost: 127.0.0.1:8765\r\nUser-Agent: curl/8.7.1\r\nAccept: */*\r\n\r\n",
   "argc": 6
  },
  "cmd": {
   "cmd": "curl ^\"http://127.0.0.1:8765/h^\" ^\n  ^\"-H^\" ^\n  ^\"X-Foo: bar^\" ^\n  ^\"-H^\" ^\n  ^\"User-Agent: myua^\" ^\n  ^\"-H^\" ^\n  ^\"Accept:^\" ^\n  ^\"-H^\" ^\n  ^\"Empty;^\" ^\n  ^\"-u^\" ^\n  ^\"^üser:pa:ss^\" ^\n  ^\"-b^\" ^\n  ^\"a=1^\" ^\n  ^\"-b^\" ^\n  ^\"c=2^\" ^\n  ^\"-e^\" ^\n  ^\"http://ref/;auto^\" ^\n  ^\"-H^\" ^\n  ^\"hOsT:  other.example^\" ^\n  ^\"--compressed^\" ^\n  ^\"-r^\" ^\n  ^\"0-99^\"",
   "raw": "GET /h HTTP/1.1\r\nHost:  other.example\r\nAuthorization: Basic w7xzZXI6cGE6c3M=\r\nRange: bytes=0-99\r\nAccept-Encoding: deflate, gzip\r\nReferer: http://ref/\r\nCookie: a=1;c=2\r\nX-Foo: bar\r\nUser-Agent: myua\r\nEmpty:\r\n\r\n",
   "argc": 22
  },
  "ps": {
   "cmd": "curl.exe -X PATCH `\n  -H \"Content-Type: application/json\" `\n  --data-raw '{\"s\":\"it''s\"}' `\n  http://127.0.0.1:8765/ps",
   "raw": "PATCH /ps HTTP/1.1\r\nHost: 127.0.0.1:8765\r\nUser-Agent: curl/8.7.1\r\nAccept: */*\r\nContent-Type: application/json\r\nContent-Length: 12\r\n\r\n{\"s\":\"it's\"}",
   "argc": 6
  },
  "chrome": {
   "cmd": "curl 'http://127.0.0.1:8765/v1/orders?page=2&size=20' \\\n  -H 'accept: application/json, text/plain, */*' \\\n  -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8' \\\n  -H 'authorization: Bearer eyJhbGciOiJIUzI1NiJ9.demo.sig' \\\n  -b 'sid=7f3a9c; theme=dark' \\\n  -H 'content-type: application/json' \\\n  -H 'origin: https://app.example.com' \\\n  -H 'priority: u=1, i' \\\n  -H 'referer: https://app.example.com/orders' \\\n  -H 'sec-ch-ua: \"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"' \\\n  -H 'sec-ch-ua-mobile: ?0' \\\n  -H 'sec-ch-ua-platform: \"macOS\"' \\\n  -H 'sec-fetch-dest: empty' \\\n  -H 'sec-fetch-mode: cors' \\\n  -H 'sec-fetch-site: same-site' \\\n  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' \\\n  --data-raw '{\"customer\":\"张三\",\"items\":[{\"sku\":\"A-1001\",\"qty\":2}],\"coupon\":null,\"express\":true}'\n",
   "raw": "POST /v1/orders?page=2&size=20 HTTP/1.1\r\nHost: 127.0.0.1:8765\r\nCookie: sid=7f3a9c; theme=dark\r\naccept: application/json, text/plain, */*\r\naccept-language: zh-CN,zh;q=0.9,en;q=0.8\r\nauthorization: Bearer eyJhbGciOiJIUzI1NiJ9.demo.sig\r\ncontent-type: application/json\r\norigin: https://app.example.com\r\npriority: u=1, i\r\nreferer: https://app.example.com/orders\r\nsec-ch-ua: \"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"\r\nsec-ch-ua-mobile: ?0\r\nsec-ch-ua-platform: \"macOS\"\r\nsec-fetch-dest: empty\r\nsec-fetch-mode: cors\r\nsec-fetch-site: same-site\r\nuser-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36\r\nContent-Length: 85\r\n\r\n{\"customer\":\"张三\",\"items\":[{\"sku\":\"A-1001\",\"qty\":2}],\"coupon\":null,\"express\":true}",
   "argc": 33
  },
  "chrome_trim": {
   "cmd": "curl 'http://127.0.0.1:8765/v1/orders?page=2&size=20' \\\n  -H 'accept: application/json, text/plain, */*' \\\n  -H 'authorization: Bearer eyJhbGciOiJIUzI1NiJ9.demo.sig' \\\n  -b 'sid=7f3a9c; theme=dark' \\\n  -H 'content-type: application/json' \\\n  -H 'origin: https://app.example.com' \\\n  -H 'referer: https://app.example.com/orders' \\\n  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' \\\n  --data-raw '{\"customer\":\"张三\",\"items\":[{\"sku\":\"A-1001\",\"qty\":2}],\"coupon\":null,\"express\":true}'\n",
   "raw": "POST /v1/orders?page=2&size=20 HTTP/1.1\r\nHost: 127.0.0.1:8765\r\nCookie: sid=7f3a9c; theme=dark\r\naccept: application/json, text/plain, */*\r\nauthorization: Bearer eyJhbGciOiJIUzI1NiJ9.demo.sig\r\ncontent-type: application/json\r\norigin: https://app.example.com\r\nreferer: https://app.example.com/orders\r\nuser-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36\r\nContent-Length: 85\r\n\r\n{\"customer\":\"张三\",\"items\":[{\"sku\":\"A-1001\",\"qty\":2}],\"coupon\":null,\"express\":true}",
   "dropped": 8
  }
 },
 "err": {
  "conflict": {
   "cmd": "curl http://127.0.0.1:8765/x -d a -F b=1",
   "rc": 2,
   "sent": false
  },
  "glob": {
   "cmd": "curl 'http://127.0.0.1:8765/?a[b]=1'",
   "rc": 3,
   "sent": false
  },
  "space": {
   "cmd": "curl 'http://127.0.0.1:8765/a b'",
   "rc": 3,
   "sent": false
  },
  "unknown": {
   "cmd": "curl --compress http://127.0.0.1:8765/",
   "rc": 2,
   "sent": false
  }
 },
 "chrome_example_argc": 33,
 "chrome_example_h": 14,
 "builder": {
  "cmd": "curl 'http://127.0.0.1:8765/b?q=%E5%92%96%E5%95%A1+%26+%E8%8C%B6&n=1' \\\n  -H 'X-Trace: t1' \\\n  --oauth2-bearer tok \\\n  --json '{\"a\":1}' \\\n  --compressed\n",
  "raw": "POST /b?q=%E5%92%96%E5%95%A1+%26+%E8%8C%B6&n=1 HTTP/1.1\r\nHost: 127.0.0.1:8765\r\nAuthorization: Bearer tok\r\nUser-Agent: curl/8.7.1\r\nAccept-Encoding: deflate, gzip\r\nX-Trace: t1\r\nContent-Type: application/json\r\nAccept: application/json\r\nContent-Length: 7\r\n\r\n{\"a\":1}"
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  page.setDefaultTimeout(20000)
  const T = ORACLE.meta.tabs
  const W = ORACLE.wire
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'domcontentloaded' })
  const settle = () => page.waitForFunction(() => document.getElementById('cu-code').getAttribute('data-key') === window.cuStateKey(), null, { timeout: 10000 })
  const onTab = async (t) => { await page.click('#cu-tab-' + t); await page.waitForFunction((k) => !document.getElementById('cu-pane-' + k).hidden, t) }
  const setInput = async (text) => { await onTab('convert'); await page.fill('#cu-input', text); await settle() }
  const norm = (s) => s.replace(/\r\n/g, '\n').replace(/-{24}[A-Za-z0-9]{22}/g, '------------------------BOUNDARY')
  const wireText = async () => norm(await page.$eval('#cu-wire-raw', (e) => e.textContent))
  const setFiles = async () => {
    await onTab('wire')
    const names = await page.$$eval('#cu-files .cu-file code', (ns) => ns.map((n) => n.textContent))
    for (let i = 0; i < names.length; i++) {
      const content = ORACLE.meta.files[names[i]]
      assert(content !== undefined, `报文页列出的引用文件 ${names[i]} 应在夹具里`)
      // 走「选择文件…」：按原始字节读入（textarea 会把 \r\n 规范成 \n，夹具里的 CRLF 就是为了测这个）
      await page.setInputFiles('#cu-file-pick-' + i, { name: names[i], mimeType: 'application/octet-stream', buffer: Buffer.from(content, 'utf8') })
      // 等文件真的读进来：大小徽标变成实际字节数（空文件时文本框本来就是空的，不能拿它当信号）
      await page.waitForFunction(([id, want]) => document.getElementById(id).textContent === want, ['cu-file-size-' + i, Buffer.byteLength(content, 'utf8') + ' B'])
      assert((await page.inputValue('#cu-file-ta-' + i)) === content.replace(/\r\n/g, '\n'), `文件 ${names[i]} 的内容显示在文本框里`)
      await settle()
    }
    return names
  }
  const code = () => page.$eval('#cu-code', (e) => e.textContent)
  const msgs = (lv) => page.$$eval('#cu-msgs li.cu-lv-' + lv, (ns) => ns.map((n) => n.textContent))
  await settle()

  // —— 1. 默认示例：Chrome「复制为 cURL」 → Python requests ——
  let c = await code()
  assert(/^import requests/.test(c), '默认生成 Python requests 代码')
  assert(c.includes("requests.post('https://api.example.com/v1/orders?page=2&size=20'"), 'POST 到示例 URL')
  assert(c.includes('json_data = {') && c.includes("'customer': '张三'"), 'JSON 体按对象字面量生成且保留中文')
  assert((await page.locator('.cu-lang').count()) === 8, '8 个目标语言按钮')

  // —— 2. 报文逐字节：与本机 curl 8.7.1 抓到的字节对拍 ——
  for (const k of ['hdr', 'get', 'multi', 'json', 'ansi', 'strip', 'upload', 'glob_ok', 'authbits', 'bearer_only', 'empty_amp', 'gq', 'cmd', 'ps', 'chrome']) {
    await setInput(W[k].cmd)
    const names = await setFiles()
    const got = await wireText()
    assert(got === norm(W[k].raw), `报文 ${k} 与真 curl 逐字节一致（引用文件 ${names.join(',') || '无'}）\n--- 页面\n${got}\n--- curl\n${norm(W[k].raw)}`)
  }
  await setInput(W.cmd.cmd)
  assert((await page.textContent('#cu-kind')).includes('Windows cmd'), 'Chrome cmd 转义被识别为 Windows cmd')
  await setInput(W.ps.cmd)
  assert((await page.textContent('#cu-kind')).includes('PowerShell'), 'curl.exe + 反引号续行被识别为 PowerShell')

  // —— 3. 精简浏览器自带头：与「手工删掉噪声头后再交给 curl」的抓包一致 ——
  await setInput(W.chrome.cmd)
  await page.check('#cu-opt-trim'); await settle()
  await onTab('wire')
  assert(await wireText() === norm(W.chrome_trim.raw), '精简后的报文 = 删掉 ' + W.chrome_trim.dropped + ' 个噪声头后真 curl 发出的字节')
  await onTab('convert')
  await page.click('#cu-lang-curl'); await settle()
  const hLines = (await code()).split('\n').filter((l) => /^\s*-H /.test(l)).length
  assert(hLines === ORACLE.chrome_example_h - W.chrome_trim.dropped, `规范化 curl 剩 ${ORACLE.chrome_example_h - W.chrome_trim.dropped} 个 -H（实得 ${hLines}）`)
  assert((await page.$$eval('#cu-diff li', (ns) => ns.map((n) => n.textContent).join('|'))).includes('已精简 ' + W.chrome_trim.dropped), '提示里写明精简了几个头')
  await page.uncheck('#cu-opt-trim'); await settle()

  // —— 4. curl 会报错的命令：页面同样报错、不出报文 ——
  for (const k of ['conflict', 'glob', 'space', 'unknown']) {
    const e = ORACLE.err[k]
    assert(e.rc !== 0 && !e.sent, `夹具 ${k}：真 curl 退出码 ${e.rc}、没有发出请求`)
    await setInput(e.cmd)
    const errs = await msgs('error')
    assert(errs.length >= 1, `${k}：页面给出错误提示`)
    if (k === 'glob') assert(errs.join('').includes('-g'), '方括号通配错误提示加 -g')
    if (k === 'conflict') assert(errs.join('').includes('You can only select one HTTP request method'), '-d 与 -F 冲突的提示与 curl 原文一致')
    assert((await page.textContent('#cu-reqcount')).startsWith('0 '), `${k}：请求数为 0`)
  }

  // —— 5. 各语言：切换后代码与标记 ——
  await page.selectOption('#cu-example', '0'); await settle()
  const MARK = { python: /^import requests/, httpx: /^import httpx/, fetch: /await fetch\('https:\/\/api\.example\.com/, axios: /^import axios from 'axios';/, go: /^package main[\s\S]*http\.NewRequest\("POST"/, ruby: /^require 'net\/http'[\s\S]*Net::HTTP::Post\.new/, curl: /^curl 'https:\/\/api\.example\.com\/v1\/orders\?page=2&size=20'/, http: /^POST \/v1\/orders\?page=2&size=20 HTTP\/1\.1\nHost: api\.example\.com\n/ }
  for (const [lang, re] of Object.entries(MARK)) {
    await page.click('#cu-lang-' + lang); await settle()
    assert(re.test(await code()), `${lang} 代码含预期标记 ${re}`)
    assert((await page.getAttribute('#cu-lang-' + lang, 'aria-pressed')) === 'true', `${lang} 按钮 aria-pressed`)
  }
  await page.click('#cu-lang-python'); await settle()
  await page.uncheck('#cu-opt-json'); await settle()
  assert(/data = '\{"customer":"张三".*'\.encode\(\)/.test(await code()), '关闭对象字面量后按原始字节发送（非 ASCII 用 .encode()）')
  await page.check('#cu-opt-json'); await settle()

  // —— 6. 解读：词元数 = bash 切出的 argv 结构；点词元高亮对应行 ——
  await onTab('explain')
  const rows = await page.locator('#cu-ex-tbl tbody tr').count()
  assert(rows === 2 + (ORACLE.chrome_example_argc - 1) / 2, `解读表 ${rows} 行 = 程序名 + URL + ${(ORACLE.chrome_example_argc - 1) / 2} 个选项`)
  const tok = page.locator('#cu-tokens .cu-tok', { hasText: '--data-raw' })
  await tok.click()
  const onRow = await page.$eval('#cu-ex-tbl tr.cu-on', (e) => e.textContent)
  assert(onRow.includes('--data-raw') && onRow.includes('同 -d'), '点 --data-raw 高亮其解释行')
  await page.focus('#cu-tokens .cu-tok >> nth=1'); await page.keyboard.press('Enter')
  assert((await page.$eval('#cu-ex-tbl tr.cu-on', (e) => e.textContent)).includes('URL'), '键盘回车也能选中词元（URL）')

  // —— 7. 构建器：点出来的 curl 与真 curl 抓包 ——
  await onTab('build')
  await page.click('#cu-b-reset')
  await page.selectOption('#cu-b-method', 'POST')
  await page.fill('#cu-b-url', 'http://127.0.0.1:8765/b')
  const qIn = page.locator('#cu-b-query input')
  await qIn.nth(0).fill('q'); await qIn.nth(1).fill('咖啡 & 茶')
  await page.click('#cu-b-addq')
  await page.locator('#cu-b-query input').nth(2).fill('n'); await page.locator('#cu-b-query input').nth(3).fill('1')
  const hIn = page.locator('#cu-b-headers input')
  await hIn.nth(0).fill('X-Trace'); await hIn.nth(1).fill('t1')
  await page.click('#cu-b-auth button[data-v="bearer"]'); await page.fill('#cu-b-token', 'tok')
  await page.click('#cu-b-body button[data-v="json"]'); await page.fill('#cu-b-text', '{"a":1}')
  await page.check('#cu-b-comp')
  const built = await page.$eval('#cu-b-out', (e) => e.textContent)
  assert(built === ORACLE.builder.cmd, `构建器输出的 curl 与夹具一致\n${built}`)
  assert((await page.textContent('#cu-b-json-err')).includes('JSON 合法'), 'JSON 体即时校验')
  await page.click('#cu-b-send'); await settle()
  assert((await page.inputValue('#cu-input')) === ORACLE.builder.cmd, '送去转换后输入框就是构建出的命令')
  await onTab('wire')
  assert(await wireText() === norm(ORACLE.builder.raw), '构建出的请求与真 curl 发出的字节一致（查询串编码、Bearer、--json、--compressed）')
  await onTab('build')
  await page.click('#cu-b-load')
  assert((await page.inputValue('#cu-b-url')) === 'http://127.0.0.1:8765/b' && (await page.locator('#cu-b-query .cu-kv-row').count()) === 2, '「载入当前命令」把查询串拆回两行参数')

  // —— 8. 导入：原始 HTTP / HAR / fetch（期望值直接从示例原文里读） ——
  const ex = await page.$$eval('#cu-example option', (os) => os.map((o) => o.textContent))
  const exIdx = (name) => String(ex.indexOf(name) - 1)
  await onTab('convert')
  await page.selectOption('#cu-example', exIdx('原始 HTTP 报文')); await settle()
  const rawEx = await page.inputValue('#cu-input')
  assert((await page.textContent('#cu-kind')).includes('原始 HTTP'), '识别为原始 HTTP')
  await onTab('wire')
  const w1 = await wireText()
  assert(w1.startsWith(rawEx.split('\n')[0] + '\nHost: api.example.com\n'), '原始 HTTP 的请求行与 Host 原样还原')
  assert(w1.includes('Idempotency-Key: 6f1c2a7e') && w1.endsWith(rawEx.split('\n\n')[1].replace(/\n$/, '')), '自定义头与请求体原样还原')
  await page.selectOption('#cu-example', exIdx('HAR 片段（DevTools 导出）')).catch(() => {})
  await onTab('convert')
  await page.selectOption('#cu-example', exIdx('HAR 片段（DevTools 导出）')); await settle()
  assert(await page.isVisible('#cu-har-pick') && (await page.locator('#cu-har-pick option').count()) === 2, 'HAR 的两个请求可选')
  await page.selectOption('#cu-har-pick', '1'); await settle()
  await onTab('wire')
  assert((await wireText()).startsWith('POST /v1/events HTTP/1.1'), 'HAR 选第二个请求 → POST /v1/events')
  await onTab('convert')
  await page.selectOption('#cu-example', exIdx('Chrome「复制为 fetch」')); await settle()
  await onTab('wire')
  const fw = await wireText()
  assert(fw.startsWith('PUT /v1/cart HTTP/1.1') && fw.includes('referer: https://shop.example.com/') && fw.endsWith('{"sku":"A-1001","qty":1}'), 'fetch 导入：方法、referrer、body 都还原')

  // —— 9. 环境变量 / 收藏 / 历史 / 持久化 ——
  await onTab('saved')
  const vIn = page.locator('#cu-vars input')
  assert((await vIn.nth(0).inputValue()) === 'TOKEN', '默认有 TOKEN 变量')
  await vIn.nth(1).fill('abc123')
  await setInput('curl http://127.0.0.1:8765/v -H "Authorization: Bearer $TOKEN" -H \'X-K: {{API_KEY}}\'')
  await onTab('wire')
  const vw = await wireText()
  assert(vw.includes('Authorization: Bearer abc123'), '$TOKEN 按环境变量替换')
  assert(vw.includes('X-K: {{API_KEY}}') && (await msgs('warn')).join('').includes('{{API_KEY}}'), '空值变量保留原文并提示')
  await onTab('convert')
  await page.click('#cu-save-btn')
  await page.waitForFunction(() => document.querySelectorAll('#cu-saved-list .cu-item').length === 1)
  await page.waitForFunction(() => document.querySelectorAll('#cu-hist-list .cu-item').length >= 1, null, { timeout: 8000 })
  await page.fill('#cu-input', 'curl https://persist.example.com/x')
  await page.reload({ waitUntil: 'domcontentloaded' }); await settle()
  assert((await page.inputValue('#cu-input')) === 'curl https://persist.example.com/x', '输入后立刻刷新：防抖中的输入靠 pagehide 落盘')
  assert((await page.locator('#cu-saved-list .cu-item').count()) === 1, '刷新后收藏仍在')
  assert((await page.locator('#cu-vars input').nth(1).inputValue()) === 'abc123', '刷新后环境变量仍在')
  await onTab('saved')
  await page.click('#cu-saved-list .cu-item button:has-text("载入")'); await settle()
  assert((await page.inputValue('#cu-input')).includes('$TOKEN') && !(await page.isHidden('#cu-pane-convert')), '载入收藏回到转换页')

  // —— 10. 能力清单：说明页列出的每个选项，解析器都认识 ——
  await onTab('about')
  const listed = await page.$$eval('#cu-optgrid [data-opt]', (ns) => ns.map((n) => n.dataset.opt))
  assert(listed.length >= 120, `说明页列出 ${listed.length} 个选项`)
  const dead = await page.evaluate((names) => names.filter((n) => {
    const o = CL.OPTS[n]
    const r = CL.parse('curl --' + n + (o && o.arg ? ' 1' : '') + ' http://h/')
    const s = o && o.short ? CL.parse('curl -' + o.short + (o.arg ? ' 1' : '') + ' http://h/') : { errors: [] }
    return !o || r.errors.some((e) => /未知/.test(e)) || s.errors.some((e) => /未知/.test(e))
  }), listed)
  assert(dead.length === 0, '说明页列出的选项全部能被解析（长短两种写法）：' + dead.join(','))

  // —— 11. 复制 ——
  await onTab('convert')
  await page.click('#cu-copy')
  await page.waitForFunction(() => !document.getElementById('cu-toast').hidden)
  assert((await page.textContent('#cu-toast')).includes('已复制'), '复制后提示')

  // —— 12. 渲染守卫 ——
  const paneSel = (t) => '#cu-pane-' + t
  await guardHidden(page, { assert, panesRoot: '#cu-panes', tabs: T })
  await guardUniqueIds(page, { assert, minIds: 60 })
  const n = await guardControlSize(page, { assert, tabs: T, onTab, paneSel, minControls: 40 })
  assert(n >= 40, `逐页签扫到 ${n} 个可见控件`)
  await guardTextTransform(page, { assert, tabs: T, onTab, paneSel })
  await guardOverflow(page, { assert, tabs: T, onTab, panesRoot: '#cu-panes', viewports: [390, 768, 1280] })
  await onTab('wire')
  await guardEscape(page, { assert, cardSel: '.cu-card', childSel: 'table,h2,p,pre' })
  const toastDisp = await page.$eval('#cu-toast', (e) => getComputedStyle(e).display)
  await page.waitForFunction(() => getComputedStyle(document.getElementById('cu-toast')).display === 'none', null, { timeout: 5000 })
  assert(['none', 'block'].includes(toastDisp), 'toast 隐藏时计算样式为 none')

  // —— 缩略图：Chrome 示例 → Python ——
  await onTab('convert')
  await page.selectOption('#cu-example', '0'); await settle()
  await page.click('#cu-lang-python'); await settle()
  await page.setViewportSize({ width: 1280, height: 850 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await screenshot('thumb.png')
}
