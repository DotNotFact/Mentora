import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsApi } from '@shared/api/client';
import { enrollCourseIdSchema } from '../schemas';

// Прямая запись на курс без оплаты — для бесплатных курсов, либо когда
// доступ уже подтверждён оплатой (см. features/payments/use-checkout-status).
export function useEnroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) =>
      enrollmentsApi.createEnrollment({ courseId: enrollCourseIdSchema.parse(courseId) }),
    onSuccess: (_data, courseId) => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'status', courseId] });
    },
  });
}
