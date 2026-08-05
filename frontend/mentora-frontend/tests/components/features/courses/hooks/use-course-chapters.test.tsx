import type { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { useCourseChapters } from '@features/courses/hooks/use-course-chapters';
import { mockAxiosResponse } from '../../../../test-utils';

vi.mock('@shared/api/client', () => ({
  coursesApi: { listChapters: vi.fn() },
}));

import { coursesApi } from '@shared/api/client';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useCourseChapters', () => {
  it('does not call the API when courseId is empty', () => {
    renderHook(() => useCourseChapters(''), { wrapper });

    expect(coursesApi.listChapters).not.toHaveBeenCalled();
  });

  it('fetches the chapter/lesson tree for a course', async () => {
    vi.mocked(coursesApi.listChapters).mockResolvedValue(
      mockAxiosResponse([
        {
          id: 'chapter-1',
          courseId: 'course-1',
          title: 'Chapter 1',
          order: 0,
          lessons: [
            {
              id: 'lesson-1',
              chapterId: 'chapter-1',
              title: 'Lesson 1',
              order: 0,
              contentHtml: '',
              videoUrl: 'https://example.com/video.mp4',
            },
          ],
        },
      ]),
    );

    const { result } = renderHook(() => useCourseChapters('course-1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(coursesApi.listChapters).toHaveBeenCalledWith('course-1');
    expect(result.current.data?.data[0]?.lessons).toHaveLength(1);
  });
});
