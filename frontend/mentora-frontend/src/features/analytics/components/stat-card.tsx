import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@shared/lib/utils';
import { useCountUp } from '@shared/hooks/use-count-up';
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

// Парсит числовую часть отформатированной строки (например, formatPrice(...)
// или number.toString()) для count-up-анимации — префикс/суффикс (валюта, %)
// сохраняются как есть. См. .agents/skills/aaa-ui-polish/SKILL.md.
function parseNumericDisplay(display: string) {
  const match = display.match(/[\d,]*\.?\d+/);
  if (!match || match.index === undefined) {
    return { prefix: display, suffix: '', numeric: 0, decimals: 0 };
  }
  const prefix = display.slice(0, match.index);
  const suffix = display.slice(match.index + match[0].length);
  const raw = match[0].replace(/,/g, '');
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
  return { prefix, suffix, numeric: Number(raw), decimals };
}

function StatValue({ value }: { value: string }) {
  const { prefix, suffix, numeric, decimals } = parseNumericDisplay(value);
  const animated = useCountUp(numeric);
  const formatted = animated.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className="text-foreground text-2xl font-semibold tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
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
          <StatValue value={value} />
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
