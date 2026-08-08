import type { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLessonComments } from '@features/enrollment/hooks/use-lesson-comments';
import type { Comment } from '@shared/types/api';
import { mockAxiosResponse } from '../../../../test-utils';

vi.mock('@shared/api/client', () => ({
  lessonsApi: { listLessonComments: vi.fn() },
}));

import { lessonsApi } from '@shared/api/client';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function makeComment(id: string, overrides: Partial<Comment> = {}): Comment {
  return {
    id,
    lessonId: 'lesson-1',
    userId: 'user-1',
    userName: 'Студент',
    userRole: 'student',
    parentId: null,
    body: 'Вопрос по уроку',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('useLessonComments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not call the API when lessonId is empty', () => {
    renderHook(() => useLessonComments(''), { wrapper });

    expect(lessonsApi.listLessonComments).not.toHaveBeenCalled();
  });

  it('fetches comments for the given lesson', async () => {
    vi.mocked(lessonsApi.listLessonComments).mockResolvedValue(
      mockAxiosResponse([makeComment('comment-1')]),
    );

    const { result } = renderHook(() => useLessonComments('lesson-1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(lessonsApi.listLessonComments).toHaveBeenCalledWith('lesson-1');
    expect(result.current.data?.data).toHaveLength(1);
  });
});
