# 06 — Analytics Dashboard

Статус: [ ] не начата

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

## Не входит

Экспорт отчётов в CSV/PDF, кастомные диапазоны дат с календарём (можно
ограничиться предустановленными периодами: 7/30/90 дней).

## Коммит

`feat: добавлены дашборды аналитики (студент, инструктор, админ)`
