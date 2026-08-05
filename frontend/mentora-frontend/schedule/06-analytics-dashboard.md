# 06 — Analytics Dashboard

Статус: [x] выполнена

## Цель

Инструктор видит доходы и статистику зачислений по своим курсам; админ
видит агрегированную аналитику платформы. Студент видит свой прогресс на
персональном дашборде.

## Ветка

`feature/06-analytics-dashboard`

## Шаги

1. `features/analytics/schemas.ts` — схемы ответов аналитики
   (диапазон дат, метрики).
2. `features/analytics/hooks/use-instructor-analytics.ts` — `useQuery`
   поверх `GET /analytics/instructor`.
3. `features/analytics/hooks/use-admin-analytics.ts` — аналогично для
   агрегированной платформенной статистики (эндпоинт добавить в
   `openapi.yaml` при необходимости).
4. `features/analytics/components/revenue-chart.tsx` — Recharts
   (LineChart/AreaChart) доходов по периодам.
5. `features/analytics/components/enrollment-chart.tsx` — Recharts
   (BarChart) зачислений по курсам.
6. `features/analytics/components/stat-card.tsx` — карточка метрики
   (значение + дельта за период).
7. `src/app/routes/dashboard/index.tsx` — дашборд студента: прогресс по
   активным курсам (переиспользует прогресс из features/enrollment).
8. `src/app/routes/dashboard/instructor.tsx` — `RevenueChart` +
   `EnrollmentChart` + `StatCard` grid, `AuthGuard` + проверка роли
   instructor.
9. `src/app/routes/dashboard/admin.tsx` — платформенная аналитика,
   `AuthGuard` + проверка роли admin.
10. Тесты: рендер-тесты для `stat-card`, `revenue-chart` (моковые данные,
    проверка, что не падает на пустом наборе).

## Дизайн-заметки

