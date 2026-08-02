import { createRouter } from '@tanstack/react-router';
import { rootRoute } from './routes/__root';
import { indexRoute } from './routes/index';
import { adminRoute } from './routes/admin';
import { dashboardRoute } from './routes/admin.dashboard';
import { categoriesRoute } from './routes/admin.categories';
import { itemsRoute } from './routes/admin.items';
import { settingsRoute } from './routes/admin.settings';
import { passwordRoute } from './routes/admin.password';
import { loginRoute } from './routes/admin.login';

const adminTree = adminRoute.addChildren([
  dashboardRoute,
  categoriesRoute,
  itemsRoute,
  settingsRoute,
  passwordRoute,
]);

export const routeTree = rootRoute.addChildren([indexRoute, loginRoute, adminTree]);
export const router = createRouter({ routeTree });
