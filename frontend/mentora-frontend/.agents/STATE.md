# STATE — читать первым в каждой новой сессии

status: AWAITING_ADMIN_COMMAND
lastUpdated: 2026-08-05
currentTask: none
completedSchedules: [00-verify-setup, 01-auth, 02-courses-catalog, 03-course-editor, 06-analytics-dashboard, 05-checkout, 04-learning-player, 08-e2e-tests, 09-production-ready]

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
