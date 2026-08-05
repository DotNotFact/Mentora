import { test, expect } from '@playwright/test';
import { installApiMocks } from './mocks/api';
import { SEED_COURSE_FREE, SEED_COURSE_PAID } from './mocks/db';

test.describe('каталог курсов', () => {
  test('открыть каталог, применить поиск, открыть карточку курса', async ({ page }) => {
    await installApiMocks(page);

    await page.goto('/courses');

    await expect(page.getByText(SEED_COURSE_FREE.title)).toBeVisible();
    await expect(page.getByText(SEED_COURSE_PAID.title)).toBeVisible();

    await page.getByLabel('Поиск').fill('TypeScript');

    await expect(page.getByText(SEED_COURSE_PAID.title)).toBeVisible();
    await expect(page.getByText(SEED_COURSE_FREE.title)).not.toBeVisible();

    await page.getByText(SEED_COURSE_PAID.title).click();

    await expect(page).toHaveURL(new RegExp(`/courses/${SEED_COURSE_PAID.id}$`));
    await expect(page.getByRole('heading', { name: SEED_COURSE_PAID.title })).toBeVisible();
  });

  test('фильтр по категории сужает список', async ({ page }) => {
    await installApiMocks(page);

    await page.goto('/courses');
    await expect(page.getByText(SEED_COURSE_FREE.title)).toBeVisible();

    await page.getByLabel('Категория').click();
    await page.getByRole('option', { name: 'Разработка' }).click();

    await expect(page.getByText(SEED_COURSE_FREE.title)).toBeVisible();
    await expect(page.getByText(SEED_COURSE_PAID.title)).toBeVisible();
  });
});
