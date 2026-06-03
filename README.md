# Recoil AI

AI-powered campaign red-team tool that predicts how a marketing campaign could backfire before launch.

Built on **FastAPI**, **React (TypeScript + Vite + Tailwind)**, **PostgreSQL**, and **Gemini or OpenAI** (configurable).

### Faultline AI — Next.js MVP (`web/`)

Standalone **Next.js** app with **no database**: landing page, campaign form, `POST /api/analyze`, and results dashboard. Switch providers via `AI_PROVIDER=openai|gemini`.

```powershell
cd web
Copy-Item .env.example .env.local
npm install
npm run dev
```

→ http://localhost:3000 — see [web/README.md](web/README.md).

## Features

All four modules run in a **single AI request** per analysis.

### Feature 1 — Red Team Analysis ⭐

Only **4 agents**, each with a focused question:

| Agent | Question |
| ----- | -------- |
| **Activist** | What could offend people? |
| **Journalist** | What negative headline could be written? |
| **Competitor** | How could a rival mock this? |
| **Meme Creator** | How could the internet turn this into a joke? |

**Output format:**

```
ACTIVIST:
Potential issue ...

JOURNALIST:
Possible headline ...

COMPETITOR:
Attack angle ...

MEME CREATOR:
Likely parody ...
```

This alone is already impressive.

### Feature 2 — Meme Generator ⭐⭐⭐

This is the wow factor.

Generates:

- **3 mock memes**
- **Meme captions**
- **Parody slogans**

**Example** — Campaign: *"Fuel Your Future"*

```
Meme #1:
"Fuel Your Future*
*Terms and conditions apply"

Memeability Score:
8.7/10
```

Judges will remember this.

### Feature 3 — Backfire Score ⭐

Simple LLM-scored risk (no complex ML):

```
Backfire Risk
72/100
```

**Breakdown:**

- Offense Risk
- Meme Risk
- Brand Contradiction Risk
- Competitor Exploitability

### Feature 4 — Pre-Mortem Generator ⭐⭐⭐

*"Imagine this campaign failed. Why?"*



**Example output:**

```
June 2027

Brand apologizes after social media backlash
regarding campaign slogan ...
```

## Prerequisites

- Docker and Docker Compose v2, **or**
- Python 3.12+, Node.js 22+, PostgreSQL 16

## Quick start (Docker)

```powershell
Copy-Item .env.example .env
# Set GEMINI_API_KEY or OPENAI_API_KEY for live AI, or keep AI_MOCK_MODE=true for demo data
docker compose up --build
```

| Service  | URL                          |
| -------- | ---------------------------- |
| Frontend | http://localhost:5173        |
| API      | http://localhost:8000        |
| API docs | http://localhost:8000/docs   |

Migrations run automatically on backend startup.

## Environment variables

| Variable           | Description                                      |
| ------------------ | ------------------------------------------------ |
| `DATABASE_URL`     | SQLAlchemy Postgres URL                          |
| `AI_PROVIDER`      | `gemini` or `openai`                             |
| `AI_MOCK_MODE`     | `true` = all sections use demo data (no API)     |
| `AI_GEMINI_FEATURES` | Comma list: `red_team`, `meme`, `risk`, `crisis`, `brand` — only these call Gemini when mock is off |
| `GEMINI_API_KEY`   | Google Gemini API key (backend only, never frontend) |
| `GEMINI_MODEL`     | Model id (default `gemini-2.5-flash`)            |
| `OPENAI_API_KEY`   | OpenAI API key                                   |
| `OPENAI_MODEL`     | Model id (default `gpt-4o-mini`)                 |
| `CORS_ORIGINS`     | Comma-separated frontend origins                 |
| `VITE_API_URL`     | API base for production frontend build           |

## API overview

| Method | Path                         | Description              |
| ------ | ---------------------------- | ------------------------ |
| GET    | `/health`                    | Service health           |
| POST   | `/api/v1/analyze`            | Run full red-team analysis |
| GET    | `/api/v1/analyses`           | List analysis history    |
| GET    | `/api/v1/analyses/{id}`      | Get full analysis result |

### Analyze request body

```json
{
  "campaign_draft": "Full campaign copy (50+ characters)…",
  "brand_values": "Transparency, sustainability…",
  "brand_mission": "Make sustainable products accessible",
  "previous_messaging": "Prior brand voice and commitments…"
}
```

Optional: `brand_profile_id` to reuse a saved brand profile.

## Local development

**Database + API:**

```powershell
docker compose up db -d
cd backend
pip install -r requirements.txt
alembic upgrade head
$env:DATABASE_URL="postgresql+psycopg://app:PASSWORD@localhost:5432/app_db"
$env:AI_MOCK_MODE="true"
uvicorn app.main:app --reload --port 8000
```

**Frontend:**

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 (Vite proxies `/api` to the backend).

## Tests

```powershell
cd backend
pip install -r requirements.txt
pytest
```

```powershell
cd frontend
npm run lint
npm run build
```

## Project structure

```
backend/app/
  api/v1/endpoints/   # analyses, health
  models/             # Analysis
  schemas/            # Pydantic + LLM response schema
  services/           # llm.py, analysis.py
frontend/src/
  pages/              # Home, Analyze, Results, History
  components/         # forms, results sections, UI
```

## License

Add your license here (e.g. MIT).
