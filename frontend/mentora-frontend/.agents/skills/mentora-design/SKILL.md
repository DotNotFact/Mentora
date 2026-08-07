---
name: mentora-design
description: Mentora LMS design system constraints. ALWAYS apply when creating or modifying UI.
---

# Mentora Design System

> Craft-level baseline: a warm-neutral, minimal-radius dashboard aesthetic
> (2026-08-07 redesign — see "Themes") — flat, low-contrast surfaces, near-
> square corners, restrained near-invisible shadows, ONE saturated accent
> color popping against an otherwise desaturated warm-gray UI. This is a
> deliberate pivot away from this file's earlier "AAA-glow/rounded-2xl"
> guidance (softer corners, colored glow shadows) — flat and sharp is now
> correct, not a regression. Mentora's palette is themeable since
> schedule/11 (2026-08-06) — see "Themes" below — but the STRUCTURE is
> fixed: violet primary/amber accent by default, and every theme keeps the
> same token roles (primary/accent/success/destructive stay semantically
> stable across themes). Don't introduce ad-hoc new colors outside the
> theme system to chase this look; the lift comes from spacing, typography
> and state design, not new hues or shadow tricks.

## Colors

Brand/status tokens — the ones you reach for directly when building UI.
Values below are the `dark-purple` theme (the default since 2026-08-06,
re-based 2026-08-07 onto a warm-neutral reference palette — see
"Themes"). See "Themes" for the other 4 presets and how values swap at
runtime:

| Token            | Value                                                                                                  | Usage                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| primary          | #8B5CF6 (violet-500)                                                                                   | Buttons, links, active states                   |
| primary-hover    | #A78BFA (violet-400, lighter than base — dark-mode hover brightens)                                    | Hover (named-token cases only)                  |
| accent           | #F59E0B (amber-500)                                                                                    | CTAs, progress, badges — same across all themes |
| background       | #262624 (warm stone, near-black with a faint yellow/olive cast — NOT neutral slate, NOT violet-tinted) | Page background                                 |
| foreground       | #C3C0B6 (warm off-white/cream, not pure white)                                                         | Primary text                                    |
| muted-foreground | #B7B5A9 (dimmer warm gray)                                                                             | Secondary text                                  |
| destructive      | #EF4444 (red-500)                                                                                      | Errors — same across all themes                 |
| success          | #10B981 (emerald-500)                                                                                  | Completed states — same across all themes       |

shadcn/ui contract tokens — every color above (and below) also has its
`-foreground` pair generated in `src/styles/globals.css`; use these when
composing shadcn primitives (Button, Card, Dialog, Input…), not just the
brand table:

| Token          | Value               | Usage                                                                                                                                                         |
| -------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| card / popover | #262624 / #30302E   | Card = SAME value as background (flat, not "raised" — see "Themes"); popover one step lighter, for menus/dialogs that need to visually separate from the page |
| sidebar        | #1F1E1D             | Sidebar/MobileNav background — darker than page background, recedes rather than raises (new token, see "Themes")                                              |
| secondary      | #30302E             | Low-emphasis buttons/badges backgrounds                                                                                                                       |
| muted          | #1B1B19             | Subtle backgrounds (disabled, skeleton) — darker/"sunken", not lighter, than card                                                                             |
| border, input  | #3E3E38 / #52514A   | Borders, input outlines                                                                                                                                       |
| ring           | #8B5CF6 (= primary) | Focus ring                                                                                                                                                    |

Не путать `muted` (светлый фон) и `muted-foreground` (серый текст) —
это разные токены с разными значениями, несмотря на общий "muted"
в названии.

### Hover / active states

Only `primary` has a dedicated named hover token (`--color-primary-hover`
/ `bg-primary-hover`). Every other brand/status color derives its
interactive states via opacity modifiers instead of new tokens — this is
intentional, don't add `accent-hover`, `success-hover`, etc. to
`globals.css`:

- Hover: `/90` opacity (`hover:bg-primary/90`, `hover:bg-destructive/90`).
- Active/pressed: `/80` opacity (`active:bg-primary/80`).
- Subtle hover on low-emphasis surfaces (secondary buttons, ghost/outline
  buttons, list rows): `/80` on the base color, or switch to `secondary`.
