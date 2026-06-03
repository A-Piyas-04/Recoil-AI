import type { FutureCrisis } from "@/types/analysis";

interface CrisisSectionProps {
  crisis: FutureCrisis;
}

export function CrisisSection({ crisis }: CrisisSectionProps) {
  const paragraphs = crisis.crisis_article
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="rounded-sm border border-stone-200 bg-white p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
        04 — Future crisis generator
      </p>
      <h2 className="mt-2 font-serif text-2xl font-semibold text-stone-900">
        Fictional crisis scenario
      </h2>
      <p className="mt-6 font-serif text-xl font-medium leading-snug text-stone-900">
        {crisis.headline}
      </p>
      <div className="mt-6 space-y-4 border-l-2 border-stone-300 pl-6">
        {paragraphs.map((paragraph) => (
          <p
            key={paragraph.slice(0, 48)}
            className="text-sm leading-relaxed text-stone-700"
          >
            {paragraph}
          </p>
        ))}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="border border-stone-200 bg-stone-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Root cause
          </p>
          <p className="mt-3 text-sm leading-relaxed text-stone-700">
            {crisis.root_cause}
          </p>
        </div>
        <div className="border border-stone-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Prevention recommendations
          </p>
          <ul className="mt-3 space-y-2 text-sm text-stone-700">
            {crisis.prevention_recommendations.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="font-medium text-stone-400">{">"}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
