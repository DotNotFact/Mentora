import { z } from 'zod';

export const courseCategorySchema = z.enum([
  'development',
  'design',
  'business',
  'marketing',
  'it',
  'other',
]);

export const courseSortSchema = z.enum(['newest', 'price_asc', 'price_desc', 'popular', 'rating']);

export const courseCategoryLabels: Record<z.infer<typeof courseCategorySchema>, string> = {
  development: 'Разработка',
  design: 'Дизайн',
  business: 'Бизнес',
  marketing: 'Маркетинг',
  it: 'IT и инфраструктура',
  other: 'Другое',
};

export const courseSortLabels: Record<z.infer<typeof courseSortSchema>, string> = {
  newest: 'Сначала новые',
  price_asc: 'Сначала дешевле',
  price_desc: 'Сначала дороже',
  popular: 'По популярности',
  rating: 'По рейтингу',
};

const priceFieldSchema = z
  .string()
  .refine(
    (value) => value === '' || (!Number.isNaN(Number(value)) && Number(value) >= 0),
    'Некорректная цена',
  );

// Значения фильтров каталога курсов. Хранятся в "сыром" виде форм-полей
// (строки, пустая строка = "не выбрано") — так их можно напрямую скормить
// react-hook-form `register`/`Select` без ручного приведения типов на
// каждый keystroke. Приведение к типам API-параметров (числа, undefined
// вместо '') происходит в hooks/use-courses.ts при построении query.
// Без .default() намеренно — с zod v4 .default() расходит input/output
// типы схемы, из-за чего zodResolver перестаёт совпадать с типом формы
// (RHF ожидает Resolver<TFieldValues>, а не Resolver<optional-версия>).
// Дефолты вместо этого заданы явно в defaultCourseFilters ниже.
export const courseFiltersSchema = z.object({
  search: z.string(),
  category: z.union([courseCategorySchema, z.literal('')]),
  priceMin: priceFieldSchema,
  priceMax: priceFieldSchema,
  sort: z.union([courseSortSchema, z.literal('')]),
});

export type CourseFiltersValues = z.infer<typeof courseFiltersSchema>;

export const defaultCourseFilters: CourseFiltersValues = {
  search: '',
  category: '',
  priceMin: '',
  priceMax: '',
  sort: '',
};

export const reviewSchema = z.object({
  rating: z.number().min(1, 'Поставьте оценку').max(5),
  comment: z.string().max(1000, 'Слишком длинный отзыв').optional(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
