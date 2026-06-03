import logging

from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine

from app import models  # noqa: F401
from app.core.database import Base

logger = logging.getLogger(__name__)


def _ensure_ai_source_column(engine: Engine) -> None:
    inspector = inspect(engine)
    if "analyses" not in inspector.get_table_names():
        return
    columns = {col["name"] for col in inspector.get_columns("analyses")}
    if "ai_source" in columns:
        return
    with engine.begin() as conn:
        conn.execute(
            text("ALTER TABLE analyses ADD COLUMN ai_source VARCHAR(16) NOT NULL DEFAULT 'mock'")
        )
    logger.info("Added analyses.ai_source column")


def ensure_schema(engine: Engine) -> None:
    """Create tables from models (used for SQLite local dev)."""
    Base.metadata.create_all(bind=engine)
    _ensure_ai_source_column(engine)
    tables = inspect(engine).get_table_names()
    logger.info("Database schema ready (%s tables)", len(tables))
