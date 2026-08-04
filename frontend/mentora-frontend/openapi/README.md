# OpenAPI

`openapi.yaml` — источник истины для API-контракта фронтенда.

## Синхронизация с бэкендом

1. Бэкенд (C# ASP.NET Core) отдаёт Swagger/OpenAPI JSON, обычно на
   `https://<backend-host>/swagger/v1/swagger.json`.
2. Скачать/скопировать актуальную спецификацию и заменить содержимое
   `openapi.yaml` (конвертировать JSON → YAML при необходимости).
3. Перегенерировать клиент:

```bash
yarn api:generate
```

4. Проверить, что `src/shared/api/generated/` собрался без ошибок и
   `yarn typecheck` проходит.

## Правила

- `src/shared/api/generated/` не редактируется вручную — это выход orval.
- Новый эндпоинт бэкенда → сначала попадает в `openapi.yaml`, только потом
  используется в хуках `features/*/hooks/`.
- Текущая версия файла — минимальный плейсхолдер-скелет (auth/courses/
  enrollments/payments/analytics) для первого прогона кодогенерации, пока
  реальный бэкенд-контракт не подключён.
