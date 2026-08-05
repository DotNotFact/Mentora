import { createRouter } from '@tanstack/react-router';
import { routerDefaultOptions } from '@shared/config/router';
import { rootRoute } from './routes/__root';
import { indexRoute } from './routes/index';
import { loginRoute } from './routes/login';
import { registerRoute } from './routes/register';
import { coursesIndexRoute } from './routes/courses/index';
import { courseDetailRoute } from './routes/courses/$courseId';
import { dashboardIndexRoute } from './routes/dashboard/index';
import { dashboardInstructorRoute } from './routes/dashboard/instructor';
import { dashboardAdminRoute } from './routes/dashboard/admin';
import { courseEditRoute } from './routes/courses/edit/$courseId';
import { checkoutRoute } from './routes/checkout/$courseId';
import { myCoursesRoute } from './routes/my-courses';
import { learningRoute } from './routes/learning/$courseId';

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  coursesIndexRoute,
  courseDetailRoute,
  dashboardIndexRoute,
  dashboardInstructorRoute,
  dashboardAdminRoute,
  courseEditRoute,
  checkoutRoute,
  myCoursesRoute,
  learningRoute,
]);

export const router = createRouter({ routeTree, ...routerDefaultOptions });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
