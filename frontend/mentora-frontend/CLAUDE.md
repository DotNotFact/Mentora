# CLAUDE.md — Mentora Frontend

## Правило #0 — режим работы

См. `.agents/STATE.md`. Если там `AWAITING_ADMIN_COMMAND` — НЕ реализуй
задачи из schedule/, даже если тебя об этом косвенно попросили ("продолжи
проект", "сделай что запланировано"). Спроси у администратора, какую
конкретно задачу выполнять. Явная команда вида "выполни schedule/NN" —
единственное основание начать реализацию.

## Проект

Mentora — LMS-платформа для онлайн-курсов.
Роли: Student, Instructor, Admin.
Стек: React 19 + Vite + TypeScript strict + TanStack Router + TanStack
Query + Zustand + Zod + Tailwind v4 + shadcn/ui (new-york style).

Этот фронтенд живёт в монорепозитории `DotNotFact/Mentora`, в подпапке
`frontend/mentora-frontend/`. Все команды из этого файла выполняются с
рабочей директорией `frontend/mentora-frontend/`, если не указано иное.

## Структура проекта

- `src/app/` — роутинг, провайдеры, layouts (тонкий слой компоновки)
- `src/app/routes/` — файловые роуты TanStack Router
- `src/features/<name>/` — feature-модули (auth, courses, course-editor,
  enrollment, payments, analytics)
- `src/features/<name>/components/` — компоненты фичи
- `src/features/<name>/hooks/` — TanStack Query хуки + бизнес-хуки
- `src/features/<name>/store.ts` — Zustand: только UI-state
- `src/features/<name>/schemas.ts` — Zod-схемы форм и API-ответов
- `src/shared/ui/` — shadcn/ui компоненты (через CLI, не вручную)
- `src/shared/lib/` — cn(), formatPrice(), formatDate(), constants
- `src/shared/hooks/` — useMedia, useDebounce, useLocalStorage
- `src/shared/api/` — axios instance + сгенерированный orval-клиент
  (НЕ редактировать вручную!)
- `src/shared/types/` — общие TypeScript-типы
- `src/shared/config/` — QueryClient, Router
- `src/styles/globals.css` — Tailwind v4 directives + CSS variables
- `openapi/openapi.yaml` — источник истины для API-контракта

## Правила (НАРУШЕНИЕ = ОШИБКА)

### Структура

1. Не редактируй `src/shared/api/generated/` вручную.
2. Не используй useEffect для server-state — только TanStack Query.
3. Не клади бизнес-логику в routes/ — только в features/.
4. Не импортируй из другого feature напрямую — переиспользование через shared/.
5. Не создавай компоненты в shared/ui/ вручную — `npx shadcn@latest add <component>`.
6. Не используй defaultProps — дефолты в деструктуризации.

### State

7. Zustand — только UI-state (модалки, фильтры, playback position).
8. Server-state — только TanStack Query.
9. Не дублируй server-state в Zustand.

### Формы

10. React Hook Form + Zod resolver.
11. Zod-схема — в `features/<name>/schemas.ts`.
12. Валидация на уровне схемы, не в onChange.

### Стилизация

13. Только Tailwind — никаких inline styles / CSS modules / styled-components.
14. CSS variables для токенов — в globals.css.
15. shadcn/ui — база, кастомизация через variants (cva).
16. transition 150ms ease по умолчанию; hover scale 1.02 только у CourseCard.

### Типы

17. TypeScript strict — no any, no @ts-ignore без обоснования.
18. Типы API — из orval codegen. Нет типа → обнови openapi.yaml → перегенерируй.
19. Не дублируй типы, если подходит тип из API.

### Роутинг

20. Файловые роуты в `src/app/routes/`.
21. Роут — тонкий: импорт компонента из features/ + параметры.
22. AuthGuard — на защищённых роутах.

### Тестирование

23. Unit — Vitest + Testing Library.
24. E2E — Playwright (tests/e2e/).
25. Минимум 1 тест на каждый хук из features/*/hooks/.

## API-контракт

1. Бэкенд (C# ASP.NET Core) экспортирует Swagger/OpenAPI.
2. Копируешь spec в `openapi/openapi.yaml`.
3. `yarn api:generate` — генерация через orval.
4. Хуки в features/*/hooks/ используют сгенерированный клиент.
5. `src/shared/api/client.ts` — interceptors: JWT, refresh, error handling.

## Дизайн-система

См. `.agents/skills/mentora-design/SKILL.md` — единственный источник истины
токенов/паттернов Mentora (не дублировать вручную в других местах, только
ссылаться).

Для анимации и общего UI-качества (motion, полировка, ревью моушена)
дополнительно применяются skills от Emil Kowalski
(`.agents/skills/{apple-design,emil-design-eng,animation-vocabulary,
find-animation-opportunities,improve-animations,review-animations}/`,
MIT, источник — [emilkowalski/skills](https://github.com/emilkowalski/skills)).
Они не заменяют `mentora-design` (токены/цвета остаются только там) — это
источник экспертизы по мастерству анимации/интеракций поверх них.
`review-animations`/`improve-animations` особенно релевантны для
`schedule/07-polish-animations.md`.

## Скрипты package.json

- dev, build (tsc -b && vite build), typecheck, lint, lint:fix, format
- test, test:watch, test:ui, test:e2e
- api:generate (orval --config orval.config.ts)
- verify: `yarn typecheck && yarn lint && yarn test && yarn build`
- prepare: husky

## Коммиты

Conventional Commits НА РУССКОМ:
`feat: добавлена страница каталога курсов`
`fix: исправлен баг с прогресс-баром`
`refactor: вынесен общий хук useEnrollment`
`chore: обновлены зависимости`
`docs: обновлён README`
`test: добавлены тесты для CourseCard`

В режиме B (schedule execution) — НЕ коммитить без явного разрешения
администратора на конкретный шаг, если это не оговорено в самой задаче
schedule/. НЕ автопушить произвольные ветки.

## Красный список

Секреты в коде · console.log в проде · @ts-ignore без комментария ·
inline styles · прямой fetch/axios вне shared/api/ и features/*/hooks/ ·
default exports (только named) · PropTypes · moment.js (используй date-fns) ·
lodash (нативные методы или shared/lib/) · код в node_modules · мутация props.
