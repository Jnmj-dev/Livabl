export interface ScoreBreakdown {
  safety: number;
  walkability: number;
  transit: number;
  schools: number;
  greenery: number;
  noise: number;
}

export interface Neighborhood {
  id: string;
  name: string;
  city: string;
  region: string;
  area_km2: number;
  score: number;
  breakdown: ScoreBreakdown;
  coordinates: {
    lat: number;
    lng: number;
  };
  zone?: {
    x: number;
    y: number;
    width: number;
    height: number;
    pinX: number;
    pinY: number;
  };
}

export type ScoreCategory = 'all' | 'safety' | 'walkability' | 'transit' | 'schools' | 'greenery' | 'noise';
export type MapLayer = 'livability' | 'safety' | 'transit';
export type ScoreGrade = 'excellent' | 'average' | 'poor';

export interface NeighborhoodsResponse {
  neighborhoods: Neighborhood[];
  total: number;
}

export interface SearchResponse {
  query: string;
  results: Neighborhood[];
}