import { LayoutDashboard } from 'lucide-react';
import { createRoute } from '@tanstack/react-router';
import { AuthGuard } from '@app/auth-guard';
import { PageContainer } from '@app/layout/page-container';
import { PageHeader } from '@app/layout/page-header';
import { useAuthStore } from '@features/auth/store';
import { MyCoursesGrid } from '@features/enrollment/components/my-courses-grid';
import { rootRoute } from '../__root';

// Дашборд студента переиспользует MyCoursesGrid (features/enrollment,
// schedule/04/05) — реальные записи на курсы с прогрессом, вместо
// статичной заглушки "Пока нет активных курсов" из schedule/06 (тогда
// enrollment ещё не существовал). MyCoursesGrid уже возвращает канонический
// empty-state, если записей действительно нет — не нужен отдельный.
function StudentDashboardContent() {
  const user = useAuthStore((state) => state.user);

  return (
    <PageContainer className="space-y-8">
      <PageHeader
        icon={LayoutDashboard}
        title={user ? `Здравствуйте, ${user.fullName}` : 'Мой дашборд'}
        description="Прогресс по вашим активным курсам."
      />
      <MyCoursesGrid />
    </PageContainer>
  );
}

function StudentDashboardPage() {
  return (
    <AuthGuard>
      <StudentDashboardContent />
    </AuthGuard>
  );
}

export const dashboardIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: StudentDashboardPage,
});
