---
name: mentora-design
description: Mentora LMS design system constraints. ALWAYS apply when creating or modifying UI.
---

# Mentora Design System

> Craft-level baseline: modern shadcn/ui-based SaaS/LMS products circa
> 2025-2026 (generous whitespace, a real elevation scale instead of ad-hoc
> `shadow-sm`, a consistent radius scale, tight heading tracking, restrained
> motion, well-designed empty/loading states). Mentora's palette is
> themeable since schedule/11 (2026-08-06) — see "Themes" below — but the
> STRUCTURE is fixed: indigo primary/amber accent by default, and every
> theme keeps the same token roles (primary/accent/success/destructive
> stay semantically stable across themes). Don't introduce ad-hoc new
> colors outside the theme system to chase this look; the lift comes from
> spacing, elevation, typography and state design, not new hues.

## Colors

Brand/status tokens — the ones you reach for directly when building UI.
Values below are the `dark-indigo` theme (the default since schedule/11 —
NOT light, despite this table historically showing light values). See
"Themes" for the other 4 presets and how values swap at runtime:

| Token            | Value                 | Usage                         |
| ---------------- | --------------------- | ----------------------------- |
| primary          | #6366F1 (indigo-500)  | Buttons, links, active states |
| primary-hover    | #818CF8 (indigo-400, lighter than base — dark-mode hover brightens) | Hover (named-token cases only) |
| accent           | #F59E0B (amber-500)   | CTAs, progress, badges — same across all themes |
| background       | #020617 (slate-950)   | Page background               |
| foreground       | #F8FAFC (slate-50)    | Primary text                  |
| muted-foreground | #94A3B8 (slate-400)   | Secondary text                |
| destructive      | #EF4444 (red-500)     | Errors — same across all themes |
| success          | #10B981 (emerald-500) | Completed states — same across all themes |

shadcn/ui contract tokens — every color above (and below) also has its
`-foreground` pair generated in `src/styles/globals.css`; use these when
composing shadcn primitives (Button, Card, Dialog, Input…), not just the
brand table:

| Token          | Value               | Usage                                   |
| -------------- | ------------------- | --------------------------------------- |
| card / popover | #0F172A (slate-900) | Cards, modals, popovers (= surface) — one step lighter than background, not black |
| secondary      | #1E293B (slate-800) | Low-emphasis buttons/badges backgrounds |
| muted          | #1E293B (slate-800) | Subtle backgrounds (disabled, skeleton) |
| border, input  | #334155 (slate-700) | Borders, input outlines                 |
| ring           | #6366F1 (= primary) | Focus ring                              |

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
(фактические значения токенов). Дефолт — `dark-indigo`, НЕ светлая тема.

| id            | primary   | Поверхности                                     |
| ------------- | --------- | ------------------------------------------------ |
| dark-indigo   | #6366F1   | background #020617, card #0F172A (дефолт)         |
| dark-green    | #10B981   | те же тёмные поверхности, что и dark-indigo       |
| dark-red      | #F43F5E   | те же тёмные поверхности                          |
| dark-purple   | #8B5CF6   | те же тёмные поверхности                          |
| light-indigo  | #6366F1   | background #F8FAFC, card #FFFFFF (исходная светлая палитра) |

Механика: `@theme` в `globals.css` объявляет `--color-primary: var(--theme-primary)`
и т.д. (не прямые hex-значения) — Tailwind генерирует утилиты
(`bg-primary`) один раз при сборке, но их значения читаются в рантайме
из `--theme-*`, которые переопределяются на `[data-theme="..."]`. Смена
темы = смена одного атрибута на `<html>`, без пересборки CSS и без
перезагрузки страницы. `accent`/`success`/`destructive` НЕ варьируются
по темам (остаются amber/emerald/red во всех пяти) — только
`primary`/`primary-hover`/`ring` (все три вместе) и весь набор
"тёмная/светлая" поверхностей (background/card/popover/secondary/muted/
border/input/foreground/-foreground-пары).

Тёмные поверхности — НЕ инверсия светлой палитры "в лоб" и не чистый
чёрный: `background` #020617 (slate-950), `card`/`popover` на один шаг
светлее — #0F172A (slate-900), `secondary`/`muted` — #1E293B
(slate-800), `border`/`input` — #334155 (slate-700). Приподнятые
поверхности читаются заметно светлее фона, как и требует "не инверсия
в лоб" — не полагаться на одну лишь тень для разделения уровней в
тёмном режиме.

