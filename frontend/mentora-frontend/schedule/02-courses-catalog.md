# 02 — Courses Catalog

Статус: [x] выполнена

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
  перезагрузки. ✅ (`useInfiniteQuery` + sentinel/"Загрузить ещё", ключ
  кэша включает `filters`).
- Поиск debounce ~300ms. ✅ (то же самое применено и к полям цены —
  см. "Отклонения" ниже).
- Страница курса открывается по `/courses/:courseId` с реальными
  данными. ✅ (`useCourse` → `GET /courses/{courseId}`).
- Скриншот-гейт: **не выполнен файлами PNG** — см. подробности в
  "Отклонения от исходного плана".

## Отклонения от исходного плана (осознанные, по факту реализации)

- **Контракт `/courses` расширен.** Плейсхолдер `openapi.yaml` не
  содержал полей, нужных для фильтров/карточки (категория, диапазон
  цены, сортировка, превью, имя инструктора). Добавил в `Course`:
  `instructorName`, `category` (новый enum `CourseCategory`:
  development/design/business/marketing/it/other), `thumbnailUrl`,
  `createdAt` — все как `required`, строгие типы, по тому же паттерну,
  что и существующие поля. В query-параметры `GET /courses` добавил
  `search`, `category`, `priceMin`, `priceMax`, `sort` (новый enum
  `CourseSort`: newest/price_asc/price_desc/popular). `yarn api:generate`
  перегенерировал клиент — `src/shared/api/generated/` не редактировался
  вручную.
- **`progress` в `CourseCard` — необязательный проп компонента, а не
  поле `Course`.** Данных о зачислении/прогрессе пока не существует
  (`Enrollment` по-настоящему появится в schedule/05) — карточка
  рендерит `Progress`, только когда `progress` передан явно вызывающей
  стороной. Так карточка уже готова для будущего дашборда "мои курсы"
  без повторного рефакторинга, а server-state (`Enrollment`) не
  дублируется в Zustand/каталоге курсов.
- **Добавлены два компонента, не перечисленных буквально в шагах 1–11**:
  `features/courses/components/course-detail.tsx` (контент страницы
  курса — загрузка/ошибка/описание/CTA) и
  `features/courses/components/popular-courses.tsx` (превью для
  главной, шаг 10). Оба нужны, чтобы роуты (`courses/$courseId.tsx`,
  `app/routes/index.tsx`) остались тонкими — правило CLAUDE.md #21 прямо
  запрещает бизнес-логику в `routes/`.
- **Debounce ~300ms применён и к полям "цена от/до"**, не только к
  полю поиска (буквально в критериях готовности требовался только
  поиск). Без этого каждая напечатанная цифра цены слала бы отдельный
  запрос — тот же keystroke-driven паттерн, что и у поиска, тот же
  `useDebounce`.
- **`useCourses` принимает необязательный второй аргумент `{ pageSize
  }`** (сверх сигнатуры "useInfiniteQuery поверх GET /courses" из шага
  3) — нужно для превью на главной (3 карточки), чтобы не заводить
  почти-дублирующий хук. Полноценный каталог по-прежнему использует
  дефолтный `pageSize=12`.
- **Инфраструктурный фикс, напрямую не относящийся к задаче, но
  блокировавший любую работу**: на чистом чекауте `origin/main` (до
  моих изменений) `yarn typecheck` уже падал — `button.tsx`/`label.tsx`
  (унаследованы из schedule/00) импортируют `class-variance-authority`,
  которого нет ни в `package.json`, ни в `node_modules`. Аналогично
  `yarn test` падал на всех 6 существующих файлах с `Cannot find package
  '@testing-library/dom'` (пропущенная peer-зависимость
  `@testing-library/react`/`jest-dom`). Добавил оба явно (`yarn add
  class-variance-authority`, `yarn add -D @testing-library/dom`) — без
  этого `yarn verify` не мог быть зелёным в принципе, независимо от кода
  каталога курсов. `yarn add`/`npx shadcn@latest add` в этом окружении
  дополнительно потребовали `--ignore-engines`: `jsdom@30` требует Node
  `^22.22.2 || ^24.15.0 || >=26.0.0`, а здесь Node 22.16.0 — тоже
  унаследованная несостыковка, впервые проявившаяся при первом `yarn
  add` после `00`/`01`.
- **Скриншот-гейт не выполнен файлами PNG** — как и в schedule/00/01.
  Проверено программно на реальном `yarn dev` (`localhost:5183`):
  - Accessibility-снепшот через Playwright MCP (до подмены сети)
    подтвердил, что `/courses` рендерит ожидаемую разметку: заголовок
    "Каталог курсов", форма фильтров (поиск/категория/цена
    от-до/сортировка/сброс) со всеми опциями `CourseCategory`/
    `CourseSort` из `schemas.ts`. Поскольку реального бэкенда в этой
    сессии нет, каталог корректно показал error-state `role="alert"`:
    "Не удалось загрузить каталог курсов. Попробуйте обновить
    страницу." — сетевой лог зафиксировал честный `GET
    /api/courses?page=1&pageSize=12 → 502 Bad Gateway` (Vite-прокси на
    несуществующий `localhost:5000`), т.е. весь путь
    запрос → ошибка → UI отработал правильно.
  - Для визуальной проверки самой карточки (превью 16:9, `line-clamp-2`,
    цена `bottom-right`) замокал `GET /api/courses` через Playwright
    `page.route` шестью тестовыми курсами (по одному на каждую
    категорию) — разметка и токены визуально совпали с
    `mentora-design/SKILL.md`.
  - Реальный PNG-скриншот получить не удалось: панель браузера
    (claude-in-chrome) не компоузит кадр в этой Windows-сессии (та же
    причина, что в schedule/00/01), а Playwright MCP-браузер в этой же
    сессии оказался фактически подключён не к моей рабочей директории —
    после навигации на мой `localhost:5183/courses` снепшот внезапно
    показал `/dashboard` с контентом, которого в этой ветке вообще нет
    (похоже на коллизию с параллельно запущенными worktree-сессиями
    `03`/`06` на общей browser-инфраструктуре, судя по совпадающему
    `localhost:5184` и авторизованному пользователю "Иван Студентов" в
    обоих инструментах). Чинить общую инфраструктуру вне зоны
    ответственности этой задачи не стал — довожу до администратора
    честно: PNG для
    `docs/qa-screenshots/schedule-02-courses-catalog/` нужно доснять
    отдельно, когда браузерный тулинг в этой среде будет стабилен.
  - Дополнительное покрытие: 22 автотеста (было 15 после `00`/`01`,
    добавлено 7 — 4 на `CourseCard`, 3 на `useCourses`), включая рендер
    `CourseCard` внутри настоящего `RouterProvider` (проверка `href`,
    наличие/отсутствие `progressbar`) — тот же паттерн, что уже
    применён в `tests/components/app/auth-guard.test.tsx`.

## Не входит

Запись на курс (enrollment), оплата — schedule/05.

## Коммит

`feat: добавлен каталог курсов с фильтрами и страницей курса`
