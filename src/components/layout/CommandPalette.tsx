import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { useUI } from "@/store/ui";
import { tickets, agents } from "@/mocks/data";
import { LayoutDashboard, Ticket, AlertTriangle, Bot, BookOpen, FlaskConical, BarChart3, ScrollText, Settings } from "lucide-react";

const pages = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Tickets", to: "/tickets", icon: Ticket },
  { label: "Escalations", to: "/escalations", icon: AlertTriangle },
  { label: "Agents", to: "/agents", icon: Bot },
  { label: "Knowledge", to: "/knowledge", icon: BookOpen },
  { label: "Evals", to: "/evals", icon: FlaskConical },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "Audit log", to: "/audit", icon: ScrollText },
  { label: "Settings", to: "/settings", icon: Settings },
];

export function CommandPalette() {
  const { commandOpen, setCommandOpen, setShortcutsOpen } = useUI();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
      if (e.key === "?" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        setShortcutsOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commandOpen, setCommandOpen, setShortcutsOpen]);

  const go = (to: string) => {
    setCommandOpen(false);
    navigate({ to });
  };

  return (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder="Search pages, tickets, agents…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Pages">
          {pages.map((p) => {
            const Icon = p.icon;
            return (
              <CommandItem key={p.to} onSelect={() => go(p.to)}>
                <Icon className="mr-2 h-4 w-4" />{p.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Tickets">
          {tickets.slice(0, 8).map((t) => (
            <CommandItem key={t.id} onSelect={() => go(`/tickets/${t.id}`)}>
              <span className="font-mono text-xs mr-2 text-muted-foreground">{t.id}</span>
              {t.subject}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Agents">
          {agents.map((a) => (
            <CommandItem key={a.id} onSelect={() => go(`/agents/${a.id}`)}>
              <Bot className="mr-2 h-4 w-4" />{a.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
