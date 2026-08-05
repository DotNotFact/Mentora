import { createRoute } from '@tanstack/react-router';
import { CourseFilters } from '@features/courses/components/course-filters';
import { CourseGrid } from '@features/courses/components/course-grid';
import { rootRoute } from '../__root';

function CoursesCatalogPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-foreground text-4xl font-bold tracking-tight">Каталог курсов</h1>
        <p className="text-muted-foreground mt-2 text-base">
          Найдите курс по интересам, отфильтруйте по категории и цене.
        </p>
      </div>
      <CourseFilters />
      <CourseGrid />
    </div>
  );
}

export const coursesIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses',
  component: CoursesCatalogPage,
});
