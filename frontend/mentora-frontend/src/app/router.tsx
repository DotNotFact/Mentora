import { createRouter } from '@tanstack/react-router';
import { routerDefaultOptions } from '@shared/config/router';
import { rootRoute } from './routes/__root';
import { indexRoute } from './routes/index';
import { loginRoute } from './routes/login';
import { registerRoute } from './routes/register';

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, registerRoute]);

export const router = createRouter({ routeTree, ...routerDefaultOptions });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
