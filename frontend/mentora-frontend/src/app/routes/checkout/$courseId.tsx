import { createRoute } from '@tanstack/react-router';
import { AuthGuard } from '@app/auth-guard';
import { PageContainer } from '@app/layout/page-container';
import { CheckoutPage } from '@features/payments/components/checkout-page';
import { checkoutReturnSearchSchema } from '@features/payments/schemas';
import { rootRoute } from '../__root';

export const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout/$courseId',
  validateSearch: checkoutReturnSearchSchema,
  component: CheckoutRoutePage,
});

// Тонкий роут: параметр из URL + search (возврат со Stripe) + AuthGuard.
// Вся логика — в features/payments/components/checkout-page.tsx.
function CheckoutRoutePage() {
  const { courseId } = checkoutRoute.useParams();
  const search = checkoutRoute.useSearch();

  return (
    <AuthGuard>
      <PageContainer>
        <CheckoutPage courseId={courseId} search={search} />
      </PageContainer>
    </AuthGuard>
  );
}
