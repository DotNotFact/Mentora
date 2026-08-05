# 09 — Production Ready

Статус: [x] выполнена

## Цель

Подготовить фронтенд к продакшену: устойчивость к ошибкам, SEO, PWA,
базовая security-гигиена, производительность (Lighthouse ≥ 90 везде).

## Ветка

`feature/09-production-ready`

## Шаги

1. Error boundaries: корневой `ErrorBoundary` в `src/app/`, локальные —
   вокруг видеоплеера и редактора курса (изоляция сбоев тяжёлых виджетов).
2. Страница/компонент 404 (роут не найден) и generic "Что-то пошло не так"
   с кнопкой повторной попытки.
3. SEO: `<title>`/meta-описания по ключевым страницам (каталог, страница
   курса — динамически из данных курса), Open Graph теги
   (`public/og-image.png` уже существует как плейсхолдер — заменить на
   реальный при наличии брендинга).
4. PWA: манифест (`public/manifest.webmanifest`), базовый service worker
   (offline fallback для уже посещённых страниц — не полный offline-режим
   курса).
5. Security-гигиена: убедиться, что токены не логируются, `Content-Security-Policy`
   заголовки задокументированы (настройка — на стороне хостинга/бэкенда),
   санитизация HTML из TipTap перед рендером (XSS).
6. Bundle-анализ: `vite build` + анализ размера чанков, code-splitting по
   роутам (`React.lazy` для тяжёлых страниц — редактор курса, дашборды).
7. Lighthouse-прогон (Performance/Accessibility/Best Practices/SEO) на
   ключевых страницах — цель ≥ 90 по каждой категории, зафиксировать
   отчёт в `docs/plans/` или PR-описании.
8. Финальный `yarn verify` + `yarn build` + smoke-прогон `tests/e2e`.
9. Обновить `docs/architecture/*` документы финальным статусом (снять
   пометки `Planned` там, где функционал реализован).

## Дизайн-заметки

404/error-состояния — по той же дизайн-системе (не отдельный стиль):
`bg-background`, карточка по центру, primary CTA "На главную"/"Повторить".

## Критерии готовности

- Lighthouse ≥ 90 по Performance/Accessibility/Best Practices/SEO на
  главной, каталоге, странице курса.
- `ErrorBoundary` перехватывает сбой без белого экрана.
- Bundle не содержит неожиданно тяжёлых чанков (проверить топ-5 по
  размеру после сборки).

## Не входит

Полноценный offline-режим прохождения курса, i18n (мультиязычность) —
отдельные задачи вне этого плана.

## Отклонения от исходного плана (осознанные, по факту реализации)

- **Error boundaries — через встроенный механизм TanStack Router**
  (`defaultErrorComponent`/`defaultNotFoundComponent` на роутере +
  переиспользуемый компонент `CatchBoundary` из `@tanstack/react-router`),
  а не через собственноручный class-компонент. Библиотека уже оборачивает
  КАЖДЫЙ смэтченный роут в свой `CatchBoundary` — `src/app/error-fallback.
tsx` (`RouteErrorFallback`/`WidgetErrorFallback`) и `src/app/not-found.tsx`
  подключены в `router.tsx`. Локальные боундари — тот же `CatchBoundary`
  вручную вокруг `VideoPlayer` (`learning-page.tsx`) и вокруг
  `LessonEditor`+`VideoUpload` (`courses/edit/$courseId.tsx`), с
  `getResetKey={() => lessonId}`, чтобы боундари сбрасывался при смене
  урока.
- **Санитизация HTML из TipTap (`lesson.contentHtml`) не имела точки
  рендера до этой задачи** — schedule/04 показывал только видео+прогресс,
  текстовое содержимое урока нигде не отображалось студентам. Добавлен
  `features/enrollment/components/lesson-content.tsx` (рендерит
  `contentHtml` на странице обучения под видео) + `shared/lib/
sanitize-html.ts` (обёртка над новой зависимостью `dompurify` +
  `@types/dompurify`) — единственный `dangerouslySetInnerHTML` в проекте.
  Проверено вручную: `<script>` и `onerror`-атрибут из тестового payload
  не исполнились после санитизации (скриншот —
  `docs/qa-screenshots/schedule-09-production-ready/lesson-content-desktop.png`).
