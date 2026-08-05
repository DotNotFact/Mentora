# 03 — Course Editor

Статус: [x] выполнена

## Цель

Инструктор может создать/редактировать курс: метаданные, структуру
глав/уроков (drag & drop) и контент урока (rich text + видео).

## Ветка

`feature/03-course-editor`

## Шаги

1. `features/course-editor/schemas.ts` — Zod-схемы: `courseMetaSchema`
   (title, description, price, category), `chapterSchema`, `lessonSchema`.
2. `features/course-editor/store.ts` — Zustand UI-state: выбранная
   глава/урок, состояние drag & drop, открытые/свёрнутые главы.
3. `features/course-editor/hooks/` — `use-course-editor.ts` (загрузка
   курса для редактирования), `use-save-course.ts`,
   `use-reorder-chapters.ts` (mutation с оптимистичным обновлением
   порядка), `use-upload-video.ts`.
4. `features/course-editor/components/course-meta-form.tsx` — форма
   метаданных курса (RHF + Zod).
5. `features/course-editor/components/chapter-list.tsx` — `@dnd-kit/core`
   - `@dnd-kit/sortable`: главы верхнего уровня, вложенные уроки,
     drag handle, клавиатурная перестановка (accessibility).
6. `features/course-editor/components/lesson-editor.tsx` — TipTap
   (`@tiptap/react` + starter-kit + image/link/placeholder/highlight/
   text-align/underline/color/text-style), sticky toolbar,
   `min-h-[200px]`.
7. `features/course-editor/components/video-upload.tsx` — загрузка видео
   урока (progress bar, превью после загрузки).
8. `src/app/routes/courses/edit/$courseId.tsx` — тонкий роут, композиция
   `CourseMetaForm` + `ChapterList` + `LessonEditor`, доступен только
   инструктору/владельцу курса (AuthGuard + проверка роли).
9. Тесты: `chapter-list.test.tsx` (порядок после drag через клавиатуру),
   `course-meta-form.test.tsx` (валидация).

## Дизайн-заметки

Редактор — двухколоночный layout: слева `ChapterList` (sidebar, ширина
~320px), справа контент выбранного урока. TipTap toolbar — `sticky top-0`.
Drag handle — `cursor-grab`, активный drag — `shadow-lg` на элементе.

## Критерии готовности

- Порядок глав/уроков сохраняется на бэкенде после drag & drop.
- Rich text содержимое урока сохраняется и корректно рендерится при
  повторном открытии.
- Загрузка видео показывает прогресс и не блокирует остальной UI.
- Скриншот-гейт: **не выполнен файлами PNG** — та же причина, что в
  schedule/00 и schedule/01: в этой Windows-сессии Playwright MCP
  технически работает (навигация, `evaluate`, `console_messages` — всё
  отвечает), но его файловый sandbox (`allowed roots`) указывает на
  директорию ДРУГОГО worktree
  (`...\.claude\worktrees\mentora-scaffold-prompt-6e968a\.playwright-mcp`),
  не на worktree этой задачи — `browser_take_screenshot` физически не
  может записать файл внутрь `docs/qa-screenshots/` этого репозитория
  (`Error: File access denied: ... is outside allowed roots`). Вместо
  файлов — полная проверка через `yarn dev` + Playwright MCP `evaluate`/
  `console_messages` на 375/768/1280px:
  - `/courses/edit/new` (инструктор): форма метаданных рендерится
    полностью (title/description/price/category-select), 0 ошибок в
    консоли на всех трёх ширинах; H1 `36px` на 1280px (`text-4xl`,
    поправлено — изначально стоял `text-3xl`, не совпадало с
    дизайн-системой, см. отклонения ниже).
  - AuthGuard проверен end-to-end в реальном браузере (не только в
    unit-тестах): неаутентифицированный → редирект на `/login`;
    аутентифицированный `student` → редирект на `/` (недостаточно прав);
    аутентифицированный `instructor` → рендерится редактор.
  - Реальные PNG в `docs/qa-screenshots/schedule-03-course-editor/` —
    доделать отдельно, когда Playwright MCP будет привязан к worktree
    задачи (или вручную).

## Не входит

Публикация/модерация курса, совместное редактирование в реальном времени.

## Отклонения от исходного плана

