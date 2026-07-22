import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { PageHead } from "./anomalies";
import { mitreTactics } from "@/lib/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/mitre")({
  head: () => ({ meta: [{ title: "MITRE ATT&CK Mapping — CyberShield AI" }, { name: "description", content: "Interactive MITRE ATT&CK matrix with detection coverage." }] }),
  component: Mitre,
});

const techniques: Record<string, { id: string; name: string; sev: number }[]> = {
  Reconnaissance: [
    { id: "T1595", name: "Active Scanning", sev: 2 },
    { id: "T1592", name: "Gather Host Info", sev: 1 },
    { id: "T1589", name: "Gather Identity Info", sev: 2 },
  ],
  "Initial Access": [
    { id: "T1566", name: "Phishing", sev: 3 },
    { id: "T1190", name: "Exploit Public App", sev: 3 },
    { id: "T1078", name: "Valid Accounts", sev: 2 },
  ],
  Execution: [
    { id: "T1059", name: "Command Interpreter", sev: 3 },
    { id: "T1053", name: "Scheduled Task", sev: 2 },
    { id: "T1204", name: "User Execution", sev: 2 },
  ],
  Persistence: [
    { id: "T1547", name: "Boot Autostart", sev: 2 },
    { id: "T1136", name: "Create Account", sev: 2 },
    { id: "T1543", name: "Create Service", sev: 3 },
  ],
  "Privilege Escalation": [
    { id: "T1068", name: "Exploit for PrivEsc", sev: 3 },
    { id: "T1055", name: "Process Injection", sev: 3 },
    { id: "T1548", name: "Abuse Elevation", sev: 2 },
  ],
  "Credential Access": [
    { id: "T1003", name: "OS Cred Dumping", sev: 3 },
    { id: "T1558", name: "Steal Kerberos", sev: 3 },
    { id: "T1110", name: "Brute Force", sev: 2 },
  ],
  "Lateral Movement": [
    { id: "T1021", name: "Remote Services", sev: 3 },
    { id: "T1570", name: "Lateral Tool Transfer", sev: 2 },
    { id: "T1210", name: "Exploit Remote Service", sev: 3 },
  ],
  Exfiltration: [
    { id: "T1041", name: "C2 Channel Exfil", sev: 3 },
    { id: "T1567", name: "Web Service Exfil", sev: 2 },
    { id: "T1048", name: "Alt Protocol", sev: 2 },
  ],
  Impact: [
    { id: "T1486", name: "Data Encrypted", sev: 3 },
    { id: "T1490", name: "Inhibit Recovery", sev: 3 },
    { id: "T1489", name: "Service Stop", sev: 2 },
  ],
};

const bg = (sev: number) => sev === 3 ? "bg-critical/60 hover:bg-critical/80"
  : sev === 2 ? "bg-warn/50 hover:bg-warn/70"
  : sev === 1 ? "bg-primary/40 hover:bg-primary/60" : "bg-white/5 hover:bg-white/10";

function Mitre() {
  const [sel, setSel] = useState<{ id: string; name: string; sev: number; tactic: string } | null>(null);

  return (
    <AppShell>
      <PageHead title="MITRE ATT&CK Matrix" desc="Detection coverage mapped to MITRE ATT&CK v14 · click a technique for details." />

      <Panel className="overflow-x-auto">
        <div className="grid grid-cols-9 gap-2 min-w-[900px]">
          {mitreTactics.map((t) => (
            <div key={t} className="text-[10px] uppercase tracking-widest text-cyan font-semibold pb-2 text-center border-b border-border">{t}</div>
          ))}
          {mitreTactics.map((t) => (
            <div key={`col-${t}`} className="space-y-1.5">
              {(techniques[t] ?? []).map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => setSel({ ...tech, tactic: t })}
                  className={`w-full text-left rounded-md p-2 border border-white/5 transition ${bg(tech.sev)}`}
                >
                  <div className="font-mono text-[10px] text-white/90">{tech.id}</div>
                  <div className="text-[11px] leading-tight mt-0.5 text-white/90">{tech.name}</div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </Panel>

      {sel && (
        <div className="mt-4">
          <Panel>
            <PanelHeader title={`${sel.id} — ${sel.name}`} subtitle={`Tactic: ${sel.tactic}`} />
            <p className="text-sm text-muted-foreground">
              Adversaries may use this technique to advance their objectives. CyberShield AI has {sel.sev === 3 ? "high" : sel.sev === 2 ? "medium" : "baseline"} detection coverage
              across endpoint EDR, network sensors, and cloud audit logs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <Card k="Detection Coverage" v={sel.sev === 3 ? "94%" : sel.sev === 2 ? "78%" : "51%"} />
              <Card k="Recent Hits (30d)" v={String(Math.round(sel.sev * 12 + Math.random() * 20))} />
              <Card k="Confidence" v={sel.sev === 3 ? "High" : "Medium"} />
            </div>
            <div className="mt-4">
              <div className="text-xs uppercase tracking-widest text-cyan mb-2">Suggested Mitigations</div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Enforce least-privilege on service accounts</li>
                <li>• Enable EDR memory scanning + AMSI</li>
                <li>• Segment critical OT/CNI zones from IT</li>
                <li>• Rotate Kerberos krbtgt on a 90-day cycle</li>
              </ul>
            </div>
          </Panel>
        </div>
      )}
    </AppShell>
  );
}

function Card({ k, v }: { k: string; v: string }) {
  return (
    <div className="glass rounded-lg p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
      <div className="text-xl font-bold font-mono mt-1 text-gradient">{v}</div>
    </div>
  );
}
