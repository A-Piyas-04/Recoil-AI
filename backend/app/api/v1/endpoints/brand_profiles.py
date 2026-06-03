from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.brand_profile import BrandProfile
from app.schemas.brand_profile import BrandProfileCreate, BrandProfileRead, BrandProfileUpdate

router = APIRouter(prefix="/brand-profiles")


@router.post("/", response_model=BrandProfileRead, status_code=201)
def create_brand_profile(payload: BrandProfileCreate, db: Session = Depends(get_db)):
    profile = BrandProfile(**payload.model_dump())
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/", response_model=list[BrandProfileRead])
def list_brand_profiles(db: Session = Depends(get_db)):
    stmt = select(BrandProfile).order_by(BrandProfile.created_at.desc())
    return list(db.scalars(stmt).all())


@router.get("/{profile_id}", response_model=BrandProfileRead)
def get_brand_profile(profile_id: UUID, db: Session = Depends(get_db)):
    profile = db.get(BrandProfile, profile_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Brand profile not found")
    return profile


@router.put("/{profile_id}", response_model=BrandProfileRead)
def update_brand_profile(
    profile_id: UUID, payload: BrandProfileUpdate, db: Session = Depends(get_db)
):
    profile = db.get(BrandProfile, profile_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Brand profile not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile
