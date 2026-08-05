import { lazy, Suspense } from 'react';
import { createRoute } from '@tanstack/react-router';
import { AuthGuard } from '@app/auth-guard';
import { PageContainer } from '@app/layout/page-container';
import { Skeleton } from '@shared/ui/skeleton';
import { rootRoute } from '../__root';

// Recharts — тяжёлая библиотека, нужна только на дашбордах, не при
// каждом визите в приложение.
const InstructorDashboard = lazy(() =>
  import('@features/analytics/components/instructor-dashboard').then((m) => ({
    default: m.InstructorDashboard,
  })),
);

function InstructorDashboardPage() {
  return (
    <AuthGuard allowedRoles={['instructor', 'admin']}>
      <PageContainer>
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
          <InstructorDashboard />
        </Suspense>
      </PageContainer>
    </AuthGuard>
  );
}

export const dashboardInstructorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/instructor',
  component: InstructorDashboardPage,
});
