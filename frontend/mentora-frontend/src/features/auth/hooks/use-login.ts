import { useMutation } from '@tanstack/react-query';
import { authApi } from '@shared/api/client';
import { useAuthStore } from '../store';
import type { LoginFormValues } from '../schemas';

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (values: LoginFormValues) => authApi.login(values),
    onSuccess: ({ data }) => {
      setSession(data.user, data.accessToken, data.refreshToken);
    },
  });
}
