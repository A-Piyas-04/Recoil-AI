import pytest

from app.services.ai.providers import gemini as gemini_module
from app.schemas.analysis import RedTeamResult


def test_gemini_models_chain_dedupes(monkeypatch):
    monkeypatch.setenv("GEMINI_MODEL", "gemini-2.5-flash")
    monkeypatch.setenv(
        "GEMINI_FALLBACK_MODELS",
        "gemini-2.0-flash,gemini-2.5-flash,gemini-1.5-flash",
    )
    from app.core.config import get_settings

    get_settings.cache_clear()
    assert get_settings().gemini_models_chain == [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
    ]


def test_fallback_to_second_model_on_rate_limit(monkeypatch):
    calls: list[str] = []

    def fake_generate_once(client, model_id, user_prompt, schema):
        calls.append(model_id)
        if model_id == "gemini-2.5-flash":
            raise Exception("429 RESOURCE_EXHAUSTED: quota exceeded")
        return RedTeamResult.model_validate(
            {
                "red_team": [
                    {
                        "persona": "activist",
                        "headline": "Test",
                        "attacks": ["a", "b"],
                    },
                    {
                        "persona": "journalist",
                        "headline": "Test",
                        "attacks": ["a", "b"],
                    },
                    {
                        "persona": "competitor",
                        "headline": "Test",
                        "attacks": ["a", "b"],
                    },
                    {
                        "persona": "meme_creator",
                        "headline": "Test",
                        "attacks": ["a", "b"],
                    },
                ]
            }
        )

    monkeypatch.setattr(gemini_module, "_generate_once", fake_generate_once)
    monkeypatch.setattr(
        gemini_module,
        "_models_chain",
        lambda: ["gemini-2.5-flash", "gemini-2.0-flash"],
    )
    monkeypatch.setattr(gemini_module.settings, "gemini_api_key", "test-key")
    monkeypatch.setattr(
        gemini_module.genai,
        "Client",
        lambda api_key: object(),
    )

    result = gemini_module.generate_with_gemini_structured("prompt", RedTeamResult)
    assert calls == ["gemini-2.5-flash", "gemini-2.0-flash"]
    assert len(result.red_team) == 4


def test_auth_error_does_not_try_fallback(monkeypatch):
    calls: list[str] = []

    def fake_generate_once(client, model_id, user_prompt, schema):
        calls.append(model_id)
        raise Exception("401 API key not valid")

    monkeypatch.setattr(gemini_module, "_generate_once", fake_generate_once)
    monkeypatch.setattr(
        gemini_module,
        "_models_chain",
        lambda: ["gemini-2.5-flash", "gemini-2.0-flash"],
    )
    monkeypatch.setattr(gemini_module.settings, "gemini_api_key", "bad-key")
    monkeypatch.setattr(
        gemini_module.genai,
        "Client",
        lambda api_key: object(),
    )

    from app.services.ai.exceptions import AIAuthenticationError

    with pytest.raises(AIAuthenticationError):
        gemini_module.generate_with_gemini_structured("prompt", RedTeamResult)
    assert calls == ["gemini-2.5-flash"]
