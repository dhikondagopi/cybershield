import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SevBadge } from "@/components/ui/panel";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import {
  Activity, Cpu, LogIn, TerminalSquare, User, Wifi, ShieldAlert, Plane,
  ArrowUpRight, Radio, Database, Filter, Sparkles, MapPin, ShieldCheck,
  AlertTriangle, Brain, Clock, Target, ChevronRight, X, Zap,
} from "lucide-react";
import {
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, LineChart, Line, RadialBarChart, RadialBar, PolarAngleAxis,
} from "recharts";

export const Route = createFileRoute("/anomalies")({
  head: () => ({
    meta: [
      { title: "Behavioral Anomaly Detection — CyberShield AI" },
      { name: "description", content: "AI-driven behavioral anomaly detection across users, devices, networks, and processes with MITRE ATT&CK mapping." },
    ],
  }),
  component: AnomaliesPage,
});

export function PageHead({ title, desc }: { title: string; desc: string }) {
  return (
    <section className="mb-6">
      <div className="text-xs uppercase tracking-[0.3em] text-cyan mb-1">CyberShield AI</div>
      <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground mt-1 max-w-3xl">{desc}</p>
    </section>
  );
}

// ============ Types & Data ============

type Severity = "Critical" | "High" | "Medium" | "Low";
type Category =
  | "User Behavior" | "Device Behavior" | "Network Behavior" | "Process Behavior"
  | "Login Anomaly" | "Privilege Escalation" | "Impossible Travel"
  | "Lateral Movement" | "Beaconing" | "Data Exfiltration";

interface Anomaly {
  id: string;
  title: string;
  category: Category;
  severity: Severity;
  confidence: number;
  risk: number;
  mitre: { id: string; name: string };
  asset: { name: string; type: "User" | "Device" | "Server" | "Network" };
  location: string;
  rule: string;
  detectedAt: string;
  timeline: { t: string; label: string }[];
  explanation: string;
  action: string;
}

const CATEGORIES: { key: Category; icon: typeof User; hint: string }[] = [
  { key: "User Behavior", icon: User, hint: "UEBA baselines" },
  { key: "Device Behavior", icon: Cpu, hint: "Endpoint drift" },
  { key: "Network Behavior", icon: Wifi, hint: "Flow analytics" },
  { key: "Process Behavior", icon: TerminalSquare, hint: "Exec profiling" },
  { key: "Login Anomaly", icon: LogIn, hint: "Auth patterns" },
  { key: "Privilege Escalation", icon: ShieldAlert, hint: "Role abuse" },
  { key: "Impossible Travel", icon: Plane, hint: "Geo velocity" },
  { key: "Lateral Movement", icon: ArrowUpRight, hint: "East-west" },
  { key: "Beaconing", icon: Radio, hint: "C2 heuristics" },
  { key: "Data Exfiltration", icon: Database, hint: "Egress spikes" },
];

