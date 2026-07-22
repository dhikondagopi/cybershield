import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  kpis,
  threatTimeline,
  alertsBySeverity,
  assetsByCategory,
  liveEvents,
  recentAlerts,
  mitreTactics,
  anomalies,
  incidents,
  cves,
  iocs,
  actors,
  assets,
} from "@/lib/mock-data";

// Lightweight in-process REST mock. Intercepts axios requests when
// VITE_USE_MOCK_API !== "false" and answers with data derived from
// src/lib/mock-data.ts so every page stays interactive with no backend.

type Handler = (config: AxiosRequestConfig, params: Record<string, string>) => unknown;

interface Route {
  method: string;
  pattern: RegExp;
  keys: string[];
  handler: Handler;
}

const routes: Route[] = [];

function addRoute(method: string, path: string, handler: Handler) {
  const keys: string[] = [];
  const pattern = new RegExp(
    "^" +
      path.replace(/:[A-Za-z_]+/g, (m) => {
        keys.push(m.slice(1));
        return "([^/]+)";
      }) +
      "/?$",
  );
  routes.push({ method: method.toUpperCase(), pattern, keys, handler });
}

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function ok<T>(data: T, status = 200): Promise<AxiosResponse<T>> {
  return delay({
    data,
    status,
    statusText: "OK",
    headers: {},
    config: {} as never,
  } as AxiosResponse<T>);
}

function fail(status: number, message: string): Promise<never> {
  return delay(null).then(() => {
    const err = new Error(message) as Error & { response?: unknown; isAxiosError?: boolean };
    err.response = { status, data: { message } };
    err.isAxiosError = true;
    throw err;
  });
}

// ---- Auth --------------------------------------------------------------

const demoUsers = [
  { id: "u_1", email: "analyst@cybershield.ai", password: "demo1234", name: "Alex Rivera", role: "soc_analyst" as const },
  { id: "u_2", email: "manager@cybershield.ai", password: "demo1234", name: "Priya Shah", role: "soc_manager" as const },
  { id: "u_3", email: "admin@cybershield.ai",   password: "demo1234", name: "Jordan Blake", role: "administrator" as const },
];

function issueTokens(userId: string) {
  const rand = Math.random().toString(36).slice(2);
  return {
    accessToken: `mock.${userId}.${rand}`,
    refreshToken: `mockr.${userId}.${rand}`,
    expiresIn: 3600,
  };
}

addRoute("POST", "/auth/login", (config) => {
  const body = safeJson(config.data);
  const user = demoUsers.find((u) => u.email === body.email && u.password === body.password);
  if (!user) return fail(401, "Invalid email or password");
  const { password: _pw, ...safe } = user;
  return { user: { ...safe, createdAt: new Date().toISOString() }, tokens: issueTokens(user.id) };
});

addRoute("POST", "/auth/register", (config) => {
  const body = safeJson(config.data);
  const user = {
    id: `u_${Date.now()}`,
    email: body.email,
    name: body.name || body.email?.split("@")[0] || "User",
    role: (body.role as string) || "soc_analyst",
    createdAt: new Date().toISOString(),
  };
  return { user, tokens: issueTokens(user.id) };
});

addRoute("POST", "/auth/logout", () => ({ success: true }));

addRoute("POST", "/auth/refresh", (config) => {
  const body = safeJson(config.data);
  if (!body.refreshToken) return fail(401, "Missing refresh token");
  const userId = body.refreshToken.split(".")[1] || "u_1";
  return { tokens: issueTokens(userId) };
});

addRoute("GET", "/auth/profile", (config) => {
  const auth = (config.headers?.["Authorization"] as string | undefined) || "";
  const userId = auth.replace("Bearer mock.", "").split(".")[0] || "u_1";
  const user = demoUsers.find((u) => u.id === userId) || demoUsers[0];
  const { password: _pw, ...safe } = user;
  return { ...safe, createdAt: new Date().toISOString() };
});

// ---- Dashboard ---------------------------------------------------------

addRoute("GET", "/dashboard/summary", () => ({
  kpis,
  networkHealth: 98.6,
  activeThreats: 47,
  openIncidents: incidents.length,
  meanTimeToDetect: "3.4m",
  meanTimeToRespond: "27m",
}));

addRoute("GET", "/dashboard/charts", () => ({
  timeline: threatTimeline,
  alertsBySeverity,
  assetsByCategory,
}));

addRoute("GET", "/dashboard/alerts", () => recentAlerts);
addRoute("GET", "/dashboard/threats", () => liveEvents);

// ---- Incidents ---------------------------------------------------------

