import { createRoute, redirect, Outlet } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { getToken } from '../api/client';
import { AdminLayout } from '../admin/components/Layout';

export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: () => {
    if (!getToken()) {
      throw redirect({ to: '/admin/login' });
    }
  },
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
});
