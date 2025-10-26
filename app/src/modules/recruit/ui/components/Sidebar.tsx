import { Link, useRouterState } from "@tanstack/react-router";
import { Upload, MessageSquare } from "lucide-react";
import { cn } from "@/modules/shared/utils/cn";

const menuItems = [
  { label: "Upload CVs", path: "/recruit/upload", icon: Upload },
  { label: "Chat", path: "/recruit/chat", icon: MessageSquare },
];

export const Sidebar = () => {
  const { location } = useRouterState();

  return (
    <aside className="w-60 h-screen border-r border-border bg-muted/30 flex flex-col py-6 px-4">
      <h1 className="text-xl font-semibold px-2 mb-6">Recruit-AI</h1>

      <nav className="flex flex-col gap-1">
        {menuItems.map(({ label, path, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto text-xs text-muted-foreground px-3 pt-4 border-t border-border">
        © 2025 Recruit-AI
      </div>
    </aside>
  );
};
