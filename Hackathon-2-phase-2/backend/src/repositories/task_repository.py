"""Task repository for database operations."""
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from sqlalchemy import select, func
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
            priority=task_create.priority or "medium",
            category=task_create.category or "personal",
            due_date=task_create.due_date,
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

    async def get_user_stats(self, user_id: UUID) -> dict:
        """Get task statistics for a user."""
        total_stmt = select(func.count()).where(Task.user_id == user_id)
        completed_stmt = select(func.count()).where(
            Task.user_id == user_id, Task.completed == True
        )

        total_result = await self.session.execute(total_stmt)
        completed_result = await self.session.execute(completed_stmt)

        total = total_result.scalar() or 0
        completed = completed_result.scalar() or 0

        return {
            "total": total,
            "completed": completed,
            "pending": total - completed,
        }

    async def update_task(
        self, task_id: UUID, user_id: UUID, task_update: TaskUpdate
    ) -> Optional[Task]:
        """Update a task."""
        task = await self.get_task_by_id(task_id, user_id)
        if not task:
            return None

        if task_update.title is not None:
            task.title = task_update.title
        if task_update.description is not None:
            task.description = task_update.description
        if task_update.completed is not None:
            task.completed = task_update.completed
        if task_update.priority is not None:
            task.priority = task_update.priority
        if task_update.category is not None:
            task.category = task_update.category
        if task_update.due_date is not None:
            task.due_date = task_update.due_date

        task.updated_at = datetime.utcnow()

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

    async def delete_all_tasks(self, user_id: UUID) -> int:
        """Delete all tasks for a user."""
        statement = select(Task).where(Task.user_id == user_id)
        result = await self.session.execute(statement)
        tasks = list(result.scalars().all())
        count = len(tasks)
        for task in tasks:
            await self.session.delete(task)
        await self.session.commit()
        return count
