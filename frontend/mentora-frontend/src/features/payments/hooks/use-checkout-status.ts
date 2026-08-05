import { useQuery } from '@tanstack/react-query';
import { paymentsApi } from '@shared/api/client';
import type { CheckoutSessionStatusValue } from '@shared/types/api';

const TERMINAL_STATUSES: CheckoutSessionStatusValue[] = ['completed', 'failed', 'expired'];
const POLL_INTERVAL_MS = 2000;

// Поллинг статуса сессии оплаты после возврата пользователя со Stripe.
// Останавливается сам, как только статус становится финальным — не нужно
// вручную вызывать stopPolling где-то в компоненте.
export function useCheckoutStatus(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['payments', 'session-status', sessionId],
    queryFn: () => paymentsApi.getCheckoutSessionStatus(sessionId as string),
    enabled: Boolean(sessionId),
    refetchInterval: (query) => {
      const status = query.state.data?.data.status;
      return status && TERMINAL_STATUSES.includes(status) ? false : POLL_INTERVAL_MS;
    },
  });
}