- `bg-primary-hover` (the named token) is reserved for places opacity
  compositing looks wrong against a non-white ancestor — e.g. gradients,
  or a primary-colored parent where `/90` would blend with the wrong
  backdrop. Default to the opacity modifier unless you hit that case.

## Themes

5 готовых тем (schedule/11, 2026-08-06) — `shared/config/themes.ts`
(метаданные для UI: id/название/превью) + `src/styles/globals.css`
(фактические значения токенов). Дефолт — `dark-purple`, НЕ светлая тема.

**2026-08-07 — 2й проход редизайна `dark-purple`.** Администратор указал
конкретный дизайн-референс (тёплая нейтральная палитра, почти прямые
углы, едва заметные тени) и попросил взять его палитру/структуру за
основу, заменив его оранжевый primary на фиолетовый. Токены референса
извлечены из его живого CSS (computed `oklch()` → hex) и адаптированы
под роли токенов Mentora — palette values ARE the reference's actual
tokens with only the primary hue swapped, structure otherwise unchanged:
теплый серый (warm stone, едва жёлтый подтон) вместо холодного slate
и вместо фиолетового тинта 1го прохода (2026-08-06, `#0F0A19`/`#1A1425`
— полностью заменён, тот вариант устарел).

| id           | primary | Поверхности                                                                                         |
| ------------ | ------- | --------------------------------------------------------------------------------------------------- |
| dark-purple  | #8B5CF6 | тёплые нейтральные (warm stone): background/card #262624, sidebar #1F1E1D, popover #30302E (дефолт) |
| dark-indigo  | #6366F1 | нейтральные холодные (slate): background #020617, card #0F172A                                      |
| dark-green   | #10B981 | те же холодные slate-поверхности, что и dark-indigo                                                 |
| dark-red     | #F43F5E | те же холодные slate-поверхности                                                                    |
| light-indigo | #6366F1 | background #F8FAFC, card #FFFFFF (исходная светлая палитра)                                         |

Механика: `@theme` в `globals.css` объявляет `--color-primary: var(--theme-primary)`
и т.д. (не прямые hex-значения) — Tailwind генерирует утилиты
(`bg-primary`) один раз при сборке, но их значения читаются в рантайме
из `--theme-*`, которые переопределяются на `[data-theme="..."]`. Смена
темы = смена одного атрибута на `<html>`, без пересборки CSS и без
перезагрузки страницы. `accent`/`success`/`destructive` НЕ варьируются
по темам (остаются amber/emerald/red во всех пяти) — только
`primary`/`primary-hover`/`ring`, весь набор поверхностей
(background/card/popover/sidebar/secondary/muted/border/input/foreground/
-foreground-пары), и — только для `dark-purple`, глобально, не per-theme
— радиус/тени (см. "Border radius" и "Elevation" ниже).

Структура поверхностей `dark-purple` — намеренно ПЛОСКАЯ, не "приподнятая
панель поверх фона" (в отличие от трёх нейтральных тёмных тем и правила
"elevation" в старых записях этого файла):

- `card` буквально равен `background` (`#262624` = `#262624`) — карточки
  НЕ на шаг светлее страницы, разделяются только тонким `border`, не
  контрастом фона. `popover`/dropdown-меню — на шаг светлее (`#30302E`),
  им нужно визуально оторваться от страницы под собой.
- `muted` (`#1B1B19`) ТЕМНЕЕ `card`, а не светлее — "утопленная" панель
  (disabled/skeleton-фон), инверсия привычной иерархии.
- `sidebar` (`#1F1E1D`, новый токен) — отдельная, более тёмная
  поверхность: сайдбар/`MobileNav` "уходят" в тень, не служат ещё одной
  приподнятой панелью, как раньше (`app/layout/root-layout.tsx`,
  `mobile-nav.tsx` — `bg-sidebar`).

Три нейтральные тёмные темы (`dark-indigo`, `dark-green`, `dark-red`,
не тронуты этим проходом) сохраняют старую логику: `card`/`popover` на
шаг светлее `background`, `muted` на шаг светлее `card`, `sidebar` =
`background` (без отдельной "тени") — приподнятые поверхности читаются
заметно светлее фона, обычная тёмная-тема иерархия. `light-indigo`
получила `sidebar` = `muted` (едва заметно темнее страницы), остальное
не менялось.

