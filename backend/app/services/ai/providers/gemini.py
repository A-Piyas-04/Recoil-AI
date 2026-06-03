import logging
from typing import TypeVar

from google import genai
from google.genai import types
from pydantic import BaseModel

from app.core.config import settings
from app.schemas.analysis import AnalysisResult
from app.services.ai.exceptions import (
    AIAuthenticationError,
    AIConfigurationError,
    AIEmptyResponseError,
    AINetworkError,
    AIResponseError,
)
from app.services.ai.parser import parse_analysis_result, parse_model
from app.services.ai.prompts import SYSTEM_INSTRUCTION

logger = logging.getLogger(__name__)

_AUTH_HINTS = ("api key", "api_key", "permission", "unauthorized", "401", "403")
_NETWORK_HINTS = ("timeout", "timed out", "connection", "network", "unavailable", "503", "502")
_RATE_LIMIT_HINTS = (
    "rate limit",
    "rate_limit",
    "quota",
    "resource exhausted",
    "resource_exhausted",
    "too many requests",
    "limit exceeded",
    "429",
    "overloaded",
    "capacity",
)
_MODEL_UNAVAILABLE_HINTS = ("not found", "404", "does not exist", "unsupported model")

T = TypeVar("T", bound=BaseModel)

RETRIES_PER_MODEL = 2


def _models_chain() -> list[str]:
    return settings.gemini_models_chain


def _classify_gemini_error(exc: Exception) -> Exception:
    message = str(exc).lower()
    if any(hint in message for hint in _AUTH_HINTS):
        return AIAuthenticationError(
            str(exc),
            user_message="Invalid Gemini API key. Check GEMINI_API_KEY in your environment.",
        )
    if any(hint in message for hint in _RATE_LIMIT_HINTS):
        return AINetworkError(
            str(exc),
            user_message="Gemini rate limit reached. Retrying with a fallback model…",
        )
    if any(hint in message for hint in _NETWORK_HINTS):
        return AINetworkError(
            str(exc),
            user_message="Could not reach Gemini. Check your network and try again.",
        )
    return AIResponseError(
        str(exc),
        user_message="Gemini returned an unexpected error. Please try again.",
    )


def _should_try_next_model(exc: Exception, classified: Exception) -> bool:
    if isinstance(classified, AIAuthenticationError):
        return False
    if isinstance(classified, AINetworkError):
        return True
    message = str(exc).lower()
    return any(
        hint in message
        for hint in (*_RATE_LIMIT_HINTS, *_MODEL_UNAVAILABLE_HINTS, *_NETWORK_HINTS)
    )


def _generate_once[T: BaseModel](
    client: genai.Client,
    model_id: str,
    user_prompt: str,
    schema: type[T],
) -> T:
    response = client.models.generate_content(
        model=model_id,
        contents=user_prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
            response_schema=schema,
        ),
    )
    text = response.text
    if not text:
        raise AIEmptyResponseError(
            "Empty response from Gemini",
            user_message="Gemini returned no content. Please try again.",
        )
    return parse_model(text, schema)


def generate_with_gemini_structured(user_prompt: str, schema: type[T]) -> T:
    client = genai.Client(api_key=settings.gemini_api_key)
    models = _models_chain()
    if not models:
        raise AIConfigurationError(
            "No Gemini models configured",
            user_message="No Gemini models configured. Set GEMINI_MODEL in your environment.",
        )

    last_error: Exception | None = None

    for model_index, model_id in enumerate(models):
        if model_index > 0:
            logger.info("Trying fallback Gemini model: %s", model_id)

        for attempt in range(RETRIES_PER_MODEL):
            try:
                result = _generate_once(client, model_id, user_prompt, schema)
                if model_index > 0:
                    logger.info("Fallback model succeeded: %s", model_id)
                return result
            except (AIEmptyResponseError, AIResponseError):
                raise
            except Exception as exc:
                classified = _classify_gemini_error(exc)
                last_error = classified
                logger.warning(
                    "Gemini model=%s attempt=%s failed: %s",
                    model_id,
                    attempt + 1,
                    exc,
                )
                if isinstance(classified, AIAuthenticationError):
                    raise classified
                if _should_try_next_model(exc, classified):
                    break
                if attempt == RETRIES_PER_MODEL - 1:
                    break

        if model_index < len(models) - 1:
            logger.warning(
                "Switching Gemini model %s → %s",
                model_id,
                models[model_index + 1],
            )

    assert last_error is not None
    raise last_error


def generate_with_gemini(user_prompt: str) -> AnalysisResult:
    return generate_with_gemini_structured(user_prompt, AnalysisResult)
