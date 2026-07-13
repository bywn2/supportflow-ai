import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { evalRuns } from "@/mocks/data";
import { relTime, money, ms } from "@/lib/format";
import { LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/evals")({
  component: Evals,
  head: () => ({ meta: [{ title: "Evals — SupportOps AI" }] }),
});

function Evals() {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : s.length < 2 ? [...s, id] : [s[1], id]);
  const runs = [...evalRuns].reverse();

  const compare = selected.map((id) => evalRuns.find((e) => e.id === id)!);

  return (
    <div>
      <PageHeader
        title="Evaluation runs"
        description="Benchmark prompt versions against a held-out set of 800 tickets."
        actions={<Button size="sm" onClick={() => toast.success("Eval run queued")}><Plus className="mr-1.5 h-3.5 w-3.5" /> New eval run</Button>}
      />

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>Run name</TableHead>
              <TableHead>Prompt</TableHead>
              <TableHead>Model</TableHead>
              <TableHead className="text-right">Accuracy</TableHead>
              <TableHead className="text-right">Latency p95</TableHead>
              <TableHead className="text-right">Cost / task</TableHead>
              <TableHead className="text-right">Esc. precision</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {evalRuns.map((r) => (
              <TableRow key={r.id} className={cn(selected.includes(r.id) && "bg-primary/5")}>
                <TableCell><Checkbox checked={selected.includes(r.id)} onCheckedChange={() => toggle(r.id)} /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 font-medium">{r.name} {r.current && <Badge className="h-4 text-[10px]">current</Badge>}</div>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{r.promptVersion}</TableCell>
                <TableCell className="text-xs">{r.model}</TableCell>
                <TableCell className="text-right font-mono">{(r.accuracy * 100).toFixed(0)}%</TableCell>
                <TableCell className="text-right font-mono">{r.latencyP95.toFixed(1)}s</TableCell>
                <TableCell className="text-right font-mono">{money(r.costPerTask)}</TableCell>
                <TableCell className="text-right font-mono">{r.escalationPrecision.toFixed(2)}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{relTime(r.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {compare.length === 2 && (
        <Card className="mt-4 p-4">
          <h3 className="mb-3 text-sm font-semibold">Comparing {compare[0].name} vs {compare[1].name}</h3>
          <div className="grid grid-cols-4 gap-4">
            {(["accuracy", "latencyP95", "costPerTask", "escalationPrecision"] as const).map((k) => {
              const a = compare[0][k] as number, b = compare[1][k] as number;
              const diff = ((b - a) / a) * 100;
              const better = (k === "accuracy" || k === "escalationPrecision") ? diff > 0 : diff < 0;
              return (
                <div key={k}>
                  <div className="text-xs text-muted-foreground capitalize">{k.replace(/([A-Z])/g, " $1")}</div>
                  <div className="mt-1 font-mono text-sm">{a.toFixed(3)} → {b.toFixed(3)}</div>
                  <div className={cn("mt-1 text-xs", better ? "text-[oklch(0.55_0.16_155)]" : "text-[oklch(0.55_0.22_15)]")}>{diff > 0 ? "+" : ""}{diff.toFixed(1)}%</div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full", better ? "bg-[oklch(0.68_0.16_155)]" : "bg-[oklch(0.6_0.22_15)]")} style={{ width: `${Math.min(100, Math.abs(diff) * 3)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold">Accuracy trend</h3>
          <div className="h-56">
            <ResponsiveContainer><LineChart data={runs.map((r, i) => ({ i, acc: r.accuracy * 100, name: r.name }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "var(--color-muted-foreground)" }} interval={0} angle={-30} textAnchor="end" height={60} />
              <YAxis domain={[55, 90]} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} width={30} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", fontSize: 11 }} />
              <Line type="monotone" dataKey="acc" stroke="var(--color-primary)" strokeWidth={2} />
            </LineChart></ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold">Cost vs accuracy</h3>
          <div className="h-56">
            <ResponsiveContainer><ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="cost" name="cost" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} tickFormatter={(v) => `$${v.toFixed(3)}`} />
              <YAxis dataKey="acc" name="accuracy" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} tickFormatter={(v) => `${v}%`} width={40} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", fontSize: 11 }} />
              <Scatter data={evalRuns.map((r) => ({ cost: r.costPerTask, acc: r.accuracy * 100 }))} fill="var(--color-primary)" />
            </ScatterChart></ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
