import { createRoute } from "@tanstack/react-router";
import { RootRoute } from "./root-route";
import LoginPage from "@/modules/auth/ui/pages/login/LoginPage";

export const authRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/login",
  component: LoginPage,
});
