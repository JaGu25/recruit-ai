import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { LoginRequestDto } from "@/modules/auth/application/dto/auth.dto";
import type { UserAuth } from "@/modules/auth/domain/entities/user-auth.entity";
import { LoginUseCase } from "@/modules/auth/application/use-cases/login.usecase";

const STORAGE_KEY = "recruit-ai.auth";

type AuthStore = {
  userAuth: UserAuth | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequestDto) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
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
