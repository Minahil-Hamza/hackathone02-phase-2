"""API dependencies for dependency injection."""
from typing import AsyncGenerator
from uuid import UUID
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.session import get_session
from src.middleware.jwt_middleware import get_current_user_id
from src.repositories.user_repository import UserRepository
from src.models.user import User


async def get_current_user(
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
) -> User:
    """
    Get the current authenticated user from JWT token.
    Raises 404 if user not found in database.
    """
    user_repository = UserRepository(session)
    user = await user_repository.get_user_by_id(UUID(user_id))

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user
