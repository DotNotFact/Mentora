import { createRoute } from '@tanstack/react-router';
import { AuthGuard } from '@app/auth-guard';
import { PageContainer } from '@app/layout/page-container';
import { AdminDashboard } from '@features/analytics/components/admin-dashboard';
import { rootRoute } from '../__root';

function AdminDashboardPage() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <PageContainer>
        <AdminDashboard />
      </PageContainer>
    </AuthGuard>
  );
}

export const dashboardAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/admin',
  component: AdminDashboardPage,
});
