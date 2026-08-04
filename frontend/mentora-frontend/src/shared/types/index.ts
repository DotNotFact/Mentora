// UserRole — использовать сгенерированный тип из '@shared/types/api'
// (orval), не дублировать вручную (CLAUDE.md, правило #19).

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
