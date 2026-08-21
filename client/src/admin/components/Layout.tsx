import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../auth/AuthContext';

const links = [
  { to: '/admin/dashboard', label: 'لوحة التحكم' },
  { to: '/admin/categories', label: 'الفئات' },
  { to: '/admin/items', label: 'الأصناف' },
  { to: '/admin/settings', label: 'الإعدادات' },
  { to: '/admin/password', label: 'الأمان' },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  return (
    <div dir="rtl" className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-l border-gold/10 bg-white p-4">
        <h1 className="mb-6 text-lg font-bold text-emerald">إدارة ليوان</h1>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="rounded-lg px-3 py-2 text-sm text-ink hover:bg-emerald/5" activeProps={{ className: 'bg-emerald/10 font-semibold' }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-6">
          <p className="mb-2 text-xs text-ink/50">{user?.username}</p>
          <button onClick={logout} className="text-sm text-red-600 hover:underline">تسجيل خروج</button>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
