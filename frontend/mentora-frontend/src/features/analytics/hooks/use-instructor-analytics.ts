import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@shared/api/client';
import type { AnalyticsPeriod } from '@shared/api/generated/models';
import { DEFAULT_ANALYTICS_PERIOD } from '../schemas';

// Аналитика не обновляется поминутно — держим данные "свежими" 5 минут,
// чтобы не дёргать бэкенд на каждый ререндер/фокус вкладки.
const ANALYTICS_STALE_TIME = 5 * 60 * 1000;

export function useInstructorAnalytics(period: AnalyticsPeriod = DEFAULT_ANALYTICS_PERIOD) {
  return useQuery({
    queryKey: ['analytics', 'instructor', period],
    queryFn: () => analyticsApi.getInstructorAnalytics({ period }),
    select: (response) => response.data,
    staleTime: ANALYTICS_STALE_TIME,
  });
}
