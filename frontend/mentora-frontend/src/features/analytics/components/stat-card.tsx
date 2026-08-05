import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@shared/lib/utils';
import { Card, CardContent, CardDescription, CardHeader } from '@shared/ui/card';

interface StatCardProps {
  /** Название метрики, например "Доход" или "Зачисления". */
  label: string;
  /** Уже отформатированное значение метрики (валюта/число — решает вызывающий). */
  value: string;
  /**
   * Изменение метрики в % относительно предыдущего периода той же длины.
   * Не передавать, если дельта не применима (например, "нет данных").
   */
  deltaPercent?: number;
}

export function StatCard({ label, value, deltaPercent }: StatCardProps) {
  const hasDelta = deltaPercent !== undefined && Number.isFinite(deltaPercent);
  const isPositive = hasDelta && deltaPercent >= 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-foreground">{value}</span>
          {hasDelta && (
            <span
              className={cn(
                'flex items-center gap-0.5 text-sm font-medium',
                isPositive ? 'text-success' : 'text-destructive',
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <TrendingDown className="h-4 w-4" aria-hidden="true" />
              )}
              {Math.abs(deltaPercent).toFixed(1)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
