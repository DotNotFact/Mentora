// Реестр готовых тем — см. schedule/11-settings-personalization.md и
// --theme-* переменные в src/styles/globals.css (там же — фактические
// значения токенов). Здесь только метаданные для UI выбора темы
// (id/название/превью-цвета), не сами CSS-значения — чтобы не дублировать
// палитру в двух местах.

export type ThemeId = 'dark-indigo' | 'dark-green' | 'dark-red' | 'dark-purple' | 'light-indigo';

export const DEFAULT_THEME: ThemeId = 'dark-purple';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  /** 'dark' | 'light' — для независимого переключателя режима в UI. */
  mode: 'dark' | 'light';
  /** Превью-свотчи для карточки выбора темы: фон и акцентный (primary) цвет. */
  previewBackground: string;
  previewPrimary: string;
}

export const THEMES: ThemeOption[] = [
  {
    id: 'dark-purple',
    name: 'Тёмная — фиолетовая',
    mode: 'dark',
    previewBackground: '#262624',
    previewPrimary: '#8b5cf6',
  },
  {
    id: 'dark-indigo',
    name: 'Тёмная — индиго',
    mode: 'dark',
    previewBackground: '#020617',
    previewPrimary: '#6366f1',
  },
  {
    id: 'dark-green',
    name: 'Тёмная — зелёная',
    mode: 'dark',
    previewBackground: '#020617',
    previewPrimary: '#10b981',
  },
  {
    id: 'dark-red',
    name: 'Тёмная — красная',
    mode: 'dark',
    previewBackground: '#020617',
    previewPrimary: '#f43f5e',
  },
  {
    id: 'light-indigo',
    name: 'Светлая — индиго',
    mode: 'light',
    previewBackground: '#f8fafc',
    previewPrimary: '#6366f1',
  },
];

export function isThemeId(value: string): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}