const ANOMALIES: Anomaly[] = [
  {
    id: "AN-4821", title: "Off-hours admin session from unmanaged endpoint",
    category: "User Behavior", severity: "Critical", confidence: 96, risk: 92,
    mitre: { id: "T1078.004", name: "Valid Accounts: Cloud Accounts" },
    asset: { name: "s.adeyemi@corp", type: "User" }, location: "Lagos, NG",
    rule: "UEBA.OffHours.AdminBaseline", detectedAt: "2m ago",
    timeline: [
      { t: "02:14", label: "First anomalous login" },
      { t: "02:16", label: "MFA challenge bypassed via cookie" },
      { t: "02:22", label: "Privileged API keys enumerated" },
    ],
    explanation: "User account exhibits a 4.7σ deviation from its 90-day session baseline. Access originated from an unmanaged macOS device, accompanied by rapid IAM key enumeration typical of credential-theft playbooks.",
    action: "Force MFA re-auth, revoke active sessions, isolate endpoint.",
  },
  {
    id: "AN-4820", title: "EDR-suppressed process spawning encoded PowerShell",
    category: "Process Behavior", severity: "Critical", confidence: 94, risk: 89,
    mitre: { id: "T1059.001", name: "Command and Scripting Interpreter: PowerShell" },
    asset: { name: "WIN-FIN-042", type: "Device" }, location: "Frankfurt, DE",
    rule: "Process.Encoded.Powershell.v3", detectedAt: "8m ago",
    timeline: [
      { t: "01:58", label: "svchost.exe → powershell.exe" },
      { t: "01:58", label: "Base64 command length 8,192" },
      { t: "01:59", label: "Outbound TLS to rare ASN" },
    ],
    explanation: "Process tree anomaly detected: a system service invoked an encoded PowerShell payload that then established C2. Sequence matches 3 known intrusion sets tracked by threat intel.",
    action: "Kill process tree, quarantine host, capture memory image.",
  },
  {
    id: "AN-4819", title: "Impossible travel: London → Singapore in 11 minutes",
    category: "Impossible Travel", severity: "High", confidence: 99, risk: 85,
    mitre: { id: "T1078", name: "Valid Accounts" },
    asset: { name: "j.okafor@corp", type: "User" }, location: "London → Singapore",
    rule: "GeoVelocity.Physics.Kmh", detectedAt: "14m ago",
    timeline: [
      { t: "01:40", label: "Auth from LHR (203.0.113.11)" },
      { t: "01:51", label: "Auth from SIN (198.51.100.6)" },
      { t: "01:52", label: "Sensitive Sharepoint file downloaded" },
    ],
    explanation: "Two successful authentications 10,860 km apart within 11 minutes — a physically impossible velocity of ≈59,000 km/h. Both IPs resolve to residential proxies frequently used by APT actors.",
    action: "Revoke tokens, require identity verification, review file access.",
  },
  {
    id: "AN-4818", title: "SMB lateral movement to 14 finance workstations",
    category: "Lateral Movement", severity: "High", confidence: 91, risk: 87,
    mitre: { id: "T1021.002", name: "Remote Services: SMB/Windows Admin Shares" },
    asset: { name: "10.14.22.0/24", type: "Network" }, location: "New York, US",
    rule: "Lateral.SMB.Fanout", detectedAt: "22m ago",
    timeline: [
      { t: "01:20", label: "First SMB session from WIN-FIN-042" },
      { t: "01:24", label: "Auth to 8 hosts in 60s" },
      { t: "01:31", label: "Admin$ writes on 14 hosts" },
    ],
    explanation: "One workstation authenticated to 14 peers via SMB Admin$ in under 12 minutes — a 22× deviation from segment baseline. Consistent with hands-on-keyboard operator or ransomware pre-staging.",
    action: "Segment VLAN, disable local admin, hunt for staged binaries.",
  },
  {
    id: "AN-4817", title: "Periodic 60-second beacon to newly registered domain",
    category: "Beaconing", severity: "High", confidence: 88, risk: 78,
    mitre: { id: "T1071.001", name: "Application Layer Protocol: Web Protocols" },
    asset: { name: "MAC-DEV-118", type: "Device" }, location: "Berlin, DE",
    rule: "Network.Beacon.JitterFFT", detectedAt: "38m ago",
    timeline: [
      { t: "00:44", label: "First HTTPS to cdn-metric[.]xyz" },
      { t: "01:44", label: "38 identical POSTs, ±2s jitter" },
      { t: "01:46", label: "Domain age: 3 days" },
    ],
    explanation: "FFT analysis of egress intervals shows a dominant 60s frequency (0.0166 Hz) with <3% jitter — a textbook C2 heartbeat. Destination registered via bulletproof registrar 72h ago.",
    action: "Block domain, PCAP capture, EDR sweep on host.",
  },
  {
    id: "AN-4816", title: "Sudden 4.2 GB S3 egress to personal Dropbox",
    category: "Data Exfiltration", severity: "Critical", confidence: 93, risk: 90,
    mitre: { id: "T1567.002", name: "Exfiltration to Cloud Storage" },
    asset: { name: "m.olatunji@corp", type: "User" }, location: "Toronto, CA",
    rule: "DLP.CloudEgress.Volume", detectedAt: "51m ago",
    timeline: [
      { t: "00:30", label: "S3 ListBucket on 12 buckets" },
      { t: "00:41", label: "4.2 GB GET stream begins" },
      { t: "01:07", label: "Upload to dropbox.com/u/…" },
    ],
    explanation: "Volume 71× the user's 30-day median. Transfer window aligns with resignation notice submitted 2 days ago — Insider Risk score elevated.",
    action: "Block egress, legal hold, quarantine mailbox and endpoint.",
  },
  {
    id: "AN-4815", title: "Sudden sudo → root escalation on prod database host",
    category: "Privilege Escalation", severity: "Critical", confidence: 90, risk: 88,
    mitre: { id: "T1548.003", name: "Abuse Elevation: Sudo and Sudo Caching" },
    asset: { name: "db-prod-07", type: "Server" }, location: "us-east-1",
    rule: "Linux.Sudo.OutOfBand", detectedAt: "1h ago",
    timeline: [
      { t: "00:12", label: "SSH from jumphost as svc_backup" },
      { t: "00:13", label: "sudo -i (no ticket)" },
      { t: "00:15", label: "cat /etc/shadow" },
    ],
    explanation: "Service account escalated to root without an approved change ticket. Reads /etc/shadow within 90 seconds — pattern seen in 6 previous confirmed compromises.",
    action: "Suspend account, rotate credentials, forensic image.",
  },
  {
    id: "AN-4814", title: "New device fingerprint on VPN with valid credentials",
    category: "Device Behavior", severity: "Medium", confidence: 82, risk: 64,
    mitre: { id: "T1200", name: "Hardware Additions" },
    asset: { name: "unknown-device-19af", type: "Device" }, location: "Nairobi, KE",
    rule: "Device.NewFingerprint.VPN", detectedAt: "1h ago",
    timeline: [
      { t: "23:50", label: "TLS fingerprint unseen in 180d" },
      { t: "23:51", label: "Auth as k.mensah@corp" },
      { t: "23:52", label: "No MDM enrollment" },
    ],
    explanation: "Client TLS/JA3 fingerprint never observed before for this identity. Absence of MDM enrollment suggests personal or BYOD device connecting to corporate VPN.",
    action: "Require device enrollment, restrict to limited-access zone.",
  },
  {
    id: "AN-4813", title: "Login velocity spike — 43 failed attempts across 12 accounts",
    category: "Login Anomaly", severity: "High", confidence: 87, risk: 74,
    mitre: { id: "T1110.003", name: "Brute Force: Password Spraying" },
    asset: { name: "sso.corp.io", type: "Server" }, location: "Multiple",
    rule: "Auth.PasswordSpray.Cluster", detectedAt: "2h ago",
    timeline: [
      { t: "23:00", label: "Failures begin from Tor exit" },
      { t: "23:05", label: "Spray across 12 accounts, 1 pw each" },
      { t: "23:07", label: "1 success on legacy account" },
    ],
    explanation: "Low-and-slow spray pattern targeting single-factor legacy accounts. TTP consistent with initial-access broker activity monitored via threat intel feeds.",
    action: "Enable adaptive MFA, decommission legacy auth, block source ASNs.",
  },
  {
    id: "AN-4812", title: "Unusual DNS entropy from internal DNS resolver",
    category: "Network Behavior", severity: "Medium", confidence: 79, risk: 61,
    mitre: { id: "T1071.004", name: "Application Layer Protocol: DNS" },
    asset: { name: "dns-int-02", type: "Server" }, location: "eu-west-1",
    rule: "DNS.HighEntropy.Tunneling", detectedAt: "3h ago",
    timeline: [
      { t: "22:00", label: "Shannon entropy > 4.2 on subdomains" },
      { t: "22:12", label: "1,240 TXT lookups to *.dnst[.]link" },
      { t: "22:20", label: "Query volume +380% baseline" },
    ],
    explanation: "Entropy and volume signatures consistent with DNS tunneling. Domain reputation is neutral but query pattern strongly suggests covert exfiltration channel.",
    action: "Sinkhole domain, correlate to source host, packet capture.",
  },
];

