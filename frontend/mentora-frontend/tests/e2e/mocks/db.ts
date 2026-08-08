export type MockRole = 'student' | 'instructor' | 'admin';

export interface MockUser {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: MockRole;
}

export interface MockLesson {
  id: string;
  chapterId: string;
  title: string;
  order: number;
  contentHtml: string;
  videoUrl: string | null;
}

export interface MockChapter {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: MockLesson[];
}

export interface MockCourse {
  id: string;
  title: string;
  description: string;
  price: number;
  instructorId: string;
  instructorName: string;
  category: string;
  thumbnailUrl: string;
  createdAt: string;
}

export interface MockEnrollment {
  id: string;
  courseId: string;
  userId: string;
  progress: number;
}

export interface MockLessonProgress {
  lessonId: string;
  completed: boolean;
  positionSeconds: number;
}

export interface MockCheckoutSession {
  sessionId: string;
  courseId: string;
  status: 'pending' | 'completed' | 'failed' | 'expired';
}

export interface MockReview {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface MockComment {
  id: string;
  lessonId: string;
  userId: string;
  userName: string;
  userRole: MockRole;
  parentId: string | null;
  body: string;
  createdAt: string;
}

export interface MockDb {
  users: MockUser[];
  courses: MockCourse[];
  chapters: Record<string, MockChapter[]>;
  enrollments: MockEnrollment[];
  progress: Record<string, MockLessonProgress[]>;
  checkoutSessions: Record<string, MockCheckoutSession>;
  reviews: Record<string, MockReview[]>;
  comments: Record<string, MockComment[]>;
  nextId: (prefix: string) => string;
}

// Демо-инструктор/админ — регистрация всегда создаёт student (см.
// features/auth/schemas.ts — форма регистрации не спрашивает роль), так
// что instructor/admin для e2e только предзаседаны здесь, залогиниться на
// них можно обычной формой логина с этими email/паролем.
export const SEED_INSTRUCTOR: MockUser = {
  id: 'user-instructor',
  email: 'instructor@mentora.test',
  password: 'password123',
  fullName: 'Инструктор Курсов',
  role: 'instructor',
};

export const SEED_ADMIN: MockUser = {
  id: 'user-admin',
  email: 'admin@mentora.test',
  password: 'password123',
  fullName: 'Админ Платформы',
  role: 'admin',
};

export const SEED_COURSE_FREE: MockCourse = {
  id: 'course-seed-free',
  title: 'Основы автоматизированного тестирования',
  description: 'Демо-курс для e2e (бесплатный).',
  price: 0,
  instructorId: SEED_INSTRUCTOR.id,
  instructorName: SEED_INSTRUCTOR.fullName,
  category: 'development',
  thumbnailUrl: 'https://placehold.co/640x360/6366f1/ffffff?text=Course',
  createdAt: '2026-01-01T00:00:00.000Z',
};

export const SEED_COURSE_PAID: MockCourse = {
  id: 'course-seed-paid',
  title: 'Продвинутый TypeScript',
  description: 'Демо-курс для e2e (платный).',
  price: 49.99,
  instructorId: SEED_INSTRUCTOR.id,
  instructorName: SEED_INSTRUCTOR.fullName,
  category: 'development',
  thumbnailUrl: 'https://placehold.co/640x360/f59e0b/ffffff?text=Course',
  createdAt: '2026-01-01T00:00:00.000Z',
};

// Небольшое (~10 сек) публичное mp4 — реально грузится и проигрывается в
// браузере (в отличие от, например, Google-сэмпла BigBuckBunny, который в
// этом окружении блокируется ERR_BLOCKED_BY_ORB — см. schedule/04, а
// также schedule/08 → "Отклонения"), нужен для сценария "проигран урок →
// прогресс дошёл до 90% → отмечен пройденным" в checkout-and-learning.spec.
export const SEED_VIDEO_URL = 'https://www.w3schools.com/html/mov_bbb.mp4';

function seedChapters(courseId: string): MockChapter[] {
  return [
    {
      id: `${courseId}-chapter-1`,
      courseId,
      title: 'Введение',
      order: 0,
      lessons: [
        {
          id: `${courseId}-lesson-1`,
          chapterId: `${courseId}-chapter-1`,
          title: 'Первый урок',
          order: 0,
          contentHtml: '',
          videoUrl: SEED_VIDEO_URL,
        },
      ],
    },
  ];
}

// Свежая изолированная "БД" на каждый вызов — обязательно создавать
// внутри каждого теста (не на уровне модуля), иначе параллельные Playwright
// воркеры/тесты будут делить состояние.
export function createMockDb(): MockDb {
  let counter = 0;
  return {
    users: [SEED_INSTRUCTOR, SEED_ADMIN],
    courses: [SEED_COURSE_FREE, SEED_COURSE_PAID],
    chapters: {
      [SEED_COURSE_FREE.id]: seedChapters(SEED_COURSE_FREE.id),
      [SEED_COURSE_PAID.id]: seedChapters(SEED_COURSE_PAID.id),
    },
    enrollments: [],
    progress: {},
    checkoutSessions: {},
    reviews: {},
    comments: {},
    nextId: (prefix: string) => {
      counter += 1;
      return `${prefix}-${counter}`;
    },
  };
}
