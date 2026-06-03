import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/hooks/useApi';
import { useAppStore } from '@/store';
import PageHeader from '@/components/ui/PageHeader';
import TermCard from '@/components/ui/TermCard';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = ['农事操作', '农具', '作物', '土壤', '水利'];

interface SearchItem {
  id: number;
  term_text: string;
  category: string;
  source: string;
  cultural_load: number;
  modern_def: string;
  english_equiv: string;
  note: string;
}

interface SearchResult {
  items: SearchItem[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export default function SearchPage() {
  const navigate = useNavigate();
  const { setSelectedTerm } = useAppStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<SearchResult>({ items: [], total: 0, page: 1, size: 12, totalPages: 0 });
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    params.set('page', String(page));
    params.set('size', '12');
    apiFetch<SearchResult>(`/search?${params}`).then(setResults);
  }, [query, category, page]);

  const handleSearch = () => {
    setQuery(searchInput);
    setPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleTermClick = (id: number) => {
    setSelectedTerm(id);
    navigate('/');
  };

  // 获取关系数量（简化处理，使用items中的信息）
  const getRelationCount = (item: SearchItem) => {
    // 后端暂不返回relationCount，使用cultural_load作为替代显示
    return item.cultural_load || 0;
  };

  return (
    <div className="container py-6">
      <PageHeader title="术语检索" subtitle="搜索农业古籍术语，探索语义关联" />

      {/* 搜索栏 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-paper-dark/50" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入术语名称、释义或英译..."
            className="w-full bg-ink-light border border-bronze/25 rounded-lg pl-10 pr-4 py-2.5 text-sm text-paper-dark placeholder:text-paper-dark/40 focus:outline-none focus:border-bronze"
          />
        </div>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="bg-ink-light border border-bronze/25 rounded-lg px-3 py-2.5 text-sm text-paper-dark focus:outline-none focus:border-bronze"
        >
          <option value="">全部类别</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          onClick={handleSearch}
          className="px-5 py-2.5 bg-bronze/20 text-bronze border border-bronze/30 rounded-lg text-sm hover:bg-bronze/30 transition-colors"
        >
          搜索
        </button>
      </div>

      {/* 结果统计 */}
      <p className="text-xs text-paper-dark mb-4">
        共找到 <span className="text-bronze font-medium">{results.total}</span> 条结果
        {query && <span> · 关键词: "<span className="text-bronze">{query}</span>"</span>}
      </p>

      {/* 卡片网格 */}
      {results.items.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {results.items.map((item) => (
            <TermCard
              key={item.id}
              term={item.term_text}
              category={item.category}
              source={item.source || '未知'}
              culturalLoad={item.cultural_load || 0}
              modernDef={item.modern_def || ''}
              englishEquiv={item.english_equiv || ''}
              relationCount={getRelationCount(item)}
              onClick={() => handleTermClick(item.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-paper-dark/40">
          <Search className="w-10 h-10 mb-3" />
          <p className="text-sm">暂无搜索结果</p>
        </div>
      )}

      {/* 分页 */}
      {results.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 rounded border border-bronze/25 text-paper-dark hover:border-bronze disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: results.totalPages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === results.totalPages)
            .map((p, idx, arr) => (
              <span key={p}>
                {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-paper-dark/30 px-1">…</span>}
                <button
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded text-sm ${
                    p === page ? 'bg-bronze/20 text-bronze border border-bronze/40' : 'text-paper-dark hover:text-bronze'
                  }`}
                >
                  {p}
                </button>
              </span>
            ))}
          <button
            onClick={() => setPage((p) => Math.min(results.totalPages, p + 1))}
            disabled={page >= results.totalPages}
            className="p-2 rounded border border-bronze/25 text-paper-dark hover:border-bronze disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
