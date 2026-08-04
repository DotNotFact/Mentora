---
name: implement
description: Implement a UI feature component with full typing, validation, and testing. Use only after an explicit admin command to work on a schedule task.
---

# Implement Feature Component

## Steps

1. Confirm .agents/STATE.md shows an active, admin-approved task
2. Read CLAUDE.md and relevant feature structure
3. Search for existing similar components in src/
4. Define Zod schema in features/<name>/schemas.ts
5. Create component in features/<name>/components/
6. Create TanStack Query hook in features/<name>/hooks/ if needed
7. Use shadcn/ui components as building blocks
8. Add TypeScript types from generated API client
9. Take screenshot via Playwright MCP, compare with design reference, iterate
10. Write unit test

## Rules

Named exports only · Props interface above component · Zod schema for all
forms · TanStack Query for server state · Zustand for UI state only ·
no business logic in route components.
