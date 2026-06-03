# Faultline AI (Next.js MVP)

AI-powered campaign red-team platform — predict marketing backlash before launch.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- OpenAI or Google Gemini (`AI_PROVIDER`)
- No database

## Quick start

```powershell
cd web
Copy-Item .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000

## Environment

| Variable | Description |
| -------- | ----------- |
| `AI_PROVIDER` | `openai` or `gemini` (default `gemini`) |
| `AI_MOCK_MODE` | `true` = demo data without API keys |
| `OPENAI_API_KEY` | Required when provider is `openai` and mock is off |
| `OPENAI_MODEL` | Default `gpt-4o-mini` |
| `GEMINI_API_KEY` | Required when provider is `gemini` and mock is off |
| `GEMINI_MODEL` | Default `gemini-2.0-flash` |

## API

`POST /api/analyze`

```json
{
  "campaign_name": "string",
  "slogan": "string",
  "campaign_description": "string",
  "campaign_copy": "string"
}
```

Returns structured JSON: `red_team`, `meme_simulator`, `backlash_risk`, `future_crisis`.

## Scripts

```powershell
npm run dev
npm run build
npm run start
npm run lint
```
