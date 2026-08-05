import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CourseMetaForm } from '@features/course-editor/components/course-meta-form';
import type { Course } from '@shared/types/api';
import { renderWithQueryClient, mockAxiosResponse } from '../../../test-utils';

vi.mock('@shared/api/client', () => ({
  coursesApi: {
    createCourse: vi.fn(),
    updateCourse: vi.fn(),
    getCourse: vi.fn(),
    listChapters: vi.fn(),
    saveChapters: vi.fn(),
  },
}));

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>();
  return { ...actual, useNavigate: () => vi.fn() };
});

import { coursesApi } from '@shared/api/client';

const EXISTING_COURSE: Course = {
  id: 'course-1',
  title: 'React с нуля',
  description: 'Полный курс по React для начинающих разработчиков.',
  price: 49.99,
  category: 'design',
  instructorId: 'instructor-1',
};

describe('CourseMetaForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows validation errors and does not call the API on empty submit', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<CourseMetaForm courseId="new" course={null} />);

    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(await screen.findByText('Минимум 3 символа')).toBeInTheDocument();
    expect(screen.getByText('Минимум 10 символов')).toBeInTheDocument();
    // "Выберите категорию" появляется дважды: как placeholder внутри Select
    // (span) и как FormMessage под полем (p) — уточняем тегом сообщения.
    expect(screen.getByText('Выберите категорию', { selector: 'p' })).toBeInTheDocument();
    expect(coursesApi.createCourse).not.toHaveBeenCalled();
    expect(coursesApi.updateCourse).not.toHaveBeenCalled();
  });

  it('submits valid metadata for an existing course and shows a success message', async () => {
    vi.mocked(coursesApi.updateCourse).mockResolvedValue(
      mockAxiosResponse({ ...EXISTING_COURSE, title: 'React с нуля (обновлено)' }),
    );

    const user = userEvent.setup();
    renderWithQueryClient(<CourseMetaForm courseId="course-1" course={EXISTING_COURSE} />);

    const titleInput = screen.getByLabelText('Название');
    await user.clear(titleInput);
    await user.type(titleInput, 'React с нуля (обновлено)');

    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    await waitFor(() => {
      expect(coursesApi.updateCourse).toHaveBeenCalledWith('course-1', {
        title: 'React с нуля (обновлено)',
        description: EXISTING_COURSE.description,
        price: EXISTING_COURSE.price,
        category: EXISTING_COURSE.category,
      });
    });
    expect(await screen.findByText('Сохранено.')).toBeInTheDocument();
    expect(coursesApi.createCourse).not.toHaveBeenCalled();
  });

  it('shows an error message when the API call fails', async () => {
    vi.mocked(coursesApi.updateCourse).mockRejectedValue(new Error('Network error'));

    const user = userEvent.setup();
    renderWithQueryClient(<CourseMetaForm courseId="course-1" course={EXISTING_COURSE} />);

    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Не удалось сохранить курс. Попробуйте ещё раз.',
    );
  });
});
