# Mentora Frontend

AI-first фронтенд LMS-платформы Mentora. Часть монорепозитория
[`DotNotFact/Mentora`](https://github.com/DotNotFact/Mentora), живёт в
`frontend/mentora-frontend/`.

## Стек

React 19 · Vite · TypeScript (strict) · TanStack Router · TanStack Query ·
Zustand · Zod · Tailwind v4 · shadcn/ui

## Быстрый старт

```bash
yarn install
yarn dev
```

## Скрипты

| Команда                                          | Назначение                                              |
| ------------------------------------------------ | ------------------------------------------------------- |
| `yarn dev`                                       | Dev-сервер (localhost:5173)                             |
| `yarn build`                                     | Продакшен-сборка (`tsc -b && vite build`)               |
| `yarn typecheck`                                 | Проверка типов без сборки                               |
| `yarn lint` / `yarn lint:fix`                    | ESLint                                                  |
| `yarn format`                                    | Prettier                                                |
| `yarn test` / `yarn test:watch` / `yarn test:ui` | Vitest                                                  |
| `yarn test:e2e`                                  | Playwright                                              |
| `yarn api:generate`                              | Кодогенерация клиента из `openapi/openapi.yaml` (orval) |
| `yarn verify`                                    | typecheck + lint + test + build                         |

## Для AI-агентов

Перед любой работой прочитать `.agents/STATE.md`. Правила проекта — в
[`CLAUDE.md`](./CLAUDE.md) и [`AGENTS.md`](./AGENTS.md). План
реализации функционала — в [`schedule/`](./schedule/README.md); задачи
оттуда выполняются только по явной команде администратора.

## Документация

Архитектура и ADR — [`docs/architecture/`](./docs/architecture/README.md).
