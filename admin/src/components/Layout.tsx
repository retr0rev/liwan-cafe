import type { ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';

const links = [
  { hash: '#/', label: 'Dashboard' },
  { hash: '#/categories', label: 'Categories' },
  { hash: '#/items', label: 'Items' },
  { hash: '#/settings', label: 'Settings' },
  { hash: '#/password', label: 'Security' },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-green/10 bg-white p-4">
        <h1 className="mb-6 text-lg font-bold text-green">Liwan Admin</h1>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.hash}
              href={l.hash}
              className="rounded-lg px-3 py-2 text-sm text-chocolate hover:bg-green/5"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto pt-6">
          <p className="mb-2 text-xs text-chocolate/50">{user?.username}</p>
          <button onClick={logout} className="text-sm text-red-600 hover:underline">
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
