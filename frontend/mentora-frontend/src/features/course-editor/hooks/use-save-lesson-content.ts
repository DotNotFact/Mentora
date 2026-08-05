import { useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonsApi } from '@shared/api/client';
import type { Chapter } from '@shared/types/api';
import { courseEditorKeys } from './use-course-editor';

// Сохраняет rich-text содержимое урока (PUT /lessons/{lessonId}/content) и
// патчит уже загруженное дерево глав в кэше, чтобы при повторном открытии
// LessonEditor контент рендерился без лишнего рефетча.
export function useSaveLessonContent(courseId: string, lessonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentHtml: string) =>
      lessonsApi.saveLessonContent(lessonId, { contentHtml }).then((res) => res.data),
    onSuccess: (savedLesson) => {
      queryClient.setQueryData<Chapter[]>(courseEditorKeys.chapters(courseId), (chapters) =>
        chapters?.map((chapter) => ({
          ...chapter,
          lessons: chapter.lessons.map((lesson) =>
            lesson.id === savedLesson.id ? savedLesson : lesson,
          ),
        })),
      );
    },
  });
}
