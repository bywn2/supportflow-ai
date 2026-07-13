// Centralized mock data for SupportOps AI

export interface Customer {
  id: string;
  name: string;
  email: string;
  plan: "Free" | "Pro" | "Enterprise";
  ltv: number;
  ticketsCount: number;
  since: string;
}

export interface Ticket {
  id: string;
  customerId: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "escalated";
  priority: "low" | "medium" | "high" | "urgent";
  confidence: number;
  agentId: string;
  createdAt: string;
  channel: "email" | "chat" | "api";
  category: string;
}

export interface TraceStep {
  agent: string;
  agentId: string;
  status: "ok" | "warn" | "error";
  durationMs: number;
  costUsd: number;
  summary: string;
  details: string[];
  io: { input: unknown; output: unknown };
}

export interface Trace {
  ticketId: string;
  steps: TraceStep[];
  outcome: string;
}

export interface AgentConf {
  id: string;
  name: string;
  role: string;
  icon: string;
  status: "healthy" | "degraded" | "offline";
  model: string;
  version: string;
  callsToday: number;
  avgLatencyMs: number;
  successRate: number;
  costToday: number;
}

export interface Policy {
  id: string;
  title: string;
  category: string;
  status: "active" | "draft";
  updatedAt: string;
  usedByAgents: number;
  excerpt: string;
}

export interface EvalRun {
  id: string;
  name: string;
  promptVersion: string;
  model: string;
  accuracy: number;
  latencyP95: number;
  costPerTask: number;
  escalationPrecision: number;
  date: string;
  current?: boolean;
}

export interface AuditEvent {
  id: string;
  ts: string;
  actor: string;
  actorType: "agent" | "user";
  action: string;
  resource: string;
  ip: string;
  result: "success" | "denied" | "error";
  hash: string;
  payload: Record<string, unknown>;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  ts: string;
  kind: "info" | "success" | "warning" | "danger";
}

export const customers: Customer[] = [
  { id: "c_01", name: "Alex Chen", email: "alex.chen@northwind.io", plan: "Enterprise", ltv: 48200, ticketsCount: 14, since: "2022-04-11" },
  { id: "c_02", name: "Priya Ramaswamy", email: "priya@acmecorp.com", plan: "Pro", ltv: 3120, ticketsCount: 6, since: "2023-01-08" },
  { id: "c_03", name: "Diego Fernández", email: "diego.f@lumenlabs.co", plan: "Pro", ltv: 2840, ticketsCount: 3, since: "2023-06-22" },
  { id: "c_04", name: "Sofia Petrov", email: "sofia@brightship.com", plan: "Enterprise", ltv: 91300, ticketsCount: 27, since: "2021-11-02" },
  { id: "c_05", name: "Marcus Ojo", email: "marcus.ojo@fielded.app", plan: "Free", ltv: 0, ticketsCount: 1, since: "2024-08-15" },
  { id: "c_06", name: "Hana Watanabe", email: "hana.w@kinetiq.jp", plan: "Pro", ltv: 5400, ticketsCount: 9, since: "2023-03-19" },
  { id: "c_07", name: "Ethan O'Brien", email: "ethan@parallel.dev", plan: "Enterprise", ltv: 62100, ticketsCount: 18, since: "2022-08-30" },
  { id: "c_08", name: "Nadia Haddad", email: "nadia.h@orbitmail.com", plan: "Pro", ltv: 4210, ticketsCount: 4, since: "2024-01-14" },
  { id: "c_09", name: "Liam Ferguson", email: "liam@stackwerk.io", plan: "Pro", ltv: 2990, ticketsCount: 2, since: "2024-05-01" },
  { id: "c_10", name: "Yuki Tanaka", email: "yuki@meridian.co", plan: "Enterprise", ltv: 71800, ticketsCount: 21, since: "2021-06-12" },
];

const HOUR = 3600 * 1000;
const now = Date.now();

