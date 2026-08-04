# Schedule — пошаговый план реализации Mentora

## Режим работы — ВАЖНО

Ни одна задача не начинается автоматически. Агент реализует задачу ТОЛЬКО
после явной команды администратора вида "выполни schedule/NN". Прочитать
и понять план можно в любой момент — начинать писать код нельзя без команды.

## Как это работает (после команды администратора)

1. Прочитать эту страницу и файл конкретной задачи
2. Обновить .agents/STATE.md → IN_PROGRESS: NN
3. `git checkout -b feature/<slug> main` (репозиторий — монорепо
   `DotNotFact/Mentora`, рабочая директория — `frontend/mentora-frontend/`)
4. Выполнить шаги, после каждого — typecheck + lint
5. Статус задачи в файле → [x], коммит на русском
6. Если нужен PR — `gh pr create --fill` (без авто-мержа)
7. .agents/STATE.md → AWAITING_ADMIN_COMMAND
8. Остановиться и ждать следующей команды

## Статусы задач

[ ] не начата · [~] в процессе · [x] выполнена

## Порядок

00 → 01 → ... → 09, но каждая — только по отдельной команде. Порядковый
номер — рекомендация, не разрешение начинать без спроса.

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
