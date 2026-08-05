import { BookOpen } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Skeleton } from '@shared/ui/skeleton';
import { Button } from '@shared/ui/button';
import { CourseCard } from '@features/courses/components/course-card';
import { useEnrollments } from '../hooks/use-enrollments';

const SKELETON_COUNT = 3;

function CourseCardSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border p-0 shadow-sm">
      <Skeleton className="aspect-video w-full rounded-b-none rounded-t-xl" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-2 w-full" />
      </div>
    </div>
  );
}

// Переиспользует CourseCard из features/courses (проп progress), а не
// заново рисует карточку курса — см. AGENTS.md → "Architecture discovery
// gate".
export function MyCoursesGrid() {
  const { data, isPending, isError } = useEnrollments();

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
        Не удалось загрузить ваши курсы. Попробуйте обновить страницу.
      </p>
    );
  }

  const enrollments = data.data;

  if (enrollments.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
        <BookOpen className="text-muted-foreground h-8 w-8" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-foreground text-sm font-medium">Вы пока не записаны ни на один курс</p>
          <p className="text-muted-foreground text-sm">
            Загляните в каталог, чтобы найти что-то по душе.
          </p>
        </div>
        <Button asChild>
          <Link to="/courses">Открыть каталог</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {enrollments.map((enrollment) => (
        <CourseCard key={enrollment.id} course={enrollment.course} progress={enrollment.progress} />
      ))}
    </div>
  );
}