Добавляя новую тему: копировать структуру существующего `[data-theme=
'dark-*']`-блока в `globals.css` (не забыть `--theme-sidebar` — без
него `bg-sidebar` не резолвится), добавить запись в `THEMES` в
`themes.ts`, не менять `@theme`-блок (радиус/тени там — общие для всех
тем, primary/поверхности — нет).

## Elevation (shadow scale)

`shadow-*` utilities are overridden globally in `globals.css`'s `@theme`
block (`--shadow-xs` through `--shadow-2xl`) to flat, neutral, low-opacity
values (2026-08-07 redesign) — every `shadow-sm`/`shadow-md`/etc. usage
across the app already renders flat automatically, no per-component
change needed. **Never write a colored/tinted shadow** (no
`shadow-[...rgba(primary...)]` "glow" — that pattern existed here before
2026-08-07 and is now explicitly removed; `aaa-ui-polish`'s "tilt+glow+
lift" card-hover guidance is overridden for this project — keep tilt+lift
motion, drop glow). Never reach for a shadow utility outside this table
without a documented reason.

| Level | Utility            | When                                                                                                                                   |
| ----- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | none (border only) | Inline/flat elements inside a surface: table rows, list items, nested list cards, filter chips.                                        |
| 1     | `shadow-sm`        | Resting state of any card/panel/tile on the page background (CourseCard, StatCard, form panels).                                       |
| 2     | `shadow-md`        | Hover/focus state of an interactive card (`hover:shadow-md`), sticky toolbars, page header bar.                                        |
| 3     | `shadow-lg`        | Popovers, dropdown menus, select content, tooltips with rich content, toasts.                                                          |
| 4     | `shadow-xl`        | Dialog/modal/sheet content — the highest elevation in the app, reserved for things that block interaction with everything behind them. |

Rules:

- A surface moves **at most one level** on interaction (1→2 on hover, not
  1→4). Bigger jumps read as jarring, not premium.
- Pair every elevation change with the existing motion rule
  (`transition-all duration-150` / `transition-shadow duration-150`) — an
  instant shadow snap is one of the cheapest-looking things a UI can do.
