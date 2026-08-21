import { useEffect, useState } from 'react';
import { api } from '../../api/client';

interface Stats {
  categories: number;
  items: number;
  popular: number;
}
interface Recent {
  items: { id: number; name_en: string }[];
  categories: { id: number; name_en: string }[];
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Recent>({ items: [], categories: [] });

  useEffect(() => {
    api.getStats().then(setStats).catch(() => {});
    api.getRecentEdits().then(setRecent).catch(() => {});
  }, []);

  const cards = [
    { label: 'Categories', value: stats?.categories ?? '—' },
    { label: 'Menu Items', value: stats?.items ?? '—' },
    { label: 'Popular Items', value: stats?.popular ?? '—' },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-emerald">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-ink/60">{c.label}</p>
            <p className="mt-1 text-3xl font-bold text-ink">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-ink">Recent Edits</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="mb-2 text-sm font-semibold text-emerald">Items</p>
            {recent.items.length === 0 && (
              <p className="text-sm text-ink/50">No recent edits</p>
            )}
            {recent.items.map((i) => (
              <p key={i.id} className="border-b border-gold/5 py-1 text-sm text-ink/80">
                {i.name_en}
              </p>
            ))}
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="mb-2 text-sm font-semibold text-emerald">Categories</p>
            {recent.categories.length === 0 && (
              <p className="text-sm text-ink/50">No recent edits</p>
            )}
            {recent.categories.map((c) => (
              <p key={c.id} className="border-b border-gold/5 py-1 text-sm text-ink/80">
                {c.name_en}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
