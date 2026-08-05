import { useMutation } from '@tanstack/react-query';
import { paymentsApi } from '@shared/api/client';

// Возвращает checkoutUrl (Stripe hosted page) — редирект на него делает
// вызывающий компонент (window.location.assign), не сам хук, чтобы хук
// оставался тестируемым без jsdom-навигации.
export function useCreateCheckout() {
  return useMutation({
    mutationFn: (courseId: string) => paymentsApi.createCheckoutSession({ courseId }),
  });
}
