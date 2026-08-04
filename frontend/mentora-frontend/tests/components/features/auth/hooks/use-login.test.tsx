import type { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLogin } from '@features/auth/hooks/use-login';
import { useAuthStore } from '@features/auth/store';
import { mockAxiosResponse } from '../../../../test-utils';

vi.mock('@shared/api/client', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

import { authApi } from '@shared/api/client';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useLogin', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
    vi.clearAllMocks();
  });

  it('calls authApi.login with form values and stores the session on success', async () => {
    vi.mocked(authApi.login).mockResolvedValue(
      mockAxiosResponse({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: { id: '1', email: 'x@example.com', fullName: 'X', role: 'student' },
      }),
    );

    const { result } = renderHook(() => useLogin(), { wrapper });

    result.current.mutate({ email: 'x@example.com', password: 'password123' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(authApi.login).toHaveBeenCalledWith({
      email: 'x@example.com',
      password: 'password123',
    });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.id).toBe('1');
  });

  it('does not touch the auth store when the API call fails', async () => {
    vi.mocked(authApi.login).mockRejectedValue(new Error('Unauthorized'));

    const { result } = renderHook(() => useLogin(), { wrapper });

    result.current.mutate({ email: 'x@example.com', password: 'wrong' });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
