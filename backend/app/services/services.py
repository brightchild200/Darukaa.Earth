from uuid import UUID
from typing import Optional, List
from datetime import datetime, timedelta
import json

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from geoalchemy2 import Geometry
from geoalchemy2.shape import to_shape
from geoalchemy2.elements import WKBElement
from shapely.geometry import shape, mapping

from app.models.models import Project, Site, SiteMetrics, ProjectStatus, SiteStatus
from app.repositories.repositories import ProjectRepository, SiteRepository, SiteMetricsRepository
from app.schemas.schemas import ProjectCreate, ProjectUpdate, SiteCreate, SiteUpdate, SiteMetricsCreate


class ProjectService:
    def __init__(self, db: AsyncSession):
        self.repo = ProjectRepository(db)
        self.db = db

    async def create_project(self, project_data: ProjectCreate, owner_id: UUID) -> Project:
        project = Project(
            **project_data.model_dump(),
            owner_id=owner_id,
        )
        return await self.repo.create(project)

    async def get_project(self, project_id: UUID, owner_id: UUID) -> Optional[Project]:
        return await self.repo.get_by_id(project_id, owner_id)

    async def get_project_with_sites(self, project_id: UUID, owner_id: UUID) -> Optional[Project]:
        return await self.repo.get_with_sites_and_metrics(project_id, owner_id)

    async def list_projects(self, owner_id: UUID, skip: int = 0, limit: int = 100) -> List[Project]:
        return await self.repo.get_all(owner_id, skip, limit)

    async def update_project(self, project_id: UUID, owner_id: UUID, update_data: ProjectUpdate) -> Optional[Project]:
        project = await self.repo.get_by_id(project_id, owner_id)
        if not project:
            return None
        for field, value in update_data.model_dump(exclude_unset=True).items():
            setattr(project, field, value)
        return await self.repo.update(project)

    async def delete_project(self, project_id: UUID, owner_id: UUID) -> bool:
        return await self.repo.delete(project_id, owner_id)

    async def get_project_analytics(self, project_id: UUID, owner_id: UUID) -> dict:
        project = await self.get_project_with_sites(project_id, owner_id)
        if not project:
            return None

        total_area = sum(site.area_ha or 0 for site in project.sites)
        total_carbon = sum(site.metrics[-1].carbon_tco2e if site.metrics else 0 for site in project.sites)
        avg_biodiversity = sum(site.metrics[-1].biodiversity_index if site.metrics else 0 for site in project.sites) / len(project.sites) if project.sites else 0
        avg_ndvi = sum(site.metrics[-1].ndvi if site.metrics else 0 for site in project.sites) / len(project.sites) if project.sites else 0
        site_count = len(project.sites)
        active_sites = sum(1 for site in project.sites if site.status == SiteStatus.ACTIVE)

        # Aggregate monthly data
        monthly_agg = {}
        for site in project.sites:
            for m in site.metrics:
                month_key = m.metric_date.strftime("%b")
                if month_key not in monthly_agg:
                    monthly_agg[month_key] = {"carbon_tco2e": 0, "biodiversity_index": 0, "ndvi": 0, "projected_credit_usd": 0, "count": 0}
                monthly_agg[month_key]["carbon_tco2e"] += m.carbon_tco2e or 0
                monthly_agg[month_key]["biodiversity_index"] += m.biodiversity_index or 0
                monthly_agg[month_key]["ndvi"] += m.ndvi or 0
                monthly_agg[month_key]["projected_credit_usd"] += m.projected_credit_usd or 0
                monthly_agg[month_key]["count"] += 1

        monthly_data = []
        for month, data in monthly_agg.items():
            if data["count"] > 0:
                monthly_data.append({
                    "month": month,
                    "carbon_tco2e": data["carbon_tco2e"],
                    "biodiversity_index": round(data["biodiversity_index"] / data["count"], 2),
                    "ndvi": round(data["ndvi"] / data["count"], 2),
                    "projected_credit_usd": data["projected_credit_usd"],
                })

        return {
            "project_id": project.id,
            "project_name": project.name,
            "total_area": total_area,
            "total_carbon": total_carbon,
            "avg_biodiversity": round(avg_biodiversity, 2),
            "avg_ndvi": round(avg_ndvi, 2),
            "site_count": site_count,
            "active_sites": active_sites,
            "monthly_data": monthly_data,
        }


