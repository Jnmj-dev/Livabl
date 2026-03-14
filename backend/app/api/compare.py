from fastapi import APIRouter

router = APIRouter()

@router.get("/compare")
def compare(ward1: int, ward2: int):
    return {
        "ward1": ward1,
        "ward2": ward2
    }