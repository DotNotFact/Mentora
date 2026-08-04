import { render, screen, waitFor } from '@testing-library/react';
import { RouterProvider } from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';
import { AppProvider } from '@app/provider';
import { router } from '@app/router';

describe('app router', () => {
  it('renders the home route through the root layout (header + content + footer)', async () => {
    render(
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>,
    );

    await waitFor(() => {
      expect(screen.getAllByText('Mentora').length).toBeGreaterThan(0);
    });

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Mentora' })).toBeInTheDocument();
  });
});
