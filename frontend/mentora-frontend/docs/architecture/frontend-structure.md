# Frontend Structure

Источник истины для этого дерева — сама файловая структура репозитория
(`frontend/mentora-frontend/`). Ниже — аннотированная копия для
быстрой ориентации; при расхождении доверять фактическому дереву в `src/`.

```
frontend/mentora-frontend/
├── CLAUDE.md / AGENTS.md      — правила для AI-агентов
├── .mcp.json                  — MCP-серверы (playwright, shadcn, github)
├── .agents/                   — STATE.md, skills, prompts
├── schedule/                  — пошаговый план функционала (Режим B)
├── docs/architecture/         — этот раздел
├── openapi/openapi.yaml       — источник истины API-контракта
│
├── src/
│   ├── main.tsx                — точка входа, RouterProvider (готово)
│   │
│   ├── app/                    — тонкий слой компоновки приложения
│   │   ├── router.tsx          — дерево роутов (code-based), готово
│   │   ├── provider.tsx        — QueryClientProvider (готово)
│   │   ├── routes/             — роуты TanStack Router (code-based)
│   │   │   ├── __root.tsx      — RootLayout + Outlet (готово)
│   │   │   ├── index.tsx       — главная: h1 + PopularCourses (превью +
│   │   │   │                      ссылка на каталог, готово, schedule/02)
│   │   │   ├── login.tsx       — LoginForm (готово)
│   │   │   ├── register.tsx    — RegisterForm (готово)
│   │   │   ├── courses/
│   │   │   │   ├── index.tsx   — CourseFilters + CourseGrid (готово,
│   │   │   │   │                  schedule/02)
│   │   │   │   └── $courseId.tsx — CourseDetail (готово, schedule/02)
│   │   │   └── ...             — остальные: Planned (наполняются по мере
│   │                              прохождения соответствующих schedule/*)
│   │   ├── auth-guard.tsx      — редирект на /login для защищённых
│   │   │                          роутов (готово, применяется начиная
│   │   │                          с schedule/03/06, когда появятся сами
│   │   │                          защищённые роуты)
│   │   └── layout/              — root-layout, footer (готово, минимально);
│   │                              header — auth-aware (войти/аватар+выйти,
│   │                              готово); sidebar — Planned
│   │
│   ├── shared/                 — переиспользуемый код без бизнес-логики
│   │   ├── ui/                 — shadcn/ui компоненты (только через CLI)
│   │   ├── lib/                — utils.ts (cn/formatPrice/formatDate/
│   │   │                          formatDuration), constants.ts (готово)
│   │   ├── hooks/               — useMedia/useDebounce/useLocalStorage
│   │   │                          (готово)
│   │   ├── api/
│   │   │   ├── client.ts       — axios + interceptors (готово, включая
│   │   │   │                      refresh-flow через сгенерированный
│   │   │   │                      authApi; coursesApi добавлен в
│   │   │   │                      schedule/02)
│   │   │   └── generated/       — orval codegen (auth/courses/enrollments/
│   │   │                          payments/analytics), НЕ редактировать
│   │   │                          вручную
│   │   ├── types/               — index.ts (готово), api.ts (реэкспорт
│   │   │                          сгенерированных orval-типов, готово)
│   │   └── config/
│   │       ├── query-client.ts — QueryClient defaults (готово)
│   │       └── router.ts        — дефолты роутера (готово)
│   │
│   ├── features/                — feature-модули (изолированы друг от друга)
│   │   ├── auth/                — готово (schedule/01): login/register,
│   │   │                          Zustand store + persist, AuthGuard
│   │   ├── courses/             — готово (schedule/02): каталог с
│   │   │                          фильтрами (useInfiniteQuery),
│   │   │                          CourseCard/CourseGrid/CourseFilters/
│   │   │                          CourseDetail/PopularCourses, Zustand
│   │   │                          store — только UI-state фильтров/вида
│   │   ├── course-editor/       — Planned (schedule/03)
│   │   ├── enrollment/          — Planned (schedule/04, 05)
│   │   ├── payments/            — Planned (schedule/05)
│   │   └── analytics/           — Planned (schedule/06)
│   │
│   └── styles/globals.css       — Tailwind v4 + CSS variables (готово)
│
└── tests/
    ├── setup.ts                 — jest-dom matchers + jsdom-полифиллы (готово)
    ├── components/               — unit-тесты компонентов (наполняются
    │                              по мере прохождения schedule/*)
    └── e2e/                      — Playwright (Planned, schedule/08)
```

## Границы модулей

- `features/<a>` не импортирует напрямую из `features/<b>` — общее выносится
  в `shared/`.
- `app/routes/*` — только композиция: импорт компонента из `features/*` +
  параметры маршрута. Никакой бизнес-логики.
- `shared/ui/` пополняется исключительно через `npx shadcn@latest add`.

## Алиасы (tsconfig + vite)

`@/*` → `src/*` · `@shared/*` → `src/shared/*` ·
`@features/*` → `src/features/*` · `@app/*` → `src/app/*`
