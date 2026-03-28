from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.health import router as health_router
from app.api.wards import router as wards_router
from app.api.compare import router as compare_router

app = FastAPI(title="Livabl API", description="API for Livabl project")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(wards_router)
app.include_router(compare_router)

@app.get("/")
def root():
    return {"message": "Welcome to the Livabl API!"}