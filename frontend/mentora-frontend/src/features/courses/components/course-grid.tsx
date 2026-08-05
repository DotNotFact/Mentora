import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@shared/ui/skeleton';
import { Button } from '@shared/ui/button';
import { useCoursesStore } from '../store';
import { useCourses } from '../hooks/use-courses';
import { CourseCard } from './course-card';

const SKELETON_COUNT = 6;

function CourseCardSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border p-0 shadow-sm">
      <Skeleton className="aspect-video w-full rounded-b-none rounded-t-xl" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="ml-auto h-6 w-16" />
      </div>
    </div>
  );
}

export function CourseGrid() {
  const filters = useCoursesStore((state) => state.filters);
  const { data, isPending, isError, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useCourses(filters);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Автоподгрузка следующей страницы при появлении "сторожевого" элемента
  // во вьюпорте — UI-эффект (не server-state, тот приходит из useInfiniteQuery
  // выше), поэтому useEffect здесь допустим (см. CLAUDE.md, правило #2).
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        void fetchNextPage();
      }
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-destructive py-12 text-center text-sm" role="alert">
        Не удалось загрузить каталог курсов. Попробуйте обновить страницу.
      </p>
    );
  }

  const courses = data.pages.flatMap((page) => page.data.items);

  if (courses.length === 0) {
    return (
      <p className="text-muted-foreground py-12 text-center text-sm">
        По заданным фильтрам курсы не найдены.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      {hasNextPage && (
        <div ref={sentinelRef} className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            disabled={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
          >
            {isFetchingNextPage && <Loader2 className="animate-spin" aria-hidden="true" />}
            Загрузить ещё
          </Button>
        </div>
      )}
    </div>
  );
}
