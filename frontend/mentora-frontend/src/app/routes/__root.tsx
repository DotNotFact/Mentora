import { createRootRoute, Outlet } from '@tanstack/react-router';
import { RootLayout } from '@app/layout/root-layout';

export const rootRoute = createRootRoute({
  component: () => (
    <RootLayout>
      <Outlet />
    </RootLayout>
  ),
});
