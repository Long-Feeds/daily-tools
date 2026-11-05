// 电子书工坊 · 集成测试（真实 Chromium）
// 真值：ORACLE 由 run 目录 truth/gen_truth.py 生成后用 inject-oracle.mjs 机械注入（不手抄）——
//   样本章节标题 / 字数 / 删除行数 = Python 按样本已知结构直接计数（不调用、不移植引擎）；
//   编码夹具 = Python codecs 编码；EPUB 结构 = 本文件里用 Node zlib 写的独立拆包器核对；
//   设了 ES_EPUBCHECK=<epubcheck.jar>（以及可选 ES_JAVA）时，下载下来的每本书再交给 W3C EPUBCheck 复核。
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import zlib from 'node:zlib'
import { spawnSync } from 'node:child_process'
import { renderGuards, guardBoxOverlap } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const ORACLE = {
 "xyj": {
  "pg": 29,
  "removed": {
   "url": 1,
   "meta": 1
  },
  "chapters": [
   {
    "title": "第一回 靈根育孕源流出　心性修持大道生",
    "chars": 7074
   },
   {
    "title": "第二回 悟徹菩提真妙理　斷魔歸本合元神",
    "chars": 7028
   }
  ],
  "front": 0,
  "total": 14102,
  "lang": "zh-TW",
  "enc": "utf-8",
  "title": "西遊記",
  "author": "吳承恩"
 },
 "alice": {
  "pg": 29,
  "toc": 12,
  "chapters": [
   {
    "title": "CHAPTER I. Down the Rabbit-Hole",
    "chars": 9129
   },
   {
    "title": "CHAPTER II. The Pool of Tears",
    "chars": 8821
   }
  ],
  "front": 95,
  "total": 18045,
  "lang": "en",
  "enc": "utf-8",
  "title": "Alice's Adventures in Wonderland",
  "author": "Lewis Carroll",
  "underscores": 60
 },
 "novel": {
  "removed": {
   "chapter-end": 1,
   "url": 1,
   "ask": 1,
   "sep": 1
  },
  "meta": 3,
  "chapters": [
   {
    "title": "第一卷　雾港",
    "level": 1,
    "chars": 0
   },
   {
    "title": "第1章 最后一班船",
    "level": 2,
    "chars": 93
   },
   {
    "title": "第2章 交接",
    "level": 2,
    "chars": 90
   },
   {
    "title": "第4章 三点",
    "level": 2,
    "chars": 92
   },
   {
    "title": "第二卷　潮汐表",
    "level": 1,
    "chars": 0
   },
   {
    "title": "第一章 记录本",
    "level": 2,
    "chars": 83
   },
   {
    "title": "第二章 灯油",
    "level": 2,
    "chars": 66
   },
   {
    "title": "番外　老周的渡船",
    "level": 2,
    "chars": 41
   }
  ],
  "front": 0,
  "total": 465,
  "lang": "zh-CN",
  "enc": "gb18030",
  "title": "灯塔守夜人",
  "author": "林间",
  "desc": "海岛上最后一座有人值守的灯塔，和一个总在凌晨三点来敲门的访客。",
  "gap": [
   2,
   4
  ],
  "dixiashi": 52,
  "ch4head": 5
 },
 "fixtures": {
  "big5": {
   "name": "xiyouji-big5.txt",
   "b64": "ssSkQKZeICAgICDGRq7aqHylpbe9rHmlWKFApN+pyq3Xq/mkarlEpc0KCgqhQKFAuNak6qFHCqFAoUChQKFAslaoUKW8pMCk0aZhtsOhQa/tr+20+bT5tUykSKijoUMKoUChQKFAoUCm27FxvUylaq99wkXA26FBtn3FULFxr/eyTb9Cv+uhQwqhQKFAoUChQMLQuPy4c6XNpfWm3KSvoUG1b6n6uFWqq6zSpqi1vaFDCqFAoUChQKFAsf2qvrN5pMa3fKS4pVyhQba3rN2m6LlDxMCkzLbHoUMKCgq7XLtEpNGmYaSnvMahQaazpFGkR7hVpEWkZKS7psq3s6ywpECkuKFDsU6kQKS4pMCssKRRpEe3fKFBpESkbKFCpKGhQrFHCqFCpWahQqiwoUKkeKFCpMihQqW8oUKl06FCqLuhQqamoUKl6KSnpFGkR6TkpF2hQ6hDt3y406RAuFWkS6bKt7OhQ6VCtE4KpECk6abTvdehR6Rsrsmxb7anrvChQabTpKGraML7u++hUbFHpKOzcaX6oUGm06Vmq2ik6aVYoVGosK7Jrbmr4aFBptOkeAqraK7BscahUaTppMik0aSkoUGm06W8q2im6MHOoVGl067J1aqhQabTpOm4qKi7oUGmprbAqfyhQabTpEipd6XooUPEtKnzCqRqvMahQa1ZqOymprd8pKey16FBq2ik0aZhqfzv2qbTuFWqq6dfqG+hQ6ZBpWikraRkpXymyrezoUGl5qXot3ykp6rsoUEKq2i37bbCt3ShQabTqOK2oaRIqqut0bVMqG+hQaxHpOqyVqhQoUOkU6StpGSlfKbKt7OhQaXot3yxTrLXoUGtc6RVsF+kuAqhQarxpGykp7d8oUGm07Rfs3a6pbZ9qfqhQ6rysWS4YKTqoUehR6F1pVam3KRspKelYqFBpNGk37VMp++yvqFDpEC2p6rsCrDKs0KhQbhVqqulvKXNrsmhQ6F2qOymuaFBpNGpbKazrtqhQ6ZBpK2kZKV8psq3s6FBpb+37aRst3yhQbu0sk2kV8TLoUEKprOk6aFBprOk66FBprOsUKFBprOosKFDpOmhQqTroUKsUKFCqLChQb/XpKelfLZIoUOsR6TqoUGk0bZ9qfOkbKFDpFO4ZwqkraRkpXymyrezoUGkbLd8sU6y16FBqvGkoaSnt3yhQabTs3a6pbDtueqhQ6FtqfahbqTqoUehdaRqq3awrqS4oUmm3Kt2CqlbpLihSbhVqqu46qXNoUGkRLa2qdOk0aFDoXam3Ka5oUGmYalsvq61sqFDpkGkraRkpXymyrezoUGlv7ftpKG3fKFBrasKv0KkVb6uoUGms6T0oUGms6T1oUGms6RzoUGms6XboUGms6RnoUOk9KFCpPWhQqRzoUKl26FCpGehQb/XpKekrafOoUOsRwqk6qFBpmHFUKnzpKGhQ6RTuGekraRkpXymyrezoUGkobd8stem07FHt3ykp6rsoUG1b6XNuFWqq6FDvuSk6qFHoXWk0a7wCqRVrbChQaZhrvCkV6TJoVGk0aZhpeamWKFBuHOqq6zSpc2hQ6F2ptymuaFBpNGyTaZhsm6hQbOxtqel5qZYoUOmQaStpGQKpXymyrezoUGkbLd8sU6y16FBqvGkoaSnt3yhQabTs3a6pbDtueqhQ6FtqfahbqTqoUehdaRqq3awrqS4oUmm3Kt2qVukuAqhSbhVqqu46qXNoUGkRLa2qdOk0aFDoXam3Ka5oUGmYalsvq61sqFDpkGkraRkpXymyrezoUGlv7ftpKG3fKFBrau/QqRVCr6uoUGms6T0oUGms6T1oUGms6RzoUGms6XboUGms6RnoUOk9KFCpPWhQqRzoUKl26FCpGehQb/XpKekrafOoUOsR6TqoUEKpmHFUKnzpKGhQ6RTuGekraRkpXymyrezoUGkobd8stem07FHt3ykp6rsoUG1b6XNuFWqq6FDvuSk6qFHoXWk0a7wpFWtsAqhQaZhrvCkV6TJoVGk0aZhpeamWKFBuHOqq6zSpc2hQ6F2ptymuaFBpNGyTaZhsm6hQbOxtqel5qZYoUOmQaStpGSlfKbKCrezoUGlv7ftsUe3fKFBpc2kSKFBpc3DfqFBpc24VqFBpb+/16TRpmGkSKFBpFSkfql3puyhQ6xHpOqhQaRIpc2p87FHoUMKCrdQvUylarZ9xVChQaRUrNOqdqVAoUGkravSqXet26FBpUCsyaSntqGhQblFpMCssKV8pGqzoax3oUek6qpGs9Ovq6x3oUEKpOqm6KT7tlCsd6FBpOqrbsS6s6Gsd6FBpOqlX63RxKqsd6FDs2+zoa7Rs+aq7apGs9Ovq6x3oUOu/KV+prOkQLDqpGehQQqmV6Tqtsao07DqoUOw6qrxpGqu/KFBrvykpKazpECueaZXpHOhQbPqrLCq4apHpHOhQ6a5pHOkRKRRrHekp6+qr9+hQaRUCq5xpKeo08BzoUGm27Z9sk2/QqbTpd+hQcJFwNunUKvhptOmqKFDr3Wt06ZupHOhSaaztfy94ayww9KhQ73hpOqhR7bVwu0KqEysdqFBq8K557q9rvyhQ7bVwu2oTKx2oUG86bTpu8ikc7O9pEql3qFRq8K557q9rvyhQappwr2zt672uMLC97JXoUOk9Aqk9aTotqiwqr9upFehQapGrvykp7NCwXGxUsVxoUOkprFWqcel26FBq2S+wKlfrnChQ6SmsVakV6FBsW278cL5u++hUatkCr7Aq2WhQcRRxe+/V6rXoUOucMBZrsnFpcBBwvu776FBpdu4XahDxlvAc6VYpEqhQ6pMpKSms7nYs8ClUKqwoUG+8KRXprMKxka4VqXIxWKhQ7q9r/OpX6rhpKPBwqFBq0OqUbtBrGaq+KxLoUOlUK7nsWC1sqpHoUGt16bLqEOvZLazoUOkQLH4vO7ApArE8MXasUuhQaV8rbGt7LP2r/Om4rdzoUOlv6xPpsqkdLd8s0LAuqTRrFehQbhVp1S1TLK+pGqmYa7aoUMKCqi6rnmkc6W/t+2zu6RXoUGms6RAtvSlUKXboUOo5KXbprOkVKRWpLuk2KStpG+wqqFBprOkR6RWpXyk2LPytuqhQ6RUpFYKpLuk2KStpG+wqqFBq/apUKTRpFSmyqS7pFGkravXoVGkR6RWpXyk2LPytuqhQav2rEa+5KRHpFGlfK7woUOkV6azpEXCrAqkS6TVoUGr9qRFrmOkS6j2oUOlfK2xp/O1TL7wpOy+QrOxoUGlqqVrrcums6rbxPWs28WooUMKCrtcptu2fcVQpUio06FBqEOo/KTRr3WmYahxoUGk6brrpOu12KFBt1Ckp6xKpFuhQblFprPGRrNxpKe3TqFDpLqofKVQrU0KoUGkQKTpsG619aFBsqOkQKXbp1qhQab8tuqyQbzLpGqhQ6ZdqKOtt6FBpManQKRArdOl27VVoUGkral4rdGzxqFBpXyqzwqs0qX+oUOrS7ROvseqpr7HqKuhQav0pEalfKTooUOl2LlCqOK5RKr3pfqhQa5nqFKk5qmyoUPF5bDKsKqk0aRXuHSkardPCqSvqsylyazTpGqk0bRMpciqxrCqpFer0qFBvnKuear3wva2s65jxka+XcRft7WhQbtFtrClUK3roUGoo6azqvel+r9Wv1YKoUGnWalSpGSovbK0oUK2tq23ptW2fatupNGq+cZbrN2hQ6RHsU6qR6lepq6lWKr5pX6hQazdqrqvdaFBxaWquqn6oUO2twqq2KZes/i5RKFHoXWm2qlepq7GW8Wlqvel+qSns0KhQaREqkaz06+rrHeu/KpGtsao06RwsOqkp6zJoUGms6RArnmq4apHCqRzoUGkc6RXprOkQKVQpduhQaXbsqOkQKdaoUGoo623pMakQKXbtVWhQaZiqLo=",
   "head": "第一回     靈根育孕源流出　心性修持大道生　　詩曰：　　　　混沌未分天地亂，",
   "enc": "big5"
  },
  "gbk_trad": {
   "name": "xiyouji-gbk.txt",
   "b64": "tdrSu7vYICAgICDsYLj50/3U0NS0wfez9qGh0MTQ1NDes9a087XAyfoKCgqhoaGh1IrUu6O6CqGhoaGhoaGhu+zj5860t9bM7LXYgXmjrMOjw6PD7MPsn2/Iy9KKoaMKoaGhoaGhoaHX1I/EsVC5xcbG+Jmd96Os6V/qVo/Exp3H5Z3hseahowqhoaGhoaGhobiy3WTIusn60fbWwcjKo6ywbMP3yGbO773Us8nJxqGjCqGhoaGhoaGh0/vWqtTsu6+V/tSquaajrO2av7TO999b4Yy28oL3oaMKCgrJd8KEzOy12NaulLWjrNPQyq62/shmvsXHp8H5sNmacZ7p0rvUqqGjjKLSu9Sqt9ae6cqutv6V/qOsxMvX06Gis/OhotL6CqGiw66horO9oaLLyKGizuehos60oaLJ6qGi08+hotDnoaK6pdauyq62/tan0rKho8O/lf7Uk9K7yGawy7DZmnGho8fSvs0K0rvI1bb41ZOjutfTlXK1w+qWmuKjrLb4s/OEdOt1+FGpctL6srvNqLnio6y2+MOuhHTI1bP2qXKzvZVyyrPh4aOstvjLyAqEdLCkxcWpcsjVzufM7NbQo6y2+M60hHTO9/XjqXLJ6pVy6s6jrLb4yNXC5NPPo6zQ5/xTu+ijrLb4yMu2qLqloaPGqey2CrTzlLWjrMj0tb3Q55X+1q69S6OshHTM7LXYu+iV5Lb4yGbO77fx0tOho9TZyKXO5ceny8Sw2Zpxo6y9u7qllf7WrrP1o6wKhHSulLrasLWjrLb4g8npZ8jLzu++459v0tOjrLnK1Lu77OPnoaPT1s7lx6fLxLDZmnGjrLqllf6Mor1Lo6zYkc/CxvDUqgqjrL3819PWrpX+o6y2+I/N1vCddelfw/eho8nbv7W5ndS7o7qjuqG4tqzWwdfT1q6w66OszOzQxJ9vuMTSxqGj0rvqlrP1CoTTzI6jrMhmzu/OtMn6lXKho6G5tb20y6OszOzKvNPQuPmho9TZzuXHp8vEsNmacaOs1f2ulNfTlf6jrN1wx+XJz/J2o6wK09DI1aOs09DUwqOs09DQx6Os09CzvaGjyNWhotTCoaLQx6Gis72jrNZe1q7LxM/zoaO5ytS7o6zM7Olf7LbX06Gj09a9mwrO5ceny8Sw2Zpxo6zX05X+jKK9S6Osvfyz89aulf6jrLb41vCddYjUjI2ho6G20teht9S7o7qhuLTz1NXHrNSqo6HWwdTVCsCk1Kqjochmzu/ZWcn6o6zEy+2Ys9DM7KGjobnWwbTLo6y12Mq8xP29WaGj1NnO5ceny8Sw2Zpxo6zV/a6Us/OV/qOs1tgKneHPwsT9o6zT0Muuo6zT0Lvwo6zT0Mm9o6zT0Mqvo6zT0M3BoaPLrqGiu/Chosm9oaLKr6GizcGjrNZe1q7O5dDOoaO5ygrUu6OstdjqVuy2s/Oho9PWvZvO5ceny8Sw2Zpxo6yz85X+vUu2+NL6lf7WrrP1o6ywbMn6yGbO76GjldHUu6O6objM7JriCs/CvbWjrLXYmuLJz8n9qXLM7LXYvbu6z6OsyLrO773Uyfqho6G51sG0y6OszOzH5bXYy6yjrOqO6pa9u7rPoaPU2c7lx6cKy8Sw2Zpxo6zX05X+jKK9S6Osvfyz89aulf6jrLb41vCddYjUjI2ho6G20teht9S7o7qhuLTz1NXHrNSqo6HWwdTVwKTUqgqjochmzu/ZWcn6o6zEy+2Ys9DM7KGjobnWwbTLo6y12Mq8xP29WaGj1NnO5ceny8Sw2Zpxo6zV/a6Us/OV/qOs1tid4c/CCsT9o6zT0Muuo6zT0Lvwo6zT0Mm9o6zT0Mqvo6zT0M3BoaPLrqGiu/Chosm9oaLKr6GizcGjrNZe1q7O5dDOoaO5ytS7o6wKtdjqVuy2s/Oho9PWvZvO5ceny8Sw2Zpxo6yz85X+vUu2+NL6lf7WrrP1o6ywbMn6yGbO76GjldHUu6O6objM7Jriz8K9tQqjrLXYmuLJz8n9qXLM7LXYvbu6z6OsyLrO773Uyfqho6G51sG0y6OszOzH5bXYy6yjrOqO6pa9u7rPoaPU2c7lx6fLxLDZCppxo6zV/a6U0vqV/qOsyfrIy6OsyfqrRqOsyfrH3aOs1f3WXszstdjIy6OsyP2yxbaozruho7nK1LujrMjLyfrsttL6oaMKCrjQsVC5xelf6lajrMj9u8rWzsrAo6zO5bXbtqiCkKOsysC959au6WejrMvst9ae6cvEtPOyv9beo7rUu5Z8hNnJ8dbeo6wK1LvO98Wj2VLW3qOs1LvEz9mgsr/W3qOs1Luxsb7jzErW3qGj30Cyv5X4hs6x7ZZ8hNnJ8dbeoaO6o83i09DSu4f4zcGjrArD+9S7sMGB7Yf4oaOH+L38tPO6o6OsuqPW0NPQ0rvX+cP7yb2jrIa+num7qLn7yb2ho7TLyb3Ey8qu1t7Wrtfmw32jrMj9Co111q6B7f2Io6zX1Olfx+Wd4bb4waKjrPiZnffF0OHhtvizyaGj1eaCgLrDyb2jodPQ1H7ZeJ7p10Oho9l41LujuoTd5oIKzfTR86Oszf6MjqyOuqOho4Td5oLN9NHzo6yzsZyl43nJvfR+yOvRqKlyzf6MjqyOuqOjrLKot63RqcDL8tfreJxZoaPLrgq78Le90+e437dlyc+jrJZ8uqPWrsyOwpaz545woaO1pNHCudbKr6Osz/ex2sbmt+Who7Wk0cLJz6Osssr4UOtw+FGpcs/3CrHax7CjrPfo9+uqmsVQoaO35e5elXLCoOVc63X4UaOsyq+/38O/0179iLP2yOuho8HW1tDT0InbwrnPybr8o6yY5MnP09AK7GDH3dD++lGho6yOst3G5ruosrvWeKOsx+DLybTksNjpTLS6oaPPyczSs6O9Wbn7o6zQ3tbxw7/B9OuFoaPSu5dsnb7b1gq7TMx9w9yjrMvEw+bUrbXMst3Jq9DCoaPV/crHsNm0qJX+zI7H5szs1vmjrMhmvdmfb9LGtPO12Lj5oaMKCsTH1/nJvdX9rpTtlMnPo6zT0NK7iUvPycqvoaPG5Mqv09DI/dXJwfmz387ltOe436Os09C2/tXJy8Sz34f6iEGho8j91ckKwfmz387ltOe436OssLTW3MzsyP2w2cH5yq7O5bbIqXK2/tXJy8Sz34f6iEGjrLC01f6V0bb+yq7LxJrioaPJz9PQvsW4Wwqwy7/Xo6ywtL7FjG2wy9jUoaPLxMPmuPyfb5jkxL7V2uqOo6zX89PStbnT0NalzG3P4NJyoaMKCsl319TpX+pW0tSB7aOsw7/K3Mzs1ea12NDjo6zI1b6r1MLIQaOsuNDWrrzIvsOjrMvs09DsYM2o1q7S4qGjg8jT/c/JsPsKo6zSu8jVscXB0aOsrmHSu8qvwtGjrMvGiEGawpjTtPOho9Ly0orvTKOsu6/X99K7goDKr7rvo6zO5bnZvuOC5KOsy8TWqwq91MiroaOx477NjFfFwIxX19+jrLDdwcvLxLe9oaPEv99cg8m1wL3wueKjrMnkm1+2t7iuoaPzQITTuN/M7MnPwn2087TICsjK1d/T8bvKtPPM7Nfw0P7xt7jfyc+126Os8XvX+b3w6knrhYxt7GDP9oyate6jrL7bvK/Pycfko6zSitPQvfC54p/wn/AKo6y8tMP8x6fA79HboaLtmO9MtvrpX8TPzOzpVNNev7Sho7b+jKK5+7fu1ryz9ulUzeKjrL+0tcTV5qOswqC1xMP3oaPtmgr0p7vYiPO1wKO6obizvLfu1rzTXsKgvfC54tauzI6jrMTLlnyE2cnx1t66o5Z8sMGB7dChh/jWrr3no6zT0NK71/m7qLn7Csm9o6zJvcnP09DSu8/Jyq+jrMqvrmHSu8LRo6zSiu9Mu6/Su8qvuu+jrNTaxMc=",
   "head": "第一回     靈根育孕源流出　心性修持大道生　　詩曰：　　　　混沌未分天地亂，",
   "enc": "gb18030"
  },
  "utf16": {
   "name": "novel-utf16.txt",
   "b64": "//5vcFRYiFscWbpODQAKAA0ACgBcTwWAGv+XZ/SVDQAKAIB7y04a/3dtm1wKTgBnDlQATqdeCWe6TjxQiFuEdm9wVFgM/4xUAE4qTjtgKFfMUWhmCU65cGVncmXolYR2v4uiWwIwDQAKAA0ACgAsewBOd1MAMP6WL24NAAoADQAKACx7MQDgeiAAAGcOVABO7XM5gg0ACgAAMAAwQVMATghnhHb+li9uDP8pWdGel1/Ua5+UaIjYj8ZRAjANAAoAADAAMIhs2J7OYkB3Bl4DXgVT840KTgF4NFkM/6uODlSjkO1zIW45giOehk4ATvBYG3sM/4ljNFm7lNuP/pbMkQIwOYIBgCdZ9IsM/9mPL2bKTnReAGcOVABO7XMM/41RgF8OVAz/d20xXAFchk4CMA0ACgAAMAAwb3BUWChXm1yEdgBnF1Pvegz/AE5+doxOQVOnfvBTNpYM/9ZOcGWGTiROTZACMA0ACgAI/yxn4HqMWwn/DQAKAA0ACgAsezIA4HogAKROpWMNAAoAADAAME1S+06IW1RYuk7TWWhUDP8DTkFTGlmBXAz/pE6lY+pTKHWGTkFTBlKflAIwDQAKAAAwADAcIG9wuWwoVzBXC06kWwz/sItVXyxnKFdMaApODP/Pa1pmQVO5cAEwJE65cAEwlE65cARUCk67Uwt3AE4hawIwHSABgGhUf5iGTn+YDP8cIMxRaGYJTrlwCWe6TnJl6JUM/ytSAF8CMB0gDQAKAAAwADCIbNie5U46TtZOKFcAX6lzEXsCMAGAaFShbBF7AjANAAoAS2I6Zyh1N2L3i7+L7pUgAG0ALgBlAHgAYQBtAHAAbABlAC4AYwBvAG0AIAAFlvuLAGewZeB6goINAAoADQAKACx7NADgeiAACU65cA0ACgAAMAAwLHsATipOHFlaZohfiVtZlwz/6lMJZ86YjFRqbQIwDQAKAAAwADAse4xOKk4cWVpmDP8JTrlwdGUM/+iVzVSGTglOC04M/w1Oe48NTs2RDP/PUC9mu5BFXGVnH1AATopiHk8CMA0ACgAAMAAwiGzYnuFjQHdLYjV1DP/ZeihX6JUOVAz/LFTBieiVFlmjkLpOe4/wWPSLGv8cIG9wDP/rX21whk4CMB0gDQAKAAAwADDWTqxiNFkM/1RYdpiEdklRDP+cZzZxl2aGTgBOPGgCMA0ACgBCbAhnaHkB/0JsqGNQg2h5Af8NAAoADQAKACx7jE53UwAwbm9QbGiIDQAKAA0ACgAsewBO4HogALCLVV8sZw0ACgAAMAAwAYBoVIR2sItVXyxnmVHhboZOCU5BU3ReAjDPawBOdZiEdgBnDlQATkyIDP/9kC9mDFQATipO9mX0lRr/CU65cAIwDQAKAAAwADAJZ/ZlGVAOVGKXmVFAdxwgcmXolR0gDP8JZ/ZlGVCZUUB3HCAqZwBfHSAM/+pTCWcATnWYmVFAdxr/HCAAX4ZOAjAdIA0ACgAAMAAwo5AATnWYhHblZR9nDP8vZglOQVN0Xk1ShHbKTilZAjANAAoADQAKACx7jE7geiAAb3C5bA0ACgAAMAAwMFcLTqRbhHZvcLls1GsmjQpOEVyGTgBOdmgCMIhs2J6KYpNeWFtoiDhohk4JTk2QDP/IU4pienp2aABOKk4qTnJlx4+7Uwz/AGcOVChXmVjSiX5iMFIATkyIKHWJfBR7mVGEdldbGv8NAAoAADAAMBwgK1KXe4ZODP+DW89rdF79kIGJAE52aAIwHSANAAoACv8K/wr/DQAKAA0ACgBqdRZZADABgGhUhHYhbjmCDQAKAAAwADCIXxpZdF7lTg5UDP8JZ7pOKFdXU7llhHYPXEeVCk7BicePAYBoVAIw1k4AX4ZOAE62W+5Pn5RoiIR2+pRQWwz/zFFoZglOuXDOTg1Oc1FvcAIwDQAKAA==",
   "head": "灯塔守夜人作者：林间简介：海岛上最后一座有人值守的灯塔，和一个总在凌晨三点来敲门",
   "enc": "utf-16le"
  },
  "sjis": {
   "name": "tosho-sjis.txt",
   "b64": "kH2PkYrZgsyRi4KpgueBQZN+gsyM9YKqguSCwYKtguiCxo23grWNnoLxgsWCooK9gUKC7YK9grWCzYzDgqKWe4LwiOqN+4K4gsKO6ILJjuaC6IFBg3mBW4NXgsySW4LJjmOC6YmUlU2CzI+RgquNnoLdgvCTx4Lxgr6BQoK+guqCqoFBgqKCwoFBgseC8YLIi0OOnYK/gsWCsYLMjXOCyZD8gvCI+IKigr2CzIK+guuCpIFCCoKxgsyVto/Ngs2BQZNkjnGPkZDQgsyVz4q3gvCCvYLfgreCvYLfgsmPkYKigr2C4ILMgsWCt4FClbaOmoNSgVuDaILNg1aDdINnSklTgsWV25G2grOC6oLEgqKC3IK3gUIKkH2PkYrZgsyRi4KpgueBQZN+gsyM9YKqguSCwYKtguiCxo23grWNnoLxgsWCooK9gUKC7YK9grWCzYzDgqKWe4LwiOqN+4K4gsKO6ILJjuaC6IFBg3mBW4NXgsySW4LJjmOC6YmUlU2CzI+RgquNnoLdgvCTx4Lxgr6BQoK+guqCqoFBgqKCwoFBgseC8YLIi0OOnYK/gsWCsYLMjXOCyZD8gvCI+IKigr2CzIK+guuCpIFCCoKxgsyVto/Ngs2BQZNkjnGPkZDQgsyVz4q3gvCCvYLfgreCvYLfgsmPkYKigr2C4ILMgsWCt4FClbaOmoNSgVuDaILNg1aDdINnSklTgsWV25G2grOC6oLEgqKC3IK3gUIKkH2PkYrZgsyRi4KpgueBQZN+gsyM9YKqguSCwYKtguiCxo23grWNnoLxgsWCooK9gUKC7YK9grWCzYzDgqKWe4LwiOqN+4K4gsKO6ILJjuaC6IFBg3mBW4NXgsySW4LJjmOC6YmUlU2CzI+RgquNnoLdgvCTx4Lxgr6BQoK+guqCqoFBgqKCwoFBgseC8YLIi0OOnYK/gsWCsYLMjXOCyZD8gvCI+IKigr2CzIK+guuCpIFCCoKxgsyVto/Ngs2BQZNkjnGPkZDQgsyVz4q3gvCCvYLfgreCvYLfgsmPkYKigr2C4ILMgsWCt4FClbaOmoNSgVuDaILNg1aDdINnSklTgsWV25G2grOC6oLEgqKC3IK3gUIK",
   "head": "図書館の窓から、冬の光がゆっくりと差し込んでいた。わたしは古い本を一冊ずつ手に取",
   "enc": "shift_jis"
  }
 },
 "eckMapped": 27,
 "meta": {
  "tabs": [
   "make",
   "read",
   "check",
   "shelf",
   "about"
  ],
  "src": "truth/gen_truth.py：Python 按样本已知结构直接计数（不调用引擎）；编码夹具由 Python codecs 生成"
 }
};

