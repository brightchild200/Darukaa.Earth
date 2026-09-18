from uuid import UUID
from typing import Optional, List
from datetime import datetime

from sqlalchemy import select, func, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.models import Project, Site, SiteMetrics


class ProjectRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, project: Project) -> Project:
        self.db.add(project)
        await self.db.commit()
        await self.db.refresh(project)
        return project

    async def get_by_id(self, project_id: UUID, owner_id: UUID) -> Optional[Project]:
        result = await self.db.execute(
            select(Project)
            .where(Project.id == project_id, Project.owner_id == owner_id)
            .options(selectinload(Project.sites))
        )
        return result.scalar_one_or_none()

    async def get_all(self, owner_id: UUID, skip: int = 0, limit: int = 100) -> List[Project]:
        result = await self.db.execute(
            select(Project)
            .where(Project.owner_id == owner_id)
            .order_by(Project.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def update(self, project: Project) -> Project:
        await self.db.commit()
        await self.db.refresh(project)
        return project

    async def delete(self, project_id: UUID, owner_id: UUID) -> bool:
        result = await self.db.execute(
            delete(Project).where(Project.id == project_id, Project.owner_id == owner_id)
        )
        await self.db.commit()
        return result.rowcount > 0

    async def get_with_sites_and_metrics(self, project_id: UUID, owner_id: UUID) -> Optional[Project]:
        result = await self.db.execute(
            select(Project)
            .where(Project.id == project_id, Project.owner_id == owner_id)
            .options(
                selectinload(Project.sites).selectinload(Site.metrics)
            )
        )
        return result.scalar_one_or_none()


class SiteRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, site: Site) -> Site:
        self.db.add(site)
        await self.db.commit()
        await self.db.refresh(site)
        return site

    async def get_by_id(self, site_id: UUID, project_id: UUID) -> Optional[Site]:
        result = await self.db.execute(
            select(Site)
            .where(Site.id == site_id, Site.project_id == project_id)
            .options(selectinload(Site.metrics))
        )
        return result.scalar_one_or_none()

    async def get_by_project(self, project_id: UUID) -> List[Site]:
        result = await self.db.execute(
            select(Site)
            .where(Site.project_id == project_id)
            .order_by(Site.created_at.desc())
        )
        return list(result.scalars().all())

    async def update(self, site: Site) -> Site:
        await self.db.commit()
        await self.db.refresh(site)
        return site

    async def delete(self, site_id: UUID, project_id: UUID) -> bool:
        result = await self.db.execute(
            delete(Site).where(Site.id == site_id, Site.project_id == project_id)
        )
        await self.db.commit()
        return result.rowcount > 0


class SiteMetricsRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, metrics: SiteMetrics) -> SiteMetrics:
        self.db.add(metrics)
        await self.db.commit()
        await self.db.refresh(metrics)
        return metrics

    async def get_by_site(self, site_id: UUID, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> List[SiteMetrics]:
        query = select(SiteMetrics).where(SiteMetrics.site_id == site_id)
        if start_date:
            query = query.where(SiteMetrics.metric_date >= start_date)
        if end_date:
            query = query.where(SiteMetrics.metric_date <= end_date)
        query = query.order_by(SiteMetrics.metric_date.asc())
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_latest(self, site_id: UUID) -> Optional[SiteMetrics]:
        result = await self.db.execute(
            select(SiteMetrics)
            .where(SiteMetrics.site_id == site_id)
            .order_by(SiteMetrics.metric_date.desc())
            .limit(1)
        )
        return result.scalar_one_or_none()

    async def upsert(self, metrics: SiteMetrics) -> SiteMetrics:
        # Check if exists
        result = await self.db.execute(
            select(SiteMetrics).where(
                SiteMetrics.site_id == metrics.site_id,
                SiteMetrics.metric_date == metrics.metric_date
            )
        )
        existing = result.scalar_one_or_none()
        if existing:
            existing.carbon_tco2e = metrics.carbon_tco2e
            existing.biodiversity_index = metrics.biodiversity_index
            existing.ndvi = metrics.ndvi
            existing.projected_credit_usd = metrics.projected_credit_usd
            await self.db.commit()
            await self.db.refresh(existing)
            return existing
        else:
            self.db.add(metrics)
            await self.db.commit()
            await self.db.refresh(metrics)
            return metrics