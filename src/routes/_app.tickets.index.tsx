import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge, PriorityBadge } from "@/components/tickets/StatusBadge";
import { CopyId } from "@/components/CopyId";
import { tickets as allTickets, customers, agents } from "@/mocks/data";
import { relTime, absTime } from "@/lib/format";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Route = createFileRoute("/_app/tickets/")({
  component: TicketsList,
  head: () => ({ meta: [{ title: "Tickets — SupportOps AI" }] }),
});

function TicketsList() {
  const nav = useNavigate();
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [newOpen, setNewOpen] = useState(false);

  const filtered = allTickets.filter((t) => {
    if (tab !== "all" && t.status !== tab) return false;
    if (q && !t.subject.toLowerCase().includes(q.toLowerCase()) && !t.id.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Tickets"
        description={`${allTickets.length} tickets across all queues`}
        actions={
          <Button size="sm" onClick={() => setNewOpen(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> New ticket
          </Button>
        }
      />

      <Card className="p-0 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-3 md:flex-row md:items-center md:justify-between">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="in_progress">In progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="escalated">Escalated</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search tickets…" value={q} onChange={(e) => setQ(e.target.value)} className="h-8 pl-8" />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="w-24">ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="w-32">Confidence</TableHead>
              <TableHead className="w-20">Priority</TableHead>
              <TableHead className="w-32">Agent</TableHead>
              <TableHead className="w-28">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((t) => {
              const cust = customers.find((c) => c.id === t.customerId)!;
              const agent = agents.find((a) => a.id === t.agentId)!;
              return (
                <TableRow key={t.id} className="cursor-pointer" onClick={() => nav({ to: "/tickets/$id", params: { id: t.id } })}>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell><CopyId id={t.id} /></TableCell>
                  <TableCell className="text-sm">{cust.name}</TableCell>
                  <TableCell className="text-sm">{t.subject}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary" style={{ width: `${t.confidence * 100}%` }} />
                      </div>
                      <span className="w-8 text-right font-mono text-[11px] text-muted-foreground">{Math.round(t.confidence * 100)}%</span>
                    </div>
                  </TableCell>
                  <TableCell><PriorityBadge priority={t.priority} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{agent.name.replace(" Agent", "")}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild><span className="text-xs text-muted-foreground">{relTime(t.createdAt)}</span></TooltipTrigger>
                        <TooltipContent>{absTime(t.createdAt)}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="py-16 text-center text-sm text-muted-foreground">No tickets match your filters.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create ticket</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Customer email</Label><Input placeholder="customer@example.com" /></div>
            <div className="space-y-1.5"><Label>Subject</Label><Input placeholder="Brief summary" /></div>
            <div className="space-y-1.5"><Label>Message</Label><Textarea rows={4} placeholder="Describe the issue…" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button onClick={() => { setNewOpen(false); toast.success("Ticket created and routed to Intake Agent"); }}>Create ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
