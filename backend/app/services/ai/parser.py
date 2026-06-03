import json
import logging
import re
from typing import TypeVar

from pydantic import BaseModel, ValidationError

from app.schemas.analysis import AnalysisResult, validate_analysis_result
from app.services.ai.exceptions import AIEmptyResponseError, AIResponseError

logger = logging.getLogger(__name__)

_JSON_FENCE_RE = re.compile(r"```(?:json)?\s*([\s\S]*?)\s*```", re.IGNORECASE)

T = TypeVar("T", bound=BaseModel)


def extract_json_text(raw: str) -> str:
    text = raw.strip()
    if not text:
        raise AIEmptyResponseError(
            "Model returned empty text",
            user_message="The AI returned an empty response. Please try again.",
        )
    fence = _JSON_FENCE_RE.search(text)
    if fence:
        text = fence.group(1).strip()
    return text


def parse_model(raw: str, model: type[T]) -> T:
    try:
        text = extract_json_text(raw)
        payload = json.loads(text)
    except AIEmptyResponseError:
        raise
    except json.JSONDecodeError as exc:
        logger.warning("Invalid JSON from model: %s", exc)
        raise AIResponseError(
            f"Invalid JSON: {exc}",
            user_message="The AI returned malformed data. Please run the analysis again.",
        ) from exc

    try:
        return model.model_validate(payload)
    except ValidationError as exc:
        logger.warning("Model validation failed for %s: %s", model.__name__, exc)
        raise AIResponseError(
            f"Validation failed: {exc}",
            user_message="The AI response was incomplete or invalid. Please try again.",
        ) from exc


def parse_analysis_result(raw: str) -> AnalysisResult:
    result = parse_model(raw, AnalysisResult)
    return validate_analysis_result(result)
