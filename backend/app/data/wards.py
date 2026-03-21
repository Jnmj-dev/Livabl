import json
from pathlib import Path

DATA_PATH = (Path(__file__).resolve().parent.parent 
             / "data"  
             / "processed" 
             / "wards_with_aqi.geojson"
)

def load_data():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
        return data["features"]

def get_all_wards():
    features = load_data()
    # Assuming 'wards' is a list of ward data; if not, replace with features = load_data() and enumerate(features)
    return [
        {
            "id": i,
            "name": w["properties"].get("ward_name", f"Ward {i}"),
            "city": "Delhi",
            **w["properties"]  # Unpack additional properties
        }
        for i, w in enumerate(features)
    ]

def get_ward_by_id(ward_id: int):
    wards_list = get_all_wards()
    if ward_id < 0 or ward_id >= len(wards_list):
        return None
    return wards_list[ward_id]
