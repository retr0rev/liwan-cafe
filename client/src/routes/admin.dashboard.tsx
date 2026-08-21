import { createRoute } from '@tanstack/react-router';
import { adminRoute } from './admin';
import { Dashboard } from '../admin/pages/Dashboard';

export const dashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/dashboard',
  component: Dashboard,
});
