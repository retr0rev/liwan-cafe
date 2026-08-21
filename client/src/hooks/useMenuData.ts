import { useEffect, useMemo, useState } from 'react';
import type { Category, MenuItem, Settings } from '@liwan/shared';
import { api } from '../api/client';

export function useMenuData() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      const [c, i, s] = await Promise.all([api.getCategories(), api.getItems(), api.getSettings()]);
      setCategories(c); setItems(i); setSettings(s); setError(null);
    } catch (e) { setError(String(e)); } finally { setLoading(false); }
  };
  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, 7000);
    const onFocus = () => fetchAll();
    window.addEventListener('focus', onFocus);
    window.addEventListener('visibilitychange', () => { if (!document.hidden) fetchAll(); });
    let bc: BroadcastChannel | null = null;
    try { bc = new BroadcastChannel('liwan_update'); bc.onmessage = fetchAll; } catch {}
    const onStorage = (e: StorageEvent) => { if (e.key === 'liwan_update') fetchAll(); };
    window.addEventListener('storage', onStorage);
    return () => { clearInterval(id); window.removeEventListener('focus', onFocus); window.removeEventListener('storage', onStorage); bc?.close(); };
  }, []);

  const itemsByCategory = useMemo(() => {
    const map: Record<number, MenuItem[]> = {};
    for (const item of items) {
      (map[item.category_id] ||= []).push(item);
    }
    return map;
  }, [items]);

  return { categories, items, itemsByCategory, settings, loading, error };
}
