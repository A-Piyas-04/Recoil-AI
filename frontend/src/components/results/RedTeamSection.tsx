import type { PersonaCritique } from "../../types/analysis";
import { PersonaCard } from "../ui/PersonaCard";

interface RedTeamSectionProps {
  redTeam: PersonaCritique[];
}

export function RedTeamSection({ redTeam }: RedTeamSectionProps) {
  return (
    <section className="rounded-lg border border-border bg-paper p-6">
      <h2 className="font-serif text-xl font-semibold text-ink">Red-Team Analysis</h2>
      <p className="mt-1 text-sm text-muted">
        Four adversarial personas stress-test your campaign before launch.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {redTeam.map((critique) => (
          <PersonaCard key={critique.persona} critique={critique} />
        ))}
      </div>
    </section>
  );
}
