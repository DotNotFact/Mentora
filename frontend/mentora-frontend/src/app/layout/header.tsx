import { Link } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { APP_NAME } from '@shared/lib/constants';
import { Button } from '@shared/ui/button';
import { useAuthStore } from '@features/auth/store';
import { useLogout } from '@features/auth/hooks/use-logout';

export function Header() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useLogout();

  return (
    <header className="border-border bg-surface sticky top-0 z-10 border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-foreground text-lg font-semibold tracking-tight">
          {APP_NAME}
        </Link>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <span className="text-foreground text-sm font-medium">{user.fullName}</span>
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
          <Button asChild size="sm">
            <Link to="/login">Войти</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
