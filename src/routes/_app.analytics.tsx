import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/analytics")({
  component: Analytics,
  head: () => ({ meta: [{ title: "Analytics — SupportOps AI" }] }),
});

function Analytics() {
  const [range, setRange] = useState("week");
  const volumeData = Array.from({ length: 14 }).map((_, i) => ({
    day: `D${i + 1}`,
    resolved: 130 + Math.round(Math.random() * 100),
    escalated: 15 + Math.round(Math.random() * 30),
  }));
  const costData = [
    { name: "Planner", value: 1.84, fill: "var(--color-chart-1)" },
    { name: "Executor", value: 0.50, fill: "var(--color-chart-2)" },
    { name: "Retrieval", value: 0.46, fill: "var(--color-chart-3)" },
    { name: "Verifier", value: 0.34, fill: "var(--color-chart-4)" },
    { name: "Intake", value: 0.24, fill: "var(--color-chart-5)" },
  ];
  const csat = Array.from({ length: 12 }).map((_, i) => ({ m: i + 1, score: 4.1 + Math.random() * 0.7 }));
  const heatmap = ["Refunds", "Shipping", "Billing", "Account", "Technical"];

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Business metrics for autonomous support performance."
        actions={
          <>
            <Tabs value={range} onValueChange={setRange}><TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList></Tabs>
            <Button size="sm" variant="outline" onClick={() => toast.success("CSV exported")}><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="p-4 xl:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">Resolution volume</h3>
          <div className="h-64">
            <ResponsiveContainer><AreaChart data={volumeData}>
              <defs>
                <linearGradient id="a1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.4} /><stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} /></linearGradient>
                <linearGradient id="a2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-chart-4)" stopOpacity={0.4} /><stop offset="100%" stopColor="var(--color-chart-4)" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} width={30} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", fontSize: 11 }} />
              <Area type="monotone" dataKey="resolved" stackId="1" stroke="var(--color-chart-2)" fill="url(#a1)" />
              <Area type="monotone" dataKey="escalated" stackId="1" stroke="var(--color-chart-4)" fill="url(#a2)" />
            </AreaChart></ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold">Cost by agent type</h3>
          <div className="h-64">
            <ResponsiveContainer><PieChart>
              <Pie data={costData} dataKey="value" outerRadius={90} label={{ fontSize: 10 }}>
                {costData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", fontSize: 11 }} />
            </PieChart></ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold">Intent heatmap</h3>
          <div className="space-y-1.5">
            {heatmap.map((cat, i) => (
              <div key={cat}>
                <div className="mb-1 flex justify-between text-xs"><span>{cat}</span><span className="font-mono text-muted-foreground">{20 + i * 12}</span></div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 24 }).map((_, h) => {
                    const v = Math.random();
                    return <div key={h} className="h-4 flex-1 rounded-sm" style={{ background: `oklch(0.6 0.22 275 / ${0.1 + v * 0.8})` }} />;
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold">CSAT score</h3>
          <div className="h-48">
            <ResponsiveContainer><LineChart data={csat}>
              <XAxis dataKey="m" tick={{ fontSize: 10 }} />
              <YAxis domain={[3.5, 5]} tick={{ fontSize: 10 }} width={30} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", fontSize: 11 }} />
              <Line type="monotone" dataKey="score" stroke="var(--color-chart-2)" strokeWidth={2} />
            </LineChart></ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 flex flex-col items-center justify-center">
          <h3 className="mb-3 self-start text-sm font-semibold">SLA compliance</h3>
          <svg viewBox="0 0 120 70" className="w-48">
            <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="var(--color-muted)" strokeWidth="10" strokeLinecap="round" />
            <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="var(--color-chart-2)" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${Math.PI * 50}`} strokeDashoffset={`${Math.PI * 50 * 0.06}`} />
          </svg>
          <div className="text-3xl font-semibold">94%</div>
          <div className="text-xs text-muted-foreground">within SLA this week</div>
        </Card>
      </div>
    </div>
  );
}
