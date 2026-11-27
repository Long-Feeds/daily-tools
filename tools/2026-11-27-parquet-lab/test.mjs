// Parquet 工作台 · Parquet Lab 集成测试
// 真值（ORACLE）由 run 目录 truth/gen_truth.py 直接读原始文件算出：单元格与统计来自 pyarrow 26.0.1，
// 谓词命中数与布隆探测来自 DuckDB 2.0.1（异源核对，不经过本页引擎），经 inject-oracle.mjs 机械注入，不手抄。
// 订单示例是本页写出器生成的：truth/make_orders.mjs 抽出 app.js 里同一行参数在 node 里重放，再交 DuckDB / pyarrow 算真值。
import { renderGuards, guardBoxOverlap, guardControlSize } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import zlib from 'node:zlib'
import { spawnSync } from 'node:child_process'

const ORACLE = {
 "nested": {
  "ratioGt": 108,
  "ratioNull": 29,
  "rows": 240,
  "rowGroups": 2,
  "leaves": 20,
  "createdBy": "parquet-cpp-arrow version 26.0.1",
  "fileSize": 31362,
  "cells": [
   [
    "10000",
    "张三",
    "2025-07-18 18:32:00.678636Z",
    "1969-03-17",
    "09:39:35.000000",
    "95061.10",
    "67.498",
    "0.58642578125",
    "49889310-1c59-3af5-14aa-4e719d3c7dec"
   ],
   [
    "10001",
    "佐藤",
    "2025-05-22 04:27:33.483469Z",
    "1995-10-11",
    "null",
    "83952.90",
    "49.637",
    "0.87548828125",
    "6b82e6c9-d82f-b0f1-4236-74a6864fa3f3"
   ],
   [
    "10002",
    "佐藤",
    "2025-07-10 02:38:02.377420Z",
    "1983-05-03",
    "08:32:49.000000",
    "71851.61",
    "88.907",
    "null",
    "f6540600-c8fb-4456-b76d-c0c3b07822db"
   ],
   [
    "10003",
    "佐藤",
    "2025-03-02 02:28:34.005380Z",
    "2012-04-22",
    "08:44:46.000000",
    "90570.65",
    "57.541",
    "0.95849609375",
    "6af38f6c-159d-6a38-4a6a-03b381356bc5"
   ],
   [
    "10004",
    "王小明",
    "2025-10-04 01:54:24.072884Z",
    "1963-01-24",
    "06:02:41.000000",
    "7084.51",
    "70.229",
    "0.8779296875",
    "e1f66c3a-c910-8f89-37fe-43eb87a9ec13"
   ],
   [
    "10005",
    "王小明",
    "2025-03-26 02:19:18.115021Z",
    "1985-02-28",
    "09:46:13.000000",
    "93427.43",
    "62.247",
    "0.1014404296875",
    "1b252869-2bd8-af21-6fa1-2947f472bb69"
   ],
   [
    "10006",
    "Ana",
    "2025-08-19 17:01:00.485144Z",
    "1970-09-18",
    "09:43:59.000000",
    "47969.57",
    "57.879",
    "0.0236663818359375",
    "c4e70d70-f552-1d62-ba24-f8b84a205268"
   ],
   [
    "10007",
    "李四",
    "2025-01-12 00:52:00.693698Z",
    "2008-07-25",
    "08:56:16.000000",
    "null",
    "85.362",
    "0.478759765625",
    "a07481bd-f1b8-ea7c-237f-0de050931ba9"
   ]
  ],
  "flat": [
   "user_id",
   "name",
   "signup",
   "birthday",
   "wake_up",
   "balance",
   "score",
   "ratio",
   "device"
  ],
  "nestedCanon": [
   {
    "tags": [
     "s:ml",
     "s:湖仓",
     "s:parquet"
    ],
    "address": {
     "city": "s:深圳",
     "zip": "s:464545",
     "geo": {
      "lat": "f:51.5181",
      "lon": "f:103.7462"
     }
    },
    "prefs": [],
    "orders": []
   },
   {
    "tags": [
     "s:arrow",
     "s:arrow",
     "s:ml"
    ],
    "address": {
     "city": "s:深圳",
     "zip": "s:838892",
     "geo": {
      "lat": "f:20.458",
      "lon": "f:73.8846"
     }
    },
    "prefs": [
     [
      "s:theme",
      "i:5"
     ]
    ],
    "orders": [
     {
      "sku": "s:SKU-8939",
      "qty": "i:3",
      "price": "f:280.3399963378906"
     },
     {
      "sku": "s:SKU-5040",
      "qty": "i:5",
      "price": "f:400.1000061035156"
     },
     {
      "sku": "s:SKU-7846",
      "qty": "i:4",
      "price": "f:217.10000610351562"
     }
    ]
   },
   {
    "tags": [
     "s:etl",
     "s:parquet",
     "s:湖仓"
    ],
    "address": {
     "city": "s:上海",
     "zip": "s:622632",
     "geo": {
      "lat": "f:-36.6496",
      "lon": "f:121.2567"
     }
    },
    "prefs": null,
    "orders": []
   },
   {
    "tags": [
     "s:arrow"
    ],
    "address": {
     "city": "s:新加坡",
     "zip": "s:255751",
     "geo": null
    },
    "prefs": [],
    "orders": [
     {
      "sku": "s:SKU-0422",
      "qty": "i:1",
      "price": "f:255.67999267578125"
     },
     {
      "sku": "s:SKU-4975",
      "qty": "i:4",
      "price": "f:163.6999969482422"
     }
    ]
   },
   {
    "tags": [
     "s:etl"
    ],
    "address": {
     "city": "s:深圳",
     "zip": "s:546016",
     "geo": {
      "lat": "f:44.1655",
      "lon": "f:-39.717"
     }
    },
    "prefs": [
     [
      "s:font",
      "i:3"
     ],
     [
      "s:lang",
      "i:1"
     ],
     [
      "s:tz",
      "i:2"
     ]
    ],
    "orders": [
     {
      "sku": "s:SKU-1967",
      "qty": "i:5",
      "price": "f:398.5"
     },
     {
      "sku": "s:SKU-1549",
      "qty": "i:2",
      "price": "f:116.44000244140625"
     },
     {
      "sku": "s:SKU-7440",
      "qty": "i:3",
      "price": "f:204.58999633789062"
     }
    ]
   },
   {
    "tags": [
     "s:湖仓",
     "s:etl"
    ],
    "address": {
     "city": "s:上海",
     "zip": "s:390231",
     "geo": {
      "lat": "f:-52.3302",
      "lon": "f:146.8181"
     }
    },
    "prefs": [],
    "orders": [
     {
      "sku": "s:SKU-6791",
      "qty": "i:1",
      "price": "f:29.600000381469727"
     },
     {
      "sku": "s:SKU-5077",
      "qty": "i:1",
      "price": "f:47.84000015258789"
     }
    ]
   },
   {
    "tags": [],
    "address": null,
    "prefs": null,
    "orders": [
     {
      "sku": "s:SKU-8562",
      "qty": "i:3",
      "price": "f:298.8800048828125"
     }
    ]
   },
   {
    "tags": null,
    "address": {
     "city": "s:Berlin",
     "zip": "s:645730",
     "geo": null
    },
    "prefs": [
     [
      "s:theme",
      "i:5"
     ],
     [
      "s:font",
      "i:3"
     ],
     [
      "s:tz",
      "i:5"
     ]
    ],
    "orders": [
     {
      "sku": "s:SKU-9201",
      "qty": "i:3",
      "price": "f:172.5"
     }
    ]
   },
   {
    "tags": [],
    "address": {
     "city": "s:新加坡",
     "zip": "s:641690",
     "geo": null
    },
    "prefs": [
     [
      "s:tz",
      "i:2"
     ],
     [
      "s:font",
      "i:0"
     ],
     [
      "s:lang",
      "i:5"
     ]
    ],
    "orders": [
     {
      "sku": "s:SKU-2657",
      "qty": "i:3",
      "price": "f:148.35000610351562"
     }
    ]
   },
   {
    "tags": [
     "s:etl",
     "s:arrow"
    ],
    "address": {
     "city": "s:深圳",
     "zip": "s:442141",
     "geo": {
      "lat": "f:44.8773",
      "lon": "f:77.0522"
     }
    },
    "prefs": [],
    "orders": [
     {
      "sku": "s:SKU-1981",
      "qty": "i:5",
      "price": "f:259.95001220703125"
     },
     {
      "sku": "s:SKU-7470",
      "qty": "i:5",
      "price": null
     },
     {
      "sku": "s:SKU-1439",
      "qty": "i:4",
      "price": "f:389.20001220703125"
     }
    ]
   },
   {
    "tags": [
     "s:数据",
     "s:parquet"
    ],
    "address": {
     "city": "s:Berlin",
     "zip": "s:250433",
     "geo": {
      "lat": "f:-45.2117",
      "lon": "f:-70.2204"
     }
    },
    "prefs": [],
    "orders": [
     {
      "sku": "s:SKU-6711",
      "qty": "i:3",
      "price": "f:48.40999984741211"
     },
     {
      "sku": "s:SKU-8104",
      "qty": "i:5",
      "price": "f:258.8299865722656"
     }
    ]
   },
   {
    "tags": [
     "s:arrow",
     "s:数据",
     "s:arrow"
    ],
    "address": {
     "city": "s:上海",
     "zip": "s:296768",
     "geo": {
      "lat": "f:-58.6328",
      "lon": "f:-137.4985"
     }
    },
    "prefs": [
     [
      "s:lang",
      "i:5"
     ],
     [
      "s:tz",
      "i:2"
     ],
     [
      "s:theme",
      "i:0"
     ]
    ],
    "orders": [
     {
      "sku": "s:SKU-1770",
      "qty": "i:1",
      "price": "f:136.1699981689453"
     }
    ]
   }
  ],
  "chunkLen": [
   [
    45,
    189,
    860,
    387,
    594,
    477,
    823,
    258,
    1763,
    282,
    159,
    407,
    793,
    793,
    333,
    292,
    557,
    320,
    659,
    1022
   ],
   [
    45,
    191,
    865,
    392,
    596,
    512,
    836,
    269,
    1813,
    274,
    160,
    413,
    847,
    847,
    339,
    282,
    619,
    308,
    708,
    1011
   ]
  ],
  "paths": [
   "user_id",
   "name",
   "signup",
   "birthday",
   "wake_up",
   "balance",
   "score",
   "ratio",
   "device",
   "tags.list.element",
   "address.city",
   "address.zip",
   "address.geo.lat",
   "address.geo.lon",
   "prefs.key_value.key",
   "prefs.key_value.value",
   "orders.list.element.sku",
   "orders.list.element.qty",
   "orders.list.element.price",
   "avatar"
  ],
  "stats0": {
   "user_id": [
    "10000",
    "10119",
    0
   ],
   "signup": [
    "2025-01-07 04:15:47.274345Z",
    "2025-11-24 00:03:24.743227Z",
    13
   ],
   "birthday": [
    "1960-02-27",
    "2012-04-22",
    14
   ],
   "balance": [
    "864.78",
    "99702.79",
    22
   ]
  }
 },
 "duck": {
  "rows": 6000,
  "rowGroups": 3,
  "createdBy": "DuckDB version v2.0.1 (build 8d78114e90)",
  "preds": [
   {
    "col": "kind",
    "op": "=",
    "val": "buy",
    "count": 1243,
    "sql": "kind = 'buy'"
   },
   {
    "col": "kind",
    "op": "=",
    "val": "refund",
    "count": 0,
    "sql": "kind = 'refund'"
   },
   {
    "col": "amount",
    "op": ">",
    "val": "900",
    "count": 485,
    "sql": "amount > 900"
   },
   {
    "col": "amount",
    "op": "is null",
    "val": "",
    "count": 1177,
    "sql": "amount is null"
   },
   {
    "col": "ts",
    "op": "<",
    "val": "2026-11-01 12:00:00",
    "count": 1168,
    "sql": "ts < timestamp '2026-11-01 12:00:00'"
   },
   {
    "col": "event_id",
    "op": ">=",
    "val": "4500",
    "count": 1501,
    "sql": "event_id >= 4500"
   },
   {
    "col": "user",
    "op": "=",
    "val": "u0423",
    "count": 5,
    "sql": "\"user\" = 'u0423'"
   },
   {
    "col": "page",
    "op": "<=",
    "val": "3",
    "count": 474,
    "sql": "page <= 3"
   }
  ],
  "bloom": {
   "kind=buy": [
    false,
    false,
    false
   ],
   "kind=refund": [
    true,
    true,
    true
   ],
   "user=u0423": [
    false,
    false,
    false
   ],
   "user=zzzz": [
    false,
    false,
    false
   ]
  }
 },
 "legacy": {
  "rows": 500,
  "cells": [
   [
    "0",
    "2019-06-01 00:00:00.000000000",
    "EU",
    "304"
   ],
   [
    "1",
    "2019-06-01 00:17:00.123456000",
    "US",
    "418"
   ],
   [
    "2",
    "2019-06-01 00:34:00.246912000",
    "US",
    "473"
   ],
   [
    "3",
    "2019-06-01 00:51:00.370368000",
    "华北",
    "658"
   ],
   [
    "4",
    "2019-06-01 01:08:00.493824000",
    "华东",
    "561"
   ]
  ],
  "physical": [
   "INT32",
   "INT96",
   "BYTE_ARRAY",
   "INT64"
  ],
  "codec": "GZIP"
 },
 "orders": {
  "rows": 100000,
  "rowGroups": 4,
  "size": 1451271,
  "crc32": 4088804047,
  "preds": [
   {
    "col": "city",
    "op": "=",
    "val": "北京",
    "count": 27277,
    "sql": "city = '北京'"
   },
   {
    "col": "city",
    "op": "=",
    "val": "火星",
    "count": 0,
    "sql": "city = '火星'"
   },
   {
    "col": "city",
    "op": "=",
    "val": "北海",
    "count": 0,
    "sql": "city = '北海'"
   },
   {
    "col": "paid_at",
    "op": "<",
    "val": "2026-01-20 00:00:00",
    "count": 1900,
    "sql": "paid_at < timestamptz '2026-01-20 00:00:00+00'"
   },
   {
    "col": "amount",
    "op": ">=",
    "val": "2500",
    "count": 5784,
    "sql": "amount >= 2500"
   },
   {
    "col": "coupon",
    "op": "is null",
    "val": "",
    "count": 69904,
    "sql": "coupon is null"
   },
   {
    "col": "day",
    "op": "=",
    "val": "2026-02-10",
    "count": 100,
    "sql": "day = date '2026-02-10'"
   },
   {
    "col": "order_id",
    "op": "<",
    "val": "1001000",
    "count": 1000,
    "sql": "order_id < 1001000"
   },
   {
    "col": "vip",
    "op": "=",
    "val": "true",
    "count": 17917,
    "sql": "vip = true"
   }
  ],
  "sumAmount": "75209324.47",
  "cityCounts": {
   "上海": 14660,
   "东京": 7981,
   "北京": 27277,
   "广州": 12352,
   "成都": 9132,
   "新加坡": 8453,
   "杭州": 9449,
   "深圳": 10696
  },
  "stats": [
   [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    17470
   ],
   [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    17517
   ],
   [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    17387
   ],
   [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    17530
   ]
  ],
  "firstRows": [
   [
    "1000000",
    "北京",
    "家居",
    "6.46",
    "4",
    "2026-01-01 00:03:28+00:00",
    "2026-01-01",
    "True",
    "已发货",
    null
   ],
   [
    "1000001",
    "上海",
    "食品",
    "53.96",
    "2",
    "2026-01-01 00:18:10+00:00",
    "2026-01-01",
    "True",
    "已退款",
    null
   ],
   [
    "1000002",
    "北京",
    "图书",
    "234.27",
    "1",
    "2026-01-01 00:31:03+00:00",
    "2026-01-01",
    "False",
    "已支付",
    null
   ]
  ]
 },
 "brotli": {
  "b64": "UEFSMRUEFZADFX5MFWQVABIAABvHAABkFa/JpIPsBBIxRJQZIGDQBhACIyiGEyRFMyzH4wuEIrFEKpMrlCq1RqvTG4wms8VqszucLrfH6/sPABUAFWQVbCwVZBUQFQYVBhwYBDEAAAAYBAAAAAAWACgEMQAAABgEAAAAABERAAAAixiAAgAAAGQBBg9AIAxEYRxIoixM4zxQJE1UZV1Ypm1c531gKI5kaZ5oqq5s675wDAAAAAADFQQVnAIVlgFMFRoVABIAABuNAAAcqVFfzO4CANTDEULp9ZxlqMKJyCSip95tbOztEkHwR6vxOlO3MaSTnWio6Vrg9uTLEu7vjusgzEQpyaKqCxhDlCovq/FZABUAFUgVUCwVZBUQFQYVBhw2ACgM55Sy55Sy55Sy55SyGAAREQAAAIsRgAIAAABkAQQPEDIEZYeQugwhQ1B2CKnLEDIEZYeQugwhQwAAAAMVBBk8NQAYBnNjaGVtYRUEABUCJQIYAWsAFQwlAhgBcyUATBwAAAAWZBkcGSwmABwVAhk1AAYQGRgBaxUIFmQW8AQW5gImpAEmCBwYBDEAAAAYBAAAAAAWACgEMQAAABgEAAAAABERABksFQQVABUCABUAFRAVAgA8KQYZJgBkAAAAJgAcFQwZNQAGEBkYAXMVCBZkFtIDFtQCJqQEJu4CHDYAKAznlLLnlLLnlLLnlLIYABERABksFQQVABUCABUAFRAVAgA8FtgEGQYZJgBkAAAAFsIIFmQmCBa6BQAZHBgMQVJST1c6c2NoZW1hGOwBLy8vLy82Z0FBQUFRQUFBQUFBQUtBQXdBQmdBRkFBZ0FDZ0FBQUFBQkJBQU1BQUFBQ0FBSUFBQUFCQUFJQUFBQUJBQUFBQUlBQUFCQUFBQUFCQUFBQU5qLy8vOEFBQUVGRUFBQUFCZ0FBQUFFQUFBQUFBQUFBQUVBQUFCekFBQUFCQUFFQUFRQUFBQVFBQlFBQ0FBR0FBY0FEQUFBQUJBQUVBQUFBQUFBQVFJUUFBQUFIQUFBQUFRQUFBQUFBQUFBQVFBQUFHc0FBQUFJQUF3QUNBQUhBQWdBQUFBQUFBQUJJQUFBQUFBQUFBQT0AGCBwYXJxdWV0LWNwcC1hcnJvdyB2ZXJzaW9uIDI2LjAuMRksHAAAHAAAAAkCAABQQVIx",
  "rows": 50,
  "size": 882
 }
};

