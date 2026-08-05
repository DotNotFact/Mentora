import { createRoute } from '@tanstack/react-router';
import { PageContainer } from '@app/layout/page-container';
import { RegisterForm } from '@features/auth/components/register-form';
import { rootRoute } from './__root';

function RegisterPage() {
  return (
    <PageContainer>
      <RegisterForm />
    </PageContainer>
  );
}

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
});
