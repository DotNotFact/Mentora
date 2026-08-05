import { Link } from '@tanstack/react-router';
import { Button } from '@shared/ui/button';
import { Skeleton } from '@shared/ui/skeleton';
import { useCourses } from '../hooks/use-courses';
import { defaultCourseFilters } from '../schemas';
import { CourseCard } from './course-card';

const PREVIEW_COUNT = 3;

// Превью популярных курсов для главной страницы — тонкая обёртка над
// useCourses с уменьшенным pageSize, полноценный каталог с фильтрами и
// пагинацией живёт на /courses (course-grid.tsx).
export function PopularCourses() {
  const { data, isPending, isError } = useCourses(
    { ...defaultCourseFilters, sort: 'popular' },
    { pageSize: PREVIEW_COUNT },
  );

  if (isError) {
    return null;
  }

  const courses = data?.pages[0]?.data.items ?? [];

  if (!isPending && courses.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-3xl font-semibold tracking-tight">
          Популярные курсы
        </h2>
        <Button asChild variant="ghost" size="sm">
          <Link to="/courses">Смотреть все курсы</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isPending
          ? Array.from({ length: PREVIEW_COUNT }, (_, index) => (
              <Skeleton key={index} className="aspect-video w-full rounded-xl" />
            ))
          : courses.map((course) => <CourseCard key={course.id} course={course} />)}
      </div>
    </section>
  );
}
