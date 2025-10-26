import { Sidebar } from "@/modules/recruit/ui/components/Sidebar";
import { Outlet } from "@tanstack/react-router";

export const RecruitLayout = () => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};
