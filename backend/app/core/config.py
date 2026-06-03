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

    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"
    gemini_mock_mode: bool = False

    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"

    @property
    def effective_mock_mode(self) -> bool:
        return self.ai_mock_mode or self.gemini_mock_mode

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
