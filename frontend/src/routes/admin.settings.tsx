import { createRoute } from '@tanstack/react-router';
import { adminRoute } from './admin';
import { Settings } from '../admin/pages/Settings';

export const settingsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/settings',
  component: Settings,
});
