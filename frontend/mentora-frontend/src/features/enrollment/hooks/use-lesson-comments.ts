import { useQuery } from '@tanstack/react-query';
import { lessonsApi } from '@shared/api/client';

export const lessonCommentsKey = (lessonId: string) => ['lessons', 'comments', lessonId] as const;

// Обсуждение/Q&A под уроком — без real-time (см. schedule/19 → "Не
// входит"), обновление только при повторном заходе или ручном refetch.
export function useLessonComments(lessonId: string) {
  return useQuery({
    queryKey: lessonCommentsKey(lessonId),
    queryFn: () => lessonsApi.listLessonComments(lessonId),
    enabled: Boolean(lessonId),
  });
}
