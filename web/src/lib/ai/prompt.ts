import type { CampaignInput } from "@/types/analysis";
import { ANALYSIS_JSON_SCHEMA } from "@/lib/analysis-schema";

export const SYSTEM_INSTRUCTION = `You are Faultline AI, a campaign red-team analyst for marketing teams.
Predict backlash before launch. Be specific, adversarial where appropriate, and grounded in the provided copy.
Do not claim real social listening, scraping, or live data. Output ONLY valid JSON matching the schema exactly.`;

export function buildUserPrompt(campaign: CampaignInput): string {
  return `Analyze this marketing campaign and return one JSON object.

CAMPAIGN NAME:
${campaign.campaign_name}

SLOGAN:
${campaign.slogan}

CAMPAIGN DESCRIPTION:
${campaign.campaign_description}

CAMPAIGN COPY:
${campaign.campaign_copy}

Required output sections:
1. red_team — Exactly four personas: activist, journalist, competitor, meme_creator. Each needs headline, perspective (2-4 sentences), key_points (at least 2).
2. meme_simulator — Exactly 3 parody meme concepts with title, caption, explanation, memeability_score (0-100).
3. backlash_risk — overall_score, offense_risk, meme_risk, competitor_risk, reputation_risk (all 0-100), summary (2-4 sentences).
4. future_crisis — fictional headline, crisis_article (news style, multiple paragraphs), root_cause, prevention_recommendations (3-5 items).

JSON schema:
${JSON.stringify(ANALYSIS_JSON_SCHEMA, null, 2)}`;
}
