from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class BrandProfileCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    brand_values: str = Field(..., min_length=1)
    brand_mission: str = Field(..., min_length=1)
    previous_messaging: str = Field(..., min_length=1)


class BrandProfileUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=120)
    brand_values: str | None = Field(None, min_length=1)
    brand_mission: str | None = Field(None, min_length=1)
    previous_messaging: str | None = Field(None, min_length=1)


class BrandProfileRead(BaseModel):
    id: UUID
    name: str
    brand_values: str
    brand_mission: str
    previous_messaging: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
