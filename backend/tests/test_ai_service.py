import pytest

from app.services.ai.exceptions import AIConfigurationError
from app.services.ai.service import _resolve_provider, generate_analysis


def test_mock_mode_returns_valid_result(monkeypatch):
    monkeypatch.setenv("AI_MOCK_MODE", "true")
    from app.core.config import get_settings

    get_settings.cache_clear()
    from app.core import config

    config.settings = get_settings()
    from app.services.ai import service as ai_service

    ai_service.settings = config.settings

    result = generate_analysis(
        campaign_draft="x" * 50,
        brand_values="Transparency",
        brand_mission="Help people",
        previous_messaging="Honest ads",
    )
    assert len(result.red_team) == 4
    assert len(result.meme_concepts) == 3


def test_invalid_provider_raises(monkeypatch):
    monkeypatch.setenv("AI_MOCK_MODE", "false")
    monkeypatch.setenv("AI_PROVIDER", "invalid")
    from app.core.config import get_settings

    get_settings.cache_clear()
    from app.core import config

    config.settings = get_settings()

    from app.services.ai import service as ai_service

    ai_service.settings = get_settings()
    with pytest.raises(AIConfigurationError):
        ai_service._resolve_provider()


def test_gemini_feature_set_parsing(monkeypatch):
    monkeypatch.setenv("AI_GEMINI_FEATURES", "red_team, meme, brand, invalid")
    from app.core.config import get_settings

    get_settings.cache_clear()
    assert get_settings().gemini_feature_set == frozenset({"red_team", "meme", "brand"})


def test_no_api_key_uses_demo_slices(monkeypatch):
    monkeypatch.setenv("AI_MOCK_MODE", "false")
    monkeypatch.setenv("GEMINI_API_KEY", "")
    monkeypatch.setenv("AI_GEMINI_FEATURES", "red_team,meme")
    from app.core.config import get_settings

    get_settings.cache_clear()
    from app.core import config
    from app.services.ai import service as ai_service

    config.settings = get_settings()
    ai_service.settings = config.settings

    result = generate_analysis(
        campaign_draft="x" * 50,
        brand_values="Transparency",
        brand_mission="Help people",
        previous_messaging="Honest ads",
    )
    assert result.future_crisis.headline.startswith("Recoil AI Mock")
