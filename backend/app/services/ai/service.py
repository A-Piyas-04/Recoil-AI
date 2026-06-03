import logging
from typing import Literal

from pydantic import BaseModel

from app.core.config import settings
from app.schemas.analysis import (
    AnalysisResult,
    BrandConsistencyOnlyResult,
    CrisisGeneratorResult,
    MemeSimulatorResult,
    RedTeamResult,
    RiskScoreResult,
    validate_analysis_result,
)
from app.services.ai.exceptions import AIConfigurationError, AIResponseError
from app.services.ai.mock_data import mock_analysis_result
from app.services.ai.prompts import (
    BRAND_PROMPT,
    CRISIS_PROMPT,
    MEME_PROMPT,
    RED_TEAM_PROMPT,
    RISK_PROMPT,
    USER_PROMPT_TEMPLATE,
)
from app.services.ai.providers.gemini import generate_with_gemini, generate_with_gemini_structured
from app.services.ai.providers.openai import generate_with_openai

logger = logging.getLogger(__name__)

ProviderName = Literal["gemini", "openai"]

ALL_GEMINI_FEATURES = frozenset({"red_team", "meme", "risk", "crisis", "brand"})


def _resolve_provider() -> ProviderName:
    provider = settings.ai_provider.strip().lower()
    if provider not in ("gemini", "openai"):
        raise AIConfigurationError(
            f"Unsupported AI_PROVIDER: {settings.ai_provider}",
            user_message=f"Unsupported AI provider '{settings.ai_provider}'. Use 'gemini' or 'openai'.",
        )
    return provider  # type: ignore[return-value]


def _api_key_for(provider: ProviderName) -> str:
    if provider == "gemini":
        return settings.gemini_api_key.strip()
    return settings.openai_api_key.strip()


def _campaign_context(
    campaign_draft: str,
    brand_values: str,
    brand_mission: str,
    previous_messaging: str,
) -> dict[str, str]:
    return {
        "campaign_draft": campaign_draft,
        "brand_values": brand_values,
        "brand_mission": brand_mission,
        "previous_messaging": previous_messaging,
    }


def _run_gemini_feature[T: BaseModel](
    feature: str,
    prompt_template: str,
    schema: type[T],
    context: dict[str, str],
) -> T | None:
    prompt = prompt_template.format(**context)
    try:
        logger.info("Calling Gemini for feature: %s", feature)
        return generate_with_gemini_structured(prompt, schema)
    except AIResponseError as exc:
        logger.warning("Gemini feature %s failed, using demo slice: %s", feature, exc)
        return None


def _merge_hybrid_gemini(
    base: AnalysisResult,
    context: dict[str, str],
    features: frozenset[str],
) -> AnalysisResult:
    updates: dict = {}

    if "red_team" in features:
        partial = _run_gemini_feature("red_team", RED_TEAM_PROMPT, RedTeamResult, context)
        if partial:
            updates["red_team"] = partial.red_team

    if "meme" in features:
        partial = _run_gemini_feature("meme", MEME_PROMPT, MemeSimulatorResult, context)
        if partial:
            updates["meme_concepts"] = partial.meme_concepts

    if "risk" in features:
        partial = _run_gemini_feature("risk", RISK_PROMPT, RiskScoreResult, context)
        if partial:
            updates["backlash_risk_score"] = partial.backlash_risk_score
            updates["risk_breakdown"] = partial.risk_breakdown

    if "crisis" in features:
        partial = _run_gemini_feature("crisis", CRISIS_PROMPT, CrisisGeneratorResult, context)
        if partial:
            updates["future_crisis"] = partial.future_crisis

    if "brand" in features:
        partial = _run_gemini_feature("brand", BRAND_PROMPT, BrandConsistencyOnlyResult, context)
        if partial:
            updates["brand_consistency"] = partial.brand_consistency

    if updates:
        return base.model_copy(update=updates)
    return base


def generate_analysis(
    campaign_draft: str,
    brand_values: str,
    brand_mission: str,
    previous_messaging: str,
) -> AnalysisResult:
    base = validate_analysis_result(mock_analysis_result())
    context = _campaign_context(
        campaign_draft, brand_values, brand_mission, previous_messaging
    )

    if settings.ai_mock_mode:
        logger.info("AI_MOCK_MODE=true — all sections use demo data")
        return base

    provider = _resolve_provider()
    api_key = _api_key_for(provider)
    features = settings.gemini_feature_set

    if not api_key:
        env_name = "GEMINI_API_KEY" if provider == "gemini" else "OPENAI_API_KEY"
        logger.warning("No %s — all sections use demo data", env_name)
        return base

    if not features:
        logger.warning("AI_GEMINI_FEATURES is empty — all sections use demo data")
        return base

    if provider == "openai":
        user_prompt = USER_PROMPT_TEMPLATE.format(**context)
        try:
            return generate_with_openai(user_prompt)
        except AIResponseError as exc:
            logger.warning("OpenAI failed, using demo data: %s", exc)
            return base

    # Gemini: only requested features call the API; others stay on demo base
    live_features = features & ALL_GEMINI_FEATURES
    demo_features = ALL_GEMINI_FEATURES - live_features
    if demo_features:
        logger.info("Demo data for: %s", ", ".join(sorted(demo_features)))

    merged = _merge_hybrid_gemini(base, context, live_features)
    return validate_analysis_result(merged)
