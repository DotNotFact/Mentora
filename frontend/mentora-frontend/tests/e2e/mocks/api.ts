import type { Page, Route } from '@playwright/test';
import { createMockDb, type MockChapter, type MockDb, type MockUser } from './db';

// Единственный источник правды по контракту — openapi/openapi.yaml. Этот
// мок реализует его поверх page.route (реального бэкенда для e2e нет —
// см. schedule/08-e2e-tests.md, шаг 6 и "Отклонения"), с состоянием в
// памяти на один тест (createMockDb() создаёт свежую БД под каждый вызов
// installApiMocks, тесты не шарят её между собой).

function tokenFor(userId: string) {
  return `mock-access:${userId}`;
}

function userIdFromAuthHeader(authHeader: string | undefined): string | null {
  if (!authHeader?.startsWith('Bearer mock-access:')) {
    return null;
  }
  return authHeader.slice('Bearer mock-access:'.length);
}

function toEnrollmentWithCourse(db: MockDb, enrollmentId: string) {
  const enrollment = db.enrollments.find((item) => item.id === enrollmentId);
  if (!enrollment) return null;
  const course = db.courses.find((item) => item.id === enrollment.courseId);
  if (!course) return null;
  return { ...enrollment, course };
}

function computeCourseProgress(db: MockDb, courseId: string) {
  const lessons = (db.chapters[courseId] ?? []).flatMap((chapter) => chapter.lessons);
  const entries = db.progress[courseId] ?? [];
  const completedCount = entries.filter((entry) => entry.completed).length;
  const progressPercent = lessons.length === 0 ? 0 : Math.round((completedCount / lessons.length) * 100);
  return { courseId, progressPercent, lessons: entries };
}

function findLessonChapter(chapters: MockChapter[], lessonId: string) {
  return chapters.find((chapter) => chapter.lessons.some((lesson) => lesson.id === lessonId));
}

