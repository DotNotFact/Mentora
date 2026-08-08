import { Link } from '@tanstack/react-router';
import { FolderPlus } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { useInstructorCourses } from '../hooks/use-instructor-courses';
import { InstructorCourseCard } from './instructor-course-card';
import { CourseCardSkeleton } from './course-card-skeleton';

const SKELETON_COUNT = 3;

interface InstructorCoursesGridProps {
  instructorId: string;
}

export function InstructorCoursesGrid({ instructorId }: InstructorCoursesGridProps) {
  const { data, isPending, isError } = useInstructorCourses(instructorId);

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

  const courses = data.data.items;

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
        <span className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
          <FolderPlus className="text-muted-foreground h-6 w-6" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <p className="text-foreground text-sm font-medium">Вы ещё не создали ни одного курса</p>
          <p className="text-muted-foreground mx-auto max-w-md text-sm">
            Начните с названия и описания — главы и уроки можно добавить позже.
          </p>
        </div>
        <Button asChild>
          <Link to="/courses/edit/$courseId" params={{ courseId: 'new' }}>
            Создать курс
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, index) => (
        <div
          key={course.id}
          className="animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards duration-500 [animation-timing-function:var(--ease-spring)]"
          style={{ animationDelay: `${index * 40}ms` }}
        >
          <InstructorCourseCard course={course} />
        </div>
      ))}
    </div>
  );
}
