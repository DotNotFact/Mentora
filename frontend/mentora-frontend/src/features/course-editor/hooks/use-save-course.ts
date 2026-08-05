import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { coursesApi } from '@shared/api/client';
import type { CourseMetaFormValues } from '../schemas';
import { courseEditorKeys, NEW_COURSE_ID } from './use-course-editor';

// Сохраняет метаданные курса: POST /courses при создании (courseId ===
// NEW_COURSE_ID), иначе PUT /courses/{courseId}. После создания
// редиректит на /courses/edit/{новый id}, чтобы дальнейшие действия
// (главы/уроки/видео) шли уже по реальному courseId.
export function useSaveCourse(courseId: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isNew = courseId === NEW_COURSE_ID;

  return useMutation({
    mutationFn: (values: CourseMetaFormValues) => {
      // form.handleSubmit только вызывает onSubmit после успешной валидации
      // courseMetaSchema (её .refine требует category !== undefined) —
      // здесь это гарантированно строгий CourseCategory, не undefined.
      const payload = { ...values, category: values.category! };
      return (
        isNew ? coursesApi.createCourse(payload) : coursesApi.updateCourse(courseId, payload)
      ).then((res) => res.data);
    },
    onSuccess: (course) => {
      queryClient.setQueryData(courseEditorKeys.course(course.id), course);
      if (isNew) {
        void navigate({ to: '/courses/edit/$courseId', params: { courseId: course.id } });
      }
    },
  });
}
