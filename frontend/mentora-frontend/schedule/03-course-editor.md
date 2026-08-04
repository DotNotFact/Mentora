# 03 — Course Editor

Статус: [ ] не начата

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
- Скриншот-гейт: `/courses/edit/:courseId` (список глав + открытый
  редактор урока) на 375/768/1280px →
  `docs/qa-screenshots/schedule-03-course-editor/`.

## Не входит

Публикация/модерация курса, совместное редактирование в реальном времени.

## Коммит

`feat: реализован редактор курса (главы, уроки, rich text, видео)`
