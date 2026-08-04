---
name: review
description: Code review for React/TypeScript frontend. Check architecture rules, type safety, performance, accessibility.
---

# Code Review Checklist

- [ ] No business logic in pages/routes
- [ ] Server state via TanStack Query (not useEffect)
- [ ] UI state via Zustand only
- [ ] Zod schemas for all forms
- [ ] Named exports only
- [ ] No inline styles, no console.log, no unjustified @ts-ignore
- [ ] TypeScript strict compliant
- [ ] Tailwind only, shadcn/ui reused where available
- [ ] Accessible: aria-labels, keyboard nav, focus management
- [ ] No cross-feature direct imports
- [ ] API types from generated client, not hand-written
