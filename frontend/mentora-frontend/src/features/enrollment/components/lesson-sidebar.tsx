import { CheckCircle2, Circle, PlayCircle } from 'lucide-react';
import { cn } from '@shared/lib/utils';
import type { Chapter } from '@shared/types/api';

interface LessonSidebarProps {
  chapters: Chapter[];
  currentLessonId: string | null;
  completedLessonIds: ReadonlySet<string>;
  onSelectLesson: (lessonId: string) => void;
  className?: string;
}

export function LessonSidebar({
  chapters,
  currentLessonId,
  completedLessonIds,
  onSelectLesson,
  className,
}: LessonSidebarProps) {
  return (
    <nav className={cn('w-full space-y-4', className)} aria-label="Уроки курса">
      {chapters.map((chapter) => (
        <div key={chapter.id} className="space-y-1">
          <h3 className="text-muted-foreground px-2 text-xs font-semibold tracking-wide uppercase">
            {chapter.title}
          </h3>
          <ul className="space-y-0.5">
            {chapter.lessons.map((lesson) => {
              const isCurrent = lesson.id === currentLessonId;
              const isCompleted = completedLessonIds.has(lesson.id);

              return (
                <li key={lesson.id}>
                  <button
                    type="button"
                    onClick={() => onSelectLesson(lesson.id)}
                    aria-current={isCurrent ? 'true' : undefined}
                    className={cn(
                      'hover:bg-accent flex w-full items-center gap-2 rounded-md border-l-2 border-transparent px-2 py-2 text-left text-sm transition-colors duration-150',
                      isCurrent && 'bg-primary/10 border-primary font-medium',
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="text-success size-4 shrink-0" aria-hidden="true" />
                    ) : isCurrent ? (
                      <PlayCircle className="text-primary size-4 shrink-0" aria-hidden="true" />
                    ) : (
                      <Circle className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
                    )}
                    <span className="truncate">{lesson.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
