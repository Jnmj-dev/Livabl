import type { Neighborhood, NeighborhoodsResponse, SearchResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

async function fetchOrMock<T>(path: string, mock: T): Promise<T> {
  if (!API_BASE) return mock;
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<T>;
  } catch (err) {
    console.warn('[Livabl API] falling back to mock data:', err);
    return mock;
  }
}

export async function getNeighborhoods(): Promise<NeighborhoodsResponse> {
  return fetchOrMock('/api/neighborhoods', { neighborhoods: [], total: 0 });
}

export async function searchNeighborhoods(query: string): Promise<SearchResponse> {
  return fetchOrMock(`/api/search?q=${encodeURIComponent(query)}`, { query, results: [] });
}

export async function getNeighborhood(id: string): Promise<Neighborhood | null> {
  return fetchOrMock(`/api/neighborhoods/${id}`, null);
}