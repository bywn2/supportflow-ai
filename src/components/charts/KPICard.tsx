import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface KPICardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  intent?: "default" | "success" | "warning" | "info";
  icon?: LucideIcon;
  children?: ReactNode;
}

export function KPICard({ label, value, delta, trend, intent = "default", icon: Icon, children }: KPICardProps) {
  const trendGood = (trend === "up" && intent !== "warning") || (trend === "down" && intent === "success");
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        {Icon && <Icon className={cn("h-4 w-4",
          intent === "success" && "text-[oklch(0.68_0.16_155)]",
          intent === "info" && "text-primary",
          intent === "warning" && "text-[oklch(0.78_0.15_75)]",
          intent === "default" && "text-muted-foreground",
        )} />}
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        {delta && (
          <div className={cn(
            "flex items-center gap-0.5 text-xs font-medium",
            trendGood ? "text-[oklch(0.6_0.16_155)]" : trend ? "text-[oklch(0.6_0.22_15)]" : "text-muted-foreground",
          )}>
            {trend === "up" && <ArrowUp className="h-3 w-3" />}
            {trend === "down" && <ArrowDown className="h-3 w-3" />}
            {delta}
          </div>
        )}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </Card>
  );
}
