import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import (
    UUID,
    DateTime,
    String,
    Text,
    ForeignKey,
    Enum as SQLEnum,
    Numeric,
    Index,
    func,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.core.config import settings


class ProjectType(str):
    CARBON = "Carbon"
    BIODIVERSITY = "Biodiversity"
    MIXED = "Mixed"


class ProjectStatus(str):
    DRAFT = "draft"
    ACTIVE = "active"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class SiteStatus(str):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"
    ARCHIVED = "archived"


# Use PostGIS Geometry only for PostgreSQL
if settings.DATABASE_URL.startswith("postgresql"):
    from geoalchemy2 import Geometry
    GeometryType = Geometry
else:
    # For SQLite, store as JSON text
    from sqlalchemy import JSON
    GeometryType = JSON


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    project_type: Mapped[str] = mapped_column(SQLEnum(ProjectType.CARBON, ProjectType.BIODIVERSITY, ProjectType.MIXED, name="project_type"), nullable=False)
    status: Mapped[str] = mapped_column(SQLEnum(ProjectStatus.DRAFT, ProjectStatus.ACTIVE, ProjectStatus.COMPLETED, ProjectStatus.ARCHIVED, name="project_status"), default=ProjectStatus.ACTIVE, nullable=False)
    start_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    end_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    sites: Mapped[list["Site"]] = relationship("Site", back_populates="project", cascade="all, delete-orphan", lazy="selectin")

    __table_args__ = (
        Index("idx_projects_owner", "owner_id"),
    )


class Site(Base):
    __tablename__ = "sites"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    geometry: Mapped[dict] = mapped_column(GeometryType, nullable=False)
    area_ha: Mapped[Optional[float]] = mapped_column(Numeric(14, 4), nullable=True)
    status: Mapped[str] = mapped_column(SQLEnum(SiteStatus.ACTIVE, SiteStatus.INACTIVE, SiteStatus.PENDING, SiteStatus.ARCHIVED, name="site_status"), default=SiteStatus.ACTIVE, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    project: Mapped["Project"] = relationship("Project", back_populates="sites")
    metrics: Mapped[list["SiteMetrics"]] = relationship("SiteMetrics", back_populates="site", cascade="all, delete-orphan", lazy="selectin")

    __table_args__ = (
        Index("idx_sites_project", "project_id"),
    )


class SiteMetrics(Base):
    __tablename__ = "site_metrics"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    site_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("sites.id", ondelete="CASCADE"), nullable=False)
    metric_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    carbon_tco2e: Mapped[Optional[float]] = mapped_column(Numeric(14, 2), nullable=True)
    biodiversity_index: Mapped[Optional[float]] = mapped_column(Numeric(6, 4), nullable=True)
    ndvi: Mapped[Optional[float]] = mapped_column(Numeric(6, 4), nullable=True)
    projected_credit_usd: Mapped[Optional[float]] = mapped_column(Numeric(16, 2), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    site: Mapped["Site"] = relationship("Site", back_populates="metrics")

    __table_args__ = (
        UniqueConstraint("site_id", "metric_date", name="uq_site_metrics_site_date"),
        Index("idx_site_metrics_site_date", "site_id", "metric_date"),
    )