import { Check } from 'lucide-react';
import { Card, CardContent } from '@shared/ui/card';
import { cn } from '@shared/lib/utils';
import { THEMES } from '@shared/config/themes';
import { useThemeStore } from '../store';

// Каждая карточка темы — сама переключатель (клик = выбор), а не
// отдельный список + независимый light/dark toggle: с фиксированным
// набором из 5 тем (4 тёмных + 1 светлая, не 4+4) отдельный тумблер
// светлый/тёмный был бы рассинхронизирован с доступными пресетами —
// см. schedule/11 → "Отклонения".
export function PersonalizationPage() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {THEMES.map((option) => {
        const isSelected = option.id === theme;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setTheme(option.id)}
            aria-pressed={isSelected}
            className="cursor-pointer text-left"
          >
            <Card
              className={cn(
                'transition-all duration-150',
                isSelected && 'border-primary border-2',
              )}
            >
              <CardContent className="space-y-3 p-4">
                <div
                  className="flex h-16 items-center justify-center gap-2 rounded-lg"
                  style={{ backgroundColor: option.previewBackground }}
                >
                  <span
                    className="size-8 rounded-full"
                    style={{ backgroundColor: option.previewPrimary }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-sm font-medium">{option.name}</span>
                  {isSelected && (
                    <Check
                      className="text-primary size-4"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
