import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  open: "bg-[oklch(0.78_0.15_75/0.15)] text-[oklch(0.55_0.15_75)] border-[oklch(0.78_0.15_75/0.3)]",
  in_progress: "bg-[oklch(0.55_0.15_220/0.15)] text-[oklch(0.5_0.18_220)] border-[oklch(0.55_0.15_220/0.3)]",
  resolved: "bg-[oklch(0.68_0.16_155/0.15)] text-[oklch(0.5_0.16_155)] border-[oklch(0.68_0.16_155/0.3)]",
  escalated: "bg-[oklch(0.6_0.22_15/0.12)] text-[oklch(0.55_0.22_15)] border-[oklch(0.6_0.22_15/0.3)]",
};
const labels: Record<string, string> = {
  open: "Open", in_progress: "In progress", resolved: "Resolved", escalated: "Escalated",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium", styles[status] ?? "bg-muted text-muted-foreground border-border")}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {labels[status] ?? status}
    </span>
  );
}

const prioStyles: Record<string, string> = {
  low: "text-muted-foreground",
  medium: "text-[oklch(0.5_0.18_220)]",
  high: "text-[oklch(0.55_0.15_75)]",
  urgent: "text-[oklch(0.55_0.22_15)]",
};
export function PriorityBadge({ priority }: { priority: string }) {
  return <span className={cn("text-xs font-medium capitalize", prioStyles[priority])}>{priority}</span>;
}
