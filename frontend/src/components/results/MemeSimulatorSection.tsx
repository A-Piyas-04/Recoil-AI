import type { MemeConcept } from "../../types/analysis";
import { ScoreMeter } from "../ui/ScoreMeter";

interface MemeSimulatorSectionProps {
  memes: MemeConcept[];
}

export function MemeSimulatorSection({ memes }: MemeSimulatorSectionProps) {
  return (
    <section className="rounded-lg border border-border bg-paper p-6">
      <h2 className="font-serif text-xl font-semibold text-ink">Meme Attack Simulator</h2>
      <p className="mt-1 text-sm text-muted">
        Parody meme concepts that could spread if the campaign launches.
      </p>
      <div className="mt-5 space-y-4">
        {memes.map((meme) => (
          <article key={meme.title} className="rounded-md border border-border bg-surface p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h3 className="font-medium text-ink">{meme.title}</h3>
              <div className="w-28">
                <ScoreMeter score={meme.memeability_score} label="Memeability" size="sm" />
              </div>
            </div>
            <p className="mt-2 text-sm italic text-muted">&ldquo;{meme.caption}&rdquo;</p>
          </article>
        ))}
      </div>
    </section>
  );
}
