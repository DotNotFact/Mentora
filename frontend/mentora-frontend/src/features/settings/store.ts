import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_THEME, type ThemeId } from '@shared/config/themes';

interface ThemeState {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

// Применяет тему на <html> сразу — источник истины для FOUC-предотвращения
// это инлайн-скрипт в index.html (см. schedule/11, шаг 5), этот вызов
// синхронизирует DOM при реактивной смене темы из UI и подстраховывает
// на случай гидратации стора после первого рендера.
function applyTheme(theme: ThemeId) {
  document.documentElement.setAttribute('data-theme', theme);
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: DEFAULT_THEME,
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
    }),
    {
      name: 'mentora-theme',
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      },
    },
  ),
);
