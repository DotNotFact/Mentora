import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { CourseEnrollmentPoint } from '@shared/api/generated/models';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';

interface EnrollmentChartProps {
  data: CourseEnrollmentPoint[];
  title?: string;
}

// Дизайн-заметка (schedule/06): пустое состояние — текстовая заглушка по
// центру карточки вместо падения графика на пустом наборе данных.
export function EnrollmentChart({ data, title = 'Зачисления по курсам' }: EnrollmentChartProps) {
  return (
    <Card className="rounded-xl border p-6 shadow-sm">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-center text-sm text-muted-foreground">
            Нет зачислений за выбранный период
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="courseTitle"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={50}
                tickFormatter={(value: string) =>
                  value.length > 12 ? `${value.slice(0, 12)}…` : value
                }
              />
              <YAxis
                allowDecimals={false}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value) => [value, 'Зачислений']}
              />
              <Bar
                dataKey="enrollments"
                fill="var(--color-accent)"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
