import { Link } from '@tanstack/react-router';
import { Pencil } from 'lucide-react';
import { Card, CardContent } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { formatPrice } from '@shared/lib/utils';
import type { Course } from '@shared/types/api';
import { courseCategoryLabels } from '../schemas';

interface InstructorCourseCardProps {
  course: Course;
}

// Карточка курса в режиме управления (не в каталоге/"Мои курсы"
// студента) — вместо цены/рейтинга и ссылки на публичную страницу
// курса даёт прямой переход в редактор. Не переиспользует CourseCard
// (у той иначе устроен клик — вся карточка ведёт на /courses/$id) —
// здесь клик по превью/названию тоже ведёт в редактор, поведение
// идентично кнопке снизу, но с явной кнопкой для дискаверабилити.
export function InstructorCourseCard({ course }: InstructorCourseCardProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-xl py-0 shadow-sm">
      <Link
        to="/courses/edit/$courseId"
        params={{ courseId: course.id }}
        className="focus-visible:ring-ring block focus-visible:ring-2 focus-visible:outline-none"
      >
        <div className="bg-muted relative aspect-video overflow-hidden">
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <Badge variant="secondary" className="absolute top-3 left-3">
            {courseCategoryLabels[course.category]}
          </Badge>
        </div>
      </Link>
      <CardContent className="space-y-3 p-4">
        <Link
          to="/courses/edit/$courseId"
          params={{ courseId: course.id }}
          className="focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          <h3 className="text-foreground line-clamp-2 text-base font-semibold tracking-tight">
            {course.title}
          </h3>
        </Link>
        <p className="text-foreground text-lg font-semibold">{formatPrice(course.price)}</p>
        <Button asChild variant="outline" className="w-full">
          <Link to="/courses/edit/$courseId" params={{ courseId: course.id }}>
            <Pencil aria-hidden="true" />
            Редактировать
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
