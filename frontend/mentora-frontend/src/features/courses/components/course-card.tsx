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

// Расширенный AAA-hover (tilt+glow+lift) — см.
// .agents/skills/aaa-ui-polish/SKILL.md, "Карточки — tilt + glow + lift".
// Снимает прежний лимит "только CourseCard имеет hover:scale" из
// mentora-design v2 (правило #16 в CLAUDE.md/AGENTS.md устарело).
export function CourseCard({ course, progress }: CourseCardProps) {
  return (
    <Link
      to="/courses/$courseId"
      params={{ courseId: course.id }}
      className="focus-visible:ring-ring block rounded-xl transition-transform duration-200 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:rotate-[0.5deg] hover:scale-[1.02] focus-visible:ring-2 focus-visible:outline-none"
    >
      <Card className="gap-0 overflow-hidden rounded-xl py-0 shadow-sm transition-shadow duration-200 ease-[var(--ease-out-expo)] hover:shadow-[0_4px_12px_-2px_rgba(15,23,42,0.15),0_8px_24px_-4px_rgba(99,102,241,0.25)]">
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
