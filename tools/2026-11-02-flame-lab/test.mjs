// 火焰图工作台 · 集成测试（真实 Chromium）
// 真值一律来自 ORACLE：go tool pprof（-top / -peek / -diff_base / -lines / -focus / -ignore / -hide）、Google pprof 官方 profile 包、
// FlameGraph 的 stackcollapse-perf.pl / flamegraph.pl、V8 写进 cpuprofile 的 hitCount —— 由 truth/gen_truth.mjs 现场算出，
// inject-oracle.mjs 机械注入，不手抄。
import { guardHidden, guardControlSize, guardTextTransform, guardOverflow, guardEscape, guardUniqueIds } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const ORACLE = {
 "meta": {
  "tabs": [
   "flame",
   "top",
   "sandwich",
   "diff",
   "timeline",
   "lib",
   "about"
  ],
  "src": "go tool pprof（Go 1.25.6）/ google pprof profile 包 / FlameGraph perl 脚本现场输出；见 truth/gen_truth.mjs"
 },
 "goBefore": {
  "types": [
   [
    "samples",
    "count"
   ],
   [
    "cpu",
    "nanoseconds"
   ]
  ],
  "def": 1,
  "totals": [
   259,
   2590000000
  ],
  "samples": 169,
  "folded": "runtime.bgsweep;runtime.sweepone;runtime.(*sweepLocked).sweep;runtime.(*mheap).freeSpan;runtime.systemstack;runtime.(*sweepLocked).sweep.(*mheap).freeSpan.func3;runtime.(*mheap).freeSpanLocked 10000000\nruntime.bgsweep;runtime.sweepone;runtime.(*sweepLocked).sweep;runtime.(*mheap).freeSpan;runtime.systemstack;runtime.(*sweepLocked).sweep.(*mheap).freeSpan.func3;runtime.(*mheap).freeSpanLocked;runtime.(*sysMemStat).add 10000000\nruntime.gcBgMarkWorker;runtime.acquirem 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.mapEncoder.encode;encoding/json.interfaceEncoder;encoding/json.(*encodeState).reflectValue;encoding/json.stringEncoder;encoding/json.appendString[go.shape.string] 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.mapEncoder.encode;encoding/json.interfaceEncoder;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.mapEncoder.encode;reflect.(*MapIter).Value;reflect.copyVal;reflect.unsafe_New;runtime.mallocgc;runtime.mallocgcSmallScanNoHeader;runtime.profilealloc;runtime.mProf_Malloc;runtime.stkbucket;runtime.newBucket 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.mapEncoder.encode;encoding/json.interfaceEncoder;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode 20000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.mapEncoder.encode;encoding/json.interfaceEncoder;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;bytes.(*Buffer).WriteString 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.mapEncoder.encode;encoding/json.interfaceEncoder;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;encoding/json.floatEncoder.encode 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.mapEncoder.encode;encoding/json.interfaceEncoder;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;encoding/json.floatEncoder.encode;strconv.AppendFloat;strconv.genericFtoa;strconv.ryuFtoaShortest 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.mapEncoder.encode;encoding/json.interfaceEncoder;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;encoding/json.stringEncoder;bytes.(*Buffer).Write 20000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.mapEncoder.encode;encoding/json.interfaceEncoder;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;encoding/json.stringEncoder;encoding/json.appendString[go.shape.string];unicode/utf8.DecodeRuneInString 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.mapEncoder.encode;encoding/json.interfaceEncoder;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;reflect.Value.Field;internal/abi.Name.IsExported 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.mapEncoder.encode;runtime.makeslice;runtime.mallocgc;runtime.mallocgcSmallScanNoHeader;runtime.heapSetTypeNoHeader;runtime.(*mspan).writeHeapBitsSmall 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.mapEncoder.encode;runtime.makeslice;runtime.mallocgc;runtime.mallocgcSmallScanNoHeader;runtime.profilealloc;runtime.mProf_Malloc;runtime.stkbucket;runtime.newBucket 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.mapEncoder.encode;reflect.(*MapIter).Key;reflect.copyVal 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.mapEncoder.encode;reflect.(*MapIter).Value;reflect.copyVal;reflect.typedmemmove 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode 20000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;bytes.(*Buffer).WriteByte;bytes.(*Buffer).tryGrowByReslice 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;encoding/json.floatEncoder.encode;bytes.(*Buffer).Write;bytes.(*Buffer).tryGrowByReslice 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;encoding/json.floatEncoder.encode;math.IsInf 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;encoding/json.floatEncoder.encode;strconv.AppendFloat;strconv.genericFtoa;strconv.formatDigits;strconv.fmtF 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;encoding/json.floatEncoder.encode;strconv.AppendFloat;strconv.genericFtoa;strconv.formatDigits;strconv.fmtF;runtime.memmove 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;encoding/json.floatEncoder.encode;strconv.AppendFloat;strconv.genericFtoa;strconv.ryuFtoaShortest;strconv.ryuDigits 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;encoding/json.stringEncoder;encoding/json.appendString[go.shape.string] 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;sync.(*Pool).Put 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate 90000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).findMatch 20000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).findMatch;compress/flate.matchLen 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).dynamicSize;compress/flate.(*huffmanEncoder).bitLength 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).generateCodegen 30000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens 20000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*byFreq).sort;sort.Sort;sort.pdqsort;sort.choosePivot;sort.median;sort.order2 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*byFreq).sort;sort.Sort;sort.pdqsort;sort.insertionSort 20000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*byFreq).sort;sort.Sort;sort.pdqsort;sort.partition 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*byFreq).sort;sort.Sort;sort.pdqsort;sort.pdqsort;sort.insertionSort 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*byFreq).sort;sort.Sort;sort.pdqsort;sort.pdqsort;sort.partition;compress/flate.byFreq.Less 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*byFreq).sort;sort.Sort;sort.pdqsort;sort.pdqsort;sort.pdqsort;sort.insertionSort 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*huffmanEncoder).assignEncodingAndSize;compress/flate.(*byLiteral).sort;sort.Sort;sort.pdqsort;sort.insertionSort 20000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*huffmanEncoder).assignEncodingAndSize;compress/flate.(*byLiteral).sort;sort.Sort;sort.pdqsort;sort.partition 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*huffmanEncoder).assignEncodingAndSize;compress/flate.(*byLiteral).sort;sort.Sort;sort.pdqsort;sort.pdqsort;sort.insertionSort 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*huffmanEncoder).bitCounts 150000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;runtime.makeslice;runtime.mallocgc;runtime.mallocgcSmallNoscan;runtime.profilealloc;runtime.mProf_Malloc;runtime.systemstack;runtime.mProf_Malloc.func1;runtime.setprofilebucket;runtime.(*fixalloc).alloc;runtime.memclrNoHeapPointers 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).writeTokens;compress/flate.(*huffmanBitWriter).writeCode 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).writeTokens;compress/flate.token.offset 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanEncoder).generate;compress/flate.(*huffmanEncoder).bitCounts 30000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;compress/flate.(*compressor).init;compress/flate.(*compressor).initDeflate;runtime.makeslice;runtime.mallocgc;runtime.deductAssistCredit;runtime.gcAssistAlloc;runtime.systemstack;runtime.gcAssistAlloc.func2;runtime.gcAssistAlloc1;runtime.gcDrainN;runtime.markroot;runtime.markrootSpans 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;compress/flate.(*compressor).init;compress/flate.(*compressor).initDeflate;runtime.makeslice;runtime.mallocgc;runtime.deductAssistCredit;runtime.gcAssistAlloc;runtime.systemstack;runtime.gcAssistAlloc.func2;runtime.gcAssistAlloc1;runtime.gcDrainN;runtime.markroot;runtime.markrootSpans;runtime.unlock;runtime.unlockWithRank;runtime.unlock2 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;compress/flate.(*compressor).init;compress/flate.(*compressor).initDeflate;runtime.makeslice;runtime.mallocgc;runtime.mallocgcLarge;runtime.(*mcache).allocLarge;runtime.(*mheap).alloc;runtime.systemstack;runtime.(*mheap).alloc.func1;runtime.(*mheap).allocSpan;runtime.(*mheap).initSpan;runtime.(*mspan).init 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;compress/flate.(*compressor).init;compress/flate.(*compressor).initDeflate;runtime.makeslice;runtime.mallocgc;runtime.mallocgcLarge;runtime.(*mcache).allocLarge;runtime.(*mheap).alloc;runtime.systemstack;runtime.(*mheap).alloc.func1;runtime.(*mheap).allocSpan;runtime.(*pageAlloc).alloc;runtime.(*pageAlloc).find;runtime.(*pallocBits).find;runtime.(*pallocBits).findSmallN 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;compress/flate.(*compressor).init;compress/flate.(*compressor).initDeflate;runtime.makeslice;runtime.mallocgc;runtime.mallocgcLarge;runtime.memclrNoHeapPointersChunked;runtime.memclrNoHeapPointers 40000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;compress/flate.(*compressor).init;compress/flate.(*compressor).initDeflate;runtime.makeslice;runtime.mallocgc;runtime.mallocgcLarge;runtime.profilealloc;runtime.mProf_Malloc;runtime.callers;runtime.systemstack;runtime.callers.func1;runtime.(*unwinder).initAt;runtime.(*unwinder).resolveInternal;runtime.funcspdelta;runtime.pcvalue 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;compress/flate.(*compressor).init;compress/flate.(*compressor).initDeflate;runtime.makeslice;runtime.mallocgc;runtime.mallocgcLarge;runtime.profilealloc;runtime.mProf_Malloc;runtime.callers;runtime.systemstack;runtime.callers.func1;runtime.tracebackPCs;runtime.(*unwinder).next;runtime.findfunc 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;compress/flate.(*compressor).init;compress/flate.(*compressor).initDeflate;runtime.makeslice;runtime.mallocgc;runtime.mallocgcLarge;runtime.profilealloc;runtime.mProf_Malloc;runtime.callers;runtime.systemstack;runtime.callers.func1;runtime.tracebackPCs;runtime.newInlineUnwinder;runtime.(*inlineUnwinder).resolveInternal;runtime.pcdatavalue1;runtime.pcvalue;runtime.step 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;compress/flate.(*compressor).init;compress/flate.(*compressor).initDeflate;runtime.makeslice;runtime.mallocgc;runtime.mallocgcLarge;runtime.releasem 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;compress/flate.(*compressor).init;compress/flate.newHuffmanBitWriter;compress/flate.newHuffmanEncoder;runtime.newobject;runtime.mallocgc;runtime.mallocgcSmallScanNoHeader;runtime.(*mcache).nextFree;runtime.(*mcache).refill;runtime.(*mcentral).cacheSpan;runtime.deductSweepCredit;runtime.sweepone;runtime.(*sweepLocked).sweep;runtime.freeSpecial;runtime.lock;runtime.lockWithRank;runtime.lock2 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;runtime.newobject;runtime.mallocgc;runtime.deductAssistCredit;runtime.gcAssistAlloc;runtime.systemstack;runtime.gcAssistAlloc.func2;runtime.gcAssistAlloc1;runtime.gcDrainN;runtime.markroot;runtime.markroot.func1;runtime.scanstack;runtime.(*unwinder).next;runtime.(*unwinder).resolveInternal;runtime.funcspdelta;runtime.pcvalue;runtime.funcInfo.entry 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;runtime.newobject;runtime.mallocgc;runtime.deductAssistCredit;runtime.gcAssistAlloc;runtime.systemstack;runtime.gcAssistAlloc.func2;runtime.gcAssistAlloc1;runtime.gcDrainN;runtime.markroot;runtime.markrootSpans 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;runtime.newobject;runtime.mallocgc;runtime.deductAssistCredit;runtime.gcAssistAlloc;runtime.systemstack;runtime.gcAssistAlloc.func2;runtime.gcAssistAlloc1;runtime.gcDrainN;runtime.markroot;runtime.markrootSpans;runtime.unlock;runtime.unlockWithRank;runtime.unlock2 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;runtime.newobject;runtime.mallocgc;runtime.deductAssistCredit;runtime.gcAssistAlloc;runtime.systemstack;runtime.gcAssistAlloc.func2;runtime.gcAssistAlloc1;runtime.gcDrainN;runtime.markroot;runtime.markrootSpans;runtime.unlock;runtime.unlockWithRank;runtime.unlock2;runtime.mutexSampleContention 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;runtime.newobject;runtime.mallocgc;runtime.mallocgcLarge;runtime.(*mcache).allocLarge;runtime.deductSweepCredit;runtime.sweepone;runtime.(*sweepLocked).sweep;runtime.(*mheap).freeSpan;runtime.systemstack;runtime.(*sweepLocked).sweep.(*mheap).freeSpan.func3;runtime.(*mheap).freeSpanLocked;runtime.(*pageAlloc).free;runtime.(*pallocBits).free;runtime.(*pageBits).clearRange 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;runtime.newobject;runtime.mallocgc;runtime.mallocgcLarge;runtime.memclrNoHeapPointersChunked 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;runtime.newobject;runtime.mallocgc;runtime.mallocgcLarge;runtime.memclrNoHeapPointersChunked;runtime.memclrNoHeapPointers 240000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;runtime.newobject;runtime.mallocgc;runtime.mallocgcLarge;runtime.profilealloc;runtime.mProf_Malloc;runtime.callers;runtime.systemstack;runtime.callers.func1;runtime.tracebackPCs;runtime.(*inlineUnwinder).next;runtime.(*inlineUnwinder).resolveInternal;runtime.pcdatavalue1;runtime.pcvalue;runtime.funcInfo.entry;runtime.(*moduledata).textAddr 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;runtime.newobject;runtime.mallocgc;runtime.mallocgcLarge;runtime.profilealloc;runtime.mProf_Malloc;runtime.callers;runtime.systemstack;runtime.callers.func1;runtime.tracebackPCs;runtime.(*unwinder).next;runtime.(*unwinder).resolveInternal 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;runtime.newobject;runtime.mallocgc;runtime.mallocgcLarge;runtime.profilealloc;runtime.mProf_Malloc;runtime.callers;runtime.systemstack;runtime.callers.func1;runtime.tracebackPCs;runtime.(*unwinder).next;runtime.(*unwinder).resolveInternal;runtime.funcspdelta;runtime.pcvalue 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;compress/flate.NewWriter;runtime.newobject;runtime.mallocgc;runtime.mallocgcLarge;runtime.profilealloc;runtime.mProf_Malloc;runtime.callers;runtime.systemstack;runtime.callers.func1;runtime.tracebackPCs;runtime.(*unwinder).next;runtime.(*unwinder).resolveInternal;runtime.funcspdelta;runtime.pcvalue;runtime.step;runtime.readvarint 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;hash/crc32.Update;hash/crc32.update;hash/crc32.archUpdateIEEE 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.NewWriterLevel 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).scanWhile;encoding/json.stateBeginValue 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).scanWhile 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object 20000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).rescanLiteral;encoding/json.stateEndValue 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).scanWhile 20000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore;encoding/json.indirect;reflect.(*rtype).Name 30000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore;encoding/json.indirect;reflect.(*rtype).Name;reflect.(*rtype).String;reflect.(*rtype).nameOff;reflect.resolveNameOff;runtime.resolveNameOff 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore;encoding/json.indirect;reflect.Value.Addr;reflect.ptrTo;reflect.(*rtype).ptrTo;reflect.(*rtype).typeOff;reflect.resolveTypeOff 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore;encoding/json.indirect;reflect.Value.Addr;reflect.ptrTo;reflect.(*rtype).ptrTo;reflect.(*rtype).typeOff;reflect.resolveTypeOff;runtime.rtype.typeOff;runtime.resolveTypeOff;runtime.mapaccess1_fast32 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore;encoding/json.unquoteBytes 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore;encoding/json.unquoteBytes;unicode/utf8.DecodeRune 20000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).rescanLiteral 20000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;runtime.growslice;runtime.mallocgc;runtime.mallocgcSmallScanNoHeader 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;runtime.mapaccess1_faststr;internal/runtime/maps.(*Map).getWithoutKeySmallFastStr;aeshashbody 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).scanNext 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;reflect.Value.Grow;reflect.Value.grow;gcWriteBarrier;runtime.wbBufFlush;runtime.systemstack;runtime.wbBufFlush.func1;runtime.wbBufFlush1 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore;encoding/json.unquoteBytes 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).scanWhile 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore;runtime.slicebytetostring;runtime.mallocgc 20000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;reflect.PointerTo;reflect.(*rtype).ptrTo;reflect.(*rtype).typeOff;reflect.resolveTypeOff;runtime.rtype.typeOff;runtime.resolveTypeOff 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).scanNext;encoding/json.stateEndValue 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.unquoteBytes 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;runtime.growslice;runtime.mallocgc;runtime.mallocgcSmallScanNoHeader;runtime.profilealloc;runtime.mProf_Malloc;runtime.stkbucket;runtime.newBucket 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;runtime.newobject;runtime.mallocgc 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.checkValid 30000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.checkValid;encoding/json.state1;encoding/json.state0 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.checkValid;encoding/json.state1;gcWriteBarrier;runtime.wbBufFlush;runtime.systemstack;runtime.wbBufFlush.func1;runtime.wbBufFlush1;runtime.findObject 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.checkValid;encoding/json.stateBeginValue 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.checkValid;encoding/json.stateInString 30000000\nruntime.main;main.main;main.handle;main.makeOrder;fmt.Sprintf;fmt.(*pp).free;gcWriteBarrier;runtime.wbBufFlush;runtime.systemstack;runtime.wbBufFlush.func1;runtime.wbBufFlush1;runtime.findObject;runtime.spanOf 10000000\nruntime.main;main.main;main.handle;main.makeOrder;fmt.Sprintf;runtime.slicebytetostring;runtime.mallocgc 10000000\nruntime.main;main.main;main.handle;main.makeOrder;fmt.Sprintf;runtime.slicebytetostring;runtime.mallocgc;runtime.mallocgcTiny 10000000\nruntime.main;main.main;main.handle;main.makeOrder;runtime.growslice;runtime.bulkBarrierPreWriteSrcOnly;runtime.typePointers.next 10000000\nruntime.main;main.main;main.handle;main.makeOrder;runtime.growslice;runtime.mallocgc;runtime.mallocgcSmallScanNoHeader 10000000\nruntime.main;main.main;main.handle;main.makeOrder;runtime.makemap_small;internal/runtime/maps.NewEmptyMap;runtime.newobject;runtime.mallocgc 10000000\nruntime.main;main.main;main.handle;main.makeOrder;runtime.mapassign_faststr;internal/runtime/maps.(*Map).growToSmall;internal/runtime/maps.newGroups;internal/runtime/maps.newarray;runtime.newarray;runtime.mallocgc;runtime.mallocgcSmallScanNoHeader 10000000\nruntime.main;main.main;main.handle;main.makeOrder;strconv.Itoa;strconv.FormatInt;strconv.formatBits;runtime.slicebytetostring;runtime.mallocgc;runtime.mallocgcTiny 10000000\nruntime.main;main.main;main.handle;main.parseQuery;regexp.(*Regexp).FindAllStringSubmatch;regexp.(*Regexp).allMatches;regexp.(*Regexp).doExecute;regexp.(*Regexp).backtrack;regexp.(*Regexp).tryBacktrack 10000000\nruntime.main;main.main;main.handle;main.parseQuery;regexp.(*Regexp).FindAllStringSubmatch;regexp.(*Regexp).allMatches;regexp.(*Regexp).doExecute;regexp.(*Regexp).backtrack;regexp.newBitState;sync.(*Pool).Get;gcWriteBarrier;runtime.wbBufFlush;runtime.systemstack;runtime.wbBufFlush.func1;runtime.wbBufFlush1;runtime.findObject 10000000\nruntime.main;main.main;main.handle;main.parseQuery;regexp.(*Regexp).FindAllStringSubmatch;regexp.(*Regexp).allMatches;regexp.(*Regexp).doExecute;regexp.(*Regexp).backtrack;runtime.growslice 10000000\nruntime.main;main.main;main.handle;main.parseQuery;regexp.MustCompile;regexp.Compile;regexp.compile;regexp.compileOnePass 10000000\nruntime.main;main.main;main.handle;main.parseQuery;regexp.MustCompile;regexp.Compile;regexp.compile;regexp/syntax.(*Regexp).MaxCap;regexp/syntax.(*Regexp).MaxCap 10000000\nruntime.main;main.main;main.handle;main.parseQuery;regexp.MustCompile;regexp.Compile;regexp.compile;regexp/syntax.Parse;regexp/syntax.parse;regexp/syntax.(*parser).parseClass;regexp/syntax.appendRange;runtime.growslice;runtime.mallocgc;runtime.mallocgcSmallNoscan 10000000\nruntime.main;main.main;main.handle;main.parseQuery;runtime.mapassign_faststr 10000000\nruntime.main;main.main;main.handle;main.rankItems;sort.Slice;sort.pdqsort_func;sort.insertionSort_func;internal/reflectlite.Swapper.func9;internal/reflectlite.typedmemmove;reflect.typedmemmove;runtime.typedmemmove;runtime.memmove 20000000\nruntime.main;main.main;main.handle;main.renderSummary;fmt.Sprintf;fmt.(*pp).doPrintf;fmt.(*pp).printArg 20000000\nruntime.main;main.main;main.handle;main.signOrder;strconv.FormatFloat;strconv.genericFtoa;strconv.bigFtoa;strconv.(*decimal).Assign 10000000\nruntime.main;main.main;main.handle;main.signOrder;strconv.FormatFloat;strconv.genericFtoa;strconv.bigFtoa;strconv.(*decimal).Shift;strconv.rightShift 20000000\nruntime.morestack;runtime.newstack;runtime.gopreempt_m;runtime.goschedImpl;runtime.schedule;runtime.findRunnable 10000000\nruntime.morestack;runtime.newstack;runtime.gopreempt_m;runtime.goschedImpl;runtime.schedule;runtime.findRunnable;runtime.(*timers).check;runtime.(*timers).run 10000000\nruntime.systemstack;runtime.(*mheap).alloc.func1;runtime.(*mheap).allocSpan;runtime.sysUsed;runtime.sysUsedOS;runtime.madvise 300000000\nruntime.systemstack;runtime.gcMarkTermination.func3;runtime.startTheWorldWithSema;runtime.netpoll;runtime.kevent 140000000\nruntime.systemstack;runtime.gcStart.func4;runtime.startTheWorldWithSema;runtime.netpoll;runtime.kevent 180000000\nruntime/pprof.profileWriter;runtime/pprof.readProfile 10000000\nruntime/pprof.profileWriter;runtime/pprof.readProfile;runtime.(*profBuf).read 10000000\nruntime/pprof.profileWriter;time.Sleep 10000000\nruntime/pprof.profileWriter;time.Sleep;runtime.gopark;runtime.newstack;runtime.gopreempt_m;runtime.goschedImpl;runtime.schedule;runtime.execute 10000000\n",
  "top": [
   {
    "name": "runtime.kevent",
    "flat": 320000000,
    "cum": 320000000
   },
   {
    "name": "runtime.madvise",
    "flat": 300000000,
    "cum": 300000000
   },
   {
    "name": "runtime.memclrNoHeapPointers",
    "flat": 290000000,
    "cum": 290000000
   },
   {
    "name": "compress/flate.(*huffmanEncoder).bitCounts",
    "flat": 180000000,
    "cum": 180000000
   },
   {
    "name": "compress/flate.(*compressor).deflate",
    "flat": 90000000,
    "cum": 510000000
   },
   {
    "name": "sort.insertionSort",
    "flat": 70000000,
    "cum": 70000000
   },
   {
    "name": "runtime.mallocgc",
    "flat": 50000000,
    "cum": 630000000
   },
   {
    "name": "encoding/json.(*decodeState).scanWhile",
    "flat": 40000000,
    "cum": 50000000
   },
   {
    "name": "encoding/json.structEncoder.encode",
    "flat": 40000000,
    "cum": 210000000
   },
   {
    "name": "compress/flate.(*huffmanBitWriter).generateCodegen",
    "flat": 30000000,
    "cum": 30000000
   },
   {
    "name": "encoding/json.checkValid",
    "flat": 30000000,
    "cum": 90000000
   },
   {
    "name": "encoding/json.stateInString",
    "flat": 30000000,
    "cum": 30000000
   },
   {
    "name": "encoding/json.unquoteBytes",
    "flat": 30000000,
    "cum": 50000000
   },
   {
    "name": "reflect.(*rtype).Name",
    "flat": 30000000,
    "cum": 40000000
   },
   {
    "name": "runtime.mallocgcSmallScanNoHeader",
    "flat": 30000000,
    "cum": 80000000
   },
   {
    "name": "runtime.memmove",
    "flat": 30000000,
    "cum": 30000000
   },
   {
    "name": "runtime.newBucket",
    "flat": 30000000,
    "cum": 30000000
   },
   {
    "name": "bytes.(*Buffer).Write",
    "flat": 20000000,
    "cum": 30000000
   },
   {
    "name": "bytes.(*Buffer).tryGrowByReslice",
    "flat": 20000000,
    "cum": 20000000
   },
   {
    "name": "compress/flate.(*compressor).findMatch",
    "flat": 20000000,
    "cum": 30000000
   },
   {
    "name": "compress/flate.(*huffmanBitWriter).indexTokens",
    "flat": 20000000,
    "cum": 300000000
   },
   {
    "name": "encoding/json.(*decodeState).object",
    "flat": 20000000,
    "cum": 320000000
   },
   {
    "name": "encoding/json.(*decodeState).rescanLiteral",
    "flat": 20000000,
    "cum": 30000000
   },
   {
    "name": "encoding/json.appendString[go.shape.string]",
    "flat": 20000000,
    "cum": 30000000
   },
   {
    "name": "encoding/json.stateBeginValue",
    "flat": 20000000,
    "cum": 20000000
   },
   {
    "name": "encoding/json.stateEndValue",
    "flat": 20000000,
    "cum": 20000000
   },
   {
    "name": "fmt.(*pp).printArg",
    "flat": 20000000,
    "cum": 20000000
   },
   {
    "name": "runtime.findObject",
    "flat": 20000000,
    "cum": 30000000
   },
   {
    "name": "runtime.mallocgcTiny",
    "flat": 20000000,
    "cum": 20000000
   },
   {
    "name": "runtime.markrootSpans",
    "flat": 20000000,
    "cum": 50000000
   },
   {
    "name": "runtime.pcvalue",
    "flat": 20000000,
    "cum": 60000000
   },
   {
    "name": "runtime.unlock2",
    "flat": 20000000,
    "cum": 30000000
   },
   {
    "name": "sort.partition",
    "flat": 20000000,
    "cum": 30000000
   },
   {
    "name": "strconv.rightShift",
    "flat": 20000000,
    "cum": 20000000
   },
   {
    "name": "unicode/utf8.DecodeRune",
    "flat": 20000000,
    "cum": 20000000
   },
   {
    "name": "aeshashbody",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "bytes.(*Buffer).WriteString",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "compress/flate.(*huffmanBitWriter).writeCode",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "compress/flate.(*huffmanEncoder).bitLength",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "compress/flate.(*huffmanEncoder).generate",
    "flat": 10000000,
    "cum": 310000000
   },
   {
    "name": "compress/flate.byFreq.Less",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "compress/flate.matchLen",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "compress/flate.token.offset",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "compress/gzip.NewWriterLevel",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "encoding/json.(*decodeState).literalStore",
    "flat": 10000000,
    "cum": 130000000
   },
   {
    "name": "encoding/json.(*decodeState).scanNext",
    "flat": 10000000,
    "cum": 20000000
   },
   {
    "name": "encoding/json.floatEncoder.encode",
    "flat": 10000000,
    "cum": 70000000
   },
   {
    "name": "encoding/json.state0",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "hash/crc32.archUpdateIEEE",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "internal/abi.Name.IsExported",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "math.IsInf",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "reflect.copyVal",
    "flat": 10000000,
    "cum": 30000000
   },
   {
    "name": "reflect.resolveTypeOff",
    "flat": 10000000,
    "cum": 30000000
   },
   {
    "name": "reflect.typedmemmove",
    "flat": 10000000,
    "cum": 30000000
   },
   {
    "name": "regexp.(*Regexp).tryBacktrack",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "regexp.compileOnePass",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "regexp/syntax.(*Regexp).MaxCap",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "runtime.(*mheap).freeSpanLocked",
    "flat": 10000000,
    "cum": 30000000
   },
   {
    "name": "runtime.(*moduledata).textAddr",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "runtime.(*mspan).init",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "runtime.(*mspan).writeHeapBitsSmall",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "runtime.(*pageBits).clearRange",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "runtime.(*pallocBits).findSmallN",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "runtime.(*profBuf).read",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "runtime.(*sysMemStat).add",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "runtime.(*timers).run",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "runtime.(*unwinder).resolveInternal",
    "flat": 10000000,
    "cum": 50000000
   },
   {
    "name": "runtime.acquirem",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "runtime.execute",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "runtime.findRunnable",
    "flat": 10000000,
    "cum": 20000000
   },
   {
    "name": "runtime.findfunc",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "runtime.funcInfo.entry",
    "flat": 10000000,
    "cum": 20000000
   },
   {
    "name": "runtime.growslice",
    "flat": 10000000,
    "cum": 60000000
   },
   {
    "name": "runtime.lock2",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "runtime.mallocgcSmallNoscan",
    "flat": 10000000,
    "cum": 20000000
   },
   {
    "name": "runtime.mapaccess1_fast32",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "runtime.mapassign_faststr",
    "flat": 10000000,
    "cum": 20000000
   },
   {
    "name": "runtime.memclrNoHeapPointersChunked",
    "flat": 10000000,
    "cum": 290000000
   },
   {
    "name": "runtime.mutexSampleContention",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "runtime.readvarint",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "runtime.releasem",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "runtime.resolveNameOff",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "runtime.resolveTypeOff",
    "flat": 10000000,
    "cum": 20000000
   },
   {
    "name": "runtime.spanOf",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "runtime.step",
    "flat": 10000000,
    "cum": 20000000
   },
   {
    "name": "runtime.typePointers.next",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "runtime.wbBufFlush1",
    "flat": 10000000,
    "cum": 40000000
   },
   {
    "name": "runtime/pprof.readProfile",
    "flat": 10000000,
    "cum": 20000000
   },
   {
    "name": "sort.order2",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "strconv.(*decimal).Assign",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "strconv.fmtF",
    "flat": 10000000,
    "cum": 20000000
   },
   {
    "name": "strconv.ryuDigits",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "strconv.ryuFtoaShortest",
    "flat": 10000000,
    "cum": 20000000
   },
   {
    "name": "sync.(*Pool).Put",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "time.Sleep",
    "flat": 10000000,
    "cum": 20000000
   },
   {
    "name": "unicode/utf8.DecodeRuneInString",
    "flat": 10000000,
    "cum": 10000000
   },
   {
    "name": "bytes.(*Buffer).WriteByte",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "compress/flate.(*Writer).Close",
    "flat": 0,
    "cum": 510000000
   },
   {
    "name": "compress/flate.(*byFreq).sort",
    "flat": 0,
    "cum": 70000000
   },
   {
    "name": "compress/flate.(*byLiteral).sort",
    "flat": 0,
    "cum": 40000000
   },
   {
    "name": "compress/flate.(*compressor).close",
    "flat": 0,
    "cum": 510000000
   },
   {
    "name": "compress/flate.(*compressor).init",
    "flat": 0,
    "cum": 130000000
   },
   {
    "name": "compress/flate.(*compressor).initDeflate",
    "flat": 0,
    "cum": 120000000
   },
   {
    "name": "compress/flate.(*compressor).writeBlock",
    "flat": 0,
    "cum": 390000000
   },
   {
    "name": "compress/flate.(*huffmanBitWriter).dynamicSize",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "compress/flate.(*huffmanBitWriter).writeBlock",
    "flat": 0,
    "cum": 390000000
   },
   {
    "name": "compress/flate.(*huffmanBitWriter).writeTokens",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "compress/flate.(*huffmanEncoder).assignEncodingAndSize",
    "flat": 0,
    "cum": 40000000
   },
   {
    "name": "compress/flate.NewWriter",
    "flat": 0,
    "cum": 470000000
   },
   {
    "name": "compress/flate.newHuffmanBitWriter",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "compress/flate.newHuffmanEncoder",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "compress/gzip.(*Writer).Close",
    "flat": 0,
    "cum": 510000000
   },
   {
    "name": "compress/gzip.(*Writer).Write",
    "flat": 0,
    "cum": 480000000
   },
   {
    "name": "encoding/json.(*decodeState).array",
    "flat": 0,
    "cum": 220000000
   },
   {
    "name": "encoding/json.(*decodeState).unmarshal",
    "flat": 0,
    "cum": 320000000
   },
   {
    "name": "encoding/json.(*decodeState).value",
    "flat": 0,
    "cum": 320000000
   },
   {
    "name": "encoding/json.(*encodeState).marshal",
    "flat": 0,
    "cum": 240000000
   },
   {
    "name": "encoding/json.(*encodeState).reflectValue",
    "flat": 0,
    "cum": 240000000
   },
   {
    "name": "encoding/json.Marshal",
    "flat": 0,
    "cum": 250000000
   },
   {
    "name": "encoding/json.Unmarshal",
    "flat": 0,
    "cum": 410000000
   },
   {
    "name": "encoding/json.arrayEncoder.encode",
    "flat": 0,
    "cum": 180000000
   },
   {
    "name": "encoding/json.indirect",
    "flat": 0,
    "cum": 60000000
   },
   {
    "name": "encoding/json.interfaceEncoder",
    "flat": 0,
    "cum": 110000000
   },
   {
    "name": "encoding/json.mapEncoder.encode",
    "flat": 0,
    "cum": 150000000
   },
   {
    "name": "encoding/json.sliceEncoder.encode",
    "flat": 0,
    "cum": 180000000
   },
   {
    "name": "encoding/json.state1",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "encoding/json.stringEncoder",
    "flat": 0,
    "cum": 50000000
   },
   {
    "name": "fmt.(*pp).doPrintf",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "fmt.(*pp).free",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "fmt.Sprintf",
    "flat": 0,
    "cum": 50000000
   },
   {
    "name": "gcWriteBarrier",
    "flat": 0,
    "cum": 40000000
   },
   {
    "name": "hash/crc32.Update",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "hash/crc32.update",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "internal/reflectlite.Swapper.func9",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "internal/reflectlite.typedmemmove",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "internal/runtime/maps.(*Map).getWithoutKeySmallFastStr",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "internal/runtime/maps.(*Map).growToSmall",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "internal/runtime/maps.NewEmptyMap",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "internal/runtime/maps.newGroups",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "internal/runtime/maps.newarray",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "main.compress",
    "flat": 0,
    "cum": 1000000000
   },
   {
    "name": "main.decodeOrder",
    "flat": 0,
    "cum": 410000000
   },
   {
    "name": "main.handle",
    "flat": 0,
    "cum": 1880000000
   },
   {
    "name": "main.main",
    "flat": 0,
    "cum": 1880000000
   },
   {
    "name": "main.makeOrder",
    "flat": 0,
    "cum": 80000000
   },
   {
    "name": "main.parseQuery",
    "flat": 0,
    "cum": 70000000
   },
   {
    "name": "main.rankItems",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "main.renderSummary",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "main.signOrder",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "reflect.(*MapIter).Key",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "reflect.(*MapIter).Value",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "reflect.(*rtype).String",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "reflect.(*rtype).nameOff",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "reflect.(*rtype).ptrTo",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "reflect.(*rtype).typeOff",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "reflect.PointerTo",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "reflect.Value.Addr",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "reflect.Value.Field",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "reflect.Value.Grow",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "reflect.Value.grow",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "reflect.ptrTo",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "reflect.resolveNameOff",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "reflect.unsafe_New",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "regexp.(*Regexp).FindAllStringSubmatch",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "regexp.(*Regexp).allMatches",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "regexp.(*Regexp).backtrack",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "regexp.(*Regexp).doExecute",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "regexp.Compile",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "regexp.MustCompile",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "regexp.compile",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "regexp.newBitState",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "regexp/syntax.(*parser).parseClass",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "regexp/syntax.Parse",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "regexp/syntax.appendRange",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "regexp/syntax.parse",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.(*fixalloc).alloc",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.(*inlineUnwinder).next",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.(*inlineUnwinder).resolveInternal",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "runtime.(*mcache).allocLarge",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "runtime.(*mcache).nextFree",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.(*mcache).refill",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.(*mcentral).cacheSpan",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.(*mheap).alloc",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "runtime.(*mheap).alloc.func1",
    "flat": 0,
    "cum": 320000000
   },
   {
    "name": "runtime.(*mheap).allocSpan",
    "flat": 0,
    "cum": 320000000
   },
   {
    "name": "runtime.(*mheap).freeSpan",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "runtime.(*mheap).initSpan",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.(*pageAlloc).alloc",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.(*pageAlloc).find",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.(*pageAlloc).free",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.(*pallocBits).find",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.(*pallocBits).free",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.(*sweepLocked).sweep",
    "flat": 0,
    "cum": 40000000
   },
   {
    "name": "runtime.(*sweepLocked).sweep.(*mheap).freeSpan.func3",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "runtime.(*timers).check",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.(*unwinder).initAt",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.(*unwinder).next",
    "flat": 0,
    "cum": 50000000
   },
   {
    "name": "runtime.bgsweep",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "runtime.bulkBarrierPreWriteSrcOnly",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.callers",
    "flat": 0,
    "cum": 70000000
   },
   {
    "name": "runtime.callers.func1",
    "flat": 0,
    "cum": 70000000
   },
   {
    "name": "runtime.deductAssistCredit",
    "flat": 0,
    "cum": 60000000
   },
   {
    "name": "runtime.deductSweepCredit",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "runtime.freeSpecial",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.funcspdelta",
    "flat": 0,
    "cum": 40000000
   },
   {
    "name": "runtime.gcAssistAlloc",
    "flat": 0,
    "cum": 60000000
   },
   {
    "name": "runtime.gcAssistAlloc.func2",
    "flat": 0,
    "cum": 60000000
   },
   {
    "name": "runtime.gcAssistAlloc1",
    "flat": 0,
    "cum": 60000000
   },
   {
    "name": "runtime.gcBgMarkWorker",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.gcDrainN",
    "flat": 0,
    "cum": 60000000
   },
   {
    "name": "runtime.gcMarkTermination.func3",
    "flat": 0,
    "cum": 140000000
   },
   {
    "name": "runtime.gcStart.func4",
    "flat": 0,
    "cum": 180000000
   },
   {
    "name": "runtime.gopark",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.gopreempt_m",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "runtime.goschedImpl",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "runtime.heapSetTypeNoHeader",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.lock",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.lockWithRank",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.mProf_Malloc",
    "flat": 0,
    "cum": 110000000
   },
   {
    "name": "runtime.mProf_Malloc.func1",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.main",
    "flat": 0,
    "cum": 1880000000
   },
   {
    "name": "runtime.makemap_small",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.makeslice",
    "flat": 0,
    "cum": 150000000
   },
   {
    "name": "runtime.mallocgcLarge",
    "flat": 0,
    "cum": 400000000
   },
   {
    "name": "runtime.mapaccess1_faststr",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.markroot",
    "flat": 0,
    "cum": 60000000
   },
   {
    "name": "runtime.markroot.func1",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.morestack",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "runtime.netpoll",
    "flat": 0,
    "cum": 320000000
   },
   {
    "name": "runtime.newInlineUnwinder",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.newarray",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.newobject",
    "flat": 0,
    "cum": 370000000
   },
   {
    "name": "runtime.newstack",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "runtime.pcdatavalue1",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "runtime.profilealloc",
    "flat": 0,
    "cum": 110000000
   },
   {
    "name": "runtime.rtype.typeOff",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "runtime.scanstack",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.schedule",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "runtime.setprofilebucket",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "runtime.slicebytetostring",
    "flat": 0,
    "cum": 50000000
   },
   {
    "name": "runtime.startTheWorldWithSema",
    "flat": 0,
    "cum": 320000000
   },
   {
    "name": "runtime.stkbucket",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "runtime.sweepone",
    "flat": 0,
    "cum": 40000000
   },
   {
    "name": "runtime.sysUsed",
    "flat": 0,
    "cum": 300000000
   },
   {
    "name": "runtime.sysUsedOS",
    "flat": 0,
    "cum": 300000000
   },
   {
    "name": "runtime.systemstack",
    "flat": 0,
    "cum": 850000000
   },
   {
    "name": "runtime.tracebackPCs",
    "flat": 0,
    "cum": 60000000
   },
   {
    "name": "runtime.typedmemmove",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "runtime.unlock",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "runtime.unlockWithRank",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "runtime.wbBufFlush",
    "flat": 0,
    "cum": 40000000
   },
   {
    "name": "runtime.wbBufFlush.func1",
    "flat": 0,
    "cum": 40000000
   },
   {
    "name": "runtime/pprof.profileWriter",
    "flat": 0,
    "cum": 40000000
   },
   {
    "name": "sort.Slice",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "sort.Sort",
    "flat": 0,
    "cum": 110000000
   },
   {
    "name": "sort.choosePivot",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "sort.insertionSort_func",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "sort.median",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "sort.pdqsort",
    "flat": 0,
    "cum": 110000000
   },
   {
    "name": "sort.pdqsort_func",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "strconv.(*decimal).Shift",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "strconv.AppendFloat",
    "flat": 0,
    "cum": 40000000
   },
   {
    "name": "strconv.FormatFloat",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "strconv.FormatInt",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "strconv.Itoa",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "strconv.bigFtoa",
    "flat": 0,
    "cum": 30000000
   },
   {
    "name": "strconv.formatBits",
    "flat": 0,
    "cum": 10000000
   },
   {
    "name": "strconv.formatDigits",
    "flat": 0,
    "cum": 20000000
   },
   {
    "name": "strconv.genericFtoa",
    "flat": 0,
    "cum": 70000000
   },
   {
    "name": "sync.(*Pool).Get",
    "flat": 0,
    "cum": 10000000
   }
  ],
  "topTotal": 2590000000,
  "focus": {
   "re": "\\(\\*compressor\\)",
   "total": 640000000,
   "rows": [
    {
     "name": "compress/flate.(*huffmanEncoder).bitCounts",
     "flat": 180000000,
     "cum": 180000000
    },
    {
     "name": "compress/flate.(*compressor).deflate",
     "flat": 90000000,
     "cum": 510000000
    },
    {
     "name": "sort.insertionSort",
     "flat": 70000000,
     "cum": 70000000
    },
    {
     "name": "runtime.memclrNoHeapPointers",
     "flat": 50000000,
     "cum": 50000000
    },
    {
     "name": "compress/flate.(*huffmanBitWriter).generateCodegen",
     "flat": 30000000,
     "cum": 30000000
    },
    {
     "name": "compress/flate.(*compressor).findMatch",
     "flat": 20000000,
     "cum": 30000000
    },
    {
     "name": "compress/flate.(*huffmanBitWriter).indexTokens",
     "flat": 20000000,
     "cum": 300000000
    },
    {
     "name": "sort.partition",
     "flat": 20000000,
     "cum": 30000000
    }
   ]
  },
  "ignore": {
   "re": "^runtime\\.",
   "total": 20000000,
   "top": [
    {
     "name": "runtime/pprof.readProfile",
     "flat": 10000000,
     "cum": 10000000
    },
    {
     "name": "time.Sleep",
     "flat": 10000000,
     "cum": 10000000
    },
    {
     "name": "runtime/pprof.profileWriter",
     "flat": 0,
     "cum": 20000000
    }
   ]
  },
  "hide": {
   "re": "^runtime\\.",
   "total": 1920000000,
   "top": [
    {
     "name": "compress/flate.NewWriter",
     "flat": 340000000,
     "cum": 470000000
    },
    {
     "name": "compress/flate.(*huffmanEncoder).bitCounts",
     "flat": 180000000,
     "cum": 180000000
    },
    {
     "name": "compress/flate.(*compressor).initDeflate",
     "flat": 120000000,
     "cum": 120000000
    },
    {
     "name": "compress/flate.(*compressor).deflate",
     "flat": 90000000,
     "cum": 510000000
    },
    {
     "name": "sort.insertionSort",
     "flat": 70000000,
     "cum": 70000000
    },
    {
     "name": "encoding/json.(*decodeState).object",
     "flat": 50000000,
     "cum": 320000000
    }
   ]
  },
  "both": {
   "focus": "json",
   "ignore": "Unmarshal",
   "total": 250000000
  },
  "linesTop": [
   {
    "name": "runtime.kevent /usr/local/go/src/runtime/sys_darwin.go:498",
    "flat": 320000000,
    "cum": 320000000
   },
   {
    "name": "runtime.madvise /usr/local/go/src/runtime/sys_darwin.go:284",
    "flat": 300000000,
    "cum": 300000000
   },
   {
    "name": "runtime.memclrNoHeapPointers /usr/local/go/src/runtime/memclr_arm64.s:179",
    "flat": 160000000,
    "cum": 160000000
   },
   {
    "name": "runtime.memclrNoHeapPointers /usr/local/go/src/runtime/memclr_arm64.s:180",
    "flat": 100000000,
    "cum": 100000000
   },
   {
    "name": "compress/flate.(*huffmanEncoder).bitCounts /usr/local/go/src/compress/flate/huffman_code.go:177",
    "flat": 50000000,
    "cum": 50000000
   }
  ],
  "peek": {
   "fn": "compress/flate.NewWriter",
   "self": {
    "flat": 0,
    "cum": 470000000,
    "name": "compress/flate.NewWriter"
   },
   "callers": [
    {
     "name": "compress/gzip.(*Writer).Write",
     "w": 470000000
    }
   ],
   "callees": [
    {
     "name": "runtime.newobject",
     "w": 340000000
    },
    {
     "name": "compress/flate.(*compressor).init",
     "w": 130000000
    }
   ]
  }
 },
 "goAfter": {
  "totals": [
   254,
   2540000000
  ],
  "folded": "runtime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.mapEncoder.encode;encoding/json.interfaceEncoder;encoding/json.(*encodeState).reflectValue;encoding/json.stringEncoder;encoding/json.appendString[go.shape.string] 20000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.mapEncoder.encode;encoding/json.interfaceEncoder;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.mapEncoder.encode;reflect.(*MapIter).Next;reflect.mapIterNext;internal/runtime/maps.(*Iter).Next 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.mapEncoder.encode;encoding/json.interfaceEncoder;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode 20000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.mapEncoder.encode;encoding/json.interfaceEncoder;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;encoding/json.floatEncoder.encode;strconv.AppendFloat;strconv.genericFtoa;strconv.formatDigits;strconv.fmtF 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.mapEncoder.encode;encoding/json.interfaceEncoder;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;encoding/json.floatEncoder.encode;strconv.AppendFloat;strconv.genericFtoa;strconv.ryuFtoaShortest;strconv.ryuDigits 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.mapEncoder.encode;encoding/json.interfaceEncoder;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;encoding/json.stringEncoder 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.mapEncoder.encode;encoding/json.interfaceEncoder;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;encoding/json.stringEncoder;encoding/json.appendString[go.shape.string] 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.mapEncoder.encode;encoding/json.interfaceEncoder;encoding/json.(*encodeState).reflectValue;encoding/json.valueEncoder;reflect.Value.Type 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.mapEncoder.encode;runtime.makeslice;runtime.mallocgc 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.mapEncoder.encode;runtime.makeslice 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;bytes.(*Buffer).WriteString 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;bytes.(*Buffer).WriteString;runtime.memmove 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;encoding/json.floatEncoder.encode 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;encoding/json.stringEncoder;bytes.(*Buffer).Write 10000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;encoding/json.structEncoder.encode;encoding/json.stringEncoder;encoding/json.appendString[go.shape.string] 20000000\nruntime.main;main.main;main.handle;encoding/json.Marshal;encoding/json.(*encodeState).marshal;encoding/json.(*encodeState).reflectValue;encoding/json.structEncoder.encode;encoding/json.sliceEncoder.encode;encoding/json.arrayEncoder.encode;reflect.Value.Index 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate 140000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).findMatch 30000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).findMatch;compress/flate.matchLen 30000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).dynamicSize;compress/flate.(*huffmanEncoder).bitLength 30000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).fixedSize;compress/flate.(*huffmanEncoder).bitLength 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).generateCodegen 30000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens 20000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate 20000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*byFreq).sort;sort.Sort;sort.pdqsort;sort.choosePivot;sort.median 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*byFreq).sort;sort.Sort;sort.pdqsort;sort.choosePivot;sort.medianAdjacent;sort.median;sort.order2 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*byFreq).sort;sort.Sort;sort.pdqsort;sort.insertionSort 20000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*byFreq).sort;sort.Sort;sort.pdqsort;sort.partition 40000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*byFreq).sort;sort.Sort;sort.pdqsort;sort.pdqsort;sort.partition 30000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*byFreq).sort;sort.Sort;sort.pdqsort;sort.pdqsort;sort.pdqsort;sort.insertionSort 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*byFreq).sort;sort.Sort;sort.pdqsort;sort.pdqsort;sort.pdqsort;sort.insertionSort;compress/flate.byFreq.Less 20000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*huffmanEncoder).assignEncodingAndSize 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*huffmanEncoder).assignEncodingAndSize;compress/flate.(*byLiteral).sort;sort.Sort 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*huffmanEncoder).assignEncodingAndSize;compress/flate.(*byLiteral).sort;sort.Sort;sort.pdqsort;sort.insertionSort 30000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*huffmanEncoder).assignEncodingAndSize;compress/flate.(*byLiteral).sort;sort.Sort;sort.pdqsort;sort.partition 20000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*huffmanEncoder).bitCounts 150000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).indexTokens;compress/flate.(*huffmanEncoder).generate;compress/flate.(*huffmanEncoder).bitCounts;runtime.memmove 20000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).writeDynamicHeader;compress/flate.(*huffmanBitWriter).writeCode 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).writeTokens 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).writeTokens;compress/flate.(*huffmanBitWriter).writeBits 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanBitWriter).writeTokens;compress/flate.(*huffmanBitWriter).writeCode 30000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanEncoder).generate;compress/flate.(*byFreq).sort;sort.Sort;sort.pdqsort;sort.insertionSort 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanEncoder).generate;compress/flate.(*huffmanEncoder).assignEncodingAndSize 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanEncoder).generate;compress/flate.(*huffmanEncoder).assignEncodingAndSize;compress/flate.(*byLiteral).sort;gcWriteBarrier;runtime.wbBufFlush;runtime.systemstack;runtime.wbBufFlush.func1;runtime.wbBufFlush1;runtime.findObject;runtime.spanOf 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanEncoder).generate;compress/flate.(*huffmanEncoder).assignEncodingAndSize;compress/flate.(*byLiteral).sort;sort.Sort;sort.pdqsort;sort.insertionSort 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Close;compress/flate.(*Writer).Close;compress/flate.(*compressor).close;compress/flate.(*compressor).deflate;compress/flate.(*compressor).writeBlock;compress/flate.(*huffmanBitWriter).writeBlock;compress/flate.(*huffmanEncoder).generate;compress/flate.(*huffmanEncoder).bitCounts 10000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Reset;compress/gzip.(*Writer).init;compress/flate.(*Writer).Reset;compress/flate.(*compressor).reset 550000000\nruntime.main;main.main;main.handle;main.compress;compress/gzip.(*Writer).Write;time.Time.After;time.(*Time).sec 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).rescanLiteral 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore;encoding/json.indirect;reflect.Value.Addr;reflect.ptrTo;reflect.(*rtype).ptrTo;reflect.(*rtype).typeOff;reflect.resolveTypeOff;runtime.rtype.typeOff;runtime.resolveTypeOff;runtime.mapaccess1_fast32 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore;runtime.slicebytetostring;runtime.memmove 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).rescanLiteral 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).rescanLiteral;encoding/json.stateEndValue 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).scanWhile;encoding/json.stateBeginStringOrEmpty 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore;encoding/json.indirect 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore;encoding/json.indirect;reflect.(*rtype).Name 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore;encoding/json.indirect;reflect.(*rtype).NumMethod;reflect.(*rtype).exportedMethods;reflect.(*rtype).uncommon 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore;encoding/json.indirect;reflect.Value.Addr 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore;encoding/json.indirect;reflect.Value.Addr;reflect.ptrTo;reflect.(*rtype).ptrTo;reflect.(*rtype).typeOff;reflect.resolveTypeOff;runtime.rtype.typeOff;runtime.resolveTypeOff;runtime.mapaccess1_fast32 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore;encoding/json.indirect;reflect.Value.IsNil 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore;encoding/json.unquoteBytes 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore;reflect.Value.SetString 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore;runtime.ifaceeq 20000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).literalStore;runtime.slicebytetostring;runtime.mallocgc;runtime.deductAssistCredit 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).rescanLiteral 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.unquoteBytes 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;runtime.mapaccess1_faststr;internal/runtime/maps.(*Map).getWithoutKeySmallFastStr;runtime.memequal 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;encoding/json.(*decodeState).value;encoding/json.(*decodeState).scanNext 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;reflect.Value.Grow;reflect.Value.grow;reflect.growslice;runtime.growslice;runtime.mallocgc;runtime.mallocgcSmallScanNoHeader 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).array;reflect.Value.Grow;reflect.Value.grow;reflect.growslice;runtime.growslice;runtime.mallocgc;runtime.mallocgcSmallScanNoHeader;runtime.(*mcache).nextFree;runtime.(*mcache).refill;runtime.(*mcentral).cacheSpan;runtime.(*mspan).refillAllocCache;runtime.(*gcBits).bytep 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).scanWhile 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;reflect.New;reflect.unsafe_New;runtime.mallocgc;runtime.mallocgcSmallScanNoHeader 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.(*decodeState).unmarshal;encoding/json.(*decodeState).value;encoding/json.(*decodeState).object;encoding/json.unquoteBytes 20000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.checkValid 30000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.checkValid;encoding/json.stateBeginValue 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.checkValid;encoding/json.stateBeginValue;encoding/json.(*scanner).pushParseState;runtime.growslice;runtime.mallocgc;runtime.mallocgcSmallNoscan;runtime.profilealloc;runtime.mProf_Malloc;runtime.stkbucket;internal/runtime/atomic.(*UnsafePointer).Load 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.checkValid;encoding/json.stateDot0 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.checkValid;encoding/json.stateEndValue;encoding/json.isSpace 10000000\nruntime.main;main.main;main.handle;main.decodeOrder;encoding/json.Unmarshal;encoding/json.checkValid;encoding/json.stateInString 20000000\nruntime.main;main.main;main.handle;main.makeOrder;fmt.Sprintf;fmt.(*pp).doPrintf 10000000\nruntime.main;main.main;main.handle;main.makeOrder;fmt.Sprintf;runtime.slicebytetostring;runtime.mallocgc;runtime.mallocgcTiny 10000000\nruntime.main;main.main;main.handle;main.makeOrder;fmt.Sprintf;runtime.slicebytetostring;runtime.memmove 10000000\nruntime.main;main.main;main.handle;main.makeOrder;runtime.concatstring2;runtime.concatstrings;runtime.memmove 10000000\nruntime.main;main.main;main.handle;main.makeOrder;runtime.concatstring2;runtime.concatstrings;runtime.rawstringtmp;runtime.rawstring;runtime.mallocgc;runtime.mallocgcTiny 10000000\nruntime.main;main.main;main.handle;main.makeOrder;runtime.convT64;runtime.mallocgc;runtime.mallocgcTiny 10000000\nruntime.main;main.main;main.handle;main.makeOrder;runtime.growslice;runtime.mallocgc;runtime.mallocgcSmallScanNoHeader;runtime.memclrNoHeapPointers 10000000\nruntime.main;main.main;main.handle;main.parseQuery;regexp.(*Regexp).FindAllStringSubmatch;regexp.(*Regexp).allMatches 10000000\nruntime.main;main.main;main.handle;main.parseQuery;regexp.(*Regexp).FindAllStringSubmatch;regexp.(*Regexp).allMatches;regexp.(*Regexp).FindAllStringSubmatch.func1;runtime.makeslice;runtime.mallocgc;runtime.deductAssistCredit;runtime.gcAssistAlloc;runtime.systemstack;runtime.gcAssistAlloc.func2;runtime.gcAssistAlloc1;runtime.gcDrainN;runtime.scanobject;runtime.(*mspan).typePointersOfUnchecked;runtime.(*mspan).heapBitsSmallForAddr 10000000\nruntime.main;main.main;main.handle;main.parseQuery;regexp.(*Regexp).FindAllStringSubmatch;regexp.(*Regexp).allMatches;regexp.(*Regexp).FindAllStringSubmatch.func1;runtime.makeslice;runtime.mallocgc;runtime.mallocgcSmallScanNoHeader;runtime.nextFreeFast 10000000\nruntime.main;main.main;main.handle;main.parseQuery;regexp.(*Regexp).FindAllStringSubmatch;regexp.(*Regexp).allMatches;regexp.(*Regexp).doExecute;regexp.(*Regexp).backtrack;regexp.(*Regexp).tryBacktrack 20000000\nruntime.main;main.main;main.handle;main.parseQuery;runtime.mapassign_faststr;internal/runtime/maps.(*Map).growToSmall;internal/runtime/maps.newGroups;internal/runtime/maps.newarray;runtime.newarray;runtime.mallocgc;runtime.mallocgcSmallScanNoHeader 10000000\nruntime.main;main.main;main.handle;main.rankItems;runtime.convTslice;runtime.mallocgc 10000000\nruntime.main;main.main;main.handle;main.rankItems;runtime.growslice;runtime.mallocgc;runtime.mallocgcSmallScanHeader;runtime.profilealloc;runtime.mProf_Malloc;runtime.callers;runtime.systemstack;runtime.callers.func1;runtime.tracebackPCs;runtime.newInlineUnwinder 10000000\nruntime.main;main.main;main.handle;main.rankItems;runtime.growslice;runtime.roundupsize 10000000\nruntime.main;main.main;main.handle;main.rankItems;sort.Slice;sort.pdqsort_func;sort.insertionSort_func;internal/reflectlite.Swapper.func9 10000000\nruntime.main;main.main;main.handle;main.rankItems;sort.Slice;sort.pdqsort_func;sort.insertionSort_func;internal/reflectlite.Swapper.func9;internal/reflectlite.typedmemmove;reflect.typedmemmove;runtime.typedmemmove;runtime.bulkBarrierPreWrite;runtime.(*mspan).base 10000000\nruntime.main;main.main;main.handle;main.rankItems;sort.Slice;sort.pdqsort_func;sort.insertionSort_func;internal/reflectlite.Swapper.func9;internal/reflectlite.typedmemmove;reflect.typedmemmove;runtime.typedmemmove;runtime.bulkBarrierPreWrite;runtime.(*wbBuf).get2;runtime.wbBufFlush;runtime.systemstack;runtime.wbBufFlush.func1;runtime.wbBufFlush1;runtime.findObject 10000000\nruntime.main;main.main;main.handle;main.rankItems;sort.Slice;sort.pdqsort_func;sort.insertionSort_func;main.rankItems.func1 20000000\nruntime.main;main.main;main.handle;main.renderSummary 10000000\nruntime.main;main.main;main.handle;main.renderSummary;strings.(*Builder).Grow;strings.(*Builder).grow;internal/bytealg.MakeNoZero;runtime.mallocgc;runtime.mallocgcSmallNoscan 10000000\nruntime.main;main.main;main.handle;main.signOrder;crypto/internal/fips140/sha256.(*Digest).Write 10000000\nruntime.main;main.main;main.handle;main.signOrder;runtime.stringtoslicebyte 10000000\nruntime.main;main.main;main.handle;main.signOrder;strconv.FormatFloat;strconv.genericFtoa;strconv.bigFtoa;strconv.(*decimal).Assign 10000000\nruntime.main;main.main;main.handle;main.signOrder;strconv.FormatFloat;strconv.genericFtoa;strconv.bigFtoa;strconv.(*decimal).Shift;strconv.rightShift 10000000\nruntime.systemstack;runtime.(*mheap).alloc.func1;runtime.(*mheap).allocSpan;runtime.sysUsed;runtime.sysUsedOS;runtime.madvise 100000000\nruntime.systemstack;runtime.gcMarkTermination.func3;runtime.startTheWorldWithSema;runtime.netpoll;runtime.kevent 60000000\nruntime.systemstack;runtime.gcStart.func4;runtime.startTheWorldWithSema;runtime.netpoll;runtime.kevent 170000000\nruntime.systemstack;runtime.persistentalloc.func1;runtime.persistentalloc1;runtime.sysAlloc;runtime.sysAllocOS;runtime.mmap 10000000\nruntime/pprof.profileWriter;runtime/pprof.(*profileBuilder).addCPUData;runtime/pprof.(*profMap).lookup;runtime.mapaccess1_fast64;internal/runtime/maps.ctrlGroup.matchEmpty;internal/runtime/maps.ctrlGroupMatchEmpty 10000000\n"
 },
 "diff": {
  "rows": [
   {
    "name": "compress/flate.(*compressor).reset",
    "flat": 550000000,
    "cum": 550000000
   },
   {
    "name": "runtime.memclrNoHeapPointers",
    "flat": -280000000,
    "cum": -280000000
   },
   {
    "name": "runtime.madvise",
    "flat": -200000000,
    "cum": -200000000
   },
   {
    "name": "runtime.kevent",
    "flat": -90000000,
    "cum": -90000000
   },
   {
    "name": "sort.partition",
    "flat": 70000000,
    "cum": 60000000
   },
   {
    "name": "compress/flate.(*compressor).deflate",
    "flat": 50000000,
    "cum": 290000000
   },
   {
    "name": "compress/flate.(*huffmanBitWriter).writeCode",
    "flat": 30000000,
    "cum": 30000000
   },
   {
    "name": "compress/flate.(*huffmanEncoder).bitLength",
    "flat": 30000000,
    "cum": 30000000
   },
   {
    "name": "encoding/json.(*decodeState).scanWhile",
    "flat": -30000000,
    "cum": -30000000
   },
   {
    "name": "encoding/json.appendString[go.shape.string]",
    "flat": 30000000,
    "cum": 20000000
   },
   {
    "name": "runtime.mallocgc",
    "flat": -30000000,
    "cum": -470000000
   },
   {
    "name": "runtime.memmove",
    "flat": 30000000,
    "cum": 30000000
   },
   {
    "name": "runtime.newBucket",
    "flat": -30000000,
    "cum": -30000000
   },
   {
    "name": "bytes.(*Buffer).tryGrowByReslice",
    "flat": -20000000,
    "cum": -20000000
   },
   {
    "name": "compress/flate.(*huffmanEncoder).assignEncodingAndSize",
    "flat": 20000000,
    "cum": 60000000
   },
   {
    "name": "compress/flate.(*huffmanEncoder).bitCounts",
    "flat": -20000000,
    "cum": 0
   },
   {
    "name": "compress/flate.matchLen",
    "flat": 20000000,
    "cum": 20000000
   },
   {
    "name": "encoding/json.(*decodeState).object",
    "flat": -20000000,
    "cum": -50000000
   },
   {
    "name": "encoding/json.structEncoder.encode",
    "flat": -20000000,
    "cum": -60000000
   },
   {
    "name": "fmt.(*pp).printArg",
    "flat": -20000000,
    "cum": -20000000
   },
   {
    "name": "main.rankItems.func1",
    "flat": 20000000,
    "cum": 20000000
   },
   {
    "name": "reflect.(*rtype).Name",
    "flat": -20000000,
    "cum": -30000000
   },
   {
    "name": "runtime.ifaceeq",
    "flat": 20000000,
    "cum": 20000000
   },
   {
    "name": "runtime.markrootSpans",
    "flat": -20000000,
    "cum": -50000000
   },
   {
    "name": "runtime.pcvalue",
    "flat": -20000000,
    "cum": -60000000
   }
  ],
  "net": -50000000
 },
 "allocs": {
  "types": [
   [
    "alloc_objects",
    "count"
   ],
   [
    "alloc_space",
    "bytes"
   ],
   [
    "inuse_objects",
    "count"
   ],
   [
    "inuse_space",
    "bytes"
   ]
  ],
  "def": 1,
  "totals": [
   12875599,
   54666711582,
   8128,
   61356388
  ],
  "top3": [
   [
    {
     "name": "main.renderSummary",
     "flat": 1714319,
     "cum": 2590970
    },
    {
     "name": "main.makeOrder",
     "flat": 1551588,
     "cum": 2117416
    },
    {
     "name": "fmt.Sprintf",
     "flat": 1409195,
     "cum": 1409707
    }
   ],
   [
    {
     "name": "compress/flate.NewWriter",
     "flat": 43724520219,
     "cum": 53161194069
    },
    {
     "name": "compress/flate.(*compressor).initDeflate",
     "flat": 9175151029,
     "cum": 9175151029
    },
    {
     "name": "compress/flate.(*huffmanEncoder).generate",
     "flat": 460460552,
     "cum": 460460552
    }
   ],
   [
    {
     "name": "crypto/internal/fips140/sha256.(*Digest).Sum",
     "flat": 2048,
     "cum": 2048
    },
    {
     "name": "regexp.(*Regexp).FindAllStringSubmatch.func1",
     "flat": 1365,
     "cum": 1365
    },
    {
     "name": "regexp/syntax.(*parser).newRegexp",
     "flat": 1171,
     "cum": 1171
    }
   ],
   [
    {
     "name": "compress/flate.NewWriter",
     "flat": 47114079,
     "cum": 58702474
    },
    {
     "name": "compress/flate.(*compressor).initDeflate",
     "flat": 11390054,
     "cum": 11390054
    },
    {
     "name": "runtime/pprof.StartCPUProfile",
     "flat": 1200163,
     "cum": 1200163
    }
   ]
  ]
 },
 "node": {
  "samples": 468,
  "hitSum": 464,
  "spanUs": 4030956,
  "monotonic": true,
  "topSelf": [
   [
    "buildIndex /srv/blog/render.js:58:20",
    165
   ],
   [
    "inline /srv/blog/render.js:37:16",
    59
   ],
   [
    "RegExp: \\W+",
    52
   ],
   [
    "update node:internal/crypto/hash:132:40",
    29
   ],
   [
    "build /srv/blog/render.js:74:15",
    27
   ]
  ],
  "nodes": 75
 },
 "py": {
  "total": 1894,
  "selfTop": [
   {
    "name": "gen_lines (sampler.py:28)",
    "flat": 634
   },
   {
    "name": "pipeline (sampler.py:71)",
    "flat": 366
   },
   {
    "name": "<genexpr> (csv.py:222)",
    "flat": 183
   },
   {
    "name": "parse_line (sampler.py:35)",
    "flat": 151
   },
   {
    "name": "parse_line (sampler.py:32)",
    "flat": 71
   }
  ],
  "genLinesFrames": [
   797
  ],
  "all": 1894
 },
 "perf": {
  "text": "# ========\n# captured on: test\n# ========\n#\norderd 4242/4243 [002] 1000.000100: 10101010 cpu-clock:\n\tffffffff810a1b2c native_safe_halt+0x6 ([kernel.kallsyms])\n\t55d1c0a1b2c3 compress_block+0x1f (/srv/order-api/orderd)\n\t55d1c0a1b000 handle_request(Request const&)+0x40 (/srv/order-api/orderd)\n\t7f0000001000 [unknown] (/usr/lib/libc.so.6)\n\t7f0000002000 [unknown] ([unknown])\n\norderd 4242/4243 [002] 1000.000200: 10101010 cpu-clock:\n\t55d1c0a1b2c3 compress_block+0x1f (/srv/order-api/orderd)\n\t55d1c0a1b000 handle_request(Request const&)+0x40 (/srv/order-api/orderd)\n\t7f0000001000 [unknown] (/usr/lib/libc.so.6)\n\t7f0000002000 [unknown] ([unknown])\n\norderd 4242/4250 [003] 1000.000300: 10101010 cpu-clock:\n\t55d1c0a1c111 json_parse+0x11 (/srv/order-api/orderd)\n\t55d1c0a1b000 handle_request(Request const&)+0x40 (/srv/order-api/orderd)\n\t7f0000001000 [unknown] (/usr/lib/libc.so.6)\n\nWeb Content 777/778 [001] 1000.000400: 10101010 cpu-clock:\n\t7f00000aa000 js::RunScript+0x10 (/usr/lib/firefox/libxul.so)\n\t7f00000ab000 (anonymous namespace)::Worker::run(int)+0x22 (/usr/lib/firefox/libxul.so)\n\norderd 4242/4243 [002] 1000.000500: 1 page-faults:\n\t55d1c0a1c111 json_parse+0x11 (/srv/order-api/orderd)\n\norderd 4242/4243 [002] 1000.000600: 10101010 cpu-clock:\n\t55d1c0a1c111 json_parse+0x11 (/srv/order-api/orderd)\n\t55d1c0a1b000 handle_request(Request const&)+0x40 (/srv/order-api/orderd)\n\t7f0000001000 [unknown] (/usr/lib/libc.so.6)\n\n",
  "def": "Web_Content;js::RunScript 10101010\norderd;[libc.so.6];handle_request;json_parse 20202020\norderd;[unknown];[libc.so.6];handle_request;compress_block 10101010\norderd;[unknown];[libc.so.6];handle_request;compress_block;native_safe_halt 10101010\n",
  "pid": "Web_Content-777;js::RunScript 10101010\norderd-4242;[libc.so.6];handle_request;json_parse 20202020\norderd-4242;[unknown];[libc.so.6];handle_request;compress_block 10101010\norderd-4242;[unknown];[libc.so.6];handle_request;compress_block;native_safe_halt 10101010\n",
  "kernel": "Web_Content;js::RunScript 10101010\norderd;[libc.so.6];handle_request;json_parse 20202020\norderd;[unknown];[libc.so.6];handle_request;compress_block 10101010\norderd;[unknown];[libc.so.6];handle_request;compress_block;native_safe_halt_[k] 10101010\n",
  "all": "Web_Content;js::RunScript 10101010\norderd;[libc.so.6];handle_request;json_parse 20202020\norderd;[unknown];[libc.so.6];handle_request;compress_block 10101010\norderd;[unknown];[libc.so.6];handle_request;compress_block;native_safe_halt_[k] 10101010\n",
  "noTailText": "# ========\n# captured on: test\n# ========\n#\norderd 4242/4243 [002] 1000.000100: 10101010 cpu-clock:\n\tffffffff810a1b2c native_safe_halt+0x6 ([kernel.kallsyms])\n\t55d1c0a1b2c3 compress_block+0x1f (/srv/order-api/orderd)\n\t55d1c0a1b000 handle_request(Request const&)+0x40 (/srv/order-api/orderd)\n\t7f0000001000 [unknown] (/usr/lib/libc.so.6)\n\t7f0000002000 [unknown] ([unknown])\n\norderd 4242/4243 [002] 1000.000200: 10101010 cpu-clock:\n\t55d1c0a1b2c3 compress_block+0x1f (/srv/order-api/orderd)\n\t55d1c0a1b000 handle_request(Request const&)+0x40 (/srv/order-api/orderd)\n\t7f0000001000 [unknown] (/usr/lib/libc.so.6)\n\t7f0000002000 [unknown] ([unknown])\n\norderd 4242/4250 [003] 1000.000300: 10101010 cpu-clock:\n\t55d1c0a1c111 json_parse+0x11 (/srv/order-api/orderd)\n\t55d1c0a1b000 handle_request(Request const&)+0x40 (/srv/order-api/orderd)\n\t7f0000001000 [unknown] (/usr/lib/libc.so.6)\n\nWeb Content 777/778 [001] 1000.000400: 10101010 cpu-clock:\n\t7f00000aa000 js::RunScript+0x10 (/usr/lib/firefox/libxul.so)\n\t7f00000ab000 (anonymous namespace)::Worker::run(int)+0x22 (/usr/lib/firefox/libxul.so)\n\norderd 4242/4243 [002] 1000.000500: 1 page-faults:\n\t55d1c0a1c111 json_parse+0x11 (/srv/order-api/orderd)\n\norderd 4242/4243 [002] 1000.000600: 10101010 cpu-clock:\n\t55d1c0a1c111 json_parse+0x11 (/srv/order-api/orderd)\n\t55d1c0a1b000 handle_request(Request const&)+0x40 (/srv/order-api/orderd)\n\t7f0000001000 [unknown] (/usr/lib/libc.so.6)\n",
  "noTail": "Web_Content;js::RunScript 10101010\norderd;[libc.so.6];handle_request;json_parse 10101010\norderd;[unknown];[libc.so.6];handle_request;compress_block 10101010\norderd;[unknown];[libc.so.6];handle_request;compress_block;native_safe_halt 10101010\n"
 },
 "two": {
  "text": "main;handle;parse 30 12\nmain;handle;parse;regexp.Compile 40 0\nmain;handle;render 20 26\nmain;handle;render;fmt.Sprintf 25 4\nmain;handle;compress 50 55\nmain;gc 10 3\nmain;handle;json.Marshal 15 18\n",
  "titles": [
   "json.Marshal (18 samples, 15.25%; +2.54%)",
   "compress (55 samples, 46.61%; +4.24%)",
   "regexp.Compile (0 samples, 0.00%; -33.90%)",
   "render (30 samples, 25.42%; +5.08%)",
   "all (118 samples, 100%)",
   "main (118 samples, 100.00%; 0.00%)",
   "fmt.Sprintf (4 samples, 3.39%; -17.80%)",
   "gc (3 samples, 2.54%; -5.93%)",
   "parse (12 samples, 10.17%; -15.25%)",
   "handle (115 samples, 97.46%; 0.00%)"
  ],
  "titlesNorm": [
   "render (30 samples, 25.42%; +11.86%)",
   "handle (115 samples, 97.46%; 0.00%)",
   "regexp.Compile (0 samples, 0.00%; -20.34%)",
   "main (118 samples, 100.00%; 0.00%)",
   "all (118 samples, 100%)",
   "compress (55 samples, 46.61%; +20.34%)",
   "gc (3 samples, 2.54%; -2.54%)",
   "fmt.Sprintf (4 samples, 3.39%; -9.32%)",
   "json.Marshal (18 samples, 15.25%; +7.63%)",
   "parse (12 samples, 10.17%; -5.08%)"
  ],
  "difffoldedN": [
   "main;gc 6 3",
   "main;handle;compress 31 55",
   "main;handle;json.Marshal 9 18",
   "main;handle;parse 18 12",
   "main;handle;parse;regexp.Compile 24 0",
   "main;handle;render 12 26",
   "main;handle;render;fmt.Sprintf 15 4"
  ]
 }
};

