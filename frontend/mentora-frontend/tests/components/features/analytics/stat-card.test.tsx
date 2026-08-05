import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatCard } from '@features/analytics/components/stat-card';

describe('StatCard', () => {
  it('renders the label and value', async () => {
    render(<StatCard label="Доход" value="$1,234.00" />);

    expect(screen.getByText('Доход')).toBeInTheDocument();
    // Значение анимированно "считает" от 0 до цели (count-up, см.
    // .agents/skills/aaa-ui-polish/SKILL.md) — findByText ждёт финального кадра.
    expect(await screen.findByText('$1,234.00')).toBeInTheDocument();
  });

  it('does not render a delta badge when deltaPercent is not provided', () => {
    render(<StatCard label="Курсы" value="12" />);

    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it('renders a positive delta with the up indicator', () => {
    render(<StatCard label="Доход" value="$1,234.00" deltaPercent={12.5} />);

    expect(screen.getByText('12.5%')).toBeInTheDocument();
  });

  it('renders a negative delta with the down indicator and absolute value', () => {
    render(<StatCard label="Зачисления" value="42" deltaPercent={-8.2} />);

    expect(screen.getByText('8.2%')).toBeInTheDocument();
  });
});
