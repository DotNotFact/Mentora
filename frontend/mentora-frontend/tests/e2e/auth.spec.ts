import { test, expect } from '@playwright/test';
import { installApiMocks } from './mocks/api';

test.describe('аутентификация', () => {
  test('регистрация → выход → вход', async ({ page }) => {
    await installApiMocks(page);

    await page.goto('/register');
    await page.getByLabel('Имя').fill('Новый Студент');
    await page.getByLabel('Email').fill('new-student@mentora.test');
    await page.getByLabel('Пароль').fill('password123');
    await page.getByRole('button', { name: 'Зарегистрироваться' }).click();

    await expect(page.getByText('Новый Студент')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Выйти' })).toBeVisible();

    await page.getByRole('button', { name: 'Выйти' }).click();
    await expect(page.getByRole('link', { name: 'Войти' })).toBeVisible();

    await page.goto('/login');
    await page.getByLabel('Email').fill('new-student@mentora.test');
    await page.getByLabel('Пароль').fill('password123');
    await page.getByRole('button', { name: 'Войти' }).click();

    await expect(page.getByText('Новый Студент')).toBeVisible();
  });

  test('неаутентифицированный пользователь редиректится с защищённого роута на /login', async ({
    page,
  }) => {
    await installApiMocks(page);

    await page.goto('/my-courses');

    await expect(page).toHaveURL(/\/login$/);
  });
});
