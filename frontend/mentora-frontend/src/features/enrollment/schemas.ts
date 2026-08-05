import { z } from 'zod';

// Запись на курс — это одно действие по кнопке, не форма, поэтому здесь
// нет react-hook-form схемы. Схема ниже защищает вызовы use-enroll от
// пустого/некорректного courseId (например, если роут смонтирован без
// параметра).
export const enrollCourseIdSchema = z.string().min(1, 'courseId обязателен');
