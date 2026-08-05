import type { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { useInstructorAnalytics } from '@features/analytics/hooks/use-instructor-analytics';
import { mockAxiosResponse } from '../../../../test-utils';

vi.mock('@shared/api/client', () => ({
  analyticsApi: {
    getInstructorAnalytics: vi.fn(),
    getAdminAnalytics: vi.fn(),
  },
}));

import { analyticsApi } from '@shared/api/client';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useInstructorAnalytics', () => {
  it('requests analytics for the given period and exposes the response data', async () => {
    vi.mocked(analyticsApi.getInstructorAnalytics).mockResolvedValue(
      mockAxiosResponse({
        totalRevenue: 5000,
        totalEnrollments: 120,
        revenueChangePercent: 8.5,
        enrollmentsChangePercent: -2.1,
        revenueByPeriod: [{ date: '2026-07-01', amount: 500 }],
        enrollmentsByCourse: [{ courseId: '1', courseTitle: 'React', enrollments: 12 }],
      }),
    );

    const { result } = renderHook(() => useInstructorAnalytics('7d'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(analyticsApi.getInstructorAnalytics).toHaveBeenCalledWith({ period: '7d' });
    expect(result.current.data?.totalRevenue).toBe(5000);
    expect(result.current.data?.enrollmentsByCourse).toHaveLength(1);
  });

  it('defaults to the 30d period when none is provided', async () => {
    vi.mocked(analyticsApi.getInstructorAnalytics).mockResolvedValue(
      mockAxiosResponse({
        totalRevenue: 0,
        totalEnrollments: 0,
        revenueChangePercent: 0,
        enrollmentsChangePercent: 0,
        revenueByPeriod: [],
        enrollmentsByCourse: [],
      }),
    );

    const { result } = renderHook(() => useInstructorAnalytics(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(analyticsApi.getInstructorAnalytics).toHaveBeenCalledWith({ period: '30d' });
  });

  it('surfaces API errors', async () => {
    vi.mocked(analyticsApi.getInstructorAnalytics).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useInstructorAnalytics('90d'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
