# STATE — читать первым в каждой новой сессии

status: IN_PROGRESS: 00
lastUpdated: 2026-08-05
currentTask: 00-verify-setup
completedSchedules: []

## Что это значит

- SCAFFOLD_IN_PROGRESS — идёт создание инфраструктуры (Режим A из CLAUDE.md).
  Реализация фич из schedule/ запрещена.
- SCAFFOLD_COMPLETE / AWAITING_ADMIN_COMMAND — инфраструктура готова и
  запушена. Ждём явной команды администратора на конкретную задачу
  из schedule/. НЕ начинать реализацию по общим фразам вроде "продолжай".
- IN_PROGRESS: <NN> — идёт реализация конкретной schedule-задачи NN.
  После завершения — вернуть статус в AWAITING_ADMIN_COMMAND.

## Как обновлять

При переходе между состояниями — правь этот файл и коммить вместе с
основным изменением (`docs: обновлён STATE.md`).
