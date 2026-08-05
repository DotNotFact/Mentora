import { useQuery } from '@tanstack/react-query';
import { enrollmentsApi } from '@shared/api/client';

// Список курсов текущего пользователя с прогрессом — для /my-courses.
export function useEnrollments() {
  return useQuery({
    queryKey: ['enrollments', 'list'],
    queryFn: () => enrollmentsApi.listEnrollments(),
  });
}
