export type PersonaType = "activist" | "journalist" | "competitor" | "meme_creator";

export interface PersonaCritique {
  persona: PersonaType;
  headline: string;
  attacks: string[];
}

export interface MemeConcept {
  title: string;
  caption: string;
  memeability_score: number;
}

export interface RiskBreakdown {
  offense_risk: number;
  meme_risk: number;
  competitor_risk: number;
  brand_reputation_risk: number;
}

export interface CrisisScenario {
  headline: string;
  timeline: string[];
  post_mortem: string;
}

export interface BrandConsistencyResult {
  alignment_score: number;
  mismatches: string[];
  recommendations: string[];
}

export interface AnalysisResult {
  red_team: PersonaCritique[];
  meme_concepts: MemeConcept[];
  backlash_risk_score: number;
  risk_breakdown: RiskBreakdown;
  future_crisis: CrisisScenario;
  brand_consistency: BrandConsistencyResult;
}

export interface BrandProfile {
  id: string;
  name: string;
  brand_values: string;
  brand_mission: string;
  previous_messaging: string;
  created_at: string;
  updated_at: string;
}

export interface AnalyzeRequest {
  campaign_draft: string;
  brand_profile_id?: string;
  brand_values?: string;
  brand_mission?: string;
  previous_messaging?: string;
}

export interface AnalyzeResponse {
  analysis_id: string;
  result: AnalysisResult;
  created_at: string;
  ai_source: string;
}

export interface AnalysisSummary {
  id: string;
  campaign_snippet: string;
  backlash_risk_score: number;
  created_at: string;
}

export interface AnalysisDetail {
  id: string;
  brand_profile_id: string | null;
  campaign_draft: string;
  brand_values: string;
  brand_mission: string;
  previous_messaging: string;
  backlash_risk_score: number;
  result: AnalysisResult;
  created_at: string;
  ai_source: string;
}

export const PERSONA_LABELS: Record<PersonaType, string> = {
  activist: "Activist",
  journalist: "Journalist",
  competitor: "Competitor",
  meme_creator: "Meme Creator",
};
