from uuid import UUID
from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.services import SiteMetricsService
from app.schemas.schemas import (
    SiteMetricsCreate,
    SiteMetricsResponse,
    SiteMetricsListResponse,
)

router = APIRouter(prefix="/sites/{site_id}/metrics", tags=["metrics"])


def get_metrics_service(db: AsyncSession = Depends(get_db)) -> SiteMetricsService:
    return SiteMetricsService(db)


@router.post("", response_model=SiteMetricsResponse, status_code=status.HTTP_201_CREATED)
async def create_metrics(
    site_id: UUID,
    metrics_data: SiteMetricsCreate,
    service: SiteMetricsService = Depends(get_metrics_service),
):
    metrics = await service.create_metrics(site_id, metrics_data)
    return metrics


@router.get("", response_model=SiteMetricsListResponse)
async def get_site_metrics(
    site_id: UUID,
    start_date: datetime | None = Query(None),
    end_date: datetime | None = Query(None),
    service: SiteMetricsService = Depends(get_metrics_service),
):
    metrics = await service.get_site_metrics(site_id, start_date, end_date)
    return SiteMetricsListResponse(site_id=site_id, metrics=metrics)


@router.patch("/{metric_date}", response_model=SiteMetricsResponse)
async def upsert_metrics(
    site_id: UUID,
    metric_date: datetime,
    metrics_data: SiteMetricsCreate,
    service: SiteMetricsService = Depends(get_metrics_service),
):
    metrics_data.metric_date = metric_date
    metrics = await service.upsert_metrics(site_id, metrics_data)
    return metrics