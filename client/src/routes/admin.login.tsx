import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { Login } from '../admin/pages/Login';

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: Login,
});