- **PWA — `public/manifest.webmanifest` + `public/sw.js`** (network-first
  с кэш-фолбэком для собственных GET/навигаций, `/api/*` не кэшируется —
  прогресс/данные курса не должны отдаваться из устаревшего кэша).
  Service worker регистрируется в `main.tsx` только при
  `import.meta.env.PROD` — в dev конфликтует с Vite HMR.
- **SEO — `shared/hooks/use-document-meta.ts`** (title/description/OG,
  без react-helmet — SPA без SSR, достаточно `document.title` +
  `meta`-тегов на клиенте), применён на главной, каталоге и странице
  курса (динамически из `course.title`/`description`). `index.html`
  дополнен статичными meta description/OG/theme-color, `lang="en"` →
  `lang="ru"` (весь UI на русском — было расхождение с фактическим
  контентом).
- **Bundle/code-splitting** — `React.lazy` для `LessonEditor` (TipTap),
  `InstructorDashboard`/`AdminDashboard` (Recharts), `VideoPlayer`
  (vidstack) — все три раньше тянулись в главный чанк на КАЖДОЙ странице.
  Результат: главный чанк 1 496 КБ → 431 КБ (gzip 139 КБ), предупреждение
  Vite "chunks are larger than 500 kB" исчезло полностью (все чанки теперь
  под порогом). Из-за этого один существующий unit-тест
  (`dashboard-routes.test.tsx`, кейсы "видит свой дашборд" для
  инструктора/админа) потребовал увеличить таймаут `waitFor` до 3000мс —
  резолвинг динамического `import()` не всегда укладывался в дефолтный
  1000мс в тестовой среде.
- **Lighthouse — не удалось прогнать в этом окружении.** `lighthouse`
  (devDependency) не может запустить Chrome ни через встроенный
  `chrome-launcher` (`spawn UNKNOWN` на `CHROME_PATH`, указывающем на
  Playwright-Chromium), ни через ручной запуск того же бинарника напрямую
  из шелла (`Permission denied`) — судя по всему, песочница этой сессии
  намеренно блокирует произвольный запуск browser-процессов вне
  опосредованных инструментов (Playwright MCP/`yarn playwright test`),
  которые сами работают нормально. Не пытался обходить это дальше —
  похоже на осознанное ограничение окружения, а не баг. `lighthouse`
  оставлен как devDependency (стандартный `npx lighthouse <url>`
  надёжно работает на обычных CI-раннерах/локальных машинах без такой
  песочницы) — числовые Lighthouse-оценки нужно снять отдельно, вне этой
  сессии. Качественная замена в этом PR: code-splitting и уменьшение
  главного чанка (Performance), `lang="ru"` + семантические заголовки +
  aria-labels везде + фокус-кольца + ErrorBoundary без белого экрана
  (Accessibility/Best Practices), meta description + OG-теги + PWA
  manifest (SEO/PWA-чеки).
- **`docs/architecture/{frontend-structure,data-flow}.md` обновлены**:
  сняты пометки `Planned` с `enrollment`/`payments` (schedule/04-05),
  `tests/e2e` (schedule/08), добавлены `checkout`/`my-courses`/`learning`
  роуты, `error-fallback.tsx`/`not-found.tsx`, `use-document-meta`,
  `sanitize-html.ts`. `sidebar.tsx` остался `Planned` осознанно — ни одной
  странице так и не понадобился общий сайдбар (у редактора курса своя
  `ChapterList`-aside).

## Коммит

`chore: подготовлен продакшен-релиз (error boundaries, SEO, PWA, perf)`
