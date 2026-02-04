"""Authentication API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.session import get_session
from src.models.user import UserCreate, UserLogin, UserRead
from src.repositories.user_repository import UserRepository
from src.services.auth_service import AuthService

router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    user_create: UserCreate,
    session: AsyncSession = Depends(get_session),
):
    """
    Register a new user account.

    Returns:
        - access_token: JWT token for authentication
        - token_type: Bearer
        - user: User information
    """
    user_repository = UserRepository(session)
    auth_service = AuthService(user_repository)

    try:
        user = await auth_service.register_user(user_create)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "EMAIL_EXISTS", "message": str(e)},
        )

    # Create access token
    access_token = auth_service.create_access_token(str(user.id))

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserRead(
            id=user.id,
            email=user.email,
            created_at=user.created_at,
        ),
    }


@router.post("/login")
async def login(
    user_login: UserLogin,
    session: AsyncSession = Depends(get_session),
):
    """
    Authenticate user and return access token.

    Returns:
        - access_token: JWT token for authentication
        - token_type: Bearer
        - user: User information
    """
    user_repository = UserRepository(session)
    auth_service = AuthService(user_repository)

    user = await auth_service.authenticate_user(user_login)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "INVALID_CREDENTIALS", "message": "Invalid email or password"},
        )

    # Create access token
    access_token = auth_service.create_access_token(str(user.id))

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserRead(
            id=user.id,
            email=user.email,
            created_at=user.created_at,
        ),
    }


@router.post("/logout")
async def logout():
    """
    Logout endpoint (optional for stateless JWT).
    Client should remove the JWT token from storage.

    Returns:
        Success message
    """
    return {
        "message": "Successfully logged out. Please remove the token from client storage.",
    }
