import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '@/hooks/useApi';
import { useAppStore } from '@/store';
import { useForceGraph, type GraphNode, type GraphEdge } from '@/hooks/useForceGraph';
import PageHeader from '@/components/ui/PageHeader';
import { Filter, RotateCcw, X, BookOpen, GitBranch, Quote } from 'lucide-react';

const CATEGORIES = ['农事操作', '农具', '作物', '土壤', '水利'];
const DYNASTIES = ['北魏', '明代'];

const CATEGORY_COLORS: Record<string, string> = {
  '农事操作': '#c9a96e', '农具': '#4a7c59', '作物': '#8b6914', '土壤': '#6b4423', '水利': '#2d6a7a',
};

export default function GraphPage() {
  const { graphFilter, setGraphFilter, selectedTerm, setSelectedTerm } = useAppStore();
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] }>({ nodes: [], edges: [] });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 获取图谱数据
  useEffect(() => {
    const params = new URLSearchParams();
    if (graphFilter.category) params.set('category', graphFilter.category);
    apiFetch<{ nodes: GraphNode[]; edges: GraphEdge[] }>(`/graph?${params}`).then(setGraphData);
  }, [graphFilter]);

  // 计算画布尺寸
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleSelectNode = useCallback((id: number | null) => {
    setSelectedTerm(id);
  }, [setSelectedTerm]);

  const { svgRef, tooltipRef } = useForceGraph({
    nodes: graphData.nodes,
    edges: graphData.edges,
    selectedId: selectedTerm,
    onSelectNode: handleSelectNode,
    width: dimensions.width,
    height: dimensions.height,
  });

  const selectedNode = selectedTerm !== null
    ? graphData.nodes.find((n) => n.id === selectedTerm)
    : null;
  const relatedEdges = selectedTerm !== null
    ? graphData.edges.filter((e) => {
        const s = typeof e.source === 'object' ? (e.source as GraphNode).id : e.source;
        const t = typeof e.target === 'object' ? (e.target as GraphNode).id : e.target;
        return s === selectedTerm || t === selectedTerm;
      })
    : [];

  const handleReset = () => {
    setGraphFilter({ category: '', dynasty: '' });
    setSelectedTerm(null);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* 左侧筛选面板 */}
      <aside className="w-56 shrink-0 border-r border-bronze/15 bg-ink-light p-4 flex flex-col gap-4">
        <PageHeader title="筛选" />
        <div>
          <label className="text-xs text-paper-dark mb-1 block">类别</label>
          <select
            value={graphFilter.category}
            onChange={(e) => setGraphFilter({ category: e.target.value })}
            className="w-full bg-ink border border-bronze/25 rounded px-2 py-1.5 text-sm text-paper-dark focus:outline-none focus:border-bronze"
          >
            <option value="">全部类别</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-paper-dark mb-1 block">朝代</label>
          <select
            value={graphFilter.dynasty}
            onChange={(e) => setGraphFilter({ dynasty: e.target.value })}
            className="w-full bg-ink border border-bronze/25 rounded px-2 py-1.5 text-sm text-paper-dark focus:outline-none focus:border-bronze"
          >
            <option value="">全部朝代</option>
            {DYNASTIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <button onClick={handleReset} className="flex items-center gap-1.5 text-sm text-paper-dark hover:text-bronze transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> 重置筛选
        </button>
        {/* 图例 */}
        <div className="mt-auto border-t border-bronze/15 pt-3">
          <p className="text-xs text-paper-dark mb-2">节点类别</p>
          {CATEGORIES.map((c) => (
            <div key={c} className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[c] }} />
              <span className="text-xs text-paper-dark">{c}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* 中间画布 */}
      <div ref={containerRef} className="flex-1 relative bg-ink">
        <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
        <div
          ref={tooltipRef}
          className="absolute hidden bg-ink-light border border-bronze/30 rounded px-2 py-1 text-xs pointer-events-none z-10"
          style={{ display: 'none' }}
        />
        {graphData.nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-paper-dark/50">
            <div className="text-center">
              <Filter className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">暂无图谱数据</p>
            </div>
          </div>
        )}
      </div>

      {/* 右侧详情面板 */}
      <aside className={`w-72 shrink-0 border-l border-bronze/15 bg-ink-light p-4 overflow-y-auto transition-all ${selectedNode ? '' : 'opacity-50'}`}>
        {selectedNode ? (
          <div>
            <div className="flex items-start justify-between mb-3">
              <h2 className="font-serif text-xl text-bronze font-semibold">{selectedNode.term_text}</h2>
              <button onClick={() => setSelectedTerm(null)} className="text-paper-dark hover:text-bronze">
                <X className="w-4 h-4" />
              </button>
            </div>
            <span className="inline-block text-xs px-2 py-0.5 rounded-full mb-3" style={{ backgroundColor: `${CATEGORY_COLORS[selectedNode.category]}25`, color: CATEGORY_COLORS[selectedNode.category] }}>
              {selectedNode.category}
            </span>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs text-paper-dark mb-1 flex items-center gap-1"><BookOpen className="w-3 h-3" /> 释义</h4>
                <p className="text-sm text-paper-dark/80">{selectedNode.modern_def || '暂无'}</p>
                {selectedNode.english_equiv && (
                  <p className="text-xs text-bronze-light italic mt-1">{selectedNode.english_equiv}</p>
                )}
              </div>

              <div>
                <h4 className="text-xs text-paper-dark mb-1 flex items-center gap-1"><GitBranch className="w-3 h-3" /> 关系 ({relatedEdges.length})</h4>
                {relatedEdges.length > 0 ? (
                  <ul className="space-y-1">
                    {relatedEdges.map((e) => {
                      const s = typeof e.source === 'object' ? (e.source as GraphNode).id : e.source;
                      const t = typeof e.target === 'object' ? (e.target as GraphNode).id : e.target;
                      const otherId = s === selectedTerm ? t : s;
                      const otherNode = graphData.nodes.find((n) => n.id === otherId);
                      const direction = s === selectedTerm ? '→' : '←';
                      return (
                        <li key={e.id} className="text-xs text-paper-dark/80">
                          <span className="text-bronze/60">{e.relation_type}</span> {direction} {otherNode?.term_text}
                        </li>
                      );
                    })}
                  </ul>
                ) : <p className="text-xs text-paper-dark/50">暂无关系</p>}
              </div>

              <div>
                <h4 className="text-xs text-paper-dark mb-1 flex items-center gap-1"><Quote className="w-3 h-3" /> 语境例句</h4>
                <p className="text-xs text-paper-dark/60 italic">暂无语境数据</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-paper-dark/40">
            <GitBranch className="w-8 h-8 mb-2" />
            <p className="text-sm">点击节点查看详情</p>
          </div>
        )}
      </aside>
    </div>
  );
}
