import { createRouter, RouterProvider } from "@tanstack/react-router";
import { RootRoute } from "./root-route";
import { authRoute } from "./auth.route";
import { recruitRoutes } from "./recruit.route";

const routeTree = RootRoute.addChildren([authRoute, ...recruitRoutes]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function AppRouter() {
  return <RouterProvider router={router} />;
}
