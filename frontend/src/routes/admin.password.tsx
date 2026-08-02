import { createRoute } from '@tanstack/react-router';
import { adminRoute } from './admin';
import { ChangePassword } from '../admin/pages/ChangePassword';

export const passwordRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/password',
  component: ChangePassword,
});
