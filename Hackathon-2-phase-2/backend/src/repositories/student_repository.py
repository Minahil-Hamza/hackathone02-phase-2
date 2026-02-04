"""Repository for Student CRUD operations."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from datetime import datetime
from typing import List, Optional

from src.models.student import Student, StudentCreate, StudentUpdate


class StudentRepository:
    """Data access layer for Student operations."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, student_data: StudentCreate) -> Student:
        """Create a new student."""
        student = Student(
            name=student_data.name,
            email=student_data.email,
            age=student_data.age,
        )
        self.session.add(student)
        await self.session.commit()
        await self.session.refresh(student)
        return student

    async def get_all(self) -> List[Student]:
        """Get all students."""
        result = await self.session.execute(
            select(Student).order_by(Student.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_id(self, student_id: int) -> Optional[Student]:
        """Get a student by ID."""
        result = await self.session.execute(
            select(Student).where(Student.id == student_id)
        )
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Optional[Student]:
        """Get a student by email."""
        result = await self.session.execute(
            select(Student).where(Student.email == email)
        )
        return result.scalar_one_or_none()

    async def update(self, student_id: int, student_data: StudentUpdate) -> Optional[Student]:
        """Update a student."""
        student = await self.get_by_id(student_id)
        if not student:
            return None

        update_data = student_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(student, key, value)

        student.updated_at = datetime.utcnow()
        await self.session.commit()
        await self.session.refresh(student)
        return student

    async def delete(self, student_id: int) -> bool:
        """Delete a student by ID."""
        student = await self.get_by_id(student_id)
        if not student:
            return False

        await self.session.delete(student)
        await self.session.commit()
        return True

    async def delete_all(self) -> int:
        """Delete all students. Returns count of deleted students."""
        result = await self.session.execute(delete(Student))
        await self.session.commit()
        return result.rowcount
