import { createRoute } from '@tanstack/react-router';
import { PageContainer } from '@app/layout/page-container';
import { CourseDetail } from '@features/courses/components/course-detail';
import { rootRoute } from '../__root';

function CourseDetailPage() {
  const { courseId } = courseDetailRoute.useParams();

  return (
    <PageContainer>
      <CourseDetail courseId={courseId} />
    </PageContainer>
  );
}

export const courseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses/$courseId',
  component: CourseDetailPage,
});
