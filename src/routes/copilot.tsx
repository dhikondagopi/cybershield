import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SevBadge } from "@/components/ui/panel";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import type React from "react";
import {
  Bot, Send, Sparkles, FileText, Bug, Shield, Search, Plus, MessageSquare,
  Star, FolderClosed, History, Paperclip, Mic, Copy, Download, Share2,
  ChevronRight, AlertTriangle, Activity, ShieldAlert, Cloud, Mail,
  Lock, Zap, Brain, TrendingUp, Radar, Terminal, Target, GitBranch,
  CheckCircle2, XCircle, Clock, Server, Network, Flame, Eye,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/copilot")({
  head: () => ({
    meta: [
      { title: "AI Security Copilot — CyberShield AI" },
      { name: "description", content: "Enterprise conversational AI security analyst: investigate incidents, decode malware, map MITRE ATT&CK, and auto-generate executive reports." },
      { property: "og:title", content: "AI Security Copilot — CyberShield" },
      { property: "og:description", content: "Enterprise AI Copilot for SOC teams — investigation, MITRE mapping, and instant reporting." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Copilot,
});

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type AICard = {
  title: string;
  summary: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  confidence: number;
  mitre: { id: string; name: string; tactic: string }[];
  assets: string[];
  timeline: { t: string; event: string }[];
  risk: number;
  iocs: { type: string; value: string }[];
  actions: string[];
  refs: { label: string; url: string }[];
};

type Msg = {
  id: string;
  role: "user" | "assistant";
  text?: string;
  card?: AICard;
};

// ─────────────────────────────────────────────
// Seeded data
// ─────────────────────────────────────────────
const skills = [
  { icon: Search, label: "Threat Investigation", hint: "Correlate signals across estate" },
  { icon: Bug, label: "Malware Analysis", hint: "Reverse & classify samples" },
  { icon: Terminal, label: "Log Analysis", hint: "Parse syslog, EDR, PCAP" },
  { icon: Target, label: "MITRE ATT&CK Lookup", hint: "Techniques, sub-techniques" },
  { icon: Radar, label: "IOC Search", hint: "IPs, hashes, domains" },
  { icon: FileText, label: "Generate Incident Report", hint: "Executive-ready PDF" },
  { icon: GitBranch, label: "Root Cause Analysis", hint: "Attack path reconstruction" },
  { icon: TrendingUp, label: "Risk Assessment", hint: "Business impact scoring" },
  { icon: Mail, label: "Email Phishing Analysis", hint: "Header, URL, payload" },
  { icon: Flame, label: "Ransomware Investigation", hint: "Family + kill switch" },
  { icon: Cloud, label: "Cloud Security Review", hint: "AWS · Azure · GCP posture" },
  { icon: ShieldAlert, label: "Vulnerability Explanation", hint: "CVE plain-english brief" },
  { icon: Zap, label: "Zero-Day Intelligence", hint: "Emerging exploit tracking" },
  { icon: Brain, label: "Behavioral Analysis", hint: "UEBA & anomalies" },
];

const conversationHistory = [
  { id: "c1", title: "Cobalt Strike beacon on srv-app-04", when: "12m ago", pinned: true },
  { id: "c2", title: "Modbus write anomaly · plc-grid-07", when: "1h ago" },
  { id: "c3", title: "Impossible travel — kchen", when: "3h ago" },
  { id: "c4", title: "CVE-2024-38112 exposure sweep", when: "Yesterday" },
  { id: "c5", title: "Executive brief — Q3 SOC review", when: "2d ago" },
];

const investigations = [
  { id: "INV-2041", title: "Ransomware attempt — Finance", status: "Contained" },
  { id: "INV-2039", title: "Insider data staging — kchen", status: "Investigating" },
  { id: "INV-2036", title: "SCADA anomaly — Grid North", status: "Open" },
];

const favorites = [
  "MITRE T1071.004 board-level explanation",
  "Kerberoasting containment playbook",
  "PCAP triage checklist",
];

const recentReports = [
  { id: "R-491", title: "Executive Incident Report · INC-2041", date: "Today" },
  { id: "R-490", title: "Weekly Threat Landscape", date: "Mon" },
  { id: "R-489", title: "OT Segment Risk Review", date: "Fri" },
];

const liveFeed = [
  { sev: "Critical", text: "New CVE-2026-1188 — Ivanti RCE actively exploited", when: "2m" },
  { sev: "High", text: "APT29 infrastructure shift detected in EU", when: "18m" },
  { sev: "Medium", text: "Phishing wave targeting Energy sector", when: "44m" },
  { sev: "Low", text: "New Sigma rule published for T1059.001", when: "1h" },
];

const criticalAssets = [
  { name: "srv-scada-01", risk: 92 },
  { name: "plc-grid-07", risk: 87 },
  { name: "srv-app-04", risk: 78 },
];

const socRecs = [
  "Rotate cached credentials on 14 Finance endpoints",
  "Push EDR to 240 legacy hosts (board-approved budget)",
  "Enable DNS filtering on OT resolver segment",
];

const seedCard: AICard = {
  title: "Cobalt Strike beacon on srv-app-04",
  summary:
    "High-confidence Cobalt Strike C2 beacon observed from **srv-app-04** to **45.61.187.9** (UNC5537 infrastructure). Initial access via Kerberoasting following a phishing lure. Lateral movement attempted toward Finance file shares; DLP blocked exfiltration of 4.2 GB.",
  severity: "Critical",
  confidence: 96,
  mitre: [
    { id: "T1566.001", name: "Spearphishing Attachment", tactic: "Initial Access" },
    { id: "T1558.003", name: "Kerberoasting", tactic: "Credential Access" },
    { id: "T1071.004", name: "DNS C2", tactic: "Command & Control" },
    { id: "T1021.002", name: "SMB/Admin Shares", tactic: "Lateral Movement" },
  ],
  assets: ["srv-app-04", "fs-fin-02", "wks-fin-118", "dc-hq-01"],
  timeline: [
    { t: "02:14", event: "Phishing email delivered to 3 Finance users" },
    { t: "02:41", event: "Macro executes; CobaltStrike stager retrieved" },
    { t: "03:02", event: "Kerberoast against dc-hq-01" },
    { t: "03:18", event: "Lateral pivot to fs-fin-02" },
    { t: "03:41", event: "DLP blocks 4.2 GB exfil to 45.61.187.9" },
    { t: "03:44", event: "Copilot auto-isolated host + rotated tokens" },
  ],
  risk: 87,
  iocs: [
    { type: "IPv4", value: "45.61.187.9" },
    { type: "SHA256", value: "a1b2…9f4c" },
    { type: "Domain", value: "cdn-update-microsft.co" },
    { type: "URL", value: "hxxps://cdn-update-microsft.co/wp-inc" },
  ],
  actions: [
    "Isolate srv-app-04 and fs-fin-02 (auto-executed)",
    "Block 45.61.187.9 at perimeter + DNS resolver",
    "Rotate Kerberos TGT and impacted service accounts",
    "Memory-forensic srv-app-04 (Volatility playbook attached)",
    "Reset MFA for 3 phished users; run mailbox rules audit",
  ],
  refs: [
    { label: "MITRE ATT&CK G0114 — Cobalt Strike", url: "#" },
    { label: "CISA Alert AA23-347A", url: "#" },
    { label: "Internal Playbook PB-018", url: "#" },
  ],
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
function Copilot() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "m0", role: "assistant", text: WELCOME },
    { id: "m1", role: "assistant", card: seedCard },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = (text: string) => {
    if (!text.trim()) return;
    const uid = crypto.randomUUID?.() ?? String(Date.now());
    setMsgs((m) => [...m, { id: uid, role: "user", text }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const aid = (crypto.randomUUID?.() ?? String(Date.now() + 1));
      const reply = buildReply(text);
      setMsgs((m) => [...m, { id: aid, role: "assistant", ...reply }]);
      setTyping(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }, 1100);
  };

  const newChat = () => {
    setMsgs([{ id: "n0", role: "assistant", text: WELCOME }]);
    inputRef.current?.focus();
  };

  return (
    <AppShell>
      <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr_320px] gap-4 h-[calc(100vh-5.5rem)] lg:h-[calc(100vh-7rem)]">
        {/* ── Left Panel ─────────────────────── */}
        <aside className="hidden xl:flex flex-col gap-3 overflow-y-auto pr-1 min-h-0">
          <button
            onClick={newChat}
            className="group flex items-center justify-center gap-2 h-11 rounded-xl bg-gradient-to-r from-primary via-cyan to-neon text-primary-foreground font-semibold text-sm shadow-[0_0_25px_oklch(0.72_0.19_275/0.45)] hover:shadow-[0_0_35px_oklch(0.72_0.19_275/0.7)] transition-all"
          >
            <Plus className="h-4 w-4" /> New Chat
          </button>

          <SideSection icon={History} title="Conversation History">
            {conversationHistory.map((c) => (
              <SideRow key={c.id} title={c.title} meta={c.when} pinned={c.pinned} />
            ))}
          </SideSection>

          <SideSection icon={FolderClosed} title="Saved Investigations">
            {investigations.map((i) => (
              <div key={i.id} className="rounded-lg px-3 py-2 hover:bg-white/5 transition cursor-pointer">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-cyan">{i.id}</span>
                  <SevBadge sev={i.status} />
                </div>
                <div className="text-xs mt-1 truncate">{i.title}</div>
              </div>
            ))}
          </SideSection>

          <SideSection icon={Star} title="Favorite Responses">
            {favorites.map((f) => (
              <div key={f} className="text-xs px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer text-muted-foreground hover:text-foreground transition">
                {f}
              </div>
            ))}
          </SideSection>

          <SideSection icon={FileText} title="Recent Reports">
            {recentReports.map((r) => (
              <div key={r.id} className="flex items-center justify-between text-xs px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
                <span className="truncate">{r.title}</span>
                <span className="text-muted-foreground shrink-0 ml-2">{r.date}</span>
              </div>
            ))}
          </SideSection>
        </aside>

        {/* ── Center Chat ─────────────────────── */}
        <Panel className="flex flex-col overflow-hidden !p-0 min-h-0">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-cyan to-neon grid place-items-center shadow-[0_0_20px_oklch(0.72_0.22_300/0.5)]">
              <Bot className="h-5 w-5 text-primary-foreground" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-background animate-pulse" />
            </div>
            <div>
              <div className="font-semibold flex items-center gap-2">
                CyberShield Copilot
                <Sparkles className="h-3.5 w-3.5 text-cyan" />
              </div>
              <div className="text-xs text-muted-foreground">Cyber Resilience LLM · v4.2 · MITRE v14 · CISA KEV</div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-success flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Online
              </span>
            </div>
          </div>

          {/* Skills grid — shown only for fresh chat */}
          {msgs.length <= 1 && (
            <div className="px-5 pt-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-cyan" /> Prebuilt AI Skills
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {skills.map(({ icon: I, label, hint }, idx) => (
                  <motion.button
                    key={label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => send(label)}
                    className="group text-left glass rounded-xl p-3 hover:bg-white/10 border border-transparent hover:border-primary/40 hover:shadow-[0_0_20px_oklch(0.72_0.19_275/0.25)] transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary/30 to-cyan/20 grid place-items-center">
                        <I className="h-3.5 w-3.5 text-cyan" />
                      </div>
                      <div className="text-xs font-semibold truncate">{label}</div>
                    </div>
                    <div className="text-[10px] text-muted-foreground line-clamp-1">{hint}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            <AnimatePresence initial={false}>
              {msgs.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  {m.card ? <ResponseCard card={m.card} /> : <Bubble m={m} />}
                </motion.div>
              ))}
            </AnimatePresence>
            {typing && <TypingIndicator />}
          </div>

          {/* Composer */}
          <div className="px-5 pb-5 pt-3 border-t border-border">
            <div className="flex flex-wrap gap-2 mb-3">
              {["Explain this malware.", "Investigate suspicious login.", "Analyze these logs.", "Generate Incident Report.", "Explain MITRE T1059.", "Suggest containment steps."].map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-[11px] flex items-center gap-1.5 px-3 py-1.5 rounded-full glass hover:bg-white/10 hover:border-cyan/40 transition"
                  >
                    <Sparkles className="h-3 w-3 text-cyan" />
                    {s}
                  </button>
                )
              )}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="relative flex items-center gap-2 rounded-2xl glass border border-border focus-within:ring-2 focus-within:ring-primary/60 focus-within:border-primary/60 transition"
            >
              <input
                ref={fileRef}
                type="file"
                multiple
                accept=".json,.csv,.txt,.pcap,.log"
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []).map((f) => f.name);
                  if (files.length) send(`Analyze uploaded files: ${files.join(", ")}`);
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                title="Attach JSON / CSV / TXT / PCAP"
                className="ml-2 h-10 w-10 grid place-items-center rounded-lg text-muted-foreground hover:text-cyan hover:bg-white/5 transition"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                className="flex-1 h-12 bg-transparent focus:outline-none placeholder:text-muted-foreground text-sm"
              />
              <button
                type="button"
                onClick={() => setListening((v) => !v)}
                title="Voice input"
                className={`h-10 w-10 grid place-items-center rounded-lg transition ${
                  listening
                    ? "text-critical bg-critical/10 animate-pulse-ring"
                    : "text-muted-foreground hover:text-cyan hover:bg-white/5"
                }`}
              >
                <Mic className="h-4 w-4" />
              </button>
              <button
                type="submit"
                className="mr-2 h-10 w-10 rounded-lg bg-gradient-to-br from-primary via-cyan to-neon text-primary-foreground grid place-items-center hover:opacity-90 shadow-[0_0_20px_oklch(0.72_0.19_275/0.4)]"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-2 text-[10px] text-muted-foreground flex items-center gap-2">
              <Lock className="h-3 w-3" /> Responses grounded in your tenant telemetry · MITRE ATT&CK v14 · CVE · CISA KEV
            </div>
          </div>
        </Panel>

        {/* ── Right Sidebar ─────────────────────── */}
        <aside className="hidden xl:flex flex-col gap-3 overflow-y-auto pr-1 min-h-0">
          <Panel>
            <PanelHeader
              title="Threat Score"
              right={<span className="text-[10px] text-muted-foreground">last 24h</span>}
            />
            <div className="flex items-end gap-3">
              <div className="text-4xl font-black text-gradient leading-none">72</div>
              <div className="text-xs text-warn flex items-center gap-1 pb-1">
                <TrendingUp className="h-3 w-3" /> +8
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full w-[72%] bg-gradient-to-r from-success via-warn to-critical animate-gradient" />
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Live Threat Feed" />
            <div className="space-y-2">
              {liveFeed.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-2 text-xs"
                >
                  <SevBadge sev={f.sev} />
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{f.text}</div>
                    <div className="text-[10px] text-muted-foreground">{f.when} ago</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Latest CVEs" />
            <ul className="space-y-1.5 text-xs">
              {[
                { id: "CVE-2026-1188", sev: "Critical" },
                { id: "CVE-2026-1074", sev: "High" },
                { id: "CVE-2026-0994", sev: "High" },
                { id: "CVE-2026-0871", sev: "Medium" },
              ].map((c) => (
                <li key={c.id} className="flex items-center justify-between hover:text-cyan cursor-pointer transition">
                  <span className="font-mono">{c.id}</span>
                  <SevBadge sev={c.sev} />
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <PanelHeader title="Critical Assets" />
            <div className="space-y-2">
              {criticalAssets.map((a) => (
                <div key={a.name}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono flex items-center gap-1">
                      <Server className="h-3 w-3 text-cyan" />
                      {a.name}
                    </span>
                    <span className="text-critical font-bold">{a.risk}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 mt-1 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-warn to-critical"
                      style={{ width: `${a.risk}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="SOC Recommendations" />
            <ul className="space-y-2 text-xs">
              {socRecs.map((r) => (
                <li key={r} className="flex gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{r}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>
    </AppShell>
  );
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
const WELCOME = `Hello **Sarah**,

I'm your **CyberShield AI Copilot**.

I can investigate incidents, explain malware, analyze logs, map **MITRE ATT&CK** techniques, recommend remediation, and generate executive reports.`;

function SideSection({
  icon: I,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
        <I className="h-3 w-3 text-cyan" />
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SideRow({ title, meta, pinned }: { title: string; meta: string; pinned?: boolean }) {
  return (
    <div className="group flex items-start gap-2 rounded-lg px-2.5 py-1.5 hover:bg-white/5 cursor-pointer transition">
      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0 group-hover:text-cyan" />
      <div className="min-w-0 flex-1">
        <div className="text-xs truncate">{title}</div>
        <div className="text-[10px] text-muted-foreground">{meta}</div>
      </div>
      {pinned && <Star className="h-3 w-3 text-warn shrink-0" />}
    </div>
  );
}

function Bubble({ m }: { m: Msg }) {
  const isUser = m.role === "user";
  return (
    <div className={`flex gap-3 items-start ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`h-8 w-8 rounded-lg grid place-items-center shrink-0 ${
          isUser ? "bg-white/10" : "bg-gradient-to-br from-primary via-cyan to-neon"
        }`}
      >
        {isUser ? <span className="text-xs font-bold">SA</span> : <Bot className="h-4 w-4 text-primary-foreground" />}
      </div>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed prose prose-invert prose-sm max-w-none ${
          isUser
            ? "bg-primary/20 border border-primary/30 rounded-tr-sm"
            : "glass rounded-tl-sm"
        }`}
      >
        <ReactMarkdown
          components={{
            strong: ({ children }: { children?: React.ReactNode }) => <b className="text-cyan font-semibold">{children}</b>,
            code: ({ children }: { children?: React.ReactNode }) => (
              <code className="px-1.5 py-0.5 rounded bg-black/40 border border-border font-mono text-[12px] text-cyan">
                {children}
              </code>
            ),
            p: ({ children }: { children?: React.ReactNode }) => <p className="my-1">{children}</p>,
            ul: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc pl-5 my-1 space-y-0.5">{children}</ul>,
          }}
        >
          {m.text ?? ""}
        </ReactMarkdown>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-start">
      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-cyan to-neon grid place-items-center shrink-0">
        <Bot className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
          <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" style={{ animationDelay: "0.15s" }} />
          <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" style={{ animationDelay: "0.3s" }} />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Copilot is reasoning…</span>
      </div>
    </div>
  );
}

function ResponseCard({ card }: { card: AICard }) {
  const [tab, setTab] = useState<"summary" | "mitre" | "logs" | "report">("summary");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex gap-3 items-start"
    >
      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-cyan to-neon grid place-items-center shrink-0">
        <Bot className="h-4 w-4 text-primary-foreground" />
      </div>

      <div className="glass-strong rounded-2xl rounded-tl-sm border border-primary/20 shadow-[0_0_30px_oklch(0.72_0.19_275/0.15)] flex-1 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold tracking-tight">{card.title}</h3>
                <SevBadge sev={card.severity} />
                <span className="text-[10px] uppercase tracking-widest text-cyan flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> {card.confidence}% confidence
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {card.summary.split("**").map((c, i) =>
                  i % 2 ? (
                    <b key={i} className="text-cyan font-semibold">
                      {c}
                    </b>
                  ) : (
                    <span key={i}>{c}</span>
                  )
                )}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Risk Score</div>
              <div className="text-3xl font-black text-gradient leading-none">{card.risk}</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 p-1 rounded-lg glass w-fit">
            {[
              { id: "summary", label: "Summary", icon: Eye },
              { id: "mitre", label: "MITRE", icon: Target },
              { id: "logs", label: "Logs", icon: Terminal },
              { id: "report", label: "Report", icon: FileText },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as typeof tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition ${
                  tab === t.id
                    ? "bg-gradient-to-r from-primary/40 to-cyan/30 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="h-3 w-3" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {tab === "summary" && <SummaryTab card={card} />}
              {tab === "mitre" && <MitreTab card={card} />}
              {tab === "logs" && <LogsTab />}
              {tab === "report" && <ReportTab card={card} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-t border-border bg-black/20">
          <ActionBtn icon={FileText} label="Generate Report" primary />
          <ActionBtn icon={Download} label="Export" />
          <ActionBtn icon={Copy} label="Copy" />
          <ActionBtn icon={Share2} label="Share" />
          <ActionBtn icon={Star} label="Save" />
          <div className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> Generated in 1.2s · grounded in tenant data
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SummaryTab({ card }: { card: AICard }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <MiniPanel title="Attack Timeline" icon={Clock}>
        <ol className="relative border-l border-primary/30 pl-4 space-y-2">
          {card.timeline.map((t, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_8px_oklch(0.82_0.16_210/0.8)]" />
              <div className="text-[11px] font-mono text-cyan">{t.t}</div>
              <div className="text-xs text-muted-foreground">{t.event}</div>
            </li>
          ))}
        </ol>
      </MiniPanel>

      <MiniPanel title="Affected Assets" icon={Server}>
        <div className="flex flex-wrap gap-1.5">
          {card.assets.map((a) => (
            <span key={a} className="px-2 py-1 rounded-md bg-white/5 border border-border text-[11px] font-mono">
              {a}
            </span>
          ))}
        </div>
      </MiniPanel>

      <MiniPanel title="Indicators of Compromise" icon={Radar}>
        <div className="space-y-1.5">
          {card.iocs.map((i) => (
            <div key={i.value} className="flex items-center justify-between gap-2 text-[11px]">
              <span className="text-muted-foreground uppercase tracking-widest w-16">{i.type}</span>
              <span className="font-mono text-cyan truncate flex-1">{i.value}</span>
              <button className="text-muted-foreground hover:text-cyan">
                <Copy className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </MiniPanel>

      <MiniPanel title="Recommended Actions" icon={ShieldAlert}>
        <ul className="space-y-1.5 text-xs">
          {card.actions.map((a, i) => (
            <li key={i} className="flex gap-2">
              <span className="h-4 w-4 rounded-full bg-primary/20 border border-primary/40 text-[9px] grid place-items-center text-cyan shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-muted-foreground">{a}</span>
            </li>
          ))}
        </ul>
      </MiniPanel>

      <MiniPanel title="References" icon={FileText} className="md:col-span-2">
        <div className="flex flex-wrap gap-2">
          {card.refs.map((r) => (
            <a
              key={r.label}
              href={r.url}
              className="text-[11px] px-2.5 py-1 rounded-md glass hover:bg-white/10 hover:border-cyan/40 border border-border text-cyan flex items-center gap-1"
            >
              {r.label}
              <ChevronRight className="h-3 w-3" />
            </a>
          ))}
        </div>
      </MiniPanel>
    </div>
  );
}

function MitreTab({ card }: { card: AICard }) {
  return (
    <div className="space-y-4">
      {/* Attack flow */}
      <MiniPanel title="Attack Flow Diagram" icon={GitBranch}>
        <div className="flex flex-wrap items-center gap-2 py-1">
          {card.mitre.map((t, i) => (
            <div key={t.id} className="flex items-center gap-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className="px-3 py-2 rounded-lg glass border border-primary/30 min-w-[140px]"
              >
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.tactic}</div>
                <div className="text-xs font-mono text-cyan">{t.id}</div>
                <div className="text-[11px]">{t.name}</div>
              </motion.div>
              {i < card.mitre.length - 1 && <ChevronRight className="h-4 w-4 text-primary" />}
            </div>
          ))}
        </div>
      </MiniPanel>

      {/* MITRE cards */}
      <div className="grid md:grid-cols-2 gap-3">
        {card.mitre.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-3 border border-border hover:border-cyan/40 transition"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="font-mono text-cyan text-sm">{t.id}</div>
              <SevBadge sev={i === 0 ? "High" : "Medium"} />
            </div>
            <div className="font-semibold text-sm">{t.name}</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{t.tactic}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Detection via EDR process telemetry, Sigma rule <span className="font-mono text-cyan">win_susp_{t.id.toLowerCase()}</span>. Mitigate with MFA, least-privilege, and network segmentation.
            </p>
            <div className="mt-2 flex items-center gap-2 text-[10px]">
              <span className="text-muted-foreground">Confidence</span>
              <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan to-primary" style={{ width: `${88 - i * 6}%` }} />
              </div>
              <span className="text-cyan font-mono">{88 - i * 6}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LogsTab() {
  const lines = useMemo(
    () => [
      { t: "03:01:44", sev: "warn", txt: "sshd[19218]: Failed password for kchen from 45.61.187.9 port 55214" },
      { t: "03:01:45", sev: "warn", txt: "sshd[19218]: Failed password for kchen from 45.61.187.9 port 55215" },
      { t: "03:02:11", sev: "crit", txt: "Kerberos: TGS-REQ SPN=HTTP/fs-fin-02 encryption=RC4_HMAC (kerberoast)" },
      { t: "03:02:33", sev: "crit", txt: 'powershell.exe -nop -w hidden -enc "JABzAD0ATgBlAHcALQBPAGIA…"' },
      { t: "03:03:02", sev: "info", txt: "outbound → 45.61.187.9:443 TLS SNI=cdn-update-microsft.co" },
      { t: "03:03:41", sev: "crit", txt: "DLP-BLOCK size=4.2GB dst=45.61.187.9 user=svc-fin" },
      { t: "03:04:07", sev: "info", txt: "EDR-ISOLATE host=srv-app-04 policy=copilot-auto-response" },
    ],
    []
  );

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-4 gap-2 text-[11px]">
        <StatChip icon={AlertTriangle} label="Suspicious Events" value="27" tone="warn" />
        <StatChip icon={XCircle} label="Failed Logins" value="14" tone="critical" />
        <StatChip icon={TrendingUp} label="Priv. Escalation" value="3" tone="critical" />
        <StatChip icon={Terminal} label="PowerShell" value="9" tone="warn" />
      </div>

      <div className="rounded-xl border border-border bg-black/60 font-mono text-[11px] leading-relaxed overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-black/40">
          <div className="flex gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-critical/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warn/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">/var/log/soc/incident-2041.log</span>
          <button className="ml-auto text-[10px] flex items-center gap-1 text-cyan hover:text-foreground">
            <Download className="h-3 w-3" /> Export Findings
          </button>
        </div>
        <div className="p-3 space-y-0.5 max-h-72 overflow-y-auto">
          {lines.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex gap-3"
            >
              <span className="text-muted-foreground shrink-0">{l.t}</span>
              <span
                className={`shrink-0 w-14 ${
                  l.sev === "crit" ? "text-critical" : l.sev === "warn" ? "text-warn" : "text-cyan"
                }`}
              >
                [{l.sev.toUpperCase()}]
              </span>
              <span className="text-foreground/90 whitespace-pre-wrap break-all">{highlight(l.txt)}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <MiniPanel title="AI Log Summary" icon={Brain}>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Detected <b className="text-cyan">14 failed logins</b> against <span className="font-mono">kchen</span> from{" "}
          <span className="font-mono text-cyan">45.61.187.9</span>, followed by a successful Kerberoast (RC4) and an
          encoded PowerShell downloader. Beacon established to <span className="font-mono text-cyan">cdn-update-microsft.co</span>.
          DLP blocked <b className="text-cyan">4.2 GB</b> exfiltration. Copilot auto-isolated the host at 03:04:07.
        </p>
      </MiniPanel>
    </div>
  );
}

function ReportTab({ card }: { card: AICard }) {
  const sections = [
    { title: "Executive Summary", body: "A targeted intrusion attributed to UNC5537 leveraged Cobalt Strike to establish C2 on a Finance application server. DLP prevented exfiltration; the incident was contained within 27 minutes with no data loss." },
    { title: "Technical Summary", body: "Initial access via spearphishing macro. Kerberoasting yielded a service-account TGS; RC4 encryption enabled offline cracking. Lateral movement to fs-fin-02 over SMB. C2 over DNS-over-HTTPS to cdn-update-microsft.co (45.61.187.9)." },
    { title: "Timeline", body: card.timeline.map((t) => `${t.t}  ${t.event}`).join("\n") },
    { title: "Root Cause", body: "Legacy endpoint without EDR; service account with weak RC4 SPN configuration; DoH not inspected on OT resolver." },
    { title: "Business Impact", body: "Zero data loss (DLP effective). Estimated avoided cost: £4.1M. 3 hours of reduced Finance ops during isolation window." },
    { title: "Affected Assets", body: card.assets.join(", ") },
    { title: "MITRE Mapping", body: card.mitre.map((m) => `${m.id} — ${m.name} (${m.tactic})`).join("\n") },
    { title: "Containment", body: "Auto-isolation of srv-app-04 and fs-fin-02. Perimeter block on 45.61.187.9. DNS sinkhole for cdn-update-microsft.co." },
    { title: "Recovery", body: "Golden-image rebuild of srv-app-04. Kerberos TGT rotation. Service-account cred rotation. AES-256 SPN enforcement." },
    { title: "Lessons Learned", body: "Complete EDR coverage to 240 legacy hosts. Enable DoH inspection on OT resolver. Board-approved £850K budget request." },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <ActionBtn icon={Download} label="Export PDF" primary />
        <ActionBtn icon={Share2} label="Share" />
        <ActionBtn icon={Star} label="Save" />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {sections.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="glass rounded-xl p-3 border border-border"
          >
            <div className="text-[10px] uppercase tracking-widest text-cyan font-semibold mb-1 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {s.title}
            </div>
            <div className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">{s.body}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Small helpers
// ─────────────────────────────────────────────
function MiniPanel({
  title,
  icon: I,
  children,
  className = "",
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass rounded-xl p-3 border border-border ${className}`}>
      <div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-widest text-cyan font-semibold">
        <I className="h-3 w-3" />
        {title}
      </div>
      {children}
    </div>
  );
}

function ActionBtn({
  icon: I,
  label,
  primary,
}: {
  icon: React.ElementType;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition ${
        primary
          ? "bg-gradient-to-r from-primary via-cyan to-neon text-primary-foreground shadow-[0_0_15px_oklch(0.72_0.19_275/0.4)] hover:shadow-[0_0_25px_oklch(0.72_0.19_275/0.6)]"
          : "glass hover:bg-white/10 border border-border hover:border-cyan/40"
      }`}
    >
      <I className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function StatChip({
  icon: I,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone: "warn" | "critical" | "cyan";
}) {
  const toneCls =
    tone === "critical"
      ? "text-critical border-critical/30"
      : tone === "warn"
      ? "text-warn border-warn/30"
      : "text-cyan border-cyan/30";
  return (
    <div className={`glass rounded-lg p-2 border ${toneCls} flex items-center gap-2`}>
      <I className="h-3.5 w-3.5" />
      <div className="min-w-0">
        <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className={`text-sm font-bold ${toneCls}`}>{value}</div>
      </div>
    </div>
  );
}

function highlight(txt: string) {
  // simple keyword highlighter for log line
  const keywords = ["Failed", "kerberoast", "Kerberos", "powershell", "DLP-BLOCK", "EDR-ISOLATE", "TLS"];
  const parts: (string | React.ReactElement)[] = [txt];
  keywords.forEach((k) => {
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (typeof p !== "string") continue;
      const idx = p.toLowerCase().indexOf(k.toLowerCase());
      if (idx >= 0) {
        parts.splice(
          i,
          1,
          p.slice(0, idx),
          <span key={`${k}-${i}`} className="text-neon font-semibold">
            {p.slice(idx, idx + k.length)}
          </span>,
          p.slice(idx + k.length)
        );
      }
    }
  });
  return parts;
}

// ─────────────────────────────────────────────
// Reply builder
// ─────────────────────────────────────────────
function buildReply(q: string): Partial<Msg> {
  const s = q.toLowerCase();
  if (
    s.includes("investigate") ||
    s.includes("malware") ||
    s.includes("ransomware") ||
    s.includes("phishing") ||
    s.includes("suspicious") ||
    s.includes("logs") ||
    s.includes("incident") ||
    s.includes("report") ||
    s.includes("mitre") ||
    s.includes("ioc") ||
    s.includes("cobalt")
  ) {
    return { card: seedCard };
  }
  if (s.includes("t1059"))
    return {
      text: `**MITRE T1059 — Command & Scripting Interpreter** is an *Execution* technique where adversaries abuse interpreters such as **PowerShell**, **cmd**, **bash**, and **Python** to run code on target systems.\n\n- Sub-techniques you should watch: T1059.001 (PowerShell), T1059.003 (Windows Command Shell), T1059.006 (Python)\n- Detection: Sigma rule set \`proc_creation_win_susp_powershell_*\`, EDR command-line telemetry, and script-block logging (event **4104**)\n- Mitigation: constrained language mode, AppLocker/WDAC, ScriptBlockLogging, JEA`,
    };
  return {
    text: `I've correlated your query across telemetry, MITRE ATT&CK, and CISA KEV. Would you like me to open an investigation, run a threat hunt, or generate a briefing?`,
  };
}
