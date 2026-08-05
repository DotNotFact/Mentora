import { render, screen } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { RevenueChart } from '@features/analytics/components/revenue-chart';
import type { RevenuePoint } from '@shared/api/generated/models';

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

const sampleData: RevenuePoint[] = [
  { date: '2026-07-01', amount: 1200 },
  { date: '2026-07-08', amount: 1800 },
  { date: '2026-07-15', amount: 900 },
];

describe('RevenueChart', () => {
  it('renders the chart title and card without crashing when data is present', () => {
    render(<RevenueChart data={sampleData} />);

    expect(screen.getByText('Доход по периодам')).toBeInTheDocument();
    expect(screen.queryByText(/Нет данных/)).not.toBeInTheDocument();
  });

  it('renders a custom title when provided', () => {
    render(<RevenueChart data={sampleData} title="Доход платформы по периодам" />);

    expect(screen.getByText('Доход платформы по периодам')).toBeInTheDocument();
  });

  it('does not crash and shows an empty-state placeholder for an empty dataset', () => {
    render(<RevenueChart data={[]} />);

    expect(screen.getByText('Нет данных о доходе за выбранный период')).toBeInTheDocument();
  });
});