Добавляя новую тему: копировать структуру существующего `[data-theme=
'dark-*']`-блока в `globals.css`, добавить запись в `THEMES` в
`themes.ts`, не менять `@theme`-блок (он не привязан к конкретной теме).

## Elevation (shadow scale)

Tailwind's default shadow scale, given fixed meaning. Never reach for a
shadow utility outside this table without a documented reason — random
`shadow-md`/`shadow-lg` sprinkled per-component is exactly the "not
polished" flatness this scale exists to fix.

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
- Optional "glow" accent for a single emphasized surface per screen (the
  featured `PricingCard`, a primary hero CTA, an "upgrade" callout) —
  layer a tinted shadow on top of the normal level instead of inventing a
  level 5: `shadow-[0_8px_24px_-4px_rgba(99,102,241,0.25)]` (the rgba is
  `--color-primary` at 25% — keep it at 20-25%, never opaque). Use for at
  most one element in view; if everything glows, nothing does.
- Dark, heavy shadows (`shadow-2xl` and beyond, or opacity above ~25% on a
  tinted shadow) are not part of this system — Mentora's surfaces are
  light and the palette is bright; heavy shadows read muddy against it.

## Border radius

| Scale | Utility        | Px   | Usage                                                                                                                            |
| ----- | -------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------- |
| xs    | `rounded-md`   | 6px  | Buttons, inputs, badges/chips, checkboxes, tabs, dropdown/select items — anything you click or type into.                        |
| sm    | `rounded-lg`   | 8px  | Toolbars, alert/banner containers, small popovers, tooltips.                                                                     |
| md    | `rounded-xl`   | 12px | Cards, panels, dialogs/sheets, media thumbnails (course cover, video poster).                                                    |
| lg    | `rounded-2xl`  | 16px | Large marketing/feature surfaces, empty-state containers, hero panels — bigger surface, bigger radius.                           |
| full  | `rounded-full` | —    | Avatars, status dots, pill badges you deliberately want pill-shaped, progress bar track & indicator, icon-only circular buttons. |

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
- **Resting → hover**: only cards that are themselves a link/button
  (clickable as a whole — `CourseCard`) get a hover elevation change
  (`hover:shadow-md`) and a scale/tilt treatment. `CourseCard` was
  historically the only component allowed `hover:scale-[1.02]` — as of
  `.agents/skills/aaa-ui-polish/SKILL.md` (2026-08-06) that limit is
  lifted for UI built under that skill (any clickable card may use the
  richer tilt+glow+lift pattern documented there), see its override
  table for the full list of what it supersedes here. Cards that just
  contain content (a settings panel, a stat tile, a dashboard summary
  card) stay at level 1 always — they don't hover-lift, because they're
  not clickable as a unit.
- **Featured/emphasized surface**: `border-2 border-primary` instead of
  the default 1px border (see `PricingCard` below), optionally combined
  with the primary glow shadow from the elevation section. Use for at
  most one card in a set (the recommended plan, the featured course).
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

CourseCard: rounded-xl border shadow-sm hover:shadow-md, 16:9 AspectRatio,
line-clamp-2 title, price bottom-right, Progress bar if enrolled.
Extended AAA hover (tilt+glow+lift) per aaa-ui-polish — no longer the
only component allowed `hover:scale-[1.02]`.
PricingCard: rounded-xl border-2, border-primary + optional primary glow
shadow if featured, badge "Популярный".
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
never hardcode a hex value in a component (the one exception is a tinted
shadow's rgba, which must match an existing token's value, as in the
elevation section above).
Radius: rounded-md controls/inputs/badges, rounded-lg small chrome,
rounded-xl cards/dialogs, rounded-2xl large surfaces, rounded-full
avatars/pills — see full scale above.
Elevation: shadow-sm resting, shadow-md hover, shadow-lg
popovers/dropdowns/toasts, shadow-xl modals — see full scale above, and
move at most one level per interaction.
Every heading gets `tracking-tight` and an explicit line-height, not just
a font size.
Every list/grid that can legitimately have zero items gets the empty-state
pattern; every list/grid backed by a query gets a shape-matched skeleton,
not a spinner.
