import { type ReactNode, useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";

import { useAuth } from "@/app/providers/auth-context";
import { FullLoadingScreen } from "@/modules/shared/ui/full-loading-screen";

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const { userAuth, refreshSession, isAuthenticated } = useAuth();
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    const verify = async () => {
      if (!userAuth?.refreshToken || !isAuthenticated) {
        router.navigate({ to: "/login" });
        return;
      }

      try {
        await refreshSession();
        setStatus("ready");
      } catch (error) {
        console.log(error);
        router.navigate({ to: "/login" });
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "loading") {
    return <FullLoadingScreen message="Validating your session..." />;
  }

  return <>{children}</>;
};
