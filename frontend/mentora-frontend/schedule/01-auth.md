# 01 — Auth

Статус: [x] выполнена

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
- Скриншот-гейт: **не выполнен** — та же причина, что в schedule/00
  (Playwright MCP не находит Chrome по ожидаемому пути, панель браузера
  не рендерит кадр для скриншота в этой Windows-сессии). Вместо файлов —
  прямая проверка через DOM/JS в реальном dev-сервере: submit пустой
  формы `/login` даёт `["Введите email","Минимум 8 символов"]` в
  `<FormMessage>`, консоль без ошибок. Плюс 13 автотестов (unit +
  интеграционные), которые как раз и покрывают ровно то, что должен был
  показать скриншот (пустая форма, ошибки валидации, успешный сабмит,
  ошибка API). Реальные PNG — доделать отдельно.

## Отклонения от исходного плана (осознанные, по факту реализации)

- `accessToken` НЕ хранится в самом Zustand-сторе (в отличие от
  буквальной формулировки шага 2) — токены живут в
  `shared/lib/token-storage.ts`, отдельном модуле поверх `localStorage`,
  который читают и `shared/api/client.ts` (интерсепторы — не React,
  не могут подписаться на Zustand), и `features/auth/store.ts`
  (`setSession`/`clearSession` синхронизируют оба места). Стор хранит
  только `user`/`isAuthenticated` — то, что реально нужно для
  реактивного UI. Так меньше источников истины для секрета и не задвоено
  в персисте.
- Добавлен `POST /auth/logout` в `openapi.yaml` (в исходном плейсхолдере
  не было) — `use-logout` инвалидирует refresh-токен на сервере, а
  локальную сессию чистит в любом случае (`onSettled`), даже если запрос
  не удался.
- В `openapi.yaml` схемы (`AuthResponse`, `User` и др.) не были помечены
  `required` — orval генерировал всё как `optional`. Проставил `required`
  везде по смыслу и перегенерировал клиент: типы теперь строгие
  (`accessToken: string`, не `accessToken?: string`), как и должно быть
  при `TypeScript strict`.
- `shared/types/index.ts` содержал собственноручный `UserRole`,
  задублированный со сгенерированным типом — удалён по правилу
  CLAUDE.md #19.

## Не входит

Восстановление пароля, OAuth-провайдеры, email-подтверждение — не в этой
версии, если не оговорено отдельно.

## Коммит

`feat: реализована аутентификация (вход, регистрация, AuthGuard)`
