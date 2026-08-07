import { LibraryBig } from 'lucide-react';
import { createRoute } from '@tanstack/react-router';
import { PageContainer } from '@app/layout/page-container';
import { PageHeader } from '@app/layout/page-header';
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
      <PageHeader
        icon={LibraryBig}
        title="Каталог курсов"
        description="Найдите курс по интересам, отфильтруйте по категории и цене."
      />
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