Grid дашборда: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`. Графики —
`rounded-xl border p-6`, цвет линий/баров — primary/accent, tooltip —
`surface` фон с `shadow-md`. Пустое состояние (нет данных за период) —
текстовая заглушка по центру карточки, без падения графика.

## Критерии готовности

- Графики корректно рендерятся для реальных и пустых данных.
- Роль-based доступ: студент не видит instructor/admin дашборды и наоборот.
- Данные кэшируются TanStack Query с разумным `staleTime` (аналитика не
  обновляется поминутно).
- Скриншот-гейт: `/dashboard`, `/dashboard/instructor`,
  `/dashboard/admin` на 375/768/1280px →
  `docs/qa-screenshots/schedule-06-analytics-dashboard/`.
  **Выполнен** через Playwright MCP (не через панель Claude_Browser — см.
  "Отклонения от исходного плана").

## Не входит

Экспорт отчётов в CSV/PDF, кастомные диапазоны дат с календарём (можно
ограничиться предустановленными периодами: 7/30/90 дней).

## Отклонения от исходного плана (осознанные, по факту реализации)

- **Эндпоинт `GET /analytics/admin`** добавлен в `openapi.yaml` (в
  исходном плейсхолдере был только `/analytics/instructor`). Схема
  `AdminAnalytics` (все поля `required`, по конвенции `InstructorAnalytics`/
  `AuthResponse`/`User`):
  `totalRevenue`, `totalUsers`, `totalCourses`, `totalEnrollments`,
  `revenueChangePercent`, `userGrowthPercent`, `revenueByPeriod`
  (`RevenuePoint[]` — `{date, amount}`), `enrollmentsByCourse`
  (`CourseEnrollmentPoint[]` — `{courseId, courseTitle, enrollments}`,
  топ курсов платформы). Заодно расширил `InstructorAnalytics` теми же
  `revenueByPeriod`/`enrollmentsByCourse`/`revenueChangePercent`/
  `enrollmentsChangePercent` — без них `RevenueChart`/`EnrollmentChart`
  и дельта в `StatCard` были бы нечем наполнить (исходная схема имела
  только `totalRevenue`/`totalEnrollments`). Добавлен общий enum-схема
  `AnalyticsPeriod` (`7d|30d|90d`) и опциональный query-параметр `period`
  на оба GET-эндпоинта (пресеты, без кастомного диапазона — см. "Не
  входит"). `yarn api:generate` перегенерировал клиент;
  `analyticsApi = getAnalytics(apiClient)` добавлен в
  `shared/api/client.ts` рядом с существующим `authApi`, ничего не
  удалено.
- **Дашборд студента (`dashboard/index.tsx`) не переиспользует
  `features/enrollment`**, потому что этой фичи ещё не существует
  (schedule/04/05 не выполнены — идут параллельно только schedule/02, 03,
  06). Вместо фиктивных данных о прогрессе — честная заглушка: карточка
  "Пока нет активных курсов" с пояснением, что отслеживание прогресса
  появится после записи на курсы и обучающего плеера. Данных не
  запрашивается, никакого стора не создаётся — только `useAuthStore` для
  имени пользователя в заголовке. Разметка сохранена прямо в роуте (без
  выделения в `features/analytics`, т.к. это не аналитика и не должно
  жить в чужом feature-модуле — как только появится `features/enrollment`,
  эта страница естественно переедет туда).
- **Выбор периода (7/30/90 дней)** — локальный `useState` внутри
  `InstructorDashboard`/`AdminDashboard`, не Zustand-стор: это
  page-local UI-state, не переживающее уход со страницы, и явно попадает
  под правило CLAUDE.md #7 (Zustand — только когда состояние
  действительно нужно шарить/персистить).
- **`isAnimationActive={false}` на `Area`/`Bar`.** При проверке через
  Playwright обнаружилось, что recharts анимирует появление графика через
  `requestAnimationFrame`, который не тикает в неактивной/невидимой
  вкладке браузера — в таком состоянии график оставался пустым (оси и
  сетка есть, самих линий/столбцов не видно), хотя в DOM все `<path>` с
  правильными `d`/`fill`/`stroke` уже были. Отключение анимации входа
  чинит это и заодно уместнее для аналитического дашборда (статичные
  графики, не карусель).
- **Подписи оси X в `EnrollmentChart`** (названия курсов) на узких
  экранах накладывались друг на друга — добавлены `angle={-25}` +
  `textAnchor="end"` + увеличенный `height`/`margin.bottom`, вместо
  плоских горизонтальных подписей.
- **Найдены и исправлены два блокирующих бага окружения, не связанных с
  aналитикой напрямую**, без которых `yarn verify` не мог пройти вообще
  ни для одной задачи в репозитории:
  - `class-variance-authority` использовался в уже смерженных
    `shared/ui/button.tsx`/`label.tsx` (schedule/00/01), но не был
    объявлен в `package.json` — `tsc -b` падал на "Cannot find module".
    Добавлен как прямая зависимость (`yarn add class-variance-authority`).
  - `@testing-library/dom` — пиртовая зависимость `@testing-library/
    jest-dom`/`react`, тоже отсутствовала в `package.json` — `vitest run`
    падал на импорте до старта хотя бы одного теста. Добавлена как
    devDependency (`yarn add -D @testing-library/dom`).
  Оба факта задокументированы здесь по аналогии с тем, как schedule/00
  задокументировал найденный баг `vitest.config.ts`.
- **Node.js**: локальное окружение было на v22.16.0, а `jsdom@30` требует
  `^22.22.2`; `yarn install` падал на несовместимости движка. Переключился
  на v22.22.2 через `nvm4w` (`nvm install/use 22.22.2`) — не изменение
  кода, но фиксирую, т.к. без этого `yarn install` не проходит в этой
  Windows-среде.
- **Скриншот-гейт пройден через Playwright MCP, не через панель
  Claude_Browser** — та воспроизвела ту же проблему, что и в schedule/00/
  01 ("the Browser pane is not displayed, so the page is not compositing
  frames"), Playwright MCP сработал нормально на `yarn dev`. Реального
  бэкенда нет (это ещё скелет API), поэтому: (1) роль пользователя
  подставлялась напрямую в `localStorage['mentora-auth']` (тот же формат,
  что пишет `zustand/persist` в `features/auth/store.ts`), минуя форму
  логина; (2) чтобы скриншоты `dashboard/instructor` и `dashboard/admin`
  показывали настоящие графики с данными, а не состояние ошибки сети
  (реального `GET /analytics/*` ответить некому), локально поднимался
  временный Node-сервер-заглушка на `:5000` (совпадает с proxy-таргетом
  из `vite.config.ts`) с примерными данными, соответствующими схемам
  `InstructorAnalytics`/`AdminAnalytics`. Сервер и скрипт-заглушка жили
  только в `/tmp`-подобной scratch-директории, в репозиторий не попали и
  не коммитятся. Итог — 9 файлов в `docs/qa-screenshots/schedule-06-
  analytics-dashboard/{student,instructor,admin}/{mobile,tablet,
  desktop}.png` (расширил конвенцию `README.md` подпапками на роут, т.к.
  задача покрывает 3 разных роута, а не один экран).
- При проверке через реальный `yarn dev` (без моков, обычный 502 от
  недоступного бэкенда) подтвердилось, что `isError`-состояние
  (`Не удалось загрузить аналитику...`) рендерится корректно, без падения
  страницы — это тоже часть требования "графики не падают", просто не
  вошло в итоговые скриншоты гейта (там — успешный путь с данными, как
  и предполагает дизайн).

## Коммит

`feat: добавлены дашборды аналитики (студент, инструктор, админ)`
