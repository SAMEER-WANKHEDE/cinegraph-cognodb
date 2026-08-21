const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export type Movie = {
  id: string;
  title: string;
  releaseYear: number;
  rating: number;
  duration: number;
  description: string;
  posterUrl?: string | null;
};

export type Actor = {
  id: string;
  name: string;
};

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || 'Unable to load data.');
  }

  return response.json();
}

export const api = {
  movies: (limit = 12) => request<Movie[]>(`/movies?limit=${limit}`),
  movie: (id: string) => request<any>(`/movies/${id}`),
  actors: (id: string) => request<Actor[]>(`/movies/${id}/actors`),
  recommendations: (id: string) =>
    request<any[]>(`/movies/${id}/recommendations`),
  connections: (id: string) => request<any[]>(`/movies/${id}/connections`),
  search: (q: string) =>
    request<any[]>(`/search?q=${encodeURIComponent(q)}&limit=20`),
};
