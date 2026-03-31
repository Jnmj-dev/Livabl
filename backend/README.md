## Livabl Backend

FastAPI service for ward data and scoring endpoints.

### Local Run

```bash
cd backend
uv sync --dev
uv run python run.py
```

API:
- `http://127.0.0.1:8000`
- `GET /health`

### Deploy (Docker)

This directory includes a production `Dockerfile`.

Required env vars:
- `CORS_ALLOW_ORIGINS=https://your-frontend-domain.com`

Build command (platform-managed):
- Docker build from `backend/`

Run command (already in Dockerfile):
- `uv run uvicorn app.main:app --host 0.0.0.0 --port 8000`
