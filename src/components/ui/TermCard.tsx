import { Star, GitBranch } from "lucide-react";

interface TermCardProps {
  term: string;
  category: string;
  source: string;
  culturalLoad: number;
  modernDef: string;
  englishEquiv: string;
  relationCount: number;
  onClick?: () => void;
}

export default function TermCard({
  term,
  category,
  source,
  culturalLoad,
  modernDef,
  englishEquiv,
  relationCount,
  onClick,
}: TermCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-ink-light border border-bronze/25 rounded-lg p-4 transition-colors
        ${onClick ? "cursor-pointer hover:border-bronze/50 hover:bg-ink-lighter" : ""}`}
    >
      {/* 术语名 + 类别 */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-serif text-xl text-bronze font-semibold">{term}</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-bamboo/15 text-bamboo-light">
          {category}
        </span>
      </div>

      {/* 出处 */}
      <p className="text-xs text-paper-dark mb-2">出处：{source}</p>

      {/* 文化负载星级 */}
      <div className="flex items-center gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < culturalLoad ? "text-bronze fill-bronze" : "text-paper-dark/30"
            }`}
          />
        ))}
        <span className="text-xs text-paper-dark ml-1">文化负载</span>
      </div>

      {/* 现代释义 */}
      <p className="text-sm text-paper-dark/80 mb-1.5 line-clamp-2">{modernDef}</p>

      {/* 英译 + 关联数 */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-bronze/10">
        <span className="text-xs text-bronze-light italic">{englishEquiv}</span>
        <span className="flex items-center gap-1 text-xs text-paper-dark">
          <GitBranch className="w-3 h-3" />
          {relationCount}
        </span>
      </div>
    </div>
  );
}
