import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatDate, formatPrice } from '@shared/lib/utils';
import type { RevenuePoint } from '@shared/api/generated/models';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';

interface RevenueChartProps {
  data: RevenuePoint[];
  title?: string;
}

// Дизайн-заметка (schedule/06): пустое состояние — текстовая заглушка по
// центру карточки вместо падения графика на пустом наборе данных.
export function RevenueChart({ data, title = 'Доход по периодам' }: RevenueChartProps) {
  return (
    <Card className="p-6">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="text-muted-foreground flex h-[280px] items-center justify-center text-center text-sm">
            Нет данных о доходе за выбранный период
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenue-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="date"
                tickFormatter={(value: string) => formatDate(value)}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value: number) => formatPrice(value)}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={72}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelFormatter={(label) => (typeof label === 'string' ? formatDate(label) : label)}
                formatter={(value) => [
                  typeof value === 'number' ? formatPrice(value) : String(value),
                  'Доход',
                ]}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#revenue-gradient)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
