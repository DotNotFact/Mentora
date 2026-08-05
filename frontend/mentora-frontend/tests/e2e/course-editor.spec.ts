import { test, expect } from '@playwright/test';
import { installApiMocks } from './mocks/api';
import { seedSession } from './mocks/session';
import { SEED_INSTRUCTOR } from './mocks/db';

test.describe('редактор курса', () => {
  test('инструктор создаёт курс, добавляет главу/урок, меняет порядок, содержимое переживает перезагрузку', async ({
    page,
  }) => {
    await installApiMocks(page);
    await seedSession(page, SEED_INSTRUCTOR);

    await page.goto('/courses/edit/new');

    await page.getByLabel('Название').fill('E2E тестовый курс');
    await page.getByLabel('Описание').fill('Курс, созданный в рамках e2e-теста редактора.');
    await page.getByLabel('Цена, $').fill('19.99');
    await page.getByLabel('Категория').click();
    await page.getByRole('option', { name: 'Разработка' }).click();
    await page.getByRole('button', { name: 'Сохранить' }).click();

    // После создания редирект на /courses/edit/{новый id} перемонтирует
    // форму на новом courseId — транзиентное "Сохранено." из мутации
    // create принадлежит прошлому инстансу хука и не переживает переход.
    // Надёжный признак успеха — сам courseId в URL и то, что поля формы
    // подтянулись из GET по новому id (реальный round-trip, не кэш формы).
    await expect(page).toHaveURL(/\/courses\/edit\/course-\d+$/);
    await expect(page.getByLabel('Название')).toHaveValue('E2E тестовый курс');

    // Глава.
    await page.getByRole('button', { name: 'Глава', exact: true }).click();
    await expect(page.getByLabel('Название главы')).toHaveValue('Новая глава');
    await page.getByLabel('Название главы').fill('Основы');
    await page.getByLabel('Название главы').blur();

    // Первый урок.
    await page.getByRole('button', { name: 'Урок', exact: true }).click();
    await expect(page.getByLabel('Название урока «Новый урок»')).toBeVisible();
    await page.getByLabel('Название урока «Новый урок»').fill('Урок А');
    await page.getByLabel('Название урока «Новый урок»').blur();

    // Второй урок.
    await page.getByRole('button', { name: 'Урок', exact: true }).click();
    await expect(page.getByLabel('Название урока «Новый урок»')).toBeVisible();
    await page.getByLabel('Название урока «Новый урок»').fill('Урок Б');
    await page.getByLabel('Название урока «Новый урок»').blur();

    await expect(page.getByLabel('Перетащить урок «Урок А»')).toBeVisible();
    await expect(page.getByLabel('Перетащить урок «Урок Б»')).toBeVisible();

    // Порядок до перестановки: Урок А, затем Урок Б.
    const lessonRows = page.locator('ul[aria-label^="Уроки главы"] > li');
    await expect(lessonRows).toHaveCount(2);
    await expect(lessonRows.nth(0).locator('input')).toHaveValue('Урок А');
    await expect(lessonRows.nth(1).locator('input')).toHaveValue('Урок Б');

    // Клавиатурный drag & drop: поднять «Урок Б» на первое место.
    const dragHandle = page.getByLabel('Перетащить урок «Урок Б»');
    await dragHandle.focus();
    await page.keyboard.press('Space');
    await page.waitForTimeout(150);
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(150);
    await page.keyboard.press('Space');

    await expect(lessonRows.nth(0).locator('input')).toHaveValue('Урок Б');
    await expect(lessonRows.nth(1).locator('input')).toHaveValue('Урок А');

    // Перезагрузка — состояние должно сохраниться (запрос идёт в тот же
    // мок-бэкенд с состоянием в памяти, page.route переживает reload).
    await page.reload();

    await expect(page.getByLabel('Название главы')).toHaveValue('Основы');
    // expandedChapterIds — только UI-state (Zustand без persist), после
    // reload глава снова свёрнута по умолчанию — раскрыть заново, чтобы
    // увидеть уроки.
    await page.getByRole('button', { name: 'Развернуть главу' }).click();
    const reloadedLessonRows = page.locator('ul[aria-label^="Уроки главы"] > li');
    await expect(reloadedLessonRows).toHaveCount(2);
    await expect(reloadedLessonRows.nth(0).locator('input')).toHaveValue('Урок Б');
    await expect(reloadedLessonRows.nth(1).locator('input')).toHaveValue('Урок А');
  });
});
