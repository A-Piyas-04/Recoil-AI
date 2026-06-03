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


class CrisisScenario(BaseModel):
    headline: str
    summary: str
    prevention_advice: str


class AnalysisResult(BaseModel):
    red_team: list[PersonaCritique]
    meme_concepts: list[MemeConcept]
    backlash_risk_score: int = Field(..., ge=0, le=100)
    risk_explanation: str
    future_crisis: CrisisScenario


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
    return result


class AnalyzeRequest(BaseModel):
    campaign_name: str = Field(..., min_length=1, max_length=200)
    slogan: str = Field(..., min_length=1, max_length=500)
    campaign_description: str = Field(..., min_length=10)
    campaign_copy: str = Field(..., min_length=20)

    def to_campaign_prompt(self) -> str:
        return (
            f"Campaign Name: {self.campaign_name}\n"
            f"Slogan: {self.slogan}\n"
            f"Description: {self.campaign_description}\n"
            f"Copy:\n{self.campaign_copy}"
        )


class AnalyzeResponse(BaseModel):
    analysis_id: UUID
    result: AnalysisResult
    created_at: datetime


class AnalysisSummary(BaseModel):
    id: UUID
    campaign_name: str
    backlash_risk_score: int
    created_at: datetime

    model_config = {"from_attributes": True}


class AnalysisDetail(BaseModel):
    id: UUID
    campaign_name: str
    slogan: str
    campaign_description: str
    campaign_copy: str
    backlash_risk_score: int
    result: AnalysisResult
    created_at: datetime

    model_config = {"from_attributes": True}
