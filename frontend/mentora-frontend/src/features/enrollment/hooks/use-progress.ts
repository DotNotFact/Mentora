import { useQuery } from '@tanstack/react-query';
import { enrollmentsApi } from '@shared/api/client';

export const courseProgressKey = (courseId: string) => ['enrollments', 'progress', courseId] as const;

// Прогресс по урокам конкретного курса — источник для LessonSidebar
// (отметки пройден/не пройден) и восстановления позиции воспроизведения
// после обновления страницы.
export function useProgress(courseId: string) {
  return useQuery({
    queryKey: courseProgressKey(courseId),
    queryFn: () => enrollmentsApi.getCourseProgress(courseId),
    enabled: Boolean(courseId),
  });
}
