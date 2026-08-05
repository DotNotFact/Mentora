import { createRoute } from '@tanstack/react-router';
import { BookOpen } from 'lucide-react';
import { AuthGuard } from '@app/auth-guard';
import { PageContainer } from '@app/layout/page-container';
import { useAuthStore } from '@features/auth/store';
import { Card, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { rootRoute } from '../__root';

// Дашборд студента. features/enrollment (schedule/04/05) ещё не
// реализован, поэтому реального прогресса по курсам пока нет — честная
// заглушка вместо фиктивных данных (см. schedule/06-analytics-dashboard.md
// → "Отклонения от исходного плана").
function StudentDashboardContent() {
  const user = useAuthStore((state) => state.user);

  return (
    <PageContainer>
      <h1 className="text-foreground text-3xl font-semibold tracking-tight">
        {user ? `Здравствуйте, ${user.fullName}` : 'Мой дашборд'}
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Здесь появится прогресс по вашим активным курсам.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-xl border p-6 shadow-sm md:col-span-2 lg:col-span-3">
          <CardHeader className="items-center p-0 text-center">
            <BookOpen className="text-muted-foreground mb-2 h-8 w-8" aria-hidden="true" />
            <CardTitle className="text-lg">Пока нет активных курсов</CardTitle>
            <CardDescription className="mx-auto max-w-md">
              Отслеживание прогресса появится после того, как заработают запись на курсы и обучающий
              плеер. Загляните позже — или начните с каталога курсов, когда он откроется.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
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
