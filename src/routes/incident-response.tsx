import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SevBadge } from "@/components/ui/panel";
import { PageHead } from "./anomalies";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Siren, Plus, FileText, Brain, Shield, Server, User as UserIcon, Globe,
  Bug, Network as NetIcon, Skull, Terminal, Database, Radio, KeyRound,
  Ban, PowerOff, UserX, ShieldOff, Zap, FileLock, RotateCcw, BellRing,
  Clock, Filter, Search, ChevronRight, X, CheckCircle2, AlertTriangle,
  Activity, Target, Layers, Fingerprint, MapPin, HardDrive, Cpu,
  FileCode, FileImage, FileArchive, Camera, Waves, Download, Sparkles,
  MessageSquare, Paperclip, ListChecks, ClipboardList, History, Loader2,
} from "lucide-react";

export const Route = createFileRoute("/incident-response")({
  head: () => ({
    meta: [
      { title: "Incident Response Center — CyberShield AI" },
      { name: "description", content: "Monitor, investigate, contain, and resolve security incidents in real time with AI-driven investigation, MITRE ATT&CK mapping, and SOAR containment." },
      { property: "og:title", content: "Incident Response Center — CyberShield AI" },
      { property: "og:description", content: "Real-time enterprise incident response, AI investigation, forensic timeline, and containment orchestration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IncidentResponsePage,
});

// ============ Types & Data ============
type Sev = "Critical" | "High" | "Medium" | "Low";
type Status = "Open" | "Investigating" | "Contained" | "Resolved";

interface Incident {
  id: string;
  title: string;
  severity: Sev;
  mitre: { id: string; name: string };
  asset: string;
  status: Status;
  analyst: string;
  detected: string;
  responseMin: number;
  confidence: number;
  summary: string;
  users: string[];
  devices: string[];
  ips: string[];
  domains: string[];
  malware: string[];
  killchain: { phase: string; t: string; detail: string; status: string }[];
  iocs: { type: string; value: string; tag: string }[];
  rootCause: string;
  businessImpact: string;
}

const INCIDENTS: Incident[] = [
  {
    id: "INC-2041",
    title: "Ransomware Outbreak — Finance Segment",
    severity: "Critical",
    mitre: { id: "T1486", name: "Data Encrypted for Impact" },
    asset: "srv-db-prod-3",
    status: "Investigating",
    analyst: "S. Adeyemi",
    detected: "12:04:22",
    responseMin: 3,
    confidence: 96,
    summary: "LockBit 4.0 attempted deployment following Cobalt Strike beacon and Kerberoasting. Encryption prevented on 14 devices; 42 GB at risk.",
    users: ["kchen", "finance-svc", "backup-admin"],
    devices: ["srv-db-prod-3", "srv-app-04", "wks-ops-19", "+11"],
    ips: ["45.61.187.9", "194.31.55.12", "185.220.101.44"],
    domains: ["cdn-update-microsft.co", "invoice-secure-portal.top"],
    malware: ["LockBit 4.0", "Cobalt Strike Beacon", "Mimikatz"],
    killchain: [
      { phase: "Reconnaissance", t: "T-96h", detail: "Port scan across DMZ from 194.31.55.12", status: "logged" },
      { phase: "Initial Access", t: "T-72h", detail: "Spear-phish to finance@corp", status: "blocked" },
      { phase: "Execution", t: "T-48h", detail: "Encoded PowerShell on wks-ops-19", status: "detected" },
      { phase: "Persistence", t: "T-46h", detail: "Scheduled task 'WinUpd' created", status: "detected" },
      { phase: "Privilege Escalation", t: "T-24h", detail: "SeDebugPrivilege token impersonation", status: "detected" },
      { phase: "Credential Access", t: "T-18h", detail: "LSASS dump via comsvcs.dll", status: "contained" },
      { phase: "Lateral Movement", t: "T-6h", detail: "PSExec to srv-app-04", status: "contained" },
      { phase: "Exfiltration", t: "T-2h", detail: "DNS tunneling to cdn-update-microsft.co", status: "blocked" },
      { phase: "Impact", t: "Now", detail: "Encryption attempt on srv-db-prod-3", status: "prevented" },
    ],
    iocs: [
      { type: "IP", value: "45.61.187.9", tag: "Cobalt Strike C2" },
      { type: "Domain", value: "cdn-update-microsft.co", tag: "DNS Tunnel" },
      { type: "Hash", value: "a3f5…d7c1", tag: "LockBit 4.0" },
      { type: "Hash", value: "b19c…4e2a", tag: "Mimikatz" },
    ],
    rootCause: "Compromised finance user opened a weaponized invoice; macro dropped Cobalt Strike beacon, followed by Kerberoasting against dc-01 and lateral movement via PSExec to srv-app-04. Ransomware payload staged on srv-db-prod-3 before endpoint isolation.",
    businessImpact: "Estimated $2.4M avoided loss. 6 finance users temporarily locked out. Backup vault verified intact. Regulator notification (24h SLA) pending.",
  },
  {
    id: "INC-2040",
    title: "APT-29 Style Credential Access",
    severity: "High",
    mitre: { id: "T1558.003", name: "Kerberoasting" },
    asset: "dc-01",
    status: "Investigating",
    analyst: "T. Okafor",
    detected: "11:32:08",
    responseMin: 7,
    confidence: 89,
    summary: "Nation-state TTPs targeting domain controller; SPN enumeration followed by service ticket harvesting.",
    users: ["svc-sql", "svc-backup"],
    devices: ["dc-01", "wks-it-04"],
    ips: ["185.220.101.44"],
    domains: ["msftauth-secure.co"],
    malware: ["Rubeus"],
    killchain: [
      { phase: "Reconnaissance", t: "T-4h", detail: "SPN enumeration via LDAP", status: "detected" },
      { phase: "Credential Access", t: "T-1h", detail: "Kerberoast ticket harvest", status: "contained" },
    ],
    iocs: [{ type: "IP", value: "185.220.101.44", tag: "TOR Exit" }],
    rootCause: "Weak service account passwords allowed offline crack of harvested TGS tickets.",
    businessImpact: "No lateral movement confirmed. 12 service accounts pending forced rotation.",
  },
  {
    id: "INC-2039",
    title: "OT Network Modbus Injection",
    severity: "Critical",
    mitre: { id: "T0836", name: "Modify Parameter" },
    asset: "plc-grid-07",
    status: "Contained",
    analyst: "ICS Team",
    detected: "10:12:41",
    responseMin: 12,
    confidence: 94,
    summary: "Unauthorized Modbus write attempts on substation PLC blocked by ICS firewall rule.",
    users: ["unknown"],
    devices: ["plc-grid-07"],
    ips: ["10.44.9.201"],
    domains: [],
    malware: [],
    killchain: [
      { phase: "Initial Access", t: "T-3h", detail: "Rogue host on OT VLAN", status: "detected" },
      { phase: "Impact", t: "T-2h", detail: "Modbus write blocked", status: "prevented" },
    ],
    iocs: [{ type: "IP", value: "10.44.9.201", tag: "Rogue OT Host" }],
    rootCause: "Contractor laptop bypassed OT segmentation via mis-scoped firewall rule.",
    businessImpact: "Grid stability unaffected. Segmentation rule remediated.",
  },
  {
    id: "INC-2038",
    title: "Phishing Campaign — Executives",
    severity: "Medium",
    mitre: { id: "T1566.002", name: "Spearphishing Link" },
    asset: "user:execs",
    status: "Resolved",
    analyst: "SOC L1",
    detected: "08:44:19",
    responseMin: 22,
    confidence: 82,
    summary: "Targeted spearphishing against 4 executives; 0 clicks, all emails quarantined.",
    users: ["ceo", "cfo", "cio", "coo"],
    devices: [],
    ips: [],
    domains: ["invoice-secure-portal.top"],
    malware: [],
    killchain: [{ phase: "Initial Access", t: "T-5h", detail: "Emails quarantined by MTA", status: "blocked" }],
    iocs: [{ type: "Domain", value: "invoice-secure-portal.top", tag: "Phishing" }],
    rootCause: "Lookalike domain registered 48h prior to campaign.",
    businessImpact: "Zero user impact. Domain sinkholed.",
  },
  {
    id: "INC-2037",
    title: "AWS IAM Privilege Escalation",
    severity: "High",
    mitre: { id: "T1078.004", name: "Cloud Accounts" },
    asset: "aws/eu-west-1",
    status: "Open",
    analyst: "unassigned",
    detected: "07:19:02",
    responseMin: 0,
    confidence: 78,
    summary: "AssumeRole abuse from unusual geolocation; new IAM policy attached to service role.",
    users: ["svc-deploy"],
    devices: [],
    ips: ["102.89.44.7"],
    domains: [],
    malware: [],
    killchain: [{ phase: "Privilege Escalation", t: "T-6h", detail: "AttachRolePolicy: Admin", status: "detected" }],
    iocs: [{ type: "IP", value: "102.89.44.7", tag: "Anomalous ASN" }],
    rootCause: "Leaked long-lived access key via public repo.",
    businessImpact: "Blast radius: staging account only. Prod isolated.",
  },
];

const METRICS = [
  { label: "Open Incidents", value: "12", delta: "+3", tone: "warn", icon: Siren },
  { label: "Critical Incidents", value: "4", delta: "+1", tone: "critical", icon: AlertTriangle },
  { label: "Contained Threats", value: "31", delta: "+7", tone: "success", icon: Shield },
  { label: "Avg Response", value: "3.4m", delta: "-18%", tone: "cyan", icon: Clock },
  { label: "Avg Resolution", value: "27m", delta: "-9%", tone: "cyan", icon: Activity },
  { label: "SLA Compliance", value: "98.6%", delta: "+0.4%", tone: "success", icon: CheckCircle2 },
  { label: "High Priority", value: "9", delta: "-2", tone: "warn", icon: Target },
  { label: "Analyst Workload", value: "72%", delta: "+6%", tone: "neon", icon: UserIcon },
] as const;

const CONTAINMENT = [
  { key: "isolate", icon: PowerOff, label: "Isolate Endpoint", tone: "text-critical", desc: "Cut network for target host" },
  { key: "disable", icon: UserX, label: "Disable User", tone: "text-neon", desc: "Force logoff & disable account" },
  { key: "blockip", icon: Ban, label: "Block IP", tone: "text-cyan", desc: "Push to edge firewall" },
  { key: "blockdomain", icon: Globe, label: "Block Domain", tone: "text-cyan", desc: "Sinkhole via DNS" },
  { key: "kill", icon: Zap, label: "Kill Process", tone: "text-warn", desc: "Terminate PID tree on host" },
  { key: "quarantine", icon: FileLock, label: "Quarantine File", tone: "text-warn", desc: "Move binary to vault" },
  { key: "reset", icon: RotateCcw, label: "Reset Password", tone: "text-neon", desc: "Force credential rotation" },
  { key: "revoke", icon: ShieldOff, label: "Revoke Token", tone: "text-orange-300" as const, desc: "Invalidate active sessions" },
  { key: "notify", icon: BellRing, label: "Notify SOC", tone: "text-primary", desc: "Page on-call analyst" },
  { key: "notes", icon: FileText, label: "Generate Case Notes", tone: "text-success", desc: "AI summary to case" },
];

const AI_STEPS = [
  { key: "lateral", label: "Lateral Movement", icon: NetIcon },
  { key: "logins", label: "Suspicious Logins", icon: KeyRound },
  { key: "privesc", label: "Privilege Escalation", icon: Layers },
  { key: "persist", label: "Persistence", icon: Fingerprint },
  { key: "creds", label: "Credential Dumping", icon: Skull },
  { key: "exec", label: "Command Execution", icon: Terminal },
  { key: "exfil", label: "Data Exfiltration", icon: Waves },
];

const EVIDENCE = [
  { label: "Screenshots", icon: Camera, count: 14, tone: "text-cyan" },
  { label: "Logs", icon: FileCode, count: 2841, tone: "text-primary" },
  { label: "Packets", icon: Waves, count: 12490, tone: "text-neon" },
  { label: "Files", icon: FileImage, count: 46, tone: "text-warn" },
  { label: "Memory Dumps", icon: Cpu, count: 3, tone: "text-critical" },
  { label: "Registry Changes", icon: HardDrive, count: 27, tone: "text-orange-300" },
  { label: "Hashes", icon: Fingerprint, count: 128, tone: "text-success" },
  { label: "Network Traffic", icon: Radio, count: 5321, tone: "text-cyan" },
];

const LIVE_ALERTS = [
  { t: "12:04:22", sev: "Critical", msg: "PowerShell encoded cmd on wks-ops-19" },
  { t: "12:04:15", sev: "High", msg: "IAM escalation on aws/eu-west-1" },
  { t: "12:04:02", sev: "Medium", msg: "Port scan blocked at fw-edge-01" },
  { t: "12:03:41", sev: "High", msg: "Modbus write from unauthorized host" },
  { t: "12:03:19", sev: "Low", msg: "Impossible travel: London → Lagos" },
];

const THREAT_FEED = [
  { src: "MISP", tag: "LockBit 4.0", note: "New affiliate observed in EU" },
  { src: "AlienVault", tag: "APT-29", note: "SPN enumeration campaign" },
  { src: "Recorded Future", tag: "Volt Typhoon", note: "Living-off-the-land uptick" },
  { src: "Mandiant", tag: "Scattered Spider", note: "Helpdesk social engineering" },
];

const APPROVALS = [
  { who: "T. Okafor", what: "Isolate 12 endpoints", inc: "INC-2041" },
  { who: "ICS Team", what: "Firewall rule change", inc: "INC-2039" },
  { who: "SOC L2", what: "Rotate 42 credentials", inc: "INC-2041" },
];

const FORENSIC = [
  { phase: "Detection", icon: Activity, tone: "text-primary" },
  { phase: "Initial Access", icon: Globe, tone: "text-cyan" },
  { phase: "Execution", icon: Terminal, tone: "text-warn" },
  { phase: "Persistence", icon: Fingerprint, tone: "text-warn" },
  { phase: "Lateral Movement", icon: NetIcon, tone: "text-orange-300" },
  { phase: "Privilege Escalation", icon: Layers, tone: "text-critical" },
  { phase: "Collection", icon: Database, tone: "text-neon" },
  { phase: "Exfiltration", icon: Waves, tone: "text-critical" },
  { phase: "Impact", icon: Skull, tone: "text-critical" },
];

// ============ Page ============
function IncidentResponsePage() {
  const [selected, setSelected] = useState<Incident | null>(null);
  const [confirmAction, setConfirmAction] = useState<typeof CONTAINMENT[number] | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const [fSev, setFSev] = useState("All");
  const [fStatus, setFStatus] = useState("All");
  const [fQuery, setFQuery] = useState("");

  const filtered = useMemo(() => {
    return INCIDENTS.filter((i) => {
      if (fSev !== "All" && i.severity !== fSev) return false;
      if (fStatus !== "All" && i.status !== fStatus) return false;
      if (fQuery && !`${i.id} ${i.title} ${i.asset} ${i.analyst} ${i.mitre.id}`.toLowerCase().includes(fQuery.toLowerCase())) return false;
      return true;
    });
  }, [fSev, fStatus, fQuery]);

  return (
    <AppShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHead
          title="Incident Response Center"
          desc="Monitor, investigate, contain, and resolve security incidents in real time."
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCreateOpen(true)}
            className="h-10 px-4 rounded-lg bg-gradient-to-r from-primary to-neon text-primary-foreground text-sm font-semibold flex items-center gap-2 shadow-[0_0_18px_oklch(0.72_0.19_275/0.5)] hover:opacity-90 transition"
          >
            <Plus className="h-4 w-4" /> Create Incident
          </button>
          <button
            onClick={() => setReportOpen(true)}
            className="h-10 px-4 rounded-lg glass border border-border text-sm font-semibold flex items-center gap-2 hover:bg-white/10 transition"
          >
            <FileText className="h-4 w-4" /> Generate Executive Report
          </button>
          <button
            onClick={() => setAiOpen(true)}
            className="h-10 px-4 rounded-lg glass border border-cyan/40 text-sm font-semibold flex items-center gap-2 hover:bg-cyan/10 transition"
          >
            <Brain className="h-4 w-4 text-cyan" /> Run AI Investigation
          </button>
        </div>
      </div>

      {/* Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 mb-4"
      >
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -3 }}
            className="glass rounded-xl p-3 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.label}</span>
              <m.icon className={`h-4 w-4 text-${m.tone} opacity-80`} />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <div className="text-2xl font-bold font-mono">{m.value}</div>
              <div className={`text-[10px] font-semibold text-${m.tone}`}>{m.delta}</div>
            </div>
            <div className={`absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-${m.tone}/10 blur-xl group-hover:bg-${m.tone}/20 transition`} />
          </motion.div>
        ))}
      </motion.div>

      {/* Main grid: table + right sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-4 min-w-0">
          {/* Filters + table */}
          <Panel>
            <PanelHeader
              title="Incident Queue"
              subtitle={`${filtered.length} of ${INCIDENTS.length} incidents · live from SOAR`}
              right={
                <span className="inline-flex items-center gap-1 text-[10px] text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> LIVE
                </span>
              }
            />
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  value={fQuery}
                  onChange={(e) => setFQuery(e.target.value)}
                  placeholder="Search ID, asset, analyst, T-ID…"
                  className="h-9 pl-8 pr-3 rounded-lg bg-white/5 border border-border text-xs w-64 focus:outline-none focus:ring-2 focus:ring-primary/60"
                />
              </div>
              <Select value={fSev} onChange={setFSev} options={["All", "Critical", "High", "Medium", "Low"]} icon={Filter} label="Severity" />
              <Select value={fStatus} onChange={setFStatus} options={["All", "Open", "Investigating", "Contained", "Resolved"]} icon={Filter} label="Status" />
              <Select value="All" onChange={() => {}} options={["All", "Server", "Endpoint", "Cloud", "OT"]} icon={Filter} label="Asset" />
              <Select value="All" onChange={() => {}} options={["All", "S. Adeyemi", "T. Okafor", "ICS Team", "SOC L1"]} icon={Filter} label="Analyst" />
              <Select value="All" onChange={() => {}} options={["All", "T1486", "T1558.003", "T1078.004", "T1566.002"]} icon={Filter} label="MITRE" />
              <Select value="24h" onChange={() => {}} options={["24h", "7d", "30d", "All time"]} icon={Clock} label="Date" />
            </div>

            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-xs min-w-[900px]">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
                    <Th>ID</Th><Th>Title</Th><Th>Sev</Th><Th>MITRE</Th><Th>Asset</Th>
                    <Th>Status</Th><Th>Analyst</Th><Th>Detected</Th><Th>Response</Th><Th>Conf.</Th><Th>Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((i, idx) => (
                    <motion.tr
                      key={i.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => setSelected(i)}
                      className="border-b border-border/60 hover:bg-white/5 cursor-pointer transition"
                    >
                      <Td><span className="font-mono text-cyan">{i.id}</span></Td>
                      <Td className="font-medium">{i.title}</Td>
                      <Td><SevBadge sev={i.severity} /></Td>
                      <Td><span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-border">{i.mitre.id}</span></Td>
                      <Td className="font-mono text-[11px] text-muted-foreground">{i.asset}</Td>
                      <Td><SevBadge sev={i.status} /></Td>
                      <Td>{i.analyst}</Td>
                      <Td className="font-mono text-[11px] text-muted-foreground">{i.detected}</Td>
                      <Td className="font-mono">{i.responseMin ? `${i.responseMin}m` : "—"}</Td>
                      <Td>
                        <div className="flex items-center gap-1">
                          <div className="h-1 w-10 rounded-full bg-white/10 overflow-hidden">
                            <div className={`h-full ${i.confidence > 90 ? "bg-critical" : i.confidence > 80 ? "bg-warn" : "bg-cyan"}`} style={{ width: `${i.confidence}%` }} />
                          </div>
                          <span className="font-mono">{i.confidence}</span>
                        </div>
                      </Td>
                      <Td>
                        <button className="text-cyan hover:text-primary flex items-center gap-0.5 text-[11px]">
                          Open <ChevronRight className="h-3 w-3" />
                        </button>
                      </Td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          {/* AI Investigation */}
          <Panel>
            <PanelHeader
              title="AI Investigation"
              subtitle="Autonomous threat correlation across telemetry"
              right={
                <button
                  onClick={() => setAiOpen(true)}
                  className="text-xs px-3 py-1.5 rounded-md bg-gradient-to-r from-primary/80 to-neon/80 text-primary-foreground font-semibold flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" /> Generate AI Explanation
                </button>
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
              <div className="glass rounded-xl p-4">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Investigation Progress</div>
                <div className="mt-2 text-3xl font-bold font-mono">78%</div>
                <div className="h-2 mt-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "78%" }} transition={{ duration: 1.2 }} className="h-full bg-gradient-to-r from-primary to-cyan" />
                </div>
                <div className="mt-4 text-[10px] uppercase tracking-widest text-muted-foreground">Confidence Score</div>
                <div className="mt-1 text-2xl font-bold text-cyan font-mono">94</div>
                <div className="text-[10px] text-muted-foreground">High confidence attribution</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Threat Chain</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {AI_STEPS.map((s, idx) => (
                    <motion.div
                      key={s.key}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="glass rounded-lg p-3 relative overflow-hidden group hover:border-primary/40"
                    >
                      <div className="flex items-center justify-between">
                        <s.icon className="h-4 w-4 text-cyan" />
                        <span className="text-[9px] font-mono text-muted-foreground">STEP {idx + 1}</span>
                      </div>
                      <div className="mt-2 text-xs font-semibold leading-tight">{s.label}</div>
                      <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${60 + idx * 5}%` }} transition={{ delay: idx * 0.1, duration: 0.8 }} className="h-full bg-gradient-to-r from-cyan to-neon" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          {/* Containment */}
          <Panel>
            <PanelHeader title="Containment Actions" subtitle="One-click SOAR playbooks · require confirmation" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {CONTAINMENT.map((a) => (
                <motion.button
                  key={a.key}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setConfirmAction(a)}
                  className="glass rounded-xl p-4 text-left border border-transparent hover:border-primary/40 transition group relative overflow-hidden"
                >
                  <a.icon className={`h-5 w-5 ${a.tone}`} />
                  <div className="mt-2 text-xs font-semibold">{a.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{a.desc}</div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition pointer-events-none" />
                </motion.button>
              ))}
            </div>
          </Panel>

          {/* Case management tabs */}
          <Panel>
            <PanelHeader title="Case Management" subtitle="INC-2041 · Ransomware Outbreak" />
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-white/5 border border-border">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4 text-sm text-muted-foreground">
                <p>Cobalt Strike beacon delivered via weaponized invoice; Kerberoasting followed by lateral PSExec. LockBit 4.0 deployment prevented. Investigation ongoing.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  <MiniStat k="Affected Devices" v="14" />
                  <MiniStat k="Users Impacted" v="6" />
                  <MiniStat k="Data at Risk" v="42 GB" />
                  <MiniStat k="Time to Contain" v="27m" />
                </div>
              </TabsContent>
              <TabsContent value="evidence" className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {EVIDENCE.map((e) => (
                  <div key={e.label} className="glass rounded-lg p-3 flex items-center gap-3">
                    <e.icon className={`h-6 w-6 ${e.tone}`} />
                    <div>
                      <div className="text-xs font-semibold">{e.label}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{e.count.toLocaleString()} items</div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="timeline" className="mt-4">
                <ForensicTimeline />
              </TabsContent>
              <TabsContent value="notes" className="mt-4">
                <textarea placeholder="Analyst notes…" className="w-full min-h-[120px] p-3 rounded-lg bg-white/5 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/60" />
              </TabsContent>
              <TabsContent value="tasks" className="mt-4 space-y-2">
                {["Rotate 42 service credentials", "Confirm backup integrity", "Draft regulator notification", "Close firewall exception #4482"].map((t) => (
                  <label key={t} className="glass rounded-lg p-3 flex items-center gap-3 text-sm cursor-pointer hover:bg-white/10">
                    <input type="checkbox" className="accent-primary" />
                    <ListChecks className="h-4 w-4 text-cyan" />
                    {t}
                  </label>
                ))}
              </TabsContent>
              <TabsContent value="attachments" className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                {["memdump-srv-app-04.raw", "pcap-c2-beacon.pcapng", "lockbit-sample.bin", "kerberoast-tickets.txt"].map((f) => (
                  <div key={f} className="glass rounded-lg p-3 flex items-center gap-3">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-mono truncate">{f}</span>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="comments" className="mt-4 space-y-2">
                {[
                  { who: "S. Adeyemi", when: "2m", msg: "Isolated 12 endpoints. Awaiting IR lead approval for creds rotation." },
                  { who: "T. Okafor", when: "8m", msg: "Confirmed beacon on wks-ops-19. Pulling memory dump." },
                ].map((c, i) => (
                  <div key={i} className="glass rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs">
                      <MessageSquare className="h-3 w-3 text-cyan" />
                      <span className="font-semibold">{c.who}</span>
                      <span className="text-muted-foreground">· {c.when} ago</span>
                    </div>
                    <div className="text-sm mt-1">{c.msg}</div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="activity" className="mt-4 space-y-1">
                {[
                  "12:04 Isolated srv-app-04",
                  "12:02 Assigned to S. Adeyemi",
                  "12:00 Auto-triaged as Critical",
                  "11:58 Ingested from EDR",
                ].map((a) => (
                  <div key={a} className="flex items-center gap-2 text-xs text-muted-foreground border-l-2 border-primary/40 pl-3 py-1">
                    <History className="h-3 w-3" /> {a}
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </Panel>

          {/* Forensic timeline (standalone panel) */}
          <Panel>
            <PanelHeader title="Forensic Timeline" subtitle="Interactive kill-chain across detection to impact" />
            <ForensicTimeline />
          </Panel>

          {/* Evidence panel */}
          <Panel>
            <PanelHeader title="Evidence Repository" subtitle="Immutable forensic artifacts (WORM)" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {EVIDENCE.map((e) => (
                <motion.div
                  key={e.label}
                  whileHover={{ y: -3 }}
                  className="glass rounded-xl p-4 relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between">
                    <e.icon className={`h-5 w-5 ${e.tone}`} />
                    <FileArchive className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="mt-3 text-sm font-semibold">{e.label}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{e.count.toLocaleString()} items</div>
                  <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full ${e.tone.replace("text-", "bg-")}`} style={{ width: `${Math.min(100, e.count / 50)}%` }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </Panel>

          {/* Report Generator */}
          <Panel>
            <PanelHeader title="Report Generator" subtitle="One-click stakeholder-ready exports" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: "Executive Report", icon: FileText, tone: "text-primary" },
                { label: "Technical Report", icon: FileCode, tone: "text-cyan" },
                { label: "Compliance Report", icon: ClipboardList, tone: "text-neon" },
                { label: "Incident Summary", icon: Sparkles, tone: "text-warn" },
                { label: "PDF Export", icon: Download, tone: "text-success" },
              ].map((r) => (
                <motion.button
                  key={r.label}
                  whileHover={{ y: -3 }}
                  onClick={() => setReportOpen(true)}
                  className="glass rounded-xl p-4 text-left hover:border-primary/40 border border-transparent transition"
                >
                  <r.icon className={`h-5 w-5 ${r.tone}`} />
                  <div className="mt-2 text-xs font-semibold">{r.label}</div>
                  <div className="text-[10px] text-muted-foreground">Ready in ~4s</div>
                </motion.button>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-4">
          <Panel>
            <PanelHeader title="Live Alerts" right={<span className="h-2 w-2 rounded-full bg-critical animate-pulse-ring" />} />
            <div className="space-y-2">
              {LIVE_ALERTS.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass rounded-lg p-2.5 text-xs flex items-start gap-2"
                >
                  <SevBadge sev={a.sev} />
                  <div className="min-w-0">
                    <div className="truncate">{a.msg}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{a.t}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Threat Feed" subtitle="Curated intel" />
            <div className="space-y-2">
              {THREAT_FEED.map((t) => (
                <div key={t.tag} className="glass rounded-lg p-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <Radio className="h-3 w-3 text-cyan" />
                    <span className="font-semibold">{t.tag}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">{t.src}</span>
                  </div>
                  <div className="text-muted-foreground mt-1">{t.note}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Open Cases" />
            <div className="space-y-1.5">
              {INCIDENTS.filter((i) => i.status !== "Resolved").slice(0, 4).map((i) => (
                <button
                  key={i.id}
                  onClick={() => setSelected(i)}
                  className="w-full text-left glass rounded-lg p-2.5 text-xs hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan">{i.id}</span>
                    <SevBadge sev={i.severity} />
                  </div>
                  <div className="mt-1 truncate">{i.title}</div>
                </button>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="SOC Notifications" />
            <div className="space-y-2 text-xs">
              {["Shift handover in 42m", "New MITRE update: T1621", "Playbook v4.2 deployed", "Backup vault verified"].map((n) => (
                <div key={n} className="flex items-center gap-2 text-muted-foreground">
                  <BellRing className="h-3 w-3 text-cyan" /> {n}
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Pending Approvals" subtitle={`${APPROVALS.length} awaiting sign-off`} />
            <div className="space-y-2">
              {APPROVALS.map((a, i) => (
                <div key={i} className="glass rounded-lg p-2.5 text-xs">
                  <div className="font-semibold">{a.what}</div>
                  <div className="text-muted-foreground">by {a.who} · <span className="font-mono text-cyan">{a.inc}</span></div>
                  <div className="mt-2 flex gap-1">
                    <button className="flex-1 h-7 rounded-md bg-success/20 text-success text-[10px] font-semibold hover:bg-success/30">Approve</button>
                    <button className="flex-1 h-7 rounded-md bg-white/5 border border-border text-[10px] hover:bg-white/10">Deny</button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </aside>
      </div>

      {/* Incident details sliding drawer */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-2xl glass-strong border-l border-primary/30 overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-cyan">{selected.id}</span>
                  <SevBadge sev={selected.severity} />
                  <SevBadge sev={selected.status} />
                </div>
                <SheetTitle className="text-gradient text-xl">{selected.title}</SheetTitle>
                <SheetDescription>{selected.summary}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-5">
                <Section title="Executive Summary" icon={Sparkles}>
                  <p className="text-sm text-muted-foreground">{selected.summary}</p>
                </Section>

                <Section title="Attack Timeline" icon={Clock}>
                  <ol className="relative border-l-2 border-primary/40 ml-3 space-y-3">
                    {selected.killchain.map((s, i) => (
                      <li key={i} className="ml-5 relative">
                        <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-gradient-to-br from-primary to-neon border-4 border-background" />
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="font-semibold text-sm">{s.phase}</span>
                          <span className="font-mono text-[10px] text-muted-foreground">{s.t}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                            s.status.includes("block") || s.status === "prevented" ? "bg-success/15 text-success" :
                            s.status === "contained" ? "bg-cyan/15 text-cyan" : "bg-warn/15 text-warn"
                          }`}>{s.status}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{s.detail}</div>
                      </li>
                    ))}
                  </ol>
                </Section>

                <div className="grid grid-cols-2 gap-3">
                  <ChipList title="Affected Systems" icon={Server} items={[selected.asset]} />
                  <ChipList title="Users Impacted" icon={UserIcon} items={selected.users} />
                  <ChipList title="Devices" icon={HardDrive} items={selected.devices} />
                  <ChipList title="IP Addresses" icon={NetIcon} items={selected.ips} mono />
                  <ChipList title="Domains" icon={Globe} items={selected.domains} mono />
                  <ChipList title="Malware" icon={Bug} items={selected.malware} />
                </div>

                <Section title="MITRE ATT&CK Mapping" icon={Target}>
                  <div className="glass rounded-lg p-3 flex items-center gap-3">
                    <span className="font-mono text-cyan">{selected.mitre.id}</span>
                    <span className="text-sm">{selected.mitre.name}</span>
                  </div>
                </Section>

                <Section title="Kill Chain" icon={Layers}>
                  <div className="flex flex-wrap gap-1.5">
                    {["Recon", "Weaponize", "Deliver", "Exploit", "Install", "C2", "Actions"].map((k, i) => (
                      <span key={k} className={`text-[10px] px-2 py-1 rounded-md border ${i < 5 ? "bg-critical/15 text-critical border-critical/30" : "bg-white/5 border-border text-muted-foreground"}`}>{k}</span>
                    ))}
                  </div>
                </Section>

                <Section title="AI Root Cause Analysis" icon={Brain}>
                  <div className="glass rounded-lg p-3 text-sm border border-cyan/20">
                    <div className="flex items-center gap-2 text-cyan text-xs mb-2">
                      <Sparkles className="h-3 w-3" /> AI CONFIDENCE {selected.confidence}%
                    </div>
                    {selected.rootCause}
                  </div>
                </Section>

                <Section title="Business Impact" icon={AlertTriangle}>
                  <p className="text-sm text-muted-foreground">{selected.businessImpact}</p>
                </Section>

                <Section title="Evidence" icon={FileArchive}>
                  <div className="grid grid-cols-2 gap-2">
                    {EVIDENCE.slice(0, 6).map((e) => (
                      <div key={e.label} className="glass rounded-md p-2 flex items-center gap-2 text-xs">
                        <e.icon className={`h-3.5 w-3.5 ${e.tone}`} />
                        <span>{e.label}</span>
                        <span className="ml-auto font-mono text-muted-foreground">{e.count}</span>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="IOC List" icon={Fingerprint}>
                  <div className="space-y-1.5">
                    {selected.iocs.map((io) => (
                      <div key={io.value} className="glass rounded-md p-2 text-xs flex items-center gap-2">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-border uppercase">{io.type}</span>
                        <span className="font-mono">{io.value}</span>
                        <span className="ml-auto text-muted-foreground">{io.tag}</span>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Recommended Response" icon={Shield}>
                  <ol className="text-sm space-y-1.5">
                    {["Isolate all affected endpoints", "Rotate compromised credentials", "Block C2 IPs & domains at edge", "Restore from immutable backup", "File regulator notification"].map((s, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-cyan font-mono">{String(i + 1).padStart(2, "0")}</span>{s}
                      </li>
                    ))}
                  </ol>
                  <button className="mt-3 w-full h-10 rounded-lg bg-gradient-to-r from-primary to-neon text-primary-foreground text-sm font-semibold">
                    Execute Response Playbook
                  </button>
                </Section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Containment confirmation */}
      <Dialog open={!!confirmAction} onOpenChange={(o) => !o && setConfirmAction(null)}>
        <DialogContent className="glass-strong border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {confirmAction && <confirmAction.icon className={`h-5 w-5 ${confirmAction.tone}`} />}
              Confirm: {confirmAction?.label}
            </DialogTitle>
            <DialogDescription>
              {confirmAction?.desc}. This SOAR action will execute against the active incident and be recorded in the audit log.
            </DialogDescription>
          </DialogHeader>
          <div className="glass rounded-lg p-3 text-xs text-muted-foreground">
            <div>Target: <span className="text-foreground font-mono">srv-db-prod-3</span></div>
            <div>Incident: <span className="text-cyan font-mono">INC-2041</span></div>
            <div>Requester: <span className="text-foreground">S. Adeyemi (SOC Manager)</span></div>
          </div>
          <DialogFooter>
            <button onClick={() => setConfirmAction(null)} className="h-9 px-4 rounded-md glass border border-border text-sm hover:bg-white/10">Cancel</button>
            <button onClick={() => setConfirmAction(null)} className="h-9 px-4 rounded-md bg-gradient-to-r from-primary to-neon text-primary-foreground text-sm font-semibold">Execute</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Investigation dialog */}
      <Dialog open={aiOpen} onOpenChange={setAiOpen}>
        <DialogContent className="glass-strong border-cyan/40 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gradient">
              <Brain className="h-5 w-5 text-cyan" /> AI Investigation
            </DialogTitle>
            <DialogDescription>
              Autonomous correlation across EDR, IDPS, cloud, identity, and OT telemetry.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {AI_STEPS.map((s, i) => (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-lg p-3 flex items-center gap-3"
              >
                <s.icon className="h-4 w-4 text-cyan" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{s.label}</div>
                  <div className="h-1 mt-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${70 + i * 4}%` }} transition={{ duration: 0.7, delay: i * 0.08 }} className="h-full bg-gradient-to-r from-cyan to-neon" />
                  </div>
                </div>
                <Loader2 className="h-3 w-3 text-cyan animate-spin" />
              </motion.div>
            ))}
            <div className="glass rounded-lg p-3 border border-cyan/30 text-xs">
              <div className="flex items-center gap-2 text-cyan mb-1"><Sparkles className="h-3 w-3" /> AI Explanation</div>
              <p>The activity pattern matches APT-29 TTPs with 94% confidence. Recommend immediate isolation of srv-app-04 and rotation of all Kerberos service tickets.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report generator dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="glass-strong border-border max-w-lg">
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>Choose format · exports will include evidence, timeline, and MITRE mapping.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {["Executive", "Technical", "Compliance", "Summary"].map((k) => (
              <button key={k} onClick={() => setReportOpen(false)} className="glass rounded-lg p-3 text-sm hover:bg-white/10 border border-border">{k}</button>
            ))}
          </div>
          <button onClick={() => setReportOpen(false)} className="w-full h-10 rounded-lg bg-gradient-to-r from-primary to-neon text-primary-foreground text-sm font-semibold mt-2 flex items-center justify-center gap-2">
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </DialogContent>
      </Dialog>

      {/* Create incident dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="glass-strong border-border max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Incident</DialogTitle>
            <DialogDescription>Manually open a new incident and assign it to the queue.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <input placeholder="Title" className="w-full h-10 px-3 rounded-lg bg-white/5 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/60" />
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="Affected asset" className="h-10 px-3 rounded-lg bg-white/5 border border-border text-sm" />
              <input placeholder="MITRE T-ID" className="h-10 px-3 rounded-lg bg-white/5 border border-border text-sm" />
            </div>
            <textarea placeholder="Description" className="w-full min-h-[80px] p-3 rounded-lg bg-white/5 border border-border text-sm" />
            <DialogFooter>
              <button onClick={() => setCreateOpen(false)} className="h-9 px-4 rounded-md glass border border-border text-sm">Cancel</button>
              <button onClick={() => setCreateOpen(false)} className="h-9 px-4 rounded-md bg-gradient-to-r from-primary to-neon text-primary-foreground text-sm font-semibold">Create</button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

// ============ Bits ============
function Th({ children }: { children: React.ReactNode }) {
  return <th className="py-2 pr-3 font-semibold">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`py-2.5 pr-3 ${className}`}>{children}</td>;
}
function MiniStat({ k, v }: { k: string; v: string }) {
  return (
    <div className="glass rounded-lg p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
      <div className="text-lg font-bold font-mono mt-1">{v}</div>
    </div>
  );
}
function Select({
  value, onChange, options, icon: Icon, label,
}: {
  value: string; onChange: (v: string) => void; options: string[];
  icon: React.ComponentType<{ className?: string }>; label: string;
}) {
  return (
    <label className="relative inline-flex items-center">
      <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 pl-8 pr-3 rounded-lg bg-white/5 border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/60 appearance-none"
        aria-label={label}
      >
        {options.map((o) => <option key={o} value={o} className="bg-background">{label}: {o}</option>)}
      </select>
    </label>
  );
}
function Section({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-cyan" /> {title}
      </div>
      {children}
    </div>
  );
}
function ChipList({
  title, icon: Icon, items, mono,
}: { title: string; icon: React.ComponentType<{ className?: string }>; items: string[]; mono?: boolean }) {
  return (
    <div className="glass rounded-lg p-3">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
        <Icon className="h-3 w-3 text-cyan" /> {title}
      </div>
      {items.length === 0 ? (
        <div className="text-xs text-muted-foreground">None</div>
      ) : (
        <div className="flex flex-wrap gap-1">
          {items.map((i) => (
            <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-border ${mono ? "font-mono" : ""}`}>{i}</span>
          ))}
        </div>
      )}
    </div>
  );
}
function ForensicTimeline() {
  return (
    <div className="relative">
      <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="grid grid-cols-3 md:grid-cols-9 gap-2 relative">
        {FORENSIC.map((f, i) => (
          <motion.div
            key={f.phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col items-center"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="h-10 w-10 rounded-full glass grid place-items-center border border-primary/40 shadow-[0_0_10px_oklch(0.72_0.19_275/0.4)]"
            >
              <f.icon className={`h-4 w-4 ${f.tone}`} />
            </motion.div>
            <div className="mt-2 text-[10px] text-center font-semibold">{f.phase}</div>
            <div className="text-[9px] text-muted-foreground font-mono">T-{9 - i}h</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
