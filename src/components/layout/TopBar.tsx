import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Bell, Search, Sun, Moon, User, LogOut, PanelLeft, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUI } from "@/store/ui";
import { notifications } from "@/mocks/data";
import { relTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const crumbMap: Record<string, string> = {
  dashboard: "Dashboard", tickets: "Tickets", escalations: "Escalations",
  agents: "Agents", knowledge: "Knowledge", evals: "Evals",
  analytics: "Analytics", audit: "Audit log", settings: "Settings",
  integrations: "Integrations",
};

export function TopBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggleTheme, toggleSidebar, setCommandOpen } = useUI();
  const navigate = useNavigate();
  const parts = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <PanelLeft className="h-4 w-4" />
        </Button>
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Home</Link>
          {parts.map((p, i) => {
            const path = "/" + parts.slice(0, i + 1).join("/");
            const label = crumbMap[p] ?? p;
            const last = i === parts.length - 1;
            return (
              <span key={path} className="flex items-center gap-1.5">
                <span className="text-border">/</span>
                {last ? (
                  <span className="font-medium text-foreground">{label}</span>
                ) : (
                  <Link to={path as string} className="hover:text-foreground">{label}</Link>
                )}
              </span>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCommandOpen(true)}
          className={cn(
            "flex h-8 items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 text-xs text-muted-foreground",
            "hover:bg-muted transition-colors w-64",
          )}
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search or jump to…</span>
          <span className="ml-auto inline-flex items-center gap-0.5 rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px]">
            <Command className="h-2.5 w-2.5" />K
          </span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5">
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-medium">{n.title}</span>
                  <span className="text-[10px] text-muted-foreground">{relTime(n.ts)}</span>
                </div>
                <span className="text-xs text-muted-foreground">{n.body}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 gap-2 px-1.5">
              <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">AC</AvatarFallback></Avatar>
              <span className="hidden text-sm md:inline">Alex Chen</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span>Alex Chen</span>
              <span className="text-xs font-normal text-muted-foreground">alex@supportops.ai</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate({ to: "/login" })}>
              <LogOut className="mr-2 h-4 w-4" />Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
