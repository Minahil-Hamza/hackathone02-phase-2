"""Database session management with async SQLModel engine."""
import ssl
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from src.config.settings import settings


def is_sqlite_url(url: str) -> bool:
    """Check if the database URL is for SQLite."""
    return url.startswith("sqlite")


# Prepare database URL for asyncpg (remove psycopg2-specific parameters)
def prepare_database_url(url: str) -> str:
    """Remove sslmode and channel_binding from URL as asyncpg handles SSL differently."""
    if is_sqlite_url(url):
        # For SQLite, use aiosqlite driver
        if url.startswith("sqlite:///"):
            return url.replace("sqlite:///", "sqlite+aiosqlite:///")
        return url

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


# Create engine configuration based on database type
_db_url = prepare_database_url(settings.DATABASE_URL)
_is_sqlite = is_sqlite_url(settings.DATABASE_URL)

if _is_sqlite:
    # SQLite configuration (for local development)
    async_engine = create_async_engine(
        _db_url,
        echo=settings.DEBUG,
        connect_args={"check_same_thread": False},
    )
else:
    # PostgreSQL configuration with serverless-optimized connection pooling
    async_engine = create_async_engine(
        _db_url,
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
