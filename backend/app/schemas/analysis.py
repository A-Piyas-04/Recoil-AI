from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


class PersonaCritique(BaseModel):
    persona: Literal["activist", "journalist", "competitor", "meme_creator"]
    headline: str
    attacks: list[str]


class MemeConcept(BaseModel):
    title: str
    caption: str
    memeability_score: int = Field(..., ge=0, le=100)


class RiskBreakdown(BaseModel):
    offense_risk: int = Field(..., ge=0, le=100)
    meme_risk: int = Field(..., ge=0, le=100)
    competitor_risk: int = Field(..., ge=0, le=100)
    brand_reputation_risk: int = Field(..., ge=0, le=100)


class CrisisScenario(BaseModel):
    headline: str
    timeline: list[str]
    post_mortem: str


class BrandConsistencyResult(BaseModel):
    alignment_score: int = Field(..., ge=0, le=100)
    mismatches: list[str]
    recommendations: list[str]


class AnalysisResult(BaseModel):
    red_team: list[PersonaCritique]
    meme_concepts: list[MemeConcept]
    backlash_risk_score: int = Field(..., ge=0, le=100)
    risk_breakdown: RiskBreakdown
    future_crisis: CrisisScenario
    brand_consistency: BrandConsistencyResult


REQUIRED_PERSONAS = {"activist", "journalist", "competitor", "meme_creator"}


def validate_analysis_result(result: AnalysisResult) -> AnalysisResult:
    personas = {c.persona for c in result.red_team}
    if personas != REQUIRED_PERSONAS:
        raise ValueError(f"red_team must include exactly: {REQUIRED_PERSONAS}")
    if len(result.meme_concepts) != 3:
        raise ValueError("meme_concepts must contain exactly 3 items")
    for critique in result.red_team:
        if len(critique.attacks) < 2:
            raise ValueError(f"persona {critique.persona} needs at least 2 attacks")
    if len(result.future_crisis.timeline) < 3:
        raise ValueError("future_crisis.timeline needs at least 3 steps")
    return result


class AnalyzeRequest(BaseModel):
    campaign_draft: str = Field(..., min_length=50)
    brand_profile_id: UUID | None = None
    brand_values: str | None = None
    brand_mission: str | None = None
    previous_messaging: str | None = None


class AnalyzeResponse(BaseModel):
    analysis_id: UUID
    result: AnalysisResult
    created_at: datetime


class AnalysisSummary(BaseModel):
    id: UUID
    campaign_snippet: str
    backlash_risk_score: int
    created_at: datetime

    model_config = {"from_attributes": True}


class AnalysisDetail(BaseModel):
    id: UUID
    brand_profile_id: UUID | None
    campaign_draft: str
    brand_values: str
    brand_mission: str
    previous_messaging: str
    backlash_risk_score: int
    result: AnalysisResult
    created_at: datetime

    model_config = {"from_attributes": True}
