// Proto Lab 集成测试。真值全部来自 run 目录 toracle/gen_truth.py：只调 protoc 35.1 / Python protobuf 7.36（upb）/
// buf 1.75.0 / struct，外加一个不经过页面引擎的 Python 线格式遍历器（体积统计）；示例输入由 toracle/extract.mjs
// 从 pl-app.js 机械抽出。下面的 ORACLE 块由 tools/inject-oracle.mjs 机械注入，一个数都不手打。
import { renderGuards, guardBoxOverlap, guardControlSize } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const ORACLE = {
 "meta": {
  "protoc": "libprotoc 35.1",
  "python_protobuf": "7.36.2",
  "buf": "1.75.0"
 },
 "decode": {
  "order": {
   "len": 187,
   "text": "order_id: \"SO-20261118-0042\"\nuser_id: 8800123456789\nitems {\n  sku: \"TEA-LJ-250\"\n  title: \"\\346\\230\\216\\345\\211\\215\\351\\276\\231\\344\\272\\225 250g\"\n  quantity: 2\n  unit_price {\n    currency_code: \"CNY\"\n    units: 168\n    nanos: 500000000\n  }\n}\nitems {\n  sku: \"CUP-GL-02\"\n  title: \"\\347\\216\\273\\347\\222\\203\\346\\235\\257\"\n  quantity: 1\n  unit_price {\n    currency_code: \"CNY\"\n    units: 39\n  }\n}\ntotal {\n  currency_code: \"CNY\"\n  units: 376\n}\nstatus: STATUS_PAID\ntags {\n  key: \"campaign\"\n  value: \"double-11\"\n}\ntags {\n  key: \"gift\"\n  value: \"yes\"\n}\nwallet: \"alipay\"\ncreated_at {\n  seconds: 1794985200\n}\nchannel: CHANNEL_MINI_PROGRAM\npromo_ids: 12\npromo_ids: 305\npromo_ids: 7\nbalance_delta: -150\n",
   "json": {
    "orderId": "SO-20261118-0042",
    "userId": "8800123456789",
    "items": [
     {
      "sku": "TEA-LJ-250",
      "title": "明前龙井 250g",
      "quantity": 2,
      "unitPrice": {
       "currencyCode": "CNY",
       "units": "168",
       "nanos": 500000000
      }
     },
     {
      "sku": "CUP-GL-02",
      "title": "玻璃杯",
      "quantity": 1,
      "unitPrice": {
       "currencyCode": "CNY",
       "units": "39"
      }
     }
    ],
    "total": {
     "currencyCode": "CNY",
     "units": "376"
    },
    "status": "STATUS_PAID",
    "tags": {
     "gift": "yes",
     "campaign": "double-11"
    },
    "wallet": "alipay",
    "createdAt": "2026-11-18T07:00:00Z",
    "channel": "CHANNEL_MINI_PROGRAM",
    "promoIds": [
     12,
     305,
     7
    ],
    "balanceDelta": -150
   },
   "jsonProto": {
    "order_id": "SO-20261118-0042",
    "user_id": "8800123456789",
    "items": [
     {
      "sku": "TEA-LJ-250",
      "title": "明前龙井 250g",
      "quantity": 2,
      "unit_price": {
       "currency_code": "CNY",
       "units": "168",
       "nanos": 500000000
      }
     },
     {
      "sku": "CUP-GL-02",
      "title": "玻璃杯",
      "quantity": 1,
      "unit_price": {
       "currency_code": "CNY",
       "units": "39"
      }
     }
    ],
    "total": {
     "currency_code": "CNY",
     "units": "376"
    },
    "status": "STATUS_PAID",
    "tags": {
     "gift": "yes",
     "campaign": "double-11"
    },
    "wallet": "alipay",
    "created_at": "2026-11-18T07:00:00Z",
    "channel": "CHANNEL_MINI_PROGRAM",
    "promo_ids": [
     12,
     305,
     7
    ],
    "balance_delta": -150
   },
   "jsonDefaults": {
    "orderId": "SO-20261118-0042",
    "userId": "8800123456789",
    "items": [
     {
      "sku": "TEA-LJ-250",
      "title": "明前龙井 250g",
      "quantity": 2,
      "unitPrice": {
       "currencyCode": "CNY",
       "units": "168",
       "nanos": 500000000
      }
     },
     {
      "sku": "CUP-GL-02",
      "title": "玻璃杯",
      "quantity": 1,
      "unitPrice": {
       "currencyCode": "CNY",
       "units": "39",
       "nanos": 0
      }
     }
    ],
    "total": {
     "currencyCode": "CNY",
     "units": "376",
     "nanos": 0
    },
    "status": "STATUS_PAID",
    "tags": {
     "gift": "yes",
     "campaign": "double-11"
    },
    "wallet": "alipay",
    "createdAt": "2026-11-18T07:00:00Z",
    "channel": "CHANNEL_MINI_PROGRAM",
    "promoIds": [
     12,
     305,
     7
    ],
    "balanceDelta": -150
   },
   "jsonEnumInt": {
    "orderId": "SO-20261118-0042",
    "userId": "8800123456789",
    "items": [
     {
      "sku": "TEA-LJ-250",
      "title": "明前龙井 250g",
      "quantity": 2,
      "unitPrice": {
       "currencyCode": "CNY",
       "units": "168",
       "nanos": 500000000
      }
     },
     {
      "sku": "CUP-GL-02",
      "title": "玻璃杯",
      "quantity": 1,
      "unitPrice": {
       "currencyCode": "CNY",
       "units": "39"
      }
     }
    ],
    "total": {
     "currencyCode": "CNY",
     "units": "376"
    },
    "status": 2,
    "tags": {
     "gift": "yes",
     "campaign": "double-11"
    },
    "wallet": "alipay",
    "createdAt": "2026-11-18T07:00:00Z",
    "channel": 3,
    "promoIds": [
     12,
     305,
     7
    ],
    "balanceDelta": -150
   },
   "jsonBytes": 536,
   "b64": "ChBTTy0yMDI2MTExOC0wMDQyEJWa7oGPgAIaMQoKVEVBLUxKLTI1MBIR5piO5YmN6b6Z5LqVIDI1MGcYAiIOCgNDTlkQqAEYgMq17gEaIQoJQ1VQLUdMLTAyEgnnjrvnkoPmna8YASIHCgNDTlkQJyIICgNDTlkQ+AIoAjILCgRnaWZ0EgN5ZXMyFQoIY2FtcGFpZ24SCWRvdWJsZS0xMUIGYWxpcGF5SgYI8Jn11wZQA2IEDLECB2irAg==",
   "truncFails": true,
   "truncErr": "Failed to parse input."
  },
  "grpcweb": {
   "len": 158,
   "frames": [
    {
     "flag": 0,
     "len": 118
    },
    {
     "flag": 128,
     "len": 30
    }
   ],
   "text1": "order_id: \"SO-20261118-0007\"\nuser_id: 8800123456789\nitems {\n  sku: \"BK-PB-01\"\n  title: \"Protocol Buffers \\346\\214\\207\\345\\215\\227\"\n  quantity: 1\n  unit_price {\n    currency_code: \"CNY\"\n    units: 59\n    nanos: 900000000\n  }\n}\ntotal {\n  currency_code: \"CNY\"\n  units: 59\n  nanos: 900000000\n}\nstatus: STATUS_SHIPPED\ncard_last4: \"4242\"\ncreated_at {\n  seconds: 1794978000\n  nanos: 250000000\n}\nchannel: CHANNEL_WEB\n",
   "trailer": "grpc-status:0\r\ngrpc-message:\r\n",
   "json1": {
    "orderId": "SO-20261118-0007",
    "userId": "8800123456789",
    "items": [
     {
      "sku": "BK-PB-01",
      "title": "Protocol Buffers 指南",
      "quantity": 1,
      "unitPrice": {
       "currencyCode": "CNY",
       "units": "59",
       "nanos": 900000000
      }
     }
    ],
    "total": {
     "currencyCode": "CNY",
     "units": "59",
     "nanos": 900000000
    },
    "status": "STATUS_SHIPPED",
    "cardLast4": "4242",
    "createdAt": "2026-11-18T05:00:00.250Z",
    "channel": "CHANNEL_WEB"
   },
   "json1Defaults": {
    "orderId": "SO-20261118-0007",
    "userId": "8800123456789",
    "items": [
     {
      "sku": "BK-PB-01",
      "title": "Protocol Buffers 指南",
      "quantity": 1,
      "unitPrice": {
       "currencyCode": "CNY",
       "units": "59",
       "nanos": 900000000
      }
     }
    ],
    "total": {
     "currencyCode": "CNY",
     "units": "59",
     "nanos": 900000000
    },
    "status": "STATUS_SHIPPED",
    "cardLast4": "4242",
    "createdAt": "2026-11-18T05:00:00.250Z",
    "channel": "CHANNEL_WEB",
    "tags": {},
    "promoIds": [],
    "balanceDelta": 0
   }
  },
  "legacy": {
   "len": 170,
   "text": "query: \"protobuf varint\"\npage_number: 2\nResult {\n  url: \"https://protobuf.dev/programming-guides/encoding/\"\n  title: \"Encoding\"\n  snippets: \"varints\"\n  snippets: \"zigzag\"\n}\nResult {\n  url: \"https://example.com/a\"\n}\nsample_ids: 3\nsample_ids: 270\nsample_ids: 86942\ntimings_ns: -1500\ntimings_ns: 42\n[legacy.trace_id]: \"req-7f3a\"\n4: 9\n15: \"hello\"\n",
   "unknown": 2,
   "json": {
    "query": "protobuf varint",
    "pageNumber": 2,
    "result": [
     {
      "url": "https://protobuf.dev/programming-guides/encoding/",
      "title": "Encoding",
      "snippets": [
       "varints",
       "zigzag"
      ]
     },
     {
      "url": "https://example.com/a"
     }
    ],
    "sampleIds": [
     3,
     270,
     86942
    ],
    "timingsNs": [
     "-1500",
     "42"
    ],
    "[legacy.trace_id]": "req-7f3a"
   }
  },
  "raw": {
   "len": 53,
   "text": "1: \"click\"\n2: 1794985200123\n3 {\n  1: \"home/feed\"\n  2: 3\n}\n4: 0x3fe0000000000000\n5: \"\\001\\002\\254\\002\"\n6 {\n  9: 105\n}\n7: 0xdeadbeef\n"
  },
  "tiny": {
   "text": "1: 150\n"
  }
 },
 "size": {
  "order": {
   "order_id": {
    "count": 1,
    "self": 18,
    "total": 18
   },
   "user_id": {
    "count": 1,
    "self": 8,
    "total": 8
   },
   "items.sku": {
    "count": 2,
    "self": 23,
    "total": 23
   },
   "items.title": {
    "count": 2,
    "self": 30,
    "total": 30
   },
   "items.quantity": {
    "count": 2,
    "self": 4,
    "total": 4
   },
   "items.unit_price.currency_code": {
    "count": 2,
    "self": 10,
    "total": 10
   },
   "items.unit_price.units": {
    "count": 2,
    "self": 5,
    "total": 5
   },
   "items.unit_price.nanos": {
    "count": 1,
    "self": 6,
    "total": 6
   },
   "items.unit_price": {
    "count": 2,
    "self": 4,
    "total": 25
   },
   "items": {
    "count": 2,
    "self": 4,
    "total": 86
   },
   "total.currency_code": {
    "count": 1,
    "self": 5,
    "total": 5
   },
   "total.units": {
    "count": 1,
    "self": 3,
    "total": 3
   },
   "total": {
    "count": 1,
    "self": 2,
    "total": 10
   },
   "status": {
    "count": 1,
    "self": 2,
    "total": 2
   },
   "tags.key": {
    "count": 2,
    "self": 16,
    "total": 16
   },
   "tags.value": {
    "count": 2,
    "self": 16,
    "total": 16
   },
   "tags": {
    "count": 2,
    "self": 4,
    "total": 36
   },
   "wallet": {
    "count": 1,
    "self": 8,
    "total": 8
   },
   "created_at.seconds": {
    "count": 1,
    "self": 6,
    "total": 6
   },
   "created_at": {
    "count": 1,
    "self": 2,
    "total": 8
   },
   "channel": {
    "count": 1,
    "self": 2,
    "total": 2
   },
   "promo_ids": {
    "count": 1,
    "self": 6,
    "total": 6
   },
   "balance_delta": {
    "count": 1,
    "self": 3,
    "total": 3
   }
  },
  "total": 187,
  "legacyTimingsSave": 13,
  "legacyTimings": [
   -1500,
   42
  ]
 },
 "encode": {
  "hex": "0a 10 53 4f 2d 32 30 32 36 31 31 31 38 2d 30 30 39 39 10 95 9a ee 81 8f 80 02 1a 31 0a 0a 54 45 41 2d 4c 4a 2d 32 35 30 12 11 e6 98 8e e5 89 8d e9 be 99 e4 ba 95 20 32 35 30 67 18 01 22 0e 0a 03 43 4e 59 10 a8 01 18 80 ca b5 ee 01 28 01 32 12 0a 08 63 61 6d 70 61 69 67 6e 12 06 73 70 72 69 6e 67 32 0a 0a 04 67 69 66 74 12 02 6e 6f 3a 04 34 32 34 32 4a 06 08 f0 99 f5 d7 06 62 03 01 ac 02 68 01",
  "len": 132,
  "jsonBytes": 352,
  "text": "order_id: \"SO-20261118-0099\"\nuser_id: 8800123456789\nitems {\n  sku: \"TEA-LJ-250\"\n  title: \"\\346\\230\\216\\345\\211\\215\\351\\276\\231\\344\\272\\225 250g\"\n  quantity: 1\n  unit_price {\n    currency_code: \"CNY\"\n    units: 168\n    nanos: 500000000\n  }\n}\nstatus: STATUS_PENDING\ntags {\n  key: \"campaign\"\n  value: \"spring\"\n}\ntags {\n  key: \"gift\"\n  value: \"no\"\n}\ncard_last4: \"4242\"\ncreated_at {\n  seconds: 1794985200\n}\npromo_ids: 1\npromo_ids: 300\nbalance_delta: -1\n",
  "textEncodeHex": "0a 10 53 4f 2d 32 30 32 36 31 31 31 38 2d 30 30 39 39 10 95 9a ee 81 8f 80 02 1a 31 0a 0a 54 45 41 2d 4c 4a 2d 32 35 30 12 11 e6 98 8e e5 89 8d e9 be 99 e4 ba 95 20 32 35 30 67 18 01 22 0e 0a 03 43 4e 59 10 a8 01 18 80 ca b5 ee 01 28 01 32 12 0a 08 63 61 6d 70 61 69 67 6e 12 06 73 70 72 69 6e 67 32 0a 0a 04 67 69 66 74 12 02 6e 6f 3a 04 34 32 34 32 4a 06 08 f0 99 f5 d7 06 62 03 01 ac 02 68 01",
  "b64": "ChBTTy0yMDI2MTExOC0wMDk5EJWa7oGPgAIaMQoKVEVBLUxKLTI1MBIR5piO5YmN6b6Z5LqVIDI1MGcYASIOCgNDTlkQqAEYgMq17gEoATISCghjYW1wYWlnbhIGc3ByaW5nMgoKBGdpZnQSAm5vOgQ0MjQySgYI8Jn11wZiAwGsAmgB",
  "go": "[]byte{0x0a, 0x10, 0x53, 0x4f, 0x2d, 0x32, 0x30, 0x32, 0x36, 0x31, 0x31, 0x31, 0x38, 0x2d, 0x30, 0x30, 0x39, 0x39, 0x10, 0x95, 0x9a, 0xee, 0x81, 0x8f, 0x80, 0x02, 0x1a, 0x31, 0x0a, 0x0a, 0x54, 0x45, 0x41, 0x2d, 0x4c, 0x4a, 0x2d, 0x32, 0x35, 0x30, 0x12, 0x11, 0xe6, 0x98, 0x8e, 0xe5, 0x89, 0x8d, 0xe9, 0xbe, 0x99, 0xe4, 0xba, 0x95, 0x20, 0x32, 0x35, 0x30, 0x67, 0x18, 0x01, 0x22, 0x0e, 0x0a, 0x03, 0x43, 0x4e, 0x59, 0x10, 0xa8, 0x01, 0x18, 0x80, 0xca, 0xb5, 0xee, 0x01, 0x28, 0x01, 0x32, 0x12, 0x0a, 0x08, 0x63, 0x61, 0x6d, 0x70, 0x61, 0x69, 0x67, 0x6e, 0x12, 0x06, 0x73, 0x70, 0x72, 0x69, 0x6e, 0x67, 0x32, 0x0a, 0x0a, 0x04, 0x67, 0x69, 0x66, 0x74, 0x12, 0x02, 0x6e, 0x6f, 0x3a, 0x04, 0x34, 0x32, 0x34, 0x32, 0x4a, 0x06, 0x08, 0xf0, 0x99, 0xf5, 0xd7, 0x06, 0x62, 0x03, 0x01, 0xac, 0x02, 0x68, 0x01}",
  "py": "b'\\x0a\\x10\\x53\\x4f\\x2d\\x32\\x30\\x32\\x36\\x31\\x31\\x31\\x38\\x2d\\x30\\x30\\x39\\x39\\x10\\x95\\x9a\\xee\\x81\\x8f\\x80\\x02\\x1a\\x31\\x0a\\x0a\\x54\\x45\\x41\\x2d\\x4c\\x4a\\x2d\\x32\\x35\\x30\\x12\\x11\\xe6\\x98\\x8e\\xe5\\x89\\x8d\\xe9\\xbe\\x99\\xe4\\xba\\x95\\x20\\x32\\x35\\x30\\x67\\x18\\x01\\x22\\x0e\\x0a\\x03\\x43\\x4e\\x59\\x10\\xa8\\x01\\x18\\x80\\xca\\xb5\\xee\\x01\\x28\\x01\\x32\\x12\\x0a\\x08\\x63\\x61\\x6d\\x70\\x61\\x69\\x67\\x6e\\x12\\x06\\x73\\x70\\x72\\x69\\x6e\\x67\\x32\\x0a\\x0a\\x04\\x67\\x69\\x66\\x74\\x12\\x02\\x6e\\x6f\\x3a\\x04\\x34\\x32\\x34\\x32\\x4a\\x06\\x08\\xf0\\x99\\xf5\\xd7\\x06\\x62\\x03\\x01\\xac\\x02\\x68\\x01'",
  "c": "\"\\n\\020SO-20261118-0099\\020\\225\\232\\356\\201\\217\\200\\002\\0321\\n\\nTEA-LJ-250\\022\\021\\346\\230\\216\\345\\211\\215\\351\\276\\231\\344\\272\\225 250g\\030\\001\\\"\\016\\n\\003CNY\\020\\250\\001\\030\\200\\312\\265\\356\\001(\\0012\\022\\n\\010campaign\\022\\006spring2\\n\\n\\004gift\\022\\002no:\\0044242J\\006\\010\\360\\231\\365\\327\\006b\\003\\001\\254\\002h\\001\"",
  "unknownRejected": true,
  "unknownErr": "Message type \"shop.v1.Order\" has no field named \"fooBar\" at \"Order\".\n Available Fields(except extensions): \"['orderId', 'userId', 'items', 'total', 'status', 'tags', 'cardLast4', 'wallet', 'createdAt', 'channel', 'coupon', 'promoIds', 'balanceDelta']\"",
  "badJson": "{\n  \"fooBar\": 1,\n  \"orderId\": \"SO-20261118-0099\",\n  \"userId\": \"8800123456789\",\n  \"items\": [\n    { \"sku\": \"TEA-LJ-250\", \"title\": \"明前龙井 250g\", \"quantity\": 1,\n      \"unitPrice\": { \"currencyCode\": \"CNY\", \"units\": \"168\", \"nanos\": 500000000 } }\n  ],\n  \"status\": \"STATUS_PENDING\",\n  \"tags\": { \"gift\": \"no\", \"campaign\": \"spring\" },\n  \"cardLast4\": \"4242\",\n  \"createdAt\": \"2026-11-18T07:00:00Z\",\n  \"promoIds\": [1, 300],\n  \"balanceDelta\": -1\n}\n",
  "ignoreHex": "0a 10 53 4f 2d 32 30 32 36 31 31 31 38 2d 30 30 39 39 10 95 9a ee 81 8f 80 02 1a 31 0a 0a 54 45 41 2d 4c 4a 2d 32 35 30 12 11 e6 98 8e e5 89 8d e9 be 99 e4 ba 95 20 32 35 30 67 18 01 22 0e 0a 03 43 4e 59 10 a8 01 18 80 ca b5 ee 01 28 01 32 12 0a 08 63 61 6d 70 61 69 67 6e 12 06 73 70 72 69 6e 67 32 0a 0a 04 67 69 66 74 12 02 6e 6f 3a 04 34 32 34 32 4a 06 08 f0 99 f5 d7 06 62 03 01 ac 02 68 01"
 },
 "schema": {
  "dupNumber": {
   "file": "shop/order.proto",
   "old": "Money total = 4;",
   "new": "Money total = 3;",
   "fails": true,
   "line": 12,
   "stderr": "shop/order.proto:12:17: Field number 3 has already been used in \"shop.v1.Order\" by field \"items\". Next available field number is 4."
  },
  "undefType": {
   "file": "shop/order.proto",
   "old": "Channel channel = 10;",
   "new": "Chanel channel = 10;",
   "fails": true,
   "line": 20,
   "stderr": "shop/order.proto:20:3: \"Chanel\" is not defined."
  },
  "proto3Required": {
   "file": "shop/common.proto",
   "old": "int64 units = 2;",
   "new": "required int64 units = 2;",
   "fails": true,
   "line": 8,
   "stderr": "shop/common.proto:8:12: Required fields are not allowed in proto3."
  }
 },
 "compat": {
  "sample": {
   "old": "syntax = \"proto3\";\n\npackage shop;\n\nmessage Order {\n  int64 id = 1;\n  string note = 2;\n  repeated int32 qty = 3;\n  int32 total = 4;\n  oneof pay {\n    string card = 5;\n    string cash = 6;\n  }\n  Status status = 7;\n  reserved 20 to 25;\n}\n\nenum Status {\n  UNKNOWN = 0;\n  PAID = 1;\n  SHIPPED = 2;\n}\n\nservice S {\n  rpc Get (Order) returns (Order);\n}\n",
   "new": "syntax = \"proto3\";\n\npackage shop;\n\nmessage Order {\n  int64 id = 1;\n  string remark = 2;\n  int32 qty = 3;\n  int64 total = 4;\n  string card = 5;\n  oneof pay {\n    string cash = 6;\n  }\n  Status status = 7;\n  reserved 20 to 22;\n}\n\nenum Status {\n  UNKNOWN = 0;\n  DONE = 1;\n}\n\nservice S {\n  rpc Get (stream Order) returns (Order);\n}\n",
   "WIRE": [
    {
     "rule": "RESERVED_MESSAGE_NO_DELETE",
     "line": 5,
     "msg": "Previously present reserved range \"[20,25]\" on message \"Order\" is missing values: [23,25] were removed."
    },
    {
     "rule": "FIELD_WIRE_COMPATIBLE_CARDINALITY",
     "line": 8,
     "msg": "Field \"3\" with name \"qty\" on message \"Order\" changed cardinality from \"repeated\" to \"optional with implicit presence\"."
    },
    {
     "rule": "FIELD_SAME_ONEOF",
     "line": 10,
     "msg": "Field \"5\" with name \"card\" on message \"Order\" moved from inside to outside a oneof."
    },
    {
     "rule": "ENUM_VALUE_NO_DELETE_UNLESS_NUMBER_RESERVED",
     "line": 18,
     "msg": "Previously present enum value \"2\" on enum \"Status\" was deleted without reserving the number \"2\"."
    },
    {
     "rule": "RPC_SAME_CLIENT_STREAMING",
     "line": 24,
     "msg": "RPC \"Get\" on service \"S\" changed from client unary to client streaming."
    }
   ],
   "WIRE_JSON": [
    {
     "rule": "RESERVED_MESSAGE_NO_DELETE",
     "line": 5,
     "msg": "Previously present reserved range \"[20,25]\" on message \"Order\" is missing values: [23,25] were removed."
    },
    {
     "rule": "FIELD_SAME_JSON_NAME",
     "line": 7,
     "msg": "Field \"2\" with name \"remark\" on message \"Order\" changed option \"json_name\" from \"note\" to \"remark\"."
    },
    {
     "rule": "FIELD_SAME_NAME",
     "line": 7,
     "msg": "Field \"2\" on message \"Order\" changed name from \"note\" to \"remark\"."
    },
    {
     "rule": "FIELD_WIRE_JSON_COMPATIBLE_CARDINALITY",
     "line": 8,
     "msg": "Field \"3\" with name \"qty\" on message \"Order\" changed cardinality from \"repeated\" to \"optional with implicit presence\"."
    },
    {
     "rule": "FIELD_WIRE_JSON_COMPATIBLE_TYPE",
     "line": 9,
     "msg": "Field \"4\" with name \"total\" on message \"Order\" changed type from \"int32\" to \"int64\". See https://developers.google.com/protocol-buffers/docs/proto3#updating for wire compatibility rules and https://developers.google.com/protocol-buffers/docs/proto3#json for JSON compatibility rules."
    },
    {
     "rule": "FIELD_SAME_ONEOF",
     "line": 10,
     "msg": "Field \"5\" with name \"card\" on message \"Order\" moved from inside to outside a oneof."
    },
    {
     "rule": "ENUM_VALUE_NO_DELETE_UNLESS_NAME_RESERVED",
     "line": 18,
     "msg": "Previously present enum value \"2\" on enum \"Status\" was deleted without reserving the name \"SHIPPED\"."
    },
    {
     "rule": "ENUM_VALUE_NO_DELETE_UNLESS_NUMBER_RESERVED",
     "line": 18,
     "msg": "Previously present enum value \"2\" on enum \"Status\" was deleted without reserving the number \"2\"."
    },
    {
     "rule": "ENUM_VALUE_SAME_NAME",
     "line": 20,
     "msg": "Enum value \"1\" on enum \"Status\" changed name from \"PAID\" to \"DONE\"."
    },
    {
     "rule": "RPC_SAME_CLIENT_STREAMING",
     "line": 24,
     "msg": "RPC \"Get\" on service \"S\" changed from client unary to client streaming."
    }
   ]
  },
  "kitchen": {
   "old": "syntax = \"proto2\";\n\npackage ks;\n\nmessage Item {\n  required string id = 1;\n  optional int32 count = 2 [default = 1];\n  repeated int32 tags = 3;\n  optional int32 score = 4;\n  optional string note = 5;\n  optional string memo = 6;\n  optional int64 ts = 7;\n  optional string extra = 8;\n  oneof kind {\n    string a = 9;\n    string b = 10;\n  }\n  optional string loose = 11;\n  optional int32 legacy = 12;\n  reserved 50 to 60;\n  reserved \"gone\";\n}\n\nenum Level {\n  LOW = 0;\n  MID = 1;\n  HIGH = 2;\n  MAX = 3;\n  reserved 10 to 20;\n  reserved \"OLD\";\n}\n\nmessage Req {}\nmessage Resp {}\nmessage Other {}\n\nservice Svc {\n  rpc Call (Req) returns (Resp);\n  rpc Stream (Req) returns (Resp);\n  rpc Read (Req) returns (Resp) {\n    option idempotency_level = NO_SIDE_EFFECTS;\n  }\n  rpc Out (Req) returns (stream Resp);\n}\n",
   "new": "syntax = \"proto2\";\n\npackage ks;\n\nmessage Item {\n  optional string id = 1;\n  optional int32 count = 2 [default = 5];\n  optional int32 tags = 3;\n  optional string score = 4;\n  optional string remark = 5;\n  optional string memo = 6 [json_name = \"m\"];\n  optional uint64 ts = 7;\n  oneof kind {\n    string a = 9;\n    string b = 10;\n    string loose = 11;\n  }\n  optional sint32 legacy = 12;\n  reserved 50 to 55;\n}\n\nenum Level {\n  LOW = 0;\n  MEDIUM = 1;\n  HIGH = 2;\n  reserved 10 to 15;\n}\n\nmessage Req {}\nmessage Resp {}\nmessage Other {}\n\nservice Svc {\n  rpc Call (Other) returns (Other);\n  rpc Stream (stream Req) returns (Resp);\n  rpc Read (Req) returns (Resp) {\n    option idempotency_level = IDEMPOTENT;\n  }\n  rpc Out (Req) returns (Resp);\n}\n",
   "WIRE": [
    {
     "rule": "FIELD_NO_DELETE_UNLESS_NUMBER_RESERVED",
     "line": 5,
     "msg": "Previously present field \"8\" with name \"extra\" on message \"Item\" was deleted without reserving the number \"8\"."
    },
    {
     "rule": "MESSAGE_SAME_REQUIRED_FIELDS",
     "line": 5,
     "msg": "Message \"Item\" had required field \"1\" deleted. Required fields must always be sent, so if one side does not know about the required field, this will result in a breakage."
    },
    {
     "rule": "RESERVED_MESSAGE_NO_DELETE",
     "line": 5,
     "msg": "Previously present reserved name \"gone\" on message \"Item\" was deleted."
    },
    {
     "rule": "RESERVED_MESSAGE_NO_DELETE",
     "line": 5,
     "msg": "Previously present reserved range \"[50,60]\" on message \"Item\" is missing values: [56,60] were removed."
    },
    {
     "rule": "FIELD_WIRE_COMPATIBLE_CARDINALITY",
     "line": 6,
     "msg": "Field \"1\" with name \"id\" on message \"Item\" changed cardinality from \"required\" to \"optional with explicit presence\"."
    },
    {
     "rule": "FIELD_SAME_DEFAULT",
     "line": 7,
     "msg": "Field \"2\" with name \"count\" on message \"Item\" changed default value from 1 to 5."
    },
    {
     "rule": "FIELD_WIRE_COMPATIBLE_CARDINALITY",
     "line": 8,
     "msg": "Field \"3\" with name \"tags\" on message \"Item\" changed cardinality from \"repeated\" to \"optional with explicit presence\"."
    },
    {
     "rule": "FIELD_WIRE_COMPATIBLE_TYPE",
     "line": 9,
     "msg": "Field \"4\" with name \"score\" on message \"Item\" changed type from \"int32\" to \"string\". See https://developers.google.com/protocol-buffers/docs/proto3#updating for wire compatibility rules."
    },
    {
     "rule": "FIELD_SAME_ONEOF",
     "line": 16,
     "msg": "Field \"11\" with name \"loose\" on message \"Item\" moved from outside to inside a oneof."
    },
    {
     "rule": "FIELD_WIRE_COMPATIBLE_TYPE",
     "line": 18,
     "msg": "Field \"12\" with name \"legacy\" on message \"Item\" changed type from \"int32\" to \"sint32\". See https://developers.google.com/protocol-buffers/docs/proto3#updating for wire compatibility rules."
    },
    {
     "rule": "ENUM_VALUE_NO_DELETE_UNLESS_NUMBER_RESERVED",
     "line": 22,
     "msg": "Previously present enum value \"3\" on enum \"Level\" was deleted without reserving the number \"3\"."
    },
    {
     "rule": "RESERVED_ENUM_NO_DELETE",
     "line": 22,
     "msg": "Previously present reserved name \"OLD\" on enum \"Level\" was deleted."
    },
    {
     "rule": "RESERVED_ENUM_NO_DELETE",
     "line": 22,
     "msg": "Previously present reserved range \"[10,20]\" on enum \"Level\" is missing values: [16,20] were removed."
    },
    {
     "rule": "RPC_SAME_REQUEST_TYPE",
     "line": 34,
     "msg": "RPC \"Call\" on service \"Svc\" changed request type from \"ks.Req\" to \"ks.Other\"."
    },
    {
     "rule": "RPC_SAME_RESPONSE_TYPE",
     "line": 34,
     "msg": "RPC \"Call\" on service \"Svc\" changed response type from \"ks.Resp\" to \"ks.Other\"."
    },
    {
     "rule": "RPC_SAME_CLIENT_STREAMING",
     "line": 35,
     "msg": "RPC \"Stream\" on service \"Svc\" changed from client unary to client streaming."
    },
    {
     "rule": "RPC_SAME_IDEMPOTENCY_LEVEL",
     "line": 37,
     "msg": "RPC \"Read\" on service \"Svc\" changed option \"idempotency_level\" from \"NO_SIDE_EFFECTS\" to \"IDEMPOTENT\"."
    },
    {
     "rule": "RPC_SAME_SERVER_STREAMING",
     "line": 39,
     "msg": "RPC \"Out\" on service \"Svc\" changed from server streaming to server unary."
    }
   ],
   "WIRE_JSON": [
    {
     "rule": "FIELD_NO_DELETE_UNLESS_NAME_RESERVED",
     "line": 5,
     "msg": "Previously present field \"8\" with name \"extra\" on message \"Item\" was deleted without reserving the name \"extra\"."
    },
    {
     "rule": "FIELD_NO_DELETE_UNLESS_NUMBER_RESERVED",
     "line": 5,
     "msg": "Previously present field \"8\" with name \"extra\" on message \"Item\" was deleted without reserving the number \"8\"."
    },
    {
     "rule": "MESSAGE_SAME_REQUIRED_FIELDS",
     "line": 5,
     "msg": "Message \"Item\" had required field \"1\" deleted. Required fields must always be sent, so if one side does not know about the required field, this will result in a breakage."
    },
    {
     "rule": "RESERVED_MESSAGE_NO_DELETE",
     "line": 5,
     "msg": "Previously present reserved name \"gone\" on message \"Item\" was deleted."
    },
    {
     "rule": "RESERVED_MESSAGE_NO_DELETE",
     "line": 5,
     "msg": "Previously present reserved range \"[50,60]\" on message \"Item\" is missing values: [56,60] were removed."
    },
    {
     "rule": "FIELD_WIRE_JSON_COMPATIBLE_CARDINALITY",
     "line": 6,
     "msg": "Field \"1\" with name \"id\" on message \"Item\" changed cardinality from \"required\" to \"optional with explicit presence\"."
    },
    {
     "rule": "FIELD_SAME_DEFAULT",
     "line": 7,
     "msg": "Field \"2\" with name \"count\" on message \"Item\" changed default value from 1 to 5."
    },
    {
     "rule": "FIELD_WIRE_JSON_COMPATIBLE_CARDINALITY",
     "line": 8,
     "msg": "Field \"3\" with name \"tags\" on message \"Item\" changed cardinality from \"repeated\" to \"optional with explicit presence\"."
    },
    {
     "rule": "FIELD_WIRE_JSON_COMPATIBLE_TYPE",
     "line": 9,
     "msg": "Field \"4\" with name \"score\" on message \"Item\" changed type from \"int32\" to \"string\". See https://developers.google.com/protocol-buffers/docs/proto3#updating for wire compatibility rules and https://developers.google.com/protocol-buffers/docs/proto3#json for JSON compatibility rules."
    },
    {
     "rule": "FIELD_SAME_JSON_NAME",
     "line": 10,
     "msg": "Field \"5\" with name \"remark\" on message \"Item\" changed option \"json_name\" from \"note\" to \"remark\"."
    },
    {
     "rule": "FIELD_SAME_NAME",
     "line": 10,
     "msg": "Field \"5\" on message \"Item\" changed name from \"note\" to \"remark\"."
    },
    {
     "rule": "FIELD_SAME_JSON_NAME",
     "line": 11,
     "msg": "Field \"6\" with name \"memo\" on message \"Item\" changed option \"json_name\" from \"memo\" to \"m\"."
    },
    {
     "rule": "FIELD_SAME_ONEOF",
     "line": 16,
     "msg": "Field \"11\" with name \"loose\" on message \"Item\" moved from outside to inside a oneof."
    },
    {
     "rule": "FIELD_WIRE_JSON_COMPATIBLE_TYPE",
     "line": 18,
     "msg": "Field \"12\" with name \"legacy\" on message \"Item\" changed type from \"int32\" to \"sint32\". See https://developers.google.com/protocol-buffers/docs/proto3#updating for wire compatibility rules and https://developers.google.com/protocol-buffers/docs/proto3#json for JSON compatibility rules."
    },
    {
     "rule": "ENUM_VALUE_NO_DELETE_UNLESS_NAME_RESERVED",
     "line": 22,
     "msg": "Previously present enum value \"3\" on enum \"Level\" was deleted without reserving the name \"MAX\"."
    },
    {
     "rule": "ENUM_VALUE_NO_DELETE_UNLESS_NUMBER_RESERVED",
     "line": 22,
     "msg": "Previously present enum value \"3\" on enum \"Level\" was deleted without reserving the number \"3\"."
    },
    {
     "rule": "RESERVED_ENUM_NO_DELETE",
     "line": 22,
     "msg": "Previously present reserved name \"OLD\" on enum \"Level\" was deleted."
    },
    {
     "rule": "RESERVED_ENUM_NO_DELETE",
     "line": 22,
     "msg": "Previously present reserved range \"[10,20]\" on enum \"Level\" is missing values: [16,20] were removed."
    },
    {
     "rule": "ENUM_VALUE_SAME_NAME",
     "line": 24,
     "msg": "Enum value \"1\" on enum \"Level\" changed name from \"MID\" to \"MEDIUM\"."
    },
    {
     "rule": "RPC_SAME_REQUEST_TYPE",
     "line": 34,
     "msg": "RPC \"Call\" on service \"Svc\" changed request type from \"ks.Req\" to \"ks.Other\"."
    },
    {
     "rule": "RPC_SAME_RESPONSE_TYPE",
     "line": 34,
     "msg": "RPC \"Call\" on service \"Svc\" changed response type from \"ks.Resp\" to \"ks.Other\"."
    },
    {
     "rule": "RPC_SAME_CLIENT_STREAMING",
     "line": 35,
     "msg": "RPC \"Stream\" on service \"Svc\" changed from client unary to client streaming."
    },
    {
     "rule": "RPC_SAME_IDEMPOTENCY_LEVEL",
     "line": 37,
     "msg": "RPC \"Read\" on service \"Svc\" changed option \"idempotency_level\" from \"NO_SIDE_EFFECTS\" to \"IDEMPOTENT\"."
    },
    {
     "rule": "RPC_SAME_SERVER_STREAMING",
     "line": 39,
     "msg": "RPC \"Out\" on service \"Svc\" changed from server streaming to server unary."
    }
   ]
  },
  "pkg": {
   "old": "syntax = \"proto3\";\n\npackage acme.v1;\n\nmessage Ping {\n  string msg = 1;\n}\n",
   "new": "syntax = \"proto3\";\n\npackage acme.v2;\n\nmessage Ping {\n  string msg = 1;\n}\n",
   "WIRE": [
    {
     "rule": "FILE_SAME_PACKAGE",
     "line": 3,
     "msg": "File package changed from \"acme.v1\" to \"acme.v2\"."
    }
   ],
   "WIRE_JSON": [
    {
     "rule": "FILE_SAME_PACKAGE",
     "line": 3,
     "msg": "File package changed from \"acme.v1\" to \"acme.v2\"."
    }
   ]
  },
  "allRules": [
   "ENUM_VALUE_NO_DELETE_UNLESS_NAME_RESERVED",
   "ENUM_VALUE_NO_DELETE_UNLESS_NUMBER_RESERVED",
   "ENUM_VALUE_SAME_NAME",
   "FIELD_NO_DELETE_UNLESS_NAME_RESERVED",
   "FIELD_NO_DELETE_UNLESS_NUMBER_RESERVED",
   "FIELD_SAME_DEFAULT",
   "FIELD_SAME_JSON_NAME",
   "FIELD_SAME_NAME",
   "FIELD_SAME_ONEOF",
   "FIELD_WIRE_COMPATIBLE_CARDINALITY",
   "FIELD_WIRE_COMPATIBLE_TYPE",
   "FIELD_WIRE_JSON_COMPATIBLE_CARDINALITY",
   "FIELD_WIRE_JSON_COMPATIBLE_TYPE",
   "FILE_SAME_PACKAGE",
   "MESSAGE_SAME_REQUIRED_FIELDS",
   "RESERVED_ENUM_NO_DELETE",
   "RESERVED_MESSAGE_NO_DELETE",
   "RPC_SAME_CLIENT_STREAMING",
   "RPC_SAME_IDEMPOTENCY_LEVEL",
   "RPC_SAME_REQUEST_TYPE",
   "RPC_SAME_RESPONSE_TYPE",
   "RPC_SAME_SERVER_STREAMING"
  ]
 },
 "wire": {
  "m150": "ea fe ff ff ff ff ff ff ff 01",
  "m150zz": "ab 02",
  "tag16_2": "82 01",
  "f32_01": "cd cc cc 3d",
  "f64_01": "9a 99 99 99 99 99 b9 3f",
  "v300": "ac 02",
  "tagrev_8201": 16,
  "writes": {
   "16777217": {
    "f": "16777216",
    "d": "16777217"
   },
   "0.1": {
    "f": "0.1",
    "d": "0.1"
   },
   "0.00001": {
    "f": "1e-05",
    "d": "1e-05"
   },
   "1e-45": {
    "f": "1.40129846e-45",
    "d": "1e-45"
   },
   "3.4028235e38": {
    "f": "3.40282347e+38",
    "d": "3.4028235e+38"
   },
   "123456789012345678": {
    "f": "1.23456791e+17",
    "d": "1.2345678901234568e+17"
   },
   "0.1234567890123456": {
    "f": "0.123456791",
    "d": "0.12345678901234559"
   },
   "1.234567": {
    "f": "1.23456705",
    "d": "1.234567"
   }
  }
 },
 "offline": {
  "total": 143951,
  "pass": 143951,
  "suites": {
   "s1": 3600,
   "s2": 6707,
   "s3": 3024,
   "s4": 2192,
   "s5": 550,
   "s6": 1040,
   "s7": 126838
  },
  "esAgree": 947,
  "esAgree2": 947,
  "bugs": 8
 }
};

