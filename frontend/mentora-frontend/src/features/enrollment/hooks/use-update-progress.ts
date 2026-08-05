import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsApi } from '@shared/api/client';
import { courseProgressKey } from './use-progress';

interface UpdateProgressInput {
  lessonId: string;
  positionSeconds: number;
  completed: boolean;
}

// Троттлинг/дебаунс вызовов — ответственность вызывающего компонента
// (VideoPlayer сохраняет позицию не чаще, чем раз в несколько секунд, и
// шлёт completed=true ровно один раз при пересечении 90%). Здесь — только
// сам запрос и обновление кэша агрегированным ответом сервера.
export function useUpdateProgress(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, positionSeconds, completed }: UpdateProgressInput) =>
      enrollmentsApi.updateLessonProgress(courseId, lessonId, { positionSeconds, completed }),
    onSuccess: (response) => {
      queryClient.setQueryData(courseProgressKey(courseId), response);
    },
  });
}
