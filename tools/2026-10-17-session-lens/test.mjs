// 会话解剖台 · 集成测试
// 真值全部来自 run 目录 oracle/ui_truth.py（独立 Python 实现：自录官方价目 + Fraction 精确计价），
// 由 tools/inject-oracle.mjs 机械注入 ORACLE，本文件不手打任何数值期望。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { renderGuards } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs';

const ORACLE = {
 "meta": {
  "tabs": [
   "sessions",
   "anatomy",
   "billing",
   "pricing",
   "about"
  ],
  "priceDate": "2026-10-17"
 },
 "demo": {
  "1b7f3e88-0c4d-4e21-a6b9-5d2c8e7f9a03": {
   "id": "1b7f3e88-0c4d-4e21-a6b9-5d2c8e7f9a03",
   "title": "Postgres 中文全文检索方案对比",
   "calls": 4,
   "mainCalls": 4,
   "turns": 2,
   "turnObjs": 2,
   "tools": 3,
   "toolErr": 0,
   "toolMs": 6400,
   "cost": 0.6608019,
   "hit": 0.49180711610486894,
   "ctxPeak": 21074,
   "wallMs": 1564231,
   "offCalls": 0,
   "offCost": 0,
   "unpriced": {},
   "tot": {
    "in": 15,
    "out": 1580,
    "read": 39919,
    "w5": 0,
    "w1": 41234,
    "ws": 3
   },
   "turnCost": [
    0.6461865,
    0.0146154
   ],
   "turnCalls": [
    3,
    1
   ],
   "toolStats": {
    "WebSearch(服务端)": {
     "n": 2,
     "err": 0,
     "total": 0,
     "p50": 0,
     "p95": 0
    },
    "WebFetch": {
     "n": 1,
     "err": 0,
     "total": 6400,
     "p50": 6400,
     "p95": 6400
    }
   },
   "turnSpans": [
    6,
    1
   ],
   "agents": 0,
   "csTotal": null,
   "verdicts": {},
   "byModelCost": {
    "claude-fable-5-1": 0.4587505,
    "claude-opus-5-5": 0.2020514
   }
  },
  "7d0c2a51-3f6e-4b8a-9c1d-2e5f8a9b0c11": {
   "id": "7d0c2a51-3f6e-4b8a-9c1d-2e5f8a9b0c11",
   "title": "修复 todo-api 分页重复数据",
   "calls": 19,
   "mainCalls": 16,
   "turns": 4,
   "turnObjs": 4,
   "tools": 16,
   "toolErr": 1,
   "toolMs": 61504,
   "cost": 0.6295456,
   "hit": 0.8447221977057068,
   "ctxPeak": 26729,
   "wallMs": 303400,
   "offCalls": 2,
   "offCost": 0.0213892,
   "unpriced": {},
   "tot": {
    "in": 75,
    "out": 3756,
    "read": 373265,
    "w5": 0,
    "w1": 68539,
    "ws": 0
   },
   "turnCost": [
    0.3328588,
    0.0213892,
    0.0290542,
    0.2462434
   ],
   "turnCalls": [
    11,
    2,
    3,
    3
   ],
   "toolStats": {
    "Grep": {
     "n": 2,
     "err": 0,
     "total": 1390,
     "p50": 490,
     "p95": 900
    },
    "Read": {
     "n": 5,
     "err": 0,
     "total": 2250,
     "p50": 300,
     "p95": 1224
    },
    "Task": {
     "n": 1,
     "err": 0,
     "total": 19784,
     "p50": 19784,
     "p95": 19784
    },
    "Edit": {
     "n": 3,
     "err": 0,
     "total": 290,
     "p50": 90,
     "p95": 120
    },
    "Bash": {
     "n": 3,
     "err": 1,
     "total": 37600,
     "p50": 13200,
     "p95": 14800
    },
    "Write": {
     "n": 1,
     "err": 0,
     "total": 70,
     "p50": 70,
     "p95": 70
    },
    "Glob": {
     "n": 1,
     "err": 0,
     "total": 120,
     "p50": 120,
     "p95": 120
    }
   },
   "turnSpans": [
    22,
    3,
    5,
    5
   ],
   "agents": 1,
   "csTotal": 0.6296168,
   "verdicts": {
    "claude-haiku-5-5": "hidden",
    "claude-opus-5-5": "match",
    "claude-sonnet-5-5": "match"
   },
   "byModelCost": {
    "claude-opus-5-5": 0.5607062,
    "claude-sonnet-5-5": 0.0688394
   }
  },
  "c41e9b07-58a2-4d3c-8f61-0a9d7e3b2f40": {
   "id": "c41e9b07-58a2-4d3c-8f61-0a9d7e3b2f40",
   "title": "周报脚本",
   "calls": 6,
   "mainCalls": 6,
   "turns": 2,
   "turnObjs": 2,
   "tools": 4,
   "toolErr": 0,
   "toolMs": 1740,
   "cost": 0.080124,
   "hit": 0.8262142138479832,
   "ctxPeak": 18980,
   "wallMs": 128854,
   "offCalls": 0,
   "offCost": 0,
   "unpriced": {},
   "tot": {
    "in": 26,
    "out": 1632,
    "read": 90330,
    "w5": 18974,
    "w1": 0,
    "ws": 0
   },
   "turnCost": [
    0.07320621,
    0.00691779
   ],
   "turnCalls": [
    4,
    2
   ],
   "toolStats": {
    "Bash": {
     "n": 2,
     "err": 0,
     "total": 1610,
     "p50": 210,
     "p95": 1400
    },
    "Write": {
     "n": 1,
     "err": 0,
     "total": 60,
     "p50": 60,
     "p95": 60
    },
    "Edit": {
     "n": 1,
     "err": 0,
     "total": 70,
     "p50": 70,
     "p95": 70
    }
   },
   "turnSpans": [
    7,
    3
   ],
   "agents": 0,
   "csTotal": 0.080124,
   "verdicts": {
    "claude-sonnet-5-5": "match"
   },
   "byModelCost": {
    "claude-sonnet-5-5": 0.080124
   }
  }
 },
 "demoBad": 0,
 "demoBillSGT": [
  {
   "key": "2026-10-15",
   "n": 19,
   "tok": 445635,
   "cost": 0.6295456,
   "sessions": 1
  },
  {
   "key": "2026-10-16",
   "n": 9,
   "tok": 172426,
   "cost": 0.7263105,
   "sessions": 2
  },
  {
   "key": "2026-10-17",
   "n": 1,
   "tok": 21284,
   "cost": 0.0146154,
   "sessions": 1
  }
 ],
 "demoBillUTC": [
  {
   "key": "2026-10-15",
   "n": 19,
   "tok": 445635,
   "cost": 0.6295456,
   "sessions": 1
  },
  {
   "key": "2026-10-16",
   "n": 10,
   "tok": 193710,
   "cost": 0.7409259,
   "sessions": 2
  }
 ],
 "demoWhatIf": {
  "claude-fable-5-1": 2.9380735,
  "claude-mythos-5-1": 2.9380735,
  "claude-fable-5": 3.315709,
  "claude-mythos-5": 3.315709,
  "claude-opus-5-5": 1.2435808,
  "claude-opus-5": 1.6728545,
  "claude-opus-4-8": 1.6728545,
  "claude-opus-4-7": 1.6728545,
  "claude-opus-4-6": 1.6728545,
  "claude-opus-4-5": 1.6728545,
  "claude-sonnet-5-5": 0.6367904,
  "claude-sonnet-5": 0.6871418,
  "claude-sonnet-4-6": 1.0157127,
  "claude-sonnet-4-5": 1.0157127,
  "claude-haiku-5-5": 0.06285709,
  "claude-haiku-4-5": 0.3585709
 },
 "demoRepriceOpusOut40": {
  "7d0c2a51-3f6e-4b8a-9c1d-2e5f8a9b0c11": 0.6951656,
  "c41e9b07-58a2-4d3c-8f61-0a9d7e3b2f40": 0.080124,
  "1b7f3e88-0c4d-4e21-a6b9-5d2c8e7f9a03": 0.6802019
 },
 "demoTopModel": "claude-opus-5-5",
 "demoTotal": 1.3704715,
 "fixture": {
  "id": "5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54",
  "title": "夹具：基准测试与联网",
  "calls": 11,
  "mainCalls": 7,
  "turns": 2,
  "turnObjs": 2,
  "tools": 7,
  "toolErr": 1,
  "toolMs": 9870,
  "cost": 0.6849045,
  "hit": 0.42037122135421867,
  "ctxPeak": 101000,
  "wallMs": 66310,
  "offCalls": 0,
  "offCost": 0,
  "unpriced": {
   "claude-x-test-1": 1
  },
  "tot": {
   "in": 80035,
   "out": 1775,
   "read": 105200,
   "w5": 8400,
   "w1": 56620,
   "ws": 3
  },
  "turnCost": [
   0.6009885,
   0.083916
  ],
  "turnCalls": [
   9,
   2
  ],
  "toolStats": {
   "Grep": {
    "n": 1,
    "err": 0,
    "total": 640,
    "p50": 640,
    "p95": 640
   },
   "Read": {
    "n": 1,
    "err": 0,
    "total": 920,
    "p50": 920,
    "p95": 920
   },
   "Bash": {
    "n": 1,
    "err": 0,
    "total": 0,
    "p50": 0,
    "p95": 0
   },
   "Task": {
    "n": 1,
    "err": 0,
    "total": 8050,
    "p50": 8050,
    "p95": 8050
   },
   "WebSearch(服务端)": {
    "n": 1,
    "err": 0,
    "total": 0,
    "p50": 0,
    "p95": 0
   },
   "Edit": {
    "n": 1,
    "err": 1,
    "total": 110,
    "p50": 110,
    "p95": 110
   },
   "Glob": {
    "n": 1,
    "err": 0,
    "total": 150,
    "p50": 150,
    "p95": 150
   }
  },
  "turnSpans": [
   15,
   3
  ],
  "agents": 3,
  "csTotal": 0.75,
  "verdicts": {
   "claude-haiku-4-5-20251001": "hidden",
   "claude-haiku-5-5": "tx-only",
   "claude-opus-5-5": "tx-only",
   "claude-sonnet-5-5": "tx-only",
   "claude-x-test-1": "tx-only"
  },
  "byModelCost": {
   "claude-opus-5-5": 0.5584908,
   "claude-haiku-5-5": 0.0450705,
   "claude-x-test-1": 0,
   "claude-sonnet-5-5": 0.0813432
  }
 },
 "fixtureBad": 1,
 "fixtureFiles": 3,
 "fixtureCustomCost": 0.6869645,
 "fixtureBillSGT": [
  {
   "key": "2026-10-16",
   "n": 11,
   "tok": 252030,
   "cost": 0.6849045,
   "sessions": 1
  }
 ],
 "fixtureText": {
  "-Users-demo-code-fixture/5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54.jsonl": "{\"type\": \"permission-mode\", \"permissionMode\": \"acceptEdits\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\"}\n{\"parentUuid\": null, \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"user\", \"uuid\": \"47ce57e9-07c3-4701-a2ec-1f1da9d9a510\", \"timestamp\": \"2026-10-16T15:40:00.000Z\", \"message\": {\"role\": \"user\", \"content\": \"给 fixture 仓库补一份基准测试，并查一下最新的 Node 版本说明。\"}}\n{\"parentUuid\": \"47ce57e9-07c3-4701-a2ec-1f1da9d9a510\", \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"assistant\", \"uuid\": \"f13a2d6e-8dab-4db0-a546-2d22964dc0c2\", \"timestamp\": \"2026-10-16T15:40:05.200Z\", \"message\": {\"model\": \"claude-opus-5-5\", \"id\": \"msg_fx87cffff078f42586056a0a\", \"type\": \"message\", \"role\": \"assistant\", \"content\": [{\"type\": \"text\", \"text\": \"先找现有的基准代码。\"}], \"stop_reason\": null, \"usage\": {\"input_tokens\": 3, \"cache_creation_input_tokens\": 22500, \"cache_read_input_tokens\": 0, \"output_tokens\": 180, \"server_tool_use\": {\"web_search_requests\": 0, \"web_fetch_requests\": 0}, \"service_tier\": \"standard\", \"cache_creation\": {\"ephemeral_5m_input_tokens\": 2400, \"ephemeral_1h_input_tokens\": 20100}, \"inference_geo\": \"not_available\", \"speed\": \"fast\"}}, \"requestId\": \"req_fx8e1ae9c0df8eb985855a47\"}\n{\"parentUuid\": \"f13a2d6e-8dab-4db0-a546-2d22964dc0c2\", \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"assistant\", \"uuid\": \"7a451e77-ecdc-4fa8-a835-8cc96598d691\", \"timestamp\": \"2026-10-16T15:40:05.900Z\", \"message\": {\"model\": \"claude-opus-5-5\", \"id\": \"msg_fx87cffff078f42586056a0a\", \"type\": \"message\", \"role\": \"assistant\", \"content\": [{\"type\": \"tool_use\", \"id\": \"toolu_fxcb0be46893867c089f4e\", \"name\": \"Grep\", \"input\": {\"pattern\": \"bench\", \"path\": \"src\"}}], \"stop_reason\": \"tool_use\", \"usage\": {\"input_tokens\": 3, \"cache_creation_input_tokens\": 22500, \"cache_read_input_tokens\": 0, \"output_tokens\": 180, \"server_tool_use\": {\"web_search_requests\": 0, \"web_fetch_requests\": 0}, \"service_tier\": \"standard\", \"cache_creation\": {\"ephemeral_5m_input_tokens\": 2400, \"ephemeral_1h_input_tokens\": 20100}, \"inference_geo\": \"not_available\", \"speed\": \"fast\"}}, \"requestId\": \"req_fx8e1ae9c0df8eb985855a47\"}\n{\"parentUuid\": \"7a451e77-ecdc-4fa8-a835-8cc96598d691\", \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"user\", \"uuid\": \"903e33c1-161d-42da-ab58-29e02f6f4ce7\", \"timestamp\": \"2026-10-16T15:40:06.540Z\", \"message\": {\"role\": \"user\", \"content\": [{\"tool_use_id\": \"toolu_fxcb0be46893867c089f4e\", \"type\": \"tool_result\", \"content\": \"src/bench/run.ts:1:// TODO\", \"is_error\": false}]}}\n{\"parentUuid\": \"903e33c1-161d-42da-ab58-29e02f6f4ce7\", \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"attachment\", \"uuid\": \"40b81060-50a0-4e78-a730-9094c3774faa\", \"timestamp\": \"2026-10-16T15:40:06.570Z\", \"attachment\": {\"type\": \"todo\", \"content\": []}}\n{\"parentUuid\": \"40b81060-50a0-4e78-a730-9094c3774faa\", \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"assistant\", \"uuid\": \"5c4b98ab-52c5-461b-a823-7ebc57aedcbe\", \"timestamp\": \"2026-10-16T15:40:10.670Z\", \"message\": {\"model\": \"claude-opus-5-5\", \"id\": \"msg_fx033326cc80b94c2d99c8c3\", \"type\": \"message\", \"role\": \"assistant\", \"content\": [{\"type\": \"tool_use\", \"id\": \"toolu_fxd971b58fe03f22f412cb\", \"name\": \"Read\", \"input\": {\"file_path\": \"/Users/demo/code/fixture/src/bench/run.ts\"}}], \"stop_reason\": null, \"usage\": {\"input_tokens\": 2, \"cache_creation_input_tokens\": 1900, \"cache_read_input_tokens\": 22500, \"output_tokens\": 3, \"server_tool_use\": {\"web_search_requests\": 0, \"web_fetch_requests\": 0}, \"service_tier\": \"standard\", \"cache_creation\": {\"ephemeral_5m_input_tokens\": 0, \"ephemeral_1h_input_tokens\": 1900}, \"inference_geo\": \"not_available\", \"speed\": \"standard\"}}, \"requestId\": \"req_fxc8246815949e4a8e1937c1\"}\n{\"parentUuid\": \"5c4b98ab-52c5-461b-a823-7ebc57aedcbe\", \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"assistant\", \"uuid\": \"e65b58e3-f862-4611-ac48-3d992a04ba6e\", \"timestamp\": \"2026-10-16T15:40:11.370Z\", \"message\": {\"model\": \"claude-opus-5-5\", \"id\": \"msg_fx033326cc80b94c2d99c8c3\", \"type\": \"message\", \"role\": \"assistant\", \"content\": [{\"type\": \"tool_use\", \"id\": \"toolu_fxfa1e53ade73a011c4bf8\", \"name\": \"Bash\", \"input\": {\"command\": \"npm run bench -- --watch\", \"description\": \"Start bench in watch mode\"}}], \"stop_reason\": \"tool_use\", \"usage\": {\"input_tokens\": 2, \"cache_creation_input_tokens\": 1900, \"cache_read_input_tokens\": 22500, \"output_tokens\": 260, \"server_tool_use\": {\"web_search_requests\": 0, \"web_fetch_requests\": 0}, \"service_tier\": \"standard\", \"cache_creation\": {\"ephemeral_5m_input_tokens\": 0, \"ephemeral_1h_input_tokens\": 1900}, \"inference_geo\": \"not_available\", \"speed\": \"standard\"}}, \"requestId\": \"req_fxc8246815949e4a8e1937c1\"}\n{\"parentUuid\": \"e65b58e3-f862-4611-ac48-3d992a04ba6e\", \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"user\", \"uuid\": \"4ee04dcc-5297-45a5-a66a-522bcca127ec\", \"timestamp\": \"2026-10-16T15:40:11.590Z\", \"message\": {\"role\": \"user\", \"content\": [{\"tool_use_id\": \"toolu_fxd971b58fe03f22f412cb\", \"type\": \"tool_result\", \"content\": \"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\", \"is_error\": false}]}}\n{\"parentUuid\": \"4ee04dcc-5297-45a5-a66a-522bcca127ec\", \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"assistant\", \"uuid\": \"d759f8ab-9165-4b8a-ae7f-5a35ee9ca8b4\", \"timestamp\": \"2026-10-16T15:40:15.490Z\", \"message\": {\"model\": \"claude-opus-5-5\", \"id\": \"msg_fxc6449523741abd12086952\", \"type\": \"message\", \"role\": \"assistant\", \"content\": [{\"type\": \"tool_use\", \"id\": \"toolu_fx5db04d66cc8b6ddf36d6\", \"name\": \"Task\", \"input\": {\"description\": \"整理基准用例\", \"subagent_type\": \"general-purpose\", \"prompt\": \"列出需要覆盖的场景\"}}], \"stop_reason\": \"tool_use\", \"usage\": {\"input_tokens\": 2, \"cache_creation_input_tokens\": 3100, \"cache_read_input_tokens\": 24400, \"output_tokens\": 140, \"server_tool_use\": {\"web_search_requests\": 0, \"web_fetch_requests\": 0}, \"service_tier\": \"standard\", \"cache_creation\": {\"ephemeral_5m_input_tokens\": 0, \"ephemeral_1h_input_tokens\": 3100}, \"inference_geo\": \"not_available\", \"speed\": \"standard\"}}, \"requestId\": \"req_fx2c7da9927cd89dca896360\"}\n{\"parentUuid\": \"d759f8ab-9165-4b8a-ae7f-5a35ee9ca8b4\", \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"user\", \"uuid\": \"7f361f6e-ebd2-4f23-af89-0c3227684b8f\", \"timestamp\": \"2026-10-16T15:40:23.540Z\", \"message\": {\"role\": \"user\", \"content\": [{\"tool_use_id\": \"toolu_fx5db04d66cc8b6ddf36d6\", \"type\": \"tool_result\", \"content\": \"需要覆盖：冷启动、热路径、并发。\", \"is_error\": false}]}, \"toolUseResult\": {\"status\": \"completed\", \"agentId\": \"af1x2y3z4w5v6u7t\", \"totalDurationMs\": 7000, \"totalTokens\": 16600}}\n{\"parentUuid\": \"7f361f6e-ebd2-4f23-af89-0c3227684b8f\", \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"assistant\", \"uuid\": \"07e2884c-e109-401d-aa03-36331aabdb2f\", \"timestamp\": \"2026-10-16T15:40:35.140Z\", \"message\": {\"model\": \"claude-opus-5-5\", \"id\": \"msg_fxcfe4e64be256ac9ce59a1b\", \"type\": \"message\", \"role\": \"assistant\", \"content\": [{\"type\": \"server_tool_use\", \"id\": \"srvtoolu_fx1\", \"name\": \"web_search\", \"input\": {\"query\": \"node 24 release notes\"}}], \"stop_reason\": null, \"usage\": {\"input_tokens\": 2, \"cache_creation_input_tokens\": 2600, \"cache_read_input_tokens\": 27500, \"output_tokens\": 410, \"server_tool_use\": {\"web_search_requests\": 3, \"web_fetch_requests\": 0}, \"service_tier\": \"standard\", \"cache_creation\": {\"ephemeral_5m_input_tokens\": 0, \"ephemeral_1h_input_tokens\": 2600}, \"inference_geo\": \"us\", \"speed\": \"standard\"}}, \"requestId\": \"req_fxe5192288abb17b806327ef\"}\n{\"parentUuid\": \"07e2884c-e109-401d-aa03-36331aabdb2f\", \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"assistant\", \"uuid\": \"19796c66-0295-493f-ae48-81de1f4f8394\", \"timestamp\": \"2026-10-16T15:40:35.840Z\", \"message\": {\"model\": \"claude-opus-5-5\", \"id\": \"msg_fxcfe4e64be256ac9ce59a1b\", \"type\": \"message\", \"role\": \"assistant\", \"content\": [{\"type\": \"text\", \"text\": \"Node 24 已进入 LTS。\"}], \"stop_reason\": \"end_turn\", \"usage\": {\"input_tokens\": 2, \"cache_creation_input_tokens\": 2600, \"cache_read_input_tokens\": 27500, \"output_tokens\": 410, \"server_tool_use\": {\"web_search_requests\": 3, \"web_fetch_requests\": 0}, \"service_tier\": \"standard\", \"cache_creation\": {\"ephemeral_5m_input_tokens\": 0, \"ephemeral_1h_input_tokens\": 2600}, \"inference_geo\": \"us\", \"speed\": \"standard\"}}, \"requestId\": \"req_fxe5192288abb17b806327ef\"}\n{\"type\":\"assistant\",\"message\":{\"model\":\"claude-opus-5-5\"\n{\"parentUuid\": \"19796c66-0295-493f-ae48-81de1f4f8394\", \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"assistant\", \"uuid\": \"828f17a7-5963-47f7-a5da-6572cb89e9e5\", \"timestamp\": \"2026-10-16T15:40:41.840Z\", \"message\": {\"model\": \"claude-haiku-5-5\", \"id\": \"msg_fx71d214ee64b522e808bd9e\", \"type\": \"message\", \"role\": \"assistant\", \"content\": [{\"type\": \"text\", \"text\": \"摘要：……\"}], \"stop_reason\": \"end_turn\", \"usage\": {\"input_tokens\": 80000, \"cache_creation_input_tokens\": 6000, \"cache_read_input_tokens\": 15000, \"output_tokens\": 120, \"server_tool_use\": {\"web_search_requests\": 0, \"web_fetch_requests\": 0}, \"service_tier\": \"standard\", \"cache_creation\": {\"ephemeral_5m_input_tokens\": 6000, \"ephemeral_1h_input_tokens\": 0}, \"inference_geo\": \"not_available\", \"speed\": \"standard\"}}, \"requestId\": \"req_fx3b46634fa645c775cc5898\"}\n{\"parentUuid\": \"828f17a7-5963-47f7-a5da-6572cb89e9e5\", \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"assistant\", \"uuid\": \"fd1b777a-97b0-44c8-aa9f-039f1de6b801\", \"timestamp\": \"2026-10-16T15:40:43.840Z\", \"message\": {\"model\": \"claude-x-test-1\", \"id\": \"msg_fxb195e67075be75052fefa4\", \"type\": \"message\", \"role\": \"assistant\", \"content\": [{\"type\": \"text\", \"text\": \"实验模型的回复\"}], \"stop_reason\": \"end_turn\", \"usage\": {\"input_tokens\": 10, \"cache_creation_input_tokens\": 900, \"cache_read_input_tokens\": 0, \"output_tokens\": 50, \"server_tool_use\": {\"web_search_requests\": 0, \"web_fetch_requests\": 0}, \"service_tier\": \"standard\", \"cache_creation\": {\"ephemeral_5m_input_tokens\": 0, \"ephemeral_1h_input_tokens\": 900}, \"inference_geo\": \"not_available\", \"speed\": \"standard\"}}, \"requestId\": \"req_fx694dd75e7f7789790c79c2\"}\n{\"parentUuid\": null, \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"system\", \"uuid\": \"8af3fcee-7e13-4b17-a398-244325045eb5\", \"timestamp\": \"2026-10-16T15:40:47.840Z\", \"subtype\": \"compact_boundary\", \"content\": \"Conversation compacted\", \"level\": \"info\", \"compactMetadata\": {\"trigger\": \"auto\", \"preTokens\": 31337, \"durationMs\": 18000}, \"logicalParentUuid\": \"fd1b777a-97b0-44c8-aa9f-039f1de6b801\"}\n{\"parentUuid\": \"8af3fcee-7e13-4b17-a398-244325045eb5\", \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"user\", \"uuid\": \"948b07b1-8e7a-433c-a73a-c3dca67748fe\", \"timestamp\": \"2026-10-16T15:40:47.870Z\", \"message\": {\"role\": \"user\", \"content\": \"This session is being continued from a previous conversation. Summary: 基准测试已经补了一半。\"}, \"isCompactSummary\": true}\n{\"parentUuid\": \"948b07b1-8e7a-433c-a73a-c3dca67748fe\", \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"user\", \"uuid\": \"4929ae8c-04dd-4f0e-a963-0a5f0c8e504f\", \"timestamp\": \"2026-10-16T15:40:49.870Z\", \"message\": {\"role\": \"user\", \"content\": \"<command-name>/model</command-name>\\n<command-args>claude-opus-5-5</command-args>\"}}\n{\"parentUuid\": \"4929ae8c-04dd-4f0e-a963-0a5f0c8e504f\", \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"user\", \"uuid\": \"c38b8633-c0e1-4b12-a9ba-b8908c6f95eb\", \"timestamp\": \"2026-10-16T15:40:58.870Z\", \"message\": {\"role\": \"user\", \"content\": \"继续，把并发场景补完。\"}}\n{\"parentUuid\": \"c38b8633-c0e1-4b12-a9ba-b8908c6f95eb\", \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"assistant\", \"uuid\": \"240ff0a5-0f7b-461a-aa0c-5b8a8b0e9fe5\", \"timestamp\": \"2026-10-16T15:41:03.470Z\", \"message\": {\"model\": \"claude-opus-5-5\", \"id\": \"msg_fx66a7f973c9c4b7bdb48a86\", \"type\": \"message\", \"role\": \"assistant\", \"content\": [{\"type\": \"tool_use\", \"id\": \"toolu_fx4af406fcffce70144b74\", \"name\": \"Edit\", \"input\": {\"file_path\": \"/Users/demo/code/fixture/src/bench/run.ts\", \"old_string\": \"// TODO\", \"new_string\": \"runConcurrent()\"}}], \"stop_reason\": \"tool_use\", \"usage\": {\"input_tokens\": 3, \"cache_creation_input_tokens\": 9800, \"cache_read_input_tokens\": 0, \"output_tokens\": 95, \"server_tool_use\": {\"web_search_requests\": 0, \"web_fetch_requests\": 0}, \"service_tier\": \"standard\", \"cache_creation\": {\"ephemeral_5m_input_tokens\": 0, \"ephemeral_1h_input_tokens\": 9800}, \"inference_geo\": \"not_available\", \"speed\": \"standard\"}}, \"requestId\": \"req_fxc10db90675bb47ccacfaf2\"}\n{\"parentUuid\": \"240ff0a5-0f7b-461a-aa0c-5b8a8b0e9fe5\", \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"user\", \"uuid\": \"798b6a73-dce0-43b8-a936-79d832568391\", \"timestamp\": \"2026-10-16T15:41:03.580Z\", \"message\": {\"role\": \"user\", \"content\": [{\"tool_use_id\": \"toolu_fx4af406fcffce70144b74\", \"type\": \"tool_result\", \"content\": \"String to replace not found in file.\", \"is_error\": true}]}}\n{\"parentUuid\": \"798b6a73-dce0-43b8-a936-79d832568391\", \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"user\", \"uuid\": \"8585720f-1bba-4c49-af39-d8575ab49445\", \"timestamp\": \"2026-10-16T15:41:05.080Z\", \"message\": {\"role\": \"user\", \"content\": \"[Request interrupted by user]\"}}\n{\"parentUuid\": \"8585720f-1bba-4c49-af39-d8575ab49445\", \"isSidechain\": true, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"assistant\", \"uuid\": \"85637dd7-5c8e-46b7-a758-6d3193b9fb30\", \"timestamp\": \"2026-10-16T15:41:06.280Z\", \"message\": {\"model\": \"claude-sonnet-5-5\", \"id\": \"msg_fx_inline\", \"type\": \"message\", \"role\": \"assistant\", \"content\": [{\"type\": \"text\", \"text\": \"内联子代理\"}], \"stop_reason\": \"end_turn\", \"usage\": {\"input_tokens\": 2, \"cache_creation_input_tokens\": 800, \"cache_read_input_tokens\": 0, \"output_tokens\": 40, \"server_tool_use\": {\"web_search_requests\": 0, \"web_fetch_requests\": 0}, \"service_tier\": \"standard\", \"cache_creation\": {\"ephemeral_5m_input_tokens\": 0, \"ephemeral_1h_input_tokens\": 800}, \"inference_geo\": \"not_available\", \"speed\": \"standard\"}}, \"requestId\": \"req_fx_inline\"}\n{\"parentUuid\": \"8585720f-1bba-4c49-af39-d8575ab49445\", \"isSidechain\": false, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"system\", \"uuid\": \"5d764819-7aa6-47c0-a9f9-7872dcd91133\", \"timestamp\": \"2026-10-16T15:41:06.310Z\", \"subtype\": \"turn_duration\", \"durationMs\": 41000, \"messageCount\": 6}\n{\"type\": \"ai-title\", \"aiTitle\": \"fixture 基准测试\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\"}\n{\"type\": \"custom-title\", \"customTitle\": \"夹具：基准测试与联网\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\"}\n{\"type\": \"last-prompt\", \"leafUuid\": \"5d764819-7aa6-47c0-a9f9-7872dcd91133\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\"}\n{\"type\": \"cost-state\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"totalCostUSD\": 0.1, \"startTime\": 1, \"modelUsage\": {\"claude-opus-5-5\": {\"inputTokens\": 1, \"outputTokens\": 1, \"cacheReadInputTokens\": 0, \"cacheCreationInputTokens\": 0, \"costUSD\": 0.1}}}\n{\"type\": \"cost-state\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"totalCostUSD\": 0.5, \"startTime\": 1, \"modelUsage\": {\"claude-opus-5-5\": {\"inputTokens\": 7, \"outputTokens\": 900, \"cacheReadInputTokens\": 50000, \"cacheCreationInputTokens\": 30000, \"costUSD\": 0.4}, \"claude-haiku-4-5-20251001\": {\"inputTokens\": 700, \"outputTokens\": 20, \"cacheReadInputTokens\": 0, \"cacheCreationInputTokens\": 0, \"costUSD\": 0.1}}}\n{\"type\": \"cost-state\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"totalCostUSD\": 0.25, \"startTime\": 2, \"modelUsage\": {\"claude-opus-5-5[1m]\": {\"inputTokens\": 5, \"outputTokens\": 100, \"cacheReadInputTokens\": 0, \"cacheCreationInputTokens\": 9800, \"costUSD\": 0.25}}}\n",
  "-Users-demo-code-fixture/5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54/subagents/agent-af1x2y3z4w5v6u7t.jsonl": "{\"parentUuid\": null, \"isSidechain\": true, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"user\", \"uuid\": \"6aa87bc2-f855-460a-a09e-a05949e4c53c\", \"timestamp\": \"2026-10-16T15:40:16.290Z\", \"agentId\": \"af1x2y3z4w5v6u7t\", \"message\": {\"role\": \"user\", \"content\": \"列出需要覆盖的场景\"}}\n{\"parentUuid\": \"6aa87bc2-f855-460a-a09e-a05949e4c53c\", \"isSidechain\": true, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"assistant\", \"uuid\": \"f870f14e-7682-414f-a273-6b12b06daf1d\", \"timestamp\": \"2026-10-16T15:40:18.890Z\", \"agentId\": \"af1x2y3z4w5v6u7t\", \"message\": {\"model\": \"claude-sonnet-5-5\", \"id\": \"msg_fxfc423eee719bb34e02aaca\", \"type\": \"message\", \"role\": \"assistant\", \"content\": [{\"type\": \"text\", \"text\": \"看看源码结构。\"}], \"stop_reason\": null, \"usage\": {\"input_tokens\": 4, \"cache_creation_input_tokens\": 15800, \"cache_read_input_tokens\": 0, \"output_tokens\": 3, \"server_tool_use\": {\"web_search_requests\": 0, \"web_fetch_requests\": 0}, \"service_tier\": \"standard\", \"cache_creation\": {\"ephemeral_5m_input_tokens\": 0, \"ephemeral_1h_input_tokens\": 15800}, \"inference_geo\": \"us\", \"speed\": \"standard\"}}, \"requestId\": \"req_fxad5f3cc410b3776d52750b\"}\n{\"parentUuid\": \"f870f14e-7682-414f-a273-6b12b06daf1d\", \"isSidechain\": true, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"assistant\", \"uuid\": \"016c9f04-4a22-47dd-ac47-e84d7dca4029\", \"timestamp\": \"2026-10-16T15:40:19.590Z\", \"agentId\": \"af1x2y3z4w5v6u7t\", \"message\": {\"model\": \"claude-sonnet-5-5\", \"id\": \"msg_fxfc423eee719bb34e02aaca\", \"type\": \"message\", \"role\": \"assistant\", \"content\": [{\"type\": \"tool_use\", \"id\": \"toolu_fx28934e8bca354b4dd2c6\", \"name\": \"Glob\", \"input\": {\"pattern\": \"src/**/*.ts\"}}], \"stop_reason\": \"tool_use\", \"usage\": {\"input_tokens\": 4, \"cache_creation_input_tokens\": 15800, \"cache_read_input_tokens\": 0, \"output_tokens\": 90, \"server_tool_use\": {\"web_search_requests\": 0, \"web_fetch_requests\": 0}, \"service_tier\": \"standard\", \"cache_creation\": {\"ephemeral_5m_input_tokens\": 0, \"ephemeral_1h_input_tokens\": 15800}, \"inference_geo\": \"us\", \"speed\": \"standard\"}}, \"requestId\": \"req_fxad5f3cc410b3776d52750b\"}\n{\"parentUuid\": \"016c9f04-4a22-47dd-ac47-e84d7dca4029\", \"isSidechain\": true, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"user\", \"uuid\": \"cbbd8010-fb3a-45a7-a20a-c493168bcc24\", \"timestamp\": \"2026-10-16T15:40:19.740Z\", \"agentId\": \"af1x2y3z4w5v6u7t\", \"message\": {\"role\": \"user\", \"content\": [{\"tool_use_id\": \"toolu_fx28934e8bca354b4dd2c6\", \"type\": \"tool_result\", \"content\": \"src/a.ts\\nsrc/b.ts\", \"is_error\": false}]}}\n{\"parentUuid\": \"cbbd8010-fb3a-45a7-a20a-c493168bcc24\", \"isSidechain\": true, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"assistant\", \"uuid\": \"7ccd4820-d86b-426c-a0ed-9ebb322a90e7\", \"timestamp\": \"2026-10-16T15:40:23.040Z\", \"agentId\": \"af1x2y3z4w5v6u7t\", \"message\": {\"model\": \"claude-sonnet-5-5\", \"id\": \"msg_fx2d0e40624521ec1fda2b42\", \"type\": \"message\", \"role\": \"assistant\", \"content\": [{\"type\": \"text\", \"text\": \"需要覆盖：冷启动、热路径、并发。\"}], \"stop_reason\": \"end_turn\", \"usage\": {\"input_tokens\": 2, \"cache_creation_input_tokens\": 420, \"cache_read_input_tokens\": 15800, \"output_tokens\": 330, \"server_tool_use\": {\"web_search_requests\": 0, \"web_fetch_requests\": 0}, \"service_tier\": \"standard\", \"cache_creation\": {\"ephemeral_5m_input_tokens\": 0, \"ephemeral_1h_input_tokens\": 420}, \"inference_geo\": \"us\", \"speed\": \"standard\"}}, \"requestId\": \"req_fxa68d4617ef709c576c1cfd\"}\n",
  "-Users-demo-code-fixture/5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54/subagents/agent-af1x2y3z4w5v6u7t.meta.json": "{\"agentType\": \"general-purpose\", \"description\": \"整理基准用例\", \"toolUseId\": \"toolu_fx5db04d66cc8b6ddf36d6\"}",
  "-Users-demo-code-fixture/5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54/subagents/workflows/wf_1/agent-aw9f8e7d6c5b4a3.jsonl": "{\"parentUuid\": null, \"isSidechain\": true, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"user\", \"uuid\": \"605557e4-12af-4dce-a8cf-1341fd4ef053\", \"timestamp\": \"2026-10-16T15:40:23.940Z\", \"agentId\": \"aw9f8e7d6c5b4a3\", \"message\": {\"role\": \"user\", \"content\": \"审查基准脚本\"}}\n{\"parentUuid\": \"605557e4-12af-4dce-a8cf-1341fd4ef053\", \"isSidechain\": true, \"userType\": \"external\", \"cwd\": \"/Users/demo/code/fixture\", \"sessionId\": \"5e8d1c2b-7a90-4f3e-b6d1-0c9a8e7f6d54\", \"version\": \"2.1.299\", \"gitBranch\": \"feat/x\", \"type\": \"assistant\", \"uuid\": \"13c33eb3-1ca1-4393-ac16-de41d7aacfc6\", \"timestamp\": \"2026-10-16T15:40:25.740Z\", \"agentId\": \"aw9f8e7d6c5b4a3\", \"message\": {\"model\": \"claude-haiku-5-5\", \"id\": \"msg_fx73c47d2d813bcde3c3f926\", \"type\": \"message\", \"role\": \"assistant\", \"content\": [{\"type\": \"text\", \"text\": \"看起来没问题。\"}], \"stop_reason\": \"end_turn\", \"usage\": {\"input_tokens\": 5, \"cache_creation_input_tokens\": 1200, \"cache_read_input_tokens\": 0, \"output_tokens\": 60, \"server_tool_use\": {\"web_search_requests\": 0, \"web_fetch_requests\": 0}, \"service_tier\": \"standard\", \"cache_creation\": {\"ephemeral_5m_input_tokens\": 0, \"ephemeral_1h_input_tokens\": 1200}, \"inference_geo\": \"not_available\", \"speed\": \"standard\"}}, \"requestId\": \"req_fx828b7f658b29f3b05bf972\"}\n",
  "-Users-demo-code-fixture/notes.txt": "不是会话文件，应被忽略"
 }
};

