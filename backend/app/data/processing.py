import logging
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

class ProcessingError(Exception):
    pass

def parse_features(geojson_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    try:
        logger.info("Parsing features from GeoJSON...")
        if not isinstance(geojson_data, dict):
            raise ProcessingError("Input must be a dictionary")
        if "features" not in geojson_data:
            raise ProcessingError("GeoJSON does not contain features array")
        features = geojson_data["features"]
        if not isinstance(features, list):
            raise ProcessingError(f"'features' must be an array, got {type(features)}")
        if len(features) == 0:
            logger.warning("GeoJSON has empty features array")
        logger.info(f"Parsed {len(features)} features from GeoJSON")
        return features
    except ProcessingError:
        raise
    except Exception as e:
        logger.error(f"Error parsing features: {e}")
        raise ProcessingError(f"Failed to parse features: {e}") from e


def validate_features(features: List[Dict[str, Any]]) -> Dict[str, Any]:
    valid_count = 0
    invalid_count = 0
    errors = []
    logger.info(f"Validating {len(features)} features...")
    for i, feature in enumerate(features):
        try:
            if not isinstance(feature, dict):
                errors.append(f"Feature {i}: Not a dictionary")
                invalid_count += 1
                continue
            if feature.get("type") != "Feature":
                errors.append(f"Feature {i}: Invalid type '{feature.get('type')}'")
                invalid_count += 1
                continue
            if "properties" not in feature:
                errors.append(f"Feature {i}: Missing 'properties'")
                invalid_count += 1
                continue
            if "geometry" not in feature:
                errors.append(f"Feature {i}: Missing 'geometry'")
                invalid_count += 1
                continue
            valid_count += 1
        
        except Exception as e:
            errors.append(f"Feature {i}: {str(e)}")
            invalid_count += 1
    result ={
        "total_count": len(features),
        "valid_count": valid_count,
        "invalid_count": invalid_count,
        "errors": errors[:10]
    }
    logger.info(f"Validation: {valid_count} valid, {invalid_count} invalid")
    return result

def filter_valid_features(features: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    valid_features = []
    invalid_count = 0
    for i, feature in enumerate(features):
        try:
            if (isinstance(feature, dict) and
                feature.get("type") == "Feature" and
                "properties" in feature and
                "geometry" in feature):
                valid_features.append(feature)
            else:
                invalid_count += 1
        except Exception as e:
            logger.warning(f"Feature {i} validation failed: {e}")
            invalid_count += 1
    
    if invalid_count > 0:
        logger.info(f"Filtered out {invalid_count} invalid features")
    return valid_features

def get_feature_stats(features: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not features:
        return {"count": 0, "avg_properties": 0, "geometry_types": {}}
    total_properties = 0
    geometry_types = {}
    for feature in features:
        props = feature.get("properties", {})
        total_properties += len(props)
        geometry = feature.get("geometry", {})
        geom_type = geometry.get("type", "unknown")
        geometry_types[geom_type] = geometry_types.get(geom_type, 0) + 1
    return {
        "count": len(features),
        "avg_properties": round(total_properties / len(features), 2),
        "geometry_types": geometry_types,
        "total_properties": total_properties
    }

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    try:
        from ingestion import load_geojson
        data = load_geojson("wards_score.geojson")
        features = parse_features(data)
        print(f"Parsed {len(features)} features")
        validation = validate_features(features)
        print(f"Valid: {validation['valid_count']}, Invalid: {validation['invalid_count']}")
        stats = get_feature_stats(features)
        print(f"Avg properties: {stats['avg_properties']}")
        valid_features = filter_valid_features(features)
        print(f"Valid features: {len(valid_features)}")
    except Exception as e:
        print(f"Error: {e}")
