import type { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useUpdateProgress } from '@features/enrollment/hooks/use-update-progress';
import { useProgress } from '@features/enrollment/hooks/use-progress';
import { mockAxiosResponse } from '../../../../test-utils';

vi.mock('@shared/api/client', () => ({
  enrollmentsApi: { getCourseProgress: vi.fn(), updateLessonProgress: vi.fn() },
}));

import { enrollmentsApi } from '@shared/api/client';

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }
  return { Wrapper, queryClient };
}

describe('useUpdateProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends lessonId/positionSeconds/completed to the API', async () => {
    vi.mocked(enrollmentsApi.updateLessonProgress).mockResolvedValue(
      mockAxiosResponse({ courseId: 'course-1', progressPercent: 50, lessons: [] }),
    );
    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useUpdateProgress('course-1'), { wrapper: Wrapper });
    result.current.mutate({ lessonId: 'lesson-1', positionSeconds: 42, completed: false });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(enrollmentsApi.updateLessonProgress).toHaveBeenCalledWith('course-1', 'lesson-1', {
      positionSeconds: 42,
      completed: false,
    });
  });

  it('replaces the course-progress query cache with the returned aggregate', async () => {
    vi.mocked(enrollmentsApi.getCourseProgress).mockResolvedValue(
      mockAxiosResponse({ courseId: 'course-1', progressPercent: 10, lessons: [] }),
    );
    vi.mocked(enrollmentsApi.updateLessonProgress).mockResolvedValue(
      mockAxiosResponse({
        courseId: 'course-1',
        progressPercent: 55,
        lessons: [{ lessonId: 'lesson-1', completed: true, positionSeconds: 200 }],
      }),
    );
    const { Wrapper } = createWrapper();

    const { result } = renderHook(
      () => ({ progress: useProgress('course-1'), update: useUpdateProgress('course-1') }),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(result.current.progress.data?.data.progressPercent).toBe(10));

    result.current.update.mutate({ lessonId: 'lesson-1', positionSeconds: 200, completed: true });

    await waitFor(() => expect(result.current.progress.data?.data.progressPercent).toBe(55));
  });
});
