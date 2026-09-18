"""Seed demo data for Darukaa.Earth"""
import asyncio
import uuid
from datetime import datetime
import json

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from shapely.geometry import Polygon, mapping

from app.core.config import settings
from app.models.models import Project, Site, SiteMetrics, ProjectStatus, SiteStatus
from app.core.database import Base


# Demo project data
PROJECTS = [
    {
        "id": uuid.UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
        "name": "Amazon Rainforest Restoration",
        "type": "Mixed",
        "status": "active",
        "description": "Large-scale reforestation and conservation across the Amazon basin, combining carbon sequestration with biodiversity monitoring in one of the world's most critical ecosystems.",
        "location": "Amazonas, Brazil",
        "center": [-3.5, -62.0],
    },
    {
        "id": uuid.UUID("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
        "name": "Kenyan Rangeland Carbon",
        "type": "Carbon",
        "status": "active",
        "description": "Sustainable rangeland management practices that improve soil carbon sequestration while supporting pastoralist communities and wildlife corridors.",
        "location": "Laikipia County, Kenya",
        "center": [0.4, 36.9],
    },
    {
        "id": uuid.UUID("cccccccc-cccc-cccc-cccc-cccccccccccc"),
        "name": "Borneo Biodiversity Reserve",
        "type": "Biodiversity",
        "status": "active",
        "description": "Protecting critical rainforest habitat for endangered species including orangutans, clouded leopards, and sun bears through community-led conservation.",
        "location": "Sabah, Malaysia",
        "center": [5.1, 116.9],
    },
]

# Demo site data
SITES = [
    # Amazon sites
    {
        "id": uuid.UUID("11111111-1111-1111-1111-111111111111"),
        "project_id": uuid.UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
        "name": "Amazon Site Alpha",
        "status": "active",
        "center": [-3.4653, -62.2159],
        "size_deg": 0.08,
        "area_ha": 1240,
        "metrics": {
            "carbon_tco2e": 24800,
            "biodiversity_index": 82.4,
            "ndvi": 0.74,
            "projected_credit_usd": 420000,
        },
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222222"),
        "project_id": uuid.UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
        "name": "Amazon Site Beta",
        "status": "active",
        "center": [-4.2153, -61.5892],
        "size_deg": 0.06,
        "area_ha": 860,
        "metrics": {
            "carbon_tco2e": 18600,
            "biodiversity_index": 78.1,
            "ndvi": 0.71,
            "projected_credit_usd": 315000,
        },
    },
    {
        "id": uuid.UUID("33333333-3333-3333-3333-333333333333"),
        "project_id": uuid.UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
        "name": "Amazon Site Gamma",
        "status": "pending",
        "center": [-2.8912, -61.1247],
        "size_deg": 0.05,
        "area_ha": 740,
        "metrics": {
            "carbon_tco2e": 14200,
            "biodiversity_index": 74.8,
            "ndvi": 0.68,
            "projected_credit_usd": 241000,
        },
    },
    # Kenya sites
    {
        "id": uuid.UUID("44444444-4444-4444-4444-444444444444"),
        "project_id": uuid.UUID("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
        "name": "Laikipia Rangeland North",
        "status": "active",
        "center": [0.5939, 36.7561],
        "size_deg": 0.07,
        "area_ha": 980,
        "metrics": {
            "carbon_tco2e": 19200,
            "biodiversity_index": 68.3,
            "ndvi": 0.62,
            "projected_credit_usd": 326000,
        },
    },
    {
        "id": uuid.UUID("55555555-5555-5555-5555-555555555555"),
        "project_id": uuid.UUID("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
        "name": "Laikipia Rangeland South",
        "status": "active",
        "center": [0.2147, 37.0283],
        "size_deg": 0.06,
        "area_ha": 720,
        "metrics": {
            "carbon_tco2e": 15400,
            "biodiversity_index": 65.7,
            "ndvi": 0.59,
            "projected_credit_usd": 262000,
        },
    },
    # Borneo sites
    {
        "id": uuid.UUID("66666666-6666-6666-6666-666666666666"),
        "project_id": uuid.UUID("cccccccc-cccc-cccc-cccc-cccccccccccc"),
        "name": "Sabah Reserve East",
        "status": "active",
        "center": [5.2579, 117.1247],
        "size_deg": 0.06,
        "area_ha": 1020,
        "metrics": {
            "carbon_tco2e": 22300,
            "biodiversity_index": 86.7,
            "ndvi": 0.78,
            "projected_credit_usd": 379000,
        },
    },
    {
        "id": uuid.UUID("77777777-7777-7777-7777-777777777777"),
        "project_id": uuid.UUID("cccccccc-cccc-cccc-cccc-cccccccccccc"),
        "name": "Sabah Reserve West",
        "status": "completed",
        "center": [4.8912, 116.5892],
        "size_deg": 0.05,
        "area_ha": 680,
        "metrics": {
            "carbon_tco2e": 16800,
            "biodiversity_index": 79.2,
            "ndvi": 0.72,
            "projected_credit_usd": 285000,
        },
    },
]


def make_polygon(center: list, size_deg: float) -> Polygon:
    """Create a slightly irregular polygon around a center point"""
    lat, lng = center
    offset = size_deg / 2
    variance = size_deg * 0.15
    import random
    random.seed(hash(str(center)))
    return Polygon([
        (lng - offset + random.random() * variance, lat - offset + random.random() * variance),
        (lng - offset + random.random() * variance, lat + offset - random.random() * variance),
        (lng + offset - random.random() * variance, lat + offset - random.random() * variance),
        (lng + offset - random.random() * variance, lat - offset + random.random() * variance),
        (lng - offset + random.random() * variance, lat - offset + random.random() * variance),  # Close the ring
    ])


def polygon_to_geojson(polygon: Polygon) -> dict:
    """Convert Shapely polygon to GeoJSON format"""
    return mapping(polygon)


async def seed_data():
    engine = create_async_engine(
        settings.DATABASE_URL,
        echo=True,
        # Disable insertmanyvalues to avoid SQLite UUID issues
        use_insertmanyvalues=False,
    )
    
    AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with engine.begin() as conn:
        # Create tables
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncSessionLocal() as db:
        try:
            # Check if data already exists
            from sqlalchemy import select
            result = await db.execute(select(Project).limit(1))
            if result.scalar_one_or_none():
                print("Data already exists, skipping seed")
                return
            
            # Create projects
            for proj_data in PROJECTS:
                project = Project(
                    id=proj_data["id"],
                    owner_id=uuid.UUID("00000000-0000-0000-0000-000000000000"),  # Demo user
                    name=proj_data["name"],
                    description=proj_data["description"],
                    project_type=proj_data["type"],
                    status=proj_data["status"],
                )
                db.add(project)
            
            await db.flush()
            print("Projects created")
            
            # Create sites
            for site_data in SITES:
                polygon = make_polygon(site_data["center"], site_data["size_deg"])
                geojson = polygon_to_geojson(polygon)
                
                site = Site(
                    id=site_data["id"],
                    project_id=site_data["project_id"],
                    name=site_data["name"],
                    status=site_data["status"],
                    geometry=geojson,
                    area_ha=site_data["area_ha"],
                )
                db.add(site)
            
            await db.flush()
            print("Sites created")
            
            # Create monthly metrics for each site
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            
            for site_data in SITES:
                base_carbon = site_data["metrics"]["carbon_tco2e"]
                base_bio = site_data["metrics"]["biodiversity_index"]
                base_ndvi = site_data["metrics"]["ndvi"]
                base_usd = site_data["metrics"]["projected_credit_usd"]
                
                for i, month in enumerate(months):
                    growth = 1 + (i / 11) * 0.28
                    carbon = round(base_carbon * 0.72 * growth, 2)
                    bio = round(base_bio * 0.82 * (1 + (i / 11) * 0.18), 2)
                    ndvi = round(min(0.92, base_ndvi * (0.88 + (i / 11) * 0.12)), 2)
                    usd = round(base_usd * 0.65 * growth, 2)
                    
                    metric = SiteMetrics(
                        site_id=site_data["id"],
                        metric_date=datetime(2026, i + 1, 1),
                        carbon_tco2e=carbon,
                        biodiversity_index=bio,
                        ndvi=ndvi,
                        projected_credit_usd=usd,
                    )
                    db.add(metric)
            
            await db.commit()
            print("Monthly metrics created")
            print("Seed complete!")
            
        except Exception as e:
            await db.rollback()
            print(f"Error seeding data: {e}")
            raise
        finally:
            await db.close()
            await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed_data())