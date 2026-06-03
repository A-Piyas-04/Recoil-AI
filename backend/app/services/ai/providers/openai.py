import logging

import httpx

from app.core.config import settings
from app.schemas.analysis import AnalysisResult
from app.services.ai.exceptions import (
    AIAuthenticationError,
    AIEmptyResponseError,
    AINetworkError,
    AIResponseError,
)
from app.services.ai.parser import parse_analysis_result
from app.services.ai.prompts import SYSTEM_INSTRUCTION

logger = logging.getLogger(__name__)

OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions"


def _classify_openai_status(status: int, body: str) -> Exception:
    lower = body.lower()
    if status in (401, 403) or "invalid_api_key" in lower or "incorrect api key" in lower:
        return AIAuthenticationError(
            body,
            user_message="Invalid OpenAI API key. Check OPENAI_API_KEY in your environment.",
        )
    if status >= 500 or status == 429:
        return AINetworkError(
            body,
            user_message="OpenAI is temporarily unavailable. Please try again shortly.",
        )
    return AIResponseError(
        body,
        user_message="OpenAI returned an unexpected error. Please try again.",
    )


def generate_with_openai(user_prompt: str) -> AnalysisResult:
    schema = AnalysisResult.model_json_schema()
    payload = {
        "model": settings.openai_model,
        "messages": [
            {"role": "system", "content": SYSTEM_INSTRUCTION},
            {"role": "user", "content": user_prompt},
        ],
        "response_format": {
            "type": "json_schema",
            "json_schema": {
                "name": "analysis_result",
                "strict": True,
                "schema": schema,
            },
        },
    }
    headers = {
        "Authorization": f"Bearer {settings.openai_api_key}",
        "Content-Type": "application/json",
    }
    last_error: Exception | None = None

    for attempt in range(2):
        try:
            with httpx.Client(timeout=120.0) as client:
                response = client.post(OPENAI_CHAT_URL, headers=headers, json=payload)
        except httpx.TimeoutException as exc:
            last_error = AINetworkError(
                str(exc),
                user_message="OpenAI request timed out. Please try again.",
            )
            logger.warning("OpenAI attempt %s timed out", attempt + 1)
            continue
        except httpx.RequestError as exc:
            last_error = AINetworkError(
                str(exc),
                user_message="Could not reach OpenAI. Check your network and try again.",
            )
            logger.warning("OpenAI attempt %s network error: %s", attempt + 1, exc)
            continue

        if response.status_code >= 400:
            last_error = _classify_openai_status(response.status_code, response.text)
            logger.warning("OpenAI attempt %s HTTP %s", attempt + 1, response.status_code)
            continue

        try:
            data = response.json()
            content = data["choices"][0]["message"]["content"]
        except (KeyError, IndexError, TypeError) as exc:
            last_error = AIResponseError(
                str(exc),
                user_message="OpenAI returned an unexpected response format.",
            )
            logger.warning("OpenAI attempt %s parse envelope failed: %s", attempt + 1, exc)
            continue

        if not content:
            raise AIEmptyResponseError(
                "Empty response from OpenAI",
                user_message="OpenAI returned no content. Please try again.",
            )
        return parse_analysis_result(content)

    assert last_error is not None
    raise last_error
