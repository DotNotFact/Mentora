import { create } from 'zustand';

interface EnrollmentState {
  /** Выбранный урок на странице обучения — чисто UI-state, не сервер-стейт. */
  currentLessonId: string | null;
  setCurrentLessonId: (lessonId: string | null) => void;
}

export const useEnrollmentStore = create<EnrollmentState>((set) => ({
  currentLessonId: null,
  setCurrentLessonId: (lessonId) => set({ currentLessonId: lessonId }),
}));
