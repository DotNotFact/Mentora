import { lazy, Suspense } from 'react';
import { createRoute } from '@tanstack/react-router';
import { AuthGuard } from '@app/auth-guard';
import { PageContainer } from '@app/layout/page-container';
import { Skeleton } from '@shared/ui/skeleton';
import { rootRoute } from '../__root';

// Recharts — тяжёлая библиотека, нужна только на дашбордах, не при
// каждом визите в приложение.
const AdminDashboard = lazy(() =>
  import('@features/analytics/components/admin-dashboard').then((m) => ({
    default: m.AdminDashboard,
  })),
);

function AdminDashboardPage() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <PageContainer>
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
          <AdminDashboard />
        </Suspense>
      </PageContainer>
    </AuthGuard>
  );
}

export const dashboardAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/admin',
  component: AdminDashboardPage,
});
