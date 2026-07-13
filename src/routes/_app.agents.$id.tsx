import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { agents } from "@/mocks/data";
import { ms, money, relTime } from "@/lib/format";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { PlayCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/agents/$id")({
  loader: ({ params }) => {
    const a = agents.find((x) => x.id === params.id);
    if (!a) throw notFound();
    return a;
  },
  component: AgentDetail,
  notFoundComponent: () => <div className="py-24 text-center text-sm text-muted-foreground">Agent not found</div>,
  head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `${loaderData.name} — SupportOps AI` : "Agent" }] }),
});

const latencyData = Array.from({ length: 12 }).map((_, i) => ({ bucket: `${100 + i * 100}ms`, count: Math.round(20 + Math.random() * 80) }));
const successData = Array.from({ length: 14 }).map((_, i) => ({ day: i + 1, rate: 92 + Math.round(Math.random() * 7) }));
const costData = Array.from({ length: 14 }).map((_, i) => ({ day: i + 1, cost: 0.001 + Math.random() * 0.008 }));

function AgentDetail() {
  const a = Route.useLoaderData();
  const [playOpen, setPlayOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title={a.name}
        description={`${a.model} · ${a.version}`}
        actions={<Button size="sm" onClick={() => setPlayOpen(true)}><PlayCircle className="mr-1.5 h-3.5 w-3.5" /> Test in playground</Button>}
      />

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Calls today</div><div className="mt-1 text-xl font-semibold">{a.callsToday}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Avg latency</div><div className="mt-1 text-xl font-semibold">{ms(a.avgLatencyMs)}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Success rate</div><div className="mt-1 text-xl font-semibold">{Math.round(a.successRate * 1000) / 10}%</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Cost today</div><div className="mt-1 text-xl font-semibold">{money(a.costToday)}</div></Card>
      </div>

      <Tabs defaultValue="perf">
        <TabsList>
          <TabsTrigger value="perf">Performance</TabsTrigger>
          <TabsTrigger value="cost">Cost</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
        </TabsList>

        <TabsContent value="perf" className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="p-4">
            <h3 className="mb-3 text-sm font-semibold">Latency distribution</h3>
            <div className="h-56">
              <ResponsiveContainer><BarChart data={latencyData}>
                <XAxis dataKey="bucket" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} width={24} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", fontSize: 11 }} />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart></ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="mb-3 text-sm font-semibold">Success rate</h3>
            <div className="h-56">
              <ResponsiveContainer><LineChart data={successData}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis domain={[85, 100]} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", fontSize: 11 }} />
                <Line type="monotone" dataKey="rate" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
              </LineChart></ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="cost" className="mt-4">
          <Card className="p-4">
            <h3 className="mb-3 text-sm font-semibold">Cost per call trend</h3>
            <div className="h-64">
              <ResponsiveContainer><LineChart data={costData}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} width={44} tickFormatter={(v) => `$${v.toFixed(3)}`} />
                <Tooltip formatter={(v: number) => money(v)} contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", fontSize: 11 }} />
                <Line type="monotone" dataKey="cost" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
              </LineChart></ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <div><div className="text-muted-foreground">Avg tokens in</div><div className="font-mono font-medium">1,240</div></div>
              <div><div className="text-muted-foreground">Avg tokens out</div><div className="font-mono font-medium">340</div></div>
              <div><div className="text-muted-foreground">Cost / 1K calls</div><div className="font-mono font-medium">$4.20</div></div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="mt-4">
          <Card className="p-0 overflow-hidden">
            <Table>
              <TableHeader><TableRow><TableHead>When</TableHead><TableHead>Ticket</TableHead><TableHead>Error</TableHead><TableHead>Trace</TableHead></TableRow></TableHeader>
              <TableBody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs text-muted-foreground">{relTime(Date.now() - i * 3600000)}</TableCell>
                    <TableCell className="font-mono text-xs">T-{4210 + i}</TableCell>
                    <TableCell className="text-sm">{["Timeout calling stripe.create_refund", "Retrieval score below threshold", "Guardrail: amount over limit", "Malformed JSON in plan", "Rate limited by model provider", "Verifier score too low"][i]}</TableCell>
                    <TableCell><Button variant="link" size="sm" className="h-auto p-0">view</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="prompts" className="mt-4">
          <Card className="p-0 overflow-hidden">
            <Table>
              <TableHeader><TableRow><TableHead>Version</TableHead><TableHead>Deployed</TableHead><TableHead>Author</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {[[a.version, "3d ago", "alex@ops", "active"], ["v3.1.1", "12d ago", "sofia@ops", "archived"], ["v3.1.0", "1mo ago", "alex@ops", "archived"], ["v3.0.4", "2mo ago", "priya@ops", "archived"]].map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-xs">{r[0]}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r[1]}</TableCell>
                    <TableCell className="text-xs">{r[2]}</TableCell>
                    <TableCell><Badge variant={r[3] === "active" ? "default" : "secondary"}>{r[3]}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Diff</Button>
                      {r[3] !== "active" && <Button variant="outline" size="sm" onClick={() => toast.success(`Deployed ${r[0]}`)}>Deploy</Button>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={playOpen} onOpenChange={setPlayOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{a.name} — Playground</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="mb-1.5 text-xs font-medium">Input</div>
              <Textarea rows={10} defaultValue='{"subject":"Refund order #A-2847","body":"Item arrived broken."}' className="font-mono text-xs" />
            </div>
            <div>
              <div className="mb-1.5 text-xs font-medium">Output 🎯</div>
              <pre className="h-[220px] overflow-auto rounded-md border border-border bg-muted/40 p-3 font-mono text-xs">{JSON.stringify({ category: "refund_request", confidence: 0.94, entities: { order_id: "A-2847" } }, null, 2)}</pre>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlayOpen(false)}>Close</Button>
            <Button onClick={() => toast.success("Playground run complete")}>Run</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
