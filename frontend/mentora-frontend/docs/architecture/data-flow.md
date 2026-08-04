# Data Flow

Статус: Planned (шаблон потока — наполняется по мере прохождения
schedule-задач).

## Server-state (данные с бэкенда)

```
openapi.yaml → orval codegen → src/shared/api/generated/
                                        │
                                        ▼
                    features/<name>/hooks/*.ts (TanStack Query)
                                        │
                                        ▼
                    features/<name>/components/*.tsx (useQuery/useMutation)
```

- Единственный источник server-state — TanStack Query. `useEffect` для
  загрузки данных с API не используется.
- Мутации инвалидируют связанные query keys вручную (см. `create-hook.md`
  в `.agents/prompts/`) или используют оптимистичные обновления, где это
  оправдано (например, порядок глав в `course-editor`).

## UI-state (клиентское состояние)

```
features/<name>/store.ts (Zustand) → components (useXStore)
```

- Хранит только то, что не приходит с сервера: открытые модалки, фильтры
  до применения, позиция плеера, выбранный элемент в редакторе.
- `features/auth/store.ts` — исключение: хранит сессию (`user`,
  `accessToken`) с `persist` middleware, так как это должно переживать
  перезагрузку страницы быстрее, чем успевает отработать первый запрос.

## Формы

```
Zod schema (features/<name>/schemas.ts)
        │
        ▼
react-hook-form + @hookform/resolvers/zod
        │
        ▼
onSubmit → TanStack Query mutation → API
```

## Axios interceptors

```
Request  → добавление Authorization: Bearer <accessToken>
Response → 401 → попытка refresh (см. src/shared/api/client.ts) →
           повтор исходного запроса или разлогин при неудаче
```
