import { createRoute } from '@tanstack/react-router';
import { PageContainer } from '@app/layout/page-container';
import { PopularCourses } from '@features/courses/components/popular-courses';
import { rootRoute } from './__root';

function HomePage() {
  return (
    <PageContainer className="space-y-12">
      <h1 className="text-foreground text-4xl font-bold tracking-tight">Mentora</h1>
      <PopularCourses />
    </PageContainer>
  );
}

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});
