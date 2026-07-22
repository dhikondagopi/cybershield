import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SevBadge } from "@/components/ui/panel";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, FileText, UploadCloud, Search, Network, Download, Send, Bot, 
  MessageSquare, Layers, Fingerprint, ShieldAlert, FileType, BookOpen, Activity
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";

export const Route = createFileRoute("/threat-intelligence-ai")({
  component: ThreatIntelligenceAIPage,
});

const TABS = ["Dashboard", "RAG Knowledge Base", "IOC Extractor", "Knowledge Graph", "AI Report Generator"] as const;
type Tab = typeof TABS[number];

const MOCK_CHAT = [
  { id: 1, role: "user", text: "Explain CVE-2025-0123" },
  { id: 2, role: "assistant", text: "CVE-2025-0123 is a critical unauthenticated Remote Code Execution (RCE) vulnerability in the Windows Print Spooler service. Threat actors (including APT29) are actively exploiting this.", sources: ["CERT-Advisory-04.pdf (98% confidence)", "Microsoft-Patch-Notes.html (95% confidence)"] },
  { id: 3, role: "user", text: "List the affected software" },
  { id: 4, role: "assistant", text: "Based on the uploaded knowledge base, the following software versions are affected:\n- Windows Server 2022\n- Windows Server 2019\n- Windows 11 (22H2, 23H2)\n- Windows 10 (22H2)", sources: ["NVD-CVE-2025-0123.json (99% confidence)"] }
];

const IOC_LIST = [
  { value: "45.133.1.22", type: "IP Address", threat: "Cobalt Strike C2", confidence: 99 },
  { value: "evil-domain-xyz.com", type: "Domain", threat: "Phishing Campaign", confidence: 94 },
  { value: "8a1b...e5c9", type: "SHA256", threat: "Lazarus Loader", confidence: 100 },
  { value: "T1566.001", type: "MITRE ID", threat: "Spearphishing Attachment", confidence: 88 },
  { value: "HKLM\\Software\\Run", type: "Registry Key", threat: "Persistence Mechanism", confidence: 92 },
  { value: "APT29", type: "Threat Actor", threat: "Cozy Bear", confidence: 95 },
];

function ThreatIntelligenceAIPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Dashboard");

  return (
    <AppShell>
      <div className="flex flex-col gap-6 h-[calc(100vh-5.5rem)] lg:h-[calc(100vh-7rem)] w-full min-w-0">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-gradient flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              Threat Intelligence AI & RAG
            </h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-2xl truncate">
              Upload threat reports, extract IOCs, and chat with your enterprise security knowledge base.
            </p>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-border/50 pb-1 overflow-x-auto custom-scrollbar shrink-0">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition whitespace-nowrap min-w-0 ${
                activeTab === tab
                  ? "bg-primary/10 text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              {activeTab === "Dashboard" && <DashboardTab />}
              {activeTab === "RAG Knowledge Base" && <RAGTab />}
              {activeTab === "IOC Extractor" && <IOCTab />}
              {activeTab === "Knowledge Graph" && <GraphTab />}
              {activeTab === "AI Report Generator" && <ReportsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  );
}

// ============================================================================
// TAB COMPONENTS
// ============================================================================

