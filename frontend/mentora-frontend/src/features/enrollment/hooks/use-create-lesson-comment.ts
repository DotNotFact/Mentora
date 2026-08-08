import { useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonsApi } from '@shared/api/client';
import { lessonCommentsKey } from './use-lesson-comments';

interface CreateLessonCommentInput {
  body: string;
  parentId?: string;
}

// Один хук на вопрос и на ответ — оба POST /lessons/{id}/comments,
// разница только в наличии parentId (см. openapi.yaml, CommentRequest).
export function useCreateLessonComment(lessonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateLessonCommentInput) =>
      lessonsApi.createLessonComment(lessonId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonCommentsKey(lessonId) });
    },
  });
}
