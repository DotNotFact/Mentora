import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@shared/types/api';
import { tokenStorage } from '@shared/lib/token-storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setSession: (user: User, accessToken: string, refreshToken: string) => void;
  clearSession: () => void;
}

// accessToken/refreshToken намеренно не хранятся в этом сторе — их
// источник истины shared/lib/token-storage.ts (нужен axios-интерсепторам
// вне React). Здесь только то, что нужно для реактивного UI.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setSession: (user, accessToken, refreshToken) => {
        tokenStorage.setTokens(accessToken, refreshToken);
        set({ user, isAuthenticated: true });
      },
      clearSession: () => {
        tokenStorage.clearTokens();
        set({ user: null, isAuthenticated: false });
      },
    }),
    { name: 'mentora-auth' },
  ),
);
