import { render, screen } from '@testing-library/react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
} from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';
import { CourseCard } from '@features/courses/components/course-card';
import type { Course } from '@shared/types/api';

const baseCourse: Course = {
  id: 'course-1',
  title: 'Основы TypeScript для продвинутых разработчиков веб-приложений',
  description: 'Полный курс по TypeScript.',
  price: 49.99,
  instructorId: 'instructor-1',
  instructorName: 'Иван Петров',
  category: 'development',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  createdAt: '2026-01-01T00:00:00.000Z',
};

function renderCourseCard(course: Course, progress?: number) {
  const rootRoute = createRootRoute();
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <CourseCard course={course} progress={progress} />,
  });
  const courseDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/courses/$courseId',
    component: () => <div>Страница курса</div>,
  });
  const routeTree = rootRoute.addChildren([indexRoute, courseDetailRoute]);
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });

  return render(<RouterProvider router={router} />);
}

describe('CourseCard', () => {
  it('renders title, instructor and formatted price', async () => {
    renderCourseCard(baseCourse);

    expect(await screen.findByText(baseCourse.title)).toBeInTheDocument();
    expect(screen.getByText(baseCourse.instructorName)).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
  });

  it('links to the course detail page', async () => {
    renderCourseCard(baseCourse);

    const link = await screen.findByRole('link');
    expect(link).toHaveAttribute('href', '/courses/course-1');
  });

  it('does not render a progress bar when progress is not provided (user not enrolled)', async () => {
    renderCourseCard(baseCourse);

    await screen.findByText(baseCourse.title);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('renders a progress bar with the rounded percentage when the user is enrolled', async () => {
    renderCourseCard(baseCourse, 42.4);

    expect(await screen.findByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Пройдено 42%')).toBeInTheDocument();
  });
});
