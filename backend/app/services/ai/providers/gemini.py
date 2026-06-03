import logging
from typing import TypeVar

from google import genai
from google.genai import types
from pydantic import BaseModel

from app.core.config import settings
from app.schemas.analysis import AnalysisResult
from app.services.ai.exceptions import (
    AIAuthenticationError,
    AIEmptyResponseError,
    AINetworkError,
    AIResponseError,
)
from app.services.ai.parser import parse_analysis_result, parse_model
from app.services.ai.prompts import SYSTEM_INSTRUCTION

logger = logging.getLogger(__name__)

_AUTH_HINTS = ("api key", "api_key", "permission", "unauthorized", "401", "403")
_NETWORK_HINTS = ("timeout", "timed out", "connection", "network", "unavailable", "503", "502")

T = TypeVar("T", bound=BaseModel)


def _classify_gemini_error(exc: Exception) -> Exception:
    message = str(exc).lower()
    if any(hint in message for hint in _AUTH_HINTS):
        return AIAuthenticationError(
            str(exc),
            user_message="Invalid Gemini API key. Check GEMINI_API_KEY in your environment.",
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


def generate_with_gemini_structured(user_prompt: str, schema: type[T]) -> T:
    client = genai.Client(api_key=settings.gemini_api_key)
    last_error: Exception | None = None

    for attempt in range(2):
        try:
            response = client.models.generate_content(
                model=settings.gemini_model,
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
        except (AIEmptyResponseError, AIResponseError):
            raise
        except Exception as exc:
            last_error = _classify_gemini_error(exc)
            logger.warning("Gemini attempt %s failed: %s", attempt + 1, exc)

    assert last_error is not None
    raise last_error


def generate_with_gemini(user_prompt: str) -> AnalysisResult:
    return generate_with_gemini_structured(user_prompt, AnalysisResult)
