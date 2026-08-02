import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <p className="text-green font-semibold">Liwan</p>
    </div>
  );
}
