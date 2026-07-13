import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { auditEvents } from "@/mocks/data";
import { absTime, relTime } from "@/lib/format";
import { ChevronDown, Shield, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/audit")({
  component: Audit,
  head: () => ({ meta: [{ title: "Audit log — SupportOps AI" }] }),
});

function Audit() {
  const [q, setQ] = useState("");
  const filtered = auditEvents.filter((e) => !q || e.action.includes(q.toLowerCase()) || e.actor.includes(q.toLowerCase()) || e.resource.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader title="Audit log" description="Every action across your workspace." />

      <Card className="mb-4 flex items-start gap-3 border-primary/30 bg-primary/5 p-3">
        <Shield className="mt-0.5 h-4 w-4 text-primary" />
        <div className="text-xs">
          <div className="font-medium">Immutable, cryptographically chained</div>
          <div className="text-muted-foreground">Each entry hashes the previous one — tampering breaks the chain.</div>
        </div>
      </Card>

      <div className="relative mb-3 max-w-md">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Filter by actor, action or resource…" className="h-8 pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>Timestamp</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((e) => <AuditRow key={e.id} e={e} />)}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function AuditRow({ e }: { e: typeof auditEvents[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow className="cursor-pointer" onClick={() => setOpen(!open)}>
        <TableCell><ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} /></TableCell>
        <TableCell className="text-xs" title={absTime(e.ts)}>{relTime(e.ts)}</TableCell>
        <TableCell className="text-xs">
          <Badge variant={e.actorType === "agent" ? "secondary" : "outline"} className="mr-1.5 h-4 text-[10px]">{e.actorType}</Badge>
          {e.actor}
        </TableCell>
        <TableCell className="font-mono text-xs">{e.action}</TableCell>
        <TableCell className="font-mono text-xs text-muted-foreground">{e.resource}</TableCell>
        <TableCell className="font-mono text-[11px] text-muted-foreground">{e.ip}</TableCell>
        <TableCell><Badge variant={e.result === "success" ? "default" : e.result === "denied" ? "outline" : "destructive"} className="h-4 text-[10px]">{e.result}</Badge></TableCell>
        <TableCell className="font-mono text-[10px] text-muted-foreground">{e.hash.slice(0, 12)}…</TableCell>
      </TableRow>
      {open && (
        <TableRow>
          <TableCell colSpan={8} className="bg-muted/30 p-0">
            <pre className="overflow-x-auto p-4 text-[11px]">{JSON.stringify(e.payload, null, 2)}</pre>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
