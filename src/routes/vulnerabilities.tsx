import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SevBadge } from "@/components/ui/panel";
import { cves } from "@/lib/mock-data";
import { PageHead } from "./anomalies";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/vulnerabilities")({
  head: () => ({ meta: [{ title: "Vulnerability Management — CyberShield AI" }, { name: "description", content: "AI-prioritized CVE and patch management for CNI." }] }),
  component: Vulns,
});

const buckets = [
  { name: "Critical", value: 18, color: "oklch(0.65 0.26 20)" },
  { name: "High", value: 47, color: "oklch(0.80 0.17 45)" },
  { name: "Medium", value: 122, color: "oklch(0.80 0.17 75)" },
  { name: "Low", value: 284, color: "oklch(0.75 0.18 155)" },
];

const trend = Array.from({ length: 14 }).map((_, i) => ({ d: `D${i + 1}`, open: 60 - i * 2 + Math.round(Math.random() * 8), patched: i * 4 + Math.round(Math.random() * 5) }));

function Vulns() {
  return (
    <AppShell>
      <PageHead title="Vulnerability Management" desc="AI-ranked CVE exposure across your CNI estate. Patch priority optimized by exploit availability × asset criticality." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {buckets.map((b) => (
          <Panel key={b.name} className="p-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{b.name}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <div className="text-3xl font-bold font-mono" style={{ color: b.color }}>{b.value}</div>
              <div className="text-xs text-muted-foreground">open</div>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(b.value / 300) * 100}%`, background: b.color, boxShadow: `0 0 10px ${b.color}` }} />
            </div>
          </Panel>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <Panel className="xl:col-span-2">
          <PanelHeader title="Patch Trend" subtitle="Open vs patched (14 days)" />
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="d" stroke="oklch(0.7 0.03 250)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.03 250)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.2 0.03 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
                <Bar dataKey="open" fill="oklch(0.65 0.26 20)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="patched" fill="oklch(0.75 0.18 155)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Exploit Status" subtitle="CVEs with known exploit code" />
          <div className="space-y-3">
            {[{ l: "Weaponized in the wild", v: 6, c: "oklch(0.65 0.26 20)" }, { l: "Public PoC available", v: 14, c: "oklch(0.80 0.17 45)" }, { l: "Theoretical only", v: 22, c: "oklch(0.80 0.17 75)" }, { l: "No known exploit", v: 429, c: "oklch(0.75 0.18 155)" }].map((x) => (
              <div key={x.l}>
                <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{x.l}</span><span className="font-mono">{x.v}</span></div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, (x.v / 30) * 100)}%`, background: x.c, boxShadow: `0 0 10px ${x.c}` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHeader title="Prioritized CVEs" subtitle="AI ranking · CVSS × exploit × asset criticality" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="pb-2">CVE</th><th className="pb-2">CVSS</th><th className="pb-2">Severity</th>
                <th className="pb-2">Vendor</th><th className="pb-2">Affected Asset</th><th className="pb-2">Exploit</th><th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {cves.map((c) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-white/5">
                  <td className="py-3 font-mono text-xs text-cyan">{c.id}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">{c.cvss.toFixed(1)}</span>
                      <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-warn to-critical" style={{ width: `${c.cvss * 10}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3"><SevBadge sev={c.sev} /></td>
                  <td className="py-3 text-xs">{c.vendor}</td>
                  <td className="py-3 font-mono text-xs">{c.asset}</td>
                  <td className="py-3 text-xs"><span className={`px-2 py-0.5 rounded-full ${c.exploit === "Weaponized" ? "bg-critical/20 text-critical" : c.exploit.includes("Public") ? "bg-warn/15 text-warn" : "bg-white/5 text-muted-foreground"}`}>{c.exploit}</span></td>
                  <td className="py-3 text-right"><button className="text-xs text-cyan hover:underline">Patch →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </AppShell>
  );
}
