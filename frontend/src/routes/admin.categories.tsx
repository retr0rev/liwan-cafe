import { createRoute } from '@tanstack/react-router';
import { adminRoute } from './admin';
import { Categories } from '../admin/pages/Categories';

export const categoriesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/categories',
  component: Categories,
});
