interface RatingSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export default function RatingSlider({ label, value, onChange }: RatingSliderProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-paper-dark min-w-[4em]">{label}</span>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-6 h-6 rounded-full border-2 transition-colors ${
              n <= value
                ? "bg-bronze border-bronze"
                : "bg-transparent border-paper-dark/40 hover:border-bronze/50"
            }`}
            aria-label={`${label} ${n}`}
          />
        ))}
      </div>
      <span className="text-xs text-bronze font-medium w-4 text-center">{value}</span>
    </div>
  );
}
