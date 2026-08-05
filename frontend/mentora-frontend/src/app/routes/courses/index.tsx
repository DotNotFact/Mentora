import { createRoute } from '@tanstack/react-router';
import { PageContainer } from '@app/layout/page-container';
import { useDocumentMeta } from '@shared/hooks/use-document-meta';
import { CourseFilters } from '@features/courses/components/course-filters';
import { CourseGrid } from '@features/courses/components/course-grid';
import { rootRoute } from '../__root';

function CoursesCatalogPage() {
  useDocumentMeta({
    title: 'Каталог курсов — Mentora',
    description: 'Найдите курс по интересам, отфильтруйте по категории и цене.',
  });

  return (
    <PageContainer className="space-y-8">
      <div>
        <h1 className="text-foreground text-4xl font-bold tracking-tight">Каталог курсов</h1>
        <p className="text-muted-foreground mt-2 text-base">
          Найдите курс по интересам, отфильтруйте по категории и цене.
        </p>
      </div>
      <CourseFilters />
      <CourseGrid />
    </PageContainer>
  );
}

export const coursesIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses',
  component: CoursesCatalogPage,
});
