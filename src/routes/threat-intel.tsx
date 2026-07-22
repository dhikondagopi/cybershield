import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { actors, iocs } from "@/lib/mock-data";
import { PageHead } from "./anomalies";
import { Flag, Globe, Hash, Server as ServerIcon, Skull } from "lucide-react";

export const Route = createFileRoute("/threat-intel")({
  head: () => ({ meta: [{ title: "Threat Intelligence — CyberShield AI" }, { name: "description", content: "Curated threat feeds, IOCs, and adversary profiles." }] }),
  component: TI,
});

const feeds = [
  { src: "CISA KEV", t: "2m ago", title: "New KEV entry: CVE-2025-31200 Apache HTTPD RCE — actively exploited" },
  { src: "MISP Community", t: "14m ago", title: "LockBit 4.0 affiliate targeting European energy sector (TLP:AMBER)" },
  { src: "Mandiant", t: "38m ago", title: "APT-29 shifting to residential proxies for OAuth phishing" },
  { src: "CERT-EU", t: "1h ago", title: "Coordinated Modbus scanning against EU water utilities" },
  { src: "AlienVault OTX", t: "2h ago", title: "45.61.187.9 confirmed as Cobalt Strike C2 across 4 campaigns" },
  { src: "Recorded Future", t: "3h ago", title: "Volt Typhoon Living-off-the-Land activity in US telco" },
];

const iconFor = (t: string) => t === "Domain" ? Globe : t === "IP" ? ServerIcon : Hash;

function TI() {
  return (
    <AppShell>
      <PageHead title="Threat Intelligence" desc="Live intel from 42 sources · normalized, deduped, and correlated to your estate by AI." />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Panel className="xl:col-span-2">
          <PanelHeader title="Latest Threat Feeds" right={<span className="text-[10px] uppercase tracking-widest text-cyan">42 sources</span>} />
          <ul className="space-y-2">
            {feeds.map((f, i) => (
              <li key={i} className="glass rounded-xl p-3 flex gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-neon/30 to-primary/20 grid place-items-center shrink-0">
                  <Flag className="h-4 w-4 text-neon" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-cyan font-mono">{f.src} · <span className="text-muted-foreground">{f.t}</span></div>
                  <div className="text-sm mt-0.5">{f.title}</div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <PanelHeader title="Indicators of Compromise" subtitle="Confidence-scored" />
          <div className="space-y-2">
            {iocs.map((i, idx) => {
              const I = iconFor(i.type);
              return (
                <div key={idx} className="glass rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <I className="h-4 w-4 text-cyan" />
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{i.type}</span>
                    <span className="ml-auto text-xs font-mono">{i.conf}%</span>
                  </div>
                  <div className="mt-1 font-mono text-xs break-all">{i.value}</div>
                  <div className="mt-1 text-[10px] px-2 py-0.5 inline-block rounded-full bg-critical/15 text-critical">{i.tag}</div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <div className="mt-4">
        <Panel>
          <PanelHeader title="Threat Actor Profiles" subtitle="Adversary groups tracking your sector" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {actors.map((a) => (
              <div key={a.name} className="glass rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-critical/30 to-neon/20 grid place-items-center">
                    <Skull className="h-5 w-5 text-critical" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{a.name}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Origin · {a.origin}</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">Targets</div>
                <div className="text-sm">{a.targets}</div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-xs text-muted-foreground">TTPs tracked</span>
                  <span className="font-mono text-cyan font-bold">{a.ttps}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
