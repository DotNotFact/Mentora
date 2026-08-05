import { z } from 'zod';
import { CourseCategory } from '@shared/types/api';

// category — z.enum(CourseCategory).optional() + .refine (не просто
// z.enum(CourseCategory)): вход/выход схемы должны совпадать для
// react-hook-form + zodResolver (та же причина, что у price ниже) — до
// выбора значения в Select его вообще нет (undefined), а не пустая строка,
// так что "обычный required enum" не смог бы описать промежуточное
// состояние формы. .refine даёт кастомное сообщение именно под полем.
export const courseMetaSchema = z
  .object({
    title: z.string().min(3, 'Минимум 3 символа'),
    description: z.string().min(10, 'Минимум 10 символов'),
    // Обычный z.number() (не z.coerce) — вход/выход схемы совпадают, что
    // нужно react-hook-form + zodResolver для согласованных типов.
    // Конвертация из строки инпута в число — на стороне компонента
    // (Input type="number" + valueAsNumber), см. course-meta-form.tsx.
    price: z.number().min(0, 'Цена не может быть отрицательной'),
    category: z.enum(CourseCategory).optional(),
  })
  .refine((data) => data.category !== undefined, {
    message: 'Выберите категорию',
    path: ['category'],
  });

export type CourseMetaFormValues = z.infer<typeof courseMetaSchema>;

export const lessonSchema = z.object({
  id: z.string(),
  chapterId: z.string(),
  title: z.string().min(1, 'Введите название урока'),
  order: z.number().int().nonnegative(),
  contentHtml: z.string(),
  videoUrl: z.string().nullable(),
});

export type LessonFormValues = z.infer<typeof lessonSchema>;

export const chapterSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  title: z.string().min(1, 'Введите название главы'),
  order: z.number().int().nonnegative(),
  lessons: z.array(lessonSchema),
});

export type ChapterFormValues = z.infer<typeof chapterSchema>;

// Подписи категорий для Select в course-meta-form.tsx. Значения — из
// сгенерированного CourseCategory (@shared/types/api), не задублированы;
// текст подписей совпадает с features/courses (schedule/02) для
// консистентности каталога/редактора, но не импортируется оттуда напрямую
// — правило CLAUDE.md #4 запрещает feature → feature импорты.
export const COURSE_CATEGORY_LABELS: Record<CourseCategory, string> = {
  development: 'Разработка',
  design: 'Дизайн',
  business: 'Бизнес',
  marketing: 'Маркетинг',
  it: 'IT и инфраструктура',
  other: 'Другое',
};
