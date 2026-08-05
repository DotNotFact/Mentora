import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@shared/api/client';
import type { Chapter } from '@shared/types/api';
import { courseEditorKeys } from './use-course-editor';

// Сохраняет всё дерево глав/уроков курса (PUT /courses/{courseId}/chapters)
// с оптимистичным обновлением кэша: порядок в UI меняется мгновенно после
// drag & drop (мышью или клавиатурой), запрос идёт в фоне; при ошибке —
// откат к предыдущему состоянию дерева.
export function useReorderChapters(courseId: string) {
  const queryClient = useQueryClient();
  const queryKey = courseEditorKeys.chapters(courseId);

  return useMutation({
    mutationFn: (chapters: Chapter[]) =>
      coursesApi.saveChapters(courseId, chapters).then((res) => res.data),
    onMutate: async (chapters) => {
      await queryClient.cancelQueries({ queryKey });
      const previousChapters = queryClient.getQueryData<Chapter[]>(queryKey);
      queryClient.setQueryData<Chapter[]>(queryKey, chapters);
      return { previousChapters };
    },
    onError: (_error, _chapters, context) => {
      if (context?.previousChapters) {
        queryClient.setQueryData(queryKey, context.previousChapters);
      }
    },
    onSuccess: (savedChapters) => {
      queryClient.setQueryData(queryKey, savedChapters);
    },
  });
}
