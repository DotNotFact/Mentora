import { lazy, Suspense, useEffect, useMemo } from 'react';
import { CatchBoundary, Link } from '@tanstack/react-router';
import { Skeleton } from '@shared/ui/skeleton';
import { Button } from '@shared/ui/button';
import { WidgetErrorFallback } from '@app/error-fallback';
import { useCourseChapters } from '@features/courses/hooks/use-course-chapters';
import { useEnrollmentStatus } from '../hooks/use-enrollment-status';
import { useProgress } from '../hooks/use-progress';
import { useUpdateProgress } from '../hooks/use-update-progress';
import { useEnrollmentStore } from '../store';
import { LessonSidebar } from './lesson-sidebar';
import { ProgressBar } from './progress-bar';
import { LessonContent } from './lesson-content';

// vidstack — тяжёлая библиотека (media-ui чанк), нужна только на странице
// обучения, не при каждом визите в приложение.
const VideoPlayer = lazy(() => import('./video-player').then((m) => ({ default: m.VideoPlayer })));

interface LearningPageProps {
  courseId: string;
}

export function LearningPage({ courseId }: LearningPageProps) {
  const enrollmentStatus = useEnrollmentStatus(courseId);
  const chaptersQuery = useCourseChapters(courseId);
  const progressQuery = useProgress(courseId);
  const updateProgress = useUpdateProgress(courseId);

  const currentLessonId = useEnrollmentStore((state) => state.currentLessonId);
  const setCurrentLessonId = useEnrollmentStore((state) => state.setCurrentLessonId);

  const chapters = useMemo(() => chaptersQuery.data?.data ?? [], [chaptersQuery.data]);
  const lessons = useMemo(() => chapters.flatMap((chapter) => chapter.lessons), [chapters]);

  // Урок по умолчанию — первый в дереве курса, если пользователь ещё не
  // выбрал урок в этой сессии (UI-эффект синхронизации локального стора с
  // подгруженными данными, не server-state — см. CLAUDE.md, правило #2).
  useEffect(() => {
    if (!currentLessonId && lessons.length > 0) {
      setCurrentLessonId(lessons[0].id);
    }
  }, [currentLessonId, lessons, setCurrentLessonId]);

  if (enrollmentStatus.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    );
  }

  if (!enrollmentStatus.isEnrolled) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-12 text-center">
        <p className="text-foreground text-sm font-medium">Вы не записаны на этот курс</p>
        <Button asChild>
          <Link to="/courses/$courseId" params={{ courseId }}>
            Перейти к странице курса
          </Link>
        </Button>
      </div>
    );
  }

  if (chaptersQuery.isPending || progressQuery.isPending) {
    return (
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-4">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <Skeleton className="h-2 w-full" />
        </div>
        <Skeleton className="h-64 w-full lg:w-80 lg:shrink-0" />
      </div>
    );
  }

  if (chaptersQuery.isError || progressQuery.isError) {
    return (
      <p className="text-destructive py-12 text-center text-sm" role="alert">
        Не удалось загрузить курс. Попробуйте обновить страницу.
      </p>
    );
  }

  const currentLesson = lessons.find((lesson) => lesson.id === currentLessonId) ?? lessons[0];
  const progress = progressQuery.data.data;
  const currentLessonProgress = progress.lessons.find(
    (lesson) => lesson.lessonId === currentLesson?.id,
  );
  const completedLessonIds = new Set(
    progress.lessons.filter((lesson) => lesson.completed).map((lesson) => lesson.lessonId),
  );

  if (!currentLesson) {
    return (
      <p className="text-muted-foreground py-12 text-center text-sm">
        В этом курсе пока нет уроков.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <ProgressBar value={progress.progressPercent} />
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-4">
          {/* Изолирует сбой видеоплеера (внешняя библиотека, сетевая
              загрузка видео) от остальной страницы — заголовок, текст
              урока и сайдбар продолжают работать, даже если плеер упал. */}
          <CatchBoundary
            getResetKey={() => currentLesson.id}
            errorComponent={() => <WidgetErrorFallback title="Не удалось загрузить видео" />}
          >
            <Suspense fallback={<Skeleton className="aspect-video w-full rounded-xl" />}>
              <VideoPlayer
                key={currentLesson.id}
                lessonId={currentLesson.id}
                src={currentLesson.videoUrl ?? ''}
                title={currentLesson.title}
                initialPositionSeconds={currentLessonProgress?.positionSeconds ?? 0}
                completed={currentLessonProgress?.completed ?? false}
                onProgress={({ positionSeconds, completed }) =>
                  updateProgress.mutate({ lessonId: currentLesson.id, positionSeconds, completed })
                }
              />
            </Suspense>
          </CatchBoundary>
          <h1 className="text-foreground text-4xl leading-tight font-bold tracking-tight">
            {currentLesson.title}
          </h1>
          <LessonContent html={currentLesson.contentHtml} />
        </div>
        <LessonSidebar
          className="lg:w-80 lg:shrink-0"
          chapters={chapters}
          currentLessonId={currentLesson.id}
          completedLessonIds={completedLessonIds}
          onSelectLesson={setCurrentLessonId}
        />
      </div>
    </div>
  );
}
