import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SevBadge } from "@/components/ui/panel";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Cpu, ShieldCheck,
  Timer, Wifi, Zap, Server,
} from "lucide-react";
import { alertsBySeverity, assetsByCategory, kpis, liveEvents, mitreTactics, recentAlerts, threatTimeline } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SOC Command Center — CyberShield AI" },
      { name: "description", content: "Real-time cyber resilience command center for critical infrastructure." },
      { property: "og:title", content: "SOC Command Center — CyberShield AI" },
      { property: "og:description", content: "Live threat detection, MITRE ATT&CK coverage, and AI-driven response." },
    ],
  }),
  component: Dashboard,
});

const iconMap = { "Total Assets": Server, "Active Threats": AlertTriangle, "Critical Alerts": Zap, MTTD: Timer, MTTR: Timer, "Blocked Attacks": ShieldCheck, "High Risk Devices": Cpu, "Network Health": Wifi } as const;
const toneMap: Record<string, string> = {
  cyan: "from-cyan/20 to-cyan/5 text-cyan",
  critical: "from-critical/25 to-critical/5 text-critical",
  warn: "from-warn/20 to-warn/5 text-warn",
  success: "from-success/20 to-success/5 text-success",
  primary: "from-primary/25 to-primary/5 text-primary",
};

function Dashboard() {
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl glass-strong p-6 mb-6 animate-scan">
        <div className="absolute inset-0 opacity-40 bg-[var(--gradient-hero)] animate-gradient" style={{ backgroundSize: "300% 300%" }} />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-cyan mb-2">Operational Cyber Resilience · CNI</div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Welcome back, <span className="text-gradient">Sarah</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              AI Copilot analyzed 4.2M events in the last 24h. 3 critical incidents require attention.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="h-10 px-4 rounded-lg glass hover:bg-white/10 text-sm font-medium transition">Run Threat Hunt</button>
            <button className="h-10 px-4 rounded-lg bg-gradient-to-r from-primary to-neon text-primary-foreground text-sm font-semibold hover:opacity-90 transition shadow-[0_0_20px_oklch(0.72_0.19_275/0.4)]">
              Generate Executive Report
            </button>
          </div>
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {kpis.map((k) => {
          const Icon = iconMap[k.label as keyof typeof iconMap] ?? Activity;
          const up = k.delta.startsWith("+");
          return (
            <Panel key={k.label} className="p-4">
              <div className={`absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${toneMap[k.tone]} blur-2xl opacity-70`} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className={`h-9 w-9 rounded-lg grid place-items-center bg-gradient-to-br ${toneMap[k.tone]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${up ? "text-critical" : "text-success"}`}>
                    {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {k.delta}
                  </span>
                </div>
                <div className="mt-3 text-2xl font-bold tracking-tight font-mono">{k.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{k.label}</div>
              </div>
            </Panel>
          );
        })}
      </section>

      {/* Charts row */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <Panel className="xl:col-span-2">
          <PanelHeader
            title="Threat Timeline (24h)"
            subtitle="Detected vs blocked events per hour"
            right={<div className="flex gap-3 text-xs text-muted-foreground"><Legend2 c="oklch(0.65 0.26 20)" l="Threats" /><Legend2 c="oklch(0.82 0.16 210)" l="Blocked" /></div>}
          />
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={threatTimeline}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.26 20)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.65 0.26 20)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.82 0.16 210)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.82 0.16 210)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="time" stroke="oklch(0.7 0.03 250)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.03 250)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.2 0.03 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="blocked" stroke="oklch(0.82 0.16 210)" fill="url(#g2)" strokeWidth={2} />
                <Area type="monotone" dataKey="threats" stroke="oklch(0.65 0.26 20)" fill="url(#g1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Risk Score" subtitle="Aggregate cyber risk index" />
          <RiskGauge value={72} />
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="glass rounded-lg py-2">
              <div className="text-success font-bold">Low</div>
              <div className="text-muted-foreground">0–39</div>
            </div>
            <div className="glass rounded-lg py-2 neon-border">
              <div className="text-warn font-bold">Elevated</div>
              <div className="text-muted-foreground">40–74</div>
            </div>
            <div className="glass rounded-lg py-2">
              <div className="text-critical font-bold">Critical</div>
              <div className="text-muted-foreground">75–100</div>
            </div>
          </div>
        </Panel>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <Panel>
          <PanelHeader title="Alerts by Severity" subtitle="Last 7 days" />
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={alertsBySeverity} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {alertsBySeverity.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.2 0.03 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
            {alertsBySeverity.map((a) => (
              <div key={a.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: a.color }} />
                <span className="text-muted-foreground">{a.name}</span>
                <span className="ml-auto font-mono font-semibold">{a.value}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Assets by Category" subtitle="Managed inventory" />
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={assetsByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="name" stroke="oklch(0.7 0.03 250)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.03 250)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.2 0.03 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
                <Bar dataKey="value" fill="oklch(0.72 0.19 275)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Attack Trend" subtitle="30-day rolling" />
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={Array.from({ length: 30 }).map((_, i) => ({ d: i + 1, v: 40 + Math.round(Math.sin(i / 3) * 20 + Math.random() * 15) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="d" stroke="oklch(0.7 0.03 250)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.03 250)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.2 0.03 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="v" stroke="oklch(0.72 0.22 300)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </section>

      {/* MITRE heatmap */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <Panel className="xl:col-span-2">
          <PanelHeader title="MITRE ATT&CK Coverage" subtitle="Detection heatmap · last 24h" />
          <div className="grid grid-cols-9 gap-1">
            {mitreTactics.map((t) => (
              <div key={t} className="text-[10px] text-muted-foreground text-center pb-1 truncate">{t}</div>
            ))}
            {Array.from({ length: 9 * 6 }).map((_, i) => {
              const intensity = Math.random();
              const bg = intensity > 0.85 ? "bg-critical/70"
                : intensity > 0.65 ? "bg-orange-500/60"
                : intensity > 0.4 ? "bg-warn/50"
                : intensity > 0.2 ? "bg-primary/40"
                : "bg-white/5";
              return <div key={i} className={`aspect-square rounded ${bg} border border-white/5 hover:scale-110 transition-transform cursor-pointer`} title={`Technique T${1000 + i}`} />;
            })}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Live Event Stream" subtitle="Real-time telemetry" right={<span className="h-2 w-2 rounded-full bg-critical animate-pulse-ring" />} />
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {liveEvents.map((e, i) => (
              <div key={i} className="flex items-start gap-2 text-xs glass rounded-lg p-2">
                <span className="font-mono text-muted-foreground shrink-0">{e.t}</span>
                <SevBadge sev={e.sev.charAt(0).toUpperCase() + e.sev.slice(1)} />
                <div className="min-w-0">
                  <div className="truncate">{e.msg}</div>
                  <div className="text-muted-foreground text-[10px] font-mono">{e.src}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      {/* Recent alerts */}
      <Panel>
        <PanelHeader title="Recent Alerts" subtitle="Prioritized by AI risk model"
          right={<button className="text-xs text-cyan hover:underline">View all →</button>} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="pb-2 font-medium">Alert ID</th>
                <th className="pb-2 font-medium">Title</th>
                <th className="pb-2 font-medium">Severity</th>
                <th className="pb-2 font-medium">Asset</th>
                <th className="pb-2 font-medium">Technique</th>
                <th className="pb-2 font-medium">Time</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAlerts.map((a) => (
                <tr key={a.id} className="border-b border-border/50 hover:bg-white/5 transition">
                  <td className="py-3 font-mono text-xs text-cyan">{a.id}</td>
                  <td className="py-3">{a.title}</td>
                  <td className="py-3"><SevBadge sev={a.sev} /></td>
                  <td className="py-3 font-mono text-xs">{a.asset}</td>
                  <td className="py-3 font-mono text-xs text-neon">{a.tech}</td>
                  <td className="py-3 text-muted-foreground text-xs">{a.time}</td>
                  <td className="py-3"><SevBadge sev={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </AppShell>
  );
}

function Legend2({ c, l }: { c: string; l: string }) {
  return <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: c }} />{l}</span>;
}

function RiskGauge({ value }: { value: number }) {
  const angle = (value / 100) * 180;
  return (
    <div className="relative h-40 flex items-center justify-center">
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <defs>
          <linearGradient id="gauge" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.75 0.18 155)" />
            <stop offset="50%" stopColor="oklch(0.80 0.17 75)" />
            <stop offset="100%" stopColor="oklch(0.65 0.26 20)" />
          </linearGradient>
        </defs>
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="oklch(1 0 0 / 0.08)" strokeWidth="14" strokeLinecap="round" />
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gauge)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${(value / 100) * 251} 251`} />
        <g transform={`rotate(${angle - 90} 100 100)`}>
          <line x1="100" y1="100" x2="100" y2="30" stroke="oklch(0.96 0.01 240)" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="100" cy="100" r="6" fill="oklch(0.72 0.19 275)" />
        </g>
      </svg>
      <div className="absolute bottom-2 text-center">
        <div className="text-3xl font-bold font-mono text-gradient">{value}</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Elevated Risk</div>
      </div>
    </div>
  );
}
