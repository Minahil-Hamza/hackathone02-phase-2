"""Task model for todo items."""
from sqlmodel import SQLModel, Field
from datetime import datetime, date
from uuid import UUID, uuid4
from typing import Optional
from enum import Enum


class TaskPriority(str, Enum):
    """Task priority levels."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class TaskCategory(str, Enum):
    """Task categories."""
    PERSONAL = "personal"
    WORK = "work"
    SHOPPING = "shopping"
    HEALTH = "health"
    FINANCE = "finance"
    EDUCATION = "education"
    OTHER = "other"


class Task(SQLModel, table=True):
    """Task entity representing a todo item."""

    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", nullable=False, index=True)
    title: str = Field(max_length=500, nullable=False)
    description: Optional[str] = Field(default=None, max_length=5000)
    completed: bool = Field(default=False, nullable=False)
    priority: str = Field(default="medium", nullable=False)
    category: str = Field(default="personal", nullable=False)
    due_date: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class TaskCreate(SQLModel):
    """Schema for creating a task."""

    title: str = Field(min_length=1, max_length=500)
    description: Optional[str] = Field(default=None, max_length=5000)
    priority: Optional[str] = Field(default="medium")
    category: Optional[str] = Field(default="personal")
    due_date: Optional[str] = Field(default=None)


class TaskUpdate(SQLModel):
    """Schema for updating a task."""

    title: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = Field(None, max_length=5000)
    completed: Optional[bool] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    due_date: Optional[str] = None


class TaskRead(SQLModel):
    """Schema for task responses."""

    id: UUID
    user_id: UUID
    title: str
    description: Optional[str]
    completed: bool
    priority: str
    category: str
    due_date: Optional[str]
    created_at: datetime
    updated_at: datetime
