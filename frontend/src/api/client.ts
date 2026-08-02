import type { Category, MenuItem, Settings } from '@liwan/shared';

const BASE = import.meta.env.VITE_API_URL || '/api';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  getCategories: () => get<Category[]>('/categories'),
  getItems: () => get<MenuItem[]>('/items'),
  getSettings: () => get<Settings>('/settings'),
};