class SiteService:
    def __init__(self, db: AsyncSession):
        self.repo = SiteRepository(db)
        self.metrics_repo = SiteMetricsRepository(db)
        self.db = db

    async def create_site(self, site_data: SiteCreate, project_id: UUID) -> Site:
        # Convert GeoJSON to WKT for PostGIS
        geojson = site_data.geometry
        geometry_wkt = self._geojson_to_wkt(geojson)
        
        # Calculate area using PostGIS
        area_ha = await self._calculate_area_ha(geometry_wkt)
        
        site = Site(
            project_id=project_id,
            name=site_data.name,
            description=site_data.description,
            status=site_data.status,
            geometry=geometry_wkt,
            area_ha=area_ha,
        )
        return await self.repo.create(site)

    async def get_site(self, site_id: UUID, project_id: UUID) -> Optional[Site]:
        return await self.repo.get_by_id(site_id, project_id)

    async def get_site_with_metrics(self, site_id: UUID, project_id: UUID) -> Optional[Site]:
        return await self.repo.get_by_id(site_id, project_id)

    async def list_sites(self, project_id: UUID) -> List[Site]:
        return await self.repo.get_by_project(project_id)

    async def update_site(self, site_id: UUID, project_id: UUID, update_data: SiteUpdate) -> Optional[Site]:
        site = await self.repo.get_by_id(site_id, project_id)
        if not site:
            return None
        
        update_dict = update_data.model_dump(exclude_unset=True)
        if "geometry" in update_dict:
            geojson = update_dict.pop("geometry")
            geometry_wkt = self._geojson_to_wkt(geojson)
            site.geometry = geometry_wkt
            site.area_ha = await self._calculate_area_ha(geometry_wkt)
        
        for field, value in update_dict.items():
            setattr(site, field, value)
        
        return await self.repo.update(site)

    async def delete_site(self, site_id: UUID, project_id: UUID) -> bool:
        return await self.repo.delete(site_id, project_id)

    async def get_site_analytics(self, site_id: UUID, project_id: UUID) -> Optional[dict]:
        site = await self.repo.get_by_id(site_id, project_id)
        if not site:
            return None

        metrics = site.metrics
        if not metrics:
            return None

        latest = max(metrics, key=lambda m: m.metric_date)
        
        monthly_data = []
        for m in sorted(metrics, key=lambda x: x.metric_date):
            monthly_data.append({
                "month": m.metric_date.strftime("%b"),
                "carbon_tco2e": m.carbon_tco2e or 0,
                "biodiversity_index": m.biodiversity_index or 0,
                "ndvi": m.ndvi or 0,
                "projected_credit_usd": m.projected_credit_usd or 0,
            })

        # Calculate trends
        if len(metrics) >= 2:
            sorted_metrics = sorted(metrics, key=lambda x: x.metric_date)
            first = sorted_metrics[0]
            last = sorted_metrics[-1]
            carbon_trend = ((last.carbon_tco2e - first.carbon_tco2e) / first.carbon_tco2e * 100) if first.carbon_tco2e else 0
            bio_trend = ((last.biodiversity_index - first.biodiversity_index) / first.biodiversity_index * 100) if first.biodiversity_index else 0
            ndvi_trend = ((last.ndvi - first.ndvi) / first.ndvi * 100) if first.ndvi else 0
        else:
            carbon_trend = bio_trend = ndvi_trend = 0

        return {
            "site_id": site.id,
            "site_name": site.name,
            "current_metrics": {
                "carbon_tco2e": latest.carbon_tco2e,
                "carbon_trend": round(carbon_trend, 1),
                "biodiversity_index": latest.biodiversity_index,
                "biodiversity_trend": round(bio_trend, 1),
                "ndvi": latest.ndvi,
                "ndvi_trend": round(ndvi_trend, 1),
                "projected_credit_usd": latest.projected_credit_usd,
            },
            "monthly_data": monthly_data,
            "trends": {
                "carbon_trend": round(carbon_trend, 1),
                "biodiversity_trend": round(bio_trend, 1),
                "ndvi_trend": round(ndvi_trend, 1),
            }
        }

    def _geojson_to_wkt(self, geojson: dict) -> str:
        """Convert GeoJSON Polygon to WKT for PostGIS"""
        coords = geojson["coordinates"][0]  # First ring
        coord_str = ", ".join(f"{lng} {lat}" for lat, lng in coords)
        return f"SRID=4326;POLYGON(({coord_str}))"

    async def _calculate_area_ha(self, geometry_wkt: str) -> float:
        """Calculate area in hectares using PostGIS"""
        from sqlalchemy import text
        result = await self.db.execute(
            text(f"SELECT ST_Area(ST_GeomFromText('{geometry_wkt}')::geography) / 10000 as area_ha")
        )
        area = result.scalar()
        return round(float(area), 2) if area else 0.0


class SiteMetricsService:
    def __init__(self, db: AsyncSession):
        self.repo = SiteMetricsRepository(db)

    async def create_metrics(self, site_id: UUID, metrics_data: SiteMetricsCreate) -> SiteMetrics:
        metrics = SiteMetrics(
            site_id=site_id,
            **metrics_data.model_dump(),
        )
        return await self.repo.create(metrics)

    async def get_site_metrics(self, site_id: UUID, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> List[SiteMetrics]:
        return await self.repo.get_by_site(site_id, start_date, end_date)

    async def upsert_metrics(self, site_id: UUID, metrics_data: SiteMetricsCreate) -> SiteMetrics:
        metrics = SiteMetrics(
            site_id=site_id,
            **metrics_data.model_dump(),
        )
        return await self.repo.upsert(metrics)

    async def seed_demo_metrics(self, site_id: UUID, base_carbon: float, base_bio: float, base_ndvi: float, base_usd: float) -> List[SiteMetrics]:
        """Seed 12 months of demo metrics for a site"""
        metrics_list = []
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
        for i, month in enumerate(months):
            growth = 1 + (i / 11) * 0.28
            carbon = round(base_carbon * 0.72 * growth, 2)
            bio = round(base_bio * 0.82 * (1 + (i / 11) * 0.18), 2)
            ndvi = round(min(0.92, base_ndvi * (0.88 + (i / 11) * 0.12)), 2)
            usd = round(base_usd * 0.65 * growth, 2)
            
            metric_date = datetime(2026, i + 1, 1)
            
            metrics = await self.upsert_metrics(site_id, SiteMetricsCreate(
                metric_date=metric_date,
                carbon_tco2e=carbon,
                biodiversity_index=bio,
                ndvi=ndvi,
                projected_credit_usd=usd,
            ))
            metrics_list.append(metrics)
        
        return metrics_list