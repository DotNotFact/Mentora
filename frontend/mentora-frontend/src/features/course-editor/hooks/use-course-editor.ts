import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@shared/api/client';

// Сентинел-id в /courses/edit/$courseId для режима "создать новый курс" —
// пока курс не создан (POST /courses), запросы курса/глав не запускаются.
export const NEW_COURSE_ID = 'new';

export const courseEditorKeys = {
  course: (courseId: string) => ['course-editor', 'course', courseId] as const,
  chapters: (courseId: string) => ['course-editor', 'chapters', courseId] as const,
};

// Загрузка курса для редактирования: метаданные + дерево глав/уроков.
// В режиме создания (courseId === NEW_COURSE_ID) запросы не выполняются —
// форма метаданных стартует с пустых значений, дерево глав пустое.
export function useCourseEditor(courseId: string) {
  const isNew = courseId === NEW_COURSE_ID;

  const courseQuery = useQuery({
    queryKey: courseEditorKeys.course(courseId),
    queryFn: () => coursesApi.getCourse(courseId).then((res) => res.data),
    enabled: !isNew,
  });

  const chaptersQuery = useQuery({
    queryKey: courseEditorKeys.chapters(courseId),
    queryFn: () => coursesApi.listChapters(courseId).then((res) => res.data),
    enabled: !isNew,
  });

  return {
    isNew,
    course: courseQuery.data ?? null,
    chapters: chaptersQuery.data ?? [],
    isLoading: !isNew && (courseQuery.isLoading || chaptersQuery.isLoading),
    isError: courseQuery.isError || chaptersQuery.isError,
  };
}
