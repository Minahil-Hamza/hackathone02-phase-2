"""CORS middleware configuration."""
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from src.config.settings import settings


def setup_cors(app: FastAPI) -> None:
    """Configure CORS middleware for the application."""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
