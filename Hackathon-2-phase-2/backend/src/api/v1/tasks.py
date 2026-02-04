"""Task CRUD API endpoints."""
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.session import get_session
from src.models.task import TaskCreate, TaskUpdate, TaskRead
from src.models.user import User
from src.repositories.task_repository import TaskRepository
from src.api.deps import get_current_user

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=TaskRead)
async def create_task(
    task_create: TaskCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """
    Create a new task for the current user.
    """
    task_repository = TaskRepository(session)
    task = await task_repository.create_task(task_create, current_user.id)
    return task


@router.get("/", response_model=List[TaskRead])
async def get_tasks(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """
    Get all tasks for the current user.
    """
    task_repository = TaskRepository(session)
    tasks = await task_repository.get_user_tasks(current_user.id)
    return tasks


@router.get("/{task_id}", response_model=TaskRead)
async def get_task(
    task_id: UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """
    Get a specific task by ID.
    """
    task_repository = TaskRepository(session)
    task = await task_repository.get_task_by_id(task_id, current_user.id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "TASK_NOT_FOUND", "message": "Task not found"},
        )

    return task


@router.put("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: UUID,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """
    Update a task.
    """
    task_repository = TaskRepository(session)
    task = await task_repository.update_task(task_id, current_user.id, task_update)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "TASK_NOT_FOUND", "message": "Task not found"},
        )

    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """
    Delete a task.
    """
    task_repository = TaskRepository(session)
    deleted = await task_repository.delete_task(task_id, current_user.id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "TASK_NOT_FOUND", "message": "Task not found"},
        )

    return None
