import { render, screen, waitFor } from '@testing-library/react';
import {
  createMemoryHistory,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { rootRoute } from '@app/routes/__root';
import { dashboardAdminRoute } from '@app/routes/dashboard/admin';
import { dashboardInstructorRoute } from '@app/routes/dashboard/instructor';
import { dashboardIndexRoute } from '@app/routes/dashboard/index';
import { useAuthStore } from '@features/auth/store';
import { mockAxiosResponse } from '../../../test-utils';

// Роуты дашбордов вызывают TanStack Query хуки поверх analyticsApi/
// enrollmentsApi — мокаем клиент, чтобы тесты роль-based доступа не делали
// реальных запросов (зеркалим tests/components/features/auth/hooks/use-login.test.tsx).
vi.mock('@shared/api/client', () => ({
  authApi: { login: vi.fn(), register: vi.fn(), logout: vi.fn() },
  analyticsApi: {
    getInstructorAnalytics: vi.fn(),
    getAdminAnalytics: vi.fn(),
  },
  enrollmentsApi: {
    listEnrollments: vi.fn(),
  },
}));

import { analyticsApi, enrollmentsApi } from '@shared/api/client';

function renderDashboardRoute(initialPath: string) {
  const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: () => <div>Страница входа</div>,
  });
  const routeTree = rootRoute.addChildren([
    dashboardIndexRoute,
    dashboardInstructorRoute,
    dashboardAdminRoute,
    loginRoute,
  ]);
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('dashboard route role-gating', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
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
    vi.mocked(analyticsApi.getAdminAnalytics).mockResolvedValue(
      mockAxiosResponse({
        totalRevenue: 0,
        totalUsers: 0,
        totalCourses: 0,
        totalEnrollments: 0,
        revenueChangePercent: 0,
        userGrowthPercent: 0,
        revenueByPeriod: [],
        enrollmentsByCourse: [],
      }),
    );
    vi.mocked(enrollmentsApi.listEnrollments).mockResolvedValue(mockAxiosResponse([]));
  });

  it('redirects unauthenticated users away from /dashboard to /login', async () => {
    renderDashboardRoute('/dashboard');

    await waitFor(() => expect(screen.getByText('Страница входа')).toBeInTheDocument());
  });

  it('allows a student to view /dashboard', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { id: '1', email: 's@example.com', fullName: 'Student', role: 'student' },
    });

    renderDashboardRoute('/dashboard');

    // dashboard/index.tsx переиспользует MyCoursesGrid (schedule/07) —
    // с пустым списком записей рендерит её канонический empty-state.
    await waitFor(() =>
      expect(screen.getByText('Вы пока не записаны ни на один курс')).toBeInTheDocument(),
    );
  });

  it('blocks a student from /dashboard/instructor and redirects home', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { id: '1', email: 's@example.com', fullName: 'Student', role: 'student' },
    });

    renderDashboardRoute('/dashboard/instructor');

    await waitFor(() =>
      expect(screen.queryByText('Аналитика инструктора')).not.toBeInTheDocument(),
    );
  });

  it('allows an instructor to view /dashboard/instructor', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { id: '2', email: 'i@example.com', fullName: 'Instructor', role: 'instructor' },
    });

    renderDashboardRoute('/dashboard/instructor');

    // InstructorDashboard — React.lazy (schedule/09, code-splitting) —
    // резолвинг динамического import() иногда не укладывается в дефолтный
    // таймаут waitFor.
    await waitFor(() => expect(screen.getByText('Аналитика инструктора')).toBeInTheDocument(), {
      timeout: 3000,
    });
  });

  it('blocks an instructor from /dashboard/admin and redirects home', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { id: '2', email: 'i@example.com', fullName: 'Instructor', role: 'instructor' },
    });

    renderDashboardRoute('/dashboard/admin');

    // getByRole('heading', ...), не getByText — с schedule/12 тот же текст
    // дублируется в пункте меню Sidebar (видимом только для admin).
    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: 'Аналитика платформы' })).not.toBeInTheDocument(),
    );
  });

  it('allows an admin to view /dashboard/admin', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { id: '3', email: 'a@example.com', fullName: 'Admin', role: 'admin' },
    });

    renderDashboardRoute('/dashboard/admin');

    // AdminDashboard — тоже React.lazy, см. комментарий выше. getByRole
    // ('heading', ...) — с schedule/12 текст дублируется в пункте меню.
    await waitFor(
      () =>
        expect(screen.getByRole('heading', { name: 'Аналитика платформы' })).toBeInTheDocument(),
      { timeout: 3000 },
    );
  });
});
