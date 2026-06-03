from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.analysis import Analysis
from app.schemas.analysis import (
    AnalysisDetail,
    AnalysisResult,
    AnalysisSummary,
    AnalyzeRequest,
    AnalyzeResponse,
)
from app.services.analysis import run_and_persist_analysis

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse, status_code=201)
def analyze_campaign(payload: AnalyzeRequest, db: Session = Depends(get_db)):
    row, result = run_and_persist_analysis(db, payload)
    return AnalyzeResponse(analysis_id=row.id, result=result, created_at=row.created_at)


@router.get("/analyses", response_model=list[AnalysisSummary])
def list_analyses(db: Session = Depends(get_db)):
    stmt = select(Analysis).order_by(Analysis.created_at.desc())
    rows = list(db.scalars(stmt).all())
    return [
        AnalysisSummary(
            id=row.id,
            campaign_name=row.campaign_name,
            backlash_risk_score=row.backlash_risk_score,
            created_at=row.created_at,
        )
        for row in rows
    ]


@router.get("/analyses/{analysis_id}", response_model=AnalysisDetail)
def get_analysis(analysis_id: UUID, db: Session = Depends(get_db)):
    row = db.get(Analysis, analysis_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Analysis not found")

    return AnalysisDetail(
        id=row.id,
        campaign_name=row.campaign_name,
        slogan=row.slogan,
        campaign_description=row.campaign_description,
        campaign_copy=row.campaign_copy,
        backlash_risk_score=row.backlash_risk_score,
        result=AnalysisResult.model_validate(row.result_json),
        created_at=row.created_at,
    )
