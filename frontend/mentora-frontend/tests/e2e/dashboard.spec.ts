import { test, expect } from '@playwright/test';
import { installApiMocks } from './mocks/api';
import { seedSession } from './mocks/session';
import { SEED_ADMIN, SEED_INSTRUCTOR } from './mocks/db';

const STUDENT = {
  id: 'user-student-dashboard',
  email: 'student-dashboard@mentora.test',
  password: 'password123',
  fullName: 'Студент Дашборд',
  role: 'student' as const,
};

test.describe('ролевой доступ к дашбордам', () => {
  test('студент не видит дашборд инструктора — редирект на главную', async ({ page }) => {
    const db = await installApiMocks(page);
    db.users.push(STUDENT);
    await seedSession(page, STUDENT);

    await page.goto('/dashboard/instructor');

    await expect(page).toHaveURL('/');
  });

  test('студент не видит дашборд админа — редирект на главную', async ({ page }) => {
    const db = await installApiMocks(page);
    db.users.push(STUDENT);
    await seedSession(page, STUDENT);

    await page.goto('/dashboard/admin');

    await expect(page).toHaveURL('/');
  });

  test('инструктор не видит дашборд админа — редирект на главную', async ({ page }) => {
    await installApiMocks(page);
    await seedSession(page, SEED_INSTRUCTOR);

    await page.goto('/dashboard/admin');

    await expect(page).toHaveURL('/');
  });

  test('студент видит свой дашборд', async ({ page }) => {
    const db = await installApiMocks(page);
    db.users.push(STUDENT);
    await seedSession(page, STUDENT);

    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText(`Здравствуйте, ${STUDENT.fullName}`)).toBeVisible();
  });

  test('инструктор видит свой дашборд', async ({ page }) => {
    await installApiMocks(page);
    await seedSession(page, SEED_INSTRUCTOR);

    await page.goto('/dashboard/instructor');

    await expect(page).toHaveURL(/\/dashboard\/instructor$/);
    await expect(page.getByRole('heading', { name: 'Аналитика инструктора' })).toBeVisible();
  });

  test('админ видит свой дашборд', async ({ page }) => {
    await installApiMocks(page);
    await seedSession(page, SEED_ADMIN);

    await page.goto('/dashboard/admin');

    await expect(page).toHaveURL(/\/dashboard\/admin$/);
    await expect(page.getByRole('heading', { name: 'Аналитика платформы' })).toBeVisible();
  });
});
