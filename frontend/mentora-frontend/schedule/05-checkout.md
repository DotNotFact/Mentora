# 05 — Checkout

Статус: [ ] не начата

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

## Не входит

Возвраты/рефанды, подписочная модель, промокоды.

## Коммит

`feat: реализован чекаут (Stripe) и страница моих курсов`
