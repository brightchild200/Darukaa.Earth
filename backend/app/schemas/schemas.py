from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict
from enum import Enum


class ProjectType(str, Enum):
    CARBON = "Carbon"
    BIODIVERSITY = "Biodiversity"
    MIXED = "Mixed"


class ProjectStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class SiteStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"
    ARCHIVED = "archived"


# Project Schemas
class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    project_type: ProjectType
    status: ProjectStatus = ProjectStatus.ACTIVE
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    project_type: Optional[ProjectType] = None
    status: Optional[ProjectStatus] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class ProjectResponse(ProjectBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    owner_id: UUID
    created_at: datetime
    updated_at: datetime


class ProjectListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    project_type: ProjectType
    status: ProjectStatus
    location: Optional[str] = None
    area: Optional[float] = None
    site_count: int = 0
    total_carbon: Optional[float] = None
    created_at: datetime


# Site Schemas
class SiteBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    status: SiteStatus = SiteStatus.ACTIVE


class SiteCreate(SiteBase):
    project_id: UUID
    geometry: dict  # GeoJSON Polygon


class SiteUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[SiteStatus] = None
    geometry: Optional[dict] = None


class SiteResponse(SiteBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    project_id: UUID
    geometry: dict
    area_ha: Optional[float] = None
    created_at: datetime
    updated_at: datetime


class SiteListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    project_id: UUID
    status: SiteStatus
    area_ha: Optional[float] = None
    created_at: datetime


# Site Metrics Schemas
class SiteMetricsBase(BaseModel):
    metric_date: datetime
    carbon_tco2e: Optional[float] = None
    biodiversity_index: Optional[float] = None
    ndvi: Optional[float] = None
    projected_credit_usd: Optional[float] = None


class SiteMetricsCreate(SiteMetricsBase):
    pass


class SiteMetricsResponse(SiteMetricsBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    site_id: UUID
    created_at: datetime


class SiteMetricsListResponse(BaseModel):
    site_id: UUID
    metrics: List[SiteMetricsResponse]


# Auth Schemas
class UserRegister(BaseModel):
    email: str
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


# Analytics Schemas
class MonthlyMetric(BaseModel):
    month: str
    carbon_tco2e: float
    biodiversity_index: float
    ndvi: float
    projected_credit_usd: float


class SiteAnalyticsResponse(BaseModel):
    site_id: UUID
    site_name: str
    current_metrics: dict
    monthly_data: List[MonthlyMetric]
    trends: dict


class ProjectAnalyticsResponse(BaseModel):
    project_id: UUID
    project_name: str
    total_area: float
    total_carbon: float
    avg_biodiversity: float
    avg_ndvi: float
    site_count: int
    active_sites: int
    monthly_data: List[MonthlyMetric]


# Health Check
class HealthResponse(BaseModel):
    status: str
    version: str
    database: str