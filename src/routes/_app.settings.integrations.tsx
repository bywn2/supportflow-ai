import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { CreditCard, Building2, LifeBuoy, MessageSquare, Slack, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/settings/integrations")({
  component: Integrations,
  head: () => ({ meta: [{ title: "Integrations — SupportOps AI" }] }),
});

const initial = [
  { id: "stripe", name: "Stripe", desc: "Refunds, invoices, subscriptions", icon: CreditCard, connected: true, lastSync: "2m ago", tools: ["create_refund", "get_invoice", "cancel_subscription"] },
  { id: "salesforce", name: "Salesforce", desc: "Customer lookup and CRM sync", icon: Building2, connected: true, lastSync: "5m ago", tools: ["get_account", "get_opportunity"] },
  { id: "zendesk", name: "Zendesk", desc: "Ticket updates and macros", icon: LifeBuoy, connected: true, lastSync: "1m ago", tools: ["update_ticket", "add_comment", "assign_agent"] },
  { id: "twilio", name: "Twilio", desc: "SMS and voice notifications", icon: MessageSquare, connected: false, lastSync: "—", tools: ["send_sms", "make_call"] },
  { id: "slack", name: "Slack", desc: "Escalation channel notifications", icon: Slack, connected: false, lastSync: "—", tools: ["post_message", "create_channel"] },
  { id: "hubspot", name: "HubSpot", desc: "Marketing contact enrichment", icon: Users2, connected: false, lastSync: "—", tools: ["get_contact", "update_contact"] },
];

function Integrations() {
  const [items, setItems] = useState(initial);
  const [configuring, setConfiguring] = useState<string | null>(null);
  const cur = items.find((i) => i.id === configuring);

  return (
    <div>
      <PageHeader title="Integrations" description="MCP servers your agents can invoke as tools." />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <Card key={it.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted/40">
                  <Icon className="h-5 w-5" />
                </div>
                <Badge variant={it.connected ? "default" : "outline"} className={cn(it.connected && "bg-[oklch(0.68_0.16_155)] hover:bg-[oklch(0.68_0.16_155)]")}>
                  {it.connected ? "Connected" : "Not connected"}
                </Badge>
              </div>
              <div className="mt-3 text-sm font-semibold">{it.name}</div>
              <p className="mt-1 text-xs text-muted-foreground">{it.desc}</p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Last sync: {it.lastSync}</span>
                <span>{it.tools.length} tools</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setConfiguring(it.id)}>Configure</Button>
                {!it.connected && (
                  <Button size="sm" className="flex-1" onClick={() => { setItems((p) => p.map((x) => x.id === it.id ? { ...x, connected: true, lastSync: "just now" } : x)); toast.success(`${it.name} connected`); }}>Connect</Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!configuring} onOpenChange={() => setConfiguring(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{cur?.name} tool permissions</DialogTitle></DialogHeader>
          <div className="space-y-2">
            {cur?.tools.map((t) => (
              <label key={t} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                <Checkbox defaultChecked />
                <span className="font-mono text-xs">{t}</span>
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfiguring(null)}>Cancel</Button>
            <Button onClick={() => { setConfiguring(null); toast.success("Permissions updated"); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
