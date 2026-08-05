import { createRoute } from '@tanstack/react-router';
import { AuthGuard } from '@app/auth-guard';
import { PageContainer } from '@app/layout/page-container';
import { LearningPage } from '@features/enrollment/components/learning-page';
import { rootRoute } from '../__root';

export const learningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/learning/$courseId',
  component: LearningRoutePage,
});

// Тонкий роут: параметр из URL + AuthGuard. Проверка "записан ли
// пользователь на курс" — уже внутри LearningPage (нужны и данные
// enrollment-статуса для этого решения, не только факт логина).
function LearningRoutePage() {
  const { courseId } = learningRoute.useParams();

  return (
    <AuthGuard>
      <PageContainer>
        <LearningPage courseId={courseId} />
      </PageContainer>
    </AuthGuard>
  );
}
