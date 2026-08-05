import { lazy, Suspense } from 'react';
import { CatchBoundary, createRoute } from '@tanstack/react-router';
import { AuthGuard } from '@app/auth-guard';
import { PageContainer } from '@app/layout/page-container';
import { WidgetErrorFallback } from '@app/error-fallback';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { CourseMetaForm } from '@features/course-editor/components/course-meta-form';
import { ChapterList } from '@features/course-editor/components/chapter-list';
import { VideoUpload } from '@features/course-editor/components/video-upload';
import { useCourseEditor } from '@features/course-editor/hooks/use-course-editor';
import { useCourseEditorStore } from '@features/course-editor/store';
import { rootRoute } from '../../__root';

// TipTap (rich-text) — самая тяжёлая библиотека курс-редактора после
// vidstack, грузится собственным чанком только когда реально выбран урок
// для редактирования, а не при каждом визите на /courses/edit/*.
const LessonEditor = lazy(() =>
  import('@features/course-editor/components/lesson-editor').then((m) => ({
    default: m.LessonEditor,
  })),
);

export const courseEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses/edit/$courseId',
  component: CourseEditRoutePage,
});

// Тонкий роут: параметр из URL + AuthGuard + композиция компонентов из
// features/course-editor. Бизнес-логика (загрузка/сохранение курса,
// drag & drop, rich text, аплоад видео) — целиком в features/course-editor.
function CourseEditRoutePage() {
  const { courseId } = courseEditRoute.useParams();

  return (
    <AuthGuard allowedRoles={['instructor', 'admin']}>
      <CourseEditorPage courseId={courseId} />
    </AuthGuard>
  );
}

function CourseEditorPage({ courseId }: { courseId: string }) {
  const { course, chapters, isLoading, isNew } = useCourseEditor(courseId);
  const selectedLessonId = useCourseEditorStore((state) => state.selectedLessonId);

  const selectedLesson = chapters
    .flatMap((chapter) => chapter.lessons)
    .find((lesson) => lesson.id === selectedLessonId);

  if (isLoading) {
    return (
      <PageContainer>
        <p className="text-muted-foreground text-sm">Загрузка курса…</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6 py-8">
      <h1 className="text-foreground text-4xl leading-tight font-bold tracking-tight">
        {isNew ? 'Новый курс' : 'Редактирование курса'}
      </h1>

      <CourseMetaForm courseId={courseId} course={course} />

      {isNew ? (
        <p className="text-muted-foreground text-sm">
          Сохраните метаданные курса, чтобы начать добавлять главы и уроки.
        </p>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-80">
            <ChapterList courseId={courseId} chapters={chapters} />
          </aside>

          <section className="min-w-0 flex-1 space-y-4">
            {selectedLesson ? (
              // Изолирует сбой rich-text редактора/загрузки видео (тяжёлые
              // внешние библиотеки — TipTap, аплоад файла) от остального
              // редактора курса — список глав слева остаётся рабочим.
              <CatchBoundary
                getResetKey={() => selectedLesson.id}
                errorComponent={() => (
                  <WidgetErrorFallback title="Не удалось отобразить редактор урока" />
                )}
              >
                <Suspense fallback={<div className="bg-muted h-64 animate-pulse rounded-xl" />}>
                  <LessonEditor courseId={courseId} lesson={selectedLesson} />
                </Suspense>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg leading-snug tracking-tight">
                      Видео урока
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <VideoUpload courseId={courseId} lesson={selectedLesson} />
                  </CardContent>
                </Card>
              </CatchBoundary>
            ) : (
              <div className="text-muted-foreground rounded-xl border border-dashed p-12 text-center text-sm">
                Выберите урок слева или добавьте новый, чтобы редактировать его содержимое.
              </div>
            )}
          </section>
        </div>
      )}
    </PageContainer>
  );
}