interface StoredIncident {
  id: string;
  title: string;
  sev: string;
  stage: string;
  status: string;
  assignee: string;
  opened: string;
  description: string;
  timeline: Array<{ id: string; at: string; actor: string; action: string; detail?: string }>;
  evidence: Array<{ id: string; name: string; type: string; size?: string; uploadedBy: string; uploadedAt: string; url?: string }>;
  comments: Array<{ id: string; author: string; role: string; body: string; at: string }>;
}

const incidentStore: StoredIncident[] = incidents.map((i) => ({
  ...i,
  status: "Open",
  description: `${i.title} — details captured from SIEM correlations.`,
  timeline: [
    { id: `${i.id}-t1`, at: new Date().toISOString(), actor: "system", action: "Incident opened" },
  ],
  evidence: [],
  comments: [],
}));

addRoute("GET", "/incidents", () => incidentStore);
addRoute("GET", "/incidents/:id", (_c, p) => {
  const i = incidentStore.find((x) => x.id === p.id);
  return i || fail(404, "Incident not found");
});
addRoute("POST", "/incidents", (config) => {
  const body = safeJson(config.data);
  const inc = {
    id: `INC-${2100 + incidentStore.length}`,
    title: body.title || "New Incident",
    sev: body.sev || "Medium",
    stage: "Triage",
    status: "Open" as const,
    assignee: body.assignee || "Unassigned",
    opened: "just now",
    description: body.description || "",
    timeline: [
      { id: `t${Date.now()}`, at: new Date().toISOString(), actor: "you", action: "Incident created" },
    ],
    evidence: [],
    comments: [],
  };
  incidentStore.unshift(inc);
  return inc;
});
addRoute("PATCH", "/incidents/:id", (config, p) => {
  const i = incidentStore.find((x) => x.id === p.id);
  if (!i) return fail(404, "Not found");
  Object.assign(i, safeJson(config.data));
  i.timeline.push({ id: `t${Date.now()}`, at: new Date().toISOString(), actor: "you", action: "Incident updated" });
  return i;
});
addRoute("POST", "/incidents/:id/close", (_c, p) => {
  const i = incidentStore.find((x) => x.id === p.id);
  if (!i) return fail(404, "Not found");
  i.status = "Closed";
  i.stage = "Closed";
  i.timeline.push({ id: `t${Date.now()}`, at: new Date().toISOString(), actor: "you", action: "Incident closed" });
  return i;
});
addRoute("POST", "/incidents/:id/assign", (config, p) => {
  const i = incidentStore.find((x) => x.id === p.id);
  if (!i) return fail(404, "Not found");
  i.assignee = safeJson(config.data).assignee || i.assignee;
  return i;
});
addRoute("POST", "/incidents/:id/comments", (config, p) => {
  const i = incidentStore.find((x) => x.id === p.id);
  if (!i) return fail(404, "Not found");
  const body = safeJson(config.data);
  const c = {
    id: `c${Date.now()}`,
    author: body.author || "You",
    role: body.role || "soc_analyst",
    body: body.body || "",
    at: new Date().toISOString(),
  };
  i.comments.push(c);
  return c;
});
addRoute("POST", "/incidents/:id/evidence", (config, p) => {
  const i = incidentStore.find((x) => x.id === p.id);
  if (!i) return fail(404, "Not found");
  const body = safeJson(config.data);
  const e = {
    id: `e${Date.now()}`,
    name: body.name || "evidence.bin",
    type: body.type || "file",
    size: body.size,
    uploadedBy: body.uploadedBy || "You",
    uploadedAt: new Date().toISOString(),
    url: body.url,
  };
  i.evidence.push(e);
  return e;
});

// ---- Threat Intel ------------------------------------------------------

addRoute("GET", "/threat-intel/feed", () => liveEvents);
addRoute("GET", "/threat-intel/cves", () => cves);
addRoute("GET", "/threat-intel/iocs", () => iocs);
addRoute("GET", "/threat-intel/actors", () => actors);
addRoute("GET", "/threat-intel/mitre", () =>
  mitreTactics.map((t, i) => ({
    id: `TA000${i + 1}`,
    tactic: t,
    name: t,
    description: `MITRE ATT&CK tactic: ${t}`,
  })),
);

// ---- AI Copilot --------------------------------------------------------

addRoute("POST", "/copilot/chat", (config) => {
  const body = safeJson(config.data);
  const last = body.messages?.[body.messages.length - 1]?.content || "";
  return {
    role: "assistant",
    content: `Based on current telemetry, ${last ? `regarding "${last.slice(0, 80)}"` : "your query"}: I recommend correlating recent alerts with MITRE T1071 (C2) activity, isolating affected hosts, and rotating credentials for exposed accounts.`,
    at: new Date().toISOString(),
  };
});

