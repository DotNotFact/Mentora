import type { Page } from '@playwright/test';
import type { MockUser } from './db';

// Сажает уже залогиненную сессию в localStorage (тот же формат, что
// zustand/persist пишет в features/auth/store.ts + shared/lib/token-storage.ts),
// минуя форму логина — для тестов, где сам вход не является предметом
// проверки (checkout/learning, dashboard-гейтинг, редактор курса).
export async function seedSession(page: Page, user: MockUser) {
  await page.addInitScript(
    (session) => {
      localStorage.setItem(
        'mentora-auth',
        JSON.stringify({ state: { user: session.user, isAuthenticated: true }, version: 0 }),
      );
      localStorage.setItem('mentora.accessToken', session.accessToken);
      localStorage.setItem('mentora.refreshToken', session.refreshToken);
    },
    {
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
      accessToken: `mock-access:${user.id}`,
      refreshToken: `mock-refresh:${user.id}`,
    },
  );
}