const subjects: Array<{ subject: string; category: string; msg: string }> = [
  { subject: "Refund for order #A-2847", category: "refunds", msg: "Hi — my order arrived damaged and I'd like a refund. Order #A-2847, $45." },
  { subject: "Change subscription plan", category: "billing", msg: "Please downgrade me from Enterprise to Pro effective next cycle." },
  { subject: "Package not delivered", category: "shipping", msg: "Tracking shows delivered but I never received the package. Order #B-1092." },
  { subject: "Update billing address", category: "billing", msg: "Need to update the billing address on file to 442 Market St, SF." },
  { subject: "Cancel account", category: "account", msg: "Please cancel my account and delete my data per GDPR." },
  { subject: "Duplicate charge on 11/03", category: "billing", msg: "I was charged twice for the same invoice. Please reverse one." },
  { subject: "Add user to workspace", category: "account", msg: "Please add teammate@acme.com as an admin on our workspace." },
  { subject: "Password reset not working", category: "technical", msg: "The reset link says expired even when I click immediately." },
  { subject: "Enterprise SSO setup", category: "technical", msg: "Need help configuring SAML SSO with Okta for our org." },
  { subject: "Invoice PDF missing line item", category: "billing", msg: "Last invoice is missing the SLA add-on we purchased." },
  { subject: "API rate limit increase", category: "technical", msg: "Requesting bump from 100 to 500 rpm on production key." },
  { subject: "Refund partial for late arrival", category: "refunds", msg: "Order arrived 6 days late — requesting 25% credit." },
  { subject: "Wrong item shipped", category: "shipping", msg: "Ordered blue medium, received red large. Order #C-4410." },
  { subject: "Two-factor lockout", category: "account", msg: "Lost my authenticator device, cannot sign in." },
  { subject: "Data export request", category: "account", msg: "Please export all workspace data as JSON." },
  { subject: "Integration webhook failing", category: "technical", msg: "Zendesk webhook returns 500 for our tenant." },
  { subject: "Upgrade to Enterprise", category: "billing", msg: "Interested in Enterprise pricing for 200 seats." },
  { subject: "Refund declined — appealing", category: "refunds", msg: "Automated refund denied but item is defective." },
  { subject: "Shipping to new country", category: "shipping", msg: "Do you ship to Portugal? Cart shows unavailable." },
  { subject: "GDPR data deletion", category: "account", msg: "Requesting full data deletion under GDPR Art. 17." },
  { subject: "Team seat count wrong", category: "billing", msg: "Billed for 12 seats but only 9 active users." },
  { subject: "Webhook signing key rotation", category: "technical", msg: "How do we rotate signing secrets without downtime?" },
  { subject: "Refund for canceled order", category: "refunds", msg: "Canceled within an hour but was still charged." },
  { subject: "Slack integration broken", category: "technical", msg: "Notifications stopped after we reinstalled the app." },
  { subject: "Duplicate account merge", category: "account", msg: "I have two accounts under different emails, please merge." },
  { subject: "Shipping address change post-order", category: "shipping", msg: "Order #D-9931 — need to redirect to a new address." },
  { subject: "Cancel and refund add-on", category: "billing", msg: "Please remove the analytics add-on and refund pro-rated amount." },
  { subject: "Feature request: SAML groups", category: "technical", msg: "Would love role mapping from SAML group claims." },
  { subject: "Broken checkout on Safari", category: "technical", msg: "Checkout fails on Safari 17.4 with a JS error." },
  { subject: "Refund high-value order", category: "refunds", msg: "Order #E-2200 for $2,400 — need to refund, quality issue." },
];

export const tickets: Ticket[] = subjects.map((s, i) => {
  const status: Ticket["status"] =
    i % 7 === 0 ? "escalated" : i % 5 === 0 ? "open" : i % 3 === 0 ? "in_progress" : "resolved";
  const priority: Ticket["priority"] =
    i % 9 === 0 ? "urgent" : i % 4 === 0 ? "high" : i % 2 === 0 ? "medium" : "low";
  return {
    id: `T-${(4200 + i).toString()}`,
    customerId: customers[i % customers.length].id,
    subject: s.subject,
    message: s.msg,
    status,
    priority,
    confidence: Math.round((0.55 + Math.random() * 0.42) * 100) / 100,
    agentId: ["intake", "planner", "executor", "verifier"][i % 4],
    createdAt: new Date(now - i * 1.3 * HOUR - Math.random() * HOUR).toISOString(),
    channel: (["email", "chat", "api"] as const)[i % 3],
    category: s.category,
  };
});

