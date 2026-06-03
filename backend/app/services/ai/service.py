import logging
from typing import Literal

from pydantic import BaseModel

from app.core.config import get_settings
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


def _settings():
    return get_settings()


def ai_source_label() -> str:
    s = _settings()
    if s.ai_mock_mode:
        return "mock"
    return s.ai_provider.strip().lower()


def _resolve_provider() -> ProviderName:
    s = _settings()
    provider = s.ai_provider.strip().lower()
    if provider not in ("gemini", "openai"):
        raise AIConfigurationError(
            f"Unsupported AI_PROVIDER: {s.ai_provider}",
            user_message=f"Unsupported AI provider '{s.ai_provider}'. Use 'gemini' or 'openai'.",
        )
    return provider  # type: ignore[return-value]


def _api_key_for(provider: ProviderName) -> str:
    s = _settings()
    if provider == "gemini":
        return s.gemini_api_key.strip()
    return s.openai_api_key.strip()


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
) -> T:
    prompt = prompt_template.format(**context)
    logger.info("Calling Gemini for feature: %s", feature)
    return generate_with_gemini_structured(prompt, schema)


def _merge_hybrid_gemini(
    base: AnalysisResult,
    context: dict[str, str],
    features: frozenset[str],
) -> AnalysisResult:
    updates: dict = {}

    if "red_team" in features:
        partial = _run_gemini_feature("red_team", RED_TEAM_PROMPT, RedTeamResult, context)
        updates["red_team"] = partial.red_team

    if "meme" in features:
        partial = _run_gemini_feature("meme", MEME_PROMPT, MemeSimulatorResult, context)
        updates["meme_concepts"] = partial.meme_concepts

    if "risk" in features:
        partial = _run_gemini_feature("risk", RISK_PROMPT, RiskScoreResult, context)
        updates["backlash_risk_score"] = partial.backlash_risk_score
        updates["risk_breakdown"] = partial.risk_breakdown

    if "crisis" in features:
        partial = _run_gemini_feature("crisis", CRISIS_PROMPT, CrisisGeneratorResult, context)
        updates["future_crisis"] = partial.future_crisis

    if "brand" in features:
        partial = _run_gemini_feature("brand", BRAND_PROMPT, BrandConsistencyOnlyResult, context)
        updates["brand_consistency"] = partial.brand_consistency

    if not updates:
        raise AIResponseError(
            "No Gemini features produced output",
            user_message="AI analysis failed. Check GEMINI_API_KEY and try again.",
        )

    return base.model_copy(update=updates)


def generate_analysis(
    campaign_draft: str,
    brand_values: str,
    brand_mission: str,
    previous_messaging: str,
) -> AnalysisResult:
    context = _campaign_context(
        campaign_draft, brand_values, brand_mission, previous_messaging
    )

    if _settings().ai_mock_mode:
        logger.info("AI_MOCK_MODE=true — returning demo data")
        return validate_analysis_result(mock_analysis_result())

    s = _settings()
    provider = _resolve_provider()
    api_key = _api_key_for(provider)

    if not api_key:
        env_name = "GEMINI_API_KEY" if provider == "gemini" else "OPENAI_API_KEY"
        raise AIConfigurationError(
            f"Missing {env_name}",
            user_message=f"Set {env_name} in .env and set AI_MOCK_MODE=false for live analysis.",
        )

    user_prompt = USER_PROMPT_TEMPLATE.format(**context)

    if provider == "openai":
        logger.info("Running full OpenAI analysis")
        return generate_with_openai(user_prompt)

    features = s.gemini_feature_set or ALL_GEMINI_FEATURES
    live_features = features & ALL_GEMINI_FEATURES

    if live_features == ALL_GEMINI_FEATURES:
        logger.info("Running full Gemini analysis (model chain: %s)", s.gemini_models_chain)
        return generate_with_gemini(user_prompt)

    demo_features = ALL_GEMINI_FEATURES - live_features
    logger.info("Gemini features: %s; demo fallback for: %s", ", ".join(sorted(live_features)), ", ".join(sorted(demo_features)))
    base = validate_analysis_result(mock_analysis_result())
    merged = _merge_hybrid_gemini(base, context, live_features)
    return validate_analysis_result(merged)
