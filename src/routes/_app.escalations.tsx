import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tickets, customers } from "@/mocks/data";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { CopyId } from "@/components/CopyId";
import { relTime } from "@/lib/format";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/_app/escalations")({
  component: Escalations,
  head: () => ({ meta: [{ title: "Escalations — SupportOps AI" }] }),
});

const REASONS = ["Low confidence", "High value", "Prompt injection", "Tool failure", "Policy edge case"];

type Col = "review" | "in_review" | "resolved";
interface EscItem { id: string; customer: string; reason: string; waitedMin: number; assignee: string; col: Col; }

function seed(): EscItem[] {
  const escalated = tickets.filter((t) => t.status === "escalated");
  return escalated.map((t, i) => ({
    id: t.id,
    customer: customers.find((c) => c.id === t.customerId)!.name,
    reason: REASONS[i % REASONS.length],
    waitedMin: 5 + i * 7,
    assignee: ["AC", "SP", "MO", "YT"][i % 4],
    col: i % 3 === 0 ? "in_review" : i % 5 === 0 ? "resolved" : "review",
  }));
}

function Escalations() {
  const [items, setItems] = useState(seed);
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = useMemo(() => items.filter((i) => !filter || i.reason === filter), [items, filter]);

  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over) return;
    const target = e.over.id as Col;
    setItems((prev) => prev.map((it) => (it.id === e.active.id ? { ...it, col: target } : it)));
    toast.success(`Moved ${e.active.id} → ${target.replace("_", " ")}`);
  };

  const cols: Array<{ id: Col; label: string }> = [
    { id: "review", label: "Needs review" },
    { id: "in_review", label: "In review" },
    { id: "resolved", label: "Resolved by human" },
  ];

  return (
    <div>
      <PageHeader title="Escalations" description="Human review queue — drag between columns to update status." />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Reason:</span>
        <button onClick={() => setFilter(null)} className={cn("rounded-md border border-border px-2 py-1 text-xs", !filter && "bg-primary text-primary-foreground border-primary")}>All</button>
        {REASONS.map((r) => (
          <button key={r} onClick={() => setFilter(r)} className={cn("rounded-md border border-border px-2 py-1 text-xs", filter === r && "bg-primary text-primary-foreground border-primary")}>{r}</button>
        ))}
      </div>

      <DndContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {cols.map((c) => (
            <Column key={c.id} id={c.id} label={c.label} items={filtered.filter((i) => i.col === c.id)} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

function Column({ id, label, items }: { id: Col; label: string; items: EscItem[] }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={cn("rounded-lg border border-dashed border-border bg-muted/20 p-3 transition-colors", isOver && "bg-primary/5 border-primary/50")}>
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold">{label}</h3>
        <Badge variant="secondary" className="font-mono">{items.length}</Badge>
      </div>
      <div className="space-y-2 min-h-[200px]">
        {items.map((it) => <EscCard key={it.id} item={it} />)}
      </div>
    </div>
  );
}

function EscCard({ item }: { item: EscItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn("cursor-grab p-3 active:cursor-grabbing", isDragging && "opacity-50")}
    >
      <div className="flex items-start justify-between gap-2">
        <CopyId id={item.id} />
        <Badge variant="outline" className="text-[10px]">{item.reason}</Badge>
      </div>
      <div className="mt-2 text-sm font-medium">{item.customer}</div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Waiting {item.waitedMin}m</span>
        <Avatar className="h-5 w-5"><AvatarFallback className="text-[9px]">{item.assignee}</AvatarFallback></Avatar>
      </div>
    </Card>
  );
}
