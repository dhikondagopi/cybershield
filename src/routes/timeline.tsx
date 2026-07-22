import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel } from "@/components/ui/panel";
import { PageHead } from "./anomalies";
import { killChain } from "@/lib/mock-data";
import {
  Binoculars, DoorOpen, Terminal, KeyRound, TrendingUp, Fingerprint,
  ArrowRightLeft, Upload, Zap,
} from "lucide-react";

export const Route = createFileRoute("/timeline")({
  head: () => ({ meta: [{ title: "AI Attack Timeline — CyberShield AI" }, { name: "description", content: "AI-reconstructed cyber kill-chain timeline for CNI incidents." }] }),
  component: TimelinePage,
});

const icons = [Binoculars, DoorOpen, Terminal, Fingerprint, TrendingUp, KeyRound, ArrowRightLeft, Upload, Zap];

function TimelinePage() {
  return (
    <AppShell>
      <PageHead title="AI Attack Timeline" desc="Reconstructed kill-chain for INC-2041. AI Copilot correlated 2.1M events into 9 phases." />
      <Panel>
        <div className="relative py-6">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-cyan to-neon" />
          <div className="space-y-8">
            {killChain.map((s, i) => {
              const I = icons[i] ?? Zap;
              const side = i % 2 === 0;
              return (
                <div key={i} className={`relative flex ${side ? "md:flex-row" : "md:flex-row-reverse"} items-start gap-6`}>
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-neon grid place-items-center shadow-[0_0_20px_oklch(0.72_0.22_300/0.6)] animate-pulse-ring">
                      <I className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div className={`ml-14 md:ml-0 md:w-[calc(50%-3rem)] ${side ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div className="glass rounded-xl p-4 inline-block text-left w-full">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-mono text-[10px] text-cyan uppercase tracking-widest">{s.t}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest ${
                          s.status.startsWith("blocked") || s.status === "prevented" ? "bg-success/15 text-success" :
                          s.status === "contained" ? "bg-cyan/15 text-cyan" : "bg-warn/15 text-warn"
                        }`}>{s.status}</span>
                      </div>
                      <div className="text-lg font-bold mt-1">{s.phase}</div>
                      <div className="text-sm text-muted-foreground mt-1">{s.detail}</div>
                    </div>
                  </div>
                  <div className="hidden md:block md:w-[calc(50%-3rem)]" />
                </div>
              );
            })}
          </div>
        </div>
      </Panel>
    </AppShell>
  );
}
