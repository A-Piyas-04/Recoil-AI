import type { RedTeamPersona } from "@/types/analysis";
import { PERSONA_LABELS } from "@/types/analysis";

interface RedTeamSectionProps {
  personas: RedTeamPersona[];
}

export function RedTeamSection({ personas }: RedTeamSectionProps) {
  const ordered = [...personas].sort((a, b) =>
    a.persona.localeCompare(b.persona),
  );

  return (
    <section className="rounded-sm border border-stone-200 bg-white p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
        01 — Red-team analysis
      </p>
      <h2 className="mt-2 font-serif text-2xl font-semibold text-stone-900">
        Adversarial perspectives
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">
        How activist, media, competitor, and meme-creator voices might frame your
        campaign before launch.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {ordered.map((item) => (
          <article
            key={item.persona}
            className="border border-stone-200 bg-stone-50/50 p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              {PERSONA_LABELS[item.persona]} perspective
            </p>
            <h3 className="mt-2 font-serif text-lg font-semibold text-stone-900">
              {item.headline}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">
              {item.perspective}
            </p>
            <ul className="mt-4 space-y-2 border-t border-stone-200 pt-4 text-sm text-stone-600">
              {item.key_points.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="text-stone-400" aria-hidden>
                    —
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