function canon(x) {   // JSON 语义比较：键排序；数字按数值
  if (Array.isArray(x)) return '[' + x.map(canon).join(',') + ']'
  if (x && typeof x === 'object') return '{' + Object.keys(x).sort().map((k) => JSON.stringify(k) + ':' + canon(x[k])).join(',') + '}'
  if (typeof x === 'number') return 'n:' + x
  return JSON.stringify(x)
}
function hexToBytes(h) { const t = h.replace(/[^0-9a-f]/gi, ''); const o = []; for (let i = 0; i < t.length; i += 2) o.push(parseInt(t.substr(i, 2), 16)); return o }
function varintVal(hexs) { let x = 0n, s = 0n; for (const b of hexToBytes(hexs)) { x |= BigInt(b & 0x7f) << s; s += 7n } return x }

export default async ({ page, toolURL, screenshot, assert }) => {
  const pageErrors = []
  page.on('pageerror', (e) => pageErrors.push(e.message))
  const D = ORACLE.decode, E = ORACLE.encode, S = ORACLE.size, C = ORACLE.compat, W = ORACLE.wire
  await page.goto(toolURL, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => window.PLA && document.querySelector('#pl-dok'), null, { timeout: 15000 })

  const txt = (sel) => page.$eval(sel, (e) => e.textContent)
  const onTab = async (t) => {
    await page.click(`#pl-tab-${t}`)
    await page.waitForFunction((t) => { const p = document.querySelector(`#pl-pane-${t}`); return !p.hidden && getComputedStyle(p).display !== 'none' }, t)
  }
  const setOut = async (k) => { await page.click(`#pl-out-${k}`); await page.waitForFunction((k) => !document.querySelector('#pl-outp-' + k).hidden, k) }
  async function waitEq(sel, want, msg, prop = 'textContent') {
    await page.waitForFunction(([s, w, p]) => { const e = document.querySelector(s); return e && e[p] === w }, [sel, want, prop], { timeout: 10000 }).catch(() => {})
    const got = await page.$eval(sel, (e, p) => e[p], prop)
    assert(got === want, msg + (got === want ? '' : `\n--- 页面\n${String(got).slice(0, 600)}\n--- 期望\n${String(want).slice(0, 600)}`))
  }
  async function waitIncl(sel, want, msg) {
    await page.waitForFunction(([s, w]) => { const e = document.querySelector(s); return e && e.textContent.includes(w) }, [sel, want], { timeout: 10000 }).catch(() => {})
    const got = await txt(sel)
    assert(got.includes(want), msg + (got.includes(want) ? '' : `\n--- 页面\n${got.slice(0, 600)}\n--- 应包含\n${want.slice(0, 600)}`))
  }
  // 等「这一次输入」真的解码完（旧状态的文本可能恰好相同，不能拿文本当等待条件）
  async function fillDecode(v) {
    await page.fill('#pl-dinput', v)
    await page.waitForFunction((v) => window.PLA.state.dec && window.PLA.state.dec.input === v, v, { timeout: 10000 })
  }
  async function pageJSON() { await setOut('json'); const t = await txt('#pl-json'); try { return JSON.parse(t) } catch (e) { return { __parseError: t.slice(0, 200) } } }

  // ───────── 1. 订单示例：文本格式与 protoc --decode 逐字一致 ─────────
  await waitEq('#pl-text', D.order.text, '订单示例：文本格式与 protoc --decode=shop.v1.Order 逐字一致')
  assert(await txt('#pl-dlen') === String(D.order.len), `字节数 ${D.order.len}`)
  assert((await txt('#pl-dok')).includes('解析成功'), '状态：解析成功')   // 正向锚点（下面断言「0 个未知字段」）
  assert(await txt('#pl-dunk') === '0', '订单示例 0 个未知字段')
  assert(await page.$eval('#pl-derr', (e) => getComputedStyle(e).display) === 'none', '无错误时错误条计算样式为 none')
  // JSON 与 Python json_format 语义一致（四种选项）
  let j = await pageJSON()
  assert(canon(j) === canon(D.order.json), `JSON 与 Python MessageToJson 一致\n页面 ${JSON.stringify(j).slice(0, 300)}\n期望 ${JSON.stringify(D.order.json).slice(0, 300)}`)
  await page.check('#pl-jproto')
  await page.waitForFunction(() => document.querySelector('#pl-json').textContent.includes('"order_id"'))
  j = JSON.parse(await txt('#pl-json'))
  assert(canon(j) === canon(D.order.jsonProto), 'JSON（.proto 字段名）与 preserving_proto_field_name=True 一致')
  await page.uncheck('#pl-jproto')
  await page.check('#pl-jenum')
  await page.waitForFunction(() => /"status": \d/.test(document.querySelector('#pl-json').textContent))
  j = JSON.parse(await txt('#pl-json'))
  assert(canon(j) === canon(D.order.jsonEnumInt), 'JSON（枚举用数字）与 use_integers_for_enums=True 一致')
  await page.uncheck('#pl-jenum')
  await page.waitForFunction(() => document.querySelector('#pl-json').textContent.includes('"STATUS_PAID"'))

  // ───────── 2. 体积分析：总字节钉死成 Python 独立遍历出的字面量；逐行对拍 ─────────
  await setOut('size')
  assert(S.total === 187, `Python 遍历得到的订单字节数 ${S.total}`)
  assert(await txt('#pl-szbinv') === `${S.total} B`, `体积页 Protobuf 字节数 = ${S.total}`)
  assert(await txt('#pl-szjsonv') === `${D.order.jsonBytes} B`, `体积页 JSON 字节数 = Python json.dumps 紧凑写法 ${D.order.jsonBytes}`)
  const rows = await page.$$eval('#pl-sztbl tbody tr', (trs) => trs.map((tr) => { const td = tr.querySelectorAll('td'); return { p: td[0].textContent, count: +td[1].textContent, self: +td[2].textContent, total: +td[3].textContent } }))
  let rowHits = 0
  for (const [path, v] of Object.entries(S.order)) {
    const r = rows.find((x) => x.p === path)
    assert(!!r, `体积表里有「${path}」这一行`)
    if (r) { rowHits++; assert(r.count === v.count && r.self === v.self && r.total === v.total, `「${path}」次数/自身/含子字段 = ${v.count}/${v.self}/${v.total}，页面 ${r.count}/${r.self}/${r.total}`) }
  }
  assert(rowHits === Object.keys(S.order).length && rowHits >= 20, `体积表逐行对上 Python 遍历 ${rowHits} 行`)
  const barW = await page.$eval('#pl-szbin', (e) => e.getBoundingClientRect().width)
  const barJ = await page.$eval('#pl-szjson', (e) => e.getBoundingClientRect().width)
  assert(barJ > 0 && Math.abs(barW / barJ - S.total / D.order.jsonBytes) < 0.02, `体积对比条的长度比 = 字节比（${(barW / barJ).toFixed(3)} vs ${(S.total / D.order.jsonBytes).toFixed(3)}）`)
  await setOut('text')

  // ───────── 3. 点字节 → 选中字段；检视器的各种读法 ─────────
  const inHex = await page.$eval('#pl-dinput', (e) => e.value)
  const ob = hexToBytes(inHex)
  let pp = -1
  for (let i = 0; i + 1 < ob.length; i++) if (ob[i] === 0x62 && ob[i + 1] === 0x04) { pp = i; break }
  assert(pp > 0, 'promo_ids（字段 12，LEN）的 tag 62 04 在输入里')
  await page.click(`#pl-hex .pl-b[data-i="${pp + 3}"]`)
  await page.waitForFunction(() => document.querySelector('#pl-insp-path').textContent === 'promo_ids')
  const onCount = await page.$$eval('#pl-hex .pl-b.pl-on', (ns) => ns.length)
  assert(onCount === 2, `点 305 的第一个字节：高亮恰好是这个 packed 元素的 2 个字节（实得 ${onCount}）`)
  assert((await txt('#pl-tree .pl-tn.pl-on')).includes('305'), '字段树里选中的是值为 305 的元素')
  // order_id：高亮字节数 = Python 遍历出的整段字节
  await page.click('#pl-tree .pl-tn[data-id="0"]')
  await page.waitForFunction(() => document.querySelector('#pl-insp-path').textContent === 'order_id')
  assert(await page.$$eval('#pl-hex .pl-b.pl-on', (ns) => ns.length) === S.order.order_id.total, `选中 order_id：高亮 ${S.order.order_id.total} 字节`)
  const hiRect = await page.$eval('#pl-hex .pl-b.pl-on', (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 })
  assert(hiRect, '高亮字节真的画出来了（有宽高）')
  // balance_delta：varint 的 ZigZag 读法 = struct 算出的 -150
  const bdId = await page.evaluate(() => window.PLA.state.list.findIndex((n) => n.path === 'balance_delta'))
  await page.click(`#pl-tree .pl-tn[data-id="${bdId}"]`)
  await page.waitForFunction(() => document.querySelector('#pl-insp-path').textContent === 'balance_delta')
  const insp = await page.$$eval('#pl-insp .pl-kv', (ns) => Object.fromEntries(ns.map((n) => [n.querySelector('dt').textContent, n.querySelector('dd').textContent])))
  assert(insp['uint64'] === String(varintVal(W.m150zz)), `检视器 uint64 读法 = ${varintVal(W.m150zz)}（Python 算的 ZigZag(-150)）`)
  assert(insp['sint64（ZigZag）'] === '-150', '检视器 ZigZag 读法 = -150')
  assert(insp['tag 字节'].startsWith('68'), 'tag 字节 68（13 << 3 | 0）')

  // ───────── 4. 截断一字节：protoc 也失败；坏字节标红 ─────────
  assert(D.order.truncFails === true, 'protoc --decode 对截断输入也失败')
  await fillDecode(inHex.slice(0, -2))
  await page.waitForFunction(() => document.querySelector('#pl-dok').textContent.includes('失败'))
  assert(await page.$eval('#pl-derr', (e) => getComputedStyle(e).display !== 'none' && e.textContent.includes('字节处')), '截断：错误条可见且指出字节位置')
  assert(await page.$$eval('#pl-hex .pl-b.r-bad', (ns) => ns.length) >= 1, '截断：出错位置的字节标红')
  await fillDecode(inHex)
  await waitEq('#pl-text', D.order.text, '恢复输入后重新解码一致')

  // ───────── 5. 各种输入写法 ─────────
  await fillDecode(D.order.b64)
  await waitEq('#pl-text', D.order.text, 'Base64 输入解出同一条订单')
  assert((await txt('#pl-dstatus')).includes('Base64'), '自动识别为 Base64')
  await page.selectOption('#pl-dtype', '')
  await page.waitForFunction(() => window.PLA.state.dec.typeSel === '')
  for (const [form, label] of [['"\\x08\\x96\\x01"', '转义串'], ['"\\010\\226\\001"', '八进制转义串'], ['[8, 150, 1]', '数组'], ['[]byte{0x08, 0x96, 0x01}', 'Go 字面量'], ['08 96 01', '十六进制']]) {
    await fillDecode(form)
    await waitEq('#pl-text', D.tiny.text, `${label} ${form} → protoc --decode_raw 同为 ${D.tiny.text.trim()}`)
  }
  await page.selectOption('#pl-dfmt', 'hex')
  await page.waitForFunction(() => window.PLA.state.dec.fmtSel === 'hex')
  await fillDecode('abc')
  await waitIncl('#pl-derr', '奇数', '十六进制位数为奇数时报错')
  await page.selectOption('#pl-dfmt', 'auto')

  // ───────── 6. gRPC-web：自动拆帧 + trailer ─────────
  await page.selectOption('#pl-dsample', 'grpcweb')
  await waitIncl('#pl-text', D.grpcweb.text1, 'gRPC-web 第 1 帧与 protoc --decode 逐字一致')
  const chips = await page.$$eval('#pl-dframes .pl-chipbtn', (ns) => ns.map((n) => n.textContent))
  assert(chips.length === D.grpcweb.frames.length, `拆出 ${D.grpcweb.frames.length} 帧（实得 ${chips.length}）`)
  assert(chips[0].includes(`${D.grpcweb.frames[0].len}B`), `第 1 帧 ${D.grpcweb.frames[0].len} 字节`)
  assert((await txt('#pl-text')).includes('# grpc-status: 0'), 'trailer 的 grpc-status: 0 写进了文本输出')
  await page.click('#pl-dframes .pl-chipbtn[data-fr="1"]')
  await page.waitForFunction(() => document.querySelector('#pl-insp-path').textContent === '帧 2')
  assert((await txt('#pl-insp')).includes('grpc-status:0'), '点 trailer 帧，检视器显示 trailer 原文')
  assert(await page.$$eval('#pl-hex .pl-b.r-frame', (ns) => ns.length) === 5 * D.grpcweb.frames.length, '每帧 5 字节帧头着色')
  j = await pageJSON()
  assert(canon(j) === canon(D.grpcweb.json1), 'gRPC 帧 1 的 JSON 与 Python 一致')
  assert(!('promoIds' in j) && 'orderId' in j, '默认不输出空的 repeated（正向锚点：orderId 在）')   // 正向锚点
  await page.check('#pl-jdef')
  await page.waitForFunction(() => document.querySelector('#pl-json').textContent.includes('"promoIds": []'))
  j = JSON.parse(await txt('#pl-json'))
  assert(canon(j) === canon(D.grpcweb.json1Defaults), `JSON（输出默认值）与 always_print_fields_with_no_presence=True 一致\n页面 ${JSON.stringify(j).slice(0, 300)}\n期望 ${JSON.stringify(D.grpcweb.json1Defaults).slice(0, 300)}`)
  await page.uncheck('#pl-jdef')
  await setOut('text')

  // ───────── 7. proto2：组 · 扩展 · 封闭枚举的未知值 ─────────
  await page.selectOption('#pl-dsample', 'legacy')
  await waitEq('#pl-text', D.legacy.text, 'proto2 示例与 protoc --decode 逐字一致（含组、扩展、末尾的未知字段）')
  assert(await txt('#pl-dunk') === String(D.legacy.unknown), `未知字段数 = Python UnknownFieldSet 的 ${D.legacy.unknown}`)
  j = await pageJSON()
  assert(canon(j) === canon(D.legacy.json), `proto2 示例 JSON 与 Python 一致\n页面 ${JSON.stringify(j).slice(0, 300)}\n期望 ${JSON.stringify(D.legacy.json).slice(0, 300)}`)
  await setOut('text')
  const unkRows = await page.$$eval('#pl-tree .pl-tunk', (ns) => ns.length)
  assert(unkRows >= 1, '字段树把 schema 里没有的字段标成未知')
  assert(await page.$$eval('#pl-hex .pl-b.r-unk', (ns) => ns.length) > 0, '未知字段的字节带虚线标记')

  // ───────── 8. 原始解码 ─────────
  await page.selectOption('#pl-dsample', 'raw')
  await waitEq('#pl-text', D.raw.text, '无 schema 原始解码与 protoc --decode_raw 逐字一致（含 "Hi" 被猜成子消息）')
  assert(await page.$eval('#pl-dtype', (e) => e.value) === '', '类型下拉为「原始解码」')
  assert((await (async () => { await setOut('json'); return txt('#pl-json') })()).includes('需要字段名'), '原始解码不给 JSON 并说明原因')
  await setOut('text')

  // ───────── 9. 编码 ─────────
  await onTab('encode')
  await waitEq('#pl-ebytes', E.hex, '默认 JSON 编码结果 = Python SerializeToString(deterministic=True)')
  assert(await txt('#pl-elen') === String(E.len), `编码长度 ${E.len}`)
  assert((await txt('#pl-ert')).includes('一致'), '编码后解码回来与输入一致')
  assert((await txt('#pl-estatus')).includes(`JSON ${E.jsonBytes} 字节`), `同内容 JSON ${E.jsonBytes} 字节（Python json.dumps 紧凑）`)
  for (const [fmt, want] of [['base64', E.b64], ['go', E.go], ['c', E.c], ['py', E.py]]) {
    await page.selectOption('#pl-eout', fmt)
    await waitEq('#pl-ebytes', want, `输出写法 ${fmt} 与 Python 生成的字面量一致`)
  }
  await page.selectOption('#pl-eout', 'hexs')
  await page.click('#pl-emode button[data-v="text"]')
  await waitEq('#pl-einput', E.text, 'JSON 切到文本格式：内容与 protoc --decode 打印的一致', 'value')
  await page.selectOption('#pl-eorder', 'insertion')
  await waitEq('#pl-ebytes', E.textEncodeHex, '文本格式 + 书写顺序 = protoc --encode 的字节')
  await page.selectOption('#pl-eorder', 'sorted')
  await page.click('#pl-emode button[data-v="json"]')
  await page.waitForFunction(() => document.querySelector('#pl-einput').value.trim().startsWith('{'))
  assert(E.unknownRejected === true, 'Python json_format 也拒绝未知字段')
  await page.fill('#pl-einput', E.badJson)
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#pl-eerr')).display !== 'none')
  assert((await txt('#pl-eerr')).includes('fooBar'), '未知字段报错并指出字段名')
  await page.check('#pl-eignore')
  await waitEq('#pl-ebytes', E.ignoreHex, '勾「忽略未知字段」后 = Python ignore_unknown_fields=True 的字节')
  await page.click('#pl-etodec')
  await page.waitForFunction(() => !document.querySelector('#pl-pane-decode').hidden)
  await waitEq('#pl-text', E.text, '「送去解码」后解码文本 = protoc --decode')
  await onTab('encode'); await page.uncheck('#pl-eignore')

  // ───────── 10. Schema：报错行号与 protoc 一致 ─────────
  await onTab('schema')
  const files0 = await page.evaluate(() => JSON.parse(JSON.stringify(window.PLA.proj().files)))
  for (const [k, sc] of Object.entries(ORACLE.schema)) {
    assert(sc.fails === true && Number.isInteger(sc.line), `protoc 对「${k}」报错在第 ${sc.line} 行`)
    await page.click(`#pl-files [data-f="${sc.file}"]`)
    await page.waitForFunction((f) => window.PLA.proj().active === f, sc.file)
    await page.fill('#pl-src', files0[sc.file].replace(sc.old, sc.new))
    await page.waitForFunction((f) => [...document.querySelectorAll('#pl-diags .pl-dl')].some((e) => e.textContent.startsWith(f + ':')), sc.file)
    const first = await page.$$eval('#pl-diags .pl-dl', (ns, f) => ns.map((n) => n.textContent).filter((t) => t.startsWith(f + ':'))[0], sc.file)
    assert(first.split(':')[1] === String(sc.line), `「${k}」：页面报错在 ${first}，protoc 在 ${sc.file}:${sc.line}`)
    assert(await page.$$eval('#pl-gutter .pl-gl-err', (ns) => ns.map((n) => n.textContent)).then((a) => a.includes(String(sc.line))), `行号栏标红第 ${sc.line} 行`)
    await page.fill('#pl-src', files0[sc.file])
    await page.waitForFunction(() => document.querySelector('#pl-diags').textContent.includes('没有错误'))
  }
  // 新建 / 删除文件
  await page.click('#pl-fnew')
  await page.fill('#pl-fname', 'demo/hello.proto')
  await page.click('#pl-fok')
  await page.waitForFunction(() => window.PLA.proj().active === 'demo/hello.proto' && [...document.querySelectorAll('#pl-dtype option')].some((o) => o.value === 'demo.Hello'))
  assert(true, '新建 demo/hello.proto 后类型下拉出现 demo.Hello')
  await page.click('#pl-fdel'); await page.click('#pl-fdel')
  await page.waitForFunction(() => !('demo/hello.proto' in window.PLA.proj().files))
  assert(await page.$$eval('#pl-files .pl-file', (ns) => ns.length) === Object.keys(files0).length, '删除后回到原来的文件数')

  // ───────── 11. 兼容性：与 buf breaking 逐条一致；规则表里每条都真的能触发 ─────────
  await onTab('compat')
  const fired = new Set()
  async function compatCase(key) {
    const cs = C[key]
    await page.fill('#pl-cold', cs.old); await page.fill('#pl-cnew', cs.new)
    for (const cat of ['WIRE', 'WIRE_JSON']) {
      await page.click(`#pl-ccat button[data-v="${cat}"]`)
      const want = cs[cat].map((x) => `${x.rule}@${x.line}`).sort()
      await page.waitForFunction(([n, c]) => document.querySelector('#pl-cn') && document.querySelector('#pl-cn').textContent === String(n) && document.querySelector('#pl-csum').textContent.includes(c + ' 违规'), [want.length, cat]).catch(() => {})
      const got = (await page.$$eval('#pl-cres li', (ls) => ls.filter((l) => l.querySelector('.pl-rloc')).map((l) => `${l.querySelector('.pl-rid').textContent}@${l.querySelector('.pl-rloc').textContent.split(':')[1]}`))).sort()
      assert(got.join() === want.join(), `兼容性「${key}」${cat}：与 buf 1.75.0 逐条一致（${got.length}/${want.length}）\n页面 ${got.join(' ')}\nbuf ${want.join(' ')}`)
      got.forEach((g) => fired.add(g.split('@')[0]))
    }
  }
  await compatCase('sample'); await compatCase('kitchen'); await compatCase('pkg')
  const listed = await page.$$eval('#pl-crules tbody tr td:first-child code', (ns) => ns.map((n) => n.textContent))
  assert(listed.length === 22 && C.allRules.length === 22, `规则表 ${listed.length} 条，buf 在三组示例上触发 ${C.allRules.length} 条`)
  const dead = listed.filter((r) => !fired.has(r))
  assert(dead.length === 0, `规则表里每条规则都在页面上真的触发过；没触发的：${dead.join(', ')}`)
  await page.click('#pl-csample')
  await page.waitForFunction(() => document.querySelector('#pl-cold').value.includes('reserved 20 to 25'))

  // ───────── 12. 线格式计算器（对 Python struct / 手写 varint） ─────────
  await onTab('wire')
  await page.fill('#pl-vin', '-150')
  await waitEq('#pl-vhex', W.m150, 'int64 -150 的 varint = 10 字节补码')
  assert(await txt('#pl-vzz') === W.m150zz, 'sint64 -150 的 ZigZag varint')
  await page.fill('#pl-vin', '300')
  await waitEq('#pl-vhex', W.v300, '300 的 varint')
  await page.fill('#pl-tno', '16'); await page.selectOption('#pl-twt', '2')
  await waitEq('#pl-thex', W.tag16_2, '字段 16 · LEN 的 tag 字节')
  await page.fill('#pl-tin', '82 01')
  await waitEq('#pl-trno', String(W.tagrev_8201), 'tag 字节 82 01 反查出字段号')
  await page.fill('#pl-fin', '0.1')
  await waitEq('#pl-f32', W.f32_01, 'float 0.1 的线上 4 字节 = struct.pack("<f")')
  assert(await txt('#pl-f64') === W.f64_01, 'double 0.1 的线上 8 字节 = struct.pack("<d")')
  for (const [v, w] of Object.entries(W.writes)) {   // protoc 文本格式里的写法：交给 protoc 编码再解码得到
    await page.fill('#pl-fin', v)
    await waitEq('#pl-fw32', w.f, `float ${v} 在 protoc 文本格式里写作 ${w.f}`)
    assert(await txt('#pl-fw64') === w.d, `double ${v} 在 protoc 文本格式里写作 ${w.d}`)
  }

  // ───────── 13. 键盘 ─────────
  await page.focus('#pl-tab-wire')
  await page.keyboard.press('ArrowRight')
  assert(await page.evaluate(() => document.activeElement.id) === 'pl-tab-about' && await page.$eval('#pl-tab-about', (b) => b.getAttribute('aria-selected')) === 'true', '→ 键切到下一个页签')
  await page.keyboard.press('Home')
  assert(await page.$eval('#pl-tab-decode', (b) => b.getAttribute('aria-selected')) === 'true', 'Home 回到第一个页签')
  await page.selectOption('#pl-dsample', 'order')
  await waitEq('#pl-text', D.order.text, '重新载入订单示例')
  await page.click('#pl-tree .pl-tn[data-id="0"]')
  await page.focus('#pl-tree')
  await page.keyboard.press('ArrowDown')
  assert(await page.evaluate(() => window.PLA.state.sel) === 1, '字段树 ↓ 移到下一个字段')
  await page.keyboard.press('ArrowUp')
  assert(await page.evaluate(() => window.PLA.state.sel) === 0, '字段树 ↑ 回到上一个字段')

  // ───────── 15. 项目库：防抖保存 + 离页补写；新建 / 切换；分享链接 ─────────
  await onTab('decode')
  await page.fill('#pl-dinput', '08 96 01')
  await page.reload()   // 不等防抖：靠 pagehide 补写
  await page.waitForFunction(() => window.PLA && document.querySelector('#pl-dok'))
  assert(await page.$eval('#pl-dinput', (e) => e.value) === '08 96 01', '改完立刻刷新，输入仍在（pagehide 补写）')
  await page.selectOption('#pl-project', '__new')
  await page.waitForFunction(() => 'main.proto' in window.PLA.proj().files && [...document.querySelectorAll('#pl-etype option')].some((o) => o.value === 'demo.Hello'))
  const nProj = await page.evaluate(() => Object.keys(window.PLA.store().projects).length)
  assert(nProj === 2, `新建项目后共 ${nProj} 个项目`)
  await page.selectOption('#pl-project', 'p1')
  await page.waitForFunction(() => 'shop/order.proto' in window.PLA.proj().files)
  await page.click('#pl-share')
  await page.waitForFunction(() => location.hash.startsWith('#p='))
  const shareURL = page.url()
  const p2 = await page.context().newPage()
  const p2err = []; p2.on('pageerror', (e) => p2err.push(e.message))
  await p2.goto(shareURL)
  await p2.waitForFunction(() => window.PLA && window.PLA.proj().name.includes('来自链接'))
  const sharedFiles = await p2.evaluate(() => Object.keys(window.PLA.proj().files).sort().join())
  assert(sharedFiles === Object.keys(files0).sort().join(), `分享链接导入了同样的 ${Object.keys(files0).length} 个文件`)
  assert(await p2.evaluate(() => location.hash === ''), '导入后地址栏去掉了长哈希')
  assert(p2err.length === 0, `分享页无报错：${p2err.join(' | ')}`)
  await p2.close()

  // ───────── 16. 渲染守卫 ─────────
  await page.selectOption('#pl-dsample', 'order')
  await waitEq('#pl-text', D.order.text, '守卫前回到订单示例')
  const TABS = ['decode', 'encode', 'schema', 'compat', 'wire', 'about']
  const scanned = await renderGuards(page, {
    assert, tabs: TABS, onTab, paneSel: (t) => `#pl-pane-${t}`, panesRoot: '#pl-panes',
    figSel: (t) => `#pl-pane-${t} svg.pl-fig`, cardSel: '.pl-card, .pl-ide', childSel: 'table,dl,h2,h3,pre',
    labelSel: 'th, dt, label, label > span, .pl-lbl, .pl-pill, .pl-sub, .pl-tab', minControls: 30, minTextsInFig: 0,
  })
  assert(scanned >= 30, `守卫扫到的控件数 ${scanned}`)
  for (const host of ['.pl-nav', '#pl-hero']) await guardControlSize(page, { assert, tabs: [host], onTab: async () => {}, paneSel: (h) => h, minControls: 2 })
  await onTab('decode')
  await guardBoxOverlap(page, { assert, sel: '.pl-tab, .pl-legend .pl-pill, .pl-sub, #pl-dframes .pl-chipbtn' })
  await onTab('schema')
  await guardBoxOverlap(page, { assert, sel: '.pl-file, #pl-pane-schema .pl-btn' })
  await onTab('compat')
  await guardBoxOverlap(page, { assert, sel: '#pl-ccat button, .pl-kpi, #pl-pane-compat .pl-btn' })
  await onTab('encode')
  await guardBoxOverlap(page, { assert, sel: '#pl-emode button, #pl-pane-encode .pl-btn' })
  assert(await page.$eval('#pl-pane-decode', (el) => getComputedStyle(el).display) === 'none', '非当前页签计算样式为 none')
  assert(pageErrors.length === 0, `页面无报错：${pageErrors.join(' | ')}`)
  assert(await page.evaluate(() => window.PLA.internalErrors.length) === 0, `没有被兜住的内部异常：${await page.evaluate(() => window.PLA.internalErrors.join(' | '))}`)

  // ───────── 17. 说明页公布的对拍规模 = 离线对拍台实测（异源核对） ─────────
  await onTab('about')
  const pub = await page.$$eval('#pl-doc [data-v]', (ns) => Object.fromEntries(ns.map((n) => [n.dataset.v, +n.textContent.replace(/,/g, '')])))
  const OF = ORACLE.offline
  assert(!!OF && OF.pass === OF.total && OF.total > 0, `离线对拍全部通过 ${OF && OF.pass}/${OF && OF.total}`)
  if (OF) {
    assert(pub.total === OF.total, `说明页总项数 ${pub.total} vs 离线实测 ${OF.total}`)
    for (const k of Object.keys(OF.suites)) assert(pub[k] === OF.suites[k], `说明页 ${k} = ${pub[k]} vs 离线实测 ${OF.suites[k]}`)
    for (const k of ['esAgree', 'esAgree2', 'bugs']) assert(pub[k] === OF[k], `说明页 ${k} = ${pub[k]} vs 离线实测 ${OF[k]}`)
    assert(Object.values(OF.suites).reduce((a, b) => a + b, 0) === OF.total, '各套项数之和 = 总数（离线汇总自洽）')
  }

  // ───────── 缩略图：解码页，选中 items ─────────
  await onTab('decode')
  await page.click('#pl-tree .pl-tn[data-id="2"]')
  await page.waitForFunction(() => document.querySelector('#pl-insp-path').textContent === 'items')
  await page.waitForFunction(() => document.querySelector('#pl-toast').hidden, null, { timeout: 6000 })
  await page.mouse.move(2, 2)
  await page.evaluate(() => { document.querySelector('#pl-dstatus').scrollIntoView({ block: 'start' }); window.scrollBy(0, -96) })
  await screenshot('thumb.png')
}
