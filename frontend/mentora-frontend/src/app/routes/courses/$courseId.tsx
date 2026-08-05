import { createRoute } from '@tanstack/react-router';
import { CourseDetail } from '@features/courses/components/course-detail';
import { rootRoute } from '../__root';

function CourseDetailPage() {
  const { courseId } = courseDetailRoute.useParams();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <CourseDetail courseId={courseId} />
    </div>
  );
}

export const courseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses/$courseId',
  component: CourseDetailPage,
});
