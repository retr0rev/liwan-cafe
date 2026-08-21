import { useState, type ReactNode } from 'react';
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
  const [open, setOpen] = useState(false);
  return (
    <div dir="rtl" className="flex min-h-screen bg-cream">
      <aside className={`fixed inset-y-0 right-0 z-40 flex h-screen w-64 flex-col border-l border-gold/10 bg-white p-4 transition-transform lg:sticky lg:translate-x-0 lg:w-56 ${open ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-bold text-emerald">إدارة ليوان</h1>
          <button onClick={() => setOpen(false)} className="rounded-full bg-ink/5 px-2 py-1 text-ink lg:hidden">✕</button>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-ink hover:bg-emerald/5 active:scale-95 lg:py-2" activeProps={{ className: 'bg-emerald/10 font-semibold' }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-gold/10">
          <p className="mb-2 text-xs text-ink/50 truncate">{user?.username}</p>
          <button onClick={logout} className="w-full rounded-full bg-red-50 py-2 text-sm font-semibold text-red-600 active:scale-95">تسجيل خروج</button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gold/10 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} className="rounded-full bg-emerald px-4 py-2 text-sm font-bold text-cream">☰ القائمة</button>
          <span className="text-sm font-bold text-emerald">ليوان</span>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
