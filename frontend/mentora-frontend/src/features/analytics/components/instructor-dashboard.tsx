import { useState } from 'react';
import { LineChart } from 'lucide-react';
import { PageHeader } from '@app/layout/page-header';
import { formatPrice } from '@shared/lib/utils';
import type { AnalyticsPeriod } from '@shared/api/generated/models';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';
import { Skeleton } from '@shared/ui/skeleton';
import { useInstructorAnalytics } from '../hooks/use-instructor-analytics';
import { ANALYTICS_PERIOD_OPTIONS, DEFAULT_ANALYTICS_PERIOD } from '../schemas';
import { EnrollmentChart } from './enrollment-chart';
import { RevenueChart } from './revenue-chart';
import { StatCard } from './stat-card';

export function InstructorDashboard() {
  // Выбор периода — чисто локальное UI-state страницы (пресеты 7/30/90
  // дней, без кастомного календаря — см. schedule/06 → "Не входит"), не
  // требует Zustand-стора.
  const [period, setPeriod] = useState<AnalyticsPeriod>(DEFAULT_ANALYTICS_PERIOD);
  const { data, isLoading, isError } = useInstructorAnalytics(period);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={LineChart}
        title="Аналитика инструктора"
        description="Доходы и зачисления по вашим курсам"
        actions={
          <Select value={period} onValueChange={(value) => setPeriod(value as AnalyticsPeriod)}>
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
        }
      />

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1].map((key) => (
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
              label="Доход"
              value={formatPrice(data.totalRevenue)}
              deltaPercent={data.revenueChangePercent}
            />
            <StatCard
              label="Зачисления"
              value={data.totalEnrollments.toString()}
              deltaPercent={data.enrollmentsChangePercent}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RevenueChart data={data.revenueByPeriod} />
            <EnrollmentChart data={data.enrollmentsByCourse} />
          </div>
        </>
      )}
    </div>
  );
}
