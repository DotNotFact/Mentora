import type { ReactNode } from 'react';
import { Navigate } from '@tanstack/react-router';
import { useAuthStore } from '@features/auth/store';
import type { UserRole } from '@shared/types/api';

interface AuthGuardProps {
  children: ReactNode;
  /**
   * Если задано — доступ разрешён только пользователям с одной из этих
   * ролей (например, редактор курса — только `instructor`/`admin`,
   * дашборд админа — только `admin`). Без роли не подходящий пользователь
   * редиректится на главную, а не на /login (он аутентифицирован, просто
   * не имеет прав).
   */
  allowedRoles?: UserRole[];
}

// Оборачивает защищённые роуты (dashboard/*, my-courses, courses/edit/*,
// checkout/*) по мере их появления в соответствующих schedule-задачах —
// см. CLAUDE.md, правило #22.
export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
