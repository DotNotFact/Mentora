import { test, expect } from '@playwright/test';
import { installApiMocks } from './mocks/api';
import { seedSession } from './mocks/session';
import { createMockDb, SEED_COURSE_FREE } from './mocks/db';

test.describe('отзывы и рейтинги', () => {
  test('незаписанный пользователь видит отзывы, но не форму', async ({ page }) => {
    const db = createMockDb();
    await installApiMocks(page, db);
    const student = {
      id: 'user-student-outsider',
      email: 'outsider@mentora.test',
      password: 'password123',
      fullName: 'Сторонний Студент',
      role: 'student' as const,
    };
    db.users.push(student);
    await seedSession(page, student);

    await page.goto(`/courses/${SEED_COURSE_FREE.id}`);

    await expect(page.getByRole('heading', { name: 'Отзывы' })).toBeVisible();
    await expect(page.getByText('Пока нет отзывов')).toBeVisible();
    await expect(page.getByRole('radiogroup', { name: 'Оценка' })).not.toBeVisible();
  });

  test('записанный пользователь оставляет отзыв → рейтинг появляется у курса', async ({
    page,
  }) => {
    const db = createMockDb();
    await installApiMocks(page, db);
    const student = {
      id: 'user-student-reviewer',
      email: 'reviewer@mentora.test',
      password: 'password123',
      fullName: 'Автор Отзыва',
      role: 'student' as const,
    };
    db.users.push(student);
    db.enrollments.push({
      id: 'enrollment-review-test',
      courseId: SEED_COURSE_FREE.id,
      userId: student.id,
      progress: 0,
    });
    await seedSession(page, student);

    await page.goto(`/courses/${SEED_COURSE_FREE.id}`);

    await expect(page.getByRole('radiogroup', { name: 'Оценка' })).toBeVisible();
    await page.getByRole('radio', { name: '5 из 5' }).click();
    await page.getByPlaceholder('Что понравилось или не понравилось в курсе?').fill('Отличный курс!');
    await page.getByRole('button', { name: 'Опубликовать отзыв' }).click();

    await expect(page.getByText('Автор Отзыва')).toBeVisible();
    await expect(page.getByText('Отличный курс!')).toBeVisible();
    await expect(page.getByLabel(/Рейтинг 5 из 5, 1 отзывов/)).toBeVisible();

    // Повторная отправка — редактирование существующего отзыва, не новый
    // (счётчик отзывов в агрегированном рейтинге остаётся 1, а не растёт до 2).
    await page.getByRole('button', { name: 'Сохранить изменения' }).click();
    await expect(page.getByLabel(/Рейтинг 5 из 5, 1 отзывов/)).toBeVisible();
  });

  test('сортировка каталога "По рейтингу" работает', async ({ page }) => {
    const db = createMockDb();
    await installApiMocks(page, db);
    db.reviews[SEED_COURSE_FREE.id] = [
      {
        id: 'review-seed-1',
        courseId: SEED_COURSE_FREE.id,
        userId: 'user-instructor',
        userName: 'Инструктор Курсов',
        rating: 5,
        comment: null,
        createdAt: new Date().toISOString(),
      },
    ];

    await page.goto('/courses');
    await expect(page.getByText(SEED_COURSE_FREE.title)).toBeVisible();

    await page.getByLabel('Сортировка').click();
    await page.getByRole('option', { name: 'По рейтингу' }).click();

    await expect(page.getByText(SEED_COURSE_FREE.title)).toBeVisible();
  });
});
