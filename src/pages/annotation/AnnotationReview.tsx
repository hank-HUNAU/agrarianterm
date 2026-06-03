import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ChevronDown, ChevronRight, Filter, ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { apiFetch } from '@/hooks/useApi';

interface Annotation {
  id: number;
  taskId: number;
  term: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  annotator: string;
  segment: string;
  modernDefinition: string;
  englishEquivalent: string;
  culturalLoad: number;
  note: string;
}

const statusConfig = {
  pending: { label: '待审核', cls: 'bg-paper-dark/20 text-paper-dark' },
  approved: { label: '已通过', cls: 'bg-bamboo/20 text-bamboo-light' },
  rejected: { label: '已打回', cls: 'bg-red-400/20 text-red-400' },
};

export default function AnnotationReview() {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [filterProject, setFilterProject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    apiFetch<Annotation[]>('/annotations').then(setAnnotations).catch(() => {});
  }, []);

  const filtered = annotations.filter((a) => {
    if (filterStatus && a.status !== filterStatus) return false;
    if (filterProject && String(a.taskId) !== filterProject) return false;
    return true;
  });

  const handleApprove = async (id: number) => {
    try {
      await apiFetch(`/annotations/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'approved' }),
      });
    } catch {
      // fallback
    }
    setAnnotations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'approved' as const } : a))
    );
  };

  const handleReject = async (id: number) => {
    try {
      await apiFetch(`/annotations/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'rejected' }),
      });
    } catch {
      // fallback
    }
    setAnnotations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'rejected' as const } : a))
    );
  };

  // 获取唯一项目ID列表
  const projectIds = [...new Set(annotations.map((a) => a.taskId))];

  return (
    <div className="p-6">
      <PageHeader title="质量审核" subtitle="审核已提交的术语标注" />

      {/* 筛选栏 */}
      <div className="flex items-center gap-4 mb-4 bg-ink-light border border-bronze/15 rounded-lg px-4 py-3">
        <Filter className="w-4 h-4 text-bronze/60" />
        <div className="flex items-center gap-2">
          <label className="text-xs text-paper-dark">项目：</label>
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-2 py-1 bg-ink border border-bronze/20 rounded text-xs text-paper
              focus:outline-none focus:border-bronze"
          >
            <option value="">全部</option>
            {projectIds.map((id) => (
              <option key={id} value={String(id)}>任务 #{id}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-paper-dark">状态：</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2 py-1 bg-ink border border-bronze/20 rounded text-xs text-paper
              focus:outline-none focus:border-bronze"
          >
            <option value="">全部</option>
            <option value="pending">待审核</option>
            <option value="approved">已通过</option>
            <option value="rejected">已打回</option>
          </select>
        </div>
        <span className="text-xs text-paper-dark/60 ml-auto">
          共 {filtered.length} 条标注
        </span>
      </div>

      {/* 审核列表 */}
      <div className="space-y-2">
        {filtered.map((ann) => {
          const sc = statusConfig[ann.status] || statusConfig.pending;
          const expanded = expandedId === ann.id;

          return (
            <div
              key={ann.id}
              className="bg-ink-light border border-bronze/15 rounded-lg overflow-hidden"
            >
              {/* 列表行 */}
              <div className="flex items-center gap-4 px-4 py-3">
                <button
                  onClick={() => setExpandedId(expanded ? null : ann.id)}
                  className="text-paper-dark/60 hover:text-bronze transition-colors"
                >
                  {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-bronze font-semibold">{ann.term}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-bronze/15 text-bronze-light">
                      {ann.category}
                    </span>
                  </div>
                  <p className="text-xs text-paper-dark/60 truncate mt-0.5">
                    {ann.segment?.slice(0, 60) || `任务 #${ann.taskId}`}
                  </p>
                </div>
                <span className="text-xs text-paper-dark/60">{ann.annotator || '标注员'}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${sc.cls}`}>
                  {sc.label}
                </span>
                {ann.status === 'pending' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleApprove(ann.id)}
                      className="p-1.5 text-bamboo-light hover:bg-bamboo/15 rounded transition-colors"
                      title="通过"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReject(ann.id)}
                      className="p-1.5 text-red-400 hover:bg-red-400/15 rounded transition-colors"
                      title="打回"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* 展开详情 */}
              {expanded && (
                <div className="border-t border-bronze/10 px-4 py-4 bg-ink/40">
                  <div className="grid grid-cols-2 gap-6">
                    {/* 当前标注结果 */}
                    <div>
                      <h4 className="text-xs text-paper-dark/80 font-medium mb-2">当前标注</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex gap-2">
                          <span className="text-paper-dark/60 min-w-[5em]">术语：</span>
                          <span className="text-bronze font-serif">{ann.term}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-paper-dark/60 min-w-[5em]">类别：</span>
                          <span className="text-paper">{ann.category}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-paper-dark/60 min-w-[5em]">现代释义：</span>
                          <span className="text-paper">{ann.modernDefinition || '-'}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-paper-dark/60 min-w-[5em]">英文等价：</span>
                          <span className="text-paper italic">{ann.englishEquivalent || '-'}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-paper-dark/60 min-w-[5em]">文化负载：</span>
                          <span className="text-bronze">{ann.culturalLoad || '-'}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-paper-dark/60 min-w-[5em]">备注：</span>
                          <span className="text-paper">{ann.note || '-'}</span>
                        </div>
                      </div>
                    </div>

                    {/* 参考标注（如有） */}
                    <div>
                      <h4 className="text-xs text-paper-dark/80 font-medium mb-2">参考标注</h4>
                      <div className="text-sm text-paper-dark/40 italic">
                        暂无参考标注
                      </div>
                    </div>
                  </div>

                  {/* 审核操作 */}
                  {ann.status === 'pending' && (
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-bronze/10">
                      <button
                        onClick={() => handleApprove(ann.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-bamboo text-paper text-sm
                          font-medium rounded hover:bg-bamboo-light transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        审核通过
                      </button>
                      <button
                        onClick={() => handleReject(ann.id)}
                        className="flex items-center gap-1.5 px-4 py-2 border border-red-400/40
                          text-red-400 text-sm rounded hover:bg-red-400/10 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        打回修改
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-paper-dark/60">
          <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>暂无待审核标注</p>
        </div>
      )}
    </div>
  );
}
