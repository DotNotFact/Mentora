import { create } from 'zustand';
import { defaultCourseFilters, type CourseFiltersValues } from './schemas';

export type CourseViewMode = 'grid' | 'list';

interface CoursesUiState {
  filters: CourseFiltersValues;
  viewMode: CourseViewMode;
  setFilters: (filters: CourseFiltersValues) => void;
  resetFilters: () => void;
  setViewMode: (viewMode: CourseViewMode) => void;
}

// Только UI-state каталога: текущие значения фильтров и вид отображения.
// Данные курсов (список/страница) — исключительно через TanStack Query
// (hooks/use-courses.ts, hooks/use-course.ts), сюда не дублируются.
export const useCoursesStore = create<CoursesUiState>()((set) => ({
  filters: defaultCourseFilters,
  viewMode: 'grid',
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: defaultCourseFilters }),
  setViewMode: (viewMode) => set({ viewMode }),
}));
