import type { BacklashRisk } from "@/types/analysis";
import { ScoreMeter } from "@/components/ui/ScoreMeter";
import { riskLevel, riskTextClass } from "@/lib/risk";

interface RiskScoreSectionProps {
  risk: BacklashRisk;
}

const BREAKDOWN_LABELS: { key: keyof Omit<BacklashRisk, "summary">; label: string }[] =
  [
    { key: "offense_risk", label: "Offense risk" },
    { key: "meme_risk", label: "Meme risk" },
    { key: "competitor_risk", label: "Competitor risk" },
    { key: "reputation_risk", label: "Reputation risk" },
  ];

export function RiskScoreSection({ risk }: RiskScoreSectionProps) {
  const level = riskLevel(risk.overall_score);

  return (
    <section className="rounded-sm border border-stone-200 bg-white p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
        03 — Backlash risk score
      </p>
      <h2 className="mt-2 font-serif text-2xl font-semibold text-stone-900">
        Pre-launch risk assessment
      </h2>
      <div className="mt-8 grid gap-10 lg:grid-cols-[280px_1fr]">
        <div className="border border-stone-200 bg-stone-50 p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Overall score
          </p>
          <p
            className={`mt-2 font-serif text-6xl font-semibold tabular-nums ${riskTextClass(risk.overall_score)}`}
          >
            {risk.overall_score}
          </p>
          <p className="mt-2 text-sm capitalize text-stone-600">{level} risk</p>
          <ScoreMeter
            label="Composite"
            score={risk.overall_score}
            large
          />
        </div>
        <div className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {BREAKDOWN_LABELS.map(({ key, label }) => (
              <ScoreMeter key={key} label={label} score={risk[key]} />
            ))}
          </div>
          <div className="border-t border-stone-200 pt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Summary
            </p>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">
              {risk.summary}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