const HEATMAP = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 24 }, (_, h) => ({
    d, h,
    v: Math.max(0, Math.round(
      6 + 4 * Math.sin((h - 3) / 3.5) + (h >= 22 || h <= 4 ? 6 : 0) +
      (d === 5 || d === 6 ? -2 : 0) + (Math.random() * 6 - 3)
    )),
  }))
);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TIMELINE_DATA = Array.from({ length: 24 }, (_, h) => ({
  hour: `${String(h).padStart(2, "0")}:00`,
  Critical: Math.round(1 + Math.abs(Math.sin(h / 3)) * 3 + (h > 22 ? 3 : 0)),
  High: Math.round(2 + Math.abs(Math.cos(h / 4)) * 4),
  Medium: Math.round(3 + Math.abs(Math.sin(h / 5)) * 5),
  Low: Math.round(4 + Math.abs(Math.cos(h / 6)) * 6),
}));

const TREND_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  baseline: 12 + Math.round(Math.sin(i / 4) * 3),
  observed: 12 + Math.round(Math.sin(i / 4) * 3) + Math.round(Math.random() * 8) + (i > 22 ? i - 22 : 0),
}));

const GEO_POINTS = [
  { city: "Lagos", x: 52, y: 58, count: 14, sev: "Critical" as const },
  { city: "London", x: 48, y: 32, count: 22, sev: "High" as const },
  { city: "Frankfurt", x: 52, y: 33, count: 18, sev: "Critical" as const },
  { city: "Singapore", x: 78, y: 58, count: 9, sev: "High" as const },
  { city: "New York", x: 26, y: 40, count: 27, sev: "High" as const },
  { city: "Toronto", x: 24, y: 36, count: 6, sev: "Critical" as const },
  { city: "Nairobi", x: 58, y: 62, count: 5, sev: "Medium" as const },
  { city: "Berlin", x: 53, y: 32, count: 11, sev: "High" as const },
  { city: "São Paulo", x: 32, y: 72, count: 4, sev: "Medium" as const },
  { city: "Sydney", x: 88, y: 78, count: 3, sev: "Low" as const },
];

