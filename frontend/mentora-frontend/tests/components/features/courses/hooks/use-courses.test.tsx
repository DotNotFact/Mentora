import type { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCourses } from '@features/courses/hooks/use-courses';
import { defaultCourseFilters } from '@features/courses/schemas';
import type { Course, CourseCategory } from '@shared/types/api';
import { mockAxiosResponse } from '../../../../test-utils';

vi.mock('@shared/api/client', () => ({
  coursesApi: {
    listCourses: vi.fn(),
    getCourse: vi.fn(),
  },
}));

import { coursesApi } from '@shared/api/client';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function makeCourse(id: string, category: CourseCategory = 'development'): Course {
  return {
    id,
    title: `Course ${id}`,
    description: 'desc',
    price: 10,
    instructorId: 'instructor-1',
    instructorName: 'Instructor',
    category,
    thumbnailUrl: 'https://example.com/thumb.jpg',
    createdAt: '2026-01-01T00:00:00.000Z',
  };
}

describe('useCourses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls the API with page/pageSize and the mapped, non-empty filters', async () => {
    vi.mocked(coursesApi.listCourses).mockResolvedValue(
      mockAxiosResponse({ items: [makeCourse('1')], total: 1, page: 1, pageSize: 12 }),
    );

    const { result } = renderHook(
      () =>
        useCourses({
          ...defaultCourseFilters,
          search: '  react  ',
          category: 'development',
          priceMin: '10',
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(coursesApi.listCourses).toHaveBeenCalledWith({
      page: 1,
      pageSize: 12,
      search: 'react',
      category: 'development',
      priceMin: 10,
    });
    expect(result.current.data?.pages[0]?.data.items).toHaveLength(1);
  });

  it('omits empty filter fields entirely instead of sending empty strings', async () => {
    vi.mocked(coursesApi.listCourses).mockResolvedValue(
      mockAxiosResponse({ items: [], total: 0, page: 1, pageSize: 12 }),
    );

    const { result } = renderHook(() => useCourses(defaultCourseFilters), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(coursesApi.listCourses).toHaveBeenCalledWith({ page: 1, pageSize: 12 });
  });

  it('paginates via fetchNextPage and reports hasNextPage correctly', async () => {
    vi.mocked(coursesApi.listCourses)
      .mockResolvedValueOnce(
        mockAxiosResponse({ items: [makeCourse('1')], total: 2, page: 1, pageSize: 1 }),
      )
      .mockResolvedValueOnce(
        mockAxiosResponse({ items: [makeCourse('2')], total: 2, page: 2, pageSize: 1 }),
      );

    const { result } = renderHook(() => useCourses(defaultCourseFilters, { pageSize: 1 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(true);

    await result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(coursesApi.listCourses).toHaveBeenLastCalledWith({ page: 2, pageSize: 1 });
    expect(result.current.hasNextPage).toBe(false);
  });
});
