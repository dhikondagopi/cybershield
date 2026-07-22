import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SevBadge } from "@/components/ui/panel";
import { liveEvents, alertsBySeverity, incidents } from "@/lib/mock-data";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Globe, Server, Siren } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/soc")({
  component: SocCommandCenter,
});

function SocCommandCenter() {
  const [globalCounter, setGlobalCounter] = useState(14589324);
  const [activeAlerts] = useState(liveEvents);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalCounter((prev) => prev + Math.floor(Math.random() * 5));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">Real-Time SOC Command Center</h1>
          <p className="text-muted-foreground mt-1 text-sm max-w-2xl">Live monitoring, streaming alerts, and active queues.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Panel className="p-5 flex flex-col justify-center text-center overflow-hidden relative group">
             <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-3 flex items-center justify-center gap-2 relative z-10">
              <Globe className="h-4 w-4 text-primary" /> Global Attacks Detected
            </div>
            <div className="text-4xl font-mono font-bold text-gradient relative z-10">{globalCounter.toLocaleString()}</div>
          </Panel>
          <Panel className="p-5 flex flex-col justify-center text-center overflow-hidden relative group">
            <div className="absolute inset-0 bg-success/5 group-hover:bg-success/10 transition-colors" />
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-3 flex items-center justify-center gap-2 relative z-10">
              <Server className="h-4 w-4 text-success" /> System Health
            </div>
            <div className="text-3xl font-bold text-success flex items-center justify-center gap-2 relative z-10">
              99.98% <span className="h-3 w-3 rounded-full bg-success animate-pulse shadow-[0_0_10px_oklch(var(--success))]" />
            </div>
          </Panel>
          <Panel className="p-5 flex flex-col justify-center text-center overflow-hidden relative group">
            <div className="absolute inset-0 bg-cyan/5 group-hover:bg-cyan/10 transition-colors" />
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-3 flex items-center justify-center gap-2 relative z-10">
              <Users className="h-4 w-4 text-cyan" /> Active Analysts
            </div>
            <div className="text-3xl font-bold text-cyan relative z-10">14 On Duty</div>
          </Panel>
          <Panel className="p-5 flex flex-col justify-center text-center overflow-hidden relative group">
             <div className="absolute inset-0 bg-critical/5 group-hover:bg-critical/10 transition-colors" />
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-3 flex items-center justify-center gap-2 relative z-10">
              <Siren className="h-4 w-4 text-critical" /> Incident Queue
            </div>
            <div className="text-3xl font-bold text-critical relative z-10">{incidents.length} Active</div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Live Attack Feed */}
          <Panel className="col-span-2">
            <PanelHeader title="Live Attack Feed" subtitle="Streaming Alerts" right={<span className="h-2 w-2 rounded-full bg-critical animate-pulse-ring" />} />
            <div className="h-80 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {activeAlerts.map((e, i) => (
                <div key={i} className="flex items-start gap-3 text-sm glass rounded-lg p-3 hover:bg-white/5 transition border border-transparent hover:border-white/10">
                  <span className="font-mono text-muted-foreground shrink-0 mt-0.5">{e.t}</span>
                  <div className="mt-0.5"><SevBadge sev={e.sev.charAt(0).toUpperCase() + e.sev.slice(1)} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{e.msg}</div>
                    <div className="text-muted-foreground text-[11px] font-mono mt-1">{e.src}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Threat Severity Distribution */}
          <Panel>
            <PanelHeader title="Threat Severity" subtitle="Distribution" />
            <div className="h-64 mt-2">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={alertsBySeverity} dataKey="value" nameKey="name" innerRadius={60} outerRadius={85} paddingAngle={3}>
                    {alertsBySeverity.map((e) => <Cell key={e.name} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "oklch(0.2 0.03 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs px-2">
              {alertsBySeverity.map((a) => (
                <div key={a.name} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full shadow-sm" style={{ background: a.color }} />
                  <span className="text-muted-foreground">{a.name}</span>
                  <span className="ml-auto font-mono font-bold">{a.value}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Active Investigations & Analyst Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Panel className="col-span-2">
            <PanelHeader title="Active Investigations" subtitle="Incident Queue" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Severity</th>
                    <th className="pb-3 font-medium">Stage</th>
                    <th className="pb-3 font-medium">Assignee</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((inc) => (
                    <tr key={inc.id} className="border-b border-border/50 hover:bg-white/5 transition">
                      <td className="py-3 font-mono text-cyan text-xs">{inc.id}</td>
                      <td className="py-3 font-medium">{inc.title}</td>
                      <td className="py-3"><SevBadge sev={inc.sev} /></td>
                      <td className="py-3 text-muted-foreground text-xs">{inc.stage}</td>
                      <td className="py-3 text-muted-foreground flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-primary/20 grid place-items-center text-[10px] text-primary">{inc.assignee.charAt(0)}</div>
                        {inc.assignee}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
          
          <Panel>
            <PanelHeader title="Analyst Activity" subtitle="Real-time log" />
            <div className="space-y-4 mt-2">
              {[
                { time: "2m ago", user: "S. Adeyemi", action: "Isolated host wks-ops-19" },
                { time: "5m ago", user: "T. Okafor", action: "Updated IOC list for APT-29" },
                { time: "12m ago", user: "System", action: "Auto-remediated 3 phishing emails" },
                { time: "18m ago", user: "ICS Team", action: "Started forensic capture on plc-grid-07" },
                { time: "24m ago", user: "S. Adeyemi", action: "Escalated INC-2041 to Critical" },
              ].map((log, i) => (
                <div key={i} className="flex gap-3 text-sm p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="w-12 text-[11px] text-muted-foreground shrink-0 pt-0.5">{log.time}</div>
                  <div className="w-20 font-medium truncate text-cyan">{log.user}</div>
                  <div className="flex-1 text-muted-foreground text-xs leading-relaxed">{log.action}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
