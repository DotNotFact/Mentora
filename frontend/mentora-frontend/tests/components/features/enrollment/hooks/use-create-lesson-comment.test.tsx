import type { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCreateLessonComment } from '@features/enrollment/hooks/use-create-lesson-comment';
import type { Comment } from '@shared/types/api';
import { mockAxiosResponse } from '../../../../test-utils';

vi.mock('@shared/api/client', () => ({
  lessonsApi: { createLessonComment: vi.fn() },
}));

import { lessonsApi } from '@shared/api/client';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function makeComment(overrides: Partial<Comment> = {}): Comment {
  return {
    id: 'comment-1',
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

describe('useCreateLessonComment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('posts a top-level question without parentId', async () => {
    vi.mocked(lessonsApi.createLessonComment).mockResolvedValue(mockAxiosResponse(makeComment()));

    const { result } = renderHook(() => useCreateLessonComment('lesson-1'), { wrapper });
    result.current.mutate({ body: 'Вопрос по уроку' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(lessonsApi.createLessonComment).toHaveBeenCalledWith('lesson-1', {
      body: 'Вопрос по уроку',
    });
  });

  it('posts a reply with parentId', async () => {
    vi.mocked(lessonsApi.createLessonComment).mockResolvedValue(
      mockAxiosResponse(makeComment({ id: 'comment-2', parentId: 'comment-1' })),
    );

    const { result } = renderHook(() => useCreateLessonComment('lesson-1'), { wrapper });
    result.current.mutate({ body: 'Ответ на вопрос', parentId: 'comment-1' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(lessonsApi.createLessonComment).toHaveBeenCalledWith('lesson-1', {
      body: 'Ответ на вопрос',
      parentId: 'comment-1',
    });
  });
});
