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
│   ├── main.tsx                — точка входа
│   ├── App.tsx                 — Статус: Planned — будет заменён на
│   │                              RouterProvider в schedule/00
│   │
│   ├── app/                    — тонкий слой компоновки приложения
│   │   ├── router.tsx          — Статус: Planned (schedule/00)
│   │   ├── provider.tsx        — QueryClientProvider (готово)
│   │   ├── routes/             — файловые роуты TanStack Router
│   │   │   └── ...             — Статус: Planned (наполняются по мере
│   │                              прохождения соответствующих schedule/*)
│   │   └── layout/              — root-layout, header, sidebar, footer
│   │                              Статус: Planned (schedule/00)
│   │
│   ├── shared/                 — переиспользуемый код без бизнес-логики
│   │   ├── ui/                 — shadcn/ui компоненты (только через CLI)
│   │   ├── lib/                — utils.ts (cn/formatPrice/formatDate/
│   │   │                          formatDuration), constants.ts (готово)
│   │   ├── hooks/               — useMedia/useDebounce/useLocalStorage
│   │   │                          (готово)
│   │   ├── api/
│   │   │   ├── client.ts       — axios + interceptors (готово, refresh —
│   │   │   │                      Planned, эндпоинт подключается в
│   │   │   │                      schedule/01)
│   │   │   └── generated/       — orval codegen, НЕ редактировать вручную
│   │   ├── types/               — index.ts (готово), api.ts (реэкспорт
│   │   │                          orval-типов после первого codegen)
│   │   └── config/
│   │       ├── query-client.ts — QueryClient defaults (готово)
│   │       └── router.ts        — Statuс: Planned (schedule/00)
│   │
│   ├── features/                — feature-модули (изолированы друг от друга)
│   │   ├── auth/                — Statуs: Planned (schedule/01)
│   │   ├── courses/             — Planned (schedule/02)
│   │   ├── course-editor/       — Planned (schedule/03)
│   │   ├── enrollment/          — Planned (schedule/04, 05)
│   │   ├── payments/            — Planned (schedule/05)
│   │   └── analytics/           — Planned (schedule/06)
│   │
│   └── styles/globals.css       — Tailwind v4 + CSS variables (готово)
│
└── tests/
    ├── setup.ts                 — jest-dom matchers (готово)
    ├── components/               — unit-тесты компонентов (Planned)
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
