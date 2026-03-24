from fastapi import FastAPI
from app.api import health, wards, compare

app = FastAPI(title="Livebl API")

@app.get("/")
def root():
    return {"message": "Livebl API running"}

app.include_router(health.router)
app.include_router(wards.router)
app.include_router(compare.router)

