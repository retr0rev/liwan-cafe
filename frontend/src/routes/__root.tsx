import { createRootRoute, Outlet } from '@tanstack/react-router';
import { ThreeBackground } from '../three/ThreeBackground';

export const rootRoute = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <>
      <ThreeBackground />
      <Outlet />
    </>
  );
}
