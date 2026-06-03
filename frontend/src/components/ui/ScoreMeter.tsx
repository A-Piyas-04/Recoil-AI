interface ScoreMeterProps {
  score: number;
  label?: string;
  size?: "lg" | "sm";
}

function riskColor(score: number): string {
  if (score >= 70) return "text-risk-high";
  if (score >= 40) return "text-risk-mid";
  return "text-risk-low";
}

function barColor(score: number): string {
  if (score >= 70) return "bg-risk-high";
  if (score >= 40) return "bg-risk-mid";
  return "bg-risk-low";
}

export function ScoreMeter({ score, label, size = "lg" }: ScoreMeterProps) {
  return (
    <div>
      {label && (
        <span className="text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
      )}
      <span
        className={`block font-semibold ${riskColor(score)} ${size === "lg" ? "text-4xl" : "text-xl"}`}
      >
        {score}
        <span className="text-lg text-muted">/100</span>
      </span>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full transition-all ${barColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
