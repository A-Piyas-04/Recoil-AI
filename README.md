# Codex Meetup

Full-stack application skeleton with **FastAPI**, **React (TypeScript + Vite)**, and **PostgreSQL**, packaged for local development and deployment with **Docker Compose**.

## Tech stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Backend    | Python 3.12, FastAPI, SQLAlchemy    |
| Frontend   | React 19, TypeScript, Vite 6        |
| Database   | PostgreSQL 16                       |
| Migrations | Alembic                             |
| Containers | Docker, Docker Compose              |

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose v2
- For local (non-Docker) development:
  - Python 3.12+
  - Node.js 22+ and npm
  - PostgreSQL 16 (or use only the `db` service from Compose)

## Project structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/v1/          # API routers and endpoints
│   │   ├── core/            # Config, database session
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   └── services/        # Business logic
│   ├── alembic/             # Database migrations
│   ├── tests/
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/             # API client, utilities
│   │   └── types/
│   ├── Dockerfile           # Production (nginx)
│   └── Dockerfile.dev       # Vite dev server
├── postgres/init/           # SQL scripts run on first DB start
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
└── .env                     # Local secrets (not committed)
```

## Getting started

### 1. Environment variables

Copy the example file and set your values (especially passwords and `SECRET_KEY`):

```bash
cp .env.example .env
```

On Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

See [Environment variables](#environment-variables) for a full reference.

### 2. Run with Docker (recommended)

Build and start all services (database, API, frontend):

```bash
docker compose up --build
```

| Service   | URL                                      |
| --------- | ---------------------------------------- |
| Frontend  | http://localhost:5173                    |
| API       | http://localhost:8000                    |
| API docs  | http://localhost:8000/docs               |
| Postgres  | `localhost:5432` (credentials from `.env`) |

Stop containers:

```bash
docker compose down
```

Remove the database volume (destructive):

```bash
docker compose down -v
```

### 3. Development mode (hot reload)

Use the dev override for backend `--reload` and the Vite dev server:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

- Backend reloads when files under `backend/app` change.
- Frontend runs Vite on port **5173** with HMR.

## Local development (without full Docker stack)

You can run the API and frontend on the host and still use Docker only for Postgres:

```bash
docker compose up db -d
```

### Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Ensure `DATABASE_URL` in `.env` points to `localhost` (not `db`) when the API runs outside Docker, for example:

```
DATABASE_URL=postgresql+psycopg://app:your_password@localhost:5432/app_db
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The dev server proxies `/api` to the backend (see `frontend/vite.config.ts`).

Set `VITE_API_URL` in `.env` when the browser must call the API directly (e.g. production builds):

```
VITE_API_URL=http://localhost:8000
```

## Database migrations

Run Alembic from the `backend` directory (with the virtualenv active and `DATABASE_URL` set):

```bash
cd backend
alembic revision --autogenerate -m "describe your change"
alembic upgrade head
```

Import new models in `backend/app/models/__init__.py` so autogenerate can detect them.

Optional seed or schema SQL: place `.sql` files in `postgres/init/`; they run once when the Postgres container is first created.

## API overview

| Method | Path            | Description        |
| ------ | --------------- | ------------------ |
| GET    | `/health`       | Service health     |
| GET    | `/api/v1/ping`  | Sample API route   |

Interactive documentation: http://localhost:8000/docs

## Environment variables

| Variable           | Description                                      | Example |
| ------------------ | ------------------------------------------------ | ------- |
| `POSTGRES_USER`    | Database user                                    | `app`   |
| `POSTGRES_PASSWORD`| Database password                                | —       |
| `POSTGRES_DB`      | Database name                                    | `app_db`|
| `POSTGRES_HOST`    | Hostname (`db` in Compose, `localhost` locally)| `db`    |
| `POSTGRES_PORT`    | Postgres port                                    | `5432`  |
| `DATABASE_URL`     | SQLAlchemy connection URL                        | See `.env.example` |
| `BACKEND_PORT`     | Host port mapped to the API container            | `8000`  |
| `SECRET_KEY`       | App secret (change in production)              | —       |
| `ENVIRONMENT`      | `development` / `production`                     | `development` |
| `DEBUG`            | FastAPI debug mode                               | `true`  |
| `CORS_ORIGINS`     | Comma-separated allowed origins                  | `http://localhost:5173` |
| `VITE_API_URL`     | API base URL for the frontend build              | `http://localhost:8000` |

Docker Compose overrides `DATABASE_URL` for the backend service to use the `db` hostname.

## Useful commands

```bash
# Backend tests
cd backend && pytest

# Frontend lint and production build
cd frontend && npm run lint
cd frontend && npm run build

# Rebuild a single service
docker compose build backend
docker compose up -d backend
```

## Production notes

- Set `DEBUG=false`, use a strong `SECRET_KEY`, and restrict `CORS_ORIGINS`.
- Do not commit `.env`; only `.env.example` belongs in version control.
- The production frontend image serves static files via nginx (`frontend/Dockerfile`). Build-time `VITE_API_URL` must match the URL browsers use to reach the API.

## License

Add your license here (e.g. MIT).
