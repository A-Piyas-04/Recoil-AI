import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path

from alembic import command
from alembic.config import Config
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.db_init import ensure_schema
from app.core.database import engine

logger = logging.getLogger(__name__)


def run_migrations() -> None:
    alembic_ini = Path(__file__).resolve().parents[1] / "alembic.ini"
    if not alembic_ini.exists():
        alembic_ini = Path(__file__).resolve().parents[2] / "alembic.ini"
    cfg = Config(str(alembic_ini))
    cfg.set_main_option("sqlalchemy.url", settings.database_url)
    command.upgrade(cfg, "head")


def init_database() -> None:
    if settings.database_url.startswith("sqlite"):
        ensure_schema(engine)
        return
    try:
        run_migrations()
    except Exception as exc:
        logger.warning("Alembic migration failed: %s", exc)
        raise


def reload_settings() -> None:
    """Refresh cached settings; repo .env wins over stale shell env vars."""
    from dotenv import dotenv_values

    from app.core.config import get_settings
    import app.core.config as config_module
    from app.services.ai import service as ai_service

    root_env = Path(__file__).resolve().parents[2] / ".env"
    if root_env.exists():
        for key, value in dotenv_values(root_env).items():
            if value is not None:
                os.environ[key] = value

    get_settings.cache_clear()
    config_module.settings = get_settings()
    ai_service.settings = config_module.settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    reload_settings()
    if os.getenv("PYTEST_CURRENT_TEST") is None:
        try:
            init_database()
        except Exception as exc:
            logger.error("Database initialization failed: %s", exc)
    yield
    engine.dispose()


app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(SQLAlchemyError)
async def database_exception_handler(_request: Request, exc: SQLAlchemyError):
    logger.exception("Database error: %s", exc)
    return JSONResponse(
        status_code=503,
        content={
            "detail": (
                "Database is unavailable. For local dev without Docker, set "
                "DATABASE_URL=sqlite:///./recoil.db in .env and restart the backend."
            )
        },
    )


app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/health")
def health_check():
    from app.core.config import get_settings
    from app.services.ai import ai_source_label

    current = get_settings()
    return {
        "status": "ok",
        "ai_mode": ai_source_label(),
        "ai_mock_mode": current.ai_mock_mode,
    }
