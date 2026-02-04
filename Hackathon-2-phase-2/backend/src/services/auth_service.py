"""Authentication service for user registration and login."""
from datetime import datetime, timedelta
from typing import Optional
import jwt
import bcrypt
from src.config.settings import settings
from src.models.user import User, UserCreate, UserLogin
from src.repositories.user_repository import UserRepository


class AuthService:
    """Service for authentication operations."""

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt."""
        # Convert password to bytes and hash
        password_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password_bytes, salt)
        return hashed.decode('utf-8')

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against a hash."""
        password_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_bytes)

    def create_access_token(self, user_id: str) -> str:
        """Create a JWT access token for a user."""
        expire = datetime.utcnow() + timedelta(days=settings.JWT_EXPIRATION_DAYS)
        to_encode = {
            "sub": str(user_id),
            "exp": expire,
            "iat": datetime.utcnow(),
        }
        encoded_jwt = jwt.encode(
            to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM
        )
        return encoded_jwt

    async def register_user(self, user_create: UserCreate) -> User:
        """Register a new user with hashed password."""
        # Check if email already exists
        if await self.user_repository.email_exists(user_create.email):
            raise ValueError("Email already registered")

        # Hash password and create user
        hashed_password = self.hash_password(user_create.password)
        user = await self.user_repository.create_user(user_create, hashed_password)
        return user

    async def authenticate_user(self, user_login: UserLogin) -> Optional[User]:
        """Authenticate a user with email and password."""
        user = await self.user_repository.get_user_by_email(user_login.email)
        if not user:
            return None

        if not self.verify_password(user_login.password, user.hashed_password):
            return None

        return user
