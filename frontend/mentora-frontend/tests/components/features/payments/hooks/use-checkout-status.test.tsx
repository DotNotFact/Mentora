import type { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCheckoutStatus } from '@features/payments/hooks/use-checkout-status';
import type { CheckoutSessionStatusValue } from '@shared/types/api';
import { mockAxiosResponse } from '../../../../test-utils';

vi.mock('@shared/api/client', () => ({
  paymentsApi: { getCheckoutSessionStatus: vi.fn() },
}));

import { paymentsApi } from '@shared/api/client';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function makeStatus(status: CheckoutSessionStatusValue) {
  return mockAxiosResponse({ sessionId: 'sess-1', courseId: 'course-1', status });
}

describe('useCheckoutStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not call the API when sessionId is not provided', () => {
    renderHook(() => useCheckoutStatus(undefined), { wrapper });

    expect(paymentsApi.getCheckoutSessionStatus).not.toHaveBeenCalled();
  });

  it('reflects a pending session status', async () => {
    vi.mocked(paymentsApi.getCheckoutSessionStatus).mockResolvedValue(makeStatus('pending'));

    const { result } = renderHook(() => useCheckoutStatus('sess-1'), { wrapper });

    await waitFor(() => expect(result.current.data?.data.status).toBe('pending'));
    expect(paymentsApi.getCheckoutSessionStatus).toHaveBeenCalledWith('sess-1');
  });

  it('reflects the completed terminal status', async () => {
    vi.mocked(paymentsApi.getCheckoutSessionStatus).mockResolvedValue(makeStatus('completed'));

    const { result } = renderHook(() => useCheckoutStatus('sess-1'), { wrapper });

    await waitFor(() => expect(result.current.data?.data.status).toBe('completed'));
  });

  it('reflects the failed terminal status', async () => {
    vi.mocked(paymentsApi.getCheckoutSessionStatus).mockResolvedValue(makeStatus('failed'));

    const { result } = renderHook(() => useCheckoutStatus('sess-1'), { wrapper });

    await waitFor(() => expect(result.current.data?.data.status).toBe('failed'));
  });
});
