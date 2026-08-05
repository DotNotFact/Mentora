import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@shared/api/client';

// Структура курса (главы + вложенные уроки) — используется и редактором
// курса, и обучающим плеером, поэтому живёт в features/courses, а не
// дублируется в каждой фиче по отдельности.
export function useCourseChapters(courseId: string) {
  return useQuery({
    queryKey: ['courses', 'chapters', courseId],
    queryFn: () => coursesApi.listChapters(courseId),
    enabled: Boolean(courseId),
  });
}
