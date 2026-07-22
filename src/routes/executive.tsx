import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Briefcase, TrendingUp, TrendingDown, DollarSign, Shield, Activity, Users, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

export const Route = createFileRoute("/executive")({
  component: ExecutiveAnalyticsPage,
});

const RISK_TREND = [
  { month: "Jan", risk: 85, industry: 70 },
  { month: "Feb", risk: 78, industry: 72 },
  { month: "Mar", risk: 72, industry: 68 },
  { month: "Apr", risk: 65, industry: 69 },
  { month: "May", risk: 58, industry: 65 },
  { month: "Jun", risk: 45, industry: 66 },
];

const ROI_DATA = [
  { category: "Ransomware Prevented", value: 4200000 },
  { category: "Downtime Avoided", value: 1800000 },
  { category: "Compliance Fines Avoided", value: 850000 },
  { category: "SOC Efficiency", value: 320000 },
];

function ExecutiveAnalyticsPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6 h-full">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">Executive Board Analytics</h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-2xl">High-level insights on cyber risk posture, financial impact, and security ROI.</p>
          </div>
          <div className="flex gap-2">
            <button className="h-10 px-4 rounded-lg glass border border-border text-sm font-semibold flex items-center gap-2 hover:bg-white/10 transition">
              <Briefcase className="h-4 w-4" /> Download Board Deck
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Panel className="p-5 flex flex-col justify-center">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Financial Risk Exposure</div>
            <div className="text-3xl font-bold font-mono">$12.4M</div>
            <div className="text-sm text-success flex items-center gap-1 mt-1 font-semibold"><TrendingDown className="h-3 w-3" /> 18% YoY reduction</div>
          </Panel>
          <Panel className="p-5 flex flex-col justify-center">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">CyberShield AI ROI</div>
            <div className="text-3xl font-bold font-mono text-cyan">342%</div>
            <div className="text-sm text-muted-foreground mt-1">Payback period: 3.2 months</div>
          </Panel>
          <Panel className="p-5 flex flex-col justify-center">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Overall Security Posture</div>
            <div className="text-3xl font-bold font-mono text-success">A-</div>
            <div className="text-sm text-muted-foreground mt-1">Top 12% in Finance Sector</div>
          </Panel>
          <Panel className="p-5 flex flex-col justify-center">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Critical Incidents</div>
            <div className="text-3xl font-bold font-mono">0</div>
            <div className="text-sm text-success flex items-center gap-1 mt-1 font-semibold"><Shield className="h-3 w-3" /> 184 days without breach</div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          <Panel className="flex flex-col min-h-[400px]">
            <PanelHeader title="Risk Posture Trend vs. Industry Average" subtitle="6-month trailing" />
            <div className="flex-1 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={RISK_TREND}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="oklch(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(var(--muted-foreground))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="oklch(var(--muted-foreground))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="oklch(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'oklch(var(--background))', borderColor: 'oklch(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'oklch(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="industry" stroke="oklch(var(--muted-foreground))" fillOpacity={1} fill="url(#colorInd)" name="Industry Avg" />
                  <Area type="monotone" dataKey="risk" stroke="oklch(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" name="Our Risk Score" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel className="flex flex-col min-h-[400px]">
            <PanelHeader title="Value Realization (YTD)" subtitle="Estimated cost avoidance enabled by AI automation" />
            <div className="flex-1 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ROI_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" horizontal={false} />
                  <XAxis type="number" stroke="oklch(var(--muted-foreground))" fontSize={12} tickFormatter={(val) => `$${val/1000000}M`} />
                  <YAxis dataKey="category" type="category" stroke="oklch(var(--foreground))" fontSize={12} width={150} />
                  <Tooltip 
                    cursor={{ fill: 'oklch(var(--primary)/0.1)' }}
                    contentStyle={{ backgroundColor: 'oklch(var(--background))', borderColor: 'oklch(var(--border))', borderRadius: '8px' }}
                    formatter={(value: number) => [`$${(value/1000000).toFixed(1)}M`, 'Cost Avoided']}
                  />
                  <Bar dataKey="value" fill="oklch(var(--primary))" radius={[0, 4, 4, 0]}>
                    {ROI_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "oklch(var(--critical))" : index === 1 ? "oklch(var(--warn))" : "oklch(var(--cyan))"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
