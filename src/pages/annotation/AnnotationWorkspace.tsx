import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import PropertyPanel, { AnnotationData } from '@/components/annotation/PropertyPanel';
import RelationPanel from '@/components/annotation/RelationPanel';
import { apiFetch } from '@/hooks/useApi';

interface Relation {
  id: number;
  sourceId: number;
  targetId: number;
  targetTerm: string;
  type: string;
}

interface TaskData {
  id: number;
  projectId: number;
  segment: string;
  status: string;
}

const defaultAnnotation: AnnotationData = {
  id: 0, term: '', category: '农事操作',
  literalMeaning: 3, extendedMeaning: 3, culturalLoad: 3,
  bookSpecificity: 3, eraSpecificity: 3,
  literalFeasibility: 3, freeTranslationPriority: 3,
  missingConcept: false, modernDefinition: '', englishEquivalent: '', note: '',
};

export default function AnnotationWorkspace() {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<TaskData | null>(null);
  const [annotations, setAnnotations] = useState<AnnotationData[]>([]);
  const [selected, setSelected] = useState<AnnotationData | null>(null);
  const [relations, setRelations] = useState<Relation[]>([]);
  const [selectedText, setSelectedText] = useState('');
  const [showAddTerm, setShowAddTerm] = useState(false);
  const [posInfo, setPosInfo] = useState<{ start: number; end: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const textRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    if (!taskId) return;
    setLoading(true);
    try {
      const t = await apiFetch<TaskData>(`/tasks/${taskId}`);
      setTask(t);
      const anns = await apiFetch<AnnotationData[]>(`/annotations?taskId=${taskId}`);
      setAnnotations(anns);
    } catch {
      // API may not be available in demo
    }
    setLoading(false);
  }, [taskId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const fetchRelations = useCallback(async () => {
    if (!selected) return;
    try {
      const rels = await apiFetch<Relation[]>(`/relations?sourceId=${selected.id}`);
      setRelations(rels);
    } catch {
      setRelations([]);
    }
  }, [selected]);

  useEffect(() => { fetchRelations(); }, [fetchRelations]);

  // 框选文本
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || !selection.toString().trim() || !textRef.current) return;

    const text = selection.toString().trim();
    const range = selection.getRangeAt(0);

    // 计算在segment中的位置
    const preRange = document.createRange();
    preRange.selectNodeContents(textRef.current);
    preRange.setEnd(range.startContainer, range.startOffset);
    const startPos = preRange.toString().length;
    const endPos = startPos + text.length;

    setSelectedText(text);
    setPosInfo({ start: startPos, end: endPos });
    setShowAddTerm(true);
  };

  // 添加术语
  const handleAddTerm = async () => {
    if (!selectedText || !taskId) return;
    try {
      await apiFetch('/annotations', {
        method: 'POST',
        body: JSON.stringify({
          taskId: Number(taskId),
          term: selectedText,
          startPos: posInfo?.start,
          endPos: posInfo?.end,
          ...defaultAnnotation,
        }),
      });
    } catch {
      // fallback: local add
    }
    const newAnn: AnnotationData = {
      ...defaultAnnotation,
      id: Date.now(),
      term: selectedText,
    };
    setAnnotations((prev) => [...prev, newAnn]);
    setSelected(newAnn);
    setShowAddTerm(false);
    setSelectedText('');
    window.getSelection()?.removeAllRanges();
  };

  // 保存标注
  const handleSave = async () => {
    if (!selected) return;
    try {
      await apiFetch(`/annotations/${selected.id}`, {
        method: 'PUT',
        body: JSON.stringify(selected),
      });
    } catch {
      // fallback: local update
    }
    setAnnotations((prev) =>
      prev.map((a) => (a.id === selected.id ? selected : a))
    );
  };

  // 删除标注
  const handleDelete = async () => {
    if (!selected) return;
    try {
      await apiFetch(`/annotations/${selected.id}`, { method: 'DELETE' });
    } catch {
      // fallback: local delete
    }
    setAnnotations((prev) => prev.filter((a) => a.id !== selected.id));
    setSelected(null);
    setRelations([]);
  };

  // 渲染高亮文本
  const renderHighlightedText = () => {
    if (!task?.segment) return <span className="text-paper-dark/60">暂无文本</span>;

    const text = task.segment;
    if (annotations.length === 0) return text;

    // 按位置排序标注
    const sorted = [...annotations]
      .filter((a) => a.term)
      .map((a) => {
        // 简单匹配：在文本中查找术语位置
        const idx = text.indexOf(a.term);
        return { ...a, start: idx };
      })
      .filter((a) => a.start >= 0)
      .sort((a, b) => a.start - b.start);

    const parts: React.ReactNode[] = [];
    let lastEnd = 0;

    sorted.forEach((ann, i) => {
      if (ann.start > lastEnd) {
        parts.push(<span key={`t-${i}`}>{text.slice(lastEnd, ann.start)}</span>);
      }
      parts.push(
        <mark
          key={`h-${ann.id}`}
          onClick={() => setSelected(ann)}
          className={`bg-bronze/25 text-bronze rounded px-0.5 cursor-pointer
            hover:bg-bronze/40 transition-colors ${
              selected?.id === ann.id ? 'ring-1 ring-bronze' : ''
            }`}
        >
          {ann.term}
        </mark>
      );
      lastEnd = ann.start + ann.term.length;
    });

    if (lastEnd < text.length) {
      parts.push(<span key="tail">{text.slice(lastEnd)}</span>);
    }

    return parts;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 text-bronze animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-4">
        <PageHeader
          title="标注工作台"
          subtitle={task ? `任务 #${task.id}` : '选择任务开始标注'}
        />
      </div>

      <div className="flex flex-1 min-h-0 px-6 pb-6 gap-4">
        {/* 左栏：古籍原文 */}
        <div className="w-[60%] flex flex-col">
          <div className="bg-ink-light border border-bronze/15 rounded-lg flex-1 overflow-auto p-6">
            <div
              ref={textRef}
              onMouseUp={handleMouseUp}
              className="font-serif text-base leading-8 text-paper/90 select-text whitespace-pre-wrap"
            >
              {renderHighlightedText()}
            </div>
          </div>

          {/* 框选后弹出的添加术语按钮 */}
          {showAddTerm && (
            <div className="mt-2 flex items-center gap-3 bg-ink-light border border-bronze/30 rounded-lg px-4 py-3">
              <span className="text-sm text-paper-dark">
                框选文本：<span className="text-bronze font-serif">{selectedText}</span>
              </span>
              <button
                onClick={handleAddTerm}
                className="flex items-center gap-1 px-3 py-1.5 bg-bronze text-ink text-xs
                  font-medium rounded hover:bg-bronze-light transition-colors"
              >
                <Plus className="w-3 h-3" />
                添加术语
              </button>
              <button
                onClick={() => { setShowAddTerm(false); setSelectedText(''); }}
                className="text-xs text-paper-dark hover:text-bronze-light transition-colors"
              >
                取消
              </button>
            </div>
          )}
        </div>

        {/* 右栏：属性面板 + 关系面板 */}
        <div className="w-[40%] flex flex-col gap-4 overflow-auto">
          {selected ? (
            <>
              <div className="bg-ink-light border border-bronze/15 rounded-lg p-4">
                <PropertyPanel
                  data={selected}
                  onChange={setSelected}
                  onSave={handleSave}
                  onDelete={handleDelete}
                />
              </div>
              <div className="bg-ink-light border border-bronze/15 rounded-lg p-4">
                <RelationPanel
                  relations={relations}
                  annotationId={selected.id}
                  allAnnotations={annotations.map((a) => ({ id: a.id, term: a.term }))}
                  onRefresh={fetchRelations}
                />
              </div>
            </>
          ) : (
            <div className="bg-ink-light border border-bronze/15 rounded-lg p-8 text-center">
              <p className="text-paper-dark/60 text-sm">
                在左侧原文中框选文本添加术语，或点击已标注术语查看属性
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
