import { createRoute } from '@tanstack/react-router';
import { AuthGuard } from '@app/auth-guard';
import { PageContainer } from '@app/layout/page-container';
import { rootRoute } from '../__root';

export const learningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/learning/$courseId',
  component: LearningRoutePage,
});

// Честная заглушка: маршрут регистрируется в schedule/05 (успешная оплата/
// запись должна вести на реальный, кликабельный /learning/:courseId — см.
// критерии готовности schedule/05-checkout.md), но сам плеер обучения
// (VideoPlayer/LessonSidebar/ProgressBar) реализуется в
// schedule/04-learning-player — см. тот же приём в dashboard/index.tsx.
function LearningRoutePage() {
  return (
    <AuthGuard>
      <PageContainer>
        <p className="text-muted-foreground text-sm">
          Доступ к курсу открыт. Плеер обучения появится здесь в ближайшем обновлении.
        </p>
      </PageContainer>
    </AuthGuard>
  );
}
