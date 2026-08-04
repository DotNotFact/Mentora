# 01 — Auth

Статус: [ ] не начата

## Цель

Студент/инструктор/админ могут зарегистрироваться и войти, сессия
сохраняется между перезагрузками, защищённые роуты недоступны без входа.

## Ветка

`feature/01-auth`

## Шаги

1. `features/auth/schemas.ts` — Zod-схемы `loginSchema`, `registerSchema`
   (email, password, fullName для регистрации).
2. `features/auth/store.ts` — Zustand store с `persist` middleware:
   `user`, `accessToken`, `isAuthenticated`, `setSession`, `clearSession`.
   Только UI/session-state, не дублировать данные пользователя из API-кэша
   сверх необходимого для быстрого рендера шапки.
3. `features/auth/hooks/use-login.ts`, `use-register.ts`,
   `use-logout.ts` — TanStack Query mutations поверх сгенерированного
   API-клиента (`POST /auth/login`, `/auth/register`).
4. Обновить `src/shared/api/client.ts`: убедиться, что access/refresh
   логика (см. TODO в файле) подключена к реальным эндпоинтам из
   `openapi.yaml`.
5. `features/auth/components/login-form.tsx`,
   `features/auth/components/register-form.tsx` — React Hook Form + Zod
   resolver, shadcn/ui Input/Button/Form.
6. `src/app/routes/login.tsx`, `register.tsx` — тонкие роуты, импортируют
   формы из features/auth.
7. `src/shared/hooks` или `src/app` — компонент `AuthGuard`
   (redirect на /login, если не аутентифицирован); обернуть защищённые
   роуты (`dashboard/*`, `my-courses`, `courses/edit/*`, `checkout/*`).
8. Обновить `src/app/layout/header.tsx` — состояние
   "войти" / "аватар + выйти" по `useAuthStore`.
9. Тесты: `login-form.test.tsx`, `register-form.test.tsx` (валидация,
   успешный сабмит, показ ошибок API), unit-тест на `use-login`.

## Дизайн-заметки

Формы — карточка `rounded-xl shadow-sm p-6` по центру, max-w-md. Кнопка
сабмита — primary, full width. Ошибки поля — `text-destructive text-sm`
под инпутом. Состояние загрузки — disabled + спиннер в кнопке.

## Критерии готовности

- Регистрация создаёт пользователя и сразу логинит (или редиректит на
  /login с сообщением — уточнить по бэкенду).
- Вход сохраняет токены, `AuthGuard` пускает на защищённые роуты.
- Обновление страницы не разлогинивает (persist).
- 401 на защищённом запросе триггерит refresh-flow из `client.ts`.
- Скриншот-гейт: `/login` и `/register` (пустая форма + состояние с
  ошибкой валидации) на 375/768/1280px →
  `docs/qa-screenshots/schedule-01-auth/`.

## Не входит

Восстановление пароля, OAuth-провайдеры, email-подтверждение — не в этой
версии, если не оговорено отдельно.

## Коммит

`feat: реализована аутентификация (вход, регистрация, AuthGuard)`
