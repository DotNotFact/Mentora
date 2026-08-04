<p align="center">
  <img src=".github/assets/banner.svg" alt="Mentora — AI-first LMS платформа" width="100%" />
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-6366F1?style=flat-square" alt="License: MIT" /></a>
  <img src="https://img.shields.io/badge/status-в%20разработке-F59E0B?style=flat-square" alt="Status: in development" />
  <img src="https://img.shields.io/badge/frontend-React%2019%20%2B%20Vite-6366F1?style=flat-square" alt="Frontend: React 19 + Vite" />
  <img src="https://img.shields.io/badge/typescript-strict-6366F1?style=flat-square" alt="TypeScript: strict" />
  <img src="https://img.shields.io/badge/AI--first-Claude%20Code-4F46E5?style=flat-square" alt="AI-first: Claude Code" />
</p>

<p align="center">
  <b>Mentora</b> — LMS-платформа для онлайн-курсов: каталог, редактор курсов,
  обучение с видео и трекингом прогресса, оплата и аналитика.
</p>

---

## О проекте

Mentora — образовательная платформа с тремя ролями:

| Роль                | Возможности                                                              |
| ------------------- | ------------------------------------------------------------------------- |
| 🎓 **Student**      | Каталог курсов, обучение с видео-плеером, трекинг прогресса, "мои курсы" |
| 👨‍🏫 **Instructor** | Редактор курсов (главы/уроки, drag & drop, rich text), аналитика продаж   |
| 🛠️ **Admin**        | Платформенная аналитика, управление пользователями и курсами              |

Проект разрабатывается **AI-first**: вся инфраструктура для агентной
разработки (Claude Code) — правила, skills, пошаговый план — часть
репозитория с первого коммита, а не добавляется постфактум. Подробнее —
в разделе [AI-first разработка](#ai-first-разработка).

## Структура репозитория

Монорепозиторий; на данный момент в нём готов фронтенд, бэкенд —
в проектировании (контракт см. в
[`docs/architecture/backend-modules.md`](frontend/mentora-frontend/docs/architecture/backend-modules.md)).

```
Mentora/
├── frontend/
│   └── mentora-frontend/     — React-фронтенд (см. README внутри)
│       ├── CLAUDE.md         — правила для AI-агентов
│       ├── AGENTS.md         — правила + workflow (git/gh, автомерж, QA-гейт)
│       ├── schedule/         — пошаговый план функционала (00–09)
│       ├── docs/architecture/— архитектура, ADR, контракт API
│       └── src/              — код приложения
├── LICENSE                   — MIT
└── README.md                 — этот файл
```

Бэкенд (C# ASP.NET Core, по архитектурному плану) появится отдельной
подпапкой монорепозитория, когда стартует его разработка.

## Технологии

| Слой         | Стек                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| Frontend     | React 19 · Vite · TypeScript (strict) · TanStack Router/Query · Zustand · Zod · Tailwind v4 · shadcn/ui  |
| Данные       | orval-кодогенерация из OpenAPI-контракта, axios с JWT + refresh interceptors                                |
| Тестирование | Vitest + Testing Library (unit), Playwright (E2E)                                                        |
| Backend      | C# ASP.NET Core — _в проектировании_, контракт синхронизируется через `openapi/openapi.yaml`             |

Полный список решений и обоснований — в
[ADR](frontend/mentora-frontend/docs/architecture/decisions/).

## Быстрый старт

```bash
cd frontend/mentora-frontend
yarn install
yarn dev
```

Подробности — в [README фронтенда](frontend/mentora-frontend/README.md).

## Дорожная карта

Функционал реализуется по шагам, описанным в
[`schedule/`](frontend/mentora-frontend/schedule/README.md):

`00` verify-setup → `01` auth → `02` courses-catalog → `03` course-editor
→ `04` learning-player → `05` checkout → `06` analytics-dashboard →
`07` polish-animations → `08` e2e-tests → `09` production-ready.

Каждая задача выполняется только по явной команде администратора —
см. правило #0 в [`CLAUDE.md`](frontend/mentora-frontend/CLAUDE.md).

## AI-first разработка

Репозиторий спроектирован так, чтобы AI-агент (Claude Code) мог работать
по явным, проверяемым правилам, а не по домыслам:

- [`CLAUDE.md`](frontend/mentora-frontend/CLAUDE.md) /
  [`AGENTS.md`](frontend/mentora-frontend/AGENTS.md) — архитектурные
  правила, workflow, политика `git`/`gh`, автомерж, скриншот-QA гейт.
- [`.agents/skills/`](frontend/mentora-frontend/.agents/skills/) —
  переиспользуемая экспертиза: дизайн-система Mentora, ревью кода,
  диагностика, плюс skills по анимации/UI-качеству от
  [Emil Kowalski](https://github.com/emilkowalski/skills) (MIT).
- [`.agents/STATE.md`](frontend/mentora-frontend/.agents/STATE.md) —
  маяк состояния: любая новая сессия агента читает его первым и не
  начинает реализацию функционала без явной команды.

## Лицензия

[MIT](./LICENSE) © 2026 DotNotFact
