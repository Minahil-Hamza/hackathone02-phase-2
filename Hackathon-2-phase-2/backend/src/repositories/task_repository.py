"""Task repository for database operations."""
from typing import List, Optional
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.task import Task, TaskCreate, TaskUpdate


class TaskRepository:
    """Repository for task database operations."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_task(self, task_create: TaskCreate, user_id: UUID) -> Task:
        """Create a new task for a user."""
        task = Task(
            user_id=user_id,
            title=task_create.title,
            description=task_create.description,
            completed=False,
        )
        self.session.add(task)
        await self.session.commit()
        await self.session.refresh(task)
        return task

    async def get_task_by_id(self, task_id: UUID, user_id: UUID) -> Optional[Task]:
        """Get a task by ID (with user isolation)."""
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def get_user_tasks(self, user_id: UUID) -> List[Task]:
        """Get all tasks for a user."""
        statement = (
            select(Task)
            .where(Task.user_id == user_id)
            .order_by(Task.created_at.desc())
        )
        result = await self.session.execute(statement)
        return list(result.scalars().all())

    async def update_task(
        self, task_id: UUID, user_id: UUID, task_update: TaskUpdate
    ) -> Optional[Task]:
        """Update a task."""
        task = await self.get_task_by_id(task_id, user_id)
        if not task:
            return None

        # Update fields that are provided
        if task_update.title is not None:
            task.title = task_update.title
        if task_update.description is not None:
            task.description = task_update.description
        if task_update.completed is not None:
            task.completed = task_update.completed

        await self.session.commit()
        await self.session.refresh(task)
        return task

    async def delete_task(self, task_id: UUID, user_id: UUID) -> bool:
        """Delete a task."""
        task = await self.get_task_by_id(task_id, user_id)
        if not task:
            return False

        await self.session.delete(task)
        await self.session.commit()
        return True
