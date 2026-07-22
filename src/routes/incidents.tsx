import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SevBadge } from "@/components/ui/panel";
import { incidents, killChain } from "@/lib/mock-data";
import { PageHead } from "./anomalies";
import { Ban, FileText, PowerOff, ShieldOff, UserX, Zap } from "lucide-react";

export const Route = createFileRoute("/incidents")({
  head: () => ({ meta: [{ title: "Incident Response Center — CyberShield AI" }, { name: "description", content: "Orchestrated incident response, playbooks, and containment for CNI." }] }),
  component: Incidents,
});

const actions = [
  { icon: PowerOff, label: "Isolate Host", tone: "text-critical" },
  { icon: Zap, label: "Kill Process", tone: "text-warn" },
  { icon: Ban, label: "Block IP", tone: "text-cyan" },
  { icon: UserX, label: "Disable User", tone: "text-neon" },
  { icon: ShieldOff, label: "Revoke Tokens", tone: "text-orange-300" },
  { icon: FileText, label: "Incident Report", tone: "text-success" },
];

function Incidents() {
  return (
    <AppShell>
      <PageHead title="Incident Response Center" desc="4 open incidents · 2 critical · median containment 27m" />

      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-4">
        <Panel>
          <PanelHeader title="Open Incidents" />
          <div className="space-y-2">
            {incidents.map((i, idx) => (
              <div key={i.id} className={`glass rounded-xl p-3 cursor-pointer border ${idx === 0 ? "border-primary/40 neon-border" : "border-transparent"}`}>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-cyan">{i.id}</span>
                  <SevBadge sev={i.sev} />
                  <span className="ml-auto text-[10px] text-muted-foreground">{i.opened} ago</span>
                </div>
                <div className="mt-1 text-sm font-medium truncate">{i.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">Stage: <span className="text-foreground">{i.stage}</span> · {i.assignee}</div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <PanelHeader title="INC-2041 — Ransomware Outbreak, Finance Segment"
              subtitle="Cobalt Strike → Kerberoasting → LockBit 4.0 attempted deployment"
              right={<SevBadge sev="Critical" />} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <Stat k="Affected Devices" v="14" />
              <Stat k="Users Impacted" v="6" />
              <Stat k="Data at Risk" v="42 GB" />
              <Stat k="Time to Contain" v="27m" />
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Kill-Chain Timeline" subtitle="Reconstructed by AI Copilot from telemetry" />
            <ol className="relative border-l-2 border-primary/40 ml-3 space-y-4">
              {killChain.map((s, i) => (
                <li key={i} className="ml-6 relative">
                  <span className="absolute -left-[34px] top-1 h-4 w-4 rounded-full bg-gradient-to-br from-primary to-neon border-4 border-background shadow-[0_0_10px_oklch(0.72_0.22_300/0.6)]" />
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-semibold text-sm">{s.phase}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{s.t}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      s.status.startsWith("blocked") || s.status === "prevented" ? "bg-success/15 text-success" :
                      s.status === "contained" ? "bg-cyan/15 text-cyan" : "bg-warn/15 text-warn"
                    }`}>{s.status}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{s.detail}</div>
                </li>
              ))}
            </ol>
          </Panel>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Panel>
              <PanelHeader title="Recommended Playbook" subtitle="SOAR · auto-suggested by AI" />
              <ol className="text-sm space-y-2">
                {["Isolate srv-app-04 & 13 endpoints", "Kill cs-beacon.exe on affected hosts", "Rotate 42 cached credentials", "Block C2: 45.61.187.9 + domain", "Restore from immutable backup", "Notify CNI regulator (24h SLA)"].map((s, i) => (
                  <li key={i} className="flex gap-2"><span className="text-cyan font-mono">{String(i + 1).padStart(2, "0")}</span><span>{s}</span></li>
                ))}
              </ol>
              <button className="mt-4 w-full h-10 rounded-lg bg-gradient-to-r from-primary to-neon text-primary-foreground text-sm font-semibold">Execute Playbook</button>
            </Panel>

            <Panel>
              <PanelHeader title="Containment Actions" subtitle="One-click SOAR actions" />
              <div className="grid grid-cols-2 gap-2">
                {actions.map(({ icon: I, label, tone }) => (
                  <button key={label} className="glass rounded-xl p-3 hover:bg-white/10 transition flex flex-col items-start gap-2">
                    <I className={`h-5 w-5 ${tone}`} />
                    <span className="text-xs font-semibold">{label}</span>
                  </button>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="glass rounded-lg p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
      <div className="text-lg font-bold font-mono mt-1">{v}</div>
    </div>
  );
}
