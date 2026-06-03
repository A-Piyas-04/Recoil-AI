import logging
from typing import Literal

from app.core.config import settings
from app.schemas.analysis import AnalysisResult, validate_analysis_result
from app.services.ai.exceptions import AIConfigurationError, AIResponseError
from app.services.ai.mock_data import mock_analysis_result
from app.services.ai.prompts import USER_PROMPT_TEMPLATE
from app.services.ai.providers.gemini import generate_with_gemini
from app.services.ai.providers.openai import generate_with_openai

logger = logging.getLogger(__name__)

ProviderName = Literal["gemini", "openai"]


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


def generate_analysis(
    campaign_draft: str,
    brand_values: str,
    brand_mission: str,
    previous_messaging: str,
) -> AnalysisResult:
    if settings.effective_mock_mode:
        logger.info("AI_MOCK_MODE enabled — returning demo analysis")
        return validate_analysis_result(mock_analysis_result())

    provider = _resolve_provider()
    api_key = _api_key_for(provider)

    if not api_key:
        env_name = "GEMINI_API_KEY" if provider == "gemini" else "OPENAI_API_KEY"
        logger.warning("No %s; falling back to demo analysis", env_name)
        return validate_analysis_result(mock_analysis_result())

    user_prompt = USER_PROMPT_TEMPLATE.format(
        campaign_draft=campaign_draft,
        brand_values=brand_values,
        brand_mission=brand_mission,
        previous_messaging=previous_messaging,
    )

    try:
        if provider == "gemini":
            return generate_with_gemini(user_prompt)
        return generate_with_openai(user_prompt)
    except AIResponseError as exc:
        logger.warning("Invalid AI response; falling back to demo analysis: %s", exc)
        return validate_analysis_result(mock_analysis_result())
