import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { LoginRequestDto } from "@/modules/auth/application/dto/auth.dto";
import type { UserAuth } from "@/modules/auth/domain/entities/user-auth.entity";
import { LoginUseCase } from "@/modules/auth/application/use-cases/login.usecase";
import { RefreshTokenUseCase } from "@/modules/auth/application/use-cases/refresh-token.usecase";

const STORAGE_KEY = "recruit-ai.auth";

type AuthStore = {
  userAuth: UserAuth | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequestDto) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<boolean>;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      userAuth: null,
      isAuthenticated: false,
      async login(credentials) {
        const useCase = new LoginUseCase();
        const userAuth = await useCase.execute(credentials);
        set({
          userAuth,
          isAuthenticated: Boolean(userAuth?.accessToken),
        });
      },
      logout() {
        set({ userAuth: null, isAuthenticated: false });
      },
      async refreshSession() {
        const refreshToken = get().userAuth?.refreshToken;
        if (!refreshToken) {
          set({ userAuth: null, isAuthenticated: false });
          return false;
        }

        const useCase = new RefreshTokenUseCase();
        const userAuth = await useCase.execute(refreshToken);
        set({
          userAuth,
          isAuthenticated: Boolean(userAuth?.accessToken),
        });
        return true;
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => window.localStorage),
      partialize: (state) => ({
        userAuth: state.userAuth,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = Boolean(state.userAuth?.accessToken);
        }
      },
    }
  )
);

export const useAuth = () => useAuthStore();
