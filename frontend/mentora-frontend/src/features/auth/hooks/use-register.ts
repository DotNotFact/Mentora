import { useMutation } from '@tanstack/react-query';
import { authApi } from '@shared/api/client';
import { useAuthStore } from '../store';
import type { RegisterFormValues } from '../schemas';

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (values: RegisterFormValues) => authApi.register(values),
    onSuccess: ({ data }) => {
      setSession(data.user, data.accessToken, data.refreshToken);
    },
  });
}