export const agents: AgentConf[] = [
  { id: "intake", name: "Intake Agent", role: "Classifies tickets, detects PII, routes to specialists", icon: "Inbox", status: "healthy", model: "Claude Sonnet 4.5", version: "v3.1.2", callsToday: 247, avgLatencyMs: 240, successRate: 0.994, costToday: 0.24 },
  { id: "retrieval", name: "Retrieval Agent", role: "Fetches relevant policies and prior context", icon: "Search", status: "healthy", model: "Claude Sonnet 4.5", version: "v2.4.0", callsToday: 231, avgLatencyMs: 380, successRate: 0.982, costToday: 0.46 },
  { id: "planner", name: "Planner Agent", role: "Reasons over context and drafts a resolution plan", icon: "Route", status: "healthy", model: "Claude Sonnet 4.5", version: "v4.0.1", callsToday: 231, avgLatencyMs: 620, successRate: 0.961, costToday: 1.84 },
  { id: "guardrail", name: "Guardrail Agent", role: "Enforces safety, allowlists, and policy limits", icon: "ShieldCheck", status: "healthy", model: "Claude Haiku 4", version: "v1.8.7", callsToday: 231, avgLatencyMs: 180, successRate: 0.999, costToday: 0.23 },
  { id: "executor", name: "Executor Agent", role: "Invokes MCP tools to perform real-world actions", icon: "Zap", status: "healthy", model: "Claude Sonnet 4.5", version: "v3.3.4", callsToday: 168, avgLatencyMs: 890, successRate: 0.973, costToday: 0.50 },
  { id: "verifier", name: "Verifier Agent", role: "LLM-judge scoring the resolution vs. intent", icon: "CheckCheck", status: "healthy", model: "Claude Sonnet 4.5", version: "v2.1.0", callsToday: 168, avgLatencyMs: 210, successRate: 0.988, costToday: 0.34 },
];

export const traces: Record<string, Trace> = Object.fromEntries(
  tickets.map((t) => [
    t.id,
    {
      ticketId: t.id,
      outcome: t.status === "resolved" ? "Refunded $45.00" : t.status === "escalated" ? "Escalated to human" : "In progress",
      steps: [
        {
          agent: "Intake Agent", agentId: "intake", status: "ok", durationMs: 240, costUsd: 0.001,
          summary: `Classification: ${t.category}_request  •  Confidence: ${Math.round(t.confidence * 100)}%`,
          details: ["PII detected: email (redacted)", "Language: en", `Priority estimate: ${t.priority}`],
          io: { input: { subject: t.subject, body: t.message }, output: { category: t.category, priority: t.priority, confidence: t.confidence } },
        },
        {
          agent: "Retrieval Agent", agentId: "retrieval", status: "ok", durationMs: 380, costUsd: 0.002,
          summary: "Retrieved 3 policies  •  Reranker score: 0.89",
          details: ["refund_policy_v2", "escalation_matrix", "order_lookup_result"],
          io: { input: { query: t.subject }, output: { docs: ["refund_policy_v2", "escalation_matrix", "order_lookup_result"], score: 0.89 } },
        },
        {
          agent: "Planner Agent", agentId: "planner", status: "ok", durationMs: 620, costUsd: 0.008,
          summary: "Plan drafted  •  Confidence: 92%",
          details: [
            "refund_order(order_id=A-2847, amount=45.00)",
            "Customer within 30-day window",
            "Order status: delivered, no previous refunds",
          ],
          io: { input: { context: "..." }, output: { plan: [{ tool: "stripe.create_refund", args: { order_id: "A-2847", amount: 45 } }] } },
        },
        {
          agent: "Guardrail Agent", agentId: "guardrail", status: "ok", durationMs: 180, costUsd: 0.001,
          summary: "All checks passed",
          details: ["Prompt injection: safe", "Action allowlist: ok", "Amount limit ($200): ok"],
          io: { input: { plan: "..." }, output: { allowed: true, checks: { pi: "safe", allowlist: "ok", amount: "ok" } } },
        },
        {
          agent: "Executor Agent", agentId: "executor", status: t.status === "escalated" ? "warn" : "ok", durationMs: 890, costUsd: 0.003,
          summary: t.status === "escalated" ? "Escalated: manual approval required" : "Refund created: re_1MnZ... ($45.00)",
          details: [
            "stripe_mcp.create_refund → succeeded",
            "zendesk_mcp.update_ticket → status: resolved",
          ],
          io: { input: { calls: 2 }, output: { refund_id: "re_1MnZaXQnR2", amount: 45, status: "succeeded" } },
        },
        {
          agent: "Verifier Agent", agentId: "verifier", status: "ok", durationMs: 210, costUsd: 0.002,
          summary: "LLM judge score: 9.2/10  •  Outcome matches intent",
          details: ["Refund amount correct", "Customer notified", "No policy violations"],
          io: { input: { outcome: "refunded" }, output: { score: 9.2, verdict: "pass" } },
        },
      ],
    },
  ]),
);

