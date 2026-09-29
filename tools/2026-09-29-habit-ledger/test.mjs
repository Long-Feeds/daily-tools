/* 习惯账本 · 集成测试
 *
 * 真值全部来自 oracle/truth.json（oracle/scenario.py 调 oracle.py：Python datetime + 前向状态机，
 * 与页面引擎不同算法），由 inject-oracle.mjs **机械注入**下面的 ORACLE 块 —— 本文件不手打任何统计数值。
 * 渲染守卫一律 import（render-guards.mjs）。
 */
import { renderGuards } from '/Users/lon/.agents/cron/daily-website/tools/render-guards.mjs';

const ORACLE = {
 "meta": {
  "tabs": [
   "today",
   "heat",
   "stats",
   "manage",
   "notes"
  ],
  "T": "2026-09-29",
  "source": "oracle/scenario.py → oracle.py（Python datetime 独立实现）"
 },
 "habits": [
  {
   "id": "run",
   "name": "晨跑",
   "kind": "check",
   "target": 1,
   "unit": "",
   "sched": {
    "type": "daily"
   },
   "start": "2026-09-01",
   "color": "#533afd",
   "archived": false,
   "log": {
    "2026-09-01": 1,
    "2026-09-02": 1,
    "2026-09-03": 1,
    "2026-09-04": 1,
    "2026-09-05": 1,
    "2026-09-06": 1,
    "2026-09-07": 1,
    "2026-09-08": 1,
    "2026-09-09": 1,
    "2026-09-11": 1,
    "2026-09-12": 1,
    "2026-09-13": 1,
    "2026-09-14": 1,
    "2026-09-15": 1,
    "2026-09-16": 1,
    "2026-09-17": 1,
    "2026-09-18": 1,
    "2026-09-19": 1,
    "2026-09-21": 1,
    "2026-09-22": 1,
    "2026-09-23": 1,
    "2026-09-24": 1,
    "2026-09-25": 1,
    "2026-09-26": 1,
    "2026-09-27": 1,
    "2026-09-28": 1
   },
   "skips": {
    "2026-09-20": 1
   }
  },
  {
   "id": "water",
   "name": "喝水",
   "kind": "count",
   "target": 8,
   "unit": "杯",
   "sched": {
    "type": "daily"
   },
   "start": "2026-06-01",
   "color": "#0073e6",
   "archived": false,
   "log": {
    "2026-06-01": 9,
    "2026-06-02": 2,
    "2026-06-04": 6,
    "2026-06-06": 9,
    "2026-06-07": 9,
    "2026-06-09": 4,
    "2026-06-10": 8,
    "2026-06-11": 9,
    "2026-06-12": 3,
    "2026-06-13": 7,
    "2026-06-14": 9,
    "2026-06-15": 9,
    "2026-06-16": 8,
    "2026-06-17": 9,
    "2026-06-18": 8,
    "2026-06-19": 8,
    "2026-06-20": 8,
    "2026-06-21": 6,
    "2026-06-22": 9,
    "2026-06-23": 8,
    "2026-06-24": 8,
    "2026-06-25": 8,
    "2026-06-26": 9,
    "2026-06-27": 8,
    "2026-06-28": 3,
    "2026-06-29": 8,
    "2026-06-30": 9,
    "2026-07-01": 8,
    "2026-07-02": 8,
    "2026-07-03": 6,
    "2026-07-04": 5,
    "2026-07-05": 8,
    "2026-07-06": 5,
    "2026-07-07": 8,
    "2026-07-08": 8,
    "2026-07-09": 8,
    "2026-07-10": 8,
    "2026-07-11": 8,
    "2026-07-12": 9,
    "2026-07-13": 8,
    "2026-07-15": 6,
    "2026-07-17": 8,
    "2026-07-18": 8,
    "2026-07-19": 9,
    "2026-07-20": 9,
    "2026-07-21": 9,
    "2026-07-22": 9,
    "2026-07-23": 8,
    "2026-07-24": 8,
    "2026-07-25": 8,
    "2026-07-26": 8,
    "2026-07-27": 7,
    "2026-07-28": 8,
    "2026-07-29": 5,
    "2026-07-30": 8,
    "2026-07-31": 4,
    "2026-08-01": 4,
    "2026-08-02": 8,
    "2026-08-03": 8,
    "2026-08-04": 8,
    "2026-08-05": 9,
    "2026-08-06": 9,
    "2026-08-07": 8,
    "2026-08-09": 9,
    "2026-08-10": 8,
    "2026-08-11": 8,
    "2026-08-12": 8,
    "2026-08-13": 8,
    "2026-08-14": 9,
    "2026-08-16": 8,
    "2026-08-17": 9,
    "2026-08-18": 2,
    "2026-08-19": 8,
    "2026-08-20": 8,
    "2026-08-21": 8,
    "2026-08-22": 8,
    "2026-08-23": 8,
    "2026-08-24": 8,
    "2026-08-25": 8,
    "2026-08-26": 8,
    "2026-08-27": 8,
    "2026-08-28": 8,
    "2026-08-29": 8,
    "2026-08-30": 9,
    "2026-08-31": 8,
    "2026-09-01": 6,
    "2026-09-02": 7,
    "2026-09-03": 4,
    "2026-09-04": 3,
    "2026-09-05": 6,
    "2026-09-06": 7,
    "2026-09-07": 8,
    "2026-09-08": 9,
    "2026-09-09": 8,
    "2026-09-10": 8,
    "2026-09-11": 8,
    "2026-09-13": 8,
    "2026-09-15": 8,
    "2026-09-16": 9,
    "2026-09-17": 8,
    "2026-09-18": 8,
    "2026-09-19": 8,
    "2026-09-20": 8,
    "2026-09-21": 9,
    "2026-09-22": 9,
    "2026-09-23": 8,
    "2026-09-25": 9,
    "2026-09-26": 9,
    "2026-09-27": 8,
    "2026-09-28": 8,
    "2026-09-29": 6
   },
   "skips": {}
  },
  {
   "id": "gym",
   "name": "健身",
   "kind": "check",
   "target": 1,
   "unit": "",
   "sched": {
    "type": "weekly",
    "times": 3
   },
   "start": "2026-03-04",
   "color": "#ea2261",
   "archived": false,
   "log": {
    "2026-03-04": 1,
    "2026-03-05": 1,
    "2026-03-06": 1,
    "2026-03-08": 1,
    "2026-03-10": 1,
    "2026-03-13": 1,
    "2026-03-15": 1,
    "2026-03-16": 1,
    "2026-03-18": 1,
    "2026-03-19": 1,
    "2026-03-20": 1,
    "2026-03-24": 1,
    "2026-03-26": 1,
    "2026-03-31": 1,
    "2026-04-07": 1,
    "2026-04-10": 1,
    "2026-04-11": 1,
    "2026-04-14": 1,
    "2026-04-17": 1,
    "2026-04-25": 1,
    "2026-04-26": 1,
    "2026-04-29": 1,
    "2026-05-02": 1,
    "2026-05-03": 1,
    "2026-05-06": 1,
    "2026-05-08": 1,
    "2026-05-10": 1,
    "2026-05-11": 1,
    "2026-05-12": 1,
    "2026-05-14": 1,
    "2026-05-15": 1,
    "2026-05-16": 1,
    "2026-05-18": 1,
    "2026-05-19": 1,
    "2026-05-24": 1,
    "2026-05-29": 1,
    "2026-05-31": 1,
    "2026-06-01": 1,
    "2026-06-03": 1,
    "2026-06-06": 1,
    "2026-06-08": 1,
    "2026-06-09": 1,
    "2026-06-12": 1,
    "2026-06-13": 1,
    "2026-06-14": 1,
    "2026-06-16": 1,
    "2026-06-18": 1,
    "2026-06-22": 1,
    "2026-06-23": 1,
    "2026-06-24": 1,
    "2026-06-25": 1,
    "2026-06-26": 1,
    "2026-07-02": 1,
    "2026-07-07": 1,
    "2026-07-08": 1,
    "2026-07-10": 1,
    "2026-07-12": 1,
    "2026-07-21": 1,
    "2026-07-22": 1,
    "2026-07-23": 1,
    "2026-07-26": 1,
    "2026-07-27": 1,
    "2026-07-30": 1,
    "2026-07-31": 1,
    "2026-08-02": 1,
    "2026-08-04": 1,
    "2026-08-05": 1,
    "2026-08-08": 1,
    "2026-08-18": 1,
    "2026-08-19": 1,
    "2026-08-20": 1,
    "2026-08-21": 1,
    "2026-08-22": 1,
    "2026-08-24": 1,
    "2026-08-25": 1,
    "2026-08-31": 1,
    "2026-09-01": 1,
    "2026-09-04": 1,
    "2026-09-05": 1,
    "2026-09-06": 1,
    "2026-09-07": 1,
    "2026-09-10": 1,
    "2026-09-11": 1,
    "2026-09-12": 1,
    "2026-09-14": 1,
    "2026-09-15": 1,
    "2026-09-16": 1,
    "2026-09-20": 1,
    "2026-09-22": 1,
    "2026-09-23": 1,
    "2026-09-24": 1,
    "2026-09-26": 1
   },
   "skips": {
    "2026-07-13": 1,
    "2026-07-14": 1,
    "2026-07-15": 1,
    "2026-07-16": 1,
    "2026-07-17": 1,
    "2026-07-18": 1,
    "2026-07-19": 1
   }
  },
  {
   "id": "words",
   "name": "背单词",
   "kind": "check",
   "target": 1,
   "unit": "",
   "sched": {
    "type": "weekdays",
    "days": [
     1,
     2,
     3,
     4,
     5
    ]
   },
   "start": "2025-11-03",
   "color": "#0a8f6c",
   "archived": false,
   "log": {
    "2025-11-03": 1,
    "2025-11-04": 1,
    "2025-11-05": 1,
    "2025-11-06": 1,
    "2025-11-07": 1,
    "2025-11-11": 1,
    "2025-11-12": 1,
    "2025-11-13": 1,
    "2025-11-14": 1,
    "2025-11-17": 1,
    "2025-11-18": 1,
    "2025-11-19": 1,
    "2025-11-20": 1,
    "2025-11-21": 1,
    "2025-11-24": 1,
    "2025-11-25": 1,
    "2025-11-26": 1,
    "2025-11-27": 1,
    "2025-11-28": 1,
    "2025-11-30": 1,
    "2025-12-01": 1,
    "2025-12-02": 1,
    "2025-12-03": 1,
    "2025-12-04": 1,
    "2025-12-05": 1,
    "2025-12-08": 1,
    "2025-12-09": 1,
    "2025-12-10": 1,
    "2025-12-11": 1,
    "2025-12-12": 1,
    "2025-12-15": 1,
    "2025-12-16": 1,
    "2025-12-17": 1,
    "2025-12-18": 1,
    "2025-12-19": 1,
    "2025-12-22": 1,
    "2025-12-23": 1,
    "2025-12-25": 1,
    "2025-12-26": 1,
    "2025-12-28": 1,
    "2025-12-29": 1,
    "2025-12-30": 1,
    "2025-12-31": 1,
    "2026-01-01": 1,
    "2026-01-02": 1,
    "2026-01-04": 1,
    "2026-01-05": 1,
    "2026-01-06": 1,
    "2026-01-07": 1,
    "2026-01-08": 1,
    "2026-01-09": 1,
    "2026-01-13": 1,
    "2026-01-16": 1,
    "2026-01-19": 1,
    "2026-01-20": 1,
    "2026-01-21": 1,
    "2026-01-22": 1,
    "2026-01-23": 1,
    "2026-01-27": 1,
    "2026-01-29": 1,
    "2026-01-30": 1,
    "2026-02-02": 1,
    "2026-02-03": 1,
    "2026-02-04": 1,
    "2026-02-05": 1,
    "2026-02-06": 1,
    "2026-02-09": 1,
    "2026-02-11": 1,
    "2026-02-12": 1,
    "2026-02-13": 1,
    "2026-02-16": 1,
    "2026-02-17": 1,
    "2026-02-18": 1,
    "2026-02-19": 1,
    "2026-02-20": 1,
    "2026-02-23": 1,
    "2026-02-24": 1,
    "2026-02-25": 1,
    "2026-03-02": 1,
    "2026-03-03": 1,
    "2026-03-04": 1,
    "2026-03-05": 1,
    "2026-03-06": 1,
    "2026-03-10": 1,
    "2026-03-11": 1,
    "2026-03-12": 1,
    "2026-03-13": 1,
    "2026-03-16": 1,
    "2026-03-17": 1,
    "2026-03-18": 1,
    "2026-03-19": 1,
    "2026-03-20": 1,
    "2026-03-23": 1,
    "2026-03-24": 1,
    "2026-03-25": 1,
    "2026-03-26": 1,
    "2026-03-30": 1,
    "2026-03-31": 1,
    "2026-04-01": 1,
    "2026-04-02": 1,
    "2026-04-04": 1,
    "2026-04-06": 1,
    "2026-04-07": 1,
    "2026-04-08": 1,
    "2026-04-09": 1,
    "2026-04-10": 1,
    "2026-04-13": 1,
    "2026-04-14": 1,
    "2026-04-15": 1,
    "2026-04-16": 1,
    "2026-04-17": 1,
    "2026-04-21": 1,
    "2026-04-23": 1,
    "2026-04-24": 1,
    "2026-04-27": 1,
    "2026-04-28": 1,
    "2026-04-29": 1,
    "2026-04-30": 1,
    "2026-05-01": 1,
    "2026-05-04": 1,
    "2026-05-06": 1,
    "2026-05-07": 1,
    "2026-05-08": 1,
    "2026-05-11": 1,
    "2026-05-14": 1,
    "2026-05-15": 1,
    "2026-05-19": 1,
    "2026-05-20": 1,
    "2026-05-21": 1,
    "2026-05-22": 1,
    "2026-05-25": 1,
    "2026-05-26": 1,
    "2026-05-28": 1,
    "2026-05-29": 1,
    "2026-06-01": 1,
    "2026-06-02": 1,
    "2026-06-03": 1,
    "2026-06-04": 1,
    "2026-06-05": 1,
    "2026-06-06": 1,
    "2026-06-08": 1,
    "2026-06-09": 1,
    "2026-06-10": 1,
    "2026-06-11": 1,
    "2026-06-14": 1,
    "2026-06-15": 1,
    "2026-06-16": 1,
    "2026-06-17": 1,
    "2026-06-19": 1,
    "2026-06-22": 1,
    "2026-06-23": 1,
    "2026-06-25": 1,
    "2026-06-26": 1,
    "2026-06-29": 1,
    "2026-06-30": 1,
    "2026-07-01": 1,
    "2026-07-03": 1,
    "2026-07-05": 1,
    "2026-07-06": 1,
    "2026-07-08": 1,
    "2026-07-10": 1,
    "2026-07-13": 1,
    "2026-07-14": 1,
    "2026-07-15": 1,
    "2026-07-16": 1,
    "2026-07-17": 1,
    "2026-07-18": 1,
    "2026-07-20": 1,
    "2026-07-22": 1,
    "2026-07-23": 1,
    "2026-07-24": 1,
    "2026-07-27": 1,
    "2026-07-29": 1,
    "2026-07-30": 1,
    "2026-07-31": 1,
    "2026-08-01": 1,
    "2026-08-02": 1,
    "2026-08-05": 1,
    "2026-08-06": 1,
    "2026-08-07": 1,
    "2026-08-10": 1,
    "2026-08-12": 1,
    "2026-08-13": 1,
    "2026-08-14": 1,
    "2026-08-17": 1,
    "2026-08-18": 1,
    "2026-08-19": 1,
    "2026-08-20": 1,
    "2026-08-21": 1,
    "2026-08-23": 1,
    "2026-08-24": 1,
    "2026-08-25": 1,
    "2026-08-28": 1,
    "2026-09-01": 1,
    "2026-09-03": 1,
    "2026-09-04": 1,
    "2026-09-07": 1,
    "2026-09-08": 1,
    "2026-09-09": 1,
    "2026-09-10": 1,
    "2026-09-11": 1,
    "2026-09-14": 1,
    "2026-09-15": 1,
    "2026-09-16": 1,
    "2026-09-17": 1,
    "2026-09-21": 1,
    "2026-09-22": 1,
    "2026-09-23": 1,
    "2026-09-24": 1,
    "2026-09-25": 1,
    "2026-09-28": 1
   },
   "skips": {}
  },
  {
   "id": "plant",
   "name": "浇花",
   "kind": "check",
   "target": 1,
   "unit": "",
   "sched": {
    "type": "interval",
    "every": 3
   },
   "start": "2026-05-02",
   "color": "#9b6829",
   "archived": false,
   "log": {
    "2026-05-02": 1,
    "2026-05-05": 1,
    "2026-05-08": 1,
    "2026-05-11": 1,
    "2026-05-14": 1,
    "2026-05-17": 1,
    "2026-05-20": 1,
    "2026-05-23": 1,
    "2026-05-26": 1,
    "2026-05-29": 1,
    "2026-06-01": 1,
    "2026-06-04": 1,
    "2026-06-07": 1,
    "2026-06-10": 1,
    "2026-06-13": 1,
    "2026-06-16": 1,
    "2026-06-19": 1,
    "2026-06-22": 1,
    "2026-06-25": 1,
    "2026-06-28": 1,
    "2026-07-01": 1,
    "2026-07-04": 1,
    "2026-07-07": 1,
    "2026-07-10": 1,
    "2026-07-13": 1,
    "2026-07-16": 1,
    "2026-07-19": 1,
    "2026-07-22": 1,
    "2026-07-25": 1,
    "2026-07-28": 1,
    "2026-07-31": 1,
    "2026-08-03": 1,
    "2026-08-06": 1,
    "2026-08-09": 1,
    "2026-08-12": 1,
    "2026-08-15": 1,
    "2026-08-21": 1,
    "2026-08-24": 1,
    "2026-08-30": 1,
    "2026-09-02": 1,
    "2026-09-05": 1,
    "2026-09-11": 1,
    "2026-09-14": 1,
    "2026-09-17": 1,
    "2026-09-20": 1,
    "2026-09-23": 1,
    "2026-09-26": 1
   },
   "skips": {}
  },
  {
   "id": "book",
   "name": "读完一章",
   "kind": "check",
   "target": 1,
   "unit": "",
   "sched": {
    "type": "monthly",
    "times": 10
   },
   "start": "2025-10-15",
   "color": "#1c1e54",
   "archived": false,
   "log": {
    "2025-10-19": 1,
    "2025-10-21": 1,
    "2025-10-23": 1,
    "2025-10-25": 1,
    "2025-10-26": 1,
    "2025-10-27": 1,
    "2025-10-29": 1,
    "2025-10-31": 1,
    "2025-11-03": 1,
    "2025-11-08": 1,
    "2025-11-09": 1,
    "2025-11-10": 1,
    "2025-11-18": 1,
    "2025-11-19": 1,
    "2025-11-22": 1,
    "2025-11-23": 1,
    "2025-11-25": 1,
    "2025-11-28": 1,
    "2025-12-01": 1,
    "2025-12-02": 1,
    "2025-12-10": 1,
    "2025-12-14": 1,
    "2025-12-18": 1,
    "2025-12-19": 1,
    "2025-12-20": 1,
    "2025-12-23": 1,
    "2025-12-25": 1,
    "2025-12-26": 1,
    "2025-12-27": 1,
    "2025-12-28": 1,
    "2025-12-31": 1,
    "2026-01-04": 1,
    "2026-01-07": 1,
    "2026-01-09": 1,
    "2026-01-10": 1,
    "2026-01-12": 1,
    "2026-01-14": 1,
    "2026-01-16": 1,
    "2026-01-20": 1,
    "2026-01-21": 1,
    "2026-01-22": 1,
    "2026-01-25": 1,
    "2026-01-26": 1,
    "2026-01-27": 1,
    "2026-01-28": 1,
    "2026-01-30": 1,
    "2026-02-07": 1,
    "2026-02-08": 1,
    "2026-02-09": 1,
    "2026-02-16": 1,
    "2026-02-25": 1,
    "2026-02-26": 1,
    "2026-03-04": 1,
    "2026-03-10": 1,
    "2026-03-11": 1,
    "2026-03-13": 1,
    "2026-03-20": 1,
    "2026-03-24": 1,
    "2026-03-26": 1,
    "2026-03-28": 1,
    "2026-03-30": 1,
    "2026-03-31": 1,
    "2026-04-02": 1,
    "2026-04-05": 1,
    "2026-04-09": 1,
    "2026-04-11": 1,
    "2026-04-12": 1,
    "2026-04-14": 1,
    "2026-04-16": 1,
    "2026-04-20": 1,
    "2026-04-23": 1,
    "2026-04-25": 1,
    "2026-05-01": 1,
    "2026-05-03": 1,
    "2026-05-04": 1,
    "2026-05-09": 1,
    "2026-05-10": 1,
    "2026-05-18": 1,
    "2026-05-19": 1,
    "2026-05-20": 1,
    "2026-05-21": 1,
    "2026-05-22": 1,
    "2026-05-23": 1,
    "2026-05-26": 1,
    "2026-05-28": 1,
    "2026-05-29": 1,
    "2026-05-30": 1,
    "2026-06-03": 1,
    "2026-06-09": 1,
    "2026-06-14": 1,
    "2026-06-15": 1,
    "2026-06-16": 1,
    "2026-06-25": 1,
    "2026-06-26": 1,
    "2026-06-27": 1,
    "2026-06-29": 1,
    "2026-07-01": 1,
    "2026-07-02": 1,
    "2026-07-05": 1,
    "2026-07-07": 1,
    "2026-07-11": 1,
    "2026-07-16": 1,
    "2026-07-19": 1,
    "2026-07-31": 1,
    "2026-08-03": 1,
    "2026-08-04": 1,
    "2026-08-13": 1,
    "2026-08-21": 1,
    "2026-08-23": 1,
    "2026-08-25": 1,
    "2026-09-01": 1,
    "2026-09-05": 1,
    "2026-09-07": 1,
    "2026-09-09": 1,
    "2026-09-10": 1,
    "2026-09-16": 1,
    "2026-09-18": 1,
    "2026-09-19": 1,
    "2026-09-21": 1,
    "2026-09-22": 1,
    "2026-09-25": 1
   },
   "skips": {}
  }
 ],
 "before": {
  "run": {
   "current": 17,
   "longest": 17,
   "rate7": 1,
   "rate30": 0.9629629629629629,
   "rate90": 0.9629629629629629,
   "rateAll": 0.9629629629629629,
   "met": 26,
   "miss": 1,
   "doneTotal": 26,
   "amount": 26,
   "byWeekday": [
    4,
    4,
    4,
    3,
    4,
    4,
    3
   ],
   "lastDone": "2026-09-28",
   "units": 29
  },
  "water": {
   "current": 4,
   "longest": 13,
   "rate7": 0.8333333333333334,
   "rate30": 0.6896551724137931,
   "rate90": 0.7528089887640449,
   "rateAll": 0.7333333333333333,
   "met": 88,
   "miss": 32,
   "doneTotal": 88,
   "amount": 845,
   "byWeekday": [
    14,
    12,
    13,
    13,
    12,
    10,
    14
   ],
   "lastDone": "2026-09-28",
   "units": 121
  },
  "gym": {
   "current": 4,
   "longest": 4,
   "rate7": 1,
   "rate30": 1,
   "rate90": 0.75,
   "rateAll": 0.6896551724137931,
   "met": 20,
   "miss": 9,
   "doneTotal": 92,
   "amount": 92,
   "byWeekday": [
    11,
    18,
    12,
    12,
    15,
    11,
    13
   ],
   "lastDone": "2026-09-26",
   "units": 31
  },
  "words": {
   "current": 6,
   "longest": 31,
   "rate7": 1,
   "rate30": 0.8571428571428571,
   "rate90": 0.7936507936507936,
   "rateAll": 0.847457627118644,
   "met": 200,
   "miss": 36,
   "doneTotal": 211,
   "amount": 211,
   "byWeekday": [
    40,
    39,
    38,
    41,
    42,
    4,
    7
   ],
   "lastDone": "2026-09-28",
   "units": 237
  },
  "plant": {
   "current": 6,
   "longest": 36,
   "rate7": 1,
   "rate30": 0.8888888888888888,
   "rate90": 0.896551724137931,
   "rateAll": 0.94,
   "met": 47,
   "miss": 3,
   "doneTotal": 47,
   "amount": 47,
   "byWeekday": [
    7,
    5,
    7,
    6,
    7,
    8,
    7
   ],
   "lastDone": "2026-09-26",
   "units": 51
  },
  "book": {
   "current": 1,
   "longest": 3,
   "rate7": 1,
   "rate30": 0.5,
   "rate90": 0.3333333333333333,
   "rateAll": 0.5833333333333334,
   "met": 7,
   "miss": 5,
   "doneTotal": 121,
   "amount": 121,
   "byWeekday": [
    17,
    20,
    16,
    17,
    17,
    17,
    17
   ],
   "lastDone": "2026-09-25",
   "units": 12
  }
 },
 "kpiBefore": {
  "due": 6,
  "done": 1,
  "rate30": 0.8369565217391305,
  "best": 17
 },
 "after": {
  "run": {
   "current": 18,
   "longest": 18,
   "rate7": 1,
   "rate30": 0.9642857142857143,
   "rate90": 0.9642857142857143,
   "rateAll": 0.9642857142857143,
   "met": 27,
   "miss": 1,
   "doneTotal": 27,
   "amount": 27,
   "byWeekday": [
    4,
    5,
    4,
    3,
    4,
    4,
    3
   ],
   "lastDone": "2026-09-29",
   "units": 29
  },
  "water": {
   "current": 5,
   "longest": 13,
   "rate7": 0.8571428571428571,
   "rate30": 0.7,
   "rate90": 0.7555555555555555,
   "rateAll": 0.7355371900826446,
   "met": 89,
   "miss": 32,
   "doneTotal": 89,
   "amount": 848,
   "byWeekday": [
    14,
    13,
    13,
    13,
    12,
    10,
    14
   ],
   "lastDone": "2026-09-29",
   "units": 121
  },
  "gym": {
   "current": 4,
   "longest": 4,
   "rate7": 1,
   "rate30": 1,
   "rate90": 0.75,
   "rateAll": 0.6896551724137931,
   "met": 20,
   "miss": 9,
   "doneTotal": 93,
   "amount": 93,
   "byWeekday": [
    11,
    19,
    12,
    12,
    15,
    11,
    13
   ],
   "lastDone": "2026-09-29",
   "units": 31
  },
  "words": {
   "current": 6,
   "longest": 31,
   "rate7": 1,
   "rate30": 0.8571428571428571,
   "rate90": 0.7936507936507936,
   "rateAll": 0.847457627118644,
   "met": 200,
   "miss": 36,
   "doneTotal": 211,
   "amount": 211,
   "byWeekday": [
    40,
    39,
    38,
    41,
    42,
    4,
    7
   ],
   "lastDone": "2026-09-28",
   "units": 237
  },
  "plant": {
   "current": 6,
   "longest": 36,
   "rate7": 1,
   "rate30": 0.8888888888888888,
   "rate90": 0.896551724137931,
   "rateAll": 0.94,
   "met": 47,
   "miss": 3,
   "doneTotal": 47,
   "amount": 47,
   "byWeekday": [
    7,
    5,
    7,
    6,
    7,
    8,
    7
   ],
   "lastDone": "2026-09-26",
   "units": 51
  },
  "book": {
   "current": 1,
   "longest": 3,
   "rate7": 1,
   "rate30": 0.5,
   "rate90": 0.3333333333333333,
   "rateAll": 0.5833333333333334,
   "met": 7,
   "miss": 5,
   "doneTotal": 121,
   "amount": 121,
   "byWeekday": [
    17,
    20,
    16,
    17,
    17,
    17,
    17
   ],
   "lastDone": "2026-09-25",
   "units": 12
  }
 },
 "kpiAfter": {
  "due": 5,
  "done": 3,
  "rate30": 0.8404255319148937,
  "best": 18
 },
 "afterFix": {
  "run": {
   "current": 28,
   "longest": 28,
   "rate7": 1,
   "rate30": 1,
   "rate90": 1,
   "rateAll": 1,
   "met": 28,
   "miss": 0,
   "doneTotal": 28,
   "amount": 28,
   "byWeekday": [
    4,
    5,
    4,
    4,
    4,
    4,
    3
   ],
   "lastDone": "2026-09-29",
   "units": 29
  }
 },
 "monthlyBook": [
  {
   "label": "2025-10",
   "met": 0,
   "miss": 1,
   "rate": 0
  },
  {
   "label": "2025-11",
   "met": 1,
   "miss": 0,
   "rate": 1
  },
  {
   "label": "2025-12",
   "met": 1,
   "miss": 0,
   "rate": 1
  },
  {
   "label": "2026-01",
   "met": 1,
   "miss": 0,
   "rate": 1
  },
  {
   "label": "2026-02",
   "met": 0,
   "miss": 1,
   "rate": 0
  },
  {
   "label": "2026-03",
   "met": 1,
   "miss": 0,
   "rate": 1
  },
  {
   "label": "2026-04",
   "met": 1,
   "miss": 0,
   "rate": 1
  },
  {
   "label": "2026-05",
   "met": 1,
   "miss": 0,
   "rate": 1
  },
  {
   "label": "2026-06",
   "met": 0,
   "miss": 1,
   "rate": 0
  },
  {
   "label": "2026-07",
   "met": 0,
   "miss": 1,
   "rate": 0
  },
  {
   "label": "2026-08",
   "met": 0,
   "miss": 1,
   "rate": 0
  },
  {
   "label": "2026-09",
   "met": 1,
   "miss": 0,
   "rate": 1
  }
 ],
 "monthlyGym": [
  {
   "label": "2025-10",
   "met": 0,
   "miss": 0,
   "rate": null
  },
  {
   "label": "2025-11",
   "met": 0,
   "miss": 0,
   "rate": null
  },
  {
   "label": "2025-12",
   "met": 0,
   "miss": 0,
   "rate": null
  },
  {
   "label": "2026-01",
   "met": 0,
   "miss": 0,
   "rate": null
  },
  {
   "label": "2026-02",
   "met": 0,
   "miss": 0,
   "rate": null
  },
  {
   "label": "2026-03",
   "met": 3,
   "miss": 1,
   "rate": 0.75
  },
  {
   "label": "2026-04",
   "met": 1,
   "miss": 3,
   "rate": 0.25
  },
  {
   "label": "2026-05",
   "met": 4,
   "miss": 1,
   "rate": 0.8
  },
  {
   "label": "2026-06",
   "met": 3,
   "miss": 1,
   "rate": 0.75
  },
  {
   "label": "2026-07",
   "met": 2,
   "miss": 1,
   "rate": 0.6666666666666666
  },
  {
   "label": "2026-08",
   "met": 3,
   "miss": 2,
   "rate": 0.6
  },
  {
   "label": "2026-09",
   "met": 4,
   "miss": 0,
   "rate": 1
  }
 ],
 "kpiYesterday": {
  "due": 5,
  "done": 4,
  "rate30": 0.8421052631578947,
  "best": 27
 }
};

