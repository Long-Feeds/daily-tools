// 日程工坊 · iCal Studio 集成测试
// 真值（ORACLE）由 run 目录 truth/gen_truth.py 机械生成、经 inject-oracle.mjs 注入，不手抄、不读本页引擎：
//   workdaily / workdaysWindow / monthly15(All) / lastWorkday / year / ranges / addw / gridOct / oct* —— chinesecalendar 1.12.1（独立维护的法定节假日库）
//   lunar15 / leap6 / la30 / conv —— lunardate 0.3.1（独立农历实现）
//   rfc —— RFC 5545 §3.8.5.3 例题，python-dateutil 2.9 展开（DTSTART 均与规则同步）
//   dst / outlookNY / googleLA —— zoneinfo（tzdata 2026.6）
// 设了环境变量 IC_RIE_PY（装有 recurring-ical-events 的 python）时，下载的 .ics 再交给 recurring-ical-events 展开复核。
import { renderGuards, guardBoxOverlap, guardControlSize } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'

const ORACLE = {
 "workdaily": [
  "2026-09-20 09:00",
  "2026-09-21 09:00",
  "2026-09-22 09:00",
  "2026-09-23 09:00",
  "2026-09-24 09:00",
  "2026-09-28 09:00",
  "2026-09-29 09:00",
  "2026-09-30 09:00",
  "2026-10-08 09:00",
  "2026-10-09 09:00",
  "2026-10-10 09:00",
  "2026-10-12 09:00",
  "2026-10-13 09:00",
  "2026-10-14 09:00",
  "2026-10-15 09:00"
 ],
 "monthly15": [
  "2026-01-15",
  "2026-02-24",
  "2026-03-16",
  "2026-04-15",
  "2026-05-15",
  "2026-06-15",
  "2026-07-15",
  "2026-08-17",
  "2026-09-15",
  "2026-10-15",
  "2026-11-16",
  "2026-12-15"
 ],
 "lastWorkday": [
  "2026-01-30",
  "2026-02-28",
  "2026-03-31",
  "2026-04-30",
  "2026-05-29",
  "2026-06-30",
  "2026-07-31",
  "2026-08-31",
  "2026-09-30",
  "2026-10-30",
  "2026-11-30",
  "2026-12-31"
 ],
 "year": {
  "2026": {
   "work": 248,
   "rest": 117,
   "makeup": 6,
   "off": 33,
   "runs": 7,
   "holidayEvents": 13
  },
  "2027": {
   "work": 248,
   "rest": 117,
   "makeup": 5,
   "off": 29,
   "runs": 7,
   "holidayEvents": 12
  }
 },
 "ranges": [
  {
   "a": "2026-09-25",
   "b": "2026-10-12",
   "work": 7,
   "mk": 1,
   "days": 18
  },
  {
   "a": "2026-01-01",
   "b": "2026-12-31",
   "work": 248,
   "mk": 6,
   "days": 365
  },
  {
   "a": "2026-02-10",
   "b": "2026-03-05",
   "work": 14,
   "mk": 2,
   "days": 24
  },
  {
   "a": "2027-01-28",
   "b": "2027-02-20",
   "work": 13,
   "mk": 2,
   "days": 24
  },
  {
   "a": "2007-12-28",
   "b": "2008-01-02",
   "work": 3,
   "mk": 1,
   "days": 6
  },
  {
   "a": "2019-12-27",
   "b": "2020-01-02",
   "work": 4,
   "mk": 0,
   "days": 7
  },
  {
   "a": "2011-12-30",
   "b": "2012-01-04",
   "work": 3,
   "mk": 1,
   "days": 6
  }
 ],
 "addw": [
  {
   "start": "2026-09-30",
   "n": 3,
   "res": "2026-10-10"
  },
  {
   "start": "2026-02-13",
   "n": 1,
   "res": "2026-02-14"
  },
  {
   "start": "2026-10-08",
   "n": -1,
   "res": "2026-09-30"
  },
  {
   "start": "2026-12-25",
   "n": 30,
   "res": "2027-02-14"
  },
  {
   "start": "2027-02-04",
   "n": 5,
   "res": "2027-02-18"
  }
 ],
 "lunar15": [
  "2026-09-25",
  "2027-09-15",
  "2028-10-03",
  "2029-09-22",
  "2030-09-12",
  "2031-10-01",
  "2032-09-19",
  "2033-09-08",
  "2034-09-27",
  "2035-09-16"
 ],
 "leap6": [
  "2025-07-25",
  "2026-07-14",
  "2027-07-04",
  "2028-07-22",
  "2029-07-11",
  "2030-07-01",
  "2031-07-19",
  "2032-07-07",
  "2033-06-27",
  "2034-07-16"
 ],
 "la30": [
  "2027-02-05",
  "2028-01-25",
  "2029-02-12",
  "2030-02-02",
  "2031-01-22",
  "2032-02-10",
  "2033-01-30",
  "2034-02-18",
  "2035-02-07",
  "2036-01-27"
 ],
 "conv": {
  "solar": "2025-07-25",
  "lunarLeap": true,
  "lm": 6,
  "ld": 1,
  "cny2026": "2026-02-17"
 },
 "rfc": [
  {
   "name": "每月第一个周五 共 10 次",
   "dtstart": "19970905T090000",
   "rrule": "FREQ=MONTHLY;COUNT=10;BYDAY=1FR",
   "expect": [
    "1997-09-05 09:00",
    "1997-10-03 09:00",
    "1997-11-07 09:00",
    "1997-12-05 09:00",
    "1998-01-02 09:00",
    "1998-02-06 09:00",
    "1998-03-06 09:00",
    "1998-04-03 09:00",
    "1998-05-01 09:00",
    "1998-06-05 09:00"
   ],
   "finite": true
  },
  {
   "name": "隔周一三五 至 1997-12-24",
   "dtstart": "19970901T090000",
   "rrule": "FREQ=WEEKLY;INTERVAL=2;UNTIL=19971224T000000Z;WKST=SU;BYDAY=MO,WE,FR",
   "expect": [
    "1997-09-01 09:00",
    "1997-09-03 09:00",
    "1997-09-05 09:00",
    "1997-09-15 09:00",
    "1997-09-17 09:00",
    "1997-09-19 09:00",
    "1997-09-29 09:00",
    "1997-10-01 09:00",
    "1997-10-03 09:00",
    "1997-10-13 09:00",
    "1997-10-15 09:00",
    "1997-10-17 09:00",
    "1997-10-27 09:00",
    "1997-10-29 09:00",
    "1997-10-31 09:00",
    "1997-11-10 09:00",
    "1997-11-12 09:00",
    "1997-11-14 09:00",
    "1997-11-24 09:00",
    "1997-11-26 09:00",
    "1997-11-28 09:00",
    "1997-12-08 09:00",
    "1997-12-10 09:00",
    "1997-12-12 09:00",
    "1997-12-22 09:00"
   ],
   "finite": true
  },
  {
   "name": "每月第三个二三四 共 3 次",
   "dtstart": "19970904T090000",
   "rrule": "FREQ=MONTHLY;COUNT=3;BYDAY=TU,WE,TH;BYSETPOS=3",
   "expect": [
    "1997-09-04 09:00",
    "1997-10-07 09:00",
    "1997-11-06 09:00"
   ],
   "finite": true
  },
  {
   "name": "每年三月的每个周四",
   "dtstart": "19970313T090000",
   "rrule": "FREQ=YEARLY;BYMONTH=3;BYDAY=TH",
   "expect": [
    "1997-03-13 09:00",
    "1997-03-20 09:00",
    "1997-03-27 09:00",
    "1998-03-05 09:00",
    "1998-03-12 09:00",
    "1998-03-19 09:00",
    "1998-03-26 09:00",
    "1999-03-04 09:00",
    "1999-03-11 09:00",
    "1999-03-18 09:00",
    "1999-03-25 09:00"
   ],
   "finite": false
  },
  {
   "name": "第 20 周的周一",
   "dtstart": "19970512T090000",
   "rrule": "FREQ=YEARLY;BYWEEKNO=20;BYDAY=MO",
   "expect": [
    "1997-05-12 09:00",
    "1998-05-11 09:00",
    "1999-05-17 09:00"
   ],
   "finite": false
  },
  {
   "name": "9:00–16:40 每 20 分钟",
   "dtstart": "19970902T090000",
   "rrule": "FREQ=MINUTELY;INTERVAL=20;BYHOUR=9,10,11,12,13,14,15,16",
   "expect": [
    "1997-09-02 09:00",
    "1997-09-02 09:20",
    "1997-09-02 09:40",
    "1997-09-02 10:00",
    "1997-09-02 10:20",
    "1997-09-02 10:40",
    "1997-09-02 11:00",
    "1997-09-02 11:20",
    "1997-09-02 11:40",
    "1997-09-02 12:00",
    "1997-09-02 12:20",
    "1997-09-02 12:40",
    "1997-09-02 13:00",
    "1997-09-02 13:20",
    "1997-09-02 13:40",
    "1997-09-02 14:00",
    "1997-09-02 14:20",
    "1997-09-02 14:40",
    "1997-09-02 15:00",
    "1997-09-02 15:20",
    "1997-09-02 15:40",
    "1997-09-02 16:00",
    "1997-09-02 16:20",
    "1997-09-02 16:40",
    "1997-09-03 09:00",
    "1997-09-03 09:20",
    "1997-09-03 09:40",
    "1997-09-03 10:00",
    "1997-09-03 10:20",
    "1997-09-03 10:40"
   ],
   "finite": false
  },
  {
   "name": "美国大选日",
   "dtstart": "19961105T090000",
   "rrule": "FREQ=YEARLY;INTERVAL=4;BYMONTH=11;BYDAY=TU;BYMONTHDAY=2,3,4,5,6,7,8",
   "expect": [
    "1996-11-05 09:00",
    "2000-11-07 09:00",
    "2004-11-02 09:00"
   ],
   "finite": false
  },
  {
   "name": "每月倒数第二个工作日",
   "dtstart": "19970929T090000",
   "rrule": "FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-2",
   "expect": [
    "1997-09-29 09:00",
    "1997-10-30 09:00",
    "1997-11-27 09:00",
    "1997-12-30 09:00",
    "1998-01-29 09:00",
    "1998-02-26 09:00",
    "1998-03-30 09:00"
   ],
   "finite": false
  },
  {
   "name": "周二周日 WKST=SU",
   "dtstart": "19970805T090000",
   "rrule": "FREQ=WEEKLY;INTERVAL=2;COUNT=4;BYDAY=TU,SU;WKST=SU",
   "expect": [
    "1997-08-05 09:00",
    "1997-08-17 09:00",
    "1997-08-19 09:00",
    "1997-08-31 09:00"
   ],
   "finite": true
  },
  {
   "name": "每月倒数第二个周一 共 6 次",
   "dtstart": "19970922T090000",
   "rrule": "FREQ=MONTHLY;COUNT=6;BYDAY=-2MO",
   "expect": [
    "1997-09-22 09:00",
    "1997-10-20 09:00",
    "1997-11-17 09:00",
    "1997-12-22 09:00",
    "1998-01-19 09:00",
    "1998-02-16 09:00"
   ],
   "finite": true
  },
  {
   "name": "每月第一个和最后一个周日",
   "dtstart": "19970907T090000",
   "rrule": "FREQ=MONTHLY;COUNT=10;BYDAY=1SU,-1SU",
   "expect": [
    "1997-09-07 09:00",
    "1997-09-28 09:00",
    "1997-10-05 09:00",
    "1997-10-26 09:00",
    "1997-11-02 09:00",
    "1997-11-30 09:00",
    "1997-12-07 09:00",
    "1997-12-28 09:00",
    "1998-01-04 09:00",
    "1998-01-25 09:00"
   ],
   "finite": true
  },
  {
   "name": "每月倒数第三天",
   "dtstart": "19970928T090000",
   "rrule": "FREQ=MONTHLY;BYMONTHDAY=-3",
   "expect": [
    "1997-09-28 09:00",
    "1997-10-29 09:00",
    "1997-11-28 09:00",
    "1997-12-29 09:00",
    "1998-01-29 09:00",
    "1998-02-26 09:00"
   ],
   "finite": false
  },
  {
   "name": "每年第 1、100、200 天 隔两年",
   "dtstart": "19970101T090000",
   "rrule": "FREQ=YEARLY;INTERVAL=3;COUNT=10;BYYEARDAY=1,100,200",
   "expect": [
    "1997-01-01 09:00",
    "1997-04-10 09:00",
    "1997-07-19 09:00",
    "2000-01-01 09:00",
    "2000-04-09 09:00",
    "2000-07-18 09:00",
    "2003-01-01 09:00",
    "2003-04-10 09:00",
    "2003-07-19 09:00",
    "2006-01-01 09:00"
   ],
   "finite": true
  },
  {
   "name": "每 18 个月的 10–15 日",
   "dtstart": "19970910T090000",
   "rrule": "FREQ=MONTHLY;INTERVAL=18;COUNT=10;BYMONTHDAY=10,11,12,13,14,15",
   "expect": [
    "1997-09-10 09:00",
    "1997-09-11 09:00",
    "1997-09-12 09:00",
    "1997-09-13 09:00",
    "1997-09-14 09:00",
    "1997-09-15 09:00",
    "1999-03-10 09:00",
    "1999-03-11 09:00",
    "1999-03-12 09:00",
    "1999-03-13 09:00"
   ],
   "finite": true
  }
 ],
 "dstUtc": [
  "2026-03-07 07:30",
  "2026-03-08 07:30",
  "2026-03-09 06:30"
 ],
 "dst": {
  "gapShown": "2026-03-08 03:30",
  "foldUtc": "2026-11-01 05:30"
 },
 "outlookNY": [
  "2026-10-31 08:00",
  "2026-11-07 09:00",
  "2026-11-14 09:00",
  "2026-11-21 09:00"
 ],
 "googleLA": {
  "mondays": [
   "2026-10-26 17:00",
   "2026-11-02 17:00",
   "2026-11-09 17:00",
   "2026-11-16 17:00",
   "2026-11-23 17:00",
   "2026-11-30 17:00"
  ],
  "exdate": "2026-11-09 17:00",
  "moved": "2026-11-17 09:00",
  "movedFrom": "2026-11-16 17:00"
 },
 "workdaysWindow": [
  "2026-09-20",
  "2026-09-21",
  "2026-09-22",
  "2026-09-23",
  "2026-09-24",
  "2026-09-28",
  "2026-09-29",
  "2026-09-30",
  "2026-10-08",
  "2026-10-09",
  "2026-10-10",
  "2026-10-12",
  "2026-10-13",
  "2026-10-14",
  "2026-10-15",
  "2026-10-16",
  "2026-10-19",
  "2026-10-20",
  "2026-10-21",
  "2026-10-22",
  "2026-10-23",
  "2026-10-26",
  "2026-10-27",
  "2026-10-28",
  "2026-10-29",
  "2026-10-30",
  "2026-11-02",
  "2026-11-03",
  "2026-11-04",
  "2026-11-05",
  "2026-11-06",
  "2026-11-09",
  "2026-11-10",
  "2026-11-11",
  "2026-11-12",
  "2026-11-13",
  "2026-11-16",
  "2026-11-17",
  "2026-11-18",
  "2026-11-19",
  "2026-11-20",
  "2026-11-23",
  "2026-11-24",
  "2026-11-25",
  "2026-11-26",
  "2026-11-27",
  "2026-11-30",
  "2026-12-01",
  "2026-12-02",
  "2026-12-03",
  "2026-12-04",
  "2026-12-07",
  "2026-12-08",
  "2026-12-09",
  "2026-12-10",
  "2026-12-11",
  "2026-12-14",
  "2026-12-15",
  "2026-12-16",
  "2026-12-17",
  "2026-12-18",
  "2026-12-21",
  "2026-12-22",
  "2026-12-23",
  "2026-12-24",
  "2026-12-25",
  "2026-12-28",
  "2026-12-29",
  "2026-12-30",
  "2026-12-31",
  "2027-01-04",
  "2027-01-05",
  "2027-01-06",
  "2027-01-07",
  "2027-01-08",
  "2027-01-11",
  "2027-01-12",
  "2027-01-13",
  "2027-01-14",
  "2027-01-15",
  "2027-01-18",
  "2027-01-19",
  "2027-01-20",
  "2027-01-21",
  "2027-01-22",
  "2027-01-25",
  "2027-01-26",
  "2027-01-27",
  "2027-01-28",
  "2027-01-29",
  "2027-01-31",
  "2027-02-01",
  "2027-02-02",
  "2027-02-03",
  "2027-02-04",
  "2027-02-14",
  "2027-02-15",
  "2027-02-16",
  "2027-02-17",
  "2027-02-18",
  "2027-02-19",
  "2027-02-22",
  "2027-02-23",
  "2027-02-24",
  "2027-02-25",
  "2027-02-26",
  "2027-03-01",
  "2027-03-02",
  "2027-03-03",
  "2027-03-04",
  "2027-03-05",
  "2027-03-08",
  "2027-03-09",
  "2027-03-10",
  "2027-03-11",
  "2027-03-12",
  "2027-03-15",
  "2027-03-16",
  "2027-03-17",
  "2027-03-18",
  "2027-03-19",
  "2027-03-22",
  "2027-03-23",
  "2027-03-24",
  "2027-03-25",
  "2027-03-26",
  "2027-03-29",
  "2027-03-30",
  "2027-03-31",
  "2027-04-01",
  "2027-04-02",
  "2027-04-06",
  "2027-04-07",
  "2027-04-08",
  "2027-04-09",
  "2027-04-12",
  "2027-04-13",
  "2027-04-14",
  "2027-04-15",
  "2027-04-16",
  "2027-04-19",
  "2027-04-20",
  "2027-04-21",
  "2027-04-22",
  "2027-04-23",
  "2027-04-26",
  "2027-04-27",
  "2027-04-28",
  "2027-04-29",
  "2027-04-30",
  "2027-05-06",
  "2027-05-07",
  "2027-05-08",
  "2027-05-10",
  "2027-05-11",
  "2027-05-12",
  "2027-05-13",
  "2027-05-14",
  "2027-05-17",
  "2027-05-18",
  "2027-05-19",
  "2027-05-20",
  "2027-05-21",
  "2027-05-24",
  "2027-05-25",
  "2027-05-26",
  "2027-05-27",
  "2027-05-28",
  "2027-05-31",
  "2027-06-01",
  "2027-06-02",
  "2027-06-03",
  "2027-06-04",
  "2027-06-07",
  "2027-06-08",
  "2027-06-10",
  "2027-06-11",
  "2027-06-14",
  "2027-06-15",
  "2027-06-16",
  "2027-06-17",
  "2027-06-18",
  "2027-06-21",
  "2027-06-22",
  "2027-06-23",
  "2027-06-24",
  "2027-06-25",
  "2027-06-28",
  "2027-06-29",
  "2027-06-30",
  "2027-07-01",
  "2027-07-02",
  "2027-07-05",
  "2027-07-06",
  "2027-07-07",
  "2027-07-08",
  "2027-07-09",
  "2027-07-12",
  "2027-07-13",
  "2027-07-14",
  "2027-07-15",
  "2027-07-16",
  "2027-07-19",
  "2027-07-20",
  "2027-07-21",
  "2027-07-22",
  "2027-07-23",
  "2027-07-26",
  "2027-07-27",
  "2027-07-28",
  "2027-07-29",
  "2027-07-30",
  "2027-08-02",
  "2027-08-03",
  "2027-08-04",
  "2027-08-05",
  "2027-08-06",
  "2027-08-09",
  "2027-08-10",
  "2027-08-11",
  "2027-08-12",
  "2027-08-13",
  "2027-08-16",
  "2027-08-17",
  "2027-08-18",
  "2027-08-19",
  "2027-08-20",
  "2027-08-23",
  "2027-08-24",
  "2027-08-25",
  "2027-08-26",
  "2027-08-27",
  "2027-08-30",
  "2027-08-31",
  "2027-09-01",
  "2027-09-02",
  "2027-09-03",
  "2027-09-06",
  "2027-09-07",
  "2027-09-08",
  "2027-09-09",
  "2027-09-10",
  "2027-09-13",
  "2027-09-14",
  "2027-09-16",
  "2027-09-17",
  "2027-09-20",
  "2027-09-21",
  "2027-09-22",
  "2027-09-23",
  "2027-09-24",
  "2027-09-26",
  "2027-09-27",
  "2027-09-28",
  "2027-09-29",
  "2027-09-30",
  "2027-10-08",
  "2027-10-09",
  "2027-10-11",
  "2027-10-12",
  "2027-10-13",
  "2027-10-14",
  "2027-10-15",
  "2027-10-18",
  "2027-10-19",
  "2027-10-20",
  "2027-10-21",
  "2027-10-22",
  "2027-10-25",
  "2027-10-26",
  "2027-10-27",
  "2027-10-28",
  "2027-10-29",
  "2027-11-01",
  "2027-11-02",
  "2027-11-03",
  "2027-11-04",
  "2027-11-05",
  "2027-11-08",
  "2027-11-09",
  "2027-11-10",
  "2027-11-11",
  "2027-11-12",
  "2027-11-15",
  "2027-11-16",
  "2027-11-17",
  "2027-11-18",
  "2027-11-19",
  "2027-11-22",
  "2027-11-23",
  "2027-11-24",
  "2027-11-25",
  "2027-11-26",
  "2027-11-29",
  "2027-11-30",
  "2027-12-01",
  "2027-12-02",
  "2027-12-03",
  "2027-12-06",
  "2027-12-07",
  "2027-12-08",
  "2027-12-09",
  "2027-12-10",
  "2027-12-13",
  "2027-12-14",
  "2027-12-15",
  "2027-12-16",
  "2027-12-17",
  "2027-12-20",
  "2027-12-21",
  "2027-12-22",
  "2027-12-23",
  "2027-12-24",
  "2027-12-27",
  "2027-12-28",
  "2027-12-29",
  "2027-12-30",
  "2027-12-31"
 ],
 "monthly15All": [
  "2026-01-15",
  "2026-02-24",
  "2026-03-16",
  "2026-04-15",
  "2026-05-15",
  "2026-06-15",
  "2026-07-15",
  "2026-08-17",
  "2026-09-15",
  "2026-10-15",
  "2026-11-16",
  "2026-12-15",
  "2027-01-15",
  "2027-02-15",
  "2027-03-15",
  "2027-04-15",
  "2027-05-17",
  "2027-06-15",
  "2027-07-15",
  "2027-08-16",
  "2027-09-16",
  "2027-10-15",
  "2027-11-15",
  "2027-12-15"
 ],
 "prevFeb15": "2026-02-14",
 "gridOct": 21,
 "octWork": 18,
 "octOff": 7,
 "octMk": 1,
 "capUntil": "20260131T155959Z",
 "gapSetpos": [
  "2026-03-07 02:00",
  "2026-03-08 03:00",
  "2026-03-09 02:00"
 ],
 "durA": [
  {
   "start": "2026-03-05 12:00",
   "end": "2026-03-06 12:00"
  },
  {
   "start": "2026-03-06 12:00",
   "end": "2026-03-06 14:00"
  },
  {
   "start": "2026-03-07 12:00",
   "end": "2026-03-08 12:00"
  },
  {
   "start": "2026-03-08 12:00",
   "end": "2026-03-09 12:00"
  }
 ],
 "durExact": "2026-03-08 13:00",
 "nlUntil": "20260404T193712Z",
 "dtstampTz": "20260101T010000Z"
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  // 固定「今天」= 北京时间 2026-11-25 10:00，计时器照常走
  await page.clock.setFixedTime(new Date('2026-11-25T02:00:00Z'))
  await page.goto(toolURL)
  await page.waitForFunction(() => window.ICA && document.querySelector('#ic-list-tbl').dataset.key, null, { timeout: 15000 })
  const ext = { rie: 0 }

  // ── 助手 ──
  const synced = () => page.waitForFunction(() => document.querySelector('#ic-list-tbl').dataset.key === window.ICA.stateKey(), null, { timeout: 10000 })
  const fillBlur = async (sel, v) => { await page.fill(sel, v); await page.$eval(sel, (el) => el.blur()); await synced() }
  const onTab = async (t) => { await page.click(`#ic-tab-${t}`); await page.waitForFunction((t) => !document.querySelector('#ic-pane-' + t).hidden, t) }
  const rows = () => page.$$eval('#ic-list tr[data-dn]', (trs) => trs.map((tr) => {
    const td = tr.querySelectorAll('td')
    return { date: td[1].textContent.slice(0, 10), time: td[2].textContent.trim().slice(0, 5), lunar: td[3].textContent.trim(), marks: td[4].textContent.trim() }
  }))
  const setRule = async ({ date, time, tz, allDay = false, rrule, pol = 'none', mode = 'cn', makeup = false, listFrom, listN = '50', gap = 'shift' }) => {
    await onTab('rule')
    await page.selectOption('#ic-tz', tz)
    await page.setChecked('#ic-allday', allDay)
    await page.fill('#ic-date', date)
    if (!allDay && time) await page.fill('#ic-time', time)
    await fillBlur('#ic-rrule', rrule)
    await page.selectOption('#ic-pol', pol)
    await page.selectOption('#ic-mode', mode)
    await page.setChecked('#ic-makeup', makeup)
    await page.selectOption('#ic-gap', gap)
    await page.fill('#ic-list-from', listFrom || date)
    await page.selectOption('#ic-list-n', listN)
    await synced()
  }
  const download = async (click) => {
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click(click)])
    return { name: dl.suggestedFilename(), text: fs.readFileSync(await dl.path(), 'utf8') }
  }
  // 独立的 .ics 读取器（不经过页面引擎）
  const icsCheck = (text, label) => {
    assert(!/(^|[^\r])\n/.test(text), `${label}：每行都应以 CRLF 结尾`)
    const phys = text.split('\r\n')
    const long = phys.filter((l) => Buffer.byteLength(l, 'utf8') > 75)
    assert(long.length === 0, `${label}：有 ${long.length} 行超过 75 字节：${(long[0] || '').slice(0, 40)}`)
    // 折行不拆开 UTF-8：每个物理行都是合法 UTF-8（Buffer 往返不变）
    assert(phys.every((l) => Buffer.from(l, 'utf8').toString('utf8') === l), `${label}：折行拆坏了多字节字符`)
    const lines = text.replace(/\r\n[ \t]/g, '').split('\r\n').filter(Boolean)
    const stack = []
    for (const l of lines) {
      if (l.startsWith('BEGIN:')) stack.push(l.slice(6))
      else if (l.startsWith('END:')) assert(stack.pop() === l.slice(4), `${label}：BEGIN/END 不配对于 ${l}`)
    }
    assert(stack.length === 0, `${label}：有没闭合的组件 ${stack.join(',')}`)
    return lines
  }
  const vals = (lines, name) => lines.filter((l) => l.startsWith(name + ':') || l.startsWith(name + ';')).flatMap((l) => l.slice(l.indexOf(':') + 1).split(','))
  const rieExpand = (text, a, b, utc) => {
    const py = process.env.IC_RIE_PY
    if (!py) return null
    const code = 'import sys, json, icalendar, recurring_ical_events as r\nc=icalendar.Calendar.from_ical(sys.stdin.read())\n' +
      `ev=r.of(c).between((${a}),(${b}))\nout=[]\nimport datetime as D\nfor e in ev:\n  d=e['DTSTART'].dt\n  ${utc ? "d=d.astimezone(D.timezone.utc) if hasattr(d,'hour') else d\n  " : ''}out.append(d.strftime('%Y-%m-%d %H:%M') if hasattr(d,'hour') else d.isoformat())\nprint(json.dumps(sorted(out)))`
    ext.rie++
    return JSON.parse(execFileSync(py, ['-c', code], { input: text, encoding: 'utf8' }))
  }

  // ═══ 1. 一句话 → 规则（示例胶囊） ═══
  const chipExpect = {
    '每个工作日 9:00 晨会': ['FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR', 'skip', true, '09:00', '晨会'],
    '每两周的周一和周四 9:30': ['FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,TH', 'none', false, '09:30', null],
    '每季度第一个周一 10:00': ['FREQ=MONTHLY;INTERVAL=3;BYDAY=1MO', 'none', false, '10:00', null],
    '每月第 2 个周二 19:00': ['FREQ=MONTHLY;BYDAY=2TU', 'none', false, '19:00', null],
    '每年 11 月第 4 个周四': ['FREQ=YEARLY;BYDAY=4TH;BYMONTH=11', 'none', false, null, null],
    '每月 15 号还款，遇节假日顺延': ['FREQ=MONTHLY;BYMONTHDAY=15', 'next', false, null, '还款'],
  }
  for (const [txt, [rr, pol, mk, time, sum]] of Object.entries(chipExpect)) {
    await page.click(`.ic-chip:text-is("${txt}")`)
    await synced()
    assert(await page.inputValue('#ic-rrule') === rr, `「${txt}」→ RRULE 应为 ${rr}，实得 ${await page.inputValue('#ic-rrule')}`)
    assert(await page.inputValue('#ic-pol') === pol, `「${txt}」→ 节假日策略应为 ${pol}`)
    assert(await page.isChecked('#ic-makeup') === mk, `「${txt}」→ 调休补班勾选应为 ${mk}`)
    if (time) assert((await page.inputValue('#ic-time')).slice(0, 5) === time, `「${txt}」→ 时间应为 ${time}，实得 ${await page.inputValue('#ic-time')}`)
    if (sum) assert(await page.inputValue('#ic-sum') === sum, `「${txt}」→ 标题应为 ${sum}，实得 ${await page.inputValue('#ic-sum')}`)
  }
  // 农历与「每月最后一个工作日」
  await page.click('.ic-chip:text-is("每年农历八月十五")'); await synced()
  assert(await page.inputValue('#ic-rrule') === 'RSCALE=CHINESE;FREQ=YEARLY;BYMONTHDAY=15;BYMONTH=8', '农历八月十五 → RSCALE=CHINESE 规则')
  assert(await page.isChecked('#ic-allday'), '农历规则默认全天')
  // 「今天」是 2026-11-25，今年的中秋（lunar15[0]）已过，第一个实例应是明年的
  assert((await rows())[0].date === ORACLE.lunar15[1], `2026-11-25 之后第一个中秋应是 ${ORACLE.lunar15[1]}，实得 ${(await rows())[0].date}`)
  await page.click('.ic-chip:text-is("每月最后一个工作日 18:00 报销截止")'); await synced()
  assert(await page.inputValue('#ic-rrule') === '' && (await page.getAttribute('#ic-rrule', 'placeholder')).includes('第 N 个工作日'), '「每月第 N 个工作日」不是 RRULE：输入框留空并提示可切回')
  assert((await page.textContent('#ic-desc')).includes('每月最后一个工作日'), '描述应为「每月最后一个工作日」')
  // 手打一句话：起止、次数、时刻、标题
  await page.fill('#ic-nl', '从 2026-03-02 开始 每周一、周三和周五 晚上8点 共 6 次 健身')
  await page.click('#ic-nl-go'); await synced()
  assert(await page.inputValue('#ic-rrule') === 'FREQ=WEEKLY;COUNT=6;BYDAY=MO,WE,FR', `一句话 → ${await page.inputValue('#ic-rrule')}`)
  assert(await page.inputValue('#ic-date') === '2026-03-02' && (await page.inputValue('#ic-time')).slice(0, 5) === '20:00' && await page.inputValue('#ic-sum') === '健身', '一句话里的开始日期 / 时间 / 标题')
  await page.fill('#ic-list-from', '2026-03-01'); await synced()
  const fit = await rows()
  assert(fit.map((r) => r.date).join(',') === '2026-03-02,2026-03-04,2026-03-06,2026-03-09,2026-03-11,2026-03-13', `共 6 次：${fit.map((r) => r.date).join(',')}`)
  await page.selectOption('#ic-tz', 'Asia/Shanghai')
  await page.fill('#ic-nl', '每天 12:27，到 2026-04-05 03:37:12 为止'); await page.click('#ic-nl-go'); await synced()
  assert(await page.inputValue('#ic-rrule') === `FREQ=DAILY;UNTIL=${ORACLE.nlUntil}` && (await page.inputValue('#ic-time')).slice(0, 5) === '12:27', `截止时刻要读成 UNTIL、不能当成事件时间：${await page.inputValue('#ic-rrule')} / ${await page.inputValue('#ic-time')}`)
  await page.fill('#ic-nl', '每月 1 日，仅周一、第 5 个周五'); await page.click('#ic-nl-go'); await synced()
  assert(await page.inputValue('#ic-rrule') === 'FREQ=MONTHLY;BYDAY=MO,5FR;BYMONTHDAY=1', `「仅」里的序号星期不能再多出普通周五：${await page.inputValue('#ic-rrule')}`)
  await page.fill('#ic-nl', '每周一三五 晚上7点 健身'); await page.click('#ic-nl-go'); await synced()
  assert(await page.inputValue('#ic-rrule') === 'FREQ=WEEKLY;BYDAY=MO,WE,FR' && (await page.inputValue('#ic-time')).slice(0, 5) === '19:00' && await page.inputValue('#ic-sum') === '健身', `口语简写「周一三五」：${await page.inputValue('#ic-rrule')} / ${await page.inputValue('#ic-sum')}`)
  await page.fill('#ic-nl', '火星上的每个第十三个月')
  await page.click('#ic-nl-go')
  assert((await page.textContent('#ic-nlmsg')).includes('没读出重复频率'), '读不懂的话要说明原因')

  // ═══ 2. RFC 5545 例题（粘贴 DTSTART + RRULE，换行被输入框吃掉也要认） ═══
  for (const ex of ORACLE.rfc) {
    await setRule({ date: '2000-01-01', time: '00:00', tz: 'Asia/Shanghai', rrule: 'FREQ=DAILY', listN: '50' })
    await fillBlur('#ic-rrule', `DTSTART;TZID=America/New_York:${ex.dtstart}RRULE:${ex.rrule}`)
    const d = ex.dtstart
    assert(await page.inputValue('#ic-tz') === 'America/New_York' && await page.inputValue('#ic-date') === `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`, `${ex.name}：粘贴的 DTSTART 应写进表单`)
    await page.fill('#ic-list-from', `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`); await synced()
    const all = (await rows()).map((r) => `${r.date} ${r.time}`)
    const got = ex.finite ? all : all.slice(0, ex.expect.length)   // 有 COUNT / UNTIL 的例题比整份（多一个也不行）
    assert(got.join('|') === ex.expect.join('|'), `${ex.name}${ex.finite ? '（有限，比整份）' : ''}：\n  期望 ${ex.expect.join(' ')}\n  实得 ${got.join(' ')}`)
  }
  // 校验：BYWEEKNO 配 MONTHLY、COUNT 与 UNTIL 并存
  await fillBlur('#ic-rrule', 'FREQ=MONTHLY;BYWEEKNO=2')
  assert((await page.textContent('#ic-warn')).includes('BYWEEKNO 只能配 FREQ=YEARLY'), 'BYWEEKNO 配 MONTHLY 要报错')
  await fillBlur('#ic-rrule', 'FREQ=DAILY;COUNT=3;UNTIL=20261231')
  assert((await page.textContent('#ic-warn')).includes('COUNT 与 UNTIL 不能同时出现'), 'COUNT+UNTIL 要报错')
  await fillBlur('#ic-rrule', 'FREQ=WEEKLY;BYDAY=XX')
  assert((await page.textContent('#ic-warn')).includes('看不懂'), '非法 BYDAY 要报错')

  // ═══ 3. 节假日：每个工作日（跳过 + 调休补班） ═══
  await setRule({ date: '2026-09-20', time: '09:00', tz: 'Asia/Shanghai', rrule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR', pol: 'skip', makeup: true, listN: '20' })
  let rs = await rows()
  assert(rs.slice(0, 15).map((r) => `${r.date} ${r.time}`).join('|') === ORACLE.workdaily.join('|'), `每个工作日：\n  期望 ${ORACLE.workdaily.join(' ')}\n  实得 ${rs.slice(0, 15).map((r) => r.date).join(' ')}`)
  assert(rs[0].marks.includes('调休上班'), '2026-09-20（周日）是国庆调休上班日，要标出来')
  assert(rs.some((r) => r.date === '2026-10-10' && r.marks.includes('补班日加的')), '10-10（周六）调休上班应补一次')
  assert(!rs.some((r) => r.date === '2026-09-25' || r.date === '2026-10-01'), '中秋 09-25、国庆 10-01 应跳过')
  assert((await page.textContent('#ic-list-more')).includes('跳过'), '表下要列出这段时间跳过的日子')
  // 日历小部件：10 月有 7 个「休」、1 个「班」，有安排的日子 = 法定工作日数
  await page.waitForFunction(() => document.querySelector('#ic-cal').dataset.month === '2026-09')
  await page.click('#ic-cal-next')
  await page.waitForFunction(() => document.querySelector('#ic-cal').dataset.month === '2026-10')
  const oct = await page.$$eval('#ic-cal .ic-day[data-dn]', (bs) => ({ has: bs.filter((b) => b.classList.contains('ic-has')).length, off: bs.filter((b) => b.querySelector('.ic-off')).length, mk: bs.filter((b) => b.querySelector('.ic-mk')).length }))
  assert(oct.has === ORACLE.octWork && oct.off === ORACLE.octOff && oct.mk === ORACLE.octMk, `10 月日历：有安排 ${oct.has}/${ORACLE.octWork}、休 ${oct.off}/${ORACLE.octOff}、班 ${oct.mk}/${ORACLE.octMk}`)
  // 点 10-10 → 右侧显示当天；键盘方向键跨月后焦点仍在日历里
  const dn1010 = await page.evaluate(() => IC.dnFromYmd(2026, 10, 10))
  await page.click(`#ic-cal .ic-day[data-dn="${dn1010}"]`)
  assert((await page.textContent('#ic-slots')).includes('调休上班'), '点 10-10 右侧应写「调休上班」')
  assert(await page.evaluate((dn) => document.activeElement.dataset.dn === String(dn), dn1010), '点日子重画后焦点应留在同一天')
  const dn1028 = dn1010 + 18
  await page.focus(`#ic-cal .ic-day[data-dn="${dn1028}"]`)
  await page.keyboard.press('ArrowDown')
  await page.waitForFunction(() => document.querySelector('#ic-cal').dataset.month === '2026-11')
  assert(await page.evaluate((dn) => document.activeElement.dataset.dn === String(dn + 7), dn1028), '↓ 跨到 11 月后焦点应在 11-04')
  // 日历格子里的「休 / 班」角标不出格；格子是正方形且不太小
  const cellBad = await page.$$eval('#ic-cal .ic-day[data-dn]', (bs) => bs.flatMap((b) => {
    const r = b.getBoundingClientRect(), out = []
    if (r.width < 28 || Math.abs(r.width - r.height) > 1) out.push(`格子 ${b.dataset.dn} ${r.width}×${r.height}`)
    for (const t of b.querySelectorAll('.ic-tag')) { const q = t.getBoundingClientRect(); if (q.left < r.left - 1 || q.right > r.right + 1 || q.top < r.top - 1 || q.bottom > r.bottom + 1) out.push(`角标出格 ${b.dataset.dn}`) }
    return out
  }))
  assert(cellBad.length === 0, `日历格子：${cellBad.slice(0, 3).join('; ')}`)

  // ═══ 4. 导出：重复系列（RRULE + EXDATE / RDATE），用独立读取器复核 ═══
  await page.fill('#ic-sum', '晨会')
  await page.fill('#ic-alarm', '10')
  await page.selectOption('#ic-exmode', 'series')
  await synced()
  const exp1 = await download('#ic-dl')
  assert(exp1.name === '晨会.ics', `文件名 ${exp1.name}`)
  let L = icsCheck(exp1.text, '工作日系列')
  assert(L.filter((l) => l === 'BEGIN:VEVENT').length === 1, '重复系列只应有 1 个 VEVENT')
  assert(L.includes('BEGIN:VTIMEZONE') && L.includes('TZID:Asia/Shanghai'), '应带 Asia/Shanghai 的 VTIMEZONE')
  const rr = L.find((l) => l.startsWith('RRULE:'))
  assert(/^RRULE:FREQ=WEEKLY;UNTIL=\d{8}T\d{6}Z;BYDAY=MO,TU,WE,TH,FR$/.test(rr), `RRULE 应截到节假日数据末尾（UTC UNTIL）：${rr}`)
  assert(L.some((l) => l.startsWith('TRIGGER:-PT10M')), '提前 10 分钟提醒')
  {
    // 独立展开：周一至周五 × [DTSTART, UNTIL] − EXDATE + RDATE == 法定工作日（chinesecalendar）
    const ds = L.find((l) => l.startsWith('DTSTART;TZID=Asia/Shanghai:')).split(':')[1]
    const until = rr.match(/UNTIL=(\d{8})T(\d{6})Z/)
    const untilMs = Date.UTC(+until[1].slice(0, 4), +until[1].slice(4, 6) - 1, +until[1].slice(6, 8), +until[2].slice(0, 2), +until[2].slice(2, 4), +until[2].slice(4, 6))
    const set = new Set()
    // DTSTART 本身是第 1 个实例（RFC 5545）
    const day0 = Date.UTC(+ds.slice(0, 4), +ds.slice(4, 6) - 1, +ds.slice(6, 8))
    set.add(new Date(day0).toISOString().slice(0, 10))
    for (let t = day0; t + 3600e3 <= untilMs; t += 86400e3) {
      const wd = new Date(t).getUTCDay()
      if (wd >= 1 && wd <= 5) set.add(new Date(t).toISOString().slice(0, 10))
    }
    for (const v of vals(L, 'EXDATE')) set.delete(`${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`)
    for (const v of vals(L, 'RDATE')) set.add(`${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`)
    assert(vals(L, 'RDATE').some((v) => v.startsWith(ds.slice(0, 15))), 'DTSTART（周日补班）不在 RRULE 上，应同时写进 RDATE')
    const got = [...set].sort()
    assert(got.length === ORACLE.workdaysWindow.length && got.join() === ORACLE.workdaysWindow.join(), `导出的系列展开后应等于 2026-09-20…2027-12-31 的 ${ORACLE.workdaysWindow.length} 个法定工作日，实得 ${got.length}；首个差异 ${got.find((x, i) => x !== ORACLE.workdaysWindow[i])}`)
    const rie = rieExpand(exp1.text, '2026,9,20', '2028,1,1')
    if (rie) assert(rie.join() === ORACLE.workdaysWindow.map((d) => d + ' 09:00').join(), `recurring-ical-events 展开 ${rie.length} 个，应为 ${ORACLE.workdaysWindow.length}`)
  }
  // 「每次一个事件」
  await page.selectOption('#ic-exmode', 'expand'); await synced()
  const exp2 = await download('#ic-dl')
  L = icsCheck(exp2.text, '逐次展开')
  assert(L.filter((l) => l === 'BEGIN:VEVENT').length === ORACLE.workdaysWindow.length, `逐次展开应有 ${ORACLE.workdaysWindow.length} 个 VEVENT`)
  assert(new Set(L.filter((l) => l.startsWith('UID:'))).size === ORACLE.workdaysWindow.length, '逐次展开的 UID 两两不同')
  await page.selectOption('#ic-exmode', 'series'); await synced()

  // ═══ 5. 每月 15 日 顺延 / 每月最后一个工作日 ═══
  await setRule({ date: '2026-01-15', time: '10:00', tz: 'Asia/Shanghai', rrule: 'FREQ=MONTHLY;BYMONTHDAY=15', pol: 'next', makeup: false, listFrom: '2026-01-01', listN: '50' })
  rs = await rows()
  assert(rs.slice(0, 12).map((r) => r.date).join() === ORACLE.monthly15.join(), `每月 15 日顺延：\n  期望 ${ORACLE.monthly15.join(' ')}\n  实得 ${rs.slice(0, 12).map((r) => r.date).join(' ')}`)
  assert(rs[1].marks.includes('由 02-15 挪来'), `2 月那次要标「由 02-15 挪来」：${rs[1].marks}`)
  {
    const e = await download('#ic-dl'), L2 = icsCheck(e.text, '顺延系列')
    assert(/^RRULE:FREQ=MONTHLY;UNTIL=\d{8}T\d{6}Z;BYMONTHDAY=15$/.test(L2.find((l) => l.startsWith('RRULE:'))), `顺延系列的 RRULE：${L2.find((l) => l.startsWith('RRULE:'))}`)
    const ds = L2.find((l) => l.startsWith('DTSTART;')).split(':')[1].slice(0, 8)
    const set = new Set()
    const until = L2.find((l) => l.startsWith('RRULE:')).match(/UNTIL=(\d{8})/)[1]
    for (let y = +ds.slice(0, 4); y <= +until.slice(0, 4); y++) for (let m = 1; m <= 12; m++) {
      const v = `${y}${String(m).padStart(2, '0')}15`
      if (v >= ds && v <= until) set.add(`${y}-${String(m).padStart(2, '0')}-15`)
    }
    for (const v of vals(L2, 'EXDATE')) set.delete(`${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`)
    for (const v of vals(L2, 'RDATE')) set.add(`${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`)
    assert([...set].sort().join() === ORACLE.monthly15All.join(), `顺延系列导出后展开：${[...set].sort().join(' ')}`)
    const rie = rieExpand(e.text, '2026,1,1', '2028,1,1')
    if (rie) assert(rie.join() === ORACLE.monthly15All.map((d) => d + ' 10:00').join(), 'recurring-ical-events 复核顺延系列')
  }
  // 不跨月：2026-02 顺延到 02-24 仍在 2 月；改成「提前」：02-15（周日，春节）→ 02-14（周六调休上班）
  await page.selectOption('#ic-pol', 'prev'); await synced()
  rs = await rows()
  assert(rs[1].date === ORACLE.prevFeb15, `提前到上一个工作日：2 月应为 ${ORACLE.prevFeb15}（调休上班的周六），实得 ${rs[1].date}`)
  await page.fill('#ic-nl', '每月最后一个工作日 18:00 报销截止'); await page.click('#ic-nl-go'); await synced()
  await page.fill('#ic-date', '2026-01-01'); await page.fill('#ic-list-from', '2026-01-01'); await synced()
  rs = await rows()
  assert(rs.slice(0, 12).map((r) => r.date).join() === ORACLE.lastWorkday.join(), `每月最后一个工作日：\n  期望 ${ORACLE.lastWorkday.join(' ')}\n  实得 ${rs.slice(0, 12).map((r) => r.date).join(' ')}`)
  {
    const e = await download('#ic-dl'), L3 = icsCheck(e.text, '最后一个工作日')
    assert(!L3.some((l) => l.startsWith('RRULE')), '工作日序号规则不写 RRULE')
    // DTSTART 也写进了 RDATE（ical.js 不产出「DTSTART + RDATE、无 RRULE」里的 DTSTART）；按 RFC 重复的实例只算一次
    const rdv = vals(L3, 'RDATE').map((v) => v.slice(0, 8))
    const d0 = L3.find((l) => l.startsWith('DTSTART;')).split(':')[1].slice(0, 8)
    assert(rdv[0] === d0, `DTSTART 应同时写进 RDATE：${d0} / ${rdv[0]}`)
    const dates = [...new Set([d0].concat(rdv))].map((v) => `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`)
    assert(dates.slice(0, 12).join() === ORACLE.lastWorkday.join(), `导出的 DTSTART + RDATE：${dates.slice(0, 12).join(' ')}`)
    const rie = rieExpand(e.text, '2026,1,1', '2027,1,1')
    if (rie) assert(rie.join() === ORACLE.lastWorkday.map((d) => d + ' 18:00').join(), 'recurring-ical-events 复核「每月最后一个工作日」')
  }

  // ═══ 6. 夏令时：纽约 2026-03-08 02:30 不存在 ═══
  await setRule({ date: '2026-03-07', time: '02:30', tz: 'America/New_York', rrule: 'FREQ=DAILY;COUNT=3', listN: '10' })
  {
    const V6 = await download('#ic-dl'), LV = icsCheck(V6.text, '纽约系列')
    const vt = LV.join('\n').split('BEGIN:VTIMEZONE')[1]
    const onsets = [...vt.matchAll(/DTSTART:(\d{8}T\d{6})/g)].map((m) => m[1]).sort()
    assert(onsets[0] < '20260307T023000', `VTIMEZONE 的第一个观测期（${onsets[0]}）必须早于最早的实例 2026-03-07 02:30`)
    assert(vt.includes('RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU') && vt.includes('RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU'), '纽约的夏令时规则应识别成 RRULE')
    // 重复系列里缺口那次不加 EXDATE / RDATE（遵守 RFC 的客户端里两者是同一瞬间，EXDATE 会把 RDATE 一起删掉）
    assert(!vals(LV, 'EXDATE').length && !vals(LV, 'RDATE').length, `缺口实例不该写 EXDATE / RDATE：${vals(LV, 'EXDATE')} / ${vals(LV, 'RDATE')}`)
    const rie = rieExpand(V6.text, '2026,3,1', '2026,3,31', true)
    if (rie) assert(rie.join() === ORACLE.dstUtc.join(), `recurring-ical-events 按 UTC 复核：${rie}，应为 ${ORACLE.dstUtc}`)
    // 逐次导出：缺口那次直接写顺延后的有效时间 03:30（不存在的 02:30 在 ical.js 里会早 1 小时）
    await page.selectOption('#ic-exmode', 'expand'); await synced()
    const LE = icsCheck((await download('#ic-dl')).text, '纽约逐次')
    assert(vals(LE, 'DTSTART').includes('20260308T033000') && !vals(LE, 'DTSTART').includes('20260308T023000'), `逐次导出应写 03:30：${vals(LE, 'DTSTART')}`)
    await page.selectOption('#ic-exmode', 'series'); await synced()
  }
  rs = await rows()
  assert(rs.map((r) => `${r.date} ${r.time}`).join('|') === `2026-03-07 02:30|${ORACLE.dst.gapShown}|2026-03-09 02:30`, `缺口按缺口前偏移顺延：${rs.map((r) => `${r.date} ${r.time}`).join('|')}`)
  assert(rs[1].marks.includes('不存在'), '缺口里的那次要标出来')
  await page.selectOption('#ic-gap', 'skip'); await synced()
  rs = await rows()
  assert(rs.map((r) => r.date).join() === '2026-03-07,2026-03-09,2026-03-10', `选「忽略」（RFC 5545 原文，勘误 4271 已改为顺延）时不计入 COUNT：${rs.map((r) => r.date).join()}`)
  await page.selectOption('#ic-gap', 'shift'); await synced()
  // 页面里现场跑：重叠时刻取第一次（EDT）
  const fold = await page.evaluate(() => { const u = IC.wallToUtc('America/New_York', IC.wallFrom(2026, 11, 1, 1, 30, 0)); return IC.fmtWall(u.utc) })
  assert(fold === ORACLE.dst.foldUtc, `重复出现的 01:30 取第一次：UTC ${fold}，应为 ${ORACLE.dst.foldUtc}`)

  // ═══ 7. 中文往返：随机规则 → 描述 → 读回 → 实例相同（页内现场复跑 300 组） ═══
  const rt = await page.evaluate(() => {
    let seed = 20261125
    const rnd = (n) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n }
    const F = ['YEARLY', 'MONTHLY', 'WEEKLY', 'DAILY', 'HOURLY']
    const WDS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']
    let bad = 0, total = 0, first = ''
    for (let i = 0; i < 300; i++) {
      const f = F[rnd(F.length)], parts = ['FREQ=' + f]
      if (rnd(3) === 0) parts.push('INTERVAL=' + (2 + rnd(3)))
      if (f === 'WEEKLY' || rnd(3) === 0) parts.push('BYDAY=' + [...new Set([WDS[rnd(7)], WDS[rnd(7)]])].join(','))
      if ((f === 'MONTHLY' || f === 'YEARLY') && rnd(2)) parts.push('BYMONTHDAY=' + [1 + rnd(28), -1 - rnd(3)].join(','))
      if (f === 'MONTHLY' && rnd(3) === 0) parts.push('BYDAY=' + (rnd(2) ? '' : '-') + (1 + rnd(3)) + WDS[rnd(7)])
      if (f === 'YEARLY' && rnd(2)) parts.push('BYMONTH=' + (1 + rnd(12)))
      if (f === 'DAILY' && rnd(3) === 0) parts.push('BYMONTH=' + (1 + rnd(12)) + ',' + (1 + rnd(12)))
      if (f === 'HOURLY' && rnd(2)) parts.push('BYMINUTE=0,30')
      if (f !== 'HOURLY' && rnd(5) === 0) parts.push('BYHOUR=3;BYMINUTE=0,24;BYSECOND=0')
      if (rnd(4) === 0) parts.push('COUNT=' + (3 + rnd(9)))
      else if (rnd(5) === 0) parts.push('UNTIL=2027' + String(1 + rnd(9)).padStart(2, '0') + '0' + (1 + rnd(9)) + 'T0' + rnd(10) + String(rnd(60)).padStart(2, '0') + String(rnd(60)).padStart(2, '0') + 'Z')
      const uniq = []
      const seen = new Set()
      for (const p of parts) { const k = p.split('=')[0]; if (!seen.has(k)) { seen.add(k); uniq.push(p) } }
      const pr = IC.parseRRule(uniq.join(';'))
      if (!pr.rule) continue
      const start = { kind: 'tz', tz: 'Asia/Shanghai', wall: IC.wallFrom(2026, 1 + rnd(12), 1 + rnd(28), rnd(24), rnd(4) * 15, rnd(3) ? 0 : rnd(60)) }
      const desc = IC.describe(pr.rule, start)
      const back = IC.parseNL(desc)
      if (!back.rule) { bad++; first = first || desc; continue }
      const R2 = IC.finalizeUntil(back.rule, start)
      const a = IC.expandSet({ start, rrules: [pr.rule] }, null, { limit: 40 }).items.map((x) => x.utc).join()
      const b = IC.expandSet({ start, rrules: [R2] }, null, { limit: 40 }).items.map((x) => x.utc).join()
      total++
      if (a !== b) { bad++; first = first || uniq.join(';') + ' → ' + desc + ' → ' + IC.serializeRRule(R2) }
    }
    return { bad, total, first }
  })
  assert(rt.total >= 250 && rt.bad === 0, `中文往返 ${rt.total} 组里 ${rt.bad} 组不一致：${rt.first}`)

  // ═══ 8. 工作日计算 ═══
  await onTab('work')
  for (const r of ORACLE.ranges) {
    await page.fill('#ic-w-a', r.a); await page.fill('#ic-w-b', r.b); await page.setChecked('#ic-w-inc', true)
    await page.waitForFunction((k) => document.querySelector('#ic-w-out').dataset.key !== undefined && document.querySelector('#ic-w-days b').textContent === String(k), r.days)
    const w = await page.textContent('#ic-w-work b'), mk = await page.textContent('#ic-w-mk b')
    assert(w === String(r.work) && mk === String(r.mk), `${r.a}…${r.b} 工作日应为 ${r.work}、调休上班 ${r.mk}，实得 ${w}、${mk}`)
  }
  for (const a of ORACLE.addw) {
    await page.fill('#ic-w-start', a.start); await page.fill('#ic-w-n', String(a.n)); await page.selectOption('#ic-w-mode', 'cn')
    await page.waitForFunction((v) => document.querySelector('#ic-w-res').textContent.startsWith(v), a.res, { timeout: 5000 }).catch(() => {})
    const got = (await page.textContent('#ic-w-res')).slice(0, 10)
    assert(got === a.res, `${a.start} ${a.n >= 0 ? '+' : ''}${a.n} 个工作日应为 ${a.res}，实得 ${got}`)
  }
  for (const y of ['2026', '2027']) {
    await page.selectOption('#ic-w-year', y)
    await page.waitForFunction((y) => document.querySelector('#ic-w-cal').dataset.year === y, y)
    const st = await page.$$eval('#ic-w-ystats .ic-stat', (ns) => Object.fromEntries(ns.map((n) => [n.id, n.querySelector('b').textContent])))
    const T = ORACLE.year[y]
    assert(st['ic-w-y-work'] === String(T.work) && st['ic-w-y-rest'] === String(T.rest) && st['ic-w-y-mk'] === String(T.makeup) && st['ic-w-y-stat'] === '13', `${y} 年统计 ${JSON.stringify(st)}，应为 工作日 ${T.work}、休息 ${T.rest}、调休 ${T.makeup}、法定 13`)
    const cells = await page.$$eval('#ic-w-cal .ic-yd.ic-st', (ns) => ns.filter((n) => n.getBoundingClientRect().width > 8).length)
    assert(cells === 13, `${y} 年历里应有 13 个法定节假日格（实得 ${cells}）`)
    const e = await download('#ic-w-ics'), L4 = icsCheck(e.text, `${y} 节假日日历`)
    assert(L4.filter((l) => l === 'BEGIN:VEVENT').length === T.holidayEvents, `${y} 节假日日历应有 ${T.holidayEvents} 个事件（${T.runs} 段放假 + ${T.makeup} 个调休上班）`)
    assert(L4.filter((l) => l.startsWith('SUMMARY:') && l.includes('调休上班')).length === T.makeup, `${y} 调休上班事件数`)
  }
  await page.selectOption('#ic-w-year', '2029')
  assert((await page.textContent('#ic-w-ysub')).includes('还没公布'), '未公布的年份要说明是推算')

  // ═══ 9. 农历 ═══
  await onTab('lunar')
  const lunarDates = () => page.$$eval('#ic-l-table tr', (trs) => trs.map((tr) => (tr.querySelectorAll('td')[1] || {}).textContent))
  await page.selectOption('#ic-l-bm', '8'); await page.selectOption('#ic-l-bd', '15'); await page.setChecked('#ic-l-leap', false)
  await page.fill('#ic-l-y0', '2026'); await page.fill('#ic-l-years', '10')
  await page.waitForFunction(() => document.querySelectorAll('#ic-l-table tr').length === 10)
  assert((await lunarDates()).join() === ORACLE.lunar15.join(), `农历八月十五：${(await lunarDates()).join(' ')}`)
  await page.selectOption('#ic-l-bm', '6'); await page.selectOption('#ic-l-bd', '1'); await page.setChecked('#ic-l-leap', true); await page.selectOption('#ic-l-skipm', 'BACKWARD'); await page.fill('#ic-l-y0', '2025')
  await page.waitForFunction(() => document.querySelector('#ic-l-table tr td:nth-child(2)').textContent === '2025-07-25')
  assert((await lunarDates()).join() === ORACLE.leap6.join(), `闰六月初一（没闰六月就在六月）：${(await lunarDates()).join(' ')}`)
  assert((await page.textContent('#ic-l-table')).includes('这年没有闰六月'), '不是闰年时要说明')
  await page.click('#ic-l-use'); await synced()
  assert(await page.inputValue('#ic-rrule') === 'RSCALE=CHINESE;FREQ=YEARLY;BYMONTH=6L;BYMONTHDAY=1;SKIP=BACKWARD', `闰月规则：${await page.inputValue('#ic-rrule')}`)
  assert((await rows()).slice(0, 10).map((r) => r.date).join() === ORACLE.leap6.join(), `规则页（RSCALE 引擎）闰六月初一：${(await rows()).slice(0, 10).map((r) => r.date).join(' ')}`)
  await onTab('lunar')
  await page.selectOption('#ic-l-bm', '12'); await page.selectOption('#ic-l-bd', '30'); await page.setChecked('#ic-l-leap', false); await page.selectOption('#ic-l-skipd', 'BACKWARD'); await page.fill('#ic-l-y0', '2026')
  await page.waitForFunction((d) => document.querySelector('#ic-l-table tr td:nth-child(2)').textContent === d, ORACLE.la30[0])
  assert((await lunarDates()).join() === ORACLE.la30.join(), `腊月三十（小建改廿九）：${(await lunarDates()).join(' ')}`)
  assert((await page.textContent('#ic-l-rule')).includes('SKIP=BACKWARD'), '腊月三十的等价规则要带 SKIP')
  await page.click('#ic-l-use'); await synced()
  assert((await rows()).slice(0, 10).map((r) => r.date).join() === ORACLE.la30.join(), `规则页（RSCALE 引擎）腊月三十：${(await rows()).slice(0, 10).map((r) => r.date).join(' ')}`)
  await onTab('lunar')
  {
    await page.fill('#ic-l-title', '除夕')
    const e = await download('#ic-l-dl'), L5 = icsCheck(e.text, '农历逐年')
    const ds = vals(L5, 'DTSTART').map((v) => `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`)
    assert(ds.join() === ORACLE.la30.join(), `农历 .ics 的 DTSTART：${ds.join(' ')}`)
    assert(L5.filter((l) => l === 'SUMMARY:除夕').length === 10, '每年一个「除夕」事件')
  }
  await page.fill('#ic-l-solar', ORACLE.conv.solar)
  await page.waitForFunction(() => document.querySelector('#ic-l-out').dataset.dn)
  assert((await page.textContent('#ic-l-out')) === (ORACLE.conv.lunarLeap ? '闰' : '') + '六月初一' && ORACLE.conv.lm === 6 && ORACLE.conv.ld === 1, `2025-07-25 应为闰六月初一，实得 ${await page.textContent('#ic-l-out')}`)
  await page.fill('#ic-l-y', '2026'); await page.selectOption('#ic-l-m', 'N1'); await page.selectOption('#ic-l-d', '1')
  assert((await page.textContent('#ic-l-conv')).startsWith(ORACLE.conv.cny2026), `2026 正月初一应为 ${ORACLE.conv.cny2026}`)
  await page.selectOption('#ic-l-preset', { label: '中秋节' })
  await page.click('#ic-l-use'); await synced()
  assert(await page.inputValue('#ic-rrule') === 'RSCALE=CHINESE;FREQ=YEARLY;BYMONTH=8;BYMONTHDAY=15', `放进规则页：${await page.inputValue('#ic-rrule')}`)
  assert((await rows()).slice(0, 10).map((r) => r.date).join() === ORACLE.lunar15.join(), '规则页里的农历实例')

  // ═══ 10. ICS 体检 ═══
  await onTab('inspect')
  const codes = async () => page.$$eval('#ic-i-issues li[data-code]', (ls) => ls.map((l) => l.dataset.code))
  const hit = new Set()
  // Google：单次改期（RECURRENCE-ID）+ EXDATE
  await page.click('[data-sample="google"]')
  await page.selectOption('#ic-i-tz', 'America/Los_Angeles'); await page.fill('#ic-i-from', '2026-10-20'); await page.fill('#ic-i-to', '2026-12-01')
  await page.$eval('#ic-i-to', (el) => el.dispatchEvent(new Event('change', { bubbles: true })))
  await page.waitForFunction(() => document.querySelector('#ic-i-events').dataset.key.includes('America/Los_Angeles'))
  const gl = await page.$$eval('#ic-i-events tr', (trs) => trs.map((tr) => tr.textContent))
  for (const d of ORACLE.googleLA.mondays) {
    const present = gl.some((t) => t.startsWith(d))
    const shouldBe = d !== ORACLE.googleLA.exdate && d !== ORACLE.googleLA.movedFrom
    assert(present === shouldBe, `Google 示例 ${d} ${shouldBe ? '应出现' : '不应出现'}`)
  }
  assert(gl.some((t) => t.startsWith(ORACLE.googleLA.moved) && t.includes('单次改期')), '改期到 11-17 09:00 的那次要出现并标「单次改期」')
  assert(gl.some((t) => t.includes('感恩节') && t.includes('2026-11-26')), '感恩节（11 月第 4 个周四）')
  ;(await codes()).forEach((c) => hit.add(c))
  // Outlook：Windows 时区名 + 自带 VTIMEZONE；纽约那条跨夏令时结束
  await page.click('[data-sample="outlook"]')
  await page.selectOption('#ic-i-tz', 'Asia/Shanghai'); await page.fill('#ic-i-from', '2026-10-25'); await page.fill('#ic-i-to', '2026-11-30')
  await page.$eval('#ic-i-to', (el) => el.dispatchEvent(new Event('change', { bubbles: true })))
  await page.waitForFunction(() => document.querySelector('#ic-i-events').dataset.key.includes('Asia/Shanghai'))
  const ol = await page.$$eval('#ic-i-events tr', (trs) => trs.map((tr) => tr.textContent))
  for (const t of ORACLE.outlookNY) assert(ol.some((x) => x.startsWith(t) && x.includes('与纽约同步')), `纽约周会在北京时间应为 ${t}`)
  assert(ol.some((x) => x.startsWith('2026-11-09 09:30')) && !ol.some((x) => x.startsWith('2026-11-11 09:30')), 'EXDATE 11-11 去掉、11-09 保留')
  assert(await page.textContent('#ic-i-n-tz b') === '2', 'Outlook 示例有 2 个 VTIMEZONE')
  ;(await codes()).forEach((c) => hit.add(c))
  // 有毛病的文件
  await page.click('[data-sample="broken"]')
  await page.waitForFunction(() => +document.querySelector('#ic-i-n-err b').textContent > 0)
  const brokenCodes = await codes()
  brokenCodes.forEach((c) => hit.add(c))
  const errBefore = +(await page.textContent('#ic-i-n-err b'))
  // 再补一份专门的夹具，覆盖示例碰不到的规则
  const C1 = String.fromCharCode(1)
  const extra = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//t//t//EN',
    'BEGIN:VTIMEZONE', 'TZID:Half/Broken', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'END:STANDARD', 'END:VTIMEZONE',
    'BEGIN:VTIMEZONE', 'TZID:America/New_York', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:-0300', 'TZOFFSETTO:-0300', 'END:STANDARD', 'END:VTIMEZONE',
    'BEGIN:VEVENT', 'UID:x1@t', 'DTSTAMP:20261120T000000Z', 'SUMMARY:没有开始' + C1, 'THIS IS NOT A PROPERTY', 'END:VEVENT',
    'BEGIN:VEVENT', 'UID:x2@t', 'DTSTAMP:20261120T000000Z', 'DTSTART;TZID=America/New_York:20261201T090000', 'RRULE:FREQ=FORTNIGHTLY', 'END:VEVENT',
    'BEGIN:VEVENT', 'UID:x3@t', 'DTSTAMP:20261120T000000Z', 'DTSTART:20261201T090000',
    'END:VCALENDAR'].join('\r\n') + '\r\n'
  await page.fill('#ic-i-text', extra); await page.click('#ic-i-go')
  await page.waitForFunction(() => document.querySelectorAll('#ic-i-issues li[data-code]').length > 3)
  ;(await codes()).forEach((c) => hit.add(c))
  await page.fill('#ic-i-text', 'hello, not a calendar'); await page.click('#ic-i-go')
  ;(await codes()).forEach((c) => hit.add(c))
  // 能力清单：页面公布的每一条体检规则都要被实际触发过
  const RULES = await page.evaluate(() => IC.ICS_RULES.map((r) => r[0]))
  const dead = RULES.filter((c) => !hit.has(c))
  assert(RULES.length >= 35 && dead.length === 0, `这些体检规则一次都没触发：${dead.join(', ')}`)
  // 一键修复：独立读取器复核 + 页面引擎复检
  await page.click('[data-sample="broken"]')
  await page.waitForFunction(() => !document.querySelector('#ic-i-fix').disabled)
  const fixed = await download('#ic-i-fix')
  const FL = icsCheck(fixed.text, '修复后')
  assert(FL.includes('VERSION:2.0') && FL.some((l) => l.startsWith('PRODID:')), '修复后有 VERSION / PRODID')
  // 正向锚点：读取器确实读到了内容（转义后的标题、站会规则）
  assert(FL.includes('SUMMARY:团建\\, 聚餐\\; 带家属'), '正向锚点：团建标题被转义保留')
  assert(FL.some((l) => /^RRULE:FREQ=DAILY;UNTIL=\d{8}T\d{6}Z$/.test(l)), `站会规则：去掉 COUNT、UNTIL 换成 UTC：${FL.find((l) => l.startsWith('RRULE:FREQ=DAILY'))}`)
  const vevents = FL.join('\n').split('BEGIN:VEVENT').slice(1)
  assert(vevents.every((v) => /\nUID:/.test('\n' + v) && /\nDTSTAMP:\d{8}T\d{6}Z/.test('\n' + v)), '修复后每个 VEVENT 都有 UID 与 UTC 的 DTSTAMP')
  assert(FL.filter((l) => l === 'UID:dup@example.com').length === 1, '重复 UID 只留一个')
  assert(FL.some((l) => l.startsWith('DTSTART;TZID=Asia/Tokyo:')), 'Windows 时区名改成 IANA')
  assert(FL.includes('BEGIN:VTIMEZONE') && FL.includes('TZID:Asia/Shanghai'), '补上 Asia/Shanghai 的 VTIMEZONE')
  const after = await page.evaluate((t) => IC.validateDoc(IC.loadDoc(t)).map((x) => x.code), fixed.text)
  for (const c of ['F-VERSION', 'F-PRODID', 'F-CRLF', 'E-UID', 'E-DTSTAMP', 'E-DTSTAMP-UTC', 'E-TEXT-ESC', 'E-END-DUR', 'E-ALLDAY-ZERO', 'R-COUNT-UNTIL', 'R-UNTIL', 'E-WINTZ', 'E-VALUE-DATE', 'E-DUP-UID', 'E-TZ-MISSING']) {
    assert(brokenCodes.includes(c), `修复前应有 ${c}`)
    assert(!after.includes(c), `修复后不应再有 ${c}`)
  }
  assert(+(await page.getAttribute('#ic-i-fixlog', 'data-left')) < errBefore, '修复后剩余问题应少于修复前的错误数')
  // 点行号跳到源文件
  await page.click('#ic-i-issues .ic-ln >> nth=0')
  assert(await page.evaluate(() => document.activeElement.id === 'ic-i-src'), '点行号后焦点到源文件')

  // ═══ 11. 我的日程：存、改名、删除、多页签、写盘失败 ═══
  await setRule({ date: '2026-09-20', time: '09:00', tz: 'Asia/Shanghai', rrule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR', pol: 'skip', makeup: true, listN: '20' })
  await page.fill('#ic-sum', '晨会'); await synced()
  await page.click('#ic-save')
  await page.waitForFunction(() => window.ICA.readItems().length === 1)
  await onTab('mine')
  await page.click('#ic-m-today')
  for (let i = 0; i < 1; i++) await page.click('#ic-m-prev')
  await page.waitForFunction(() => document.querySelector('#ic-m-cal').dataset.month === '2026-10')
  assert(await page.getAttribute('#ic-m-cal', 'data-n') === String(ORACLE.gridOct), `10 月月历（9/28–11/1）应有 ${ORACLE.gridOct} 次晨会，实得 ${await page.getAttribute('#ic-m-cal', 'data-n')}`)
  const evBad = await page.$$eval('#ic-m-cal .ic-mc', (cs) => cs.flatMap((c) => { const r = c.getBoundingClientRect(); return [...c.querySelectorAll('.ic-ev')].filter((e) => { const q = e.getBoundingClientRect(); return q.right > r.right + 1 || q.left < r.left - 1 }).map(() => c.dataset.dn) }))
  assert(evBad.length === 0, `月历里的事件条越出格子：${evBad.slice(0, 3)}`)
  // 第二个标签页各存一条：读-改-写，不互相覆盖；storage 事件同步列表
  const pageB = await page.context().newPage()
  await pageB.clock.setFixedTime(new Date('2026-11-25T02:00:00Z'))
  await pageB.goto(toolURL)
  await pageB.waitForFunction(() => window.ICA)
  await pageB.fill('#ic-sum', '周报'); await pageB.$eval('#ic-sum', (el) => el.dispatchEvent(new Event('input', { bubbles: true })))
  await pageB.click('#ic-save')
  await pageB.waitForFunction(() => window.ICA.readItems().length === 2)
  await page.waitForFunction(() => document.querySelectorAll('#ic-m-list .ic-mitem').length === 2)
  await onTab('rule'); await page.fill('#ic-sum', '复盘'); await synced(); await page.click('#ic-save')
  await page.waitForFunction(() => window.ICA.readItems().length === 3)
  const namesB = await pageB.evaluate(() => window.ICA.items().map((x) => x.name).sort().join())
  assert(namesB === '周报,复盘,晨会'.split(',').sort().join(), `另一个标签页同步后应有三条：${namesB}`)
  await pageB.close()
  // 存储被别处改过、本页没收到 storage 事件（同一页面里的 setItem 不触发）：保存仍要先重读，不能用内存里的旧列表覆盖
  await page.evaluate(() => { const k = 'ic-studio-v1-items', a = JSON.parse(localStorage.getItem(k)); a.push(JSON.parse(JSON.stringify(Object.assign({}, a[0], { id: 'ext-write', name: '外部写入' })))); localStorage.setItem(k, JSON.stringify(a)) })
  assert(await page.evaluate(() => window.ICA.items().length === 3), '本页内存里还是 3 条（没有 storage 事件）')
  await page.click('#ic-save')
  await page.waitForFunction(() => window.ICA.readItems().length === 5)
  assert(await page.evaluate(() => window.ICA.readItems().some((x) => x.id === 'ext-write')), '保存时重读了存储：外部写入的那条还在')
  await page.evaluate(() => window.ICA.mutateItems((list) => { list.splice(list.findIndex((x) => x.id === 'ext-write'), 1); list.pop() }))
  await page.waitForFunction(() => window.ICA.readItems().length === 3)
  // 写盘失败：不提示成功、列表不变
  await page.evaluate(() => { window.__set = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (k === 'ic-studio-v1-items') throw new DOMException('full', 'QuotaExceededError'); return window.__set.call(this, k, v) } })
  await page.click('#ic-save')
  await page.waitForFunction(() => document.querySelector('#ic-toast').textContent.includes('没存上'))
  assert(await page.evaluate(() => window.ICA.items().length === 3 && window.ICA.readItems().length === 3), '写盘失败时列表不变')
  await page.evaluate(() => { Storage.prototype.setItem = window.__set })
  // 改名（Enter 收尾只执行一次）、隐藏、删除（两步）
  await onTab('mine')
  await page.evaluate(() => { window.__w = 0; const set0 = Storage.prototype.setItem; window.__set0 = set0; Storage.prototype.setItem = function (k, v) { if (k === 'ic-studio-v1-items') window.__w++; return set0.call(this, k, v) } })
  await page.click('#ic-m-list .ic-mitem >> nth=0 >> [data-act="rename"]')
  await page.fill('#ic-m-list .ic-rename', '每日晨会')
  await page.keyboard.press('Enter')
  await page.waitForFunction(() => window.ICA.readItems().some((x) => x.name === '每日晨会'))
  // 再做一次也要拿锁的操作（隐藏）：锁按先来后到，若 blur 又提交了一次，它会排在这次前面
  await page.click('#ic-m-list .ic-mitem >> nth=1 >> [data-act="toggle"]')
  await page.waitForFunction(() => window.ICA.readItems()[1].off === true)
  assert(await page.evaluate(() => window.__w) === 2, `改名应只写一次存储（改名 1 + 隐藏 1），实得 ${await page.evaluate(() => window.__w)} 次`)
  await page.evaluate(() => { Storage.prototype.setItem = window.__set0 })
  await page.click('#ic-m-list .ic-mitem >> nth=1 >> [data-act="toggle"]')
  await page.waitForFunction(() => !window.ICA.readItems()[1].off)
  assert(errors.length === 0, `改名后不应有页面报错：${errors.join(' | ')}`)
  await page.click('#ic-m-list .ic-mitem >> nth=2 >> [data-act="del"]')
  assert((await page.textContent('#ic-m-list .ic-mitem >> nth=2 >> [data-act="del"]')) === '确认删除', '删除要两步')
  await page.click('#ic-m-list .ic-mitem >> nth=2 >> [data-act="del"]')
  await page.waitForFunction(() => window.ICA.readItems().length === 2)
  const all = await download('#ic-m-export')
  const AL = icsCheck(all.text, '全部导出')
  assert(AL.filter((l) => l === 'BEGIN:VEVENT').length === 2 && AL.filter((l) => l === 'BEGIN:VTIMEZONE').length === 1, '两个系列、同一个时区只留一个 VTIMEZONE')
  assert(AL.includes('SUMMARY:每日晨会'), '改过的名字写进导出')
  // 载入
  await page.click('#ic-m-list .ic-mitem >> nth=0 >> [data-act="load"]')
  await page.waitForFunction(() => !document.querySelector('#ic-pane-rule').hidden)
  assert(await page.inputValue('#ic-rrule') === 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR', '载入后规则回到规则页')

  // ═══ 12. 草稿：改完立刻刷新也不丢（pagehide 补写） ═══
  await page.fill('#ic-sum', '刷新前的标题'); await page.$eval('#ic-sum', (el) => el.dispatchEvent(new Event('input', { bubbles: true })))
  await page.reload()
  await page.waitForFunction(() => window.ICA)
  assert(await page.inputValue('#ic-sum') === '刷新前的标题', `草稿应在离页时补写：${await page.inputValue('#ic-sum')}`)

  // ═══ 13. 分享链接（同页改 hash 也要打开） ═══
  await setRule({ date: '2026-12-01', time: '19:00', tz: 'Asia/Shanghai', rrule: 'FREQ=MONTHLY;BYDAY=2TU', listN: '10' })
  await page.click('#ic-share')
  const link = await page.getAttribute('#ic-share', 'data-link')
  assert(/#s=[A-Za-z0-9_-]+$/.test(link), `分享链接 ${link}`)
  await fillBlur('#ic-rrule', 'FREQ=DAILY')
  await page.goto(link)
  await page.waitForFunction(() => document.querySelector('#ic-rrule').value === 'FREQ=MONTHLY;BYDAY=2TU', null, { timeout: 10000 })
  assert(await page.evaluate(() => location.hash === ''), '打开后去掉 hash')
  assert(await page.inputValue('#ic-date') === '2026-12-01', '分享链接带上开始日期')

  // ═══ 13b. Codex 复核回归（每条采纳的意见一条能抓住它的断言） ═══
  const ics = async () => icsCheck((await download('#ic-dl')).text, '回归导出')
  // P1 用户指定的截止日：普通规则也要截；COUNT 越过截止日换成 UNTIL；没越过保留 COUNT；不指定则按规则本身导出
  await setRule({ date: '2026-01-01', time: '09:00', tz: 'Asia/Shanghai', rrule: 'FREQ=WEEKLY;BYDAY=TH', listN: '10' })
  await page.selectOption('#ic-exmode', 'series')
  await page.fill('#ic-exto', '2026-01-31'); await synced()
  let R1 = (await ics()).find((l) => l.startsWith('RRULE:'))
  assert(R1 === `RRULE:FREQ=WEEKLY;UNTIL=${ORACLE.capUntil};BYDAY=TH`, `指定截止日后应截到 ${ORACLE.capUntil}：${R1}`)
  await fillBlur('#ic-rrule', 'FREQ=WEEKLY;COUNT=20;BYDAY=TH')
  R1 = (await ics()).find((l) => l.startsWith('RRULE:'))
  assert(R1 === `RRULE:FREQ=WEEKLY;UNTIL=${ORACLE.capUntil};BYDAY=TH`, `COUNT 越过截止日应换成 UNTIL（且不并存）：${R1}`)
  await fillBlur('#ic-rrule', 'FREQ=WEEKLY;COUNT=2;BYDAY=TH')
  R1 = (await ics()).find((l) => l.startsWith('RRULE:'))
  assert(R1 === 'RRULE:FREQ=WEEKLY;COUNT=2;BYDAY=TH', `COUNT 在截止日内就保留：${R1}`)
  await page.fill('#ic-exto', ''); await fillBlur('#ic-rrule', 'FREQ=WEEKLY;BYDAY=TH')
  R1 = (await ics()).find((l) => l.startsWith('RRULE:'))
  assert(R1 === 'RRULE:FREQ=WEEKLY;BYDAY=TH' && (await page.textContent('#ic-exinfo')).includes('不设截止'), `没指定截止日、也没节假日调整：按规则本身导出：${R1}`)
  // P1 导出超量：每分钟一次、逐次展开 4 天 = 5760 个 > 上限 5000 ⇒ 不给下载（3 天 4320 个能完整导出）
  await setRule({ date: '2026-01-01', time: '00:00', tz: 'Asia/Shanghai', rrule: 'FREQ=MINUTELY', listN: '10' })
  await page.selectOption('#ic-exmode', 'expand'); await page.fill('#ic-exto', '2026-01-03'); await synced()
  assert(!(await page.$eval('#ic-dl', (b) => b.disabled)), '3 天 4320 个实例在上限内，应能导出')
  await page.fill('#ic-exto', '2026-01-04'); await synced()
  assert(await page.$eval('#ic-dl', (b) => b.disabled) && (await page.textContent('#ic-exinfo')).includes('没法完整导出'), '实例超过上限时下载应被挡住并说明')
  await page.selectOption('#ic-exmode', 'series'); await page.fill('#ic-exto', ''); await synced()
  // P1 窗口前的实例不能占满名额：每分钟一次、一周后再看
  await page.fill('#ic-list-from', '2026-01-08'); await synced()
  rs = await rows()
  assert(rs.length === 10 && rs[0].date === '2026-01-08' && rs[0].time === '00:00', `一周后的列表应从 01-08 00:00 开始：${rs.slice(0, 2).map((r) => r.date + ' ' + r.time)}`)
  // P1 第 N 个工作日的 COUNT 从 DTSTART 起算
  await page.fill('#ic-nl', '每月最后一个工作日 18:00 共 2 次'); await page.click('#ic-nl-go'); await synced()
  await page.fill('#ic-date', '2026-01-01'); await page.fill('#ic-list-from', '2026-03-01'); await synced()
  assert((await rows()).length === 0, `共 2 次（1、2 月）结束后，3 月起不应再有：${(await rows()).map((r) => r.date)}`)
  await page.fill('#ic-list-from', '2026-01-01'); await synced()
  assert((await rows()).map((r) => r.date).join() === ORACLE.lastWorkday.slice(0, 2).join(), '共 2 次 = 1、2 月最后一个工作日')
  await page.selectOption('#ic-endkind', 'never'); await synced()
  assert((await page.textContent('#ic-desc')).includes('每月最后一个工作日'), '改结束条件不能把「第 N 个工作日」冲回普通规则')
  // P1 系列结束后不再加调休补班
  await setRule({ date: '2026-01-05', time: '09:00', tz: 'Asia/Shanghai', rrule: 'FREQ=WEEKLY;COUNT=1;BYDAY=MO,TU,WE,TH,FR', pol: 'skip', makeup: true, listFrom: '2026-10-01', listN: '10' })
  assert((await rows()).length === 0, `COUNT=1 的系列在 10 月不应冒出补班日：${(await rows()).map((r) => r.date)}`)
  // P1 BYSETPOS 不物化整年的每一秒（3154 万个候选）
  const all60 = (n) => Array.from({ length: n }, (_, i) => i).join(',')
  const t0 = Date.now()
  await setRule({ date: '2026-01-01', time: '00:00', tz: 'Asia/Shanghai', rrule: `FREQ=YEARLY;COUNT=2;BYSECOND=${all60(60)};BYMINUTE=${all60(60)};BYHOUR=${all60(24)};BYDAY=MO,TU,WE,TH,FR,SA,SU;BYSETPOS=-1`, listN: '10' })
  rs = await rows()
  // DTSTART（01-01 00:00）不在规则上，按 RFC 5545 记作第 1 次；第 2 次是全年最后一秒
  assert(rs.length === 2 && `${rs[1].date} ${rs[1].time}` === '2026-12-31 23:59' && Date.now() - t0 < 4000, `全年每秒取最后一个：${rs.map((r) => r.date + ' ' + r.time)}，用时 ${Date.now() - t0} ms`)
  // P1 解析出错的规则不能导出 / 保存
  await fillBlur('#ic-rrule', 'FREQ=WEEKLY;BYDAY=XX')
  assert(await page.$eval('#ic-dl', (b) => b.disabled) && await page.$eval('#ic-save', (b) => b.disabled) && await page.evaluate(() => window.ICA.lastExport() === null), '解析出错时下载 / 保存都应被挡住')
  assert((await rows()).length === 0, '解析出错时不展开部分规则')
  // P1 DTSTART 不计入时，导出的 DTSTART 挪到第一个实例
  await setRule({ date: '2026-11-29', time: '09:00', tz: 'Asia/Shanghai', rrule: 'FREQ=WEEKLY;COUNT=2;BYDAY=MO', listN: '10' })
  await page.setChecked('#ic-incdt', false); await synced()
  assert((await rows()).map((r) => r.date).join() === '2026-11-30,2026-12-07', `不计 DTSTART 时预览：${(await rows()).map((r) => r.date)}`)
  {
    const L6 = await ics()
    assert(L6.some((l) => l === 'DTSTART;TZID=Asia/Shanghai:20261130T090000') && L6.includes('RRULE:FREQ=WEEKLY;COUNT=2;BYDAY=MO'), `导出的 DTSTART 应是第一个周一：${L6.find((l) => l.startsWith('DTSTART;TZID'))}`)
  }
  await page.setChecked('#ic-incdt', true); await synced()
  // P2 严格跳过夏令时缺口时，BYSETPOS 只在有效候选里数
  await setRule({ date: '2026-03-07', time: '02:00', tz: 'America/New_York', rrule: 'FREQ=DAILY;COUNT=3;BYHOUR=2,3;BYMINUTE=0;BYSETPOS=1', gap: 'skip', listN: '10' })
  rs = await rows()
  assert(rs.map((r) => `${r.date} ${r.time}`).join('|') === ORACLE.gapSetpos.join('|'), `缺口日 BYSETPOS=1 应取 03:00：${rs.map((r) => `${r.date} ${r.time}`).join('|')}`)
  await page.selectOption('#ic-gap', 'shift'); await synced()
  // P2 RDATE PERIOD 的时长、DURATION 的天按当地日历、RANGE=THISANDFUTURE
  await onTab('inspect')
  const fxA = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//t//t//EN', 'BEGIN:VEVENT', 'UID:p@t', 'DTSTAMP:20260101T000000Z', 'DTSTART;TZID=America/New_York:20260305T120000', 'DURATION:P1D',
    'RRULE:FREQ=DAILY;COUNT=4', 'RDATE;VALUE=PERIOD;TZID=America/New_York:20260306T120000/PT2H', 'SUMMARY:跨夏令时', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n') + '\r\n'
  await page.fill('#ic-i-text', fxA); await page.click('#ic-i-go')
  await page.selectOption('#ic-i-tz', 'America/New_York'); await page.fill('#ic-i-from', '2026-03-01'); await page.fill('#ic-i-to', '2026-03-31')
  await page.$eval('#ic-i-to', (el) => el.dispatchEvent(new Event('change', { bubbles: true })))
  await page.waitForFunction(() => document.querySelector('#ic-i-events').dataset.key.includes('America/New_York'))
  const pa = await page.$$eval('#ic-i-events tr', (trs) => trs.map((tr) => [tr.children[0].textContent, tr.children[1].textContent]))
  assert(JSON.stringify(pa) === JSON.stringify(ORACLE.durA.map((x) => [x.start, x.end])), `DURATION / RDATE PERIOD 的结束：${JSON.stringify(pa)}`)
  assert(ORACLE.durExact !== ORACLE.durA[2].end, '对照：按 86400 秒算会落到 ' + ORACLE.durExact)
  const fxB = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//t//t//EN', 'BEGIN:VEVENT', 'UID:f@t', 'DTSTAMP:20260101T000000Z', 'DTSTART;TZID=Asia/Shanghai:20261201T090000', 'DURATION:PT1H', 'RRULE:FREQ=DAILY;COUNT=5', 'SUMMARY:站会', 'END:VEVENT',
    'BEGIN:VEVENT', 'UID:f@t', 'DTSTAMP:20260101T000000Z', 'RECURRENCE-ID;RANGE=THISANDFUTURE;TZID=Asia/Shanghai:20261203T090000', 'DTSTART;TZID=Asia/Shanghai:20261203T100000', 'DURATION:PT1H', 'SUMMARY:站会改到十点', 'END:VEVENT',
    'BEGIN:VEVENT', 'UID:s@t', 'DTSTAMP;TZID=Asia/Shanghai:20260101T090000', 'DTSTART;TZID=Asia/Shanghai:20261210T090000', 'SUMMARY:戳带时区', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n') + '\r\n'
  await page.fill('#ic-i-text', fxB); await page.click('#ic-i-go')
  await page.selectOption('#ic-i-tz', 'Asia/Shanghai'); await page.fill('#ic-i-from', '2026-11-30'); await page.fill('#ic-i-to', '2026-12-06')
  await page.$eval('#ic-i-to', (el) => el.dispatchEvent(new Event('change', { bubbles: true })))
  await page.waitForFunction(() => document.querySelector('#ic-i-events').dataset.key.includes('Asia/Shanghai'))
  const pb = await page.$$eval('#ic-i-events tr', (trs) => trs.map((tr) => tr.children[0].textContent + ' ' + tr.children[2].textContent))
  assert(pb.join('|') === '2026-12-01 09:00 站会|2026-12-02 09:00 站会|2026-12-03 10:00 站会改到十点|2026-12-04 10:00 站会改到十点|2026-12-05 10:00 站会改到十点', `THISANDFUTURE：${pb.join('|')}`)
  // P2 DTSTAMP 带 TZID：修复时先换算成 UTC
  await page.waitForFunction(() => !document.querySelector('#ic-i-fix').disabled)
  const fixB = await download('#ic-i-fix')
  const FB = icsCheck(fixB.text, 'DTSTAMP 修复')
  assert(FB.includes(`DTSTAMP:${ORACLE.dtstampTz}`), `DTSTAMP;TZID=Asia/Shanghai:20260101T090000 应换算成 ${ORACLE.dtstampTz}：${FB.filter((l) => l.startsWith('DTSTAMP')).join(' ')}`)
  // P2 农历：一条 SKIP 写不成时不给「等价规则」；数据末端不崩
  await onTab('lunar')
  await page.selectOption('#ic-l-bm', '6'); await page.selectOption('#ic-l-bd', '30'); await page.setChecked('#ic-l-leap', true)
  await page.selectOption('#ic-l-skipm', 'BACKWARD'); await page.selectOption('#ic-l-skipd', 'OMIT')
  assert(await page.$eval('#ic-l-use', (b) => b.disabled) && (await page.textContent('#ic-l-rule')).includes('表达不了'), '闰月与小月策略不同时不给等价规则')
  await page.selectOption('#ic-l-skipd', 'BACKWARD')
  assert(!(await page.$eval('#ic-l-use', (b) => b.disabled)), '两个策略相同就能写成一条规则')
  await page.selectOption('#ic-l-bm', '12'); await page.selectOption('#ic-l-bd', '1'); await page.selectOption('#ic-l-skipm', 'FORWARD'); await page.fill('#ic-l-y0', '2099'); await page.fill('#ic-l-years', '1')
  await page.waitForFunction(() => document.querySelector('#ic-l-table').textContent.includes('2099'))
  assert(errors.length === 0, `农历数据末端不应报错：${errors.join(' | ')}`)
  await page.fill('#ic-l-y0', '2026'); await page.fill('#ic-l-years', '10'); await page.setChecked('#ic-l-leap', false)
  // P2 全部导出：同一时区的 VTIMEZONE 要覆盖所有事件的年份
  await setRule({ date: '2030-06-03', time: '09:00', tz: 'America/New_York', rrule: 'FREQ=WEEKLY;COUNT=3;BYDAY=MO', listN: '10' })
  await page.click('#ic-save'); await page.waitForFunction(() => document.querySelector('#ic-toast').textContent.includes('已存入'))
  await setRule({ date: '2026-06-01', time: '09:00', tz: 'America/New_York', rrule: 'FREQ=WEEKLY;COUNT=3;BYDAY=MO', listN: '10' })
  const nBefore = await page.evaluate(() => window.ICA.readItems().length)
  await page.click('#ic-save'); await page.waitForFunction((n) => window.ICA.readItems().length === n + 1, nBefore)
  await onTab('mine')
  {
    const AL2 = icsCheck((await download('#ic-m-export')).text, '多时区合并')
    const vt = AL2.join('\n').split('BEGIN:VTIMEZONE').slice(1).find((v) => v.includes('TZID:America/New_York'))
    const firstYear = Math.min(...[...vt.matchAll(/DTSTART:(\d{4})/g)].map((m) => +m[1]))
    assert(firstYear <= 2026, `纽约的 VTIMEZONE 应从 2026 年或更早开始，实得 ${firstYear}`)
  }
  // P1 两个标签页同时保存：两条都在
  {
    const n0 = await page.evaluate(() => window.ICA.readItems().length)
    const pC = await page.context().newPage()
    await pC.clock.setFixedTime(new Date('2026-11-25T02:00:00Z'))
    await pC.goto(toolURL); await pC.waitForFunction(() => window.ICA)
    await onTab('rule')
    await Promise.all([page.click('#ic-save'), pC.click('#ic-save')])
    await page.waitForFunction((n) => window.ICA.readItems().length === n + 2, n0, { timeout: 10000 })
    await pC.close()
  }

  // ═══ 14. 渲染守卫 ═══
  const TABS = ['rule', 'work', 'lunar', 'inspect', 'mine', 'about']
  await onTab('inspect'); await page.click('[data-sample="broken"]')
  const n = await renderGuards(page, {
    assert, tabs: TABS, onTab, paneSel: (t) => `#ic-pane-${t}`, panesRoot: '#ic-panes',
    figSel: (t) => `#ic-pane-${t} svg`, cardSel: '.ic-card', minControls: 60,
    labelSel: 'th, dt, label, label > span, .ic-field > span, .ic-stat span, .ic-calwd, .ic-mwd',
  })
  assert(n >= 60, `控件数 ${n}`)
  await guardBoxOverlap(page, { assert, sel: '.ic-pill, .ic-chip, #ic-cal .ic-day[data-dn], .ic-legend > span, .ic-wd, #ic-pane-rule .ic-btn, .ic-slot' })
  for (const vw of [390, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 })
    for (const host of ['#ic-ask']) await guardControlSize(page, { assert, tabs: [host], onTab: async () => {}, paneSel: (h) => h, minControls: 2 })
    const hh = await page.$eval('#ic-nl', (el) => el.getBoundingClientRect().height)
    assert(hh >= 44, `视口 ${vw}：一句话输入框应保持 48px 高（Cal.com 输入框），实得 ${hh}`)
  }
  await page.setViewportSize({ width: 1280, height: 850 })
  // 年历小格：数字不出格
  await onTab('work')
  await page.setViewportSize({ width: 390, height: 900 })
  const ydBad = await page.$$eval('#ic-w-cal .ic-yd', (ns) => ns.filter((n) => n.getBoundingClientRect().width > 0 && n.scrollWidth > n.clientWidth + 1).length)
  assert(ydBad === 0, `390px 下年历格子里有 ${ydBad} 个数字出格`)
  await page.setViewportSize({ width: 1280, height: 850 })
  // 该藏的真的藏了（计算样式）
  await onTab('rule')
  assert(await page.$eval('#ic-count', (el) => !el.hidden || getComputedStyle(el).display === 'none'), '#ic-count 带 hidden 时计算样式应为 none')
  await page.waitForFunction(() => document.querySelector('#ic-toast').hidden, null, { timeout: 6000 })
  assert(await page.$eval('#ic-toast', (el) => getComputedStyle(el).display) === 'none', '提示条隐藏时计算样式应为 none')

  if (process.env.IC_RIE_PY) assert(ext.rie >= 3, `recurring-ical-events 复核了 ${ext.rie} 份`)
  console.log(`    recurring-ical-events 复核 ${ext.rie} 份；中文往返 ${rt.total} 组；体检规则 ${RULES.length} 条全部触发`)
  assert(errors.length === 0, `页面报错：${errors.join(' | ')}`)

  // ═══ 缩略图：每个工作日晨会，10 月（国庆调休）——
  await setRule({ date: '2026-09-20', time: '09:00', tz: 'Asia/Shanghai', rrule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR', pol: 'skip', makeup: true, listN: '20' })
  await page.fill('#ic-nl', '每个工作日 9:00 晨会')
  await page.click('#ic-cal-next')
  await page.waitForFunction(() => document.querySelector('#ic-cal').dataset.month === '2026-10')
  const d1008 = await page.evaluate(() => IC.dnFromYmd(2026, 10, 10))
  await page.click(`#ic-cal .ic-day[data-dn="${d1008}"]`)
  await page.evaluate(() => window.scrollTo(0, 0))
  await screenshot('thumb.png')
}
