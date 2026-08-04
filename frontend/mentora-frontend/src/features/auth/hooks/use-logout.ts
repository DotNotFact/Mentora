import { useMutation } from '@tanstack/react-query';
import { authApi } from '@shared/api/client';
import { tokenStorage } from '@shared/lib/token-storage';
import { useAuthStore } from '../store';

export function useLogout() {
  const clearSession = useAuthStore((state) => state.clearSession);

  return useMutation({
    mutationFn: async () => {
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        await authApi.logout({ refreshToken });
      }
    },
    // Локальная сессия чистится в любом случае — даже если запрос на
    // сервер не удался (сеть недоступна, токен уже истёк).
    onSettled: () => {
      clearSession();
    },
  });
}
