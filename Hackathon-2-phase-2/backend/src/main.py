"""Main FastAPI application."""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError

from src.middleware.cors import setup_cors
from src.middleware.error_handler import (
    validation_exception_handler,
    integrity_error_handler,
    generic_exception_handler,
)
from src.config.settings import settings
from src.api.v1 import auth, tasks
from src.db.session import create_db_and_tables

# Import models to register them with SQLModel
from src.models.user import User
from src.models.task import Task


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan - create tables on startup."""
    await create_db_and_tables()
    yield

# Create FastAPI application
app = FastAPI(
    title="TaskFlow API",
    description="Full-stack Todo application API with JWT authentication",
    version="1.0.0",
    debug=settings.DEBUG,
    lifespan=lifespan,
)

# Setup CORS middleware
setup_cors(app)

# Register exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(IntegrityError, integrity_error_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Include API routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["Tasks"])


@app.get("/", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "TaskFlow API",
        "version": "1.0.0",
    }


@app.get("/api/health", tags=["Health"])
async def api_health_check():
    """API health check endpoint."""
    return {
        "status": "healthy",
        "api_version": "v1",
    }
