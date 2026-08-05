import { createRoute } from '@tanstack/react-router';
import { AuthGuard } from '@app/auth-guard';
import { AdminDashboard } from '@features/analytics/components/admin-dashboard';
import { rootRoute } from '../__root';

function AdminDashboardPage() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <AdminDashboard />
      </div>
    </AuthGuard>
  );
}

export const dashboardAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/admin',
  component: AdminDashboardPage,
});
