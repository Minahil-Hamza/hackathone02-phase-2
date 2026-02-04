"""Student model for student management."""
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class Student(SQLModel, table=True):
    """Student entity representing a student record."""

    __tablename__ = "students"

    id: int = Field(default=None, primary_key=True)
    name: str = Field(max_length=255, nullable=False)
    email: str = Field(max_length=255, unique=True, index=True, nullable=False)
    age: int = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class StudentCreate(SQLModel):
    """Schema for creating a student."""

    name: str = Field(min_length=1, max_length=255)
    email: str = Field(max_length=255)
    age: int = Field(ge=1, le=150)


class StudentUpdate(SQLModel):
    """Schema for updating a student."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[str] = Field(None, max_length=255)
    age: Optional[int] = Field(None, ge=1, le=150)


class StudentRead(SQLModel):
    """Schema for student responses."""

    id: int
    name: str
    email: str
    age: int
    created_at: datetime
    updated_at: datetime
