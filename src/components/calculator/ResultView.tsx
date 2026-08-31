'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalculationResult, AnswerDetails } from '@/lib/calculate';
import {
  Trophy,
  Sparkles,
  Check,
  Calculator,
  CheckSquare,
  Square,
  ArrowLeftRight,
  Search,
  Zap,
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  Percent,
} from 'lucide-react';

interface ResultViewProps {
  result: CalculationResult | null;
  onToggleTransfer?: (index: number) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
}

export default function ResultView({
  result,
  onToggleTransfer,
  onSelectAll,
  onDeselectAll,
}: ResultViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'compact-cards'>('table');
  const [showStepsBreakdown, setShowStepsBreakdown] = useState(false);

  if (!result) {
    return null;
  }

  const transferredItems = result.section1.filter(item => item.isTransferred);
  const transferredCount = transferredItems.length;
  const totalCount = result.section1.length;
  const isAllSelected = transferredCount === totalCount && totalCount > 0;

  // Filtered items based on quick search
  const filteredSection1 = useMemo(() => {
    if (!searchTerm.trim()) return result.section1;
    const term = searchTerm.trim();
    return result.section1.filter(
      item =>
        item.char.includes(term) ||
        item.originalChar?.includes(term) ||
        item.pos.toString() === term ||
        item.resultDisplay.includes(term)
    );
  }, [result.section1, searchTerm]);

  // Invert Selection
  const handleInvertSelection = () => {
    if (!onToggleTransfer) return;
    result.section1.forEach((_, idx) => {
      onToggleTransfer(idx);
    });
  };

  const renderAnswerCard = (
    answer: AnswerDetails,
    theme: {
      badgeColor: string;
      borderColor: string;
      glowColor: string;
      bgGradient: string;
      accentBg: string;
    },
    icon: React.ReactNode
  ) => {
    return (
      <Card
        className={`glass overflow-hidden border-${theme.borderColor} shadow-[0_0_20px_${theme.glowColor}] relative transition-all duration-300 hover:border-opacity-60 w-full min-w-0 bg-gradient-to-b ${theme.bgGradient}`}
      >
        <CardHeader className="text-center py-3 px-3 sm:px-4 border-b border-white/10 bg-white/[0.02] min-w-0">
          <div className="flex items-center justify-center gap-2 mb-1 min-w-0">
            {icon}
            <span className={`text-sm sm:text-base font-black uppercase tracking-wider ${theme.badgeColor} truncate`}>
              {answer.title}
            </span>
          </div>
          <CardTitle className="text-[11px] sm:text-xs font-bold text-slate-300 truncate">
            {answer.subtitle}
          </CardTitle>
          <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
            {answer.formulaDescription}
          </p>
        </CardHeader>
        <CardContent className="space-y-3 p-3 sm:p-4 min-w-0">
          {/* Step 1: Formula & Fractions */}
          <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 space-y-1.5 min-w-0">
            <span className="text-[11px] text-slate-400 font-medium block">
              1. صيغة جمع الخانات المحددة:
            </span>
            <div className="text-xs font-mono text-cyan-300 font-bold dir-ltr text-center bg-black/50 p-2 rounded-lg border border-white/5 max-w-full overflow-x-auto whitespace-normal break-all">
              {answer.exactFormula}
            </div>
            <div className="flex justify-between items-center pt-1 min-w-0">
              <span className="text-[11px] text-slate-400">2. الجذر التربيعي للكسر:</span>
              <span className={`text-base sm:text-lg font-black ${theme.badgeColor} font-mono dir-ltr`}>
                {answer.exactFraction}
              </span>
            </div>
          </div>

          {/* Step 2: 10 Digits Display */}
          <div className={`p-2.5 ${theme.accentBg} rounded-xl border border-white/15 space-y-1 text-center min-w-0`}>
            <span className={`text-[10px] sm:text-[11px] ${theme.badgeColor} font-bold block`}>
              3. الناتج العشري المستخرج (10 أرقام):
            </span>
            <div className="inline-block bg-black/80 px-3 py-1 rounded-lg border border-white/20 max-w-full overflow-x-auto">
              <span className={`text-base sm:text-lg font-black ${theme.badgeColor} font-mono tracking-wider dir-ltr`}>
                {answer.fullDisplay10}
              </span>
            </div>
          </div>

          {/* Step 3: Reduction Steps & Root */}
          <div className="space-y-1.5 bg-white/[0.02] p-2.5 rounded-xl border border-white/10 min-w-0">
            <div className="flex justify-between items-center text-[11px] min-w-0">
              <span className="text-slate-400">الأرقام الـ 10 المستخرجة:</span>
              <span className={`font-mono font-bold ${theme.badgeColor} tracking-wider text-xs dir-ltr`}>
                {answer.extractedDigits || '0000000000'}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px] min-w-0">
              <span className="text-slate-400">4. خطوات الاختزال والجمع:</span>
              <span className={`font-mono ${theme.badgeColor} font-bold text-xs dir-ltr`}>
                {answer.digitSumSteps.join(' ➔ ')}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-white/10 min-w-0">
              <span className="text-slate-200 font-bold text-xs">الرقم المفرد النهائي (Single Root):</span>
              <span
                className={`text-xl sm:text-2xl font-black ${theme.badgeColor} px-3.5 py-0.5 bg-white/10 rounded-xl border border-white/20 shadow-inner font-mono`}
              >
                {answer.singleDigit}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 dir-rtl font-cairo w-full min-w-0">
      {/* QUICK LETTER RIBBON / شريط الأحرف السريع */}
      <div className="p-3 bg-slate-900/90 rounded-2xl border border-purple-500/25 shadow-lg backdrop-blur-md space-y-2 w-full min-w-0">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span className="text-xs font-bold text-slate-200 truncate">
              شريط تصفح الأحرف والانتقال ({totalCount} حرف)
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex-shrink-0">
            <span>المنتقلة:</span>
            <span>{transferredCount}/{totalCount}</span>
          </div>
        </div>

        {/* Dense Letter Chips */}
        <div className="flex flex-wrap gap-1 p-1.5 bg-black/40 rounded-xl border border-white/5 md:max-h-32 md:overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600/40">
          {result.section1.map(item => {
            const originalIdx = item.pos - 1;
            return (
              <button
                key={`ribbon-${item.pos}`}
                type="button"
                onClick={() => onToggleTransfer?.(originalIdx)}
                title={`الخانة ${item.pos}: الحرف ${item.char} (الناتج: ${item.resultDisplay})`}
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all duration-150 transform hover:scale-105 active:scale-95 cursor-pointer ${
                  item.isTransferred
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm ring-1 ring-emerald-400/30'
                    : 'bg-white/5 text-slate-400 hover:bg-white/15 hover:text-white border border-white/5 opacity-60'
                }`}
              >
                <span className="text-[9px] opacity-75">{item.pos}:</span>
                <span className="font-sans font-black">{item.char}</span>
                <span className="text-[9px] text-emerald-300 font-mono">({item.resultDisplay})</span>
                {item.isTransferred ? (
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                ) : (
                  <span className="w-1 h-1 rounded-full bg-slate-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: 5-STEP TABLE / جدول التحليل والخطوات الخمس */}
      <Card className="glass border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.1)] overflow-hidden w-full min-w-0">
        <CardHeader className="py-2.5 px-3 sm:px-5 border-b border-white/10 bg-slate-900/60 min-w-0">
          <div className="flex flex-col gap-2 min-w-0">
            {/* Header Title & Mode Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
              <div className="min-w-0">
                <CardTitle className="text-base sm:text-lg font-bold text-purple-300 flex items-center gap-2 truncate">
                  <Calculator className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  جدول التحليل والخطوات الخمس (Arbitrary-Precision 5 Steps)
                </CardTitle>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  حسابات كسرية دقيقة 100% بدون أي تقريب مع أزرار الانتقال التفاعلية.
                </p>
              </div>

              {/* View Switcher & Details Toggle */}
              <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
                <button
                  onClick={() => setShowStepsBreakdown(!showStepsBreakdown)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-500/30 transition-all cursor-pointer"
                >
                  <Layers className="w-3 h-3 text-purple-400" />
                  <span>تفاصيل القواعد</span>
                  {showStepsBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="عرض جدولي"
                  >
                    <TableIcon className="w-3 h-3" />
                    <span>جدول</span>
                  </button>
                  <button
                    onClick={() => setViewMode('compact-cards')}
                    className={`px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      viewMode === 'compact-cards'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="عرض بطاقات"
                  >
                    <LayoutGrid className="w-3 h-3" />
                    <span>بطاقات</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1.5 border-t border-white/5 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => onSelectAll?.()}
                  disabled={isAllSelected}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    isAllSelected
                      ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                      : 'bg-purple-600/80 hover:bg-purple-600 text-white shadow-sm'
                  }`}
                >
                  <CheckSquare className="w-3 h-3" />
                  <span>تحديد الكل ({totalCount})</span>
                </button>

                <button
                  onClick={() => onDeselectAll?.()}
                  disabled={transferredCount === 0}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    transferredCount === 0
                      ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  }`}
                >
                  <Square className="w-3 h-3" />
                  <span>إلغاء التحديد</span>
                </button>

                <button
                  onClick={handleInvertSelection}
                  className="px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all cursor-pointer"
                  title="عكس التحديد الحالي"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>عكس</span>
                </button>
              </div>

              {/* Search Bar */}
              {totalCount > 6 && (
                <div className="relative">
                  <Search className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="بحث بحرف أو خانة..."
                    className="bg-black/50 text-[11px] text-white placeholder:text-slate-500 pr-7 pl-2 py-1 rounded-md border border-white/10 focus:border-purple-500/50 outline-none w-28 sm:w-36 transition-all"
                  />
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Optional Collapsible 5 Steps Breakdown */}
        {showStepsBreakdown && (
          <div className="p-3 bg-black/40 border-b border-white/10 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>ملخص الخطوات الرياضية الخمس (Mathematical Breakdown):</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-400 text-[10px] block">الخطوة 1: المجموع S1</span>
                <span className="font-mono text-cyan-300 font-bold">{result.step1Sum}</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-400 text-[10px] block">الخطوة 2: المجموع S2</span>
                <span className="font-mono text-cyan-300 font-bold">{result.step2SumDisplay}</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-400 text-[10px] block">الخطوة 3: قيمة الخانة الأخيرة</span>
                <span className="font-mono text-yellow-300 font-bold">{result.step3LastFrac.toString()}</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
              <span className="text-slate-400 text-[10px] block mb-1">الخطوة 4: تجميع الحروف الموحدة وحساب المتوسط (القسمة على عدد الخانات/التكرار):</span>
              <div className="flex flex-wrap gap-2">
                {result.charGroups.map(g => (
                  <span key={g.char} className="px-2.5 py-1 bg-purple-500/20 rounded-lg border border-purple-500/30 text-purple-200 font-mono text-[11px] flex items-center gap-1">
                    <span className="font-sans font-bold text-white text-xs">{g.char}:</span>
                    <span>{g.step3SumDisplay} ÷ {g.count} = </span>
                    <span className="text-yellow-300 font-black">{g.step4AvgDisplay}</span>
                    <span className="text-[9px] text-slate-400 font-sans">(خانات: {g.positions.join(', ')})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <CardContent className="p-2 sm:p-3 space-y-2.5 min-w-0">
          {/* 1. TABLE VIEW */}
          {viewMode === 'table' ? (
            <div className="w-full max-w-full overflow-x-auto rounded-xl border border-white/10 bg-slate-950/70 md:max-h-[520px] md:overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600/40 scrollbar-track-white/5">
              <table className="w-full min-w-[620px] text-right border-collapse text-xs">
                {/* Sticky Header */}
                <thead className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-white/10 text-slate-300 font-bold">
                  <tr>
                    <th className="py-2 px-2 text-center w-12">
                      الخانة
                      <span className="block text-[9px] text-slate-400 font-normal">
                        (خطوة 1: ×4)
                      </span>
                    </th>
                    <th className="py-2 px-2 text-center w-12">الحرف</th>
                    <th className="py-2 px-2 text-center">
                      خطوة 2
                      <span className="block text-[9px] text-cyan-400 font-normal">
                        (القسمة والضرب)
                      </span>
                    </th>
                    <th className="py-2 px-2 text-center">
                      خطوة 3
                      <span className="block text-[9px] text-yellow-400 font-normal">
                        (الكسر القياسي)
                      </span>
                    </th>
                    <th className="py-2 px-2 text-center">
                      خطوة 4
                      <span className="block text-[9px] text-purple-400 font-normal">
                        (المجموع ÷ الخانات)
                      </span>
                    </th>
                    <th className="py-2 px-2 text-center">
                      النسبة %
                      <span className="block text-[9px] text-amber-400 font-normal">
                        (خطوة 5)
                      </span>
                    </th>
                    <th className="py-2 px-2 text-center">
                      الناتج الجزئي
                      <span className="block text-[9px] text-emerald-400 font-normal">
                        (القيمة النهائية)
                      </span>
                    </th>
                    <th className="py-2 px-2 text-center w-24 sm:w-28">
                      زر الانتقال
                      <span className="block text-[9px] text-teal-400 font-normal">
                        (تحديد/تمرير)
                      </span>
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-white/5">
                  {filteredSection1.map(item => {
                    const originalIdx = item.pos - 1;
                    return (
                      <tr
                        key={item.pos}
                        onClick={() => onToggleTransfer?.(originalIdx)}
                        className={`group transition-colors duration-150 cursor-pointer select-none ${
                          item.isTransferred
                            ? 'bg-emerald-950/20 hover:bg-emerald-950/30'
                            : 'hover:bg-white/[0.03] text-slate-400 opacity-70 hover:opacity-100'
                        }`}
                      >
                        {/* Pos / الخانة */}
                        <td className="py-1.5 px-2 text-center font-mono font-bold text-slate-300">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[11px] ${
                              item.isTransferred
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-white/5 text-slate-400'
                            }`}
                          >
                            #{item.pos} ({item.step1Val})
                          </span>
                        </td>

                        {/* Char / الحرف */}
                        <td className="py-1.5 px-2 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-sm font-black transition-transform group-hover:scale-110 ${
                              item.isTransferred
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_6px_rgba(168,85,247,0.3)]'
                                : 'bg-white/5 text-slate-400 border border-white/5'
                            }`}
                          >
                            {item.char}
                          </span>
                        </td>

                        {/* Step 2 Value */}
                        <td className="py-1.5 px-2 text-center font-mono font-bold text-cyan-300 text-xs dir-ltr">
                          {item.step2Display}
                        </td>

                        {/* Step 3 Value */}
                        <td className="py-1.5 px-2 text-center font-mono text-yellow-300 dir-ltr text-xs">
                          {item.step3Display}
                        </td>

                        {/* Step 4 Char Group Sum */}
                        <td className="py-1.5 px-2 text-center font-mono text-purple-300 dir-ltr text-xs">
                          {item.step4GroupDisplay}
                        </td>

                        {/* Step 5 Percentage */}
                        <td className="py-1.5 px-2 text-center font-mono text-amber-300 dir-ltr text-xs font-bold">
                          {item.percentageDisplay}
                        </td>

                        {/* Step 5 Final Result Fraction */}
                        <td className="py-1.5 px-2 text-center font-mono font-black text-emerald-400 dir-ltr text-xs sm:text-sm">
                          {item.resultDisplay}
                        </td>

                        {/* In-Line Transfer Button */}
                        <td className="py-1.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              onToggleTransfer?.(originalIdx);
                            }}
                            className={`w-full py-1 px-1.5 sm:px-2 rounded-lg text-xs font-bold flex items-center justify-between transition-all duration-200 shadow-sm cursor-pointer ${
                              item.isTransferred
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-emerald-950/40 ring-1 ring-emerald-400/40'
                                : 'bg-white/5 text-slate-400 hover:bg-white/15 hover:text-white border border-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              <ArrowLeftRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              <span className="text-[10px]">انتقال</span>
                            </div>
                            <div
                              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded flex items-center justify-center border transition-all ${
                                item.isTransferred
                                  ? 'bg-white text-emerald-950 border-white'
                                  : 'border-slate-500 group-hover:border-slate-300'
                              }`}
                            >
                              {item.isTransferred && <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 stroke-[3]" />}
                            </div>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* 2. COMPACT CARDS VIEW */
            <div className="w-full max-w-full md:max-h-[520px] md:overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-purple-600/40 scrollbar-track-white/5 rounded-xl bg-slate-950/60 border border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
                {filteredSection1.map(item => {
                  const originalIdx = item.pos - 1;
                  return (
                    <div
                      key={item.pos}
                      onClick={() => onToggleTransfer?.(originalIdx)}
                      className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between space-y-2 w-full min-w-0 ${
                        item.isTransferred
                          ? 'bg-emerald-950/25 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.1)] ring-1 ring-emerald-500/20'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20 opacity-70 hover:opacity-100'
                      }`}
                    >
                      {/* Row 1: Header + In-line Button */}
                      <div className="flex items-center justify-between gap-1.5 border-b border-white/5 pb-1.5 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-1.5 py-0.5 rounded flex-shrink-0">
                            #{item.pos} (قيمة: {item.step1Val})
                          </span>
                          <span className="text-sm font-black text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20 flex-shrink-0">
                            {item.char}
                          </span>
                        </div>

                        {/* In-line compact transfer button */}
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            onToggleTransfer?.(originalIdx);
                          }}
                          className={`py-0.5 px-2 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer flex-shrink-0 ${
                            item.isTransferred
                              ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm'
                              : 'bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white border border-white/10'
                          }`}
                        >
                          <ArrowLeftRight className="w-2.5 h-2.5" />
                          <span>انتقال</span>
                          <div
                            className={`w-3 h-3 rounded flex items-center justify-center border ${
                              item.isTransferred
                                ? 'bg-white text-emerald-950 border-white'
                                : 'border-slate-500'
                            }`}
                          >
                            {item.isTransferred && <Check className="w-2 h-2 stroke-[3]" />}
                          </div>
                        </button>
                      </div>

                      {/* Row 2: 5 Steps Breakdown */}
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-black/40 p-2 rounded-lg font-mono min-w-0">
                        <div className="text-slate-400 truncate">
                          خطوة 2:{' '}
                          <strong className="text-cyan-300 font-bold dir-ltr">{item.step2Display}</strong>
                        </div>
                        <div className="text-slate-400 dir-ltr text-left truncate">
                          خطوة 3:{' '}
                          <strong className="text-yellow-300 font-bold">{item.step3Display}</strong>
                        </div>
                        <div className="text-slate-400 truncate">
                          مجموع الحرف:{' '}
                          <strong className="text-purple-300 font-bold dir-ltr">{item.step4GroupDisplay}</strong>
                        </div>
                        <div className="text-slate-400 dir-ltr text-left truncate">
                          نسبة:{' '}
                          <strong className="text-amber-300 font-bold">{item.percentageDisplay}</strong>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-white/5 flex justify-between items-center text-[11px] min-w-0">
                          <span className="text-slate-400 font-sans">الناتج الجزئي:</span>
                          <span className="text-emerald-400 font-black dir-ltr text-xs">
                            {item.resultDisplay}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sticky Summary Bar: Count & Exact Sum S */}
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/30 via-purple-950/30 to-blue-950/30 border border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between gap-2 w-full min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xs min-w-0">
                <span className="text-emerald-300 font-bold block text-[11px] truncate">
                  ملخص الخانات المنتقلة (Selected Cells Summary)
                </span>
                <span className="text-slate-400 text-[10px] sm:text-[11px]">
                  عدد الخانات المنتقلة ($N$):{' '}
                  <strong className="text-white font-mono">{transferredCount}</strong> /{' '}
                  {totalCount} | المجموع الكسري ($S$):{' '}
                  <strong className="text-emerald-400 font-mono dir-ltr">
                    {result.transferredSumDisplay}
                  </strong>
                </span>
              </div>
            </div>

            <div className="px-3 py-1 bg-emerald-500/20 rounded-lg border border-emerald-500/30 font-mono text-xs sm:text-sm font-black text-emerald-300 text-center dir-ltr flex-shrink-0">
              S = {result.transferredSumDisplay}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: 4 ANSWER GATES (القسم الثاني: بوابات النتائج الأربعة 🟨) */}
      <div className="space-y-3 w-full min-w-0">
        <div className="flex items-center justify-between min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-slate-200 flex items-center gap-2 min-w-0">
            <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <span>القسم الثاني: قسم النتائج (بوابات الإجابات الأربعة 🟨)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono bg-white/5 px-2.5 py-0.5 rounded-lg border border-white/10">
            4 Gates Output
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full min-w-0">
          {/* Answer 1 */}
          {renderAnswerCard(
            result.answer1,
            {
              badgeColor: 'text-amber-400',
              borderColor: 'amber-500/40',
              glowColor: 'rgba(245,158,11,0.15)',
              bgGradient: 'from-amber-950/20 to-slate-900/40',
              accentBg: 'bg-amber-950/30 border-amber-500/30',
            },
            <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0" />
          )}

          {/* Answer 2 */}
          {renderAnswerCard(
            result.answer2,
            {
              badgeColor: 'text-cyan-400',
              borderColor: 'cyan-500/40',
              glowColor: 'rgba(6,182,212,0.15)',
              bgGradient: 'from-cyan-950/20 to-slate-900/40',
              accentBg: 'bg-cyan-950/30 border-cyan-500/30',
            },
            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          )}

          {/* Answer 3 */}
          {renderAnswerCard(
            result.answer3,
            {
              badgeColor: 'text-purple-400',
              borderColor: 'purple-500/40',
              glowColor: 'rgba(168,85,247,0.15)',
              bgGradient: 'from-purple-950/20 to-slate-900/40',
              accentBg: 'bg-purple-950/30 border-purple-500/30',
            },
            <Zap className="w-4 h-4 text-purple-400 flex-shrink-0" />
          )}

          {/* Answer 4 */}
          {renderAnswerCard(
            result.answer4,
            {
              badgeColor: 'text-emerald-400',
              borderColor: 'emerald-500/40',
              glowColor: 'rgba(16,185,129,0.15)',
              bgGradient: 'from-emerald-950/20 to-slate-900/40',
              accentBg: 'bg-emerald-950/30 border-emerald-500/30',
            },
            <Calculator className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
        </div>
      </div>
    </div>
  );
}
