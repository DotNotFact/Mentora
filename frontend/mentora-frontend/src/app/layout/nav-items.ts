import {
  LayoutGrid,
  BookOpen,
  LayoutDashboard,
  Plus,
  BarChart3,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import type { UserRole } from '@shared/types/api';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
}

// Пункты меню по роли — см. schedule/12-dashboard-shell-navigation.md,
// шаг 1. Роли пока только student/instructor/admin (UserRole из
// openapi-контракта) — если schedule/13-roles-and-collaboration.md
// расширит набор ролей, добавить записи сюда, не переписывая структуру.
export const NAV_ITEMS: NavItem[] = [
  {
    to: '/courses',
    label: 'Каталог',
    icon: LayoutGrid,
    roles: ['student', 'instructor', 'admin'],
  },
  {
    to: '/my-courses',
    label: 'Мои курсы',
    icon: BookOpen,
    roles: ['student', 'instructor', 'admin'],
  },
  {
    to: '/dashboard',
    label: 'Мой дашборд',
    icon: LayoutDashboard,
    roles: ['student'],
  },
  {
    to: '/courses/edit/new',
    label: 'Создать курс',
    icon: Plus,
    roles: ['instructor', 'admin'],
  },
  {
    to: '/dashboard/instructor',
    label: 'Аналитика',
    icon: BarChart3,
    roles: ['instructor', 'admin'],
  },
  {
    to: '/dashboard/admin',
    label: 'Аналитика платформы',
    icon: ShieldCheck,
    roles: ['admin'],
  },
];

export function navItemsForRole(role: UserRole | undefined): NavItem[] {
  if (!role) return [];
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}

// Находит пункт меню, чей `to` — самое специфичное совпадение с текущим
// путём (точное совпадение или самый длинный префикс), а не первый
// частичный матч — иначе на /courses/edit/new подсветились бы сразу и
// "Каталог" (/courses), и "Создать курс" (/courses/edit/new). Общая для
// Sidebar и MobileNav — оба должны подсвечивать один и тот же пункт.
export function findActiveItem(pathname: string, items: NavItem[]): NavItem | undefined {
  const exact = items.find((item) => item.to === pathname);
  if (exact) return exact;
  const prefixMatches = items.filter((item) => pathname.startsWith(`${item.to}/`));
  if (prefixMatches.length === 0) return undefined;
  return prefixMatches.reduce((longest, item) =>
    item.to.length > longest.to.length ? item : longest,
  );
}