addRoute("POST", "/copilot/log-analysis", () => ({
  summary: "3 anomalies detected in the last 15 minutes",
  findings: [
    { severity: "High", detail: "PowerShell base64 execution on srv-app-04" },
    { severity: "Medium", detail: "Anomalous outbound to 45.61.187.9:443" },
    { severity: "Low", detail: "Login from unusual geolocation for user kchen" },
  ],
}));

addRoute("POST", "/copilot/report", (config) => {
  const body = safeJson(config.data);
  return { id: `rpt_${Date.now()}`, type: body.type || "executive", url: "#", generatedAt: new Date().toISOString() };
});

addRoute("POST", "/copilot/threat-analysis", () => ({
  actor: "APT-29",
  confidence: 0.82,
  techniques: ["T1566.001", "T1078", "T1071.004"],
  narrative: "Behavioral overlap with recent Cozy Bear campaigns targeting critical infrastructure.",
}));

// ---- Anomalies ---------------------------------------------------------

addRoute("GET", "/anomalies/network", () => anomalies.filter((a) => a.type === "Network"));
addRoute("GET", "/anomalies/user", () => anomalies.filter((a) => a.type === "User" || a.type === "Login"));
addRoute("GET", "/anomalies/device", () => anomalies.filter((a) => a.type === "Device" || a.type === "Process"));
addRoute("GET", "/anomalies/risk-score", () => ({
  overall: 74,
  breakdown: [
    { dimension: "Network", score: 68 },
    { dimension: "Identity", score: 82 },
    { dimension: "Endpoint", score: 71 },
    { dimension: "Cloud", score: 66 },
  ],
}));

// ---- Assets ------------------------------------------------------------

addRoute("GET", "/assets", () => assets);
addRoute("GET", "/assets/servers", () => assets.filter((a) => a.type === "Server"));
addRoute("GET", "/assets/endpoints", () => assets.filter((a) => a.type === "Endpoint"));
addRoute("GET", "/assets/cloud", () => assets.filter((a) => /cloud/i.test(a.type) || /eu-|us-/.test(a.loc)));
addRoute("GET", "/assets/iot", () => assets.filter((a) => a.type === "IoT/OT"));
addRoute("GET", "/assets/firewalls", () => assets.filter((a) => a.type === "Firewall"));

// ---- Network graph -----------------------------------------------------

addRoute("GET", "/network/graph", () => {
  const nodes = assets.map((a) => ({ id: a.name, label: a.name, type: a.type, risk: a.risk }));
  const edges = nodes.slice(0, -1).map((n, i) => ({
    source: n.id,
    target: nodes[i + 1].id,
    traffic: Math.round(50 + Math.random() * 400),
    risky: n.risk > 70,
  }));
  return {
    nodes,
    edges,
    riskPaths: [nodes.filter((n) => n.risk > 70).map((n) => n.id)],
  };
});

// ---- Reports -----------------------------------------------------------

addRoute("POST", "/reports/generate", (config) => {
  const body = safeJson(config.data);
  return {
    id: `rpt_${Date.now()}`,
    type: body.type || "executive",
    url: `data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCg==`,
    generatedAt: new Date().toISOString(),
  };
});
addRoute("GET", "/reports", () => [
  { id: "rpt_001", type: "executive", url: "#", generatedAt: new Date().toISOString() },
  { id: "rpt_002", type: "compliance", url: "#", generatedAt: new Date().toISOString() },
  { id: "rpt_003", type: "incident", url: "#", generatedAt: new Date().toISOString() },
]);

// ---- helpers -----------------------------------------------------------

function safeJson(input: unknown): Record<string, any> {
  if (!input) return {};
  if (typeof input === "string") {
    try { return JSON.parse(input); } catch { return {}; }
  }
  if (typeof input === "object") return input as Record<string, any>;
  return {};
}

function matchRoute(method: string, url: string) {
  const path = url.split("?")[0].replace(/^\/+/, "/");
  for (const r of routes) {
    if (r.method !== method.toUpperCase()) continue;
    const m = path.match(r.pattern);
    if (m) {
      const params: Record<string, string> = {};
      r.keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });
      return { route: r, params };
    }
  }
  return null;
}

export function installMockAdapter(client: AxiosInstance) {
  client.defaults.adapter = async (config) => {
    const method = (config.method || "get").toUpperCase();
    const url = (config.url || "").replace(/^https?:\/\/[^/]+/, "");
    const normalized = url.startsWith("/") ? url : `/${url}`;
    const match = matchRoute(method, normalized);
    if (!match) {
      return fail(404, `Mock: ${method} ${normalized} not implemented`);
    }
    try {
      const result = await match.route.handler(config, match.params);
      if (result && typeof (result as Promise<unknown>).then === "function") {
        return (await (result as Promise<AxiosResponse>)); // handlers that call fail() throw
      }
      return ok(result);
    } catch (err) {
      throw err;
    }
  };
}