import type { Category, MenuItem, Settings } from '@liwan/shared';

const BASE = import.meta.env.VITE_API_URL || '/api';

export function getToken(): string | null {
  return localStorage.getItem('admin_token');
}
export function setToken(t: string | null) {
  if (t) localStorage.setItem('admin_token', t);
  else localStorage.removeItem('admin_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).error || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Public
  getCategories: () => request<Category[]>('/categories'),
  getItems: () => request<MenuItem[]>('/items'),
  getSettings: () => request<Settings>('/settings'),
  // Auth
  login: (username: string, password: string) =>
    request<{ token: string; user: { id: number; username: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  // Admin - stats
  getStats: () => request<{ categories: number; items: number; popular: number }>('/stats'),
  getRecentEdits: () =>
    request<{ items: any[]; categories: any[] }>('/stats/recent'),
  // Admin - categories
  createCategory: (body: any) =>
    request<any>('/categories', { method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id: number, body: any) =>
    request<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCategory: (id: number) => request<any>(`/categories/${id}`, { method: 'DELETE' }),
  // Admin - items
  createItem: (body: any) =>
    request<any>('/items', { method: 'POST', body: JSON.stringify(body) }),
  updateItem: (id: number, body: any) =>
    request<any>(`/items/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteItem: (id: number) => request<any>(`/items/${id}`, { method: 'DELETE' }),
  uploadItemImage: async (id: number, file: File) => {
    const b64 = await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res((r.result as string).split(',')[1]);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
    return request<any>(`/items/${id}/image`, { method: 'POST', body: JSON.stringify({ image_base64: b64, filename: file.name, mimetype: file.type }) });
  },
  // Admin - settings
  updateSettings: (body: Record<string, string>) =>
    request('/settings', { method: 'PUT', body: JSON.stringify(body) }),
  uploadSettingImage: async (key: 'logo_url' | 'favicon_url', file: File) => {
    const b64 = await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res((r.result as string).split(',')[1]);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
    return request<{ key: string; value: string }>(`/settings/${key === 'logo_url' ? 'logo' : 'favicon'}`, { method: 'POST', body: JSON.stringify({ image_base64: b64, filename: file.name, mimetype: file.type }) });
  },
};
