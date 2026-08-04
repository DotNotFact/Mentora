# Архитектура — Mentora Frontend

Этот раздел описывает архитектуру фронтенда Mentora: структуру папок,
границы модулей, поток данных и обоснование ключевых технических решений.

## Документы

- [frontend-structure.md](./frontend-structure.md) — дерево папок и
  назначение каждого слоя.
- [backend-modules.md](./backend-modules.md) — ожидаемая архитектура
  бэкенд-модулей (только документация — код бэкенда не создаётся отсюда).
- [data-flow.md](./data-flow.md) — поток данных API → hooks → state → UI.
- [design-system.md](./design-system.md) — ссылка на источник истины
  дизайн-системы.
- [decisions/](./decisions/) — Architecture Decision Records (ADR).

## Статус

Документы описывают ЦЕЛЕВУЮ архитектуру. Разделы, помеченные `Planned`,
ещё не реализованы в коде — они реализуются по мере прохождения задач из
`schedule/`. См. `.agents/STATE.md` за текущим статусом.
