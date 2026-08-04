---
name: diagnose
description: Debug frontend issues — rendering, API calls, state, routing.
---

# Diagnose

1. Identify the symptom
2. Find the relevant component/hook/store
3. Check console + network tab
4. Check TanStack Query devtools cache state
5. Check Zustand state
6. Trace data flow API → hook → component
7. Propose and apply fix
8. Verify with a screenshot (Playwright MCP)

## Common issues

Stale query data → staleTime/refetchOnWindowFocus · form not submitting →
Zod schema mismatch · route not matching → router tree · type mismatch →
`yarn api:generate`.
