---
name: mentora-design
description: Mentora LMS design system constraints. ALWAYS apply when creating or modifying UI.
---

# Mentora Design System

## Colors

| Token         | Value                 | Usage                         |
| ------------- | --------------------- | ----------------------------- |
| primary       | #6366F1 (indigo-500)  | Buttons, links, active states |
| primary-hover | #4F46E5 (indigo-600)  | Hover                         |
| accent        | #F59E0B (amber-500)   | CTAs, progress, badges        |
| background    | #F8FAFC (slate-50)    | Page background               |
| surface       | #FFFFFF               | Cards, modals                 |
| foreground    | #0F172A (slate-900)   | Primary text                  |
| muted         | #64748B (slate-500)   | Secondary text                |
| destructive   | #EF4444 (red-500)     | Errors                        |
| success       | #10B981 (emerald-500) | Completed states              |

## Typography

Font Inter (400/500/600/700). H1 text-4xl font-bold tracking-tight,
H2 text-3xl font-semibold, H3 text-2xl font-semibold, body text-base,
small text-sm, caption text-xs font-medium text-muted.

## Component patterns

CourseCard: rounded-xl shadow-sm, 16:9 AspectRatio, line-clamp-2 title,
price bottom-right, Progress bar if enrolled.
PricingCard: rounded-xl border-2, border-primary if featured, badge "Популярный".
VideoPlayer: @vidstack/react, aspect-video, custom Mentora theme.
RichTextEditor: TipTap, min-h-[200px], sticky toolbar.
ChapterList: @dnd-kit/sortable, drag handle, nested chapters→lessons.
ProgressBar: h-2 rounded-full, animate on value change.
Dashboard grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.

## Spacing

Section py-12 md:py-16 lg:py-20 · Container max-w-7xl mx-auto px-4
sm:px-6 lg:px-8 · Card p-6 · Stack space-y-4/gap-4 · Tight space-y-2/gap-2.

## Animation

Default transition-all duration-150 · hover:scale-[1.02] (CourseCard only) ·
Modal animate-in fade-in zoom-in-95 · Sidebar transition-[width] duration-200 ·
never animate width/height on lists >10 items.

## Responsive

Mobile <640px: 1 column, bottom nav. Tablet 640–1024px: 2 columns,
collapsible sidebar. Desktop >1024px: 3 columns, fixed sidebar.

## Rules

shadcn/ui as base, customize via variants. CSS variables for all colors.
rounded-lg inputs, rounded-xl cards, rounded-full avatars/badges.
shadow-sm default, shadow-md hover, shadow-lg modals.
