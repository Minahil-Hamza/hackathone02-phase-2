"""Database session management with async SQLModel engine."""
import ssl
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from src.config.settings import settings


# Prepare database URL for asyncpg (remove psycopg2-specific parameters)
def prepare_database_url(url: str) -> str:
    """Remove sslmode and channel_binding from URL as asyncpg handles SSL differently."""
    parsed = urlparse(url)
    query_params = parse_qs(parsed.query)
    # Remove psycopg2-specific SSL parameters
    query_params.pop('sslmode', None)
    query_params.pop('channel_binding', None)
    # Rebuild query string
    new_query = urlencode(query_params, doseq=True)
    # Rebuild URL with postgresql+asyncpg scheme
    new_url = urlunparse((
        'postgresql+asyncpg',
        parsed.netloc,
        parsed.path,
        parsed.params,
        new_query,
        parsed.fragment
    ))
    return new_url


# Create async engine with serverless-optimized connection pooling
async_engine = create_async_engine(
    prepare_database_url(settings.DATABASE_URL),
    echo=settings.DEBUG,
    pool_pre_ping=True,  # Verify connections before using
    pool_size=5,  # Serverless-friendly small pool
    max_overflow=10,
    connect_args={
        "ssl": ssl.create_default_context(),  # Enable SSL for Neon
    },
)

# Create async session factory
AsyncSessionLocal = sessionmaker(
    async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_session():
    """Dependency that provides database session."""
    async with AsyncSessionLocal() as session:
        yield session


async def create_db_and_tables():
    """Create all database tables (for development/testing only)."""
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
