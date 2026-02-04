"""User model for authentication and ownership."""
from sqlmodel import SQLModel, Field
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional


class User(SQLModel, table=True):
    """User entity representing a registered account."""

    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(max_length=255, unique=True, index=True, nullable=False)
    hashed_password: str = Field(max_length=255, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class UserCreate(SQLModel):
    """Schema for user registration."""

    email: str = Field(max_length=255)
    password: str = Field(min_length=8, max_length=72)  # Bcrypt limit


class UserRead(SQLModel):
    """Schema for user responses (excludes password)."""

    id: UUID
    email: str
    created_at: datetime


class UserLogin(SQLModel):
    """Schema for user login."""

    email: str
    password: str
