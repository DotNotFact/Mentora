import { test, expect } from '@playwright/test';
import { installApiMocks } from './mocks/api';
import { seedSession } from './mocks/session';
import { createMockDb, SEED_COURSE_FREE, SEED_INSTRUCTOR } from './mocks/db';

test.describe('обсуждения и вопросы под уроком', () => {
  test('записанный студент видит пустое состояние, задаёт вопрос → он переживает обновление страницы', async ({
    page,
  }) => {
    const db = createMockDb();
    await installApiMocks(page, db);
    const student = {
      id: 'user-student-asker',
      email: 'asker@mentora.test',
      password: 'password123',
      fullName: 'Студент Вопрошающий',
      role: 'student' as const,
    };
    db.users.push(student);
    db.enrollments.push({
      id: 'enrollment-discussion-test',
      courseId: SEED_COURSE_FREE.id,
      userId: student.id,
      progress: 0,
    });
    await seedSession(page, student);

    await page.goto(`/learning/${SEED_COURSE_FREE.id}`);

    await expect(page.getByRole('heading', { name: 'Обсуждение' })).toBeVisible();
    await expect(page.getByText('Пока нет вопросов')).toBeVisible();

    await page.getByPlaceholder('Задайте вопрос по этому уроку...').fill('Как настроить окружение?');
    await page.getByRole('button', { name: 'Отправить' }).click();

    await expect(page.getByText('Как настроить окружение?')).toBeVisible();
    await expect(page.getByRole('main').getByText('Студент Вопрошающий')).toBeVisible();

    await page.reload();
    await expect(page.getByText('Как настроить окружение?')).toBeVisible();
  });

  test('инструктор курса отвечает на вопрос → ответ помечен бейджем "Автор курса"', async ({
    page,
  }) => {
    const db = createMockDb();
    await installApiMocks(page, db);
    const lessonId = `${SEED_COURSE_FREE.id}-lesson-1`;
    db.comments[lessonId] = [
      {
        id: 'comment-seed-1',
        lessonId,
        userId: 'user-student-other',
        userName: 'Другой Студент',
        userRole: 'student',
        parentId: null,
        body: 'А будут домашние задания?',
        createdAt: new Date().toISOString(),
      },
    ];
    // Инструктор отвечает из своей же плеера обучения — записываем его на
    // курс, иначе роут /learning/:id блокирует доступ до формы (гейт по
    // записи стоит выше, до секции обсуждения — см. LearningPage).
    db.enrollments.push({
      id: 'enrollment-instructor-self',
      courseId: SEED_COURSE_FREE.id,
      userId: SEED_INSTRUCTOR.id,
      progress: 0,
    });
    await seedSession(page, SEED_INSTRUCTOR);

    await page.goto(`/learning/${SEED_COURSE_FREE.id}`);

    await expect(page.getByText('А будут домашние задания?')).toBeVisible();
    await page.getByRole('button', { name: 'Ответить' }).click();
    await page.getByPlaceholder('Ваш ответ...').fill('Да, после каждого модуля.');
    await page.getByRole('button', { name: 'Ответить', exact: true }).click();

    await expect(page.getByText('Да, после каждого модуля.')).toBeVisible();
    await expect(page.getByText('Автор курса')).toBeVisible();
  });

  test('длинный тред — пагинация "Показать ещё"', async ({ page }) => {
    const db = createMockDb();
    await installApiMocks(page, db);
    const lessonId = `${SEED_COURSE_FREE.id}-lesson-1`;
    db.comments[lessonId] = Array.from({ length: 12 }, (_, index) => ({
      id: `comment-seed-${index}`,
      lessonId,
      userId: 'user-student-other',
      userName: 'Другой Студент',
      userRole: 'student' as const,
      parentId: null,
      body: `Вопрос номер ${index + 1}`,
      createdAt: new Date(2026, 0, 1, 0, index).toISOString(),
    }));
    const student = {
      id: 'user-student-reader',
      email: 'reader@mentora.test',
      password: 'password123',
      fullName: 'Студент Читатель',
      role: 'student' as const,
    };
    db.users.push(student);
    db.enrollments.push({
      id: 'enrollment-reader',
      courseId: SEED_COURSE_FREE.id,
      userId: student.id,
      progress: 0,
    });
    await seedSession(page, student);

    await page.goto(`/learning/${SEED_COURSE_FREE.id}`);

    await expect(page.getByText('Вопрос номер 1', { exact: true })).toBeVisible();
    await expect(page.getByText('Вопрос номер 11')).not.toBeVisible();
    await page.getByRole('button', { name: 'Показать ещё' }).click();
    await expect(page.getByText('Вопрос номер 11')).toBeVisible();
  });
});
