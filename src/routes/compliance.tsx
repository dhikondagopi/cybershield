import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SevBadge } from "@/components/ui/panel";
import { ShieldCheck, ShieldAlert, FileText, CheckCircle2, AlertTriangle, ListChecks, FileCode } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/compliance")({
  component: ComplianceCenterPage,
});

const FRAMEWORKS = [
  { name: "NIST CSF 2.0", score: 86, total: 108, met: 93, tone: "text-success", bg: "bg-success" },
  { name: "ISO 27001", score: 72, total: 114, met: 82, tone: "text-warn", bg: "bg-warn" },
  { name: "SOC 2 Type II", score: 94, total: 64, met: 60, tone: "text-primary", bg: "bg-primary" },
  { name: "CIS Controls v8", score: 68, total: 153, met: 104, tone: "text-critical", bg: "bg-critical" },
];

const AUDIT_FINDINGS = [
  { id: "AUD-991", title: "MFA not enforced for legacy VPN", framework: "CIS v8", sev: "High", status: "Open" },
  { id: "AUD-990", title: "S3 Bucket public access block missing", framework: "SOC 2", sev: "Critical", status: "In Progress" },
  { id: "AUD-989", title: "Incident response plan untested in 12mo", framework: "ISO 27001", sev: "Medium", status: "Open" },
  { id: "AUD-988", title: "Unencrypted PII in staging DB", framework: "NIST CSF", sev: "Critical", status: "Open" },
  { id: "AUD-987", title: "Lack of vendor risk assessments", framework: "ISO 27001", sev: "Medium", status: "Resolved" },
];

const RECOMMENDATIONS = [
  { text: "Enable AWS S3 Block Public Access across all accounts.", impact: "High", effort: "Low" },
  { text: "Deploy Azure AD Conditional Access policies for legacy VPNs.", impact: "High", effort: "Medium" },
  { text: "Schedule quarterly tabletop IR exercises.", impact: "Medium", effort: "Medium" },
  { text: "Run automated PII discovery scans on lower environments.", impact: "High", effort: "Low" },
];

function ComplianceCenterPage() {
  const overallScore = 80;

  return (
    <AppShell>
      <div className="flex flex-col gap-6 h-full">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">Compliance Center</h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-2xl">Continuous monitoring of security frameworks, audit findings, and regulatory posture.</p>
          </div>
          <button className="h-10 px-6 rounded-lg bg-gradient-to-r from-primary to-neon text-primary-foreground font-semibold flex items-center gap-2 hover:opacity-90 transition shadow-[0_0_20px_oklch(0.72_0.19_275/0.4)]">
            <FileText className="h-4 w-4" /> Export Compliance PDF
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Panel className="flex flex-col justify-center items-center text-center py-8">
             <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Overall Security Score</div>
             <div className="relative h-48 w-48 flex items-center justify-center">
               <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                 <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                 <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * overallScore) / 100} className="text-cyan transition-all duration-1000" />
               </svg>
               <div className="absolute flex flex-col items-center">
                 <span className="text-4xl font-bold text-gradient">{overallScore}</span>
                 <span className="text-[10px] text-muted-foreground mt-1">OUT OF 100</span>
               </div>
             </div>
             <div className="mt-4 flex items-center gap-2 text-success text-sm font-semibold">
               <CheckCircle2 className="h-4 w-4" /> Passing Score
             </div>
          </Panel>

          <div className="col-span-2 grid grid-cols-2 gap-4">
            {FRAMEWORKS.map(fw => (
              <Panel key={fw.name} className="p-5 flex flex-col justify-between group overflow-hidden relative">
                <div className={`absolute -bottom-8 -right-8 h-24 w-24 rounded-full ${fw.bg}/10 blur-xl group-hover:${fw.bg}/20 transition-colors`} />
                <div className="flex justify-between items-start mb-4">
                  <div className="font-semibold text-lg">{fw.name}</div>
                  <div className={`text-xl font-bold font-mono ${fw.tone}`}>{fw.score}%</div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] uppercase text-muted-foreground mb-1">
                    <span>Controls Met</span>
                    <span>{fw.met} / {fw.total}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${fw.bg}`} style={{ width: `${fw.score}%` }} />
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Panel className="col-span-2">
            <PanelHeader title="Open Audit Findings" subtitle="Mapped to frameworks" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Framework</th>
                    <th className="pb-3 font-medium">Severity</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {AUDIT_FINDINGS.map(find => (
                    <tr key={find.id} className="border-b border-border/50 hover:bg-white/5 transition">
                      <td className="py-3 font-mono text-cyan text-xs">{find.id}</td>
                      <td className="py-3 font-medium">{find.title}</td>
                      <td className="py-3 text-muted-foreground text-xs">{find.framework}</td>
                      <td className="py-3"><SevBadge sev={find.sev} /></td>
                      <td className="py-3 text-muted-foreground text-xs">{find.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="AI Recommendations" subtitle="Prioritized remediation actions" />
            <div className="space-y-3 mt-2">
              {RECOMMENDATIONS.map((rec, i) => (
                <div key={i} className="glass p-3 rounded-lg flex gap-3 border border-transparent hover:border-white/10 transition">
                  <div className="mt-0.5"><ListChecks className="h-4 w-4 text-primary" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{rec.text}</div>
                    <div className="flex gap-3 mt-2 text-[10px] uppercase font-semibold">
                      <span className={rec.impact === 'High' ? 'text-critical' : 'text-warn'}>Impact: {rec.impact}</span>
                      <span className={rec.effort === 'Low' ? 'text-success' : 'text-warn'}>Effort: {rec.effort}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
        
        <Panel>
           <PanelHeader title="MITRE ATT&CK Coverage" subtitle="Automated control mapping against known adversary techniques" />
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mt-4">
             {["Initial Access", "Execution", "Persistence", "PrivEsc", "Defense Evasion", "Credential Access", "Lateral Movement", "Exfiltration"].map(t => {
               const coverage = Math.floor(Math.random() * 40 + 50);
               return (
                 <div key={t} className="glass p-3 rounded-lg text-center flex flex-col justify-center items-center gap-2">
                   <div className="text-xs font-semibold text-muted-foreground">{t}</div>
                   <div className={`text-xl font-bold font-mono ${coverage > 80 ? 'text-success' : coverage > 60 ? 'text-warn' : 'text-critical'}`}>{coverage}%</div>
                 </div>
               );
             })}
           </div>
        </Panel>
      </div>
    </AppShell>
  );
}
