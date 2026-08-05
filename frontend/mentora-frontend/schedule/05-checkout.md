# 05 — Checkout

Статус: [x] выполнена

## Цель

Студент может оплатить курс через Stripe Checkout и получить доступ к
обучению сразу после успешной оплаты; видит список купленных курсов.

## Ветка

`feature/05-checkout`

## Шаги

1. `features/payments/schemas.ts` — схема запроса чекаута (`courseId`).
2. `features/payments/hooks/use-create-checkout.ts` — mutation
   `POST /payments/checkout`, редиректит на `checkoutUrl` (Stripe
   Checkout, hosted page — редирект вовне приложения).
3. `features/payments/hooks/use-checkout-status.ts` — поллинг статуса
   сессии оплаты после возврата пользователя со Stripe (`useQuery` с
   `refetchInterval`, остановка после успешного/финального статуса).
4. `features/enrollment/schemas.ts`, `store.ts`, `hooks/use-enroll.ts` —
   если курс бесплатный (или уже оплачен) — прямая запись без Stripe.
5. `src/app/routes/checkout/$courseId.tsx` — тонкий роут: краткая карточка
   курса + кнопка "Оплатить", состояние ожидания редиректа.
6. Страница возврата после оплаты (success/cancel) — показывает
   результат поллинга статуса, кнопка "Начать обучение" →
   `ROUTES.learning(courseId)`.
7. `features/enrollment/components/my-courses-grid.tsx` — список курсов
   пользователя с прогрессом (переиспользует `CourseCard` из
   features/courses, расширенный `Progress`).
8. `src/app/routes/my-courses.tsx` — тонкий роут, `AuthGuard`.
9. Тесты: unit-тест на `use-checkout-status` (мок API, разные статусы),
   тест рендера `my-courses-grid` для пустого/непустого списка.

## Дизайн-заметки

Checkout-страница — минималистична, один CTA, без отвлекающих элементов
(доверие к платежу). Статус поллинга — spinner + текст "Проверяем оплату…".
PricingCard (если используется на странице курса) — `rounded-xl border-2`,
`border-primary` + бейдж "Популярный" для рекомендованного тарифа.

## Критерии готовности

- Успешная оплата приводит к доступу на `/learning/:courseId`.
- Отменённая оплата возвращает пользователя на страницу курса без записи.
- `my-courses` показывает все курсы, на которые пользователь записан
  (оплаченные и бесплатные).
- Скриншот-гейт: `/checkout/:courseId` и `/my-courses` на
  375/768/1280px → `docs/qa-screenshots/schedule-05-checkout/`.

## Не входит

Возвраты/рефанды, подписочная модель, промокоды.

## Отклонения от исходного плана (осознанные, по факту реализации)

- **`openapi.yaml` дополнен тремя эндпоинтами**, которых не было в
  плейсхолдере: `GET /payments/sessions/{sessionId}` (поллинг статуса,
  схемы `CheckoutSessionStatus`/`CheckoutSessionStatusValue`),
  `GET /enrollments` (список курсов пользователя с прогрессом — схема
  `EnrollmentWithCourse` = `Enrollment` + вложенный `course`) и
  `GET /enrollments/{courseId}` (проверка, записан ли пользователь на
  конкретный курс; 404 — ожидаемый ответ "не записан", не ошибка).
  Заодно добавлен `security: [bearerAuth]` на `POST /enrollments` и
  `POST /payments/checkout` — в исходном плейсхолдере они были без него,
  хотя обе мутации всегда выполняются от лица текущего пользователя.
  `yarn api:generate` перегенерировал клиент; `enrollmentsApi`/
  `paymentsApi` добавлены в `shared/api/client.ts`.
- **`src/app/routes/learning/$courseId.tsx` зарегистрирован в роутере
  как честная заглушка** (по аналогии с приёмом из
  `dashboard/index.tsx` в schedule/06), а не оставлен нерегистрированным
  TODO-стабом. Без этого критерий готовности "успешная оплата приводит к
  доступу на `/learning/:courseId`" не проверить — клик по "Начать
  обучение" вёл бы на несуществующий роут (404), а не к "доступу открыт".
  Сам плеер (VideoPlayer/LessonSidebar/ProgressBar) — по-прежнему
  предмет schedule/04, эта заглушка будет заменена его роутом.
- **`features/courses/components/course-detail.tsx` подключён к
  реальному enrollment/checkout-флоу** вместо плейсхолдера
  "Запись на курс появится в ближайшем обновлении" (тот placeholder сам
  указывал на schedule/05 как на момент реализации). CTA теперь:
  неаутентифицированный → "Войти"; уже записан → "Продолжить обучение";
  бесплатный курс → прямая запись (`useEnroll`); платный → переход на
  `/checkout/:courseId`. Формально файл не в списке шагов schedule/05, но
  это единственная точка входа в чекаут из каталога/страницы курса.
- **`features/enrollment/store.ts` оставлен нетронутым TODO-стабом.**
  У `/checkout`/`/my-courses` нет UI-state, которым стоило бы управлять
  через Zustand (модалок/фильтров нет, вся видимая часть — server-state
  через TanStack Query) — пустой стор ради пустого стора противоречил бы
  CLAUDE.md #7. Реальное UI-state (позиция воспроизведения) появится в
  schedule/04.
- **`<Link>` на `/learning/:courseId`/`/checkout/:courseId` — через
  типизированные `to="/…/$courseId"` + `params`**, а не через строку из
  `ROUTES.*(courseId)` (та осталась для мест вне `<Link>`, например
  `window.location.assign`). TanStack Router с зарегистрированным
  `Register.router` типизирует `to` по фактическому дереву роутов —
  `ROUTES.checkout(courseId)` возвращает широкий `string`, что не
  проходит `tsc -b`. Тот же паттерн уже был в `course-card.tsx`.
- **Тесты** лежат в `tests/components/features/{payments/hooks,
enrollment}/`, а не рядом с исходниками в `src/` — в кодовой базе с
  schedule/02/03/06 уже сложилась именно эта конвенция (см.
  `tests/components/features/courses/`), хотя `vitest.config.ts`
  формально допускает оба варианта (`include` покрывает и `src/**`, и
  `tests/components/**`).
- **Скриншот-гейт пройден через Playwright MCP** (`browser_run_code_
unsafe`, реальный `page`-объект), не через панель `Claude_Browser` — та
  же причина, что в schedule/00/01/06 (страница не композитит кадры в
  этой панели). Реального бэкенда нет, поэтому: (1) `localStorage['
mentora-auth']`/`mentora.accessToken`/`mentora.refreshToken` посеяны
  напрямую в том же формате, что пишет `zustand/persist`, минуя форму
  логина; (2) `page.route('**/api/**', …)` перехватывал запросы к
  `/courses/course-1` и `/enrollments`, отдавая моковые данные по схемам
  `Course`/`EnrollmentWithCourse` — без этого `/checkout/:courseId`
  показал бы состояние сетевой ошибки, а не оформленную страницу.
  Перехват/сид жили только в теле Playwright-скрипта этой сессии, в
  репозиторий не попали. Итог — 6 файлов в `docs/qa-screenshots/
schedule-05-checkout/{checkout,my-courses}/{mobile,tablet,desktop}.png`
  (подпапка на роут — та же конвенция расширения `README.md`, что и в
  schedule/06).

## Коммит

`feat: реализован чекаут (Stripe) и страница моих курсов`
