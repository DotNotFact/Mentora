import { useEffect, useRef, useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { cn } from '@shared/lib/utils';
import { APP_NAME } from '@shared/lib/constants';
import { findActiveItem, type NavItem } from './nav-items';

interface SidebarProps {
  items: NavItem[];
  className?: string;
}

// Sidebar — постоянная навигация (schedule/12): icon-only на планшете
// (640-1024px, "collapsible" из mentora-design/SKILL.md → Responsive —
// сжатое состояние адаптивно, не требует ручного тумблера), полная
// (иконка+подпись) на десктопе (lg: ≥1024px), скрыта на мобильном (см.
// MobileNav). Активный пункт подсвечен скользящим индикатором
// (aaa-ui-polish → "Активный пункт меню 'скользит'").
export function Sidebar({ items, className }: SidebarProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const activeItem = findActiveItem(pathname, items);
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());
  const [indicator, setIndicator] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    function measure() {
      if (!activeItem) {
        setIndicator(null);
        return;
      }
      const el = itemRefs.current.get(activeItem.to);
      if (el) {
        setIndicator({ top: el.offsetTop, height: el.offsetHeight });
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeItem]);

  return (
    <nav
      aria-label="Основная навигация"
      className={cn('relative hidden flex-col gap-1 p-3 sm:flex', className)}
    >
      <Link
        to="/"
        activeOptions={{ exact: true }}
        className="text-foreground focus-visible:ring-ring mb-2 hidden rounded-md px-2 text-lg font-semibold tracking-tight focus-visible:ring-2 focus-visible:outline-none lg:block"
      >
        {APP_NAME}
      </Link>

      {indicator && (
        <div
          aria-hidden="true"
          className="bg-primary/10 border-primary absolute left-3 w-[calc(100%-1.5rem)] rounded-md border-l-2 transition-[transform,height] duration-200 ease-[var(--ease-out-expo)]"
          style={{
            height: indicator.height,
            transform: `translateY(${indicator.top}px)`,
          }}
        />
      )}

      <ul className="relative flex flex-col gap-1">
        {items.map((item) => {
          const isActive = item.to === activeItem?.to;
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                activeOptions={{ exact: true }}
                ref={(el) => {
                  if (el) itemRefs.current.set(item.to, el);
                  else itemRefs.current.delete(item.to);
                }}
                aria-current={isActive ? 'page' : undefined}
                title={item.label}
                className={cn(
                  'text-muted-foreground hover:text-foreground focus-visible:ring-ring relative flex cursor-pointer items-center justify-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none lg:justify-start',
                  isActive && 'text-foreground',
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
