export type PersonaType =
  | "activist"
  | "journalist"
  | "competitor"
  | "meme_creator";

export interface CampaignInput {
  campaign_name: string;
  slogan: string;
  campaign_description: string;
  campaign_copy: string;
}

export interface RedTeamPersona {
  persona: PersonaType;
  headline: string;
  perspective: string;
  key_points: string[];
}

export interface MemeConcept {
  title: string;
  caption: string;
  explanation: string;
  memeability_score: number;
}

export interface BacklashRisk {
  overall_score: number;
  offense_risk: number;
  meme_risk: number;
  competitor_risk: number;
  reputation_risk: number;
  summary: string;
}

export interface FutureCrisis {
  headline: string;
  crisis_article: string;
  root_cause: string;
  prevention_recommendations: string[];
}

export interface AnalysisResult {
  red_team: RedTeamPersona[];
  meme_simulator: MemeConcept[];
  backlash_risk: BacklashRisk;
  future_crisis: FutureCrisis;
}

export const PERSONA_LABELS: Record<PersonaType, string> = {
  activist: "Activist",
  journalist: "Journalist",
  competitor: "Competitor",
  meme_creator: "Meme Creator",
};

export const REQUIRED_PERSONAS: PersonaType[] = [
  "activist",
  "journalist",
  "competitor",
  "meme_creator",
];