export const policies: Policy[] = [
  { id: "p_01", title: "Refund policy v2", category: "Refunds", status: "active", updatedAt: new Date(now - 3 * 86400000).toISOString(), usedByAgents: 4, excerpt: "Full refund within 30 days of delivery for undamaged items." },
  { id: "p_02", title: "High-value refund approval matrix", category: "Refunds", status: "active", updatedAt: new Date(now - 12 * 86400000).toISOString(), usedByAgents: 3, excerpt: "Refunds above $500 require human approval." },
  { id: "p_03", title: "Shipping SLA commitments", category: "Shipping", status: "active", updatedAt: new Date(now - 40 * 86400000).toISOString(), usedByAgents: 2, excerpt: "Standard: 5 business days. Express: 2 business days." },
  { id: "p_04", title: "Lost package remediation", category: "Shipping", status: "active", updatedAt: new Date(now - 8 * 86400000).toISOString(), usedByAgents: 2, excerpt: "Reship free if no delivery within SLA + 3 days." },
  { id: "p_05", title: "Duplicate charge reversal", category: "Billing", status: "active", updatedAt: new Date(now - 2 * 86400000).toISOString(), usedByAgents: 3, excerpt: "Detect within 24h and auto-reverse." },
  { id: "p_06", title: "Subscription downgrade rules", category: "Billing", status: "active", updatedAt: new Date(now - 15 * 86400000).toISOString(), usedByAgents: 2, excerpt: "Effective next billing cycle, pro-rate credits." },
  { id: "p_07", title: "Invoice correction workflow", category: "Billing", status: "draft", updatedAt: new Date(now - 1 * 86400000).toISOString(), usedByAgents: 0, excerpt: "New draft for missing line items." },
  { id: "p_08", title: "GDPR data deletion", category: "Account", status: "active", updatedAt: new Date(now - 60 * 86400000).toISOString(), usedByAgents: 2, excerpt: "Full deletion within 30 days of verified request." },
  { id: "p_09", title: "Account merge procedure", category: "Account", status: "active", updatedAt: new Date(now - 22 * 86400000).toISOString(), usedByAgents: 1, excerpt: "Verify both emails then merge audit trails." },
  { id: "p_10", title: "MFA recovery flow", category: "Account", status: "active", updatedAt: new Date(now - 6 * 86400000).toISOString(), usedByAgents: 2, excerpt: "ID verification + 24h cool-down before reset." },
  { id: "p_11", title: "SSO troubleshooting runbook", category: "Technical", status: "active", updatedAt: new Date(now - 4 * 86400000).toISOString(), usedByAgents: 2, excerpt: "Common Okta + Azure AD failure modes." },
  { id: "p_12", title: "API rate limit tiers", category: "Technical", status: "active", updatedAt: new Date(now - 33 * 86400000).toISOString(), usedByAgents: 3, excerpt: "Tier caps by plan; Enterprise custom." },
  { id: "p_13", title: "Webhook rotation guide", category: "Technical", status: "active", updatedAt: new Date(now - 18 * 86400000).toISOString(), usedByAgents: 1, excerpt: "Overlap window and graceful rollover." },
  { id: "p_14", title: "Escalation criteria", category: "Refunds", status: "active", updatedAt: new Date(now - 5 * 86400000).toISOString(), usedByAgents: 6, excerpt: "Low confidence, high value, PI detected, tool failure." },
  { id: "p_15", title: "PII redaction rules", category: "Account", status: "active", updatedAt: new Date(now - 90 * 86400000).toISOString(), usedByAgents: 6, excerpt: "Emails, phone numbers, addresses, card fragments." },
];

