import type { UserAuth } from "@/modules/auth/domain/entities/user-auth.entity";

type AuthLoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type?: string;
};

export const AuthMapper = {
  fromApi(response: AuthLoginResponse): UserAuth {
    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      tokenType: response.token_type ?? "bearer",
    }
  },
};
