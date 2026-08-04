# AGENTS.md — Mentora Frontend

(Всё из CLAUDE.md, плюс разделы ниже.)

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

В режиме B (schedule execution) коммит/push/PR/мерж разрешены только в
рамках УЖЕ одобренной администратором schedule-задачи, по процессу ниже
→ "Schedule-driven development" (включает автомерж PR после зелёного
`yarn verify`). НЕ создавать и НЕ пушить ветки/задачи, не названные
администратором явно.

## Красный список

Секреты в коде · console.log в проде · @ts-ignore без комментария ·
inline styles · прямой fetch/axios вне shared/api/ и features/*/hooks/ ·
default exports (только named) · PropTypes · moment.js (используй date-fns) ·
lodash (нативные методы или shared/lib/) · код в node_modules · мутация props.

---

## Workflow (Режим B — только по команде администратора)

Для задач, затрагивающих >3 файлов или >1 feature:

1. Создай план в docs/plans/YYYY-MM-DD-<slug>.md
2. Дождись approve администратора
3. Реализуй один атомарный шаг
4. Запусти узкую проверку (typecheck/lint изменённых файлов)
5. Покажи результат
6. Следующий шаг только после явного "ок, дальше"

Для простых задач (<3 файлов) — реализуй сразу с проверкой, но всё равно
только после того как задача была явно названа администратором.

## Architecture discovery gate

Перед созданием нового компонента/хука/утилиты/типа:

1. Поищи существующий в src/ по смыслу
2. Если найден — переиспользуй
3. Если похожий есть в shared/ — расширь, не дублируй
4. Если новый — создавай в правильном слое

## Инструменты: git vs gh

Это разные инструменты, `gh` НЕ заменяет `git`:

- **`git`** — вся работа с версионированием: `branch`, `commit`, `push`,
  `status`/`diff`/`log`. Базовый слой, без него `gh` не работает.
- **`gh`** (GitHub CLI) — GitHub-специфичные операции поверх git: `gh pr
create/view/merge`, `gh repo`, `gh issue`, `gh run` (просмотр CI). Внутри
  вызывает `git`.
- Практика: коммиты/ветки — через `git`; создание, проверка статуса и
  мерж PR — через `gh`, не через веб-интерфейс вручную.

## Schedule-driven development (только по команде)

1. Дождись явной команды администратора вида "выполни schedule/NN"
   (или список задач для параллельного запуска — см. "Параллелизация").
2. Прочитай `schedule/README.md` и файл конкретной задачи полностью.
3. Обнови `.agents/STATE.md`: currentTask = NN, status = IN_PROGRESS.
4. `git checkout -b feature/<slug> main` — при параллельном запуске
   нескольких задач каждая идёт в своём изолированном git worktree
   (см. "Multi-agent"), не в общей рабочей директории.
5. Реализуй шаги задачи, после каждого шага — typecheck/lint.
6. Если задача меняет UI — пройди скриншот-гейт (см. ниже) ДО того как
   отмечать задачу готовой.
7. Статус задачи в файле → `[x]`, `git commit` на русском.
8. `git push`, затем `gh pr create --fill` (тело PR — с картинками
   скриншотов, если применимо).
9. Если `yarn verify` зелёный (и CI, когда настроен) — `gh pr merge
--squash --delete-branch` автоматически. Это дефолтная политика для
   schedule-задач: не жди отдельного подтверждения на каждый мерж, если
   администратор явно не попросил обратное для конкретной задачи.
10. Обнови `.agents/STATE.md` → `AWAITING_ADMIN_COMMAND` (или следующий
    `currentTask`, если шла согласованная пачка задач).
11. Останавливайся после завершения запрошенной задачи/пачки — НЕ
    переходи к следующей самовольно.

## Параллелизация задач

- `00-verify-setup` и `01-auth` — строго последовательно и первыми: почти
  все остальные задачи зависят от роутинга, `AuthGuard` и
  `shared/api/client.ts`, которые здесь появляются.
- После того как `00`+`01` смержены в `main`, независимые по каталогам
  фичи можно запускать параллельно (отдельный изолированный агент/worktree
  на каждую): `02-courses-catalog`, `03-course-editor`,
  `06-analytics-dashboard` — они трогают разные `src/features/<name>/` и
  разные роуты, конфликтов почти не будет.
- `05-checkout` зависит от базового `enrollment` — после `02`.
  `04-learning-player` — после `01` и `05` (нужен прогресс записи).
- `07-polish-animations`, `08-e2e-tests`, `09-production-ready` —
  сквозные по всему приложению, запускаются только после того как их
  предшественники смержены, и строго последовательно (правят общий UI/CI).
- Если два параллельных таска оба должны менять один shared-файл (`api/
client.ts`, `app/router.tsx`, `app/layout/*`) — это сигнал
  переупорядочить задачи так, чтобы shared-файл трогала только одна из
  них, а не решать конфликт мержа постфактум.

## Скриншот-QA гейт (обязателен для UI-задач)

Применимо к любой задаче, добавляющей/меняющей UI (типично `00`–`07`; для
`08`/`09` — если меняются error-состояния/видимый UI).

1. Скриншоты через Playwright MCP на 3 ширинах: **375px** (mobile),
   **768px** (tablet), **1280px** (desktop).
2. Сверка с `.agents/skills/mentora-design/SKILL.md` (токены, spacing,
   паттерны компонентов) и, где применимо к анимации/интеракциям —
   `.agents/skills/apple-design/SKILL.md` +
   `.agents/skills/review-animations/SKILL.md`.
3. Сохранить в `docs/qa-screenshots/schedule-NN-<slug>/{mobile,tablet,
desktop}.png` и закоммитить вместе с задачей — GitHub рендерит PNG
   прямо в диффе PR, ревьюер видит результат визуально без запуска
   приложения.
4. Вставить эти же изображения в тело PR (`gh pr create --body`) через
   относительные markdown-ссылки — они отрендерятся прямо в описании PR.
5. Задача не отмечается `[x]`, пока скриншоты не приложены и явно не
   соответствуют дизайн-системе (или расхождение не объяснено в PR).

## Multi-agent

Один владелец на shared/-файлы (API-клиент, роуты, типы, layout)
одновременно. Не редактировать один файл параллельно из разных сессий.

Для параллельного запуска нескольких schedule-задач — каждая в своём
изолированном `git worktree` на отдельной ветке `feature/<slug>` (Agent
tool: `isolation: "worktree"`). Агенты не читают и не пишут в рабочие
директории друг друга; синхронизация — только через `main` после мержа
каждого PR.

## Монорепозиторий

Этот проект — подпапка `frontend/mentora-frontend/` в монорепозитории
`DotNotFact/Mentora`. Ветки/PR создаются относительно всего монорепо;
CI (`.github/workflows/ci.yml`) запускается только при изменениях внутри
`frontend/mentora-frontend/`.

## Известные особенности инструментов

- **`npx shadcn@latest add <component>` на Windows игнорирует alias-резолв
  из `components.json`/tsconfig и создаёт файлы по буквальному пути
  `@\shared\ui\...` (папку `@` в корне) вместо `src/shared/ui/...`. Не
  баг конкретно в `baseUrl` (он уже присутствует в `tsconfig.app.json` с
  `"ignoreDeprecations": "6.0"` — не убирать). Обходится явным флагом:
  `npx shadcn@latest add <component> --path src/shared/ui`. Если после
  установки появилась папка `@/` в корне проекта — это след старого
  поведения, удалить и повторить с `--path`.
- Плейврайт-скриншоты (скриншот-QA гейт) в этой Windows-среде иногда
  требуют, чтобы системный Chrome был доступен по пути, который ищет MCP
  (`npx playwright install --force chrome` при ошибке "Chromium
  distribution not found"). Если скриншоты недоступны из-за окружения —
  не выдавать программную проверку (computed styles, page text, консоль
  без ошибок) за скриншот; явно сообщить администратору о блокере и
  предложить доделать гейт отдельно, а не молча пропускать пункт.

## Safety

В рамках уже одобренной администратором schedule-задачи (или явно
согласованной пачки задач) без дополнительного спроса разрешено:
читать файлы, линтить/typecheck, `git status/diff/log`,
`git commit`/`git push` в свою `feature/<slug>` ветку, `gh pr create`,
`gh pr merge` (если `yarn verify` зелёный — см. "Schedule-driven
development").

Спросить сначала: `yarn add` новой зависимости, не предусмотренной
`package.json`, `git push --force`, `git reset`/`rebase` на чужие
коммиты, удаление файлов вне scope текущей задачи, любые изменения вне
границ, описанных в файле задачи, начало НОВОЙ schedule-задачи без явной
команды администратора.
