import type { PersonaCritique } from "../../types/analysis";
import { PERSONA_LABELS } from "../../types/analysis";

interface PersonaCardProps {
  critique: PersonaCritique;
}

export function PersonaCard({ critique }: PersonaCardProps) {
  return (
    <article className="rounded-lg border border-border bg-surface p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-accent">
        {PERSONA_LABELS[critique.persona]}
      </h4>
      <p className="mt-2 font-medium text-ink">{critique.headline}</p>
      <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-muted">
        {critique.attacks.map((attack) => (
          <li key={attack}>{attack}</li>
        ))}
      </ul>
    </article>
  );
}
