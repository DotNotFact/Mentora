import { createRouter } from '@tanstack/react-router';
import { routerDefaultOptions } from '@shared/config/router';
import { rootRoute } from './routes/__root';
import { indexRoute } from './routes/index';
import { loginRoute } from './routes/login';
import { registerRoute } from './routes/register';
import { coursesIndexRoute } from './routes/courses/index';
import { courseDetailRoute } from './routes/courses/$courseId';

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  coursesIndexRoute,
  courseDetailRoute,
]);

export const router = createRouter({ routeTree, ...routerDefaultOptions });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
