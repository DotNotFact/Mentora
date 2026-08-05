import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Progress } from '@shared/ui/progress';
import { formatPrice } from '@shared/lib/utils';
import type { Course } from '@shared/types/api';
import { courseCategoryLabels } from '../schemas';

interface CourseCardProps {
  course: Course;
  /**
   * Прогресс прохождения курса (0-100). Данные о зачислении появятся в
   * schedule/05 (enrollment/оплата) — сейчас это необязательный проп для
   * будущей интеграции. Полоса прогресса рендерится, только когда значение
   * передано (т.е. пользователь уже записан на курс).
   */
  progress?: number;
}

// Единственное место в проекте с hover:scale-[1.02] — см.
// .agents/skills/mentora-design/SKILL.md и CLAUDE.md, правило #16.
export function CourseCard({ course, progress }: CourseCardProps) {
  return (
    <Link
      to="/courses/$courseId"
      params={{ courseId: course.id }}
      className="focus-visible:ring-ring block rounded-xl transition-transform duration-150 ease-out hover:scale-[1.02] focus-visible:ring-2 focus-visible:outline-none"
    >
      <Card className="gap-0 overflow-hidden rounded-xl py-0 shadow-sm hover:shadow-md">
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
        <CardContent className="space-y-3 p-4">
          <h3 className="text-foreground line-clamp-2 text-base font-semibold tracking-tight">
            {course.title}
          </h3>
          <p className="text-muted-foreground text-sm">{course.instructorName}</p>
          {progress !== undefined && (
            <div className="space-y-1">
              <Progress value={progress} />
              <p className="text-muted-foreground text-xs">Пройдено {Math.round(progress)}%</p>
            </div>
          )}
          <div className="flex items-center justify-end">
            <span className="text-foreground text-lg font-semibold">
              {formatPrice(course.price)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
