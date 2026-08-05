import { Skeleton } from '@shared/ui/skeleton';

interface CourseCardSkeletonProps {
  /**
   * Показывать полоску прогресса вместо строки цены — для списков, где
   * у карточки гарантированно есть прогресс (например, "Мои курсы"), а не
   * цена ("Каталог курсов").
   */
  withProgress?: boolean;
}

// Со-located с CourseCard, т.к. это именно его скелетон — переиспользуется
// в CourseGrid (каталог) и MyCoursesGrid (мои курсы), которые раньше
// дублировали идентичную разметку (см. mentora-design SKILL.md → "Loading
// states"). Форма/размеры зеркалят реальную карточку 1:1, чтобы загрузка
// не давала layout shift.
export function CourseCardSkeleton({ withProgress = false }: CourseCardSkeletonProps) {
  return (
    <div className="space-y-3 rounded-xl border p-0 shadow-sm">
      <Skeleton className="aspect-video w-full rounded-t-xl rounded-b-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        {withProgress ? (
          <Skeleton className="h-2 w-full" />
        ) : (
          <Skeleton className="ml-auto h-6 w-16" />
        )}
      </div>
    </div>
  );
}
