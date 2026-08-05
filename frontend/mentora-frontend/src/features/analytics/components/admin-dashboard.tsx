import { useState } from 'react';
import { formatPrice } from '@shared/lib/utils';
import type { AnalyticsPeriod } from '@shared/api/generated/models';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';
import { Skeleton } from '@shared/ui/skeleton';
import { useAdminAnalytics } from '../hooks/use-admin-analytics';
import { ANALYTICS_PERIOD_OPTIONS, DEFAULT_ANALYTICS_PERIOD } from '../schemas';
import { EnrollmentChart } from './enrollment-chart';
import { RevenueChart } from './revenue-chart';
import { StatCard } from './stat-card';

export function AdminDashboard() {
  // Выбор периода — чисто локальное UI-state страницы (пресеты 7/30/90
  // дней, без кастомного календаря — см. schedule/06 → "Не входит"), не
  // требует Zustand-стора.
  const [period, setPeriod] = useState<AnalyticsPeriod>(DEFAULT_ANALYTICS_PERIOD);
  const { data, isLoading, isError } = useAdminAnalytics(period);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground text-4xl leading-tight font-bold tracking-tight">
            Аналитика платформы
          </h1>
          <p className="text-sm text-muted-foreground">
            Агрегированная статистика по всем курсам и пользователям
          </p>
        </div>
        <Select
          value={period}
          onValueChange={(value) => setPeriod(value as AnalyticsPeriod)}
        >
          <SelectTrigger className="w-40" aria-label="Период">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ANALYTICS_PERIOD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3].map((key) => (
            <Skeleton key={key} className="h-28 rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Не удалось загрузить аналитику. Попробуйте обновить страницу.
        </p>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label="Доход платформы"
              value={formatPrice(data.totalRevenue)}
              deltaPercent={data.revenueChangePercent}
            />
            <StatCard
              label="Пользователи"
              value={data.totalUsers.toString()}
              deltaPercent={data.userGrowthPercent}
            />
            <StatCard label="Курсы" value={data.totalCourses.toString()} />
            <StatCard label="Зачисления" value={data.totalEnrollments.toString()} />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RevenueChart data={data.revenueByPeriod} title="Доход платформы по периодам" />
            <EnrollmentChart
              data={data.enrollmentsByCourse}
              title="Топ курсов по зачислениям"
            />
          </div>
        </>
      )}
    </div>
  );
}
