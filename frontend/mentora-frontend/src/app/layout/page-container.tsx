import type { ReactNode } from 'react';
import { cn } from '@shared/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

// Единая обёртка контента страницы — центрирование + отступы. Роуты
// используют её вместо повторения `mx-auto max-w-7xl px-4 py-12
// sm:px-6 lg:px-8` вручную, чтобы новая страница не могла случайно
// забыть один из классов (например mx-auto) и "прилипнуть" к левому краю.
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn('mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8', className)}>{children}</div>
  );
}
