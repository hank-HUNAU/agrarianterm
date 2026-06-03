import { useState } from 'react';
import { Plus, X, Link2 } from 'lucide-react';
import { apiFetch } from '@/hooks/useApi';

interface Relation {
  id: number;
  sourceId: number;
  targetId: number;
  targetTerm: string;
  type: string;
}

const RELATION_TYPES = ['同义', '近义', '上下位', '相关', '反义'];

interface RelationPanelProps {
  relations: Relation[];
  annotationId: number;
  allAnnotations: { id: number; term: string }[];
  onRefresh: () => void;
}

export default function RelationPanel({ relations, annotationId, allAnnotations, onRefresh }: RelationPanelProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [targetId, setTargetId] = useState<number | null>(null);
  const [relType, setRelType] = useState(RELATION_TYPES[0]);

  const handleAdd = async () => {
    if (!targetId) return;
    await apiFetch('/relations', {
      method: 'POST',
      body: JSON.stringify({ sourceId: annotationId, targetId, type: relType }),
    });
    setShowAdd(false);
    setTargetId(null);
    onRefresh();
  };

  const handleDelete = async (id: number) => {
    await apiFetch(`/relations/${id}`, { method: 'DELETE' });
    onRefresh();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-bronze/15 pb-2">
        <h3 className="font-serif text-base text-bronze font-semibold">关系标注</h3>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1 px-2 py-1 text-xs text-bronze
            hover:text-bronze-light transition-colors"
        >
          <Plus className="w-3 h-3" />
          添加关系
        </button>
      </div>

      {relations.length === 0 && (
        <p className="text-xs text-paper-dark/60 py-2">暂无关系，点击"添加关系"创建</p>
      )}

      <ul className="space-y-2">
        {relations.map((rel) => (
          <li
            key={rel.id}
            className="flex items-center justify-between bg-ink/50 rounded px-3 py-2"
          >
            <div className="flex items-center gap-2 text-sm">
              <Link2 className="w-3.5 h-3.5 text-bronze/60" />
              <span className="text-paper-dark">{rel.targetTerm}</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-bronze/15 text-bronze">
                {rel.type}
              </span>
            </div>
            <button
              onClick={() => handleDelete(rel.id)}
              className="text-paper-dark/40 hover:text-red-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </li>
        ))}
      </ul>

      {/* 添加关系弹窗 */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-ink-light border border-bronze/20 rounded-lg w-full max-w-sm p-5">
            <h4 className="font-serif text-base text-bronze mb-3">添加关系</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-paper-dark mb-1">目标术语</label>
                <select
                  value={targetId ?? ''}
                  onChange={(e) => setTargetId(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-ink border border-bronze/20 rounded text-sm text-paper
                    focus:outline-none focus:border-bronze"
                >
                  <option value="">选择术语</option>
                  {allAnnotations
                    .filter((a) => a.id !== annotationId)
                    .map((a) => (
                      <option key={a.id} value={a.id}>{a.term}</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-paper-dark mb-1">关系类型</label>
                <select
                  value={relType}
                  onChange={(e) => setRelType(e.target.value)}
                  className="w-full px-3 py-2 bg-ink border border-bronze/20 rounded text-sm text-paper
                    focus:outline-none focus:border-bronze"
                >
                  {RELATION_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowAdd(false)}
                className="px-3 py-1.5 text-sm text-paper-dark hover:text-bronze-light transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAdd}
                className="px-3 py-1.5 bg-bronze text-ink text-sm font-medium rounded
                  hover:bg-bronze-light transition-colors"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
