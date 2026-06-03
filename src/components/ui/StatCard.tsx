import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
}

export default function StatCard({ label, value, icon, trend }: StatCardProps) {
  const isPositive = trend && trend.startsWith("+");
  const isNegative = trend && trend.startsWith("-");

  return (
    <div className="bg-ink-light border border-bronze/15 rounded-lg p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-paper-dark">{label}</span>
        <span className="text-bronze/60">{icon}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="font-serif text-2xl text-bronze font-semibold">{value}</span>
        {trend && (
          <span
            className={`text-xs flex items-center gap-0.5 mb-1 ${
              isPositive ? "text-bamboo-light" : isNegative ? "text-red-400" : "text-paper-dark"
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : isNegative ? <TrendingDown className="w-3 h-3" /> : null}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
