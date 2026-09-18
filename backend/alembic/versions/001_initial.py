"""Initial migration

Revision ID: 001
Revises: 
Create Date: 2026-09-18

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from geoalchemy2 import Geometry

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Enable PostGIS extension
    op.execute('CREATE EXTENSION IF NOT EXISTS postgis;')

    # Create projects table
    op.create_table(
        'projects',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('owner_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('project_type', sa.Enum('Carbon', 'Biodiversity', 'Mixed', name='project_type'), nullable=False),
        sa.Column('status', sa.Enum('draft', 'active', 'completed', 'archived', name='project_status'), nullable=False, server_default='active'),
        sa.Column('start_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('end_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('idx_projects_owner', 'projects', ['owner_id'], unique=False)

    # Create sites table
    op.create_table(
        'sites',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('geometry', Geometry(geometry_type='POLYGON', srid=4326, spatial_index=True), nullable=False),
        sa.Column('area_ha', sa.Numeric(14, 4), nullable=True),
        sa.Column('status', sa.Enum('active', 'inactive', 'pending', 'archived', name='site_status'), nullable=False, server_default='active'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('idx_sites_project', 'sites', ['project_id'], unique=False)
    op.execute('CREATE INDEX idx_sites_geometry ON sites USING GIST (geometry);')

    # Create site_metrics table
    op.create_table(
        'site_metrics',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('site_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('metric_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('carbon_tco2e', sa.Numeric(14, 2), nullable=True),
        sa.Column('biodiversity_index', sa.Numeric(6, 4), nullable=True),
        sa.Column('ndvi', sa.Numeric(6, 4), nullable=True),
        sa.Column('projected_credit_usd', sa.Numeric(16, 2), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['site_id'], ['sites.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('site_id', 'metric_date', name='uq_site_metrics_site_date'),
    )
    op.create_index('idx_site_metrics_site_date', 'site_metrics', ['site_id', 'metric_date'], unique=False)


def downgrade() -> None:
    op.drop_index('idx_site_metrics_site_date', table_name='site_metrics')
    op.drop_table('site_metrics')
    op.execute('DROP INDEX IF EXISTS idx_sites_geometry;')
    op.drop_index('idx_sites_project', table_name='sites')
    op.drop_table('sites')
    op.drop_index('idx_projects_owner', table_name='projects')
    op.drop_table('projects')
    op.execute('DROP TYPE IF EXISTS project_type;')
    op.execute('DROP TYPE IF EXISTS project_status;')
    op.execute('DROP TYPE IF EXISTS site_status;')