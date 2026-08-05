import { create } from 'zustand';

interface CourseEditorState {
  /** id выбранного урока (его контент отображается в LessonEditor справа). */
  selectedLessonId: string | null;
  /** id глав, которые сейчас развёрнуты в ChapterList (по умолчанию все свёрнуты). */
  expandedChapterIds: Set<string>;
  /** id элемента (главы или урока), который сейчас перетаскивается — для visual feedback (shadow-lg). */
  activeDragId: string | null;

  selectLesson: (lessonId: string | null) => void;
  toggleChapterExpanded: (chapterId: string) => void;
  expandChapter: (chapterId: string) => void;
  setActiveDragId: (id: string | null) => void;
  reset: () => void;
}

// Только UI-state редактора курса (что выбрано/развёрнуто/перетаскивается).
// Сами главы/уроки/метаданные курса — server-state, живут в TanStack Query
// (см. hooks/use-course-editor.ts) и никогда не дублируются здесь.
export const useCourseEditorStore = create<CourseEditorState>()((set) => ({
  selectedLessonId: null,
  expandedChapterIds: new Set<string>(),
  activeDragId: null,

  selectLesson: (lessonId) => set({ selectedLessonId: lessonId }),

  toggleChapterExpanded: (chapterId) =>
    set((state) => {
      const next = new Set(state.expandedChapterIds);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return { expandedChapterIds: next };
    }),

  expandChapter: (chapterId) =>
    set((state) => {
      if (state.expandedChapterIds.has(chapterId)) {
        return state;
      }
      const next = new Set(state.expandedChapterIds);
      next.add(chapterId);
      return { expandedChapterIds: next };
    }),

  setActiveDragId: (id) => set({ activeDragId: id }),

  reset: () => set({ selectedLessonId: null, expandedChapterIds: new Set(), activeDragId: null }),
}));
