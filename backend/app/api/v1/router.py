from fastapi import APIRouter

from app.api.v1.endpoints import analyses, brand_profiles, health

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(brand_profiles.router, tags=["brand-profiles"])
api_router.include_router(analyses.router, tags=["analyses"])