function DashboardTab() {
  const trendData = Array.from({ length: 30 }).map((_, i) => ({ day: i + 1, attacks: 200 + Math.random() * 500 }));
  const topCve = [
    { cve: "CVE-2025-0123", severity: "Critical", targets: "Windows Print Spooler" },
    { cve: "CVE-2024-3400", severity: "Critical", targets: "Palo Alto PAN-OS" },
    { cve: "CVE-2024-21893", severity: "High", targets: "Ivanti Connect Secure" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
      <Panel className="col-span-1 lg:col-span-2 flex flex-col min-w-0">
        <PanelHeader title="Attack Trends (Last 30 Days)" subtitle="Global active campaigns and exploitation attempts" />
        <div className="flex-1 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(var(--critical))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="oklch(var(--critical))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
              <XAxis dataKey="day" stroke="oklch(0.5 0 0)" fontSize={12} />
              <YAxis stroke="oklch(0.5 0 0)" fontSize={12} />
              <Tooltip contentStyle={{ background: '#111', borderColor: '#333', borderRadius: 8 }} />
              <Area type="monotone" dataKey="attacks" stroke="oklch(var(--critical))" fillOpacity={1} fill="url(#colorAttacks)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel className="flex flex-col min-w-0">
        <PanelHeader title="CISA KEV Tracker" subtitle="Latest Known Exploited Vulnerabilities" />
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {topCve.map((item, i) => (
            <div key={i} className="glass p-3 rounded-lg flex items-center justify-between border-l-2 border-critical">
              <div className="min-w-0 flex-1">
                <div className="font-mono text-sm font-bold text-cyan">{item.cve}</div>
                <div className="text-xs text-muted-foreground truncate">{item.targets}</div>
              </div>
              <SevBadge sev={item.severity} />
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="flex flex-col min-w-0">
        <PanelHeader title="Risk Heatmap" subtitle="Targeted Industries" />
        <div className="flex-1 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'Finance', risk: 95 },
              { name: 'Healthcare', risk: 88 },
              { name: 'Energy', risk: 80 },
              { name: 'Tech', risk: 65 },
              { name: 'Retail', risk: 40 },
            ]} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" stroke="oklch(0.7 0 0)" fontSize={11} width={80} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#111', borderColor: '#333', borderRadius: 8 }} />
              <Bar dataKey="risk" fill="oklch(var(--warn))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel className="col-span-1 lg:col-span-2 flex flex-col min-w-0">
        <PanelHeader title="MITRE ATT&CK Matrix" subtitle="Most common observed techniques" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['T1566 (Phishing)', 'T1059 (Command and Scripting)', 'T1078 (Valid Accounts)', 'T1105 (Ingress Tool Transfer)'].map((t, i) => (
            <div key={i} className="p-3 rounded-xl bg-gradient-to-br from-neon/10 to-primary/5 border border-primary/20 hover:border-primary/50 transition cursor-pointer">
              <ShieldAlert className="h-5 w-5 text-neon mb-2" />
              <div className="text-xs font-semibold">{t}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function RAGTab() {
  const [chat, setChat] = useState(MOCK_CHAT);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setChat([...chat, { id: Date.now(), role: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setChat(prev => [...prev, { id: Date.now() + 1, role: "assistant", text: "Simulated response based on RAG knowledge base. The vector search identified several matching context chunks.", sources: ["Simulated-Intel.json (91% confidence)"] }]);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full pb-6">
      <Panel className="lg:col-span-1 flex flex-col min-w-0">
        <PanelHeader title="Knowledge Base" subtitle="Upload unstructured TI data" />
        <div className="border-2 border-dashed border-border/50 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 transition cursor-pointer bg-white/5">
          <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-sm font-semibold">Drop PDF, JSON, CSV, TXT</p>
          <p className="text-xs text-muted-foreground mt-1">Files are chunked & embedded automatically</p>
        </div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-6 mb-3">Indexed Documents (Vectors)</h4>
        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
          {['Mandiant-APT29-Report.pdf', 'CISA-Advisory-2025.docx', 'IOC-List-Q1.csv', 'MITRE-Enterprise-v14.json'].map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg glass text-xs">
              <div className="flex items-center gap-2 truncate min-w-0">
                <FileType className="h-4 w-4 text-cyan shrink-0" />
                <span className="truncate">{doc}</span>
              </div>
              <span className="text-[10px] text-success shrink-0 font-mono">1.2M Vectors</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="lg:col-span-2 flex flex-col min-w-0 h-full max-h-[80vh]">
        <PanelHeader title="AI Chat Interface" subtitle="Query your embedded threat intelligence" />
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-black/20 rounded-xl border border-border/30 mb-4">
          {chat.map(msg => (
            <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`h-8 w-8 shrink-0 rounded-full grid place-items-center ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-neon/20 text-neon'}`}>
                {msg.role === 'user' ? <MessageSquare className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className={`p-4 rounded-xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary/10 border border-primary/20' : 'glass border-border/50'}`}>
                  {msg.text}
                </div>
                {msg.sources && (
                  <div className="mt-2 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Sources:</span>
                    {msg.sources.map((src, i) => (
                      <div key={i} className="text-xs flex items-center gap-1 text-cyan/80"><BookOpen className="h-3 w-3" /> {src}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="relative shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about CVEs, threat actors, or IOCs..."
            className="w-full h-12 pl-4 pr-12 rounded-xl glass border-border focus:outline-none focus:border-primary/50 text-sm"
          />
          <button type="submit" className="absolute right-2 top-2 h-8 w-8 grid place-items-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </Panel>
    </div>
  );
}

function IOCTab() {
  return (
    <Panel className="flex flex-col min-w-0 h-full max-h-[80vh] pb-6">
      <PanelHeader title="Auto-Extracted IOCs" subtitle="Detected entities from uploaded knowledge base" right={
        <div className="flex gap-2">
          <button className="h-8 px-3 rounded text-xs bg-white/5 hover:bg-white/10 transition">Export CSV</button>
          <button className="h-8 px-3 rounded text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition">Push to Firewall</button>
        </div>
      } />
      <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-background/80 backdrop-blur z-10">
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="pb-2 font-medium px-4">Indicator Value</th>
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Associated Threat</th>
              <th className="pb-2 font-medium">AI Confidence</th>
            </tr>
          </thead>
          <tbody>
            {IOC_LIST.map((ioc, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-white/5 transition">
                <td className="py-3 px-4 font-mono text-cyan truncate min-w-[200px]">{ioc.value}</td>
                <td className="py-3 whitespace-nowrap"><span className="px-2 py-0.5 rounded bg-white/10 text-xs">{ioc.type}</span></td>
                <td className="py-3 truncate min-w-[200px]">{ioc.threat}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-success" style={{ width: `${ioc.confidence}%` }} />
                    </div>
                    <span className="text-xs font-mono">{ioc.confidence}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function GraphTab() {
  return (
    <Panel className="flex flex-col min-w-0 h-[600px] pb-6">
      <PanelHeader title="Interactive Knowledge Graph" subtitle="Visual relationships between Threat Actors, Malware, and IOCs" />
      <div className="flex-1 relative bg-black/40 rounded-xl border border-border/50 overflow-hidden flex items-center justify-center">
        {/* Custom SVG Graph (Since we can't use node-gyp native Canvas libraries reliably in this env) */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at center, oklch(1 0 0 / 0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(var(--primary))" stopOpacity={0.5} />
              <stop offset="100%" stopColor="oklch(var(--cyan))" stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <path d="M 50% 30% L 30% 60%" stroke="url(#linkGrad)" strokeWidth="2" />
          <path d="M 50% 30% L 70% 60%" stroke="url(#linkGrad)" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 30% 60% L 50% 80%" stroke="url(#linkGrad)" strokeWidth="2" />
          <path d="M 70% 60% L 50% 80%" stroke="url(#linkGrad)" strokeWidth="2" />
          <path d="M 70% 60% L 85% 40%" stroke="url(#linkGrad)" strokeWidth="2" />
        </svg>

        {/* Nodes */}
        <GraphNode top="30%" left="50%" label="APT29 (Actor)" icon={Fingerprint} color="text-critical" bg="bg-critical/20" border="border-critical/50" />
        <GraphNode top="60%" left="30%" label="CVE-2025-0123" icon={ShieldAlert} color="text-warn" bg="bg-warn/20" border="border-warn/50" />
        <GraphNode top="60%" left="70%" label="Cobalt Strike (Malware)" icon={Layers} color="text-neon" bg="bg-neon/20" border="border-neon/50" />
        <GraphNode top="80%" left="50%" label="45.133.1.22 (IP)" icon={Network} color="text-cyan" bg="bg-cyan/20" border="border-cyan/50" />
        <GraphNode top="40%" left="85%" label="Phishing Campaign" icon={MessageSquare} color="text-primary" bg="bg-primary/20" border="border-primary/50" />
      </div>
    </Panel>
  );
}

function GraphNode({ top, left, label, icon: Icon, color, bg, border }: any) {
  return (
    <motion.div 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group"
      style={{ top, left }}
    >
      <div className={`h-12 w-12 rounded-full grid place-items-center ${bg} border-2 ${border} shadow-lg backdrop-blur-md`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div className="mt-2 px-2 py-1 bg-black/60 rounded text-[10px] font-bold tracking-wider uppercase text-white whitespace-nowrap border border-white/10 group-hover:border-white/30 transition">
        {label}
      </div>
    </motion.div>
  );
}

function ReportsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
      {[
        { title: "Executive Threat Summary", desc: "High-level risk overview for C-suite.", icon: FileText },
        { title: "Technical IOC Report", desc: "Detailed breakdown of observables and signatures.", icon: Activity },
        { title: "MITRE ATT&CK Mapping", desc: "TTPs aligned with defensive posture.", icon: Brain },
        { title: "Risk Assessment", desc: "Vulnerability analysis and remediation steps.", icon: ShieldAlert },
      ].map((rep, i) => (
        <Panel key={i} className="flex flex-col items-start min-w-0 group hover:border-primary/50 transition cursor-pointer">
          <div className="h-10 w-10 rounded-lg bg-primary/10 grid place-items-center mb-4 group-hover:scale-110 transition">
            <rep.icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-bold text-sm mb-1">{rep.title}</h3>
          <p className="text-xs text-muted-foreground flex-1 mb-4">{rep.desc}</p>
          <button className="text-xs font-semibold text-cyan flex items-center gap-1 group-hover:underline">
            <Download className="h-3 w-3" /> Generate PDF
          </button>
        </Panel>
      ))}
    </div>
  );
}
