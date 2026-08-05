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

## Courses/Media — эндпоинты редактора курса (schedule/03)

Добавлены в `openapi/openapi.yaml` для покрытия `features/course-editor`
(бэкенда с этими маршрутами пока не существует — контракт спроектирован
фронтендом и ожидает реализации на стороне C#):

- `POST /courses`, `PUT /courses/{courseId}` — метаданные курса
  (title/description/price/category). `Course` теперь требует `category`
  (было опущено в исходном плейсхолдере).
- `GET /courses/{courseId}/chapters`, `PUT /courses/{courseId}/chapters` —
  дерево глав с вложенными уроками, каждый со своим `order`. `PUT` —
  единственная точка входа для ЛЮБОГО изменения структуры (создание,
  удаление, переименование, перестановка) — клиент всегда отправляет
  актуальный массив целиком; новые главы/уроки приходят с
  `id`-ом, сгенерированным на клиенте (`crypto.randomUUID()`), бэкенду
  нужно сделать upsert по этому id в рамках `courseId`.
- `PUT /lessons/{lessonId}/content` — rich-text содержимое урока.
  `contentHtml` — HTML-строка (результат `editor.getHTML()` из TipTap),
  **не** JSON ProseMirror-документ — так бэкенду не нужно тянуть
  ProseMirror-схему только для рендера/полнотекстового поиска.
  Компромисс: при необходимости совместного редактирования в будущем
  (явно вне скоупа schedule/03) эту схему хранения придётся пересмотреть.
- `POST /lessons/{lessonId}/video` — `multipart/form-data` (`file: binary`),
  ответ `{ videoUrl }`. Модуль Media должен принимать/хранить видеофайл
  и отдавать публичный/подписанный URL синхронно в ответе на этот запрос
  (фронтенд не опрашивает статус отдельно — прогресс отслеживается на
  клиенте через `axios.onUploadProgress`, не через сервер-side события).