export const evalRuns: EvalRun[] = [
  { id: "e_10", name: "claude-sonnet-4.5", promptVersion: "v4.0.1", model: "Claude Sonnet 4.5", accuracy: 0.82, latencyP95: 2.5, costPerTask: 0.017, escalationPrecision: 0.89, date: new Date(now - 86400000).toISOString(), current: true },
  { id: "e_09", name: "with-reranker-v2", promptVersion: "v3.9.0", model: "Claude Sonnet 4", accuracy: 0.74, latencyP95: 3.4, costPerTask: 0.028, escalationPrecision: 0.81, date: new Date(now - 4 * 86400000).toISOString() },
  { id: "e_08", name: "guardrail-hardened", promptVersion: "v3.8.1", model: "Claude Sonnet 4", accuracy: 0.71, latencyP95: 3.6, costPerTask: 0.029, escalationPrecision: 0.83, date: new Date(now - 8 * 86400000).toISOString() },
  { id: "e_07", name: "planner-cot-v3", promptVersion: "v3.7.0", model: "Claude Sonnet 4", accuracy: 0.69, latencyP95: 3.8, costPerTask: 0.031, escalationPrecision: 0.78, date: new Date(now - 12 * 86400000).toISOString() },
  { id: "e_06", name: "haiku-guardrail", promptVersion: "v3.6.2", model: "Claude Haiku 4", accuracy: 0.65, latencyP95: 3.0, costPerTask: 0.020, escalationPrecision: 0.76, date: new Date(now - 15 * 86400000).toISOString() },
  { id: "e_05", name: "retriever-bm25+", promptVersion: "v3.5.0", model: "Claude Sonnet 4", accuracy: 0.67, latencyP95: 3.2, costPerTask: 0.025, escalationPrecision: 0.75, date: new Date(now - 20 * 86400000).toISOString() },
  { id: "e_04", name: "structured-outputs", promptVersion: "v3.4.0", model: "Claude Sonnet 4", accuracy: 0.66, latencyP95: 3.3, costPerTask: 0.026, escalationPrecision: 0.74, date: new Date(now - 25 * 86400000).toISOString() },
  { id: "e_03", name: "verifier-added", promptVersion: "v3.3.0", model: "Claude Sonnet 4", accuracy: 0.64, latencyP95: 3.5, costPerTask: 0.027, escalationPrecision: 0.73, date: new Date(now - 30 * 86400000).toISOString() },
  { id: "e_02", name: "baseline-v2", promptVersion: "v3.2.0", model: "Claude Sonnet 4", accuracy: 0.63, latencyP95: 3.0, costPerTask: 0.023, escalationPrecision: 0.71, date: new Date(now - 40 * 86400000).toISOString() },
  { id: "e_01", name: "baseline-v1", promptVersion: "v3.1.0", model: "Claude Sonnet 4", accuracy: 0.61, latencyP95: 3.1, costPerTask: 0.024, escalationPrecision: 0.72, date: new Date(now - 55 * 86400000).toISOString() },
];

export const auditEvents: AuditEvent[] = Array.from({ length: 50 }).map((_, i) => {
  const actions = ["ticket.resolve", "refund.create", "policy.update", "user.invite", "agent.deploy", "integration.configure", "ticket.escalate", "prompt.rollback"];
  const actors = ["intake", "executor", "planner", "verifier", "alex.chen@ops", "sofia.p@ops", "ops-admin"];
  const action = actions[i % actions.length];
  const actor = actors[i % actors.length];
  return {
    id: `a_${1000 + i}`,
    ts: new Date(now - i * 25 * 60000).toISOString(),
    actor,
    actorType: actor.includes("@") ? "user" : "agent",
    action,
    resource: `T-${4200 + (i % 30)}`,
    ip: `10.${i % 250}.${(i * 3) % 250}.${(i * 7) % 250}`,
    result: i % 11 === 0 ? "denied" : i % 17 === 0 ? "error" : "success",
    hash: `0x${(i * 2654435761 >>> 0).toString(16).padStart(8, "0")}c9a4f${(i * 13).toString(16)}`,
    payload: { action, resource: `T-${4200 + (i % 30)}`, actor },
  };
});

export const notifications: Notification[] = [
  { id: "n1", title: "Refund executed", body: "Executor completed $45 refund on T-4212", ts: new Date(now - 3 * 60000).toISOString(), kind: "success" },
  { id: "n2", title: "Escalation raised", body: "T-4200 escalated: low confidence (58%)", ts: new Date(now - 12 * 60000).toISOString(), kind: "warning" },
  { id: "n3", title: "New eval run complete", body: "claude-sonnet-4.5 reached 82% accuracy", ts: new Date(now - 40 * 60000).toISOString(), kind: "info" },
  { id: "n4", title: "Guardrail blocked action", body: "Amount limit exceeded on T-4207", ts: new Date(now - 68 * 60000).toISOString(), kind: "danger" },
  { id: "n5", title: "Policy updated", body: "Refund policy v2 published", ts: new Date(now - 3 * 3600000).toISOString(), kind: "info" },
];
