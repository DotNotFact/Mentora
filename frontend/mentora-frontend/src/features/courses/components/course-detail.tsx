import { Link } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Skeleton } from '@shared/ui/skeleton';
import { formatPrice } from '@shared/lib/utils';
import { useAuthStore } from '@features/auth/store';
import { useEnroll } from '@features/enrollment/hooks/use-enroll';
import { useEnrollmentStatus } from '@features/enrollment/hooks/use-enrollment-status';
import { useCourse } from '../hooks/use-course';
import { courseCategoryLabels } from '../schemas';

interface CourseDetailProps {
  courseId: string;
}

export function CourseDetail({ courseId }: CourseDetailProps) {
  const { data, isPending, isError } = useCourse(courseId);

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-destructive py-12 text-center text-sm" role="alert">
        Не удалось загрузить курс. Попробуйте обновить страницу.
      </p>
    );
  }

  const course = data.data;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="bg-muted aspect-video overflow-hidden rounded-xl">
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-3">
          <Badge variant="secondary">{courseCategoryLabels[course.category]}</Badge>
          <h1 className="text-foreground text-4xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-muted-foreground text-sm">Преподаватель: {course.instructorName}</p>
        </div>
        <p className="text-foreground text-base whitespace-pre-line">{course.description}</p>
      </div>

      <aside className="bg-card h-fit space-y-4 rounded-xl border p-6 shadow-sm">
        <p className="text-foreground text-3xl font-bold">{formatPrice(course.price)}</p>
        <EnrollCta courseId={courseId} isFree={course.price === 0} />
      </aside>
    </div>
  );
}

function EnrollCta({ courseId, isFree }: { courseId: string; isFree: boolean }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isEnrolled, isLoading: isStatusLoading } = useEnrollmentStatus(
    isAuthenticated ? courseId : '',
  );
  const enroll = useEnroll();

  if (!isAuthenticated) {
    return (
      <Button asChild className="w-full">
        <Link to="/login">Войти, чтобы записаться</Link>
      </Button>
    );
  }

  if (isStatusLoading) {
    return (
      <Button type="button" className="w-full" disabled>
        <Loader2 className="animate-spin" aria-hidden="true" />
      </Button>
    );
  }

  if (isEnrolled || enroll.isSuccess) {
    return (
      <Button asChild className="w-full">
        <Link to="/learning/$courseId" params={{ courseId }}>
          Продолжить обучение
        </Link>
      </Button>
    );
  }

  if (isFree) {
    return (
      <div className="space-y-2">
        <Button
          type="button"
          className="w-full"
          disabled={enroll.isPending}
          onClick={() => enroll.mutate(courseId)}
        >
          {enroll.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
          Записаться бесплатно
        </Button>
        {enroll.isError && (
          <p className="text-destructive text-xs" role="alert">
            Не удалось записаться. Попробуйте ещё раз.
          </p>
        )}
      </div>
    );
  }

  return (
    <Button asChild className="w-full">
      <Link to="/checkout/$courseId" params={{ courseId }}>
        Записаться
      </Link>
    </Button>
  );
}
