import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { PageHead } from "./anomalies";
import { Download, FileText, ShieldCheck, TrendingUp, Users } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — CyberShield AI" }, { name: "description", content: "Executive, incident, compliance, and threat intelligence reports." }] }),
  component: Reports,
});

const templates = [
  { icon: TrendingUp, title: "Executive Summary", desc: "Board-level cyber posture briefing", tone: "from-primary to-neon" },
  { icon: FileText, title: "Incident Report", desc: "Full post-incident analysis + IoC list", tone: "from-critical to-warn" },
  { icon: ShieldCheck, title: "Compliance Report", desc: "NIS2 · ISO 27001 · NIST CSF 2.0", tone: "from-cyan to-success" },
  { icon: Users, title: "Threat Intelligence", desc: "Sector-specific adversary landscape", tone: "from-neon to-primary" },
];

const recent = [
  { name: "Q3-2026 Executive Cyber Briefing.pdf", date: "Sept 30, 2026", size: "4.2 MB" },
  { name: "INC-2041 Ransomware Post-Mortem.pdf", date: "Sept 24, 2026", size: "1.8 MB" },
  { name: "NIS2 Compliance — Grid Operations.pdf", date: "Sept 18, 2026", size: "3.6 MB" },
  { name: "APT-29 Adversary Profile.pdf", date: "Sept 12, 2026", size: "2.1 MB" },
];

function Reports() {
  return (
    <AppShell>
      <PageHead title="Reports" desc="Generate board-ready PDFs. AI drafts executive summaries in seconds from raw telemetry." />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        {templates.map(({ icon: I, title, desc, tone }) => (
          <Panel key={title} className="cursor-pointer group hover:scale-[1.02] transition-transform">
            <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${tone} opacity-25 blur-2xl group-hover:opacity-40 transition`} />
            <div className="relative">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${tone} grid place-items-center shadow-[0_0_20px_oklch(0.72_0.19_275/0.4)]`}>
                <I className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="mt-4 font-semibold">{title}</div>
              <div className="text-xs text-muted-foreground mt-1">{desc}</div>
              <button className="mt-4 w-full h-9 rounded-lg glass text-xs font-semibold hover:bg-white/10 transition">Generate PDF</button>
            </div>
          </Panel>
        ))}
      </div>

      <Panel>
        <PanelHeader title="Recent Reports" />
        <ul className="divide-y divide-border">
          {recent.map((r) => (
            <li key={r.name} className="py-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/25 to-cyan/15 grid place-items-center"><FileText className="h-4 w-4 text-cyan" /></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.date} · {r.size}</div>
              </div>
              <button className="text-xs flex items-center gap-1 text-cyan hover:underline"><Download className="h-3.5 w-3.5" />Download</button>
            </li>
          ))}
        </ul>
      </Panel>
    </AppShell>
  );
}
