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

function renderGuardedRoute(initialPath: string) {
  const rootRoute = createRootRoute();
  const protectedRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/protected',
    component: () => (
      <AuthGuard>
        <div>Секретный контент</div>
      </AuthGuard>
    ),
  });
  const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: () => <div>Страница входа</div>,
  });
  const routeTree = rootRoute.addChildren([protectedRoute, loginRoute]);
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
});
