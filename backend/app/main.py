import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health, wards, compare

app = FastAPI(title="Livebl API")


def _parse_allowed_origins() -> list[str]:
    raw = os.getenv("CORS_ALLOW_ORIGINS", "")
    if raw.strip():
        origins = [origin.strip() for origin in raw.split(",") if origin.strip()]
        if origins:
            return origins
    return ["http://localhost:5173", "http://127.0.0.1:5173"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=_parse_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Livebl API running"}

app.include_router(health.router)
app.include_router(wards.router)
app.include_router(compare.router)
