
from fastapi import APIRouter

router = APIRouter()

@router.get("/wards")
def get_wards():
    return [{"id": 1, "name": "Sample Ward", "score": 70}]