/* ───── 独立的 ZIP / EPUB 拆包（不经过页面引擎） ───── */
function readZip(buf) {
  let eo = -1
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) if (buf.readUInt32LE(i) === 0x06054b50) { eo = i; break }
  if (eo < 0) throw new Error('no EOCD')
  const n = buf.readUInt16LE(eo + 10), cd = buf.readUInt32LE(eo + 16)
  const entries = []
  let p = cd
  for (let k = 0; k < n; k++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('bad CD')
    const flags = buf.readUInt16LE(p + 8), method = buf.readUInt16LE(p + 10), crc = buf.readUInt32LE(p + 16)
    const csize = buf.readUInt32LE(p + 20), usize = buf.readUInt32LE(p + 24)
    const nl = buf.readUInt16LE(p + 28), el = buf.readUInt16LE(p + 30), cl = buf.readUInt16LE(p + 32), off = buf.readUInt32LE(p + 42)
    const name = buf.subarray(p + 46, p + 46 + nl).toString('utf8')
    if (buf.readUInt32LE(off) !== 0x04034b50) throw new Error('bad local header ' + name)
    const lnl = buf.readUInt16LE(off + 26), lel = buf.readUInt16LE(off + 28)
    const raw = buf.subarray(off + 30 + lnl + lel, off + 30 + lnl + lel + csize)
    const data = method === 0 ? Buffer.from(raw) : zlib.inflateRawSync(raw)
    entries.push({ name, flags, method, crc, usize, off, localExtra: lel, data, crcOk: zlib.crc32(data) === crc && data.length === usize })
    p += 46 + nl + el + cl
  }
  entries.sort((a, b) => a.off - b.off)
  const files = new Map(entries.map((e) => [e.name, e.data.toString('utf8')]))
  return { entries, files }
}
function writeZip(list) { // [{name, data:Buffer, method}]
  const parts = [], cds = []
  let off = 0
  for (const e of list) {
    const name = Buffer.from(e.name), raw = e.data, comp = e.method === 8 ? zlib.deflateRawSync(raw) : raw, crc = zlib.crc32(raw)
    const lh = Buffer.alloc(30); lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(e.method, 8); lh.writeUInt32LE(crc, 14)
    lh.writeUInt32LE(comp.length, 18); lh.writeUInt32LE(raw.length, 22); lh.writeUInt16LE(name.length, 26)
    parts.push(lh, name, comp)
    const ch = Buffer.alloc(46); ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6); ch.writeUInt16LE(e.method, 10); ch.writeUInt32LE(crc, 16)
    ch.writeUInt32LE(comp.length, 20); ch.writeUInt32LE(raw.length, 24); ch.writeUInt16LE(name.length, 28); ch.writeUInt32LE(off, 42)
    cds.push(ch, name)
    off += 30 + name.length + comp.length
  }
  const cdBuf = Buffer.concat(cds), eocd = Buffer.alloc(22)
  eocd.writeUInt32LE(0x06054b50, 0); eocd.writeUInt16LE(list.length, 8); eocd.writeUInt16LE(list.length, 10); eocd.writeUInt32LE(cdBuf.length, 12); eocd.writeUInt32LE(off, 16)
  return Buffer.concat([...parts, cdBuf, eocd])
}
const nonws = (s) => [...s].filter((c) => !/\s/.test(c)).length
const decodeEnt = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#([0-9]+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&amp;/g, '&')
const tagText = (s) => decodeEnt(s.replace(/<[^>]+>/g, ''))
function opfPath(z) { return /full-path="([^"]+)"/.exec(z.files.get('META-INF/container.xml'))[1] }
function spineDocs(z) {
  const op = opfPath(z), opf = z.files.get(op), dir = op.split('/').slice(0, -1).join('/')
  const man = {}; for (const m of opf.matchAll(/<item id="([^"]+)" href="([^"]+)" media-type="([^"]+)"/g)) man[m[1]] = { href: (dir ? dir + '/' : '') + m[2], media: m[3] }
  return [...opf.matchAll(/<itemref idref="([^"]+)"/g)].map((m) => man[m[1]])
}
function chapterTexts(z) { // 每个正文文件：h1/h2 标题 + <p> 字数
  return spineDocs(z).map((d) => z.files.get(d.href)).filter((x) => /epub:type="(chapter|part|preface)"/.test(x)).map((x) => ({
    title: tagText((/<h[12][^>]*>([\s\S]*?)<\/h[12]>/.exec(x) || ['', ''])[1]),
    chars: [...x.matchAll(/<(p|li)>([\s\S]*?)<\/\1>/g)].reduce((a, m) => a + nonws(tagText(m[2])), 0),
    html: x,
  }))
}
function epubcheck(buf, tag) {
  const jar = process.env.ES_EPUBCHECK
  if (!jar) return null
  const f = path.join(os.tmpdir(), `es-test-${tag}-${process.pid}.epub`)
  fs.writeFileSync(f, buf)
  const r = spawnSync(process.env.ES_JAVA || 'java', ['-jar', jar, f], { encoding: 'utf8', timeout: 120000 })
  const m = /Messages: (\d+) fatals? \/ (\d+) errors? \/ (\d+) warnings?/.exec((r.stdout || '') + (r.stderr || ''))
  fs.rmSync(f, { force: true })
  return m ? { fatal: +m[1], error: +m[2], warn: +m[3], out: (r.stdout || '').split('\n').filter((l) => /^(ERROR|FATAL|WARNING)/.test(l)).slice(0, 4).join(' | ') } : { fatal: -1, error: -1, warn: -1, out: (r.stderr || '').slice(0, 300) }
}

