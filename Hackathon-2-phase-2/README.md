# Multi-User Todo Web Application

A secure, full-stack todo application with user authentication and task management.

## Architecture

**Monorepo Structure**:
- **Backend**: Python FastAPI with SQLModel ORM and JWT authentication
- **Frontend**: Next.js 16 with App Router, Better Auth, and React Query
- **Database**: Neon Serverless PostgreSQL

## Features

- 🔐 **Secure Authentication**: User registration and login with JWT tokens
- 👤 **User Isolation**: Each user sees only their own tasks
- ✅ **Task Management**: Create, read, update, delete, and complete tasks
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🚀 **Modern Stack**: Next.js, FastAPI, PostgreSQL

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Poetry (Python dependency manager)
- PostgreSQL database (Neon recommended)

### Setup

1. **Clone and configure environment**:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   cp .env.example .env
   # Edit .env with your database credentials and secrets
   ```

2. **Backend setup**:
   ```bash
   cd backend
   poetry install
   poetry shell
   alembic upgrade head
   uvicorn src.main:app --reload
   ```
   Backend will run at http://localhost:8000

3. **Frontend setup** (in new terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will run at http://localhost:3000

### Testing

**Backend**:
```bash
cd backend
pytest
```

**Frontend**:
```bash
cd frontend
npm test
npm run test:e2e
```

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── api/          # API endpoints
│   │   ├── models/       # Database models
│   │   ├── repositories/ # Data access layer
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Auth and error handling
│   │   ├── config/       # Configuration
│   │   └── db/           # Database session
│   ├── migrations/       # Alembic migrations
│   └── tests/            # Backend tests
│
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Auth and API clients
│   │   ├── hooks/        # Custom React hooks
│   │   └── types/        # TypeScript types
│   └── tests/            # Frontend tests
│
└── specs/                # Feature specifications
```

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Security

- Passwords hashed with bcrypt
- JWT tokens for stateless authentication
- User data isolated by user_id filtering
- HTTPS required in production
- Environment variables for secrets

## Development

See `/specs/001-multi-user-todo-app/` for detailed:
- **spec.md**: Feature requirements
- **plan.md**: Technical architecture
- **data-model.md**: Database schema
- **tasks.md**: Implementation tasks
- **quickstart.md**: Setup guide

## License

MIT
