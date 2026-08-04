# 02 — Courses Catalog

Статус: [ ] не начата

## Цель

Студент может просматривать, искать и фильтровать каталог курсов и
открывать страницу курса.

## Ветка

`feature/02-courses-catalog`

## Шаги

1. `features/courses/schemas.ts` — Zod-схема фильтров каталога
   (поиск, категория, цена от/до, сортировка).
2. `features/courses/store.ts` — Zustand UI-state: текущие фильтры,
   вид отображения (grid/list) — НЕ сами данные курсов.
3. `features/courses/hooks/use-courses.ts` — `useInfiniteQuery` поверх
   `GET /courses` (пагинация по `page`/`pageSize`), ключ кэша учитывает
   фильтры.
4. `features/courses/hooks/use-course.ts` — `useQuery` для
   `GET /courses/{courseId}`.
5. `features/courses/components/course-card.tsx` — карточка курса
   (см. дизайн-заметки).
6. `features/courses/components/course-grid.tsx` — сетка с
   infinite-scroll/"загрузить ещё", skeleton-состояние загрузки.
7. `features/courses/components/course-filters.tsx` — форма фильтров,
   `useDebounce` для поля поиска.
8. `src/app/routes/courses/index.tsx` — тонкий роут: `CourseFilters` +
   `CourseGrid`.
9. `src/app/routes/courses/$courseId.tsx` — страница курса (описание,
   инструктор, цена, кнопка "Записаться" — сама запись реализуется в
   schedule/05, здесь только UI-заглушка кнопки/CTA).
10. Обновить `src/app/routes/index.tsx` (главная) — превью популярных
    курсов, ссылка на полный каталог.
11. Тесты: `course-card.test.tsx`, unit-тест на `use-courses` (мок API).

## Дизайн-заметки

CourseCard: `rounded-xl shadow-sm`, hover `scale-[1.02] shadow-md`
(единственное место с этим hover-эффектом), 16:9 превью, `line-clamp-2`
заголовок, цена — `bottom-right`, `Progress` bar только если пользователь
уже записан. Сетка: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.

## Критерии готовности

- Каталог грузится постранично, фильтры обновляют список без полной
  перезагрузки.
- Поиск debounce ~300ms.
- Страница курса открывается по `/courses/:courseId` с реальными данными.

## Не входит

Запись на курс (enrollment), оплата — schedule/05.

## Коммит

`feat: добавлен каталог курсов с фильтрами и страницей курса`
