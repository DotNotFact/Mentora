import { createRoute } from '@tanstack/react-router';
import { LoginForm } from '@features/auth/components/login-form';
import { rootRoute } from './__root';

function LoginPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
}

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});
