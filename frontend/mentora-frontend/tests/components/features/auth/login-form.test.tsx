import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginForm } from '@features/auth/components/login-form';
import { useAuthStore } from '@features/auth/store';
import { renderWithQueryClient, mockAxiosResponse } from '../../../test-utils';

vi.mock('@shared/api/client', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

import { authApi } from '@shared/api/client';

describe('LoginForm', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
    vi.clearAllMocks();
  });

  it('shows validation errors and does not call the API on empty submit', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<LoginForm />);

    await user.click(screen.getByRole('button', { name: 'Войти' }));

    expect(await screen.findByText('Введите email')).toBeInTheDocument();
    expect(screen.getByText('Минимум 8 символов')).toBeInTheDocument();
    expect(authApi.login).not.toHaveBeenCalled();
  });

  it('submits valid credentials and stores the session on success', async () => {
    vi.mocked(authApi.login).mockResolvedValue(
      mockAxiosResponse({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: '1',
          email: 'student@example.com',
          fullName: 'Студент Тестов',
          role: 'student',
        },
      }),
    );

    const user = userEvent.setup();
    renderWithQueryClient(<LoginForm />);

    await user.type(screen.getByLabelText('Email'), 'student@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
    expect(useAuthStore.getState().user?.fullName).toBe('Студент Тестов');
  });

  it('shows an error message when the API call fails', async () => {
    vi.mocked(authApi.login).mockRejectedValue(new Error('Unauthorized'));

    const user = userEvent.setup();
    renderWithQueryClient(<LoginForm />);

    await user.type(screen.getByLabelText('Email'), 'student@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'wrong-password');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Не удалось войти: проверьте email и пароль.',
    );
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
