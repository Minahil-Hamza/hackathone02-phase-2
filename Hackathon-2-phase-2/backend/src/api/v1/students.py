"""Students API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from src.db.session import get_session
from src.models.student import Student, StudentCreate, StudentUpdate, StudentRead
from src.repositories.student_repository import StudentRepository

router = APIRouter()


@router.post("/", response_model=StudentRead, status_code=status.HTTP_201_CREATED)
async def create_student(
    student_data: StudentCreate,
    session: AsyncSession = Depends(get_session),
):
    """Create a new student."""
    repo = StudentRepository(session)

    # Check if email already exists
    existing = await repo.get_by_email(student_data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A student with this email already exists",
        )

    student = await repo.create(student_data)
    return student


@router.get("/", response_model=List[StudentRead])
async def get_students(
    session: AsyncSession = Depends(get_session),
):
    """Get all students."""
    repo = StudentRepository(session)
    students = await repo.get_all()
    return students


@router.get("/{student_id}", response_model=StudentRead)
async def get_student(
    student_id: int,
    session: AsyncSession = Depends(get_session),
):
    """Get a specific student by ID."""
    repo = StudentRepository(session)
    student = await repo.get_by_id(student_id)

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found",
        )

    return student


@router.put("/{student_id}", response_model=StudentRead)
async def update_student(
    student_id: int,
    student_data: StudentUpdate,
    session: AsyncSession = Depends(get_session),
):
    """Update a student."""
    repo = StudentRepository(session)

    # Check if email is being changed to an existing one
    if student_data.email:
        existing = await repo.get_by_email(student_data.email)
        if existing and existing.id != student_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A student with this email already exists",
            )

    student = await repo.update(student_id, student_data)

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found",
        )

    return student


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_student(
    student_id: int,
    session: AsyncSession = Depends(get_session),
):
    """Delete a student."""
    repo = StudentRepository(session)
    deleted = await repo.delete(student_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found",
        )


@router.delete("/", status_code=status.HTTP_200_OK)
async def delete_all_students(
    session: AsyncSession = Depends(get_session),
):
    """Delete all students."""
    repo = StudentRepository(session)
    count = await repo.delete_all()
    return {"message": f"Deleted {count} students", "count": count}