const UNIT = { daily: '天', weekdays: '次', interval: '次', weekly: '周', monthly: '月' };
const pct = (x) => (x == null ? '—' : Math.round(x * 100) + '%');

export default async ({ page, toolURL, screenshot, assert }) => {
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  const T = ORACLE.meta.T;
  await page.goto(toolURL + '?today=' + T);
  await page.waitForFunction(() => document.querySelectorAll('#hl-list .hl-item').length > 0, null, { timeout: 10000 });

  const onTab = async (t) => {
    await page.click('#tab-' + t);
    await page.waitForFunction((t) => !document.getElementById('pane-' + t).hidden, t, { timeout: 5000 });
  };
  const text = (sel) => page.$eval(sel, (n) => n.textContent.trim());

  // 0. 首次打开载入确定性演示数据
  assert(await page.$$eval('#hl-list .hl-item', (n) => n.length) === 5, '首次打开应载入 5 条演示习惯');
  assert(await page.$eval('#hl-back', (a) => a.getAttribute('href')) === '../../', '返回链接');

  // 1. 导入固定场景
  await onTab('manage');
  await page.fill('#hl-io', JSON.stringify({ habits: ORACLE.habits }));
  await page.click('#hl-import');
  await page.waitForFunction(() => /已导入 6 条/.test(document.getElementById('hl-io-msg').textContent), null, { timeout: 5000 });
  assert(await page.$$eval('#hl-mlist .hl-mitem', (n) => n.length) === 6, '管理页应列出 6 条');

  // 2. 统计表逐格对拍（动作之前）
  const checkStats = async (exp, tag) => {
    await onTab('stats');
    for (const h of ORACLE.habits) {
      const e = exp[h.id], u = UNIT[h.sched.type];
      const row = await page.$eval(`#hl-stats-table tr[data-id="${h.id}"]`, (tr) => ({
        cur: tr.querySelector('.hl-c-cur').textContent, lng: tr.querySelector('.hl-c-lng').textContent,
        r7: tr.querySelector('.hl-c-r7').textContent, r30: tr.querySelector('.hl-c-r30').textContent,
        r90: tr.querySelector('.hl-c-r90').textContent, tot: tr.querySelector('.hl-c-tot').textContent,
        last: tr.querySelector('.hl-c-last').textContent }));
      assert(row.cur === `${e.current} ${u}`, `${tag} ${h.id} 当前连续 ${row.cur} ≠ ${e.current} ${u}`);
      assert(row.lng === `${e.longest} ${u}`, `${tag} ${h.id} 最长连续 ${row.lng} ≠ ${e.longest} ${u}`);
      assert(row.r7 === pct(e.rate7) && row.r30 === pct(e.rate30) && row.r90 === pct(e.rate90),
        `${tag} ${h.id} 完成率 ${row.r7}/${row.r30}/${row.r90} ≠ ${pct(e.rate7)}/${pct(e.rate30)}/${pct(e.rate90)}`);
      assert(row.tot.startsWith(e.doneTotal + ' 次'), `${tag} ${h.id} 累计完成 ${row.tot} ≠ ${e.doneTotal}`);
      if (h.kind === 'count') assert(row.tot.includes('· ' + (Math.round(e.amount * 100) / 100) + ' '), `${tag} ${h.id} 累计量 ${row.tot} ≠ ${e.amount}`);
      assert(row.last === (e.lastDone || '—'), `${tag} ${h.id} 最近一次 ${row.last} ≠ ${e.lastDone}`);
    }
  };
  await checkStats(ORACLE.before, '动作前');

  // 3. 今日 KPI（动作前）
  const checkKpi = async (k, tag) => {
    await page.waitForFunction((k) => {
      const t = document.getElementById('kpi-today').textContent.replace(/\s/g, '');
      return t === `${k.done}/${k.due}`;
    }, k, { timeout: 5000 }).catch(() => {});
    const t = (await text('#kpi-today')).replace(/\s/g, '');
    assert(t === `${k.done}/${k.due}`, `${tag} 当天完成 ${t} ≠ ${k.done}/${k.due}`);
    assert(await text('#kpi-best') === String(k.best), `${tag} 最长当前连续 ${await text('#kpi-best')} ≠ ${k.best}`);
    assert(await text('#kpi-rate30') === pct(k.rate30), `${tag} 近 30 天 ${await text('#kpi-rate30')} ≠ ${pct(k.rate30)}`);
    const bar = await page.$eval('#kpi-today-bar', (n) => n.getBoundingClientRect().width / n.parentNode.getBoundingClientRect().width);
    assert(Math.abs(bar - (k.due ? k.done / k.due : 0)) < 0.01, `${tag} 进度条比例 ${bar.toFixed(3)}`);
  };
  await onTab('today');
  await checkKpi(ORACLE.kpiBefore, '动作前');

  // 4. 动作：晨跑打勾、喝水 +3、背单词请假
  const item = (id) => `#hl-list .hl-item[data-id="${id}"]`;
  await page.click(`${item('run')} .hl-check`);
  await page.waitForFunction((s) => document.querySelector(s).getAttribute('aria-pressed') === 'true', `${item('run')} .hl-check`, { timeout: 5000 });
  for (let i = 0; i < 3; i++) await page.click(`${item('water')} .hl-inc`);
  await page.waitForFunction((s) => document.querySelector(s).value === '9', `${item('water')} .hl-val`, { timeout: 5000 });
  await page.click(`${item('gym')} .hl-check`);
  await page.waitForFunction((s) => document.querySelector(s).getAttribute('aria-pressed') === 'true', `${item('gym')} .hl-check`, { timeout: 5000 });
  await page.click(`${item('words')} .hl-skip`);
  await page.waitForFunction((s) => document.querySelector(s).getAttribute('aria-pressed') === 'true', `${item('words')} .hl-skip`, { timeout: 5000 });
  assert(await page.$eval(`${item('water')} .hl-state`, (n) => n.getAttribute('data-s')) === 'done', '喝水 9/8 应判完成');
  assert(await page.$eval(`${item('words')} .hl-state`, (n) => n.getAttribute('data-s')) === 'skip', '背单词应显示已请假');
  const ra = ORACLE.after.run;
  assert((await text(`${item('run')} .hl-streak`)) === `连续 ${ra.current} 天 · 最长 ${ra.longest}`, `晨跑行内连续 ${await text(`${item('run')} .hl-streak`)}`);
  await checkKpi(ORACLE.kpiAfter, '动作后');
  await checkStats(ORACLE.after, '动作后');

  // 5. 热力图：选晨跑，补打 9/10
  await onTab('heat');
  await page.selectOption('#hl-heat-which', 'run');
  await page.waitForFunction(() => document.querySelectorAll('#fig-heat .hl-cell').length === 371, null, { timeout: 5000 });
  assert(await page.$eval('#fig-heat [data-date="2026-09-10"]', (n) => n.getAttribute('data-level')) === '0', '9/10 补打前应为空格');
  assert(await page.$eval('#fig-heat [data-date="2026-09-20"]', (n) => n.getAttribute('fill')) === '#f0dcb4', '9/20 请假格应是奶油色');
  // 几何：同一周的 7 格 x 相同、y 递增；相邻周 x 步长一致
  const geo = await page.$$eval('#fig-heat .hl-cell', (ns) => ns.map((n) => [+n.getAttribute('x'), +n.getAttribute('y')]));
  let geoBad = 0;
  for (let i = 0; i < geo.length; i++) {
    const c = Math.floor(i / 7), r = i % 7;
    if (geo[i][0] !== geo[c * 7][0] || geo[i][1] !== geo[r][1] || (c > 0 && geo[i][0] - geo[(c - 1) * 7][0] !== 15)) geoBad++;
  }
  assert(geoBad === 0, `热力图格子排布错位 ${geoBad} 格`);
  await page.click('#fig-heat [data-date="2026-09-10"]');
  await page.waitForFunction(() => document.getElementById('hl-detail-date').textContent === '2026-09-10', null, { timeout: 5000 });
  await page.fill('#hl-cell-val', '1');
  await page.click('#hl-cell-save');
  await page.waitForFunction(() => document.querySelector('#fig-heat [data-date="2026-09-10"]').getAttribute('data-level') === '4', null, { timeout: 5000 });
  const fx = ORACLE.afterFix.run;
  const sumTxt = await page.$$eval('#hl-heat-sum dd', (ns) => ns.map((n) => n.textContent));
  assert(sumTxt[0] === `${fx.current} 天` && sumTxt[1] === `${fx.longest} 天` && sumTxt[2] === pct(fx.rate90) && sumTxt[3] === `${fx.doneTotal} 次`,
    `热力图汇总 ${sumTxt.join('/')} ≠ ${fx.current}/${fx.longest}/${pct(fx.rate90)}/${fx.doneTotal}`);
  // 非法：请假同时填了值
  await page.check('#hl-cell-skip');
  await page.fill('#hl-cell-val', '1');
  await page.click('#hl-cell-save');
  assert(await page.$eval('#hl-cell-msg', (n) => n.getAttribute('data-t')) === 'bad', '请假 + 有值应报错');
  await page.uncheck('#hl-cell-skip');
  // 键盘：Enter 切换、方向键移动
  await page.focus('#fig-heat [data-date="2026-09-10"]');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.querySelector('#fig-heat [data-date="2026-09-10"]').getAttribute('data-level') === '0', null, { timeout: 5000 });
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.querySelector('#fig-heat [data-date="2026-09-10"]').getAttribute('data-level') === '4', null, { timeout: 5000 });
  await page.keyboard.press('ArrowUp');
  await page.waitForFunction(() => document.activeElement && document.activeElement.getAttribute('data-date') === '2026-09-09', null, { timeout: 5000 });
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => document.activeElement && document.activeElement.getAttribute('data-date') === '2026-09-16', null, { timeout: 5000 });
  assert(await page.$$eval('#fig-heat .hl-cell[tabindex="0"]', (n) => n.length) === 1, '热力图只有一个格子在 Tab 序列里（roving tabindex）');
  // 全部习惯视图：月份标签与星期标签都画出来
  await page.selectOption('#hl-heat-which', '__all__');
  await page.waitForFunction(() => document.querySelectorAll('#fig-heat text').length >= 14, null, { timeout: 5000 });
  const months = await page.$$eval('#fig-heat text', (ns) => ns.map((n) => n.textContent).filter((t) => /月$/.test(t)));
  // 12 个月份的 1 号都落在窗口内 ⇒ 每个月的标签都得画出来（避让器别把相邻月挤掉）
  const firsts = await page.$$eval('#fig-heat .hl-cell', (ns) => ns.filter((n) => n.getAttribute('data-date').endsWith('-01')).map((n) => +n.getAttribute('data-date').slice(5, 7)));
  assert(firsts.every((m) => months.some((t) => t.endsWith(m + '月'))), `缺月份标签：1 号在图里的月份 ${firsts} vs 画出的 ${months}`);
  assert(months.length >= 12, `热力图月份标签应 ≥12 个，实得 ${months.length}：${months.join(',')}`);
  await screenshot('view-heat.png');

  // 6. 统计：晨跑按星期（补打之后）+ 读书逐月表
  await checkStats({ ...ORACLE.after, run: fx }, '补打后');
  await page.selectOption('#hl-stats-which', 'run');
  await page.waitForFunction(() => document.querySelectorAll('#fig-wd .hl-bar-wd').length === 7, null, { timeout: 5000 });
  const wd = await page.$$eval('#fig-wd .hl-bar-wd', (ns) => ns.map((n) => [+n.getAttribute('data-n'), +n.getAttribute('height')]));
  assert(JSON.stringify(wd.map((x) => x[0])) === JSON.stringify(fx.byWeekday), `按星期 ${wd.map((x) => x[0])} ≠ ${fx.byWeekday}`);
  const k0 = wd[0][1] / wd[0][0];
  assert(wd.every(([n, h]) => Math.abs(h - n * k0) < 0.5), '柱高应与次数成正比');
  await page.selectOption('#hl-stats-which', 'book');
  await page.waitForFunction(() => document.getElementById('hl-stats-desc').textContent.includes('每月 10 次'), null, { timeout: 5000 });
  const mrows = await page.$$eval('#hl-month-table tbody tr', (trs) => trs.map((tr) => Array.from(tr.cells).map((c) => c.textContent)));
  const expM = ORACLE.monthlyBook.slice().reverse().map((o) => [o.label, String(o.met), String(o.miss), pct(o.rate)]);
  assert(JSON.stringify(mrows) === JSON.stringify(expM), `读书逐月表 ${JSON.stringify(mrows)} ≠ ${JSON.stringify(expM)}`);
  const bars = await page.$$eval('#fig-month .hl-bar-m', (ns) => ns.map((n) => [+n.getAttribute('data-rate'), +n.getAttribute('height')]));
  assert(bars.length === ORACLE.monthlyBook.filter((o) => o.rate != null).length, '逐月柱数');
  const full = bars.find((b) => b[0] === 1);
  assert(!full || bars.every(([r, h]) => Math.abs(h - r * full[1]) < 0.5), '逐月柱高应与完成率成正比');

  // 7. 补打卡视图（昨天）+ 翻页边界 + 数字键
  await onTab('today');
  assert(await page.$eval('#hl-next', (b) => b.disabled), '今天不能再往后翻');
  await page.click('#hl-prev');
  await page.waitForFunction(() => document.getElementById('hl-date').value === '2026-09-28', null, { timeout: 5000 });
  assert((await text('#hl-daylabel')).includes('昨天'), '日期标签应写「昨天」');
  await checkKpi(ORACLE.kpiYesterday, '昨天');
  await page.click('#hl-gotoday');
  await page.waitForFunction((T) => document.getElementById('hl-date').value === T, T, { timeout: 5000 });
  await page.focus('#hl-gotoday');
  await page.keyboard.press('1');
  await page.waitForFunction((s) => document.querySelector(s).getAttribute('aria-pressed') === 'false', `${item('run')} .hl-check`, { timeout: 5000 });
  await page.keyboard.press('1');
  await page.waitForFunction((s) => document.querySelector(s).getAttribute('aria-pressed') === 'true', `${item('run')} .hl-check`, { timeout: 5000 });

  // 请假当天打勾会清掉请假；再取消打勾应回到「待办」而不是请假
  await page.click(`${item('words')} .hl-check`);
  await page.waitForFunction((s) => document.querySelector(s).getAttribute('aria-pressed') === 'true', `${item('words')} .hl-check`, { timeout: 5000 });
  await page.click(`${item('words')} .hl-check`);
  await page.waitForFunction((s) => document.querySelector(s).getAttribute('aria-pressed') === 'false', `${item('words')} .hl-check`, { timeout: 5000 });
  assert(await page.$eval(`${item('words')} .hl-state`, (n) => n.getAttribute('data-s')) === 'pending', '打勾再取消后请假应已被清掉');

  // 8. 管理：表单校验 / 新建 / 编辑 / 归档 / 删除
  await onTab('manage');
  assert(await page.$eval('#hl-f-countrow', (n) => getComputedStyle(n).display) === 'none', '打勾型时计量行应真的藏起来');
  await page.click('#hl-f-save');
  assert((await text('#hl-f-msg')).includes('缺少名称'), '空名称应报错');
  await page.fill('#hl-f-name', '冥想');
  await page.selectOption('#hl-f-type', 'weekdays');
  for (const cb of await page.$$('.hl-f-day')) await cb.uncheck();
  await page.click('#hl-f-save');
  assert((await text('#hl-f-msg')).includes('星期'), '一天都没勾应报错');
  await page.check('.hl-f-day[value="6"]');
  await page.click('#hl-f-save');
  await page.waitForFunction(() => document.getElementById('hl-f-msg').textContent.includes('已新建「冥想」'), null, { timeout: 5000 });
  assert(await page.$$eval('#hl-mlist .hl-mitem', (n) => n.length) === 7, '新建后 7 条');
  const medId = await page.$$eval('#hl-mlist .hl-mitem', (ns) => ns.find((n) => n.textContent.includes('冥想')).getAttribute('data-id'));
  assert((await text(`#hl-mlist [data-id="${medId}"] .hl-meta`)).startsWith('每周六'), '排程描述「每周六」');
  await page.click(`#hl-mlist [data-id="${medId}"] .hl-edit`);
  await page.selectOption('#hl-f-type', 'weekly');
  assert(await page.$eval('#hl-f-timesrow', (n) => getComputedStyle(n).display) !== 'none', '每周 N 次时应显示次数框');
  await page.fill('#hl-f-times', '9');
  await page.click('#hl-f-save');
  assert((await text('#hl-f-msg')).includes('1–7'), '每周 9 次应报错');
  await page.fill('#hl-f-times', '2');
  await page.click('#hl-f-save');
  await page.waitForFunction(() => document.getElementById('hl-f-msg').textContent.includes('已更新'), null, { timeout: 5000 });
  assert((await text(`#hl-mlist [data-id="${medId}"] .hl-meta`)).startsWith('每周 2 次'), '编辑后排程描述');
  await page.click(`#hl-mlist [data-id="plant"] .hl-arch`);
  await page.click(`#hl-mlist [data-id="${medId}"] .hl-del`);
  assert(await page.$$eval('#hl-mlist .hl-mitem', (n) => n.length) === 7, '删除第一下只是确认');
  await page.click(`#hl-mlist [data-id="${medId}"] .hl-del`);
  await page.waitForFunction(() => document.querySelectorAll('#hl-mlist .hl-mitem').length === 6, null, { timeout: 5000 });
  await onTab('today');
  assert(await page.$$eval('#hl-list .hl-item', (n) => n.length) === 5, '归档的浇花不再出现在今日清单');

  // 9. 非法导入不改数据；导出 → 再导入往返一致
  await onTab('manage');
  await page.fill('#hl-io', '{"habits":[{"name":"x","sched":{"type":"weekly","times":0},"start":"2026-02-30"}]}');
  await page.click('#hl-import');
  const im = await text('#hl-io-msg');
  assert(im.includes('导入被拒绝') && im.includes('开始日期') && im.includes('次数'), `非法导入提示：${im}`);
  assert(await page.$$eval('#hl-mlist .hl-mitem', (n) => n.length) === 6, '非法导入后数据未改动');
  await page.fill('#hl-io', '{oops');
  await page.click('#hl-import');
  assert((await text('#hl-io-msg')).includes('JSON 解析失败'), '坏 JSON 提示');
  const dl = page.waitForEvent('download');
  await page.click('#hl-export');
  const file = await dl;
  assert(/^habit-ledger-2026-09-29\.json$/.test(file.suggestedFilename()), '导出文件名');
  const exported = await page.$eval('#hl-io', (n) => n.value);
  await page.click('#hl-import');
  await page.waitForFunction(() => /已导入 6 条/.test(document.getElementById('hl-io-msg').textContent), null, { timeout: 5000 });
  await page.click('#hl-export');
  assert(await page.$eval('#hl-io', (n) => n.value) === exported, '导出 → 导入 → 再导出应逐字节一致');

  // 10. 刷新后数据仍在（localStorage）
  await page.reload();
  await page.waitForFunction(() => document.querySelectorAll('#hl-list .hl-item').length === 5, null, { timeout: 10000 });
  assert(await page.$eval(`${item('run')} .hl-check`, (b) => b.getAttribute('aria-pressed')) === 'true', '刷新后今天的打卡还在');

  // 并排两栏的卡片顶部对齐（今天 / 热力图 / 管理三页）
  for (const t of ['today', 'heat', 'manage']) {
    await onTab(t);
    const tops = await page.$eval(`#pane-${t} .hl-grid`, (g) => Array.from(g.children).map((c) => Math.round((c.classList.contains('hl-card') ? c : c.querySelector('.hl-card')).getBoundingClientRect().top)));
    assert(Math.abs(tops[0] - tops[1]) <= 1, `页签 ${t} 两栏卡片顶部没对齐：${tops}`);
  }

  // 11. 渲染守卫
  const nCtl = await renderGuards(page, {
    assert, tabs: ORACLE.meta.tabs, onTab,
    paneSel: (t) => `#pane-${t}`, panesRoot: '#hl-panes',
    figSel: (t) => `#pane-${t} svg.hl-fig`, cardSel: '.hl-card',
    minControls: 30, minTextsInFig: 10, minIds: 60,
  });
  assert(nCtl >= 30, `逐页签累计应扫到 ≥30 个控件，实得 ${nCtl}`);
  assert(errs.length === 0, `页面有报错：${errs.slice(0, 3).join(' | ')}`);

  await onTab('stats');
  await page.$eval('#fig-wd', (n) => n.scrollIntoView({ block: 'center' }));
  await screenshot('view-stats.png');
  await onTab('today');
  await page.evaluate(() => window.scrollTo(0, 100));
  await screenshot('thumb.png');
};
