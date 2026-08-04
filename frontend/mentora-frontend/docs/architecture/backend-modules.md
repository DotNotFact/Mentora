# Backend Modules (документация — не код)

Статус: Planned. Этот документ описывает ОЖИДАЕМУЮ структуру бэкенда
(C# ASP.NET Core), с которым интегрируется данный фронтенд. Бэкенд-код не
создаётся из этого репозитория — только контракт (`openapi/openapi.yaml`)
и ожидания по модулям, чтобы фронтенд-фичи и schedule-задачи были
согласованы с бэкенд-доменом.

## Ожидаемые модули бэкенда

| Модуль      | Ответственность                                                   | Связанная frontend-фича                      |
| ----------- | ----------------------------------------------------------------- | -------------------------------------------- |
| Auth        | Регистрация, вход, JWT + refresh, роли (student/instructor/admin) | `features/auth`                              |
| Courses     | CRUD курсов, главы, уроки, публикация                             | `features/courses`, `features/course-editor` |
| Media       | Загрузка/хранение видео и изображений уроков                      | `features/course-editor` (video-upload)      |
| Enrollments | Запись на курс, прогресс по урокам                                | `features/enrollment`                        |
| Payments    | Интеграция со Stripe Checkout, вебхуки статуса оплаты             | `features/payments`                          |
| Analytics   | Агрегация доходов/зачислений для instructor/admin                 | `features/analytics`                         |

## Контракт

Единственный канал синхронизации фронтенда с этими модулями —
`openapi/openapi.yaml` (см. `openapi/README.md`). Любое расширение
бэкенд-API должно сначала попасть в спеку, только потом использоваться в
`features/*/hooks/`.

## Аутентификация

Ожидается JWT access-токен (short-lived) + refresh-токен (long-lived).
Фронтенд хранит их согласно `features/auth/store.ts` (schedule/01) и
обновляет через `src/shared/api/client.ts`.
