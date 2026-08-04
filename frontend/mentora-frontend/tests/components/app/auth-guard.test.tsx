import { render, screen, waitFor } from '@testing-library/react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
} from '@tanstack/react-router';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthGuard } from '@app/auth-guard';
import { useAuthStore } from '@features/auth/store';
import type { UserRole } from '@shared/types/api';

function renderGuardedRoute(initialPath: string, allowedRoles?: UserRole[]) {
  const rootRoute = createRootRoute();
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <div>Главная</div>,
  });
  const protectedRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/protected',
    component: () => (
      <AuthGuard allowedRoles={allowedRoles}>
        <div>Секретный контент</div>
      </AuthGuard>
    ),
  });
  const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: () => <div>Страница входа</div>,
  });
  const routeTree = rootRoute.addChildren([indexRoute, protectedRoute, loginRoute]);
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });

  return render(<RouterProvider router={router} />);
}

describe('AuthGuard', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it('redirects to /login when not authenticated', async () => {
    renderGuardedRoute('/protected');

    await waitFor(() => {
      expect(screen.getByText('Страница входа')).toBeInTheDocument();
    });
    expect(screen.queryByText('Секретный контент')).not.toBeInTheDocument();
  });

  it('renders children when authenticated', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { id: '1', email: 'x@example.com', fullName: 'X', role: 'student' },
    });

    renderGuardedRoute('/protected');

    await waitFor(() => {
      expect(screen.getByText('Секретный контент')).toBeInTheDocument();
    });
  });

  it('renders children when the user has one of the allowed roles', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { id: '1', email: 'i@example.com', fullName: 'Instructor', role: 'instructor' },
    });

    renderGuardedRoute('/protected', ['instructor', 'admin']);

    await waitFor(() => {
      expect(screen.getByText('Секретный контент')).toBeInTheDocument();
    });
  });

  it('redirects to / when authenticated but role is not allowed', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { id: '1', email: 's@example.com', fullName: 'Student', role: 'student' },
    });

    renderGuardedRoute('/protected', ['instructor', 'admin']);

    await waitFor(() => {
      expect(screen.getByText('Главная')).toBeInTheDocument();
    });
    expect(screen.queryByText('Секретный контент')).not.toBeInTheDocument();
  });
});
