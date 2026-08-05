import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChapterList } from '@features/course-editor/components/chapter-list';
import type { Chapter } from '@shared/types/api';
import { mockAxiosResponse } from '../../../test-utils';

vi.mock('@shared/api/client', () => ({
  coursesApi: {
    saveChapters: vi.fn(),
  },
}));

import { coursesApi } from '@shared/api/client';

// @dnd-kit measures droppable containers via getBoundingClientRect to
// compute keyboard-driven movement (sortableKeyboardCoordinates). jsdom
// returns an all-zero rect for every element by default, which makes every
// item overlap at the same point — mock a distinct vertical position per
// <li> based on its live position among siblings, so ArrowDown/ArrowUp
// resolve to the actual next/previous sortable item, exactly like in a
// real layout.
function mockSortableRects() {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    const empty = { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0, x: 0, y: 0 };
    if (this.tagName !== 'LI') {
      return { ...empty, toJSON: () => empty } as DOMRect;
    }
    const siblings = Array.from(this.parentElement?.children ?? []);
    const index = siblings.indexOf(this);
    const top = index * 60;
    const rect = { top, bottom: top + 56, left: 0, right: 320, width: 320, height: 56, x: 0, y: top };
    return { ...rect, toJSON: () => rect } as DOMRect;
  });
}

function renderChapterList(chapters: Chapter[]) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ChapterList courseId="course-1" chapters={chapters} />
    </QueryClientProvider>,
  );
}

function makeChapters(): Chapter[] {
  return [
    { id: 'ch-1', courseId: 'course-1', title: 'Введение', order: 0, lessons: [] },
    { id: 'ch-2', courseId: 'course-1', title: 'Основы', order: 1, lessons: [] },
  ];
}

describe('ChapterList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSortableRects();
    vi.mocked(coursesApi.saveChapters).mockResolvedValue(mockAxiosResponse(makeChapters()));
  });

  it('renders chapters with a keyboard-focusable drag handle each', () => {
    renderChapterList(makeChapters());

    expect(screen.getByLabelText('Перетащить главу «Введение»')).toBeInTheDocument();
    expect(screen.getByLabelText('Перетащить главу «Основы»')).toBeInTheDocument();
  });

  it('reorders chapters after a keyboard-driven drag (Space, ArrowDown, Space) and saves the new order', async () => {
    renderChapterList(makeChapters());

    const handle = screen.getByLabelText('Перетащить главу «Введение»');
    handle.focus();

    // Pick up (Space) → move down one position (ArrowDown) → drop (Space).
    // A tick between each key event is required: @dnd-kit recomputes the
    // active item's position/collisions asynchronously (rAF-scheduled),
    // so firing all three keydowns back-to-back races that internal state.
    fireEvent.keyDown(handle, { code: 'Space' });
    await waitFor(() => {});
    fireEvent.keyDown(handle, { code: 'ArrowDown' });
    await waitFor(() => {});
    fireEvent.keyDown(handle, { code: 'Space' });

    await waitFor(() => {
      expect(coursesApi.saveChapters).toHaveBeenCalledTimes(1);
    });

    const [, savedChapters] = vi.mocked(coursesApi.saveChapters).mock.calls[0];
    expect(savedChapters.map((chapter) => chapter.id)).toEqual(['ch-2', 'ch-1']);
    expect(savedChapters.map((chapter) => chapter.order)).toEqual([0, 1]);
  });

  it('shows an empty state and no drag context when there are no chapters', () => {
    renderChapterList([]);

    expect(screen.getByText('Пока нет глав — добавьте первую.')).toBeInTheDocument();
  });
});