const TOP_USERS = [
  { name: "s.adeyemi@corp", role: "SRE Admin", score: 92, delta: "+38", anomalies: 6 },
  { name: "j.okafor@corp", role: "Finance", score: 85, delta: "+21", anomalies: 4 },
  { name: "m.olatunji@corp", role: "Data Eng", score: 90, delta: "+44", anomalies: 5 },
  { name: "svc_backup", role: "Service Acct", score: 88, delta: "+29", anomalies: 3 },
  { name: "k.mensah@corp", role: "Sales", score: 64, delta: "+12", anomalies: 2 },
];

const TOP_DEVICES = [
  { name: "WIN-FIN-042", os: "Windows 11", score: 89, delta: "+31", anomalies: 5 },
  { name: "db-prod-07", os: "Ubuntu 22.04", score: 88, delta: "+27", anomalies: 3 },
  { name: "MAC-DEV-118", os: "macOS 14", score: 78, delta: "+18", anomalies: 4 },
  { name: "dns-int-02", os: "Debian 12", score: 61, delta: "+9", anomalies: 2 },
  { name: "unknown-device-19af", os: "Unknown", score: 64, delta: "+22", anomalies: 1 },
];

// ============ Utility ============

const sevTone = (s: Severity) =>
  s === "Critical" ? "critical" : s === "High" ? "warn" : s === "Medium" ? "cyan" : "success";
const sevColor = (s: Severity) =>
  s === "Critical" ? "oklch(0.65 0.26 20)" :
  s === "High" ? "oklch(0.80 0.17 75)" :
  s === "Medium" ? "oklch(0.82 0.16 210)" : "oklch(0.75 0.18 155)";
const heatColor = (v: number) => {
  const t = Math.min(1, v / 18);
  const l = 0.28 + t * 0.42;
  const c = 0.05 + t * 0.22;
  const h = 260 - t * 40;
  return `oklch(${l} ${c} ${h})`;
};

// ============ Page ============

