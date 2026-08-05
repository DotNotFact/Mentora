import { z } from 'zod';
import type { AnalyticsPeriod } from '@shared/api/generated/models';

// Пресеты периода аналитики — без произвольного диапазона дат (см.
// schedule/06-analytics-dashboard.md → "Не входит"). Значения совпадают
// с `AnalyticsPeriod` из orval-контракта; схема нужна для локального
// UI-state (Select периода на дашбордах), а не для валидации ответа API.
export const analyticsPeriodSchema = z.enum(['7d', '30d', '90d']);

export type AnalyticsPeriodValue = z.infer<typeof analyticsPeriodSchema>;

export const DEFAULT_ANALYTICS_PERIOD: AnalyticsPeriod = '30d';

export const ANALYTICS_PERIOD_OPTIONS: Array<{ value: AnalyticsPeriod; label: string }> = [
  { value: '7d', label: 'За 7 дней' },
  { value: '30d', label: 'За 30 дней' },
  { value: '90d', label: 'За 90 дней' },
];
