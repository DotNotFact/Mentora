import { GraduationCap } from 'lucide-react';
import { createRoute } from '@tanstack/react-router';
import { AuthGuard } from '@app/auth-guard';
import { PageContainer } from '@app/layout/page-container';
import { PageHeader } from '@app/layout/page-header';
import { MyCoursesGrid } from '@features/enrollment/components/my-courses-grid';
import { rootRoute } from './__root';

function MyCoursesPage() {
  return (
    <AuthGuard>
      <PageContainer className="space-y-8">
        <PageHeader
          icon={GraduationCap}
          title="Мои курсы"
          description="Курсы, на которые вы записаны, и ваш прогресс по каждому."
        />
        <MyCoursesGrid />
      </PageContainer>
    </AuthGuard>
  );
}

export const myCoursesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-courses',
  component: MyCoursesPage,
});
