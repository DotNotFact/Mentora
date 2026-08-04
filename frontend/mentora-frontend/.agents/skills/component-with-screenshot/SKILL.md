---
name: component-with-screenshot
description: Create component, screenshot, iterate — the core UI development loop.
---

# Component with Screenshot Loop

1. Read design reference
2. Apply mentora-design skill constraints
3. Implement with shadcn/ui + Tailwind
4. Ensure it renders (typecheck, no console errors)
5. Screenshot via Playwright MCP, compare with reference
6. Adjust spacing/colors/typography if mismatched, re-screenshot
7. Repeat until acceptable

## Rules

Always apply mentora-design first · use shadcn/ui as building blocks ·
test at 375px/768px/1280px · check dark mode if applicable · verify
keyboard nav · check for layout shift (CLS).