- Emphasis for a single featured surface per screen (the featured
  `PricingCard`, a primary hero CTA) comes from a thicker/colored
  **border** (`border-2 border-primary`, see "Surfaces & cards") or a
  soft background wash (see `PageHeader`'s `from-primary/15` gradient),
  never from a colored shadow — shadows stay neutral at every level.

## Border radius

Near-square corners (2026-08-07 redesign, reference-driven — was a much
softer 6/8/12/16px scale before). Overridden globally via `--radius-md`/
`--radius-lg`/`--radius-xl`/`--radius-2xl` in `globals.css`'s `@theme`
block — every existing `rounded-md`/`rounded-lg`/`rounded-xl`/
`rounded-2xl` usage in the codebase already renders at the new sharper
values automatically, no per-component change needed:

| Scale | Utility        | Px  | Usage                                                                                                                                                                           |
| ----- | -------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| xs    | `rounded-md`   | 2px | Buttons, inputs, badges/chips, checkboxes, tabs, dropdown/select items — anything you click or type into.                                                                       |
| sm    | `rounded-lg`   | 3px | Toolbars, alert/banner containers, small popovers, tooltips.                                                                                                                    |
| md    | `rounded-xl`   | 4px | Cards, panels, dialogs/sheets, media thumbnails (course cover, video poster).                                                                                                   |
| lg    | `rounded-2xl`  | 6px | Large marketing/feature surfaces, empty-state containers, hero panels — bigger surface, bigger radius (still nearly square).                                                    |
| full  | `rounded-full` | —   | Avatars, status dots, pill badges you deliberately want pill-shaped, progress bar track & indicator, icon-only circular buttons. Unaffected by the override — pills stay pills. |

A surface never mixes radius sizes with its own children at the same
nesting level (e.g. a `rounded-xl` card must not contain a
`rounded-2xl` child) — radius should visually step down as you nest in,
never up. Media that touches a card edge (thumbnail at the top of
`CourseCard`) rounds only the outer corners it touches
(`rounded-t-xl`/`rounded-b-none`), matching the parent's radius — see
`CourseCardSkeleton` in `course-grid.tsx` for the pattern.

## Typography

Font Space Grotesk Variable (self-hosted via `@fontsource-variable/
space-grotesk`, imported in `main.tsx` — weights 400/500/600/700 via the
variable axis) for all UI text; Fira Code (`@fontsource/fira-code`,
`--font-mono`) for code blocks and numeric/technical values that benefit
from monospace tabular digits. Every heading level is `font-*` weight +
`tracking-tight` + an explicit line-height — size alone is not what makes
a heading read as "designed."

| Level         | Classes                                                             | Usage                                                                                                                            |
| ------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Display       | `text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]`      | Marketing/landing hero only (e.g. `routes/index.tsx`) — never inside app chrome.                                                 |
| H1            | `text-4xl font-bold tracking-tight leading-tight`                   | One per page: page title (catalog, course detail, "Мои курсы", course editor).                                                   |
| H2            | `text-3xl font-semibold tracking-tight leading-snug`                | Major section within a page.                                                                                                     |
| H3            | `text-2xl font-semibold tracking-tight leading-snug`                | Card/subsection title, dialog title.                                                                                             |
| H4            | `text-lg font-semibold tracking-tight leading-snug`                 | Widget/group title inside a card (e.g. `CardTitle` in a stat tile or settings block).                                            |
| Body          | `text-base leading-relaxed`                                         | Default paragraph text.                                                                                                          |
| Body small    | `text-sm leading-relaxed text-muted-foreground`                     | Secondary/supporting text, descriptions, list metadata.                                                                          |
| Caption       | `text-xs font-medium text-muted-foreground`                         | Timestamps, helper text under inputs, table footnotes.                                                                           |
| Eyebrow/label | `text-xs font-medium uppercase tracking-wide text-muted-foreground` | Small label above a heading or section (e.g. "КАТЕГОРИЯ", stat tile pre-label) — use sparingly, not on every caption.            |
| Numeric/stat  | `text-2xl md:text-3xl font-semibold tracking-tight tabular-nums`    | Large standalone numbers: `StatCard` value, price, course count. `tabular-nums` keeps digits from jittering in width on updates. |

Notes:

- `tracking-tight` on every heading is the single highest-leverage change
  for a "designed" feel vs default browser spacing — don't skip it even
  on H4.
- Dashboard/page headers should use H1, not an ad-hoc smaller size —
  if an existing screen renders its top-level heading below H1 weight/size,
  that's a deviation from this table to fix, not a second valid pattern.
- Never go below `text-xs`; never use `font-normal` on a heading level.

## Spacing rhythm

Beyond the base container/section rules (kept from before), a consistent
padding/gap scale so components don't each invent their own numbers:

- **Page section**: `py-12 md:py-16 lg:py-20` between major page sections.
- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Page header → content**: `mt-8` between an H1 block (title + optional
  description) and the first content grid/section below it.
- **Standard panel/card** (settings block, form card, empty-state card):
  `p-6`, internal stack `space-y-4`.
- **Dense/media card** (grid tile with a thumbnail — `CourseCard`,
  gallery tiles): content padding `p-4`, internal stack `space-y-3`; the
  media itself is edge-to-edge (no padding around the thumbnail).
- **Compact tile** (`StatCard` and similar single-metric tiles):
  `CardHeader` uses `pb-2` (label sits closer to the value than a normal
  card header would).
- **Grid gutters**: `gap-6` between cards in a grid (catalog, dashboards,
  "Мои курсы") — this is the one place a bigger gap than the "Stack"
  value below is correct, because cards need visual separation a plain
  vertical stack doesn't.
- **Stack** (related block of content, form fields): `space-y-4` / `gap-4`.
- **Tight stack** (label+value, icon+text, badge rows): `space-y-2` /
  `gap-2`.
- **Inline** (icon next to text, trend arrow next to a number): `gap-1` /
  `gap-0.5`.

Rule of thumb: as nesting gets shallower (page → section → card →
field), the spacing value gets bigger, not smaller — an inner element
that has more breathing room than its parent is a bug, not a style
choice.

## Surfaces & cards

- **Border vs shadow**: every card/panel gets both — `border-border/60`
  (1px, softened to 60% opacity — a solid `border-border` reads
  "картонно"/flat, pinned down at schedule/10, 2026-08-06) for crisp but
  understated edge definition, plus a level-1 shadow (`shadow-sm`) for
  depth. Border alone reads flat; shadow alone reads blurry on light
  backgrounds. Use them together, not as alternatives. This is the
  `Card` primitive's default (`shared/ui/card.tsx`) — don't override it
  per-component unless the component is intentionally borderless (see
  "Featured/emphasized surface" below for the one exception pattern).
  Note: with the 2026-08-07 `dark-purple` palette, `card` background
  literally equals `background` (see "Themes") — the border is doing
  MORE of the separation work than it used to, don't skip it thinking
  the shadow alone will read as a distinct surface.
- **Resting → hover**: only cards that are themselves a link/button
  (clickable as a whole — `CourseCard`) get a hover elevation change
  (`hover:shadow-md`) and a scale/tilt treatment. `CourseCard` was
  historically the only component allowed `hover:scale-[1.02]` — as of
  `.agents/skills/aaa-ui-polish/SKILL.md` (2026-08-06) that limit is
  lifted for UI built under that skill (any clickable card may use a
  tilt+lift hover), but see "Elevation" above — the "glow" half of that
  skill's "tilt+glow+lift" pattern is overridden here, shadows stay
  neutral even on hover. Cards that just contain content (a settings
  panel, a stat tile, a dashboard summary card) stay at level 1 always —
  they don't hover-lift, because they're not clickable as a unit.
- **Featured/emphasized surface**: `border-2 border-primary` instead of
  the default 1px border (see `PricingCard` below). Use for at most one
  card in a set (the recommended plan, the featured course) — no glow
  shadow layered on top, the thicker colored border alone is the signal.
- **Nesting**: a card inside a card is a smell — prefer a `border-t`
  divider or `bg-muted` inset block instead of a second `shadow-sm`
  surface stacked on the first one.

## Empty states

Canonical pattern (already used by `MyCoursesGrid`'s "no enrollments"
state — standardize on this shape everywhere a list/grid can be
legitimately empty, not just there):

```
<div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
  <span className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
    <Icon className="text-muted-foreground h-6 w-6" aria-hidden="true" />
  </span>
  <div className="space-y-1">
    <p className="text-foreground text-sm font-medium">{title}</p>
    <p className="text-muted-foreground mx-auto max-w-md text-sm">{description}</p>
  </div>
  {primaryAction && <Button asChild>{primaryAction}</Button>}
</div>
```

- `border-dashed` (not a solid `shadow-sm` card) is the signal for "there
  is deliberately nothing here yet" vs a solid-bordered card, which reads
  as "this is real content." A dashboard summary card that just has no
  data yet (e.g. the student dashboard's "no active courses" block) is
  the same empty-state family and should use this pattern too, not a
  bespoke solid `Card` with a centered `CardHeader`.
- Icon sits in a soft circular badge (`rounded-full bg-muted`), never
  bare — this is what separates a designed empty state from a
  placeholder paragraph.
- Description is optional if the title is self-explanatory; the CTA
  button is optional and only appears when there's a clear next action
  (e.g. "Открыть каталог").
- Error states (`isError`) are a **different, simpler** pattern — plain
  centered text (`text-destructive py-12 text-center text-sm`,
  `role="alert"`), no icon/box. Don't dress up an error as a friendly
  empty state.

## Loading states (skeletons)

- Skeletons mirror the exact shape and dimensions of the real content
  they replace (same `aspect-video`, same line count and widths as the
  eventual heading/subheading/price) so there is zero layout shift when
  data arrives. `CourseCardSkeleton` (duplicated identically today in
  `course-grid.tsx` and `my-courses-grid.tsx`) is the reference shape —
  card border + `shadow-sm`, `aspect-video` skeleton block rounded only
  on the top corners, then a `p-4 space-y-3` block with a title-width
  bar, a subtitle-width bar, and a trailing price/meta-width bar.
- Grid loading state = render the same grid column classes as the loaded
  state, filled with skeleton cards instead of real ones (not a
  full-page spinner) — the grid shape should never jump between loading
  and loaded.
- Skeleton count should roughly match a first real page of results
  (3-6 tiles), not an arbitrary number.
- Reserve `Loader2` spinners for two cases only: a pending action inside
  a button (e.g. "Загрузить ещё") and a full-route transition with no
  known content shape yet. Anything with a known shape (a list, a grid,
  a form) gets a skeleton, not a spinner.
- `course-grid.tsx` and `my-courses-grid.tsx` currently define the
  identical `CourseCardSkeleton` twice — extracting it to one shared
  component (co-located with `CourseCard`, since it's that card's
  skeleton) is a good target for schedule/07 or a follow-up cleanup, not
  a reason to invent a third variant in the meantime.

## Component patterns

PageHeader (`app/layout/page-header.tsx`, 2026-08-07): the standard top-of-
page banner — `rounded-2xl border bg-gradient-to-br from-primary/15
via-card to-card p-8 shadow-sm`, an optional large faded decorative icon
(`text-primary/10`, absolute top-right), title (H1) + optional
description + optional right-aligned `actions` slot (period selectors,
CTA buttons). Replaces a bare `<h1>` sitting directly on the page
background for any route-level page (dashboards, catalog, "Мои курсы",
settings, course editor) — use it there instead of hand-rolling the
title block. It's the one deliberately "featured" surface a page gets —
a soft background gradient wash, not a glow shadow (see "Elevation");
pages that already have a bespoke hero (course detail's thumbnail +
price card) keep their own treatment instead of also using `PageHeader`
— don't stack two hero patterns on one page.
CourseCard: rounded-xl border shadow-sm hover:shadow-md (flat, no tint —
see "Elevation"), 16:9 AspectRatio, line-clamp-2 title, price
bottom-right, Progress bar if enrolled. Tilt+lift hover per
aaa-ui-polish (glow half of that skill's pattern overridden — see
"Elevation") — no longer the only component allowed `hover:scale-[1.02]`.
PricingCard: rounded-xl border-2, border-primary if featured (no glow
shadow — see "Elevation"), badge "Популярный".
VideoPlayer: @vidstack/react, aspect-video, custom Mentora theme.
RichTextEditor: TipTap, min-h-[200px], sticky toolbar.
ChapterList: @dnd-kit/sortable, drag handle, nested chapters→lessons.
ProgressBar: h-2 rounded-full, animate on value change.
Dashboard grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 — used for
both course/content grids and stat-tile rows; don't invent a different
column count for stat tiles specifically.
StatTile (`StatCard`): compact `Card`, `CardHeader pb-2` with a
`CardDescription` label, `CardContent` with the numeric/stat value style
above and an optional trend pill (`TrendingUp`/`TrendingDown` icon +
`text-success`/`text-destructive`, `gap-0.5`). Lives at elevation 1,
never hovers.
Badge: `rounded-md` (xs radius), used for category tags and status
chips overlaid on media (`absolute top-3 left-3` on a thumbnail) or
inline next to text — not `rounded-full` unless it's a deliberate pill
(e.g. a "New"/count pill), see radius scale.

## Animation

Default transition-all duration-150 · hover:scale-[1.02]/tilt/lift (see
`aaa-ui-polish` skill for which components — no longer CourseCard-only) ·
Modal animate-in fade-in zoom-in-95 · Sidebar transition-[width] duration-200 ·
never animate width/height on lists >10 items · elevation changes
(shadow-sm → shadow-md on hover) ride the same duration-150 transition,
not a separate timing.

## Responsive

Mobile <640px: 1 column, bottom nav. Tablet 640–1024px: 2 columns,
collapsible sidebar. Desktop >1024px: 3 columns, fixed sidebar.

## Rules

shadcn/ui as base, customize via variants. CSS variables for all colors —
never hardcode a hex value in a component. Never write a colored/tinted
shadow (no glow) — shadows are flat and neutral at every level, see
"Elevation".
Radius: rounded-md controls/inputs/badges, rounded-lg small chrome,
rounded-xl cards/dialogs, rounded-2xl large surfaces, rounded-full
avatars/pills — see full scale above (near-square since 2026-08-07,
2-6px, overridden globally in `@theme` — don't hardcode a different px
value locally).
Elevation: shadow-sm resting, shadow-md hover, shadow-lg
popovers/dropdowns/toasts, shadow-xl modals — see full scale above
(flat/neutral since 2026-08-07, overridden globally in `@theme`), and
move at most one level per interaction.
Every heading gets `tracking-tight` and an explicit line-height, not just
a font size.
Every list/grid that can legitimately have zero items gets the empty-state
pattern; every list/grid backed by a query gets a shape-matched skeleton,
not a spinner.
