"""Main FastAPI application."""
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

# Create FastAPI application
app = FastAPI(
    title="Todo API",
    description="Multi-user todo application API",
    version="1.0.0",
    debug=settings.DEBUG,
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
        "service": "Todo API",
        "version": "1.0.0",
    }


@app.get("/api/health", tags=["Health"])
async def api_health_check():
    """API health check endpoint."""
    return {
        "status": "healthy",
        "api_version": "v1",
    }
