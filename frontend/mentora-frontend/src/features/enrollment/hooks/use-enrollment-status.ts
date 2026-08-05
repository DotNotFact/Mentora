import { isAxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { enrollmentsApi } from '@shared/api/client';
import type { Enrollment } from '@shared/types/api';

// 404 — ожидаемый ответ "пользователь не записан", а не ошибка загрузки,
// поэтому нормализуем его в null прямо в queryFn (остальные ошибки
// пробрасываются дальше как обычно).
async function fetchEnrollmentStatus(courseId: string): Promise<Enrollment | null> {
  try {
    const { data } = await enrollmentsApi.getEnrollmentStatus(courseId);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export function useEnrollmentStatus(courseId: string) {
  const query = useQuery({
    queryKey: ['enrollments', 'status', courseId],
    queryFn: () => fetchEnrollmentStatus(courseId),
    enabled: Boolean(courseId),
  });

  return {
    ...query,
    isEnrolled: Boolean(query.data),
    progress: query.data?.progress,
  };
}
