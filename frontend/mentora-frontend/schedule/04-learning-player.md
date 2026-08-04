# 04 — Learning Player

Статус: [ ] не начата

## Цель

Записанный на курс студент проходит уроки через видеоплеер, прогресс
сохраняется, урок автоматически отмечается пройденным на 90% просмотра.

## Ветка

`feature/04-learning-player`

## Шаги

1. `features/enrollment/schemas.ts` (если ещё не создано в schedule/05 —
   проверить порядок выполнения) — схема прогресса урока.
2. `features/enrollment/hooks/use-progress.ts` — `useQuery`
   (текущий прогресс по курсу) + `use-update-progress.ts` (mutation,
   debounce/throttle вызовов, чтобы не спамить бэкенд).
3. `features/enrollment/components/video-player.tsx` — `@vidstack/react`,
   `aspect-video`, кастомная Mentora-тема (цвета из design system),
   обработчик `onTimeUpdate` → расчёт % просмотра.
4. Логика автозавершения: при достижении 90% длительности — вызвать
   `use-update-progress` со статусом "completed" для урока.
5. `features/enrollment/components/lesson-sidebar.tsx` — список
   уроков курса с отметками пройден/не пройден, текущий урок подсвечен.
6. `features/enrollment/components/progress-bar.tsx` — `h-2 rounded-full`,
   анимация при изменении значения.
7. `src/app/routes/learning/$courseId.tsx` — тонкий роут: `VideoPlayer` +
   `LessonSidebar` + `ProgressBar` курса целиком, доступ только если
   пользователь записан на курс (AuthGuard + проверка enrollment).
8. Тесты: unit-тест на функцию расчёта 90%-порога, тест `progress-bar`
   рендера при разных значениях.

## Дизайн-заметки

Layout — видео на всю ширину контентной области сверху, `LessonSidebar`
справа на десктопе (`lg:w-80`), снизу списком на мобильном. Текущий урок
в сайдбаре — `bg-primary/10 border-l-2 border-primary`.

## Критерии готовности

- Прогресс сохраняется периодически (не на каждый `timeupdate` тик).
- Урок помечается пройденным ровно один раз при пересечении 90%.
- Обновление страницы восстанавливает позицию воспроизведения (если
  бэкенд её хранит) и список пройденных уроков.

## Не входит

Скачивание видео офлайн, субтитры/транскрипты, quiz/тесты после урока.

## Коммит

`feat: реализован плеер обучения с трекингом прогресса`