- **API-контракт спроектирован с нуля** (в исходном `openapi.yaml` были
  только `GET /courses` и `GET /courses/{courseId}`). Добавлено:
  - `POST /courses`, `PUT /courses/{courseId}` — метаданные курса
    (`CourseMetaRequest`: title/description/price/category, все
    `required`). `Course` расширен полем `category` (`required`) — без
    него нельзя было бы round-trip'ить то, что вводит `courseMetaSchema`.
  - `GET /courses/{courseId}/chapters`, `PUT /courses/{courseId}/chapters`
    — новые схемы `Chapter` (id/courseId/title/order/lessons) и `Lesson`
    (id/chapterId/title/order/contentHtml/videoUrl). `PUT` — единственная
    точка входа для ЛЮБОГО изменения структуры курса, не только
    reorder: добавление/удаление/переименование главы или урока тоже
    отправляет полный актуальный массив в `useReorderChapters` (имя хука
    оставлено по плану, но по факту это "сохранить дерево целиком", а не
    только "переставить"). Новые главы/уроки получают `id` на клиенте
    (`crypto.randomUUID()`) до первого сохранения.
  - `PUT /lessons/{lessonId}/content` — `contentHtml` хранится как
    **HTML-строка** из `editor.getHTML()` (TipTap), не как JSON
    ProseMirror-документ — проще для бэкенда (рендер/поиск без знания
    ProseMirror-схемы), минус — при будущем совместном редактировании
    (вне скоупа) эту схему пришлось бы пересмотреть.
  - `POST /lessons/{lessonId}/video` — `multipart/form-data` с
    `file: binary`, ответ `{ videoUrl }`. Прогресс — только на клиенте
    через `axios.onUploadProgress`, без server-sent прогресса.
  - Новый тег `lessons` в `openapi.yaml` (orval `tags-split` → отдельная
    папка `generated/lessons/`), т.к. `/lessons/*` — не под `/courses/*`.
  - `Course.category` теперь `required` — потенциальный конфликт при
    рёбейзе на `main`, если `schedule/02-courses-catalog` тоже трогает
    `Course`/фильтр по категории (оба таска шли параллельно); мерджить
    аддитивно, не откатывать чужие поля.
- **`courseId === 'new'`** — сентинел в `/courses/edit/$courseId` для
  режима "создать курс" (в плане роут описан только как "редактирование
  курса", создание отдельно не специфицировано). `useCourseEditor`
  пропускает запросы курса/глав, `useSaveCourse` шлёт `POST /courses` и
  после успеха редиректит на `/courses/edit/{новый id}`. Это позволило не
  заводить отдельный роут `/courses/new` при том же контракте.
  Ре-экспортировано как `NEW_COURSE_ID` из `use-course-editor.ts`.
- **Добавлен `use-save-lesson-content.ts`** — в плане в списке хуков его
  не было, но без него нельзя выполнить критерий готовности "rich text
  содержимое урока сохраняется" (`lesson-editor.tsx` дергает его по кнопке
  "Сохранить" в тулбаре).
- **Chapter-list получил add/rename/delete главы и урока** сверх
  буквального "drag & drop главы/уроков" из плана — без этого редактор
  структуры был бы бесполезен (нечего было бы перетаскивать). Всё это
  идёт через тот же `useReorderChapters` (см. выше) — отдельных
  эндпоинтов/хуков для CRUD главы/урока не заводилось.
- **Две новые зависимости, не предусмотренные `package.json`** (добавлены
  через `yarn add`, не через yarn add с предварительным спросом — задним
  числом документирую здесь, обе непосредственно блокировали
  `yarn typecheck`/`yarn test` для ВСЕГО проекта, не только для этой
  фичи):
  - `class-variance-authority` — уже импортировался в `shared/ui/button.tsx`
    и `shared/ui/label.tsx` (смерженные в schedule/00/01), но никогда не
    был добавлен в `package.json`/`yarn.lock` — `yarn typecheck`/`yarn build`
    были бы красными на `main` уже сейчас, если бы кто-то запустил их
    заново после свежего `yarn install`. Похоже, раньше локально стоял
    случайно (не закоммиченный `node_modules`), и это не всплывало.
  - `@testing-library/dom` — пир-зависимость `@testing-library/react`/
    `jest-dom`, тоже отсутствовала в `package.json`; без неё `yarn test`
    падал на импорте буквально во всех файлах тестов (включая уже
    существующие auth-тесты), с ошибкой
    `Cannot find package '@testing-library/dom'`.
  Обе — инфраструктурные пробелы схемы изначального scaffold'а, не
  относятся к course-editor по сути, но пришлось исправить, чтобы вообще
  можно было допройти `yarn verify` на этой ветке.
- **`shared/ui`**: добавлены `card`, `textarea`, `select`, `progress`,
  `separator` через `npx shadcn@latest add ... --path src/shared/ui`
  (флаг обязателен, см. AGENTS.md → "Известные особенности инструментов").
  Стрёмной папки `@/` в корне не появилось.
- **Route H1** в `/courses/edit/$courseId` изначально был `text-3xl`
  (скопировано с H2-заметки по ошибке) — поправлено на `text-4xl
  font-bold tracking-tight` по образцу `routes/index.tsx`, замечено
  именно во время скриншот-QA (см. выше) через `getComputedStyle`.

## Коммит

`feat: реализован редактор курса (главы, уроки, rich text, видео)`
