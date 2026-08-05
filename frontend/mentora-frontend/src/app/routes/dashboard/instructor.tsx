import { createRoute } from '@tanstack/react-router';
import { AuthGuard } from '@app/auth-guard';
import { PageContainer } from '@app/layout/page-container';
import { InstructorDashboard } from '@features/analytics/components/instructor-dashboard';
import { rootRoute } from '../__root';

function InstructorDashboardPage() {
  return (
    <AuthGuard allowedRoles={['instructor', 'admin']}>
      <PageContainer>
        <InstructorDashboard />
      </PageContainer>
    </AuthGuard>
  );
}

export const dashboardInstructorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/instructor',
  component: InstructorDashboardPage,
});
