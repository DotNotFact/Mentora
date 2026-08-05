import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@shared/api/client';

export function useCourse(courseId: string) {
  return useQuery({
    queryKey: ['courses', 'detail', courseId],
    queryFn: () => coursesApi.getCourse(courseId),
    enabled: Boolean(courseId),
  });
}
