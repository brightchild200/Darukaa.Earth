from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.services import SiteService
from app.schemas.schemas import (
    SiteCreate,
    SiteUpdate,
    SiteResponse,
    SiteListResponse,
    SiteAnalyticsResponse,
)

router = APIRouter(prefix="/projects/{project_id}/sites", tags=["sites"])


def get_site_service(db: AsyncSession = Depends(get_db)) -> SiteService:
    return SiteService(db)


@router.post("", response_model=SiteResponse, status_code=status.HTTP_201_CREATED)
async def create_site(
    project_id: UUID,
    site_data: SiteCreate,
    service: SiteService = Depends(get_site_service),
):
    site = await service.create_site(site_data, project_id)
    return site


@router.get("", response_model=List[SiteListResponse])
async def list_sites(
    project_id: UUID,
    service: SiteService = Depends(get_site_service),
):
    sites = await service.list_sites(project_id)
    return sites


@router.get("/{site_id}", response_model=SiteResponse)
async def get_site(
    project_id: UUID,
    site_id: UUID,
    service: SiteService = Depends(get_site_service),
):
    site = await service.get_site(site_id, project_id)
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    return site


@router.patch("/{site_id}", response_model=SiteResponse)
async def update_site(
    project_id: UUID,
    site_id: UUID,
    update_data: SiteUpdate,
    service: SiteService = Depends(get_site_service),
):
    site = await service.update_site(site_id, project_id, update_data)
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    return site


@router.delete("/{site_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_site(
    project_id: UUID,
    site_id: UUID,
    service: SiteService = Depends(get_site_service),
):
    deleted = await service.delete_site(site_id, project_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Site not found")


@router.get("/{site_id}/analytics", response_model=SiteAnalyticsResponse)
async def get_site_analytics(
    project_id: UUID,
    site_id: UUID,
    service: SiteService = Depends(get_site_service),
):
    analytics = await service.get_site_analytics(site_id, project_id)
    if not analytics:
        raise HTTPException(status_code=404, detail="Site not found")
    return analytics