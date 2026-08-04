import { Link } from '@tanstack/react-router';
import { APP_NAME } from '@shared/lib/constants';

export function Header() {
  return (
    <header className="border-border bg-surface sticky top-0 z-10 border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-foreground text-lg font-semibold tracking-tight">
          {APP_NAME}
        </Link>
      </div>
    </header>
  );
}
