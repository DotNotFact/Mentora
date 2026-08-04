# Schedule — пошаговый план реализации Mentora

## Режим работы — ВАЖНО

Ни одна задача не начинается автоматически. Агент реализует задачу ТОЛЬКО
после явной команды администратора вида "выполни schedule/NN". Прочитать
и понять план можно в любой момент — начинать писать код нельзя без команды.

## Как это работает (после команды администратора)

Полный процесс, включая скриншот-QA гейт и параллельный запуск задач —
в `AGENTS.md` → "Schedule-driven development", "Параллелизация задач",
"Скриншот-QA гейт". Кратко:

1. Прочитать эту страницу и файл конкретной задачи
2. Обновить .agents/STATE.md → IN_PROGRESS: NN
3. `git checkout -b feature/<slug> main` в изолированном git worktree
   (репозиторий — монорепо `DotNotFact/Mentora`, рабочая директория —
   `frontend/mentora-frontend/`)
4. Выполнить шаги, после каждого — typecheck + lint
5. Для UI-задач — обязательный скриншот-гейт (375/768/1280px,
   `docs/qa-screenshots/`) до отметки готовности
6. Статус задачи в файле → [x], коммит на русском (`git`)
7. `git push` → `gh pr create --fill` (тело PR — со скриншотами)
8. `yarn verify` зелёный → `gh pr merge --squash --delete-branch`
   автоматически (дефолтная политика, без доп. подтверждения на каждый
   мерж)
9. .agents/STATE.md → AWAITING_ADMIN_COMMAND
10. Остановиться и ждать следующей команды

`git` — для коммитов/веток, `gh` — для PR/CI. Один не заменяет другой.

## Статусы задач

[ ] не начата · [~] в процессе · [x] выполнена

## Порядок и параллелизация

`00-verify-setup` и `01-auth` — строго последовательно первыми (на них
завязано почти всё остальное). После них независимые фичи
(`02`, `03`, `06`) можно поручить параллельным изолированным агентам —
см. AGENTS.md → "Параллелизация задач". В любом случае: каждая задача
стартует только по отдельной явной команде администратора — порядковый
номер не даёт разрешения начинать без спроса.

## Список задач

- [00-verify-setup](./00-verify-setup.md) — проверка окружения, базовый layout, shadcn/ui
- [01-auth](./01-auth.md) — вход/регистрация, AuthGuard, JWT + refresh
- [02-courses-catalog](./02-courses-catalog.md) — каталог курсов, фильтры, CourseCard
- [03-course-editor](./03-course-editor.md) — редактор курса, главы/уроки, TipTap, загрузка видео
- [04-learning-player](./04-learning-player.md) — плеер обучения, прогресс, автозавершение
- [05-checkout](./05-checkout.md) — оплата, Stripe Checkout, "мои курсы"
- [06-analytics-dashboard](./06-analytics-dashboard.md) — дашборды, графики Recharts
- [07-polish-animations](./07-polish-animations.md) — анимации, transitions, доступность
- [08-e2e-tests](./08-e2e-tests.md) — Playwright по критическим путям, CI
- [09-production-ready](./09-production-ready.md) — error boundaries, SEO, PWA, security, Lighthouse
