// 参考文献工坊 · Cite Studio —— 集成测试
// 所有期望值来自 uitruth/ui_truth.mjs：示例数据用成品里的引擎解析，再交给 citeproc-js（Zotero 用的 CSL 处理器）排版，
// 由 tools/inject-oracle.mjs 机械注入下方 ORACLE 块（禁止手抄）。
import { renderGuards } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const ORACLE = {
 "meta": {
  "tabs": [
   "import",
   "library",
   "bib",
   "lint",
   "style",
   "help"
  ],
  "styles": [
   "gbt-numeric",
   "gbt-author-date",
   "apa",
   "ieee",
   "mla"
  ],
  "source": "citeproc-js 2.4.63"
 },
 "sample": {
  "n": 7,
  "format": "BibTeX / BibLaTeX",
  "ids": [
   "lecun2015deep",
   "vaswani2017attention",
   "goodfellow2016deep",
   "zhou2016ml",
   "li2019slm",
   "wang2023gnn",
   "zotero-styles"
  ],
  "titles": [
   "Deep learning",
   "Attention is All you Need",
   "Deep Learning",
   "机器学习",
   "统计学习方法",
   "基于图神经网络的分子性质预测研究",
   "Zotero Style Repository"
  ],
  "lint": {
   "error": 0,
   "warn": 2,
   "info": 0,
   "fix": 1,
   "codes": [
    "zhou2016ml:edition-1",
    "li2019slm:missing"
   ]
  },
  "afterFix": [
   "[1] LECUN Y, BENGIO Y, HINTON G. Deep learning[J/OL]. Nature, 2015, 521(7553): 436-444. DOI:10.1038/nature14539.",
   "[2] VASWANI A, SHAZEER N, PARMAR N, et al. Attention is All you Need[C]//Advances in Neural Information Processing Systems 30. Red Hook, NY: Curran Associates, 2017: 5998-6008.",
   "[3] GOODFELLOW I, BENGIO Y, COURVILLE A. Deep Learning[M]. Cambridge, MA: MIT Press, 2016.",
   "[4] 周志华. 机器学习[M]. 北京: 清华大学出版社, 2016.",
   "[5] 李航. 统计学习方法[M]. 2 版. 清华大学出版社, 2019.",
   "[6] 王小明. 基于图神经网络的分子性质预测研究[D]. 北京: 某某大学, 2023.",
   "[7] ZOTERO. Zotero Style Repository[EB/OL]. [2024-05-01]. https://www.zotero.org/styles."
  ]
 },
 "styles": {
  "gbt-numeric": {
   "ids": [
    "lecun2015deep",
    "vaswani2017attention",
    "goodfellow2016deep",
    "zhou2016ml",
    "li2019slm",
    "wang2023gnn",
    "zotero-styles"
   ],
   "bib": [
    "[1] LECUN Y, BENGIO Y, HINTON G. Deep learning[J/OL]. Nature, 2015, 521(7553): 436-444. DOI:10.1038/nature14539.",
    "[2] VASWANI A, SHAZEER N, PARMAR N, et al. Attention is All you Need[C]//Advances in Neural Information Processing Systems 30. Red Hook, NY: Curran Associates, 2017: 5998-6008.",
    "[3] GOODFELLOW I, BENGIO Y, COURVILLE A. Deep Learning[M]. Cambridge, MA: MIT Press, 2016.",
    "[4] 周志华. 机器学习[M]. 1 版. 北京: 清华大学出版社, 2016.",
    "[5] 李航. 统计学习方法[M]. 2 版. 清华大学出版社, 2019.",
    "[6] 王小明. 基于图神经网络的分子性质预测研究[D]. 北京: 某某大学, 2023.",
    "[7] ZOTERO. Zotero Style Repository[EB/OL]. [2024-05-01]. https://www.zotero.org/styles."
   ],
   "html": [
    "[1] LECUN Y, BENGIO Y, HINTON G. Deep learning[J/OL]. Nature, 2015, 521(7553): 436-444. DOI:10.1038/nature14539.",
    "[2] VASWANI A, SHAZEER N, PARMAR N, et al. Attention is All you Need[C]//Advances in Neural Information Processing Systems 30. Red Hook, NY: Curran Associates, 2017: 5998-6008.",
    "[3] GOODFELLOW I, BENGIO Y, COURVILLE A. Deep Learning[M]. Cambridge, MA: MIT Press, 2016.",
    "[4] 周志华. 机器学习[M]. 1 版. 北京: 清华大学出版社, 2016.",
    "[5] 李航. 统计学习方法[M]. 2 版. 清华大学出版社, 2019.",
    "[6] 王小明. 基于图神经网络的分子性质预测研究[D]. 北京: 某某大学, 2023.",
    "[7] ZOTERO. Zotero Style Repository[EB/OL]. [2024-05-01]. https://www.zotero.org/styles."
   ],
   "cites": {
    "lecun2015deep": "[1]",
    "vaswani2017attention": "[2]",
    "goodfellow2016deep": "[3]",
    "zhou2016ml": "[4]",
    "li2019slm": "[5]",
    "wang2023gnn": "[6]",
    "zotero-styles": "[7]"
   },
   "clusters": [
    "[1–3]",
    "[4,5]"
   ]
  },
  "gbt-author-date": {
   "ids": [
    "li2019slm",
    "wang2023gnn",
    "zhou2016ml",
    "goodfellow2016deep",
    "lecun2015deep",
    "vaswani2017attention",
    "zotero-styles"
   ],
   "bib": [
    "李航, 2019. 统计学习方法[M]. 2 版. 清华大学出版社.",
    "王小明, 2023. 基于图神经网络的分子性质预测研究[D]. 北京: 某某大学.",
    "周志华, 2016. 机器学习[M]. 1 版. 北京: 清华大学出版社.",
    "GOODFELLOW I, BENGIO Y, COURVILLE A, 2016. Deep Learning[M]. Cambridge, MA: MIT Press.",
    "LECUN Y, BENGIO Y, HINTON G, 2015. Deep learning[J/OL]. Nature, 521(7553): 436-444. DOI:10.1038/nature14539.",
    "VASWANI A, SHAZEER N, PARMAR N, et al., 2017. Attention is All you Need[C]//Advances in Neural Information Processing Systems 30. Red Hook, NY: Curran Associates: 5998-6008.",
    "ZOTERO, [2024]. Zotero Style Repository[EB/OL]. [2024-05-01]. https://www.zotero.org/styles."
   ],
   "html": [
    "李航, 2019. 统计学习方法[M]. 2 版. 清华大学出版社.",
    "王小明, 2023. 基于图神经网络的分子性质预测研究[D]. 北京: 某某大学.",
    "周志华, 2016. 机器学习[M]. 1 版. 北京: 清华大学出版社.",
    "GOODFELLOW I, BENGIO Y, COURVILLE A, 2016. Deep Learning[M]. Cambridge, MA: MIT Press.",
    "LECUN Y, BENGIO Y, HINTON G, 2015. Deep learning[J/OL]. Nature, 521(7553): 436-444. DOI:10.1038/nature14539.",
    "VASWANI A, SHAZEER N, PARMAR N, et al., 2017. Attention is All you Need[C]//Advances in Neural Information Processing Systems 30. Red Hook, NY: Curran Associates: 5998-6008.",
    "ZOTERO, [2024]. Zotero Style Repository[EB/OL]. [2024-05-01]. https://www.zotero.org/styles."
   ],
   "cites": {
    "li2019slm": "(李航, 2019)",
    "wang2023gnn": "(王小明, 2023)",
    "zhou2016ml": "(周志华, 2016)",
    "goodfellow2016deep": "(Goodfellow et al., 2016)",
    "lecun2015deep": "(LeCun et al., 2015)",
    "vaswani2017attention": "(Vaswani et al., 2017)",
    "zotero-styles": "(Zotero, [2024])"
   },
   "clusters": [
    "(LeCun et al., 2015; Vaswani et al., 2017; Goodfellow et al., 2016)",
    "(李航, 2019; 周志华, 2016)"
   ]
  },
  "apa": {
   "ids": [
    "goodfellow2016deep",
    "lecun2015deep",
    "vaswani2017attention",
    "zotero-styles",
    "zhou2016ml",
    "li2019slm",
    "wang2023gnn"
   ],
   "bib": [
    "Goodfellow, I., Bengio, Y., & Courville, A. (2016). Deep Learning. MIT Press.",
    "LeCun, Y., Bengio, Y., & Hinton, G. (2015). Deep learning. Nature, 521(7553), 436–444. https://doi.org/10.1038/nature14539",
    "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is All you Need. Advances in Neural Information Processing Systems 30, 5998–6008.",
    "Zotero. (n.d.). Zotero Style Repository. Retrieved May 1, 2024, from https://www.zotero.org/styles",
    "周志华. (2016). 机器学习 (1st ed.). 清华大学出版社.",
    "李航. (2019). 统计学习方法 (2nd ed.). 清华大学出版社.",
    "王小明. (2023). 基于图神经网络的分子性质预测研究 [博士学位论文]. 某某大学."
   ],
   "html": [
    "Goodfellow, I., Bengio, Y., & Courville, A. (2016). <i>Deep Learning</i>. MIT Press.",
    "LeCun, Y., Bengio, Y., & Hinton, G. (2015). Deep learning. <i>Nature</i>, <i>521</i>(7553), 436–444. https://doi.org/10.1038/nature14539",
    "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is All you Need. <i>Advances in Neural Information Processing Systems 30</i>, 5998–6008.",
    "Zotero. (n.d.). <i>Zotero Style Repository</i>. Retrieved May 1, 2024, from https://www.zotero.org/styles",
    "周志华. (2016). <i>机器学习</i> (1st ed.). 清华大学出版社.",
    "李航. (2019). <i>统计学习方法</i> (2nd ed.). 清华大学出版社.",
    "王小明. (2023). <i>基于图神经网络的分子性质预测研究</i> [博士学位论文]. 某某大学."
   ],
   "cites": {
    "goodfellow2016deep": "(Goodfellow et al., 2016)",
    "lecun2015deep": "(LeCun et al., 2015)",
    "vaswani2017attention": "(Vaswani et al., 2017)",
    "zotero-styles": "(Zotero, n.d.)",
    "zhou2016ml": "(周志华, 2016)",
    "li2019slm": "(李航, 2019)",
    "wang2023gnn": "(王小明, 2023)"
   },
   "clusters": [
    "(Goodfellow et al., 2016; LeCun et al., 2015; Vaswani et al., 2017)",
    "(周志华, 2016; 李航, 2019)"
   ]
  },
  "ieee": {
   "ids": [
    "lecun2015deep",
    "vaswani2017attention",
    "goodfellow2016deep",
    "zhou2016ml",
    "li2019slm",
    "wang2023gnn",
    "zotero-styles"
   ],
   "bib": [
    "[1] Y. LeCun, Y. Bengio, and G. Hinton, “Deep learning,” Nature, vol. 521, no. 7553, pp. 436–444, 2015, doi: 10.1038/nature14539.",
    "[2] A. Vaswani et al., “Attention is All you Need,” in Advances in Neural Information Processing Systems 30, Red Hook, NY: Curran Associates, 2017, pp. 5998–6008.",
    "[3] I. Goodfellow, Y. Bengio, and A. Courville, Deep Learning. Cambridge, MA: MIT Press, 2016.",
    "[4] 周志华, 机器学习, 1st ed. 北京: 清华大学出版社, 2016.",
    "[5] 李航, 统计学习方法, 2nd ed. 清华大学出版社, 2019.",
    "[6] 王小明, “基于图神经网络的分子性质预测研究,” 博士学位论文, 某某大学, 北京, 2023.",
    "[7] Zotero, “Zotero Style Repository.” Accessed: May 01, 2024. [Online]. Available: https://www.zotero.org/styles"
   ],
   "html": [
    "[1] Y. LeCun, Y. Bengio, and G. Hinton, “Deep learning,” <i>Nature</i>, vol. 521, no. 7553, pp. 436–444, 2015, doi: 10.1038/nature14539.",
    "[2] A. Vaswani <i>et al.</i>, “Attention is All you Need,” in <i>Advances in Neural Information Processing Systems 30</i>, Red Hook, NY: Curran Associates, 2017, pp. 5998–6008.",
    "[3] I. Goodfellow, Y. Bengio, and A. Courville, <i>Deep Learning</i>. Cambridge, MA: MIT Press, 2016.",
    "[4] 周志华, 机器学习, 1st ed. 北京: 清华大学出版社, 2016.",
    "[5] 李航, 统计学习方法, 2nd ed. 清华大学出版社, 2019.",
    "[6] 王小明, “基于图神经网络的分子性质预测研究,” 博士学位论文, 某某大学, 北京, 2023.",
    "[7] Zotero, “Zotero Style Repository.” Accessed: May 01, 2024. [Online]. Available: https://www.zotero.org/styles"
   ],
   "cites": {
    "lecun2015deep": "[1]",
    "vaswani2017attention": "[2]",
    "goodfellow2016deep": "[3]",
    "zhou2016ml": "[4]",
    "li2019slm": "[5]",
    "wang2023gnn": "[6]",
    "zotero-styles": "[7]"
   },
   "clusters": [
    "[1], [2], [3]",
    "[4], [5]"
   ]
  },
  "mla": {
   "ids": [
    "goodfellow2016deep",
    "lecun2015deep",
    "vaswani2017attention",
    "zotero-styles",
    "zhou2016ml",
    "li2019slm",
    "wang2023gnn"
   ],
   "bib": [
    "Goodfellow, Ian, et al. Deep Learning. MIT Press, 2016.",
    "LeCun, Yann, et al. “Deep Learning.” Nature, vol. 521, no. 7553, 2015, pp. 436–44, https://doi.org/10.1038/nature14539.",
    "Vaswani, Ashish, et al. “Attention Is All You Need.” Advances in Neural Information Processing Systems 30 [Red Hook, NY], 2017, pp. 5998–6008.",
    "Zotero. Zotero Style Repository. https://www.zotero.org/styles. Accessed 1 May 2024.",
    "周志华. 机器学习. 1st ed., 清华大学出版社, 2016.",
    "李航. 统计学习方法. 2nd ed., 清华大学出版社, 2019.",
    "王小明. 基于图神经网络的分子性质预测研究. 2023. 某某大学, 博士学位论文."
   ],
   "html": [
    "Goodfellow, Ian, et al. <i>Deep Learning</i>. MIT Press, 2016.",
    "LeCun, Yann, et al. “Deep Learning.” <i>Nature</i>, vol. 521, no. 7553, 2015, pp. 436–44, https://doi.org/10.1038/nature14539.",
    "Vaswani, Ashish, et al. “Attention Is All You Need.” <i>Advances in Neural Information Processing Systems 30</i> [Red Hook, NY], 2017, pp. 5998–6008.",
    "Zotero. <i>Zotero Style Repository</i>. https://www.zotero.org/styles. Accessed 1 May 2024.",
    "周志华. 机器学习. 1st ed., 清华大学出版社, 2016.",
    "李航. 统计学习方法. 2nd ed., 清华大学出版社, 2019.",
    "王小明. 基于图神经网络的分子性质预测研究. 2023. 某某大学, 博士学位论文."
   ],
   "cites": {
    "goodfellow2016deep": "(Goodfellow et al.)",
    "lecun2015deep": "(LeCun et al.)",
    "vaswani2017attention": "(Vaswani et al.)",
    "zotero-styles": "(Zotero)",
    "zhou2016ml": "(周志华)",
    "li2019slm": "(李航)",
    "wang2023gnn": "(王小明)"
   },
   "clusters": [
    "(LeCun et al.; Vaswani et al.; Goodfellow et al.)",
    "(李航; 周志华)"
   ]
  }
 },
 "text": {
  "n": 5,
  "label": "已排好的参考文献文本",
  "errors": 1,
  "warnings": 3,
  "warnMsgs": [
   "第 3 条：GB/T 7714 规定超过 3 位作者时只列前 3 位，后加「等 / et al.」",
   "第 5 条：中文文献应写「等」而不是「et al.」",
   "第 5 条：用了「等 / et al.」时应列出前 3 位作者（现在是 1 位）"
  ],
  "errMsgs": [
   "第 4 条：缺少文献类型标识（如 [J] [M] [D]），已按结构猜测为 [M]"
  ],
  "gbt": [
   "[1] LECUN Y, BENGIO Y, HINTON G. Deep learning[J]. Nature, 2015, 521(7553): 436-444.",
   "[2] 周志华. 机器学习[M]. 北京: 清华大学出版社, 2016.",
   "[3] VASWANI A, SHAZEER N, PARMAR N, et al. Attention is all you need[C]//Advances in Neural Information Processing Systems 30. Red Hook, NY: Curran Associates, 2017: 5998-6008.",
   "[4] 李航. 统计学习方法[M]. 2 版. 北京: 清华大学出版社, 2019.",
   "[5] 王小明等. 基于图神经网络的分子性质预测研究[D]. 北京: 某某大学, 2023."
  ],
  "ext": [
   4
  ],
  "lint": {
   "error": 0,
   "warn": 0,
   "info": 1,
   "fix": 0
  }
 },
 "endnote": {
  "n": 2,
  "label": "EndNote（知网 / 万方导出）"
 },
 "ris": {
  "n": 2,
  "label": "RIS"
 },
 "manual": {
  "item": {
   "id": "m1",
   "type": "article-journal",
   "title": "图神经网络综述",
   "author": [
    {
     "family": "张三"
    },
    {
     "family": "李四"
    }
   ],
   "container-title": "计算机学报",
   "volume": "44",
   "issue": "2",
   "page": "101-125",
   "issued": {
    "date-parts": [
     [
      2021
     ]
    ]
   },
   "language": "zh-CN"
  },
  "gbt": "[1] 张三, 李四. 图神经网络综述[J]. 计算机学报, 2021, 44(2): 101-125.",
  "apa": "张三, & 李四. (2021). 图神经网络综述. 计算机学报, 44(2), 101–125."
 },
 "mini": {
  "xml": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<style xmlns=\"http://purl.org/net/xbiblio/csl\" class=\"in-text\" version=\"1.0\" default-locale=\"en-US\">\n<info><title>Mini Author-Date</title><id>http://example.org/styles/mini</id><updated>2026-10-25T00:00:00+00:00</updated></info>\n<citation><layout prefix=\"(\" suffix=\")\" delimiter=\"; \"><group delimiter=\", \"><names variable=\"author\"><name form=\"short\" and=\"symbol\"/></names><date variable=\"issued\"><date-part name=\"year\"/></date></group></layout></citation>\n<bibliography><sort><key variable=\"author\"/><key variable=\"issued\"/></sort><layout suffix=\".\"><group delimiter=\". \"><names variable=\"author\"><name name-as-sort-order=\"all\" and=\"text\" delimiter=\", \" initialize-with=\". \"/></names><date variable=\"issued\" prefix=\"(\" suffix=\")\"><date-part name=\"year\"/></date><text variable=\"title\" font-style=\"italic\"/><text variable=\"publisher\"/></group></layout></bibliography>\n</style>\n",
  "bib": [
   "Lecun, Y., Bengio, Y., and Hinton, G. (2015). Deep learning.",
   "Vaswani, A., Shazeer, N., Parmar, N., and Uszkoreit, J. (2017). Attention is all you need. Curran Associates.",
   "周志华. (2016). 机器学习. 清华大学出版社.",
   "李航. (2019). 统计学习方法. 清华大学出版社.",
   "王小明 et al. (2023). 基于图神经网络的分子性质预测研究. 某某大学."
  ],
  "title": "Mini Author-Date"
 },
 "acc": {
  "gbt-numeric": "参考文献 1284/1284 · 文内引注 1374/1374",
  "gbt-author-date": "参考文献 1282/1284 · 文内引注 1368/1374",
  "apa": "参考文献 1284/1284 · 文内引注 1372/1374",
  "ieee": "参考文献 1284/1284 · 文内引注 1374/1374",
  "mla": "参考文献 1284/1284 · 文内引注 1368/1374"
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim()
  const T = { timeout: 10000 }
  const onTab = async (t) => {
    await page.click(`#cs-tab-${t}`)
    await page.waitForFunction((id) => !document.getElementById(id).hidden, `cs-pane-${t}`, T)
  }
  const entries = () => page.$$eval('#cs-bib .cs-entry', (els) => els.map((e) => e.textContent))
  const pickStyle = async (id, label) => {
    await page.click(`#cs-style-${id}`)
    await page.waitForFunction(([i, l]) => document.querySelector(`#cs-style-${i}`).getAttribute('aria-pressed') === 'true'
      && document.querySelector('#cs-bib-title').textContent.indexOf(l) >= 0, [id, label], T)
  }

  await page.goto(toolURL)
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  // 1) 首屏：导入页，别的面板真的藏住了（断计算样式）
  assert(await page.isVisible('#cs-pane-import'), '首屏应是导入页')
  const hiddenDisp = await page.$$eval('main > section[hidden]', (ns) => ns.map((n) => getComputedStyle(n).display))
  assert(hiddenDisp.length === 5 && hiddenDisp.every((d) => d === 'none'), `其余 5 个面板应 display:none，实得 ${hiddenDisp}`)
  assert(await page.textContent('.cs-back') === '← 返回工具集', '顶部有返回链接')

  // 2) BibTeX 示例 → 解析预览
  await page.click('#cs-sample-bib')
  await page.waitForFunction((n) => document.querySelector('#cs-r-n').textContent === String(n), ORACLE.sample.n, T)
  assert((await page.textContent('#cs-r-fmt')).indexOf(ORACLE.sample.format) >= 0, `识别格式应为 ${ORACLE.sample.format}`)
  const prevTitles = await page.$$eval('#cs-preview .cs-row-title', (els) => els.map((e) => e.textContent))
  assert(prevTitles.length === ORACLE.sample.n, `预览应有 ${ORACLE.sample.n} 行，实得 ${prevTitles.length}`)
  assert(norm(prevTitles[0]) === norm(ORACLE.sample.titles[0]), `第一条题名 ${prevTitles[0]}`)

  // 3) 加入文献库 → 立刻刷新（防抖写盘要在离页时补写）
  await page.click('#cs-add')
  await page.waitForFunction((n) => document.querySelectorAll('#cs-bib li').length === n, ORACLE.sample.n, T)
  await page.reload()
  await page.waitForFunction((n) => document.querySelector('#cs-count').textContent === String(n), ORACLE.sample.n, T)
  assert(await page.isVisible('#cs-pane-bib'), '库里有文献时首屏直接进参考文献表')

  // 4) 五个内置样式：参考文献表与每条的文内引注逐字等于 citeproc-js
  const LABEL = { 'gbt-numeric': '顺序编码制', 'gbt-author-date': '著者-出版年制', apa: 'APA', ieee: 'IEEE', mla: 'MLA' }
  for (const sid of ORACLE.meta.styles) {
    await pickStyle(sid, LABEL[sid])
    const want = ORACLE.styles[sid]
    const got = await entries()
    assert(got.length === want.bib.length, `${sid} 条数 ${got.length} ≠ ${want.bib.length}`)
    got.forEach((g, i) => assert(norm(g) === norm(want.bib[i]), `${sid} 第 ${i + 1} 条\n   期望 ${want.bib[i]}\n   实得 ${norm(g)}`))
    // 斜体 / 粗体 / 上下标的位置也要与 citeproc-js 一致（只比 <i> <b> <sup> <sub>）
    const gotH = await page.$$eval('#cs-bib .cs-entry', (els) => els.map((e) => e.innerHTML))
    const keep = (h) => h.replace(/<(?!\/?(?:i|b|sup|sub)>)[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
    gotH.forEach((h, i) => assert(keep(h) === want.html[i], `${sid} 第 ${i + 1} 条的格式标记\n   期望 ${want.html[i]}\n   实得 ${keep(h)}`))
    const ids = await page.$$eval('#cs-bib li', (ls) => ls.map((l) => l.getAttribute('data-id')))
    assert(ids.join() === want.ids.join(), `${sid} 排序 ${ids} ≠ ${want.ids}`)
    const cites = await page.$$eval('#cs-bib li', (ls) => ls.map((l) => [l.getAttribute('data-id'), l.querySelector('.cs-cite').textContent]))
    cites.forEach(([id, c]) => assert(norm(c) === norm(want.cites[id]), `${sid} ${id} 文内引注 ${c} ≠ ${want.cites[id]}`))
    // 引注组合：勾选前三条
    const cl = ORACLE.sample.ids.slice(0, 3)
    for (const id of ORACLE.sample.ids) {
      const box = `#cs-bib input[data-pick="${id}"]`
      const want1 = cl.indexOf(id) >= 0
      if ((await page.isChecked(box)) !== want1) await page.click(box)
    }
    await page.waitForFunction((w) => document.querySelector('#cs-cluster').textContent.replace(/\s+/g, ' ').trim() === w.replace(/\s+/g, ' ').trim(), want.clusters[0], T)
    // 纯文本区与列表一致
    const plain = (await page.inputValue('#cs-plain')).split('\n')
    assert(plain.length === want.bib.length && norm(plain[0]) === norm(want.bib[0]), `${sid} 纯文本第一行 ${plain[0]}`)
  }
  // GB/T 的多语言：西文 et al.、中文「等」都在
  await pickStyle('gbt-numeric', '顺序编码制')
  const gb = (await entries()).join('\n')
  assert(/et al\./.test(gb) && !/等\./.test(gb.split('\n')[1]), 'GB/T 西文文献应用 et al.')
  // 斜体：IEEE 的刊名是 <i>，纯中文串不加斜体（citeproc 同口径）
  await pickStyle('ieee', 'IEEE')
  const ieeeHtml = await page.$$eval('#cs-bib .cs-entry', (els) => els.map((e) => e.innerHTML))
  assert(/<i>Nature<\/i>/.test(ieeeHtml[0]), 'IEEE 刊名应斜体')
  await pickStyle('gbt-numeric', '顺序编码制')

  // 5) 键盘切页签
  await page.focus('#cs-tab-bib')
  await page.keyboard.press('ArrowRight')
  await page.waitForFunction(() => document.querySelector('#cs-tab-lint').getAttribute('aria-selected') === 'true' && document.activeElement.id === 'cs-tab-lint', null, T)

  // 6) 体检：计数 = 引擎算的；修掉「第 1 版」后少一条，GB/T 输出随之更新
  const L = ORACLE.sample.lint
  await page.waitForFunction((l) => document.querySelector('#cs-l-warn').textContent === String(l.warn) && document.querySelector('#cs-l-err').textContent === String(l.error)
    && document.querySelector('#cs-l-fix').textContent === String(l.fix), L, T)
  const fixBtn = await page.$('#cs-lint button[data-code="edition-1"]')
  assert(fixBtn, '应有「删掉版本」的修复按钮')
  await fixBtn.click()
  await page.waitForFunction((w) => document.querySelector('#cs-l-warn').textContent === String(w), L.warn - 1, T)
  await onTab('bib')
  const afterFix = await entries()
  assert(norm(afterFix[3]) === norm(ORACLE.sample.afterFix[3]), `修复后第 4 条应为 ${ORACLE.sample.afterFix[3]}，实得 ${afterFix[3]}`)

  // 7) 编辑器：手工新建一条中文期刊文章
  await onTab('library')
  await page.click('#cs-new')
  await page.waitForFunction(() => !document.querySelector('#cs-editor').hidden, null, T)
  const M = ORACLE.manual.item
  await page.selectOption('#cs-ed-type', M.type)
  await page.fill('#cs-ed-title-in', M.title)
  await page.fill('#cs-ed-author', M.author.map((a) => a.family).join('\n'))
  await page.fill('#cs-ed-container', M['container-title'])
  await page.fill('#cs-ed-volume', M.volume)
  await page.fill('#cs-ed-issue', M.issue)
  await page.fill('#cs-ed-page', M.page)
  await page.fill('#cs-ed-year', String(M.issued['date-parts'][0][0]))
  await page.waitForFunction((w) => document.querySelector('#cs-ed-preview').textContent.replace(/\s+/g, ' ').trim() === '预览：' + w, ORACLE.manual.gbt, T)
  await page.click('#cs-ed-save')
  await page.waitForFunction((n) => document.querySelector('#cs-count').textContent === String(n), ORACLE.sample.n + 1, T)
  const rows = await page.$$eval('#cs-lib .cs-row-title', (els) => els.map((e) => e.textContent))
  assert(rows[rows.length - 1] === M.title, '新条目排在库末尾')
  // 上移一位
  const lastId = await page.$eval('#cs-lib .cs-row:last-child', (e) => e.getAttribute('data-id'))
  await page.click(`#cs-lib button[data-act="up"][data-id="${lastId}"]`)
  await page.waitForFunction((id) => document.querySelector('#cs-lib .cs-row:nth-last-child(2)').getAttribute('data-id') === id, lastId, T)
  await onTab('bib')
  await pickStyle('apa', 'APA')
  const apaAll = (await entries()).map(norm)
  assert(apaAll.indexOf(norm(ORACLE.manual.apa)) >= 0, `APA 里应有手工条目：${ORACLE.manual.apa}`)
  await pickStyle('gbt-numeric', '顺序编码制')
  const gbAll = (await entries()).map(norm)
  assert(gbAll[ORACLE.sample.n - 1] === norm(ORACLE.manual.gbt.replace(/^\[1\]/, '[' + ORACLE.sample.n + ']')), `上移后手工条目应编号 ${ORACLE.sample.n}：${gbAll[ORACLE.sample.n - 1]}`)

  // 8) 已排好的文本 → 反解析 → 替换文献库 → 重新排版
  await onTab('import')
  await page.click('#cs-sample-text')
  await page.waitForFunction((n) => document.querySelector('#cs-r-n').textContent === String(n), ORACLE.text.n, T)
  assert(await page.textContent('#cs-r-warn') === String(ORACLE.text.warnings), `文本示例的格式提醒应为 ${ORACLE.text.warnings}`)
  assert(await page.textContent('#cs-r-err') === String(ORACLE.text.errors), `文本示例的错误应为 ${ORACLE.text.errors}`)
  const msgs = await page.$$eval('#cs-r-msgs li', (ls) => ls.map((l) => l.textContent))
  ORACLE.text.errMsgs.concat(ORACLE.text.warnMsgs).forEach((m) => assert(msgs.some((x) => x.indexOf(m) >= 0), `缺少提示：${m}`))
  await page.click('#cs-replace')
  await page.waitForFunction((n) => document.querySelectorAll('#cs-bib li').length === n, ORACLE.text.n, T)
  const tx = await entries()
  tx.forEach((g, i) => assert(norm(g) === norm(ORACLE.text.gbt[i]), `文本示例第 ${i + 1} 条\n   期望 ${ORACLE.text.gbt[i]}\n   实得 ${norm(g)}`))

  // 9) EndNote / RIS 示例
  await onTab('import')
  await page.click('#cs-sample-en')
  await page.waitForFunction((o) => document.querySelector('#cs-r-n').textContent === String(o.n) && document.querySelector('#cs-r-fmt').textContent.indexOf(o.label) >= 0, ORACLE.endnote, T)
  await page.click('#cs-sample-ris')
  await page.waitForFunction((o) => document.querySelector('#cs-r-n').textContent === String(o.n) && document.querySelector('#cs-r-fmt').textContent.indexOf(o.label) >= 0, ORACLE.ris, T)
  // 坏输入：只报错，不崩
  await page.fill('#cs-src', '@article{broken, title = {Unclosed')
  await page.waitForFunction(() => document.querySelector('#cs-r-err').textContent !== '0', null, T)
  assert(await page.isDisabled('#cs-add'), '没解析出条目时「加入」应禁用')

  // 10) 自定义 CSL 样式：粘贴 → 选中 → 输出与 citeproc-js 一致
  await onTab('style')
  await page.fill('#cs-csl', ORACLE.mini.xml)
  await page.click('#cs-csl-add')
  await page.waitForFunction(() => /已添加/.test(document.querySelector('#cs-csl-msg').textContent), null, T)
  await onTab('bib')
  await page.waitForFunction((t) => document.querySelector('#cs-bib-title').textContent.indexOf(t) >= 0, ORACLE.mini.title, T)
  const mini = await entries()
  mini.forEach((g, i) => assert(norm(g) === norm(ORACLE.mini.bib[i]), `自定义样式第 ${i + 1} 条\n   期望 ${ORACLE.mini.bib[i]}\n   实得 ${norm(g)}`))
  await onTab('style')
  await page.fill('#cs-csl', '<style><citation></style>')
  await page.click('#cs-csl-add')
  await page.waitForFunction(() => /没加上/.test(document.querySelector('#cs-csl-msg').textContent), null, T)

  // 11) 导出再导入：BibTeX / RIS / CSL-JSON 都能读回同样的条目数与题名
  const titlesNow = await page.evaluate(() => window.__cs.state.items.map((i) => i.title))
  for (const k of ['bib', 'ris', 'json']) {
    await page.click(`#cs-ex-${k}`)
    const out = await page.inputValue('#cs-export')
    const back = await page.evaluate((s) => CiteEngine.parseAny(s, 'auto').items.map((i) => i.title.replace(/<[^>]+>/g, '')), out)
    assert(back.length === titlesNow.length, `${k} 导出再读回条数 ${back.length} ≠ ${titlesNow.length}`)
    back.forEach((t, i) => assert(t === titlesNow[i].replace(/<[^>]+>/g, ''), `${k} 读回第 ${i + 1} 条题名 ${t}`))
  }

  // 11b) 说明页公布的一致率 = 离线对拍实测值（钉死字面量，改任何一行都会红）
  await onTab('help')
  const accRows = await page.$$eval('#cs-help-styles tbody tr', (rs) => rs.map((r) => [r.cells[0].textContent, r.cells[2].textContent]))
  assert(accRows.length === 5, `说明页应列 5 个内置样式，实得 ${accRows.length}`)
  const accWant = ORACLE.meta.styles.map((id) => ORACLE.acc[id])
  accRows.forEach(([name, v], i) => assert(v === accWant[i], `说明页「${name}」一致率 ${v} ≠ ${accWant[i]}`))
  assert(accWant[0] === '参考文献 1284/1284 · 文内引注 1374/1374', `GB/T 顺序编码制的一致率应为离线实测的 1284/1284 · 1374/1374，实得 ${accWant[0]}`)

  // 12) 渲染守卫：逐页签控件尺寸 / text-transform / 逐视口横向溢出 / 行内元素不越出 / id 唯一
  const nControls = await renderGuards(page, {
    assert, tabs: ORACLE.meta.tabs, onTab,
    paneSel: (t) => `#cs-pane-${t}`, panesRoot: 'main',
    figSel: () => '#cs-none svg', cardSel: '.cs-row, .cs-bib li, .cs-cluster', childSel: 'p,div,span,button',
    minControls: 40, minTextsInFig: 0, viewports: [390, 768, 1280]
  })
  assert(nControls >= 40, `应扫到 ≥40 个控件，实得 ${nControls}`)
  // 窄屏下页签文字不许溢出自己的按钮（flex 收缩会把文字挤到相邻页签上，DOM 尺寸守卫看不出来）
  for (const vw of [390, 768]) {
    await page.setViewportSize({ width: vw, height: 844 })
    const spill = await page.$$eval('.cs-tab, .cs-style, .cs-btn', (bs) => bs.filter((b) => b.getBoundingClientRect().width > 0 && b.scrollWidth > b.clientWidth + 1).map((b) => `${b.id || b.textContent.trim()} ${b.scrollWidth}>${b.clientWidth}`))
    assert(spill.length === 0, `视口 ${vw} 下按钮文字溢出：${spill.slice(0, 5).join('；')}`)
  }
  await page.setViewportSize({ width: 1280, height: 850 })

  // 13) 缩略图：示例文献 + GB/T 顺序编码制（离页补写会把当前库写回，所以直接用「替换文献库」）
  await page.reload()
  await onTab('import')
  await page.click('#cs-sample-bib')
  await page.waitForFunction((n) => document.querySelector('#cs-r-n').textContent === String(n), ORACLE.sample.n, T)
  await page.click('#cs-replace')
  await page.waitForFunction((n) => document.querySelectorAll('#cs-bib li').length === n, ORACLE.sample.n, T)
  await pickStyle('gbt-numeric', '顺序编码制')
  await page.click(`#cs-bib input[data-pick="${ORACLE.sample.ids[0]}"]`)
  await page.click(`#cs-bib input[data-pick="${ORACLE.sample.ids[1]}"]`)
  await page.waitForFunction(() => document.querySelector('#cs-cluster').textContent.trim() !== '—', null, T)
  await page.evaluate(() => { document.getElementById('cs-toast').hidden = true })
  await screenshot('thumb.png')
}
