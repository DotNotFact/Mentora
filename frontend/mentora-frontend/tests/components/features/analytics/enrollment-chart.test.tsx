import { render, screen } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { EnrollmentChart } from '@features/analytics/components/enrollment-chart';
import type { CourseEnrollmentPoint } from '@shared/api/generated/models';

// jsdom не реализует layout, поэтому ResponsiveContainer из recharts
// никогда не получает ненулевые размеры без этого — стандартный обход
// для тестирования recharts-графиков под jsdom.
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    value: 500,
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    value: 300,
  });
  if (typeof ResizeObserver === 'undefined') {
    // @ts-expect-error — минимальный полифилл только для тестового окружения
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

afterAll(() => {
  Reflect.deleteProperty(HTMLElement.prototype, 'offsetWidth');
  Reflect.deleteProperty(HTMLElement.prototype, 'offsetHeight');
});

const sampleData: CourseEnrollmentPoint[] = [
  { courseId: '1', courseTitle: 'React с нуля', enrollments: 42 },
  { courseId: '2', courseTitle: 'TypeScript глубоко', enrollments: 17 },
];

describe('EnrollmentChart', () => {
  it('renders the chart title and card without crashing when data is present', () => {
    render(<EnrollmentChart data={sampleData} />);

    expect(screen.getByText('Зачисления по курсам')).toBeInTheDocument();
    expect(screen.queryByText(/Нет зачислений/)).not.toBeInTheDocument();
  });

  it('does not crash and shows an empty-state placeholder for an empty dataset', () => {
    render(<EnrollmentChart data={[]} />);

    expect(screen.getByText('Нет зачислений за выбранный период')).toBeInTheDocument();
  });
});
