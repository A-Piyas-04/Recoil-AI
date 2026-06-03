import type { CrisisScenario } from "../../types/analysis";

interface CrisisSectionProps {
  crisis: CrisisScenario;
}

export function CrisisSection({ crisis }: CrisisSectionProps) {
  return (
    <section className="rounded-lg border border-border bg-paper p-6">
      <h2 className="font-serif text-xl font-semibold text-ink">Future Crisis Generator</h2>
      <p className="mt-1 text-sm text-muted">
        Fictional scenario if this campaign launches without changes.
      </p>
      <article className="mt-5 rounded-md border-l-4 border-risk-high bg-surface p-5">
        <h3 className="font-serif text-lg font-semibold text-ink">{crisis.headline}</h3>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted">
          {crisis.timeline.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className="mt-4 border-t border-border pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-accent">Post-mortem</h4>
          <p className="mt-2 text-sm leading-relaxed text-ink">{crisis.post_mortem}</p>
        </div>
      </article>
    </section>
  );
}
