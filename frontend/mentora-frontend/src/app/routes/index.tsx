import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';

// TODO: превью каталога курсов при выполнении schedule/02-courses-catalog
function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-foreground text-4xl font-bold tracking-tight">Mentora</h1>
    </div>
  );
}

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});
