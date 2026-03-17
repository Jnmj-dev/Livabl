from fastapi import APIRouter, HTTPException
from typing import List
from app.data.wards import get_all_wards, get_ward_by_id
from app.scoring.score import calculate_score
from app.schemas.ward import WardResponse, WardDetailResponse

router = APIRouter(tags=["Wards"])


@router.get("/wards", response_model=List[WardResponse])
def list_wards():
    data = get_all_wards()

    return [
        {
            "id": w["id"],
            "name": w["name"],
            "city": w["city"],
            "score": round(calculate_score(w), 2)
        }
        for w in data
    ]


@router.get("/wards/{ward_id}", response_model=WardDetailResponse)
def get_ward(ward_id: int):
    w = get_ward_by_id(ward_id)

    if not w:
        raise HTTPException(status_code=404, detail="Ward not found")

    metrics = {k: v for k, v in w.items() if k not in {"id", "name", "city"}}

    return {
        "id": w["id"],
        "name": w["name"],
        "city": w["city"],
        "score": round(calculate_score(w), 2),
        "metrics": metrics
    }