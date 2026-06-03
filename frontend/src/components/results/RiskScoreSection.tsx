import type { RiskBreakdown } from "../../types/analysis";
import { ScoreMeter } from "../ui/ScoreMeter";

interface RiskScoreSectionProps {
  score: number;
  breakdown: RiskBreakdown;
}

const BREAKDOWN_LABELS: { key: keyof RiskBreakdown; label: string }[] = [
  { key: "offense_risk", label: "Offense risk" },
  { key: "meme_risk", label: "Meme risk" },
  { key: "competitor_risk", label: "Competitor risk" },
  { key: "brand_reputation_risk", label: "Brand reputation" },
];

export function RiskScoreSection({ score, breakdown }: RiskScoreSectionProps) {
  return (
    <section className="rounded-lg border border-border bg-paper p-6">
      <h2 className="font-serif text-xl font-semibold text-ink">Backlash Risk Score</h2>
      <p className="mt-1 text-sm text-muted">Overall pre-launch backlash probability (0–100).</p>
      <div className="mt-5 max-w-xs">
        <ScoreMeter score={score} label="Overall risk" size="lg" />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {BREAKDOWN_LABELS.map(({ key, label }) => (
          <div key={key} className="w-full max-w-xs">
            <ScoreMeter score={breakdown[key]} label={label} size="sm" />
          </div>
        ))}
      </div>
    </section>
  );
}
