import RatingSlider from '@/components/ui/RatingSlider';

interface AnnotationData {
  id: number;
  term: string;
  category: string;
  literalMeaning: number;
  extendedMeaning: number;
  culturalLoad: number;
  bookSpecificity: number;
  eraSpecificity: number;
  literalFeasibility: number;
  freeTranslationPriority: number;
  missingConcept: boolean;
  modernDefinition: string;
  englishEquivalent: string;
  note: string;
}

const CATEGORIES = ['农事操作', '农具', '作物', '土壤', '水利', '其他'];

interface PropertyPanelProps {
  data: AnnotationData;
  onChange: (data: AnnotationData) => void;
  onSave: () => void;
  onDelete: () => void;
}

export default function PropertyPanel({ data, onChange, onSave, onDelete }: PropertyPanelProps) {
  const update = (partial: Partial<AnnotationData>) => onChange({ ...data, ...partial });

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-base text-bronze font-semibold border-b border-bronze/15 pb-2">
        属性标注
      </h3>

      {/* 术语名（只读） */}
      <div>
        <label className="block text-xs text-paper-dark mb-1">术语名</label>
        <div className="px-3 py-2 bg-ink rounded text-sm text-bronze font-serif border border-bronze/10">
          {data.term}
        </div>
      </div>

      {/* 类别 */}
      <div>
        <label className="block text-xs text-paper-dark mb-1">类别</label>
        <select
          value={data.category}
          onChange={(e) => update({ category: e.target.value })}
          className="w-full px-3 py-2 bg-ink border border-bronze/20 rounded text-sm text-paper
            focus:outline-none focus:border-bronze"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* 语义维度 */}
      <div>
        <p className="text-xs text-paper-dark/80 mb-2 font-medium">语义维度</p>
        <div className="space-y-2">
          <RatingSlider label="字面义" value={data.literalMeaning} onChange={(v) => update({ literalMeaning: v })} />
          <RatingSlider label="引申义" value={data.extendedMeaning} onChange={(v) => update({ extendedMeaning: v })} />
          <RatingSlider label="文化负载" value={data.culturalLoad} onChange={(v) => update({ culturalLoad: v })} />
        </div>
      </div>

      {/* 语境维度 */}
      <div>
        <p className="text-xs text-paper-dark/80 mb-2 font-medium">语境维度</p>
        <div className="space-y-2">
          <RatingSlider label="专书特征度" value={data.bookSpecificity} onChange={(v) => update({ bookSpecificity: v })} />
          <RatingSlider label="时代特异性" value={data.eraSpecificity} onChange={(v) => update({ eraSpecificity: v })} />
        </div>
      </div>

      {/* 翻译维度 */}
      <div>
        <p className="text-xs text-paper-dark/80 mb-2 font-medium">翻译维度</p>
        <div className="space-y-2">
          <RatingSlider label="直译可行性" value={data.literalFeasibility} onChange={(v) => update({ literalFeasibility: v })} />
          <RatingSlider label="意译优先级" value={data.freeTranslationPriority} onChange={(v) => update({ freeTranslationPriority: v })} />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => update({ missingConcept: !data.missingConcept })}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                data.missingConcept ? 'bg-bronze border-bronze' : 'border-paper-dark/40'
              }`}
            >
              {data.missingConcept && <span className="text-ink text-xs">✓</span>}
            </button>
            <span className="text-sm text-paper-dark">缺失概念</span>
          </div>
        </div>
      </div>

      {/* 现代释义 */}
      <div>
        <label className="block text-xs text-paper-dark mb-1">现代释义</label>
        <input
          value={data.modernDefinition}
          onChange={(e) => update({ modernDefinition: e.target.value })}
          className="w-full px-3 py-2 bg-ink border border-bronze/20 rounded text-sm text-paper
            focus:outline-none focus:border-bronze"
          placeholder="输入现代释义"
        />
      </div>

      {/* 英文等价 */}
      <div>
        <label className="block text-xs text-paper-dark mb-1">英文等价</label>
        <input
          value={data.englishEquivalent}
          onChange={(e) => update({ englishEquivalent: e.target.value })}
          className="w-full px-3 py-2 bg-ink border border-bronze/20 rounded text-sm text-paper
            focus:outline-none focus:border-bronze"
          placeholder="English equivalent"
        />
      </div>

      {/* 备注 */}
      <div>
        <label className="block text-xs text-paper-dark mb-1">备注</label>
        <textarea
          value={data.note}
          onChange={(e) => update({ note: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 bg-ink border border-bronze/20 rounded text-sm text-paper
            focus:outline-none focus:border-bronze resize-none"
          placeholder="备注信息"
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={onSave}
          className="flex-1 px-4 py-2 bg-bronze text-ink text-sm font-medium rounded
            hover:bg-bronze-light transition-colors"
        >
          保存
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 border border-red-400/40 text-red-400 text-sm rounded
            hover:bg-red-400/10 transition-colors"
        >
          删除
        </button>
      </div>
    </div>
  );
}

export type { AnnotationData };
