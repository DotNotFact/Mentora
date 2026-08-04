---
name: new-feature
description: Scaffold a new feature module in src/features/. Use only with explicit admin approval for the corresponding schedule task.
---

# New Feature

1. Read CLAUDE.md structure rules
2. Check docs/architecture/ for existing feature boundaries
3. Create src/features/<name>/{components,hooks}/, store.ts, schemas.ts
4. Add route in src/app/routes/ (thin)
5. Update docs/architecture/frontend-structure.md
6. Confirm a schedule/<n>-<name>.md file exists for this feature

## store.ts template

```ts
import { create } from 'zustand';

interface <Name>State {
  // UI state only — no server data
}

export const use<Name>Store = create<<Name>State>(() => ({
  // initial state
}));
```

## schemas.ts template

```ts
import { z } from 'zod';
// form/validation schemas
```

## Rules

Feature never imports another feature directly · shared components go to
src/shared/ui/ · API hooks go to features/<name>/hooks/ · only UI state
in store.ts.
