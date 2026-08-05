import { test, expect } from '@playwright/test';
import { installApiMocks } from './mocks/api';
import { seedSession } from './mocks/session';
import { createMockDb, SEED_COURSE_FREE, SEED_COURSE_PAID } from './mocks/db';

test.describe('чекаут и обучение', () => {
  test('запись на бесплатный курс → плеер → урок отмечается пройденным на 90%', async ({
    page,
  }) => {
    // Тест реально проигрывает ~10-секундное видео до 90% — дефолтных 30
    // сек на тест не хватает с учётом навигаций/загрузки страницы.
    test.setTimeout(60_000);

    const db = createMockDb();
    await installApiMocks(page, db);
    const student = {
      id: 'user-student-free',
      email: 'student-free@mentora.test',
      password: 'password123',
      fullName: 'Студент Тестов',
      role: 'student' as const,
    };
    db.users.push(student);
    await seedSession(page, student);

    await page.goto(`/courses/${SEED_COURSE_FREE.id}`);
    await page.getByRole('button', { name: 'Записаться бесплатно' }).click();
    await expect(page.getByRole('link', { name: 'Продолжить обучение' })).toBeVisible();

    await page.getByRole('link', { name: 'Продолжить обучение' }).click();
    await expect(page).toHaveURL(new RegExp(`/learning/${SEED_COURSE_FREE.id}$`));
    await expect(page.getByText('Прогресс курса')).toBeVisible();
    await expect(page.getByText('0%')).toBeVisible();

    // Проиграть урок целиком (~10 сек видео) — на 90% просмотра он должен
    // сам отметиться пройденным (реальная логика video-player.tsx +
    // lesson-progress.ts, не замокана). Плеер — веб-компонент с закрытым
    // shadow DOM (внутренние кнопки Playwright-локаторами не достать —
    // `.shadowRoot` даже из page-контекста возвращает null), поэтому
    // старт воспроизведения — через реальный публичный `.play()` на самом
    // элементе `<media-player>` (это тот же метод, что вызвал бы клик по
    // кнопке play изнутри community-skin — не подмена, а тот же API).
    // Дождаться `data-can-play` обязательно: play() до этого момента
    // бросает "[vidstack] media is not ready".
    await page.waitForFunction(
      () => document.querySelector('media-player')?.getAttribute('data-can-play') === 'true',
      { timeout: 15000 },
    );

    await page.evaluate(async () => {
      const player = document.querySelector('media-player') as HTMLMediaElement | null;
      // Без mute Chrome блокирует программный play() без жеста
      // пользователя (autoplay policy) — звук здесь не важен, важен факт
      // проигрывания для трекинга прогресса.
      if (player) player.muted = true;
      await player?.play();
    });

    await expect(page.getByText('100%')).toBeVisible({ timeout: 20000 });
    await expect(page.locator('nav[aria-label="Уроки курса"] svg.text-success')).toBeVisible();
  });

  test('оплата курса → возврат со Stripe → доступ к обучению', async ({ page }) => {
    const db = createMockDb();
    await installApiMocks(page, db);
    const student = {
      id: 'user-student-paid',
      email: 'student-paid@mentora.test',
      password: 'password123',
      fullName: 'Студент Платный',
      role: 'student' as const,
    };
    db.users.push(student);
    await seedSession(page, student);

    await page.goto(`/checkout/${SEED_COURSE_PAID.id}`);
    await page.getByRole('button', { name: 'Оплатить' }).click();

    // checkoutUrl из мока ведёт сразу на success-редирект того же
    // /checkout/:courseId (см. mocks/api.ts) — как будто пользователь уже
    // вернулся со Stripe.
    await expect(page).toHaveURL(/status=success/);
    await expect(page.getByText('Оплата прошла успешно')).toBeVisible();

    await page.getByRole('link', { name: 'Начать обучение' }).click();
    await expect(page).toHaveURL(new RegExp(`/learning/${SEED_COURSE_PAID.id}$`));
    await expect(page.getByText('Прогресс курса')).toBeVisible();
  });

  test('отменённая оплата возвращает на страницу курса без записи', async ({ page }) => {
    const db = createMockDb();
    await installApiMocks(page, db);
    const student = {
      id: 'user-student-cancel',
      email: 'student-cancel@mentora.test',
      password: 'password123',
      fullName: 'Студент Отмена',
      role: 'student' as const,
    };
    db.users.push(student);
    await seedSession(page, student);

    await page.goto(`/checkout/${SEED_COURSE_PAID.id}?status=cancel`);
    await expect(page.getByText('Оплата отменена')).toBeVisible();

    await page.getByRole('link', { name: 'Вернуться к курсу' }).click();
    await expect(page).toHaveURL(new RegExp(`/courses/${SEED_COURSE_PAID.id}$`));
    await expect(page.getByRole('link', { name: 'Записаться' })).toBeVisible();
  });
});
