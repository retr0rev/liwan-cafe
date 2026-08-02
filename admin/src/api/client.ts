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
  getStats: () => request<{ categories: number; items: number; popular: number }>('/stats'),
  getRecentEdits: () =>
    request<{ items: any[]; categories: any[] }>('/stats/recent'),
  getCategories: () => request<any[]>('/categories'),
  createCategory: (body: any) =>
    request<any>('/categories', { method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id: number, body: any) =>
    request<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCategory: (id: number) => request<any>(`/categories/${id}`, { method: 'DELETE' }),
  getItems: () => request<any[]>('/items'),
  createItem: (body: any) =>
    request<any>('/items', { method: 'POST', body: JSON.stringify(body) }),
  updateItem: (id: number, body: any) =>
    request<any>(`/items/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteItem: (id: number) => request<any>(`/items/${id}`, { method: 'DELETE' }),
  uploadItemImage: (id: number, file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    return request<any>(`/items/${id}/image`, { method: 'POST', body: fd });
  },
  getSettings: () => request<Record<string, string>>('/settings'),
  updateSettings: (body: Record<string, string>) =>
    request('/settings', { method: 'PUT', body: JSON.stringify(body) }),
};
