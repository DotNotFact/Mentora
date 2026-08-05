import { Link } from '@tanstack/react-router';
import { Compass } from 'lucide-react';
import { Button } from '@shared/ui/button';

// router.tsx → defaultNotFoundComponent: несматченный URL и ручные
// `notFound()`-ответы (например, курс с несуществующим id).
export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <Compass className="text-muted-foreground h-10 w-10" aria-hidden="true" />
      <div className="space-y-1">
        <h1 className="text-foreground text-xl font-semibold tracking-tight">Страница не найдена</h1>
        <p className="text-muted-foreground text-sm">
          Возможно, ссылка устарела или страница была перемещена.
        </p>
      </div>
      <Button asChild>
        <Link to="/">На главную</Link>
      </Button>
    </div>
  );
}
