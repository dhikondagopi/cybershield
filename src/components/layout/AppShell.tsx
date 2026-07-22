import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Bot, Activity, Siren, ShieldAlert, Radar, Boxes,
  Network, Timer, Grid3x3, FileText, Settings, Search, Bell, ShieldCheck, Globe, Users, Brain
} from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/soc", label: "SOC Command Center", icon: Siren },
  { to: "/globe", label: "Cyber Attack Globe", icon: Globe },
  { to: "/copilot", label: "AI Copilot", icon: Bot },
  { to: "/anomalies", label: "Anomaly Detection", icon: Activity },
  { to: "/incidents", label: "Incident Response", icon: Siren },
  { to: "/investigation", label: "AI Investigation", icon: Bot },
  { to: "/simulation", label: "Attack Simulation", icon: ShieldAlert },
  { to: "/digital-twin", label: "Digital Twin", icon: Network },
  { to: "/collaboration", label: "Live Collaboration", icon: Users },
  { to: "/compliance", label: "Compliance Center", icon: ShieldCheck },
  { to: "/executive", label: "Executive Analytics", icon: LayoutDashboard },
  { to: "/report-gen", label: "Report Generator", icon: FileText },
  { to: "/threat-intelligence-ai", label: "Threat Intelligence AI", icon: Brain },
  { to: "/vulnerabilities", label: "Vulnerabilities", icon: ShieldAlert },
  { to: "/threat-intel", label: "Threat Intelligence", icon: Radar },
  { to: "/assets", label: "Asset Inventory", icon: Boxes },
  { to: "/network", label: "Network Graph", icon: Network },
  { to: "/timeline", label: "Attack Timeline", icon: Timer },
  { to: "/mitre", label: "MITRE ATT&CK", icon: Grid3x3 },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="h-screen w-full overflow-hidden flex text-foreground">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col glass-strong border-r border-sidebar-border h-full">
        <div className="flex items-center gap-2 px-5 h-16 border-b border-sidebar-border shrink-0">
          <div className="relative">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary via-cyan to-neon grid place-items-center shadow-[0_0_20px_oklch(0.72_0.19_275/0.6)]">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold tracking-tight text-gradient text-lg leading-none truncate">CyberShield</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1 truncate">AI Resilience</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-0.5 min-w-0">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                  active
                    ? "bg-gradient-to-r from-primary/20 to-cyan/10 text-foreground neon-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate flex-1 min-w-0">{label}</span>
                {active && <span className="ml-auto shrink-0 h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border shrink-0">
          <div className="glass rounded-xl p-3 text-xs min-w-0">
            <div className="flex items-center gap-2 mb-1 truncate">
              <span className="shrink-0 h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-success font-semibold truncate">All Systems Operational</span>
            </div>
            <div className="text-muted-foreground truncate">SOC coverage 24/7 · v4.2.1</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        <header className="shrink-0 h-16 sticky top-0 z-30 glass-strong border-b border-border flex items-center gap-3 px-4 lg:px-6">
          <Link to="/" className="lg:hidden flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-cyan grid place-items-center">
              <ShieldCheck className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-gradient">CyberShield</span>
          </Link>
          <div className="hidden md:flex items-center gap-2 flex-1 min-w-0 max-w-xl">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground shrink-0" />
              <input
                placeholder="Search assets, IOCs, techniques, incidents…"
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/5 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
              />
              <kbd className="hidden md:inline absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-border text-muted-foreground">⌘K</kbd>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 h-9 rounded-lg glass text-xs shrink-0">
              <span className="h-2 w-2 rounded-full bg-critical animate-pulse-ring shrink-0" />
              <span className="font-semibold whitespace-nowrap">DEFCON 3</span>
              <span className="text-muted-foreground whitespace-nowrap">· Elevated</span>
            </div>
            <button className="relative shrink-0 h-9 w-9 grid place-items-center rounded-lg glass hover:bg-white/10 transition">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-critical" />
            </button>
            <Link to="/auth/login" className="flex items-center gap-2 pl-1 pr-3 h-9 rounded-lg glass hover:bg-white/10 transition shrink-0 min-w-0">
              <div className="shrink-0 h-7 w-7 rounded-md bg-gradient-to-br from-primary to-neon grid place-items-center text-xs font-bold text-primary-foreground">SA</div>
              <div className="text-xs leading-tight text-left hidden sm:block truncate">
                <div className="font-semibold truncate">Sarah Adeyemi</div>
                <div className="text-muted-foreground truncate">SOC Manager</div>
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-4 lg:p-6 relative">
          <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
          <div className="relative min-w-0">{children ?? <Outlet />}</div>
        </main>
      </div>
    </div>
  );
}
