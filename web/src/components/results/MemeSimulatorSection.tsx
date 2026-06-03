import type { MemeConcept } from "@/types/analysis";
import { riskTextClass } from "@/lib/risk";

interface MemeSimulatorSectionProps {
  concepts: MemeConcept[];
}

export function MemeSimulatorSection({ concepts }: MemeSimulatorSectionProps) {
  return (
    <section className="rounded-sm border border-stone-200 bg-white p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
        02 — Meme attack simulator
      </p>
      <h2 className="mt-2 font-serif text-2xl font-semibold text-stone-900">
        Parody meme concepts
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">
        Fictional meme formats that could spread against this campaign, with
        memeability scoring.
      </p>
      <div className="mt-8 space-y-5">
        {concepts.map((meme, index) => (
          <article
            key={`${meme.title}-${index}`}
            className="grid gap-4 border border-stone-200 p-5 md:grid-cols-[1fr_auto]"
          >
            <div>
              <h3 className="font-serif text-lg font-semibold text-stone-900">
                {meme.title}
              </h3>
              <p className="mt-2 rounded-sm border-l-2 border-stone-300 bg-stone-50 px-4 py-3 font-mono text-sm text-stone-800">
                {meme.caption}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                {meme.explanation}
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end md:justify-center">
              <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                Memeability
              </span>
              <span
                className={`mt-1 text-3xl font-semibold tabular-nums ${riskTextClass(meme.memeability_score)}`}
              >
                {meme.memeability_score}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
