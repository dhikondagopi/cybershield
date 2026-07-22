import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { PageHead } from "./anomalies";
import { useMemo } from "react";

export const Route = createFileRoute("/network")({
  head: () => ({ meta: [{ title: "Network Visualization — CyberShield AI" }, { name: "description", content: "Interactive network graph showing lateral movement and compromised nodes." }] }),
  component: Network,
});

type Node = { id: string; x: number; y: number; type: string; state: "ok" | "warn" | "compromised" };

function Network() {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [
      { id: "fw-edge-01", x: 500, y: 60, type: "Firewall", state: "ok" },
      { id: "core-sw-1", x: 500, y: 180, type: "Switch", state: "ok" },
      { id: "srv-app-04", x: 280, y: 300, type: "Server", state: "compromised" },
      { id: "srv-db-3", x: 500, y: 300, type: "Database", state: "warn" },
      { id: "srv-web-12", x: 720, y: 300, type: "Server", state: "warn" },
      { id: "wks-19", x: 160, y: 440, type: "Endpoint", state: "compromised" },
      { id: "wks-22", x: 300, y: 440, type: "Endpoint", state: "warn" },
      { id: "wks-45", x: 440, y: 440, type: "Endpoint", state: "ok" },
      { id: "plc-07", x: 620, y: 440, type: "OT/PLC", state: "warn" },
      { id: "iot-cam-3", x: 780, y: 440, type: "IoT", state: "ok" },
      { id: "cloud-eu", x: 900, y: 180, type: "Cloud", state: "ok" },
    ];
    const edges = [
      ["fw-edge-01", "core-sw-1"], ["core-sw-1", "srv-app-04"], ["core-sw-1", "srv-db-3"], ["core-sw-1", "srv-web-12"],
      ["core-sw-1", "cloud-eu"], ["srv-app-04", "wks-19"], ["srv-app-04", "wks-22"], ["srv-db-3", "wks-45"],
      ["srv-web-12", "plc-07"], ["srv-web-12", "iot-cam-3"], ["wks-19", "srv-db-3"],
    ] as [string, string][];
    return { nodes, edges };
  }, []);

  const map = new Map(nodes.map((n) => [n.id, n]));
  const color = (s: Node["state"]) => s === "compromised" ? "oklch(0.65 0.26 20)" : s === "warn" ? "oklch(0.80 0.17 75)" : "oklch(0.75 0.18 155)";

  return (
    <AppShell>
      <PageHead title="Network Visualization" desc="Live topology · AI-highlighted lateral movement paths and compromised nodes." />
      <Panel className="p-0 overflow-hidden">
        <div className="relative">
          <svg viewBox="0 0 1000 520" className="w-full h-[520px]">
            <defs>
              <linearGradient id="edgeGrad" x1="0" x2="1">
                <stop offset="0%" stopColor="oklch(0.72 0.19 275)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="oklch(0.82 0.16 210)" stopOpacity="0.5" />
              </linearGradient>
              <radialGradient id="glow">
                <stop offset="0%" stopColor="oklch(0.65 0.26 20)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="oklch(0.65 0.26 20)" stopOpacity="0" />
              </radialGradient>
            </defs>
            {edges.map(([a, b], i) => {
              const na = map.get(a)!, nb = map.get(b)!;
              const isLat = na.state === "compromised" || nb.state === "compromised";
              return (
                <g key={i}>
                  <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                    stroke={isLat ? "oklch(0.65 0.26 20)" : "url(#edgeGrad)"} strokeWidth={isLat ? 2 : 1.2}
                    strokeDasharray={isLat ? "4 4" : "0"}>
                    {isLat && <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1s" repeatCount="indefinite" />}
                  </line>
                </g>
              );
            })}
            {nodes.map((n) => (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`} className="cursor-pointer">
                {n.state === "compromised" && <circle r="34" fill="url(#glow)" />}
                <circle r="22" fill="oklch(0.20 0.035 265)" stroke={color(n.state)} strokeWidth="2" />
                <circle r="6" fill={color(n.state)}>
                  {n.state === "compromised" && <animate attributeName="r" values="6;10;6" dur="1.4s" repeatCount="indefinite" />}
                </circle>
                <text y="42" textAnchor="middle" fontSize="10" fill="oklch(0.96 0.01 240)" fontFamily="JetBrains Mono">{n.id}</text>
                <text y="54" textAnchor="middle" fontSize="8" fill="oklch(0.70 0.03 250)">{n.type}</text>
              </g>
            ))}
          </svg>
          <div className="absolute top-4 left-4 glass rounded-xl p-3 text-xs space-y-1.5">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Legend</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success" />Healthy</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-warn" />Suspicious</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-critical animate-pulse" />Compromised</div>
            <div className="flex items-center gap-2"><span className="w-4 border-t-2 border-dashed border-critical" />Lateral movement</div>
          </div>
          <div className="absolute top-4 right-4 glass rounded-xl p-3 text-xs">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Detected Path</div>
            <div className="font-mono mt-1 text-cyan">wks-19 → srv-app-04 → srv-db-3</div>
            <div className="text-muted-foreground mt-1">3 hops · PSExec + WMI · T1021</div>
          </div>
        </div>
      </Panel>
    </AppShell>
  );
}
