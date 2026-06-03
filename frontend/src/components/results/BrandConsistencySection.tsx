import type { BrandConsistencyResult } from "../../types/analysis";
import { ScoreMeter } from "../ui/ScoreMeter";

interface BrandConsistencySectionProps {
  consistency: BrandConsistencyResult;
}

export function BrandConsistencySection({ consistency }: BrandConsistencySectionProps) {
  return (
    <section className="rounded-lg border border-border bg-paper p-6">
      <h2 className="font-serif text-xl font-semibold text-ink">Brand Consistency Detector</h2>
      <p className="mt-1 text-sm text-muted">
        Alignment with your brand values, mission, and prior messaging.
      </p>
      <div className="mt-5 max-w-xs">
        <ScoreMeter score={consistency.alignment_score} label="Alignment score" size="lg" />
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-ink">Mismatches</h3>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted">
            {consistency.mismatches.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">Recommendations</h3>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted">
            {consistency.recommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
