import { Palette } from 'lucide-react';
import { createRoute } from '@tanstack/react-router';
import { AuthGuard } from '@app/auth-guard';
import { PageContainer } from '@app/layout/page-container';
import { PageHeader } from '@app/layout/page-header';
import { PersonalizationPage } from '@features/settings/components/personalization-page';
import { rootRoute } from '../__root';

function SettingsPersonalizationRoutePage() {
  return (
    <AuthGuard>
      <PageContainer className="space-y-8">
        <PageHeader
          icon={Palette}
          title="Персонализация"
          description="Выберите тему интерфейса — применяется мгновенно и сохраняется между визитами."
        />
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
