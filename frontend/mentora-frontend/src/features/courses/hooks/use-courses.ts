import { useInfiniteQuery } from '@tanstack/react-query';
import { coursesApi } from '@shared/api/client';
import type { ListCoursesParams } from '@shared/types/api';
import type { CourseFiltersValues } from '../schemas';

export const COURSES_PAGE_SIZE = 12;

// Отбрасывает пустые/дефолтные значения фильтров, чтобы не засорять
// query-параметры и, как следствие, ключ кэша React Query.
function toListCoursesParams(
  filters: CourseFiltersValues,
): Omit<ListCoursesParams, 'page' | 'pageSize'> {
  return {
    search: filters.search.trim() || undefined,
    category: filters.category || undefined,
    priceMin: filters.priceMin === '' ? undefined : Number(filters.priceMin),
    priceMax: filters.priceMax === '' ? undefined : Number(filters.priceMax),
    sort: filters.sort || undefined,
  };
}

interface UseCoursesOptions {
  /** Переопределяет размер страницы (например, для превью на главной). */
  pageSize?: number;
}

export function useCourses(filters: CourseFiltersValues, options: UseCoursesOptions = {}) {
  const pageSize = options.pageSize ?? COURSES_PAGE_SIZE;

  return useInfiniteQuery({
    queryKey: ['courses', 'list', filters, pageSize],
    queryFn: ({ pageParam }) =>
      coursesApi.listCourses({
        page: pageParam,
        pageSize,
        ...toListCoursesParams(filters),
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, pageSize: responsePageSize, total } = lastPage.data;
      return page * responsePageSize < total ? page + 1 : undefined;
    },
  });
}
