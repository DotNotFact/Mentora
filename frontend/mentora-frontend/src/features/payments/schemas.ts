import { z } from 'zod';

// Search-параметры страницы /checkout/:courseId после возврата со Stripe
// hosted checkout (success_url/cancel_url настраиваются на бэкенде так,
// чтобы редиректить именно сюда). Валидируется через TanStack Router
// `validateSearch`, а не форма — но тот же принцип "схема в schemas.ts"
// (CLAUDE.md, правило #11) применим и к типизации search-параметров.
export const checkoutReturnSearchSchema = z.object({
  status: z.enum(['success', 'cancel']).optional(),
  session_id: z.string().optional(),
});

export type CheckoutReturnSearch = z.infer<typeof checkoutReturnSearchSchema>;