export async function installApiMocks(page: Page, db: MockDb = createMockDb()): Promise<MockDb> {
  // Матчер — функция по pathname, а не glob-строка '**/api/**': такой glob
  // матчит не только реальные вызовы бэкенда (/api/...), но и Vite dev-
  // server запросы ИСХОДНИКОВ вида /src/shared/api/client.ts?t=... (там
  // тоже есть сегмент "api" в пути) — перехват этих JS-модулей ломает всё
  // приложение (React не монтируется, form-инпуты не находятся). Матчим
  // только pathname, начинающийся с /api/.
  await page.route(
    (url) => url.pathname.startsWith('/api/'),
    async (route: Route) => {
      const request = route.request();
      const url = new URL(request.url());
      const path = url.pathname.replace(/^\/api/, '');
    const method = request.method();
    const body = request.postDataJSON?.() as Record<string, unknown> | undefined;
    const userId = userIdFromAuthHeader(request.headers()['authorization']);

    const json = (status: number, data: unknown) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data) });

    // --- auth ---
    if (method === 'POST' && path === '/auth/register') {
      const { email, password, fullName } = body as { email: string; password: string; fullName: string };
      if (db.users.some((u) => u.email === email)) {
        return json(409, { message: 'Email already registered' });
      }
      const user: MockUser = { id: db.nextId('user'), email, password, fullName, role: 'student' };
      db.users.push(user);
      return json(201, {
        accessToken: tokenFor(user.id),
        refreshToken: `mock-refresh:${user.id}`,
        user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
      });
    }

    if (method === 'POST' && path === '/auth/login') {
      const { email, password } = body as { email: string; password: string };
      const user = db.users.find((u) => u.email === email && u.password === password);
      if (!user) {
        return json(401, { message: 'Invalid credentials' });
      }
      return json(200, {
        accessToken: tokenFor(user.id),
        refreshToken: `mock-refresh:${user.id}`,
        user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
      });
    }

    if (method === 'POST' && path === '/auth/logout') {
      return route.fulfill({ status: 204 });
    }

    // --- courses ---
    if (method === 'GET' && path === '/courses') {
      const search = url.searchParams.get('search')?.toLowerCase();
      const category = url.searchParams.get('category');
      let items = db.courses;
      if (search) {
        items = items.filter((c) => c.title.toLowerCase().includes(search));
      }
      if (category) {
        items = items.filter((c) => c.category === category);
      }
      return json(200, { items, total: items.length, page: 1, pageSize: 12 });
    }

    if (method === 'POST' && path === '/courses') {
      if (!userId) return json(401, { message: 'Unauthorized' });
      const author = db.users.find((u) => u.id === userId);
      const payload = body as { title: string; description: string; price: number; category: string };
      const course = {
        id: db.nextId('course'),
        ...payload,
        instructorId: userId,
        instructorName: author?.fullName ?? 'Инструктор',
        thumbnailUrl: 'https://placehold.co/640x360/6366f1/ffffff?text=Course',
        createdAt: new Date().toISOString(),
      };
      db.courses.push(course);
      db.chapters[course.id] = [];
      return json(201, course);
    }

    const courseMatch = path.match(/^\/courses\/([^/]+)$/);
    if (courseMatch) {
      const courseId = courseMatch[1];
      if (method === 'GET') {
        const course = db.courses.find((c) => c.id === courseId);
        return course ? json(200, course) : json(404, { message: 'Not found' });
      }
      if (method === 'PUT') {
        const index = db.courses.findIndex((c) => c.id === courseId);
        if (index === -1) return json(404, { message: 'Not found' });
        db.courses[index] = { ...db.courses[index], ...(body as object) };
        return json(200, db.courses[index]);
      }
    }

    const chaptersMatch = path.match(/^\/courses\/([^/]+)\/chapters$/);
    if (chaptersMatch) {
      const courseId = chaptersMatch[1];
      if (method === 'GET') {
        return json(200, db.chapters[courseId] ?? []);
      }
      if (method === 'PUT') {
        db.chapters[courseId] = body as unknown as MockChapter[];
        return json(200, db.chapters[courseId]);
      }
    }

    const lessonContentMatch = path.match(/^\/lessons\/([^/]+)\/content$/);
    if (lessonContentMatch && method === 'PUT') {
      const lessonId = lessonContentMatch[1];
      const { contentHtml } = body as { contentHtml: string };
      for (const chapters of Object.values(db.chapters)) {
        const chapter = findLessonChapter(chapters, lessonId);
        const lesson = chapter?.lessons.find((l) => l.id === lessonId);
        if (lesson) {
          lesson.contentHtml = contentHtml;
          return json(200, lesson);
        }
      }
      return json(404, { message: 'Not found' });
    }

    const lessonVideoMatch = path.match(/^\/lessons\/([^/]+)\/video$/);
    if (lessonVideoMatch && method === 'POST') {
      const lessonId = lessonVideoMatch[1];
      const videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';
      for (const chapters of Object.values(db.chapters)) {
        const chapter = findLessonChapter(chapters, lessonId);
        const lesson = chapter?.lessons.find((l) => l.id === lessonId);
        if (lesson) lesson.videoUrl = videoUrl;
      }
      return json(200, { videoUrl });
    }

    // --- enrollments ---
    if (method === 'GET' && path === '/enrollments') {
      if (!userId) return json(401, { message: 'Unauthorized' });
      const items = db.enrollments
        .filter((e) => e.userId === userId)
        .map((e) => toEnrollmentWithCourse(db, e.id))
        .filter(Boolean);
      return json(200, items);
    }

    if (method === 'POST' && path === '/enrollments') {
      if (!userId) return json(401, { message: 'Unauthorized' });
      const { courseId } = body as { courseId: string };
      let enrollment = db.enrollments.find((e) => e.userId === userId && e.courseId === courseId);
      if (!enrollment) {
        enrollment = { id: db.nextId('enrollment'), courseId, userId, progress: 0 };
        db.enrollments.push(enrollment);
      }
      return json(201, enrollment);
    }

    const enrollmentStatusMatch = path.match(/^\/enrollments\/([^/]+)$/);
    if (enrollmentStatusMatch && method === 'GET') {
      if (!userId) return json(401, { message: 'Unauthorized' });
      const courseId = enrollmentStatusMatch[1];
      const enrollment = db.enrollments.find((e) => e.userId === userId && e.courseId === courseId);
      return enrollment ? json(200, enrollment) : json(404, { message: 'Not enrolled' });
    }

    const progressMatch = path.match(/^\/enrollments\/([^/]+)\/progress$/);
    if (progressMatch && method === 'GET') {
      if (!userId) return json(401, { message: 'Unauthorized' });
      return json(200, computeCourseProgress(db, progressMatch[1]));
    }

    const lessonProgressMatch = path.match(/^\/enrollments\/([^/]+)\/lessons\/([^/]+)\/progress$/);
    if (lessonProgressMatch && method === 'PUT') {
      if (!userId) return json(401, { message: 'Unauthorized' });
      const [, courseId, lessonId] = lessonProgressMatch;
      const { positionSeconds, completed } = body as { positionSeconds: number; completed: boolean };
      const entries = (db.progress[courseId] ??= []);
      const existing = entries.find((entry) => entry.lessonId === lessonId);
      if (existing) {
        existing.positionSeconds = positionSeconds;
        existing.completed = existing.completed || completed;
      } else {
        entries.push({ lessonId, positionSeconds, completed });
      }
      const aggregate = computeCourseProgress(db, courseId);
      const enrollment = db.enrollments.find((e) => e.userId === userId && e.courseId === courseId);
      if (enrollment) enrollment.progress = aggregate.progressPercent;
      return json(200, aggregate);
    }

    // --- payments ---
    if (method === 'POST' && path === '/payments/checkout') {
      if (!userId) return json(401, { message: 'Unauthorized' });
      const { courseId } = body as { courseId: string };
      const sessionId = db.nextId('session');
      // "Оплата" в e2e — не реальный Stripe: checkoutUrl ведёт сразу на
      // тот же checkout-роут с success-параметрами, как будто Stripe уже
      // вернул пользователя. Сессия сразу в статусе completed — тест не
      // проверяет промежуточный поллинг (это покрыто unit-тестом
      // use-checkout-status), только итоговый доступ к обучению.
      db.checkoutSessions[sessionId] = { sessionId, courseId, status: 'completed' };
      const enrollment = { id: db.nextId('enrollment'), courseId, userId, progress: 0 };
      db.enrollments.push(enrollment);
      return json(200, {
        sessionId,
        checkoutUrl: `/checkout/${courseId}?status=success&session_id=${sessionId}`,
      });
    }

    const sessionStatusMatch = path.match(/^\/payments\/sessions\/([^/]+)$/);
    if (sessionStatusMatch && method === 'GET') {
      const session = db.checkoutSessions[sessionStatusMatch[1]];
      return session ? json(200, session) : json(404, { message: 'Not found' });
    }

    // --- analytics ---
    if (method === 'GET' && path === '/analytics/instructor') {
      return json(200, {
        totalRevenue: 0,
        totalEnrollments: 0,
        revenueChangePercent: 0,
        enrollmentsChangePercent: 0,
        revenueByPeriod: [],
        enrollmentsByCourse: [],
      });
    }
    if (method === 'GET' && path === '/analytics/admin') {
      return json(200, {
        totalRevenue: 0,
        totalUsers: db.users.length,
        totalCourses: db.courses.length,
        totalEnrollments: db.enrollments.length,
        revenueChangePercent: 0,
        userGrowthPercent: 0,
        revenueByPeriod: [],
        enrollmentsByCourse: [],
      });
    }

      return route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: `Unhandled mock route: ${method} ${path}` }),
      });
    },
  );

  return db;
}
