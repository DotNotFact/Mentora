import { createRoute } from '@tanstack/react-router';
import { AuthGuard } from '@app/auth-guard';
import { PageContainer } from '@app/layout/page-container';
import { MyCoursesGrid } from '@features/enrollment/components/my-courses-grid';
import { rootRoute } from './__root';

function MyCoursesPage() {
  return (
    <AuthGuard>
      <PageContainer className="space-y-8">
        <h1 className="text-foreground text-4xl font-bold tracking-tight">Мои курсы</h1>
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
