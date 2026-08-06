import { Link, useRouterState } from '@tanstack/react-router';
import { cn } from '@shared/lib/utils';
import { findActiveItem, type NavItem } from './nav-items';

interface MobileNavProps {
  items: NavItem[];
}

// Bottom nav — Mobile <640px per mentora-design/SKILL.md → "Responsive".
// Ограничено 5 пунктами (типичный лимит tab-bar паттерна) — при роли с
// большим количеством пунктов (admin — 5 сейчас) все ещё умещаются, но
// это стоит помнить, если NAV_ITEMS вырастет.
export function MobileNav({ items }: MobileNavProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const activeItem = findActiveItem(pathname, items);

  return (
    <nav
      aria-label="Основная навигация"
      className="bg-card border-border/60 fixed inset-x-0 bottom-0 z-10 flex border-t sm:hidden"
    >
      {items.map((item) => {
        const isActive = item.to === activeItem?.to;
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: true }}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'text-muted-foreground focus-visible:ring-ring flex flex-1 cursor-pointer flex-col items-center gap-1 py-2 text-xs font-medium transition-colors duration-150 focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none',
              isActive && 'text-primary',
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
            <span className="leading-none">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
