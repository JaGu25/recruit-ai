import { type ReactNode, useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";

import { useAuth } from "@/app/providers/auth-context";

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    if (!isAuthenticated) {
      router.navigate({ to: "/login" });
      return;
    }

    setStatus("ready");
  }, [isAuthenticated, router]);

  if (status === "loading") {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">
        Checking your session...
      </div>
    );
  }

  return <>{children}</>;
};
