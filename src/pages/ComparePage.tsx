import { useState, useEffect, useMemo } from 'react';
import { apiFetch } from '@/hooks/useApi';
import PageHeader from '@/components/ui/PageHeader';
import { ArrowRight, BookOpen, Languages, Sparkles } from 'lucide-react';

interface CompareItem {
  id: number;
  term_text: string;
  source: string;
  context: string;
  baseline_translation: string;
  enhanced_translation: string;
  improvement: string;
}

// 差异高亮：将增强翻译中不同于基线的词用标记包裹
function diffHighlight(baseline: string, enhanced: string): React.ReactNode[] {
  const baseWords = baseline.split(/(\s+)/);
  const enhWords = enhanced.split(/(\s+)/);
  const baseSet = new Set(baseWords.filter((w) => w.trim()));
  const parts: React.ReactNode[] = [];

  enhWords.forEach((word, i) => {
    if (!word.trim()) {
      parts.push(word);
      return;
    }
    if (!baseSet.has(word)) {
      parts.push(
        <span key={i} className="text-bronze underline decoration-bronze/60 underline-offset-2">
          {word}
        </span>
      );
    } else {
      parts.push(<span key={i}>{word}</span>);
    }
  });
  return parts;
}

// 在原文中高亮术语
function highlightTerm(text: string, term: string): React.ReactNode {
  if (!term) return text;
  const parts = text.split(term);
  return parts.reduce<React.ReactNode[]>((acc, part, i) => {
    if (i > 0) acc.push(<span key={`t-${i}`} className="text-bronze font-semibold underline underline-offset-2">{term}</span>);
    acc.push(part);
    return acc;
  }, []);
}

export default function ComparePage() {
  const [comparisons, setComparisons] = useState<CompareItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    apiFetch<CompareItem[]>('/compare').then((data) => {
      setComparisons(data);
    });
  }, []);

  const current = comparisons[selectedIndex];

  // 按来源分组
  const sourceGroups = useMemo(() => {
    const groups: Record<string, CompareItem[]> = {};
    comparisons.forEach((c) => {
      (groups[c.source] = groups[c.source] || []).push(c);
    });
    return groups;
  }, [comparisons]);

  if (comparisons.length === 0) {
    return (
      <div className="container py-6">
        <PageHeader title="翻译对比" />
        <div className="flex items-center justify-center py-20 text-paper-dark/40">
          <Languages className="w-8 h-8 mr-2" /> 加载中...
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <PageHeader title="翻译对比" subtitle="基线翻译 vs 知识增强翻译" />

      {/* 选择器 */}
      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm text-paper-dark">选择文本：</label>
        <select
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(Number(e.target.value))}
          className="bg-ink-light border border-bronze/25 rounded px-3 py-1.5 text-sm text-paper-dark focus:outline-none focus:border-bronze"
        >
          {Object.entries(sourceGroups).map(([source, items]) => (
            <optgroup key={source} label={source}>
              {items.map((item) => (
                <option key={item.id} value={comparisons.indexOf(item)}>
                  「{item.term_text}」- {source}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {current && (
        <>
          {/* 三栏布局 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* 左栏：古籍原文 */}
            <div className="bg-ink-light border border-bronze/15 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-bronze" />
                <h3 className="text-sm font-medium text-bronze">古籍原文</h3>
              </div>
              <p className="text-xs text-paper-dark/50 mb-2">出处：{current.source}</p>
              <p className="font-serif text-base leading-relaxed text-paper-dark/90">
                {highlightTerm(current.context, current.term_text)}
              </p>
              <div className="mt-3 pt-3 border-t border-bronze/10">
                <span className="text-xs text-paper-dark/50">核心术语：</span>
                <span className="text-sm text-bronze font-serif ml-1">{current.term_text}</span>
              </div>
            </div>

            {/* 中栏：基线翻译 */}
            <div className="bg-ink-light border border-bronze/15 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Languages className="w-4 h-4 text-paper-dark/50" />
                <h3 className="text-sm font-medium text-paper-dark/60">基线翻译</h3>
              </div>
              <p className="text-base text-paper-dark/50 leading-relaxed">
                {current.baseline_translation}
              </p>
              <div className="mt-3 pt-3 border-t border-bronze/10">
                <span className="text-xs text-paper-dark/30">直接翻译，缺少语境</span>
              </div>
            </div>

            {/* 右栏：增强翻译 */}
            <div className="bg-ink-light border border-bronze/30 rounded-lg p-5 ring-1 ring-bronze/10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-bronze" />
                <h3 className="text-sm font-medium text-bronze">增强翻译</h3>
              </div>
              <p className="text-base leading-relaxed text-paper-dark/90">
                {diffHighlight(current.baseline_translation, current.enhanced_translation)}
              </p>
              <div className="mt-3 pt-3 border-t border-bronze/10">
                <span className="text-xs text-bronze/60">知识增强，术语语境化</span>
              </div>
            </div>
          </div>

          {/* 差异对照表 */}
          <div className="bg-ink-light border border-bronze/15 rounded-lg p-5">
            <h3 className="text-sm font-medium text-bronze mb-3 flex items-center gap-2">
              <ArrowRight className="w-4 h-4" /> 增强说明
            </h3>
            <div className="grid grid-cols-[auto_1fr_auto_1fr] gap-x-4 gap-y-2 text-sm">
              <span className="text-paper-dark/50">基线：</span>
              <span className="text-paper-dark/60">{current.baseline_translation}</span>
              <span className="text-bronze">→</span>
              <span className="text-bronze">{current.enhanced_translation}</span>
            </div>
            <p className="mt-3 text-sm text-paper-dark/70 bg-ink/50 rounded p-3 border-l-2 border-bronze/40">
              {current.improvement}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
