# QA Screenshots

Визуальные доказательства прохождения скриншот-QA гейта для UI-задач из
`schedule/` (см. `AGENTS.md` → "Скриншот-QA гейт").

## Конвенция

```
docs/qa-screenshots/schedule-NN-<slug>/
├── mobile.png    (375px)
├── tablet.png    (768px)
└── desktop.png   (1280px)
```

Если задача покрывает несколько разных роутов (не один экран) — та же
тройка `mobile/tablet/desktop.png` кладётся в подпапку на каждый роут,
например `schedule-06-analytics-dashboard/{student,instructor,admin}/`.

Скриншоты снимаются через Playwright MCP, сверяются с
`.agents/skills/mentora-design/SKILL.md` (и, где применимо, с
`apple-design`/`review-animations`), коммитятся вместе с задачей и
вставляются в тело PR — GitHub рендерит PNG прямо в диффе и в описании
PR, ревьюер видит результат без запуска приложения.

Каждая подпапка — снимок состояния UI НА МОМЕНТ мержа соответствующей
задачи. При последующих правках того же экрана (например, в
`schedule/07-polish-animations.md`) — не перезаписывать старые снимки,
добавлять новые в подпапку актуальной задачи.