// ───────── 不依赖页面引擎的独立 Parquet 拆包器（Thrift Compact 通用读 + 页 CRC 用 zlib.crc32 核） ─────────
function tparse(buf, pos) {
  let p = pos
  const byte = () => { if (p >= buf.length) throw new Error('thrift 越界'); return buf[p++] }
  const uvar = () => { let r = 0n, s = 0n, b; do { b = byte(); r |= BigInt(b & 0x7f) << s; s += 7n } while (b & 0x80); return r }
  const zz = () => { const v = uvar(); return Number((v >> 1n) ^ -(v & 1n)) }
  function val(t) {
    switch (t) {
      case 1: return true
      case 2: return false
      case 3: return byte()
      case 4: case 5: case 6: return zz()
      case 7: { const v = buf.readDoubleLE(p); p += 8; return v }
      case 8: { const n = Number(uvar()); const v = buf.subarray(p, p + n); p += n; return v }
      case 9: case 10: { const h = byte(); let n = h >> 4; const et = h & 15; if (n === 15) n = Number(uvar()); const a = []; for (let i = 0; i < n; i++) a.push(et === 1 || et === 2 ? byte() === 1 : val(et)); return a }
      case 12: return struct()
      default: throw new Error('未知 thrift 类型 ' + t)
    }
  }
  function struct() { const o = {}; let last = 0; for (;;) { const b = byte(); if (b === 0) return o; const d = b >> 4; const id = d ? last + d : zz(); last = id; o[id] = val(b & 15) } }
  const o = struct()
  return [o, p]
}
function inspectParquet(buf) {
  if (buf.subarray(0, 4).toString() !== 'PAR1' || buf.subarray(buf.length - 4).toString() !== 'PAR1') throw new Error('魔数不对')
  const flen = buf.readUInt32LE(buf.length - 8)
  const [fm] = tparse(buf, buf.length - 8 - flen)
  const names = fm[2].slice(1).map((e) => e[4].toString())
  const out = { numRows: fm[3], names, codecs: [], pageTypes: [], crcOk: 0, crcBad: 0, pages: 0, createdBy: fm[6] ? fm[6].toString() : '' }
  for (const rg of fm[4]) {
    for (const cc of rg[1]) {
      const md = cc[3]
      out.codecs.push(md[4])
      let pos = md[11] != null && md[11] > 0 && md[11] < md[9] ? md[11] : md[9]
      const end = pos + md[7]
      while (pos < end) {
        const [ph, ds] = tparse(buf, pos)
        out.pages++
        out.pageTypes.push(ph[1])
        if (ph[4] != null) { if ((zlib.crc32(buf.subarray(ds, ds + ph[3])) | 0) === (ph[4] | 0)) out.crcOk++; else out.crcBad++ }
        pos = ds + ph[3]
      }
    }
  }
  return out
}

