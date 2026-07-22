import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SevBadge } from "@/components/ui/panel";
import { assets } from "@/lib/mock-data";
import { PageHead } from "./anomalies";
import { Cloud, Cpu, Router, Server, ShieldCheck, Smartphone } from "lucide-react";

export const Route = createFileRoute("/assets")({
  head: () => ({ meta: [{ title: "Asset Inventory — CyberShield AI" }, { name: "description", content: "Unified asset inventory for CNI: servers, endpoints, cloud, OT/IoT." }] }),
  component: Assets,
});

const cats = [
  { icon: Server, name: "Servers", n: 1240 },
  { icon: Cpu, name: "Endpoints", n: 6420 },
  { icon: ShieldCheck, name: "Firewalls", n: 42 },
  { icon: Router, name: "Routers", n: 88 },
  { icon: Cloud, name: "Cloud Resources", n: 2180 },
  { icon: Smartphone, name: "IoT / OT", n: 2495 },
];

function Assets() {
  return (
    <AppShell>
      <PageHead title="Asset Inventory" desc="12,847 assets discovered and continuously monitored across your CNI estate." />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-4">
        {cats.map(({ icon: I, name, n }) => (
          <Panel key={name} className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/25 to-cyan/15 grid place-items-center"><I className="h-4 w-4 text-cyan" /></div>
              <div className="text-xs text-muted-foreground">{name}</div>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono">{n.toLocaleString()}</div>
          </Panel>
        ))}
      </div>

      <Panel>
        <PanelHeader title="Managed Assets" subtitle="Sortable inventory · risk-scored" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="pb-2">Name</th><th className="pb-2">Type</th><th className="pb-2">OS</th>
                <th className="pb-2">Risk Score</th><th className="pb-2">Status</th><th className="pb-2">Owner</th><th className="pb-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr key={a.name} className="border-b border-border/50 hover:bg-white/5">
                  <td className="py-3 font-mono text-xs text-cyan">{a.name}</td>
                  <td className="py-3 text-xs">{a.type}</td>
                  <td className="py-3 text-xs text-muted-foreground">{a.os}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold w-8">{a.risk}</span>
                      <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${a.risk}%`,
                          background: a.risk > 75 ? "oklch(0.65 0.26 20)" : a.risk > 45 ? "oklch(0.80 0.17 75)" : "oklch(0.75 0.18 155)"
                        }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3"><SevBadge sev={a.status} /></td>
                  <td className="py-3 text-xs">{a.owner}</td>
                  <td className="py-3 text-xs text-muted-foreground">{a.loc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </AppShell>
  );
}
