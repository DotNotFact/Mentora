import { createRoute } from '@tanstack/react-router';
import { PageContainer } from '@app/layout/page-container';
import { useDocumentMeta } from '@shared/hooks/use-document-meta';
import { PopularCourses } from '@features/courses/components/popular-courses';
import { rootRoute } from './__root';

function HomePage() {
  useDocumentMeta({
    title: 'Mentora — платформа онлайн-курсов',
    description: 'Учитесь у практикующих инструкторов, отслеживайте прогресс, получайте сертификаты.',
  });

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