export default async ({ page, toolURL, screenshot, assert }) => {
  const TABS = ['ov', 'sc', 'da', 'ly', 'pd', 'li', 'en', 'wr', 'hi']
  const settle = (t) => page.waitForFunction((t) => { const k = document.getElementById('pl-pane-' + t).dataset.key; return k && k !== 'loading' }, t, { timeout: 30000 })
  const onTab = async (t) => { await page.click('#pl-tab-' + t); await settle(t) }
  const gen = () => page.evaluate(() => document.body.dataset.file || '')
  async function openSample(name) {
    const before = await gen()
    await page.click(`#pl-samples [data-sample="${name}"]`)
    await page.waitForFunction((b) => { const f = document.body.dataset.file || ''; return f !== b && /^\d+$/.test(f) }, before, { timeout: 30000 })
    return gen()
  }
  async function openBuffer(name, buffer) {
    const before = await gen()
    await page.setInputFiles('#pl-file', { name, mimeType: 'application/octet-stream', buffer })
    await page.waitForFunction((b) => { const f = document.body.dataset.file || ''; return f !== b && f !== '' }, before, { timeout: 30000 })
    return gen()
  }
  const leafIndex = (p) => page.evaluate((p) => PL.S.meta.leaves.findIndex((l) => l.pathStr === p), p)
  async function waitData(g, rg, pg) { await page.waitForFunction(([g, rg, pg]) => (document.getElementById('pl-pane-da').dataset.key || '').startsWith(`${g}:da:${rg}:${pg}:`), [g, rg, pg], { timeout: 30000 }) }
  async function pushdown(col, op, val) {
    await onTab('pd')
    const ci = await leafIndex(col)
    assert(ci >= 0, `下推：找不到列 ${col}`)
    await page.selectOption('#pl-pd-col', String(ci))
    await page.selectOption('#pl-pd-op', op)
    if (!op.includes('null')) await page.fill('#pl-pd-val', val)
    const v = await page.inputValue('#pl-pd-val')
    await page.click('#pl-pd-run')
    await page.waitForFunction(([ci, op, v]) => (document.getElementById('pl-pane-pd').dataset.key || '').endsWith(`:pd:${ci}:${op}:${v}:v`), [ci, op, v], { timeout: 30000 })
    return page.evaluate(() => ({ verify: PL.S.pd.verify, sum: PL.S.pd.result.summary, groups: PL.S.pd.result.groups.map((g) => ({ skip: g.skip, by: g.by, pages: g.pages.map((p) => p.skip) })) }))
  }
  // 页内的嵌套值规范形（与 truth/gen_truth.py 的 canon 同口径）
  const CANON = `(function canon(v){ if (v===null||v===undefined) return null; if (typeof v==='string') return 's:'+v; if (typeof v==='boolean') return v;
    if (typeof v==='bigint') return 'i:'+v.toString(); if (typeof v==='number') return Number.isInteger(v)&&!Object.is(v,-0)&&Math.abs(v)<2**53 ? 'i:'+v : 'f:'+String(v);
    if (v instanceof Uint8Array) return 'b:'+PQ.hex(v); if (Array.isArray(v)) return v.map(canon); if (v instanceof PQ.MapVal) return v.entries.map(function(e){return [canon(e[0]),canon(e[1])]});
    var o={}; Object.keys(v).forEach(function(k){o[k]=canon(v[k])}); return o; })`

  await page.goto(toolURL)
  await page.waitForFunction(() => document.body.dataset.ready === '1')
  await page.evaluate(() => localStorage.clear()) // 首次加载、还没有任何状态
  await page.reload()
  await page.waitForFunction(() => document.body.dataset.ready === '1')

  // ── 1. 空状态 + 键盘页签 ──
  const empties = await page.$$eval('.pl-empty', (ns) => ns.length)
  assert(empties >= 1, '没打开文件时概览应是空状态')
  await page.focus('#pl-tab-ov')
  await page.keyboard.press('ArrowRight')
  assert((await page.getAttribute('#pl-tab-sc', 'aria-selected')) === 'true', '方向键右应切到「结构」')
  assert(await page.evaluate(() => document.activeElement.id) === 'pl-tab-sc', '方向键切页签后焦点应在新页签上')
  await page.keyboard.press('End')
  assert((await page.getAttribute('#pl-tab-hi', 'aria-selected')) === 'true', 'End 应切到最后一个页签')
  assert(await page.$eval('#pl-pane-ov', (el) => getComputedStyle(el).display) === 'none', '非当前页签面板的计算样式应为 none')
  await onTab('ov')

  // ── 2. 嵌套样例（pyarrow 写）：元数据 vs pyarrow ──
  const N = ORACLE.nested
  let g = await openSample('nested')
  const metaN = await page.evaluate(() => ({ rows: PL.S.meta.numRows, rg: PL.S.meta.rowGroups.length, leaves: PL.S.meta.leaves.length, cb: PL.S.meta.createdBy, size: PL.S.src.size,
    lens: PL.S.meta.rowGroups.map((g) => g.columns.map((c) => c.len)), paths: PL.S.meta.leaves.map((l) => l.pathStr) }))
  assert(metaN.rows === N.rows && metaN.rg === N.rowGroups && metaN.leaves === N.leaves, `嵌套样例 行/行组/叶子 ${metaN.rows}/${metaN.rg}/${metaN.leaves}，pyarrow ${N.rows}/${N.rowGroups}/${N.leaves}`)
  assert(metaN.cb === N.createdBy, `created_by ${metaN.cb} ≠ ${N.createdBy}`)
  assert(metaN.size === N.fileSize, `文件大小 ${metaN.size} ≠ ${N.fileSize}`)
  assert(JSON.stringify(metaN.lens) === JSON.stringify(N.chunkLen), `列块压缩后字节数与 pyarrow total_compressed_size 不一致：${JSON.stringify(metaN.lens)} vs ${JSON.stringify(N.chunkLen)}`)
  assert(JSON.stringify(metaN.paths) === JSON.stringify(N.paths), '叶子列路径应与 pyarrow path_in_schema 一致')
  assert((await page.textContent('#pl-ov-created')).trim() === N.createdBy, '概览「写入者」应显示 created_by')
  const kpiRows = await page.$eval('#pl-ov-kpis .pl-kpi b', (el) => el.textContent)
  assert(kpiRows === '240', `概览行数 KPI 应为 240，实为 ${kpiRows}`)

  // 数据页：前 8 行标量列逐格对 pyarrow
  await onTab('da')
  await waitData(g, 0, 0)
  const cells = await page.$$eval('#pl-da-grid tbody tr', (trs, n) => trs.slice(0, 8).map((tr) => Array.from(tr.querySelectorAll('td')).slice(1, 1 + n).map((td) => td.textContent)), N.flat.length)
  for (let r = 0; r < N.cells.length; r++) for (let c = 0; c < N.flat.length; c++) {
    assert(cells[r][c] === N.cells[r][c], `嵌套样例第 ${r + 1} 行 ${N.flat[c]}：页面「${cells[r][c]}」，pyarrow「${N.cells[r][c]}」`)
  }
  // 嵌套列（LIST / STRUCT / MAP / LIST<STRUCT>）规范形对 pyarrow
  const nc = await page.evaluate((src) => { const canon = eval(src); return PL.S.da.cache.rows.slice(0, 12).map((r) => ({ tags: canon(r.tags), address: canon(r.address), prefs: canon(r.prefs), orders: canon(r.orders) })) }, CANON)
  for (let r = 0; r < N.nestedCanon.length; r++) for (const k of ['tags', 'address', 'prefs', 'orders']) {
    assert(JSON.stringify(nc[r][k]) === JSON.stringify(N.nestedCanon[r][k]), `嵌套样例第 ${r + 1} 行 ${k}：页面 ${JSON.stringify(nc[r][k])}，pyarrow ${JSON.stringify(N.nestedCanon[r][k])}`)
  }
  // 点单元格看完整值
  const ordRow = N.nestedCanon.findIndex((x) => x.orders && x.orders.length)
  assert(ordRow >= 0, '真值里应有带订单的行')
  await page.click(`#pl-da-grid td[data-r="${ordRow}"][data-c="12"]`)
  await page.waitForSelector('#pl-da-detail-val')
  const det = JSON.parse(await page.textContent('#pl-da-detail-val'))
  assert(Array.isArray(det) && det[0].sku === N.nestedCanon[ordRow].orders[0].sku.slice(2), `详情应显示订单 JSON，实为 ${JSON.stringify(det).slice(0, 80)}`)
  // 键盘：Enter 也能打开详情
  await page.focus(`#pl-da-grid td[data-r="0"][data-c="1"]`)
  await page.keyboard.press('Enter')
  await page.waitForFunction(() => /第 1 行 · name/.test(document.querySelector('#pl-da-detail-card h3').textContent))
  // 翻页：第 2 页从第 101 行开始
  await page.click('#pl-da-next')
  await waitData(g, 0, 1)
  assert((await page.textContent('#pl-da-pageno')).trim() === '2 / 2', '120 行、每页 100 行应有 2 页')
  const firstNo = await page.$eval('#pl-da-grid tbody tr td', (td) => td.textContent)
  assert(firstNo === '101', `第 2 页首行行号应为 101，实为 ${firstNo}`)
  // 结构页：行组 0 的列块统计对 pyarrow
  await onTab('sc')
  const statRows = await page.$$eval('#pl-sc-stats tbody tr', (trs) => trs.map((tr) => Array.from(tr.querySelectorAll('td')).map((td) => td.textContent)))
  for (const [col, [mn, mx, nul]] of Object.entries(N.stats0)) {
    const r = statRows.find((x) => x[0] === col)
    assert(r, `结构页应有列 ${col}`)
    assert(r[5].replace(/旧字段.*$/, '') === mn && r[6] === mx && r[4] === String(nul), `列 ${col} 统计 页面 ${r[5]} / ${r[6]} / ${r[4]}，pyarrow ${mn} / ${mx} / ${nul}`)
  }
  const treeRows = await page.$$eval('#pl-sc-tree tbody tr', (trs) => trs.length)
  assert(treeRows >= N.leaves + 6, `schema 树应列出叶子与分组节点，实得 ${treeRows} 行`)

  // 布局页：DELTA_BYTE_ARRAY 列（v2 页、页 CRC），逐页检视
  await onTab('ly')
  const skuIdx = await leafIndex('orders.list.element.sku')
  await page.selectOption('#pl-ly-ci', String(skuIdx))
  await page.waitForFunction((k) => (document.getElementById('pl-pane-ly').dataset.key || '').endsWith(`:ly:0:${k}:-1`), skuIdx)
  const pageRows = await page.$$eval('#pl-ly-table tbody tr', (trs) => trs.map((tr) => Array.from(tr.querySelectorAll('td')).map((td) => td.textContent)))
  assert(pageRows.length >= 1 && pageRows.every((r) => r[1] === 'DATA_PAGE_V2'), `sku 列应全是 v2 数据页：${pageRows.map((r) => r[1]).join(',')}`)
  assert(pageRows.every((r) => r[9] === 'DELTA_BYTE_ARRAY'), `sku 列编码应为 DELTA_BYTE_ARRAY：${pageRows.map((r) => r[9]).join(',')}`)
  assert(pageRows.every((r) => r[10] === '✓'), 'pyarrow 写了页 CRC，应全部校验通过')
  await page.click('#pl-ly-table tr[data-p="0"]')
  await page.waitForFunction((k) => (document.getElementById('pl-pane-ly').dataset.key || '').endsWith(`:ly:0:${k}:0`), skuIdx)
  const firstSku = (await page.textContent('#pl-ly-vals')).split('\n')[0]
  assert(firstSku === N.nestedCanon[ordRow].orders[0].sku.slice(2), `页检视首个值 ${firstSku} 应等于第一个订单 sku`)
  assert(await page.$('#pl-ly-lvhex') !== null, 'v2 页应单独显示未压缩的层级区')
  assert(await page.$$eval('#pl-ly-rawhex .pl-hx-hdr', (n) => n.length) > 10, '原始字节里页头应高亮')
  // footer 字段点选高亮
  await page.click('#pl-ly-spans .pl-span:nth-child(1)')
  await page.waitForFunction(() => document.querySelectorAll('#pl-ly-fhex .pl-hx-sel').length > 0)

  // ── 3. DuckDB 事件流：谓词下推 + 布隆，命中数对 DuckDB ──
  const D = ORACLE.duck
  g = await openSample('duckdb_events')
  assert(await page.evaluate(() => PL.S.meta.createdBy) === D.createdBy, 'DuckDB 样例 created_by')
  for (const p of D.preds) {
    const r = await pushdown(p.col, p.op, p.val)
    assert(r.verify && r.verify.hits === p.count, `${p.sql}：整列扫描命中 ${r.verify && r.verify.hits}，DuckDB count(*) ${p.count}`)
    assert(r.verify.missed === 0, `${p.sql}：被跳过的行组 / 页里不应有命中（漏 ${r.verify.missed}）`)
    const shown = await page.$eval('#pl-pd-kpis .pl-kpi:nth-child(4) b', (b) => b.textContent)
    assert(shown === p.count.toLocaleString('en-US') + ' 行', `KPI「真实命中」应显示 ${p.count} 行，实为 ${shown}`)
  }
  for (const [k, excl] of Object.entries(D.bloom)) {
    const [col, val] = k.split('=')
    if (col !== 'kind') continue
    const r = await pushdown(col, '=', val)
    const byBloom = r.groups.map((x) => x.skip && x.by === 'bloom')
    assert(JSON.stringify(byBloom) === JSON.stringify(excl), `${k}：页面布隆裁剪 ${JSON.stringify(byBloom)}，DuckDB parquet_bloom_probe ${JSON.stringify(excl)}`)
    const chips = await page.$$eval('#pl-pd-table .pl-chip-ok', (n) => n.length)
    assert(chips === excl.filter(Boolean).length, `${k}：表格里的「布隆」标记 ${chips} 个，应为 ${excl.filter(Boolean).length}`)
  }
  await onTab('li')
  const codesD = await page.$$eval('#pl-li-list .pl-find', (ns) => ns.map((n) => n.dataset.code))
  for (const c of ['BLOOM', 'NOPAGEIDX', 'CONVERTED']) assert(codesD.includes(c), `DuckDB 样例体检应含 ${c}：${codesD.join(',')}`)
  assert(!codesD.includes('INT96'), 'DuckDB 样例没有 INT96 列，体检不应报 INT96（它有 INT64 列，别把 INT64 当成 INT96）')
  const lvRank = { '错误': 0, '注意': 1, '提示': 2, '良好': 3 }
  const lvD = await page.$$eval('#pl-li-list .pl-find .pl-lv', (n) => n.map((x) => x.textContent))
  assert(lvD.every((x, i) => i === 0 || lvRank[lvD[i - 1]] <= lvRank[x]), `体检应按严重度排序：${lvD.join(',')}`)

  // ── 4. 旧格式 INT96 + GZIP ──
  const L = ORACLE.legacy
  g = await openSample('legacy_int96')
  await onTab('da')
  await waitData(g, 0, 0)
  const lc = await page.$$eval('#pl-da-grid tbody tr', (trs) => trs.slice(0, 5).map((tr) => Array.from(tr.querySelectorAll('td')).slice(1, 5).map((td) => td.textContent)))
  assert(JSON.stringify(lc) === JSON.stringify(L.cells), `INT96 样例前 5 行：页面 ${JSON.stringify(lc)}，pyarrow ${JSON.stringify(L.cells)}`)
  await onTab('li')
  const codesL = await page.$$eval('#pl-li-list .pl-find', (ns) => ns.map((n) => n.dataset.code))
  for (const c of ['INT96', 'NOSTATS', 'GZIP', 'NOPAGEIDX']) assert(codesL.includes(c), `旧格式体检应含 ${c}：${codesL.join(',')}`)
  assert(await page.$eval('#pl-li-list .pl-find .pl-lv', (el) => el.textContent) === '注意', '体检第一条应是「注意」级（按严重度排序）')
  const lvL = await page.$$eval('#pl-li-list .pl-find .pl-lv', (n) => n.map((x) => x.textContent))
  assert(lvL.every((x, i) => i === 0 || lvRank[lvL[i - 1]] <= lvRank[x]), `旧格式体检应按严重度排序：${lvL.join(',')}`)
  const i96 = await page.textContent('#pl-li-list .pl-find[data-code="INT96"] p')
  assert(/event_time/.test(i96) && !/clicks/.test(i96), `INT96 提示应只点名 event_time：${i96}`)

  // ── 5. BROTLI：结构照看，数据如实报错 ──
  g = await openBuffer('brotli.parquet', Buffer.from(ORACLE.brotli.b64, 'base64'))
  assert(/^\d+$/.test(g), 'BROTLI 文件的 footer 应能打开')
  await onTab('da')
  await page.waitForFunction((g) => (document.getElementById('pl-pane-da').dataset.key || '').startsWith(g + ':da:') && /:err$/.test(document.getElementById('pl-pane-da').dataset.key), g)
  assert(/BROTLI/.test(await page.textContent('#pl-da-body')), '数据页应说明 BROTLI 未内置')
  await onTab('li')
  assert(await page.$('#pl-li-list .pl-find[data-code="CODEC"] .pl-lv-error') !== null, 'BROTLI 应在体检里报「错误」')
  // 非 Parquet / 截断文件
  g = await openBuffer('hello.txt', Buffer.from('hello, this is not parquet at all'))
  assert(/^error/.test(g) && /不是 Parquet/.test(await page.textContent('#pl-status')), `非 Parquet 应报错：${await page.textContent('#pl-status')}`)
  const ordersBuf = Buffer.from(await page.evaluate(() => { const u = PQ.SAMPLES_B64.nested; return u }), 'base64')
  g = await openBuffer('cut.parquet', ordersBuf.subarray(0, ordersBuf.length - 3))
  assert(/^error/.test(g), '截断的文件应报错')

  // ── 6. 订单 10 万行（本页写出器）：字节级确定性 + 下推对 DuckDB ──
  const O = ORACLE.orders
  g = await openSample('orders')
  const ob64 = await page.evaluate(() => { const u = PL.S.src.u8; let s = ''; for (let i = 0; i < u.length; i += 32768) s += String.fromCharCode.apply(null, u.subarray(i, i + 32768)); return btoa(s) })
  const obuf = Buffer.from(ob64, 'base64')
  assert(obuf.length === O.size, `订单示例字节数 ${obuf.length} 应与 node 里同参重放的 ${O.size} 一致`)
  assert(zlib.crc32(obuf) === O.crc32, '订单示例应与 node 同参重放的文件逐字节一致（CRC32）')
  const insp = inspectParquet(obuf)
  assert(insp.numRows === O.rows && insp.crcBad === 0 && insp.crcOk === insp.pages && insp.pages >= 80, `独立拆包：${insp.numRows} 行、${insp.pages} 页、CRC 通过 ${insp.crcOk}、不符 ${insp.crcBad}`)
  for (const p of O.preds) {
    const r = await pushdown(p.col, p.op, p.val)
    assert(r.verify.hits === p.count, `订单 ${p.sql}：页面 ${r.verify.hits}，DuckDB ${p.count}`)
    assert(r.verify.missed === 0, `订单 ${p.sql}：被跳过部分漏了 ${r.verify.missed} 行`)
    if (p.val === '火星') assert(r.sum.skippedGroups === O.rowGroups && r.sum.readBytes === 0 && r.groups.every((x) => x.by === 'stats'), '「火星」的 UTF-8 字节大于列块 max，应靠统计跳过全部行组')
    if (p.val === '北海') assert(r.sum.skippedGroups === O.rowGroups && r.sum.readBytes === 0 && r.groups.every((x) => x.by === 'bloom'), '「北海」落在 min / max 之间但不存在，应由布隆过滤器跳过全部行组')
    if (p.col === 'paid_at') {
      assert(r.sum.skippedGroups === O.rowGroups - 1, `按时间排序的数据，paid_at < 1 月 20 日应只读第一个行组（跳过 ${r.sum.skippedGroups}）`)
      assert(r.groups[0].pages.some((x) => x) && r.groups[0].pages.some((x) => !x), '第一个行组里应按页索引跳过一部分页')
    }
  }
  // 页 CRC 以有符号 i32 存（约一半是负数）：整个行组的页都要校验通过；Thrift 负数往返
  const crcAll = await page.evaluate(() => {
    const m = PL.S.meta, u8 = PL.S.src.u8, out = { ok: 0, bad: 0, neg: 0 }
    m.rowGroups[0].columns.forEach((c, ci) => { PQ.readChunk(u8.subarray(c.start, c.end), c.start, m, 0, ci, {}).pages.forEach((p) => { if (p.crc < 0) out.neg++; if (p.crcOk) out.ok++; else out.bad++ }) })
    const ph = PQ.thriftRead('PageHeader', PQ.thriftWrite('PageHeader', { type: 0, uncompressed_page_size: 1, compressed_page_size: 1, crc: -2147483648 }), 0, 64).value
    out.rt = ph.crc
    return out
  })
  assert(crcAll.bad === 0 && crcAll.neg >= 5 && crcAll.ok >= 50 && crcAll.rt === -2147483648, `订单行组 0 页 CRC：${JSON.stringify(crcAll)}`)
  const lastOfPage = await pushdown('order_id', '=', '1004999')
  assert(lastOfPage.verify.hits === 1 && lastOfPage.verify.missed === 0 && lastOfPage.groups[0].pages[0] === false && lastOfPage.groups[0].pages[1] === true, `命中恰在第 0 页最后一行：${JSON.stringify(lastOfPage.groups[0].pages)}，命中 ${lastOfPage.verify.hits}`)
  // 公历换算：1900–2100 每一天对 JS Date（独立实现）
  const civilBad = await page.evaluate(() => { let bad = 0, first = ''; for (let d = -25567; d <= 47482; d++) { const a = PQ.fmtDate(d), b = new Date(d * 86400000).toISOString().slice(0, 10); if (a !== b) { bad++; if (!first) first = a + ' vs ' + b } } return bad + ' ' + first })
  assert(civilBad === '0 ', `fmtDate 与 JS Date 不一致：${civilBad}`)
  // 分段读取恰好停在页边界：不能把半个列块当成完整结果（Codex P1）
  const nm = await page.evaluate(() => {
    const m = PL.S.meta, u8 = PL.S.src.u8, ci = m.leaves.findIndex((l) => l.pathStr === 'order_id'), c = m.rowGroups[0].columns[ci]
    const full = PQ.readChunk(u8.subarray(c.start, c.end), c.start, m, 0, ci, {})
    const part = PQ.readChunk(u8.subarray(c.start, full.pages[1].offset), c.start, m, 0, ci, {})
    return { needMore: part.needMore, err: part.error || '', pages: part.pages.length, full: full.pages.length }
  })
  assert(nm.needMore === true && !nm.err && nm.pages === 1 && nm.full >= 5, `读到页边界为止应报 needMore：${JSON.stringify(nm)}`)
  // 编码实验：order_id 连续递增
  await onTab('en')
  await page.selectOption('#pl-en-col', String(await leafIndex('order_id')))
  await page.click('#pl-en-run')
  await page.waitForFunction(() => /:done$/.test(document.getElementById('pl-pane-en').dataset.key || ''))
  const lab = await page.evaluate(() => PL.S.en.result)
  const plain = lab.rows.find((r) => r.name === 'PLAIN'), delta = lab.rows.find((r) => r.name === 'DELTA_BINARY_PACKED')
  assert(plain.raw === 25000 * 8, `25000 个 INT64 的 PLAIN 应为 200000 字节，实为 ${plain.raw}`)
  assert(delta && delta.raw < 1200, `连续递增的 order_id 用 DELTA 应 < 1200 字节，实为 ${delta && delta.raw}`)
  assert(lab.best.enc === 5, `order_id 最省的编码应是 DELTA_BINARY_PACKED，实为 ${lab.best.enc}`)
  assert(await page.$('#pl-en-table tr[data-enc="5"] .pl-cur') !== null, '「文件在用」应标在 DELTA_BINARY_PACKED 上')
  // 导出当前行组 CSV
  await onTab('da')
  await waitData(g, 0, 0)
  await page.click('#pl-da-csv')
  await page.waitForFunction(() => PL.lastExport && PL.lastExport.kind === 'csv')
  const ex = await page.evaluate(() => PL.lastExport)
  assert(ex.rows === 25000, `导出行数应为 25000，实为 ${ex.rows}`)
  const lines = ex.text.split('\n')
  assert(lines[0] === 'order_id,city,category,amount,qty,paid_at,day,vip,status,coupon', `CSV 表头：${lines[0]}`)
  for (let i = 0; i < 3; i++) {
    const f = lines[i + 1].split(','), t = O.firstRows[i]
    assert(f[0] === t[0] && f[1] === t[1] && f[2] === t[2] && f[3] === t[3] && f[4] === t[4] && f[6] === t[6] && f[7] === t[7].toLowerCase(), `CSV 第 ${i + 1} 行 ${lines[i + 1]} 与 pyarrow ${t.join(',')} 不符`)
  }
  // 同一个文件走「选择文件」路径（按需分段读取）
  g = await openBuffer('orders_from_disk.parquet', obuf)
  assert(await page.evaluate(() => !PL.S.src.u8), '从文件选择器打开时应按需分段读取，不整读进内存')
  await onTab('da')
  await waitData(g, 0, 0)
  const fr = await page.$$eval('#pl-da-grid tbody tr:first-child td', (tds) => tds.slice(1, 6).map((td) => td.textContent))
  assert(fr.join('|') === O.firstRows[0].slice(0, 5).join('|'), `分段读取首行 ${fr.join('|')}`)

  // ── 7. 写出：示例 CSV → Parquet → 独立拆包 + pyarrow 复核 ──
  await onTab('wr')
  await page.click('#pl-wr-sample')
  await page.waitForSelector('#pl-wr-coltable')
  const inferred = await page.$$eval('#pl-wr-coltable tbody tr', (trs) => trs.map((tr) => tr.querySelector('select').value))
  assert(inferred.join(',') === 'string,date,double,double,string,timestamptz', `类型推断 ${inferred.join(',')}`)
  await page.selectOption('#pl-wr-codec', '1')
  await page.selectOption('#pl-wr-ver', '1')
  await page.click('#pl-wr-go')
  await page.waitForSelector('#pl-wr-result')
  const wb = Buffer.from(await page.evaluate(() => Array.from(PL.S.wr.result.bytes)))
  const wi = inspectParquet(wb)
  assert(wi.numRows === 6 && wi.names.join(',') === 'city,day,temp_c,rain_mm,station,updated_at', `写出文件：${wi.numRows} 行，列 ${wi.names}`)
  assert(wi.crcBad === 0 && wi.crcOk === wi.pages && wi.codecs.every((c) => c === 1), `写出文件页 CRC ${wi.crcOk}/${wi.pages}，压缩 ${wi.codecs}`)
  const py = process.env.PL_PY
  if (py) {
    const tmp = path.join(os.tmpdir(), 'pl-test-' + process.pid + '.parquet')
    fs.writeFileSync(tmp, wb)
    const r = spawnSync(py, ['-c', 'import sys, json, pyarrow.parquet as pq\nt = pq.read_table(sys.argv[1])\nprint(json.dumps({"rows": t.to_pylist(), "types": [str(x) for x in t.schema.types]}, default=str, ensure_ascii=False))', tmp], { encoding: 'utf8' })
    fs.unlinkSync(tmp)
    assert(r.status === 0, `pyarrow 读写出文件失败：${r.stderr}`)
    const j = JSON.parse(r.stdout)
    assert(j.types.join(',') === 'string,date32[day],double,double,string,timestamp[us, tz=UTC]', `pyarrow 读到的类型 ${j.types}`)
    assert(j.rows[5].city === 'Zürich, CH' && j.rows[2].rain_mm === null && j.rows[0].temp_c === 18.4, `pyarrow 读到的值 ${JSON.stringify(j.rows[5])}`)
    assert(j.rows[0].updated_at === '2026-11-01 00:00:00+00:00', `+08:00 应换算成 UTC：${j.rows[0].updated_at}`)
  }
  // GZIP + v2 页
  await page.selectOption('#pl-wr-codec', '2')
  await page.selectOption('#pl-wr-ver', '2')
  await page.evaluate(() => { PL.S.wr.result = null })
  await page.click('#pl-wr-go')
  await page.waitForFunction(() => PL.S.wr.result && PL.S.prefs.writer.codec === 2 && PL.S.prefs.writer.pageVersion === 2)
  const wi2 = inspectParquet(Buffer.from(await page.evaluate(() => Array.from(PL.S.wr.result.bytes))))
  assert(wi2.codecs.every((c) => c === 2) && wi2.pageTypes.filter((t) => t !== 2).every((t) => t === 3) && wi2.crcBad === 0, `GZIP + v2：压缩 ${wi2.codecs}，页类型 ${wi2.pageTypes}，CRC 不符 ${wi2.crcBad}`)
  // 改类型制造转换失败
  await page.selectOption('#pl-wr-coltable tr[data-k="4"] select', 'int32')
  await page.waitForFunction(() => /6（第 1 行/.test(document.querySelector('#pl-wr-coltable tr[data-k="4"] td:nth-child(5)').textContent))
  await page.selectOption('#pl-wr-coltable tr[data-k="4"] select', 'string')
  // JSON 输入：嵌套值写成 JSON 列
  await page.fill('#pl-wr-text', '[{"id":1,"tags":["a","b"],"ok":true},{"id":2,"tags":[],"ok":false},{"id":3,"tags":null,"ok":null}]')
  await page.click('#pl-wr-parse')
  await page.waitForFunction(() => document.querySelectorAll('#pl-wr-coltable tbody tr').length === 3)
  const jt = await page.$$eval('#pl-wr-coltable tbody tr select', (s) => s.map((x) => x.value))
  assert(jt.join(',') === 'int32,json,bool', `JSON 输入的类型推断 ${jt}`)
  await page.fill('#pl-wr-text', '   ')
  await page.click('#pl-wr-parse')
  assert(/没有数据/.test(await page.textContent('#pl-wr-cols')), '空输入应提示没有数据')
  // 写出后直接在本页打开
  await page.click('#pl-wr-sample')
  await page.click('#pl-wr-go')
  await page.waitForSelector('#pl-wr-open')
  const beforeOpen = await gen()
  await page.click('#pl-wr-open')
  await page.waitForFunction((b) => document.body.dataset.file !== b && /^\d+$/.test(document.body.dataset.file), beforeOpen)
  await settle('ov')
  assert(await page.$eval('#pl-ov-kpis .pl-kpi b', (el) => el.textContent) === '6', '写出的文件在本页打开后应是 6 行')

  // ── 8. 历史 / 持久化 ──
  await onTab('hi')
  const names = await page.$$eval('#pl-hi-table tbody tr td:first-child', (tds) => tds.map((td) => td.textContent))
  for (const n of ['users_nested.parquet', 'events_duckdb.parquet', 'legacy_int96.parquet', 'orders_100k.parquet', 'weather.parquet']) assert(names.includes(n), `历史里应有 ${n}：${names.join(',')}`)
  assert(!names.includes('hello.txt'), '打不开的文件不应记快照')
  // schema 对比
  const ids = await page.evaluate(() => Object.fromEntries(PL.S.history.map((s) => [s.name, s.id])))
  await page.selectOption('#pl-hi-a', ids['users_nested.parquet'])
  await page.selectOption('#pl-hi-b', ids['events_duckdb.parquet'])
  await page.click('#pl-hi-diff')
  await page.waitForFunction(() => /:diff:/.test(document.getElementById('pl-pane-hi').dataset.key))
  const dk = await page.$$eval('#pl-hi-kpis .pl-kpi b', (b) => b.map((x) => x.textContent))
  assert(dk.join(',') === '6,20,0,0', `嵌套样例 → DuckDB 样例 schema 对比 新增/删除/变化/不变 = ${dk}`)
  // 刷新后仍在（正向锚点：先确认读到了列表）
  const nBefore = names.length
  await page.reload()
  await page.waitForFunction(() => document.body.dataset.ready === '1')
  await onTab('hi')
  assert(await page.$$eval('#pl-hi-table tbody tr', (t) => t.length) === nBefore, '刷新后历史条数应不变')
  // 本页内存已过期：同页直接改存储（同页写入不触发本页 storage 事件），再记录 —— 外部写入的那条必须还在
  await openSample('legacy_int96')
  await page.evaluate(() => { const k = 'pqlab.history.v1', l = JSON.parse(localStorage.getItem(k)); l.unshift({ id: 'ext-write-1', name: '外部写入.parquet', size: 1, rows: 1, rowGroups: 1, createdBy: 'x', at: new Date().toISOString(), codecs: [], fields: [{ path: 'a', type: 'INT32', logical: '', rep: 'O' }] }); localStorage.setItem(k, JSON.stringify(l)) })
  await onTab('hi')
  await page.click('#pl-hi-snap')
  await page.waitForFunction(() => PL.S.history.some((s) => s.id === 'ext-write-1'))
  assert(await page.evaluate(() => JSON.parse(localStorage.getItem('pqlab.history.v1')).some((s) => s.id === 'ext-write-1')), 'ext-write：记录快照时应先重读存储，外部写入的那条不能被覆盖')
  // 第二个页签同时写
  const p2 = await page.context().newPage()
  await p2.goto(toolURL)
  await p2.waitForFunction(() => document.body.dataset.ready === '1')
  const cnt0 = await page.evaluate(() => JSON.parse(localStorage.getItem('pqlab.history.v1')).length)
  await Promise.all([
    page.evaluate(() => PL.openBytes(Uint8Array.from(atob(PQ.SAMPLES_B64.nested), (c) => c.charCodeAt(0)), 'tab-a.parquet')),
    p2.evaluate(() => PL.openBytes(Uint8Array.from(atob(PQ.SAMPLES_B64.duckdb_events), (c) => c.charCodeAt(0)), 'tab-b.parquet')),
  ])
  const both = await page.evaluate(() => JSON.parse(localStorage.getItem('pqlab.history.v1')).map((s) => s.name))
  assert(both.includes('tab-a.parquet') && both.includes('tab-b.parquet') && both.length === cnt0 + 2, `两个页签同时打开文件，两条快照都要在（${both.length - cnt0} 条新增）`)
  await page.waitForFunction(() => PL.S.history.some((s) => s.name === 'tab-b.parquet'))
  // 偏好：第二个页签改的写出选项，本页通过 storage 事件同步
  await p2.click('#pl-tab-wr')
  await p2.selectOption('#pl-wr-codec', '7')
  await page.waitForFunction(() => PL.S.prefs.writer.codec === 7)
  await p2.close()
  // 写盘失败：快照与导入都要如实报告，列表不变
  const before = await page.evaluate(() => localStorage.getItem('pqlab.history.v1'))
  await page.evaluate(() => { window.__set = Storage.prototype.setItem; Storage.prototype.setItem = function () { throw new DOMException('quota', 'QuotaExceededError') } })
  await onTab('hi')
  await page.click('#pl-hi-snap')
  await page.waitForFunction(() => /没能存进本机/.test(document.getElementById('pl-status').textContent))
  await page.setInputFiles('#pl-hi-file', { name: 'h.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ snapshots: [{ id: 'imp-1', name: 'x.parquet', fields: [] }] })) })
  await page.waitForFunction(() => /导入失败：存储不可写/.test(document.getElementById('pl-hi-msg').textContent))
  await onTab('wr')
  await page.selectOption('#pl-wr-codec', '2')
  await page.waitForFunction(() => /偏好没能保存/.test(document.getElementById('pl-wr-msg').textContent))
  await page.evaluate(() => { Storage.prototype.setItem = window.__set })
  assert(await page.evaluate(() => localStorage.getItem('pqlab.history.v1')) === before, 'QuotaExceededError 时历史存储不应变化')
  // 导入坏数据：逐条规范化，坏记录跳过
  await onTab('hi')
  const good = { id: 'imp-ok', name: '导入.parquet', size: 10, rows: 2, rowGroups: 1, createdBy: 'y', at: '2026-01-02T03:04:05.000Z', codecs: ['ZSTD'], fields: [{ path: 'q', type: 'INT64', logical: '', rep: 'R' }] }
  const bad = [null, 7, { id: 5, name: 'n', fields: [] }, { id: 'f1', name: 'n', fields: 'oops' }, { id: 'num-at', name: 'n.parquet', at: 12345, size: '9', fields: [{ path: 'z' }, null] }]
  await page.setInputFiles('#pl-hi-file', { name: 'h.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ snapshots: [good, ...bad], prefs: { pageSize: 50, writer: { codec: 99 } } })) })
  await page.waitForFunction(() => /导入 2 条，跳过 4 条/.test(document.getElementById('pl-hi-msg').textContent))
  assert(await page.evaluate(() => PL.S.prefs.pageSize) === 50, '导入应合并偏好（pageSize 50）')
  assert(await page.evaluate(() => PL.S.prefs.writer.codec) !== 99, '导入的非法偏好值应被丢弃')
  await page.evaluate(() => { const k = 'pqlab.history.v1', l = JSON.parse(localStorage.getItem(k)); l.push(null, 3, { id: 'broken' }, { id: 'b2', name: 'x', fields: [null] }); localStorage.setItem(k, JSON.stringify(l)); localStorage.setItem('pqlab.prefs.v1', '{oops') })
  await page.reload()
  await page.waitForFunction(() => document.body.dataset.ready === '1')
  await onTab('hi')
  const after = await page.$$eval('#pl-hi-table tbody tr', (t) => t.map((x) => x.dataset.id))
  assert(after.includes('imp-ok') && after.includes('num-at') && after.includes('b2') && !after.includes('broken'), `坏记录应被跳过、好记录保留：${after.join(',')}`)
  assert(await page.evaluate(() => PL.S.prefs.pageSize) === 100, '偏好存储损坏时应回到默认值')
  // 清空：两步确认
  await page.click('#pl-hi-clear')
  assert((await page.textContent('#pl-hi-clear')).trim() === '再点一次确认清空', '第一次点只进入确认态')
  await page.click('#pl-hi-clear')
  await page.waitForSelector('#pl-hi-empty')
  assert(await page.evaluate(() => JSON.parse(localStorage.getItem('pqlab.history.v1')).length) === 0, '清空后存储应为空数组')

  // ── 8.5 Codex 复核 / fork 对拍台修复的回归断言（每条都对应一个已修的问题） ──
  // 写出器：改了文本没重新解析就生成，必须用新数据（Codex P1）
  await onTab('wr')
  await page.click('#pl-wr-sample')
  await page.fill('#pl-wr-text', (await page.inputValue('#pl-wr-text')).replace('18.4', '99.5'))
  assert(await page.$('#pl-wr-stale') !== null, '改了数据后应提示旧解析作废')
  await page.evaluate(() => { PL.S.wr.result = null })
  await page.click('#pl-wr-go')
  await page.waitForFunction(() => PL.S.wr.result)
  const t99 = await page.evaluate(() => PQ.readAll(PQ.openBuffer(PL.S.wr.result.bytes)).rows[0].temp_c)
  assert(t99 === 99.5, `改过文本直接生成，第一行 temp_c 应是 99.5，实为 ${t99}`)
  // 关统计、开页索引、每页 1 行：页索引里必须是真实边界，不能是空字节（Codex P1 / fork BUG-1）
  await page.fill('#pl-wr-text', 's\nabc\nabc\nxyz\nxyz')
  await page.click('#pl-wr-parse')
  await page.uncheck('#pl-wr-stats')
  await page.fill('#pl-wr-pg', '1')
  await page.dispatchEvent('#pl-wr-pg', 'change')
  await page.click('#pl-wr-go')
  await page.waitForSelector('#pl-wr-open')
  const ciInfo = await page.evaluate(() => { const m = PQ.openBuffer(PL.S.wr.result.bytes), cc = m.rowGroups[0].columns[0].cc; const ci = PQ.readColumnIndex(m.buf.subarray(cc.column_index_offset, cc.column_index_offset + cc.column_index_length)); return { stats: !!m.rowGroups[0].columns[0].md.statistics, mins: ci.min_values.map((b) => PQ.utf8(b)) } })
  assert(!ciInfo.stats && ciInfo.mins.join(',') === 'abc,abc,xyz,xyz', `关统计时页索引边界应是真实值：${JSON.stringify(ciInfo)}`)
  g = await gen()
  await page.click('#pl-wr-open')
  await page.waitForFunction((b) => document.body.dataset.file !== b && /^\d+$/.test(document.body.dataset.file), g)
  let r85 = await pushdown('s', '=', 'abc')
  assert(r85.verify.hits === 2 && r85.verify.missed === 0, `页索引不能把含 abc 的页跳过：命中 ${r85.verify.hits}、漏 ${r85.verify.missed}`)
  await onTab('wr')
  await page.check('#pl-wr-stats')
  await page.fill('#pl-wr-pg', '20000')
  await page.dispatchEvent('#pl-wr-pg', 'change')
  // 重写 Parquet 时 '' 与 null 不能混（Codex P1）；JSON 大整数不能在解析时被舍入（Codex P1）
  await page.uncheck('#pl-wr-emptynull')
  await page.fill('#pl-wr-text', '[{"s":"","id":9007199254740993},{"s":"x","id":-9007199254740995}]')
  await page.click('#pl-wr-parse')
  const big = await page.$$eval('#pl-wr-coltable tbody tr select', (s) => s.map((x) => x.value))
  assert(big.join(',') === 'string,int64', `大整数列应推断为 INT64：${big}`)
  await page.click('#pl-wr-go')
  await page.waitForSelector('#pl-wr-open')
  g = await gen()
  await page.click('#pl-wr-open')
  await page.waitForFunction((b) => document.body.dataset.file !== b && /^\d+$/.test(document.body.dataset.file), g)
  const bigRows = await page.evaluate(() => PQ.readAll(PL.S.meta).rows.map((r) => [r.s, String(r.id)]))
  assert(JSON.stringify(bigRows) === JSON.stringify([['', '9007199254740993'], ['x', '-9007199254740995']]), `JSON 大整数与空串写出后读回：${JSON.stringify(bigRows)}`)
  await onTab('wr')
  await page.click('#pl-wr-cur')
  await page.waitForSelector('#pl-wr-fromfile')
  await page.click('#pl-wr-go')
  await page.waitForSelector('#pl-wr-result')
  const rw = await page.evaluate(() => { const m = PQ.openBuffer(PL.S.wr.result.bytes); return { rows: PQ.readAll(m).rows.map((r) => [r.s, String(r.id)]), rep: m.leaves.map((l) => l.node.rep) } })
  assert(rw.rows[0][0] === '' && rw.rep[0] === 0 && rw.rows[1][1] === '-9007199254740995', `用当前文件重写：空串应仍是空串、列仍是 REQUIRED：${JSON.stringify(rw)}`)
  await page.check('#pl-wr-emptynull')
  // 浮点 -0.0：等值查询 = 0 不能被布隆过滤器跳过（Codex P1 / fork BUG-3）
  await page.check('#pl-wr-bloom')
  await page.fill('#pl-wr-text', '[{"x":-0.0},{"x":1.5}]')
  await page.click('#pl-wr-parse')
  await page.click('#pl-wr-go')
  await page.waitForSelector('#pl-wr-open')
  g = await gen()
  await page.click('#pl-wr-open')
  await page.waitForFunction((b) => document.body.dataset.file !== b && /^\d+$/.test(document.body.dataset.file), g)
  assert(await page.evaluate(() => PL.S.meta.rowGroups[0].columns[0].md.bloom_filter_offset != null), '这个文件应带布隆过滤器')
  r85 = await pushdown('x', '=', '0')
  assert(r85.verify.hits === 1 && r85.verify.missed === 0 && !r85.groups[0].skip, `-0.0 = 0 应命中 1 行且不被跳过：${JSON.stringify(r85.groups)}`)
  await onTab('wr')
  await page.uncheck('#pl-wr-bloom')
  // 在完整值里查找，不在截断的展示文字里找（Codex P2）
  await page.fill('#pl-wr-text', JSON.stringify([{ t: 'a'.repeat(500) + 'needle' }, { t: 'b' }]))
  await page.click('#pl-wr-parse')
  await page.click('#pl-wr-go')
  await page.waitForSelector('#pl-wr-open')
  g = await gen()
  await page.click('#pl-wr-open')
  await page.waitForFunction((b) => document.body.dataset.file !== b && /^\d+$/.test(document.body.dataset.file), g)
  g = await gen()
  await onTab('da')
  await waitData(g, 0, 0)
  await page.fill('#pl-da-q', 'needle')
  await page.waitForFunction((g) => (document.getElementById('pl-pane-da').dataset.key || '').endsWith(':needle') && (document.getElementById('pl-pane-da').dataset.key || '').startsWith(g + ':'), await gen())
  assert(/有 1 行匹配/.test(await page.textContent('#pl-da-info')), `第 501 个字符之后的关键词也要搜得到：${await page.textContent('#pl-da-info')}`)
  // FLOAT16 按数值比较，下推命中数对 pyarrow（Codex P1 / fork BUG-2）
  await openSample('nested')
  r85 = await pushdown('ratio', '>', '0.5')
  assert(r85.verify.hits === N.ratioGt && r85.verify.missed === 0, `FLOAT16 ratio > 0.5：页面 ${r85.verify.hits}（漏 ${r85.verify.missed}），pyarrow ${N.ratioGt}`)
  r85 = await pushdown('ratio', 'is null', '')
  assert(r85.verify.hits === N.ratioNull && r85.verify.missed === 0, `ratio is null：页面 ${r85.verify.hits}，pyarrow ${N.ratioNull}`)
  const unit = await page.evaluate(() => {
    const out = {}
    const f16 = { type: 7, typeLength: 2, logical: { kind: 'FLOAT16' } }
    out.f16 = [PQ.cmpRaw(f16, new Uint8Array([0x66, 0x3c]), new Uint8Array([0x00, 0x40])), PQ.cmpRaw(f16, new Uint8Array([0x00, 0xbc]), new Uint8Array([0x00, 0x3c]))]
    // 单页上限 / 页内值数（Codex P1）
    const w = PQ.writeParquet({ numRows: 3, columns: [{ name: 'a', type: 'int32', values: [1, 2, 3], nullable: false }] }, { codec: 0, pageIndex: false, crc: false })
    const m = PQ.openBuffer(w.bytes), c = m.rowGroups[0].columns[0], body = new Uint8Array(12)
    const mk = (u, n) => PQ.concat([PQ.thriftWrite('PageHeader', { type: 0, uncompressed_page_size: u, compressed_page_size: 12, data_page_header: { num_values: n, encoding: 0, definition_level_encoding: 3, repetition_level_encoding: 3 } }), body])
    let b = mk(2147483647, 3); c.start = 1000; c.end = 1000 + b.length; c.len = b.length
    out.cap = PQ.readChunk(b, 1000, m, 0, 0, {}).error || ''
    b = mk(12, 99); c.end = 1000 + b.length; c.len = b.length
    out.nv = PQ.readChunk(b, 1000, m, 0, 0, {}).error || ''
    // DELTA_BYTE_ARRAY 重建预算（Codex P1）
    const L = 1 << 20, n = 12, pre = [0].concat(new Array(n - 1).fill(L)), suf = [new Uint8Array(L).fill(97)].concat(new Array(n - 1).fill(new Uint8Array(0)))
    const enc = PQ.concat([PQ.encodeDeltaBinary(pre, false), PQ.encodeDeltaLength(suf)])
    const keep = PQ.MAX_RECON
    PQ.MAX_RECON = 8 << 20
    try { PQ.decodeDeltaByteArray(enc, 0, enc.length, n); out.dba = 'no error' } catch (e) { out.dba = e.message }
    PQ.MAX_RECON = keep
    out.dbaOk = PQ.decodeDeltaByteArray(enc, 0, enc.length, n).values.length
    // Thrift：未知 map 字段里的布尔键值各占一个字节（Codex P1）
    const kvb = new Uint8Array([0x18, 1, 0x6b, 0x0b, 0xc6, 0x01, 1, 0x11, 1, 2, 0x08, 0x04, 1, 0x76, 0])
    try { out.kv = PQ.thriftRead('KeyValue', kvb, 0, kvb.length).value } catch (e) { out.kv = e.message }
    // Thrift 列表元素线类型不符：抛带说明的错误，不留 undefined（fork BUG-4）
    try { PQ.thriftRead('FileMetaData', new Uint8Array([0x29, 0x15, 0x04, 0x00]), 0, 4); out.listErr = 'no error' } catch (e) { out.listErr = e.name + ':' + e.message }
    // 二进制导出不截断（Codex P1）
    out.bin = PQ.toJSONValue(new Uint8Array(100).fill(255))
    // P2：BOM 保留、MAP 标记不与字段名冲突、DECIMAL 注解校验、查询值范围、日期 / 偏移校验
    out.bom = PQ.utf8(new Uint8Array([0xEF, 0xBB, 0xBF, 0x78])).length
    const st = Object.assign(PQ.obj(), { __map: true, k: 1 })
    try { out.mapShow = PQ.show(st) + ' / ' + JSON.stringify(PQ.toJSONValue(st)) } catch (e) { out.mapShow = 'ERR ' + e.message }
    out.decBad = PQ.normLogical({ converted_type: 5, scale: 100000, precision: 3 })
    out.decBad2 = PQ.normLogical({ logicalType: { DECIMAL: { scale: 5, precision: 2 } } })
    const d1 = { type: 7, typeLength: 1, logical: { kind: 'DECIMAL', scale: 0, precision: 2 } }
    out.decRange = [PQ.parseInput(d1, '256').error || '', PQ.parseInput(d1, '-99').raw ? Array.from(PQ.parseInput(d1, '-99').raw) : null]
    out.ts = [PQ.parseTimestamp('2025-02-30 00:00:00', 'MICROS'), PQ.parseTimestamp('2025-01-01 00:00:00+08:99', 'MICROS'), String(PQ.parseTimestamp('2024-02-29 08:00:00+08:00', 'MICROS'))]
    out.date = PQ.parseInput({ type: 1, logical: { kind: 'DATE' } }, '2025-02-30').error || ''
    // P2：旧 LZ4 的 Hadoop 分块里可以有多个子块
    const txt = PQ.utf8Encode('parquet lab '.repeat(400)), h1 = txt.subarray(0, 2000), h2 = txt.subarray(2000)
    const c1 = PQ.lz4Compress(h1), c2 = PQ.lz4Compress(h2), be = (v) => new Uint8Array([v >>> 24, (v >>> 16) & 255, (v >>> 8) & 255, v & 255])
    const fr = PQ.concat([be(txt.length), be(c1.length), c1, be(c2.length), c2])
    const lz = PQ.lz4LegacyDecompress(fr, txt.length)
    out.lz4 = [lz.framing, PQ.bytesEq(lz.data, txt)]
    // P2：ZSTD 可跳过帧的负载越界
    const zf = new Uint8Array([0x28, 0xB5, 0x2F, 0xFD, 0x20, 3, 25, 0, 0, 97, 98, 99])
    const skip = (len) => PQ.concat([zf, new Uint8Array([0x50, 0x2A, 0x4D, 0x18, 100, 0, 0, 0]), new Uint8Array(len)])
    try { out.zskip = PQ.utf8(PQ.zstdDecompress(skip(100)).data) } catch (e) { out.zskip = e.message }
    try { PQ.zstdDecompress(skip(2)); out.zskipBad = 'no error' } catch (e) { out.zskipBad = e.message }
    return out
  })
  assert(unit.f16[0] < 0 && unit.f16[1] < 0, `FLOAT16 应按数值比较（1.1 < 2，-1 < 1）：${unit.f16}`)
  assert(/单页上限/.test(unit.cap) && /超过列块剩余/.test(unit.nv), `页声明的解压大小 / 值数要先过上限：${unit.cap} | ${unit.nv}`)
  assert(/累计超过/.test(unit.dba) && unit.dbaOk === 12, `DELTA_BYTE_ARRAY 重建预算：${unit.dba}，预算够时解出 ${unit.dbaOk} 个`)
  assert(unit.kv && unit.kv.key === 'k' && unit.kv.value === 'v', `跳过 map<bool,bool> 后应继续读到 value：${JSON.stringify(unit.kv)}`)
  assert(/^PQError:.*列表元素类型不符/.test(unit.listErr), `列表元素线类型不符应抛 PQError：${unit.listErr}`)
  assert(unit.bin.length === 202 && unit.bin.indexOf('…') < 0, `100 字节二进制导出应是完整十六进制：${unit.bin.length}`)
  assert(unit.bom === 2, 'UTF-8 解码应保留开头的 U+FEFF')
  assert(/"__map": true/.test(unit.mapShow) && !/^ERR/.test(unit.mapShow), `名为 __map 的结构体字段不能被当成 MAP：${unit.mapShow}`)
  assert(unit.decBad === null && unit.decBad2 === null, 'scale 不合法的 DECIMAL 注解应被忽略')
  assert(/超出/.test(unit.decRange[0]) && JSON.stringify(unit.decRange[1]) === '[157]', `DECIMAL(2,0) 存在 1 字节里：256 应报错、-99 应是 0x9d：${JSON.stringify(unit.decRange)}`)
  assert(unit.ts[0] === null && unit.ts[1] === null && unit.ts[2] === '1709164800000000', `日期 / 偏移校验：${JSON.stringify(unit.ts)}`)
  assert(/没有这一天/.test(unit.date), `DATE 谓词 2025-02-30 应报错：${unit.date}`)
  assert(unit.lz4[0] === 'Hadoop 分块' && unit.lz4[1] === true, `Hadoop 多子块：${unit.lz4}`)
  assert(unit.zskip === 'abc' && /可跳过帧/.test(unit.zskipBad), `ZSTD 可跳过帧：${unit.zskip} | ${unit.zskipBad}`)
  // JSON 列名不能和 Object 原型成员冲突（Codex P2）
  await onTab('wr')
  await page.fill('#pl-wr-text', '[{"id":1,"constructor":"A","__proto__":"B","toString":"C"}]')
  await page.click('#pl-wr-parse')
  const protoCols = await page.$$eval('#pl-wr-coltable tbody tr td:first-child', (t) => t.map((x) => x.textContent))
  assert(protoCols.join(',') === 'id,constructor,__proto__,toString', `原型同名列应全部保留：${protoCols}`)
  // 历史上限统一 200；只导入部分偏好不重置其余设置；打开文件时快照失败要提示（Codex P2）
  await page.selectOption('#pl-wr-codec', '7')
  await onTab('hi')
  const many = Array.from({ length: 120 }, (_, i) => ({ id: 'bulk-' + i, name: 'bulk' + i + '.parquet', size: i, rows: i, rowGroups: 1, createdBy: 'bulk', at: new Date(Date.UTC(2026, 0, 1, 0, i)).toISOString(), codecs: [], fields: [] }))
  await page.setInputFiles('#pl-hi-file', { name: 'bulk.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ snapshots: many, prefs: { pageSize: 200 } })) })
  await page.waitForFunction(() => /导入 120 条/.test(document.getElementById('pl-hi-msg').textContent))
  assert(await page.evaluate(() => PL.S.prefs.writer.codec) === 7 && await page.evaluate(() => PL.S.prefs.pageSize) === 200, '只导入 pageSize 时写出选项应保持不变')
  const nHist = await page.evaluate(() => PL.S.history.length)
  await openSample('legacy_int96')
  const nHist2 = await page.evaluate(() => JSON.parse(localStorage.getItem('pqlab.history.v1')).length)
  assert(nHist >= 120 && nHist2 >= nHist, `导入 120 条后再打开文件，历史不应被截到 50：${nHist} → ${nHist2}`)
  await page.evaluate(() => { window.__set2 = Storage.prototype.setItem; Storage.prototype.setItem = function () { throw new DOMException('quota', 'QuotaExceededError') } })
  await openSample('duckdb_events')
  assert(/没能存进本机/.test(await page.textContent('#pl-status')), `打开文件时快照失败应在状态里说明：${await page.textContent('#pl-status')}`)
  await page.evaluate(() => { Storage.prototype.setItem = window.__set2 })
  await onTab('hi')
  await page.click('#pl-hi-clear')
  await page.click('#pl-hi-clear')
  await page.waitForSelector('#pl-hi-empty')

  // ── 9. 渲染守卫（订单示例 + 下推结果都在） ──
  await openSample('orders')
  await pushdown('paid_at', '<', '2026-01-20 00:00:00')
  await onTab('en')
  await page.click('#pl-en-run')
  await page.waitForFunction(() => /:done$/.test(document.getElementById('pl-pane-en').dataset.key || ''))
  await onTab('ly')
  await page.click('#pl-ly-table tr[data-p="1"]')
  await page.waitForSelector('#pl-ly-detail')
  await onTab('wr')
  await page.click('#pl-wr-sample')
  await page.click('#pl-wr-go')
  await page.waitForSelector('#pl-wr-result')
  const nCtl = await renderGuards(page, {
    assert, tabs: TABS, onTab, paneSel: (t) => `#pl-pane-${t}`, panesRoot: '#pl-panes',
    figSel: (t) => `#pl-pane-${t} svg`, cardSel: '.pl-card', childSel: 'h2,h3,p,.pl-scroll,.pl-hex,.pl-pre,.pl-map,.pl-bars,.pl-tools',
    minControls: 60, labelSel: 'th, dt, label, label > span, .pl-cap',
  })
  assert(nCtl >= 60, `各页签累计控件 ${nCtl}`)
  for (const [host, n] of [['#pl-drop', 5], ['#pl-filebar', 1]]) await guardControlSize(page, { assert, tabs: [host], onTab: async () => {}, paneSel: (h) => h, minControls: n })
  await onTab('ov')
  await guardBoxOverlap(page, { assert, sel: '#pl-tabs .pl-tab, #pl-fchips .pl-chip, #pl-ov-kpis .pl-kpi, #pl-samples .pl-btn2' })
  await onTab('da')
  await guardBoxOverlap(page, { assert, sel: '#pl-da-cols .pl-ghost, #pl-da-body .pl-btn2' })
  // 几何：字节地图各段宽度按字节比例，且铺满整条
  await onTab('ov')
  const map = await page.evaluate(() => {
    const m = document.getElementById('pl-ov-map'), W = m.getBoundingClientRect().width
    const segs = Array.from(m.children).map((s) => ({ w: s.getBoundingClientRect().width, t: s.title }))
    return { W, segs, size: PL.S.meta.fileSize, rg0: PL.S.meta.rowGroups[0].columns.reduce((a, c) => a + c.len, 0) }
  })
  assert(map.W >= 600, `字节地图宽度 ${map.W}`)
  const sumW = map.segs.reduce((a, s) => a + s.w, 0)
  assert(Math.abs(sumW - map.W) <= 3, `字节地图各段宽度之和 ${sumW} 应铺满 ${map.W}`)
  const rgSeg = map.segs.find((s) => /^行组 0 /.test(s.t))
  assert(rgSeg && Math.abs(rgSeg.w - map.W * map.rg0 / map.size) <= 4, `行组 0 段宽 ${rgSeg && rgSeg.w} 应≈ ${map.W * map.rg0 / map.size}`)
  const bars = await page.$$eval('#pl-ov-bars .pl-bar', (bs) => bs.map((b) => ({ c: b.querySelector('.pl-bar-c').getBoundingClientRect().width, u: b.querySelector('.pl-bar-u').getBoundingClientRect().width, t: b.querySelector('.pl-bar-track').getBoundingClientRect().width })))
  assert(bars.length === 10 && bars.every((b) => b.t >= 200), `应有 10 条列大小条，轨道宽 ${bars.map((b) => b.t)}`)
  assert(bars[0].c >= bars[bars.length - 1].c, '列大小按压缩后大小降序排列')
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.mouse.move(640, 840) // 鼠标移开页签，缩略图里显示选中态而不是悬停态
  await screenshot('thumb.png')
}
