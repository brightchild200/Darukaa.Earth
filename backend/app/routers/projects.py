from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.services import ProjectService
from app.schemas.schemas import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectListResponse,
    ProjectAnalyticsResponse,
)

router = APIRouter(prefix="/projects", tags=["projects"])


def get_project_service(db: AsyncSession = Depends(get_db)) -> ProjectService:
    return ProjectService(db)


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    owner_id: UUID,  # TODO: Get from auth
    service: ProjectService = Depends(get_project_service),
):
    project = await service.create_project(project_data, owner_id)
    return project


@router.get("", response_model=List[ProjectListResponse])
async def list_projects(
    owner_id: UUID,  # TODO: Get from auth
    skip: int = 0,
    limit: int = 100,
    service: ProjectService = Depends(get_project_service),
):
    projects = await service.list_projects(owner_id, skip, limit)
    
    # Convert to list response with computed fields
    result = []
    for p in projects:
        result.append(ProjectListResponse(
            id=p.id,
            name=p.name,
            project_type=p.project_type,
            status=p.status,
            location=p.description,  # Using description as location for now
            area=sum(s.area_ha or 0 for s in p.sites),
            site_count=len(p.sites),
            total_carbon=sum(s.metrics[-1].carbon_tco2e if s.metrics else 0 for s in p.sites),
            created_at=p.created_at,
        ))
    return result


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: UUID,
    owner_id: UUID,  # TODO: Get from auth
    service: ProjectService = Depends(get_project_service),
):
    project = await service.get_project(project_id, owner_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.get("/{project_id}/detail", response_model=ProjectResponse)
async def get_project_detail(
    project_id: UUID,
    owner_id: UUID,  # TODO: Get from auth
    service: ProjectService = Depends(get_project_service),
):
    project = await service.get_project_with_sites(project_id, owner_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    update_data: ProjectUpdate,
    owner_id: UUID,  # TODO: Get from auth
    service: ProjectService = Depends(get_project_service),
):
    project = await service.update_project(project_id, owner_id, update_data)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: UUID,
    owner_id: UUID,  # TODO: Get from auth
    service: ProjectService = Depends(get_project_service),
):
    deleted = await service.delete_project(project_id, owner_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Project not found")


@router.get("/{project_id}/analytics", response_model=ProjectAnalyticsResponse)
async def get_project_analytics(
    project_id: UUID,
    owner_id: UUID,  # TODO: Get from auth
    service: ProjectService = Depends(get_project_service),
):
    analytics = await service.get_project_analytics(project_id, owner_id)
    if not analytics:
        raise HTTPException(status_code=404, detail="Project not found")
    return analytics