// 压缩包工坊 · Archive Studio —— 浏览器集成测试
// 真值全部来自独立实现（toracle/gen_truth.py：Python zipfile / tarfile / gzip、pyzipper、7-Zip 26.06），由 inject-oracle.mjs 机械注入 ORACLE，
// 本文件不手打期望值。下载件一律用本文件里不依赖页面引擎的读取器核对（Node zlib + OpenSSL）：
//   ZIP 结构、CRC（zlib.crc32）、Deflate（zlib.inflateRawSync）、WinZip AES（crypto.pbkdf2Sync + aes-ecb 生成小端计数器流 + HMAC-SHA1）、
//   ZipCrypto（下面 30 行独立实现）、TAR（下面独立解析，含 pax 头）。
// 设了 AS_7ZZ=<7zz 路径> / AS_UNZIP=<unzip 路径> 时，每个下载件再交给 7-Zip / Info-ZIP 做完整性测试（本 run 开着跑）。
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import zlib from 'node:zlib'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { guardHidden, guardUniqueIds, guardControlSize, guardTextTransform, guardOverflow, guardBoxOverlap } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const ORACLE = {
 "fixtures": {
  "aes128.zip": {
   "kind": "zip",
   "entries": [
    {
     "name": "secret/合同.txt",
     "dir": false,
     "usize": 4580,
     "csize": 315,
     "crc": 0,
     "method": 8,
     "enc": true,
     "crypto": "AES-128",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "flag",
     "sha": "6c6d4c0f47aa8cc87a30c8d1843a2e0b3d628c43d15228eafa147972a1e637b1"
    }
   ],
   "sevenzip_ok": true,
   "sevenzip_errors": [],
   "how": "7-Zip 26.06：-mem=AES128，密码 1234",
   "size": 505,
   "b64": "UEsDBDMAAQhjAEx/c10AAAAAOwEAAOQRAAARAAsAc2VjcmV0L+WQiOWQjC50eHQBmQcAAgBBRQEIAL89oD0CCgpub/QpgsA2cgsk97DFsBqwV7EbfAz2MQvtNlQHEvtLonIpwtWT8kreAOnnbuh+XPN3QdbpejDc25EuQTnZH6nCdyC3A+D/XVvl0BiJbiyGPw1zSNa+aie2CsNI9DQdDnDriQkoyD6THswF7fQZ6DFDjwLkmxFbbAFAkHl83Nm083Pc4TSbRnzS2UYNJE6qIJsCDHOpjDIGY+QQQg7xVXahCzFfmeC2x5kDUUMNDMDaaE9KSW7/oganu+DjFnjk1Utjrd7bYDB4N63labM7R2IYnChjT4QoMh63ClW+jE1K2gKzT2eEiRYvMHha6DQJ8tikssnBbFCYTYSkKbMtm8005Cl789fISY7Hk7Kdfa//t1edNHwSu4O+234FXmzFUtQTa0GjEc/EjRLUAQZK+LDm1MLtQVBLAQI/AzMAAQhjAEx/c10AAAAAOwEAAOQRAAARAC8AAAAAAAAAIICkgQAAAABzZWNyZXQv5ZCI5ZCMLnR4dAoAIAAAAAAAAQAYAD/2UsD7d90BAAAAAAAAAAAAAAAAAAAAAAGZBwACAEFFAQgAUEsFBgAAAAABAAEAbgAAAHUBAAAAAA==",
   "pw": "1234"
  },
  "aes256.zip": {
   "kind": "zip",
   "entries": [
    {
     "name": "secret/",
     "dir": true,
     "usize": 0,
     "csize": 0,
     "crc": 0,
     "method": 0,
     "enc": false,
     "crypto": "",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "ascii"
    },
    {
     "name": "secret/data.bin",
     "dir": false,
     "usize": 700,
     "csize": 728,
     "crc": 0,
     "method": 0,
     "enc": true,
     "crypto": "AES-256",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "ascii",
     "sha": "c90ce22dea69bfa0d42b7805d5e2a0d6cec2e18a08980f780d8029e8d5def9c7"
    },
    {
     "name": "secret/合同.txt",
     "dir": false,
     "usize": 4580,
     "csize": 323,
     "crc": 0,
     "method": 8,
     "enc": true,
     "crypto": "AES-256",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "flag",
     "sha": "6c6d4c0f47aa8cc87a30c8d1843a2e0b3d628c43d15228eafa147972a1e637b1"
    }
   ],
   "sevenzip_ok": true,
   "sevenzip_errors": [],
   "how": "7-Zip 26.06：-mem=AES256，密码 Tr0ub4dor&3（WinZip AE-2）",
   "size": 1531,
   "b64": "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",
   "pw": "Tr0ub4dor&3"
  },
  "badtree.zip": {
   "kind": "zip",
   "entries": [
    {
     "name": "lenient.bin",
     "dir": false,
     "usize": 5,
     "csize": 16,
     "crc": 3140436679,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      1980,
      1,
      1,
      0,
      0,
      0
     ],
     "src": "ascii",
     "err": "error: Error -3 while decompressing data: invalid distances set"
    },
    {
     "name": "fine.txt",
     "dir": false,
     "usize": 20,
     "csize": 9,
     "crc": 52446478,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      1980,
      1,
      1,
      0,
      0,
      0
     ],
     "src": "ascii",
     "sha": "142f0d0c43cf21aa352c8adb986119b95681f0c52762c2d97c643692956c40ca",
     "text": "fine\nfine\nfine\nfine\n"
    }
   ],
   "sevenzip_ok": true,
   "sevenzip_errors": [],
   "how": "手工拼的 ZIP：lenient.bin 的 Deflate 流距离码集不完整（zlib：invalid distances set），CRC 与大小故意写成「宽松解码器」的输出",
   "size": 237,
   "b64": "UEsDBBQAAAAIAAAAIQDHQi+7EAAAAAUAAAALAAAAbGVuaWVudC5iaW4N4QEFAAAAgABsq/+jqnACUEsDBBQAAAAIAAAAIQAORSADCQAAABQAAAAIAAAAZmluZS50eHRLy8xL5UpDJQBQSwECFAAUAAAACAAAACEAx0IvuxAAAAAFAAAACwAAAAAAAAAAAAAAAAAAAAAAbGVuaWVudC5iaW5QSwECFAAUAAAACAAAACEADkUgAwkAAAAUAAAACAAAAAAAAAAAAAAAAAA5AAAAZmluZS50eHRQSwUGAAAAAAIAAgBvAAAAaAAAAAAA"
  },
  "big5.zip": {
   "kind": "zip",
   "entries": [
    {
     "name": "會議記錄/",
     "dir": true,
     "usize": 0,
     "csize": 0,
     "crc": 0,
     "method": 0,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess"
    },
    {
     "name": "會議記錄/第一季營運報告.txt",
     "dir": false,
     "usize": 12,
     "csize": 15,
     "crc": 2306614153,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess",
     "sha": "50d251a2162e6c9edc672f5ba1009e1dfdfdbc8852776e048fc6b45ce4ef62f7"
    },
    {
     "name": "會議記錄/預算與實際對照表.csv",
     "dir": false,
     "usize": 11,
     "csize": 14,
     "crc": 3351154019,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess",
     "sha": "468812cfb854c220e92b3a4f25f83cd0aa9c4881ccef466cc68d5a576088b938"
    }
   ],
   "enc": "big5",
   "sevenzip_ok": true,
   "sevenzip_errors": [],
   "how": "Python zipfile，文件名 Big5、无标记（繁体中文 Windows）",
   "size": 409,
   "b64": "UEsDBBQAAAAAAEV9UlkAAAAAAAAAAAAAAAAJAAAAt3zEs7BPv/0vUEsDBBQAAAAIAEV9UlmJI3yJDwAAAAwAAAAbAAAAt3zEs7BPv/0vssSkQKl1wOe5QrP4p2kudHh0O/B82ZplK1b9WOjMywUAUEsDBBQAAAAIAEV9Ulljjb7HDgAAAAsAAAAdAAAAt3zEs7BPv/0vuXe64rtQueq72rnvt9Oq7S5jc3bbtnXpDZ1V3w878XIBAFBLAQIUABQAAAAAAEV9UlkAAAAAAAAAAAAAAAAJAAAAAAAAAAAAEAAAAAAAAAC3fMSzsE+//S9QSwECFAAUAAAACABFfVJZiSN8iQ8AAAAMAAAAGwAAAAAAAAAAACAAAAAnAAAAt3zEs7BPv/0vssSkQKl1wOe5QrP4p2kudHh0UEsBAhQAFAAAAAgARX1SWWONvscOAAAACwAAAB0AAAAAAAAAAAAgAAAAbwAAALd8xLOwT7/9L7l3uuK7ULnqu9q577fTqu0uY3N2UEsFBgAAAAADAAMAywAAALgAAAAAAA=="
  },
  "corrupt.zip": {
   "kind": "zip",
   "entries": [
    {
     "name": "ok.txt",
     "dir": false,
     "usize": 450,
     "csize": 450,
     "crc": 1140654244,
     "method": 0,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "ascii",
     "sha": "3c57919b41a0d950066fb1f716a5b9994436b39b1ca2f6e31ebd82c563d3698a",
     "text": "all good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\nall good\n"
    },
    {
     "name": "broken.txt",
     "dir": false,
     "usize": 7827,
     "csize": 7827,
     "crc": 3167294631,
     "method": 0,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "ascii",
     "err": "BadZipFile: Bad CRC-32 for file 'broken.txt'"
    }
   ],
   "sevenzip_ok": false,
   "sevenzip_errors": [
    "broken.txt"
   ],
   "how": "Python zipfile 写两个文件，把 broken.txt 压缩数据正中间的一个字节翻一位",
   "size": 8483,
   "b64": "UEsDBBQAAAAAAEV9UlmkAP1DwgEAAMIBAAAGAAAAb2sudHh0YWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKYWxsIGdvb2QKUEsDBBQAAAAAAEV9UlmnFMm8kx4AAJMeAAAKAAAAYnJva2VuLnR4dHJvdyAwIHZhbHVlIDAKcm93IDEgdmFsdWUgMQpyb3cgMiB2YWx1ZSA0CnJvdyAzIHZhbHVlIDkKcm93IDQgdmFsdWUgMTYKcm93IDUgdmFsdWUgMjUKcm93IDYgdmFsdWUgMzYKcm93IDcgdmFsdWUgNDkKcm93IDggdmFsdWUgNjQKcm93IDkgdmFsdWUgODEKcm93IDEwIHZhbHVlIDEwMApyb3cgMTEgdmFsdWUgMTIxCnJvdyAxMiB2YWx1ZSAxNDQKcm93IDEzIHZhbHVlIDE2OQpyb3cgMTQgdmFsdWUgMTk2CnJvdyAxNSB2YWx1ZSAyMjUKcm93IDE2IHZhbHVlIDI1Ngpyb3cgMTcgdmFsdWUgMjg5CnJvdyAxOCB2YWx1ZSAzMjQKcm93IDE5IHZhbHVlIDM2MQpyb3cgMjAgdmFsdWUgNDAwCnJvdyAyMSB2YWx1ZSA0NDEKcm93IDIyIHZhbHVlIDQ4NApyb3cgMjMgdmFsdWUgNTI5CnJvdyAyNCB2YWx1ZSA1NzYKcm93IDI1IHZhbHVlIDYyNQpyb3cgMjYgdmFsdWUgNjc2CnJvdyAyNyB2YWx1ZSA3MjkKcm93IDI4IHZhbHVlIDc4NApyb3cgMjkgdmFsdWUgODQxCnJvdyAzMCB2YWx1ZSA5MDAKcm93IDMxIHZhbHVlIDk2MQpyb3cgMzIgdmFsdWUgMTAyNApyb3cgMzMgdmFsdWUgMTA4OQpyb3cgMzQgdmFsdWUgMTE1Ngpyb3cgMzUgdmFsdWUgMTIyNQpyb3cgMzYgdmFsdWUgMTI5Ngpyb3cgMzcgdmFsdWUgMTM2OQpyb3cgMzggdmFsdWUgMTQ0NApyb3cgMzkgdmFsdWUgMTUyMQpyb3cgNDAgdmFsdWUgMTYwMApyb3cgNDEgdmFsdWUgMTY4MQpyb3cgNDIgdmFsdWUgMTc2NApyb3cgNDMgdmFsdWUgMTg0OQpyb3cgNDQgdmFsdWUgMTkzNgpyb3cgNDUgdmFsdWUgMjAyNQpyb3cgNDYgdmFsdWUgMjExNgpyb3cgNDcgdmFsdWUgMjIwOQpyb3cgNDggdmFsdWUgMjMwNApyb3cgNDkgdmFsdWUgMjQwMQpyb3cgNTAgdmFsdWUgMjUwMApyb3cgNTEgdmFsdWUgMjYwMQpyb3cgNTIgdmFsdWUgMjcwNApyb3cgNTMgdmFsdWUgMjgwOQpyb3cgNTQgdmFsdWUgMjkxNgpyb3cgNTUgdmFsdWUgMzAyNQpyb3cgNTYgdmFsdWUgMzEzNgpyb3cgNTcgdmFsdWUgMzI0OQpyb3cgNTggdmFsdWUgMzM2NApyb3cgNTkgdmFsdWUgMzQ4MQpyb3cgNjAgdmFsdWUgMzYwMApyb3cgNjEgdmFsdWUgMzcyMQpyb3cgNjIgdmFsdWUgMzg0NApyb3cgNjMgdmFsdWUgMzk2OQpyb3cgNjQgdmFsdWUgNDA5Ngpyb3cgNjUgdmFsdWUgNDIyNQpyb3cgNjYgdmFsdWUgNDM1Ngpyb3cgNjcgdmFsdWUgNDQ4OQpyb3cgNjggdmFsdWUgNDYyNApyb3cgNjkgdmFsdWUgNDc2MQpyb3cgNzAgdmFsdWUgNDkwMApyb3cgNzEgdmFsdWUgNTA0MQpyb3cgNzIgdmFsdWUgNTE4NApyb3cgNzMgdmFsdWUgNTMyOQpyb3cgNzQgdmFsdWUgNTQ3Ngpyb3cgNzUgdmFsdWUgNTYyNQpyb3cgNzYgdmFsdWUgNTc3Ngpyb3cgNzcgdmFsdWUgNTkyOQpyb3cgNzggdmFsdWUgNjA4NApyb3cgNzkgdmFsdWUgNjI0MQpyb3cgODAgdmFsdWUgNjQwMApyb3cgODEgdmFsdWUgNjU2MQpyb3cgODIgdmFsdWUgNjcyNApyb3cgODMgdmFsdWUgNjg4OQpyb3cgODQgdmFsdWUgNzA1Ngpyb3cgODUgdmFsdWUgNzIyNQpyb3cgODYgdmFsdWUgNzM5Ngpyb3cgODcgdmFsdWUgNzU2OQpyb3cgODggdmFsdWUgNzc0NApyb3cgODkgdmFsdWUgNzkyMQpyb3cgOTAgdmFsdWUgODEwMApyb3cgOTEgdmFsdWUgODI4MQpyb3cgOTIgdmFsdWUgODQ2NApyb3cgOTMgdmFsdWUgODY0OQpyb3cgOTQgdmFsdWUgODgzNgpyb3cgOTUgdmFsdWUgOTAyNQpyb3cgOTYgdmFsdWUgOTIxNgpyb3cgOTcgdmFsdWUgOTQwOQpyb3cgOTggdmFsdWUgOTYwNApyb3cgOTkgdmFsdWUgOTgwMQpyb3cgMTAwIHZhbHVlIDEwMDAwCnJvdyAxMDEgdmFsdWUgMTAyMDEKcm93IDEwMiB2YWx1ZSAxMDQwNApyb3cgMTAzIHZhbHVlIDEwNjA5CnJvdyAxMDQgdmFsdWUgMTA4MTYKcm93IDEwNSB2YWx1ZSAxMTAyNQpyb3cgMTA2IHZhbHVlIDExMjM2CnJvdyAxMDcgdmFsdWUgMTE0NDkKcm93IDEwOCB2YWx1ZSAxMTY2NApyb3cgMTA5IHZhbHVlIDExODgxCnJvdyAxMTAgdmFsdWUgMTIxMDAKcm93IDExMSB2YWx1ZSAxMjMyMQpyb3cgMTEyIHZhbHVlIDEyNTQ0CnJvdyAxMTMgdmFsdWUgMTI3NjkKcm93IDExNCB2YWx1ZSAxMjk5Ngpyb3cgMTE1IHZhbHVlIDEzMjI1CnJvdyAxMTYgdmFsdWUgMTM0NTYKcm93IDExNyB2YWx1ZSAxMzY4OQpyb3cgMTE4IHZhbHVlIDEzOTI0CnJvdyAxMTkgdmFsdWUgMTQxNjEKcm93IDEyMCB2YWx1ZSAxNDQwMApyb3cgMTIxIHZhbHVlIDE0NjQxCnJvdyAxMjIgdmFsdWUgMTQ4ODQKcm93IDEyMyB2YWx1ZSAxNTEyOQpyb3cgMTI0IHZhbHVlIDE1Mzc2CnJvdyAxMjUgdmFsdWUgMTU2MjUKcm93IDEyNiB2YWx1ZSAxNTg3Ngpyb3cgMTI3IHZhbHVlIDE2MTI5CnJvdyAxMjggdmFsdWUgMTYzODQKcm93IDEyOSB2YWx1ZSAxNjY0MQpyb3cgMTMwIHZhbHVlIDE2OTAwCnJvdyAxMzEgdmFsdWUgMTcxNjEKcm93IDEzMiB2YWx1ZSAxNzQyNApyb3cgMTMzIHZhbHVlIDE3Njg5CnJvdyAxMzQgdmFsdWUgMTc5NTYKcm93IDEzNSB2YWx1ZSAxODIyNQpyb3cgMTM2IHZhbHVlIDE4NDk2CnJvdyAxMzcgdmFsdWUgMTg3NjkKcm93IDEzOCB2YWx1ZSAxOTA0NApyb3cgMTM5IHZhbHVlIDE5MzIxCnJvdyAxNDAgdmFsdWUgMTk2MDAKcm93IDE0MSB2YWx1ZSAxOTg4MQpyb3cgMTQyIHZhbHVlIDIwMTY0CnJvdyAxNDMgdmFsdWUgMjA0NDkKcm93IDE0NCB2YWx1ZSAyMDczNgpyb3cgMTQ1IHZhbHVlIDIxMDI1CnJvdyAxNDYgdmFsdWUgMjEzMTYKcm93IDE0NyB2YWx1ZSAyMTYwOQpyb3cgMTQ4IHZhbHVlIDIxOTA0CnJvdyAxNDkgdmFsdWUgMjIyMDEKcm93IDE1MCB2YWx1ZSAyMjUwMApyb3cgMTUxIHZhbHVlIDIyODAxCnJvdyAxNTIgdmFsdWUgMjMxMDQKcm93IDE1MyB2YWx1ZSAyMzQwOQpyb3cgMTU0IHZhbHVlIDIzNzE2CnJvdyAxNTUgdmFsdWUgMjQwMjUKcm93IDE1NiB2YWx1ZSAyNDMzNgpyb3cgMTU3IHZhbHVlIDI0NjQ5CnJvdyAxNTggdmFsdWUgMjQ5NjQKcm93IDE1OSB2YWx1ZSAyNTI4MQpyb3cgMTYwIHZhbHVlIDI1NjAwCnJvdyAxNjEgdmFsdWUgMjU5MjEKcm93IDE2MiB2YWx1ZSAyNjI0NApyb3cgMTYzIHZhbHVlIDI2NTY5CnJvdyAxNjQgdmFsdWUgMjY4OTYKcm93IDE2NSB2YWx1ZSAyNzIyNQpyb3cgMTY2IHZhbHVlIDI3NTU2CnJvdyAxNjcgdmFsdWUgMjc4ODkKcm93IDE2OCB2YWx1ZSAyODIyNApyb3cgMTY5IHZhbHVlIDI4NTYxCnJvdyAxNzAgdmFsdWUgMjg5MDAKcm93IDE3MSB2YWx1ZSAyOTI0MQpyb3cgMTcyIHZhbHVlIDI5NTg0CnJvdyAxNzMgdmFsdWUgMjk5MjkKcm93IDE3NCB2YWx1ZSAzMDI3Ngpyb3cgMTc1IHZhbHVlIDMwNjI1CnJvdyAxNzYgdmFsdWUgMzA5NzYKcm93IDE3NyB2YWx1ZSAzMTMyOQpyb3cgMTc4IHZhbHVlIDMxNjg0CnJvdyAxNzkgdmFsdWUgMzIwNDEKcm93IDE4MCB2YWx1ZSAzMjQwMApyb3cgMTgxIHZhbHVlIDMyNzYxCnJvdyAxODIgdmFsdWUgMzMxMjQKcm93IDE4MyB2YWx1ZSAzMzQ4OQpyb3cgMTg0IHZhbHVlIDMzODU2CnJvdyAxODUgdmFsdWUgMzQyMjUKcm93IDE4NiB2YWx1ZSAzNDU5Ngpyb3cgMTg3IHZhbHVlIDM0OTY5CnJvdyAxODggdmFsdWUgMzUzNDQKcm93IDE4OSB2YWx1ZSAzNTcyMQpyb3cgMTkwIHZhbHVlIDM2MTAwCnJvdyAxOTEgdmFsdWUgMzY0ODEKcm93IDE5MiB2YWx1ZSAzNjg2NApyb3cgMTkzIHZhbHVlIDM3MjQ5CnJvdyAxOTQgdmFsdWUgMzc2MzYKcm93IDE5NSB2YWx1ZSAzODAyNQpyb3cgMTk2IHZhbHVlIDM4NDE2CnJvdyAxOTcgdmFsdWUgMzg4MDkKcm93IDE5OCB2YWx1ZSAzOTIwNApyb3cgMTk5IHZhbHVlIDM5NjAxCnJvdyAyMDAgdmFsdWUgNDAwMDAKcm93IDIwMSB2YWx1ZSA0MDQwMQpyb3cgMjAyIHZhbHVlIDQwODA0CnJvdyAyMDMgdmFsdWUgNDEyMDkKcm93IDIwNCB2YWx1ZSA0MTYxNgpyb3cgMjA1IHZhbHVlIDQyMDI1CnJvdyAyMDYgdmFsdWUgNDI0MzYKcm93IDIwNyB2YWx1ZSA0Mjg0OQpyb3cgMjA4IHZxbHVlIDQzMjY0CnJvdyAyMDkgdmFsdWUgNDM2ODEKcm93IDIxMCB2YWx1ZSA0NDEwMApyb3cgMjExIHZhbHVlIDQ0NTIxCnJvdyAyMTIgdmFsdWUgNDQ5NDQKcm93IDIxMyB2YWx1ZSA0NTM2OQpyb3cgMjE0IHZhbHVlIDQ1Nzk2CnJvdyAyMTUgdmFsdWUgNDYyMjUKcm93IDIxNiB2YWx1ZSA0NjY1Ngpyb3cgMjE3IHZhbHVlIDQ3MDg5CnJvdyAyMTggdmFsdWUgNDc1MjQKcm93IDIxOSB2YWx1ZSA0Nzk2MQpyb3cgMjIwIHZhbHVlIDQ4NDAwCnJvdyAyMjEgdmFsdWUgNDg4NDEKcm93IDIyMiB2YWx1ZSA0OTI4NApyb3cgMjIzIHZhbHVlIDQ5NzI5CnJvdyAyMjQgdmFsdWUgNTAxNzYKcm93IDIyNSB2YWx1ZSA1MDYyNQpyb3cgMjI2IHZhbHVlIDUxMDc2CnJvdyAyMjcgdmFsdWUgNTE1MjkKcm93IDIyOCB2YWx1ZSA1MTk4NApyb3cgMjI5IHZhbHVlIDUyNDQxCnJvdyAyMzAgdmFsdWUgNTI5MDAKcm93IDIzMSB2YWx1ZSA1MzM2MQpyb3cgMjMyIHZhbHVlIDUzODI0CnJvdyAyMzMgdmFsdWUgNTQyODkKcm93IDIzNCB2YWx1ZSA1NDc1Ngpyb3cgMjM1IHZhbHVlIDU1MjI1CnJvdyAyMzYgdmFsdWUgNTU2OTYKcm93IDIzNyB2YWx1ZSA1NjE2OQpyb3cgMjM4IHZhbHVlIDU2NjQ0CnJvdyAyMzkgdmFsdWUgNTcxMjEKcm93IDI0MCB2YWx1ZSA1NzYwMApyb3cgMjQxIHZhbHVlIDU4MDgxCnJvdyAyNDIgdmFsdWUgNTg1NjQKcm93IDI0MyB2YWx1ZSA1OTA0OQpyb3cgMjQ0IHZhbHVlIDU5NTM2CnJvdyAyNDUgdmFsdWUgNjAwMjUKcm93IDI0NiB2YWx1ZSA2MDUxNgpyb3cgMjQ3IHZhbHVlIDYxMDA5CnJvdyAyNDggdmFsdWUgNjE1MDQKcm93IDI0OSB2YWx1ZSA2MjAwMQpyb3cgMjUwIHZhbHVlIDYyNTAwCnJvdyAyNTEgdmFsdWUgNjMwMDEKcm93IDI1MiB2YWx1ZSA2MzUwNApyb3cgMjUzIHZhbHVlIDY0MDA5CnJvdyAyNTQgdmFsdWUgNjQ1MTYKcm93IDI1NSB2YWx1ZSA2NTAyNQpyb3cgMjU2IHZhbHVlIDY1NTM2CnJvdyAyNTcgdmFsdWUgNjYwNDkKcm93IDI1OCB2YWx1ZSA2NjU2NApyb3cgMjU5IHZhbHVlIDY3MDgxCnJvdyAyNjAgdmFsdWUgNjc2MDAKcm93IDI2MSB2YWx1ZSA2ODEyMQpyb3cgMjYyIHZhbHVlIDY4NjQ0CnJvdyAyNjMgdmFsdWUgNjkxNjkKcm93IDI2NCB2YWx1ZSA2OTY5Ngpyb3cgMjY1IHZhbHVlIDcwMjI1CnJvdyAyNjYgdmFsdWUgNzA3NTYKcm93IDI2NyB2YWx1ZSA3MTI4OQpyb3cgMjY4IHZhbHVlIDcxODI0CnJvdyAyNjkgdmFsdWUgNzIzNjEKcm93IDI3MCB2YWx1ZSA3MjkwMApyb3cgMjcxIHZhbHVlIDczNDQxCnJvdyAyNzIgdmFsdWUgNzM5ODQKcm93IDI3MyB2YWx1ZSA3NDUyOQpyb3cgMjc0IHZhbHVlIDc1MDc2CnJvdyAyNzUgdmFsdWUgNzU2MjUKcm93IDI3NiB2YWx1ZSA3NjE3Ngpyb3cgMjc3IHZhbHVlIDc2NzI5CnJvdyAyNzggdmFsdWUgNzcyODQKcm93IDI3OSB2YWx1ZSA3Nzg0MQpyb3cgMjgwIHZhbHVlIDc4NDAwCnJvdyAyODEgdmFsdWUgNzg5NjEKcm93IDI4MiB2YWx1ZSA3OTUyNApyb3cgMjgzIHZhbHVlIDgwMDg5CnJvdyAyODQgdmFsdWUgODA2NTYKcm93IDI4NSB2YWx1ZSA4MTIyNQpyb3cgMjg2IHZhbHVlIDgxNzk2CnJvdyAyODcgdmFsdWUgODIzNjkKcm93IDI4OCB2YWx1ZSA4Mjk0NApyb3cgMjg5IHZhbHVlIDgzNTIxCnJvdyAyOTAgdmFsdWUgODQxMDAKcm93IDI5MSB2YWx1ZSA4NDY4MQpyb3cgMjkyIHZhbHVlIDg1MjY0CnJvdyAyOTMgdmFsdWUgODU4NDkKcm93IDI5NCB2YWx1ZSA4NjQzNgpyb3cgMjk1IHZhbHVlIDg3MDI1CnJvdyAyOTYgdmFsdWUgODc2MTYKcm93IDI5NyB2YWx1ZSA4ODIwOQpyb3cgMjk4IHZhbHVlIDg4ODA0CnJvdyAyOTkgdmFsdWUgODk0MDEKcm93IDMwMCB2YWx1ZSA5MDAwMApyb3cgMzAxIHZhbHVlIDkwNjAxCnJvdyAzMDIgdmFsdWUgOTEyMDQKcm93IDMwMyB2YWx1ZSA5MTgwOQpyb3cgMzA0IHZhbHVlIDkyNDE2CnJvdyAzMDUgdmFsdWUgOTMwMjUKcm93IDMwNiB2YWx1ZSA5MzYzNgpyb3cgMzA3IHZhbHVlIDk0MjQ5CnJvdyAzMDggdmFsdWUgOTQ4NjQKcm93IDMwOSB2YWx1ZSA5NTQ4MQpyb3cgMzEwIHZhbHVlIDk2MTAwCnJvdyAzMTEgdmFsdWUgOTY3MjEKcm93IDMxMiB2YWx1ZSA5NzM0NApyb3cgMzEzIHZhbHVlIDk3OTY5CnJvdyAzMTQgdmFsdWUgOTg1OTYKcm93IDMxNSB2YWx1ZSA5OTIyNQpyb3cgMzE2IHZhbHVlIDk5ODU2CnJvdyAzMTcgdmFsdWUgMTAwNDg5CnJvdyAzMTggdmFsdWUgMTAxMTI0CnJvdyAzMTkgdmFsdWUgMTAxNzYxCnJvdyAzMjAgdmFsdWUgMTAyNDAwCnJvdyAzMjEgdmFsdWUgMTAzMDQxCnJvdyAzMjIgdmFsdWUgMTAzNjg0CnJvdyAzMjMgdmFsdWUgMTA0MzI5CnJvdyAzMjQgdmFsdWUgMTA0OTc2CnJvdyAzMjUgdmFsdWUgMTA1NjI1CnJvdyAzMjYgdmFsdWUgMTA2Mjc2CnJvdyAzMjcgdmFsdWUgMTA2OTI5CnJvdyAzMjggdmFsdWUgMTA3NTg0CnJvdyAzMjkgdmFsdWUgMTA4MjQxCnJvdyAzMzAgdmFsdWUgMTA4OTAwCnJvdyAzMzEgdmFsdWUgMTA5NTYxCnJvdyAzMzIgdmFsdWUgMTEwMjI0CnJvdyAzMzMgdmFsdWUgMTEwODg5CnJvdyAzMzQgdmFsdWUgMTExNTU2CnJvdyAzMzUgdmFsdWUgMTEyMjI1CnJvdyAzMzYgdmFsdWUgMTEyODk2CnJvdyAzMzcgdmFsdWUgMTEzNTY5CnJvdyAzMzggdmFsdWUgMTE0MjQ0CnJvdyAzMzkgdmFsdWUgMTE0OTIxCnJvdyAzNDAgdmFsdWUgMTE1NjAwCnJvdyAzNDEgdmFsdWUgMTE2MjgxCnJvdyAzNDIgdmFsdWUgMTE2OTY0CnJvdyAzNDMgdmFsdWUgMTE3NjQ5CnJvdyAzNDQgdmFsdWUgMTE4MzM2CnJvdyAzNDUgdmFsdWUgMTE5MDI1CnJvdyAzNDYgdmFsdWUgMTE5NzE2CnJvdyAzNDcgdmFsdWUgMTIwNDA5CnJvdyAzNDggdmFsdWUgMTIxMTA0CnJvdyAzNDkgdmFsdWUgMTIxODAxCnJvdyAzNTAgdmFsdWUgMTIyNTAwCnJvdyAzNTEgdmFsdWUgMTIzMjAxCnJvdyAzNTIgdmFsdWUgMTIzOTA0CnJvdyAzNTMgdmFsdWUgMTI0NjA5CnJvdyAzNTQgdmFsdWUgMTI1MzE2CnJvdyAzNTUgdmFsdWUgMTI2MDI1CnJvdyAzNTYgdmFsdWUgMTI2NzM2CnJvdyAzNTcgdmFsdWUgMTI3NDQ5CnJvdyAzNTggdmFsdWUgMTI4MTY0CnJvdyAzNTkgdmFsdWUgMTI4ODgxCnJvdyAzNjAgdmFsdWUgMTI5NjAwCnJvdyAzNjEgdmFsdWUgMTMwMzIxCnJvdyAzNjIgdmFsdWUgMTMxMDQ0CnJvdyAzNjMgdmFsdWUgMTMxNzY5CnJvdyAzNjQgdmFsdWUgMTMyNDk2CnJvdyAzNjUgdmFsdWUgMTMzMjI1CnJvdyAzNjYgdmFsdWUgMTMzOTU2CnJvdyAzNjcgdmFsdWUgMTM0Njg5CnJvdyAzNjggdmFsdWUgMTM1NDI0CnJvdyAzNjkgdmFsdWUgMTM2MTYxCnJvdyAzNzAgdmFsdWUgMTM2OTAwCnJvdyAzNzEgdmFsdWUgMTM3NjQxCnJvdyAzNzIgdmFsdWUgMTM4Mzg0CnJvdyAzNzMgdmFsdWUgMTM5MTI5CnJvdyAzNzQgdmFsdWUgMTM5ODc2CnJvdyAzNzUgdmFsdWUgMTQwNjI1CnJvdyAzNzYgdmFsdWUgMTQxMzc2CnJvdyAzNzcgdmFsdWUgMTQyMTI5CnJvdyAzNzggdmFsdWUgMTQyODg0CnJvdyAzNzkgdmFsdWUgMTQzNjQxCnJvdyAzODAgdmFsdWUgMTQ0NDAwCnJvdyAzODEgdmFsdWUgMTQ1MTYxCnJvdyAzODIgdmFsdWUgMTQ1OTI0CnJvdyAzODMgdmFsdWUgMTQ2Njg5CnJvdyAzODQgdmFsdWUgMTQ3NDU2CnJvdyAzODUgdmFsdWUgMTQ4MjI1CnJvdyAzODYgdmFsdWUgMTQ4OTk2CnJvdyAzODcgdmFsdWUgMTQ5NzY5CnJvdyAzODggdmFsdWUgMTUwNTQ0CnJvdyAzODkgdmFsdWUgMTUxMzIxCnJvdyAzOTAgdmFsdWUgMTUyMTAwCnJvdyAzOTEgdmFsdWUgMTUyODgxCnJvdyAzOTIgdmFsdWUgMTUzNjY0CnJvdyAzOTMgdmFsdWUgMTU0NDQ5CnJvdyAzOTQgdmFsdWUgMTU1MjM2CnJvdyAzOTUgdmFsdWUgMTU2MDI1CnJvdyAzOTYgdmFsdWUgMTU2ODE2CnJvdyAzOTcgdmFsdWUgMTU3NjA5CnJvdyAzOTggdmFsdWUgMTU4NDA0CnJvdyAzOTkgdmFsdWUgMTU5MjAxClBLAQIUAxQAAAAAAEV9UlmkAP1DwgEAAMIBAAAGAAAAAAAAAAAAAACAAQAAAABvay50eHRQSwECFAMUAAAAAABFfVJZpxTJvJMeAACTHgAACgAAAAAAAAAAAAAAgAHmAQAAYnJva2VuLnR4dFBLBQYAAAAAAgACAGwAAAChIAAAAAA="
  },
  "cp437.zip": {
   "kind": "zip",
   "entries": [
    {
     "name": "Résumé/",
     "dir": true,
     "usize": 0,
     "csize": 0,
     "crc": 0,
     "method": 0,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess"
    },
    {
     "name": "Résumé/Lebenslauf_Müller.txt",
     "dir": false,
     "usize": 7,
     "csize": 9,
     "crc": 316862758,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess",
     "sha": "175fafa305e1a6b217963bc76039061049314671ccfd48077256d75396ee73a6",
     "text": "Hallo\r\n"
    },
    {
     "name": "Résumé/Café_Menü_Übersicht.txt",
     "dir": false,
     "usize": 6,
     "csize": 8,
     "crc": 2406415860,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess",
     "sha": "d4d35e695c4bafb695f79f00c27f3cf79f855916c432f2f1d880caa9d0d24f7b",
     "text": "Menu\r\n"
    },
    {
     "name": "Résumé/Ça_va_Garçon.txt",
     "dir": false,
     "usize": 7,
     "csize": 9,
     "crc": 1247374742,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess",
     "sha": "41f54c5352428624a0e505b9143e2302fde2f2f51104bfce2d31814a2b919b80",
     "text": "Salut\r\n"
    }
   ],
   "enc": "cp437",
   "sevenzip_ok": true,
   "sevenzip_errors": [],
   "how": "Python zipfile，文件名 CP437、无标记（英文 / 西欧 DOS 默认）",
   "size": 528,
   "b64": "UEsDBBQAAAAAAEV9UlkAAAAAAAAAAAAAAAAHAAAAUoJzdW2CL1BLAwQUAAAACABFfVJZJvHiEgkAAAAHAAAAHAAAAFKCc3Vtgi9MZWJlbnNsYXVmX02BbGxlci50eHTzSMzJyeflAgBQSwMEFAAAAAgARX1SWfT9bo8IAAAABgAAAB4AAABSgnN1bYIvQ2Fmgl9NZW6BX5piZXJzaWNodC50eHTzTc0r5eUCAFBLAwQUAAAACABFfVJZlm1ZSgkAAAAHAAAAFwAAAFKCc3Vtgi+AYV92YV9HYXKHb24udHh0C07MKS3h5QIAUEsBAhQAFAAAAAAARX1SWQAAAAAAAAAAAAAAAAcAAAAAAAAAAAAQAAAAAAAAAFKCc3Vtgi9QSwECFAAUAAAACABFfVJZJvHiEgkAAAAHAAAAHAAAAAAAAAAAACAAAAAlAAAAUoJzdW2CL0xlYmVuc2xhdWZfTYFsbGVyLnR4dFBLAQIUABQAAAAIAEV9Uln0/W6PCAAAAAYAAAAeAAAAAAAAAAAAIAAAAGgAAABSgnN1bYIvQ2Fmgl9NZW6BX5piZXJzaWNodC50eHRQSwECFAAUAAAACABFfVJZlm1ZSgkAAAAHAAAAFwAAAAAAAAAAACAAAACsAAAAUoJzdW2CL4BhX3ZhX0dhcodvbi50eHRQSwUGAAAAAAQABAAQAQAA6gAAAAAA"
  },
  "cp866.zip": {
   "kind": "zip",
   "entries": [
    {
     "name": "Документы/",
     "dir": true,
     "usize": 0,
     "csize": 0,
     "crc": 0,
     "method": 0,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess"
    },
    {
     "name": "Документы/Отчёт за квартал.txt",
     "dir": false,
     "usize": 4,
     "csize": 6,
     "crc": 1408797659,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess",
     "sha": "9f2a59a60e65fbcd5a3e1b7248adf92890ce3a32b19e43fb4751c2657196de13",
     "text": "ok\r\n"
    },
    {
     "name": "Документы/Список сотрудников.txt",
     "dir": false,
     "usize": 4,
     "csize": 6,
     "crc": 1408797659,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess",
     "sha": "9f2a59a60e65fbcd5a3e1b7248adf92890ce3a32b19e43fb4751c2657196de13",
     "text": "ok\r\n"
    }
   ],
   "enc": "cp866",
   "sevenzip_ok": true,
   "sevenzip_errors": [],
   "how": "Python zipfile，文件名 CP866、无标记（俄文 Windows 资源管理器）",
   "size": 406,
   "b64": "UEsDBBQAAAAAAEV9UlkAAAAAAAAAAAAAAAAKAAAAhK6q46ylreLrL1BLAwQUAAAACABFfVJZ24v4UwYAAAAEAAAAHgAAAISuquOspa3i6y+O4ufx4iCnoCCqoqDg4qCrLnR4dMvP5uUCAFBLAwQUAAAACABFfVJZ24v4UwYAAAAEAAAAIAAAAISuquOspa3i6y+Rr6jhrqog4a7i4OOkraiqrqIudHh0y8/m5QIAUEsBAhQAFAAAAAAARX1SWQAAAAAAAAAAAAAAAAoAAAAAAAAAAAAQAAAAAAAAAISuquOspa3i6y9QSwECFAAUAAAACABFfVJZ24v4UwYAAAAEAAAAHgAAAAAAAAAAACAAAAAoAAAAhK6q46ylreLrL47i5/HiIKegIKqioODioKsudHh0UEsBAhQAFAAAAAgARX1SWduL+FMGAAAABAAAACAAAAAAAAAAAAAgAAAAagAAAISuquOspa3i6y+Rr6jhrqog4a7i4OOkraiqrqIudHh0UEsFBgAAAAADAAMA0gAAAK4AAAAAAA=="
  },
  "deflate64-long.zip": {
   "kind": "zip",
   "entries": [
    {
     "name": "long-matches.txt",
     "dir": false,
     "usize": 61004,
     "csize": 10,
     "crc": 3575218131,
     "method": 9,
     "enc": false,
     "crypto": "",
     "dt": [
      1980,
      1,
      1,
      0,
      0,
      0
     ],
     "src": "ascii",
     "sha": "e8d8f41c79e8e8b751870c69492087944d7831061cffb30996ce4eda73043f61"
    }
   ],
   "sevenzip_ok": true,
   "sevenzip_errors": [],
   "how": "手工拼的 Deflate64 流：固定 Huffman 块里用长度码 285（3 + 16 位附加：1000 与 60003），7-Zip 的编码器不会产生这个码",
   "size": 140,
   "b64": "UEsDBBUAAAAJAAAAIQDTfxnVCgAAAEzuAAAQAAAAbG9uZy1tYXRjaGVzLnR4dEscLR8Ao2DqAABQSwECFQAVAAAACQAAACEA038Z1QoAAABM7gAAEAAAAAAAAAAAAAAAAAAAAAAAbG9uZy1tYXRjaGVzLnR4dFBLBQYAAAAAAQABAD4AAAA4AAAAAAA="
  },
  "deflate64.zip": {
   "kind": "zip",
   "entries": [
    {
     "name": "padding.txt",
     "dir": false,
     "usize": 200004,
     "csize": 742,
     "crc": 2654977376,
     "method": 9,
     "enc": false,
     "crypto": "",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "ascii",
     "sha": "b0f40b4a1226dbb35ecb5b6176f0592b0a7d919d53f82e50bc5d4078d0b57522"
    },
    {
     "name": "server.log",
     "dir": false,
     "usize": 251608,
     "csize": 22289,
     "crc": 2549052727,
     "method": 9,
     "enc": false,
     "crypto": "",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "ascii",
     "sha": "0934d796aa1dc450e998d795d5b16f3f03efe609d302ec78ac28308cd10d6c41"
    }
   ],
   "sevenzip_ok": true,
   "sevenzip_errors": [],
   "how": "7-Zip 26.06：-mm=Deflate64（方法 9）",
   "size": 23319,
   "b64": "UEsDBBUAAAAJAEx/c11gvT+e5gIAAEQNAwALAAAAcGFkZGluZy50eHTkwYEAAAAAgCDW/SUGqeLxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB5v8uBAAAAAAADI/7UQ9Hq9Xq/X6/V6vV6v1+v1er1er9fr9Xq9Xq/X6/V6vV6v1+v1er1er9fr9Xq9Xq/X6/V6vV6v1+v1er1er9fr9Xq9Xq/X6/V6vV6v1+v1er1er9fr9Xq9Xq/X6/V6vV6v1+v1er1er9fr9Xq9Xq/X6/V6vV6v1+v1er1er9fr9Xq9Xq/X6/V6vV6v1+v1er1er9fr9Xq9Xq/X6/V6vV6v1+v1er1er9fr9Xq9Xq/X6/V6vV6v1+v1er1er9fr9Xq9Xq/X6/V6vV6v1+v1er1er4c8OBAAAAAAAPJ/LQS9Xq/X6/V6vV6v1+v1er1er9fr9Xq9Xq/X6/V6vV6v1+v1er1er9fr9Xq9Xq/X6/V6vV6v1+v1er1er9fr9Xq9Xq/X6/V6vV6v1+v1er1er9fr9Xq9Xq/X6/V6vV6v1+v1er1er9fr9Xq9Xq/X6/V6vV6v1+v1er1er9fr9Xq9Xq/X6/V6vV6v1+v1er1er9fr9Xq9Xq/X6/V6vV6v1+v1er1er9fr9Xq9Xq/X6/V6vV6v1+v1er1er9fr9Xq9Xq/X6/V6vV6v1+v1er1er9frKQ8OCQAAQBiAeXKCpb98h9ttPB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8XiV+50AUEsDBBUAAAAJAEx/c103de+XEVcAANjWAwAKAAAAc2VydmVyLmxvZ4zfS8qsNRSF4b6jcALil+xLEsGuYEfHoChoQ/AOzt6lou4UxeaV01Pi5TdVu1Y9X7LOfKZ/NJ6PnvHhmJ88j359+PkXn3354c/f/vTbt7/8+uH333z6/P3Hhz9+9et3n3781Y/ff/z7+Pj7X7/94ZcPf/n1q19/++XTqT/79R+/fvvLp88H/y04/15wfPKs9wsOtKCt/1e0v1ecnwx/v+JEKy7/f0X/e0X7ZI73KxpacYzx/5Lx95L+ydzvl3S2pO//l8y/l4xPLN4vGWzJHf8vuf5eMj/x+X7JREvOOf9fcv+95PrEz/slF1syzv9Lnr+X3J9Evl9ysyVP/rukfv295NEP/f2SBy1pZv8v+ffOGY9+vV1ysJ1j6/l/yfn3kuOTsd4vyfaOP+v/Jf/ePPo1/f2SbPO4+/9L+t9L2ic23i/Jdo/v8f+S8feS/ont90uy3RNj/79k/r1kfOLxfkm2eyLi/yXX30vmJzHfL8l2T5z5/5L77yXXJ3HeL8l2T87z/5Ln7yW3tvn7Jdnuyfx/98zn7yWPfujvl2S7Zz32/5J/75756NfbJSfbPcuf/5ecfy85Ppnr/ZJs96y1/l/S/l5yfmL+fkm2e/bw/5f0v5e0T3y8X5Ltnh3j/yXj7yX9E9/vl2S7Z+/9/5L595LxScT7JdnuOTP+X3L9vWTqnfz9kmz3nJz/L7n/XnLphf39kmz3nFPee/75/3Jrm79fku2e8Vi+jETz6Kf+fk22fcaz7GUoske/3q5pbP9ohHlexiIbn9h6vybbQGP4epmLbH7i/n5NtoPG2P4yGJl9EuP9mmwLjTnHy2Rk/kns92uyPTRm7JfRyEIz3Ps12SYa88TLbGSpt/T3a7JdNMzmy3BkS6/w79dk22hYnpfpyLY2/Ps14T7yJ1/GIzv60b9fE+4jd3uZj/zRr7drOtxHvp+XAcnHJ77erwn3UYz1MiH5/CT8/ZpwH0X4y4jkpk9r79eE+yjOeJmR3DW+v18T7qOc+2VI8tA0935NuI8y42VK8tSb+/s14T5az3wZk3zppf79mnAfLTsvc5Jvbfn3a8J9tFa+DEp+9KN/vybcR3vYy6QUj369XTPgPtrxvIxKMT6J9X5NuI/2Xi+zUvz1Uf39mnAfnekvw1KYPrm9XxPuo5PjZVoK1yD/fk24j87ZL+NShOa692uyfTT1xvUyL0XqLf79mmwfzWfNl3kpll7q36/J9tEcz3mZl2Jry79fk+2jOTxf5qU4+tG/X5Ptozm2XfNSl8cl20dKaJ5rXuoiuWT7aM5Y17zUhXLJ9tGcx695qYvlku2jaTaueanL5ZLto2m5r3mpC+YS7iN/4pqXumQu4T5yn9e81EVzCfeRr3PNS102l3AfxchrXurCuYT7KMKuealL5xbcR3Gea17q4rkF91HOdc1LXT634D7K9Gte6gK6BffResY1L3UJ3YL7aNm+5qUuoltwH60V17zUZXQL7qM95jUvdSHdgvto+7nmpS6lW3Af7Z3XvNTFdAvuozPtmpe6nG7DfXTyuealLqjbcB+ds655qUvqNttHpg/617zURXWb7SPTC8M1L3VZ3Wb7yMazr3mpC+s220c2PK55qUvrNttHNva85qUurttsH9kc55qXurxus31kM7LMS31et9k+snmszEt9XnfYPtIXUE+Zl/q87rB9ZJarzEt9XnfgPvLnv32kX31ed+A+ci/vR6PP6w7cR752mZf6vO7AfRQjyrzU53UH7qOIWealPq87cB/FPmVe6vO6A/dRzizzUp/XHbiPMq3MS21eN6BX0LeuT5mX2rxuYLJgq8xLbV43IFqwtcr70dPmdQOyBdtjlHmpzesGdAu2fZd5qc3rBoQLtneUeanN6waUC3bmLPNSm9cNSBfsxCnzUpvXDWgX7Jws81Kb1w2IF1xfjJR5qc3rBtQLrg9SZV5q87pB+YL+w5d5qc3rBvULCv3LvNTmdYMCBgWgZV5q87oBBYMrDCrzUpvXDUgYXB+My7zU5nUDGgbXh4QyL7V53YCIwTUwlXmpzesGVAyuN48yL7V53YCMwbWRrnmpyesGdAyuRa95qcnrBoQM7mtd81KT1w0oGTyGX/NSk9cNSBk8YlzzUpPXDWgZPPa+5qUmrxsQM3jOuOalJq8bUDN45rzmpSavG5AzeJ5zzUtNXjegZ/Blec1LTV43oGfQ/552zUtNXjegZxAqe655qcnrBvQMvn1d81KT1w3oGXxvv+alJq8b0DP4meOal5q8bkDP4Cf2NS81ed2AnsHPiWteavK6AT1DCJJc81KT1w3oGULB8zUvNXndgJ4hNKhe81KT1w3oGfSSXN6Pelc3oGeQpCw5Qw/rBvQMMUeZ63pZN6BniBllrutp3YCeIeYpc11v6wb0DGGzzHU9rhvQM4Rlmet6XTegZwh/ylzX87oBPUO43ba7yesG9Azhq+LuNq8b0DNoDKm6u83rBvQM4sOVd7d53YCeIWJX393mdQN6hshZgXeb1w3oGSKzCu82rxvQM0SeSrzbvG5AzxDLqvFu87oBPUOsVZF3m9cN6BliP1V5t3ndgJ4htlfm3eZ1A3oGjd7Vefd5HfQMMvMVevd5HfQMcaJK7z6vg54hzqnUu8/roGfIx6r17vM66BnyyYq9+7wOeoYcT9XefV4HPUMOr9y7z+ugZ8ixqvfu8zroGXKO6r37vA56Bn3crN67z+ugZ9CDItV793kd9Axps3rvPq+DniEtq/fu8zroGdKf6r37vA56hnSr3rvP66BnSF/Ve/d5HfQMGaN67z6vg54hw6v37vM66BkydvXefV4HPYMiltt7d3kd9Ax6Our23l1eBz1D5rm9d5fXQc+Qy27v3eV10DPkWrf37vI66BlyP7f37vI66Bly++29u7wOeobc+/beXV4HPUOecXvvLq+DniFP3N67y+ugZ1CseHvvLq+DnkGPBN7eu8vroGdYT97eu8vroGdY47m9d5fXQc+wht/eu8vroGdYY93eu8vroGdYc9zeu8vroGdYM27v3eV10DOsuW/v3eV10DMsm7f37vI66BkUpZe5rvd1E3oGPQdb5rre103oGZbXQxh6XzehZ1hej2Hofd2EnmHFuL13k9dN6BlW+O29m7xuQs+wYt/eu8nrJvQMK+ftvZu8bkLPsDJu793kdRN6hpWneu82r5vQM+jro+q927xuQs+gh7+r927zugk9w9pP9d5tXjehZ1jbq/du87oJPcPau3rvNq+b0DOsM6r3bvO6CT3DOlG9d5vXTegZ1jnVe7d53YSeYT+zeu82r5vQM+wnq/du87oJPYO+Mq3eu83rJvQMOvGgeu82r5vQM+yxqvdu87oJPcOeo3rvNq+b0DPsGeX9qPd1E3qGLej//5q9r5vQM2ybZa7rfd2EnmFblrmu93UTeoZt9XyG3tdN6Bm21/MZel83oWfYXs9n6H3dhJ5hRz2fofd1E3qGHV69d5vXTegZduzqvdu8bkLPsHNW793mdRN6hp1RvXeb103oGXae6r3bvG5Cz7CXVe/d5nUTeoa9snrvNq+b0DPs/VTv3eZ1E3oG0Zjbezd53YSeYesf9JqXmrxuQs+wz7i9d5PXTegZ9onbezd53YSeYZ9ze+8mr5vQM8xbezdp3YSaIW/r3WR1E1qG8dzUu4nqJqQMw27p3SR1E0qGsW7o3QR1E0KGOW7n3eR0EzoG/XXXmNTEdBMyhrnLu1Cv6iZUDDZLuNCjugkRg2WZ5XpTN6FhsFNGuZ7UTUgYvJ7I0Iu6CQWD1wMZelA3KWCo5zH0nm5Sv1CPY+g53cR84dbdXToH9ULOG3d34RzECxm37e6yOWgX8ty0u4vmIF1YdsvuLpmDcmHlDbu7YA7Chf3crrvL5aBb2H6z7i6Wg2xhr1t1d6kcVAtnVNTdh3IQLZyoprvP5KBZOKeS7j6Sg2RBo0El3X0kB8mCZG8l3X0kB8mCHsOqpLuP5CBZ0ONNlXT3kRwkC3rEp5LuPpKDZEGPuVTS3UdykCzo8ZFKuvtIDpIFPUJRSXcfyUGyoMcIKunuIzlIFkTpK+nuIzlIFjQPV9LdR3KQLIhpV9LdR3KQLIgqV9LdR3KQLIgAV9LdR3KQLIjBVtLdR3KQLIiCVtLdR3KQLIhYVtLdR3KQLIgZVtLdR3KQLIjaVdLdR3KQLIibVdLdR3KQLOhDYCXdfSQHyYIoUyXdfSQHyYI4TyXdfSQHyYKYTCXdfSQHyYKoSCXdfSQHyYK4RCXdfSQHyYIYQiXdfSQHyYKWq6S7j+QgWdDX0TfpbiI5g2RBX8mWua6/NcIgWVDyUea6/t4Ig2RhjnoEQ39zhEGyMGc9gqG/OsIgWZizHsHQ3x1hkCzMWY9g6C+PMEgWptUjGPrbIwyShWn1+oie0BkkC4qrS7bQEzqDZEGRbZnrekJnkCwouyxzXU/oDJKFGfUIhp7QGSQLM+oRDD2hM0gWZtQjGHpCZ5AszKxHMPSEziBZUBJxk+4moDNIFvSJ/CbdTUJnkCzos+5NupuIziBZ0Oe9m3Q3GZ1BsqDPPDfpbkI6g2RBc/9NupuUziBZ0Dx9k+4mpjNIFjRT3qS7yekMkgXNVTfpboI6g2RB88pNupukziBZ0Hv2TbqbqM4gWdD71k26m6zOIFnQ+8FNupuwziBZ0Gtimev6KyUMkgW9LpS5rr9SwiBZ0N4oc11/pYRBsqD/58pc118pYZAs6L97mev6KyUMkgX9vctc118pYZAsmNUjGPorJQySBbN6pURP6AySBXMrOUNP6AySBfMsc11P6AySBYunzHU9oTNIFizqEQw9oTNIFvRjL3NdT+gMkgXLegRDT+gMkgXLegRDT+gMkgXdJFJJd5vXGSQLtmYl3W1eZxAt2MpKutu8ziBbsP1U0t3mdQbdgm2rpLvN6wzCBdurku42rzMoF+yMSrrbvM4gXdBLXSXdbV5n0C7oK/xKutu8ziBecC1X5qU2rzOoF3R7TiXdbV5nkC/4cyrpbvM6o35hWCXdbV5nFDCMVea6/koJg4LB51Pmuv5KCYOEwWc9gqG/UsKgYfC5b9Ld5XUQMejt/SbdXV4HFYPcyk26u7wOMgadNnOT7i6vg45BN0bdpLvL6yBkcM+bdHd5HZQMHs9Nuru8DlIGD79Jd5fXQcvgsW7S3eV1EDN4jpt0d3kd1AyecZPuLq+DnEEj7U26u7wOegZhrZt0d3kd9Aw6Yekm3V1eBz2Dbkm7SXeX10HP4Ntu0t3lddAz+F436e7yOugZ/IybdHd5HfQMfvwm3V1eBz2Dn32T7i6vg54hnnmT7i6vg55BH+Nu0t3lddAzSCjepLvL66Bn0KliN+nu8jroGXQz4E26u7wOeoaYz426u7wOeoaYfrPuLq+DniHmvl13l9dBzxA2btjd5XXQM4RFld19Xgc9Q9iptLvP66BnUHRRbXef10HPIJZbcXef10HPoJP0qu7u8zroGXQbZuXdfV4HPUPEqr67z+ugZ4gcFXj3eR30DJFRhXef10HPELkr8e7zOugZYs1qvPu8DnqGWFmRd5vXOfQMiuuq8m7zOoeeQRa9Mu82r3PoGXR6ZHXebV7n0DPoBtgKvdu8zqFniONVerd5nUPPEGdX6t3mdQ49Qz6zWu82r3PoGfKJir3bvM6hZ8jnVO3d5nUOPUMOq9y7zescegZF1NV7t3mdQ8+gBzCq927zOoeeQSemlrmuv1LCoWfQrcdlruuvlHDoGdLqEQz9lRIOPUNaPYKhv1LCoWdIq0cw9FdKOPQM6fUIhv5KCYeeIb0ewdBfKeHQM2TIM8BKJg49g76Wwa1MHHoGPXWEe5k49Aw6JRg3M3HoGXTTN65m4tAzZG7czcShZ8g1cTkTh54hV+J2Jg49Q66D65k49Ay5DfczcegZci9c0MShZ9BXkbihiUPPoEftcEUTh55BJ2PjjiYOPYNut8clTRx6hvUEbmni0DOs5+CaJg49wxqGe5o49AxrJC5q4tAzrPngpiYOPcOajquaOPQM+voddzVx6Bn0fCkua+LQM+g0eNzWxKFnUKMDXNfEoWdYPnFfE4eeYXniwiYOPcOKBzc2cegZVhiubOLQM6xYuLKJQ8+wcuDKJg49g8gJrmzi0DPooWpc2cShZ9ANCLiyiUPPoBYTuLKJQ8+w1sGVTRx6hrUNVzZx6BnWXriyiUPPsM6DK5s49AzrOK5s4tAz6EeEK5s49AxiVriyiUPPoJMEcGUTh55Bt37gyiYOPYOae+DKJg49wx6JK5s49Ax7PriyiUPPsKfjyiYOPcOeC1c2cegZtg1c2cShZ9DLEq5s4tAziBbiyiYOPYOOz8CVTRx6Bt10gyubOPQMaquCK5s49Aw7DFc2cegZdixc2cShZ9g5cGUTh55hp+PKJg49w86NK5s49Ax6K8aVTRx6BnFaXNnEoWfQmTG4solDz6DbnXBlE4eeQQ1tcGUTh55hnwdXNnHoGfZxXNnEoWfYZ+PKJg49w8CFTZxqBlzXxKFlOLisiUPJMAx3NXEIGUbiqiYOHcN8cFMTh4xhOi5q4lAxzIV7mjhEDDZwTROHhsECtzRxSBhs45ImDgWDT9zRxCFg8MQVTYL6hQc3NAnKFwwXNAmqFxbuZxIQL+TA9UwC2oV03M4kIF3IjcuZBJQLa+JuJgHhwgpczSSgW1gHNzMJyBa24WImAdXCXriXSUC0cB5cyySgWTiOW5kEJAtn41ImAcWCDr3DpUwCigXdTYlLmQQUCypegUuZBBQLKjSBS5kEFAsq9YBLmQQUCyq2gEuZBBQLOp0PlzIJKBZUmgCXMgkoFhSe4VImAcWCHoDDpUwCigUd9IhLmQQUC7qPFZcyCSgWdDk5LmUSUCzo0m9cyiSgWNDF17iUSUCxoMufcSmTgGJBp/PhUiYBxYIuFsalTAKKBQXGuJRJQLGghz5xKZOAYkGHm+JSJgHFgi4vxaVMAooFXeCJS5kEFAu6GBOXMgkoFnQ5JC5lElAs6IJEXMokoFjQ6Xy4lElAsaDL93Apk4BiQV+S4FImAcWCHnTGpUwCigUd6ItLmQQUC7rgC5cyCSgWdMkVLmUSUCzo8ihcyiSgWNAFSriUSUCxoEuEcCmTgGJBp/PhUiYBxYIuqMGlTAKKBX0xiEuZBBQLergflzIJKBZ0iDUuZRJQLOg+DFzKJKBY0L0QuJRJQLGgKxdwKZOAYkFXD+BSJgHFgo7gx6VMAooFnc6HS5kEFAs64R2XMgkoFvRlOC5lElAs6EALXMokoFjQCdq4lElAsaBTpHEpk4BiQScp41ImAcWCTijGpUwCigWd0otLmQQUCzqpFpcyCSgWdDofLmUSUCzoFFRcyiSgWBAAwaVMAooFHeKCS5kEFAs6ZRKXMgkoFnTSIi5lElAs6LRBXMokoFjQKX64lElAsaCT7HApk4BiQae54VImAcWCTjTDpUwCigX958SlTAKKBaEnXMokoFjQwUW4lElAsaCTmHApk4BiQacR4VImAcWCTuTBpUwCigWddINLmQQ0CzrtBZcyCagWdOIJLmUS0C3o1A9cyiQgXNBLCC5lElAuCPrhUiYB6YJOVcClTALaBZ1WgEuZBMQLemIflzIJqBf01DouZRKQL+hpcFzKJKhfGBOXMgkKGEbiUiYJBYOejMWlTBISBr1t4lImCQ2DcCsuZZIQMejJQ1zKJKFi0BN9uJRJQsagp9pwKZOEjkFPduFSJgkhg56YwqVMEkoGPTWES5kkpAx6cgaXMkloGfT0CC5lkhAzaFTEpUwSagaBblzKJCFnkM7HpUwSegapd1zKJKFnkPzGpUwSegbpZ1zKJKFnkCrGpUwSegbJWlzKJKFnkDHFpUwSegZZS1zKJKFn0McjXMokoWcQ58OlTBJ6BrE2XMokoWeQGMOlTBJ6BskpXMokoWeQH8KlTBJ6BrkcXMokoWeQTcGlTBJ6BvkMXMokoWeQUcClTBJ6BkUCuJRJQs+g779xKZOEnkHfAeNSJgk9g75bxaVMEnoGfb+IS5kk9Az6jg2XMknoGfTdFS5lktAz6PsbXMokoWfQdxi4lElCz6AcH5cySegZFIPhUiYJPYMyYlzKJKFnUE6KS5kk9AzKH3Epk4SeQRkcLmWS0DMoh8KlTBJ6BuU7uJRJQs+gjAOXMknoGfQ5H5cySegZ9FkXlzJJ6Bn0GRKXMknoGfQ5CpcySegZ9FkClzJJ6Bk0o+NSJgk9g+ZUXMokoWfQrIZLmST0DJqBcCmThJ5BcwAuZZLQM+i9EJcySegZ9H6AS5kk9Ax6ncWlTBJ6Br3W4FImCT2D9hsuZZLQM+j/Y1zLJKFn0M8SFzNJ6Bn074ObmST0DPrrcDWThJ4h18DdTBJ6hlyBy5kk9Az6V8ftTBJ6Bn3Fh+uZJPQMehAf9zNJ6Bl0mQYuaJLQM+jSeNzQJKFnULdDXNEkoWfQ788CdzRJ6BnW47ikSULPsJ6NW5ok9AxrTFzTJKFn0HbHPU0SegZ9rY2LmiT0DDp8Ajc1SegZdIEMrmqS0DOoKAHuapLQM6jPJC5rktAz6PckgtuaJPQMyweua5LQMywP3NckoWdYfnBhk4SeQW9xuLFJQs8gyoEbmyT0DDpwBTc2SegZdGkSbmyS0DOoHARubJLQM6jDJ25sktAz6PfhghubJPQMa23c2CShZ1h74sYmCT3D2okbmyzoGTTW4cYmC3oG8SXc2GRBz6BDhnBjkwU9gy4Kw41NFvQMKsSBG5ss6BnUWxU3NlnQM+j3noMbmyzoGfYI3NhkQc+wx8GNTRb0DHsabmyyoGfQRxnc2GRBzyCyhxubLOgZdLAWbmyyoGfQ5Xi4scmCnkElUHBjkwU9g7ra4sYmC3oG/X6LcGOTBT3DjokbmyzoGXYkbmyyoGfY+eDGJgt6Bn18x41NFvQMYqq4scmCnkGHyeHGJgt6Bl0IiRubLOgZVHwGNzZZ0DOonzBubPIno3dqBUAQAkE0pWnOJv/EdkMoh+DhcF/UQs9gDy42WegZ7MPFJgs9gy9xsclCz+BbXGyy0DMI95os1AyFa00WWgbjVpOFkkGBU00WQgY1LjVZ6Bh0ONRkIWOIxJ0mCxVDDM40WYgY8uFKk4WGIQtHmiwkDGncaLJQMJRwoslCwFCNC00W+oU6HGiylC8E7jNZqhcG55ksxAvzcJ3JQrswieNMFtKFWdxmslAurHCayUK4sI3LTBa6hTUOM1nIFhy4y2ShWvDgLJOFaMGHq0wWmoVLHGWykCzc4iaThWJB7+Emk4ViQa9wk8lCsaBn3GSyUCxIgZtMFooFqXGTyUKxIB1uMlkoFhSJm0wWigXF4CaThWJB+XCTyUKxoCzcZLJQLCgXN5ksFAsq4SaThWJB1bjJZKFYUB1uMlkoFtSBm0wWigX14CaThWJB83CTyUKxoEncZLJQLGgWN5ksFAta4SaThWJBW7jJZKFY0Bo3mSwUC3LgJpOFYkEe3GSyUCzIh5tMFooFXeImk4ViQbe4yWShWPgn3GSyUCzEK9xkslAsxDNuMlkoFkLCTSYLxUKocZPJQrEQOtxkslAsRCRuMlkoFiIGN5ksFAuRDzeZLBQLkYWbTBaKhcjFTSYLxUKUcJPJQrEQ1bjJZKFYiDJuMlkoFqIDN5ksFAvRg5tMDMVCzMNNJoZiISZxk4mhWIhZ3GRiKBZihZtMDMVCbOEmE0OxEGvcZGIoFsKBm0wMxUK4cZOJoVgIH24yMRQLcYmbTAzFQtziJhNDsZDv4SYTQ7GQr3CTiaFYyGfcZGIoFlLCTSaGYiHVuMnEUCykDjeZGIqFjMBNJoZiIWNwk4mhWMh8uMnEUCxkFm4yMRQLmYubTAzFQpZwk4mhWMhq3GRiKBayjJtMDMVCduAmE0OxkD24ycRQLGQfbjIxFAs5iZtMDMVCzuImE0OxkCvcZGJoFnILN5kYqoVc4yYTQ7eQDtxkYggX0o2bTAzlQvpwk4khXchL3GRiaBfyBjeZGOKFeg83mRjqhXqFm0wM+UI94yYTY78g3GRiChjUuMnEVDDocJOJIWGoCNxkYmgYKgY3mRgihsqHm0wMFUNl4iYTQ8ZQubjJxNAxVAk3mRhChqrGTSaGkqHKuMnEkDJUB24yMbQM1YObTAwxQ/XhJhNDzVCTuMnEkDPULG4yMfQMtQ83mRh6htrCTSaGnqHWuMnE0DOUAzeZGHqGcuMmE0PPUD7cZGLoGeoSN5kYeoa6wU0mhp6h38NNJoaeoV/hJhNDz9BvcZOJoWdoCTeZGHqGVuMmE0PP0DrcZGLoGToCN5kYeoaOwU0mhp6h8+EmE0PP0Jm4ycTQM3QubjIx9Axdwk0mhp6hq3CTiaFn6DJuMjH0DN2Bm0wMPUP34CYTQ8/QfbjJxNAz9CRuMjH0DD2Lm0wMPUPvw00mhp6ht3CTiaFn6DVuMjH0DG3hJhNDz9Bu3GRi6Bnah5tMDD1DX+ImE0PP0De4ycTQM8x7uMnE0DPMK9xkYugZ5i1uMjH0DCPhJhNDzzBq3GRi6BlGxk0mhp5hInCTiaFnmBjcZHLQM0w+3GRy0DNMJm4yOegZJhc3mRz0DFPCTSYHPcNU4SaTg55hyrjJ5KBnmA7cZHLQM0w3rjI56BmmD3eZHPQMM4nLTA56hpnFaSYHPcN/EreZHPQMs4XjTA56hlnjOpODnmEsnGdy0DOMG/eZHPQM48OBJgc9w1zgQpODnmFucKLJQc+w7+FGk4OeYV/hSJODnuF/I1xpctAzrIQzTQ56hlXjTpODnmFlHGpy0DNsBC41OegZNganmhz0DBuHW00OeobNxLEmBz3D5uJak4OeYUs41+SgZ9gq3Gty0DNsGQebHPQM24GLTQ56hu3GxSYHPcP24WKTg55hJ3GxyUHPsDO42OSgZ9h9uNjkoGfYLVxsctAz7BoXmxz0DGvhYpODnmHduNjkoGdYHy42OegZ9gIXmxz0DHuDi00Oega/h4tNDnoGv8TFJgc9w2/NcbHJQc9gCRebHPQMVuNik4OewTIuNjnoGRyBi00OegbH4GKTg57BcbjY5KBncCYuNjnoGZyLi00OegbXw8UmBz2Dq3CxyUHP4DIuNjnoGdyBi00OegZ342KTg57BfbjY5KBn8CQuNjnoGTyDi00Oegbvw8UmBz2Dt3CxyUHP4F1cbHLQM9jCxSYHPYPduNjkoGewDxebHPQMvsDFJgc9g29wsclBz4BzTQ5ihsSxJgcpw+JUk4OQQcKlJgcdgwqHmhxkDDLuNDmoGCJwpslBxBCDK00OGoY4HGlykDBk4kaTg4IhFyeaHAQM9XChyUG/UIUDTQ7yhTLuMzmqF4TzTI7ihcZ1JkftwuE4k4N0YRK3mRyUCzM4zeQgXNiHy0wOuoUtHGZykC3s4i6Tg2rBwlkmB9GCG1eZHDQLNo4yOUgWLnCTyUGxcEOTTPQgWPgXaZKJHgQLekmTTPQgWNBbmmSiB8GCJJpkogfBglQ0yUQPggXJNMlED4IFRdAkEz0IFhRNk0z0IFhQHE0y0YNgQZk0yUQPggXl0iQTPQgWVI8mmehBsKAqmmSiB8GCyjTJRA+CBbVokokeBAvqpkkmehAsqI8mmehBsKAJmmSiB8GCZmiSiR4EC9pHk0z0IFjQFk0y0YNgQbs0yUQPggVZNMlED4IFuWmSiR4EC7JpkokeBAu6oEkmehAs6IYmmehBsKA7mmSiB8FCvKRJJnoQLMRbmmSiB8FCSDTJRA+ChVDRJBM9CBZCpkkmehAsRARNMtGDYCGiaZKJHgQLEUeTTPQgWIhMmmSiB8FC5NAkEz0IFqIeTTLRg2AhqmiSiR4EC1GmSSZ6ECxEiyaZ6EGwEN00yUQPgoXoo0kmehAsxARNMtGDYCFmaJKJHgQLsY8mmehBsBCbNMlED4KF2KVJJnoQLIRFk0z0IFgIN00y0YNgIWyaZKIHwUJc0CQTPQgW4oYmmehBsBB3NMlED4KFfEmTTPQgWMi3NMlED4KF1KNJJnoQLKSKJpnoQbCQMk0y0YNgISNokokeBAsZTZNM9CBYyDiaZKIHwUJm0iQTPQgWMocmmehBsJD1aJKJHgQLWUWTTPQgWMhammSiB8FCtmiSiR4EC9lNk0z0IFjIPppkogfBQk7QJBM9CBZyhiaZ6EGwkPtokokeNQubNMlED6qF3KVJJnrQLaRFk0z0IFxIF00y0YNyIW2aZKIH6UJe0CQTPWgX8oYmmehBvJB3NMlED+qFekmTTPQgX6i3NMlEj/oFPZpkokcBg4ommehRwSDTJBM9SBgqRJNM9KBhqGiaZKIHEUPF0SQTPagYKpMmmehBxlA5NMlEDzqGqkeTTPQgZKgqmmSiByVD1dIkEz1IGapFk0z0oGWobppkogcxQ7Vpkoke1Aw1QZNM9CBnqBmaZCJBz1D7aJKJBD1DbdIkEwl6htqlSSYS9Axl0SQTCXqGctEkEwl6hrJpkokEPUNd0CQTCXqGuqZJJhL0DHVHk0wk6Bn6JU0ykaBn6Lc0yUSCnqH1aJKJBD1Dq2iSiQQ9Q8s0yUSCnqFDNMlEgp6ho2mSiQQ9Q8fRJBMJeobOoEkmEvQMnUOTTCToGboeTTKRoGfoKppkIkHP0LU0yUSCnqFbNMlEgp6hu2mSiQQ9Q7dpkokEPUNP0CQTCXqGnqFJJhL0DD1Hk0wk6Bl6kyaZSNAz9C5NMpGgZ2iLJplI0DO0iyaZSNAztE2TTCToGfqCJplI0DP0NU0ykaBn6DuaZCJBzzAvaZKJBD3DvKFJJhL0DKNHk0wk6BlGRZNMJOgZRqZJJhL0DBOiSSYS9AwTTZNMJOgZJo4mmUjQM0wGTTKRoGeYHJpkIkHPMPVokokEPcNU0iQTCXqGqaVJJhL0DNOiSSYS9AzTTaNMJOgZpk2zTCToGWaChplI0DPMDC0zkaBnmDmaZiJBzzCbtM1Egp5hdmmciQQ9w/jROhMJeoZx0TwTCXqGsWmfiQQ9w1zQQBMJeoa5poUmEvQMc0cTTSToGfYlbTSRoGfYNzTSRIKeYfVopYkEPcOqaKaJBD3DammniQQ9w4ZoqIkEPcNG01ITCXqGjaOpJhL0DJtBW00k6Bk2h8aaSNAzbD1aayJBz7CVNNdEgp5ha2mviQQ9w7ZosIkEPcN20WATCXqGbdNgEwl6hp2gwSYS9Aw7Q4NNJOgZdo4Gm0jQM+wmDTaRoGfYXRpsIkHPsH402ESCnmFdNNhEgp5hbRpsIkHPsCcabCJBz7DXNNhEgp5h72iwiQQ9g1/SYBMJega/ocEmEvQM1qPBJhL0DFbRYBMJegZrabCJBD2DQzTYRIKewdE02ESCnsFhGmwiQc/gDBpsIkHP4BwabKKAnsH1aLCJAnoGV9JgEwX0DK6lwSYK6BncosEmCugZ3EWDTRTQM7hNg00U0DN4ggabKKBn8DQNNlFAz+A5GmyigJ7BmzTYRAE9g3dpsIkCegb70WATBfQMdtFgEwX0DLZpsIkCegafaLCJAnoGX9NgEwX0DL6jwSYK6BmC5poooGYYGmuigJZBj7aaKCBlUNFUEwWUDFpaaqKAkCFEQ00U0DFE004TBWQMYZppooCKIYNWmiggYsihkSYKaBjyaKOJAhKGSppoooCCoZYWmigoYBANNFFQv1C0z0SB+QLNM1FAvTBB60wUEC9M0zgTBbQLc7TNRAHpwiZNM1FAubBDy0wUEC740TATBXQLLtplooBswaZZJgqoFk60ykQB0cI1jTJRQLNwR5tMFJAs/ESdNpkoIFnQG9pkooBk4afKtMlEAcmClLTJRAHJgrS0yUQByYJCtMlEAcmCommTiQKSBYVpk4kCkgVl0CYTBSQLyqFNJgpIFpRHm0wUkCyokjaZKCBZUC1tMlFAsqB+tMlEAcmCumiTiQKSBbVpk4kCkgVN0CYTBSQLmqZNJgpIFjRHm0wUkCxokzaZKCBZ0A5tMlFAsiA/2mSigGRBLtpkooBkQV7aZKKAZEEn2mSigGRB17TJRAHJgu5ok4kCkoX/HG0yUUCyEG9ok4kCkoXQo00mCkgWQkmbTBSQLISWNpkoIFmIEG0yUUCyEFG0yUQByUKEaZOJApKFyKBNJgpIFiKHNpkoIFmIPNpkooBkISppk4kCkoWopU0mCkgWoh9tMlFAshBdtMlEAclCtGmTiQKShRjRJhMFJAsxTZtMFJAsxBxtMlFAshCbtMlEAclC7NAmEwUkC+FHm0wUkCyEizaZKCBZCC9tMlFAshAn2mSigGQhrmmTiQKShTjTJhMFJAv5gjaZKCBZyDe0yUQJyULq0SYTJSQLqaRNJkpIFlJLm0yUkCxkiDaZKCFZyCjaZKKEZCHDtMlECclCZtAmEyUkC5lNm0yUkCxkHm0yUUKykJW0yUQJyULW0iYTJSQL2Y82mSghWcgu2mSihGQh27TJRAnJQo5ok4kSkoWcpk0mSkgWco42mSghWcgN2mSihGghd2iTiRKyhfSjTSZK6BbSRZtMlBAupJc2mSihXMgTbTJRQrqQ17TJRAntQp5pk4kS4oV6QZtMlFAv1BvaZKKEfKHe0SYTJfULStpkoqSAQUubTJRQMFSINpkoIWGoKNpkooSGocK0yUQJEUNl0CYTJVQMlU2bTJSQMVQebTJRQsdQlbTJRAkhQ9XQJhMllAzVjzaZKCFlqC7aZKKElqHatMlECTFDjWiTiRJqhpqmTSZKyBlqjjaZKKFnqA3aZKKEnqF2aJOJEnqG8qNNJkroGcpJm0yU0DOUlzaZKKFnqBNtMlFCz1DXtMlECT1DnWmTiRJ6hn5Bm0yU0DP0G9pkooSeod/RJhMl9AytpE0mSugZWkubTJTQM3Q82mSihJ6ho2iTiRJ6hg7TJhMl9AydQZtMlNAzdDZtMlFCz9B5tMlECT1DV9ImEyX0DF1Dm0yU0DN0P9pkooSeobtok4kSeobupU0mSugZekSbTJTQM/Q0bTJRQs/Qc7TJRAk9Q2/QJhMl9Ay9Q5tMlNAztB9tMlFCz9BO2mSihJ6hvbTJRAk9Q59ok4kSeoa+ok0mSugZ+kybTJTQM8wL2mSihJ5h3tAmEyX0DPOONpkooWcYJW0yUULPMFraZKKEnmHi0SYTJfQME0WbTJTQM0yYNpkooWeYFG0yUULPMNm0yUQJPcPk0SYTJfQMU0mbTJTQM0wNbTJRQs8w/WiTiRJ6humiWSZK6Bmml4aZKKFnmBFNM1FCzzDTtM1ECT3DjGmciRJ6htmgdSZK6Blmh+aZqKBnGD/aZ6KCnmGcNNBEBT3DeGmhiQp6hjnRRBMV9AxzRRtNVNAzzJlGmqigZ9gXtNJEBT3DvqaZJiroGfYd7TRRQc+wShpqooKeYbW01EQFPcPGo6kmKugZNoq2mqigZ9gwjTVRQc+wKVprooKeYbNprokKeobNo70mKugZtoIGm6igZ9gaWmyigp5h++Fkk4KeYbtwsklBz7C9ONmkoGfYEU42KegZdhonmxT0DDvGySYFPcNu4GSTgp5hd3CySUHPsHs42aSgZ1gnTjYp6BnWi5NNCnqGPeFkk4KeYa9wsklBz7BnnGxS0DP4BU42KegZ/BonmxT0DH6Hk00KegYrcbJJQc9gDU42KegZHA8nmxT0DI7CySYFPYPDONmkoGdwCiebFPQMzsbJJgU9g/NwsklBz+AKnGxS0DO4BiebFPQM7oeTTQp6BnfiZJOCnsG9ONmkoGfwCCebFPQMnsbJJgU9g8c42aSgZ/gYvWMCAIIQiIGWYA9Y8G/sX0K6iEgxa2GyScGfYT2YbFLwZ1gfJpsU/Bl2HyabFPwZdo3JJgV/hr3AZJOCP8NeYbJJwZ9hbzHZpODPIAw2KXozYK5JwZfhMNak4MmQD1tNCo4MOZhqUvBjUGCpScGNQYWhJgUvBhk7TQpODC8x06Tgw/AaK00KLgzvMNKk4MFQwkaTggNDDSaaFP0XAgtNiu4LDwNNit4Lxj6TgvPCJOaZFHwXprDOpOC6MItxJgXPBQvbTAqOCx5MMyn4LfiwzKTgtrAPw0wKXgtr7DIpOC1cYJZJwWfhCqtMCi4LtxhlUvBYyEiMMil4LGQ0RpkUPBYyDqNMCh4LmQ+jTAoeC5mDUSYFj4VUYJRJwWMhVRhlUvBYSBmjTAoeC/kSo0wKHgv5GqNMCh4L+RajTAoeC1nCKJOCx0LWYJRJw2MhOzDKpOGxkP0wyqThsZBtjDJpeCzkJEaZNDwWcgqjTBoeCzmLUSYNj4W0MMqk4bGQbowyaXgspA+jTBoeC7kPo0waHgu5xiiThsdCXmCUScNjIa8wyqThsZC3GGXS8FhQJEaZNDwWFI1RJg2PBcVhlEnDY0EpjDJpeCwoB6NMGh4LUmCUScNjQSqMMml4LEjGKJOGx4JeYpRJw2NBrzHKpOGxoLcYZdLwWFAJo0waHguqwSiThseC6jDKpOGxoH4YZdLwWFAbo0waHguaxCiThseCpjDKpOGxoFmMMml4LMjCKJOGx4LcGGXS8FiQD6NMGh4L2odRJg2PBe1glEnDY0EXGGXS8FjQFUaZNDwWdItRJg2PhReJUSYNj4UXjVEmDY+FF4dRJg2PhZfCKJOGx8LLwSiThsfCU2CUScNj4elhlEnDY+HJGGXS8Fh4LzHKpOGx8F5jlEnDY+G9xSiThsfCK2GUScNj4dVglEnDY+HVYZRJw2Ph9cMok4bHwmtjlEnDY+FNYJRJw2PhTWGUScNj4c1ilEnDY+FZGGXS8Fl4bowyaXgtPB9GmTT8Ft4+jDJpOC68HYwyaXguvAuMMmm4LrwrjDJp+C68M0aZNJwXKhKjTBreCxWNUSYN94WKwyiTpv9CCqNMmg4MORhl0vBgKAVGmTRcGEoPo0waPgwlY5RJw4mhXmKUScOLoV5hlEnDjaHeYpRJw4+hShhl0nBkqBqMMml4MlQdRpk0XBmqH0aZNHwZqo1RJg1nhprAKJOGN0NNYZRJw52hZjHKpOHPUE6MMmn4M5Qbo0wa/gzlwyiThj9D7cMok4Y/Q+1glEnDn6EuMMqk4c9QVxhl0vBnqDNGmTT8GToSo0wa/gwdjVEmDX+GjsUok4Y/Q6cwyqThz9A5GGUy8GdoBUaZDPwZWg+jTAb+DC1jlMnAn6FfYpTJwJ+hX2GUycCfod9ilMnAn6FLGGUy8GfoaowyGfgzdB1GmQz8GbofRpkM/Bm6jVEmA3+GnsAok4E/Q09hlMnAn6FnMcpk4M/QTowyGfgztBujTAb+DO3DKJOBP0OvMMpk4M/QOxhlMvBn6AuMMhn4M/QVRpkM/Bn6jFEmA3+GicQok4E/w0RjlMnAn2FiMcpk4M8wKYwyGfgzTA5GmQz8GSYPo0wG/gyjh1EmA3+GkTHKZODPMC8xymTgzzCvMMpk4M8wbzHKZODPMCWMMhn4M0w1RpkM/BmmDqNMBv4M0w+jTAb+DNODWSYDf4aZwDCTgT/DTGGZycCfYWYxzWTgzzBObDMZ+DOMG+NMBv4M48M6k4E/w6wwz2TgzzA72Gcy8GeYCww0GfgzzD0sNBn4M8wZE00G/gyOxEaTgT+DozHSZODP4FisNBn4MziFmSYDfwbnYKfJwJ/BeRhqMvBnsB6Wmgz8GSxjqsnAn8EvsNVk4M/gVxhrMvBn8FusNRn4M7iEuSYDfwZXY6/JwJ/BdRhsMvBncD8sNhn4M7gHi00G/gyewGKTgT+Dp7DYZODP4DEWmwz8GezEYpOBP4PdWGwy8GewD4tNBv4MXmGxycCfwTtYbDLwZ/AFFpsM/Bl8D4tNBv4MPmOxycCfYSOx2GTgz7BRWGwy8GfYWCw2GfgzbAqLTQb+DJuDxSYDf4bNw2KTgT/D6mGxycCfYWUsNhn4M+wLLDYZ+DPsKyw2Gfgz7FssNhn4M2wlFpsM/Bm2GotNBv4MW4fFJgN/hu2HxSYDf4btwWKTgT/DTmCxycCfYaew2GTgz7BjLDYZ+DOsE4tNBv4M68Zik4E/w3qx2GTgz7ArLDYZ+DPsDhabGP4Me4HFJoY/w97DYhPDn2HPWGxi+DMk9poY3gyFtSaGL8Niq4nhyZDCVBPDkSEbS00MP4Y8DDUx3Bj0sNPE8GKQMdPEcGJ4gZUmhg/DK4w0MVwY3mKjieHBUImJJoYDQzUWmhj+C3UYaGK6Lwj7TEzvhcE8E8N5YQLrTAzfhSmMMzFcF8bYZmJ4LjgxzcRwXHBjmYnht+DFMBPDbWGFXSaG18IOZpkYTgt7WGVi+CzcwygTw2XhjE0mhsdCRmKTieGxkFHYZGJ4LGQsNpkYHguZwiYTw2Mhs7HJxPBYyDxsMjE8FlIPm0wMj4XUYJOJ4bGQL7DJxPBYyFfYZGJ4LORbbDIxPBayEptMDI+FrMYmE8NjIeuwycTwWMgWNpkYHgvZg00mhsdCTmCTieGxkPOwycTwWMgxNpkYHgvpxCYTw2Mh3dhkYngspBebTAyPhVxhk4nhsZA72GRieCzkHjaZGB4LeQ+bTAyPhTxjk4nhsfAXNpkYHguKwiYTw2NBsdhkYngsKIVNJobHgrKxycTwWFAeNpkYHgvSwyYTw2NBGmwyMTwW9AKbTAyPBb3CJhPDY0HP2GRieCyoEptMDI8FVWOTieGxoDpsMjE8FtTCJhPDY0E92GRieCxoAptMDI8FzcMmE8NjQWNsMjE8FuTEJhPDY0EubDIxPBbkxSYTw2NBK2wyMTwWtINNJobHgvawycTwWNA9bDIxPBZ0xiYTw2PhRWCTieGx8KKwycTwWHix2GRieCy8TGwyMTwWXjY2mRgeCy8Pm0wMj4Wnh00mhsfC02CTieGx8F5gk4nhsfBeYZOJ4bHwnrHJxPBYeJXYZGJ4LLxqbDIxPBZeLTaZGB4Lr4VNJobHwuvBJpOFx8KbwCaThcfCm4dNJguPhTfGJpOFx8JzYpPJwmfhubDJZOG18LzYZLLwW3grbDJZOC68bWwyWXguvD1sMlm4Lrx72GSy8F14Z2wyWTgvVAQ2mSy8FyoKm0wW7gsVi00mi/+FxCaTpQNDNjaZLD0Y8rDJZOHCUBI2mSx8GEqDTSYLJ4Z6gU0mCy+GeoVNJgs3hnrGJpOFH0NVYpPJwpGhqrHJZOHJULXYZLJwZagWNpksfBmqB5tMFs4M1YdNJgtvhpqHTSYLd4YaY5PJwp+hnNhksvBnKBc2mSz8GcqLTSYLf4ZaYZPJwp+htrHJZOHPUHvYZLLwZ6h72GSy8GeoG2wyWfgzdAQ2mSz8GToKm0wW/gwdi00mC3+GzsQmk4U/Q2djk8nCn6HzsMlk4c/QEjaZLPwZWoNNJgt/hn6BTSYLf4Z+D5tMFv4M/YxNJgt/hq7EJpOFP0NXY5PJwp+ha7HJZOHP0C1sMln4M3QPNpks/Bm6D5tMFv4MPQ+bTBb+DD3GJpOFP0M7sMlk4c/QLmwyWfgztBebTBb+DL3CJpOFP0NvY5PJwp+h97DJZOHP0PewyWThz9A32GSy8GeYCGwyWfgzTBQ2mSz8GSaMTSYLf4bJxCaThT/DZGOTycKfYfKwyWThzzASNpks/BlGg00mC3+GeYFNJgt/hnkPm0wW/gzzjE0mC3+GqcQmk4U/w1Rhk8nCn2Fqsclk4c8wLWwyWfgzTA9WmSz8GaYPu0wW/gwzD8tMFv4MM8Y0k4U/wziwzWThzzAujDNZ+DOMF+tMFv4Ms4l5Jgt/htnGPpOFP8PsYaDJwp9h7mGhycKfYW4w0WThz+AIbDRZ+DM4CiNNFv4MDmOlycKfwZmYabLwZ3A2dpos/Bmci6EmC38GS1hqsvBnsAZTTQ7+DH6BrSYHfwa/h7EmB38GP2OtycGfwZWYa3LwZ3AV9poc/Blci8EmB38Gt7DY5ODP4G4sNjn4M7gPi00O/gyeh8UmB38Gj7HY5ODPYAcWmxz8GezCYpODP4O9WGxy8GfwJhabHPwZvI3FJgd/Bu9hscnBn8EnLDY5+DP4BotNDv4MG4HFJgd/ho3CYpODP8OGsdjk4M+wmVhscvBn2GwsNjn4M2wuFpsc/BlWwmKTgz/DarDY5ODPsDosNjn4M+x7WGxy8GfYZyw2OfgzbCUWmxz8GbYKi00O/gxbi8UmB3+GbWGxycGfYbux2OTgz7B9WGxy8GfYeVhscvBn2BksNjn4M6wDi00O/gzrwmKTgz/DerHY5ODPsJtYbHLwZ9htLDY5+DPsHhabHPwZ9oTFJgd/hr3BYpODPwPmmhycGR7GmhxcGYypJgdHhkwsNTn4MWRjqMnBjSEXO00OXgwSZpocnBg0WGly8GHQYaTJwYXhPWw0OXgwPGOiycGBoQILTQ7+C1UYaHJwX6jFPpOj94Iwz+TovNBYZ3L0XTiMMzm4LszDNpOD58IMppkcHBccWGZy8FtwYZjJwW3Bxi6Tg9fCJmaZHJwWtrHK5OCzsIdRJgeXhRM2mRw8Fm4wyeTgsJARmGRycFjIeJhkcnBYyDAmmRwcFjITk0wODguZhUkmB4eFzMUkk4PDQkqYZHJwWEgNJpkcHBZSh0kmB4eFfA+TTA4OC/mMSSYHh4WswCSTg8NCVmGSycFhIWsxyeTgsJCdmGRycFjIbkwyOTgsZB8mmRwcFnIeJpkcHBZyBpNMDg4L6cAkk4PDQrowyeTgsJA2JpkcHBZyE5NMDg4LuY1JJgeHhdzFJJODw0KeMMnk4LCQN5RkooDDwl+UZKKAw4LiUZKJAg4LClOSiQIOC8qkJBMFHBaURUkmCjgsKJeSTBRwWJBESSYKOCxITUkmCjgsSEdJJgo4LOg9SjJRwGFBz5RkooDDgiooyUQBhwVVUZKJAg4LqqUkEwUcFtRJSSYKOCyom5JMFHBYUB8lmSjgsKARJZko4LCgGUoyUcBhQQ5KMlHAYUEuSjJRwGFBNiWZKOCwoE1KMlHAYUHblGSigMOCdinJRAGHBZ0oyUQBhwXdUJKJAg4LuqMkEwUcFl48SjJRwGHhhSnJRAGHhZdJSSYKOCy8LEoyUcBh4eVSkokCDgtPoiQTBRwWnpqSTBRwWHg6SjJRwGHhvUdJJgo4LLw3lGSigMPCq6AkEwUcFl4VJZko4LDwainJRAGHhddJSSYKOCy8bkoyUcBh4fVRkokCDgtvREkmCjgsvBlKMlHAYeE5KMlEQZ8FP0oyUcBr4dmUZKKA38LbpCQTBRwX3jYlmSjgufB2KclEAdeFd6IkEwV8F94NJZko4Lzw7ijJRAHvhYpHSSYKuC9UmJJMFPRfyKAkEwUdGLIoyURBD4ZcSjJRwIWhJEoyUcCHodSUZKKAE0PpKMlEAS+Geo+STBRwY6g3lGSigB9DVVCSiQKODFVFSSYKeDJUmZJMFHBlqE5KMlHAl6G6KclEAWeG6qMkEwW8GWpESSYKuDPUDCWZKODPUA5KMlHAn6H8KMlEAX+GsinJRAF/htqkJBMF/Blqi5JMFPBnqF1KMlHAn6FOlGSigD9D3VCSiQL+DHVHSSYK+DN0PEoyUcCfocOUZKKAP0NnUJKJAv4MnUVJJgr4M3QuJZko4M/QSkoyUcCfodWUZKKAP0PrKMlEAX+Gfo+STBTwZ+g3lGSigD9DV1CSiQL+DF1FSSYK+DN0mZJMFPBn6E5KMlHAn6G7KclEAX+G7qUkEwX8GXpESSYK+DP0DCWZKOHP0A5KMlHCn6H9KMlECX+GtinJRAl/ht6kJBMl/Bl6i5JMlPBn6F1KMlHCn6FPlGSihD9DX1OSiRL+DH1HSSZK+DNMPEoyUcKfYcKUZKKEP8NkUJKJEv4Mk0VJJkr4M0wuJZko4c8wSkoyUcKfYdSUZKKEP8PoKMlECX+GeaIkEyX8GeYNJZko4c8wFZRkooQ/w1RRkokS/gxTpiQTJfwZppOSTJTwZ5huijJRwp9heinLRAl/hhlRmIkS/gwzQ2UmSvgzzBylmSjhzzB+1GaihD/D2BRnooQ/w2xSnYkS/gyzRXkmSvgzzC71mSjhzzAnCjRRwp9hrqnQRAl/hrmjRBMl/BkcjxpNlPBncAxFmijhz+AMqjRRwp/BWZRpooQ/g3Op00QJfwYrKdRECX8Gq6nURAl/Buso1UQJfwY/UauJEv4MfkOxJkr4M7iCak2U8GdwPco1UcKfwWXqNVHCn8GdFGyihD+DuynYRAl/BvdSsIkS/gweUbCJEv4MnqFgEyX8GTxHwSZK+DPYj4JNlPBnsE3BJkr4M3iDgk2U8GfwFgWbKOHP4F0KNlHCn8EnCjZRwp/B1xRsooQ/g+8o2EQJf4aNR8EmSvgzbAwFmyjhz7AZFGyihD/DZlGwiRL+DJumYBMl/BlWScEmSvgzrJqCTZTwZ1gdBZso4c+wTxRsooQ/w76hYBMl/Bm2goJNlPBn2HoUbKKEP8OWKdhECX+G7aRgEyX8GbaLgk2U8GfYXgo2+Ri9gwKAgRAGgpZKAoHzb6wW1sc8RgU9w0U0bKKCnuESGjZRQc9weTRsooKe4dY0bKKCnuF2adhEBT3D3UfDJiroGe6ahk1U0DPcHQ2bqKBnuFc0bKKCnuHe0LCJCnqGe4+GTVTQM5h2TVRQM4RmTVTQMtRHryYqSBmqadVEBSVDLZ2aqCBkUNGoiQo6Bg19mqggY9DRpokKKgaLLk1UEDE4NGkiQcPQHz2aSJAwtGnRRIKCoZcOTSQKGIoGTSTqF5r+TCTMF2jPRIJ6IaI7EwnihQzNmUjQLuTRm4kE6cKa1kwkKBd26cxEgnDhPhozkaBbuKYvEwmyhTvaMpGgWnhFVyYSRAtvaMpEgmbhPXoykSBZqE/0ZCJBslBf6MlEgmSh6qMnEwmShaqmJxMJkoWqpScTCZKFUtGTiQTJQmnoyUSCZKF09GQiQbJQFj2ZSJAslENPJhIkC+VHTyYSJAvVpicTCZKF6qUnEwmShZqiJxMJkoWapicTCZKFmqMnEwmShYroyUSCZKEy9GQiQbJQefRkIkGyUGt6MpEgWagNPZlIkCzUffRkIkGyUNf0ZCJBslB39GQiQbJQr+jJRIJkod7Qk4kEyUK9R08mEiQL+kRPJhIkC/pCTyYSJAuqj55MJEgWVKYnEwmSBdXSk4kEyYJU9GQiQbIgDT2ZSJAsSEdPJhIkC7LoyUSCZEEOPZlIkCzIj55MJEgW1KYnEwmSBfXSk4kEyYLmoycTCZIFTdOTiQTJguboyUSCZEERPZlIkCwoQ08mEiQLyqMnEwmSBa3pyUSCZEEbejKRIFnQffRkIkGyoGt6MpEgWdAtPZlIkCzoFT2ZSJAs6A09mUiQLOg9ejKRIFnwJ3oykSBZ8Bd6MpEgWXB99GQiQbLgMj2ZSJAsuJaeTCRIFqyiJxMJkgWr6clEgmTBOnoykSBZsEVPJhIkC3boyUSCZMF+9GQiQbLgNj2ZSJAsuJeeTCRIFjwfPZlIkCx4mp5MJEgWPEdPJhIkC07Rk4kEyYIz9GQiQbLgPHoykShZWNOTiQTRgjf0ZCJBtuD76MlEgm7B1/RkIkG44Ft6MpGgXPArejKRIF3wG3oykaBd8Dt6MpEgXuhP9GQiQb3QX+jJRKZ8oT56MpGpXyjTk4lMAUMtPZnIUDC0ip5MZEgYWk1PJjI0DK2jJxMZIoa26MlEhoqhPfRkIkPG0H70ZCJDx9BtejKRIWToXnoykaFk6PnoyUSGlKGn6clEhpah5+jJRIaYoVP0ZCJDzdAZejKRIWfoPHoykaFn6BU9mcjQM/SGnkxk6Bn6PnoykaFn6Gt6MpGhZ+hbejKRoWfoV/RkIkPP0G/oyUSGnqHf0ZOJDD3DfKInExl6hvlCTyYy9AzzPXoykaFnmDI9mcjQM0wtPZnI0DOMip5MZOgZRk1PJjL0DKOjJxMZeoax6MlEhp5hPPRkIkPPMH70ZCJDzzBtejKRoWeYDj2ZyNAzzHz0ZCJDzzDT9GQiQ88wc/RkIkPPMCl6MpGhZ5gMPZnI0DNMHj2ZyNAzzIqeTGToGWZDTyYy9AxzHz2ZyNAzzJmeTGToGeaWnkxk6BnmFT2ZyNAzzBt6MpGhZ5h39GQiQ8+QT/RkIkPPkC/0ZCJDz5Dv0ZOJDD1DyvRkIkPPkFp6MpGhZ4g+ejKRoWeImp5MZOgZoqMnExl6hlj0ZCJDzxAPPZnI0DPEj55MZOgZ0qYnExl6hnToyUSGniHz0ZOJDD1DpmnLRIaeIbM0ZiJDz5AUrZnI0DMkQ28mMvQMyaM5Exl6hqzozkSGniEb2jORoWfIffRnIkPPkDMNmsjQM+SWDk1k6BnyihZNZOgZ8poeTWToGfKOJk1k6Bn2E12ayNAz7BfaNJGhZ9jv0aeJDD3DlmnURIaeYWvp1ESGnmH10aqJDD3DqunVRIaeYXU0ayJDz7AuujWRoWdYD+2ayNAzrB/9msjQM2ybhk1k6Bm2Q8cmMvQMOx8tm8jQM+w0LZvI0DPsLC2byNAzbIqWTWToGTZDyyYy9Aybo2UTGXqGXdGyiQw9w25o2UQNPcPeR8smaugZ9kzLJmroGfaWlk3U0DPsK1o2UUPPsK9p2UQNPcO+o2UTNfQM94mWTdTQM9w3tGyihp7hvkfLJmroGa5MyyZq6BmulpZN1NAznD5aNlFDz3BqWjZRQ89wOlo2UUPPcC5aNlFDz3AeWjZRQ89wfrRsooae4Vq0bKKGnuE6tGyihp7h5sNlk4ae4aZx2aShZ7hZXDZp6BkuhcsmDT3DZXDZpKFnuBwumzT0DLfCZZOGnuE2uGzS0DPcPlw2aegZ7ozLJg09w93isklDz3CvcNmkoWe417hs0tAz3DtcNmnoGYTDJk01A+6aNLQMD2dNGkqGMr6aNIQMFVw1aegY9OGpSUPGoMZRk4aKQYefJg0Rgws3TRoaBg9emjQkDH44adJQMLTw0aQhYOjgoklTv/DhoUlTvmAcNGmqFxb/TBrihRTumTS0Cxm8M2lIF3I4Z9JQLqzwzaQhXNjgmklDt7APz0wasoUzjpk0VAu3+GXSEC28D7dMGpqF13hl0pAsvMMpk4ZioT7hlElDsVDf4JRJQ7FQ38Mpk4Zioco4ZdJQLFQFp0waioXSh1MmDcVCqXHKpKFYKC1OmTQUC+XCKZOGYqE8OGXSUCyUH06ZNBQL1cIpk4ZioTo4ZdJQLNR8OGXSUCzUGKdMGoqFmsUpk4ZioVI4ZdJQLFQap0waioXK4ZRJQ7FQK5wyaSgWaoNTJg3FQu3DKZOGYqHOOGXSUCzULU6ZNBQL9T6cMmkoFuo1Tpk0FAv1DqdMGooFfYVTJg3Fgr7BKZOGYkHfwymThmJBZZwyaSgWVMEpk4ZiQfpwyqShWJAap0waigVpccqkoViQC6dMGooFeXDKpKFYkA+nTBqKBbVwyqShWFAHp0wGigXNh1MmA8WCxjhlMlAsaBanTAaKBaVwymSgWFAap0wGigXlcMpkoFjQCqdMBooF7eCUyUCxoH04ZTJQLOiMUyYDxYJuccpkoFjQ+3DKZKBY0GucMhkoFvQOp0wGigV/hVMmA8WCv8Epk4Fiwd/DKZOBYsElnDIZKBZcwSmTgWLB+nDKZKBYsBqnTAaKBWtxymSgWLALp0wGigV7cMpkoFiwD6dMBooFt3DKZKBYcAenTAaKBffDKZOBYsFjnDIZKBY8i1MmA8WCUzhlMlAsOI1TJgPFgnM4ZTJQLHiFUyYDzYJ3cMpkoFrwPpwyGegWfMYpk4FwwRecMhkoF/w+nDIZSBf8GqdMBtoFv8Mpk4F4ob/CKZOBeqG/wSmTgXyhv4dTJkP9QgmnTIYChgpOmQwUDK0Pp0wGEoaWccpkoGFoLU6ZDEQM7cIpk4GKoT04ZTKQMbQPp0wGOoZu4ZTJQMjQHZwyGSgZuh9OmQykDD3GKZOBlqFnccpkIGbofDhlMlAzdBqnTAZyhs7hlMlAz9ArnDIZ6Bl6B6dMBnqG3odTJgM9Q59xymSgZ+gLTpkM9Az9PpwyGegZ+jVOmQz0DP0Wp0wGeob5CqdMBnqG+QanTAZ6hvkeTpkM9AxTwimTgZ5hKjhlMtAzjD6cMhnoGUbGKZOBnmG0OGUy0DOMC6dMBnqGceOUyUDPMD6cMhnoGaaFUyYDPcN0cMpkoGeYfjhlMtAzzBinTAZ6hpnFKZOBnmHy4ZTJQM8waZwyGegZJodTJgM9w2zhlMlAzzA7OGUy0DPMPpwyGegZ5oxTJgM9w1xwymSgZ5j34ZTJQM8wr3HKZKBnmLc4ZTLQM+QrnDIZ6BnyDU6ZDPQM+Q6nTAZ6hpRwymSgZ0gFp0wCPUP04ZRJoGeIjFMmgZ4hWpwyCfQMceGUSaBniBunTAI9Q3w4ZRLoGdLCKZNAz5AenDIJ9Azph1MmgZ4hY5wyCfQMmcUtk0DPkHw4ZhLoGZLGM5NAz5AcrpkEeoZs4ZtJoGfIDs6ZBHqG7MM7k0DPkBPumQR6hlzwzyTQM+R9OGgS6BnyGg9NAj1D3uKiSaBn2K/w0STQM+w3OGkS6Bn2O7w0CfQMW8JNk0DPsBX8NAn0DFsPR00CPcPKeGoS6BlWi6smgZ5hXfhqEugZ1o2zJoGeYX14axLoGbaFuyaBnmF78Nck0DNsPxw2CfQMO8Zjk0DPsBM8Ngn0DJsPj00CPcOm8dgk0DNsDo9NAj3DbuGxSaBn2B08Ngn0DLsPj00CPcOe8Ngk0DPsBY9NAj3Dvg+PTQI9wz7jsUmgZ9i3eGwS6BnuKzw2CfQM9w0emwR6hvsOj00CPcOV8Ngk0DNcBY9NAj3D1cNjk0DPcDIemwR6htPisUmgZzh/eGwS6BnOjccmgZ7hfHhsEugZroXHJoGe4Xrw2CTQM1w/PDYJ9Aw3xmOTQM9wEzw2CfQMlw+PTQI9w6Xx2CTQM1wWj00CPcNt4bFJoGe4HTw2CfQMtw+PTQI9w53w2CTQM9wFj00CPcO9D49NAj3DPeOxSaBnuLd4bBLoGQp/TQI1Q+OtSaBlOHw1CZQMJVw1CYQMFTw1CXQM9XDUJJAxyPhpEqgYtLhpEogY/OGlSaBhcOOkSSBh8OGjSaBg6MJFk0DA0IOHJoF+oR8OmoTyBeOfSaheCO6ZBOKFfHhnEmgX0jhnEkgXsvhmEigXtnDNJBAu7OCZSaBb2MMxk0C2cMIvk0C1cMEtk4Vo4X14ZbLQLDzjlMlCsvAWn0wWioX6Cp9MFoqF+hqfTBaKhfoOn0wWioUq4ZPJQrFQNfhkslAsVD18MlkoFkrGJ5OFYqG0+GSyUCyUP3wyWSgWyo1PJgvFQvnwyWShWKgufDJZKBaqB59MFoqF6odPJgvFQo3wyWShWKgJPpksFAuVD59MFoqFSuOTyUKxUFl8MlkoFmoLn0wWioXawSeThWKh9vDJZKFYqBM+mSwUC3XBJ5OFYqHu4ZPJQrFQz/hkslAs1Ft8MlkoFvQVPpksFAv6Gp9MFooFfYdPJgvFgkr4ZLJQLKgGn0wWigXVwyeThWJBMj6ZLBQLUvDJZKFYkD98MlkoFuTGJ5OFYkE+fDJZKBbUhU8mC8WCevDJZKFYUD98MlkoFjTCJ5OFYkETfDJZKBaUD59MFooFxfhkslAsKItPJgvFgrbwyWShWNAOPpksFAvawyeThWJBJ3wyWSgWdMEnk4ViQffwyWShWNAzPpksFAt6i08mC8WCvw+fTBaKBX+NTyYLxYK/wyeThWLBJXwyWSgWXINPJgvFguvhk8lCsWAZn0wWigUr+GSyUCzYHz6ZLBQLduOTyUKxYC8+mSwUC+7CJ5OFYsE9+GSyUCy4Hz6ZLBQLHuGTyUKx4Ak+mSwUC86HTyYLxYJjfDJZKBacxSeThWLBW/hkstAseBufTBaqBe/hk8lCt+ATPpkshAu+4JPJQrnge/hkspAu+BmfTBbaBb/FJ5OFeKG/D59MFuqF/hqfTBbyhf4On0wW+4XCJ5OlgKEGn0yWCoZ6+GSykDC0jE8mCw1DK/hkshAxtD98MlmoGNqNTyYLGUN78clkoWPoLnwyWQgZugefTBZKhu7DJ5OFlKFH+GSy0DL0BJ9MDmKGzodPJgc1Q8f4ZHKQM3QWn0wOeobewieTg56ht/HJ5KBn6D18MjnoGfqETyYHPUPf4JPJQc/Q9/DJ5KBn6Gd8MjnoGfotPpkc9AzzffhkctAzzNf4ZHLQM8x3+GRy0DNMFT6ZHPQMU4NPJgc9w9TDJ5ODnmEkfDI56BlGwSeTg55h/OGTyUHPMG58MjnoGcaLTyYHPcN04ZPJQc8wPfhkctAzTB8+mRz0DDPCJ5ODnmEm+GRy0DPMPHwyOegZJsYnk4OeYbL4ZHLQM8wWPpkc9AyzjU8mBz3D7OGTyUHPMCd8MjnoGeYGn0wOeoa5h08mBz3DPOOTyUHPMC/4ZHLQM+T78MnkoGfI1/hkctAz5Dt8MjnoGVKFTyYHPUNq8MnkoGdIPXwyOegZIuGTyUHPEAWfTA56hvjDJ5ODniE2Ppkc9Azx4pPJQc+QLnwyOegZ0oNPJgc9Q/rwyeSgZ8gIn0wOeoZM8MrkoGfIPPwyOegZEuOZyUHPkCyumRz0DNkP30wOeoZs45zJQc+QPbwzOegZcsI9k4OeITf4Z3LQM+QeDpoc9Ax5xkOTg54hL7hoctAz7Pfho8lBz7Bf46TJQc+w3+KlyUHPsFW4aXLQM2wNfpoc9AxbD0dNDnqGlfDU5KBnWAVXTQ56hvWHryYHPcPaOGty0DOsF29NDnqG7cJdk4OeYbvx1+SgZ9g+HDY56Bl2hMcmBz3DTvDY5KBn2Hl4bHLQM2yMxyYHPcNm8djkoGfY/fDY5KBn2G08NjnoGXYPj00Oeoa9wmOTg55hb/DY5KBn2Ht4bHLQM+wzHpsc9Az7gscmBz3DfR8emxz0DPc1Hpsc9Az3LR6bHPQMV4XHJgc9w9XgsclBz3B1eGxy0DOchMcmBz3DKXhs8qBnOH94bPKgZzgbj00e9AznxWOTBz3DdeGxyYOe4brx2ORBz/A3eucEDARBDARzozlpv2n+xEyheVRQs0ePTZCeYU712ATpGeYcPTZBeoY56LEJ0jPMXXpsgvQMc58emyA9w7xPj02QnmHe1mMTpGeYN3psgvQMM9FjE6RnmDl6bIL0DDPosQnSMwzVYxOkZxiuHpsgPYPumiAxw9ZZEyRleLpqgoQMiZ6aIB1Djo6aIBlDRj9NkIqh1U0TJGLo1UsTpGEoOmmCJAxr6aMJUjCsp4smSMCwo4cmSL+wtw6aIPnCHv0zweqF6p4JFi8cvTPB2gV0zgRJF+7SNxOkXLhX10yQcOF9emaCdAtv65gJki280S8TpFqY6JYJEi3M0SsTpFkYdMoESRaoPpkgxQJXl0yQYCHfp0smSLCQb+mSCRIs5Hu6ZIIEC0l0yQQJFpKjSyZIsJCMLpkgwUJaXTJBgoX06pIJEiyk6JIJEixkLV0yQYKFrKdLJkiwkP3pkgkSLGRvXTJBgoXs0SUTJFjIqS6ZIMFCztElEyRYyEGXTJBgIXfpkgkSLOReXTJBgoW8T5dMkGAhb+uSCRIs5D1dMkGChUx0yQQJFjJHl0yQYCGDLpkgwUKoLpkgwUK4umSCBAv9Pl0yQYKFfkuXTJBgod/TJRMkWGiiSyZIsNBsXTJBgoVmdMkECRba6pIJEiy0V5dMkGChRZdMkGCha+mSCRIsdD1dMkGChe5Pl0yQYKF765IJEix0jy6ZIMFCT3TJBAkWeo4umSDBQg+6ZIIEC71Ll0yQYKH36pIJEiz0fbpkggQLfVuXTJBgoe/pkgkSLHSiSyZIsNA5umSCBAud0SUTJFgo1SUTJFgod/3+UEsBAj8DFQAAAAkATH9zXWC9P57mAgAARA0DAAsAJAAAAAAAAAAggKSBAAAAAHBhZGRpbmcudHh0CgAgAAAAAAABABgAueBUwPt33QEAAAAAAAAAAAAAAAAAAAAAUEsBAj8DFQAAAAkATH9zXTd175cRVwAA2NYDAAoAJAAAAAAAAAAggKSBDwMAAHNlcnZlci5sb2cKACAAAAAAAAEAGABB21TA+3fdAQAAAAAAAAAAAAAAAAAAAABQSwUGAAAAAAIAAgC5AAAASFoAAAAA"
  },
  "euckr.zip": {
   "kind": "zip",
   "entries": [
    {
     "name": "회의록/",
     "dir": true,
     "usize": 0,
     "csize": 0,
     "crc": 0,
     "method": 0,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess"
    },
    {
     "name": "회의록/프로젝트 일정표.txt",
     "dir": false,
     "usize": 12,
     "csize": 15,
     "crc": 2323544844,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess",
     "sha": "daeff416be0f672c3ba1f3016700998808388ea46428c6432f783d1f4d585262"
    },
    {
     "name": "회의록/예산 보고서.csv",
     "dir": false,
     "usize": 5,
     "csize": 7,
     "crc": 2528915835,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess",
     "sha": "fbf6b30113a4b6418c623a96ed6844f17ef5751b908a16abaa919d0bcd6b7784",
     "text": "a,b\r\n"
    }
   ],
   "enc": "euc-kr",
   "sevenzip_ok": true,
   "sevenzip_errors": [],
   "how": "Python zipfile，文件名 CP949、无标记（韩文 Windows）",
   "size": 382,
   "b64": "UEsDBBQAAAAAAEV9UlkAAAAAAAAAAAAAAAAHAAAAyLjAx7fPL1BLAwQUAAAACABFfVJZDHt+ig8AAAAMAAAAGgAAAMi4wMe3zy/HwbfOwafGriDAz8Gkx6UudHh023di8/Pj5/fs2f+ElwsAUEsDBBQAAAAIAEV9Ull7MbyWBwAAAAUAAAAWAAAAyLjAx7fPL7+5u+oguriw7bytLmNzdkvUSeLlAgBQSwECFAAUAAAAAABFfVJZAAAAAAAAAAAAAAAABwAAAAAAAAAAABAAAAAAAAAAyLjAx7fPL1BLAQIUABQAAAAIAEV9UlkMe36KDwAAAAwAAAAaAAAAAAAAAAAAIAAAACUAAADIuMDHt88vx8G3zsGnxq4gwM/BpMelLnR4dFBLAQIUABQAAAAIAEV9Ull7MbyWBwAAAAUAAAAWAAAAAAAAAAAAIAAAAGwAAADIuMDHt88vv7m76iC6uLDtvK0uY3N2UEsFBgAAAAADAAMAwQAAAKcAAAAAAA=="
  },
  "evil.zip": {
   "kind": "zip",
   "entries": [
    {
     "name": "../../evil.sh",
     "dir": false,
     "usize": 21,
     "csize": 23,
     "crc": 2763438754,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "ascii",
     "sha": "cebf25e0668376ce72d60cc05894de697b174396e5036fdb525363c351bf1f9b",
     "text": "#!/bin/sh\necho pwned\n"
    },
    {
     "name": "/etc/abs.txt",
     "dir": false,
     "usize": 9,
     "csize": 11,
     "crc": 2960731428,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "ascii",
     "sha": "db7525aebe28ce382736a6b5f6b056f6e2f6a7a6682a25277be794e91b409a40",
     "text": "absolute\n"
    },
    {
     "name": "dir\\sub\\win.txt",
     "dir": false,
     "usize": 10,
     "csize": 12,
     "crc": 3825024358,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "ascii",
     "sha": "e6f805fa5fc041ab4bb7aa119641f77ac3e9f42106bc9f92354080692736c8de",
     "text": "backslash\n"
    },
    {
     "name": "CON.txt",
     "dir": false,
     "usize": 9,
     "csize": 11,
     "crc": 1206912996,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "ascii",
     "sha": "1b94452a31c02ccc8384d5546f35e9fcafb05982b6e4d69298088f9644df6aa1",
     "text": "reserved\n"
    },
    {
     "name": "what?.txt",
     "dir": false,
     "usize": 9,
     "csize": 11,
     "crc": 2735054157,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "ascii",
     "sha": "feee2e29ecd09e792a3ab9590b8e7c5537e1f85f786c61b50f64e3129da038b7",
     "text": "question\n"
    },
    {
     "name": "Readme.md",
     "dir": false,
     "usize": 2,
     "csize": 4,
     "crc": 1215202725,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "ascii",
     "sha": "06f961b802bc46ee168555f066d28f4f0e9afdf3f88174c1ee6f9de004fc30a0",
     "text": "A\n"
    },
    {
     "name": "README.md",
     "dir": false,
     "usize": 2,
     "csize": 4,
     "crc": 1665390182,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "ascii",
     "sha": "c0cde77fa8fef97d476c10aad3d2d54fcc2f336140d073651c2dcccf1e379fd6",
     "text": "B\n"
    },
    {
     "name": "dup.txt",
     "dir": false,
     "usize": 4,
     "csize": 6,
     "crc": 4162300063,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "ascii",
     "sha": "2c8b08da5ce60398e1f19af0e5dccc744df274b826abe585eaba68c525434806",
     "text": "one\n"
    },
    {
     "name": "dup.txt",
     "dir": false,
     "usize": 4,
     "csize": 6,
     "crc": 2518091892,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "ascii",
     "sha": "27dd8ed44a83ff94d557f9fd0412ed5a8cbca69ea04922d88c01184a07300a5a",
     "text": "two\n"
    },
    {
     "name": "link-to-etc",
     "dir": false,
     "usize": 4,
     "csize": 6,
     "crc": 149022127,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "ascii",
     "sha": "2824684de3d1a19390ca88cf826e77c6f750657e552edb83d466666c37521a08",
     "text": "/etc"
    },
    {
     "name": "zeros.bin",
     "dir": false,
     "usize": 62914560,
     "csize": 61155,
     "crc": 3536249867,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "ascii",
     "sha": "cf5ac69ca412f9b3b1a8b8de27d368c5c05ed4b1b6aa40e6c38d9cbf23711342"
    }
   ],
   "sevenzip_ok": true,
   "sevenzip_errors": [],
   "how": "Python zipfile 手工造：../、绝对路径、反斜杠、CON、非法字符、大小写冲突、重名、符号链接、60 MB 全零（压缩率 1000:1 以上）",
   "size": 62323,
   "b64": "UEsDBBQAAAAIAEV9UlmiurakFwAAABUAAAANAAAALi4vLi4vZXZpbC5zaFNW1E/KzNMvzuBKTc7IVygoz0tN4QIAUEsDBBQAAAAIAEV9UlkkLXmwCwAAAAkAAAAMAAAAL2V0Yy9hYnMudHh0S0wqzs8pLUnlAgBQSwMEFAAAAAgARX1SWWY9/eMMAAAACgAAAA8AAABkaXJcc3ViXHdpbi50eHRLSkzOLs5JLM7gAgBQSwMEFAAAAAgARX1SWeQH8EcLAAAACQAAAAcAAABDT04udHh0K0otTi0qS03hAgBQSwMEFAAAAAgARX1SWU2dBaMLAAAACQAAAAkAAAB3aGF0Py50eHQrLE0tLsnMz+MCAFBLAwQUAAAACABFfVJZpYVuSAQAAAACAAAACQAAAFJlYWRtZS5tZHPkAgBQSwMEFAAAAAgARX1SWWbWQ2MEAAAAAgAAAAkAAABSRUFETUUubWRz4gIAUEsDBBQAAAAIAEV9UlmfqBf4BgAAAAQAAAAHAAAAZHVwLnR4dMvPS+UCAFBLAwQUAAAACABFfVJZdAgXlgYAAAAEAAAABwAAAGR1cC50eHQrKc/nAgBQSwMEFAAAAAgARX1SWa/l4QgGAAAABAAAAAsAAABsaW5rLXRvLWV0Y9NPLUkGAFBLAwQUAAAACABFfVJZC+TG0uPuAAAAAMADCQAAAHplcm9zLmJpbuzBAQEAAACAkP6v7ggKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACA2YMDAQAAAAAg/9dGUFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWEPDgQAAAAAgPxfG0FVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWFPTgQAAAAAADyf20EVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFfbgQAAAAAAAyP+1EVRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVXYgwMBAAAAACD/10ZQVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVYQ8OBAAAAACA/F8bQVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVYU9OBAAAAAAAPJ/bQRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUV9uBAAAAAAADI/7URVFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVdiDAwEAAAAAIP/XRlBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVhDw4EAAAAAID8XxtBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVhT04EAAAAAAA8n9tBFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRX24EAAAAAAAMj/tRFUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV2IMDAQAAAAAg/9dGUFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWkPDkgAAAAABP1/3Y9QAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgL1BLAQIUABQAAAAIAEV9UlmiurakFwAAABUAAAANAAAAAAAAAAAAAACAAQAAAAAuLi8uLi9ldmlsLnNoUEsBAhQAFAAAAAgARX1SWSQtebALAAAACQAAAAwAAAAAAAAAAAAAAIABQgAAAC9ldGMvYWJzLnR4dFBLAQIUABQAAAAIAEV9UllmPf3jDAAAAAoAAAAPAAAAAAAAAAAAAACAAXcAAABkaXJcc3ViXHdpbi50eHRQSwECFAAUAAAACABFfVJZ5AfwRwsAAAAJAAAABwAAAAAAAAAAAAAAgAGwAAAAQ09OLnR4dFBLAQIUABQAAAAIAEV9UllNnQWjCwAAAAkAAAAJAAAAAAAAAAAAAACAAeAAAAB3aGF0Py50eHRQSwECFAAUAAAACABFfVJZpYVuSAQAAAACAAAACQAAAAAAAAAAAAAAgAESAQAAUmVhZG1lLm1kUEsBAhQAFAAAAAgARX1SWWbWQ2MEAAAAAgAAAAkAAAAAAAAAAAAAAIABPQEAAFJFQURNRS5tZFBLAQIUABQAAAAIAEV9UlmfqBf4BgAAAAQAAAAHAAAAAAAAAAAAAACAAWgBAABkdXAudHh0UEsBAhQAFAAAAAgARX1SWXQIF5YGAAAABAAAAAcAAAAAAAAAAAAAAIABkwEAAGR1cC50eHRQSwECFAMUAAAACABFfVJZr+XhCAYAAAAEAAAACwAAAAAAAAAAAAAA/6G+AQAAbGluay10by1ldGNQSwECFAAUAAAACABFfVJZC+TG0uPuAAAAAMADCQAAAAAAAAAAAAAAgAHtAQAAemVyb3MuYmluUEsFBgAAAAALAAsAZgIAAPfwAAAAAA=="
  },
  "gnu.tar": {
   "kind": "tar",
   "entries": [
    {
     "name": "very_long_directory_name_for_testing_gnu_longname_support/",
     "dir": true,
     "usize": 0,
     "type": "dir",
     "link": "",
     "mtime": 1795075103,
     "mode": 493
    },
    {
     "name": "very_long_directory_name_for_testing_gnu_longname_support/very_long_directory_name_for_testing_gnu_longname_support/",
     "dir": true,
     "usize": 0,
     "type": "dir",
     "link": "",
     "mtime": 1795075103,
     "mode": 493
    },
    {
     "name": "very_long_directory_name_for_testing_gnu_longname_support/very_long_directory_name_for_testing_gnu_longname_support/final_file_name_that_is_long.txt",
     "dir": false,
     "usize": 21,
     "type": "file",
     "link": "",
     "mtime": 1795075103,
     "mode": 420,
     "sha": "502bcac6464d607c57a4f5e906822da3284dc6697f29953654d02b6778b4e9ab"
    }
   ],
   "how": "bsdtar --format=gnutar：路径 > 100 字节，走 GNU ././@LongLink（L 类型）",
   "size": 5120,
   "b64": "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bG9hZAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
  },
  "mac-ditto.zip": {
   "kind": "zip",
   "entries": [
    {
     "name": "旅行计划/",
     "dir": true,
     "usize": 0,
     "csize": 0,
     "crc": 0,
     "method": 0,
     "enc": false,
     "crypto": "",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "guess"
    },
    {
     "name": "旅行计划/.DS_Store",
     "dir": false,
     "usize": 208,
     "csize": 13,
     "crc": 1462673768,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "guess",
     "sha": "98fcd25b40afc89c6e6b3097957b1c7150a6184bb39187cbc9a3034a56e77957",
     "text": "\u0000\u0000\u0000\u0001Bud1\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000"
    },
    {
     "name": "__MACOSX/",
     "dir": true,
     "usize": 0,
     "csize": 0,
     "crc": 0,
     "method": 0,
     "enc": false,
     "crypto": "",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "ascii"
    },
    {
     "name": "__MACOSX/旅行计划/",
     "dir": true,
     "usize": 0,
     "csize": 0,
     "crc": 0,
     "method": 0,
     "enc": false,
     "crypto": "",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "guess"
    },
    {
     "name": "__MACOSX/旅行计划/._.DS_Store",
     "dir": false,
     "usize": 163,
     "csize": 86,
     "crc": 3075118499,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "guess",
     "sha": "1909ac9e427f6a9ae02d2c882133887730c18ae67e09ca02e2228fa7524ab470"
    },
    {
     "name": "旅行计划/行程.md",
     "dir": false,
     "usize": 632,
     "csize": 86,
     "crc": 3792501696,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "guess",
     "sha": "799d5feed44af64824ce5207470394e38564c7536a29a03feda3a611ede06814",
     "text": "# 京都五日\n\n- 第一天：清水寺、二年坂\n- 第二天：岚山竹林\n# 京都五日\n\n- 第一天：清水寺、二年坂\n- 第二天：岚山竹林\n# 京都五日\n\n- 第一天：清水寺、二年坂\n- 第二天：岚山竹林\n# 京都五日\n\n- 第一天：清水寺、二年坂\n- 第二天：岚山竹林\n# 京都五日\n\n- 第一天：清水寺、二年坂\n- 第二天：岚山竹林\n# 京都五日\n\n- 第一天：清水寺、二年坂\n- 第二天：岚山竹林\n# 京都五日\n\n- 第一天：清水寺、二年坂\n- 第二天：岚山竹林\n# 京都五日\n\n- 第一天：清水寺、二年坂\n- 第二天：岚山竹林\n"
    },
    {
     "name": "__MACOSX/旅行计划/._行程.md",
     "dir": false,
     "usize": 240,
     "csize": 152,
     "crc": 3835915306,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "guess",
     "sha": "c59e8aa442c8a43fc3c8b3ba6fc4f58de4c916db45d7eb0c81df0675e9350c96"
    },
    {
     "name": "旅行计划/预算.csv",
     "dir": false,
     "usize": 38,
     "csize": 41,
     "crc": 1049052855,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "guess",
     "sha": "b2a52c2e876e48dcf1f90a113e1158eca1249de22b72436e61fd119f661ca26f",
     "text": "项目,金额\n机票,3200\n住宿,4100\n"
    },
    {
     "name": "__MACOSX/旅行计划/._预算.csv",
     "dir": false,
     "usize": 241,
     "csize": 153,
     "crc": 2218999564,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "guess",
     "sha": "7ba19d3555609201522066711609725a7f417518cb2edbb8556b3f45f54d92e4"
    },
    {
     "name": "旅行计划/照片/",
     "dir": true,
     "usize": 0,
     "csize": 0,
     "crc": 0,
     "method": 0,
     "enc": false,
     "crypto": "",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "guess"
    },
    {
     "name": "旅行计划/照片/金阁寺.png",
     "dir": false,
     "usize": 115,
     "csize": 112,
     "crc": 669945785,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "guess",
     "sha": "9e5ba6f6f7acdaba9844d1b45b0142f448f1e1d3822b9ae4a31090af72a796ef"
    },
    {
     "name": "__MACOSX/旅行计划/照片/",
     "dir": true,
     "usize": 0,
     "csize": 0,
     "crc": 0,
     "method": 0,
     "enc": false,
     "crypto": "",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "guess"
    },
    {
     "name": "__MACOSX/旅行计划/照片/._金阁寺.png",
     "dir": false,
     "usize": 251,
     "csize": 164,
     "crc": 2053505008,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "guess",
     "sha": "0e91ecfe9e4caa3cbc3a4512ecf66d9c3f44fbc5eb7755d78761e02fdcea5b03"
    },
    {
     "name": "__MACOSX/旅行计划/._照片",
     "dir": false,
     "usize": 163,
     "csize": 86,
     "crc": 3075118499,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "guess",
     "sha": "1909ac9e427f6a9ae02d2c882133887730c18ae67e09ca02e2228fa7524ab470"
    }
   ],
   "enc": "utf-8",
   "sevenzip_ok": true,
   "sevenzip_errors": [],
   "how": "ditto -c -k --sequesterRsrc --keepParent（macOS Finder「压缩」同款）：UTF-8 文件名不打标记，带 __MACOSX 与 .DS_Store",
   "size": 3249,
   "b64": "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"
  },
  "multi.gz": {
   "kind": "gz",
   "entries": [
    {
     "name": "multi",
     "dir": false,
     "usize": 540,
     "sha": "56361d8a2352fd5996294e09daf9bb8e442662d4fdb8725be6949e33625dce30",
     "type": "file",
     "text": "part one\npart one\npart one\npart one\npart one\npart one\npart one\npart one\npart one\npart one\npart one\npart one\npart one\npart one\npart one\npart one\npart one\npart one\npart one\npart one\npart one\npart one\npa"
    }
   ],
   "how": "zlib 两个独立 gzip 成员首尾拼接（gzip 规范允许，cat a.gz b.gz 同款）",
   "size": 68,
   "b64": "H4sIAAAAAAACEytILCpRyM9L5SoYZaRyAQCOkIMFDgEAAB+LCAAAAAAAAhMrSCwqUSgpz+cqGGXkcwEAhGKn4w4BAAA="
  },
  "notes.txt.gz": {
   "kind": "gz",
   "entries": [
    {
     "name": "读书笔记.txt",
     "dir": false,
     "usize": 1180,
     "sha": "89a982e75887aa859e628e77cbf20e9d156bfa2f46359daa227c4168e2fa08f5",
     "type": "file",
     "text": "第一章\n人生而自由，却无往不在枷锁之中。\n第一章\n人生而自由，却无往不在枷锁之中。\n第一章\n人生而自由，却无往不在枷锁之中。\n第一章\n人生而自由，却无往不在枷锁之中。\n第一章\n人生而自由，却无往不在枷锁之中。\n第一章\n人生而自由，却无往不在枷锁之中。\n第一章\n人生而自由，却无往不在枷锁之中。\n第一章\n人生而自由，却无往不在枷锁之中。\n第一章\n人生而自由，却无往不在枷锁之中。\n第一章\n人生而自由，却"
    }
   ],
   "how": "gzip -9（gzip 头里记录原文件名「读书笔记.txt」）",
   "size": 113,
   "b64": "H4sICB+s/moCA+ivu+S5pueslOiusC50eHQAe75mzZMdDc9XL+B6smvX8ynzXzT0vGhf9XzKxvd7ep72bnk2fcHTfQ1PdvQ+nbPi2bztL6c0PtnZ/WTH2scNTVzPR7WOah3VOqqVVloBjPJArZwEAAA="
  },
  "pax.tar.gz": {
   "kind": "tgz",
   "entries": [
    {
     "name": "项目归档/",
     "dir": true,
     "usize": 0,
     "type": "dir",
     "link": "",
     "mtime": 1795075103,
     "mode": 493
    },
    {
     "name": "项目归档/第一部分_需求分析与总体设计/",
     "dir": true,
     "usize": 0,
     "type": "dir",
     "link": "",
     "mtime": 1795075103,
     "mode": 493
    },
    {
     "name": "项目归档/说明链接",
     "dir": false,
     "usize": 0,
     "type": "symlink",
     "link": "README.txt",
     "mtime": 1795075103,
     "mode": 493
    },
    {
     "name": "项目归档/关于二〇二四年度部门预算执行情况与下一年度重点工作安排的说明及附件材料汇总清单.txt",
     "dir": false,
     "usize": 13,
     "type": "file",
     "link": "",
     "mtime": 1795075103,
     "mode": 420,
     "sha": "9af780c2a4a6158ad58460215863fd0e29f555ff62dfdc7cea178d5d11f93ce2"
    },
    {
     "name": "项目归档/README.txt",
     "dir": false,
     "usize": 15,
     "type": "file",
     "link": "",
     "mtime": 1795075103,
     "mode": 420,
     "sha": "3bea42395c8873b430ac21ef8068a04882c23e5cbea5fcbb53fe5d7e82ae5ee3"
    },
    {
     "name": "项目归档/第一部分_需求分析与总体设计/第二章_系统架构与模块划分说明/",
     "dir": true,
     "usize": 0,
     "type": "dir",
     "link": "",
     "mtime": 1795075103,
     "mode": 493
    },
    {
     "name": "项目归档/第一部分_需求分析与总体设计/第二章_系统架构与模块划分说明/第三节_数据库表结构与索引设计详细说明.md",
     "dir": false,
     "usize": 300,
     "type": "file",
     "link": "",
     "mtime": 1795075103,
     "mode": 420,
     "sha": "f12c0991b75e0cc87d20555eefbc53bea07ff880022495617bcd44c9b3278294"
    }
   ],
   "how": "bsdtar 3.5.3 --format=pax -czf：中文长路径（> 100 字节）、符号链接",
   "size": 1082,
   "b64": "H4sIAB+s/moAA+1az08bRxR2e/Qf0a6aUw+Y+T32gQNpkYJK1ZRIlXpCW9g0lmJArhtx4IAIBEjAjaCUpiS0TpXUUlOnKCQBu+Q/6aX1ztr/RWe9VshaOyyQXSdb7yfZu9bM8+zuN+99b+btRX3mgqFPGPn+ZunA2q6Yh+ui9GsiUAAAOKVa68icI0DEOdrAGGmQIs4pYgBzDUCOEUloM8Fehje+/aag5+WlXJ2aPLaf7Hb58jHtzq1oL48RAULatF64MvAq+/1JDLTxQjZnDECeoZI8CHAqQxmmOI2x3ap7tAKIEeB2a05tS7k2Mnx+cPSjC8NfDKVm9EIhnxqfyqX06emrRmo6P3XNmNQnx42Bwc+HB0eNkYlPLg0bn51PJ0lGuySNRr48zuiddxND//z94Qfvpd9PvuknGw24eA9pDD//t/3F7f+UIJ7QaEjX40KP+7+L/4svxcB69Ki+P9e8XjaXb4w1786J3Xl5JnZu1/eLYq5WP9xoVF40KqUTjeHHPwHYzb+MFQzF8b8bYNgj/p+UfaVQyDMCqVIoCM5QpVC0bWOh6ArOxvvpxjh1/MeYMBbH/25AEf8bj/fEj8XmxgtRfPDaY/jm/4S5+UeYxfG/O8DEI/6/yr5yLcAIz0BViMcUQsbUa4FWaxzi3zyUvAc4xqnjP8KYS/9Ho0ODH386lCrMFAK8mg70uP8fhXxz8Um9WqxXV/+dW5Lf5va2ebBnVh/KdKC5VW7eX7AqW2Llt0ZpVVxfNG88lTlBff+WzBfa3ZbWrPkD8/mD+uFds7IiiuvWTwtyQiVaj4YRouafyh8u/mWEQCDi8T+87bRAAYmXAIQ0F2RwMb+72byzUK89E/duix/uiN0lmViK/UVzbdP2c6XaIMJBWqU2KAOxsy/lqTaObaw2XgifaX//B5C6/Z8BhGBCA914AD3u/21nbDlgpCZujECgWP8Fmnn5+T8mHfqPIOA84vofEWCv+s8R+yo9RgxjdSUIoTQlUKXHbdtYj98GKHgPdAx//eed9V+IcMT1PyLQ8+NXstcMLS/jfs6IXaXXcOItf3dtsLpq/f7LmPWkZtV+FjvPxM6C3b9cMu9tmcvr8h+cNYAzht/+D6Ed+7+UMBB1/Y9I/g9B+nUKgKeYC/1JlPHMJaBM94iyVsiJXQ2Upl6phGMaZxJnR/i0n2H/V57b9Z+4/hc+Ol75WGncnB8Tm3+KtYpZ3WiUylZtw2HW2rtv/rXp8N94/NCqtflN5Sb8xvDd/6Xu9/8ggMCu//5v4n8ojhXM7UPGuhX/zz7BVKtQmCGAKGuQELJj3kds2/a6doTn9Ufw839CO/Z/OJfcRXz9FxH/P3dOs74vi+XnkvVkclYz/9gSlafarGbt1sydW9pscravr6/1ka3ZCdnyVfbr7GRBtvSabTBPPEaMGDHeDvwHZdY0BAA0AAA="
  },
  "sfx.exe": {
   "kind": "zip",
   "entries": [
    {
     "name": "setup/readme.txt",
     "dir": false,
     "usize": 540,
     "csize": 540,
     "crc": 2729559747,
     "method": 0,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "ascii",
     "sha": "aa04339d53ceb4af197e1a82437c431c9c83e13e1adb210cb9820ffa2a65e498",
     "text": "Installer payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\nInstaller payload\n"
    },
    {
     "name": "setup/安装说明.txt",
     "dir": false,
     "usize": 270,
     "csize": 270,
     "crc": 2459190213,
     "method": 0,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "flag",
     "sha": "bdea360e3e5d3150572b4a2d59400b86ddddf745da3f683092199e941509115e",
     "text": "双击 setup.exe 安装。\n双击 setup.exe 安装。\n双击 setup.exe 安装。\n双击 setup.exe 安装。\n双击 setup.exe 安装。\n双击 setup.exe 安装。\n双击 setup.exe 安装。\n双击 setup.exe 安装。\n双击 setup.exe 安装。\n双击 setup.exe 安装。\n"
    }
   ],
   "sevenzip_ok": true,
   "sevenzip_errors": [],
   "how": "4 KB 伪 PE 头 + Python zipfile 写的 ZIP 直接拼接（中央目录偏移未修正，同多数自解压 / 拼接文件）",
   "size": 5156,
   "b64": "TVrWZahudaIdXW0RIRhT09Yf49V/umF90KM9w5q69ZJp2fdLXqvJKFD+tl7ubz+tgTc7+qtDwwr9Rif69EuWEltowXs+LoJ4akZeM5FU50KW9rZKxTlGmFOdt8oCrXJah1e141t5djYfzId9va2yTAxXF/1npLX2qLdHwSw5GPamKvJBwwLkifjtG8RUFPvUZkHRwgEleJIc/nrqmeDaj0EK6WcTtUak417lrCZd99VYH5TDzi0xeL95TTWJjVc+wyYaz47z2b8olczY57J3uG/idzKr43MbWPU8bZjerCy/TivmmV+j7UJKlwU74WIaJcBEqOhMFggnwxfWCnZ7lVUoP3hEANHYyvgX4ARyNQg2i2cjxd4Uns12P2qfzroXGd9EfwB3ATk7OFOtYQB6aZ795+cOfVBRN8xvrBtT7xaIEUHALgm82gQCGn7h+q556ZXqWKTHWfhj25VWVeITTLkVLs6b3SdBBbcBgtnod6vHJLeuIbb5TwGcggZ5S/YUkKpXEkowclGAkyzr4m71ZCGsjwg+YWv0jWq8OEF93uE6MSNrL02vkdM5LygZ4lDM32nD/4F4K5ko144aWbua0rGjXRImUxwmPTLM2MNRnWw5nlqIYro0WaiiX4AtenTvMw0Z+muBvjQdL2YJIILIFrMOVbUTHkhMY0nsYqhO8ybeluTnY0vmEwW2kXD1AQyAuMuw9PTCqEWYxdWAQwiwqpj6dAkRZNlpagpHtoGJKAhsJK+8wUI4t4sjJLaN0S02x7oaTlzVLchpLUJIc3LfdglmCArBDPL7W/klJrteHzgMyRyvA7upsfA3yvGlCAniXuwN+VCiB1Jb8QPOZLDq9akIE7bt5uvWXJDzKBo5c9CwdpvDL2TT6sJy7qRPcacACXPCG2P7/QA+7HfzMKUXYk9tlIfTnxpfvUyMFpjtoFkC6ld8Qpx0H7Yey1Z+/ufh01NPav1yGn0qAxhycCiYgmMpLxrFvCMK52ItgGEyWNv6xVJiZ/g50VAgKkP+Y+I6upFEfsiB5ykW6qE2Ahj42oweqYSYXADv94HnEdSOCVNAHKlhk/+j3scDyqiOs5gwLPQdOtdo8PnSPnvYLH5xwSxDtIciNU4G7cTJRbnU43UfUYxgZjujDM9FX9Y7Imhlc/NfP4iw3+MuDVSLJeswsm3bbKx9h0jzz1qnmhPhJLyjKIV/A72ZDwFgPntiPKgN3fH1k4sGihQzwLgEO2GTNUX/6sStVbk6J04OjQj2IifQs4TY4D9j0MmgDDpC1OSMtfvu7pXTbKf8sH4VG5c0ZV17NtaxM4+6zLzfZRzdESOoC5Bx9IN4fKv0oOuJLOYrCEdTI28kcTBCvpCrYucESzj5y1QLCby11IXN2xdgJJTXf+qfxovakoPuTRfN5LgYBzixuZwLCng/zqpFiSb2oduSFyH2Cq/mV+OPr6how6SoJ5UV/mCcnT6f0B8DB6PGe533B3d6RkXnDRKeDOarhqwbINyN+8V2aSEWjeuFuldcSrXZpFQ5PylTw1D2I8/rTGoa/n4S/TlMmVAgrocm5uni5zyiWHcaZ9vZBw4WgmDur06NIHCsYUQMJmLXQrAS8YbeFLFQsy5Jyu35jbEm/MyCfgxa6sbgt2TlQ1tdGONMq6sGYszH8PJGKpeEtZ+3hbXqvMc4tspFLGBaY88sAuf8fxYsuAyrucntaGn+idvYtD7dEGoLxYWefxHe7ucUZv8Z72iXcNH524NopRxb5dasm0X+uxsXsHkCB2jQVnvuGAPxXg1swkR+WtsGlXLS4X6bheVOgSlCdQdflwZQZSBSJuo0ezyEVWjP2xDy8mGgvjvBOub5JUPDe6svG/GFkIeU2Ozt9OLFx+7hViPRc15tbJ3rRRllIwtzJeqJN/yC/6/PhU5jHWd2BMZVlcgVpOUfnbR55KXIuNHwi1VaJa6gjwkHFMWMn07HLEeCsjd8vp47L81Kj6EOaQNN+3ANDLh07WuLHdC6i/Fb8sj8eF+W0we9ysmmvbgMOohtsrJFZoxRec6Xv0iEjUhLOCKtZltzBfzpDLFBfh4EfFJfRrPv1D3itwkdkT9NrQ9/E+c/aB6ZuIXVk5/gnfyaioVQe/YADVvrFq6pefHcE2PNypHOG5ViIXUDPuxoPXr09qAOq9CkYjOXJH/NQHPhXgy7BGQDj+sHbdWQJ5vJr56OftaBO2f9vOddC8d2olLXy97w77UxceHnEZL7SwgmChg5PgdJAYUCOx7GHB+l2Tn++qZFZxCJLUU0ovGB9h9WVk1ifhUeRLhA6oQJDrAWhvFPUr38D5O6yiDKuyfpbXCt3mgNgeihEXp+OHQV4xLKFRruodz3rro7v1tatuYuzIV8y42XUTsicTb4aVS6LFXw8I8H41J3sj91wHymzXA5PvIQfr2Cmjr1p1k0NDcXmcAFNSc5WurRPPcTJ+GMIoi1d9ZPQNDc9oSnzfhT5uVmdEjVsVGS7/v2J2J54T0xVdOrcKyLj4QGWmQ+jpgBJ/JtdFubyg9EnlDhDq4yr2P2nU5j5zAcQoF+3w2afongx1PYurTeF6L/Y1aCeX5UV/wPyqbVDRr1q+h5aQwcNBPatbQ5ZuH5AGV1IBhKROxQT0UzGwSgbtRQIxNEWdHBRYeXZ5nrbSzLpLBOqWzRGruYzkpSvxQokwT0kLjWgcqZMJS16WR36ch0MwhYc7pX/OgZpHVk+xgff9S7XVDdGAnYR5+4ToYFLczfgRIrWIo9cUcqpE5XJPRGehPzUTyqIKayFzXruLICMJ3PhB+sSgXRUyJ2KXROuwcE+SACXt394iMFvrGXl3xJupdBIwDakxkKTAGb2CFAc+uzWe8C523VF/8p9EhMY14NdccjquD44UOGGQYTP1T1vY+lpPxN+m3kV0wYhriy6dEE0DLiv8Os2sdIiWBTp1+v6igs9N0UZz4HF/b3PmWQOz0CzFfAJxd5RraxGQ67zOo3ZhWWvY8MW8WtV0C2Nvl/mTmoLVfw65PSF4iML/032SARu7KpmI50pAR596lxAjgtGHQrXaoloWTTE3SJ0dOrNymakSPe8w3DzUZoTZgOMytppnGyY/mEiKd2Dd0oyhsgwWpfHxTTymRu0FAxAFPbRyR8UCrFruDNl71maX9N4wxHY+2S/NyVytv304HJbdXQjg3ULTJjby98HjapKzX4cjQYkbgBsr5w+lhJp13LCcX2lwFaprGsWxwGBnfYc1rtD0/GpeEwob5OHGqlLMSH+KzhSbv8BkegzndWK+vNIg204hnS5KNqAqdR0dO90qd0lNRtjIibI8x1WXuZ8fK1/UMO6gXiwp3OUYR4N6UU4vaoh9dGTxIlofYja03RQ/giun07sydCrImPGdixoc1c+nKw+RCkG5UqLL2PdcKIhlP/EqO0OLlUbqmAExE6Vvz8wXxAPNLn12NjXVV4VnsuR0c+hH5YllvJ/kcSZHHHrKXB/3jXfe/4B1QxBBqDVx+AaRzF6nzKZTVAgNsSGIhNxq8YdwSec/MKazMnK7nDl2JfaTWK3JKuLjyzYhfJ2udEKQEU+SSIOgmTx51AvtGdzIuNe/8SDlB9L+vT0q6Etl59GaFSubVAk82gXSf2xXXE0YwIt2oTCT6zpHvUyknSWN7D/4M9DgjnvPFZPquVPLOQdLUQqzV1WgX7bLgcjanv8ahJOxR37lZjCG8lfgE7dZIssl9QomJcebFLndhyTj7HofA8UgtG6uRX9l9k13twBZ+G4A8Bf662clywVCqsJxoa3+IacXzpOCCorNZEYhLJ8LYn4ONFn1s5TmPgu6RMiURBjFbr8GwC/iCjaT83EslzhwIUJTt+kxE2bwgfHbt8cKoaGEe7TtOATxf8D3llbWeY7ZVrjLiLMfvWplayTNSkPXXLCnt/EuT/LSPDpiwIZtqUr4pE5LfZy8U3Cu74Gocec399vIysFzejjtpl7lqQ9gbPA6oih+Rv8ePxif6o5NiCLN7kjxj6b6y+ZFEFRsFsFOwbyPnJH/vXomr/yDCg10DfhFluHMLDgGkoLAz6nW3u9v1ezs1kwxMlwB7nK0DVp+rMdSIKcP77mBZ9z7c+ej18gU4JHSFZlCdc/ZiNR31K1rtvhoGLxVM8+hMS/LuE1MLMM+lv+19jJLJurf9xAUygU4Cq9rnnNM/KIFWVzvRTrCFPYDQpZFG070iFFjswefzqr1v7d2H7yGHg6OLZuTxPCXC+HnybjfqRT5xZcg3CeSYs1BKUFiP5G1cz8PKVgGiUJx7alkoMNSvmd144rsJQQUvN48UIzMti2K5iPzDwYuM6pHfmWVpLQBi2q2FPqOm9kGxOLhU61gnhc3Ucz8Mw+EptQtGNUPRXyrCS6ytmwKIsJAw2XkxIHxd8OeyA3jxT5rYQFIJhkUb5gL/FCThNiR6vCje8Uc1lbNHcuhQfpc0U6x3kfsPQaBmdJrSk6L6MN8zXGn2L4NCZMZqEljib4dIM7AEkbmw5RdGdagTjQcETmnoexlEV53ifMXKgYkXUduUXZ4vcvrDd6WfvPFcCDjeJ4rPX4pUOHRNYc7CGUq7t4DSzLp37UEjECzhL/ADfAEXaqdTqu4efwSo3icJYepMNHl1erq3KgcYQJEYM3gAv4bi/XAf4gHbDxNpUgk3z/2jFoesrOu4QzbgKYKrgnLVxztkGQ8oLvm3hhxyWmfIJ6DV4DOiVBuLRhfcGjHlc1JUlwc+Vz2yapLNwJ+BUNqMcrjtwOCjMp5qXKiJIyzrmwuPGSiG0naTcjAco8gDmycrmcJPvn62hzWpQ50MtwZuiIaLbqQpc6to/H4LP+P4QPDb6YsxsP2zbaLH+1bp6xuFDTCtA36JGgSKgtZLufkjVfhC7NeTKRH24eUje5+WJEYPqb3FscDA0K7cZOY0Xfb2wMM+rHedyRopeKlJn2keUbsc5jj9M6b6yPC5EjiJ2BJ3WPrePrbUqKx+BmX538kwm2NL/kt8KYWdza2pHk2nLC36rZICIffUzxS07x1EyJsW8zploJclL7rxM2xVoC6AhjRB7ldRnQ48y2/0hv+jz8/eU3v5yX7vqM72d3wbDLPXYmZcFcUDBRMQZsy0jROiTa/Fc6G7TM43bN4jnBJX3TshMBJaM8dtL9LSG7i09Yqb/yh3IfdgMkG93mq2s5L4e1heVN3y8xjpKMqqg1aEjFqFF39ba3v3OzHPShbrob09qulYf5tlfwXFEwjBEf8A3Tlcu0Cq5IO6FiBcHwbqeESUGsBPi5LM8UKzGyFPKux/shWrqNz+w0j7Ljgdy9xj9qH7YYEQ+etk/BHZ25bC1z05kN7etht+b9/PnwEiCbmlnnw+MNrCDIUGSN1IQtNWgKjvAV9rZ+LVnHQIjfNnR3AQ+FQ4c0cCRrp3i36kIE0lN2kW2ZZ2woyfbI8cshISEZ4MHsW/DUXRzvBRb2y7kZuWp/cUDdByd2g7LLzzweVBLAwQUAAAAAABFfVJZw8axohwCAAAcAgAAEAAAAHNldHVwL3JlYWRtZS50eHRJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApJbnN0YWxsZXIgcGF5bG9hZApQSwMEFAAACAAARX1SWcVDlJIOAQAADgEAABYAAABzZXR1cC/lronoo4Xor7TmmI4udHh05Y+M5Ye7IHNldHVwLmV4ZSDlronoo4XjgIIK5Y+M5Ye7IHNldHVwLmV4ZSDlronoo4XjgIIK5Y+M5Ye7IHNldHVwLmV4ZSDlronoo4XjgIIK5Y+M5Ye7IHNldHVwLmV4ZSDlronoo4XjgIIK5Y+M5Ye7IHNldHVwLmV4ZSDlronoo4XjgIIK5Y+M5Ye7IHNldHVwLmV4ZSDlronoo4XjgIIK5Y+M5Ye7IHNldHVwLmV4ZSDlronoo4XjgIIK5Y+M5Ye7IHNldHVwLmV4ZSDlronoo4XjgIIK5Y+M5Ye7IHNldHVwLmV4ZSDlronoo4XjgIIK5Y+M5Ye7IHNldHVwLmV4ZSDlronoo4XjgIIKUEsBAhQDFAAAAAAARX1SWcPGsaIcAgAAHAIAABAAAAAAAAAAAAAAAIABAAAAAHNldHVwL3JlYWRtZS50eHRQSwECFAMUAAAIAABFfVJZxUOUkg4BAAAOAQAAFgAAAAAAAAAAAAAAgAFKAgAAc2V0dXAv5a6J6KOF6K+05piOLnR4dFBLBQYAAAAAAgACAIIAAACMAwAAAAA="
  },
  "sjis.zip": {
   "kind": "zip",
   "entries": [
    {
     "name": "資料/",
     "dir": true,
     "usize": 0,
     "csize": 0,
     "crc": 0,
     "method": 0,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess"
    },
    {
     "name": "資料/会議の議事録.txt",
     "dir": false,
     "usize": 14,
     "csize": 16,
     "crc": 223894845,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess",
     "sha": "5be282f57a42fef0373619483f6b886f25d4994208fbf52fe4bd63faf6932f28"
    },
    {
     "name": "資料/見積書_最終版.pdf",
     "dir": false,
     "usize": 9,
     "csize": 11,
     "crc": 182885869,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess",
     "sha": "e5c62df5dab5c87b6a015ef3d43597074d1eec433b15f51aec63b8582d0e4ab4",
     "text": "%PDF-1.4\n"
    }
   ],
   "enc": "shift_jis",
   "sevenzip_ok": true,
   "sevenzip_errors": [],
   "how": "Python zipfile，文件名 Shift_JIS（CP932）、无标记（日文 Windows）",
   "size": 373,
   "b64": "UEsDBBQAAAAAAEV9UlkAAAAAAAAAAAAAAAAFAAAAjpGXvy9QSwMEFAAAAAgARX1SWT1dWA0QAAAADgAAABUAAACOkZe/L4nvi2OCzItjjpaYXi50eHRr2tj0selk0/6ms41OvFwAUEsDBBQAAAAIAEV9UlntneYKCwAAAAkAAAAWAAAAjpGXvy+MqZDPj5FfjcWPSZTFLnBkZlMNcHHTNdQz4QIAUEsBAhQAFAAAAAAARX1SWQAAAAAAAAAAAAAAAAUAAAAAAAAAAAAQAAAAAAAAAI6Rl78vUEsBAhQAFAAAAAgARX1SWT1dWA0QAAAADgAAABUAAAAAAAAAAAAgAAAAIwAAAI6Rl78vie+LY4LMi2OOlpheLnR4dFBLAQIUABQAAAAIAEV9UlntneYKCwAAAAkAAAAWAAAAAAAAAAAAIAAAAGYAAACOkZe/L4ypkM+PkV+NxY9JlMUucGRmUEsFBgAAAAADAAMAugAAAKUAAAAAAA=="
  },
  "upath.zip": {
   "kind": "zip",
   "entries": [
    {
     "name": "照片备份/",
     "dir": true,
     "usize": 0,
     "csize": 0,
     "crc": 0,
     "method": 0,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess"
    },
    {
     "name": "照片备份/海边日落.txt",
     "dir": false,
     "usize": 7,
     "csize": 9,
     "crc": 2702250947,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "upath",
     "sha": "5927b7f804e4955b8ca597db549d25638e92650123208b94ae8e1ad1f4638516",
     "text": "sunset\n"
    },
    {
     "name": "照片备份/旧扩展.txt",
     "dir": false,
     "usize": 6,
     "csize": 8,
     "crc": 170806301,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess",
     "sha": "44ea8ede9025c26663124ceeefca2a35e40e5021cd116e436d368e2deae3355e",
     "text": "stale\n"
    }
   ],
   "enc": "gbk",
   "sevenzip_ok": true,
   "sevenzip_errors": [],
   "how": "Python zipfile，GBK 文件名 + Info-ZIP Unicode 路径扩展 0x7075（其中一条 CRC 故意过期）",
   "size": 511,
   "b64": "UEsDBBQAAAAAAEV9UlkAAAAAAAAAAAAAAAAJAAAA1dXGrLG4t90vUEsDBBQAAAAIAEV9UlnDExGhCQAAAAcAAAAVACYA1dXGrLG4t90vuqOx38jVwuQudHh0dXAiAAGZ+N0b54Wn54mH5aSH5Lu9L+a1t+i+ueaXpeiQvS50eHQrLs0rTi3hAgBQSwMEFAAAAAgARX1SWR1MLgoIAAAABgAAABMAIwDV1cassbi33S++ycCp1bkudHh0dXAfAAHMZDmv54Wn54mH5aSH5Lu9L+aXp+aJqeWxlS50eHQrLknMSeUCAFBLAQIUABQAAAAAAEV9UlkAAAAAAAAAAAAAAAAJAAAAAAAAAAAAEAAAAAAAAADV1cassbi33S9QSwECFAAUAAAACABFfVJZwxMRoQkAAAAHAAAAFQAmAAAAAAAAACAAAAAnAAAA1dXGrLG4t90vuqOx38jVwuQudHh0dXAiAAGZ+N0b54Wn54mH5aSH5Lu9L+a1t+i+ueaXpeiQvS50eHRQSwECFAAUAAAACABFfVJZHUwuCggAAAAGAAAAEwAjAAAAAAAAACAAAACJAAAA1dXGrLG4t90vvsnAqdW5LnR4dHVwHwABzGQ5r+eFp+eJh+Wkh+S7vS/ml6fmianlsZUudHh0UEsFBgAAAAADAAMABAEAAOUAAAAAAA=="
  },
  "ustar.tar": {
   "kind": "tar",
   "entries": [
    {
     "name": "project-archive-2024/",
     "dir": true,
     "usize": 0,
     "type": "dir",
     "link": "",
     "mtime": 1795075103,
     "mode": 493
    },
    {
     "name": "project-archive-2024/quarterly-reports/",
     "dir": true,
     "usize": 0,
     "type": "dir",
     "link": "",
     "mtime": 1795075103,
     "mode": 493
    },
    {
     "name": "project-archive-2024/quarterly-reports/finance-and-operations/",
     "dir": true,
     "usize": 0,
     "type": "dir",
     "link": "",
     "mtime": 1795075103,
     "mode": 493
    },
    {
     "name": "project-archive-2024/quarterly-reports/finance-and-operations/summary-of-annual-budget-execution-and-key-tasks-for-next-year.txt",
     "dir": false,
     "usize": 21,
     "type": "file",
     "link": "",
     "mtime": 1795075103,
     "mode": 420,
     "sha": "95dcd2050a92d87e0bd5c8ce19aeac80b1e70c4fe51805a1dbe0845e73068ae2"
    }
   ],
   "how": "bsdtar --format=ustar：ASCII 路径 100–255 字节，靠 ustar 头的 prefix 字段拼接",
   "size": 3584,
   "b64": "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MGxvbgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAc3RhZmYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwMDAwMDAgADAwMDAwMCAAcHJvamVjdC1hcmNoaXZlLTIwMjQvcXVhcnRlcmx5LXJlcG9ydHMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1c3RhciBwcmVmaXggcGF5bG9hZAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
  },
  "win-gbk.zip": {
   "kind": "zip",
   "entries": [
    {
     "name": "年度报告/",
     "dir": true,
     "usize": 0,
     "csize": 0,
     "crc": 0,
     "method": 0,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess"
    },
    {
     "name": "年度报告/2024年度总结.txt",
     "dir": false,
     "usize": 1284,
     "csize": 130,
     "crc": 1786070132,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess",
     "sha": "490d1f95c69961038dc301946dc7fd3dad310a0313e186248472cc2840aa67c2"
    },
    {
     "name": "年度报告/预算明细表.csv",
     "dir": false,
     "usize": 84,
     "csize": 83,
     "crc": 2777726402,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess",
     "sha": "00a78781c936d269b5d6487c2bb2520af1801b91137a5ef080f7e144a3e3cbb8"
    },
    {
     "name": "年度报告/图片/",
     "dir": true,
     "usize": 0,
     "csize": 0,
     "crc": 0,
     "method": 0,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess"
    },
    {
     "name": "年度报告/图片/封面设计稿.png",
     "dir": false,
     "usize": 114,
     "csize": 111,
     "crc": 87152339,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess",
     "sha": "570d09446314ee891362194e33017d8a28fb4c4d8b671e7a7e9b42d17aa76dc5"
    },
    {
     "name": "年度报告/Thumbs.db",
     "dir": false,
     "usize": 300,
     "csize": 305,
     "crc": 1646361502,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess",
     "sha": "896594b74547c27e43ab1ebbc047fe5d6d9cc3da31d56f56e4f5332e1f12a689"
    },
    {
     "name": "年度报告/desktop.ini",
     "dir": false,
     "usize": 69,
     "csize": 71,
     "crc": 3610454390,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess",
     "sha": "ba5ad02f398794e4aa2567fe49670ffd5ff773138cf3cb4607896ec61abeda5b",
     "text": "[.ShellClassInfo]\r\nIconResource=C:\\Windows\\System32\\imageres.dll,-3\r\n"
    },
    {
     "name": "会议纪要（第三季度）.txt",
     "dir": false,
     "usize": 38,
     "csize": 43,
     "crc": 3975185482,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "guess",
     "sha": "70e2788fd311c61d3a74ba1812da60dbe54efff2a6d4920b3f8b1ba0250cb108"
    }
   ],
   "enc": "gbk",
   "sevenzip_ok": true,
   "sevenzip_errors": [],
   "how": "Python zipfile，create_system=0，文件名按 GBK 编码、不打 UTF-8 标记（中文 Windows 资源管理器的写法）",
   "size": 1695,
   "b64": "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"
  },
  "zip64.zip": {
   "kind": "zip",
   "entries": [
    {
     "name": "zip64/part-0.txt",
     "dir": false,
     "usize": 170,
     "csize": 22,
     "crc": 3707473339,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "ascii",
     "sha": "3a6fc2501f7f545a8e52cdaafe9f6aaf7ad56144304393943fea05e7445e7ada",
     "text": "line 0 of part 0\nline 0 of part 0\nline 0 of part 0\nline 0 of part 0\nline 0 of part 0\nline 0 of part 0\nline 0 of part 0\nline 0 of part 0\nline 0 of part 0\nline 0 of part 0\n"
    },
    {
     "name": "zip64/part-1.txt",
     "dir": false,
     "usize": 850,
     "csize": 28,
     "crc": 3684540162,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "ascii",
     "sha": "2036814a844b9ffa0fd1fdb16433e8c66ce7cfb3feec7efa2826b68711f219a9",
     "text": "line 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\nline 0 of part 1\n"
    },
    {
     "name": "zip64/part-2.txt",
     "dir": false,
     "usize": 1530,
     "csize": 32,
     "crc": 3284898460,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "ascii",
     "sha": "71f5cc647f3552ec15433d8ac5b0070d960799cf15bf2b84570e91ffd95d9069",
     "text": "line 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\nline 0 of part 2\n"
    },
    {
     "name": "zip64/part-3.txt",
     "dir": false,
     "usize": 2210,
     "csize": 38,
     "crc": 2814635412,
     "method": 8,
     "enc": false,
     "crypto": "",
     "dt": [
      2024,
      10,
      18,
      15,
      42,
      10
     ],
     "src": "ascii",
     "sha": "78e08ced6a3fe38123dadb40e079211ab6b2144252d43891f6d31c09e6b65453",
     "text": "line 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\nline 0 of part 3\n"
    }
   ],
   "sevenzip_ok": true,
   "sevenzip_errors": [],
   "how": "Python zipfile，把 ZIP64_LIMIT / ZIP_FILECOUNT_LIMIT 压到 64 / 2，逼出 ZIP64 扩展字段与 ZIP64 目录结尾记录",
   "size": 834,
   "b64": "UEsDBC0AAAAIAEV9Ulm7jfvc//////////8QABQAemlwNjQvcGFydC0wLnR4dAEAEACqAAAAAAAAABYAAAAAAAAAy8nMS1UwUMhPUyhILCpRMODKGawCAFBLAwQtAAAACABFfVJZAp+d2///////////EAAUAHppcDY0L3BhcnQtMS50eHQBABAAUgMAAAAAAAAcAAAAAAAAAMvJzEtVMFDIT1MoSCwqUTDkyhkVGBUYFSBfAABQSwMELQAAAAgARX1SWZySy8P//////////xAAFAB6aXA2NC9wYXJ0LTIudHh0AQAQAPoFAAAAAAAAIAAAAAAAAADLycxLVTBQyE9TKEgsKlEw4soZFRgVGBUYFRgVGN4CAFBLAwQtAAAACABFfVJZlO3Dp///////////EAAUAHppcDY0L3BhcnQtMy50eHQBABAAoggAAAAAAAAmAAAAAAAAAMvJzEtVMFDIT1MoSCwqUTDmyhkVGBUYFRgVGBUYFRgVGBUYaAEAUEsBAi0DLQAAAAgARX1SWbuN+9z//////////xAAFAAAAAAAAAAAAIABAAAAAHppcDY0L3BhcnQtMC50eHQBABAAqgAAAAAAAAAWAAAAAAAAAFBLAQItAy0AAAAIAEV9UlkCn53b//////////8QABwAAAAAAAAAAACAAf////96aXA2NC9wYXJ0LTEudHh0AQAYAFIDAAAAAAAAHAAAAAAAAABYAAAAAAAAAFBLAQItAy0AAAAIAEV9UlmcksvD//////////8QABwAAAAAAAAAAACAAf////96aXA2NC9wYXJ0LTIudHh0AQAYAPoFAAAAAAAAIAAAAAAAAAC2AAAAAAAAAFBLAQItAy0AAAAIAEV9UlmU7cOn//////////8QABwAAAAAAAAAAACAAf////96aXA2NC9wYXJ0LTMudHh0AQAYAKIIAAAAAAAAJgAAAAAAAAAYAQAAAAAAAFBLBgYsAAAAAAAAAC0ALQAAAAAAAAAAAAQAAAAAAAAABAAAAAAAAABgAQAAAAAAAIABAAAAAAAAUEsGBwAAAADgAgAAAAAAAAEAAABQSwUGAAAAAAQABABgAQAAgAEAAAAA"
  },
  "zipcrypto.zip": {
   "kind": "zip",
   "entries": [
    {
     "name": "notes.txt",
     "dir": false,
     "usize": 2800,
     "csize": 50,
     "crc": 2143573218,
     "method": 8,
     "enc": true,
     "crypto": "ZipCrypto",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "ascii",
     "sha": "ba3756b343799aba8a024adb57a83c4927326a1db736f2e422e7fc767ccf07a0",
     "text": "Meeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\nMeeting notes\n"
    },
    {
     "name": "pin.txt",
     "dir": false,
     "usize": 5,
     "csize": 17,
     "crc": 2362477895,
     "method": 0,
     "enc": true,
     "crypto": "ZipCrypto",
     "dt": [
      2026,
      11,
      19,
      15,
      58,
      24
     ],
     "src": "ascii",
     "sha": "8982b0e36eb1bacbb400dea0997b13cce756d7a48dbe0b05c560a13c1973afd0",
     "text": "0000\n"
    }
   ],
   "sevenzip_ok": true,
   "sevenzip_errors": [],
   "how": "Info-ZIP zip 3.0：zip -e -P 1234（ZipCrypto，带数据描述符）",
   "size": 409,
   "b64": "UEsDBBQACQAIAEx/c13iVMR/MgAAAPAKAAAJABwAbm90ZXMudHh0VVQJAAMfrP5qH6z+anV4CwABBPUBAAAEFAAAAGJcql3c9edBELwkt8dx/pfzCup1HGmEk03a9Gdb/moZH/es7Mw6oQX5RqwuU5TfBAmtUEsHCOJUxH8yAAAA8AoAAFBLAwQKAAkAAABMf3NdR43QjBEAAAAFAAAABwAcAHBpbi50eHRVVAkAAx+s/mofrP5qdXgLAAEE9QEAAAQUAAAAz3LRDoF5CCtoEYeemgeF5LpQSwcIR43QjBEAAAAFAAAAUEsBAh4DFAAJAAgATH9zXeJUxH8yAAAA8AoAAAkAGAAAAAAAAQAAAKSBAAAAAG5vdGVzLnR4dFVUBQADH6z+anV4CwABBPUBAAAEFAAAAFBLAQIeAwoACQAAAEx/c11HjdCMEQAAAAUAAAAHABgAAAAAAAEAAACkgYUAAABwaW4udHh0VVQFAAMfrP5qdXgLAAEE9QEAAAQUAAAAUEsFBgAAAAACAAIAnAAAAOcAAAAAAA==",
   "pw": "1234"
  }
 },
 "meta": {
  "tool": "Python 3.14.6 zipfile/tarfile/gzip · pyzipper 0.4.0 · 7-Zip 26.06"
 },
 "bench": {
  "n": 6300,
  "ok": 6277,
  "groups": [
   {
    "id": "zhs-gbk-1",
    "n": 150,
    "ok": 148
   },
   {
    "id": "zhs-gbk-2-3",
    "n": 150,
    "ok": 150
   },
   {
    "id": "zhs-gbk-4-6",
    "n": 150,
    "ok": 150
   },
   {
    "id": "zht-big5-1",
    "n": 150,
    "ok": 147
   },
   {
    "id": "zht-big5-2-3",
    "n": 150,
    "ok": 150
   },
   {
    "id": "zht-big5-4-6",
    "n": 150,
    "ok": 150
   },
   {
    "id": "ja-shift_jis-1",
    "n": 150,
    "ok": 148
   },
   {
    "id": "ja-shift_jis-2-3",
    "n": 150,
    "ok": 150
   },
   {
    "id": "ja-shift_jis-4-6",
    "n": 150,
    "ok": 150
   },
   {
    "id": "ko-euc-kr-1",
    "n": 150,
    "ok": 140
   },
   {
    "id": "ko-euc-kr-2-3",
    "n": 150,
    "ok": 149
   },
   {
    "id": "ko-euc-kr-4-6",
    "n": 150,
    "ok": 150
   },
   {
    "id": "west-cp437-1",
    "n": 150,
    "ok": 150
   },
   {
    "id": "west-cp437-2-3",
    "n": 150,
    "ok": 150
   },
   {
    "id": "west-cp437-4-6",
    "n": 150,
    "ok": 150
   },
   {
    "id": "west-cp850-1",
    "n": 150,
    "ok": 148
   },
   {
    "id": "west-cp850-2-3",
    "n": 150,
    "ok": 150
   },
   {
    "id": "west-cp850-4-6",
    "n": 150,
    "ok": 150
   },
   {
    "id": "west-windows-1252-1",
    "n": 150,
    "ok": 147
   },
   {
    "id": "west-windows-1252-2-3",
    "n": 150,
    "ok": 150
   },
   {
    "id": "west-windows-1252-4-6",
    "n": 150,
    "ok": 150
   },
   {
    "id": "ru-cp866-1",
    "n": 150,
    "ok": 150
   },
   {
    "id": "ru-cp866-2-3",
    "n": 150,
    "ok": 150
   },
   {
    "id": "ru-cp866-4-6",
    "n": 150,
    "ok": 150
   },
   {
    "id": "zhs-utf-8-1",
    "n": 150,
    "ok": 150
   },
   {
    "id": "zhs-utf-8-2-3",
    "n": 150,
    "ok": 150
   },
   {
    "id": "zhs-utf-8-4-6",
    "n": 150,
    "ok": 150
   },
   {
    "id": "zht-utf-8-1",
    "n": 150,
    "ok": 150
   },
   {
    "id": "zht-utf-8-2-3",
    "n": 150,
    "ok": 150
   },
   {
    "id": "zht-utf-8-4-6",
    "n": 150,
    "ok": 150
   },
   {
    "id": "ja-utf-8-1",
    "n": 150,
    "ok": 150
   },
   {
    "id": "ja-utf-8-2-3",
    "n": 150,
    "ok": 150
   },
   {
    "id": "ja-utf-8-4-6",
    "n": 150,
    "ok": 150
   },
   {
    "id": "ko-utf-8-1",
    "n": 150,
    "ok": 150
   },
   {
    "id": "ko-utf-8-2-3",
    "n": 150,
    "ok": 150
   },
   {
    "id": "ko-utf-8-4-6",
    "n": 150,
    "ok": 150
   },
   {
    "id": "west-utf-8-1",
    "n": 150,
    "ok": 150
   },
   {
    "id": "west-utf-8-2-3",
    "n": 150,
    "ok": 150
   },
   {
    "id": "west-utf-8-4-6",
    "n": 150,
    "ok": 150
   },
   {
    "id": "ru-utf-8-1",
    "n": 150,
    "ok": 150
   },
   {
    "id": "ru-utf-8-2-3",
    "n": 150,
    "ok": 150
   },
   {
    "id": "ru-utf-8-4-6",
    "n": 150,
    "ok": 150
   }
  ]
 },
 "detect": {
  "groups": [
   {
    "id": "zhs-gbk-1",
    "enc": "gbk",
    "ok": 148,
    "arcs": [
     [
      "xNHD8TIwMjQucG5n"
     ],
     [
      "MjAyNC/U59LR1ea1xC56aXA="
     ],
     [
      "vKu081/S38Pn"
     ],
     [
      "u7Agv8bRp7zStdozsOYudHh0"
     ],
     [
      "0sDAtS5kb2N4"
     ],
     [
      "xfvCti50eHQ="
     ],
     [
      "z7S158rTvufR2C50eHQ="
     ],
     [
      "zOy98i27sMziL8rYu6QtxNDFri5jc3Y="
     ],
     [
      "srHX0192Mi5jc3Y="
     ],
     [
      "wfTPwi5jc3Y="
     ],
     [
      "y+Eg0aHGsSDQodDNLm1k"
     ],
     [
      "0sDV1V+4zy56aXA="
     ],
     [
      "0N5fwu8ueGxzeA=="
     ],
     [
      "t7HI2czUzK0ucGRm"
     ],
     [
      "vbvMuA=="
     ],
     [
      "ytDD8S5wcHR4"
     ],
     [
      "uOi0yrLdvucucGRm"
     ],
     [
      "MjAyNC/FrMGmLc/6ytsv0OjH8y5kb2N4"
     ],
     [
      "vfAttcfJzy22qDIwMjQvtci1yC5wZGY="
     ],
     [
      "t9XOp192Mi5tZA=="
     ],
     [
      "vc/WzsDtvvU="
     ],
     [
      "ZG9jcy/Bvc67LnBuZw=="
     ],
     [
      "zbS/4C54bHN4"
     ],
     [
      "yc/Vx7arLm1k"
     ],
     [
      "YmFja3VwL87EvP4udHh0"
     ],
     [
      "MjAyNC+53NbGILnYwaogtsHK6S5jc3Y="
     ],
     [
      "YmFja3VwL7DhLnBwdHg="
     ],
     [
      "ttSxyMG0vdPXqsjDL7f+17CwrsnPLm1wNA=="
     ],
     [
      "vufH6cnPz98vvOS1/S+x7cq+MjAyNC5wZGY="
     ],
     [
      "MjAyNC/Q/deqvfvWuS5wZGY="
     ],
     [
      "v9i45tfmz8guY3N2"
     ],
     [
      "vuPA1rK/Lbv6xvcts6Quemlw"
     ],
     [
      "YmFja3VwL7XbufoudHh0"
     ],
     [
      "uea48S54bHN4"
     ],
     [
      "08PAtF/Iy7zkKNbVKS/E2g=="
     ],
     [
      "yum16snPvLbSsi50eHQ="
     ],
     [
      "MjAyNC/KrMzlIMzWwtujqDGjqS56aXA="
     ],
     [
      "0sHAytfczOXUurOkLnBwdHg="
     ],
     [
      "1LzK+C3E1NfTX3YyLnBwdHg="
     ],
     [
      "1/kvuqOwzijW1Sk="
     ],
     [
      "w8PX0y2+6L/uLbb6tuQucGRm"
     ],
     [
      "vNxfu8bJq7XaM7DmLnBkZg=="
     ],
     [
      "0uK8+y/Tw82+INTs0M0yMDI0LnBkZg=="
     ],
     [
      "ZG9jcy/Vz7Ctx7HU2i/Vucq+LnBuZw=="
     ],
     [
      "wby6w1/D8db3o6gxo6kuemlw"
     ],
     [
      "tKbA7bXaM7DmL9a4seovus+3qC50eHQ="
     ],
     [
      "s7m11yDKrtTC"
     ],
     [
      "yti7pC+/ycTc0NQucGRm"
     ],
     [
      "YmFja3VwL8XJs/YubXA0"
     ],
     [
      "wM+5qy+93LP2LnBwdHg="
     ],
     [
      "vce2yCDFxiDSu8zlLnBuZw=="
     ],
     [
      "07IuZG9jeA=="
     ],
     [
      "wPGw3V+2r7v6tdozsOYuY3N2"
     ],
     [
      "s6rGrF/V4tK7LmpwZw=="
     ],
     [
      "zeKyv9fw0c8uY3N2"
     ],
     [
      "veG5uS54bHN4"
     ],
     [
      "t8DT+deko6gxo6kvuf3Cyy5wbmc="
     ],
     [
      "0NSwri29+NK7sr0ttbPE2i5wcHR4"
     ],
     [
      "1+/Q0CDI69GnLmNzdg=="
     ],
     [
      "0tS0yyDIz9XmLnR4dA=="
     ],
     [
      "vsC31yC7+bLjINfvtvEucGRm"
     ],
     [
      "1+a5+i3X48fyKNbVKS/M5dbYX7y3X7zNwrwucG5n"
     ],
     [
      "yrnRzi5jc3Y="
     ],
     [
      "we3Su7e9w+ZfxfrF0C54bHN4"
     ],
     [
      "YmFja3VwL7niw/cucHB0eA=="
     ],
     [
      "t8e3qCCxo8LeLm1wNA=="
     ],
     [
      "u/mxvsnPLnBuZw=="
     ],
     [
      "u/rG98jLLbvYuekucG5n"
     ],
     [
      "vNYgxsYyMDI0LnBuZw=="
     ],
     [
      "veEgv7zCx7XaM7DmL9PDwLQuZG9jeA=="
     ],
     [
      "vNO/7DIwMjQuZG9jeA=="
     ],
     [
      "uLPT6C5wcHR4"
     ],
     [
      "xr2++bnJyKguZG9jeA=="
     ],
     [
      "vdO9/C3O5Lq6LmNzdg=="
     ],
     [
      "sK62+8C8LnppcA=="
     ],
     [
      "0ds="
     ],
     [
      "ZG9jcy++r7e90rvGqi50eHQ="
     ],
     [
      "4N4uZG9jeA=="
     ],
     [
      "yqm5pC5wZGY="
     ],
     [
      "uL3K9L/YuckubXA0"
     ],
     [
      "1eLW1sq2sfAubWQ="
     ],
     [
      "x6nD+y3Ny9DdLcirLnR4dA=="
     ],
     [
      "udzWxr3M0bXEz7K/LnBkZg=="
     ],
     [
      "0O0uemlw"
     ],
     [
      "xtW8sC2+rcDtLmpwZw=="
     ],
     [
      "1qTK6c/Ix7CjqDGjqS/Or9Sx"
     ],
     [
      "va3U88PxLmNzdg=="
     ],
     [
      "xuS0zrXaM7DmLmpwZw=="
     ],
     [
      "1f255l/B0LHtX3YyLnR4dA=="
     ],
     [
      "1MS2wS+0+Lj4LnppcA=="
     ],
     [
      "w8C6wy257S5jc3Y="
     ],
     [
      "1/fVvbmku+EuY3N2"
     ],
     [
      "1eK0zi25q9b3LmRvY3g="
     ],
     [
      "yMvQxMO/LnBwdHg="
     ],
     [
      "yczStV+x58LbLnppcA=="
     ],
     [
      "xvC3yS5wZGY="
     ],
     [
      "1NrP31+xo7ukX73hL7jfytZf0N5fs8zKvQ=="
     ],
     [
      "tee7sF+427/aLnppcA=="
     ],
     [
      "ZG9jcy+ztdfTILb5IMa1wsov0tTD4i3W+srWLmpwZw=="
     ],
     [
      "YmFja3VwL7ymsM2xsbe9LmRvY3g="
     ],
     [
      "xMfR+SC80s2lLmpwZw=="
     ],
     [
      "08XBvC3X1LTTLcDDL8v10KEv1K3T0CC/59S9Lm1wNA=="
     ],
     [
      "17zIt7HwyMu/2Ljmo6gxo6kv1fK96cnctdozsOY="
     ],
     [
      "t/7XsLzSzaUvu8a98LDLuPYubXA0"
     ],
     [
      "z+vE7rXDtdozsOYuemlw"
     ],
     [
      "t8XG+rfwvczIy8q/Lm1wNA=="
     ],
     [
      "zurI6C50eHQ="
     ],
     [
      "tOvKqS+/vNHpxLkuY3N2"
     ],
     [
      "yd8ueGxzeA=="
     ],
     [
      "ZG9jcy/H6TIwMjQ="
     ],
     [
      "xa5fxqS39F92Mi56aXA="
     ],
     [
      "uPfOuyjW1Skv1fm24S3R6dakX3YyLmpwZw=="
     ],
     [
      "uPe8tqOoMaOpLnBwdHg="
     ],
     [
      "uLrU8ODLu6jHri5wcHR4"
     ],
     [
      "ZG9jcy/I58/C"
     ],
     [
      "wfQubXA0"
     ],
     [
      "uMkv1eKzoQ=="
     ],
     [
      "zqO6pi5tZA=="
     ],
     [
      "srzG8LXjtKvK5C/Ksbv6ILrDz/vPoiDV0Mn6L9K7t6wuemlw"
     ],
     [
      "ur2w4C/Ks8a3L9Kutdy13C5tcDQ="
     ],
     [
      "yfG+rS54bHN4"
     ],
     [
      "v6pft9a94i5wcHR4"
     ],
     [
      "uqs="
     ],
     [
      "yta7+l+yu7PJLmRvY3g="
     ],
     [
      "s6y8ti5tZA=="
     ],
     [
      "xOq8tqOoMaOpLnBwdHg="
     ],
     [
      "x/rP3yC9+LmlIM7A0Mc="
     ],
     [
      "084ubWQ="
     ],
     [
      "ZG9jcy/M4rLE08TErKOoMaOpL9PMzKvGvcPxLmNzdg=="
     ],
     [
      "uN/W0C5kb2N4"
     ],
     [
      "uqPN5SjW1Sk="
     ],
     [
      "yrXKsS3I676zLmRvY3g="
     ],
     [
      "xq2+1i2w8SjW1Skuemlw"
     ],
     [
      "u+GzpNK7vOQuemlw"
     ],
     [
      "zu/M5S50eHQ="
     ],
     [
      "ZG9jcy/V4srHX9bGssMueGxzeA=="
     ],
     [
      "xMsucHB0eA=="
     ],
     [
      "vNPJz7OsytBfdjIubXA0"
     ],
     [
      "0PhfyM66zsjL"
     ],
     [
      "usvQxC56aXA="
     ],
     [
      "wb280l+0y7SmX9b3vcejqDGjqS50eHQ="
     ],
     [
      "scbB0MjrL8m9x/gubWQ="
     ],
     [
      "0vK2+C5wZGY="
     ],
     [
      "MjAyNC+85ijW1SkvtuC6rbjHv7Syu7W9Lm1k"
     ],
     [
      "19TW9y50eHQ="
     ],
     [
      "1fu6z9Dtyfmzxi5wbmc="
     ],
     [
      "u/m12C5wZGY="
     ],
     [
      "zbi80bvKuvMubXA0"
     ],
     [
      "sc++uS+5srrNLdauyfkts6rGrC5jc3Y="
     ],
     [
      "tKbA7Q=="
     ]
    ]
   },
   {
    "id": "zht-big5-1",
    "enc": "big5",
    "ok": 147,
    "arcs": [
     [
      "wektpM/C0C2xYLNXLnBkZg=="
     ],
     [
      "rfSt26TxqMguZG9jeA=="
     ],
     [
      "pXwuemlw"
     ],
     [
      "vvS82S5kb2N4"
     ],
     [
      "qfqp+iCzuyC1brBPL6ZYplAgxlcgtmelWi5jc3Y="
     ],
     [
      "pVhfpUSr+V+kvaS4q2UuZG9jeA=="
     ],
     [
      "rNkgtaWvxS5kb2N4"
     ],
     [
      "p9FfdjIuY3N2"
     ],
     [
      "pMG56i2s065hLbj3MjAyNC5qcGc="
     ],
     [
      "t9GstF+xcaW8ssQzqqkuY3N2"
     ],
     [
      "vtSn0CCo5KVMpEggsL0vw/6nTy5qcGc="
     ],
     [
      "pNOk06xLuGAuY3N2"
     ],
     [
      "qO6tcaVYpWiscS5wZGY="
     ],
     [
      "u3uvdSiy1ykubWQ="
     ],
     [
      "plWm7KRAs6GkwKFdMaFeL7PQv+ylv6ah"
     ],
     [
      "ZG9jcy/CtrBzLnBwdHg="
     ],
     [
      "qNKkbKzbxH60SS54bHN4"
     ],
     [
      "t04gtn3AWSCkSKjGLnBkZg=="
     ],
     [
      "pKO63l+md6X+Lm1k"
     ],
     [
      "rNvAsy2zb6V5LnR4dA=="
     ],
     [
      "uvKr5iCk6iDBeV92Mi+qdS5tcDQ="
     ],
     [
      "rMYvpUimuS5wZGY="
     ],
     [
      "pViq+S2tq6RqLnBuZw=="
     ],
     [
      "ZG9jcy+mYi+w6qXBwX3D+A=="
     ],
     [
      "vNK9ay5wZGY="
     ],
     [
      "pECodKZDsnqpwC5jc3Y="
     ],
     [
      "MjAyNC+t7KZdIMFwwckvqPy5TKdnvG8ostcpLnBuZw=="
     ],
     [
      "pOlfpmKlfi5kb2N4"
     ],
     [
      "sUsgvPrAeaFdMaFeLnppcA=="
     ],
     [
      "tKOw3SCq7a2xILezoV0xoV4vuarAecLlrnYubWQ="
     ],
     [
      "s9C3fiiy1ykubXA0"
     ],
     [
      "xVTAsy21TS5wZGY="
     ],
     [
      "snmr0i+kV7bH"
     ],
     [
      "pVyk0i5kb2N4"
     ],
     [
      "pc2q+C5wZGY="
     ],
     [
      "pMYtsOq3fC+uyajoLnBwdHg="
     ],
     [
      "qO6qQV92Mi+q8ajTX7FqpMayxDOqqS5wZGY="
     ],
     [
      "uuuxbS2lzbDK"
     ],
     [
      "pVapdV+o4y56aXA="
     ],
     [
      "pbSvfS5wcHR4"
     ],
     [
      "sbGnaV92Mi+xTrd8wHMuanBn"
     ],
     [
      "p8bDvqTxwckubXA0"
     ],
     [
      "s/i0Xy50eHQ="
     ],
     [
      "pcGlzV+teKjGX6VYqNMucGRm"
     ],
     [
      "tn2zcSiy1ykvpFeo06prrtcuY3N2"
     ],
     [
      "v/qlXS5tcDQ="
     ],
     [
      "wXDByS2r5y2lfqzJ"
     ],
     [
      "wuCkxiCndKazLm1k"
     ],
     [
      "vNa2pF92Mi5wbmc="
     ],
     [
      "pX6o0y56aXA="
     ],
     [
      "uqYvp8bDviCm5rd+LnppcA=="
     ],
     [
      "uUGlwS+kdbd8LabzKLLXKS+yvi5wbmc="
     ],
     [
      "pm6pXy5kb2N4"
     ],
     [
      "pECtsV+kSK3ML7JNILFxqNOkoy/C4Lj8ssQzqqkvq86zuy/CxabiX6SjubOyxDOqqS56aXA="
     ],
     [
      "wclfsaG4YC5tcDQ="
     ],
     [
      "rkypdS+k+6WkX71zvGdfpaulwS56aXA="
     ],
     [
      "peysT6tEMjAyNC5kb2N4"
     ],
     [
      "veguanBn"
     ],
     [
      "sOqovi5tZA=="
     ],
     [
      "YmFja3VwL6aopeayxDOqqQ=="
     ],
     [
      "sLW3Ui+vdbnqLaZevtAtvHOqRi54bHN4"
     ],
     [
      "pEMgtMClTjIwMjQuemlw"
     ],
     [
      "w9Kp+i2xoapwLmpwZw=="
     ],
     [
      "rbG57yCmqKXmLnBuZw=="
     ],
     [
      "tsWwyC5kb2N4"
     ],
     [
      "pN/GRi5tZA=="
     ],
     [
      "v7G1yF+uybTBLm1wNA=="
     ],
     [
      "qbEgsOqlfi5tcDQ="
     ],
     [
      "MjAyNC+nuS5kb2N4"
     ],
     [
      "rUm0ul92Mi5qcGc="
     ],
     [
      "rsmxYA=="
     ],
     [
      "q+GurF+o86dVX6T1pHMuZG9jeA=="
     ],
     [
      "puassCC1TC5wbmc="
     ],
     [
      "qmWlXy5kb2N4"
     ],
     [
      "vvqmYqS6LnppcA=="
     ],
     [
      "uNzDRC5wbmc="
     ],
     [
      "pHOm6Kq6uNym5qxGsM8ucG5n"
     ],
     [
      "YmFja3VwL7/LLmNzdg=="
     ],
     [
      "sOymV192Mi5kb2N4"
     ],
     [
      "qu2ye7LEM6qp"
     ],
     [
      "qK2l96tDrnEuZG9jeA=="
     ],
     [
      "s8wtpKO2yC54bHN4"
     ],
     [
      "ZG9jcy+t06dPLmNzdg=="
     ],
     [
      "MjAyNC/Deqy1LnR4dA=="
     ],
     [
      "puioyC2mXqjsLm1k"
     ],
     [
      "vqilaa/gpX2lxy5tZA=="
     ],
     [
      "t07D0V+uSi5qcGc="
     ],
     [
      "ZG9jcy/B2bd8pXGlT6RrLm1wNA=="
     ],
     [
      "pvStcCCxei5kb2N4"
     ],
     [
      "qfql1Q=="
     ],
     [
      "pbus7C5tZA=="
     ],
     [
      "r8WhXTGhXi+zXCC0WKbsX3YyLm1k"
     ],
     [
      "rvyteC5qcGc="
     ],
     [
      "u+Ko+jIwMjQuemlw"
     ],
     [
      "snmwZ6jMvmEueGxzeA=="
     ],
     [
      "xMzCWrnnxEAvvtq7obj0sNu6cS50eHQ="
     ],
     [
      "qdK/1y5kb2N4"
     ],
     [
      "tN6lwS5tcDQ="
     ],
     [
      "wWCkpy+8QLB8pPGwXyiy1ykueGxzeA=="
     ],
     [
      "tlGx2i5qcGc="
     ],
     [
      "xFVftVBfsMqqqy54bHN4"
     ],
     [
      "tKEtwr3Eti2kdbx0LmNzdg=="
     ],
     [
      "uXG1+LxALnBuZw=="
     ],
     [
      "qtG7+V/BwsHCX6zdqKMucGRm"
     ],
     [
      "ZG9jcy+7WKVqs6XGWi5tcDQ="
     ],
     [
      "rrOlWF+t7KbtpcEuemlw"
     ],
     [
      "uXeovl+npF+zobakLnR4dA=="
     ],
     [
      "uPJfdjIueGxzeA=="
     ],
     [
      "wKOo7iC6TcL3IKRAqOgucHB0eA=="
     ],
     [
      "qdOo/C22uqmxLbP1qdIucGRm"
     ],
     [
      "v0W1by2r3652L7ryq+Ygpdiqui5jc3Y="
     ],
     [
      "uFWkSC5tZA=="
     ],
     [
      "uGeyeiCkUaTAoV0xoV4="
     ],
     [
      "YmFja3VwL8Ss"
     ],
     [
      "p+m/abxKr7pfdjIuY3N2"
     ],
     [
      "YmFja3VwL7XcLnBkZg=="
     ],
     [
      "pGqrrF+q+KxLX3YyL73StXsubXA0"
     ],
     [
      "pUy3fK7RvGdfdjIvv1evU1+ouq7JX7W3LmpwZw=="
     ],
     [
      "s/W0ui+95i+n5S50eHQ="
     ],
     [
      "MjAyNC+4c6ThX3YyL7rxpuItpKS12KXBsOoucG5n"
     ],
     [
      "uvur+S5wcHR4"
     ],
     [
      "xemkul+q7LTBL6SnwW4uemlw"
     ],
     [
      "ZG9jcy+l/q2xX8C9X6hCxkovwXDByaSnpFcvprOlziCkvaW/Lnhsc3g="
     ],
     [
      "rXik6C+kQy5wcHR4"
     ],
     [
      "sF24Zy5tZA=="
     ],
     [
      "qvGmfqjTpN6kSiiy1ykueGxzeA=="
     ],
     [
      "rmGx2l+ko7CxssQzqqkucHB0eA=="
     ],
     [
      "p6ggueqyey50eHQ="
     ],
     [
      "ZG9jcy+ko6h9LaZDpVhfdjIucHB0eA=="
     ],
     [
      "qLrD5C5wbmc="
     ],
     [
      "qqeo+qSjpnCm8iiy1ykucGRm"
     ],
     [
      "ste1si2udF92Mi+o08F7LnBkZg=="
     ],
     [
      "wXuhXTGhXi5wZGY="
     ],
     [
      "p+ym7S+zzKjOpMYgwEi+96FdMaFeLnhsc3g="
     ],
     [
      "wXuuyS+lRL7JLmRvY3g="
     ],
     [
      "sE+4/F+t7F+lRMNE"
     ],
     [
      "pda9py50eHQ="
     ],
     [
      "tn2uaS23ZDIwMjQvsNFfdjIvuUyp8y5tcDQ="
     ],
     [
      "pfCup6V+tlQuemlw"
     ],
     [
      "rHIuemlw"
     ],
     [
      "YmFja3VwL6RXrbEgq7Clq192Mi5wbmc="
     ],
     [
      "prPD9l+05KRmX3YyLnBkZg=="
     ],
     [
      "ptuqdrDPsdKlzjIwMjQueGxzeA=="
     ],
     [
      "vtamsyCu8MXpLnR4dA=="
     ],
     [
      "s+yqdi5qcGc="
     ],
     [
      "ra2o7r11uPS9zS5wZGY="
     ],
     [
      "t06r5C5tcDQ="
     ],
     [
      "pFelqy5wZGY="
     ],
     [
      "tE63fi+6tS5wZGY="
     ],
     [
      "taW1pV+z0LN5"
     ]
    ]
   },
   {
    "id": "ja-shift_jis-1",
    "enc": "shift_jis",
    "ok": 148,
    "arcs": [
     [
      "joCCyy54bHN4"
     ],
     [
      "kkWQ2ILpLnR4dA=="
     ],
     [
      "kd+V3y5qcGc="
     ],
     [
      "kVOBRYlpiZMvjlIvjp+J8S5tcDQ="
     ],
     [
      "lZRfifOCtV+DioOKgVuDWC5qcGc="
     ],
     [
      "kN2Mdl+C5oLBLnBkZg=="
     ],
     [
      "k6+O0A=="
     ],
     [
      "ZG9jcy+C4ILngqaC6YFFlbaL5YFFgtyCrYLpLmpwZw=="
     ],
     [
      "l6yPb4FFjNaC6S5tcDQ="
     ],
     [
      "g1aDh4Fbg2eBRYlFLmRvY3g="
     ],
     [
      "jp6R41+K+l+KeYK1gt+C6S5tZA=="
     ],
     [
      "gsKCrYLBLmpwZw=="
     ],
     [
      "j1qPioFFkEiCwS50eHQ="
     ],
     [
      "l16CpoLpII+Jgt8gg1iDUINXg4WBW4OLLnBwdHg="
     ],
     [
      "guCCwYLGguAvgsiC8YLGgsiCrV+DWIN9gVuDZ1+RnS5tZA=="
     ],
     [
      "g1KDc4FbX4/EgqsubXA0"
     ],
     [
      "kNSCoi+UkpBsgUWO6JFPLnBkZg=="
     ],
     [
      "iMiNfi5jc3Y="
     ],
     [
      "jbaDUoNYLnR4dA=="
     ],
     [
      "ieSCqonGX5SEgulfikcucG5n"
     ],
     [
      "iOeCxILpX4NYgVuDYy5wcHR4"
     ],
     [
      "ZG9jcy+QoopFkoaVg5BlLm1k"
     ],
     [
      "lEaP2ILCgq2CwS5jc3Y="
     ],
     [
      "i6SSyoFFg3CDbIOLL4tDibeKlI6uie+O0C+PrJfRj+aC6YLZLnppcA=="
     ],
     [
      "g0ODXoOKg0GBRYLEgqkvkO2Xqi5tZA=="
     ],
     [
      "g1SBW4Nyg1ggkuiU1C+UhJSDLnppcA=="
     ],
     [
      "j86Coi5wbmc="
     ],
     [
      "iOqUyi54bHN4"
     ],
     [
      "g2WBW4N2L4Nvg0ODSYFFg3uBW4NngUWT7C5tZA=="
     ],
     [
      "gtyCxoLfi62Qpy56aXA="
     ],
     [
      "lrOXv4OLgVuDZy50eHQ="
     ],
     [
      "g1iDZ4OKgVuDZ4FFgseC8YLIgskubXA0"
     ],
     [
      "jpaMzC+Rzl+J8IyIX4irgqIvg0eDk4NXg2qDQS5tcDQ="
     ],
     [
      "g4yDfIFbg2cgj8GU7y5wcHR4"
     ],
     [
      "lO2NkIONgVsvlr6KbSCK7pFiLm1k"
     ],
     [
      "gqKCooKmX5hnX4LBgs+CyIK1Lnhsc3g="
     ],
     [
      "gtyCwoLoLnBuZw=="
     ],
     [
      "g2eDgIikgrUuanBn"
     ],
     [
      "l0SPRy5tZA=="
     ],
     [
      "k6QueGxzeA=="
     ],
     [
      "MjAyNC+OY4LBIIuDgqsudHh0"
     ],
     [
      "id+Lji+KS4uJgUWJ8IvWgUWQ9ILBL4LIgvEuY3N2"
     ],
     [
      "ifCQ4C+O1C5wZGY="
     ],
     [
      "k2SYYi50eHQ="
     ],
     [
      "gqiVoCCOY4LpL47AjXOMYI6ujvyIzS5tZA=="
     ],
     [
      "jLOLQy+SUCCC4ILngqgvjEODgoFbg4svltqOd4K1II2HkcwgguaC6S5kb2N4"
     ],
     [
      "koaQol+SbojmL4NWgVuDk4FFgrcucGRm"
     ],
     [
      "g2CDg4OTg1guZG9jeA=="
     ],
     [
      "jKmCwoKpgsEglbeCsYKmgukgkbmPnS56aXA="
     ],
     [
      "i4kucGRm"
     ],
     [
      "kFWCwS54bHN4"
     ],
     [
      "kGcuY3N2"
     ],
     [
      "g3KDYoNPl3CI0y5kb2N4"
     ],
     [
      "km2OryCDXoNDg4QgkMKPdC5qcGc="
     ],
     [
      "lcKCtoNeg5OTwZKlLnBwdHg="
     ],
     [
      "gr+C5YKiLnppcA=="
     ],
     [
      "ZG9jcy+O5YmJLnBwdHg="
     ],
     [
      "g3iDYoNoLnppcA=="
     ],
     [
      "jFmOliCOioLBIJT8l2UucHB0eA=="
     ],
     [
      "j2Muemlw"
     ],
     [
      "j/AucGRm"
     ],
     [
      "i5aCt1+DZ4OIg15fkEiTsC+Tx4LfgrWC5ZVcj+4uemlw"
     ],
     [
      "MjAyNC+JaQ=="
     ],
     [
      "g2ODQ4Nig16BW4FFlnuXiC5tZA=="
     ],
     [
      "jd6Xv4Nng4uDUi5tcDQ="
     ],
     [
      "i76BRYrogqQvjFqS7YFFkrKXnS54bHN4"
     ],
     [
      "MjAyNC+SyoLogUWCrYLcgUWSeILqLnBuZw=="
     ],
     [
      "kU+TYy+Wr47lk32BRY7rgugueGxzeA=="
     ],
     [
      "iuuLQCCDdIOKgVsgg1eDg4Fbg2mDioNYg2cubXA0"
     ],
     [
      "guKCqoLEIIy4gsEucG5n"
     ],
     [
      "inmCtYKt"
     ],
     [
      "lkCTSSCUd5KG"
     ],
     [
      "ZG9jcy+VU45ngu2UVi56aXA="
     ],
     [
      "kISPpy5kb2N4"
     ],
     [
      "gqKCwYLPgqJfkLaXnV+SW5aWLnBuZw=="
     ],
     [
      "iuuMr1+CzYLpX4mWLm1wNA=="
     ],
     [
      "MjAyNC+DZYNqg1hfkbGCry5qcGc="
     ],
     [
      "YmFja3VwL477mF6Xli5kb2N4"
     ],
     [
      "ZG9jcy+CqJJtgueCuS5tZA=="
     ],
     [
      "keWNsoKogs2C5oKkL4yakN0ueGxzeA=="
     ],
     [
      "grOCwYKzgsaVqoKpgvEuY3N2"
     ],
     [
      "i0yO0l+DVoOTLmNzdg=="
     ],
     [
      "g1KDfS56aXA="
     ],
     [
      "lqGV+y54bHN4"
     ],
     [
      "jqmTXY7UgUWSt46eitQuanBn"
     ],
     [
      "g3ODk4NOLnppcA=="
     ],
     [
      "gs6CwYKpkGo="
     ],
     [
      "g1qDiy5tZA=="
     ],
     [
      "kWqOfoFFlGqJ8y5tcDQ="
     ],
     [
      "g4mDk4NMg5ODTy5tcDQ="
     ],
     [
      "lNEucG5n"
     ],
     [
      "ZG9jcy+DSYNeg04gg4GDioNig2cucG5n"
     ],
     [
      "ikqCq1+Ug4KiLmRvY3g="
     ],
     [
      "jLWCtYKtIINTgVuDiy5wZGY="
     ],
     [
      "kLaCpl+Vul+RzIyxL4LOgueOoZfDjp6Njy5wZGY="
     ],
     [
      "kF6C8ZKGLnR4dA=="
     ],
     [
      "g36DaiCPrIKzgsggjqmWnS5kb2N4"
     ],
     [
      "l36CtYKpgsEvie+Cpl+Ls4nv"
     ],
     [
      "ikcudHh0"
     ],
     [
      "k/yXzS+DiYOKgVsuZG9jeA=="
     ],
     [
      "g32BW4NOgUWCqYLtgqKCooFFgtCCxg=="
     ],
     [
      "gt2CvYKiX5Dmk/oudHh0"
     ],
     [
      "g4aDaoFFgtyCtYFFjl6QrC5wZGY="
     ],
     [
      "lkwvlcSNkYFFg4+DVi5qcGc="
     ],
     [
      "keWYYYFFkYiCooFFgseC8YLIgsk="
     ],
     [
      "l0yWvJBsgUWOmZO2gUWQhJBpLnBkZg=="
     ],
     [
      "kuGCoi+LQY2RgtmC2g=="
     ],
     [
      "YmFja3VwL4NYg16DQ4OLIINBg4uDUoFbg4suanBn"
     ],
     [
      "kWaSvILGgrEuanBn"
     ],
     [
      "jFEvg0GDRYNn"
     ],
     [
      "kpqTeIFFi5eXoy56aXA="
     ],
     [
      "lX6SboFFknKR3C+LppfNLmRvY3g="
     ],
     [
      "g0GDSoNmg36BWw=="
     ],
     [
      "g0eDbIOLg02BWy5wcHR4"
     ],
     [
      "jLUvinePS4FFk1Y="
     ],
     [
      "keOXnV+NdYmJLmpwZw=="
     ],
     [
      "YmFja3VwL425gUWM34zjLm1k"
     ],
     [
      "g2qDhYFbg1gvg1iDZYNig3ZflXOIwF+DQy+OQoLBIJBWioMuanBn"
     ],
     [
      "jueC6IFFjuOCoi+K5pKjgugubXA0"
     ],
     [
      "MjAyNC+C249vkMiQbI3eL5OugqmCtS5tcDQ="
     ],
     [
      "kNUucG5n"
     ],
     [
      "gqmCyILBLnBkZg=="
     ],
     [
      "gsSC6SCUTSCC3ILBgr2CrS56aXA="
     ],
     [
      "kLaV+pGXLmpwZw=="
     ],
     [
      "greC3ILxlp6Rqy54bHN4"
     ],
     [
      "jF4vg1iDSiCTpJWFLnppcA=="
     ],
     [
      "g2WDjS54bHN4"
     ],
     [
      "g1gucGRm"
     ],
     [
      "gu2C6CCCu4K1gsQgilmTli5tcDQ="
     ],
     [
      "j6yMXl+WXi5wcHR4"
     ],
     [
      "kEiC7YFFiso="
     ],
     [
      "kkKC5oLrgrWCrY9bk2QuZG9jeA=="
     ],
     [
      "km2CwZWqgq8uanBn"
     ],
     [
      "jo6C3S5jc3Y="
     ],
     [
      "g1KDky54bHN4"
     ],
     [
      "gqIvgqCC6IKqgsYvguBfgsiCul+DQYN9g12Dky5kb2N4"
     ],
     [
      "i0GC6F+Wgo+XLnBkZg=="
     ],
     [
      "g0eDk4NXg2qDQV+BVS5tcDQ="
     ],
     [
      "g1KDQYFFlryRT4FFj4iVqg=="
     ],
     [
      "lV2Uuy+OqY3sLnBwdHg="
     ],
     [
      "l6SP4y5qcGc="
     ],
     [
      "g0qDb4FbgUWPRYLBgUWC6oLpLnR4dA=="
     ],
     [
      "iOqU1JTGLm1wNA=="
     ],
     [
      "jsuQuC+Ws5BsX4+Rk1gubWQ="
     ],
     [
      "gsKCyIKqguiDYIOHg1KDjIFbg2cubXA0"
     ],
     [
      "keWThy5jc3Y="
     ],
     [
      "i++Nhy5wZGY="
     ],
     [
      "gtOCrS5kb2N4"
     ],
     [
      "YmFja3VwL5WJgq+BRZhBjdovlcCC8ZVLl3Y="
     ],
     [
      "lN+MgA=="
     ]
    ]
   },
   {
    "id": "ko-euc-kr-1",
    "enc": "euc-kr",
    "ok": 140,
    "arcs": [
     [
      "wK/Azy5kb2N4"
     ],
     [
      "s9YuY3N2"
     ],
     [
      "w+vH2LCov7Avvu618rChLmNzdg=="
     ],
     [
      "wfjBpF/B9sGhX7TZwd8ueGxzeA=="
     ],
     [
      "YmFja3VwL73SwfjH4C/Gx7DhILG5ueYvwLq1pS50eHQ="
     ],
     [
      "uPO9usXNLmNzdg=="
     ],
     [
      "wrAuZG9jeA=="
     ],
     [
      "u99ftvU="
     ],
     [
      "tb+xuCCxurTrLnBkZg=="
     ],
     [
      "sPG287nnLmpwZw=="
     ],
     [
      "yKYuanBn"
     ],
     [
      "vvcgxLguemlw"
     ],
     [
      "vufA2i5tcDQ="
     ],
     [
      "v8oucG5n"
     ],
     [
      "wM+7/cDPyK8vw8S02bq4uLbEp7O7LmNzdg=="
     ],
     [
      "ZG9jcy/D68fRse7B+L7Gx8QudHh0"
     ],
     [
      "v+y4sCC03rfIIMDauvEuemlw"
     ],
     [
      "wNTA2l+6uV/BpMXrLnppcA=="
     ],
     [
      "YmFja3VwL8Srv+7GvF/B71/Dor/4LmpwZw=="
     ],
     [
      "tOu4uLW5LnR4dA=="
     ],
     [
      "s+3AxyDB9r/4Lm1wNA=="
     ],
     [
      "YmFja3VwL7GkufzAp8bEwM8uemlw"
     ],
     [
      "xucuanBn"
     ],
     [
      "u+e1tcHfus4uanBn"
     ],
     [
      "utKxuMD8x88uanBn"
     ],
     [
      "yMS15S5tZA=="
     ],
     [
      "YmFja3VwL7ytwsoueGxzeA=="
     ],
     [
      "wPvA2rzSuvHA2g=="
     ],
     [
      "tsiwsMDMX8ilwNouY3N2"
     ],
     [
      "ZG9jcy+/rLfhLnR4dA=="
     ],
     [
      "ucy35y5jc3Y="
     ],
     [
      "tdfF9S+80sDl"
     ],
     [
      "sK2+xsH2"
     ],
     [
      "yPG4wS+9ysDasKEueGxzeA=="
     ],
     [
      "yK3H2CCx17iyLnBkZg=="
     ],
     [
      "utKxuL3iLmNzdg=="
     ],
     [
      "xKGw+rjBLnhsc3g="
     ],
     [
      "xq7Ap8XNIMfgwfgvud275w=="
     ],
     [
      "v/LB98DMIMitwMzGri+3ul+9x8Gmt84uanBn"
     ],
     [
      "wKfHz7zSx8HGrr/+vu4uemlw"
     ],
     [
      "ZG9jcy/B37W1xKu/7sa8LmRvY3g="
     ],
     [
      "vcIucHB0eA=="
     ],
     [
      "vsbAzL26xam4si+/qcSjILnmu+e8sSDAzsXNLnppcA=="
     ],
     [
      "urnBpi54bHN4"
     ],
     [
      "v6GzysH2wdbBpi5tcDQ="
     ],
     [
      "w7XA573AsPwuY3N2"
     ],
     [
      "vcW8usL3v/guZG9jeA=="
     ],
     [
      "yMa3wyCx17exsKEgsKHA1C5wZGY="
     ],
     [
      "vK2/7y50eHQ="
     ],
     [
      "w+Kwo1+058iyL8bHsOGzu7+qs6q/wg=="
     ],
     [
      "w6S/9rnowaTEob/sLmRvY3g="
     ],
     [
      "wdbDvLnZuKXB/C5jc3Y="
     ],
     [
      "MjAyNC+787mrw6Szzi54bHN4"
     ],
     [
      "wNTA5S+1pcDMxKHFsr7vLmRvY3g="
     ],
     [
      "sLO9wyDA0y5tZA=="
     ],
     [
      "vcW80y5kb2N4"
     ],
     [
      "w+AucHB0eA=="
     ],
     [
      "wba47S56aXA="
     ],
     [
      "x9i47cfvLm1wNA=="
     ],
     [
      "sde4sl+068fRLnBwdHg="
     ],
     [
      "s6q/wrTZLmpwZw=="
     ],
     [
      "xsSxqy5wbmc="
     ],
     [
      "udrBpMjxLnhsc3g="
     ],
     [
      "wvzBtl+w5rHitbUucHB0eA=="
     ],
     [
      "uei05yC8scDTL7ytseJfxay3ob26"
     ],
     [
      "vLG7/S5wbmc="
     ],
     [
      "wMy3qF+96C5wZGY="
     ],
     [
      "v97CysDMtvUucG5n"
     ],
     [
      "uLa4oy5tZA=="
     ],
     [
      "YmFja3VwL8bEv+ux4sG2wb675y5tZA=="
     ],
     [
      "ZG9jcy++yMD8X7GzyK8vw6S/7C5tcDQ="
     ],
     [
      "ueixuC5wZGY="
     ],
     [
      "waa+4MSvLm1wNA=="
     ],
     [
      "wfGw3C5tcDQ="
     ],
     [
      "vcPDu8fYvNIudHh0"
     ],
     [
      "x9Gw6LOqsKUuZG9jeA=="
     ],
     [
      "vLGw7V/A5cL4X7vnvb8uemlw"
     ],
     [
      "u/24rr7KLmpwZw=="
     ],
     [
      "vsa+31+757TcX7/CtNkucHB0eA=="
     ],
     [
      "uK6287vzwqEuZG9jeA=="
     ],
     [
      "wd+/5C5tcDQ="
     ],
     [
      "u+rHzy+87rn8wKe17cDMLnBwdHg="
     ],
     [
      "uvHHzyC80sCnIMGmvsgudHh0"
     ],
     [
      "vsbAzMTcwMe5ri5wbmc="
     ],
     [
      "vNK9ui5qcGc="
     ],
     [
      "s+vD4rHwxMG8wS5wcHR4"
     ],
     [
      "ufa8uC5tcDQ="
     ],
     [
      "w+a8ui5wbmc="
     ],
     [
      "uvu/rMDnL7i2uK6+xiDD1rCtLnppcA=="
     ],
     [
      "wNLBy7zbL73FvNMudHh0"
     ],
     [
      "wve287iuLnhsc3g="
     ],
     [
      "MjAyNC+6uC5wZGY="
     ],
     [
      "v7m72yCw8CDHwbfOsde3pS5tZA=="
     ],
     [
      "u/3FwiDAzMShLm1k"
     ],
     [
      "ZG9jcy+89rizLnBwdHg="
     ],
     [
      "v+7H17fnwMwuY3N2"
     ],
     [
      "s/a5ri5tcDQ="
     ],
     [
      "wM+05y/EwcXZw/fH0bWlvsa4trW1Lnhsc3g="
     ],
     [
      "sOIuY3N2"
     ],
     [
      "x9XA27yzuLYuemlw"
     ],
     [
      "x9cuY3N2"
     ],
     [
      "ZG9jcy/B+MH2ILq5LnBwdHg="
     ],
     [
      "ua7IrSC09iDB+MH2LmRvY3g="
     ],
     [
      "vPjDtbTAs6YuZG9jeA=="
     ],
     [
      "waTB9i5qcGc="
     ],
     [
      "uLa05w=="
     ],
     [
      "ucyxui/A5b3EX8bzvOIvwNu758HCv+wubXA0"
     ],
     [
      "x8G4rrnMvvaw7cH2"
     ],
     [
      "x7M="
     ],
     [
      "w9a80i5tZA=="
     ],
     [
      "x+DHzw=="
     ],
     [
      "wLi5x7fOxevIrbChvbovtdBfwPzIxC5qcGc="
     ],
     [
      "u+ewxyC56by6L7vnuf2x17ipLmpwZw=="
     ],
     [
      "uLbAzrXlLnR4dA=="
     ],
     [
      "sLPAzi+xuci4wMe/+CDAp8DlLnBwdHg="
     ],
     [
      "utC05y5qcGc="
     ],
     [
      "uLbDxi+47by6uri5sC+36yC6uL26ILbzwMzGri50eHQ="
     ],
     [
      "waLDy1+1ub7Gv8IuY3N2"
     ],
     [
      "wK/A/MDaX8fSsrK/5C5tZA=="
     ],
     [
      "wNq/+C+048DTX7DtuKMvvbq9urfOLnhsc3g="
     ],
     [
      "vLy//CC537vnIMbq"
     ],
     [
      "wfbFs1+48LXlX7GztNwuanBn"
     ],
     [
      "v+zB1ryxX8bHuMW3ri5kb2N4"
     ],
     [
      "wfa5rrDFseIucGRm"
     ],
     [
      "uau0/SDAr8D8Lm1wNA=="
     ],
     [
      "s6202Q=="
     ],
     [
      "s9Gw3LrOv6kudHh0"
     ],
     [
      "xPvB7l+56C5wbmc="
     ],
     [
      "sKiwol+9ybiux9AuY3N2"
     ],
     [
      "w7zAsLD8L72jX7rBtbUvv6rA0yC+7sK8uOkubXA0"
     ],
     [
      "sPzH0S5wZGY="
     ],
     [
      "vLyw6LD8u/O067nmLnR4dA=="
     ],
     [
      "ud206yC4xbPiILvvvLrA/MDaLmRvY3g="
     ],
     [
      "ubDDvCCx18D6LmpwZw=="
     ],
     [
      "vLq60C54bHN4"
     ],
     [
      "x8G3zrHXt6G51l++1r/PLnR4dA=="
     ],
     [
      "vsu3ur26Lnhsc3g="
     ],
     [
      "wNrEzy5wcHR4"
     ],
     [
      "tMCzoi5jc3Y="
     ],
     [
      "vcXB9i5tcDQ="
     ],
     [
      "MjAyNC/FrF/Gx7vnLmRvY3g="
     ],
     [
      "YmFja3VwL8DlvcQgur0uZG9jeA=="
     ],
     [
      "w8oudHh0"
     ],
     [
      "stwguasubXA0"
     ],
     [
      "wdbBpiDAr7iuLnBkZg=="
     ],
     [
      "vsjDtrz2X726L7yxxcMuZG9jeA=="
     ],
     [
      "wPzAzCCw6L3HL8bqLnhsc3g="
     ],
     [
      "ud+4rl+24y5jc3Y="
     ],
     [
      "wNS5ri+02b7nyPzH1S5wcHR4"
     ],
     [
      "vPa3yS5kb2N4"
     ]
    ]
   },
   {
    "id": "west-cp437-1",
    "enc": "cp437",
    "ok": 150,
    "arcs": [
     [
      "cHJpbmOhcGlvcy5wbmc="
     ],
     [
      "omxlb19hdXRvcmlzYXRpb25fY29jYS5jc3Y="
     ],
     [
      "aG9tZW5zLWNhcGl0YWwtZW1wZXqiLm1wNA=="
     ],
     [
      "c2NolG5oZWl0LWFybYJlcy1wcm96ZW50Lm1k"
     ],
     [
      "c2VjcmV0YXKhYV+CY29sZXNfY2FjaIIubWQ="
     ],
     [
      "YmFja3VwL3BygmOCZGVudC9wZYdhLWlkZW50aWZpY2FjaaJuLnBwdHg="
     ],
     [
      "cHKEc2lkZW50IHBlbnNhZG8gcHJvbW9jaaJuLmpwZw=="
     ],
     [
      "R2VyhHRlIG1lYy5tcDQ="
     ],
     [
      "YmFja3VwL3JlZ3VsYXItcmVsYXRpdmUtcoJjZXB0aW9uLm1k"
     ],
     [
      "bKFkZXJlc19idW5kZXN0YWc="
     ],
     [
      "QmFzZV9sbGV2YXKgLm1k"
     ],
     [
      "dGiCIG1laW50LnBuZw=="
     ],
     [
      "ZG9jcy9nZXeEaGx0L3RlcnJlcy1ohG5kZS5tZA=="
     ],
     [
      "oGxidW0udHh0"
     ],
     [
      "cGF0cqJuLXBlcmRlbmRvLXBvdWNhLnppcA=="
     ],
     [
      "c6FtYm9sby90ZXJyoXZlbF9mb3llcl9icmFzoWxpYS5tZA=="
     ],
     [
      "bGFpc3OCIHBlcm1pc28gZ29ueqBsZXo="
     ],
     [
      "dmWhY3VsbyB2b2xhbnQucHB0eA=="
     ],
     [
      "WW91dHViZSBygmZvcm1lIGqidmVuZXMuemlw"
     ],
     [
      "UGFwYWlfYWlkgl9lbGxvL4RsdGVyZW4gZGlzdGFuY2Ugc29tYnJhLnR4dA=="
     ],
     [
      "gnBvcXVlLnBuZw=="
     ],
     [
      "cGVkaWRvcyB0ZWNub2xvZ6FhcyBkZXRlcm1pbmFkby5jc3Y="
     ],
     [
      "YXZhbodvIHJlbGlnaW9uIG51aXQucGRm"
     ],
     [
      "UHJlh29zLnhsc3g="
     ],
     [
      "boJlLnBwdHg="
     ],
     [
      "Z4JugnJhbGVtZW50L2FjdHVhY2mibiBhbXBsYW1lbnRlLnppcA=="
     ],
     [
      "ZnKBaGphaHI="
     ],
     [
      "cmljby1ob3JyoXZlbC1kcoFja2VuLmpwZw=="
     ],
     [
      "c2VkZSBmlHJkZXJuLnhsc3g="
     ],
     [
      "dG9udG9fcmVudHKCZV9wcm9maWwuemlw"
     ],
     [
      "bGlignJhdGlvbi1kaWFzLXR1gnMuY3N2"
     ],
     [
      "dIJtb2lnbmFnZXMgZW5zZW1ibGUvbGVndGUgYW5shHNzbGljaC5wZGY="
     ],
     [
      "Y2FycmmKcmUgdGVjaG5pc2NoLmRvY3g="
     ],
     [
      "cG91cnJhaXMgY29tgnJjaW8gYW5kcoIucG5n"
     ],
     [
      "aIR1ZmlnLmRvY3g="
     ],
     [
      "dmVyaIRsdG5pcw=="
     ],
     [
      "YmFja3VwL2FvlnQtbW9ycmVuZG8vYWdyYWSgdmVsLmRvY3g="
     ],
     [
      "ZXhjdXNhX2VtcGVjgi50eHQ="
     ],
     [
      "ZG9jcy9tZWVyIHJlZ2FyZIIgbXVuaWNpcGFsLm1k"
     ],
     [
      "YXVziG5jaWEueGxzeA=="
     ],
     [
      "ZW5sZXZlci12oWEtcHKIdGUubWQ="
     ],
     [
      "cGGhcy54bHN4"
     ],
     [
      "aW5ngm5pZXVyLnBwdHg="
     ],
     [
      "Zm90b2dyYWahYSBjb29wgnJhdGlvbiB2cy9toF+BYmVybGVnZW4uemlw"
     ],
     [
      "cGVyc5RubGljaGUueGxzeA=="
     ],
     [
      "ZmyBZ2VsLmpwZw=="
     ],
     [
      "bWljcm9zb2Z0LXNhbHZhci1lY29uom1pY2EucHB0eA=="
     ],
     [
      "cGFyZWNpYSBkaXKhYS5jc3Y="
     ],
     [
      "Q2FtYmmiX2Ryk2xlX2xpbmRhcy5wcHR4"
     ],
     [
      "ZG9jcy9komxhcmVzLnR4dA=="
     ],
     [
      "dHJhdoJzLWZ1dGVib2wvZXJtlGdsaWNoZW4uZG9jeA=="
     ],
     [
      "TYJ0YWwucGRm"
     ],
     [
      "aW5xdWmKdGUuZG9jeA=="
     ],
     [
      "Rm9uZG9faW52aXSCc190ZXJlbW9zLnBwdHg="
     ],
     [
      "RWluZoFocnVuZy50eHQ="
     ],
     [
      "SW50ZW5zaXZfZnJvbnRpinJlLmpwZw=="
     ],
     [
      "MjAyNC9ygnB1YmxpcXVlLmRvY3g="
     ],
     [
      "MjAyNC9vcmRlbqIuZG9jeA=="
     ],
     [
      "MjAyNC9ygmdpb25hbA=="
     ],
     [
      "U2FioWFfZm4uZG9jeA=="
     ],
     [
      "ZqBjaWwueGxzeA=="
     ],
     [
      "VG9kYXahYS9OaW5ndYJtL251ZXN0cmFzX26CY2Vzc2FpcmVfZWxmLnBwdHg="
     ],
     [
      "UHKieGltYV9wYWlyZS56aXA="
     ],
     [
      "QmFyY28gZqBicmljYS5wcHR4"
     ],
     [
      "dWUgYmVolHJkZS9yimduZS5tcDQ="
     ],
     [
      "cG9pbnRlLWhhYnKgLm1wNA=="
     ],
     [
      "ZIJzb2yCLnR4dA=="
     ],
     [
      "ZmF6iCBzcGFyZW4vTKFuZ3Vhcy9vYmxpZ2FjaaJuL6JkaW8ubWQ="
     ],
     [
      "amFwb26Ccy54bHN4"
     ],
     [
      "UKBnaW5hcy50eHQ="
     ],
     [
      "cXVpeqBfYnVlbm9zLm1k"
     ],
     [
      "cG9koWFuLWFudGVjZWRlbnRlcy1kZXVzZXMucG5n"
     ],
     [
      "RoFzc2VuLnR4dA=="
     ],
     [
      "mWZmZW50bGljaGtlaXQtdG9ybmVvLWhlcm1hbm8ucG5n"
     ],
     [
      "bGFzc3QtdHWCcy5jc3Y="
     ],
     [
      "ZIJmaW5pdGl2ZW1lbnQgcGVzY2Evc2FtLW1hbmmKcmUuanBn"
     ],
     [
      "Y29tcHJhcl92oWRlbw=="
     ],
     [
      "coJ2b2x1dGlvbl9hbnJ1ZmVuLnBwdHg="
     ],
     [
      "Y29udHKgcmlvX2Vyc3Rlbi54bHN4"
     ],
     [
      "TYJuYWdlLXBlZ2FyLXdhc3Nlcg=="
     ],
     [
      "T3JsgmFucy5kb2N4"
     ],
     [
      "dmlnaWxhbmNpYS1icmF1Y2h0LW2gcXVpbmEuemlw"
     ],
     [
      "ZG9uboJlL2ZyZWUtZGVncoIuY3N2"
     ],
     [
      "Y29uZGljaaJuL1ZvaWyFLnR4dA=="
     ],
     [
      "cG9zc6F2ZWxfdm9yZ2Vub21tZW4ucHB0eA=="
     ],
     [
      "UmVtYXJxdYIudHh0"
     ],
     [
      "bGFuh2FkYS1jcml0aXF1ZS56aXA="
     ],
     [
      "cmVjZW50ZSBleHRyiG1lbWVudC5tZA=="
     ],
     [
      "UGl0aYIuemlw"
     ],
     [
      "Z2VyhHQ="
     ],
     [
      "YnJpdINuaWNvLnBuZw=="
     ],
     [
      "ZG9jcy9zdHJhdIJnaWUueGxzeA=="
     ],
     [
      "Y2iKcmVfZGVzdGFfaG9jaHplaXQvUGV0cqJsZW9fdm90b3MucGRm"
     ],
     [
      "dmVyZ2xlaWNoZW5fZXhlcmOhY2lvX2JhaGlh"
     ],
     [
      "cmVnaaJuX3Bvc3Rlcmlvcm1lbnRlLm1wNA=="
     ],
     [
      "Y29uY2VudHJhdGlvbl9jaGGMbmUubXA0"
     ],
     [
      "dmWhY3Vsby5wcHR4"
     ],
     [
      "bGllbiBhgnJlYS5wcHR4"
     ],
     [
      "QXV0ZXVyIG6icy5wcHR4"
     ],
     [
      "R4JugnJhbGVzLnBuZw=="
     ],
     [
      "Z4RzdGUgcG9ydHJhaXQuanBn"
     ],
     [
      "VmWhY3Vsby5wcHR4"
     ],
     [
      "YmFja3VwL2VtcGllemFuIGVkdWNhY2mibiBwdC9hdXByinM="
     ],
     [
      "Q4JsdWxhcy+BYmVybGVndC5tZA=="
     ],
     [
      "QXRtb3NwaIRyZV9zYaNkZS56aXA="
     ],
     [
      "ZG9jcy9moXNpY2FfZIJ0cnVpcmUuemlw"
     ],
     [
      "cmVwcmVzZW50YWNpom4ucGRm"
     ],
     [
      "YmFja3VwL2eCboJyYXRpb24gc3RyZWNrZW4ubWQ="
     ],
     [
      "MjAyNC9Tb21vcyBwcmWHby96d2VpZXJfc2V0emVuX3NpZ3Vpoi5jc3Y="
     ],
     [
      "kHR1ZGVzLXBlbnNhaXQuanBn"
     ],
     [
      "bmFkaWUtgmNhcnQtc3BhcmVuLmpwZw=="
     ],
     [
      "dW5pdmVyc2l0oHJpby5tZA=="
     ],
     [
      "cHKCZmV0L1BhcmGhc28uZG9jeA=="
     ],
     [
      "QmV0cm9mZmVuZW5fgnBvY2EuanBn"
     ],
     [
      "bYFzc2UgcXVpeqBzIGF1dG9yaWRhZGVzLmRvY3g="
     ],
     [
      "U2VudGlyc2VfbWlzaaJuX3JhcHBlbGxlL21pgnJjb2xlcy50eHQ="
     ],
     [
      "bYJjaGFudC9ngW50ZXIudHh0"
     ],
     [
      "UoJzZWF1eC1mdXJlbnQtaWkudHh0"
     ],
     [
      "Z2VolHJlbiBkgmNvdXZyZS54bHN4"
     ],
     [
      "YoFjaGVyX21pc2UubWQ="
     ],
     [
      "Y29udGWjZG9zLnBuZw=="
     ],
     [
      "cmVzaXN0iG5jaWEucGRm"
     ],
     [
      "UIpyZS9uonMubXA0"
     ],
     [
      "UGlsb3RvLWVybZRnbGljaGVuLnBuZw=="
     ],
     [
      "ZmFsYW0tcG9kcqFhbW9zLnppcA=="
     ],
     [
      "ZW5mYW50cyBwk3I="
     ],
     [
      "MjAyNC9EgmNoZXRzX3N1amV0LmpwZw=="
     ],
     [
      "hXNfY3JlaW8uanBn"
     ],
     [
      "c2F1ZKB2ZWxfZXJoaWVsdGVuX2lyL3Byoi50eHQ="
     ],
     [
      "YmFja3VwL2tvY2hfdW5pdIIudHh0"
     ],
     [
      "YWRhcHSCX3Byb2Z1bmRhX2VudHJhjG5ldXIubWQ="
     ],
     [
      "YW51bmNpoi5kb2N4"
     ],
     [
      "Q6JkaWdvLnR4dA=="
     ],
     [
      "ZG9jcy9laW5zdGVsbGVuX3ByonByaW9zLnhsc3g="
     ],
     [
      "cINuaWNvLnBkZg=="
     ],
     [
      "Y29udmVyc2FjaaJuIGhpbnRlci5wcHR4"
     ],
     [
      "VGl0dWxhciBzYWxpoiBzcG9ydC50eHQ="
     ],
     [
      "ZF9wcoJzaWRlbnRlL6ByYm9sLYNnZS56aXA="
     ],
     [
      "ZG9jcy9lbF9qYW2gcy54bHN4"
     ],
     [
      "Y29uc2FjcoIgY3Jlc2NlIHBlcqFvZG8vQ2hhbXBpb24tY3JloWEvbWlzdIJyaW8vUKBnaW5hL3JlZ2VsbYRzc2lnLmNzdg=="
     ],
     [
      "cHJlc2VudKIudHh0"
     ],
     [
      "QmVzY2iEZnRpZ2VuIGFycm96LmpwZw=="
     ],
     [
      "ZG9jcy9yaXNjb3MtYXRyoHMucG5n"
     ],
     [
      "amVfcGiCbm9tim5lX2JyYXZvLm1wNA=="
     ],
     [
      "dW5pdmVyc2l0gnNfcGllLm1wNA=="
     ],
     [
      "YW50b25pby1toWEucGRm"
     ],
     [
      "ZXN0YXKCIGVxdWlwby54bHN4"
     ],
     [
      "d4RyZW4uanBn"
     ],
     [
      "ZG9jcy9EZWNsYXKiLnBuZw=="
     ],
     [
      "bIRuZ2VyZS54bHN4"
     ]
    ]
   },
   {
    "id": "west-cp850-1",
    "enc": "cp850",
    "ok": 148,
    "arcs": [
     [
      "Y2FwYWNpdIIucGRm"
     ],
     [
      "o2x0aW1hLm1k"
     ],
     [
      "QWJvZ2Fkb19leGNlh8ZvLmNzdg=="
     ],
     [
      "ZXNwZWOhZmljby1wbGFuLnR4dA=="
     ],
     [
      "RGVzYXJyb2xsYWRvLWiDdGUucHB0eA=="
     ],
     [
      "Y4NtZXJhcy54bHN4"
     ],
     [
      "ZXN0YWNpom4tZW5nLnBkZg=="
     ],
     [
      "ZXhlcmOhY2lvLW1pdHRlLmRvY3g="
     ],
     [
      "ZGlzYWl0LXaIbS5wbmc="
     ],
     [
      "YmFja3VwL2NvbmNlbnRyYWNpom5fcHJvL0Ftgm5hZ2VtZW50LWFzc3VudG9z"
     ],
     [
      "aJRoZQ=="
     ],
     [
      "bmmkby5tcDQ="
     ],
     [
      "MjAyNC9zZXLGbyBtYW51ZWwvZnVuh8ZvLnppcA=="
     ],
     [
      "T3JnYW5pemFjaaJuIHJlY2V2b2lyIGlkZW50aWZpY2GHxm8uY3N2"
     ],
     [
      "cXVpeqAgZXVyb3BlYS5wbmc="
     ],
     [
      "aJRsbGUubWQ="
     ],
     [
      "gnRhYmxpc3NlbWVudHNfcGF1bGlzdGEuanBn"
     ],
     [
      "YXNzYXNzaW5hdG9fbYp0cmVzLnppcA=="
     ],
     [
      "SIR0dGU="
     ],
     [
      "Y2FydMZvIGVyZmFocmVuL0dsgWNrbGljaCBhc3NlbWJsZWlhLm1wNA=="
     ],
     [
      "ZGVtYW5kYSBleHRyYaRvLmNzdg=="
     ],
     [
      "dmVylGZmZW50bGljaHVuZ19kdS54bHN4"
     ],
     [
      "QXZpom4tcHJlc2Vuh2EuanBn"
     ],
     [
      "ZWlnZW50bGljaGVuIGRlam8gZnKBaC56aXA="
     ],
     [
      "dGVybWluYV9hh6NjYXJfdHJhaXSCLm1wNA=="
     ],
     [
      "bYpyZS54bHN4"
     ],
     [
      "MjAyNC9jb250og=="
     ],
     [
      "ZG9jcy9jb250cmlidWmHxm9fa29uc2VxdWVuemVuLm1k"
     ],
     [
      "ZG9jcy9IlGhlci1kZWphcy5wZGY="
     ],
     [
      "RGVzY3Jph8ZvLnhsc3g="
     ],
     [
      "oHJlYS56aXA="
     ],
     [
      "aGllcnJvX2xhYm9yX2ludGVydmVuh8ZvLnBuZw=="
     ],
     [
      "Y2FybmF2YWwgZGlmZmljdWx0gnMudHh0"
     ],
     [
      "kGNyaXZhaW4gcmVjdXJzb3Mvpy9jb6RvLnBuZw=="
     ],
     [
      "ZWyCdHJpY2FfcXVlc3TGb19ub3JtYXMvYXBsaWNhY2mibi1jdWxwYWJsZS9wcoJjaWV1eC5wbmc="
     ],
     [
      "ZGmgbG9nby54bHN4"
     ],
     [
      "cmVnYXJkgi5wZGY="
     ],
     [
      "c29pcoJlLnppcA=="
     ],
     [
      "c2mKY2xlcy5tcDQ="
     ],
     [
      "TG9ncqJfbIJnZW5kZS5jc3Y="
     ],
     [
      "cGFzc4JzX2NhY2iCLm1k"
     ],
     [
      "YXZlYy1wYXKhcy9hZGVtoHMudHh0"
     ],
     [
      "TYJ0aWVy"
     ],
     [
      "coJmgnJlbmR1bV9kaWNrZS5tZA=="
     ],
     [
      "SW5mgnJpZXVyL0dldJR0ZXQubWQ="
     ],
     [
      "cqBwaWRhIG5ppG8uY3N2"
     ],
     [
      "RnJhbodvaXMuemlw"
     ],
     [
      "coJzdW2CLm1wNA=="
     ],
     [
      "TGFuh2FyLnR4dA=="
     ],
     [
      "coJzb3VkcmUuanBn"
     ],
     [
      "cGFzc2FtLWV2b2x1h8ZvLWKBcmdlcm1laXN0ZXIueGxzeA=="
     ],
     [
      "RXVyb3CCZW5uZXNfZW5zZaRhbnphLnBkZg=="
     ],
     [
      "UMZvLWFxdWVsbGFzLW1lZGlkYXMuY3N2"
     ],
     [
      "c2VsZWNjaaJuLXdlcmRlbi1kcmFwZWF1"
     ],
     [
      "cGxhjHQuY3N2"
     ],
     [
      "YmFja3VwL0NvbnN0aXR1eWUggWJlcnpldWdlbi5tcDQ="
     ],
     [
      "Q3WgbGVzLXByonByaWEtc2FuLnBkZg=="
     ],
     [
      "Sm91cm5hdXggY4JsdWxhcy9lc2NvbGFyX2OCbHVsYXMucGRm"
     ],
     [
      "coJhY3Rpb24ucG5n"
     ],
     [
      "Q29tbWVudF9olGhlcmVfY29tcGFuaGlhcy5tcDQ="
     ],
     [
      "dqFkZW9z"
     ],
     [
      "RGGkb3MtZ2VtZWludC9NoW5pbWEtcHKCc2VudGF0aW9uL2VuY29udHJhbW9zX2qjcmkucG5n"
     ],
     [
      "c2NolG5lcyBuZW0ubWQ="
     ],
     [
      "QXVziG5jaWEgaW5pbWlnb3MueGxzeA=="
     ],
     [
      "SW5mb3JtYWNpom4ucHB0eA=="
     ],
     [
      "bGViZSBpbqNtZXJhcyBpbnRlbnRhbmRvL2VzcIpjZV9nZWaBaGx0LmNzdg=="
     ],
     [
      "d2FobGthbXBmX3VuaXZlcnNpdIJzX3NvcnRpZXMuanBn"
     ],
     [
      "aW5ko3N0cmlhcyBjaGFyZ2VzIGSBcmZ0ZS54bHN4"
     ],
     [
      "b3NjdXJvIGV4cHJlc3PGby54bHN4"
     ],
     [
      "gmxlY3RyaXF1ZV9uZWNlc2l0b19mb3JtdWxlLnppcA=="
     ],
     [
      "boRtbGljaC5wbmc="
     ],
     [
      "bZRjaHRlc3QvbYJ0cm8uZG9jeA=="
     ],
     [
      "Z2FsZXKhYQ=="
     ],
     [
      "ZoJ2cmllcg=="
     ],
     [
      "cIJyZXoga2xhZ2UgZ3Jhei9wb3JxdYgvc4JyaWUucGRm"
     ],
     [
      "UGl6emFfc2Fjoi5wZGY="
     ],
     [
      "boIvUmGhY2VzLnR4dA=="
     ],
     [
      "U8ZvX2ltcHJlc2lvbmFudGUuY3N2"
     ],
     [
      "gmxfYXVmbGFnZS5kb2N4"
     ],
     [
      "kHZpdGVyLWxpbmtzLWRpcmlnZS5tZA=="
     ],
     [
      "ZG9jcy9lbIJ0cmljYSBwcm9mZXNvcmEudHh0"
     ],
     [
      "U2luYWlzX4J0YXBlcy91c2luZV9zZXKgLmRvY3g="
     ],
     [
      "c2NolG5oZWl0LnBkZg=="
     ],
     [
      "UG91cnJhX3BygnBhcmF0aW9uLnBwdHg="
     ],
     [
      "aW1wb3J0g25jaWEucGRm"
     ],
     [
      "bGFpc3OCL2luc3RpdHV0by1qonZlbmVzLnBkZg=="
     ],
     [
      "Y2F0gmdvcmllLWVudGVuZC1laW5kZXV0aWcvYXVzbIRuZGVyLmpwZw=="
     ],
     [
      "ZG9jcy9hbYJyaWNhaW5lLmNzdg=="
     ],
     [
      "RGV0cqBzX2RlX2VpLmpwZw=="
     ],
     [
      "UXVhbGl0hHQuanBn"
     ],
     [
      "gnRvaWxl"
     ],
     [
      "YmFja3VwL3ByonByaWFzLmRvY3g="
     ],
     [
      "ZpRyZGVybi5kb2N4"
     ],
     [
      "cmF0LWNvdXCCL3KCdW5pb24vZKFheg=="
     ],
     [
      "ZnJhbodhLnppcA=="
     ],
     [
      "YWZmYWlyZXNfcHVibGljYYfGby5tcDQ="
     ],
     [
      "Q29tZW50b3VfdmVya2Vocl9lc3SCbi5jc3Y="
     ],
     [
      "ZmFjdWx0gl9tonZpbC9tgmRpY29zLW9wZmVyL0aicm11bGEudHh0"
     ],
     [
      "Q29udmVuh8ZvLm1wNA=="
     ],
     [
      "cGFyYWxsimxlX3ByZXNpZIhuY2lhX2ZsdWcuZG9jeA=="
     ],
     [
      "TYJ0aG9kZXMvmWZmZW50bGljaGtlaXQvkGxlY3RyaXF1ZSBjb25zY2llbnRlLmpwZw=="
     ],
     [
      "aIN0ZS5qcGc="
     ],
     [
      "YXJ0oWN1bG9zLnBkZg=="
     ],
     [
      "aGlwonRlc2VfbWVzdHJlLnBuZw=="
     ],
     [
      "cmVzcG9zdGEgcHJvcG9zgi5wcHR4"
     ],
     [
      "Zmluc19mYXplbV9waXRpgi5wcHR4"
     ],
     [
      "ZXhwbG9zaaJuL2Z1bmRhbWVudGFsX3Nlc3PGb19kYaEuemlw"
     ],
     [
      "YmFja3VwL0RhbmViZW4gcHKKcy50eHQ="
     ],
     [
      "cXVlcmVtX2qEaHJpZ2UvgmNyaXRzLm1wNA=="
     ],
     [
      "ZG9jcy9joG5jZXIgZmxlaXNjaC56aXA="
     ],
     [
      "dIJjbmljYXNfZW50aWRhZGUucGRm"
     ],
     [
      "UoJwYXJ0aXRpb24gY29sinJlIGVuZGV0LmNzdg=="
     ],
     [
      "cHKCY2lzZS1hbHRlcm5hdGl2YXMuemlw"
     ],
     [
      "Z3Jhh2FzLm1k"
     ],
     [
      "c2VyoWFuLWJhbmQtYW2CcmljYS5tcDQ="
     ],
     [
      "bWlzdIJyaW9fbIFnZW4uemlw"
     ],
     [
      "U29moC9wYWRyxm8tZW5lcmehYS5qcGc="
     ],
     [
      "MjAyNC9SZXNvbHVjaaJuIGdlZoRocmxpY2ggYmVsZ2lxdWUudHh0"
     ],
     [
      "YXVmZ2ViYXV0IHNpZ3Vpoi9laW56aWdlLYJjcmFuLXBvc2l0aW9uLmNzdg=="
     ],
     [
      "o25pY2EgZ2FnbmFudC9ncm9zc2VfZm9uZIJlLnBwdHg="
     ],
     [
      "dm90gi5tZA=="
     ],
     [
      "aJRoZXJlbl9kZXNjcmlwY2mibi5jc3Y="
     ],
     [
      "iHRyZXMgZoFobHQgcmlzaWtvLnBuZw=="
     ],
     [
      "ZWZmZWN0dYJfbGVjdGV1cnNfc29jaWVkYWRlLnppcA=="
     ],
     [
      "bG9uZ3Vlcy1rhG1wZmVu"
     ],
     [
      "dHJhbnNph8ZvX2xlZ2VuZGFfaGFibGFuLnhsc3g="
     ],
     [
      "oGxjb29sIGhhcqAgZm9yY4IucGRm"
     ],
     [
      "YmFja3VwL0ludGVydmVuY2mibl9tlGNodGVzdC5wcHR4"
     ],
     [
      "mWZ0ZXIgZmluYW5jZXMgZnV0dXJvLmNzdg=="
     ],
     [
      "QnVzY2FuIGhhYnKhYS5tcDQ="
     ],
     [
      "TGljZW6HYS5jc3Y="
     ],
     [
      "TWluaXN0gnJpbyBtoWRpYS5qcGc="
     ],
     [
      "a2lsom1ldHJvc19zYWNygi5wbmc="
     ],
     [
      "aGFiaWEgbYJkaWNhbC5wcHR4"
     ],
     [
      "bKFkZXIvbJR3ZW4uemlw"
     ],
     [
      "MjAyNC90YWxsZXItc2VyoC1yoHBpZG8vYWx1bW5vcyBibJRk"
     ],
     [
      "ZG9jcy9lbnNlpGFuemFfYmVygWNrc2ljaHRpZ3RfgnRhYmxpci5wcHR4"
     ],
     [
      "Y8Zlcy90oXR1bG8tYW50d29ydC5qcGc="
     ],
     [
      "MjAyNC9vcmlnaW5hbF9wb3B1bGGHxm8ucHB0eA=="
     ],
     [
      "ZGVuaXMtbYFzc3RlLm1wNA=="
     ],
     [
      "cmVjgm1fdHJpZmZ0Lm1k"
     ],
     [
      "coJzZXJ2ZS1jYWxpZGFkLnR4dA=="
     ],
     [
      "Y2hhjG5lcy5wcHR4"
     ],
     [
      "cGF1dnJldIIvYWN0aXR1ZCBwb2ShYW4uY3N2"
     ],
     [
      "a3KEZnRlLmNzdg=="
     ],
     [
      "cHJvZ3JhbW1lIG1hdIJyaWFzLmRvY3g="
     ],
     [
      "YXBhcmVudGVtZW50ZV9tgmRpY29zLnppcA=="
     ],
     [
      "ZG9jcy9ldmFsdWFjaaJuL2NvbWlzaaJuLXRvcm5hLnBkZg=="
     ],
     [
      "ZG9jcy9hbGVtYW5pYS1jbGFzaWZpY2FjaaJuLnR4dA=="
     ],
     [
      "Q29udIJtLm1k"
     ]
    ]
   },
   {
    "id": "west-windows-1252-1",
    "enc": "windows-1252",
    "ok": 147,
    "arcs": [
     [
      "bWVt83JpYQ=="
     ],
     [
      "UG9kcu1hbi56aXA="
     ],
     [
      "VG91cm5lLWFudW5jafMvYXNzb2Np6XMtY29udHJvbGUtY3Vlc3Rp824="
     ],
     [
      "ZG9jcy9wb2ztdGljYS1zY2hsZWNodC1hdXJhaWVudC5wbmc="
     ],
     [
      "yW5lcmdpZS5wbmc="
     ],
     [
      "bW9zdHJhLXNw6WNpYWxpc3RlLXVtZ2VidW5nLnBkZg=="
     ],
     [
      "a+RtcGZlbi5wbmc="
     ],
     [
      "aW5zdGFsYWNp824gdXMueGxzeA=="
     ],
     [
      "Q29tcHJvbWlzc28gYW4gZPxzc2VsZG9yZi56aXA="
     ],
     [
      "3GJsaWNoL8lkdWNhdGlvbiB1bWFzIHJlbGF0aXYubXA0"
     ],
     [
      "YmFja3VwL3JlYWxpdOR0X21vcnJlbmRvLnhsc3g="
     ],
     [
      "cmVw+mJsaWNhLnBuZw=="
     ],
     [
      "c29tZSBsaelzLnBkZg=="
     ],
     [
      "ZXN0YWNp824vbeRkY2hlbiBlcnrkaGx0ZSBkaXJpZ2UueGxzeA=="
     ],
     [
      "Y2jhdmV6"
     ],
     [
      "d+RocmVuZF9wcm9wcmnpdGFpcmVzL2ludGl0dWzpL3b2Z2VsX2JheWVybl9mb3JhbS9FbnNlbWJsZSBkcmFtYSBzY2j2bnN0ZW4ucG5n"
     ],
     [
      "Y2F0YWx18WEgY2VsYSB1bm1pdHRlbGJhci5wbmc="
     ],
     [
      "RGlzcG9u7XZlbF9wYXJhbGzobGUvcmVwculzZW50ZXIuanBn"
     ],
     [
      "U+lwYXJhdGlvbiBvYmxpZ+kuemlw"
     ],
     [
      "b2JlcmZs5GNoZS56aXA="
     ],
     [
      "YmFqYXMgY2l1ZGFkYW7tYS9EZWNpZGlyIHRlciBkaWbtY2lsL0Zvcm3pLnBwdHg="
     ],
     [
      "Rm90b2dyYWbtYXMudHh0"
     ],
     [
      "aOJ0ZS54bHN4"
     ],
     [
      "ZXhwb3NpdGlvbiBqYXBvbupzIHBhcmFu4S5tcDQ="
     ],
     [
      "RGVzdHJ1aefjbyBkb2N1bWVudG9zLmpwZw=="
     ],
     [
      "aW1wcmVzc+NvLm1k"
     ],
     [
      "SGllcmb8ci50eHQ="
     ],
     [
      "c2FjcukucHB0eA=="
     ],
     [
      "SW52ZXN0aWdh5+NvX+l2b3F1ZV9mYedhbS5jc3Y="
     ],
     [
      "dmVybORuZ2VydA=="
     ],
     [
      "Q29uc2VndWlyYW1fbmnxYS5qcGc="
     ],
     [
      "cmVw+mJsaWNh"
     ],
     [
      "ZG9jcy9Gb25jdGlvbl9wYXF1ZXRfZGlyZWNjafNuLnBuZw=="
     ],
     [
      "U2VwYXJhY2nzbi56aXA="
     ],
     [
      "MjAyNC9TZWd1aW50ZXNfZvxobHQucG5n"
     ],
     [
      "cHJvbW/n428gdGlybyBzdWI="
     ],
     [
      "dW0gaXLhbi9lc3BlY3ThY3VsbyBmYW5zIHRyYWJhbGhhbS5jc3Y="
     ],
     [
      "cGVyc29uYWplc19wcuRzZW50aWVyZW4ucG5n"
     ],
     [
      "Y2Vuc+kvc3Bhc3MtY2F0ZWdvcu1hcy9lbXByZXPhcmlvLmRvY3g="
     ],
     [
      "2m5pY28udHh0"
     ],
     [
      "ZXNxdWXnYS54bHN4"
     ],
     [
      "ZXMgZXNwZWPtZmljYW1lbnRlLnR4dA=="
     ],
     [
      "YmFja3VwL2luZGl27WR1byBsZWdpc2xhY2nzbi5tcDQ="
     ],
     [
      "cmVuY29udHJlcy1yb3QtZGVjbGFyYefjby5wcHR4"
     ],
     [
      "cG9wdWxhcmVzIGJvYXMgcvZtaXNjaGVuL3JlY29ubmHudHJlLnR4dA=="
     ],
     [
      "bfxkZS5kb2N4"
     ],
     [
      "aWxlZ2FsLW1vbnTzbi1hdXN3YWhsL2L2c2VuLnppcA=="
     ],
     [
      "ZG9jcy9hcHBhcmHudC50eHQ="
     ],
     [
      "ROl2ZWxvcHBlcl9jYW1hL2JhdGVy7WEtc2lnbmUuemlw"
     ],
     [
      "TelkaWNvc19jb25jbHVz428uemlw"
     ],
     [
      "c2ltb24gZOlmYWl0ZSBncnVwb3MvSW5k+nN0cmlhLnR4dA=="
     ],
     [
      "YmFja3VwL2NhcnJvcy1ldmlk6m5jaWEuemlw"
     ],
     [
      "V29taXRfY29t6XJjaW9fcXVpc2UubXA0"
     ],
     [
      "RXVyb3DpZW5uZV9pbXBvc3PtdmVsLmNzdg=="
     ],
     [
      "UGVy+iBmZXVlci5wZGY="
     ],
     [
      "yXbpbmVtZW50X3DhZ2luYXNfZGFydW50ZXIuanBn"
     ],
     [
      "QXByb2JhY2nzbi5kb2N4"
     ],
     [
      "Q2hpbupzLmNzdg=="
     ],
     [
      "ZXhpc3Rpci1kZXBlbmRlLWVtcGV68y5qcGc="
     ],
     [
      "/GJlcnJhc2NodC1kZWNpcmxvLm1wNA=="
     ],
     [
      "bOFzdGltYS50eHQ="
     ],
     [
      "bGFuZ3NhbS1jb25leGnzbi56aXA="
     ],
     [
      "bW9zdHLzL3RlbWVyLXBy6S1kaWZm6XJlbmNlLmpwZw=="
     ],
     [
      "TelkaWNhbWVudHMucGRm"
     ],
     [
      "ZG9jdW1lbnThcmlvLmNzdg=="
     ],
     [
      "UHLkc2lkZW50Lnhsc3g="
     ],
     [
      "ROljaXNpb25zIHMgY29ubnVzLnBuZw=="
     ],
     [
      "cGVvcmVzX2ludGVncmF0aW9uX2Fs6W0ucGRm"
     ],
     [
      "Qelyb3BvcnQvc29iZXJhbu1hL01hcmlhLWjhL3NwYW5pZW4tZXh0cmHxYS56aXA="
     ],
     [
      "ZXJm/GxsZW4g4Wd1YS5tcDQ="
     ],
     [
      "ZGFy/GJlci5tcDQ="
     ],
     [
      "Sm8g9mZmZW50bGljaGtlaXQ="
     ],
     [
      "dmVydHUtcHLpY2lzZS1wYXJ0by50eHQ="
     ],
     [
      "UOkubWQ="
     ],
     [
      "6XBvdXNlLmNzdg=="
     ],
     [
      "Y/NkaWdvX2PpbHVsYXNfZW50cmV0YW50by5tZA=="
     ],
     [
      "Y2906S9wcmVvY3VwYefjbw=="
     ],
     [
      "Y29tcOl0ZW5jZXMuZG9jeA=="
     ],
     [
      "bWVt83JpYS5wcHR4"
     ],
     [
      "ZGlzZfFvL1N1ZfFvcy5wbmc="
     ],
     [
      "R2VzY2hyaWViZW4gYXRvIGRpZmbpcmVudHMudHh0"
     ],
     [
      "ZG9jcy9mYWN1bHTpIGV4aXN0ZS50eHQ="
     ],
     [
      "be0udHh0"
     ],
     [
      "ZWxlY3Ry825pY2EtYm91cnNlLnR4dA=="
     ],
     [
      "cXXpLnBuZw=="
     ],
     [
      "SGlzdPNyaWNvLnBkZg=="
     ],
     [
      "RGlmZulyZW50ZXMtZm9ybWVsLWN1YWxxdWllci50eHQ="
     ],
     [
      "cG9s7XRpY2FzX2NvbnN0cnXn429fd3VuZGVyLm1wNA=="
     ],
     [
      "cHJvcG9z6S1jZW50cmFsLnppcA=="
     ],
     [
      "YmFja3VwL0RhcuEucGRm"
     ],
     [
      "YnVuZGVzdGFnLW1lbmluby1mb3Jj6S5tcDQ="
     ],
     [
      "YW3pbGlvcmVyLnBwdHg="
     ],
     [
      "6XBpc29kZXMuemlw"
     ],
     [
      "ZXjpcmNpdG8ubXA0"
     ],
     [
      "9mZmZW50bGljaC5wZGY="
     ],
     [
      "QmF0ZWF1IGfpbulyYXRpb25zIHF1428ucG5n"
     ],
     [
      "bWVudGFsX2FtYW5o4y9mcmFuY2VzZXMtY2VhcuEuemlw"
     ],
     [
      "aGFj7WFuLXBhc2UvZ3XocmUuemlw"
     ],
     [
      "RGFu52FyLmpwZw=="
     ],
     [
      "ZG9jcy9yZXVuafVlcy5kb2N4"
     ],
     [
      "VGVy428tZnVlbnRlLWdlYnJhdWNodC56aXA="
     ],
     [
      "Y29taXNp824ucHB0eA=="
     ],
     [
      "c2VydmVudF92b3VsYWllbnRfcGF56S5qcGc="
     ],
     [
      "QfFvIHN0YXJ0IHRlbOlmb25vLnBuZw=="
     ],
     [
      "YmFja3VwL3Tpcm1pbm9fc2NobGllc3Nlbl9kb21pY2lsZS9TYXZvaXJfd/xyZGVuLmNzdg=="
     ],
     [
      "cGVy7W9kby5wcHR4"
     ],
     [
      "c+lwYXJhdGlvbi5tcDQ="
     ],
     [
      "ZG9jcy9k6WZhaXRlLnBuZw=="
     ],
     [
      "ZG9jcy9CbGVzc+lzLWphY3F1ZXMuY3N2"
     ],
     [
      "cOlyaW9kZSBwcm9mIGZvcm0uY3N2"
     ],
     [
      "YmVo9nJkZW4ubXA0"
     ],
     [
      "UHLpZmV0L2NhdXNlLWZpbmUtaW50ZXJ2ZW7n428udHh0"
     ],
     [
      "dmVyZGUgZ+lhbnQv7mxlLnBuZw=="
     ],
     [
      "ZG9jcy9S6XN1bekv6WxlY3Ryb25pcXVlL05vbXMtY29uZnVz428tZHUubWQ="
     ],
     [
      "YvZzZW4tcHJlc29zLXJlZnVz6S5wbmc="
     ],
     [
      "ZXhw6XJpZW5jZXMuanBn"
     ],
     [
      "ROl0YWlscy54bHN4"
     ],
     [
      "Q29tcOl0aXRpb24ubXA0"
     ],
     [
      "U3VwZXJhcl91bXN05G5kZW4uanBn"
     ],
     [
      "UHLpc2VudF9waehjZXMucG5n"
     ],
     [
      "aWTpZXMubWQ="
     ],
     [
      "YmFja3VwL2dlaPZyZW5fZ3JhYl9rb21tLnBwdHg="
     ],
     [
      "cHLpX2VuY29udHLpLnBkZg=="
     ],
     [
      "6XRhaXNfYXVtZW50YXIuZG9jeA=="
     ],
     [
      "Y3JpdOhyZXMvcGFw6WlzIHBsYW5zLnBwdHg="
     ],
     [
      "cG9wdWxh5+NvIHJ1ZXMgZGFkdXJjaC92aWVydGVsX2NoYW5jZXNfZXJt9mdsaWNodC9jb21wcm9taXNzby1laW5nZWb8aHJ0L2ZvdG9ncmFm7WFzLnBuZw=="
     ],
     [
      "cmVzZXJ2YXMtZXZhbHVhY2nzbi5kb2N4"
     ],
     [
      "YmFja3VwL2Fzc29jaWHn429fZHL0bGUuY3N2"
     ],
     [
      "MjAyNC9jb21wbOh0ZV9mcmV1bmRpbi56aXA="
     ],
     [
      "YWlk6Q=="
     ],
     [
      "6XR1ZGVzLm1wNA=="
     ],
     [
      "ZW52b2ktZG9ubullcy5tcDQ="
     ],
     [
      "bnVjbOlhaXJlIGNsYXJhbWVudGUgYWxsZXIucGRm"
     ],
     [
      "/GJlcnNldHp0Lm1wNA=="
     ],
     [
      "UHLpZuly6S1tYXJnZS5wcHR4"
     ],
     [
      "culhbGlzZXIueGxzeA=="
     ],
     [
      "c3RlY2t0LXByb2Zlc2nzbg=="
     ],
     [
      "aW5mb3JtYefjby5tZA=="
     ],
     [
      "ZXJn5G56dC9r/G5zdGxlci1wb3LpbS5wbmc="
     ],
     [
      "UXVldWUgcHLzcHJpb3MgcmVsaWdpb3NhLnR4dA=="
     ],
     [
      "ZG9jcy9BdXNzdGVsbHVuZ19kZW1vY3LhdGljby56aXA="
     ],
     [
      "Y/NkaWdvX2pvcm5hZGEubXA0"
     ],
     [
      "cG9zdGVyaW9ybWVudGUtbGlnYefjby10cmFkaWNpb25hbC9udWNs6WFpcmUuanBn"
     ],
     [
      "bmnxby1mdWVzZS92aXbtYS5wcHR4"
     ],
     [
      "dup0ZW1lbnRzX21lam9yYXIucGRm"
     ],
     [
      "cHJvdGVnZXIg82Rpby50eHQ="
     ],
     [
      "cGVuc+lfcGVuc2FtX25vdGljaWEubWQ="
     ],
     [
      "ZXZvbHXn428tbGljaHQvVHJhbnNmZXLqbmNpYS1kZWplbi5tcDQ="
     ],
     [
      "YXBsaWNh5+NvLnBuZw=="
     ],
     [
      "4W1iaXRvLm1wNA=="
     ]
    ]
   },
   {
    "id": "ru-cp866-1",
    "enc": "cp866",
    "ok": 150,
    "arcs": [
     [
      "l+OioKpfraiqqOKgLnppcA=="
     ],
     [
      "k6Sg4KAg4a6irKXh4q2uLmNzdg=="
     ],
     [
      "j+Cuo+Cl4eFf4+GvpeUv4qWrrqwgoaWroODj4agucG5n"
     ],
     [
      "p62grajv4+GvpeWuoi5wbmc="
     ],
     [
      "j+Cuoqit5qioLnppcA=="
     ],
     [
      "rOOn66qgq+yt66nh4+ml4eKi46XiLnppcA=="
     ],
     [
      "j+Cop62grS50eHQ="
     ],
     [
      "rKDg6C+u4qKl4l/lruKlqy5tcDQ="
     ],
     [
      "YmFja3VwL62g562l4iCgraOlqy5kb2N4"
     ],
     [
      "4KCtIK6qra4grKXh4q2uo64uemlw"
     ],
     [
      "ryCvoOAucHB0eA=="
     ],
     [
      "j66rruHrLnR4dA=="
     ],
     [
      "r66kpKXgpqiioOLsL43jpqSgpeLh76/gpaTh4qCiq+/uLmNzdg=="
     ],
     [
      "kavj56Dv5aygpeGl4KWkqK2lLmNzdg=="
     ],
     [
      "4a7h4q6o4l/hrqHgoK2o71+toOiorKgubWQ="
     ],
     [
      "46vj5+io4uykrqHgrqU="
     ],
     [
      "4aXg7KWnra4uY3N2"
     ],
     [
      "pK6hqOLs4e+v4KinraCrLm1wNA=="
     ],
     [
      "4Kjhql/hrK7i4KWrLnBkZg=="
     ],
     [
      "o+DjpOwgraWupqikoK2tri5wZGY="
     ],
     [
      "g67irqKo4uHvp6CipeDoqKvhpKWroO7iLmRvY3g="
     ],
     [
      "rO3gIK/grujxqyDh4qDipakuZG9jeA=="
     ],
     [
      "rqGlIOGloe8ueGxzeA=="
     ],
     [
      "4ePiqqggpKWi4+iqpS5jc3Y="
     ],
     [
      "j6jopeKkpa3s4eOk7O8uanBn"
     ],
     [
      "r66iruCu4i+kpaugpejsLnR4dA=="
     ],
     [
      "jaCnoKQubXA0"
     ],
     [
      "r+CuquPgruCgIKinpKCtqKkuY3N2"
     ],
     [
      "i+6hqOLsLnR4dA=="
     ],
     [
      "ZG9jcy+A4KXh4iCkrfGsIKOu4C5jc3Y="
     ],
     [
      "q67ooKSlqV+o4KCt"
     ],
     [
      "jOOm56itoCDg46qlLmNzdg=="
     ],
     [
      "YmFja3VwL6DioKqoIKKroKSorKjgoC5qcGc="
     ],
     [
      "qKylq6AucG5n"
     ],
     [
      "MjAyNC+uoervoqirLm1wNA=="
     ],
     [
      "MjAyNC+toOegq6Dh7K+roK2l4qAucHB0eA=="
     ],
     [
      "MjAyNC/hpeCooKtfruGuoa6jrl+vrqSg4K6qL+Gu4KWira6ioK2o7+XhruCloq2uoqCtqKkvj6XgpaOuoq7grqIv6KXh4uxfqqKg4OKo4KVfoa6joC5wbmc="
     ],
     [
      "5aDgoKripeCo4eKoqqjhq+PnoO+rqK2oqC5kb2N4"
     ],
     [
      "YmFja3VwL42loq6nrK6mra5f4aWr7OGqqOVfqq7gruKqqKUucG5n"
     ],
     [
      "guWupC54bHN4"
     ],
     [
      "YmFja3VwL6Kup6SlqeHioqjvLm1wNA=="
     ],
     [
      "kaSlq6CroF+noOKuL47iquOkoKetoKqurOvlp66rruKg7y5jc3Y="
     ],
     [
      "ka6i4KWspa2trqOuLnR4dA=="
     ],
     [
      "4usvraWvrq3v4q2uLm1k"
     ],
     [
      "pKCioOLsL46hpeGvpeeo4uyq4Ous4+CgLnhsc3g="
     ],
     [
      "YmFja3VwL+HooKyg4OKl46rgoKitoC+noK+gpKCtoKeioKuoL4/gpeHi46+rpa2oqS50eHQ="
     ],
     [
      "r+ClrOyl4KBfrKWkqOaoreGqqOUubWQ="
     ],
     [
      "oaDh4aWpraCvpaKo5qAubXA0"
     ],
     [
      "hqSgq+3ioKalL5iqrqulLm1wNA=="
     ],
     [
      "5KinqOel4aqo5S5tZA=="
     ],
     [
      "r66noq6r76XiLnppcA=="
     ],
     [
      "r66koOCqqC5wZGY="
     ],
     [
      "4+jxq6+roK2gLnR4dA=="
     ],
     [
      "YmFja3VwL4Tj5SCspeWgrainrOsgqKfj56WtqO8ubXA0"
     ],
     [
      "geCu4aji7C+spaak4yDhrqKl4OioqyCnoK3vqy5wcHR4"
     ],
     [
      "pKLjrO9fqKeuX6ikpe8uanBn"
     ],
     [
      "4aWs7O4v5OCgquaoqCCkpanh4qKo7+Ugr67h4KWk4eKirqwuemlw"
     ],
     [
      "ZG9jcy+h4KCqoC5wZGY="
     ],
     [
      "q6WjqqjlIKinrqHgoKalrailIK2goa7gLnhsc3g="
     ],
     [
      "raWpoeuioO7iLmNzdg=="
     ],
     [
      "4q6ioOCuoi+HoO+iq6WtqKUucGRm"
     ],
     [
      "4a+lquKgqqvsLnBuZw=="
     ],
     [
      "MjAyNC+noOelrC5tZA=="
     ],
     [
      "oeOsoKOoIOSoq+ysoCCsoOKl4Kigq66iLnBkZg=="
     ],
     [
      "oq6nraiqq6ii4q7grqwuY3N2"
     ],
     [
      "hKXi4aqoqSDmqKqroCCkoqijoOKlq+wucGRm"
     ],
     [
      "ga7vLnBuZw=="
     ],
     [
      "kKCn46yqoODiq6Xire/vL6is76LgoOegLmNzdg=="
     ],
     [
      "MjAyNC+Cq6jvrailrF+orOPppeHioqBf4eLg46ri4+CgL6zrX6ygqa7gLnhsc3g="
     ],
     [
      "kK6soK0grKWtpaUuZG9jeA=="
     ],
     [
      "p6SgraioLnBkZg=="
     ],
     [
      "r+CoraXh4qirqKSl4C5wbmc="
     ],
     [
      "qOHiruetqKquoqegra6iri5tZA=="
     ],
     [
      "4q7nquMvp6CspeKoq6Ag4avjpqGgLnBuZw=="
     ],
     [
      "YmFja3VwL+SoraCrpSCnoKHrqy54bHN4"
     ],
     [
      "ia7gqiDhpaugLnBuZw=="
     ],
     [
      "5qWrqF+tqKatpaOuX6Ou4q6iqOIvguvoq64uZG9jeA=="
     ],
     [
      "pKWroKugLmRvY3g="
     ],
     [
      "raDmqK6toKvsra6jruWu5+Pj4eKgra6iqKsucG5n"
     ],
     [
      "jKXh4q3r5SCvrqvj56Wtrevl"
     ],
     [
      "ZG9jcy+vruKl4O+rqF+h46Tj56hfpK7h4q6oreHioqAvr+PipakgruKtruilrailLnppcA=="
     ],
     [
      "p6CtrqKuIKSlpC5jc3Y="
     ],
     [
      "l+yopKvv"
     ],
     [
      "YmFja3VwL6Glq+up5uDjLnBkZg=="
     ],
     [
      "r6XgouPuIK7ipKWr7K3rpS5jc3Y="
     ],
     [
      "ruKtruilrajur+Cu5qWt4i5wcHR4"
     ],
     [
      "ka/hpaylqS56aXA="
     ],
     [
      "pODjo+PuL6Ck4KXh4y5qcGc="
     ],
     [
      "MjAyNC+T56Dh4qKuoqCrrqHppamv4K6iqK3mqKgvhaKjpa2o7y5wbmc="
     ],
     [
      "ZG9jcy/n8SCv4KXh4S5wbmc="
     ],
     [
      "MjAyNC+NqOWi6+WupK3rpS5kb2N4"
     ],
     [
      "ZG9jcy+i46euoi+voOCtqC5wZGY="
     ],
     [
      "oq2orKCtqO+vqOil4q2g6KAubWQ="
     ],
     [
      "iq6sqOHhqO8vo+DjpKhf5eOmpS5wbmc="
     ],
     [
      "46rgpa+rpa2o71/hrqOroOGlrS5wbmc="
     ],
     [
      "ruKtruilrajv5S5wbmc="
     ],
     [
      "4aWipeCgX6+uqqCnoOKlq6WpX+OsoC5tZA=="
     ],
     [
      "YmFja3VwL6Sl4KWi7O8ubWQ="
     ],
     [
      "hqSgq6hfp6CvoKSgLnBwdHg="
     ],
     [
      "4uM="
     ],
     [
      "p6SgraioIK2gr66sqK2gpeIg4+GrrqKoqS5jc3Y="
     ],
     [
      "7qOlIK/gruSl4eGorq2gq+ytrqk="
     ],
     [
      "ZG9jcy+vrqek4KCiq+/uX+HiqKKlrS5qcGc="
     ],
     [
      "ouvh4qCiqqBfp6Klp6Tr"
     ],
     [
      "56WrrqKlqi5wbmc="
     ],
     [
      "MjAyNC+srqis"
     ],
     [
      "oKKooOaoqKLhpS5tcDQ="
     ],
     [
      "qKespa2lraipX6+g4KCrq6Wr7K2uLm1wNA=="
     ],
     [
      "jaiqoKquo67mpa3i4K6sLnBkZg=="
     ],
     [
      "h62gqqgucHB0eA=="
     ],
     [
      "4a7up6UueGxzeA=="
     ],
     [
      "4a+u4a6hraCnraDi7C5wcHR4"
     ],
     [
      "4a7up6Uuemlw"
     ],
     [
      "4a6kpeCmqOLh7y5jc3Y="
     ],
     [
      "i6jo7OCgoa7ioOUuemlw"
     ],
     [
      "na+u5aggr+OtquKgLm1wNA=="
     ],
     [
      "p6CvoKStrqOuLnBkZg=="
     ],
     [
      "r+Cgoq7n8awuY3N2"
     ],
     [
      "juKspeeg7uIg4eKu4K6toC5wcHR4"
     ],
     [
      "qK3ipeCl4a2upV+mqKsucHB0eA=="
     ],
     [
      "o67g7Kquo64ueGxzeA=="
     ],
     [
      "r6jhoOKlq+8vrKDgqC5kb2N4"
     ],
     [
      "i6XiqO4vq6jmpaqgoaitpeIuanBn"
     ],
     [
      "5K7grKXioKqopa/gqK2orKCrLm1k"
     ],
     [
      "geuioKXiLm1k"
     ],
     [
      "qO6tpaeorKAudHh0"
     ],
     [
      "YmFja3VwL4/gqKXloKtfo6ihpavsL4qu4K/j4aBfpaSoraDvX+GloqXgoC5wcHR4"
     ],
     [
      "4a6h4KDi7K2lr66t7+Ktri5jc3Y="
     ],
     [
      "jKWmpOOtoOCupK3r5SCu4eKg4qqoIOGu4eKgoqvvpeIuanBn"
     ],
     [
      "MjAyNC+vpeCloq6koOGkpauqqC54bHN4"
     ],
     [
      "oKyl4KiqoK3hqqilX67ira7hqOKlq+ytri5tcDQ="
     ],
     [
      "jaCv4KispeCmqOLs56DhrqIucGRm"
     ],
     [
      "4KChruKuqS56aXA="
     ],
     [
      "j+Cu5KXh4aiuraCr7K2uo64gouvh6KWjri5wbmc="
     ],
     [
      "kuDjpK2u4eKoLm1wNA=="
     ],
     [
      "pKWroKWsLnppcA=="
     ],
     [
      "gqDjLnppcA=="
     ],
     [
      "juLh4+Lh4qKopSCuoe+noK2truHipakueGxzeA=="
     ],
     [
      "narhIKTg46OopS56aXA="
     ],
     [
      "rqHqparioC5kb2N4"
     ],
     [
      "r+Cu6PGrIOHi4OOq4uPgIOPi4KAubXA0"
     ],
     [
      "4+eg4eKirqKgq6irqKGuruKqoKegq6jh7C5wbmc="
     ],
     [
      "pKCmpS5wZGY="
     ],
     [
      "neKgr6Cmpa3pqK0ubXA0"
     ],
     [
      "jqHhq+OmqKKgrajvpK6h4K6l4a6ipeLhqqilLnBwdHg="
     ],
     [
      "r66srqal4i5kb2N4"
     ],
     [
      "kOutrqoudHh0"
     ],
     [
      "pOCloq2o5S5wcHR4"
     ],
     [
      "ruHioKvsrevlLnhsc3g="
     ],
     [
      "rK6jq64uemlw"
     ]
    ]
   },
   {
    "id": "zhs-utf-8-1",
    "enc": "utf-8",
    "ok": 150,
    "arcs": [
     [
      "6ZqP5ZCO6Zm35YWl5pyJ572qLm1wNA=="
     ],
     [
      "5p2/77yIMe+8iQ=="
     ],
     [
      "6LWE5rex77yIMe+8iS5wcHR4"
     ],
     [
      "5rOV5b6LIOeIrCDlvbzmraRfdjIuY3N2"
     ],
     [
      "5bi46KeE5Zue5p2lLmpwZw=="
     ],
     [
      "5pW05L2T5pS75Ye7LnppcA=="
     ],
     [
      "5bid5Zu95bCG5YabLnBkZg=="
     ],
     [
      "5pS557yWIOaXtumXtCDkvK8v5bCa5pyqLnBuZw=="
     ],
     [
      "6K666K+BL+eglOeptuaJgC/lp4sudHh0"
     ],
     [
      "ZG9jcy/noJTlj5Ff5LiN5ruhX3Yy"
     ],
     [
      "5LiA6YGT6LWe5oiQ6YeR5rKZLnBkZg=="
     ],
     [
      "5q+U6L6D"
     ],
     [
      "5p6B5bqmIOS4gOi3ryDnmb7np5EubWQ="
     ],
     [
      "5a2ZLmRvY3g="
     ],
     [
      "5L2PX+S4u+WKqO+8iDHvvIkueGxzeA=="
     ],
     [
      "MjAyNC/mlr3lt6UubWQ="
     ],
     [
      "ZG9jcy/kurrkuovovrkudHh0"
     ],
     [
      "6KiA6K+t5q+r57Gz5LiA5rWBLnBkZg=="
     ],
     [
      "56qX5Y+j5Lic5pa5LmRvY3g="
     ],
     [
      "55ScIOS4muS9me+8iDHvvIkuY3N2"
     ],
     [
      "5rig6YGTIOWFrSDmlrDnloYucGRm"
     ],
     [
      "6ZW/5bqmLmNzdg=="
     ],
     [
      "6YCC55SoLmNzdg=="
     ],
     [
      "5a+56Z2iIOaUtumbhi50eHQ="
     ],
     [
      "5LiJX+S7peWFjS5tcDQ="
     ],
     [
      "5YS/6L65LnBwdHg="
     ],
     [
      "6K6k5Li6LeWOn+aWmS54bHN4"
     ],
     [
      "5piO5aSpMjAyNC5tcDQ="
     ],
     [
      "5oCd5oOzLeS4pOWyuC/mlLbnm4rlpKnmtKXluLjliqEv5oSP5aSWLnBuZw=="
     ],
     [
      "6K6+6K6hLnBuZw=="
     ],
     [
      "5rGf"
     ],
     [
      "5Z+656ysM+eJiC56aXA="
     ],
     [
      "6L+r5a6zIOW5s+aWueWNg+exsy5wcHR4"
     ],
     [
      "5aaC5LiLLeaJgOivtC3lpoLku4oucG5n"
     ],
     [
      "5piO5pif6LaK5p2l6LaK77yIMe+8iS/msrnmoLzlvI/lvZLnrKwz54mILm1wNA=="
     ],
     [
      "6YeHLm1k"
     ],
     [
      "5pmuX3YyLnhsc3g="
     ],
     [
      "MjAyNC/muKnlkozlrp7lipsubWQ="
     ],
     [
      "5Lit5Y6f5peg6K665piv6K+t6Z+z56ysM+eJiC5wcHR4"
     ],
     [
      "5LiA5a+55LiA5aSE5bmzLm1wNA=="
     ],
     [
      "5p2l5rqQ5YGH5aaCL+S5i+S4ii5tZA=="
     ],
     [
      "MjAyNC/ml6nlt7LlpoLkvZXliafmg4UuY3N2"
     ],
     [
      "YmFja3VwL+aAp+WRvQ=="
     ],
     [
      "6aOfLnBuZw=="
     ],
     [
      "566A5Y2V"
     ],
     [
      "6YCDX+Wuoi5tZA=="
     ],
     [
      "YmFja3VwL+WjsOaYjum9kC/oiJQg6LWe5oiQL+S4h+S6ui3lsI/nu4Qv5Y+I56ewL+aUvuadvi5jc3Y="
     ],
     [
      "5oiQ5YqfLnBkZg=="
     ],
     [
      "6L6p6K66LeWfn+WQjeesrDPniYgucGRm"
     ],
     [
      "6YO95biC6K+t6Z+zLnhsc3g="
     ],
     [
      "5pGU5Yaz5b+DX3YyLnppcA=="
     ],
     [
      "5Li75LmJX+S8uOWHui5wcHR4"
     ],
     [
      "5Y+mIOS4reWNjuawkeaXjyDmnKzmnaUuanBn"
     ],
     [
      "5qOJ6IqxL+ensOS4uui1sOi/myjnu4gpLmNzdg=="
     ],
     [
      "5bm96buYLeaetuaehC3mgKoo57uIKS5tZA=="
     ],
     [
      "5bKb5LiK5a+55oqX6LW2Lm1wNA=="
     ],
     [
      "6L+QLnhsc3g="
     ],
     [
      "5YGH5aaCLnBwdHg="
     ],
     [
      "55y86YeMIOi/geenuy5wbmc="
     ],
     [
      "5LqS77yIMe+8iS5kb2N4"
     ],
     [
      "5LyK5pyX5Zue5b2SLnppcA=="
     ],
     [
      "5rWB6YCaLemrmOS4rS50eHQ="
     ],
     [
      "5pep5beyIOixoQ=="
     ],
     [
      "5Lqn5LiaX+WPmei/sF92Mi5wcHR4"
     ],
     [
      "5Y2D5LiHLmRvY3g="
     ],
     [
      "5oiY5pyv5a6B5aaC5LiLLm1k"
     ],
     [
      "5rqQLnBwdHg="
     ],
     [
      "5bm06Ze0LmRvY3g="
     ],
     [
      "5bel5Lq657q357q3LmNzdg=="
     ],
     [
      "6L6Q5bCELnhsc3g="
     ],
     [
      "55u45LqS56ysM+eJiC5wcHR4"
     ],
     [
      "5pyA5ZCOIOadpea6kC/lpKfkuroyMDI0Lm1k"
     ],
     [
      "56iNX+eItl/oh6rkuLsyMDI0LnR4dA=="
     ],
     [
      "6J6N5ZCI56ysM+eJiC5tcDQ="
     ],
     [
      "56eN56eNX+a3seWIuy56aXA="
     ],
     [
      "56ue6LWbKOe7iCkv5YW86IGMIOW/q+esrDPniYguZG9jeA=="
     ],
     [
      "6Z2p5ZG9LmRvY3g="
     ],
     [
      "5pyA5pawLnBkZg=="
     ],
     [
      "5L+h5Lu7IOingueCuS/ku6Pku7fnrKwz54mI"
     ],
     [
      "5byA5Y+RLea0uy5qcGc="
     ],
     [
      "ZG9jcy/lpKnmiY3nrKwz54mI"
     ],
     [
      "57O757ufX3Yy"
     ],
     [
      "MjAyNC/mi5jnlZlfdjIuZG9jeA=="
     ],
     [
      "5q2j5ZyoLnppcA=="
     ],
     [
      "576O5ZGzLnBkZg=="
     ],
     [
      "6KeE5a6aLnBuZw=="
     ],
     [
      "5oql5a+8L+ivgeaYji54bHN4"
     ],
     [
      "5rOV5b6LLnBuZw=="
     ],
     [
      "5bmFLnppcA=="
     ],
     [
      "56m65Lit5aSE55CG54q25Ya1LnBkZg=="
     ],
     [
      "5rW35bqVIOS6jOaImCDov4fluqZfdjIubXA0"
     ],
     [
      "6K666L+wX+exuy5wZGY="
     ],
     [
      "5qCh6ZW/Lee9keWdgC5wZGY="
     ],
     [
      "5qWaIOS+neaXp192Mg=="
     ],
     [
      "5aKD55WM5Yy6LnBkZg=="
     ],
     [
      "5ruh6LazLeS5i+mZhS/noa7nrKwz54mIL+eUseS6jiDkuIrnuqcg572q6KGMLnBkZg=="
     ],
     [
      "5pyd6bKcLmNzdg=="
     ],
     [
      "5YCNX+a1geS8oF/msZ/ms73msJEyMDI0LnppcA=="
     ],
     [
      "5YWl5aKD57utLm1k"
     ],
     [
      "6aOOLnppcA=="
     ],
     [
      "YmFja3VwL+atp+inhl/lsJ3or5UucHB0eA=="
     ],
     [
      "5a6e6aqM5a6k6IqCLnhsc3g="
     ],
     [
      "5rCR6Ze0LmpwZw=="
     ],
     [
      "6YGHLnBkZg=="
     ],
     [
      "5Y+C6KeB5YiK54mp77yIMe+8iS5tcDQ="
     ],
     [
      "6LeR5YaF5a6577yIMe+8iS56aXA="
     ],
     [
      "5bSb6LW3IOWQjOagtyDotbfpo55fdjIv57uP5YW4LnBkZg=="
     ],
     [
      "5b6X5YiwLeiAjOaYry3ng63ngrkucGRm"
     ],
     [
      "5qC55o2uLm1k"
     ],
     [
      "5b6B5pyNIOeyvuiLsS5tcDQ="
     ],
     [
      "YmFja3VwL+iOt+iDnCDnn63niYcucGRm"
     ],
     [
      "5peBLeeKueWkqi5wcHR4"
     ],
     [
      "54G+6Zq+IOaWl+S6iSDnjofpooYudHh0"
     ],
     [
      "6Zmi5qChLeWIhuaVozIwMjQuemlw"
     ],
     [
      "5ZCE5L2NL+ihl+S4ii56aXA="
     ],
     [
      "55y85LitX+iuoi5jc3Y="
     ],
     [
      "54iGLei+ueWigy3ku4Av5pu05paw5oi/6Ze0LnBwdHg="
     ],
     [
      "5pqX5p2A5ZWKX3YyL+mmluWwlC3ov4fljrsuanBn"
     ],
     [
      "5Y2D5bm0LeWHveaVsC5qcGc="
     ],
     [
      "6K+06YGT77yIMe+8iS56aXA="
     ],
     [
      "5paH6Im6IOW3ruS4jeWkmu+8iDHvvIkv5L2zLeS7o+ihqC3orq8o57uIKS5kb2N4"
     ],
     [
      "5re35ZCIIOWkluWbveS6ul92Mi5wbmc="
     ],
     [
      "5Yqe5a2mLnR4dA=="
     ],
     [
      "6L+H5YiGIOW/veinhiDms5Xor60v57qz5YWlKOe7iCkucG5n"
     ],
     [
      "5Y2VL+eUn+iAjOW3su+8iDHvvIkucG5n"
     ],
     [
      "ZG9jcy/ovrnnlYzotbDkuIoubXA0"
     ],
     [
      "55y86YeM5aWl5Zyw5YipLnBuZw=="
     ],
     [
      "5YWs5LyX6LC35rGJ5pePLmRvY3g="
     ],
     [
      "5byl6KGlLeWBt+WBty3opb/mlrnnrKwz54mILm1wNA=="
     ],
     [
      "ZG9jcy/ph4fnlKgg5biC5Yy6IOmHkemSsS/opb/ljZcv5qC55pysLnBuZw=="
     ],
     [
      "6YKj5Lqb5LiN6Laz6IiG6K66LnppcA=="
     ],
     [
      "5oub6IGY5by66LCDLnppcA=="
     ],
     [
      "5Y+L6LCKLnhsc3g="
     ],
     [
      "MjAyNC/lsI/nu4Qv5o+t6Zyy55WlLnhsc3g="
     ],
     [
      "6IGM5Lia5o6n5ZGKLnR4dA=="
     ],
     [
      "5ZCNIOmHjueUn192Mi5qcGc="
     ],
     [
      "5ZCE56eNIOS4u+a1gS5wcHR4"
     ],
     [
      "5oqV6ZmNX+WPkeaYjg=="
     ],
     [
      "5Yib5LiaLeWRvOWQgSjnu4gpLnBuZw=="
     ],
     [
      "5LuA5LmI5bCK5LilLnBkZg=="
     ],
     [
      "5q+N5Y2z5pe2LnR4dA=="
     ],
     [
      "5raI5aSxMjAyNC5qcGc="
     ],
     [
      "5pys5qyhX+S9hi5tcDQ="
     ],
     [
      "5Zyw5Z2ALei0q+ept+esrDPniYgucGRm"
     ],
     [
      "5bCP5a2p5a2Q55+t54mHL+WPkei1t+mmluWwlOW/hemhuy5tZA=="
     ],
     [
      "5aWz5pyL5Y+LIOWunui3tS5jc3Y="
     ],
     [
      "YmFja3VwL+WMv+WQjeWmguWQjC5tZA=="
     ],
     [
      "5LiT6L6R5paH56ugLm1k"
     ],
     [
      "57uG6IqCMjAyNC5qcGc="
     ],
     [
      "5pS/5Y+YLnR4dA=="
     ]
    ]
   },
   {
    "id": "zht-utf-8-1",
    "enc": "utf-8",
    "ok": 150,
    "arcs": [
     [
      "5Y+v6KaLMjAyNC/lqr0ucG5n"
     ],
     [
      "5LqL5oOF5rC05Lit5b2I5oCn56ysM+eJiC/poJjlsI4ubWQ="
     ],
     [
      "5Y+D6ICDX+WFqOeQg1/nrYnmlrzvvIgx77yJL+S9j+aIvyDkuozkuroo57WCKS5kb2N4"
     ],
     [
      "5b6u56yR5re35LqCL+eJqeizhy5kb2N4"
     ],
     [
      "57GD55CD5qmf5a+GLmpwZw=="
     ],
     [
      "YmFja3VwL+mjsumjn+mHkemMoi5wZGY="
     ],
     [
      "ZG9jcy/op5LluqYg5a2U5a2QL+izii/mqZ/lmagg5b6e5bCP77yIMe+8iS/niafluKst5oOz5oOz"
     ],
     [
      "YmFja3VwL+S4gOmBk+azoi5tZA=="
     ],
     [
      "5Y2U5a6a546H5YWI5LmL5omA5LulLnppcA=="
     ],
     [
      "5ZGz6YGTIOaIkOW5tCDpu6jlp5QuY3N2"
     ],
     [
      "5pu5IOWgseW+qS5wbmc="
     ],
     [
      "5oqVLmpwZw=="
     ],
     [
      "5YyFLmpwZw=="
     ],
     [
      "5a656YePLm1k"
     ],
     [
      "5p2vKOe1gikv5aKe5by3X+m7keiJsi56aXA="
     ],
     [
      "5pyA5L2z5YyWL+WtuOS9jS56aXA="
     ],
     [
      "5Y2h54i+X+mbqi5wbmc="
     ],
     [
      "5L6L5aSW5oyH5o+u6YSw6L+R"
     ],
     [
      "MjAyNC/nm7Toh7MucG5n"
     ],
     [
      "6auY6ZqOX+aVuOmHjy5tcDQ="
     ],
     [
      "5L+d6Zqq5YWs5bmzLmNzdg=="
     ],
     [
      "5aWz5Y+LX+WkruimljIwMjQ="
     ],
     [
      "5Y2x5a6zL+WTvC3oqJjovIkt5rOVMjAyNC5qcGc="
     ],
     [
      "6aCt6YOo6YGp5oeJKOe1gikuanBn"
     ],
     [
      "5auBLnhsc3g="
     ],
     [
      "6aas5YWL5oCdX+S8kemWki5jc3Y="
     ],
     [
      "ZG9jcy/nlbbkuK3nrKwz54mILmpwZw=="
     ],
     [
      "55u45oeJLnBuZw=="
     ],
     [
      "5bm05YmNIOWcmCDkuZ/lsLHmmK/oqqouemlw"
     ],
     [
      "6aCY5bCO56ysM+eJiC5wZGY="
     ],
     [
      "5Li75oSP6YGp55W2Lm1k"
     ],
     [
      "5omL5LiL6YKE5pyDL+mAmeWgtC54bHN4"
     ],
     [
      "56eR5oqA54mHLnBkZg=="
     ],
     [
      "5LqS5YuVIOWnlC5tcDQ="
     ],
     [
      "55W254S26Z2S5bO2LnppcA=="
     ],
     [
      "55S35Y+LIOiDveWkoC5wZGY="
     ],
     [
      "YmFja3VwL+aDs+imgS56aXA="
     ],
     [
      "54eD54eS56ysM+eJiC54bHN4"
     ],
     [
      "6YyE6Z+zLnR4dA=="
     ],
     [
      "56ix5ZG8X+WQiOeQhi5wcHR4"
     ],
     [
      "5LiK5rW3X3YyLnR4dA=="
     ],
     [
      "5LiN6KuW6YCZ5aC05ZyW54mHLm1k"
     ],
     [
      "55qH5bidIOeVtuS7oyDph53lsI0ubXA0"
     ],
     [
      "6KaL6KejLeWkp+S6ui5wZGY="
     ],
     [
      "6ICML+mhp+WVjy5jc3Y="
     ],
     [
      "5ZGKLnR4dA=="
     ],
     [
      "5LyK5LqL5a+m5LiK5Y+q6IO9"
     ],
     [
      "6IGy56ixX+S4jeaYky/kuK3oj6/msJHml4/nrKwz54mI"
     ],
     [
      "YmFja3VwL+ijneWCmS5wcHR4"
     ],
     [
      "5LqL5YWSMjAyNC50eHQ="
     ],
     [
      "6KuW6L+wL+a0vi/oppbph45f5oyW5o6YL+aOouiojiDlhazlvI8ubXA0"
     ],
     [
      "MjAyNC/kvY/lroVf5Y675LiWLmRvY3g="
     ],
     [
      "5LiA6aaWX+ingC56aXA="
     ],
     [
      "56Gs6auUX+awtC5wcHR4"
     ],
     [
      "5Y2U5ZWGIOa0u+WKmyDlj43mraMyMDI0L+acgF/ogq9f5aW95Y+LLmRvY3g="
     ],
     [
      "6LKh5pS/LnR4dA=="
     ],
     [
      "YmFja3VwL+a2ieWPii3lt6XkvZwt5pyA5pepLnBwdHg="
     ],
     [
      "5pS25YWlX+Wkp+eBqy50eHQ="
     ],
     [
      "5ryU5ZOh5oqA6IO95pel5aCxKOe1gikudHh0"
     ],
     [
      "6LipX+mFjeWlly5wZGY="
     ],
     [
      "5b6u6Luf6IiJ5YuVKOe1gikucG5n"
     ],
     [
      "5pCN5aSx"
     ],
     [
      "5aSr5amm77yIMe+8iS50eHQ="
     ],
     [
      "MjAyNC/mhJrooKIg5Lu76IG377yIMe+8iS5wcHR4"
     ],
     [
      "5b6e5LqL54++5LujLnR4dA=="
     ],
     [
      "6YyrIOaooeeziiDlhITlhYMucG5n"
     ],
     [
      "55yL6KaLIOatkOe+ji/moLzlsYAv54i9LnppcA=="
     ],
     [
      "6ZaL5aeLLea7vy3mpI3nianvvIgx77yJ"
     ],
     [
      "5oyB5pyJIOe/kuS/lyDlhaXlrbgubXA0"
     ],
     [
      "5ZCM5pmCIOmWiSDmvKIucHB0eA=="
     ],
     [
      "55Si55Sf5YWo6ZuGLm1k"
     ],
     [
      "MjAyNC/lpKXkvLRf6Zqn6YGT77yIMe+8iS50eHQ="
     ],
     [
      "56mNX+WcsOeUoijntYIpLnBwdHg="
     ],
     [
      "5oCd57atIOWSjOirp192Mi5jc3Y="
     ],
     [
      "5aSn6ZaALm1wNA=="
     ],
     [
      "YmFja3VwL+acgOWwjy5kb2N4"
     ],
     [
      "MjAyNC/niZvlpbbpg4rljYDmkJzni5DvvIgx77yJLnBuZw=="
     ],
     [
      "5bm85YWS5ZyS6IOMX3YyLnppcA=="
     ],
     [
      "5Lq66auU6YO15Lu25Ym15aeL5Lq6LnBkZg=="
     ],
     [
      "YmFja3VwL+aPkOWPii5wbmc="
     ],
     [
      "5pOB5pyJX+mZhOWxrA=="
     ],
     [
      "5Y+45rOVLmRvY3g="
     ],
     [
      "ZG9jcy/mm7TngroyMDI0Lnhsc3g="
     ],
     [
      "5rC45oGGLeijvemAoDIwMjQubXA0"
     ],
     [
      "5Y2KLeezvue0m192Mi5wbmc="
     ],
     [
      "6Lef6LmkLnR4dA=="
     ],
     [
      "YmFja3VwL+mhr+W+l+eVouernzIwMjQuemlw"
     ],
     [
      "54mI5pysLm1wNA=="
     ],
     [
      "YmFja3VwL+WFhea7v1/oga/ntaEyMDI0LnBkZg=="
     ],
     [
      "55Ge5aOrLnppcA=="
     ],
     [
      "5oiQ5pys5pyJ6Laj5L2N5pa8L+WFp+Wkli/lqZrlp7vlv6DoqqAueGxzeA=="
     ],
     [
      "54eD5paZX+aOoSjntYIpLnR4dA=="
     ],
     [
      "5b+F6KaB5q+N5rC0MjAyNC5wZGY="
     ],
     [
      "5Yid57SaLnBuZw=="
     ],
     [
      "5ZyN56ysM+eJiC5jc3Y="
     ],
     [
      "6JeNX+Wvp+azoi5kb2N4"
     ],
     [
      "MjAyNC/mgKfmoLwyMDI0L+a2iOWksSDku40uZG9jeA=="
     ],
     [
      "6LOg5YSfLmpwZw=="
     ],
     [
      "5YiX5LiA6YGNLnBkZg=="
     ],
     [
      "5oOF5rOBLnBkZg=="
     ],
     [
      "55So6YCUIOauuuaJiy5kb2N4"
     ],
     [
      "6Kix5aSaLnR4dA=="
     ],
     [
      "5byf5byfX+alremkmF/mjqjmuKwubXA0"
     ],
     [
      "6YCB5YiwLmRvY3g="
     ],
     [
      "6KqV55SfLeW4tue1pi5kb2N4"
     ],
     [
      "MjAyNC/oirHosrst5aeU6KiXLeWkp+iHoy5wZGY="
     ],
     [
      "6ICD5bm057SaLmNzdg=="
     ],
     [
      "YmFja3VwL+mbu+WgsS5wZGY="
     ],
     [
      "5o+Q5LqkL+S8kemWkl/kuLvlvLVf5oKy5YqHL+aciemMol/lhKrlhYguanBn"
     ],
     [
      "5YK35a6z5L6b57WmLmNzdg=="
     ],
     [
      "5belLeaMh+iyrC5jc3Y="
     ],
     [
      "5Y2h5ouJL+eWvueXheesrDPniYgucHB0eA=="
     ],
     [
      "5Y+v56yRIOa6q+WSjC5wcHR4"
     ],
     [
      "5YWJ5qauLeWBnOatoi3kuIDpoYYuanBn"
     ],
     [
      "6KGo5piOKOe1gikucHB0eA=="
     ],
     [
      "5aSn5ZOlX+aIkeWciy54bHN4"
     ],
     [
      "6buR5pqX5bmz5Z2HL+iCpS5wbmc="
     ],
     [
      "55Sx5q2k5ZCE55WM5q+U5Yip5pmCLnBkZg=="
     ],
     [
      "5ZOB54mM6Z2I5rS756ysM+eJiC/mr4Dmu4XmvJTlpY8ubWQ="
     ],
     [
      "5LmL5LitX+iomC/otI/lvpcg5oubLmpwZw=="
     ],
     [
      "5aW95Y+LL+aEn+iIiOi2oy5tcDQ="
     ],
     [
      "5Zub6JmV55Sf55CGLnR4dA=="
     ],
     [
      "YmFja3VwL+WJmyDotrMyMDI0L+apn+WZqC/poJjlj5YubWQ="
     ],
     [
      "57WC5q2i77yIMe+8iS/niKwv6Zui6ZaLLm1wNA=="
     ],
     [
      "YmFja3VwL+WZqOWumCjntYIpLm1k"
     ],
     [
      "5Y2z5bCHLnBkZg=="
     ],
     [
      "6Lez"
     ],
     [
      "5aKDX+WlveWkmi/ogbfkvY1f5Yi25pyNLnBkZg=="
     ],
     [
      "56Wd56aPLmRvY3g="
     ],
     [
      "562U6KGd5YuVLmpwZw=="
     ],
     [
      "5om55YeGLeW4uOW4uC3mlLnpgLIucHB0eA=="
     ],
     [
      "5b2M6KOc5p+QLnBwdHg="
     ],
     [
      "54u8Leacgy3npZ4uemlw"
     ],
     [
      "5b2i5a65LnBuZw=="
     ],
     [
      "5YGPMjAyNC5wcHR4"
     ],
     [
      "5o+Q6K2wLnppcA=="
     ],
     [
      "6LW35rqQX+WBjw=="
     ],
     [
      "5aC05ZCIX3YyL+eJueaciV/njqnlhbcuZG9jeA=="
     ],
     [
      "6KqqIOS6uuawkeazlemZoiDmtJfmvqE="
     ],
     [
      "6aGP6Imy6YCZ5omNL+eJqemrlC50eHQ="
     ],
     [
      "6YeO6KC7X+WwjeatpF/pm5bnhLbnrKwz54mILm1k"
     ],
     [
      "6Iux5paH5ZyY57WQ"
     ],
     [
      "55yB5Lu9L+aOqOW7oy54bHN4"
     ],
     [
      "5Ymd5aWqIOWigy/nkIbpmqjokZfpu5HoibIuY3N2"
     ],
     [
      "5pyJ6ZecX+WNlOacgzIwMjQudHh0"
     ],
     [
      "6Luf6auU77yIMe+8iS5jc3Y="
     ],
     [
      "5bm05Luj6YCQ5ry45b6F6YGHL+mblueEtl/mrZDmtLIuZG9jeA=="
     ],
     [
      "57WV5bCNX+mBsl/kuJYv56iu6aGeLnBuZw=="
     ],
     [
      "6Km55aeG5pavLeaomV92Mi5qcGc="
     ],
     [
      "6YGV6KaPX+Weg+WcvuesrDPniYgv6Kqq5a6MLea0my3lsJHmlbgv5b+D6Z2IX+eEoeirljIwMjQucGRm"
     ]
    ]
   },
   {
    "id": "ja-utf-8-1",
    "enc": "utf-8",
    "ok": 150,
    "arcs": [
     [
      "5Li7576p6YGL5YuV5omL5pWw5paZLnhsc3g="
     ],
     [
      "5oe45b+15Lih5omLLm1k"
     ],
     [
      "5o6l57aaLnR4dA=="
     ],
     [
      "44Gv44GY44KB44GmX+i3nemboi5wZGY="
     ],
     [
      "44Gh44KD44KT44GoIOa1t+i7jS5tcDQ="
     ],
     [
      "5aSJ44KP44KLLm1k"
     ],
     [
      "6ZaLLnhsc3g="
     ],
     [
      "44KJ44GX44GPLnR4dA=="
     ],
     [
      "5aSn5Lq65rCXLnBuZw=="
     ],
     [
      "44K744Or44O76Lui5o+bLmRvY3g="
     ],
     [
      "5YiG6ZaTLmRvY3g="
     ],
     [
      "5q6644GX44O75qyy44GX44GL44Gj44O76KSH6ZuR"
     ],
     [
      "44GL44GL44KLLm1k"
     ],
     [
      "5Y2K5bm0Lm1k"
     ],
     [
      "5oay5rOV44O744GL44KP44GE44GE44O756eY5a+GLmpwZw=="
     ],
     [
      "5Lyd44GIL+ism+a8lCDmjYnjgYguZG9jeA=="
     ],
     [
      "YmFja3VwL+S7iuW+jCDjgYvjgpMucG5n"
     ],
     [
      "6KGM44GL"
     ],
     [
      "44GE44KN44GE44KN44O75bGl5q20L+Wwj+mHji5kb2N4"
     ],
     [
      "6L+RLnR4dA=="
     ],
     [
      "6IiMX+aguS/ln4vjgoEg5oeQ44GL44GX44GELmpwZw=="
     ],
     [
      "MjAyNC/plqLkv4IuY3N2"
     ],
     [
      "5ZCM44GYX+S6rOmDvS5tcDQ="
     ],
     [
      "5YWJX+W6l+WToS5kb2N4"
     ],
     [
      "5bej"
     ],
     [
      "5L+d5pyJX+iyoOOBkeOCiy50eHQ="
     ],
     [
      "5bqm55uuX+OBiuipsV/lhazooaguY3N2"
     ],
     [
      "6Kyd572q5Luj44KP44KK44Oe44K544K/44O8LnBkZg=="
     ],
     [
      "6L+95Yqg44O25pyILmNzdg=="
     ],
     [
      "57W25pybLnR4dA=="
     ],
     [
      "5aSp5L2/LnppcA=="
     ],
     [
      "44Oh44OA44OrIOaIpuWJjSDjgYMv6KqN6Ki844O755Sf44GY44KLLmRvY3g="
     ],
     [
      "5Y+X6aiTLnBuZw=="
     ],
     [
      "44KC44GG5bCR44GXIOOCueOCv+OCuOOCqiDmo5IucHB0eA=="
     ],
     [
      "6aOy44G/LnBuZw=="
     ],
     [
      "44GE44GP44GkIOmgkeW8teOCiyDniqwubXA0"
     ],
     [
      "44KC44Gh44KN44KTLnBuZw=="
     ],
     [
      "MjAyNC/kvLTjgYYg44GM44GhLnR4dA=="
     ],
     [
      "44Gf44GRL+OCquODrF/kuJbku6Nf5o6o6YCyLmpwZw=="
     ],
     [
      "5bGx5LiL44O76Kum44KBLm1k"
     ],
     [
      "44OV44Kh44Of44Oq44O8X+ODiuOCpOODiC56aXA="
     ],
     [
      "44K144Kk44K6LmNzdg=="
     ],
     [
      "44GK44KI44GdX+ODnuODi+OCol/jgr/jg6zjg7Pjg4guZG9jeA=="
     ],
     [
      "6L6y5qWt44O76KizLmRvY3g="
     ],
     [
      "5Lim44G/X+ODkOODs+ODiV/jgZPjgZMubWQ="
     ],
     [
      "44Ko44OU44K944O844OJLmNzdg=="
     ],
     [
      "ZG9jcy/nj77ooYxf44GC44KNLmpwZw=="
     ],
     [
      "YmFja3VwL+OCv+ODr+ODvCDnrqHnkIYucGRm"
     ],
     [
      "44OR44O844OG44KjLmNzdg=="
     ],
     [
      "57O45bmFLmRvY3g="
     ],
     [
      "MjAyNC/mioAg5b65Lnhsc3g="
     ],
     [
      "44OV44Kh44Kk44OK44OrL+S4reiPry50eHQ="
     ],
     [
      "YmFja3VwL+ODiy5wbmc="
     ],
     [
      "5ouzLnR4dA=="
     ],
     [
      "5Ye654mIL+WtkC/lrZDjganjgoJf6YGg5oWuX+OBiuiFuS/mvJTlh7oucGRm"
     ],
     [
      "44Oc44O844OJ5bCR5bm05ZCr44KBL+adr+ODu+OBmeOCieODu+OBreOBhy50eHQ="
     ],
     [
      "55qH5bidIOa4my5wZGY="
     ],
     [
      "44Gq44GpX+ODluODvOOCuS/lpJzkuK0ucHB0eA=="
     ],
     [
      "5oiQ5Lq6LnBwdHg="
     ],
     [
      "ZG9jcy/ml5cucHB0eA=="
     ],
     [
      "5pSv5o+0LnBwdHg="
     ],
     [
      "5Y+W44KMLmNzdg=="
     ],
     [
      "YmFja3VwL+OBoOOBhOe3tOe/ki54bHN4"
     ],
     [
      "44K544K/44OD44OVX+mbu+WKmy5tZA=="
     ],
     [
      "MjAyNC/kvZzlrrbjg7vkvZzjgo0ucG5n"
     ],
     [
      "5q2j44GX44GEIOWKtOWDjQ=="
     ],
     [
      "55+t5pyfL+Wun+ePvi/lt64ueGxzeA=="
     ],
     [
      "5pCN5a6zLnhsc3g="
     ],
     [
      "5bqD44GM44KLLmRvY3g="
     ],
     [
      "5o6o5aWoX+ODgOODoS5jc3Y="
     ],
     [
      "6K2m5a+f5a6Y44O76IW5Lm1wNA=="
     ],
     [
      "5pS744KBLnBkZg=="
     ],
     [
      "6Ieq56ew5aCx44Op44Kk44K744Oz44K5"
     ],
     [
      "5YWs5YuZ5ZOh44O75Luy6ZaTLnBkZg=="
     ],
     [
      "6Ieq5Li7LmpwZw=="
     ],
     [
      "44Gp44KT44Gq44GrIOOBn+OBvuOBqy5wcHR4"
     ],
     [
      "55u45pKy5b6T44GjLnR4dA=="
     ],
     [
      "5ZyPX+ino+mHiC/jgZXjgb7jgZbjgb4g6YCy5YyWIOOBi+OBi+OCj+OCiS5wbmc="
     ],
     [
      "ZG9jcy/liIbjgYvjgolf44Kk44Ku44Oq44K5X+ePvuihjC/jgoLjgZfjgY/jga9f44K944OtX+ahiC5wZGY="
     ],
     [
      "6LWk44Gh44KD44KTIOisjg=="
     ],
     [
      "55So5oSPLnppcA=="
     ],
     [
      "5YyC44GE44O75o+05YqpLnR4dA=="
     ],
     [
      "MjAyNC/lrozntZAuanBn"
     ],
     [
      "5bCG6LuN44O744Ot44O844Kr44Or44O75Li2L+imi+OBn+ebriDjg6HjgqTjg4kucGRm"
     ],
     [
      "ZG9jcy/osYoueGxzeA=="
     ],
     [
      "5omN6IO9X+iQveOBoeOCiy5tZA=="
     ],
     [
      "5rGXLm1k"
     ],
     [
      "44OO44Oh44OH44Kj44KiLmpwZw=="
     ],
     [
      "55u05YmNX+ihqOOBly5jc3Y="
     ],
     [
      "44GT44Gj44GhLmpwZw=="
     ],
     [
      "44Go44GX44GmX+axuuOCgeOCiy54bHN4"
     ],
     [
      "44Gh44G+44GjX+OCouODnuOCvuODsy5wbmc="
     ],
     [
      "5Luu5oOz44O75LiN5Y+vLmpwZw=="
     ],
     [
      "5pyJ5ZCN5Lq6L+ODnuOCpOOCry56aXA="
     ],
     [
      "44GN44KTX+eUsF/jgYLjgpPjgZ8uZG9jeA=="
     ],
     [
      "5LiB5a+nLmNzdg=="
     ],
     [
      "56u25LqJ44O76Kmx44GXL+e3kV/jgbbjgaNf44GE44KP44KG44KLLmpwZw=="
     ],
     [
      "44OT44OD44OILmRvY3g="
     ],
     [
      "6KaL44Gk44GRLmRvY3g="
     ],
     [
      "44G+44GELmRvY3g="
     ],
     [
      "44GPL+OBqOOCiuOBn+OCgS5jc3Y="
     ],
     [
      "44Oh44KsLnBkZg=="
     ],
     [
      "5LqI5oSfL+apn+S9kw=="
     ],
     [
      "56uL44GhLm1wNA=="
     ],
     [
      "5LiN5oCd6K2w44O75ZGK55m9L+OBneOBk+OBpyDjg5zjg4fjgqMuanBn"
     ],
     [
      "5qyE6KaP5YmHLm1k"
     ],
     [
      "5YiH44KJLnR4dA=="
     ],
     [
      "YmFja3VwL+aJi+ihky50eHQ="
     ],
     [
      "6YeR6J6NX+OBl+OBvuOBoy/mnLrosrfjgYjjgosuanBn"
     ],
     [
      "5YG044O75bmz5Z2H44O75YaF5a65Lm1wNA=="
     ],
     [
      "6Iqx6aGY44GEL+mHjy5jc3Y="
     ],
     [
      "6Lev57eaLnBwdHg="
     ],
     [
      "5Y+w6KmeLnR4dA=="
     ],
     [
      "6ISxX+eVjC5tZA=="
     ],
     [
      "MjAyNC/njKsucG5n"
     ],
     [
      "5LuK5pyI44K444Oj44O844OK44Oq44K544OILmNzdg=="
     ],
     [
      "6YWN6YGU"
     ],
     [
      "5L2V44KI44KK5piO44GR5rGBLm1wNA=="
     ],
     [
      "ZG9jcy/nj77lrp9f6IOML+OCs+ODn+ODpeODi+ODhuOCoyDkvY7jgY8g44OY44OD44OJLnBuZw=="
     ],
     [
      "5pC65bivX+abtOOBqy56aXA="
     ],
     [
      "57WQ5ama5byPLmRvY3g="
     ],
     [
      "5ZGoLmNzdg=="
     ],
     [
      "6LWw44KKLnBwdHg="
     ],
     [
      "6Zmi5b6p5biwLnBwdHg="
     ],
     [
      "5LmX44Gj44O76KiA44GjLnR4dA=="
     ],
     [
      "6Kix44GZX+eEoeOBhC/ln7fooYwuZG9jeA=="
     ],
     [
      "6aCG55WqX+ipsOOBvuOBoy5wbmc="
     ],
     [
      "44GV44GIIOOBl+OBvuOBhi5qcGc="
     ],
     [
      "5pu/44GIIOaKteaKlyDpnIDopoE="
     ],
     [
      "6LOD6YeR44O75Y+W5b6XLm1wNA=="
     ],
     [
      "5oKy44GX44GEX+eJueWFuC/pm6jouIrjgoouemlw"
     ],
     [
      "44G+44GEL+eUn+W+kuOCsOODqeODlS/jgZfjgYvjg7vlkrIuY3N2"
     ],
     [
      "6YGg5oWu"
     ],
     [
      "5rGgX+WPl+izni/lvpPjgaMuemlw"
     ],
     [
      "ZG9jcy/jga/jgaPjgY3jgoov44Gr44GK44GR44KL44O75pCN5YK344O744Ki44KrLnBkZg=="
     ],
     [
      "44G+44Go44KCX+ODrOOCpC5tcDQ="
     ],
     [
      "6YCB5paZ5YiG44GL44KJ5aSW56eRLnR4dA=="
     ],
     [
      "44KG44Gj44GP44KKLnppcA=="
     ],
     [
      "MjAyNC/lkI3lj6TlsYsuY3N2"
     ],
     [
      "5Lqk6ZqbLnhsc3g="
     ],
     [
      "YmFja3VwL+ino+mHiOODu+WQhOWbveODu+OBhOOCjS5qcGc="
     ],
     [
      "44GC44Gf44KL44O754m55a6aLmpwZw=="
     ],
     [
      "5ZCM55ufLm1k"
     ],
     [
      "5Yqj5YyWLnR4dA=="
     ],
     [
      "44GX44KTLnppcA=="
     ],
     [
      "5Z+656SO44O75ZCI6KiI44O744OaLnBuZw=="
     ],
     [
      "5pys5Lq6L+OBquOCjOODu+aWsOOBl+OBhOODu+WFgy5wZGY="
     ],
     [
      "ZG9jcy/lvZPpgbgg5oyB44GkIOS5l+OCiuaPm+OBiC5qcGc="
     ],
     [
      "44GK55+l44KJ44GbIOa6gOi2sy56aXA="
     ],
     [
      "44Oo44O75biw44KK44O744K544OD44Kt44OqLmpwZw=="
     ]
    ]
   },
   {
    "id": "ko-utf-8-1",
    "enc": "utf-8",
    "ok": 150,
    "arcs": [
     [
      "66a9Lm1wNA=="
     ],
     [
      "YmFja3VwL+yngOuehC5wcHR4"
     ],
     [
      "64uo7LaVLnppcA=="
     ],
     [
      "7IOI67K9X+uBvC56aXA="
     ],
     [
      "7ZmV64yALmNzdg=="
     ],
     [
      "7KGxLmRvY3g="
     ],
     [
      "64OlLm1wNA=="
     ],
     [
      "67mE7Jyo7Jes7J2Y64+E"
     ],
     [
      "7IiYL+u2gOyynCDruYTsnKAv7KeA64uML+unieuMgF/tg4Dsm4xf65qc66C3LnBwdHg="
     ],
     [
      "7Iug64WQL+uPmeujjC/tg5zqtowg67O07JWILnppcA=="
     ],
     [
      "ZG9jcy/rsJTsnIQubXA0"
     ],
     [
      "6riw7KSALm1k"
     ],
     [
      "66qo66W464ukLnhsc3g="
     ],
     [
      "7J6l6rWQL+ydvOuwqS5tZA=="
     ],
     [
      "64Sk7J6EX+y2nOyehS54bHN4"
     ],
     [
      "6rCA7J2065OcX+yjvOqxsF/snqztjJAuY3N2"
     ],
     [
      "7JiI67CpLnBwdHg="
     ],
     [
      "7Ja065ScIOq+uOykgO2eiC5wZGY="
     ],
     [
      "7IS466ClX+uqqeyggV/ruYTspojri4jsiqQubWQ="
     ],
     [
      "6riw7Iig66eI67KV7IKs7IaM7IScL+q4sOyGjC/snLzshLjsmpQuemlw"
     ],
     [
      "7YOI7Ye0IOuPmeusvCDsspzsp4A="
     ],
     [
      "6rec7KCcLmpwZw=="
     ],
     [
      "7JmE7ISxLnR4dA=="
     ],
     [
      "MjAyNC/rg4nsnqXqs6Auemlw"
     ],
     [
      "7Kad6rCA7Y+J66eQLmpwZw=="
     ],
     [
      "7J6l7IudIO2YvOyduC5jc3Y="
     ],
     [
      "66qw6528L+yCsOyXhSDsp4DtlqUg7KeA7KeEL+yImOu2hCDqsIDso70v67aE7ZW0IOuGjeu2gCDtirztirwuY3N2"
     ],
     [
      "6re465+s64uI6rmMIO2Vke2BrC54bHN4"
     ],
     [
      "7JuQ7J24Lm1wNA=="
     ],
     [
      "6ry9L+ygleyxhS5wbmc="
     ],
     [
      "66mU66as64qQ64KM7Ja066C1L+uYkOuKlC5qcGc="
     ],
     [
      "6rWs7JetX+uPmeyDgS/rs7Trj4TsnpDrhKQv65Od7KCQLmNzdg=="
     ],
     [
      "67OA7ZWYIOuqsOumrA=="
     ],
     [
      "7Ju5LnBwdHg="
     ],
     [
      "7J6Q7IS47Z6I65Ok7JesL+qxsOuToOyalC5wcHR4"
     ],
     [
      "64utLnBkZg=="
     ],
     [
      "64u57J28LnBwdHg="
     ],
     [
      "64K07KeALnppcA=="
     ],
     [
      "7IiY7IigLmNzdg=="
     ],
     [
      "64KY7Jio64ukX+y1nOyasOyEoC54bHN4"
     ],
     [
      "67aI66asL+yXrOyEryDshqEv7ISc7Iig6rCV7ZWY64+Z7IucL+u3sO2LsC5qcGc="
     ],
     [
      "7ZuE67O064+E7JqwLmRvY3g="
     ],
     [
      "7J20X+ynhOuLqF/rpqzrjZQubWQ="
     ],
     [
      "66qp66GdIOyVoOuLiC5wbmc="
     ],
     [
      "7ZWY7Yq4X+2MqO2CpOyngF/tmY3rs7Qv642p7Ja066asX+yViOuztC5jc3Y="
     ],
     [
      "7Zes6riwX+uEiF/slYTslbwv7Iq566y07JuQLnppcA=="
     ],
     [
      "67KoIOy6kCDqsr3roZwueGxzeA=="
     ],
     [
      "7Jik7IKs7Lm0X+yngOyngF/qta3rrLQubXA0"
     ],
     [
      "ZG9jcy/qt4Dsl73qt4Dsi6AucHB0eA=="
     ],
     [
      "6rOg67KgIOyepeuCnC5jc3Y="
     ],
     [
      "7Yis7JesIOuPme2VtCDslbzqtazsnqUv66m07KCRX+ywqeyaqS5wbmc="
     ],
     [
      "7ISc7J6lIOuTgOyWvCDsiJjspIAv65Oc66y8LnBkZg=="
     ],
     [
      "7J24642wIOyepeq1sC56aXA="
     ],
     [
      "67mE7Jyo6rWt6rCA6r2DLmNzdg=="
     ],
     [
      "7J2Y7ZWYIOyLoOyEpCDsnYzrsJgudHh0"
     ],
     [
      "7LKY67CpLmRvY3g="
     ],
     [
      "7JeF6rOELnppcA=="
     ],
     [
      "7KeA6rK9IOq3vOqxsC/qvaQg7JmA7JW8L+yImOyekF/rqbjrp50v6rO164+Z7LK07JmE67K9LmpwZw=="
     ],
     [
      "66qo7ZeYIOq4sOqwhC5wcHR4"
     ],
     [
      "ZG9jcy/smKUudHh0"
     ],
     [
      "YmFja3VwL+qxuOuhnF/suajtlbRf67CwLmpwZw=="
     ],
     [
      "7IiY66a967aAL+uPhOyyrS54bHN4"
     ],
     [
      "67KE7IiY7LaVLmRvY3g="
     ],
     [
      "7Jik7ZS87IqkLnBwdHg="
     ],
     [
      "7ISc66WY"
     ],
     [
      "6rOE7KCV7Zqo6rO8L+u2iOuylSDsoJXquIAg7JWI7YOALmRvY3g="
     ],
     [
      "7JiI67mEIO2GteuztC5tZA=="
     ],
     [
      "66i464uIIOyIqOq4sCDsmIjsiKAubXA0"
     ],
     [
      "ZG9jcy/qt7zrjbAg66ekLnhsc3g="
     ],
     [
      "64qU6rWwIOyDgeuLqCDrk5zrprwudHh0"
     ],
     [
      "7KGw7ISg652866m0Lm1wNA=="
     ],
     [
      "6rSA7ZWc6rmo64urLnhsc3g="
     ],
     [
      "64qZLnppcA=="
     ],
     [
      "7ZGcLmRvY3g="
     ],
     [
      "7KCV7J6RIOyTtC5wcHR4"
     ],
     [
      "7KaQ6rGw7JuAX+qwgOyngC/snbTquLBf64m0X+yeheyCrC5wcHR4"
     ],
     [
      "MjAyNC/qsITtmLjsgqwv6re466O566Gc7JqwLnhsc3g="
     ],
     [
      "YmFja3VwL+q0gO2VtOyEnC/rtJDshJxf66CI7J207IqkLnBuZw=="
     ],
     [
      "7JWI67O07KCV7LGFL+uFuO2KuC50eHQ="
     ],
     [
      "6rO9IOq4tOyepS5wZGY="
     ],
     [
      "7J2465SUIOyhtOyKpCDrlLDrpbQucGRm"
     ],
     [
      "MjAyNC/smKzrprA="
     ],
     [
      "6rO16rCQL+u2ky/snqXrgpzqsJAv6rec7LmZLmRvY3g="
     ],
     [
      "7JiA7Jy866mwX+yXiOyXiC56aXA="
     ],
     [
      "6riw7IOB7LKtLnBkZg=="
     ],
     [
      "7LK07JyhIO2SjeyGjS5wZGY="
     ],
     [
      "7IK2X+y6oO2NvOyKpC5tZA=="
     ],
     [
      "7JWM66CJ7IqkLmRvY3g="
     ],
     [
      "7I2o7IScLnBkZg=="
     ],
     [
      "MjAyNC/snIzsiqjtg4DsnbTti4DrlLjquLAuZG9jeA=="
     ],
     [
      "6rK4IOydmOyhtC5tZA=="
     ],
     [
      "67aI66asX+uQnOuLpOqzoF/shJzrqbQubWQ="
     ],
     [
      "YmFja3VwL+ycoOy2nOy7uC5jc3Y="
     ],
     [
      "67O064K8X+qzoOyImC54bHN4"
     ],
     [
      "7Y6cX+yKpOy/qC/si6TsoJzroZwueGxzeA=="
     ],
     [
      "7KCV7IScIOuCoOyVhOqwgC5qcGc="
     ],
     [
      "7IaU7KeBLnR4dA=="
     ],
     [
      "7Jyg7ZWZX+ygleq3nC/snbTsmqk="
     ],
     [
      "65S0LmpwZw=="
     ],
     [
      "7J207IKsLnBwdHg="
     ],
     [
      "7KO866i464uILnhsc3g="
     ],
     [
      "7Ja07KCcX+2Wpeq4sA=="
     ],
     [
      "MjAyNC/siqxf6rO16rO1X+q5qA=="
     ],
     [
      "66eO"
     ],
     [
      "7J6F7JuQLnBwdHg="
     ],
     [
      "7KCc66qpLmRvY3g="
     ],
     [
      "7LCo65+JIOuKpeugpS50eHQ="
     ],
     [
      "6re466eM7YG8LmRvY3g="
     ],
     [
      "6riw67KV7ZWZ7JyELnBuZw=="
     ],
     [
      "64uk7ZaJ7Z6IX+2CrC/rs7XsiJhf66elLnR4dA=="
     ],
     [
      "7Jqw7Iq5LmRvY3g="
     ],
     [
      "ZG9jcy/rkKDquYwuanBn"
     ],
     [
      "6rSA7ZWg6rKgLnR4dA=="
     ],
     [
      "6rOE6riJX+yalOybkC5wZGY="
     ],
     [
      "7IKs65287KeA7Iug66Kw7KCA64WBLnBwdHg="
     ],
     [
      "ZG9jcy/sl4Tssq3qur4uemlw"
     ],
     [
      "7Jew7LacLmRvY3g="
     ],
     [
      "7Jes7IiYIOuvuOy5mC5wZGY="
     ],
     [
      "64Ko64WAX+2ZnOyaqV/snpQuemlw"
     ],
     [
      "6rO87J6l"
     ],
     [
      "ZG9jcy/ri6TripQg66ek6rCBIOyGjOuLiC5kb2N4"
     ],
     [
      "7JqU7ZWc7ZmV7KCV7Lu07ZOo7YSwLmRvY3g="
     ],
     [
      "MjAyNC/rtoDsp4Ag7KO87ISdLnhsc3g="
     ],
     [
      "6rKw7L2UX+uPhOq1rC5jc3Y="
     ],
     [
      "7YOc7Ja064KcIOy7pO2UjC5wcHR4"
     ],
     [
      "7Lak7LaUIOuhnOyatC56aXA="
     ],
     [
      "7Ja0X+ugpOqzoF/siKDsp5EucHB0eA=="
     ],
     [
      "66qo7Iq1LmpwZw=="
     ],
     [
      "6re47ZW0LmRvY3g="
     ],
     [
      "6rSA6rOE7J6QLnR4dA=="
     ],
     [
      "MjAyNC/ri6zrnpgg7IOd66qF7LK0LmNzdg=="
     ],
     [
      "65ag65OkL+uPvOyalCDrnKjqsbDsmrQg67mE7YyQLnppcA=="
     ],
     [
      "7J6W64+E67CV"
     ],
     [
      "7ZWt66qpX+ygley5mC/snLzshagg67CY7JiBLmNzdg=="
     ],
     [
      "7Ja065ScIOydjOuqqC5kb2N4"
     ],
     [
      "YmFja3VwL+uhnOuniF/sp4DtlZhf7YG0656Y7IudLm1k"
     ],
     [
      "7JeU7KeA64uI7Ja0LmpwZw=="
     ],
     [
      "7KeA7JuQ7Yaw7LKY65+8LnBuZw=="
     ],
     [
      "66eI7IS47JqUX+yXhi56aXA="
     ],
     [
      "6r2CLnBuZw=="
     ],
     [
      "64+E7LKtLnBkZg=="
     ],
     [
      "7KGw7LCo7ZmU7IOBLnBuZw=="
     ],
     [
      "65WM66y4LnBkZg=="
     ],
     [
      "66mU7Iuc7KeALnBkZg=="
     ],
     [
      "6riI67CcLm1k"
     ],
     [
      "YmFja3VwL+ywvuyVhOuCtA=="
     ],
     [
      "7YORLmRvY3g="
     ],
     [
      "7JiB7J6lLmNzdg=="
     ],
     [
      "7Jyg656YLmpwZw=="
     ],
     [
      "6riw7Jq06re464KY66eILmpwZw=="
     ]
    ]
   },
   {
    "id": "west-utf-8-1",
    "enc": "utf-8",
    "ok": 150,
    "arcs": [
     [
      "Qy1oYWPDrWEvRWNvbsOzbWljb3MucHB0eA=="
     ],
     [
      "RnVlcnphLWHDp8Ojby54bHN4"
     ],
     [
      "dXRpbGlzw6kuZG9jeA=="
     ],
     [
      "cGFyZWNpw7MvYXZpw6NvLWhhYXIubWQ="
     ],
     [
      "Y2hlcmNow6kueGxzeA=="
     ],
     [
      "SMO2cnRlLmRvY3g="
     ],
     [
      "YmVyaWNodGUtcHJlw6dvLWpldHRlLnBkZg=="
     ],
     [
      "YW51bmNpw7MgdG90ZSBraW5kaGVpdC5wcHR4"
     ],
     [
      "a3VycyBwcsOqdC5wbmc="
     ],
     [
      "YWRhbV9lbmdlbmhhcmlhX2tpbMOzbWV0cm9zLnBwdHg="
     ],
     [
      "Zm9uZMOpZSBlbnRzcHJlY2hlbmRlbiBiZWLDqi9iw6FzaWNvLm1wNA=="
     ],
     [
      "cmVudHLDqWUgY8O0dGVzLnBkZg=="
     ],
     [
      "bMOtZGVyZXMvVmVyc8O1ZXMubWQ="
     ],
     [
      "cHVibGljYXIgZGVqw7Mvw45sZXMtZmVtaW5pbm8tc2Nod2Fyei92ZWjDrWN1bG9zLm1k"
     ],
     [
      "MjAyNC9yaXZlcmFfY8OzcmRvYmEucHB0eA=="
     ],
     [
      "aG9tYnJlLWfDqWFudC5qcGc="
     ],
     [
      "aGFibGFuZG9fZnXDqS50eHQ="
     ],
     [
      "SW50cm9kdWNjacOzbiBjaWVudGlzdGFzIGVyaGllbHRlbi50eHQ="
     ],
     [
      "dXN1YXJpb3NfcmVwcsOpc2VudGFudHMucHB0eA=="
     ],
     [
      "Y2VyaW3DtG5pYS5tZA=="
     ],
     [
      "dGF0c8OkY2hsaWNoL2bDrXNpY28ueGxzeA=="
     ],
     [
      "YmFja3VwL3NpbXBsZXNfc29jacOpdMOpcw=="
     ],
     [
      "c8OpbGVjdGlvbi5tZA=="
     ],
     [
      "YWxpw6FzIGRlcmVjaGEvcHLDs3hpbW8uY3N2"
     ],
     [
      "YmFsbCBndXN0YXLDrWEgdGVyw6dhLnppcA=="
     ],
     [
      "Y29uc3RpdHVjacOzbiBob21tZXMgZXhlcmNpY2Uuemlw"
     ],
     [
      "YXBsaWNhY2nDs24ubWQ="
     ],
     [
      "d2luZG93c19jbMOhc3NpY28ucG5n"
     ],
     [
      "RXNmb3LDp29fbG9uZ3NfYXRsw6l0aWNvL21hcmlhX3BhcmHDrXNvLm1k"
     ],
     [
      "bsOpY2Vzc2FpcmVtZW50L3BsYXpvX3BhecOpX2zDqHZl"
     ],
     [
      "bcOpeGljby5kb2N4"
     ],
     [
      "T3JpZW50YWNpw7NuL3JlcHLDqXNlbnRlLWF1cHLDqHMvY29tcGxldG8tZG9ubsOpZXMucHB0eA=="
     ],
     [
      "UmVkdWNpciBiYcOxbyBub3ZhbWVudGUvQ29tcGFyYcOnw6NvLW1lZGlkYS9nYWduYW50LXBhc3PDqWUuanBn"
     ],
     [
      "c2lndWVfY2FuYWTDoS5wcHR4"
     ],
     [
      "ZG9jcy9nZWbDpGhybGljaC1ib3RhZm9nby9tw7ZnbGljaGVu"
     ],
     [
      "cmVzcG9zdGFzIGJhbmNvIGNow7RtYWdlL2ludGVybmFjaW9uYWwgY29tZcOnby9Db21lw6dhcmFtX3RlbGVmb24uY3N2"
     ],
     [
      "ZGlyZWN0LXPDrW1ib2xvL2NhYmXDp2EvbWHDsWFuYS1nZXNjaGxlY2h0LXZpb2xhY2nDs24ucGRm"
     ],
     [
      "w7xicmlnIHJvam8vc2XDsWFsYS5wbmc="
     ],
     [
      "YW3DqXJpY2FpbiB0ZWzDqWZvbm8gYXZlei5tZA=="
     ],
     [
      "aWx1c2nDs25fY2hlZ3VlaS5tcDQ="
     ],
     [
      "cmVjdXBlcmFyX2F0dWFsaXphw6fDo29fY2FydMO1ZXMueGxzeA=="
     ],
     [
      "cMOibmljby5jc3Y="
     ],
     [
      "dW1hcyBkaWZmw6lyZW5jZS5wZGY="
     ],
     [
      "YmFja3VwL3RlbnNpw7NuIHNldG9yLm1k"
     ],
     [
      "bcOpZGlvIGVzY3Jhdm9zLnBwdHg="
     ],
     [
      "MjAyNC9rbGVpbmVuX3N1cHJlbW9fbmnDsW8udHh0"
     ],
     [
      "UGFzw7NfcHLDqXBhcmU="
     ],
     [
      "Q29tZW50w6FyaW9zIHTDrW8uZG9jeA=="
     ],
     [
      "c2Now7ZuZV9ldXJvcMOpZW5zLmpwZw=="
     ],
     [
      "ZMOpZmktY29tcGV0acOnw6NvL3RlbGV2aXNpw7NuLWFrdGl2aXTDpHRlbi5kb2N4"
     ],
     [
      "aGFiaWxpZGFkLWVudGnDqHJlLnBuZw=="
     ],
     [
      "amVzw7pzLmRvY3g="
     ],
     [
      "ZG9jcy9zY2h3aWVyaWdrZWl0ZW4tZmF6w6otY2F0w6lnb3JpZS9BbcOpcmljYS5tcDQ="
     ],
     [
      "xZN1dnJlcy5tcDQ="
     ],
     [
      "ZXNjcmV2aSB2w61ydXMgbMOtbmd1YXMudHh0"
     ],
     [
      "aW5nbMOpcyBwYXNzYWdlaXJvcy9BdHRlaW50LXLDqXVzc2lyLnBuZw=="
     ],
     [
      "cG9saWNpYWwgbWF0w6lyaWFzLnBwdHg="
     ],
     [
      "c3Rlcm5lX3ZlcsO2ZmZlbnRsaWNodW5n"
     ],
     [
      "c2Vyw6EtcGxhemE="
     ],
     [
      "MjAyNC9uYWhtZW5fZsOhY2lsbWVudGUueGxzeA=="
     ],
     [
      "ZWRpZsOtY2lvX2xlaXRlci54bHN4"
     ],
     [
      "ZGVjaWRpw7MtdmVyd2FsdHVuZy1mci9Ub20tYWdvc3RvLWNpZGFkw6NvLnhsc3g="
     ],
     [
      "bm9yZHJoZWluLWRhbsOnYS1pbmNyw612ZWwubWQ="
     ],
     [
      "VW5yZWNodCByZXByb2R1w6fDo28vbWFyb2NfbWFyw61hLm1k"
     ],
     [
      "w6lsw6h2ZV9tYXV2YWlzLmRvY3g="
     ],
     [
      "YmFja3VwL21pbmlzdHJvcyBzZWNyw6l0YWlyZQ=="
     ],
     [
      "cHLDqXNlbnRlIGFsdGVybmF0aXZhcy56aXA="
     ],
     [
      "ZGlmZsOpcmVudHMucG5n"
     ],
     [
      "aW5kw7pzdHJpYXMudHh0"
     ],
     [
      "w6FndWFzLmpwZw=="
     ],
     [
      "UHLDqWNpc8OpbWVudC5qcGc="
     ],
     [
      "UGVxdWXDsWFzL2NpcmN1bGHDp8Ojby9jaW7DqW1hLnBkZg=="
     ],
     [
      "Z2VzdGnDs24gdGlyYXIuY3N2"
     ],
     [
      "cHLDqWRpby54bHN4"
     ],
     [
      "a8O2bG5lci5qcGc="
     ],
     [
      "Y29uc3RpdHVjacOzbiBvcsOnYW1lbnRvIGRlbWV1cmUvdMOtdHVsb3MtYWxjYW7Dp2FyLmRvY3g="
     ],
     [
      "Y2FyYWN0ZXLDrXN0aWNhcy5wcHR4"
     ],
     [
      "w7ZzdGVycmVpY2gudHh0"
     ],
     [
      "c2VndWlyLWFuw6FsaXNpcy5jc3Y="
     ],
     [
      "Z2Voc3QgZm9kZXIgY2Vuc8Op"
     ],
     [
      "cHLDoWN0aWNhc193YXNoaW5ndG9uLnR4dA=="
     ],
     [
      "bcOpZGljYW1lbnRzLnBuZw=="
     ],
     [
      "UsOpdm9sdXRpb24ucGRm"
     ],
     [
      "cHLDqHNfZXN0YWJlbGVjaW1lbnRvX3BvbMOtY2lhLmRvY3g="
     ],
     [
      "UHJlcGFyYWNpw7NuX2FudGVzX2p1Z2Fkb3Jlcy9BbG1vw6dvLnppcA=="
     ],
     [
      "w6l2aXRlciBhbmdlbGVzLnBwdHg="
     ],
     [
      "Y29uc2lkw6hyZV9hbmltYWxlc19kYS9FbnNlw7Fhci5tcDQ="
     ],
     [
      "w6FyYm9sZXMtZnJvbnRpw6hyZS54bHN4"
     ],
     [
      "bmFzIHByw6lzZW50ZW50IGVzdHJ1Y3R1cmEuZG9jeA=="
     ],
     [
      "UMOjbyBmb3Jtw6kuY3N2"
     ],
     [
      "c2PDqW5hcmlv"
     ],
     [
      "TcOpZGljb3MgbWFyc2VpbGxlLm1wNA=="
     ],
     [
      "VGVyZXNhLWbDvGhsZW4vaMOpcm9lcy5wcHR4"
     ],
     [
      "Y29tZXJjaWFsZXMtYW5kcsOpLXJlc3BlY3Quemlw"
     ],
     [
      "YXJiZWl0ZW4tw7xiZXJsZWd0LnBkZg=="
     ],
     [
      "ZXN0w6luLmpwZw=="
     ],
     [
      "Y8OhbmNlcl9pbmNsdWlkb3MuanBn"
     ],
     [
      "w4luZXJnaWUvZ8OqbmVybyBkZXZlcmlhLnBwdHg="
     ],
     [
      "aW5nbGF0ZXJyYV/DqHJlX3RhdXNlbmRlL2NlbnRyb3MtZ2FyYW50w61hLm1wNA=="
     ],
     [
      "MjAyNC93w7xyZGVuLm1k"
     ],
     [
      "Y29uY2VudHJhY2nDs24vam91cm7DqWVfZWZlY3RvX2luc3RpdHVpw6fDo28ubXA0"
     ],
     [
      "Y29uaGXDp29fw6RuZGVydW5nX3NwZC9kw6lwdXTDqXMucG5n"
     ],
     [
      "dm9sbHN0w6RuZGlnLm1wNA=="
     ],
     [
      "cHJvZm9uZMOpbWVudC1wb2xpY2llci5wZGY="
     ],
     [
      "Y2Fkw6ogZXLDtmZmbnVuZyBwcmVjaXNhdmEucGRm"
     ],
     [
      "SGVybsOhbmRlei56aXA="
     ],
     [
      "cGVybWlzc8Ojby9Qb3Nzw612ZWlzLm1wNA=="
     ],
     [
      "dG90YWxpdMOpLWhhaGEucHB0eA=="
     ],
     [
      "ZXJmw7xsbHRfc29sb3MvcmVwcsOpc2VudGUtZGFybXN0YWR0LnR4dA=="
     ],
     [
      "c29sY2hlciBmcsO8aGVyZW4gY2xhcmFtZW50ZS5wbmc="
     ],
     [
      "Y2FydMO1ZXMucG5n"
     ],
     [
      "cGhpbGlwcCBpbmTDqXBlbmRhbnRlLnppcA=="
     ],
     [
      "cGx1dMO0dC5wZGY="
     ],
     [
      "w4l2aWRlbmNlIGVzdGl2ZXIubXA0"
     ],
     [
      "ZMOpdmVsb3BwZXIuemlw"
     ],
     [
      "c3Vww6lyaWV1ci5wbmc="
     ],
     [
      "Y29tcMOpdGl0aW9uX3JlZ2Vsbi5wcHR4"
     ],
     [
      "Tm90w61jaWEvw4EvTWFudMOpbS1hbmRyw6kubWQ="
     ],
     [
      "cGFjw61maWNvLXBsYXF1ZS56aXA="
     ],
     [
      "cmF1bSBlc2VuY2lhbCBwYcOtc2VzLmNzdg=="
     ],
     [
      "R2Vow7ZydC1rYW5uc3QudHh0"
     ],
     [
      "RMOhIHByZXV2ZS5jc3Y="
     ],
     [
      "cmV0YXJkIGF0ZW5jacOzbiBlaW5nYW5nLnhsc3g="
     ],
     [
      "Z8OqbmVyby5wcHR4"
     ],
     [
      "dGjDqHNlIG1pbGFuL2JpdHRlIGNvbm9jw60gbcOodHJlcy54bHN4"
     ],
     [
      "dW50ZXJzdWNodW5nZW4tb3Bvc2ljacOzbi1zZXJ2aWNlcy5qcGc="
     ],
     [
      "YmFja3VwL2NvbnNjacOqbmNpYS9jaGFtcF9kw6l2ZWxvcHBlci5tZA=="
     ],
     [
      "YWNjw6lkZXJfcHJlY2lzYW1lbnRlLm1wNA=="
     ],
     [
      "bWFqb3IgYXNzb2Npw6lz"
     ],
     [
      "ZW5nYWfDqS1zY2hsZWNodGUtcHVlZG8ubXA0"
     ],
     [
      "ZG9pdCBkZXNlbnZvbHZpbWVudG8gdmVyc8Ojbw=="
     ],
     [
      "ZG9lbsOnYXMgbWFuaMOjIGVudHJhci5wcHR4"
     ],
     [
      "c2NobmVsbGVyLW3DqWRpY2FtZW50cy1zeXN0ZW1lLnBuZw=="
     ],
     [
      "YmFja3VwL0N1bXBsZWHDsW9zLWluZsOpcmlldXIuZG9jeA=="
     ],
     [
      "TcOkZGVscy5wcHR4"
     ],
     [
      "w7ZmZmVudGxpY2hlLm1k"
     ],
     [
      "aWTDqWVzIGdhbmhhLnBuZw=="
     ],
     [
      "TG9jYWxpemHDp8Ojby5wZGY="
     ],
     [
      "w7puaWNhbWVudGUucG5n"
     ],
     [
      "dGF0b3J0X3Zlc19tw6lkaWNhbWVudHMueGxzeA=="
     ],
     [
      "ZG9jcy9rw7xyemxpY2guemlw"
     ],
     [
      "bMOtZGVyX21lc3VyZS5jc3Y="
     ],
     [
      "YyB3w7ZydGVyL1R1w6kvYWxleGFuZGVyX3ZlbsOtYV9yZWxhY2lvbmFtZW50by5tZA=="
     ],
     [
      "a8O2bmlnaW4gcHJvemVudCBzw7xzcy9FbXDDqmNoZXIubWQ="
     ],
     [
      "cGFqYV9sb2dvX2bDrXNpY2Evw4lnYWxlbWVudC1wYXJ0LmpwZw=="
     ],
     [
      "Q2l0w6kvaGFibMOzIHByb2Zlc3NldXIubXA0"
     ],
     [
      "c2VtYW5hcy1tYW5pw6hyZS1hcnJpdsOpLnppcA=="
     ],
     [
      "U2Now7ZuZW4uY3N2"
     ],
     [
      "YWxjb2hvbF9rw7xtbWVybl9iYXIucGRm"
     ],
     [
      "w6p0ZXMucGRm"
     ]
    ]
   },
   {
    "id": "ru-utf-8-1",
    "enc": "utf-8",
    "ok": 150,
    "arcs": [
     [
      "0L7Qv9GD0LHQu9C40LrQvtCy0LDQvdCwX9GC0YDQtdC90LXRgNC+0LwuanBn"
     ],
     [
      "0LrQsNGA0YLQuNC90YMg0YHRg9C/0LXRgCDRiNC40YDQvtC60LjQuS/QvNC40YDQvdC+0LPQvtGF0YPQttC10L7QsdGJ0LXQs9C+LnppcA=="
     ],
     [
      "0YHRgtGA0LDQvdGLLnhsc3g="
     ],
     [
      "0J7Rh9C10YDQtdC00YwucGRm"
     ],
     [
      "YmFja3VwL9Cc0L7QvNC10L3Rgi5wbmc="
     ],
     [
      "0L/QvtGB0YLQsNCy0LrQuF/RiNC+0YMuemlw"
     ],
     [
      "0LHQsNC90LrQtS5tcDQ="
     ],
     [
      "0J/RgNC10LTRgdGC0LDQstC70Y/Rjl/Qs9GA0YPQtNGMLm1k"
     ],
     [
      "0JjRgdC/0YvRgtCw0L3QuNC5"
     ],
     [
      "0KHQvNC40LfQstC10LfQtC5kb2N4"
     ],
     [
      "ZG9jcy/QutGA0LjRgV/QvdCw0YHQutC+0LvRjNC60L4="
     ],
     [
      "0LPQvtGA0L7QtNC+0LzQvtGC0LrQsNC30LDRgtGM0YHRjy50eHQ="
     ],
     [
      "0L/RgNC+0LLQtdC70LBf0YXRg9C00L7QttC90LjQutCwL9Ch0LLQvtC10Lkv0L/RgNC10LTQu9Cw0LPQsNGO0YLQstC10YfQtdGA0LDQsdGA0LDRgtGMLmRvY3g="
     ],
     [
      "0KHRgtCw0LLQuNGC0YwubXA0"
     ],
     [
      "0L3QuNC20L3QtdC5LnBkZg=="
     ],
     [
      "0YHQvtCy0LXRgtGB0LrQuNC10YLRgNC10YLRjNC10LkuY3N2"
     ],
     [
      "0L/QvtGB0LzQvtGC0YDQtdC7L9C/0YDQsNC30LTQvdC40LrQuC5tZA=="
     ],
     [
      "0LvQtdC90LjQvdCwLnppcA=="
     ],
     [
      "YmFja3VwL9C/0YDQvtC40LfQvtGI0LvQvl/RgNC+0YHRgdC40Y9f0YjQutC+0LvQtS5wZGY="
     ],
     [
      "0L3QsNGD0YfQuNGC0YzRgdGP0LrRgNGL0LwuZG9jeA=="
     ],
     [
      "0J/QvtC70YzRiNCwL9C/0L7QtNCz0L7RgtC+0LLQutC1INGN0YLQvtGCL9Cc0LDRgNC40L3QsC5jc3Y="
     ],
     [
      "0YLQtdGA0LzQuNC9INGB0LTQtdC70LrQuC/QvNCw0YLRh9C40L7RgtC/0YDQsNCy0LjQu9C4Lm1wNA=="
     ],
     [
      "0Y3QuyDQsNCy0YLQvtC80L7QsdC40LvRjCDQstC+0YHQutGA0LXRgdC10L3RjNC1Lnhsc3g="
     ],
     [
      "ZG9jcy/QtNC10YLRgdGC0LLQtS5wbmc="
     ],
     [
      "0L/RgNGP0LzQvtC5Lnhsc3g="
     ],
     [
      "0YHQsNC0LmNzdg=="
     ],
     [
      "0L3QuNC60L7Qs9C+X9GE0LXQtNC10YDQsNC70YzQvdC+0Lkv0LjQu9C40L/QvtC70L7QstC40L3Ri9C40L3RhNC+0YDQvNCw0YbQuNGOL9C90LDRgNC+0LTQvdGL0YUubWQ="
     ],
     [
      "YmFja3VwL9Cy0LXRidGM0L7QsdGB0YLQvtGP0YLQtdC70YzRgdGC0LLQsNGF0LzQvC/QotC+0LLQsNGA0LjRiSDQv9GA0L7RgdGC0L4g0LLQuNC20YMv0LrRgNC10YHQu9C+X9C+0YHRgtCw0L3QvtCy0LjRgtGM"
     ],
     [
      "0KDQtdCz0LjQvtC90LAg0LrRgNGL0Lwg0YHQtdGC0YwuY3N2"
     ],
     [
      "MjAyNC/RgdGC0LAg0L7RgtC00LXQu9C10L3QuNC1INCy0YDQtdC00LAuY3N2"
     ],
     [
      "0L7QsdGA0LDQt9C+0LLQsNC90LjQtdC80LXQtNCw0LvQuNGH0YPQstGB0YLQstC+0LLQsNC7Lm1k"
     ],
     [
      "YmFja3VwL9C40LfQsdCw0LLQuNGC0YzRgdGPX9GA0L7QtNC40L3QtS5wbmc="
     ],
     [
      "0LzRg9C30YvQutGDINCy0YvRgdGI0LXQs9C+LmpwZw=="
     ],
     [
      "0L/QtdGA0LLRi9C80LgubWQ="
     ],
     [
      "0LfQstGD0LrQuF/QvNC90LUubXA0"
     ],
     [
      "0KDQsNC30LLQuNGC0LjQuC/QvNCw0LvQvtC5INC60L7Qu9GM0YbQvg=="
     ],
     [
      "0L/RgNC10LTQu9C+0LbQuNGC0YwubWQ="
     ],
     [
      "0L/RgNC40Y/RgtC90L4ueGxzeA=="
     ],
     [
      "0LzQsNGA0LrQsA=="
     ],
     [
      "0LbQuNCy0L7QudGH0YPQtNC+L9C90LXQutC+0YLQvtGA0YvQtSDRh9Cw0YHRgtGM0Y4ueGxzeA=="
     ],
     [
      "0J3Rg9C20L3Ri1/RgdC+0YDQtdCy0L3QvtCy0LDQvdC40Y/RhS54bHN4"
     ],
     [
      "0YHQtdC90YLRj9Cx0YDQtdC90LjQug=="
     ],
     [
      "0Y3RhNGE0LXQutGCL9Ck0L7RgtC+0LPRgNCw0YTQuNC4X9GB0LjQvNCy0L7Qu1/RgNC+0YHRgdC40Lgv0J3QsNC/0YDQsNCy0LvQtdC90LjQtS5tZA=="
     ],
     [
      "0YDQvtGB0YHQuNC50YHQutC40Lwg0LPQvtGA0LDRhSDQutGA0LDQtS5tcDQ="
     ],
     [
      "YmFja3VwL9C+0LrQsNC30LDQu9C+0YHRjCDQstC70LjRj9C90LjQtdC8L9C90LXRg9C20LXQu9C4LmNzdg=="
     ],
     [
      "0LjQvNC10LXRgtGB0Y/Qv9GA0LjQs9C70LDRgdC40LsueGxzeA=="
     ],
     [
      "0YPQttC10L/RgNC40LvQvtC20LXQvdC40LUucHB0eA=="
     ],
     [
      "0YTQvtC90LRf0YPRidC10YDQsV/QuNC90YLQtdGA0LLRjNGOLmpwZw=="
     ],
     [
      "0YHQu9C10LTRg9GO0YnQuNC1INC/0L7RgdC80L7RgtGA0LXRgtGMLnBuZw=="
     ],
     [
      "0LbQtdC90YnQuNC90L7QuS5wcHR4"
     ],
     [
      "0LLQvtC30LTRg9GF0LAg0LLQuNC90YMueGxzeA=="
     ],
     [
      "0JLRi9C30LLQsNC70L5f0YDQvtGB0YHQuNC50YHQutC40LkuY3N2"
     ],
     [
      "0YPRgdC70L7QstC40LkucHB0eA=="
     ],
     [
      "0LPQvtGA0LDQt9C00L4g0LHRgNCw0YLRjNGPLnBwdHg="
     ],
     [
      "0JrQsNC00YDRi1/QtNC10LrQsNCx0YDQtS5wZGY="
     ],
     [
      "0L/RgNC+0LjQt9C+0YjQtdC7"
     ],
     [
      "0L/QvtC30LjRhtC40Y/RgdC+0LTQtdGA0LbQsNC90LjRj9C/0YDQuNC80LXRgi5tcDQ="
     ],
     [
      "0LTQsNC90L3Ri9C80L/QvtGC0LXRgNGP0YLRjNC00LLQvtC40YUucGRm"
     ],
     [
      "0K/QudGG0LDQv9C+0LLQtdGB0YLQuC/QlNC+0L3QtdGG0LrQvtC5LmNzdg=="
     ],
     [
      "0YDQsNC30L7QsdGA0LDRgtGM0YHRjy50eHQ="
     ],
     [
      "0LfQsNC60L7QvdC+0LIucGRm"
     ],
     [
      "YmFja3VwL9GA0LDQt9Cy0LjRgtC40LXQvC5tZA=="
     ],
     [
      "0LzQvtGR0LzQuNC90LjRgdGC0LXRgNGB0YLQstCw"
     ],
     [
      "YmFja3VwL9GA0LXQutC70LDQvNGLINC/0LXRgNC10LPQvtCy0L7RgNC+0LIg0LfQsNC/0YDQtdGCLmNzdg=="
     ],
     [
      "0KDQvtGB0YIg0YHQtdC80YzQtSDQutGA0YPRgtC+LnppcA=="
     ],
     [
      "0LjQs9GA0LDQtdGC0LjRgdC60LvRjtGH0LjRgtC10LvRjNC90L7QvdCw0YHRgtGA0L7QtdC90LjRjy50eHQ="
     ],
     [
      "0LjRgdC60LvRjtGH0LjRgtC10LvRjNC90L4uY3N2"
     ],
     [
      "0YHQsNC80LAuanBn"
     ],
     [
      "0L7QsdGA0LDRidC10L3QuNC1X9C20LXQvdGJ0LjQvdCwL9Cz0YDQsNGE0LfQvdCw0LrRgdC+0YbQuNCw0LvRjNC90L7Qs9C+Lm1k"
     ],
     [
      "YmFja3VwL9C00LXQu9Cw0Lsg0L/RgNC+0LTQvtC70LbQsNGO0YIv0LHQuNC70LXRgl/RgdCy0L7QtdCz0L4ucHB0eA=="
     ],
     [
      "0LbQuNCy0YPRgiDRgdC80L7QttC10LwubXA0"
     ],
     [
      "0L/RgtC40YYv0L/QvtC00YDQvtCx0L3QtdC1INGF0L7RgtC10LvQsC50eHQ="
     ],
     [
      "0JLQvtCy0YDQtdC80Y/RgNC10LPQuNC+0L3QtS/QotGA0LXQsdGD0LXRgtGB0Y/QutC+0LvQuNGH0LXRgdGC0LLQsNCy0L7QudC90YMudHh0"
     ],
     [
      "ZG9jcy/QvdC+0YDQstC10LPQuNC4INCy0L7Qv9GA0L7RgdC+0LIg0YDQtdCx0LXQvdC60L7QvA=="
     ],
     [
      "0L3QsNGH0LDQu9C+INC/0L7QtNCw0YDQvtC6L9C/0L7RgdC60L7Qu9GM0LrRgy5wZGY="
     ],
     [
      "0LbQtdC90LDRgtC30LDQvNC10YLQuNC70Lgv0KHQvtCz0LvQsNGB0LXQvS5kb2N4"
     ],
     [
      "0YPQstC10YDQtdC90L3QvtGB0YLRjF/RgNC+0YHRgdC40LnRgdC60LjQuV/Qv9C+0LzQvdC40YjRjC5wcHR4"
     ],
     [
      "ZG9jcy/QuNC80LXQtdC80LvRjtCx0LjQvNGL0Lk="
     ],
     [
      "0LzQvtGJ0L3QvtGB0YLQuCDQv9GA0LjQtdGF0LDQu9C4Lm1k"
     ],
     [
      "0L7QsdGJ0LDRj1/RgdC+0LHRgdGC0LLQtdC90L3QvtC1LmpwZw=="
     ],
     [
      "0YLQtdC90Lhf0LDRgNGB0LXQvdCw0Ltf0LzRj9GB0L4v0LLRh9C10YDQsF/Qv9GD0LHQu9C40LrQsNGG0LjQuC50eHQ="
     ],
     [
      "MjAyNC/QodC40YLRg9Cw0YbQuNC4L9C00L7Qu9C70LDRgNCwINGB0LXQstC10YDQvdC+0Lk="
     ],
     [
      "0YPRhdC+0LTQuNGCX9GC0LLQvtGA0YfQtdGB0YLQstCwL9GA0LXQsdC10L3QvtC60L/RgNC40LzQtdGCLm1wNA=="
     ],
     [
      "0KPRh9C10L3QuNC60L7QstCy0L7Qt9C80L7QttC90YvRhS/QsdGA0L7RgdC40YLRjC/QstGA0L7QtNC10LrQvtGC0L7RgNGL0LUv0YHQtdGA0LTRhtC1LmRvY3g="
     ],
     [
      "0YHRgtGD0LTQtdC90YLQvtCyL9Ch0LXRgNCz0LXRjyDQutGA0LjRgSDQstC+0LfQvNC+0LbQvdGL0LwuZG9jeA=="
     ],
     [
      "0YHQv9GA0L7RgdC40YLRjCDQstGL0LHRgNCw0LsudHh0"
     ],
     [
      "0YHRgtGA0L7QuV/Qv9GA0L7QsdC70LXQvNGD"
     ],
     [
      "0J/QsNC00LXQvdC40Y9f0LTQsNCy0LDQudGC0LUucHB0eA=="
     ],
     [
      "0YHQstC+0Lk="
     ],
     [
      "0YfQu9C10L3Qt9Cw0L/QsNC00L3QvtCz0L4uZG9jeA=="
     ],
     [
      "0LzQuNGF0LDQuNC7X9C/0L7QstGB0Y7QtNGDL9Ch0Lwg0L3QsNC/0LjRgdCw0LsubWQ="
     ],
     [
      "ZG9jcy/RgtGA0LXQsdGD0Y7RgiDQstC70LDRgdGC0Lgv0JzRg9C30YvQutC4LnppcA=="
     ],
     [
      "0YPRh9C10LHQvdC+0LPQvl/QvtGB0L3QvtCy0Ys="
     ],
     [
      "0JDQtNGA0LXRgdGD0LjQvdGE0L7RgNC80LDRhtC40Y8ucG5n"
     ],
     [
      "0Y3QvdC10YDQs9C40Y/RgtC10YXQvdC40YfQtdGB0LrQvtCz0L7RgdC/0L7RgNGC0YHQvNC10L3QvtCyLnBwdHg="
     ],
     [
      "0JvQtdGC0L3Rj9GP0LzRg9C30LXRjy5wZGY="
     ],
     [
      "0J/QvtGI0ZHQu9GD0YfQuNGC0YzRgdGP0L3QuNC60L7Qs9C00LAudHh0"
     ],
     [
      "YmFja3VwL9GA0LXQutC70LDQvNGLX9C90LDRgNC+0LTQvdCw0Y9f0L/RgNC+0LTQsNC20LUucGRm"
     ],
     [
      "0YHQv9C40L3QvtC50L7QsdGB0YPQttC00LXQvdC40LUuanBn"
     ],
     [
      "0L/Ri9GC0LDQtdGC0YHRjy5wcHR4"
     ],
     [
      "0YLQstC10YDRgdC60L7QuSDRg9GB0LvRi9GI0LDRgtGMLnBwdHg="
     ],
     [
      "0KPRh9C40YLRjNGB0Y/Qv9GA0LjRh9C40L3Rgy5jc3Y="
     ],
     [
      "0YPQvNGB0L7Qt9C00LDQu9C40LPQvtGC0L7Qsi/QnNC90LXQvdC40Y8v0L/QvtC00LTQtdGA0LbQuNCy0LDQtdGCLmRvY3g="
     ],
     [
      "0L/QvtGP0LLQuNGC0YHRjw=="
     ],
     [
      "0YDQvtC00LjRgtC10LvQuF/QutGD0YDRgV/Qu9C10LLQvtC5L9GB0LrQsNC30LDQu9C40LfRgNCw0LjQu9GPLmNzdg=="
     ],
     [
      "0YPQstC10YDQtdC90Ysg0YHQvtCx0YHRgtCy0LXQvdC90L7RgdGC0YwucGRm"
     ],
     [
      "0L/RgNC10LTQv9C+0LvQsNCz0LDQtdGC0YHRj1/RgdGH0LDRgdGC0LvQuNCyX9C10LLRgNC10LXQsi/QtNC10L3QtdCzINC00YPQvNCw0LsucGRm"
     ],
     [
      "0L7QsdC70LDRgdGC0LXQuS/RgNC10YjQsNGC0YzRgdC10YDQttCw0L3RgtC+0YLQvdC+0YjQtdC90LjRjy5tZA=="
     ],
     [
      "YmFja3VwL9C90LXQsdC+0L/RgNC10LTRgdGC0LDQstC40YLQtdC70YwudHh0"
     ],
     [
      "ZG9jcy/Qv9C+0L7QsdC10YnQsNC7INGB0YLQsNGA0YIg0L/RgNC+0YbQtdC90YIubXA0"
     ],
     [
      "0JTQvtCy0LXRgNC40LXQstC10LvQuNC60LjQuS5qcGc="
     ],
     [
      "0L/QvtC30LLQvtC70LjRgtGMX9Cx0LvQsNCz0L7QtNCw0YDRjy50eHQ="
     ],
     [
      "0J/RgNC+0YLQvtC60L7Qu9GN0LrQvtC90L7QvNC40YfQtdGB0LrQvtCz0L4ucHB0eA=="
     ],
     [
      "0YLRgNCw0YLQuNGC0YzRh9C10LvQvtCy0LXQutC10LvQuNGH0L3QvtGB0YLRjC5tZA=="
     ],
     [
      "0LvQuNC00LXRgNC+0LIg0L7RgtC80LXQvdC40YLRjC56aXA="
     ],
     [
      "0JjQtNC10LDQu9GM0L3Qvi5tcDQ="
     ],
     [
      "0LbQtdC70LDQvdC40LVf0LzQtdC00LDQu9GMX9C80L7QtdC80YMueGxzeA=="
     ],
     [
      "0LzQuNGA0LBf0L3QsNC00LXQttC00LAucGRm"
     ],
     [
      "0JvQtdGC0YDRg9C60Lg="
     ],
     [
      "YmFja3VwL9CY0YHRgtC+0YDQuNC40LPQvtGB0YPQtNCw0YDRgdGC0LLQtdC90L3QvtC8Lnhsc3g="
     ],
     [
      "0YDQtdC6X9C/0LXRgNGB0L/QtdC60YLQuNCy0Ysuemlw"
     ],
     [
      "0LjQvdGB0YLQuNGC0YPRgl/RgdGC0YDQsNC90YsubWQ="
     ],
     [
      "0KLQvtC90LgubWQ="
     ],
     [
      "0YHQuNC70YPRgdCw0LzQuNGFLnhsc3g="
     ],
     [
      "0JjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y8ubWQ="
     ],
     [
      "0L7QsdGA0LDQsdC+0YLQutC4L9C+0LoubWQ="
     ],
     [
      "0LrQsNGH0LXRgdGC0LLQtV/RgdC+0LrRgNCw0YnQtdC90LjQtS5qcGc="
     ],
     [
      "0YHRg9C00L7QvCDQv9GA0LjQvdGG0LjQvy/Qo9GB0YLRgNC+0LjQu9C4LnppcA=="
     ],
     [
      "0LrRgNC+0LLRjNGOLnR4dA=="
     ],
     [
      "0LXRgdGC0Yxf0L7Rh9C10LLQuNC00L3Qvi/Qt9Cy0L7QvdC+0Lpf0L/QvtGP0LLQu9GP0LXRgtGB0Y8ucG5n"
     ],
     [
      "0J7QutCw0LfRi9Cy0LDQtdGC0YHRj1/RhNC40L3QsNC90YHQvtCy0YvRhV/QsdC+0Y7RgdGML9Cc0L7RgdC60L7QstGB0LrQsNGPX9C90LDRhdC+0LTRj9GC0YHRjy5tZA=="
     ],
     [
      "0KXQvtC00LjRgtGML9C60LLQsNGA0YLQuNGA0LAg0LDRjdGA0L7Qv9C+0YDRgtGDINGB0LXRgNGM0ZHQt9C90L4ucG5n"
     ],
     [
      "0L/QvtC30LjRhtC40Y8ubXA0"
     ],
     [
      "0LHRgNCw0YLRjNGPLnBwdHg="
     ],
     [
      "0L/QvtC50YLQuC5tZA=="
     ],
     [
      "MjAyNC/QodGC0YDQsNGF0LAg0L/RgNC40YfQuNC90Ysv0LzQsNC70YvRiA=="
     ],
     [
      "YmFja3VwL9C/0L7QvdGP0YLQuNC1X9Cy0L7QtdC90L3QvtC5LmRvY3g="
     ],
     [
      "0LLQvtC30LzQvtC20L3QvtGB0YLQtdC5LmRvY3g="
     ],
     [
      "0L3QsNGB0YfQtdGCX9GB0LrQsNC20LjRgtC1L9C20LXQvdGJ0LjQvdGDL9C/0L7QvyDQvtGC0YHRg9GC0YHRgtCy0LjQtS/QodC+0LPQu9Cw0YHQuNGP0LLQvNC10YHRgtC+L9Ci0LXQu9C10LLQuNC00LXQvdC40LUg0L7RgdC90L7QstC+0Lkg0L7Qv9GD0LHQu9C40LrQvtCy0LDQuw=="
     ],
     [
      "0L/QsNC80Y/RgtC90LjQutC+0LJf0L7QsdGA0LDQsdC+0YLQutC4LnBwdHg="
     ],
     [
      "0L3QsNGF0L7QtNC40LvRgdGPL9Cc0L7RidC90L7RgdGC0Ywg0YbQtdC70YvQuS/RgdGC0LDQstC40YLRjC56aXA="
     ],
     [
      "0KDRg9C60L7QstC+0LTQuNGC0LXQu9C10Llf0LrRgNC+0LLQsNGC0LgueGxzeA=="
     ],
     [
      "0LPRgNGD0LTQuCDQsNGFLnBuZw=="
     ],
     [
      "0L7RgdGC0LDQu9C+0YHRjC/QstC10LvQuNC60LDRj1/RgtC+0LvRjNC60L4ucG5n"
     ],
     [
      "0LzQsNGC0LXQvNCw0YLQuNC60Lhf0LPQtdGA0L7QuC/QvtCx0YvRh9C90L7QtNC10YHRj9GC0LrQvtCy"
     ],
     [
      "0L/QtdGA0LXQstC+0LTQsC/RgdGD0YnQtdGB0YLQstC10L3QvdC+INCz0LvQsNC30LAg0YHQuNGFLnppcA=="
     ],
     [
      "0LjQt9C00LDQvdC40LVf0L3QtdC00LDQu9C10LrQvl/Qv9C+0LrQsNC30YvQstCw0YLRjC/RgNC10LPRg9C70Y/RgNC90L4g0LfQsNGP0LLQu9C10L3QuNC1LnBkZg=="
     ],
     [
      "0L/QvtC/0LDQu9C40LTQvtGF0L7QtNCwLm1k"
     ],
     [
      "0J/QvtC00LPQvtGC0L7QstC60YNf0L3QtdGB0LrQvtC70YzQutC40YUv0KHQtNC10LvQsNGOLnBkZg=="
     ],
     [
      "0J/RgNC40YfQtdC8"
     ]
    ]
   }
  ]
 }
};

/* ───────── 独立读取器（不调页面引擎） ───────── */
const CT = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; return c >>> 0 })
function zcDecrypt (buf, pw, check) {
  let k0 = 0x12345678, k1 = 0x23456789, k2 = 0x34567890
  const up = (b) => { k0 = (CT[(k0 ^ b) & 0xff] ^ (k0 >>> 8)) >>> 0; k1 = (Math.imul((k1 + (k0 & 0xff)) >>> 0, 134775813) + 1) >>> 0; k2 = (CT[(k2 ^ (k1 >>> 24)) & 0xff] ^ (k2 >>> 8)) >>> 0 }
  for (const b of Buffer.from(pw, 'utf8')) up(b)
  const out = Buffer.alloc(buf.length)
  for (let i = 0; i < buf.length; i++) { const t = (k2 | 2) & 0xffff; const p = buf[i] ^ ((Math.imul(t, t ^ 1) >>> 8) & 0xff); out[i] = p; up(p) }
  if (out[11] !== check) throw new Error('ZipCrypto 口令校验字节不符')
  return out.subarray(12)
}
function extrasOf (raw) { const m = new Map(); let q = 0; while (q + 4 <= raw.length) { const id = raw.readUInt16LE(q), l = raw.readUInt16LE(q + 2); m.set(id, raw.subarray(q + 4, q + 4 + l)); q += 4 + l } return m }
function parseZip (b) {
  const e = b.lastIndexOf(Buffer.from([0x50, 0x4b, 5, 6]))
  if (e < 0) throw new Error('没有 EOCD')
  let n = b.readUInt16LE(e + 10), cdOff = b.readUInt32LE(e + 16)
  let z64 = false
  if (e >= 20 && b.readUInt32LE(e - 20) === 0x07064b50) {
    const z = Number(b.readBigUInt64LE(e - 20 + 8)); if (b.readUInt32LE(z) !== 0x06064b50) throw new Error('ZIP64 EOCD 签名不对')
    n = Number(b.readBigUInt64LE(z + 32)); cdOff = Number(b.readBigUInt64LE(z + 48)); z64 = true
  }
  const out = []; let p = cdOff
  for (let i = 0; i < n; i++) {
    if (b.readUInt32LE(p) !== 0x02014b50) throw new Error('中央目录第 ' + i + ' 项签名不对')
    const flags = b.readUInt16LE(p + 8), method = b.readUInt16LE(p + 10), time = b.readUInt16LE(p + 12), crc = b.readUInt32LE(p + 16)
    let csize = b.readUInt32LE(p + 20), usize = b.readUInt32LE(p + 24), lho = b.readUInt32LE(p + 42)
    const nl = b.readUInt16LE(p + 28), xl = b.readUInt16LE(p + 30), cl = b.readUInt16LE(p + 32), extAttr = b.readUInt32LE(p + 38), vMade = b.readUInt16LE(p + 4)
    const name = b.subarray(p + 46, p + 46 + nl), ex = extrasOf(b.subarray(p + 46 + nl, p + 46 + nl + xl))
    if (ex.has(1)) { const z = ex.get(1); let o = 0; if (usize === 0xffffffff) { usize = Number(z.readBigUInt64LE(o)); o += 8 } if (csize === 0xffffffff) { csize = Number(z.readBigUInt64LE(o)); o += 8 } if (lho === 0xffffffff) { lho = Number(z.readBigUInt64LE(o)); o += 8 } }
    if (b.readUInt32LE(lho) !== 0x04034b50) throw new Error('本地头签名不对')
    const lflags = b.readUInt16LE(lho + 6), lnl = b.readUInt16LE(lho + 26), lxl = b.readUInt16LE(lho + 28), dataOff = lho + 30 + lnl + lxl
    out.push({ name, flags, lflags, method, time, crc, csize, usize, ex, vMade, extAttr, lex: extrasOf(b.subarray(lho + 30 + lnl, dataOff)), localName: b.subarray(lho + 30, lho + 30 + lnl), data: b.subarray(dataOff, dataOff + csize), dataOff, dd: (lflags & 8) ? b.subarray(dataOff + csize, dataOff + csize + 16) : null })
    p += 46 + nl + xl + cl
  }
  return { entries: out, z64, first4: b.readUInt32LE(0) }
}
function plainOf (e, pw) {
  let d = e.data, method = e.method
  if (e.flags & 1) {
    if (method === 99) {
      const ae = e.ex.get(0x9901), st = ae[4], kl = [0, 16, 24, 32][st], sl = [0, 8, 12, 16][st]
      const dk = crypto.pbkdf2Sync(Buffer.from(pw, 'utf8'), d.subarray(0, sl), 1000, 2 * kl + 2, 'sha1')
      if (!dk.subarray(2 * kl).equals(d.subarray(sl, sl + 2))) throw new Error('AES 口令校验值不符')
      const body = d.subarray(sl + 2, d.length - 10)
      if (!crypto.createHmac('sha1', dk.subarray(kl, 2 * kl)).update(body).digest().subarray(0, 10).equals(d.subarray(d.length - 10))) throw new Error('AES HMAC 不符')
      const c = crypto.createCipheriv(`aes-${kl * 8}-ecb`, dk.subarray(0, kl), null); c.setAutoPadding(false)
      const nb = Math.ceil(body.length / 16), ctr = Buffer.alloc(nb * 16)
      for (let i = 0; i < nb; i++) ctr.writeBigUInt64LE(BigInt(i + 1), i * 16)
      const ks = c.update(ctr); d = Buffer.alloc(body.length); for (let i = 0; i < body.length; i++) d[i] = body[i] ^ ks[i]
      method = ae.readUInt16LE(5)
    } else d = zcDecrypt(d, pw, (e.lflags & 8) ? (e.time >>> 8) & 0xff : e.crc >>> 24)
  }
  const out = method === 0 ? Buffer.from(d) : zlib.inflateRawSync(d)
  const aeNoCrc = e.method === 99 && e.ex.get(0x9901).readUInt16LE(0) === 2
  if (!aeNoCrc && zlib.crc32(out) !== e.crc) throw new Error('CRC 不符：' + e.name.toString())
  if (out.length !== e.usize) throw new Error('大小不符')
  return out
}
function parseTar (b) {
  const out = []; let p = 0, pax = null, gnu = null
  const str = (o, n) => { let e = o; while (e < o + n && b[e]) e++; return b.subarray(o, e).toString('utf8') }
  const oct = (o, n) => parseInt(str(o, n).trim() || '0', 8)
  while (p + 512 <= b.length) {
    if (b.subarray(p, p + 512).every((x) => x === 0)) break
    let sum = 0; for (let i = 0; i < 512; i++) sum += (i >= 148 && i < 156) ? 32 : b[p + i]
    if (sum !== oct(p + 148, 8)) throw new Error('tar 校验和不对 @' + p)
    const type = String.fromCharCode(b[p + 156]), size = oct(p + 124, 12), body = b.subarray(p + 512, p + 512 + size)
    const next = p + 512 + Math.ceil(size / 512) * 512
    if (type === 'x') { pax = {}; let q = 0; while (q < body.length) { const sp = body.indexOf(0x20, q), len = parseInt(body.subarray(q, sp).toString(), 10); const rec = body.subarray(sp + 1, q + len - 1).toString('utf8'); const eq = rec.indexOf('='); pax[rec.slice(0, eq)] = rec.slice(eq + 1); q += len } p = next; continue }
    if (type === 'L') { gnu = str(p + 512, size); p = next; continue }
    const prefix = b.subarray(p + 257, p + 263).toString('latin1') === 'ustar\0' ? str(p + 345, 155) : ''
    const name = pax && pax.path ? pax.path : gnu || (prefix ? prefix + '/' : '') + str(p, 100)
    out.push({ name, type, size, mode: oct(p + 100, 8), mtime: oct(p + 136, 12), data: body })
    pax = null; gnu = null; p = next
  }
  return out
}
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex')
function external (buf, label, pw) {
  const out = []
  if (!process.env.AS_7ZZ && !process.env.AS_UNZIP) return out
  const f = path.join(os.tmpdir(), 'as-test-' + process.pid + '-' + label.replace(/[^\w.-]/g, '_'))
  fs.writeFileSync(f, buf)
  if (process.env.AS_7ZZ) {
    const r = spawnSync(process.env.AS_7ZZ, ['t', f].concat(pw ? ['-p' + pw] : []), { encoding: 'utf8', timeout: 60000 })
    out.push({ tool: '7zz', ok: r.status === 0 && /Everything is Ok/.test(r.stdout), msg: (r.stdout + r.stderr).split('\n').filter((l) => /ERROR|Error|Ok/.test(l)).slice(0, 3).join(' / ') })
  }
  // Info-ZIP unzip 6.0 不支持 WinZip AES（方法 99），AES 包只交 7-Zip
  if (process.env.AS_UNZIP && f.endsWith('.zip') && !parseZip(buf).entries.some((e) => e.method === 99)) {
    const r = spawnSync(process.env.AS_UNZIP, ['-t'].concat(pw ? ['-P', pw] : []).concat([f]), { encoding: 'utf8', timeout: 60000 })
    out.push({ tool: 'unzip', ok: r.status === 0 && /No errors detected/.test(r.stdout), msg: r.stdout.split('\n').slice(-2).join(' ') })
  }
  fs.unlinkSync(f)
  return out
}

export default async ({ page, toolURL, screenshot, assert }) => {
  const F = ORACLE.fixtures
  const covered = new Set()
  const B = (n) => Buffer.from(F[n].b64, 'base64')
  let externalRuns = 0
  const ext = (buf, label, pw) => { for (const r of external(buf, label, pw)) { externalRuns++; assert(r.ok, `${r.tool} 校验下载件 ${label} 失败：${r.msg}`) } }
  const dl = async (trigger) => { const [d] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), trigger()]); return { buf: fs.readFileSync(await d.path()), name: d.suggestedFilename() } }
  const seq = () => page.evaluate(() => window.ASApp.state.seq || 0)
  async function openBuf (name, buf) {
    const s0 = await seq()
    await page.setInputFiles('#as-file', { name, mimeType: 'application/octet-stream', buffer: buf })
    await page.waitForFunction(([s0, name]) => window.ASApp.state.seq === s0 + 1 && window.ASApp.state.arc.src.name === name, [s0, name], { timeout: 20000 })
  }
  const openFx = (n) => openBuf(n, B(n))
  const snap = () => page.evaluate(() => {
    const a = window.ASApp.state.arc
    return { enc: a.encoding, best: a.detect.best, kind: a.kind, zip64: a.zip64, prefix: a.prefix,
      entries: a.entries.map((e) => ({ name: e.name, path: e.path, dir: e.isDir, usize: e.usize, csize: e.csize, crc: e.crc, method: e.realMethod, crypto: e.crypto, src: e.nameSrc, type: e.type, link: e.link, mtime: e.mtime })) }
  })
  const shaIn = (i, pw) => page.evaluate(async ([i, pw]) => {
    const a = window.ASApp.state.arc, e = a.entries[i]
    try {
      const d = a.kind === 'zip' ? await window.AS.zip.read(a, e, { password: pw }) : await window.AS.tar.read(a, e)
      const h = new Uint8Array(await crypto.subtle.digest('SHA-256', d))
      return { sha: Array.from(h).map((b) => b.toString(16).padStart(2, '0')).join('') }
    } catch (err) { return { err: err.code || 'ERR', msg: err.message } }
  }, [i, pw])
  const setEnc = async (id) => { await page.selectOption('#as-enc-select', id); await page.waitForFunction((id) => window.ASApp.state.arc.encoding === id, id) }
  const sub = async (t) => { await page.click('#as-st-' + t); await page.waitForFunction((t) => !document.getElementById('as-sub-' + t).hidden, t) }
  const tab = async (t) => { await page.click('#as-tab-' + t); await page.waitForFunction((t) => !document.getElementById('as-pane-' + t).hidden, t) }
  const rowOf = async (name) => page.evaluate((n) => window.ASApp.state.arc.entries.findIndex((e) => e.name === n), name)
  const findings = () => page.evaluate(() => window.ASApp.state.findings.map((f) => ({ id: f.id, level: f.level, items: f.items.map((i) => window.ASApp.state.arc.entries[i].name) })))
  const fnd = async (id) => (await findings()).find((f) => f.id === id)

  await page.goto(toolURL)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.waitForFunction(() => window.ASApp && window.AS)

  /* 0. 页面骨架 */
  assert((await page.textContent('a[href="../../"]')).includes('返回工具集'), '顶部要有返回工具集链接')
  assert(await page.isVisible('.as-promo') && await page.isVisible('.as-stripe'), '黑条与落日条都在')
  const stripeH = await page.$eval('.as-stripe', (n) => n.getBoundingClientRect().height)
  assert(stripeH >= 20, '落日条高度 ' + stripeH)
  assert(await page.$eval('.as-hero h1', (n) => getComputedStyle(n).fontFamily.includes('Editorial') || getComputedStyle(n).fontFamily.includes('Songti')), '主标题用衬线显示体')
  const priBg = await page.$eval('#as-open-btn', (n) => getComputedStyle(n).borderRadius)
  assert(priBg === '8px', '按钮圆角 8px（Mistral 不用胶囊按钮），实得 ' + priBg)

  /* 1. 每个真实夹具：列表与内容逐项对拍 */
  let contentChecks = 0, listChecks = 0
  for (const [name, t] of Object.entries(F)) {
    await openFx(name)
    let s = await snap()
    assert(s.kind === t.kind, `${name} 类型 ${s.kind} ≠ ${t.kind}`)
    if (t.enc) {
      assert(s.best === t.enc || (t.enc === 'cp437' && s.best === 'cp850'), `${name} 自动识别为 ${s.best}，真值 ${t.enc}`)
      if (s.enc !== t.enc) { await setEnc(t.enc); s = await snap() }
    }
    assert(s.entries.length === t.entries.length, `${name} 条目数 ${s.entries.length} ≠ ${t.entries.length}`)
    for (let i = 0; i < t.entries.length; i++) {
      const e = s.entries[i], x = t.entries[i]
      const nm = t.kind === 'zip' ? e.name : e.name + (e.dir && !e.name.endsWith('/') ? '/' : '')
      assert(nm === x.name, `${name}[${i}] 文件名 ${JSON.stringify(nm)} ≠ ${JSON.stringify(x.name)}`)
      assert(e.dir === x.dir && e.usize === x.usize, `${name}[${i}] 目录/大小不符：${e.dir}/${e.usize} vs ${x.dir}/${x.usize}`)
      if (t.kind === 'zip') {
        assert(e.csize === x.csize && e.crc === x.crc && e.method === x.method && e.crypto === x.crypto, `${name}[${i}] 压缩字段不符：${JSON.stringify([e.csize, e.crc, e.method, e.crypto])} vs ${JSON.stringify([x.csize, x.crc, x.method, x.crypto])}`)
        assert(e.src === x.src, `${name}[${i}] 文件名来源 ${e.src} ≠ ${x.src}`)
      } else {
        assert(e.type === x.type, `${name}[${i}] 类型 ${e.type} ≠ ${x.type}`)
        if (x.link) assert(e.link === x.link, `${name}[${i}] 链接 ${e.link} ≠ ${x.link}`)
        if (t.kind !== 'gz') assert(Math.floor(e.mtime) === x.mtime, `${name}[${i}] mtime ${e.mtime} ≠ ${x.mtime}`)
      }
      listChecks++
      if (x.sha || x.err) {
        const r = await shaIn(i, t.pw)
        if (x.err) assert(r.err === 'CRC' || r.err === 'CORRUPT', `${name}[${i}] 应读出 CRC 错误，实得 ${JSON.stringify(r)}`)
        else assert(r.sha === x.sha, `${name}[${i}] ${x.name} 内容 sha256 不符：${JSON.stringify(r).slice(0, 120)}`)
        contentChecks++
      }
    }
    if (name === 'zip64.zip') { assert(s.zip64, 'zip64.zip 应识别为 ZIP64'); assert((await page.textContent('#as-badges')).includes('ZIP64'), '徽标显示 ZIP64'); covered.add('zip64') }
    if (name === 'sfx.exe') { assert(s.prefix === 4096, '自解压前置数据 4096，实得 ' + s.prefix); assert((await page.textContent('#as-badges')).includes('前置数据'), '徽标显示前置数据'); covered.add('sfx') }
    if (name === 'deflate64.zip') { assert(s.entries[0].method === 9, 'Deflate64 方法号 9'); covered.add('deflate64') }
    if (name === 'upath.zip') covered.add('upath')
    if (name === 'pax.tar.gz') covered.add('tgz')
    if (name === 'gnu.tar') covered.add('tar')
    if (name === 'notes.txt.gz') covered.add('gz')
    if (name === 'zipcrypto.zip') covered.add('zipcrypto')
    if (name === 'aes256.zip' || name === 'aes128.zip') covered.add('aes')
  }
  covered.add('zip'); covered.add('enc-detect')
  assert(listChecks >= 70, '列表对拍条目数 ' + listChecks)
  assert(contentChecks >= 55, '内容对拍文件数 ' + contentChecks)

  /* 2. 中文 Windows 包：编码候选、手动改编码并记住、预览、体检、修好重打包 */
  await openFx('win-gbk.zip')
  assert((await page.textContent('#as-enc-now')).includes('GBK'), '编码条显示 GBK')
  assert(await page.$eval('#as-pwbar', (n) => getComputedStyle(n).display) === 'none', '没加密的包：密码条的计算样式是 display:none')
  const chips = await page.$$eval('#as-enc-chips .as-chip', (ns) => ns.map((n) => n.getAttribute('data-enc')))
  assert(chips[0] === 'gbk' && chips.includes('big5') && chips.length >= 4, '候选编码条：' + chips.join(','))
  await page.click('#as-enc-chips .as-chip[data-enc="big5"]')
  await page.waitForFunction(() => window.ASApp.state.arc.encoding === 'big5')
  const garbled = (await snap()).entries[1].name
  assert(garbled !== F['win-gbk.zip'].entries[1].name && (await page.getAttribute('.as-chip[data-enc="big5"]', 'aria-pressed')) === 'true', '换成 Big5 后文件名变乱码且候选高亮：' + garbled)
  await openFx('win-gbk.zip')
  assert((await snap()).enc === 'big5' && await page.evaluate(() => window.ASApp.state.encManual), '重新打开同一个包沿用上次手动选的编码')
  await page.click('#as-enc-auto')
  await page.waitForFunction(() => window.ASApp.state.arc.encoding === 'gbk')
  assert((await snap()).entries[1].name === F['win-gbk.zip'].entries[1].name, '恢复自动识别后回到 GBK')
  // 预览：GBK 文本内容自动识别 + PNG 预览
  const txtIdx = await rowOf('年度报告/2024年度总结.txt')
  await page.click(`#as-tbody tr[data-i="${txtIdx}"]`)
  await page.waitForFunction((i) => document.querySelector(`#as-tbody tr[data-i="${i}"]`).getAttribute('aria-selected') === 'true', txtIdx)
  await page.click('#as-preview-btn')
  await page.waitForSelector('#as-preview-text')
  assert((await page.textContent('#as-preview-text')).includes('全年营业收入同比增长') && (await page.textContent('#as-preview-head')).includes('GBK'), '文本预览按 GBK 解出内容')
  const pngIdx = await rowOf('年度报告/图片/封面设计稿.png')
  await page.click(`#as-tbody tr[data-i="${pngIdx}"]`)
  await page.click('#as-preview-btn')
  await page.waitForFunction(() => { const i = document.getElementById('as-preview-img'); return i && i.complete && i.naturalWidth > 0 })
  assert(await page.$eval('#as-preview-img', (i) => i.naturalWidth) === 6, 'PNG 预览宽 6 像素')
  // 键盘：方向键在行间移动、回车选中
  await page.focus(`#as-tbody tr[data-i="${pngIdx}"]`)
  await page.keyboard.press('ArrowUp')
  const upI = await page.evaluate(() => +document.activeElement.getAttribute('data-i'))
  await page.keyboard.press('Enter')
  await page.waitForFunction((i) => window.ASApp.state.sel === i, upI)
  assert(upI !== pngIdx, '方向键移动了焦点')
  // 体检
  await sub('health')
  const fGbk = await findings()
  assert(fGbk.some((f) => f.id === 'names-legacy') && fGbk.some((f) => f.id === 'junk-win'), '体检：GBK 文件名 + Windows 附带文件：' + fGbk.map((f) => f.id))
  assert((await fnd('junk-win')).items.sort().join('|') === ['年度报告/Thumbs.db', '年度报告/desktop.ini'].sort().join('|'), 'Windows 附带文件列得对')
  await page.click('.as-find[data-id="names-legacy"] [data-fix]')
  await page.waitForFunction(() => !document.getElementById('as-sub-repack').hidden)
  assert(await page.inputValue('#as-rp-enc') === 'utf-8', '「去修复」切到重新打包并选好 UTF-8')
  const gbkOut = await dl(() => page.click('#as-rp-go'))
  const src = parseZip(B('win-gbk.zip')), out = parseZip(gbkOut.buf)
  const keptT = F['win-gbk.zip'].entries.filter((x) => !/Thumbs\.db|desktop\.ini/.test(x.name))
  assert(out.entries.length === keptT.length, `修好的包 ${out.entries.length} 项，应 ${keptT.length}`)
  out.entries.forEach((e, i) => {
    assert(e.name.toString('utf8') === keptT[i].name, '输出文件名 ' + e.name.toString('utf8'))
    assert(AsciiOr(e.name) || (e.flags & 0x800), '非 ASCII 文件名带 UTF-8 标记：' + e.name.toString('utf8'))
    const s0 = src.entries.find((x) => x.crc === e.crc && x.usize === e.usize && x.csize === e.csize)
    assert(s0 && s0.data.equals(e.data), '压缩数据原样复制（字节相同）：' + e.name.toString('utf8'))
    if (!keptT[i].dir) assert(sha(plainOf(e)) === keptT[i].sha, '内容一致：' + keptT[i].name)
  })
  ext(gbkOut.buf, 'gbk-fixed.zip')
  assert((await page.textContent('#as-rp-stats [data-k="copied"] b')) === String(keptT.filter((x) => !x.dir).length), '结果卡显示原样复制的个数')
  assert(await page.evaluate(() => window.ASApp.state.lastOut.report.zeroCopy) === keptT.filter((x) => !x.dir).length, '未加密条目走零拷贝（直接切原文件，不进内存）')
  covered.add('junk')

  /* 3. Mac 包：UTF-8 无标记 → 写成 GBK + Unicode 路径扩展；一键修好 */
  await openFx('mac-ditto.zip')
  const fm = await findings()
  assert(fm.some((f) => f.id === 'names-utf8-noflag') && fm.some((f) => f.id === 'junk-mac'), 'Mac 包体检：' + fm.map((f) => f.id))
  assert((await fnd('junk-mac')).items.length === F['mac-ditto.zip'].entries.filter((x) => /__MACOSX|\.DS_Store/.test(x.name)).length, '__MACOSX 与 .DS_Store 全部列出')
  await sub('repack')
  await page.selectOption('#as-rp-enc', 'gbk')
  assert(!(await page.isDisabled('#as-rp-upath')), '选 GBK 时可勾 Unicode 路径扩展')
  const macGbk = await dl(() => page.click('#as-rp-go'))
  const mg = parseZip(macGbk.buf), keptM = F['mac-ditto.zip'].entries.filter((x) => !/__MACOSX|\.DS_Store/.test(x.name))
  assert(mg.entries.length === keptM.length, 'Mac 包去掉附带文件后 ' + mg.entries.length)
  const gbkDec = new TextDecoder('gbk')
  mg.entries.forEach((e, i) => {
    assert(!(e.flags & 0x800) && gbkDec.decode(e.name) === keptM[i].name, 'GBK 文件名：' + gbkDec.decode(e.name))
    if (!AsciiOr(e.name)) {
      const u = e.ex.get(0x7075)
      assert(u && u[0] === 1 && u.readUInt32LE(1) === zlib.crc32(e.name) && u.subarray(5).toString('utf8') === keptM[i].name, '0x7075 扩展：CRC 对得上原始名、内容是 UTF-8 名')
    }
  })
  ext(macGbk.buf, 'mac-gbk.zip')
  // 用本页重新打开它：应自动认出 GBK（有扩展字段 ⇒ 名字来源是 upath）
  await page.click('#as-rp-reopen')
  await page.waitForFunction(() => /已修复/.test(window.ASApp.state.arc.src.name))
  const re = await snap()
  assert(re.entries.filter((e) => !/^[\x20-\x7e]*$/.test(e.name)).every((e) => e.src === 'upath'), '重新打开后中文名都来自 0x7075 扩展')
  await openFx('mac-ditto.zip')
  const quick = await dl(() => page.click('#as-quickfix'))
  const q = parseZip(quick.buf)
  assert(q.entries.length === keptM.length && q.entries.every((e, i) => e.name.toString('utf8') === keptM[i].name && (AsciiOr(e.name) || (e.flags & 0x800))), '一键修好：去垃圾 + UTF-8 标记')
  ext(quick.buf, 'mac-quick.zip')

  /* 4. AES：要密码、错密码、对密码、预览；去密码 / 换 AES 新密码 / 保持原密码 */
  await openFx('aes256.zip')
  assert(await page.isVisible('#as-pwbar') && (await page.textContent('#as-pw-label')).includes('AES-256'), '密码条提示 AES-256')
  const hetong = await rowOf('secret/合同.txt')
  await page.click(`#as-tbody tr[data-i="${hetong}"]`)
  await page.click('#as-preview-btn')
  await page.waitForSelector('#as-preview-err')
  assert((await page.textContent('#as-preview-err')).includes('密码'), '没输密码时预览提示要密码')
  await page.fill('#as-pw', 'wrong-pass')
  await page.click('#as-pw-go')
  await page.waitForFunction(() => /密码不对/.test(document.getElementById('as-pw-msg').textContent))
  await page.fill('#as-pw', F['aes256.zip'].pw)
  await page.click('#as-pw-go')
  await page.waitForFunction(() => /密码正确/.test(document.getElementById('as-pw-msg').textContent))
  await page.click('#as-preview-btn')
  await page.waitForSelector('#as-preview-text')
  assert((await page.textContent('#as-preview-text')).includes('甲方与乙方'), 'AES 解密后预览出合同正文')
  const aesFiles = F['aes256.zip'].entries.filter((x) => !x.dir)
  const checkPlain = (buf, pw, label, wantCrypto) => {
    const z = parseZip(buf), fl = z.entries.filter((e) => !e.name.toString('utf8').endsWith('/'))
    assert(fl.length === aesFiles.length, label + ' 文件数')
    fl.forEach((e) => {
      const x = aesFiles.find((y) => y.name === e.name.toString('utf8'))
      assert(x, label + ' 多出文件 ' + e.name.toString('utf8'))
      assert(wantCrypto === 'none' ? !(e.flags & 1) : wantCrypto === 'aes' ? e.method === 99 : (e.flags & 1) && e.method !== 99, label + ' 加密方式不对：' + e.name.toString('utf8'))
      assert(sha(plainOf(e, pw)) === x.sha, label + ' 独立解密后内容一致：' + x.name)
    })
    return z
  }
  await sub('repack')
  await page.selectOption('#as-rp-pwmode', 'none')
  checkPlain((await dl(() => page.click('#as-rp-go'))).buf, null, '去掉密码', 'none')
  await page.selectOption('#as-rp-pwmode', 'aes')
  await page.fill('#as-rp-pw', 'n3w-密码'); await page.fill('#as-rp-pw2', 'n3w-密码')
  const aesNew = (await dl(() => page.click('#as-rp-go'))).buf
  const za = checkPlain(aesNew, 'n3w-密码', '换 AES-256 新密码', 'aes')
  assert(za.entries.filter((e) => e.method === 99).every((e) => e.ex.get(0x9901)[4] === 3 && e.ex.get(0x9901).readUInt16LE(0) === 2 && e.crc === 0), '新密码是 AES-256（强度 3）、AE-2（CRC 字段按规范写 0）')
  ext(aesNew, 'aes-new.zip', 'n3w-密码')
  await page.selectOption('#as-rp-pwmode', 'keep')
  const keepA = (await dl(() => page.click('#as-rp-go'))).buf
  checkPlain(keepA, F['aes256.zip'].pw, '保持原密码', 'aes')
  ext(keepA, 'aes-keep.zip', F['aes256.zip'].pw)

  /* 5. ZipCrypto（Info-ZIP，带数据描述符，口令校验字节取 DOS 时间）：保持原密码、换 ZipCrypto 新密码 */
  await openFx('zipcrypto.zip')
  await page.fill('#as-pw', '1234'); await page.click('#as-pw-go')
  await page.waitForFunction(() => /密码正确/.test(document.getElementById('as-pw-msg').textContent))
  const zcT = F['zipcrypto.zip'].entries
  await sub('repack')
  const keepZ = parseZip((await dl(() => page.click('#as-rp-go'))).buf)
  assert(keepZ.entries.every((e) => (e.flags & 1) && (e.flags & 8) && e.dd && e.dd.readUInt32LE(0) === 0x08074b50 && e.dd.readUInt32LE(4) === e.crc), '保持原 ZipCrypto：标志位 3 与数据描述符都保留')
  keepZ.entries.forEach((e, i) => assert(sha(plainOf(e, '1234')) === zcT[i].sha, '保持原密码后独立解密一致：' + zcT[i].name))
  await page.selectOption('#as-rp-pwmode', 'zipcrypto')
  await page.fill('#as-rp-pw', 'abc'); await page.fill('#as-rp-pw2', 'abc')
  const zcNewBuf = (await dl(() => page.click('#as-rp-go'))).buf, zcNew = parseZip(zcNewBuf)
  zcNew.entries.forEach((e, i) => assert(!(e.flags & 8) && sha(plainOf(e, 'abc')) === zcT[i].sha, '换 ZipCrypto 新密码后独立解密一致：' + zcT[i].name))
  ext(zcNewBuf, 'zc-new.zip', 'abc')
  await page.fill('#as-rp-pw2', 'abd')
  await page.click('#as-rp-go')
  await page.waitForFunction(() => /不一样/.test(document.getElementById('as-rp-msg').textContent))

  /* 6. 自解压包：重新打包后去掉前置数据 */
  await openFx('sfx.exe')
  const sfxF = await findings()
  assert(sfxF.some((f) => f.id === 'prefix'), '体检提示前置数据')
  await sub('repack')
  const sfxOut = parseZip((await dl(() => page.click('#as-rp-go'))).buf)
  assert(sfxOut.first4 === 0x04034b50 && sfxOut.entries.length === 2, '输出从 PK\\3\\4 开始')

  /* 7. 损坏的包：完整性测试 —— 与 7-Zip 的结论一致 */
  await openFx('corrupt.zip')
  await sub('health')
  await page.click('#as-test')
  await page.waitForFunction(() => /通过/.test(document.getElementById('as-test-msg').textContent))
  assert((await page.textContent('#as-test-msg')).includes('损坏 1'), '完整性测试报 1 个损坏：' + await page.textContent('#as-test-msg'))
  const crcF = await fnd('crc')
  assert(crcF && crcF.level === 'danger' && crcF.items.join() === F['corrupt.zip'].sevenzip_errors.join(), '损坏文件与 7-Zip 的结论一致：' + JSON.stringify(crcF && crcF.items))
  covered.add('test')

  /* 8. 有风险的包：体检 + 解压到（模拟的）文件夹 */
  await openFx('evil.zip')
  await page.waitForFunction(() => window.ASApp.state.scanSeq === window.ASApp.state.seq)
  const fe = await findings(), ids = fe.map((f) => f.id)
  for (const id of ['zip-slip', 'abs-path', 'backslash', 'win-invalid', 'case-dup', 'dup', 'symlink', 'bomb']) assert(ids.includes(id), '体检应有 ' + id + '：' + ids.join(','))
  assert((await fnd('zip-slip')).items.join() === '../../evil.sh', 'Zip Slip 指向 evil.sh')
  assert((await fnd('win-invalid')).items.sort().join('|') === ['CON.txt', 'what?.txt'].sort().join('|'), 'Windows 非法名：CON 与问号')
  assert((await fnd('case-dup')).items.join() === 'README.md' && (await fnd('dup')).items.join() === 'dup.txt', '大小写冲突与重名')
  assert((await fnd('bomb')).items.join() === 'zeros.bin', '解压炸弹指向 zeros.bin')
  assert(fe[0].level === 'danger', '危险项排最前')
  assert(await page.$eval('#as-health-count', (n) => n.className.includes('as-count-r')), '体检计数变红')
  await page.evaluate(() => {
    const files = {}; window.__fs = files
    const bad = (n) => !n || n === '.' || n === '..' || /[\/\\]/.test(n)
    const dir = (p) => ({ kind: 'directory', async getDirectoryHandle (n) { if (bad(n)) throw new TypeError('非法名字 ' + n); return dir(p ? p + '/' + n : n) },
      async getFileHandle (n) { if (bad(n)) throw new TypeError('非法名字 ' + n); const q = p ? p + '/' + n : n; return { kind: 'file', async createWritable () { const ch = []; return { async write (d) { ch.push(new Uint8Array(d)) }, async close () { files[q] = ch.reduce((a, c) => a + c.length, 0) } } } } } })
    window.showDirectoryPicker = async () => dir('')
  })
  await sub('extract')
  await page.click('#as-ex-go')
  await page.waitForSelector('#as-ex-summary')
  const written = await page.evaluate(() => window.__fs)
  const wantW = ['etc/abs.txt', 'dir/sub/win.txt', 'CON_.txt', 'what？.txt', 'Readme.md', 'README.md', 'dup.txt', 'link-to-etc.symlink.txt', 'zeros.bin']
  assert(wantW.every((k) => k in written) && !Object.keys(written).some((k) => k.includes('evil')), '解压结果：' + Object.keys(written).join(','))
  assert(written['zeros.bin'] === 60 * 1024 * 1024 && written['dir/sub/win.txt'] === F['evil.zip'].entries[2].usize, '写入的字节数对')
  assert((await page.textContent('#as-ex-detail')).includes('拦下 2 个危险路径'), '报告拦下的危险路径：' + await page.textContent('#as-ex-detail'))
  covered.add('extract'); covered.add('sanitize')
  // 清洗后重新打包：路径干净、重名改名
  await sub('repack')
  const evilOut = parseZip((await dl(() => page.click('#as-rp-go'))).buf)
  const evilNames = evilOut.entries.map((e) => e.name.toString('utf8'))
  assert(evilNames.join('|') === ['evil.sh', 'etc/abs.txt', 'dir/sub/win.txt', 'CON_.txt', 'what？.txt', 'Readme.md', 'README (2).md', 'dup.txt', 'dup (2).txt', 'link-to-etc', 'zeros.bin'].join('|'), '清洗 + 去重后的名字：' + evilNames.join('|'))

  /* 9. 格式互转：TAR.GZ → ZIP，ZIP → TAR.GZ */
  await openFx('pax.tar.gz')
  await sub('repack')
  const t2z = parseZip((await dl(() => page.click('#as-rp-go'))).buf)
  const paxFiles = F['pax.tar.gz'].entries.filter((x) => x.type === 'file')
  paxFiles.forEach((x) => { const e = t2z.entries.find((y) => y.name.toString('utf8') === x.name); assert(e && (e.flags & 0x800) && sha(plainOf(e)) === x.sha, 'tar.gz → zip：' + x.name) })
  assert(!t2z.entries.some((e) => e.name.toString('utf8').includes('说明链接')), '符号链接不写进 ZIP')
  await openFx('win-gbk.zip')
  await sub('repack')
  await page.selectOption('#as-rp-fmt', 'tgz')
  assert((await page.inputValue('#as-rp-name')).endsWith('.tar.gz'), '换格式后文件名跟着变成 .tar.gz')
  const z2t = await dl(() => page.click('#as-rp-go'))
  const tarEnts = parseTar(zlib.gunzipSync(z2t.buf))
  keptT.forEach((x) => {
    const e = tarEnts.find((y) => y.name === x.name)
    assert(e && (x.dir ? e.type === '5' : sha(e.data) === x.sha), 'zip → tar.gz：' + x.name)
    const [Y, Mo, D, H, Mi, S] = x.dt
    assert(e.mtime === new Date(Y, Mo - 1, D, H, Mi, S).getTime() / 1000, 'zip → tar.gz 保留修改时间：' + x.name + ' ' + e.mtime)
  })
  ext(z2t.buf, 'z2t.tar.gz')
  covered.add('convert')

  /* 10. 新建：文件 + 中文名，AES-256；TAR.GZ */
  await tab('new')
  const n1 = Buffer.from('季度总结：一切顺利。\n'.repeat(40)), n2 = crypto.randomBytes(1500)
  await page.setInputFiles('#as-nw-input', [{ name: '季度总结.txt', mimeType: 'text/plain', buffer: n1 }, { name: 'photo.jpg', mimeType: 'image/jpeg', buffer: n2 }, { name: '.DS_Store', mimeType: 'application/octet-stream', buffer: Buffer.alloc(10) }])
  await page.waitForFunction(() => window.ASApp.state.newItems.length === 2)
  assert(!(await page.isDisabled('#as-nw-go')), '有文件后可以生成')
  await page.selectOption('#as-nw-crypt', 'aes')
  await page.fill('#as-nw-pw', 'pässwörd'); await page.fill('#as-nw-pw2', 'pässwörd')
  const made = await dl(() => page.click('#as-nw-go'))
  assert(made.name === '压缩包.zip', '默认文件名 ' + made.name)
  const mz = parseZip(made.buf)
  assert(mz.entries.length === 2, '新建 2 个文件（.DS_Store 被跳过）')
  const mt = mz.entries.find((e) => e.name.toString('utf8') === '季度总结.txt'), mp = mz.entries.find((e) => e.name.toString('utf8') === 'photo.jpg')
  assert(mt && (mt.flags & 0x800) && mt.method === 99 && mt.ex.get(0x9901).readUInt16LE(5) === 8 && plainOf(mt, 'pässwörd').equals(n1), '文本文件 Deflate + AES-256')
  assert(mp && mp.ex.get(0x9901).readUInt16LE(5) === 0 && plainOf(mp, 'pässwörd').equals(n2), 'jpg 智能跳过压缩（存储）')
  ext(made.buf, 'new-aes.zip', 'pässwörd')
  await page.selectOption('#as-nw-fmt', 'tgz')
  assert(await page.isDisabled('#as-nw-crypt') && (await page.inputValue('#as-nw-name')).endsWith('.tar.gz'), 'TAR.GZ 不能加密、名字跟着变')
  const mtg = await dl(() => page.click('#as-nw-go'))
  const te = parseTar(zlib.gunzipSync(mtg.buf))
  assert(te.find((e) => e.name === '季度总结.txt').data.equals(n1) && te.find((e) => e.name === 'photo.jpg').data.equals(n2), '新建 tar.gz 内容一致')
  ext(mtg.buf, 'new.tar.gz')
  covered.add('create')

  /* 11. 本机记录：同步写——打开后什么都不做、立刻刷新，也要在 */
  await tab('open')
  await openFx('notes.txt.gz')
  await page.reload()
  await page.waitForFunction(() => window.ASApp)
  const hist = await page.textContent('#as-history-list')
  assert(await page.isVisible('#as-history') && hist.includes('notes.txt.gz') && hist.includes('win-gbk.zip'), '刷新后「最近打开过」里有刚打开的 notes.txt.gz 和更早的 win-gbk.zip')

  /* 12. 说明页：功能清单逐项都被本测试覆盖过；基准表数字钉死为离线套件实测值 */
  await tab('help')
  const caps = await page.$$eval('#as-caps tr', (ns) => ns.map((n) => n.getAttribute('data-cap')))
  const dead = caps.filter((c) => !covered.has(c))
  assert(caps.length >= 15 && dead.length === 0, '功能清单里没被测到的：' + dead.join(','))
  if (ORACLE.bench) {
    const tot = await page.textContent('#as-bench-total')
    assert(tot.includes(ORACLE.bench.ok + ' / ' + ORACLE.bench.n), '基准合计应为离线实测 ' + ORACLE.bench.ok + ' / ' + ORACLE.bench.n + '：' + tot)
    const rows = await page.$$eval('#as-bench tbody tr', (ns) => ns.map((n) => [n.getAttribute('data-g'), n.children[1].textContent]))
    assert(rows.length === ORACLE.bench.groups.length && rows.every(([g, v], i) => g === ORACLE.bench.groups[i].id && v === ORACLE.bench.groups[i].ok + ' / ' + ORACLE.bench.groups[i].n), '基准分组数字与离线实测一致')
  }

  /* 12b. 编码识别现场复跑：对拍台 s6 语料里「1 个文件名」的 14 组（最难的一档），浏览器里逐组重算，必须与 fork 离线跑出的计数一致 */
  if (ORACLE.detect) {
    const live = await page.evaluate((D) => {
      const LAT = new Set(['cp437', 'cp850', 'windows-1252']), out = {}
      const dec = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
      D.groups.forEach((g) => {
        let ok = 0
        g.arcs.forEach((arc) => {
          const raws = arc.map(dec), d = window.AS.detectNames(raws)
          let good = d.best === g.enc
          if (!good && LAT.has(g.enc) && LAT.has(d.best)) good = raws.every((r) => window.AS.decode(r, d.best, false) === window.AS.decode(r, g.enc, false))
          if (good) ok++
        })
        out[g.id] = ok
      })
      return out
    }, ORACLE.detect)
    assert(ORACLE.detect.groups.length === 14, '现场复跑 14 组')
    for (const g of ORACLE.detect.groups) assert(live[g.id] === g.ok, `编码识别现场复跑 ${g.id}：浏览器 ${live[g.id]} ≠ 离线 ${g.ok}`)
  }

  /* 13. 页签键盘操作 */
  await page.focus('#as-tab-help')
  await page.keyboard.press('ArrowRight')
  await page.waitForFunction(() => document.getElementById('as-tab-open').getAttribute('aria-selected') === 'true')
  assert(await page.evaluate(() => document.activeElement.id) === 'as-tab-open', '方向键切页签并移焦点')

  /* 14. 渲染守卫：各视图控件不塌缩、无横向溢出、无大写变形；小块不重叠 */
  await page.click('[data-sample="win"]')
  await page.waitForFunction(() => window.ASApp.state.arc && /Windows/.test(window.ASApp.state.arc.src.name))
  const VIEWS = ['open:files', 'open:health', 'open:repack', 'open:extract', 'new', 'help']
  const onView = async (v) => { const [t, s] = v.split(':'); await page.click('#as-tab-' + t); if (s) await page.click('#as-st-' + s) }
  const paneSel = (v) => { const [t, s] = v.split(':'); return s ? '#as-sub-' + s : '#as-pane-' + t }
  await onView('open:files')
  await guardHidden(page, { assert, panesRoot: 'main', tabs: ['open', 'new', 'help'] })
  await guardUniqueIds(page, { assert, minIds: 60 })
  const nCtl = await guardControlSize(page, { assert, tabs: VIEWS, onTab: onView, paneSel, minControls: 40 })
  for (const host of ['.as-nav', '#as-encbar', '.as-hero']) await guardControlSize(page, { assert, tabs: [host], onTab: async () => { await onView('open:files') }, paneSel: (h) => h, minControls: 1 })
  await guardTextTransform(page, { assert, tabs: VIEWS, onTab: onView, paneSel, labelSel: 'th, dt, label, label > span, .as-group-title, .as-stat span' })
  await guardOverflow(page, { assert, tabs: VIEWS, onTab: onView, panesRoot: 'body' })
  await onView('open:files')
  await guardBoxOverlap(page, { assert, sel: '.as-tab, .as-chip, #as-badges .as-badge, .as-stat' })
  assert(nCtl >= 40, '可见控件 ' + nCtl)

  /* 15. 外部校验真的跑了（设了环境变量时） */
  if (process.env.AS_7ZZ) assert(externalRuns >= 10, '外部工具校验次数 ' + externalRuns)

  // 缩略图：中文 Windows 包，GBK 识别 + 文件列表
  await page.setViewportSize({ width: 1280, height: 850 })
  await onView('open:files')
  await page.evaluate(() => window.scrollTo(0, 0))
  await screenshot('thumb.png')
}
function AsciiOr (b) { for (const x of b) if (x > 127) return false; return true }
