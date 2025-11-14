import { createRootRoute, Outlet } from "@tanstack/react-router";

export const RootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="grow flex flex-col">
        <Outlet />
      </main>
    </div>
  ),
});
