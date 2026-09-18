from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings


class Base(DeclarativeBase):
    pass


def get_engine():
    """Create engine based on database URL"""
    url = settings.DATABASE_URL
    
    if url.startswith("sqlite"):
        # SQLite configuration - ensure correct async URL format
        if url.startswith("sqlite+aiosqlite://"):
            async_url = url
        else:
            async_url = url.replace("sqlite://", "sqlite+aiosqlite://")
        return create_async_engine(
            async_url,
            echo=settings.DEBUG,
            connect_args={"check_same_thread": False},
        )
    else:
        # PostgreSQL configuration
        return create_async_engine(
            url.replace("postgresql://", "postgresql+asyncpg://"),
            echo=settings.DEBUG,
            pool_pre_ping=True,
        )


engine = get_engine()

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db() -> None:
    async with engine.begin() as conn:
        # Enable PostGIS extension for PostgreSQL
        if not settings.DATABASE_URL.startswith("sqlite"):
            await conn.execute("CREATE EXTENSION IF NOT EXISTS postgis;")
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)