// 与页面同口径的显示格式（只用于比对显示文本，数值本身断 data-* 原值）
function fUSD(x) {
  const a = Math.abs(x);
  if (a === 0) return '$0';
  if (a >= 1000) return (x < 0 ? '-$' : '$') + Math.round(a).toLocaleString('en-US');
  if (a >= 1) return (x < 0 ? '-$' : '$') + a.toFixed(2);
  if (a >= 0.01) return (x < 0 ? '-$' : '$') + a.toFixed(3);
  return (x < 0 ? '-$' : '$') + a.toFixed(4);
}
function fDur(ms) {
  if (ms < 1000) return Math.round(ms) + 'ms';
  if (ms < 60000) return (ms / 1000).toFixed(1) + 's';
  const s = Math.round(ms / 1000);
  if (s < 3600) return Math.floor(s / 60) + 'm ' + ('0' + (s % 60)).slice(-2) + 's';
  return Math.floor(s / 3600) + 'h ' + ('0' + Math.floor((s % 3600) / 60)).slice(-2) + 'm';
}
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));

export default async ({ page, toolURL, screenshot, assert }) => {
  const S1 = '7d0c2a51-3f6e-4b8a-9c1d-2e5f8a9b0c11', S2 = 'c41e9b07-58a2-4d3c-8f61-0a9d7e3b2f40', S3 = '1b7f3e88-0c4d-4e21-a6b9-5d2c8e7f9a03';
  const FX = ORACLE.fixture.id;
  const rev = () => page.evaluate(() => +(document.body.dataset.rev || 0));
  const afterRev = (r0) => page.waitForFunction((r) => +(document.body.dataset.rev || 0) > r, r0, { timeout: 10000 });
  const onTab = async (t) => {
    await page.click('#sl-tab-' + t);
    await page.waitForFunction((x) => !document.getElementById('pane-' + x).hidden, t, { timeout: 10000 });
  };
  const dataNum = (sel, attr) => page.$eval(sel, (n, a) => Number(n.getAttribute(a)), attr);

  await page.goto(toolURL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => document.body.dataset.rev);

  // ── 0. 空状态：返回链接、隐藏的进度条真的隐藏（断计算样式）
  assert(await page.locator('a[href="../../"]').first().textContent() === '← 返回工具集', '顶部要有返回工具集链接');
  assert(await page.$eval('#sl-prog', (n) => getComputedStyle(n).display) === 'none', '空闲时进度条应隐藏（计算样式）');
  assert(await page.$eval('#sl-sempty', (n) => getComputedStyle(n).display) !== 'none', '空账本应显示空状态');
  assert(await page.$eval('#sl-stw', (n) => getComputedStyle(n).display) === 'none', '空账本时会话表应隐藏');

  // ── 1. 载入示例：三个会话的成本 = Python 真值
  await page.click('#sl-demo');
  await page.waitForFunction(() => document.querySelectorAll('#sl-sbody tr').length === 3, null, { timeout: 10000 });
  for (const sid of [S1, S2, S3]) {
    const v = await dataNum(`#sl-sbody tr[data-sid="${sid}"] .sl-s-cost`, 'data-usd');
    assert(near(v, ORACLE.demo[sid].cost, 1e-12), `示例 ${sid.slice(0, 8)} 成本 ${v} ≠ ${ORACLE.demo[sid].cost}`);
    const txt = await page.$eval(`#sl-sbody tr[data-sid="${sid}"] .sl-s-cost`, (n) => n.textContent.trim());
    assert(txt === fUSD(ORACLE.demo[sid].cost), `示例成本显示 ${txt} ≠ ${fUSD(ORACLE.demo[sid].cost)}`);
  }
  assert(await page.$eval('#sl-ledger-sum', (n) => n.getAttribute('data-n')) === '0', '示例不应写进本机账本');
  // 搜索 / 排序
  let r0 = await rev();
  await page.fill('#sl-q', 'weekly');
  await afterRev(r0);
  assert(await page.$$eval('#sl-sbody tr', (t) => t.length) === 1, '搜索 weekly 应只剩 1 行');
  r0 = await rev();
  await page.fill('#sl-q', '');
  await afterRev(r0);
  r0 = await rev();
  await page.click('#sl-stbl .sl-th-btn[data-sort="cost"]');
  await afterRev(r0);
  const costOrder = await page.$$eval('#sl-sbody .sl-s-cost', (ns) => ns.map((n) => Number(n.getAttribute('data-usd'))));
  assert(costOrder.every((v, i) => i === 0 || costOrder[i - 1] >= v), `按成本排序应降序：${costOrder}`);

  // ── 2. 解剖：示例 1 的 KPI 全部对真值
  await page.click(`#sl-sbody .sl-open[data-sid="${S1}"]`);
  await page.waitForFunction(() => !document.getElementById('pane-anatomy').hidden && !document.getElementById('sl-a-body').hidden);
  const E1 = ORACLE.demo[S1];
  assert(near(await dataNum('#sl-k-cost', 'data-v'), E1.cost, 1e-12), '解剖：成本');
  assert(await dataNum('#sl-k-calls', 'data-v') === E1.calls, '解剖：调用数');
  assert(await dataNum('#sl-k-turns', 'data-v') === E1.turns, '解剖：轮次');
  assert(await dataNum('#sl-k-tools', 'data-v') === E1.tools, '解剖：工具数');
  assert(near(await dataNum('#sl-k-hit', 'data-v'), E1.hit, 1e-12), '解剖：缓存命中率');
  assert(await dataNum('#sl-k-peak', 'data-v') === E1.ctxPeak, '解剖：峰值上下文');
  assert(await dataNum('#sl-k-wall', 'data-v') === E1.wallMs, '解剖：墙钟时长');
  assert(await dataNum('#sl-k-toolms', 'data-v') === E1.toolMs, '解剖：工具累计耗时');
  assert((await page.textContent('#sl-k-turns')).includes('回退分支调用 ' + E1.offCalls + ' 次'), '解剖：回退分支调用数');
  // 成本构成条：各段之和 = 总成本，且宽度占比与金额一致（几何断言）
  const parts = await page.$$eval('#sl-costleg li', (ls) => ls.map((l) => Number(l.getAttribute('data-usd'))));
  assert(near(parts.reduce((a, b) => a + b, 0), E1.cost, 1e-12), `成本构成之和 ${parts} ≠ ${E1.cost}`);
  const segW = await page.$$eval('#sl-costbar i', (is) => is.map((i) => i.getBoundingClientRect().width));
  const barW = await page.$eval('#sl-costbar', (n) => n.getBoundingClientRect().width);
  assert(Math.abs(segW.reduce((a, b) => a + b, 0) - barW) < 2, `成本条各段宽度之和 ${segW} 应铺满 ${barW}`);
  // 对账：逐模型结论
  const verdicts = await page.$$eval('#sl-recontbl tbody tr', (rs) => Object.fromEntries(rs.map((r) => [r.getAttribute('data-model'), r.getAttribute('data-verdict')])));
  assert(JSON.stringify(verdicts) === JSON.stringify(E1.verdicts), `对账结论 ${JSON.stringify(verdicts)} ≠ ${JSON.stringify(E1.verdicts)}`);
  // 工具统计：次数 / 失败 / 累计 / 中位 / P95
  for (const [name, st] of Object.entries(E1.toolStats)) {
    const cells = await page.$$eval(`#sl-tooltbl tr[data-tool="${name}"] td`, (tds) => tds.map((t) => t.textContent.trim()));
    assert(cells.length === 6, `工具 ${name} 行缺失`);
    assert(cells[1] === String(st.n) && cells[2] === (st.err ? String(st.err) : '—') && cells[3] === fDur(st.total) && cells[4] === fDur(st.p50) && cells[5] === fDur(st.p95),
      `工具 ${name}：${cells.slice(1)} ≠ ${[st.n, st.err, fDur(st.total), fDur(st.p50), fDur(st.p95)]}`);
  }
  // 轮次成本
  const turnUsd = await page.$$eval('#sl-turntbl tbody tr', (rs) => rs.map((r) => Number(r.querySelectorAll('td')[6].getAttribute('data-usd'))));
  assert(turnUsd.length === E1.turnCost.length && turnUsd.every((v, i) => near(v, E1.turnCost[i], 1e-12)), `轮次成本 ${turnUsd} ≠ ${E1.turnCost}`);
  assert(await page.$$eval('#sl-turntbl .sl-t-warn', (n) => n.length) === 1, '回退的那一轮要标「已回退」');
  // 瀑布：默认选段数最多的那一轮，段数 = 真值；子代理段缩进在 Task 下面
  const maxSpans = Math.max(...E1.turnSpans);
  assert(await page.$eval('#sl-fig-wf', (n) => Number(n.getAttribute('data-spans'))) === maxSpans, '瀑布段数');
  assert(await page.$$eval('#sl-fig-wf .sl-wf-bar', (n) => n.length) === maxSpans, '瀑布柱数');
  const wfGeom = await page.$$eval('#sl-fig-wf .sl-wf-bar', (bs) => {
    const svg = document.getElementById('sl-fig-wf').getBoundingClientRect();
    return bs.map((b) => { const r = b.getBoundingClientRect(); return { l: r.left - svg.left, r: svg.right - r.right, w: r.width, ms: Number(b.getAttribute('data-ms') || 0) }; });
  });
  assert(wfGeom.every((g) => g.l >= 0 && g.r >= -0.5), '瀑布柱不得越出画布');
  const longest = wfGeom.reduce((a, b) => (b.ms > a.ms ? b : a));
  const k = longest.w / longest.ms;
  const off = wfGeom.filter((g) => g.ms >= 1500 && Math.abs(g.w / g.ms - k) / k > 0.02);
  assert(off.length === 0, `瀑布柱宽应与时长成正比（≥1.5s 的段）：${off.map((g) => g.ms + 'ms→' + g.w.toFixed(1) + 'px').join(', ')}`);
  assert(wfGeom.every((g) => g.w <= longest.w + 0.5), '最长的 span 必须画成最宽的柱（几何与时长一致）');
  const labels = await page.$$eval('#sl-fig-wf .sl-wf-label', (ts) => ts.map((t) => t.textContent));
  const taskIdx = labels.findIndex((t) => t.startsWith('Task'));
  assert(taskIdx >= 0 && labels[taskIdx + 1].includes('Sonnet 5.5'), `子代理的第一段应紧跟在 Task 后面：${labels.slice(taskIdx, taskIdx + 2)}`);
  // 切到另一轮（瀑布按钮）
  r0 = await rev();
  await page.click('#sl-turntbl button[data-turn="2"]');
  await afterRev(r0);
  assert(await page.$eval('#sl-fig-wf', (n) => Number(n.getAttribute('data-spans'))) === E1.turnSpans[2], '切换到第 3 轮后段数应变');
  // 展开步骤
  r0 = await rev();
  await page.click('#sl-turntbl button[data-steps="0"]');
  await afterRev(r0);
  assert(await page.$eval('#sl-steps-0', (n) => getComputedStyle(n).display !== 'none' && n.children.length) === E1.turnSpans[0], '步骤列表条数 = 该轮段数');
  // 上下文增长图：三层面积 + 峰值标注真的画出来了；压缩竖线存在
  const ctxTexts = await page.$$eval('#sl-fig-ctx text', (ts) => ts.map((t) => t.textContent));
  assert(ctxTexts.some((t) => t.startsWith('峰值 ')), `上下文图要标峰值：${ctxTexts}`);
  assert(ctxTexts.includes('压缩'), '上下文图要标出压缩');
  assert(await page.$$eval('#sl-fig-ctx path[fill]', (ps) => ps.filter((p) => p.getAttribute('fill') !== 'none').length) === 3, '上下文图应有 3 层面积');
  const env = await page.evaluate(() => {
    const ps = [...document.querySelectorAll('#sl-fig-ctx path[fill]')].filter((p) => p.getAttribute('fill') !== 'none');
    const top = ps[ps.length - 1].getAttribute('d').trim().split(/[ML]/).filter(Boolean).map((s) => s.trim().split(/\s+/).map(Number));
    const half = top.slice(0, Math.ceil(top.length / 2));
    const dot = [...document.querySelectorAll('#sl-fig-ctx circle')].find((c) => c.getAttribute('fill') === '#fff');
    return { minY: Math.min(...half.map((p) => p[1])), dotY: Number(dot.getAttribute('cy')) };
  });
  assert(Math.abs(env.minY - env.dotY) < 0.6, `上下文图顶层包络最高点 ${env.minY} 应正好落在峰值点 ${env.dotY}`);
  const costBars = await page.$$eval('#sl-fig-cost rect[data-call]', (rs) => new Set(rs.map((r) => r.getAttribute('data-call'))).size);
  assert(costBars === E1.calls, `成本图应每次调用一根柱：${costBars} ≠ ${E1.calls}`);
  // 事件
  const evKinds = await page.$$eval('#sl-events dd', (ds) => ds.map((d) => d.getAttribute('data-kind')));
  assert(evKinds.includes('compact') && evKinds.includes('command'), `事件应含压缩与命令：${evKinds}`);
  // 子代理表
  assert(await page.$$eval('#sl-agenttbl tbody tr', (r) => r.length) === E1.agents, '子代理行数');

  // 截一张解剖页留档（人工看图用）
  await page.$eval('#sl-a-body', (n) => n.scrollIntoView());
  await page.screenshot({ path: path.join(os.tmpdir(), 'sl-anatomy-check.png'), fullPage: true });

  // ── 3. 账单：新加坡时区与 UTC 分桶都对真值（示例 3 跨午夜）
  await onTab('billing');
  for (const [tz, exp] of [['Asia/Singapore', ORACLE.demoBillSGT], ['UTC', ORACLE.demoBillUTC]]) {
    r0 = await rev();
    await page.selectOption('#sl-tz', tz);
    await afterRev(r0);
    const rows = await page.$$eval('#sl-billtbl tbody tr', (rs) => rs.map((r) => {
      const td = r.querySelectorAll('td');
      return { key: r.getAttribute('data-key'), sessions: Number(td[1].textContent.replace(/,/g, '')), n: Number(td[2].textContent.replace(/,/g, '')),
        tok: Number(td[7].getAttribute('data-tok')), cost: Number(td[8].getAttribute('data-usd')) };
    }));
    assert(rows.length === exp.length, `${tz} 账单行数 ${rows.length} ≠ ${exp.length}`);
    rows.forEach((r, i) => {
      const e = exp[i];
      assert(r.key === e.key && r.n === e.n && r.tok === e.tok && r.sessions === e.sessions && near(r.cost, e.cost, 1e-12), `${tz} ${JSON.stringify(r)} ≠ ${JSON.stringify(e)}`);
    });
  }
  assert(near(await dataNum('#sl-bill-total', 'data-usd'), ORACLE.demoTotal, 1e-12), '账单合计 = 三个会话之和');
  // 换分组合计不变（守恒）
  for (const by of ['week', 'month', 'project', 'model', 'session']) {
    r0 = await rev();
    await page.selectOption('#sl-by', by);
    await afterRev(r0);
    assert(near(await dataNum('#sl-bill-total', 'data-usd'), ORACLE.demoTotal, 1e-12), `按 ${by} 分组合计应不变`);
  }
  r0 = await rev();
  await page.selectOption('#sl-by', 'day');
  await afterRev(r0);
  // 柱子高度与数值成比例（几何断言）
  const bars = await page.$$eval('#sl-fig-bill .sl-bill-bar', (rs) => {
    const by = {};
    rs.forEach((r) => { const k = r.getAttribute('data-key'); by[k] = (by[k] || 0) + r.getBoundingClientRect().height; });
    return by;
  });
  const plotH = await page.$eval('#sl-fig-bill', (svg) => {
    const fr = [...svg.querySelectorAll('rect')].find((r) => r.getAttribute('fill') === 'none');
    return fr.getBoundingClientRect().height;
  });
  const tallest = Math.max(...Object.values(bars));
  assert(Math.abs(tallest - plotH / 1.12) < 1.5, `最高的柱应占绘图区的 1/1.12：${tallest.toFixed(1)} vs ${(plotH / 1.12).toFixed(1)}`);
  const billRows = ORACLE.demoBillUTC;
  const ratioH = bars[billRows[0].key] / bars[billRows[1].key], ratioV = billRows[0].cost / billRows[1].cost;
  assert(Math.abs(ratioH - ratioV) / ratioV < 0.03, `柱高比 ${ratioH.toFixed(3)} 应 ≈ 金额比 ${ratioV.toFixed(3)}`);

  // ── 4. 价目：featured 档 = 花钱最多的模型；换模型表；改价后所有会话重算；非法输入被拒
  await onTab('pricing');
  assert(await page.$eval('#sl-tiers .sl-tier-ft', (n) => n.getAttribute('data-model')) === ORACLE.demoTopModel, 'featured 档应是花钱最多的模型');
  for (const [id, v] of Object.entries(ORACLE.demoWhatIf)) {
    const got = await dataNum(`#sl-whatif tr[data-model="${id}"] td[data-usd]`, 'data-usd');
    assert(near(got, v, 1e-12), `换成 ${id}：${got} ≠ ${v}`);
  }
  await page.selectOption('#sl-pe-model', 'claude-opus-5-5');
  await page.fill('#sl-pe-out', '-3');
  await page.click('#sl-pe-save');
  assert((await page.textContent('#sl-pe-msg')).includes('这些价格不对'), '负价应被拒');
  r0 = await rev();
  await page.fill('#sl-pe-out', '40');
  await page.click('#sl-pe-save');
  await afterRev(r0);
  await onTab('sessions');
  for (const [sid, v] of Object.entries(ORACLE.demoRepriceOpusOut40)) {
    const got = await dataNum(`#sl-sbody tr[data-sid="${sid}"] .sl-s-cost`, 'data-usd');
    assert(near(got, v, 1e-12), `改价后 ${sid.slice(0, 8)}：${got} ≠ ${v}`);
  }
  await onTab('pricing');
  r0 = await rev();
  await page.click('#sl-pe-reset');
  await afterRev(r0);
  await onTab('sessions');
  assert(near(await dataNum(`#sl-sbody tr[data-sid="${S1}"] .sl-s-cost`, 'data-usd'), E1.cost, 1e-12), '恢复官方价后回到原值');

  // ── 5. 选择文件夹导入夹具（真实目录结构：subagents/ + workflows/ + meta + 一个非会话文件）
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sl-fx-'));
  const root = path.join(dir, 'projects');
  for (const [rel, text] of Object.entries(ORACLE.fixtureText)) {
    const p = path.join(root, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, text);
  }
  await page.setInputFiles('#sl-dir', root);
  await page.waitForFunction(() => /导入完成/.test(document.getElementById('sl-log').textContent), null, { timeout: 15000 });
  const log = await page.textContent('#sl-log');
  assert(log.includes(ORACLE.fixtureFiles + ' 个会话文件') && log.includes('坏行 ' + ORACLE.fixtureBad) && log.includes('忽略非会话文件 1 个'), `导入日志：${log}`);
  assert(await page.$eval('#sl-ledger-sum', (n) => n.getAttribute('data-n')) === '1', '夹具应写进本机账本');
  const fxCost = await dataNum(`#sl-sbody tr[data-sid="${FX}"] .sl-s-cost`, 'data-usd');
  assert(near(fxCost, ORACLE.fixture.cost, 1e-12), `夹具成本 ${fxCost} ≠ ${ORACLE.fixture.cost}`);
  assert((await page.textContent(`#sl-sbody tr[data-sid="${FX}"] .sl-s-cost`)).trim().endsWith('*'), '有未计价调用时成本要带 *');
  await page.click(`#sl-sbody .sl-open[data-sid="${FX}"]`);
  await page.waitForFunction((fx) => !document.getElementById('pane-anatomy').hidden && document.getElementById('sl-a-title').textContent.length > 0, FX);
  const EF = ORACLE.fixture;
  assert((await page.textContent('#sl-a-title')) === EF.title, '夹具标题（自定义标题优先）');
  assert(await dataNum('#sl-k-calls', 'data-v') === EF.calls && await dataNum('#sl-k-tools', 'data-v') === EF.tools && await dataNum('#sl-k-turns', 'data-v') === EF.turns, '夹具调用/工具/轮次');
  assert(await dataNum('#sl-k-toolms', 'data-v') === EF.toolMs && await dataNum('#sl-k-peak', 'data-v') === EF.ctxPeak && await dataNum('#sl-k-wall', 'data-v') === EF.wallMs, '夹具耗时/峰值/墙钟');
  assert(near(await dataNum('#sl-k-hit', 'data-v'), EF.hit, 1e-12), '夹具命中率');
  const fv = await page.$$eval('#sl-recontbl tbody tr', (rs) => Object.fromEntries(rs.map((r) => [r.getAttribute('data-model'), r.getAttribute('data-verdict')])));
  assert(JSON.stringify(fv) === JSON.stringify(EF.verdicts), `夹具对账 ${JSON.stringify(fv)} ≠ ${JSON.stringify(EF.verdicts)}`);
  assert((await page.textContent('#sl-costnote')).includes('claude-x-test-1'), '未计价模型要点名');
  assert((await page.textContent('#sl-recon-sum')).includes('Claude Code 自报 ' + fUSD(EF.csTotal)), `自报总额应按进程相加：${await page.textContent('#sl-recon-sum')} vs ${fUSD(EF.csTotal)}`);
  const fxEv = await page.$$eval('#sl-events dd', (ds) => ds.map((d) => d.getAttribute('data-kind')));
  assert(['compact', 'command', 'interrupt'].every((k) => fxEv.includes(k)), `夹具事件 ${fxEv}`);
  assert(await page.$$eval('#sl-agenttbl tbody tr', (r) => r.length) === EF.agents, '夹具子代理数（含工作流与内联）');
  // 账单（新加坡时区）
  await onTab('billing');
  r0 = await rev();
  await page.selectOption('#sl-tz', 'Asia/Singapore');
  await afterRev(r0);
  const fxRow = await page.$eval(`#sl-billtbl tr[data-key="${ORACLE.fixtureBillSGT[0].key}"]`, (r) => ({ n: r.querySelectorAll('td')[2].textContent, usd: Number(r.querySelectorAll('td')[8].getAttribute('data-usd')) }));
  const demoSameDay = ORACLE.demoBillSGT.find((x) => x.key === ORACLE.fixtureBillSGT[0].key);
  assert(near(fxRow.usd, ORACLE.fixtureBillSGT[0].cost + (demoSameDay ? demoSameDay.cost : 0), 1e-12), '夹具当天账单 = 夹具 + 同日示例');
  // 给未知模型加自定义价
  await onTab('pricing');
  await page.selectOption('#sl-pe-model', '__new');
  await page.fill('#sl-pe-id', 'claude-x-test');
  await page.fill('#sl-pe-label', 'X 测试模型');
  for (const [k, v] of [['in', '1'], ['w5', '1.25'], ['w1', '2'], ['read', '0.1'], ['out', '5']]) await page.fill('#sl-pe-' + k, v);
  r0 = await rev();
  await page.click('#sl-pe-save');
  await afterRev(r0);
  await onTab('sessions');
  assert(near(await dataNum(`#sl-sbody tr[data-sid="${FX}"] .sl-s-cost`, 'data-usd'), ORACLE.fixtureCustomCost, 1e-12), '自定义价后夹具成本');

  // ── 6. 刷新：账本与自定义价都还在；示例不在；会话变成「仅账本」
  await page.reload();
  await page.waitForFunction(() => document.querySelectorAll('#sl-sbody tr').length === 1, null, { timeout: 10000 });
  assert(near(await dataNum(`#sl-sbody tr[data-sid="${FX}"] .sl-s-cost`, 'data-usd'), ORACLE.fixtureCustomCost, 1e-12), '刷新后成本（自定义价持久化）');
  assert((await page.textContent(`#sl-sbody tr[data-sid="${FX}"] .sl-tag`)) === '仅账本', '刷新后应标「仅账本」');
  await page.click(`#sl-sbody .sl-open[data-sid="${FX}"]`);
  await page.waitForFunction(() => !document.getElementById('pane-anatomy').hidden);
  assert(await page.$eval('#sl-a-ledgeronly', (n) => getComputedStyle(n).display) !== 'none', '仅账本的会话要提示重新导入');
  assert(await page.$eval('#sl-a-body', (n) => getComputedStyle(n).display) === 'none', '仅账本时不显示解剖内容');
  await onTab('sessions');

  // ── 7. 备份 → 清空（两步确认）→ 恢复
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#sl-exp-ledger')]);
  const backup = fs.readFileSync(await dl.path(), 'utf8');
  assert(JSON.parse(backup).v === 1 && JSON.parse(backup).s[FX], '备份里应有夹具会话');
  await page.click('#sl-clear');
  assert((await page.textContent('#sl-clear')) === '再点一次确认清空', '第一次点只是上膛');
  assert(await page.$eval('#sl-ledger-sum', (n) => n.getAttribute('data-n')) === '1', '上膛时不应清空');
  await page.click('#sl-clear');
  await page.waitForFunction(() => document.getElementById('sl-ledger-sum').getAttribute('data-n') === '0');
  await page.setInputFiles('#sl-ledger-file', { name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(backup) });
  await page.waitForFunction(() => document.getElementById('sl-ledger-sum').getAttribute('data-n') === '1', null, { timeout: 10000 });
  // 坏备份被拒
  await page.setInputFiles('#sl-ledger-file', { name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"v":9}') });
  await page.waitForFunction(() => /恢复失败/.test(document.getElementById('sl-log').textContent));
  // CSV：表头 + 一行，数值列可解析
  const csv = await page.evaluate(() => window.SLApp.sessionsCsv());
  const lines = csv.replace(new RegExp('^' + String.fromCharCode(0xfeff)), '').trim().split(/\r?\n/);
  assert(lines.length === 2 && lines[0].startsWith('会话ID,标题') && lines[1].startsWith(FX), `CSV：${lines.length} 行`);
  // 删除自定义价 → 回到未计价
  await onTab('pricing');
  await page.selectOption('#sl-pe-model', 'claude-x-test');
  r0 = await rev();
  await page.click('#sl-pe-del');
  await afterRev(r0);
  await onTab('sessions');
  assert(near(await dataNum(`#sl-sbody tr[data-sid="${FX}"] .sl-s-cost`, 'data-usd'), ORACLE.fixture.cost, 1e-12), '删除自定义价后回到未计价成本');

  // ── 8. 键盘：页签方向键
  await page.focus('#sl-tab-sessions');
  await page.keyboard.press('ArrowRight');
  assert(await page.$eval('#sl-tab-anatomy', (n) => n.getAttribute('aria-selected')) === 'true', '→ 键切到下一个页签');
  assert(await page.evaluate(() => document.activeElement.id) === 'sl-tab-anatomy', '焦点跟随页签');
  await page.keyboard.press('End');
  assert(await page.$eval('#sl-tab-about', (n) => n.getAttribute('aria-selected')) === 'true', 'End 键到最后一个页签');

  // ── 9. 渲染守卫（示例 + 夹具都载入后，逐页签 × 逐视口）
  await onTab('sessions');
  await page.click('#sl-demo');
  await page.waitForFunction(() => document.querySelectorAll('#sl-sbody tr').length === 4);
  await page.click(`#sl-sbody .sl-open[data-sid="${S1}"]`);
  await page.waitForFunction(() => !document.getElementById('sl-a-body').hidden);
  const n = await renderGuards(page, {
    assert, tabs: ORACLE.meta.tabs, onTab,
    paneSel: (t) => `#pane-${t}`, panesRoot: '#sl-panes',
    figSel: (t) => `#pane-${t} svg.sl-fig`, cardSel: '.sl-card',
    childSel: '.sl-tw,.sl-wfbox,.sl-figbox,dl,h2,h3,p',
    minControls: 40, minTextsInFig: 4,
  });
  assert(n >= 40, `守卫扫到的控件太少：${n}`);

  // ── 10. 缩略图：解剖页（KPI + 成本构成 + 两张图）
  await onTab('anatomy');
  await page.evaluate(() => { const r = document.getElementById('sl-costbar').closest('.sl-card').getBoundingClientRect(); window.scrollTo(0, window.scrollY + r.top - 16); });
  await page.waitForFunction(() => document.querySelectorAll('#sl-fig-ctx path').length > 0);
  await screenshot('thumb.png');
};
