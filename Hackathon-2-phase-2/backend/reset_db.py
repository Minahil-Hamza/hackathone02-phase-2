"""Reset database script - drops all tables and recreates them."""
import asyncio
from src.db.session import async_engine
from sqlalchemy import text
from sqlmodel import SQLModel
from src.models.user import User
from src.models.task import Task


async def reset_database():
    """Drop all tables and recreate them."""
    print("Dropping all tables...")
    async with async_engine.begin() as conn:
        # Drop tables in correct order (tasks first due to foreign key)
        await conn.execute(text("DROP TABLE IF EXISTS tasks CASCADE"))
        await conn.execute(text("DROP TABLE IF EXISTS users CASCADE"))

    print("Tables dropped successfully")
    print("Creating fresh tables...")

    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    print("Fresh database ready!")
    print("Database has 0 users and 0 tasks")


if __name__ == "__main__":
    asyncio.run(reset_database())
