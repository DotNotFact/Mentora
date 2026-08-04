import type { ReactNode } from 'react';
import { Navigate } from '@tanstack/react-router';
import { useAuthStore } from '@features/auth/store';

interface AuthGuardProps {
  children: ReactNode;
}

// Оборачивает защищённые роуты (dashboard/*, my-courses, courses/edit/*,
// checkout/*) по мере их появления в соответствующих schedule-задачах —
// см. CLAUDE.md, правило #22.
export function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
