/** JSON schema description sent to models for strict structured output. */
export const ANALYSIS_JSON_SCHEMA = {
  red_team: [
    {
      persona: "activist | journalist | competitor | meme_creator",
      headline: "string",
      perspective: "string (2-4 sentences)",
      key_points: ["string", "at least 2 items"],
    },
    "exactly 4 items, one per persona",
  ],
  meme_simulator: [
    {
      title: "string",
      caption: "string",
      explanation: "string",
      memeability_score: "integer 0-100",
    },
    "exactly 3 items",
  ],
  backlash_risk: {
    overall_score: "integer 0-100",
    offense_risk: "integer 0-100",
    meme_risk: "integer 0-100",
    competitor_risk: "integer 0-100",
    reputation_risk: "integer 0-100",
    summary: "string (2-4 sentences)",
  },
  future_crisis: {
    headline: "string",
    crisis_article: "string (news article style, 3-5 paragraphs)",
    root_cause: "string",
    prevention_recommendations: ["string", "3-5 items"],
  },
} as const;
