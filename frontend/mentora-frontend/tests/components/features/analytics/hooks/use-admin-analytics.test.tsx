import type { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { useAdminAnalytics } from '@features/analytics/hooks/use-admin-analytics';
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

describe('useAdminAnalytics', () => {
  it('requests platform analytics for the given period and exposes the response data', async () => {
    vi.mocked(analyticsApi.getAdminAnalytics).mockResolvedValue(
      mockAxiosResponse({
        totalRevenue: 100000,
        totalUsers: 3200,
        totalCourses: 84,
        totalEnrollments: 5400,
        revenueChangePercent: 4.2,
        userGrowthPercent: 1.1,
        revenueByPeriod: [{ date: '2026-07-01', amount: 3000 }],
        enrollmentsByCourse: [{ courseId: '1', courseTitle: 'React', enrollments: 120 }],
      }),
    );

    const { result } = renderHook(() => useAdminAnalytics('90d'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(analyticsApi.getAdminAnalytics).toHaveBeenCalledWith({ period: '90d' });
    expect(result.current.data?.totalUsers).toBe(3200);
  });

  it('surfaces API errors', async () => {
    vi.mocked(analyticsApi.getAdminAnalytics).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAdminAnalytics('30d'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
