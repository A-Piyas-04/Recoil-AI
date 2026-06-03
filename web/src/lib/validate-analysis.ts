import type { AnalysisResult, PersonaType } from "@/types/analysis";
import { REQUIRED_PERSONAS } from "@/types/analysis";

function isPersona(value: unknown): value is PersonaType {
  return (
    typeof value === "string" &&
    (REQUIRED_PERSONAS as string[]).includes(value)
  );
}

function scoreInRange(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${field} must be a number`);
  }
  const n = Math.round(value);
  if (n < 0 || n > 100) {
    throw new Error(`${field} must be between 0 and 100`);
  }
  return n;
}

function nonEmptyString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} must be a non-empty string`);
  }
  return value.trim();
}

function stringArray(value: unknown, field: string, min = 1): string[] {
  if (!Array.isArray(value)) {
    throw new Error(`${field} must be an array`);
  }
  const items = value
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .map((x) => x.trim());
  if (items.length < min) {
    throw new Error(`${field} must have at least ${min} items`);
  }
  return items;
}

export function validateAnalysisResult(raw: unknown): AnalysisResult {
  if (!raw || typeof raw !== "object") {
    throw new Error("Response must be a JSON object");
  }
  const data = raw as Record<string, unknown>;

  if (!Array.isArray(data.red_team)) {
    throw new Error("red_team must be an array");
  }
  const personas = new Set<PersonaType>();
  const red_team = data.red_team.map((item, i) => {
    if (!item || typeof item !== "object") {
      throw new Error(`red_team[${i}] invalid`);
    }
    const row = item as Record<string, unknown>;
    if (!isPersona(row.persona)) {
      throw new Error(`red_team[${i}].persona invalid`);
    }
    personas.add(row.persona);
    return {
      persona: row.persona,
      headline: nonEmptyString(row.headline, `red_team[${i}].headline`),
      perspective: nonEmptyString(row.perspective, `red_team[${i}].perspective`),
      key_points: stringArray(row.key_points, `red_team[${i}].key_points`, 2),
    };
  });
  for (const p of REQUIRED_PERSONAS) {
    if (!personas.has(p)) {
      throw new Error(`red_team missing persona: ${p}`);
    }
  }
  if (red_team.length !== 4) {
    throw new Error("red_team must contain exactly 4 personas");
  }

  if (!Array.isArray(data.meme_simulator) || data.meme_simulator.length !== 3) {
    throw new Error("meme_simulator must contain exactly 3 items");
  }
  const meme_simulator = data.meme_simulator.map((item, i) => {
    if (!item || typeof item !== "object") {
      throw new Error(`meme_simulator[${i}] invalid`);
    }
    const row = item as Record<string, unknown>;
    return {
      title: nonEmptyString(row.title, `meme_simulator[${i}].title`),
      caption: nonEmptyString(row.caption, `meme_simulator[${i}].caption`),
      explanation: nonEmptyString(
        row.explanation,
        `meme_simulator[${i}].explanation`,
      ),
      memeability_score: scoreInRange(
        row.memeability_score,
        `meme_simulator[${i}].memeability_score`,
      ),
    };
  });

  if (!data.backlash_risk || typeof data.backlash_risk !== "object") {
    throw new Error("backlash_risk required");
  }
  const risk = data.backlash_risk as Record<string, unknown>;
  const backlash_risk = {
    overall_score: scoreInRange(risk.overall_score, "backlash_risk.overall_score"),
    offense_risk: scoreInRange(risk.offense_risk, "backlash_risk.offense_risk"),
    meme_risk: scoreInRange(risk.meme_risk, "backlash_risk.meme_risk"),
    competitor_risk: scoreInRange(
      risk.competitor_risk,
      "backlash_risk.competitor_risk",
    ),
    reputation_risk: scoreInRange(
      risk.reputation_risk,
      "backlash_risk.reputation_risk",
    ),
    summary: nonEmptyString(risk.summary, "backlash_risk.summary"),
  };

  if (!data.future_crisis || typeof data.future_crisis !== "object") {
    throw new Error("future_crisis required");
  }
  const crisis = data.future_crisis as Record<string, unknown>;
  const future_crisis = {
    headline: nonEmptyString(crisis.headline, "future_crisis.headline"),
    crisis_article: nonEmptyString(
      crisis.crisis_article,
      "future_crisis.crisis_article",
    ),
    root_cause: nonEmptyString(crisis.root_cause, "future_crisis.root_cause"),
    prevention_recommendations: stringArray(
      crisis.prevention_recommendations,
      "future_crisis.prevention_recommendations",
      3,
    ),
  };

  return { red_team, meme_simulator, backlash_risk, future_crisis };
}
