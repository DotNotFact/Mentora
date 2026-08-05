import { createRoute } from '@tanstack/react-router';
import { AuthGuard } from '@app/auth-guard';
import { PageContainer } from '@app/layout/page-container';
import { PersonalizationPage } from '@features/settings/components/personalization-page';
import { rootRoute } from '../__root';

function SettingsPersonalizationRoutePage() {
  return (
    <AuthGuard>
      <PageContainer className="space-y-8">
        <div className="space-y-1">
          <h1 className="text-foreground text-4xl leading-tight font-bold tracking-tight">
            Персонализация
          </h1>
          <p className="text-muted-foreground text-sm">
            Выберите тему интерфейса — применяется мгновенно и сохраняется между визитами.
          </p>
        </div>
        <PersonalizationPage />
      </PageContainer>
    </AuthGuard>
  );
}

export const settingsPersonalizationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings/personalization',
  component: SettingsPersonalizationRoutePage,
});
