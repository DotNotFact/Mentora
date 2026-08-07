# STATE — читать первым в каждой новой сессии

status: IN_PROGRESS: 17
lastUpdated: 2026-08-07
currentTask: schedule/17 (отзывы и рейтинги) реализована на ветке
  feature/17-course-reviews-ratings, verify зелёный (typecheck/lint/test/
  e2e/скриншот-гейт), PR открывается — после мержа вернуть статус в
  AWAITING_ADMIN_COMMAND. schedule/13,14,15,16,18,19,21 (аудит 2026-08-06)
  запускались параллельно через 7 изолированных worktree-агентов, все 7
  прервались на внешнем лимите API-сессии платформы (не код-ошибка) —
  ещё не перезапущены, остаются pending. schedule/20 (профиль
  инструктора) намеренно отложена до мержа 17 — оба трогают
  course-detail.tsx/course-card.tsx. Вне очереди по прямому запросу
  администратора отдельно выполнен редизайн (не из schedule/): дефолтная
  тема сменена на фиолетовую (dark-purple) + добавлен постраничный
  PageHeader-баннер — ветка design/purple-theme-and-page-headers, PR #29.
completedSchedules: [00-verify-setup, 01-auth, 02-courses-catalog, 03-course-editor, 06-analytics-dashboard, 05-checkout, 04-learning-player, 08-e2e-tests, 09-production-ready, 07-polish-animations, 10-design-overhaul-pixel-perfect, 11-settings-personalization, 12-dashboard-shell-navigation]

## Что это значит

- SCAFFOLD_IN_PROGRESS — идёт создание инфраструктуры (Режим A из CLAUDE.md).
  Реализация фич из schedule/ запрещена.
- SCAFFOLD_COMPLETE / AWAITING_ADMIN_COMMAND — инфраструктура готова и
  запушена. Ждём явной команды администратора на конкретную задачу
  из schedule/. НЕ начинать реализацию по общим фразам вроде "продолжай".
- IN_PROGRESS: <NN> — идёт реализация конкретной schedule-задачи NN.
  После завершения — вернуть статус в AWAITING_ADMIN_COMMAND.
- IN_PROGRESS: <NN,NN,...> (параллельно) — несколько задач выполняются
  одновременно, каждая в своём изолированном git worktree/ветке (см.
  AGENTS.md → "Параллелизация задач" и "Multi-agent"). Этот файл в таком
  режиме обновляет только оркестрирующая сессия (после того как все
  параллельные PR смержены), не сами параллельные агенты — иначе
  конкурентные правки этого файла конфликтовали бы друг с другом.

## Как обновлять

При переходе между состояниями — правь этот файл и коммить вместе с
основным изменением (`docs: обновлён STATE.md`).
