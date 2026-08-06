import { Link } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { APP_NAME } from '@shared/lib/constants';
import { Button } from '@shared/ui/button';
import { useAuthStore } from '@features/auth/store';
import { useLogout } from '@features/auth/hooks/use-logout';

// Компактная верхняя полоса — заменяет прежний Header (schedule/12).
// Название приложения дублируется здесь только для экранов без полного
// Sidebar (мобильный/планшет — см. Sidebar's "hidden lg:block" на своей
// копии названия); профиль/выход/персонализация — на всех размерах.
export function TopBar() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useLogout();

  return (
    <header className="border-border/60 bg-surface sticky top-0 z-10 border-b">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="text-foreground text-lg font-semibold tracking-tight lg:hidden">
          {APP_NAME}
        </Link>

        {isAuthenticated && user ? (
          <div className="ml-auto flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/settings/personalization">Персонализация</Link>
            </Button>
            <span className="text-foreground hidden text-sm font-medium sm:inline">
              {user.fullName}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={logout.isPending}
              onClick={() => logout.mutate()}
            >
              {logout.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
              Выйти
            </Button>
          </div>
        ) : (
          <Button asChild size="sm" className="ml-auto">
            <Link to="/login">Войти</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
