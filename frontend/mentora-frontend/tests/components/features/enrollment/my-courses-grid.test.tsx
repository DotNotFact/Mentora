import { render, screen } from '@testing-library/react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MyCoursesGrid } from '@features/enrollment/components/my-courses-grid';
import type { EnrollmentWithCourse } from '@shared/types/api';
import { mockAxiosResponse } from '../../../test-utils';

vi.mock('@shared/api/client', () => ({
  enrollmentsApi: { listEnrollments: vi.fn() },
}));

import { enrollmentsApi } from '@shared/api/client';

const baseCourse: EnrollmentWithCourse['course'] = {
  id: 'course-1',
  title: 'Основы React',
  description: 'Полный курс по React.',
  price: 0,
  instructorId: 'instructor-1',
  instructorName: 'Иван Иванов',
  category: 'development',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  createdAt: '2026-01-01T00:00:00.000Z',
};

function renderMyCoursesGrid() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const rootRoute = createRootRoute();
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <MyCoursesGrid />,
  });
  const coursesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/courses',
    component: () => <div>Каталог курсов</div>,
  });
  const courseDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/courses/$courseId',
    component: () => <div>Страница курса</div>,
  });
  const routeTree = rootRoute.addChildren([indexRoute, coursesRoute, courseDetailRoute]);
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: ['/'] }) });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('MyCoursesGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows an empty state with a link to the catalog when the user has no enrollments', async () => {
    vi.mocked(enrollmentsApi.listEnrollments).mockResolvedValue(mockAxiosResponse([]));

    renderMyCoursesGrid();

    expect(await screen.findByText('Вы пока не записаны ни на один курс')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Открыть каталог' })).toHaveAttribute(
      'href',
      '/courses',
    );
  });

  it('renders a course card with progress for each enrollment', async () => {
    const enrollments: EnrollmentWithCourse[] = [
      { id: 'enrollment-1', courseId: 'course-1', userId: 'user-1', progress: 42.4, course: baseCourse },
    ];
    vi.mocked(enrollmentsApi.listEnrollments).mockResolvedValue(mockAxiosResponse(enrollments));

    renderMyCoursesGrid();

    expect(await screen.findByText(baseCourse.title)).toBeInTheDocument();
    expect(screen.getByText('Пройдено 42%')).toBeInTheDocument();
  });
});
