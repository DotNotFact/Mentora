import { createRoute } from '@tanstack/react-router';
import { PageContainer } from '@app/layout/page-container';
import { LoginForm } from '@features/auth/components/login-form';
import { rootRoute } from './__root';

function LoginPage() {
  return (
    <PageContainer>
      <LoginForm />
    </PageContainer>
  );
}

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});
