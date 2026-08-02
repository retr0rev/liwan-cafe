import { useEffect, useState, type ComponentType } from 'react';
import { AdminLayout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Categories } from './pages/Categories';
import { Items } from './pages/Items';
import { Settings } from './pages/Settings';
import { ChangePassword } from './pages/ChangePassword';

const routes: Record<string, ComponentType> = {
  '/': Dashboard,
  '/categories': Categories,
  '/items': Items,
  '/settings': Settings,
  '/password': ChangePassword,
};

export function Router() {
  const [hash, setHash] = useState(window.location.hash.replace(/^#/, '') || '/');
  useEffect(() => {
    const onHash = () => setHash(window.location.hash.replace(/^#/, '') || '/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const Page = routes[hash] || Dashboard;
  return (
    <AdminLayout>
      <Page />
    </AdminLayout>
  );
}
