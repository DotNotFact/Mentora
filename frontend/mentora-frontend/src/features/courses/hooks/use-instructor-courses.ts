import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@shared/api/client';

// Отдельный хук, не переиспользует useCourses (тот заточен под
// пагинированный каталог с фильтрами формы) — здесь плоский список
// без пагинации: у инструктора реалистично десятки, не сотни курсов,
// станицы управления "Мои курсы" не нужна.
const INSTRUCTOR_COURSES_PAGE_SIZE = 100;

export function useInstructorCourses(instructorId: string) {
  return useQuery({
    queryKey: ['courses', 'list', 'instructor', instructorId],
    queryFn: () =>
      coursesApi.listCourses({ instructorId, page: 1, pageSize: INSTRUCTOR_COURSES_PAGE_SIZE }),
    enabled: Boolean(instructorId),
  });
}
