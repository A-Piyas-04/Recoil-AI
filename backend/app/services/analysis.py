from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.analysis import Analysis
from app.models.brand_profile import BrandProfile
from app.schemas.analysis import AnalysisResult, AnalyzeRequest, validate_analysis_result
from app.services.ai import (
    AIAuthenticationError,
    AIConfigurationError,
    AIEmptyResponseError,
    AINetworkError,
    AIResponseError,
    AIServiceError,
    generate_analysis,
)


class BrandContext:
    def __init__(
        self,
        brand_values: str,
        brand_mission: str,
        previous_messaging: str,
        brand_profile_id: UUID | None = None,
    ):
        self.brand_values = brand_values
        self.brand_mission = brand_mission
        self.previous_messaging = previous_messaging
        self.brand_profile_id = brand_profile_id


def resolve_brand_context(db: Session, request: AnalyzeRequest) -> BrandContext:
    if request.brand_profile_id is not None:
        profile = db.get(BrandProfile, request.brand_profile_id)
        if profile is None:
            raise HTTPException(status_code=404, detail="Brand profile not found")
        return BrandContext(
            brand_values=profile.brand_values,
            brand_mission=profile.brand_mission,
            previous_messaging=profile.previous_messaging,
            brand_profile_id=profile.id,
        )

    return BrandContext(
        brand_values=request.brand_values or "",
        brand_mission=request.brand_mission or "",
        previous_messaging=request.previous_messaging or "",
        brand_profile_id=None,
    )


def run_and_persist_analysis(db: Session, request: AnalyzeRequest) -> tuple[Analysis, AnalysisResult]:
    context = resolve_brand_context(db, request)

    try:
        result = generate_analysis(
            campaign_draft=request.campaign_draft,
            brand_values=context.brand_values,
            brand_mission=context.brand_mission,
            previous_messaging=context.previous_messaging,
        )
        result = validate_analysis_result(result)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except AIAuthenticationError as exc:
        raise HTTPException(status_code=401, detail=exc.user_message) from exc
    except AIConfigurationError as exc:
        raise HTTPException(status_code=503, detail=exc.user_message) from exc
    except (AINetworkError, AIEmptyResponseError) as exc:
        raise HTTPException(status_code=502, detail=exc.user_message) from exc
    except (AIResponseError, AIServiceError) as exc:
        raise HTTPException(status_code=422, detail=exc.user_message) from exc

    row = Analysis(
        brand_profile_id=context.brand_profile_id,
        campaign_draft=request.campaign_draft,
        brand_values=context.brand_values,
        brand_mission=context.brand_mission,
        previous_messaging=context.previous_messaging,
        backlash_risk_score=result.backlash_risk_score,
        result_json=result.model_dump(mode="json"),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row, result
