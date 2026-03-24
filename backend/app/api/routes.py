from fastapi import FastAPI
from app.api.health import router as health_router
from app.api.wards import router as wards_router
from app.api.compare import router as compare_router

app = FastAPI(title="Livabl API", description="API for Livabl project")

app.include_router(health_router)
app.include_router(wards_router)
app.include_router(compare_router)

@app.get("/")
def root():
    return {"message": "Welcome to the Livabl API!"}
