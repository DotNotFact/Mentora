# 00 — Verify Setup

Статус: [ ] не начата

## Цель

Убедиться, что инфраструктура из Режима A действительно рабочая, собрать
минимальный работающий каркас приложения (root layout, базовый роутинг,
первый shadcn/ui компонент) — фундамент для всех последующих задач.

## Ветка

`feature/00-verify-setup`

## Шаги

1. `yarn install`, `yarn typecheck`, `yarn lint`, `yarn test`, `yarn build`,
   `yarn dev` — всё должно пройти без ошибок (0 errors, warnings — ок).
2. `npx shadcn@latest add button` — убедиться, что алиасы из
   `components.json` резолвятся правильно, компонент попадает в
   `src/shared/ui/`.
3. Собрать дерево роутов TanStack Router в `src/app/router.tsx` из файлов
   `src/app/routes/*` (пока только `__root.tsx` + `index.tsx` с текстом
   "Mentora").
4. Реализовать `src/app/layout/root-layout.tsx` (Outlet + шапка/подвал —
   минимально, без реального контента), подключить в `__root.tsx`.
5. Подключить `router.tsx` в `main.tsx` через `RouterProvider` вместо
   прямого рендера `<App />`.
6. Проверить `yarn dev` — открывается `/`, показывает "Mentora" через
   роутер, hot reload работает.
7. Обновить `docs/architecture/frontend-structure.md`, если структура
   разошлась с фактической.

## Дизайн-заметки

Ничего кастомного — просто убедиться, что base layout не ломает
Tailwind-токены из `.agents/skills/mentora-design/SKILL.md` (bg-background,
text-foreground).

## Критерии готовности

- `yarn verify` проходит целиком.
- `npx shadcn@latest add button` отрабатывает без ошибок алиасов.
- `/` рендерится через TanStack Router, а не напрямую через `<App />`.

## Не входит

Реальные страницы (login, courses, dashboard и т.д.) — только заглушки.
AuthGuard — будет в schedule/01.

## Коммит

`feat: проверена и завершена базовая инфраструктура (root layout + router)`
