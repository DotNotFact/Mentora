import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RegisterForm } from '@features/auth/components/register-form';
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

describe('RegisterForm', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
    vi.clearAllMocks();
  });

  it('shows validation errors and does not call the API on empty submit', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<RegisterForm />);

    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

    expect(await screen.findByText('Минимум 2 символа')).toBeInTheDocument();
    expect(screen.getByText('Введите email')).toBeInTheDocument();
    expect(authApi.register).not.toHaveBeenCalled();
  });

  it('submits valid data and stores the session on success', async () => {
    vi.mocked(authApi.register).mockResolvedValue(
      mockAxiosResponse({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: '2',
          email: 'new@example.com',
          fullName: 'Новый Пользователь',
          role: 'student',
        },
      }),
    );

    const user = userEvent.setup();
    renderWithQueryClient(<RegisterForm />);

    await user.type(screen.getByLabelText('Имя'), 'Новый Пользователь');
    await user.type(screen.getByLabelText('Email'), 'new@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
    expect(useAuthStore.getState().user?.fullName).toBe('Новый Пользователь');
  });

  it('shows an error message when the API call fails', async () => {
    vi.mocked(authApi.register).mockRejectedValue(new Error('Conflict'));

    const user = userEvent.setup();
    renderWithQueryClient(<RegisterForm />);

    await user.type(screen.getByLabelText('Имя'), 'Дубликат Пользователь');
    await user.type(screen.getByLabelText('Email'), 'taken@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Не удалось зарегистрироваться: возможно, email уже занят.',
    );
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
