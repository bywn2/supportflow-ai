import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { KPICard } from "@/components/charts/KPICard";
import { Card } from "@/components/ui/card";
import { Ticket, TrendingUp, Timer, DollarSign } from "lucide-react";
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from "recharts";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { agents, tickets } from "@/mocks/data";
import { relTime } from "@/lib/format";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — SupportOps AI" }] }),
});

const sparkData = Array.from({ length: 12 }).map((_, i) => ({ x: i, y: 80 + Math.round(Math.sin(i / 2) * 30 + Math.random() * 20) }));
const areaData = Array.from({ length: 7 }).map((_, i) => ({
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
  resolved: 140 + Math.round(Math.random() * 90),
  escalated: 20 + Math.round(Math.random() * 30),
}));
const donutData = [
  { name: "Auto-resolved", value: 68, fill: "var(--color-chart-2)" },
  { name: "Escalated", value: 22, fill: "var(--color-chart-3)" },
  { name: "In progress", value: 10, fill: "var(--color-chart-5)" },
];
const failures = [
  { reason: "Low retrieval score", count: 34, pct: 100 },
  { reason: "Tool call timeout", count: 21, pct: 62 },
  { reason: "Guardrail blocked action", count: 15, pct: 44 },
  { reason: "Ambiguous intent", count: 12, pct: 35 },
  { reason: "Policy edge case", count: 9, pct: 26 },
];

const actionVerbs = ["classified", "retrieved policies for", "planned resolution for", "executed refund on", "verified outcome for", "escalated"];
function seedActivity() {
  return Array.from({ length: 12 }).map((_, i) => {
    const t = tickets[i % tickets.length];
    const a = agents[i % agents.length];
    return {
      id: `act_${Date.now()}_${i}`,
      agent: a.name,
      verb: actionVerbs[i % actionVerbs.length],
      ticket: t.id,
      ts: Date.now() - i * 30000,
    };
  });
}

function Dashboard() {
  const [activity, setActivity] = useState(seedActivity);
  useEffect(() => {
    const id = setInterval(() => {
      const t = tickets[Math.floor(Math.random() * tickets.length)];
      const a = agents[Math.floor(Math.random() * agents.length)];
      const v = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
      setActivity((prev) => [{ id: `act_${Date.now()}`, agent: a.name, verb: v, ticket: t.id, ts: Date.now() }, ...prev].slice(0, 20));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <PageHeader title="Dashboard" description="Live view of your autonomous support operations." />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Tickets today" value="247" delta="+12%" trend="up" intent="info" icon={Ticket}>
          <div className="h-8 -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Line type="monotone" dataKey="y" stroke="var(--color-primary)" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </KPICard>
        <KPICard label="Auto-resolved" value="68%" delta="+4.2%" trend="up" intent="success" icon={TrendingUp} />
        <KPICard label="Avg resolution" value="14s" delta="-36%" trend="down" intent="success" icon={Timer} />
        <KPICard label="Cost per ticket" value="$0.08" delta="-11%" trend="down" intent="info" icon={DollarSign} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Live agent activity</h3>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-[oklch(0.68_0.16_155)] opacity-60" />
                <span className="relative h-2 w-2 rounded-full bg-[oklch(0.68_0.16_155)]" />
              </span>
              Live
            </span>
          </div>
          <div className="max-h-[320px] space-y-0 overflow-hidden">
            <AnimatePresence initial={false}>
              {activity.slice(0, 10).map((a) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex items-center justify-between border-b border-border/60 py-2.5 text-sm last:border-0"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="font-medium">{a.agent}</span>
                    <span className="text-muted-foreground">{a.verb}</span>
                    <Link to="/tickets/$id" params={{ id: a.ticket }} className="font-mono text-xs text-primary hover:underline">{a.ticket}</Link>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{relTime(a.ts)}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold">Resolution mix</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={2}>
                  {donutData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-xs">
            {donutData.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-sm" style={{ background: d.fill }} />{d.name}</span>
                <span className="font-medium">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 p-4">
          <h3 className="mb-3 text-sm font-semibold">Resolution volume — last 7 days</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-4)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-chart-4)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 12 }} />
                <Area type="monotone" dataKey="resolved" stroke="var(--color-chart-2)" strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="escalated" stroke="var(--color-chart-4)" strokeWidth={2} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold">Top failure reasons</h3>
          <div className="space-y-3">
            {failures.map((f) => (
              <div key={f.reason}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span>{f.reason}</span>
                  <span className="font-mono text-muted-foreground">{f.count}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary/70" style={{ width: `${f.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
