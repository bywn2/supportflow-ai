import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { agents } from "@/mocks/data";
import * as Icons from "lucide-react";
import { ms } from "@/lib/format";

export const Route = createFileRoute("/_app/agents/")({
  component: AgentsPage,
  head: () => ({ meta: [{ title: "Agents — SupportOps AI" }] }),
});

function AgentsPage() {
  return (
    <div>
      <PageHeader title="Agents" description="Six specialist agents power your ticket resolution pipeline." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {agents.map((a) => {
          const Icon = (Icons as any)[a.icon] ?? Icons.Bot;
          return (
            <Link key={a.id} to="/agents/$id" params={{ id: a.id }}>
              <Card className="p-4 transition-colors hover:border-primary/50">
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.68_0.16_155)]" /> {a.status}
                  </span>
                </div>
                <div className="mt-3 text-sm font-semibold">{a.name}</div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{a.role}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-[11px]">
                  <div><div className="text-muted-foreground">Calls</div><div className="font-mono font-medium">{a.callsToday}</div></div>
                  <div><div className="text-muted-foreground">Latency</div><div className="font-mono font-medium">{ms(a.avgLatencyMs)}</div></div>
                  <div><div className="text-muted-foreground">Success</div><div className="font-mono font-medium">{Math.round(a.successRate * 100)}%</div></div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
