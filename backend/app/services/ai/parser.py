import json
import logging
import re

from pydantic import ValidationError

from app.schemas.analysis import AnalysisResult, validate_analysis_result
from app.services.ai.exceptions import AIEmptyResponseError, AIResponseError

logger = logging.getLogger(__name__)

_JSON_FENCE_RE = re.compile(r"```(?:json)?\s*([\s\S]*?)\s*```", re.IGNORECASE)


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


def parse_analysis_result(raw: str) -> AnalysisResult:
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
        result = AnalysisResult.model_validate(payload)
        return validate_analysis_result(result)
    except (ValidationError, ValueError) as exc:
        logger.warning("Analysis validation failed: %s", exc)
        raise AIResponseError(
            f"Validation failed: {exc}",
            user_message="The AI response was incomplete or invalid. Please try again.",
        ) from exc
