import { GraduationCap, Plus } from 'lucide-react';
import { createRoute, Link } from '@tanstack/react-router';
import { AuthGuard } from '@app/auth-guard';
import { PageContainer } from '@app/layout/page-container';
import { PageHeader } from '@app/layout/page-header';
import { Button } from '@shared/ui/button';
import { useAuthStore } from '@features/auth/store';
import { MyCoursesGrid } from '@features/enrollment/components/my-courses-grid';
import { InstructorCoursesGrid } from '@features/courses/components/instructor-courses-grid';
import { rootRoute } from './__root';

// "Мои курсы" означает разное по роли: студент — курсы, на которые он
// записан (прогресс), инструктор/админ — курсы, которые он создал
// (управление/редактирование). Раньше инструктор на этом роуте видел
// пустой enrollment-стейт "Вы пока не записаны" — семантически неверно
// для его роли и негде было увидеть список своих курсов без прямого URL.
function MyCoursesPage() {
  const user = useAuthStore((state) => state.user);
  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  return (
    <AuthGuard>
      <PageContainer className="space-y-8">
        {isInstructor ? (
          <>
            <PageHeader
              icon={GraduationCap}
              title="Мои курсы"
              description="Курсы, которые вы создали — отсюда можно перейти к редактированию."
              actions={
                <Button asChild>
                  <Link to="/courses/edit/$courseId" params={{ courseId: 'new' }}>
                    <Plus aria-hidden="true" />
                    Создать курс
                  </Link>
                </Button>
              }
            />
            <InstructorCoursesGrid instructorId={user?.id ?? ''} />
          </>
        ) : (
          <>
            <PageHeader
              icon={GraduationCap}
              title="Мои курсы"
              description="Курсы, на которые вы записаны, и ваш прогресс по каждому."
            />
            <MyCoursesGrid />
          </>
        )}
      </PageContainer>
    </AuthGuard>
  );
}

export const myCoursesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-courses',
  component: MyCoursesPage,
});
