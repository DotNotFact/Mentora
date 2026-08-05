import { useEffect, useRef } from 'react';
import { Loader2, SearchX } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { useCoursesStore } from '../store';
import { useCourses } from '../hooks/use-courses';
import { CourseCard } from './course-card';
import { CourseCardSkeleton } from './course-card-skeleton';

const SKELETON_COUNT = 6;

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
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
        <span className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
          <SearchX className="text-muted-foreground h-6 w-6" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <p className="text-foreground text-sm font-medium">По заданным фильтрам ничего нет</p>
          <p className="text-muted-foreground mx-auto max-w-md text-sm">
            Попробуйте сбросить или изменить фильтры.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, index) => (
          // Staggered reveal — см. .agents/skills/aaa-ui-polish/SKILL.md,
          // "Появление списков — staggered, не разом". Задержка ограничена
          // первым экраном (12 карточек), дальше подгруженные страницы
          // появляются без искусственной паузы.
          <div
            key={course.id}
            className="animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards duration-500 [animation-timing-function:var(--ease-spring)]"
            style={{ animationDelay: `${Math.min(index, 11) * 40}ms` }}
          >
            <CourseCard course={course} />
          </div>
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
