import { createRoute } from '@tanstack/react-router';
import { adminRoute } from './admin';
import { Items } from '../admin/pages/Items';

export const itemsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/items',
  component: Items,
});
