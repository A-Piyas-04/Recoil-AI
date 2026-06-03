import { riskBarClass, riskTextClass } from "@/lib/risk";

interface ScoreMeterProps {
  label: string;
  score: number;
  large?: boolean;
}

export function ScoreMeter({ label, score, large }: ScoreMeterProps) {
  return (
    <div className={large ? "space-y-3" : "space-y-2"}>
      <div className="flex items-baseline justify-between gap-4">
        <span
          className={
            large
              ? "text-sm font-medium uppercase tracking-wide text-stone-500"
              : "text-xs font-medium uppercase tracking-wide text-stone-500"
          }
        >
          {label}
        </span>
        <span
          className={`font-semibold tabular-nums ${large ? "text-3xl" : "text-lg"} ${riskTextClass(score)}`}
        >
          {score}
        </span>
      </div>
      <div
        className={`overflow-hidden rounded-sm bg-stone-100 ${large ? "h-3" : "h-2"}`}
      >
        <div
          className={`h-full rounded-sm transition-all ${riskBarClass(score)}`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
}
