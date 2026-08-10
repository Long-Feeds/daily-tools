// 密码学实验室 · Crypto Lab —— 真实浏览器集成测试
// 断言真实密码学输出（FIPS-197 / RFC 2202 / RFC 7914 已知答案）而不是元素存在性。
export default async ({ page, toolURL, screenshot, assert }) => {
  await page.goto(toolURL);
  await page.waitForFunction(() => document.body.dataset.ready === '1');

  const txt = async (sel) => (await page.textContent(sel)).trim();
  const val = async (sel) => page.inputValue(sel);
  const digestOf = (alg) => `#cl-dg-body .cl-digest[data-alg="${alg}"]`;
  // 输入并等 DOM 收敛（全程不用定时读）
  const fill = async (sel, v) => { await page.fill(sel, v); };
  const settle = async (sel, want) => page.waitForFunction(
    ([s, w]) => { const el = document.querySelector(s); return el && el.textContent.trim() === w; }, [sel, want], { timeout: 10000 });
  // 面板助手：隐藏面板里的控件对 fill/check 是不可见的（会卡满超时），先切面板再操作
  const onPanel = async (name, fn) => {
    await page.click(`#cl-tab-${name}`);
    await page.waitForFunction((n) => !document.getElementById('cl-panel-' + n).hidden, name);
    return fn();
  };

  /* ═════ 面板 1：摘要与校验 ═════ */
  assert(await page.isVisible('a[href="../../"]'), '顶部有返回工具集链接');

  await settle(digestOf('sha256'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  assert(await txt(digestOf('md5')) === '900150983cd24fb0d6963f7d28e17f72', 'MD5("abc") 正确');
  assert(await txt(digestOf('sha1')) === 'a9993e364706816aba3e25717850c26c9cd0d89d', 'SHA-1("abc") 正确');
  assert(await txt(digestOf('sha512')) === 'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f', 'SHA-512("abc") 正确');
  assert(await txt(digestOf('crc32')) === '352441c2', 'CRC32("abc") 正确');

  // 与浏览器原生 WebCrypto 的逐字节自检
  await page.waitForFunction(() => document.body.dataset.selfcheck === 'ok');
  assert((await txt('#cl-dg-selfcheck')).includes('自检通过'), 'WebCrypto 自检通过');

  // 空输入 → 空串摘要
  await fill('#cl-dg-input', '');
  await settle(digestOf('sha256'), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  assert(await txt(digestOf('crc32')) === '00000000', '空输入 CRC32 = 0');

  // 十六进制输入应与等价文本得到同一摘要
  await page.selectOption('#cl-dg-kind', 'hex');
  await fill('#cl-dg-input', '616263');
  await settle(digestOf('sha256'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  assert((await txt('#cl-dg-src')).includes('3 字节'), 'hex 输入被解析成 3 字节');

  // 非法 hex 必须报错而不是静默出错值
  await fill('#cl-dg-input', '61626');
  await page.waitForFunction(() => document.getElementById('cl-dg-src').textContent.includes('无法解析'));
  assert((await page.$$('#cl-dg-body tr')).length === 0, '输入非法时不显示任何摘要');

  // Base64 输出
  await page.selectOption('#cl-dg-kind', 'text');
  await fill('#cl-dg-input', 'abc');
  await page.selectOption('#cl-dg-fmt', 'b64');
  await settle(digestOf('sha256'), 'ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0=');
  await page.selectOption('#cl-dg-fmt', 'HEX');
  await settle(digestOf('sha256'), 'BA7816BF8F01CFEA414140DE5DAE2223B00361A396177A9CB410FF61F20015AD');
  await page.selectOption('#cl-dg-fmt', 'hex');
  await settle(digestOf('sha256'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');

  // 校验和比对：匹配 / 不匹配 / 非法
  await fill('#cl-dg-expect', 'BA7816BF 8F01CFEA 414140DE 5DAE2223 B00361A3 96177A9C B410FF61 F20015AD');
  await page.waitForFunction(() => document.getElementById('cl-dg-verdict').textContent.includes('匹配'));
  assert(await txt('#cl-dg-verdict') === 'SHA-256 匹配', '大小写与空格无关地识别出 SHA-256 匹配');
  assert(await page.getAttribute('#cl-dg-verdict', 'class') === 'cl-tag cl-tag-ok', '匹配用成功色');
  await fill('#cl-dg-expect', 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ae');
  await settle('#cl-dg-verdict', 'SHA-256 不匹配');
  assert(await page.getAttribute('#cl-dg-verdict', 'class') === 'cl-tag cl-tag-bad', '一位之差即判不匹配');
  await fill('#cl-dg-expect', '900150983cd24fb0d6963f7d28e17f72');
  await settle('#cl-dg-verdict', 'MD5 匹配');
  await fill('#cl-dg-expect', 'nothex');
  await settle('#cl-dg-verdict', '不是十六进制');
  await fill('#cl-dg-expect', '');

  // 字节视图
  const dump = await txt('#cl-dg-dump');
  assert(dump.includes('61 62 63'), '字节视图列出 61 62 63');
  assert(dump.includes('abc'), '字节视图右侧给出可打印字符');
  assert((await txt('#cl-dg-dumpnote')).includes('共 3 字节'), '字节数正确');

  // 片段库落盘 + 重载后仍在
  await page.click('#cl-dg-clip');
  await page.waitForFunction(() => document.querySelectorAll('#cl-clips .cl-clip').length === 1);
  await page.reload();
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  assert((await page.$$('#cl-clips .cl-clip')).length === 1, '刷新后片段仍在 localStorage 里');
  assert(await val('#cl-dg-input') === 'abc', '刷新后输入被恢复');

  /* ═════ 面板 2：HMAC / PBKDF2 / JWT ═════ */
  await onPanel('mac', async () => {
    assert(await page.evaluate(() => getComputedStyle(document.getElementById('cl-panel-digest')).display) === 'none',
      '切走后上一个面板真的不可见（断计算样式而不是 hidden 属性）');

    // RFC 2202 / RFC 4231 用例 1：key = 0x0b×20
    await page.selectOption('#cl-mac-keykind', 'hex');
    await fill('#cl-mac-key', '0b'.repeat(20));
    await fill('#cl-mac-msg', 'Hi There');
    await settle('#cl-mac-out', 'b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7');
    await page.selectOption('#cl-mac-alg', 'sha1');
    await settle('#cl-mac-out', 'b617318655057264e28bc0b6fb378c8ef146be00');
    await page.selectOption('#cl-mac-alg', 'sha512');
    await settle('#cl-mac-out', '87aa7cdea5ef619d4ff0b4241a1d6cb02379f4e2ce4ec2787ad0b30545e17cdedaa833b7d6b8a702038b274eaea3f4e4be9d914eeb61f1702e696c203a126854');

    // 超长密钥：先摘要再补零（RFC 4231 用例 6）
    await page.selectOption('#cl-mac-alg', 'sha256');
    await fill('#cl-mac-key', 'aa'.repeat(131));
    await fill('#cl-mac-msg', 'Test Using Larger Than Block-Size Key - Hash Key First');
    await settle('#cl-mac-out', '60e431591ee0b67f0d8a26aacbf5b77f8e0bc6213728c5140546040f0ee37f54');
    assert((await txt('#cl-mac-keynote')).includes('先摘要'), '超长密钥被说明为先摘要再补零');

    // 文本密钥 + Base64 输出自洽
    await page.selectOption('#cl-mac-keykind', 'text');
    await fill('#cl-mac-key', 'secret-key');
    await fill('#cl-mac-msg', 'message body');
    await settle('#cl-mac-out', '3c203ce9a8a995a20f3615e3b1e43f91d78a3ebb88c4546e99d0b5605cdb96ff');
    const b64 = await txt('#cl-mac-b64');
    const hexFromB64 = Buffer.from(b64, 'base64').toString('hex');
    assert(hexFromB64 === '3c203ce9a8a995a20f3615e3b1e43f91d78a3ebb88c4546e99d0b5605cdb96ff', 'Base64 输出解码后等于十六进制输出');

    // PBKDF2 已知答案
    await fill('#cl-kdf-pw', 'password');
    await fill('#cl-kdf-salt', 'salt');
    await fill('#cl-kdf-iter', '4096');
    await fill('#cl-kdf-len', '32');
    await page.click('#cl-kdf-run');
    await settle('#cl-kdf-out', 'c5e478d59288c841aa530db6845c4c8d962893a001ce4e11a4963873aa98134a');
    assert(/\d+\.\d ms/.test(await txt('#cl-kdf-time')), '给出本机实测耗时');
    assert((await txt('#cl-kdf-time')).includes('4,096'), '耗时行标注了迭代次数');
    await fill('#cl-kdf-iter', '1');
    await page.click('#cl-kdf-run');
    await settle('#cl-kdf-out', '120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b');
    await fill('#cl-kdf-len', '64');
    await page.click('#cl-kdf-run');
    await page.waitForFunction(() => document.getElementById('cl-kdf-out').textContent.length === 128);
    assert((await txt('#cl-kdf-out')).startsWith('120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b'),
      '派生 64 字节时前 32 字节与 32 字节口径一致（跨输出块拼接正确）');

    // JWT
    await settle('#cl-jwt-verdict', '签名有效');
    assert((await txt('#cl-jwt-payload')).includes('"name":"daily-tools"'), 'payload 被解出');
    assert((await txt('#cl-jwt-header')).includes('HS256'), 'header 被解出');
    const claims = await page.textContent('#cl-jwt-claims');
    assert(claims.includes('过期时间') && claims.includes('未过期'), '过期时间被翻译成人读日期并判定未过期');
    assert(claims.includes('2025-06-15'), 'iat 被换算成 UTC 日期');
    await fill('#cl-jwt-key', 'wrong-secret');
    await settle('#cl-jwt-verdict', '签名不匹配');
    await fill('#cl-jwt-key', 'daily-tools-secret');
    await settle('#cl-jwt-verdict', '签名有效');
    await fill('#cl-jwt-token', 'not.a.jwt');
    await settle('#cl-jwt-verdict', '解析失败');
  });

  /* ═════ 面板 3：SHA-256 剖面 ═════ */
  await onPanel('sha', async () => {
    await fill('#cl-sha-input', 'abc');
    await page.waitForFunction(() => document.getElementById('cl-sha-padnote').textContent.includes('3 字节'));
    const padNote = await txt('#cl-sha-padnote');
    assert(padNote.includes('64 字节') && padNote.includes('1 个分组'), '3 字节消息补成 1 个 64 字节分组');
    assert(padNote.includes('比特长度 24'), '末 8 字节写入比特长度 24');
    const padHtml = await page.innerHTML('#cl-sha-pad');
    assert(padHtml.includes('cl-b-one">80<'), '分隔位 0x80 被单独着色');

    const w0 = await txt('.cl-wgrid#cl-sha-w .cl-wcell:first-child span');
    assert(w0 === '61626380', 'W0 = 61626380（"abc" + 0x80）');
    assert((await page.$$('#cl-sha-w .cl-wcell')).length === 64, '消息扩展给出 64 个字');
    const w16 = await page.textContent('#cl-sha-w .cl-wcell:nth-child(17) span');
    assert(w16 === '61626380', 'W16 由递推式算出（此例恰好也是 61626380）');

    // 第 0 轮的中间量
    const detail0 = await page.textContent('#cl-sha-detail');
    assert(detail0.includes('428a2f98'), '第 0 轮用 K[0] = 428a2f98');
    assert(detail0.includes('54da50e8'), '第 0 轮 T1 = 54da50e8');
    assert(detail0.includes('5d6aebcd'), '第 0 轮新 a = 5d6aebcd');

    // 最后一轮 + 与最终摘要的加法自洽：H0 = IV0 + a63
    await page.fill('#cl-sha-round', '63');
    await page.dispatchEvent('#cl-sha-round', 'input');
    await settle('#cl-sha-rlabel', '63');
    const detail63 = await page.textContent('#cl-sha-detail');
    assert(detail63.includes('c67178f2'), '第 63 轮用 K[63] = c67178f2');
    assert(detail63.includes('506e3058'), '第 63 轮 a = 506e3058');
    const sum = ((0x6a09e667 + 0x506e3058) >>> 0).toString(16);
    assert(sum === 'ba7816bf', '最终摘要首字 = 初值 + 末轮 a（0x6a09e667 + 0x506e3058 = 0xba7816bf）');
    assert((await page.$$('#cl-sha-rbody tr')).length === 64, '轮表 64 行');

    // 播放键真的推进轮次
    await page.fill('#cl-sha-round', '0');
    await page.dispatchEvent('#cl-sha-round', 'input');
    await page.click('#cl-sha-play');
    await page.waitForFunction(() => Number(document.getElementById('cl-sha-rlabel').textContent) >= 3);
    await page.click('#cl-sha-play');
    assert(await txt('#cl-sha-play') === '播放', '再点一次回到暂停态');

    // 雪崩：改 1 位，输出约半数位翻转
    await page.waitForFunction(() => document.getElementById('cl-av-grid').dataset.flipped !== undefined);
    const grid = await page.getAttribute('#cl-av-grid', 'data-flipped');
    assert(Number(grid) === 128, 'SHA-256 对 "abc" 翻第 0 位后恰好 128/256 位不同');
    assert((await txt('#cl-av-dist')).includes('128 / 256'), '汉明距离读数与图一致');
    assert(Number(await page.getAttribute('#cl-av-grid', 'data-dropped')) === 0, '位差异图没有标签因碰撞被丢弃');
    assert(Number(await page.getAttribute('#cl-av-grid', 'data-rowlabels')) === 8, '位差异图画出 8 个行号标签');
    assert(await page.getAttribute('#cl-av-grid', 'data-legend') === '1', '位差异图图例画出来了');
    assert(Number(await page.getAttribute('#cl-av-hist', 'data-notes')) === 2, '直方图两个标注都画出来了（不是只统计掉了几个）');
    assert(Number(await page.getAttribute('#cl-av-hist', 'data-ticks')) === 5, '直方图 5 个刻度标签都画出来了');
    assert(Number(await page.getAttribute('#cl-av-hist', 'data-dropped')) === 0, '直方图没有标签碰撞');
    const stat = await txt('#cl-av-stat');
    assert(/平均 1\d\d\.\d 位翻转/.test(stat), `全量统计的平均翻转位数落在 100~199（实得：${stat}）`);
    assert(stat.includes('理想值 128'), '给出理想值 128');

    // 换算法后总位数跟着变
    await page.selectOption('#cl-av-alg', 'md5');
    await page.waitForFunction(() => document.getElementById('cl-av-dist').textContent.includes('/ 128'));
    assert((await txt('#cl-av-stat')).includes('理想值 64'), 'MD5 的理想翻转位数是 64');
    await page.selectOption('#cl-av-alg', 'sha256');
    await page.waitForFunction(() => document.getElementById('cl-av-dist').textContent.includes('/ 256'));

    // 画布不因重绘而膨胀（height 属性被 dpr 改写过一次）
    const h1 = await page.evaluate(() => document.getElementById('cl-av-grid').height);
    await page.selectOption('#cl-av-alg', 'sha1');
    await page.selectOption('#cl-av-alg', 'sha256');
    const h2 = await page.evaluate(() => document.getElementById('cl-av-grid').height);
    assert(h1 === h2, `重绘后画布像素高不变（${h1} → ${h2}）`);
  });

  /* ═════ 面板 4：AES ═════ */
  await onPanel('aes', async () => {
    // FIPS-197 附录 C 已知答案
    await settle('#cl-aes-ct', '69c4e0d86a7b0430d8cdb78070b4c55a');
    assert(await txt('#cl-aes-back') === '00112233445566778899aabbccddeeff', 'AES-128 解密回到原明文');
    assert((await txt('#cl-aes-nr')).includes('10 轮'), 'AES-128 是 10 轮');

    await fill('#cl-aes-key', '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f');
    await settle('#cl-aes-ct', '8ea2b7ca516745bfeafc49904b496089');
    assert((await txt('#cl-aes-nr')).includes('14 轮'), 'AES-256 是 14 轮');
    await fill('#cl-aes-key', '000102030405060708090a0b0c0d0e0f1011121314151617');
    await settle('#cl-aes-ct', 'dda97ca4864cdfe06eaf70a0ec0d7191');
    // 非法长度必须明确报错
    await fill('#cl-aes-key', '0011');
    await page.waitForFunction(() => document.getElementById('cl-aes-ct').textContent.includes('16 / 24 / 32'));
    await fill('#cl-aes-key', '000102030405060708090a0b0c0d0e0f');
    await settle('#cl-aes-ct', '69c4e0d86a7b0430d8cdb78070b4c55a');
    await fill('#cl-aes-pt', '00112233');
    await page.waitForFunction(() => document.getElementById('cl-aes-ct').textContent.includes('必须恰好 16 字节'));
    await fill('#cl-aes-pt', '00112233445566778899aabbccddeeff');
    await settle('#cl-aes-ct', '69c4e0d86a7b0430d8cdb78070b4c55a');

    // 密钥扩展（FIPS-197 附录 A 的 w[4] / w[43]）
    await fill('#cl-aes-key', '2b7e151628aed2a6abf7158809cf4f3c');
    await page.waitForFunction(() => document.querySelectorAll('#cl-aes-ks .cl-wcell').length === 44);
    const w4 = await page.textContent('#cl-aes-ks .cl-wcell:nth-child(5) span');
    const w43 = await page.textContent('#cl-aes-ks .cl-wcell:nth-child(44) span');
    assert(w4 === 'a0fafe17', '密钥扩展 w[4] = a0fafe17');
    assert(w43 === 'b6630ca6', '密钥扩展 w[43] = b6630ca6');

    // 轮步骤：末轮没有 MixColumns
    await page.fill('#cl-aes-round', '1');
    await page.dispatchEvent('#cl-aes-round', 'input');
    await page.waitForFunction(() => document.querySelectorAll('#cl-aes-states figure').length === 4);
    const names1 = await page.$$eval('#cl-aes-states figcaption', (n) => n.map((x) => x.textContent));
    assert(names1.join(',') === 'SubBytes,ShiftRows,MixColumns,AddRoundKey', '第 1 轮四个步骤齐全');
    await page.fill('#cl-aes-round', '10');
    await page.dispatchEvent('#cl-aes-round', 'input');
    await page.waitForFunction(() => document.querySelectorAll('#cl-aes-states figure').length === 3);
    const names10 = await page.$$eval('#cl-aes-states figcaption', (n) => n.map((x) => x.textContent));
    assert(!names10.includes('MixColumns'), '末轮没有 MixColumns（AES 规范如此）');
    // 末轮 AddRoundKey 后的状态必须等于密文
    const finalState = await page.$$eval('#cl-aes-states figure:last-child .cl-state span', (n) => n.map((x) => x.textContent));
    const colMajor = [];
    for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) colMajor.push(finalState[r * 4 + c]);
    assert(colMajor.join('') === await txt('#cl-aes-ct'), '末轮状态按列读出恰好是密文');

    // S 盒是推导出来的
    await page.click('#cl-aes-sbox .cl-cell[data-a="83"]');   // 0x53
    await page.waitForFunction(() => document.getElementById('cl-aes-derive').textContent.includes('0x53'));
    const derive = await page.textContent('#cl-aes-derive');
    assert(derive.includes('0xca'), '0x53 的 GF(2⁸) 逆元是 0xca');
    assert(derive.includes('= 0x01'), '逆元校验 a·a⁻¹ = 1');
    assert(derive.includes('0xed'), 'S(0x53) = 0xed');
    const sboxCells = await page.$$('#cl-aes-sbox .cl-cell');
    assert(sboxCells.length === 256, 'S 盒 256 格');

    // 口令加密往返
    await fill('#cl-seal-pw', 'a strong shared passphrase');
    await fill('#cl-seal-iter', '2000');
    await fill('#cl-seal-plain', '会议纪要：周四 15:00，密码是 hunter2。');
    await page.click('#cl-seal-run');
    await page.waitForFunction(() => document.getElementById('cl-seal-blob').value.length > 40);
    const blob = await val('#cl-seal-blob');
    assert(blob.startsWith('Q0wx'), '信封以 CL1 魔数开头');
    await page.click('#cl-open-run');
    await settle('#cl-open-out', '会议纪要：周四 15:00，密码是 hunter2。');
    assert((await txt('#cl-seal-verdict')).includes('解密成功'), '解密成功徽标');
    // 同明文两次加密结果不同（盐与 IV 随机）
    await page.click('#cl-seal-run');
    await page.waitForFunction((old) => document.getElementById('cl-seal-blob').value !== old, blob);
    // 错口令必须失败，而不是给出乱码
    await fill('#cl-seal-pw', 'wrong passphrase');
    await page.click('#cl-open-run');
    await page.waitForFunction(() => document.getElementById('cl-seal-verdict').classList.contains('cl-tag-bad'));
    assert((await txt('#cl-seal-verdict')).includes('填充非法'), '错口令报填充非法而不是输出乱码');
    assert(await txt('#cl-open-out') === '—', '错口令时不显示任何明文');
  });

  /* ═════ 面板 5：古典密码 ═════ */
  await onPanel('classic', async () => {
    // 凯撒
    await fill('#cl-cc-input', 'the quick brown fox jumps over the lazy dog');
    await page.fill('#cl-cc-shift', '3');
    await page.dispatchEvent('#cl-cc-shift', 'input');
    await page.click('#cl-cc-enc');
    await settle('#cl-cc-output', 'wkh txlfn eurzq ira mxpsv ryhu wkh odcb grj');
    await page.click('#cl-cc-swap');
    await page.click('#cl-cc-dec');
    await settle('#cl-cc-output', 'the quick brown fox jumps over the lazy dog');

    // 凯撒自动破译（把 rot13 密文丢进去，靠卡方还原）
    await fill('#cl-cc-input', 'gur dhvpx oebja sbk whzcf bire gur ynml qbt naq gura gur qbt onexf onpx');
    await page.click('#cl-cc-crack');
    await settle('#cl-cc-key-out', '位移 13');
    assert(await txt('#cl-cc-plain') === 'the quick brown fox jumps over the lazy dog and then the dog barks back',
      '凯撒自动破译还原出明文');
    const rows = await page.$$('#cl-cc-tbody tr');
    assert(rows.length === 10, '候选表列出前 10 个位移');

    // 切到维吉尼亚：位移控件必须真的看不见（[hidden] 守卫）
    await page.selectOption('#cl-cc-mode', 'vigenere');
    await page.waitForFunction(() => !document.getElementById('cl-cc-keywrap').hidden);
    assert(await page.evaluate(() => getComputedStyle(document.getElementById('cl-cc-shiftwrap')).display) === 'none',
      '维吉尼亚模式下位移控件的计算样式是 display:none');
    assert(await page.evaluate(() => getComputedStyle(document.getElementById('cl-cc-keywrap')).display) !== 'none',
      '维吉尼亚模式下密钥输入可见');

    await fill('#cl-cc-key', 'lemon');
    await fill('#cl-cc-input', 'attackatdawn');
    await page.click('#cl-cc-enc');
    await settle('#cl-cc-output', 'lxfopvefrnhr');
    await page.click('#cl-cc-swap');
    await page.click('#cl-cc-dec');
    await settle('#cl-cc-output', 'attackatdawn');

    // 维吉尼亚自动破译：只给密文，密钥与明文都要还原出来
    const plain = 'it is a truth universally acknowledged that a single man in possession of a good fortune ' +
      'must be in want of a wife however little known the feelings or views of such a man may be on his ' +
      'first entering a neighbourhood this truth is so well fixed in the minds of the surrounding families';
    await fill('#cl-cc-key', 'cipher');
    await fill('#cl-cc-input', plain);
    await page.click('#cl-cc-enc');
    const vct = await txt('#cl-cc-output');
    assert(vct !== plain && vct.length === plain.length, '维吉尼亚密文与明文不同但长度一致');
    await page.click('#cl-cc-swap');
    await fill('#cl-cc-key', 'zzzz');           // 先把密钥抹掉，证明破译不是从输入框里抄的
    await page.click('#cl-cc-crack');
    await settle('#cl-cc-key-out', 'cipher（长度 6）');
    assert(await txt('#cl-cc-plain') === plain, '维吉尼亚自动破译还原出明文');
    const icRows = await page.$$eval('#cl-cc-tbody tr', (rs) => rs.map((r) => r.textContent));
    assert(icRows.some((r) => r.includes('最小周期')), 'IC 表标出最小周期');
    assert(icRows.some((r) => r.includes('整数倍')), 'IC 表说明整数倍长度同样出峰');

    // 频率分析画布
    await page.waitForFunction(() => Number(document.getElementById('cl-cc-freq').dataset.letters) > 100);
    assert(Number(await page.getAttribute('#cl-cc-freq', 'data-alpha')) === 26, '频率图 26 个字母标签全部画出来了');
    assert(Number(await page.getAttribute('#cl-cc-freq', 'data-yticks')) === 4, '频率图 4 个纵轴刻度全部画出来了');
    assert(Number(await page.getAttribute('#cl-cc-freq', 'data-dropped')) === 0, '频率图没有标签因碰撞被丢弃');
    // 此刻输入框里装的是维吉尼亚密文：IC 必须掉到随机文本水平（这正是判定多表代换的依据）
    const icCipher = parseFloat(await txt('#cl-cc-ic'));
    assert(icCipher < 0.05, `多表密文的重合指数应接近随机的 0.038（实得 ${icCipher}）`);
    await fill('#cl-cc-input', plain);
    await page.waitForFunction(() => Number(document.getElementById('cl-cc-freq').dataset.letters) > 100);
    const icPlain = parseFloat(await txt('#cl-cc-ic'));
    assert(icPlain > 0.06 && icPlain < 0.09, `同一段文字的明文重合指数应在 0.06~0.09（实得 ${icPlain}）`);
    assert(icPlain - icCipher > 0.015, `明文与密文的 IC 拉开了显著差距（${icPlain} vs ${icCipher}）`);

    // 重复密钥 XOR：加密 → 抹掉密钥 → 破译还原
    await page.selectOption('#cl-cc-mode', 'xor');
    await page.waitForFunction(() => document.getElementById('cl-cc-shiftwrap').hidden === true);
    await fill('#cl-cc-key', 'ICE');
    const xplain = "Burning 'em, if you ain't quick and nimble I go crazy when I hear a cymbal. " +
      'The quick brown fox jumps over the lazy dog while the band plays on and on and on tonight.';
    await fill('#cl-cc-input', xplain);
    await page.click('#cl-cc-enc');
    await page.waitForFunction(() => /^[0-9a-f]+$/.test(document.getElementById('cl-cc-output').textContent));
    await page.click('#cl-cc-swap');
    await fill('#cl-cc-key', 'xx');
    await page.click('#cl-cc-crack');
    await page.waitForFunction(() => document.getElementById('cl-cc-key-out').textContent.startsWith('ICE'));
    assert((await txt('#cl-cc-key-out')).includes('494345'), 'XOR 破译同时给出密钥的十六进制');
    assert(await txt('#cl-cc-plain') === xplain, '重复密钥 XOR 自动破译还原出明文');
    // 解密路径也走一遍
    await page.click('#cl-cc-swap');
    await fill('#cl-cc-key', 'ICE');
    await page.click('#cl-cc-dec');
    await settle('#cl-cc-output', xplain);
  });

  /* ═════ 通用守卫 ═════ */
  // 1) 控件最小尺寸：逐个面板扫，隐藏面板里的塌缩控件同样要能被发现
  let scanned = 0;
  for (const name of ['digest', 'mac', 'sha', 'aes', 'classic']) {
    await page.click(`#cl-tab-${name}`);
    await page.waitForFunction((n) => !document.getElementById('cl-panel-' + n).hidden, name);
    const bad = await page.evaluate(() => {
      const out = [];
      let n = 0;
      for (const el of document.querySelectorAll('input, select, button')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;      // 当前不可见的面板
        n++;
        const min = el.tagName === 'BUTTON' ? 52 : el.type === 'checkbox' || el.type === 'radio' ? 18 : 100;
        if (r.width < min || r.height < 18) out.push(`${el.tagName}#${el.id || el.className} ${Math.round(r.width)}x${Math.round(r.height)} (需 ≥${min}x18)`);
      }
      return { out, n };
    });
    assert(bad.out.length === 0, `${name} 面板控件尺寸正常：${bad.out.join(' | ')}`);
    scanned += bad.n;
  }
  assert(scanned >= 45, `逐面板共扫到 ${scanned} 个可见控件（下界 45，防止一个都没扫到也算绿）`);

  // 2) 单位与符号不得被 uppercase 改写（08-06 / 08-08 连撞两次）
  const upper = await page.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll('th, dt, label, figcaption, .cl-tag')) {
      if (getComputedStyle(el).textTransform === 'uppercase') bad.push(el.textContent.slice(0, 20));
    }
    return bad;
  });
  assert(upper.length === 0, `没有任何标签被 text-transform 改写：${upper.join(' | ')}`);
  // 只扫渲染文本（含隐藏面板），排除 script/style —— 否则会扫到内联源码里的字符串常量
  const bodyText = await page.evaluate(() => {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let s = '', n;
    while ((n = w.nextNode())) {
      const p = n.parentElement;
      if (p && p.tagName !== 'SCRIPT' && p.tagName !== 'STYLE') s += n.nodeValue + '\n';
    }
    return s;
  });
  assert(!/\b(BASE64|HEX|MS|BIT|BYTES)\b/.test(bodyText), '正文里没有被大写改写的单位/名词');
  assert(bodyText.includes('Base64'), '「Base64」保持原大小写');
  assert(bodyText.includes('GF(2⁸)'), '有限域记号用上标而不是退化成 GF(28)');

  // 3) 布局不逃逸：所有分节都落在版心内
  const escaped = await page.evaluate(() => {
    const bad = [];
    const wrap = document.querySelector('.cl-wrap').getBoundingClientRect();
    for (const el of document.querySelectorAll('.cl-sec, .cl-block, .cl-hero')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      if (r.left < wrap.left - 1 || r.right > wrap.right + 1) bad.push(el.className + ' ' + Math.round(r.left) + '..' + Math.round(r.right));
    }
    return bad;
  });
  assert(escaped.length === 0, `没有元素逃出版心：${escaped.join(' | ')}`);

  // 4) 页面不出现横向滚动条
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 1, `桌面宽度下无横向溢出（实测 ${overflow}px）`);

  // 5) 窄屏同样不横向溢出
  await page.setViewportSize({ width: 390, height: 800 });
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  const narrow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(narrow <= 1, `390px 窄屏无横向溢出（实测 ${narrow}px）`);
  await page.setViewportSize({ width: 1280, height: 850 });

  /* ═════ 缩略图 ═════ */
  await page.click('#cl-tab-digest');
  await page.waitForFunction(() => !document.getElementById('cl-panel-digest').hidden);
  await page.evaluate(() => {
    document.getElementById('cl-dg-input').value = 'abc';
    document.getElementById('cl-dg-input').dispatchEvent(new Event('input', { bubbles: true }));
    window.scrollTo(0, 0);
  });
  await settle(digestOf('sha256'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  await page.mouse.move(1270, 840);          // 离开任何 hover 态再截图
  await screenshot('thumb.png');
};
