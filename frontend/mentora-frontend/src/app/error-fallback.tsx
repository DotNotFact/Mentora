import { AlertTriangle } from 'lucide-react';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { Button } from '@shared/ui/button';

// Полноэкранный фолбэк для роутов (router.tsx → defaultErrorComponent).
// TanStack Router оборачивает КАЖДЫЙ смэтченный роут в свой CatchBoundary
// с этим компонентом — RootLayout (header/footer) вокруг остаётся живым,
// падает только содержимое конкретного роута.
export function RouteErrorFallback({ error, reset }: ErrorComponentProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <AlertTriangle className="text-destructive h-10 w-10" aria-hidden="true" />
      <div className="space-y-1">
        <h1 className="text-foreground text-xl font-semibold tracking-tight">Что-то пошло не так</h1>
        <p className="text-muted-foreground text-sm">
          {error instanceof Error ? error.message : 'Произошла непредвиденная ошибка.'}
        </p>
      </div>
      <Button type="button" onClick={reset}>
        Повторить попытку
      </Button>
    </div>
  );
}

interface WidgetErrorFallbackProps {
  title?: string;
}

// Локальный фолбэк для CatchBoundary вокруг тяжёлых виджетов (видеоплеер,
// редактор курса) — карточка вместо полной страницы, чтобы не выбивать
// пользователя из остального содержимого страницы при сбое одного блока.
export function WidgetErrorFallback({ title = 'Не удалось отобразить этот блок' }: WidgetErrorFallbackProps) {
  return (
    <div className="border-destructive/30 bg-destructive/5 flex flex-col items-center gap-2 rounded-xl border border-dashed p-8 text-center">
      <AlertTriangle className="text-destructive h-6 w-6" aria-hidden="true" />
      <p className="text-foreground text-sm font-medium">{title}</p>
      <p className="text-muted-foreground text-xs">Остальная часть страницы работает как обычно.</p>
    </div>
  );
}
