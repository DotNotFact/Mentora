import { createRoute } from '@tanstack/react-router';
import { PopularCourses } from '@features/courses/components/popular-courses';
import { rootRoute } from './__root';

function HomePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-foreground text-4xl font-bold tracking-tight">Mentora</h1>
      <PopularCourses />
    </div>
  );
}

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});
