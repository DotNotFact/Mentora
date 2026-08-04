import { createRoute } from '@tanstack/react-router';
import { RegisterForm } from '@features/auth/components/register-form';
import { rootRoute } from './__root';

function RegisterPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <RegisterForm />
    </div>
  );
}

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
});
