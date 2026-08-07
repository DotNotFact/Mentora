import type { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useReviews, useSubmitReview } from '@features/courses/hooks/use-reviews';
import type { Review } from '@shared/types/api';
import { mockAxiosResponse } from '../../../../test-utils';

vi.mock('@shared/api/client', () => ({
  coursesApi: {
    listCourseReviews: vi.fn(),
    createCourseReview: vi.fn(),
    updateCourseReview: vi.fn(),
  },
}));

import { coursesApi } from '@shared/api/client';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function makeReview(id: string): Review {
  return {
    id,
    courseId: 'course-1',
    userId: 'user-1',
    userName: 'Студент',
    rating: 5,
    comment: 'Отлично',
    createdAt: '2026-01-01T00:00:00.000Z',
  };
}

describe('useReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches reviews for the given course', async () => {
    vi.mocked(coursesApi.listCourseReviews).mockResolvedValue(
      mockAxiosResponse([makeReview('review-1')]),
    );

    const { result } = renderHook(() => useReviews('course-1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(coursesApi.listCourseReviews).toHaveBeenCalledWith('course-1');
    expect(result.current.data?.data).toHaveLength(1);
  });
});

describe('useSubmitReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a new review when no reviewId is given', async () => {
    vi.mocked(coursesApi.createCourseReview).mockResolvedValue(
      mockAxiosResponse(makeReview('review-1')),
    );

    const { result } = renderHook(() => useSubmitReview('course-1'), { wrapper });
    result.current.mutate({ rating: 5, comment: 'Отлично' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(coursesApi.createCourseReview).toHaveBeenCalledWith('course-1', {
      rating: 5,
      comment: 'Отлично',
    });
    expect(coursesApi.updateCourseReview).not.toHaveBeenCalled();
  });

  it('updates the existing review when a reviewId is given', async () => {
    vi.mocked(coursesApi.updateCourseReview).mockResolvedValue(
      mockAxiosResponse(makeReview('review-1')),
    );

    const { result } = renderHook(() => useSubmitReview('course-1', 'review-1'), { wrapper });
    result.current.mutate({ rating: 4, comment: 'Неплохо' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(coursesApi.updateCourseReview).toHaveBeenCalledWith('course-1', 'review-1', {
      rating: 4,
      comment: 'Неплохо',
    });
    expect(coursesApi.createCourseReview).not.toHaveBeenCalled();
  });
});
