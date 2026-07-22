import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-30 animate-gradient" style={{ backgroundSize: "300% 300%" }} />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 [background:radial-gradient(circle_at_50%_50%,transparent_20%,oklch(0.10_0.02_265)_80%)]" />

      <div className="relative min-h-screen grid lg:grid-cols-2">
        {/* Left panel */}
        <div className="hidden lg:flex flex-col p-12 justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-cyan to-neon grid place-items-center shadow-[0_0_25px_oklch(0.72_0.19_275/0.6)]">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-bold tracking-tight text-gradient text-xl">CyberShield</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">AI Cyber Resilience</div>
            </div>
          </Link>
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-cyan mb-3">Trusted by 42 CNI operators</div>
            <h2 className="text-4xl font-bold tracking-tight max-w-md leading-tight">
              AI-defended <span className="text-gradient">critical infrastructure</span> for a resilient world.
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md">
              Autonomous SOC. MITRE ATT&CK-mapped. NIS2-ready. Deploy in minutes across your entire estate — from OT to cloud.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
              {[["4.2M", "events/day"], ["3.4m", "MTTD"], ["99.98%", "uptime"]].map(([v, l]) => (
                <div key={l} className="glass rounded-xl p-3">
                  <div className="text-xl font-bold text-gradient font-mono">{v}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">© 2026 CyberShield AI · SOC2 Type II · ISO 27001</div>
        </div>

        {/* Right form */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