const nameOf = (r) => r.name

export default async ({ page, toolURL, screenshot, assert }) => {
  let nAssert = 0
  const ok = (c, m) => { nAssert++; assert(c, m) }
  const near = (a, b, tol, m) => ok(Math.abs(a - b) <= tol, `${m}：${a} vs ${b}（容差 ${tol}）`)
  const fmtV = (v, unit) => page.evaluate(([v, u]) => FL.fmtValue(v, u), [v, unit])
  const onTab = async (t) => {
    await page.click('#fl-tab-' + t)
    await page.waitForFunction((t) => !document.getElementById('pane-' + t).hidden && document.getElementById('fl-tab-' + t).getAttribute('aria-selected') === 'true', t)
  }
  const keyed = (canvasId, which) => page.waitForFunction(([id, w]) => {
    const c = document.getElementById(id)
    return c && c.dataset.key && c.dataset.key === FLApp.stateKey(w)
  }, [canvasId, which], { timeout: 15000 })
  const waitFlame = () => keyed('fl-canvas', 'flame')
  const curName = () => page.evaluate(() => FLApp.S.opened[FLApp.S.cur].name)
  const openEx = async (key) => {
    const before = await page.evaluate(() => FLApp.S.cur + ':' + FLApp.S.opened.length)
    await page.click(`[data-ex="${key}"]`)
    await page.waitForFunction(([k, b]) => { const o = FLApp.S.opened[FLApp.S.cur]; return o && o.src.ex === k && (FLApp.S.cur + ':' + FLApp.S.opened.length !== b || true) }, [key, before])
  }
  async function dlText(dl) { const s = await dl.createReadStream(); const ch = []; for await (const c of s) ch.push(c); return Buffer.concat(ch).toString('utf8') }
  async function download(sel) { const [dl] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); return { name: dl.suggestedFilename(), text: await dlText(dl) } }
  // 画布上的字：每段都在自己的方块里、在画布里，两两不重叠；且确实画了足够多段
  async function guardCanvasText(getter, label, minTexts) {
    const r = await page.evaluate((g) => {
      const v = g.split('.').reduce((o, k) => o[k], window)
      const cw = v.cv.getBoundingClientRect().width, out = []
      const d = v.drawn || []
      for (const b of d) {
        if (b.x < b.rx - 0.5 || b.x + b.w > b.rx + b.rw + 0.5) out.push('出方块：' + b.t)
        if (b.x < -0.5 || b.x + b.w > cw + 0.5) out.push('出画布：' + b.t)
      }
      for (let i = 0; i < d.length; i++) for (let j = i + 1; j < d.length; j++) {
        const a = d[i], b = d[j]
        if (a.x < b.x + b.w - 0.5 && b.x < a.x + a.w - 0.5 && a.y < b.y + b.h - 0.5 && b.y < a.y + a.h - 0.5) out.push('重叠：' + a.t + ' × ' + b.t)
      }
      return { bad: out, n: d.length }
    }, getter)
    ok(r.bad.length === 0, `${label} 画布文字守卫：${r.bad.slice(0, 4).join('; ')}`)
    ok(r.n >= minTexts, `${label} 画布上至少画了 ${minTexts} 段字（实得 ${r.n}）`)
  }

  await page.goto(toolURL)
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 20000 })
  ok((await page.getAttribute('#fl-back', 'href')) === '../../', '顶部返回链接指向 ../../')
  ok((await curName()) === 'Go 订单服务 · CPU（优化前）', '首次打开自动载入 Go CPU（优化前）示例')
  await waitFlame()

  // ───────── 1. pprof 解码：与 Google 官方 profile 包逐字节一致 ─────────
  const G = ORACLE.goBefore
  const meta = await page.evaluate(() => ({ types: FLApp.P().types.map((t) => [t.type, t.unit]), def: FLApp.P().defaultType, total: FLApp.V().total, folded: FL.toFolded(FLApp.V()), samples: FLApp.P().meta.samples }))
  ok(JSON.stringify(meta.types) === JSON.stringify(G.types), `样本类型 = pprof：${JSON.stringify(meta.types)}`)
  ok(meta.def === G.def, `默认样本类型下标 = pprof ${G.def}`)
  ok(meta.samples === G.samples, `样本条数 = ${G.samples}`)
  ok(meta.total === G.totals[G.def], `CPU 总量 = pprof ${G.totals[G.def]} ns`)
  ok(meta.total === G.topTotal, `CPU 总量 = go tool pprof -top 的 ${G.topTotal}`)
  ok(meta.folded === G.folded, '折叠栈（内联展开、函数粒度）与官方 profile 包逐字节相同')
  ok((await page.textContent('#fl-st-total')) === await fmtV(G.totals[G.def], 'nanoseconds'), '顶部总量读数')
  const hot = G.top.slice().sort((a, b) => b.flat - a.flat || (a.name < b.name ? -1 : 1))[0]
  ok((await page.textContent('#fl-st-hot')) === (100 * hot.flat / meta.total).toFixed(2) + '%', `最热函数占比 = pprof flat 第一 ${hot.name}`)
  ok((await page.getAttribute('#fl-st-hot', 'title')) === hot.name, '最热函数名')

  // ───────── 2. 函数表：flat / cum 逐个函数对 go tool pprof -top ─────────
  const top = await page.evaluate(() => FLApp.top().map((r) => ({ name: r.name, flat: r.flat, cum: r.cum })))
  ok(top.length === G.top.length, `函数个数 ${top.length} = pprof ${G.top.length}`)
  const pmap = new Map(G.top.map((r) => [r.name, r]))
  const badTop = top.filter((r) => { const o = pmap.get(r.name); return !o || o.flat !== r.flat || o.cum !== r.cum })
  ok(badTop.length === 0, `全部 ${top.length} 个函数的 flat / cum 与 pprof 一致（不一致：${badTop.slice(0, 3).map(nameOf).join(', ')}）`)
  ok(top.reduce((s, r) => s + r.flat, 0) === meta.total, '自身合计 = 总量')
  await onTab('top')
  await page.waitForFunction(() => document.querySelectorAll('#fl-top-body tr').length > 0)
  const dom = await page.$$eval('#fl-top-body tr', (rs) => rs.slice(0, 12).map((r) => Array.from(r.cells).map((c) => c.textContent)))
  const gSorted = G.top.slice().sort((a, b) => b.flat - a.flat || b.cum - a.cum || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
  for (let i = 0; i < 12; i++) {
    const r = gSorted[i]
    ok(dom[i][0] === r.name && dom[i][1] === await fmtV(r.flat, 'nanoseconds') && dom[i][3] === await fmtV(r.cum, 'nanoseconds'), `函数表第 ${i + 1} 行 ${r.name}`)
  }
  ok(dom[0][1] === '320 ms', `第一行自身显示「320 ms」（实得 ${dom[0][1]}）`)
  // 按总计排序：第一行 = pprof cum 最大
  await page.click('#fl-top-table th[data-k="cum"] button')
  await page.waitForFunction(() => document.querySelector('#fl-top-table th[data-k="cum"]').getAttribute('aria-sort') === 'descending')
  const cumMax = Math.max(...G.top.map((r) => r.cum))
  const firstCum = await page.$eval('#fl-top-body tr td:nth-child(4)', (td) => td.textContent)
  ok(firstCum === await fmtV(cumMax, 'nanoseconds'), `按总计排序后第一行 = pprof 最大 cum ${cumMax}`)
  await page.fill('#fl-top-filter', 'flate.(*compressor)')
  await page.waitForFunction(() => document.getElementById('fl-top-sum').textContent.includes('已筛选'))
  const nComp = G.top.filter((r) => r.name.toLowerCase().includes('flate.(*compressor)')).length
  ok((await page.$$('#fl-top-body tr')).length === nComp, `筛选「flate.(*compressor)」剩 ${nComp} 行`)
  await page.fill('#fl-top-filter', '')
  await page.click('#fl-top-table th[data-k="flat"] button')
  await page.waitForFunction(() => document.querySelector('#fl-top-table th[data-k="flat"]').getAttribute('aria-sort') === 'descending')
  // 导出 CSV
  const csv = await download('#fl-top-csv')
  const csvLines = csv.text.replace(/^\ufeff/, '').trim().split('\n')
  ok(csvLines.length === G.top.length + 1, `CSV 有 ${G.top.length} 行数据 + 表头`)
  ok(csvLines[0] === 'function,flat,flat_pct,cum,cum_pct,unit', 'CSV 表头')

  // ───────── 3. 过滤：pprof -focus / -ignore / -hide ─────────
  await onTab('flame')
  const setF = async (id, v) => { await page.fill(id, v); await page.waitForFunction(([id, v]) => FLApp.S[id.replace('#fl-', '')] === v, [id, v]); await waitFlame() }
  await setF('#fl-focus', G.focus.re)
  ok(await page.evaluate(() => FLApp.V().total) === G.focus.total, `聚焦 ${G.focus.re} 后总量 = pprof ${G.focus.total}`)
  const ftop = await page.evaluate(() => FLApp.top().slice(0, 8).map((r) => ({ name: r.name, flat: r.flat, cum: r.cum })))
  const fmap = new Map(ftop.map((r) => [r.name, r]))
  ok(G.focus.rows.every((o) => { const r = fmap.get(o.name); return r && r.flat === o.flat && r.cum === o.cum }), '聚焦后前 8 个函数 flat / cum = pprof')
  ok((await page.textContent('#fl-filtermsg')).includes('过滤后剩 ' + await fmtV(G.focus.total, 'nanoseconds')), '过滤提示写出剩余量')
  await setF('#fl-focus', '')
  await setF('#fl-ignore', G.ignore.re)
  ok(await page.evaluate(() => FLApp.V().total) === G.ignore.total, `忽略 ${G.ignore.re} 后总量 = pprof ${G.ignore.total}`)
  await setF('#fl-ignore', '')
  await setF('#fl-hide', G.hide.re)
  ok(await page.evaluate(() => FLApp.V().total) === G.hide.total, `隐藏 ${G.hide.re} 后总量 = pprof ${G.hide.total}（帧全被隐藏的样本整条丢掉）`)
  const htop = await page.evaluate(() => FLApp.top().slice(0, 6).map((r) => r.name + '|' + r.flat + '|' + r.cum))
  ok(JSON.stringify(htop) === JSON.stringify(G.hide.top.map((r) => r.name + '|' + r.flat + '|' + r.cum)), '隐藏后前 6 个函数 = pprof')
  await setF('#fl-hide', '')
  await setF('#fl-focus', G.both.focus)
  await setF('#fl-ignore', G.both.ignore)
  ok(await page.evaluate(() => FLApp.V().total) === G.both.total, `聚焦 json + 忽略 Unmarshal 总量 = pprof ${G.both.total}`)
  await setF('#fl-ignore', '')
  await setF('#fl-focus', '(')
  ok((await page.getAttribute('#fl-focus', 'aria-invalid')) === 'true', '非法正则：输入框标红')
  ok((await page.textContent('#fl-filtermsg')).includes('正则写错了'), '非法正则：给出提示')
  ok(await page.evaluate(() => FLApp.V().total) === meta.total, '非法正则不生效（总量不变）')
  await setF('#fl-focus', '')
  ok((await page.getAttribute('#fl-focus', 'aria-invalid')) === null, '改对后不再标红')

  // ───────── 4. 火焰图：几何、缩放、键盘、搜索 ─────────
  const geom = await page.evaluate(() => {
    const f = FLApp.flame, W = f.cv.getBoundingClientRect().width, out = {}
    for (const row of f.rows) for (const it of row || []) { const n = it.n; const name = n.n < 0 ? 'all' : f.frames[n.n]; if (!out[name] || it.w > out[name].w) out[name] = { x: it.x, w: it.w, d: n.d } }
    return { W, out, rects: +f.cv.dataset.rects }
  })
  const handle = G.top.find((r) => r.name === 'main.handle')
  near(geom.out['main.handle'].w / geom.W, handle.cum / meta.total, 1.5 / geom.W, 'main.handle 方块宽度 = cum 占比')
  ok(geom.out['all'].w > geom.W - 1, '根方块占满全宽')
  ok(geom.rects > 150, `火焰图画了 ${geom.rects} 个方块`)
  await guardCanvasText('FLApp.flame', '火焰图', 40)
  // 点 main.compress 放大：它变成满宽，面包屑是官方折叠栈里它的祖先路径
  const compPath = G.folded.split('\n').find((l) => l.includes(';main.compress;')).split(';')
  const anc = compPath.slice(0, compPath.indexOf('main.compress') + 1)
  const mc = geom.out['main.compress']
  await page.$eval('#fl-canvas', (c) => c.scrollIntoView({ block: 'start' }))
  const box = await page.$eval('#fl-canvas', (c) => { const r = c.getBoundingClientRect(); return { x: r.left, y: r.top } })
  await page.mouse.click(box.x + mc.x + mc.w / 2, box.y + mc.d * 18 + 9)
  await waitFlame()
  const z = await page.evaluate(() => { const f = FLApp.flame; return { name: f.frames[f.focus.n], x0: f.x0, span: f.span, crumbs: Array.from(document.querySelectorAll('#fl-crumbs button')).map((b) => b.title) } })
  ok(z.name === 'main.compress', '单击后放大到 main.compress')
  ok(JSON.stringify(z.crumbs) === JSON.stringify(['全部', ...anc]), `面包屑 = 官方折叠栈里的祖先路径：${anc.join(' › ')}`)
  const zg = await page.evaluate(() => { const f = FLApp.flame; for (const row of f.rows) for (const it of row || []) if (it.n === f.focus) return { x: it.x, w: it.w, W: f.cv.getBoundingClientRect().width }; return null })
  ok(zg && zg.x < 0.5 && zg.w > zg.W - 1, '放大后 main.compress 占满全宽')
  await guardCanvasText('FLApp.flame', '放大后的火焰图', 15)
  // 键盘：画布获焦 → ↑ 到父帧 main.handle → ↓ 走到它最重的子帧（由官方折叠栈汇总；它不是字母序第一个，场景不退化）
  await page.focus('#fl-canvas')
  await page.keyboard.press('ArrowUp')
  await page.waitForFunction(() => { const f = FLApp.flame; return f.sel && f.frames[f.sel.n] === 'main.handle' })
  ok(true, '↑ 选中父帧 main.handle')
  const kids = G.folded.split('\n').filter((l) => l.includes(';main.handle;')).reduce((m, l) => { const fr = l.replace(/ \d+$/, '').split(';'); const c = fr[fr.indexOf('main.handle') + 1]; m[c] = (m[c] || 0) + Number(l.split(' ').pop()); return m }, {})
  const heavyName = Object.entries(kids).sort((a, b) => b[1] - a[1])[0][0]
  const firstAlpha = Object.keys(kids).sort()[0]
  ok(heavyName !== firstAlpha, `场景不退化：main.handle 最重的子帧 ${heavyName} ≠ 字母序第一个 ${firstAlpha}`)
  await page.keyboard.press('ArrowDown')
  const kd = await page.evaluate(() => { const f = FLApp.flame; return { sel: f.frames[f.sel.n], parent: f.sel.p && f.frames[f.sel.p.n] } })
  ok(kd.parent === 'main.handle', '↓ 选中 main.handle 的子帧')
  ok(kd.sel === heavyName, `↓ 选中最重的子帧 ${heavyName}`)
  await page.waitForFunction((n) => document.getElementById('fl-live').textContent.startsWith(n), heavyName)
  ok(true, '读屏播报选中的帧')
  await page.keyboard.press('Escape')
  await waitFlame()
  ok(await page.evaluate(() => FLApp.flame.focus === FLApp.flame.root), 'Esc 复位缩放')
  // 搜索：命中占比 = pprof -focus 同一正则的总量
  await page.fill('#fl-search', G.focus.re)
  await page.waitForFunction(() => document.getElementById('fl-match').textContent.endsWith('%'))
  ok((await page.textContent('#fl-match')) === (100 * G.focus.total / meta.total).toFixed(2) + '%', `搜索命中占比 = pprof -focus 总量 ${G.focus.total} / 总量`)
  await waitFlame()
  const colors = await page.evaluate(() => { const f = FLApp.flame; const hit = []; const miss = []; for (const row of f.rows) for (const it of row || []) { if (it.n.n < 0) continue; (f.hit(it.n.n) ? hit : miss).push(f.colorOf(it.n)) } return { hit: [...new Set(hit)], miss: [...new Set(miss)] } })
  ok(colors.hit.length === 1 && colors.hit[0] === '#faff69', '命中的方块全部电光黄')
  ok(colors.miss.length === 1 && colors.miss[0] === '#242424', '未命中的方块全部压暗')
  await page.press('#fl-search', 'Enter')
  await page.waitForFunction(() => FLApp.flame.sel && FLApp.flame.hit(FLApp.flame.sel.n))
  ok(true, '回车跳到第一个命中的方块')
  await page.fill('#fl-search', '')
  await page.waitForFunction(() => document.getElementById('fl-match').textContent === '')
  // 方向 / 排序 / 配色
  await page.click('#fl-or-flame')
  await waitFlame()
  const flip = await page.evaluate(() => { const f = FLApp.flame; return { inv: f.inverted, rootY: f.yOf(0), maxY: f.yOf(f.maxD) } })
  ok(!flip.inv && flip.rootY > flip.maxY, '火焰方向：根在最下面')
  await page.click('#fl-or-icicle')
  await page.click('#fl-ord-weight')
  await waitFlame()
  const order = await page.evaluate(() => FLApp.T().c.map((c) => c.t))
  ok(order.every((t, i) => !i || order[i - 1] >= t), '「重的在左」：根的子帧按总量降序')
  await page.click('#fl-ord-alpha')
  await waitFlame()

  // ───────── 5. 粒度：函数 + 行号（pprof -lines） ─────────
  await page.selectOption('#fl-gran', 'line')
  await waitFlame()
  const lt = await page.evaluate(() => FLApp.top().slice(0, 5).map((r) => ({ name: r.name, flat: r.flat, cum: r.cum })))
  ok(JSON.stringify(lt) === JSON.stringify(G.linesTop), `行号粒度的前 5 行 = go tool pprof -lines：${lt[0] && lt[0].name}`)
  await page.selectOption('#fl-gran', 'function')
  await waitFlame()

  // ───────── 6. 调用关系：对 go tool pprof -peek ─────────
  await onTab('sandwich')
  await page.selectOption('#fl-sw-fn', G.peek.fn)
  await keyed('fl-sw-callers', 'sandwich')
  const sw = await page.evaluate(() => {
    const a = FLApp.swCallers.root, b = FLApp.swCallees.root, F = a.frames
    return { rootA: a.t, rootB: b.t, callers: (a.c || []).map((c) => [F[c.n], c.t]), callees: (b.c || []).map((c) => [F[c.n], c.t]), selfB: b.s }
  })
  ok(sw.rootA === G.peek.self.cum && sw.rootB === G.peek.self.cum, `调用者 / 被调用者的根 = pprof cum ${G.peek.self.cum}`)
  ok(sw.selfB === G.peek.self.flat, `被调用者树的根自身 = pprof flat ${G.peek.self.flat}`)
  const sortPairs = (a) => a.map((x) => x[0] + '=' + x[1]).sort().join(',')
  ok(sortPairs(sw.callers) === sortPairs(G.peek.callers.map((c) => [c.name, c.w])), `直接调用者及权重 = pprof -peek：${sortPairs(sw.callers)}`)
  ok(sortPairs(sw.callees) === sortPairs(G.peek.callees.map((c) => [c.name, c.w])), `直接被调用者及权重 = pprof -peek：${sortPairs(sw.callees)}`)
  ok((await page.textContent('#fl-sw-callers-n')) === G.peek.callers.length + ' 个直接调用者', '调用者个数')
  await guardCanvasText('FLApp.swCallers', '调用者图', 3)
  await guardCanvasText('FLApp.swCallees', '被调用者图', 3)
  // 从函数表点一行跳过来
  await onTab('top')
  await page.click(`#fl-top-body tr[data-name="${'runtime.madvise'}"]`)
  await page.waitForFunction(() => FLApp.S.tab === 'sandwich' && document.getElementById('fl-sw-fn').value === 'runtime.madvise')
  ok(true, '函数表点一行 → 调用关系页选中该函数')

  // ───────── 7. 差分：对 go tool pprof -diff_base ─────────
  await page.click('#fl-ex-diff')
  await page.waitForFunction(() => FLApp.S.tab === 'diff')
  await keyed('fl-diff-canvas', 'diff')
  const dtop = await page.evaluate(() => {
    const srcA = FLApp.S.opened.find((o) => o.id === FLApp.S.diffA), srcB = FLApp.S.opened.find((o) => o.id === FLApp.S.diffB)
    const va = FL.view(srcA.profile, {}), vb = FL.view(srcB.profile, {})
    return { rows: FL.diffTop(va, vb).map((r) => ({ name: r.name, flat: r.dflat, cum: r.dcum })), a: srcA.name, b: srcB.name, ta: va.total, tb: vb.total }
  })
  ok(dtop.a.includes('优化前') && dtop.b.includes('优化后'), '差分示例：基线 = 优化前，对比 = 优化后')
  ok(dtop.tb === ORACLE.goAfter.totals[1], `新总量 = pprof ${ORACLE.goAfter.totals[1]}`)
  const dmap = new Map(dtop.rows.map((r) => [r.name, r]))
  const dbad = ORACLE.diff.rows.filter((o) => { const r = dmap.get(o.name); return !r || r.flat !== o.flat || r.cum !== o.cum })
  ok(dbad.length === 0, `前 ${ORACLE.diff.rows.length} 个变化最大的函数 Δflat / Δcum = pprof -diff_base（不一致：${dbad.map(nameOf).join(', ')}）`)
  ok(dtop.tb - dtop.ta === ORACLE.diff.net, `净变化 = pprof -diff_base 的 ${ORACLE.diff.net}`)
  const firstDiff = await page.$$eval('#fl-diff-body tr', (rs) => rs.slice(0, 3).map((r) => Array.from(r.cells).map((c) => c.textContent)))
  ok(firstDiff[0][0] === ORACLE.diff.rows[0].name && firstDiff[0][1] === '+' + await fmtV(ORACLE.diff.rows[0].flat, 'nanoseconds'), `变化表第一行 ${ORACLE.diff.rows[0].name} ${firstDiff[0][1]}`)
  ok((await page.textContent('#fl-diff-chg')) === ((x) => (x > 0 ? '+' : '−') + Math.abs(x).toFixed(1) + '%')(100 * (ORACLE.goAfter.totals[1] - G.totals[1]) / G.totals[1]), '总量变化百分比带正确符号')
  const dc = await page.evaluate((name) => {
    const d = FLApp.diff, out = {}
    ;(function walk(n) { if (n.n >= 0 && d.frames[n.n] === name && !out.c) out.c = d.colorOf(n); if (n.c) n.c.forEach(walk) })(d.root)
    const m = /rgb\((\d+),(\d+),(\d+)\)/.exec(out.c)
    return { c: out.c, r: +m[1], b: +m[3], t1: +d.cv.dataset.total1 }
  }, ORACLE.diff.rows[0].name)
  ok(dc.r > 200 && dc.b < 120, `增长最多的 ${ORACLE.diff.rows[0].name} 画成红色（${dc.c}）`)
  ok(dc.t1 === ORACLE.goAfter.totals[1], '宽度按新：根宽 = 新总量')
  await guardCanvasText('FLApp.diff', '差分火焰图', 30)
  await page.click('#fl-dw-base')
  await keyed('fl-diff-canvas', 'diff')
  ok(await page.evaluate(() => FLApp.diff.root.t) === await page.evaluate(() => FLApp.diff.root.b0), '宽度按基线：根宽 = （归一化后的）基线总量')
  await page.click('#fl-dw-new')
  await page.click('#fl-diff-swap')
  await keyed('fl-diff-canvas', 'diff')
  ok((await page.$eval('#fl-diff-a', (s) => s.selectedOptions[0].textContent)).includes('优化后'), '交换基线与对比')
  await page.click('#fl-diff-swap')

  // ───────── 8. 两列折叠栈：对 flamegraph.pl 的差分 title ─────────
  await page.fill('#fl-paste', ORACLE.two.text)
  await page.click('#fl-paste-go')
  await page.waitForFunction(() => FLApp.S.opened[FLApp.S.cur].name.startsWith('粘贴的折叠栈'))
  await onTab('diff')
  await page.waitForFunction(() => document.getElementById('fl-diff-a').value.endsWith('#0') && document.getElementById('fl-diff-b').value.endsWith('#1'))
  ok(true, '两列折叠栈：差分页自动选「列 1 → 列 2」')
  await page.uncheck('#fl-diff-norm')
  await keyed('fl-diff-canvas', 'diff')
  const twoNodes = await page.evaluate(() => { const d = FLApp.diff.root, out = {}; (function w(n) { out[n.n < 0 ? 'all' : d.frames[n.n]] = { t: n.t, ds: n.dSelf || 0 }; if (n.c) n.c.forEach(w) })(d); return { out, T: d.t } })
  let twoOk = 0
  for (const t of ORACLE.two.titles) {
    const m = /^(.*) \(([\d,]+) samples, ([\d.]+)%(?:; ([+-]?[\d.]+)%)?\)$/.exec(t)
    if (!m) continue
    const nd = twoNodes.out[m[1]]
    if (!nd) { ok(false, `flamegraph.pl 的帧 ${m[1]} 页面上没有`); continue }
    ok(nd.t === Number(m[2].replace(/,/g, '')), `${m[1]} 宽度 = flamegraph.pl ${m[2]} samples`)
    if (m[4] !== undefined) near(100 * nd.ds / twoNodes.T, Number(m[4]), 0.005 + 1e-9, `${m[1]} 自身变化 = flamegraph.pl ${m[4]}%`)
    twoOk++
  }
  ok(twoOk === ORACLE.two.titles.length, `flamegraph.pl 的 ${ORACLE.two.titles.length} 个 title 全部对上`)
  // 归一化：对 difffolded.pl -n + flamegraph.pl（基线逐条 int(旧 × 新总量 ÷ 旧总量)）
  await page.check('#fl-diff-norm')
  await keyed('fl-diff-canvas', 'diff')
  const normNodes = await page.evaluate(() => { const d = FLApp.diff.root, out = {}; (function w(n) { out[n.n < 0 ? 'all' : d.frames[n.n]] = { t: n.t, ds: n.dSelf || 0, b0: n.b0 }; if (n.c) n.c.forEach(w) })(d); return { out, T: d.t, T0: d.b0, norm: d.normalized } })
  ok(normNodes.norm === true, '两列总量不同时确实做了归一化')
  const baseN = ORACLE.two.difffoldedN.reduce((s, l) => s + Number(l.split(' ').slice(-2)[0]), 0)
  ok(normNodes.T0 === baseN, `归一化后的基线总量 = difffolded.pl -n 第一列之和 ${baseN}`)
  let normOk = 0
  for (const t of ORACLE.two.titlesNorm) {
    const m = /^(.*) \(([\d,]+) samples, ([\d.]+)%(?:; ([+-]?[\d.]+)%)?\)$/.exec(t)
    if (!m || m[4] === undefined) continue
    const nd = normNodes.out[m[1]]
    near(100 * nd.ds / normNodes.T, Number(m[4]), 0.005 + 1e-9, `归一化后 ${m[1]} 自身变化 = flamegraph.pl ${m[4]}%`)
    normOk++
  }
  ok(normOk >= 6, `归一化差分对上 ${normOk} 个带变化的 title`)

  // ───────── 9. perf script：对 stackcollapse-perf.pl（默认 / --pid / --kernel / --all） ─────────
  await onTab('flame')
  for (const opt of ['', 'pid', 'kernel', 'all']) {
    await page.selectOption('#fl-perfopt', opt)
    await page.fill('#fl-paste', ORACLE.perf.text)
    const n0 = await page.evaluate(() => FLApp.S.opened.length)
    await page.click('#fl-paste-go')
    await page.waitForFunction((n0) => FLApp.S.opened.length === n0 + 1 && FLApp.P().format === 'perf', n0)
    await waitFlame()
    const exp = await download('#fl-exp-folded')
    ok(exp.text === ORACLE.perf[opt || 'def'], `perf script ${opt ? '--' + opt : '默认'} 导出的折叠栈 = stackcollapse-perf.pl 原样输出`)
  }
  ok((await page.textContent('#fl-warn')).includes('page-faults') === false && (await page.textContent('#fl-warn')).includes('cpu-clock'), '多事件时提示按第一种事件 cpu-clock 统计')
  await page.selectOption('#fl-perfopt', '')
  // 末尾样本后面没有空行：照 stackcollapse-perf.pl 不计入，并提示
  await page.fill('#fl-paste', ORACLE.perf.noTailText)
  { const n0 = await page.evaluate(() => FLApp.S.opened.length)
    await page.click('#fl-paste-go')
    await page.waitForFunction((n0) => FLApp.S.opened.length === n0 + 1, n0) }
  await waitFlame()
  ok((await download('#fl-exp-folded')).text === ORACLE.perf.noTail, '末尾没有空行的 perf script：折叠结果 = stackcollapse-perf.pl（最后一个样本不计）')
  ok((await page.textContent('#fl-warn')).includes('最后一个样本后面没有空行'), '末尾没有空行时给出提示')
  // 非法 / 空输入
  await page.fill('#fl-paste', 'hello world\nno numbers here')
  await page.click('#fl-paste-go')
  await page.waitForFunction(() => document.getElementById('fl-msg').textContent.includes('没解析出任何调用栈'))
  ok((await page.getAttribute('#fl-msg', 'class')).includes('fl-bad'), '无法解析的文本：红色提示')
  await page.fill('#fl-paste', '')
  await page.click('#fl-paste-go')
  await page.waitForFunction(() => document.getElementById('fl-msg').textContent === '先粘点东西进来')
  ok(true, '空输入提示')
  await page.fill('#fl-paste', '{"nodes": 3}')
  await page.click('#fl-paste-go')
  await page.waitForFunction(() => document.getElementById('fl-msg').textContent.startsWith('解析失败'))
  ok(true, '坏 JSON：提示解析失败')

  // ───────── 10. Python 折叠栈：对 flamegraph.pl 与 Perl 自身统计 ─────────
  await openEx('pyLogs')
  await waitFlame()
  const py = await page.evaluate(() => ({ total: FLApp.V().total, top: FLApp.top().slice(0, 5).map((r) => ({ name: r.name, flat: r.flat })), gen: (function f(n, out) { if (n.n >= 0 && FLApp.T().frames[n.n] === 'gen_lines (sampler.py:28)') out.push(n.t); if (n.c) n.c.forEach((c) => f(c, out)); return out })(FLApp.T(), []) }))
  ok(py.total === ORACLE.py.all && py.total === ORACLE.py.total, `Python 总样本 = flamegraph.pl 的 all ${ORACLE.py.all}`)
  ok(JSON.stringify(py.top) === JSON.stringify(ORACLE.py.selfTop), '自身前 5 = Perl 按叶子统计')
  ok(JSON.stringify(py.gen) === JSON.stringify(ORACLE.py.genLinesFrames), `gen_lines (sampler.py:28) 方块总量 = flamegraph.pl title ${ORACLE.py.genLinesFrames}`)
  await page.check('#fl-rec')
  await waitFlame()
  ok(await page.evaluate(() => FLApp.V().stacks.every((s) => s.f.every((x, i) => !i || x !== s.f[i - 1]))), '合并直接递归：不再有相邻同名帧')
  await page.uncheck('#fl-rec')
  await waitFlame()

  // ───────── 11. Node cpuprofile：V8 的 hitCount 与时间戳 ─────────
  await openEx('nodeBlog')
  await waitFlame()
  const nd = await page.evaluate(() => {
    const p = FLApp.P(), vs = FL.view(p, { type: 0 }), vt = FL.view(p, { type: 1 })
    const self = new Map()
    for (const s of vs.stacks) { const k = vs.frames[s.f[s.f.length - 1]]; self.set(k, (self.get(k) || 0) + s.w) }
    return { def: p.defaultType, samples: vs.total, time: vt.total, meta: p.meta, self: [...self.entries()], warn: p.warnings }
  })
  ok(nd.def === 1, 'cpuprofile 默认看时间')
  ok(nd.samples === ORACLE.node.samples, `样本数 = samples[] 长度 ${ORACLE.node.samples}`)
  ok(nd.time === ORACLE.node.spanUs, `时间总量 = endTime − 首个样本时间戳 = ${ORACLE.node.spanUs} µs`)
  const selfMap = new Map(nd.self)
  for (const [lab, hc] of ORACLE.node.topSelf) near(selfMap.get(lab) || 0, hc, 1, `${lab.split(' ')[0]} 自身样本数 ≈ V8 hitCount ${hc}（两份记录最多差 1）`)
  ok(nd.meta.hitCountMaxDiff <= 1 && nd.warn.length === 0, `V8 hitCount 与 samples[] 每节点最多差 1（实际 ${nd.meta.hitCountMaxDiff}），不报警`)
  await onTab('timeline')
  await keyed('fl-tl-canvas', 'timeline')
  const tl = await page.evaluate(() => ({ total: FLApp.tl.tl.total, n: +document.getElementById('fl-tl-canvas').dataset.blocks, ticks: FLApp.tl.ticks.length, empty: getComputedStyle(document.getElementById('fl-tl-empty')).display }))
  ok(tl.total === ORACLE.node.spanUs, '时间线总长 = 时间总量')
  ok(tl.n > 100 && tl.ticks >= 3, `时间线画了 ${tl.n} 块、${tl.ticks} 个刻度`)
  ok(tl.empty === 'none', '有时间顺序时不显示空状态')
  await guardCanvasText('FLApp.tl', '时间线', 20)
  await page.$eval('#fl-tl-canvas', (c) => c.scrollIntoView({ block: 'start' }))
  const tb = await page.$eval('#fl-tl-canvas', (c) => { const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width } })
  await page.mouse.move(tb.x + tb.w * 0.25, tb.y + 30)
  await page.mouse.down(); await page.mouse.move(tb.x + tb.w * 0.5, tb.y + 30, { steps: 4 }); await page.mouse.up()
  await page.waitForFunction(() => FLApp.tl.t0 > 0)
  const zt = await page.evaluate(() => [FLApp.tl.t0, FLApp.tl.t1, FLApp.tl.tl.total])
  near(zt[0] / zt[2], 0.25, 0.01, '拖选放大：起点约 25%')
  near(zt[1] / zt[2], 0.5, 0.01, '拖选放大：终点约 50%')
  await page.dblclick('#fl-tl-canvas')
  await page.waitForFunction(() => FLApp.tl.t0 === 0)
  await openEx('pyLogs')
  await page.waitForFunction(() => getComputedStyle(document.getElementById('fl-tl-empty')).display !== 'none')
  ok(true, '没有时间顺序的 profile 显示空状态')

  // ───────── 12. 内存分配 profile：切换样本类型 ─────────
  await onTab('flame')
  await openEx('goAllocs')
  await waitFlame()
  const A = ORACLE.allocs
  const al = await page.evaluate(() => ({ opts: Array.from(document.querySelectorAll('#fl-type option')).map((o) => o.textContent), sel: document.getElementById('fl-type').value, total: FLApp.V().total }))
  ok(al.opts.length === A.types.length && al.opts[0] === A.types[0][0] + '（' + A.types[0][1] + '）', `样本类型下拉 = ${A.types.map((t) => t[0]).join(' / ')}`)
  ok(Number(al.sel) === A.def, `默认类型 = pprof 默认 ${A.types[A.def][0]}`)
  ok(al.total === A.totals[A.def], `alloc_space 总量 = ${A.totals[A.def]} B`)
  for (let i = 0; i < A.types.length; i++) {
    await page.selectOption('#fl-type', String(i))
    await waitFlame()
    const r = await page.evaluate(() => ({ total: FLApp.V().total, top: FLApp.top().slice(0, 3).map((x) => ({ name: x.name, flat: x.flat, cum: x.cum })) }))
    ok(r.total === A.totals[i], `${A.types[i][0]} 总量 = ${A.totals[i]}`)
    ok(JSON.stringify(r.top) === JSON.stringify(A.top3[i]), `${A.types[i][0]} 前 3 = go tool pprof -sample_index=${A.types[i][0]}`)
  }
  ok((await page.textContent('#fl-st-total-k')) === '总量 · ' + A.types[A.types.length - 1][0], '顶部总量标签跟着样本类型变')

  // ───────── 13. 文件导入：一次选两个 → 自动进差分 ─────────
  const b64 = await page.evaluate(() => [FL_DATA.goCpuBefore.b64, FL_DATA.goCpuAfter.b64])
  await page.setInputFiles('#fl-file', [
    { name: 'before.pb.gz', mimeType: 'application/octet-stream', buffer: Buffer.from(b64[0], 'base64') },
    { name: 'after.pb.gz', mimeType: 'application/octet-stream', buffer: Buffer.from(b64[1], 'base64') },
  ])
  await page.waitForFunction(() => FLApp.S.tab === 'diff' && FLApp.S.opened.some((o) => o.name === 'after.pb.gz'))
  await keyed('fl-diff-canvas', 'diff')
  ok((await page.$eval('#fl-diff-a', (s) => s.selectedOptions[0].textContent)) === 'before.pb.gz', '两个文件：基线 = 第一个')
  ok((await page.$eval('#fl-diff-b', (s) => s.selectedOptions[0].textContent)) === 'after.pb.gz', '两个文件：对比 = 第二个')
  ok(await page.evaluate(() => FL.toFolded(FL.view(FLApp.S.opened.find((o) => o.name === 'after.pb.gz').profile, {}))) === ORACLE.goAfter.folded, '上传的 after.pb.gz（gzip）解码 = 官方 profile 包')

  // ───────── 14. 导出 SVG / PNG / 折叠栈 ─────────
  await onTab('flame')
  await page.selectOption('#fl-prof', { label: 'before.pb.gz' })
  await waitFlame()
  const fold = await download('#fl-exp-folded')
  ok(fold.name === 'before.pb.folded' && fold.text === G.folded, '导出折叠栈（cpu）= 官方 profile 包输出')
  const svg = await download('#fl-exp-svg')
  ok(svg.text.startsWith('<?xml') && svg.text.includes('<svg') && (svg.text.match(/<rect /g) || []).length > 150, 'SVG 导出：完整文档、方块齐全')
  ok(svg.text.includes('main.handle (' + await fmtV(handle.cum, 'nanoseconds') + ', ' + (100 * handle.cum / meta.total).toFixed(2) + '%)'), 'SVG 的 title 写着 main.handle 的总量与占比')
  const png = await Promise.all([page.waitForEvent('download'), page.click('#fl-exp-png')])
  ok(png[0].suggestedFilename() === 'flame.png', 'PNG 导出')

  // ───────── 15. 资料库：自动入库、刷新后回来、删除 / 撤销、偏好离页补写 ─────────
  await onTab('lib')
  const libN = await page.$$eval('#fl-lib-list .fl-libitem', (n) => n.length)
  const idx = await page.evaluate(() => FLApp.libIndex())
  ok(libN === idx.length && libN >= 6, `粘贴与上传的 profile 都自动进了资料库（${libN} 份），示例不入库`)
  ok(idx.every((e) => !e.name.startsWith('Go 订单服务')), '内置示例没有进资料库')
  await onTab('flame')
  await page.click('#fl-or-flame')
  await page.click('#fl-pal-hot')
  await page.click('#fl-tab-lib')
  await page.reload()   // 防抖 300 ms 内立刻刷新：靠 pagehide 补写
  await page.waitForFunction(() => document.body.dataset.ready === '1')
  const back = await page.evaluate(() => ({ name: FLApp.S.opened[FLApp.S.cur].name, tab: FLApp.S.tab, orient: FLApp.S.orient, pal: FLApp.S.palette, total: FLApp.V().total, pressed: document.getElementById('fl-pal-hot').getAttribute('aria-pressed') }))
  ok(back.name === 'before.pb.gz' && back.total === meta.total, '刷新后自动打开上次看的 profile（从资料库）')
  ok(back.tab === 'lib' && back.orient === 'flame' && back.pal === 'hot' && back.pressed === 'true', '刷新后方向 / 配色 / 页签都还在（pagehide 补写防抖）')
  ok(await page.evaluate(() => FL.toFolded(FLApp.V())) === G.folded, '从资料库还原的 profile 与原始解码逐字节相同')
  const firstId = await page.$eval('#fl-lib-list .fl-libitem', (n) => n.dataset.id)
  const n0 = await page.$$eval('#fl-lib-list .fl-libitem', (n) => n.length)
  await page.click(`#fl-lib-list .fl-libitem[data-id="${firstId}"] .fl-lib-del`)
  await page.waitForFunction((n0) => document.querySelectorAll('#fl-lib-list .fl-libitem').length === n0 - 1, n0)
  ok(await page.evaluate((id) => localStorage.getItem('fl:lib:item:' + id) === null, firstId), '删除后 localStorage 条目也没了')
  await page.click('#fl-lib-undo')
  await page.waitForFunction((n0) => document.querySelectorAll('#fl-lib-list .fl-libitem').length === n0, n0)
  ok(await page.evaluate((id) => localStorage.getItem('fl:lib:item:' + id) !== null, firstId), '撤销删除')
  await page.click(`#fl-lib-list .fl-libitem[data-id="${firstId}"] .fl-lib-ren`)
  await page.fill('#fl-lib-list .fl-lib-name-in', '改过名的 profile')
  await page.press('#fl-lib-list .fl-lib-name-in', 'Enter')
  await page.waitForFunction((id) => FLApp.libIndex().find((e) => e.id === id).name === '改过名的 profile', firstId)
  ok(true, '重命名写回资料库')
  await onTab('flame')
  await page.click('#fl-or-icicle')
  await page.click('#fl-pal-pkg')
  await waitFlame()

  // ───────── 16. 页签键盘 ─────────
  await page.focus('#fl-tab-flame')
  await page.keyboard.press('ArrowRight')
  await page.waitForFunction(() => document.getElementById('fl-tab-top').getAttribute('aria-selected') === 'true' && document.activeElement.id === 'fl-tab-top')
  await page.keyboard.press('End')
  await page.waitForFunction(() => document.getElementById('fl-tab-about').getAttribute('aria-selected') === 'true')
  await page.keyboard.press('Home')
  await page.waitForFunction(() => document.getElementById('fl-tab-flame').getAttribute('aria-selected') === 'true')
  ok(true, '页签可用方向键 / Home / End 切换')

  // ───────── 17. 渲染守卫 ─────────
  const tabs = ORACLE.meta.tabs
  const paneSel = (t) => `#pane-${t}`
  await openEx('goCpuAfter')
  await waitFlame()
  await guardHidden(page, { assert: ok, panesRoot: '#fl-panes', tabs })
  await guardUniqueIds(page, { assert: ok, minIds: 100 })
  const nCtl = await guardControlSize(page, { assert: ok, tabs, onTab, paneSel, minControls: 30 })
  ok(nCtl >= 30, `控件尺寸守卫扫到 ${nCtl} 个页签内控件`)
  const nChrome = await guardControlSize(page, { assert: ok, tabs: ['bar', 'paste'], onTab: async () => {}, paneSel: (t) => (t === 'bar' ? '#fl-work > .fl-bar, #fl-work > .fl-filters' : '.fl-paste'), minControls: 8 })
  ok(nChrome >= 8, `工具栏 / 粘贴区扫到 ${nChrome} 个控件`)
  await guardTextTransform(page, { assert: ok, tabs, onTab, paneSel, labelSel: 'th, dt, label, .fl-lab, .fl-eyebrow, .fl-stat-k' })
  await guardOverflow(page, { assert: ok, tabs, onTab, panesRoot: 'body', viewports: [390, 768, 1280] })
  await onTab('about')
  await guardEscape(page, { assert: ok, cardSel: '.fl-card', childSel: 'canvas,table,dl,h3,p,textarea,.fl-code' })
  // 窄屏下火焰图也要画、字不越界
  await page.setViewportSize({ width: 390, height: 900 })
  await onTab('flame')
  await waitFlame()
  await guardCanvasText('FLApp.flame', '窄屏火焰图', 8)
  ok(await page.evaluate(() => FLApp.flame.cv.getBoundingClientRect().width <= document.documentElement.clientWidth), '窄屏火焰图不超出视口')
  await page.setViewportSize({ width: 1280, height: 850 })

  // ───────── 缩略图：Go 优化前的火焰图 ─────────
  await page.selectOption('#fl-prof', { label: 'before.pb.gz' })
  await onTab('flame')
  await waitFlame()
  await page.evaluate(() => window.scrollTo(0, document.getElementById('fl-tabs').getBoundingClientRect().top + window.scrollY - 150))
  await page.waitForTimeout(150)
  await screenshot('thumb.png')
  console.log(`    flame-lab：${nAssert} 条断言`)
}
