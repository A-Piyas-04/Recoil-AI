from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Recoil AI API"
    api_v1_prefix: str = "/api/v1"

    environment: str = "development"
    debug: bool = True
    secret_key: str = "change-me"

    database_url: str = "postgresql+psycopg://app:password@localhost:5432/app_db"

    backend_host: str = "0.0.0.0"
    backend_port: int = 8000

    cors_origins: str = "http://localhost:5173"

    ai_provider: str = "gemini"
    ai_mock_mode: bool = False
    # Comma-separated features to run through Gemini when AI_MOCK_MODE=false and key is set.
    # Options: red_team, meme, risk, crisis, brand
    ai_gemini_features: str = "red_team,meme,risk,crisis"

    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"
    # Deprecated: ignored. Use AI_MOCK_MODE instead.
    gemini_mock_mode: bool = False

    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"

    @property
    def gemini_feature_set(self) -> frozenset[str]:
        allowed = {"red_team", "meme", "risk", "crisis", "brand"}
        parsed = {
            part.strip().lower()
            for part in self.ai_gemini_features.split(",")
            if part.strip()
        }
        return frozenset(parsed & allowed)

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
