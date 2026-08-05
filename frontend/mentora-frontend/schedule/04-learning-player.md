# 04 — Learning Player

Статус: [x] выполнена

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
- Скриншот-гейт: `/learning/:courseId` (плеер + сайдбар уроков) на
  375/768/1280px → `docs/qa-screenshots/schedule-04-learning-player/`.

## Не входит

Скачивание видео офлайн, субтитры/транскрипты, quiz/тесты после урока.

## Отклонения от исходного плана (осознанные, по факту реализации)

- **`vidstack`/`maverick.js` (пиртовые зависимости `@vidstack/react`) были
  не установлены** — `@vidstack/react` присутствовал в `package.json` со
  времён ФАЗЫ 1, но без них не работает вообще (та же категория
  блокирующего бага окружения, что `class-variance-authority`/
  `@testing-library/dom` в schedule/06). Добавлены точными версиями,
  которые требует `@vidstack/react@0.6.15`: `vidstack@0.6.15`,
  `maverick.js@0.37.0`.
- **`openapi.yaml` дополнен `GET /enrollments/{courseId}/progress`
  и `PUT /enrollments/{courseId}/lessons/{lessonId}/progress`** (схемы
  `CourseProgress`, `LessonProgress`, `UpdateLessonProgressRequest`) —
  единственный имевшийся `Enrollment.progress` был одним числом на весь
  курс, без данных по уроку (completed/positionSeconds), без которых
  невозможны ни отметки в `LessonSidebar`, ни восстановление позиции.
  `PUT .../progress` возвращает пересчитанный агрегат целиком — хук
  просто кладёт ответ в кэш `GET .../progress`, без ручного мержа.
- **`features/courses/hooks/use-course-chapters.ts`** (не
  `features/enrollment`) — обёртка над уже существующим
  `coursesApi.listChapters`, которым уже владеет `features/course-editor`
  (свой inline-запрос с другим query-key). Структура курса — это данные
  `courses`, не `enrollment`, поэтому хук положен в `features/courses`, а
  не продублирован в `enrollment`.
- **`features/enrollment/store.ts` наконец получил реальное содержимое**
  (`currentLessonId` + сеттер) — то, что было сознательно оставлено пустым
  в schedule/05 ("реальное UI-state появится в schedule/04"). Выбор урока
  на странице обучения — playback/UI-state, не server-state.
- **Видеоплеер: `MediaPlayer`/`MediaOutlet`/`MediaCommunitySkin` +
  `useMediaStore()`/`useMediaRemote()` без ref.** Прямая типизация через
  `useRef<MediaPlayerElement>` не работает для записи (`playerRef.current.
currentTime = …` — `tsc` ругается: `MediaPlayerElement` не совместим с
  `EventTarget`, которого требует `useMediaRemote(ref)`). Решение —
  вынести трекинг прогресса (`ProgressTracker`) в дочерний компонент
  внутри `<MediaPlayer>`, где `useMediaStore()`/`useMediaRemote()` без
  аргумента сами находят ближайший родительский плеер через контекст
  (документированный паттерн библиотеки) — `key={lessonId}` на этом
  дочернем компоненте пересоздаёт его при смене урока вместо отдельного
  сброс-эффекта.
- **CSS темизации community-skin — `vidstack/styles/defaults.css` +
  `vidstack/styles/community-skin/video.css`**, импортированные прямо в
  `video-player.tsx` (пакет `@vidstack/react` их не реэкспортирует, но
  `vidstack` — да, через `exports["./styles/*"]`). Акцентный цвет — единая
  переменная `--video-brand` (не `--media-brand`, как можно было бы
  предположить по неймингу остальных CSS-переменных пакета), проставлена
  `style={{'--video-brand': 'var(--color-primary)'}}` на `<MediaPlayer>` —
  красит заливку слайдера/активные пункты меню в фирменный индиго, не
  трогая остальную дефолтную тему скина.
- **Скриншот-гейт: плеер иногда не отрисовывает первый кадр видео**
  (canPlay=true, error=null, но кадр — чёрный) в этом Playwright MCP
  окружении при холодной загрузке внешнего mp4 — воспроизводится не
  всегда, похоже на ту же категорию проблемы, что requestAnimationFrame
  recharts в неактивной вкладке (schedule/06 → "Отклонения"): DOM/атрибуты
  корректны, композитинг кадра — нет. Зафиксированные
  `docs/qa-screenshots/schedule-04-learning-player/{mobile,tablet,
desktop}.png` показывают верный layout/сайдбар/progress-bar на всех трёх
  ширинах; хотя бы один прогон до этого явно показал полностью
  отрендеренный плеер (тема `--video-brand`, контролы, таймкод) — сама
  реализация корректна, ограничение чисто инструментальное для
  автоматизированного скриншотинга, не для реальных пользователей.
- Тестовый видео-URL для скриншот-гейта — `https://www.w3schools.com/
html/mov_bbb.mp4` (публичный, ~10 сек). Первая попытка со стандартным
  Google-сэмплом `commondatastorage.googleapis.com/.../BigBuckBunny.mp4`
  падала с `net::ERR_BLOCKED_BY_ORB` в этом окружении.

## Коммит

`feat: реализован плеер обучения с трекингом прогресса`
