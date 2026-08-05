import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from '@features/enrollment/components/progress-bar';

describe('ProgressBar', () => {
  it('renders the rounded percentage and a progressbar for a mid-range value', () => {
    render(<ProgressBar value={42.4} />);

    expect(screen.getByText('42%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders 0% at the start', () => {
    render(<ProgressBar value={0} />);

    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('renders 100% when complete', () => {
    render(<ProgressBar value={100} />);

    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