export default async ({ page, toolURL, screenshot, assert }) => {
  const rev = () => page.evaluate(() => +document.body.getAttribute('data-es-rev') || 0)
  const settle = async (r0) => { await page.waitForFunction((r) => (+document.body.getAttribute('data-es-rev') || 0) > r, r0, { timeout: 10000 }) }
  const sample = async (k) => { const r0 = await rev(); await page.click('#es-s-' + k); await settle(r0) }
  const change = async (fn) => { const r0 = await rev(); await fn(); await settle(r0) }
  const chRows = () => page.$$eval('#es-chtab tbody tr:not(.es-off)', (rs) => rs.map((r) => ({ t: r.children[1].textContent.replace(/^　/, ''), n: +r.children[2].textContent.replace(/,/g, '') })))
  const stat = (k) => page.$eval(`#es-ch-stats [data-k="${k}"] b`, (b) => +b.textContent.replace(/,/g, '')).catch(() => null)
  const onTab = async (t) => { await page.click('#tab-' + t); await page.waitForFunction((t) => !document.querySelector('#pane-' + t).hidden, t) }
  const download = async (sel) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); return { buf: fs.readFileSync(await d.path()), name: d.suggestedFilename() } }
  const build = async () => {
    await page.evaluate(() => { const o = document.querySelector('#es-out'); o.removeAttribute('data-state') })
    await page.click('#es-build')
    await page.waitForSelector('#es-out[data-state="done"]', { timeout: 30000 })
    return download('#es-dl')
  }
  const T = ORACLE

  await page.goto(toolURL)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  assert(await page.$eval('#es-build', (b) => b.disabled), '没有文稿时「生成」按钮应禁用')

  /* ── 1. 网文（GBK）：编码识别、卷首信息、清理规则、卷章与跳号 ── */
  await sample('novel')
  assert(await page.$eval('#es-src-kv', (e) => e.getAttribute('data-enc')) === T.novel.enc, '网文示例应识别为 GB18030')
  assert(await page.$eval('#es-m-title', (e) => e.value) === T.novel.title, '书名应从卷首识别')
  assert(await page.$eval('#es-m-author', (e) => e.value) === T.novel.author, '作者应从「作者：」行识别')
  assert(await page.$eval('#es-m-desc', (e) => e.value) === T.novel.desc, '简介应从「简介：」行识别')
  for (const [k, n] of Object.entries(T.novel.removed)) {
    const txt = await page.$eval('#es-cnt-' + k, (e) => e.textContent)
    assert(txt.includes(`删 ${n} 行`), `规则 ${k} 应删 ${n} 行，界面：${txt}`)
  }
  let rows = await chRows()
  assert(JSON.stringify(rows.map((r) => r.t)) === JSON.stringify(T.novel.chapters.map((c) => c.title)), `网文章节标题不符：${rows.map((r) => r.t).join('|')}`)
  assert(JSON.stringify(rows.map((r) => r.n)) === JSON.stringify(T.novel.chapters.map((c) => c.chars)), `网文每章字数不符：${rows.map((r) => r.n)}`)
  assert(await stat('chars') === T.novel.total, '网文总字数')
  assert(await stat('vol') === 2 && await stat('ch') === T.novel.chapters.length - 2, '网文应是 2 卷 6 章')
  const gap = await page.$$eval('#es-anoms li[data-type="gap"]', (ls) => ls.map((l) => l.textContent))
  assert(gap.length === 1 && gap[0].includes(`${T.novel.gap[0]} → ${T.novel.gap[1]}`), `应报一处跳号 2 → 4：${gap}`)
  assert(await page.$$eval('#es-anoms li[data-type="back"]', (l) => l.length) === 0, '第二卷重新从第一章编号不应报回退')

  // 取消把「第4章 三点」当章节 ⇒ 它并进第2章正文，跳号消失
  await change(() => page.click('#es-chtab tbody tr:nth-child(4) input'))
  rows = await chRows()
  const ch2 = rows.find((r) => r.t === '第2章 交接')
  assert(rows.length === T.novel.chapters.length - 1 && ch2.n === T.novel.chapters[2].chars + T.novel.ch4head + T.novel.chapters[3].chars, `并入后第2章字数应为 ${T.novel.chapters[2].chars}+${T.novel.ch4head}+${T.novel.chapters[3].chars}，实得 ${ch2 && ch2.n}`)
  assert(await page.$$eval('#es-anoms li[data-type="gap"]', (l) => l.length) === 0, '并入后不应再报跳号')
  await change(() => page.click('#es-chtab tbody tr.es-off input'))
  assert((await chRows()).length === T.novel.chapters.length, '恢复后章节数复原')

  // 自定义删除规则
  await change(() => page.fill('#es-r-custom', '^地下室'))
  rows = await chRows()
  assert(rows.find((r) => r.t === '第二章 灯油').n === T.novel.chapters[6].chars - T.novel.dixiashi, '自定义删除「^地下室」后第二章字数应减少该行字数')
  await change(() => page.fill('#es-r-custom', '^地下室\n([unclosed'))
  assert((await page.$eval('#es-r-custom-msg', (e) => e.textContent)).includes('1 条正则写法不对'), '坏正则要提示且被忽略')
  await change(() => page.fill('#es-r-custom', ''))

  // 标题编号统一
  await change(() => page.selectOption('#es-o-title', 'cn'))
  rows = await chRows()
  assert(rows[1].t === '第一章 最后一班船' && rows[3].t === '第四章 三点' && rows[0].t === '第一卷 雾港', `统一为中文数字：${rows.slice(0, 4).map((r) => r.t)}`)
  await change(() => page.selectOption('#es-o-title', 'keep'))

  // 手动改编码 ⇒ 乱码，再回到自动
  await change(() => page.selectOption('#es-enc', 'big5'))
  assert(await page.$eval('#es-src-kv', (e) => e.getAttribute('data-enc')) === 'big5', '手动指定 Big5 应生效')
  assert(await stat('chars') !== T.novel.total, '按 Big5 解 GBK 字节应得到不同的文本')
  await change(() => page.selectOption('#es-enc', ''))
  assert(await stat('chars') === T.novel.total, '回到自动识别后复原')
  const candTop = await page.$eval('#es-cands tbody tr', (r) => r.getAttribute('data-enc'))
  assert(candTop === 'gb18030', '候选表第一名应是 GB18030')

  /* ── 2. 西遊記：古登堡头尾、硬折行还原、编号两种写法 ── */
  await sample('xyj')
  assert(await page.$eval('#es-src-kv', (e) => e.getAttribute('data-enc')) === 'utf-8', '西遊記示例是 UTF-8')
  assert((await page.$eval('#es-cnt-pg', (e) => e.textContent)).includes(`去掉 ${T.xyj.pg} 行`), '古登堡头尾行数')
  assert((await page.$eval('#es-cnt-url', (e) => e.textContent)).includes(`删 ${T.xyj.removed.url} 行`), '网址行')
  rows = await chRows()
  assert(JSON.stringify(rows.map((r) => r.t)) === JSON.stringify(T.xyj.chapters.map((c) => c.title)), `西遊記标题：${rows.map((r) => r.t)}`)
  assert(JSON.stringify(rows.map((r) => r.n)) === JSON.stringify(T.xyj.chapters.map((c) => c.chars)), `西遊記字数：${rows.map((r) => r.n)}`)
  assert(await stat('chars') === T.xyj.total, '西遊記总字数（Language 行作为元数据不进正文）')
  const pi = await page.$eval('#es-para-info', (e) => ({ m: e.getAttribute('data-mode'), w: +e.getAttribute('data-w'), n: +e.getAttribute('data-merged') }))
  assert(pi.m === 'blank' && pi.w === 70 && pi.n > 300, `自动判定应为空行分段、W=70：${JSON.stringify(pi)}`)
  // 预览里第一回的诗句不应被接成一段，正文长段应被接回
  await page.selectOption('#es-pv-sel', '0')
  const pv = await page.$$eval('#es-pv-flow p', (ps) => ps.slice(0, 3).map((p) => p.textContent))
  assert(pv[0] === '詩曰：' && pv[1] === '混沌未分天地亂，茫茫渺渺無人見。', `诗句应逐行成段：${pv.slice(0, 2)}`)
  const longP = await page.$$eval('#es-pv-flow p', (ps) => Math.max(...ps.map((p) => p.textContent.length)))
  assert(longP > 300, `硬折行应被接回成长段，最长段 ${longP}`)
  // 每行一段：字数不变、不再接行（性质：分段方式不改变字数）
  await change(() => page.selectOption('#es-o-para', 'line'))
  assert(await stat('chars') === T.xyj.total && await page.$eval('#es-para-info', (e) => +e.getAttribute('data-merged')) === 0, '每行一段时字数不变、接行数为 0')
  await change(() => page.selectOption('#es-o-para', 'auto'))
  await change(() => page.selectOption('#es-o-title', 'arabic'))
  rows = await chRows()
  assert(rows[0].t.startsWith('第1回 靈根育孕源流出') && rows[1].t.startsWith('第2回 '), `阿拉伯数字：${rows.map((r) => r.t)}`)
  await change(() => page.selectOption('#es-o-title', 'keep'))

  /* ── 3. Alice：原书目录页、CHAPTER 下一行的章名 ── */
  await sample('alice')
  rows = await chRows()
  assert(await stat('toc') === T.alice.toc, `应排除原书目录 ${T.alice.toc} 行`)
  assert(JSON.stringify(rows.slice(1).map((r) => r.t)) === JSON.stringify(T.alice.chapters.map((c) => c.title)), `Alice 标题：${rows.map((r) => r.t)}`)
  assert(rows[0].n === T.alice.front && await stat('chars') === T.alice.total, `Alice 前言 ${rows[0].n} / 总字数`)
  await change(() => page.uncheck('#es-o-toc'))
  assert(await page.$$eval('#es-anoms li[data-type="dup"],#es-anoms li[data-type="back"]', (l) => l.length) >= 1, '不排除目录页时应报编号重复 / 回退')
  await change(() => page.check('#es-o-toc'))

  /* ── 4. 编码夹具（Python codecs 生成） ── */
  for (const [k, fx] of Object.entries(T.fixtures)) {
    await change(() => page.setInputFiles('#es-file', { name: fx.name, mimeType: 'text/plain', buffer: Buffer.from(fx.b64, 'base64') }))
    const got = await page.$eval('#es-src-kv', (e) => e.getAttribute('data-enc'))
    assert(got === fx.enc, `夹具 ${k} 应识别为 ${fx.enc}，实得 ${got}`)
    const want = fx.head.replace(/\s/g, '')
    const head = await page.evaluate((n) => window.__es.S.src.items[0].text.replace(/\s/g, '').slice(0, n), want.length)
    assert(want.length >= 20 && head === want, `夹具 ${k} 解码后的开头不符：${head} vs ${want}`)
  }

  /* ── 5. 多文件、自定义章节正则、Markdown ── */
  const mk = (name, s) => ({ name, mimeType: 'text/plain', buffer: Buffer.from(s, 'utf8') })
  await change(() => page.setInputFiles('#es-file', [mk('第10章.txt', '十。\n'), mk('第2章.txt', '二。\n'), mk('第1章.txt', '一。\n')]))
  assert(JSON.stringify((await chRows()).map((r) => r.t)) === '["第1章","第2章","第10章"]', '多文件按文件名自然排序')
  await change(() => page.setInputFiles('#es-file', mk('custom.txt', '【1】甲\n这是第一段正文，足够长足够长足够长足够长足够长。\n【2】乙\n这是第二段正文，足够长足够长足够长足够长足够长。\n【5】丙\n这是第三段正文，足够长足够长足够长足够长足够长。\n')))
  rows = await chRows()
  assert(rows.length === 1 && rows[0].t === '前言', `默认规则不认【1】，整篇进前言：${rows.map((r) => r.t)}`)
  assert((await page.$eval('#es-anoms', (e) => e.textContent)).includes('没有识别到章节'), '没识别到章节要提示')
  await change(() => page.fill('#es-c-re', '^【(\\d+)】.*$'))
  rows = await chRows()
  assert(rows.length === 3 && rows[2].t === '【5】丙', `自定义正则识别 3 章：${rows.map((r) => r.t)}`)
  assert((await page.$$eval('#es-anoms li[data-type="gap"]', (ls) => ls.map((l) => l.textContent))).some((t) => t.includes('2 → 5')), '自定义正则的捕获组编号也做跳号体检')
  await change(() => page.fill('#es-c-re', ''))
  // 古登堡本的逐位写法：九九 = 99、一〇〇 = 100、一〇一 = 101（编号应连续，不报跳号）
  const body = '这一段正文足够长，足够长，足够长，足够长，足够长，足够长。\n'
  await change(() => page.setInputFiles('#es-file', mk('digits.txt', `第九九回 甲\n${body}第一〇〇回 乙\n${body}第一〇一回 丙\n${body}`)))
  assert(await page.$$eval('#es-anoms li[data-type="gap"],#es-anoms li[data-type="back"]', (l) => l.length) === 0, '逐位写法 99→100→101 编号连续')
  await change(() => page.selectOption('#es-o-title', 'arabic'))
  assert(JSON.stringify((await chRows()).map((r) => r.t)) === '["第99回 甲","第100回 乙","第101回 丙"]', `逐位写法转阿拉伯数字：${(await chRows()).map((r) => r.t)}`)
  await change(() => page.selectOption('#es-o-title', 'cn'))
  assert(JSON.stringify((await chRows()).map((r) => r.t)) === '["第九十九回 甲","第一百回 乙","第一百零一回 丙"]', `逐位写法转中文数字：${(await chRows()).map((r) => r.t)}`)
  await change(() => page.selectOption('#es-o-title', 'keep'))
  await change(() => page.setInputFiles('#es-file', mk('notes.md', '# 卷一\n\n## 第一节 开始\n\n这是**粗体**和*斜体*，还有 `code` 与 [链接](https://example.com)。\n\n- 甲\n- 乙\n\n## 第二节 结束\n\n> 一段引文\n\n普通段落 a < b & c。\n')))
  assert(await page.$eval('#es-fmt', (e) => e.value) === 'md', '.md 文件自动切到 Markdown')
  rows = await chRows()
  assert(JSON.stringify(rows.map((r) => r.t)) === '["卷一","第一节 开始","第二节 结束"]', `Markdown 标题：${rows.map((r) => r.t)}`)
  let ep = await build()
  let z = readZip(ep.buf)
  let chs = chapterTexts(z)
  assert(/<strong>粗体<\/strong>/.test(chs[1].html) && /<em>斜体<\/em>/.test(chs[1].html) && /<code>code<\/code>/.test(chs[1].html) && /<a href="https:\/\/example\.com">链接<\/a>/.test(chs[1].html), 'Markdown 行内格式')
  assert(/<ul><li>甲<\/li><li>乙<\/li><\/ul>/.test(chs[1].html) && /<blockquote><p>一段引文<\/p><\/blockquote>/.test(chs[2].html), 'Markdown 列表与引文')
  assert(/a &lt; b &amp; c/.test(chs[2].html), '正文里的 < 与 & 必须转义')
  const navMd = z.files.get('OEBPS/nav.xhtml')
  assert(/<li><a href="text\/v0001\.xhtml">卷一<\/a>\s*<ol>/.test(navMd), '卷一下面嵌套两节')
  let ec = epubcheck(ep.buf, 'md')
  if (ec) assert(ec.fatal === 0 && ec.error === 0 && ec.warn === 0, `EPUBCheck（Markdown 书）：${JSON.stringify(ec)}`)

  /* ── 6. 西遊記成书：元数据、ISBN、封面、独立拆包核对 ── */
  await sample('xyj')
  await page.fill('#es-m-pub', '每日工具集')
  await page.fill('#es-m-date', '2026-11')
  await page.fill('#es-m-tags', '古典小说, 神魔')
  await page.fill('#es-m-series', '四大名著')
  await page.fill('#es-m-sidx', '2')
  await page.fill('#es-m-id', '978-0-306-40615-7')
  await page.waitForFunction(() => document.querySelector('#es-m-msg').textContent.includes('ISBN 校验通过'))
  await page.click('#es-cv-style button[data-v="ink"]')
  ep = await build()
  assert(ep.name === '西遊記.epub', '下载文件名用书名')
  z = readZip(ep.buf)
  const first = z.entries[0]
  assert(first.name === 'mimetype' && first.method === 0 && first.localExtra === 0 && first.data.toString() === 'application/epub+zip', 'mimetype 第一、不压缩、无扩展字段')
  assert(z.entries.every((e) => e.crcOk), 'CRC 全部正确（Node zlib 独立校验）')
  assert(z.entries.filter((e) => e.method === 8).length >= z.entries.length - 2, '其余文件应压缩')
  const opf = z.files.get(opfPath(z))
  const has = (re, msg) => assert(re.test(opf), msg + '：' + opf.slice(0, 400))
  has(/<dc:identifier id="bookid">urn:isbn:9780306406157<\/dc:identifier>/, 'ISBN 标识符')
  has(/<dc:title id="title">西遊記<\/dc:title>/, 'dc:title')
  has(/<dc:creator id="creator">吳承恩<\/dc:creator>/, 'dc:creator')
  has(new RegExp(`<dc:language>${T.xyj.lang}</dc:language>`), '语言按正文判为繁体')
  has(/<dc:publisher>每日工具集<\/dc:publisher>/, '出版者'); has(/<dc:date>2026-11<\/dc:date>/, '出版日期')
  has(/<dc:subject>古典小说<\/dc:subject>\s*<dc:subject>神魔<\/dc:subject>/, '标签')
  has(/property="belongs-to-collection" id="series">四大名著<\/meta>[\s\S]*property="group-position">2<\/meta>/, '系列与序号')
  has(/<meta property="dcterms:modified">\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ<\/meta>/, 'dcterms:modified 格式')
  has(/<item id="cover-image" href="images\/cover\.jpg" media-type="image\/jpeg" properties="cover-image"\/>/, '封面图片')
  const coverJpg = z.entries.find((e) => e.name === 'OEBPS/images/cover.jpg').data
  assert(coverJpg[0] === 0xFF && coverJpg[1] === 0xD8 && coverJpg.length > 20000, '封面是真 JPEG')
  const ncx = z.files.get('OEBPS/toc.ncx')
  assert(/<meta name="dtb:uid" content="urn:isbn:9780306406157"\/>/.test(ncx) && (ncx.match(/<navPoint /g) || []).length === T.xyj.chapters.length, 'NCX uid 与条目数')
  chs = chapterTexts(z)
  assert(JSON.stringify(chs.map((c) => c.title)) === JSON.stringify(T.xyj.chapters.map((c) => c.title)), `EPUB 里的章标题：${chs.map((c) => c.title)}`)
  assert(JSON.stringify(chs.map((c) => c.chars)) === JSON.stringify(T.xyj.chapters.map((c) => c.chars)), `EPUB 里每章字数（独立拆包统计）：${chs.map((c) => c.chars)}`)
  ec = epubcheck(ep.buf, 'xyj')
  if (ec) assert(ec.fatal === 0 && ec.error === 0 && ec.warn === 0, `EPUBCheck（西遊記）：${JSON.stringify(ec)}`)
  const outKv = await page.$eval('#es-out-kv', (e) => e.textContent)
  assert(outKv.includes('通过：0 个错误') && outKv.includes('urn:isbn:9780306406157'), '页面自检结果')
  const xyjBuf = ep.buf

  /* ── 7. 封面排版：文字盒互不重叠、都在画布内；长书名自动缩字号 ── */
  await page.fill('#es-m-title', '一个非常非常长的书名用来测试封面自动换行与缩小字号到底能不能放得下而且不会压到作者名字')
  await page.waitForFunction(() => document.querySelector('#es-run-l').textContent.startsWith('一个非常'))
  await page.waitForFunction(() => +document.querySelector('#es-cv').getAttribute('data-size') < 200, null, { timeout: 5000 })
  for (const st of ['paper', 'ink', 'mist']) {
    await page.click(`#es-cv-style button[data-v="${st}"]`)
    const boxes = await page.$eval('#es-cv', (c) => JSON.parse(c.getAttribute('data-boxes')))
    assert(boxes.some((b) => b.t === 'pub') && boxes.some((b) => b.t === 'author') && boxes.filter((b) => b.t === 'title').length <= 4, `封面 ${st} 元素齐全`)
    for (const b of boxes) assert(b.x >= 0 && b.y >= 0 && b.x + b.w <= 1600 && b.y + b.h <= 2560, `封面 ${st} 的 ${b.t} 越出画布`)
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], c = boxes[j]
      const ov = Math.min(a.x + a.w, c.x + c.w) - Math.max(a.x, c.x) > 0 && Math.min(a.y + a.h, c.y + c.h) - Math.max(a.y, c.y) > 0
      assert(!ov || (a.t === 'title' && c.t === 'title'), `封面 ${st}：${a.t} 与 ${c.t} 重叠`)
    }
  }
  const cvPx = await page.$eval('#es-cv', (c) => { const g = c.getContext('2d'); const d = g.getImageData(150, 700, 1300, 900).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 120) n++; return n })
  assert(cvPx > 2000, `封面书名区应画上了深色文字像素，实得 ${cvPx}`)
  // 用自己的图：PNG → 重新编码成 JPEG
  const png = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 400; c.height = 300; const g = c.getContext('2d'); g.fillStyle = '#a8c8e8'; g.fillRect(0, 0, 400, 300); g.fillStyle = '#0c0a09'; g.fillRect(150, 100, 100, 100); return c.toDataURL('image/png').split(',')[1] })
  await page.click('#es-cv-style button[data-v="upload"]')
  await page.setInputFiles('#es-cv-file', { name: 'cover.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64') })
  await page.waitForFunction(() => document.querySelector('#es-cv-msg').textContent.includes('400 × 300'))

  /* ── 8. 网文：竖排、无书名页、无封面、两级目录 ── */
  await sample('novel')
  await page.click('#es-cv-style button[data-v="none"]')
  await page.check('#es-st-vert'); await page.uncheck('#es-st-tp')
  await page.waitForFunction(() => document.querySelector('#es-pv-flow').classList.contains('es-vert'))
  ep = await build()
  z = readZip(ep.buf)
  const opf2 = z.files.get(opfPath(z))
  assert(/<spine toc="ncx" page-progression-direction="rtl">/.test(opf2) && /<meta name="primary-writing-mode" content="vertical-rl"\/>/.test(opf2), '竖排：spine rtl + primary-writing-mode')
  assert(/writing-mode: vertical-rl/.test(z.files.get('OEBPS/style.css')), '竖排 CSS')
  assert(!/cover-image/.test(opf2) && !/titlepage/.test(opf2), '无封面、无书名页')
  assert(new RegExp(`<dc:description>${T.novel.desc}</dc:description>`).test(opf2), '简介写进 dc:description')
  const nav2 = z.files.get('OEBPS/nav.xhtml')
  const top = [...nav2.split('<nav epub:type="landmarks"')[0].matchAll(/<li><a href="[^"]+">([^<]+)<\/a>/g)].map((m) => m[1])
  assert(JSON.stringify(top) === JSON.stringify(T.novel.chapters.map((c) => c.title)), `nav 目录：${top}`)
  assert((nav2.match(/<ol>/g) || []).length === 1 + 2 + 1, 'nav：顶层 + 两卷各一层 + landmarks')
  chs = chapterTexts(z)
  assert(JSON.stringify(chs.map((c) => c.chars)) === JSON.stringify(T.novel.chapters.map((c) => c.chars)), `网文 EPUB 每章字数：${chs.map((c) => c.chars)}`)
  ec = epubcheck(ep.buf, 'novel')
  if (ec) assert(ec.fatal === 0 && ec.error === 0 && ec.warn === 0, `EPUBCheck（竖排网文）：${JSON.stringify(ec)}`)
  await page.uncheck('#es-st-vert'); await page.check('#es-st-tp')

  /* ── 9. 阅读器：目录、翻页、字号、主题、进度记忆 ── */
  await onTab('read')
  await page.setInputFiles('#es-rd-file', { name: '西遊記.epub', mimeType: 'application/epub+zip', buffer: xyjBuf })
  await page.waitForFunction(() => /第 1 \/ \d+ 篇/.test(document.querySelector('#es-rd-pos').textContent))
  const tocN = await page.$$eval('#es-rd-toc button', (b) => b.length)
  assert(tocN === T.xyj.chapters.length, `阅读器目录 ${tocN} 条`)
  await page.click('#es-rd-toc li:nth-child(2) button')
  await page.waitForFunction(() => document.querySelector('#es-rd-flow h2') && document.querySelector('#es-rd-flow h2').textContent.startsWith('第二回'))
  const k0 = await page.$eval('#es-rd-flow', (e) => e.getAttribute('data-key'))
  const pages0 = +k0.split(':')[2]
  assert(pages0 >= 3, `第二回应分成多页，实得 ${pages0}`)
  await page.focus('#es-rd-view'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight')
  await page.waitForFunction(() => document.querySelector('#es-rd-flow').getAttribute('data-key').split(':')[1] === '2')
  const shift = await page.$eval('#es-rd-flow', (e) => new DOMMatrix(getComputedStyle(e).transform).m41)
  const clipW = await page.$eval('#es-rd-clip', (e) => e.clientWidth)
  assert(Math.abs(shift + 2 * (clipW + 48)) < 1, `翻到第 3 页时位移应为 -2×(页宽+栏距)，实得 ${shift}`)
  const vis = await page.evaluate(() => { const clip = document.querySelector('#es-rd-clip').getBoundingClientRect(); return [...document.querySelectorAll('#es-rd-flow p')].filter((p) => { const r = p.getBoundingClientRect(); return r.left >= clip.left - 1 && r.right <= clip.right + 1 && r.width > 0 }).length })
  assert(vis > 0, '当前页里应有完整可见的段落')
  await page.click('#es-rd-bigger'); await page.click('#es-rd-bigger')
  await page.waitForFunction(() => document.querySelector('#es-rd-flow').getAttribute('data-key').split(':')[3] === '22')
  const pagesBig = +(await page.$eval('#es-rd-flow', (e) => e.getAttribute('data-key'))).split(':')[2]
  assert(pagesBig > pages0, `放大字号后页数应增加：${pages0} → ${pagesBig}`)
  await page.selectOption('#es-rd-theme', 'night')
  assert(await page.$eval('#es-rd-view', (e) => getComputedStyle(e).backgroundColor) === 'rgb(28, 25, 23)', '夜间主题背景')
  const keyBefore = (await page.$eval('#es-rd-flow', (e) => e.getAttribute('data-key'))).split(':')
  await page.reload()
  await onTab('read')
  await page.setInputFiles('#es-rd-file', { name: '西遊記.epub', mimeType: 'application/epub+zip', buffer: xyjBuf })
  await page.waitForFunction(() => document.querySelector('#es-rd-flow h2') && document.querySelector('#es-rd-flow h2').textContent.startsWith('第二回'))
  const keyAfter = (await page.$eval('#es-rd-flow', (e) => e.getAttribute('data-key'))).split(':')
  assert(keyAfter[0] === keyBefore[0] && keyAfter[3] === '22' && Math.abs(+keyAfter[1] - +keyBefore[1]) <= 1, `刷新后重开应回到上次位置与字号：${keyBefore} → ${keyAfter}`)
  assert(await page.$eval('#es-rd-theme', (e) => e.value) === 'night', '主题偏好刷新后保留')
  // 书里的脚本、事件属性、外链样式一律不执行
  const evil = readZip(xyjBuf).entries.map((e) => ({ name: e.name, method: e.method, data: e.name === 'OEBPS/text/c0001.xhtml' ? Buffer.from(e.data.toString().replace('<section', '<script>window.__pwned = 1</script><link rel="stylesheet" href="https://example.com/x.css"/><p id="es-evil" onclick="window.__pwned = 2">点我</p><img src="../images/cover.jpg" onerror="window.__pwned = 3" onload="window.__pwned = 4"/><section')) : e.data }))
  await page.setInputFiles('#es-rd-file', { name: 'evil.epub', mimeType: 'application/epub+zip', buffer: writeZip(evil) })
  await page.click('#es-rd-toc li:nth-child(1) button')
  await page.waitForFunction(() => document.querySelector('#es-rd-flow [data-rid="es-evil"]'))
  await page.click('#es-rd-flow [data-rid="es-evil"]', { force: true })
  await page.waitForFunction(() => [...document.querySelectorAll('#es-rd-flow img')].every((i) => i.complete))
  const pw = await page.evaluate(() => ({ p: window.__pwned, s: document.querySelectorAll('#es-rd-flow script, #es-rd-flow link').length, on: [...document.querySelectorAll('#es-rd-flow *')].filter((e) => [...e.attributes].some((a) => /^on/i.test(a.name))).length, img: document.querySelectorAll('#es-rd-flow img').length }))
  assert(pw.p === undefined && pw.s === 0 && pw.on === 0 && pw.img === 1, `书内脚本不得执行、事件属性不得保留：${JSON.stringify(pw)}`)
  const lastIdx = +(await page.$eval('#es-rd-flow', (e) => e.getAttribute('data-key'))).split(':')[0] // 同一标识符的书，进度以最后一次为准

  /* ── 10. 体检：改坏 6 处 → 报错 → 一键修复 → 独立核对 ── */
  const good = readZip(xyjBuf)
  const broken = good.entries.map((e) => {
    let d = e.data
    if (e.name === 'OEBPS/content.opf') d = Buffer.from(d.toString().replace(/\s*<meta property="dcterms:modified">[^<]+<\/meta>/, '').replace('</manifest>', '<item id="ghost" href="images/ghost.png" media-type="image/png"/>\n  </manifest>'))
    if (e.name === 'OEBPS/text/c0002.xhtml') d = Buffer.from(d.toString().replace('<p>', '<p>孫悟空 & 豬八戒&nbsp;'))
    if (e.name === 'OEBPS/toc.ncx') d = Buffer.from(d.toString().replace('content="urn:isbn:9780306406157"', 'content="urn:uuid:00000000-0000-4000-8000-000000000000"'))
    return { name: e.name, data: d, method: 8 }
  })
  const bad = writeZip([broken[1], broken[0], ...broken.slice(2)])
  await onTab('check')
  await page.setInputFiles('#es-ck-file', { name: 'broken.epub', mimeType: 'application/epub+zip', buffer: bad })
  await page.waitForFunction(() => (document.querySelector('#es-ck-res').getAttribute('data-key') || '').startsWith('broken.epub:'))
  const codes = await page.$$eval('#es-ck-issues .es-issue[data-code]', (ls) => [...new Set(ls.map((l) => l.getAttribute('data-code')))])
  for (const c of ['PKG-MIME-FIRST', 'PKG-MIME-STORED', 'OPF-MODIFIED', 'OPF-ITEM-MISSING', 'HTM-XML', 'NCX-UID']) assert(codes.includes(c), `体检应报 ${c}，实得 ${codes}`)
  const htmMsgs = await page.$$eval('#es-ck-issues .es-issue[data-code="HTM-XML"] p', (ps) => ps.map((p) => p.textContent).join(' | '))
  assert(/裸露的 & 字符/.test(htmMsgs) && /未声明的实体 &nbsp;/.test(htmMsgs), `良构错误要指出具体原因：${htmMsgs}`)
  assert((await page.$eval('#es-ck-big', (e) => e.textContent)).includes('个错误'), '判为不通过')
  const ecBad = epubcheck(bad, 'broken')
  if (ecBad) assert(ecBad.error + ecBad.fatal > 0, 'EPUBCheck 也应判改坏件为错')
  const fixed = await download('#es-ck-fix')
  assert(fixed.name === 'broken-fixed.epub', '修复件文件名')
  await page.waitForFunction(() => (document.querySelector('#es-ck-res').getAttribute('data-key') || '').startsWith('broken-fixed.epub:0:'))
  const fz = readZip(fixed.buf)
  assert(fz.entries[0].name === 'mimetype' && fz.entries[0].method === 0 && fz.entries.every((e) => e.crcOk), '修复件：mimetype 归位且 CRC 正确')
  const fopf = fz.files.get(opfPath(fz))
  assert(/dcterms:modified/.test(fopf) && !/ghost/.test(fopf), '修复件：补回 modified、删掉缺失条目')
  assert(/<meta name="dtb:uid" content="urn:isbn:9780306406157"\/>/.test(fz.files.get('OEBPS/toc.ncx')), '修复件：NCX uid 对齐 OPF')
  assert(/孫悟空 &amp; 豬八戒&#160;/.test(fz.files.get('OEBPS/text/c0002.xhtml')), '修复件：裸 & 转义、&nbsp; 改成数字引用')
  const logItems = await page.$$eval('#es-ck-log li', (ls) => ls.map((l) => l.textContent))
  assert(logItems.length >= 5 && logItems[logItems.length - 1].startsWith('修复后：0 个错误'), `修复日志：${logItems}`)
  const ecFix = epubcheck(fixed.buf, 'fixed')
  if (ecFix) assert(ecFix.fatal === 0 && ecFix.error === 0, `EPUBCheck（修复件）：${JSON.stringify(ecFix)}`)
  // EPUB → TXT
  await page.setInputFiles('#es-ck-file', { name: '西遊記.epub', mimeType: 'application/epub+zip', buffer: xyjBuf })
  await page.waitForFunction(() => (document.querySelector('#es-ck-res').getAttribute('data-key') || '').startsWith('西遊記.epub:0:0'))
  const files = await page.$$eval('#es-ck-files tbody tr', (rs) => rs.map((r) => [r.children[0].textContent, r.children[2].textContent, r.children[3].textContent]))
  assert(files[0][0] === 'mimetype' && files[0][1] === '存储' && files.every((f) => f[2] === '✓'), '文件表')
  const txt = (await download('#es-ck-txt')).buf.toString('utf8')
  const want = nonws(T.xyj.title) + nonws(T.xyj.author) + T.xyj.chapters.reduce((a, c) => a + nonws(c.title) + c.chars, 0)
  assert(nonws(txt) === want, `导出 TXT 的非空白字数应为 ${want}，实得 ${nonws(txt)}`)
  assert(txt.indexOf(T.xyj.chapters[0].title) < txt.indexOf(T.xyj.chapters[1].title), 'TXT 章节顺序')

  /* ── 11. 书架与设置持久化 ── */
  await onTab('shelf')
  const shelf = await page.$$eval('#es-shelf article', (as) => as.map((a) => ({ id: a.getAttribute('data-id'), t: a.textContent })))
  const xyjShelf = shelf.find((s) => s.id === 'urn:isbn:9780306406157')
  assert(shelf.length >= 3 && xyjShelf && xyjShelf.t.includes(`读到第 ${lastIdx + 1} 篇`) && xyjShelf.t.includes(`${T.xyj.chapters.length} 章`), `书架：${shelf.map((s) => s.t.slice(0, 60))}`)
  await onTab('make')
  await page.uncheck('#es-r-url')
  await page.selectOption('#es-st-font', 'kai')
  await page.reload()
  assert(!(await page.$eval('#es-r-url', (e) => e.checked)) && await page.$eval('#es-st-font', (e) => e.value) === 'kai', '改完设置立刻刷新，设置应已保存（pagehide 补写）')
  await page.check('#es-r-url'); await page.selectOption('#es-st-font', 'serif')

  /* ── 12. 说明页：规则表与 EPUBCheck 对应 ── */
  await onTab('about')
  const ruleRows = await page.$$eval('#es-rules-table tbody tr', (rs) => rs.map((r) => [r.getAttribute('data-code'), r.children[4].textContent]))
  assert(ruleRows.length === 36, `规则表 36 条，实得 ${ruleRows.length}`)
  const mapped = ruleRows.filter((r) => r[1] !== '—')
  assert(mapped.length === (T.eckMapped || 0), `有 EPUBCheck 对应的规则数应为 ${T.eckMapped}，实得 ${mapped.length}`)

  /* ── 13. 渲染守卫 ── */
  await onTab('make')
  await sample('xyj')
  await renderGuards(page, {
    assert, tabs: T.meta.tabs, onTab, paneSel: (t) => `#pane-${t}`, panesRoot: '#es-panes',
    figSel: () => '#pane-make svg.es-none', cardSel: '.es-card', minControls: 40, minTextsInFig: 0,
  })
  await guardBoxOverlap(page, { assert, sel: '#es-tabs .es-tab, #es-ch-stats .es-stat, .es-samples .es-btn, #es-cv-style button, .es-pv-bar > *' })
  await onTab('read')
  await guardBoxOverlap(page, { assert, sel: '.es-rd-bar > *' })

  /* ── 缩略图 ── */
  await onTab('make')
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(200)
  await screenshot('thumb.png')
}
