import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { policies } from "@/mocks/data";
import { relTime } from "@/lib/format";
import { Plus, Search, FileText, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/knowledge")({
  component: Knowledge,
  head: () => ({ meta: [{ title: "Knowledge — SupportOps AI" }] }),
});

const CATEGORIES = ["All", "Refunds", "Shipping", "Billing", "Account", "Technical"];

function Knowledge() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = policies.filter((p) => (cat === "All" || p.category === cat) && (!q || p.title.toLowerCase().includes(q.toLowerCase())));

  return (
    <div>
      <PageHeader
        title="Knowledge base"
        description="Policies and procedures used by agents to resolve tickets."
        actions={<Button size="sm" onClick={() => setAddOpen(true)}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add document</Button>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
        <Card className="p-3">
          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</div>
          <div className="space-y-0.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn("flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted", cat === c && "bg-muted font-medium")}
              >
                <Folder className="h-3.5 w-3.5 text-muted-foreground" />{c}
                <span className="ml-auto text-[10px] text-muted-foreground">
                  {c === "All" ? policies.length : policies.filter((p) => p.category === c).length}
                </span>
              </button>
            ))}
          </div>
        </Card>

        <div>
          <div className="relative mb-3 max-w-md">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search policies…" className="h-8 pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          <Card className="divide-y divide-border">
            {filtered.map((p) => (
              <div key={p.id} className="flex items-start gap-3 p-4 hover:bg-muted/30">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{p.title}</span>
                    <Badge variant={p.status === "active" ? "default" : "secondary"} className="h-4 text-[10px]">{p.status}</Badge>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{p.excerpt}</p>
                </div>
                <div className="shrink-0 text-right text-[11px] text-muted-foreground">
                  <div>Updated {relTime(p.updatedAt)}</div>
                  <div>{p.usedByAgents} agents</div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-16 text-center text-sm text-muted-foreground">No policies match.</div>
            )}
          </Card>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>New knowledge document</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Title</Label><Input placeholder="Refund extended-window exception" /></div>
            <div className="space-y-1.5"><Label>Category</Label><Input placeholder="Refunds" /></div>
            <div className="space-y-1.5"><Label>Content</Label><Textarea rows={10} placeholder="Write the policy in plain English…" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddOpen(false); toast.success("Document saved as draft"); }}>Save draft</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
