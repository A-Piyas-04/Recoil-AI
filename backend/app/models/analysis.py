import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.brand_profile import BrandProfile


class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    brand_profile_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("brand_profiles.id", ondelete="SET NULL"), nullable=True
    )
    campaign_draft: Mapped[str] = mapped_column(Text, nullable=False)
    brand_values: Mapped[str] = mapped_column(Text, nullable=False)
    brand_mission: Mapped[str] = mapped_column(Text, nullable=False)
    previous_messaging: Mapped[str] = mapped_column(Text, nullable=False)
    backlash_risk_score: Mapped[int] = mapped_column(Integer, nullable=False)
    ai_source: Mapped[str] = mapped_column(String(16), nullable=False, server_default="mock")
    result_json: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    brand_profile: Mapped["BrandProfile | None"] = relationship(
        "BrandProfile", back_populates="analyses"
    )
