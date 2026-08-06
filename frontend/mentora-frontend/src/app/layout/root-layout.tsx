import type { ReactNode } from 'react';
import { useAuthStore } from '@features/auth/store';
import { Sidebar } from './sidebar';
import { MobileNav } from './mobile-nav';
import { TopBar } from './top-bar';
import { Footer } from './footer';
import { navItemsForRole } from './nav-items';

interface RootLayoutProps {
  children: ReactNode;
}

// Dashboard shell (schedule/12) — заменяет прежний тонкий Header.
// Sidebar/MobileNav рендерятся только для аутентифицированных
// пользователей (гость без роли получает пустой список пунктов — см.
// navItemsForRole(undefined)); неаутентифицированные видят только
// TopBar (Войти) + контент, как и раньше.
export function RootLayout({ children }: RootLayoutProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role);
  const items = navItemsForRole(role);
  const showNav = isAuthenticated && items.length > 0;

  return (
    <div className="flex min-h-screen">
      {showNav && (
        <Sidebar items={items} className="border-border/60 shrink-0 border-r sm:w-16 lg:w-64" />
      )}
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar />
        <main className="flex-1 pb-16 sm:pb-0">{children}</main>
        <Footer />
      </div>
      {showNav && <MobileNav items={items} />}
    </div>
  );
}
