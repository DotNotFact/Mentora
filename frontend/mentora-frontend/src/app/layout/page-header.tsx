import type { ComponentType, ReactNode } from 'react';
import { cn } from '@shared/lib/utils';

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: string;
  icon?: ComponentType<{ className?: string; strokeWidth?: number; 'aria-hidden'?: boolean }>;
  actions?: ReactNode;
  className?: string;
}

// Стилизованный header-баннер над контентом страницы — замена голому
// `<h1>` на приборной панели/каталоге/т.п. (2026-08-07, по прямому запросу
// администратора: "не та цветовая гамма/недостаточно плотно" — нужен
// единый узнаваемый верх у каждой ключевой страницы, не просто заголовок
// на фоне страницы). Это единственная "featured surface" страницы —
// градиент здесь не конфликтует с правилом "не более одного элемента со
// свечением на экран" (см. mentora-design/SKILL.md → Elevation), потому
// что сам баннер и есть тот один акцентный элемент.
export function PageHeader({
  title,
  description,
  eyebrow,
  icon: Icon,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'from-primary/15 via-card to-card border-border/60 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 shadow-sm sm:p-8',
        className,
      )}
    >
      {Icon && (
        <Icon
          className="text-primary/10 pointer-events-none absolute -top-8 -right-8 h-40 w-40"
          strokeWidth={1}
          aria-hidden
        />
      )}
      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <div className="space-y-2">
          {eyebrow && (
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="text-foreground text-4xl leading-tight font-bold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground max-w-2xl text-base">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
