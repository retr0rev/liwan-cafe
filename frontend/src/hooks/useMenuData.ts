import { useEffect, useMemo, useState } from 'react';
import type { Category, MenuItem, Settings } from '@liwan/shared';
import { api } from '../api/client';

export function useMenuData() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getCategories(), api.getItems(), api.getSettings()])
      .then(([c, i, s]) => {
        setCategories(c);
        setItems(i);
        setSettings(s);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
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
