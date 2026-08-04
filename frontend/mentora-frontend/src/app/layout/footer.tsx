import { APP_NAME } from '@shared/lib/constants';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border bg-surface border-t">
      <div className="text-muted-foreground mx-auto max-w-7xl px-4 py-6 text-sm sm:px-6 lg:px-8">
        © {year} {APP_NAME}
      </div>
    </footer>
  );
}
