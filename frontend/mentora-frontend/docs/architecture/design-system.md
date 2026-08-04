# Design System

Источник истины — `.agents/skills/mentora-design/SKILL.md`. Этот документ
намеренно НЕ дублирует его содержимое (цвета, типографику, паттерны
компонентов, spacing, анимации) — только ссылается, чтобы избежать
расхождения двух копий одних и тех же правил.

Любой агент/разработчик, создающий или меняющий UI, обязан читать и
применять `.agents/skills/mentora-design/SKILL.md` (см. также
`.agents/skills/component-with-screenshot/SKILL.md` для цикла
"реализация → скриншот → сверка").

## Реализация токенов

CSS-переменные темы определены в `src/styles/globals.css` (`@theme` блок
Tailwind v4) и продублированы в `tailwind.config.ts` → `theme.extend.colors`
для совместимости с shadcn/ui и утилитами вида `bg-primary`.
