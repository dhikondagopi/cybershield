import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { PageHead } from "./anomalies";
import { Bell, Key, Palette, User, Users, Building2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — CyberShield AI" }, { name: "description", content: "Profile, notifications, API keys, organization settings." }] }),
  component: Settings,
});

const tabs = [
  { id: "profile", icon: User, label: "Profile" },
  { id: "notifications", icon: Bell, label: "Notifications" },
  { id: "theme", icon: Palette, label: "Theme" },
  { id: "api", icon: Key, label: "API Keys" },
  { id: "org", icon: Building2, label: "Organization" },
  { id: "team", icon: Users, label: "Team" },
];

function Settings() {
  const [tab, setTab] = useState("profile");
  return (
    <AppShell>
      <PageHead title="Settings" desc="Manage your account, organization, and API access." />
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
        <Panel className="p-3">
          <div className="space-y-1">
            {tabs.map(({ id, icon: I, label }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  tab === id ? "bg-gradient-to-r from-primary/25 to-cyan/10 text-foreground neon-border" : "text-muted-foreground hover:bg-white/5"
                }`}>
                <I className="h-4 w-4" />{label}
              </button>
            ))}
          </div>
        </Panel>

        <Panel>
          {tab === "profile" && (
            <>
              <PanelHeader title="Profile" subtitle="Personal information & role" />
              <div className="flex items-center gap-4 mb-6">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-neon grid place-items-center text-2xl font-bold text-primary-foreground">SA</div>
                <div>
                  <div className="text-lg font-semibold">Sarah Adeyemi</div>
                  <div className="text-xs text-muted-foreground">sarah.adeyemi@gridcorp.eu · SOC Manager</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full Name" value="Sarah Adeyemi" />
                <Field label="Email" value="sarah.adeyemi@gridcorp.eu" />
                <Field label="Role" value="SOC Manager" />
                <Field label="Timezone" value="Europe/London" />
              </div>
            </>
          )}
          {tab === "notifications" && (
            <>
              <PanelHeader title="Notifications" subtitle="Control channels and thresholds" />
              {[
                ["Critical alerts (SMS + Email + Push)", true],
                ["High-severity alerts", true],
                ["Weekly executive digest", true],
                ["New CVE affecting my estate", true],
                ["AI Copilot suggestions", false],
              ].map(([l, v]) => (
                <label key={String(l)} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                  <span className="text-sm">{l as string}</span>
                  <Toggle initial={v as boolean} />
                </label>
              ))}
            </>
          )}
          {tab === "theme" && (
            <>
              <PanelHeader title="Theme" subtitle="This build ships a dark cybersecurity UI" />
              <div className="grid grid-cols-3 gap-3">
                {[
                  { n: "Neon Ops", g: "from-primary via-cyan to-neon", active: true },
                  { n: "Crimson SOC", g: "from-critical via-warn to-primary" },
                  { n: "Emerald ICS", g: "from-success via-cyan to-primary" },
                ].map((t) => (
                  <div key={t.n} className={`glass rounded-xl p-3 cursor-pointer ${t.active ? "neon-border" : ""}`}>
                    <div className={`h-20 rounded-lg bg-gradient-to-br ${t.g}`} />
                    <div className="mt-2 text-sm font-semibold">{t.n}</div>
                    {t.active && <div className="text-[10px] text-cyan">● Active</div>}
                  </div>
                ))}
              </div>
            </>
          )}
          {tab === "api" && (
            <>
              <PanelHeader title="API Keys" subtitle="Programmatic access to CyberShield" />
              <div className="space-y-2">
                {[
                  { n: "SOAR Integration", k: "csa_live_••••••••••••4f8a", c: "Jun 2, 2026" },
                  { n: "SIEM Forwarder", k: "csa_live_••••••••••••e21b", c: "Apr 18, 2026" },
                ].map((k) => (
                  <div key={k.n} className="glass rounded-lg p-3 flex items-center gap-3">
                    <Key className="h-4 w-4 text-cyan" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{k.n}</div>
                      <div className="text-xs font-mono text-muted-foreground truncate">{k.k}</div>
                    </div>
                    <div className="text-[10px] text-muted-foreground">Created {k.c}</div>
                    <button className="text-xs text-critical hover:underline">Revoke</button>
                  </div>
                ))}
              </div>
              <button className="mt-4 h-10 px-4 rounded-lg bg-gradient-to-r from-primary to-neon text-primary-foreground text-sm font-semibold">Generate New Key</button>
            </>
          )}
          {tab === "org" && (
            <>
              <PanelHeader title="Organization" subtitle="Tenant configuration" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Organization" value="GridCorp Energy (CNI)" />
                <Field label="Tenant ID" value="cni-gridcorp-eu-1" />
                <Field label="Sector" value="Energy / Transmission" />
                <Field label="Compliance" value="NIS2 · ISO 27001 · NIST CSF 2.0" />
              </div>
            </>
          )}
          {tab === "team" && (
            <>
              <PanelHeader title="Team Members" subtitle="Role-based access control" />
              <ul className="divide-y divide-border">
                {[
                  { n: "Sarah Adeyemi", e: "sarah.adeyemi@gridcorp.eu", r: "SOC Manager" },
                  { n: "Tomiwa Okafor", e: "t.okafor@gridcorp.eu", r: "Security Analyst" },
                  { n: "Kai Chen", e: "kai.chen@gridcorp.eu", r: "Security Analyst" },
                  { n: "Priya Raman", e: "p.raman@gridcorp.eu", r: "Administrator" },
                ].map((m) => (
                  <li key={m.e} className="py-3 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-neon grid place-items-center text-xs font-bold text-primary-foreground">
                      {m.n.split(" ").map((s) => s[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{m.n}</div>
                      <div className="text-xs text-muted-foreground">{m.e}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary uppercase tracking-widest">{m.r}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</label>
      <input defaultValue={value} className="mt-1 w-full h-10 px-3 rounded-lg glass border border-border text-sm" />
    </div>
  );
}

function Toggle({ initial }: { initial: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <button onClick={() => setOn(!on)} className={`relative h-6 w-11 rounded-full transition ${on ? "bg-gradient-to-r from-primary to-neon" : "bg-white/10"}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? "left-5" : "left-0.5"}`} />
    </button>
  );
}