function AnomaliesPage() {
  const [range, setRange] = useState<"1h" | "24h" | "7d" | "30d">("24h");
  const [severity, setSeverity] = useState<"All" | Severity>("All");
  const [assetType, setAssetType] = useState<"All" | Anomaly["asset"]["type"]>("All");
  const [userFilter, setUserFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selected, setSelected] = useState<Anomaly | null>(null);
  const [contained, setContained] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    return ANOMALIES.filter(a =>
      (severity === "All" || a.severity === severity) &&
      (assetType === "All" || a.asset.type === assetType) &&
      (!userFilter || a.asset.name.toLowerCase().includes(userFilter.toLowerCase())) &&
      (!locationFilter || a.location.toLowerCase().includes(locationFilter.toLowerCase()))
    );
  }, [severity, assetType, userFilter, locationFilter]);

  const categoryCounts = useMemo(() => {
    const map = new Map<Category, number>();
    for (const c of CATEGORIES) map.set(c.key, 0);
    for (const a of ANOMALIES) map.set(a.category, (map.get(a.category) ?? 0) + 1);
    return map;
  }, []);

  const kpis = [
    { label: "Active anomalies", value: filtered.length, tone: "cyan", icon: Activity },
    { label: "Critical", value: filtered.filter(a => a.severity === "Critical").length, tone: "critical", icon: AlertTriangle },
    { label: "Avg. confidence", value: `${Math.round(filtered.reduce((s, a) => s + a.confidence, 0) / Math.max(1, filtered.length))}%`, tone: "neon", icon: Brain },
    { label: "Contained (24h)", value: Object.values(contained).filter(Boolean).length + 7, tone: "success", icon: ShieldCheck },
  ] as const;

  return (
    <AppShell>
      {/* ============ Header ============ */}
      <motion.section
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }} className="mb-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-cyan mb-1 flex items-center gap-2">
              <Sparkles className="h-3 w-3" /> CyberShield UEBA · SOC Console
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Behavioral Anomaly Detection</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
              Unsupervised ML and graph analytics score deviations across users, devices, networks, and processes — mapped to MITRE ATT&CK with autonomous containment.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground mr-1">Range</span>
            {(["1h", "24h", "7d", "30d"] as const).map(r => (
              <button
                key={r} onClick={() => setRange(r)}
                className={`h-8 px-3 rounded-lg text-xs font-semibold transition-all ${
                  range === r ? "bg-gradient-to-r from-primary to-neon text-primary-foreground shadow-[0_0_20px_oklch(0.72_0.22_300/0.4)]" : "glass hover:bg-white/10"
                }`}
              >{r}</button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ============ KPIs ============ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.35 }}
          >
            <Panel className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl grid place-items-center bg-gradient-to-br from-${k.tone}/30 to-${k.tone}/10`}>
                  <k.icon className={`h-5 w-5 text-${k.tone}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{k.label}</div>
                  <div className="text-2xl font-bold font-mono leading-tight">{k.value}</div>
                </div>
              </div>
            </Panel>
          </motion.div>
        ))}
      </div>

      {/* ============ Category strip ============ */}
      <Panel className="mb-4">
        <PanelHeader title="Detection Domains" subtitle="Ten anomaly classes actively monitored across the estate" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((c, i) => (
            <motion.button
              key={c.key}
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.03 * i }}
              whileHover={{ y: -3 }}
              className="text-left glass rounded-xl p-3 hover:neon-border transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/30 to-cyan/20 grid place-items-center">
                  <c.icon className="h-4 w-4 text-cyan" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate">{c.key}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{c.hint}</div>
                </div>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <div className="text-xl font-bold font-mono">{categoryCounts.get(c.key) ?? 0}</div>
                <div className="text-[10px] text-muted-foreground">signals</div>
              </div>
            </motion.button>
          ))}
        </div>
      </Panel>

      {/* ============ Filters ============ */}
      <Panel className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Filter className="h-4 w-4 text-cyan" /> <span className="uppercase tracking-widest">Filters</span>
          </div>
          <Segmented
            label="Severity"
            options={["All", "Critical", "High", "Medium", "Low"]}
            value={severity} onChange={(v) => setSeverity(v as typeof severity)}
          />
          <Segmented
            label="Asset"
            options={["All", "User", "Device", "Server", "Network"]}
            value={assetType} onChange={(v) => setAssetType(v as typeof assetType)}
          />
          <input
            value={userFilter} onChange={(e) => setUserFilter(e.target.value)}
            placeholder="User / asset name"
            className="h-9 px-3 rounded-lg bg-white/5 border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/60 w-48"
          />
          <input
            value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Location"
            className="h-9 px-3 rounded-lg bg-white/5 border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/60 w-40"
          />
          <div className="ml-auto text-xs text-muted-foreground">
            <span className="font-mono text-foreground">{filtered.length}</span> of {ANOMALIES.length} anomalies
          </div>
        </div>
      </Panel>

      {/* ============ Charts row 1 ============ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <Panel className="xl:col-span-2">
          <PanelHeader
            title="Anomaly Timeline (last 24h)"
            subtitle="Stacked by severity · UTC"
            right={<Legend items={[
              { c: "oklch(0.65 0.26 20)", l: "Critical" },
              { c: "oklch(0.80 0.17 75)", l: "High" },
              { c: "oklch(0.82 0.16 210)", l: "Medium" },
              { c: "oklch(0.75 0.18 155)", l: "Low" },
            ]} />}
          />
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={TIMELINE_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  {(["Critical", "High", "Medium", "Low"] as const).map(s => (
                    <linearGradient key={s} id={`tl-${s}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={sevColor(s)} stopOpacity={0.6} />
                      <stop offset="100%" stopColor={sevColor(s)} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis dataKey="hour" stroke="oklch(0.7 0.02 260)" fontSize={10} tickLine={false} axisLine={false} interval={3} />
                <YAxis stroke="oklch(0.7 0.02 260)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.03 260 / 0.95)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12, fontSize: 12 }} />
                {(["Low", "Medium", "High", "Critical"] as const).map(s => (
                  <Area key={s} type="monotone" dataKey={s} stackId="1" stroke={sevColor(s)} strokeWidth={1.5} fill={`url(#tl-${s})`} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Behavior Trend vs Baseline" subtitle="Observed anomalies vs learned baseline (30d)" />
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={TREND_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis dataKey="day" stroke="oklch(0.7 0.02 260)" fontSize={10} tickLine={false} axisLine={false} interval={4} />
                <YAxis stroke="oklch(0.7 0.02 260)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.03 260 / 0.95)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="baseline" stroke="oklch(0.7 0.02 260)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="observed" stroke="oklch(0.72 0.22 300)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* ============ Heatmap + Geo ============ */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <Panel>
          <PanelHeader title="Behavior Heatmap" subtitle="Anomaly density · day of week × hour of day" />
          <div className="overflow-x-auto">
            <div className="min-w-[560px]">
              <div className="flex text-[9px] text-muted-foreground pl-8 mb-1">
                {Array.from({ length: 24 }, (_, h) => (
                  <div key={h} className="flex-1 text-center">{h % 3 === 0 ? h : ""}</div>
                ))}
              </div>
              {HEATMAP.map((row, di) => (
                <div key={di} className="flex items-center gap-1 mb-1">
                  <div className="w-8 text-[10px] text-muted-foreground">{DAYS[di]}</div>
                  {row.map((cell, hi) => (
                    <motion.div
                      key={hi}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: (di * 24 + hi) * 0.003 }}
                      className="flex-1 h-6 rounded-sm relative group cursor-pointer"
                      style={{ background: heatColor(cell.v) }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] px-2 py-1 rounded bg-popover border border-border font-mono z-10">
                        {DAYS[di]} {String(hi).padStart(2, "0")}:00 · {cell.v}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
              <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
                <span>low</span>
                <div className="flex h-2 flex-1 rounded overflow-hidden">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} className="flex-1" style={{ background: heatColor(i) }} />
                  ))}
                </div>
                <span>high</span>
              </div>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Geo Distribution" subtitle="Origin of anomalous events" right={<span className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3 text-cyan" /> 10 hotspots</span>} />
          <div className="relative h-64 rounded-xl overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-cyan/5 border border-white/5">
            <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full opacity-30">
              {/* stylized continent blobs */}
              <path d="M8,22 Q18,15 30,20 T44,26 L42,38 Q32,42 22,38 T8,32 Z" fill="oklch(0.4 0.05 260)" />
              <path d="M46,18 Q56,12 66,18 T76,20 L74,30 Q64,34 54,30 T46,28 Z" fill="oklch(0.4 0.05 260)" />
              <path d="M48,32 Q56,30 60,40 T58,52 L52,54 Q46,50 46,42 Z" fill="oklch(0.4 0.05 260)" />
              <path d="M70,32 Q80,28 88,38 T92,52 L84,54 Q76,50 72,42 Z" fill="oklch(0.4 0.05 260)" />
              <path d="M20,42 Q28,40 34,48 T30,58 L22,58 Q16,52 18,46 Z" fill="oklch(0.4 0.05 260)" />
            </svg>
            {GEO_POINTS.map((p, i) => (
              <motion.div
                key={p.city}
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.06 * i, type: "spring", stiffness: 220, damping: 18 }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ background: sevColor(p.sev), opacity: 0.4 }} />
                <span
                  className="relative block rounded-full border border-white/40"
                  style={{
                    width: 8 + Math.min(20, p.count),
                    height: 8 + Math.min(20, p.count),
                    background: sevColor(p.sev),
                    boxShadow: `0 0 14px ${sevColor(p.sev)}`,
                  }}
                />
                <div className="opacity-0 group-hover:opacity-100 transition absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] px-2 py-1 rounded bg-popover border border-border font-mono z-10">
                  {p.city} · {p.count} events · {p.sev}
                </div>
              </motion.div>
            ))}
          </div>
        </Panel>
      </div>

      {/* ============ Top risky users/devices ============ */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <RiskyList title="Top Risky Users" subtitle="Ranked by composite risk score" rows={TOP_USERS} kind="user" />
        <RiskyList title="Top Risky Devices" subtitle="Endpoints with sustained behavioral drift" rows={TOP_DEVICES} kind="device" />
      </div>

      {/* ============ Anomaly list ============ */}
      <Panel>
        <PanelHeader
          title="Live Anomalies"
          subtitle={`Sorted by confidence × risk — ${filtered.length} active`}
          right={<span className="text-[10px] text-muted-foreground flex items-center gap-1"><Zap className="h-3 w-3 text-neon" /> auto-refresh 30s</span>}
        />
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filtered.map((a, i) => {
              const CIcon = CATEGORIES.find(c => c.key === a.category)?.icon ?? Activity;
              const isContained = contained[a.id];
              return (
                <motion.div
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                >
                  <div className="glass rounded-xl p-4 flex flex-col lg:flex-row lg:items-center gap-4 hover:neon-border transition-all">
                    <div className="flex items-center gap-3 lg:w-72 shrink-0">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-neon/30 to-primary/20 grid place-items-center">
                          <CIcon className="h-5 w-5 text-neon" />
                        </div>
                        {a.severity === "Critical" && !isContained && (
                          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-critical animate-pulse-ring" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <SevBadge sev={a.severity} />
                          <span className="text-[10px] font-mono text-muted-foreground">{a.id}</span>
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{a.category}</div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-medium leading-snug">{a.title}</div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Target className="h-3 w-3 text-cyan" /><span className="font-mono text-foreground">{a.mitre.id}</span> {a.mitre.name}</span>
                        <span className="flex items-center gap-1"><User className="h-3 w-3 text-cyan" />{a.asset.name}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-cyan" />{a.location}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-cyan" />{a.detectedAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Meter label="Confidence" value={a.confidence} tone="cyan" />
                      <Meter label="Risk" value={a.risk} tone={a.risk > 80 ? "critical" : a.risk > 65 ? "warn" : "cyan"} />
                      <button
                        onClick={() => setSelected(a)}
                        className="h-9 px-3 rounded-lg glass hover:bg-white/10 text-xs font-semibold flex items-center gap-1"
                      >Investigate <ChevronRight className="h-3 w-3" /></button>
                      <button
                        onClick={() => setContained(c => ({ ...c, [a.id]: !c[a.id] }))}
                        className={`h-9 px-3 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                          isContained
                            ? "bg-success/20 text-success border border-success/30"
                            : "bg-gradient-to-r from-primary to-neon text-primary-foreground hover:opacity-90 shadow-[0_0_18px_oklch(0.72_0.22_300/0.4)]"
                        }`}
                      >
                        <ShieldCheck className="h-3 w-3" />
                        {isContained ? "Contained" : "Contain"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-sm text-muted-foreground">
              No anomalies match the current filters.
            </div>
          )}
        </div>
      </Panel>

      {/* ============ Detail Drawer ============ */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSelected(null)}
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full sm:w-[520px] z-50 glass-strong border-l border-border overflow-y-auto"
            >
              <DetailDrawer anomaly={selected} onClose={() => setSelected(null)}
                contained={!!contained[selected.id]}
                onContain={() => setContained(c => ({ ...c, [selected.id]: !c[selected.id] }))}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </AppShell>
  );
}

// ============ Sub components ============

function Segmented({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground mr-1">{label}</span>
      <div className="flex glass rounded-lg p-0.5">
        {options.map(o => (
          <button
            key={o} onClick={() => onChange(o)}
            className={`h-7 px-2.5 rounded-md text-[11px] font-semibold transition-all ${
              value === o ? "bg-gradient-to-r from-primary/40 to-cyan/30 text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >{o}</button>
        ))}
      </div>
    </div>
  );
}

function Meter({ label, value, tone }: { label: string; value: number; tone: "cyan" | "warn" | "critical" }) {
  const color = tone === "cyan" ? "oklch(0.82 0.16 210)" : tone === "warn" ? "oklch(0.80 0.17 75)" : "oklch(0.65 0.26 20)";
  return (
    <div className="w-24 hidden md:block">
      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
        <span>{label}</span><span className="font-mono text-foreground">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}` }}
        />
      </div>
    </div>
  );
}

function Legend({ items }: { items: { c: string; l: string }[] }) {
  return (
    <div className="flex items-center gap-3">
      {items.map(i => (
        <div key={i.l} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: i.c, boxShadow: `0 0 6px ${i.c}` }} />
          {i.l}
        </div>
      ))}
    </div>
  );
}

function RiskyList({ title, subtitle, rows, kind }: {
  title: string; subtitle: string;
  rows: { name: string; score: number; delta: string; anomalies: number; role?: string; os?: string }[];
  kind: "user" | "device";
}) {
  return (
    <Panel>
      <PanelHeader title={title} subtitle={subtitle} />
      <div className="space-y-2">
        {rows.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.04 * i }}
            className="flex items-center gap-3 glass rounded-lg p-3 hover:bg-white/5 transition"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/40 to-cyan/30 grid place-items-center text-[10px] font-bold">
              {r.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{r.name}</div>
              <div className="text-[10px] text-muted-foreground truncate">{kind === "user" ? r.role : r.os} · {r.anomalies} anomalies</div>
            </div>
            <div className="w-24">
              <ResponsiveContainer width="100%" height={28}>
                <BarChart data={Array.from({ length: 10 }, (_, k) => ({ v: 2 + ((k * 7 + r.score) % 9) }))}>
                  <Bar dataKey="v" fill={r.score > 85 ? "oklch(0.65 0.26 20)" : "oklch(0.80 0.17 75)"} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-right w-16">
              <div className={`text-lg font-bold font-mono ${r.score > 85 ? "text-critical" : "text-warn"}`}>{r.score}</div>
              <div className="text-[10px] text-success">{r.delta}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Panel>
  );
}

function DetailDrawer({ anomaly, onClose, contained, onContain }: {
  anomaly: Anomaly; onClose: () => void; contained: boolean; onContain: () => void;
}) {
  const gauge = [{ name: "risk", value: anomaly.risk, fill: sevColor(anomaly.severity) }];
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-cyan mb-1">Anomaly Investigation</div>
          <h2 className="text-xl font-bold leading-tight">{anomaly.title}</h2>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <SevBadge sev={anomaly.severity} />
            <span className="text-[10px] font-mono text-muted-foreground">{anomaly.id}</span>
            <span className="text-[10px] text-muted-foreground">· {anomaly.category}</span>
          </div>
        </div>
        <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg glass hover:bg-white/10">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-3 col-span-1 flex flex-col items-center">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Risk</div>
          <div className="h-24 w-24 relative">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={gauge} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background={{ fill: "oklch(1 0 0 / 6%)" }} dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center text-lg font-bold font-mono">{anomaly.risk}</div>
          </div>
        </div>
        <div className="glass rounded-xl p-3 col-span-2 space-y-2">
          <MetaRow k="Confidence" v={`${anomaly.confidence}%`} />
          <MetaRow k="MITRE" v={`${anomaly.mitre.id} · ${anomaly.mitre.name}`} />
          <MetaRow k="Asset" v={`${anomaly.asset.name} (${anomaly.asset.type})`} />
          <MetaRow k="Location" v={anomaly.location} />
          <MetaRow k="Detection rule" v={anomaly.rule} mono />
          <MetaRow k="Detected" v={anomaly.detectedAt} />
        </div>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-4 w-4 text-neon" />
          <div className="text-xs font-semibold uppercase tracking-widest">AI Explanation</div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{anomaly.explanation}</p>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-cyan" />
          <div className="text-xs font-semibold uppercase tracking-widest">Timeline</div>
        </div>
        <ol className="relative border-l border-white/10 ml-2 space-y-3">
          {anomaly.timeline.map((t, i) => (
            <li key={i} className="pl-4 relative">
              <span className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-cyan shadow-[0_0_8px_oklch(0.82_0.16_210)]" />
              <div className="text-[10px] font-mono text-muted-foreground">{t.t}</div>
              <div className="text-xs">{t.label}</div>
            </li>
          ))}
        </ol>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="h-4 w-4 text-warn" />
          <div className="text-xs font-semibold uppercase tracking-widest">Recommended Action</div>
        </div>
        <p className="text-sm">{anomaly.action}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onContain}
          className={`flex-1 h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            contained
              ? "bg-success/20 text-success border border-success/30"
              : "bg-gradient-to-r from-primary to-neon text-primary-foreground shadow-[0_0_22px_oklch(0.72_0.22_300/0.5)] hover:opacity-90"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          {contained ? "Threat Contained" : "Contain Threat"}
        </button>
        <button className="h-11 px-4 rounded-xl glass hover:bg-white/10 text-sm font-semibold">
          Assign to analyst
        </button>
      </div>
    </div>
  );
}

function MetaRow({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-xs">
      <span className="text-muted-foreground uppercase tracking-widest text-[10px] shrink-0">{k}</span>
      <span className={`text-right ${mono ? "font-mono" : ""}`}>{v}</span>
    </div>
  );
}
