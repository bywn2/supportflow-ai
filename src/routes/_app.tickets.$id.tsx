import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { StatusBadge, PriorityBadge } from "@/components/tickets/StatusBadge";
import { CopyId } from "@/components/CopyId";
import { tickets, customers, traces, agents, policies } from "@/mocks/data";
import { relTime, money, ms, absTime } from "@/lib/format";
import { ChevronDown, CheckCircle2, AlertTriangle, XCircle, RefreshCw, ArrowUpRight, ThumbsUp, ThumbsDown } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/tickets/$id")({
  loader: ({ params }) => {
    const t = tickets.find((x) => x.id === params.id);
    if (!t) throw notFound();
    return t;
  },
  component: TicketDetail,
  notFoundComponent: () => (
    <div className="py-24 text-center">
      <div className="text-sm text-muted-foreground">Ticket not found</div>
    </div>
  ),
  head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `${loaderData.id} — SupportOps AI` : "Ticket" }] }),
});

function TicketDetail() {
  const t = Route.useLoaderData();
  const nav = useNavigate();
  const cust = customers.find((c) => c.id === t.customerId)!;
  const trace = traces[t.id];
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const doAction = async (kind: string, msg: string) => {
    setBusy(kind);
    await new Promise((r) => setTimeout(r, 350));
    setBusy(null);
    toast.success(msg);
  };

  const totalMs = trace.steps.reduce((a, s) => a + s.durationMs, 0);
  const totalCost = trace.steps.reduce((a, s) => a + s.costUsd, 0);

  const related = tickets.filter((x) => x.customerId === cust.id && x.id !== t.id).slice(0, 3);

  return (
    <div>
      <PageHeader
        title={t.subject}
        description={<CopyId id={t.id} /> as unknown as string}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={t.status} />
            <PriorityBadge priority={t.priority} />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr_320px]">
        {/* LEFT */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10"><AvatarFallback>{cust.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{cust.name}</div>
                <div className="truncate text-xs text-muted-foreground">{cust.email}</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div><div className="text-muted-foreground">Plan</div><div className="mt-0.5 font-medium">{cust.plan}</div></div>
              <div><div className="text-muted-foreground">LTV</div><div className="mt-0.5 font-medium">{money(cust.ltv)}</div></div>
              <div><div className="text-muted-foreground">Tickets</div><div className="mt-0.5 font-medium">{cust.ticketsCount}</div></div>
              <div><div className="text-muted-foreground">Since</div><div className="mt-0.5 font-medium">{cust.since.slice(0, 7)}</div></div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Related tickets</h4>
            {related.length === 0 && <div className="text-xs text-muted-foreground">No related tickets.</div>}
            <div className="space-y-2">
              {related.map((r) => (
                <Link key={r.id} to="/tickets/$id" params={{ id: r.id }} className="block rounded-md border border-border p-2 text-xs hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-muted-foreground">{r.id}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="mt-1 truncate">{r.subject}</div>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Context</h4>
            <div className="space-y-1 text-xs">
              {contextRowsFor(t.category, t.id).map((r) => (
                <div key={r.label} className="flex justify-between gap-2">
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className="truncate font-mono text-right">{r.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* CENTER */}
        <div className="space-y-4 min-w-0">
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Original message</span>
              <span title={absTime(t.createdAt)}>{relTime(t.createdAt)}</span>
            </div>
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0"><AvatarFallback className="text-[10px]">{cust.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
              <div className="text-sm leading-relaxed">{t.message}</div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Agent pipeline</h3>
              {t.status === "in_progress" && (
                <span className="flex items-center gap-1.5 text-[11px] text-[oklch(0.6_0.16_155)]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.6_0.16_155)] opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[oklch(0.6_0.16_155)]" />
                  </span>
                  Live — Executor running
                </span>
              )}
            </div>
            <PipelineStrip steps={trace.steps} activeStatus={t.status} />
          </Card>

          <Card className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Agent trace</h3>
              <div className="text-xs text-muted-foreground">
                Total: <span className="font-mono">{ms(totalMs)}</span> · <span className="font-mono">{money(totalCost)}</span> · {trace.steps.length} steps
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />
              <div className="space-y-3">
                {trace.steps.map((s, i) => (
                  <TraceStep key={i} step={s} index={i} isActive={t.status === "in_progress" && i === trace.steps.length - 2} />
                ))}
              </div>
            </div>
          </Card>

        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">Final outcome</div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[oklch(0.6_0.16_155)]" />
              <span className="text-sm font-semibold">{trace.outcome}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
              <div>Total time <div className="mt-0.5 font-mono text-sm text-foreground">{ms(totalMs)}</div></div>
              <div>Total cost <div className="mt-0.5 font-mono text-sm text-foreground">{money(totalCost)}</div></div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" onClick={() => doAction("approve", "Resolution approved")} disabled={busy === "approve"}>
                <ThumbsUp className="mr-1 h-3.5 w-3.5" /> Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => doAction("reject", "Resolution rejected")} disabled={busy === "reject"}>
                <ThumbsDown className="mr-1 h-3.5 w-3.5" /> Reject
              </Button>
              <Button size="sm" variant="outline" onClick={() => doAction("escalate", "Escalated to human review")} disabled={busy === "escalate"}>
                <ArrowUpRight className="mr-1 h-3.5 w-3.5" /> Escalate
              </Button>
              <Button size="sm" variant="outline" onClick={() => doAction("rerun", "Re-running with updated prompt…")} disabled={busy === "rerun"}>
                <RefreshCw className={cn("mr-1 h-3.5 w-3.5", busy === "rerun" && "animate-spin")} /> Rerun
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confidence</h4>
            <ConfidenceGauge value={t.confidence} />
          </Card>

          <Card className="p-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Knowledge used</h4>
            <div className="space-y-1.5">
              {policies.slice(0, 3).map((p) => (
                <Link key={p.id} to="/knowledge" className="block text-xs text-primary hover:underline">
                  {p.title}
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Human notes</h4>
            <Textarea rows={4} placeholder="Add a note for the audit trail…" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <Button size="sm" className="mt-2 w-full" variant="outline" onClick={() => { setNotes(""); toast.success("Note added"); }}>Save note</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TraceStep({ step, index, isActive = false }: { step: typeof traces[string]["steps"][number]; index: number; isActive?: boolean }) {
  const [open, setOpen] = useState(false);
  const Icon = step.status === "ok" ? CheckCircle2 : step.status === "warn" ? AlertTriangle : XCircle;
  const color = step.status === "ok" ? "text-[oklch(0.6_0.16_155)] bg-[oklch(0.68_0.16_155/0.15)]"
    : step.status === "warn" ? "text-[oklch(0.55_0.15_75)] bg-[oklch(0.78_0.15_75/0.15)]"
    : "text-[oklch(0.55_0.22_15)] bg-[oklch(0.6_0.22_15/0.12)]";

  return (
    <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="relative pl-8">
          <div className={cn("absolute left-0 top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full ring-4 ring-background", color, isActive && "animate-pulse")}>
            <Icon className="h-3 w-3" />
          </div>
          {isActive && (
            <span className="ml-2 inline-flex items-center rounded border border-[oklch(0.6_0.16_155/0.4)] bg-[oklch(0.68_0.16_155/0.1)] px-1.5 py-0.5 text-[10px] font-medium text-[oklch(0.6_0.16_155)]">
              running now
            </span>
          )}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Step {index + 1}: {step.agent}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{step.summary}</div>
              <ul className="mt-1.5 space-y-0.5 text-[11px] text-muted-foreground">
                {step.details.map((d, i) => <li key={i} className="font-mono">· {d}</li>)}
              </ul>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <span className="rounded border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[10px]">{ms(step.durationMs)}</span>
              <span className="rounded border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[10px]">{money(step.costUsd)}</span>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          <CollapsibleContent>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="mt-2 overflow-hidden rounded-md border border-border bg-muted/40">
              <div className="border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">Input / Output</div>
              <pre className="overflow-x-auto p-3 text-[11px] leading-relaxed">
{JSON.stringify(step.io, null, 2)}
              </pre>
            </motion.div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </motion.div>
  );
}

function ConfidenceGauge({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const angle = value * 180 - 90;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 70" className="w-full">
        <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="var(--color-muted)" strokeWidth="8" strokeLinecap="round" />
        <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="var(--color-primary)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${Math.PI * 50}`} strokeDashoffset={`${Math.PI * 50 * (1 - value)}`} />
        <line x1="60" y1="60" x2="60" y2="20" stroke="var(--color-foreground)" strokeWidth="2" transform={`rotate(${angle} 60 60)`} strokeLinecap="round" />
        <circle cx="60" cy="60" r="3" fill="var(--color-foreground)" />
      </svg>
      <div className="mt-1 text-center">
        <div className="text-2xl font-semibold">{pct}%</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Overall</div>
      </div>
    </div>
  );
}

function contextRowsFor(category: string, ticketId: string): Array<{ label: string; value: string }> {
  const seed = parseInt(ticketId.replace(/\D/g, ""), 10) || 0;
  switch (category) {
    case "refunds":
      return [
        { label: "Order", value: `A-${2800 + (seed % 200)}` },
        { label: "Amount", value: money(45 + (seed % 6) * 15) },
        { label: "Status", value: "delivered" },
        { label: "Delivered", value: relTime(Date.now() - 4 * 86400000) },
        { label: "Stripe charge", value: "ch_3M8Zp2…" },
      ];
    case "shipping":
      return [
        { label: "Order", value: `B-${1000 + (seed % 300)}` },
        { label: "Carrier", value: "FedEx Ground" },
        { label: "Tracking", value: "794658231014" },
        { label: "Last scan", value: "Out for delivery · 4d ago" },
        { label: "SLA", value: "Breached +2d" },
      ];
    case "billing":
      return [
        { label: "Customer", value: "cus_NqR8f2" },
        { label: "Plan", value: "Enterprise" },
        { label: "MRR", value: money(2400) },
        { label: "Invoice", value: `inv_${8000 + (seed % 999)}` },
        { label: "Charges (30d)", value: "6 · 1 duplicate" },
      ];
    case "account":
      return [
        { label: "User ID", value: "uid_442" },
        { label: "IdP", value: "Okta" },
        { label: "MFA", value: "Locked out" },
        { label: "Last login", value: relTime(Date.now() - 6 * 86400000) },
        { label: "Risk score", value: "0.12 · low" },
      ];
    case "technical":
      return [
        { label: "Service", value: "api-gateway" },
        { label: "Tenant", value: "acme" },
        { label: "Errors (1h)", value: "142" },
        { label: "Runbook", value: "sso_okta_clock_skew" },
        { label: "Incident", value: "inc_882" },
      ];
    default:
      return [{ label: "Ticket", value: ticketId }];
  }
}

function PipelineStrip({ steps, activeStatus }: { steps: typeof traces[string]["steps"]; activeStatus: string }) {
  const activeIdx = activeStatus === "in_progress" ? steps.length - 2 : steps.length - 1;
  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {steps.map((s, i) => {
        const isActive = activeStatus === "in_progress" && i === activeIdx;
        const isDone = activeStatus !== "in_progress" || i < activeIdx;
        const tone =
          s.status === "warn" ? "border-[oklch(0.78_0.15_75/0.5)] bg-[oklch(0.78_0.15_75/0.1)] text-[oklch(0.55_0.15_75)]"
          : s.status === "error" ? "border-[oklch(0.6_0.22_15/0.5)] bg-[oklch(0.6_0.22_15/0.1)] text-[oklch(0.55_0.22_15)]"
          : isDone ? "border-[oklch(0.6_0.16_155/0.4)] bg-[oklch(0.68_0.16_155/0.1)] text-[oklch(0.6_0.16_155)]"
          : "border-border bg-muted/40 text-muted-foreground";
        return (
          <div key={i} className="flex items-center gap-1">
            <div className={cn("flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium whitespace-nowrap", tone, isActive && "animate-pulse")}>
              <span className="font-mono text-[10px] opacity-60">{i + 1}</span>
              {s.agent.replace(" Agent", "")}
            </div>
            {i < steps.length - 1 && <span className="text-muted-foreground/40">→</span>}
          </div>
        );
      })}
    </div>
  );
}

