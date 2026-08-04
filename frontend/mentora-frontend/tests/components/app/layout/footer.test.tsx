import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from '@app/layout/footer';

describe('Footer', () => {
  it('renders the app name and current year', () => {
    render(<Footer />);

    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`©\\s*${year}\\s*Mentora`))).toBeInTheDocument();
  });

  it('has the contentinfo landmark role', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
