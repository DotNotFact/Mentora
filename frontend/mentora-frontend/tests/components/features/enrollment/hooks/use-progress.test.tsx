import type { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useProgress } from '@features/enrollment/hooks/use-progress';
import { mockAxiosResponse } from '../../../../test-utils';

vi.mock('@shared/api/client', () => ({
  enrollmentsApi: { getCourseProgress: vi.fn() },
}));

import { enrollmentsApi } from '@shared/api/client';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not call the API when courseId is empty', () => {
    renderHook(() => useProgress(''), { wrapper });

    expect(enrollmentsApi.getCourseProgress).not.toHaveBeenCalled();
  });

  it('fetches course progress by courseId', async () => {
    vi.mocked(enrollmentsApi.getCourseProgress).mockResolvedValue(
      mockAxiosResponse({
        courseId: 'course-1',
        progressPercent: 42,
        lessons: [{ lessonId: 'lesson-1', completed: true, positionSeconds: 120 }],
      }),
    );

    const { result } = renderHook(() => useProgress('course-1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(enrollmentsApi.getCourseProgress).toHaveBeenCalledWith('course-1');
    expect(result.current.data?.data.progressPercent).toBe(42);
  });
});
