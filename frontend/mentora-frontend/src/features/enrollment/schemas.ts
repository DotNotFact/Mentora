import { z } from 'zod';

// Запись на курс — это одно действие по кнопке, не форма, поэтому здесь
// нет react-hook-form схемы. Схема ниже защищает вызовы use-enroll от
// пустого/некорректного courseId (например, если роут смонтирован без
// параметра).
export const enrollCourseIdSchema = z.string().min(1, 'courseId обязателен');

// Комментарий/вопрос под уроком — только plain text (см. schedule/19 →
// "Не входит": форматированный текст исключён сознательно).
export const commentSchema = z.object({
  body: z.string().trim().min(1, 'Введите текст сообщения').max(2000, 'Слишком длинное сообщение'),
});

export type CommentFormValues = z.infer<typeof commentSchema>;
