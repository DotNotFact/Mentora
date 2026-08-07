import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@shared/api/client';
import type { ReviewFormValues } from '../schemas';

export function useReviews(courseId: string) {
  return useQuery({
    queryKey: ['courses', 'reviews', courseId],
    queryFn: () => coursesApi.listCourseReviews(courseId),
    enabled: Boolean(courseId),
  });
}

// Один хук на создание/редактирование — вызывает POST (создание) или PUT
// (редактирование, см. openapi.yaml `/courses/{id}/reviews/{reviewId}`)
// в зависимости от того, передан ли `reviewId` уже существующего отзыва
// пользователя. Компонент решает, что передать, основываясь на наличии
// своего отзыва в уже загруженном списке (useReviews), не на отдельном
// запросе.
export function useSubmitReview(courseId: string, reviewId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ReviewFormValues) => {
      const payload = { rating: values.rating, comment: values.comment };
      return reviewId
        ? coursesApi.updateCourseReview(courseId, reviewId, payload)
        : coursesApi.createCourseReview(courseId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', 'reviews', courseId] });
      queryClient.invalidateQueries({ queryKey: ['courses', 'detail', courseId] });
      queryClient.invalidateQueries({ queryKey: ['courses', 'list'] });
    },
  });
}
