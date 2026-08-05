import { createRoute } from '@tanstack/react-router';
import { AuthGuard } from '@app/auth-guard';
import { InstructorDashboard } from '@features/analytics/components/instructor-dashboard';
import { rootRoute } from '../__root';

function InstructorDashboardPage() {
  return (
    <AuthGuard allowedRoles={['instructor', 'admin']}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <InstructorDashboard />
      </div>
    </AuthGuard>
  );
}

export const dashboardInstructorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/instructor',
  component: InstructorDashboardPage,
});
