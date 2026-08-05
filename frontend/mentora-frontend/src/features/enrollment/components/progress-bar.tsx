import { Progress } from '@shared/ui/progress';

interface ProgressBarProps {
  value: number;
}

// Обёртка над shared/ui/progress (h-2 rounded-full, transition-all уже
// встроен в индикатор — анимируется сам при изменении value) с подписью
// процента для контекста страницы обучения.
export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Прогресс курса</span>
        <span className="text-foreground font-medium">{Math.round(value)}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}
