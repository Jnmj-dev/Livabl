import type {
  Neighborhood,
  NeighborhoodsResponse,
  SearchResponse,
} from "../types";

// Loads real ward data from the backend GeoJSON file
// When VITE_API_URL is set, calls the real API instead
const API_BASE = import.meta.env.VITE_API_URL || "";

async function loadWardsFromGeoJSON(): Promise<Neighborhood[]> {
  const res = await fetch("/data/wards_score.geojson");
  if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
  const geojson = await res.json();

  return geojson.features
    .filter((f: any) => f.properties?.Ward_Name && f.geometry)
    .map((f: any) => {
      const p = f.properties;

      // Calculate centroid from polygon coordinates
      const coords =
        f.geometry.type === "Polygon"
          ? f.geometry.coordinates[0]
          : f.geometry.coordinates[0][0];

      const lats = coords.map((c: number[]) => c[1]);
      const lngs = coords.map((c: number[]) => c[0]);
      const lat = (Math.min(...lats) + Math.max(...lats)) / 2;
      const lng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

      // Normalize 0-1 scores to 0-100
      const n = (v: number | null) => (v != null ? Math.round(v * 100) : 0);

      const overall = n(p.livability_score);
      const healthcare = n(p.hospital_score);
      const education = n(p.school_score);
      const environment = n(p.pollution_score);

      return {
        id: String(p.ward_id ?? p.Ward_Name),
        name: p.Ward_Name,
        city: "Delhi",
        region: "Delhi NCR",
        area_km2: 0,
        score: overall,
        breakdown: {
          safety: overall,
          walkability: environment,
          transit: overall,
          schools: education,
          greenery: environment,
          noise: environment,
        },
        coordinates: { lat, lng },
      } as Neighborhood;
    });
}

async function fetchOrLocal<T>(
  path: string,
  local: () => Promise<T>,
): Promise<T> {
  if (!API_BASE) return local();
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<T>;
  } catch (err) {
    console.warn("[API] Falling back to local GeoJSON:", err);
    return local();
  }
}

export async function getNeighborhoods(): Promise<NeighborhoodsResponse> {
  const neighborhoods = await fetchOrLocal("/api/wards", loadWardsFromGeoJSON);
  const list = Array.isArray(neighborhoods)
    ? neighborhoods
    : ((neighborhoods as any).wards ?? []);
  return { neighborhoods: list, total: list.length };
}

export async function searchNeighborhoods(
  query: string,
): Promise<SearchResponse> {
  const { neighborhoods } = await getNeighborhoods();
  const q = query.toLowerCase();
  const results = neighborhoods.filter((n) => n.name.toLowerCase().includes(q));
  return { query, results };
}

export async function getNeighborhood(
  id: string,
): Promise<Neighborhood | null> {
  const { neighborhoods } = await getNeighborhoods();
  return neighborhoods.find((n) => n.id === id) ?? null;
}
